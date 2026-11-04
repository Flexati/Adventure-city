# CHRONOS — Handoff e punto di ripresa dopo Q1 (4 novembre 2026)

Questo file serve a una sessione fredda: nessuna memoria della chat, nessuno scratchpad (sta in `/tmp` e sparisce). Si legge dopo [`CLAUDE.md`](../../CLAUDE.md) e prima di toccare qualsiasi cosa. Le regole dell'autore e le decisioni non sono qui: restano in `CLAUDE.md` e [`DECISIONI.md`](DECISIONI.md), che vincono su questo file.

Legenda: **[FATTO]** = verificato con una fonte (file, riga, comando, log); **[IPOTESI]** = non verificato, con il motivo.

---

## A. Punto di ripresa

**Punto di ripresa:** Q1 (D35, priorità 1: stabilità) è chiusa tecnicamente. La prossima mossa è **Q2 = leggibilità e feel del combattimento (priorità 2 e 3 di D35)**, che parte con Behemoth (piano), non con codice. Prima, però, restano le conferme di Posky della sezione D.

| Voce | Valore | Fonte |
| --- | --- | --- |
| Repo | Flexati/Adventure-city (`origin`) | `git remote -v` |
| Ramo | `work/chronos-adventure-commercial` (mai `main`, mai force-push) | `CLAUDE.md`, sezione Git |
| Base | `c4ec6f5` (M2: input e sensazione dei colpi) | `git log` |
| Commit Q1 | `c3d8a84` | commit Q1 (31 file), pushato il 4 novembre 2026 su origin/work/chronos-adventure-commercial |
| Test | `npm test`: 296 test, 294 passano | [`STATO.md`](STATO.md), sezione Q1 |
| I 2 test che falliscono | solo perché `python3 -I` non vede numpy (`tests/tooling-syntax.test.mjs`). `sudo apt install python3-numpy` lo risolve; lo fa solo Posky | [`STATO.md`](STATO.md), sezione M2 |
| `app.js` | 517 094 byte su 524 288 (margine 7 194) | [`STATO.md`](STATO.md), «Test, bundle, prestazioni, campagna» |
| Stato | `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane ([`PLAYTEST.md`](PLAYTEST.md)) | `CLAUDE.md`, [`PLAYTEST.md`](PLAYTEST.md) |

**Comandi per ritrovarsi** (dal repo, sul PC dell'autore `/home/locoomo/Adventure-city-commercial`):

```bash
git status --short            # dopo il commit Q1 deve restare solo save-recovery.json non tracciato
git log --oneline c4ec6f5..HEAD
node --test tests/claude-guide.test.mjs   # 5 test sulla guida: devono passare tutti
```

**Dopo il `git pull`, se HEAD è diverso dal commit Q1 della tabella qui sopra, fermati, dillo a Posky e non andare avanti.**

Il commit Q1 `c3d8a84` è su origin (Flexati/Adventure-city, ramo work/chronos-adventure-commercial): push c4ec6f5..c3d8a84 del 4 novembre 2026, senza force. Un secondo commit solo-documenti (questo file e STATO.md) lo segue: se HEAD è un commit successivo a `c3d8a84` con messaggio che comincia per «RIPRESA:», è normale.

Il checkout su questo PC è sparse (`.git/info/sparse-checkout` contiene `/*` e `!/artifacts/`): la cartella `artifacts/` non si espande da sola.

---

## B. Cosa è stato fatto

I dettagli, i numeri e i nomi dei log sono in [`STATO.md`](STATO.md) (sezioni Q1 e M2). Qui solo i numeri chiave.

**M2 (3 novembre, base `c4ec6f5`)** — input e sensazione dei colpi:
- **C1:** SCHIVA, DUO e ATTIVA partono al tocco (`pointerdown`). **N1:** memoria dei tocchi per SCHIVA, SPARA e PULSE; i pulsanti in ricarica non si disattivano.
- **G1:** hit-stop solo visivo di 2, 4 o 6 frame; con «movimento ridotto» il lampo bianco non si disegna. **E1:** evento `telegraphLock`. **CS:** Chrono Shift (nemici e proiettili a ×0,5 per 0,6 s, al massimo ogni 3,0 s).
- `qa:controls` da 9 a 11 controlli; `qa:gamepad` reso deterministico (15/15 giri PASS dopo la correzione: 10 giri di `qa:gamepad` con Chromium, 2 con Chrome e 3 di `qa:controls`, più 7/7 in una verifica indipendente; prima 31 FAIL su «Start resumes» e 5 nelle finestre da 60 ms).
- Bot di prova corretto (`tests/helpers/autoplay.mjs`): missione blackout da 2/3 a 3/3 vittorie senza CS e da 1/3 a 3/3 con CS; le altre 11 missioni restano 3/3.
- Test da 249 a 279; `app.js` da 513 065 a 515 440 byte.

**Q1 (3–4 novembre)** — D35 registrata e stabilità (priorità 1):
- Un errore in un frame non ferma più il ciclo (`game/stability.mjs`). Al 3° errore in 5 s compare il pannello «Qualcosa si è inceppato.» con «Riprendi dall'ultimo salvataggio».
- Immagine di hub o di missione mancante: pannello in 102,7–425,3 ms (prima: oltre 5 000 ms in attesa, 0 pulsanti).
- Pannello e background: 0 scritture di salvataggio (prima 4) e audio sospeso; «tieni premuto» si annulla con il blur; errore dopo l'avvio non scatena più «Il gioco non è riuscito a partire» nel guscio Android; il manifest non ricrea più l'Activity.
- Test da 279 a 296 (+17); `app.js` da 515 440 a 517 094 byte (+1 654).
- Controlli nel browser PASS nel giro di chiusura: `qa:stability` 2/2, `qa:save`, `qa:runtime`, `qa:hubs`, `qa:controls` (11), `qa:gamepad` (9), `qa:audio`, `verify_startup_retry`, `qa:health` (11 casi) e la campagna A/B/C (31 passi) con orologio virtuale.
- Non sono regressioni di Q1: `qa:v9` (rc=1 per il checkout sparse) e `qa:performance` (si ferma, vedi G).
- Le due modifiche Android (manifest e finestra del tasto Indietro) sono provate solo con test statici e `javac`, non su un telefono.
- Registro dei cicli e piani: [`pantheon-q1/`](pantheon-q1/pantheon-ledger.md). Copie dallo scratchpad: i percorsi `/tmp` citati lì non esistono più su un'altra macchina.

---

## C. Decisioni dell'autore da conoscere

Le parole originali sono in [`DECISIONI.md`](DECISIONI.md) (D32–D35).

- **D32.** Delega di sviluppo fino al rilascio commerciale, nel rispetto delle istruzioni del repo su GitHub e dei prompt dello zip. Si procede milestone per milestone, con lo stop a fine milestone. La formulazione è un'interpretazione da confermare.
- **D33.** Chrono Shift «a tua intuizione» (fatto in M2); M1 rimandata a fine lavoro; M4: l'autore dice di aver impostato tutto in Play Console, la strada tecnica la sceglie Claude; M7 approvata (portata da confermare); «MSI approvo» letto come sì alla modifica di `CLAUDE.md:98`.
- **D34.** Kairn e Morrow vanno nell'outro, non nell'intro (aggancio a un seguito); con «movimento ridotto» il lampo di G1 non si disegna; menù principale professionale con impostazioni e opzioni; i test non si riducono mai (per lo spazio si usa la chiavetta USB); partizione `CHRONOS` da 49,3 GiB sulla chiavetta.
- **D35.** Carta bianca sulla qualità, priorità in ordine: 1 stabilità, 2 leggibilità, 3 feel del combattimento, 4 prestazioni, 5 finitura, 6 contenuto. Claude decide da solo backlog, dettagli di feel, refactoring senza cambi di comportamento, test e diagnostica, scelte equivalenti documentate, tagli di scope. Output con numeri concreti, [FATTO]/[IPOTESI], niente «completo» senza evidenza. «Si parti 1,2,3 in ordine.»

**Vincoli vincolanti** — [`CLAUDE.md`](../../CLAUDE.md), «Regole che non cambiano» (il testo originale sta lì):
1. italiano; 2. niente credenziali o chiavi nel repo né nella chat, niente store e niente Play Console senza autorizzazione esplicita; 3. niente invenzioni, [FATTO] con la fonte e [IPOTESI] con il motivo; 4. hitbox e tempi non cambiano, salvo D27 e D29; 5. Nox maschile, Lulù femminile, corpi e volti V8 non si ridisegnano, gli originali non si modificano; 6. canone (due protagonisti, Archon boss finale, 19 civili, Kairn e Morrow mai giocabili nella Parte I); 7. prezzo unico di 5,99 € (D18); 8. il joystick funziona in ogni punto dello schermo, ogni proposta deve funzionare al tocco, su schermo piccolo e senza audio; 9. niente copie di opere protette, niente testo leggibile negli sprite, minacce riconoscibili anche senza colore; 10. niente identificativi di modello in commit, codice e documenti.

Altre regole di lavoro in `CLAUDE.md`: prima di modificare un file esistente si elenca cosa cambia e perché; mai `main`, mai force-push, mai rami `delivery/*`; commit e push solo con l'ok di Posky: è una regola di sessione di Posky (D32 e le sue risposte), non di `CLAUDE.md`.

---

## D. Cosa deve ancora decidere o confermare Posky

Fonte: [`STATO.md`](STATO.md), sezioni Q1 («Punti aperti») e M2.

1. **«MSI approvo»** (D33): letto come «sì, approvo» alla modifica di `CLAUDE.md:98` (la mappa senza `deliveries/`). Se non è così, la riga torna com'era.
2. **Portata di «M7 approvo»**: la proposta riga per riga non esiste ancora.
3. **Formulazione di D32** (interpretazione da confermare).
4. **Durante lo shift** durano di più la guardia del Mirror e lo stordimento del Duo: va bene?
5. **Il bordo ciano** resta fermo sullo schermo in pausa e nei dialoghi: va bene?
6. **Diritti di Kairn e Morrow** ([`STRANIERI.md`](STRANIERI.md), sezione «Rischio da decidere prima della release»).
7. **Lettura di D35 su hitbox e finestre** (schivata, parata): restano sotto la regola 4 di `CLAUDE.md` e cambiano solo con D27, D29 o un via esplicito. I valori già fissati da una decisione (memoria dei tocchi di 100 ms in D27, durata e ricarica del Chrono Shift in D29) cambiano solo con una nuova riga in `DECISIONI.md`.
8. **Soglia «3 errori in 5 s»** (`limit=3`, `windowMs=5000` in `game/stability.mjs`) e **«niente salvataggio dopo un errore»**.
9. **Watchdog di 25 min** di `tools/verify_campaign_browser.cjs` (riga 5): troppo stretto su questo PC (la strategia A passa solo con `CITY_CAMPAIGN_TIMEOUT_MS=3600000`). Alzare il default dello strumento o usare un'altra macchina?
10. **Trailer «Co-Authored-By»** con un nome di modello nei commit precedenti (70 su 198 fino a `c4ec6f5`) contro la regola 10: come trattarlo. Per i commit nuovi la regola 10 vale come scritta; chi committa deve decidere con Posky cosa mettere nel trailer.
11. **`save-recovery.json`** nella radice del repo: residuo di `qa:save` lanciato senza cartella di uscita. Non tracciato, non va committato; Posky decide se cancellarlo (nessuno l'ha cancellato).
12. **Prove M1 sul telefono**: a fine lavoro (D33). L'elenco è in [`PLAYTEST.md`](PLAYTEST.md), sezioni «M2 — da provare sul telefono e con persone» e «Q1 — stabilità, QA automatica». Servono un telefono Android vero e un controller.
13. **numpy**: `sudo apt install python3-numpy` fa passare i 2 test che oggi falliscono (296/296). Lo fa solo Posky, perché serve `sudo`.

---

## E. Prossimi passi, in ordine

**PRIMO PASSO, concreto:**
1. Riporta a Posky in 3 righe lo stato e chiedi il via per Q2.
2. Senza il suo via non lanciare Behemoth (D32: stop a fine milestone).
3. Controlla con `verifica.sh` (sezione F) che la base sia il commit Q1 e che i test siano 296 (294 pass, 2 numpy).

Backlog di qualità (D35, l'ordine lo decide Claude):
1. **Stabilità: fatta** (Q1).
2. **Leggibilità** senza audio di minacce, telegraph e stato di Nox e Lulù.
3. **Feel del combattimento** (schivata, Chrono Shift).
4. **Prestazioni** (frame rate stabile, memoria; la misura vera è sul telefono, M1).
5. **Finitura**, incluso il **menù principale professionale con impostazioni e opzioni** (D34).
6. **Contenuto**, incluso l'**outro con Kairn e Morrow** (D34).

**Q2 = punti 2 e 3** (leggibilità + feel): si parte con **Behemoth** (piano in un file, una volta per milestone), non con codice. Hitbox e finestre non si toccano senza D27/D29 o un via esplicito (regola 4).

Poi le milestone del mandato. Nomi controllati in [`ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md`](ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md) §4, in [`README.md`](../design/v10.3/README.md) (elenco M1–M7) e in `CLAUDE.md`:

| Milestone | Cosa | Nota |
| --- | --- | --- |
| M5 | Allineare a 5,99 € i 16 file che dicono 4,99 € (D18) | Le prove registrate (`docs/evidence/…/PLAYTIME_ESTIMATE*.json`) non si riscrivono: lì una nota. Il comando per trovarli è in ISTRUZIONI §4. `verifica.sh` segnala ogni «4,99» aggiunto |
| M3 | Demo fino a «La firma» (D20) e «Gioca l'altra rotta» (D22) | I salvataggi esistenti restano compatibili: `tests/save-v5.test.mjs`, `tests/progress-store.test.mjs`, `qa:save` |
| M4 | Acquisto a 5,99 € (Play Billing, senza Gradle: AAR a mano oppure Gradle) | **Chiedere a Posky il billing product ID prima di iniziare.** Nessuna chiave nel repo, prove con account di test, nessuna pubblicazione. La chiusura la fa solo Posky |
| M7 | «Otto mesi dopo» (D26) | **La proposta riga per riga va presentata prima di toccare `game/story-v08.mjs`.** Nessuna battuta si cancella |
| M6 | I 4 boss nuovi (Bone Tyrant, Behemoth, Shadow Reaper, Vega) | **Aspetta le immagini GPT** di Posky (`requests/gpt-boss-v2-20261102/README.md`). Le mosse dei boss vanno progettate e approvate prima dell'integrazione |
| M1 | Prove sul telefono (solo verifica) | A fine lavoro (D33). `tools/build_apk.sh` qui non gira (sezione H) |

Ogni milestone si chiude come in `CLAUDE.md`, «Si lavora a milestone»: `npm test` per intero, controlli nel browser della sua area, commit sul ramo (solo con l'ok di Posky), riepilogo, **stop** per il feedback.

---

## F. Come lavorare (pantheon-chronos)

Ciclo: **Behemoth** (piano, una volta per milestone) → **Salamandra** (una unità atomica alla volta, con diff e log) → **Leviathan nuovo per ogni unità** (rilancia da sé i controlli e fa la revisione avversaria) → **Ziz** (chiusura della milestone, con `COMMERCIAL_RELEASE = BLOCKED` non fa la release readiness dello store).
- **Corsia piena** per ogni modifica a file tracciati (`game/`, `tools/`, `android/`, `tests/`, `docs/gold/`): una unità, un Salamandra, un Leviathan. Corsia leggera solo per operazioni senza modifiche tracciate.
- **Massimo 2 tentativi per unità**, poi si torna a Behemoth o a Posky.
- **Il registro** in `docs/gold/pantheon-q1/pantheon-ledger.md` finisce a Q1-U9. Le righe Q1-H (autorizzazione di Posky, handoff) e le successive stanno solo nell'archivio sulla chiavetta, `scratch-q1` (sezione H), e in questo file.
- **Registro:** ogni sessione tiene un `pantheon-ledger.md` nel proprio scratchpad e ogni agente scrive il log grezzo in `<scratchpad>/<UNITÀ>.log` prima di rispondere. Lo storico di Q1 e M2 è in [`pantheon-q1/pantheon-ledger.md`](pantheon-q1/pantheon-ledger.md), con i piani nella stessa cartella; una sessione nuova parte da un registro nuovo e lo copia in `docs/gold/` a fine lavoro.
- Brief compatti con la costituzione CHRONOS (niente Gradle, ramo, regole 1–10, niente modelli nei testi); gate raggruppati in una sola domanda.
- Nessun agente committa o pusha: lo fa l'orchestratore con l'ok di Posky.

**Controllo automatico `verifica.sh`:**

```bash
VERIFICA_LOG=<log> bash ~/.claude/skills/pantheon-chronos/verifica.sh /home/locoomo/Adventure-city-commercial <base> <test-attesi>
```

`<base>` = commit da cui confrontare (dopo Q1: il commit Q1 della sezione A); `<test-attesi>` = numero di test del giro precedente, che non deve scendere (dopo Q1: 296). Esce con 1 se c'è almeno un `[BLOCCO]`. **Finché numpy non è installato dà sempre `[BLOCCO] npm test non è tutto verde: 294/296`**: è atteso, e le 2 righe `not ok` devono essere solo quelle di `tests/tooling-syntax.test.mjs`.

**La skill sta in `~/.claude/skills/pantheon-chronos/` (`SKILL.md` e `verifica.sh`) e NON è nel repo.** Su un'altra macchina non esiste: va ricopiata dal PC dell'autore, oppure si fanno a mano i controlli che elenca: ramo, file cambiati, keystore/`.env`/`node_modules`/`dist` fuori dal commit, token nelle righe aggiunte, identificativi di modello, `deliveries/` intatto (cartella che in questo ramo non esiste), righe di hitbox e tempi in `game/` (segnalate, non decise), riga «Sessioni umane» di [`PLAYTEST.md`](PLAYTEST.md), «4,99» aggiunto, `npm test` con il conteggio che non scende, peso di `app.js` sotto 524 288 byte, e i `qa:*` da lanciare secondo l'area toccata.

---

## G. Controlli nel browser su questo PC

Da `package.json` e `tools/`: ogni comando qui sotto esiste. **Regola: dare sempre una cartella o un file di uscita fuori dal repo.** Senza argomenti, gli strumenti riscrivono file tracciati (tracciati nel repo: `artifacts/v9-controls`, `docs/evidence/v10.3/gamepad`, `artifacts/v9-health-bar`; quest'ultimo qui non è espanso) o creano file nella radice (`save-recovery.json`, `audio-v09.json`).

```bash
# 1. ambiente: Chromium e file temporanei in RAM (D34); l'interno ha ~123 MB liberi (4 novembre 2026)
export TMPDIR=/dev/shm/chronos-qa/tmp XDG_CACHE_HOME=/dev/shm/chronos-qa/cache XDG_CONFIG_HOME=/dev/shm/chronos-qa/config CHROMIUM=/usr/bin/chromium
mkdir -p "$TMPDIR" "$XDG_CACHE_HOME" "$XDG_CONFIG_HOME" /dev/shm/chronos-qa/out
cd /home/locoomo/Adventure-city-commercial
O=/dev/shm/chronos-qa/out; U=http://127.0.0.1:8090/game/

# 2. server (se la porta 8090 è occupata, cambia porta e URL)
python3 -m http.server 8090 --bind 127.0.0.1 --directory /home/locoomo/Adventure-city-commercial > /dev/shm/chronos-qa/server.log 2>&1 &
SERVER_PID=$!

# 3. i controlli (uno alla volta; ogni uscita va in $O)
node tools/verify_stability.cjs   $U $O/stability.json       # qa:stability, S1–S7 e costo del salvataggio
node tools/verify_save_recovery.cjs $U $O/save.json          # qa:save
node tools/verify_runtime_v09.cjs $U $O/runtime.json         # qa:runtime
node tools/verify_hubs_v8.cjs     $U $O/hubs.json            # qa:hubs
node tools/verify_controls_v9.cjs $U $O/controls             # qa:controls (11 controlli)
node tools/verify_gamepad_browser.cjs $U $O/gamepad          # qa:gamepad (9 controlli)
node tools/verify_audio_v09.cjs   $U $O/audio.json           # qa:audio
node tools/verify_health_bar.cjs  $U $O/health               # qa:health (11 casi)
node tools/verify_startup_retry.cjs http://127.0.0.1:8090/android/build/assets/game/ $O/startup-retry.json   # serve android/build/assets/game (lo crea npm test)

# 4. a fine lavoro: ferma SOLO il server avviato da te e libera la RAM
kill "$SERVER_PID"
rm -rf /dev/shm/chronos-qa
```

Mai `pkill -f`. Dopo ogni giro `git status --short` non deve mostrare file nuovi o cambiati che non siano quelli voluti.

**Campagna A/B/C** (`qa:campaign`, `tools/verify_campaign_browser.cjs`: URL, strategia `a`, `b` o `c`, cartella di uscita). Su questo PC (Celeron N3060):

```bash
CITY_VIRTUAL_TIME=1 CITY_CAMPAIGN_TIMEOUT_MS=3600000 node tools/verify_campaign_browser.cjs $U a $O/campaign-a
```

Misurato il 4 novembre: A 1 932 s, B 1 497 s, C 1 555 s, tutte PASS con 31 passi. Lancia un giro alla volta e in background (ognuno dura 25–32 minuti); lo storico v10.2 su orologio virtuale era 208–218 s.

**Trappole note:**
- **`qa:save` senza cartella di uscita** scrive `save-recovery.json` nella radice (è il file non tracciato che c'è oggi): passa sempre `$O/save.json`.
- **`qa:v9` fallisce nel repo** (rc=1, 9 «missing artifact») per il checkout sparse che esclude `artifacts/`. Su un albero esportato da `c4ec6f5` con artifacts, docs/production e tools dà `ok: true`, rc=0. Non è una regressione.
- **`qa:performance` si ferma** con «insufficient live frames» (`tools/verify_performance_v09.cjs`, riga 35), in un punto che cambia da un giro all'altro, con `cpu4`: **non certifica** il frame rate. Sul telefono si misura in M1. Dura circa 14 minuti prima di fermarsi.
- **Watchdog di 25 min** della campagna: senza `CITY_CAMPAIGN_TIMEOUT_MS=3600000` la strategia A fallisce qui con «Bounded campaign timeout at archive» a 20 passi su 31.
- **File temporanei di Chromium**: regola operativa di D34, vanno in `/dev/shm` (prefisso `TMPDIR`/`XDG_*` qui sopra), perché l'interno ha ~123 MB liberi (4 novembre 2026). Un controllo QA non si salta e non si riduce per lo spazio.

---

## H. Ambiente di questo PC (MX Linux, utente `omar`)

- **Disco interno:** 123 MB liberi su 27 210 MB (`df -m /`, 4 novembre 2026, ore 07:51), 100% usato. Scrivere solo file piccoli. **Niente `npm ci`**, niente APK: `node_modules/` c'è già e basta.
- **`tools/build_apk.sh` qui non gira:** vuole `$ANDROID_SDK_ROOT/platforms/android-35/android.jar` (riga 7) e nell'SDK `/home/locoomo/Android/Sdk` c'è solo `platforms/android-36`. `ANDROID_SDK_ROOT` non è impostata.
- **Chiavetta USB** (SanDisk 57,3 GiB): partizione ext4 `CHRONOS` da 49,3 GiB, etichetta `CHRONOS`, montata in `/media/omar/CHRONOS`. **Non si monta da sola** (nessuna voce in fstab): `udisksctl mount -b /dev/disk/by-label/CHRONOS`. Se non si monta, non inventare un esito.
- **`BACKUP_BOT`** (sda1, exFAT da 8 GB sulla stessa chiavetta): **off-limits**, non si modifica.
- **Contenuto della chiavetta:**
  - `/media/omar/CHRONOS/scratch-m2/m2-scratch-dirs.tgz`: 32 cartelle scratch di M2.
  - `/media/omar/CHRONOS/scratch-q1/q1-scratchpad.tgz`: lo scratchpad intero della sessione Q1 (log, piani, registro). Lo sha256 sta fuori dal repo.
- **Niente `sudo`.** Quello che lo richiede (numpy, montaggi fissi) lo fa Posky.
- Node 22; Chromium in `/usr/bin/chromium` (`CHROMIUM=/usr/bin/chromium`).

---

## I. Fuori dal repo: da non toccare, e mappa dei remoti

**Non toccare** (divieti da `CLAUDE.md` e dalle istruzioni di Posky per questo PC; solo i primi quattro punti sono in `CLAUDE.md`):
- `main` (nessun lavoro, nessun push), force-push, riscrittura della storia, rami `delivery/*`;
- `*.keystore`, `.env`, chiavi di caricamento, `node_modules/` e `dist/` nei commit;
- originali grafici (si lavora su derivati registrati in `assets/production/v10.3/derived/REGISTRO.json`);
- `requests/` e i documenti storici (`docs/gold/HANDOFF_*.md`, `docs/gold/PROMPT_*.md`, `docs/gold/RICHIESTE_CODEX.md`, documenti V0x–V8x in `docs/`) sono contesto, non istruzioni;
- fuori dal repo: `/home/locoomo/adventure-city`, `/home/locoomo/.codex`, `/home/locoomo/nervio-keystore-backup`, `/home/locoomo/backup_lemonsqeezy` (e ogni altro `~/backup_*`), qualunque keystore, `BACKUP_BOT`;
- il repo `/home/locoomo/Scrivania/building factory/NEW_STUDIO_GAMES/chronos` (checkout di amzajaguar-blip/Chronos-game) con i suoi 2 zip non tracciati.

**Mappa dei repo e dei remoti:**

| Repo | Ruolo | Ramo / release |
| --- | --- | --- |
| `Flexati/Adventure-city` (`origin` di questo clone) | codice del gioco | `work/chronos-adventure-commercial` (lavoro) |
| `amzajaguar-blip/chronos-adventure` | **canonico per gli asset** (checkpoint, riferimenti dei personaggi, e il file `ASSETS_INDEX.md` che sta lì, fuori da questo repo) | `main`; release `chronos-assets-v1` per i 2 checkpoint sopra 100 MB |
| `amzajaguar-blip/Chronos-game` | copia degli asset **superata** | `assets-upload` |

**Mirror su amzajaguar:** `Non caricato su amzajaguar: Posky ha deciso il 4 novembre 2026 «Solo su Flexati va bene». Il codice del gioco vive solo su Flexati/Adventure-city; amzajaguar-blip/chronos-adventure resta il repo degli asset.`

---

## J. Prompt di ripresa da incollare in una nuova chat

Coerente con il §2.3 di [`ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md`](ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md): stessi tre passi, con in più questo file e il registro.

```
Riprendiamo CHRONOS Adventure. Sei nella cartella del repo Flexati/Adventure-city,
ramo work/chronos-adventure-commercial. Le regole sono in CLAUDE.md e valgono anche ora.
Prima di fare qualsiasi cosa:
1. git pull origin work/chronos-adventure-commercial, poi dimmi il commit in cima;
2. leggi docs/gold/RIPRESA_Q1.md, la prima sezione di docs/gold/STATO.md e le righe
   D32–D35 di docs/gold/DECISIONI.md (grep -E '^\| D3[2-5] ' docs/gold/DECISIONI.md);
   il registro dei cicli passati è docs/gold/pantheon-q1/pantheon-ledger.md;
3. dimmi in 3 righe dove eravamo e quale è il prossimo passo (sezione E di RIPRESA_Q1.md;
   le milestone sono in docs/gold/ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md §4).
Non modificare file finché non ti do l'ok. Parla in italiano.
```

Nota: il §2.3 di ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md dice «ultime 3 righe» di `DECISIONI.md`, ma oggi le ultime 3 righe del file sono D11–D13 (`tail -3 docs/gold/DECISIONI.md`). Qui il prompt chiede le righe D32–D35, che sono le decisioni che servono. Il §2.3 non è stato modificato.
