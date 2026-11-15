Copia dallo scratchpad della sessione del 3–4 novembre 2026; i percorsi /tmp non esistono più su un'altra macchina.

# ADDENDUM AL PIANO M2 — U3-bis (Behemoth a8ac71eb3bf5ec588, dopo il FAIL di Leviathan a2604252659814e6e)

Nessun gate: non cambiano tempi, finestre o hitbox; si ripristina il comportamento di prima di U3 per le interruzioni.

Verificato da Behemoth in sola lettura sul worktree di U3:
- buffer nello stato della missione: game/campaign.mjs:291-305 (INPUT_BUFFER=.1, decremento 293, impostazione 294, uso 298 e 305)
- clearControls() non li tocca: game/runtime.mjs:666
- ogni interruzione passa da clearControls(): lock() 96, setPause 649, suspend 655 (blur, pagehide, visibilitychange: 657, 659), 460, leaveStrangers 466, relayRecognition 469, finalConsentScene 470-475, clinicEvent 709

Decisioni:
(a) Il buffer si svuota in un solo aiuto della simulazione in campaign.mjs, chiamato da clearControls(). Scartata la scrittura diretta dei campi nel runtime.
(b) La pausa svuota il buffer. Compatibile con P1:161 (orologio = tempo di gioco), P1:162 («Dopo 100 ms si scarta»), P1:170-171 («non un'intenzione vecchia»). Prima di U3 ogni interruzione cancellava i comandi in attesa (ISTRUZIONI:274: «il resto» resta identico).

### U3-bis — Svuotare il buffer di N1 a ogni interruzione
CORSIA: PIENA

FILE: game/campaign.mjs, game/runtime.mjs, tests/input-buffer.test.mjs

CHANGE (da dichiarare prima di modificare):
1. game/campaign.mjs, accanto a INPUT_BUFFER (riga 291): nuova funzione esportata `clearInputBuffer(s)`.
   - Porta a 0 dashBuf, gunBuf, magicBuf, e a null gunAim e magicAim.
   - Tocca SOLO i campi che esistono già sull'oggetto (non aggiunge campi allo stato di hub/esplorazione, che passano anche loro da clearControls).
   - Non cambia nient'altro: niente timer, cooldown, action.
2. game/runtime.mjs:
   - aggiungere clearInputBuffer all'import da ./campaign.mjs;
   - in clearControls() (riga 666) aggiungere `if(state)clearInputBuffer(state);`.
   - NON toccare finalConsentScene (470-475), setPause, suspend, lock.
3. Riga per piano-M2.md sotto U3: «Un'interruzione (pausa, sospensione, dialogo, scena, lock) svuota il buffer di N1 tramite clearInputBuffer, chiamato da clearControls. È il comportamento di prima di U3: P1:162 e P1:170-171.» (la aggiunge l'orchestratore, non Salamandra: piano-M2.md è nella scratchpad)

Nomi: clearInputBuffer non esiste in game/; tests/bundle-globals.test.mjs lo controlla comunque.
Byte: circa 170 in app.js (tetto 300).

TEST NUOVI (+3) in tests/input-buffer.test.mjs:
1. clearInputBuffer scarta i tocchi in attesa: buffer di uno scatto in ricarica (dashCd=.05) e di uno SPARA durante un'azione; chiamare l'aiuto; tick senza input per 0,2 s. Atteso: nessun evento dash, nessuna azione nuova, munizioni invariate. Poi clearInputBuffer({}) deve lasciare {} (nessun campo creato).
2. Il colpo finale resta del giocatore: missione del finale con consenso attivo, Archon a cui basta un colpo per arrivare a 1 HP. Tick con SPARA mentre è in corso un'azione: gunBuf>0, poi evento finalConsent. Ripetere i passi di runtime.mjs:473: clearInputBuffer(s), s.finalConsent=true, boss in recover con guard=0, s.fireCd=0, s.action=null. Tick senza input per 0,3 s. Atteso: Archon a 1 HP, status==='playing', nessun startAttack. Un tick successivo con gun:true lo sconfigge. Il test dichiara in un commento che ricalca la sequenza della scena.
3. Verifica sul sorgente del runtime: la riga che inizia con `function clearControls(){` contiene `clearInputBuffer(state)` (cercare nella riga intera, non con `[^}]*` che si fermerebbe a `stick={x:0,y:0,id:null}`). lock, setPause, suspend e finalConsentScene chiamano ancora clearControls(); per finalConsentScene prima di `await say(`.

VALIDATION REQUIRED:
- `VERIFICA_LOG=$SCR/U3bis_npm_test.log bash ~/.claude/skills/pantheon-chronos/verifica.sh /home/locoomo/Adventure-city-commercial dec65e3 260 | tee $SCR/U3bis_verifica.log`
- Attesi `# tests 263`. `grep -E '^not ok'` solo i 3 nomi di base: «every repo path named in CLAUDE.md and in the §2 prompts exists», «race props round trip: masks filled pass, a short container footprint fails», «GPT chroma key keeps green-tinted paint and removes the off-green GPT background».
- Rifare le due prove di Leviathan: L_U3/finale2.out (tocco durante il colpo che fa scattare il consenso: Archon resta a 1 HP dopo la scena) e L_U3/sem.out (scatto premuto in ricarica e poi pausa: dopo la ripresa dashBuf vale 0 e lo scatto non parte).
- qa:controls e qa:gamepad come in U0, output in $SCR/U3bis/. Il controllo blur-clears-all-input deve restare PASS.
- `stat -c %s .../android/build/assets/game/app.js`: delta rispetto a U3 (514013) al massimo 300 byte.

Conseguenze sul piano: ogni totale atteso dopo U3 sale di 3 — U4 263→264, U5 264→267, U6 267→272, U8 272→273.

NON POSSO CONFERMARE (Behemoth): non ha rieseguito finale2.out e sem.out; [INFERITO] nessun altro punto ferma il tick senza passare da clearControls (percorsi di ripresa/nuova partita creano stato nuovo con newRun o resumeAtBoss, buffer assente o a 0).
