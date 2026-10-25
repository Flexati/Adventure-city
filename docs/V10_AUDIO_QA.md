# V10 audio e musiche

AUDIO_GATE = BLOCKED. MUSIC_GATE = BLOCKED.

Dieci campioni OGG copiati tramite ID/hash, senza WAV master nel runtime:
menu, scelta, dash, perfect dodge, Duo, C9, VX9, R12, H17, ARC7.
Registro: `game/audio/v10/integration.json`.
Eventi/gain/cooldown: `game/v10-bindings.mjs`.
Stato di qualità conservato: PROTOTYPE; licenze e ascolto NOT_VERIFIED/NOT_TESTED.

Un campione di sparo non completa una famiglia arma: ricarica, vuoto,
cambio, impatti e varianti richieste restano da produrre/collegare.
Gli ID avanzati sono collegati al dispatcher ma l'arsenale V9 non è ancora
integrato nella campagna principale: non si dichiara di averlo completato.

Implementato nel motore:
- Precaricamento condiviso e decodifica di soli dieci SFX brevi.
- Guardie per mute, pausa, audio bloccato e limite voci.
- Cleanup alla fine della voce; fallback procedurale se il campione manca.
- Eventi distinti per spari per arma, schivata perfetta e Duo.
- Diagnostica di campioni decodificati, byte, eventi riprodotti ed errori.

Controlli effettivi:
- OGG decodificabili; metriche PCM/peak/RMS in `artifacts/v10/asset-audit.json`.
- Dieci SFX occupano 970200 byte PCM a 44.1 kHz nella misura statica.
  Il browser può ricampionare al sample rate del proprio contesto.
- `audio-render.json`: dieci rendering singoli più uno stress, tramite
  OfflineAudioContext Chromium a 48 kHz e bus reale; 11 PASS tecnici.
- `mobile/report.json`: riproduzione C9 e dash osservata tramite source
  avviate nel motore, caricamento HTTP 200 e nessun errore nei tre viewport.
- `runtime.json`: mute, pausa/ripresa e notifiche lifecycle simulate nel browser.

Questo non equivale ad ascolto umano, DAC Android o approvazione del mix.
Ascolto su cuffie/speaker, intelligibilità e bilanciamento contestuale:
NOT_TESTED. Identità completa per nemici, veicoli, mondo e gadget: OPEN.

## Music system

Nessuna musica sintetica V10 importata come definitiva. Si conserva il
sistema esistente di streaming e crossfade con massimo due decoder
durante la transizione. Un crossfade può sovrapporre temporaneamente
due sorgenti; non devono restare due musiche attive stabilmente.

La gerarchia completa exploration/tension/combat/boss/resolution e
staging/race/final lap/victory/defeat, le identità regionali, i 129 brief
originali e l'espansione musicale NON sono dichiarati completati.
I cue generati di 12–14 secondi non sono automaticamente musica finale.
Tre loop ascoltati per traccia, mastering loudness e transizioni contestuali:
NOT_TESTED. Non si inventano sessioni d'ascolto o licenze.
