import Foundation

enum AuthMode: Int {
    case apiToken = 0
    case globalKey = 1

    var label: String {
        switch self {
        case .apiToken: return "API token"
        case .globalKey: return "Global API key"
        }
    }
}

enum DisplayMode: Int, CaseIterable {
    case workers = 0
    case sites = 1
    case d1Reads = 2
    case worstQuota = 3
    case openCode = 4
    case combined = 5
    case openCodeRolling = 6
    case openCodeWeekly = 7
    case openCodeMonthly = 8

    var label: String {
        switch self {
        case .workers: return "Worker requests"
        case .sites: return "Site requests"
        case .d1Reads: return "D1 rows read"
        case .worstQuota: return "Cloudflare daily %"
        case .openCode: return "OpenCode tokens"
        case .combined: return "Cloudflare + OpenCode"
        case .openCodeRolling: return "OpenCode 5-hour %"
        case .openCodeWeekly: return "OpenCode weekly %"
        case .openCodeMonthly: return "OpenCode monthly %"
        }
    }

    /// Picker/title order: the at-a-glance options first.
    static let displayOrder: [DisplayMode] = [
        .combined, .worstQuota, .openCodeMonthly, .openCodeWeekly, .openCodeRolling,
        .workers, .sites, .d1Reads, .openCode,
    ]
}

/// A Cloudflare account the app monitors. One credential (stored in the Keychain)
/// can cover several accounts — e.g. a personal account and a client account.
struct MonitorAccount: Codable, Identifiable, Equatable {
    /// Cloudflare account ID.
    var id: String
    /// Display name shown in the menu.
    var label: String

    var shortName: String { label.isEmpty ? String(id.prefix(8)) : label }
}

enum Prefs {
    private static let d = UserDefaults.standard

    /// Accounts to monitor, persisted as JSON. Empty means "not configured yet".
    static var accounts: [MonitorAccount] {
        get {
            guard let data = d.data(forKey: "accounts"),
                  let list = try? JSONDecoder().decode([MonitorAccount].self, from: data)
            else { return [] }
            return list.filter { !$0.id.isEmpty }
        }
        set {
            let cleaned = newValue.filter { !$0.id.trimmingCharacters(in: .whitespaces).isEmpty }
            d.set(try? JSONEncoder().encode(cleaned), forKey: "accounts")
        }
    }

    /// Legacy single-account setting, kept so older installs migrate cleanly.
    static var accountID: String {
        get { d.string(forKey: "accountID") ?? "" }
        set { d.set(newValue, forKey: "accountID") }
    }

    /// Seeds the account list from the pre-multi-account setting exactly once.
    static func migrateAccountsIfNeeded() {
        guard accounts.isEmpty else { return }
        let legacy = accountID.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !legacy.isEmpty else { return }
        accounts = [MonitorAccount(id: legacy, label: "") ]
    }

    /// Parses `CF_MENUBAR_ACCOUNTS="id:Label,id2:Label2"` for headless setup.
    static func accounts(fromEnv value: String) -> [MonitorAccount] {
        value.split(separator: ",").compactMap { entry in
            let parts = entry.split(separator: ":", maxSplits: 1).map {
                $0.trimmingCharacters(in: .whitespaces)
            }
            guard let id = parts.first, !id.isEmpty else { return nil }
            return MonitorAccount(id: id, label: parts.count > 1 ? parts[1] : "")
        }
    }

    static var authMode: AuthMode {
        get { AuthMode(rawValue: d.integer(forKey: "authMode")) ?? .apiToken }
        set { d.set(newValue.rawValue, forKey: "authMode") }
    }

    static var displayMode: DisplayMode {
        get {
            guard d.object(forKey: "displayMode") != nil else { return .combined }
            return DisplayMode(rawValue: d.integer(forKey: "displayMode")) ?? .combined
        }
        set { d.set(newValue.rawValue, forKey: "displayMode") }
    }

    static var refreshSeconds: Int {
        get {
            let v = d.integer(forKey: "refreshSeconds")
            return v > 0 ? v : 300
        }
        set { d.set(newValue, forKey: "refreshSeconds") }
    }

    /// Values below are the Cloudflare Free plan allowances this app reports against.
    /// Edit them in Settings → Limits if a plan changes.
    static var workerLimit: Double { limit("limit.workers", 100_000) }
    static var d1ReadLimit: Double { limit("limit.d1Reads", 5_000_000) }
    static var d1WriteLimit: Double { limit("limit.d1Writes", 100_000) }
    static var aiNeuronLimit: Double { limit("limit.aiNeurons", 10_000) }
    /// R2 free tier is monthly: 10 GB-month, 1M Class A and 10M Class B operations.
    static var r2StorageLimit: Double { limit("limit.r2Storage", 10 * 1024 * 1024 * 1024) }
    static var r2ClassALimit: Double { limit("limit.r2ClassA", 1_000_000) }
    static var r2ClassBLimit: Double { limit("limit.r2ClassB", 10_000_000) }

    static var openCodeEnabled: Bool {
        get { d.object(forKey: "openCode.enabled") == nil ? true : d.bool(forKey: "openCode.enabled") }
        set { d.set(newValue, forKey: "openCode.enabled") }
    }

    static var openCodePath: String {
        get { d.string(forKey: "openCode.path") ?? "" }
        set { d.set(newValue, forKey: "openCode.path") }
    }

    private static func limit(_ key: String, _ fallback: Double) -> Double {
        let v = d.double(forKey: key)
        return v > 0 ? v : fallback
    }
}

/// Minimal Keychain wrapper. The app owns the items, so reads never prompt.
enum Keychain {
    private static let service = "com.bce.cloudflare-menubar"

    static func set(_ value: String, for account: String) {
        let base: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
        ]
        SecItemDelete(base as CFDictionary)
        guard !value.isEmpty else { return }
        var attrs = base
        attrs[kSecValueData as String] = Data(value.utf8)
        attrs[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlock
        SecItemAdd(attrs as CFDictionary, nil)
    }

    static func get(_ account: String) -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne,
        ]
        var out: CFTypeRef?
        guard SecItemCopyMatching(query as CFDictionary, &out) == errSecSuccess,
              let data = out as? Data
        else { return nil }
        let value = String(decoding: data, as: UTF8.self)
        return value.isEmpty ? nil : value
    }

    static func has(_ account: String) -> Bool { get(account) != nil }

    static func delete(_ account: String) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
        ]
        SecItemDelete(query as CFDictionary)
    }
}

struct Credentials {
    var accountID: String
    var authMode: AuthMode
    var secret: String
    var email: String

    var isComplete: Bool {
        if accountID.isEmpty || secret.isEmpty { return false }
        return authMode == .apiToken || !email.isEmpty
    }

    /// Credentials from env vars win, which makes `--probe` and development easy.
    /// Otherwise the Keychain + UserDefaults pair is used.
    static func load() -> Credentials? {
        let env = ProcessInfo.processInfo.environment
        let fallback = env["CF_MENUBAR_ACCOUNT"] ?? Prefs.accounts.first?.id ?? Prefs.accountID
        return load(accountID: fallback)
    }

    /// Credentials for one monitored account. The secret and email are shared across
    /// accounts; only the account ID changes per lookup.
    static func load(accountID: String) -> Credentials? {
        let env = ProcessInfo.processInfo.environment
        let account = accountID.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !account.isEmpty else { return nil }

        if let token = env["CF_MENUBAR_TOKEN"], !token.isEmpty {
            return Credentials(accountID: account, authMode: .apiToken, secret: token, email: "")
        }
        if let key = env["CF_MENUBAR_KEY"], !key.isEmpty {
            let email = env["CF_MENUBAR_EMAIL"] ?? Keychain.get("email") ?? ""
            return Credentials(accountID: account, authMode: .globalKey, secret: key, email: email)
        }

        let mode = Prefs.authMode
        guard let secret = Keychain.get("secret") else { return nil }
        let email = Keychain.get("email") ?? ""
        let creds = Credentials(accountID: account, authMode: mode, secret: secret, email: email)
        return creds.isComplete ? creds : nil
    }

    /// Saves the shared credential only; the account list is managed separately.
    static func storeCredential(authMode: AuthMode, secret: String?, email: String) {
        Prefs.authMode = authMode
        if let secret, !secret.isEmpty { Keychain.set(secret, for: "secret") }
        Keychain.set(email.trimmingCharacters(in: .whitespacesAndNewlines), for: "email")
    }

    static func store(accountID: String, authMode: AuthMode, secret: String?, email: String) {
        let account = accountID.trimmingCharacters(in: .whitespacesAndNewlines)
        if !account.isEmpty {
            Prefs.accountID = account
            // Keep the first monitored account in sync when there is no list yet.
            if Prefs.accounts.isEmpty {
                Prefs.accounts = [MonitorAccount(id: account, label: "")]
            }
        }
        storeCredential(authMode: authMode, secret: secret, email: email)
    }
}
