# Android test build — 0.1-debug

Artifact: `City_Adventure_Pizza_Protocol_v0.1_debug.apk` (7,037,484 bytes).
SHA-256: `e5949dc32b7c1cb22f7e3cb8a898ba8536d7136eb5fed068336e0aba445b8b01`.
App label: **Pizza Protocol Test**.
Package: `com.cityadventure.pizzaprotocol.debug`, version code 1.
Minimum Android 8.0 / API 26. Compile/target API 35. Requires a current Android System WebView for modern Canvas/CSS support.

## What is in the APK

The first chapter prototype, its JavaScript/CSS, two illustration sheets and ten audio files are embedded in one local HTML document. It runs offline through WebView.loadDataWithBaseURL with a stable appassets HTTPS origin for local storage. File/content access and network loading are disabled. No INTERNET or other permissions, native JavaScript bridge, advertising, analytics, login or billing. Android background/back signals save and pause gameplay and stop audio.

## Verified build checks

- aapt2 resource/manifest compilation, Java compilation and D8 DEX conversion succeeded.
- apksigner: APK Signature Scheme v2 and v3 verify; one debug signer.
- zipalign verification passed; ZIP CRC check passed.
- Embedded HTML matches the generated preview byte-for-byte; DEX header valid.
- Package, launchable Activity, version, minimum/target SDK and absence of permissions inspected with aapt.
- Engine regression suite: 11/11 passed.

**Not yet verified:** installation or execution on Android/emulator, touch layout, audible output, lifecycle behaviour on device, performance. The APK is provided specifically for that test, not certified for release.

## Quick phone test (Italian)

1. Scarica e apri l’APK; autorizza l’installazione dalla sorgente usata se Android lo richiede.
2. Avvia **Pizza Protocol Test**, scegli Kai o Zara e prosegui i dialoghi.
3. Controlla joystick, attacco, schivata, musica e pulsanti: nulla deve essere tagliato o coperto.
4. Parla con Lia, recupera le tre consegne, affronta il robot e scegli un esito.
5. Torna da Lia, poi alla Vortex. Chiudi e riapri: il progresso deve restare.
6. Prova Home/rientro e Indietro: il gioco non deve continuare a combattere in background.

Segnala modello/Android, schermata e azione precisa in caso di blocco. Non sono necessarie credenziali o dati personali.

## Rebuild

Prepare assets as in PLAY.md, then with Java 17 (jdk.compiler module), Android SDK platform 35 and build-tools 35.0.0:

```sh
ANDROID_SDK_ROOT=/path/to/android-sdk bash tools/build_apk.sh
```

The build script generates a local debug keystore when absent. Keystores and build outputs are ignored by Git. Retain that key locally for signature-compatible test updates. A build with a new key cannot update an existing install; uninstalling that install would erase its local save. This is not a production signing key and no AAB is produced.
