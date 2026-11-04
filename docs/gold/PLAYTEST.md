# CHRONOS Gold — durata e playtest

Obiettivo: mediana circa 120 minuti attivi per la prima campagna completa. La fascia 100–140 minuti serve alla diagnosi del ritmo. Tempo attivo include lettura e retry, esclude pause e inattività prolungata.

**Sessioni umane registrate: 0.** Non sono disponibili partecipanti, misure di durata, osservazioni sui tocchi o prove di comprensione da attribuire a persone. Gli attraversamenti automatizzati [A](../evidence/v10.2/campaign-a-report.json) e [B](../evidence/v10.2/campaign-b-report.json) dimostrano raggiungibilità delle rotte sulla sorgente precedente alla migrazione; il clock accelerato non misura minuti umani. Le due [continuazioni browser v7](../evidence/v10.2/chalk-migration-report.json) verificano il ripristino di checkpoint, non la durata.

Per ogni futuro playtest annotare build/hash, persona nuova identificata con codice anonimo, rotta, tempi attivi per tappa, pause escluse, retry, difficoltà, incomprensioni, tocchi errati, difetti e variazioni dopo la correzione. Non stimare una mediana finché non esistono sessioni reali.

## Rook — QA automatica, 2026-10-26

Nessun partecipante umano. Fixture Blackout corrente seguita da input ordinari nel browser con clock accelerato; reload boss, combattimento, seconda fase, scelta Rifugio e reload della scelta. Zero retry automatici nel ricontrollo finale; due in una prova precedente. Non si deduce un miglioramento umano da queste differenze. `docs/evidence/v10.2/rook-report.json` e screenshot conservano i risultati. Questi tempi non misurano la durata umana o la mediana di due ore. Occorre ancora verificare con persone nuove lettura della mira, disarmo mine, uso effettivo delle coperture e motivi di sconfitta.

## Kit/Tessa e recupero — QA automatica successiva

Zero partecipanti umani e zero nuovi dispositivi fisici. A/B/C completi nel browser, 31 tappe/otto incarichi/due preparazioni ciascuno; clock accelerato, nessuna mediana umana di due ore deducibile. Fixture dichiarate verificano entrambe le consegne, touch, munizioni/ricarica e persistenza, oltre al recupero dei boss/hub e Gesso. Dodici combinazioni protagonista/viewport controllano geometria e testi. I rapporti correnti sono indicizzati in `FIELD_KIT.md`. Comprensione, difficoltà, gusto artistico, ascolto e durata restano da misurare con persone nuove.

## V10.3 — stima della durata (ESTIMATE_NOT_HUMAN), 31 ottobre 2026

**Sessioni umane: ancora 0.** Questa sezione contiene solo una **stima** ricavata da un modello. Non sostituisce le misure su persone.

**Metodo.** I giri automatici completi A/B/C girano con orologio virtuale. `tools/verify_campaign_browser.cjs` attribuisce ogni passo da 130 ms a una sola attività e registra le parole effettivamente lette. Il modello di `tools/estimate_playtime.mjs`:
- fattore 1,6 per il combattimento e 1,3 per navigazione e gare;
- lettura a 180 parole al minuto, più 1,2 s per ogni avanzamento;
- +25% sui boss;
- minimo e alto dichiarati.

**Risultato:**
- campagna obbligatoria: rotta A probabile 42 min (30–58), rotta B probabile 45 min (32–63), rotta C probabile 38 min (27–53);
- facoltativi, mai sommati: circa 13 min;
- obiettivo: 105 min. **La stima dice che oggi non è raggiunto.**

**Rapporti:** [`PLAYTIME_ESTIMATE.md`](../evidence/v10.2/playtime/PLAYTIME_ESTIMATE.md). Proposte: [`PLAYTIME_EXPANSION_PROPOSAL_V10_3.md`](PLAYTIME_EXPANSION_PROPOSAL_V10_3.md). Protocollo umano: [`PLAYER_MOTIVATION_V10_3.md`](PLAYER_MOTIVATION_V10_3.md).

## M2 — da provare sul telefono e con persone

Nessuna persona ha ancora provato M2: le prove di M2 sono automatiche o nel browser del PC. Lo stato di M2 è in [STATO.md](STATO.md). M1 è rimandata a fine lavoro (D33): queste prove si fanno lì, su un telefono Android vero e, per il gamepad, con un controller vero.

- **Latenza di C1.** SCHIVA, DUO e ATTIVA partono al tocco: il giocatore sente la risposta immediata? Un tocco su DUO in ricarica, rilasciato dopo la fine della ricarica, ora va perso: va bene così?
- **Sensazione del buffer di N1.** Un tocco poco prima della fine di una ricarica parte da solo appena si può: aiuta o sorprende? Nel rallentamento della Perfect Dodge e nel tutorial la memoria dura di più in tempo reale.
- **Leggibilità del fermo di G1.** Il fermo di 2, 4 o 6 frame si nota sul telefono? Si legge anche con «movimento ridotto», senza lampo?
- **Chrono Shift.** Si capisce quando parte e quando finisce? I nemici più lenti aiutano senza confondere?
- **Tocco breve su Start in pausa** con un controller vero: il gioco riprende?
- **Rilascio di B dopo lo scatto** con un controller vero: il rilascio viene letto?

La stima della durata del 31 ottobre (sezione sopra) è precedente a N1 e CS e non è stata rifatta.

## Q1 — stabilità, QA automatica (4 novembre 2026)

Nessuna persona ha provato Q1: zero sessioni umane, zero dispositivi fisici. Le misure sono **automatiche, in Chromium su questo PC** (Celeron N3060, non un telefono): `qa:stability` (S1–S7, S5b, M-S1) con 25 esecuzioni dopo le correzioni. I numeri prima → dopo, il costo del salvataggio, i conteggi dei test e le scelte da far vedere all'autore sono in [STATO.md](STATO.md), sezione «Q1». Nessuno di questi numeri misura la durata o la mediana di due ore.

`qa:performance` non certifica il frame rate: si ferma con «insufficient live frames» in un passo con `cpu4` (il punto varia da giro a giro), anche sul codice di prima di Q1. Il giro di chiusura del 4 novembre è stato eseguito: `npm test` 296/294 (solo i 2 con numpy), `qa:stability` 2/2, `qa:save`, `qa:runtime`, `qa:hubs`, `qa:controls`, `qa:gamepad`, `qa:audio`, `qa:health` PASS e la campagna A/B/C con `CITY_VIRTUAL_TIME=1` PASS (31 passi, 8 incarichi, 2 preparazioni; con il watchdog predefinito di 25 min la strategia A non passa su questo PC, dettagli in [STATO.md](STATO.md)). `qa:v9` esce con rc=1 nel repo per 9 artefatti mancanti (checkout sparse) e rc=0 su un albero esportato: non è una regressione di Q1. **Chiusura tecnica di Q1 verificata in sessione** (GO tecnico, non una release): attende l'ok di Posky per il commit e il push; M1 sul telefono resta aperta; zero sessioni umane. **Il commit si fa solo con l'ok di Posky o dell'autore.**

### Q1 — da provare sul telefono (M1)

M1 è rimandata a fine lavoro (D33). Su un telefono Android vero **NON POSSO CONFERMARE** nulla di quanto segue:

- **Errore a partita in corso su WebView reale** (U3). Dopo l'avvio, un errore non deve aprire «Il gioco non è riuscito a partire».
- **Pannello di recupero visibile in WebView** (U2, U4). «Qualcosa si è inceppato.» compare, si legge e «Riprendi dall'ultimo salvataggio» riporta al menu con «Continua».
- **Finestra multipla, cambio di carattere, di densità o di lingua con il gioco in background** (U5). Controllare `fontScale` e gli inset, e che l'Activity non venga ricreata.
- **Finestra del tasto Indietro chiusa toccando fuori, e predictive back** (U7). Il manifest ha `enableOnBackInvokedCallback="false"`: verificare che il gioco riprenda.
- **Musica dopo il ritorno**. Con `setMediaPlaybackRequiresUserGesture(true)` può restare muta fino al primo tocco: **[IPOTESI]**.
- **Ordine di `onPause` e `citynativepause`, e kill del processo**. Si misura con `adb shell am kill` dopo HOME, confrontando `stats.seconds`: **[IPOTESI]** che lo script giri dopo la pausa dei timer.
- **Blur reale generato dalla WebView durante «tieni premuto»** (U6). Un blur anche breve annulla la pressione: va bene che si debba ripremere?
- **`tools/verify_android_recovery.mjs` e `tools/verify_android_renderer.mjs`**: richiedono `adb` e un dispositivo o un emulatore.

## Q2 — leggibilità e feel, da provare sul telefono (M1)

Sessioni umane: ancora 0. QA automatica: [STATO.md](STATO.md), sezione Q2.

- Il passaggio da tratteggiato a pieno del cerchio rosso si nota a colpo d'occhio su 360 × 800, in pieno sole e senza audio?
- Le 4 tacche del blocco non coprono la scritta (SCHIVA, CARICA, CAMPO, IMPATTO) su schermo piccolo.
- Con «movimento ridotto» l'anello tratteggiato dell'invulnerabilità si legge, senza confondersi con le barriere di Lulù.
- Il doppio bordo di SCHIVA (shift carico) si vede in verticale e in orizzontale, e chi gioca capisce cosa significa senza spiegazione.
- Vibrazione: Perfect Dodge 20 ms, shift 15-30-15 ms, colpo 35 ms. Si sentono? Con «Vibrazione» spenta non vibra niente.

## M3 — demo e «Gioca l'altra rotta», da provare sul telefono e con persone

Sessioni umane: ancora 0. QA automatica: [STATO.md](STATO.md), sezione M3.

- Dopo M4, sul telefono: alla fine di «La firma» compare la schermata con il prezzo di Play; «Più tardi» torna al menu; l'acquisto con un account di test sblocca e porta alla tappa successiva; il ripristino su un secondo telefono con lo stesso account.
- Con persone: la schermata si capisce come fine della demo e non come un errore? Quanti toccano «Sblocca» e quanti «Più tardi» (`unlock_shown`, `unlock_bought`, `unlock_closed` della Fase 3 §F, se attivati)?
- «Gioca l'altra rotta»: il registro si legge su 360 × 800 con 10 scelte; la nuova partita parte davvero con le armi di prima.


## Q4 — menù Opzioni, da provare sul telefono (M1)

Sessioni umane: ancora 0. QA automatica: [STATO.md](STATO.md), sezione Q3–Q4.

- Le 4 schede (Audio, Accessibilità, Controlli, Crediti) si toccano con il pollice su un telefono da 360 px senza sbagliare scheda.
- I cursori di Musica ed Effetti si spostano a passi del 10 % senza far scorrere la pagina; a 0 % la musica tace davvero; al riavvio dell'app i valori restano.
- «Testo grande nei dialoghi»: le battute più lunghe stanno ancora nel riquadro, in verticale e in orizzontale.
- Con il gamepad o la tastiera: Esc chiude prima le Opzioni e poi la pausa.
