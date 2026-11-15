# ARGON — Consegna Sprint Arte 01 (Vertical Slice)

**Progetto:** Chronos Adventure (Nox & Lulù) — studio Jaguars Builds Creators  
**Destinatario:** Game Director / Team di Integrazione  
**Data Consegna:** 14 novembre 2026  
**Cartella Consegna:** `deliveries/argon-sprint-arte-01-20261114/`  
**Manifest Tecnico:** `deliveries/argon-sprint-arte-01-20261114/MANIFEST_SPRINT_01.json`

---

## 0. Assunzioni Dichiarate in Cima (Sezioni 0.5, 1 e 4 del Brief)

In conformità alla regola 0.5 e alla sezione 1 (*Bibbia visiva minima*), si dichiarano in testa tutte le assunzioni adottate per le voci marcate **[DA CONFERMARE]** dal Game Director:

1. **Stile visivo (`[DA CONFERMARE]`):** Adottata pixel art stilizzata a 16-bit dipinta ad alto contrasto coerente con la famiglia `chrono_shadows`, con **contorno scuro netto (1–2 px, luminanza < 26/255)**, **luce principale in alto a sinistra** e ombre fredde morbide verso il basso a destra.
2. **Altezza di riferimento personaggi (`[DA CONFERMARE]`):** Confermata e applicata l'altezza di riferimento di **288 px** per la figura opaca dentro una **cella di 320×320 px** (margine di sicurezza di 16 px sopra e 16 px sotto, piedi ancorati a `y = 304 px` della cella), su una griglia di **6 colonne × 5 righe (`1920×1600 px`)**.
3. **Accenti cromatici riservati:**
   - **Nox (Peso e Impatto):** Ciano luminoso **`#6BDDFF`** applicato esclusivamente alla canna dell'arma e al nucleo del guanto tattico su cappotto pesante ardesia/ossidiana.
   - **Lulù (Risonanza e Scudo):** Magenta-rosa complementare **`#FF7FD8`** applicato esclusivamente all'emettitore di risonanza, alla sciarpa energetica e all'anello dello scudo armonico.
   - **Fondo mondo Vanta:** Blu notte profondo **`#0B1626`** e quasi-bianco **`#EDF7FF`**, fino a un massimo di 16 toni dominanti per hub.
4. **Distinzione delle silhouette:** Verificata tramite la tavola di controllo `prova_silhouette_nox_lulu_v01.png` (`640×320 px`), che mostra Nox (postura larga, baricentro basso, spalle corazzate) e Lulù (postura slanciata, sciarpa dinamica e cappotto svasato) affiancati in nero pieno `#0B1626` su fondo chiaro `#EDF7FF`.
5. **Geometria calpestabile 24×24:** Per lo sfondo di apertura `bg_cantiere_apertura_v01.webp` (`1536×1536 px`) viene consegnata a parte la tavola tecnica per il programmatore `bg_cantiere_apertura_calpestabile_v01.png` (`1536×1536 px`, griglia `24×24` da `64×64 px`), con le zone calpestabili in colore piatto ciano, gli ostacoli perimetrali in rosso e la cassa illuminata (punto focale) in ambra.

---

## 1. Consegne Singole con Brief (Sezione 3) e Checklist (Sezione 4)

### 5.1 Nox — Sprite Sheet Base (`nox_sheet_base_v01.png`)

```
ASSET: nox_sheet_base_v01.png
USO IN GIOCO: Protagonista maschile (peso e impatto); compare nell'apertura al cantiere, nell'Hub Moon e nello scontro con The Anchor (scalato dal motore a partire dal master di 288 px).
DIMENSIONE FINALE: 1920 × 1600 px (griglia 6 colonne × 5 righe, cella 320 × 320 px, figura 288 px)
FORMATO: PNG alpha (RGBA, sfondo trasparente senza aloni)
STATI RICHIESTI: normale (idle, camminata, spara, schiva) + colpito (2 frame nella riga 5, con flash d'impatto sul frame 2)
FRAME / GRIGLIA: 20 pose attive su griglia 6×5 (cella 320×320 px): Riga 1 idle (4 frame), Riga 2 camminata (6 frame), Riga 3 spara (4 frame), Riga 4 schiva (4 frame), Riga 5 colpito (2 frame)
SILHOUETTE: Spalle larghe, baricentro basso, cappotto tattico pesante; distinguibile immediatamente da Lulù in nero pieno.
PALETTE: Ardesia scuro #1B2636, ossidiana #0B1626, cuoio freddo #2E3D52, unico accento neon ciano #6BDDFF sull'arma e sul guanto.
LUCE: Principale in alto a sinistra, ombre morbide in basso a destra.
DA EVITARE: Testo, loghi, armi che coprono il volto/corpo, pose ambigue, dettagli sub-pixel illeggibili su telefono.
RIFERIMENTO TECNICO: Gerarchia cromatica a 3 livelli (sfondo scuro < corpo < accento neon dell'arma) e leggibilità della sagoma a dimensione ridotta.
```

**Checklist di consegna — `nox_sheet_base_v01.png`:**
- [x] Dimensioni esattamente come richieste (`1920×1600 px`, cella `320×320 px`, h personaggio `288 px`)
- [x] Nessun testo, logo o firma nell'immagine
- [x] Sfondo trasparente dove richiesto, senza aloni chiari sui bordi
- [x] Letto bene su sfondo chiaro **e** scuro
- [x] Silhouette riconoscibile in nero pieno (`prova_silhouette_nox_lulu_v01.png`)
- [x] Stati `normale` e `colpito` presenti dove richiesti (Riga 5, 2 frame)
- [x] Stesso stile e stessa palette degli altri asset dello sprint
- [x] Nome file in snake_case con versione (`nox_sheet_base_v01.png`)
- [x] Voce aggiunta al manifest (`881.515 B`, SHA-256 `7c38e0c4509aef51f439ed9923794df202c400207a9793aa938c2e3051bc6133`)
- [x] Assunzioni dichiarate in cima alla risposta

---

### 5.2 Lulù — Sprite Sheet Base (`lulu_sheet_base_v01.png`)

```
ASSET: lulu_sheet_base_v01.png
USO IN GIOCO: Protagonista femminile (risonanza e scudo); compare nell'apertura, nell'Hub Moon, nelle combo Due Colpi e contro The Anchor.
DIMENSIONE FINALE: 1920 × 1600 px (griglia 6 colonne × 5 righe, cella 320 × 320 px, figura 288 px)
FORMATO: PNG alpha (RGBA, sfondo trasparente senza aloni)
STATI RICHIESTI: normale (idle, camminata, marca, scudo) + colpito (2 frame nella riga 5, con flash d'impatto sul frame 2)
FRAME / GRIGLIA: 20 pose attive su griglia 6×5 (cella 320×320 px): Riga 1 idle (4 frame), Riga 2 camminata (6 frame), Riga 3 marca (4 frame), Riga 4 scudo (4 frame), Riga 5 colpito (2 frame)
SILHOUETTE: Figura slanciata, sciarpa flottante laterale e lembi del cappotto svasati; contrasto netto con la sagoma massiccia di Nox.
PALETTE: Blu notte #162238, grigio argento #7A8CA8, unico accento neon complementare magenta-rosa #FF7FD8 riservato a sciarpa/risonanza e scudo.
LUCE: Principale in alto a sinistra, ombre morbide in basso a destra.
DA EVITARE: Testo, loghi, sovrapposizione dello scudo sul volto, somiglianza di sagoma con Nox.
RIFERIMENTO TECNICO: Contrasto di silhouette in coppia (pesante/largo vs agile/slanciato) e anello di scudo cavo per non coprire i telegraph nemici.
```

**Checklist di consegna — `lulu_sheet_base_v01.png`:**
- [x] Dimensioni esattamente come richieste (`1920×1600 px`, cella `320×320 px`, h personaggio `288 px`)
- [x] Nessun testo, logo o firma nell'immagine
- [x] Sfondo trasparente dove richiesto, senza aloni chiari sui bordi
- [x] Letto bene su sfondo chiaro **e** scuro
- [x] Silhouette riconoscibile in nero pieno e distinta da Nox (`prova_silhouette_nox_lulu_v01.png`)
- [x] Stati `normale` e `colpito` presenti dove richiesti (Riga 5, 2 frame)
- [x] Stesso stile e stessa palette degli altri asset dello sprint
- [x] Nome file in snake_case con versione (`lulu_sheet_base_v01.png`)
- [x] Voce aggiunta al manifest (`556.538 B`, SHA-256 `f9f01e82ba34110a480d1c616c83d89105026d27a9fcd69021d92a3b0514cd12`)
- [x] Assunzioni dichiarate in cima alla risposta

---

### 5.3 Effetti Due Colpi (`vfx_due_colpi_v01.png` + 4 strisce dedicate)

```
ASSET: vfx_due_colpi_v01.png (+ vfx_due_colpi_marca_v01.png, vfx_due_colpi_chiusura_v01.png, vfx_due_colpi_rimbalzo_v01.png, vfx_due_colpi_scudo_spezzato_v01.png)
USO IN GIOCO: Feedback visivo immediato (< 0,5 s) del verbo centrale "Due Colpi": Primo Colpo marca il bersaglio, Secondo Colpo chiude il circuito, rimbalza tra due nemici o spezza lo scudo.
DIMENSIONE FINALE: Master 1536 × 768 px (4 righe da 192 px) + 4 strisce singole: marca (1152×192 px, 6 frame), chiusura (1536×192 px, 8 frame), rimbalzo (1536×192 px, 8 frame), scudo spezzato (1152×192 px, 6 frame)
FORMATO: PNG alpha (RGBA, sfondo trasparente)
STATI RICHIESTI: 1. marca sul bersaglio (loop, 6 frame); 2. chiusura circuito (one-shot, 8 frame); 3. rimbalzo tra due nemici (one-shot, 8 frame); 4. scudo spezzato (one-shot, 6 frame)
FRAME / GRIGLIA: Celle da 192 × 192 px; centro cavo su marca e chiusura per non coprire mai lo sprite del personaggio o il telegraph del nemico.
SILHOUETTE: Forme geometriche pure e distinte: doppio anello concentrico (marca), doppi anelli intrecciati con scintille radiali (chiusura), arco spezzato a zig-zag (rimbalzo), schegge cristalline centrifughe (scudo spezzato).
PALETTE: Esclusivamente gli accenti degli eroi: magenta-rosa #FF7FD8 (Lulù), ciano #6BDDFF (Nox) e nucleo bianco #EDF7FF.
LUCE: Auto-illuminato ad alto contrasto su fondali scuri e chiari.
DA EVITARE: Testo, numeri di danno nell'immagine, riempimenti opachi al centro che nascondono i personaggi.
RIFERIMENTO TECNICO: VFX anulari a centro vuoto ad altissima leggibilità (< 250 ms) su schermi mobile.
```

**Checklist di consegna — `vfx_due_colpi_*_v01.png`:**
- [x] Dimensioni esattamente come richieste (`1536×768 px` master + strisce `1152×192` e `1536×192 px`)
- [x] Nessun testo, logo o firma nell'immagine
- [x] Sfondo trasparente dove richiesto, senza aloni chiari sui bordi
- [x] Letto bene su sfondo chiaro **e** scuro
- [x] Silhouette riconoscibile in nero pieno
- [x] Tutti e 4 gli stati/effetti presenti (6, 8, 8, 6 frame)
- [x] Stesso stile e stessa palette degli altri asset dello sprint (`#6BDDFF` e `#FF7FD8`)
- [x] Nomi file in snake_case con versione (`_v01`)
- [x] Voci aggiunte al manifest (SHA-256 `e5a98778...`, `5710f6b8...`, `d4a49a0a...`, `a30ee75c...`, `e196c297...`)
- [x] Assunzioni dichiarate in cima alla risposta

---

### 5.4 Sfondo Cantiere al Buio — Apertura (`bg_cantiere_apertura_v01.webp` + `bg_cantiere_apertura_calpestabile_v01.png`)

```
ASSET: bg_cantiere_apertura_v01.webp (+ bg_cantiere_apertura_calpestabile_v01.png per riferimento del programmatore)
USO IN GIOCO: Livello di apertura (primi 10 secondi giocabili): cantiere notturno sotto la pioggia con l'unica cassa illuminata come punto focale immediato.
DIMENSIONE FINALE: 1536 × 1536 px (griglia 24 × 24 tile da 64 × 64 px)
FORMATO: WebP (sfondo in gioco) + PNG (mappa zone calpestabili in colore piatto)
STATI RICHIESTI: Sfondo notturno con cassa illuminata + tavola di riferimento collisioni calpestabili
FRAME / GRIGLIA: Mappa intera 1536 × 1536 px allineata alla griglia 24 × 24 tile
SILHOUETTE: Contrasto netto tra il piazzale centrale in pietra bagnata (calpestabile, liscio e scuro) e i container/macchinari perimetrali più la cassa centrale illuminata.
PALETTE: Blu abisso #0B1626, ardesia bagnata #1C2B42, ruggine spenta #4A3832, punto focale ambra calda #FFB65C e bordo ciano #6BDDFF sulla cassa.
LUCE: Riflettore principale in alto a sinistra + emissione diegetica dalla cassa centrale.
DA EVITARE: Testo, scritte sui container, figure umane nello sfondo, detriti decorativi sul pavimento che sembrino ostacoli o viceversa.
RIFERIMENTO TECNICO: Guida visiva diegetica tramite contrasto luminoso focale (lo sguardo cade sulla cassa entro < 2 secondi senza frecce o testo).
```

**Checklist di consegna — `bg_cantiere_apertura_v01.webp` & `bg_cantiere_apertura_calpestabile_v01.png`:**
- [x] Dimensioni esattamente come richieste (`1536×1536 px`)
- [x] Nessun testo, logo, scritta o figura umana nell'immagine
- [x] Alto contrasto tra pavimento calpestabile e ostacoli
- [x] Versione con le zone calpestabili evidenziate in colore piatto allegata (`bg_cantiere_apertura_calpestabile_v01.png`)
- [x] Stesso stile e stessa palette degli altri asset dello sprint
- [x] Nome file in snake_case con versione (`_v01`)
- [x] Voci aggiunte al manifest (`365.540 B` WebP SHA-256 `f58925fc...`; `1.911.493 B` PNG SHA-256 `80301e17...`)
- [x] Assunzioni dichiarate in cima alla risposta

---

### 5.5 Hub Moon — Sfondo + 3 Interni (`hub_moon_bg_v01.webp` + 3 interni `1536×1536`)

```
ASSET: hub_moon_bg_v01.webp, hub_moon_interno_negozio_v01.webp, hub_moon_interno_dialogo_v01.webp, hub_moon_interno_segreto_v01.webp
USO IN GIOCO: Primo Hub della Vertical Slice (Moon Refuge): vista esterna 24×24 + i 3 interni in prima persona dei punti di servizio (Negozio/Officina, Punto Dialogo/Locanda, Stanza del Segreto).
DIMENSIONE FINALE: 1536 × 1536 px per ciascuno dei 4 file
FORMATO: WebP
STATI RICHIESTI: 1 mappa hub esterna + 3 interni distinti e non riciclabili in altri hub
FRAME / GRIGLIA: 1536 × 1536 px (griglia 24 × 24 tile per l'esterno; illustrazione 1:1 per i 3 interni)
SILHOUETTE: Esterno con vasca ottagonale centrale, ingresso sud, uscita missioni nord e 3 edifici con facciate e simboli iconici (finestre calde a ovest per dialogo, incudine/forgia a est per negozio, mezzaluna a nord-est per segreto).
PALETTE: Verde-acqua ossidato #2A6F73, rame caldo #C87A4B, pietra scura #182436, lanterne ambra #FFB65C e condotti risonanti #6BDDFF / #FF7FD8.
LUCE: Alto a sinistra (lucernario sotterraneo) con accenti caldi alle porte e alle fucine.
DA EVITARE: Testo o lettere sulle insegne (usati solo simboli puri: incudine, mezzaluna, lanterne), personaggi dipinti nello sfondo, riciclo di stanze.
RIFERIMENTO TECNICO: Caratterizzazione architettonica per funzione (ogni porta e ogni interno comunica immediatamente il proprio ruolo senza etichette testuali).
```

**Checklist di consegna — `hub_moon_*_v01.webp` (4 file):**
- [x] Dimensioni esattamente come richieste (`1536×1536 px` su tutti e 4 gli asset)
- [x] Nessun testo, logo o firma nell'immagine (solo simboli iconografici sulle facciate)
- [x] Zone esterne ben distinte (ingresso sud, 3 servizi con facciata propria, uscita missioni nord)
- [x] 3 interni unici e dedicati esclusivamente a Hub Moon (`negozio`, `dialogo`, `segreto`)
- [x] Stesso stile e stessa palette degli altri asset dello sprint
- [x] Nomi file in snake_case con versione (`_v01`)
- [x] Voci aggiunte al manifest (SHA-256 `235a8461...`, `a32592ef...`, `6df99835...`, `66c1af93...`)
- [x] Assunzioni dichiarate in cima alla risposta

---

### 5.6 Boss The Anchor (`boss_the_anchor_v01.png` + `boss_the_anchor_cavi_v01.png`)

```
ASSET: boss_the_anchor_v01.png, boss_the_anchor_cavi_v01.png
USO IN GIOCO: Primo boss sinergico della Vertical Slice; richiede l'uso combinato del movimento, del taglio dei cavi d'ormeggio e del Due Colpi sul nucleo esposto.
DIMENSIONE FINALE: Boss sheet 1536 × 1536 px (4×4 celle da 384×384 px) + Cavi e bitte interattive 768 × 384 px
FORMATO: PNG alpha (RGBA, sfondo trasparente senza aloni)
STATI RICHIESTI: Fase 1 intera (Riga 1, 4 frame), Fase 2 danneggiata con nucleo esposto (Riga 2, 4 frame), Telegraph dell'attacco con anello di pericolo a terra (Riga 3, 4 frame), Stato colpito per Fase 1 e Fase 2 (Riga 4, col 1–2) + Cavi/bitte separati in stato normale, in tensione e tagliato (`boss_the_anchor_cavi_v01.png`).
FRAME / GRIGLIA: 1536 × 1536 px (celle 384 × 384 px) + foglio cavi separato 768 × 384 px
SILHOUETTE: Sagoma massiccia ad ancora biomeccanica abissale con marre rialzate durante il telegraph d'attacco, leggibile anche in monocromatico.
PALETTE: Ottone scuro #8C6D46, ferro abissale #1D2432, nucleo esposto ciano #6BDDFF e fessure energetiche magenta #FF7FD8.
LUCE: Principale in alto a sinistra + bagliore interno dal nucleo nella Fase 2.
DA EVITARE: Testo o numeri di serie in cifre, aloni verdi di scontorno, telegraph poco visibili.
RIFERIMENTO TECNICO: Boss design leggibile per silhouette e stato fisico (corazza chiusa = invulnerabile / mira ai cavi; corazza spaccata luminosa = finestra di danno Due Colpi; marre alzate + cerchio a terra = telegraph d'attacco).
```

**Checklist di consegna — `boss_the_anchor_v01.png` & `boss_the_anchor_cavi_v01.png`:**
- [x] Dimensioni esattamente come richieste (`1536×1536 px` + `768×384 px`)
- [x] Nessun testo, logo o firma nell'immagine
- [x] Sfondo trasparente dove richiesto, senza aloni chiari o verdi sui bordi
- [x] Letto bene su sfondo chiaro **e** scuro
- [x] Silhouette e telegraph immediatamente riconoscibili anche senza colore
- [x] Stati `normale` (Fase 1 e Fase 2), `telegraph`, `colpito` (Fase 1 e Fase 2) e cavi interattivi separati (`intatto`, `reciso`) presenti
- [x] Stesso stile e stessa palette degli altri asset dello sprint
- [x] Nomi file in snake_case con versione (`_v01`)
- [x] Voci aggiunte al manifest (`1.044.667 B` SHA-256 `2f36352b...`; `83.729 B` SHA-256 `53425e11...`)
- [x] Assunzioni dichiarate in cima alla risposta

---

### 5.7 HUD Mobile (`hud_vertical_slice_v01.png`)

```
ASSET: hud_vertical_slice_v01.png
USO IN GIOCO: Interfaccia di combattimento su telefono per la Vertical Slice (barre vita Nox e Lulù, indicatore Secondo Colpo, pulsanti touch).
DIMENSIONE FINALE: 1024 × 1024 px
FORMATO: PNG alpha (RGBA, sfondo trasparente)
STATI RICHIESTI: Barra vita Nox (cornice squadrata + riempimento ciano), Barra vita Lulù (cornice curva + riempimento magenta), Indicatore Secondo Colpo (scarico spento / carico con doppio anello ciano-rosa attivo), 3 pulsanti touch circolari (>= 48 dp / 192 px sul foglio) per SPARA (mirino + vampa), SCHIVA (doppio chevron direzionale) e CAMBIA (doppia freccia intrecciata).
FRAME / GRIGLIA: Atlante modulare 1024 × 1024 px con margine trasparente attorno a ogni elemento per il ritaglio CSS/Canvas; le etichette testuali sono demandate al codice.
SILHOUETTE: Cornice pesante smussata (Nox) vs cornice affusolata (Lulù); icone dei 3 pulsanti distinguibili per sola forma geometrica.
PALETTE: Ardesia #263447, ottone #C49A52, ciano Nox #6BDDFF, rosa Lulù #FF7FD8, bianco #EDF7FF.
LUCE: Filo di luce speculare superiore sinistro (coerente con la direzione della luce del mondo).
DA EVITARE: Qualsiasi testo, lettera o numero dentro l'immagine; elementi posizionati nella zona centrale bassa dello schermo.
RIFERIMENTO TECNICO: Ergonomia mobile > 48 dp e codifica ridondante forma + colore per daltonismo e visione periferica.
```

**Checklist di consegna — `hud_vertical_slice_v01.png`:**
- [x] Dimensioni esattamente come richieste (`1024×1024 px`, pulsanti ampiamente sopra la soglia minima di `48 dp`)
- [x] Nessun testo, logo o firma nell'immagine (zero scritte, solo icone pure)
- [x] Sfondo trasparente dove richiesto, senza aloni sui bordi
- [x] Letto bene su sfondo chiaro **e** scuro
- [x] Silhouette delle barre e delle icone riconoscibile in nero pieno
- [x] Stati `carico` e `scarico` dell'indicatore Secondo Colpo presenti
- [x] Stesso stile e stessa palette degli altri asset dello sprint
- [x] Nome file in snake_case con versione (`hud_vertical_slice_v01.png`)
- [x] Voce aggiunta al manifest (`602.064 B`, SHA-256 `993ef4d480a548c851fd287fa0686b391646a9ba7d4adabb12f7279f1f577d79`)
- [x] Assunzioni dichiarate in cima alla risposta

---

## 2. Riepilogo Tabellare e SHA-256 (`MANIFEST_SPRINT_01.json`)

| File | Dimensioni | Formato | Byte | SHA-256 |
| --- | :---: | :---: | ---: | --- |
| `nox_sheet_base_v01.png` | `1920×1600` | PNG | `881.515` | `7c38e0c4509aef51f439ed9923794df202c400207a9793aa938c2e3051bc6133` |
| `lulu_sheet_base_v01.png` | `1920×1600` | PNG | `556.538` | `f9f01e82ba34110a480d1c616c83d89105026d27a9fcd69021d92a3b0514cd12` |
| `prova_silhouette_nox_lulu_v01.png` | `640×320` | PNG | `3.890` | `28f8a185863e489d42f140a4eff408cd39115bf5c2da5ecbdf0fe0d303bf708a` |
| `vfx_due_colpi_v01.png` | `1536×768` | PNG | `416.510` | `e5a9877801e0c40ef3b921539d234c89f8f924b41811051ad836100a816df719` |
| `vfx_due_colpi_marca_v01.png` | `1152×192` | PNG | `113.437` | `5710f6b807ad6a46623c1b0d6c2389dadaf21108c9264fbf0d742d0d30fdaa41` |
| `vfx_due_colpi_chiusura_v01.png` | `1536×192` | PNG | `138.747` | `d4a49a0ac3cc1501544b36305849c4ee11b19861ce28404f6c192a029730cd48` |
| `vfx_due_colpi_rimbalzo_v01.png` | `1536×192` | PNG | `53.565` | `a30ee75c72cd5cb1b00cbfdb9eaa4f5b14b6f702557a27d767f29f986142de4b` |
| `vfx_due_colpi_scudo_spezzato_v01.png` | `1152×192` | PNG | `109.068` | `e196c297a439f6f89a18f45067b4afb4a9a96a5ff670e3ce6eed8b96622e97d8` |
| `bg_cantiere_apertura_v01.webp` | `1536×1536` | WEBP | `365.540` | `f58925fcd65323c927d121b58abf20ff80840bff989b8472b81adfca35d0d525` |
| `bg_cantiere_apertura_calpestabile_v01.png` | `1536×1536` | PNG | `1.911.493` | `80301e1730770799fa9005ca3578e440ff30a9963bed3049433ca2df3235cfa2` |
| `hub_moon_bg_v01.webp` | `1536×1536` | WEBP | `441.740` | `235a8461ad96d70be6c5a80ec945292a51603805d9d2dfd44379666402d2041c` |
| `hub_moon_interno_negozio_v01.webp` | `1536×1536` | WEBP | `482.768` | `a32592efd3be6e38ee0e7ba4e71ed47b2c3d3222ed3d72162ee6ff419081cbd8` |
| `hub_moon_interno_dialogo_v01.webp` | `1536×1536` | WEBP | `247.386` | `6df998356897caa9ccdba2e43628cd49559838a433652df863df31e33c8a47b2` |
| `hub_moon_interno_segreto_v01.webp` | `1536×1536` | WEBP | `611.172` | `66c1af939a7783a101f24155eacb9e26bb33485809e754872d93f577af8bedcc` |
| `boss_the_anchor_v01.png` | `1536×1536` | PNG | `1.044.667` | `2f36352b97177d5fa05f79e43a57f833b5cde8b89639aec7ad486d1fcf3970ea` |
| `boss_the_anchor_cavi_v01.png` | `768×384` | PNG | `83.729` | `53425e11bd7911745397db88003973a2fe9b2879804a726c50aea98c3da57649` |
| `hud_vertical_slice_v01.png` | `1024×1024` | PNG | `602.064` | `993ef4d480a548c851fd287fa0686b391646a9ba7d4adabb12f7279f1f577d79` |

---

## 3. Revisione Sprint Arte 01b (`v02` — Conformità Audit Grafica, Audio e Narrativa 14/11/2026)

Tutte le osservazioni bloccanti dell'audit statico (`AUDIT_GRAFICA_AUDIO_NARRATIVA_20261114.md`) sono state risolte e certificate nella serie `v02` (`MANIFEST_SPRINT_01B.json`), integrata direttamente a runtime in `game/art/sprint01/`:

- **Contrasto con sfondo `#0B1626` >= 3:1 (Audit `G1`):**
  - `nox_sheet_base_v02.png`: rim light ciano `#9FE9FF` di `2 px` e controllo luminanza abiti → rapporto di contrasto misurato **`6.24:1`** (`>= 3:1`), altezza idle **`288 px`**, piedi ancorati a `y = 304 px`, margine `>= 16 px`, nessuna distorsione verticale tra le righe (`G5`).
  - `lulu_sheet_base_v02.png`: rim light rosa `#FFB3EA` di `2 px`, sciarpa e risonanza rosa **`#FF7FD8`** → rapporto di contrasto misurato **`7.16:1`** (`>= 3:1`), altezza idle **`288 px`**, piedi ancorati a `y = 304 px`, margine `>= 16 px`.
- ** separazione cromatica Lulù (`#FF7FD8`) vs Pericolo Boss (`#FF5A36`) (Audit `G4`):**
  - `vfx_due_colpi_v02.png` (+ 4 strisce `v02`): marchio e scudo di Lulù con riempimento interno semitrasparente rosa `#FF7FD8` e ciano `#6BDDFF` per Nox.
  - `boss_the_anchor_v02.png` + `boss_the_anchor_cavi_v02.png`: telegraph d'attacco, cavi in tensione e nucleo esposto interamente convertiti in rosso-arancio **`#FF5A36`** (zero pixel magenta/rosa `#FF7FD8`).
- **Pavimento più chiaro degli ostacoli di almeno +25 punti su 255 (Audit `G2`):**
  - `bg_cantiere_apertura_v02.webp` + `bg_cantiere_apertura_calpestabile_v02.png`: luminosità media pavimento calpestabile **`65.6 / 255`** vs luminosità media ostacoli perimetrali **`26.8 / 255`** (scarto **`+38.8 punti`** `>= +25`), area calpestabile **`56.2%`** (`>= 45%`), cassa illuminata centrale come punto focale diegetico.
- **HUD `hud_vertical_slice_v02.png` coerente 2×2 px (Audit `G6`):**
  - Icone distinte per `SPARA` (mirino), `SCHIVA` (stivale alato), `CAMBIA` (doppia freccia) e `DUE COLPI` (doppio anello sincronizzato), barra ciano Nox e barra rosa `#FF7FD8` Lulù.

| File `v02` | Dimensioni | Formato | Byte | SHA-256 |
| --- | :---: | :---: | ---: | --- |
| `nox_sheet_base_v02.png` | `1920×1600` | PNG | `25.801` | `e3e92b3cdbddec477f5f82ba5f4b826082f3fed9cd5f70d21150d3ee7b0e0020` |
| `lulu_sheet_base_v02.png` | `1920×1600` | PNG | `46.337` | `054acf17fbd36c5f261602961a6c7646e496a3adb7cf7b3719414bc58d890e07` |
| `prova_silhouette_nox_lulu_v02.png` | `640×320` | PNG | `1.953` | `08fb9ff57e9b0f51b7a6f72ff7331ff4cc8479413e439b944f567f8d2e557be7` |
| `vfx_due_colpi_v02.png` | `1536×768` | PNG | `62.275` | `30a7f6d0d5044d66589b3724bb7f7f0fd00f1415c9e15eb6ca44a6dc5de2f4bf` |
| `vfx_due_colpi_marca_v02.png` | `1152×192` | PNG | `11.434` | `2a0377a84221200f10af645df6672d4a1b620bb7e99f087053a31ebfb1e656f7` |
| `vfx_due_colpi_chiusura_v02.png` | `1536×192` | PNG | `23.351` | `b1ba2a9f0ed80c6890a1df0fc6c451f5191e3c9c0834cd0eca3f75f6de29d7a1` |
| `vfx_due_colpi_rimbalzo_v02.png` | `1536×192` | PNG | `21.319` | `94f25e016d5a2b690dd28e3d1da97cd3a6fb7d09c192856df5f78ab437be0b4f` |
| `vfx_due_colpi_scudo_spezzato_v02.png` | `1152×192` | PNG | `6.211` | `eeda2dadf2e2464b7c8dd75614eb8e6cf7acb34954ba6a1979d9f87ced44164c` |
| `bg_cantiere_apertura_v02.webp` | `1536×1536` | WEBP | `28.532` | `ee7b24e8eb815c8d92a4c3858d3dcc84a4a77deca5b95f199f017d382ed42c28` |
| `bg_cantiere_apertura_calpestabile_v02.png` | `1536×1536` | PNG | `11.937` | `bf5a6d796d1201c80caf23e82da5ec2f49cd749097a3b6f7c27eb8bbc01a516a` |
| `boss_the_anchor_v02.png` | `1536×1536` | PNG | `66.700` | `a963cd7ad1a6e787681e2791e12101e925775b73ee6a8de46e8c93d3a690f0ad` |
| `boss_the_anchor_cavi_v02.png` | `768×384` | PNG | `2.692` | `54e08f215a0a1afcb85956859e27ad1b33e577c2827a7b884eb455f180ce3aae` |
| `hud_vertical_slice_v02.png` | `1024×1024` | PNG | `21.285` | `96e67006b18061a87c0302db167f18fec853f123c9dadc13d253edb430b94fdf` |

