Copia dallo scratchpad della sessione del 3–4 novembre 2026; i percorsi /tmp non esistono più su un'altra macchina.

# ADDENDUM M2 — U7-fix (Behemoth a8ac71eb3bf5ec588, dopo FAIL U7 di Leviathan adc160bb71f017fb7)
Salvato dall'orchestratore dal testo di Behemoth. GATE: nessuno.

## Diagnosi
- [FATTO] pollGamepad una volta per frame (game/runtime.mjs:984): se press e release cadono tra due frame il fronte si perde.
- [FATTO] il verificatore assume un frame in 60-80 ms: attese fisse alle righe 35, 46, 57, 60, 61, 64, 65, 68. In pausa gap 67-100 ms; storico 31 FAIL «Start resumes» + 5 FAIL finestre 60 ms.
- [FATTO] ogni frame aggiunge un campione con id:++frameSerial (runtime.mjs:995), anche in pausa; leggibile da window.cityAdventure.performance() (:1008).
- Gioco: nessun difetto da correggere in M2 [INFERITO: Gamepad API a campionamento, tocco umano ≥50-100 ms]. NON POSSO CONFERMARE telefono lento con controller vero → aggiungere a M1: «tocco breve su Start in pausa e ripresa».

## U7-fix — qa:gamepad aspetta che il gioco abbia letto il pad
CORSIA: PIENA
FILE: tools/verify_gamepad_browser.cjs; tests/tooling-syntax.test.mjs
CHANGE:
1. Aiuto `settle(n=2)`: legge l'id dell'ultimo campione di performance() (k), poi page.waitForFunction finché l'ultimo id ≥ k+n; timeout 5000 ms con messaggio esplicito «il gioco non ha fatto n frame». Perché 2: il frame k+1 comincia dopo il cambio del pad e lo legge; k+2 è margine.
2. Dopo ogni padCall('button'|'axes'|'connect'|'disconnect',…) subito `await settle();`, oppure un altro padCall della stessa sequenza (come riga 51). Le attese fisse RESTANO tutte, dopo settle() (250/300 ms movimento, 1200 ms munizioni, 120 ms, ecc.): il tempo tra azione e osservazione può solo crescere.
3. Non si toccano: asserzioni, messaggi, valori attesi (0,1/0,1; 1/0; 20/30/50 %; 0,2), numero di controlli (9), rapporto, argomenti URL/output. Niente retry. Niente attese su stato held (i controlli negativi sarebbero falsamente rassicuranti): si aspettano frame, non stati.
4. qa:controls non si modifica.
TEST NUOVI (+1) in tests/tooling-syntax.test.mjs accanto alla riga 16: «gamepad browser verifier waits for game frames after every pad change, never on a bare timer»:
- esiste settle basato su cityAdventure.performance() e waitForFunction;
- /padCall\('(?:button|axes|connect|disconnect)'[^)]*\);(?!await (?:settle|padCall)\()/ non trova niente;
- il numero di assert del file non scende sotto quello di prima (valore fissato con grep -c).
VALIDATION REQUIRED:
1. VERIFICA_LOG=$SCR/U7fix_npm_test.log bash ~/.claude/skills/pantheon-chronos/verifica.sh /home/locoomo/Adventure-city-commercial dec65e3 277 → # tests 278, not ok solo i 3 di base; nessun file game/ in più.
2. Prefisso: TMPDIR=/dev/shm/chronos-qa/tmp XDG_CACHE_HOME=/dev/shm/chronos-qa/cache XDG_CONFIG_HOME=/dev/shm/chronos-qa/config CHROMIUM=/usr/bin/chromium; server 8090; df -h / prima e dopo.
3. qa:gamepad 10 giri consecutivi PASS (gp-01..gp-10) + 2 con CHROMIUM=/usr/bin/google-chrome (gp-chrome-01/02). Un solo FAIL boccia; niente ripetizioni né «migliore». N=10: con FAIL storico ~60 %, 0,4^10 ≈ 1e-4; 95 % esclude FAIL residuo ≥26 %.
4. qa:controls 3 giri consecutivi PASS (qc-01..03), 11 controlli.
5. Server fermato; svuotata solo /dev/shm/chronos-qa/.
Byte app.js: 0 (resta 515440).

## Conteggi
| U7-fix | 277 | 278 | 3 base |
| U7 | i giri di U7-fix valgono come U7 |
| U8 | 278 | 279 | 2 |
U8 in più: causa (una lettura per frame contro attese fisse), correzione dello strumento senza asserzioni cambiate, esiti giro per giro, per M1 prova tocco breve su Start in pausa.
