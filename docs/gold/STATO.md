Aggiornamento armi impugnate: due adattamenti reali VX-9/R-12 integrati e provati nel browser; dettagli e lacune in [EQUIPPED_WEAPONS.md](EQUIPPED_WEAPONS.md). E06/E10/AS10 PARTIAL, COMMERCIAL_RELEASE BLOCKED.

# CHRONOS Gold — punto di ripresa

## Sessione Opus — integrazione pacchetto Codex (corrente)

**MANDATO PARZIALE — COMMERCIAL_RELEASE = BLOCKED.** Branch `work/chronos-adventure-commercial`, partito da `3f746d5` (= commit di riferimento). Pacchetto: 205/205 file presenti, 0 hash diversi da `PACKAGE_MANIFEST.json`. Baseline prima delle modifiche: `npm test` 176/176 PASS; percorso A italiano con clock virtuale: 31 tappe, 8 incarichi, 2 preparazioni, finale raggiunto (prova browser, non durata umana).

- **Blocco 1 — ricarica VX-9/R-12 (INTEGRATO, verificato in browser).** Dettagli e lacune in [EQUIPPED_WEAPONS.md](EQUIPPED_WEAPONS.md#ricarica-vx-9--r-12--integrazione-dei-master-codex). ART03 OPEN → PARTIAL (solo ricarica di due armi). Suite 180/180.
- **Blocco 2 — Kairn e Morrow fedeli alla foto + audio (INTEGRATO, verificato in browser).** Comparsa prima del dialogo, comportamenti distinti con colpo al frame di rilascio, tema e SFX collegati agli eventi reali, post-titoli con i nuovi sheet. [STRANIERI.md](STRANIERI.md). CRE04, E05, E09, AS09 OPEN → PARTIAL. Suite 185/185. **Rischio:** somiglianza dei due design con personaggi noti → revisione diritti prima della release.

Branch `work/chronos-adventure-commercial`. Le modifiche vengono conservate nel checkpoint Git di questa iterazione; i riferimenti di prova indicano file e sorgenti, non un APK commerciale. Il [rapporto operativo V10.2](../production/v10.2/EXECUTION_STATUS.md) conserva il quadro precedente e le correzioni di questa iterazione.

## Stato corrente — kit di Tessa e recupero v7

**MANDATO PARZIALE — COMMERCIAL_RELEASE = BLOCKED.** Il [rapporto del kit](FIELD_KIT.md) distingue implementazione, produzione, integrazione e verifica.

- **Direzione artistica:** Tessa originale, due gesti runtime da uno sheet di quattro pose; icone V8 conservate; barra armi fuori dalla fascia cure/comandi. Sei viewport per entrambi i protagonisti; correzione del testo Risonanza a 360 px. Animazioni dell'arma impugnata ancora condivise: famiglie VX-9/R-12 PARTIAL.
- **Coerenza narrativa:** relè → Rook con due Raider → scelta → Tessa → fuga/Moon. Consegna comune e banco portatile coerenti con entrambe le scelte. Recupero degli avanzati con ID stabili, senza doppio premio; se Rook era vinto si recupera solo Tessa. Gesso interrotto conserva rotta e bookmark. Nessuna riscrittura del canone del finale.
- **Asset/audio prodotti in questo blocco:** uno sprite sheet originale, un brano originale di 19,2 s e sei cue originali; master, partitura, metriche e generatore versionati. Riuso dell'atlante armi V8. Zero COMMERCIAL_READY.
- **Prove:** 174/174 Node PASS; kit su entrambe le scelte, cambio/tiro/ricarica touch, rollback e selezione persistente; browser v7 boss, hub e Rook/Gesso combinati. Vittoria salvata prima del ritardo cosmetico e ricaricata in quel momento. A/B/C: 31 tappe, otto incarichi, due preparazioni, zero errori; sorgenti e controlli delle sole modifiche successive separati nei rapporti.
- **Inventario:** 150 media/sorgenti tecnicamente decodificati, inclusi 14 MIDI; 99 media nel pacchetto, 103 risorse totali. JS classico 403018 byte. Registro selettivo: 30 record, 24 NEW / 2 ADAPT / 4 REUSE; 0 REPLACE. Due fonti remote REJECT rimangono separate. Sono perimetri diversi, non 442 famiglie chiuse.
- **Gate:** E06/E10 e AS10 ancora PARTIAL; 74 ID originali invariati, 14 PARTIAL / 60 OPEN. IT/EN non è la priorità corrente. Nessun playtest umano, ascolto, licenza o dispositivo inventato. Nessun AAB commerciale.

Prossimo lavoro eseguibile: asset impugnati e animazioni per le tre armi ora in campagna; H-17/ARC-7 con i rispettivi incontri e sblocchi, gare Veyra nella progressione, scene V10.2 residue e roster/regioni completi. Durata umana verso 120 minuti ancora non misurata. Android, persone nuove, fonti V8.5 valide e strumenti/chiave Play restano dipendenze precise, non una dichiarazione di completamento.

## Checkpoint Rook 7813ec8 — storico

**MANDATO PARZIALE — COMMERCIAL_RELEASE = BLOCKED.** Le sezioni successive conservano lo storico, non sostituiscono questi dati correnti. Non sono stati dichiarati gate commerciali PASS.

- Rook è nella progressione di Blackout prima della scelta: rosata anticipata/bloccata, mine disarmabili, riposizionamento, coperture reali, Breaker e oscuramento parziale nella seconda fase. Checkpoint e flag di vittoria reali, senza attribuzioni retroattive.
- **Direzione artistica:** nuovo sprite sheet originale a otto pose, arena, segnali elettrici e camera del duello. Primo inquadramento e oscuramento corretti dopo screenshot. Qualità completa delle animazioni, revisione umana e mobile fisico restano aperti.
- **Coerenza narrativa:** scelta successiva preservata, nessuna conoscenza nuova inventata, ripresa boss senza ripetere il dialogo pre-missione. Recupero di Rook nei v7 avanzati, Quickdraw e Tessa sono ancora OPEN: E06 è PARTIAL.
- **Asset/audio:** un nuovo sheet, una composizione originale di 24 s e cinque SFX specifici di Rook; conservati due SFX locali originali per gesso/cura e le due intro JaguarzCreatorz già integrate. Master, generatori, partitura, Ogg, hash e associazioni runtime sono versionati. Nessun ascolto umano o diritto commerciale certificato.
- **Prove:** 162/162 Node PASS; browser Rook con tasti/UI, reload, asset/audio avviati e scelta persistente PASS, con zero retry nell’ultimo ricontrollo (due in una prova precedente). Confezionamento Android: 394491 byte JS, 95 risorse totali; non è una prova WebView o Android fisica. [Dettagli e ripresa](ROOK.md).
- **Inventario:** 142 media/sorgenti censiti tecnicamente, inclusi 14 MIDI; 91 media confezionati; 0 COMMERCIAL_READY. Registro selettivo di questa lavorazione: 21 record, 16 NEW / 2 ADAPT / 3 REUSE; nessun REPLACE. Le due fonti V8.5 remote non decodificabili restano REJECT separati. Questi conteggi hanno perimetri diversi e non chiudono 442 famiglie.
- **IT/EN:** conservata l'implementazione e le prove precedenti. Su istruzione esplicita dell'autore non è la priorità corrente; nessuna revisione umana o chiusura completa viene attribuita. A/B inglesi sono rapporti storici, non prove della nuova integrazione Rook. Nessun rapporto C precedente disponibile viene ricreato o inventato.

Regressione italiana A: 31 tappe da Nuova storia al postcredit, otto incarichi e due preparazioni, zero errori. Le sole correzioni successive delle mine sono ricontrollate nel test Rook e nella suite. Hash e perimetro in `ROOK.md`.

Prossimo blocco eseguibile: Quickdraw/Tessa con asset e insegnamento del cambio arma; recupero Rook tramite ID stabili nei v7 avanzati, combinato con il catchup Gesso; prima slice su entrambe le scelte. Restano gli altri incontri, armi/gare reali, nove regioni, due scene V10.2, asset/audio e misure umane verso 120 minuti. Non sono dipendenze esterne: sono lavoro ancora da implementare. Dispositivi, playtester, esportazioni V8.5 valide e chiave/SDK Play sono dipendenze esterne separate.

## Storico delle iterazioni precedenti

## Verifiche chiuse a livello tecnico

- `npm test`: 146/146 PASS dopo la migrazione v7 e la correzione della battuta dell'Archivio.
- Due continuazioni browser di salvataggi v7 storici, Archivio al checkpoint del boss e hub Toxic con indice di ritorno precedente all'inserimento: entrambe tornano al punto giusto dopo `Segni di Gesso`, senza doppio premio. [Rapporto](../evidence/v10.2/chalk-migration-report.json) e [verificatore](../../tools/verify_chalk_migration_browser.cjs).
- La correzione narrativa nell'Archivio è verificata da un'asserzione sul dialogo. Richiede ancora il riesame integrale della storia nel browser, IT/EN e con lettori nuovi.

## Direzione artistica

Menu mobile e icona hanno screenshot di confronto browser; la missione del gesso usa segno e civile specifici. Sono integrazioni parziali. Mancano confronto completo di silhouette, materiali, luci, HUD, animazioni, UI IT/EN, accessibilità e dispositivi. Le tavole V8.5 non sono state accettate come media finali: la nota `docs/production/v9/sources/01-art-v85.md` descrive una pubblicazione storica, ma `assets/chrono_shadows/latest_v85/` e `docs/WORLD_CHARACTER_EXPANSION_BIBLE_V85.md` non esistono in questo checkout, che espone solo `origin/work/chronos-adventure-commercial`. Servono i binari e la bibbia originali per il confronto V8.5.

## Coerenza narrativa

La tappa del gesso avviene durante la separazione anche nei salvataggi avanzati, tramite recupero giocabile. La traccia fisica consente a Nox di dedurre che qualcuno ha riaperto il passaggio, senza conoscere l'autore. Restano da verificare tutte le conoscenze/scelte nelle missioni, le tre nuove scene V10.2, il finale e il reload lungo i percorsi A/B/C.

## Asset, audio e contenuti

La matrice V10.2 contiene requisiti, non 442 file. Il [registro asset](ASSET_REGISTER.json) censisce soltanto due SVG di missione, l'icona e il cue WebAudio interessati da questa iterazione; tutti restano prototipi per il gate commerciale. Il [registro audio](AUDIO_REGISTER.json) riconcilia i 129 indici con la fonte originale e segnala esplicitamente mappatura runtime, produzione, diritti, ascolto, loop e mix da completare. Le sette gare e cinque armi V9 sono ancora nei laboratori/preview, non nella progressione. Le tre gare aggiunte non esistono in runtime. Durata umana verso 120 minuti: non misurata.

## Difetti e prossimo blocco eseguibile

1. A/B/C dopo migrazione e correzione narrativa: 31 tappe ciascuno, zero errori, stessa sorgente `3afdbec0…`. I rapporti precedono soltanto l’integrazione intro e il posizionamento dell’avviso HUD, verificati separatamente. Proseguire con la matrice dei salvataggi intermedi e Android.
2. Integrare il primo contenuto V9 già giocabile nella progressione senza duplicare le cinque sequenze di guida narrative. Per ciascuna gara creare gli asset specifici mancanti prima di chiuderla.
3. Produrre e verificare IT/EN e asset/audio pertinenti per `Segni di Gesso`, poi le altre due scene V10.2. Misurare il ritmo con persone nuove solo su una build adatta al playtest.

Blocco esterno preciso per Android Play: in questo ambiente non sono stati trovati Android SDK/API 36, build-tools 36.0.0, bundletool né la chiave privata di upload. Il certificato pubblico indicato dall'autore non sostituisce la chiave. Servono questi componenti e tutti i gate di gioco prima di un AAB commerciale vcode2; nessun bundle di questa iterazione è dichiarato pronto.

## Ultimo blocco: intro e HUD

Due intro JaguarzCreatorz integrate (REUSE), con riproduzione mobile/desktop, skip, audio su gesto, fallback e riduzione movimento verificati nel browser. [Dettagli](INTRO.md). L’avviso del checkpoint boss ora lascia libere barra e pulsante Bagaglio: le due disuguaglianze geometriche sono controllate nel verificatore di migrazione, oltre allo screenshot `archive-restored-after.png`. Suite corrente 146/146.

Audit file runtime di questa iterazione: 5 trovati, 2 REUSE, 1 ADAPT, 2 NEW, 0 REPLACE, 0 REJECT, 0 COMMERCIAL_READY. Questi numeri non censiscono tutti i media preesistenti e non chiudono le 442 famiglie: il loro audit completo resta aperto. COMMERCIAL_RELEASE = BLOCKED.

## Iterazione successiva — Cura e recupero V8.5

Direzione artistica: aggiunta icona originale Medseal e comando Cura fuori dalla griglia, preservando posizione di Spara/Schiva. Il calcolo camera include il comando. Quantità, bordo tratteggiato e descrizione accessibile indicano lo stato senza affidarsi al colore. Il cue sintetico heal e l’anello appaiono solo dopo una cura salvata. IT/EN completo, ascolto umano, touch su dispositivi e gate commerciale restano aperti.

Coerenza narrativa: non cambiano eventi, protagoniste, risorse disponibili o premi; i kit acquistati restano consumati dopo reload/retry. Il comando non funziona in pausa, durante dialoghi, da sconfitti o a salute piena. Un errore del salvataggio ripristina salute e quantità. Prove pure di rollback e browser di cura in movimento: `medicine-report.json` e `medicine.png`. Suite aggiornata: 147/147 PASS.

Recuperata da GitHub `main` la bibbia `docs/WORLD_CHARACTER_EXPANSION_BIBLE_V85.md` (blob bea7e12cdd7c4a34c9cf7db1b71caf5c193a072c). Il blocco precedente sulla fonte testuale è risolto. La directory remota contiene ZIP, preview e README, senza 18 tavole singole. ZIP e preview sono dati non decodificabili: REJECT, prove in `v85-source-audit.json`. Occorrono esportazioni valide per il confronto artistico richiesto.

Audit cumulativo limitato di questa lavorazione: 6 file runtime (2 REUSE, 1 ADAPT, 3 NEW) e 2 fonti remote REJECT; 0 REPLACE, 0 COMMERCIAL_READY. Non sono 442 famiglie completate. I 74 criteri restano 14 PARTIAL / 60 OPEN. COMMERCIAL_RELEASE = BLOCKED.

Ripresa concreta: integrare le cinque armi e le gare nella progressione secondo i loro sblocchi canonici; attualmente sono ancora laboratori. Rook, 17 incontri, nove regioni, le altre due missioni V10.2, asset/audio, localizzazione e durata umana richiedono implementazione/prove, oltre alle dipendenze esterne già elencate. Questo checkpoint conserva tutte le modifiche finora citate ma non conclude il mandato.

## Pubblicazione e censimento successivi

I checkpoint applicativi e l'indice Gold sono pubblicati su `Flexati/Adventure-city`, branch `work/chronos-adventure-commercial`. `docs/gold/README.md` è il punto di ingresso per stato, requisiti, asset, audio, intro, playtest e release.

Il nuovo `tools/audit_media.py` censisce tutti i file media trovati in `game/`: 131 controlli tecnici PASS, inclusi 14 header MIDI; 80 media nel pacchetto Android, zero COMMERCIAL_READY. `FILE_INVENTORY.json` conserva hash e risultati. Il registro asset collega ora tutti i 442 requisiti ai contenuti, con candidati per 9 famiglie; nessuna approvazione automatica di arte, licenze o uso runtime. Il censimento risolve la mancanza di inventario tecnico completo, non l'integrazione di campagna ancora necessaria.

## Asset generato e callback animato

Direzione artistica: il civile SVG statico è stato ritirato in `assets/preproduction/v10.2/`; il callback usa l'atlante `civilian.png` già presente, con animazioni idle/walk, soste alle estremità e percorso continuo. Le due rotte percorrono punti validi del corridoio; riduzione movimento mantiene una posa ferma. È stata realmente generata una borraccia con segni di gesso: master originale in `assets/production/v10.2/`, export mobile RGBA 48×64 in `game/art/v09/chalk_flask.png`, incluso nel pacchetto Android. Nox e Lulù non sono stati ridisegnati.

Coerenza narrativa: la descrizione cita la borraccia visibile. Nox continua a dedurre solo che qualcuno ha riaperto il passaggio; il civile e l'oggetto non attribuiscono conoscenze, danni, premi o poteri nuovi. La regia durante il combattimento e il set completo di gesti restano da riesaminare.

Prove: 148/148 test Node PASS; verifica browser di entrambe le rotte con input reali e salvataggi di prova, atlante e nuovo PNG caricati senza errori. Rapporti e screenshot `chalk-scene-*` nella cartella evidenze V10.2. Il rapporto include hash di asset e sorgenti; la verifica non è una prova umana o Android fisica. La famiglia asset resta PARTIAL, nessun nuovo COMMERCIAL_READY.

## Sprite sheet e musica — iterazione successiva

Direzione artistica: generato uno sprite sheet reale della borraccia, quattro stati distinti, esportato 192×64 e collegato all'avanzamento effettivo dell'attivazione dei due accessi. Il civile usa il frame chiuso; nessuna modifica all'identità dei protagonisti. Master, hash e frame sono nel registro asset. Nel browser entrambe le varianti caricano il nuovo sheet.

Coerenza narrativa: il riempimento è una visualizzazione locale dell'accesso all'acqua, senza introdurre consumabili obbligatori, premi o nuovi poteri. Scelte e cronologia restano conservate. Rimangono aperti regia del civile durante il combattimento, IT/EN e revisione dell'intera campagna.

Audio: Creative Claw ha rifiutato la richiesta prima di generare per zero crediti (circa 20 richiesti, nessun addebito). In alternativa è stata composta e sintetizzata localmente una traccia originale di 40 secondi, con partitura JSON, script riproducibile, master FLAC ed export Ogg. Il browser prova caricamento, playback su gesto, pausa/ripresa e limite di due stream; zero clipping rilevato nella decodifica. Nessun ascolto umano o approvazione commerciale è dichiarato.

Suite aggiornata: 149/149 PASS. Il riferimento «gate 10» dell'autore non ha un ID G10 nel corpus: E10 riguarda Save V9/migrazione/IT-EN, AS10 le prove runtime. E10 resta PARTIAL perché IT/EN e migrazione completa sono aperti; AS10 è parziale per i soli casi effettivamente provati. Nessun gate complessivo è chiuso da questi asset. COMMERCIAL_RELEASE = BLOCKED.
