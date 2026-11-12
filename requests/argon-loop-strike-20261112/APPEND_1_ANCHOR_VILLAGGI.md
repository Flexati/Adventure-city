# APPEND 1 al prompt «loop strike» — due difetti visti dall'autore sul telefono (12 novembre 2026)

Si incolla dopo il prompt principale. Ha la precedenza sull'ordine dei blocchi.

```
APPEND 1 — PRIORITA' ASSOLUTA, PRIMA DI OGNI ALTRO BLOCCO

L'autore ha giocato l'APK sul suo telefono Android e ha trovato due difetti. Risolvili per primi.

DIFETTO 1 — VILLAGGI SENZA ARTE (Moon Refuge e gli altri tre)
Cosa si vede: le case sono rettangoli verdi a tinta unita con un tetto piatto, il terreno è un acciottolato
ripetuto, non c'è una mappa dipinta, non c'è niente di caratteristico. Oggi le case le disegna il codice
perché le tue immagini dei villaggi non sono mai arrivate (ti sei fermato a terreno_moon.png, 1 su 29).
Cosa serve, in quest'ordine, un villaggio alla volta (moon, cathedral, toxic, clockwork):
 1. MAPPA INTERA DIPINTA del villaggio, 1536x1536, vista dall'alto, senza personaggi e senza scritte:
    strade, piazza, edifici con tetti e facciate sud, lampioni, piante, bancarelle, dettagli del luogo.
    Gli edifici devono stare ESATTAMENTE nelle posizioni della pianta del gioco (una casella = 64 px,
    griglia 24x24): leggi game/villages.mjs oppure la tabella in
    requests/argon-case-villaggi-20261112/README.md (pianta in caselle e casella della porta di ogni edificio).
    Le strade e la piazza devono restare libere dove la pianta ha '.' e ','.
    File: villaggio_moon.png, villaggio_cathedral.png, villaggio_toxic.png, villaggio_clockwork.png.
 2. LE CASE SINGOLE (25 PNG, fondo #FF00FF), come da requests/argon-case-villaggi-20261112/README.md,
    cosi' il gioco puo' anche disegnarle sopra l'eroe quando ci passa dietro.
 3. I 3 terreni mancanti (terreno_cathedral, terreno_toxic, terreno_clockwork).
 4. Oggetti di piazza per villaggio, 12 per foglio (fontana, bancarelle, panchine, lampioni, casse, piante),
    1536x1024, fondo #FF00FF: oggetti_moon, oggetti_cathedral, oggetti_toxic, oggetti_clockwork.
Carattere di ogni villaggio (deve riconoscersi a colpo d'occhio, niente case tutte uguali):
 - moon: rifugio sotterraneo, lamiere verde-acqua, tubi, teli, lanterne calde, finestre accese.
 - cathedral: pietra chiara, ardesia bruna, vetrate ambrate, archi, l'orologio dei tredici rintocchi.
 - toxic: lamiere e tende verdi, bidoni, pompe a mano, vapore verde, insegne luminose senza scritte.
 - clockwork: ottone e legno scuro, ruote dentate sui tetti, camini, luce ambra, automi fermi.
Autocontrollo: sovrapponi la pianta 24x24 alla mappa dipinta; ogni porta deve cadere sulla casella giusta
e nessun edificio deve coprire una strada. Se non coincide, rigenera.

DIFETTO 2 — SCATTI NEL COMBATTIMENTO CON THE ANCHOR (La breccia, tappa 8)
Cosa si vede: durante lo scontro con The Anchor il gioco va a scatti sul telefono (gli altri momenti no).
La causa e' nel codice, non nelle immagini: la correzione la fa Claude. A te chiedo solo:
 1. Se proponi codice sul ramo argon/loop-20261112, NON aggiungere a quella scena effetti che costano:
    niente ctx.filter, niente shadowBlur, niente gradienti creati a ogni frame, niente immagini oltre 2048 px.
 2. Rigenera gli effetti di The Anchor in versione leggera: anchor_cable, anchor_sweep e il nucleo come
    fogli a griglia regolare, celle di 128 px o 256 px, massimo 1024x1024 per foglio, pochi fotogrammi (4-6),
    fondo #FF00FF. Meno pixel da disegnare a ogni frame = meno scatti.
 3. Se nel leggere game/runtime.mjs e game/campaign.mjs trovi la causa (cose ricalcolate o ridisegnate a
    ogni frame quando il boss e' sveglio), scrivila in RAPPORTO_FINALE.md con file e riga. Non correggerla
    sul ramo del gioco.

Poi riprendi il loop dal blocco A.
```
