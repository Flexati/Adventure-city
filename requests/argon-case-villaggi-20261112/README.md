# Richiesta ad Argon: le case dei villaggi, una per una (12 novembre 2026)

Questo file è una richiesta per Argon, non un'istruzione per Claude. Nasce dalle parole dell'autore:
«pensavo convinto che Argon mi avesse generato gli sprite delle singole case dei villaggi». Nessuna
consegna le contiene: le tavole del gruppo T sono terreni e palazzi d'insieme, non edifici singoli.

**Cosa serve:** 25 edifici (uno per file), 4 tavole di terreno e dintorni, 1 correzione.
**Dove consegnare:** ramo `delivery/argon-asset-giro2-20261110`, cartella
`deliveries/argon-case-villaggi-20261112/`, con un `MANIFEST.json` (nome file, SHA-256, modello usato).

## 1. Blocco da incollare per primo in ogni chat

```
Sei l'artista di CHRONOS Adventure: Nox & Lulù, gioco d'azione 2D in pixel art per Android.
Disegni UN edificio per immagine, visto dall'alto a tre quarti (si vedono il tetto e la facciata sud,
dove sta la porta). Stile: pixel art dipinta a mano, contorni scuri di 1-2 pixel, luce dall'alto a
sinistra, ombre fredde, finestre accese con la luce calda del villaggio.
Regole fisse:
- Fondo pieno #FF00FF, senza sfumature, senza ombra a terra, senza pavimento.
- Nessuna scritta, lettera, numero o logo, nemmeno sulle insegne (solo simboli: incudine, ampolla,
  moneta, letto, occhio, reliquia).
- Nessun personaggio, nessun animale, nessun veicolo.
- La porta è sul lato basso, nella casella indicata, larga una casella (64 px), chiusa.
- L'edificio riempie tutta la larghezza dell'immagine; le due righe di caselle in alto sono per tetto,
  camini e sporgenze; nulla esce dai bordi.
- Niente copie di opere esistenti.
- Dimensione esatta in pixel indicata per ogni file. PNG.
```

## 2. I 25 edifici

Una casella = 64 px. La pianta è lo spazio che l'edificio occupa sulla mappa; l'immagine è alta due
caselle in più per il tetto. Ogni edificio dello stesso villaggio deve sembrare costruito dalle stesse
mani; due case dello stesso villaggio devono distinguersi (tetto, camino, tenda, piante).

### moon — Rifugio sotto la città

Aspetto: rifugio sotterraneo: lamiera verde-acqua, tubi, lanterne calde, teli, cemento umido. Colori guida: tetto #2f6f66, muro #1d3a40, bordi #83cbb2, luce #ffd28a.

| File | Edificio | Pianta (caselle) | Immagine (px) | Porta: casella da sinistra |
|---|---|---|---|---|
| `casa_moon_inn.png` | locanda | 7 × 6 | 448 × 512 | 4ª di 7 |
| `casa_moon_shop.png` | bottega del mercante | 5 × 6 | 320 × 512 | 3ª di 5 |
| `casa_moon_smith.png` | fucina del fabbro | 4 × 6 | 256 × 512 | 2ª di 4 |
| `casa_moon_casa_1.png` | casa di abitanti | 5 × 5 | 320 × 448 | 3ª di 5 |
| `casa_moon_casa_2.png` | casa di abitanti | 3 × 4 | 192 × 384 | 2ª di 3 |

### cathedral — Quartiere della Cattedrale

Aspetto: quartiere gotico: pietra chiara consumata, tetti di ardesia bruna, vetrate ambrate, archi a sesto acuto. Colori guida: tetto #6d5a43, muro #3a3128, bordi #d6bd91, luce #ffe3a1.

| File | Edificio | Pianta (caselle) | Immagine (px) | Porta: casella da sinistra |
|---|---|---|---|---|
| `casa_cathedral_relic.png` | santuario delle reliquie | 10 × 7 | 640 × 576 | 5ª di 10 |
| `casa_cathedral_smith.png` | fucina del fabbro | 4 × 5 | 256 × 448 | 2ª di 4 |
| `casa_cathedral_info.png` | casa dell'informatore | 4 × 5 | 256 × 448 | 2ª di 4 |
| `casa_cathedral_shop.png` | bottega del mercante | 6 × 5 | 384 × 448 | 3ª di 6 |
| `casa_cathedral_casa_1.png` | casa di abitanti | 4 × 3 | 256 × 320 | 2ª di 4 |
| `casa_cathedral_casa_2.png` | casa di abitanti | 5 × 5 | 320 × 448 | 3ª di 5 |

### toxic — Bazar tossico

Aspetto: bazar tossico: lamiere e tende verdi, bidoni, tubi che perdono vapore verde, insegne luminose senza scritte. Colori guida: tetto #4b6a2e, muro #262f1f, bordi #9be15d, luce #b8ff7a.

| File | Edificio | Pianta (caselle) | Immagine (px) | Porta: casella da sinistra |
|---|---|---|---|---|
| `casa_toxic_smith.png` | fucina del fabbro | 5 × 4 | 320 × 384 | 3ª di 5 |
| `casa_toxic_shop.png` | bottega del mercante | 5 × 4 | 320 × 384 | 3ª di 5 |
| `casa_toxic_alchemist.png` | laboratorio dell'alchimista | 4 × 4 | 256 × 384 | 2ª di 4 |
| `casa_toxic_casa_1.png` | casa di abitanti | 3 × 4 | 192 × 384 | 2ª di 3 |
| `casa_toxic_info.png` | casa dell'informatore | 4 × 4 | 256 × 384 | 2ª di 4 |
| `casa_toxic_casa_2.png` | casa di abitanti | 5 × 4 | 320 × 384 | 3ª di 5 |
| `casa_toxic_casa_3.png` | casa di abitanti | 4 × 4 | 256 × 384 | 2ª di 4 |
| `casa_toxic_casa_4.png` | casa di abitanti | 5 × 3 | 320 × 320 | 3ª di 5 |

### clockwork — Avamposto ad ingranaggi

Aspetto: avamposto a ingranaggi: ottone e legno scuro, ruote dentate sui tetti, camini, luce ambra. Colori guida: tetto #7a5a2a, muro #33281a, bordi #e0a24a, luce #ffc766.

| File | Edificio | Pianta (caselle) | Immagine (px) | Porta: casella da sinistra |
|---|---|---|---|---|
| `casa_clockwork_smith.png` | fucina del fabbro | 6 × 4 | 384 × 384 | 3ª di 6 |
| `casa_clockwork_shop.png` | bottega del mercante | 6 × 4 | 384 × 384 | 3ª di 6 |
| `casa_clockwork_torre.png` | torre dell'orologio (abitazione) | 4 × 4 | 256 × 384 | 2ª di 4 |
| `casa_clockwork_relic.png` | santuario delle reliquie | 5 × 4 | 320 × 384 | 3ª di 5 |
| `casa_clockwork_info.png` | casa dell'informatore | 5 × 4 | 320 × 384 | 3ª di 5 |
| `casa_clockwork_casa_1.png` | casa di abitanti | 6 × 3 | 384 × 320 | 3ª di 6 |


## 3. Terreno e dintorni (4 tavole, una per villaggio)

File `terreno_<villaggio>.png`, 1024 × 1024 px, **senza** fondo magenta (è un'immagine piena), griglia
di 4 × 4 riquadri da 256 px che si ripetono senza giunture visibili:

1. strada battuta; 2. piazza lastricata; 3. bordo strada/erba o detriti; 4. acqua o canale;
5-8. le stesse quattro superfici con dettagli (tombini, crepe, pozzanghere, foglie);
9-12. recinzioni e muretti (orizzontale, verticale, angolo, cancello aperto);
13-16. dintorni: alberi o tubature, lampione, cassa/barile, fontana o pozzo.

Niente scritte. Stessi colori guida della tabella del villaggio.

## 4. Coerenza delle mappe (cosa deve tornare quando gli edifici sono posati)

- Ogni porta dà su una strada o sulla piazza: davanti alla porta il disegno non mette scale, vasi o
  recinti che chiudono il passaggio.
- I servizi (fucina, bottega, locanda, santuario) si riconoscono dal simbolo e dalla forma anche in
  bianco e nero; le case degli abitanti sono più basse e semplici.
- L'edificio più grande del villaggio (locanda di moon, santuario di cathedral) è il punto di riferimento:
  il più alto e il più illuminato.

## 5. Correzione

`T/palazzi_cattedrale` (lotto 3): nel portone del Bastione, in basso a destra, si vede il magenta di
fondo attraverso l'arco. Rifare la sola tavola con il portone chiuso e pieno.

## 6. Controlli che farà Claude alla consegna

Dimensioni esatte; fondo #FF00FF rimovibile senza aloni; nessun testo leggibile; porta nella casella
giusta; leggibilità in scala di grigi; SHA-256 nel registro dei derivati. Ciò che non passa viene
rimandato con il motivo, non corretto a mano.
