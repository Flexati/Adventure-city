# City Adventure — playtest Blackout 0.6

Nox e Lulù difendono quattro quartieri da gang, alieni, infetti e custodi della frattura. Tre missioni di guida collegano i capitoli. Nox guida sempre la Vortex; Lulù è passeggera anche quando è il personaggio selezionato a piedi.

## Avvio e controlli

Servire `game/` con un server HTTP locale, oppure usare `python3 tools/build_preview.py` per preparare `dist/City_Adventure_Preview_v05/`. Gli asset sono file separati.

- A piedi: joystick o WASD/frecce; J/Spazio sparo, L magia dal capitolo 2, Maiusc schivata, Q Duo a barra piena, E dispositivo vicino non conteso. Trascinare il pulsante di attacco per mirare e rilasciare per sparare.
- Guida: joystick orizzontale o A/D; acceleratore o W; freno o S. Attraversare i segnali azzurri; nei punti verdi fermarsi per almeno 0,8 secondi. Schivare veicoli e banchine, conservare integrità e rispettare il tempo.
- Pausa: pulsante o Esc. Il checkpoint riavvia il quartiere o la corsa in corso, senza conservare la posizione precisa.

## Percorso

1. Blackout: difesa del Cantiere Est.
2. Fuga dal Cantiere: raggiungere il porto evitando la gang.
3. La breccia: respingere gli alieni al porto.
4. Sotto la breccia: attraversare tre segnali stradali.
5. Ultima corsia: contenere il contagio nel distretto clinico.
6. L’ultima evacuazione: fermarsi in due punti per raccogliere superstiti.
7. Ora zero: chiudere la frattura al Nodo Centrale.

Le quattro missioni a piedi mantengono lo schema di eliminazione e attivazione di tre dispositivi. Dopo ciascuna delle prime tre si sceglie un potenziamento e si affronta la corsa prima del quartiere successivo.

## Asset e verifica

18 nuovi PNG in `game/art/v05/`: 8 atlanti dei protagonisti, 4 dei nemici, effetti, armi, dispositivi, menu, strada e veicoli. Sei temi musicali originali sintetizzati e cinque effetti in `game/audio/v05/`, con MIDI e partitura JSON. Nessuna melodia o registrazione di altri giochi. Generatore in `tools/compose_soundtrack.py` (NumPy e ffmpeg richiesti).

Catalogo, prompt, hash e limiti in `docs/art-v05/`. Test della campagna attiva, animazioni e guida: `node --test tests/campaign.test.mjs tests/visuals.test.mjs tests/driving.test.mjs`. Prove browser in verticale e orizzontale comprendono caricamento, attacchi, pausa e ripresa della guida.

Questa consegna aggiorna sorgenti e asset; non include un nuovo APK verificato. Per compilare servono JDK 17, Android platform 35, build-tools 35.0.0 e la chiave debug originale per aggiornare l’app esistente. La correzione di avvio con risorse locali separate rimane attiva. Prestazioni, audio soggettivo e avvio su telefono richiedono verifica su dispositivo. Non è ancora una release di produzione.

## Blackout 0.6

Scelta persistente officina/rifugio dopo la liberazione del primo quartiere. Officina: +1 integrità nella prima fuga; rifugio: strada con meno ostacoli. Dopo la fuga compare il riepilogo visivo dei luoghi alimentati. Dettagli e limiti: `docs/BLACKOUT_V06.md`. APK di prova: `City_Adventure_Blackout_v0.6_debug.apk`.
