# CONSEGNA — Giro 4 Legame Nox & Lulù e 5 Finali (`deliveries/argon-legame-finali-v4-20261117/`)

## 1. Allineamento Git e Lettura Codice
- **Ramo**: `delivery/argon-design-aaa-20261117`
- **Merge eseguito**: `git merge --no-edit origin/work/chronos-adventure-commercial` (`8b09635`). Nessun rebase, nessun force-push.
- **Codice letto (senza modifiche)**: `game/bond.mjs`, `game/story-v08.mjs`, `docs/gold/DECISIONI.md` (D90).

## 2. Rispetto delle Regole Inviolabili (Sezione 0)
1. **Nessun personaggio disegnato nelle tavole**: verificato su `moment_home_cup.png` e `detail_cup_steam.png` (né volto, né corpo, né di spalle, né silhouette, né mani). Il palco di `moment_home_cup.png` (52%–86% altezza, linea piedi a 82%) è libero e documentato in `moment_home_cup_guide.png`.
2. **Storia per famiglie**: nessun sangue, nessuna sensualità, nessun bacio, nessun letto o indumento a terra. Il legame è raccontato dalle due tazze sul davanzale (ciano scuro di Nox e rosa antico fumante di Lulù).
3. **Zero testo o cifre leggibili**: verificato (`ocr_text_detected: ""`).
4. **Tavole quantizzate sulle palette ufficiali del primo giro**: `deliveries/argon-design-aaa-20261117/A0_palette/moon_refuge.json` (100% dei pixel appartenenti alla palette a 64 colori).

## 3. Stato per Lotto e Numeri Misurati
- **L1_momenti**: **1 tavola consegnata** (`moment_home_cup.png` 1920×1080 + `moment_home_cup.webp` 1280×720 + `moment_home_cup_guide.png` 1920×1080 + `.report.json` + scheda `.json`), 0 saltate, **3 tavole mancanti** in coda per esaurimento quota del modello immagini (`generic::resource_exhausted`).
  - *Misure `moment_home_cup.png`*: 1920×1080 px, palette `moon_refuge` (64/64 colori unici, conformità 100.0%), contrasto WCAG p95/p5 = **7.42**, densità bordi globale = **0.0433**, densità bordi sul palco = **0.0847**.
- **L2_dettagli**: **1 dettaglio consegnato** (`detail_cup_steam.png` 800×800 + `detail_cup_steam.webp` 800×800 + `.report.json` + scheda `.json`), 0 saltati, **7 dettagli mancanti** in coda per esaurimento quota del modello immagini.
  - *Misure `detail_cup_steam.png`*: 800×800 px, palette `moon_refuge` (64/64 colori unici, conformità 100.0%), contrasto WCAG p95/p5 = **10.0**, densità bordi globale = **0.0543**.
- **L3_finali**: 0 consegnati, 0 saltati, **5 mancanti** (in coda in `STATO_CODA.md`).
- **L4_ui**: 0 consegnati, 0 saltati, **6 mancanti** (in coda in `STATO_CODA.md`).
- **M4_audio**: 0 consegnati, **10 saltati**, 0 mancanti. Motivo: assenza nell'ambiente di esecuzione di DAW, sintetizzatore a campioni (`fluidsynth`/`timidity`) o modello musicale commerciale; vietata la sintesi scritta a mano in Python/NumPy.

## 4. Strumenti e Licenze
- **Generazione raster**: modello di generazione immagini integrato nell'ambiente (interrotto al raggiungimento di `generic::resource_exhausted`).
- **Post-produzione, quantizzazione palette e verifica geometrica**: Python 3.11, Pillow, NumPy (licenze open source BSD/MIT/HPND).
