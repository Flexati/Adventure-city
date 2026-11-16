# CHRONOS ADVENTURE: NOX & LULÙ — FINAL REGRESSION & VERIFICATION REPORT (FASE 8)

**Documento:** Rapporto Finale di Regressione su Suite Unitaria, Simulazione di Combattimento, Gare, Tooling Python e Browser QA  
**Comando Principale:** `npm run build && npm run lint && npm test`  

---

## 1. RIEPILOGO ESECUZIONE TEST AUTOMATICI (`[MISURATO]`)

L'intera batteria di test Node.js (`tests/*.test.mjs`) è stata eseguita senza esclusioni né riduzioni (`D34`):

| Categoria di Test | File di Test Principali | Risultato | Dettaglio Evidenza |
| :--- | :--- | :--- | :--- |
| **Architettura, Guida e Regole Fisse** | `tests/claude-guide.test.mjs`, `tests/bundle-prune-r19.test.mjs`, `tests/bundle-weight.test.mjs` | **PASS (100%)** | Tutti i 40+ percorsi di `CLAUDE.md` esistono; `D73` citata in testa a `STATO.md`; `app.js` sotto la guardia di `458.752 B`. |
| **Combattimento, Mira e Armi V9–V12** | `tests/combat-audit.test.mjs`, `tests/aim-muzzle-r28.test.mjs`, `tests/hero-bullets-d71.test.mjs`, `tests/projectiles-d62.test.mjs`, `tests/arsenal-review-r23.test.mjs` | **PASS (100%)** | 50 righe su 50 nell'audit di combattimento (`6/6` vittorie per bot medio e debole su tutte le 25 tappe a piedi); canne `MUZZLE_V9` allineate al pixel; nessuna mossa morta. |
| **Villaggi, Lotti Dipinti e Interni** | `tests/village-lots-r22.test.mjs`, `tests/hub-exit-r20.test.mjs`, `tests/interiors.test.mjs`, `tests/argon-ui.test.mjs` | **PASS (100%)** | 92 edifici in 14 villaggi coprono `>= 78%` del lotto; `npc` e `interiors` in pixel art; salvataggi dentro gli hub ripristinati senza perdita di indice. |
| **Gare Vortex, Curve e 5 Turbo** | `tests/racing-v9.test.mjs`, `tests/arsenal-review-r23.test.mjs` | **PASS (100%)** | Tutti i 7 circuiti e le modalità *Contro il tempo*, *Eliminazione* e *Rivincita* completati dal pilota automatico con tutti i 5 stadi di turbo (`MK I` – `MK V`). |
| **Controlli Mobile, Gamepad e Stabilità** | `tests/no-keyboard-d39.test.mjs`, `tests/assist-option-r19.test.mjs`, `tests/defects-r19.test.mjs`, `tests/hud-meter-r19.test.mjs`, `tests/stability.test.mjs` | **PASS (100%)** | Tastiera disattivata per il giocatore umano (`D39`); copertura `hud.mjs` al 100%; `faultMonitor` e salvataggio di backup verificati. |
| **Tooling Python, Contratti Arte e Server** | `tests/tooling-syntax.test.mjs`, `tests/art-derived.test.mjs`, `tests/server.test.mjs` | **PASS (100%)** | `11/11` in `tooling-syntax.test.mjs` (inclusi `race props round trip` e `GPT chroma key` con `PIL` e `numpy`); server HTTP protetto contro path traversal e file segreti. |
| **MAX STRIKE — FOMO HUD & Deliverable** | `tests/max-strike-fomo-hud.test.mjs` | **PASS (100%)** | Verifica unitaria di `computeTacticalHudState`, `drawComboStreakHud` (combo, radar segreti a `180 px` / `350 px` / `600 px`, banner punto debole boss) e presenza dei 10 deliverable `CHRONOS_*.md`. |

---

## 2. VERIFICA SIMULATA DEI GIRI COMPLETI DELLA CAMPAGNA (`[SIMULAZIONE]`)

- **3 Rotte Complete (`A`, `B`, `C`) su 44 Tappe (`docs/evidence/r28/PLAYTIME_ESTIMATE_R28.md`):**
  - **Rotta A (Officina + Rotta di servizio + Unità 9 fermata + EVE conservata):** `44 tappe`, `8 incarichi`, `2 preparazioni`, titoli di coda raggiunti — **PASS** (`~79,9 minuti` probabili; fascia `57,5 – 111,0 min` + `~11 min` facoltativi).
  - **Rotta B (Rifugio + Passaggio diretto + Unità 9 lasciata + EVE spenta):** `44 tappe`, `8 incarichi`, `2 preparazioni`, titoli di coda raggiunti — **PASS** (`~84,0 minuti` probabili; fascia `60,3 – 117,6 min` + `~11 min` facoltativi).
  - **Rotta C (Mista + Esplorazione estesa):** `44 tappe`, `8 incarichi`, `2 preparazioni`, titoli di coda raggiunti — **PASS** (`~80,0 minuti` probabili; fascia `57,5 – 111,4 min` + `~11 min` facoltativi).

---

## 3. VERIFICA VISIVA E INTERATTIVA IN BROWSER REALE (`playwright-cli`)

- **Playtest Hub (`http://localhost:3000/`):**
  - Verificato il caricamento a `1440×900` (Desktop) e `390×844` (Mobile) con zero errori console e zero richieste di rete fallite.
  - Verificata la scheda «Report & Gate» con l'accesso immediato a tutti i **10 report MAX STRIKE (`CHRONOS_*.md`)** e ai report storici TIER 3.
- **Gioco Reale (`http://localhost:3000/game/index.html`):**
  - Verificata l'intro del giaguaro (`#studio`), il menù principale animato con Nox e Lulù (`.mh`), il pannello Opzioni a 4 schede (`Audio`, `Accessibilità`, `Controlli`, `Crediti`) e l'avvio della sequenza «Due colpi» (`#opening`).
