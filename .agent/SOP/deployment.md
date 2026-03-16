# Packaging & Distribution — Danish Practice Generator

**Last Updated**: 2026-03-16

## Build Tool

electron-builder (or electron-forge)

## Platforms

| Platform | Format | Command |
|----------|--------|---------|
| Windows | NSIS installer | `npm run build:win` |
| macOS | DMG | `npm run build:mac` |
| Linux | AppImage / deb | `npm run build:linux` |

## Pre-Build Checklist

- [ ] All tests pass
- [ ] Type checking clean (`npx tsc --noEmit`)
- [ ] Version bumped in package.json
- [ ] Exercise content included in build
- [ ] SQLite binary compatible with target platform

## Auto-Update

Use electron-updater for auto-update capability. Configure update server or GitHub Releases.

## Code Signing

- Windows: requires code signing certificate for trusted installs
- macOS: requires Apple Developer certificate + notarization
- Linux: no signing needed for AppImage
