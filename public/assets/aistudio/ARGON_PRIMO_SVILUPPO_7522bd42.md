# ARGON — Brief del primo sviluppo (Sprint Arte 01)

Progetto: Chronos Adventure (Nox & Lulù) — studio Jaguars Builds Creators
Destinatario: Argon (Gemini)
Obiettivo dello sprint: produrre il primo blocco di asset coerenti per la **Vertical Slice** (apertura + 1 hub + 1 boss), non l'intero gioco.

---

## 0. Come lavorare (metodo da studio)

1. **Un asset alla volta.** Ogni richiesta produce un solo asset, con il suo brief completo (sezione 3).
2. **Prima la regola, poi l'immagine.** Rispetta la Bibbia visiva (sezione 1) prima di qualsiasi scelta estetica.
3. **Reverse engineering delle tecniche, non delle opere.** Studia *come* i buoni giochi risolvono un problema (leggibilità, silhouette, telegraph dei colpi, contrasto sfondo/personaggio) e applica la tecnica. Non copiare personaggi, loghi, ambienti o opere esistenti.
4. **Consegna sempre con checklist** (sezione 4) compilata. Un asset senza checklist non è consegnato.
5. **Se manca un'informazione, chiedila** invece di inventarla. Le assunzioni vanno scritte in cima alla risposta.

---

## 1. Bibbia visiva minima (da confermare dal Game Director)

> Le voci marcate **[DA CONFERMARE]** sono assunzioni: non trattarle come definitive.

| Voce | Regola |
| --- | --- |
| Identità | Action-duet narrativo a "Vanta": Nox (peso, impatto) e Lulù (risonanza, scudo) |
| Stile | Pixel art / dipinto stilizzato coerente con gli asset esistenti in `assets/chrono_shadows/` **[DA CONFERMARE]** |
| Sfondi di livello | 1536×1536 px, esportazione WebP |
| Sprite personaggi | Altezza di riferimento 288 px **[DA CONFERMARE]** |
| Griglia di gioco | 24×24 tile; la geometria calpestabile viene definita dal codice, non dall'immagine |
| Palette | 1 palette per hub, massimo 16 colori dominanti; accenti neon riservati a elementi interattivi |
| Illuminazione | Luce principale in alto a sinistra, ombre morbide verso il basso a destra |
| Testo nell'immagine | Mai. Nessuna scritta, logo o firma dentro gli asset |
| Sfondo sprite | Trasparente (PNG con alpha) |
| Stati obbligatori per ogni oggetto colpibile | `normale` e `colpito` |

**Regola di leggibilità (non negoziabile):** in gioco, a dimensione reale su un telefono, il giocatore deve distinguere in meno di mezzo secondo *dove sono io, dove è il nemico, dove arriva il colpo*.

---

## 2. Priorità dello sprint (in ordine)

| # | Asset | Perché ora |
| --- | --- | --- |
| 1 | Nox: sprite sheet base (idle, camminata, spara, schiva, colpito) | Serve per l'apertura e per ogni scena |
| 2 | Lulù: sprite sheet base (idle, camminata, marca, scudo, colpito) | Serve per il Due Colpi |
| 3 | Effetti Due Colpi: marca, chiusura circuito, rimbalzo, scudo spezzato | È il verbo principale del gioco |
| 4 | Sfondo cantiere al buio (apertura) | Primi 10 secondi di gioco |
| 5 | Hub Moon: sfondo + 3 interni | Primo hub della Vertical Slice |
| 6 | Boss The Anchor: sprite, fasi, telegraph, stato colpito | Primo boss sinergico |
| 7 | HUD: barre vita, indicatore Secondo Colpo, pulsanti touch | Leggibilità su telefono |

**Fuori sprint:** villaggi aggiuntivi, tappe `app_*`, gare Vortex, hub Cathedral/Toxic/Clockwork.

---

## 3. Template di brief per ogni asset

Copia questo blocco per ogni richiesta e compilalo.

```
ASSET: <nome file in snake_case, es. nox_sheet_base_v01>
USO IN GIOCO: <dove compare, in quale missione, a che dimensione reale sullo schermo>
DIMENSIONE FINALE: <larghezza × altezza in px>
FORMATO: <PNG alpha | WebP>
STATI RICHIESTI: <normale, colpito, altri>
FRAME / GRIGLIA: <numero di frame, dimensione cella, ordine>
SILHOUETTE: <come deve riconoscersi in nero pieno>
PALETTE: <colori dominanti, accenti>
LUCE: <direzione>
DA EVITARE: <testo, loghi, elementi che coprono la giocabilità, pose ambigue>
RIFERIMENTO TECNICO: <la tecnica da studiare, non un'opera da copiare>
```

---

## 4. Checklist di consegna (obbligatoria)

- [ ] Dimensioni esattamente come richieste
- [ ] Nessun testo, logo o firma nell'immagine
- [ ] Sfondo trasparente dove richiesto, senza aloni chiari sui bordi
- [ ] Letto bene su sfondo chiaro **e** scuro
- [ ] Silhouette riconoscibile in nero pieno
- [ ] Stati `normale` e `colpito` presenti dove richiesti
- [ ] Stesso stile e stessa palette degli altri asset dello sprint
- [ ] Nome file in snake_case con versione (`_v01`)
- [ ] Voce aggiunta al manifest (nome, dimensioni, hash)
- [ ] Assunzioni dichiarate in cima alla risposta

---

## 5. Prompt pronti — primo blocco

### 5.1 Nox, sprite sheet base

```
Crea lo sprite sheet base di NOX, protagonista di un action-duet narrativo in stile pixel art.
Nox è il personaggio del "peso e dell'impatto": silhouette larga, postura bassa, movimenti pesanti.

Specifiche:
- Altezza personaggio: 288 px. Cella 320×320 px.
- Righe: idle (4 frame), camminata (6), spara (4), schiva (4), colpito (2).
- Sfondo trasparente, nessun testo.
- Luce principale in alto a sinistra.
- Silhouette riconoscibile in nero pieno anche a dimensione ridotta.
- Un solo accento di colore neon, riservato all'arma, per far leggere subito dove parte il colpo.

Evita: pose ambigue, armi che coprono il corpo, dettagli minuscoli che spariscono su telefono.
Consegna con la checklist di consegna compilata e dichiara ogni assunzione.
```

### 5.2 Lulù, sprite sheet base

```
Crea lo sprite sheet base di LULÙ, compagna di Nox, stesso stile pixel art.
Lulù è il personaggio della "risonanza": silhouette più slanciata e leggera, contrasto netto con Nox.

Specifiche:
- Altezza personaggio: 288 px. Cella 320×320 px.
- Righe: idle (4), camminata (6), marca (4), scudo (4), colpito (2).
- Sfondo trasparente, nessun testo.
- Accento di colore diverso da quello di Nox (complementare), usato solo sugli elementi di risonanza.
- Le due silhouette, affiancate in nero pieno, devono essere distinguibili al primo sguardo.

Consegna con la checklist compilata e le assunzioni dichiarate.
```

### 5.3 Effetti Due Colpi

```
Crea gli effetti visivi del "DUE COLPI", meccanica centrale del gioco:
Primo Colpo = marca il bersaglio; Secondo Colpo = chiude il circuito.

Servono 4 effetti, ognuno come sprite sheet con sfondo trasparente:
1. marca sul bersaglio (loop, 6 frame)
2. chiusura del circuito tra i due colpi (one-shot, 8 frame)
3. rimbalzo tra due nemici (one-shot, 8 frame)
4. scudo spezzato (one-shot, 6 frame)

Regole: leggibili in meno di mezzo secondo, non devono coprire il personaggio né il telegraph del nemico,
colori presi dagli accenti di Nox e Lulù, nessun testo.
```

### 5.4 Sfondo cantiere al buio (apertura)

```
Crea lo sfondo del livello di apertura: un cantiere di notte, quasi al buio, con una sola cassa illuminata.

Specifiche:
- 1536×1536 px, WebP.
- La cassa illuminata è il punto focale e deve attirare lo sguardo entro 2 secondi.
- Ostacoli e zone calpestabili devono essere leggibili senza ambiguità: niente oggetti decorativi che sembrino percorribili.
- Nessun testo, nessuna figura umana nello sfondo.
- Alto contrasto tra pavimento (calpestabile) e ostacoli.

Consegna anche una versione con le zone calpestabili evidenziate in colore piatto (solo per riferimento del programmatore).
```

### 5.5 Hub Moon

```
Crea lo sfondo dell'hub MOON, primo hub del gioco: deve essere inconfondibile rispetto agli altri tre hub.

Specifiche:
- 1536×1536 px, WebP, palette propria dell'hub.
- Zone ben distinte: ingresso, 3 punti di servizio (negozio, dialogo, segreto), passaggio verso le missioni.
- Ogni punto di servizio deve avere una facciata riconoscibile, non un riquadro generico.
- Nessun testo.

Poi crea i 3 interni dei servizi, ciascuno diverso dagli altri (1536×1536 px). Nessun interno può essere riciclato in un altro hub.
```

### 5.6 Boss The Anchor

```
Crea il boss THE ANCHOR in pixel art.

Specifiche:
- Sprite principale + 2 fasi di combattimento (intera e danneggiata).
- Stato "colpito" per ogni fase.
- Telegraph dell'attacco: un frame di preparazione molto chiaro, con indicatore a terra della zona colpita.
- Elemento ambientale interattivo: i cavi che il giocatore può tagliare, disegnati come oggetti separati.
- Sfondo trasparente, nessun testo.

Il giocatore deve capire quale attacco sta arrivando guardando solo la silhouette e il telegraph.
```

### 5.7 HUD

```
Crea gli elementi HUD per telefono.
- Barra vita di Nox e Lulù, ben distinguibili.
- Indicatore del Secondo Colpo (carico / scarico).
- Pulsanti touch: SPARA, SCHIVA, CAMBIA, con area di tocco minima 48 dp.
- Nessun elemento nella parte bassa centrale dove arriva il dito.
- Nessun testo dentro le immagini: le etichette le aggiunge il codice.
```

---

## 6. Dopo la consegna

1. Il Game Director conferma o corregge le voci **[DA CONFERMARE]**.
2. Ogni asset approvato entra nel repo con la sua riga nel manifest.
3. Gli asset non approvati restano in una cartella `da_rifare/` con la nota del motivo.
4. Lo sprint si chiude quando i primi 6 asset sono provati **in gioco su un telefono**, non solo guardati su schermo.
