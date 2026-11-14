import Foundation

/// Launch-at-login without SMAppService, so an ad-hoc signed local build keeps working.
/// Writes ~/Library/LaunchAgents/com.bce.cloudflare-menubar.plist for the current app path.
enum LoginItem {
    static let label = "com.bce.cloudflare-menubar"

    static var plistURL: URL {
        FileManager.default.homeDirectoryForCurrentUser
            .appendingPathComponent("Library/LaunchAgents/\(label).plist")
    }

    static var isEnabled: Bool {
        FileManager.default.fileExists(atPath: plistURL.path)
    }

    @discardableResult
    static func setEnabled(_ enabled: Bool) -> Bool {
        if enabled {
            let executable = Bundle.main.executablePath ?? CommandLine.arguments[0]
            let plist = """
            <?xml version="1.0" encoding="UTF-8"?>
            <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
            <plist version="1.0">
            <dict>
              <key>Label</key>
              <string>\(label)</string>
              <key>ProgramArguments</key>
              <array>
                <string>\(executable)</string>
              </array>
              <key>RunAtLoad</key>
              <true/>
              <key>KeepAlive</key>
              <false/>
              <key>ProcessType</key>
              <string>Interactive</string>
              <key>LimitLoadToSessionType</key>
              <string>Aqua</string>
            </dict>
            </plist>
            """
            do {
                try FileManager.default.createDirectory(
                    at: plistURL.deletingLastPathComponent(),
                    withIntermediateDirectories: true
                )
                try plist.write(to: plistURL, atomically: true, encoding: .utf8)
                return true
            } catch {
                NSLog("CloudflareUsage: could not write login item: \(error)")
                return false
            }
        } else {
            try? FileManager.default.removeItem(at: plistURL)
            return true
        }
    }
}
