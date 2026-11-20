# Piano di integrazione ambient — Atti I–IV (NON applicato)

Stato: file pronti sotto `/workspace/analisi_cap1/audio_ambient/`; **nessuna modifica al repo, nessun commit, build o PR**.
Regola di Loris: **un letto distinto per ogni luogo**, niente condivisioni fra posti diversi (stesso quartiere: hub + scontro nello stesso spazio vanno bene, es. Cathedral Quarter + `bone_tyrant`).
Ascolto umano obbligatorio prima di marcanti `APPROVED` in `AUDIO_REGISTER.json`.

Anteprime (loop concatenati, 1,2 s di silenzio fra un letto e l’altro), in `previews/`:

- `preview_atto1.ogg` — Cantiere / Ash Docks / Moon Refuge / fuga in auto (~56 s)
- `preview_atto2.ogg` — clinica / Porto delle Antenne / Cathedral Quarter (~38 s)
- `preview_atto3.ogg` — fonderia / bazaar / archivio EVE / binario Vega / vento Asse (~64 s)
- `preview_atto4.ogg` — vento Asse (`finale`) (~12 s)
- `preview_extra.ogg` — solo i 4 letti nuovi di questa tornata: cattedrale, bazaar, archivio, Vega (~51 s)

Moon Refuge (Atto I) è già stato corretto a TP **−1,35 dBTP**.

## Come funziona oggi (invariato nel repo)

- Motore: `game/audio-engine.mjs`. `MIX.ambience = 0.12`. Fade-in 1 s a gain **0.06**, fade-out 0,4 s, high-pass **380 Hz**. Segue lo slider **effetti**; tace se il suono è spento.
- Solo i kind `chrono_<nome>` con buffer suonano. `city`, `port`, `dark`, `drive` producono **0 nodi** (`tests/narrative-links-v10_3.test.mjs`).
- `preloadChrono(kind, extra[], ambience?)` legge `audio/chrono/<nome>.ogg`. Default attuali (da sostituire con override per tappa, non con un default di kind): `0 → old_town`, `1 → cathedral`, `2 → toxic_market`, `3 → clockwork`. Override già presenti: `below → necropolis`, hub `moon → refuge`.
- Se `def.ambience` è `'port'` (`exp_chalk_marks`) **vince e tace**. I drive chiamano `setAmbience('drive')` e restano muti. `collapse` non chiama preload/setAmbience.

Letti chrono di default nel gioco (8,00 s, ≈ −16,1 LUFS): `old_town`, `cathedral`, `toxic_market`, `clockwork`, `necropolis`, `refuge`. Non usarli come letto condiviso una volta cablati i nuovi file.

## Mapping proposto (un letto per luogo)

Cavo sempre per tappa: `preloadChrono(..., 'nome')` + `setAmbience('chrono_nome')`. Mai sostituire in blocco il default di un kind.

### Atto I — `final/`

| Luogo / tappa | File | Note |
|---|---|---|
| Cantiere Est — `blackout`, `app_yard`, `city` | `act1_blackout_cantiere.ogg` | stesso quartiere; `city` già passa dal chrono kind 0, non accendere il kind `'city'` |
| Ash Docks — `docks_veyra`, hub `ash_docks` | `act1_docks_veyra.ogg` | oggi usa `old_town` (sbagliato) |
| Moon Refuge — hub `moon` | `act1_moon_refuge.ogg` | override già presente |
| Fuga in auto — `escape` | `act1_escape_drive.ogg` | richiede `chrono_drive` e **modifica del test** su `'drive'`. Solo con OK esplicito. Gli altri drive (`app_breach`, `signal`, `evacuation`, `ring`, `tunnel`) non devono riusare questo letto: sono percorsi diversi, *ancora mancanti*. |
| `opening`, `home` | — | scene, senza letto di gameplay |

One-shot Atto I: `act1_thunder_distant.ogg`, `act1_relay_spark.ogg`, `act1_crane_groan.ogg`.

### Atto II — `final_acts2_4/`

| Luogo / tappa | File | Note |
|---|---|---|
| Distretto Clinico — `app_clinic`, `contagion`, hub `clinic_ward` | `act2_clinic_contagion.ogg` | non usare `toxic_market` |
| Porto delle Antenne — `breach`, `port`, hub `antenna_port` | `act2_port_antenne.ogg` | oggi `cathedral.ogg` (sbagliato) |
| Segni di gesso — `exp_chalk_marks`, hub `chalk_harbor` | `act2_port_antenne.ogg` *provvisorio* | oggi **silenzio** (`ambience:'port'`). Luogo affine al porto, ma per la regola «niente condivisioni» merita un letto proprio (*mancante*). Intanto non lasciare il silence: togliere `'port'` e usare un `chrono_*`. |
| Cathedral Quarter — hub `cathedral`, `bone_tyrant` | **`act2_cathedral_quarter.ogg`** (nuovo) | stesso spazio (navata). `bone_tyrant` è kind 2 e oggi prende `toxic_market`: override obbligatorio. Non condividere col porto. |
| Nodo Centrale — `app_node`, `zero`, hub `node_commons` | *mancante* (resta `clockwork.ogg` 8 s, condiviso col outpost) | |

### Atto III — `final_acts2_4/`

| Luogo / tappa | File | Note |
|---|---|---|
| Fonderia — `forge_behemoth` | `act3_forge.ogg` | distinta dal bazaar |
| Toxic Slum Bazaar — hub `toxic` | **`act3_toxic_bazaar.ogg`** (nuovo) | distinta da clinica e fonderia. LRA alta: da ascoltare. |
| Archivio EVE — `archive`, hub `deep_archive` | **`act3_eve_archive.ogg`** (nuovo) | distinta dalla clinica. `archive` oggi prenderebbe `toxic_market`. |
| Binario di Vega — `vega`, hub `sky_rail` | **`act3_vega_sky_rail.ogg`** (nuovo) | distinta da clockwork e dal vento Asse. |
| Asse (risalita) — `app_axis`, `ascent` | `act4_axis_wind.ogg` | vedi Atto IV: stesso letto oggi condiviso con `finale` / `axis_crown` (*da distinguere*). |
| Cantiere (ritorno) — `app_yard`, `city` | `act1_blackout_cantiere.ogg` | stesso luogo dell’Atto I |
| Porto spento — `port` | `act2_port_antenne.ogg` | stesso Porto delle Antenne |
| `below` / Livelli bassi, hub `lower_hearth` | *mancante* upgrade di `necropolis.ogg` 8 s | tenere l’override `necropolis`; il fallback `'dark'` è silenzioso |
| Glass Flood — `glass_flood`, `glass_reaper`, hub `glass_terrace` | *mancante* | oggi cadrebbero su `cathedral.ogg` (kind 1). Non usare il letto porto nemmeno come tappabuchi, se si rispetta «un letto per luogo». |
| Clockwork Outpost — hub `clockwork` | *mancante* (upgrade degli 8 s) | distinto dal Nodo Centrale |
| `line` (Distretto Clinico, kind 3) | *mancante* | oggi `clockwork.ogg`; non è la corsia di `contagion` né il Nodo |
| `ring`, `tunnel` | drive, *mancanti* | non riusare `act1_escape_drive` |
| `app_port` | scene | lasciare |

### Atto IV

| Luogo / tappa | File | Note |
|---|---|---|
| Piattaforma / `finale`, hub `axis_crown` | `act4_axis_wind.ogg` | per ora; distinto da `ascent` sarebbe meglio (*mancante* variante piattaforma) |
| `collapse` (tipo `escape`) | *mancante* (crollo) | oggi nessuna chiamata a setAmbience; non lasciare il letto della tappa prima. Aggiungere preload in `startCollapse()`. |
| Scene finali | — | lasciare |

## Volume, loop, peso

- Letti II–IV nuovi: 11,75 s (12 s meno crossfade equal-power 250 ms), OGG Vorbis q5, 48 kHz mono, I circa −18/−19 LUFS, TP ≤ −1 dBTP. Il motore fa già `source.loop = true`.
- High-pass a 380 Hz: da riascoltare su vento, bazaar, cattedrale.
- **`app.js` 524 288 B:** l’audio resta fuori. Solo override di path (nomi unici dopo il flatten).
- **APK:** gli 8 letti in `final_acts2_4/` pesano circa **865 KB**. Con l’Atto I (~565 KB) il pacchetto ambient nuovo è circa 1,4 MB lordi, meno i vecchi 8 s sostituiti. Non risolve il CI da 113,94 MB; non usare WAV.

## Cosa manca ancora (budget)

Questa tornata: **12 crediti** su un tetto di 14 (riserva lasciata: 3,25). Un letto da 12 s costa 3 crediti. Restano, in ordine utile:

1. **Glass Flood / `glass_terrace`** (priorità della lista, non entrata nel tetto)
2. **Clockwork Outpost** (hub `clockwork`) e **Nodo Centrale** (`zero`, `app_node`, `node_commons`) — due letti distinti, non uno solo
3. `below` / necropolis / `lower_hearth` (upgrade, e se sono due luoghi vanno due letti)
4. `line` (corsia/linea clinica, distinta da contagion e dal Nodo)
5. `exp_chalk_marks` / `chalk_harbor` se non si accetta il riuso del porto
6. Variante piattaforma `finale` / `axis_crown` distinta da `ascent`
7. Letto di crollo per `collapse`
8. Drive distinti (`app_breach`, `signal`, `evacuation`, `ring`, `tunnel`)
9. One-shot (orologi cattedrale, pompe bazaar, nastro archivio, ticchettio rotaia, vetro/piena, meccanismi del Nodo)

Per chiudere i punti 1–2 servono **9 crediti** (3 letti). Per 1–4 circa **15 crediti**. Non marcate `APPROVED` senza ascolto. Non unire PR, non pubblicare, non toccare `applicationId`, firma, chiavi, `versionCode`.
