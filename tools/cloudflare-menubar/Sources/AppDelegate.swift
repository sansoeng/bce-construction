import AppKit
import SwiftUI

final class AppDelegate: NSObject, NSApplicationDelegate {
    private let store = UsageStore()
    private var status: StatusController!
    private var settingsWindow: NSWindow?
    private var settingsModel: SettingsModel?
    private var ticker: Timer?

    func applicationDidFinishLaunching(_ notification: Notification) {
        // Optional headless setup: `CF_MENUBAR_STORE_ENV=1` plus env credentials writes
        // them to the Keychain once, from inside the app (so no Keychain prompt later).
        if ProcessInfo.processInfo.environment["CF_MENUBAR_STORE_ENV"] == "1",
           let creds = Credentials.load(), creds.isComplete {
            Credentials.store(accountID: creds.accountID, authMode: creds.authMode, secret: creds.secret, email: creds.email)
        }

        status = StatusController(store: store)
        status.onSettings = { [weak self] in self?.showSettings() }
        status.onQuit = { NSApp.terminate(nil) }

        store.refresh()

        // A slow heartbeat keeps the interval live-editable from the menu without
        // rescheduling anything; refreshIfStale() decides whether to hit the API.
        ticker = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { [weak self] _ in
            self?.store.refreshIfStale(TimeInterval(Prefs.refreshSeconds))
        }
        NSWorkspace.shared.notificationCenter.addObserver(
            self,
            selector: #selector(didWake),
            name: NSWorkspace.didWakeNotification,
            object: nil
        )

        if Credentials.load() == nil {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
                self?.showSettings()
            }
        }
    }

    @objc private func didWake() {
        store.refresh()
    }

    private func showSettings() {
        if settingsWindow == nil {
            let model = SettingsModel()
            model.onSave = { [weak self] in
                guard let self else { return }
                self.settingsWindow?.close()
                self.store.refresh()
            }
            let hosting = NSHostingController(rootView: SettingsView(model: model))
            let window = NSWindow(contentViewController: hosting)
            window.title = "Cloudflare Usage Settings"
            window.styleMask = [.titled, .closable]
            window.isReleasedWhenClosed = false
            window.center()
            window.setFrameAutosaveName("CloudflareUsageSettings")
            settingsWindow = window
            settingsModel = model
        } else {
            settingsModel?.load()
        }

        NSApp.activate(ignoringOtherApps: true)
        settingsWindow?.makeKeyAndOrderFront(nil)
    }
}
