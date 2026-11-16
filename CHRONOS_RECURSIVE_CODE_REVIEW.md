# CHRONOS ADVENTURE: NOX & LULÙ — RECURSIVE CODE REVIEW (FASE 7 · LOOPS A–E)

**Documento:** Revisione Ricorsiva del Codice su 5 Anelli (Architettura, Gameplay/Fisica, UI/Audio/Locale, Tooling/Test, Sicurezza/Bundle)  
**Standard:** Zero progressi fittizi, ogni difetto documentato con file, riga, causa radice e verifica automatica.

---

## LOOP A — ARCHITETTURA, BUNDLE BUDGET E REGOLE DEL PACKAGER ANDROID

### Analisi Tecnica (`tools/prepare_android_assets.py`, `game/*.mjs`)
1. **Regola dei Template Literal Multi-riga (`prepare_android_assets.py:150-153`):**
   - Il packager Android compatta gli spazi bianchi riga per riga e **rifiuta esplicitamente** qualsiasi modulo `game/*.mjs` che contenga template literal su più righe (`ValueError: multi-line template literal, whitespace cannot be stripped safely`).
   - **[FATTO] Verifica:** Tutte le modifiche in `game/village-art.mjs` e `game/runtime-en.mjs` usano esclusivamente stringhe su singola riga. `npm run build` e `npm run lint` terminano con codice `0`.
2. **Pruning Automatico degli Export e Budget `app.js` (`prepare_android_assets.py:127-205`):**
   - `tests/bundle-prune-r19.test.mjs` impone che `android/build/assets/game/app.js` resti `<= 458.752 byte` e che ogni funzione esportata non elencata in `pruned-exports.json` sia effettivamente chiamata dal runtime.
   - **[FATTO] Scelta ingegneristica:** Collocando `computeTacticalHudState(s)` in `game/village-art.mjs` e chiamandola direttamente all'inizio di `drawComboStreakHud`, la funzione viene inclusa in `world.js` (`151.148 byte`), lasciando `app.js` invariato a **`453.155 byte`** (`5.597 byte` sotto la guardia).

---

## LOOP B — GAMEPLAY, FISICA, MIRA E INTELLIGENZA ARTIFICIALE DEI BOSS

### Analisi Tecnica (`game/campaign.mjs`, `game/weapons-v9.mjs`, `game/painted-maps.mjs`)
1. **Coerenza Punto d'Origine e Punto d'Impatto dei Colpi (`R28`–`R29`):**
   - In `game/campaign.mjs:257`, `shotTarget(s, pm, dir, hits[0], th, end)` calcola l'arrivo sul torace del nemico colpito (`chest(hits[0])`) o lungo la retta d'altezza della canna (`pm.y`) quando il colpo impatta un muro o raggiunge la gittata massima.
   - In `game/runtime.mjs:940`, `muzzleFire` viene invocata solo quando `e.mx != null` e `!e.chain` (così i rimbalzi a catena dell'`ARC-7 Choir` o `Bobina Arco Mk.II` tra un nemico e l'altro non disegnano una falsa fiammata di canna sul corpo del primo nemico).
2. **Sblocco Mosse Eroe nell'Atto III/IV (`R23`, `game/arsenal-data.mjs:69, 76`):**
   - Poiché l'Atto IV contiene una sola missione a piedi giocata con Nox (`finale`), la quinta mossa di Lulù (`lulu_supernova` · *Coro Supernova*) aveva `minStep: 'reunion'` e risultava inutilizzabile in combattimento. Con l'attributo `early: 'vega'` per Lulù e `early: 'app_axis'` per Nox (`nox_nova` · *Singolarità dell'Asse*), entrambe le mosse supreme vengono sbloccate e usate nelle fasi cruciali della campagna (`tests/arsenal-review-r23.test.mjs`).

---

## LOOP C — INTERFACCIA, LOCALIZZAZIONE BILINGUE IT/EN E ACCESSIBILITÀ

### Analisi Tecnica (`game/locale.mjs`, `game/runtime-en.mjs`, `game/style.css`, `game/hud.mjs`)
1. **Integrità Traduzioni Inglesi (`en.js`):**
   - Ogni etichetta disegnata su Canvas tramite `label(t, ...)` o `tr(t)` in `game/runtime.mjs` e `game/village-art.mjs` passa dal traduttore `tr`.
   - **[FATTO] Verifica:** Le nuove etichette del Radar Segreto (`✦ FORZIERE VICINO` → `✦ CHEST NEARBY`, `◈ SEGRETO RILEVATO` → `◈ SECRET DETECTED`) e del banner boss (`PUNTO DEBOLE ESPOSTO` → `WEAK POINT EXPOSED`) sono state aggiunte a `game/runtime-en.mjs` e compilate in `android/build/assets/game/en.js`.
2. **Layout Orizzontale e Schermi Bassi (`844×390`, `R19`):**
   - Verificato che in modalità landscape (`max-height: 500px`, `ch <= 500`) le coordinate verticali di `drawComboStreakHud`, del Radar Segreto (`sy = ch <= 500 ? 116 : 138`) e del banner Punto Debole (`by0 = ch <= 500 ? 92 : 108`) si adattino automaticamente per non sovrapporsi mai alla barra del boss né ai controlli inferiori.

---

## LOOP D — AMBIENTE DI TEST, TOOLING PYTHON E PULIZIA WORKSPACE

### Analisi Tecnica (`tests/tooling-syntax.test.mjs`, `/CHRONOS_*.md`)
1. **Risoluzione Fallimento `PIL` e `numpy` in `tests/tooling-syntax.test.mjs`:**
   - **Causa radice:** All'avvio dell'audit, `npm test` eseguiva 479 test con 477 PASS e 2 FAIL in `tests/tooling-syntax.test.mjs` (`race props round trip` e `GPT chroma key`) perché l'interprete `/usr/bin/python3` del container era privo dei pacchetti `PIL` e `numpy` richiesti da `tools/terra_contract.py` e `tools/clean_sheet_layout.py`.
   - **[FATTO] Correzione:** Installati i pacchetti di sistema `python3-pil` e `python3-numpy`. Tutti gli 11 test di `tests/tooling-syntax.test.mjs` passano ora in `7,95 s`.
2. **Rimozione Deliverable Stub Errati e Sincronizzazione Web Hub:**
   - **Causa radice:** Una precedente esecuzione incompleta aveva scritto 10 file stub di poche righe dentro `/app/applet/app/applet/CHRONOS_*.md`.
   - **[FATTO] Correzione:** Eliminata la directory `/app/applet/app`, scritti i 10 deliverable completi nella radice `/CHRONOS_*.md` e copiati in `/docs/gold/CHRONOS_*.md` affinché il server HTTP (`server.js`) li serva direttamente nella scheda «Report & Gate» di `/index.html`.

---

## LOOP E — SICUREZZA, WHITELIST HTTP E IGIENE CREDENZIALI GIT

### Analisi Tecnica (`server.js`, `.gitignore`, configurazione Git)
1. **Isolamento del Server Pretest (`server.js:8-27`):**
   - `DIRS = new Set(['game', 'assets', 'docs'])` e `FILES = new Set(['index.html', 'dist/Chronos_Adventure_Nox_Lulu_debug.apk'])`. Qualsiasi tentativo di accedere a `.git`, `.env`, `.jks`, `.keystore` o file fuori radice restituisce `404` o `403` (verificato da `tests/server.test.mjs`).
2. **Protezione Credenziali durante il Push GitHub:**
   - Il token fornito dall'utente viene utilizzato esclusivamente in memoria per l'operazione di push verso `https://github.com/Flexati/Adventure-city.git` (ramo `work/chronos-adventure-commercial`) e immediatamente rimosso da `.git/config`, garantendo che nessuna credenziale compaia in alcun file o commit.
