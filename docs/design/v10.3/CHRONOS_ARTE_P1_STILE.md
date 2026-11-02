# CHRONOS Adventure: Nox & Lulù — Grafica

## Benchmark e Pilastro 1: regole di stile

2 novembre 2026 · **in attesa dell'approvazione dell'autore** (regole e rigenerazione dei 3 boss) · `COMMERCIAL_RELEASE = BLOCKED`

Repo misurato: `Flexati/Adventure-city`, ramo `work/chronos-adventure-commercial`, commit `583e68b`. **Il documento non modifica nessun asset del gioco.** Ogni numero segnato [FATTO] si riproduce con `python3 -I tools/art_style_audit.py`, che legge i file in sola lettura. Risultati: [`art_style_audit.json`](../../evidence/v10.3/art-style/art_style_audit.json) e [`silhouettes_32px.png`](../../evidence/v10.3/art-style/silhouettes_32px.png). Nel Pilastro 2 i controlli diventano test Node.

**Il team**
- **AD**, Art Director pixel art: leggibilità, palette, sagome, luce, coerenza di stile.
- **TA**, Technical Artist: atlanti, pivot, hitbox visive, compressione, budget mobile.
- **PR**, Producer: pipeline con l'IA, controllo qualità, costi.

**Legenda**
- **[FATTO]**: misurato sui file del repo, letto nel codice (`file:riga`) o preso da una fonte esterna (link in fondo).
- **[IPOTESI]**: valore proposto o deduzione, sempre con la ragione.
- **Unità:** il mondo di gioco misura 1536 × 1536 unità (`scenery.mjs:4`); una tile vale 64 unità (`layouts.mjs:2`).
- **Densità** = pixel dell'immagine sorgente per unità di mondo. Esempio: Nox ha una cella alta 301,5 px e viene disegnato alto 112 unità, quindi 301,5 ÷ 112 = 2,69.

**A chi si applicano le regole**

| Gruppo | Come si applicano |
|---|---|
| **Asset nuovi** (boss, nemici, ambienti ancora da fare) | Tutte, e bloccano l'integrazione se falliscono |
| **Nox e Lulù V8** | Si **misurano**, ma non si correggono: non si ridisegnano corpi e volti, e gli originali non si toccano. Un derivato tecnico, per esempio lo stesso disegno rimpicciolito, solo con il tuo sì e solo nel Pilastro 3 |
| **Altri asset esistenti** | Si misurano. Si correggono nei derivati quando vengono toccati per altri motivi |

---

## 0. Cosa dicono le misure, prima delle regole

Il brief descrive una pixel art a palette limitata con una sola scala. Gli asset di oggi sono diversi. Ecco i numeri **[FATTO]**.

| # | Aspetto | Misura | Conseguenza |
|---|---|---|---|
| 1 | **Colori per fotogramma** | Nox 11.800–12.000, Lulù 10.800–10.900, gang 18.200. Nemici e boss chrono 3.000–7.600. Mappe di distretto 192, in PNG indicizzato | Oggi non c'è una palette limitata: sono illustrazioni ad alta risoluzione disegnate senza smussatura |
| 2 | **Densità** | Va da **1,0 a 2,92 px per unità**: quasi ×3 (tabella al §1.1). Il boss chrono disegnato a 230 unità scende a 0,56 | Sullo schermo, un pixel del boss chrono è **4,8 volte** più grande di un pixel di Nox: (230 ÷ 128) ÷ (112 ÷ 301,5) = 1,797 ÷ 0,371 |
| 3 | **Trasparenza** | Negli sheet v05 (Nox, Lulù, gang) e in Kairn il 99,7–99,8 % dei pixel visibili ha alfa sotto 255, e circa tre su quattro stanno tra 250 e 253. Gli asset chrono hanno solo 0 o 255 | Gli eroi sono leggermente trasparenti (circa l'1–2 %) |
| 4 | **Contorno** | Eroi: bordo scuro, con luminanza mediana 7–12 su 255 e dal 23 al 45 % di nero puro. **I 3 boss già pronti non hanno contorno scuro:** il bordo è a 29–48, e su Bone Tyrant e Shadow Reaper è più chiaro dell'interno | Sullo sfondo i boss nuovi si staccano meno degli eroi |
| 5 | **Sagome a 32 px** | Sovrapposizione Nox–Lulù 0,79–0,84 (1 = identiche). Nox–gang 0,51 | A 32 px Nox e Lulù sono quasi la stessa forma. Vedi l'immagine [`silhouettes_32px.png`](../../evidence/v10.3/art-style/silhouettes_32px.png) |
| 6 | **Colori riservati** | Shadow Reaper ha il **3,9 %** dei pixel nel magenta di Lulù. La mappa fracture ha il **5,2 %** dei pixel nel rosso-arancio del pericolo. Le altre mappe hanno 0–0,52 % | Il nucleo del Reaper «parla» come Lulù. La mappa fracture fa concorrenza ai cerchi rossi |
| 7 | **Minaccia senza colore** | Il cerchio rosso ha già 3 segnali che non dipendono dal colore: un riempimento che cresce, la scritta («SCHIVA», «CARICA») e il tratteggio che diventa pieno quando la mira si blocca (`runtime.mjs:886–894`). Contrasto con il terreno mediano: 6,5–7,2:1. Con il **terreno chiaro** (il 10 % più chiaro): 2,3–3,3:1 | Su clinic e fracture si scende sotto 3:1 |
| 8 | **Boss** | Il brief ne elenca 8. In Fase 3 hai deciso che la Parte I ne ha 9: Rook, The Anchor, Custode, EVE, Archon, Bone Tyrant, Behemoth, Shadow Reaper, Vega. Root Engine, Twelfth Observer, The Ram e Lamplight King vanno negli aggiornamenti dopo il lancio | La grafica segue la tua decisione, non la lista del brief |
| 9 | **Chrono Shift** | Gli stati da disegnare includono il Chrono Shift, che nel gioco non esiste ancora (Pilastro 2 del combattimento) | Nessuna tavola finché la meccanica non è decisa |

---

## Benchmark

**Una aggiunta, nessuna sostituzione.**
- Aggiungo **Children of Morta**: è l'unico dei riferimenti che, come CHRONOS, è un gioco d'azione **visto dall'alto** in pixel art ed è uscito su Android (Fase 2).
- Hades **non è pixel art**: i personaggi sono modelli 3D trasformati in fotogrammi 2D. Lo tengo per quello che chiede il brief, cioè ritratti ed espressioni.

### 1. Dead Cells (Motion Twin, 2018)
- **Cosa fa.** Modelli 3D in 3ds Max, renderizzati molto piccoli (il personaggio è alto circa 50 px) **senza antialiasing**, con un toon shader e le normal map. Prima i fotogrammi chiave, poi quelli intermedi **[FATTO]**, Thomas Vasseur.
- **Il colore.** Tre livelli: lo sfondo ha il contrasto più basso, gli oggetti interattivi stanno nel mezzo, **le minacce hanno la saturazione, il contrasto e la luminosità più alti** **[FATTO]**.
- **Da prendere.** La gerarchia a tre livelli come regola misurabile (§1.2, P5).
- **Da non prendere.** La pipeline 3D: noi lavoriamo con immagini IA 2D. E i pixel che sfarfallano, che l'autore ammette di non aver risolto: da noi succede lo stesso quando il gioco rimpicciolisce Nox di 2,3 volte **[IPOTESI]**.

### 2. Hyper Light Drifter (Heart Machine, 2016)
- **Cosa fa.** Alx Preston dice di curare prima di tutto **colore e sagoma**, e che contrasto e atmosfera decidono la prima impressione **[FATTO]**, intervista ad Automaton (traduzione mia).
- **Perché funziona.** Una risoluzione piccola rende sostenibile il lavoro per un team piccolo. Che Preston sia passato dall'illustrazione HD alla bassa risoluzione proprio per questo è **[IPOTESI]**: lo dice una fonte secondaria.
- **Da prendere.** Prima la sagoma, poi i dettagli: il test a 32 px viene prima della revisione a colori.
- **Da non prendere.** Personaggi minuscoli: su 6" Nox è già alto 74 dp. E il binomio rosa-ciano dappertutto, perché da noi ciano e magenta sono riservati a Nox e Lulù.

### 3. Katana Zero (Askiisoft, 2019)
- **Cosa fa.** Luci al neon su ambienti scuri e sporchi, in stile anni '80 **[FATTO]**, intervista a Justin Stander su Gamereactor.
- **Perché funziona.** Secondo una fonte secondaria, il neon serviva anche a **uniformare gli stili** di artisti diversi **[IPOTESI]**.
- **Da prendere.** Lo stesso strato di luce d'accento su asset nati in sessioni IA diverse: è il modo più economico di renderli coerenti.
- **Da non prendere.** Il neon ovunque. La nostra bibbia lo vieta già: «Controlled neon, not neon everywhere» (`docs/SPRITE_VISUAL_PRODUCTION_BIBLE_V70.md:28`) **[FATTO]**.

### 4. Hades (Supergiant Games, 2020)
- **Cosa fa.** I ritratti dipinti da Jen Zee sono il riferimento da cui l'artista 3D costruisce il personaggio **[FATTO]**, video Supergiant riportato da più fonti. Personaggi modellati e animati in Maya e poi trasformati in fotogrammi 2D **[IPOTESI]**, fonte secondaria.
- **Perché funziona.** Il ritratto e lo sprite hanno la stessa origine: un'unica identità.
- **Da prendere.** Il ritratto come **modello d'identità**: palette e accessori dello sprite si ricavano dal ritratto, mai il contrario. Un numero fisso di espressioni per personaggio (Pilastro 4).
- **Da non prendere.** La quantità: le fonti parlano di 59 ritratti e 68 modelli **[IPOTESI]**. Come nascano le varianti d'espressione non l'ho trovato.

### 5. Sea of Stars (Sabotage Studio, 2023)
- **Cosa fa.** Pixel art con luce dinamica prodotta da una pipeline di rendering propria. Lo studio dice che **tutti gli asset devono rispondere alle esigenze tecniche della luce** **[FATTO]**, comunicati e intervista.
- **Perché funziona.** La luce è stata decisa prima degli asset, e non corretta dopo.
- **Da prendere.** Una sola direzione di luce come regola di produzione, scritta in ogni prompt (§1.5).
- **Da non prendere.** La luce dinamica con normal map: il Canvas 2D del WebView non ha shader, e su un telefono di fascia media costerebbe troppo **[IPOTESI]**. Gli sfondi a strati con parallasse li descrive solo un blog **[IPOTESI]**.

### 6. Children of Morta (Dead Mage, 2019; Playdigious su mobile)
- **Cosa fa.** Pixel art dipinta a mano, animazione fotogramma per fotogramma e luce moderna **[FATTO]**, descrizione dello store. Il team dice di aver usato luci ad alta risoluzione invece di luci pixelate **[IPOTESI]**: l'intervista di TechRaptor oggi risponde con l'errore 403.
- **Perché funziona.** Mostra che personaggi in pixel e una luce più morbida possono sembrare premium insieme, purché la regola sia la stessa ovunque.
- **Da prendere.** La prova che la nostra miscela (eroi ad alta risoluzione, nemici a 128 px) può funzionare **se** la densità e il contorno diventano uguali.
- **Da non prendere.** Le luci dinamiche, per lo stesso motivo di Sea of Stars.

---

## Pilastro 1 — Regole di stile

### 1.1 Scala: un pixel, un'unità fissa (prevale il TA)

**La misura di oggi [FATTO]**

| Asset | Altezza in px | Disegnato a (unità) | Densità |
|---|---|---|---|
| Nox e Lulù (v05) | 301,5 | 112 (`runtime.mjs:772`) | **2,69** |
| Nemico base della gang (v05) | 303,75 | 104 (`runtime.mjs:826`) | 2,92 |
| Bruto (v05) | 303,75 | 132 | 2,30 |
| Boss v05 | 303,75 | 190 | 1,60 |
| Archon (Custode ricolorato) | 303,75 | 230 (`runtime.mjs:825`) | 1,32 |
| Kairn / Morrow | 288 / 308 | 122,2 / 140,8 | 2,36 / 2,19 |
| Nemico chrono (purple guard) | 128 | 104 (`runtime.mjs:823`) | **1,23** |
| Civili chrono | 128 | 88 (`runtime.mjs:846`) | 1,45 |
| Boss chrono (overlord) | 128 | 230 (`runtime.mjs:821`) | **0,56** |
| Pavimento chrono | 128 | 64 (`scenery.mjs:13`) | 2,00 |
| Muri chrono | 128 | 128 (`scenery.mjs:26`) | 1,00 |

**Quanto vale un'unità sullo schermo.** In verticale, 1 unità = 0,66 px CSS (`visuals.mjs:101`). Il gioco disegna la tela a 1,75 volte (`runtime.mjs:960`). Quindi 1 unità = 0,66 × 1,75 = **1,155 px della tela**.

**La regola S1: densità unica di 1,25 px per unità** (5 px ogni 4 unità), con tolleranza ±15 %, cioè 1,06–1,44.

Perché 1,25:
- È vicino a 1,155: ogni pixel disegnato diventa circa un pixel della tela, senza pixel buttati né ingranditi.
- È già la densità dei nemici chrono (1,23), che sono la famiglia più recente.
- Dà misure intere e comode: tile 64 u = 80 px, eroe 112 u = 140 px, boss 230 u = 287,5 ≈ 288 px.

**Altezze di riferimento per gli asset nuovi (S2)** **[IPOTESI]**, tutte ricavate da S1:

| Tipo | Altezza disegnata | Altezza sorgente | Cella |
|---|---|---|---|
| Civile | 88 u | 110 px | 128 |
| Nemico base | 104 u | 130 px | 160 |
| Nemico grosso | 132 u | 165 px | 192 |
| Boss | 190–230 u | 238–288 px | 320 |
| Tile | 64 u | 80 px | 80 |

**Il conflitto.** I 3 boss «già pronti» (Bone Tyrant, Behemoth, Shadow Reaper) sono strisce alte 128 px.
- Se si disegnano grandi come un boss (230 u), la densità è 0,56: ogni loro pixel è 2,2 volte più grande del pixel di regola.
- Se si disegnano alla densità giusta, sono alti 128 ÷ 1,25 = 102 u, **più bassi di Nox** (112 u).
- **L'AD dice di rigenerarli a 288 px**, usando le strisce attuali come riferimento. **Il PR segnala il costo**: 3 tavole in più nella coda delle immagini.
- È la domanda alla fine.

### 1.2 Palette (prevale l'AD; il PR sul costo)

| Regola | Valore | Perché |
|---|---|---|
| **P1 Colori per sprite** | Nemici ≤ 48, boss ≤ 64, oggetti ≤ 24, ogni effetto (FX) ≤ 16 **[IPOTESI]** | Ho provato su una **copia** di Nox, rimpicciolita alla densità S1: con 48 colori l'errore medio è 7,7 su 441 (1,7 %) e il 95° percentile 28 (6,4 %). Con 32 colori sale a 10,0 e 35,6 **[FATTO]**. Nox resta com'è |
| **P2 Palette per distretto** | 64 colori, in un file JSON nel repo. Ambienti e oggetti usano **solo** quei colori. I nemici ne prendono almeno il 75 % dei pixel **[IPOTESI]** | Gli asset IA nascono con migliaia di colori: riportarli a una palette comune è il modo più economico per farli sembrare dello stesso gioco |
| **P3 Rampe** | Da 2 a 4 toni per materiale: base, 1–2 ombre, 0–1 luce. L'ombra si sposta verso il blu-viola di 10–30°, la luce verso il giallo di 5–20°. Tra un gradino e l'altro almeno 8 punti di luminosità L* **[IPOTESI]** | A 1 arcominuto per pixel (§1.4) due toni troppo vicini sullo schermo si fondono |
| **P4 Colori riservati** | Vedi la tabella sotto | Dead Cells: le minacce si leggono perché nessun altro ha il loro colore |
| **P5 Gerarchia di contrasto** | Contrasto del terreno < oggetti interattivi < minacce | Dead Cells **[FATTO]** |

**P4 — I colori riservati.** Si misurano solo i pixel con «aspetto da segnale»: saturazione ≥ 0,35 e luminosità ≥ 0,9 in HSV, come i colori dell'interfaccia di oggi.

| Significato | Tonalità | Colori nel codice **[FATTO]** | Dove si può usare |
|---|---|---|---|
| **Pericolo** | 340°–40° | #ff6343 (10°), #ff997b (14°), #ffb74b (36°), #ff6a8a (347°) | Attacchi, cerchi rossi, proiettili. Sui nemici ≤ 5 % dei pixel. Su ambienti e alleati ≤ 1 % |
| **Nox** | 175°–200° | #7df0f4 (182°) | Abilità e interfaccia di Nox. Su nemici e ambienti ≤ 1 % |
| **Lulù** | 275°–325° | #e4a4ff (282°), #ff7fd8 (318°) | Abilità e interfaccia di Lulù. Su nemici e ambienti ≤ 1 % |
| **Interattivo** | 140°–170° | #7dffd0 (158°), pulsante ATTIVA | Nodi, porte, oggetti da usare. Altrove ≤ 1 % |
| **Luce calda civile** | 30°–55° | (bibbia: sicurezza) | Solo con saturazione < 0,35, per non confondersi con l'arancio del pericolo |

**Oggi** **[FATTO]**:
- Mappe city, port e clinic: 0–0,52 % nel pericolo. **Promosse.**
- Mappa fracture: **5,2 %**. **Bocciata.**
- Gang: 3,4 % nel pericolo. **Promossa.**
- Shadow Reaper: **3,9 % nel magenta di Lulù**. **Bocciato.**
- Bone Tyrant e Behemoth: ≤ 0,8 % per banda. **Promossi.**
- **Nota:** Nox e Lulù hanno lo 0 % nei loro colori riservati. Il ciano e il magenta vivono nell'interfaccia e negli effetti, non negli sprite.

**Minaccia senza colore (P6).**
- Ogni minaccia ha almeno **2 segnali che non dipendono dal colore**: forma che cresce, tratteggio che diventa pieno, scritta, movimento.
- Ha un contrasto di luminanza **≥ 3:1** anche con il terreno più chiaro della mappa (il 90° percentile). È la soglia WCAG 2.1 per gli elementi grafici (1.4.11) **[FATTO]**.
- **Oggi:** city 3,3:1 e port 3,2:1 promosse; **clinic 2,4:1 e fracture 2,3:1 bocciate**.
- La correzione possibile, un bordo scuro di 2 px intorno al cerchio, è un ritocco dell'interfaccia: la porto nel Pilastro 4.

### 1.3 Sagome (prevale l'AD)

| Regola | Valore | Oggi |
|---|---|---|
| **Sil1 Il test** | Maschera alfa (≥ 128) nera su bianco, alta 32 px, riduzione senza smussatura | Script pronto |
| **Sil2 Personaggi nella stessa scena** | Sovrapposizione delle sagome (IoU) ≤ 0,75. Eroe contro nemico ≤ 0,65 **[IPOTESI]** | Nox–gang 0,51 **[FATTO]**, promossa. **Nox–Lulù 0,79–0,84, bocciata, ma sono bloccati** |
| **Sil3 Boss** | Alto sullo schermo almeno 1,6 volte l'eroe | 190–230 u contro 112 u = 1,7–2,05 volte **[FATTO]**, promosso |
| **Sil4 Posa d'attacco** | Il fotogramma di preparazione differisce dal fermo di IoU ≤ 0,85: la posa cambia forma, non solo colore **[IPOTESI]** | Da misurare per ogni nemico nel Pilastro 2 |

**Nox e Lulù, senza ridisegnarli.**
- Decide il test con i giocatori (Pilastro 5): devono riconoscerli a 32 px **almeno 9 volte su 10**.
- Se il test fallisce, l'AD propone un **segno a terra di forma diversa**: un rombo per Nox e un cerchio per Lulù, sotto i piedi.
- Il segno distingue con la forma e non con il colore, e non tocca gli sprite.

### 1.4 Contorno (l'AD decide il colore, il TA lo spessore)

**Il calcolo.**
- Alla densità S1, un pixel disegnato vale 0,8 unità, cioè 0,8 × 0,66 = 0,53 dp = **0,084 mm** sullo schermo.
- A 30 cm di distanza fa 0,084 ÷ 300 = 0,00028 radianti = **0,96 arcominuti**.
- L'acuità visiva normale è di circa 1 arcominuto **[FATTO]**, quindi un contorno di 1 px è al limite della visibilità.

**Il conflitto con il brief.**
- Il brief chiede 1 px per gli sprite piccoli e 2 px per i boss.
- **Scelgo 2 px per tutto ciò che si muove**: nemici, boss, proiettili grandi. Fanno 1,9 arcominuti: si vedono. Uguali per tutti, così un boss non sembra disegnato da un'altra mano.
- 1 px resta per le linee interne e per gli oggetti alti al massimo 48 px.

| Regola | Valore | Oggi **[FATTO]** |
|---|---|---|
| **C1 Spessore** | 2 px per ciò che si muove; 1 px solo per linee interne e oggetti ≤ 48 px | — |
| **C2 Luminanza** | Fascia di 2 px sul bordo: luminanza mediana ≤ metà di quella interna | Eroi 7–12 contro 35: promossi. **Boss nuovi 29–48 contro 26–53: bocciati** |
| **C3 Colore** | Il tono più scuro della rampa del materiale vicino. Nero puro (RGB ≤ 8) ≤ 10 % del bordo | Eroi 23–45 % di nero puro: bloccati, quindi esenti. Boss nuovi 0 % |

### 1.5 Luce (prevale l'AD)

| Regola | Valore | Come si verifica | Oggi **[FATTO]** |
|---|---|---|---|
| **L1 Direzione** | Una sola: dall'alto a sinistra. Le ombre cadono in basso a destra. Si scrive in ogni prompt | **Script, solo avviso:** la luminosità media della metà in alto a sinistra divisa per quella in basso a destra deve essere ≥ 1,10. Poi un tester confronta lo sprite con una sfera di riferimento | Lulù 1,29–1,30. Nox 1,05–1,07 (la felpa bianca falsa la misura). Bone Tyrant 1,28. Behemoth 1,02. Reaper 1,02. Overlord 0,96. **È solo un avviso, perché i vestiti chiari e scuri ingannano lo script** |
| **L2 Gradini d'ombra** | 2–4 toni per materiale (vedi P3) | Script sulle rampe dichiarate nel file della palette | — |
| **L3 Niente ombra a terra** | Lo sprite non contiene ombra: il gioco disegna un'ellisse nera al 44 % (`runtime.mjs:866`) | **Script, solo avviso:** nel 6 % più basso dello sprite la parte piena deve essere ≤ 60 % della larghezza. Poi controllo a occhio | Nox e Lulù 26 %. Behemoth 49 %. Reaper 19 %. Bone Tyrant **89 %**: l'ho guardato, è la veste e non un'ombra |
| **L4 Luci proprie (neon, nuclei)** | Pixel molto luminosi e saturi (V ≥ 0,9, S ≥ 0,6) ≤ 8 % dello sprite, e solo nei colori del proprietario (P4) **[IPOTESI]** | Script | Shadow Reaper: il nucleo magenta va contro P4 |

### 1.6 Testo negli sprite

**T1: nessun testo leggibile.** Lo verifica un tester sullo sprite ingrandito 2 volte. Le scritte sui cerchi rossi («SCHIVA», «CARICA») sono interfaccia, non sprite, e restano.

---

## Tabella di output: regola → valore → verifica

| Regola | Valore numerico | Come si verifica | Script o tester | Oggi |
|---|---|---|---|---|
| S1 Densità | 1,25 px/unità ±15 % (1,06–1,44) | Altezza della cella divisa per l'altezza disegnata, letta da `chrono-manifest.mjs` e `sheet-layout.mjs` | Script | 2 asset su 11 dentro (nemico chrono, Archon) |
| S2 Altezze | Civile 110, nemico 130, grosso 165, boss 238–288 px | Riquadro dei pixel opachi | Script | Boss nuovi 104 px: bocciati |
| P1 Colori per sprite | Nemico ≤ 48, boss ≤ 64, oggetto ≤ 24, FX ≤ 16 | Conteggio dei colori unici sui pixel con alfa ≥ 128 | Script | Tutti oltre (3.000–18.000) |
| P2 Palette di distretto | 64 colori; ambienti al 100 %, nemici ≥ 75 % | Ogni pixel confrontato con il JSON della palette | Script | Palette ancora da scrivere |
| P3 Rampe | 2–4 toni, ΔL* ≥ 8 tra gradini | Lettura del JSON della palette | Script | — |
| P4 Colori riservati | ≤ 1 % fuori dal proprietario (pericolo ≤ 5 % sui nemici) | Percentuale dei pixel «da segnale» (S ≥ 0,35, V ≥ 0,9) in ogni banda | Script | Fracture 5,2 % e Reaper 3,9 %: bocciati |
| P5 Gerarchia | Terreno < interattivi < minacce | Contrasto medio di ciascun livello sullo screenshot di gioco | Script e tester | — |
| P6 Minaccia senza colore | ≥ 2 segnali non di colore; ≥ 3:1 sul terreno chiaro | Contrasto WCAG con il 90° percentile del terreno; screenshot in bianco e nero | Script e tester | Clinic 2,4 e fracture 2,3: bocciate |
| Sil2 Sagome | IoU ≤ 0,75 nella stessa scena; eroe e nemico ≤ 0,65 | Maschere a 32 px allineate in basso al centro | Script | Nox–Lulù 0,79–0,84 (bloccati) |
| Sil3 Boss | ≥ 1,6 volte l'eroe | Altezza disegnata | Script | 1,7–2,05: promosso |
| Sil4 Posa d'attacco | IoU tra preparazione e fermo ≤ 0,85 | Maschere a 32 px | Script | Da misurare |
| C1 Spessore | 2 px per ciò che si muove | Larghezza della fascia scura dal bordo verso l'interno | Script e tester | — |
| C2 Luminanza | Bordo ≤ 0,5 × interno | Mediana della fascia di 2 px contro mediana dell'interno | Script | Boss nuovi bocciati |
| C3 Nero puro | ≤ 10 % del bordo | Pixel del bordo con RGB ≤ 8 | Script | Boss nuovi 0 %: promossi |
| L1 Luce | Rapporto ≥ 1,10, poi confronto con la sfera | Metà in alto a sinistra contro metà in basso a destra | Script (avviso) e tester | 3 boss su 4 in avviso |
| L3 Ombra a terra | Fascia bassa ≤ 60 % della larghezza | 6 % più basso del riquadro | Script (avviso) e tester | Bone Tyrant in avviso: è la veste |
| L4 Luci proprie | ≤ 8 %, nei colori del proprietario | Pixel con V ≥ 0,9 e S ≥ 0,6 | Script | Reaper bocciato (P4) |
| Alfa | Solo 0 o 255 negli sprite di gioco | Istogramma del canale alfa | Script | Sheet v05 al 99,8 % parziali (eroi bloccati) |
| T1 Testo | Nessuna scritta leggibile | Sprite ingrandito 2 volte | Tester | — |

---

## Conflitti dichiarati e scelta

| Conflitto | Scelta | Chi prevale e perché |
|---|---|---|
| Contorno di 1 px chiesto dal brief, contro la visibilità | 2 px per tutto ciò che si muove | AD e TA insieme: 1 px vale 0,96 arcominuti e su 6" non si vede |
| Palette ridotta, contro la ricchezza delle immagini IA | ≤ 48 colori sui nemici, riduzione automatica nel derivato | Il PR: la riduzione costa 0 tavole in più. L'AD controlla il 95° percentile dell'errore |
| Le regole, contro il canone su Nox e Lulù | Esenti: si misurano, non si correggono | Il canone vince sempre. La sagoma la decide il test dei giocatori |
| I 3 boss pronti, contro la scala | Rigenerarli a 288 px | L'AD, per lo schermo. Il PR segnala il costo. **Decidi tu** |
| Shadow Reaper magenta come Lulù | Ricolorare il nucleo nel derivato, mai nell'originale | L'AD: il giocatore non deve leggere il boss come un alleato |

---

## Fonti

- Dead Cells: [3D pipeline per l'animazione 2D, Thomas Vasseur](https://www.gamedeveloper.com/production/art-design-deep-dive-using-a-3d-pipeline-for-2d-animation-in-i-dead-cells-i-), [Colori e leggibilità](https://gamedeveloper.com/production/art-design-deep-dive-giving-back-colors-to-cryptic-worlds-in-i-dead-cells-i-)
- Hyper Light Drifter: [Automaton, intervista](https://automaton-media.com/articles/interviewsjp/20170525-47328/), [Wikipedia](https://en.wikipedia.org/wiki/Hyper_Light_Drifter)
- Katana Zero: [Gamereactor](https://www.gamereactor.eu/news/748453/Katana+Zero+was+inspired+by+Korean+revengethrillers/), [TechRaptor](https://techraptor.net/content/indie-interview-katana-zero)
- Hades: [Game Developer](https://gamedeveloper.com/art/learn-how-supergiant-brought-i-hades-i-hand-painted-characters-to-life), [MCV/Develop](https://mcvuk.com/business-news/behind-the-art-of-hades-we-value-artistic-integrity-and-excellence-in-artistic-craft-at-supergiant-however-were-first-and-foremost-a-game-design-lead-team/)
- Sea of Stars: [Sabotage, press kit](https://sabotagestudio.com/presskits/sea-of-stars), [Megavisions](https://megavisions.net/the-art-of-sea-of-stars-a-sea-of-pixels)
- Children of Morta: [TechRaptor](https://techraptor.net/content/how-dead-mage-created-the-art-for-children-of-morta) (oggi 403), [Shacknews](https://shacknews.com/article/113718/children-of-morta-review-all-in-the-family), [Engadget](https://www.engadget.com/2018-03-22-children-of-morta-hands-on-indie-xbox-gdc.html)
- Contrasto: [WCAG 2.1, criterio 1.4.11](https://www.w3.org/TR/WCAG21/#non-text-contrast)
