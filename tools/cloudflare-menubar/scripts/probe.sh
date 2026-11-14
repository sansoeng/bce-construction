#!/usr/bin/env bash
# Prints today's usage using the repo's .env credentials (global key) or the
# app's stored Keychain credentials. Read-only: only analytics endpoints are called.
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
APP="$REPO/tools/cloudflare-menubar/build/Cloudflare Usage.app/Contents/MacOS/CFMenuBar"

if [ ! -x "$APP" ]; then
  "$REPO/tools/cloudflare-menubar/scripts/build.sh" >/dev/null
fi

if [ -f "$REPO/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$REPO/.env"
  set +a
fi

export CF_MENUBAR_ACCOUNT="${CF_MENUBAR_ACCOUNT:-${CLOUDFLARE_ACCOUNT_ID:-}}"
if [ -z "${CF_MENUBAR_TOKEN:-}" ] && [ -z "${CF_MENUBAR_KEY:-}" ] && [ -n "${CLOUDFLARE_API_KEY:-}" ]; then
  export CF_MENUBAR_KEY="$CLOUDFLARE_API_KEY"
  export CF_MENUBAR_EMAIL="${CF_MENUBAR_EMAIL:-${CLOUDFLARE_EMAIL:-}}"
fi

exec "$APP" --probe
