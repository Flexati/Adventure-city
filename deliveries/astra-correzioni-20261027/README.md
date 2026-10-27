# Correzioni Astra — 27 ottobre 2026

Repository: Flexati/Adventure-city. Ramo: delivery/astra-correzioni-20261027.
Base di riferimento: work/chronos-adventure-commercial, commit 756dc81.

**Consegna parziale dichiarata: 17 file esportati. Il punto 5 (G6/G7) resta aperto. Nessuna approvazione del team o integrazione in gioco dichiarata.**

## Contenuto

- G11: riesportazione del master, 32 celle 768×512, base della componente opaca principale a y493, scala unica 2.789473684210526. Nessun nuovo disegno del nucleo. Rapporto per cella: reports/G11.json.
- G12: segmento cavo e terminale separati, 64×64; segmento largo 20 pixel con prima/ultima riga RGBA identiche.
- G12: spazzata diritta 4×3, 2304×288, contenuto nella banda x16–575/y16–79 di ogni cella. Carica tratteggiata, lock continuo, colpo. L'estremo x576 è esclusivo.
- G4: strade giorno/notte 720×1440. Prime e ultime quattro righe identiche. Master ripuliti dagli oggetti ai bordi; raccordo tecnico nei 96 pixel terminali. Anteprime della giunzione incluse. Il risultato visivo in movimento resta da controllare in gioco.
- G8: tre icone H-17 128×128 con quattro finestre luminose. Anteprima a 48 pixel, colore/grigio, inclusa; controllo visivo dell'assistente, non approvazione umana.
- G5: due piloni singoli 128×256 e due nastri 64×32, stati distinguibili per geometria. Prima/ultima colonna del nastro identiche. L'orientamento e il raccordo dei piloni vanno verificati nel rendering del gioco.
- A2: race_count_beep, un bip di 0,22 s, e race_go di 0,85 s; entrambi FLAC e OGG a 48 kHz. Durate effettive decodificate OGG leggermente inferiori, riportate in reports/audio.json. Attacco al primo campione, picchi sotto −1 dBFS. Nessun ascolto umano effettuato.

## Punto 5: decisione necessaria, nessuna sostituzione consegnata

Le dimensioni 1305×1205 e 1305×1285 con griglia 4×4 producono celle logiche di 326,25×301,25 e 326,25×321,25. Piedi a y299/300 e y319 lasciano circa 1–2 pixel inferiori: non possono rispettare anche 12 pixel sotto i piedi. Non si può certificare contemporaneamente entrambi i vincoli.

Proposta da confermare: mantenere le basi runtime richieste e applicare 12 pixel di margine agli altri lati, isolando tutte le pose e i lampi. Alternativa: imporre il margine inferiore di 12 pixel, spostando le basi e quindi cambiando l'allineamento richiesto. Nox e Lulù non sono stati ridisegnati. I tre sheet da correggere restano nox_h17_gun.png, nox_h17_reload.png e lulu_arc7_gun.png. La ricarica ARC-7 conservata non è rifatta.

## Verifica e utilizzo

110 controlli automatici superati sui 17 file: dimensioni, basi del nucleo, bordi, rettangoli del VFX, campionamento, durata, picco e attacco audio. Non sono test di integrazione o un'approvazione artistica. Nessun test del gioco eseguito, perché il codice non è stato modificato.

Estrarre entrambi gli ZIP nella stessa directory. Verificare byte e SHA-256 con INDICE.json. Il manifest non elenca sé stesso, evitando un hash ricorsivo. Il manifest esterno include anche gli archivi. Gli archivi sono inferiori a 20.000.000 byte ciascuno.

Per riesportare: Python 3 con Pillow, NumPy, SciPy; FFmpeg con libvorbis e FLAC. Eseguire tools/export_core.py, tools/export_props.py, tools/export_ui.py, tools/build_audio.py e tools/verify.py. Gli script usano i master inclusi; versioni diverse degli encoder possono cambiare gli hash audio. Non modificano file di gioco.

Non prodotti: A1 «Due colpi», cancelli Aurelia Span, Veyra a piedi e tutti gli asset già accettati/conservati, salvo la riesportazione G11 richiesta esplicitamente.

Consultare PROVENIENZA.json per strumento, origine e condizioni d'uso di ogni file. I termini applicabili e i diritti sui riferimenti non sono sostituiti da questa consegna.
