# IT/EN — implementazione e limiti

La lingua si seleziona nelle opzioni del menu o in pausa e viene conservata in `city-v4-settings`, separatamente dal salvataggio della campagna. Il cambio non riscrive ID, premi, scelte o inventario. La sorgente italiana resta nei moduli narrativi; `story-en.mjs` e `world-en.mjs` associano traduzioni inglesi ai testi originali. `locale.mjs` gestisce anche testi statici, quantità e composizioni dell'interfaccia, conservando la sorgente per tornare all'italiano.

Il catalogo corrente copre 370 testi unici censiti in scene, battute durante l'azione, scelte, definizioni di missione, hub e oggetti. `LOCALE_REGISTER.json` conserva origini, traduzioni e hash. Zero lacune in questo insieme non equivale a zero lacune nell'intero gioco: stringhe costruite nel runtime, guida, tutorial, errori, negozi e varianti vanno anche attraversati e ispezionati.

## Coerenza narrativa

Le traduzioni conservano i diciannove civili, l'uso della firma senza consenso, il rifiuto di Nox, la separazione, il canale spento da Lulù, il ricongiungimento prima di Archon, il perdono facoltativo e il ruolo di Lia come memoria. Non introducono trasferimenti di conoscenza o nuove scelte. Le risposte inglesi usano gli stessi ID e payload italiani. Le prove automatiche controllano copertura e immutabilità; non sono una revisione linguistica con persone.

## Direzione artistica

La UI riusa componenti, icone, sprite sheet e musica già integrati: tradurre un'etichetta non richiede ridisegnare Nox/Lulù o produrre un brano ridondante. Scelta del gesso e negozio inglese sono documentati con screenshot a 390×844; il menu/opzioni è ricontrollato in sei formati. Safe area, occlusione delle dita e lettura umana su Android rimangono da approvare.

## Prove

- `npm test`: copertura dei testi censiti, quantità, fatti narrativi e conservazione dei payload.
- `verify_locale_browser.cjs`: menu EN, dialogo e scelta del gesso, cambio IT/EN in pausa, reload senza ripetere la scelta e conservazione di lingua, narrativa e mondo.
- `verify_locale_hub_browser.cjs`: bacheca inglese, accettazione dell'incarico, percorso a piedi fino al fabbro, acquisto touch al prezzo originale e persistenza dopo reload.
- `verify_hubs_v8.cjs`: regressione italiana di acquisti, recupero, lifecycle, viaggi e conservazione dei dati precedenti. Le fixture correnti registrano il gesso già completato quando il gesso precede la tappa corrente; le prove di migrazione storica usano fixture separate.
- `verify_brand_browser.cjs`: sei viewport, opzioni e ripresa del checkpoint.

Gli script vengono inclusi nel bundle classico Android senza dipendenze di rete. La compilazione del pacchetto JS e l'allowlist sono prove tecniche; non attestano il comportamento su un dispositivo fisico.

E10 resta PARTIAL: mancano revisione delle stringhe dinamiche complete, tutti i contenuti target ancora da implementare, accettazione umana IT/EN, dispositivi e migrazione richiesta per la candidata finale. Nessuna approvazione commerciale viene attribuita a questa traduzione.
