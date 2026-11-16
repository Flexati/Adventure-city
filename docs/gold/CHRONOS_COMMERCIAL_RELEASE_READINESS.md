# CHRONOS ADVENTURE: NOX & LULÙ — COMMERCIAL RELEASE READINESS & STORE STRATEGY (FASE 9)

**Progetto:** Chronos Adventure: Nox & Lulù (`jaguarZcreatorZ13.app`)  
**Prezzo Ufficiale:** `5,99 €` (Acquisto singolo sblocco completo dopo la demo «La firma», oppure build completa)  
**Target SDK Android:** `targetSdkVersion 36`, `minSdkVersion 26`  
**Verdetto Formale di Rilascio (`CLAUDE.md` Regola #1):** `COMMERCIAL_RELEASE = BLOCKED`  

---

## 1. STATO ONESTO DEL GATE DI RILASCIO (`CLAUDE.md` §Regole Fisse #1 & #2)

In conformità rigorosa con la Regola Fissa #1 di `CLAUDE.md` (*«`COMMERCIAL_RELEASE = BLOCKED` finché non sono provati insieme: 5 playtest umani senza P0/P1, prova su un telefono Android API 36, acquisto di test su Play Billing e firma di rilascio. I bot contano come `[SIMULAZIONE]`, non come persone»*), distinguiamo ciò che è **100% pronto e verificato in ingegneria** da ciò che richiede **l'azione fisica dell'autore**:

| Requisito di Rilascio Commerciale | Stato Attuale | Evidenza / Azione Richiesta all'Autore |
| :--- | :--- | :--- |
| **1. Build, Lint e Suite Test Automatici (485+ test)** | **[FATTO] PRONTO (PASS)** | `npm run build`, `npm run lint` e `npm test` passano al 100% con 0 errori. |
| **2. Budget Bundle Android (`app.js <= 458.752 B`)** | **[MISURATO] PRONTO (PASS)** | `app.js` = `453.155 byte`; `world.js` = `151.148 byte`; `en.js` = `171.303 byte`. |
| **3. Campagna 4 Atti, 44 Tappe, 14 Villaggi, 9 Boss, IT/EN** | **[FATTO] PRONTO (PASS)** | Tutte le 44 tappe, 37 botteghe, 13 armi di mercato, 10 mosse, 5 turbo e 9 boss sono integrati e verificati in simulazione (`300/300` battaglie vinte). |
| **4. Architettura UI Demo + Sblocco `5,99 €` (`D20`)** | **[FATTO] PRONTO IN CODICE** | `game/runtime.mjs:771-779` (`DEMO_END = 'separation'`, `window.ChronosBilling`, `window.chronosBillingResult`). |
| **5. 5 Playtest Umani Documentati senza P0/P1** | **BLOCCATO (0 / 5 umani)** | Richiede 5 sessioni giocate da persone reali usando il protocollo in `docs/gold/HUMAN_PLAYTEST_PROTOCOL.md`. |
| **6. Verifica su Telefono Fisico Android API 36 (`M1`)** | **BLOCCATO (Solo Chromium)** | Richiede prova fisica dell'APK (`dist/Chronos_Adventure_Nox_Lulu_debug.apk`) su smartphone Android reale. |
| **7. Collegamento Acquisto di Test Play Billing (`M4`)** | **BLOCCATO (Play Console)** | Richiede il collegamento del `productId` reale nella Google Play Console dell'autore. |
| **8. Firma con Keystore di Produzione dell'Autore (`M5`)** | **BLOCCATO (PC Autore)** | Da eseguire sul PC dell'autore con `npm run android:aab:play` (nessuna chiave privata è salvata nel repo per sicurezza). |

---

## 2. POSIZIONAMENTO COMMERCIALE E STRATEGIA «FOMO ETICO» A 5,99 €

### 2.1 Perché Chronos Adventure Vale 5,99 € (Proposta di Valore Premium)
- **Zero Pubblicità, Zero Energia a Tempo, Zero Lootbox:** Il giocatore acquista un'opera completa, giocabile interamente offline in aereo o in metropolitana (`Storia completa offline · nessuna pubblicità`).
- **Densità di Contenuto da Console Portatile:**
  - **44 Tappe** attraverso 4 Atti drammatici (*La Città al Buio*, *La Breccia*, *Due Strade*, *Ora Uno*).
  - **9 Boss Unici** con meccaniche di ritmo, taglio cime, miraggi e adattamento IA (*Rook*, *The Anchor*, *Bone Tyrant*, *Custode del Nodo*, *Forge Behemoth*, *Shadow Reaper*, *Vega*, *EVE-Prime*, *Archon*).
  - **14 Villaggi Vivi** con 92 edifici dipinti su lotti lastricati, 56 abitanti, 28 incarichi e 37 botteghe visitabili in terza persona.
  - **18 Armi Totali** (5 di storia + 13 regionali), **10 Mosse Speciali** (5 per eroe), **5 Stadi di Turbo Vortex** e **27 Sfide di Guida** nel campionato di Veyra.

### 2.2 I 4 Pilastri del FOMO Etico (Passaparola e Desiderio di Scoperta)
1. **Il Segreto a Portata di Mano (Radar Segreto Chronos):** Mentre esplora una mappa, il giocatore percepisce la risonanza (`◈ SEGRETO RILEVATO` → `✦ FORZIERE VICINO`) che lo spinge a cercare il passaggio nascosto prima di lasciare il distretto.
2. **Il Peso delle Scelte Irreversibili (14 Bivi + La Firma):** Alimentare l'Officina o il Rifugio? Prendere il Sigillo di Risonanza o la Lampada del Santuario? Spegnere o preservare EVE-Prime? Ogni decisione chiude una porta e ne apre un'altra, rendendo unica la propria run.
3. **«Gioca l'altra rotta» (New Game+ Integrato):** Dopo i titoli di coda, il Registro delle Scelte mostra ciò che il giocatore ha deciso senza svelare le conseguenze delle scelte opposte, invitandolo a rigiocare mantenendo tutte le armi e i turbo conquistati.
4. **Il Mistero di *Chrono Shadows* (Kairn e Morrow):** L'incontro a metà campagna e la scena post-crediti con gli stranieri della frattura lasciano un aggancio memorabile verso la Parte II.

---

## 3. SCHEDA GOOGLE PLAY STORE PRONTA ALL'USO (ITALIANO & INGLESE)

### Titolo Breve (IT / EN)
- `Chronos Adventure: Nox & Lulù`

### Descrizione Breve (80 caratteri)
- **IT:** `Action-RPG 2D cyberpunk: 2 eroi, 9 boss, 14 villaggi, gare Vortex e zero spot.`
- **EN:** `2D cyberpunk Action-RPG: 2 heroes, 9 bosses, 14 hubs, Vortex races & zero ads.`

### Punti di Forza per la Scheda Store
- **Due Colpi, Due Stili di Combattimento:** Passa dal controllo temporale *Chrono Shift* di Nox alle onde di risonanza e scudi armonici di Lulù.
- **Un Mondo che Ricorda:** 14 quartieri esplorabili, interni in terza persona e un epilogo che riflette ognuna delle tue scelte morali.
- **Pura Qualità Premium:** Prova gratuitamente il primo arco fino a «La firma», poi sblocca l'intera avventura con un unico acquisto da `5,99 €`.
