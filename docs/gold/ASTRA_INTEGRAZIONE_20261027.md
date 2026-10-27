# Integrazione consegna Astra 20261027

Fonte: ramo `delivery/astra-opus-20261027`, cartella `deliveries/astra-opus-20261027/archivi/`. I nove ZIP hanno dimensioni, numero di file e SHA-256 identici a `INDICE.json`, e nessun percorso esce dalla cartella. Sono stati estratti in staging fuori dal checkout, che non è mai stato sovrascritto. Base di gioco: `71a35ec` più gli aggiornamenti di questo ramo.

> **Aggiornamento — correzioni `astra-correzioni-20261027` (f727255).** Le tabelle qui sotto descrivono la prima consegna. Lo stato attuale di ogni riga corretta è nella sezione [Correzioni 20261027](#correzioni-20261027-f727255), in fondo.

Regola seguita: si integra solo ciò che supera il controllo. Ogni integrazione lascia la famiglia **APERTA** finché non c'è una revisione artistica, un ascolto umano e una prova su dispositivo. Nessuna meccanica, hitbox o tempo è stato cambiato per adattarsi a un'immagine: `ANCHOR_RULES`, i caricatori e le ricariche delle armi sono invariati. COMMERCIAL_RELEASE resta BLOCKED.

## Integrati nel gioco

| Riga | File consegnato | File di runtime | Uso | Trattamento |
|---|---|---|---|---|
| G11 | `BOSS_anchor_sheet.png` 3072×4096 | `game/art/v10/anchor_core.png` 1536×2048 | The Anchor: 8 righe di stati scelte dal modello (`anchorFrame`) | `tools/build_anchor_sheets.py`: le righe 3-7 avevano la base fino a 130 px più alta delle righe 0-2. Vengono traslate sulla base comune (y 493), i frammenti della riga sotto vengono rimossi, il fumo troncato al bordo di export viene sfumato sui primi 48 px. Nessun ridisegno; dimezzato per Android. |
| G12 | `ARENA_anchor_bollard_{tesa,tagliata,riormeggio}.png` | `game/art/v10/anchor_bollards.png` | Bitte: tesa, tagliata, ri-ormeggio negli ultimi 2 s (`bollardFrame`); il moncone della cima è specchiato verso il nucleo | Rimossa una mezzaluna estranea sul bordo destro della «tagliata». |
| A5 | `anchor_moor`, `anchor_exposed`, `anchor_relink`, `anchor_line_tension`, `anchor_sweep`, `anchor_line_cut`, `anchor_weight` (OGG) | `game/audio/v10/` | `anchorMoored`, `anchorExposed`, `anchorRelink`, `anchorSweepWarn`, `anchorSweep`, `down` di una bitta, `enemyAttack` del nucleo (nuovo campo `bossKind`) | La tensione dura 1,25 s con il picco a 0,69 s, cioè il lock al 55% di 1,25 s. Il colpo del peso ha l'attacco a 0 s: suona quando il peso cade, non quando parte l'avviso. Senza buffer si torna a un suono sintetico, mai al bip dell'interfaccia. |
| A5 | `anchor_fight_loop.ogg` 80 s | `game/audio/v10/` | Musica finché il nucleo è sveglio; vittoria, pausa e ritentativo seguono il selettore musicale esistente | Livello costante per battuta (RMS 0,055-0,072), motivo che si ripete ogni 4 battute, salto di campione alla giunzione 0,004. |
| G9 | `VFX_c9_impact`, `VFX_vx9_impact`, `VFX_r12_impact` | `game/art/v10/vfx_{c9,vx9,r12}.png` | Riga 1: impatto sul corpo (`impact` con `source:'gun'`). Riga 2: impatto sul muro (`shot` con il nuovo campo `wall`). La riga 0 (proiettile) non è usata: il raggio resta, perché mostra la portata del colpo istantaneo. | R-12: rimossi 7 puntini (3-19 px) tagliati al bordo di export (`tools/build_astra_vfx.py`). |
| G3 | `RACE_veyra_car.png` | `game/art/v10/race_veyra_car.png` | Auto di Veyra nelle gare di Ash Docks: danni in base all'integrità, luci notturne in `ash_night` (`veyraCarFrame`). Stessa altezza in gara dell'auto attuale (110). | Nessuno. Le celle «parcheggiata 3/4» e «frenata» non sono ancora usate. |
| G5 | `RACE_ashdocks_container_{normale,colpito}` | `race_container.png`, `race_container_hit.png` | Container dove il modello calcola la collisione; «colpito» dopo un urto del giocatore | Vista leggermente 3/4 su strada dall'alto: in gara si legge bene (`hub-race-*-strip.png`). |
| G5 | `RACE_ashdocks_cp_{attivo,superato}` | `race_cp_active.png`, `race_cp_passed.png` | Solo checkpoint stretti (mezza larghezza ≤ 100: `ash_slalom`) | I checkpoint larghi (330 px) mantengono i pali disegnati. |
| G10 | `PORTRAIT_kairn_neutro`, `PORTRAIT_morrow_beffardo` | `portrait_kairn.png`, `portrait_morrow.png` 128×128 | Ritratto nei dialoghi di KAIRN e MORROW | Fedeli ai master; resta aperta la revisione dei diritti sulla somiglianza (`STRANIERI.md`). |
| G1 (P1 precedente) | `PORTRAIT_veyra_neutra` | `portrait_veyra.png` 128×128 | Ritratto di VEYRA nell'introduzione e nel risultato della gara | — |
| A2 (P1 precedente) | `race_checkpoint`, `race_container_hit`, `race_finish` | `game/audio/v10/` | Checkpoint, urto e traguardo del giocatore | Attacco a 0 s. |
| A3 (P1 precedente) | `veyra_championship`, `veyra_championship_night` 80 s | `game/audio/v10/` | Musica delle gare: notte in `ash_night`, giorno nelle altre | Livello per battuta stabile, salto alla giunzione 0,0002. |

## Accettati, conservati ma non collegati

| Riga | File | Motivo |
|---|---|---|
| G10 / G1 | `PORTRAIT_kairn_allarme`, `PORTRAIT_morrow_paura`, Veyra `rispetto`/`sfida`/`sorriso` | Le battute non indicano l'emozione. Servirà un campo per battuta, senza riscrivere il testo. |
| G8 | `ICON_arc7_{normale,selezionata,non_disponibile}` | ARC-7 non si può ancora ottenere in campagna (`eden_technology`). |
| G7 | `lulu_arc7_reload.png` | Pulita e coerente con l'identità di Lulù, ma più piccola (corpo 0,906×, piedi a 304 invece di 319) e senza uno sheet di tiro accettato. La deviazione 1305×1285 rispetto all'Excel resta esplicita e segue `RELOAD_DRAW_SCALE=321.25/301.25`. |
| A2 | `race_rival_pass` | Il modello di gara non ha un evento di sorpasso: serve una decisione di design, non un altro file. |
| A4 | `h17_shot/reload`, `arc7_shot/reload` | Armi non ancora raggiungibili. |
| G9 | `VFX_h17_impact`, `VFX_arc7_impact` | Armi non raggiungibili. A occhio, in cima ad alcune celle ci sono forme tagliate in orizzontale: da ricontrollare quando l'arma entra in campagna. |

I file accettati, integrati o conservati, sono in `assets/production/v10.2/handoff/astra_20261027/`, insieme ai FLAC di A5 e al master G11. I P1 precedenti erano già in `handoff/astra_p1/`.

## Respinti: motivo e correzione richiesta

| Riga | File | Motivo misurato | Correzione richiesta ad Astra |
|---|---|---|---|
| G11 | (master) | Il foglio è integrato solo grazie al trattamento tecnico: righe 3-7 con base fino a 130 px più alta, fumo tagliato al bordo superiore del master (`source_touched_edge` su 20 celle). | Riesportare dal master con margine: tutte le celle con la base a y 493 su 512 e il fumo intero. |
| G12 | `ARENA_anchor_cable.png` | Ha i terminali e non si ripete: il periodo migliore è 42 px, con una differenza RGB media di 14,4 tra tratti. | Un segmento 64×64 ripetibile in verticale e un terminale separato. |
| G12 | `VFX_anchor_sweep.png` | È un arco circolare, ma il colpo è una corsia dritta 560×64. Ha frame tagliati sul bordo delle celle (righe 1-2) e frammenti estranei nella riga 0. Non si cambia la hitbox per seguirlo. | Corsia dritta in tre fasi (carica, lock, colpo), ripetibile in lunghezza, senza tagli. |
| G4 | `RACE_ashdocks_road_{day,night}.png` | La giunzione non è continua: differenza media 21,1 di giorno e 12,3 di notte; container e gru si interrompono sul bordo. La carreggiata x130-590 invece è corretta. | Tile con il bordo superiore e quello inferiore identici, contenuti dei marciapiedi chiusi entro la tile. |
| G5 | `RACE_ashslalom_gate_{aperto,chiuso}.png` | Largo 142-160 px, contro un cancello di 460 px. Nessuna gara di Ash Docks usa cancelli. | Due piloni gru separati e una barra ripetibile, per quando i cancelli entrano in gioco (Aurelia Span). |
| G5 | checkpoint larghi | L'arco di 96 px non copre i 330 px dei checkpoint di `ash_docks` e `ash_night`. | Due piloni separati 128×256 più un nastro ripetibile. |
| G6 | `nox_h17_gun.png`, `nox_h17_reload.png` | Nello sheet di tiro ci sono frammenti dei piedi della riga sopra in cima alla riga frontale e VFX di sparo che sconfinano nelle celle vicine. Scala del corpo 0,895× (tiro) e 0,907× (ricarica) rispetto a VX-9; piedi a 284/303 invece di 299/319: cambiando arma Nox si rimpicciolirebbe e salterebbe. Identità rispettata. | Isolamento per posa e la stessa scala e base degli sheet VX-9 (corpo 267/281 px, piedi 299/319). |
| G7 | `lulu_arc7_gun.png` | Stessi difetti: frammenti dei piedi, fulmini che sconfinano, scala 0,895×. Identità di Lulù rispettata. | Come G6, con riferimento R-12. |
| G8 | `ICON_h17_*` | La camera mostra **tre** colpi, ma il caricatore dell'H-17 ne ha **quattro**. | Quattro elementi luminosi distinti, anche in grigio. |
| G2 (P1 precedente) | `CHAR_veyra_sheet.png` | Figura alta 70-78 px in celle da 340, contro circa 267 px degli sheet degli eroi; inoltre Veyra non cammina in nessun hub. | La stessa densità di pixel degli sheet degli eroi, quando Veyra avrà una presenza a piedi. |
| A2 (P1 precedente) | `race_start` | Quattro bip in 1 s, mentre il conto alla rovescia dura 3 s. | Tre bip a 1 s più il «via», oppure solo il «via». |

## In attesa di una decisione dell'autore

**A1 «Due colpi»** (`two_knocks_*`): nell'apertura ogni tocco produce un colpo, ma il file ne contiene due. Collegare la variante «risposta» dopo il secondo tocco cambierebbe chi bussa: è una scelta di canone, non tecnica.

## Prove

- `npm test`: 201 test superati su 201. Nuovi test: pose di The Anchor sul modello reale (`tests/anchor.test.mjs`); eventi `impact`/`shot` per gli impatti delle armi (`tests/weapons-v9.test.mjs`).
- `tools/verify_anchor_browser.cjs` a 390×844 e 844×390: PASS, compresa la nuova cattura ravvicinata del nucleo. Strisce in `docs/evidence/v10.2/anchor-*-strip.png`.
- `tools/verify_hub_race_browser.cjs` a 390×844 e 844×390: PASS, zero errori e zero 404. Prove in `docs/evidence/v10.2/astra-20261027/`.
- `tools/verify_strangers_browser.cjs` a 390×844: PASS, con il ritratto nel dialogo dei titoli di coda.
- Combattimento nella Breccia con C-9 (impatti sul corpo visibili, zero errori): `astra-20261027/impact-vfx-c9-390x844.png`.
- Regressione completa della campagna A nel browser (`tools/verify_campaign_browser.cjs`, pilota automatico): PASS, 31 passi, finale completo (`astra-20261027/campaign-a-report.json`).
- Il movimento ridotto blocca la posa di riposo del nucleo e il tremolio quando è colpito (test).
- Android: `tools/prepare_android_assets.py` e `AssetRoutes.java` includono i nuovi file; `tests/android-bundle.test.mjs` passa. Nessuna prova su un dispositivo Android.

## Lacune

Revisione artistica umana; ascolto umano e mix su un telefono vero; true-peak; prova su WebView e Android; revisione dei diritti sulla somiglianza di Kairn e Morrow; righe P2/P3 non prodotte in questa consegna; correzioni richieste qui sopra.

## Correzioni 20261027 (f727255)

Fonte: ramo `delivery/astra-correzioni-20261027`, commit `f727255`, cartella `deliveries/astra-correzioni-20261027`. I due ZIP (`CHRONOS_CORREZIONI_ASSET_DOCUMENTI.zip`, `CHRONOS_CORREZIONI_MASTER.zip`) e i 41 file elencati in `INDICE.json` corrispondono per byte e SHA-256. Nessun percorso esce dalla cartella. Sono stati estratti insieme in staging, fuori dal checkout. Il sorgente di ogni file accettato è in `assets/production/v10.2/handoff/astra_correzioni_20261027/`, con `INDICE.json`, `PROVENIENZA.json` e i rapporti G11 e audio.

### Integrati

| Riga | File | Uso in gioco | Verifica fatta |
|---|---|---|---|
| G11 | `BOSS_anchor_sheet.png` → `game/art/v10/anchor_core.png` | Sostituisce lo sheet con riancoraggio tecnico | Base del corpo a y 493-496 in 32 celle su 32; nessun frammento staccato sotto la base; nessun pixel sui bordi delle celle; fumo intero nelle righe 4-6. Il builder ora rifiuta uno sheet che violi queste regole invece di correggerlo. Scala unica: corpo largo 493 px, disegnato a 200 in gioco (`ANCHOR_SHEET.bodyWidth` 246 a metà risoluzione). |
| G12 | `ARENA_anchor_cable_segment.png` → `anchor_cable.png` | Cime tese: colonne 22-41 ripetute lungo la linea a qualsiasi angolo, periodo 63 righe (prima e ultima riga sono identiche); scorrono verso il nucleo, ferme con movimento ridotto | Giunzione tra riga 0 e riga 62: differenza media 1,85, contro 6,4 tra righe adiacenti. Ripetizione ruotata a 20°, 45° e 70° senza giunzioni visibili; in gioco su 390×844 e 844×390. |
| G12 | `VFX_anchor_sweep.png` → `anchor_sweep.png` | Corsia: riga 0 carica (0-0,69 s), riga 1 lock (0,69-1,25 s), riga 2 colpo per 0,32 s dopo `anchorSweep` | Banda x 16-575, y 16-79 in tutte le 12 celle, disegnata 1:1 sulla hitbox 560×64. Tempi presi da `ANCHOR_RULES` (1,25 × 0,55 = 0,6875), non inventati. Fasi distinte per forma anche in grigio (tratteggio, frecce, cima). Catture `lock` e `strike` nel verifier. |
| G5 | `RACE_ashdocks_cp_pylon_{attivo,superato}` → `race_cp_pylon{,_passed}.png`; `RACE_ashdocks_cp_tape_{attivo,superato}` → `race_cp_tape{,_passed}.png` | Checkpoint larghi (mezza larghezza > 100: `ash_docks`, `ash_night`): un pilone per lato e il nastro ripetuto ogni 63 colonne | Stati distinti per forma: lampada e chevron sui piloni, linguette e fori sul nastro. Prima e ultima colonna del nastro identiche. Cattura `checkpoint` del verifier gare. I checkpoint stretti restano sull'arco già integrato. |
| A2 | `race_count_beep.ogg`, `race_go.ogg` → `game/audio/v10/` | Bip a 3, 2 e 1 (nuovo evento `count` del modello di gara); «via» all'evento `start` (zero) | Test di modello: un solo bip per numero, 3 all'inizio, uno al secondo, via a 3 s. Bip: La 880 Hz, 0,22 s, attacco al primo campione, picco −2,95 dBFS. Via: accordo La-Do♯-Mi (880/1100/1319 Hz), 0,85 s, picco −3,09 dBFS. Nessun clic in coda. **Nessun ascolto umano: misure numeriche e analisi spettrale fatte da Claude, che non può ascoltare.** |

| G12 | `ARENA_anchor_cable_end.png` → `anchor_cable_end.png` | Chiude ogni cima sul bordo del nucleo | Era respinto (linea isolata a x 8, fuori asse di 13 px, 16 px vuoti). **Sistemato da Claude su richiesta dell'autore** con `tools/build_cable_end.py`: tolta la linea e il suo alone, terminale traslato di −14/+15 px (corpo su x 21–41, punta sulla riga 63). Nessun ridisegno. Verifier di The Anchor PASS a 390×844 e 844×390. |

### Conservati, non collegati

| Riga | File | Motivo |
|---|---|---|
| G8 | `ICON_h17_{normale,selezionata,non_disponibile}.png` | Controllo superato: quattro finestre distinte a 128 px e a 48 px, a colori e in grigio, lucchetto leggibile. Non collegate perché H-17 non si può ancora ottenere in campagna. |
| G7 | `lulu_arc7_reload.png` (consegna precedente) | Conservata come richiesto; non rifatta. |

### Respinti

| Riga | File | Motivo misurato in gioco | Correzione richiesta |
|---|---|---|---|
| G4 | `RACE_ashdocks_road_{day,night}.png` | Nessun bordo netto: le prime e le ultime quattro righe coincidono, quindi la tile si ripete ogni 1436 righe. In scorrimento però il ritmo del tratteggio si spezza una volta per tile: normalmente un trattino da 43 px ogni ~137 px, alla giunzione un trattino tronco di 8-17 px seguito da uno intero dopo soli 58 px. Il raccordo tecnico lascia anche una fascia di pixel stirati in verticale su cordoli e ringhiere (`astra-correzioni-20261027/G4-road-seam-rejected-390x844.png`). | Altezza della tile multipla del periodo del tratteggio (per esempio 1440 = 10 × 144), senza righe duplicate, e giunzione ridisegnata nel contenuto invece che stirata. Le gare restano sulla strada `driving_road`. |

### Aperti

- **G6/G7: sheet di tiro H-17 e ARC-7 e ricarica H-17.** Non consegnati. Con 4×4 celle in 1305×1205 e 1305×1285 (celle logiche 326,25×301,25 e 326,25×321,25), i piedi a y 299/300/319 lasciano 1-2 px sotto: non è possibile avere anche 12 px di margine inferiore. La proposta di Astra è mantenere le basi di runtime e applicare 12 px agli altri tre lati. **Decisione dell'autore: A** (D11). Basi di runtime invariate, 12 px sugli altri tre lati; richiesta in `astra/ISTRUZIONI_ASTRA_GIRO3.md`, punto 3. Resta aperto finché gli sheet non arrivano e superano il controllo. Gli sheet respinti in precedenza non vengono reinseriti. **La consegna nel suo insieme resta incompleta finché G6/G7 è aperto.**
- **A1 «Due colpi», cancelli di Aurelia Span, Veyra a piedi:** non richiesti in questo giro.
- Per tutte le righe integrate: revisione artistica umana, ascolto umano, mix su telefono e prova su un dispositivo Android.

### Prove di questo giro

- `npm test`: 202 test superati su 202. Nuovo test: `tests/racing-v9.test.mjs` (conto alla rovescia 3-2-1 e via a zero). I test di The Anchor sono invariati e passano.
- `tools/verify_anchor_browser.cjs` a 390×844 e 844×390: PASS, con le nuove catture `lock` e `strike`. Strisce aggiornate in `docs/evidence/v10.2/anchor-*-strip.png`.
- `tools/verify_hub_race_browser.cjs` a 390×844 e 844×390: PASS, con il controllo che vengano caricati bip, via, piloni e nastro, e la cattura `checkpoint`. Rapporti in `docs/evidence/v10.2/astra-correzioni-20261027/`.
- Regressione completa della campagna A (`tools/verify_campaign_browser.cjs`, pilota automatico): PASS, 31 passi, finale completo (`astra-correzioni-20261027/campaign-a-report.json`).
- Android: `AssetRoutes.java` e `tools/prepare_android_assets.py` includono i nuovi file. Nessuna prova su dispositivo.

## Giro 3 (richiesta revisione 4) — consegna incompleta

Ramo `delivery/astra-giro3-20261027`, commit `7c90967`: un solo file, `deliveries/astra-giro3-20261027/STATO_INCOMPLETO.md`. Astra ha verificato byte e SHA-256 dei due ZIP di richiesta (corrispondono a `INDICE.json` revisione 4) e dichiara di non consegnare alcun asset.

- **G6/G7 — aperti.** La decisione A risolve il conflitto sulle misure, ma il tentativo con il generatore sul riferimento `nox_vx9_gun` ha modificato anche il personaggio (nella regione della testa x 140–189, y 40–79, 1.865 pixel su 2.000 diversi dal riferimento) e gli effetti raggiungono celle adiacenti. Nessuno sheet, nessun rapporto per cella.
- **G4 — aperti.** Solo un master giorno intermedio 887×1774 senza segnaletica con giunzione ridipinta (differenza RGB 6,19 alla giunzione contro 5,84 tra righe adiacenti, misura sul master e non sul file finale). Nessuna esportazione 720×1440, nessuna segnaletica, nessuna notte.

Niente è stato integrato; nessun test di gioco, approvazione o ascolto dichiarato. Il gioco resta invariato: H-17/ARC-7 con gli sheet VX-9/R-12, gare con `driving_road`.
