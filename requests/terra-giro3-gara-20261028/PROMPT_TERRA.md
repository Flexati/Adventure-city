# Prompt per GPT 6.1 Terra — giro 3, grafica della gara

Incolla tutto il blocco qui sotto in Terra.

```
Giro 3 di CHRONOS Adventure: Nox & Lulù: la grafica dedicata della gara (rampe nitro, sbarramenti, ostacoli, gru a portale con carichi appesi, chiazze, fiamme del nitro, traguardo) e, se puoi produrre audio, i suoni della gara. Non serve l'ambiente di esecuzione: usa la modifica d'immagine con maschera e GitHub.

STILE
Pixel art dettagliata vista dall'alto 3/4, fantascienza industriale abitata, luce dall'alto a sinistra, come i riferimenti in gioco. Marchi e scritte inventati, nessuna azienda reale.

MATERIALE
Repository Flexati/Adventure-city, ramo work/chronos-adventure-commercial, cartella requests/terra-giro3-gara-20261028/pacchetto/:
- modelli/<nome>.png: la tela vuota, verde puro #00FF00, già ingrandita (per esempio 4 volte);
- modelli/<nome>_mask.png: la maschera, stessa misura. Bianco = puoi disegnare. Trasparente = lascia il verde;
- TAVOLA_SCALA.png: dove sta ogni oggetto sulla strada di Ash Docks, alla scala del gioco. Magenta = la zona del file, giallo = l'urto;
- riferimenti/: container in gioco (normale e colpito), auto di Veyra, pilone del checkpoint, strada della gru di giorno e di notte, la gara come appare oggi;
- MISURE.json: misure, riquadri obbligatori e posizione in gioco di ogni file.

REGOLA DELLE MISURE
L'urto in gioco non cambia: è la grafica che si adatta. Disegna solo dentro la maschera e riempila come chiede l'oggetto:
- ostacoli e carichi: la maschera è il riquadro dell'urto; il corpo la riempie fino ai bordi (al massimo 2 px di margine), base in basso;
- rampe: la piastra copre tutta la maschera (si attiva su tutta la larghezza);
- trave della gru: attraversa tutta la tela da sinistra a destra senza interruzioni;
- «_colpito» e «_night»: parti dalla TUA immagine normale o di giorno e modificala con la stessa maschera. Stessa sagoma, cambiano solo danni o luce;
- chiazze e fiamme possono avere bordi sfumati verso il verde; tutto il resto ha bordi netti;
- vista dall'alto: le rampe, le chiazze, i segnali a terra e il traguardo sono piatti; ostacoli e carichi si vedono dall'alto 3/4 come race_container.png;
- dove non c'è niente lascia il verde #00FF00. Stessa misura del modello: non ritagliare, non ridimensionare.
Salva ogni risultato come <nome>_edit.png (per esempio race_pad_nitro_porto_edit.png).

PRIORITÀ 1 — ASH DOCKS (in gioco adesso; le notti usano gli stessi file, tranne la gru)
RAMPE NITRO
- race_pad_nitro_porto (in gioco 116×124): Rampa nitro del porto vista dall'alto: piastra metallica scura a filo strada, bordo azzurro #59E0FF, tre chevron che puntano in ALTO (senso di marcia), luci azzurre incassate. Piatta: ci si passa sopra.

SBARRAMENTO
- race_barrier_gap_porto (in gioco 80×64): Segnale a terra del varco: due frecce verdi #9FF7B8 che puntano in alto, vernice luminosa con bordo scuro, su fondo trasparente (verde chiave).
- race_barrier_post_porto (in gioco 48×96): Paletto di segnalazione del varco visto dall'alto 3/4: palo giallo e nero con luce verde in cima. Base in basso al centro.

OSTACOLI (stessa sagoma dei container)
- race_obstacle_porto_bobina (in gioco 128×192): Bobina di cavo industriale su pallet, vista dall'alto 3/4 come race_container.png, strisce di pericolo giallo-nere sul pallet.
- race_obstacle_porto_bobina_colpito (in gioco 128×192): La stessa bobina colpita: ammaccature, cavo sfilacciato, vernice graffiata. Stessa sagoma.
- race_obstacle_porto_casse (in gioco 128×192): Pila di casse da carico legate con cinghie arancioni su pallet, vista dall'alto 3/4, marchi inventati.
- race_obstacle_porto_casse_colpito (in gioco 128×192): Le stesse casse colpite: assi spaccate, una cinghia rotta. Stessa sagoma.

GRU A PORTALE E CARICHI APPESI
- race_crane_beam_porto_day (in gioco 720×120): Gru a portale vista dall'alto: trave d'acciaio scura con strisce giallo-nere che attraversa la strada da sinistra a destra, binario per il carrello sulla trave, due gambe sui marciapiedi. Giorno.
- race_crane_beam_porto_night (in gioco 720×120): La stessa gru di notte: stessa geometria, luce scura e fredda, luci di segnalazione ambra accese sulle gambe e sulla trave.
- race_crane_trolley_porto (in gioco 64×112): Carrello della gru visto dall'alto, grigio con fari, e due cavi d'acciaio verticali che scendono fino al bordo basso.
- race_crane_load_porto_reti (in gioco 128×192): Carico appeso alla gru: pallet di sacchi chiusi in una rete con quattro funi che convergono in alto al gancio, visto dall'alto 3/4.
- race_crane_load_porto_reti_colpito (in gioco 128×192): Lo stesso carico colpito: rete strappata, un sacco aperto. Stessa sagoma.
- race_crane_load_porto_tubi (in gioco 128×192): Carico appeso: fascio di tubi d'acciaio legati con due cinghie, funi al gancio, visto dall'alto 3/4.
- race_crane_load_porto_tubi_colpito (in gioco 128×192): Lo stesso fascio colpito: tubi piegati, una cinghia allentata. Stessa sagoma.

CHIAZZE
- race_slick_olio_a (in gioco 160×176): Chiazza d'olio sull'asfalto vista dall'alto: nero lucido con riflessi iridescenti azzurro e rosa, bordi irregolari, qualche schizzo. Deve leggersi anche di notte.
- race_slick_olio_b (in gioco 160×176): Seconda chiazza d'olio, forma diversa (allungata, con una pozza grande e due piccole), stessi colori.

FIAMME DEL NITRO
- race_nitro_flame_vortex (in gioco 32×112): Fiamma del nitro della Vortex vista dall'alto: nucleo bianco all'uscita, poi azzurro #59E0FF, coda blu che sfuma. Larga in alto, sottile in basso.
- race_nitro_flame_veyra (in gioco 32×112): Fiamma del nitro di Veyra: nucleo bianco, poi rosso corallo #ED857C e arancio, coda viola scuro che sfuma.
- race_nitro_flame_rivali (in gioco 32×112): Fiamma del nitro dei rivali: nucleo bianco, poi ambra #F4BD72, coda arancio scuro che sfuma.

TRAGUARDO
- race_finish_porto (in gioco 460×40): Linea del traguardo dipinta sull'asfalto del porto: scacchi bianchi e neri su due file, vernice consumata, chiodi catarifrangenti.

PRIORITÀ 2 — SOLKARA E AURELIA SPAN (gare non ancora raggiungibili nella storia: dopo la priorità 1)
RAMPE NITRO
- race_pad_nitro_sabbia (in gioco 116×124): Rampa nitro di Solkara: piastra color sabbia e ruggine, bordo azzurro, tre chevron verso l'alto, un po' di sabbia sui bordi.
- race_pad_nitro_ponte (in gioco 116×124): Rampa nitro di Aurelia Span: piastra chiara di metallo spazzolato, bordo azzurro, tre chevron verso l'alto, linee ottiche.

OSTACOLI (stessa sagoma dei container)
- race_obstacle_sabbia_cassa (in gioco 128×192): Cassa da convoglio del deserto, telone color sabbia legato, segni dei convogli inventati, vista dall'alto 3/4.
- race_obstacle_sabbia_cassa_colpito (in gioco 128×192): La stessa cassa colpita: telone strappato, spigolo ammaccato. Stessa sagoma.
- race_obstacle_sabbia_cisterna (in gioco 128×192): Piccola cisterna d'acqua su slitta, metallo sbiadito dal sole, vista dall'alto 3/4.
- race_obstacle_sabbia_cisterna_colpito (in gioco 128×192): La stessa cisterna colpita: ammaccatura e un filo d'acqua. Stessa sagoma.
- race_obstacle_ponte_barriera (in gioco 128×192): Blocco di cemento chiaro da cantiere del ponte con fascia catarifrangente e una luce lampeggiante, vista dall'alto 3/4.
- race_obstacle_ponte_barriera_colpito (in gioco 128×192): Lo stesso blocco colpito: spigolo scheggiato, luce spenta. Stessa sagoma.
- race_obstacle_ponte_carrello (in gioco 128×192): Carrello di manutenzione dei ponti con bobine e strumenti ottici, vista dall'alto 3/4.
- race_obstacle_ponte_carrello_colpito (in gioco 128×192): Lo stesso carrello colpito: strumenti caduti, lente incrinata. Stessa sagoma.

CHIAZZE
- race_slick_sabbia_a (in gioco 160×176): Lingua di sabbia portata dal vento sull'asfalto: dune basse con increspature, colore #E8C27A, bordi sfumati.
- race_slick_sabbia_b (in gioco 160×176): Seconda lingua di sabbia, forma diversa (due cumuli uniti), stessi colori.

TRAGUARDO
- race_finish_sabbia (in gioco 460×40): Traguardo di Solkara: scacchi su due file dipinti su lastre, sabbia nelle fughe.
- race_finish_ponte (in gioco 460×40): Traguardo di Aurelia Span: scacchi su due file sul piano del ponte, linee ottiche azzurre ai lati.

SUONI (solo se puoi produrre audio; altrimenti scrivilo in STATO.md e salta questa parte)
OGG Vorbis, 48 kHz, mono, picco non oltre −3 dBFS, attacco entro 5 ms dal primo campione, nessun clic in coda. Suoni originali: niente campioni presi da librerie senza licenza dichiarata in PROVENIENZA.json.
- race_nitro.ogg, 0,9 s: accensione del nitro, colpo d'aria che sale con ronzio elettrico azzurro.
- race_pad.ogg, 0,4 s: scarica metallica breve della rampa e spinta.
- race_near_miss.ogg, 0,35 s: fruscio d'aria di un ostacolo sfiorato.
- race_slick.ogg, 0,6 s: gomme che slittano sull'olio.
- race_slick_sabbia.ogg, 0,6 s: gomme che affondano e sibilano nella sabbia.
- race_perfect_start.ogg, 0,5 s: due note brillanti che salgono.
- race_wheelspin.ogg, 0,6 s: gomme che pattinano alla partenza.
- race_eliminated.ogg, 0,8 s: ronzio basso che scende, auto eliminata.
- race_medal_gold.ogg, race_medal_silver.ogg, race_medal_bronze.ogg, 1,5 s ciascuno: brevi fanfare, la più ricca per l'oro.

CONSEGNA
Ramo delivery/terra-giro3-gara-20261028 di Flexati/Adventure-city, cartella deliveries/terra-giro3-gara-20261028/: immagini in immagini/, suoni in suoni/. Un commit per gruppo (rampe, sbarramento, ostacoli, gru, chiazze, fiamme, traguardo, suoni), cominciando dalla priorità 1. Aggiungi PROVENIENZA.json (strumento, data, condizioni d'uso reali per ogni file) e STATO.md (cosa è fatto e cosa no). Se un file non riesce, saltalo e scrivilo in STATO.md: il gioco tiene il disegno attuale finché non arriva.
Non serve dichiarare PASS: ricomposizione e controlli li fa il team. Non dichiarare ascolti, approvazioni o test non fatti. Nessuna credenziale nei file.
```
