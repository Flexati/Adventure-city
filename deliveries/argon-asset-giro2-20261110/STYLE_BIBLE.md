# CHRONOS ADVENTURE: NOX & LULÙ — STYLE BIBLE & STUDIO PRE-PRODUCTION GATES

- **[Producer]** Ambito: Reverse Engineering completo (Fase 0), Pre-Production Gates (Fase 1), Stato Produzione (Fase 2), Rifacimento Intro JaguarzCreatorz (Pilota) e Manifesto Audio (104 asset). `COMMERCIAL_RELEASE = BLOCKED` `[FATTO]` (`docs/gold/STATO.md`).
- **[QA]** Fonti verificate nel repository (`[FATTO]`): `docs/gold/STATO.md`, `docs/gold/CONSEGNA_ARGON_20261109_ESITO.md`, `docs/gold/CONSEGNA_ARGON_GIRO2_20261110_ESITO.md`, `docs/gold/CONSEGNA_ARGON_GIRO3_20261111_ESITO.md`, `docs/gold/ASSET_REGISTER.json`, `assets/production/v10.3/derived/REGISTRO_ARGON_*.json`, `docs/design/v10.3/CHRONOS_FASE_1_BENCHMARK.md`, `docs/design/v10.3/CHRONOS_ARTE_P1_STILE.md`, `docs/gold/INTRO.md`, `docs/gold/DECISIONI.md`.

---

## 1. PALETTE, COLORI RISERVATI E GERARCHIA DI CONTRASTO (`[Art Director]`)

### 1.1 Colori Identitari Riservati (`P4`, `CHRONOS_ARTE_P1_STILE.md:147-155` `[FATTO]`)
Si misurano sui pixel con aspetto da segnale (`S ≥ 0.35`, `V ≥ 0.90` in HSV). Nessun asset ambientale o nemico può superare l'`1%` nei colori riservati altrui (pericolo `≤ 5%` sul corpo dei nemici):

| Ruolo / Segnale | Tonalità HSV | Codici Esadecimali Ufficiali `[FATTO]` | Regola d'Uso |
|---|---|---|---|
| **Nox (Protagonista Maschile, D07)** | `175°–200°` | `#6BDDFF` (UI/Giro 3), `#7DF0F4` (effetti codice) | Riservato a Nox, HUD e accenti primari UI. Su nemici e ambienti `≤ 1%`. |
| **Lulù (Protagonista Femminile, D07)** | `275°–325°` | `#FF7FD8`, `#E4A4FF` | Riservato a Lulù, HUD e accenti secondari/energia UI. Su nemici e ambienti `≤ 1%` (in `shadow_reaper` il nucleo usa `#6A4ED8` viola-blu fuori banda). |
| **Pericolo / Minaccia / Telegraph** | `340°–40°` | `#FF6343`, `#FF997B`, `#FFB74B`, `#FF6A8A` | Cerchi di avviso, proiettili, attacchi. Sui nemici `≤ 5%`; sugli ambienti `≤ 1%`. |
| **Interattivo / Nodi / Porte** | `140°–170°` | `#7DFFD0` | Pulsante ATTIVA, nodi, soglie porte. Altrove `≤ 1%`. |
| **Fondale UI / Vetro Notturno** | — | `#0B1626` (base), `#050B14` (ombra), `#EDF7FF` (testo/luce) | Materiale base dell'interfaccia premium a 5,99 €. |

### 1.2 Schede d'Identità dei Distretti e Villaggi (`[Environment Artist]`, Fase 1 Gate)

| Distretto / Hub | Palette Dominante (Hex) `[FATTO]` | Linguaggio di Forma | Landmark Centrale (`768, 768`) `[FATTO]` | Materiali Principali |
|---|---|---|---|---|
| **Moon Refuge (`moon`)** | `#0E242B`, `#1F5C68`, `#48B8C0`, `#D89A3A` | Archi ribassati, paratie stagne, binari sotterranei | Pozzo Lunare con lampade d'ottone | Lastricato umido, lamiere riparate, ottone caldo |
| **Cathedral Quarter (`cathedral`)** | `#241C18`, `#6E6458`, `#C8C0B0`, `#8A1E2A`, `#5E8A80` | Archi acuti gotici, contrafforti, teche reliquiario | Rosone lapideo a 8 raggi e campane di bronzo | Pietra chiara scolpita, avorio d'archivio, bronzo ossidato |
| **Toxic Slum Bazaar (`toxic`)** | `#1E1A1E`, `#3A3438`, `#6E8A3A`, `#A8D86A`, `#C8822E` | Tubazioni cilindriche, serre a cupola, palafitte | Vasca di decantazione bio-chimica | Ghisa arrugginita, vetro di serra, spore verde lime |
| **Clockwork Outpost (`clockwork`)** | `#1A1428`, `#3E2E58`, `#C8822E`, `#D89A3A`, `#6A4ED8` | Ruote dentate concentriche, cupole di rame, torri a molla | Astrolabio / Ingranaggio Madre senza numeri | Pietra viola scura, ottone brunito, rame martellato |
| **Solkara Desert (Gare)** | `#3A2618`, `#8C5A32`, `#D89A3A`, `#26262A` | Reti frangivento, dune diagonali, stazioni di pompaggio | Reti all'ultimo checkpoint (`race_solkara_reti_day`) | Asfalto consumato a 5 corsie (64% centrale), sabbia ocra |
| **Aurelia Span (Gare)** | `#163848`, `#388898`, `#C8963E`, `#D8D0C0` | Cavi sospesi, piloni con ingranaggi a vista senza cifre | Torri del ponte sospeso sull'acqua turchese | Pietra chiara, parapetti d'ottone, asfalto centrale |

---

## 2. CONTORNO, LUCE, SCALA E ARCHITETTURA RUNTIME (`[Technical Artist]`)

1. **Densità e Scala (`S1`, `S2`, `CHRONOS_ARTE_P1_STILE.md:114-129` `[FATTO]`):**
   - Mondo di gioco: `1536 × 1536` unità (`game/scenery.mjs:4`); 1 tile = `64` unità (`game/layouts.mjs:2`).
   - Densità target per tutti i nuovi asset: **`1,25 px/unità` ±15%** (`1,06–1,44 px/u`).
   - Altezze sorgente e celle di runtime:
     - **Civile (`88 u`):** altezza `110 px` in cella `128×128 px` (nel mondo disegnato a `72 px` in `chronoEnemyHeight`).
     - **Nemico base (`104 u`):** altezza `130 px` in cella `160×128 px` (foglio derivato `1280×384`, 8 colonne × 3 righe, piedi allineati a `y = 120`, `REGISTRO_ARGON_GIRO3_20261111.json` `[FATTO]`).
     - **Nemico grosso / Bruto (`132 u`):** altezza `165 px` in cella `160×128` o `192×192` (disegnato a `92 px` nel mondo).
     - **Boss (`230 u`, D28/D30):** altezza **`288 px`** in cella **`320×320 px`** (atlante derivato `2560×1280`, 8×4 = 28 fotogrammi attivi).
     - **Nox e Lulù V8 (`112 u`):** altezza `301,5 px` (densità `2,69 px/u`). **Bloccati ed esenti da ridisegno** (Regola 5 `CLAUDE.md` `[FATTO]`).
2. **Contorno (`C1–C3` `[FATTO]`):**
   - Spessore di **`2 px`** per tutte le entità mobili (nemici, boss, proiettili grandi = `1,9 arcominuti` a 30 cm su schermo da 6"); `1 px` per linee interne e prop `≤ 48 px`.
   - Luminanza mediana della fascia di bordo `≤ 0,5×` la luminanza mediana interna (`C2`), usando il tono più scuro della rampa del materiale (`C3`, nero puro `RGB ≤ 8` non oltre il `10%`).
3. **Direzione della Luce e Gradini Tonali (`L1–L4`, `P3` `[FATTO]`):**
   - Unica sorgente luminosa dall'**alto a sinistra** (`L1`, rapporto luminanza alto-sx / basso-dx `≥ 1,10`).
   - Da **3 a 5 toni** per materiale con salto di luminosità `ΔL* ≥ 8` tra gradini (`P3`), spostando le ombre di `10°–30°` verso il blu-viola e le luci di `5°–20°` verso l'ambra.
   - **Nessuna ombra a terra dipinta nello sprite (`L3`):** il motore disegna già l'ellisse nera al `44%` (`game/runtime.mjs:866` `[FATTO]`).
4. **Trasparenza e Fondali di Consegna (`[Technical Artist]` `[FATTO]`):**
   - Tavole grezze: fondo piatto magenta `#FF00FF` per nemici, UI, edifici e prop; fondo piatto verde `#00FF00` per i boss; opaco per interni (`1920×1080` → derivato `1280×720` WebP), ritratti (`768×1024` → derivato `375×500` JPEG), strade gara (`1024×2048` → derivato `720×1440` WebP), terreni (`1024×1024`) e schede atto (`2048×1152` → derivato `1280×720` WebP).
   - Nei derivati di runtime l'alfa è **binaria (`0` o `255`)** con rimozione del magenta/verde e despill sui bordi (`tools/derive_argon_giro2_20261110.py` `[FATTO]`).
5. **Composizione delle Mappe Dipinte a Runtime (`[Environment Artist]` `[FATTO]`):**
   - I distretti d'azione (`game/scenery.mjs`) non montano micro-tile isolati a scacchiera: usano un pavimento continuo scuro a bassa frequenza visiva (`alpha = 0.50` con variazioni `vHash`), i **4 quadranti architettonici dipinti completi** (`864×864`) lungo gli isolati perimetrali (`x < 4`, `x > 19`, `y < 4`, `y > 19`), e prop completi (`district_props.png`) sulle isole di copertura `2×2`.
   - I margini fuori mappa (`drawMapBackdrop` in `game/runtime.mjs`) ripetono in scala `1:1` le 2 file perimetrali esterne oscurate da `#04081078`.

---

## 3. REGOLE DI RIFIUTO ESPLICITE RICAVATE DAGLI ESITI DEI GIRI 1, 2 E 3 (`[QA & Art Director]`)

Ogni difetto riscontrato in `CONSEGNA_ARGON_20261109_ESITO.md`, `CONSEGNA_ARGON_GIRO2_20261110_ESITO.md` e `CONSEGNA_ARGON_GIRO3_20261111_ESITO.md` è convertito in un gate bloccante:

| ID Regola | Difetto Storico Accertato (`[FATTO]`) | Regola di Rifiuto Bloccante |
|---|---|---|
| **R-01** | Giro 1 (165 immagini scartate): figure geometriche tracciate da script (rettangoli, cerchi, poligoni, PNG `1–62 KB`). | **Rifiuto immediato** di qualsiasi immagine generata da codice (Python/PIL/Canvas/SVG) o con peso PNG `< 150 KB` per tavole `1536×1024`. |
| **R-02** | Giro 1 (Gruppo H): fotogrammi copiati dal foglio esistente, schiacciati in altezza o con `v2` identica pixel per pixel. | **Rifiuto immediato** di qualsiasi posa ottenuta scalando/copiando frame esistenti. Ogni posa deve essere ridisegnata dal modello neurale. |
| **R-03** | Giro 2 (`N/gang_breaker_b.png`): scritta «CAUTION» leggibile sullo scudo (Regola 9 `CLAUDE.md`). | **Zero testo, lettere, cifre arabe o numeri romani** su scudi, casse, insegne, schermi, armadietti o quadranti d'orologio (controllo a zoom `2×`). |
| **R-04** | Giro 2 (`N/gang_breaker_b.png`, `N/gang_signal_b_v2.png`): il foglio `_b` mostrava un personaggio diverso dal foglio `_a`. | **Blocco d'identità obbligatorio (`_a` ↔ `_b`):** il foglio `_b` deve essere generato passando il foglio `_a` approvato in `ImagePaths`. |
| **R-05** | Giro 3 (`B/forge_behemoth_b.png` scartato): robot d'acciaio grigio invece del golem di bronzo/ottone di `_a, _c, _d`. | **Coerenza materiale Boss:** ogni tavola `A/B/C/D` di un boss deve mantenere gli stessi materiali e colori base del Model Sheet (`_a`). |
| **R-06** | Giro 3 (`B/bone_tyrant_a…d` annotato): in `_a` clava d'ossa a due mani, in `_b…d` mazza tonda con scudo. | **Coerenza d'arma ed equipaggiamento:** nessun personaggio può cambiare arma o aggiungere/togliere uno scudo tra i fogli `_a, _b, _c, _d` (**corretto in Lotto 2 per `bone_tyrant_b` e `bone_tyrant_c`**). |
| **R-07** | Giro 2 (`P/prova_strada.png`, `S/strada_aurelia_tramonto.png`): carreggiata convergente in prospettiva. | **Proiezione rigorosa dall'alto per le strade gara:** il `64%` centrale deve mantenere larghezza costante da bordo alto a bordo basso. |
| **R-08** | Baseline Boss 128 px (`D30`): `toxic_forge_behemoth` aveva `1.198` pixel con alone verde sul bordo. | **Despill cromatico obbligatorio:** rimozione completa dell'alone `#00FF00` / `#FF00FF` e alfa binaria (`0` o `255`) nel derivato. |
| **R-09** | Intro attuale (`game/video/jaguarzcreatorz-*.mp4`): giaguaro chiuso in un riquadro rettangolare con fulmini troncati ai bordi. | **Full-bleed fino ai 4 margini:** per le key art `16:9` e `9:16` nessun riquadro interno, nessun fulmine tagliato prima del bordo tela, testo sempre su livello trasparente separato. |

---

## 4. METODO DEI BENCHMARK APPLICATO A CHRONOS (`[Art Director & Lead Character Artist]`)

In conformità a `CHRONOS_FASE_1_BENCHMARK.md` e `CHRONOS_ARTE_P1_STILE.md` `[FATTO]`:
1. **Dead Cells (Gerarchia di contrasto a 3 livelli):** Terreno calmo e scuro (basso contrasto) < Oggetti interattivi e coperture (contrasto medio) < Personaggi, Boss e Telegraph di minaccia (saturazione e contrasto massimi).
2. **Hyper Light Drifter (Leggibilità della sagoma a 32 px prima del colore):** Ogni nemico e boss viene verificato in maschera nera a `32 px` d'altezza (`Sil1`: `IoU ≤ 0,75` tra personaggi nella stessa scena, `IoU ≤ 0,85` tra posa di guardia e posa di preparazione `Sil4`).
3. **Katana Zero (Luce d'accento controllata per unificare asset diversi):** Un'unica direzione di luce (alto-sinistra) e filetti speculari controllati nei colori del distretto unificano tavole generate in sessioni diverse («Controlled neon, not neon everywhere»).
4. **Hades (Il ritratto/Model Sheet come fonte unica d'identità):** I fogli d'azione/reazione e le espressioni del Gruppo V derivano direttamente dal ritratto/foglio base approvato passandolo come immagine di riferimento (`ImagePaths`), mai inventando il personaggio da zero.
5. **Children of Morta & Grimvalor (Ergonomia Touch Mobile a 360–430 px):**
   - **Specifica Mobile UI (`[UI/UX Artist]`, Fase 1 Gate):**
     - Bersaglio touch minimo: **`48 × 48 dp`** (`≥ 9 mm` fisici su schermi `360–430 px` di larghezza CSS).
     - Spessore minimo del tratto delle icone: **`2 px` a dimensione reale sullo schermo** (nessuna filigrana interna di 1 px che svanisce riducendo da `2048×1024` a `36–44 px`).
     - Quattro stati distinguibili **anche in scala di grigi (senza colore):** Riposo (bordo standard), Premuto (traslazione in basso di `2 px` + luce interna), Selezionato (doppio bordo esterno luminoso + indicatori d'angolo), Disattivato (opacità ridotta, bordo spezzato/spento).

---

## 5. ELENCO DEGLI ASSET ACCETTATI (DA NON RIGENERARE) E DEGLI ID MANCANTI (`[Producer & QA]`)

### 5.1 Asset Già Integrati o Accettati — VIETATO RIGENERARE (`[FATTO]`)
1. **Giro 1 (`REGISTRO_ARGON_20261109.json`):**
   - **15 Interni dipinti in prima persona (`game/art/interiors/*.webp`):** 4 Moon Refuge, 4 Cathedral Quarter, 4 Toxic Bazaar, 3 Clockwork Outpost.
   - **8 Ritratti NPC (`game/art/npc/svc_*.jpg`):** `moon_shop`, `cathedral_smith`, `cathedral_info`, `toxic_smith`, `clockwork_shop`, `clockwork_relic`, `clockwork_info`, `cathedral_gate_guard`.
2. **Giro 2 (`REGISTRO_ARGON_GIRO2_20261110.json` + R17):**
   - **8 Tegole Strada Gare (`720×1440` WebP):** `race_solkara_convogli_day`, `race_solkara_pozzo_day`, `race_solkara_reti_day`, `race_solkara_convogli_storm`, `race_solkara_pozzo_storm`, `race_aurelia_campata_day`, `race_aurelia_torri_day`, `race_aurelia_torri_dusk`.
   - **Atlante Auto Giocatore:** `race_vortex_car` (`S/auto_vortex.png`, 8 viste).
   - **Segnalatore Gang (`R17 / D56`):** `game/art/chrono/gang_signal.png` (da `N/gang_signal_a.png` + `N/gang_signal_b.png`).
   - **Terreno Porto:** `T/terreno_porto.png` (`= P/prova_terreno.png`).
3. **Giro 3 (`REGISTRO_ARGON_GIRO3_20261111.json` + `CONSEGNA_ARGON_GIRO3_20261111_ESITO.md`):**
   - **5 Nuovi Archetipi Nemici Integrati in R18 (`632f8b3`):**
     - `enemy.gang_shooter` → `game/art/chrono/gang_shooter.png`
     - `enemy.gang_breaker` → `game/art/chrono/gang_breaker.png`
     - `enemy.alien_breaker` → `game/art/chrono/alien_breaker.png`
     - `enemy.infected_brute` → `game/art/chrono/infected_brute.png`
     - `enemy.port_patrol` → `game/art/chrono/port_patrol.png`
   - **4 Schede Atto Integrate in R18 (`632f8b3`):** `act.card.1..4` → `game/art/atti/atto_1..4.webp`.
   - **2 Archetipi Nemici Accettati in Attesa di Slot nel Codice:** `N/gang_brute_a.png` + `N/gang_brute_b.png`, `N/alien_brute_a.png` + `N/alien_brute_b.png`.
   - **8 Tavole Interfaccia Premium (Gruppo U, accettate in `CONSEGNA_ARGON_GIRO3_20261111_ESITO.md`):** `U/ui_pulsanti.png`, `U/ui_pulsanti_tondi.png`, `U/ui_cornici.png`, `U/ui_icone_azione.png`, `U/ui_icone_menu.png`, `U/ui_hud.png`, `U/ui_medaglie.png`, `U/ui_emblema.png`.
   - **11 Tavole Terreno, Palazzi e Oggetti (Gruppo T, accettate in `CONSEGNA_ARGON_GIRO3_20261111_ESITO.md`; verificate a zoom 1:1 in Lotto 2 senza cifre o lettere):** `T/terreno_cantiere.png`, `T/terreno_clinica.png`, `T/terreno_nodo.png`, `T/palazzi_moon.png`, `T/palazzi_cathedral.png`, `T/palazzi_toxic.png`, `T/palazzi_clockwork.png`, `T/oggetti_cantiere.png`, `T/oggetti_porto.png`, `T/oggetti_clinica.png`, `T/oggetti_nodo.png`.
   - **10 Tavole Boss Accettate/Allineate (Gruppo B):**
     - `B/bone_tyrant_a.png`, `B/bone_tyrant_b.png` (rigenerata in Lotto 2 con clava d'ossa a due mani e senza scudo), `B/bone_tyrant_c.png` (rigenerata in Lotto 2 con clava d'ossa a due mani e senza scudo), `B/bone_tyrant_d.png`.
     - `B/forge_behemoth_a.png`, `B/forge_behemoth_c.png`, `B/forge_behemoth_d.png`.
     - `B/shadow_reaper_a.png`, `B/shadow_reaper_b.png`, `B/shadow_reaper_c.png`.
   - **Pilota Intro JaguarzCreatorz (Lotto 2):** `JAGUAR_INTRO/jaguar_logo_model_sheet.png`, `JAGUAR_INTRO/jaguar_mark_1color_64px.png`, `JAGUAR_INTRO/wordmark_layer_16x9.png`, `JAGUAR_INTRO/wordmark_layer_9x16.png`.

### 5.2 Elenco Esatto degli ID Ancora Mancanti in Coda (Bloccati da Quota Giornaliera Modello Immagini)
1. **Priorità A — Boss (`2` tavole obbligatorie + `1` opzionale):**
   - `B/shadow_reaper_d.png` (mancante per quota; 4 pose sconfitta/atterramento derivate da `shadow_reaper_a.png`).
   - `B/forge_behemoth_b.png` (da rigenerare da `forge_behemoth_a.png` come golem di bronzo/ottone per sostituire la versione grigia scartata in ESITO Giro 3).
   - `B/bone_tyrant_d.png` (opzionale: già priva di scudo e coerente per armatura, per sostituire la mazza tonda caduta a terra con la clava d'ossa di `_a, _b, _c`).
2. **Task Speciale — JaguarzCreatorz Studio Intro (`2` Key Art full-bleed dopo approvazione del Model Sheet pilota):**
   - `JAGUAR_INTRO/jaguar_intro_keyart_16x9.png` (`1920×1080`, full-bleed senza riquadro, da combinare con `wordmark_layer_16x9.png`).
   - `JAGUAR_INTRO/jaguar_intro_keyart_9x16.png` (`1080×1920`, full-bleed senza riquadro, da combinare con `wordmark_layer_9x16.png`).
3. **Priorità D — Famiglie Rimanenti (`M`, `V`, `G`, `F` — `40` tavole PNG):**
   - **Gruppo M (6):** `M/menu_citta.png`, `M/menu_citta_luci.png`, `M/apertura_1.png`, `M/apertura_2.png`, `M/apertura_3.png`, `M/apertura_4.png`.
   - **Gruppo V (16):** `moon_shop_occhi.png`, `moon_shop_parla.png`, `cathedral_smith_occhi.png`, `cathedral_smith_parla.png`, `cathedral_info_occhi.png`, `cathedral_info_parla.png`, `toxic_smith_occhi.png`, `toxic_smith_parla.png`, `clockwork_shop_occhi.png`, `clockwork_shop_parla.png`, `clockwork_relic_occhi.png`, `clockwork_relic_parla.png`, `clockwork_info_occhi.png`, `clockwork_info_parla.png`, `cathedral_gate_guard_occhi.png`, `cathedral_gate_guard_parla.png`.
   - **Gruppo G (12):** `gesti_innkeeper.png`, `gesti_merchant.png`, `gesti_blacksmith.png`, `gesti_relic_priestess.png`, `gesti_alchemist.png`, `gesti_informant.png`, `gesti_gate_guard.png`, `gesti_child.png`, `gesti_mechanic.png`, `gesti_elder.png`, `gesti_worker.png`, `gesti_wanderer.png`.
   - **Gruppo F (6):** `anim_fuoco.png`, `anim_acqua.png`, `anim_aria.png`, `anim_luce.png`, `anim_meccanica.png`, `anim_vita.png`.
4. **Gruppo A — Audio (`104` file `.ogg`):**
   - Specificati integralmente in `A/AUDIO_MANIFEST_104.json` e `A/CONSEGNA.md` (`MISSING_NO_AUDIO_MODEL`).
