# CHRONOS Adventure: Nox & Lulù — Fase 3, sintesi

2 novembre 2026 · rivista: decisioni in [DECISIONI.md](../../gold/DECISIONI.md) (D18–D26) · `COMMERCIAL_RELEASE = BLOCKED`

**Legenda**
- **[FATTO]**: verificato su una fonte esterna (nelle schede della Fase 2) o nel repo `Flexati/Adventure-city`, ramo `work/chronos-adventure-commercial`.
- **[IPOTESI]**: stima o giudizio del team.
- Le durate di CHRONOS sono **stime dei test automatici, non durate umane**.

## Decisioni dalla revisione della Fase 2

| # | Decisione | Effetto |
|---|---|---|
| 1 | La demo finisce a «La firma» | La realizza Claude in un **terminale sul tuo PC, collegato con Remote Control**. In Fase 4 preparo il mandato da dargli |
| 2 | Prezzo 5,99 € confermato | Anche l'allineamento dei 16 documenti che dicono 4,99 € va nel mandato per il terminale |
| 3 | No al «Colpo assistito» e a ogni altro miglioramento in più | La top 10 usa solo azioni della Fase 2 non respinte. Esclusi anche i pulsanti spostabili, che sono dello stesso tipo |
| 4 | «Gioca l'altra rotta» confermato | Spiegato al §0. Non conta nei 105 minuti |

## Decisioni dalla revisione della Fase 3 (2 novembre 2026)

| # | Decisione | Effetto |
|---|---|---|
| 1 | **9 boss** («esegui 9+») | I 5 di oggi, più Cathedral Bone Tyrant, Toxic Forge Behemoth e Shadow Reaper (sprite già nel repo), più Vega (servono le immagini). Shadow Reaper resta, quindi il disaccordo del Game Designer su HELIX è chiuso. La realizzazione va nel mandato per il terminale, in Fase 4 |
| 2 | **Gli altri 8 incontri vanno negli aggiornamenti della Parte I dopo il lancio** | È la decisione esplicita dell'autore che il mandato V10.2 richiede. Restano storie di Nox e Lulù, non di Chrono Shadows |
| 3 | **Al lancio solo Play Console** | Nessun contatore dentro l'app. Il registro JSON locale serve solo ai playtest |
| 4 | **Sì alla proposta sulle battute di «Otto mesi dopo»**, solo lavoro di ingegneria fatto bene | La preparo in Fase 4. Nessuna battuta viene cancellata: alcune si spostano nel cammino |

## Correzioni alle Fasi 1 e 2 (già riportate nel file della Fase 2)

- **I boss in campagna sono 5, non 4.** Mancava il Custode del Nodo in Ora zero, con 300 hp (`game/campaign.mjs:15`) **[FATTO]**. Per arrivare a 8 ne mancano 3.
- **Le scelte salvate sono 10, non 4** **[FATTO]**:
  - 4 nelle missioni;
  - 6 nelle scene: due sulla promessa, due sul tetto, la rotta del gesso, la mano di Nox.
- **Le «rotte» A/B/C non sono percorsi del gioco.** Sono le 3 combinazioni di scelte che il test automatico usa per giocare la campagna (`tools/verify_campaign_browser.cjs:50`) **[FATTO]**.

---

## 0. Cos'è «Gioca l'altra rotta»

**Oggi** **[FATTO]**
- Il gioco ha **un solo finale**, come vuole il canone: Archon in tre fasi (Custode → Città → Lia). Le 10 scelte cambiano però scene e battute lungo la strada. Per esempio:
  - alla riunione, Nox dice «Non so se mi fido ancora» oppure «Non ti perdono», a seconda di quello che hai scelto prima;
  - nella missione del gesso, Lulù prende la strada diretta oppure quella di servizio;
  - sul tetto finale, Nox prende la mano di Lulù oppure resta accanto a lei.
- Finita la campagna, oggi non c'è modo di vedere le altre versioni senza ricominciare da zero.

**La proposta**
1. Dopo i titoli di coda compare un pulsante: **«Gioca l'altra rotta»**.
2. Si apre il **registro delle scelte**: le 10 decisioni della prima partita, ognuna con la sua frase.
3. Si ricomincia la storia **tenendo armi e potenziamenti**, così i combattimenti scorrono più veloci e l'attenzione va alle scelte.
4. Le scelte nuove mostrano le scene e le battute che la prima volta non hai visto.

**I limiti, per rispettare il canone**
- Nessun finale nuovo: Archon resta l'ultimo boss.
- Kairn e Morrow restano non giocabili.
- Nessun contenuto inventato: si vedono solo le varianti che esistono già.
- **Questo tempo non conta nei 105 minuti**, che misurano la prima partita.

**Prevale:** il Product Analyst, perché aumenta il valore percepito senza asset nuovi. Il Game Designer è d'accordo, a patto che il registro non mostri in anticipo le opzioni non scelte. **Sforzo** **[IPOTESI]**: M.

---

## Prospettive che prevalgono in Fase 3

| Sezione | Prevale | Perché |
|---|---|---|
| A. Confronto | Product Analyst | Prezzo, durata e modello sono dati di mercato |
| B. Top 10 | Product Analyst | L'ordine segue l'impatto su recensioni e conversione. Il Game Designer non è d'accordo sul n. 5, scritto sotto la tabella |
| C. Core loop | Game Designer | È il cuore del gioco |
| D. Primi 5 minuti | Game Designer | Il ritmo dei primi minuti è design |
| E. Modello premium | Product Analyst | |
| F. Analytics e KPI | Tech Lead sulla privacy, Product Analyst sui KPI | |
| G. Scope | Product Analyst | Il rischio di non arrivare all'uscita pesa più del resto. Il Game Designer non è d'accordo, scritto al §G |

---

## A. Tabella comparativa

Le fonti sono nelle schede della Fase 2.

| Titolo | Prezzo Android | Durata principale | Modello | Controlli touch nelle recensioni | Scelte che restano | Duo / veicoli |
|---|---|---|---|---|---|---|
| Dead Cells | 8,99 $ | Rigiocabile, a partite | Pagamento + 4 DLC | Migliorabili; c'è l'Auto-Hit | No | No / no |
| GTA Chinatown Wars | 4,99 $ | n.d. | Pagamento | Ci si deve abituare; menu scomodi | No | No / **sì** |
| Brothers | circa 3 € | circa 3 h | Pagamento | Buoni ma macchinosi | No | **Sì** / no |
| Hyper Light Drifter | variabile | circa 8 h | Pagamento | Difficili, controller consigliato | No | No / no |
| Chrono Trigger | 9,99 $ | oltre 30 h | Pagamento | La prima versione fu criticata | **13 finali** | Tecniche combinate / no |
| Children of Morta | 9,99 € | circa 14 h | Pagamento, DLC inclusi | **La critica principale** | No | Famiglia / no |
| Grimvalor | gratis + 6,99 $ | circa 7 h | **Demo + sblocco** | Buoni, pulsanti piccoli | No | No / no |
| **CHRONOS oggi** | **5,99 €** | **38–45 min stimati** | Demo + sblocco (deciso) | Nessun dato umano | **10 scelte, 1 finale** | **Nox + Lulù / Vortex** |

**Lettura del Product Analyst**
- **Il prezzo è in linea:** 5,99 € sta tra GTA Chinatown Wars (4,99 $) e Grimvalor (6,99 $) **[FATTO]**.
- **La durata è fuori scala:** tutti i benchmark offrono da 3 a oltre 30 ore **[FATTO]**.
- **Il nostro punto unico è la combinazione:** duo, veicoli e scelte nello stesso gioco **[IPOTESI]**. Nessun benchmark le ha tutte e tre.

## B. Top 10 pattern

Impatto e sforzo sono stime del team **[IPOTESI]**. S = giorni, M = 1–2 settimane, L = oltre 2 settimane.

| # | Pattern | Da | Impatto | Sforzo | Prevale | Dove nel repo |
|---|---|---|---|---|---|---|
| 1 | **Durata di almeno 105 min con 8+ boss** (vedi §G) | Tutti | Alto | L | Product | `game/missions.mjs`, `game/campaign.mjs` |
| 2 | **Demo fino a «La firma» e una sola schermata di sblocco** | Grimvalor | Alto | L | Product | Android + `game/runtime.mjs` |
| 3 | **Muoversi non deve mai attaccare.** Nel codice è già così: un tocco sulla mappa avvia solo il joystick, sia a piedi sia in guida (`game/runtime.mjs:680`). Il test con 200 tocchi lo conferma sul layout vero, anche vicino ai pulsanti. Poi misurare menu e scelte a 390×844 e dare il colore dell'eroe agli oggetti che usa | Children of Morta, Chrono Trigger, Brothers | Alto | S | Tech Lead | `tools/verify_controls_v9.cjs` |
| 4 | **Niente blocchi di sola lettura nel primo minuto.** Il controllo entro 30 s c'è già, in «Due colpi»; resta il blocco di 34 s di «Otto mesi dopo» | Hyper Light Drifter | Alto | S | Game Designer | `game/story-v08.mjs` (home) |
| 5 | **Ogni scelta torna:** controllare le 10 una per una | Chrono Trigger | Alto | M | Game Designer | `game/narrative.mjs`, `game/story-v08.mjs` |
| 6 | **Tappe di 4 min al massimo, con checkpoint a metà** | GTA CW, Grimvalor | Medio | M | Game Designer e Tech Lead | `bossCheckpoint`, `game/missions.mjs:98` |
| 7 | **La storia va avanti anche quando perdi:** una battuta nuova per boss | Children of Morta (nota da Hades) | Medio | S | Game Designer | `game/runtime.mjs:183`, `BARKS` |
| 8 | **Perfect Dodge che si sente:** lampo, suono, vibrazione, senza fermo-immagine | Hyper Light Drifter | Medio | S | Game Designer | `game/campaign.mjs:204` |
| 9 | **Gare che contano nella storia:** la vittoria sblocca qualcosa nell'hub | GTA CW | Medio | M | Game Designer | `game/racing-v9.mjs`, `game/hubs.mjs` |
| 10 | **Potenziamenti che danno capacità:** per esempio, il contrattacco di Nox rimanda indietro un proiettile | Hyper Light Drifter, Katana Zero | Medio | M | Game Designer | `game/hubs.mjs`, `game/weapons-v9.mjs` |

**Disaccordo del Game Designer sul n. 5.** Lo vorrebbe al primo posto: secondo lui è l'unico pattern che rende CHRONOS diverso da tutti i benchmark. Il Product Analyst lo tiene quinto, perché senza durata e demo nessuno arriva a vedere le scelte.

**Esclusi, e perché**
- **Colpo assistito e pulsanti spostabili:** li hai esclusi tu.
- **Gesti touch per le azioni di trama:** aggiungono un'interazione nuova, quindi rientrano nei miglioramenti in più che hai escluso.
- **Mossa Duo raccontata:** entra nel progetto dei boss (n. 1), soprattutto Archon.
- **Leggibilità a 6 pollici:** entra nel n. 3.
- **Salvataggio che sopravvive alla reinstallazione:** va tra i rischi della Fase 4.
- **Dialoghi interrompibili** (Katana Zero): fuori scope per la Parte I.

## C. Core loop rivisto (5 righe)

1. **Scena breve:** entro 30 s hai il controllo, e c'è una domanda sui 19 civili.
2. **Missione a piedi** di 4 min al massimo, con l'obiettivo in una frase: Perfect Dodge e contrattacco con Nox, Risonanza con Lulù.
3. **Boss del distretto** (8+): ogni sconfitta dà una battuta nuova e si riparte dal checkpoint.
4. **Vortex:** fuga o gara di Veyra, e la vittoria sblocca qualcosa nell'hub.
5. **Hub:** incarichi, un potenziamento che dà una capacità nuova, e una scelta che tornerà più avanti.

## D. FTUE, i primi 5 minuti

I tempi di «Oggi» vengono dalla stima della rotta A **[FATTO, stima non umana]**. I tempi della proposta sono obiettivi **[IPOTESI]**, da misurare con `tools/estimate_playtime.mjs` e poi con persone vere. **Nessuna riga di testo viene cancellata:** al massimo si sposta, e le righe le scegliamo insieme.

| Tempo | Oggi | Proposta | Benchmark |
|---|---|---|---|
| **0–30 s** | «Due colpi»: Nox si muove già fino al vetro, con il primo controllo intorno ai 10 s. Poi «Otto mesi dopo»: circa 34 s di sola lettura | Il primo controllo resta com'è. «Otto mesi dopo» resta con 2–3 battute dette mentre si cammina; le altre passano al Moon Refuge | Hyper Light Drifter, Dead Cells |
| **30–60 s** | Si legge ancora il brief del Blackout | Brief in una frase, quella del `goal`. Tutorial «muovi» e «spara» sui primi raider | GTA Chinatown Wars |
| **1–2 min** | Prima ondata | Tutorial «schiva»: il primo Perfect Dodge con lampo, suono e vibrazione. Primo relè | Hyper Light Drifter |
| **2–3,5 min** | Relè 2 e 3 | Invariato, con le battute di Lulù durante il gioco. Rook si sveglia: «Il sistema ti ha scelto. Io no.» | — |
| **3,5–4,5 min** | Rook (48 hp) | Se perdi, una battuta nuova e si riparte dal boss | Children of Morta (nota da Hades) |
| **4,5–5 min** | Scelta della città (`blackout_power`), poi la fuga in auto | **Invariato:** prima scelta e prima guida entro 5 min è già il ritmo giusto | GTA Chinatown Wars |

## E. Modello premium

**Struttura**
- **Un'app sola**, gratuita da scaricare.
- **Demo:** dall'inizio fino a «La firma». Oggi ci si arriva in 14–19 min probabili **[FATTO, stima]**. Con la campagna a 105 min sarebbe circa il 15% **[IPOTESI]**.
- **Sblocco:** un solo acquisto in-app non consumabile a **5,99 €**. Si ripristina su un altro telefono con lo stesso account Google.
- **Offline:** l'acquisto richiede la connessione una volta. Dopo, il gioco funziona senza rete e ricontrolla l'acquisto con Play Billing quando torna online **[IPOTESI tecnica, da verificare nel terminale]**.

**Momenti in cui si chiede di acquistare**
1. **La schermata dopo «La firma»**, cioè il cliffhanger: «La storia continua», prezzo, «Sblocca» oppure «Più tardi».
2. **Una voce discreta nel menu principale:** «Sblocca la storia completa».

Non ce ne sono altri:
- nessuna pubblicità;
- nessun timer;
- nessun promemoria ripetuto.

Chi sceglie «Più tardi» può rigiocare la demo. La schermata torna solo quando arriva di nuovo a «La firma».

**Prezzo e valore** (prevale il Product Analyst)
- 5,99 € è nella media dei benchmark **[FATTO]**.
- Con 105 min fa circa 3,4 € all'ora, contro circa 1 $ all'ora di Grimvalor **[IPOTESI** sul calcolo**]**.
- Per questo la scheda sul Play Store deve dire onestamente «campagna di circa 2 ore». È meglio sapere prima che scoprire dopo: riduce le recensioni «troppo corto» **[IPOTESI]**.

**DLC**
- **Nessun DLC al lancio.** Il mandato V10.2, al §5, vieta di rinviare le regioni confermate a DLC o a Chrono Shadows senza una tua decisione esplicita **[FATTO]**.
- **Chrono Shadows è il seguito**, un prodotto separato con il suo prezzo: è la storia di Kairn e Morrow.

**Realizzazione:** nel terminale con Remote Control, secondo il mandato della Fase 4. Pubblicazione solo con la tua autorizzazione esplicita.

## F. Analytics privacy-friendly e KPI

**Principi** (prevale il Tech Lead)
- Nessun SDK pubblicitario, nessun ID pubblicitario, nessun dato personale.
- **Build di playtest:** gli eventi restano sul telefono, in un file JSON che si esporta a mano dopo il test. Nessun dato viaggia in rete.
- **Build pubblica, al lancio:** solo i dati di Play Console, cioè installazioni, acquisti, Android vitals e recensioni. Nessuna telemetria dentro il gioco.
- **Facoltativo, da decidere:** contatori anonimi solo per il percorso demo → acquisto, attivi solo se il giocatore acconsente, e dichiarati nella sezione «Sicurezza dei dati» del Play Store.

**Eventi** (stessi nomi nel log di playtest e negli eventuali contatori)

| Evento | Quando | Dati (nessuno personale) |
|---|---|---|
| `session_start` | Apertura | Versione, lingua, orientamento |
| `first_control` | Primo movimento | Secondi dall'avvio |
| `tutorial_step` | Passo completato | Passo (muovi, spara, schiva, interagisci), secondi |
| `perfect_dodge` | Schivata perfetta riuscita | Tappa |
| `step_complete` | Fine tappa | Tappa, secondi, morti |
| `boss_result` | Vittoria o sconfitta | Boss, numero del tentativo |
| `choice_made` | Scelta fatta | Scelta, opzione |
| `race_result` | Fine gara | Gara, posizione |
| `demo_end` | Arrivo a «La firma» | Minuti totali |
| `unlock_shown`, `unlock_bought`, `unlock_closed` | Schermata di sblocco | — |
| `credits` | Titoli di coda | Minuti totali, morti totali |
| `replay_route` | «Gioca l'altra rotta» | — |

**KPI obiettivo** (prevale il Product Analyst). Sono tutti **[IPOTESI]**, da ricalibrare dopo il primo test con persone. Non ho dati pubblici verificati sulle conversioni da demo a acquisto.

| KPI | Obiettivo | Da dove viene il dato |
|---|---|---|
| Primo controllo | entro 30 s | `first_control`, già stimabile oggi |
| Tutorial completato | almeno il 90% di chi inizia | `tutorial_step` |
| Arrivo a «La firma» | almeno il 60% di chi inizia | `demo_end` / `session_start` |
| Da demo ad acquisto | ipotesi di partenza 5–10% di chi vede la schermata | `unlock_bought` / `unlock_shown`, oppure Play Console |
| Campagna completata | almeno il 50% di chi ha comprato | `credits` |
| Durata della prima partita (mediana) | almeno 105 min | `credits` |
| Tentativi per boss (mediana) | 3 al massimo | `boss_result` |
| Voto sul Play Store | almeno 4,5 | Play Console |
| Crash | sotto la soglia di Android vitals | Play Console |

## G. Scope: Parte I contro Chrono Shadows

**I fatti** **[FATTO]**
- Il canone V10.2 prevede **17 incontri maggiori**. Ne cito alcuni:
  - Rook, The Anchor, Volkov, Custode del Nodo, Vega, EVE-Prime;
  - Cathedral Bone Tyrant, Shadow Reaper, Toxic Forge Behemoth;
  - Root Engine, The Ram, The Twelfth Observer, The Lamplight King;
  - HELIX, Sera Venn, PARALLAX, Archon.
- Il mandato dice che rinviarne uno «richiede decisione esplicita dell'autore».
- In campagna oggi ce ne sono **5**.
- Esistono già le **sprite di 3 boss** in `game/art/chrono/`: `cathedral_bone_tyrant.png`, `toxic_forge_behemoth.png` e `shadow_reaper.png`, strisce alte 128 px. **Non sono ancora usate in campagna.** Se bastino per un boss completo, con attacchi e colpi subiti, è **[IPOTESI]**: va verificato.

**Proposta** (prevale il Product Analyst)

| Contenuto | Parte I, al lancio | Dopo il lancio: aggiornamenti della Parte I | Chrono Shadows |
|---|---|---|---|
| Boss esistenti | Rook, The Anchor, Custode del Nodo, Specchio (EVE), Archon | — | — |
| Boss nuovi con le sprite già pronte | **Cathedral Bone Tyrant** (Cathedral Quarter, Atto II), **Toxic Forge Behemoth** (Toxic Slum Bazaar, Atto III), **Shadow Reaper** → **totale 8** | — | — |
| Il «+» | **Vega**, 9° boss, se arrivano le immagini. Completa l'H-17 (D08) | — | — |
| Gli altri 8 incontri | — | Volkov, Root Engine, The Ram, Twelfth Observer, Lamplight King, HELIX, Sera Venn, PARALLAX. **Serve la tua decisione esplicita** | — |
| Kairn e Morrow | Solo nella scena dopo i titoli di coda (esiste già), e non giocabili | — | **Protagonisti** |

**Perché nessun incontro va in Chrono Shadows:** sono storie di Nox e Lulù, e il seguito è di Kairn e Morrow.

**Durata stimata con 8–9 boss** **[IPOTESI]**
- Ogni distretto nuovo vale circa 13 minuti: hub 2 min, due missioni da circa 3,5 min, boss 3 min, guida 1,5 min.
- Il conto: 42 min di oggi + 3 distretti (circa 40 min) + gare inserite nella storia (circa 4) + incarichi obbligatori (circa 4) = **circa 89 min**. Con Vega si arriva a **circa 100 min**.
- **Quindi 8 boss da soli probabilmente non bastano per arrivare a 105.** Serviranno altre missioni nei distretti nuovi. La stima va rifatta con lo strumento dopo ogni milestone.

**Disaccordo del Game Designer.** Rimandare 8 incontri dopo il lancio significa perdere temi forti, come HELIX, il gesto a distanza tra Nox e Lulù. Propone di scambiare Shadow Reaper con HELIX se le immagini di HELIX arrivano in tempo. Il Product Analyst tiene Shadow Reaper perché la sprite esiste già.
