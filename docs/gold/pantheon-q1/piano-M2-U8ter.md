Copia dallo scratchpad della sessione del 3–4 novembre 2026; i percorsi /tmp non esistono più su un'altra macchina.

# ADDENDUM U8-ter (terzo e ultimo tentativo di U8) — Behemoth a8ac71eb3bf5ec588
(salvato dall'orchestratore, testo di Behemoth)

CORSIA: PIENA
FILE: docs/gold/DECISIONI.md, docs/gold/STATO.md (solo queste)
TEST NUOVI: 0
GATE: nessuno

Verifiche di Behemoth in sola lettura:
- [FATTO] CLAUDE.md dello zip: identico a dec65e3 (`cmp $SCR/zipchk.xPGV/CLAUDE.md <(git show dec65e3:CLAUDE.md)` nessuna differenza); diverso dal worktree (`differenza: byte 6309, riga 98`).
- [FATTO] ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md dello zip: identico sia a dec65e3 sia al worktree.
- [FATTO] Chiavetta: lsblk sda1 8G exfat BACKUP_BOT, sda2 49,3G ext4 CHRONOS su /media/omar/CHRONOS; $SCR/USB1.log riga 161 gdbus … CreatePartitionAndFormat, riga 171 udisksctl mount -b /dev/sda2.
- NON POSSO CONFERMARE: le parole «non aspettarti niente da me… Cerco di automatizzare tutto» (riportate dall'orchestratore).

## 1. docs/gold/DECISIONI.md, riga 38: sostituisce l'intera riga D32

```
| D32 | Delega di sviluppo fino al rilascio commerciale, nel rispetto delle istruzioni | Parole dell'autore: «Sviluppa così il gioco e boom, finiscilo fino al rilascio commerciale. Ovviamente segui tutte le istruzioni che ci sono su GitHub, di tutti i prompt e tutto quanto, compresi quelli dello zip file che ti ho mandato.» Altre parole dell'autore: «non aspettarti niente da me… Cerco di automatizzare tutto». **[INFERITO]** Quindi non si aspetta l'autore per partire con una milestone già approvata. **Quali istruzioni:** quelle del repo su GitHub e i prompt dello zip `CHRONOS_istruzioni_Claude_MX_Linux.zip` che l'autore ha mandato in chat il 2 novembre. **[FATTO]** Lo zip contiene 3 file. `CLAUDE.md` e `ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md` sono identici ai file del repo al commit `dec65e3`, prima di M2 (confronto byte per byte). In M2 è poi cambiata la riga 98 di [`CLAUDE.md`](../../CLAUDE.md) (D33); [`ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md`](ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md) è rimasto identico. `PROMPT_CLAUDE_MX_LINUX.txt` è il prompt di avvio della chat e non è nel repo. **Vale:** si procede milestone per milestone. **Non cambia:** CLAUDE.md e D01–D31; lo stop a fine milestone; `COMMERCIAL_RELEASE = BLOCKED`; niente store né Play Console senza un'autorizzazione esplicita (regola 2); la scelta di M4 e i punti «Da decidere» restano all'autore; il gate del Chrono Shift lo chiude l'autore. **[INFERITO]** È un'interpretazione: la formulazione va confermata dall'autore allo stop. |
```

## 2. docs/gold/DECISIONI.md, riga 40: sostituisce l'intera riga D34
Cambia solo la parentesi della fonte nel [FATTO] sulla chiavetta.

```
| D34 | Decisioni dell'autore del 3 novembre: outro con gli stranieri, lampo con movimento ridotto, menù principale, test completi, chiavetta USB | Parole dell'autore: «Non voglio nel intro ma nel outro per un proseguimento in futuro di un Chronos Adventure 2 / Prosegui a farmi il gioco di successo». **Vale:** l'intro JaguarzCreatorz resta invariata; Kairn e Morrow vanno nell'outro, come aggancio a un seguito. Resta aperta la revisione dei diritti per la somiglianza con personaggi noti ([STRANIERI.md](STRANIERI.md), «Rischio da decidere prima della release»). **[INFERITO] Scelta operativa, non dell'autore:** l'outro si pianifica dopo M2. Parole dell'autore: «Ok fai così e rendi menù principale con impostazioni opzioni ecc.. tutto proffessionale». **Vale:** con «movimento ridotto» il lampo bianco di G1 non si disegna e il fermo della posa resta (fatto in M2); si fa un menù principale professionale, con impostazioni e opzioni. **[INFERITO] Scelta operativa, non dell'autore:** le voci del menù (impostazioni, audio, controlli, accessibilità, crediti) e la sua collocazione in una milestone dell'interfaccia dopo M2. Parole dell'autore: «Non ridurre i test per niente, se hai problemi di spazio, memoria, libera memoria in qualche modo con attenzione. E ricordati che hai a disposizione un USB.» **Vale:** nessun controllo QA si salta o si riduce per lo spazio; per lo spazio si può usare la chiavetta USB. **Regola operativa, non dell'autore:** i controlli nel browser girano con i file temporanei di Chromium in `/dev/shm` (`TMPDIR`, `XDG_CACHE_HOME`, `XDG_CONFIG_HOME`). Parole dell'autore, alla proposta di creare da qui una partizione sulla chiavetta: «… perché ti do carta bianca». **Vale:** si crea una partizione nello spazio libero della chiavetta. **[FATTO] Stato della chiavetta** (`lsblk`, 3 novembre 2026; creazione e montaggio dal registro della sessione, fuori dal repo: `CreatePartitionAndFormat` di UDisks2 via `gdbus` e `udisksctl mount -b /dev/sda2`): `sda` da 57,3 GiB; `sda1`, 8 GiB exFAT con etichetta `BACKUP_BOT`, invariata; `sda2`, 49,3 GiB ext4 con etichetta `CHRONOS`, creata il 3 novembre con udisks dopo `sda1` e montata in `/media/omar/CHRONOS`. **Regola operativa, non dell'autore:** `BACKUP_BOT` non si modifica; niente `sudo`. **Non cambia:** CLAUDE.md e D01–D33, `COMMERCIAL_RELEASE = BLOCKED`, regola 2. |
```

## 3. docs/gold/STATO.md, riga 3: sostituisce l'intera riga

```
- **D32.** L'autore delega lo sviluppo fino al rilascio commerciale, nel rispetto delle istruzioni del repo su GitHub e dei prompt dello zip che ha mandato. Due dei tre file dello zip erano identici a quelli del repo prima di M2; in M2 è cambiata solo la riga 98 di CLAUDE.md (D33). Il terzo file è il prompt di avvio. È un'interpretazione da confermare.
```

Nessun'altra riga cambia.

## 4. VALIDATION REQUIRED (da /home/locoomo/Adventure-city-commercial)

1. `VERIFICA_LOG=$SCR/U8ter_npm_test.log bash ~/.claude/skills/pantheon-chronos/verifica.sh /home/locoomo/Adventure-city-commercial dec65e3 278 | tee $SCR/U8ter_verifica.log`
   Atteso: `# tests 279`; not ok solo «race props round trip: masks filled pass, a short container footprint fails» e «GPT chroma key keeps green-tinted paint and removes the off-green GPT background»; controllo 4 senza identificativi di modello; controllo 7 «Sessioni umane» invariato.
2. Confronti zip (`Z=$SCR/zipchk.xPGV`):
   - `cmp $Z/CLAUDE.md <(git show dec65e3:CLAUDE.md)`: nessun output, exit 0.
   - `cmp $Z/CLAUDE.md CLAUDE.md`: esattamente `differenza: byte 6309, riga 98`.
   - `cmp $Z/ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md docs/gold/ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md`: nessun output.
3. grep:
   - `grep -c '^| D3[2-4] |' docs/gold/DECISIONI.md` = 3
   - `grep -n 'identici ai file del repo al commit `dec65e3`, prima di M2' docs/gold/DECISIONI.md` → 1 riga, la 38
   - `grep -n 'non va aspettato' docs/gold/DECISIONI.md docs/gold/STATO.md` → nulla
   - `grep -n 'non aspettarti niente da me… Cerco di automatizzare tutto' docs/gold/DECISIONI.md` → 1 riga, la 38
   - `grep -n 'CreatePartitionAndFormat' docs/gold/DECISIONI.md` → 1 riga, la 40
   - `grep -n 'erano identici a quelli del repo prima di M2' docs/gold/STATO.md` → 1 riga, la 3
   - `grep -n 'sono identici a \[`CLAUDE.md`\]' docs/gold/DECISIONI.md` → nulla
4. Diff: rispetto a U8-bis cambiano solo docs/gold/DECISIONI.md e docs/gold/STATO.md; app.js resta 515 440 byte.

Punti aperti per l'autore allo stop di fine M2: lettura di «MSI», portata di «M7 approvo», conferma della formulazione di D32.
