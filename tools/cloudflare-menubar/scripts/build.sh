#!/usr/bin/env bash
# Builds "Cloudflare Usage.app" into ./build. No Xcode project needed — the
# Command Line Tools' swiftc is enough.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

APP_NAME="Cloudflare Usage"
BUNDLE="$ROOT/build/$APP_NAME.app"
ARCH="$(uname -m)"

rm -rf "$BUNDLE"
mkdir -p "$BUNDLE/Contents/MacOS" "$BUNDLE/Contents/Resources"

echo "==> Compiling (${ARCH})"
swiftc \
  -O \
  -swift-version 5 \
  -target "${ARCH}-apple-macosx13.0" \
  -framework AppKit \
  -framework SwiftUI \
  -framework Security \
  -o "$BUNDLE/Contents/MacOS/CFMenuBar" \
  Sources/*.swift

cp Resources/Info.plist "$BUNDLE/Contents/Info.plist"

# Icon is generated once and cached in build/.
ICON="$ROOT/build/AppIcon.icns"
if [ ! -f "$ICON" ]; then
  echo "==> Generating app icon"
  mkdir -p "$ROOT/build"
  swift scripts/make-icon.swift "$ROOT/build/icon-1024.png" >/dev/null
  ICONSET="$ROOT/build/AppIcon.iconset"
  rm -rf "$ICONSET"
  mkdir -p "$ICONSET"
  for pair in "16 16" "32 16@2x" "32 32" "64 32@2x" "128 128" "256 128@2x" "256 256" "512 256@2x" "512 512" "1024 512@2x"; do
    size="${pair%% *}"
    name="${pair##* }"
    sips -z "$size" "$size" "$ROOT/build/icon-1024.png" --out "$ICONSET/icon_${name}.png" >/dev/null
  done
  iconutil -c icns "$ICONSET" -o "$ICON"
  rm -rf "$ICONSET" "$ROOT/build/icon-1024.png"
fi
cp "$ICON" "$BUNDLE/Contents/Resources/AppIcon.icns"

# Ad-hoc signature: enough for Keychain access and LaunchAgent starts on this Mac.
codesign --force --sign - --identifier com.bce.cloudflare-menubar "$BUNDLE" >/dev/null 2>&1 || true

echo "==> Built $BUNDLE"
echo "    Run: open \"$BUNDLE\""
