# CHRONOS ADVENTURE: NOX & LULÙ — TIER 3 COMMERCIAL GOLD MASTER REPORT (FASE 1–8)

**Repository:** `Flexati/Adventure-city`  
**Ramo:** `work/chronos-adventure-commercial`  
**Prezzo di riferimento:** `5,99 €` (acquisto unico, Demo gratuita fino a «La firma»)  
**Data consegna:** 8 novembre 2026  
**Stato Release:** **`COMMERCIAL_RELEASE = BLOCKED` (`RELEASE READY = NO`, `0` sessioni umane documentate)**  

---

## 1. FASE 1 — Audit Reale del Gioco (Codice vs Documentazione vs Build)

L'ispezione diretta dei file di runtime (`game/`), dei test (`tests/`), degli script di verifica (`tools/`) e dei pacchetti Android (`dist/`) ha separato con precisione ciò che è **realmente giocabile oggi** da ciò che esiste in **staging o documentazione progettuale**:

| Area | Stato Reale nel Runtime (`[MISURATO]`) | Stato nei Documenti / Staging | Differenza e Valutazione Onesta |
| :--- | :--- | :--- | :--- |
| **Campagna principale** | **31 tappe giocabili dall'inizio ai titoli (`CAMPAIGN` in `game/missions.mjs`)**: 12 missioni a piedi (`FOOT`), 5 missioni di guida narrativa (`DRIVE`), 4 villaggi esplorabili (`HUBS`), 10 scene narrative/interattive (`opening`, `home`, `tunnel`, `roof`, `eve`, `collapse`, `separation`, `radio`, `reunion`, `door`, `dawn`). | 31 tappe documentate. | **Allineato al 100%.** Tutte le 31 tappe sono attraversabili senza blocchi e salvate con ID stabili (`version: 7, canon: 8`). |
| **Regioni e Quartieri (4 su 9 come Hub liberi)** | **4 villaggi 24×24 liberamente esplorabili a piedi (`game/villages.mjs`, `game/hubs.mjs`)**: `Moon Refuge` (`Old Town`), `Cathedral Quarter`, `Toxic Slum Bazaar`, `Clockwork Outpost`, ciascuno con edifici calpestabili, porte con freccia `ENTRA`, ritratti in prima persona (`game/interiors.mjs`), 2 incarichi, 1 segreto, negozi, fabbro e gare. | 9 regioni previste nella visione espansa (`D24`, `D35`). | **Parziale dichiarato (`4/9` come hub liberi):** le altre 5 regioni (`Ash Docks`, `Solkara`, `Aurelia Span`, `Helios`, `Vanta Axis`) sono presenti come tracciati di gara, arene di combattimento o sfondi narrativi, ma non come villaggi free-roam autonomi. |
| **Boss (5 in campagna + 4 v2 in staging su 17)** | **5 boss affrontabili nella campagna (`game/campaign.mjs`)**: `Rook` (`blackout`), `The Anchor` (`breach`), `Il Custode V-01` (`zero`), `EVE-Prime / Mirror` (`archive`), `Archon · La Custode` (`finale`). | **4 fogli boss v2 `2560×1280` `TECHNICALLY_VERIFIED` (`M6`)** in `assets/production/v10.3/derived/` (`bone_tyrant`, `forge_behemoth`, `shadow_reaper`, `vega`) + 8 incontri rinviati agli aggiornamenti post-lancio (`D24`). | **Separazione netta e trasparente:** i 5 boss della campagna hanno IA e meccaniche proprie; i 4 boss v2 hanno gli sprite verificati ma restano in staging (`tests/chrono-art.test.mjs`) finché non avranno pattern d'attacco dedicati (`D23`). |
| **Gare Veyra (`7` base + `20` varianti = `27` eventi)** | **Tutte le 7 gare base e le 20 sfide (`tt`, `elim`, `rev`) sono implementate in `game/racing-v9.mjs`** con nitro, scia, gru oscillanti, sbarramenti e chiazze d'olio (`D15`, `D17`). Negli hub della prima partita sono accessibili i **3 tracciati di `Ash Docks` (`3` gare base + `9` sfide Vortex = `12` eventi)**. | I 4 tracciati post-ricongiungimento (`solkara_01`, `solkara_02`, `aurelia_01`, `veyra_duel`) sono giocabili in `v9-race-lab` e bloccati negli hub finché non esisteranno le regioni corrispondenti (`D05`). | **Documentato in `D05`:** le 12 gare/sfide di `Ash Docks` sono giocabili e remunerate negli hub della campagna; le altre 15 sono nel motore ma non esposte negli hub di Vanta. |
| **Armi V9 (`5` armi + `Quickdraw`)** | **Tutte e 5 le armi (`C-9`, `VX-9`, `R-12`, `H-17 Needle`, `ARC-7 Choir`) + `Quickdraw` sono ora sbloccabili nella campagna** dopo la correzione di **FASE 6**. | Prima di FASE 6, `H-17 Needle` e `ARC-7 Choir` erano raggiungibili solo in `v9-combat-lab`. | **Risolto in FASE 6 (`D42`):** ora la campagna sblocca l'intero arsenale V9 (`VX-9`/`R-12` dopo `blackout`, `ARC-7 Choir` dopo `zero`, `H-17 Needle` dopo `archive`). |
| **Durata di gioco** | **`48,9 min` `[MISURATO]`** col bot automatico veloce (`CITY_VIRTUAL_TIME=0`); **`85,7 min` `[STIMATO]`** (`61,0–118,5 min`) per una prima partita umana con i 4 hub e le 7 gare base; **`> 135 min` `[STIMATO]`** includendo le sfide Vortex e «Gioca l'altra rotta» (`D22`). | 120 minuti richiesti dal mandato commerciale; `0` sessioni umane misurate. | **Onestà sui numeri:** la singola run lineare dura ~`85,7 min` `[STIMATO]` (non 120 min), e supera i 120 min solo con le sfide secondarie e la seconda rotta (`D22`). Nessun timer è stato gonfiato artificialmente. |

---

## 2. Lista dei Problemi Individuati Ordinata per Gravità (FASE 1 & FASE 6)

| Priorità | Gravità | Problema | Area | Stato dopo FASE 6 |
| :-: | :---: | :--- | :--- | :--- |
| **1** | **CRITICA (Esterna)** | **`0` sessioni di playtest umano documentate e `0` test su smartphone Android fisico (`M1`).** | QA Umano / Hardware | **PROTOCOLLO PRONTO (`docs/gold/HUMAN_PLAYTEST_PROTOCOL.md`) — DIPENDENZA ESTERNA DICHIARATA.** |
| **2** | **ALTA (Gameplay)** | **`H-17 Needle` (Nox) e `ARC-7 Choir` (Lulù) non si sbloccavano mai nella campagna:** `campaignArsenalV9` (`game/weapons-v9.mjs:64`) ometteva `eden_technology` e `game/runtime.mjs:192` non assegnava mai `weapon.eden_technology` né `weapon.vega_component`. | Progressione / Combattimento | **RISOLTO IN CODICE (`game/weapons-v9.mjs`, `game/runtime.mjs`, `game/runtime-en.mjs`, `tests/weapons-v9.test.mjs`).** |
| **3** | **MEDIA (Ritmo)** | **Tempi morti (`Attesa %`) nelle missioni di difesa (`city`, `line`, `exp_chalk_marks`):** quando il giocatore puliva in anticipo un'ondata, la barra `s.progress` continuava a salire senza bonus durante l'attesa dell'ondata successiva. | Ritmo / Level Design | **RISOLTO IN CODICE (`game/campaign.mjs:359`):** `s.progress` avanza a **`×1,25`** quando la zona è presidiata e non restano nemici vivi dell'ondata corrente. |
| **4** | **MEDIA (Store / Nativo)** | **Ponte Google Play Billing (`M4`) e firma di caricamento (`M5`) non attivi nel guscio Android locale.** | Commercializzazione | **CONTRATTO JS VERIFICATO (`qa:demo` 5/5 PASS) — RICHIEDE CHIAVE E PLAY CONSOLE DELL'AUTORE.** |
| **5** | **MEDIA (Contenuto)** | **4 boss v2 (`M6`) verificati tecnicamente ma in staging fuori dal runtime; 4 tracciati Veyra post-ricongiungimento non collegati agli hub.** | Contenuto / Scope | **DOCUMENTATO (`D05`, `D23`, `D30`):** mantenuti in staging per non introdurre boss cloni senza pattern dedicati. |

---

## 3. Sintesi delle Fasi 2, 3, 4, 5 e 7 (Rimandi ai Documenti Gold)

1. **FASE 2 — Analisi del Ritmo e del Gameplay:** documentata integralmente in [`docs/gold/GAMEPLAY_RHYTHM_AUDIT.md`](GAMEPLAY_RHYTHM_AUDIT.md) (tabella delle 31 tappe con durate `[MISURATO]` e `[STIMATO]`, percentuali Esplorazione / Combattimento / Guida / Dialogo / Attesa, curva di intensità Atto I–III e correzioni dei tempi morti).
2. **FASE 3 — Equilibrio e Difficoltà:** documentata in [`docs/gold/DIFFICULTY_BALANCE_AUDIT.md`](DIFFICULTY_BALANCE_AUDIT.md) (statistiche di Nox e Lulù, finestre di schivata e Chrono Shift, confronto DPS/utilità delle 5 armi V9, analisi dei 5 boss giocabili, economia delle monete/componenti nei 4 hub e checkpoint).
3. **FASE 4 — Protocollo e Risultati dei Test Umani:** protocollo operativo per 5–10 tester indipendenti in [`docs/gold/HUMAN_PLAYTEST_PROTOCOL.md`](HUMAN_PLAYTEST_PROTOCOL.md) e registro onesto (`0` sessioni umane) in [`docs/gold/HUMAN_PLAYTEST_RESULTS.md`](HUMAN_PLAYTEST_RESULTS.md).
4. **FASE 5 — Analisi del Coinvolgimento (12 Aree):** scorecard dettagliata in [`docs/gold/HUMAN_PLAYTEST_RESULTS.md`](HUMAN_PLAYTEST_RESULTS.md) con media tecnica/design di **`8,53 / 10`** e distinzione rigorosa tra `[MISURATO]`, `[OSSERVATO]`, `[STIMATO]`, `[IPOTIZZATO]` e `[NON VERIFICATO]`.
5. **FASE 7 — Release Gate:** checklist finale in [`docs/gold/RELEASE_GATE.md`](RELEASE_GATE.md) con stato `COMMERCIAL_RELEASE = BLOCKED` fino al completamento delle 5 sessioni umane, del test su telefono fisico (`M1`), del Billing reale (`M4`) e della firma Play definitiva (`M5`).

---

## 4. Verifiche Tecniche Eseguite dopo le Correzioni di FASE 6

- **Suite unitaria e di integrazione (`npm test`):** **`329 / 329 PASS`** (`0` errori).
- **Bundle Android (`python3 tools/prepare_android_assets.py`):** `app.js` verificato con margine libero superiore a `64 KiB` (`65.536` byte) rispetto al tetto di `524.288` byte.
- **Pacchetti Android API 36 rigenerati:**
  - `dist/Chronos_Adventure_Nox_Lulu_debug.apk` (firmato v2+v3 per il playtest umano di FASE 4);
  - `dist/chronos-adventure-release.aab` (`compileSdk 36`, `targetSdk 36`, `versionCode 2`, `1.0.0`, validato con `bundletool validate`).
