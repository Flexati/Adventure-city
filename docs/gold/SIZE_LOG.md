# Registro del peso di `app.js` (R19)

Guardia dell'autore: **458 752 byte**. Limite del bundler: 524 288. Ogni riga è **[MISURATO]** con
`python3 tools/prepare_android_assets.py`. La guardia non si alza e il controllo non si tocca.

| Data | Modifica | Stima | Prima | Dopo | Differenza | Margine sulla guardia |
|---|---|---|---|---|---|---|
| 11/11 | Base del giro (`632f8b3`) | — | — | 457 825 | — | 927 |
| 11/11 | Il bundler lascia fuori 14 funzioni esportate che il gioco non chiama (le usano solo i test) | −2 000 | 457 825 | 453 445 | **−4 380** | **5 307** |
| 11/11 | Apertura in orizzontale: correzione solo in `style.css` | 0 | 453 445 | 453 445 | 0 | 5 307 |
| 11/11 | Cornice «menu» di Argon sui pannelli: `border-image` in `style.css`, immagine in `game/art/ui/` | 0 | 453 445 | 453 445 | 0 | 5 307 |
| 12/11 | Prestazioni nei boss (HUD, lampo del colpo, vignetta), tiro assistito, SPARA/SCHIVA, telecamera | +1 000 | 453 445 | 454 466 | +1 021 | 4 286 |
| 12/11 | Intro dello studio in codice (tolti video, due pulsanti e il loro codice) | −800 | 454 466 | 453 617 | **−849** | 5 135 |
| 12/11 | Sei suoni di Argon cablati agli eventi (elenco, instradamento, tre eventi, interni) | +500 | 453 617 | 454 134 | +517 | 4 618 |

## Le 14 funzioni lasciate fuori

`applyBeatChoice`, `availableRacesV9`, `chooseCity`, `collapseWaypoint`, `grantWeaponRewardV9`, `interactNode`,
`interiorTexts`, `loadArsenalV9`, `loadRun`, `nextDistrict`, `saveArsenalV9`, `saveRun`, `setNarrativeFlag`,
`veyraRivalryV9`.

Restano nei moduli in `game/` e nei loro test. L'elenco viene ricalcolato a ogni build
(`android/build/pruned-exports.json`): se una di queste torna a essere chiamata, rientra da sola nel bundle.
`tests/bundle-prune-r19.test.mjs` prova che nessun modulo del gioco le chiama e che il bundle si legge ancora.

## Candidati non ancora toccati

| Candidato | Guadagno stimato | Perché non ora |
|---|---|---|
| `engineSpeed(){}` vuoto e la sua chiamata a ogni frame (`audio-engine.mjs:67`, `runtime.mjs:83`) | ~150 byte | Tocca `runtime.mjs`: entra con la prossima modifica a quel file. |
| Testi inglesi (`runtime-en`, `world-en`, `interiors-en`, `story-en`: ~63 000 byte di sorgente) in un file dati caricato all'avvio | ~55 000 byte | Cambia l'ordine di avvio e la lista delle risorse dell'APK: è un intervento vero, da fare da solo e con le prove di lingua. È la riserva se servirà spazio. |
| Commenti a fine riga | non misurato | Una regola automatica può rompere una stringa: non si fa alla cieca. |

## R20-a — i cataloghi inglesi escono da `app.js` (12 novembre 2026)

| Misura | Byte |
|---|---:|
| `app.js` prima (R19 milestone 5: proiettili, DUO, segnale sul dispositivo) | 454 725 |
| `app.js` dopo | **393 625** |
| `en.js` (nuovo, caricato prima di `app.js`) | 61 099 |
| Margine sotto la guardia di 458 752 | **65 127** |

`runtime-en`, `world-en`, `interiors-en`, `story-en` restano moduli in `game/`; nel pacchetto Android diventano un
secondo script classico. Il totale scaricato non cambia: cambia solo dove sta. Questo margine è destinato alle
tappe nuove di `PIANO_DURATA_R20.md`; ogni tappa scrive qui il suo costo.

## R20-c — 13 tappe, 4 boss (12 novembre 2026)

| Voce | Byte |
|---|---:|
| `app.js` prima | 393 827 |
| Piante dipinte (`painted-maps.mjs`) | ~3 700 |
| Manifesto: 4 atlanti di boss | ~2 900 |
| Missioni, tappe, dialoghi | ~10 700 |
| `app.js` dopo | **411 339** |
| Margine sotto 458 752 | **47 413** |

I testi inglesi delle tappe (5 900 byte) stanno in `en.js`, non in `app.js`.

## R21 — dopo l'integrazione del lavoro di Argon (13 novembre 2026)

| File | Byte |
|---|---:|
| `app.js` | **448 606** (margine 10 146 sotto 458 752) |
| `world.js` (14 villaggi e loro disegno) | 31 675 |
| `en.js` (testi inglesi) | 132 747 |
| JavaScript in tutto | 615 657 |

La guardia vale per `app.js`. Villaggi e inglese sono fuori da `app.js` per scelta dichiarata, non per farla passare:
il totale è stampato a ogni build. Il margine è di nuovo stretto: la prossima aggiunta di contenuto deve spostare
in un file dati i dialoghi italiani (`story-v08`, circa 28 000 byte).

## R23 — arsenale, economia, mosse, turbo e curve di Argon (13 novembre 2026)

| File | Byte |
|---|---:|
| `app.js` | **443 279** (margine 15 473 sotto 458 752) |
| `world.js` (villaggi e loro disegno, piante dipinte, tabelle dell'arsenale, storia italiana) | 80 835 |
| `en.js` (solo testi inglesi) | 141 751 |
| JavaScript in tutto | 668 494 |

Per far entrare l'arsenale Argon aveva spostato le piante dipinte e la storia italiana dentro `en.js`. Lo spostamento resta
(sono dati, come previsto nella nota di R21), ma in `world.js`: `en.js` torna a contenere solo l'inglese. Il totale cresce
di 52 837 byte rispetto a R21: è il contenuto nuovo, non è nascosto.

## R25 — pallottole che volano (14 novembre 2026)

`app.js` da 443 286 a **444 377** byte (+1 091: funzione `heroBullet`, disegno e scoppio all'arrivo). Margine 14 375 sotto 458 752.

## R28 — canna, mira manuale (14 novembre 2026)

`app.js` da 444 461 (misura di partenza, dopo R27) a **447 432** byte (+2 971: tabella delle canne, scelta del bersaglio lungo il raggio,
punto d'arrivo dei colpi, linea di mira dalla canna, posa di sparo del compagno). Margine 11 320 sotto 458 752. `world.js` 80 729, `en.js` 141 756.

## R29 — fuoco di bocca orientato (14 novembre 2026)

`app.js` da 447 432 a **447 918** byte (+486: rotazione della fiammata e sua base sulla canna). Margine 10 834 sotto 458 752.

## Fase 0 — base da d3ea80d (14 novembre 2026)

`app.js` **451 478** byte (R29: 447 918; +3 560 da `d3ea80d`: battute dei boss, DUO fuori sincro, volume per cue, suoni v86, più il ruggito di D74). Margine 7 274 sotto 458 752. `world.js` 82 242, `en.js` 146 355.

## R31–R33 — fiammata colorata, fuoco coerente, correzioni (15 novembre 2026)

`app.js` da 451 478 a **454 723** byte (+3 245: tinte per eroe, bagliore, pose del lampo, Morrow, fiammata nemica, precarico). Margine **4 029** sotto 458 752. Prima di aggiungere codice nuovo a `game/` va tolto altro (R19–R21 mostrano come: moduli dati fuori da `app.js`).

## R34 (15 novembre 2026)

`app.js` 455 016 byte (+293: annuncio del risveglio dei boss senza dispositivi). Margine **3 736** sotto 458 752.
