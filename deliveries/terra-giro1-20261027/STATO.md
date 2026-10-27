# CHRONOS — Terra giro 1: consegna parziale

Riferimento: `Flexati/Adventure-city`, `work/chronos-adventure-commercial`, commit `d42c5f9488e6c2780d991eaefe487b97b7a35392`. Il kit è stato verificato prima della lavorazione: 12.078.394 byte, SHA-256 `8a3edf50edbf9877699f428b1691c5cc4e26915e1f630ff7777ac22b8caf1850`; tutti i 23 file interni indicizzati corrispondono per byte e hash.

## G5b — PASS

Consegnate le tre varianti ruggine, cobalto e verde, ciascuna normale e colpita, con i sei master e lo script di esportazione. Il controllo `python3 -I tools/verify_terra_containers.py <cartella asset>` del kit ha restituito PASS: tutte le immagini sono 128×192, con riquadro rilevato esattamente a x 16–111 e y 22–168. Risultato completo in `g5b/rapporto_container.json`. L'esportazione ritaglia la regione con alpha >24 dei master, la ridimensiona a 96×147 con Pillow Lanczos e la colloca a (16, 22) su tela trasparente. I master sono generazioni separate per ogni stato; il danno e i dettagli cambiano tra i due stati.

## G4 — aperto

I tre master di tentativo, 887×1774, mostrano banchina, gru e deposito ma hanno ringhiere o altri oggetti che proseguono attraverso il bordo alto o basso. Non soddisfano la richiesta di terminare con paletti a 4–8 px dal bordo. Non esistono ancora corpi finali 720×1392, mappe luci o giunto condiviso verificati e il builder non è stato eseguito; nessun file G4 è dichiarato pronto.

## G6/G7 — aperto

Sono state generate separatamente viste delle armi H-17 (master 1536×1024) e ARC-7 (master 1254×1254), ma non sono state completate le composizioni delle 64 celle, le riparazioni del corpo sotto le armi, le quattro maschere e i relativi controlli. Non è stato verificato alcun PASS dei quattro sheet. I formati di riferimento da rispettare rimangono 1676×1348, 1305×1285, 1508×1392 e 1305×1285; i tentativi di armi isolate non sono sheet di consegna.

Nessun test di gioco, ascolto o approvazione artistica è stato effettuato. Gli asset già integrati o esclusi non sono stati rifatti.

## Ripresa — master per il team, 2026-10-27

Le quattro viste H-17 isolate sono in `master/` (side, back, front, diag_back), generate dall’icona del kit. Sono materiali intermedi: composizione e controlli spettano al team. Il design varia fra le viste. Restano da generare caricatore, effetto, viste ARC-7, cella ed effetto e tutti i master G4. Un tentativo banchina è 887×1774, sotto il minimo 1024×2048, e non è consegnato come master. Nessun nuovo controllo degli asset o test di gioco è stato eseguito. L’indice esistente non è aggiornato per questa ripresa; byte e hash saranno calcolati dal team.
