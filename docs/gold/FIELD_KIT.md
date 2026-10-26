# Kit di Tessa e recupero v7

**E06 ed E10: PARTIAL. COMMERCIAL_RELEASE = BLOCKED.** Questa iterazione completa un blocco tecnico della prima slice; non certifica prezzo, qualità commerciale o durata umana.

## Direzione artistica

**Prodotto:** Tessa ha un master originale e uno sheet RGBA 400×320, quattro pose distinte. Il pannello usa i gesti di consegna e spiegazione; la riduzione del movimento mantiene la consegna ferma. Attesa e passo sono pose sorgente, non un ciclo di cammino completo verificato. Nessun ridisegno di Nox/Lulù. Fonte, export, hash e frame: `assets/production/v10.2/tessa-production.json`.

**Riusato:** l'atlante V8 `game/art/v05/weapon_icons.png`, ispezionato prima dell'integrazione. Tre silhouette distinte identificano C-9, VX-9 e R-12. Non è sostituito da un prototipo inferiore.

**Integrato:** barra di cambio/ricarica sopra Cura e comandi, munizioni reali per caricatore, stato di ricarica, segnale Quickdraw e icona dell'arma corrente. La camera include la barra nella fascia libera. Bersagli touch di almeno 44 px controllati nel browser. “Risonanza” usciva dal pulsante a 360 px: corretti font e spaziatura, senza ridurre il bersaglio touch.

**Lacune:** animazioni dell'arma effettivamente impugnata ancora condivise con il set base; le famiglie `equipped_visual_animation` di VX-9/R-12 non sono chiuse. Servono revisione di materiali, contatti, transizioni, movimento, lettura umana e dita su dispositivi. Zero COMMERCIAL_READY.

## Coerenza narrativa

Ordine attuale: relè → Rook con due Raider all'attivazione → scelta Officina/Rifugio → consegna di Tessa → Vortex → Moon. Il checkpoint del boss conserva il vantaggio già esistente di ripartire senza i gregari iniziali; la seconda fase richiama un Breaker una sola volta.

La consegna è comune alle due scelte: VX-9 a Nox e R-12 a Lulù, conservando C-9. Il banco portatile spiega la presenza di Tessa anche quando l'officina resta chiusa; gli effetti della scelta sulla Vortex e sulla città rimangono. Il componente di Rook viene montato come Quickdraw, non come sesta arma o mossa duplicata. Testi nuovi di Tessa sono scritti per questa integrazione, non dichiarati dialoghi canonici recuperati da una fonte assente.

Ogni protagonista conserva la propria selezione tramite ID scalare. La barra e il primo cambio spiegano raffica/rosata nel combattimento successivo. Il test automatico non dimostra che una persona abbia capito il sistema. Firma senza consenso, diciannove civili, separazione, canale, ricongiungimento, perdono, Lia, vetro e colpo finale non sono riscritti. Le rotte A/B/C sono attraversate con i limiti di sorgente indicati nelle prove.

## Regole e persistenza

| Sistema | Implementazione e limite |
| --- | --- |
| Kit | Solo dopo vittoria reale di Rook e scelta valida. Un solo salvataggio della consegna; rollback dei flag se la scrittura fallisce. Nessun doppio premio o rifornimento ripetuto. |
| C-9 | Rimane disponibile a entrambi. Quickdraw: dopo Schiva con C-9, un tiro entro 1 s recupera in 0,26 s anziché 0,4 s. Stesso danno; finestra consumata dal tiro. |
| Black Pulse | Cooldown del comando e dell’arsenale allineati alla riduzione prevista; animazione e cartucce continuano a limitare il tiro. Prova diretta del conteggio dei colpi in `field-kit.test.mjs`. |
| VX-9 | Tre colpi temporizzati, tre cartucce; 24 per caricatore. Sblocco di Nox nelle missioni reali dopo la consegna. |
| R-12 | Cinque pellet, una cartuccia; sei per caricatore; portata ravvicinata. Sblocco di Lulù nelle missioni reali. |
| Cambio/ricarica | Touch oppure V/R. Cambio bloccato durante azioni, cooldown e ricarica. Ricarica manuale o automatica a caricatore vuoto, senza consumo di monete; riserva non limitata dal sistema esistente. |
| Retry/Continue | Selezione conservata per protagonista; munizioni e cooldown vengono ricreati al checkpoint, insieme a salute e nemici. Non è un salvataggio di ogni singola cartuccia in mezzo al combattimento. |
| Vittoria | Stato completato e ricompensa di Rook salvati prima del ritardo cosmetico di 900 ms. La prova ricarica durante quel ritardo: il boss non va riaffrontato. |

I flag di ricompensa richiedono valori booleani reali: la stringa `"true"` non sblocca il kit.

### Recupero degli avanzati

`prepareRookRecovery` interviene alla continuazione dopo la decodifica v7. Il bookmark usa ID stabili e conserva tappa, stato, checkpoint boss, upgrade, hub/coordinate e un eventuale recupero Gesso già attivo. La nuova missione non è una riscrittura del passato dei personaggi: il messaggio di ripresa spiega il recupero al giocatore e viene salvato come già visto.

- Rook mancante: si affronta il boss con i relè già assicurati, poi si riceve il kit e si torna al punto originale.
- Vittoria Rook già registrata ma Tessa mancante: si recupera soltanto la consegna, senza rifare il combattimento.
- Nessuna nuova moneta di Blackout durante il recupero. Premi, inventario, scelte e incarichi esistenti restano.
- Il bookmark Gesso interrotto e la rotta scelta vengono conservati. Regole pure e browser coprono il ritorno attraverso Gesso e poi al vecchio boss.
- Corretto l'ingresso delle missioni: un checkpoint boss valido non viene rimandato al prerequisito iniziale nell'hub. Il normale ingresso senza checkpoint continua a richiederlo.

## Asset e audio realmente prodotti

| File runtime | Uso |
| --- | --- |
| `game/art/v09/tessa.png` | Gesti originali di consegna/spiegazione |
| `game/audio/v10/tessa_workbench.ogg` | Composizione originale di 19,2 s, otto battute a 100 BPM |
| `game/audio/v10/tessa_case.ogg` | Apertura della valigetta |
| `game/audio/v10/weapon_switch.ogg` | Cambio effettivamente accettato e consegna completata |
| `game/audio/v10/weapon_reload.ogg` | Inizio della ricarica manuale o automatica |
| `game/audio/v10/vx9_shot.ogg` | Cue del colpo nella raffica temporizzata |
| `game/audio/v10/r12_shot.ogg` | Rosata; i pellet simultanei non moltiplicano le voci audio |
| `game/audio/v10/quickdraw_ready.ogg` | Apertura della finestra Quickdraw |

Master FLAC, partitura JSON, misure e generatore riproducibile in `assets/production/v10.2/` e `tools/compose_workshop_audio.py`. Nessun campione o registrazione esterna usato dal generatore. Decodifica e clipping misurati; ascolto umano, seam percepito, mix, diritti commerciali e Android rimangono da approvare. Intro JaguarzCreatorz, asset V8 migliori e brani precedenti sono conservati.

## Prove conservate

- `field-kit-tests.txt`: **174/174 PASS**; include transazione/rollback, sblocchi e personaggi, Quickdraw, v7 boss/hub, Gesso interrotto, destinazioni non valide e due Raider.
- `field-kit-report.json`: entrambe le scelte, consegna unica, cue e musica avviati, cambio touch R-12, tiro/ricarica, Quickdraw, selezione e lezione persistenti. Fixture esplicite di consegna e combattimento, non una prima slice continua.
- `rook-recovery-report.json`: v7 Archivio → Rook giocato, reload checkpoint e vittoria → Tessa → vecchio boss con inventario, monete, scelta, upgrade e ledger intatti; VX-9 di Nox provata via touch.
- `rook-chalk-recovery-report.json`: recupero Gesso già in corso, rotta service conservata attraverso Rook, completamento Gesso, callback e vecchio boss; solo il premio Gesso nuovo aggiunge venti monete.
- `tessa-hub-recovery-report.json`: vittoria Rook precedente preservata; sola consegna mancante; ritorno all'hub Toxic nelle coordinate esatte, senza doppie monete.
- `weapon-layout-report.json`: sei viewport per entrambi i protagonisti; barra sopra le cure, bersagli touch e testi nei pulsanti. Screenshot, non prova di contrasto o occlusione delle dita fisiche.
- `field-kit-campaign-{a,b,c}-report.json`: ciascuno Nuova storia → postcredit, 31 tappe, otto incarichi, due preparazioni, zero errori browser; kit e Quickdraw presenti. Clock accelerato: non misura due ore umane. Le sorgenti sono registrate singolarmente. Gli attraversamenti precedono soltanto le ultime correzioni locali di salvataggio vittoria/layout e sincronizzazione Black Pulse, ricontrollate nelle prove mirate e nella suite.

Il pilota A iniziale perdeva la componente verticale presso un angolo. `field-kit-pilot-before.json` conserva il caso; la conversione degli input del verificatore è stata corretta, mantenendo la collisione del gioco. L'ispezione delle mine nel recupero trattiene il fuoco per un ciclo tramite input ordinari, per osservare il telegraph prima del disarmo.

Il pacchetto WebView è generabile e l'allowlist include i file. Non è stato eseguito su un nuovo dispositivo Android: resta valido il blocco documentato della pagina WebView reale assente, SDK/strumenti e chiave Play non disponibili. Nessun APK/AAB commerciale prodotto.

## Ripresa eseguibile

1. Completare gli asset impugnati e le animazioni di C-9/VX-9/R-12; confrontare il risultato con gli atlanti V8 conservati.
2. Integrare H-17 e ARC-7 soltanto con gli sblocchi reali previsti: Anchor/Vega ed Eden, incontri distinti e asset completi. Restano anche le gare Veyra nella progressione.
3. Completare il roster richiesto di 17 incontri, nove regioni, dieci gare e le due scene V10.2 residue. Nessun riempitivo per allungare il tempo.
4. Revisione umana autonoma di arte/narrativa/audio, IT/EN quando riprioritizzato, dispositivi e playtest attivi verso 120 minuti. Queste prove non sono sostituite dai PASS automatici.
