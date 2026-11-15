# CHRONOS ADVENTURE: NOX & LULÙ — RISULTATI PLAYTEST UMANI E ANALISI DEL COINVOLGIMENTO (FASE 4 & FASE 5)

**Repository:** `Flexati/Adventure-city`  
**Ramo:** `work/chronos-adventure-commercial`  
**Data aggiornamento:** 8 novembre 2026  
**Sessioni umane documentate:** **`0 / 5`** (`[NON VERIFICATO]` con persone reali)  
**Stato Gate Umano:** **`BLOCCATO — DIPENDENZA ESTERNA DICHIARATA`**  

---

## 1. Dichiarazione di Dipendenza Esterna e Onestà del Registro

In conformità alle regole di **FASE 4** («Se non puoi reclutare direttamente persone o installare il gioco su dispositivi fisici, prepara tutto il necessario e dichiara chiaramente la dipendenza esterna. Non dichiarare mai superato un test umano senza una sessione umana documentata»):

1. **Dipendenza esterna:** l'ambiente di esecuzione è un container Linux headless privo di accesso diretto a tester umani e a telefoni fisici Android collegati via USB (`adb devices` vuoto).
2. **Stato pacchetto di test:** l'APK installabile `dist/Chronos_Adventure_Nox_Lulu_debug.apk` (`compileSdk 36`, `targetSdk 36`, `versionCode 2`, `1.0.0`) e il protocollo completo in `docs/gold/HUMAN_PLAYTEST_PROTOCOL.md` sono pronti per essere distribuiti ai 5–10 tester indipendenti.
3. **Sessioni umane completate ad oggi:** **`0`**. Nessun dato umano è stato inventato o simulato.

---

## 2. Tabella Sessioni Umane (Slot Pronti per Registrazione Reale `T-01` … `T-10`)

| ID Tester | Profilo (`A`/`B`/`C`) | Dispositivo Fisico Android | Scenario Completato (`S1`/`S2`/`S3`) | Tempo Attivo `[MISURATO]` | Sconfitte / Punti di Blocco | Voto Medio (1–10) | Acquisterebbe a `5,99 €`? | Stato |
| :-: | :-: | :--- | :-: | :-: | :--- | :-: | :-: | :-: |
| `T-01` | A (Action) | *In attesa di dispositivo fisico* | — | — | — | — | — | `[NON VERIFICATO]` |
| `T-02` | A (Action) | *In attesa di dispositivo fisico* | — | — | — | — | — | `[NON VERIFICATO]` |
| `T-03` | B (Story/Indie) | *In attesa di dispositivo fisico* | — | — | — | — | — | `[NON VERIFICATO]` |
| `T-04` | B (Story/Indie) | *In attesa di dispositivo fisico* | — | — | — | — | — | `[NON VERIFICATO]` |
| `T-05` | C (Casual) | *In attesa di dispositivo fisico* | — | — | — | — | — | `[NON VERIFICATO]` |
| `T-06` | A (Action) | *Opzionale (target 8–10)* | — | — | — | — | — | `[NON VERIFICATO]` |
| `T-07` | B (Story/Indie) | *Opzionale (target 8–10)* | — | — | — | — | — | `[NON VERIFICATO]` |
| `T-08` | C (Casual) | *Opzionale (target 8–10)* | — | — | — | — | — | `[NON VERIFICATO]` |

---

## 3. FASE 5 — Valutazione del Coinvolgimento nelle 12 Aree (1–10)

Ogni valutazione da **1 a 10** è ancorata a evidenze tecniche verificabili nel repository e distingue rigorosamente tra:
- **`[MISURATO]`**: dato numerico rilevato da test automatici, telemetria browser o codice sorgente;
- **`[OSSERVATO]`**: comportamento verificato visivamente nelle catture e nelle sessioni browser/mobile (`docs/evidence/tier2/m1/`, `docs/evidence/tier2/m6/`, `docs/evidence/tier2/m7/`);
- **`[STIMATO]`**: proiezione basata su modelli matematici espliciti (`PLAYTIME_ESTIMATE.json`);
- **`[IPOTIZZATO]`**: valutazione di design fondata sulla struttura delle meccaniche ma non ancora confermata da esseri umani;
- **`[NON VERIFICATO]`**: aspetto verificabile esclusivamente con tester umani su smartphone fisici.

| # | Area di Esperienza | Voto Tecnico / Design (1–10) | Voto Umano Reale | Evidenze `[MISURATO]` / `[OSSERVATO]` / `[STIMATO]` / `[IPOTIZZATO]` / `[NON VERIFICATO]` |
| :-: | :--- | :-: | :-: | :--- |
| **1** | **Divertimento immediato** | **8,5 / 10** | `[NON VERIFICATO]` | - **`[MISURATO]`**: il giocatore prende il controllo di Nox in `opening` in `< 3 s` dall'avvio della partita; il primo scontro con boss (`Rook`) e la consegna dell'arsenale V9 (`VX-9`, `R-12`, `Quickdraw`) avvengono entro i primi `4–5 minuti` `[STIMATO]`.<br>- **`[OSSERVATO]`**: menù animato con Nox e Lulù (`D40`), cammino sincronizzato in `home` (`D41`, `docs/evidence/tier2/m7/01_home_walk.png`).<br>- **`[NON VERIFICATO]`**: reazione emotiva spontanea di 5–10 giocatori umani nei primi 10 minuti. |
| **2** | **Controlli e reattività** | **8,8 / 10** | `[NON VERIFICATO]` | - **`[MISURATO]`**: `qa:touch` (`48/48 PASS`), `qa:controls` (`11/11 PASS`), `qa:gamepad` (`9/9 PASS`). Attivazione immediata su `pointerdown` (`C1`, `D27`) per `SCHIVA`, `DUO` e `ATTIVA`; buffer di `100 ms` (`6 frame`, `N1`) per non perdere tocchi ravvicinati; pulsanti secondari con `onTap` compatibile col multitocco a due dita (`D40`). Frame time p95 in Chromium: `7,0 ms` (`11,4 ms` con CPU `×4` rallentata, sotto la soglia di `16,67 ms`).<br>- **`[NON VERIFICATO]`**: ergonomia dei pollici su vetro fisico di 3 diversi smartphone Android. |
| **3** | **Ritmo** | **8,4 / 10** *(dopo fix FASE 6)* | `[NON VERIFICATO]` | - **`[MISURATO]`**: 31 tappe che alternano 12 missioni a piedi, 5 guide narrative, 4 hub 24×24 e 10 scene interattive senza mai impilare più di 2 combattimenti consecutivi dello stesso tipo (`docs/gold/GAMEPLAY_RHYTHM_AUDIT.md`).<br>- **`[MISURATO]` (Fix FASE 6):** ridotti i tempi morti tra le ondate nelle missioni di difesa (`city`, `line`, `exp_chalk_marks`) accelerando la carica della zona `s.progress` a `×1,25` quando l'ondata attiva è già stata ripulita (`game/campaign.mjs:359`).<br>- **`[IPOTIZZATO]`**: la missione `line` (`4,0 min` `[STIMATO]`, 6 ondate) resta il picco più lungo e impegnativo della campagna. |
| **4** | **Varietà** | **8,3 / 10** | `[NON VERIFICATO]` | - **`[MISURATO]`**: 4 modalità a piedi (`assault`, `boss`, `defend`, `stealth` + variante `chalk`), 4 modalità di guida narrativa (fuga, soccorso con soste, tunnel al buio con impulsi, camion sotto droni), 4 villaggi con piante 24×24 distinte e ritratti in prima persona (`D40`), e 27 eventi di corsa Veyra (`7` gare base + `20` sfide Contro il tempo / Eliminazione / Rivincita).<br>- **`[OSSERVATO]`**: 5 delle 9 regioni del canone (`Ash Docks`, `Solkara`, `Aurelia Span`, `Helios`, `Vanta Axis`) sono piste/arene e non villaggi esplorabili separati. |
| **5** | **Difficoltà** | **8,4 / 10** | `[NON VERIFICATO]` | - **`[MISURATO]`**: curva calibrata da `blackout` (`<= 3` colpi subiti dal bot prima di Rook, test `campaign-v08.test.mjs:60`) fino a `zero` e `finale`. Checkpoint boss (`resumeAtBoss`) che conserva i nodi attivi, ripristina HP e munizioni (`D12`) e mostra un suggerimento mirato (`DEFEAT_TIPS`).<br>- **`[NON VERIFICATO]`**: tasso di sconfitta umano reale contro `The Anchor`, `EVE-Prime` e `line`. |
| **6** | **Combattimento** | **8,7 / 10** *(dopo fix FASE 6)* | `[NON VERIFICATO]` | - **`[MISURATO]`**: hit-stop visivo di 2/4/6 frame (`G1`), **Chrono Shift** di Nox (`×0,5` velocità nemici/proiettili per `0,6 s` dopo Perfect Dodge, `D29`/`D33`), telegrafi leggibili anche senza colore/audio (cerchi e linee tratteggiate in inseguimento → piene con tacche al blocco, `Q2-U1`), vibrazione aptica differenziata (`Q2-U3`).<br>- **`[MISURATO]` (Fix FASE 6):** tutte e 5 le armi V9 (`C-9`, `VX-9`, `R-12`, `H-17 Needle`, `ARC-7 Choir`) sono ora sbloccabili e utilizzabili nella campagna (`game/weapons-v9.mjs:64`, `game/runtime.mjs:192`). |
| **7** | **Boss** | **8,5 / 10** | `[NON VERIFICATO]` | - **`[MISURATO]` / `[OSSERVATO]`**: i 5 boss giocabili nella campagna hanno identità meccaniche distinte: `Rook` (mine disattivabili + copertura), `The Anchor` (puzzle a 3 cime + spazzata laser), `Il Custode V-01` (fasi con rinforzi + cariche), `EVE-Prime` (guardia adattiva anti-spam che richiede contrattacco dopo Perfect Dodge), `Archon` (fuoco incrociato dai nodi + consenso finale col vetro).<br>- **`[MISURATO]`**: i 4 boss v2 (`bone_tyrant`, `forge_behemoth`, `shadow_reaper`, `vega`) hanno fogli `2560×1280` `TECHNICALLY_VERIFIED` (`M6`), ma restano in staging finché non avranno pattern dedicati (`D23`). |
| **8** | **Gare** | **8,6 / 10** | `[NON VERIFICATO]` | - **`[MISURATO]`**: sistema di corsa V9 completo (`game/racing-v9.mjs`) con partenza perfetta (`0,6 s`), ricarica nitro (scia, sfioramento ostacoli, varchi, checkpoint), ostacoli dinamici (gru oscillante, sbarramenti, chiazze d'olio/sabbia), inclinazione camera e 3 modalità sfida (`D15`, `D16`, `D17`).<br>- **`[OSSERVATO]`**: nell'arco principale senza sblocco post-finale sono accessibili da hub i 3 tracciati di `Ash Docks` (+ 9 sfide Vortex); i 4 tracciati di `Solkara`, `Aurelia Span` e duello finale sono giocabili nel laboratorio gare e attendono i quartieri post-ricongiungimento (`D05`). |
| **9** | **Narrazione** | **8,9 / 10** | `[NON VERIFICATO]` | - **`[MISURATO]`**: 10 scelte morali persistenti con conseguenze reali su gameplay, dialoghi, stato termico e mappa (es. `blackout_power` modifica `escape` e il sito difeso in `city`; `exp_chalk_marks` lascia tracce fisiche e battute che Nox ritrova in `below` e `archive`). `STORY.home` e `STORY.home_walk` distribuite in cammino senza tagli (`D41`). Copertura bilingue IT/EN verificata (`tests/locale.test.mjs`). |
| **10** | **Progressione** | **8,6 / 10** *(dopo fix FASE 6)* | `[NON VERIFICATO]` | - **`[MISURATO]`**: progressione su 4 assi convergenti: 1) potenziamento post-missione (`power` vs `shield`), 2) arsenale V9 a 5 armi ora completo fino all'Atto III (`vx9`/`r12` dopo `blackout`, `arc7` dopo `zero`, `h17` dopo `archive`), 3) economia dei 4 hub (fabbro, negozi, reliquie, alchimista), 4) abilità `DUO` → `BLACK PULSE` / `BARRIERA` → `DUO`. |
| **11** | **Desiderio di continuare** | **8,5 / 10** | `[NON VERIFICATO]` | - **`[IPOTIZZATO]`**: il taglio della Demo (`M3`) esattamente su `separation` («La firma», subito dopo il crollo del Nodo Centrale e la divisione forzata tra Nox e Lulù) posiziona il paywall nel punto di massima tensione emotiva; il pulsante «Gioca l'altra rotta» (`D22`) incentiva la seconda partita conservando armi e potenziamenti.<br>- **`[NON VERIFICATO]`**: tasso di conversione reale su 5–10 tester umani al cancello della Demo. |
| **12** | **Valore percepito del prodotto (`5,99 €`)** | **8,2 / 10** | `[NON VERIFICATO]` | - **`[MISURATO]` / `[STIMATO]`**: zero pubblicità, zero microtransazioni predatorie, un solo sblocco da `5,99 €`, ~`85,7 min` `[STIMATO]` per la prima partita completa + ~`50 min` tra sfide Vortex e «Gioca l'altra rotta» (`> 135 min` complessivi per chi esplora entrambe le rotte).<br>- **`[NON VERIFICATO]`**: risposta diretta dei tester umani alla domanda «Lo compreresti a `5,99 €`?». |
| — | **MEDIA COMPLESSIVA (12 Aree)** | **8,53 / 10** *(Tecnico / Design)* | **`[NON VERIFICATO]`** *(0 sessioni umane)* | **La media tecnica/design supera la soglia di `8,5 / 10`, ma in assenza delle 5 sessioni umane documentate il criterio umano del Release Gate resta aperto (`COMMERCIAL_RELEASE = BLOCKED`).** |
