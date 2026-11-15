Copia dallo scratchpad della sessione del 3–4 novembre 2026; i percorsi /tmp non esistono più su un'altra macchina.
Nella copia il nome della cartella utente dentro i percorsi /tmp è sostituito da «[utente]» (assomigliava a un identificativo di modello per la regola 10); nell'originale è invariato.

# PIANO M2 — CHRONOS Adventure (Behemoth)

Repo `/home/locoomo/Adventure-city-commercial`, ramo `work/chronos-adventure-commercial`, HEAD `dec65e3`, worktree pulito. Ho usato Bash solo in lettura: non ho lanciato `npm test` né i QA.

**In breve.** Il mandato M2 nel repo è identico al tuo. Il piano ha 9 unità: U0 → E1 → C1 → N1 → estensione QA → G1 → CS → QA finale → documenti. Il budget stimato è di circa 2,1 KB su un margine di 11 223 byte. I test salgono da 249 a 270. Due gate: GATE-CS, che blocca solo U6 (il Chrono Shift), e GATE-72, fuori da M2.

---

## 0. Mandato riletto e confermato

- **[FATTO]** Il testo è identico a quello che mi hai passato: `docs/gold/ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md:258-274`. È il §4 M2: tabella C1/N1/G1/E1/CS alle righe 264-268; «Durate, finestre e hitbox del resto restano identiche» e le prove alla riga 274.
- **[FATTO]** D27 e D29 approvano rispettivamente C1/N1/N2 e G1/E1/CS (`docs/gold/DECISIONI.md:33` e `:35`). D31 conferma il Chrono Shift in modo esplicito come eccezione a D21 (`:37`). L'ultima decisione è D31: la nuova sarà D32, da inserire dopo la riga 37.
- **[FATTO]** Le decisioni aperte (`docs/design/v10.3/README.md:19-25`) non toccano M2.
- **[FATTO] M1 non è stata fatta.** Mancano la prova del gamepad e del joystick sul telefono e il registro in `PLAYTEST.md`. M2 parte senza M1, come hai disposto. C1, N1, G1, E1 e CS non dipendono da M1; il risultato su telefono resta aperto.
- **[INFERITO] Regola 10 e commit.** CLAUDE.md:43 vieta gli identificativi di modello nei commit. La regola del repo vince sulla riga di attribuzione automatica, quindi il commit di M2 **non** deve contenere il nome del modello.

## 1. Comprensione mirata (file:riga reali, HEAD dec65e3)

**Attenzione: i numeri di riga dei Pilastri sono vecchi.** Sono stati scritti sul commit 583e68b, prima di N2. Nel codice di oggi:

| Riga citata nei Pilastri | Riga reale |
|---|---|
| runtime:666 | runtime:668 |
| runtime:914-918 | runtime:930/934 |
| runtime:737 | runtime:753 |
| runtime:963 | runtime:979 |

Le righe di campaign.mjs coincidono.

### Runtime (`game/runtime.mjs`)

| Cosa | Riga | Fatto |
|---|---|---|
| `oneShotActions` | 667 | `weapon-change`, `weapon-reload`, `interact`, `dash`, `duo`, `pulse` (`pulse` è l'IMPULSO in guida, non il PULSE a piedi) |
| Collegamento dei pulsanti | 668 | `button.onclick=()=>{if(running&&!paused&&!uiLock)queue();}`, più `keydown`/`keyup` con `stopPropagation`. Da qui viene il «al rilascio» di C1 |
| SPARA e PULSE (`gun`, `magic`) | 669 | `onpointerdown` crea `aimTouch`; `onpointermove` attiva la mira manuale oltre 12 px; `onpointerup` crea `pending={kind,dir}`; da tastiera `pending` con `dir:null` |
| Joystick fisso, flottante, volante | 671, 683-685, 688 | |
| `clearControls` | 666 | |
| `footInputs` | 690 | `dash:dash\|\|ShiftLeft`, `gun:pending gun\|\|J\|\|Space`, `magic:pending magic\|\|L`, `aim:pending?.dir` |
| Lettura del gamepad | 694-704 | `pollGamepad`: alla pressione `dash=true`, `special=true`, `interact=true` (701); al rilascio di gun/magic `pending={kind,dir:read.aim}` (702); attivo solo dopo `gamepadconnected` (704). Il gamepad entra negli **stessi flag** del tocco, quindi un buffer nel `tick` vale anche per lui |
| `eventFx` | 718 | Perfect Dodge alla 753: `if(!settings.reduced)focusTime=.16`. Boss sconfitto alla 734: `focusTime=.4` |
| Disegno dei nemici | 814-842, 858, 880-884 | `enemySprite`; `drawWorld`. Gli attori sono **copie**: `...s.enemies.filter(...).map(e=>({...e,role:'enemy'}))` |
| `enemyFrame` | `game/visuals.mjs:69-78` | Il fotogramma dipende da `hp`, `deathAnim`, `hurtAnim`, `state`, `clock`, `windup`, `walk`, `face` |
| `drawThreats` | 888-913 | I telegraph leggono `s.enemies` dal vivo (905-912) |
| `updateFootHud` | 917 | `$('magic').disabled=!unlocked\|\|s.magicCd>0` alla 930; `$('dash').disabled=s.dashCd>0` alla 934 |
| `drawFoot` | 944 | Velo del focus alla 948 |
| `frame` | 979 | `rawDt=min(.05,…)`; `slow=(focusTime>0&&!reduced?.4:1)*(tutorial.slow?.35:1)`; `dt=rawDt*slow`. Questo rallenta anche Nox |
| Tick a piedi | 985 | `tick(state,footInputs(),dt);pending=null;interact=dash=special=…=false` |

### Simulazione (`game/campaign.mjs`)

| Cosa | Riga | Fatto |
|---|---|---|
| Ruoli dei nemici | 18-27 | `windup`: raider .95, breaker 1.1, signal 1.3, shooter .7, brute 1.35, boss 1.25 |
| `campaignEvent` | 103 | |
| `startAttack` | 114 | Rifiuta se c'è un'azione in corso o se `fireCd`/`magicCd` > 0 |
| `hitEnemy` | 147 | Eventi `impact` alla 158 e `down` alla 159, **senza id del nemico** |
| `perfectDodge` | 204 | `counterReady=.6`, Duo +14, evento `perfectDodge{x,y}` |
| `resolveThreat` | 206 | |
| Rook | 211-238 | Mira bloccata a `windup*.5` (218); `windup=1.2` (233) |
| Anchor | 242-268 | Spazzata `lock:.55`, `windup:1.25` (242); blocco alla 254 |
| Boss | 270-286 | slam/charge/volley; `charge` e `volley` fissano il bersaglio all'avvio e non lo seguono |
| `tick` | 288 | `dt=clamp(dt,0,.05)` |
| Timer | 289 | Lista dei timer decrementati |
| Scatto | 293 | `if(input.dash&&s.dashCd===0){dash=.18;dashCd=overdrive?.6:1.1;inv=.3;perfectWindow=overdrive?.2:.14}` |
| Attacchi | 300 | `if(input.gun)startAttack(...);if(input.magic)startAttack(...)` |
| Proiettili | 309-313 | |
| Mine | 315-317 | |
| Percezione furtiva | 319 | |
| Ciclo dei nemici | 320-345 | `e.clock+=dt` alla 320 |
| Telegraph | 334-335 | Melee segue fino a `windup*.55`; ranged fino a `windup*.6` |

### Test esistenti

- **[FATTO]** `tests/perfect-dodge.test.mjs` ha 3 test e `tests/input-v9.test.mjs` ne ha 8.
- **[FATTO]** I bot automatici di `tests/helpers/autoplay.mjs` guidano `campaign-v08`, `rook`, `chalk-mission` e `release-flow` con semi fissi. Premono gun/magic a ogni frame e dash solo con `dashCd===0`.
- **[FATTO]** `tests/bundle-globals.test.mjs` vieta nomi globali duplicati tra moduli. Ho controllato con grep che non esistono già: `telegraphLock`, `lockCue`, `hitStop`, `hitHold`, `chronoShift`, `PRESS_ACTIONS`.
- **[FATTO]** Nessun test confronta liste esatte di eventi della campagna (solo `racing-v9`).
- **[FATTO]** `tools/prepare_android_assets.py` toglie le righe di solo commento e la parola `export` (righe 66-71) e si ferma oltre 524 288 byte (106). I commenti su riga propria non pesano su `app.js`.
- **[FATTO]** Nessun test o strumento blocca con un hash `game/runtime.mjs` o `game/campaign.mjs`.

### Numeri delle specifiche (1 frame = 16,67 ms; `docs/design/v10.3/…`)

**Pilastro 1 (`CHRONOS_COMBATTIMENTO_P1_INPUT.md`):**
- Definizione del frame alla 16.
- C1, righe 137-144: la finestra della Perfect Dodge è di 0,14 s = 8,4 f (139). Il tocco di 100 ± 30 ms sfoca la finestra del 43 % (140-142). Tastiera e Invio/Spazio restano come sono (143). SPARA resta al rilascio (146-149).
- N1, righe 156-166: 100 ms = 100 ÷ 16,67 = 6,0 f (161). Valgono per SCHIVA, SPARA e PULSE; Duo e ATTIVA no (160). Vince il tocco più recente (163). Lo SPARA in buffer tiene la mira trascinata (164). La finestra parte quando parte lo scatto (165). Niente più `disabled` per SCHIVA e PULSE in ricarica, con un riempimento visivo al suo posto (166).
- Due comandi nello stesso frame: SPARA vince su PULSE (173).
- Il gamepad usa lo stesso buffer (203).
- Tabella finale, righe 238-244.

**Pilastro 2 (`CHRONOS_COMBATTIMENTO_P2_STATI.md`):**
- G1, riga 165: 2 f (33 ms) per un colpo d'arma, 4 f (67 ms) per il Pulse, 6 f (100 ms) per il colpo che sconfigge, con un lampo bianco di 1 f; la simulazione non si ferma. Massimo 6 f (213-215).
- E1, righe 207-210: evento `telegraphLock{x,y,kind}` solo informativo. Blocco del raider a 0,52 s = 31,4 f, del tiratore a 0,42 s = 25,2 f (124).
- CS, righe 176-186: solo la Perfect Dodge di Nox; Lulù tiene quella di oggi (180). Durata 0,6 s = 36 f (181). Fattore ×0,5 (182). Nox, i suoi colpi, l'interfaccia e il joystick non rallentano (183). Ricarica 3,0 s = 180 f, quindi al massimo 0,6 ÷ 3,0 = 20 % del tempo (184). Vive nella simulazione (185). Bordo ciano per 36 f «e nemici desaturati» (186). La desaturazione **non** è in D29 né nel mandato: DECISIONI vince, quindi la escludo.

---

## 2. Ordine delle unità (rivisto)

U0 → U1 E1 → U2 C1 → U3 N1 → U4 estensione QA → U5 G1 → U6 CS [GATE] → U7 QA finale → U8 documenti.

**Perché questo ordine e non E1 → CS → C1 → N1 → G1:**
- E1 è solo un'aggiunta e ha il rischio più basso. Va prima di CS perché CS deve cambiare il `dt` che E1 usa.
- CS è l'unica unità che cambia i tempi dei nemici e può spostare gli esiti dei bot a semi fissi. Ha anche un gate aperto: va per ultima, così non blocca le altre.
- C1 e N1 sono la stessa catena di input; l'estensione QA viene subito dopo, per provarle nel browser.

**Regole comuni a ogni unità:**
- Base per `verifica.sh`: `dec65e3`, perché c'è un solo commit a fine milestone. Il terzo argomento è il totale dei test del giro precedente.
- `verifica.sh` darà sempre `[BLOCCO] npm test non è tutto verde`, a causa dei 3 fallimenti di base. **L'esito si giudica dal log:**
  - `grep -E '^# tests ' LOG` deve dare il totale atteso;
  - `grep -E '^not ok' LOG` deve elencare **solo** questi 3 nomi:
    1. `every repo path named in CLAUDE.md and in the §2 prompts exists`;
    2. `race props round trip: masks filled pass, a short container footprint fails`;
    3. `GPT chroma key keeps green-tinted paint and removes the off-green GPT background`.
  - **I numeri 72, 222 e 223 cambieranno.** I test nuovi in file che vengono dopo `claude-guide` nell'ordine alfabetico spostano i due di `tooling-syntax` (ad esempio 225 e 226). Bisogna confrontare i **nomi**.
- Il controllo 6 di `verifica.sh` darà `[ATTENZIONE]` su righe con cooldown, durate o frame: ogni riga va giustificata con D27, D29 o D31.
- Byte: dopo ogni `npm test` lanciare `stat -c %s /home/locoomo/Adventure-city-commercial/android/build/assets/game/app.js`. Delta = valore − 513 065 (oppure − il valore dell'unità precedente).
- `SCR=/tmp/[utente]/-home-locoomo-Scrivania-building-factory-NEW-STUDIO-GAMES-chronos/18218a94-ec42-51fe-9740-e2043427dc3c/scratchpad`

---

### U0 — Linea di base dei QA nel browser (nessun file modificato)

- **CORSIA:** PIENA.
- **FILE:** nessuno.
- **CHANGE:** nessuno. Serve a separare i problemi dell'ambiente (Chromium di sistema) dalle regressioni.
- **TEST NUOVI:** 0.
- **VALIDATION REQUIRED:**
  1. Controllare che la porta sia libera: `ss -ltn 'sport = :8090'` deve essere vuoto.
  2. In background: `python3 -m http.server 8090 --bind 127.0.0.1 --directory /home/locoomo/Adventure-city-commercial`.
  3. `cd /home/locoomo/Adventure-city-commercial && CHROMIUM=/usr/bin/chromium npm run qa:controls -- http://127.0.0.1:8090/game/ $SCR/U0/qa-controls` deve dare `E03 controls PASS · 9 checks`.
  4. `CHROMIUM=/usr/bin/chromium npm run qa:gamepad -- http://127.0.0.1:8090/game/ $SCR/U0/qa-gamepad` deve dare `Gamepad N2 PASS · 9 checks`.
  5. Se Chromium 149 non parte: rifare con `CHROMIUM=/usr/bin/google-chrome`.
- **Byte:** 0.

### U1 — E1: evento `telegraphLock{x,y,kind}`

- **CORSIA:** PIENA.
- **FILE:** `game/campaign.mjs`; `tests/perfect-dodge.test.mjs`.
- **CHANGE (righe esistenti toccate, prima della modifica):**
  - Aggiungere vicino a `campaignEvent` (103) un aiuto che emette l'evento **una sola volta**, nel tick in cui `e.clock` attraversa la soglia: `e.clock>=at && e.clock-dt<at`. Il `dt` è quello con cui è appena salito `e.clock` (320). Il carico utile è `{x:p.x,y:p.y,kind}`.
  - Chiamarlo in 3 punti, senza toccare la logica:
    - ramo `warn` (334-335): `at=windup*(ranged?.6:.55)`, `kind='ranged'` o `'melee'`, punto = `e.target`. Copre anche lo slam dei boss e quello di Anchor, che passano dal ramo `warn` generico;
    - `rookThink` (218): `at=windup*.5`, `kind='rook'`, punto = `e.target`;
    - `anchorThink` (254): `at=windup*R.sweep.lock`, `kind='sweep'`, punto = il nucleo `(e.x,e.y)`, perché la spazzata blocca una direzione, non un punto **[IPOTESI]**.
  - `charge` e `volley` fissano il bersaglio all'avvio: niente evento **[IPOTESI]**, perché non «smettono di seguire».
  - Nessun consumatore nel runtime: l'audio e il segnale visivo sono il Pilastro 3. La regola 8 resta rispettata, perché per il giocatore non cambia nulla.
- **Formule:**
  - raider: 0,95 × 0,55 = 0,5225 s = 31,4 f;
  - tiratore: 0,7 × 0,6 = 0,42 s = 25,2 f;
  - Rook: 1,2 × 0,5 = 0,6 s = 36 f;
  - spazzata: 1,25 × 0,55 = 0,6875 s = 41,2 f;
  - slam di Anchor: 1,1 × 0,55 = 0,605 s = 36,3 f.
- **TEST NUOVI (+3):**
  1. Melee: un solo evento, nel tick che attraversa `e.windup*.55` (soglia letta da `e.windup`, non scritta a mano). `x,y` coincidono con `e.target`. Dopo il blocco il bersaglio non segue più l'eroe che si muove.
  2. Ranged: soglia `.6`, `kind:'ranged'`.
  3. Rook (`.5`, `'rook'`) e spazzata di Anchor (`.55`, `'sweep'`). Lo stato dopo il tick del blocco è uguale al percorso senza evento: stesso `clock`, stesso `target`, nessun danno.
- **VALIDATION REQUIRED:** `VERIFICA_LOG=$SCR/U1_npm_test.log bash ~/.claude/skills/pantheon-chronos/verifica.sh /home/locoomo/Adventure-city-commercial dec65e3 249`. Attesi tests=252, solo i 3 fallimenti di base.
- **Byte:** circa 300 (tetto 600).

### U2 — C1: SCHIVA, DUO e ATTIVA su `pointerdown`

- **CORSIA:** PIENA.
- **FILE:** `game/input-v9.mjs`, `game/runtime.mjs`, `tests/input-v9.test.mjs`.
- **CHANGE:**
  - `input-v9.mjs`, nuovo e puro (testabile in Node):
    - `PRESS_ACTIONS=Set(['dash','duo','interact'])`;
    - `pressQueues(type,detail)`, che vale vero per `pointerdown` e per `click` con `detail===0`, cioè il clic da tastiera o da tecnologia assistiva.
  - `runtime.mjs:11`: aggiungere i due nomi all'import.
  - `runtime.mjs:668`, nel ciclo di `oneShotActions`, solo per gli id in `PRESS_ACTIONS`:
    - `onpointerdown` accoda l'azione (ignora `e.button>0`, chiama `preventDefault`);
    - `onclick` accoda solo se `pressQueues('click',e.detail)`, così un tocco non vale due volte;
    - gli altri id (`weapon-change`, `weapon-reload`, `pulse`) restano su `onclick` come oggi.
  - Restano uguali: `keydown`/`keyup`, `gun`/`magic` (669, SPARA al rilascio), le condizioni `running&&!paused&&!uiLock`.
  - Effetto: la finestra di 0,14 s = 8,4 f si conta dal tocco. Prima c'era in mezzo la durata del tocco, circa 100 ms **[IPOTESI]** (P1:140). Durate, finestre e hitbox non cambiano.
- **TEST NUOVI (+2):**
  1. Valori di `PRESS_ACTIONS` e casi di `pressQueues`: (`pointerdown`, 1) vero; (`click`, 1) falso; (`click`, 0) vero.
  2. Controllo sul sorgente del runtime: `onpointerdown` è legato solo agli id di `PRESS_ACTIONS`, mentre `gun`/`magic` creano ancora `pending` in `onpointerup`.
- **VALIDATION REQUIRED:**
  - `VERIFICA_LOG=$SCR/U2_npm_test.log bash ~/.claude/skills/pantheon-chronos/verifica.sh /home/locoomo/Adventure-city-commercial dec65e3 252`. Attesi tests=254 e i 3 di base.
  - Poi `qa:controls` e `qa:gamepad` come in U0, con output in `$SCR/U2/`: 9/9 e 9/9.
- **NON POSSO CONFERMARE:** se TalkBack genera un `click` con `detail>0` senza `pointerdown`, l'attivazione con TalkBack andrebbe persa. Si verifica solo sul telefono (M1).
- **Byte:** circa 360 (tetto 600).

### U3 — N1: buffer di 100 ms per SCHIVA, SPARA e PULSE; niente più `disabled` in ricarica

- **CORSIA:** PIENA.
- **FILE:** `game/campaign.mjs`, `game/runtime.mjs`, `game/style.css`, `tests/input-buffer.test.mjs` (nuovo).
- **CHANGE in `campaign.mjs`:**
  - Costante di 0,1 s **di tempo di gioco** (P1:161).
  - Aggiungere i 3 timer del buffer alla lista dei decrementi (289).
  - Subito dopo, a ogni pressione:
    - `input.dash` imposta il buffer della schivata a 0,1;
    - `input.gun` e `input.magic` impostano il proprio buffer a 0,1 e salvano la propria mira (`input.aim`, oppure `null` per la mira automatica al momento dello sparo, P1:164).
    - Il tocco più recente sostituisce quello vecchio (P1:163).
  - 293: la condizione `input.dash&&dashCd===0` diventa `buffer>0&&dashCd===0`, e il buffer si azzera. I valori interni restano identici: 0,18, 1,1/0,6, 0,3, 0,14/0,2.
  - 300: `startAttack` si tenta con il buffer di gun, poi con quello di magic. Il buffer si azzera solo se l'attacco parte. L'ordine e la regola «vince SPARA» restano.
  - Formula: un PULSE premuto insieme a SPARA non parte più tardi, perché l'azione dura almeno 0,26 s = 15,6 f, più dei 6 f del buffer.
- **CHANGE in `runtime.mjs`:**
  - 930: `$('magic').disabled` dipende solo da `!unlocked`, più la classe `cooling` se `magicCd>0`. Resta il testo con i secondi.
  - 934: niente più `$('dash').disabled`. Al suo posto la classe `cooling` e la variabile CSS `--cd` = `dashCd ÷ (overdrive ? 0,6 : 1,1)` per il riempimento.
  - Restano disattivati: Duo/Barriera, ricarica e cambio arma. Non hanno buffer, e P1:166 nomina solo SCHIVA e PULSE.
- **CHANGE in `style.css`:** regola `.cooling` con il riempimento. Il file è separato da `app.js` (prepare:100), quindi non pesa sul budget.
- **Gamepad:** passa da `dash=true` e `pending` (701-702), quindi usa lo stesso buffer senza codice in più.
- **TEST NUOVI (+6):**
  1. Schiva premuta con 0,08 s di ricarica: parte entro 0,1 s, con 0,18, 0,3, 0,14 e 1,1 invariati.
  2. Schiva premuta con 0,15 s di ricarica: scartata.
  3. SPARA durante un'azione: parte al primo tick libero e tiene la mira manuale; senza trascinamento la mira è automatica.
  4. PULSE in buffer funziona; SPARA e PULSE nello stesso tick: vince SPARA e il PULSE non parte dopo.
  5. Il tocco nuovo sostituisce mira e timer.
  6. Duo e ATTIVA senza buffer (`duo` a 99 e poi a 100 senza pressione: niente Duo), più un controllo sul sorgente: niente `$('dash').disabled=` e niente `magicCd` in `$('magic').disabled`.
  - I test 1 e 2 usano `dt=1/60` e anche `.05`, e restano lontani dal confine di 0,1 s per la precisione dei decimali.
- **VALIDATION REQUIRED:**
  - `VERIFICA_LOG=$SCR/U3_npm_test.log bash ~/.claude/skills/pantheon-chronos/verifica.sh /home/locoomo/Adventure-city-commercial dec65e3 254`. Attesi tests=260 e i 3 di base.
  - `qa:controls` e `qa:gamepad` in `$SCR/U3/`.
- **Rischio [INFERITO]:** il buffer può spostare di qualche frame le traiettorie dei bot a semi fissi (`campaign-v08`, `rook`, `chalk`). Se un test cade, si trova la causa; non si allenta il test.
- **Byte:** circa 410 (tetto 800).

### U4 — Prova di C1 e N1 nel browser (strumento QA tracciato)

- **CORSIA:** PIENA.
- **FILE:** `tools/verify_controls_v9.cjs`, `tests/tooling-syntax.test.mjs`.
- **CHANGE:** aggiungere 2 controlli prima del ciclo delle viewport:
  - `dash-on-touchstart`: tocco iniziale su `#dash`, attesa di 60 ms, `dashCd>0` **con il dito ancora giù**. Prova C1 con un tocco vero, cosa che un test unitario non può fare.
  - `dash-enabled-while-cooling`: durante la ricarica `#dash.disabled===false` e il pulsante ha la classe `cooling`.
  - Il rapporto passa da 9 a 11 controlli.
  - **Perché:** il mandato chiede «test nuovi», e senza questo C1 resta verificato solo sul sorgente.
- **TEST NUOVI (+1):** «controls browser verifier has valid syntax» (`node --check`), come quello che esiste già per il gamepad.
- **VALIDATION REQUIRED:**
  - `VERIFICA_LOG=$SCR/U4_npm_test.log bash ~/.claude/skills/pantheon-chronos/verifica.sh /home/locoomo/Adventure-city-commercial dec65e3 260`. Attesi tests=261.
  - `qa:controls` in `$SCR/U4/qa-controls`: `PASS · 11 checks`.
  - `qa:gamepad` in `$SCR/U4/qa-gamepad`: 9/9.
- **Byte:** 0.

### U5 — G1: hit-stop solo visivo di 2, 4 o 6 frame

- **CORSIA:** PIENA.
- **FILE:** `game/visuals.mjs`, `game/campaign.mjs` (solo il carico degli eventi), `game/runtime.mjs`, `tests/visuals.test.mjs`.
- **CHANGE:**
  - `visuals.mjs`: funzione pura con i frame per evento.
    - `impact` con `source` `gun` → 2; `magic` → 4; `down` → 6 da qualsiasi fonte.
    - `partner`, `ally` e `duo` → 0 **[IPOTESI]**: P2:165 nomina solo arma, Pulse e colpo che sconfigge.
  - `campaign.mjs:158-159`: aggiungere `id:e.id` agli eventi `impact` e `down`. È solo informativo e serve a trovare il bersaglio. Poi i tempi in secondi reali: 2 f = 2/60 = 33,3 ms; 4 f = 66,7 ms; 6 f = 100 ms; lampo di 1 f = 16,67 ms.
  - `runtime.mjs`:
    - una mappa per id con timer, lampo e posa congelata (`state`, `clock`, `windup`, `walk`, `hurtAnim`, `deathAnim`, `face`), presa in `eventFx` (718). Se nello stesso tick arrivano `impact` e `down` vince il massimo, e la posa resta la prima;
    - decremento con `rawDt` **all'inizio di `frame`** (979, vicino a `focusTime`), così il lampo viene disegnato almeno una volta;
    - in `drawWorld` (880) la copia del nemico prende la posa congelata. `hp`, posizione e barra della vita restano quelli veri;
    - lampo: `ctx.filter` per una sagoma bianca di 1 f (881-884);
    - svuotare la mappa in `clearControls` (666).
  - `tick` riceve lo **stesso `dt`** e `drawThreats` legge sempre lo stato vero: i telegraph non si fermano.
  - Limite dichiarato: Anchor, che si anima con `performance.now`, non si congela.
- **TEST NUOVI (+3):**
  1. La tabella dei frame e la conversione in secondi.
  2. Gli eventi `impact` e `down` portano l'id del nemico.
  3. Controllo sul sorgente: c'è ancora `tick(state,footInputs(),dt)`, la mappa scala con `rawDt` e non compare né nel calcolo di `dt` né in `drawThreats`.
- **VALIDATION REQUIRED:** `VERIFICA_LOG=$SCR/U5_npm_test.log bash ~/.claude/skills/pantheon-chronos/verifica.sh /home/locoomo/Adventure-city-commercial dec65e3 261`. Attesi tests=264.
- **NON POSSO CONFERMARE:** la leggibilità del fermo su 6" (Pilastro 5, sul telefono). Il supporto di `ctx.filter` nel WebView è **[INFERITO]**.
- **Byte:** circa 720 (tetto 1 200).

### U6 — CS: Chrono Shift di Nox — **GATE-CS**

- **CORSIA:** PIENA.
- **FILE:** `game/campaign.mjs`, `game/runtime.mjs`, `tests/perfect-dodge.test.mjs`.
- **CHANGE in `campaign.mjs`:**
  - `perfectDodge` (204), se `hero==='nox'` e la ricarica del Chrono Shift è a zero:
    - Chrono Shift = 0,6 s di gioco (36 f);
    - ricarica = 3,0 s (180 f, dall'attivazione);
    - evento `perfectDodge{…,shift:true}`.
  - Il resto resta identico: contrattacco 0,6 e Duo +14.
  - Aggiungere i 2 timer alla lista dei decrementi (289).
  - All'inizio del tick: `edt = dt × (shift ? 0,5 : 1)`. Lo usano: i proiettili (309-313), tutto il ciclo dei nemici (320-345: `clock`, `stun`, `guard`, `hurtAnim`, `deathAnim`, i movimenti) e `bossThink`, `rookThink` e `anchorThink`.
  - **E1 riceve `edt`.**
  - Non rallentano: eroe, compagno, alleati, ondate, difesa e i timer dell'eroe.
  - Lo shift parte dal tick successivo alla Perfect Dodge: al massimo 1 tick di ritardo, cioè 16,67 ms (50 ms nel caso peggiore).
  - Formule: durante lo shift un nemico avanza 0,6 × 0,5 = 0,3 s (18 f di nemico); al massimo 0,6 ÷ 3,0 = 20 % del tempo.
- **CHANGE in `runtime.mjs`:**
  - 753: `focusTime=.16` solo se `!e.shift`. Durante lo shift Nox va a velocità normale (D29).
  - In `drawFoot` (944): bordo ciano fermo mentre lo shift è attivo. Funziona senza audio e su uno schermo piccolo.
- **Comportamento derivato dal testo, non una scelta mia [INFERITO]:**
  - Lulù resta come oggi (P2:180).
  - Una Perfect Dodge di Nox durante la ricarica dello shift tiene il rallentamento di oggi (40 % per 0,16 s), perché «durate, finestre e hitbox del resto restano identiche» (ISTRUZIONI:274; regola 4).
  - Niente desaturazione (D29 dice solo «bordo ciano»).
- **GATE-CS: una domanda per Posky.** Le fonti si contraddicono.
  - Da un lato il Pilastro 2 (riga 185) mette il Chrono Shift nella simulazione, «così resta riproducibile», e la simulazione non conosce le impostazioni (`campaign.mjs:4`).
  - Dall'altro, oggi l'opzione «movimento ridotto» spegne il rallentamento della Perfect Dodge (`runtime.mjs:753`, `979`; P1:105).
  - D29 dice «nemici e proiettili», ma non dice se ci rientrano le mine di Rook (315-317) e la percezione delle pattuglie (319).
  - **Domanda:** «Durante il Chrono Shift rallento tutto ciò che appartiene ai nemici, quindi anche le mine di Rook e la vista delle pattuglie, e lo tengo attivo anche con "movimento ridotto"? Sì, oppure dimmi cosa escludere.»
  - Proposta di Behemoth: sì a entrambe, perché è una regola di gioco e il bordo è fermo.
  - **U6 non parte senza questa risposta.** Behemoth non ha l'autorità di trattare la delega di oggi come una risposta.
- **TEST NUOVI (+5):**
  1. La Perfect Dodge di Nox attiva lo shift (0,6 / 3,0 / `shift:true`); quella di Lulù no, con contrattacco e Duo uguali.
  2. Durante lo shift orologi e proiettili dei nemici avanzano a ×0,5, l'eroe a 205 × dt.
  3. Fine dopo 36 tick da 1/60 s.
  4. Una seconda Perfect Dodge entro 3,0 s non lo riattiva; dopo 3,0 s sì.
  5. Durante lo shift `telegraphLock` arriva una volta sola e i tempi dello scatto restano invariati.
  - Se la risposta al gate include mine e pattuglie, il test 2 si estende.
- **VALIDATION REQUIRED:** `VERIFICA_LOG=$SCR/U6_npm_test.log bash ~/.claude/skills/pantheon-chronos/verifica.sh /home/locoomo/Adventure-city-commercial dec65e3 264`. Attesi tests=269.
- **Rischio [INFERITO]:** è l'unità che più facilmente cambia gli esiti dei bot con Nox (`campaign-v08`, `rook` con i semi 1-3). Va analizzato e non nascosto.
- **Byte:** circa 300 (tetto 700).

### U7 — QA finale nel browser (nessun file modificato)

- **CORSIA:** PIENA.
- **FILE:** nessuno.
- **TEST NUOVI:** 0.
- **VALIDATION REQUIRED:**
  - Server sulla porta 8090 come in U0.
  - `CHROMIUM=/usr/bin/chromium npm run qa:controls -- http://127.0.0.1:8090/game/ $SCR/U7/qa-controls`: 11 controlli PASS.
  - `CHROMIUM=/usr/bin/chromium npm run qa:gamepad -- http://127.0.0.1:8090/game/ $SCR/U7/qa-gamepad`: 9/9 PASS.
  - Poi fermare il server.
  - Il percorso di output va **sempre** passato a `qa:gamepad`: altrimenti sovrascrive il rapporto tracciato di D29, `docs/evidence/v10.3/gamepad/gamepad_browser_report.json` (`tools/verify_gamepad_browser.cjs:7`).
  - Opzione per l'orchestratore: copiare i due `report.json` in `docs/evidence/v10.3/m2/`, perché l'autore li veda su GitHub. Sono pochi KB.

### U8 — Documenti

- **CORSIA:** PIENA.
- **FILE:** `docs/gold/DECISIONI.md`, `docs/gold/STATO.md`, `docs/gold/PLAYTEST.md`, `tests/claude-guide.test.mjs`.
- **CHANGE:**
  - **DECISIONI.md, nuova riga 38 dopo D31, stesso formato `| D32 |`:**
    - titolo «Delega di sviluppo fino al rilascio commerciale, nel rispetto delle istruzioni»;
    - parole citate: «Sviluppa così il gioco e… finiscilo fino al rilascio commerciale. Ovviamente segui tutte le istruzioni»; in più, l'autore non è al computer e non va aspettato;
    - cosa vale: si procede milestone per milestone;
    - cosa non cambia: CLAUDE.md e D01–D31; lo stop a fine milestone; `COMMERCIAL_RELEASE = BLOCKED`; niente store né Play Console senza un'autorizzazione esplicita (regola 2); la scelta di M4 e i punti «Da decidere» restano all'autore; il gate CS va chiuso dall'autore.
    - È un'interpretazione **[INFERITO]**: la formulazione va confermata da Posky allo stop.
  - **STATO.md:** nuova prima sezione «M2 — Input e sensazione dei colpi (3 novembre 2026)», sopra «Prompt per Claude su MX Linux». Contiene:
    - D32;
    - le unità fatte, con i numeri **presi dai log**: test, byte di `app.js`, QA;
    - CS fatto oppure aperto, a seconda del gate;
    - la linea di base su questo PC (246/249 e perché);
    - M1 ancora aperta;
    - 0 sessioni umane;
    - `COMMERCIAL_RELEASE = BLOCKED`.
  - **PLAYTEST.md:** sezione nuova in fondo, «M2 — da provare sul telefono e con persone»: latenza di C1, sensazione del buffer, leggibilità del fermo, Chrono Shift. La stima della durata del 31 ottobre è precedente a N1 e CS e non è stata rifatta. **Le righe 5 e 19 («Sessioni umane») non si toccano.**
- **TEST NUOVI (+1):** in `claude-guide.test.mjs`, «la prima sezione di STATO.md cita l'ultima decisione di DECISIONI.md». Controlla la regola di CLAUDE.md:59.
- **VALIDATION REQUIRED:**
  - `VERIFICA_LOG=$SCR/U8_npm_test.log bash ~/.claude/skills/pantheon-chronos/verifica.sh /home/locoomo/Adventure-city-commercial dec65e3 269`. Attesi tests=270 e i 3 di base.
  - Il controllo 7 deve dare «contatore delle sessioni umane invariato».
  - Il controllo 4 non deve trovare identificativi di modello.
- **Fuori perimetro, solo segnalati:** P1:261, P2:5 e i «non ancora implementati» di D27 e D29 saranno superati dai fatti. Le righe storiche di DECISIONI non si riscrivono.
- **Byte:** 0.

---

## 3. Budget di `app.js`

- Stima: E1 300 + C1 360 + N1 410 + G1 720 + CS 300 = **circa 2 090 byte** **[INFERITO]**.
- Somma dei tetti: 3 900 byte, sotto il margine di 11 223.
- Atteso circa 515 150 byte (al massimo 516 965) su 524 288. Si misura a ogni unità con `stat`.

## 4. Chromium di sistema e output dei QA

- **CLAIM:** `qa:controls` e `qa:gamepad` lanciano Chromium con `executablePath:process.env.CHROMIUM||undefined`, senza `channel`, e prendono URL e cartella di output dagli argomenti.
- **LIVELLO:** VERIFICATO.
- **EVIDENZA GREZZA:**
  - `tools/verify_controls_v9.cjs:6` `const [url='http://127.0.0.1:8090/game/',out='artifacts/v9-controls']=process.argv.slice(2);`
  - `:10` `chromium.launch({executablePath:process.env.CHROMIUM||undefined})`
  - `tools/verify_gamepad_browser.cjs:7` (out di default `docs/evidence/v10.3/gamepad`, cioè **tracciato**) e `:11` uguale.
- **Quindi:** `CHROMIUM=/usr/bin/chromium npm run qa:… -- <url> <out>`, senza `playwright install` e senza toccare file tracciati. La porta 8090 è già il default di entrambi.
- **[FATTO]** Versioni:
  - `Chromium 149.0.7827.114`;
  - `Google Chrome 153.0.8010.36`;
  - playwright-core 1.62.1, che si aspetta Chromium `151.0.7922.34` (`browsers.json`);
  - `~/.cache/ms-playwright` non esiste;
  - Node `v22.22.3`.
- **NON POSSO CONFERMARE:** che Playwright 1.62.1 guidi bene Chromium 149 senza testa. Lo verifica U0; il ripiego è `/usr/bin/google-chrome`.
- **Spazio [FATTO]:** `df` dà 352 MB liberi, non 370. Non conviene `npx playwright install` (ISTRUZIONI:50-56), che scarica un browser intero.
- **[FATTO]** `artifacts/` è escluso dal checkout sparso (`/*`, `!/artifacts/`) e ha 271 voci `skip-worktree`. Nessuna unità ci scrive.

## 5. GATE-72 per Posky (fuori da M2, nessuna unità)

- **CLAIM:** il test «every repo path named in CLAUDE.md…» fallisce perché CLAUDE.md:98 cita `deliveries/`, che non esiste nel ramo.
- **LIVELLO:** VERIFICATO.
- **EVIDENZA GREZZA:**
  - `CLAUDE.md:98` `| Immagini consegnate (originali, non si toccano) | \`deliveries/\` e i rami \`delivery/*\` |`
  - `tests/claude-guide.test.mjs:15` `ROOTS='…|android|deliveries'`
  - `git ls-tree -d HEAD deliveries` vuoto
  - log di Leviathan `$SCR/L_npm_test.log`: `not ok 72 - every repo path named…`
- **Correzione minima proposta (opzione A, consigliata):** CLAUDE.md:98 diventa `| Immagini consegnate (originali, non si toccano) | i rami \`delivery/*\` (in questo ramo non c'è una cartella di consegne) |`. Il test resta com'è, i percorsi passano da 52 a 51 (soglia 40).
- **Opzione B (sconsigliata):** cambiare il test per tollerare `deliveries/`, che indebolisce il controllo.
- **Perché serve Posky:** CLAUDE.md è il file delle regole dell'autore (CLAUDE.md:5, 48).
- Creare una cartella `deliveries/` è escluso, perché `verifica.sh` lo tratta come BLOCCO (controllo 5).

## 6. Riepilogo dei gate

| Gate | Cosa blocca |
|---|---|
| **GATE-CS** | Solo U6. U0–U5, U7 e U8 possono andare avanti; senza risposta, U8 registra CS come APERTO, non come fatto |
| **GATE-72** | Nulla in M2 |

Nessun'altra contraddizione tra le fonti per C1, N1, G1 ed E1. I dettagli scelti come [IPOTESI] sono dichiarati unità per unità.

> U3 (aggiunta dopo U3-bis): Un'interruzione (pausa, sospensione, dialogo, scena, `lock`) svuota il buffer di N1 tramite `clearInputBuffer`, chiamato da `clearControls`. È il comportamento di prima di U3: P1:162 e P1:170-171. Dettagli: piano-M2-U3bis.md
