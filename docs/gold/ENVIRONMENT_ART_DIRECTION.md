# CHRONOS ADVENTURE: NOX & LULÙ — Direzione Artistica e Identità delle Aree (V3)

Data di verifica: 2026-11-09  
Ramo di riferimento: `work/chronos-adventure-commercial`

---

## 1. Gerarchia di Leggibilità a 6 Livelli (§9.1 · `[INTEGRATO NEL RUNTIME]`)

Ogni schermata giocabile rispetta una separazione rigorosa di luminanza, contrasto e saturazione su 6 piani visivi:

1. **Livello 1 — Eroi, Nemici, Proiettili e Telegrafi di Pericolo (Priorità Massima)**:
   - Valore luminoso `75%–100%`, saturazione alta (`#64deff` per Nox, `#ff75d8` per Lulù, `#ff765e` per telegrafi d'attacco, `#7dffd0` per nodi attivi).
   - Ombra di contatto ellittica sotto i piedi e anello direzionale sempre visibile sopra qualsiasi pavimentazione.
2. **Livello 2 — Nodi di Missione, Relè, Barriere e Punti Servizi Hub**:
   - Inquadrati da piazzole tecniche dedicate (`r = 44` px in missione, `56×36` px davanti alle soglie `d` negli hub) con codice colore diegetico e sprite ad alto dettaglio da `district_props.png`.
3. **Livello 3 — Coperture Tattiche Interne (`2×2` tile) e Ostacoli Solidi**:
   - In missione (`yard`, `arena`): basamento corazzato con cordolo smussato e struttura verticale centrata da `district_props.png` (`112×112` px), immediatamente distinguibile dal suolo calpestabile.
4. **Livello 4 — Quinte Architettoniche Perimetrali e Tetti degli Hub**:
   - Isolati esterni non calpestabili (`#`) renderizzati con i 4 quadranti architettonici di `city.png`, `port.png`, `clinic.png`, `fracture.png` (in missione) e con tetti tipizzati per distretto + grana litica da `environment.png` (negli hub), chiusi da parapetti scuri (`#101a26dd`) lungo ogni bordo adiacente al suolo.
5. **Livello 5 — Suolo Calpestabile, Corsie Tattiche e Piazze**:
   - Valore luminoso controllato (`12%–26%`), texture in pietra scura da `environment.png` cella `0` con micro-variazione deterministica non periodica (`vHash`), giunti d'asfalto non allineati a scacchiera, tombini/griglie di scolo sparsi (`vHash(x,y,7) === 0`) e linee guida tratteggiate verso gli obiettivi.
6. **Livello 6 — Margine Esterno Fuori Mappa (`drawMapBackdrop`)**:
   - Oltre il perimetro `0..1536`, ripetizione in scala `1:1` (senza alcuno stiramento) delle 2 file esterne (`128` px mondo) di architettura perimetrale oscurate da un velo `#04081078`, così da preservare il contrasto dei controlli touch su `390×844`.

---

## 2. Zone Visive Sicure (§9.2 · `[INTEGRATO NEL RUNTIME]`)

- **Attorno ai punti di servizio Hub (`smith`, `vendor`, `inn`, `notice`, `travel`, `race_broker`) e agli NPC**:
  - Le celle `x` (prop decorativi) sono disegnate direttamente sul lastricato stradale/piazzale **senza cordoli murari**, garantendo che nessun falso muro circondi i prop o interferisca visivamente con i punti d'interazione.
  - Ogni soglia `d` proietta sul marciapiede sottostante un tappeto luminoso d'ingresso (`56×36` px) con colore specifico del servizio.
- **Attorno ai Nodi di Missione (`lay.nodes`) e allo Spawn (`lay.start`)**:
  - Area circolare `r = 44` px con riquadro tecnico tratteggiato `128×128` px e indice numerico `01 / 02 / 03` ad alto contrasto, libera da coperture e ostacoli.

---

## 3. Schede di Identità delle 9 Aree Giocabili (§8.2 · `[VISUALMENTE VERIFICATO]`)

### 3.1 I Quattro Hub (Villaggi Esplorabili)

| Hub ID | Nome / Ruolo Narrativo | Palette Dominante + Accenti | Materiali di Suolo e Tetti | Landmark Centrale di Piazza (`768, 768`) | Silhouette Edifici e Prop Distintivi (`x`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`moon`** | **Moon Refuge** · Rifugio portuale notturno della resistenza | Blu ardesia notturno (`#131c29`), lastricato caldo (`#223042`), accenti ambra (`#ffbe6b`) e ciano lunare (`#5fd4ff`) | Ciottolato umido portuale con giunti in pietra blu; tetti a doghe orizzontali con lucernari ciano/ambra | **Pozzo Lunare / Vasca di Risonanza**: bacino circolare concentrico (`r = 78` px) con acqua ciano riflettente, 4 piloni cardinali ambrati e nucleo luminoso | Facciate in mattoni scuri con insegne calde delle botteghe; prop: lampioni portuali ambrati, casse da carico ferrate, panchine in legno |
| **`cathedral`** | **Cathedral Quarter** · Quartiere monumentale delle navate e degli archivi | Pietra fredda (`#171e2b`), navata lastricata (`#263246`), oro liturgico (`#ffd27a`) e ciano sacro (`#7ce2ff`) | Lastre rettangolari di cattedrale con intarsi dorati nella corte centrale; tetti a contrafforti verticali con pinnacoli d'oro | **Rosone di Risonanza a Otto Raggi**: grande intarsio circolare (`r = 84` px) inciso nel pavimento della piazza con raggi dorati e gemma centrale ciano | Facciate gotiche con bifore ad arco e vetrate ciano/oro; prop: bracieri sacri accesi, leggii/reliquari d'archivio, colonne spezzate |
| **`toxic`** | **Toxic Slum Bazaar** · Mercato chimico-industriale nei bassifondi | Fango chimico (`#151f19`), ferro ossidato (`#223127`), verde bio-luminescente (`#8ff26b`) e arancio ruggine (`#ff9c4a`) | Grigliato metallico drenante e cemento macchiato; tetti in lamiera grecata con condotti di sfiato verdi e chiazze acide | **Vasca di Decantazione Bio-Chimica**: bacino ottagonale/circolare (`r = 80` px) con liquido verde reagente, bolle attive e 4 tubazioni radiali arancio/verdi | Facciate di container sovrapposti con oblò verdi e strisce d'allerta; prop: fusti chimici sigillati, valvole a vapore, tende da bazar arancio |
| **`clockwork`** | **Clockwork Outpost** · Avamposto cronometrico di precisione | Ottone brunito (`#1c1724`), lastra incisa (`#2d2438`), oro meccanico (`#ffca64`) e viola/ciano d'arco (`#c98bff`, `#6de6ff`) | Pavimentazione geometrica con binari di sincronizzazione; tetti a scudo metallico con anelli d'ottone e nuclei d'ingranaggio | **Astrolabio / Ingranaggio Madre**: triplo anello concentrico (`r = 84` px) con 8 denti d'ottone radiali, quadrante interno e perno cronometrico ciano | Facciate blindate in bronzo e rame con quadranti luminosi; prop: colonne a ingranaggi, accumulatori al plasma, terminali a pendolo |

### 3.2 I Cinque Layout di Missione ed Esplorazione

| Layout ID | Missioni Associate | Geometria Tattica | Architettura Perimetrale (Quadranti `864×864`) | Coperture / Landmark Interni | Firma Visiva Immediata |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`yard`** | `blackout` (*Cantiere dei Relè*) | Grande piazzale aperto `18×19` con 4 isole di copertura simmetriche `2×2` | 4 quadranti distinti di `city.png` (sottostazioni elettriche, tetti industriali, vicoli al neon, gru di cantiere) | 4 sottostazioni corazzate `2×2` con prop elettrici di `district_props.png` (riga 0) + auto **VORTEX** parcheggiata a sud-ovest con pozzanghere riflettenti | Piazzale d'asfalto scuro bagnato attraversato da corsie tecniche azzurre che collegano i 3 relè ai margini |
| **`elbow`** | `breach`, `below` (*Condotto a Gomito*) | Corridoio verticale ovest (`6×19`) che piega a 90° nel braccio nord (`18×7`) | 4 quadranti distinti di `port.png` (banchine d'attracco, gru navali, canali d'acqua scura, container portuali) | Grande massiccio portuale sud-est non calpestabile che forma il gomito interno, bordato da parapetti metallici ambrati | Imbuto tattico a L con acqua portuale e banchine illuminate a est/sud e corsia tratteggiata ambrata lungo la curva |
| **`spine`** | `exp_chalk_marks`, `ascent` (*Asse di Servizio*) | Dorsale centrale nord-sud (`8×20`) intersecata da 3 baie trasversali (`14×5`) | Quadranti di `port.png` (in `exp_chalk_marks`) o `fracture.png` (in `ascent`) incastrati nei 6 denti laterali che separano le 3 baie | Segni di gesso (`chalk_route_art.png`), fiale di stato (`chalk_flask_states.png`) e rientranze laterali protette per il posizionamento tattico | Struttura a lisca di pesce con corridoio centrale continuo e tre camere trasversali scandite da pilastri industriali |
| **`arena`** | `city`, `zero`, `line`, `finale` (*Piattaforma Orbitale*) | Arena circolare (`r < 10` tile) con 4 piloni `2×2` a croce diagonale | 4 angoli concavi scolpiti con i quadranti di `city.png` o `fracture.png` (faglia viola/oro, torri cronometriche) | **Doppio Anello di Risonanza** concentrico (`r = 250` e `r = 170` px) inciso al centro `(768, 768)` + 4 piloni `2×2` con prop da `district_props.png` | Grande camera circolare per boss fight e difese d'assedio, con perimetro gradonato e bersaglio anulare centrale |
| **`gallery`** | `port`, `contagion`, `archive` (*Galleria di Contenimento*) | Doppia navata verticale (`6×18` a ovest e a est) unita da un ponte centrale (`19×8`) | Quadranti di `clinic.png` (laboratori bio-medici verdi/ turchesi in `contagion`) o `port.png` (`port`, `archive`) nei due pozzi strutturali nord-centro e sud-centro | 2 grandi blocchi di contenimento centrali (sopra e sotto il ponte) che dividono la mappa in due corsie laterali con attraversamento obbligato | Architettura ad H con doppio pozzo d'isolamento centrale e camere di contenimento ai vertici nord |

---

## 4. Regole di Assemblaggio Deterministico e Anti-Ripetizione (§9.3–§9.5 · `[INTEGRATO NEL RUNTIME]`)

1. **Eliminazione totale della scacchiera periodica**:
   - Nessuna formula `(x + y) % k === 0` ad alto contrasto viene applicata al pavimento. La micro-variazione di luminanza tra lastre (`#ffffff07`, `#00000018`) e il posizionamento di griglie/chiusini (`vHash(x, y, 7) === 0`) usano l'hash intero deterministico `vHash(x, y, s) = (((x * 374761393 + y * 668265263 + s * 1442695041) ^ (x * 13)) >>> 0)`.
2. **Mappatura per quadranti degli isolati esterni**:
   - In `scenery.mjs`, i blocchi murari perimetrali (`x < 4 || x > 19 || y < 4 || y > 19`) non ripetono mai una singola casetta su ogni tile `2×2`: i muri vengono aggregati in macro-blocchi (`fino a 12×6` tile) e ciascun quadrante della mappa (`x >= 12`, `y >= 12`) campiona un quadrante differente dell'atlante distrettuale `864×864` (`city.png`, `port.png`, `clinic.png`, `fracture.png`).
3. **Differenziazione delle 4 isole di copertura interna**:
   - Le 4 isole `2×2` all'interno dell'arena (`yard`, `arena`) utilizzano l'indice progressivo `k = (idx++) % 4` per selezionare **4 colonne distinte** (`k = 0, 1, 2, 3`) della riga di distretto in `district_props.png`, garantendo che ogni copertura dell'arena abbia una silhouette unica.
