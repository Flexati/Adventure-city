# CHRONOS ADVENTURE: NOX & LULÙ — COMMERCIAL RELEASE GATE (TIER 3.1)

> **Nota dell'11 novembre 2026 (audit R19).** Questo documento descrive lo stato dell'8 novembre. Dopo sono entrati R15–R18: le righe PASS vanno rimisurate sul commit finale (`docs/gold/AUDIT_R19.md`, §2). Il verdetto `BLOCKED` non cambia.

**Repository:** `Flexati/Adventure-city`  
**Branch:** `work/chronos-adventure-commercial`  
**Prezzo Target:** €5,99 acquisto unico (Zero ads, zero microtransazioni)  
**Data Verifica:** 8 Novembre 2026  
**Verdetto Finale:** **`COMMERCIAL_RELEASE = BLOCKED` (In attesa di Playtest Umano e Dispositivo Fisico)**  

---

## 1. Stato Esecutivo del Release Gate

In ottemperanza alla regola deontologica fondamentale del mandato:
> *"Non dichiarare COMMERCIAL_RELEASE = PASS se restano dipendenze umane, fisiche, commerciali o di Play Console non verificate. Non trasformare mai [SIMULAZIONE] in [TEST UMANO]."*

- **Infrastruttura, codice, stabilità, asset, audio e test automatici sono al 100% `PASS` (`[MISURATO]`).**
- **Il rilascio commerciale è formalmente `BLOCKED`** esclusivamente per i requisiti che richiedono presenza fisica di persone reali e hardware reale, attualmente non disponibili nel container Linux headless:
  1. `0 / 5` sessioni di test umano documentate con questionario non direttivo (`[NON VERIFICATO]`).
  2. Test tattile ed ergonomico su smartphone Android fisico con schermo capacitivo reale (`[NON VERIFICATO]`).
  3. Firma definitiva dell'AAB con il keystore privato `chronos-upload` dell'autore su Google Play Console (`[BLOCCATO]`).
  4. Verifica degli acquisti e ripristino licenza con Google Play Billing reale su account licenziatario di test (`[BLOCCATO]`).

---

## 2. Checklist Ufficiale dei Requisiti di Rilascio (TIER 3.1)

| # | Requisito di Rilascio Commerciale | Esito | Evidenza | Note Tecniche e Vincoli Residui |
| :-: | :--- | :---: | :---: | :--- |
| **1** | Repository, branch e commit verificati | **PASS** | `[MISURATO]` | Branch `work/chronos-adventure-commercial` allineato e pulito. |
| **2** | Flusso completo della campagna verificato nel runtime | **PASS** | `[MISURATO]` | Tutte le 31 tappe completabili dal prologo ai titoli senza eccezioni. |
| **3** | Nessun blocco P0 o crash aperto nel codice | **PASS** | `[MISURATO]` | Zero crash; protezione frame loop e salvataggio automatico attivi. |
| **4** | Nessun problema P1 noto senza decisione esplicita | **PASS** | `[MISURATO]` | Audio jitter implementato; traccia titolo rimasterizzata; touch overhaul completato. |
| **5** | Tutte le 31 tappe verificate per accessibilità e coerenza | **PASS** | `[MISURATO]` | Audit dettagliato in `docs/gold/ANTI_BOREDOM_31_STAGES.md`. |
| **6** | 5 Armi e 5 Boss effettivamente giocabili e testati | **PASS** | `[MISURATO]` | C-9, VX-9, R-12, ARC-7, H-17 e i 5 boss verificati (`GAME_FEEL_AND_COMBAT_AUDIT.md`). |
| **7** | Controlli verificati su smartphone Android fisico | **BLOCCATO** | `[NON VERIFICATO]` | Emulati e verificati via Playwright mobile; richiede smartphone fisico per test ergonomico. |
| **8** | Prestazioni e stabilità verificate su dispositivo fisico | **BLOCCATO** | `[NON VERIFICATO]` | Frame time p95 di 7,0 ms in Chromium; attende verifica termica e GPU su silicio reale. |
| **9** | Almeno 5 sessioni di test umano reali documentate | **BLOCCATO (`0/5`)** | `[NON VERIFICATO]` | Protocollo pronto in `HUMAN_PLAYTEST_PROTOCOL.md`; nessun dato umano inventato. |
| **10** | Feedback e punti di abbandono analizzati senza guidare i tester | **BLOCCATO** | `[NON VERIFICATO]` | Schede predisposte; in attesa dell'esecuzione da parte dell'autore. |
| **11** | Durata reale distinta da stime e simulazioni | **PASS** | `[MISURATO]` / `[STIMATO]` | 48,9 min bot `[SIMULAZIONE]`; 85,7 min tipico `[STIMATO]`; > 135 min con sfide/replay. |
| **12** | Demo gratuita fino a «La firma» verificata | **PASS** | `[MISURATO]` | Transizione pulita al paywall alla tappa 13 senza corruzione dei salvataggi. |
| **13** | Acquisto unico e Google Play Billing reale verificati | **BLOCCATO** | `[BLOCCATO]` | Interfaccia JS pronta (`window.ChronosBilling`); cablaggio `BillingClient` nativo richiede Play Console. |
| **14** | Firma e configurazione Play Console verificate | **BLOCCATO** | `[BLOCCATO]` | Richiede keystore privato dell'autore (`npm run android:aab:play`). |
| **15** | AAB finale generato e verificato (`bundletool`) | **PASS** | `[MISURATO]` | `dist/chronos-adventure-release.aab` compilato con API 36 e validato con zero errori. |
| **16** | Documentazione e build corrispondono allo stesso commit | **PASS** | `[MISURATO]` | Tutti gli 11 documenti in `docs/gold/` allineati e tracciati. |
| **17** | Nessuna discrepanza critica tra store listing e prodotto | **PASS** | `[MISURATO]` | Risolta la discrepanza 10 vs 11 scene; 4 hub e 5 boss accuratamente descritti. |

---

## 3. Piano di Sblocco Operativo (Per l'Autore)

Per trasformare `COMMERCIAL_RELEASE = BLOCKED` in `COMMERCIAL_RELEASE = PASS`:

1. **Eseguire il Playtest Umano:** Inviare `dist/Chronos_Adventure_Nox_Lulu_debug.apk` a 5 tester indipendenti, far giocare la demo (Atto I e II) e compilare la scheda di `docs/gold/HUMAN_PLAYTEST_RESULTS.md`.
2. **Test su Telefono Fisico:** Confermare la reattività dei pulsanti touch al neon su uno smartphone Android reale.
3. **Firma e Play Billing:** Firmare l'AAB con il keystore di produzione su Google Play Console e verificare l'acquisto unico in sandbox a €5,99.
