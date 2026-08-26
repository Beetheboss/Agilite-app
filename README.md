# Agilite Collection Tracker

Offline-first Expo/React Native Android app for tracking an Agilite collectible merchandise collection, regional product links, images, and collection status.

The app remains built with Expo SDK 54 internally, but this repository includes a GitHub Actions workflow that builds a shareable Android APK on GitHub’s runners instead of using Expo’s cloud build service.

## Build a shareable APK on GitHub

1. Open the repository’s **Actions** tab on GitHub.
2. Select **Build Android APK** in the workflow list.
3. Select **Run workflow**, keep the `main` branch selected, and confirm.
4. Wait for the workflow to finish.
5. Open the completed workflow run, scroll to **Artifacts**, and download `agilite-collection-tracker-debug-apk`.
6. Extract the downloaded ZIP and install `app-debug.apk` on your Android device. Android may require permission to install apps from the browser or file manager.

This workflow intentionally creates a **debug APK** targeting `arm64-v8a`, the architecture used by most current Android phones and tablets. It is appropriate for personal use and direct sharing with trusted people. Very old 32-bit-only Android devices are not targeted. A signed release APK for broader distribution would require adding an Android keystore and GitHub Actions secrets.

## Local development

```bash
pnpm install
pnpm dev
```

The app is designed to work offline for its core collection-tracking features. Catalog data, status changes, and regional-link overrides are stored locally on the device.

## Repository safety

The repository excludes dependencies, Expo caches, generated native folders, local logs, environment files, keystores, and other machine-specific artifacts. Never commit API keys, signing files, or personal credentials.
