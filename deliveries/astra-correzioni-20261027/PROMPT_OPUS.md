# Prompt da dare a Opus

Lavora in Flexati/Adventure-city. Il ramo di integrazione è work/chronos-adventure-commercial. La nuova consegna è nel ramo delivery/astra-correzioni-20261027, directory deliveries/astra-correzioni-20261027. Non usare amzajaguar-blip/City-Adventure-.

Leggi prima docs/gold/ASTRA_INTEGRAZIONE_20261027.md sul ramo di integrazione, poi README.md, INDICE.json e PROVENIENZA.json della nuova consegna. Estrai entrambi gli ZIP nella stessa directory e verifica byte/SHA-256 prima di usare gli asset.

Sono consegnati 17 file relativi ai punti 1–4 e 6–8. Il punto 5 G6/G7 è APERTO: le basi y299/300/319 sono incompatibili con 12 px di margine inferiore nei formati richiesti. Non segnalarlo completato e non sostituire gli sheet di Nox/Lulù con quelli della consegna precedente. Occorre decidere se mantenere le basi runtime (proposta) o i 12 px inferiori. Nessuna ricarica ARC-7 nuova.

Confronta i nuovi asset con quelli già integrati. Verifica nel gioco la continuità delle strade e del cavo ruotato, le quattro finestre H-17 a 48 px/grigio, i piloni/nastri e i tre stati della corsia diritta. La hitbox resta 560×64. Usa le righe della spazzata per carica 0–0,69 s, lock 0,69–1,25 s e colpo. Non inventare nuove temporizzazioni.

Riproduci race_count_beep a 3, 2 e 1, race_go allo zero. Ascolta e controlla i due suoni: Astra ha effettuato analisi numerica, non ascolto umano. I report non costituiscono approvazione artistica o test del runtime.

Integra solo i file che superano la tua verifica, con i test pertinenti del repository. Non rifare asset già integrati o conservati. Non produrre «Due colpi», cancelli Aurelia Span o Veyra a piedi. Non modificare chiavi o script di firma. Aggiorna il registro distinguendo integrati, conservati, respinti e aperti. Riporta commit, test realmente eseguiti e problemi residui senza dichiarare chiusa l'intera consegna finché G6/G7 resta aperto.
