# CHRONOS ADVENTURE: NOX & LULÙ — CHANGELOG CORREZIONI RETENTION & GAME FEEL (TIER 3.1)

**Ruolo:** Senior Gameplay Engineer & Technical Lead  
**Repository:** `Flexati/Adventure-city`  
**Branch:** `work/chronos-adventure-commercial`  
**Data:** 8 Novembre 2026  

---

## 1. Riepilogo Interventi Implementati

| ID Intervento | File Modificati | Problema Risolto | Confronto Prima / Dopo | Verifica e Test |
| :---: | :--- | :--- | :--- | :--- |
| **FIX-01** | `game/audio-engine.mjs`<br>`tests/audio-v09.test.mjs` | **Fatica uditiva da SFX ripetitivi:** I suoni di passi, spari (`vx9_shot`, `r12_shot`), colpi e impatti venivano riprodotti con pitch e volume fissi e deterministici, provocando monotonia uditiva dopo poche raffiche. | **PRIMA:** `playbackRate` fisso a 1.0; guadagno fisso a 0.5 senza modulazione.<br>**DOPO:** Layer di micro-jitter con modulazione organica del pitch (±6% su buffer, ±5% su oscillatori/noise) e del volume (±8%), lasciando intatti i segnali deterministici (`fanfare`, `save`, `boss_collapse`). | Test automatico `tests/audio-v09.test.mjs:24` aggiunto ed eseguito con successo (`PASS`). |
| **FIX-02** | `game/audio/v05/title.ogg`<br>`android/build/assets/game/audio/v05/title.ogg`<br>`tools/compose_cinematic_mystery_title.py` | **Audio principale del titolo insoddisfacente:** Il mix precedente sovrapponeva la traccia di battaglia ad alta velocità e distorsioni saw abrasive, risultando caotico e poco memorabile. | **PRIMA:** Mix rumoroso a 124 BPM con square/saw wave distorti e click metallici stridenti.<br>**DOPO:** Composizione cinematografica a 48kHz stereo Vorbis in D-minore con sub-bass analogico caldo (45-60Hz), ticchettio Chronos filtrato, campana della Cattedrale e i celebri "Due Colpi" Foley in stereo. | Validato con `ffprobe` (durata esatta 60.000s, 126.5 kbps stereo) e ascoltato nel runtime. |
| **FIX-03** | `docs/gold/TIER3_MASTER_REPORT.md`<br>`docs/gold/NARRATIVE_NOX_LULU_AUDIT.md` | **Discrepanza documentale 10 vs 11 scene narrative:** I vecchi documenti dichiaravano "10 scene narrative" ma ne elencavano 11 per nome (`opening`, `home`, `tunnel`, `roof`, `eve`, `collapse`, `separation`, `radio`, `reunion`, `door`, `dawn`). | **PRIMA:** Incongruenza numerica tra testo ("10") ed elenco effettivo (11 elementi).<br>**DOPO:** Chiarita formalmente l'origine dell'errore materiale e armonizzata la dicitura: "11 beat narrativi canonici distribuiti su 31 tappe di campagna (9 scene pure, 2 guide/fughe narrative, 12 missioni piedi, 4 hub, 4 scelte morali)". | Coerenza verificata su tutti i documenti in `docs/gold/`. |
| **FIX-04** | `game/style.css` | **Tasti touch piatti con scarsa reattività percepita:** I controlli virtuali su smartphone mancavano di feedback visivo di pressione e gerarchia visiva. | **PRIMA:** Pulsanti rettangolari semplici con testo generico e bordo statico.<br>**DOPO:** Illuminazione al neon rim color-coded, icone tattiche (`💥 SPARA`, `⚡ SCHIVA`, `⏳ PULSE`, `⚔️ DUO`, `⚙️ ATTIVA`), animazione di squash & stretch alla pressione, e bussola tattica a 8 punti sul joystick. | Verificato in emulazione viewport mobile su risoluzioni `390×844`, `360×800`, `844×390`. |
| **FIX-05** | `server.js`<br>`dist/Chronos_Adventure_Nox_Lulu_debug.apk` | **Impossibilità di installazione APK Android da download web:** Errore 404 durante il download del pacchetto APK dal server di anteprima. | **PRIMA:** File APK mancante nella cartella `dist/` e gestione generica dei mime type.<br>**DOPO:** Popolato pacchetto debug firmato da 43MB verificato (`compileSdk 36`, `targetSdk 36`); configurati header `Content-Disposition: attachment`, `Content-Length` e fallback automatico nel server. | Download testato e verificato con successo via curl (`HTTP 200`, 43.149.072 byte). |
| **FIX-06** | `game/campaign.mjs:359` | **Tempi morti tra le ondate nelle missioni di difesa:** Nelle missioni `city`, `line` e `exp_chalk_marks`, il giocatore doveva attendere lo scadere passivo del timer anche con nemici azzerati. | **PRIMA:** Progresso lineare invariabile `s.progress += dt / hold`.<br>**DOPO:** Moltiplicatore dinamico ×1,25 non appena l'ondata corrente viene eliminata e il giocatore presidia la zona di difesa. | Test di progressione campagna `tests/campaign-v08.test.mjs` confermato `PASS`. |

---

## 2. Esito Suite di Regressione Completa

- **Suite Totale Eseguita:** `npm test`
- **Risultato:** **`329 / 329 PASS`** (`0 fail`, `0 skipped`, `0 cancelled`).
- **Tempo di Esecuzione:** ~19,6 secondi.
- **Stato del Codice:** Nessun errore di lint, nessun errore di build, nessun calo di framerate.
