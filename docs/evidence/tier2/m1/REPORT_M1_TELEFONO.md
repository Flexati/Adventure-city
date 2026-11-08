# M1 Telefono — Rapporto di Verifica Mobile (API 36)

**Data:** 2026-11-08  
**Profili testati:** `390×844` (portrait standard), `360×800` (portrait compatto), `844×390` (landscape)  
**Target Android:** `compileSdk 36`, `targetSdk 36`, `minSdk 26`, `versionCode 2`, `versionName "1.0.0"`  
**Distinzione rigore (`CLAUDE.md` Regola 3):** `[FATTO]` verificato tramite harness mobile touch/CDP reale su motore Chromium e ispezione APK/AAB; `[IPOTESI]` il comportamento su telefono fisico reale fino a collaudo manuale dell'utente (`0` sessioni umane registrate).

---

## Esito Checklist M1

| # | Voce Checklist M1 | Strumento / Suite | Risultato | Dettaglio Tecnico Misurato |
|---|---|---|---|---|
| 1 | **Tocco singolo** (muovi Nox con un dito, movimento fluido senza scatti) | `tools/verify_touch_input.cjs` (`qa:touch`) | **OK (PASS)** | 48/48 asserzioni superate (`hasTouch: true` e `plain-page`). Spostamento verificato nelle 4 direzioni cardinali (`+106 px` destra, `-89 px` sinistra, `+85 px` giù, `-102 px` su), mezza intensità analogica (`stick.x = 0.5`), anello flottante `#float-stick` attivo e non sovrapposto a `#stick`, arresto immediato (`< 1 px`) al rilascio. |
| 2 | **Due dita (Multitocco)** (tieni premuto movimento con dito 1 + premi pulsante con dito 2) | `tools/verify_touch_input.cjs` + `tools/verify_controls_v9.cjs` (`qa:controls`) | **OK (PASS)** | 11/11 asserzioni controlli + test multitocco superati. Con il dito 1 in movimento continuo (`dx = 237 px`), il dito 2 esegue `SPARA`, `SCHIVA` e `CAMBIA` arma (`c9 -> vx9`) mantenendo attivo `stick.id` e con `syntheticClicks = 0`. In guida (`escape` e `tunnel`), il dito 1 mantiene `ACCELERA` (`acceleratePointers = 1`) mentre il dito 2 sterza (`±1`, `0.5`) e attiva `PULSE`. |
| 3 | **Tastiera / Gamepad** (collega e premi pulsanti) | `tools/verify_gamepad_browser.cjs` (`qa:gamepad`) | **OK (PASS)** | 9/9 asserzioni superate. Rilevamento W3C Gamepad, navigazione menu/dialoghi/scelte, movimento analogico, sparo, risonanza, schivata, cambio arma e guida completi. |
| 4 | **Salvataggio** (gioca 2 min, chiudi l'app, riapri, verifica salvataggio) | `tools/verify_save_recovery.cjs` (`qa:save`) | **OK (PASS)** | Ripristino esatto del progresso (`city-adventure-progress-v7`) dopo reload/ricreazione processo, backup automatico su `sessionStorage` e memoria, recupero da JSON corrotto e gestione `QuotaExceededError`. Costo medio di salvataggio (`M-S1`): `0.186 ms` su 200 scritture (`max 2.90 ms`). |
| 5 | **Stabilità** (nessun crash, nessun blocco) | `tools/verify_stability.cjs` (`qa:stability`) | **OK (PASS)** | Tutte le prove `S1–S7`, `S5b`, `S6b`, `M-S1` superate: `60 fps` mantenuti dopo eccezione singola (`S1`), pannello di recupero istantaneo (`36 ms`) su fault ripetuti (`S2`) e asset mancanti (`S3`, `S6`, `S6b`), pausa automatica e sospensione `AudioContext` in background (`S4`, `S5`), rilascio sicuro del pulsante `#hold-button` su `blur` (`S7`). |

---

## Artefatti e Prove (`docs/evidence/tier2/m1/`)

- `touch-input.json` — 48 controlli touch singolo e multitocco a due dita (piedi + guida diurna + guida notturna).
- `controls-v9.json` — 11 controlli ergonomia mobile, separazione pulsanti (`≥ 10 px`), cambio arma, ricarica, cura, schivata.
- `gamepad.json` — 9 controlli W3C Gamepad in tempo reale.
- `save-recovery.json` — verifica persistenza, migrazione, corruzione e ricreazione processo.
- `stability.json` — verifica stabilità `S1–S7`, `S5b`, `S6b`, `M-S1`.
- `m1-mobile-390x844-portrait.png` — screenshot mobile portrait standard (`390×844`).
- `m1-mobile-360x800-compact.png` — screenshot mobile portrait compatto (`360×800`).
- `m1-mobile-844x390-landscape.png` — screenshot mobile landscape (`844×390`).
