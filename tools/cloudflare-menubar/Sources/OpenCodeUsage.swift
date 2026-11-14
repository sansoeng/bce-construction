import Foundation

/// Today's local OpenCode usage, read from `opencode stats --json`.
/// OpenCode has no free-tier quota — this is usage, not an allowance.
struct OpenCodeUsage {
    var tokensInput: Double = 0
    var tokensOutput: Double = 0
    var tokensReasoning: Double = 0
    var cacheRead: Double = 0
    var cost: Double = 0
    var sessions: Double = 0
    var steps: Double = 0
    var monthTokens: Double = 0
    var monthCost: Double = 0
    var fetchedAt = Date()

    /// Fresh tokens: what the model asked for and produced, excluding cache reads.
    var totalTokens: Double { tokensInput + tokensOutput }
}

/// One OpenCode Go allowance window (5-hour, weekly or monthly).
struct OpenCodeWindow {
    /// Share of the allowance already used, 0–100.
    var percent: Double
    var status: String
    var resetsAt: Date?

    var fraction: Double { percent / 100 }
}

/// OpenCode Go enforces three windows: 5-hour (20% of monthly), weekly (50%)
/// and monthly (100%). The API returns the used share, not dollars.
struct OpenCodeLimits {
    var rolling: OpenCodeWindow
    var weekly: OpenCodeWindow
    var monthly: OpenCodeWindow
    var fetchedAt = Date()

    /// The headline figure is the monthly window — the top-level allowance.
    /// Weekly (50%) and 5-hour (20%) are sub-windows of it.
    var headlineFraction: Double { monthly.fraction }
}

struct OpenCodeResult {
    var usage: OpenCodeUsage?
    var limits: OpenCodeLimits?
    var error: String?
    var limitsError: String?
}

enum OpenCodeProbe {
    /// Runs the CLI off the main thread. Never throws: a missing or broken CLI
    /// becomes an error string so the rest of the menu keeps working.
    static func load(enabled: Bool, customPath: String) async -> OpenCodeResult {
        guard enabled else { return OpenCodeResult() }
        guard let path = detectPath(custom: customPath) else {
            return OpenCodeResult(error: "OpenCode CLI not found. Set its path in Settings.")
        }

        return await withCheckedContinuation { continuation in
            DispatchQueue.global(qos: .utility).async {
                do {
                    let todayJSON = try runStats(path, days: 1)
                    var usage = parseStats(todayJSON)
                    if let monthJSON = try? runStats(path, days: 30) {
                        let month = parseStats(monthJSON)
                        usage.monthTokens = month.totalTokens
                        usage.monthCost = month.cost
                    }

                    var limits: OpenCodeLimits?
                    var limitsError: String?
                    do {
                        limits = try fetchLimits(path)
                    } catch {
                        limitsError = error.localizedDescription
                    }

                    continuation.resume(returning: OpenCodeResult(
                        usage: usage,
                        limits: limits,
                        error: nil,
                        limitsError: limitsError
                    ))
                } catch {
                    continuation.resume(returning: OpenCodeResult(
                        usage: nil,
                        limits: nil,
                        error: error.localizedDescription,
                        limitsError: nil
                    ))
                }
            }
        }
    }

    /// Finds the OpenCode binary without relying on the GUI app's minimal PATH.
    static func detectPath(custom: String = "") -> String? {
        let fm = FileManager.default
        let custom = custom.trimmingCharacters(in: .whitespacesAndNewlines)
        if !custom.isEmpty {
            let expanded = (custom as NSString).expandingTildeInPath
            if fm.isExecutableFile(atPath: expanded) { return expanded }
        }

        let home = fm.homeDirectoryForCurrentUser.path
        var candidates = [
            "\(home)/.opencode/bin/opencode",
            "/opt/homebrew/bin/opencode",
            "/usr/local/bin/opencode",
            "\(home)/.local/bin/opencode",
        ]
        if let path = ProcessInfo.processInfo.environment["PATH"] {
            candidates.append(contentsOf: path.split(separator: ":").map { "\($0)/opencode" })
        }
        return candidates.first { fm.isExecutableFile(atPath: $0) }
    }

    // MARK: - OpenCode Go usage API

    /// `GET https://opencode.ai/zen/go/v1/usage` with the key OpenCode already
    /// stores. Returns percentages and reset times only.
    private static func fetchLimits(_ path: String) throws -> OpenCodeLimits {
        let key = try exportKey(path)

        var request = URLRequest(url: URL(string: "https://opencode.ai/zen/go/v1/usage")!)
        request.setValue("Bearer \(key)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.timeoutInterval = 15

        let semaphore = DispatchSemaphore(value: 0)
        var outcome: Result<OpenCodeLimits, Error>?

        URLSession.shared.dataTask(with: request) { data, response, error in
            defer { semaphore.signal() }
            if let error {
                outcome = .failure(error)
                return
            }
            guard let http = response as? HTTPURLResponse else {
                outcome = .failure(APIError(message: "OpenCode usage endpoint returned no HTTP response."))
                return
            }
            guard (200..<300).contains(http.statusCode) else {
                outcome = .failure(APIError(message: "OpenCode usage endpoint returned HTTP \(http.statusCode)."))
                return
            }
            guard let data,
                  let object = try? JSONSerialization.jsonObject(with: data),
                  let json = object as? [String: Any],
                  let usage = json["usage"] as? [String: Any]
            else {
                outcome = .failure(APIError(message: "OpenCode usage endpoint returned an unexpected response."))
                return
            }
            outcome = .success(parseLimits(usage))
        }.resume()

        semaphore.wait()
        guard let outcome else {
            throw APIError(message: "OpenCode usage request did not complete.")
        }
        return try outcome.get()
    }

    /// `opencode auth export` is the supported way to read the stored key.
    /// The key is only used for the request above and never logged.
    private static func exportKey(_ path: String) throws -> String {
        let json = try runJSON(path, ["auth", "export"])
        guard let items = json as? [[String: Any]] else {
            throw APIError(message: "Could not read OpenCode credentials.")
        }
        for item in items where (item["integrationID"] as? String) == "opencode-go" {
            if let active = item["active"] as? Bool, !active { continue }
            if let value = item["value"] as? [String: Any],
               let key = value["key"] as? String,
               !key.isEmpty {
                return key
            }
        }
        throw APIError(message: "OpenCode Go is not connected. Connect it in OpenCode to see usage percentages.")
    }

    private static func parseLimits(_ usage: [String: Any]) -> OpenCodeLimits {
        func window(_ name: String) -> OpenCodeWindow {
            let dict = usage[name] as? [String: Any] ?? [:]
            return OpenCodeWindow(
                percent: num(dict["percent"]),
                status: dict["status"] as? String ?? "ok",
                resetsAt: parseDate(dict["resetsAt"] as? String)
            )
        }
        return OpenCodeLimits(
            rolling: window("rolling"),
            weekly: window("weekly"),
            monthly: window("monthly")
        )
    }

    private static func parseDate(_ string: String?) -> Date? {
        guard let string else { return nil }
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        if let date = formatter.date(from: string) { return date }
        formatter.formatOptions = [.withInternetDateTime]
        return formatter.date(from: string)
    }

    // MARK: - CLI

    private static func runStats(_ path: String, days: Int) throws -> [String: Any] {
        let json = try runJSON(path, ["stats", "--json", "--cost", "--days", String(days)])
        guard let dict = json as? [String: Any] else {
            throw APIError(message: "opencode stats returned an unexpected response.")
        }
        return dict
    }

    private static func runJSON(_ path: String, _ arguments: [String]) throws -> Any {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: path)
        process.arguments = arguments
        process.currentDirectoryURL = FileManager.default.homeDirectoryForCurrentUser
        var environment = ProcessInfo.processInfo.environment
        environment["NO_COLOR"] = "1"
        environment["TERM"] = "dumb"
        process.environment = environment

        let stdout = Pipe()
        let stderr = Pipe()
        process.standardOutput = stdout
        process.standardError = stderr

        do {
            try process.run()
        } catch {
            throw APIError(message: "Could not run opencode: \(error.localizedDescription)")
        }

        let deadline = Date().addingTimeInterval(20)
        while process.isRunning && Date() < deadline {
            Thread.sleep(forTimeInterval: 0.05)
        }
        if process.isRunning {
            process.terminate()
            throw APIError(message: "opencode \(arguments.first ?? "") timed out after 20 seconds.")
        }

        let data = stdout.fileHandleForReading.readDataToEndOfFile()
        guard process.terminationStatus == 0 else {
            let errorData = stderr.fileHandleForReading.readDataToEndOfFile()
            let message = String(decoding: errorData, as: UTF8.self)
                .trimmingCharacters(in: .whitespacesAndNewlines)
            throw APIError(message: message.isEmpty
                ? "opencode \(arguments.first ?? "") exited with status \(process.terminationStatus)."
                : message)
        }
        guard let json = try? JSONSerialization.jsonObject(with: data) else {
            throw APIError(message: "opencode \(arguments.first ?? "") returned unreadable JSON.")
        }
        return json
    }

    private static func parseStats(_ json: [String: Any]) -> OpenCodeUsage {
        var usage = OpenCodeUsage()
        let tokens = json["tokens"] as? [String: Any] ?? [:]
        usage.tokensInput = num(tokens["input"])
        usage.tokensOutput = num(tokens["output"])
        usage.tokensReasoning = num(tokens["reasoning"])
        usage.cacheRead = num((tokens["cache"] as? [String: Any])?["read"])
        usage.cost = num(json["cost"])
        usage.sessions = num(json["sessions"])
        usage.steps = num(json["steps"])
        return usage
    }

    private static func num(_ value: Any?) -> Double {
        if let d = value as? Double { return d }
        if let i = value as? Int { return Double(i) }
        if let n = value as? NSNumber { return n.doubleValue }
        if let s = value as? String, let d = Double(s) { return d }
        return 0
    }
}
