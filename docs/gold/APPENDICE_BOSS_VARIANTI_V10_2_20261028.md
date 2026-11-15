# CHRONOS V10.2 — Appendice D / Boss, fasi visive, arena e telegraph

Data 2026-10-28. **Generare concept visivi e tavole anche per boss senza encounter giocabile**. Queste 68 tavole di stato NON costituiscono 68 fasi implementate; sono quattro schede di produzione per ognuno dei 17 boss canonici. Baseline `docs/gold/ASSET_NECESSARI.md`. Caratteri umani non demonizzati; nessun marchio reale, nessun uso di IP esistenti.

## Pack obbligatorio

Per boss: silhouette 4 direzioni, comparativo personaggio giocatore a scala coerente, quattro tavole scena/fase con palette e tre pose ciascuna, VFX telegraph separato, VFX attacco separato, variazione hit/defeat, arena con zone safe, audio brief anticipazione/attacco/recovery, master animabile con pivot. Se mancano regole runtime: `telegraph_duration_ms=null`, `hitbox=null`, `damage=null`, `area=null` e status `CONCEPT_ONLY`; mai inventare misure. La grafica non deve poter causare falsa lettura di un colpo. Un eventuale secondo o terzo stato è solo design finché non esiste nel codice.

## The Anchor — boss.anchor

Stato canone: nel codice. INTEGRATO in forme prototipo (docs/gold/ANCHOR.md). Nucleo d'ormeggio immobile nella Breccia, legato a tre bitte da cime tese; ormeggiato è invulnerabile, con le cime tagliate è esposto. Attacchi: spazzata lungo una corsia lunga 560 e larga 64 (carica 1,25 s, blocco al 55%), peso a cerchio raggio 120 sull'eroina vicina. Dà il primo componente H-17.

1. **Nucleo legato** — tre bitte, cavi tesi e corpo d'ormeggio immobile, materiali salini. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
2. **Spazzata** — canale 560×64, wind-up 1,25 s, lock 55% come codice; leggibile con contorno e VFX in layer. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
3. **Peso circolare** — ombra e avviso area raggio 120, nucleo scoperto dopo recisione funi. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
4. **Esposizione/sconfitta** — tre cime interrotte con riparazione di colore coerente e quiete finale. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.

## Archon — boss.archon

Stato canone: nel codice. Elena Voss / Archon, culmine del gioco: tre fasi (Custode, città, Lia); ogni fase toglie alternative altrui, la sconfitta le restituisce. Colpo finale di Nox.

1. **Fase custode** — Elena umana con interfaccia di controllo sobria, silhouette coerente. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
2. **Fase città** — architettura che chiude alternative e segnala ogni blocco. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
3. **Fase Lia** — memoria non ostile, schermi e registri si aprono anziché aggiungere un nemico. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
4. **Finale** — colpo finale di Nox e gesto di lasciar andare, nessun falso happy-end imposto. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.

## Custode del Nodo — boss.custode

Stato canone: nel codice. Custode del Nodo: un corpo riconosciuto è un corpo recuperabile; caccia e recupero di Nox, rivelazione della frattura.

1. **Ricerca** — corpo di recupero con sensori binari, unità ottiche e postura da inseguimento. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
2. **Aggancio** — spazio di riconoscimento tracciato in campo, non cono di danno falso. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
3. **Recupero** — braccio meccanico in tre pose, anticipo distinto dal contatto. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
4. **Sconfitta** — unità spenta e sistema recupero disabilitato, Nox non alterato. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.

## Rook — boss.rook

Stato canone: nel codice. Fucile industriale, mine elettriche, coperture; seconda fase al buio con Breaker. Già integrato.

1. **Ingresso** — armatura da tiratore industriale, fucile con triangolo d'appoggio, mine come strumenti riconoscibili. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
2. **Avviso** — disegno distinto per puntamento e mina; luce incisa sul terreno senza colpire prima del runtime. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
3. **Stato buio** — Breaker e luci di emergenza, stessa silhouette e identico pivot dei frame diurni. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
4. **Sconfitta/arena** — arma disarmata e coperture tecniche; nessuna variazione collisione per nascondere l'uscita. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.

## Cathedral Bone Tyrant — boss.bone_tyrant

Stato canone: futuro. Necropoli: sistema di conservazione funeraria fatto di molti resti; non negromanzia.

1. **Entrata** — sistema di custodie funerarie assemblate, architettura archivistica. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
2. **Risveglio tecnico** — serrature e montacarichi sincronizzati, senza magia necromantica. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
3. **Colpo** — pannelli mobili esplicitamente anticipati, nessun corpo di civile usato come proiettile. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
4. **Cessazione** — macchina richiusa, custodie preservate. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.

## EVE-Prime — boss.eve_prime

Stato canone: futuro. Stesso corpo di Nox (EVE): adatta e punisce le azioni ripetute, revoca il controllo motorio.

1. **Entrata** — duplicazione di Nox come corpo, differenziata da pattern di controllo e non da specie. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
2. **Comando** — segmenti sul corpo indicano interfaccia motoria, aggancio annunciato. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
3. **Adattamento** — segnali che reagiscono a ripetizioni solo se il codice li rileva. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
4. **Rottura** — rientro dell'indicatore di comando e postura liberata. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.

## Toxic Forge Behemoth — boss.forge_behemoth

Stato canone: futuro. Toxic Forge: fabbrica automatica che produce senza scopo; ciclo industriale e interruzione leggibili.

1. **Entrata** — macchina industriale enorme con bracci da pressa, nessuna faccia animale obbligatoria. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
2. **Ciclo** — rulli e bracci avvisano la fase di compressione, guide ben visibili. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
3. **Sfiato** — calore e vapore arancio in VFX separato dalle zone di pericolo. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
4. **Arresto** — nastri fermati, residuo di lavoro e silenzio di fabbrica. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.

## HELIX — boss.helix

Stato canone: futuro. Guardiano delle condotte HELIOS: anello di servizio su rotaie, tubi riparati, numeri HELIOS consumati, calore arancio negli sfiati; i settori in pressione devono leggersi dal movimento.

1. **Corpo** — anello di servizio su rotaie HELIOS, giunti a pressione arancio. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
2. **Pressione** — settori di tubo contrassegnati prima dello sfogo, vapore separato. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
3. **Rotazione** — segmenti ruotano con posizioni stabili e transizione leggibile. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
4. **Arresto** — valvole chiuse e calore in diminuzione, condotte non cancellate. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.

## The Lamplight King — boss.lamplight_king

Stato canone: futuro. Noctis Vale: ruba lampade-memoria contro la volontà dei proprietari.

1. **Entrata** — mantello tecnico e supporti per lampade-memoria con collezione rubata. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
2. **Sottrazione** — nicchie che si spengono senza togliere la visibilità al giocatore. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
3. **Accumulo** — lampade raccolte in corona architettonica, telegraph autonomo. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
4. **Restituzione** — luci che tornano ai proprietari, gesto finale non celebrativo. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.

## PARALLAX — boss.parallax

Stato canone: futuro. Collaudatore dei ponti di Aurelia Span: corpo stretto sospeso a cavi, strumenti ottici, contrappesi, superfici chiare; proietta a terra la zona che bloccherà.

1. **Entrata** — collaudatore sospeso da cavi, corpo stretto, strumenti ottici e contrappesi. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
2. **Proiezione** — pavimento marcato dall'area che sarà bloccata, bordo chiaro distinto da luce scenica. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
3. **Spostamento** — cavi e contrappesi seguono una geometria coerente, senza cambiare hitbox. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
4. **Arresto** — strumenti ottici spenti, ponte libero e ombre rientrate. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.

## The Ram — boss.ram

Stato canone: futuro. Ash Docks: convoglio corazzato collegato; parti con funzioni e separazione. Distinto dalle gare.

1. **Corpo** — convoglio corazzato composto da moduli funzionali collegati in Ash Docks. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
2. **Spinta** — sequenza di aggancio e travi che mostra direzione prima dell'urto. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
3. **Separazione** — tre segmenti con collegamenti visibili; le parti si separano solo se codice lo consente. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
4. **Arresto** — moduli spenti nel porto con corsia di uscita sicura. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.

## Root Engine — boss.root_engine

Stato canone: futuro. Iron Orchard: mettere in sicurezza può cancellare ciò che nutre; si può stabilizzare o distruggere.

1. **Nucleo** — radici tecniche e pompe di irrigazione dentro la serra verticale. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
2. **Allarme** — indicatori di flusso e condotte in pressione ben leggibili. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
3. **Scelta** — due esiti visivi concettuali: stabilizzazione e distruzione, senza imporli al gameplay. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
4. **Esito** — colture e comunità ancora presenti, non solo macerie. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.

## Sera Venn — boss.sera_venn

Stato canone: futuro. Capoconvoglio di Solkara: abiti protettivi scoloriti dal sole, esoscheletro da lavoro, strumenti non letali, telaio da sollevamento con segni dei convogli.

1. **Entrata** — capoconvoglio con esoscheletro da lavoro e abiti scoloriti dalla sabbia. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
2. **Segnale** — telaio di sollevamento prepara un blocco senza aggredire civili. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
3. **Inseguimento** — struttura del vagone e polvere sul terreno in layer indipendente. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
4. **Conseguenza** — strumento abbassato, convoglio riapre il passaggio. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.

## Shadow Reaper — boss.shadow_reaper

Stato canone: futuro. Glass Flood: tratta un futuro possibile come destino; previsione annunciata, danno solo nell'evento reale.

1. **Entrata** — figura sottile fra acqua e vetro, nessuna lama stereotipata obbligatoria. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
2. **Previsione** — riflesso mostra possibile colpo futuro con tratto discontinuo. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
3. **Evento reale** — danno solo sul frame/evento di attacco implementato, segnale visivo pieno. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
4. **Sconfitta** — ombra dell'azione possibile si spezza, superficie torna limpida. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.

## The Twelfth Observer — boss.twelfth_observer

Stato canone: futuro. Osservatorio del Mezzogiorno Perduto: umano che non distingue eventi reali e futuri possibili.

1. **Entrata** — custode umano circondato da quadranti alle 12, abiti da laboratorio. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
2. **Possibilità** — tre immagini futuro-potential in overlay mai interagibili. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
3. **Disorientamento** — sovrapposizione controllata di osservazioni, visibilità del corpo reale garantita. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
4. **Uscita** — registri chiusi e unica ombra residua in stanza. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.

## Vega — boss.vega

Stato canone: futuro. Precisione come imposizione del proprio ritmo: finestre e allineamento; completa l'H-17.

1. **Entrata** — tiratrice disciplinata, armatura leggera, mirino e taccuino di allineamento. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
2. **Mirare** — linea diritta di preparazione, luce sobria e bersaglio leggibile. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
3. **Ritmo** — cambi di mira con recupero visuale, senza modificare i timing. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
4. **Sconfitta** — cella H-17 consegnata come oggetto separato, arma non distrutta. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.

## Volkov — boss.volkov

Stato canone: futuro. Distretto Clinico: la cura diventa controllo; spazio e procedure mostrano il limite. Non associare disabilità o mutazione a colpa morale. Dà il componente Aegis.

1. **Entrata** — clinica fredda, uniforme amministrativa medica e vincoli di recupero identificabili. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
2. **Procedura** — segnali d'intervento ordinati e avvisi su pavimento separati da persone. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
3. **Crisi di controllo** — regole cliniche sempre più invasive senza estetica mostruosa della malattia. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.
4. **Conseguenza** — arresto della procedura, ambiente che torna accessibile ai civili. Deliverable: tavola pixel art con silhouette, key pose, VFX separati, palette, audio brief e note della leggibilità.

## QA

I pivot, anticipo, iframe, collider, colpi, recoil e durata delle fasi sono le sole quantità estratte dal runtime quando esiste; mai adeguare le meccaniche ai concept. Prove a 390×844 e 844×390, overlay sull'arena reale e confronto degli stati. Manual art review, diritti del generatore e uso commerciale da verificare; `COMMERCIAL_RELEASE = BLOCKED`.
