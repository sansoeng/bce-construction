#!/usr/bin/env bash
# Removes the app, its login item, preferences and Keychain entry.
set -euo pipefail

pkill -x CFMenuBar 2>/dev/null || true

rm -rf "/Applications/Cloudflare Usage.app" "$HOME/Applications/Cloudflare Usage.app"
rm -f "$HOME/Library/LaunchAgents/com.bce.cloudflare-menubar.plist"
defaults delete com.bce.cloudflare-menubar 2>/dev/null || true

# Two Keychain items: the secret and the account email.
for _ in 1 2 3; do
  security delete-generic-password -s com.bce.cloudflare-menubar >/dev/null 2>&1 || break
done

echo "==> Cloudflare Usage removed."
