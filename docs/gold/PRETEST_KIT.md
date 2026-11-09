# CHRONOS Adventure: Nox & Lulù — Kit di Playtest (Pretest Bundle)

Documento operativo per la conduzione delle sessioni di playtest con utenti reali (1–5 tester).  
Progetto: **CHRONOS Adventure: Nox & Lulù**  
Ramo di riferimento: `work/chronos-adventure-commercial`  
Stato del codice: **v0.10.0-v8.0-rc.2 (L5 completato, 329/329 test PASS)**  
Dimensione bundle `app.js`: **449 742 byte** (margine: 74 546 byte su 512 KiB)

---

## 1. Installazione APK di Test

### Formato e Tipologia
- **Formato:** Pacchetto Android APK di test locale (`.apk`), compilato per architettura universale WebView (Android 8.0+ / API 26+).
- **Firma:** Keystore di debug locale (`androiddebugkey`), senza firma Play Store (nessuna dipendenza da Google Play Services).
- **Percorso generato:**  
  - Percorso file standard: `dist/Chronos_Adventure_Nox_Lulu_debug.apk`  
  - Percorso sorgente non allineato: `android/build/unsigned.apk`

### Istruzioni di Installazione
1. **Tramite ADB (Android Debug Bridge):**
   Collegare lo smartphone Android al PC con debug USB abilitato ed eseguire:
   ```bash
   adb install -r dist/Chronos_Adventure_Nox_Lulu_debug.apk
   ```
2. **Tramite Android Studio (Drag & Drop):**
   Trascinare il file `Chronos_Adventure_Nox_Lulu_debug.apk` direttamente sulla finestra dell'emulatore attivo o nel pannello *Device Manager*.
3. **Tramite Browser Mobile / Web Preview (Alternativa immediata):**
   Sul PC, solo sulla propria Wi-Fi di casa, avviare la pagina hub visibile in rete con `HOST=0.0.0.0 npm run hub` (porta 3000) e aprire su Chrome/Firefox Android:
   ```text
   http://<IP_LOCALE>:3000/game/index.html
   ```
   L'hub serve solo la pagina hub, `game/`, `assets/`, `docs/` e l'APK di debug. Non serve mai `dist/play-upload` (chiave di upload e password), i file nascosti né altri file di build (`tests/server-hub.test.mjs`). Senza `HOST=0.0.0.0` resta raggiungibile solo dal PC. `npm start` resta il server delle prove su `http://127.0.0.1:8080/game/`.

### Note di Sicurezza e Riservatezza
- **Zero Permessi Sensibili:** Il gioco non richiede né accede a rubrica, microfono, fotocamera, archiviazione esterna o posizione GPS (`ACCESS_FINE_LOCATION` assente).
- **Zero Telemetria e Zero Tracciamento:** Nessun tracker SDK di terze parti, analytics o chiamata di telemetria remota.
- **100% Offline:** L'intera esperienza narrativa, grafica e audio risiede internamente nell'applicazione.

### Verifica Integrità (SHA256)
Prima di distribuire l'APK ai tester, calcolare e registrare il checksum SHA256:
```bash
sha256sum dist/Chronos_Adventure_Nox_Lulu_debug.apk
```

---

## 2. Sessione di Gioco: 30 Minuti (Timeline Esperienziale)

La sessione di pretest è tarata per una durata fluida di circa **28–35 minuti**, senza puzzle bloccanti, senza grinding e senza backtracking frustrante. Il level design guida il giocatore visivamente e sensorialmente.

| Minuto | Sequenza di Gioco | Obiettivo di Design & Game Feel |
| :--- | :--- | :--- |
| **0:00 – 0:15** | **Risveglio nella Cassa** | Interazione tattile immediata: doppio tocco sulla cassa di legno con risonanza acustica profonda (`knock`), feedback tattile e liberazione di Lulù. |
| **0:15 – 0:45** | **Esplorazione Rifugio & Menù** | Raccolta del frammento di vetro; presentazione del menù vivo con respiro armonico di Nox e Lulù, orologio di Vanta e selezione nuova partita. |
| **0:45 – 1:30** | **Cantiere Est (Blackout) — Primi Passi** | Joystick virtuale fluttuante al tocco; primi 2 nemici di pattuglia; tiro assistito con pistola C-9, micro screen-shake soddisfacente e suono metallico. |
| **1:30 – 2:30** | **Combattimento Reale & Chrono Shift** | Introduzione al Chrono Shift di Nox: anello ciano pulsante (1 Hz), rallentamento del tempo al frame zero con sub-bass drop (`hitStop`) e ring cristallino (`perfectDodge`). Accensione del primo relè energetico (`relayLit`) su selciato con pozzanghere riflettenti. |
| **2:30 – 8:00** | **Progressione & Boss Rook** | Schivata di cariche nemiche; scontro con il boss Rook (telegraph laser ambra/rosso, posizionamento mine, disarmo); introduzione al Field Kit di Tessa (VX-9 a raffica, R-12 ravvicinata); prima scelta morale (alimentare l'officina di Dario o il rifugio di Mira). |
| **8:00 – 30:00** | **Culmine della Demo & Separazione** | Consolidamento delle abilità, cooperazione tra Nox e Lulù, sequenza narrativa di bivio, culminante nella vetrina commerciale di fine demo. |

---

## 3. Le 10 Domande per i Tester

*Da somministrare al tester immediatamente al termine dei 30 minuti (o raccogliendo note vocali spontanee durante il gameplay).*

1. **Nei primi 10 secondi, cosa hai pensato?**  
   *(es. "Grafica accattivante", "Comandi chiari", "Confuso", "Carica lentamente?")*  
   `Risposta:` _________________________________________________________________

2. **Quando hai capito come spostarti, quanto tempo ci è voluto?**  
   *(Immediato al primo tocco / Qualche secondo / Ho dovuto cercare il controllo)*  
   `Risposta:` _________________________________________________________________

3. **Il primo combattimento ti ha fatto sentire potente o vulnerabile?**  
   *(Scala da 1 a 5: 1 = completamente vulnerabile/frustrato, 5 = potente e in controllo)*  
   `Valutazione:` [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]

4. **Il Chrono Shift (rallentamento ciano) è stato il momento più divertente finora?**  
   `[ ] Sì`  
   `[ ] No (se no, quale momento è stato il migliore?):` ________________________

5. **Le vibrazioni e i suoni sui colpi rendono il gioco più "reale" e soddisfacente?**  
   `[ ] Sì, danno un forte senso di impatto`  
   `[ ] No / Indifferente`  
   `Note:` _____________________________________________________________________

6. **C'è stato un momento in cui hai voluto smettere o ti sei bloccato?**  
   `[ ] No, il flusso è stato continuo`  
   `[ ] Sì (indicare esattamente dove e perché):` ________________________________

7. **La scelta morale (alimentare l'officina vs. il rifugio) ti ha fatto riflettere?**  
   `[ ] Sì, mi è importato delle conseguenze`  
   `[ ] No, ho premuto rapidamente`  
   `Scelta effettuata:` [ ] Officina di Dario  /  [ ] Rifugio di Mira

8. **Dopo 30 minuti, che voto dai complessivamente all'esperienza?**  
   *(Scala 1–10, con motivazione sintetica)*  
   `Voto:` _____ / 10  
   `Motivo:` ___________________________________________________________________

9. **Lo compreresti a 5,99 € come gioco premium offline completo?**  
   `[ ] Sì, li vale tutti`  
   `[ ] Forse (a condizione che: ___________________________________________ )`  
   `[ ] No (motivo: _________________________________________________________ )`

10. **Se potessi continuare a giocare oltre i 30 minuti, cosa vorresti scoprire di più?**  
    *(es. Nuove armi, la storia di Lulù, la Cattedrale, le corse automobilistiche, altri boss)*  
    `Risposta:` _________________________________________________________________

---

## 4. Cosa l'Autore Deve Osservare Durante il Playtest

L'osservazione passiva (senza suggerire soluzioni o intervenire) rivela la verità sul game feel e sulla leggibilità:

- **Engagement Visivo & Corporeo:**  
  - Il tester tocca lo schermo con decisione o cerca conferme visive?
  - Si notano reazioni fisiche viscerali (sorrisi, sopracciglia alzate al Chrono Shift, tensione corporea contro Rook)?
- **Pacing & Fluidità di Movimento:**  
  - Il pollice sinistro copre elementi critici o il floating stick è naturale?
  - Ci sono momenti di esitazione superiore a 5 secondi in cui il tester non sa dove dirigersi?
- **Difficoltà e Curva di Sfida:**  
  - Il primo boss (Rook) richiede concentrazione senza generare frustrazione ingiustificata?
  - Il tester schiva i laser seguendo il telegraph ambra/rosso o viene colpito senza capire perché?
- **Reazione allo Sblocco Finale (#unlock):**  
  - Il tester legge le feature della versione completa (9 Regioni, 5 Boss, Arsenale e auto)?
  - La reazione al prezzo di 5,99 € è di approvazione per l'assenza di pubblicità o di esitazione?
- **Volontà di Continuare:**  
  - Allo scadere dei 30 minuti, il tester esclama *"Peccato sia finita la demo!"* o ripone il dispositivo senza chiedere altro?

---

## 5. Modulo di Registrazione Metriche (Scheda Tester)

*Compilare una scheda distinta per ciascuno dei 1–5 tester effettivi.*

### Scheda Playtest #___
- **Data e Ora:** _________________________
- **Tester (Codice/Iniziali):** ____________
- **Dispositivo utilizzato:** _______________ (es. Pixel 7, Galaxy S22, Emulatore 390×844)
- **Tempo di gioco totale:** _____ minuti (Atteso: 28–35 min)
- **Game Over subiti:** _____ (Atteso: 0–2 su Rook)
- **Schivate perfette riuscite (stima/osservazione):** _____
- **Scelta effettuata al bivio:** [ ] Officina  /  [ ] Rifugio
- **Impressione sui controlli (1–5):** _____
- **Propensione d'acquisto a 5,99 €:** [ ] Alta  [ ] Media  [ ] Bassa
- **Note libere dell'osservatore:**  
  _____________________________________________________________________________  
  _____________________________________________________________________________

---

## 6. Protocollo di Integrità dei Dati

> **REGOLA FONDAMENTALE:** Questo documento costituisce lo strumento operativo e metodologico di raccolta dati. Non contiene dati simulati o percentuali preventive.  
> I risultati e le statistiche verranno inseriti esclusivamente in seguito all'esecuzione dei playtest reali, documentati con il prefisso **`[FATTO: Playtest #N]`**.
