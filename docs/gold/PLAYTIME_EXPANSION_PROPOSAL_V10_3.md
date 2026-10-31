# Proposta di espansione della durata V10.3 — da decidere con l'autore

`COMMERCIAL_RELEASE = BLOCKED`. Ogni cifra è una **stima** (ESTIMATE_NOT_HUMAN); nessuna è una misura su persone.

## Dove siamo (ESTIMATED)

Fonte: `docs/evidence/v10.2/playtime/PLAYTIME_ESTIMATE.md`.

| Rotta | Campagna obbligatoria |
|---|---|
| A | 30–58 min, probabile **42** |
| B | 32–63 min, probabile **45** |
| C | 27–53 min, probabile **38** |

**Contenuti facoltativi:** circa 13 min probabili (incarichi e segreti 4, gare e sfide Vortex 9).

**Mancano circa 60 minuti** per arrivare ai 105 obbligatori.

**Causa principale:** le missioni durano poco (1–4 min ciascuna).
- 12 missioni a piedi con 3 nodi e 3–6 ondate;
- 6 guide da circa 1 minuto;
- 9 scene brevi.

Non manca la storia: ogni tappa ha già domanda, posta e conseguenza (`NARRATIVE_HOOK_MATRIX_V10_3.md`). Manca lo spazio di gioco intorno.

## Candidati, in ordine di costo e resa

| # | Candidato | Minuti obbligatori in più | Ore di sviluppo | Asset e loro stato | Meccaniche nuove | Impatto narrativo | Rischi | Salvataggi |
|---|---|---|---|---|---|---|---|---|
| E1 | **Collegamenti narrativi** P1–P4 della matrice: fiducia nella separazione, gesso nominato da Nox, movente dei boss, «prima e dopo» negli hub | +3–6 | 8–14 | nessuno nuovo (testo); per il «dopo» negli hub servono props, i prompt sono pronti | nessuna | **alto**: chiude 3 misteri deboli e dà peso al ricongiungimento | bassi | solo flag nuovi; formato v7 invariato |
| E2 | **Mappe e missioni più lunghe con moduli ripetuti** (indicazione dell'autore, vedi sotto) | +18–30 | 24–40 | strade di Ash Docks e oggetti di gara già pronti; quartieri: i 36 prompt città sono pronti, le immagini GPT sono attese in giornata | una «seconda sezione» per missione: percorso, poi obiettivi | medio: più luogo e più incontri, la storia resta quella | **medio**: cambia la struttura delle missioni, non hitbox né danni; richiede l'autorizzazione | indici delle tappe invariati; checkpoint per sezione da aggiungere con test di migrazione |
| E3 | **Vega e sblocco canonico di H-17/ARC-7** (D08): missione con boss che completa il componente, recupero compatibile come per Rook | +6–10 | 16–24 | sheet H-17/ARC-7 pronti (batch 2); tavole di Vega: prompt pronti, immagini attese | due armi nuove nella campagna | **alto**: progressione e ruolo tattico nuovo | medio: bilanciamento armi | nuova tappa con ID stabile; recupero come Rook (D09) |
| E4 | **Incarichi d'hub nuovi** (2 per hub), ciascuno con prima e dopo visibile e una piccola decisione | 0 obbligatori, +6–12 facoltativi | 12–20 | props e NPC: prompt pronti | nessuna | medio: mondo reattivo | bassi | campi `quests` già previsti |
| E5 | **Eventi di Veyra** legati alla storia (la rivalità cambia con i risultati osservati), restando facoltativi per D05 | 0 obbligatori, +5–10 facoltativi | 10–16 | auto dei rivali pronte; regioni Solkara e Aurelia già nel codice | gare nelle altre regioni | medio | bassi | `races` già salvato nel mondo |
| E6 | **Una regione futura giocabile** (per esempio Glass Flood: 2–3 missioni, hub e boss) | +15–25 | 60–100 | tutto da GPT: 4 città, NPC, nemici, boss; prompt pronti | dipende dalla regione | alto, ma apre un fronte nuovo | **alto** | tappe nuove con ID stabili |

### E2 nel dettaglio: allungare con moduli ripetuti

Allungare senza riempitivo:
- **Guide:** la distanza cresce ripetendo i tratti di strada già fatti (giunto comune, D14), con varianti di oggetti e luci, ostacoli in posizioni nuove, un evento a metà (un'auto da evitare, un segnale) e un dialogo breve.
- **Missioni a piedi:** prima dei nodi si aggiunge una **sezione d'avvicinamento** costruita con moduli di quartiere ripetuti e variati. Contiene un incontro, una persona da aiutare (gancio breve) e un segreto con una ricompensa vera.
- **Regole:** stesse regole di collisione dei moduli esistenti; hitbox, danni, tempi d'attacco e salvataggi invariati.
- **Quando arrivano le immagini GPT:** i moduli città (giorno e notte con la stessa geometria) diventano i pezzi ripetibili. Ogni ripetizione cambia almeno un elemento (props, NPC, luce), così il giocatore non vede due volte lo stesso tratto.

## Combinazioni

| Combinazione | Campagna obbligatoria stimata (probabile) | Sviluppo |
|---|---|---|
| **C1** = E1 + E2 + E3 | 42 + 27–46 ≈ **69–88 min** | 48–78 h |
| **C2** = C1 + E6 | ≈ **84–113 min** | 108–178 h |
| **C3** = C1 + un incarico obbligatorio in più per hub (scelto dall'autore) | ≈ 75–96 min | 56–90 h |

Con i dati attuali **solo C2 raggiunge i 105 minuti nell'intervallo stimato**. I facoltativi (E4, E5, +11–22 min) non vengono mai contati nell'obiettivo. La conferma dei 105 minuti arriverà solo dal playtest con persone (`PLAYER_MOTIVATION_V10_3.md`).

## Decisioni che servono all'autore (BLOCKED finché non arrivano)

1. Autorizzare E2: cambia la struttura delle missioni, non hitbox o tempi d'attacco.
2. Scegliere una combinazione (C1, C2 o C3) e, se C2, quale regione.
3. Approvare il testo nuovo delle proposte P1–P3 (canone narrativo).
