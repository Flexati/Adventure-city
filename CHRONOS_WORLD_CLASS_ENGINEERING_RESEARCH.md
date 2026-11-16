# CHRONOS ADVENTURE: NOX & LULÙ — WORLD-CLASS ENGINEERING & DESIGN RESEARCH (FASE 2)

**Documento:** Ricerca di Riferimento Ingegneristica e di Game Design (8 Dimensioni)  
**Progetto:** Chronos Adventure: Nox & Lulù (`work/chronos-adventure-commercial`)  
**Target Commerciale:** Titolo Premium Mobile/Web da `5,99 €`  

---

## 1. MOVIMENTO 2D ACTION-RPG E COMBATTIMENTO TATTICO

### Principi di Riferimento Mondiale
Nei migliori action-RPG 2D top-down/isometrici (es. *Hyper Light Drifter*, *Hades*, *CrossCode*), il combattimento non è mai uno scambio passivo di punti vita: si fonda su **impegno leggibile**, **finestre di invulnerabilità nette** e **contrattacco premiato**.

### Applicazione Architetturale in Chronos Adventure (`[FATTO]`)
- **Input Buffer di 6 Frame (`100 ms`, `INPUT_BUFFER = .1` in `game/campaign.mjs:377`):** Ogni pressione di `SCHIVA`, `SPARA` o `PULSE` effettuata durante gli ultimi istanti di un'animazione precedente viene memorizzata e rieseguita al primo tick utile. Il giocatore non percepisce mai «comandi mangiati».
- **Attivazione sul Fronte di Salita (`pointerdown`, D27 C1 in `game/runtime.mjs:856`):** Le azioni salvavita (`SCHIVA`, `DUO`, `ATTIVA`) partono al contatto del dito con il vetro, eliminando i `60–110 ms` di latenza tipici dell'evento `click`/`pointerup`.
- **Schivata Perfetta e Chrono Shift (`game/campaign.mjs:276, 386`):** Attraversare un attacco o un proiettile nei primi `0,14 s` (`0,20 s` in Overdrive) della schivata annulla il danno, ricarica `+14%` di Duo, attiva la finestra di contrattacco (`counterReady = 0,6 s`) e, per Nox, innesca il **Chrono Shift**: il tempo dei nemici e dei proiettili ostili scende a `×0,5` per `36 tick` (`0,6 s`), mentre Nox si muove e spara a velocità reale `1,0×`.

---

## 2. CHIMICA DEI PROTAGONISTI E DINAMICHE DEL COMPAGNO

### Principi di Riferimento Mondiale
Un duo memorabile non funziona se il secondo personaggio è un semplice spettatore o un clone statistico: i due protagonisti devono esprimere la propria personalità attraverso **verbi di gioco complementari** e una **presenza attiva sul campo**.

### Applicazione Architetturale in Chronos Adventure (`[FATTO]`)
- **Asimmetria Cinetica tra Nox e Lulù:**
  - **Nox (Controllo Spazio-Temporale e Precisione):** Usa `Chrono Shift` sulla schivata perfetta, impugna il fucile ad aghi `H-17 Needle` e la mitragliatrice `VX-9`, e sblocca mosse offensive ad alto impatto (`Impulso Chrono`, `Sfera d'Energia Oscura`, `Tempesta di Zero`, `Fendente Cinetico`, `Singolarità dell'Asse`).
  - **Lulù (Risonanza, Controllo Folla e Protezione):** Canalizza i nodi in `0,45 s` contro `0,80 s` (`campaign.mjs:271`), taglia all'istante le cime corazzate di *The Anchor* con `Onda di Risonanza`, dispiega la `Nova Sonica` (che distrugge i proiettili in volo, disinnesca le mine e genera cariche di scudo orbitanti) e usa l'`ARC-7 Choir` a catena elettrica.
- **Compagno IA Attivo (`game/campaign.mjs:404-406`):** Quando Nox e Lulù combattono insieme (Atti I, II e Finale Atto IV), il partner segue la linea di vista tramite pathfinding `routeWaypoint`, alza fisicamente la pistola nella direzione del bersaglio (`partnerPose` in `runtime.mjs:1026`) e fornisce fuoco di copertura automatico ogni `2,8 s`.

---

## 3. ARCHITETTURA NARRATIVA E SCELTE CON CONSEGUENZE REALI

### Principi di Riferimento Mondiale
Nei giochi narrativi d'autore, il mondo ricorda le decisioni del giocatore senza giudicarlo con barre di «bene/male» artificiali, facendo convergere ogni scelta nel terzo e quarto atto.

### Applicazione Architetturale in Chronos Adventure (`[FATTO]`)
- **Il Motivo Diegetico dei «Due Colpi»:** Nasce nella cassa d'apertura in prima persona (`#opening-surface`), ritorna sulle porte blindate dei quartieri (`#knock`) e accompagna l'ingresso in ogni edificio dei 14 villaggi (`● ● · DUE COLPI · ACCESSO STRUTTURA`), fino a spezzarsi drammaticamente nella tappa `zero` (`SECONDO COLPO ASSENTE` quando il legame radio tra Nox e Lulù viene interrotto prima della separazione).
- **Convergenza dell'Epilogo (`game/story-v08.mjs`, `game/narrative.mjs`):** Le scelte compiute in *Blackout* (Officina vs Rifugio), *Segni di Gesso* (Rotta di servizio vs Passaggio diretto), *Unità 9*, *EVE-Prime* (conservata o spenta), *La Linea* e i 14 archi regionali (`KEY_CHARACTER_ARCS`) modificano il parametro `thermal` (`0–100`), i dialoghi dei negozianti (`before`, `apart`, `after`) e le tavole finali del ricongiungimento.

---

## 4. LEVEL DESIGN, RITMO E SCOPERTA SEGRETA

### Principi di Riferimento Mondiale
Ogni livello deve alternare compressione (combattimento in arena/difesa) e decompressione (esplorazione di villaggio, segreti, guida), usando la geometria stessa per insegnare e premiare la curiosità.

### Applicazione Architetturale in Chronos Adventure (`[FATTO]`)
- **Piante Tattiche 24×24 Disegnate a Mano (`R26`, `game/painted-maps.mjs`):** Tutte le 13 mappe dipinte da `1536×1536 px` possiedono ostacoli solidi reali che bloccano sia il movimento sia i proiettili nemici, trasformando container, colonne della Cattedrale e vasche della Fonderia in coperture tattiche.
- **Forzieri Segreti e Radar di Risonanza (`game/village-art.mjs:898-935`):** Ogni tappa e ogni villaggio nasconde forzieri Chronos (`+3 vita`, `+25% Duo`, `+15 monete`, `+12 rottami`, ricarica munizioni). Il nuovo **Radar Segreto Chronos** (`computeTacticalHudState`) guida visivamente il giocatore entro `460 px` senza popup invasivi.

---

## 5. DIREZIONE ARTISTICA E LEGGIBILITÀ MOBILE

### Principi di Riferimento Mondiale
Su uno schermo mobile da `6 pollici`, la chiarezza visiva batte sempre il rumore decorativo: sagome distinte, contrasto WCAG elevato tra eroi e pavimento e indicatori di pericolo comprensibili anche in monocromia.

### Applicazione Architetturale in Chronos Adventure (`[FATTO]`)
- **Contrasto Misurato e Coerenza Pixel Art:** Rapporto di contrasto certificato `6,24:1` per Nox e `7,16:1` per Lulù sul pavimento del cantiere (`+38,8 punti` di separazione tonale); tutti i 25 ritratti dei negozianti e i 15 sfondi degli interni sono stati unificati in pixel art nitida (`imageSmoothingEnabled = false`, `R24`).
- **Telegraph Indipendenti dal Colore (`game/runtime.mjs:1162-1170`):** Gli attacchi nemici usano cerchi e linee **tratteggiate** durante la fase di inseguimento (`k < 0,55`) e diventano **continui con quattro tacche ortogonali** quando la posizione è bloccata (`lockCue`).

---

## 6. AUDIO DIRECTION E GAME FEEL

### Principi di Riferimento Mondiale
Il suono su mobile deve essere nitido sugli altoparlanti integrati dello smartphone, privo di basse frequenze fangose e sincronizzato al millisecondo con l'impatto visivo.

### Applicazione Architetturale in Chronos Adventure (`[FATTO]`)
- **Pulizia Spettrale (`game/audio-engine.mjs`):** Rimossi i droni sinusoidali a `48–86 Hz` e applicato filtro passa-alto a `380 Hz` ai sottofondi ambientali (`R16`), garantendo zero ronzio su speaker mobile e cuffie.
- ** stratificazione Sonora Contestuale (`D47`, `D61`):** Rumori di crollo differenziati per materiale (`bone_break`, `gear_break`, `toxic_splash`), avvisi sonori per l'ingresso dei bruti (`suspense_appearance`), l'ultima ondata (`suspense_final`) e l'apertura dei portali boss (`portal`).

---

## 7. ERGONOMIA TOUCH MOBILE E ACCESSIBILITÀ

### Principi di Riferimento Mondiale
Il giocatore non deve mai combattere contro i controlli: il pollice sinistro deve trovare il movimento ovunque cada, e il pollice destro deve poter scegliere tra tiro rapido assistito e mira direzionale precisa.

### Applicazione Architetturale in Chronos Adventure (`[FATTO]`)
- **Joystick Flottante Universale (`D16`, `game/runtime.mjs:864-872`):** Appoggiando il dito in qualsiasi punto libero della mappa compare l'anello del joystick che segue il pollice oltre il raggio massimo (`46 px` a piedi, `56 px` in guida), permettendo inversioni di direzione immediate con un micro-movimento.
- **Mira Ibrida Assistita / Manuale dalla Canna (`R28`, `game/campaign.mjs:508-514`):** Tocco rapido su `SPARA` per agganciare il bersaglio più vicino; trascinamento di oltre `12 px` per proiettare il raggio laser dalla canna con anello rosso sul nemico intersecato.

---

## 8. FOMO ETICO E MAGNETISMO COMMERCIALE A 5,99 €

### Principi di Riferimento Mondiale
Il vero FOMO di un capolavoro single-player non nasce da timer coercitivi o negozi a rotazione giornaliera, ma dalla **ricchezza di segreti, bivi narrativi, boss opzionali/distintivi e maestria meccanica** che spingono il giocatore a dire: *«Devo assolutamente scoprire cosa c'è dietro quella porta o cosa succede scegliendo l'altra rotta»*.

### Applicazione Architetturale in Chronos Adventure (`[FATTO]`)
- **14 Scelte Regionali Chiave (`KEY_CHARACTER_ARCS`):** Ogni villaggio offre un bivio strategico permanente (es. *Sigillo di risonanza* vs *Lampada del santuario* a Cathedral Quarter) che cambia sia i bonus di combattimento sia la cronaca finale.
- **«Gioca l'altra rotta» (`D22`, `game/runtime.mjs:780-786`):** Al termine dei titoli di coda, il Registro delle Scelte mostra le decisioni prese senza spoilerare le alternative e consente di riavviare la storia mantenendo l'intero arsenale, i potenziamenti e i turbo Vortex sbloccati.
