# Batch 4 — 310 prompt individuali e prime 6 tavole reali (29 ottobre 2026)

`COMMERCIAL_RELEASE = BLOCKED`.

## Decisione di produzione

**Fermato:** il disegno procedurale delle città (scene a 192×108 ingrandite). Messo accanto alle mappe canoniche (`city.png`, `port.png`) e agli sprite di Nox e Lulù, non regge il confronto. Non è stato pubblicato come tavola: nessuna tavola di bassa qualità è finita nel registro.

**Scelta:** l'arte di qualità la produce GPT Immagine, guidato da prompt individuali e da tavole di riferimento fatte solo con arte reale del gioco. Il team controlla, ritaglia e registra.

**Eccezione:** dove l'arte reale esiste già, il team compone direttamente senza ridisegnare. Così sono fatte le 6 tavole di Nox e Lulù.

## Prodotto in questo batch

| Cosa | Dove | Stato |
|---|---|---|
| 310 prompt, uno per tavola, con le 8 sezioni richieste | `requests/gpt-preproduzione-310-20261029/prompt/` e `TUTTI_I_PROMPT.md` | `PROMPT_READY` (non sono immagini) |
| Indice dei prompt (percorso, SHA-256, allegati, file attesi) | `requests/gpt-preproduzione-310-20261029/INDICE.json` | — |
| 15 tavole di riferimento (solo arte reale del gioco, sorgenti con SHA-256) | `requests/gpt-preproduzione-310-20261029/riferimenti/` | — |
| Dati di direzione artistica per 88 contenuti (identità, materiali, palette hex, riferimenti; le proposte sono marcate «proposta») | `tools/preproduction_art_direction.py` | — |
| **6 tavole reali:** `character.nox.01-03` e `character.lulu.01-03` | `assets/preproduction/v10.2/variants/character/character_{nox,lulu}/v0N.png` + `.json` | `TECHNICALLY_VERIFIED` |
| Verificatore delle consegne GPT | `tools/verify_preproduction_delivery.py` | provato su file sintetici: notte con la stessa geometria accettata, evento casuale respinto |

**Registro** `VARIANTI_PREPRODUZIONE_V10_2_20261028.json`:
- tutte le 310 voci hanno `prompt_path`, `prompt_sha256` e `prompt_status: PROMPT_READY`;
- 304 restano `SPECIFIED_NOT_GENERATED`;
- 6 sono `TECHNICALLY_VERIFIED`, con byte e SHA-256 reali.

## Le 6 tavole di Nox e Lulù

Ogni figura è una cella reale degli sheet del gioco, incollata a scala 1:
- `nox_walk`, `nox_actions`, `nox_gun`, `nox_magic`;
- `nox_h17_gun`, `nox_h17_reload` del batch 2;
- gli equivalenti di Lulù;
- il ritratto di gioco preso da `portraits.png`.

**Controllo eseguito:** ogni regione incollata è stata riletta dal PNG salvato e confrontata pixel per pixel con la cella sorgente. In tutte e 6 le tavole risultano **0 pixel diversi**: PASS. I JSON accanto alle tavole riportano celle, coordinate e SHA-256 delle sorgenti. Identità V8 invariata: Nox maschile, Lulù femminile.

## Controlli

- `npm test`: 219/219. È nuovo il test sui 310 prompt (presenza e 8 sezioni). Lo stesso test controlla che ogni voce diversa da `SPECIFIED_NOT_GENERATED` abbia un file reale con i byte dichiarati.

## Cosa manca

- **304 immagini:** servono le generazioni di GPT. L'ordine consigliato è nel README: prima i contenuti già nel gioco.
- **Quando arrivano:** `verify_preproduction_delivery.py --write`, poi la revisione artistica umana (non automatica).
- **Le 442 famiglie:** la riconciliazione con i file reali è il prossimo lavoro documentale, separato da queste tavole.
