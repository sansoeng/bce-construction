import Foundation

struct ZoneInfo: Hashable {
    let id: String
    let name: String
    let status: String
}

struct ScriptUsage {
    let name: String
    let requests: Double
    let errors: Double
}

struct ZoneUsage {
    let name: String
    let requests: Double
    let pageViews: Double
    let bytes: Double
    let threats: Double
    let cached: Double
}

struct UsageSnapshot {
    var fetchedAt = Date()
    var day = ""
    var workerRequests: Double = 0
    var workerErrors: Double = 0
    var scripts: [ScriptUsage] = []
    var d1RowsRead: Double = 0
    var d1RowsWritten: Double = 0
    var d1ReadQueries: Double = 0
    var d1WriteQueries: Double = 0
    var aiNeurons: Double = 0
    var r2StorageBytes: Double = 0
    var r2ObjectCount: Double = 0
    var r2ClassA: Double = 0
    var r2ClassB: Double = 0
    var openCode: OpenCodeUsage?
    var openCodeLimits: OpenCodeLimits?
    var openCodeError: String?
    var openCodeLimitsError: String?
    var zones: [ZoneUsage] = []
    var warnings: [String] = []

    var zoneRequests: Double { zones.reduce(0) { $0 + $1.requests } }
    var zoneBytes: Double { zones.reduce(0) { $0 + $1.bytes } }
    var zoneThreats: Double { zones.reduce(0) { $0 + $1.threats } }
    var zonePageViews: Double { zones.reduce(0) { $0 + $1.pageViews } }
    var zoneCached: Double { zones.reduce(0) { $0 + $1.cached } }

    var workerFraction: Double { workerRequests / Prefs.workerLimit }
    var d1ReadFraction: Double { d1RowsRead / Prefs.d1ReadLimit }
    var d1WriteFraction: Double { d1RowsWritten / Prefs.d1WriteLimit }
    var aiFraction: Double { aiNeurons / Prefs.aiNeuronLimit }
    var r2StorageFraction: Double { r2StorageBytes / Prefs.r2StorageLimit }
    var r2ClassAFraction: Double { r2ClassA / Prefs.r2ClassALimit }
    var r2ClassBFraction: Double { r2ClassB / Prefs.r2ClassBLimit }

    /// Highest share of any daily free-tier allowance consumed today.
    var worstFraction: Double {
        max(workerFraction, max(d1ReadFraction, max(d1WriteFraction, aiFraction)))
    }
}

struct APIError: LocalizedError {
    let message: String
    var errorDescription: String? { message }
}

final class CloudflareAPI {
    private let base = URL(string: "https://api.cloudflare.com/client/v4")!
    private let session: URLSession

    init() {
        let config = URLSessionConfiguration.ephemeral
        config.timeoutIntervalForRequest = 20
        config.timeoutIntervalForResource = 30
        config.requestCachePolicy = .reloadIgnoringLocalCacheData
        session = URLSession(configuration: config)
    }

    // MARK: - Public

    /// Zones in the account. A failure here is not fatal: Worker/D1/AI usage still works,
    /// so the caller downgrades it to a warning.
    func zones(for creds: Credentials) async throws -> [ZoneInfo] {
        var all: [ZoneInfo] = []
        var page = 1
        while page <= 5 {
            var comps = URLComponents(url: base.appendingPathComponent("zones"), resolvingAgainstBaseURL: false)!
            comps.queryItems = [
                URLQueryItem(name: "account.id", value: creds.accountID),
                URLQueryItem(name: "per_page", value: "50"),
                URLQueryItem(name: "page", value: String(page)),
                URLQueryItem(name: "order", value: "name"),
                URLQueryItem(name: "direction", value: "asc"),
            ]
            let (data, response) = try await session.data(for: authorized(URLRequest(url: comps.url!), creds))
            try Self.validate(response: response, data: data)
            guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let result = json["result"] as? [[String: Any]]
            else { throw APIError(message: "Unexpected response while listing zones.") }

            for item in result {
                guard let id = item["id"] as? String, let name = item["name"] as? String else { continue }
                all.append(ZoneInfo(id: id, name: name, status: item["status"] as? String ?? ""))
            }
            let totalPages = json["result_info"].flatMap { $0 as? [String: Any] }?["total_pages"] as? Int ?? 1
            if page >= totalPages || result.isEmpty { break }
            page += 1
        }
        return all
    }

    /// Today's usage (Cloudflare analytics days are UTC) for the account and its zones.
    func usage(for creds: Credentials, zones: [ZoneInfo]) async throws -> UsageSnapshot {
        let day = Self.todayUTC()
        let monthStart = Self.monthStartUTC()
        let query = Self.usageQuery(zoneIDs: zones.prefix(20).map(\.id), day: day)
        let body: [String: Any] = [
            "query": query,
            "variables": ["account": creds.accountID, "from": day, "to": day, "monthStart": monthStart],
        ]
        var request = URLRequest(url: base.appendingPathComponent("graphql"))
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        request = authorized(request, creds)

        let (data, response) = try await session.data(for: request)
        try Self.validate(response: response, data: data)

        guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            throw APIError(message: "Cloudflare returned an unreadable analytics response.")
        }

        let messages = (json["errors"] as? [[String: Any]] ?? []).compactMap { $0["message"] as? String }
        guard let dataNode = json["data"] as? [String: Any],
              let viewer = dataNode["viewer"] as? [String: Any]
        else {
            throw APIError(message: messages.first ?? "Analytics query failed with no details.")
        }

        var snapshot = UsageSnapshot()
        snapshot.day = day
        snapshot.fetchedAt = Date()
        if !messages.isEmpty {
            snapshot.warnings.append(contentsOf: Array(Set(messages)).sorted().prefix(3))
        }

        // Account-level: Workers, D1, Workers AI.
        let account = Self.dict(Self.arr(viewer["accounts"]).first)

        var scripts: [String: (requests: Double, errors: Double)] = [:]
        for group in Self.arr(account["workersInvocationsAdaptive"]) {
            let g = Self.dict(group)
            let name = Self.str(Self.dict(g["dimensions"])["scriptName"]) ?? "worker"
            let sum = Self.dict(g["sum"])
            let current = scripts[name] ?? (0, 0)
            scripts[name] = (
                current.requests + Self.num(sum["requests"]),
                current.errors + Self.num(sum["errors"])
            )
        }
        snapshot.scripts = scripts.map { ScriptUsage(name: $0.key, requests: $0.value.requests, errors: $0.value.errors) }
            .sorted { $0.requests > $1.requests }
        snapshot.workerRequests = snapshot.scripts.reduce(0) { $0 + $1.requests }
        snapshot.workerErrors = snapshot.scripts.reduce(0) { $0 + $1.errors }

        for group in Self.arr(account["d1AnalyticsAdaptiveGroups"]) {
            let sum = Self.dict(Self.dict(group)["sum"])
            snapshot.d1RowsRead += Self.num(sum["rowsRead"])
            snapshot.d1RowsWritten += Self.num(sum["rowsWritten"])
            snapshot.d1ReadQueries += Self.num(sum["readQueries"])
            snapshot.d1WriteQueries += Self.num(sum["writeQueries"])
        }

        for group in Self.arr(account["aiInferenceAdaptiveGroups"]) {
            snapshot.aiNeurons += Self.num(Self.dict(Self.dict(group)["sum"])["totalNeurons"])
        }

        // R2 is monthly: storage is the latest reported day, operations are month-to-date.
        var storageByDay: [String: Double] = [:]
        var objectsByDay: [String: Double] = [:]
        for group in Self.arr(account["r2StorageAdaptiveGroups"]) {
            let g = Self.dict(group)
            let dims = Self.dict(g["dimensions"])
            let maxValues = Self.dict(g["max"])
            let key = Self.str(dims["date"]) ?? ""
            storageByDay[key, default: 0] += Self.num(maxValues["payloadSize"]) + Self.num(maxValues["metadataSize"])
            objectsByDay[key, default: 0] += Self.num(maxValues["objectCount"])
        }
        if let latest = storageByDay.keys.max() {
            snapshot.r2StorageBytes = storageByDay[latest] ?? 0
            snapshot.r2ObjectCount = objectsByDay[latest] ?? 0
        }

        for group in Self.arr(account["r2OperationsAdaptiveGroups"]) {
            let g = Self.dict(group)
            let dims = Self.dict(g["dimensions"])
            let requests = Self.num(Self.dict(g["sum"])["requests"])
            let action = Self.str(dims["actionType"]) ?? ""
            switch Self.r2Class(action) {
            case .a: snapshot.r2ClassA += requests
            case .b: snapshot.r2ClassB += requests
            case .free: break
            }
        }

        // Per-zone: HTTP requests, bandwidth, threats.
        for (index, zone) in zones.prefix(20).enumerated() {
            let node = Self.dict(Self.arr(viewer["z\(index)"]).first)
            let group = Self.dict(Self.arr(node["httpRequests1dGroups"]).first)
            let sum = Self.dict(group["sum"])
            snapshot.zones.append(ZoneUsage(
                name: zone.name,
                requests: Self.num(sum["requests"]),
                pageViews: Self.num(sum["pageViews"]),
                bytes: Self.num(sum["bytes"]),
                threats: Self.num(sum["threats"]),
                cached: Self.num(sum["cachedRequests"])
            ))
        }

        return snapshot
    }

    // MARK: - Query

    static func usageQuery(zoneIDs: [String], day: String) -> String {
        let zoneBlocks = zoneIDs.enumerated().map { index, id in
            """
              z\(index): zones(filter: {zoneTag: "\(id)"}) {
                httpRequests1dGroups(limit: 1, filter: {date_geq: "\(day)", date_leq: "\(day)"}) {
                  sum { requests pageViews cachedRequests bytes threats }
                }
              }
            """
        }.joined(separator: "\n")

        return """
        query Usage($account: String!, $from: Date!, $to: Date!, $monthStart: Date!) {
          viewer {
            accounts(filter: {accountTag: $account}) {
              workersInvocationsAdaptive(limit: 1000, filter: {date_geq: $from, date_leq: $to}) {
                dimensions { date scriptName }
                sum { requests errors subrequests }
              }
              d1AnalyticsAdaptiveGroups(limit: 200, filter: {date_geq: $from, date_leq: $to}) {
                dimensions { date databaseId }
                sum { readQueries writeQueries rowsRead rowsWritten }
              }
              aiInferenceAdaptiveGroups(limit: 200, filter: {date_geq: $from, date_leq: $to}) {
                dimensions { date modelId }
                sum { totalNeurons }
              }
              r2StorageAdaptiveGroups(limit: 1000, filter: {date_geq: $monthStart, date_leq: $to}) {
                dimensions { date bucketName }
                max { payloadSize metadataSize objectCount }
              }
              r2OperationsAdaptiveGroups(limit: 1000, filter: {date_geq: $monthStart, date_leq: $to}) {
                dimensions { date bucketName actionType }
                sum { requests }
              }
            }
        \(zoneBlocks)
          }
        }
        """
    }

    static func todayUTC() -> String {
        dayString(for: Date())
    }

    static func monthStartUTC() -> String {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(identifier: "UTC")!
        let components = calendar.dateComponents([.year, .month], from: Date())
        let start = calendar.date(from: components) ?? Date()
        return dayString(for: start)
    }

    private static func dayString(for date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.timeZone = TimeZone(identifier: "UTC")
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: date)
    }

    enum R2OperationClass {
        case a, b, free
    }

    /// Cloudflare's R2 classification: writes/lists are Class A, reads are Class B,
    /// and deletes/aborts are free and do not count against either allowance.
    static func r2Class(_ actionType: String) -> R2OperationClass {
        let action = actionType.lowercased()
        if action.hasPrefix("delete") || action.hasPrefix("abort") { return .free }
        let classA = ["put", "copy", "list", "upload", "create", "complete", "lifecycle"]
        if classA.contains(where: { action.hasPrefix($0) }) { return .a }
        return .b
    }

    // MARK: - Plumbing

    private func authorized(_ request: URLRequest, _ creds: Credentials) -> URLRequest {
        var request = request
        switch creds.authMode {
        case .apiToken:
            request.setValue("Bearer \(creds.secret)", forHTTPHeaderField: "Authorization")
        case .globalKey:
            request.setValue(creds.email, forHTTPHeaderField: "X-Auth-Email")
            request.setValue(creds.secret, forHTTPHeaderField: "X-Auth-Key")
        }
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("CloudflareUsageMenubar/1.0", forHTTPHeaderField: "User-Agent")
        return request
    }

    private static func validate(response: URLResponse, data: Data) throws {
        guard let http = response as? HTTPURLResponse else {
            throw APIError(message: "No response from Cloudflare.")
        }
        guard (200..<300).contains(http.statusCode) else {
            let json = (try? JSONSerialization.jsonObject(with: data)) as? [String: Any]
            let messages = (json?["errors"] as? [[String: Any]] ?? []).compactMap { $0["message"] as? String }
            let detail = messages.isEmpty ? "HTTP \(http.statusCode)" : messages.joined(separator: "; ")
            if http.statusCode == 401 || http.statusCode == 403 {
                throw APIError(message: "Cloudflare rejected the credentials (\(http.statusCode)). \(detail)")
            }
            throw APIError(message: detail)
        }
    }

    static func dict(_ value: Any?) -> [String: Any] { value as? [String: Any] ?? [:] }
    static func arr(_ value: Any?) -> [Any] { value as? [Any] ?? [] }
    static func str(_ value: Any?) -> String? {
        if let s = value as? String, !s.isEmpty { return s }
        return nil
    }
    static func num(_ value: Any?) -> Double {
        if let d = value as? Double { return d }
        if let i = value as? Int { return Double(i) }
        if let n = value as? NSNumber { return n.doubleValue }
        if let s = value as? String, let d = Double(s) { return d }
        return 0
    }
}
