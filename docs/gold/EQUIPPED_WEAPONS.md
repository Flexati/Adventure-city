# Armi impugnate — E06 / E10 / AS10 PARTIAL

Direzione artistica: prodotti tramite image_gen due adattamenti degli atlanti V8 conservati: Nox/VX-9 e Lulù/R-12, 16 pose ciascuno, quattro direzioni. Sagome distinte: carabina con tre segmenti ciano e sfiato rame; doppia canna corta con camera magenta. I master RGBA 1305×1205 e gli export sono reali, con hash e provenienza in `assets/production/v10.2/equipped-weapons-production.json`. C-9 usa ancora gli originali. Il runtime carica soltanto il nuovo sheet del protagonista della missione; circa 6 MiB decodificati aggiuntivi. Il lampo di ciascuna raffica segue le emissioni reali, anziché una sola suddivisione uniforme dell'azione. Screenshot browser ispezionati; non sono approvazione umana o mobile fisico. Cammino, ricarica e transizioni complete restano condivisi e da rifinire: le famiglie non sono COMMERCIAL_READY.

Coerenza narrativa: gli sblocchi rimangono la consegna guadagnata da Tessa dopo Rook, con VX-9 a Nox e R-12 a Lulù. Nessuna nuova ricompensa, conoscenza, scelta o migrazione. La prova usa fixture esplicite con kit già guadagnato; non dimostra la campagna intera.

Asset e audio: due ADAPT prodotti e integrati. Riusati i cue originali VX-9/R-12, cambio/ricarica e la composizione di Tessa già versionati. Questa revisione visiva non introduce un nuovo brano. Nessun ascolto umano o diritto commerciale dichiarato.

Prove: `docs/evidence/v10.2/equipped-browser-report.json`, screenshot `equipped-{vx9,r12}.png`, suite `equipped-tests.txt`. Cambio e tiro tramite comandi ordinari; entrambe le risorse caricate, cartucce consumate, cue decodificati avviati e zero errori browser. Il test Android verifica packaging/allowlist e compilazione del JS, non esecuzione sul dispositivo.

Nessuno dei 74 criteri è chiuso commercialmente da questa revisione. COMMERCIAL_RELEASE = BLOCKED. Rimangono il roster/incontri/armi e gare nella progressione, produzione audio restante, revisione autonoma arte e narrativa, playtest umani della durata, WebView/Android fisico e licenze. Prossimo intervento: animazioni di ricarica/trasporto prima di considerare completa la famiglia delle tre armi; poi H-17/ARC-7 con incontri e ricompense previsti.

## Ricontrollo mira manuale

Corretto il mirino che usava sempre GUN_RANGE: ora la portata proviene dall'arma attiva (R-12 195, VX-9 340) e la rosata mostra tre guide, centrale e limiti angolari ±0,32 radianti. Ogni guida usa la collisione del tiro contro le pareti. Nessun nuovo asset necessario: feedback geometrico runtime, sprite e audio già prodotti riusati. Narrativa e salvataggi non modificati. Suite 176/176 PASS (`aim-preview-tests.txt`); pressione/trascinamento reali nel browser e screenshot `aim-r12.png`, `aim-vx9.png`. Prove Android fisiche e gate commerciali restano aperti.
