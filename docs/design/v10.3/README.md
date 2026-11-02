# CHRONOS V10.3 — benchmark e progettazione

2 novembre 2026 · `COMMERCIAL_RELEASE = BLOCKED`

Questa cartella raccoglie il lavoro di analisi e progettazione fatto con l'autore, una fase alla volta. **Non modifica il codice del gioco.** Le decisioni dell'autore sono registrate in [`docs/gold/DECISIONI.md`](../../gold/DECISIONI.md), righe D18–D28.

## I documenti

| File | Contenuto | Stato |
|---|---|---|
| [CHRONOS_FASE_1_BENCHMARK.md](CHRONOS_FASE_1_BENCHMARK.md) | Scelta dei giochi di riferimento (Game Designer, Product Analyst, Tech Lead Android) | Rivista. I conteggi di boss e scelte sono corretti nella Fase 3 |
| [CHRONOS_FASE_2_SCHEDE.md](CHRONOS_FASE_2_SCHEDE.md) | Una scheda per gioco: core loop, primi minuti, retention, controlli touch, prezzo, recensioni negative, azioni per CHRONOS | Rivista |
| [CHRONOS_FASE_3_SINTESI.md](CHRONOS_FASE_3_SINTESI.md) | Sintesi A–G: confronto, 10 pattern, core loop, primi 5 minuti, modello premium, dati, boss e perimetro | Rivista, decisioni registrate |
| [CHRONOS_COMBATTIMENTO_P1_INPUT.md](CHRONOS_COMBATTIMENTO_P1_INPUT.md) | Combattimento e audio: benchmark e Pilastro 1 (joystick e mappatura input) | Approvato (D27) |
| [CHRONOS_COMBATTIMENTO_P2_STATI.md](CHRONOS_COMBATTIMENTO_P2_STATI.md) | Combattimento: Pilastro 2 (stati e frame data, sensazione dei colpi, Chrono Shift) | **In revisione** |
| [CHRONOS_ARTE_P1_STILE.md](CHRONOS_ARTE_P1_STILE.md) | Grafica: benchmark e Pilastro 1 (regole di stile misurate sugli asset reali) | Approvato (D28) |
| [CHRONOS_ARTE_P2_PIPELINE.md](CHRONOS_ARTE_P2_PIPELINE.md) | Grafica: Pilastro 2 (pipeline di produzione, 10 controlli automatici, contratto dei boss) | **In revisione** |

## Da decidere

1. **Combattimento, Pilastro 2:**
   - hit-stop solo visivo (G1) ed evento `telegraphLock` (E1);
   - **Chrono Shift (CS)**: nemici e proiettili a metà velocità per 0,6 s dopo la Perfect Dodge di Nox, al massimo ogni 3 s. Cambia i tempi dei nemici, quindi serve una decisione esplicita (D21).
2. **Grafica, Pilastro 2:** la pipeline, i 10 controlli e il contratto dei boss (cella 320 × 320, 28 fotogrammi).

## Prossimi passi

- **Fase 4 del benchmark:**
  - 3 milestone, 3 rischi e 3 test con giocatori;
  - il mandato per Claude in un terminale sul PC dell'autore (Remote Control): demo fino a «La firma», acquisto a 5,99 €, allineamento dei 16 documenti che dicono ancora 4,99 €;
  - la proposta sulle battute di «Otto mesi dopo».
- **Combattimento e audio:** Pilastri 3–5 (audio adattivo, architettura, verifica). C1, N1 e N2 approvati entrano nel mandato per il terminale.
- **Grafica:** Pilastri 3–5 (atlanti e prestazioni, coerenza e finitura, verifica con giocatori). Poi i brief v2 dei 4 boss.

## Come riprodurre le misure

```bash
python3 -I tools/art_style_audit.py . docs/evidence/v10.3/art-style
```

Lo strumento legge gli sprite in sola lettura. Scrive [`art_style_audit.json`](../../evidence/v10.3/art-style/art_style_audit.json) e [`silhouettes_32px.png`](../../evidence/v10.3/art-style/silhouettes_32px.png).

I numeri sul combattimento sono letture dirette del codice: ogni valore cita il proprio `file:riga`.
