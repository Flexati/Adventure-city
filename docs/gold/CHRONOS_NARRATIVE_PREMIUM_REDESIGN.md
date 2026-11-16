# CHRONOS ADVENTURE: NOX & LULÙ — NARRATIVE PREMIUM REDESIGN & CANON AUDIT (FASE 4)

**Documento:** Architettura Narrativa, Caratterizzazione di Nox & Lulù, Ritmo Emotivo e Canone Parte I  
**Fonti Verificate:** `CLAUDE.md`, `game/story-v08.mjs`, `game/story-en.mjs`, `game/arsenal-data.mjs`, `game/narrative.mjs`, `docs/WORLD_CHARACTER_EXPANSION_BIBLE_V86.md`  

---

## 1. RISPETTO ASSOLUTO DEL CANONE FISSO (`CLAUDE.md` §Regole Fisse #6)

Tutti i vincoli narrativi non negoziabili dell'autore sono stati verificati riga per riga nel codice di produzione:

1. **Nox (maschile) e Lulù (femminile) sono gli unici protagonisti giocabili:**
   - Verificato in `game/missions.mjs`, `game/story-v08.mjs` e `game/story-en.mjs` (`D07`, test `tests/claude-guide.test.mjs`). Nessuna concordanza femminile residua riferita a Nox.
2. **Archon è il boss finale della Parte I:**
   - Nella tappa `finale` (`game/campaign.mjs:346, 1125-1127`), Archon attraversa le tre fasi *ARCHON · LA CUSTODE*, *ARCHON · LA CITTÀ* e *ARCHON · LIA*, culminando nella scena di consenso finale (`finalConsentScene`).
3. **I 19 civili sono il centro morale della storia:**
   - Nella tappa `contagion` (`game/runtime.mjs:901-907`), Lulù rimane isolata davanti alla paratia chiusa dove 19 civili attendono soccorso mentre Nox è sotto fuoco nemico. Per aprire la porta, il giocatore deve tenere premuto fisicamente il pulsante di trasmissione (`holdButton`), esponendo la firma biometrica `EVE-47` a Elyon. Non è una cutscene passiva: il giocatore compie il gesto che salva i 19 civili e innesca la caccia dell'Atto III.
4. **Kairn e Morrow non sono giocabili nella Parte I:**
   - Compaiono come alleati controllati dall'IA durante la difesa del cantiere (`exp_yard`) e come gancio narrativo post-crediti per il seguito *Chrono Shadows* (`D24`, `D34`).

---

## 2. ARCO DI TRASFORMAZIONE DI NOX E LULÙ

### 2.1 L'Apertura in Prima Persona e il Frammento di Vetro (`opening`)
- **Dalla sigla al nome scelto (`game/runtime.mjs:751-759`):** Il gioco si apre nel buio della cassa con il registro diegetico dei due battiti (`REGISTRO BATTITI · ● ● · ACCESSO RICONOSCIUTO`). Quando Lulù solleva il coperchio e legge la matricola `EVE-47 · NOX SERIES`, Nox compie il suo primo atto di autodeterminazione: *«Una sigla su una cassa non decide chi sei... Allora lo scelgo io. Mi chiamo Nox.»*
- **La Collezione delle Cose Inutili (`NOX_KEEPSAKES_V86` in `game/runtime.mjs:283-288`):** Nox raccoglie per terra un frammento di vetro levigato che non apre porte e non dà bonus statistici (*«Non mi serve a niente. È la prima cosa che ho scelto da sola.»*). Nel Bagaglio questa filosofia si espande in quattro ricordi conservati per pura scelta personale (Frammento di vetro, Biglia iridescente, Rondella dipinta di Dario, Ciondolo di latta), ciascuno con il proprio suono cristallino (`nox_keepsake_chime.ogg`).

### 2.2 «Otto Mesi Dopo» — Intimità Quotidiana in Movimento (`M7`, `D26`, `D41`)
- La scena `STORY.home` mostra i due protagonisti nella quotidianità conquistata dopo la fuga: il dettaglio della tazza lasciata sul tavolo per Nox (*«Lo so che non ti serve.» «E io so che continuerai a lasciarmela.»*).
- Come stabilito in `D26`/`D41`, nessuna battuta dell'autore è stata tagliata: le 3 battute sulla tensione prima dell'uscita (*«Hai paura.» «Sto solo controllando la rotta.» «La controlli tre volte quando hai paura.»*) accompagnano l'ingresso a piedi a *Moon Refuge* (`STORY.home_walk`), fondendo dialogo ed esplorazione.

### 2.3 La Rottura del Legame («Secondo Colpo Assente») e la Solitudine dell'Atto III
- Nella tappa `zero` (`game/campaign.mjs:266`, `game/runtime.mjs:967`), all'attivazione del secondo nodo del Custode, il legame sincrono si spezza durante il combattimento: premendo `DUO` parte solo il primo impulso e compare l'avviso diegetico `SECONDO COLPO ASSENTE` (*«Il primo colpo parte, ma il secondo di Lulù non risponde: il legame si spezza in mano»*).
- Durante tutto l'Atto III, anche i negozianti dei 14 villaggi reagiscono allo stato `apart` (`INTERIORS[hub][service].ask.apart` in `game/arsenal-data.mjs:165-300`):
  - **Oren (Locanda della Luna):** *«Oggi entri senza nessuno al fianco. La tazza in più la lascio lo stesso.»*
  - **Mara (Bazar dei filtri):** *«Ti vedo passare spesso, sempre senza nessuno. Ti faccio lo sconto dei solitari.»*
  - **Ines (Clinica dell'Anamnesi):** *«Chi rinuncia a se stesso per proteggere un altro lascia un'eco che nessuna macchina cancella.»*

---

## 3. ENVIRONMENTAL STORYTELLING NEI 14 VILLAGGI E INTERNI IN 3ª PERSONA

1. **14 Archi Regionali con Referenti Chiave (`KEY_CHARACTER_ARCS` in `game/arsenal-data.mjs:81-142`):**
   - Ogni villaggio ha un personaggio chiave che contestualizza il conflitto locale prima di sbloccare il carico verso la missione successiva: da *Dario / Oren e Mira* a Moon Refuge fino a *Seraphina · Cantora dell'Ora Uno* ad Axis Crown (*«Centosettantotto anni senza un solo suono libero tra le nuvole»*).
2. **Diorama Architettonico in Terza Persona (`drawChronosInteriorRoom` in `game/village-art.mjs:285-439`):**
   - Quando il giocatore bussa (`● ● · DUE COLPI · ACCESSO STRUTTURA`) ed entra in una locanda, fucina, spezieria o sacrestia, non vede un menu astratto ma una stanza completa in terza persona: Nox e Lulù sono visibili di spalle davanti al bancone, mentre il negoziante respira, batte le ciglia e si anima dietro gli strumenti del proprio mestiere (forgia ardente per il fabbro, alambicchi luminescenti per l'alchimista, astrolabio rotante per la custode delle reliquie).

---

## 4. EPILOGO DINAMICO E RITORNO DI OGNI SCELTA (`game/story-v08.mjs`)

Al termine dello scontro con Archon, la sequenza `STORY.reunion_open` ed `EPILOGUE` ricompone l'intera cronaca del giocatore senza eccezioni:
- **Tre fasce emotive di ricongiungimento (`reunionTier(thermal)`):** Calda, Equilibrata o Tesa in base alla somma delle decisioni civiche e di mutuo soccorso prese lungo i 4 Atti.
- **Riflesso di ogni bivio:** Officina o Rifugio di Moon Refuge, la rotta tracciata col gesso al porto, il destino dell'Unità 9, la scelta su EVE-Prime nell'Archivio, la tenuta della Linea con Ines, la Promessa sul tetto e le medaglie conquistate contro Veyra ad Ash Docks.
