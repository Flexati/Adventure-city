Copia dallo scratchpad della sessione del 3–4 novembre 2026; i percorsi /tmp non esistono più su un'altra macchina.

# U8-bis — Correzione dei testi di DECISIONI.md e STATO.md (Behemoth a8ac71eb3bf5ec588, con 2 correzioni di fatto dell'orchestratore marcate [ORCH])
CORSIA: PIENA
FILE: solo docs/gold/DECISIONI.md (righe D32, D33, D34) e docs/gold/STATO.md (prima sezione)
TEST NUOVI: 0

[ORCH] Fatti nuovi, verificati dopo il testo di Behemoth:
- Lo zip di D32 è CHRONOS_istruzioni_Claude_MX_Linux.zip, mandato dall'autore in chat il 2 novembre: 3 file. CLAUDE.md è identico a CLAUDE.md di HEAD; ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md è identico a docs/gold/ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md di HEAD (confronto byte per byte); PROMPT_CLAUDE_MX_LINUX.txt è il prompt di avvio della chat, non è nel repo. → Il [NON VERIFICABILE] di Behemoth su D32 e il punto aperto «lo zip citato in D32» cadono.
- Dopo il testo di Behemoth, l'autore ha detto (verbatim, rispondendo alla proposta di creare la partizione): «Credo di poterla creare da qui senza password. Non lo faccio finché non mi dai l'ok, perché ti do carta bianca». La prima frase cita la proposta; la decisione dell'autore è «ti do carta bianca». Su questa base il 3 novembre è stata creata sulla chiavetta la partizione sda2, ext4, etichetta CHRONOS, 49,29 GiB, dopo sda1 (BACKUP_BOT invariata), montata su /media/omar/CHRONOS. → Lo «stato della chiavetta» e il punto aperto «uso della chiavetta» di Behemoth vanno aggiornati.

## 1. DECISIONI.md, D32 — testo da usare
| D32 | Delega di sviluppo fino al rilascio commerciale, nel rispetto delle istruzioni | Parole dell'autore: «Sviluppa così il gioco e boom, finiscilo fino al rilascio commerciale. Ovviamente segui tutte le istruzioni che ci sono su GitHub, di tutti i prompt e tutto quanto, compresi quelli dello zip file che ti ho mandato.» L'autore non è al computer e non va aspettato. **Quali istruzioni:** quelle del repo su GitHub e i prompt dello zip `CHRONOS_istruzioni_Claude_MX_Linux.zip` che l'autore ha mandato in chat il 2 novembre. **[FATTO]** Lo zip contiene 3 file: `CLAUDE.md` e `ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md` sono identici a [`CLAUDE.md`](../../CLAUDE.md) e a [`ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md`](ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md) del repo (confronto byte per byte); `PROMPT_CLAUDE_MX_LINUX.txt` è il prompt di avvio della chat e non è nel repo. **Vale:** si procede milestone per milestone. **Non cambia:** CLAUDE.md e D01–D31; lo stop a fine milestone; `COMMERCIAL_RELEASE = BLOCKED`; niente store né Play Console senza un'autorizzazione esplicita (regola 2); la scelta di M4 e i punti «Da decidere» restano all'autore; il gate del Chrono Shift lo chiude l'autore. **[INFERITO]** È un'interpretazione: la formulazione va confermata dall'autore allo stop. |
(Salamandra: verifica che il link relativo a ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md da docs/gold/ sia giusto e che il test «every repo path named…» resti verde.)

## 2. DECISIONI.md, D33 — una sola modifica
- Oggi: `dà il rallentamento di oggi (40 % per 0,16 s).`
- Dopo: `dà il rallentamento di oggi: per 0,16 s tutto il gioco, Nox compreso, va al 40 % della velocità.`
Il resto di D33 identico.

## 3. DECISIONI.md, D34 — testo da usare
| D34 | Decisioni dell'autore del 3 novembre: outro con gli stranieri, lampo con movimento ridotto, menù principale, test completi, chiavetta USB | Parole dell'autore: «Non voglio nel intro ma nel outro per un proseguimento in futuro di un Chronos Adventure 2 / Prosegui a farmi il gioco di successo». **Vale:** l'intro JaguarzCreatorz resta invariata; Kairn e Morrow vanno nell'outro, come aggancio a un seguito. Resta aperta la revisione dei diritti per la somiglianza con personaggi noti ([STRANIERI.md](STRANIERI.md), «Rischio da decidere prima della release»). **[INFERITO] Scelta operativa, non dell'autore:** l'outro si pianifica dopo M2. Parole dell'autore: «Ok fai così e rendi menù principale con impostazioni opzioni ecc.. tutto proffessionale». **Vale:** con «movimento ridotto» il lampo bianco di G1 non si disegna e il fermo della posa resta (fatto in M2); si fa un menù principale professionale, con impostazioni e opzioni. **[INFERITO] Scelta operativa, non dell'autore:** le voci del menù (impostazioni, audio, controlli, accessibilità, crediti) e la sua collocazione in una milestone dell'interfaccia dopo M2. Parole dell'autore: «Non ridurre i test per niente, se hai problemi di spazio, memoria, libera memoria in qualche modo con attenzione. E ricordati che hai a disposizione un USB.» **Vale:** nessun controllo QA si salta o si riduce per lo spazio; per lo spazio si può usare la chiavetta USB. **Regola operativa, non dell'autore:** i controlli nel browser girano con i file temporanei di Chromium in `/dev/shm` (`TMPDIR`, `XDG_CACHE_HOME`, `XDG_CONFIG_HOME`). Parole dell'autore, alla proposta di creare da qui una partizione sulla chiavetta: «… perché ti do carta bianca». **Vale:** si crea una partizione nello spazio libero della chiavetta. **[FATTO] Stato della chiavetta** (`lsblk`, 3 novembre 2026): `sda` da 57,3 GiB; `sda1`, 8 GiB exFAT con etichetta `BACKUP_BOT`, invariata; `sda2`, 49,29 GiB ext4 con etichetta `CHRONOS`, creata il 3 novembre con udisks dopo `sda1` e montata in `/media/omar/CHRONOS`. **Regola operativa, non dell'autore:** `BACKUP_BOT` non si modifica; niente `sudo`. **Non cambia:** CLAUDE.md e D01–D33, `COMMERCIAL_RELEASE = BLOCKED`, regola 2. |

## 4. STATO.md, prima sezione
- Riga D32: «- **D32.** L'autore delega lo sviluppo fino al rilascio commerciale, nel rispetto delle istruzioni del repo su GitHub e dei prompt dello zip che ha mandato (due dei tre file sono identici a quelli del repo, il terzo è il prompt di avvio). È un'interpretazione da confermare.»
- Riga D34: «- **D34.** Gli stranieri vanno nell'outro; il lampo di G1 si spegne con «movimento ridotto»; l'autore chiede un menù principale professionale; i test non si riducono mai; sulla chiavetta USB c'è ora la partizione `CHRONOS` (49,29 GiB) per lo spazio.»
- In fondo a «Punti aperti per l'autore»: NESSUNA voce sullo zip; nessuna voce «uso della chiavetta». [IPOTESI] eventuale: «la partizione `CHRONOS` si rimonta da sola solo se lo fa la sessione desktop (non c'è una voce in fstab)» — aggiungila come punto aperto.
- Riga «Dopo M2»: «- **Dopo M2, scelta operativa [INFERITO]:** outro con Kairn e Morrow e menù principale (D34), da pianificare. Le note «non ancora implementati» di D27 e D29 sono superate da questa sezione; le righe storiche non si riscrivono.»
- Tutto il resto della prima sezione invariato.

## VALIDATION REQUIRED
1. VERIFICA_LOG=$SCR/U8bis_npm_test.log bash ~/.claude/skills/pantheon-chronos/verifica.sh /home/locoomo/Adventure-city-commercial dec65e3 278 → # tests 279; not ok SOLO «race props round trip: masks filled pass, a short container footprint fails» e «GPT chroma key keeps green-tinted paint and removes the off-green GPT background»; controllo 4 pulito; controllo 7 invariato; nessun 4,99; app.js 515 440.
2. grep -c '^| D3[2-4] |' docs/gold/DECISIONI.md → 3.
3. grep -n 'compresi quelli dello zip file che ti ho mandato.»' docs/gold/DECISIONI.md → 1 riga (D32).
4. grep -n 'Prosegui a farmi il gioco di successo' docs/gold/DECISIONI.md → 1 riga (D34).
5. grep -n '40 % della velocità' docs/gold/DECISIONI.md → 1 riga (D33).
6. grep -n 'ti do carta bianca' docs/gold/DECISIONI.md → 1 riga (D34).
7. Rispetto allo stato dopo U8 ($SCR/U8.diff e sha), cambiati solo DECISIONI.md e STATO.md; DECISIONI.md rispetto a dec65e3 ancora solo righe aggiunte.
8. Nessun nome di ruolo della pipeline né identificativo di modello nelle righe aggiunte.

## [ORCH] Correzione 2 (prima dell'audit, stesso tentativo)
- Salamandra ha verificato: sda2 = 52932116480 B = 49,296875 GiB; «49,29» è un troncamento. `lsblk` mostra 49,3G.
- In docs/gold/DECISIONI.md riga D34 e in docs/gold/STATO.md riga D34: «49,29 GiB» → «49,3 GiB». Nient'altro.
- VALIDATION aggiuntiva: `grep -c "49,29" docs/gold/DECISIONI.md docs/gold/STATO.md` → 0 e 0; `grep -c "49,3 GiB"` → 1 e 1; verifica.sh di nuovo con 279 test, not ok solo i 2 numpy.
