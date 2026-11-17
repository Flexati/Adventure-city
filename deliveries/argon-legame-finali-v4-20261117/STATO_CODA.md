# STATO CODA — Giro 4 Legame Nox & Lulù e 5 Finali (`deliveries/argon-legame-finali-v4-20261117/`)

## 1. Controlli di partenza (Sezione 1)
- **Ramo**: `delivery/argon-design-aaa-20261117`
- **Allineamento col ramo di lavoro**: eseguito `git fetch origin work/chronos-adventure-commercial` e `git merge --no-edit FETCH_HEAD` (`8b09635`) senza rebase e senza force-push.
- **Codice letto (senza modifiche)**: `game/bond.mjs`, `game/story-v08.mjs`, `docs/gold/DECISIONI.md` (D90).
- **Verifica strumenti**:
  - Modello immagini raster: utilizzato per generare `L1_momenti/moment_home_cup` e `L2_dettagli/detail_cup_steam`; alla terza chiamata ha restituito `generic::resource_exhausted: You've reached your usage limit for this model (resets in 11 hours, 47 minutes)`. Come prescritto dalla Sezione 5 (*"Ogni immagine nasce dal modello di immagini. VIETATO disegnare figure con il codice... Al limite di quota: fermati, commit e push del finito, aggiorna STATO_CODA.md"*), la generazione si è fermata esattamente al limite di quota senza generare sostituti procedurali.
  - Strumento musicale: nessun sintetizzatore a campioni, DAW o modello musicale commerciale disponibile nell'ambiente (`fluidsynth`, `timidity`, `ffmpeg`, `sox`, `csound` assenti).

## 2. Riepilogo Lotti Giro 4

| Lotto | Consegnati | Saltati | Mancanti | Note / Misure reali |
|---|---|---|---|---|
| **L1_momenti** | 1 / 4 tavole (`moment_home_cup` + `_guide.png` + `.webp` + `.report.json` + scheda) | 0 | 3 tavole (+ 3 `_guide.png`) | `moment_home_cup.png`: 1920×1080, 64 colori (`moon_refuge`), contrasto p95/p5 = 7.42, densità bordi = 0.0433 (palco = 0.0847), 0 personaggi disegnati, 0 testo OCR |
| **L2_dettagli** | 1 / 8 dettagli (`detail_cup_steam` + `.webp` + `.report.json` + scheda) | 0 | 7 dettagli | `detail_cup_steam.png`: 800×800, 64 colori (`moon_refuge`), contrasto p95/p5 = 10.0, densità bordi = 0.0543, 0 mani/personaggi, 0 testo OCR |
| **L3_finali** | 0 / 5 tavole finali | 0 | 5 tavole finali | In coda per limite quota modello immagini (`resource_exhausted`) |
| **L4_ui** | 0 / 6 elementi UI/effetti | 0 | 6 elementi UI/effetti | In coda per limite quota modello immagini (`resource_exhausted`) |
| **M4_audio** | 0 / 10 file audio | 10 | 0 | **Saltato come da regola M2/M4**: nessun sintetizzatore a campioni, DAW o modello musicale commerciale disponibile nell'ambiente; sintesi Python/NumPy vietata |

## 3. File consegnati in questo turno
1. `L1_momenti/moment_home_cup.png` (1920×1080 PNG, quantizzato su `moon_refuge.json`, 64 colori unici)
2. `L1_momenti/moment_home_cup.webp` (1280×720 WebP)
3. `L1_momenti/moment_home_cup_guide.png` (1920×1080 PNG con rettangolo palco 52%–86% altezza, linea d'appoggio piedi a 82% e ingombri sprite Nox e Lulù)
4. `L1_momenti/moment_home_cup.report.json` (misure reali di contrasto, densità bordi, conformità palette e audit family-safe)
5. `L1_momenti/schede/moment_home_cup.json` (scheda tecnica dell'asset)
6. `L2_dettagli/detail_cup_steam.png` (800×800 PNG, primo piano della tazza rosa antico di Lulù fumante sul davanzale, 64 colori unici su `moon_refuge.json`)
7. `L2_dettagli/detail_cup_steam.webp` (800×800 WebP)
8. `L2_dettagli/detail_cup_steam.report.json` (misure reali)
9. `L2_dettagli/schede/detail_cup_steam.json` (scheda tecnica dell'asset)

## 4. Elenco ordinato dei file mancanti (coda di produzione al reset quota)

### Priorità 1 — L1_momenti (3 tavole 1920×1080 PNG + 1280×720 WebP + 3 `*_guide.png` + report + scheda)
1. `moment_radio_crack` + `moment_radio_crack_guide.png` (Atto III, sottosuolo tra `waterworks` e `echo_quarry`; palco libero a sinistra 20%–55% larghezza, 55%–88% altezza; spia ambra radio nella nicchia a destra; 0 testo/cifre)
2. `moment_chalk_arrow` + `moment_chalk_arrow_guide.png` (Atto III, muro di cemento in `foundry_heights`; freccia di gesso bianca + segno corto non leggibile sotto; gessetto spezzato a terra; palco libero 58%–88% altezza)
3. `moment_elevator_seven` + `moment_elevator_seven_guide.png` (Atto IV, cabina di vetro e ottone dell'ascensore di `axis_tower`; città di Vanta che scende sotto; palco libero 60%–88% altezza)

### Priorità 2 — L2_dettagli (7 primi piani 800×800 PNG + WebP + report + scheda)
1. `detail_two_cups_close` (le due tazze del rifugio — ciano scuro di Nox e rosa antico di Lulù — che quasi si toccano sul davanzale)
2. `detail_radio_amber_eye` (la radio a valvole rattoppata di Lulù con la sola spia ambra accesa nel buio, scala priva di cifre)
3. `detail_chalk_mark` (la punta del gesso bianco sul cemento ruvido sotto la freccia, segno corto non leggibile, 0 mani)
4. `detail_glass_shard_reflection` (il frammento di vetro «a niente» appoggiato su una cassa: riflette ciano da un lato e magenta dall'altro)
5. `detail_elevator_brass_rail` (corrimano d'ottone dell'ascensore dell'Asse con il riflesso di due sagome indistincte e il lampo ciano/magenta del frammento di vetro)
6. `detail_jacket_on_chair` (la giacca da lavoro di Lulù appoggiata sulla spalliera della sedia del rifugio, con la bussola/radio spenta accanto)
7. `detail_windowsill_shard_alone` (il frammento di vetro lasciato solo sul davanzale del rifugio all'alba, per il finale `strade`)

### Priorità 3 — L3_finali (5 tavole finali 1920×1080 PNG + 1280×720 WebP + report + scheda)
1. `ending_ora_nuova` (tetto dell'Asse all'alba dorata; campane d'ottone in oscillazione con onde sonore luminose; le due tazze e il frammento di vetro sul parapetto; palco libero per gli sprite; 0 personaggi disegnati)
2. `ending_alba` (tetto dell'Asse alle prime luci rosa e ciano; la città di Vanta che accende le prime finestre calde sotto; giacca appoggiata sul parapetto; palco libero)
3. `ending_attesa` (banchina dei convogli a `grand_central` all'alba; convoglio in partenza nella nebbia dorata; la radio a valvole con la spia ambra accesa lasciata su una cassa in primo piano)
4. `ending_compagni` (tetto del rifugio in `old_town` in pieno mattino limpido; attrezzi da cantiere, assi nuove e le due tazze di smalto sul muretto; palco libero)
5. `ending_strade` (sentiero esterno verso `clockwork_outpost` al crepuscolo; il Clockwork Outpost è solo una piccola luce lontana all'orizzonte; in primo piano il davanzale con il frammento di vetro rimasto)

### Priorità 4 — L4_ui (6 elementi UI ed effetti PNG con trasparenza)
1. `ui_bond_toast_bg` (560×88 PNG — fascia sobria per «Lulù lo ricorderà», angoli smussati 4 px, bordo ambra/ciano)
2. `ui_bond_icon_spark` (48×48 PNG — stato 1 del legame: scintilla iniziale, verificata anche a 24×24 in scala di grigi)
3. `ui_bond_icon_warmth` (48×48 PNG — stato 2 del legame: calore condiviso, verificata anche a 24×24 in scala di grigi)
4. `ui_bond_icon_promise` (48×48 PNG — stato 3 del legame: promessa salda, verificata anche a 24×24 in scala di grigi)
5. `fx_lulu_intervention_shield` (256×256 PNG — onda protettiva rosa antico/ambra e ciano per l'intervento «Sono qui.»)
6. `ui_choice_card_frame` (640×120 PNG — cornice per le tre scelte dei quattro momenti del legame)

## 5. Saltati con motivazione (M4_audio)
- Tutti i 10 file di `M4_audio` (le 4 variazioni del tema del legame `bgm_bond_home_cup`, `bgm_bond_radio_crack`, `bgm_bond_chalk_arrow`, `bgm_bond_elevator_seven`, i 2 temi dei finali `bgm_ending_ora_nuova`, `bgm_ending_strade`, e i 4 effetti sonori `sfx_bond_remember_chime`, `sfx_lulu_sono_qui`, `sfx_axis_bells_first_ring`, `sfx_radio_amber_crackle`) sono **saltati** in conformità alla regola esplicita del Prompt v2/v4: nessun sintetizzatore a campioni, DAW o modello musicale commerciale è presente nell'ambiente di esecuzione, ed è vietata la sintesi procedurale scritta a mano in Python/NumPy.
