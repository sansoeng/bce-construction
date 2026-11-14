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
            var warning: String?
            var zones = self.zoneCache
            if zones.isEmpty || self.zoneCacheDate.map({ Date().timeIntervalSince($0) > 3600 }) == true {
                do {
                    zones = try await self.api.zones(for: creds)
                    self.zoneCache = zones
                    self.zoneCacheDate = Date()
                } catch {
                    warning = "Site analytics unavailable — \(error.localizedDescription)"
                }
            }

            do {
                var fresh = try await self.api.usage(for: creds, zones: zones)
                if let warning { fresh.warnings.insert(warning, at: 0) }
                let snapshot = fresh
                await MainActor.run {
                    self.snapshot = snapshot
                    self.lastError = nil
                    self.isLoading = false
                    self.inFlight = false
                    self.notify()
                }
            } catch {
                await MainActor.run {
                    self.lastError = error.localizedDescription
                    self.isLoading = false
                    self.inFlight = false
                    self.notify()
                }
            }
        }
    }

    private func notify() {
        DispatchQueue.main.async { [weak self] in self?.onChange?() }
    }
}
