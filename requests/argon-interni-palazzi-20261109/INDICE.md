# Asset necessari per chiudere la Parte I: indice per Argon

9 novembre 2026 · `COMMERCIAL_RELEASE = BLOCKED`

Questo è l'elenco completo di ciò che manca al gioco **così com'è oggi** (31 tappe, 4 villaggi, 12 tappe a piedi). Ogni voce nasce da un controllo sul codice o su GitHub, riportato nei due file dei prompt. I contenuti futuri del censimento (`docs/gold/ASSET_NECESSARI.md`, 442 famiglie) non sono qui: prima si chiude ciò che il giocatore vede adesso.

**Finché questi file non arrivano su GitHub, lo sviluppo che dipende dalla grafica resta fermo.** Nel frattempo il gioco usa ciò che ha: villaggio sfocato negli interni, facciate e case disegnate dal codice, fogli di famiglia per i ruoli senza foglio proprio.

## Elenco

| Gruppo | Cosa | Immagini | Generazioni (2 varianti) | Dove sono i prompt | Priorità |
|---|---|---|---|---|---|
| A | Interni in prima persona, uno per servizio dei 4 villaggi | 15 | 30 | `README.md` | 1 |
| I | Ritratti dei 7 servizi senza volto e della guardia della porta | 8 | 16 | `PARTE_2_PERSONAGGI.md` | 1 |
| C | Terreno: 4 distretti di missione e 4 villaggi | 8 | 16 | `README.md` | 2 |
| B | Facciate dei palazzi dei villaggi | 4 | 8 | `README.md` | 2 |
| D | Case dei villaggi | 4 | 8 | `README.md` | 2 |
| E | Decorazioni dei distretti di missione | 4 | 8 | `README.md` | 2 |
| H | Pose di preparazione e recupero per 6 nemici | 6 | 12 | `PARTE_2_PERSONAGGI.md` | 3 |
| J | Fogli per gli 8 ruoli che usano ancora il foglio di famiglia | 8 | 16 | `PARTE_2_PERSONAGGI.md` | 3 |
| G | I 4 boss della Parte I a 288 px | 36 | 36 (già con le varianti) | `requests/gpt-boss-v2-20261102/` | 4 |
| | **Totale** | **93** | **150** | | |

**Perché quest'ordine.** La priorità 1 è ciò che oggi manca del tutto e si vede a ogni visita a un villaggio. La 2 è il mondo: terreno, palazzi, case, decorazioni. La 3 rende ogni minaccia riconoscibile dalla sagoma. La 4 sono i boss, che hanno bisogno anche di codice nuovo.

## Regole che valgono per tutto (CLAUDE.md)

- Nessun testo leggibile nelle immagini, nessuna copia di opere protette.
- Nox e Lulù non si ridisegnano e non compaiono in nessuna di queste immagini.
- Le minacce si riconoscono dalla sagoma, non dal colore.
- I file consegnati sono originali: dopo la consegna non si modificano. Claude lavora su derivati registrati.

## Come pubblica Argon su GitHub

Incolla questo testo ad Argon quando le immagini di un gruppo sono pronte:

```
Publish the finished images to the GitHub repository Flexati/Adventure-city.
Rules, all mandatory:
1. Create and use ONLY the branch delivery/argon-asset-20261109, started from the current
   work/chronos-adventure-commercial. Never commit to main or to work/chronos-adventure-commercial.
2. Add ONLY image files, under deliveries/argon-asset-20261109/<group letter>/, with the exact file names written
   above each prompt. For the second variant add the suffix _v2 before the extension.
3. Add one file deliveries/argon-asset-20261109/<group letter>/CONSEGNA.md listing every file, the prompt it came
   from and anything that does not respect the contract (wrong size, text in the image, missing cells).
4. Do not change any other file: no code, no documents, no build output, no server, no package.json.
5. Never write a token, password or key in any file or commit message.
6. One commit per group, message in Italian: "Consegna Argon: gruppo <letter>, <n> immagini".
Then tell me the commit hash and the list of files.
```

**Token.** Se Argon chiede un token GitHub, creane uno nuovo solo per quel momento, con accesso al solo repo, e dallo ad AI Studio nel suo campo protetto: non incollarlo in chat e non farlo scrivere in un file. Poi revocalo.

## Cosa fa Claude a ogni consegna

1. Legge `CONSEGNA.md` e controlla ogni file: dimensioni, griglia, trasparenza, testo, sagoma a 32 px.
2. Ricava i derivati (ritaglio, pulizia, formato) e li registra in `assets/production/v10.3/derived/REGISTRO.json` con l'SHA-256 dell'originale.
3. Li collega al gioco, con un test per ogni gruppo e i controlli nel browser a 390×844 e 844×390.
4. Scrive in `docs/gold/STATO.md` cosa è entrato e cosa è stato rimandato indietro, con il motivo.
