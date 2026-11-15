# CHRONOS ADVENTURE: NOX & LULÙ — AUDIT NARRATIVO, PERSONAGGI & 11 BEAT (TIER 3.1)

**Ruolo:** Narrative Designer & Lead Game Designer Ciro  
**Repository:** `Flexati/Adventure-city`  
**Riferimento:** Canone Narrativo V8 (`NARRATIVE_CANON = 8`, `game/story-v08.mjs`, `game/missions.mjs`)  
**Data:** 8 Novembre 2026  

---

## 1. Risoluzione Definitiva della Discrepanza "10 vs 11 Scene Narrative"

### 1.1 Origine della Discrepanza
Nei documenti di sintesi intermedi della transizione V8-V10 (tra cui `TIER3_MASTER_REPORT.md` e note di design preliminari), la documentazione dichiarava testualmente:
> *"10 scene narrative/interattive (opening, home, tunnel, roof, eve, collapse, separation, radio, reunion, door, dawn)"*

Tuttavia, un conteggio puntuale dell'elenco rivelava **11 elementi distinti**:
1. `opening`
2. `home`
3. `tunnel`
4. `roof`
5. `eve`
6. `collapse`
7. `separation`
8. `radio`
9. `reunion`
10. `door`
11. `dawn`

Si trattava di un errore materiale di conteggio (un "off-by-one" tipografico nei vecchi riepiloghi testuali), dove l'epilogo finale all'alba (`dawn`) o la separazione era stata esclusa dal conteggio numerico ma lasciata nell'elenco nominale.

### 1.2 Mappatura Ufficiale e Coerenza nel Runtime (`game/missions.mjs`)
Nella campagna finale a **31 tappe** (`CAMPAIGN`), la progressione integra perfettamente questi 11 snodi narrativi attraverso:
- **9 tappe dedicate a scena pura (`type: 'scene'`):** `opening`, `home`, `rooftop`, `separation`, `reunion`, `aftermath`, `rooftop_end`, `credits`, `postcredits`.
- **2 tappe ad alta integrazione narrativa/escape:** `tunnel` (guida con sonar e dialogo intimo) e `collapse` (fuga acrobatica dal collasso strutturale).
- **Integrazione dei beat intermedi:** `eve` (scelta morale nell'Archivio), `radio` (trasmissione dai canali di scolo) e `door` (la porta d'accesso al nucleo).

**Stato della discrepanza:** `CORRETTO E RISOLTO`. La documentazione e i report d'ora in avanti dichiarano con assoluta coerenza matematica **11 snodi/beat narrativi canonici** distribuiti lungo le 31 tappe della campagna.

---

## 2. La Dinamica tra Nox e Lulù

### 2.1 Identità e Contrasto Caratteriale
- **Nox (Unità EVE-47 NOX SERIES):** Risvegliato in una cassa di stoccaggio industriale. Introverso, parco di parole, fisico ma riflessivo. Non conosce il proprio passato ma sceglie di non essere uno strumento cieco delle corporazioni di Vanta. Il suo legame con Lulù non nasce da un programma predefinito, ma da una reciproca scelta di fiducia.
- **Lulù:** Ingegnosa, pragmatica, radiotelegrafista ribelle. Sopravvissuta nei bassifondi grazie alla capacità di improvvisare e riparare apparecchiature dismesse. Ha un forte senso etico della comunità (salvare i civili a qualunque costo), ma è tormentata dalla paura di dover sacrificare Nox per farlo.

### 2.2 Il Frammento di Vetro ("A niente")
L'oggetto raccolto nella prima scena (`opening`):
> *«A cosa serve?» — «A niente.» Nox lo tiene.*

Questo frammento trasparente, privo di valore commerciale o statistico, diventa l'ancora emotiva e diegetica della storia:
1. **Atto I:** Simbolo di un'esistenza non calcolata dal sistema di Vanta.
2. **Atto II (`separation`):** Resta nella tasca di Nox mentre cade nel baratro, unica prova tangibile del tempo trascorso con Lulù.
3. **Atto III (`finale`):** Utilizzato nel colpo di grazia contro Archon (`consentFinale`), rompendo la barriera che la tecnologia standard non poteva scalfire.
4. **Epilogo (`rooftop_end`):** Posato sul davanzale del rifugio alle prime luci dell'alba, chiudendo il cerchio poetico della vicenda.

---

## 3. Analisi degli 11 Snodi Narrativi Canonici

| Beat | Nome / Contesto | Funzione Drammaturgica | Nuova Informazione Rivelata | Tensione Emotiva | Collegamento al Beat Successivo |
| :-: | :--- | :--- | :--- | :--- | :--- |
| **#1** | `opening` (Due colpi) | Incipit e risveglio | Nox è un androide serie EVE; Lulù apre la cassa. | Mistero, smarrimento. | Porta alla convivenza di 8 mesi al rifugio. |
| **#2** | `home` (Otto mesi dopo) | Fondazione del legame | La vita quotidiana a Old Town; sintonia e affetto reciproco. | Calore, serenità precaria. | Interrotta dal blackout di emergenza. |
| **#3** | `tunnel` (La fuga) | Prima prova congiunta | La città è monitorata dai droni dell'Asse. | Tensione e cooperazione. | Arrivo al Moon Refuge. |
| **#4** | `roof` (La promessa) | Il patto tra i due | Lulù promette di non usare mai la frequenza di Nox senza consenso. | Intimità, promessa solenne. | Rende devastante il tradimento della firma. |
| **#5** | `separation` (La firma) | La frattura morale | Lulù trasmette la firma di Nox per aprire la paratia ai civili; Nox cade. | Shock, tradimento, disperazione. | Bivio delle due rotte solitarie di Atto III. |
| **#6** | `eve` (L'archivio) | Rivelazione delle origini | Nox scopre chi ha costruito la serie EVE e perché Archon governa. | Crisi d'identità, rivalsa. | Consapevolezza necessaria per affrontare la torre. |
| **#7** | `radio` (Tracce nel buio) | Riconnessione a distanza | Lulù lascia segni di gesso e messaggi radio criptati nei canali. | Speranza, timore del rifiuto. | Guida Nox verso la Clockwork Outpost. |
| **#8** | `reunion` (Il confronto) | Catarsi e verità | «Posso venire con te?» — Confronto a viso aperto sulle decisioni passate. | Riconciliazione (in 3 tonalità termiche). | Determinazione unita per l'assalto finale. |
| **#9** | `door` (La soglia dell'Asse) | Preparazione all'epilogo | Lulù consegna il terminale a Nox: totale parità decisionale. | Risolutezza e fiducia ritrovata. | Apertura della sala del trono di Archon. |
| **#10** | `collapse` (Il crollo) | Risoluzione del conflitto | Spezzamento della corona temporale di Elena; fuga insieme prima del collasso. | Urgenza, adrenalina, liberazione. | La città sopravvive senza la dittatura del nucleo. |
| **#11** | `dawn` (A niente) | Epilogo e compimento | Skyline all'alba sul tetto del rifugio; il frammento di vetro sul davanzale. | Pace, sollievo, apertura al futuro. | Gancio New Game+ «Gioca l'altra rotta». |

---

## 4. Livelli Termici del Ricongiungimento (`reunionTier`)

Il dialogo del ricongiungimento non è predeterminato, ma riflette le scelte del giocatore attraverso la variabile `thermal`:
- **Livello Caldo (`thermal >= 60`):** Nox accoglie Lulù con affetto immediato (*«Sì. Ma chiedimelo anche la prossima volta»*).
- **Livello Cauto (`45 <= thermal < 60`):** Nox riconosce il legame ma ammette la ferita (*«Non so se mi fido ancora. Ma vieni»*).
- **Livello Fragile (`thermal < 45`):** Risoluzione asciutta e matura (*«Non ti perdono. Vieni comunque»*).

Questa profondità narrativa assicura una forte spinta al replay attraverso la seconda rotta (`D22`).
