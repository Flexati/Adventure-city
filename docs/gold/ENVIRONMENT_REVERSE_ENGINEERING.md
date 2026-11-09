# CHRONOS ADVENTURE: NOX & LULÙ — Reverse Engineering dell'Ambiente (V3)

Data di verifica: 2026-11-09  
Ramo di riferimento: `work/chronos-adventure-commercial`  
Base di partenza: commit `91734cc` (`R5: revisione dei commit di AI Studio; il server torna sicuro; build di pretest 15`)

---

## 1. Gate G0 & G1 — Verità del Repository e Baseline Tecnica

### 1.1 Verifica dello stato iniziale (`[FATTO]` · `[VERIFICATO NEL REPOSITORY]`)
- **Allineamento con `origin/work/chronos-adventure-commercial`**: il punto di partenza è il commit `91734cc`, in cui la revisione R5 ha ripristinato la sicurezza di `server.js` (nessun sottoprocesso o endpoint di push remoto), la configurazione di `android/AndroidManifest.xml` (`versionCode=15`, `versionName="1.0.2-rc15"`), `package.json` e `tools/prepare_android_assets.py`.
- **Osservazione R5 aperta in `docs/gold/STATO.md` (`[FATTO]`)**:
  > *"Ambiente e villaggi rifatti (fa2fa94, fd8da5a) — Da rivedere. In missione il lastricato nuovo ha riquadri chiari a scacchiera e lo stesso palazzo ripetuto (schermata di Blackout a 390×844)."*
- **Budget bundle Android (`[TEST AUTOMATICO]`)**:
  - Limite rigido verificato da `tests/bundle-weight.test.mjs`: `android/build/assets/game/app.js <= 458.752` byte (`524.288 - 65.536` byte di margine).
  - Baseline R5: `458.482` byte (`270` byte di margine residuo).
  - Risultato dopo il rework V3: **`456.876` byte** (`1.876` byte sotto la soglia massima, con un risparmio netto di `1.606` byte rispetto a R5).

---

## 2. Architettura del Pipeline Ambientale (`[VERIFICATO NEL REPOSITORY]`)

Il rendering degli ambienti 2D top-down di *Chronos Adventure: Nox & Lulù* si articola su cinque moduli runtime collegati in modo deterministico:

1. **`game/layouts.mjs` (`TILE_SIZE = 64`, `GRID_SIZE = 24`, superficie mondo `1536×1536` px)**:
   - Compila una sola volta per sessione le 9 geometrie giocabili (`layoutCache`):
     - **4 hub esplorabili** (`village: true`): `moon`, `cathedral`, `toxic`, `clockwork`.
     - **5 layout tattici di missione/esplorazione**: `yard`, `elbow`, `spine`, `arena`, `gallery`.
   - Costruisce la griglia di calpestabilità `cells` (`576` celle `0/1`), i rettangoli di collisione `walls` (usati da fisica e raycast dei proiettili), i punti `start`, `nodes`, `entries`, `spawns`, `boss` e il campo di navigazione BFS `routeFields` (`routeWaypoint`).
2. **`game/villages.mjs` (`VILLAGE_ASC`, `compileVillage`, `VILLAGE_THEMES`)**:
   - Definisce le mappe ASCII `24×24` dei quattro villaggi con legenda immutabile:
     - `#` = blocco edilizio non calpestabile (`cells[i] = 0`);
     - `.` = strada lastricata calpestabile (`cells[i] = 1`);
     - `,` = piazza/corte interna calpestabile (`cells[i] = 1`);
     - `:` = attraversamento/passerella calpestabile (`cells[i] = 1`);
     - `d` = soglia/ingresso d'edificio calpestabile (`cells[i] = 1`);
     - `x` = prop/arredo urbano su suolo calpestabile (`cells[i] = 1`).
   - Compila i lotti continui di `#` in edifici rettangolari (`buildings`) con tetti e facciate frontali.
3. **`game/village-art.mjs` (`drawVillageBackdrop`, `vHash`, `vRect`, `vBox`, `vCir`, `vLine`)**:
   - Disegna fuori schermo (`1536×1536` px) la superficie statica dei 4 hub integrando gli atlanti pixel-art `environment.png` (`512×512`) e `district_props.png` (`1536×1024`) con cordoli, tetti tipizzati, facciate con porte/finestre, landmark di piazza e prop contestuali.
4. **`game/scenery.mjs` (`buildMapSurface`, `drawMissionScenery`)**:
   - Costruisce il canvas `1536×1536` (`activeMapSurface`) all'avvio di ogni missione o ingresso nell'hub.
   - Per i layout di missione (`yard`, `elbow`, `spine`, `arena`, `gallery`), compone il pavimento stradale calpestabile, i grandi isolati perimetrali usando i 4 quadranti architettonici degli sfondi distrettuali `city.png`, `port.png`, `clinic.png`, `fracture.png` (`864×864`), le isole di copertura tattica interna (`2×2` tile) con le strutture distrettuali di `district_props.png`, i parapetti di confine e la segnaletica diegetica dei nodi.
5. **`game/runtime.mjs` (`prepareMapRasters`, `drawMapBackdrop`, `drawWorld`, `drawExploration`, `drawFoot`)**:
   - Pre-rasterizza `activeMapSurface` a tre livelli di scala (`1.75`, `1.25`, `1.0`) in `mapRasters` prima del loop di gioco, evitando allocazioni o ridisegni per frame.
   - `drawMapBackdrop` riempie i margini fuori mappa (`< 0` o `> 1536` su schermi verticali `390×844`) ripetendo in scala `1:1` esclusivamente le 2 file perimetrali (`128` px mondo) di blocchi architettonici esterni con velatura scura `#04081078`, per poi tracciare il canvas di gioco e gli attori ordinati per coordinata `y` (Y-sort).

---

## 3. Tabella delle Dipendenze Ambientali (§6.3 · `[VERIFICATO NEL REPOSITORY]`)

| Area ID | Tipo | Geometria (`layouts.mjs`) | Sorgente Scenery | Atlanti Pixel-Art Coinvolti | Punti / Nodi Interattivi |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `moon` | Hub | `VILLAGE_ASC.moon` (`24×24`) | `drawVillageBackdrop` (`village-art.mjs`) | `environment.png`, `district_props.png` (riga 0), `interiors.png` | `smith` `(608,736)`, `vendor` `(928,736)`, `inn` `(768,544)`, `notice` `(768,960)`, `travel` `(768,1248)`, `race_broker` `(672,1152)`, NPC `tessa`, `sava`, `zara` |
| `cathedral` | Hub | `VILLAGE_ASC.cathedral` (`24×24`) | `drawVillageBackdrop` (`village-art.mjs`) | `environment.png`, `district_props.png` (riga 1), `interiors.png` | `smith` `(576,736)`, `vendor` `(960,736)`, `inn` `(768,544)`, `notice` `(768,960)`, `travel` `(768,1248)`, `race_broker` `(672,1152)`, NPC `ivo`, `dara`, `echo` |
| `toxic` | Hub | `VILLAGE_ASC.toxic` (`24×24`) | `drawVillageBackdrop` (`village-art.mjs`) | `environment.png`, `district_props.png` (riga 2), `interiors.png` | `smith` `(608,736)`, `vendor` `(928,736)`, `inn` `(768,544)`, `notice` `(768,960)`, `travel` `(768,1248)`, `race_broker` `(672,1152)`, NPC `bram`, `mira`, `sol` |
| `clockwork` | Hub | `VILLAGE_ASC.clockwork` (`24×24`) | `drawVillageBackdrop` (`village-art.mjs`) | `environment.png`, `district_props.png` (riga 3), `interiors.png` | `smith` `(576,736)`, `vendor` `(960,736)`, `inn` `(768,544)`, `notice` `(768,960)`, `travel` `(768,1248)`, `race_broker` `(672,1152)`, NPC `orn`, `vess`, `nilo` |
| `yard` | Missione (`blackout`) | Piazzale `18×19` + 4 isole `2×2` | `drawMissionScenery` (`scenery.mjs`) | `environment.png` (cella 0), `city.png`, `district_props.png` (riga 0), `car.png` | 3 relè `(288,800)`, `(800,288)`, `(1248,800)` + auto `VORTEX` |
| `elbow` | Missione (`breach`, `below`) | Condotto a L (`6×19` + `18×7`) | `drawMissionScenery` (`scenery.mjs`) | `environment.png` (cella 0), `port.png`, `district_props.png` (riga 1) | 3 ancore/nodi `(480,928)`, `(736,416)`, `(1312,416)` |
| `spine` | Esplorazione / Missione (`exp_chalk_marks`, `ascent`) | Asse centrale `8×20` + 3 traverse `14×5` | `drawMissionScenery` (`scenery.mjs`) | `environment.png` (cella 0), `port.png` / `fracture.png`, `district_props.png` | 2–3 punti d'accesso `(416,1248)`, `(1120,800)`, `(736,288)` |
| `arena` | Missione / Boss (`city`, `zero`, `line`, `finale`) | Anello circolare (`r < 10` tile) + 4 piloni `2×2` | `drawMissionScenery` (`scenery.mjs`) | `environment.png` (cella 0), `city.png` / `fracture.png`, `district_props.png` | 3 nodi `(352,800)`, `(800,352)`, `(1248,800)` + boss centrale `(800,608)` |
| `gallery` | Missione (`port`, `contagion`, `archive`) | Doppia navata `6×18` + ponte `19×8` | `drawMissionScenery` (`scenery.mjs`) | `environment.png` (cella 0), `port.png` / `clinic.png`, `district_props.png` | 3 camere/nodi `(352,352)`, `(800,736)`, `(1248,352)` |

---

## 4. Diagnosi Tecnica dei Difetti Preesistenti (Audit di Ripetizione §7 · `[FATTO]`)

### 4.1 Causa radice dei riquadri chiari a scacchiera nel lastricato (osservazione R5 su Blackout)
- **Ispezione diretta di `game/art/chrono/environment.png` (`512×512`, griglia `4×4` di celle `128×128`)**:
  - La **cella `0`** `(0, 0, 128, 128)` è l'unico tile di pavé scuro continuo progettato per la ripetizione stradale.
  - La **cella `1`** `(128, 0, 128, 128)` contiene una lastra quadrata con **bordi bianchi ad alto contrasto** e centro chiaro.
- **Errore nel codice R4 (`fa2fa94`)**: in `scenery.mjs`, il pavimento calpestabile veniva disegnato alternando la cella `1` ogni `(x + y) % 4 === 0` con opacità `0.88`. Poiché la cella `1` ha un bordo chiaro netto su fondo scuro, la formula `(x + y) % 4 === 0` generava una griglia diagonale di riquadri chiari a scacchiera su tutta l'area di combattimento, disturbando la lettura di proiettili e indicatori di mira.

### 4.2 Causa radice dello stesso palazzo ripetuto in missione (osservazione R5 su Blackout)
- **Ispezione diretta delle celle `8..11` di `environment.png` (righe 2 e 3)**:
  - Le celle `8, 9, 10, 11` **non sono texture di tetto componibili**, bensì **4 sprite di singoli edifici isometrici completi** (con tetto spiovente, facciata e ombra propria su sfondo trasparente).
- **Errore nel codice R4 (`fa2fa94`)**: `scenery.mjs` suddivideva tutti i muri non calpestabili (`!open(x, y)`) in blocchi `2×2` e stampava su ciascuno la cella `8` (`(8 + ((b + d) % 4))`), producendo fino a **30 copie identiche della stessa casetta isometrica** allineate in fila lungo i bordi di `Blackout` (`yard`) e sopra le 4 isole di copertura centrale.

### 4.3 Causa radice dello stiramento verticale nei margini fuori mappa (`390×844`)
- **Errore in `drawMapBackdrop` (`game/runtime.mjs`)**: quando il giocatore si trovava vicino al bordo sud della mappa (`y ≈ 1312`) su uno schermo verticale `390×844`, la telecamera inquadrava circa `260` px mondo oltre `y = 1536` (dietro lo stick virtuale e i pulsanti `SCHIVA`/`SPARA`). `drawMapBackdrop` prelevava una striscia di bordo alta `edge = 64 * scale` px e la stirava verticalmente fino a riempire l'intero margine inferiore, generando bande verticali di pixel deformati.

---

## 5. Matrice di Riferimento e Adattamento (§13 · Benchmark di Direzione Artistica)

| Riferimento | Principio Analizzato | Adattamento Concreto in *Chronos Adventure* (`1536×1536` top-down) | Cosa è stato Evitato |
| :--- | :--- | :--- | :--- |
| **Dead Cells** | Contrasto netto di valore e saturazione tra piano d'azione (scuro/desaturato) e silhouette/effetti di combattimento (saturi/luminosi). | Suolo calpestabile mantenuto in gamma valore `12%–26%` (asfalto bagnato/basalto inciso con cella `0` di `environment.png` a `alpha = 0.50`), lasciando massima leggibilità agli anelli d'attacco (`#ff765e`), ai proiettili (`#6bddff`, `#ff72d9`) e ai cerchi eroe. | Rumore ad alta frequenza o lastre chiare (`cella 1`) sul pavimento di combattimento. |
| **Hyper Light Drifter** | Geometria angolare pulita, landmark monumentali leggibili per silhouette cromatica e accenti al neon diegetici lungo i margini dei blocchi. | Cordoli perimetrali a doppio filetto con accento cromatico di distretto (`#5fd4ff`, `#ffb86b`, `#93ef6b`, `#d38bff`), corsie tratteggiate verso i relè/nodi e landmark centrali distintivi per ciascuna piazza d'hub. | Griglie wireframe astratte prive di massa architettonica. |
| **Hades** | Cornice architettonica densa e stratificata sui margini non calpestabili che inquadra un'arena centrale pulita e leggibile. | I grandi isolati perimetrali (`x < 4`, `x > 19`, `y < 4`, `y > 19`) espongono i 4 quadranti architettonici ricchi di `city.png`, `port.png`, `clinic.png`, `fracture.png`, mentre le isole tattiche interne (`2×2`) usano i 4 prop monumentali di `district_props.png`. | Ripetizione di singole casette isometriche (`celle 8..11`) come riempitivo dei muri. |
