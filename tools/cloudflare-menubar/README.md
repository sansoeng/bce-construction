# Cloudflare & OpenCode Usage (macOS menu bar)

A tiny native menu bar app that puts Cloudflare and OpenCode usage right next to
the Wi‑Fi and battery icons:

```
☁ CF 0.2% · OC 5%
```

Cloudflare percentage first, OpenCode monthly percentage second. Clicking it
opens the full breakdown, each row tagged with its cadence:

| Row | Allowance | Cadence |
| --- | --- | --- |
| Workers requests | 100,000 | **daily** (00:00 UTC) |
| D1 rows read | 5,000,000 | **daily** |
| D1 rows written | 100,000 | **daily** |
| Workers AI neurons | 10,000 | **daily** |
| R2 storage | 10 GB-month | **monthly** (1st, UTC) |
| R2 Class A operations | 1,000,000 | **monthly** |
| R2 Class B operations | 10,000,000 | **monthly** |
| Site requests / bandwidth / threats | informational | today |
| OpenCode Go monthly | 100% of the model allowance | **monthly** |
| OpenCode Go weekly | 50% of the monthly allowance | **weekly** |
| OpenCode Go 5-hour | 20% of the monthly allowance | **rolling 5 hours** |
| OpenCode tokens | usage only, no allowance | today (local midnight) |

Cloudflare has **no weekly allowances** — only daily and monthly. OpenCode Go
sits on top of that with a rolling 5-hour window and a weekly window carved out
of its monthly allowance. Pages builds (500/month) are not tracked; site
requests and bandwidth are unlimited on the Free plan and shown for context.

Numbers turn orange at 75% and red at 90% of an allowance. Cloudflare analytics
days are UTC, so daily counters reset at 00:00 UTC (07:00 in Cambodia).

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

### Several Cloudflare accounts

One credential can monitor more than one account — for example a personal account
and a client account that granted you access. Add them in **Settings → Cloudflare
→ Accounts → Add account**, give each a name, and save. The menu then shows a
section per account, the menu bar uses the busiest account for percentages, and
absolute counts (workers, D1, site requests) are summed.

You can also seed the list from the terminal:

```bash
CF_MENUBAR_ACCOUNTS="<account-id>:BCE,<account-id>:Overland" \
  ./scripts/configure.sh <account-id> <global-key> <email> --global-key
```

The credential itself (token or key + email) is shared by every account, so there
is only one Keychain item. The account list lives in
`~/Library/Preferences/com.bce.cloudflare-menubar.plist`.

OpenCode usage is local to the Mac, not per account, so it is queried once.

### Positioning

macOS puts new menu bar items to the left of the system cluster. Hold **⌘** and
drag the cloud icon to move it exactly where you want it.

## What the menu does

- **Workers requests / D1 / Workers AI** — today's totals against the daily
  allowances, tagged `daily`, with per-script breakdowns in a submenu.
- **R2 storage / Class A / Class B** — month-to-date totals against the monthly
  allowances, tagged `monthly`. R2 must be enabled in the Cloudflare dashboard;
  until it is, the rows show zero.
- **Site requests** — today's requests, bandwidth, threats and cached hits per
  zone, tagged `today`.
- **OpenCode Go** — the monthly percentage first (the top-level allowance),
  then weekly (50% of it) and 5-hour (20% of it), each with its reset time.
- **OpenCode** — today's local token usage (input, output, reasoning, cache
  reads), steps, sessions and cost, plus a 30-day total, in a submenu.
- **Resets** — shows the next daily and monthly Cloudflare rollover in local time.
- **Menu bar shows** — the default is **Cloudflare + OpenCode**
  (`CF 0.2% · OC 5%`), where OC is the monthly window. Also available:
  Cloudflare daily %, OpenCode monthly/weekly/5-hour %, worker requests, site
  requests, D1 rows read, and OpenCode tokens.
- **Refresh every** — 1, 5 (default), 15 or 60 minutes. The menu also refreshes
  on open, when the Mac wakes, and whenever you click **Refresh now** (⌘R).
- **Open Cloudflare dashboard** (⌘D), **Settings…** (⌘,), **Launch at login**,
  **Quit** (⌘Q).
- Submenu rows for zones open that zone's dashboard.

The app also warns in the menu when the API rejects the credentials or when the
token cannot read zone analytics.

### OpenCode

Two local sources feed the OpenCode section:

- **Percentages** come from OpenCode Go's own usage endpoint,
  `GET https://opencode.ai/zen/go/v1/usage`, authenticated with the key OpenCode
  already has (`opencode auth export`). It returns the share used and the reset
  time for the 5-hour, weekly and monthly windows. The key is used only for that
  request — it is never displayed, logged or stored by this app.
- **Tokens and cost** come from `opencode stats --json --cost --days 1` (plus a
  `--days 30` call for the 30-day total). On the flat-rate `opencode-go` plan the
  cost shows as “no extra charge”; on a metered provider the actual cost appears.

If the CLI cannot be found, the row says so and Settings has a path override. If
OpenCode Go is not connected, percentages show as unavailable while tokens keep
working.

## Configuration

- Credentials live in the login **Keychain** (service
  `com.bce.cloudflare-menubar`), never in a plain-text file. They are shared by
  every monitored account.
- The **account list** (IDs + display names) and preferences (display mode,
  refresh interval, limits) live in
  `~/Library/Preferences/com.bce.cloudflare-menubar.plist`.
- Daily allowances are editable in **Settings → Allowances → Daily** — raise them
  if you move off the Free plan.
- R2 allowances live in **Settings → Allowances → Monthly (R2)**.
- OpenCode tracking can be disabled, and its CLI path overridden, in
  **Settings → OpenCode**. The app auto-detects
  `~/.opencode/bin/opencode`, Homebrew paths and anything on `PATH`.
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
│   ├── OpenCodeUsage.swift    # `opencode stats` + Go usage endpoint
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
`aiInferenceAdaptiveGroups`, `r2StorageAdaptiveGroups`,
`r2OperationsAdaptiveGroups` and one `httpRequests1dGroups` block per zone
(up to 20 zones). Zone names come from `GET /zones?account.id=…`.

R2 analytics is queried month-to-date (the API rejects R2 ranges wider than
4 weeks); storage uses the latest reported day, while Class A/B operations are
summed. Class A is writes and listings, Class B is reads, and deletes/aborts are
free operations and excluded.

OpenCode Go percentages come from `https://opencode.ai/zen/go/v1/usage` with the
key from `opencode auth export`; that endpoint reports the used share (0–100)
and reset time for the 5-hour, weekly and monthly windows. The monthly window is
the headline because weekly and 5-hour are shares of it.

Cloudflare's analytics pipeline can lag a few minutes behind live traffic, so
the menu bar is a guide, not a billing meter. For exact enforcement, check the
dashboard.

## Uninstall

```bash
./scripts/uninstall.sh
```

That stops the app, removes it from `/Applications` and `~/Applications`, deletes
the login item, preferences, and the Keychain items.
