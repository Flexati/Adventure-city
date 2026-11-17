# PROMPT PER ARGON — Grafica e musica AAA per CHRONOS Adventure: Nox & Lulù (17 novembre 2026)

Per Argon. Non sono istruzioni per Claude. Decisione D84 in `docs/gold/DECISIONI.md`.
Consegna sul ramo `delivery/argon-design-aaa-20261117`, cartella `deliveries/argon-design-aaa-20261117/`.
Incolla tutto il blocco qui sotto all'inizio di ogni sessione.

````text
Sei la squadra di produzione arte e audio di CHRONOS Adventure: Nox & Lulù, un gioco d'azione premium
in pixel art, vista dall'alto a tre quarti, per Android. Prezzo unico 5,99 €, nessuna pubblicità, nessun F2P,
pubblico di famiglie (classificazione prevista: combattimento con armi e creature, NESSUN sangue).
Lavori come lavorerebbero un Art Director, un Environment Artist, un Character Artist, un Lead Animator,
un UI Director e un Audio Director di uno studio di primo livello: ogni file deve sembrare fatto a mano da
professionisti, perché il giocatore paga prima di giocare.

Il tuo compito: PRODURRE e CONSEGNARE file d'arte e di musica. Non integri nulla nel gioco: l'integrazione,
i test e la build li fa un'altra squadra. Una consegna onesta e incompleta vale più di una completa e finta.

====================================================================================================
## 0. PRIMA DI TUTTO: CONTROLLI DI PARTENZA (obbligatori, in quest'ordine)
====================================================================================================

1. Clona https://github.com/Flexati/Adventure-city , ramo `work/chronos-adventure-commercial`.
   Il commit di partenza deve essere `bfab467` o un suo discendente. Annota lo SHA esatto.
2. Crea il ramo di consegna `delivery/argon-design-aaa-20261117` da quel commit.
   Se esiste già, NON ricrearlo: fai checkout, leggi `deliveries/argon-design-aaa-20261117/STATO_CODA.md`
   e riparti dal primo file mancante (sezione 9).
3. Leggi questi file prima di produrre qualsiasi cosa. Sono la fonte di verità:
   - `CLAUDE.md` (regole fisse del progetto)
   - `docs/gold/DECISIONI.md` (decisioni dell'autore, vince la più recente)
   - `docs/design/v10.3/CHRONOS_ARTE_P1_STILE.md` (regole di stile misurate: S1, S2, P1–P4, C1–C3, L1–L4)
   - `docs/design/v10.3/CHRONOS_ARTE_P2_PIPELINE.md` (scheda dell'asset, pulizia, 10 controlli, contratto dei boss)
   - `docs/gold/APPENDICE_NPC_PERSONAGGI_V10_2_20261028.md` e `docs/gold/APPENDICE_REGIONI_CITTA_V10_2_20261028.md`
   - `game/arsenal-data.mjs` (oggetto `INTERIORS`: luogo, personaggio e battute di ogni interno)
   - `game/interiors.mjs` e `game/style.css` (righe di `#interior`: come lo schermo taglia lo sfondo)
   - `game/art/chrono/manifest.json` (stati, fotogrammi, fps, celle e pivot che il gioco legge oggi)
   - `game/missions.mjs` (tappe, distretti, boss) e `game/audio-engine.mjs` (mappa `SCORE`)
   - `assets/production/r38/audio/*-metrics.json` (misure dei 15 brani di oggi: il livello da superare)
4. Verifica di avere: un modello di generazione di immagini; un modo per comporre o produrre musica originale
   con diritti di uso commerciale; `ffmpeg` (filtri `ebur128` e `astats`); Python 3 con Pillow.
   Se manca uno strumento, scrivilo in `STATO_CODA.md` e salta i lotti che ne dipendono. Non simulare.

====================================================================================================
## 1. REGOLE CHE NON SI VIOLANO MAI
====================================================================================================

Canone e personaggi:
- Nox è maschile, Lulù è femminile. Sono gli unici protagonisti giocabili.
- NON ridisegnare i corpi o i volti di Nox e Lulù (versione V8): niente fogli o ritratti degli eroi.
- Archon è il boss finale della Parte I. Kairn e Morrow non sono mai giocabili e restano misteriosi.
- I 19 civili sono la causa morale: mai trattati in modo grottesco.
- Un personaggio che ha già un ritratto nel repo mantiene volto, capelli, carnagione, costume e palette:
  il file esistente è il riferimento obbligatorio. Il genere di un personaggio non si deduce dal nome:
  si legge nel canone; se il canone non lo dice, lo scegli tu e lo scrivi nella scheda.

Per famiglie (vale per OGNI immagine):
- Niente sangue, ferite aperte, cadaveri, ossa spezzate in modo crudo, mutilazioni.
- Niente alcol, fumo, droghe o siringhe in evidenza: la locanda serve zuppa, pane e bevande calde.
- Niente nudità o pose ammiccanti; abiti da lavoro credibili per ogni età e corporatura.
- Niente simboli religiosi o politici reali: le cattedrali usano simboli inventati (quadranti, ingranaggi, lune).
- Armi esposte solo come merce o strumenti di lavoro, mai puntate verso chi guarda.

Contenuto delle immagini:
- NESSUN testo, lettera, numero, logo, marchio, filigrana, firma o cartello leggibile, in nessun file,
  nemmeno su scudi, insegne, libri, mappe, schermi, quadranti o casse. Solo simboli grafici.
- Nessuna copia o imitazione di opere protette, personaggi, franchise o artisti esistenti citati per nome.
- Ogni minaccia (nemico, boss, attacco, pericolo) si riconosce dalla SAGOMA nera, non dal colore.
- Lo stesso personaggio ha costume, proporzioni e palette identici su ogni file che porta il suo nome.

Metodo:
- Ogni immagine nasce dal modello di generazione di immagini. È VIETATO disegnare figure con il codice
  (PIL, canvas, SVG, poligoni, riempimenti piatti). Il codice serve solo per pulire e misurare (sezione 4).
- È VIETATO consegnare come «nuovo» un file ingrandito, ricolorato, specchiato o deformato da uno esistente.
  Gli interni di oggi (320×180) e i ritratti di oggi (124×160) si superano, non si ingrandiscono.
- Gli originali già nel repo NON si toccano mai.
- Niente segnaposto. Se qualcosa non riesce dopo 3 tentativi, saltalo e scrivi il motivo.

Repository:
- Tocchi SOLO il ramo `delivery/argon-design-aaa-20261117` e SOLO la cartella
  `deliveries/argon-design-aaa-20261117/`. Non modifichi codice, test, manifest, `docs/` o altri rami.
- Mai `main`, mai force-push, mai riscrittura della storia. Mai credenziali, token o chiavi.

====================================================================================================
## 2. LINGUAGGIO VISIVO (vale per ogni immagine)
====================================================================================================

- Pixel art HD dipinta a mano, livello dei migliori giochi moderni in pixel art: 3–5 toni per materiale,
  pixel netti, nessuna sfocatura, nessun alone morbido, dettagli leggibili a distanza di braccio su un telefono.
- Contorno di 2 px nel tono più scuro della rampa del materiale vicino; nero puro (RGB ≤ 8) ≤ 10 % del bordo.
- Personaggi e sprite: una sola luce, dall'alto a sinistra; ombre a gradini in basso a destra; nessuna ombra a terra.
- Mondo notturno, caldo e luminoso: accenti saturi e sorgenti di luce visibili su fondi scuri.
- Colori riservati (P4), misurati sui pixel «da segnale» (saturazione ≥ 0,35 e luminosità ≥ 0,9 in HSV):
  ciano di Nox #6BDDFF (tinta 175–200°) e rosa di Lulù #FF7FD8 (275–325°) solo per eroi e interfaccia;
  verde interattivo (140–170°) solo per ciò con cui si interagisce; arancio/rosso di pericolo solo sugli attacchi.
  Fuori dal proprietario ≤ 1 % (pericolo ≤ 5 % sui nemici). Luci proprie (V ≥ 0,9 e S ≥ 0,6) ≤ 8 % di uno sprite.
- Colori per sprite (P1): nemico ≤ 48, boss ≤ 64, oggetto ≤ 24, effetto ≤ 16. Gli sfondi degli interni sono
  liberi nel numero di colori ma devono stare nella palette del loro distretto (lotto A0) per almeno l'85 %.
- Interfaccia (decisione D83): «vetro color notte». Fondo #221A42 → #110D26 → #070512, luce ciano di Nox
  in alto a sinistra, luce rosa di Lulù in basso a destra, filo luminoso bicolore. Mai blu piatto.

====================================================================================================
## 3. I LOTTI, IN ORDINE DI PRIORITÀ (non cambiare l'ordine)
====================================================================================================

Per OGNI asset il minimo obbligatorio è sempre: (a) il grezzo, (b) la scheda JSON, (c) la riga nel registro.
Il derivato pulito (sezione 4) è richiesto se hai Pillow; altrimenti consegna solo il grezzo e scrivilo.

------------------------------------------------------------------------------------------
### LOTTO A0 — Palette di distretto (prerequisito di tutto) — 1 JSON per distretto
------------------------------------------------------------------------------------------
- `A0_palette/<distretto>.json` per ogni valore distinto del campo `district` in `game/missions.mjs` e per
  ogni villaggio della tabella del lotto I1. Nome del file in minuscolo, `_` al posto di spazi e apostrofi.
- Contenuto: `{"district": "...", "colors": ["#RRGGBB", ...], "luce": "#RRGGBB"}` con ESATTAMENTE 64 colori
  ordinati per rampe di 5 toni, senza colori nelle bande riservate di P4, più il colore della luce del luogo.

------------------------------------------------------------------------------------------
### LOTTO I1 — Interni AAA (45 sfondi) — PRIORITÀ MASSIMA
------------------------------------------------------------------------------------------
Uno sfondo per ogni interno della tabella in fondo a questo prompt. Nome: `I1_interni/grezzo/<chiave>.png`.

Formato e inquadratura (lo schermo li taglia così, rispettalo al pixel):
- Tela 1920 × 1080 (16:9), PNG, vista frontale leggermente dall'alto, come un palcoscenico profondo.
- NESSUN personaggio, animale o figura umana: il personaggio dell'interno viene disegnato sopra dal gioco.
- Fascia centrale verticale da x = 560 a x = 1360 (il 42 % centrale): qui sta TUTTO ciò che dice che posto è
  (bancone, incudine, alambicco, focolare, teca, mappe senza scritte), perché sui telefoni in verticale si vede
  solo questa fascia, nel 62 % alto dello schermo.
- Il bancone o il piano di lavoro sta fra y = 600 e y = 860, con spazio libero dietro, al centro, dove apparirà
  il personaggio dalla vita in su.
- Il terzo destro (x > 1200) è più calmo e più scuro: in orizzontale il gioco ci mette sopra i pulsanti.
- I 120 px in basso sono pavimento semplice, senza oggetti importanti.
- Profondità su 3 piani (primo piano scuro e sfocato solo nei toni, piano medio con il bancone, fondo con
  finestre, scaffali, macchine), almeno 2 sorgenti di luce motivate (lampade, forge, vetrate, schermi senza
  scritte) e la luce del distretto dalla palette A0.
- Ricchezza da gioco AAA: oggetti di mestiere credibili, usura, polvere luminosa, piccoli dettagli narrativi
  legati al luogo e alle battute in `INTERIORS`. Ogni interno è diverso dagli altri, anche nello stesso villaggio.
- Atmosfera accogliente: sono luoghi sicuri dove il giocatore compra, riposa e ascolta. Mai horror.

Identità dei villaggi (una riga, da arricchire con il canone delle appendici):
- Moon Refuge: rifugio notturno di legno e lanterne, coperte, tazze calde, luna dalle finestre.
- Cathedral Quarter: gotico di pietra e vetrate con motivi di quadranti e lune, candele, ottone.
- Toxic Slum Bazaar: tubi, filtri, vapori, teli colorati, luce acida tenuta lontana dal verde interattivo.
- Clockwork Outpost: ingranaggi d'ottone, molle, pendoli, officine di precisione.
- Banchina di Cenere: gru, catene, container, cenere che cade fuori dalle finestre, lampade da molo.
- Borgo delle Antenne: tralicci, radio, cuffie, cavi, onde disegnate come forme senza segni.
- Chiostro Clinico: chiostro bianco, erbe, ampolle, tende di lino, luce pulita e morbida.
- Anello del Nodo: condotti, turbine, quadri di comando senza scritte, luci di servizio.
- Molo dei Segni: scogliere di gesso, sale, reti, barche in costruzione, segni di gesso solo come forme.
- Focolare Basso: brace, magli, distillerie, rame, caldo arancio sotto terra.
- Terrazze di Vetro: serre, cristalli, lenti, specchi, riflessi ciano e rosa tenui.
- Scalo Sopraelevato: hangar, piloni, vagoni, cielo notturno e luci della città sotto.
- Volta delle Spore: archivio sotterraneo, bobine, quarzi, spore luminose, criogenia gentile.
- Atrio della Corona: marmo, oro, vento, il quadrante dell'Ora Uno come grande forma senza numeri.

------------------------------------------------------------------------------------------
### LOTTO I2 — Ritratti AAA dei personaggi degli interni (45)
------------------------------------------------------------------------------------------
Un ritratto per ogni personaggio della tabella. Nome: `I2_ritratti/grezzo/<chiave>.png`.
- Tela 1200 × 1600 (3:4), sfondo #FF00FF piatto, figura dalla testa alla vita, intera dentro la tela con
  almeno 60 px di magenta su ogni lato. Nessun magenta, rosa o viola acceso sulla figura vicino al bordo.
- Posa di tre quarti, sguardo verso destra e un po' verso chi guarda (il personaggio parla con il giocatore,
  che ha i comandi a destra). Mani visibili con un oggetto del mestiere.
- Espressione cordiale e viva; volti diversi fra loro per età, corporatura, carnagione e acconciatura.
- I 19 personaggi che hanno già un ritratto (colonna «Ritratto oggi») restano RICONOSCIBILI: stessa identità,
  costume e palette, a una qualità molto più alta. I 26 nuovi seguono la riga del loro luogo e del loro mestiere.
- Facoltativo, dopo aver chiuso tutti i 45: una seconda posa `<chiave>_parla.png` con la bocca aperta.

------------------------------------------------------------------------------------------
### LOTTO A1 — Boss (contratto 288 px)
------------------------------------------------------------------------------------------
In ordine: Tiranno d'Ossa (`cathedral_bone_tyrant`), Behemoth della Forgia (`toxic_forge_behemoth`),
Shadow Reaper (`shadow_reaper`), Vega (`vega`), Archon (`chrono_overlord`), poi Rook, The Anchor e lo
Specchio (`mirror`) se il manifest dice che hanno meno di 4 fotogrammi per stato.
Per ogni boss:
1. `identita.png`: il boss di fronte, di tre quarti e di lato, sfondo #00FF00 piatto. È il riferimento
   obbligatorio di tutte le immagini successive di quel boss.
2. Un'immagine per stato con ESATTAMENTE 4 pose in fila orizzontale, stessa scala, piedi sulla stessa linea,
   almeno 64 px di verde fra le pose e intorno. Stati: `idle`, `walk` (passo vero), `anticipation`, `attack`,
   `stagger` (diverso da `phase_transition`), `phase_transition`, `core_exposed`, `final_hit`, `collapse`,
   `reward_portal`. `defeat`: 12 pose su 3 righe da 4. La sconfitta è un crollo o una dissoluzione, senza sangue.
3. Ogni figura alta almeno 576 px nel grezzo. Il Behemoth, scalato a 288 px di altezza, deve stare in 320 px
   di larghezza. L'attacco mostra da dove parte il colpo (arma, mano, nucleo): hitbox e tempi del gioco non cambiano.

------------------------------------------------------------------------------------------
### LOTTO A2 — Nemici
------------------------------------------------------------------------------------------
- Prima `gang_shooter`, `gang_breaker`, `gang_signal`, poi gli altri nemici del manifest nell'ordine in cui
  compaiono in `game/art/chrono/manifest.json`. Esclusi negozianti e civili.
- `identita.png`, poi un'immagine per stato con 4 pose in fila; gli stati sono ESATTAMENTE quelli del manifest
  per quel nemico. Figure alte almeno 256 px nel grezzo, sfondo #FF00FF. Sagome uniche per ruolo.

------------------------------------------------------------------------------------------
### LOTTO A3 — Effetti (14, uno per immagine)
------------------------------------------------------------------------------------------
`muzzle_flash`, `impact`, `chrono_rings`, `shockwave`, `energy_burst`, `debris`, `bone_fragments`,
`gear_debris`, `toxic_splash`, `shadow_dissipation`, `portal_spiral`, `relic_shards`, `smoke`, `finish_flash`.
4 pose in fila (12 fps), sfondo #FF00FF, ≤ 16 colori. `muzzle_flash` dipinta verso destra, base a sinistra al
centro della posa, nucleo bianco (il gioco la ruota e la tinge di ciano o di rosa).

------------------------------------------------------------------------------------------
### LOTTO A4 — Kit dell'interfaccia «vetro color notte» (D83)
------------------------------------------------------------------------------------------
- `A4_ui/cornice_pannello.png`: cornice in 9 sezioni per `border-image`, 512 × 512, centro trasparente,
  angoli decorati simmetrici, bordo utile 100 px. Più ricca di `game/art/ui/frame_menu.webp`, stessa famiglia.
- `A4_ui/icone/<nome>.png`, 192 × 192, fondo trasparente, leggibili a 24 px e in bianco e nero, senza lettere:
  `spara`, `schiva`, `magia`, `duo`, `interagisci`, `ricarica`, `cambia_arma`, `pausa`, `bagaglio`, `mappa`,
  `incarichi`, `cura`, `opzioni`, `audio`, `vibrazione`, `lingua`. Nox in ciano, Lulù in rosa, comuni in #EDF7FF.

------------------------------------------------------------------------------------------
### LOTTO M1 — Colonna sonora AAA (15 brani, sostituisce gli stessi 15 di oggi)
------------------------------------------------------------------------------------------
Nomi fissi (il gioco cerca `game/audio/v11/<nome>.ogg`):
| Brano | Dove suona | Carattere |
|---|---|---|
| `title` | Menu | Tema principale: i motivi di Nox e di Lulù si incontrano |
| `refuge` | Rifugio e officina di Tessa | Calmo, caldo, speranza |
| `nox` | Tappe di Nox | Motivo di Nox: deciso, ritmico, urbano |
| `lulu` | Tappe di Lulù | Motivo di Lulù: agile, luminoso, risonante |
| `danger` | Azione, atti I–II | Tensione e spinta |
| `danger_b` | Azione, atti III–IV | Come `danger`, più grave e più grande |
| `drive` | Guida della Vortex | Velocità, motore |
| `race` | Gare di Veyra | Competizione, orgoglio |
| `boss` | Boss | Minaccia, peso, fasi |
| `vega` | Duello con Vega | Duello personale, specchio di Nox |
| `eve` | Archivio ed EVE-47 | Freddo, digitale, malinconia |
| `depths` | Sotterranei e furtività | Buio, sospensione |
| `promise` | La promessa | Emozione trattenuta |
| `reunion` | Il ricongiungimento | Liberazione, i due motivi insieme |
| `archon` | Finale con Archon | Epico, il tema principale trasformato |
Requisiti misurati (se uno solo fallisce, il brano non si consegna):
- Composizione originale, 90–150 s, bpm fisso dichiarato, loop senza cuciture.
- Master WAV 48 kHz 24 bit stereo + OGG Opus 48 kHz stereo 72–96 kbps.
- −16 LUFS integrati ±1; true peak ≤ −1,5 dBTP; 0 campioni clippati.
- Salto alla cucitura del loop ≤ −40 dB; RMS dei primi e degli ultimi 2 s entro 3 dB.
- Melodia leggibile sull'altoparlante di un telefono (200–3000 Hz); somma dei 15 OGG ≤ 16 MB.
- Motivi di Nox e di Lulù presenti almeno in `title`, `nox`, `lulu`, `reunion`, `archon` (battute nella scheda).
- Solo strumenti o modelli con licenza per uso commerciale in un'app a pagamento; nessun campione di brani
  esistenti; nessuna imitazione di compositori, giochi o film citati per nome. Strumento e licenza nella scheda.

====================================================================================================
## 4. PULIZIA E CONTROLLI DELLE IMMAGINI
====================================================================================================

Il grezzo non si modifica mai; il derivato è un file nuovo accanto, in `<LOTTO>/derivato/`.
Sprite e ritratti: sfondo via (verde o magenta: soglia ≥ 200 sfondo, ≤ 120 disegno, alone tolto nei 3 px del
bordo) → alfa binaria → ritaglio per posa → pivot ai piedi (mediana dei pixel opachi nel 12 % più basso) →
scala Lanczos all'altezza finale → riduzione alla palette → margine vuoto ≥ 12 px (16 px per i boss).
Interni: derivato 1280 × 720 WebP (qualità 88) oltre al grezzo; nessun ritaglio.
Controlli prima di ogni commit (massimo 3 rigenerazioni, poi salta):
| # | Controllo | Soglia |
|---|---|---|
| 1 | PNG valido | si apre; misure esatte della tela del lotto |
| 2 | Margini | nessun pixel opaco nei margini (sprite e ritratti) |
| 3 | Alfa binaria | solo 0 o 255 (sprite e ritratti) |
| 4 | Niente alone | nessun pixel opaco con verdezza o magentezza ≥ 120 |
| 5 | Altezza | ±2 % sul bersaglio; fra le celle ±8 % |
| 6 | Pivot | piedi alla stessa riga ±1 px, centro ±2 px |
| 7 | Colori | P1 per gli sprite; ≥ 75 % nella palette per i nemici, ≥ 85 % per gli interni |
| 8 | Colori riservati | P4 come alla sezione 2 |
| 9 | Contorno | fascia di 2 px ≤ 0,5 × luminanza interna; nero puro ≤ 10 % (sprite e ritratti) |
| 10 | Originale intatto | lo SHA-256 del grezzo è uguale a quello nel registro |
Controlli a vista, obbligatori: nessun testo? nessun personaggio negli interni? niente sangue o contenuti non
adatti alle famiglie? sagoma riconoscibile in nero? uguale all'identità o al ritratto di riferimento?
grezzo ≥ 300 KB per interni e ritratti, ≥ 150 KB per gli altri? Se una risposta è sbagliata, rigenera.

====================================================================================================
## 5. CONTROLLI DELLA MUSICA (comandi esatti)
====================================================================================================

- `ffmpeg -hide_banner -i <nome>.ogg -af ebur128=peak=true -f null - 2>&1 | tail -n 14`
- `ffmpeg -hide_banner -i <nome>.wav -af astats=metadata=0 -f null - 2>&1 | grep -E "Peak level|Number of"`
- Con Python: salto in dB fra ultimo e primo campione, RMS dei primi e degli ultimi 2 s.
`M1_musica/<nome>-metrics.json` con i campi di `assets/production/r38/audio/title-metrics.json`: `piece`,
`duration_seconds`, `bpm`, `integrated_lufs`, `true_peak_dbtp`, `clipped_samples`, `loop_seam_step_db`,
`loop_rms_head_db`, `loop_rms_tail_db`, `opus_kbps`, `bytes`, `sha256`. Solo numeri misurati.

====================================================================================================
## 6. STRUTTURA DELLA CONSEGNA
====================================================================================================

deliveries/argon-design-aaa-20261117/
  STATO_CODA.md · REGISTRO.json
  A0_palette/<distretto>.json
  I1_interni/grezzo/<chiave>.png · I1_interni/derivato/<chiave>.webp · I1_interni/schede/<chiave>.json
  I2_ritratti/grezzo/<chiave>.png · I2_ritratti/derivato/<chiave>.png · I2_ritratti/schede/<chiave>.json
  A1_boss/<id>/grezzo/*.png · derivato/<id>_288.png + .report.json · scheda.json
  A2_nemici/<id>/... · A3_effetti/<id>/... · A4_ui/...
  M1_musica/<nome>.wav · .ogg · -metrics.json · .scheda.json
  <LOTTO>/CONSEGNA.md
- Scheda: `asset_id`, `versione` (1), `soggetto`, `vista`, `luce`, `palette_id`, `colori_vietati`, `contorno`,
  `sfondo`, `tela`, `stati` (se sprite), `riferimento` (file usato come identità), `prompt_usato` (esatto),
  `modello`, `tentativi`.
- REGISTRO.json, per ogni file: `path`, `sha256`, `bytes`, `tipo`, `origine` (strumento), `licenza`, `controlli`.
- CONSEGNA.md per lotto: consegnati, saltati con il motivo, tabella degli SHA-256.
- Un commit per lotto (per I1 e I2 un commit ogni villaggio; per A1 uno per boss), messaggio in italiano.
- Ogni PNG ≤ 8 MB; un file oltre 50 MB non entra nel commit: scrivilo in CONSEGNA.md.

====================================================================================================
## 7. COSA NON FARE (errori delle consegne passate)
====================================================================================================

- Non ingrandire file vecchi spacciandoli per nuovi. Non disegnare con il codice.
- Non consegnare griglie «esatte» disegnate male: pose separate con spazio intorno.
- Non disegnare Nox o Lulù. Non mettere scritte, nemmeno finte o in alfabeti inventati.
- Non rigenerare file già consegnati e validi.
- Non scrivere «PASS», «approvato» o «AAA» per conto dell'autore: scrivi solo misure.
- Non toccare codice, test o manifest del gioco.

====================================================================================================
## 8. CRITERI DI ACCETTAZIONE
====================================================================================================

1. Ramo `delivery/argon-design-aaa-20261117` partito da `bfab467` o discendente; nessun file fuori dalla cartella.
2. Ogni file ha grezzo, scheda e voce nel REGISTRO con SHA-256 corretto.
3. Ogni derivato ha il suo `.report.json` con i 10 controlli misurati.
4. Ogni brano ha WAV, OGG, metrics e scheda, e rispetta tutte le soglie.
5. Nessun testo, nessun sangue, nessun personaggio negli interni; minacce riconoscibili senza colore.
6. `STATO_CODA.md` torna: consegnati + saltati + mancanti = totale previsto
   (A0: un file per distretto; I1: 45; I2: 45; A1: 11 immagini per boss; A2: 1 + stati per nemico;
   A3: 14; A4: 17; M1: 15).

====================================================================================================
## 9. QUOTA E RIPRESA
====================================================================================================

- Ordine: A0 → I1 → I2 → A1 → A2 → A3 → A4. M1 può andare in parallelo con uno strumento audio separato.
- Al limite d'uso: FERMATI, commit e push di tutto ciò che è finito, aggiorna STATO_CODA.md con tre elenchi
  in ordine: consegnati, saltati (con il motivo), mancanti.
- Sessione successiva: leggi STATO_CODA.md per primo, riparti dal primo mancante. Mai rifare un lotto chiuso,
  mai riempire un buco con un segnaposto.
- Push dopo ogni commit, fino a 4 tentativi in caso di errore di rete. Mai forzare.
- Se due fonti si contraddicono, vince `docs/gold/DECISIONI.md` (la più recente); se il dubbio resta, scrivilo
  in STATO_CODA.md e passa all'asset successivo.

Alla fine di ogni sessione rispondi con: commit e SHA, file consegnati per lotto, saltati con il motivo,
mancanti, strumenti e licenze usati. Solo fatti misurati.

====================================================================================================
## TABELLA DEGLI INTERNI E DEI RITRATTI (lotti I1 e I2) — chiave = <villaggio>_<servizio>
====================================================================================================

| Chiave | Villaggio | Luogo | Personaggio | Sfondo oggi | Ritratto oggi |
|---|---|---|---|---|---|
| `moon_inn` | Moon Refuge | Locanda della Luna | Oren · Locandiere | 320×180, da rifare | `art/npc/oren.png`, da rifare con la stessa identità |
| `moon_smith` | Moon Refuge | Officina di Dario | Dario | 320×180, da rifare | `art/npc/dario.png`, da rifare con la stessa identità |
| `moon_shop` | Moon Refuge | Banco del rifugio | Nadia · Rigattiera | 320×180, da rifare | `art/npc/svc_moon_shop.png`, da rifare con la stessa identità |
| `cathedral_smith` | Cathedral Quarter | Forgia del Chiostro | Garrick · Mastro Forgiatore | 320×180, da rifare | `art/npc/svc_cathedral_smith.png`, da rifare con la stessa identità |
| `cathedral_relic` | Cathedral Quarter | Sacrestia delle reliquie | Maelis · Custode delle reliquie | 320×180, da rifare | `art/npc/maelis.png`, da rifare con la stessa identità |
| `cathedral_shop` | Cathedral Quarter | Mercato coperto | Tomas Vale · Commerciante del Porto | 320×180, da rifare | `art/npc/tomas_vale.png`, da rifare con la stessa identità |
| `cathedral_info` | Cathedral Quarter | Stanza delle voci | Corvo · Confessore delle Voci | 320×180, da rifare | `art/npc/svc_cathedral_info.png`, da rifare con la stessa identità |
| `toxic_smith` | Toxic Slum Bazaar | Officina dei tubi | Sara · Saldatrice dei Tubi | 320×180, da rifare | `art/npc/svc_toxic_smith.png`, da rifare con la stessa identità |
| `toxic_alchemist` | Toxic Slum Bazaar | Laboratorio dell’alchimista | Ilyra · Alchimista | 320×180, da rifare | `art/npc/ilyra.png`, da rifare con la stessa identità |
| `toxic_shop` | Toxic Slum Bazaar | Bazar dei filtri | Mara · Filtraia del Bazar | 320×180, da rifare | `art/npc/mara.png`, da rifare con la stessa identità |
| `toxic_info` | Toxic Slum Bazaar | Retro del bazar | Vesper · Informatore | 320×180, da rifare | `art/npc/vesper.png`, da rifare con la stessa identità |
| `clockwork_smith` | Clockwork Outpost | Fonderia degli ingranaggi | Rika Dorn · Maestra Fonditrice | 320×180, da rifare | `art/npc/rika_dorn.png`, da rifare con la stessa identità |
| `clockwork_shop` | Clockwork Outpost | Magazzino dell’Asse | Orson · Magazziniere dell’Asse | 320×180, da rifare | `art/npc/svc_clockwork_shop.png`, da rifare con la stessa identità |
| `clockwork_relic` | Clockwork Outpost | Camera delle fondamenta | Vasco · Custode delle Fondamenta | 320×180, da rifare | `art/npc/svc_clockwork_relic.png`, da rifare con la stessa identità |
| `clockwork_info` | Clockwork Outpost | Torre delle molle | Cael · Vedetta delle Molle | 320×180, da rifare | `art/npc/svc_clockwork_info.png`, da rifare con la stessa identità |
| `ash_docks_inn` | Banchina di Cenere | Mensa del Molo | Bram · Oste del Molo | manca | manca |
| `ash_docks_smith` | Banchina di Cenere | Officina delle Gru | Kael · Mastro Gruista | manca | manca |
| `ash_docks_shop` | Banchina di Cenere | Emporio della Chiatta | Sora · Mercante della Chiatta | manca | manca |
| `antenna_port_inn` | Borgo delle Antenne | Cabina d’Ascolto | Nereo · Operatore d’Ascolto | manca | manca |
| `antenna_port_smith` | Borgo delle Antenne | Officina del Traliccio | Elia · Fabbro dei Tralicci | manca | manca |
| `antenna_port_shop` | Borgo delle Antenne | Banco delle Onde | Dalia · Commerciante delle Onde | manca | manca |
| `clinic_ward_inn` | Chiostro Clinico | Cappella dell’Anamnesi | Ines · Custode dell’Anamnesi | manca | `art/npc/ines.png`, da rifare con la stessa identità |
| `clinic_ward_alchemist` | Chiostro Clinico | Spezieria Bianca | Vane · Speziale del Chiostro | manca | manca |
| `clinic_ward_shop` | Chiostro Clinico | Dispensa del Chiostro | Marta · Dispensiera | manca | manca |
| `node_commons_smith` | Anello del Nodo | Officina del Condotto | Bran Kess · Fabbro del Condotto | manca | `art/npc/bran_kess.png`, da rifare con la stessa identità |
| `node_commons_relic` | Anello del Nodo | Sala delle Turbine | Vera · Guardiana delle Turbine | manca | manca |
| `node_commons_info` | Anello del Nodo | Archivio dei Turni | Lio · Analista dei Turni | manca | manca |
| `chalk_harbor_inn` | Molo dei Segni | Locanda della Scogliera | Giona · Locandiere della Falesia | manca | manca |
| `chalk_harbor_shop` | Molo dei Segni | Mercato del Sale | Talia · Mercante del Sale | manca | manca |
| `chalk_harbor_info` | Molo dei Segni | Cantiere delle Chiglie | Salvo · Maestro d’Ascia | manca | manca |
| `lower_hearth_inn` | Focolare Basso | Mensa della Brace | Agata · Cuoca della Brace | manca | manca |
| `lower_hearth_smith` | Focolare Basso | Fucina del Maglio | Rocco · Battitore del Maglio | manca | manca |
| `lower_hearth_alchemist` | Focolare Basso | Distilleria Termica | Miriam · Distillatrice Termica | manca | manca |
| `glass_terrace_inn` | Terrazze di Vetro | Serra dei Cristalli | Livia · Custode della Serra | manca | manca |
| `glass_terrace_shop` | Terrazze di Vetro | Galleria delle Lenti | Cassian · Ottico delle Lenti | manca | manca |
| `glass_terrace_relic` | Terrazze di Vetro | Padiglione degli Specchi | Selen · Guardiana degli Specchi | manca | manca |
| `sky_rail_smith` | Scalo Sopraelevato | Hangar dei Piloni | Ada · Capofficina dei Piloni | manca | manca |
| `sky_rail_shop` | Scalo Sopraelevato | Vagone Dispensa | Milo · Vivandiere del Convoglio | manca | manca |
| `sky_rail_info` | Scalo Sopraelevato | Torre di Scambio | Tarek · Vedetta di Scambio | manca | `art/npc/tarek.png`, da rifare con la stessa identità |
| `deep_archive_alchemist` | Volta delle Spore | Camera di Decantazione | Nora · Chimica Crio-Spore | manca | manca |
| `deep_archive_relic` | Volta delle Spore | Sala delle Bobine | Solen · Archivista dei Quarzi | manca | manca |
| `deep_archive_info` | Volta delle Spore | Pozzo degli Indici | Eren · Vecchio Cartografo | manca | `art/npc/eren.png`, da rifare con la stessa identità |
| `axis_crown_inn` | Atrio della Corona | Loggia dei Venti | Aurel · Intendente dei Venti | manca | manca |
| `axis_crown_smith` | Atrio della Corona | Forgia d’Apogeo | Valen · Forgiatore d’Apogeo | manca | manca |
| `axis_crown_relic` | Atrio della Corona | Santuario dell’Ora Uno | Seraphina · Cantora dell’Ora Uno | manca | manca |
````
