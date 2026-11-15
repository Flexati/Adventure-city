# Chronos Adventure: Nox & Lulú

Nome pubblico richiesto: **Chronos Adventure: Nox & Lulú**. Il logo separa
CHRONOS, ADVENTURE e NOX & LULÚ in tre livelli leggibili. La grafia con accento
acuto appartiene al marchio; la grafia Lulù dei dialoghi e del canone storico
rimane invariata. Vanta è la città, Chrono Shadows il seguito.

## Direzione visiva

Il riferimento fotografico dell'utente (12217.jpg) è uno spunto, non una tavola
da copiare: orologio, portale, palette ciano/viola. L'adattamento elimina il
collage di risorse, le spade incrociate e la promessa di un RPG a turni.
Il gioco resta un action-adventure narrativo. Orologio spezzato, frammento di
vetro e città verticale collegano la nuova copertina al canone.

- Fondo: blu notte; accenti ciano Nox e rosa Lulú, portale viola.
- Titolo: testo HTML selezionabile dalle tecnologie assistive, non scritta
  incorporata nell'immagine. Serif per CHRONOS, sans per i sottotitoli e UI.
- Illustrazione locale: `game/art/brand/vanta-clock.webp`, 1536×1024.
- Menu: composizione verticale su telefono, titolo a sinistra in orizzontale.
- Azioni principali: almeno 48 px, focus visibile, supporto reduced-motion.
- Icona: orologio spezzato e vetro già presenti, coerenti con la nuova palette.

L'illustrazione è stata generata con ImageGen usando il riferimento allegato
come ispirazione. Il master PNG è conservato nell'ambiente in
`/workspace/generated_images/exec-2ff78726-0ade-470a-8b57-86f6cc1f810a.png`.
Il WebP è una conversione qualità 88, senza ulteriori ritocchi.
L'approvazione editoriale/commerciale definitiva resta da svolgere.

## Compatibilità e distribuzione

Titolo aggiornato nel browser, menu, pausa, crediti, scheda finale, nome Android,
caricamento nativo ed errori. APK debug:
`dist/Chronos_Adventure_Nox_Lulu_debug.apk`.
Anteprima portatile: `dist/Chronos_Adventure_Preview/`.

Le chiavi dei salvataggi, i namespace Android e l'API diagnostica conservano i
nomi precedenti: nessuna migrazione o perdita volontaria dei progressi v7.
Versione baseline: `0.10.0-v8.0-rc.2`, Android versionCode 13.
Le evidenze storiche conservano nomi e hash originali.

## Verifica riproducibile

```sh
npm ci
npm test
python3 tools/build_preview.py
python3 -m http.server 8090 --bind 127.0.0.1
# In un altro terminale:
CHROMIUM=/usr/bin/chromium node tools/verify_brand_browser.cjs
CHROMIUM=/usr/bin/chromium node tools/verify_brand_browser.cjs \
  http://127.0.0.1:8090/dist/Chronos_Adventure_Preview/ artifacts/chronos-adventure/brand-bundle
```

Il test esercita titolo, decodifica dell'illustrazione, impostazioni, avvio touch,
ricaricamento e Continua su sei risoluzioni. Non certifica un telefono Android
reale né il valore commerciale del gioco. Stato di rilascio: **BLOCKED**.
