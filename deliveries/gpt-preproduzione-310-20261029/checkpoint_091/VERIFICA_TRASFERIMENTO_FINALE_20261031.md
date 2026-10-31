# Verifica e ripresa CHRONOS — 31 ottobre 2026

## Salvato e verificato

- Set recuperato dal checkpoint 091: 241 PNG unici (232 registrati con hash SHA-256 corrispondente + 9 supplementari). I 10 shard Drive passano CRC e confrontano 241/241 percorsi con hash identici.
- Backfill successivo: 4 candidati generati per `region.ash_docks.01` (giorno, notte, evento, props), tutti 1536×1024. Ora il set su Drive/GitHub comprende 245 PNG candidati/recuperati.
- I 4 file Ash Docks sono stati caricati singolarmente anche su Drive e collegati sul ramo GitHub; manifest e QA sono stati aggiornati. Il foglio props è `NEEDS_CORRECTION`: il verde è vicino al chroma richiesto ma non uniforme #00FF00. Gli altri 3 restano in revisione artistica.
- Google Drive: cartella `CHRONOS_RECUPERO_COMPLETO_DISPONIBILE_CHECKPOINT_091_20261031`, 40 elementi dopo il backfill, inclusi 10 shard base, pacchetto checkpoint, prompt e output Ash Docks.
- GitHub: repository `Flexati/Adventure-city`, ramo `delivery/gpt-preproduzione-310-20261029`; nessuna modifica a `main`.

## Copertura e lavoro restante

- Il piano 310 definisce 623 percorsi attesi. Il checkpoint 091 persistente contiene 232 presenti e 391 mancanti; 106 famiglie complete, 204 senza output, zero approvate.
- L’ultima scansione locale 099 prima del reset aveva indicato 501 presenti e 122 mancanti (234 famiglie complete, 76 senza output). Il checkpoint 099 e i suoi byte non sono recuperabili dai backup verificati; questi conteggi sono storici e non sono una certificazione attuale.
- La coda 099 include 76 prompt canonici per 122 output. Dopo il backfill del prompt 1, restano 118 output senza file candidato; 4 sono candidati e non approvati.
- Ripresa: correggere il chroma del props sheet e completare la QA di Ash Docks 01; poi generare gli output mancanti in ordine 1–18, 41–43, 50–52, 259–262 e 263–310.

Stato generale: candidati; `COMMERCIAL_RELEASE = BLOCKED`. Non dichiarare 310/310 completato.
