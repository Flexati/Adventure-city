# Direzione e stato 0.4

## Identità
Due protagonisti di strada diventano difensori della loro città. La scala cresce attraverso eventi collegati: un blackout artificiale attiva un segnale alieno; la breccia diffonde spore; il contagio rivela la frattura sottostante. Il quartiere è un luogo da proteggere, non una decorazione comica.

## Architettura
`campaign.mjs` contiene dati, collisioni, mira, combattimento, obiettivi, checkpoint e progressione, senza DOM. `runtime.mjs` gestisce input, rendering, audio e interfaccia. L’APK usa lo stesso bundle offline, senza SDK pubblicitari, account, telemetria o dipendenze di rete. Le vecchie versioni rimangono nel repository come storia del prototipo, ma non sono incluse nel bundle attivo.

## Progressione
Quattro livelli, armi con danno 1/2/3/4 e velocità crescente. Il primo insegna sparo e schivata; dal secondo si sblocca la magia. Nox colpisce lungo un raggio; Lulù controlla un cono. Dopo ogni quartiere si sceglie ricarica magica 3.5 secondi o salute 10 anziché 8. Nessun vantaggio a pagamento.

## Effetti e leggibilità
Scintille direzionali, traccia luminosa, impatto numerico, dissoluzione del nemico, onda magica e anello Duo. Massimo 180 scintille simultanee. Risoluzione canvas limitata a DPR 1.75. Nessuna creazione DOM per particella. Le zone nemiche sono segnate prima del colpo. La pausa e il segnale Android fermano input, simulazione e audio. L’opzione riduzione scosse elimina lo scuotimento, non le animazioni informative.

## Stato reale
Campagna di prototipo completabile in test di logica. Verifica browser locale riuscita su due formati con screenshot reali. Non sono stati misurati FPS, consumo batteria, memoria o crash su telefono. Nessuna promessa di successo, viralità o idoneità produttiva: questi richiedono playtest, profiling e ulteriore lavoro.

## Prossimi gate di produzione
- Animazioni complete in quattro/otto direzioni, allineamento degli appoggi e continuità tra idle, camminata e attacco.
- Missioni con regole distinte: difesa temporizzata, evacuazione di NPC e sigilli con rischi ambientali; il prototipo corrente condivide l’obiettivo base.
- Geometrie di quartiere più varie, collisioni precise per prop, camera e leggibilità su più telefoni.
- Profiling su dispositivo medio e debole, memoria texture e audio, latenza touch, pausa/ripresa e installazione aggiornamento.
- Test di comprensione, difficoltà e desiderio di rigiocare prima di scegliere un modello commerciale.
