# Play — AAB firmato

`applicationId` fisso: `jaguarZcreatorZ13.app`. Non si genera una chiave nuova e non si commette un keystore.

`versionCode` della prossima consegna: **4** (`PLAY_VERSION_CODE`, default di `tools/build_play_aab.sh`). Il 3 è quello in caricamento. `targetSdk` 36. Il bundle Play non è `debuggable`. Nessuna chiave nuova.

Il pacchetto Java di debug resta `com.cityadventure.pizzaprotocol.debug` perché i test e la CI di fumo lo avviano così. Nell’AAB Play il nome del pacchetto è `jaguarZcreatorZ13.app`; l’activity resta la classe esistente.

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
