# City Adventure — prototipo quartieri 0.4

Nox e Lulù difendono quattro distretti consecutivi: gang, invasione aliena, contagio e frattura finale. Il tema precedente è rimosso dalla versione attiva.

## Avvio

`python3 tools/prepare_assets.py` prepara gli audio dai tre ZIP originali, senza modificarli. La grafica nuova è in `game/art/`.

`python3 tools/build_preview.py` crea `preview.html` offline. In alternativa servire la cartella `game/` con un server HTTP locale. Per Android: `ANDROID_SDK_ROOT=... bash tools/build_apk.sh`, con platform 35 e build-tools 35.0.0.

## Controlli

- Movimento: joystick sinistro oppure WASD/frecce.
- Sparo: tocca e rilascia; trascina e rilascia per mirare manualmente. Tastiera J/Spazio.
- Magia: dal secondo capitolo, L oppure pulsante dedicato.
- Schiva: Maiusc. Duo: Q quando la barra è piena. Attiva dispositivo: E, quando vicino e senza nemici entro 145 unità.
- Completa il quartiere eliminando le minacce e attivando tre dispositivi. Scegli tra ricarica magica rapida e più salute prima di proseguire.

Il salvataggio registra quartiere, eroe e potenziamento. Riprendere un quartiere in corso lo riavvia dall’ingresso. La build conserva l’ID Android precedente per consentire l’aggiornamento e usa una chiave debug locale: non è una release Play Store.

## Verifica e limiti

`npm test`: 23 test, di cui 6 sulla campagna attiva e 17 sul motore precedente. Il browser è stato verificato a 844×390 e 390×844: caricamento, menu, camminata, sparo, mira manuale, pausa, assenza di overflow e errori JavaScript.

Le quattro missioni sono prototipi brevi, con obiettivo comune di neutralizzazione e attivazione. I fondali condividono una geometria di strade coerente. Le camminate hanno quattro frame frontali/laterali, non un set completo in otto direzioni. Il compagno segue e partecipa tramite Duo; non è multiplayer. Il veicolo è scenografico. Bilanciamento, frame rate e comportamento Android su dispositivo fisico devono essere provati. Nessuna monetizzazione implementata.
