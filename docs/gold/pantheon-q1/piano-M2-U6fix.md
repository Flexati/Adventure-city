Copia dallo scratchpad della sessione del 3–4 novembre 2026; i percorsi /tmp non esistono più su un'altra macchina.

# ADDENDUM M2 — U6-bis (Behemoth a8ac71eb3bf5ec588)
Decisione: opzione (b), correggere la policy del bot. Test e regola dello shift invariati.
GATE: solo se con la policy corretta il blackout con U6 resta <2/3 → stop, niente soglia né shift, si porta all'autore.
[FATTO] campaign-v08.test.mjs:55 wins>=2; autoplay.mjs:25 near = visibile entro 380 px → spara fermo; weapons-v9.mjs:3 C-9 range 310 = GUN_RANGE.

## U6-bis — Il bot di prova si avvicina se il bersaglio è oltre la gittata dell'arma
CORSIA: PIENA
FILE: tests/helpers/autoplay.mjs; tests/campaign-v08.test.mjs (test nuovo) oppure file nuovo tests/autoplay-policy.test.mjs
CHANGE:
- Nel ramo `if(near.length)` della policy: gittata dell'arma attiva = WEAPONS_V9[s.arsenal.active].range se c'è un arsenale, altrimenti GUN_RANGE (310; import GUN_RANGE da campaign.mjs, WEAPONS_V9 da weapons-v9.mjs).
- Se il nemico più vicino è oltre la gittata: muoversi verso di lui con l'aiuto `toward` esistente, tenendo gun e magic premuti.
- Invariati: soglia 380, ritirata <140, schivata, nodi, Anchor, difesa, furtiva, seme. Nessun file in game/.
TEST NUOVI (+1): nemico visibile a 350 px con C-9 → movimento verso di lui (dot > 0,9) e gun:true; a 250 px comportamento di oggi (nessun avanzamento forzato; <140 ritirata).
VALIDATION REQUIRED:
1. VERIFICA_LOG=$SCR/U6bis_npm_test.log bash ~/.claude/skills/pantheon-chronos/verifica.sh /home/locoomo/Adventure-city-commercial dec65e3 275 → # tests 276; not ok solo i 3 di base; «every foot mission is winnable…» passa con soglia invariata.
2. Con gli script $SCR/U6/scripts/: tabella vittorie per missione, semi 1-3, 4 combinazioni (policy oggi + base pre-U6 $SCR/U6/before/; policy oggi + U6; policy corretta + base; policy corretta + U6) in $SCR/U6bis/esiti.txt. Riportare OGNI cambio di esito (missione, seme), anche in meglio. Atteso: blackout con U6 ≥2/3, nessuna missione peggiora.
3. git diff --stat: in questa unità nessun file game/ cambiato rispetto a U6.
Byte app.js: 0.

## Deviazioni di Salamandra in U6: accettabili
1. shift decrementato subito dopo edt fuori lista → 36 f (P2:181, D29); serve un commento su riga propria nel codice.
2. Ricarica 180 o 181 tick → test accettano 180 o 181.
U6 diventa PASS solo insieme a U6-bis.

## Conteggi
| U6 | 269 | 275 | 3 base + winnable (chiude U6-bis) |
| U6-bis | 275 | 276 | 3 base |
| U7 | — | qa:controls 11/11, qa:gamepad 9/9 |
| U8 | 276 | 277 | 2 |
app.js 515418 dopo U6. STATO.md (U8): correzione del bot, motivo, tabella esiti.
