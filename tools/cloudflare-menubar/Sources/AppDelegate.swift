import AppKit
import SwiftUI

final class AppDelegate: NSObject, NSApplicationDelegate {
    private var stores: [UsageStore] = []
    private var status: StatusController!
    private var settingsWindow: NSWindow?
    private var settingsModel: SettingsModel?
    private var ticker: Timer?

    func applicationDidFinishLaunching(_ notification: Notification) {
        let env = ProcessInfo.processInfo.environment

        // Optional headless setup: `CF_MENUBAR_STORE_ENV=1` plus env credentials writes
        // them to the Keychain once, from inside the app (so no Keychain prompt later).
        // CF_MENUBAR_ACCOUNTS="id:Label,id2:Label2" also seeds the monitored accounts.
        if env["CF_MENUBAR_STORE_ENV"] == "1", let creds = Credentials.load(), creds.isComplete {
            Credentials.store(accountID: creds.accountID, authMode: creds.authMode, secret: creds.secret, email: creds.email)
            if let list = env["CF_MENUBAR_ACCOUNTS"], !list.isEmpty {
                Prefs.accounts = Prefs.accounts(fromEnv: list)
            }
        }

        Prefs.migrateAccountsIfNeeded()

        status = StatusController(stores: storesForCurrentAccounts())
        status.onSettings = { [weak self] in self?.showSettings() }
        status.onQuit = { NSApp.terminate(nil) }

        refreshAll()

        // A slow heartbeat keeps the interval live-editable from the menu without
        // rescheduling anything; refreshIfStale() decides whether to hit the API.
        ticker = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { [weak self] _ in
            self?.stores.forEach { $0.refreshIfStale(TimeInterval(Prefs.refreshSeconds)) }
        }
        NSWorkspace.shared.notificationCenter.addObserver(
            self,
            selector: #selector(didWake),
            name: NSWorkspace.didWakeNotification,
            object: nil
        )

        if Credentials.load() == nil || Prefs.accounts.isEmpty {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
                self?.showSettings()
            }
        }
    }

    /// Builds one store per configured account, wired to the shared status refresh.
    private func storesForCurrentAccounts() -> [UsageStore] {
        stores = Prefs.accounts.map { UsageStore(account: $0) }
        // OpenCode is a single local source; don't query it once per account.
        for (index, store) in stores.enumerated() {
            store.includeOpenCode = index == 0
        }
        return stores
    }

    private func refreshAll() {
        stores.forEach { $0.refresh() }
    }

    @objc private func didWake() {
        refreshAll()
    }

    private func showSettings() {
        if settingsWindow == nil {
            let model = SettingsModel()
            model.onSave = { [weak self] in
                guard let self else { return }
                self.settingsWindow?.close()
                self.status.attach(stores: self.storesForCurrentAccounts())
                self.refreshAll()
            }
            let hosting = NSHostingController(rootView: SettingsView(model: model))
            let window = NSWindow(contentViewController: hosting)
            window.title = "Cloudflare Usage Settings"
            window.styleMask = [.titled, .closable]
            window.isReleasedWhenClosed = false
            window.center()
            settingsWindow = window
            settingsModel = model
        } else {
            settingsModel?.load()
        }

        NSApp.activate(ignoringOtherApps: true)
        settingsWindow?.makeKeyAndOrderFront(nil)
    }
}
