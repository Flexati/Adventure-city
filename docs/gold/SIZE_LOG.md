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
