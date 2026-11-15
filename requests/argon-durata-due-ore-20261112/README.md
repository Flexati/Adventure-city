# Richiesta ad Argon: gli asset che mancano per le due ore di gioco (12 novembre 2026)

Questo file è una richiesta per Argon, non un'istruzione per Claude. Parole dell'autore: «fammi tutto il
gioco completo, assicurati che duri come ci siamo detti. E se non ci sono abbastanza asset per coprire
l'intera durata del gioco, mandami prompt per Argon».

**Perché serve.** [MISURATO, stima da bot, non da persone] la campagna oggi dura circa 42 minuti; l'obiettivo
è 105–120 (`docs/gold/PLAYTEST.md`). Il piano per arrivarci è `docs/gold/NARRATIVA_V10_3_DUE_ORE.md`:
cinque tappe nuove e missioni più lunghe. Per tre tappe **non esiste nessuna immagine**: Vega, Glass Flood,
il porto di Veyra a piedi. Senza queste tavole le tappe non si costruiscono (niente segnaposto).

**Come si usa.** In ogni chat si incolla per primo il blocco del §2 di
`requests/argon-interni-palazzi-20261109/GIRO_3_COMPLETO.md` (metodo, stile, autocontrollo, quota), poi un
gruppo alla volta nell'ordine qui sotto. Consegna: ramo `delivery/argon-asset-giro2-20261110`, cartella
`deliveries/argon-durata-20261112/<GRUPPO>/`, un commit per gruppo, con `CONSEGNA.md`.

Regole di sempre: nessun testo nelle immagini; mai disegnare Nox e Lulù; sprite su fondo `#FF00FF`, boss su
`#00FF00`; un personaggio resta identico su tutti i suoi fogli; le minacce si riconoscono dalla sagoma.

Priorità: **D1 → D2 → D3 → D4 → D5 → D6 → D7**. Totale: 40 immagini e 26 suoni. Obiettivo di durata del gioco: circa 150 minuti (`docs/gold/PIANO_DURATA_R20.md`).

---

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

## Rapporto finale di Argon

Per ogni file: consegnato / saltato con il motivo. Nessun segnaposto. Per i suoni: picco misurato dopo la
decodifica e durata.

## Cosa fa Claude alla consegna

Controlla dimensioni, fondo, assenza di testo, coerenza del personaggio fra i fogli, leggibilità in
scala di grigi; registra i derivati con SHA-256; costruisce la tappa solo quando il suo gruppo è completo.
Ciò che non passa torna indietro con il motivo scritto.
