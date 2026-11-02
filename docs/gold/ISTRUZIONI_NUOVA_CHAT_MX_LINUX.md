# Istruzioni per una nuova chat: Claude Code sul PC MX Linux

2 novembre 2026 · ramo `work/chronos-adventure-commercial` · `COMMERCIAL_RELEASE = BLOCKED`

Questo file è il punto di partenza per continuare CHRONOS Adventure: Nox & Lulù dal PC dell'autore, con Claude Code nel terminale e Remote Control. Contiene tre cose:
1. come preparare il PC (§1);
2. il messaggio da incollare nella nuova chat (§2);
3. lo stato del lavoro e il mandato, diviso in milestone (§3 e §4).

**Legenda:** **[FATTO]** = verificato nel repo o in questa sessione; **[IPOTESI]** = non provato su MX Linux, va controllato al primo uso.

---

## 1. Preparare il PC

MX Linux 23 è basata su Debian 12 «bookworm» **[FATTO]**, quindi i comandi sono quelli di Debian. Nessun passo richiede di scrivere password o chiavi nella chat.

### 1.1 Pacchetti di sistema

```bash
sudo apt update
sudo apt install -y git curl zip unzip python3 python3-numpy python3-pil openjdk-17-jdk adb
```

- `python3-numpy` e `python3-pil` servono agli strumenti grafici (`tools/*.py`).
- `openjdk-17-jdk` e `adb` servono solo per l'APK e per le prove sul telefono. Il build compila Java con `--source 8 --target 8`, quindi basta un JDK completo **[FATTO]**; la versione 17 è una scelta **[IPOTESI]**.

### 1.2 Node.js 22

Il repo è stato provato con Node v22.22.0 **[FATTO]**. Debian 12 ha una versione più vecchia, quindi si usa il repository di NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node --version   # deve iniziare con v22
```

### 1.3 Il repository

Il repository `Flexati/Adventure-city` è privato. Per l'accesso si usa una chiave SSH oppure `gh auth login` sul PC. **I token non si scrivono mai nella chat.**

```bash
git clone git@github.com:Flexati/Adventure-city.git
cd Adventure-city
git checkout work/chronos-adventure-commercial
npm ci
npm test                      # atteso: 245 test, 245 PASS (2 novembre 2026)
```

### 1.4 Browser per i controlli automatici

`playwright` 1.62.1 è tra le dipendenze **[FATTO]**. Sul PC si installa il suo Chromium:

```bash
npx playwright install --with-deps chromium
```

Su MX Linux Playwright potrebbe avvisare che la distribuzione non è tra quelle ufficiali **[IPOTESI]**. In quel caso:
- si installa senza `--with-deps`;
- le librerie mancanti si aggiungono con `apt`, seguendo il messaggio d'errore.

### 1.5 Android SDK (APK di prova e prove sul telefono)

Gli script vogliono **[FATTO]** (`tools/build_apk.sh`, `tools/build_aab.sh`):
- la variabile `ANDROID_SDK_ROOT`;
- la piattaforma `android-35` e i `build-tools` 35.0.0;
- per l'AAB, `BUNDLETOOL_JAR` con bundletool 1.18.3 o successivo.

1. Scarica i «command line tools» per Linux da developer.android.com/studio e scompattali in `~/Android/cmdline-tools/latest`.
2. Imposta le variabili:
   ```bash
   export ANDROID_SDK_ROOT="$HOME/Android"
   export PATH="$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$PATH"
   ```
3. Installa i pacchetti e compila:
   ```bash
   sdkmanager "platforms;android-35" "build-tools;35.0.0" "platform-tools"
   bash tools/build_apk.sh       # APK di debug in dist/
   ```

**Il keystore di caricamento su Play** (`npm run android:key:play`) resta sul PC dell'autore e **non entra mai nel repo né nella chat**.

### 1.6 Claude Code e Remote Control

```bash
curl -fsSL https://claude.ai/install.sh | bash
cd ~/Adventure-city
claude                        # chat nel terminale, dentro la cartella del repo
```

La guida ufficiale è su [code.claude.com/docs](https://code.claude.com/docs).

Per raggiungere questa cartella anche dalla chat sul web o sul telefono, si usa Remote Control: dentro la cartella si avvia `claude remote-control`. Dall'app desktop c'è la stessa funzione in **Impostazioni → Claude Code → Remote Control** **[FATTO]**.

**Limiti di Remote Control:**
- non può essere la cartella home;
- non può essere una cartella nascosta subito sotto la home.

---

## 2. Il messaggio da incollare nella nuova chat

Copia il blocco così com'è.

```
Sei il Tech Lead di CHRONOS Adventure: Nox & Lulù (gioco Android in JavaScript dentro un WebView).
Repo: Flexati/Adventure-city, ramo work/chronos-adventure-commercial. Non toccare mai main.
Parla sempre in italiano.

Prima di tutto leggi, in quest'ordine:
1. docs/gold/ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md (questo file);
2. docs/gold/DECISIONI.md (D01-D30);
3. docs/gold/STATO.md (sezione «Design V10.3»);
4. docs/design/v10.3/README.md.
Poi esegui `npm test` e dimmi il risultato.

Regole che non cambiano:
- Escludi credenziali e chiavi. Non pubblicare sullo store senza la mia autorizzazione esplicita.
  COMMERCIAL_RELEASE = BLOCKED.
- Non inventare test, risultati PASS, licenze o approvazioni. [FATTO] = verificato, con fonte o file:riga;
  [IPOTESI] = deduzione, con valore e motivo.
- Non cambiare hitbox o tempi, salvo le decisioni approvate (D27, D29).
- Nox è maschile, Lulù è femminile. Non ridisegnare corpi o volti V8. Gli originali non si modificano mai.
- I 19 civili restano la causa morale.
- Nox e Lulù sono gli unici protagonisti giocabili. Archon è il boss finale della Parte I.
  Kairn e Morrow non sono mai giocabili nella Parte I: compaiono solo come figure secondarie
  e misteriose e non spiegano la Frattura.
- Nessun meccanismo F2P aggressivo.
- Il joystick funziona in ogni punto dello schermo.
- Prima di modificare un file esistente elenca cosa cambi e perché.
- Lavora a milestone: alla fine di ognuna fermati, fammi un riepilogo e chiedimi conferma.
  Se manca un'informazione, fammi una sola domanda chiara.
- Ogni proposta deve funzionare al tocco, su schermo piccolo e senza audio.
- Non scrivere identificativi di modello nei commit o nei documenti.
- Dammi sempre i file da scaricare.

Comincia dalla milestone M1 del §4 di ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md.
```

---

## 3. Stato al 2 novembre 2026

- **Versione:** `0.10.0-v8.0-rc.2` **[FATTO]**.
- **Test:** `npm test` dà 245 su 245 PASS **[FATTO]**.
- **Playtest umani:** zero (`docs/gold/PLAYTEST.md`). È ancora richiesto un playtest su un telefono Android.

| Area | Fatto | Da fare |
|---|---|---|
| Benchmark (Fasi 1-3) | Documenti in `docs/design/v10.3/`, decisioni D18-D26 | Fase 4: 3 milestone, 3 rischi, 3 test con giocatori; proposta riga per riga su «Otto mesi dopo» (D26) |
| Combattimento, Pilastro 1 (D27) | **N2 gamepad implementato** (D29): `game/input-v9.mjs`, `game/runtime.mjs`, 4 test unitari, `npm run qa:gamepad` (9 controlli con un gamepad simulato in Chromium) | **C1** (tocco su `pointerdown`) e **N1** (buffer di 100 ms) non implementati. Il gamepad va provato su un telefono vero (M1) |
| Combattimento, Pilastro 2 (D29) | Approvato: G1 hit-stop solo visivo, E1 `telegraphLock`, CS Chrono Shift | Tutti e tre da implementare (M2) |
| Combattimento, Pilastri 3-5 | — | Audio adattivo, architettura, verifica |
| Grafica, Pilastri 1-2 (D28, D30) | Regole misurate (`tools/art_style_audit.py`). Pacchetto `requests/gpt-boss-v2-20261102/`: 20 prompt, 36 immagini. 10 controlli in `tools/art_derived_checks.mjs`, con test | Immagini GPT dei 4 boss, poi pulizia e integrazione (M6) |
| Grafica, Pilastri 3-5 | — | Atlanti e prestazioni, coerenza, verifica con giocatori |
| Prezzo (D18) | 5,99 € deciso | Acquisto nel gioco e 16 file da allineare (M4, M5) |
| Demo (D20) e «Gioca l'altra rotta» (D22) | Decise | Da implementare (M3) |
| Boss (D23) | 5 nel gioco: Rook, The Anchor, Custode, EVE, Archon | Bone Tyrant, Behemoth, Shadow Reaper e Vega (M6) |

---

## 4. Il mandato, a milestone

Ogni milestone si chiude con:
- `npm test` verde;
- i controlli nel browser della sua area;
- un commit sul ramo `work/chronos-adventure-commercial`;
- **uno stop per il feedback dell'autore.**

### M1 — Prove sul telefono (solo verifica, nessun codice nuovo)

1. `bash tools/build_apk.sh`, poi `adb install -r dist/Chronos_Adventure_Nox_Lulu_debug.apk`.
2. **Gamepad (test 5 del Pilastro 5).** Collega un controller via Bluetooth o USB, apri una missione e prova:
   - stick sinistro per muoversi;
   - A o grilletto destro per sparare, al rilascio, con lo stick destro per mirare;
   - B per schivare;
   - X per PULSE;
   - Y per DUO;
   - spalle per ATTIVA e cambio arma;
   - croce su e giù per ricarica e cura;
   - Start per la pausa.

   Per vedere cosa riceve il WebView: Chrome sul PC, `chrome://inspect`, console del WebView, `cityAdventure.controls().gamepad`.

   **Se il WebView non vede il gamepad** (`seen: false` dopo aver premuto un pulsante), il codice resta inattivo e non cambia nulla. Si registra il risultato in `docs/gold/PLAYTEST.md` e si chiede all'autore se tenerlo.
3. **Joystick in ogni punto dello schermo**, in verticale (390 × 844) e in orizzontale.
4. Si scrivono i risultati veri, con modello del telefono e versione di Android. Nessun PASS senza la prova.

### M2 — Input e sensazione dei colpi (D27, D29)

Prima di scrivere codice, si elenca cosa cambia e perché.

| Codice | Cosa | File |
|---|---|---|
| **C1** | SCHIVA, DUO e ATTIVA partono su `pointerdown` invece che al rilascio | `game/runtime.mjs` (pulsanti `oneShotActions`) |
| **N1** | Buffer di 100 ms per SCHIVA, SPARA e PULSE; i pulsanti in ricarica non sono più disattivati. Il gamepad usa lo stesso buffer | `game/runtime.mjs`, `game/campaign.mjs` (`tick`) |
| **G1** | Hit-stop **solo visivo** di 2, 4 o 6 frame: la simulazione non si ferma | rendering in `game/runtime.mjs` |
| **E1** | Evento `telegraphLock{x, y, kind}` quando l'attacco nemico smette di seguire l'eroe | `game/campaign.mjs` |
| **CS** | Dopo la Perfect Dodge di Nox, nemici e proiettili a ×0,5 per 0,6 s (36 frame), al massimo ogni 3,0 s (180 frame), con bordo ciano. Nox si muove a velocità normale | `game/campaign.mjs`, `game/runtime.mjs` |

Dettagli e numeri:
- [Pilastro 1](../design/v10.3/CHRONOS_COMBATTIMENTO_P1_INPUT.md);
- [Pilastro 2](../design/v10.3/CHRONOS_COMBATTIMENTO_P2_STATI.md).

Durate, finestre e hitbox del resto restano identiche. Prove: `tests/perfect-dodge.test.mjs`, `tests/input-v9.test.mjs` più test nuovi, poi `npm run qa:controls` e `npm run qa:gamepad`.

### M3 — Demo fino a «La firma» (D20) e «Gioca l'altra rotta» (D22)

- **La demo si ferma dopo «La firma».** Si lascia un invito chiaro alla versione completa, senza schermate aggressive.
- **«Gioca l'altra rotta» dopo i titoli di coda:** registro delle scelte fatte e nuova partita che tiene armi e potenziamenti. Nessun finale nuovo.
- **I salvataggi esistenti restano compatibili:** `tests/save-v5.test.mjs`, `tests/progress-store.test.mjs`, `npm run qa:save`.

### M4 — Acquisto a 5,99 € (D18): prima una domanda all'autore

L'app oggi si compila **senza Gradle**: `aapt2`, `javac` e `d8` chiamati a mano (`tools/build_apk.sh`) **[FATTO]**. La Play Billing Library si distribuisce come AAR con dipendenze, quindi ci sono due strade:
1. passare il build a Gradle;
2. scompattare a mano le AAR nel build di oggi.

**È una scelta di architettura: va chiesta all'autore prima di scrivere codice.** In ogni caso:
- nessuna chiave nel repo;
- il prodotto si crea in Play Console solo con l'autorizzazione esplicita dell'autore;
- si prova con gli account di test di Play.

### M5 — Allineare i 16 file che dicono ancora 4,99 € (D18)

Per trovarli:

```bash
grep -rlI "4,99\|4\.99" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=android . \
  | grep -v "docs/design/v10.3/\|docs/gold/DECISIONI.md\|docs/gold/ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md"
```

Il risultato sono 16 file **[FATTO]**.

**Le prove registrate non si riscrivono:** `docs/evidence/…/PLAYTIME_ESTIMATE*.json` e `docs/evidence/chrono_shadows/director/README.md` documentano lavori passati. Lì si aggiunge una nota, oppure si rigenera la prova con lo strumento. I documenti di progetto si correggono.

### M6 — I 4 boss nuovi (D23, D28, D30)

1. L'autore genera le immagini con i prompt di `requests/gpt-boss-v2-20261102/` (ordine e nomi nel README di quella cartella) e le consegna sul ramo `delivery/gpt-boss-v2-20261102`.
2. Claude scrive lo script di pulizia (Pilastro 2 grafica, §3):
   - toglie lo sfondo con `tools/gpt_chroma.py`;
   - rende l'alfa binaria;
   - taglia le celle;
   - mette il pivot ai piedi;
   - scala con filtro Lanczos a 288 px;
   - lascia i margini e riduce i colori.
3. Registra il derivato in `assets/production/v10.3/derived/REGISTRO.json` e lancia `npm test`. I 10 controlli girano da soli.
4. **Le mosse dei boss non sono progettate.** Prima dell'integrazione nel gioco serve il loro progetto (tempi, avvisi, hitbox), da approvare con l'autore.

### M7 — «Otto mesi dopo» (D26)

Proposta riga per riga: quali battute si spostano nel cammino. Nessuna si cancella. Si presenta all'autore prima di toccare `game/story-v08.mjs`.

---

## 5. Comandi utili

| Comando | Cosa fa |
|---|---|
| `npm test` | Tutti i test (245 al 2 novembre 2026) |
| `npm start` | Server locale su `http://127.0.0.1:8080/game/` |
| `npm run qa:gamepad` | Gamepad simulato in Chromium, 9 controlli. Serve un server sulla porta 8090: `python3 -m http.server 8090 --bind 127.0.0.1` |
| `npm run qa:controls` | Tocco, due dita, tastiera, impaginazione (stessa porta 8090) |
| `node tools/build_boss_v2.mjs .` | Riscrive il pacchetto dei boss v2: risultato identico, verificato dal test |
| `node tools/art_derived_checks.mjs <png> <brief.json> [grezzo.png]` | I 10 controlli su un derivato |
| `python3 -I tools/art_style_audit.py . docs/evidence/v10.3/art-style` | Le misure di stile del Pilastro 1 |
| `bash tools/build_apk.sh` | APK di debug in `dist/` |

## 6. Dove sono le cose

| Cosa | Dove |
|---|---|
| Decisioni dell'autore | `docs/gold/DECISIONI.md` |
| Stato e cronologia | `docs/gold/STATO.md` |
| Progetto V10.3 (benchmark, combattimento, grafica) | `docs/design/v10.3/` |
| Prove registrate | `docs/evidence/` |
| Richieste a GPT | `requests/` |
| Codice del gioco | `game/` (moduli `.mjs`; per Android vengono uniti in un solo `app.js` da `tools/prepare_android_assets.py`, con un limite di 512 KB: oggi 513 065 byte su 524 288, margine 11 223 byte; il gamepad ne ha usati 3 396) |
