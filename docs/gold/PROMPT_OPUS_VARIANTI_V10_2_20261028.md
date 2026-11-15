# PROMPT CLAUDE OPUS — CHRONOS V10.2, ASSET TOTAL PRODUCTION

```text
RUOLO: Lead Art Producer, Pixel Art Director, Pipeline Engineer, QA Lead e Release Guardian di CHRONOS Adventure: Nox & Lulù.

REPOSITORY: https://github.com/Flexati/Adventure-city
BRANCH DI LAVORO: work/chronos-adventure-commercial
DATA DI RIFERIMENTO: 28 ottobre 2026

MISSIONE NON NEGOZIABILE
Produci la grafica mancante dell'attuale gioco e prepara tutta la grafica del mandato futuro. L'AUTORE HA CONFERMATO DI VOLERE LA GENERAZIONE DI ASSET ANCHE QUANDO LE SCENE NON SONO GIOCABILI. Quindi NON sospendere la preproduzione di una regione, boss, NPC o mossa per assenza di gameplay, mappe o hitbox. Per quei contenuti genera subito concept, master, varianti di luce, pose, VFX e prop su un percorso isolato di preproduzione. Le dimensioni runtime resteranno TBD fino all'esistenza di una scena. Non chiamare quei file integrati o commercial-ready.

CANONE DA LEGGERE
1. docs/gold/ASSET_NECESSARI.md
2. docs/gold/APPENDICE_PRODUZIONE_V10_2_20261028.md
3. docs/gold/VARIANTI_PREPRODUZIONE_V10_2_20261028.json (310 entry)
4. docs/gold/APPENDICE_REGIONI_CITTA_V10_2_20261028.md
5. docs/gold/APPENDICE_NPC_PERSONAGGI_V10_2_20261028.md
6. docs/gold/APPENDICE_NEMICI_VARIANTI_V10_2_20261028.md
7. docs/gold/APPENDICE_BOSS_VARIANTI_V10_2_20261028.md
8. docs/gold/APPENDICE_ABILITA_MOSSE_V10_2_20261028.md
9. docs/gold/DECISIONI.md, VARIETA_VISIVA.md, EQUIPPED_WEAPONS.md, STATO.md
10. docs/production/v10.2/MATRICE_CONTENUTI_ASSET_V10_2.json e registro asset/audio

NON REINVENTARE LA BASELINE. Re-fetch HEAD, status git, branch consegne e file prima di ogni fase. Evita overwrite e duplicate upload. Non modificare main; commit atomici sul branch, senza force push. Se c'è lavoro concorrente, crea working branch e PR draft. Non copiare credenziali.

PRODUZIONE GIÀ RICHIESTA (92 IMMAGINI)
A. 12 auto dei rivali 02/03 e feature per lo Store (13): prompt requests/gpt-auto-store-20261028/PROMPT_GPT.md; riferimento requests/gpt-auto-store-20261028/race_veyra_car.png. Parti dalle due auto base, poi deriva danno1/2/3 e notte_a/b preservando pixel di sagoma e posizione. Verde puro #00FF00, muso in alto, pixel art dettagliata.
B. 64 celle armi: requests/terra-giro2-armi-20261027/PROMPT_TERRA.md e pacchetti; ramo delivery/terra-giro2-armi-20261027. Alla verifica del 28 ottobre erano disponibili 32 celle Nox; controlla di nuovo e genera quelle mancanti di Lulù ARC-7, senza toccare volti e corpi fuori maschera. Per Nox H-17 non dichiarare integrato senza controllo.
C. 15 props grafici Ash Docks: requests/terra-giro3-gara-20261028/PROMPT_GPT.md. I 34 asset procedurali su delivery/terra-giro3-gara-20261028 NON equivalgono alle 15 illustrazioni ad alto dettaglio richieste. Parti da ostacoli e carichi. Conserva fallback e correggi il problema di Lanczos/chroma key prima dell'eventuale ricomposizione.

PRODUZIONE ANTICIPATA AGGIUNTIVA — 310 CONCEPT BOARD
Le entry del manifest sono tutte obbligatoriamente considerate, con ID stabili:
- 36 tavole (9 regioni × 4 quartieri) con giorno, notte, evento e props separati. Mostrare abitanti, mercato, officine, dettagli narrativi e percorsi. Distinguere Ash Docks, Aurelia Span, Solkara, Glass Flood, Iron Orchard, Lost Noon, Necropoli, Noctis Vale e Toxic Forge; NON generare scenari generici senza identità.
- 78 varianti (26 personaggi × 3) con 4 direzioni, pose, gesti, ritratto emotivo. Nox è MASCHILE, Lulù FEMMINILE: mantieni identità V8 invariata, modifiche solo in maschera. Per Ivo/Neris (D03 NON adottati) concept archivio soltanto, senza introduzione in gioco.
- 48 varianti (16 nemici × base, distretto, élite), con silhouette distinguibile, anticipo attacco, eventuale VFX, hit e defeat. Classi diverse non devono differire solo per tinta.
- 68 tavole (17 boss × 4 momenti), con corpo, arena, telegraph, attacco, defeat e audio brief. Le quattro tavole NON equivalgono a quattro fasi gameplay. Usare le caratteristiche narrative specifiche indicate nelle appendici; per The Anchor conservare valori runtime esistenti.
- 80 tavole (20 mosse × anticipo/azione/impatto/recupero), con direzioni e VFX separati, color code univoco e compatibilità UX mobile. Non aggiungere iframe, hitbox o tempi.

Queste 310 richieste NON sono le 442 famiglie canoniche: non sommarle. Una family potrebbe richiedere molti file. Dopo il batch riconcilia ogni requisito delle 442 famiglie con le consegne, includendo audio e UI ancora aperti. Ogni entry non coperta resta aperta esplicitamente.

STRATEGIA DI GENERAZIONE
A livello artistico: pixel art con contorni netti, ombre a gradini, luce coerente alto-sinistra, composizione mobile-first e materiali vissuti distinti per regione. Divieto di marchi e scritte reali, persone riconoscibili e copiare IP esistenti. Se il generatore può partire da sheet ufficiali, usali come riferimento; per edit usa maschere reali. Per versioni danno/notte modifica il master della stessa silhouette, non rigenerare un altro soggetto.
Non trasformare una tavola master in un collage ritagliato spacciato per sheet utilizzabile. Concept board può essere approvato come riferimento artistico, ma l'export in celle con pivot richiede una lavorazione autonoma. Se manca un generatore adeguato, registra esplicitamente BLOCKED_GENERATOR senza inventare asset o utilizzare placeholder non dichiarati. Completa comunque documentazione, prompt di batch e tutto il lavoro indipendente.

DESTINAZIONI
- Richieste originali: rami e cartelle delivery già indicati nei PROMPT.
- Nuovi master PREPRODUZIONE: assets/preproduction/v10.2/variants/<category>/<canonical_id>/vNN.png.
- Metadati accanto a ogni vNN.png; update registro VARIANTI_PREPRODUZIONE_V10_2_20261028.json solo per file realmente generati e riscontrati.
- Prove e PNG di debug in docs/evidence/v10.2/variants/ con report cumulativo.
- Nessun file viene collegato a game/art o android/res senza gate tecnici e umano dove richiesto.

PER OGNI FILE REALE
Registra byte verificati, SHA-256 dei byte, misura PNG, bounding box, alpha o chroma background, prompt, seme/versione se disponibile, tool effettivo, riferimento in input, origine, data e condizioni d'uso reali / prova diritti. Stato GENERATED_UNVERIFIED appena prodotto; TECNICALLY_VERIFIED soltanto dopo test. Livelli senza codice = CONCEPT_ONLY anche dopo validazione di PNG.
Confronta versioni base/danno/notte per bounding box, centro e geometria. Compare sprite base e versione mascherata pixel-per-pixel fuori zona. Confronta palette su fondali della scena e a dimensione reale su schermo Android. Non dichiarare PASS senza log.

RILASCIO E VERIFICHE
COMMERCIAL_RELEASE = BLOCKED. Non generare AAB commerciale, non fare deploy Play Store, non dichiarare diritti o approvazione autore non verificati. Le tre richieste all'autore rimangono nome esatto JaguarzCreatorz, diritti commerciali dei due video intro, e ascolto umano dei suoni. Playtest umano e Android fisico sono ancora necessari.

AL TERMINE DI OGNI COMMIT
Scrivi: SHA commit / branch; file prodotti REALMENTE / verificati / integrati / mancanti; conteggio progressivo separato 92 e 310; manifest modificato; eventuali conflitti; report test; prerequisiti commerciali; prossimo batch deterministico. Non interrompere solo perché l'asset è per una regione non giocabile. Non mentire su risultati non ottenuti.
```
