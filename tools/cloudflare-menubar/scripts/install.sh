#!/usr/bin/env bash
# Builds and installs the app into /Applications (or ~/Applications), then launches it.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
"$ROOT/scripts/build.sh"

DEST="/Applications"
if [ ! -w "$DEST" ]; then
  DEST="$HOME/Applications"
fi
mkdir -p "$DEST"

pkill -x CFMenuBar 2>/dev/null || true
rm -rf "$DEST/Cloudflare Usage.app"
ditto "$ROOT/build/Cloudflare Usage.app" "$DEST/Cloudflare Usage.app"
xattr -dr com.apple.quarantine "$DEST/Cloudflare Usage.app" 2>/dev/null || true

open "$DEST/Cloudflare Usage.app"
echo "==> Installed $DEST/Cloudflare Usage.app"
echo "    First launch asks for your Cloudflare account ID and an API token."
