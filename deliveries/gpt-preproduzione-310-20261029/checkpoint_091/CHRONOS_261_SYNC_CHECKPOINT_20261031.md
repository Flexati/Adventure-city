# CHRONOS — Sincronizzazione asset realmente esistenti — 31/10/2026

Repository: `Flexati/Adventure-city`; solo branch `delivery/gpt-preproduzione-310-20261029`.

## Risultato

- Catalogo: **310 prompt / 623 output PNG canonici**.
- **261/623 PNG canonici presenti su GitHub**, **362 mancanti**. Altri **9 PNG extra non canonici** presenti nel recupero del checkpoint 091.
- **261/261 PNG canonicali effettivamente recuperati dai backup già in Google Drive**: 232 nel recupero checkpoint 091 (10 ZIP), 28 nei 7 archivi BACKFILL, 1 nuovo Aurelia Span v04 giorno (contenuto nel checkpoint di ripresa e presente anche come PNG singolo su Drive). I sette archivi BACKFILL non vanno confusi con i sette archivi del nuovo mirror rifiutati.
- I 261 file sono stati letti come byte e confrontati con gli SHA-256 registrati nel master di ripresa: **261/261 PASS**, firma PNG **261/261 PASS**.
- Confronto del SHA Git *blob* calcolato localmente sui 261 PNG con l'albero GitHub verificato al commit `f9aa29e442f039b11ff85d090373594882c19a65`: **261/261 PASS**, zero mismatch di contenuto o dimensione in byte.
- Dimensioni tecniche delle mappe: **12 PNG non conformi** al requisito 1536×1024 (Necropolis v03/v04 e Noctis Vale v01). Vedi il manifesto per le dimensioni. Tutti restano candidati.
- **0 famiglie approvate**, `COMMERCIAL_RELEASE = BLOCKED`.

## Copia aggiuntiva ordinata su Drive

Sono stati creati **18 ZIP mirror** da meno di 38 MiB ciascuno, che complessivamente contengono i 261 PNG a path canonico, CRC validi. Su Drive sono stati caricati e riletti per presenza/metadati **11/18 ZIP** (lotti 01–10 e 12), equivalenti a **182 PNG**. Gli altri **7 ZIP** (11, 13–18) sono stati rifiutati dal connettore Drive con `forbidden` / cartella non scrivibile anche nella cartella secondaria. Non dichiararli caricati. **I 261 PNG erano già disponibili nei 17 backup originali Drive**: il mirror aggiuntivo parziale non ne diminuisce la copertura.

Archivio primario di recupero: https://drive.google.com/drive/folders/1EpVE5oZIEa5M7wY6CL3mjcwHK5yVokVW

Nuovo manifesto con path, SHA-256, SHA Git, dimensioni, sorgente e QA: `CHRONOS_261_MIRROR_MANIFEST.csv` nella stessa cartella Drive e in questo ramo GitHub. Stato aggiuntivo: `CHRONOS_261_MIRROR_VERIFICATION_V2.json`.

## Regole

Non mescolare prompt pronti con immagini reali. Non produrre placeholder. Non modificare `main`, non generare AAB. Prossima produzione delle immagini assenti: 362 path canonici, partendo dalle tre varianti di Aurelia Span 04 (notte, evento, props). Verificare anche geometria notte/evento, chroma props e approvazione artistica.

Checkpoint GitHub scritto per conservare lo stato: non dichiara caricati i 7 ZIP nuovi rifiutati.
