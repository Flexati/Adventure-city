# PROMPT PER ARGON — tutti gli asset per un gioco di circa 150 minuti (12 novembre 2026)

Per Argon. Non sono istruzioni per Claude. Richiesta unica che sostituisce le due precedenti
(`requests/argon-durata-due-ore-20261112/`, `requests/argon-case-villaggi-20261112/`), che restano come dettaglio.

**Totale: 112 immagini (3 correzioni, 40 per le tappe nuove, 29 per i villaggi, 40 di animazione e volti) e 158 suoni (54 per le tappe nuove, 104 del giro 3).** Lavorare nell'ordine dei gruppi.
Consegna: ramo `delivery/argon-asset-giro2-20261110`, cartella `deliveries/argon-150min-20261112/<GRUPPO>/`, un commit per gruppo,
un `CONSEGNA.md` per gruppo con file consegnati / saltati (con il motivo) e SHA-256. Nessun segnaposto: meglio un file mancante che uno finto.

## PASSO 1 — Incolla questo per primo, in ogni chat

```
You are the art and audio production team for CHRONOS Adventure: Nox & Lulu, a premium top-down pixel-art
action game for Android (one-time price 5.99 EUR, no ads, no free-to-play mechanics). Work as a Lead Game
Designer, a UI/UX Director and an Audio Director would: every asset must look and sound like hand-crafted
work from a major studio, because the player paid for it up front.

WHAT IS ALREADY DONE — do NOT regenerate any of these:
- 15 painted shop interiors and 8 character portraits (first round).
- 8 race roads (Solkara day/storm, Aurelia day/dusk) and the Vortex car sheet.
- Enemy sheets: gang_shooter_a, gang_shooter_b (and their _v2), gang_signal_a, gang_signal_b,
  gang_breaker_a, gang_brute_a (and _v2). Ground: terreno_porto (and _v2).
Regenerating a finished image wastes quota that the missing ones need.

METHOD, mandatory:
- Every image must be created with your IMAGE GENERATION model. It is FORBIDDEN to draw images with code:
  no Python, PIL, canvas, SVG, matplotlib, no rectangles, circles, polygons or flat fills made by a script.
- Do not copy, scale, squash or recolour frames from reference files. Every pose is newly drawn.
- If the model cannot produce something, do NOT replace it with a placeholder: skip it and write why.
  A missing file is fine; a fake one is not.
- This round has NO "_v2" variants: one image per name. Spend the quota on coverage, not duplicates.

STYLE, the same for every image:
- Detailed 16-bit-era pixel art, 3 to 5 tones per material, 1-pixel dark outline, crisp pixels, no blur.
- Colourful and luminous: saturated accents and visible light sources against darker surroundings.
- The two hero colours are cyan #6BDDFF (Nox) and pink #FF7FD8 (Lulu) on deep navy #0B1626 with
  near-white #EDF7FF. Use them as the accent family of the whole interface.
- NO text, letters, numbers, logos, warning labels or watermarks anywhere, including on shields, signs,
  crates, screens and clock faces. No real brands. Original designs only.
- Enemies and hazards must be recognisable by SHAPE alone in a black silhouette, not by colour.
- Never draw the heroes Nox and Lulu.
- A character keeps the same costume, proportions and palette on every sheet that carries its name.

LAYOUT is free: no exact pixel grids. Follow the canvas size and background colour of each request, keep
every figure fully inside the canvas with empty space around it, figures never touching each other.
Sprites: flat #FF00FF background. Bosses: flat #00FF00 background. The game team cuts and aligns.

SELF-CHECK before delivering each image. Regenerate if any answer is yes:
1. Is any figure built from plain rectangles, circles or flat single-colour areas?
2. Is the PNG smaller than 150 KB?
3. Is there any text, letter or number anywhere in the image?
4. Does a character differ from its other sheet (costume, proportions, palette)?
5. Is this a file listed under "already done"?

QUOTA PROTOCOL:
- Work the groups strictly in the order given. Inside a group, in the order listed.
- When the image model reports a usage limit, STOP generating. Commit what is finished and write
  deliveries/argon-asset-giro2-20261110/STATO_CODA.md with two lists: files delivered so far, files still
  missing, in order.
- In the next session, read STATO_CODA.md first and resume from the first missing file. Never restart a
  finished group, never fill a gap with a placeholder.

PUBLISHING: only images, audio and CONSEGNA.md files, only on the branch
delivery/argon-asset-giro2-20261110, in deliveries/argon-asset-giro2-20261110/<GROUP>/. One commit per group.
Do not modify game code, tests or any other branch.
```

Per i gruppi **H1–H3** (edifici) aggiungi subito dopo questo secondo blocco:

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

## PASSO 2 — Gruppi in ordine di priorità

### P0 — Da rifare o finire (3 immagini)
1. `forge_behemoth_b.png` — foglio di reazione del golem di **bronzo** (il precedente era grigio). 1536×1024, fondo `#00FF00`, allegare `forge_behemoth_a` come riferimento.
2. `shadow_reaper_d.png` — quarto foglio del boss, stesso personaggio di a, b, c. 1536×1024, `#00FF00`.
3. `palazzi_cattedrale_v2.png` — rifare la tavola: nel portone del Bastione (in basso a destra) si vede il magenta di fondo attraverso l'arco; rifare con il portone chiuso e pieno.

## D1 — Vega, la tiratrice (boss del ramo di Lulù) · 5 immagini

Chi è: tiratrice scelta, fredda e precisa, che impone il proprio ritmo: tre colpi lenti, poi uno che arriva
quando lei decide. Donna adulta, alta e asciutta, cappotto lungo grigio-acciaio con fodera ambra, visiera
a fessura sopra un occhio, fucile lungo a canna doppia con un metronomo d'ottone sul calcio (senza numeri).
Sagoma: cappotto a campana + fucile molto più lungo del braccio. Colore d'accento: ambra `#FFB65C`.

| File | Tela | Contenuto |
|---|---|---|
| `vega_a.png` | 2048×1536, `#00FF00` | Foglio d'azione, figure alte ~288 px: fermo (4), cammina di lato (6), mira in ginocchio (4), sparo (4), ricarica (4) |
| `vega_b.png` | 2048×1536, `#00FF00` | Foglio di reazione, stesso personaggio: colpita (3), stordita (4), salto all'indietro (4), colpo caricato con bagliore ambra (6), sconfitta in ginocchio (5) |
| `vega_fx.png` | 1024×1024, `#FF00FF` | Effetti: proiettile ambra (4 fotogrammi), scia, impatto a terra (4), linea di mira tratteggiata (un tratto), bersaglio a terra che si stringe (4) |
| `portrait_vega.png` | 512×512, `#FF00FF` | Mezzo busto, tre quarti, sguardo verso il giocatore, stessa visiera |
| `arena_vega.png` | 1536×1536, piena | Arena vista dall'alto: binario sopraelevato dismesso al tramonto, quattro colonne spesse che fanno da riparo, parapetti, lampade ambra. Zona centrale libera. |

## D2 — Glass Flood, la città sommersa (ramo di Nox) · 9 immagini

Luogo: torri di vetro mezze allagate, passerelle di legno e lamiera fra i piani, acqua calma color
petrolio-turchese con riflessi ciano, lanterne dei pontili. Tutto visto dall'alto come le altre mappe.

| File | Tela | Contenuto |
|---|---|---|
| `terreno_glassflood.png` | 1024×1024, piena | Griglia 4×4 da 256 px ripetibile: passerella di legno, passerella di lamiera, acqua calma, acqua con corrente; le stesse con dettagli; bordi passerella/acqua (4); vetro rotto, tetto emerso, pontile, scala |
| `mappa_glassflood_a.png` | 1536×1536, piena | Quartiere dei pontili: passerelle che formano un percorso a S da sud a nord, tre isole (tetti emersi), due vicoli ciechi con una cassa |
| `mappa_glassflood_b.png` | 1536×1536, piena | La riva delle torri: grande piattaforma centrale rotonda (arena del boss) collegata da quattro passerelle, acqua tutto intorno |
| `oggetti_glassflood.png` | 1536×1024, `#FF00FF` | 12 oggetti separati: barca legata, lanterna su palo, rete, cassa galleggiante, boa, scala a pioli, ponte levatoio alzato, ponte abbassato, argano, bidone, mucchio di vetri, segnale luminoso senza scritte |
| `marea_glassflood.png` | 1024×512, `#FF00FF` | Animazione dell'acqua che sale sopra una passerella: 8 fotogrammi 256×256 (asciutta → coperta) |
| `abitanti_pontili_a.png` | 1536×1024, `#FF00FF` | Tre abitanti dei pontili (pescatrice anziana, ragazzo con remo, riparatore di reti), figure ~96 px: fermo (4) e cammina (6) per ciascuno |
| `abitanti_pontili_b.png` | 1536×1024, `#FF00FF` | Gli stessi tre: saluta (4), indica (4), seduto (2); più la persona da riportare a riva, ferita e sorretta (4) |
| `nemico_marea_a.png` | 1536×1024, `#FF00FF` | Nemico nuovo «sentinella di marea»: drone anfibio basso a tre zampe con una lente; fermo, cammina, emerge dall'acqua, attacca (figure ~96 px) |
| `nemico_marea_b.png` | 1536×1024, `#FF00FF` | La stessa sentinella: colpita, stordita, distrutta |

Per il boss di questa zona resta valida la richiesta già fatta: **`shadow_reaper_d`** (gruppo B del giro 3).

## D3 — Il porto di Veyra a piedi (Atto I) · 6 immagini

| File | Tela | Contenuto |
|---|---|---|
| `mappa_ashdocks_vicolo.png` | 1536×1536, piena | Vicolo del porto di notte visto dall'alto: container impilati che fanno da ripari, una gru, pozzanghere con riflessi, un garage con la saracinesca alzata a nord |
| `oggetti_ashdocks.png` | 1536×1024, `#FF00FF` | 12 oggetti: pezzo di motore luminoso (l'oggetto da recuperare), carrello, pallet, bidone acceso, catena, gancio di gru, cono, cassa attrezzi aperta, lampione, barriera, cavo arrotolato, graffito dell'orologio spezzato (solo simbolo: un cerchio con una crepa e due lancette, niente numeri) |
| `veyra_a.png` | 1536×1024, `#FF00FF` | Veyra a figura intera (~96 px), stessa donna del ritratto `portrait_veyra.png` allegato: ferma (4), cammina (6), appoggiata all'auto (2), indica (3) |
| `veyra_volti.png` | 1024×512, `#FF00FF` | Otto espressioni del ritratto: neutra, sorriso storto, sfida, sorpresa, rispetto, delusa, ride, seria |
| `garage_veyra.png` | 1920×1080, piena | Interno del garage in prima persona, come gli interni dei villaggi: la sua auto sul ponte, attrezzi, luce al neon ciano e ambra |
| `scheda_gara_presentazione.png` | 1920×1080, piena | Illustrazione della partenza: due auto affiancate sulla banchina di notte viste da dietro, gru e luci del porto sullo sfondo |

## D4 — La promessa (Atto II, scena nel rifugio) · 4 immagini

| File | Tela | Contenuto |
|---|---|---|
| `officina_rifugio.png` | 1920×1080, piena | Interno dell'officina del rifugio di notte, in prima persona: l'auto Vortex con il cofano aperto, banco da lavoro, lampada calda, pioggia alla finestra |
| `officina_rifugio_9x16.png` | 1080×1920, piena | La stessa scena composta in verticale |
| `vortex_motore.png` | 1536×1024, `#FF00FF` | Il vano motore visto dall'alto in 6 stati: guasto, pezzo sollevato, pezzo tenuto fermo, saldatura (scintille), raffreddamento, riparato e acceso |
| `mani_lavoro.png` | 1024×512, `#FF00FF` | Solo mani e avambracci con guanti (mai i volti): due mani che tengono un pezzo (ciano), due che saldano (rosa), 4 fotogrammi ciascuna |

## D5 — Moduli d'avvicinamento per le missioni più lunghe · 8 immagini

Ogni missione a piedi riceve un tratto in più prima dell'arena. Servono mappe dipinte intere, viste
dall'alto, 1536×1536, senza personaggi, con un ingresso a sud e un'uscita a nord, ripari e un vicolo cieco
per un segreto. Una per zona, nello stile del luogo già consegnato:

`avvicinamento_cantiere`, `avvicinamento_breccia`, `avvicinamento_clinica`, `avvicinamento_nodo`,
`avvicinamento_porto`, `avvicinamento_archivio`, `avvicinamento_linea`, `avvicinamento_asse`.

## D6 — Persone da aiutare e segreti · 6 immagini

| File | Tela | Contenuto |
|---|---|---|
| `civili_aiuto_a.png`, `civili_aiuto_b.png` | 1536×1024, `#FF00FF` | Otto civili diversi (età e corporature varie), ~96 px: nascosto/accovacciato (2), si alza (3), ringrazia (3), corre via (6) |
| `segreti_oggetti.png` | 1536×1024, `#FF00FF` | 12 oggetti-ricompensa che brillano: scheggia di vetro, ingranaggio, fiala, moneta antica, chiave, nastro, lente, batteria, medaglione, fiore di metallo, bussola senza lettere, piuma |
| `cassa_segreto.png` | 1024×512, `#FF00FF` | Cassa nascosta: chiusa, si apre (4 fotogrammi), aperta con luce |
| `icone_obiettivi.png` | 1024×1024, `#FF00FF` | 16 icone 256×256 senza testo: vai, attiva, difendi, proteggi, raccogli, parla, scorta, fuggi, boss, segreto, gara, ripara, aspetta, scegli, torna, completo |
| `mappa_citta.png` | 1920×1080, piena | Mappa illustrata della città con i nove luoghi come piccoli edifici riconoscibili, senza nomi scritti |

## D7 — Arene dei due boss già consegnati · 2 immagini (+ la correzione `forge_behemoth_b`)

| File | Tela | Contenuto |
|---|---|---|
| `arena_bone_tyrant.png` | 1536×1536, piena | Navata di una cattedrale in rovina vista dall'alto: pavimento a scacchi consumato, quattro file di colonne spezzate che fanno da riparo, vetrate cadute con fasci di luce ambra, ossa e candelabri; zona centrale libera |
| `arena_forge_behemoth.png` | 1536×1536, piena | Fonderia tossica vista dall'alto: pedane metalliche sopra vasche verdi luminose, quattro presse come ripari, tubi che sbuffano vapore, canale centrale libero |

Già chiesto nel giro 3 e ancora da fare: `forge_behemoth_b` (golem di bronzo, il precedente era grigio) e `shadow_reaper_d`.

## Suoni (solo con un modello di generazione audio) · 26 file

OGG 48 kHz, picco massimo −1,0 dBFS **misurato sul file decodificato**, nessun ronzio continuo sotto i
100 Hz, nessuna voce. Musiche in loop senza scatto.

- Musiche (8, 60–90 s in loop): `music_bone_tyrant`, `music_forge_behemoth`, `music_vega_duel`, `music_glass_flood`, `music_glass_reaper`,
  `music_docks_veyra`, `music_promise_workshop`, `music_approach_tension`.
- Ambienti (4, 30 s in loop): `amb_glass_flood_water`, `amb_docks_night`, `amb_workshop_rain`, `amb_rail_wind`.
- Vega (6): `sfx_vega_aim_tick`, `sfx_vega_shot`, `sfx_vega_charged_shot`, `sfx_vega_reload`, `sfx_vega_hurt`, `sfx_vega_defeat`.
- Glass Flood (4): `sfx_tide_rise`, `sfx_plank_step`, `sfx_sentinel_emerge`, `sfx_sentinel_hit`.
- Promessa e segreti (4): `sfx_weld_spark`, `sfx_part_hold`, `sfx_secret_found`, `sfx_civilian_thanks_chime`.



## H1–H3 — Le case dei villaggi (25 edifici + 4 terreni)

Dettaglio completo, con tabella dei file, delle piante e della casella della porta, in
`requests/argon-case-villaggi-20261112/README.md`. Riassunto: 25 PNG (uno per edificio, fondo `#FF00FF`, porta chiusa sul lato basso nella casella indicata, nessuna scritta),
più `terreno_moon.png`, `terreno_cathedral.png`, `terreno_toxic.png`, `terreno_clockwork.png` (1024×1024, griglia 4×4 da 256 px, ripetibile).

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



## A — Audio: tutto il gioco, circa 150 minuti

**Solo con un modello di generazione audio.** Se non c'è, non consegnare nulla e scrivere `A/CONSEGNA.md`: un suono sintetizzato da codice non vale come un suono vero.
Formato per ogni file: OGG, 48 kHz, picco ≤ −1,0 dBFS **misurato dopo la decodifica**, nessun ronzio continuo sotto 100 Hz, nessuna voce parlata, nessuna musica protetta. Loop senza scatto.

1. **Musica (14 brani, 90–150 s, loop):** una per atto più le nuove tappe — `music_act1_city_dark`, `music_act2_breach`, `music_act3_split_nox`, `music_act3_split_lulu`, `music_act4_one`, `music_bone_tyrant`, `music_forge_behemoth`, `music_vega_duel`, `music_glass_flood`, `music_glass_reaper`, `music_docks_veyra`, `music_promise_workshop`, `music_approach_tension`, `music_credits`.
2. **Ambienti (8 × 30 s, loop):** `amb_glass_flood_water`, `amb_docks_night`, `amb_workshop_rain`, `amb_rail_wind`, `amb_cathedral_nave`, `amb_forge_toxic`, `amb_village_day`, `amb_village_night`.
3. **Boss (24):** per Bone Tyrant, Forge Behemoth, Shadow Reaper, Vega, Rook, The Anchor: `sfx_<boss>_windup`, `_attack`, `_hurt`, `_phase`. Per Vega anche `sfx_vega_aim_tick`, `sfx_vega_charged_shot`, `sfx_vega_reload`, `sfx_vega_defeat`.
4. **Glass Flood, promessa, segreti (8):** `sfx_tide_rise`, `sfx_plank_step`, `sfx_sentinel_emerge`, `sfx_sentinel_hit`, `sfx_weld_spark`, `sfx_part_hold`, `sfx_secret_found`, `sfx_civilian_thanks_chime`.
5. **I 96 file di `requests/argon-interni-palazzi-20261109/GIRO_2_ANIMAZIONE_AUDIO.md`, gruppo A** (di cui 13 già consegnati: saltare quelli presenti in `deliveries/` del ramo di consegna) **più 8 nuovi:** `atto_1_apertura.ogg` … `atto_4_apertura.ogg` (4–6 s), `medaglia_oro.ogg`, `medaglia_argento.ogg`, `medaglia_bronzo.ogg`, `sblocco.ogg` (1–2 s).

## Gruppi già descritti altrove, da fare dopo i precedenti (40 immagini)

Descrizioni in `requests/argon-interni-palazzi-20261109/GIRO_2_ANIMAZIONE_AUDIO.md`: **M** apertura e menu (6), **V** volti che vivono (16), **G** gesti dei paesani (12), **F** animazioni d'ambiente (6).

## Rapporto finale di Argon

Per ogni file: consegnato / saltato con il motivo. Per i suoni: picco dopo decodifica e durata. Se si ferma per quota: `STATO_CODA.md` con consegnati e mancanti, nell'ordine; alla ripresa si parte dal primo mancante.
