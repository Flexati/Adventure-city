# Rook — scontro nella campagna

Stato **PARTIAL**, E06. Il blocco corrente è Blackout: tre relè → Rook → scelta Officina/Rifugio. Non è una scena del laboratorio. Quickdraw, Tessa, cambio arma e recupero v7 sono ora implementati: vedere [Kit e recupero](FIELD_KIT.md). E06 resta parziale per asset impugnati, revisione umana e dispositivi.

## Direzione artistica

Prodotto un master originale e un export trasparente 512×288 con otto pose distinte: attesa, passo, mira mobile, mira bloccata, rinculo, ricarica, reazione e sconfitta. Il renderer seleziona le pose dagli stati reali. Nessun ridisegno di Nox o Lulù. La continuità di un ciclo completo di cammino e la qualità commerciale delle animazioni restano da approvare.

Il nuovo cantiere usa materiali V8 e quattro isole di copertura. Geometria visibile, collisioni e navigazione condividono la stessa griglia. Mine esagonali con tre elettrodi, perimetro e testo distinguono l'armamento e la possibilità di sparare: non si usa soltanto il colore. Una linea tratteggiata segue la mira iniziale; diventa continua quando si blocca. Rook si avvicina entro 330 unità prima di iniziare la mira. La camera del duello mantiene, quando entrambi entrano nello spazio disponibile, la silhouette fuori dalla fascia di HUD/avviso e il protagonista sopra i comandi. La seconda fase oscura parzialmente la scena; i segnali di pericolo restano sopra il velo.

Confronto: `rook-before-source.json` registra l'assenza di Rook nella sorgente precedente. Screenshot `rook-aim.png`, `rook-mine.png`, `rook-phase-two.png` mostrano l'integrazione corrente. Le prove browser hanno evidenziato il primo inquadramento insufficiente: è stato corretto, non accettato come arte finale.

## Coerenza narrativa

Rook si attiva solo dopo il terzo relè, prima della scelta. Non acquisisce informazioni sulla firma, sulla separazione o su Lia. La vittoria reale salva `encounter.rook.completed`; un salvataggio già avanzato non riceve retroattivamente una vittoria inventata. Scelta e premi preesistenti restano idempotenti. La ripresa al checkpoint conserva i relè, ricrea boss e protagonista integri e non ripete il dialogo pre-missione.

**Aggiornamento:** recupero Rook/Tessa per v7 avanzati implementato e provato con boss, hub e Gesso interrotto. Nessuna vittoria assegnata implicitamente: Rook si gioca se manca, oppure si recupera soltanto Tessa se la vittoria era già salvata. Dettagli in `FIELD_KIT.md`.

## Regole e audio

- Rosata di tre proiettili a 365 unità/s, durata 1,6 s, collisioni condivise con muri e barriere. Anticipazione 1,2 s, mira bloccata dopo 0,6 s; recupero 1,35 s.
- Ogni terzo ciclo piazza una mina e cambia posizione. Massimo tre mine, armamento 0,9 s, raggio 84, durata massima 8 s. Un tiro mirato la disattiva; muri e invulnerabilità proteggono dalla detonazione.
- Sotto metà vita: un solo Breaker, oscuramento parziale e riposizionamenti. Nessuna variante generica di carica o schianto assegnata a Rook.
- Prodotto un brano originale di 24 s, dodici battute a 120 BPM, e cinque cue distinti per mira, rosata, piazzamento, detonazione e disarmo. Script, partitura, master FLAC, Ogg e misure di decodifica sono versionati. Non sono copie di un brano precedente. Nessun clipping rilevato; ascolto umano, seam percepito, mix e Android sono aperti.
- Conservati anche i nuovi SFX originali `chalk_scrape` e `heal_seal` della lavorazione precedente. Le intro JaguarzCreatorz esistenti non sono sostituite.

## Prove e limiti

`tests/rook.test.mjs`: mira bloccata, velocità e durata dei proiettili, copertura reale, armamento/disarmo/danno delle mine, fase unica e riposizionamento, reset e salvataggio checkpoint, vittoria con tre politiche deterministiche, camera fuori da HUD/comandi.

`tools/verify_rook_browser.cjs`: fixture Blackout corrente, poi soli tasti e UI; attraversa i relè, ricarica il checkpoint, combatte, osserva seconda fase e mine, sceglie Rifugio e ricarica ancora. Rapporto con hash sorgente, richieste asset, contatori dei buffer effettivamente avviati ed errori. L'ultima esecuzione richiede **zero retry del pilota automatico** (due in una prova precedente): non è un playtest umano né una certificazione di difficoltà. Il ritmo e la chiarezza richiedono persone nuove.

Suite del checkpoint Rook `7813ec8`: **162/162 PASS**; corrente: **174/174 PASS**. Il pacchetto di quel checkpoint era 394491 byte JS e 95 risorse; il blocco kit corrente è descritto in `FIELD_KIT.md`. Questo è un controllo di confezionamento, non una prova Android/WebView. COMMERCIAL_READY = 0; COMMERCIAL_RELEASE = BLOCKED.

Tentativo WebView reale: `verify_android_renderer.mjs` non trova una pagina CDP Android su localhost:9222; evidenza `rook-android-webview-block.txt`. `adb` e `sdkmanager` non sono nel PATH. Non viene attribuito alcun PASS Android.

## Ripresa concreta

Kit, Quickdraw e recupero sono completati a livello tecnico; proseguire con gli asset delle armi impugnate e gli sblocchi reali H-17/ARC-7, altri incontri e gare. I gate umani, artistici/audio, IT/EN e Android rimangono aperti. `FIELD_KIT.md` conserva le prove correnti e le lacune.

## Regressione della campagna

Percorso italiano A, da Nuova storia al postcredit: 31 tappe, otto incarichi e due preparazioni, zero errori browser, flag di vittoria Rook salvato. `rook-campaign-a-report.json` conserva il suo hash sorgente. Questo attraversamento precede soltanto la correzione locale dell'occlusione dei colpi da parte delle mine e del loro spegnimento alla sconfitta; dopo quelle correzioni sono stati rieseguiti suite e scontro Rook, con hash aggiornato in `rook-report.json`. Le altre tappe non sono state modificate. B/C completi e osservazioni umane restano aperti sulla candidata corrente.
