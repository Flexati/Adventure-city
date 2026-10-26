# CHRONOS Gold — gate Play

Stato: **BLOCKED, nessun AAB commerciale V10.2**. `npm test` e la preview browser sono controlli tecnici, non attestazioni di arte, narrativa, durata, diritti, audio, prestazioni o dispositivi Android.

Configurazione vincolante per la prossima candidata, se `versionCode 2` è ancora disponibile nella Play Console: `jaguarZcreatorZ13.app` (j minuscola), `versionCode 2`, `versionName 1.0.0`, `minSdk 26`, `targetSdk 36` con verifica dei requisiti Play correnti, `debuggable=false`, Activity `com.cityadventure.pizzaprotocol.debug.MainActivity`, nome `Chronos_Adventure_Nox_Lulu_play_vcode2.aab`. Usare solo la chiave privata di upload esistente e l'alias `chronos-upload`, passando le credenziali per variabili d'ambiente. Impronta attesa del certificato upload: `6E:0A:ED:9C:FB:3F:92:30:E6:B7:8D:3F:95:E5:29:82:7D:2B:27:D4:C7:CF:79:BE:88:6B:9F:B6:64:51:59:DB`. Non generare una nuova chiave.

La configurazione di debug in `android/AndroidManifest.xml` viene sovrascritta dallo script Play durante la build; non è il manifest commerciale. La build richiede SDK/API 36, build-tools 36.0.0, bundletool 1.18.3+ e la chiave esistente, qui non disponibili. Quando il gioco supera i gate, eseguire `npm run android:aab:play` e conservare prove di manifest/package/version/target/debuggable, firmatario, `bundletool validate`, APK universale derivato e `apksigner verify`. Il derivato serve alla QA; l'upload Play deve terminare solo in `.aab`. Pubblicazione esclusa senza istruzione esplicita.

Restano aperti tutti i 74 criteri obbligatori (14 PARTIAL, 60 OPEN), AS01–AS12, E00–E12, contenuti, diritti, playtest umani, IT/EN, Android fisico e revisione autonoma di Direzione artistica e Coerenza narrativa. La candidata non può essere chiamata “MANDATO COMPLETATO”.

Checkpoint Rook: 162/162 test e prove browser circoscritte; zero COMMERCIAL_READY. E06 è PARTIAL, Quickdraw/Tessa e recupero degli avanzati non sono chiusi. Vedere `ROOK.md`. Nessun nuovo AAB o APK commerciale è stato prodotto o pubblicato.
