# CHRONOS V10.3 — benchmark e progettazione

2 novembre 2026 · `COMMERCIAL_RELEASE = BLOCKED`

Questa cartella raccoglie il lavoro di analisi e progettazione fatto con l'autore, una fase alla volta. **Non modifica il codice del gioco.** Le decisioni dell'autore sono registrate in [`docs/gold/DECISIONI.md`](../../gold/DECISIONI.md), righe D18–D30.

## I documenti

| File | Contenuto | Stato |
|---|---|---|
| [CHRONOS_FASE_1_BENCHMARK.md](CHRONOS_FASE_1_BENCHMARK.md) | Scelta dei giochi di riferimento (Game Designer, Product Analyst, Tech Lead Android) | Rivista. I conteggi di boss e scelte sono corretti nella Fase 3 |
| [CHRONOS_FASE_2_SCHEDE.md](CHRONOS_FASE_2_SCHEDE.md) | Una scheda per gioco: core loop, primi minuti, retention, controlli touch, prezzo, recensioni negative, azioni per CHRONOS | Rivista |
| [CHRONOS_FASE_3_SINTESI.md](CHRONOS_FASE_3_SINTESI.md) | Sintesi A–G: confronto, 10 pattern, core loop, primi 5 minuti, modello premium, dati, boss e perimetro | Rivista, decisioni registrate |
| [CHRONOS_COMBATTIMENTO_P1_INPUT.md](CHRONOS_COMBATTIMENTO_P1_INPUT.md) | Combattimento e audio: benchmark e Pilastro 1 (joystick e mappatura input) | Approvato (D27). Gamepad N2 implementato (D29) |
| [CHRONOS_COMBATTIMENTO_P2_STATI.md](CHRONOS_COMBATTIMENTO_P2_STATI.md) | Combattimento: Pilastro 2 (stati e frame data, sensazione dei colpi, Chrono Shift) | Approvato (D29), non ancora implementato |
| [CHRONOS_ARTE_P1_STILE.md](CHRONOS_ARTE_P1_STILE.md) | Grafica: benchmark e Pilastro 1 (regole di stile misurate sugli asset reali) | Approvato (D28) |
| [CHRONOS_ARTE_P2_PIPELINE.md](CHRONOS_ARTE_P2_PIPELINE.md) | Grafica: Pilastro 2 (pipeline di produzione, 10 controlli automatici, contratto dei boss) | Approvato (D30). Controlli e pacchetto dei boss v2 nel repo |

## Da decidere

1. **Gamepad in guida e nelle gare.** La tabella approvata in D27 copre solo il gioco a piedi; per la guida non c'è ancora una mappatura.
2. **Acquisto a 5,99 €:** il build oggi non usa Gradle, quindi bisogna scegliere come integrare Play Billing ([istruzioni, M4](../../gold/ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md)).

## Prossimi passi

- **Sul PC dell'autore (MX Linux):** il mandato è in [ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md](../../gold/ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md):
  - M1: prova del gamepad e del joystick sul telefono;
  - M2: C1, N1, G1, E1, CS;
  - M3: demo fino a «La firma» e «Gioca l'altra rotta»;
  - M4: acquisto;
  - M5: i 16 file con 4,99 €;
  - M6: boss nuovi;
  - M7: «Otto mesi dopo».
- **Grafica:** l'autore genera le 36 immagini dei boss con [`requests/gpt-boss-v2-20261102/`](../../../requests/gpt-boss-v2-20261102/README.md). Poi pulizia e i 10 controlli automatici. Pilastri 3–5 da scrivere.
- **Combattimento e audio:** Pilastri 3–5 (audio adattivo, architettura, verifica).
- **Fase 4 del benchmark:** 3 milestone, 3 rischi, 3 test con giocatori.

## Come riprodurre le misure

```bash
python3 -I tools/art_style_audit.py . docs/evidence/v10.3/art-style
```

Lo strumento legge gli sprite in sola lettura. Scrive [`art_style_audit.json`](../../evidence/v10.3/art-style/art_style_audit.json) e [`silhouettes_32px.png`](../../evidence/v10.3/art-style/silhouettes_32px.png).

```bash
node tools/build_boss_v2.mjs .                                                # pacchetto dei boss v2, sempre identico
node tools/art_derived_checks.mjs <derivato.png> <brief.json> [grezzo.png]    # i 10 controlli
python3 -m http.server 8090 --bind 127.0.0.1 & npm run qa:gamepad             # gamepad simulato, 9 controlli
```

I numeri sul combattimento sono letture dirette del codice: ogni valore cita il proprio `file:riga`.
