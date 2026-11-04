Copia dallo scratchpad della sessione del 3–4 novembre 2026; i percorsi /tmp non esistono più su un'altra macchina.

# ADDENDUM AL PIANO M2 — U6 e U8 dopo le risposte di Posky (Behemoth a8ac71eb3bf5ec588)

Parole di Posky: «MSI approvo. M1 le proverò poi quando finisci il lavoro. M4 io ho già impostato su Play Console tutto, per il resto fai come preferisci. M7 approvo. Chrono shift fallo a tua intuizione».
Numeri di riga ricontrollati sul worktree di U3 (campaign.mjs +4 righe rispetto al piano). Il resto del piano non cambia.

## U6 — CS: modifiche dopo la chiusura di GATE-CS
[FATTO] «Chrono shift fallo a tua intuizione»: le proposte di Behemoth diventano le regole di U6.

CHANGE (sostituisce l'elenco «cosa rallenta» del piano):
- Fattore di tempo dei nemici: `edt = dt × (shift ? 0,5 : 1)`, calcolato subito dopo i decrementi del tick (292) e PRIMA dei proiettili. Lo usano:
  - i proiettili (315): spostamento e life;
  - le mine di Rook (320): m.age e m.life (l'armamento di 0,9 s durante lo shift dura 1,8 s di gioco);
  - la percezione delle pattuglie (324): salita di e.seen, sua discesa e discesa di s.alert [IPOTESI: il calo di s.alert fa parte della percezione nemica, rallentato per coerenza];
  - tutto il ciclo dei nemici (325 e seguenti), con bossThink, rookThink, anchorThink;
  - lockCue di E1 (104): riceve edt come quarto argomento.
- Non rallenta: l'eroe con i suoi timer, il compagno, gli alleati, le barriere di Lulù, le ondate e il progresso della difesa.
- «Movimento ridotto»: lo shift resta attivo; campaign.mjs non legge le impostazioni; il bordo ciano in drawFoot non dipende da settings.reduced; a runtime.mjs:753 la regola diventa focusTime=.16 solo se `!settings.reduced&&!e.shift`.
- Restano come nel piano: Lulù tiene la Perfect Dodge di oggi; una Perfect Dodge di Nox mentre lo shift è in ricarica tiene il rallentamento di oggi (40 % per 0,16 s); niente desaturazione; 0,6 s = 36 f; ricarica 3,0 s = 180 f; al massimo 20 % del tempo.
- Byte: circa 320 (tetto 700).

TEST NUOVI (+6):
1. La Perfect Dodge di Nox attiva lo shift (0,6, 3,0, shift:true); quella di Lulù no. Contrattacco e Duo restano uguali.
2. Durante lo shift vanno a ×0,5: orologi dei nemici; spostamento e life dei proiettili; mine: age e life avanzano di 0,5 × dt e la mina si arma più tardi; pattuglie (missione c.mode==='stealth'): e.seen sale a metà velocità, e.seen e s.alert scendono a metà. L'eroe si muove di 205 × dt.
3. Lo shift finisce dopo 36 tick da 1/60.
4. Una seconda Perfect Dodge entro 3,0 s non riattiva lo shift; dopo 3,0 s sì.
5. Durante lo shift telegraphLock arriva una sola volta, calcolato con edt; i tempi dello scatto non cambiano.
6. «Movimento ridotto» (sorgente): campaign.mjs non contiene settings né reduced; nel runtime il bordo ciano non è sotto settings.reduced; la soppressione di focusTime dipende da e.shift.

VALIDATION REQUIRED:
- `VERIFICA_LOG=$SCR/U6_npm_test.log bash ~/.claude/skills/pantheon-chronos/verifica.sh /home/locoomo/Adventure-city-commercial dec65e3 267`
- Attesi `# tests 273`; not ok solo i 3 di base.
- Rischio bot a semi fissi con Nox: se campaign-v08 o rook cadono, si cerca la causa senza allentare i test.

## U8 — Documenti (CLAUDE.md:98 e D33)
CORSIA: PIENA
FILE: docs/gold/DECISIONI.md, docs/gold/STATO.md, docs/gold/PLAYTEST.md, CLAUDE.md, tests/claude-guide.test.mjs
(CLAUDE.md:98 sta in U8 perché da sola non aggiunge test; ha comunque il suo controllo, punto 4.)

CHANGE:
1. DECISIONI.md, D32: come nel piano (delega fino al rilascio commerciale, nel rispetto delle istruzioni).
2. DECISIONI.md, D33 subito dopo D32. Titolo «Risposte dell'autore del 3 novembre: Chrono Shift, test della guida, M1, M4, M7». Citazione testuale di Posky (sopra). Decide:
   - Chrono Shift a intuizione di Claude: durante lo shift rallentano a ×0,5 nemici, proiettili, mine di Rook e percezione delle pattuglie; resta attivo con «movimento ridotto» (regola della simulazione, bordo ciano fermo); Lulù tiene la Perfect Dodge di oggi; PD di Nox in ricarica dello shift = rallentamento di oggi (40 % per 0,16 s); niente desaturazione.
   - Test della guida (CLAUDE.md:98): [IPOTESI] «MSI approvo» = «Sì, approvo» alla proposta A (togliere deliveries/ dalla mappa), da confermare con l'autore; altre letture possibili (es. una milestone).
   - M1 rimandata a fine lavoro: finché non si fa, la prova sul telefono di gamepad, joystick, C1, N1, G1 e CS resta da fare.
   - M4: l'autore dice di aver impostato tutto in Play Console; non verificabile da qui, lo chiude solo l'autore. Strada tecnica (Gradle o AAR a mano) lasciata a Claude. Valgono: nessuna chiave nel repo, prove con account di test, nessuna pubblicazione senza autorizzazione esplicita, COMMERCIAL_RELEASE = BLOCKED.
   - M7 approvata. [IPOTESI] sulla portata: la proposta riga per riga non esiste ancora; si presenta prima di toccare game/story-v08.mjs (§4 M7), salvo diversa indicazione.
3. STATO.md prima sezione: come nel piano, con D32 e D33; in più M1 rimandata, CS fatto con le scelte di D33, lettura di «MSI» da confermare.
4. CLAUDE.md:98.
   - Oggi: `| Immagini consegnate (originali, non si toccano) | \`deliveries/\` e i rami \`delivery/*\` |`
   - Dopo: `| Immagini consegnate (originali, non si toccano) | i rami \`delivery/*\` (in questo ramo non c'è una cartella di consegne) |`
   - Perché: deliveries/ non esiste nel ramo (`git ls-tree -d HEAD deliveries` vuoto); delivery/* non è tra le radici del test (tests/claude-guide.test.mjs:15); percorsi controllati da 52 a 51, sopra la soglia 40.
   - Rischio: si appoggia a un'[IPOTESI]; se l'autore non conferma, si riporta la riga com'era.
5. PLAYTEST.md: come nel piano, più «M1 rimandata a fine lavoro (D33)». Righe 5 e 19 («Sessioni umane») non si toccano.

TEST NUOVI (+1): la prima sezione di STATO.md deve citare l'ultima decisione di DECISIONI.md (D33).

VALIDATION REQUIRED:
- `VERIFICA_LOG=$SCR/U8_npm_test.log bash ~/.claude/skills/pantheon-chronos/verifica.sh /home/locoomo/Adventure-city-commercial dec65e3 273`
- Attesi `# tests 274`; not ok solo 2: «race props round trip…» e «GPT chroma key…»; «every repo path named in CLAUDE.md and in the §2 prompts exists» passa.
- `grep -n "deliveries" CLAUDE.md` vuoto.
- Controllo 4 di verifica.sh: nessun identificativo di modello. Controllo 7: «Sessioni umane» invariate.

## Conteggi aggiornati
| Unità | 3° arg verifica.sh | Totale | Fallimenti attesi |
|---|---|---|---|
| U3-bis | 260 | 263 | 3 di base |
| U4 | 263 | 264 | 3 di base |
| U5 G1 | 264 | 267 | 3 di base |
| U6 CS | 267 | 273 | 3 di base |
| U8 | 273 | 274 | 2 |

Budget app.js: circa 2 280 byte stimati contro margine 11 223.
Gate: nessuno aperto per M2. Da confermare con l'autore allo stop: le due [IPOTESI] di D33 (lettura di «MSI», portata di «M7 approvo»).
