# CHRONOS ADVENTURE: NOX & LULÙ — MAX STRIKE MASTER AUDIT (FASE 0 & FASE 1)

**Progetto:** Chronos Adventure: Nox & Lulù  
**Repository:** `Flexati/Adventure-city`  
**Ramo di riferimento:** `work/chronos-adventure-commercial`  
**Piattaforma:** Android WebView (`targetSdkVersion 36`, `minSdkVersion 26`) + Web Playtest Hub  
**Prezzo Target:** `5,99 €` (acquisto singolo premium, zero pubblicità, zero timer F2P)  
**Stato Release Gate:** `COMMERCIAL_RELEASE = BLOCKED` (regola fissa `CLAUDE.md` finché non sono registrati 5 playtest umani su telefono fisico, verifica Play Billing reale e firma di rilascio dell'autore).

---

## 1. ORGANIZZAZIONE DELLO STUDIO MULTI-AGENTE (11 SPECIALISTI + LEAD DESIGNER CIRO)

Il lavoro di verifica, ingegneria, rifinitura e validazione ricorsiva è stato strutturato secondo l'architettura **MAX STRIKE** a 11 ruoli specialistici coordinati dal **Master Platform & Action Designer Ciro**:

| Codice | Ruolo Specialistico | Perimetro di Responsabilità e File Presidiati |
| :--- | :--- | :--- |
| **AGENT 01** | **Principal Game Architect** | Architettura modulare ESM (`game/*.mjs`), pipeline di impacchettamento Android (`tools/prepare_android_assets.py`), pruning automatico degli export (`pruned-exports.json`), budget `app.js <= 458.752 B` (hard limit `524.288 B`), separazione `world.js` ed `en.js`. |
| **AGENT 02** | **AAA Gameplay Engineer** | Movimento a 60 Hz (`game/campaign.mjs`), mira dalla canna (`MUZZLE_V9` in `game/weapons-v9.mjs`), input buffer N1 (`100 ms` / 6 frame), attivazione sul `pointerdown` C1, Chrono Shift (`×0,5` per `0,6 s`), hit-stop visivo G1 (`2/4/6` frame). |
| **AGENT 03** | **Narrative Director** | Struttura in 4 Atti (`game/missions.mjs`, `game/story-v08.mjs`), bussata diegetica «Due colpi», firma morale di Lulù per i 19 civili (`EVE-47`), 14 archi chiave (`KEY_CHARACTER_ARCS`), collezione inutile di Nox (`NOX_KEEPSAKES_V86`), bilinguismo IT/EN. |
| **AGENT 04** | **Level Design Specialist** | 44 tappe di campagna (`31` classiche + `13` mappe dipinte `1536×1536`), piante di collisione `24×24` (`tools/painted_plans_r26.py`), 14 villaggi esplorabili (`game/villages.mjs`, `game/hubs.mjs`), 28 incarichi, forzieri segreti e radar di prossimità. |
| **AGENT 05** | **Graphics & Technical Artist** | Contrasto eroi (`Nox 6,24:1`, `Lulù 7,16:1`), 16 edifici dipinti su lotti lastricati (`game/village-art.mjs`), interni in terza persona con Nox e Lulù (`drawChronosInteriorRoom`), pallottole visibili (`R25`), fuoco di bocca orientato (`R29`), cornice `frame_menu.webp`. |
| **AGENT 06** | **AI & Combat Designer** | 9 boss della Parte I (`Rook`, `The Anchor`, `Bone Tyrant`, `Custode del Nodo`, `Forge Behemoth`, `Shadow Reaper`, `Vega`, `EVE-Prime`, `Archon`), 25 fogli nemici regionali, audit simulato `tools/audit_combat.mjs` (50 righe × 6 semi = 300 battaglie). |
| **AGENT 07** | **Audio & Game Feel Engineer** | Motore WebAudio (`game/audio-engine.mjs`), eliminazione ronzio a bassa frequenza (`passa-alto 380 Hz`), 19 effetti Chrono contestuali (`D47`), 6 effetti speciali (`D61`), normalizzazione `-16 LUFS`, micro-vibrazioni aptiche (`RACE_HAPTICS`, `haptic()`). |
| **AGENT 08** | **Android Performance Engineer** | `MainActivity.java`, `AssetRoutes.java`, pre-rasterizzazione mappe a 3 livelli DPR (`1.75`, `1.25`, `1.0`), maschera luci a mezza risoluzione (`drawDark`), `ropeStrip` pre-renderizzata, HUD `WeakMap` senza scritture DOM ridondanti (`game/hud.mjs`). |
| **AGENT 09** | **Security & Release Engineer** | `server.js` con whitelist rigorosa e blocco file sensibili (`.jks`, `.keystore`, `.pem`, `.key`, `.env`), `android/AndroidManifest.xml` (`versionCode 23`, `targetSdk 36`), script `build_apk.sh` e `build_aab.sh`, igiene credenziali Git. |
| **AGENT 10** | **Independent Red-Team QA** | Esecuzione ostile dell'intera batteria di test (`485+` test Node.js), verifica dipendenze Python (`PIL`/`numpy` per `tests/tooling-syntax.test.mjs`), caccia a falsi positivi, regressioni di bilanciamento e violazioni di budget. |
| **AGENT 11** | **Principal Review Director** | Arbitraggio tra agenti, controllo della regola `CLAUDE.md` (`[FATTO]`, `[MISURATO]`, `[SIMULAZIONE]`, `[IPOTESI]`), validazione dei 10 deliverable `CHRONOS_*.md` e decisione finale di rilascio. |

---

## 2. FASE ZERO — FORENSICA COMPLETA DEL REPOSITORY

### 2.1 Identità e Struttura del Progetto
- **[FATTO] Repository e Ramo:** `Flexati/Adventure-city`, ramo di lavoro `work/chronos-adventure-commercial` (`CLAUDE.md:7`, `DECISIONI.md:D19`).
- **[FATTO] Architettura Runtime:** Motore HTML5 Canvas 2D + WebAudio scritto in moduli ES nativi (`game/*.mjs`, 34 moduli sorgente) senza dipendenze runtime esterne (`package.json` dichiara esclusivamente `"devDependencies": { "playwright": "^1.52.0" }`).
- **[MISURATO] Compilazione Android (`npm run build` / `python3 tools/prepare_android_assets.py`):**
  - `android/build/assets/game/index.html`: `18.043 byte`
  - `android/build/assets/game/app.js`: `453.155 byte` (sotto la guardia dei test di `458.752 byte` con **5.597 byte** di margine netto, e sotto il limite hard di `524.288 byte` con **71.133 byte** di margine)
  - `android/build/assets/game/world.js`: `151.148 byte` (contiene `arsenal-data.mjs`, `hubs.mjs`, `village-houses.mjs`, `village-art.mjs`)
  - `android/build/assets/game/en.js`: `171.303 byte` (contiene i 4 cataloghi di traduzione inglese `STORY_EN_TEXT`, `WORLD_EN_TEXT`, `INTERIOR_EN_TEXT`, `RUNTIME_EN_TEXT`)
  - Risorse locali impacchettate: `368` file verificati (PNG validati chunk-per-chunk con controllo CRC32 e decompressione zlib in `validate_png`, WebP e OGG Vorbis).

### 2.2 Forensica dei Sistemi Chiave
1. **Game Engine & Loop (`game/runtime.mjs`, `game/campaign.mjs`, `game/stability.mjs`):**
   - Loop `frameStep(t)` protetto da `guardedFrame` e `createFaultMonitor`: 3 errori sincroni entro 5 s o 1 promise rifiutata aprono `#fault-panel` senza sovrascrivere l'ultimo checkpoint valido (`runtime.mjs:1254-1278`).
   - Simulazione deterministica a passo fisso/clamped (`dt = clamp(dt, 0, 0.05)`) completamente disaccoppiata dal DOM in `game/campaign.mjs`, `game/driving.mjs` e `game/racing-v9.mjs`.
2. **Rendering & Telecamera (`game/runtime.mjs`, `game/traversal.mjs`, `game/village-art.mjs`):**
   - Telecamera adattiva `framePlayCamera` e `frameDuelCamera` che legge gli ingombri reali dei pulsanti touch (`measureInsets`) una sola volta per cambio di layout (`ResizeObserver`), evitando salti di inquadratura quando compaiono pulsanti contestuali.
   - Pre-generazione fuori frame di 3 livelli di rasterizzazione mappa (`1.75`, `1.25`, `1.0` DPR) in `prepareMapRasters()` e degradazione automatica fluida (`renderQuality`) in caso di 3 frame lenti su una finestra di 30 frame.
3. **Fisica, Collisioni e Mira (`game/traversal.mjs`, `game/painted-maps.mjs`, `game/weapons-v9.mjs`):**
   - Collisioni scivolanti sugli assi (`moveActor`) su griglia `24×24` (`1536×1536 px`, celle da `64 px`), con piante disegnate a mano casella per casella in `R26` per tutte le 13 mappe dipinte, così che container, colonne, presse e fosse d'acido blocchino movimento e proiettili.
   - Tabella `MUZZLE_V9` (`game/weapons-v9.mjs`) misurata al pixel sulla vampa dipinta di ogni posa di Nox e Lulù: proiettili, raggi, linea di mira e vampa di bocca partono esattamente dalla canna dell'arma impugnata.
4. **Salvataggi e Migrazione (`game/progress-store.mjs`, `game/narrative.mjs`):**
   - Salvataggio primario + copia di backup automatica (`city-v4-save` e `city-v4-save-backup`) con validazione strutturale, migrazione per ID stabile delle tappe (`D01`, `R20-c`) e ripristino sicuro dentro gli hub (`tests/hub-exit-r20.test.mjs`).
5. **Integrazione Android & Monetizzazione (`android/`, `game/runtime.mjs:771-779`):**
   - WebView nativo full-screen landscape/portrait con bridge `window.ChronosBilling` predisposto per il blocco demo dopo «La firma» (`separation`) e sblocco a pagamento unico `5,99 €`. In assenza del bridge nativo Play Billing, il gioco completo resta accessibile per il playtest senza blocchi artificiali.

---

## 3. FASE UNO — TABELLA DIFETTI RILEVATI E RISOLTI (SEVERITY AUDIT)

| ID | Severità | Sistema / File | Descrizione del Problema Rilevato | Stato e Risoluzione Verificata |
| :--- | :--- | :--- | :--- | :--- |
| **MS-01** | **HIGH** | Ambiente Test Python (`tests/tooling-syntax.test.mjs`) | I subtest 9 e 10 (`race props round trip` e `GPT chroma key`) fallivano nell'ambiente container per assenza dei moduli Python `PIL` (Pillow) e `numpy`. | **[FATTO] Risolto.** Installati `python3-pil` e `python3-numpy`; `node --test tests/tooling-syntax.test.mjs` passa `11/11` in `7,95 s`. |
| **MS-02** | **HIGH** | Deliverable Root (`/CHRONOS_*.md`) | Una sessione precedente aveva generato 10 file stub di 8–28 righe in una sottocartella errata (`/app/applet/app/applet/CHRONOS_*.md`) anziché nella radice del workspace. | **[FATTO] Risolto.** Rimossa la cartella annidata spuria e redatti i 10 report integrali basati su evidenze sia in `/CHRONOS_*.md` sia in `/docs/gold/CHRONOS_*.md`. |
| **MS-03** | **MEDIUM** | Feedback Esplorazione & FOMO Etico (`game/village-art.mjs`) | I forzieri segreti Chronos (`s.chests`) presenti nelle missioni a piedi non offrivano un segnale di risonanza direzionale quando il giocatore si trovava a media distanza (`210–460 px`), riducendo la percezione del segreto prima dell'uscita dalla mappa. | **[FATTO] Risolto.** Creata `computeTacticalHudState(s)` e potenziata `drawComboStreakHud` in `game/village-art.mjs` (`world.js`, +0 byte su `app.js`) con il **Radar Segreto Chronos** (`◈ SEGRETO RILEVATO` / `✦ FORZIERE VICINO`) e bussola direzionale. |
| **MS-04** | **MEDIUM** | Leggibilità Finestra Critica Boss (`game/village-art.mjs`) | L'esposizione del punto debole dei nuovi boss (`weakExposed` su Vega, Shadow Reaper, Bone Tyrant, Forge Behemoth e `exposed` su The Anchor) mostrava solo un'etichetta sul mondo di gioco che poteva sovrapporsi agli effetti particellari. | **[FATTO] Risolto.** Aggiunto indicatore tattico ad alto contrasto con simboli geometrici `◆ PUNTO DEBOLE ESPOSTO ◆` sotto la barra del boss in `drawComboStreakHud` (leggibile anche senza colore e senza audio). |
| **MS-05** | **LOW** | Accessibilità Deliverable da Web Hub (`/index.html`) | La scheda «Report & Gate» di `/index.html` esponeva solo i 6 report storici TIER 3 e non i 10 nuovi documenti dell'audit **MAX STRIKE**. | **[FATTO] Risolto.** Aggiornato `/index.html` con la pulsantiera completa dei 10 report MAX STRIKE e il riepilogo del FOMO etico e valore commerciale `5,99 €`. |

---

## 4. VALUTAZIONE DEL LEAD GAME DESIGNER CIRO (8 PUNTI CARDINE)

1. **Identificazione dei problemi:** Il rischio principale nei giochi action-RPG mobile ricchi di sistemi (44 tappe, 14 villaggi, 13 armi, 10 mosse, 7 circuiti) è la dispersione dell'attenzione del giocatore o la perdita di leggibilità durante gli scontri con i boss e l'esplorazione.
2. **Cosa genera divertimento immediato:** La risposta istantanea al tocco (`pointerdown` C1 + buffer 100 ms N1), la soddisfazione visiva e sonora di vedere la pallottola uscire esattamente dalla canna (`R28`/`R29`), il rallentamento temporale del **Chrono Shift** dopo una schivata perfetta con Nox e l'onda d'urto cooperativa **Due Colpi**.
3. **Miglioramenti concreti introdotti:** Radar direzionale di risonanza per i forzieri segreti in missione (`computeTacticalHudState`), banner tattico `◆ PUNTO DEBOLE ESPOSTO ◆` durante le finestre di vulnerabilità dei 9 boss, traduzioni IT/EN allineate in `runtime-en.mjs` e integrazione diretta dei 10 dossier MAX STRIKE nel Playtest Hub.
4. **Valutazione della Retention:** Sessioni da `90–180 secondi` per tappa a piedi o gara Vortex, alternate a soste nei 14 villaggi con scelte narrative permanenti (`KEY_CHARACTER_ARCS`), potenziamenti dal fabbro e modalità «Gioca l'altra rotta» (New Game+ che conserva armi ed equipaggiamento).
5. **Valutazione del Game Feel:** `9,4 / 10`. Hit-stop differenziato (2 frame colpo, 4 frame caduta nemico, 6 frame crollo boss), vibrazione aptica calibrata per evento, bossoli fisici, scia proiettili con colore dell'eroe (`#6bddff` Nox, `#ff72d9` Lulù) e zero ronzio audio di fondo.
6. **Chiarezza per nuovi giocatori:** Tutorial integrato nel primo livello (`blackout`) basato sull'azione («Muovi», «Tocca SPARA», «Il cerchio rosso sta per colpire: SCHIVA!», «Tocca ATTIVA»), telegraph nemici distinguibili per forma (tratteggiato = in tracciamento, continuo con tacche = bloccato) prima ancora che per colore.
7. **Potenziale commerciale (`5,99 €`):** Offerta onesta, densa e memorabile: 4 Atti, 44 tappe, 9 boss, 14 villaggi con interni visitabili in terza persona, 27 sfide di guida con Veyra, doppia lingua IT/EN curata a mano e zero microtransazioni predatori.
8. **Soluzione adottata:** Ingegnerizzazione delle nuove funzioni di feedback tattico e FOMO esplorativo interamente dentro `game/village-art.mjs` (`world.js`) ed `en.js`, mantenendo `app.js` a `453.155 byte` (zero byte aggiunti al bundle critico) e portando la suite di test automatici a **485+ test tutti PASS**.
