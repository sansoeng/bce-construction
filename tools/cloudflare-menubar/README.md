# Cloudflare Usage (macOS menu bar)

A tiny native menu bar app that shows today's Cloudflare usage right next to the
Wi‑Fi and battery icons:

```
☁ 184
```

Clicking it opens a breakdown of the free-plan allowances that actually matter
for this project:

| Row | Free-plan daily allowance |
| --- | --- |
| Workers requests | 100,000 |
| D1 rows read | 5,000,000 |
| D1 rows written | 100,000 |
| Workers AI neurons | 10,000 |
| Site requests / bandwidth / threats | informational, per zone |

Numbers turn orange at 75% and red at 90% of an allowance. Analytics days are
Cloudflare's UTC days, so the counter resets at 00:00 UTC (07:00 in Cambodia).

## Install

```bash
cd tools/cloudflare-menubar
./scripts/install.sh
```

The script compiles the app with the Command Line Tools (no Xcode project,
Homebrew, or SwiftBar needed), installs it to `/Applications` (or
`~/Applications` when that isn't writable), and launches it.

On first launch it opens **Settings**. You need:

1. **Account ID** — from the dashboard URL or `npx wrangler whoami`.
2. **An API token** — create one at
   [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
   with these permissions:
   - Account → **Account Analytics** → Read
   - Zone → **Analytics** → Read
   - Zone → **Zone** → Read  *(so the app can list your sites)*

   Scope it to your account and, if you like, only the zones you care about.
   The narrower token is preferable to the global API key, but the app supports
   both (choose "Global API key" and enter the account email).

Click **Test connection**, then **Save**.

Or skip the window entirely and configure from the terminal:

```bash
./scripts/configure.sh <account-id> <api-token>
# global key instead of a token:
./scripts/configure.sh <account-id> <global-key> <account-email> --global-key
```

The script verifies the credentials with a read-only call before saving, then
hands them to the app so the Keychain item is created by the app itself.

> Missing site numbers? The token can only read zones it is scoped to. A global
> API key or a token with Zone → Zone → Read fixes it.

### Positioning

macOS puts new menu bar items to the left of the system cluster. Hold **⌘** and
drag the cloud icon to move it exactly where you want it.

## What the menu does

- **Workers requests / D1 / Workers AI / Site requests** — today's totals against
  the configured limits, with per-script and per-zone breakdowns in submenus.
- **Menu bar shows** — pick which number appears next to the cloud:
  Worker requests (default), site requests, D1 rows read, or the highest
  percentage of any allowance.
- **Refresh every** — 1, 5 (default), 15 or 60 minutes. The menu also refreshes
  on open, when the Mac wakes, and whenever you click **Refresh now** (⌘R).
- **Open Cloudflare dashboard** (⌘D), **Settings…** (⌘,), **Launch at login**,
  **Quit** (⌘Q).
- Submenu rows for zones open that zone's dashboard.

The app also warns in the menu when the API rejects the credentials or when the
token cannot read zone analytics.

## Configuration

- Credentials live in the login **Keychain** (service
  `com.bce.cloudflare-menubar`), never in a plain-text file.
- Preferences (account ID, display mode, refresh interval, limits) live in
  `~/Library/Preferences/com.bce.cloudflare-menubar.plist`.
- Daily allowances are editable in **Settings → Daily allowances** — raise them
  if you move off the Free plan.
- Headless setup: launching the app with `CF_MENUBAR_STORE_ENV=1` and
  `CF_MENUBAR_ACCOUNT` + `CF_MENUBAR_TOKEN` (or `CF_MENUBAR_KEY` +
  `CF_MENUBAR_EMAIL`) saves those credentials to the Keychain on start.
  `scripts/configure.sh` wraps that flow.

## Verify from the terminal

```bash
# Uses CF_MENUBAR_ACCOUNT + CF_MENUBAR_TOKEN, or the stored Keychain credentials.
./build/"Cloudflare Usage.app"/Contents/MacOS/CFMenuBar --probe

# Or, using the repo's .env (global key) for a quick check:
npm run menubar:probe
```

`--probe` prints exactly what the menu would show and exits non-zero on failure,
which makes it handy for scripts.

## Development

```
tools/cloudflare-menubar/
├── Sources/
│   ├── main.swift             # entry point, --probe/--help/--version
│   ├── AppDelegate.swift      # lifecycle, refresh timer, wake handling, settings window
│   ├── StatusController.swift # status item, menu, actions
│   ├── UsageStore.swift       # fetch orchestration, last-good snapshot, error state
│   ├── CloudflareAPI.swift    # REST zone list + GraphQL analytics query
│   ├── Prefs.swift            # UserDefaults, Keychain, credentials
│   ├── SettingsView.swift     # SwiftUI settings form + validation
│   ├── Format.swift           # compact numbers, bytes, percentages
│   └── Probe.swift            # headless output
├── Resources/Info.plist
└── scripts/
    ├── build.sh               # swiftc → build/Cloudflare Usage.app (ad-hoc signed)
    ├── install.sh             # build + copy to /Applications + launch
    ├── uninstall.sh           # app, login item, prefs, Keychain
    ├── configure.sh           # verify + store credentials headlessly
    ├── probe.sh               # probe using repo .env
    └── make-icon.swift        # renders the app icon
```

```bash
npm run menubar:build      # compile only
npm run menubar:install    # build + install + launch
npm run menubar:probe      # print today's usage
npm run menubar:configure -- <account-id> <api-token>
```

### API notes

One GraphQL request per refresh (`https://api.cloudflare.com/client/v4/graphql`)
combines `workersInvocationsAdaptive`, `d1AnalyticsAdaptiveGroups`,
`aiInferenceAdaptiveGroups` and one `httpRequests1dGroups` block per zone
(up to 20 zones). Zone names come from `GET /zones?account.id=…`.

Cloudflare's analytics pipeline can lag a few minutes behind live traffic, so
the menu bar is a guide, not a billing meter. For exact enforcement, check the
dashboard.

## Uninstall

```bash
./scripts/uninstall.sh
```

That stops the app, removes it from `/Applications` and `~/Applications`, deletes
the login item, preferences, and the Keychain items.
