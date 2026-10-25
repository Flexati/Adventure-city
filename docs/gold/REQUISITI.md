# CHRONOS Gold — requisiti tracciabili

Il registro canonico è [`CHECKLIST_STATUS.json`](../production/v10.2/CHECKLIST_STATUS.json). Le sue `entries` conservano i 74 ID e i criteri del file [`CHECKLIST_74_INTEGRALE.txt`](../production/v10.2/CHECKLIST_74_INTEGRALE.txt), con hash sorgente nel JSON. `asset_gates` conserva separatamente AS01–AS12; `execution_cards` conserva E00–E12. Non sono 99 criteri intercambiabili.

Ogni voce porta fonte, criterio, stato, dipendenze, implementazione, riferimenti asset, build/commit, scena, procedura, risultato, prova, difetto e ricontrollo. I campi vuoti indicano lavoro da svolgere, non verifica implicita. Stati ammessi: `OPEN`, `IN_PROGRESS`, `IMPLEMENTED`, `VERIFIED`, `PARTIAL`, `FAIL`, `BLOCKED`. Un test automatico chiude soltanto il comportamento che osserva; `VERIFIED` richiede tutte le prove pertinenti al criterio.

La [matrice contenuti e asset](../production/v10.2/MATRICE_CONTENUTI_ASSET_V10_2.json) è l'inventario dei 141 contenuti, 442 famiglie asset e 129 brief audio. Parte da `REQUIREMENTS_ONLY`; il [registro asset](ASSET_REGISTER.json) registra i file effettivamente riscontrati senza convertire la matrice in prove di produzione. Il [registro audio](AUDIO_REGISTER.json) collega tutti i 129 indici alla fonte originale con hash, funzione e sezione, lasciando esplicite le mappature runtime, le transizioni, le licenze e le prove d'ascolto da completare. Non sono 129 brani.

Risultato attuale: 14 `PARTIAL`, 60 `OPEN`, zero `VERIFIED` sui 74 criteri. I casi `NAR01`, `NAR04`, `F02` e `DES21` collegano la nuova migrazione v7 a prove specifiche, ma le rispettive verifiche complete restano aperte. I gate AS ed E hanno stato autonomo.
