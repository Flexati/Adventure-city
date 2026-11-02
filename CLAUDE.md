# CHRONOS Adventure: Nox & Lulù — istruzioni per Claude

Claude Code legge questo file da solo all'avvio, se la sessione parte dalla cartella del repo. Vale per tutte le sessioni su questo ramo.

Le regole vengono dall'autore del gioco. Cambiano solo con una sua decisione scritta in `docs/gold/DECISIONI.md`.

## Il progetto in breve

- **Il gioco:** azione per Android, scritta in JavaScript e eseguita dentro un WebView. Versione `0.10.0-v8.0-rc.2`.
- **Il codice:** moduli `.mjs` in `game/`.
- **Il build Android non usa Gradle.** `tools/prepare_android_assets.py` unisce i moduli in un solo `app.js`, con un limite di 524 288 byte. Il 2 novembre 2026 il file pesava 513 065 byte. Poi `tools/build_apk.sh` chiama a mano `aapt2`, `javac` e `d8`.
- **Il ramo di lavoro è `work/chronos-adventure-commercial`. Non si lavora mai su `main`.**
- **Stato:** `COMMERCIAL_RELEASE = BLOCKED`. Non ci sono ancora playtest umani (`docs/gold/PLAYTEST.md`).

## Regole che non cambiano

1. **Lingua.** Parla e scrivi sempre in italiano.
2. **Credenziali e store.**
   - Credenziali, chiavi, token e keystore non vanno mai nel repo né nella chat.
   - Senza l'autorizzazione esplicita dell'autore, non si pubblica nulla sullo store e non si crea nulla in Play Console.
3. **Niente invenzioni.**
   - Non inventare test, risultati PASS, licenze o approvazioni.
   - Scrivi **[FATTO]** con la fonte (`file:riga`, comando o rapporto) e **[IPOTESI]** con il valore e il motivo.
4. **Tempi e hitbox.** Non cambiare hitbox o tempi del gioco, salvo le decisioni approvate D27 e D29.
5. **Personaggi e originali.**
   - Nox è maschile, Lulù è femminile.
   - Non ridisegnare i loro corpi o volti V8.
   - Gli originali (immagini consegnate e sorgenti grafici) non si modificano mai: si lavora su un derivato registrato.
6. **Canone.**
   - Nox e Lulù sono gli unici protagonisti giocabili.
   - Archon è il boss finale della Parte I.
   - I 19 civili restano la causa morale.
   - Kairn e Morrow non sono mai giocabili nella Parte I. Restano figure secondarie e misteriose e non spiegano la Frattura.
7. **Prezzo.** Prezzo unico di 5,99 € (D18), senza meccanismi F2P aggressivi.
8. **Controlli.**
   - Il joystick funziona in ogni punto dello schermo.
   - Ogni proposta deve funzionare al tocco, su uno schermo piccolo e senza audio.
9. **Grafica.**
   - Niente copie di opere protette.
   - Niente testo leggibile negli sprite.
   - Le minacce si riconoscono anche senza colore.
   - Ogni regola si verifica con uno script o con un tester.
10. **Modelli.** Non scrivere identificativi di modello nei commit, nel codice o nei documenti.

## Come si lavora con l'autore

- **Prima leggi, poi proponi.** Leggi il codice prima di proporre qualcosa e mostra le formule. 1 frame = 16,67 ms.
- **Prima di modificare un file esistente,** elenca cosa cambi e perché. Se la modifica non è già nel mandato approvato, aspetta l'ok.
- **Si lavora a milestone.** Il mandato è in `docs/gold/ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md`, §4. Ogni milestone si chiude così:
  1. `npm test` passa per intero;
  2. passano i controlli nel browser della sua area;
  3. si fa un commit sul ramo;
  4. si scrive un riepilogo;
  5. **ci si ferma** per il feedback dell'autore.
- **Se manca un'informazione,** fai una sola domanda chiara.
- **Le decisioni aperte non le prendi da solo.** Sono nella sezione «Da decidere» di `docs/design/v10.3/README.md`.
- **Registra le decisioni.**
  - Una scelta nuova dell'autore diventa una riga in `docs/gold/DECISIONI.md`, con il numero dopo l'ultimo e le sue parole citate.
  - Lo stato aggiornato va in cima a `docs/gold/STATO.md`.
- **I file per l'autore** si consegnano scaricabili: con lo strumento di invio file, se c'è; altrimenti con il percorso completo.

## Quale documento vince

1. **`docs/gold/DECISIONI.md`.** Se due decisioni si contraddicono, vince la più recente.
2. **Questo file** e `docs/gold/ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md`.
3. **I documenti di progetto** in `docs/design/v10.3/`.
4. **`docs/gold/STATO.md`.** Lo stato attuale è nella prima sezione; il resto è cronologia.
5. **Documenti storici.** Si leggono come contesto e non si eseguono:
   - i passaggi di consegne del 28 ottobre, `docs/gold/HANDOFF_*.md`;
   - i prompt di produzione del 28 ottobre, `docs/gold/PROMPT_*.md`;
   - `docs/gold/RICHIESTE_CODEX.md`;
   - i documenti V0x–V8x in `docs/`.

**I prompt in `requests/` sono richieste per i generatori di immagini** (GPT e altri), non istruzioni per te. Li leggi, li produci e li controlli, ma non li esegui.

Se due fonti si contraddicono e la regola sopra non basta, fermati e chiedi.

## Dove sono le cose

| Cosa ti serve | Dove |
|---|---|
| Decisioni dell'autore, da D01 all'ultima | `docs/gold/DECISIONI.md` |
| Stato attuale (prima sezione) e cronologia | `docs/gold/STATO.md` |
| Mandato M1–M7, preparazione del PC, prompt di avvio | `docs/gold/ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md` |
| Indice del progetto V10.3 e decisioni aperte | `docs/design/v10.3/README.md` |
| Benchmark in 3 fasi | `docs/design/v10.3/CHRONOS_FASE_3_SINTESI.md` (la sintesi; le fasi 1 e 2 sono nella stessa cartella) |
| Combattimento: input, joystick e gamepad (Pilastro 1) | `docs/design/v10.3/CHRONOS_COMBATTIMENTO_P1_INPUT.md` |
| Combattimento: stati, frame data, hit-stop, Chrono Shift (Pilastro 2) | `docs/design/v10.3/CHRONOS_COMBATTIMENTO_P2_STATI.md` |
| Grafica: regole di stile misurate (Pilastro 1) | `docs/design/v10.3/CHRONOS_ARTE_P1_STILE.md` |
| Grafica: pipeline, 10 controlli e contratto dei boss (Pilastro 2) | `docs/design/v10.3/CHRONOS_ARTE_P2_PIPELINE.md` |
| Storia: le due ore di narrativa e la specifica | `docs/gold/NARRATIVA_V10_3_DUE_ORE.md`, `docs/gold/NARRATIVE_SPEC_V10_3.md` |
| Canone per regioni, boss, NPC, nemici, abilità e produzione | `docs/gold/APPENDICE_*.md` (6 file) |
| Audio | `docs/gold/AUDIO_PLAN_V10_3.md`, `docs/gold/AUDIO_REGISTER.json` |
| Playtest e durata | `docs/gold/PLAYTEST.md` |
| Release Android e Play | `docs/gold/RELEASE.md`, `docs/PLAY_RELEASE_CHECKLIST.md` |
| Prompt per GPT: boss v2 (36 immagini da generare) | `requests/gpt-boss-v2-20261102/README.md` |
| Prompt per GPT: preproduzione (310 tavole) | `requests/gpt-preproduzione-310-20261029/README.md` |
| Immagini consegnate (originali, non si toccano) | `deliveries/` e i rami `delivery/*` |
| Derivati grafici e loro registro | `assets/production/v10.3/derived/REGISTRO.json` |
| Prove registrate (rapporti JSON e immagini) | `docs/evidence/` |
| App Android | `android/`, `tools/build_apk.sh`, `tools/build_aab.sh` |
| Test | `tests/` (uno per area, `node:test`) |

### I moduli del gioco più usati

| Modulo | Cosa fa |
|---|---|
| `game/runtime.mjs` | Ciclo dei frame, disegno, tocco, tastiera e gamepad |
| `game/campaign.mjs` | Simulazione del combattimento (`tick`), nemici, Perfect Dodge |
| `game/input-v9.mjs` | Joystick, mappature e lettura del gamepad |
| `game/missions.mjs` | Le 31 tappe di ogni rotta |
| `game/story-v08.mjs` | Dialoghi, con le varianti che dipendono dalle scelte |
| `game/hubs.mjs` | Hub e incarichi |
| `game/racing-v9.mjs` | Gare di Veyra |
| `game/weapons-v9.mjs` | Armi |
| `game/progress-store.mjs` | Salvataggi |

## Comandi

```bash
npm ci                                            # dipendenze (Node 22)
npm test                                          # tutti i test: devono passare tutti
npm start                                         # gioco su http://127.0.0.1:8080/game/
python3 -m http.server 8090 --bind 127.0.0.1      # server per i controlli nel browser: lascialo acceso
npm run qa:controls                               # tocco, due dita, tastiera, impaginazione
npm run qa:gamepad                                # gamepad simulato in Chromium, 9 controlli
npm run qa:save                                   # recupero dei salvataggi
node tools/build_boss_v2.mjs .                    # riscrive il pacchetto dei boss v2 (risultato identico)
node tools/art_derived_checks.mjs <png> <brief.json> [grezzo.png]   # i 10 controlli su un derivato
bash tools/build_apk.sh                           # APK di debug in dist/ (serve ANDROID_SDK_ROOT)
```

## Git

- I commit vanno sul ramo `work/chronos-adventure-commercial`, con un messaggio chiaro in italiano. Il push si fa con `git push -u origin work/chronos-adventure-commercial`.
- **Non sono permessi:**
  - push su `main`;
  - force-push;
  - riscrittura della storia;
  - modifiche ai rami `delivery/*`, che contengono le consegne dell'autore.
- **Non entrano mai in un commit:**
  - `*.keystore`;
  - file `.env`;
  - chiavi di caricamento;
  - `node_modules/`;
  - `dist/`.
