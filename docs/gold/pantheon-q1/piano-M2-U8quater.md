Copia dallo scratchpad della sessione del 3–4 novembre 2026; i percorsi /tmp non esistono più su un'altra macchina.

# U8-quater (4° tentativo autorizzato da Posky) — Behemoth a8ac71eb3bf5ec588, salvato dall'orchestratore
CORSIA: PIENA. FILE: docs/gold/DECISIONI.md, docs/gold/STATO.md. TEST NUOVI: 0. GATE: nessuno.

Verifiche Behemoth: PROMPT 66 righe, riga 1 AVVIO, riga 57 RIPRESA; righe non vuote = §2.2 (47/47) e §2.3 (8/8) di ISTRUZIONI; zip 3 file; copie zipchk = zip; zip in chat 2026-11-02T22:14:41Z; diff CLAUDE.md solo @@ -98 +98 @@; PROMPT non nel repo (0).

## Sostituzione 1 — docs/gold/DECISIONI.md riga 38
old_str:
`PROMPT_CLAUDE_MX_LINUX.txt` è il prompt di avvio della chat e non è nel repo.
new_str:
`PROMPT_CLAUDE_MX_LINUX.txt` contiene i due prompt della chat, di avvio e di ripresa, con le stesse righe non vuote del §2.2 e del §2.3 di ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md, più due righe di titolo; come file non è nel repo.

## Sostituzione 2 — docs/gold/STATO.md riga 3
old_str:
Il terzo file è il prompt di avvio.
new_str:
Il terzo file contiene i prompt di avvio e di ripresa, con le stesse righe del §2 di ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md.

## VALIDATION REQUIRED (da /home/locoomo/Adventure-city-commercial)
1. VERIFICA_LOG=$SCR/U8quater_npm_test.log bash ~/.claude/skills/pantheon-chronos/verifica.sh /home/locoomo/Adventure-city-commercial dec65e3 278 | tee $SCR/U8quater_verifica.log — atteso # tests 279; not ok solo «race props round trip: masks filled pass, a short container footprint fails» e «GPT chroma key keeps green-tinted paint and removes the off-green GPT background»; controllo 4 nessun identificativo di modello; controllo 7 «Sessioni umane» invariato.
2. grep -n 'contiene i due prompt della chat, di avvio e di ripresa' docs/gold/DECISIONI.md → 1 riga, la 38.
3. grep -n 'Il terzo file contiene i prompt di avvio e di ripresa' docs/gold/STATO.md → 1 riga, la 3.
4. grep -n 'è il prompt di avvio' docs/gold/DECISIONI.md docs/gold/STATO.md → nulla.
5. grep -c '^| D3[2-4] |' docs/gold/DECISIONI.md → 3.
6. Rispetto a U8-ter cambiano solo DECISIONI.md e STATO.md, una riga ciascuno; app.js 515 440 byte.
