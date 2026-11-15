Copia dallo scratchpad della sessione del 3–4 novembre 2026; i percorsi /tmp non esistono più su un'altra macchina.
Nella copia il nome della cartella utente dentro i percorsi /tmp è sostituito da «[utente]» (assomigliava a un identificativo di modello per la regola 10); nell'originale è invariato.

# Piano Q1 (Behemoth): D35 e stabilità. Sola lettura, nessun file del repo è cambiato.

Repo /home/locoomo/Adventure-city-commercial, ramo work/chronos-adventure-commercial, HEAD c4ec6f5, worktree pulito (`git status --short` = 0 righe). Log grezzi in /tmp/[utente]/-home-locoomo-Scrivania-building-factory-NEW-STUDIO-GAMES-chronos/18218a94-ec42-51fe-9740-e2043427dc3c/scratchpad/{U0_recon,U1_recon,U1_baseline_tests,A_*}.log.

## 0. Base verificata in questa sessione
- [FATTO] `node --test tests/claude-guide.test.mjs tests/progress-store.test.mjs tests/save-v5.test.mjs`: 14/14 pass (U1_baseline_tests.log).
- [FATTO] android/build/assets/game/app.js = 515 440 byte (`ls -la`, A_bundle.log). Limite 524 288 in tools/prepare_android_assets.py:106.
- NON POSSO CONFERMARE i numeri 279 / 277 / 2: non ho lanciato `npm test` intero (sola lettura, 207 MB liberi su /). Vengono dal contesto dell'orchestratore e da STATO.md (M2). Salamandra li misura in U1 come base.
- [FATTO] Toolchain: javac in /usr/bin, piattaforma ~/Android/Sdk/platforms/android-36 (build_apk.sh:7 vuole android-35, che manca: APK impossibile anche a parte il disco). Chromium in /usr/bin/chromium. /dev/shm 765 MB liberi. CHRONOS montata in /media/omar/CHRONOS (A_env.log).

## 1. U1: D35 e STATO (CORSIA PIENA)
[FATTO] Il test esiste: tests/claude-guide.test.mjs:55-64. Prende il numero D più alto fra le righe `^| Dnn |` di DECISIONI.md e vuole che compaia, come parola intera, prima del secondo titolo `#`/`##` di STATO.md. [FATTO] STATO.md non ha un titolo `#`: la riga 1 è `## M2 — …`, quindi una nuova sezione `## Q1 …` messa in testa diventa la "prima sezione". [FATTO] L'ultima riga della tabella è D34 (DECISIONI.md:40); dopo c'è una riga vuota (41) e poi il paragrafo «Le tre scelte condizionali…» (42).

FILE: docs/gold/DECISIONI.md, cioè una riga nuova dopo la 40 (D34), prima della riga vuota 41. Testo esatto, su una sola riga:

| D35 | Carta bianca sulla qualità: cosa Claude decide da solo e priorità di qualità in ordine | Parole dell'autore (gli a capo dell'originale sono resi con « / »): «CARTA BIANCA: COSA PUOI DECIDERE DA SOLO / - Priorità del backlog di qualità (cosa migliorare prima e perché). / - Dettagli di feel: tempi di hit-stop, curve di easing, screen shake, dimensioni delle aree touch, soglie di input, mix audio. / - Refactoring interni che riducono il rischio di bug, senza cambiare comportamento. / - Test aggiuntivi, strumenti di diagnostica e metriche interne. / - Scelta tra due soluzioni tecniche equivalenti, purché documentata. / - Tagli di scope che rendono il prodotto più solido (es. rimandare un distretto a Chrono Shadows). / PRIORITÀ DI QUALITÀ (in ordine) / 1. Stabilità: nessun crash, salvataggio affidabile, ripresa dal background. / 2. Leggibilità: minacce, telegraph e stato di Nox e Lulù riconoscibili senza audio. / 3. Feel del combattimento: input reattivo, schivata e Chrono Shift nette. / 4. Prestazioni: frame rate stabile su fascia media, memoria sotto controllo. / 5. Finitura: coerenza visiva e audio, transizioni, dettagli di UI. / 6. Contenuto: nuovi distretti e boss, solo dopo i punti 1–5. / REGOLE DI OUTPUT / - Numeri concreti (ms, frame, px, MB) al posto degli aggettivi. / - Distingui [FATTO] verificato da comando da [IPOTESI] non ancora testata. / - Non dichiarare nulla "completo" senza evidenza.» Poi l'autore: «Si parti 1,2,3 in ordine». **Vale:** Claude decide da solo le sei voci della carta bianca e lavora nell'ordine delle priorità; ogni scelta presa così si scrive con la fonte e con i numeri prima e dopo. **[INFERITO] Lettura di Claude, da confermare:** hitbox e finestre di combattimento (schivata, parata) restano sotto la regola 4 di CLAUDE.md e cambiano solo con D27, D29 o un via esplicito dell'autore; i dettagli di feel elencati sopra si decidono e si documentano con i numeri. **[INFERITO] Scelta operativa, non dell'autore:** la milestone Q1 copre questa riga e la priorità 1, la stabilità (crash, salvataggio, ripresa dal background); leggibilità e feel sono Q2, da pianificare dopo Q1. **Non cambia:** CLAUDE.md e D01–D34, `COMMERCIAL_RELEASE = BLOCKED`, regola 2 (store e Play Console), chiavi fuori dal repo. |

FILE: docs/gold/STATO.md, cioè un blocco nuovo prima della riga 1 attuale (`## M2 — …`), seguito da una riga vuota. Testo esatto:

## Q1 — Carta bianca sulla qualità e stabilità (3 novembre 2026)

- **D35.** L'autore dà carta bianca sulla qualità e fissa le priorità in ordine: stabilità, leggibilità, feel del combattimento, prestazioni, finitura, contenuto. Claude decide da solo l'ordine del backlog, i dettagli di feel, i refactoring interni senza cambi di comportamento, test e diagnostica, la scelta documentata tra due soluzioni equivalenti e i tagli di scope che rendono il prodotto più solido. Le parole dell'autore sono in [DECISIONI.md](DECISIONI.md).
  - **[INFERITO]** Hitbox e finestre di combattimento (schivata, parata) restano sotto la regola 4 di CLAUDE.md.
- **Q1, in corso:** priorità 1, la stabilità: crash, salvataggio, ripresa dal background. I numeri misurati entrano in questa sezione a fine milestone.
- **Q2, dopo Q1:** leggibilità e feel del combattimento (priorità 2 e 3), da pianificare.
- **Punti aperti per l'autore:**
  - la lettura di D35 su hitbox e finestre di combattimento;
  - **[INFERITO]** i valori già fissati da una decisione (memoria dei tocchi di 100 ms in D27, durata e ricarica del Chrono Shift in D29) cambiano solo con una nuova riga in DECISIONI.md, anche se sono «soglie di input» o «feel»;
  - i punti aperti di M2, nella sezione qui sotto.
- Il codice del gioco non cambia in questo passo. `npm test`: 279 test, 277 passano su questo PC; i 2 che falliscono sono quelli di `python3 -I` con numpy, come in M2. `app.js` 515 440 byte su 524 288.
- M1 resta a fine lavoro (D33). 0 sessioni umane ([PLAYTEST.md](PLAYTEST.md)). `COMMERCIAL_RELEASE = BLOCKED`.

(Se `npm test` dà numeri diversi da 279 e 277, Salamandra scrive i numeri misurati e lo segnala: niente numeri presi dal piano.)

TEST NUOVI: nessuno. Vale come prova "prima fallisce, poi passa" del test già presente:
 (a) con la sola riga D35, `node --test tests/claude-guide.test.mjs` → atteso 4 pass, 1 fail («the first section of STATO.md cites the latest decision…», messaggio «does not cite D35»);
 (b) con anche la sezione di STATO → 5/5 pass.
VALIDATION REQUIRED: (a) e (b) nel log U1; `VERIFICA_LOG=$SCR/U1_npm_test.log bash ~/.claude/skills/pantheon-chronos/verifica.sh /home/locoomo/Adventure-city-commercial c4ec6f5 279` → 279 test, 277 pass, 2 fail (gli stessi 2 di ambiente), 2 file cambiati (DECISIONI.md, STATO.md), nessun identificativo di modello nelle righe aggiunte; `git diff --stat` = 2 file, solo righe aggiunte (+1 in DECISIONI, +13 in STATO, compresa la riga vuota prima di «## M2»). app.js: 0 byte (nessun .mjs toccato).
GATE: nessuno (documenti; testo dell'autore citato senza cambiarne le parole, a parte gli a capo resi con « / »).

## 2. Audit di stabilità (sola lettura)
Gravità: ALTA = gioco bloccato o perso senza via d'uscita; MEDIA = perdita di avanzamento o stato sbagliato recuperabile; BASSA = fastidio.

### 2.1 Crash
R1. [FATTO] Il ciclo dei frame muore alla prima eccezione. In game/runtime.mjs:984-998 `frame()` non ha try/catch e richiama `requestAnimationFrame(frame)` solo come ultima istruzione (riga 998). Un'eccezione in tick/render/eventFx/pollGamepad salta quella riga, quindi non ci sono più frame: schermo fermo, input morto, niente pannello. Il primo `requestAnimationFrame(frame)` è alla riga 999. ALTA.
  Misura: in Chromium, missione a piedi, si inietta un solo throw (per esempio `CanvasRenderingContext2D.prototype.fillRect` che lancia una volta) e si contano i nuovi `id` in `cityAdventure.performance()` nei 1 000 ms dopo. [IPOTESI] Prima della correzione 0 frame; dopo, almeno 30 (Chromium headless a circa 60 Hz).
R2. [FATTO] Non c'è un gestore di errori dopo l'avvio. In game/runtime.mjs non c'è `onerror`, né un listener `error` o `unhandledrejection` (ricerca su runtime.mjs; A_lifecycle_grep.log). Nel browser un errore a partita avviata non dà nessuna interfaccia. ALTA (insieme a R1).
R3. [FATTO] Su Android un errore qualsiasi dopo l'avvio mostra la schermata di avvio fallito. game/android_bootstrap.js:20-24 registra il listener `error` e non lo toglie mai: la riga 37 cancella solo interval e timeout. Ogni errore con `event.message` chiama `problem('Errore di avvio: …')` e apre un overlay a tutto schermo, «Il gioco non è riuscito a partire», anche a partita in corso e anche per errori non fatali (per esempio in un onclick). Riprova = reload, quindi si riparte dal checkpoint. ALTA su Android: un errore recuperabile diventa uno stop, con un messaggio falso.
  Misura: sul bundle Android in Chromium (http://127.0.0.1:8090/android/build/assets/game/), dopo `loaded`, `setTimeout(()=>{throw new Error('probe')})` → conteggio di `#startup-recovery`: [IPOTESI] prima 1, dopo 0.
R4. [FATTO] I promise rifiutati a partita avviata bloccano il flusso in silenzio. `loadImage` rifiuta su `onerror` (runtime.mjs:33). Sono senza try: openHub (runtime.mjs:256), apertura (478), crollo (484), postcredits (564), Tessa (208). Il bootstrap ignora `unhandledrejection` quando `window.cityAdventure` esiste (android_bootstrap.js:25-27). [IPOTESI] Effetto: `mode` resta 'loading', schermo nero, nessun pulsante. MEDIA-ALTA: gli asset sono locali, quindi la probabilità è bassa, ma l'esito è un blocco.
  Misura: route abort su un'immagine che carica solo l'hub o l'apertura → dopo 5 000 ms si leggono `mode` e il numero di pulsanti visibili. Prima: 'loading' e 0 [IPOTESI]. Dopo: pannello di recupero entro 500 ms.
R5. [FATTO] Un asset di missione mancante porta a un vicolo cieco. startFoot (runtime.mjs:165) e startDrive (runtime.mjs:544) catturano l'errore, mostrano `notice(...)` e fanno `return`. A quel punto `mode` è ancora 'card' (impostato a runtime.mjs:139; 'foot' arriva solo a 170, 'drive' a 545) e `running` è false, quindi canPause() è falso (runtime.mjs:648). [IPOTESI] Restano solo la notifica per circa 1,4 s e uno schermo senza azioni. MEDIA. (startHubRace, runtime.mjs:300, invece torna all'hub con `running=true`: lì c'è già un ripiego.)
R6. [FATTO] Il crash del renderer è gestito. MainActivity.java:92-99 (onRenderProcessGone → showFailure con Riprova, che ricrea la WebView, :132). [IPOTESI] Si perdono al massimo 10 s di `stats.seconds` (R10). Si misura solo sul telefono o sull'emulatore: tools/verify_android_recovery.mjs → NON POSSO CONFERMARE, M1.

### 2.2 Salvataggio
R7. [FATTO] Lo store è robusto: game/progress-store.mjs.
  - Due chiavi, primaria e `.backup` (:8). Ogni setItem è atomico (commento :39).
  - Checksum FNV-1a 32 bit (:2-6, :15).
  - Andata e ritorno di deserialize prima di scrivere (:22).
  - Quota piena o storage negato: catch → `{ok:false}` (:45) e notifica (runtime.mjs:58).
  - Primaria troncata o con checksum sbagliato → recupero dalla backup (:31-32).
  - Due slot rotti → 'corrupt', senza migrare in silenzio i salvataggi legacy (:33).
  - storage che lancia → 'unavailable' (:34).
  Coperto da 6 test (tests/progress-store.test.mjs:13-46) e da `qa:save`, 6 controlli (tools/verify_save_recovery.cjs:22-45). Nessuna unità nuova.
R8. [FATTO] Misure in Node (Map al posto di localStorage, Celeron N3060, A_size.log e A_cost.log):
  - salvataggio nuovo: 499 caratteri per slot, cioè circa 1 KB UTF-16 per slot e circa 2 KB in tutto;
  - write: 0,38-0,44 ms;
  - loadProgress: 0,040 ms;
  - con 500 flag sintetici: 6 392 caratteri e 12,9 ms per write.
  [IPOTESI] I salvataggi reali hanno molti meno flag; il costo vero di localStorage nella WebView non è misurato. Si misura nel browser in U2 (M-S1); sul telefono è M1.
R9. [FATTO] Le impostazioni non sono validate per tipo: `settings={...settings,...JSON.parse(...)}` (runtime.mjs:51). Un JSON valido ma strano (`null`, `[1]`, `"x"`) non manda in crash, perché lo spread di null o di una stringa non lancia, e la lingua è normalizzata a :52. BASSA, senza unità.
R10. [FATTO] Con la partita attiva si salva ogni 10 s di tempo attivo (`acc>10`, runtime.mjs:991), più a ogni pausa (setPause, :649), a ogni sospensione (suspend, :655) e a ogni tappa (:138). Nella missione il salvataggio torna all'inizio o al boss per scelta di progetto (testo in game/index.html:19). [FATTO] Se la quota è piena, `notice` si ripete ogni 10 s (runtime.mjs:58 chiamato da :991). BASSA, senza unità: è un promemoria voluto o accettabile.

### 2.3 Ripresa dal background
R11. [FATTO] Gli eventi coperti:
  - blur → suspend; focus → restoreForeground; pagehide → suspend (runtime.mjs:657);
  - citynativepause e citynativeresume (:658);
  - visibilitychange (:659).
  suspend (:655) svuota i controlli, imposta lifecycleMuted, salva, mette in pausa se canPause() e silenzia l'audio. restoreForeground (:656) riprende l'audio solo se non c'è pausa e la pagina è visibile. Coperto in parte da qa:runtime (verify_runtime_v09.cjs:8-10), qa:hubs (verify_hubs_v8.cjs:18-19), qa:controls (blur, verify_controls_v9.cjs:34) e qa:save (:16). Manca un controllo su `visibilitychange` vero (document.hidden) con la misura del tempo simulato: test di guardia in U2.
R12. [FATTO] Un dt enorme al ritorno non arriva alla simulazione:
  - rawDt è limitato a 0,05 s, cioè 3 frame (runtime.mjs:984);
  - di nuovo dentro tick (campaign.mjs:295), traversal (traversal.mjs:5), driveTick (driving.mjs:17) e gara (racing-v9.mjs:89);
  - la simulazione si ferma con `document.hidden` (runtime.mjs:986).
  Le modalità giocabili vanno in pausa da sole (canPause, :648). Nessuna unità: solo il test di guardia (passa già prima).
R13. [FATTO] L'audio: pause() ferma le voci, mette in pausa i media e chiama `context.suspend()` (audio-engine.mjs:33). resume → unlock → `context.resume()` con try (:30, :34). Se `media.play()` viene rifiutato, la traccia si scarta (:51) e si ricrea al prossimo unlock (pointerdown, runtime.mjs:1001). [IPOTESI] Su Android, con `setMediaPlaybackRequiresUserGesture(true)` (MainActivity.java:66), la musica può restare muta fino al primo tocco dopo il ritorno → NON POSSO CONFERMARE, M1.
R14. [FATTO] L'ordine nativo: onPause manda `citynativepause` con evaluateJavascript (asincrono) e subito dopo chiama `web.onPause(); web.pauseTimers()` (MainActivity.java:142-145). [IPOTESI] Lo script può girare dopo la pausa dei timer. Il salvataggio di suspend ha comunque anche blur e visibilitychange come strade alternative. NON POSSO CONFERMARE senza il telefono, M1: si misura con `adb shell am kill` dopo HOME e si confronta `stats.seconds` (tools/verify_android_recovery.mjs).
R15. [FATTO] configChanges = `orientation|screenSize|keyboardHidden|uiMode` (AndroidManifest.xml:5). Mancano screenLayout, smallestScreenSize, density, fontScale e locale. [INFERITO] dal comportamento documentato di Android: cambiare finestra multipla o pieghevole, densità, carattere o lingua di sistema mentre il gioco è in background ricrea l'Activity e la WebView. Al ritorno il gioco è al menù e si perde l'avanzamento dentro la missione (il salvataggio resta). MEDIA. La prova vera è M1.
R16. [FATTO] La finestra di uscita col tasto Indietro non ha cancel listener (MainActivity.java:151-157). Se la si chiude toccando fuori o con Indietro, `citynativeresume` non arriva mai, quindi lifecycleMuted resta true. [IPOTESI] Si risolve da solo con l'evento focus quando la finestra si chiude; in pausa «Riprendi» riattiva comunque l'audio (setPause(false) ignora lifecycleMuted, runtime.mjs:649). BASSA, M1.
R17. [FATTO] Il pulsante «tieni premuto» si completa al ritorno. holdButton (runtime.mjs:109-113) misura `(t-start)/ms` con il tempo reale e suspend non lo annulla (:655 chiama clearControls, che non tocca hold). Se il dito resta giù durante un blur senza pointercancel, al primo frame dopo il ritorno k≥1 e la scelta si conferma da sola. BASSA. Misura: pointerdown su #hold-button, poi blur, poi 1 400 ms → si guarda se il pannello hold è ancora visibile. [IPOTESI] Prima: si chiude (confermato).

### 2.4 Altro
R18. [FATTO] D25 («nessun contatore dentro l'app»): un contatore di errori solo in memoria, esposto da `cityAdventure.status()` come `frameSamples`, non persiste e non esce dal dispositivo. [INFERITO] È compatibile con D25 e con «strumenti di diagnostica e metriche interne» di D35.
R19. [FATTO] I QA scrivono rapporti nel repo per default:
  - qa:runtime → runtime-v09.json;
  - qa:hubs → hubs-v8.json;
  - qa:save → save-recovery.json;
  - qa:audio → audio-v09.json;
  - qa:controls → artifacts/;
  - qa:campaign → campaign-v8/;
  - qa:gamepad → docs/evidence/v10.3/gamepad, che è TRACCIATO.
  Si lanciano con `node tools/<file> http://127.0.0.1:8090/game/ $SCR/<rapporto>`, non con `npm run`, per non sporcare il worktree. L'eccezione è un rapporto che si vuole registrare apposta.

## 3. Unità atomiche (in ordine di rischio)
Regola per tutte: prima si scrive il test o il controllo, lo si lancia sul codice invariato e si registra il FAIL, poi la correzione, poi il PASS. Nessun cambio di hitbox, finestre o tempi di combattimento. Base dei conteggi: 279 / 277 / 2 (da confermare in U1). Il budget di app.js parte da 515 440 byte, con 8 848 di margine.

### U2: il ciclo dei frame sopravvive agli errori e c'è un pannello di recupero (R1, R2, R4)
FILE:
- game/stability.mjs (nuovo);
- game/runtime.mjs: import; `frame()` alle righe 984-998; status() alla riga 1008; listener `error` e `unhandledrejection`; gestore del pannello;
- game/index.html: pannello `#fault-panel`;
- game/locale.mjs: EN_TEXT per i 3 testi nuovi;
- tools/prepare_android_assets.py: `stability=flatten_module('stability.mjs')`, inserito nella join della riga 99 prima di `ui`;
- tests/stability.test.mjs (nuovo);
- tests/android-bundle.test.mjs: aggiungere 'createFaultMonitor' alla lista dei nomi, riga 11;
- tests/bundle-globals.test.mjs: aggiungere 'stability.mjs' a MODULES, riga 6;
- tools/verify_stability.cjs (nuovo);
- package.json: script `"qa:stability": "node tools/verify_stability.cjs"`.
CHANGE:
 - stability.mjs esporta due funzioni pure:
   - `createFaultMonitor({limit=3,windowMs=5000,now})`, con `record(error,source)` che restituisce 'continue' o 'recover' e `status()` che restituisce `{total,recent,last:{source,message≤160 caratteri}}`;
   - `guardedFrame(step,schedule,onFault)`, che richiama `schedule` PRIMA di `step` e passa le eccezioni a onFault.
   [FATTO] Nessuna collisione di nomi oggi: grep di createFaultMonitor e guardedFrame in game/*.mjs vuoto.
 - In runtime.mjs il corpo di frame non cambia, ma va dentro `guardedFrame`. Così il prossimo frame è già chiesto quando il corpo lancia; l'ordine e i tempi di un frame normale restano uguali: 1 sola richiesta rAF per frame.
 - Una sola chiamata `fault(e,source)` riceve:
   - un errore del frame;
   - `window` 'error' (errori nei gestori);
   - 'unhandledrejection': per i promise si recupera subito (limit 1), perché vuol dire che un flusso è già morto.
 - Su 'recover': `running=false`, si svuotano i controlli, si ferma l'audio e si mostra `#fault-panel` («Qualcosa si è inceppato. Il salvataggio è al sicuro.» e il pulsante «Riprendi dall'ultimo salvataggio», che fa `location.reload()`).
 - In caso di fault NON si chiama persist(): scelta documentata fra due soluzioni equivalenti (D35), per non scrivere uno stato forse incoerente. Si perdono al massimo 10 s di `stats.seconds` (R10).
 - `console.error` dell'errore e `faults: monitor.status()` in `cityAdventure.status()`, solo in memoria (R18).
 - Il pannello nasce `hidden`, usa le classi esistenti `modal`/`card` e il pulsante `primary`; serve l'altezza minima di 48 px del CSS esistente (tests/mobile-ui-contract.test.mjs:9).
TEST NUOVI:
 - tests/stability.test.mjs, 4 test:
   1. guardedFrame richiama schedule anche quando step lancia;
   2. 2 fault in 5 s danno 'continue', il 3° dà 'recover';
   3. fault distanziati più di 5 s (orologio finto) restano 'continue';
   4. il messaggio si tronca a 160 caratteri e `total` conta tutto.
   Prima: FAIL (il modulo non esiste). Dopo: 4/4.
 - tools/verify_stability.cjs, controlli nel browser con il seed `qa_v8.seed(p,url,'below')`:
   - S1, un throw singolo in fillRect: frame nuovi in 1 000 ms. Prima 0 (FAIL); dopo almeno 30, mode 'foot', pannello nascosto, faults.total = 1.
   - S2, throw continuo: ms dal primo fault al pannello visibile. Prima: il pannello non esiste (FAIL); dopo al massimo 250 ms. Il click ricarica, poi si controllano menù, `#continue` visibile, saveSource 'primary' e stepId uguale a prima.
   - S3, route abort di un'immagine che carica solo l'hub (Salamandra sceglie un nome reale da prepareDistrict/HUBS e lo scrive nel log) e ingresso nell'hub: ms al pannello. Prima: dopo 5 000 ms mode 'loading' e 0 pulsanti visibili (FAIL); dopo al massimo 500 ms.
   - S4, guardia per R11 e R12, passa già prima: document.hidden=true più visibilitychange in missione; per 3 000 ms Δ`snapshot().time` = 0, paused true, lifecycleMuted true, `audio.context` 'suspended'. Poi visibile, click su #resume, e il primo frame ha Δtime ≤ 0,05 s.
   - M-S1, solo misura: in pagina, con `import('/game/progress-store.mjs')` e `'/game/missions.mjs'`, 200 write su una chiave di prova 'qa-stability-probe' (poi rimossa) → ms medio e massimo con localStorage vero.
   - Errori di pagina attesi: solo quelli iniettati; nessuna richiesta esterna. Rapporto in un percorso passato come argomento.
VALIDATION REQUIRED:
 - log FAIL prima e PASS dopo per S1, S2 e S3;
 - `node --test tests/stability.test.mjs` 4/4;
 - verifica.sh con 283 attesi: 283 test, 281 pass, 2 fail (gli stessi di ambiente);
 - app.js ≤ 524 288 con il numero misurato;
 - `node tools/verify_stability.cjs http://127.0.0.1:8090/game/ $SCR/U2_stability.json` → S1-S4 PASS e M-S1 con i numeri;
 - nessuna regressione: qa:save (6 controlli), qa:runtime, qa:hubs, qa:controls (11), qa:gamepad (9), qa:audio, qa:performance (si confrontano i ms per frame con un giro di base fatto PRIMA della modifica).
Stima su app.js: da +1 100 a +1 400 byte (stability.mjs appiattito 450-600, runtime 350-500, EN_TEXT 150-250) → circa 516 540-516 840. index.html +300-400 byte (limite 65 536, oggi 12 580).
GATE: nessuno di quelli di ruolo. La soglia (3 fault in 5 s; i promise subito) è un numero di diagnostica, non un tempo di gioco [INFERITO]. Va comunque scritta in STATO in U8.

### U3: il bootstrap Android non scambia più un errore in partita per un avvio fallito (R3)
Dipende da U2: senza U2 un errore dopo l'avvio diventerebbe invisibile su Android.
FILE: game/android_bootstrap.js (righe 20-24); tests/android-bootstrap.test.mjs (nuovo); tools/verify_stability.cjs (controllo S5).
CHANGE: nel listener 'error', dopo l'avvio non si chiama problem(). La condizione è `window.cityAdventure && window.cityAdventure.status().loaded`, dentro un try in ES5 (niente arrow, niente const), e restano invariati il caso SCRIPT e il timeout di 20 s. unhandledrejection non cambia (è già limitato all'avvio, :25-27).
TEST NUOVI:
 - tests/android-bootstrap.test.mjs, 2 test con node:vm e un `window`/`document` finti:
   1. un errore prima di `loaded` crea #startup-recovery (passa già prima: guardia);
   2. un errore dopo `loaded` non crea nulla. Prima FAIL, dopo PASS.
 - S5 in verify_stability, sul bundle Android http://127.0.0.1:8090/android/build/assets/game/ (generato da npm test): un throw dopo loaded → `#startup-recovery` conta 0 e `faults.total` 1. Prima 1 (FAIL).
VALIDATION REQUIRED: 285 test, 283 pass, 2 fail; `node tools/verify_startup_retry.cjs http://127.0.0.1:8090/android/build/assets/game/ $SCR/U3_startup_retry.json` PASS (un avvio fallito si vede ancora); S5 PASS. app.js: 0 byte (bootstrap.js è un file a parte, prepare_android_assets.py:101).
GATE: nessuno. NON POSSO CONFERMARE nella WebView vera → M1 (verify_android_renderer.mjs e verify_android_recovery.mjs vogliono adb).

### U4: un asset mancante all'inizio di una missione apre il recupero invece di un vicolo cieco (R5)
FILE: game/runtime.mjs:165 (catch di startFoot) e :544 (catch di startDrive); tools/verify_stability.cjs (S6).
CHANGE: nei due catch la notifica resta e il `return` silenzioso diventa `fault(e,'asset')` con recupero immediato, cioè il pannello di U2. startHubRace (:300) non cambia, perché ha già un ripiego giocabile.
TEST NUOVI: S6, route abort di un'immagine caricata solo da startFoot per 'below' (per esempio 'chalk_route_art', runtime.mjs:164) → dopo 5 000 ms. Prima: mode 'card', running false, 0 pulsanti utilizzabili (FAIL). Dopo: pannello entro 500 ms e reload che riporta al menù con #continue.
VALIDATION REQUIRED: 285 / 283 / 2 (nessun test npm nuovo); S1-S6 PASS; qa:save e qa:campaign senza regressioni. Stima su app.js: da +40 a +100 byte.
GATE: nessuno.

### U5: Android, niente ricreazione dell'Activity per i cambi di finestra o di sistema (R15)
FILE: android/AndroidManifest.xml:5; tests/mobile-ui-contract.test.mjs (1 test nuovo).
CHANGE: `android:configChanges="orientation|screenSize|screenLayout|smallestScreenSize|density|fontScale|locale|layoutDirection|keyboardHidden|uiMode"`. Niente codice Java. render() rilegge innerWidth e devicePixelRatio a ogni frame (runtime.mjs:982), quindi la WebView si adatta da sola [INFERITO].
TEST NUOVI: un test che legge il manifest e vuole screenLayout, smallestScreenSize, density, fontScale e locale. Prima FAIL, dopo PASS.
VALIDATION REQUIRED: 286 / 284 / 2. Facoltativo, controllo del manifest in /dev/shm: `aapt2 link` con `-I ~/Android/Sdk/platforms/android-36/android.jar` senza asset, poi si cancella. app.js: 0 byte.
GATE: non è uno dei gate di ruolo (firma, versionCode, applicationId, billing e store restano invariati). NON POSSO CONFERMARE l'effetto: finestra multipla, cambio di carattere e di lingua sul telefono → M1.

### U6: «tieni premuto» si annulla quando il gioco va in background (R17)
FILE: game/runtime.mjs:109-113 (holdButton) e :655 (suspend); tools/verify_stability.cjs (S7).
CHANGE: holdButton registra il proprio `up` come annullamento attivo, che suspend() chiama. La durata di 1 200 ms non cambia.
TEST NUOVI: S7, pointerdown su #hold-button, blur, 1 400 ms → il pannello 'hold' è ancora visibile e il riempimento è a 0. Prima FAIL (la scelta si conferma), dopo PASS. Serve un seed che arrivi a un holdButton: Salamandra cerca il chiamante (grep `holdButton(`) e lo scrive nel log; se non esiste un seed raggiungibile, si FERMA e lo segnala.
VALIDATION REQUIRED: 286 / 284 / 2; S1-S7 PASS; qa:controls 11/11. Stima su app.js: da +60 a +120 byte.
GATE: nessuno (non tocca hitbox né tempi).

### U7: Android, la finestra del tasto Indietro chiusa senza scegliere riprende il gioco (R16)
FILE: android/src/com/cityadventure/pizzaprotocol/debug/MainActivity.java:153-156; tests/mobile-ui-contract.test.mjs (1 test nuovo).
CHANGE: `.setOnCancelListener(dialog -> resumeGame())` sul builder.
TEST NUOVI: un test statico che vuole `setOnCancelListener` con resumeGame in MainActivity.java. Prima FAIL, dopo PASS.
VALIDATION REQUIRED: 287 / 285 / 2; compilazione in /dev/shm: `javac --source 8 --target 8 -encoding UTF-8 -classpath ~/Android/Sdk/platforms/android-36/android.jar -d /dev/shm/chronos-javac android/src/com/cityadventure/pizzaprotocol/debug/*.java` → exit 0, poi si cancella. app.js: 0 byte.
GATE: nessuno. NON POSSO CONFERMARE l'effetto sul telefono → M1.

### U8: documenti con i numeri misurati
FILE: docs/gold/STATO.md (la sezione Q1 di U1 si aggiorna e resta la prima; continua a citare D35, e non c'è un D36 se l'autore non decide nulla di nuovo); docs/gold/PLAYTEST.md (nuova sezione «Q1 — stabilità, QA automatica», 0 sessioni umane).
CHANGE: per ogni unità, i numeri misurati e la fonte (rapporto JSON o log):
 - frame dopo un fault (S1);
 - ms al pannello (S2, S3, S6);
 - Δtime in background e al ritorno (S4);
 - ms per write con localStorage vero (M-S1) e dimensione del salvataggio (R8);
 - conteggi di npm test;
 - byte di app.js prima e dopo;
 - soglia 3 in 5 s e la scelta «niente persist in caso di fault» (D35, scelta documentata).
 L'elenco M1 aggiunto (R6, R13, R14, R15, R16, U3 e U5 sul telefono) va in PLAYTEST.md. Le prove si copiano in docs/evidence/q1/ solo se si decide di tenerle nel repo (rapporti JSON piccoli; niente screenshot pesanti con 207 MB liberi).
TEST NUOVI: nessuno; claude-guide resta 5/5.
VALIDATION REQUIRED: 287 / 285 / 2 con verifica.sh; ogni numero scritto ha un riferimento a un log o a un rapporto di questa milestone.
GATE: fine milestone, cioè commit sul ramo, riepilogo e STOP per il feedback dell'autore (CLAUDE.md, «Si lavora a milestone»).

## 4. Controlli nel browser
Per tutti: server acceso `python3 -m http.server 8090 --bind 127.0.0.1` dalla radice del repo; `TMPDIR=/dev/shm/chronos-qa XDG_CACHE_HOME=/dev/shm/chronos-qa/cache XDG_CONFIG_HOME=/dev/shm/chronos-qa/config CHROMIUM=/usr/bin/chromium`. Rapporti nello scratchpad con l'argomento di uscita (R19).
- Base PRIMA di U2, per i confronti: qa:performance, qa:runtime, qa:save.
- Dopo U2, U4 e U6: `node tools/verify_stability.cjs` (qa:stability), qa:save (verify_save_recovery.cjs), qa:runtime, qa:hubs, qa:controls, qa:gamepad (pollGamepad gira dentro frame), qa:audio, qa:performance.
- Dopo U3: verify_stability S5 e `node tools/verify_startup_retry.cjs http://127.0.0.1:8090/android/build/assets/game/ <out>` (non c'è uno script npm).
- Chiusura (U8): tutti quelli sopra, più qa:campaign (giro A/B/C completo), qa:health e qa:v9. Nessuno si salta (D34).
- Solo M1, con il telefono o adb (NON POSSO CONFERMARE qui): tools/verify_android_recovery.mjs, tools/verify_android_renderer.mjs, finestra multipla e cambio di carattere (U5), finestra Indietro chiusa toccando fuori (U7), musica dopo il ritorno (R13), ordine onPause e kill del processo (R14).

## 5. Gate per Posky
- PIANO: è un lavoro non banale. «Si parti 1,2,3 in ordine» e D35 coprono U1 e la stabilità [INFERITO]. L'orchestratore decide se basta come via libera per U2-U7 o se li presenta prima a Posky.
- Due scelte prese con la carta bianca, da far vedere all'autore allo stop: niente persist in caso di fault (si ricarica dall'ultimo salvataggio valido) e la soglia di 3 fault in 5 s.
- U5 e U7 cambiano il guscio Android senza poterli provare sul telefono: si consegnano marcati come «da provare in M1», non come fatti.
