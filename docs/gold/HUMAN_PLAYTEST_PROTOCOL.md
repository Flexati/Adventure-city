# CHRONOS ADVENTURE: NOX & LULÙ — PROTOCOLLO DI TEST UMANI OBBLIGATORI (FASE 4)

**Repository:** `Flexati/Adventure-city`  
**Ramo:** `work/chronos-adventure-commercial`  
**Pacchetto APK installabile pronto:** `dist/Chronos_Adventure_Nox_Lulu_debug.apk` (`compileSdk 36`, `targetSdk 36`, `versionCode 2`, `versionName 1.0.0`)  
**Stato sessioni umane:** **`0 sessioni umane documentate`** (dipendenza esterna dichiarata: richiede persone reali e dispositivi fisici Android).  

---

## 1. Obiettivo e Regole di Integrità del Protocollo

Questo protocollo organizza la sessione di test umano per **5–10 tester indipendenti** (minimo obbligatorio per il Release Gate: **5 tester**, target consigliato: **8–10 tester**).

### Regole ferree per l'osservatore:
1. **Nessun suggerimento preventivo:** non spiegare ai tester come funzionano il joystick flottante, i nodi, le cime di `The Anchor`, il Chrono Shift o dove si trovano le porte dei villaggi.
2. **Nessun condizionamento di giudizio:** non anticipare quali scene o meccaniche dovrebbero piacere e non giustificare eventuali incertezze dell'interfaccia.
3. **Intervento ammesso solo dopo 3 minuti di blocco totale:** se un tester resta completamente bloccato nello stesso punto per oltre 180 secondi senza capire cosa fare, annotare il blocco come **Difetto Critico di Chiarezza (`UX-BLOCK`)** prima di fornire il minimo indizio necessario per proseguire.
4. **Trasparenza assoluta:** non compilare mai una scheda con dati simulati o stimati. Finché le sessioni non vengono svolte da persone reali su dispositivi fisici, il contatore in `docs/gold/HUMAN_PLAYTEST_RESULTS.md` resta a **`0`**.

---

## 2. Selezione del Campione (5–10 Tester Indipendenti)

Per valutare correttamente un prodotto mobile premium da `5,99 €`, il gruppo di 5–10 tester deve coprire tre profili:
- **Profilo A — Giocatori Mobile Action/Platform (2–4 tester):** abituati a controlli touch su smartphone, sensibili a reattività, frame rate e precisione della schivata.
- **Profilo B — Giocatori Story-Driven / Indie (2–3 tester):** attenti a dialoghi, atmosfera, scelte morali, musica ed esplorazione dei villaggi.
- **Profilo C — Giocatori Casual / Nuovi al genere (1–3 tester):** fondamentali per verificare la leggibilità del tutorial senza testo invasivo (`opening`, `blackout`) e la comprensibilità dei telegraph dei boss.

### Dispositivi fisici richiesti:
- Almeno **1 smartphone Android fascia media** (60 Hz, schermo 6,1"–6,5", Android 13–16);
- Almeno **1 smartphone Android fascia economica / schermo compatto** (per verificare leggibilità HUD e tocchi ravvicinati);
- Almeno **1 smartphone Android fascia alta** (90/120 Hz, test orientamento verticale e orizzontale + eventuale controller Bluetooth W3C).

---

## 3. Istruzioni Semplici per il Tester (Foglio da Consegnare)

> **Benvenuto alla prova di CHRONOS Adventure: Nox & Lulù.**
> 1. Installa l'applicazione sul tuo telefono tramite il file `Chronos_Adventure_Nox_Lulu_debug.apk`.
> 2. Collega le cuffie o tieni il volume attivo a un livello confortevole.
> 3. Gioca liberamente come faresti a casa tua: puoi esplorare, parlare con i personaggi, entrare negli edifici, correre nelle gare o proseguire dritto nella storia.
> 4. Non ci sono risposte giuste o sbagliate: stiamo testando il gioco, non te. Se qualcosa non è chiaro o ti annoia, dillo ad alta voce.
> 5. Al termine della sessione, apri il menù **Pausa → Salva registro di prova** (oppure annota il tempo mostrato) e compila il breve questionario finale.

---

## 4. Scenari di Prova Strutturati

Ogni tester esegue gli scenari in sequenza (o l'intera campagna per i tester dedicati alla sessione lunga):

### Scenario S1 — Primi 15 Minuti (Impatto Iniziale, Controlli e Tutorial Naturale)
- **Tappe coperte:** Menù principale → `opening` → `home` («Otto mesi dopo») → `blackout` (3 relè + Boss `Rook` + Scelta Officina/Rifugio + Banco di Tessa) → ingresso in `Moon Refuge` (`hub_moon`).
- **Cosa verificare senza intervenire:**
  - Il giocatore tocca spontaneamente Nox o Lulù nel menù animato?
  - Capisce subito che il joystick compare ovunque appoggi il dito sinistro?
  - In `home`, percepisce il cammino di Nox e Lulù o salta rapidamente le 5 battute?
  - In `blackout`, capisce che un relè non si attiva se ci sono nemici vicini?
  - Contro `Rook`, usa i muri per parare la raffica a 3 colpi e nota le mine a terra?
  - Alla scelta Officina/Rifugio, si ferma a leggere le conseguenze?

### Scenario S2 — Da `Moon Refuge` alla Fine della Demo (`separation` · «La firma», ~35–45 min cumulati)
- **Tappe coperte:** `hub_moon` (inclusa gara facoltativa `ash_docks_01` contro Veyra) → `escape` → `tunnel` → `breach` (`The Anchor`) → `hub_cathedral` → `roof` → `harbor` → `eve` → `rescue` → `zero` (`Il Custode V-01`) → `collapse` → `separation`.
- **Cosa verificare senza intervenire:**
  - In `Moon Refuge`, il giocatore entra negli edifici vedendo la freccia `ENTRA` e i ritratti in prima persona?
  - Prova volontariamente la gara di Veyra a `Ash Docks`? Se la prova, usa il nitro e riprova dopo una sconfitta?
  - Contro `The Anchor` (`breach`), capisce che deve tagliare le 3 cime prima di colpire il nucleo?
  - Al termine di `separation` («La firma»), **esprime il desiderio spontaneo di continuare nell'Atto III?**

### Scenario S3 — Atto III, Separazione dei Protagonisti, Arsenale Completo e Finale (~40–60 min aggiuntivi)
- **Tappe coperte:** `exp_chalk_marks` → `below` → `hub_slum` → `city` → `blind` → `port` → `radio` → `truck` → `archive` (`EVE-Prime`) → `line` → `reunion` → `hub_outpost` → `ascent` → `door` → `finale` (`Archon`) → `dawn`.
- **Cosa verificare senza intervenire:**
  - Nota la differenza tra Nox in solitaria (`BLACK PULSE`) e Lulù in solitaria (`BARRIERA`)?
  - Usa le nuove armi sbloccate (`ARC-7 Choir` per Lulù dopo `zero`, `H-17 Needle` per Nox dopo `archive`)?
  - In `port` (stealth), tenta l'approccio silenzioso o fa scattare subito l'allarme?
  - Contro `EVE-Prime` (`archive`), capisce come rompere la guardia adattiva col contrattacco dopo schivata o con `PULSE`?
  - In `line`, la difesa a 6 ondate risulta epica o troppo lunga?
  - Nel finale contro `Archon`, comprende il momento del consenso finale col frammento di vetro?

---

## 5. Scheda di Osservazione per Sessione (Da Compilare per Ogni Tester)

```markdown
### SCHEDA OSSERVAZIONE — TESTER ID: T-___
- **Data e ora:** _______________
- **Profilo tester:** [ ] A (Action)  [ ] B (Story/Indie)  [ ] C (Casual)
- **Dispositivo e versione Android:** _________________________
- **Orientamento scelto spontaneamente:** [ ] Verticale  [ ] Orizzontale  [ ] Entrambi
- **Audio:** [ ] Cuffie  [ ] Altoparlante telefono  [ ] Muto

#### 1. Misurazione del Tempo di Gioco (Protocollo Cronometro + JSON)
- Tempo attivo Scenario S1 (fino a Moon Refuge): _____ min _____ s
- Tempo attivo Scenario S2 (fino a «La firma»): _____ min _____ s
- Tempo attivo Scenario S3 (Atto III fino a `dawn`): _____ min _____ s
- Tempo speso negli Hub (negozi, fabbro, bacheche): _____ min _____ s
- Tempo speso nelle Gare Veyra (numero gare tentate: ___): _____ min _____ s
- **Tempo attivo totale della sessione:** _____ min _____ s

#### 2. Eventi Comportamentali Osservati (Annotare Tappa e Minuto)
- **Dove si è fermato / ha esitato (>15 s):** ___________________________________
- **Dove si è perso nella mappa o nell'hub:** ____________________________________
- **Quando non ha capito cosa fare:** ___________________________________________
- **Sconfitte ripetute (Tappa / Boss / Causa dell'ultimo colpo):** _______________
- **Incarichi hub o gare ignorati:** ____________________________________________
- **Dialoghi saltati rapidamente (quali scene):** _______________________________
- **Attività ripetute volontariamente (es. rivincita gara Veyra, altra rotta):** _
- **Reazione spontanea alla chiusura della Demo («La firma»):** __________________
```

---

## 6. Questionario Finale per il Tester (12 Aree + Valore Percepito)

Ogni tester compila il questionario in autonomia subito dopo la prova, assegnando un voto **da 1 a 10** a ciascuna area e rispondendo alle domande aperte non direttive:

1. **Divertimento immediato (primi 10 minuti):** `___ / 10`
2. **Controlli e reattività su schermo touch:** `___ / 10`
3. **Ritmo generale (alternanza tra azione, calma, guida e dialoghi):** `___ / 10`
4. **Varietà delle situazioni di gioco:** `___ / 10`
5. **Equilibrio della difficoltà:** `___ / 10`
6. **Soddisfazione del combattimento:** `___ / 10`
7. **Qualità e leggibilità dei Boss:** `___ / 10`
8. **Divertimento delle sezioni di guida e gare Veyra:** `___ / 10`
9. **Coinvolgimento nella storia e nei personaggi (Nox e Lulù):** `___ / 10`
10. **Sensazione di progressione (armi, monete, potenziamenti):** `___ / 10`
11. **Desiderio di continuare dopo «La firma» / rigiocare l'altra rotta:** `___ / 10`
12. **Valore percepito del gioco completo a `5,99 €` (acquisto unico, zero pubblicità):** `___ / 10`

### Domande aperte neutrali:
- *Qual è il momento che ricordi con più chiarezza della tua partita?*
- *C'è stato un punto in cui ti sei annoiato o hai sentito che una missione durava troppo? Quale?*
- *C'è stato un punto in cui hai perso senza capire il perché?*
- *Arrivato alla fine della Demo («La firma»), acquisteresti il gioco completo a `5,99 €`? Perché sì o perché no?*

---

## 7. Protocollo per Misurare il Tempo di Gioco Effettivo

1. **Esclusione tempi inattivi:** il motore (`game/campaign.mjs`, `game/runtime.mjs`) ferma il tempo di simulazione durante la pausa (`paused = true`) e quando l'app passa in background (`document.hidden` / `visibilitychange`).
2. **Doppia registrazione:** l'osservatore avvia un cronometro esterno all'apertura del menù principale (mettendo in pausa solo se il tester interrompe fisicamente la prova) e a fine sessione esporta il file JSON del registro di playtest dal pannello Pausa, confrontando i due tempi in `docs/gold/HUMAN_PLAYTEST_RESULTS.md`.
