import Foundation

/// Headless check used by the installer and for debugging:
/// `CFMenuBar --probe` prints, for every monitored account, what the menu bar would show.
enum Probe {
    static func run() -> Never {
        Prefs.migrateAccountsIfNeeded()

        let env = ProcessInfo.processInfo.environment
        var ids = Prefs.accounts.map(\.id)
        if let only = env["CF_MENUBAR_ACCOUNT"], !only.isEmpty { ids = [only] }
        ids = ids.filter { !$0.trimmingCharacters(in: .whitespaces).isEmpty }

        guard !ids.isEmpty else {
            FileHandle.standardError.write(Data(
                "No accounts configured.\nSet CF_MENUBAR_ACCOUNT (and CF_MENUBAR_TOKEN or CF_MENUBAR_KEY + CF_MENUBAR_EMAIL),\nor save accounts in the app's Settings first.\n".utf8
            ))
            exit(2)
        }

        // OpenCode is local; fetch it once and show it after the Cloudflare blocks.
        let openCode = runSync {
            await OpenCodeProbe.load(enabled: Prefs.openCodeEnabled, customPath: Prefs.openCodePath)
        }

        var successes = 0
        for (index, id) in ids.enumerated() {
            guard let creds = Credentials.load(accountID: id), creds.isComplete else {
                FileHandle.standardError.write(Data("\(label(for: id)): no credentials.\n".utf8))
                continue
            }

            switch runSync({ await fetch(creds) }) {
            case .success(var snapshot):
                let name = label(for: id)
                if index == 0 {
                    snapshot.openCode = openCode.usage
                    snapshot.openCodeError = openCode.error
                    snapshot.openCodeLimits = openCode.limits
                    snapshot.openCodeLimitsError = openCode.limitsError
                }
                printBlock(name, id: id, snapshot: snapshot)
                successes += 1
            case .failure(let error):
                FileHandle.standardError.write(Data("\(label(for: id)) failed: \(error.localizedDescription)\n".utf8))
            }
        }

        if let usage = openCode.usage {
            print(String(repeating: "─", count: 46))
            print("OpenCode     \(Fmt.grouped(usage.totalTokens)) tokens today · \(Fmt.grouped(usage.steps)) steps · \(Fmt.grouped(usage.sessions)) sessions")
            print("  input \(Fmt.grouped(usage.tokensInput)) · output \(Fmt.grouped(usage.tokensOutput)) · cache read \(Fmt.grouped(usage.cacheRead))")
            print("  last 30 days \(Fmt.compact(usage.monthTokens)) tokens\(usage.monthCost > 0 ? String(format: " · $%.2f", usage.monthCost) : "")")
        }
        if let limits = openCode.limits {
            print("  monthly \(Fmt.percent(limits.monthly.fraction))  resets \(dateTime(limits.monthly.resetsAt))")
            print("  weekly  \(Fmt.percent(limits.weekly.fraction))  resets \(dayTime(limits.weekly.resetsAt))")
            print("  5-hour  \(Fmt.percent(limits.rolling.fraction))  resets \(clock(limits.rolling.resetsAt))")
        }

        exit(successes > 0 ? 0 : 1)
    }

    private static func fetch(_ creds: Credentials) async -> Result<UsageSnapshot, Error> {
        let api = CloudflareAPI()
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
            return .success(snapshot)
        } catch {
            return .failure(error)
        }
    }

    private static func runSync<T>(_ work: @escaping () async -> T) -> T {
        let semaphore = DispatchSemaphore(value: 0)
        var result: T?
        Task {
            result = await work()
            semaphore.signal()
        }
        semaphore.wait()
        // The task always assigns before signalling.
        return result!
    }

    private static func label(for id: String) -> String {
        Prefs.accounts.first { $0.id == id }?.shortName ?? String(id.prefix(8))
    }

    private static func printBlock(_ name: String, id: String, snapshot: UsageSnapshot) {
        print("Cloudflare usage — \(name) · \(id) — \(snapshot.day) (UTC)")
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
        if !snapshot.warnings.isEmpty {
            for warning in snapshot.warnings { print("⚠︎  \(warning)") }
        }
        print("")
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
