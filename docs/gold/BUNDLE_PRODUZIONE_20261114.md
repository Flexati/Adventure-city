# Bundle per il Play Store — istruzioni per il PC dell'autore (14 novembre 2026)

Il bundle di produzione si firma solo con la chiave di caricamento dell'autore (`chronos-upload`), che non entra mai nel repo
né in chat. Per questo si costruisce sul PC. Lo script e il pacchetto sono stati provati in cloud con una chiave usa e getta.

## [MISURATO] Prova generale fatta in cloud (stesso script, chiave diversa)

- `tools/build_aab.sh` con le impostazioni di `tools/build_play_aab.sh`: AAB di 99 882 349 byte, `bundletool validate` OK.
- Manifest: pacchetto `jaguarZcreatorZ13.app`, `debuggable="false"`, minSdk 26, targetSdk 36, unico permesso `VIBRATE`.
- Dentro: `app.js` 451 478 byte, `world.js`, ruggito, 25 ritratti `.png`, 4 edifici dei villaggi.
- Prova generale ripetuta il 15 novembre sul commit R35: AAB di 99 883 731 byte, `bundletool validate` OK, `jaguarZcreatorZ13.app`, non debuggable, targetSdk 36, `app.js` 455 297 byte. La prima prova (14 novembre) era sul codice della Fase 0.

## Comandi sul PC

```bash
git fetch origin && git checkout work/chronos-adventure-commercial && git pull origin work/chronos-adventure-commercial
# ATTENZIONE: il bundle deve contenere R28-R35 (fuoco dalla canna, correzione di Vega). Sono nella PR #12: costruisci solo da un ramo
# in cui è unita (controlla con: git log --oneline | grep R35), altrimenti dal ramo ccr-022499ad-zq9iu5.
npm ci && npm test                                   # tutti i test devono passare, 0 falliti (486 su 486 al commit R35)
export ANDROID_SDK_ROOT=<sdk con platform 36 e build-tools 36.0.0>
export BUNDLETOOL_JAR=<percorso di bundletool-all 1.18.3 o più nuovo>
export PLAY_UPLOAD_KEYSTORE=<il tuo .jks>  PLAY_UPLOAD_KEY_ALIAS=chronos-upload
export PLAY_UPLOAD_STORE_PASSWORD=<…>  PLAY_UPLOAD_KEY_PASSWORD=<…>     # solo nel terminale, mai in un file del repo
export PLAY_VERSION_CODE=<un numero più alto di ogni bundle già caricato in Play Console>   # 3 risulta già usato
export PLAY_VERSION_NAME=1.0.0
npm run android:aab:play                             # rifiuta chiave sbagliata, debuggable, pacchetto .debug
```

Lo script controlla da solo che l'impronta SHA-256 del certificato sia quella attesa (`6E:0A:ED:9C:…:59:DB`) e si ferma se non lo è.
Il file esce in `dist/Chronos_Adventure_Nox_Lulu_play_vcode<numero>.aab`.

## Prima di caricarlo (Play Console, lo fa l'autore)

1. **Traccia.** [IPOTESI, da verificare nella tua Play Console] per un account sviluppatore personale nuovo, Google chiede un
   test chiuso con almeno 12 tester per 14 giorni prima di poter pubblicare in produzione. Se vale per il tuo account, il
   primo caricamento va sulla traccia di test chiuso.
2. **Stato del gioco.** `COMMERCIAL_RELEASE = BLOCKED`: nessuna prova su telefono registrata, 0 playtest su 5, acquisto Play
   non collegato (oggi il gioco è tutto aperto: chi lo installa gioca tutto senza pagare). Mettere in produzione adesso è una
   tua scelta; la raccomandazione dello studio è test interno o chiuso finché le Fasi 6–8 del piano non sono verdi.
3. **Scheda.** Informativa privacy, modulo Sicurezza dei dati (il gioco non raccoglie dati e non usa la rete),
   classificazione dei contenuti, schermate vere del gioco, icona 512×512, grafica in evidenza 1024×500.
4. **Prezzo.** 5,99 € una tantum (D18): con il gioco tutto aperto, il prezzo va messo sull'app a pagamento in Play Console,
   oppure si aspetta il ponte di acquisto della Fase 8.
