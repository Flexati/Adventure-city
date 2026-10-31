# Verifica e ripresa CHRONOS — 31 ottobre 2026

## Salvato e verificato

- Set recuperato dal checkpoint 091: 241 PNG unici (232 registrati con hash SHA-256 corrispondente + 9 supplementari). I 10 shard Drive passano CRC e confrontano 241/241 percorsi con hash identici.
- Backfill candidati: 12 PNG per `region.ash_docks.01`, `.02` e `.03` (giorno, notte, evento, props), tutti 1536×1024. Il lotto 002 è stato verificato su Drive e il ramo GitHub candidato.
- Tre fogli props (uno per famiglia) non rispettano il chroma verde esatto #00FF00 e richiedono correzione. Gli altri 9 output restano in revisione artistica, inclusi controlli geometrici fra giorno/notte/evento.
- Google Drive: cartella `CHRONOS_RECUPERO_COMPLETO_DISPONIBILE_CHECKPOINT_091_20261031`. Prima del caricamento del lotto 003 contava 49 elementi.
- GitHub: repository `Flexati/Adventure-city`, ramo `delivery/gpt-preproduzione-310-20261029`; `main` non modificato.

## Copertura e lavoro restante

- Il piano 310 definisce 623 percorsi attesi. Il checkpoint 091 persistente contiene 232 presenti e 391 mancanti; 106 famiglie complete, 204 senza output, zero approvate.
- L’ultima scansione locale 099 prima del reset aveva indicato 501 presenti e 122 mancanti (234 famiglie complete, 76 senza output). Il checkpoint 099 e i suoi byte non sono recuperabili dai backup verificati; questi conteggi sono storici e non costituiscono certificazione attuale.
- La coda 099 comprende 122 output. Dodici hanno ora un candidato generato; 110 restano senza candidato. La coda e le QA allegate contengono lo stato puntuale.
- Proseguire dal prompt `region.ash_docks.04`; correggere i props sheet e completare la revisione artistica.

Stato generale: candidati; `COMMERCIAL_RELEASE = BLOCKED`. Non dichiarare 310/310 completato.
