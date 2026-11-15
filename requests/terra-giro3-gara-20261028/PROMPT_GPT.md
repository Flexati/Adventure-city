# Prompt per GPT — grafica della gara, Terra giro 3 (rifacimento a mano)

Incolla tutto il blocco qui sotto in GPT. Restituisci le immagini al team così come escono: misura, ritaglio e controllo li fa il team.

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù, avventura d'azione per Android. Disegna oggetti singoli per la gara di Ash Docks, un porto industriale di fantascienza.

STILE, UGUALE PER TUTTI
- Pixel art dettagliata, pixel netti e visibili, contorno scuro di 1 pixel attorno all'oggetto, ombreggiatura a gradini (niente sfumature morbide), luce dall'alto a sinistra.
- Vista dall'alto 3/4, come un container visto da una telecamera alta: si vede il tetto (circa 60% dell'altezza) e la faccia anteriore sotto (circa 40%).
- Materiali vissuti: ruggine, graffi, vernice consumata, bulloni, strisce di pericolo giallo-nere.
- Marchi e scritte inventati, nessuna azienda reale, nessun testo leggibile.

REGOLE DI COMPOSIZIONE, OBBLIGATORIE
1. Sfondo: verde puro #00FF00 piatto in tutta l'immagine. Niente ombra a terra, niente pavimento, niente riflessi o aloni verdi sull'oggetto.
2. Un solo oggetto, centrato, intero, che non tocca i bordi: 40 px circa di verde su ogni lato.
3. Rispetta le proporzioni indicate (larghezza:altezza dell'oggetto, non dell'immagine).
4. Nessun colore dell'oggetto vicino al verde #00FF00: le parti verdi richieste sono verde menta chiaro (#9FF7B8) o verde smeraldo scuro.
5. Le versioni «colpito» e «notte»: modifica l'immagine normale o di giorno che hai già prodotto, senza cambiare sagoma, proporzioni né posizione. Cambiano solo danni o luce.
6. Formato: PNG. Nome file esattamente come indicato.

OGGETTI (proporzione larghezza:altezza; misura dell'immagine)

Ostacoli in mezzo alla strada, 2:3, immagine 1024×1536
- gpt_obstacle_porto_bobina.png: bobina di cavo industriale in piedi su un pallet di legno. Disco superiore di legno con mozzo d'acciaio e bulloni, cavo scuro avvolto visibile sotto il disco, strisce giallo-nere sul pallet.
- gpt_obstacle_porto_bobina_colpito.png: la stessa, con disco ammaccato, rame sfilacciato che esce dal cavo, vernice graffiata, un'asse del pallet spezzata.
- gpt_obstacle_porto_casse.png: pila di casse di legno da carico su pallet, legate con cinghie arancioni, angolari metallici.
- gpt_obstacle_porto_casse_colpito.png: le stesse, con assi spaccate e una cinghia rotta che penzola.

Carichi appesi alla gru, 2:3, immagine 1024×1536. In alto al centro un gancio giallo; quattro funi dagli angoli del carico al gancio.
- gpt_crane_load_porto_reti.png: pallet di sacchi di juta chiusi in una rete di corda.
- gpt_crane_load_porto_reti_colpito.png: lo stesso, rete strappata e un sacco aperto con il contenuto che esce.
- gpt_crane_load_porto_tubi.png: fascio di tubi d'acciaio legati con due cinghie rosse; sotto si vedono le bocche dei tubi.
- gpt_crane_load_porto_tubi_colpito.png: lo stesso, due tubi piegati e una cinghia allentata e storta.

Gru a portale che scavalca la strada, 6:1, immagine 1536×1024 (la gru è una fascia orizzontale larga quanto l'immagine meno il margine)
- gpt_crane_beam_porto_day.png: vista dall'alto. Trave d'acciaio scuro che attraversa tutta la fascia da sinistra a destra senza interruzioni, binario per il carrello sopra, strisce giallo-nere sul bordo anteriore. Alle due estremità le gambe della gru, rosso ruggine con controventi a X, su carrelli con ruote.
- gpt_crane_beam_porto_night.png: la stessa gru di notte: luce fredda e scura, luci di segnalazione ambra accese su gambe e trave, con un piccolo alone caldo attorno.
- gpt_crane_trolley_porto.png, 1:2, immagine 1024×1536: il carrello della gru visto dall'alto, grigio con due fari e strisce di pericolo, e sotto due cavi d'acciaio verticali e paralleli lunghi quanto il carrello per tre volte.

Rampa nitro, piatta a terra, 1:1, immagine 1024×1024
- gpt_pad_nitro_porto.png: piastra metallica scura vista esattamente dall'alto, bordo azzurro brillante #59E0FF, tre chevron azzurri e bianchi che puntano verso l'alto dell'immagine, luci azzurre incassate negli angoli. Piatta: nessuna faccia laterale.

Chiazze d'olio, piatte a terra, 1:1, immagine 1024×1024
- gpt_slick_olio_a.png: chiazza d'olio nero lucido vista dall'alto, forma irregolare con qualche schizzo, riflessi iridescenti azzurri, rosa e viola. Bordi netti a pixel, non sfumati.
- gpt_slick_olio_b.png: seconda chiazza, forma allungata in verticale con una pozza grande e due piccole.

Paletto del varco, 1:2, immagine 1024×1536
- gpt_barrier_post_porto.png: paletto di segnalazione dall'alto 3/4, palo a fasce gialle e nere, testa metallica con luce verde menta #9FF7B8 accesa, base circolare d'acciaio in basso.

CONSEGNA
Comincia dagli ostacoli e dai carichi. Se un oggetto non rispetta le regole di composizione (sfondo non verde puro, oggetto tagliato o che tocca i bordi, proporzioni diverse), rifallo prima di passare al successivo. Per ogni file indica lo strumento usato. Non dichiarare controlli: li fa il team.
```

## Per il team

Le immagini di GPT non hanno la misura del gioco. Il team ne ricava l'oggetto dal verde e lo porta nel riquadro d'urto di `MISURE.json` a scala di pixel. Poi lo controlla con `tools/compose_terra_race_props.py` come le immagini disegnate in codice e le sostituisce solo se passano e sono giudicate migliori a occhio. Fiamme, frecce del varco e traguardi restano quelli disegnati in codice.
