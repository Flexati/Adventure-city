# NARRATIVE_SPEC_V10_3.md — Specifica di ingegneria

**Versione:** 10.3
**Stato:** APPROVED dall'autore («Approvo tutto», 2026-10-31), con le correzioni di canone qui sotto (sezione 0) da confermare.
**Blocco:** `COMMERCIAL_RELEASE = BLOCKED`
**Sostituisce:** la proposta `NARRATIVA_V10_3_DUE_ORE.md`, che resta come storico.

La specifica dell'autore è riportata integralmente nelle sezioni 1–10. Ogni durata è una stima (ESTIMATE_NOT_HUMAN).

---

## 0. Note di revisione tecnica (2026-10-31)

### 0.1 Correzioni di canone applicate nel codice (da confermare)

| Punto | Specifica | Implementato | Motivo |
|---|---|---|---|
| 5.1 `echo_below` | Nox: «Hai detto no a EVE. Come hai fatto?» Lulù: «Ho pensato a te.» | Lulù: «Unità 9 mi ha detto che hai detto no a EVE. Come hai fatto?» Nox: «Ho pensato a te.» Solo se `unit9_saved`. | In `below` è **Nox** a rifiutare EVE (`below_pre`). Lulù non era presente: lo sa solo da Unità 9, che è viva solo se Nox le ha dato la cella termica. |
| 5.1 `echo_port` | Lulù: «Ho spento il terminale. Volevo scegliere io.» | «Al porto ho spento il terminale. Volevo che scegliessi tu.» | In `port_end` Lulù dice «deve essere perché ha scelto di farlo»: il gesto restituisce a Nox la scelta (C03). |
| 5.1 `echo_chalk` | Nox: «Hai chiesto aiuto. Non lo facevi prima.» | Nox: «Hai chiesto agli abitanti prima di aprire. Non lo facevi.» Si sente insieme alla battuta del gesso, solo se `exp.chalk.completed`. | Nel canone (`chalk_pre`) gli abitanti fermano Lulù e lei ascolta. |
| 5.1 «3 decisioni binarie» | — | Oggi solo il gesso varia, tramite il flag reale `exp.chalk.completed`. Il terminale del porto si spegne sempre e il rifiuto di EVE avviene sempre. | Trasformare il porto in una scelta («trasmetti») permetterebbe a Lulù di riesporre Nox, e il canone non lo prevede. **Domanda per l'autore:** aggiungere tre scelte vere, con la scelta del porto limitata alle parole e non al gesto? |
| 5.2 | vuota | — | Il dialogo del gesso è stato preso dalla proposta precedente («I due punti sulle botole. Eri tu.» / «Non volevo che mi trovassi. Volevo che trovassi la strada.»). |
| 4.4 / 4.6 ricompense | Componente H-17 a Nox (Reaper), ARC-7 a Lulù (Vega) | da implementare con le tavole GPT | La proposta precedente dava entrambi i componenti a Vega. Vale la specifica. |
| 9 totale | «105–112 base» | Somma delle righe: 42 + 8 + 6 + 10 + 8 + 5 + 10 + 25 + 5 = **119 base**; il massimo è 149. | Il totale della tabella non corrisponde alla somma delle righe. |
| 4.5 posizione | «dopo `chalk` (o equivalente)» | proposta: dopo `port`, prima di `tunnel` | Così la rinuncia al controllo (porto) precede il duello sul ritmo. Da confermare. |

### 0.2 Stato di implementazione

| Parte | Stato |
|---|---|
| 5.1 Echi del ricongiungimento (versione corretta) | FATTO: `STORY.reunion_open` |
| 5.2 Battuta del gesso | FATTO: `reunion_open` |
| 5.3 Registro dell'Archivio | FATTO: `archive_end` |
| 5.4 Righe dei boss Rook / The Anchor / Custode | FATTO: ingresso con `bossWake`, sconfitta nella scena seguente (`blackout_end`, `breach_promise`, `separation`) |
| 5.4 Shadow Reaper / Vega | in attesa delle tappe nuove |
| 5.5 Epilogo di Veyra (4 varianti) | FATTO: `EPILOGUE`, `veyraEpilogue()` legge solo le gare registrate |
| 4.1–4.6 Tappe nuove | DA FARE (`promise` non richiede asset nuovi; le altre aspettano le tavole GPT) |
| 4.7 Allungamento delle missioni | DA FARE (moduli città GPT) |

---

## 1. Obiettivo

Portare la campagna obbligatoria da 38–45 minuti (ESTIMATE_NOT_HUMAN) a circa 120 minuti, con margine fino a 150.

## 2. Vincoli (immutabili)

| ID | Vincolo |
|---|---|
| C01 | Nox maschile, Lulù femminile |
| C02 | I 19 civili salvati da Lulù con la firma EVE-47 restano la causa morale della frattura |
| C03 | Lulù sceglie, non tradisce. Nox non perdona automaticamente |
| C04 | Le 31 tappe esistenti restano con ID stabili. Salvataggi v7 compatibili |
| C05 | Le tappe nuove hanno ID stabili |
| C06 | Hitbox, danni e tempi d'attacco invariati. Più spazio di gioco sì, numeri gonfiati no |

## 3. Struttura in atti

| Atto | Tappe | Min (base) | Min (max) | Domanda tematica |
|---|---|---:|---:|---|
| I — La città al buio | opening → moon + docks_veyra | 25 | 32 | Chi è Nox, perché la città lo riconosce? |
| II — La breccia | breach → separation + promise | 30 | 38 | Fin dove si spinge Lulù per salvare le persone? |
| III — Due strade | chalk → clockwork + glass_flood + glass_reaper + vega_approach + vega | 45 | 58 | Separati, Nox e Lulù diventano migliori o più soli? |
| IV — Ora uno | line → postcredits | 20 | 25 | Cosa vale la libertà se il sistema ricorda tutto per te? |
| **Totale** | | **120** | **153** | |

## 4. Tappe nuove

### 4.1 `docks_veyra` — Il porto esterno
- **Posizione e durata:** Atto I, dopo `moon`, 8–12 min.
- **Tipo:** esplorazione, poi una gara breve obbligatoria.
- **Zone:** vicolo (incontro con Veyra), magazzini (esplorazione e segreto), molo (recupero del pezzo della Vortex ed evento).
- **Gare:** la gara breve finale è obbligatoria; le gare complete restano facoltative (D05).
- **Facoltativo:** aiutare lo scaricatore ferito sblocca una scorciatoia.
- **Gancio:** Veyra ha visto il simbolo dell'orologio spezzato sulle gru.

### 4.2 `promise` — La notte prima del clinico
- **Posizione e durata:** Atto II, dopo `rooftop`, 6–8 min.
- **Tipo:** scena interattiva.
- **Battiti:**
  1. Silenzio (30 s): riparazione della Vortex in cooperazione. Il giocatore guida Nox, Lulù fa brevi commenti tecnici.
  2. Domanda (60 s): «Se domani va male, mi perdoni?»
  3. Promessa (90 s): «Niente trasmissioni. Nemmeno per salvare qualcuno.»
- **Scelte:**
  - «Non succederà.» → `promise_trust = blind`
  - «Perdonarti cosa?» → `evasive`
  - «Dipende da cosa fai.» → `honest`
  - accettare o rifiutare la promessa → `promise_accept`
- **Eco:** al clinico, una riga cambia secondo `promise_trust`; nel ricongiungimento, il tono cambia secondo `promise_accept`.

### 4.3 `glass_flood` — La riva
- **Posizione e durata:** Atto III, ramo di Nox, dopo `port`, 10–14 min.
- **Ambiente:** passerelle instabili, marea che sale e scende, abitanti dei pontili che osservano.
- **Microincarico:** salvare subito la persona bloccata (si perde tempo, si guadagna un'informazione) oppure seguire prima il segnale (più veloce, la persona muore).
- **Segreto:** un magazzino sommerso con un terminale di EVE sblocca una riga in `archive`.
- **Uscita:** EVE dice «Il futuro migliore è dentro.»

### 4.4 `glass_reaper` — La torre
- **Durata:** 8–10 min. **Boss:** Shadow Reaper.
- **Futuri possibili:** EVE mostra 3–4 futuri probabili e uno solo è reale. Il danno arriva al momento vero. Sotto il 33% di salute EVE smette di suggerire.
- **Dialogo finale:** «Stai imparando a non fidarti di me.» / «Sto imparando a fidarmi di me.»
- **Premio:** componente H-17 per Nox.

### 4.5 `vega_approach` — La linea
- **Durata:** 5–7 min.
- **Ambiente:** bersagli colpiti solo al centro, un diario con orari al secondo.
- **Scelta:** salvare il civile intrappolato oppure ignorarlo.
- **Uscita:** Vega si mostra da lontano e sparisce.

### 4.6 `vega` — Il duello
- **Durata:** 10–13 min.
- **Ritmo:** Lulù deve rompere lo schema di Vega, non subirlo.
- **Al 50% di salute:** «Perché non controlli il ritmo? Paura di sbagliare?»
- **Sconfitta:** «Hai perso il controllo e hai vinto. Non capisco, ma rispetto.»
- **Premio:** componente ARC-7 per Lulù, con recupero per i salvataggi già oltre questo punto (D08).

### 4.7 Missioni esistenti più lunghe
- **Sezione d'avvicinamento:** fatta di moduli di quartiere ripetuti e variati, con un incontro, una persona da aiutare con una battuta e un segreto con una ricompensa.
- **Guide:** più lunghe, con un evento a metà.
- **Durata in più:** 25–35 min.

## 5. Sistemi narrativi
- **5.1 Echi del ricongiungimento:** vedi 0.1.
- **5.3 Archivio:** un registro collega i numeri di serie della breccia e la spora alla prima linea di unità di Elyon.
- **5.4 Righe dei boss:**

  | Boss | Ingresso | Sconfitta |
  |---|---|---|
  | Rook | «Il sistema ti ha scelto. Io no.» | «Allora forse il sistema sbaglia.» |
  | The Anchor | «Resta fermo. È più facile per tutti.» | «Mi hai mosso. Non credevo fosse possibile.» |
  | Custode | «Questo posto non è per te.» | «Allora trova chi lo merita.» |
  | Shadow Reaper | «Il futuro è già scritto. Lo leggi o lo subisci.» | «Hai scritto tu. Non l'avevo previsto.» |
  | Vega | «Il mio ritmo. Le mie regole.» | «Hai perso il controllo e hai vinto. Non capisco, ma rispetto.» |

- **5.5 Epilogo di Veyra:** una variante per le sfide completate, una per più vittorie, una per più sconfitte e una neutra.

## 6. Domande lunghe
- **Fiducia:** reunion e rooftop_end.
- **EVE ed Elyon:** archive, glass_reaper, finale.
- **Antagonisti:** righe dei boss, Vega, Archon.
- **Libertà:** aftermath.
- **Chi ha aperto la porta:** il seguito (Book of Broken Hours).

## 7. Asset
- **Dalle tavole GPT, prompt pronti:** Glass Flood, Shadow Reaper, Vega, Veyra, moduli città.
- **Già pronte:** le armi H-17 e ARC-7.

## 10. Note tecniche
- **Tappe nuove:** si aggiungono con ID stabili. I salvataggi v7 restano validi e i recuperi seguono la logica D08.
- **Flag:**
  - `promise_trust` ∈ {blind, evasive, honest};
  - `promise_accept`: vero o falso;
  - gli echi leggono `exp.chalk.completed` e `unit9_saved`.
- **Lingue:** l'italiano è il testo master; ogni riga nuova ha la sua traduzione in `story-en.mjs`, controllata dai test.
