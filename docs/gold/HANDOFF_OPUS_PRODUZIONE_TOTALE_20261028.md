# MANDATO DIRETTO A CLAUDE OPUS — CHRONOS V10.2 / PRODUZIONE TOTALE

Data: 28 ottobre 2026
Repository: https://github.com/Flexati/Adventure-city
Ramo sorgente: `work/chronos-adventure-commercial`
Stato release: `COMMERCIAL_RELEASE = BLOCKED`

## Prompt da eseguire

Sei Claude Opus, responsabile di Art Pipeline, Coding, Quality Assurance e coordinamento di produzione per CHRONOS Adventure: Nox & Lulù. **Non limitarti a riassumere o riscrivere i prompt: lavora sui file reali, prepara i batch, produci/integrali dove possibile e registra le lacune.** L'account con accesso a Flexati può consultare i file su GitHub. Comincia recuperando il branch corrente, l'HEAD attuale e i documenti qui sotto. Se non hai un accesso GitHub funzionante o uno strumento di generazione grafica idoneo, descrivi esattamente il blocco e consegna comunque i piani eseguibili senza simulare generazioni o test.

### Apri queste fonti in questo ordine
1. `docs/gold/APPENDICE_PRODUZIONE_V10_2_20261028.md` — ingresso generale.
2. `docs/gold/ASSET_NECESSARI.md` — 92 immagini immediate, 442 famiglie e 141 contenuti di V10.2.
3. `docs/gold/VARIANTI_PREPRODUZIONE_V10_2_20261028.json` — **310 schede specifiche**, con ID, nome file, categoria e stato.
4. `docs/gold/APPENDICE_REGIONI_CITTA_V10_2_20261028.md` — 36 concept per 9 regioni.
5. `docs/gold/APPENDICE_NPC_PERSONAGGI_V10_2_20261028.md` — 78 varianti per 26 persone e NPC.
6. `docs/gold/APPENDICE_NEMICI_VARIANTI_V10_2_20261028.md` — 48 varianti per 16 nemici.
7. `docs/gold/APPENDICE_BOSS_VARIANTI_V10_2_20261028.md` — 68 tavole per 17 boss.
8. `docs/gold/APPENDICE_ABILITA_MOSSE_V10_2_20261028.md` — 80 tavole per 20 abilità.
9. `docs/gold/PROMPT_OPUS_VARIANTI_V10_2_20261028.md` — mandato tecnico precedente, da applicare insieme a questo handoff.
10. `docs/gold/DECISIONI.md`, `VARIETA_VISIVA.md`, `STATO.md`, `ASSET_REGISTER.json` e le richieste `requests/`.

### Regola nuova e inderogabile dell'autore
**Genera i concept ANCHE per città, personaggi, nemici, boss e mosse non ancora giocabili.** Una scena assente NON è ragione per bloccare una tavola di preproduzione. Conserva quei master in `assets/preproduction/v10.2/variants/` come `CONCEPT_ONLY`, con riferimenti, palette e metadati; le misure runtime restano `null` finché il livello non esiste. Non cambiare hitbox, pivot, tempi, bilanciamento o narrativa per far entrare la grafica.

### Inventario immediato da chiudere
- **13 auto/store**: `requests/gpt-auto-store-20261028/PROMPT_GPT.md`; 12 stati auto dei rivali 02/03 (base, tre danni, notte A/B) più `store_feature.png`. Due basi prima, poi varianti DERIVATE dalle basi: vista dall'alto, muso verso l'alto, silhouette identica, verde puro #00FF00; confronta con `race_veyra_car.png`.
- **64 celle armi**: `requests/terra-giro2-armi-20261027/PROMPT_TERRA.md`. Il ramo `delivery/terra-giro2-armi-20261027` aveva 32/64 celle Nox nella ricognizione; verifica in tempo reale e completa le 32 Lulù mancanti senza sostituire il volto o il corpo. Quattro sheet, 16 celle ciascuno. Armi H-17 e ARC-7, maschere originali.
- **15 props Ash Docks**: `requests/terra-giro3-gara-20261028/PROMPT_GPT.md`, da illustrare con qualità maggiore rispetto ai 34 oggetti procedurali già presenti su `delivery/terra-giro3-gara-20261028`. Conserva questi ultimi come fallback. Verifica la soppressione del verde e il problema noto di ricomposizione Lanczos prima dell'uso.
Totale: **92 immagini richieste**, NON 92 immagini già pronte.

### Inventario aggiuntivo
Genera tutte le **310 tavole** del registro JSON indipendentemente dalla loro presenza nel codice: 36 città, 78 NPC, 48 nemici, 68 boss, 80 mosse. Queste richieste di tavole possono implicare più output per tavola; non confonderle con le 442 famiglie del censimento V10.2 né dichiararle consegnate solo per il fatto che i prompt sono presenti. Usa gli ID e percorsi previsti, procedendo con batch tracciabili. Per le varianti inventate ma non adottate (Ivo/Neris) limita a concept archivistici, senza aggiungerle al gameplay. Non usare la L-6 come sesta arma della campagna.

### Direzione artistica obbligatoria
Pixel art dettagliata leggibile a scala Android, bordi e ombre a gradini, prospettiva e luce coerenti con l'arte già in gioco. Città vive con cittadini, officine, negozi e distretti distinti, non scenari neon intercambiabili. NPC con attività e identità, nemici distinguibili per silhouette e comportamento, boss con telegraph e arene leggibili, mosse in stati anticipo/azione/impatto/recupero. **Nox è maschile, Lulù femminile.** Conserva il loro design V8; modifica soltanto regioni mascherate. Marchi e testi inventati. Non copiare marchi, personaggi o opere altrui.
Per stati danno e notte modifica la base per mantenerne forma e posizione. Un'immagine promozionale non è automaticamente uno sprite sheet: non fingere di poter ritagliare un collage in asset runtime senza validazione.

### Fonti visive: distinzione necessaria
Sul repository sono stati pubblicati **documenti e registro** delle 310 tavole. Tre atlanti grafici sperimentali generati in chat sono stati consegnati separatamente come ZIP `CHRONOS_V10_2_CONCEPT_PREPRODUZIONE_20261028.zip`; **non è confermato che lo ZIP sia su GitHub**. Non attribuire a te stesso la loro visione né affermare di averli scaricati dal repository. Se lo ZIP non risulta in GitHub, prosegui usando i riferimenti REALMENTE presenti nel repo, incluso `requests/gpt-auto-store-20261028/race_veyra_car.png`, e registra la dipendenza facoltativa dal ZIP. Gli atlanti di chat sono bozze non canoniche, con possibili oggetti estranei alla storia, e non vanno integrati automaticamente.

### Pipeline e condizioni di successo
- Fai audit di GitHub: HEAD, percorsi e branch delivery, elenco dettagliato `expected/present/missing/rejected/integrated`.
- Produci **file veri**, uno per artefatto, non file segnaposto spacciati per disegni. Mantieni commit atomici, cartelle stabili e master originali.
- Per ogni PNG o OGG realmente prodotto: tool e versione reali, prompt/source, condizioni d'uso documentate, byte, SHA-256 reale del file, misure, alpha o verde puro, bounding box, pivot quando definito. Git blob SHA non equivale allo SHA-256.
- Mantieni lo stato `SPECIFIED_NOT_GENERATED` quando esiste solo la scheda; `GENERATED_UNVERIFIED` al primo file; `TECHNICALLY_VERIFIED` dopo un controllo reale; `CONCEPT_ONLY` per scene non ancora giocabili. Non assegnare `INTEGRATED_VERIFIED` senza esecuzione nel gioco.
- Per i 92 asset: verifica le maschere, differenze pixel fuori maschera, sagome giorno/notte/danno, crop, dimensioni, continuità frame, leggibilità a scala telefono e fallback.
- Aggiorna il registro JSON e i report solo con evidenze, senza falsi PASS. Controlla concorrenza Git e non fare force push né modificare main di nascosto.
- Esporta immagini e documentazione in un pacchetto consultabile; carica su GitHub quando i permessi e le dimensioni lo consentono. Se il caricamento binario fallisce, descrivi il motivo e non dire che è stato eseguito.
- **COMMERCIAL_RELEASE = BLOCKED** finché diritti, ascolto umano, playtest Android fisico e autorizzazione dell'autore non sono verificati. Nessun AAB commerciale e nessuna pubblicazione.

### Report di ogni batch
1. Branch e commit SHA effettivo.
2. File creati e relativi link; totale cumulativo **92 immediati** e **310 schede preproduzione** tenuti separati.
3. Risultati reali di hash, decodifica, dimensioni e verifiche.
4. Problemi, file non conformi e fallback mantenuti.
5. Prossimo batch eseguibile senza nuove domande non essenziali.
6. Stato di release sempre BLOCKED salvo autorizzazioni e gate verificati.

Ora leggi le fonti nel repository e inizia da un audit incrementale, poi produci il primo batch di auto, completando successivamente tutti i gruppi. Non aspettare ulteriori scene giocabili per realizzare le 310 tavole di concept. Il successo è il materiale effettivamente prodotto e verificato, non un nuovo piano che ripete quello esistente.
