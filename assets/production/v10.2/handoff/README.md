# CHRONOS — asset per integrazione Opus

Il produttore degli asset è questa sessione Codex; Opus riceve file reali da integrare, non un incarico che scarichi su di lui tutta la produzione mancante. Questa consegna resta PARZIALE finché le 442 famiglie non sono riconciliate e complete. Il nome dell'archivio e il manifesto mantengono questo limite esplicito.

## Contenuto

L'archivio raccoglie tutti i file esistenti di `game/art`, `game/audio`, `game/video`, i master e le partiture V10.2. Comprende protagonisti, NPC, nemici e boss esistenti, ambienti, veicoli, interfaccia, effetti, musiche, suoni e le due intro JaguarzCreatorz. Presenza non significa copertura completa del mandato. `PACKAGE_MANIFEST.json` registra percorso, byte, SHA-256 e dimensioni; `PRODUCTION_COVERAGE.csv` conserva tutte le 442 righe, anche prive di candidati.

## Nuovi master non ancora integrati

- `nox-vx9-reload-master.png`: 4×4, quattro direzioni per righe; abbassa, estrai, inserisci, pronta per colonne. Durata runtime prevista 1,4 secondi.
- `lulu-r12-reload-master.png`: stessa convenzione, durata prevista 1,6 secondi.
- I nuovi sheet degli stranieri devono seguire `strangers-author-reference.jpg`, scelta esplicita dell'autore. Gli atlanti attuali con combattente calvo e cacciatrice rossa sono visivamente superati dalla nuova istruzione; conservarli come baseline, non come fedeltà alla nuova tavola.

Ispezionare le dimensioni effettive nel manifesto; la generazione non garantisce esattamente quelle richieste nel prompt. I master non sono già registrati nel renderer. Prima di integrarli, controllare ogni cella, ancorare i piedi, eliminare salti di scala attraverso metadati coerenti e verificare la lettura a 112–128 unità di gioco. Non accettare contatti delle mani o frame difettosi solo perché la PNG decodifica.

## Obblighi di integrazione

1. Riprendere `work/chronos-adventure-commercial`, preservando modifiche e salvataggi v7. Leggere le istruzioni del repository e i documenti V10.2 originali.
2. Usare ID stabili. Collegare famiglia → file → evento runtime → build → prova. Aggiornare i registri esistenti senza creare duplicati di verità.
3. Ricarica: animazione legata a reloadRemaining e durata dell'arma. Non consumare o ricreare cartucce nel renderer. Gestire pausa, colpo subito, dash e cambio scena senza lasciare pose bloccate. Cammino durante ricarica richiede una decisione coerente con le regole esistenti.
4. Kairn e Morrow: conservare ruolo, incontro, conseguenze e azioni di contenimento. Non danneggiano Archon e non tolgono il colpo finale a Nox. Il loro aspetto deve seguire la foto, non gli atlanti storici discordanti.
5. Le intro JaguarzCreatorz sono due MP4 già integrati, non nuovi video da inventare. Preservare skip, fallback, lifecycle e comportamento offline. Verificare orientamento e audio su Android.
6. Ogni file usato deve essere incluso nel packaging Android e nella allowlist. Il precedente difetto dei nuovi sheet mancanti dal pacchetto è già stato corretto: ricontrollare solo quando aggiunte invalidano quella prova.
7. Il materiale già prodotto non ha un'approvazione commerciale automatica. Registrare provenienza e condizioni applicabili senza inventare licenze o ascolti.

## Copertura obbligatoria da chiudere prima di chiamare il pacchetto FULL

Protagonisti e compagni; entrambi gli stranieri; tutti i NPC realmente previsti; roster dei 17 incontri; nemici comuni con telegraph, attacco, recupero, danno e morte; nove regioni con collisioni, materiali e illuminazione; veicoli e cinque guide narrative; dieci gare Veyra riconciliate con le fonti; cinque armi con tutti gli stati necessari; mosse, gadget e cure; props e missioni; menu animato; icone e accessibilità; VFX; 129 brief audio e relative espansioni. Il numero 442 indica famiglie documentali, non altrettanti PNG intercambiabili.

## Prove e accettazione

Distinguere PRODUCED, INTEGRATED, TECHNICALLY_VERIFIED e COMMERCIAL_READY. Asset generato non significa animazione completa. Nessuna approvazione di qualità mediante solo hash, nomi o esistenza. Confrontare i nuovi asset con V8/V8.5 effettivamente disponibili. Riutilizzare ciò che è migliore; respingere regressioni. Separare sempre direzione artistica e coerenza narrativa.

La baseline tecnica più recente pubblicata è 176/176 test al commit 3f7c850. Non è una certificazione delle immagini aggiunte dopo quel commit. Servono prove visive e sonore pertinenti, WebView e Android, utenti nuovi e tempi attivi verso 120 minuti. Nessun test umano, dispositivo o risultato di ascolto va inventato.

## Ciclo di esecuzione

Osserva → riproduci → definisci accettazione → integra → prova → confronta → correggi → registra. Dopo tre tentativi inefficaci cambia ipotesi. Riusa prove ancora valide. Continua sugli interventi indipendenti quando una dipendenza esterna blocca altro. Non dilatare il gioco con attese, grinding o ripetizioni. IT/EN resta richiesto ma l'autore ha chiesto di non dargli priorità rispetto a gioco e asset.

## Chiusura

Il riferimento a grandi autori esprime ambizione qualitativa, non un loro coinvolgimento o approvazione. Il criterio concreto è un'esperienza coerente, leggibile, varia e verificata. Dichiarare MANDATO COMPLETATO solo con tutti i gate soddisfatti. Fino ad allora: MANDATO PARZIALE e COMMERCIAL_RELEASE BLOCKED. Nessuna nuova chiave Play, nessuna pubblicazione sullo store senza istruzione esplicita.

## Stranieri prodotti dalla nuova foto

`kairn-master.png` e `morrow-master.png`: 16 pose ciascuno, griglia 4×4, direzione destra. Riga 0 attesa, riga 1 cammino, riga 2 attacco; riga 3 difesa/danno per Kairn e fucile per Morrow. Ispezione visiva della tavola generata: identità, abiti, colori e armi ora seguono il riferimento dell'autore. Lato sinistro eventualmente tramite flip, con verifica narrativa dell'arto armato di Morrow. Mancano ancora integrazione, prove di contatto, animazioni di morte se necessarie e controllo del ciclo a scala mobile. Non sostituire semplicemente i PNG storici: hanno griglia 8×3 e metadati diversi. Adattare manifest e mapping di animazione prima della sostituzione.
