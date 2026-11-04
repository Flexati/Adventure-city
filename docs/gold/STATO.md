## Q3–Q4 — Peso di `app.js`, prestazioni e menù Opzioni (4 novembre 2026)

- **D37.** Parole dell'autore: «Ah, va bene, finisci il gioco però. Finiscilo e fallo diventare un gioco di successo.» Si va avanti con ciò che non dipende da dati dell'autore (D35, priorità 4 e 5; menù di D34). M4, M6 e M7 restano fermi: servono il product ID, le immagini dei boss e l'approvazione dei testi.
- **Q3, peso (prerequisito per M4, M6 e M7).** Nel solo pacchetto Android, `CHRONO_MANIFEST` tiene i campi che il codice legge (`atlases[id].path` e 10 campi delle animazioni); i campi di documentazione (scatole di collisione, politiche, note di qualità) restano in `game/chrono-manifest.mjs` e nel JSON degli artisti, che non cambiano.
  - **[FATTO]** `app.js` **520 946 → 439 574 byte** (−81 372) solo con questo passo; con Q4 **444 018 byte**, margine **80 270** su 524 288 (`python3 tools/prepare_android_assets.py`).
  - **[FATTO]** `tests/bundle-weight.test.mjs` (3): per ogni animazione, fotogrammi, perni e tempi identici fra sorgente e pacchetto (anche con movimento ridotto); il codice legge solo i campi tenuti; margine di almeno 64 KiB. Mutante (`pivot_y` tolto dal bundler) preso.
- **Q4, menù Opzioni (D34, priorità 5).** «Impostazioni» nel menù principale apre una schermata **Opzioni** a 4 schede:
  - **Audio:** interruttore, **Musica** ed **Effetti e ambiente** da 0 a 100 % a passi del 10 %. I volumi moltiplicano il mix d'autore (`MIX` in `audio-engine.mjs`): a 100 % il suono è identico a prima; l'abbassamento durante i dialoghi resta.
  - **Accessibilità:** lingua, movimento ridotto, **testo grande** (dialoghi 17 → 20 px, 15 → 18 px su schermi piccoli o in orizzontale; battute, suggerimenti e scelte × 1,2) e una riga su come si leggono le minacce senza colore.
  - **Controlli:** vibrazione e la mappa di tocco, tastiera e gamepad (dai valori di `input-v9.mjs`).
  - **Crediti:** titolo, «Un gioco di jaguarzcreatorz», ringraziamento. **Non ho scritto licenze, nomi o versioni che non sono nel repo.**
  - La pausa tiene i suoi interruttori rapidi e ha «Tutte le opzioni»; i due pannelli scrivono le stesse impostazioni. Esc chiude prima le Opzioni, poi la pausa; riprendere il gioco chiude sempre le Opzioni.
  - **[FATTO]** `tests/options-q4.test.mjs` (5). `npm run qa:options` (`tools/verify_options_q4.cjs`): 10 controlli PASS su 360 × 800, 390 × 844 e 844 × 390 (schede e pulsanti dentro lo schermo e alti almeno 44 px, nessuno scorrimento orizzontale, volumi e testo salvati dopo il ricaricamento, inglese, ordine di Esc dalla pausa).
  - **[FATTO] Difetti trovati con le schermate e corretti:** a 360 px la scheda «Accessibilità» era troncata; in orizzontale «Chiudi» copriva il testo dei controlli. Ora intestazione, schede e «Chiudi» restano fissi e scorre solo la pagina.
  - Prove nel browser aggiornate perché «Impostazioni» non apre più la pausa: `verify_brand_browser`, `verify_runtime_v09`, `verify_campaign_browser` (inglese), `verify_locale_browser`. Quest'ultima prende anche `CHROMIUM` dall'ambiente.
- **[FATTO] Prestazioni (priorità 4):** profilo rapido (20 misure, CPU normale, 4 formati) con p95 del frame da 0,3 a 5,0 ms, contro i 16,67 ms di un frame. Il profilo completo (96 misure, anche con CPU rallentata di 4 volte) è in corso: il risultato arriva nel commit successivo.
- **[FATTO] Altri controlli nel browser:** `qa:demo` 5, `qa:save`, `qa:stability` (anche sul pacchetto alleggerito), `verify_startup_retry` (pacchetto), `qa:health` 11, `qa:gamepad` 9, `qa:hubs`, `qa:controls` 11, `qa:runtime`, brand a 6 formati: PASS.
- **[FATTO] Difetto preesistente, non corretto:** `tools/verify_locale_browser.cjs` si aspetta l'interlocutore «RESIDENT» nella prima battuta di `exp_chalk_marks` e trova «SYSTEM». Fallisce allo stesso modo sul codice di prima di Q4 (`git stash`, stessa prova). Va riallineato con l'autore: non so quale dei due sia il testo voluto.
- **Da provare sul telefono (M1):** [PLAYTEST.md](PLAYTEST.md), sezione Q4.
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## M3 — Demo fino a «La firma» e «Gioca l'altra rotta» (4 novembre 2026)

- **Mandato:** ISTRUZIONI §4, M3 (D20, D22; modello in [Fase 3 §E e §0](../design/v10.3/CHRONOS_FASE_3_SINTESI.md)); via dell'autore D36.
- **Demo (D20).** Dopo «La firma» (tappa `separation`) la tappa successiva e «Continua» aprono una sola schermata: «La storia continua.», prezzo, «Sblocca» e «Più tardi». «Più tardi» torna al menu e la schermata ricompare solo quando si riparte da lì. Nel menu c'è una voce discreta, «Sblocca la storia completa». Niente pubblicità, timer o promemoria.
- **[INFERITO] Scelta tecnica (D35, carta bianca):** la demo si attiva **solo se il guscio Android espone il ponte di acquisto** `window.ChronosBilling`. Senza ponte (browser, APK di debug, ogni build prima di M4) il gioco resta completo come prima, e un ponte che va in errore non blocca mai il giocatore. **Contratto per M4:** `ChronosBilling.isUnlocked()` → booleano, `price()` → prezzo localizzato di Play (facoltativo; in mancanza «5,99 €»), `purchase()` avvia l'acquisto; il guscio risponde chiamando `window.chronosBillingResult(true|false)`.
- **«Gioca l'altra rotta» (D22).** Nel finale c'è un pulsante nuovo. Apre il registro delle scelte, che mostra **solo le opzioni prese** (fino a 10, compresa la luce del Blackout): niente anticipazioni. Poi parte una nuova partita che tiene **armi** (le bandiere `weapon.*`), **potenziamento** (`upgrade`) e **oggetti equipaggiati** (inventario, equipaggiamento e scorte degli hub), e azzera storia, scelte, monete e termico. Bandiera nuova `replay_route`. Nessun finale nuovo.
- **[FATTO] Salvataggi compatibili:** il formato non cambia (la bandiera nuova vive dentro `narrative.flags`); il salvataggio della nuova partita passa da `saveProgress`/`loadProgress` (test); `qa:save` PASS.
- **[FATTO] Difetti trovati e corretti dal verificatore nel browser:** (1) il registro delle scelte si apriva sotto il finale (`z-index` 14 contro 50) e non si poteva toccare: ora `#replay` è a 55; (2) il finale centrava con `align-items:center`, che con un epilogo lungo tagliava la parte alta e lasciava i pulsanti irraggiungibili: ora `margin:auto`.
- **[FATTO] Test:** `npm test` da 304 a **309, tutti verdi** (+5 in `tests/demo-replay.test.mjs`); 3 mutanti (armi non copiate, ponte sempre bloccante, cancello su «La firma» invece che dopo) presi. Strumento nuovo `npm run qa:demo -- <url> <out.json>` (`tools/verify_demo_m3.cjs`): 5 controlli PASS su 390 × 844 (cancello, «Più tardi», acquisto simulato, nessun ponte, rotta nuova). Il ponte è simulato: **non è una prova di Play Billing** (M4, sul telefono).
- **[FATTO] Altri controlli nel browser:** `qa:save`, `qa:runtime`, `qa:controls` 11, `qa:stability`, `qa:hubs`, `qa:health` 11, `qa:gamepad` 9 PASS.
- **[FATTO] `app.js`:** 517 525 → **520 946 byte** (+3 421); margine **3 342** su 524 288. **Rischio:** M4, M6 e M7 devono stare in questo margine; prima di M6 serve un piano per il peso (per esempio spostare testi lunghi fuori da `app.js`).
- **Traduzioni:** 14 frasi nuove in inglese in `game/runtime-en.mjs`.
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## M5 — Prezzo allineato a 5,99 € (4 novembre 2026)

- **Mandato:** ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md §4, M5 (D18); via dell'autore D36 («sviluppami il gioco senza problemi»).
- **[FATTO] Corretti** (prezzo da 4,99 a 5,99): `docs/PLAY_RELEASE_CHECKLIST.md` (2), `docs/RELEASE_GATE.md` (1), `docs/BLIND_PLAYTEST_V09.md` (4, compresa la domanda «Lo compreresti a €5,99?»), `docs/production/v9/scope-charter.json` (`price_eur` 5.99), `docs/production/v9/requirements.json` (2), `docs/production/v9/IMPLEMENTATION.md` (1).
- **[FATTO] Nota in testa, testo non riscritto** (documenti storici V0x–V7x, il mandato originale citato e una prova registrata): `MASTER_DEVELOPMENT_PLAN_V70.md`, `V07_ACCEPTANCE_MATRIX.md`, `SPRITE_VISUAL_PRODUCTION_BIBLE_V70.md`, `NARRATIVE_MISSION_PRODUCTION_MAP_V70.md`, `production/v9/sources/05-commercial-mandate.md`, `evidence/chrono_shadows/director/README.md`.
- **Lasciati così, con motivo:** `docs/SPRITE_GENERATION_MANIFEST_V70.json` (`premium-android-4.99`: manifest storico in JSON, non accetta una nota); i 3 `PLAYTIME_ESTIMATE*.json` (le occorrenze sono durate come `54.99` s, non prezzi); i piani di Q1 e RIPRESA_Q1.md (parlano del compito M5).
- **[FATTO]** Nessun file di `game/`, `tools/` o `android/` conteneva il prezzo. Test nuovo `tests/price-m5.test.mjs` (2): i documenti vivi non dicono 4,99 e quelli storici hanno la nota; un mutante (4,99 rimesso in RELEASE_GATE.md) è preso. `npm test` **304/304**.
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## Q2 — Leggibilità e feel del combattimento (4 novembre 2026)

- **D36.** Via dell'autore: «Sì, ti do l'ok, confermo, sviluppami il gioco senza problemi. Sviluppami, poi build, fai un build a pk test e un build a ab a livello rilascio commerciale.» Piano: [pantheon-q2/PIANO_Q2.md](pantheon-q2/PIANO_Q2.md).
- **Ambiente:** container cloud (non il PC MX Linux), Node 22, Android SDK 35 e 36 scaricati in `/opt/android-sdk`, bundletool 1.18.3. Qui numpy c'è: `npm test` è tutto verde.
- **Cosa cambia nel gioco** (solo disegno, interfaccia e vibrazione; `game/campaign.mjs` invariato, quindi hitbox, `windup`, finestre, D27 e D29 non cambiano):
  - **Q2-U1.** Il cerchio rosso dei nemici corpo a corpo è **tratteggiato** (8/8 px) finché segue l'eroe e diventa **pieno da 5 px con 4 tacche** di 14 px sul bordo quando si blocca (55 % del `windup`). La linea di mira dei tiratori è tratteggiata finché segue e diventa **piena da 3 px** al blocco (60 %). Prima il blocco era visibile solo all'audio (evento `telegraphLock`). Il segnale è una forma, non un colore (regola 9).
  - **Q2-U2a.** Con «movimento ridotto» l'invulnerabilità mostra un **anello tratteggiato fermo** (raggio 46 px) al posto del lampeggio, che con quell'opzione era spento: prima non c'era nessun segnale.
  - **Q2-U2b.** Il pulsante SCHIVA di Nox ha un **doppio bordo** quando il Chrono Shift è carico (`s.shiftCd` a 0); sparisce per i 3,0 s di ricarica. Lulù non lo ha (D33).
  - **Q2-U3.** Vibrazione a piedi: Perfect Dodge 20 ms, Perfect Dodge che avvia lo shift 15-30-15 ms, colpo subito 35 ms. Passa dallo stesso filtro delle gare (`settings.haptics`, pagina visibile).
- **[FATTO] Test:** `npm test` da 296 a **302, tutti verdi** (+6 in `tests/q2-readability.test.mjs`, con canvas registratore sulle righe vere di `drawThreats` e dell'eroe). Verifica avversaria: 3 mutanti (tratteggio sempre acceso, anello tolto, vibrazione del colpo tolta), tutti presi (1 test rosso ciascuno).
- **[FATTO] `app.js`:** 517 094 → **517 525 byte** (+431); margine 6 763 su 524 288 (`tools/prepare_android_assets.py`).
- **[FATTO] Controlli nel browser** (Chromium preinstallato, uscite fuori dal repo): `qa:controls` 11 PASS, `qa:gamepad` 9 PASS, `qa:stability` S1–S7, S5b, S6b e M-S1 PASS, `qa:runtime` PASS, `qa:health` 11 casi PASS, `qa:save` PASS, `qa:hubs` PASS. Non lanciati qui: campagna A/B/C (25–32 min a giro), `qa:performance` (non certifica, vedi Q1), `qa:audio` (area non toccata).
- **[FATTO] Build:**
  - APK di test: `dist/Chronos_Adventure_Nox_Lulu_debug.apk`, 87 970 822 byte, sha256 `743aeea2…abe1539`, firma v2+v3 verificata da `apksigner` (chiave di debug).
  - AAB con la configurazione di rilascio di [RELEASE.md](RELEASE.md): `jaguarZcreatorZ13.app`, `versionCode 2`, `versionName 1.0.0`, `targetSdk 36`, build-tools 36.0.0, non debuggable. 87 300 812 byte, sha256 `1bd4b237…f504edc`, `bundletool validate` e APK universale derivato verificati. **Firmato con una chiave di prova generata fuori dal repo: non è caricabile su Play.** L'AAB per lo store lo costruisce l'autore con `npm run android:aab:play` e la chiave `chronos-upload` (impronta controllata dallo script).
  - `dist/` e `android/build/` non entrano nel repo (`.gitignore`).
- **Da provare sul telefono (M1):** vedi [PLAYTEST.md](PLAYTEST.md), sezione Q2.
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## Q1 — Carta bianca sulla qualità e stabilità (3–4 novembre 2026)

- **Punto di ripresa:** [docs/gold/RIPRESA_Q1.md](RIPRESA_Q1.md)
- **D35.** L'autore dà carta bianca sulla qualità e fissa le priorità in ordine: stabilità, leggibilità, feel del combattimento, prestazioni, finitura, contenuto. Claude decide da solo l'ordine del backlog, i dettagli di feel, i refactoring interni senza cambi di comportamento, test e diagnostica, la scelta documentata tra due soluzioni equivalenti e i tagli di scope che rendono il prodotto più solido. Le parole dell'autore sono in [DECISIONI.md](DECISIONI.md).
  - **[INFERITO]** Hitbox e finestre di combattimento (schivata, parata) restano sotto la regola 4 di CLAUDE.md.
- **Q1, priorità 1 (stabilità): chiusura tecnica verificata in sessione (4 novembre); committata (`c3d8a84`) e pushata su origin con l'ok di Posky («Carica tutto su Flexati»).** Le modifiche (U2–U7 e la correzione dello strumento U2s) sono nel commit `c3d8a84` (base c4ec6f5). Il controllo finale ha rifatto il giro di chiusura sul working tree: `npm test` 296/294 (falliscono solo i 2 con numpy), `qa:stability` 2/2 PASS, `qa:save`, `qa:runtime`, `qa:hubs` (ora rifatto dopo U6), `qa:controls` (11), `qa:gamepad` (9), `qa:audio` (rc=0), `verify_startup_retry` e `qa:health` (11 casi) PASS, e la campagna A/B/C con `CITY_VIRTUAL_TIME=1` PASS (31 passi, vedi sotto) (`Z_Q1.log`, `Z_Q1_campaign.log`, `Z_Q1_verifica.log`, `Z_Q1_npm_test.log`). Restano due uscite con rc=1 che **non** sono regressioni di Q1: `qa:v9` (nel repo mancano gli artefatti per il checkout sparse; su un albero esportato rc=0) e `qa:performance` («insufficient live frames», non certifica il frame rate): dettagli sotto. È un **GO tecnico, non una release**: M1 sul telefono resta aperta e `COMMERCIAL_RELEASE = BLOCKED`. **Il commit e il push si fanno solo con l'ok di Posky o dell'autore.**
- **Q2, dopo Q1:** leggibilità e feel del combattimento (priorità 2 e 3), da pianificare.
- **Cosa cambia nel gioco.** Un errore in un frame non ferma più il ciclo. Se gli errori si ripetono compare il pannello «Qualcosa si è inceppato.» con il pulsante «Riprendi dall'ultimo salvataggio». Un'immagine mancante a inizio missione o all'ingresso di un hub apre lo stesso pannello invece di restare in attesa. Un errore dopo l'avvio non scatena più «Il gioco non è riuscito a partire» nel guscio Android. Il pannello di recupero non salva e non riavvia l'audio con blur o ritorno in primo piano. «Tieni premuto» si annulla se il gioco va in background. Il manifest Android non ricrea più l'Activity per finestra multipla, densità, carattere o lingua; la finestra del tasto Indietro, chiusa toccando fuori, riprende il gioco. Le due modifiche Android (manifest e finestra) sono provate solo con test statici e con `javac`, non su un telefono.
- **Come leggere i numeri.** **[FATTO]** = misurato in Chromium su questo PC (Celeron N3060, non un telefono), con il log nello scratchpad della sessione (nome fra parentesi; i log non sono nel repo). **[IPOTESI]** = non misurato. I valori su un telefono Android vero sono in M1 ([PLAYTEST.md](PLAYTEST.md)).

### Stabilità, prima → dopo (`npm run qa:stability`, `tools/verify_stability.cjs`)

«Dopo» = 25 esecuzioni (19 log, più le 6 di `Q1U2s.log`); fra parentesi min–max. «Prima» = una esecuzione sul codice di prima di quella unità.

| Prova | Prima | Dopo | Fonte (log) |
| --- | --- | --- | --- |
| S1, un errore in un frame | 0 frame nei 1 000 ms dopo | 33–52 frame | `Q1U2_qa_stability_prima.log`; `L_Q1U2_qa_stability.log` (minimo), `Q1U6_qa_stability_prima.log` (massimo) |
| S2, errori a ogni frame | nessun pannello | pannello 25–52 ms dopo il primo errore; dopo il ricarico menu con «Continua» e stesso `stepId` (below → below) | `Q1U2_qa_stability_prima.log`; `Q1U2s.log` (minimo), `Q1U2b_qa_stability.log` (massimo) |
| S3, immagine dell'hub mancante | oltre 5 000 ms (5 281,6) in «loading», 0 pulsanti | pannello in 136–425 ms | `Q1U2_qa_stability_prima.log`; `Q1U4_qa_stability_rerun3.log` (massimo), `L_Q1U2_qa_stability.log` (minimo) |
| S4, background | avanzamento da nascosto 0 (già a posto prima: è una guardia) | 0; primo frame al ritorno 0,0166–0,05 s (limite 0,05) | `Q1U2_qa_stability_prima.log`; `L_Q1U2_qa_stability.log` (minimo 0,0166), `Q1U2s.log` (massimo 0,05) |
| S5, pannello aperto + blur/focus/hidden/visible | 4 scritture di salvataggio; l'audio ripartiva dopo focus e visible | 0 scritture; audio sospeso in tutti e 5 i passi | `Q1U2b_qa_stability_FAIL_on_U2.log`; `Q1U3_qa_stability.log` |
| S5b, errore dopo l'avvio nel bootstrap Android | «Il gioco non è riuscito a partire» si apre 1 volta | 0 volte | `Q1U3_qa_stability_prima.log`, `Q1U3_qa_stability.log` |
| S6 e S6b, asset mancante a inizio missione (a piedi / guida) | oltre 5 030 ms (5 030,8 / 5 036,6) con 0 pulsanti | pannello in 102,7–370,1 ms (34 misure) | `Q1U4_qa_stability_before_S6.log`; `Q1U6_qa_stability_1.log` (minimo), `Q1U2s.log` (massimo) |
| S7, «tieni premuto» + blur, poi 1 400 ms | la scelta si confermava da sola, riempimento 100% | pannello ancora aperto, riempimento `0px` (9 esecuzioni) | `Q1U6_qa_stability_prima.log`; `Q1U6_qa_stability_1.log`, `Q1U2s.log` |

- **S4, nota.** In 4 esecuzioni (`Q1U4_qa_stability_before.log`, `Q1U4_qa_stability.log`, `Q1U6_qa_stability_prima.log`, `Q1U6_qa_stability_3.log`; tutte con il codice di U2 già in uso) S4 è fallito con `firstFrameDeltaTime` = 0,05000000000000004: la somma corrente del tempo arrotonda di 1 ulp sopra il limite 0,05, non c'è un `dt` oltre il limite. Lo strumento ora tollera 1e-9 (U2s): 6/6 esecuzioni PASS dopo (`Q1U2s.log`, `Q1U2s_numeric.log`). Un `dt` di 51 ms o più fallirebbe ancora.
- **Il controllo morde.** Con un mutante di `runtime.mjs` (`fault()` che ignora i promise rifiutati) S3, S6 e S6b falliscono con 5 054–5 158 ms senza pannello (`L_Q1U4_qa_stability_m10.log`).
- **Costo del salvataggio nel browser (M-S1).** Con `localStorage` vero, 200 scritture: media 1,0–2,5 ms, massimo 8,4–60,5 ms (varia da un'esecuzione all'altra), 1 002 caratteri per i due slot (26 esecuzioni: `Q1U2_qa_stability_prima.log` e le «dopo»). In Node (Map al posto di `localStorage`) 499 caratteri per slot e 0,38–0,44 ms a scrittura (`A_size.log`, `A_cost.log`); gli stati salvati sono diversi, i due numeri non vanno confrontati. **[IPOTESI]** Sul telefono costa di più: non misurato.
- **Altri controlli nel browser, PASS** (rc=0), rifatti nel giro di chiusura del 4 novembre sul working tree finale (`Z_Q1.log`): `qa:save`, `qa:runtime`, `qa:hubs` (rifatto dopo U6), `qa:controls` (11 controlli), `qa:gamepad` (9), `qa:audio` (rc=0), `verify_startup_retry` e `qa:health` (11 casi). Giri per unità, prima della chiusura: `qa:save`, `qa:runtime`, `qa:controls`, `qa:gamepad` dopo U6 (`Q1U6_qa_save.log`, `Q1U6_qa_runtime.log`, `Q1U6_qa_controls.log`, `Q1U6_qa_gamepad.log`); `qa:hubs` dopo U4 (`Q1U4_qa_hubs.log`); `qa:audio` dopo U2 (`Q1U2_qa_audio.log`).

### Test, bundle, prestazioni, campagna

- **Test.** `npm test` passa da 279 (277 passano, 2 falliscono) a 296 (294 passano, stessi 2): +17. Sono `tests/stability.test.mjs` 4, `tests/fault-guards.test.mjs` 9, `tests/android-bootstrap.test.mjs` 2 e 2 nuovi in `tests/mobile-ui-contract.test.mjs` (da 5 a 7). I 2 che falliscono sono quelli di `python3 -I` con numpy, come in M2 (`Q1U1_npm_test.log`, `Q1U7_npm_test.log`). `tests/android-bundle.test.mjs` e `tests/bundle-globals.test.mjs` sono cambiati di una riga, senza test nuovi.
- **`app.js`.** 515 440 → 517 094 byte (+1 654); margine 8 848 → 7 194 su 524 288 (`Q1U1_verifica.log`, `Q1U7_verifica.log`).
- **`qa:performance`.** **[FATTO]** Si ferma con «insufficient live frames» (`verify_performance_v09.cjs:35`) in un passo con `cpu4` (il log non stampa il nome del passo che fallisce), sia sul codice di prima di Q1 sia dopo, su questo PC; **il punto di arresto varia da giro a giro**: dopo la riga `finale 360x800 cpu4` nel giro di U2 (`Q1U2_qa_base_performance.log`, `Q1U2_qa_performance.log`), dopo la riga `collapse 390x844 cpu4` nel giro di chiusura (`Z_Q1/performance.out` e `Z_Q1.log` riga 200: rc=1, 82 righe di p95, 68 a `cpu1` e 14 a `cpu4`, 16 righe con p95 di 16 ms o più). Quindi **non certifica la stabilità del frame rate**. Sulle 71 righe uguali nel giro di U2: costo medio per frame 4,661 → 4,479 ms; p95 medio a `cpu1` (68 righe) 9,98 → 9,87 ms; righe con p95 di 16 ms o più 14 → 12; a `cpu4` (3 righe, una esecuzione) il p95 medio sale da 31,77 a 34,50 ms (`Q1U2_qa_performance_confronto.log`). **[IPOTESI]** La causa dello stop è la CPU rallentata ×4 su un Celeron: non verificata. Un telefono vero si misura in M1.
- **Campagna A/B/C** (`verify_campaign_browser.cjs`), **giro di chiusura del 4 novembre, con `CITY_VIRTUAL_TIME=1` e `CITY_CAMPAIGN_TIMEOUT_MS=3600000`: PASS** tutte e tre, 31 passi, 8 incarichi, 2 preparazioni, `errors` [] (`Z_Q1_campaign.log`, `Z_Q1/campaign-{a,b,c}.out`). Tempi di orologio murale: 1 932 / 1 497 / 1 555 s (`elapsedMs` 1 931 955 / 1 497 188 / 1 554 943 in `Z_Q1/campaign-{a,b,c}/report.json`); lo storico v10.2 su orologio virtuale era 208–218 s (`docs/evidence/v10.2/campaign-{a,b,c}-report.json`). **[IPOTESI]** La lentezza dipende da questo PC (Celeron N3060): non verificata. **Con il watchdog predefinito di 25 min (1 500 s, riga 5 dello strumento) la strategia A non passa su questo PC**: «Bounded campaign timeout at archive» (riga 36) dopo 1 505 s, a 20 passi su 31 (`Z_Q1_campaign_run2_deadline25min.log`, `Z_Q1/campaign-a_deadline25min.out`). È il watchdog dello strumento, non un'asserzione di gioco. **[INFERITO]** Anche C (1 555 s) lo supererebbe; B (1 497 s) lo eviterebbe di 3 s: B e C non sono state provate col watchdog predefinito. C ha 1 `uiRaces` (`#opening-surface` non visibile al passo `opening`, «page.click: Element is not visible»; A e B 0): lo strumento lo tollera solo se l'elemento non è più visibile, altrimenti rilancia l'errore (righe 27–31). In U4, senza `CITY_VIRTUAL_TIME` (a orologio murale, **non** la procedura documentata): 1 447 / 1 469 / 1 180 s su un limite di 1 500 s (margine 3,6% / 2,1% / 21%; `elapsedMs` 1 446 634 / 1 469 136 / 1 179 964 in `Q1U4_qa/campaign-{a,b,c}-report.json`, riepilogo in `Q1U4.log`), tutti e tre PASS, 31 tappe.
- **`qa:v9`.** **[FATTO]** Nel repo `npm run qa:v9` esce con rc=1 per 9 errori «missing artifact» (8 sotto `artifacts/v9-health-bar/`, 1 `artifacts/v9-controls/campaign-a/report.json`; `Z_Q1/v9.out`): il checkout è sparse con `!/artifacts/` (`.git/info/sparse-checkout`). Su un albero esportato da c4ec6f5 (artifacts, docs/production e tools) lo stesso strumento dà `ok: true`, 0 errori, rc=0 (`Z_Q1/v9_export.out`, `Z_Q1.log`); un primo albero esportato incompleto, senza `docs/evidence/v9`, dava rc=1 con 38 errori, e il log non dice cosa si è aggiunto fra i due. Non è una regressione di Q1: l'esito dipende dagli artefatti presenti. G0 PASS, G1–G5 BLOCKED in entrambi i casi.

### Scelte prese con la carta bianca (D35), da far vedere all'autore

- **(a)** Al 3° errore in 5 s (`game/stability.mjs`: `limit=3`, `windowMs=5000`) si apre il pannello «Qualcosa si è inceppato.» con «Riprendi dall'ultimo salvataggio», che ricarica la pagina. Subito, senza contare, per un promise rifiutato o un asset mancante a inizio missione. **[INFERITO]** La soglia è un numero di diagnostica, non un tempo di gioco.
- **(b)** Dopo un errore non si salva, nemmeno in background: vale l'ultimo salvataggio valido, scritto al massimo ogni 10 s di gioco attivo e a ogni pausa o tappa.
- **(c)** Il testo «Il salvataggio è al sicuro.» è incondizionato. Con la memoria piena o nel menu non è vero: **limite noto**.
- **(d)** Un blur anche breve annulla la pressione di «tieni premuto»: si deve ripremere, nessun progresso perso. La durata di 1 200 ms non cambia.
- **(e)** Il Chrono Shift, le finestre di schivata e parata e gli hitbox **non sono toccati** (regola 4 di CLAUDE.md). Il corpo di `frame` (ora `frameStep`) è invariato; la richiesta del frame successivo è ora fatta da `guardedFrame` prima di eseguirlo. `verifica.sh` segnala 11 righe di `game/` per parole come «frame» o «startup» (`Q1U8b_verifica.log`); le ho lette, nessuna cambia valori di hitbox, finestre o durate.

### Punti aperti

- **Per l'autore:**
  - la lettura di D35 su hitbox e finestre di combattimento;
  - la soglia «3 errori in 5 s» (a);
  - «niente salvataggio dopo un errore» (b);
  - **[INFERITO]** i valori già fissati da una decisione (memoria dei tocchi di 100 ms in D27, durata e ricarica del Chrono Shift in D29) cambiano solo con una nuova riga in DECISIONI.md, anche se sono «soglie di input» o «feel»;
  - **[FATTO]** `save-recovery.json` nella radice del repo è un residuo di `qa:save`: non tracciato (`?? save-recovery.json` in `Z_Q1.log`), non va committato; decide l'autore se cancellarlo (non l'ho cancellato).
  - il watchdog di 25 min di `tools/verify_campaign_browser.cjs` (riga 5) è troppo stretto su questo PC: decidere se alzare il default dello strumento o usare un'altra macchina (non l'ho toccato);
  - il trailer «Co-Authored-By» con un nome di modello nei commit precedenti (70 commit su 198 fino a c4ec6f5; 8 su 8 nell'intervallo c4ec6f5~8..c4ec6f5) contro la regola 10 di CLAUDE.md: da decidere come trattarlo;
  - i punti aperti di M2, nella sezione qui sotto.
- **M1, sul telefono (NON POSSO CONFERMARE qui):** l'elenco è in [PLAYTEST.md](PLAYTEST.md), sezione «Q1 — stabilità, QA automatica». M1 resta a fine lavoro (D33).
- **Disco.** L'interno è quasi pieno: 126 MB liberi su 27 210 MB, 100% usato (`df -m /`, 4 novembre, dopo il giro di chiusura); durante il giro di chiusura il libero è sceso da 138 a 126 MB (`Z_Q1.log`, campo `avail`, righe 62 e 217, in MiB). 32 cartelle scratch di M2 sono archiviate sulla chiavetta, fuori dal repo.
- 0 sessioni umane ([PLAYTEST.md](PLAYTEST.md)). `COMMERCIAL_RELEASE = BLOCKED`.

## M2 — Input e sensazione dei colpi (3 novembre 2026)

- **D32.** L'autore delega lo sviluppo fino al rilascio commerciale, nel rispetto delle istruzioni del repo su GitHub e dei prompt dello zip che ha mandato. Due dei tre file dello zip erano identici a quelli del repo prima di M2; in M2 è cambiata solo la riga 98 di CLAUDE.md (D33). Il terzo file contiene i prompt di avvio e di ripresa, con le stesse righe del §2 di ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md. È un'interpretazione da confermare.
- **D33.** Risposte dell'autore su Chrono Shift, test della guida, M1, M4 e M7.
- **D34.** Gli stranieri vanno nell'outro; il lampo di G1 si spegne con «movimento ridotto»; l'autore chiede un menù principale professionale; i test non si riducono mai; sulla chiavetta USB c'è ora la partizione `CHRONOS` (49,3 GiB) per lo spazio.
- **Fatto in M2.** Prove automatiche e nel browser del PC; nessuna prova sul telefono.
  - **E1:** l'evento `telegraphLock` arriva una sola volta, quando la mira di un attacco si blocca. Il tick del blocco non cambia.
  - **C1:** SCHIVA, DUO e ATTIVA partono al tocco (`pointerdown`), non al rilascio.
  - **N1:** memoria dei tocchi per SCHIVA, SPARA e PULSE; i pulsanti in ricarica non sono più disattivati. Ogni interruzione (pausa, sospensione, dialogo, scena, blocco) svuota la memoria, come prima di N1. Così un tocco su SPARA non fa più partire da solo il colpo finale contro Archon.
  - **Estensione dei controlli nel browser:** `qa:controls` passa da 9 a 11 controlli: lo scatto parte al tocco e SCHIVA resta attiva in ricarica.
  - **G1:** hit-stop solo visivo di 2 frame per l'arma, 4 per il Pulse e 6 per il colpo che abbatte. Con «movimento ridotto» il lampo bianco non si disegna; il fermo della posa resta.
  - **CS:** Chrono Shift con le scelte di D33. Il bordo ciano si vede solo a missione in corso, non sotto la schermata di sconfitta.
  - **Bot di prova corretto** (`tests/helpers/autoplay.mjs`). Con CS il test «every foot mission is winnable…» falliva nella missione blackout. Motivo: contro Rook il bot sparava fermo da 326-383 px, ma la gittata della C-9 è 310. Ora avanza se il bersaglio è oltre la gittata dell'arma attiva. Il test e la sua soglia non sono cambiati. Vittorie su 3 semi, per ognuna delle 2 serie di flag:

    | Policy del bot | Senza CS | Con CS |
    | --- | --- | --- |
    | di prima | blackout 2/3 | blackout 1/3 |
    | corretta | blackout 3/3 | blackout 3/3 |

    Le altre 11 missioni vincono 3/3 in tutte e quattro le combinazioni: nessuna missione peggiora.
  - **`qa:gamepad` deterministico.** Causa: il gioco legge il gamepad una volta per frame, mentre lo strumento aspettava tempi fissi di 60-80 ms. In pausa tra due frame passano fino a 100 ms, quindi un tasto premuto e rilasciato poteva non essere letto. Prima della correzione: 24 giri PASS, 31 FAIL su «Start resumes» e 5 FAIL nelle finestre da 60 ms. Correzione: lo strumento aspetta 2 frame del gioco dopo ogni cambio del gamepad (`settle()` in `tools/verify_gamepad_browser.cjs`). Le attese fisse restano e nessuna asserzione è cambiata (sempre 9 controlli). Esiti: 15/15 giri PASS (10 `qa:gamepad` con Chromium, 2 con Chrome, 3 `qa:controls`), più 7/7 in una verifica indipendente. **[IPOTESI]** Il gioco non va corretto, perché un tocco vero dura più di un frame; si prova in M1.
- **Test.** `npm test` passa da 249 a 279 test. Su questo PC ne passano 277. I 2 che falliscono lanciano Python con `python3 -I` (`tests/tooling-syntax.test.mjs`: prop delle gare e chiave cromatica): numpy è installato solo nella cartella dell'utente, che `-I` esclude. Prima di M2 qui passavano 246 su 249; il terzo fallimento era il test della guida, per `deliveries/` in CLAUDE.md:98, corretto con D33.
- **Bundle Android.** `app.js` passa da 513 065 a 515 440 byte, sul limite di 524 288.
- **M1 rimandata a fine lavoro (D33).** Restano da provare sul telefono: gamepad, joystick, C1, N1, G1, CS, tocco breve su Start in pausa e rilascio di B dopo lo scatto. L'elenco per le persone è in [PLAYTEST.md](PLAYTEST.md).
- **Punti aperti per l'autore:**
  - la lettura di «MSI» (D33);
  - la portata di «M7 approvo» (D33);
  - durante lo shift durano di più la guardia del Mirror e lo stordimento del Duo;
  - il bordo ciano resta fermo sullo schermo in pausa e nei dialoghi;
  - i diritti di Kairn e Morrow ([STRANIERI.md](STRANIERI.md), D34);
  - **[IPOTESI]** la partizione `CHRONOS` si rimonta da sola solo se lo fa la sessione desktop (non c'è una voce in fstab).
- **Dopo M2, scelta operativa [INFERITO]:** outro con Kairn e Morrow e menù principale (D34), da pianificare. Le note «non ancora implementati» di D27 e D29 sono superate da questa sezione; le righe storiche non si riscrivono.
- 0 sessioni umane ([PLAYTEST.md](PLAYTEST.md)). `COMMERCIAL_RELEASE = BLOCKED`.

## Prompt per Claude su MX Linux (2 novembre 2026, sera)

- **D31.** L'autore conferma come proposti i due Pilastri 2, compreso il Chrono Shift.
- **[`CLAUDE.md`](../../CLAUDE.md)** è nella radice del repo, e Claude Code lo legge da solo all'avvio. Contiene:
  - le regole fisse;
  - la mappa «cosa ti serve → dove»;
  - quale documento vince e quali sono solo storici;
  - i comandi.
- **Il §2 di [ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md](ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md)** contiene il prompt di avvio e il prompt di ripresa. Non copiano le regole: dicono a Claude dove sono nel repo.
- **`tests/claude-guide.test.mjs`** controlla che i 52 percorsi citati esistano e che non compaiano identificativi di modello. È stato provato anche su un percorso sbagliato e su un nome di modello inseriti apposta: in entrambi i casi il test fallisce.
- `npm test` 249/249 PASS. Il codice del gioco non è cambiato. `COMMERCIAL_RELEASE = BLOCKED`.

## Gamepad, boss v2 e istruzioni per il PC (2 novembre 2026)

- **D29.** Il Pilastro 2 del combattimento è approvato: G1, E1 e CS non sono ancora implementati.
  - **Gamepad N2 implementato:** mappatura standard W3C, solo a piedi e negli hub.
  - **Prove:** 4 test unitari, più `npm run qa:gamepad` con 9 controlli PASS su un gamepad simulato in Chromium.
  - **Manca** la prova su un telefono con un controller vero.
  - **Nessuna regressione:** `qa:controls` 9/9 PASS e laboratorio di combattimento PASS.
- **D30.** Il Pilastro 2 della grafica è approvato.
  - I 10 controlli sono in `tools/art_derived_checks.mjs`, con 8 test.
  - Il pacchetto `requests/gpt-boss-v2-20261102/` contiene 20 prompt per 36 immagini. **Nessuna immagine è ancora generata.**
- **Istruzioni per una nuova chat sul PC MX Linux:** [ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md](ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md). Contengono preparazione del PC, messaggio da incollare e mandato M1–M7.
- `npm test` 245/245 PASS. `COMMERCIAL_RELEASE = BLOCKED`.

## Design V10.3 — benchmark e pilastri (2 novembre 2026)

Documenti in [docs/design/v10.3](../design/v10.3/README.md): benchmark in 3 fasi (rivisto); combattimento Pilastri 1 (approvato, D27) e 2 (approvato, D29); grafica Pilastri 1 (approvato, D28) e 2 (approvato, D30), con misure riproducibili (`tools/art_style_audit.py`). Decisioni dell'autore D18–D30 in [DECISIONI.md](DECISIONI.md); quelle di oggi pomeriggio (D29, D30) e il gamepad sono nella sezione sopra. C1 e N1 approvati ma non implementati: sono nel mandato per il terminale (M2). COMMERCIAL_RELEASE BLOCKED.

## Produzione Codex successiva a d019eb4

Primo lotto in `assets/production/v10.2/handoff/astra_p1/`: G1–G3 e A1–A4 candidati, con limiti in README e manifesto. G4–G10 aperti. Nessuna nuova prova gameplay, Android o ascolto umano. COMMERCIAL_RELEASE BLOCKED.

Aggiornamento armi impugnate: due adattamenti reali VX-9/R-12 integrati e provati nel browser; dettagli e lacune in [EQUIPPED_WEAPONS.md](EQUIPPED_WEAPONS.md). E06/E10/AS10 PARTIAL, COMMERCIAL_RELEASE BLOCKED.

# CHRONOS Gold — punto di ripresa

## Sessione Opus — integrazione pacchetto Codex (corrente)

**MANDATO PARZIALE — COMMERCIAL_RELEASE = BLOCKED.** Branch `work/chronos-adventure-commercial`, partito da `3f746d5` (= commit di riferimento). Pacchetto: 205/205 file presenti, 0 hash diversi da `PACKAGE_MANIFEST.json`. Baseline prima delle modifiche: `npm test` 176/176 PASS; percorso A italiano con clock virtuale: 31 tappe, 8 incarichi, 2 preparazioni, finale raggiunto (prova browser, non durata umana).

- **Blocco 1 — ricarica VX-9/R-12 (INTEGRATO, verificato in browser).** Dettagli e lacune in [EQUIPPED_WEAPONS.md](EQUIPPED_WEAPONS.md#ricarica-vx-9--r-12--integrazione-dei-master-codex). ART03 OPEN → PARTIAL (solo ricarica di due armi). Suite 180/180.
- **Blocco 2 — Kairn e Morrow fedeli alla foto + audio (INTEGRATO, verificato in browser).** Comparsa prima del dialogo, comportamenti distinti con colpo al frame di rilascio, tema e SFX collegati agli eventi reali, post-titoli con i nuovi sheet. [STRANIERI.md](STRANIERI.md). CRE04, E05, E09, AS09 OPEN → PARTIAL. Suite 185/185. **Rischio:** somiglianza dei due design con personaggi noti → revisione diritti prima della release.
- **Blocco 3 — banda di gioco su telefono orizzontale (IMPLEMENTATO, verificato in browser).** Banda 88–140 px → 218–270 px, eroina 53–61 → 69 px, zero sovrapposizioni; barra armi fra i pollici; verticale invariato. Corretti anche RISONANZA fuori dal pulsante e due fixture/aspettative obsolete degli strumenti (`verify_release_flow.cjs` testava Rook invece del finale e si aspettava 20 tappe). [LAYOUT_ORIZZONTALE.md](LAYOUT_ORIZZONTALE.md). B01, B04, E03 OPEN → PARTIAL.
- **Blocco 4 — gare Ash Docks di Veyra negli hub (IMPLEMENTATO/INTEGRATO, verificato in browser).** Vortex parcheggiata negli hub di Vanta seguendo Nox, tre gare in serie con Veyra, asset della guida di campagna, record e premi salvati senza farming; facoltative (D05), quindi fuori dalla durata obbligatoria. [GARE_VEYRA.md](GARE_VEYRA.md). E07, NAR05, CRE05 OPEN → PARTIAL.

- **Blocco 5 — The Anchor nella Breccia (IMPLEMENTATO/INTEGRATO, forme prototipo dichiarate).** Incontro 2/17: nucleo ormeggiato da tre cime, Risonanza che taglia e interrompe, corsie telegrafate, fase 2, checkpoint, primo componente H-17. Corretti anche il genere grammaticale di Nox (D07) secondo l'autore. [ANCHOR.md](ANCHOR.md). E08 OPEN → PARTIAL. Arte/audio propri richiesti ad Astra (G11, G12, A5).
- **Blocco 6 — Integrazione consegna Astra 20261027 (INTEGRATO PARZIALE, D09).** The Anchor con sprite, bitte e audio A5 (cime e corsie restano procedurali); impatti C-9/VX-9/R-12; auto di Veyra, container e checkpoint stretti nelle gare con la musica di Veyra; ritratti di Kairn, Morrow e Veyra. Respinti con correzione: cavo e spazzata di The Anchor, strade, cancelli, sheet H-17/ARC-7, icone H-17, sheet di Veyra, `race_start`. «Due colpi» in attesa dell'autore. Famiglie tutte APERTE. [ASTRA_INTEGRAZIONE_20261027.md](ASTRA_INTEGRAZIONE_20261027.md).
- **Blocco 7 — Correzioni Astra f727255 (INTEGRATO PARZIALE, D10).** Integrati: G11 riesportato, segmento del cavo e corsia della spazzata di The Anchor, piloni e nastro dei checkpoint larghi, bip 3-2-1 e via. Conservate le icone H-17. Respinte le strade (ritmo del tratteggio spezzato alla giunzione). Terminale del cavo prima respinto, poi sistemato dal team su richiesta dell autore. **APERTO G6/G7**: decisione sulle basi degli sheet H-17/ARC-7. La consegna non è completa.
- **Giro 3 Astra (richiesta revisione 4, `ddd5d29`): CONSEGNA INCOMPLETA, nulla da integrare.** Il ramo `delivery/astra-giro3-20261027` (`7c90967`) contiene solo `STATO_INCOMPLETO.md`: ZIP di richiesta verificati da Astra, nessun asset consegnato. G6/G7: il generatore altera il personaggio (1.865/2.000 pixel della testa diversi dal riferimento) e gli effetti sconfinano. G4: solo un master giorno intermedio senza segnaletica, non esportato né misurato, manca la notte. Restano APERTI G4 e G6/G7; in gioco H-17 e ARC-7 si impugnano con lo sheet base C-9 (`nox_gun`, `lulu_gun`) senza animazione di ricarica, e le gare usano la strada `driving_road`.
- **Blocco 8 — Pulizia degli sheet 4×4 (D13).** Corretti 14 sheet: niente più scarpe tagliate nella vista di schiena e nei nemici, niente scarpe o effetti che galleggiano sopra la testa della posa sotto, niente schegge di lampi nelle celle vicine. Nessun pixel ridisegnato o riscalato. Prove: test `sheet-layout` (posizione a schermo di ogni riga), verifica browser con il vero `drawLegacySprite` (PASS, 14 sheet, nessun pixel sul bordo delle celle), campagna A PASS (31 tappe), armi equipaggiate PASS, The Anchor PASS, 204/204 test. Revisione visiva umana e prova su dispositivo Android restano da fare.
- **Sfide della Vortex (D17):** Contro il tempo (medaglie), Eliminazione, Rivincita sui percorsi di Ash Docks completati. Test 214/214; verifica nel browser `tools/verify_race_modes_browser.cjs` PASS a 390×844 e 844×390 (menu, tre sfide giocate, medaglia salvata, eliminazioni, percorso al contrario, ricarica del salvataggio). Tempi delle medaglie dall'auto pilota: da tarare con giocatori veri.
- **Comandi (D16): joystick flottante su tutta la mappa** (guida e a piedi), animazioni di guida (camera in curva, rollio, segni gomme, scintille, anelli, conto alla rovescia animato), velocità in km/h, vibrazione disattivabile (permesso Android VIBRATE). Verifica nel browser: il trascinamento sulla mappa muove Nox e sterza la Vortex in entrambi gli orientamenti. Sensazione al tatto da provare su dispositivo.
- **Gare (D15): nitro e ostacoli nuovi.** Barra nitro con pulsante NITRO (anche Spazio/Maiusc), rampe nitro, partenza perfetta, scia, sfiorati. Nuovi ostacoli: sbarramento con varco, carico della gru, chiazze d'olio e di sabbia, distribuiti nelle sette gare. Test 211/211; verifica gare nel browser PASS a 390×844 e 844×390 (partenza perfetta, nitro, pulsante). Suoni ancora sintetizzati e grafica dei nuovi ostacoli disegnata dal gioco: asset dedicati da chiedere a Terra. Bilanciamento verificato solo con l'auto pilota di prova, non da giocatori.
- **Terra giro 3, grafica della gara: RICHIESTO, NON CONSEGNATO.** Pacchetto `requests/terra-giro3-gara-20261028/`: 34 tele con maschera sulle misure delle hitbox (20 per Ash Docks, 14 per Solkara e Aurelia Span), tavola della scala, riferimenti, 11 suoni OGG se Terra produce audio (altrimenti Astra). Ritorno controllato da `tools/compose_terra_race_props.py`. Finché un file manca, il gioco tiene il disegno attuale.
- **Terra giro 1 (D14): INTEGRATO PARZIALE.** G5b integrato: quattro modelli di container in gara. G4 integrato con composizione del team dai tentativi di Terra: tre strade di Ash Docks di giorno e di notte, con sequenze fisse per gara. Il controllo strade dà PASS e la verifica gare PASS in entrambi gli orientamenti. Differenze dichiarate: marciapiedi stretti in orizzontale; oggetti tagliati sotto il giunto invece di chiusi da un paletto. **APERTO G6/G7 (armi)**: le viste isolate ci sono, manca la composizione con maschera delle 64 celle. Dettaglio: [TERRA_INTEGRAZIONE_20261027.md](TERRA_INTEGRAZIONE_20261027.md).

**Richieste a Codex:** [RICHIESTE_CODEX.md](RICHIESTE_CODEX.md) — P1 Veyra (ritratto, sprite, veicolo) e asset/audio delle gare Ash Docks; P2 H-17/ARC-7 impugnate + ricarica, impatti delle quattro armi, icone e SFX; P3 Anchor/Vega/Volkov completi; ritratti di Kairn e Morrow.

**Gate (stato onesto, nessun PASS commerciale):** 74 criteri 55 OPEN / 19 PARTIAL; AS01–AS12 3 PARTIAL / 9 OPEN; E00–E12 7 PARTIAL / 6 OPEN. Direzione artistica, coerenza narrativa, asset/audio, gameplay/progressione, salvataggi, accessibilità/localizzazione, prestazioni/offline, playtest umani/durata, Android/rilascio: tutti aperti o parziali. Nessuna persona, ascolto, licenza o dispositivo coinvolti in questa sessione.

**Punto di ripresa preciso.**
1. Ambiente: `npm ci`; server `python3 -m http.server 8090 --bind 127.0.0.1` dalla radice; per gli strumenti browser in questo container `PLAYWRIGHT_MODULE=/opt/node-tools/node_modules/playwright CHROMIUM=/opt/pw-browsers/chromium`.
2. Verifiche della sessione: `npm test`; `tools/verify_reload_browser.cjs`, `verify_strangers_browser.cjs`, `verify_play_band.cjs`, `verify_hub_race_browser.cjs`, `verify_weapon_layout_browser.cjs`, `CITY_VIRTUAL_TIME=1 verify_release_flow.cjs … finale W H`, `CITY_VIRTUAL_TIME=1 verify_campaign_browser.cjs … a`.
3. Prossimo blocco eseguibile senza nuovi asset: regole e arena di **The Anchor** (primo componente H-17) con la struttura di Rook, consegnando a Codex la specifica di frame/tempi; poi sblocco H-17 nel save con `grantWeaponRewardV9`. In parallelo: B/C della campagna dopo i blocchi 2 e 4, e misura della scala orizzontale degli interludi di guida (strada stretta, condivisa con le gare).
4. Dipendenze esterne: asset Codex elencati sopra; persone nuove per durata (100–140 min diagnostici) e comprensione; telefono Android fisico; revisione diritti/somiglianza di Kairn e Morrow; SDK/API 36, bundletool e chiave `chronos-upload` esistente per l'AAB (mai una chiave nuova).

Branch `work/chronos-adventure-commercial`. Le modifiche vengono conservate nel checkpoint Git di questa iterazione; i riferimenti di prova indicano file e sorgenti, non un APK commerciale. Il [rapporto operativo V10.2](../production/v10.2/EXECUTION_STATUS.md) conserva il quadro precedente e le correzioni di questa iterazione.

## Stato corrente — kit di Tessa e recupero v7

**MANDATO PARZIALE — COMMERCIAL_RELEASE = BLOCKED.** Il [rapporto del kit](FIELD_KIT.md) distingue implementazione, produzione, integrazione e verifica.

- **Direzione artistica:** Tessa originale, due gesti runtime da uno sheet di quattro pose; icone V8 conservate; barra armi fuori dalla fascia cure/comandi. Sei viewport per entrambi i protagonisti; correzione del testo Risonanza a 360 px. Animazioni dell'arma impugnata ancora condivise: famiglie VX-9/R-12 PARTIAL.
- **Coerenza narrativa:** relè → Rook con due Raider → scelta → Tessa → fuga/Moon. Consegna comune e banco portatile coerenti con entrambe le scelte. Recupero degli avanzati con ID stabili, senza doppio premio; se Rook era vinto si recupera solo Tessa. Gesso interrotto conserva rotta e bookmark. Nessuna riscrittura del canone del finale.
- **Asset/audio prodotti in questo blocco:** uno sprite sheet originale, un brano originale di 19,2 s e sei cue originali; master, partitura, metriche e generatore versionati. Riuso dell'atlante armi V8. Zero COMMERCIAL_READY.
- **Prove:** 174/174 Node PASS; kit su entrambe le scelte, cambio/tiro/ricarica touch, rollback e selezione persistente; browser v7 boss, hub e Rook/Gesso combinati. Vittoria salvata prima del ritardo cosmetico e ricaricata in quel momento. A/B/C: 31 tappe, otto incarichi, due preparazioni, zero errori; sorgenti e controlli delle sole modifiche successive separati nei rapporti.
- **Inventario:** 150 media/sorgenti tecnicamente decodificati, inclusi 14 MIDI; 99 media nel pacchetto, 103 risorse totali. JS classico 403018 byte. Registro selettivo: 30 record, 24 NEW / 2 ADAPT / 4 REUSE; 0 REPLACE. Due fonti remote REJECT rimangono separate. Sono perimetri diversi, non 442 famiglie chiuse.
- **Gate:** E06/E10 e AS10 ancora PARTIAL; 74 ID originali invariati, 14 PARTIAL / 60 OPEN. IT/EN non è la priorità corrente. Nessun playtest umano, ascolto, licenza o dispositivo inventato. Nessun AAB commerciale.

Prossimo lavoro eseguibile: asset impugnati e animazioni per le tre armi ora in campagna; H-17/ARC-7 con i rispettivi incontri e sblocchi, gare Veyra nella progressione, scene V10.2 residue e roster/regioni completi. Durata umana verso 120 minuti ancora non misurata. Android, persone nuove, fonti V8.5 valide e strumenti/chiave Play restano dipendenze precise, non una dichiarazione di completamento.

## Checkpoint Rook 7813ec8 — storico

**MANDATO PARZIALE — COMMERCIAL_RELEASE = BLOCKED.** Le sezioni successive conservano lo storico, non sostituiscono questi dati correnti. Non sono stati dichiarati gate commerciali PASS.

- Rook è nella progressione di Blackout prima della scelta: rosata anticipata/bloccata, mine disarmabili, riposizionamento, coperture reali, Breaker e oscuramento parziale nella seconda fase. Checkpoint e flag di vittoria reali, senza attribuzioni retroattive.
- **Direzione artistica:** nuovo sprite sheet originale a otto pose, arena, segnali elettrici e camera del duello. Primo inquadramento e oscuramento corretti dopo screenshot. Qualità completa delle animazioni, revisione umana e mobile fisico restano aperti.
- **Coerenza narrativa:** scelta successiva preservata, nessuna conoscenza nuova inventata, ripresa boss senza ripetere il dialogo pre-missione. Recupero di Rook nei v7 avanzati, Quickdraw e Tessa sono ancora OPEN: E06 è PARTIAL.
- **Asset/audio:** un nuovo sheet, una composizione originale di 24 s e cinque SFX specifici di Rook; conservati due SFX locali originali per gesso/cura e le due intro JaguarzCreatorz già integrate. Master, generatori, partitura, Ogg, hash e associazioni runtime sono versionati. Nessun ascolto umano o diritto commerciale certificato.
- **Prove:** 162/162 Node PASS; browser Rook con tasti/UI, reload, asset/audio avviati e scelta persistente PASS, con zero retry nell’ultimo ricontrollo (due in una prova precedente). Confezionamento Android: 394491 byte JS, 95 risorse totali; non è una prova WebView o Android fisica. [Dettagli e ripresa](ROOK.md).
- **Inventario:** 142 media/sorgenti censiti tecnicamente, inclusi 14 MIDI; 91 media confezionati; 0 COMMERCIAL_READY. Registro selettivo di questa lavorazione: 21 record, 16 NEW / 2 ADAPT / 3 REUSE; nessun REPLACE. Le due fonti V8.5 remote non decodificabili restano REJECT separati. Questi conteggi hanno perimetri diversi e non chiudono 442 famiglie.
- **IT/EN:** conservata l'implementazione e le prove precedenti. Su istruzione esplicita dell'autore non è la priorità corrente; nessuna revisione umana o chiusura completa viene attribuita. A/B inglesi sono rapporti storici, non prove della nuova integrazione Rook. Nessun rapporto C precedente disponibile viene ricreato o inventato.

Regressione italiana A: 31 tappe da Nuova storia al postcredit, otto incarichi e due preparazioni, zero errori. Le sole correzioni successive delle mine sono ricontrollate nel test Rook e nella suite. Hash e perimetro in `ROOK.md`.

Prossimo blocco eseguibile: Quickdraw/Tessa con asset e insegnamento del cambio arma; recupero Rook tramite ID stabili nei v7 avanzati, combinato con il catchup Gesso; prima slice su entrambe le scelte. Restano gli altri incontri, armi/gare reali, nove regioni, due scene V10.2, asset/audio e misure umane verso 120 minuti. Non sono dipendenze esterne: sono lavoro ancora da implementare. Dispositivi, playtester, esportazioni V8.5 valide e chiave/SDK Play sono dipendenze esterne separate.

## Storico delle iterazioni precedenti

## Verifiche chiuse a livello tecnico

- `npm test`: 146/146 PASS dopo la migrazione v7 e la correzione della battuta dell'Archivio.
- Due continuazioni browser di salvataggi v7 storici, Archivio al checkpoint del boss e hub Toxic con indice di ritorno precedente all'inserimento: entrambe tornano al punto giusto dopo `Segni di Gesso`, senza doppio premio. [Rapporto](../evidence/v10.2/chalk-migration-report.json) e [verificatore](../../tools/verify_chalk_migration_browser.cjs).
- La correzione narrativa nell'Archivio è verificata da un'asserzione sul dialogo. Richiede ancora il riesame integrale della storia nel browser, IT/EN e con lettori nuovi.

## Direzione artistica

Menu mobile e icona hanno screenshot di confronto browser; la missione del gesso usa segno e civile specifici. Sono integrazioni parziali. Mancano confronto completo di silhouette, materiali, luci, HUD, animazioni, UI IT/EN, accessibilità e dispositivi. Le tavole V8.5 non sono state accettate come media finali: la nota `docs/production/v9/sources/01-art-v85.md` descrive una pubblicazione storica, ma `assets/chrono_shadows/latest_v85/` e `docs/WORLD_CHARACTER_EXPANSION_BIBLE_V85.md` non esistono in questo checkout, che espone solo `origin/work/chronos-adventure-commercial`. Servono i binari e la bibbia originali per il confronto V8.5.

## Coerenza narrativa

La tappa del gesso avviene durante la separazione anche nei salvataggi avanzati, tramite recupero giocabile. La traccia fisica consente a Nox di dedurre che qualcuno ha riaperto il passaggio, senza conoscere l'autore. Restano da verificare tutte le conoscenze/scelte nelle missioni, le tre nuove scene V10.2, il finale e il reload lungo i percorsi A/B/C.

## Asset, audio e contenuti

La matrice V10.2 contiene requisiti, non 442 file. Il [registro asset](ASSET_REGISTER.json) censisce soltanto due SVG di missione, l'icona e il cue WebAudio interessati da questa iterazione; tutti restano prototipi per il gate commerciale. Il [registro audio](AUDIO_REGISTER.json) riconcilia i 129 indici con la fonte originale e segnala esplicitamente mappatura runtime, produzione, diritti, ascolto, loop e mix da completare. Le sette gare e cinque armi V9 sono ancora nei laboratori/preview, non nella progressione. Le tre gare aggiunte non esistono in runtime. Durata umana verso 120 minuti: non misurata.

## Difetti e prossimo blocco eseguibile

1. A/B/C dopo migrazione e correzione narrativa: 31 tappe ciascuno, zero errori, stessa sorgente `3afdbec0…`. I rapporti precedono soltanto l’integrazione intro e il posizionamento dell’avviso HUD, verificati separatamente. Proseguire con la matrice dei salvataggi intermedi e Android.
2. Integrare il primo contenuto V9 già giocabile nella progressione senza duplicare le cinque sequenze di guida narrative. Per ciascuna gara creare gli asset specifici mancanti prima di chiuderla.
3. Produrre e verificare IT/EN e asset/audio pertinenti per `Segni di Gesso`, poi le altre due scene V10.2. Misurare il ritmo con persone nuove solo su una build adatta al playtest.

Blocco esterno preciso per Android Play: in questo ambiente non sono stati trovati Android SDK/API 36, build-tools 36.0.0, bundletool né la chiave privata di upload. Il certificato pubblico indicato dall'autore non sostituisce la chiave. Servono questi componenti e tutti i gate di gioco prima di un AAB commerciale vcode2; nessun bundle di questa iterazione è dichiarato pronto.

## Ultimo blocco: intro e HUD

Due intro JaguarzCreatorz integrate (REUSE), con riproduzione mobile/desktop, skip, audio su gesto, fallback e riduzione movimento verificati nel browser. [Dettagli](INTRO.md). L’avviso del checkpoint boss ora lascia libere barra e pulsante Bagaglio: le due disuguaglianze geometriche sono controllate nel verificatore di migrazione, oltre allo screenshot `archive-restored-after.png`. Suite corrente 146/146.

Audit file runtime di questa iterazione: 5 trovati, 2 REUSE, 1 ADAPT, 2 NEW, 0 REPLACE, 0 REJECT, 0 COMMERCIAL_READY. Questi numeri non censiscono tutti i media preesistenti e non chiudono le 442 famiglie: il loro audit completo resta aperto. COMMERCIAL_RELEASE = BLOCKED.

## Iterazione successiva — Cura e recupero V8.5

Direzione artistica: aggiunta icona originale Medseal e comando Cura fuori dalla griglia, preservando posizione di Spara/Schiva. Il calcolo camera include il comando. Quantità, bordo tratteggiato e descrizione accessibile indicano lo stato senza affidarsi al colore. Il cue sintetico heal e l’anello appaiono solo dopo una cura salvata. IT/EN completo, ascolto umano, touch su dispositivi e gate commerciale restano aperti.

Coerenza narrativa: non cambiano eventi, protagoniste, risorse disponibili o premi; i kit acquistati restano consumati dopo reload/retry. Il comando non funziona in pausa, durante dialoghi, da sconfitti o a salute piena. Un errore del salvataggio ripristina salute e quantità. Prove pure di rollback e browser di cura in movimento: `medicine-report.json` e `medicine.png`. Suite aggiornata: 147/147 PASS.

Recuperata da GitHub `main` la bibbia `docs/WORLD_CHARACTER_EXPANSION_BIBLE_V85.md` (blob bea7e12cdd7c4a34c9cf7db1b71caf5c193a072c). Il blocco precedente sulla fonte testuale è risolto. La directory remota contiene ZIP, preview e README, senza 18 tavole singole. ZIP e preview sono dati non decodificabili: REJECT, prove in `v85-source-audit.json`. Occorrono esportazioni valide per il confronto artistico richiesto.

Audit cumulativo limitato di questa lavorazione: 6 file runtime (2 REUSE, 1 ADAPT, 3 NEW) e 2 fonti remote REJECT; 0 REPLACE, 0 COMMERCIAL_READY. Non sono 442 famiglie completate. I 74 criteri restano 14 PARTIAL / 60 OPEN. COMMERCIAL_RELEASE = BLOCKED.

Ripresa concreta: integrare le cinque armi e le gare nella progressione secondo i loro sblocchi canonici; attualmente sono ancora laboratori. Rook, 17 incontri, nove regioni, le altre due missioni V10.2, asset/audio, localizzazione e durata umana richiedono implementazione/prove, oltre alle dipendenze esterne già elencate. Questo checkpoint conserva tutte le modifiche finora citate ma non conclude il mandato.

## Pubblicazione e censimento successivi

I checkpoint applicativi e l'indice Gold sono pubblicati su `Flexati/Adventure-city`, branch `work/chronos-adventure-commercial`. `docs/gold/README.md` è il punto di ingresso per stato, requisiti, asset, audio, intro, playtest e release.

Il nuovo `tools/audit_media.py` censisce tutti i file media trovati in `game/`: 131 controlli tecnici PASS, inclusi 14 header MIDI; 80 media nel pacchetto Android, zero COMMERCIAL_READY. `FILE_INVENTORY.json` conserva hash e risultati. Il registro asset collega ora tutti i 442 requisiti ai contenuti, con candidati per 9 famiglie; nessuna approvazione automatica di arte, licenze o uso runtime. Il censimento risolve la mancanza di inventario tecnico completo, non l'integrazione di campagna ancora necessaria.

## Asset generato e callback animato

Direzione artistica: il civile SVG statico è stato ritirato in `assets/preproduction/v10.2/`; il callback usa l'atlante `civilian.png` già presente, con animazioni idle/walk, soste alle estremità e percorso continuo. Le due rotte percorrono punti validi del corridoio; riduzione movimento mantiene una posa ferma. È stata realmente generata una borraccia con segni di gesso: master originale in `assets/production/v10.2/`, export mobile RGBA 48×64 in `game/art/v09/chalk_flask.png`, incluso nel pacchetto Android. Nox e Lulù non sono stati ridisegnati.

Coerenza narrativa: la descrizione cita la borraccia visibile. Nox continua a dedurre solo che qualcuno ha riaperto il passaggio; il civile e l'oggetto non attribuiscono conoscenze, danni, premi o poteri nuovi. La regia durante il combattimento e il set completo di gesti restano da riesaminare.

Prove: 148/148 test Node PASS; verifica browser di entrambe le rotte con input reali e salvataggi di prova, atlante e nuovo PNG caricati senza errori. Rapporti e screenshot `chalk-scene-*` nella cartella evidenze V10.2. Il rapporto include hash di asset e sorgenti; la verifica non è una prova umana o Android fisica. La famiglia asset resta PARTIAL, nessun nuovo COMMERCIAL_READY.

## Sprite sheet e musica — iterazione successiva

Direzione artistica: generato uno sprite sheet reale della borraccia, quattro stati distinti, esportato 192×64 e collegato all'avanzamento effettivo dell'attivazione dei due accessi. Il civile usa il frame chiuso; nessuna modifica all'identità dei protagonisti. Master, hash e frame sono nel registro asset. Nel browser entrambe le varianti caricano il nuovo sheet.

Coerenza narrativa: il riempimento è una visualizzazione locale dell'accesso all'acqua, senza introdurre consumabili obbligatori, premi o nuovi poteri. Scelte e cronologia restano conservate. Rimangono aperti regia del civile durante il combattimento, IT/EN e revisione dell'intera campagna.

Audio: Creative Claw ha rifiutato la richiesta prima di generare per zero crediti (circa 20 richiesti, nessun addebito). In alternativa è stata composta e sintetizzata localmente una traccia originale di 40 secondi, con partitura JSON, script riproducibile, master FLAC ed export Ogg. Il browser prova caricamento, playback su gesto, pausa/ripresa e limite di due stream; zero clipping rilevato nella decodifica. Nessun ascolto umano o approvazione commerciale è dichiarato.

Suite aggiornata: 149/149 PASS. Il riferimento «gate 10» dell'autore non ha un ID G10 nel corpus: E10 riguarda Save V9/migrazione/IT-EN, AS10 le prove runtime. E10 resta PARTIAL perché IT/EN e migrazione completa sono aperti; AS10 è parziale per i soli casi effettivamente provati. Nessun gate complessivo è chiuso da questi asset. COMMERCIAL_RELEASE = BLOCKED.
