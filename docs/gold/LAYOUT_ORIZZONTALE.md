# Banda di gioco su telefono orizzontale — B01 / B04 / ART06

Stato: **IMPLEMENTATO, verificato in browser.** Nessuna prova su dispositivo fisico o con persone.

## Problema del giocatore (baseline misurata)

L'Activity Android non blocca l'orientamento, e un'avventura a due pollici si impugna spesso in orizzontale. Lì la barra armi stava sopra il pulsante Cura, che stava sopra la fila di comandi: la camera lasciava libera solo una striscia fra HUD e barra. Misure su `zero` con kit guadagnato (`tools/verify_play_band.cjs`, rapporto `play-band-baseline.json`):

| Viewport | Scala | Eroina | Banda libera |
|---|---|---|---|
| 390×844 | 0,66 | 74 px | 503 px |
| 844×390 | 0,51 | 57 px | 118 px |
| 915×412 | 0,54 | 61 px | 140 px |
| 740×360 | 0,47 | 53 px | 88 px |
| 1280×720 | 0,95 | 106 px | 388 px |

## Risultato atteso e criterio

In orizzontale: banda ≥ 200 px ed eroina ≥ 65 px; in nessun campione (centro, bordi sinistro/destro/alto/basso della mappa) il corpo dell'eroina è sotto stick, pulsanti, Cura o barra armi; verticale e desktop invariati; etichette dentro i pulsanti; target touch ≥ 44 px.

## Soluzione

- **Barra armi agganciata fra i pollici** (CSS `(max-height:520px) and (orientation:landscape)`): stessa linea di base dei comandi, larghezza fino a 300 px, pulsanti alti 48 px. In verticale resta impilata sopra Cura.
- **Banda calcolata per colonna** (`framePlayCamera`, `bandBottom` in `visuals.mjs`): l'inquadratura orizzontale non dipende dalla banda, quindi prima si conosce la colonna dello schermo in cui sta l'eroina, poi la banda si chiude solo sugli overlay che coprono quella colonna. Al centro conta la barra armi, ai bordi lo stick o Cura/azioni.
- **Scala 0,62 sui telefoni orizzontali** (`cameraScale`): eroina 69 px invece di 53–61; vista 1360×630 unità circa.
- Difetto preesistente corretto: "RISONANZA" usciva dal pulsante a 360 px e in orizzontale (2 px con il font di sistema di questo Chromium); 11 px sotto 380 px di larghezza e in orizzontale.

## Risultato misurato (`play-band-after.json`)

| Viewport | Scala | Eroina | Banda libera | Sovrapposizioni |
|---|---|---|---|---|
| 390×844 | 0,66 | 74 px | 503 px | 0 |
| 844×390 | 0,62 | 69 px | 248 px | 0 |
| 915×412 | 0,62 | 69 px | 270 px | 0 |
| 740×360 | 0,62 | 69 px | 218 px | 0 |
| 1280×720 | 0,95 | 106 px | 388 px | 0 |

Confronti prima/dopo (solo viewport orizzontali; quelle verticali e desktop sono invariate e non conservate come immagine): `docs/evidence/v10.2/play-band-{baseline,after}-{844x390,915x412,740x360}.png`. Finale contro Archon in entrambi gli orientamenti: `release-flow-finale-{390,844}.json`, 0 FAIL dopo l'aggiornamento del fixture, che prima avviava il recupero Rook e si aspettava 20 tappe anche sul codice di baseline. `tools/verify_weapon_layout_browser.cjs` (ora con `CHROMIUM`/`PLAYWRIGHT_MODULE` configurabili) passa su sei viewport per entrambe le protagoniste con il contratto aggiornato: in orizzontale la barra non tocca Cura, Spara o stick e l'eroina non è mai sotto la barra. Test unitari: `tests/play-band.test.mjs`.

## Coerenza narrativa

Nessun cambiamento di contenuti, scelte o salvataggi.

## Lacune

Comfort reale dei pollici, dita sopra i nemici in arrivo dal basso, notch/safe area su dispositivi veri, prestazioni con la scala maggiore: servono Android fisico e persone. La riga di comando di 740 px manda a capo l'etichetta dell'arma su due righe, leggibile ma stretta.
