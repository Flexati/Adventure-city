# CHRONOS Gold — punto di ripresa

Branch `work/chronos-adventure-commercial`. Le modifiche vengono conservate nel checkpoint Git di questa iterazione; i riferimenti di prova indicano file e sorgenti, non un APK commerciale. Il [rapporto operativo V10.2](../production/v10.2/EXECUTION_STATUS.md) conserva il quadro precedente e le correzioni di questa iterazione.

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
