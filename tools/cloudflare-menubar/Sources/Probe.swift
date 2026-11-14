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
            print("Workers      \(Fmt.grouped(snapshot.workerRequests)) / \(Fmt.grouped(Prefs.workerLimit))  (\(Fmt.percent(snapshot.workerFraction)))")
            for script in snapshot.scripts {
                print("  · \(script.name)  \(Fmt.grouped(script.requests)) req\(script.errors > 0 ? "  \(Fmt.grouped(script.errors)) err" : "")")
            }
            print("D1 reads     \(Fmt.grouped(snapshot.d1RowsRead)) / \(Fmt.grouped(Prefs.d1ReadLimit))  (\(Fmt.percent(snapshot.d1ReadFraction)))")
            print("D1 writes    \(Fmt.grouped(snapshot.d1RowsWritten)) / \(Fmt.grouped(Prefs.d1WriteLimit))  (\(Fmt.percent(snapshot.d1WriteFraction)))")
            print("Workers AI   \(Fmt.decimal(snapshot.aiNeurons, digits: 2)) / \(Fmt.grouped(Prefs.aiNeuronLimit)) neurons  (\(Fmt.percent(snapshot.aiFraction)))")
            print("Sites        \(Fmt.grouped(snapshot.zoneRequests)) req · \(Fmt.bytes(snapshot.zoneBytes)) · \(Fmt.grouped(snapshot.zoneThreats)) threats")
            for zone in snapshot.zones {
                print("  · \(zone.name)  \(Fmt.grouped(zone.requests)) req · \(Fmt.bytes(zone.bytes))")
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
}
