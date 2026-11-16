# CHRONOS ADVENTURE: NOX & LULÙ — COMPLETE GAMEPLAY AUDIT (FASE 3)

**Documento:** Audit Integrale del Gameplay (44 Tappe, 14 Villaggi, 9 Boss, 13 Armi, 10 Mosse, 7 Circuiti)  
**Metodo di Verifica:** Analisi statica di `game/*.mjs` + Simulazione deterministica `tools/audit_combat.mjs` (50 righe × 6 semi = 300 battaglie) + `tools/audit_races.mjs`  

---

## 1. ARCHITETTURA DELLA CAMPAGNA IN 4 ATTI (44 TAPPE TOTALI)

La campagna principale (`CAMPAIGN` in `game/missions.mjs`) comprende **44 tappe giocabili** distribuite su 4 Atti, alternate a 14 villaggi esplorabili (`HUBS` in `game/hubs.mjs`) e 6 tratte di guida narrativa (`DRIVING_MISSIONS` in `game/driving.mjs`):

| Atto | Titolo Atto | Tappe Chiave e Varietà di Gameplay | Protagonista | Boss dell'Atto |
| :--- | :--- | :--- | :--- | :--- |
| **ATTO I** | **LA CITTÀ AL BUIO** | `opening` (cassa in 1ª persona + passeggiata del vetro), `home` («Otto mesi dopo»), `blackout` (tutorial attivo + 3 relè + bivio Officina/Rifugio), `hub_moon` (Moon Refuge), `docks_veyra` (mappa dipinta al porto con Veyra alleata), `escape` (fuga in Vortex) | Nox & Lulù | **Rook** (`hp: 60`, mine di prossimità, mira laser triforcata, fase buia al 50%) |
| **ATTO II** | **LA BRECCIA** | `app_breach` (paratie corazzate 3D), `breach` (scontro con The Anchor), `hub_cathedral`, `bone_tyrant` (navata gotica), `app_clinic`, `contagion` (clinica + autenticazione `EVE-47` per i 19 civili), `hub_node`, `app_node`, `zero` (rottura del Duo + Custode del Nodo), `separation` («La firma») | Nox & Lulù | **The Anchor** (`hp: 112`, 3 cime d'ormeggio + spazzata), **Bone Tyrant** (`hp: 260`), **Custode del Nodo V-01** (`hp: 375`) |
| **ATTO III** | **DUE STRADE** | **Rotta di Lulù:** `lulu_tunnel` (guida al buio con impulsi), `app_yard`, `exp_yard` (difesa del cantiere con Kairn e Morrow), `hub_toxic`, `forge_behemoth`, `app_port`, `exp_chalk_marks` (furtività + difesa al porto), `glass_flood`, `glass_reaper`.<br>**Rotta di Nox:** `below` (Livelli bassi), `vega` (binario sopraelevato), `app_archive`, `archive` (duello adattivo con EVE-Prime), `truck_escape` (fuga sul camion sotto bombardamento droni). | Lulù (solitaria) / Nox (solitario) | **Forge Behemoth** (`hp: 265`), **Shadow Reaper** (`hp: 250`, miraggi), **Vega** (`hp: 210`, cadenza 3+1), **EVE-Prime** (`hp: 238`, guardia adattiva) |
| **ATTO IV** | **ORA UNO** | `reunion` (ricongiungimento e convergenza delle scelte), `promise` (scena sul motore e la promessa sul tetto), `hub_clockwork`, `line` (difesa dell'ultima evacuazione), `app_axis`, `ascent` (salita sull'Asse), `finale` (scontro a 3 fasi con Archon + scelta del consenso finale), `postcredits` (gancio *Chrono Shadows* + «Gioca l'altra rotta»). | Nox → Nox & Lulù riuniti | **Archon** (`hp: 575`, 3 fasi: *La Custode*, *La Città*, *Lia* + ingresso in corsa di Lulù in Fase 2) |

---

## 2. AUDIT DEI 9 BOSS DELLA PARTE I (`[MISURATO]` & `[SIMULAZIONE]`)

Ogni boss possiede una macchina a stati dedicata in `game/campaign.mjs`, una finestra di vulnerabilità leggibile e un tasso di vittoria verificato del **100% (6/6 semi)** sia per il profilo giocatore medio sia per il profilo giocatore debole (`tests/combat-audit.test.mjs`):

| # | Boss | Tappa | PV | Meccanica Distintiva e Punto Debole | Esito Bot (Medio / Debole) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Rook** | `blackout` | `60` | Mira laser che traccia per il 50% del windup e poi blocca; spara triplo ventaglio; piazza fino a 3 mine disinnescabili; spegne le luci al 50% PV. | `6/6` · `6/6` PASS |
| 2 | **The Anchor** | `breach` | `112` | Nucleo protetto da 3 cime d'ormeggio (`moor`). Tagliare tutte e 3 le cime espone il nucleo (`NUCLEO ESPOSTO`). L'`Onda di Risonanza` di Lulù recide una cima in un colpo. | `6/6` · `6/6` PASS |
| 3 | **Cathedral Bone Tyrant** | `bone_tyrant` | `260` | Alterna schianto d'area (`slam`), salva di proiettili (`volley`) e carica (`charge`) tra le colonne della navata; espone `weakExposed` per `1,6 s` nel recupero. | `6/6` · `6/6` PASS |
| 4 | **Custode del Nodo V-01** | `zero` | `375` | Scontro a 3 fasi nel Nodo Centrale dopo la desincronizzazione del Duo; rilascia il risonatore Eden che sblocca l'`ARC-7 Choir`. | `6/6` · `6/6` PASS |
| 5 | **Toxic Forge Behemoth** | `forge_behemoth` | `265` | Arena a croce sopra l'acido della fonderia; lancia pozze di scoria incandescente (`behemothSlag`) e cariche pesanti; espone il nucleo termico in recupero (`1,6 s`). | `6/6` · `6/6` PASS |
| 6 | **Shadow Reaper** | `glass_reaper` | `250` | Teletrasporto con copie d'ombra (`reaperMirage`): i cerchi tratteggiati mostrano i colpi probabili, ma al 55% del windup solo il colpo reale diventa continuo. | `6/6` · `6/6` PASS |
| 7 | **Vega** | `vega` | `210` | Cecchina del binario sopraelevato (`vegaTempo`): 3 colpi cadenzati ogni `0,42 s` + quarto colpo perforante ad alta velocità (`540 px/s`), dopo il quale espone il punto debole (`1,6 s`). | `6/6` · `6/6` PASS |
| 8 | **EVE-Prime** | `archive` | `238` | Boss speculare a Nox (`mirror`): se il giocatore usa 8 colpi consecutivi d'arma da fuoco (`recent.every(k=>k==='gun')`), EVE alza la guardia (`PREVEDIBILE`), costringendo a usare schivata perfetta o impulso. | `6/6` · `6/6` PASS |
| 9 | **Archon** | `finale` | `575` | Scontro finale in 3 fasi sull'Asse: in Fase 1 proietta salve dai nodi perimetrali; in Fase 2 Lulù irrompe nell'arena riattivando il `DUO`; in Fase 3 emergono i frammenti di memoria di Lia fino al consenso finale. | `6/6` · `6/6` PASS |

---

## 3. AUDIT DELL'ARSENALE, DELLE MOSSE E DELL'ECONOMIA (`game/weapons-v9.mjs`, `game/arsenal-data.mjs`)

### 3.1 Le 5 Armi di Campagna + 13 Armi di Mercato Regionale
- **Armi di Serie e Ricompense Boss (5):**
  1. `C-9 Service` (pistola d'ordinanza con colpo rapido *Quickdraw* dopo schivata grazie al pezzo di Rook).
  2. `VX-9 Burst` (raffica da 3 colpi per Nox dal banco di Tessa).
  3. `R-12 Scatter` (doppietta a rosata ravvicinata per Lulù dal banco di Tessa).
  4. `ARC-7 Choir` (arco elettrico a catena per Lulù dal Custode del Nodo in `zero`).
  5. `H-17 Needle` (fucile magnetico perforante per Nox combinando l'ago di *The Anchor* e il calibratore dell'*Archivio* / *Vega*).
- **Armi di Mercato nei 14 Villaggi (13):** `mg_tempest`, `mg_vulcan`, `mg_helix`, `mg_shredder`, `orb_nova`, `orb_void`, `plasma_carbine`, `scatter_flak`, `rail_lance`, `arc_tesla`, `flame_pyre`, `cryo_shard`, `sniper_chronos`.
  - **[SIMULAZIONE] Equilibrio verificato (`tools/probe_arsenal_r22.mjs`):** Le armi di mercato migliorano i tempi di pulizia tra il **5% e il 30%** rispetto alle armi di serie senza mai banalizzare i boss.

### 3.2 Le 10 Mosse Eroe (5 per Nox, 5 per Lulù)
- **Nox:** `Impulso Chrono` (Atto I), `Sfera d'Energia Oscura` (Atto II), `Tempesta di Zero` (Atto III), `Fendente Cinetico` (Atto III), `Singolarità dell'Asse` (sbloccata in `app_axis`, così è utilizzabile già prima del boss finale).
- **Lulù:** `Onda di Risonanza` (Atto I), `Sfera Armonica` (Atto II), `Cupola d'Égida` (Atto III), `Campo di Stasi` (Atto III), `Coro Supernova` (sbloccata da `vega` grazie al campo `early: 'vega'`, garantendo l'uso attivo in campagna).

### 3.3 Economia dei 14 Villaggi
- **[MISURATO]** Bottino medio di una singola campagna completa: `~670 monete` più scambio rottami (`2 rottami = 1 moneta`) e rivendita al `60%`, a fronte di un catalogo complessivo di `1.485 monete` distribuito su 37 botteghe in 14 villaggi.
- **Impatto sul Design:** Il giocatore può permettersi **3–5 acquisti strategici mirati** per giro (oltre a medkit e potenziamenti base), rendendo ogni acquisto significativo e incentivando una seconda partita tramite «Gioca l'altra rotta».

---

## 4. AUDIT DEL CAMPIONATO DI VEYRA E DEI 5 STADI TURBO (`game/racing-v9.mjs`)

- **7 Circuiti Principali + Modalità Sfida (27 configurazioni nel Race Lab):** *Ash Docks*, *Precision*, *Night*, *Solkara Sand*, *Storm*, *Aurelia Bridges*, *Veyra Duel*, ciascuno con varianti *Contro il tempo* (medaglie oro/argento/bronzo), *Eliminazione* (4 auto, l'ultima esce a ogni checkpoint con avviso `ULTIMO: SUPERA O ESCI`) e *Rivincita* (percorso specchiato).
- **5 Stadi di Turbo (`TURBO_TIERS`):** Dal `MK I · Iniettore Base` (2 scarichi, costo nitro 50%) fino al `MK V · Overdrive Quantistico` (`+115` velocità massima, `3,8 s` di durata, 4 scarichi Chrono, costo nitro 30%, tenuta in curva `+65%`), tutti verificati con auto-pilota su ogni circuito in `tests/arsenal-review-r23.test.mjs`.
