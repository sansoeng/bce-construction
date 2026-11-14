import AppKit
import SwiftUI

enum TestState: Equatable {
    case idle
    case testing
    case ok(String)
    case failed(String)
}

final class SettingsModel: ObservableObject {
    @Published var accountID = ""
    @Published var authMode = 0
    @Published var email = ""
    @Published var secret = ""
    @Published var displayMode = 0
    @Published var refreshSeconds = 300
    @Published var workerLimit = ""
    @Published var d1ReadLimit = ""
    @Published var d1WriteLimit = ""
    @Published var aiLimit = ""
    @Published var hasStoredSecret = false
    @Published var testState: TestState = .idle
    @Published var saveError: String?

    var onSave: (() -> Void)?

    private let api = CloudflareAPI()

    init() { load() }

    func load() {
        accountID = Prefs.accountID
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
        testState = .idle
        saveError = nil
    }

    var secretPrompt: String {
        if hasStoredSecret { return "Stored in Keychain — leave blank to keep" }
        return authMode == 0 ? "Paste API token" : "Paste global API key"
    }

    /// Builds credentials from the form, falling back to the stored secret when the field is blank.
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
        let account = accountID.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !account.isEmpty else {
            saveError = "Account ID is required."
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
              let ai = Double(aiLimit), ai > 0
        else {
            saveError = "Daily limits must be positive numbers."
            return
        }

        Credentials.store(
            accountID: account,
            authMode: AuthMode(rawValue: authMode) ?? .apiToken,
            secret: secret.isEmpty ? nil : secret,
            email: email
        )
        Prefs.displayMode = DisplayMode(rawValue: displayMode) ?? .workers
        Prefs.refreshSeconds = refreshSeconds
        UserDefaults.standard.set(workers, forKey: "limit.workers")
        UserDefaults.standard.set(d1Read, forKey: "limit.d1Reads")
        UserDefaults.standard.set(d1Write, forKey: "limit.d1Writes")
        UserDefaults.standard.set(ai, forKey: "limit.aiNeurons")

        hasStoredSecret = Keychain.has("secret")
        secret = ""
        saveError = nil
        onSave?()
    }
}

struct SettingsView: View {
    @ObservedObject var model: SettingsModel

    var body: some View {
        VStack(spacing: 0) {
            Form {
                Section("Cloudflare account") {
                    TextField("Account ID", text: $model.accountID)
                        .textFieldStyle(.roundedBorder)
                    Text("Find it in the dashboard URL, or run `npx wrangler whoami`.")
                        .font(.caption)
                        .foregroundColor(.secondary)

                    Picker("Authentication", selection: $model.authMode) {
                        Text("API token").tag(0)
                        Text("Global API key").tag(1)
                    }
                    .pickerStyle(.segmented)

                    if model.authMode == 1 {
                        TextField("Account email", text: $model.email)
                            .textFieldStyle(.roundedBorder)
                    }

                    SecureField(model.secretPrompt, text: $model.secret)
                        .textFieldStyle(.roundedBorder)
                    Text("Required token permissions: Account → Account Analytics → Read, Zone → Analytics → Read, Zone → Zone → Read.")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .fixedSize(horizontal: false, vertical: true)
                }

                Section("Menu bar") {
                    Picker("Show", selection: $model.displayMode) {
                        ForEach(DisplayMode.allCases, id: \.rawValue) { mode in
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

                Section("Daily allowances (UTC day)") {
                    HStack {
                        Text("Worker requests")
                        Spacer()
                        TextField("100000", text: $model.workerLimit)
                            .textFieldStyle(.roundedBorder)
                            .frame(width: 130)
                    }
                    HStack {
                        Text("D1 rows read")
                        Spacer()
                        TextField("5000000", text: $model.d1ReadLimit)
                            .textFieldStyle(.roundedBorder)
                            .frame(width: 130)
                    }
                    HStack {
                        Text("D1 rows written")
                        Spacer()
                        TextField("100000", text: $model.d1WriteLimit)
                            .textFieldStyle(.roundedBorder)
                            .frame(width: 130)
                    }
                    HStack {
                        Text("Workers AI neurons")
                        Spacer()
                        TextField("10000", text: $model.aiLimit)
                            .textFieldStyle(.roundedBorder)
                            .frame(width: 130)
                    }
                    Text("Defaults are the Cloudflare Free plan limits. Raise them if you are on a paid plan.")
                        .font(.caption)
                        .foregroundColor(.secondary)
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

            Divider()

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
        .frame(width: 540, height: 660)
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
                .lineLimit(3)
        }
    }
}
