# CHRONOS ADVENTURE: NOX & LULÙ — AUDIT AVVERSARIALE SUI 5 PROFILI DI GIOCATORE (TIER 3.1)

**Ruolo:** Lead Game Designer Ciro & Red Team Audit  
**Repository:** `Flexati/Adventure-city`  
**Metodologia:** Analisi euristica avversariale su 5 archetipi di giocatore con simulazione comportamentale (`[SIMULAZIONE]`) e osservazione delle meccaniche (`[OSSERVATO]`).  
*Nota deontologica: Nessun dato in questo documento è attribuito a tester umani reali. Tutte le reazioni umane restano `[NON VERIFICATO]` fino all'esecuzione del protocollo su persone fisiche.*

---

## 1. Profilo A — L'Action Player (Hardcore Combat & Game Feel)

### Caratteristiche ed Aspettative
- Cerca reattività istantanea ai comandi, finestre di frame precise, hit-stop viscerale, nemici differenziati e profondità tattica.
- Odia i dialoghi lunghi non saltabili, le hitbox imprecise, la latenza di input su touch e i nemici spugna (bullet sponges).

### Valutazione Avversariale
- **Cosa lo aggancia:** L'hit-stop a 2/4/6 frame sui colpi pesanti (`G1`), il **Chrono Shift** (0,5x velocità nemici per 0,6s dopo un Perfect Dodge) e la rotazione rapida delle 5 armi con tasto dedicato e ricarica tattica.
- **Cosa lo annoia:** Le prime due scene se non può muoversi subito; le missioni di scorta in automobile se la fisica di guida sembra troppo rigida.
- **Cosa lo frustra:** Eventuali colpi subiti mentre il personaggio è ancora nell'animazione di recupero dopo uno scatto.
- **Momento più rischioso di abbandono:** Minuto 4 (`blackout` contro Rook): se pensa che il gioco sia un banale twin-stick shooter e si fa investire dalle mine senza usare il dash con invulnerabilità.
- **Cosa lo convince a continuare:** Battere Rook usando il disarmo e sbloccare la mitragliatrice a raffica VX-9 e il fucile pesante R-12; il boss puzzle The Anchor alla fine dell'Atto I.

---

## 2. Profilo B — Il Narrative Player (Story, World & Emotional Resonance)

### Caratteristiche ed Aspettative
- Cerca personaggi credibili con personalità distinte, scelte morali con conseguenze reali nel mondo, mistero, colonna sonora atmosferica e payoff emotivo.
- Odia il testo riempitivo, i dialoghi che spiegano l'ovvio, i personaggi intercambiabili e i finali affrettati o incoerenti.

### Valutazione Avversariale
- **Cosa lo aggancia:** Il prologo diegetico con i "Due Colpi", la cura per il dettaglio del frammento di vetro che "non serve a niente", e il rapporto naturale tra Nox (introverso, sintetico) e Lulù (ingegnosa, determinata).
- **Cosa lo annoia:** Sezioni di combattimento prolungate senza battute contestuali o avanzamento della vicenda (es. ondate 3 e 4 di `line`).
- **Cosa lo frustra:** Scoprire se una scelta morale è puramente cosmetica e non altera minimamente il destino dei personaggi.
- **Momento più rischioso di abbandono:** Minuto 10-12 (durante la prima guida narrativa `escape`): se percepisce la fuga come scollegata dalla storia dei civili del Moon Refuge.
- **Cosa lo convince a continuare:** La scena della separazione (`separation` / «La firma»): vedere Lulù usare la firma di Nox per salvare 19 sconosciuti a costo della loro unione è un gancio narrativo devastante che spinge all'acquisto immediato per vedere il ricongiungimento.

---

## 3. Profilo C — Il Casual Mobile Player (Accessibilità, Ergonomia & Chiarezza)

### Caratteristiche ed Aspettative
- Gioca su smartphone con sessioni brevi (5-15 minuti), spesso con una mano o durante spostamenti. Cerca interfaccia leggibile al sole, comandi chiari e nessun checkpoint punitivo.
- Odia i comandi touch microscopici o confusi, la perdita di progressi dopo una sconfitta, i testi minuscoli e i tutorial verbosi.

### Valutazione Avversariale
- **Cosa lo aggancia:** L'immediata comprensione dei tasti con le nuove icone semantiche al neon (`💥 SPARA`, `⚡ SCHIVA`, `⏳ PULSE`, `⚔️ DUO`), la generosa mira assistita di base per Nox, e i checkpoint prima di ogni boss.
- **Cosa lo annoia:** Esplorare gli hub 24x24 se non capisce dove andare per continuare la storia principale.
- **Cosa lo frustra:** Morire contro The Anchor perché non ha capito che i cavi andavano tagliati e ripartire dall'inizio della missione.
- **Momento più rischioso di abbandono:** Minuto 18 contro The Anchor se muore due volte consecutive per il raggio laser.
- **Cosa lo convince a continuare:** Il suggerimento di sconfitta contestuale (`DEFEAT_TIPS`: "Taglia i tre ancoraggi quando brillano di giallo") e il ripristino istantaneo di vita e munizioni direttamente davanti alla stanza del boss (`resumeAtBoss`).

---

## 4. Profilo D — Il Completionist (Collezionismo, Segreti & Maestria)

### Caratteristiche ed Aspettative
- Vuole esplorare ogni angolo della mappa 24x24, trovare tutte le stanze segrete, collezionare tutte le 5 armi con le relative modifiche al banco di Tessa, vincere tutte le 27 gare e sbloccare entrambi i finali.
- Odia i collezionabili mancabili per sempre (missable) senza New Game+, le missioni secondarie ripetitive senza ricompensa unica, e i muri invisibili ingiustificati.

### Valutazione Avversariale
- **Cosa lo aggancia:** La presenza dei 4 villaggi esplorabili con 2 incarichi secondari e 1 segreto ciascuno; le 20 sfide Vortex con medaglie; la forgiatura dell'arma finale H-17 Needle che richiede 2 componenti trovati in capitoli separati.
- **Cosa lo annoia:** Gare secondarie se i rivali hanno sempre la stessa intelligenza artificiale o le stesse linee di traiettoria.
- **Cosa lo frustra:** Finire la campagna e dover ricominciare da zero perdendo le armi sbloccate.
- **Momento più rischioso di abbandono:** Fine dell'Atto II se teme che le scelte morali blocchino definitivamente contenuti senza possibilità di recupero.
- **Cosa lo convince a continuare:** Lo sblocco esplicito di «Gioca l'altra rotta» (`D22`) nei titoli di coda con mantenimento integrale dell'arsenale e delle monete accumulate, e l'accesso al laboratorio gare post-game.

---

## 5. Profilo E — Il Critical Player (Scettico, Valore €5,99 & Qualità Tecnica)

### Caratteristiche ed Aspettative
- Analizza il gioco con occhio clinico: confronta il titolo con i classici del genere (Dead Cells, Hollow Knight, Katana Zero), cerca difetti di frame rate, audio clippato, sprite riciclati e "slop" procedurale. Si chiede a ogni schermata se il gioco valga davvero il prezzo di copertina di €5,99.
- Odia i contenuti allungati artificialmente, le musiche ripetitive a 8-bit non rimasterizzate, i font sgranati e i bug di salvataggio.

### Valutazione Avversariale
- **Cosa lo aggancia:** La fedeltà tecnica: 60 fps granitici (frame time p95 7,0ms), audio rimasterizzato a 48kHz stereo con convoluzione e randomizzazione micro-jitter, zero microtransazioni predatorie, grafica originale in SVG pixel-art non IA.
- **Cosa lo annoia:** Se le missioni di difesa (`city`, `line`) sembrano un'ondata fissa pensata per riempire il cronometro.
- **Cosa lo frustra:** Trovare incongruenze nella documentazione o promesse non mantenute tra store listing e gameplay effettivo.
- **Momento più rischioso di abbandono:** All'inizio del gioco, se la musica del titolo o gli SFX sembrano amatoriali o cacofonici; o ad Atto III se nota che 5 delle 9 regioni del lore non sono villaggi esplorabili a piedi.
- **Cosa lo convince a continuare:** La trasparenza totale del gioco (la demo gratuita che fa provare i primi 20 minuti senza trucchi), la profondità del puzzle-boss EVE-Prime che richiede mastery meccanica, e il fatto che la campagna dura 85+ minuti reali di puro gameplay concentrato senza pubblicità.

---

## 6. Matrice di Sintesi e Priorità Trasversali

| Problema Identificato | Profili Impattati | Rischio Abbandono | Intervento Effettuato / Necessario |
| :--- | :--- | :---: | :--- |
| Affaticamento uditivo da colpi e passi monotoni | A, C, E | **ALTO** | **RISOLTO:** Layer pitch/volume micro-jitter e audio del titolo cinematografico. |
| Pulsanti touch poco visibili o imprecisi | A, C | **ALTO** | **RISOLTO:** Overhaul pulsanti neon con illuminazione rim e feedback visivo. |
| Tempi morti di attesa a ondate ripulite | A, D, E | **MEDIO** | **RISOLTO:** Moltiplicatore ×1,25 a nemici ripuliti nelle missioni di difesa. |
| Chiarezza dell'offerta premium alla fine della Demo | B, C, E | **CRITICO** | **PRESIDIATO:** Schermata demo esplicativa con anteprima Atto III e New Game+. Richiede validazione con test umani fisici. |
