import AppKit

let arguments = CommandLine.arguments

if arguments.contains("--help") || arguments.contains("-h") {
    print("""
    Cloudflare Usage — a menu bar tracker for Cloudflare's daily free-tier usage.

    Usage:
      CFMenuBar             Run the menu bar app (no Dock icon).
      CFMenuBar --probe     Print today's usage to stdout and exit.
      CFMenuBar --version   Print the version.
      CFMenuBar --help      Show this help.

    Credentials are stored in the login Keychain and edited from Settings…
    For headless runs you can override them with:
      CF_MENUBAR_ACCOUNT, CF_MENUBAR_TOKEN
      CF_MENUBAR_ACCOUNT, CF_MENUBAR_KEY, CF_MENUBAR_EMAIL
    """)
    exit(0)
}

if arguments.contains("--version") {
    print("Cloudflare Usage 1.0.0")
    exit(0)
}

if arguments.contains("--probe") {
    Probe.run()
}

let application = NSApplication.shared
let delegate = AppDelegate()
application.delegate = delegate
application.setActivationPolicy(.accessory)
application.run()
