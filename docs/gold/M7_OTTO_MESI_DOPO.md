# M7 — Revisione Riga per Riga di «Otto Mesi Dopo» (`D26`, `D33`, `D41`)

**Stato:** Integrato e verificato (`[FATTO]`).  
**Riferimenti:** `D26` (*«Otto mesi dopo»: alcune battute si spostano nel cammino, nessuna viene cancellata*), `D33` (*«M7 approvo»*), `CHRONOS_FASE_3_SINTESI.md` §D (*FTUE, i primi 5 minuti: «Otto mesi dopo» resta con 2–3 battute dette mentre si cammina; le altre passano al Moon Refuge. Nessuna riga di testo viene cancellata: al massimo si sposta*), `D41`.

---

## Mappa Riga per Riga (`game/story-v08.mjs` + `game/runtime.mjs`)

| # | Personaggio | Testo Originale (IT) | Traduzione (EN — `game/locale.mjs`) | Collocazione Prima | Collocazione Dopo (`D41`) | Stato |
|---|---|---|---|---|---|---|
| 1 | `SISTEMA` | `OTTO MESI DOPO · VANTA · NOTTE` | `EIGHT MONTHS LATER · VANTA · NIGHT` | `STORY.home` (statico) | `STORY.home` (mentre Nox e Lulù camminano con `moveCast`) | Conservata |
| 2 | `LULÙ` | `La tazza è lì.` | `Your cup is there.` | `STORY.home` (statico) | `STORY.home` (in cammino nella scena `home`) | Conservata |
| 3 | `NOX` | `Non bevo.` | `I don't drink.` | `STORY.home` (statico) | `STORY.home` (in cammino nella scena `home`) | Conservata |
| 4 | `LULÙ` | `Otto mesi che me lo dici. Otto mesi che la lascio.` | `You've told me for eight months. I've left it there for eight months.` | `STORY.home` (statico) | `STORY.home` (in cammino nella scena `home`) | Conservata |
| 5 | `NOX` | `Hai paura.` | `You're afraid.` | `STORY.home` (statico) | `STORY.home_walk` (all'ingresso di `Moon Refuge`, subito dopo `HUBS.moon.intro`) | Spostata (non cancellata) |
| 6 | `LULÙ` | `Sto solo controllando la rotta.` | `I'm just checking the route.` | `STORY.home` (statico) | `STORY.home_walk` (all'ingresso di `Moon Refuge`, subito dopo `HUBS.moon.intro`) | Spostata (non cancellata) |
| 7 | `NOX` | `La controlli tre volte quando hai paura.` | `You check it three times when you are afraid.` | `STORY.home` (statico) | `STORY.home_walk` (all'ingresso di `Moon Refuge`, subito dopo `HUBS.moon.intro`) | Spostata (non cancellata) |
| 8 | `SISTEMA` | `Tutte le finestre si spengono.` | `Every window goes dark.` | `STORY.home` (statico) | `STORY.home` (chiusura scena `home` e lancio immediato di `blackout`) | Conservata |

---

## Effetto sul Ritmo dei Primi 5 Minuti (FTUE)

- **Prima:** dopo la cassa di apertura (`opening`), il giocatore doveva avanzare 8 schermate di dialogo fermo prima di riprendere il controllo in `Blackout`.
- **Dopo (`D41`):**
  1. La scena `home` dura solo 5 battute (3 scambi sulla tazza + didascalia iniziale e spegnimento finestre) mentre Nox e Lulù si muovono visivamente verso il centro della stanza (`moveCast([[0,745],[1,795]])`), portando il giocatore all'azione di `Blackout` con il 37,5 % di click statici in meno.
  2. Le 3 battute sul controllo della rotta (`Hai paura.`, `Sto solo controllando la rotta.`, `La controlli tre volte quando hai paura.`) vengono pronunciate all'arrivo al `Moon Refuge` (`STORY.home_walk`), dove si saldano naturalmente con la tazza lasciata da Lulù nel rifugio e con la preparazione della rotta verso la Breccia (`breach`).
  3. **Zero righe cancellate:** tutte le 8 battute canoniche e le relative traduzioni in `EN_TEXT` restano intatte e verificate da `tests/locale.test.mjs`.
