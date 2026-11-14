import Foundation

/// Fetches usage and keeps the last good snapshot around so a transient
/// API failure doesn't blank the menu bar.
final class UsageStore {
    private(set) var snapshot: UsageSnapshot?
    private(set) var lastError: String?
    private(set) var isLoading = false
    private(set) var lastAttempt: Date?

    var onChange: (() -> Void)?

    private let api = CloudflareAPI()
    private var zoneCache: [ZoneInfo] = []
    private var zoneCacheDate: Date?
    private var inFlight = false

    func refreshIfStale(_ maxAge: TimeInterval) {
        if let lastAttempt, Date().timeIntervalSince(lastAttempt) < maxAge { return }
        refresh()
    }

    func refresh() {
        guard !inFlight else { return }
        guard let creds = Credentials.load(), creds.isComplete else {
            snapshot = nil
            lastError = "Add your Cloudflare account ID and API token in Settings."
            lastAttempt = Date()
            onChange?()
            return
        }

        inFlight = true
        isLoading = true
        lastAttempt = Date()
        notify()

        Task { [weak self] in
            guard let self else { return }
            var zoneWarning: String?
            var zones = self.zoneCache
            if zones.isEmpty || self.zoneCacheDate.map({ Date().timeIntervalSince($0) > 3600 }) == true {
                do {
                    zones = try await self.api.zones(for: creds)
                    self.zoneCache = zones
                    self.zoneCacheDate = Date()
                } catch {
                    zoneWarning = "Site analytics unavailable — \(error.localizedDescription)"
                }
            }

            // OpenCode is independent: a broken CLI must not hide Cloudflare usage.
            async let openCodeTask = OpenCodeProbe.load(
                enabled: Prefs.openCodeEnabled,
                customPath: Prefs.openCodePath
            )

            var cloudflareError: String?
            var fresh: UsageSnapshot?
            do {
                fresh = try await self.api.usage(for: creds, zones: zones)
            } catch {
                cloudflareError = error.localizedDescription
            }

            let cloudflareSnapshot = fresh
            let warning = zoneWarning
            let failure = cloudflareError

            // Publish Cloudflare numbers first so a slow CLI never delays them.
            await MainActor.run {
                var merged = cloudflareSnapshot ?? self.snapshot ?? UsageSnapshot()
                if merged.day.isEmpty { merged.day = CloudflareAPI.todayUTC() }
                if cloudflareSnapshot != nil, let warning { merged.warnings.insert(warning, at: 0) }
                merged.openCode = self.snapshot?.openCode
                merged.openCodeError = self.snapshot?.openCodeError
                self.snapshot = merged
                self.lastError = failure
                self.notify()
            }

            let openCode = await openCodeTask

            await MainActor.run {
                guard var merged = self.snapshot else { return }
                merged.openCode = openCode.usage
                merged.openCodeError = openCode.error
                self.snapshot = merged
                self.isLoading = false
                self.inFlight = false
                self.notify()
            }
        }
    }

    private func notify() {
        DispatchQueue.main.async { [weak self] in self?.onChange?() }
    }
}
