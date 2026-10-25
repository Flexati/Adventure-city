# CHRONOS V10.2 — stato della candidata

Branch: `work/chronos-adventure-commercial`. Questo documento registra prove della candidata corrente; non autorizza un rilascio commerciale.

## Direzione artistica

- Il menu usa lo sfondo Vanta già valido con panoramica lenta e atmosfera mobile. `prefers-reduced-motion` disattiva entrambe le animazioni. Il controllo browser copre sei viewport, apertura delle opzioni, nuova partita e ripresa del salvataggio.
- L'icona quadrata è stata derivata dalla prima immagine fornita dall'autore: Nox e Lulù ai lati di un quadrante spezzato, senza scritte minute. Il master 1254 px e la variante 512 px sono in `assets/brand/`; la variante Android è in `android/res/drawable-nodpi/` ed è richiamata dal manifest. Provenienza: immagine di riferimento fornita dall'autore e generazione assistita in questa sessione. Nessuna licenza commerciale esterna è stata attestata.
- `Segni di Gesso` ha un segno fisico locale e un civile in pixel art, con un suono sintetico di interazione dedicato. Un confronto browser ha mostrato facciate ripetute nel fondale iniziale; la missione ora usa la superficie industriale del porto, con texture portuali e perimetro di difesa leggibile. Le due rotte usano un perimetro diverso; la traccia appare nel percorso di Nox dopo il completamento.
- Confronto menu 390×844: `docs/evidence/v10.2/menu-before-390x844.png` e `menu-after-390x844.png`. Confronto della superficie della missione alla stessa risoluzione: `chalk-before-surface-390x844.png` e `chalk-after-surface-390x844.png`, ottenuti da un salvataggio di prova alla stessa tappa. Sono screenshot browser, non prove di resa Android o di campagna completa.
- Lacune: confronto sistematico di silhouette, luci, materiali, nove regioni, personaggi, VFX e HUD; icone complete per ogni azione; prestazioni e leggibilità su dispositivi. Il pacchetto V10.2 porta specifiche e matrici, non nuovi media di gioco pronti. I pacchetti WebP/ZIP V8.5 del ramo `main` richiedono riparazione prima di essere usati.

## Coerenza narrativa

- `exp_chalk_marks` è ora una tappa obbligatoria dopo la separazione e prima di `below`. Lulù ascolta gli abitanti, sceglie `direct` o `service`, riattiva due accessi e difende la rotta. La scelta cambia il luogo e la durata della difesa, senza decidere chi merita soccorso.
- La scelta è salvata in `exp.chalk.route`; l'esito e la ricompensa sono registrati dopo la vittoria e l'idempotenza della ricompensa usa il sistema già esistente. In `below`, Nox vede il gesso e una persona che lo segue; può dedurre che un passaggio è stato riaperto, senza sapere che l'ha fatto Lulù. `exp.chalk.callback_seen` evita la ripetizione dopo un salvataggio.
- I salvataggi v7 storici già oltre la nuova tappa vengono portati a `Segni di Gesso` durante la separazione. Dopo la vittoria ritornano alla tappa e al checkpoint originali tramite ID stabili, senza duplicare il premio. Il ritorno numerico dei vecchi hub viene corretto tramite l'ID di tappa. La scelta è compiuta dal giocatore nel recupero, mai inventata dalla migrazione.
- Nell'Archivio Nox descrive il gesso come traccia di «qualcuno»: non può sapere che Lulù abbia riaperto il passaggio soltanto dal segno materiale.
- Lacune: `exp_interrupted_shift`, `exp_borrowed_light`, revisione di tutte le missioni e meccaniche alla luce del canone, inglese del gioco principale e prove umane di comprensione. Le battute inglesi di lavoro nel mandato non sono ancora un percorso IT/EN giocabile.

## Sistemi, contenuti e durata

- La candidata contiene 31 tappe nella campagna, 12 missioni a piedi, cinque interludi di guida e quattro hub. Le sette gare Veyra e le cinque armi V9 esistono in laboratori separati, ancora da integrare nella progressione principale. Le tre gare V10.2 `ash_switchyard`, `solkara_regularity` e `noctis_lightline` non sono implementate. I 17 incontri di base e le nove regioni richieste non sono dimostrati nella campagna.
- La matrice V10.2 registra 141 contenuti, 442 requisiti asset e 129 brief audio. La validazione in modalità `plan` passa; il gate `release` fallisce con 4831 errori di copertura/classificazione/associazione. La validazione formale non prova produzione, diritti o ascolto dei media. L'espansione audio rimane da produrre e verificare.
- La durata richiesta è una mediana umana vicina a 120 minuti. Nessuna durata umana è stata misurata; il tempo del browser automatizzato non vale come tempo di gioco umano.
- `CHECKLIST_STATUS.json` conserva tutti i 74 criteri e, separatamente, AS01–AS12 ed E00–E12. Dopo la migrazione: 14 PARTIAL e 60 OPEN, nessun VERIFIED commerciale. Le prove esistenti v9 sono riusabili solo dove la candidata non le ha invalidate.

## Prove tecniche

- Suite Node: 146/146 PASS; le verifiche aggiunte coprono entrambe le rotte e la migrazione dei checkpoint v7 storici. Questo numero non certifica la qualità commerciale.
- Android asset pack: 81 risorse locali, script 326703 byte, sotto il limite di 512 KiB. Il test di allowlist conferma i due nuovi SVG.
- Browser: verifica del menu su sei viewport PASS. Gli attraversamenti automatizzati A e B della stessa sorgente (`3f42cf4e…`) raggiungono entrambi il finale con 31 tappe, otto incarichi e due preparazioni, senza errori di pagina. A salva `direct`, B salva `service`; entrambi salvano completamento e callback. Rapporti: `docs/evidence/v10.2/campaign-a-report.json` e `campaign-b-report.json`. Screenshot del gioco: `chalk-direct-gameplay.png`, `chalk-service-gameplay.png`, `chalk-callback-nox.png`. Il clock accelerato non misura durata umana o FPS.
- Browser, sorgente dopo la migrazione: due continuazioni di salvataggi pre-espansione v7, Archivio al boss e hub Toxic con indice storico, superano UI reale e tastiera. Il rapporto è `docs/evidence/v10.2/chalk-migration-report.json`; screenshot `archive-restored.png` e `toxic-restored.png`. I rapporti A/B sopra precedono questa modifica e vanno ripetuti prima di valere per la candidata attuale.
- Mancano Android SDK/API 36, build-tools 36.0.0, bundletool e le credenziali della chiave privata di upload in questo ambiente. `tools/build_play_aab.sh` usa per default il versionCode 2 scelto per la prossima build e `tools/build_aab.sh` controlla l'impronta SHA-256 della chiave e del bundle quando è impostata l'impronta attesa. Nessun AAB commerciale viene dichiarato prodotto.

## Prossime dipendenze concrete

1. Completare IT/EN, asset e regia della missione introdotta, poi le altre due missioni V10.2.
2. Integrare nella campagna sette gare e cinque armi esistenti, aggiungere le tre gare V10.2, quindi misurare ritmo e durata con persone nuove.
3. Chiudere i requisiti di nove regioni, 17 incontri, audio e verifiche artistiche/narrative su build Android reale.
4. Solo a candidata completa, usare SDK/API 36 e la chiave privata già esistente per costruire e validare l'AAB Play versionCode 2. Non generare una nuova chiave.

## Aggiornamento Gold — intro e regressioni

Le rotte A/B/C sulla sorgente `3afdbec0…` raggiungono il finale: 31 tappe, otto incarichi e due preparazioni ciascuna, zero errori. I rapporti `campaign-a-report.json`, `campaign-b-report.json`, `campaign-c-report.json` sono aggiornati. Intro e CSS HUD sono cambiati successivamente e coperti dalle verifiche specifiche studio/migrazione; non è stato rifatto il playtest umano né Android.

Le intro dell’autore sono integrate e incluse nel packager Android, con tipo video/mp4 nella allowlist. Browser e decodifica completa PASS; diritti, ascolto/revisione umana e dispositivo restano aperti. Il checkpoint del boss non copre più salute e Bagaglio: screenshot prima `archive-restored.png`, dopo `archive-restored-after.png`. Registri persistenti e prossimo intervento: `docs/gold/STATO.md`.
