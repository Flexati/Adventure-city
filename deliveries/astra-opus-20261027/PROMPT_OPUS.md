# Prompt per Opus — integrazione dei candidati Astra

Lavora nel repository privato Flexati/Adventure-city, sul ramo work/chronos-adventure-commercial o sul ramo di integrazione concordato con il team. Il materiale è basato sul commit 71a35ec: controlla HEAD, AGENTS.md e modifiche locali, preservando ogni aggiornamento successivo. Non usare amzajaguar-blip/City-Adventure- come baseline.

La consegna si trova nella cartella archivi del ramo di consegna:
https://github.com/Flexati/Adventure-city/tree/delivery/astra-opus-20261027/deliveries/astra-opus-20261027/archivi

Scarica tutti i nove ZIP dalla cartella archivi e INDICE.json dalla cartella superiore, verifica dimensioni e SHA-256 indicati nell'indice, poi estrai gli ZIP nella stessa cartella di staging, NON direttamente sopra il gioco. Ogni archivio è inferiore a 20 MB. I file sono nel ramo `delivery/astra-opus-20261027`, percorso `deliveries/astra-opus-20261027/archivi/`. Recuperali in una cartella separata: non cambiare il ramo di lavoro del gioco e non estrarre direttamente sopra il checkout.

Leggi nell'ordine LEGGIMI_PRIMA.md, documenti/PROMPT_OPUS.md, documenti/INTEGRAZIONE.md, documenti/QUALITA_E_LIMITI.md, documenti/EXPORT_REPORT.json e MANIFEST_SHA256.json, poi i documenti originali pertinenti in gold e production/v10.2. L'indice e la copia consultabile dei rapporti sono anche in deliveries/astra-opus-20261027 sul ramo delivery/astra-opus-20261027.

Contenuto: 34 PNG candidati G3–G12, 16 file audio A5 (otto contenuti FLAC+OGG), master, P1 precedenti recuperati dal repository, specifiche e inventario originale delle 460 righe. Non tutte le famiglie sono completate. P2/P3 e i candidati non accettati restano APERTI. Il codice è stato usato da Astra soltanto come riferimento e non è stato modificato. Nessun progetto Android o strumento di firma Play è incluso.

Il tuo incarico è controllare e integrare nel checkout completo solo i file conformi. Non chiudere una famiglia per la sola presenza del file. Verifica le anomalie documentate: bordi ripetibili delle strade, carreggiata x130–590, celle e VFX tagliati, identità e ancoraggi dei protagonisti, camera a quattro colpi H17, cavo Anchor ripetibile e transizioni del boss. Se un asset non supera il controllo, registralo come respinto con motivo e correzione richiesta, senza alterare meccaniche o hitbox per adattarle all'immagine.

Nox è maschile, Lulù femminile. Mantieni identità, costumi, proporzioni e canone. Ricariche candidate 1305×1285 seguono il runtime RELOAD_DRAW_SCALE=321.25/301.25; la discrepanza col prompt Excel va mantenuta esplicita. Preserva tutti i gate delle armi e i tempi di ANCHOR_RULES. Per The Anchor: scudo con almeno una cima, Risonanza che taglia una cima, due colpi per cima, carica 1,25 s con lock al 55%, esposizione 10/7,5 s, salvataggio e retry.

Esegui i test appropriati, inclusi npm test e le prove Anchor/browser pertinenti, e controlla mobile verticale/orizzontale, reduced motion, compatibilità mono e loop. La baseline è stata verificata con 199 test passati, non sono prove dei nuovi asset. Audio A5: controlli tecnici di durata e picco passati; ascolto umano e mix runtime non attestati. Non inventare ascolti, approvazioni o test Android.

Consegna commit/PR, elenco preciso dei file integrati e respinti, evidenze e lacune residue. Non dichiarare COMMERCIAL_RELEASE sbloccata. Non applicare né riaprire la vecchia PR #7 sull'altro repository: è stata chiusa senza merge.
