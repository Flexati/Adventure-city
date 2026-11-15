# Richieste di produzione per Codex — sessione Opus

Ogni richiesta nasce da un blocco di gioco già pronto o immediatamente successivo. Prima di chiederla è stata cercata nelle sorgenti (`PACKAGE_MANIFEST.json`, `PRODUCTION_COVERAGE.csv`, `game/art`, `game/audio`, `assets/production`): per queste famiglie non esiste alcun candidato. Nessun segnaposto o copia rinominata è stato usato per chiuderle.

Convenzioni comuni, già usate dal runtime:
- **Sprite personaggi in campo:** master RGBA trasparente, griglia 4 colonne × 4 righe, figura intera con piedi visibili, nessuna parte oltre il bordo della cella (lasciare almeno 12 px), luce dall'alto a sinistra, stessa densità di pixel e palette dei master Kairn/Morrow. Il runtime isola e ancora le pose con `tools/lib/sprite_isolation.py`; frame mancanti o pose che escono dalla cella vengono respinti.
- **Sprite dei protagonisti armati:** stessa griglia e dimensioni degli sheet impugnati esistenti (1305×1205, righe lato/schiena/fronte/diagonale-schiena, Nox e Lulù **non ridisegnati**: solo l'arma e le mani cambiano).
- **Audio:** master FLAC 48 kHz + export OGG Vorbis, picco ≤ −1 dBFS, cue brevi senza silenzio iniziale > 10 ms, brani in loop con giunzione senza dissolvenza a zero; partitura o parametri di sintesi e metriche come `strangers_audio/score-and-metrics.json`.
- Consegnare in `assets/production/v10.2/handoff/` con hash nel manifesto; indicare provenienza e condizioni d'uso reali.

## P1 — sbloccano il prossimo blocco di gioco

| ID famiglia | Contenuto | Stati / frame | Formato | Evento runtime |
|---|---|---|---|---|
| `character.veyra.portrait_or_story_gestures` | Ritratto di Veyra «Ash» Kor per i dialoghi (pilota del porto esterno, tuta da corsa usurata, occhiali sulla fronte; nessun riferimento a persone reali) | neutro, sfida, sorriso trattenuto, rispetto | PNG 512×512 per stato, sfondo trasparente | `say()` con speaker `VEYRA` prima/dopo ogni gara |
| `character.veyra.sprite_animation_set` | Veyra in campo accanto alla sua auto negli hub | idle ×4, gesto "seguimi" ×4, braccia conserte ×4, saluto ×4 | master 4×4 come Kairn/Morrow | punto `vortex` negli hub (sostituisce l'auto sola) |
| `race.ash_docks.track_visual_states` (+ `ash_slalom`, `ash_night`) | Vista dall'alto dell'auto di Veyra coerente con l'atlante `driving_cars.png` (stessa scala e prospettiva) e container portuale da corsia | auto: intatta, danneggiata, molto danneggiata; container: normale, colpito | atlante 4×2 celle 384×256 come `driving_cars.png` | `drawRace()`: auto `veyra`, ostacoli `hazards` |
| `race.ash_*.route_signal_visuals` | Paletti checkpoint del porto e segnali gru per lo slalom; versione notturna con luce propria | checkpoint attivo / passato; varco stretto | PNG trasparenti 128×256 | checkpoint e `checkpointXs` |
| `race.ash_*.race_sfx_family` | Sorpasso rivale, urto contro container, checkpoint del porto, avvio semaforico | 4 cue | OGG ≤ 1 s | eventi `impact`, `checkpoint`, `start` del modello gare |
| `race.ash_*.ambience_or_music_variant` | Brano del campionato di Veyra, porto industriale notturno, 90–100 BPM, loop pulito | 1 brano + variante notturna | OGG 30–60 s in loop | `soundtrack()` durante `mode==='race'` |

## P2 — H-17 e ARC-7 nella progressione (dopo gli incontri che li sbloccano)

| ID famiglia | Contenuto | Stati / frame | Formato | Evento runtime |
|---|---|---|---|---|
| `weapon.h17.equipped_visual_animation` | Nox con H-17 Needle (fucile di precisione perforante) | tiro 4×4 (anticipo, rilascio, rinculo, recupero) + ricarica 4×4 (abbassa, estrai, inserisci, pronta) | 2 master 1305×1205 | `heroFrame` con arma attiva `h17`; ricarica 1,8 s |
| `weapon.arc7.equipped_visual_animation` | Lulù con ARC-7 Choir (emettitore a catena) | come sopra | 2 master 1305×1205 | arma attiva `arc7`; ricarica 1,5 s |
| `weapon.h17.shot_impact_vfx`, `weapon.arc7.shot_impact_vfx`, `weapon.vx9.shot_impact_vfx`, `weapon.r12.shot_impact_vfx` | Impatti distinti: ago che perfora, arco che salta, raffica, rosata | 4 frame per arma | atlante 4×4 celle 128×128 | evento `impact` con `weapon` |
| `weapon.h17.weapon_sfx_family`, `weapon.arc7.weapon_sfx_family` | Sparo e ricarica | 2 cue per arma | OGG | `vx9Shot`/`r12Shot` analoghi |
| `weapon.h17.weapon_icon`, `weapon.arc7.weapon_icon` | Icone nella stessa grammatica di `weapon_icons.png` | normale / non disponibile | celle dell'atlante esistente | barra armi |

## P3 — incontri che mancano del tutto (bloccano H-17 e il conteggio dei 17 incontri)

Per ciascuno di `boss.anchor`, `boss.vega`, `boss.volkov`: `sprite_animation_set` (idle, camminata, anticipazione, attacco, recupero, danno, sconfitta: 4 frame ciascuno, master 4×7), `attack_vfx_set` (telegrafo e impatto per ogni attacco), `telegraph_sfx_family` (un cue per attacco telegrafato), `arena_visual_set` (pavimento e bordi coerenti con la regione), `boss_music_cues` (loop di scontro + stinger di fase). Prima dello sprite servono le regole dell'incontro: le preparo nel codice con la stessa struttura di Rook e le consegno come specifica, così forma e tempi dei frame corrispondono al modello.

## Kairn e Morrow — completamento

`character.kairn.portrait_or_story_gestures` e `character.morrow.portrait_or_story_gestures`: ritratti per i dialoghi (stessa fonte `strangers-author-reference.jpg`), 2 stati ciascuno. Nota: prima della pubblicazione serve una revisione di somiglianza/diritti dei due design (vedi `STRANIERI.md`).
