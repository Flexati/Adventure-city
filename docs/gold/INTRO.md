# Intro JaguarzCreatorz — integrazione

Entrambi i file forniti dall'autore sono copiati senza ricodifica in `game/video/`: 720×1280 (1.405.222 byte, 6,014 s) e 1080×1920 (4.195.774 byte, 6 s), MP4 H.264/AAC. Hash e provenienza sono in `ASSET_REGISTER.json`. Classificazione: REUSE. Il browser usa 720 su mobile e 1080 da 900 px di larghezza; mantiene il fotogramma intero anche in orizzontale.

Il video si riproduce una volta per sessione, prima del menu, inizialmente muto per consentire autoplay. Il pulsante audio richiede un gesto e rispetta l'opzione audio disabilitata. Salta, fine naturale, perdita di focus e cambio visibilità fermano e rilasciano il decoder. Il fallback massimo è 8,5 secondi; errore di rete/decoder e riduzione del movimento mostrano il marchio statico esistente. Nessuna modifica ai personaggi o ai salvataggi.

Prove: decodifica completa di entrambi i file con FFmpeg, browser Chromium con variante mobile/desktop, audio su pressione, fine naturale, salto, errore file, riduzione movimento e reload senza replica. Rapporto `docs/evidence/v10.2/studio-report.json`, immagini `studio-portrait.png` e `studio-desktop.png`. La suite 146/146 verifica anche packager Android e allowlist: MP4 copiati localmente e serviti come `video/mp4`. Questo dimostra la confezione delle risorse, non la riproduzione WebView.

COMMERCIAL_READY resta falso: diritti commerciali di immagini e audio da attestare, revisione audiovisiva umana e riproduzione su Android fisico da effettuare. L'ispezione di un fotogramma e la decodifica tecnica non equivalgono a tali prove.
