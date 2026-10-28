# Prompt per Claude Opus — coordinamento asset CHRONOS (28 ottobre 2026)

```text
Riprendi CHRONOS Adventure: Nox & Lulù nel repository https://github.com/Flexati/Adventure-city, ramo work/chronos-adventure-commercial. Leggi prima le istruzioni del repository, lo stato corrente e docs/gold/ASSET_NECESSARI.md. Lavora sulla versione corrente senza sovrascrivere lavoro concorrente. Non ripartire da zero.

MANDATO E FONTI
Il documento ASSET_NECESSARI.md contiene quattro parti:
1. 92 immagini richieste: 64 celle armi + 15 oggetti gara + 12 stati auto rivali + 1 immagine promozionale.
2. Tre punti riservati all'autore: nome studio, diritti dell'intro, ascolto umano dei suoni.
3. Quattro lavori del team: intro orizzontale, varianti élite, screenshot, ricomposizione/integrazione gara.
4. Censimento V10.2: 442 famiglie per 141 contenuti. Non sono 442 immagini già pronte né contenuti tutti giocabili.
Fonte del censimento: assets/production/v10.2/handoff/PRODUCTION_COVERAGE.csv.
Non sommare automaticamente le 92 immagini alle 442 famiglie: sono unità diverse da riconciliare.

PROMPT DI PRODUZIONE
- Armi: requests/terra-giro2-armi-20261027/PROMPT_TERRA.md.
  Input: requests/terra-giro2-armi-20261027/pacchetti/.
  Riferimenti: ramo delivery/terra-giro1-20261027, deliveries/terra-giro1-20261027/master/.
  Output previsto: ramo delivery/terra-giro2-armi-20261027, deliveries/terra-giro2-armi-20261027/<sheet>/.
- Gara, rifacimento illustrato: requests/terra-giro3-gara-20261028/PROMPT_GPT.md.
  Originale: ramo delivery/terra-giro3-gara-20261028, deliveries/terra-giro3-gara-20261028/PROMPT_GPT.md.
  Non confondere questo prompt con il precedente PROMPT_TERRA.md del pacchetto gara.
- Auto e store: requests/gpt-auto-store-20261028/PROMPT_GPT.md.
  Riferimento già disponibile: requests/gpt-auto-store-20261028/race_veyra_car.png.
Questi sono prompt e materiali; verifica separatamente se i risultati sono effettivamente arrivati.

VINCOLI
Nox è maschile. Lulù è la protagonista femminile. Gli sheet V8 e l'identità dei personaggi vanno preservati. Modifica le armi solo nelle maschere autorizzate; conserva il resto dei pixel originali nella composizione finale.
Non cambiare hitbox, tempi, meccaniche o telegraph per adattarli alla grafica.
Danni e notte derivano dalla base, con stessa sagoma, scala e posizione, secondo i prompt.
Marchi e scritte inventati. Nessuna credenziale nei file.
Per ogni asset registra strumento effettivamente usato, origine, data e condizioni d'uso reali con relativa evidenza. Non assegnare licenze presunte; diritti non documentati restano irrisolti.
COMMERCIAL_RELEASE resta BLOCKED. Non pubblicare sullo store, non autorizzare rilascio commerciale e non dichiarare ascolto, approvazione autore, prova Android o playtest umano al posto di una persona.

LAVORO DA ESEGUIRE
1. Controlla i rami di consegna e ricostruisci un elenco per file: atteso, presente, mancante, scartato o integrato, con commit e percorso di origine. Non considerare presente un'immagine perché esiste il suo prompt.
2. Prima di qualsiasi ingresso nel gioco verifica i byte reali, decodifica/formato, dimensioni e SHA-256. Controlla fondo, margini, proporzioni, orientamento, maschere, sagome tra stati e resa alle dimensioni del gioco. Il Git blob SHA non sostituisce lo SHA-256 del file.
3. Esamina tools/compose_terra_race_props.py e correggi l'alterazione dei colori segnalata in ASSET_NECESSARI.md, se ancora presente. Usa prove pertinenti che dimostrino la conservazione dei colori e dei pixel fuori maschera; registra controlli realmente eseguiti.
4. Integra solo candidati idonei e documentati. Se mancano celle o immagini conserva i fallback esistenti e annota i mancanti. Per le armi ricomponi i quattro sheet destinazione nox_h17_gun, nox_h17_reload, lulu_arc7_gun, lulu_arc7_reload. Per le auto usa il riferimento Veyra e le istruzioni del relativo prompt.
5. Procedi con i quattro lavori della parte 3 nella misura consentita dai file e dalle evidenze disponibili. Intro: preserva logo, fulmini e audio, senza presumere diritti confermati. Screenshot solo dal gioco realmente eseguito. Varianti élite con sagoma identica pixel per pixel.
6. Riconcilia il censimento con le integrazioni successive già elencate nel documento. I numeri 28 candidati e 414 senza file descrivono il censimento V10.2: non presentarli come stato attuale senza verifica. Pianifica le regioni future una alla volta; non inventare misure per scene inesistenti.
7. Aggiorna stato, provenienza e manifest con byte, SHA-256, misure e riferimenti alle prove. Distingui prodotto, verificato tecnicamente, integrato e approvato da persona.
8. Esegui i controlli previsti dal repository per le modifiche effettive, controlla diff e regressioni, poi salva commit sul ramo di lavoro. Non dichiarare PASS o test non svolti.

CONSEGNA
Fornisci commit e ramo, file cambiati, immagini ricevute/integrate/mancanti, controlli con risultati reali, blocchi residui e le tre richieste all'autore ancora aperte. Se manca un prerequisito, documentalo e prosegui con il lavoro indipendente. Nessuna pubblicazione commerciale.
```
