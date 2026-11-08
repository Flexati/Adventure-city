# Misura e Stima Durata di Gioco — Per Sezione (TIER 1C)

**Stato:** `[FATTO]` Misurazione strumentata su 31 tappe (rotte A, B, C in browser `390×844` con clock virtuale a step di 130 ms) + verifica reale M3 Demo & Replay (`demo-m3-report.json`, 5/5 PASS).  
**Nota di integrità (Regola 3 CLAUDE.md):** `Sessioni umane registrate = 0` (`ESTIMATE_NOT_HUMAN`). I tempi per singola rotta e per sezione derivano dal cronometraggio strumentato (`tools/verify_campaign_browser.cjs` + `tools/estimate_playtime.mjs`).

---

## 1. Riepilogo per Macro-Sezione (Modello Probabile / Alto)

| Macro-Sezione | Tappe / Contenuto | Minimo | Probabile | Alto (Esplorazione / Retry) | Note |
| :--- | :--- | ---: | ---: | ---: | :--- |
| **1. Intro & Risveglio** | `opening` (Due colpi), `home` (Otto mesi dopo) | 0,6 min | **0,8 min** | 1,2 min | Cassa interattiva, raccolta vetro, dialogo rifugio |
| **2. Atto I · La Città al Buio** | `blackout` (Boss Rook), `escape` (Guida 1), `moon` (Hub 1) | 4,0 min | **5,4 min** | 7,8 min | Include primo boss (Rook) + scelta Officina/Rifugio + Field Kit Tessa |
| **3. Atto II · La Breccia (Fine Demo)** | `breach` (The Anchor), `signal`, `rooftop`, `cathedral`, `contagion`, `evacuation`, `zero` (Custode), `separation` (La firma) | 7,1 min | **9,6 min** | 13,5 min | La Demo (M3 / D20) termina dopo `separation` (~15,8 min probabile, ~22,5 min alto + hub/gare = **~28–35 min** sessione pretest) |
| **4. Atto III · Due Strade** | `exp_chalk_marks`, `below`, `city`, `ring`, `toxic`, `port`, `archive` (EVE-Prime), `tunnel`, `clockwork`, `line`, `ascent` | 14,1 min | **19,6 min** | 27,2 min | Percorsi divisi Nox/Lulù, stealth al porto, difesa autobus, 2 hub obbligatori |
| **5. Boss Finale & Scena Finale** | `reunion`, `finale` (Archon), `collapse`, `aftermath`, `rooftop_end`, `credits`, `postcredits` | 4,3 min | **6,5 min** | 8,7 min | Scontro con Archon, fuga dall'Asse, epilogo e scena post-credits (Kairn & Morrow) |
| **TOTALE SINGOLA ROTTA (A / B)** | **31 Tappe Obbligatorie** | **30,1–31,7 min** | **41,9–44,5 min** | **58,4–63,0 min** | Singola campagna lineare senza facoltativi |
| **6. Gare Veyra & Incarichi Hub (Facoltativi)** | 3 Gare Serie Ash Docks + 9 Sfide D17 (`tt`, `elim`, `rev`) + 8 Incarichi Hub + Segreti | 10,6 min | **13,4 min** | 17,0 min | Sbloccabili da Moon Refuge in poi con Nox |
| **7. «Gioca l'altra rotta» (D22 Replay)** | Seconda run completa con scelte opposte (mantenendo armi V9 e potenziamenti) | 30,1 min | **42,0 min** | 58,4 min | Porta il tempo complessivo per vedere entrambe le rotte + facoltativi a **~97–138 minuti (~120 min)** |

---

## 2. Tabella Dettagliata delle 31 Tappe (Rotta A — `390×844`)

| # | ID Tappa | Tipo | Combattimento (min) | Navigazione / Guida (min) | Extra Boss (min) | Lettura Dialoghi (min) | Passivo (min) | Totale Probabile (min) | Parole Lette | Avanzamenti UI |
| ---: | :--- | :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | `opening` | Scena + Cammino | 0,0 | 0,0 | 0,0 | 0,2 | 0,0 | **0,2** | 20 | 3 |
| 2 | `home` | Scena | 0,0 | 0,0 | 0,0 | 0,5 | 0,0 | **0,6** | 61 | 9 |
| 3 | `blackout` | Piedi + Boss Rook | 1,6 | 0,0 | 0,4 | 1,3 | 0,0 | **3,4** | 195 | 9 |
| 4 | `escape` | Guida 1 | 0,0 | 0,5 | 0,0 | 0,7 | 0,0 | **1,3** | 109 | 7 |
| 5 | `moon` | Hub 1 (Moon Refuge) | 0,0 | 0,1 | 0,0 | 0,5 | 0,1 | **0,7** | 67 | 6 |
| 6 | `breach` | Piedi + Boss Anchor | 0,9 | 0,0 | 0,2 | 0,6 | 0,0 | **1,7** | 79 | 7 |
| 7 | `signal` | Guida 2 | 0,0 | 0,6 | 0,0 | 0,4 | 0,0 | **1,0** | 64 | 4 |
| 8 | `rooftop` | Scena | 0,0 | 0,0 | 0,0 | 0,7 | 0,0 | **0,7** | 86 | 6 |
| 9 | `cathedral` | Hub 2 (Cathedral) | 0,0 | 0,1 | 0,0 | 0,4 | 0,0 | **0,5** | 49 | 4 |
| 10 | `contagion` | Piedi | 1,1 | 0,0 | 0,0 | 0,8 | 0,0 | **2,0** | 112 | 11 |
| 11 | `evacuation` | Guida 3 | 0,0 | 0,8 | 0,0 | 0,5 | 0,0 | **1,2** | 68 | 4 |
| 12 | `zero` | Piedi + Boss Custode | 1,1 | 0,0 | 0,3 | 0,4 | 0,1 | **1,9** | 62 | 4 |
| 13 | `separation` | Scena (Fine Demo) | 0,0 | 0,0 | 0,0 | 0,6 | 0,0 | **0,6** | 63 | 13 |
| 14 | `exp_chalk_marks` | Piedi (Segni di Gesso) | 0,9 | 0,0 | 0,0 | 1,0 | 0,0 | **1,9** | 129 | 10 |
| 15 | `below` | Piedi | 1,1 | 0,0 | 0,0 | 1,0 | 0,0 | **2,1** | 132 | 11 |
| 16 | `city` | Piedi (Difesa) | 1,2 | 0,0 | 0,0 | 0,5 | 0,0 | **1,8** | 76 | 5 |
| 17 | `ring` | Guida 4 | 0,0 | 0,7 | 0,0 | 0,5 | 0,0 | **1,2** | 74 | 4 |
| 18 | `toxic` | Hub 3 (Toxic Bazaar) | 0,0 | 0,9 | 0,0 | 0,4 | 0,0 | **1,3** | 57 | 4 |
| 19 | `port` | Piedi (Stealth) | 0,3 | 0,0 | 0,0 | 0,6 | 0,0 | **0,9** | 82 | 8 |
| 20 | `archive` | Piedi + Boss EVE | 0,9 | 0,0 | 0,2 | 1,1 | 0,0 | **2,3** | 150 | 12 |
| 21 | `tunnel` | Guida 5 | 0,0 | 0,6 | 0,0 | 0,5 | 0,0 | **1,1** | 73 | 4 |
| 22 | `clockwork` | Hub 4 (Clockwork) | 0,0 | 0,9 | 0,0 | 0,3 | 0,0 | **1,2** | 47 | 4 |
| 23 | `line` | Piedi (Difesa Autobus) | 2,9 | 0,0 | 0,0 | 1,1 | 0,0 | **4,0** | 158 | 9 |
| 24 | `ascent` | Piedi (Risalita) | 0,7 | 0,0 | 0,0 | 0,8 | 0,1 | **1,6** | 94 | 13 |
| 25 | `reunion` | Scena | 0,0 | 0,0 | 0,0 | 0,4 | 0,0 | **0,4** | 53 | 7 |
| 26 | `finale` | Piedi + Boss Archon | 1,0 | 0,0 | 0,3 | 1,0 | 0,0 | **2,3** | 126 | 14 |
| 27 | `collapse` | Fuga dall'Asse | 0,0 | 0,1 | 0,0 | 0,4 | 0,0 | **0,5** | 53 | 6 |
| 28 | `aftermath` | Scena | 0,0 | 0,0 | 0,0 | 1,4 | 0,0 | **1,4** | 184 | 21 |
| 29 | `rooftop_end` | Scena | 0,0 | 0,0 | 0,0 | 0,6 | 0,0 | **0,6** | 77 | 8 |
| 30 | `credits` | Titoli di coda | 0,0 | 0,0 | 0,0 | 0,3 | 0,0 | **0,4** | 43 | 4 |
| 31 | `postcredits` | Scena (Chrono Shadows) | 0,0 | 0,0 | 0,0 | 0,9 | 0,0 | **0,9** | 105 | 17 |

---

## 3. Diagnosi sul Target dei 120 Minuti

- **Singola rotta obbligatoria (senza facoltativi):** `41,9 min` (Rotta A) / `44,5 min` (Rotta B) nel modello probabile; fino a **`63,0 min`** nel modello alto (giocatore nuovo che esplora e riprova i boss).
- **Completamento completo (Rotta A + Gare Veyra/Sfide + Incarichi Hub + Seconda Rotta «Gioca l'altra rotta» D22):** **`97,2 – 138,4 minuti`** (mediana progettuale centrata sui **~115–120 minuti** complessivi di contenuti giocabili presenti nel build).
- **Conferma Umana:** In attesa delle prime 1–5 sessioni reali documentate tramite `docs/gold/PRETEST_KIT.md`.
