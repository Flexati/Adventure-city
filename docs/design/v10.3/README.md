# CHRONOS V10.3 — benchmark e progettazione

2 novembre 2026 · `COMMERCIAL_RELEASE = BLOCKED`

Questa cartella raccoglie il lavoro di analisi e progettazione fatto con l'autore, una fase alla volta. **Non modifica il codice del gioco.** Le decisioni dell'autore sono registrate in [`docs/gold/DECISIONI.md`](../../gold/DECISIONI.md), righe D18–D26.

## I documenti

| File | Contenuto | Stato |
|---|---|---|
| [CHRONOS_FASE_1_BENCHMARK.md](CHRONOS_FASE_1_BENCHMARK.md) | Scelta dei giochi di riferimento (Game Designer, Product Analyst, Tech Lead Android) | Rivista. I conteggi di boss e scelte sono corretti nella Fase 3 |
| [CHRONOS_FASE_2_SCHEDE.md](CHRONOS_FASE_2_SCHEDE.md) | Una scheda per gioco: core loop, primi minuti, retention, controlli touch, prezzo, recensioni negative, azioni per CHRONOS | Rivista |
| [CHRONOS_FASE_3_SINTESI.md](CHRONOS_FASE_3_SINTESI.md) | Sintesi A–G: confronto, 10 pattern, core loop, primi 5 minuti, modello premium, dati, boss e perimetro | Rivista, decisioni registrate |
| [CHRONOS_COMBATTIMENTO_P1_INPUT.md](CHRONOS_COMBATTIMENTO_P1_INPUT.md) | Combattimento e audio: benchmark e Pilastro 1 (joystick e mappatura input) | **In attesa** del sì su C1, N1, N2 |
| [CHRONOS_ARTE_P1_STILE.md](CHRONOS_ARTE_P1_STILE.md) | Grafica: benchmark e Pilastro 1 (regole di stile misurate sugli asset reali) | **In attesa** del sì sulle regole e sui 3 boss |

## Da decidere

1. **Combattimento.**
   - **C1:** SCHIVA, DUO e ATTIVA partono al tocco invece che al rilascio.
   - **N1:** memoria dei tocchi di 100 ms per SCHIVA, SPARA e PULSE.
   - **N2:** gamepad, solo se il WebView lo vede sul telefono.
2. **Grafica.**
   - Le regole del Pilastro 1.
   - Se rigenerare a 288 px Cathedral Bone Tyrant, Toxic Forge Behemoth e Shadow Reaper. Le strisce attuali sono alte 128 px, non hanno contorno scuro, e il nucleo del Reaper usa il magenta di Lulù.

## Prossimi passi

- **Fase 4 del benchmark:**
  - 3 milestone, 3 rischi e 3 test con giocatori;
  - il mandato per Claude in un terminale sul PC dell'autore (Remote Control): demo fino a «La firma», acquisto a 5,99 €, allineamento dei 16 documenti che dicono ancora 4,99 €;
  - la proposta sulle battute di «Otto mesi dopo».
- **Combattimento e audio:** Pilastri 2–5 (stati e frame data, audio adattivo, architettura, verifica).
- **Grafica:** Pilastri 2–5 (pipeline, atlanti e prestazioni, coerenza e finitura, verifica con giocatori).

## Come riprodurre le misure

```bash
python3 -I tools/art_style_audit.py . docs/evidence/v10.3/art-style
```

Lo strumento legge gli sprite in sola lettura. Scrive [`art_style_audit.json`](../../evidence/v10.3/art-style/art_style_audit.json) e [`silhouettes_32px.png`](../../evidence/v10.3/art-style/silhouettes_32px.png).

I numeri sul combattimento sono letture dirette del codice: ogni valore cita il proprio `file:riga`.
