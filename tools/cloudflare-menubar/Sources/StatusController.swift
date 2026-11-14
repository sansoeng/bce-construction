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
        menu.minimumWidth = 390
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
            case .openCode: title = snapshot.openCode.map { Fmt.compact($0.totalTokens) } ?? "—"
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
        var lines = ["Cloudflare & OpenCode · \(snapshot.day) (UTC day)"]
        lines.append("Workers: \(Fmt.grouped(snapshot.workerRequests)) / \(Fmt.grouped(Prefs.workerLimit)) requests (\(Fmt.percent(snapshot.workerFraction)))")
        lines.append("D1: \(Fmt.compact(snapshot.d1RowsRead)) rows read, \(Fmt.compact(snapshot.d1RowsWritten)) written")
        lines.append("R2: \(Fmt.bytes(snapshot.r2StorageBytes)) stored · \(Fmt.compact(snapshot.r2ClassA + snapshot.r2ClassB)) ops this month")
        lines.append("Sites: \(Fmt.compact(snapshot.zoneRequests)) requests · \(Fmt.bytes(snapshot.zoneBytes))")
        if let usage = snapshot.openCode {
            lines.append("OpenCode: \(Fmt.grouped(usage.totalTokens)) tokens today · \(Fmt.grouped(usage.steps)) steps")
        } else if let error = snapshot.openCodeError {
            lines.append("OpenCode: \(error)")
        }
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
            string: "Cloudflare & OpenCode",
            attributes: [.font: NSFont.boldSystemFont(ofSize: 13), .foregroundColor: NSColor.labelColor]
        )
        header.isEnabled = false
        menu.addItem(header)

        if let snapshot = store.snapshot {
            let subtitle = NSMenuItem()
            subtitle.attributedTitle = NSAttributedString(
                string: "\(snapshot.day) · UTC day · daily + monthly limits",
                attributes: [.font: NSFont.systemFont(ofSize: 11), .foregroundColor: NSColor.secondaryLabelColor]
            )
            subtitle.isEnabled = false
            menu.addItem(subtitle)
        }

        menu.addItem(.separator())

        if let snapshot = store.snapshot {
            addUsageRows(snapshot)
            if Prefs.openCodeEnabled {
                menu.addItem(.separator())
                addOpenCodeRows(snapshot)
            }
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
            period: "daily",
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

        // D1 — daily.
        menu.addItem(row(
            label: "D1 rows read",
            value: "\(Fmt.grouped(snapshot.d1RowsRead)) / \(Fmt.grouped(Prefs.d1ReadLimit))  ·  \(Fmt.percent(snapshot.d1ReadFraction))",
            period: "daily",
            fraction: snapshot.d1ReadFraction
        ))
        menu.addItem(row(
            label: "D1 rows written",
            value: "\(Fmt.grouped(snapshot.d1RowsWritten)) / \(Fmt.grouped(Prefs.d1WriteLimit))  ·  \(Fmt.percent(snapshot.d1WriteFraction))",
            period: "daily",
            fraction: snapshot.d1WriteFraction
        ))
        menu.addItem(row(
            label: "Workers AI neurons",
            value: "\(Fmt.decimal(snapshot.aiNeurons, digits: 2)) / \(Fmt.grouped(Prefs.aiNeuronLimit))  ·  \(Fmt.percent(snapshot.aiFraction))",
            period: "daily",
            fraction: snapshot.aiFraction
        ))

        // R2 — monthly.
        menu.addItem(row(
            label: "R2 storage",
            value: "\(Fmt.bytes(snapshot.r2StorageBytes)) / \(Fmt.bytes(Prefs.r2StorageLimit))  ·  \(Fmt.percent(snapshot.r2StorageFraction))",
            period: "monthly",
            fraction: snapshot.r2StorageFraction
        ))
        menu.addItem(row(
            label: "R2 Class A ops",
            value: "\(Fmt.grouped(snapshot.r2ClassA)) / \(Fmt.grouped(Prefs.r2ClassALimit))  ·  \(Fmt.percent(snapshot.r2ClassAFraction))",
            period: "monthly",
            fraction: snapshot.r2ClassAFraction
        ))
        menu.addItem(row(
            label: "R2 Class B ops",
            value: "\(Fmt.grouped(snapshot.r2ClassB)) / \(Fmt.grouped(Prefs.r2ClassBLimit))  ·  \(Fmt.percent(snapshot.r2ClassBFraction))",
            period: "monthly",
            fraction: snapshot.r2ClassBFraction
        ))

        // Sites — click through for per-zone traffic.
        let sites = row(
            label: "Site requests",
            value: "\(Fmt.compact(snapshot.zoneRequests))  ·  \(Fmt.bytes(snapshot.zoneBytes))",
            period: "today"
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

    private func addOpenCodeRows(_ snapshot: UsageSnapshot) {
        if let usage = snapshot.openCode {
            let item = row(
                label: "OpenCode",
                value: "\(Fmt.compact(usage.totalTokens)) tokens",
                period: "today"
            )
            item.isEnabled = true
            item.toolTip = "Local OpenCode usage for today. Resets at local midnight; no quota applies."

            let sub = NSMenu()
            sub.addItem(info("Input  \(Fmt.grouped(usage.tokensInput)) tokens"))
            sub.addItem(info("Output  \(Fmt.grouped(usage.tokensOutput)) tokens"))
            if usage.tokensReasoning > 0 {
                sub.addItem(info("Reasoning  \(Fmt.grouped(usage.tokensReasoning)) tokens"))
            }
            sub.addItem(info("Cache read  \(Fmt.grouped(usage.cacheRead)) tokens"))
            sub.addItem(.separator())
            sub.addItem(info("Sessions  \(Fmt.grouped(usage.sessions))  ·  steps  \(Fmt.grouped(usage.steps))"))
            sub.addItem(info(usage.cost > 0 ? "Cost today  \(Self.money(usage.cost))" : "Cost today  no extra charge"))
            if usage.monthTokens > 0 || usage.monthCost > 0 {
                sub.addItem(.separator())
                let cost = usage.monthCost > 0 ? "  ·  \(Self.money(usage.monthCost))" : ""
                sub.addItem(info("Last 30 days  \(Fmt.compact(usage.monthTokens)) tokens\(cost)"))
            }
            item.submenu = sub
            menu.addItem(item)
        } else {
            let item = row(
                label: "OpenCode",
                value: snapshot.openCodeError == nil ? "—" : "unavailable",
                period: "today"
            )
            item.toolTip = snapshot.openCodeError
            item.isEnabled = false
            menu.addItem(item)

            if let error = snapshot.openCodeError {
                let warn = NSMenuItem(title: "", action: nil, keyEquivalent: "")
                warn.attributedTitle = NSAttributedString(
                    string: "⚠︎ " + Self.truncate(error, 80),
                    attributes: [.font: NSFont.systemFont(ofSize: 11), .foregroundColor: NSColor.systemOrange]
                )
                warn.isEnabled = false
                warn.toolTip = error
                menu.addItem(warn)
            }
        }
    }

    private func info(_ title: String) -> NSMenuItem {
        let item = NSMenuItem(title: title, action: nil, keyEquivalent: "")
        item.isEnabled = false
        return item
    }

    private static func money(_ value: Double) -> String {
        String(format: "$%.2f", value)
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

            let resets = row(
                label: "Resets",
                value: "daily \(Self.localTime(Self.nextDailyResetUTC()))  ·  monthly \(Self.localDay(Self.nextMonthlyResetUTC()))",
                small: true
            )
            resets.toolTip = "Cloudflare daily allowances roll over at 00:00 UTC. R2 allowances reset on the 1st."
            menu.addItem(resets)
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

    private func row(label: String, value: String, period: String? = nil, fraction: Double? = nil, small: Bool = false) -> NSMenuItem {
        let item = NSMenuItem(title: "", action: nil, keyEquivalent: "")
        item.attributedTitle = Self.rowTitle(label: label, value: value, period: period, fraction: fraction, small: small)
        item.isEnabled = false
        return item
    }

    static func rowTitle(label: String, value: String, period: String? = nil, fraction: Double? = nil, small: Bool = false) -> NSAttributedString {
        let paragraph = NSMutableParagraphStyle()
        paragraph.tabStops = [NSTextTab(textAlignment: .right, location: 360, options: [:])]
        paragraph.defaultTabInterval = 360
        let size: CGFloat = small ? 11 : 12.5
        let base: [NSAttributedString.Key: Any] = [
            .font: NSFont.menuFont(ofSize: size),
            .foregroundColor: small ? NSColor.secondaryLabelColor : NSColor.labelColor,
            .paragraphStyle: paragraph,
        ]
        let text = NSMutableAttributedString(string: label, attributes: base)
        if let period {
            text.append(NSAttributedString(
                string: "  " + period,
                attributes: [
                    .font: NSFont.systemFont(ofSize: 10),
                    .foregroundColor: NSColor.tertiaryLabelColor,
                    .paragraphStyle: paragraph,
                ]
            ))
        }
        text.append(NSAttributedString(string: "\t" + value, attributes: base))

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

    // MARK: - Reset clock

    private static func utcCalendar() -> Calendar {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(identifier: "UTC")!
        return calendar
    }

    private static func nextDailyResetUTC() -> Date {
        let calendar = utcCalendar()
        let start = calendar.startOfDay(for: Date())
        return calendar.date(byAdding: .day, value: 1, to: start) ?? Date()
    }

    private static func nextMonthlyResetUTC() -> Date {
        let calendar = utcCalendar()
        let components = calendar.dateComponents([.year, .month], from: Date())
        let start = calendar.date(from: components) ?? Date()
        return calendar.date(byAdding: .month, value: 1, to: start) ?? Date()
    }

    /// Local wall-clock time, because 00:00 UTC is 07:00 in Cambodia.
    private static func localTime(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: date)
    }

    private static func localDay(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "d MMM"
        return formatter.string(from: date)
    }
}
