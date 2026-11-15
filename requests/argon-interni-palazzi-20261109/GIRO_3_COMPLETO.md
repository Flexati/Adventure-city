# Richiesta ad Argon, terzo giro: tutto ciò che manca, con dichiarazione di ciò che è già dentro

Questo file è una richiesta per Argon, non un'istruzione per Claude. Sostituisce l'ordine di lavoro di
`GIRO_2.md` e `GIRO_2_ANIMAZIONE_AUDIO.md`; le descrizioni dei singoli soggetti restano in quei due file.

**Scopo:** arrivare alla generazione completa. Il giro 2 si è fermato per la quota giornaliera del modello
di immagini. Qui c'è (1) l'elenco di ciò che è già nel gioco e non va rifatto, (2) la direzione di design
che ogni immagine e ogni suono devono rispettare, (3) i gruppi mancanti in ordine di priorità, (4) un
protocollo per riprendere il lavoro quando la quota finisce, senza ricominciare da capo.

**Come si usa:** in ogni chat con Argon si incolla per primo il blocco del §2, poi un gruppo alla volta
dal §4, nell'ordine scritto.

---

## 1. Dichiarazione: cosa è già nel gioco (NON rifare)

Controllato immagine per immagine; i derivati sono registrati con SHA-256 in
`assets/production/v10.3/derived/REGISTRO_ARGON_20261109.json` e `REGISTRO_ARGON_GIRO2_20261110.json`.

| Stato | Cosa | Origine |
|---|---|---|
| **Integrato** | 15 interni in prima persona (un servizio per villaggio: moon, cathedral, toxic, clockwork) | giro 1, gruppo A |
| **Integrato** | 8 ritratti (7 servizi + guardia della porta) | giro 1, gruppo I |
| **Integrato** | 8 strade: Solkara giorno ×3, Solkara tempesta ×2, Aurelia giorno ×2, Aurelia tramonto ×1 | giro 2, gruppi S e P |
| **Integrato** | Auto Vortex, 8 viste (danni, nitro, fari) | giro 2, `S/auto_vortex.png` |
| **Accettato, in attesa** | `gang_shooter_a`, `gang_shooter_a_v2`, `gang_shooter_b`, `gang_shooter_b_v2` | giro 2, gruppo N |
| **Accettato, in attesa** | `gang_signal_a`, `gang_signal_b`, `gang_breaker_a` | giro 2, gruppo N |
| **Accettato, in attesa** | `gang_brute_a`, `gang_brute_a_v2` (= `prova_nemico`, `prova_nemico_v2`) | giro 2, gruppi N e P |
| **Accettato, in attesa** | `terreno_porto`, `terreno_porto_v2` (= `prova_terreno`, `prova_terreno_v2`) | giro 2, gruppi T e P |
| **Scartato, da rifare** | `gang_breaker_b`: scritta «CAUTION» sullo scudo e personaggio diverso dal foglio `_a` | giro 2, gruppo N |
| **Scartato, non serve più** | `gang_signal_b_v2`: personaggio di un'altra fazione | giro 2, gruppo N |

«In attesa» significa: l'immagine è buona, ma un nemico entra nel gioco solo quando ha sia il foglio
d'azione (`_a`) sia quello di reazione (`_b`) dello **stesso** personaggio.

Le 165 immagini del giro 1 fatte di figure geometriche restano rifiutate: i loro soggetti sono coperti
dai gruppi qui sotto.

---

## 2. Testo da incollare per primo, in ogni chat

```
You are the art and audio production team for CHRONOS Adventure: Nox & Lulu, a premium top-down pixel-art
action game for Android (one-time price 5.99 EUR, no ads, no free-to-play mechanics). Work as a Lead Game
Designer, a UI/UX Director and an Audio Director would: every asset must look and sound like hand-crafted
work from a major studio, because the player paid for it up front.

WHAT IS ALREADY DONE — do NOT regenerate any of these:
- 15 painted shop interiors and 8 character portraits (first round).
- 8 race roads (Solkara day/storm, Aurelia day/dusk) and the Vortex car sheet.
- Enemy sheets: gang_shooter_a, gang_shooter_b (and their _v2), gang_signal_a, gang_signal_b,
  gang_breaker_a, gang_brute_a (and _v2). Ground: terreno_porto (and _v2).
Regenerating a finished image wastes quota that the missing ones need.

METHOD, mandatory:
- Every image must be created with your IMAGE GENERATION model. It is FORBIDDEN to draw images with code:
  no Python, PIL, canvas, SVG, matplotlib, no rectangles, circles, polygons or flat fills made by a script.
- Do not copy, scale, squash or recolour frames from reference files. Every pose is newly drawn.
- If the model cannot produce something, do NOT replace it with a placeholder: skip it and write why.
  A missing file is fine; a fake one is not.
- This round has NO "_v2" variants: one image per name. Spend the quota on coverage, not duplicates.

STYLE, the same for every image:
- Detailed 16-bit-era pixel art, 3 to 5 tones per material, 1-pixel dark outline, crisp pixels, no blur.
- Colourful and luminous: saturated accents and visible light sources against darker surroundings.
- The two hero colours are cyan #6BDDFF (Nox) and pink #FF7FD8 (Lulu) on deep navy #0B1626 with
  near-white #EDF7FF. Use them as the accent family of the whole interface.
- NO text, letters, numbers, logos, warning labels or watermarks anywhere, including on shields, signs,
  crates, screens and clock faces. No real brands. Original designs only.
- Enemies and hazards must be recognisable by SHAPE alone in a black silhouette, not by colour.
- Never draw the heroes Nox and Lulu.
- A character keeps the same costume, proportions and palette on every sheet that carries its name.

LAYOUT is free: no exact pixel grids. Follow the canvas size and background colour of each request, keep
every figure fully inside the canvas with empty space around it, figures never touching each other.
Sprites: flat #FF00FF background. Bosses: flat #00FF00 background. The game team cuts and aligns.

SELF-CHECK before delivering each image. Regenerate if any answer is yes:
1. Is any figure built from plain rectangles, circles or flat single-colour areas?
2. Is the PNG smaller than 150 KB?
3. Is there any text, letter or number anywhere in the image?
4. Does a character differ from its other sheet (costume, proportions, palette)?
5. Is this a file listed under "already done"?

QUOTA PROTOCOL:
- Work the groups strictly in the order given. Inside a group, in the order listed.
- When the image model reports a usage limit, STOP generating. Commit what is finished and write
  deliveries/argon-asset-giro2-20261110/STATO_CODA.md with two lists: files delivered so far, files still
  missing, in order.
- In the next session, read STATO_CODA.md first and resume from the first missing file. Never restart a
  finished group, never fill a gap with a placeholder.

PUBLISHING: only images, audio and CONSEGNA.md files, only on the branch
delivery/argon-asset-giro2-20261110, in deliveries/argon-asset-giro2-20261110/<GROUP>/. One commit per group.
Do not modify game code, tests or any other branch.
```

---

## 3. Direzione di design (ciò che ogni materiale deve servire)

Queste sono le specifiche del gioco, prese dai documenti del progetto. Argon non deve progettarle di nuovo:
deve produrre materiali che le rispettano.

### 3.1 Logica e durata: circa 2 ore in quattro atti

Fonte: `docs/gold/NARRATIVA_V10_3_DUE_ORE.md`.

| Atto | Minuti | Domanda dell'atto | Tono visivo e sonoro |
|---|---:|---|---|
| I · La città al buio | 25 | Chi è Nox, e perché la città lo riconosce? | notte, neon ciano su blu profondo, pioggia |
| II · La breccia | 30 | Fino a dove si spinge Lulù per salvare le persone? | luce rosa che taglia il buio, allarmi, urgenza |
| III · Due strade | 45 | Separati, diventano migliori o più soli? | due palette alternate (ciano / rosa), deserto e ponti |
| IV · Ora uno | 20 | Cosa vale la libertà, se il sistema ricorda tutto per te? | ciano e rosa insieme, vetro freddo, poi luce calda |

Regole di ritmo (obiettivi di progetto): ogni atto apre con una scena, alterna combattimento, guida e
villaggio, e chiude con un boss o una scelta; nessun tratto ripete la stessa attività per più di qualche
minuto; ogni atto consegna una ricompensa visibile (arma, abilità, gara, medaglia).

### 3.2 Interfaccia premium

- **Materiale:** vetro scuro e metallo brunito con filo di luce ciano o rosa; l'orologio (lancetta,
  ingranaggio, quadrante senza numeri) è il motivo ricorrente del marchio.
- **Pulsanti:** quattro stati leggibili senza colore — riposo, premuto (più basso, luce interna),
  selezionato (bordo acceso), disattivato (spento, opaco). Tre famiglie: primario (ciano), secondario
  (neutro), pericolo (ambra-rosso).
- **Leggibilità:** l'interfaccia vive su uno schermo piccolo, al tocco, anche senza audio; bersagli
  larghi, poco ornamento dentro l'area dove va il testo (il testo lo scrive il gioco, mai l'immagine).
- **Feedback:** ogni tocco ha una risposta visiva (affondo, bagliore, scintilla), una vibrazione breve
  e un suono; i tre arrivano insieme.

### 3.3 Suono

Fonte: `docs/gold/AUDIO_PLAN_V10_3.md`.

- Quattro leitmotiv già scritti: NOX (grave, re minore), LULÙ (acuto, campane), PROMESSA (i due motivi
  che si rispondono, sospesi), EVE (vetro freddo, tic-tac a 60 al minuto). Nessun suono nuovo deve
  citare melodie esistenti di altre opere.
- Ogni interazione ha il suo suono, pulito e corto; le varianti evitano la ripetizione meccanica.
- Tecnica: OGG Vorbis, 44,1 kHz, picco sotto −1 dBFS, niente parole, niente campioni di terzi.

---

## 4. Gruppi da generare, in ordine di priorità

85 immagini e 104 suoni. Tutte le immagini PNG. Dove dice «descrizione in», il testo del soggetto è già
scritto in quel file e si usa così com'è, senza la variante `_v2`.

### R — Rifacimento (1 immagine)

`gang_breaker_b.png`, 1536×1024, fondo `#FF00FF`. Lo **stesso** uomo di `gang_breaker_a.png` (allegarlo come
riferimento): incappucciato viola scuro con fasce arancioni, scudo ricavato dallo sportello di un armadio
elettrico **senza alcuna etichetta o scritta**, piede di porco. Sei pose: fermo che respira, colpito 1,
colpito 2, in ginocchio, a terra, a terra immobile.

### U — Interfaccia premium (8 immagini, nuove)

Tutte su fondo `#FF00FF`, nessun testo. Elementi separati, ben distanziati.

| File | Tela | Contenuto |
|---|---|---|
| `ui_pulsanti.png` | 2048×1024 | 12 placche orizzontali vuote: primario, secondario, pericolo × riposo, premuto, selezionato, disattivato |
| `ui_pulsanti_tondi.png` | 1536×1024 | 16 pulsanti rotondi vuoti per i comandi di gioco: 4 colori d'accento × 4 stati |
| `ui_cornici.png` | 2048×2048 | 4 cornici di pannello con centro liscio e scuro: menu, dialogo, scheda, avviso |
| `ui_icone_azione.png` | 2048×1024 | 12 icone: attacco, schivata, speciale, cura, nitro, interagisci, arma, ricarica, mappa, pausa, salva, checkpoint |
| `ui_icone_menu.png` | 2048×1024 | 12 icone: impostazioni, musica, effetti, vibrazione, lingua, riduci movimento, indietro, conferma, chiudi, lucchetto, moneta, chiave |
| `ui_hud.png` | 2048×1024 | cornice barra vita, cornice barra energia, indicatore nitro, anello e pomello del joystick, 3 segnalini di combo |
| `ui_medaglie.png` | 1536×1024 | medaglie oro, argento, bronzo, stella, corona di vittoria, raggiera di ricompensa |
| `ui_emblema.png` | 1536×1536 | emblema del gioco senza lettere: orologio spezzato con lancetta ciano e lancetta rosa; più 4 ornamenti d'angolo |

### N — Nemici mancanti (9 immagini)

Descrizioni in `GIRO_2.md`, gruppo N. 1536×1024, fondo `#FF00FF`.
`gang_brute_b`, `alien_breaker_a`, `alien_breaker_b`, `alien_brute_a`, `alien_brute_b`,
`infected_brute_a`, `infected_brute_b`, `port_patrol_a`, `port_patrol_b`.
Per ogni `_b` allegare il suo `_a` come riferimento del personaggio (`gang_brute_a.png` esiste già).

### B — Boss a 288 px (12 immagini)

Descrizioni in `GIRO_2.md`, gruppo B, e brief in `requests/gpt-boss-v2-20261102/brief/boss.<boss>.sheet.v2.json`.
Fondo `#00FF00`. `bone_tyrant_a…d`, `forge_behemoth_a…d`, `shadow_reaper_a…d`.

### T — Terreno, palazzi, oggetti (11 immagini)

Descrizioni in `GIRO_2.md`, gruppo T.
`terreno_cantiere`, `terreno_clinica`, `terreno_nodo`, `palazzi_moon`, `palazzi_cathedral`, `palazzi_toxic`,
`palazzi_clockwork`, `oggetti_cantiere`, `oggetti_porto`, `oggetti_clinica`, `oggetti_nodo`.

### C — Schede dei quattro atti (4 immagini, nuove)

2048×1152, opache, nessun testo, senza Nox e Lulù. Il terzo centrale-basso resta calmo e scuro: lì il
gioco scrive il titolo dell'atto.

| File | Scena |
|---|---|
| `atto_1.png` | La città al buio: tetti sotto la pioggia, un solo quartiere acceso di ciano, la Vortex ferma in un vicolo |
| `atto_2.png` | La breccia: una fenditura di luce rosa nel cielo sopra la città, sirene, gente che guarda in su |
| `atto_3.png` | Due strade: un bivio visto dall'alto, a sinistra il deserto di Solkara in luce ambra, a destra il ponte a orologi di Aurelia in luce turchese |
| `atto_4.png` | Ora uno: una sala di vetro freddo con un grande quadrante senza numeri; due fasci, ciano e rosa, si incontrano al centro |

### M — Apertura e menu (6 immagini)

Descrizioni in `GIRO_2_ANIMAZIONE_AUDIO.md`, gruppo M.

### V — Volti che vivono (16 immagini)

Descrizioni in `GIRO_2_ANIMAZIONE_AUDIO.md`, gruppo V. Si ottengono modificando il ritratto originale:
stesso volto, stessa inquadratura, cambia solo occhi o bocca.

### G — Gesti delle persone dei villaggi (12 immagini)

Descrizioni in `GIRO_2_ANIMAZIONE_AUDIO.md`, gruppo G.

### F — Animazioni d'ambiente (6 immagini)

Descrizioni in `GIRO_2_ANIMAZIONE_AUDIO.md`, gruppo F.

### A — Suoni (104 file), solo con un modello di generazione audio

Se in questo ambiente non c'è un modello che genera audio, **non consegnare nulla** e scriverlo in
`A/CONSEGNA.md`: un suono sintetizzato da codice vale quanto un'immagine disegnata da codice.

- I 96 file di `GIRO_2_ANIMAZIONE_AUDIO.md`, gruppo A.
- 8 file nuovi: `atto_1_apertura.ogg` … `atto_4_apertura.ogg` (4–6 s, uno per atto, sul tono della
  tabella del §3.1), `medaglia_oro.ogg`, `medaglia_argento.ogg`, `medaglia_bronzo.ogg`,
  `sblocco.ogg` (1–2 s ciascuno).

---

## 5. Rapporto finale di Argon

Alla fine di ogni sessione, un solo messaggio con questa tabella e nient'altro di dichiarato come fatto:

| Gruppo | Richieste | Consegnate | Saltate | Motivo delle saltate | Commit |
|---|---:|---:|---:|---|---|

Più il contenuto di `STATO_CODA.md`. Un file conta come «consegnato» solo se è stato generato dal modello
di immagini (o audio) e ha superato l'autocontrollo.

---

## 6. Cosa fa Claude a ogni consegna

Come nei giri precedenti: scarica il ramo senza modificarlo, guarda ogni immagine, scrive l'esito in
`docs/gold/`, deriva e registra con SHA-256 ciò che entra, aggiunge un test per gruppo e prova nel browser.
Il taglio, l'allineamento, il testo dei pulsanti, il movimento e il mix li costruisce Claude nel codice.
