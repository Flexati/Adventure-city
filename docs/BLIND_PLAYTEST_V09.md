# City Adventure v0.9-rc — protocollo del test alla cieca

**Stato: PREPARATO, non eseguito.** I bot e il tour automatico non sono giocatori esterni.
Questo protocollo non autorizza ancora la pubblicazione a €4,99. Non mostrare ai partecipanti
il release gate, le istruzioni seguenti per il moderatore, il numero di finali o i voti desiderati.

## Campione e materiali

Reclutare almeno 5 persone estranee allo sviluppo, con esperienza mobile mista.
Almeno due usano solo controlli touch e non giocano abitualmente ad action game.
Usare un APK debug **v0.9-rc.1**, registrandone commit e SHA-256. Non usare un vecchio APK v0.8.
Installazione pulita su almeno un Android di fascia media; aggiungere un telefono economico,
annotando modello, Android, WebView, RAM, refresh rate e volume. Usare prima lo speaker interno,
poi cuffie per il confronto del mix. Registrare video e audio solo con il consenso della persona.
Conservare le schede sotto ID P01–P05, senza nomi o dati personali nel repository.

## Istruzione da leggere, identica per tutti

> «Questo è City Adventure, un’avventura per telefono. Inizia una nuova storia e gioca come preferisci.
> Puoi fermarti quando vuoi. Nei primi dieci minuti non ti spiegherò i comandi.
> Se qualcosa ti confonde o ti sembra ingiusto, raccontami quello che stai pensando.»

Il moderatore non suggerisce pulsanti, traiettorie, scelte, interpretazioni della relazione o prezzo.
Se il partecipante resta bloccato per oltre 90 secondi, registra punto e durata, poi offre **un solo**
aiuto minimo e lo segna come intervento. Una confusione bloccante resta un fallimento del gate,
anche se dopo l'aiuto la partita prosegue.

## Sessione

1. **Primi 10 minuti:** dal primo avvio, senza aiuti. Annotare tempo al primo input, comprensione
   dei due colpi, mira automatica/manuale, schivata, attivazione, leggibilità e ogni tap mancato.
2. **Storia completa:** permettere pause e ripresa, senza forzare una durata. Annotare missioni,
   morti, tentativi, abbandoni e motivo. Non anticipare il ricongiungimento.
3. **Ripresa:** durante una missione e durante una scelta fare una breve uscita dall'app; in una
   seconda prova chiuderla e riaprirla. Distinguere la normale ripartenza della missione dalla
   perdita di una scelta già confermata. Controllare assenza di suoni in background.
4. **Audio e prestazioni:** provare Porto spento, Archivio EVE e il finale su speaker; il Black Pulse
   deve essere percepibile senza coprire gli avvisi. Cercare distorsioni, scatti ai crossfade,
   rumore fastidioso, temi stancanti e latenza del feedback. Sessione sostenuta di almeno 20 minuti,
   non solo un benchmark di pochi secondi. Acquisire Perfetto/logcat e temperatura/batteria.
5. **Domande finali**, prima di dire il prezzo: «Cosa è successo tra i due protagonisti?»;
   «Quali luoghi ricordi?»; «Quale momento ti ha emozionato?»; «Quale morte è stata ingiusta e perché?»;
   «Cosa ti è sembrato ripetitivo?»; «Cosa cambieresti nel suono?».
6. Solo ora: «Lo compreresti a €4,99? Perché?». Chiedere voti 0–10 a controlli, combattimento,
   varietà, storia/relazione, arte, audio e valore. Non comunicare il nostro obiettivo di voto.

## Scheda individuale da compilare

| Campo | Risposta |
|---|---|
| ID, build/commit/SHA-256, data | |
| Dispositivo / Android / WebView / refresh | |
| Esperienza action mobile e uso touch | |
| Primo input / prima attivazione / primo aiuto (secondi) | |
| Confusioni nei primi 10 minuti (timestamp, schermata) | |
| Missioni finite / durata attiva / morti / riavvii | |
| Fine storia raggiunta senza aiuto? | |
| Morti ingiuste, motivo e timestamp | |
| Differenze percepite tra mappe e punti di orientamento | |
| Distorsioni / suoni coperti / transizioni / volume | |
| Pausa, chiusura, ripresa e scelta pendente | |
| FPS sostenuti / p95 frame / scatti / logcat | |
| Voti individuali 0–10 / acquisto a €4,99 / motivi | |

## Decisione e report aggregato

- Nessuna confusione bloccante nei primi dieci minuti per tutti e cinque.
- Almeno 4/5 completano la storia; riportare gli interventi e gli abbandoni, senza escluderli dal conteggio.
- Nessuna morte ingiusta segnalata irrisolta. Allegare la riproduzione dei problemi.
- Android medio: 60 fps stabili, oppure un profilo 30 fps regolare esplicitamente adottato e verificato;
  nessun crash, audio e ripresa corretti. Il requisito di 60 fps non può essere dimostrato dal Chromium del server.
- Riportare mediana, minimo e distribuzione dei voti, oltre alle citazioni anonime.
  Il voto commerciale non si ottiene facendo la media dei soli test tecnici.

| Esito aggregato | Risultato attuale |
|---|---|
| Partecipanti | 0/5 |
| Storia completata | non misurato |
| Confusioni bloccanti / morti ingiuste | non misurato |
| Ascolto umano speaker/cuffie | non eseguito |
| Android medio / economico | non verificato |
| Valore percepito a €4,99 | non misurato |
| Decisione commerciale | **BLOCKED** |
