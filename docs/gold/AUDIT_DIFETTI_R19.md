# Registro dei difetti R19 (11–12 novembre 2026)

Ogni riga: ID, gravità (P0 blocca il gioco, P1 rovina una scena, P2 fastidio, P3 rifinitura), dove, prova, correzione, byte in `app.js`.
Le prove nel browser sono in Chromium con tocco emulato: [SIMULAZIONE]. Nessuna riga è stata provata su un telefono da chi scrive.

| ID | P | Difetto | Dove | Prova | Correzione | Stato |
|---|---|---|---|---|---|---|
| R19-01 | P0 | SPARA e SCHIVA non compaiono dopo l'apertura e dopo un riavvio (segnalato dall'autore sul telefono) | `game/runtime.mjs:191` `configureControls` | `tests/defects-r19.test.mjs` | `configureControls` rimostra `gun` e `dash` a ogni missione | CHIUSO, da riconfermare su telefono |
| R19-02 | P1 | Boss non ancora svegli disegnati fermi e semitrasparenti nell'arena | `game/runtime.mjs`, disegno degli attori | `tests/defects-r19.test.mjs` | Gli attori `dormant` non vengono disegnati | CHIUSO |
| R19-03 | P1 | Scatto verticale della telecamera quando compare un pulsante | `game/runtime.mjs:1049` `followCamera` | `tests/defects-r19.test.mjs` | L'altezza nuova si raggiunge in pochi frame (20 % a frame, salto diretto oltre 260 px) | CHIUSO |
| R19-04 | P1 | Scatti nei combattimenti con i boss | `game/hud.mjs`, `game/runtime.mjs:887` | `tools/profile_boss_r19.cjs`: p95 ≈ 4 ms con CPU 4× [SIMULAZIONE] | HUD scrive nel DOM solo se il valore cambia; lampo senza `ctx.filter`; vignetta pre-disegnata | APERTO finché non è misurato su telefono |
| R19-05 | P1 | In orizzontale (844×390) il pulsante di risposta dell'apertura esce dallo schermo | `game/style.css`, blocco `@media(max-height:520px)` | `npm run qa:opening` | Griglia a due colonne nello schermo basso | CHIUSO |
| R19-06 | P2 | `dt` non numerico avvelena lo stato (posizioni `NaN`) | `game/campaign.mjs:295`, `game/traversal.mjs:5` | `tests/properties-r19.test.mjs` | `dt=clamp(dt,0,.05)||0` | CHIUSO |
| R19-07 | P2 | Barre: stati in italiano con lingua inglese (H4) | `game/hud.mjs` | `tests/hud-meter-r19.test.mjs` | Stati LOW/ZERO e aria tradotti | CHIUSO |
| R19-08 | P2 | Intro dello studio con video, tasti e fondo piatto (segnalato dall'autore) | `game/index.html` `#studio`, `game/style.css` | `tools/verify_studio_browser.cjs`, 5 formati | Key art di Argon, lampi in CSS, nessun pulsante (D61) | CHIUSO, da guardare su telefono |
| R19-09 | P2 | Scena dei due colpi: solo scritte su fondo sfocato (segnalato dall'autore) | `game/style.css` `.opening-screen` | `npm run qa:opening`, schermate in `docs/evidence/r19/m5/` | Sfondo: la veduta dell'Atto 1 (`art/atti/atto_1.webp`) sotto un velo scuro | CHIUSO, da guardare su telefono |
| R19-10 | P2 | Lo sparo è una linea che compare già intera; il DUO colpisce attraverso i muri (D62) | `game/campaign.mjs` (DUO), `game/runtime.mjs` (disegno `beam`) | `tests/projectiles-d62.test.mjs` | Il colpo si vede viaggiare; il DUO richiede la linea libera e disegna un'onda per ogni nemico raggiunto | CHIUSO |
| R19-11 | P3 | Il prossimo dispositivo da attivare non è segnalato quando è già nello schermo | `game/runtime.mjs`, dopo il disegno dei nodi | controllo a vista nelle schermate | Triangolo che rimbalza sopra il primo dispositivo spento (fermo con «Riduci movimento») | CHIUSO |

## Ipotesi del mandato

| ID | Esito | Nota |
|---|---|---|
| H1 | **Confermata** | Nell'APK non c'è un ponte di acquisto (`ChronosBilling` vive solo in `game/runtime.mjs`): il gioco è tutto aperto. Il ponte vero richiede Play Console: BLOCKED. |
| H2 | Per scelta | Se il backup rifiuta la scrittura il salvataggio si ferma e il gioco avvisa: un test lo fissa. |
| H3 | Compatibilità | I salvataggi senza `integrity` sono i vecchi: li controlla lo schema. |
| H4 | Corretta | R19-07. |
| H5 | Falsa | `pngjs` e `playwright` sono dichiarati in `package.json`. |
| H6 | Falsa | Nella fuga i tasti sono nascosti e `dash` non viene letto. |

## Non coperto

- Audit dei pulsanti: 22 stati su 57 visti (`docs/evidence/r19/buttons/buttons.json`); mancano fra gli altri unlock, result, city-choice, ending, hub, fault.
- «Ripristina acquisti»: non verificabile senza ponte nativo.
- Test di proprietà mancanti: `racing-v9`, `missions`, `hubs`, `villages`, `input-v9`.
