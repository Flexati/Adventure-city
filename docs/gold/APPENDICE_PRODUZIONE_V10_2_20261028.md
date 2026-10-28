# CHRONOS Adventure: Nox & Lulù — Registro appendici V10.2

Data: 2026-10-28. Mandato esplicito dell'autore: **generare le tavole di preproduzione anche quando una regione, un boss o una scena non è ancora giocabile**. Non fermare l'arte per l'assenza del runtime. Separare la preproduzione da un asset pronto alla release.

## Elaborati pubblicati

| Gruppo | Contenuti canonici | Schede nuove definite | Documento |
| --- | ---: | ---: | --- |
| Regioni/città e quartieri | 9 | 36 | [Appendice A](APPENDICE_REGIONI_CITTA_V10_2_20261028.md) |
| Personaggi/NPC | 26 | 78 | [Appendice B](APPENDICE_NPC_PERSONAGGI_V10_2_20261028.md) |
| Nemici e varianti élite | 16 | 48 | [Appendice C](APPENDICE_NEMICI_VARIANTI_V10_2_20261028.md) |
| Boss e stati/telegraph | 17 | 68 | [Appendice D](APPENDICE_BOSS_VARIANTI_V10_2_20261028.md) |
| Abilità e mosse | 20 | 80 | [Appendice E](APPENDICE_ABILITA_MOSSE_V10_2_20261028.md) |
| **Totale** | **88** | **310** | [Manifest JSON](VARIANTI_PREPRODUZIONE_V10_2_20261028.json) |

Queste sono **310 richieste di tavole visive**, non 310 file già generati. Alcune tavole richiedono più export (pose, giorno/notte, VFX) e non vanno sommate meccanicamente alle **442 famiglie** / **141 contenuti** del censimento esistente. Le 442 famiglie rimangono la fonte di requisiti globale: [Asset necessari](ASSET_NECESSARI.md).

## Consegne già esistenti e lavoro corrente

- Le 92 immagini del mandato immediato restano richieste: 64 celle di H-17/ARC-7, 15 props gara e 12 stati auto + una feature store. Non sono sostituite dalle 310 tavole.
- La branch `delivery/terra-giro2-armi-20261027` risultava avere 32/64 celle: i due sheet Nox, non ancora Lulù. Ricontrollare prima di lavorare.
- La branch `delivery/terra-giro3-gara-20261028` ha 34 disegni procedurali e 11 OGG, con controlli tecnici dichiarati nei suoi report e lacune di revisione artistica/ascolto. I 15 props dipinti richiesti sono un lavoro diverso.
- Prima di creare un file controllare il ramo di consegna, perché il repository può avanzare.

## Ordine consigliato di produzione

1. Chiudere le auto rivali base e gli stati derivati, incluse le varianti notturne: stesso asset madre, sagoma e orientamento. Tenere distinta `store_feature.png`.
2. Produrre le 32 celle mancanti delle armi Lulù nel rispetto delle maschere; controllare i 32 già consegnati da Nox.
3. Produrre i 15 elementi dipinti della gara, mantenendo i disegni procedurali esistenti come fallback.
4. In parallelo alle verifiche runtime, **generare anche tutte le 310 tavole future** per città, NPC, nemici, boss e mosse, nel percorso `assets/preproduction/v10.2/variants/`. L'ordine del catalogo è deterministico; non saltare le regioni per assenza di codice.
5. Quando un contenuto diventa giocabile, creare una *copia candidata* nella pipeline runtime senza sostituire l'originale prima dei gate.

## Stati rigorosi

`SPECIFIED_NOT_GENERATED` → `GENERATED_UNVERIFIED` → `TECHNICALLY_VERIFIED` → `RUNTIME_CANDIDATE` → `INTEGRATED_VERIFIED` → `HUMAN_REVIEWED` → `COMMERCIAL_READY`.

Solo i passaggi supportati da file, hash, log e prove sono assegnabili. `CONCEPT_ONLY` indica **prodotto ma ancora non candidabile a integrazione**, non un blocco alla produzione.

Per tutti i file reali: strumento/versione, prompt o sorgente, data, diritti commerciali con prova, byte, SHA-256 del file (non Git blob), misura, bounding box, trasparenza e collegamento ai test. Metadati mancanti = non commercial ready.

Nox maschile, Lulù femminile. Sprite principali V8 immutabili fuori maschera. Proposte esplicitamente non adottate (Neris, Ivo, L-6) possono avere concept di archivio ma **non** implementazione implicita. Marchi e scritte originali. No modifiche a hitbox, tempi, narrativa canonica, spawn o salvataggi per ospitare l'arte. `COMMERCIAL_RELEASE = BLOCKED`.

## Avvio Opus

[Prompt operativo completo](PROMPT_OPUS_VARIANTI_V10_2_20261028.md).
