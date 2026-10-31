# CHRONOS V10.2 — CLAUDE OPUS: RIPRESA E CONSEGNA DI TUTTI I 310 PROMPT

Checkpoint controllato: **2026-10-31**. Repository `Flexati/Adventure-city`. Lavorare esclusivamente sul ramo `delivery/gpt-preproduzione-310-20261029`. Non modificare `main`.

## Stato dimostrato dai manifest e dall'albero GitHub
- **310 prompt = 623 PNG canonici attesi**.
- **232 PNG** registrati al checkpoint 091: presenti sul ramo e corrispondenti nei Git blob SHA e nelle dimensioni.
- **24 PNG** prodotti nei sei lotti successivi: presenti sul ramo, dimensioni file corrispondenti; ancora candidati.
- **9 PNG extra**, fuori perimetro. **265 PNG** complessivi effettivamente presenti nel ramo.
- **367 PNG canonici assenti**. Elenco esaustivo in `ASSET_MANCANTI_VERIFICATI_20261031_367.csv`.
- Checkpoint 099 storico: 501 presenti/122 assenti *solo secondo l'ultimo audit locale*, bytes non ripristinati: NON contarli come caricati.
- Dei 24 candidati, **6 props sheet** non soddisfano l'esatto `#00FF00`; gli altri **18** attendono revisione. Famiglie approvate: **0**; `COMMERCIAL_RELEASE=BLOCKED`.

## Riferimenti autorevoli da leggere prima delle nuove immagini
1. `MANIFEST_310_EXPECTED_623.csv` (stato/path/hash di tutti e 623 i file).
2. `ASSET_MANCANTI_VERIFICATI_20261031_367.csv` (coda realmente assente).
3. `RECOVERY_PROMPTS_LAST_KNOWN_099_122.md` (i 76 prompt canonici disponibili della vecchia coda, **non** tutti i 310).
4. Recuperare i prompt canonici restanti dal master originale di preproduzione e dal checkpoint 083 in Libreria/Drive; NON ricostruirli inventandoli.
5. `ASSET_PRESENTI_RECUPERATI_091.csv`, `MANIFEST_BACKFILL_001.csv`–`006.csv`, `ASSET_EXTRA_NON_ATTESI_091.csv`.

## Mandato esecutivo
- **Riparti dal prompt `region.aurelia_span.03` (7/310)**. Continua per ciascuno dei 310 prompt individuando i soli output mancanti/candidati che richiedono QA e correzione. Non perdere elementi già esistenti.
- Produci immagini reali, non prompt di facciata o placeholder. Per le regioni: prima giorno 1536×1024; notte ed evento devono essere modifiche della **stessa geometria**; props 1536×1024 su RGB uniforme (0,255,0), griglia 4×3. Rispetta i riferimenti visivi originali e l'identità del mondo.
- Ogni output deve essere un PNG valido nel path canonico `deliveries/gpt-preproduzione-310-20261029/...`. Valida firma PNG, misure, SHA-256, congruenza notte/evento, eventuale chroma esatto, provenienza, diritti e qualità artistica; non spacciare candidati per approvati.
- Per ciascun lotto: effettua commit atomico sul ramo di consegna, upload degli stessi bytes nella cartella Drive `CHRONOS_RECUPERO_COMPLETO_DISPONIBILE_CHECKPOINT_091_20261031`, readback, confronto SHA-256 su entrambe le destinazioni; logga URL e checksum. ZIP/mirror devono passare CRC. Non creare AAB finale.
- Verifica a ogni checkpoint con `node deliveries/gpt-preproduzione-310-20261029/checkpoint_091/VERIFY_310_INTEGRITY.mjs`. A completamento esigi **623/623** file, **0 mancanti**, **0 mismatch**, tutti i 310 prompt coperti e qualità accettata, oltre all'identità GitHub ↔ Drive.
- Se un generatore, un allegato originale, un upload o un permesso mancano, registra il fallimento esatto e salva un checkpoint; **non dichiarare completo il pacchetto** né simulare un lavoro asincrono.

Questo file è un handoff operativo; NON genera immagini in sé.
