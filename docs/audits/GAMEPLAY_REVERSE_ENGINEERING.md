# Audit di Ingegneria Inversa e Analisi Architetturale · Chronos Adventure: Nox & Lulù

**Stato:** Milestone M0 completata (Nessun codice di gioco modificato in M1–M6)  
**Data:** Novembre 2026  
**Riferimento:** Prompt operativo v2 e direttiva Master Gameplay Expansion  

---

## 1. Intro (`#studio`), Menu (`#menu`) & Apertura (`#opening`)

- **[FATTO] Intro `#studio` (`game/index.html:2`, `game/style.css:34-43`, `game/runtime.mjs:795-801`):**  
  L'introduzione visiva utilizza il marchio Jaguarzcreatorz basato sui frame estratti (`jaguar_intro_f1.webp`, `jaguar_intro_f2.webp`, `jaguar_intro_f3.webp` in `game/art/brand/`), visualizzati all'interno di `#studio .studio-stage`. Il marcatore testuale `#studio .studio-mark` è nascosto tramite proprietà CSS (`clip:rect(0,0,0,0); opacity:0!important`) preservando l'impatto visivo pulito ed elegante dell'artwork. La sessione viene memorizzata in `sessionStorage['city-studio-shown']` per evitare ripetizioni indesiderate.
- **[FATTO] Menu principale (`#menu`):**  
  Il menu si posiziona in sovrapposizione con backdrop panoramico (`art/brand/vanta-clock-still.webp`), atmosfera ed effetti pioggia ottimizzati. I pulsanti `#start` e `#continue` offrono risposte tattili immediate conformi ai requisiti mobile.
- **[FATTO] Apertura (`#opening`):**  
  La sequenza di risveglio ("Due colpi sul metallo") implementa il timer di inattività di 2,5 secondi che invita alla digitazione/tocco (`.tap-invite`), garantendo l'interazione immediata anche con la modalità ridotta di movimento (`prefers-reduced-motion: reduce`).

---

## 2. Architettura Reale e Vincoli Android (`app.js` Budget)

- **[MISURATO] Dimensioni del bundle (`tools/prepare_android_assets.py`):**  
  - `android/build/assets/game/app.js`: **453.155 byte**  
  - `android/build/assets/game/world.js`: **149.724 byte**  
  - `android/build/assets/game/en.js`: **171.181 byte**  
  - *Limite di guardia del progetto:* **458.752 byte** (Limite tecnico dello script: 524.288 byte).  
  - *Margine disponibile in `app.js`:* **circa 5.597 byte**.  
- **Implicazioni per M1–M6:**  
  Il margine ridotto in `app.js` impone che qualsiasi ampliamento di logica per il Dual Link, Chrono Shift o Living City debba essere estremamente compatto o basato sullo spostamento di tabelle statiche di dati (es. cataloghi di hub o descrizioni testuali) verso `world.js` o moduli dati dedicati, evitando assolutamente l'aggiunta di librerie esterne.

---

## 3. Sistema di Combattimento, IA, Input & Dual Link (3.1)

- **[FATTO] Architettura a 3 Stati Paralleli (`docs/design/v10.3/CHRONOS_COMBATTIMENTO_P2_STATI.md`):**  
  Il combattimento gestisce in contemporanea Movimento, Azione e Difesa senza bloccarsi. Le hitbox e i tempi rimangono rigorosamente conformi alle decisioni approvate (`D27`, `D29`, `D44`).
- **[FATTO] Sostituzione della Barriera con `NOVA SONICA`:**  
  La vecchia abilità solitaria di Lulù (`barrier` in `campaign.mjs:417-427` e `runtime.mjs:1122,1195`) è stata sostituita con successo da `NOVA SONICA`, offrendo un'identità offensiva e di supporto energetico coerente con il canone dei due protagonisti.
- **[FATTO] Controlli e Joystick Flottante:**  
  Il joystick flottante (`canvas.onpointerdown`, `game/runtime.mjs:871`) risponde su qualsiasi punto libero dello schermo senza bloccare i pulsanti d'azione laterali. I comandi da tastiera per le azioni di gioco sono stati rimossi (`D39`), rendendo l'esperienza nativamente mobile.

---

## 4. Chrono Shift (3.2) & Discrepanze con il Prompt

- **[FATTO] Stato Attuale nel Codice (`game/campaign.mjs:276,386`, `game/runtime.mjs:1218`):**  
  Il codice implementa già la Perfect Dodge di Nox con rallentamento temporaneo (`s.shift = 0.6`, `edt = dt * 0.5`) e le abilità `nox_nova` (`shift: 0.8`) e `lulu_stasis` (`shift: 1.0`).
- **Valutazione Prompt §2.2 vs Decisioni (`D21`, `D29`):**  
  La versione formale del Chrono Shift ("nemici a ×0,5 per 36 frame, al massimo ogni 180 frame") richiede l'approvazione esplicita dell'autore prima di essere estesa in un sistema di congelamento, riavvolgimento ed eco temporale riusabile (M3).

---

## 5. Living City, Hubs, Guida, Gare & Prestazioni (3.3, §4, §5)

- **[FATTO] Hub e Missioni a Piedi (`game/hubs.mjs`, `game/missions.mjs`):**  
  Il gioco comprende 14 hub interattivi con negozi, fabbri e bacheche di incarichi. L'audit delle 44 tappe della campagna mostra 25 missioni a piedi (`foot`), 9 scene narrative (`scene`), 5 sessioni di guida (`drive`), 4 hub e 1 sequenza di fuga (`escape`).
- **[MISURATO] Prestazioni e Frame Budget:**  
  Il budget di frame target è **16,67 ms** (60 FPS). Le allocazioni all'interno dei cicli di tick (`fx`, `heroShots`, `shots`) devono essere monitorate per prevenire garbage collection stutter su dispositivi Android di fascia media.

---

## 6. Sistema di Salvataggio (`v4–v7`) & Sicurezza GitHub

- **[FATTO] Salvataggio (`game/progress-store.mjs`):**  
  La chiave di salvataggio attiva è `city-adventure-progress-v7` protetta da checksum FNV-1a32 UTF-16 con supporto per file `.backup`. Le versioni legacy (`v4`, `v5`, `v6`) richiedono attenzione esplicita nella pipeline di migrazione per garantire che i salvataggi esistenti non vengano invalidati.
- **[FATTO] Sicurezza Credenziali e Token (`CLAUDE.md` #2, `D66`):**  
  Nessun token di accesso GitHub o credenziale privata è memorizzato nei file di codice o nella documentazione. I token eventualmente incollati dall'utente nelle chat precedenti non sono stati utilizzati e vanno revocati/ruotati. La repository remota (`Flexati/adventure-city`, ramo `work/chronos-adventure-commercial`) verrà sincronizzata alla fine del progetto (`infine`) inizializzando correttamente la history git e collegandola al remote stabilito.

---

## 7. Piano Consigliato per M1 e Domande di Conferma

1. **Conferma per M1 (Architettura e Sgravio Byte):**  
   Avendo misurato `app.js` a `453.155 byte` (con un margine di soli ~5,6 KB rispetto al limite di guardia di `458.752 byte`), autorizziamo la pianificazione dello sgravio di stringhe o tabelle statiche verso `world.js` prima di procedere con lo sviluppo di M1 (Dual Link avanzato e combo).
2. **Conferma per Chrono Shift (M3):**  
   Confermiamo l'adozione formale della regola di Chrono Shift di Nox (nemici a ×0,5 per 36 frame, cooldown 180 frame) approvata in `D29`.

*Attendiamo il via libera dell'autore per procedere con la Milestone M1.*
