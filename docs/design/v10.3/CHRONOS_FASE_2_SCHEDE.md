# CHRONOS Adventure: Nox & Lulù — Fase 2, schede benchmark

2 novembre 2026 · rivista: decisioni in [DECISIONI.md](../../gold/DECISIONI.md) (D18–D26) · `COMMERCIAL_RELEASE = BLOCKED`

**Legenda**
- **[FATTO]**: verificato su una fonte esterna (link in fondo) o nel repo `Flexati/Adventure-city`.
- **[IPOTESI]**: giudizio del team, oppure un dettaglio che conosciamo ma che non ho verificato su una fonte in questa sessione.
- Le durate di CHRONOS vengono da `docs/evidence/v10.2/playtime/PLAYTIME_ESTIMATE.json`. Sono **stime dei test automatici, non durate umane** (`ESTIMATE_NOT_HUMAN`).

## Decisioni prese nella revisione della Fase 1

| # | Decisione | Effetto sul lavoro |
|---|---|---|
| 1 | Sostituzioni approvate: Children of Morta al posto di Hades, Grimvalor al posto di Katana Zero | Le idee di Katana Zero restano come note di design per la Fase 3 |
| 2 | **Prezzo ufficiale: 5,99 €**, una tantum | Nel repo, 16 documenti citano ancora 4,99 €. Li allineo solo con il tuo ok |
| 3 | **Fonte di verità: `Flexati/Adventure-city`**, ramo `work/chronos-adventure-commercial` | Tutte le azioni «→ CHRONOS» puntano a file di questo repo |
| 4 | **Boss: almeno 8 nella Parte I** | La Fase 3 G non taglia i boss: diventa «come arrivare a 8+» |

## Prospettiva che prevale in Fase 2: Game Designer

Le schede parlano soprattutto di meccanica, primi minuti e sensazione di gioco. Il Product Analyst prevale sui punti 7 e 8 (prezzo, recensioni). Il Tech Lead prevale sul punto 5 (controlli touch). Ogni azione «→ CHRONOS» indica chi prevale e lo sforzo stimato **[IPOTESI]**: S = giorni, M = 1–2 settimane, L = oltre 2 settimane.

---

## Scheda 0 — CHRONOS oggi (la base per il confronto)

1. **Core loop.** Scena → missione a piedi (ondate, obiettivo, boss) → guida o gara → hub con incarichi → scelta **[FATTO]** (`game/missions.mjs:39`).
2. **Meccanica chiave.** Nox: Perfect Dodge che apre il contrattacco (`game/campaign.mjs:204`). Lulù: Risonanza, che stordisce (`game/campaign.mjs:166–168`). Mossa Duo animata **[FATTO]**. Come evolve: armi nuove per regione (`game/weapons-v9.mjs`) **[FATTO]**.
3. **Primi minuti** (stima, rotta A, valore probabile) **[FATTO, stima non umana]**:
   - **60 s:** in «Due colpi» si muove già Nox fino al vetro («Muovi Nox verso il vetro. Poi tocca RACCOGLI.», `game/runtime.mjs:478–481`), con il primo controllo intorno ai 10 s. Poi «Otto mesi dopo» è un blocco di circa 34 s di sola lettura, 61 parole e 9 tocchi. *(Correzione: prima scrivevo «46 s di lettura prima del primo controllo».)*
   - **5 min:** Blackout finito a circa 4,1 min, Rook compreso. Inizia la fuga in auto.
   - **Tutorial:** in 4 passi, muovi → spara → schiva → interagisci (`game/runtime.mjs:175`, `714–736`) **[FATTO]**.
4. **Motivi per continuare.** 10 scelte salvate **[FATTO]**:
   - 4 nelle missioni: `blackout_power`, `below_heat`, `archive_eve`, `line_wait`;
   - 6 nelle scene: due sulla promessa, due sul tetto, la rotta del gesso, la mano.

   In più: 4 hub con 8 incarichi, gare facoltative **[FATTO]**. *(Correzione del 2 novembre: prima indicavo 4 scelte e «3 rotte». A/B/C sono le 3 combinazioni di scelte usate dal test automatico, non percorsi del gioco: `tools/verify_campaign_browser.cjs:50`.)*
5. **Controlli touch.** Lo stesso joystick flottante vale per la guida e per il movimento a piedi, negli hub, nella fuga e nella camminata iniziale: dove tocchi la mappa compare l'anello, e se il dito va oltre il bordo l'anello lo segue (`game/runtime.mjs:672–680`) **[FATTO]**. A piedi si muove in tutte le direzioni (raggio 46 px); in guida solo a sinistra e a destra (raggio 56 px). Un tocco sulla mappa avvia solo il movimento: attacco e magia partono soltanto dai loro pulsanti **[FATTO]**. Pulsanti d'azione da 86×52 px CSS (`game/style.css:145`), quindi sopra i 48 dp raccomandati da Android **[FATTO]**.
6. **Narrativa.** Atto I a punti di vista alternati, poi le storie si separano («La firma»). I 19 civili sono la causa morale **[FATTO]**.
7. **Prezzo.** 5,99 € deciso. Demo e sblocco ancora da definire.
8. **Recensioni.** Nessuna. Zero sessioni con persone vere (`docs/gold/PLAYTEST.md`) **[FATTO]**.
9. **Durata e boss.** Campagna probabile di 38–45 min contro l'obiettivo di 105 **[FATTO, stima]**. **5 boss** contro l'obiettivo di 8+ **[FATTO]**:
   - Rook 48 hp, The Anchor 90, lo Specchio (EVE) 190, Archon 460 (`game/missions.mjs:17,18,30,36`);
   - il Custode del Nodo 300 hp, in Ora zero (`game/campaign.mjs:15`).

   *(Correzione del 2 novembre: nelle Fasi 1 e 2 indicavo 4 boss, perché mancava il Custode.)*

---

## Scheda 1 — Dead Cells (Motion Twin, Playdigious)

*Domanda: come si porta un'azione veloce sul touch? Come si vendono DLC dopo un lancio a pagamento?*

1. **Core loop.** Si attraversano biomi, si raccolgono celle e le si spendono dal Collezionista, tra un bioma e l'altro, per sblocchi permanenti. Quando muori, perdi le celle non spese e ricominci con più opzioni, non con statistiche più alte **[FATTO]**.
2. **Meccanica chiave.** Due armi e due abilità, diverse a ogni partita. Come evolve **[FATTO]**:
   - le rune, prese dai boss, aprono strade nuove;
   - dopo il boss finale arrivano 5 livelli di difficoltà (Boss Cells);
   - al livello 5 compare il vero boss finale.
3. **Primi minuti.**
   - **60 s:** si gioca subito, senza dialoghi, nel primo bioma (Prisoners' Quarters) **[IPOTESI]**.
   - **5 min:** prima arma scelta e probabilmente prima morte. Il ciclo di sblocco si capisce alla prima morte **[IPOTESI]**.
4. **Motivi per continuare.** Sblocchi permanenti, strade nuove, livelli di difficoltà. NME definisce «enorme» la varietà di build **[FATTO]**.
5. **Controlli touch.** **[FATTO]**
   - Interfaccia ridisegnata per il touch.
   - Modalità Auto-Hit: colpisce da sola i nemici a portata dell'arma.
   - Pulsanti spostabili e ridimensionabili, controller supportato.
   - Critiche: i controlli «non sempre funzionano», crampi alle mani (NME); interfaccia sovraccarica (Mobi.gg).
6. **Narrativa e scelte.** Racconto minimo, soprattutto ambientale. Nessuna scelta che resta **[IPOTESI]**.
7. **Prezzo e DLC.** **[FATTO]**
   - Gioco: 8,99 $ di listino (9,99 $ al lancio), in offerta fino a 4,99 $.
   - DLC venduti a parte: 3,99 € ciascuno per The Bad Seed, Fatal Falls e The Queen and the Sea; 7,99 € per Return to Castlevania.
   - Il lancio a pagamento ha retto anni di DLC.
8. **Recensioni negative ricorrenti.** **[FATTO, fonti di qualità mista]**
   - Controlli touch: serve tempo per abituarsi, meglio con il controller (148Apps).
   - Interfaccia affollata.
   - Salvataggi persi dopo una reinstallazione (versione Netflix).
9. **→ CHRONOS**
   - **Opzione «Colpo assistito»** nelle impostazioni, spenta di default. Quando un nemico è nel raggio d'attacco, l'attacco parte da solo. Agisce solo sull'input: hitbox e tempi restano identici. Prevale il Tech Lead · M.
   - **Pulsanti spostabili e ridimensionabili**, salvati nelle impostazioni. Il joystick resta attivo ovunque. Prevale il Tech Lead · M.
   - **Salvataggio che sopravvive alla reinstallazione** con il backup automatico di Android. Da verificare: il backup copia i dati della WebView? **[IPOTESI]** Prevale il Tech Lead · S.

## Scheda 2 — GTA Chinatown Wars (Rockstar)

*Domanda: come si alternano missioni a piedi e guida in top-down, in partite brevi?*

1. **Core loop.** Missione breve da un contatto → guida e sparatorie top-down → soldi → commercio tra quartieri e minigiochi touch → missione nuova. Le missioni sono «brevi e dirette, perfette per giocare poco alla volta» (GamingTarget) **[FATTO]**.
2. **Meccanica chiave.** Guida top-down in una città aperta, più minigiochi touch legati al contesto: molotov dal benzinaio, tatuaggi alle reclute, cassonetti, sonar per i carichi **[FATTO]**. Come evolve: nuove zone, armi e contatti **[IPOTESI]**.
3. **Primi minuti.**
   - **60 s:** introduzione a fumetti, poi si gioca **[IPOTESI]**.
   - **5 min:** prima guida e primo minigioco touch (avviare un'auto rubata) **[IPOTESI]**.
4. **Motivi per continuare.** Economia del commercio, sfide «rampage», radio, missioni secondarie **[FATTO]**.
5. **Controlli touch.** Su Android: stick e pulsanti virtuali molto personalizzabili, più i controlli touch originali **[FATTO]**. Serve tempo per abituarsi **[FATTO]**.
6. **Narrativa e scelte.** Storia lineare a fumetti, nessuna scelta che resta **[IPOTESI]**.
7. **Prezzo e DLC.** 4,99 $ / 2,99 £ su Android, spesso 2,99 $ in offerta **[FATTO]**. Nessun DLC **[IPOTESI]**. Prova gratuita non confermata.
8. **Recensioni negative ricorrenti.** **[FATTO]**
   - Menu scomodi (Pocket Gamer).
   - Commercio lento: si tocca per aprire bagagliai e borse, dove una tabella sarebbe più rapida (Giant Bomb).
   - Tocchi richiesti in momenti scomodi (GameSpot).
9. **→ CHRONOS**
   - **Regola dei 4 minuti:** ogni tappa a piedi deve durare al massimo circa 4 min probabili, con l'obiettivo detto in una frase. Il campo `goal` esiste già: «Riaccendi i 3 relè, poi affronta Rook». Si controlla con `tools/estimate_playtime.mjs`; oggi Blackout dura 3,4 min. Prevale il Game Designer · S.
   - **Gare che contano nella storia:** vincere una gara di Veyra sblocca qualcosa nella campagna, per esempio un incarico o un'arma nell'hub. Le gare smettono di essere facoltative senza diventare obbligatorie (`game/racing-v9.mjs`, `game/hubs.mjs`). Prevale il Game Designer · M.
   - **Gesti touch per le azioni di trama**, da 5 a 10 secondi: trascinare il cavo per riaccendere un relè, ruotare per chiudere un'ancora. Riguardano solo l'interazione, non il combattimento. Prevale il Game Designer · M.

## Scheda 3 — Brothers: A Tale of Two Sons (Starbreeze, 505 Games)

*Domanda: come si rende chiaro un duo su un solo schermo? Quanto può durare un gioco narrativo a pagamento?*

1. **Core loop.** Un viaggio lineare con enigmi ambientali che richiedono entrambi i fratelli: il forte spinge le leve, il piccolo passa negli spazi stretti. I nemici non si combattono: si aggirano con l'ambiente **[FATTO]**.
2. **Meccanica chiave.** Un joystick per fratello, e l'azione dipende dal contesto. Gli oggetti sono evidenziati in blu o arancio per dire chi può usarli. Alcune leve pesanti vogliono tutti e due **[FATTO]**. Come evolve: nel finale il controllo stesso diventa racconto **[IPOTESI]**.
3. **Primi minuti.**
   - **60 s:** scena breve, poi subito i due fratelli, senza testo da leggere **[IPOTESI]**.
   - **5 min:** primo enigma a due **[IPOTESI]**.
4. **Motivi per continuare.** La storia e il legame tra i due. Dura circa 3 ore **[FATTO, fonte indiretta]**.
5. **Controlli touch.** «Funziona davvero bene», ma è «un po' macchinoso» in certi punti; voto 4,5/5 (Pocket Gamer) **[FATTO]**. Raramente bisogna muoverli insieme **[FATTO]**. Kotaku invece sconsigliava la versione iOS **[FATTO]**.
6. **Narrativa e scelte.** Racconta senza parole comprensibili. Nessuna scelta **[FATTO]**.
7. **Prezzo e DLC.** Lanciato a 3,29 € in offerta. Nessun DLC **[FATTO]**.
8. **Recensioni negative ricorrenti.** Controlli e bug (fonte debole), cali di prestazioni, un boss bloccato, crash (Pocket Gamer) **[FATTO]**.
9. **→ CHRONOS**
   - **Colore del personaggio sugli oggetti:** ciò che usa Nox ha il suo colore, ciò che usa Lulù il suo (relè, ancore, terminali). È solo grafica. Prevale il Game Designer · S.
   - **Mossa Duo raccontata:** in almeno 2 momenti chiave, Ora zero e Archon, la Duo chiude la scena come gesto di trama e non solo come attacco. I tempi della mossa non cambiano. Prevale il Game Designer · M.
   - **Durata come requisito di uscita:** Brothers offre circa 3 ore a 3–5 €, CHRONOS oggi 38–45 min stimati a 5,99 €. I 105 minuti restano una condizione per pubblicare, non un desiderio. Prevale il Product Analyst · nessuno sforzo, è una regola.

## Scheda 4 — Hyper Light Drifter (Heart Machine, Abylight)

*Domanda: top-down in pixel art con lo scatto. Cosa dicono i giocatori di difficoltà e controlli?*

1. **Core loop.** Da un villaggio centrale si esplorano 4 regioni (deserto, foresta, montagna, acqua). Si combatte, si trovano chiavi e frammenti, si comprano potenziamenti **[FATTO** sulle regioni, **IPOTESI** sul resto**]**.
2. **Meccanica chiave.** Scatto, spada e arma a distanza. I nemici sono intelligenti e spesso non si affrontano di fronte: bisogna schivare e aggirare **[FATTO]**. Come evolve: i potenziamenti aggiungono capacità, non statistiche, e ci si sente fragili dall'inizio alla fine **[FATTO]**.
3. **Primi minuti.**
   - **60 s:** scena muta, poi si gioca **[IPOTESI]**.
   - **5 min:** primi nemici. Il ritmo iniziale è «lento» e il combattimento dà il meglio solo più avanti **[FATTO]**.
4. **Motivi per continuare.** Un mondo che si rivela poco alla volta, segreti. Circa 8 ore per la storia principale **[FATTO, fonte indiretta]**.
5. **Controlli touch.** «La finezza di una levetta analogica non si ricrea facilmente sullo schermo» (Pocket Gamer, 4,5/5) **[FATTO]**. Controller consigliato (TouchArcade). Su Android i giocatori chiedono di spostare e ridimensionare i pulsanti **[FATTO, fonte debole]**.
6. **Narrativa e scelte.** Storia senza parole **[FATTO]**. Nessuna scelta **[IPOTESI]**.
7. **Prezzo e DLC.** Special Edition a pagamento; il prezzo cambia molto tra le fonti **[FATTO]**. Nessun DLC **[IPOTESI]**.
8. **Recensioni negative ricorrenti.** Controlli touch, inizio lento, difficoltà alta **[FATTO]**. Crash su Android **[FATTO, fonte debole]**.
9. **→ CHRONOS**
   - **Perfect Dodge che si sente:** quando riesce, lampo, suono e vibrazione sull'evento `perfectDodge` che esiste già. Niente fermo-immagine, perché cambierebbe i tempi. Prevale il Game Designer · S.
   - **Potenziamenti che danno capacità, non numeri:** negli hub si comprano usi nuovi invece di danno in più. Per esempio, il contrattacco di Nox che rimanda indietro un proiettile (la nota da Katana Zero). Le finestre di tempo esistenti non cambiano (`game/hubs.mjs`, `game/weapons-v9.mjs`). Prevale il Game Designer · M.
   - **Niente lettura lunga nel primo minuto:** HLD è criticato per l'inizio lento. In CHRONOS il controllo arriva già in «Due colpi», ma subito dopo «Otto mesi dopo» chiede circa 34 s di sola lettura. Alcune battute possono essere dette mentre si cammina; il testo resta, cambia solo il ritmo. Prevale il Game Designer, d'accordo il Product Analyst · S.

## Scheda 5 — Chrono Trigger (Square Enix)

*Domanda: viaggio nel tempo, tecniche combinate, finali multipli. Quanto pesa una conversione per mobile fatta male?*

1. **Core loop.** Esplorazione, poi combattimenti a tempo attivo (ATB) senza cambio di schermata, poi avanzamento tra le epoche **[IPOTESI]**.
2. **Meccanica chiave.** Viaggio nel tempo con un luogo centrale, la Fine del Tempo **[FATTO]**. Tecniche combinate tra 2 o 3 personaggi **[IPOTESI]**: è il parente più vicino della nostra Mossa Duo.
3. **Primi minuti.**
   - **60 s:** risveglio del protagonista, poi subito alla Fiera del Millennio **[IPOTESI]**.
   - **5 min:** esplorazione libera della fiera, minigiochi, primo incontro chiave **[IPOTESI]**.
4. **Motivi per continuare.** **[FATTO]**
   - 13 finali nelle versioni DS e mobile, alcuni visibili solo con il New Game+.
   - Zone extra: Dimensional Vortex e Lost Sanctum.
   - Una partita normale supera le 30 ore.
5. **Controlli touch.** **[FATTO]**
   - Il joystick compare dove premi sul lato sinistro, ma è scomodo vicino ai bordi.
   - Il pulsante per cambiare bersaglio in battaglia è minuscolo.
   - Interfaccia «troppo grande».
   - La prima conversione è stata criticata, poi rifatta con la «Upgrade Ver.».
6. **Narrativa e scelte.** Il finale dipende da quando e come si affronta il boss finale **[FATTO** sul numero di finali, **IPOTESI** sul meccanismo**]**. Piccole azioni dell'inizio vengono ricordate più tardi nella storia **[IPOTESI]**.
7. **Prezzo e DLC.** 9,99 $ di listino, in offerta a circa 2,99 $. Nessun DLC. Criticato il prezzo alto per una conversione **[FATTO]**.
8. **Recensioni negative ricorrenti.** Controlli e interfaccia della prima versione, crash, prezzo **[FATTO]**.
9. **→ CHRONOS**
   - **Ogni scelta torna:** le 10 scelte salvate devono tornare almeno una volta più avanti, con una battuta, un civile che ricompare nell'hub o un cambio visibile. Si controlla una per una in `game/narrative.mjs` e si riempiono i buchi. Prevale il Game Designer · M.
   - **«Gioca l'altra rotta»:** dopo i titoli di coda, proporre un'altra rotta (A/B/C) tenendo gli sblocchi. **Attenzione:** questo tempo non conta nei 105 minuti della prima partita. Prevale il Product Analyst · M.
   - **Bersagli touch piccoli:** i pulsanti d'azione sono già a norma (86×52 px). Restano da misurare menu, scelte, pausa e dialoghi a 390×844, con un controllo browser come quelli di `tools/`. Prevale il Tech Lead · S.

## Scheda 6 — Children of Morta (Dead Mage, Playdigious)

*Domanda: come si racconta una famiglia tra una partita e l'altra? Perché i controlli touch sono la critica principale?*

1. **Core loop.** Dalla casa dei Bergson si parte per una spedizione in zone che cambiano disposizione a ogni visita. Si torna a casa, dove ci sono scene di famiglia, e si riparte **[FATTO]**. I potenziamenti sono condivisi tra i membri **[IPOTESI]**.
2. **Meccanica chiave.** Più membri della famiglia, ognuno con statistiche, abilità e arma propria (mischia, distanza, specialista). Altri si aggiungono andando avanti **[FATTO]**. Come evolve: alcune zone richiedono un certo membro, quindi bisogna alternarli **[FATTO]**.
3. **Primi minuti.**
   - **60 s:** voce narrante e casa, poi la prima spedizione **[IPOTESI]**.
   - **5 min:** prime stanze e primo nemico forte **[IPOTESI]**.
4. **Motivi per continuare.** Vignette di famiglia «tra e durante le partite», che evitano la ripetizione (148Apps) **[FATTO]**. Nuovi membri e abilità **[FATTO]**. Circa 14 ore **[FATTO, fonte indiretta]**.
5. **Controlli touch.** **[FATTO]**
   - Pocket Gamer (4,5/5): i controlli «non sono sempre all'altezza», e gli attacchi direzionali partono quando vuoi solo muoverti o mirare, peggio con gli sciami.
   - 148Apps (3,5/5): nessuna personalizzazione, inadeguati alla difficoltà predefinita, trappole troppo piccole da vedere.
6. **Narrativa e scelte.** Voce narrante e vignette. Nessuna scelta **[IPOTESI]**.
7. **Prezzo e DLC.** 9,99 € al lancio, Complete Edition con i 2 DLC inclusi **[FATTO]**. Su PC i DLC costano 1,99 $ (Paws and Claws) e 4,99 $ (Ancient Spirits) **[FATTO]**.
8. **Recensioni negative ricorrenti.** Controlli touch, niente personalizzazione, leggibilità su schermi piccoli, picchi di difficoltà ai boss, grind **[FATTO]**.
9. **→ CHRONOS**
   - **Muoversi non deve mai attaccare:** è la critica principale a Children of Morta. Un controllo browser registra 200 tocchi di movimento in punti diversi dello schermo, nei due orientamenti, e verifica che nessuno faccia partire un attacco o una schivata. Si basa su `tools/verify_controls_v9.cjs`. Prevale il Tech Lead · S.
   - **Leggibilità a 6 pollici:** contorno più contrastato su proiettili e attacchi in arrivo, provato a 390×844. È solo grafica: le hitbox non cambiano. Prevale il Tech Lead · M.
   - **La storia va avanti anche quando perdi** (la nota da Hades): dopo una sconfitta contro un boss, Nox o Lulù dicono una battuta nuova, al massimo una per boss. Il contatore delle morti c'è già (`game/runtime.mjs:183`). Prevale il Game Designer · S.

## Scheda 7 — Grimvalor (Direlight)

*Domanda: su Android funziona il modello «primo atto gratis, poi sblocco unico» per un gioco d'azione?*

1. **Core loop.** Si esplora e si combatte in un atto. Si raccolgono frammenti d'anima e si sale di livello agli altari. Gli altari curano, ricaricano le pozioni, fanno da checkpoint e fanno tornare i nemici uccisi **[FATTO]**.
2. **Meccanica chiave.** Combo di attacco, schivata e salto, senza barra di stamina **[FATTO]**. Come evolve: punti statistica (Vigor, Savagery, Mastery, Focus), ridistribuibili dal 4° atto, più equipaggiamento e pietre di potenziamento **[FATTO, fonti di qualità mista]**.
3. **Primi minuti.**
   - **60 s:** si gioca subito, con il tutorial dentro il primo livello **[IPOTESI]**.
   - **5 min:** primo altare **[IPOTESI]**.
4. **Motivi per continuare.** Statistiche ed equipaggiamento. La morte costa poco: non perdi i frammenti e riparti dall'altare **[FATTO]**. Circa 7 ore **[FATTO]**.
5. **Controlli touch.** «Precisi e personalizzabili». Funzionano «sorprendentemente bene» occupando poco schermo (Pocket Gamer) **[FATTO]**. Critiche: pulsanti piccoli, a volte si sbaglia pulsante **[FATTO]**.
6. **Narrativa e scelte.** Storia leggera, nessuna scelta **[IPOTESI]**.
7. **Prezzo e DLC.** **[FATTO]**
   - Primo atto gratis (1–2 ore), poi sblocco unico da 6,99 $, senza altre microtransazioni.
   - Circa 6 milioni di installazioni, voto 4,7.
   - Una recensione vecchia parla di pubblicità nella parte gratuita: oggi non è confermato **[IPOTESI]**.
8. **Recensioni negative ricorrenti.** La difficoltà sale aggiungendo nemici, pulsanti piccoli **[FATTO]**.
9. **→ CHRONOS**
   - **Demo fino a «La firma»:** la demo finisce alla separazione di Nox e Lulù, il cliffhanger naturale. Oggi ci si arriva in 14–19 min probabili (rotte C/A/B) **[FATTO, stima]**. Con la campagna a 105 min sarebbe circa il 15% del gioco; in Grimvalor il primo atto è circa il 15–25%. Prevale il Product Analyst · S per la definizione.
   - **Una sola schermata di sblocco a 5,99 €**, subito dopo «La firma». Niente pubblicità, niente promemoria ripetuti, e la demo resta rigiocabile. Serve Play Billing nell'app Android, con un ponte verso il JS. Prevale il Product Analyst; il Tech Lead stima L.
   - **Checkpoint a metà nelle tappe lunghe:** oggi c'è un checkpoint solo al boss (`bossCheckpoint`, `game/missions.mjs:98`). Allungando la campagna verso 105 min, ogni tappa oltre i 4 min avrà un punto di ripartenza a metà, come gli altari. Il salvataggio resta compatibile con lo schema attuale. Prevale il Tech Lead · M.

---

## Cosa emerge dalle 7 schede (senza anticipare la Fase 3)

- **Controlli touch.** Sono la prima critica in 6 schede su 7. Le soluzioni che funzionano sono pulsanti personalizzabili, attacco assistito e movimento separato dall'attacco. CHRONOS parte bene, con joystick ovunque e pulsanti a norma, ma **senza un test con persone non lo sappiamo**.
- **Durata e prezzo.** Tutti i benchmark a pagamento durano da 3 a oltre 30 ore. CHRONOS ne ha meno di 1 stimata, ed è il divario più grave.
- **Scelte che restano.** Le ha solo Chrono Trigger, ed è qui che CHRONOS si distingue, se ogni scelta torna davvero più avanti.
- **Boss a 8+.** Da Children of Morta e Hyper Light Drifter: i picchi di difficoltà ai boss sono una critica ricorrente. Ogni nuovo boss avrà un checkpoint e una battuta dopo la sconfitta.

## Fonti

- Dead Cells: [TouchArcade, lancio Android](https://toucharcade.com/2020/06/03/dead-cells-download-android-google-play-price-playdigious-premium/), [TouchArcade, Return to Castlevania](https://toucharcade.com/2023/06/27/dead-cells-return-to-castlevania-dlc-mobile-download-update-iphone-android-price-update-playdigious/), [NME](https://www.nme.com/reviews/dead-cells-review-a-good-mobile-port-of-an-excellent-roguelike-game-2699135), [148Apps](https://www.148apps.com/reviews/dead-cells-review), [Mobi.gg](https://mobi.gg/en/games/tests/dead-cells-mobile-review), [App Store](https://apps.apple.com/ie/app/dead-cells/id1389752090), [Wikipedia](https://en.wikipedia.org/wiki/Dead_Cells), [Dead Cells Wiki, valute](https://deadcells.wiki.gg/wiki/Currency), [Slickdeals](https://slickdeals.net/f/14842621-dead-cells-ios-android-5-99-reg-8-99-google-play)
- GTA Chinatown Wars: [Pocket Gamer, Android](https://www.pocketgamer.com/gta-chinatown-wars-hd/rockstar-finally-brings-gta-chinatown-wars-to-android-4-years-after-ios-version), [Gear Diary](https://geardiary.com/2014/12/23/gta-chinatown-wars-goes-universal-out-on-android/), [Fonearena](https://www.fonearena.com/blog/126412/gta-chinatown-wars-finally-arrives-for-android-new-features-added-for-ios.html/amp), [GameSpot](https://www.gamespot.com/ds/action/grandtheftautochinatownwars/review.html/), [Giant Bomb](https://giantbomb.com/reviews/grand-theft-auto-chinatown-wars-review/1900-230/), [Game Informer](https://gameinformer.com/games/grand_theft_auto_chinatown_wars/b/nintendo_ds/archive/2009/09/22/review), [GamingTarget](https://www.gamingtarget.com/article.php?artid=9673)
- Brothers: [Pocket Gamer](https://www.pocketgamer.com/brothers-a-tale-of-two-sons/review/), [Android Police](https://www.androidpolice.com/2016/05/28/story-focused-platformer-brothers-a-tale-of-two-sons-jumps-from-pc-and-consoles-to-the-play-store-for-3/), [505 Games, versione iOS](https://support.505games.com/support/solutions/articles/150000147021-are-there-exclusive-features-in-the-ios-version-of-brothers-ios-), [Gamepressure, durata](https://www.gamepressure.com/editorials/19-great-one-night-games/zf447), [SplitMetrics](https://splitmetrics.com/apps/brothers-a-tale-of-two-sons/id1029588869)
- Hyper Light Drifter: [Pocket Gamer](https://www.pocketgamer.com/hyper-light-drifter/hyper-light-drifter-mobile-review-a-compelling-dance/), [TouchArcade](https://toucharcade.com/2019/07/25/hyper-light-drifter-iphone-review/), [Gamezebo](https://www.gamezebo.com/reviews/hyper-light-drifter-mobile-review-how-does-it-play-on-iphone-and-ipad/), [r/AndroidGaming](https://lr.us.psf.lt/r/AndroidGaming/comments/1f32ui0/hyper_light_drifter_on_android), [gg.deals, durata](https://gg.deals/game/hyper-light-drifter/)
- Chrono Trigger: [Android Police](https://www.androidpolice.com/2012/11/02/a-blast-from-the-past-a-review-of-chrono-trigger-for-android/), [Pocket Gamer, recensione](https://www.pocketgamer.com/chrono-trigger/chrono-trigger-review/), [Pocket Gamer, finali](https://www.pocketgamer.com/chrono-trigger/endings), [Chrono Wiki, finali](https://www.chronowiki.org/wiki/List_of_Chrono_Trigger_endings), [MobileSyrup](https://mobilesyrup.com/2015/09/26/game-of-the-week-chrono-trigger/), [Steam](https://steamcommunity.com/app/613830/discussions/0/1693788384146404303), [offerta 2,99 $](https://reddit.birdcat.cafe/r/AndroidGaming/comments/1j80hpe/sale_chrono_trigger_299_on_google_play_store)
- Children of Morta: [Pocket Gamer](https://www.pocketgamer.com/children-of-morta/review), [148Apps](https://www.148apps.com/children-of-morta/review/), [SteamDB, Paws and Claws](https://steamdb.info/app/1317160), [SteamDB, Ancient Spirits](https://steamdb.info/app/1648880), [SVG, durata](https://svg.com/169540/how-long-does-it-take-to-beat-children-of-morta), [Playdigious, lancio](https://playdigious.com/?p=4000)
- Grimvalor: [TapTap](https://www.taptap.io/post/9999776), [Pocket Gamer, App Army](https://www.pocketgamer.com/grimvalor/app-army-assembles-could-grimvalor-be-a-goty-contender), [App Store](https://apps.apple.com/gb/app/grimvalor/id1369179088), [Gamer Braves](https://gamerbraves.com/?p=39602), [Nintendo World Report](https://www.nintendoworldreport.com/review/53410/grimvalor-switch-review), [GameGrin](https://www.gamegrin.com/reviews/grimvalor-review), [AppGoblin](https://appgoblin.info/apps/com.direlight.grimvalor)
- Bersagli touch Android da 48 dp: [Android Developers](https://developer.android.com/guide/topics/ui/accessibility/views/apps-views)
