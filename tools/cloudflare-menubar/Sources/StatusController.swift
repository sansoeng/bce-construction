import AppKit
import Foundation

/// Owns the menu bar item and builds its menu from the latest snapshot.
final class StatusController: NSObject, NSMenuDelegate {
    private let statusItem: NSStatusItem
    private let store: UsageStore
    private let menu = NSMenu()
    private var menuOpen = false
    private var pendingRebuild = false

    var onSettings: (() -> Void)?
    var onQuit: (() -> Void)?

    private let clock: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "HH:mm"
        return f
    }()

    private let relative: RelativeDateTimeFormatter = {
        let f = RelativeDateTimeFormatter()
        f.unitsStyle = .short
        return f
    }()

    init(store: UsageStore) {
        self.store = store
        self.statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        super.init()

        if let button = statusItem.button {
            let image = NSImage(systemSymbolName: "cloud.fill", accessibilityDescription: "Cloudflare usage")
            image?.isTemplate = true
            button.image = image
            button.imagePosition = .imageLeading
            button.font = .monospacedDigitSystemFont(ofSize: 11, weight: .medium)
            button.title = " …"
            button.toolTip = "Cloudflare usage"
        }

        menu.autoenablesItems = false
        menu.delegate = self
        menu.minimumWidth = 360
        statusItem.menu = menu

        store.onChange = { [weak self] in self?.apply() }
        rebuildMenu()
        updateButton()
    }

    // MARK: - Button

    private func apply() {
        updateButton()
        if menuOpen { pendingRebuild = true } else { rebuildMenu() }
    }

    private func updateButton() {
        guard let button = statusItem.button else { return }
        let title: String
        var color: NSColor?

        if let snapshot = store.snapshot {
            switch Prefs.displayMode {
            case .workers: title = Fmt.compact(snapshot.workerRequests)
            case .sites: title = Fmt.compact(snapshot.zoneRequests)
            case .d1Reads: title = Fmt.compact(snapshot.d1RowsRead)
            case .worstQuota: title = Fmt.percent(snapshot.worstFraction)
            }
            if snapshot.worstFraction >= 0.9 {
                color = .systemRed
            } else if snapshot.worstFraction >= 0.75 {
                color = .systemOrange
            }
            button.toolTip = tooltip(for: snapshot)
        } else {
            title = store.isLoading ? "…" : "—"
            button.toolTip = store.lastError ?? "Cloudflare usage — no data yet"
        }

        if let color {
            let attributes: [NSAttributedString.Key: Any] = [
                .font: NSFont.monospacedDigitSystemFont(ofSize: 11, weight: .semibold),
                .foregroundColor: color,
            ]
            button.attributedTitle = NSAttributedString(string: " " + title, attributes: attributes)
        } else {
            button.attributedTitle = NSAttributedString(
                string: " " + title,
                attributes: [.font: NSFont.monospacedDigitSystemFont(ofSize: 11, weight: .medium)]
            )
        }
    }

    private func tooltip(for snapshot: UsageSnapshot) -> String {
        var lines = ["Cloudflare usage · \(snapshot.day) (UTC day)"]
        lines.append("Workers: \(Fmt.grouped(snapshot.workerRequests)) / \(Fmt.grouped(Prefs.workerLimit)) requests (\(Fmt.percent(snapshot.workerFraction)))")
        lines.append("D1: \(Fmt.compact(snapshot.d1RowsRead)) rows read, \(Fmt.compact(snapshot.d1RowsWritten)) written")
        lines.append("Sites: \(Fmt.compact(snapshot.zoneRequests)) requests · \(Fmt.bytes(snapshot.zoneBytes))")
        lines.append("Updated \(clock.string(from: snapshot.fetchedAt))")
        return lines.joined(separator: "\n")
    }

    // MARK: - Menu

    func menuWillOpen(_ menu: NSMenu) { menuOpen = true }

    func menuDidClose(_ menu: NSMenu) {
        menuOpen = false
        if pendingRebuild {
            pendingRebuild = false
            rebuildMenu()
        }
    }

    func menuNeedsUpdate(_ menu: NSMenu) {
        store.refreshIfStale(60)
        rebuildMenu()
    }

    private func rebuildMenu() {
        pendingRebuild = false
        menu.removeAllItems()

        let header = NSMenuItem()
        header.attributedTitle = NSAttributedString(
            string: "Cloudflare usage",
            attributes: [.font: NSFont.boldSystemFont(ofSize: 13), .foregroundColor: NSColor.labelColor]
        )
        header.isEnabled = false
        menu.addItem(header)

        if let snapshot = store.snapshot {
            let subtitle = NSMenuItem()
            subtitle.attributedTitle = NSAttributedString(
                string: "\(snapshot.day) · UTC day · free-plan limits",
                attributes: [.font: NSFont.systemFont(ofSize: 11), .foregroundColor: NSColor.secondaryLabelColor]
            )
            subtitle.isEnabled = false
            menu.addItem(subtitle)
        }

        menu.addItem(.separator())

        if let snapshot = store.snapshot {
            addUsageRows(snapshot)
        } else {
            let empty = NSMenuItem(title: "Waiting for the first refresh…", action: nil, keyEquivalent: "")
            empty.isEnabled = false
            menu.addItem(empty)
        }

        if let error = store.lastError {
            menu.addItem(.separator())
            let item = NSMenuItem(title: "", action: nil, keyEquivalent: "")
            item.attributedTitle = NSAttributedString(
                string: "⚠︎ " + Self.truncate(error, 90),
                attributes: [.font: NSFont.systemFont(ofSize: 12), .foregroundColor: NSColor.systemRed]
            )
            item.isEnabled = false
            item.toolTip = error
            menu.addItem(item)
        } else if let warning = store.snapshot?.warnings.first {
            menu.addItem(.separator())
            let item = NSMenuItem(title: "", action: nil, keyEquivalent: "")
            item.attributedTitle = NSAttributedString(
                string: "⚠︎ " + Self.truncate(warning, 80),
                attributes: [.font: NSFont.systemFont(ofSize: 12), .foregroundColor: NSColor.systemOrange]
            )
            item.isEnabled = false
            item.toolTip = warning
            menu.addItem(item)
        }

        menu.addItem(.separator())
        addFooterRows()
    }

    private func addUsageRows(_ snapshot: UsageSnapshot) {
        // Workers — click through for per-script breakdown.
        let workers = row(
            label: "Workers requests",
            value: "\(Fmt.grouped(snapshot.workerRequests)) / \(Fmt.grouped(Prefs.workerLimit))  ·  \(Fmt.percent(snapshot.workerFraction))",
            fraction: snapshot.workerFraction
        )
        let scriptMenu = NSMenu()
        if snapshot.scripts.isEmpty {
            let none = NSMenuItem(title: "No Worker activity yet today", action: nil, keyEquivalent: "")
            none.isEnabled = false
            scriptMenu.addItem(none)
        } else {
            for script in snapshot.scripts {
                let errors = script.errors > 0 ? "  ·  \(Fmt.compact(script.errors)) err" : ""
                let item = NSMenuItem(title: "\(script.name)  ·  \(Fmt.compact(script.requests))\(errors)", action: nil, keyEquivalent: "")
                item.isEnabled = false
                scriptMenu.addItem(item)
            }
        }
        workers.submenu = scriptMenu
        workers.isEnabled = true
        menu.addItem(workers)

        // D1.
        menu.addItem(row(
            label: "D1 rows read",
            value: "\(Fmt.grouped(snapshot.d1RowsRead)) / \(Fmt.grouped(Prefs.d1ReadLimit))  ·  \(Fmt.percent(snapshot.d1ReadFraction))",
            fraction: snapshot.d1ReadFraction
        ))
        menu.addItem(row(
            label: "D1 rows written",
            value: "\(Fmt.grouped(snapshot.d1RowsWritten)) / \(Fmt.grouped(Prefs.d1WriteLimit))  ·  \(Fmt.percent(snapshot.d1WriteFraction))",
            fraction: snapshot.d1WriteFraction
        ))
        menu.addItem(row(
            label: "Workers AI neurons",
            value: "\(Fmt.decimal(snapshot.aiNeurons, digits: 2)) / \(Fmt.grouped(Prefs.aiNeuronLimit))  ·  \(Fmt.percent(snapshot.aiFraction))",
            fraction: snapshot.aiFraction
        ))

        // Sites — click through for per-zone traffic.
        let sites = row(
            label: "Site requests",
            value: "\(Fmt.compact(snapshot.zoneRequests))  ·  \(Fmt.bytes(snapshot.zoneBytes))"
        )
        let zoneMenu = NSMenu()
        if snapshot.zones.isEmpty {
            let none = NSMenuItem(title: "No zone analytics available", action: nil, keyEquivalent: "")
            none.isEnabled = false
            zoneMenu.addItem(none)
        } else {
            for zone in snapshot.zones {
                let item = NSMenuItem(
                    title: "\(zone.name)  ·  \(Fmt.compact(zone.requests)) req  ·  \(Fmt.bytes(zone.bytes))",
                    action: #selector(openDashboard),
                    keyEquivalent: ""
                )
                item.target = self
                item.representedObject = zone.name
                zoneMenu.addItem(item)
            }
            zoneMenu.addItem(.separator())
            let more = NSMenuItem(title: "Open analytics dashboards…", action: #selector(openDashboard), keyEquivalent: "")
            more.target = self
            zoneMenu.addItem(more)
        }
        sites.submenu = zoneMenu
        sites.isEnabled = true
        menu.addItem(sites)

        if snapshot.zoneThreats > 0 || snapshot.zonePageViews > 0 || snapshot.zoneCached > 0 {
            menu.addItem(row(
                label: "Threats · cached · views",
                value: "\(Fmt.compact(snapshot.zoneThreats)) · \(Fmt.compact(snapshot.zoneCached)) · \(Fmt.compact(snapshot.zonePageViews))",
                small: true
            ))
        }
    }

    private func addFooterRows() {
        if let snapshot = store.snapshot {
            let updated = row(
                label: "Updated",
                value: "\(clock.string(from: snapshot.fetchedAt)) · \(relative.localizedString(for: snapshot.fetchedAt, relativeTo: Date()))",
                small: true
            )
            updated.toolTip = "Cloudflare analytics can lag a few minutes behind real traffic."
            menu.addItem(updated)
        }

        menu.addItem(action("Refresh now", #selector(refreshNow), key: "r"))

        let displayMenu = NSMenu()
        for mode in DisplayMode.allCases {
            let item = action(mode.label, #selector(setDisplayMode(_:)), key: "")
            item.tag = mode.rawValue
            item.state = Prefs.displayMode == mode ? .on : .off
            displayMenu.addItem(item)
        }
        let display = NSMenuItem(title: "Menu bar shows", action: nil, keyEquivalent: "")
        display.submenu = displayMenu
        display.isEnabled = true
        menu.addItem(display)

        let intervalMenu = NSMenu()
        for (seconds, label) in [(60, "1 minute"), (300, "5 minutes"), (900, "15 minutes"), (3600, "1 hour")] {
            let item = action(label, #selector(setInterval(_:)), key: "")
            item.tag = seconds
            item.state = Prefs.refreshSeconds == seconds ? .on : .off
            intervalMenu.addItem(item)
        }
        let interval = NSMenuItem(title: "Refresh every", action: nil, keyEquivalent: "")
        interval.submenu = intervalMenu
        interval.isEnabled = true
        menu.addItem(interval)

        menu.addItem(.separator())
        menu.addItem(action("Open Cloudflare dashboard", #selector(openDashboard), key: "d"))

        let login = action("Launch at login", #selector(toggleLogin), key: "")
        login.state = LoginItem.isEnabled ? .on : .off
        menu.addItem(login)

        menu.addItem(action("Settings…", #selector(openSettings), key: ","))

        menu.addItem(.separator())
        menu.addItem(action("Quit Cloudflare Usage", #selector(quit), key: "q"))
    }

    // MARK: - Row builders

    private func row(label: String, value: String, fraction: Double? = nil, small: Bool = false) -> NSMenuItem {
        let item = NSMenuItem(title: "", action: nil, keyEquivalent: "")
        item.attributedTitle = Self.rowTitle(label: label, value: value, fraction: fraction, small: small)
        item.isEnabled = false
        return item
    }

    static func rowTitle(label: String, value: String, fraction: Double? = nil, small: Bool = false) -> NSAttributedString {
        let paragraph = NSMutableParagraphStyle()
        paragraph.tabStops = [NSTextTab(textAlignment: .right, location: 330, options: [:])]
        paragraph.defaultTabInterval = 330
        let size: CGFloat = small ? 11 : 12.5
        let text = NSMutableAttributedString(
            string: "\(label)\t\(value)",
            attributes: [
                .font: NSFont.menuFont(ofSize: size),
                .foregroundColor: small ? NSColor.secondaryLabelColor : NSColor.labelColor,
                .paragraphStyle: paragraph,
            ]
        )
        if let fraction, fraction >= 0.75 {
            let range = (text.string as NSString).range(of: value, options: .backwards)
            if range.location != NSNotFound {
                text.addAttribute(.foregroundColor, value: fraction >= 0.9 ? NSColor.systemRed : NSColor.systemOrange, range: range)
            }
        }
        return text
    }

    private func action(_ title: String, _ selector: Selector, key: String) -> NSMenuItem {
        let item = NSMenuItem(title: title, action: selector, keyEquivalent: key)
        item.target = self
        item.isEnabled = true
        return item
    }

    // MARK: - Actions

    @objc private func refreshNow() { store.refresh() }

    @objc private func setDisplayMode(_ sender: NSMenuItem) {
        Prefs.displayMode = DisplayMode(rawValue: sender.tag) ?? .workers
        updateButton()
        rebuildMenu()
    }

    @objc private func setInterval(_ sender: NSMenuItem) {
        Prefs.refreshSeconds = sender.tag
        rebuildMenu()
    }

    @objc private func openSettings() { onSettings?() }

    @objc private func quit() { onQuit?() }

    @objc private func openDashboard() {
        let account = Prefs.accountID
        let url = account.isEmpty
            ? "https://dash.cloudflare.com/"
            : "https://dash.cloudflare.com/\(account)/analytics"
        if let url = URL(string: url) { NSWorkspace.shared.open(url) }
    }

    @objc private func toggleLogin() {
        LoginItem.setEnabled(!LoginItem.isEnabled)
        rebuildMenu()
    }

    private static func truncate(_ text: String, _ limit: Int) -> String {
        text.count <= limit ? text : String(text.prefix(limit - 1)) + "…"
    }
}
