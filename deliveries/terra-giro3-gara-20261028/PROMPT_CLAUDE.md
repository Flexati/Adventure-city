# Prompt per Claude — CHRONOS Adventure: gara, Terra giro 3

Agisci come produttore di asset per **CHRONOS Adventure: Nox & Lulù**, avventura d’azione premium offline per Android. Lavora direttamente nel repository privato **Flexati/Adventure-city**, ramo **delivery/terra-giro3-gara-20261028**. La base corretta è **work/chronos-adventure-commercial**. Non usare il repository amzajaguar-blip/City-Adventure-.

## Prima di produrre

Leggi integralmente:

- `requests/terra-giro3-gara-20261028/pacchetto/MISURE.json`
- tutti i file in `requests/terra-giro3-gara-20261028/pacchetto/modelli/`
- le maschere `<nome>_mask.png`
- `TAVOLA_SCALA.png`
- i file in `riferimenti/`
- `deliveries/terra-giro3-gara-20261028/STATO.md`
- `deliveries/terra-giro3-gara-20261028/PROVENIENZA.json`
- `deliveries/terra-giro3-gara-20261028/VERIFICA_AUDIO.json`

La cartella `prove_non_conformi/` contiene una rampa generata con dimensioni e margini errati. È solo una prova diagnostica: non copiarla, non adattarla e non dichiararla pronta.

## Direzione artistica

Pixel art dettagliata vista dall’alto 3/4, fantascienza industriale abitata, luce dall’alto a sinistra, coerente con i riferimenti in gioco. Ogni pixel deve avere funzione visiva o ludica. Usa marchi e scritte inventati; nessuna azienda reale.

## Regola obbligatoria per ogni immagine

Modifica il modello con la sua maschera:

- bianco nella maschera = area modificabile;
- trasparente = lascia esattamente il verde puro `#00FF00`;
- conserva dimensioni, tela e allineamento del modello;
- non ritagliare e non ridimensionare;
- salva come `<nome>_edit.png`;
- fuori maschera devono restare gli stessi pixel verdi;
- ostacoli e carichi riempiono il riquadro d’urto fino ai bordi, con al massimo 2 px di margine e base in basso;
- le rampe coprono tutta la maschera;
- la trave della gru attraversa tutta la tela da sinistra a destra;
- le versioni `_colpito` e `_night` derivano dalla tua versione normale o diurna, con sagoma identica;
- solo chiazze e fiamme possono sfumare verso il verde;
- rampe, chiazze, segnaletica e traguardi sono piatti;
- ostacoli e carichi sono dall’alto 3/4 come `race_container.png`.

Controlla ogni risultato con uno script: dimensioni uguali al modello, nessun pixel modificato fuori maschera, copertura conforme a `MISURE.json`, sagoma delle varianti entro ±2 px. Salva il rapporto dei controlli.

## Priorità 1 — Ash Docks

Produci per primi, nelle rispettive cartelle e con i nomi esatti:

### Rampe

- `race_pad_nitro_porto_edit.png`: piastra metallica scura a filo strada, bordo azzurro `#59E0FF`, tre chevron rivolti in alto, luci azzurre incassate.

### Sbarramento

- `race_barrier_gap_porto_edit.png`: due frecce verdi `#9FF7B8` rivolte in alto, vernice luminosa con contorno scuro.
- `race_barrier_post_porto_edit.png`: palo giallo e nero dall’alto 3/4, luce verde in cima, base in basso al centro.

### Ostacoli

- `race_obstacle_porto_bobina_edit.png`: bobina di cavo industriale su pallet con strisce giallo-nere.
- `race_obstacle_porto_bobina_colpito_edit.png`: stessa sagoma, ammaccature, cavo sfilacciato e vernice graffiata.
- `race_obstacle_porto_casse_edit.png`: casse da carico legate con cinghie arancioni su pallet.
- `race_obstacle_porto_casse_colpito_edit.png`: stessa sagoma, assi spaccate e una cinghia rotta.

### Gru e carichi

- `race_crane_beam_porto_day_edit.png`: trave continua d’acciaio scuro con strisce giallo-nere, binario e gambe sui marciapiedi.
- `race_crane_beam_porto_night_edit.png`: geometria identica, luce fredda e scura, segnalazioni ambra accese.
- `race_crane_trolley_porto_edit.png`: carrello grigio con fari e due cavi fino al bordo basso.
- `race_crane_load_porto_reti_edit.png`: pallet di sacchi nella rete, quattro funi convergenti al gancio.
- `race_crane_load_porto_reti_colpito_edit.png`: stessa sagoma, rete strappata e sacco aperto.
- `race_crane_load_porto_tubi_edit.png`: fascio di tubi d’acciaio, due cinghie e funi al gancio.
- `race_crane_load_porto_tubi_colpito_edit.png`: stessa sagoma, tubi piegati e cinghia allentata.

### Chiazze

- `race_slick_olio_a_edit.png`: olio nero lucido, riflessi iridescenti azzurri e rosa, forma irregolare e schizzi.
- `race_slick_olio_b_edit.png`: forma allungata differente, una pozza grande e due piccole, stessa resa.

### Fiamme nitro

- `race_nitro_flame_vortex_edit.png`: nucleo bianco, azzurro `#59E0FF`, coda blu; larga in alto e sottile in basso.
- `race_nitro_flame_veyra_edit.png`: nucleo bianco, corallo `#ED857C`, arancio e coda viola scuro.
- `race_nitro_flame_rivali_edit.png`: nucleo bianco, ambra `#F4BD72` e coda arancio scuro.

### Traguardo

- `race_finish_porto_edit.png`: due file di scacchi bianchi e neri, vernice consumata e chiodi catarifrangenti.

## Priorità 2 — Solkara e Aurelia Span

Dopo aver completato e controllato Ash Docks, produci:

- rampe: `race_pad_nitro_sabbia_edit.png`, `race_pad_nitro_ponte_edit.png`;
- ostacoli e relative versioni colpite: `race_obstacle_sabbia_cassa`, `race_obstacle_sabbia_cisterna`, `race_obstacle_ponte_barriera`, `race_obstacle_ponte_carrello`;
- chiazze: `race_slick_sabbia_a_edit.png`, `race_slick_sabbia_b_edit.png`;
- traguardi: `race_finish_sabbia_edit.png`, `race_finish_ponte_edit.png`.

Segui esattamente descrizioni, dimensioni, zone e tolleranze in `MISURE.json`.

## Suoni già presenti

In `deliveries/terra-giro3-gara-20261028/suoni/` ci sono 11 OGG Vorbis sintetizzati in modo originale; in `master/` ci sono i WAV e `sintesi.py` permette di rigenerarli:

- `race_nitro.ogg`
- `race_pad.ogg`
- `race_near_miss.ogg`
- `race_slick.ogg`
- `race_slick_sabbia.ogg`
- `race_perfect_start.ogg`
- `race_wheelspin.ogg`
- `race_eliminated.ogg`
- `race_medal_gold.ogg`
- `race_medal_silver.ogg`
- `race_medal_bronze.ogg`

Sono candidati tecnicamente conformi: Vorbis, 48 kHz, mono, picco sotto −3 dBFS e attacco entro 5 ms. Non risultano ancora ascoltati né provati nel gioco.

Ascoltali criticamente con cuffie e altoparlante piccolo. Valuta chiarezza, peso, differenza tra olio e sabbia, assenza di clic, resa delle fanfare e leggibilità nel mix. Se un suono è debole, modifica `sintesi.py`, rigenera WAV e OGG e aggiorna `VERIFICA_AUDIO.json`. Non usare campioni esterni. Mantieni le durate richieste; se l’encoder introduce una differenza, correggi il master affinché la durata OGG decodificata sia quella nominale entro 1 ms. Non dichiarare ascolto o test nel gioco se non li hai davvero eseguiti.

## Consegna Git

Usa esclusivamente il ramo `delivery/terra-giro3-gara-20261028`. Metti:

- immagini finali in `deliveries/terra-giro3-gara-20261028/immagini/`;
- suoni finali in `deliveries/terra-giro3-gara-20261028/suoni/`;
- master e sorgenti audio nelle cartelle già presenti;
- rapporti dei controlli nella directory di consegna.

Fai un commit separato per gruppo: rampe, sbarramento, ostacoli, gru, chiazze, fiamme, traguardo e suoni. Parti dalla priorità 1.

Aggiorna `PROVENIENZA.json` per ogni file con strumento, origine, data e condizioni d’uso reali. Aggiorna `STATO.md` con file completati, controlli eseguiti e blocchi misurabili. Se un file non riesce, saltalo e documentalo: il gioco conserva il disegno attuale.

Non inventare PASS, ascolti, approvazioni artistiche o test di gioco. Non inserire credenziali. Prima di concludere, mostra l’elenco esatto dei file creati e dei commit, con eventuali limiti ancora aperti.
