# CHRONOS ADVENTURE: NOX & LULÚ — Architettura di Gioco (2 Ore), Direzione UI/UX e Sound Design Premium (5,99 €)

**Ruolo:** Lead Game Designer (Master Platform/Action Designer Ciro) · UI/UX Director · Audio Director
**Target commerciale:** Prezzo unico **5,99 €** (zero pubblicità, zero microtransazioni, campagna completa offline)
**Riferimenti di progetto:** `D18` (prezzo 5,99 €), `D27`/`D29` (input C1/N1/N2, Hit-Stop G1, Chrono Shift CS), `D40` (villaggi pensati ed edifici visitabili), `D44` (mastering LUFS e carica difese ×1,25), `D50`–`D53` (interni dipinti, gare arricchite, movimento e suono naturali).

---

## 1. Reverse Engineering dei Riferimenti di Settore e Filosofia di Gioco

Per giustificare senza compromessi il posizionamento premium a **5,99 €**, la struttura di *Chronos Adventure: Nox & Lulù* applica il reverse engineering chirurgico di cinque capolavori del settore mobile/console indie-AAA:

1. **Katana Zero / Hyper Light Drifter (Game Feel, Telegrafi e Impatto):**
   - **Problema tipico su mobile:** controlli touch spugnosi, ritardo tra pressione e azione, telegrafi ambigui che puniscono il giocatore ingiustamente.
   - **Soluzione ingegnerizzata (`D27`, `D29`):**
     - **Attivazione sul fronte di salita (`pointerdown`, `C1`):** *Schiva*, *Duo*, *Attiva*, *Cambia arma* e *Ricarica* rispondono nel frame stesso del tocco (< **16,67 ms** a 60 fps), mai al rilascio del dito.
     - **Input Buffer di 100 ms (`N1`, 6 frame):** ogni comando premuto negli ultimi 100 ms di una schivata o di un recupero viene accodato ed eseguito al primo frame utile. I pulsanti in ricarica non vengono mai disattivati a morto: mostrano una barra di drenaggio cromatica e geometrica.
     - **Hit-Stop differenziato (`G1`):** fermo-posa visivo di **2 frame** (colpo standard), **4 frame** (rottura guardia / colpo pesante) o **6 frame** (crollo boss / taglio cima), accompagnato da sub-drop acustico a **95 → 28 Hz** (`hitStop`).
     - **Chrono Shift (`CS`):** una *Perfect Dodge* di Nox apre una finestra di **0,6 s** (36 frame, ricarica 3,0 s) in cui nemici, proiettili e mine rallentano a **×0,5** mentre Nox mantiene il **100 %** della velocità, incorniciata da un bordo ciano diegetico.

2. **Dead Cells / Hades (Asimmetria dei Protagonisti e Progressione dell'Arsenale V9):**
   - **Nox (Precisione Cinetica e Tempo):** pistola d'ordinanza **C-9** con **Quickdraw** (dopo *Schiva*, finestra di 1,0 s con recupero del tiro ridotto a **0,26 s**), fucile a raffica da tre colpi **VX-9** (sbloccato da Tessa dopo Rook) e fucile ad ago **H-17 Needle** (componente *The Anchor* nella Breccia + calibratore nell'Archivio dopo *EVE-Prime*).
   - **Lulù (Controllo Spaziale e Risonanza):** **C-9** + **Risonanza** ad area, **R-12** a rosata ravvicinata (banco di Tessa) e **ARC-7 Choir** a risonatore Eden (sbloccato abbattendo *Il Custode del Nodo* in *Ora Zero*).

3. **Sea of Stars / Pokémon Classici (Composizione Urbanistica dei 4 Villaggi e Interni in Prima Persona — `D40`, `D50`):**
   - Ogni quartiere (*Moon Refuge*, *Cathedral Quarter*, *Toxic Slum Bazaar*, *Clockwork Outpost*) è una pianta **24×24** autoriale distinta, costruita attorno a una **piazza centrale**, assi viari leggibili e **edifici rettangolari solidi** con porta sul lato sud.
   - Avvicinandosi a una porta (`< 150 px`), la soglia si illumina con il **doppio battito di riconoscimento (`● ●`)** e l'invito `ENTRA`.
   - Entrando in una struttura (`#interior`), la scena passa alla vista in prima persona con **15 interni dipinti** e **ritratti vivi (`D53`)** dotati di respiro, battito di ciglia periodico e oscillazione vocale quando l'interlocutore parla.

4. **Protocollo Diegetico «Due Colpi» e Registro Battiti Struttura (`#opening-beat-log`, `#knock-beat-log`, `#interior-beat-log`):**
   - Il gesto fondante di *Chronos Adventure* è **bussare due volte** («Se mi senti, batti due volte»). Nasce al secondo zero sulla cassa `EVE-47 · NOX SERIES`, ritorna sulle porte blindate della campagna e governa l'accesso agli edifici dei quartieri.
   - Il **Registro Battiti Struttura (`.beat-log`)** rende visibile, tattile e sonoro questo codice d'accesso:
     - Stato `0` (`data-beats="0"`): `REGISTRO BATTITI · ○ ○ · IN ATTESA` / `PORTA CHIUSA` (bordo ciano in ascolto).
     - Stato `1` (`data-beats="1"`): `REGISTRO BATTITI · ● ○ · PRIMO BATTITO` (viraggio ambra `#ffd27a`, colpo sordo a 145→68 Hz, impulso aptico di `18 ms`).
     - Stato `2` (`data-beats="2"`): `REGISTRO BATTITI · ● ● · ACCESSO RICONOSCIUTO` / `ACCESSO STRUTTURA` (sigillo smeraldo `#7dffd0`, doppia vibrazione `[18, 45, 24] ms`, apertura meccanica della paratia/porta).
     - All'interno di ogni edificio dei villaggi (`#interior-beat-log`), la targa dell'edificio espone il sigillo attivo `● ● · DUE COLPI · ACCESSO STRUTTURA` (o `◈ · INCONTRO DI QUARTIERE · ALL’APERTO` per i dialoghi in strada).

---

## 2. Architettura della Longevità (~2 Ore / 120 Minuti) e Suddivisione dei Capitoli

La durata complessiva è progettata su **115–130 minuti** (circa **2 ore** per una partita completa con esplorazione degli hub, incarichi e sfide della Vortex, fino a **2h 45m** includendo «Gioca l'altra rotta»), suddivisa in **4 Atti** e **31 tappe di campagna**, alternando sistematicamente **Tensione (Combattimento/Boss)**, **Velocità (Guida/Gare Veyra)** e **Respiro/Scelta (Villaggi/Interni/Dialoghi)**.

### Tabella Maestra del Ritmo e della Durata per Capitolo

| Atto | Capitoli / Tappe (`CAMPAIGN`) | POV | Meccanica Introdotta / Evoluta | Ritmo (Tensione / Rilascio) | Durata Stimata |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ATTO I**<br>*Il Risveglio e la Scelta* | 1. **Due colpi** (`opening`)<br>2. **Blackout** (`blackout` + Boss **Rook** + Scelta Batteria + Kit **Tessa**)<br>3. **Fuga dal Cantiere** (`escape`)<br>4. **Otto mesi dopo** (`home`)<br>5. **Moon Refuge** (`moon` Hub + Incarichi + **Veyra · Ash Docks**) | Nox → Entrambi | • Protocollo *Due Colpi* + Registro Battiti<br>• Movimento, Tiro assistito/mirato, Schiva, Relè<br>• Duello con Rook (mine + linea di tiro)<br>• Sblocco **Quickdraw**, **VX-9** e **R-12**<br>• Prima scelta morale permanente (*Officina* vs *Rifugio*) | **Curva d'ingresso:**<br>Intimità → Picco tattico (Rook) → Adrenalina (Guida) → Calore domestico e scoperta del primo villaggio | **26 – 30 min** |
| **ATTO II**<br>*La Frattura Condivisa* | 6. **Sotto la Breccia** (`breach` + Boss **The Anchor**)<br>7. **Verso la Clinica** (`drive 1`)<br>8. **Contagio** (`clinic` + Terminale **EVE-47**)<br>9. **Cathedral Quarter** (`cathedral` Hub)<br>10. **Ora Zero** (`zero` + Boss **Custode del Nodo**)<br>11. **Tetto del Porto** (`rooftop` — 4 scelte della Promessa)<br>12. **La Firma** (`separation` — Confine Demo / Sblocco 5,99 €) | Entrambi | • Boss vincolato da 3 cime (*The Anchor* + spazzata di corsia)<br>• Difesa presidiata (carica ×1,25 a ondata pulita)<br>• Sblocco **ARC-7 Choir** dal Custode<br>• Sistema termico delle scelte relazionali tra Nox e Lulù | **Crescendo drammatico:**<br>Cooperazione al massimo (*DUO*) → Scoperta del passato di Nox → Frattura emotiva e fisica | **34 – 38 min** |
| **ATTO III · A**<br>*Rotta di Lulù* | 13. **Cantiere Est** (`yard`)<br>14. **Segni di Gesso** (`exp_chalk_marks` + Scelta Rotta)<br>15. **Anello di Ferro** (`drive 2` — Camion / Droni)<br>16. **Porto** (`port` — Furtività e coni visivi)<br>17. **La Linea** (`line` — Difesa dei 19 civili) | Lulù (da sola) | • **Barriera** e controllo folla senza il fuoco di copertura di Nox<br>• Missione *Segni di Gesso* (fiasche di reagente + scelta *Diretta* / *Servizio*)<br>• Stealth puro al Porto con barra d'allerta | **Tensione civile e resistenza:**<br>Vulnerabilità iniziale → Astuzia (Stealth) →Assedio eroico sulla Linea | **20 – 24 min** |
| **ATTO III · B**<br>*Rotta di Nox* | 18. **Livelli Bassi** (`below` + Conseguenze del Gesso)<br>19. **Toxic Slum Bazaar** (`toxic` Hub + Preparazione Fabbro)<br>20. **Tunnel Muto** (`drive 3` — Guida al buio con Impulso)<br>21. **Sotto la Clinica / Archivio** (`archive` + Boss **EVE-Prime**)<br>22. **Clockwork Outpost** (`clockwork` Hub + Preparazione)<br>23. **Salita all'Asse** (`ascent` + Incontro **Kairn & Morrow**) | Nox (da solo) | • **Black Pulse** (overdrive offensivo)<br>• **Chrono Shift** contro un boss speculare (*EVE-Prime* che si adatta alle ripetizioni)<br>• Sblocco **H-17 Needle** completo<br>• Obbligo di preparazione artigianale nei 2 villaggi | **Discesa negli abissi e padronanza:**<br>Solitudine nel buio → Duello psicologico e meccanico (*EVE-Prime*) → Alleanza sulla Frattura | **22 – 26 min** |
| **ATTO IV**<br>*Il Diritto di Dire No* | 24. **Il Ritorno** (`reunion` — 3 varianti termiche)<br>25. **L'Ultima Evacuazione** (`drive 4` — Soccorsi)<br>26. **Il Nucleo / Finale** (`finale` + Boss **Archon** a 3 fasi)<br>27. **L'Asse Crolla** (`collapse` — Fuga a piedi)<br>28. **Dopo** (`aftermath` — Epiloghi dei 4 villaggi)<br>29. **Tetto all'Alba** (`rooftop_end` — Scelta della mano)<br>30–31. **Titoli di Coda & Outro** (`credits`, `postcredits` + *Gioca l'altra rotta*) | Entrambi | • Ricongiungimento dei kit completi (5 armi + *DUO* + *Chrono Shift*)<br>• Boss finale **Archon** (*La Custode* → *La Città* → *Lia*) + rottura del controllo tramite pressione prolungata (*Il diritto di dire no*)<br>• Epilogo reattivo a tutte le scelte e gli incarichi svolti | **Catarsi e Rilascio:**<br>Ricongiungimento → Apice meccanico ed emotivo (Archon) → Fuga → Riconoscenza della città | **18 – 22 min** |
| **TOTALE** | **31 Tappe + 4 Villaggi + 8 Incarichi + Serie Veyra** | **Nox & Lulù** | **5 Armi · 5 Boss · 9 Regioni · 26 Gare** | **Arco completo + Replay NG+** | **120 – 140 min (~2 Ore)** |

---

## 3. Specifiche UI/UX Director e Design dei Pulsanti (Standard 5,99 €)

### 3.1 Gerarchia Cromatica 60-30-10 e Materialità di Vanta
- **60 % — Ossidiana Notturna e Vetro Fumè (`#05080e`, `#07111dd9`, `#0b1626ee`):** superfici di fondo ad alto contrasto che lasciano respirare l'arte dei distretti e garantiscono leggibilità assoluta sotto la luce solare su schermi OLED/LCD mobile.
- **30 % — Acciaio Brunito e Ottone Meccanico (`#182c42`, `#88bad155`, `#f6e2a6`):** cornici smussate, indicatori di munizioni/monete (`◈`) e lancette vive dell'orologio di Vanta.
- **10 % — Accenti Bi-Protagonista e Semantica di Combattimento:**
  - **Ciano Nox (`#6bddff` / `#59e0ff`):** precisione, *Chrono Shift*, tiro primario in POV Nox, sblocco ricarica.
  - **Magenta Lulù (`#ff7fd8` / `#e08aff`):** *Risonanza*, *Barriera*, tiro primario in POV Lulù.
  - **Oro/Smeraldo (`#ffe1a1` / `#7dffd0`):** *DUO* pronto, relè attivato, secondo battito riconosciuto (`data-beats="2"`).
  - **Corallo/Ambra (`#ff6343` / `#ffd166`):** telegrafi di minaccia (tratteggiati in aggancio, continui con tacche cardinali quando fissati, leggibili anche senza percezione del colore — regola 8).

### 3.2 Anatomia Fisica e Micro-Feedback dei Pulsanti
Ogni pulsante rispetta il contratto ergonomico mobile (`tests/mobile-ui-contract.test.mjs`) con target minimi rigorosi (**48×48 px** base, **52 px** azioni secondarie, **58 px** CTA menu, **64 px** *Spara* e *Hold*, **65 px** pedali guida, **84 px** scelte morali):
1. **Stato Riposo (Rest):** gradiente metallico a 165° (`#182c42 → #0f1d2e`), filo di luce speculare superiore (`inset 0 1px 0 #ffffff24`) e ombra profonda (`0 6px 16px #00000075`).
2. **Stato Primario (`.primary` / `#gun`):** lamina ad alta luminanza (`#b5f7f3 → #68c9e8 → #3ea4cb`), testo inciso scuro (`#081726`) con controbordo di luce bianca e spazzata periodica di riflesso (`btnSweep`) sul pulsante d'avvio.
3. **Stato Pressione (`:active` / `.held`):** risposta elastica in **60–80 ms** (`cubic-bezier(.2, 0, 0, 1)`), compressione fisica `scale(.96) translateY(1.5px)` nei menu e `scale(.92) translateY(3px)` nell'arco del pollice, picco di luminosità `brightness(1.18–1.35)` e impulso aptico immediato (`8 ms` nei menu, `18–45 ms` negli impatti e nei battiti).
4. **Accessibilità («Riduci movimento» e «Testo grande»):**
   - Attivando *Riduci movimento e scosse dello schermo* (`.reduced-motion` o `prefers-reduced-motion: reduce`), ogni animazione decorativa (scintille, pioggia, oscillazione camera, eco dei personaggi, pulsazione dei badge `.beat-log` e ritratti) si arresta istantaneamente mantenendo intatti tutti gli indicatori di stato.
   - Attivando *Testo grande nei dialoghi* (`body.big-text`), dialoghi, fumetti radio (`#bark`), suggerimenti e scelte salgono a **1,2×** (20 px / 17 px) senza mai troncare i contenitori.

---

## 4. Specifiche Audio Director e Sound Design Immersivo

### 4.1 Architettura del Motore Audio (`AudioDirector`)
Il motore WebAudio (`game/audio-engine.mjs`) è progettato per offrire la pulizia e la profondità di una produzione console senza mai gravare sulla RAM o sul frame-time (< 16,67 ms):
1. **Catena di Mastering in Tempo Reale:**
   - **High-Pass Filter a 34 Hz (`Q = 0.5`):** elimina la sub-risonanza fangosa che farebbe distorcere i micro-altoparlanti degli smartphone, preservando tutta l'energia tra **65 Hz e 4,2 kHz**.
   - **Dynamics Compressor / Brickwall Limiter:** soglia a **-7 dB**, knee **5 dB**, ratio **16:1**, attacco **3 ms**, rilascio **160 ms** per garantire un impatto denso e zero clipping (`clipped_samples = 0`, picco reale `<= -1 dBTP`, volume integrato `-15 LUFS ±1`).
   - **Convolver Reverb Procedurale:** risposta all'impulso stereo di **0,32 s** con decadimento cubico e mandata wet al **13 %**, che lega gli effetti sonori allo spazio architettonico di Vanta.
2. **Prevenzione della Fatica Uditiva (Pitch & Volume Jitter):**
   - Tutte le azioni frequenti (*passi*, *colpi C-9 / VX-9 / R-12*, *impatti*, *schivate*, *gesso*, *battiti sulla porta* e *tocchi UI*) applicano a ogni esecuzione una variazione stocastica controllata di frequenza (**±4 % – ±12 %**) e guadagno (**±8 % – ±16 %**), mentre i segnali di stato (*salvataggio*, *fanfara*) restano deterministici al 100 % come verificato da `tests/audio-v09.test.mjs`.
3. **Regia Musicale Dinamica e Leitmotiv (`D44`, `D47`):**
   - **Crossfade Equipotenziale (2,2 s):** curva sinusoidale/cosinusoidale a 48 campioni che mantiene al massimo 2 decoder attivi durante il passaggio e rilascia immediatamente lo stream uscente.
   - **Isteresi di Tensione di 5,0 s (`musicalState`):** l'ingresso in combattimento porta il tema sul livello *Danger*; l'uscita attende **5,0 secondi** di quiete prima di sciogliersi nel tema di esplorazione (*Nox* / *Lulù*), evitando cambi nervosi tra un'ondata e l'altra.
   - **Ducking Dialoghi Automatico:** all'apertura di un dialogo, di un fumetto radio o di un interno, la musica scende a **×0,50 (-6 dB)** in **120 ms** e risale morbida in **600 ms** alla chiusura.
   - **Stinger e Ambienti Architettonici Puliti (`D47` — Zero Ronzio):** rimosso qualsiasi oscillatore sinusoidale continuo a bassa frequenza (`48–86 Hz`) e qualsiasi loop di rumore bianco continuo su `city`, `port`, `drive` e `dark`; per i campi ambientali `chrono_*` è applicato un filtro passa-alto a **380 Hz** con guadagno sussurrato (`0,06`) così da eliminare ogni ronzio/drone stazionario sotto i temi musicali. Anche il segnale radio (`radio`) usa un cristallino bitono sinusoidale (`680 → 920 Hz`) al posto del rumore filtrato. Ogni quartiere accoglie il giocatore con la propria firma acustica (*campana della cattedrale*, *reattore tossico*, *meccanismo a orologeria*, *folla del mercato*) e con il suono fisico dei **Due Colpi** (`knock` + feedback aptico a doppio impulso) quando si varca la soglia di un edificio.

---

## 5. Equilibrio di Misure e Senso Bilanciato di Cronaca (Trama ↔ Design)

In una produzione da **5,99 €**, la **trama (cronaca)** e il **design (misure)** obbediscono alla stessa legge di proporzione:

1. **Equilibrio delle Misure Spaziali e Visive (`D30`, `D40`, `D50`):**
   - **Scala gerarchica dei personaggi:** nemici comuni e abitanti a **72 px** (altezza visibile ~47 px), bruti e guardie a **92 px**, protagonisti Nox & Lulù a **112 px** (sempre leggibili al centro dell'azione), boss principali a **288 px** (presenza monumentale senza mai uscire dal riquadro).
   - **Scala urbanistica dei 4 villaggi:** griglia **24×24** su mappa **1536×1536 px** (celle da **64 px**), con piazza centrale, assi cardinali liberi e porte degli edifici dotate del doppio indicatore luminoso (`● ●`) entro **150 px**.
   - **Scala ergonomica dei controlli:** pulsanti touch scalati per importanza e frequenza d'uso (**48 px** utility, **52 px** abilità, **58 px** CTA, **64 px** *Spara* / *Hold*, **65 px** pedali guida, **84 px** scelte morali).

2. **Senso Bilanciato di Cronaca su 4 Atti (`ACTS[1..4]` in `game/missions.mjs` e `game/story-v08.mjs`):**
   - La campagna di **31 tappe** è ora ripartita nei **4 Atti canonici** anche nelle schede titolo (`#card-act`) e nel salvataggio del menu principale:
     - **ATTO I · LA CITTÀ AL BUIO** (5 tappe: risveglio, cantiere, Rook, fuga, Moon Refuge).
     - **ATTO II · LA BRECCIA** (8 tappe: The Anchor, tetto della promessa, Cathedral Quarter, clinica, Ora Zero, La Firma).
     - **ATTO III · DUE STRADE** (11 tappe: le rotte separate di Lulù e Nox, Segni di Gesso, Unità 9, Porto, EVE-Prime, Kairn & Morrow).
     - **ATTO IV · ORA UNO** (7 tappe: *Posso venire con te?*, *Ora uno / Archon*, crollo dell'Asse, epiloghi dei 4 villaggi, tetto all'alba, titoli e *Chrono Shadows*).
   - **Intro in Prima Persona di Nox & Lulù (`#opening-pov`, `#opening-nox`, `#opening-lulu`, `STORY.home`, `STORY.blackout_pre`):** il risveglio nella cassa `EVE-47 · NOX SERIES` e l'ingresso a Vanta sono vissuti in **prima persona** visiva e narrativa. Nel visore `.opening-pov`, i ritratti ravvicinati di **Lulù** (`IO · LULÙ`) e **Nox** (`IO · NOX`) si alternano con messa a fuoco attiva (`data-speaker="lulu"|"nox"`), accompagnando i primi passi verso il frammento di vetro e il dialogo intimo di *Otto mesi dopo* e *Moon Refuge*.
   - **I Due Stranieri della Frattura — Kairn (archetipo marziale a pugni nudi, stile Kenshiro) e Morrow (archetipo cacciatore con motosega e doppietta):** sulla *Risalita* (`ascent`, Atto III) la fenditura temporale si apre davanti agli occhi di Nox con il tema `strangers_rift`: **Kairn** (petto nudo, gilet borchiato, polsi fasciati, che chiude la distanza e colpisce a raffica di pugni sul frame di rilascio con `kairn_impact`) e **Morrow** (camicia blu, imbracatura, che copre col fucile a canne mozze fino a 270 unità con `morrow_shot` e passa alla motosega sotto le 70 unità con `morrow_saw`) combattono al fianco del giocatore per 8 secondi, lasciano il frammento dell'orologio spezzato (`broken_clock_fragment`), tengono il varco esterno durante lo scontro finale con *Archon* (alternando raffiche di pugni, doppietta e motosega), vengono ricordati nella *Reunion* e nella *Cronaca* finale (`EPILOGUE`), e chiudono il gioco nella scena post-titoli sotto la pioggia del *Clockwork Outpost* (*The Book of Broken Hours*).
   - **Convergenza Totale della Cronaca (`STORY.reunion_open` ed `EPILOGUE`):** ogni decisione presa dal giocatore (*Officina* vs *Rifugio*, *Passaggio diretto* vs *Rotta di servizio*, *Cella termica a Unità 9*, *Memoria o silenzio di EVE-Prime*, *Incontro con i due stranieri Kairn e Morrow*, *Restare sulla Linea* o *Affidare gli ultimi a Ines*, *Promessa accettata* o *Chiedimelo prima*) ritorna sia nel dialogo di ricongiungimento ai piedi dell'Asse sia nella Cronaca finale (`#epilogue`) e nel Registro delle Scelte (`#replay-log`), legando indissolubilmente meccanica di gioco e memoria narrativa.

