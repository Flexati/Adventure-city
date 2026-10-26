# Armi impugnate — E06 / E10 / AS10 PARTIAL

Direzione artistica: prodotti tramite image_gen due adattamenti degli atlanti V8 conservati: Nox/VX-9 e Lulù/R-12, 16 pose ciascuno, quattro direzioni. Sagome distinte: carabina con tre segmenti ciano e sfiato rame; doppia canna corta con camera magenta. I master RGBA 1305×1205 e gli export sono reali, con hash e provenienza in `assets/production/v10.2/equipped-weapons-production.json`. C-9 usa ancora gli originali. Il runtime carica soltanto il nuovo sheet del protagonista della missione; circa 6 MiB decodificati aggiuntivi. Il lampo di ciascuna raffica segue le emissioni reali, anziché una sola suddivisione uniforme dell'azione. Screenshot browser ispezionati; non sono approvazione umana o mobile fisico. Cammino, ricarica e transizioni complete restano condivisi e da rifinire: le famiglie non sono COMMERCIAL_READY.

Coerenza narrativa: gli sblocchi rimangono la consegna guadagnata da Tessa dopo Rook, con VX-9 a Nox e R-12 a Lulù. Nessuna nuova ricompensa, conoscenza, scelta o migrazione. La prova usa fixture esplicite con kit già guadagnato; non dimostra la campagna intera.

Asset e audio: due ADAPT prodotti e integrati. Riusati i cue originali VX-9/R-12, cambio/ricarica e la composizione di Tessa già versionati. Questa revisione visiva non introduce un nuovo brano. Nessun ascolto umano o diritto commerciale dichiarato.

Prove: `docs/evidence/v10.2/equipped-browser-report.json`, screenshot `equipped-{vx9,r12}.png`, suite `equipped-tests.txt`. Cambio e tiro tramite comandi ordinari; entrambe le risorse caricate, cartucce consumate, cue decodificati avviati e zero errori browser. Il test Android verifica packaging/allowlist e compilazione del JS, non esecuzione sul dispositivo.

Nessuno dei 74 criteri è chiuso commercialmente da questa revisione. COMMERCIAL_RELEASE = BLOCKED. Rimangono il roster/incontri/armi e gare nella progressione, produzione audio restante, revisione autonoma arte e narrativa, playtest umani della durata, WebView/Android fisico e licenze. Prossimo intervento: animazioni di ricarica/trasporto prima di considerare completa la famiglia delle tre armi; poi H-17/ARC-7 con incontri e ricompense previsti.

## Ricontrollo mira manuale

Corretto il mirino che usava sempre GUN_RANGE: ora la portata proviene dall'arma attiva (R-12 195, VX-9 340) e la rosata mostra tre guide, centrale e limiti angolari ±0,32 radianti. Ogni guida usa la collisione del tiro contro le pareti. Nessun nuovo asset necessario: feedback geometrico runtime, sprite e audio già prodotti riusati. Narrativa e salvataggi non modificati. Suite 176/176 PASS (`aim-preview-tests.txt`); pressione/trascinamento reali nel browser e screenshot `aim-r12.png`, `aim-vx9.png`. Prove Android fisiche e gate commerciali restano aperti.

## Ricarica VX-9 / R-12 — integrazione dei master Codex

**Problema del giocatore.** Durante la ricarica Nox e Lulù mostravano la posa di cammino: l'unico segnale era il testo del pulsante HUD, lontano dal punto in cui il giocatore guarda. Durante uno scontro non si capiva perché l'arma non sparasse.

**Risultato atteso e criterio.** Da fermi, quattro fasi leggibili (abbassa, estrai, inserisci, pronta) nelle quattro direzioni, sincronizzate con `arsenal.reloadRemaining` e con la durata dell'arma (1,4 s VX-9, 1,6 s R-12). Il renderer non tocca munizioni né timer. Danno, schiva e Duo mantengono la priorità; la pausa congela la posa; nessuna posa resta dopo il timer.

**Decisione sul cammino.** Le regole di movimento non cambiano (ricaricare camminando resta possibile, come già verificato). In movimento resta il ciclo di passo V8 per non far scivolare i piedi; un arco di avanzamento sopra l'anello dell'eroina mostra la ricarica tramite forma (contorno scuro + tratto chiaro), non solo colore. L'arco vale anche per C-9, che non ha uno sheet di ricarica.

**Direzione artistica.** I master `nox-vx9-reload-master.png` e `lulu-r12-reload-master.png` sconfinavano dalle celle: suole nella riga sotto, canne alzate fino al bordo superiore. Il ritaglio a celle esatte del renderer avrebbe mostrato frammenti di scarpe sopra l'arma e suole tagliate. `tools/build_reload_sheets.py` isola ogni posa per componenti connesse, riancora i piedi alla stessa riga dello sheet impugnato e aggiunge 20 px di margine superiore compensati da `RELOAD_DRAW_SCALE`: densità dei pixel e linea dei piedi coincidono con le pose di tiro, 0 pixel opachi tagliati. Nessun ridisegno, nessun ridimensionamento dei pixel; identità dei protagonisti invariata. A dimensione runtime le differenze fra fasi sono contenute ma leggibili soprattutto nella vista frontale e laterale; la vista di schiena è la meno chiara.

**Coerenza narrativa.** Nessuna nuova conoscenza, ricompensa o regola. Gli sblocchi restano quelli di Tessa dopo Rook.

**Asset/audio.** Due ADAPT integrati (`game/art/v10/nox_vx9_reload.png`, `lulu_r12_reload.png`), un feedback runtime NEW. Riusato il cue `weapon_reload.ogg` già associato all'evento. Pacchetto Android e allowlist `AssetRoutes.java` aggiornati. Circa 6,7 MiB decodificati in più solo nelle missioni con arsenale V9 e solo per il protagonista della missione.

**Prove.** Suite 180/180 PASS, di cui 4 nuovi test (`tests/reload-animation.test.mjs`): fasi 0→3 con il timer reale di `tick`, munizioni invariate fino alla fine, direzioni/specchiatura, priorità di cammino/danno/schiva/partner/C-9, dimensioni e hash PNG, celle pulite e pose distinte. Browser con tocchi reali su `#weapon-change`, `#gun`, `#weapon-reload`, `#pause`, `#resume` e cammino da tastiera, a 390×844 e 844×390: `docs/evidence/v10.2/reload-browser-report-*.json` e strisce `reload-{vx9,r12}-*-strip.png` (le cinque catture per arma sono composte in una striscia). Nessuna prova umana, WebView o Android fisica.

**Lacune.** Trasporto/cammino con l'arma impugnata, ricariche C-9/H-17/ARC-7, revisione umana della leggibilità e dispositivo fisico. Famiglie `weapon.{vx9,r12}.equipped_visual_animation` ancora OPEN.
