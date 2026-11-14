#!/usr/bin/env bash
# Stores Cloudflare credentials for the menu bar app without opening Settings.
#
#   ./scripts/configure.sh <account-id> <api-token>
#   ./scripts/configure.sh <account-id> <global-key> <email> --global-key
#
# The token/key is verified with a read-only analytics call before anything is saved,
# then handed to the app through its environment so the app itself writes the
# Keychain item (no "wants to access" prompt on later launches).
set -euo pipefail

ACCOUNT="${1:-}"
SECRET="${2:-}"
EMAIL="${3:-}"
MODE="${4:-token}"

if [ -z "$ACCOUNT" ]; then
  echo "usage: $0 <account-id> <api-token|global-key> [email] [--global-key]" >&2
  exit 64
fi

if [ -z "$SECRET" ]; then
  printf "Paste the %s: " "$([ "$MODE" = "--global-key" ] && echo "global API key" || echo "API token")" >&2
  read -rs SECRET
  echo >&2
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP="/Applications/Cloudflare Usage.app"
[ -d "$APP" ] || APP="$HOME/Applications/Cloudflare Usage.app"
[ -d "$APP" ] || { echo "Install the app first: $ROOT/scripts/install.sh" >&2; exit 1; }
BIN="$APP/Contents/MacOS/CFMenuBar"

ENV=(CF_MENUBAR_ACCOUNT="$ACCOUNT")
if [ "$MODE" = "--global-key" ] || [ "$MODE" = "global-key" ]; then
  [ -n "$EMAIL" ] || { echo "Global API key authentication also needs the account email." >&2; exit 64; }
  ENV+=(CF_MENUBAR_KEY="$SECRET" CF_MENUBAR_EMAIL="$EMAIL")
else
  ENV+=(CF_MENUBAR_TOKEN="$SECRET")
fi

echo "==> Verifying credentials" >&2
if ! env "${ENV[@]}" "$BIN" --probe >/dev/null; then
  echo "Credentials were rejected; nothing was saved." >&2
  exit 1
fi

echo "==> Saving to Keychain" >&2
pkill -x CFMenuBar 2>/dev/null || true
sleep 0.3
env "${ENV[@]}" CF_MENUBAR_STORE_ENV=1 "$BIN" >/dev/null 2>&1 &
APP_PID=$!
sleep 2
kill "$APP_PID" 2>/dev/null || true
wait "$APP_PID" 2>/dev/null || true

open "$APP"
echo "==> Done. The cloud icon is in your menu bar." >&2
