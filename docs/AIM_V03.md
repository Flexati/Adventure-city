# Mira mobile 0.3

Ricerca: le guide ufficiali Activision distinguono controlli semplici/avanzati, assistenza alla mira e personalizzazione; Supercell documenta controlli personalizzabili e correttezza della portata del tiro automatico.
- https://blog.activision.com/es/call-of-duty/2019-10/Getting-a-Grip-on-the-Call-of-Duty-Mobile-Controls
- https://supercell.com/en/games/brawlstars/blog/release-notes/optional-update-customizable-controls/

Scelte progettuali nostre, non parametri dichiarati da questi giochi: tocco/rilascio spara assistito; trascinamento oltre 12 CSS px mira manualmente, rilascio spara; cattura del puntatore e annullamento su interruzione; movimento indipendente. Bersaglio mantenuto finché la distanza resta entro 1.25 volte quella del più vicino; esclusione morti, fuori portata e dietro muri. Nessuna correzione segreta della direzione manuale. Raggio dei colpi diretti ristretto da circa 32 a circa 6 gradi, magia ad area invariata. Linea di anteprima e raggi si fermano ai muri; danni verificano visibilità.

17 test della logica; firma APK verificata. Nessuna verifica del gesto su dispositivo fisico in questa sessione. Da calibrare col test utente: soglia trascinamento, dimensioni pulsanti e tolleranza colpi. Sprite ancora laterali, non otto direzioni. Riferimenti JPG del 17 ottobre esaminati, non integrati né modificati.
