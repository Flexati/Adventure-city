# CHRONOS — Che cosa è stato implementato (con la prova)

| Area | Implementazione | Prova |
|---|---|---|
| Intro (D78) | I tre frame dell'autore: la testa, la testa con la scarica, il nome con lampo e ruggito, in sincrono con i tre colpi del tema. In verticale il nome occupa il 91% della larghezza | `tools/verify_studio_browser.cjs` (5 formati), `docs/evidence/ms1/studio/` |
| Menu (D80) | Nox e Lulù entrano insieme: prima Lulù era sola per circa 0,7 s | `tools/verify_menu_heroes_d80.cjs` (7 formati) |
| Colonna sonora (R38, D74) | 15 brani originali, sintesi deterministica, ognuno conforme al Gate 2; ogni cue del gioco suona un brano; gli Atti III e IV combattono sul secondo brano di battaglia; due cue dello stesso brano sono un solo flusso | `tests/score-r38.test.mjs`, `assets/production/r38/audio/*-metrics.json` |
| Varietà (MS-3) | Due tappe ibride «apri, poi difendi»; tre chiamate d'aiuto al primo dispositivo | `tests/variety-ms3.test.mjs`, `docs/evidence/ms3/` |
| Mira (D72) | Il trascinamento dal vivo viaggia in un campo suo (`aimLive`) e non viene più sostituito dalla direzione dell'eroe | `tests/aim-live-ms1.test.mjs`, `aim_r28` 7 su 7 |
| HUD tattico (`fbc2a05`, rivisto) | Radar sul forziere più vicino; il punto debole è detto dalla barra del boss; i pezzi su canvas sono ancorati all'HUD | `tests/max-strike-fomo-hud.test.mjs` (9), `docs/evidence/ms2/hud/` |
| Leggibilità (R4) | Scritte in mondo mai sotto 12 px sullo schermo | `labels_r4` 9 su 9 |
| Prestazioni | Il «mondo vivo» della mappa disegna solo ciò che è in inquadratura | `CHRONOS_PERFORMANCE_BENCHMARKS.md` |

**Non implementato, di proposito.**
- Nessuna meccanica nuova che cambi tempi o hitbox (regola 4).
- Nessuna dipendenza nuova.
- Nessun meccanismo di pressione artificiale: niente timer ingannevoli, niente scarsità finta, niente pubblicità.
- Il «radar» premia l'esplorazione con un'indicazione, non con un conto alla rovescia.
