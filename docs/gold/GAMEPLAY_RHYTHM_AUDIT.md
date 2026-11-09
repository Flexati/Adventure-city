# CHRONOS ADVENTURE: NOX & LULÙ — AUDIT DEL RITMO E DEL GAMEPLAY (FASE 2)

**Repository:** `Flexati/Adventure-city`  
**Ramo:** `work/chronos-adventure-commercial`  
**Prezzo di riferimento:** `5,99 €` (acquisto unico, demo gratuita fino a «La firma»)  
**Data audit:** 8 novembre 2026  

---

## 1. Metodologia di Misurazione e Stima

L'analisi considera i **31 passi della campagna** (`CAMPAIGN` in `game/missions.mjs`) come un'unica esperienza continua, affiancata dai **4 quartieri esplorabili** (`HUBS` in `game/hubs.mjs` e `game/villages.mjs`) e dalle **27 sfide di corsa Veyra** (`7` gare base + `20` varianti Contro il tempo / Eliminazione / Rivincita in `game/racing-v9.mjs`).

Ogni valore è classificato secondo il livello di evidenza:
- **`[MISURATO]`**: rilevato da telemetria in tempo reale (`CITY_VIRTUAL_TIME=0`, 30 FPS reali in Chromium headless su `tools/estimate_playtime.cjs` e `docs/evidence/tier1/playtime/PLAYTIME_ESTIMATE.json`) o da verifiche deterministiche (`npm test`).
- **`[STIMATO]`**: calcolato con il modello umano esplicito (`humanFactor` per categoria: `×1,70` combattimento a piedi, `×1,15` guida narrativa, `×1,85` lettura dialoghi e scelte in italiano a ~145 parole/minuto + 3,2 s per battuta, `×1,65` esplorazione hub).
- **`[NON VERIFICATO]`**: durata reale con giocatori umani su dispositivo Android fisico (`0` sessioni umane documentate in `docs/gold/HUMAN_PLAYTEST_RESULTS.md`).

---

## 2. Tabella Completa delle 31 Tappe della Campagna

Legenda colonne:
- **Durata Bot `[MISURATO]`**: tempo reale misurato dal bot automatico (`CITY_VIRTUAL_TIME=0`).
- **Durata Umana `[STIMATO]`**: fascia Min / Probabile / Max per un giocatore umano alla prima partita.
- **Ripartizione % (`Espl / Comb / Guida / Dialogo / Attesa`)**:
  - `Espl`: movimento libero, orientamento nella mappa, ricerca dispositivi/bacheche/porte;
  - `Comb`: ingaggi attivi, schivate, gestione munizioni/abilità;
  - `Guida`: guida narrativa o gare secondarie Veyra;
  - `Dialogo`: scene narrative, ritratti in prima persona, scelte morali;
  - `Attesa`: tempi morti (attesa tra ondate a zona pulita, ricarica passiva o transizioni).

| # | ID (`step.id`) | Tipo | POV | Durata Bot `[MISURATO]` | Umano Min / Prob / Max `[STIMATO]` | Espl % | Comb % | Guida % | Dialogo % | Attesa % | Diff. (1–10) | Intensità (1–10) | Varietà | Ricompensa diretta | Collegamento alla tappa successiva |
| :-: | :--- | :---: | :---: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :--- | :--- | :--- |
| 01 | `opening` | Scena interattiva | Nox | 12,1 s | 0,4 / 0,6 / 0,8 min | 35% | 0% | 0% | 60% | 5% | 1 | 3 | Tutorial motorio + trauma | Frammento di vetro (`raccogli il vetro`) | Crollo dell'Asse → stacco temporale di 8 mesi (`home`) |
| 02 | `home` | Scena in cammino (`D41`) | Duo | 15,7 s | 0,5 / 0,7 / 1,1 min | 25% | 0% | 0% | 75% | 0% | 1 | 2 | Cammino sincronizzato + intimità | Nessuna materiale; aggancio affettivo | Salto di corrente → primo incarico operativo (`blackout`) |
| 03 | `blackout` | Piedi + Boss (`Rook`) | Nox (+Lulù) | 78,4 s | 2,1 / 2,9 / 4,2 min | 25% | 50% | 0% | 20% | 5% | 3 | 6 | 3 relè + Boss Rook + Scelta Città + Banco Tessa | `20` monete + Potenziamento + Kit V9 (`VX-9`, `R-12`, `Quickdraw`) | La scelta Officina/Rifugio modella la fuga (`escape`) e i rifornimenti in `Moon Refuge` |
| 04 | `hub_moon` | Hub (Villaggio 24×24) | Duo | 49,9 s | 5,0 / 7,6 / 10,8 min | 45% | 0% | 25% | 25% | 5% | 2 | 3 | 2 incarichi, segreto, negozi, ritratti 1ª persona, gara `ash_docks_01` | Fino a `42` monete + 2 componenti + premi gara Veyra + `STORY.home_walk` | Partenza dal rifugio verso l'anello esterno (`escape`) |
| 05 | `escape` | Guida narrativa | Duo | 64,2 s | 1,2 / 1,4 / 1,9 min | 0% | 0% | 80% | 15% | 5% | 3 | 6 | Traffico ostile + conseguenze Officina (+1 integrità) o Rifugio (-ostacoli) | `15` monete + scena ritorno in città | Arrivo nella zona d'ombra → imboscata a `tunnel` |
| 06 | `tunnel` | Scena + Scelta | Duo | 14,9 s | 0,5 / 0,7 / 1,1 min | 0% | 0% | 0% | 95% | 5% | 1 | 5 | Scelta tattica (`tunnel_plan`: sfondare vs aggirare) | Orientamento narrativo + termico | Prepara l'ingresso nella Frattura (`breach`) |
| 07 | `breach` | Piedi + Boss (`The Anchor`) | Duo | 63,5 s | 1,9 / 2,6 / 3,9 min | 20% | 60% | 0% | 15% | 5% | 5 | 7 | 3 nodi + Boss ormeggiato a 3 cime + spazzata laser | `22` monete + Potenziamento + `weapon.anchor_component` (1° pezzo `H-17`) | L'apertura della breccia conduce a `Cathedral Quarter` (`hub_cathedral`) |
| 08 | `hub_cathedral` | Hub (Villaggio 24×24) | Duo | 48,1 s | 4,6 / 7,0 / 10,0 min | 45% | 0% | 25% | 25% | 5% | 3 | 3 | Cattedrale, 2 incarichi, segreto, ritratti, gara `ash_docks_02` | Fino a `46` monete + 2 componenti + premi gara Veyra | Dal tetto della cattedrale si osserva il porto (`roof`) |
| 09 | `roof` | Scena narrativa | Duo | 19,2 s | 0,6 / 0,9 / 1,4 min | 0% | 0% | 0% | 95% | 5% | 1 | 4 | Pausa emotiva sui tetti prima dell'assalto | Approfondimento legame Nox/Lulù | Prepara la discesa nei moli (`harbor`) |
| 10 | `harbor` | Piedi (Assalto al buio) | Duo | 67,1 s | 1,7 / 2,3 / 3,4 min | 25% | 55% | 0% | 15% | 5% | 5 | 7 | Combattimento notturno (`dark: true`, `PULSE` rivela 2,6 s) + scelta `eve_data` | `20` monete + Potenziamento + scelta archivio EVE | I dati di EVE rivelano l'identità di Lulù (`eve`) |
| 11 | `eve` | Scena + Scelta | Duo | 19,8 s | 0,6 / 1,0 / 1,4 min | 0% | 0% | 0% | 95% | 5% | 1 | 6 | Rivelazione `EVE-47` + scelta `eve_identity` | Variazione dialoghi Atto II e III | Guida d'emergenza per salvare i superstiti (`rescue`) |
| 12 | `rescue` | Guida con soste | Duo | 71,3 s | 1,3 / 1,6 / 2,1 min | 10% | 0% | 75% | 10% | 5% | 4 | 6 | Frenata di precisione in 2 punti verdi (`stops: [760, 1540]`) | `18` monete | I superstiti indicano il Nodo Centrale (`zero`) |
| 13 | `zero` | Piedi + Boss (`Custode V-01`) | Duo | 49,3 s | 1,5 / 2,1 / 3,1 min | 15% | 65% | 0% | 15% | 5% | 6 | 8 | Boss a 3 fasi con rinforzi e cariche radiali | `24` monete + Potenziamento + sblocco `ARC-7 Choir` (`weapon.eden_technology`, FASE 6) | La vittoria al Nodo innesca il crollo strutturale (`collapse`) |
| 14 | `collapse` | Fuga a piedi al buio | Duo | 17,9 s | 0,3 / 0,4 / 0,6 min | 60% | 25% | 0% | 10% | 5% | 5 | 9 | Sprint di sopravvivenza tra crolli fino al varco | Sopravvivenza + transizione drammatica | Il crollo chiude la paratia tra Nox e Lulù (`separation`) |
| 15 | `separation` | Scena interattiva («La firma») | Duo | 23,5 s | 0,8 / 1,1 / 1,7 min | 0% | 0% | 0% | 95% | 5% | 2 | 9 | Climax emotivo Atto II + **Fine Demo (`M3`)** | Sblocco Atto III (dopo acquisto su Android con ponte Billing) | Separa i percorsi: Lulù nel condotto (`exp_chalk_marks`), Nox sotto la breccia (`below`) |
| 16 | `exp_chalk_marks` | Piedi (Traccia + Difesa) | Lulù | 59,0 s | 1,6 / 2,2 / 3,2 min | 35% | 40% | 0% | 18% | 7% | 5 | 6 | Scelta rotta (`direct`/`service`) + 3 segni di gesso + tenuta 16 s | `18` monete + Potenziamento + traccia fisica che Nox leggerà in `below` | I segni di gesso lasciati da Lulù guidano Nox in `below` |
| 17 | `below` | Piedi (Assalto con Unit-9) | Nox | 73,6 s | 1,9 / 2,6 / 3,8 min | 25% | 55% | 0% | 15% | 5% | 6 | 7 | Nox da solo con `BLACK PULSE` (`overdrive`) + alleato drone `Unit-9` + scelta `unit9_fate` | `20` monete + Potenziamento + callback ai segni di gesso di Lulù | Risalita verso `Toxic Slum Bazaar` (`hub_slum`) |
| 18 | `hub_slum` | Hub (Villaggio 24×24) | Nox | 49,3 s | 4,7 / 7,2 / 10,3 min | 45% | 0% | 25% | 25% | 5% | 4 | 4 | Bazar tossico, 2 incarichi, alchimista, gara `ash_docks_03` + sfide Vortex | Fino a `50` monete + 2 componenti + premi gara/sfide Veyra | Cambio di prospettiva: si passa a Lulù nella città in superficie (`city`) |
| 19 | `city` | Piedi (Difesa zona) | Lulù | 88,9 s | 2,3 / 3,1 / 4,7 min | 10% | 65% | 0% | 15% | 10% | 7 | 8 | Difesa `BARRIERA` (46–55 s) sul luogo lasciato al buio in `blackout` | `22` monete + Potenziamento + scelta `gate_crowd` | Dopo aver tenuto il cancello, Lulù guida nel tunnel (`blind`) |
| 20 | `blind` | Guida al buio con impulsi | Lulù | 66,8 s | 1,2 / 1,5 / 2,0 min | 0% | 0% | 85% | 10% | 5% | 5 | 7 | Guida in solitaria nel tunnel spento illuminato dagli impulsi | `16` monete | Lulù raggiunge il porto sorvegliato (`port`) |
| 21 | `port` | Piedi (Infiltrazione Stealth) | Lulù | 26,8 s | 0,8 / 1,1 / 1,7 min | 45% | 30% | 0% | 20% | 5% | 5 | 6 | Coni visivi pattuglie, colpo silenzioso `×3`, stordimento Risonanza 5 s | `20` monete + Potenziamento + `thermal +3` (`consent_channel_respected`) | Il segnale dal porto apre la trasmissione radio verso Nox (`radio`) |
| 22 | `radio` | Scena interattiva (Terminale) | Lulù | 17,6 s | 0,6 / 0,9 / 1,3 min | 0% | 0% | 0% | 95% | 5% | 2 | 7 | Pressione prolungata sul terminale (`TIENI PREMUTO PER TRASMETTERE`) | Contatto emotivo a distanza con Nox | La trasmissione raggiunge Nox mentre guida il camion (`truck`) |
| 23 | `truck` | Guida pesante sotto droni | Nox | 72,7 s | 1,3 / 1,6 / 2,2 min | 0% | 0% | 85% | 10% | 5% | 6 | 7 | Camion di manutenzione con bombardamento droni su corsie | `18` monete | Il camion porta Nox alle porte dell'Archivio (`archive`) |
| 24 | `archive` | Piedi + Boss (`EVE-Prime`) | Nox | 64,6 s | 1,8 / 2,4 / 3,7 min | 20% | 60% | 0% | 15% | 5% | 7 | 8 | Boss adattivo (`mirror`) che alza guardia se spari 8 volte di fila + scelta `archive_record` | `24` monete + Potenziamento + sblocco `H-17 Needle` (`weapon.vega_component`, FASE 6) | Dall'Archivio si passa alla corsa disperata di Lulù (`line`) |
| 25 | `line` | Piedi (Difesa finale Lulù) | Lulù | 115,4 s | 3,0 / 4,0 / 6,0 min | 10% | 70% | 0% | 12% | 8% | 8 | 9 | 6 ondate in 56 s per difendere l'autobus dei civili + scelta `line_choice` | `24` monete + Potenziamento + `ARC-7 Choir` decisivo contro le 6 ondate | La scelta `line_choice` (`go`/`hold`) prepara il ricongiungimento (`reunion`) |
| 26 | `reunion` | Scena narrativa | Duo | 19,2 s | 0,6 / 0,9 / 1,4 min | 0% | 0% | 0% | 95% | 5% | 1 | 8 | Ricongiungimento fisico ed emotivo di Nox e Lulù | Ripristino abilità `DUO` combinata | Insieme raggiungono l'ultimo avamposto prima della vetta (`hub_outpost`) |
| 27 | `hub_outpost` | Hub (Villaggio 24×24) | Duo | 50,0 s | 4,7 / 7,3 / 10,5 min | 45% | 0% | 25% | 25% | 5% | 4 | 4 | Torre dell'orologio, 2 incarichi, reliquie finali, preparazione | Fino a `56` monete + 2 componenti + kit medici per la salita finale | Parte la scalata verso la cima dell'Asse (`ascent`) |
| 28 | `ascent` | Piedi (Assalto con Kairn & Morrow) | Duo | 71,7 s | 1,8 / 2,4 / 3,7 min | 20% | 65% | 0% | 10% | 5% | 7 | 8 | Combattimento in coppia + alleati autonomi Kairn (mischia) e Morrow (fucile/sega) | `24` monete + ultimo Potenziamento prima di Archon | Porta davanti alla porta del nucleo di Archon (`door`) |
| 29 | `door` | Scena + Scelta | Duo | 14,9 s | 0,5 / 0,7 / 1,1 min | 0% | 0% | 0% | 95% | 5% | 1 | 7 | Scelta morale `hand` (`Batti due volte` / `Anello di ferro`) | Variazione dialogo pre-finale e registro scelte | Apre la sala del trono di Archon (`finale`) |
| 30 | `finale` | Piedi + Boss (`Archon`) | Duo | 62,1 s | 1,8 / 2,4 / 3,6 min | 15% | 65% | 0% | 15% | 5% | 8 | 10 | Boss a 3 fasi con emettitori + consenso finale col frammento di vetro (`consentFinale`) | `30` monete + Vittoria campagna | Conduce alla scelta epilogo e ai titoli (`dawn`) |
| 31 | `dawn` | Epilogo + Scelta finale + Outro | Duo | 14,9 s | 0,5 / 0,8 / 1,2 min | 0% | 0% | 0% | 100% | 0% | 1 | 8 | Scelta `ending` + epilogo personalizzato + gancio Kairn/Morrow + «Gioca l'altra rotta» (`D22`) | Registro scelte + New Game+ con armi e potenziamenti mantenuti | Riavvio «Gioca l'altra rotta» o completamento |

---

## 3. Curva del Ritmo della Campagna (Atto I → Atto III)

La campagna non segue una linea piatta ma un'architettura a **tre atti** con alternanza deliberata tra tensione tattica, esplorazione nei villaggi, guida cinetica e respiri narrativi:

```
Intensità (1-10)
10 |                                                                                   [30 finale]
 9 |                                       [14 collapse][15 separation]      [25 line]
 8 |                                    [13 zero]                  [24 archive]  [26]    [28 ascent] [31 dawn]
 7 |                  [07 breach]   [10 harbor]        [17 below] [19 city][20]  [22][23]      [29 door]
 6 |        [03]  [05]          [11][12]             [16 chalk]         [21 port]
 5 |           [06]
 4 |                     [09 roof]                        [18 slum]                  [27 outpost]
 3 | [01]     [04 moon]   [08 cathedral]
 2 |   [02]
   +----------------------------------------------------------------------------------------------------
     01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31
     |------------- ATTO I ------------|--- ATTO II ---|------------------- ATTO III ------------------|
```

### Fasi strutturali della curva:
1. **Introduzione (Tappe 01–04 · ~11,8 min probabili):**
   - `opening` introduce il movimento e l'interazione in 35 secondi senza muri di testo;
   - `home` (`D41`) costruisce il legame tra Nox e Lulù mentre camminano insieme;
   - `blackout` insegna coperture, nodi, schivata e primo boss (`Rook`), premiando subito il giocatore con la scelta cittadina e la valigetta di Tessa (`VX-9`, `R-12`, `Quickdraw`);
   - `hub_moon` abbassa la pressione dopo Rook, offrendo il primo villaggio 24×24, le 3 battute in cammino di `STORY.home_walk`, gli interni in prima persona e la prima gara facoltativa contro Veyra (`ash_docks_01`).
2. **Crescita dell'intensità (Tappe 05–12 · ~16,8 min probabili):**
   - Alternanza impeccabile dei verbi di gioco: **Guida (`escape`) → Scena (`tunnel`) → Boss con meccanica di cime (`breach`) → Hub (`hub_cathedral`) → Pausa emotiva (`roof`) → Combattimento notturno (`harbor`) → Rivelazione (`eve`) → Guida con soste di soccorso (`rescue`)**.
   - Non ci sono mai due missioni a piedi consecutive senza una scena, una guida o un villaggio in mezzo.
3. **Primo Climax e Frattura (Tappe 13–15 · ~3,6 min probabili):**
   - `zero` (Boss `Il Custode V-01`) + `collapse` (fuga a piedi di 25 secondi nel crollo) + `separation` («La firma») formano una tripla sequenza ad altissima tensione che chiude la Demo (`M3`) nel momento di massimo desiderio di continuare.
4. **Variazione di Ritmo e Doppio POV in Solitaria (Tappe 16–25 · ~19,4 min probabili):**
   - La separazione cambia sia le regole meccaniche sia il tono emotivo:
     - **Nox da solo** perde l'abilità `DUO` curativa e ottiene `BLACK PULSE` (`overdrive`: 5 s di velocità/cadenza raddoppiata seguiti da 2,2 s di surriscaldamento `heat`), affiancato da `Unit-9` in `below` e messo alla prova da `EVE-Prime` in `archive`.
     - **Lulù da sola** usa `BARRIERA` (scudi energetici che bloccano proiettili e nemici) e `RISONANZA` ad area: traccia i segni di gesso in `exp_chalk_marks`, difende il cancello in `city`, guida al buio in `blind`, si infiltra in stealth a `port` (missione breve e tesa da ~1,1 min) e sostiene l'assedio di 6 ondate in `line`.
5. **Pausa prima della Tempesta, Climax Finale e Conclusione (Tappe 26–31 · ~14,5 min probabili):**
   - `reunion` e `hub_outpost` restituiscono il respiro e permettono di spendere le ultime monete prima della scalata;
   - `ascent` introduce Kairn e Morrow in battaglia accanto al Duo;
   - `finale` contro `Archon` unisce tutte le meccaniche apprese e culmina nel colpo finale con il frammento di vetro dell'apertura (`opening` → `finale`), seguito da `dawn` e dalla modalità «Gioca l'altra rotta» (`D22`).

---

## 4. Problemi di Ritmo Individuati e Interventi Applicati (FASE 6)

| ID | Gravità | Problema individuato nell'audit | Impatto sul giocatore | Stato / Correzione applicata in FASE 6 |
| :-: | :---: | :--- | :--- | :--- |
| **R-01** | **ALTA** | **Stallo di progressione dell'arsenale nell'Atto II e III:** `campaignArsenalV9` (`game/weapons-v9.mjs:64`) non includeva `eden_technology` e `game/runtime.mjs:192` non assegnava mai `weapon.eden_technology` né `weapon.vega_component` durante la campagna. Il giocatore restava con le sole armi dell'Atto I (`VX-9` e `R-12`) per tutte le 28 tappe successive, rendendo `line` (6 ondate) e `ascent`/`finale` più ripetitive. | Sensazione di progressione bloccata dopo la prima ora; le 2 armi avanzate (`ARC-7 Choir` e `H-17 Needle`) esistevano solo nel laboratorio di test. | **CORRETTO (`game/weapons-v9.mjs`, `game/runtime.mjs`):**<br>1. `Il Custode V-01` (`zero`, fine Atto II) sblocca ora `weapon.eden_technology` → Lulù riceve **`ARC-7 Choir`** (catena elettrica su 3 bersagli + stordimento) proprio all'inizio dell'Atto III (`city`, `port`, `line`).<br>2. `EVE-Prime` (`archive`, Atto III) sblocca `weapon.vega_component`, completando con `anchor_component` il fucile di precisione **`H-17 Needle`** per Nox in `ascent` e `finale`. |
| **R-02** | **MEDIA** | **Tempi morti (`Attesa %`) nelle missioni di difesa (`city`, `line`, `exp_chalk_marks`):** quando un giocatore abile elimina rapidamente tutti i nemici di un'ondata mentre presidia la zona, la barra di tenuta (`s.progress`) continuava a salire alla stessa velocità anche a schermo vuoto fino all'ondata successiva. | Calo di tensione artificiale tra un'ondata e l'altra per chi pulisce l'arena in anticipo. | **CORRETTO (`game/campaign.mjs:359`):**<br>Quando l'eroe presidia la zona non contestata e ha eliminato tutti i nemici attivi dell'ondata (`!liveEnemies(s).length`), la barra di difesa `s.progress` avanza a **`×1,25`**, premiando la pulizia rapida dell'ondata e riducendo i tempi morti senza sovrapporre prematuramente le ondate successive. **Annullato in R1 (regola 4), poi approvato dall'autore con D44 (9 novembre 2026)** e rimesso nel codice. |
| **R-03** | **MEDIA** | **Attrito nei dialoghi iniziali (`home`):** 8 battute statiche consecutive prima del primo combattimento rallentavano l'ingresso nel gioco. | Rischio di calo d'attenzione nei primi 3 minuti. | **CORRETTO in TIER 2 (`D41`, commit `3c5a4d9`):**<br>5 battute con movimento in scena (`moveCast`) in `home` + 3 battute sulla rotta spostate in `STORY.home_walk` all'ingresso di `Moon Refuge`. |
| **R-04** | **BASSA** | **Durata complessiva prima run (~85,7 min probabili) inferiore ai 120 min del target commerciale se il giocatore ignora il 100% delle sfide Veyra e della seconda rotta:** la campagna principale + 4 hub + 7 gare base misura `48,9 min` col bot automatico `[MISURATO]` e `85,7 min` (`61,0–118,5 min`) per un umano `[STIMATO]`. Con le sfide Vortex (`Contro il tempo`, `Eliminazione`, `Rivincita`) e «Gioca l'altra rotta» (`D22`) supera i `135 min` `[STIMATO]`. | Chi gioca solo la linea retta principale senza sfide né seconda rotta termina in ~70–90 minuti. | **DOCUMENTATO E MONITORATO:**<br>Nel rispetto della regola di FASE 6 («Non aggiungere contenuti inutili per aumentare artificialmente la durata»), non è stato gonfiato alcun timer; il protocollo di playtest umano (`docs/gold/HUMAN_PLAYTEST_PROTOCOL.md`) misura separatamente la durata della 1ª run, delle gare Veyra e della 2ª rotta. |
