# Project TODO

- [x] Offline local catalog storage with AsyncStorage
- [x] Bundle the 110-record Agilite collectible and merchandise catalog
- [x] Collection dashboard with progress counts
- [x] Searchable and filterable catalog list
- [x] Product detail screen with regional link evidence
- [x] Four status controls: Owned, Missing Link, Verified, Not Found
- [x] Status board grouped by collection status
- [x] Local reset-to-original-catalog action
- [x] Dark tactical-catalog visual theme
- [x] Portrait one-handed layout and accessible touch targets
- [x] Custom app icon and splash branding
- [x] Unit tests for persistence, filtering, status updates, and reset behavior
- [x] TypeScript and lint validation
- [x] Final checkpoint and APK delivery guidance

- [x] Replace the catalog-style icon with a proper Agilite scorpion logo and update all launcher/splash copies
- [x] Verify the new branded app and save an updated checkpoint

- [x] Replace the generated scorpion icon with an adaptation based on the user-supplied 1000131888.png reference
- [x] Verify all launcher/splash copies and save a new checkpoint

- [x] Fix oversized blank catalog rows visible on portrait Android screens
- [x] Verify compact catalog rows and save a new checkpoint

- [x] Fix oversized blank Overview quick-action rows and Needs Attention cards on portrait Android screens
- [x] Improve the launcher/header scorpion logo crop so the full mark remains recognizable
- [x] Verify Overview and Catalog layouts and save a new checkpoint

- [x] Diagnose why the Android build still shows blank Overview content despite the prior layout changes
- [x] Apply and verify a native-safe rendering fix in the installed build path
- [x] Save a new checkpoint only after the actual Android rendering issue is resolved

- [x] Audit stale bundle, release typography, adaptive icon, flex/gap, and Android build configuration failure causes
- [x] Apply compatibility fixes for all confirmed Android failure causes
- [x] Validate the production configuration and prepare a fresh APK checkpoint

- [x] Diagnose the EAS Android Gradle build failure shown in the Publish panel
- [x] Remove or correct the native configuration/dependency causing the release build failure
- [x] Validate a clean Expo production configuration and save a new APK-ready checkpoint

- [x] Diagnose why the APK builder is still using the stale Version 1.0.4 draft instead of the repaired checkpoint
- [x] Align app and checkpoint release metadata with the builder’s active version
- [x] Validate synchronization and save a clean APK-ready checkpoint

- [x] Audit why the Publish panel still exposes an unpublished backend for this offline-only app
- [x] Remove unnecessary backend/build coupling from the release configuration
- [x] Validate the clean offline release and save a final APK checkpoint

- [x] Restore Expo New Architecture because Reanimated 4 explicitly requires it
- [x] Validate the corrected native configuration and save a new APK checkpoint

- [x] Add a Settings-only diagnostics screen with comprehensive non-secret app/runtime information
- [x] Add a Settings navigation entry and screenshot-friendly sections
- [x] Verify the diagnostics screen and save a new checkpoint

- [x] Fix missing item titles and oversized blank rows in Catalog on standalone Android
- [x] Fix missing item titles and oversized blank rows in Statuses on standalone Android
- [x] Verify Overview, Catalog, Statuses, Item Detail, Settings, and Diagnostics without regressions
- [x] Save a new checkpoint only after all affected routes pass validation

- [x] Collect official public product images for 65 of 82 patch records and record source provenance
- [x] Bundle optimized local patch thumbnails and show them in Catalog, Statuses, and Item Detail
- [x] Show an explicit unavailable-image marker for patch records without a verified public image
- [ ] Continue searching external evidence for the 17 patch records with no verified public image

- [x] Audit the uploaded Agilite.xlsx links for the 17 patch records without verified images
- [x] Extract and validate exact images from workbook-linked pages
- [x] Bundle any newly verified images and save an updated checkpoint

- [x] Add clear tappable Open Link controls for every working regional URL
- [x] Keep unavailable and not-found regions visibly non-tappable
- [x] Verify link opening behavior and save a new checkpoint

- [x] Add local editing for US, Israel, and International product URLs
- [x] Validate and persist edited links without changing collection statuses
- [x] Verify editing, opening, and reset behavior, then save a checkpoint

- [x] Download and match the official Scorpo-copter T-shirt image from the supplied product page
- [x] Audit every catalog record with a working regional link for a missing image
- [x] Bundle verified image additions and save a new checkpoint

- [ ] Search official and public evidence for the 16 screenshot-identified missing patch images
- [ ] Add only exact, provenance-backed matches and preserve unavailable markers for unresolved patches
- [ ] Verify the patch-image results in the app and save a new checkpoint

- [x] Diagnose why Android link edits do not save from Item Detail
- [x] Implement an explicit keyboard-safe Save flow with validation feedback
- [x] Verify saved links persist after reopening and do not break Open controls

- [x] Polish the mobile visual system for consistent field-log hierarchy and contrast
- [x] Refine dashboard, catalog, statuses, settings, diagnostics, and item detail presentation
- [x] Capture and review portrait screenshots for all polished routes
- [x] Save a checkpoint for the UI polish pass

## Follow-up polish from Android review

- [x] Rebuild the home quick-action rows with an Android-safe horizontal layout
- [x] Verify Review gaps and Status board icon, label, and arrow alignment on portrait Android
- [x] Refine the launcher icon background and scorpion scale without changing the supplied mark
- [x] Copy and validate the revised icon across launcher, splash, favicon, and adaptive-icon assets
- [x] Run TypeScript, unit, lint, and Expo configuration checks
- [x] Capture and review fresh portrait screenshots for the home screen and launcher treatment
- [x] Save a checkpoint for the Android follow-up fixes

## GitHub APK workflow

- [ ] Audit the public repository target and exclude local secrets, caches, and generated artifacts
- [ ] Sync the current tracker source into Beetheboss/Agilite-app
- [ ] Add a manual GitHub Actions workflow that builds and uploads a shareable debug APK
- [ ] Add clear README instructions for running the workflow and downloading the APK
- [ ] Validate the repository and workflow locally, then push to GitHub
- [ ] Verify the pushed repository and report the APK workflow steps
