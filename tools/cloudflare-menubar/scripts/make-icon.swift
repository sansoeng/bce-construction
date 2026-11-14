#!/usr/bin/env swift
// Renders the app icon (orange rounded square + white cloud) to a 1024pt PNG.
// Usage: swift scripts/make-icon.swift build/icon.png

import AppKit

let output = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "icon.png"
let side = 1024

guard let rep = NSBitmapImageRep(
    bitmapDataPlanes: nil,
    pixelsWide: side,
    pixelsHigh: side,
    bitsPerSample: 8,
    samplesPerPixel: 4,
    hasAlpha: true,
    isPlanar: false,
    colorSpaceName: .deviceRGB,
    bytesPerRow: 0,
    bitsPerPixel: 0
) else {
    FileHandle.standardError.write(Data("Could not allocate icon bitmap\n".utf8))
    exit(1)
}

NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
NSGraphicsContext.current?.imageInterpolation = .high

let canvas = NSRect(x: 0, y: 0, width: side, height: side)
NSColor.clear.setFill()
canvas.fill()

// Rounded-square background with the Cloudflare orange gradient.
let background = NSBezierPath(roundedRect: canvas.insetBy(dx: 44, dy: 44), xRadius: 210, yRadius: 210)
let gradient = NSGradient(colors: [
    NSColor(srgbRed: 0.98, green: 0.56, blue: 0.13, alpha: 1),
    NSColor(srgbRed: 0.94, green: 0.36, blue: 0.07, alpha: 1),
])!
gradient.draw(in: background, angle: -90)

// White cloud built from overlapping circles and a rounded base.
NSColor.white.setFill()
NSBezierPath(ovalIn: NSRect(x: 268, y: 430, width: 250, height: 250)).fill()
NSBezierPath(ovalIn: NSRect(x: 404, y: 468, width: 300, height: 300)).fill()
NSBezierPath(ovalIn: NSRect(x: 604, y: 404, width: 252, height: 252)).fill()
NSBezierPath(roundedRect: NSRect(x: 268, y: 392, width: 588, height: 246), xRadius: 123, yRadius: 123).fill()

NSGraphicsContext.restoreGraphicsState()

guard let png = rep.representation(using: .png, properties: [:]) else {
    FileHandle.standardError.write(Data("Could not encode icon PNG\n".utf8))
    exit(1)
}
try png.write(to: URL(fileURLWithPath: output))
print("Wrote \(output)")
