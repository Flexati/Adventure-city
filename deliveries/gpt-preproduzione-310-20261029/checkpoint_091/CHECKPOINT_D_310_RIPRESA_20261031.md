# CHRONOS V10.2 — checkpoint D/310, ripresa del 31 ottobre 2026

## Ambito
- Repo: `Flexati/Adventure-city`; ramo esclusivo `delivery/gpt-preproduzione-310-20261029`. Non modificare `main`.
- Catalogo canonico: **310 prompt, 623 PNG** (non equivalenti: una famiglia può richiedere più immagini).
- GitHub verificato prima di questa nota: **256 PNG canonici + 9 PNG extra**.
- Drive: **4 PNG di Aurelia Span 03** già presenti e non ancora integrati su GitHub; manifest `MANIFEST_BACKFILL_007.csv` con SHA-256. Tutti candidati non approvati.
- Nuovo PNG GPT Immagine di Aurelia Span 04, sola variante **giorno**: generato **1536×1024**, **3.764.401 byte**, SHA-256 `075ab39f4afbba9144bd5f6f305d93033143d433d5f685f25af6e70889385579`.
- La variante giorno è salvata su Drive come `RECOVERY_CANDIDATE_region_aurelia_span_v04.png`, ID `12wlKj_zT-XQwiqVBX7YgFhmjvYW3CeCo`. Readback metadata: image/png, 3.764.401 bytes. **Non** ancora approvata artisticamente e **non** presente in GitHub.
- Upload binario Drive → GitHub per Aurelia Span 03 provato con `create_blob` base64: errore di trasporto HTTP/2. Non dichiarare sincronizzato.

## Stato di copertura
- GitHub: **256/623 PNG canonici**, **367 assenti**. Fonte: `ASSET_MANCANTI_VERIFICATI_20261031_367.csv`.
- Unione documentata di GitHub e Drive: 256 + 4 + 1 = **261/623 PNG canonici candidati o recuperati**; **362 assenti** dall'unione. Fonte: `ASSET_ASSENTI_UNIONE_GITHUB_DRIVE_20261031_362.csv`.
- La conta **261** misura l'esistenza di file in almeno una destinazione, non la qualità, il pass SHA cross-provider o l'approvazione.
- Ultimo audit storico 099 (501 PNG presenti, 122 assenti) privo del checkpoint binario; **non ripristinabile**, **non aggiungere 501 al totale**.
- Famiglie approvate: **0**; `COMMERCIAL_RELEASE = BLOCKED`.

## Prossima produzione, ordine vincolante
1. Sincronizzare su GitHub **Aurelia Span 03**, i quattro PNG esistenti su Drive, preservandone esattamente gli SHA-256 e verificando i byte.
2. Revisionare il candidato **Aurelia Span 04 giorno** e, se corretto, trasferirlo come `region/region_aurelia_span/v04.png`.
3. Generare **Aurelia Span 04 notte**, **evento vento**, **props** dal giorno, rispettando geometria identica per A/B/C e chroma RGB (0,255,0) sul foglio props.
4. Procedere sui restanti path della lista **362**, usando i prompt originali (76 famiglie in `RECOVERY_PROMPTS_LAST_KNOWN_099_122.md`, gli altri dal master originario). Non inventare brief mancanti.
5. Per ogni lotto: PNG reale, dimensioni, SHA-256, QA visivo, upload GitHub/Drive e confronto checksum; aggiornare inventario.
6. Obiettivo finale solo a gate PASS: **623/623 byte verificati su entrambe le destinazioni, 0 mancanti, 310 famiglie coperte, 0 mismatch**, poi verifica di qualità. No AAB o release.

Nota: un'immagine ulteriore composta da miniature etichettate D001–D310 è stata prodotta nella sessione ma **scartata** perché non conforme a nessun prompt canonico. Non viene conteggiata né consegnata.
