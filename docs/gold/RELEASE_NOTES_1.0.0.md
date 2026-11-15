# CHRONOS Adventure v1.0.0 — Release Notes & Build Report

**Data build:** 8 novembre 2026  
**Package Name:** `jaguarZcreatorZ13.app`  
**versionCode:** `2`  
**versionName:** `1.0.0`  
**Target SDK / Compile SDK:** `API 36` (`build-tools 36.0.0`)  
**Ramo:** `work/chronos-adventure-commercial`  
**Peso `app.js`:** `449 742 byte` su `524 288 byte` (margine libero: **`74 546 byte`** > 64 KiB)

---

## Changelog vs. v0.10.0-v8.0-rc.2
- **Audio d'impatto procedurale e decodificato (L5):** preset sub-bass `hitStop` (95 → 28 Hz), `perfectDodge` cristallino (1320 → 2100 Hz), `relayLit` (520 → 1280 Hz), `knock` risonante, `weaponReload` e `weaponSwitch`.
- **Chrono Shift & Game Feel (Q2 / L5):** anello ciano pulsante (1 Hz) su Nox quando il Chrono Shift è carico, doppio bordo sul tasto `SCHIVA`, hit-stop visivo G1 (2/4/6 frame), pozzanghere riflettenti e scintille sui nodi spenti nel Cantiere Est.
- **Menù principale e Opzioni (Q4 / M-A / L5):** Nox e Lulù interi e animati a 390×844 e 844×390, eco del Chrono Shift ogni 7 s, menù Opzioni a 4 schede (Audio, Accessibilità, Controlli, Crediti) e modale `#unlock` con 3 feature card e prezzo unico `5,99 €`.
- **Villaggi progettati e Interni (D40 / M-B):** 4 piante 24×24 distinte per Moon Refuge, Cathedral Quarter, Toxic Slum Bazaar e Clockwork Outpost, porte calpestabili e ritratti in prima persona degli interlocutori.
- **Veyra v9 (TIER 1A):** 7 gare serie testate in browser (`v9-race-lab.html`) e 3 gare Ash Docks + 9 sfide D17 (`Contro il tempo`, `Eliminazione`, `Rivincita`) integrate e verificate negli hub (`390×844` e `844×390`).
- **Armi V9 (TIER 1B):** 5 armi (`C-9`, `VX-9`, `R-12`, `H-17 Needle`, `ARC-7 Choir`) testate con cambio rapido, fasi di ricarica in piedi e in movimento, rosata e portata dinamica.
- **Durata e Demo M3 (TIER 1C):** 31 tappe misurate per sezione (`docs/evidence/tier1/playtime/TABELLA_DURATA_SEZIONI.md`), fine demo dopo «La firma» (`separation`) e modalità «Gioca l'altra rotta» (D22).

---

## Stato Test e Verifiche (`[FATTO]`)
- **Test suite (`npm test`):** `329/329 PASS` (0 falliti, 0 saltati)
- **Browser QA Gare Veyra:** `PASS` (`docs/evidence/tier1/veyra/browser.json`, `hub-race-report-390x844.json`, `hub-race-report-844x390.json`, `race-modes-report-390x844.json`)
- **Browser QA Armi V9 & Ricarica:** `PASS` (`docs/evidence/tier1/weapons/combat-browser.json`, `reload-browser-report-390x844.json`, `weapons-v9-action.webm`)
- **Browser QA Demo M3 & Replay:** `PASS` (`docs/evidence/tier1/playtime/demo-m3-report.json`, 5/5 controlli)
- **Playtest umano:** `0 sessioni documentate finora` (Kit pronto in `docs/gold/PRETEST_KIT.md`)
- **Telefono vero (M1):** `In attesa di test fisico dell'autore` (`COMMERCIAL_RELEASE = BLOCKED` finché M1, M4, M6, M7 e playtest umani non sono chiusi dall'autore)

---

## Artefatti Build Android (`dist/`) e Checksum SHA-256

Generati e validati con Android SDK Platform 35/36, `build-tools 36.0.0`, `bundletool 1.18.3` e `apksigner`:

```text
ad94397835813ca5558b552f962283e70a7df98a2b08c6fd7f8028586be77d30  dist/chronos-adventure-release.aab
ad94397835813ca5558b552f962283e70a7df98a2b08c6fd7f8028586be77d30  dist/Chronos_Adventure_Nox_Lulu_vcode2_test.aab
f50b83e8298d32b76754f979deeee8931f56a2fb7fb58243b6704ef2aeb643f1  dist/Chronos_Adventure_Nox_Lulu_debug.apk
```

- **Dettagli AAB:** `88 233 810 byte` (`package: name='jaguarZcreatorZ13.app' versionCode='2' versionName='1.0.0' targetSdkVersion='36' debuggable='false'`), validato con `bundletool validate` e `apksigner verify` sull'APK universale derivato.
- **Nota sulla firma (Regola 2 e 3 CLAUDE.md):** L'AAB generato in questo ambiente è firmato con chiave locale di verifica (`CN=Chronos AAB Test`). Per la firma finale con la chiave privata di upload dell'autore (`alias=chronos-upload`, impronta `6E:0A:ED:9C:FB:3F:92:30:E6:B7:8D:3F:95:E5:29:82:7D:2B:27:D4:C7:CF:79:BE:88:6B:9F:B6:64:51:59:DB`), eseguire sul PC dell'autore:
  ```bash
  export ANDROID_SDK_ROOT="/opt/android-sdk"
  export BUNDLETOOL_JAR="/opt/android-sdk/bundletool.jar"
  export PLAY_UPLOAD_KEYSTORE="/percorso/a/JaguarZcreatorZ13-upload-key.jks"
  export PLAY_UPLOAD_KEY_ALIAS="chronos-upload"
  export PLAY_UPLOAD_STORE_PASSWORD="..."
  export PLAY_UPLOAD_KEY_PASSWORD="..."
  npm run android:aab:play
  ```

---

## Note per il Reviewer (Play Console)
- **Privacy & Sicurezza:** Nessun tracciamento, nessuna telemetria, nessuna pubblicità, nessun permesso pericoloso richiesto (`VIBRATE` unico permesso normale).
- **Modello commerciale:** Prezzo fisso `5,99 €` (acquisto singolo per sbloccare la storia completa dopo la demo di 13 tappe «La firma»).
- **Funzionamento:** 100% offline.
