# CHRONOS ADVENTURE: NOX & LULÙ — AUDIT DI EQUILIBRIO E DIFFICOLTÀ (FASE 3)

**Repository:** `Flexati/Adventure-city`  
**Ramo:** `work/chronos-adventure-commercial`  
**Data audit:** 8 novembre 2026  

---

## 1. Parametri Vitali, Movimento, Attacco e Finestre di Schivata

Tutti i parametri sottostanti sono **`[MISURATO]`** direttamente dal codice di simulazione (`game/campaign.mjs`, `game/missions.mjs`, `game/weapons-v9.mjs`, `game/hubs.mjs`) e verificati tramite `npm test`. Nel rispetto della **Regola 4 di `CLAUDE.md`**, nessuna hitbox e nessuna finestra di schivata/parata è stata alterata senza approvazione.

### 1.1 Statistiche Eroi e Difesa
| Parametro | Nox | Lulù | Fonte nel codice (`[MISURATO]`) | Valutazione di Game Feel |
| :--- | :---: | :---: | :--- | :--- |
| **Salute base (`maxHp`)** | `7` (`8` in `blackout`/`below`, `9` in `archive`, `10` in `ascent`/`finale`) | `7` (`8` in `exp_chalk_marks`/`city`/`port`, `9` in `line`) | `game/missions.mjs:39–89`, `game/campaign.mjs:62` | Crescita organica da 8 a 10 HP (+1 con upgrade `shield`, +1 con `Armatura leggera`, +1 con `Cappotto foderato`, +1 col banco fabbro). |
| **Velocità camminata** | `205 px/s` (`147,6 px/s` sotto `heat`) | `205 px/s` | `game/campaign.mjs:305` | Reattiva e leggibile su schermi verticali e orizzontali. |
| **Velocità e durata Schivata (`dash`)** | `660 px/s` per `0,18 s` (`118,8 px`) | `660 px/s` per `0,18 s` (`118,8 px`) | `game/campaign.mjs:304–305` | Copre quasi tutto il raggio dei colpi ad area dei boss (`110–164 px`). |
| **Ricarica Schivata (`dashCd`)** | `1,10 s` (`0,60 s` in `BLACK PULSE`) | `1,10 s` | `game/campaign.mjs:304` | Impedisce lo spam infinito di schivate ma resta sempre pronta per gli attacchi telegrafati. |
| **Invulnerabilità Schivata (`inv`)** | `0,30 s` (`18 frame` a 60 Hz) | `0,30 s` (`18 frame` a 60 Hz) | `game/campaign.mjs:304` | Generosa e chiara (anello tratteggiato con movimento ridotto, lampeggio standard). |
| **Finestra Perfect Dodge (`perfectWindow`)** | `0,14 s` (`0,20 s` in `BLACK PULSE`) | `0,14 s` (`8,4 frame` a 60 Hz) | `game/campaign.mjs:304` | Premia il tempismo: ricarica `+14` barra `DUO`, attiva `counterReady` (`0,60 s`, danno bonus + rompe la guardia) e per Nox attiva il **Chrono Shift (`D29`)**. |
| **Chrono Shift di Nox (`D29`, `D33`)** | Nemici e proiettili a `×0,5` per `0,60 s` (ricarica `3,0 s`) | — (esclusiva di Nox) | `game/campaign.mjs:205, 299` | Eccellente differenziazione tra Nox ( maestro del tempo e del contrattacco) e Lulù (controllo d'area e barriere). |
| **Buffer di Input (`INPUT_BUFFER`, `D27`)** | `0,10 s` (`6 frame` a 60 Hz) su `SCHIVA`, `SPARA`, `PULSE` | `0,10 s` (`6 frame` a 60 Hz) | `game/campaign.mjs:292, 300` | Elimina la sensazione di «tocco mangiato» su schermo mobile durante la fine di un'animazione. |
| **Invulnerabilità post-danno (`hurtHero`)** | `0,70 s` + interruzione canalizzazione nodo | `0,70 s` + interruzione canalizzazione nodo | `game/campaign.mjs:204` | Impedisce che due proiettili simultanei azzerino la vita in un solo istante. |

---

## 2. Differenza e Complementarità tra Nox e Lulù

L'equilibrio tra i due protagonisti è uno dei punti più riusciti dell'architettura di combattimento (`[MISURATO]`):

| Sistema | Nox | Lulù | Impatto tattico |
| :--- | :--- | :--- | :--- |
| **Abilità attiva (`magic`)** | **PULSE**: raggio lungo (`420 px`), danno singolo elevato (`damage × 3 + 2`), rivela il buio per `2,6 s`. | **RISONANZA**: onda ad area (`240 px`), danno (`damage + 1`) + **stordimento di `2,2 s`** (`5,0 s` in stealth su `port`, `+0,7 s` con `Diapason di Lulù`). | Nox elimina minacce prioritarie a distanza; Lulù blocca interi gruppi e taglia all'istante una cima di `The Anchor`. |
| **Abilità speciale (`signature`) in solitaria** | **BLACK PULSE (`overdrive`)**: `5,0 s` di velocità di tiro `×2` e ricarica schivata a `0,6 s`, seguiti da `2,2 s` di surriscaldamento (`heat`, movimento `×0,72`). | **BARRIERA (`barrier`)**: crea fino a 2 scudi fisici (`r = 46 px`, durata `9,0 s` o `11,5 s` con officina, ricarica `7,0 s`) che fermano proiettili e corpi nemici. | In `below` e `archive` Nox gioca d'aggressività e mobilità; in `city` e `line` Lulù costruisce una fortezza attorno alla zona da difendere. |
| **Abilità speciale in coppia** | **DUO**: a barra `100`, cura `+2 HP`, dà `1,0 s` di invulnerabilità, infligge `damage × 2` entro `300 px` e stordisce per `1,2 s`. | **DUO** (identico quando sono insieme). | Rende tangibile sul piano ludico il dolore della separazione nell'Atto III e la gioia del ricongiungimento in `reunion` e `finale`. |
| **Canalizzazione nodi (`startChannel`)** | `0,80 s` (`0,58 s` con `Guanti isolati`) | `0,45 s` (tecnica dei nodi più rapida per natura) | Coerente con il ruolo narrativo di Lulù (`EVE-47`, ingegnera delle reti). |

---

## 3. Bilanciamento delle 5 Armi V9 (`game/weapons-v9.mjs`)

Tabella comparativa (`[MISURATO]` con `c.damage = 2`, valore standard della campagna; moltiplicato per `1,5` con upgrade `power` o `Lente a impulso`):

| ID | Nome Arma | Eroe | Danno/colpo (`× c.damage`) | Raffica / Proiettili | Gittata (`px`) | Cadenza (`cooldown`) | Caricatore | Ricarica | Effetto Speciale | Ruolo Tattico & Equilibrio |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **`c9`** | **C-9** | Nox & Lulù | `1,0×` (`2,0`) | `1` colpo | `360 px` | `0,42 s` (`0,26 s` con **Quickdraw** dopo schivata) | `12` | `1,05 s` | **Quickdraw** (1 s dopo `SCHIVA`, cadenza `0,26 s`) | Arma base affidabile; con Quickdraw premia chi alterna schivata e tiro singolo. |
| **`vx9`** | **VX-9** | Nox | `0,65×` (`1,3` × 3 = `3,9`) | Raffica da `3` colpi (`65 ms` tra colpi) | `390 px` | `0,58 s` | `24` (`8` raffiche) | `1,35 s` | Alta pressione su bersaglio singolo e cime di `The Anchor` | Ottimo DPS sostenuto a media distanza, ma impegna l'eroe per `0,30 s` durante la raffica. |
| **`r12`** | **R-12** | Lulù | `0,55×` (`1,1` × 5 = `5,5`) | `5` pallini a ventaglio (`spread 0,14 rad`) | `235 px` | `0,78 s` | `6` | `1,55 s` | Danno devastante ravvicinato (`5,5` a bruciapelo) | Rischio/ricompensa netto: obbliga Lulù ad avvicinarsi entro `235 px` ed ha caricatore piccolo (`6`). |
| **`h17`** | **H-17 Needle** | Nox | `1,75×` (`3,5`) | `1` colpo perforante | `500 px` | `0,92 s` | `5` | `1,65 s` | **Perfora `2` bersagli** (`pierce: 2`) a lunghissima gittata | Arma di precisione chirurgica per `ascent` e `finale`: colpisce i tiratori e i boss da `500 px` e fora gli scudi di fanteria in linea. |
| **`arc7`** | **ARC-7 Choir** | Lulù | `0,85×` (`1,7`) | `1` arco elettrico | `330 px` | `0,72 s` | `8` | `1,45 s` | **Catena su `3` bersagli** (`chain: 2`, raggio `170 px`) + **stordimento `0,65 s`** | Scelta tattica fondamentale in `city` e `line`: meno danno singolo di `R-12`, ma controlla e interrompe 3 nemici contemporaneamente a distanza sicura. |

### Problema critico individuato e risolto in FASE 6:
- **Prima di FASE 6:** `H-17 Needle` e `ARC-7 Choir` avevano statistiche ben differenziate ma **non si sbloccavano mai nella campagna** perché `campaignArsenalV9` ignorava `eden_technology` e `runtime.mjs` non assegnava `weapon.eden_technology` né `weapon.vega_component`.
- **Dopo FASE 6 (`D42`):**
  1. Sconfiggere `Il Custode V-01` in `zero` (fine Atto II) assegna `weapon.eden_technology`, sbloccando **`ARC-7 Choir`** per tutte le missioni di Lulù nell'Atto III (`city`, `port`, `line`).
  2. Sconfiggere `EVE-Prime` in `archive` (Atto III) assegna `weapon.vega_component` che, unito a `weapon.anchor_component` ottenuto da `The Anchor` in `breach`, sblocca **`H-17 Needle`** per Nox nelle missioni finali (`ascent` e `finale`).

---

## 4. Analisi dei Nemici e dei Boss

### 4.1 Archetipi Nemici (`makeEnemy` in `game/campaign.mjs`)
- **`raider`**: inseguitore rapido corpo a corpo (`hp: 3–4`, `moveSpeed: 132`, `windup: 0,55 s`). Insegna il tempismo base del cerchio rosso.
- **`shooter`**: tiratore a distanza (`hp: 3`, `ranged: true`, mantiene `240 px` di distanza, linea tratteggiata che diventa piena al 60% del `windup`). Costringe a usare i muri e le barriere.
- **`breaker`**: assaltatore corazzato (`hp: 5–6`, raggio d'attacco ampio). Spinge il giocatore fuori dalle coperture statiche.
- **`brute`**: colosso lento ad alto danno (`hp: 8–10`), presente nelle ondate avanzate di `zero`, `city`, `line`, `ascent`.
- **`signal`**: unità di supporto/allarme, prioritaria nelle missioni stealth e di assalto.

### 4.2 Valutazione dei 5 Boss Giocabili nella Campagna (`[MISURATO]`)

| Boss | Tappa | HP (`max`) | Fasi | Meccanica distintiva | Leggibilità dei Telegraph | Punti di forza / Criticità |
| :--- | :---: | :---: | :---: | :--- | :--- | :--- |
| **1. Rook** | `blackout` | `18` | 2 (`<50% HP` spegne le luci `rookDark` e chiama un `breaker`) | Raffica a 3 colpi (`rookAim`, `windup 1,2 s`), piazzamento mine (`r = 84 px`, armamento `0,9 s`, disattivabili sparando) e riposizionamento tattico. | **Eccellente (`9/10`):** linea di mira con blocco al 50% del windup; mine con croce e perimetro tratteggiato. | Ottimo boss introduttivo: insegna che i muri fermano i proiettili e che le mine si possono far brillare o colpire. |
| **2. The Anchor** | `breach` | `26` (+ 3 cime `moor` da `4 HP`) | 2 (`<50% HP` riduce il tempo di ri-ormeggio da `10 s` a `7,5 s`, doppia spazzata a V e chiama 2 `raider`) | Nucleo immobile e invulnerabile finché almeno 1 delle 3 cime è attiva. La **Risonanza** di Lulù taglia una cima in un colpo solo (`campaign.mjs:151`). Spazzata laser (`560×64 px`, `windup 1,25 s`) e schianto ravvicinato (`r = 120 px`). | **Eccellente (`9/10`):** cavi visibili tra nucleo e bitte, fascia arancione che si blocca al 55% prima della spazzata, mira assistita che dà priorità automatica alle cime (`campaign.mjs:107`). | È il boss meglio progettato del gioco: trasforma l'arena in un puzzle dinamico in cui Nox e Lulù collaborano. |
| **3. Il Custode V-01** | `zero` | `26` | 3 (`<67%` e `<34%` chiama ondate di rinforzo) | Ciclo `slam` (`r = 140–164 px`, `windup 1,15→0,91 s`), `charge` (`720 px/s`, `windup 0,85→0,69 s`) e `volley` (ventaglio da `5` a `7` proiettili). | **Buona (`8/10`):** cerchio tratteggiato → pieno per lo schianto; fascia direzionale per la carica. | Scontro intenso di metà campagna; ora ricompensa con `ARC-7 Choir` (`FASE 6`). |
| **4. EVE-Prime (`mirror`)** | `archive` | `28` | 3 (`<67%` e `<34%` accelera il ritmo da `1,1 s` a `0,7 s`) | **Boss adattivo (`campaign.mjs:280`):** se Nox esegue 8 attacchi `gun` consecutivi senza variare con `dash`, `magic` o `overdrive`, EVE-Prime alza una **guardia di `2,2 s`** che annulla i proiettili finché non viene spezzata da un **contrattacco dopo Perfect Dodge (`counterReady`)** o da `PULSE`. | **Molto buona (`8,5/10`):** avviso visivo/testuale `PREVEDIBILE` e `PARATO` quando alza la guardia. | Impedisce lo spam passivo del tasto `SPARA` e costringe a padroneggiare il Chrono Shift di Nox. |
| **5. Archon · La Custode** | `finale` | `34` | 3 + Consenso finale (`consentFinale`) | Nella Fase 2 (`<67% HP`) i ventagli di proiettili partono dai **nodi perimetrali** (`emitter = s.nodes[...]`), creando fuoco incrociato nell'arena; a `1 HP` non può essere uccisa dal fuoco automatico del partner ma richiede l'atto volontario del giocatore (`finalConsent`). | **Molto buona (`8,5/10`):** fuoco incrociato dai nodi ben visibile; climax narrativo integrato nella meccanica. | Chiude l'arco tematico del gioco («Il diritto di dire no») senza trasformarsi in una semplice spugna di proiettili. |

### 4.3 Stato dei 4 Boss Visivi v2 (`M6`) e Matrice 17 Boss (`D23`, `D24`)
- **`bone_tyrant`, `forge_behemoth`, `shadow_reaper`, `vega`**: i 4 fogli sprite `2560×1280` sono stati generati e verificati tecnicamente (`TECHNICALLY_VERIFIED` in `assets/production/v10.3/derived/`), ma sono mantenuti **in staging fuori dal runtime** per decisione esplicita (`D23`, `D30` e test `tests/chrono-art.test.mjs`) finché non avranno pattern d'attacco dedicati, evitando di riciclare il pattern generico del Custode.
- **Altri 8 incontri canonici (`D24`):** pianificati ufficialmente per gli aggiornamenti post-lancio della Parte I.

---

## 5. Economia, Ricompense, Checkpoint e Penalità

### 5.1 Economia dei Quartieri (`game/hubs.mjs`)
- **Entrate totali disponibili in una partita (`[MISURATO]`):**
  - **16 missioni con ricompensa** (`FOOT` + `DRIVE` + `exp_chalk_marks`): **`335` monete**.
  - **8 incarichi delle bacheche hub** (`2` per ciascuno dei 4 hub): **`194` monete** + **8 componenti**.
  - **4 segreti nei quartieri** (`1` per hub): **`59` monete** + **4 componenti**.
  - **Gare e sfide Veyra facoltative (`Ash Docks` 1–3 + Contro il tempo / Eliminazione / Rivincita):** fino a **`180+` monete** extra.
- **Uscite (`SHOP_ITEMS`, `SMITH_UPGRADES`, `RELIC_ITEMS`, locande e alchimisti):**
  - Kit medico (`medkit`, cura `+3 HP` in missione): `15–18` monete;
  - Equipaggiamento negozio (`Guanti isolati` 28, `Stivali da corsa` 32, `Lente a impulso` 36, `Cappotto foderato` 38): `134` monete totali;
  - Lavori del fabbro (`Calibrazione canna` 24+2 parti, `Armatura leggera` 28+2 parti, `Telaio rinforzato` 26+2 parti, `Accumulatore a impulso` 34+3 parti): `112` monete + `9` componenti;
  - Reliquie (`Lente della cattedrale` 30, `Bussola delle maree` 26, `Valvola di scarto` 32, `Diapason di Lulù` 38): `126` monete totali.
- **Equilibrio economico:** Un giocatore che esplora moderatamente gli hub guadagna ~`480–550` monete e `8–10` componenti, sufficienti ad acquistare il 75–85% dei potenziamenti permanenti più una scorta costante di kit medici, rendendo le scelte dal fabbro e dal mercante significative.

### 5.2 Checkpoint e Penalità per la Sconfitta (`game/campaign.mjs:192`, `game/runtime.mjs:189`)
- **Checkpoint Boss (`resumeAtBoss`):** una volta attivati i 3 nodi e risvegliato il boss (`Rook`, `The Anchor`, `Il Custode`, `EVE-Prime`, `Archon`), un'eventuale sconfitta fa ripartire **direttamente dallo scontro col boss**, con **salute piena (`maxHp`)**, **munizioni ricaricate (`D12`)**, **nodi già attivi** e **un consiglio specifico sull'ultimo colpo subito (`DEFEAT_TIPS`)**.
- **Assenza di frustrazione punitiva:** non si perdono mai monete, scelte narrative o progressi negli hub in caso di sconfitta.
