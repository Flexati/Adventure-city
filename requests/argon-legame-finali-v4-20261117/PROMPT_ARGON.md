# PROMPT PER ARGON v4: il legame di Nox e Lulù e i cinque finali, grafica e suono (17 novembre 2026)

Questo prompt è per Argon, non per Claude. La decisione di riferimento è D90 in `docs/gold/DECISIONI.md`.

Si aggiunge ai prompt v2 (`requests/argon-design-aaa-v2-20261117/PROMPT_ARGON.md`) e v3 (`requests/argon-reputazione-archivio-v3-20261117/PROMPT_ARGON.md`), che restano validi. **Ordine di lavoro:** prima v2, poi v3, poi questo. Se l'autore chiede di dare la precedenza a questo, lo dice per iscritto.

- **Consegna:** sul ramo `delivery/argon-design-aaa-20261117`, nella cartella `deliveries/argon-legame-finali-v4-20261117/`.
- **Uso:** incolla tutto il blocco qui sotto all'inizio di ogni sessione.

````text
Sei la squadra di produzione arte e audio di CHRONOS Adventure: Nox & Lulù, un gioco d'azione premium in pixel art per
Android (5,99 €, per famiglie, nessun sangue).

Nel codice ora c'è un sistema nuovo, già funzionante con grafica provvisoria: il legame tra Nox e Lulù. Il tuo compito
è dargli grafica e suono da gioco di ruolo giapponese AAA. Il modello è quello delle storie d'amore più amate del
genere: pochi momenti piccoli e quotidiani, oggetti che diventano simboli, un tema musicale che ritorna e cambia
con le scelte, un finale che ripaga.

COME FUNZIONA (leggi il codice per capirlo, non modificarlo: `game/bond.mjs`, `game/story-v08.mjs`)
- Quattro momenti, ognuno con tre scelte, in quattro punti della storia:
  · «La tazza è ancora calda»: Atto I, al rifugio, prima del blackout.
  · «La radio gracchia la sua voce»: Atto III. Nox è solo nei livelli bassi e sente la voce di Lulù alla radio.
  · «Sotto la freccia c'è spazio per una parola»: Atto III. Lulù è sola e scrive col gesso su un muro del cantiere.
  · «Sette minuti di salita»: Atto IV, nell'ascensore dell'Asse, prima dello scontro finale.
- Il «cuore» si ricava da quelle scelte e da tre scelte che esistono già (il vetro, la promessa, la mano). Il
  giocatore non vede mai un numero: dopo ogni momento compare «Lulù lo ricorderà».
- Nel finale, con un cuore alto, Lulù interviene una volta quando Nox è quasi a terra: «Sono qui.»
- Sul tetto, dopo la mano, la storia si chiude in uno di cinque finali:
  · `ora_nuova`, «Ora nuova»: il più raro. Amore, fiducia, la mano presa, la città e gli stranieri dalla vostra parte.
    Le campane dell'Asse suonano per scelta per la prima volta.
  · `alba`, «L'alba insieme»: restano sul tetto mano nella mano finché la città si sveglia.
  · `attesa`, «Te lo chiederò prima»: si amano, ma la fiducia va ricostruita. Lulù parte con i convogli e lascia la
    frequenza aperta: «Quando sei pronto, chiamami.»
  · `compagni`, «Compagni di strada»: un'amicizia profonda. Domani si rifà un tetto insieme.
  · `strade`, «Due strade»: Nox parte per il Clockwork Outpost. Il frammento di vetro resta sul davanzale.

GLI OGGETTI-SIMBOLO (devono tornare identici in ogni tavola in cui compaiono)
- Le due tazze del rifugio: smalto crepato. Una color ciano scuro (di Nox, che non beve), una rosa antico (di Lulù).
- Il frammento di vetro «a niente»: trasparente, irregolare, grande come un palmo. Riflette ciano da un lato e
  magenta dall'altro.
- La radio di Lulù: a valvole, rattoppata, con una sola spia ambra. Nessuna cifra leggibile sulla scala.
- La freccia di gesso: bianca, tracciata a mano, con sotto un segno corto di gesso che NON si deve poter leggere. La
  parola la dice il dialogo, non l'immagine.
- L'ascensore dell'Asse: cabina di vetro e ottone, la città che scende sotto.

REGOLE CHE NON SI VIOLANO MAI
Valgono tutte le regole delle sezioni 2 e 3 del prompt v2 (canone, per famiglie, niente testo, niente imitazioni,
metodo, repository) e quelle del prompt v3. In più:
1. Nox e Lulù non si disegnano mai: né il volto, né il corpo, né di spalle, né in silhouette riconoscibile. Il gioco
   mette in scena i loro sprite V8 originali sopra le tue tavole. Per questo ogni tavola con un «palco» lascia libera
   la zona indicata, con un pavimento coerente su cui poggiano i piedi degli sprite. Le mani dei due non compaiono:
   lo raccontano gli oggetti (due tazze vicine, una giacca sulla spalliera).
2. È una storia d'amore per famiglie: tenerezza, mai sensualità. Al massimo una fronte sulla spalla o due mani vicine,
   suggerite dagli oggetti. Nessun bacio, nessun letto in scena, nessun indumento lasciato a terra.
3. Nessuna lettera, cifra o simbolo leggibile, nemmeno nella scritta di gesso o sulla scala della radio. Verifica con
   OCR come nei lotti precedenti.
4. Il cuore non si mostra mai come un numero o una barra. Le icone dicono «tre stati», non «quanti punti».
5. Kairn e Morrow restano misteriosi. Nel finale `strade` il Clockwork Outpost è solo una luce lontana.
6. Le minacce e i segnali si leggono anche senza colore: ogni icona va controllata in scala di grigi a 24 px.

PRIMA DI TUTTO: fai i controlli di partenza della sezione 1 del prompt v2:
- stesso ramo;
- merge normale del ramo di lavoro;
- un file STATO_CODA.md nella nuova cartella;
- strumenti verificati.
Pulizia, controlli, struttura, criteri e quota: segui la sezione 5 del prompt v2, senza cambiamenti.

## LOTTI, IN ORDINE

### L1. Le tavole dei quattro momenti (4), 1920 × 1080, pixel art dipinta, con il palco
Il palco è una fascia orizzontale centrale, dal 52 % al 86 % dell'altezza, con pavimento leggibile e nessun oggetto
alto davanti. Il gioco ci mette Nox e Lulù. La fascia centrale del 42 % in larghezza deve reggere il taglio verticale
del telefono.
- `moment_home_cup`: il rifugio di Old Town di notte. Davanzale largo, le due tazze (una fuma), le finestre di Vanta
  accese a decine fuori. Lampada calda dentro, città fredda fuori.
- `moment_radio_dark`: i livelli bassi sotto il Nodo. Buio di tubi e valvole, la radio posata su una cassa, la sua
  spia ambra unica fonte calda. Vapore lento.
- `moment_chalk_word`: il muro del Cantiere Est sotto la pioggia, la freccia di gesso fresca e lo spazio sotto, una
  pozzanghera che riflette la luce del cantiere.
- `moment_last_lift`: dentro la cabina dell'ascensore dell'Asse, a metà salita. Vetro, ottone, la città che scende,
  le nuvole sopra. Nessun pulsante con numeri.
File: `L1_momenti/grezzo/<id>.png`, più una copia `<id>_guide.png` con il palco segnato da un riquadro.

### L2. I dettagli dei momenti (8), 800 × 800, primo piano, su #FF00FF dove serve lo scontorno
Due per momento: uno «prima» e uno «dopo» la scelta, senza personaggi.
- `detail_cup_steam` e `detail_cup_two`: una tazza che fuma sola, poi due tazze vicine sul davanzale.
- `detail_radio_on` e `detail_radio_off`: spia accesa con le onde, spia spenta e polvere.
- `detail_chalk_arrow` e `detail_chalk_word`: la freccia sola, poi la freccia con il segno corto e illeggibile sotto.
- `detail_lift_glass` e `detail_lift_top`: il vetro della cabina con la città che scende, poi le porte che si aprono
  sulla luce viola dell'Asse.

### L3. Le tavole dei cinque finali (5), 1920 × 1080, pixel art dipinta, senza eroi
Stessa regola del 42 %. Sono lo sfondo della schermata «LA CITTÀ RICORDA».
- `ending_ora_nuova`: l'Asse all'alba con le campane in movimento. Sotto, i quartieri con tutte le finestre accese. In
  primo piano il davanzale del rifugio: due tazze e il frammento di vetro tra loro, che manda un riflesso ciano e uno
  magenta.
- `ending_alba`: il tetto del rifugio al sorgere del sole sulle ciminiere. Due tazze, due giacche sulla stessa
  spalliera.
- `ending_attesa`: il davanzale all'alba con la radio accesa, la spia ambra. In lontananza i fari di un convoglio che
  parte sulla strada.
- `ending_compagni`: un tetto in riparazione al mattino, con travi, saldatrice e due tazze su una trave.
- `ending_strade`: il davanzale vuoto con il solo frammento di vetro e una tazza. Lontano, una luce sola: il Clockwork
  Outpost. Malinconia, non tragedia.

### L4. UI ed effetti (6)
- `icon_remember`: 96 × 96, trasparente, 6 pose in fila. Due fili, uno ciano e uno rosa, si annodano. È l'icona
  accanto a «Lulù lo ricorderà». Deve restare leggibile a 24 px e in scala di grigi.
- `heart_{bassa,media,alta}`: 192 × 192, trasparente, senza lettere. Il frammento di vetro in tre stati: opaco e
  incrinato, limpido, con i due riflessi accesi. Vanno nell'Archivio accanto agli emblemi di Intesa del prompt v3.
- `plate_ending`: cornice a 9 sezioni per il titolo del finale, 1200 × 240, senza lettere, con il filo
  ciano-oro-magenta in alto. Gli angoli vanno ripetuti identici.
- `fx_love_aid`: 6 pose da 256 × 256 su #FF00FF. Due anelli concentrici, uno ciano e uno rosa, salgono attorno ai piedi
  dell'eroe e si chiudono. È il «Sono qui» di Lulù nel finale. La forma da sola deve dire «aiuto»: niente cuori, niente
  croci mediche.

### M4. Suono
Usa solo uno strumento musicale vero, con le stesse regole e soglie misurate del lotto M2 del prompt v2:
- LRA ≥ 3–4 LU;
- energia tra 800 e 3000 Hz ≥ 0,12;
- nessuna dissolvenza in coda nei loop.
Nessuna voce umana sintetizzata o clonata: per il canticchiare di Lulù usa un'ocarina, un fischietto o un flauto.
- `lulu_theme.ogg`: il tema di Lulù. Loop di 60–120 s con piano, archi leggeri e una scatola musicale «da radio». È la
  melodia madre: tutti i brani sotto la citano.
- `ending_ora_nuova.ogg`, `ending_alba.ogg`, `ending_attesa.ogg`, `ending_compagni.ogg`, `ending_strade.ogg`: cinque
  versioni del tema, 60–120 s. In ordine:
  · ora_nuova: orchestra piena e campane;
  · alba: piano e archi caldi;
  · attesa: piano solo, con un motivo di scariche radio a tempo;
  · compagni: chitarra e piccolo ensemble, passo leggero;
  · strade: violoncello solo, rado, con lunghi silenzi.
- `radio_hum.ogg`: ambiente per il momento della radio, loop di 30–60 s. Scariche, ronzio di valvole e, a tratti, il
  frammento del tema all'ocarina, lontano.
- Stacchetti senza loop, a −14 LUFS ±1:
  · `sting_remember`, 1–2 s: due note, come i «due colpi» del gioco, da suonare con «Lulù lo ricorderà»;
  · `sting_love_aid`, 2–3 s: il «Sono qui» nel finale;
  · `sting_ending_reveal`, 3–4 s: quando compare il nome del finale.

## INTEGRAZIONE (per sapere dove finirà ogni file; l'integrazione la fa Claude dopo la verifica)
- L1: sfondi delle scene dei momenti, con gli sprite V8 di Nox e Lulù sul palco.
- L2: inserti a schermo intero durante le reazioni.
- L3: `--ending-art` della schermata finale, scelta in base al finale.
- L4: Archivio, schermata finale e avvisi.
- M4: colonna sonora dei momenti, del tetto e della schermata finale.
I nomi dei file non si cambiano: il codice li cercherà così.

## TOTALI PER STATO_CODA.md
L1: 4 (+4 guide) · L2: 8 · L3: 5 · L4: 6 · M4: 9.

Alla fine di ogni sessione rispondi con:
- commit e SHA;
- file consegnati per lotto;
- file saltati, con il motivo;
- file mancanti;
- strumenti e licenze.
Riporta solo misure: non scrivere «PASS», «approvato» o «AAA» per conto dell'autore.
````
