# Play — AAB firmato

`applicationId` fisso: `jaguarZcreatorZ13.app`. Non si genera una chiave nuova e non si commette un keystore.

`versionCode` della prossima consegna: **4** (`PLAY_VERSION_CODE`, default di `tools/build_play_aab.sh`). Il 3 è quello in caricamento. `targetSdk` 36. Il bundle Play non è `debuggable`. Nessuna chiave nuova.

L’`applicationId` di debug, nel `android/AndroidManifest.xml` di origine, è di nuovo `com.cityadventure.pizzaprotocol.debug` (come prima di questa PR). Così un APK di prova (`versionCode` 54, `debuggable`) non condivide il nome con l’app Play e non può bloccare un aggiornamento a `versionCode` 4. Le classi Java restano nel package `jaguarZcreatorZ13.app` (`MainActivity`, `NativeBridge`, `AssetRoutes`); il manifest di debug indica l’activity con il nome completo `jaguarZcreatorZ13.app.MainActivity`. La CI di fumo avvia `com.cityadventure.pizzaprotocol.debug/jaguarZcreatorZ13.app.MainActivity`. L’identità Play non passa da questo manifest: la forza `tools/build_play_aab.sh` (`jaguarZcreatorZ13.app`, `versionName` 1.0.0, non `debuggable`).

## Segreti (GitHub Actions)

| Segreto | Uso |
|---|---|
| `PLAY_UPLOAD_KEYSTORE_B64` | Keystore di upload esistente, in base64. Mai nel repo. |
| `PLAY_UPLOAD_KEY_ALIAS` | Deve essere `chronos-upload`. |
| `PLAY_UPLOAD_STORE_PASSWORD` | Password dello store. |
| `PLAY_UPLOAD_KEY_PASSWORD` | Password della chiave. |

Workflow: `.github/workflows/play-aab.yml` (solo `workflow_dispatch`). Carica l’AAB come artifact. Non pubblica sullo store.

## Comandi, in locale

```sh
export PLAY_UPLOAD_KEYSTORE=/percorso/chronos-upload.jks
export PLAY_UPLOAD_KEY_ALIAS=chronos-upload
export PLAY_UPLOAD_STORE_PASSWORD='…'
export PLAY_UPLOAD_KEY_PASSWORD='…'
export PLAY_VERSION_CODE=4
export ANDROID_SDK_ROOT=…
export BUNDLETOOL_JAR=…
npm run android:aab:play
```

L’AAB esce in `dist/Chronos_Adventure_Nox_Lulu_play_vcode4.aab`. Si carica a mano nella Play Console, sul binario di produzione o di test interno, senza creare una nuova app: l’app esiste già.
