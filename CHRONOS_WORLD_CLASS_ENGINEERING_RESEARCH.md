# CHRONOS — Ricerca tecnica e scelte di architettura

**[FATTO] Che cosa questo documento non è.** In questa sessione non è stata fatta una ricerca dal vivo su documentazione e repository esterni. Le valutazioni delle librerie sotto vengono dalla conoscenza tecnica di chi scrive e sono marcate **[IPOTESI]**. Prima di adottare qualunque libreria vanno verificate licenza, versione e manutenzione correnti. Nessuna dipendenza è stata aggiunta.

## 1. Il vincolo che decide

- **[FATTO] Bundle.** Il gioco è JavaScript in un WebView, senza Gradle e senza bundler: `tools/prepare_android_assets.py` unisce i moduli in `app.js`. La guardia dei test è 458 752 byte, oggi `app.js` pesa 456 320 byte, quindi il margine è **2 432 byte**.
- **[FATTO] Dipendenze.** `package.json` ha solo due dipendenze di sviluppo (playwright, pngjs) e nessuna a runtime.
- **Conseguenza.** Qualunque motore o libreria esterna costa decine o centinaia di KB. Pesa contro una guardia che lascia meno di 3 KB.

## 2. Valutazione delle alternative [IPOTESI]

| Tecnologia | Che cosa porterebbe | Perché no, ora |
|---|---|---|
| Phaser, PixiJS | Renderer WebGL, scene, tween, caricamento asset | Il disegno è già Canvas 2D con mappe pre-rasterizzate a 3 livelli di risoluzione; riscrivere il rendering rifarebbe tutte le prove visive; peso molto oltre il margine |
| Godot, Unity, Unreal | Editor, fisica, export Android | Cambio di motore = riscrittura completa del gioco; contraddice «migliorare, non sostituire per prestigio» |
| Three.js | 3D | Il gioco è 2D dall'alto |
| Matter.js, Planck.js, Rapier, Box2D | Fisica a corpi rigidi | Il movimento è su griglia 24×24 con collisioni a celle e hitbox fissate da D27/D29/D44: una fisica nuova cambierebbe tempi e hitbox (vietato, regola 4) |
| Spine, Rive | Animazione scheletrica | Gli eroi sono fogli V8 dipinti e intoccabili (regola 5) |
| Howler.js | Audio multipiattaforma | `game/audio-engine.mjs` usa già Web Audio con flussi in dissolvenza, al massimo due decoder |

## 3. Principi applicati senza librerie [FATTO, con la fonte]

- **Passo fisso e hit-stop separati.** Il tick di combattimento (`game/campaign.mjs`) è separato dal disegno.
- **Pool di oggetti.** `chronoFxPool` ha 16 posti; `fx` ha un tetto di 200 (`game/runtime.mjs`).
- **Disegno solo di ciò che si vede.** `viewBounds` in `game/village-art.mjs` (MS-1) taglia griglia, particelle e forzieri fuori inquadratura.
- **Macchine a stati per nemici e boss.** Il campo `state` vale `walk`, `warn`, `charge`, `recover`, `dormant`.
- **Audio deterministico.** La colonna sonora R38 è sintetizzata in Python (`tools/score_r38/`) con semi fissi e Opus bitexact: la riproduce lo stesso repo, senza campioni né fornitori.
- **Ispirazione senza copia (Celeste, Hollow Knight, Dead Cells).** Avviso prima di ogni attacco, finestra di debolezza del boss detta in parole e con una forma (non solo col colore, regola 9), varietà di obiettivi per non ripetere lo stesso ciclo (MS-3).
