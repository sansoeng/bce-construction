import Foundation

/// Number/byte formatting shared by the menu bar title and the menu rows.
enum Fmt {
    /// 653 → "653", 12_340 → "12.3k", 1_240_000 → "1.24M"
    static func compact(_ value: Double) -> String {
        let v = max(0, value)
        if v < 1_000 { return String(Int(v.rounded())) }
        if v < 1_000_000 { return trimmed(v / 1_000) + "k" }
        if v < 1_000_000_000 { return trimmed(v / 1_000_000) + "M" }
        return trimmed(v / 1_000_000_000) + "B"
    }

    /// 100_000 → "100,000" — used for quota limits so they stay readable.
    static func grouped(_ value: Double) -> String {
        let f = NumberFormatter()
        f.numberStyle = .decimal
        f.maximumFractionDigits = value.rounded() == value ? 0 : 1
        return f.string(from: NSNumber(value: value)) ?? String(Int(value))
    }

    static func decimal(_ value: Double, digits: Int = 1) -> String {
        if value == 0 { return "0" }
        if value < 0.01 { return String(format: "%.3f", value) }
        let f = NumberFormatter()
        f.numberStyle = .decimal
        f.minimumFractionDigits = 0
        f.maximumFractionDigits = digits
        return f.string(from: NSNumber(value: value)) ?? String(format: "%.\(digits)f", value)
    }

    static func bytes(_ value: Double) -> String {
        let units = ["B", "KB", "MB", "GB", "TB"]
        var v = max(0, value)
        var i = 0
        while v >= 1024, i < units.count - 1 {
            v /= 1024
            i += 1
        }
        if i == 0 { return String(Int(v.rounded())) + " B" }
        return decimal(v, digits: v >= 100 ? 0 : 1) + " " + units[i]
    }

    /// 0.007 → "0.7%", 0.42 → "42%"
    static func percent(_ fraction: Double) -> String {
        let p = max(0, fraction) * 100
        if p == 0 { return "0%" }
        if p < 1 { return String(format: "%.2f%%", p) }
        if p < 10 { return String(format: "%.1f%%", p) }
        return String(format: "%.0f%%", p)
    }

    /// Tiny text gauge: 8 cells, filled proportionally.
    static func bar(_ fraction: Double) -> String {
        let cells = 8
        let clamped = min(max(fraction, 0), 1)
        let filled = Int((clamped * Double(cells)).rounded())
        return String(repeating: "▮", count: filled) + String(repeating: "▯", count: cells - filled)
    }

    private static func trimmed(_ v: Double) -> String {
        if v >= 100 { return String(Int(v.rounded())) }
        if v >= 10 { return String(format: "%.1f", v) }
        return String(format: "%.2f", v)
    }
}
