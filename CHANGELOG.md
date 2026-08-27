# Agilite Tracker Changelog

All notable changes to the personal Agilite Tracker Android application are documented here.

## [1.0.6] — 2026-08-27

### Added

- Direct APK publishing on the GitHub Releases page alongside the standard Actions artifact.
- Automated release notes containing app version, Android versionCode, package identity, signing status, target ABI, commit, workflow run, and direct APK URL.
- Persistent GitHub Actions signing using the repository-managed `AGILITE_KEYSTORE_BASE64` secret.
- Settings-only diagnostics information for troubleshooting native builds and local storage.

### Changed

- Improved Android-safe dashboard rendering for the Review gaps and Status board actions.
- Added explicit dashboard horizontal insets so header and hero content do not touch the screen edge.
- Tightened the dashboard’s vertical rhythm across the header, progress card, status metrics, quick actions, and attention section.
- Replaced fragile flex-expanded metric cards with explicit two-column content-sized slots.
- Preserved offline-first local storage with AsyncStorage and the unchanged package identity `com.app.agilitecollectiontracker`.

### Fixed

- Android package-conflict upgrades caused by a newly generated signing key on every build.
- Oversized status cards and compressed quick-action placement on portrait Android screens.
- Launcher and adaptive-icon scorpion clipping through safer native asset margins.

## [1.0.5]

- Switched to bundled release APK generation through GitHub Actions.
- Added the direct APK Release asset workflow and arm64-v8a personal-use build target.
- Added local regional-link editing and keyboard-safe save behavior.

## [1.0.4]

- Added explicit startup splash dismissal for release builds.
- Improved Android rendering stability for catalog rows and dashboard content.

## [1.0.3]

- Added the Agilite scorpion branding across launcher, splash, favicon, adaptive icon, and in-app header.
- Added the Dashboard, Catalog, Status Board, Item Detail, Settings, and Diagnostics experiences.

[1.0.6]: https://github.com/Beetheboss/Agilite-app/releases/tag/agilite-tracker-v1.0.6-build-12
[1.0.5]: https://github.com/Beetheboss/Agilite-app/releases/tag/agilite-tracker-v1.0.6-build-11
