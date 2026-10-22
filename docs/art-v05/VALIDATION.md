# Validation 0.5 — 2026-10-17

- 15 active campaign, animation-selection and driving logic tests passed. Existing unrelated legacy files remain in the repository and were not changed.
- Chromium: foot gameplay at 844×390 and 390×844; menu, movement, attacks, pause/resume, no horizontal overflow, no page errors or missing responses. Chapters 2–4 load their district enemy atlas and music.
- Chromium: all three driving missions at both viewport sizes; Nox driver with Lulu selected on foot, acceleration, steering, braking, pause and restart through Continue. No page errors or missing responses. This is not a complete real-time playthrough of every road.
- Java 17: 38 nonempty packaged resources accepted by the native asset allowlist with supported MIME types; foreign host and traversal rejected.
- Streamed Android entry 4,615 bytes; bundled app script below 40KB; no embedded binary data. Classic bundle syntax validated with Node.
- 18 PNGs inspected for dimensions, alpha and integrity. Image outputs copied unchanged. All 37 uploaded image/audio/score blobs matched local Git blob hashes before commit.
- All 11 OGG files decoded with ffmpeg, finite and non-silent, decoded peak below 0.726. Audio judgement by listening is outstanding.

## Reproduce

Run `npm test`, `python3 tools/prepare_android_assets.py`, and `node --check android/build/assets/game/app.js`. Compile `AssetRoutes.java` together with `tests/AssetRoutesV05Test.java` and run the test with `android/build/assets/game` as its argument. Browser scripts are `tools/verify_browser_v05.cjs` and `tools/verify_driving_browser_v05.cjs`; they require Playwright plus an installed Chromium (optionally set CHROMIUM_EXECUTABLE).

No new APK was built or installed on Android in this update. No physical-device frame-rate, memory, thermal or crash claim is made. The Android source preserves the streamed-resource startup fix. Original uploaded ZIPs and existing APKs remain untouched.
