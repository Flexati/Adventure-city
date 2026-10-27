# Prompt per GPT Astra — giro 3

Incolla tutto il blocco qui sotto in Astra.

```
Sei il produttore di asset di CHRONOS Adventure: Nox & Lulù, avventura d'azione premium offline per Android (pixel art dettagliata vista dall'alto 3/4, fantascienza industriale abitata, luce dall'alto a sinistra).

REPOSITORY E MATERIALE
- Repository: Flexati/Adventure-city. Ramo di riferimento: work/chronos-adventure-commercial. Non usare amzajaguar-blip/City-Adventure-.
- Richiesta: cartella requests/astra-giro3-20261027/ dello stesso ramo:
  · PROMPT_ASTRA.md (questo testo), README.md, INDICE.json (byte e SHA-256 di tutto);
  · MISURE_RIFERIMENTO.json: misure cella per cella degli sheet VX-9 e R-12 in gioco;
  · archivi/CHRONOS_GIRO3_PERSONAGGI.zip: sheet di riferimento in gioco (nox_vx9_gun/reload, lulu_r12_gun/reload), originali v05 di Nox e Lulù, ricarica ARC-7 conservata, misure, istruzioni;
  · archivi/CHRONOS_GIRO3_AMBIENTE.zip: segmento del cavo integrato, terminale respinto, strade respinte con i loro master, prova della giunzione, istruzioni.
- Istruzioni complete con tutte le misure: docs/gold/astra/ISTRUZIONI_ASTRA_GIRO3.md. Motivi dei rifiuti precedenti: docs/gold/ASTRA_INTEGRAZIONE_20261027.md, sezione «Correzioni 20261027».
Prima di lavorare verifica byte e SHA-256 dei due ZIP con INDICE.json.

GIÀ INTEGRATI, NON RIFARE
Nucleo, bitte, segmento del cavo e corsia della spazzata di The Anchor; audio A5; impatti C-9/VX-9/R-12; auto di Veyra, container, checkpoint stretti e larghi; ritratti di Kairn, Morrow e Veyra; musica e suoni delle gare, compresi bip e «via». Conservati senza rifacimenti: icone H-17 e ARC-7, ricarica ARC-7, VFX e audio H-17/ARC-7.

DA PRODURRE (due punti: G4 e G6/G7)

COME ESPORTARE: il generatore produce master di qualsiasi formato (1254×1254, 887×1774…). È normale. Il file finale si ottiene ridimensionando e ritagliando il master con Pillow al formato richiesto; dichiaralo in PROVENIENZA.json e consegna anche il master. Il controllo si fa sul file esportato.

1) G12 — terminale del cavo: NON produrre. L'ha sistemato il team su richiesta dell'autore.

2) G4 — RACE_ashdocks_road_day.png e RACE_ashdocks_road_night.png, 720×1440
I precedenti sono respinti: in scorrimento il tratteggio delle corsie si spezza a ogni tile (trattino tronco di 8–17 px, poi uno intero dopo soli 58 px, invece di trattini da 43 px ogni ~137 px), e il raccordo stirato lascia una fascia di pixel allungati su cordoli e ringhiere.
Richiesta:
- carreggiata x 130–590 a cinque corsie (va bene così);
- altezza della tile multipla esatta del passo del tratteggio: per esempio passo 144 px (trattino ~43 + spazio ~101), 10 periodi in 1440;
- nessuna riga duplicata: la riga 1439 prosegue nella riga 0;
- giunzione ridisegnata nel contenuto (crepe, sporco, bulloni), mai stirata o sfumata;
- nessun oggetto che attraversa il bordo alto o basso.
Procedura che evita i trattini troncati:
  a. genera il master SENZA segnaletica (asfalto, crepe, marciapiedi, ringhiere);
  b. ridimensiona finché la carreggiata è larga 460 px e ritaglia 720×1440 con la carreggiata a x 130–590;
  c. rendi la tile ripetibile in verticale: spostala di 720 px, ridipingi con l'editor la fascia che contiene la vecchia giunzione, riportala in posizione;
  d. disegna la segnaletica PER ULTIMA, in modo tecnico: 4 linee tratteggiate a x ≈ 222, 314, 406, 498, trattini di 43 px ogni 144 px a partire da y 0;
  e. notte: stessa geometria e stessa segnaletica, cambia solo la luce.
Nel rapporto: posizione e lunghezza di ogni trattino nelle colonne x 225 e x 315, e differenza media RGB tra la riga 1439 e la riga 0.

3) G6/G7 — nox_h17_gun.png, nox_h17_reload.png, lulu_arc7_gun.png
Decisione dell'autore: opzione A.
- Formati: tiro 1305×1205, ricarica 1305×1285, griglia 4×4. Celle logiche 326,25×301,25 e 326,25×321,25: la cella di colonna c e riga r parte da x = round(c×326,25), y = round(r×altezza cella). La ricarica 1305×1285 è voluta: segue il gioco.
- Riferimenti: nox_h17_gun → nox_vx9_gun; nox_h17_reload → nox_vx9_reload; lulu_arc7_gun → lulu_r12_gun.
- Piedi alla stessa y del riferimento, RIGA PER RIGA (±2 px), perché il gioco allinea le celle alla base:
  · nox_h17_gun: 299 / 300 / 292–294 / 273–274;
  · nox_h17_reload: 319 / 319 / 312 / 294;
  · lulu_arc7_gun: 300 / 300 / 294–297 / 273.
- Stessa scala, misurata SOLO sulla riga 0 (lato), dove la figura è intera e senza effetti sul bordo: dalla testa ai piedi Nox 267 px (tiro) / 281 px (ricarica), Lulù 250–254 px, ±3%. Righe 1–3: stesso fattore di scala della riga 0, controllato su testa, scarpe e spalle. NON usare il campo body_height delle righe 1–3 come obiettivo: dove il lampo è attaccato alla figura (per esempio Lulù riga 1 colonna 1, 300 px) comprende l'effetto. Questo risolve il conflitto che hai segnalato. Le consegne precedenti erano più piccole del 10% circa.
- 12 px di margine in alto, a sinistra e a destra. Sotto resta il margine che le basi lasciano: è voluto.
- Ogni posa isolata nella sua cella, senza frammenti della riga sopra o sotto. Lampi, fulmini e bossoli dentro la cella: se non ci stanno si accorciano, non sconfinano.
- Righe: lato, schiena, fronte, diagonale-schiena. Colonne del tiro: anticipo, rilascio, rinculo, recupero. Colonne della ricarica: abbassa, estrai, inserisci, pronta.
- NON ridisegnare Nox e Lulù: parti dagli sheet di riferimento e cambia solo arma, mani ed effetto. Nox è maschile, Lulù è la protagonista femminile. Non riusare gli sheet H-17/ARC-7 respinti in precedenza. La ricarica ARC-7 conservata non va rifatta.
- Nel rapporto, per ogni cella: rettangolo del contenuto, y dei piedi e altezza della figura senza effetti; per la riga 0 anche lo scarto dal riferimento.

NON PRODURRE
«Due colpi» (A1), cancelli di Aurelia Span, Veyra a piedi, e qualunque asset già integrato o conservato.

CONSEGNA
- Ramo delivery/astra-giro3-20261027 di Flexati/Adventure-city, cartella deliveries/astra-giro3-20261027/.
- ZIP sotto i 20.000.000 byte ciascuno, INDICE.json con byte e SHA-256 di ogni file e di ogni archivio, PROVENIENZA.json con strumento, origine e condizioni d'uso reali per ogni file, master inclusi, rapporti di misura richiesti sopra.
- Non dichiarare ascolti, approvazioni artistiche o test di gioco che non hai fatto. Se una richiesta non si può soddisfare, fermati su quel punto e spiega il conflitto con le misure, come hai fatto per G6/G7: non consegnare un compromesso non dichiarato.
```
