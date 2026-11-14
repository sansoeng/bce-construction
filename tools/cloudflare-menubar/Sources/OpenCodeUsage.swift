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

struct OpenCodeResult {
    var usage: OpenCodeUsage?
    var error: String?
}

enum OpenCodeProbe {
    /// Runs the CLI off the main thread. Never throws: a missing or broken CLI
    /// becomes an error string so the rest of the menu keeps working.
    static func load(enabled: Bool, customPath: String) async -> OpenCodeResult {
        guard enabled else { return OpenCodeResult(usage: nil, error: nil) }
        guard let path = detectPath(custom: customPath) else {
            return OpenCodeResult(usage: nil, error: "OpenCode CLI not found. Set its path in Settings.")
        }

        return await withCheckedContinuation { continuation in
            DispatchQueue.global(qos: .utility).async {
                do {
                    let todayJSON = try run(path, days: 1)
                    let today = parse(todayJSON)

                    var usage = today
                    if let monthJSON = try? run(path, days: 30) {
                        let month = parse(monthJSON)
                        usage.monthTokens = month.totalTokens
                        usage.monthCost = month.cost
                    }
                    continuation.resume(returning: OpenCodeResult(usage: usage, error: nil))
                } catch {
                    continuation.resume(returning: OpenCodeResult(usage: nil, error: error.localizedDescription))
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

    // MARK: - CLI

    private static func run(_ path: String, days: Int) throws -> [String: Any] {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: path)
        process.arguments = ["stats", "--json", "--cost", "--days", String(days)]
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
            throw APIError(message: "opencode stats timed out after 20 seconds.")
        }

        let data = stdout.fileHandleForReading.readDataToEndOfFile()
        guard process.terminationStatus == 0 else {
            let errorData = stderr.fileHandleForReading.readDataToEndOfFile()
            let message = String(decoding: errorData, as: UTF8.self)
                .trimmingCharacters(in: .whitespacesAndNewlines)
            throw APIError(message: message.isEmpty
                ? "opencode stats exited with status \(process.terminationStatus)."
                : message)
        }
        guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            throw APIError(message: "opencode stats returned unreadable JSON.")
        }
        return json
    }

    private static func parse(_ json: [String: Any]) -> OpenCodeUsage {
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
