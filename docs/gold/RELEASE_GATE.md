# CHRONOS ADVENTURE: NOX & LULÙ — RELEASE GATE FINALE (FASE 7)

**Repository:** `Flexati/Adventure-city`  
**Ramo:** `work/chronos-adventure-commercial`  
**Prezzo ufficiale:** `5,99 €` (`D18`, `M5`)  
**Data verifica:** 8 novembre 2026  
**Verdetto Release Gate:** **`RELEASE READY = NO` (`COMMERCIAL_RELEASE = BLOCKED`)**  

---

## 1. Riepilogo Esecutivo del Release Gate

In conformità alla regola tassativa di **FASE 7** («Non dichiarare RELEASE READY se mancano prove umane o dispositivi fisici»):
- **Tutti i controlli automatici, di regressione, di budget del bundle, di leggibilità, di stabilità e di build Android API 36 (`APK` + `AAB`) sono `PASS` (`[MISURATO]`).**
- **Il rilascio commerciale resta `BLOCKED`** esclusivamente per i **4 requisiti esterni / fisici** che non possono essere simulati in un container senza persone reali, telefono fisico e credenziali Play Console dell'autore:
  1. **Playtest umano (`FASE 4`):** `0 / 5` sessioni umane documentate (`docs/gold/HUMAN_PLAYTEST_RESULTS.md`).
  2. **Prova su dispositivo Android fisico (`M1`):** tocco reale, GPU mobile, audio in cuffia/cassa e controller Bluetooth fisico su smartphone reale.
  3. **Google Play Billing reale (`M4`):** cablaggio nativo `BillingClient` nel guscio Android e test d'acquisto/ripristino con account licenziatario Google Play Console.
  4. **Firma Play definitiva (`M5`):** firma dell'AAB con il keystore privato di produzione `chronos-upload` dell'autore (`npm run android:aab:play`).

---

## 2. Matrice di Verifica Punto per Punto (FASE 7)

| # | Requisito Release Gate | Stato | Livello di Evidenza | Dettaglio Tecnico e Prova nel Repository |
| :-: | :--- | :-: | :-: | :--- |
| **1** | **Test automatici aggiornati (`npm test`)** | **PASS** | `[MISURATO]` | `329 / 329 PASS` (`0` fallimenti), inclusi i nuovi test di progressione arsenale V9 (`H-17 Needle` e `ARC-7 Choir` in `tests/weapons-v9.test.mjs`), `tests/villages-d40.test.mjs`, `tests/q2-readability.test.mjs`, `tests/bundle-weight.test.mjs`, `tests/price-m5.test.mjs`, `tests/demo-replay.test.mjs`. |
| **2** | **Regressione completa e budget `app.js`** | **PASS** | `[MISURATO]` | `app.js` compilato con `python3 tools/prepare_android_assets.py`: **sotto il limite di `524.288` byte con oltre `64 KiB` (`65.536` byte) di margine libero** (`tests/bundle-weight.test.mjs`). |
| **3** | **Touch e multitouch (emulazione mobile API 36)** | **PASS** *(Emulato)* / **BLOCCATO** *(Fisico)* | `[MISURATO]` / `[NON VERIFICATO]` | `qa:touch` (`48/48 PASS`), `qa:controls` (`11/11 PASS`), `qa:gamepad` (`9/9 PASS`) su `390×844`, `360×800` e `844×390` (`docs/evidence/tier2/m1/`). Resta da eseguire su schermo capacitivo reale (`M1`). |
| **4** | **Audio (musica, SFX, abbassamento nei dialoghi, mute in background)** | **PASS** *(Browser)* / **BLOCCATO** *(Fisico)* | `[MISURATO]` / `[NON VERIFICATO]` | Verificato in Chromium (`qa:audio`, `tests/options-q4.test.mjs`): volumi Musica ed Effetti separati 0–100%, sospensione istantanea su `visibilitychange`/`pagehide`. Da ascoltare su altoparlante/cuffie di uno smartphone fisico (`M1`). |
| **5** | **Salvataggi e recupero da stati corrotti o v7** | **PASS** | `[MISURATO]` | `qa:save` (`docs/evidence/tier2/m1/save-recovery.json`: `PASS`), migrazione salvataggi v7 con bookmark stabile (`tests/rook-recovery.test.mjs`, `tests/chalk-mission.test.mjs`), persistenza arsenale V9 e nuova rotta (`tests/demo-replay.test.mjs`). |
| **6** | **Sospensione, ripresa e stabilità (`qa:stability`)** | **PASS** | `[MISURATO]` | `qa:stability` (`docs/evidence/tier2/m1/stability.json`: `S1–S7`, `S5b`, `S6b`, `M-S1` tutti `PASS`), protezione loop frame e pannello di recupero «Riprendi dall'ultimo salvataggio». |
| **7** | **Installazione e prova su Android fisico (`M1`)** | **BLOCCATO** | `[NON VERIFICATO]` | APK pronto in `dist/Chronos_Adventure_Nox_Lulu_debug.apk`; richiede installazione manuale tramite `adb install` su telefono fisico dell'autore. |
| **8** | **Playtest umano (`>= 5` sessioni documentate)** | **BLOCCATO (`0/5`)** | `[NON VERIFICATO]` | Protocollo pronto in `docs/gold/HUMAN_PLAYTEST_PROTOCOL.md`; tabellone risultati in `docs/gold/HUMAN_PLAYTEST_RESULTS.md` (`0` sessioni registrate). |
| **9** | **Nessun problema grave di ritmo o difficoltà aperto nel codice** | **PASS** | `[MISURATO]` | Risolti in FASE 6 lo sblocco campagna di `ARC-7 Choir` (`zero`) e `H-17 Needle` (`archive`) e l'attesa passiva tra ondate nelle missioni `defend`/`chalk` (`docs/gold/GAMEPLAY_RHYTHM_AUDIT.md`, `docs/gold/DIFFICULTY_BALANCE_AUDIT.md`). |
| **10** | **Billing e ripristino acquisti (`M4`)** | **PARZIALE (Contratto JS pronto / Nativo aperto)** | `[MISURATO]` / `[NON VERIFICATO]` | Contratto `window.ChronosBilling` e cancello Demo dopo «La firma» verificati in `qa:demo` (`5/5 PASS`). L'integrazione nativa `BillingClient` in Java e il test di acquisto/ripristino con account Google Play di test richiedono il product ID e la Play Console dell'autore. |
| **11** | **Verifica AAB Android API 36 (`dist/chronos-adventure-release.aab`)** | **PASS** *(Tecnico)* | `[MISURATO]` | Compilato con `compileSdk 36`, `targetSdk 36`, `versionCode 2`, `versionName 1.0.0`, `debuggable=false`, validato con `bundletool validate` (`0` errori). |
| **12** | **Firma Play definitiva (`chronos-upload`) e Pagina Play Store (`M5`)** | **BLOCCATO** | `[NON VERIFICATO]` | L'AAB locale è firmato con chiave di test fuori dal repo; la firma finale richiede il keystore `chronos-upload` dell'autore (`npm run android:aab:play`) e la verifica finale della scheda dello store in Google Play Console. |

---

## 3. Criteri di Qualità Proposti — Stato Attuale

| Criterio di Qualità (FASE 7) | Soglia Richiesta | Stato Attuale | Esito Gate |
| :--- | :---: | :---: | :-: |
| **Bug bloccanti nel codice** | `0` | **`0`** (`329/329` test verdi, `qa:stability` PASS) | **OK** |
| **Regressioni critiche** | `0` | **`0`** | **OK** |
| **Sessioni umane documentate** | `>= 5` (consigliate `8–10`) | **`0`** (`dipendenza esterna dichiarata`) | **BLOCCATO** |
| **Problemi gravi di ritmo o difficoltà aperti nel codice** | `0` | **`0`** (cortti R-01 e R-02 in FASE 6) | **OK** |
| **Acquisto e ripristino verificati su Play Console** | Verificati | Simulati in `qa:demo`, non verificati su Play Billing reale (`M4`) | **BLOCCATO** |
| **Valutazione media nelle 12 aree di esperienza** | `>= 8,5 / 10` con feedback reali | **`8,53 / 10`** (valutazione tecnica/design; `0` questionari umani) | **IN ATTESA DI FEEDBACK UMANI** |

---

## 4. Passi Operativi per Sbloccare il GO Finale (Per l'Autore)

1. **Eseguire il Playtest Umano (`FASE 4`):** installare `dist/Chronos_Adventure_Nox_Lulu_debug.apk` sui dispositivi di almeno **5 tester indipendenti**, seguire `docs/gold/HUMAN_PLAYTEST_PROTOCOL.md` e trascrivere tempi, osservazioni e voti reali in `docs/gold/HUMAN_PLAYTEST_RESULTS.md`.
2. **Completare la verifica fisica `M1`:** confermare su telefono reale fluidità GPU, leggibilità HUD, audio e tocco durante il movimento, aggiornando `docs/gold/PLAYTEST.md`.
3. **Verificare `M4` (Play Billing) e firmare l'AAB per lo Store (`M5`):** collegare il product ID della Play Console, verificare acquisto e ripristino con account licenziatario di test, ed eseguire `npm run android:aab:play` con la chiave privata `chronos-upload`.
