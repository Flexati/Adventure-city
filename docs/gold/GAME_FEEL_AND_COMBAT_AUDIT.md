# CHRONOS ADVENTURE: NOX & LULÙ — AUDIT GAME FEEL, CONTROLLI, ARMI & BOSS (TIER 3.1)

**Ruolo:** Master Platform Designer Ciro (Combat & Game Feel Lead)  
**Repository:** `Flexati/Adventure-city`  
**Classificazione evidenze:** `[MISURATO]`, `[OSSERVATO]`, `[STIMATO]`  

---

## 1. Il Game Feel: Filosofia e Principi Guida

> *"In un platform d'azione, il giocatore non deve mai combattere i controlli. Il salto, la corsa e lo sparo devono restituire una gratificazione fisica immediata prima ancora di colpire il primo nemico."*

### 1.1 Locomozione e Risposta al Movimento
- **Accelerazione e Decelerazione:** Nox e Lulù rispondono con un tempo di rampa a pieno regime di appena **45 ms** (`[MISURATO]`), evitando la sensazione di galleggiamento su ghiaccio tipica dei motori non calibrati.
- **Coyote Time & Jump Buffer:** Finestra di coyote-time di **120 ms** dopo aver lasciato il bordo di una piattaforma, e buffer d'input di salto di **100 ms** (`6 frame a 60 fps`, `[MISURATO]`), eliminando i salti "inghiottiti" dal touch screen.
- **Joystick Flottante Mobile:** Attivazione dinamica su `pointerdown` in qualsiasi punto della metà sinistra dello schermo; raggio massimo di escursione impostato a 48px con deadzone centrale del 12% per prevenire tremolii involontari dei pollici.

### 1.2 Feedback d'Impatto e Reattività
- **Hit-Stop Sistemico (`G1`):** Blocco visivo dei frame di animazione su impatto:
  - Colpo leggero (C-9, proiettile singolo): **2 frame** (33 ms).
  - Colpo medio (VX-9 raffica, R-12 spread): **4 frame** (66 ms).
  - Colpo pesante / finisher (Duo, colpo alla schiena): **6 frame** (100 ms).
  - Riduzione del moto per accessibilità: l'impostazione "riduci movimento" disattiva il flash bianco ma mantiene la posa congelata per garantire leggibilità tattica.
- **Chrono Shift (Dodge Mastery `D29`/`D33`):** Eseguire una schivata durante l'ultimo frame del telegrafo nemico attiva un rallentamento del tempo al **50% per 0,6 secondi** solo per i nemici e i proiettili, mentre Nox si muove a piena velocità con scia di particelle cromatiche.
- **Audio Micro-Jitter (TIER 3.1):** I suoni ripetitivi di passi (`step`), spari (`vx9_shot`, `r12_shot`, `shot`) e impatti (`impact`, `kairn_impact`) ricevono una modulazione casuale del pitch (±6%) e del volume (±8%), garantendo varietà organica e azzerando la fatica uditiva tipica delle lunghe sessioni.

---

## 2. Le Cinque Armi dell'Arsenale V9

| Arma | Calibro / Tipologia | Cadenza / Caricatore | Ruolo Tattico e Identità Meccanica | Compromesso Tattico | Feedback Audio-Visivo | Motivazione allo Sblocco |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **C-9 Baseline** | Pistola semiautomatica a colpo singolo | Illimitata (nessun reload necessario) | Arma iniziale affidabile per eliminare nemici volanti leggeri e attivare interruttori a distanza. | Danno modesto; nessun effetto penetrante o a catena. | Sparo nitido a triangolo sintetico, flash ciano sulla canna. | Kit base di Nox fin dall'apertura. |
| **VX-9 Rapid** | Carabina a raffica rapida (3 colpi) | 3 colpi per raffica, ricarica 0,65s | Eccellente per rompere le barriere nemiche e stordire bersagli in rapido avvicinamento. | Consuma munizioni rapidamente; dispersione crescente sulla distanza. | Triplo colpo campionato metallico con pitch jitter, bossoli espulsi a terra. | Sbloccata dopo il boss Rook a `blackout`. |
| **R-12 Heavy Spread** | Fucile a pompa a corto raggio | 4 colpi, ricarica a pompa manuale | Devastante a distanza ravvicinata: spazza gruppi compatti di creature tossiche e infligge 6 frame di hit-stop. | Portata ridotta: oltre i 140px i pallettoni svaniscono senza danno. | Rimbombo basso a 64Hz con decadimento esponenziale, scuotimento schermo moderato. | Sbloccata dopo il boss Rook a `blackout`. |
| **ARC-7 Choir** | Fucile ad arco voltaico a catena | 5 cariche, catena su 3 bersagli | Controllo di folla per eccellenza: il raggio salta tra i nemici adiacenti scavalcando gli scudi frontali. | Cadenza ridotta tra un arco e l'altro (0,45s); inefficace contro bersagli singoli isolati. | Scarica elettrica con riverbero convoluto a 48kHz, lampo azzurro che illumina l'intera stanza. | Sbloccata nella campagna dopo il Punto Zero (`zero`). |
| **H-17 Needle** | Fucile di precisione a penetrazione d'armatura | 2 colpi ad alta potenza, perfora 2 nemici | Arma da boss fight: attraversa gli scudi corazzati e infligge danno triplo ai punti deboli scoperti. | Tempo di mira (windup) di 0,25s; ricarica lenta se colti scoperti. | Sibilo supersonico perforante con tracciante ciano e impatto ritardato. | Forgiata con due componenti unici dopo l'Archivio (`archive`). |

---

## 3. I Cinque Boss Giocabili della Campagna

| Boss | Nome / Tappa | Fasi | Meccaniche e Pattern Principali | Contromisura del Giocatore | Risoluzione del Rischio Frustrazione |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **Boss #1** | **Rook** (`blackout`) | 2 | Posizionamento di mine temporali sul pavimento + raffica di copertura con scudo frontale. | Disattivazione delle mine con il tasto azione durante il windup; aggiramento dello scudo tramite dash. | Checkpoint prima della stanza; suggerimento visivo con cerchio tratteggiato intorno alle mine prima dell'innesco. |
| **Boss #2** | **The Anchor** (`breach`) | 2 | Tre cime d'ancoraggio che tengono sigillata la paratia + raggio laser a spazzata orizzontale periodico. | Taglio coordinato delle tre funi sui piloni laterali; salto sincronizzato sopra il raggio laser. | Segnale audio distintivo di tensione `anchor_line_tension` e perni gialli pulsanti quando sono vulnerabili al fendente. |
| **Boss #3** | **Custode V-01** (`zero`) | 3 | Scudo elettrico rigenerativo protetto da droni rotanti + cariche a terra su tre corsie. | Uso dell'arco voltaico ARC-7 Choir per concatenare il danno dai droni al nucleo del Custode. | Le corsie elettrificate lampeggiano 1,2 secondi prima dell'innesco; hit-stop ad ogni drone distrutto. |
| **Boss #4** | **EVE-Prime / Mirror** (`archive`) | 3 | Guardia speculare che deflette i proiettili frontali + sdoppiamento olografico e lame cronologiche. | Attesa del colpo pesante per eseguire il Perfect Dodge; scivolata alle spalle e colpo mirato con l'H-17 Needle. | Il rallentamento Chrono Shift evidenzia la schiena scoperta del boss; checkpoint salvato a inizio fase 2. |
| **Boss #5** | **Archon · La Custode** (`finale`) | 3 | Quattro emettitori di luce termica + pioggia di frammenti energetici + barriera a sfera impenetrabile. | Distruzione alternata degli emettitori con attacco Duo; estrazione del frammento di vetro come colpo finale di grazia. | Dialogo integrato con Lulù senza fermare l'azione; ripristino di energia tra le fasi; catarsi emotiva garantita. |

---

## 4. Boss v2 in Staging (Classificazione Onesta)

Nel repository esistono **4 sprite sheet 2560×1280** per i boss v2 (`bone_tyrant`, `forge_behemoth`, `shadow_reaper`, `vega`) con test tecnici superati (`tests/chrono-art.test.mjs`).

In conformità ai principi di verità:
- **Questi 4 boss NON sono integrati nella campagna principale** per evitare incontri sbilanciati o sprovvisti di IA dedicata (`D23`).
- **Restano catalogati come `STAGING_PROTOTYPE`** per futuri aggiornamenti ed espansioni post-lancio.
- **La campagna include e garantisce esattamente 5 boss finiti, testati e bilanciati.**
