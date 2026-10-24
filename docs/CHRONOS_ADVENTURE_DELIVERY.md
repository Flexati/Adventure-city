# Chronos Adventure: Nox & Lulú — build di verifica

> Documento storico della consegna di rebranding. APK e preview correnti sono
> stati ricostruiti durante il lavoro V9: vedere
> [stato implementazione](production/v9/IMPLEMENTATION.md) e
> `artifacts/v9-implementation/` per modifiche, prove e limiti attuali.

## Base e intervento

Repository: `Flexati/Adventure-city`. Ramo locale:
`work/chronos-adventure-commercial`. Base:
`71e939a` (`origin/work/v9-g0-media`), successiva a
`70b1893` (`origin/feat/audience-first-v8`). Il main contiene le tavole artistiche,
non la build più recente della campagna. Nessuna pubblicazione su main eseguita.

Questa consegna applica il nome richiesto e il riferimento grafico al gioco
esistente: **30 tappe, 11 missioni a piedi, 5 sequenze di guida, 4 hub, 3 boss**.
Non presenta questi contenuti preesistenti come nuove implementazioni e non
presenta le tavole dei boss V8.5 come boss giocabili.

## Modifiche concrete

- Nuovo menu illustrato: orologio/portale sopra Vanta, composizione adattiva,
  titolo HTML leggibile, sottotitolo ADVENTURE e NOX & LULÚ.
- Rebranding di titolo browser, accessibilità, pausa, crediti, finale, etichetta
  Android, caricamento nativo ed errori; nome aggiornato di APK e preview.
- Riduzione animazioni del menu secondo la preferenza del sistema operativo.
- Immagine WebP locale, circa 335 KiB; nessun CDN o servizio online nel gioco.
- Packager Android e allowlist WebView aggiornati per consegnare e servire il
  WebP con MIME corretto. Nessuna apertura generica di percorsi esterni.
- Verifica browser riproducibile in sei formati con input touch, nuova storia,
  ricaricamento e ripresa del checkpoint; stessa prova sul bundle Android.
- Compilazione Java esplicitamente UTF-8 per preservare il nome accentato.

## Artefatti

- `dist/Chronos_Adventure_Nox_Lulu_debug.apk` — Android 8+; target SDK 35.
- `dist/Chronos_Adventure_Preview/` — risorse portatili da servire via HTTP.
- `dist/Chronos_Adventure_Preview.zip` — archivio della preview e istruzioni.
- `artifacts/chronos-adventure/` — report, screenshot e log di questa build.

Il pacchetto usa una **chiave debug locale**, non la firma commerciale o una
chiave di aggiornamento precedentemente fornita. Non è verificata la possibilità
di aggiornare APK precedenti firmati con un'altra chiave. Non disinstallare
una vecchia build con progressi importanti senza conservarli prima.
La compatibilità dei dati v7 è mantenuta nel codice; la continuità fra
installazioni dipende anche dalla firma Android.

## Verifiche e limiti

Risultati macchina autorevoli nei report accanto ai relativi screenshot:

- `unit-tests.txt`: 108 test superati.
- `packaging-tests.txt`: bundle, percorsi risorse e sintassi dei tool.
- `brand/report.json`: sei risoluzioni, 320×568–1280×800.
- `brand-bundle/report.json`: medesime prove sul bundle classico per Android.
- `save-recovery.json`: recupero checksum, backup, quota, accesso negato,
  ricreazione contesto browser, nessuna richiesta esterna.
- `runtime.json`: runtime, audio, lifecycle simulato e varianti finale browser.
- `audio.json`: 15 render Web Audio, stress incluso, senza clipping.
- `campaign-{a,b,c}/report.json`: **A/B/C PASS**, ciascuno con 30 tappe, otto
  incarichi, due preparazioni e postcrediti, senza errori browser.
- `delivery.json`: hash dei sorgenti identico nei tre percorsi, riepilogo e
  checksum dei report. I test sono stati eseguiti sulle modifiche locali
  della base `71e939a`, prima del commit di consegna.
- `apk-build.txt`, `apk-metadata.txt`, `apk-verification.json`: APK compilato,
  allineato, firma debug v2/v3 verificata; 79 risorse identiche alla preview testata.

Le campagne automatiche usano un clock accelerato e non misurano durata umana,
FPS, temperatura o batteria. Il browser non sostituisce una WebView nativa.
Non è presente un dispositivo Android fisico o un emulatore per installare la
nuova build in questa sessione.

**G0 = BLOCKED · COMMERCIAL_RELEASE = BLOCKED.** Restano da verificare:
installazione, cold/warm start, background/resume, kill/reload, offline e
aggiornamento su Android; performance su telefoni low/target/high; playtest
indipendenti; licenze degli asset preesistenti; firma release, AAB e materiali
store. Nessun nuovo boss o pacchetto di armi è stato aggiunto prima di questi
controlli. Nessuna garanzia di successo commerciale viene dedotta dai test.

## Riproduzione

```sh
npm ci
npm test
python3 tools/build_preview.py
python3 -m http.server 8090 --bind 127.0.0.1
# In un altro terminale:
CHROMIUM=/usr/bin/chromium node tools/verify_brand_browser.cjs
CHROMIUM=/usr/bin/chromium CITY_VIRTUAL_TIME=1 node tools/verify_campaign_browser.cjs \
  http://127.0.0.1:8090/game/ a artifacts/chronos-adventure/campaign-a
# Ripetere b/c per le altre scelte.
ANDROID_SDK_ROOT=/percorso/sdk bash tools/build_apk.sh
```

Per l'APK servono SDK platform 35, build-tools 35.0.0 e un JDK completo 17+,
compreso `lib/ct.sym`. Il solo runtime Java non basta. SDK e JDK installati
nell'ambiente di lavoro non sono parte del repository o della distribuzione.
