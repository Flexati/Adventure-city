# CHRONOS: Nox & Lulù — World & Character Expansion Bible (Proposta V8.6 + Mapping Asset Grafici e Audio Play Store)

La V8.5 ha un nucleo forte: l’identità scelta contro l’identità imposta. Questa revisione V8.6 mantiene i personaggi e le ambientazioni, ma rafforza continuità narrativa, conseguenze giocabili, priorità produttive e associa a **ogni singolo dettaglio** un asset grafico (`game/art/v86/`, `game/art/sprint01/`, `assets/chrono_shadows/artboards/`) e un asset audio OGG Vorbis normalizzato a `-16 LUFS` (`game/audio/v86/`) pronti per il mercato Google Play Store.

---

## 1. Mandato creativo

Espandere il mondo senza disperdere il cuore del gioco.

CHRONOS racconta due protagoniste che imparano, in modi diversi, che proteggere qualcuno non significa possederne il futuro.
- **Nox** combatte per essere riconosciuta come persona, non come prodotto.
- **Lulù** deve imparare che anche una decisione presa per amore può diventare una violazione.

Ogni nuova area risponde a quattro domande:

| Criterio | Requisito |
|---|---|
| **Rivelazione** | Quale aspetto concreto di Vanta rende comprensibile? |
| **Gameplay** | Quale comportamento nuovo richiede al giocatore? |
| **Conseguenza** | Che cosa cambia dopo il suo intervento? |
| **Relazione** | Come mette alla prova Nox, Lulù o il loro rapporto? |

**Vincolo principale:** Nox e Lulù restano il centro emotivo e giocabile. Archon rimane il culmine della Parte I. Kairn e Morrow aprono domande, non sottraggono risposte alle protagoniste.

---

## 2. Struttura del mondo: una città che dipende da se stessa

Vanta è un organismo interdipendente, non un menu di livelli:
- **Iron Orchard** produce cibo;
- **Toxic Forge** sostiene parte della manutenzione industriale;
- **Ash Docks** muove merci e persone;
- **Cathedral Quarter** custodisce la memoria pubblica;
- **Glass Flood** conserva infrastrutture e archivi compromessi;
- **Moon Refuge** vive delle relazioni fra questi luoghi.

### Regola delle conseguenze
Ogni missione maggiore produce:
1. Un **cambiamento locale immediato** (una via aperta o una macchina fermata);
2. Una **conseguenza nell’hub**, attraverso persone, servizi, oggetti o dialoghi;
3. Un **richiamo successivo**, anche piccolo, che dimostri che il mondo ricorda.

---

## 3. Personaggi: dall’idea all’azione (con Asset Dedicati)

### Nox — «Non devo essere utile per avere valore»
- **Asset Grafico:** `/game/art/v86/collezione_nox_v86.png` (`512×128 px`, 4 icone 128×128: *Frammento di vetro*, *Biglia iridescente*, *Rondella dipinta*, *Ciondolo economico di latta*) + `/game/art/sprint01/nox_sheet_base_v02.png` (`1920×1600 px`, rim light ciano `#9fe9ff` 2 px, contrasto misurato **6.24:1**).
- **Asset Audio:** `/game/audio/v86/nox_keepsake_chime.ogg` (`-16.0 LUFS`).
- **Regola essenziale:** Il frammento di vetro, la biglia, la rondella dipinta e il ciondolo economico di latta formano una collezione nel Bagaglio senza bonus nascosti: il loro valore è non dover giustificare la propria esistenza.

### Lulù — «Chiedere non significa abbandonare»
- **Asset Grafico:** `/game/art/v86/iron_orchard_root_engine_v86.png` (`768×384 px`: Root Engine Stabilizzato vs Distrutto) + `/game/art/sprint01/lulu_sheet_base_v02.png` (`1920×1600 px`, rim light rosa `#ffb3ea` 2 px, sciarpa/risonanza `#ff7fd8`, contrasto misurato **7.16:1**).
- **Asset Audio:** `/game/audio/v86/iron_orchard_pulse.ogg` (`-16.0 LUFS`).
- **Progressione:** Ascoltare una richiesta → accettare un rifiuto → concordare un rischio → rispettare una decisione difficile. A Iron Orchard gli abitanti scelgono il proprio rischio per continuare a nutrire Vanta.

### Elena Voss / Archon, Lia Voss, EVE-Prime
- **Asset Grafico:** `/game/art/v86/elena_lia_eve_v86.png` (`768×256 px`: Frammenti quotidiani di Lia, Stanza intatta di Elena Voss, Pattern Lock leggibile di EVE-Prime).
- **Asset Audio:** `/game/audio/v86/lia_memory_tape.ogg` (`-16.0 LUFS`, nastro vocale di Lia) e `/game/audio/v86/eve_adapt_lock.ogg` (`-16.0 LUFS`, contromisura adattiva di EVE-Prime).
- **Regola di leggibilità:** Quando EVE-Prime si adatta dopo 8 attacchi identici, compare un segnale visivo/sonoro inequivocabile (`PREVEDIBILE` + `eve_adapt_lock.ogg`).

### Mira, Dario, Ines, Unità 9
- **Asset Grafico:** `/game/art/v86/npc_conseguenze_v86.png` (`1024×256 px`: Tavolo condiviso di Mira a Moon Refuge, Saldatura visibile di Dario, Bacheca convogli civili di Ines, Trave incompiuta di Unità 9).
- **Asset Audio:** `/game/audio/v86/unit9_halt_chime.ogg` (`-16.0 LUFS`).

---

## 4. Nuovi distretti di Vanta: identità giocabile (con Asset Dedicati)

- **Asset Grafico Master Distretti:** `/game/art/v86/distretti_v86_mechanics.png` (`1536×256 px`, 6 tavole 256×256).
- **Asset Audio Distretti:** `/game/audio/v86/bell_thirteen_anomaly.ogg` (`-16.0 LUFS`) e `/game/audio/v86/the_ram_convoy_horn.ogg` (`-16.0 LUFS`).

| Distretto | Funzione nel mondo | Identità di gameplay | Boss / Culmine |
|---|---|---|---|
| **Necropoli delle Tredici Campane** | Memoria funeraria e primi esperimenti falliti di conservazione | La 13ª campana altera temporaneamente spazio e nemici con preavviso visivo/sonoro chiaro (`bell_thirteen_anomaly.ogg`) | **Cathedral Bone Tyrant** |
| **Glass Flood** | Archivi e infrastrutture sommerse | Riflessi sull'acqua che anticipano o ritardano gli attacchi | **Shadow Reaper** |
| **Toxic Forge** | Fonderie automatiche sotto il Bazaar | Pericoli ambientali industriali, vapore acido e posizionamento | **Toxic Forge Behemoth** |
| **Iron Orchard** | Serra verticale biomeccanica che nutre Vanta | Difesa selettiva delle strutture vitali senza distruggere le colture | **Root Engine** (Stabilizzato / Distrutto) |
| **Ash Docks** | Porto esterno, contrabbando e corse clandestine | Guida ad alta velocità, scorciatoie rischiose e convoglio corazzato | **Veyra “Ash” Kor** / **The Ram** (4 moduli: Motrice, Torretta, Gancio, Generatore) |
| **Osservatorio del Mezzogiorno Perduto** | Centro di studio delle anomalie dove gli orologi segnano le 12:00 | Stanze che cambiano stato fra passato e possibile futuro | **Il Dodicesimo Osservatore** |

---

## 5. Nuove città esterne (Pianificazione per fasi)

- **Asset Grafico:** `/game/art/v86/citta_esterne_v86.png` (`768×256 px`: Solkara, Noctis Vale, Aurelia Span).
- **Asset Audio:** `/game/audio/v86/distant_cities_motif.ogg` (`-16.0 LUFS`).
- **Fase A (Parte I):** Presenti attraverso merci, racconti, mappe, reliquie e riferimenti di Kairn/Morrow.
- **Fase B (Espansione):** **Solkara** (città-convoglio del deserto senza sistema centrale).
- **Fase C (Chrono Shadows / Parte II):** **Noctis Vale** (*The Lamplight King*) e **Aurelia Span** (città-ponte mobile).

---

## 6. Nemici: regole di leggibilità in combattimento

- **Asset Grafico:** `/game/art/v86/nemici_v86_telegraph.png` (`1024×256 px`: Relay Scavenger, Mech Hound, Chrono Huntress, Toxic Bomber).
- **Asset Audio:** `/game/audio/v86/enemy_telegraph_v86.ogg` (`-16.0 LUFS`).

| Nemico | Segnale chiaro prima dell'azione | Contromossa del giocatore |
|---|---|---|
| **Relay Scavenger** | Linea luminosa verso la risorsa che sta per assorbire | Interromperlo prima della carica o colpirlo durante il furto |
| **Rust Brute** | Solleva un pezzo d'ambiente con ombra a terra ben visibile | Schivare di lato e colpire durante il recupero |
| **Plague Chanter** | Cerchio corale visibile attorno agli infetti potenziati | Eliminare prima il cantore o spezzare il coro con un impulso |
| **Mech Hound** | Onde sonore visibili quando fiuta un rumore | Usare un impulso di risonanza come esca per aggirarlo |
| **Toxic Bomber** | Rigonfiamento e cambio colore prima della nube tossica | Abbatterlo a distanza o spingerlo verso altri nemici |
| **Chrono Huntress** | Mirino proiettato sulla posizione futura stimata | Cambiare direzione all'ultimo istante |
| **Iron Penitent** | Piastre che si staccano cambiando suono e velocità | Alternare attacchi rapidi e colpi pesanti |
| **Valkyrie Striker** | Ombra e linea di caduta prima dell'impatto dall'alto | Schivata tempestiva e contrattacco a terra |

---

## 7. Priorità di produzione

1. **Priorità 1 — Consolidamento Parte I (Completato):** Archon (`Chrono Overlord`), `Shadow Reaper`, `Cathedral Bone Tyrant`, `Toxic Forge Behemoth`, `The Anchor` (`v02`), `Rook`, `Il Custode del Nodo`, `EVE-Prime`, `Vega`.
2. **Priorità 2 — Espansione narrativa ad alto impatto (Completato in V8.6):** Collezione inutile di Nox (`collezione_nox_v86.png`), tracce di Lia (`elena_lia_eve_v86.png` + `lia_memory_tape.ogg`), evoluzione di Mira/Dario/Ines/Unità 9 (`npc_conseguenze_v86.png`), Iron Orchard (`iron_orchard_root_engine_v86.png`).
3. **Priorità 3 — Contenuti ad alta complessità:** *The Ram* (`veicoli_e_convoglio_the_ram_v86.webp`), *Osservatorio del Mezzogiorno Perduto*, città esterne (`citta_esterne_v86.png`).

---

## 8. Regole fisse per Kairn e Morrow

Nella Parte I Kairn e Morrow:
- **Possono:** apparire brevemente, combattere come supporto controllato dall'IA, riconoscere simboli antichi, reagire con timore a ciò che precede Elyon;
- **Non possono:** spiegare per intero la Frattura, spiegare *The Book of Broken Hours*, dichiarare il proprio anno d'origine, diventare giocabili prima del finale o togliere a Nox e Lulù il colpo decisivo contro Archon.

---

## 9. Set Completo 18/18 Artboard (`assets/chrono_shadows/artboards/`)

Con l'aggiunta delle 3 tavole V8.6 (`mappa_mondo_esteso_v86.webp`, `veicoli_e_convoglio_the_ram_v86.webp`, `chrono_shadows_teaser_parte2_v86.webp`), il set in `/assets/chrono_shadows/artboards/` raggiunge esattamente le **18 tavole** dichiarate nella Bibbia, distinte chiaramente nell'Hub tra **Asset integrati a runtime**, **Materiale approvato** e **Concept**.
