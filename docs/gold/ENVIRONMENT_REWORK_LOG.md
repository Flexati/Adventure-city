# CHRONOS ADVENTURE: NOX & LULÙ — Registro del Rework Ambientale (V3)

Data di verifica: 2026-11-09  
Ramo di riferimento: `work/chronos-adventure-commercial`

---

## 1. Sintesi degli Interventi per File (`[VERIFICATO NEL REPOSITORY]`)

| File Modificato | Intervento Tecnico e Artistico | Impatto su `app.js` / Prestazioni |
| :--- | :--- | :--- |
| `game/village-art.mjs` | Esportate le primitive condivise (`vHash`, `vRect`, `vBox`, `vCir`, `vLine`). Rifatto `drawVillageBackdrop`:<br>1. Il lastricato stradale/piazzale preserva la grana pixel-art di `environment.png` (cella `0`) con giunti non periodici.<br>2. Le celle `x` (prop) vengono renderizzate direttamente sul pavimento calpestabile (`cells[i] = 1`) **senza cordoli murari** attorno.<br>3. Ogni hub (`moon`, `cathedral`, `toxic`, `clockwork`) riceve tetti distintivi con grana litica, facciate sud con porte `d` e tappeti luminosi di servizio, landmark centrale di piazza unico (`768, 768`) e 3 varianti di prop contestuali integrati con `district_props.png`. | Condivisione delle primitive grafiche con `scenery.mjs`; 1 solo pass offscreen `1536×1536` per ingresso nell'hub (`0` costo per frame). |
| `game/scenery.mjs` | Rimosso il pattern a scacchiera `(x + y) % 4 === 0` (cella `1` di `environment.png`) e rimossa la ripetizione della singola casetta isometrica (cella `8` di `environment.png`) sui blocchi `2×2`:<br>1. Il suolo calpestabile combina una base scura distrettuale, la grana cella `0` (`alpha = 0.50`), micro-variazioni non periodiche (`vHash`), chiusini/griglie sparsi e corsie tattiche tratteggiate verso i nodi.<br>2. I grandi isolati perimetrali (`x < 4`, `x > 19`, `y < 4`, `y > 19`) mappano i 4 quadranti architettonici autentici di `city.png`, `port.png`, `clinic.png`, `fracture.png` (`864×864`) senza sovrapporre griglie wireframe.<br>3. Le 4 isole di copertura tattica interne (`2×2` tile in `yard` e `arena`) montano basamenti corazzati con le 4 colonne distinte di `district_props.png` (`112×112` px). | Eliminata ogni ripetizione di casette e la scacchiera segnalata in R5; `app.js` ridotto complessivamente di `1.606` byte. |
| `game/runtime.mjs` | Corretto `drawMapBackdrop`: sostituito lo stiramento del bordo (`edge = 64 * scale` stirato su tutto il margine esterno) con la ripetizione in scala `1:1` delle sole 2 file perimetrali esterne (`b = Math.floor(rh / 12)`, pari a `128` px mondo: righe/colonne `0..1` e `22..23`), oscurate da un velo `#04081078`. | Zero pixel stirati dietro i controlli touch su `390×844` e nessuna intrusione di strade o scritte interne (`ASSE DI SERVIZIO`, `03`) nei margini fuori mappa. |
| `tests/audio-v09.test.mjs` | Reso deterministico l'RNG in `AudioDirector` nel test di non-ripetizione dei colpi consecutivi e riallineata l'asserzione del pitch di `shot` all'intervallo reale configurato in `SFX_VARIATION.shot.pitch = 0.08` (`[0.92, 1.08]`). | Eliminata la flakiness statistica del test audio mantenendo invariato il codice di produzione `game/audio.mjs`. |

---

## 2. Confronto Prima / Dopo sulle Aree Critiche (`[VISUALMENTE VERIFICATO]`)

### 2.1 Missione `Blackout` (`yard` · `390×844`) — Risoluzione Osservazione R5
- **Prima (R4 / R5)**:
  - Il pavimento mostrava una scacchiera diagonale di quadrati chiari (`environment.png` cella `1` ogni `(x+y)%4===0`).
  - I muri perimetrali e le 4 coperture centrali ripetevano ~30 volte la medesima casetta isometrica (`environment.png` cella `8`).
  - Il margine inferiore (`y > 1536`, dietro lo stick e i tasti `SCHIVA`/`SPARA`) presentava strisce verticali di pixel stirati.
- **Dopo (V3 · `docs/evidence/env-v3/mission-blackout-yard-390x844.png`)**:
  - Asfalto scuro continuo con grana di pavé (`cella 0`), chiusini sparsi, corsia tratteggiata azzurra e pozzanghere riflettenti accanto alla `VORTEX`.
  - Le 4 coperture centrali `2×2` espongono 4 strutture industriali distinte dalla riga `0` di `district_props.png` (trasformatore ad alta tensione, generatore termico, barricata corazzata, cassa blindata).
  - I margini perimetrali e fuori mappa mostrano i quadranti architettonici di `city.png` in scala `1:1` senza alcuno stiramento verticale.

### 2.2 I Quattro Hub (`moon`, `cathedral`, `toxic`, `clockwork` · `390×844`)
- **Prima**:
  - Le celle `x` venivano trattate come ostacoli contornati da cordoli murari sul pavimento stradale; le piazze centrali e i tetti avevano una differenziazione cromatica minima.
- **Dopo (V3 · `docs/evidence/env-v3/hub-*.png`)**:
  - Ogni hub è immediatamente riconoscibile in meno di 2 secondi senza leggere l'HUD grazie a palette dedicata, architettura dei tetti (doghe/lucernari in `moon`, contrafforti/pinnacoli in `cathedral`, lamiera/sfiati bio in `toxic`, anelli d'ottone in `clockwork`), landmark centrale di piazza e prop posati direttamente sul lastricato calpestabile.

---

## 3. Contratto di Preservazione del Gameplay (§10 · `[TEST AUTOMATICO]`)

Il rework ambientale ha operato esclusivamente sulla rappresentazione visiva (`game/village-art.mjs`, `game/scenery.mjs`, `drawMapBackdrop` in `game/runtime.mjs`) senza alterare alcun dato logico o geometrico:

1. **Griglie di collisione e calpestabilità (`cells` e `walls` in `game/layouts.mjs` e `game/villages.mjs`)**: `0` celle modificate su `576` per ciascuno dei 9 layout (`[TEST AUTOMATICO]`: `tests/villages.test.mjs`, `tests/layouts.test.mjs`).
2. **Coordinate di spawn, nodi, boss e servizi hub (`game/hubs.mjs`, `game/missions.mjs`)**: `0` coordinate modificate; tutti i punti interattivi (`smith`, `vendor`, `inn`, `notice`, `travel`, `race_broker` e i 12 NPC) conservano le coordinate esatte e la raggiungibilità BFS (`routeWaypoint`).
3. **Compatibilità dei salvataggi (`v6` e `v7`)**: schema di salvataggio e migrazione invariati (`[TEST AUTOMATICO]`: `tests/hubs-v8.test.mjs`, `tests/save.test.mjs`).

---

## 4. Prestazioni e Budget del Bundle Android (§14 · `[TEST AUTOMATICO]`)

| Metrica | Limite Contrattuale | Valore R5 (Baseline) | Valore V3 (Finale) | Delta / Stato |
| :--- | :--- | :--- | :--- | :--- |
| **`android/build/assets/game/app.js`** | `<= 458.752` byte (`524.288 - 65.536`) | `458.482` byte | **`456.876` byte** | **`-1.606` byte** (`1.876` byte di margine libero) · `PASS` |
| **`android/build/assets/game/index.html`** | `<= 32.768` byte | `17.441` byte | **`17.441` byte** | `0` byte · `PASS` |
| **Risorse locali pacchettizzate** | Tutte risolte | `215` risorse | **`215` risorse** | `PASS` (`tests/bundle-weight.test.mjs`) |
| **Costo CPU/GPU per frame del fondale** | `1` blit da `mapRasters` | `9` `drawImage` (con bordi stirati) | **`1` `drawImage` centrale + max `4` fasce 1:1** solo ai margini | Zero allocazioni per frame (`prepareMapRasters` cachato) |
| **Suite completa `npm test`** | `346 / 346` PASS | `345 / 346` (1 test audio flaky) | **`346 / 346` PASS** | `0` fallimenti su `346` test |
