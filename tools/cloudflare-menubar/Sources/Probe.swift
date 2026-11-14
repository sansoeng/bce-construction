import Foundation

/// Headless check used by the installer and for debugging:
/// `CFMenuBar --probe` prints what the menu bar would show.
enum Probe {
    static func run() -> Never {
        guard let creds = Credentials.load(), creds.isComplete else {
            FileHandle.standardError.write(Data(
                "No credentials.\nSet CF_MENUBAR_ACCOUNT and CF_MENUBAR_TOKEN (or CF_MENUBAR_KEY + CF_MENUBAR_EMAIL),\nor save them in the app's Settings first.\n".utf8
            ))
            exit(2)
        }

        let api = CloudflareAPI()
        let semaphore = DispatchSemaphore(value: 0)
        var outcome: Result<UsageSnapshot, Error>?

        Task {
            do {
                var zones: [ZoneInfo] = []
                var warning: String?
                do {
                    zones = try await api.zones(for: creds)
                } catch {
                    warning = "Site analytics unavailable — \(error.localizedDescription)"
                }
                var snapshot = try await api.usage(for: creds, zones: zones)
                if let warning { snapshot.warnings.insert(warning, at: 0) }
                let openCode = await OpenCodeProbe.load(enabled: true, customPath: Prefs.openCodePath)
                snapshot.openCode = openCode.usage
                snapshot.openCodeError = openCode.error
                snapshot.openCodeLimits = openCode.limits
                snapshot.openCodeLimitsError = openCode.limitsError
                outcome = .success(snapshot)
            } catch {
                outcome = .failure(error)
            }
            semaphore.signal()
        }

        semaphore.wait()

        switch outcome {
        case .success(let snapshot):
            print("Cloudflare usage — \(snapshot.day) (UTC)")
            print(String(repeating: "─", count: 46))
            print("Workers      \(Fmt.grouped(snapshot.workerRequests)) / \(Fmt.grouped(Prefs.workerLimit))  (\(Fmt.percent(snapshot.workerFraction)))  · daily")
            for script in snapshot.scripts {
                print("  · \(script.name)  \(Fmt.grouped(script.requests)) req\(script.errors > 0 ? "  \(Fmt.grouped(script.errors)) err" : "")")
            }
            print("D1 reads     \(Fmt.grouped(snapshot.d1RowsRead)) / \(Fmt.grouped(Prefs.d1ReadLimit))  (\(Fmt.percent(snapshot.d1ReadFraction)))  · daily")
            print("D1 writes    \(Fmt.grouped(snapshot.d1RowsWritten)) / \(Fmt.grouped(Prefs.d1WriteLimit))  (\(Fmt.percent(snapshot.d1WriteFraction)))  · daily")
            print("Workers AI   \(Fmt.decimal(snapshot.aiNeurons, digits: 2)) / \(Fmt.grouped(Prefs.aiNeuronLimit)) neurons  (\(Fmt.percent(snapshot.aiFraction)))  · daily")
            print("R2 storage   \(Fmt.bytes(snapshot.r2StorageBytes)) / \(Fmt.bytes(Prefs.r2StorageLimit))  (\(Fmt.percent(snapshot.r2StorageFraction)))  · monthly")
            print("R2 Class A   \(Fmt.grouped(snapshot.r2ClassA)) / \(Fmt.grouped(Prefs.r2ClassALimit))  (\(Fmt.percent(snapshot.r2ClassAFraction)))  · monthly")
            print("R2 Class B   \(Fmt.grouped(snapshot.r2ClassB)) / \(Fmt.grouped(Prefs.r2ClassBLimit))  (\(Fmt.percent(snapshot.r2ClassBFraction)))  · monthly")
            print("Sites        \(Fmt.grouped(snapshot.zoneRequests)) req · \(Fmt.bytes(snapshot.zoneBytes)) · \(Fmt.grouped(snapshot.zoneThreats)) threats  · today")
            for zone in snapshot.zones {
                print("  · \(zone.name)  \(Fmt.grouped(zone.requests)) req · \(Fmt.bytes(zone.bytes))")
            }
            print(String(repeating: "─", count: 46))
            if let usage = snapshot.openCode {
                print("OpenCode     \(Fmt.grouped(usage.totalTokens)) tokens today · \(Fmt.grouped(usage.steps)) steps · \(Fmt.grouped(usage.sessions)) sessions")
                print("  input \(Fmt.grouped(usage.tokensInput)) · output \(Fmt.grouped(usage.tokensOutput)) · cache read \(Fmt.grouped(usage.cacheRead))")
                print("  last 30 days \(Fmt.compact(usage.monthTokens)) tokens\(usage.monthCost > 0 ? String(format: " · $%.2f", usage.monthCost) : "")")
            } else if let error = snapshot.openCodeError {
                print("OpenCode     unavailable — \(error)")
            }
            if let limits = snapshot.openCodeLimits {
                print("  monthly \(Fmt.percent(limits.monthly.fraction))  resets \(Probe.dateTime(limits.monthly.resetsAt))")
                print("  weekly  \(Fmt.percent(limits.weekly.fraction))  resets \(Probe.dayTime(limits.weekly.resetsAt))")
                print("  5-hour  \(Fmt.percent(limits.rolling.fraction))  resets \(Probe.clock(limits.rolling.resetsAt))")
            } else if let error = snapshot.openCodeLimitsError {
                print("  limits  unavailable — \(error)")
            }
            if !snapshot.warnings.isEmpty {
                print(String(repeating: "─", count: 46))
                for warning in snapshot.warnings { print("⚠︎  \(warning)") }
            }
            exit(0)
        case .failure(let error):
            FileHandle.standardError.write(Data("Probe failed: \(error.localizedDescription)\n".utf8))
            exit(1)
        case .none:
            FileHandle.standardError.write(Data("Probe failed: no result.\n".utf8))
            exit(1)
        }
    }

    private static func clock(_ date: Date?) -> String {
        guard let date else { return "—" }
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: date)
    }

    private static func dayTime(_ date: Date?) -> String {
        guard let date else { return "—" }
        let formatter = DateFormatter()
        formatter.dateFormat = "EEE HH:mm"
        return formatter.string(from: date)
    }

    private static func dateTime(_ date: Date?) -> String {
        guard let date else { return "—" }
        let formatter = DateFormatter()
        formatter.dateFormat = "d MMM HH:mm"
        return formatter.string(from: date)
    }
}
