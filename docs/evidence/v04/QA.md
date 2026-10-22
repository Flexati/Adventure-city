# Verifica prototipo 0.4

- 23 test Node superati: 6 relativi alla campagna attiva, 17 regressioni delle versioni precedenti.
- Le quattro missioni vengono completate tramite sparo e attivazione dei dispositivi nel test di logica. Verificati sblocco magia, ricarica, passaggio quartiere, checkpoint, collisioni, dispositivi contesi e sconfitta.
- Chromium headless locale: caricamento, menu, selezione partita, dialoghi, camminata, sparo, pausa/ripresa. Nessun errore JavaScript osservato.
- Formati 844×390 e 390×844: controlli dentro il viewport, nessun overflow orizzontale.
- Trascinamento simulato sul pulsante: direzione manuale rispettata. Questo test usa eventi del browser, non un dito su un telefono fisico.
- Tutti i capitoli caricati dal checkpoint e catturati con i rispettivi fondali/nemici, magia disponibile solo dal secondo.
- Screenshot esaminati: menu, verticale, quattro capitoli ed effetti. Nessuna certificazione estetica finale.
- APK debug versionCode 4, firma v2/v3 verificata, zipalign verificato, CRC archivio valido e HTML incorporato identico al bundle testato.
- SHA256 APK: e110309202d0602aad1070600f160adf7039c032199968c0a6ce9749c7ea16e9.
- Dimensione APK: 21738028 byte.

Da verificare su Android reale: installazione aggiornamento, cold start, latenza touch, audio dopo background, frame rate, memoria e autonomia. Gli sprite di attacco sono laterali, quindi la posa non copre ancora tutte le direzioni di tiro. Il disegno dell’arma è condiviso tra i livelli mentre le statistiche crescono. Le missioni hanno un obiettivo base comune e richiedono ulteriore differenziazione prima della produzione.
