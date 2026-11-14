import AppKit
import SwiftUI

enum TestState: Equatable {
    case idle
    case testing
    case ok(String)
    case failed(String)
}

final class SettingsModel: ObservableObject {
    @Published var accounts: [MonitorAccount] = []
    @Published var selected = 0
    @Published var accountID = ""
    @Published var accountLabel = ""
    @Published var authMode = 0
    @Published var email = ""
    @Published var secret = ""
    @Published var displayMode = 0
    @Published var refreshSeconds = 300
    @Published var workerLimit = ""
    @Published var d1ReadLimit = ""
    @Published var d1WriteLimit = ""
    @Published var aiLimit = ""
    @Published var r2StorageGB = ""
    @Published var r2ClassA = ""
    @Published var r2ClassB = ""
    @Published var openCodeEnabled = true
    @Published var openCodePath = ""
    @Published var openCodeDetected = ""
    @Published var hasStoredSecret = false
    @Published var testState: TestState = .idle
    @Published var saveError: String?

    var onSave: (() -> Void)?

    private let api = CloudflareAPI()

    init() { load() }

    func load() {
        Prefs.migrateAccountsIfNeeded()
        accounts = Prefs.accounts
        if accounts.isEmpty, !Prefs.accountID.isEmpty {
            accounts = [MonitorAccount(id: Prefs.accountID, label: "")]
        }
        if accounts.isEmpty {
            accounts = [MonitorAccount(id: "", label: "")]
        }
        selected = min(max(0, selected), accounts.count - 1)
        applySelection()

        authMode = Prefs.authMode.rawValue
        email = Keychain.get("email") ?? ""
        hasStoredSecret = Keychain.has("secret")
        secret = ""
        displayMode = Prefs.displayMode.rawValue
        refreshSeconds = Prefs.refreshSeconds
        workerLimit = String(Int(Prefs.workerLimit))
        d1ReadLimit = String(Int(Prefs.d1ReadLimit))
        d1WriteLimit = String(Int(Prefs.d1WriteLimit))
        aiLimit = String(Int(Prefs.aiNeuronLimit))
        r2StorageGB = Fmt.decimal(Prefs.r2StorageLimit / 1_073_741_824, digits: 2)
        r2ClassA = String(Int(Prefs.r2ClassALimit))
        r2ClassB = String(Int(Prefs.r2ClassBLimit))
        openCodeEnabled = Prefs.openCodeEnabled
        openCodePath = Prefs.openCodePath
        refreshOpenCodeDetection()
        testState = .idle
        saveError = nil
    }

    // MARK: - Account list

    func select(_ index: Int) {
        guard accounts.indices.contains(index) else { return }
        commitCurrentEdits()
        selected = index
        applySelection()
        testState = .idle
    }

    func addAccount() {
        commitCurrentEdits()
        accounts.append(MonitorAccount(id: "", label: ""))
        selected = accounts.count - 1
        applySelection()
        testState = .idle
    }

    func removeSelected() {
        guard accounts.count > 1, accounts.indices.contains(selected) else { return }
        accounts.remove(at: selected)
        selected = min(selected, accounts.count - 1)
        applySelection()
        testState = .idle
    }

    private func applySelection() {
        guard accounts.indices.contains(selected) else { return }
        accountID = accounts[selected].id
        accountLabel = accounts[selected].label
    }

    /// Writes the edited fields back into the selected row so switching rows doesn't lose them.
    private func commitCurrentEdits() {
        guard accounts.indices.contains(selected) else { return }
        accounts[selected].id = accountID.trimmingCharacters(in: .whitespacesAndNewlines)
        accounts[selected].label = accountLabel.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    func refreshOpenCodeDetection() {
        guard openCodeEnabled else {
            openCodeDetected = "OpenCode tracking is off."
            return
        }
        if let path = OpenCodeProbe.detectPath(custom: openCodePath) {
            openCodeDetected = "Using \(path)"
        } else {
            openCodeDetected = "Not found — install OpenCode or point to the binary."
        }
    }

    var secretPrompt: String {
        if hasStoredSecret { return "Stored in Keychain — leave blank to keep" }
        return authMode == 0 ? "Paste API token" : "Paste global API key"
    }

    var secretLabel: String {
        authMode == 1 ? "Global API key" : "API token"
    }

    /// Builds credentials for the selected account, falling back to the stored secret.
    func credentials() -> Credentials? {
        let account = accountID.trimmingCharacters(in: .whitespacesAndNewlines)
        let key = secret.isEmpty ? (Keychain.get("secret") ?? "") : secret
        guard !account.isEmpty, !key.isEmpty else { return nil }
        return Credentials(
            accountID: account,
            authMode: AuthMode(rawValue: authMode) ?? .apiToken,
            secret: key,
            email: email.trimmingCharacters(in: .whitespacesAndNewlines)
        )
    }

    func test() {
        guard let creds = credentials(), creds.isComplete else {
            testState = .failed("Fill in the account ID and credential first.")
            return
        }
        testState = .testing
        Task {
            do {
                let zones = (try? await api.zones(for: creds)) ?? []
                let snapshot = try await api.usage(for: creds, zones: zones)
                let summary = "Connected · \(Fmt.grouped(snapshot.workerRequests)) worker requests, "
                    + "\(Fmt.compact(snapshot.zoneRequests)) site requests today"
                await MainActor.run { self.testState = .ok(summary) }
            } catch {
                await MainActor.run { self.testState = .failed(error.localizedDescription) }
            }
        }
    }

    func save() {
        commitCurrentEdits()

        let cleaned = accounts.filter { !$0.id.isEmpty }
        guard !cleaned.isEmpty else {
            saveError = "Add at least one account ID."
            return
        }
        let ids = cleaned.map(\.id)
        guard Set(ids).count == ids.count else {
            saveError = "Each account ID can only be listed once."
            return
        }
        guard credentials() != nil else {
            saveError = "Enter an API token or global API key."
            return
        }
        if AuthMode(rawValue: authMode) == .globalKey,
           email.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            saveError = "Global API key authentication also needs the account email."
            return
        }
        guard let workers = Double(workerLimit), workers > 0,
              let d1Read = Double(d1ReadLimit), d1Read > 0,
              let d1Write = Double(d1WriteLimit), d1Write > 0,
              let ai = Double(aiLimit), ai > 0,
              let r2GB = Double(r2StorageGB), r2GB > 0,
              let r2A = Double(r2ClassA), r2A > 0,
              let r2B = Double(r2ClassB), r2B > 0
        else {
            saveError = "Allowances must be positive numbers."
            return
        }

        Prefs.accounts = cleaned
        Credentials.storeCredential(
            authMode: AuthMode(rawValue: authMode) ?? .apiToken,
            secret: secret.isEmpty ? nil : secret,
            email: email
        )
        Prefs.displayMode = DisplayMode(rawValue: displayMode) ?? .workers
        Prefs.refreshSeconds = refreshSeconds
        Prefs.openCodeEnabled = openCodeEnabled
        Prefs.openCodePath = openCodePath.trimmingCharacters(in: .whitespacesAndNewlines)
        UserDefaults.standard.set(workers, forKey: "limit.workers")
        UserDefaults.standard.set(d1Read, forKey: "limit.d1Reads")
        UserDefaults.standard.set(d1Write, forKey: "limit.d1Writes")
        UserDefaults.standard.set(ai, forKey: "limit.aiNeurons")
        UserDefaults.standard.set(r2GB * 1_073_741_824, forKey: "limit.r2Storage")
        UserDefaults.standard.set(r2A, forKey: "limit.r2ClassA")
        UserDefaults.standard.set(r2B, forKey: "limit.r2ClassB")

        hasStoredSecret = Keychain.has("secret")
        secret = ""
        saveError = nil
        refreshOpenCodeDetection()
        onSave?()
    }
}

struct SettingsView: View {
    @ObservedObject var model: SettingsModel

    var body: some View {
        VStack(spacing: 0) {
            TabView {
                accountTab
                    .tabItem { Label("Cloudflare", systemImage: "cloud") }
                menuBarTab
                    .tabItem { Label("Menu bar", systemImage: "menubar.rectangle") }
                limitsTab
                    .tabItem { Label("Allowances", systemImage: "gauge") }
                openCodeTab
                    .tabItem { Label("OpenCode", systemImage: "terminal") }
            }
            .padding(.horizontal, 8)
            .padding(.top, 10)
            .padding(.bottom, 4)

            Divider()
            footer
        }
        .frame(width: 560, height: 620)
    }

    private var selection: Binding<Int> {
        Binding(get: { model.selected }, set: { model.select($0) })
    }

    private var accountTab: some View {
        Form {
            Section("Accounts") {
                Picker("Monitor", selection: selection) {
                    ForEach(Array(model.accounts.enumerated()), id: \.offset) { index, account in
                        Text(rowLabel(account)).tag(index)
                    }
                }
                HStack(spacing: 10) {
                    Button("Add account") { model.addAccount() }
                    Button("Remove") { model.removeSelected() }
                        .disabled(model.accounts.count < 2)
                    Spacer()
                }
                Text("One credential can monitor several Cloudflare accounts — for example a personal account and a client account.")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }

            Section("Selected account") {
                TextField("Name", text: $model.accountLabel)
                    .textFieldStyle(.roundedBorder)
                TextField("Account ID", text: $model.accountID)
                    .textFieldStyle(.roundedBorder)
                Text("Find it in the dashboard URL, or run `npx wrangler whoami`.")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Section("Authentication (shared by all accounts)") {
                Picker("Authentication", selection: $model.authMode) {
                    Text("API token").tag(0)
                    Text("Global API key").tag(1)
                }
                .pickerStyle(.segmented)

                if model.authMode == 1 {
                    TextField("Account email", text: $model.email)
                        .textFieldStyle(.roundedBorder)
                }

                SecureField(model.secretLabel, text: $model.secret)
                    .textFieldStyle(.roundedBorder)

                if model.hasStoredSecret {
                    Text("A credential is stored in the Keychain — leave this blank to keep it.")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Text("Required token permissions: Account → Account Analytics → Read, Zone → Analytics → Read, Zone → Zone → Read. A Global API key covers every account the email can manage.")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }

            Section {
                HStack(spacing: 10) {
                    Button("Test connection") { model.test() }
                        .disabled(model.testState == .testing)
                    testStatus
                    Spacer()
                }
            }
        }
        .formStyle(.grouped)
    }

    private func rowLabel(_ account: MonitorAccount) -> String {
        let name = account.label.isEmpty ? String(account.id.prefix(10)) : account.label
        return account.id.isEmpty ? "\(name) (new)" : "\(name) · \(account.id.prefix(8))"
    }

    private var menuBarTab: some View {
        Form {
            Section("Menu bar") {
                Picker("Show", selection: $model.displayMode) {
                    ForEach(DisplayMode.displayOrder, id: \.rawValue) { mode in
                        Text(mode.label).tag(mode.rawValue)
                    }
                }
                Picker("Refresh every", selection: $model.refreshSeconds) {
                    Text("1 minute").tag(60)
                    Text("5 minutes").tag(300)
                    Text("15 minutes").tag(900)
                    Text("1 hour").tag(3600)
                }
            }

            Section {
                Text("The icon always shows the selected metric. With several accounts, absolute counts are summed and percentages use the busiest account. Quota rows are tagged daily or monthly, and the menu shows the next reset in local time.")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .formStyle(.grouped)
    }

    private var limitsTab: some View {
        Form {
            Section("Daily (UTC day)") {
                limitRow("Worker requests", $model.workerLimit)
                limitRow("D1 rows read", $model.d1ReadLimit)
                limitRow("D1 rows written", $model.d1WriteLimit)
                limitRow("Workers AI neurons", $model.aiLimit)
            }

            Section("Monthly (R2)") {
                limitRow("Storage (GB-month)", $model.r2StorageGB)
                limitRow("Class A operations", $model.r2ClassA)
                limitRow("Class B operations", $model.r2ClassB)
            }

            Section {
                Text("Free-plan defaults per account. Raise these if you are on a paid plan.")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .formStyle(.grouped)
    }

    private var openCodeTab: some View {
        Form {
            Section("OpenCode (local)") {
                Toggle("Show OpenCode usage", isOn: $model.openCodeEnabled)

                HStack {
                    TextField("CLI path (auto-detected)", text: $model.openCodePath)
                        .textFieldStyle(.roundedBorder)
                    Button("Detect") { model.refreshOpenCodeDetection() }
                }

                Text(model.openCodeDetected)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .lineLimit(2)

                Text("Runs `opencode stats --json` on this Mac; nothing is sent anywhere. Usage resets at local midnight and has no quota.")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .fixedSize(horizontal: false, vertical: true)

                Text("Percentages come from your OpenCode Go account: 5-hour (20% of the monthly allowance), weekly (50%) and monthly (100%), with the reset time shown in the menu.")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .formStyle(.grouped)
    }

    private var footer: some View {
        HStack {
            if let error = model.saveError {
                Text(error)
                    .font(.caption)
                    .foregroundColor(.red)
                    .lineLimit(2)
            }
            Spacer()
            Button("Cancel") { NSApp.keyWindow?.close() }
                .keyboardShortcut(.cancelAction)
            Button("Save") { model.save() }
                .keyboardShortcut(.defaultAction)
                .buttonStyle(.borderedProminent)
        }
        .padding(16)
    }

    private func limitRow(_ title: String, _ text: Binding<String>) -> some View {
        HStack {
            Text(title)
            Spacer()
            TextField("", text: text)
                .textFieldStyle(.roundedBorder)
                .multilineTextAlignment(.trailing)
                .frame(width: 150)
        }
    }

    @ViewBuilder
    private var testStatus: some View {
        switch model.testState {
        case .idle:
            EmptyView()
        case .testing:
            HStack(spacing: 6) {
                ProgressView().controlSize(.small)
                Text("Testing…").font(.caption).foregroundColor(.secondary)
            }
        case .ok(let message):
            Text(message)
                .font(.caption)
                .foregroundColor(.green)
                .lineLimit(2)
        case .failed(let message):
            Text(message)
                .font(.caption)
                .foregroundColor(.red)
                .lineLimit(2)
        }
    }
}
