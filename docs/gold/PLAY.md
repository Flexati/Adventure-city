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

## App gratuita (`jaguarZcreatorZ13.app.free`, D95)

L’app a pagamento qui sopra non cambia. L’app gratuita è un’altra app Play, con il suo `applicationId` e il suo `versionCode` (parte da 1). Non si caricano mai i due pacchetti sulla stessa scheda.

**Da fare in Play Console (Loris o Jaguarz). Nulla di questo lo fa il codice.**

1. Creare una **nuova app** gratuita con `applicationId` `jaguarZcreatorZ13.app.free` (si imposta col primo caricamento; non si cambia più). Scegliere «Gratuita»: una volta gratuita, non può tornare a pagamento.
2. Aderire a Play App Signing. Per la chiave di upload decide chi costruisce: non si crea nessuna chiave senza il suo ok (`tools/build_free_aab.sh` non ne crea).
3. **Monetizzare → Prodotti → Prodotti in-app → Crea prodotto:** ID esatto `unlock_full_game`, nome «Sblocca tutta la storia», descrizione «Un solo acquisto, per sempre: sblocca gli Atti II, III e IV.», prezzo **5,99 €** (da impostare qui, non nel codice), poi **Attiva**. Senza prodotto attivo la schermata di sblocco mostra «Google Play non è raggiungibile adesso» e il pulsante resta spento.
4. **Tester di licenza** (Impostazioni → Test della licenza): aggiungere le email di chi prova l’acquisto. Le prove con carta di test non addebitano nulla. Per provare servono l’app caricata in una traccia (anche test interno) e l’installazione dal Play Store, non da Android Studio.
5. Nuovo **test chiuso di 14 giorni** per l’app gratuita (almeno 15 tester reali, come per l’app a pagamento: il conto dei 14 giorni riparte, è un’altra app). Qui i tester scaricano gratis: niente codici promozionali e niente promozioni a 0 €.
6. Scheda store: non scrivere «free» o «gratis» nel **titolo** (le regole di Play lo vietano); la scheda dice già «Gratuita». Compilare il modulo «Sicurezza dei dati» tenendo conto di `INTERNET` e `ACCESS_NETWORK_STATE` portati da Play Billing, e dichiarare gli acquisti in-app e l’assenza di pubblicità.
7. Prima di aprire alla produzione: provare su un telefono acquisto, annullamento, pagamento in attesa (con un tester di licenza), «Ripristina acquisto» dopo aver reinstallato, e un rimborso.

**Costruzione, in locale.**

```sh
export PLAY_UPLOAD_KEYSTORE=/percorso/chiave-di-upload.jks
export PLAY_UPLOAD_KEY_ALIAS='…'
export PLAY_UPLOAD_STORE_PASSWORD='…'
export PLAY_UPLOAD_KEY_PASSWORD='…'
export FREE_VERSION_CODE=1
export ANDROID_SDK_ROOT=…   # piattaforma 36, build-tools 36.0.0
export JAVA_HOME=…          # JDK 17, con gradle 8.13 o più recente nel PATH
export BUNDLETOOL_JAR=…     # facoltativo: convalida il pacchetto
npm run android:aab:free
```

L’AAB esce in `dist/Chronos_Adventure_Nox_Lulu_free_play_vcode1.aab`. In GitHub: workflow manuale `Free AAB` (stessi segreti dell’app a pagamento).

