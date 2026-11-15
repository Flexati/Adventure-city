Copia dallo scratchpad della sessione del 3–4 novembre 2026; i percorsi /tmp non esistono più su un'altra macchina.

# U8 — BRIEF CONSOLIDATO (orchestratore, dalle fonti di Behemoth: piano-M2.md §U8, piano-M2-U6U8.md §U8, piano-M2-U6fix.md, piano-M2-U7fix.md, più le decisioni dell'autore dopo il piano)
CORSIA: PIENA
FILE: docs/gold/DECISIONI.md, docs/gold/STATO.md, docs/gold/PLAYTEST.md, CLAUDE.md (solo riga 98), tests/claude-guide.test.mjs

CHANGE:
1. DECISIONI.md — D32 come da piano-M2.md §U8 (delega fino al rilascio commerciale, [INFERITO] da confermare).
2. DECISIONI.md — D33 come da piano-M2-U6U8.md §U8 punto 2 (citazione testuale «MSI approvo. M1 le proverò poi quando finisci il lavoro. M4 io ho già impostato su Play Console tutto, per il resto fai come preferisci. M7 approvo. Chrono shift fallo a tua intuizione»; Chrono Shift come fatto; [IPOTESI] lettura di «MSI»; M1 rimandata; M4; M7 con [IPOTESI] sulla portata).
3. DECISIONI.md — D34 nuova, stesso formato, titolo «Decisioni dell'autore del 3 novembre: outro con gli stranieri, lampo con movimento ridotto, menù principale, test completi». Citazioni testuali (verbatim):
   - «Non voglio nel intro ma nel outro per un proseguimento in futuro di un Chronos Adventure 2» → l'intro JaguarzCreatorz resta invariata; Kairn e Morrow vanno nell'outro come aggancio a un seguito; resta aperta la revisione dei diritti per la somiglianza a personaggi noti (STRANIERI.md:42, verifica il percorso esatto nel repo); da pianificare dopo M2.
   - «Ok fai così e rendi menù principale con impostazioni opzioni ecc.. tutto proffessionale» → con movimento ridotto il lampo bianco di G1 non si disegna, il fermo della posa resta (fatto in M2, U5-ter); menù principale professionale (impostazioni, audio, controlli, accessibilità, crediti) = milestone UI dopo M2.
   - «Non ridurre i test per niente, se hai problemi di spazio, memoria, libera memoria in qualche modo con attenzione. E ricordati che hai a disposizione un USB.» → nessun controllo QA saltato o ridotto per lo spazio; i QA nel browser girano con i temporanei di Chromium in /dev/shm (TMPDIR, XDG_CACHE_HOME, XDG_CONFIG_HOME); la chiavetta USB non è ancora partizionata e non si tocca senza ok esplicito.
   - Cosa non cambia: CLAUDE.md e D01–D33, COMMERCIAL_RELEASE = BLOCKED, regola 2.
4. CLAUDE.md:98 — come da piano-M2-U6U8.md §U8 punto 4 (togliere `deliveries/`; [IPOTESI] lettura di «MSI»; rischio: se l'autore non conferma si riporta com'era). Solo quella riga.
5. STATO.md — nuova prima sezione «M2 — Input e sensazione dei colpi (3 novembre 2026)» sopra «Prompt per Claude su MX Linux», che cita D32, D33 e D34 (l'ultima decisione è D34). Contenuto, con i numeri PRESI DAI LOG dello scratchpad (pantheon-ledger.md e i log L_*):
   - unità fatte: E1 lockCue, C1, N1 (con svuotamento del buffer alle interruzioni, U3-bis), estensione QA, G1 hit-stop (lampo spento con movimento ridotto), CS Chrono Shift (scelte di D33; bordo ciano solo a missione in corso), correzione della policy del bot di prova (motivo: sparava fermo da 326-383 px con gittata 310; tabella esiti da $SCR/U6bis/esiti.txt in forma breve: blackout con U6 1/3 → 3/3, nessuna missione peggiorata), qa:gamepad deterministico (causa: una lettura del pad per frame contro attese fisse 60-80 ms; correzione: settle() su frame del gioco, nessuna asserzione cambiata; esiti 15/15 + 7/7 indipendenti);
   - test: 249 → 279 (dopo U8), not ok 2 di base su questo PC (numpy con python3 -I) e perché; app.js 513 065 → 515 440 byte (limite 524 288);
   - M1 rimandata a fine lavoro (D33): da provare sul telefono gamepad, joystick, C1, N1, G1, CS, tocco breve su Start in pausa, rilascio di B dopo lo scatto;
   - punti aperti per l'autore: lettura di «MSI»; portata di «M7 approvo»; guardia del Mirror e stordimento del Duo più lunghi durante lo shift; bordo ciano fermo in pausa e nei dialoghi; diritti di Kairn e Morrow;
   - 0 sessioni umane; COMMERCIAL_RELEASE = BLOCKED.
6. PLAYTEST.md — sezione nuova in fondo «M2 — da provare sul telefono e con persone»: latenza di C1, sensazione del buffer, leggibilità del fermo, Chrono Shift, tocco breve su Start in pausa, rilascio di B dopo lo scatto; M1 rimandata a fine lavoro (D33); la stima di durata del 31 ottobre è precedente a N1 e CS. Le righe «Sessioni umane» (5 e 19) NON si toccano.
7. tests/claude-guide.test.mjs — +1 test: «la prima sezione di STATO.md cita l'ultima decisione di DECISIONI.md» (regola di CLAUDE.md:59). Deve leggere dinamicamente l'ultimo Dnn della tabella, non fissare D34; deve fallire se la prima sezione non lo cita (provalo).

VALIDATION REQUIRED:
- VERIFICA_LOG=$SCR/U8_npm_test.log bash ~/.claude/skills/pantheon-chronos/verifica.sh /home/locoomo/Adventure-city-commercial dec65e3 278 → # tests 279; not ok SOLO 2: «race props round trip: masks filled pass, a short container footprint fails» e «GPT chroma key keeps green-tinted paint and removes the off-green GPT background»; «every repo path named in CLAUDE.md and in the §2 prompts exists» PASSA.
- grep -n "deliveries" CLAUDE.md vuoto.
- Controllo 4 di verifica.sh: nessun identificativo di modello. Controllo 7: «contatore delle sessioni umane in PLAYTEST.md invariato». Controllo 8: nessun 4,99 aggiunto.
- Le righe storiche di DECISIONI non si riscrivono (git diff di DECISIONI.md solo righe aggiunte).
- Ogni numero in STATO.md deve avere la fonte in un log dello scratchpad (elencale nel report).
- Byte app.js: 0 (resta 515 440).
