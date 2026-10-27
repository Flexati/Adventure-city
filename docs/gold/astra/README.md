# Richieste di produzione per GPT Astra

File principale: [`CHRONOS_RICHIESTE_ASTRA.xlsx`](CHRONOS_RICHIESTE_ASTRA.xlsx). Copie CSV: `p1_pronti.csv`, `grafica.csv`, `audio.csv`, `brief_audio_autore.csv`. Rigenerazione: `python3 tools/build_astra_requests.py`.

| Foglio | Contenuto |
|---|---|
| Leggimi | Regole comuni, legenda priorità, riferimenti da allegare |
| Riepilogo | Conteggi per priorità |
| P1 pronti da incollare | 14 prompt completi (10 grafica, 4 audio) per ciò che il gioco integra subito |
| Grafica | 287 famiglie visive della matrice V10.2: 24 P1, 165 P2, 83 P3, 15 già fatte o escluse |
| Audio | 173 famiglie audio: 14 P1, 80 P2, 67 P3, 12 già fatte o escluse; colonna con i brief dell'autore collegati |
| Brief audio autore | I 129 brief originali (PROMPT 00-128) in testo integrale |

Le 442 famiglie della matrice diventano 460 righe perché i 18 `ui_feedback_family` hanno una riga grafica e una audio.

## Esito della consegna 20261027

La colonna «Azione» delle righe consegnate riporta l'esito: integrato, conservato, respinto con la correzione esatta, oppure in attesa dell'autore. Dettaglio e misure in [`../ASTRA_INTEGRAZIONE_20261027.md`](../ASTRA_INTEGRAZIONE_20261027.md). Correzioni f727255: integrati G11, segmento del cavo, spazzata, piloni e nastro, bip e via; icone H-17 conservate. Ancora da correggere: strade e sheet H-17/ARC-7 (il terminale del cavo l'ha sistemato il team). Istruzioni pronte: [`ISTRUZIONI_ASTRA_GIRO3.md`](ISTRUZIONI_ASTRA_GIRO3.md); pacchetto e prompt in [`requests/astra-giro3-20261027/`](../../../requests/astra-giro3-20261027/). G6/G7 aspetta la decisione dell'autore sulle basi.

## Ordine consigliato

1. Foglio **P1 pronti da incollare**, nell'ordine G1→G10 e A1→A4. Sbloccano: gare di Veyra già giocabili, H-17/ARC-7, impatti delle armi, ritratti degli stranieri, firma «Due colpi».
2. **P2**: contenuti già nel gioco con asset provvisori, condivisi o a bassa risoluzione (abilità, nemici, NPC, UI, boss esistenti da verificare).
3. **P3**: contenuti non ancora implementati. Per ora solo concept e tavole di silhouette; i file finali dopo che l'incontro o la meccanica esistono, perché forma e tempi dei frame devono seguire il modello di gioco.

## Prompt maestro da incollare in GPT Astra

```
Sei il produttore di asset grafici e audio di CHRONOS Adventure: Nox & Lulù, avventura d'azione premium offline per Android.
Ti allego il foglio CHRONOS_RICHIESTE_ASTRA.xlsx e i file di riferimento elencati nel foglio «Leggimi».

Regole vincolanti:
- Lavora per righe del foglio, partendo da «P1 pronti da incollare», poi P2, poi P3 (per P3 solo concept/silhouette).
- Nox e Lulù NON vanno ridisegnati: ogni loro variante parte dagli sheet allegati e cambia solo arma, mani o effetto. Lulù è la protagonista femminile; non attribuire questa indicazione a Nox.
- Rispetta esattamente griglie, dimensioni, stati e nomi file indicati. Figura intera, almeno 12 px di margine: nessuna parte oltre il bordo della cella.
- Stile: pixel art dettagliata vista dall'alto 3/4, fantascienza industriale abitata, luce dall'alto a sinistra, stessa densità di pixel di kairn-master.png. Forme distinguibili anche senza colore.
- Nessun testo nelle immagini, nessuna persona reale, nessuna imitazione di personaggi o musiche di altre opere.
- Audio: strumentale e originale, master FLAC 48 kHz + OGG Vorbis, picco ≤ −1 dBFS, loop con giunzione pulita, avvisi comprensibili anche senza musica. Per l'audio leggi anche i brief collegati nel foglio «Brief audio autore».
- Per ogni consegna scrivi: ID famiglia, nomi file, strumento usato, provenienza e condizioni d'uso reali. Non dichiarare licenze, ascolti o approvazioni che non sono avvenuti.
- Se una richiesta è ambigua o in conflitto col canone, fermati su quella riga e segnalalo invece di inventare.
```

## Riferimenti da allegare

`assets/production/v10.2/handoff/kairn-master.png`, `morrow-master.png`, `strangers-author-reference.jpg`; `game/art/v05/nox_walk.png`, `lulu_walk.png`, `nox_actions.png`, `lulu_actions.png`, `driving_cars.png`, `driving_road.png`, `weapon_icons.png`; `game/art/v10/nox_vx9_gun.png`, `nox_vx9_reload.png`, `lulu_r12_gun.png`, `lulu_r12_reload.png`; `game/art/v09/medseal.svg`; `game/art/v08/portraits.png`; `game/art/brand/vanta-clock.webp`; `docs/WORLD_CHARACTER_EXPANSION_BIBLE_V85.md`.

## Consegna e integrazione

Consegnare in `assets/production/v10.2/handoff/` (o allegare in chat) con i nomi del foglio. Ogni file viene controllato prima dell'integrazione: celle, ancoraggi, leggibilità a dimensione runtime, loop e picchi audio. Un file che non supera il controllo viene respinto con il motivo; nessuna famiglia si chiude per la sola presenza di un file.

Avvertenza: i design di Kairn e Morrow seguono la foto scelta dall'autore e somigliano a personaggi noti; prima della vendita serve una revisione dei diritti (vedi `../STRANIERI.md`).
