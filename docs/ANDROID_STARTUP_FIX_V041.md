# Android startup fix 0.4.1

User report: APK installs but closes immediately after launch. No device log or Android emulator was available, so the exact device failure is not confirmed.

The prior shell read a 28,993,580-byte HTML bundle into a ByteArrayOutputStream, copied it into a byte array and UTF-8 String, and passed the whole string into WebView. This creates avoidable startup memory and IPC pressure. The new shell loads a 3,592-byte entry over the same virtual HTTPS origin, intercepts every request and streams an explicit allowlist of APK files. Images/audio no longer appear inside the HTML or JavaScript. No Internet permission or file access is enabled. Local storage retains its previous origin and key.

WebView construction failures and renderer termination now display a native retry screen. An ES5 bootstrap reports missing scripts, incompatible game syntax, or stalled resource loading instead of silently presenting a dead page. This does not establish that all possible device crashes are resolved.

Validation:
- Java route test: all 19 packaged resources accepted with the expected MIME, external hosts and invalid paths rejected.
- Browser test against split packaged resources: startup, character movement, no JavaScript errors; aborting app.js displays recovery.
- Existing 23 logic/regression tests pass.
- APK archive CRC, all source-to-APK resource bytes, entry/script size limits, no embedded binary data verified.
- apksigner v2/v3 and zipalign verified. Signing certificate identical to 0.4.
- Package ID unchanged; versionCode 5, versionName 0.4.1-fix.
- APK SHA256: 1f6cabdf91423b6b66f7f42be9e60943ca279ea1c4fb407a5b36b7453a10fef2.
- Physical Android startup and the reported crash still require user verification.

Reference: https://developer.android.com/develop/ui/views/layout/webapps/load-local-content
