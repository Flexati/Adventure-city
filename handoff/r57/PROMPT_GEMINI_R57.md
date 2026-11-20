# Prompt per Gemini — R57: integrazione asset (variante gratuita)

Sei lo sviluppatore che lavora nel repository **Flexati/Adventure-city** (gioco Android in WebView, codice in `game/`). Questo materiale è già nel repository, nella cartella **`handoff/r57/`**: contiene solo asset **già approvati** da Loris (grafica + audio d’ambiente). Il tuo compito è **integrarli nel codice**, far passare tutti i test, e lasciare il ramo pronto. **Non firmare** l’AAB e **non pubblicare**. Gemini **non deve firmare**.

Lavora dal ramo **`assets/r57-handoff`**, partendo dalla **variante gratuita**. Leggi prima `handoff/r57/MANIFEST.md` (ogni file → percorso di destinazione, schermata, caveat) e `handoff/r57/INTEGRATION_PLAN.md` (cablaggio audio **per tappa**, non per kind). Gli asset sono in `handoff/r57/assets/graphics/` e `handoff/r57/assets/audio/`. I path nel manifest e nel piano (`assets/graphics/…`, `assets/audio/…`) sono relativi a `handoff/r57/`.

---

## 1. Ramo, variante, consegna

1. Lavora dal ramo **`assets/r57-handoff`** (già nel repo; non serve uno zip). È basato sulla linea della **variante gratuita**: `feat/free-variant-iap` (PR **#23**, commit `8d9cf0c`). Parti dalla variante free, non da quella a pagamento. Se hai già completato il lavoro **R56/D96** (test Atto I 27/27, `app.js` circa 409 KB, suite completa verde) su un ramo che include la variante free, integra questo handoff su quella linea portando gli asset da `handoff/r57/`; altrimenti crea il ramo di integrazione da `assets/r57-handoff`. Nome suggerito per il ramo di lavoro: `feat/assets-r57-free`.
2. **Non** partire dalla sola linea a pagamento (PR #22) senza la variante free.
3. Apri una PR verso `ccr-022499ad-zq9iu5`. **Non unire, non pubblicare, non caricare su Play, non fare release.**
4. Documenta in `docs/gold/STATO.md` (nuova sezione **R57**, non riusare R56) e in `docs/gold/DECISIONI.md` (prossimo numero D libero): file cambiati, misure (`app.js`, p95 se lo lanci, peso APK se lo costruisci unsigned), cosa non hai potuto verificare (qualità all’ascolto su telefono).
5. Commit chiari. Messaggi in italiano o inglese, ma un tema per commit (asset vs cablaggio vs test).
6. **Dopo** questa integrazione sulla free, le stesse modifiche verranno portate sull’app a pagamento (`jaguarZcreatorZ13.app`) in lockstep. Nella PR indica un breve piano di porting (stessi path di `game/`, senza toccare `applicationId` né i file di billing). Non è necessario chiudere tu il porting in questo giro: prima la free.

### Variante gratuita: deve restare intatta

- `applicationId` free: **`jaguarZcreatorZ13.app.free`** (deve finire in `.free`; `StoreHook` decide l’edizione dal package name).
- Atto I è gratuito; un solo IAP **`unlock_full_game`** (5,99 €) sblocca il resto. Non aggiungere acquisti, pubblicità, timer, scarsità finta, sconti a tempo, pulsazioni sul prezzo.
- La logica free (blocco Atti II–IV, teaser, schermata di sblocco, `#store-panel`) si attiva **solo** se esiste `window.ChronosEdition`. Nel browser e nell’app a pagamento nulla è bloccato.
- La parola «Free» / «Gratis» **non** deve comparire in nessuna stringa visibile (vedi `tests/free-variant-r55.test.mjs`).
- Non toccare i file di build dell’app a pagamento in modo da introdurvi billing o `.free`. I test free verificano che `tools/build_play_aab.sh` resti `jaguarZcreatorZ13.app`, senza `unlock_full_game`.
- Testi di sblocco onesti («un solo acquisto, per sempre»); «Torna al menu» sempre presente e non sembra disabilitato.

---

## 2. Vincoli fissi (non negoziabili)

- **Non cambiare** `applicationId`, firma, chiavi, keystore, né la logica del `versionCode`. Non modificare `tools/build_play_aab.sh`, `tools/build_aab.sh`, `tools/build_free_aab.sh` se non è strettamente necessario per copiare un asset (e anche allora, senza toccare package name, firma o versionCode). I default negli script restano quelli che trovi (paid `PLAY_VERSION_CODE` 4, free `FREE_VERSION_CODE` 1): **non incrementare** il versionCode; la build firmata la fa Folly.
- **Non creare una chiave nuova.** Non eseguire `tools/generate_play_upload_key.mjs`. Non leggere e **non stampare** nulla da `/home/box/secure/chronos/` (password, keystore, credenziali).
- **L’AAB firmato lo costruisce Folly** con la chiave di upload già esistente (SHA-256 `6E:0A:ED:9C…`). Tu **non firmi**, non produci un AAB di Play, non carichi su Play. Se vuoi un controllo locale, al massimo un APK/AAB **non firmato** o la sola preparazione asset; non committare l’APK di debug.
- Nessun token GitHub incollato in chat: usa solo l’accesso GitHub già collegato.
- `app.js` impacchettato **sotto 524 288 byte** (`tools/prepare_android_assets.py` rifiuta il bundle oltre quella soglia; c’è anche una guardia a **458 752 B** in `tests/bundle-weight.test.mjs`: 524 288 − 65 536). L’audio e le immagini stanno **fuori** da `app.js`: nel JS metti solo path/override, nomi unici dopo il flatten.
- Prestazioni: p95 del frame callback **sotto 16 ms** (`tools/verify_performance_v09.cjs` / `npm run qa:performance`). I nuovi strati parallax e i ritratti grandi non devono far sforare il budget. Rispetta `settings.reduced` (niente parallax extra, niente lampi). Nel percorso caldo niente allocazioni nuove.
- Formato di shipping: **solo WebP e OGG** per nuova arte opaca e per tutto l’audio. **Niente WAV** nel repo di gioco né nell’APK. I PNG con alpha (ritratti, rim, UI, strati strada) sono ammessi; il feature graphic dello store è PNG RGB 1024×500 senza alpha.
- Peso APK: l’APK di debug era circa **113,94 MB**, sopra il limite **100 MB** di GitHub se la CI fa commit del file. I ritratti/UI/audio aggiungono peso; i rim A9 **sostituiscono** gli sheet v05 (peso circa invariato). Riporta il peso dopo `prepare_android_assets.py` e, se costruisci un APK unsigned, la nuova cifra. Non committare l’APK. Non «risolvere» la CI toccando firma o applicationId.
- I moduli vengono **appiattiti in un solo `app.js`**: ogni nome di funzione/costante di primo livello deve essere **unico in tutto il gioco**. Dopo ogni modifica rigenera il pacchetto e provalo, non solo il sorgente.
- Non cambiare hitbox, tempi e finestre di combattimento, né i cinque finali, né `game/difficulty.mjs`.
- IT **e** EN insieme. Nessun testo di storia nuovo o cambiato senza l’OK di Loris: se devi toccare una stringa, elencala nella PR come «da approvare». Non inventare battute.
- Nessuna telemetria nuova, nessun nuovo permesso Android, nessuna chiamata di rete nuova.
- Accessibilità: contrasto testi ≥ 4,5:1; target tocco ≥ 44 px; safe area.

---

## 3. Cosa integrare (segui il manifest)

Copia gli asset da `handoff/r57/` nei path indicati in `handoff/r57/MANIFEST.md`, aggiorna CSS/JS/packer/`AssetRoutes.java` e i test che referenziano i path vecchi.

### Grafica

- **A1** Feature graphic → `assets/source/store/store_feature_1024x500_notitle.png` (1024×500, senza titolo e senza logo). Non è asset di gameplay.
- **A2** Teaser verticale → file nuovo (es. `game/art/atti/teaser_breccia_9x16.webp`); `#teaser-art` non deve più riusare `atto_2.webp`. Solo nell’edizione free, a fine Atto I. Non esiste un 16:9 del teaser in `handoff/r57/`: in landscape usa un crop/cover rispettoso (il soggetto è il muro), senza generare scritte.
- **A3** Hero di sblocco → file nuovo (es. `game/art/atti/unlock_hero_1200x540.webp`); `.store-hero` non deve più riusare `atto_2.webp`. Niente scarsità visiva.
- **A4** Ritratti 512×512: collegalis a `portraitClass` / CSS per speaker. Non cambiare gli ID. Neutra di default; tesa/calda se già distinguibili senza nuovi testi. Veyra ha uno **stile più dipinto** dei ritratti pixel: usala così, è approvata. Eve e Mira hanno gli occhi un po’ chiari: usale comunque. Tessa non è in `SPEAKERS`: aggiungi la classe solo se mostri il volto (kit sul campo), senza inventare dialoghi. Aggiorna l’allowlist di `AssetRoutes.java` (oggi solo `portrait_kairn|portrait_morrow|portrait_veyra`).
- **A6** Carte atto: hai **9:16 e 16:9** per gli Atti I–IV. Sostituisci `art/atti/atto_1.webp`–`atto_4.webp` con una coppia per atto e uno switch CSS in base all’orientamento. L’Atto I 16:9 da usare è quello **pulito** in `handoff/r57/` (143 892 B), non la vecchia versione con bande scure. **Atto III («Due strade»)**: luminosità della fascia centrale ≈ **26–27 %** (obiettivo di authoring &lt; 25 %). Verifica che titolo e obiettivo restino leggibili sopra il gradiente scuro già presente su `#card`; non scrivere testo nell’immagine. Aggiorna `AssetRoutes` e i test (`atto_[1-4]`).
- **A8** Kit UI: cornice olografica al posto del bronzo steampunk, pulsanti, guscio barra vita, icone 96 px. Oggi `frame_menu.webp` è WebP e i test lo richiedono: o converti la cornice in WebP senza scritte, o aggiorni packer, rotte e test in modo coerente. Nessuna lettera nei file.
- **A9** Rim light: **sostituisci** gli otto file in `game/art/v05/` (`nox|lulu` × `walk|gun|actions|magic`). Le dimensioni coincidono con gli originali. Non cambiare griglia, ordine dei frame, hitbox. Ciano su Nox, magenta su Lulú.
- **A5** Solo tre strati approvati: `mid_a2`, `near_a2`, `mid_a3`. Usali sulla guida dell’Atto II (`app_breach`, `signal`, `evacuation`) e, per il mid, sull’Atto III (`ring`, `tunnel`). **Caveat: le giunture verticali sono usabili, non perfette.** Non usare gli strati esclusi (far/mid Atto I, far Atto II). Per gli altri atti lascia `driving_road.png`. Disegna i layer extra solo se `!settings.reduced`. Non coprire auto, ostacoli, telegrafi di pericolo.

### Audio — cablaggio per tappa (obbligatorio)

Segui **alla lettera** `handoff/r57/INTEGRATION_PLAN.md`. In sintesi:

- Sempre `preloadChrono(..., 'nome_unico')` + `setAmbience('chrono_nome_unico')`. **Mai** sostituire in blocco il default di un kind (`old_town` / `cathedral` / `toxic_market` / `clockwork`), perché lo stesso kind serve a luoghi diversi.
- Nomi file unici in `game/audio/chrono/` (tieni i nomi `act1_…` / `act2_…` di `handoff/r57/assets/audio/`). Non sovrascrivere i letti da 8 s: restano fallback per i posti ancora scoperti.
- **Correggi i tre casi muti / sbagliati:**
  - `docks_veyra` / hub `ash_docks` oggi usano `old_town` (sbagliato) → `act1_docks_veyra`.
  - `exp_chalk_marks` / hub `chalk_harbor` hanno `ambience: 'port'` e restano **in silenzio**. Togli `'port'` e precatica `act2_port_antenne` in via **provvisoria** (stesso porto; un letto proprio manca ancora).
  - La fuga `escape` chiama `setAmbience('drive')` e resta muta → precatica e avvia `chrono_act1_escape_drive`. **Solo** `escape`. Gli altri drive (`app_breach`, `signal`, `evacuation`, `ring`, `tunnel`) restano come sono (muti o con il letto attuale): **non** riusare il letto della fuga dell’Atto I.
- `collapse`: oggi non chiama preload/setAmbience. Non lasciare il letto della tappa precedente. Un letto di crollo **manca**: se non lo hai, togli l’ambience precedente (silenzio consapevole) oppure un fallback dichiarato nella PR. Non attaccare il vento dell’Asse o la fuga dell’Atto I «per riempire».
- `bone_tyrant` è kind 2: override obbligatorio su `act2_cathedral_quarter` (stesso spazio della navata). Non condividere col porto.
- One-shot Atto I (`act1_thunder_distant`, `act1_relay_spark`, `act1_crane_groan`): precariicali sull’Atto I; tuono sparso nel cantiere, scintilla all’accensione di un relè, cigolio gru al porto. Non in loop, non in `app.js`.
- Clinica e bazaar: letti **disomogenei** (LRA alta), ma **approvati**. Usali, non sostituirli, e segnalali nella PR.
- Moon Refuge: usa il file in `handoff/r57/` (picco già abbassato a circa −1,4 dBTP).
- Il motore applica già high-pass 380 Hz, loop, fade e lo slider **effetti**. Non raddoppiare il processing.
- Posti ancora senza letto nuovo: lascia i fallback da 8 s (`clockwork`, `necropolis`, ecc.) come documentato nel piano. Non riciclare un letto di un altro luogo.

### Test sull’ambience silenziosa — aggiornali solo in modo consapevole

`tests/narrative-links-v10_3.test.mjs` oggi asserisce che i kind `'city'`, `'port'`, `'drive'`, `'dark'` producono **0 nodi** (niente ronzio sintetico). È una protezione voluta.

- **Preferisci** lasciare quei kind generici **muti** e far suonare solo `chrono_<nome>`. In quel caso il test esistente può restare, e ne aggiungi di nuovi che verificano il preload/override per tappa (`docks_veyra`, `escape`, `exp_chalk_marks`, cattedrale/boss, ecc.).
- Se proprio cambi il significato di `'drive'` o `'port'` così che producano nodi, **aggiorna il test di proposito**, spiega il perché nella PR, e tieni comunque la garanzia che non partano oscillatori/white-noise di fallback. Non «aggiustare» il test in silenzio solo per farlo passare.

Registra i nuovi OGG in `tools/prepare_android_assets.py` (lista esplicita `audio/chrono`) e in `AssetRoutes.java`.

---

## 4. Materiale extra (facoltativo, stesso stile)

Puoi aggiungere materiale se serve all’integrazione (conversione WebP della cornice, CSS object-position, crop landscape del teaser, test nuovi, piccolo fallback grafico). Se generi o ritocchi arte:

- stile già stabilito: città neon-noir, **rim ciano su Nox e magenta su Lulú**, stessa palette, niente testo/lettere/numeri/loghi nell’arte;
- non ridisegnare le identità di Nox e Lulú;
- non introdurre nemici o strati strada nuovi in questo giro (gli A7 e i far layer sono esclusi di proposito);
- niente WAV;
- ogni aggiunta va elencata nella PR, con peso e motivo.

---

## 5. Test da tenere verdi (eseguili e riportali)

```
node --test --test-concurrency=1 tests/*.test.mjs
npm run lint
python3 tools/prepare_android_assets.py
node tools/verify_campaign_browser.cjs http://127.0.0.1:8090/game/ a
node tools/verify_campaign_browser.cjs http://127.0.0.1:8090/game/ b
node tools/verify_campaign_browser.cjs http://127.0.0.1:8090/game/ c
node tools/verify_free_variant_r55.cjs
# oppure: npm run qa:free
node tools/verify_act1_polish_r56.cjs
# oppure: npm run qa:act1  (con il server sul bundle Android se è quello che usate)
```

Aggiungi test nuovi per: path dei nuovi asset, teaser/unlock che non riusano più `atto_2.webp` come hero, ritratti collegati agli speaker, override audio per tappa, `exp_chalk_marks` non più silenzioso, `escape` con letto proprio, `docks_veyra` non più su `old_town`, variante free ancora corretta (Atto I libero, IAP unico, niente «Gratis» visibile, paid intatto).

Consigliati, se il tempo lo consente: `npm run qa:performance` (p95 &lt; 16 ms). Se non lo lanci, dillo esplicitamente nella PR.

---

## 6. Cosa devi riportare a Loris (nella PR / nel resoconto)

1. Ramo, commit, base usata (free + R56).
2. Elenco dei **file cambiati** (asset copiati, CSS, JS, packer, AssetRoutes, test, docs).
3. Esito di ogni comando della lista sopra (pass/fail, numeri: dimensione `app.js`, eventuale p95, eventuale peso APK unsigned).
4. Caveat applicati: Veyra più dipinta; clinica e bazaar disomogenei; giunture A5 usabili ma non perfette; luminosità media carta Atto III ≈ 26 %.
5. Cosa **non** è in questo pacchetto (nemici, strati far, altri drive, vetri/nodo/necropoli, ecc.) e cosa hai lasciato col fallback vecchio.
6. Conferma che **non** hai firmato, non hai toccato `applicationId`/chiavi/`versionCode`, non hai unito né pubblicato.
7. Nota fissa: **l’AAB firmato lo costruisce Folly con la chiave di upload già esistente; Gemini non deve firmare.**
8. Piano breve per portare le stesse modifiche sull’app a pagamento, in un giro successivo e in lockstep.

Lavoro efficiente, senza rifattorizzare ciò che già funziona. Se un vincolo ti ferma a metà, consegna comunque il resoconto fatto / non fatto / non verificabile.
