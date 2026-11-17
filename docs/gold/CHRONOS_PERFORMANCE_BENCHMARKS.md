# CHRONOS — Misure di prestazione

**Che cosa sono queste misure.** Chromium headless con rendering software, sulla macchina di questa sessione o sulle macchine della CI di GitHub. **[FATTO] Non sono misure su un telefono:** nessun dispositivo Android era collegato, e la prova su telefono resta uno dei blocchi del rilascio. Il limite del test è un p95 del costo del fotogramma sotto 16 ms (`tools/verify_performance_v09.cjs`); la CPU rallentata 4× è uno scenario di stress, non un equivalente di un telefono preciso.

## 1. Peso [MISURATO, `python3 tools/prepare_android_assets.py`, 17 novembre]

| Parte | Byte | Limite |
|---|---|---|
| `app.js` | 456 320 | guardia dei test 458 752; tetto 524 288 |
| `world.js` | 152 316 | — |
| `en.js` | 171 772 | — |
| JavaScript in tutto | 783 037 | — |
| Cartella del gioco impacchettata | 106 274 482 (331 file) | — |
| Audio impacchettato | 15 759 805 (di cui 15 brani R38: circa 14,5 MB) | colonna sonora sotto 16 MB (test) |

L'ultimo APK costruito (`dist/`, 15 novembre, versione 44) pesa 101 025 732 byte. Il prossimo APK cresce di circa 6 MB: la colonna sonora nuova sostituisce tracce più leggere [IPOTESI, stima dalla differenza della cartella audio].

## 2. Il caso critico: «below» con CPU 4× [MISURATO]

| Versione | p95 a 390×844 (giri locali) | Fonte |
|---|---|---|
| R37 (`a0815be`) | 9,8 / 11,2 ms | modalità `probe` |
| Base dell'autore `a9e3afd` | 13,0 / 13,7 ms | idem |
| Fusione, prima dei tagli | 13,7 / 14,4 ms | idem |
| Dopo il taglio delle celle (`4032efd`) | 11,3 / 15,7 ms | idem |
| Dopo il taglio di particelle e forzieri (`ad8a543`) | 11,6 / 11,8 / 12,0 ms | idem |
| Le due funzioni nuove spente (prova di controllo) | 8,4 / 11,4 / 11,4 ms | idem |

- **CI di GitHub, «below», CPU 4×.**
  - `bea86f3` non conta: è caduta prima per un altro motivo.
  - `c404731`: 16,5 ms a 360×800 e 18,3 ms a 412×915, fallita.
  - `4032efd`: 14,3 / 15,1 / 16,7 / 10,2 ms nei quattro formati, fallita su 412×915.
  - `ad8a543`: PASS.
- **Profilo dei tempi inclusivi [MISURATO, profilatore di Chromium, 412×915, CPU 4×].** `drawWorld` costa 91 ms/s contro i 60 di R37. `drawCombatMapLife` (19 ms/s) e `drawTreasureChest3D` (11 ms/s), arrivate con la base, spiegano la differenza.
- **Conclusione.** Il margine sul limite è sottile su schermi alti. Un'ottimizzazione più profonda del «mondo vivo» della mappa è il prossimo passo se il telefono vero lo conferma.

## 3. Le altre missioni, CPU 1× e 4× [MISURATO, CI su `c404731` e `4032efd`]

- **CPU 1×.** Tutte le 17 missioni campione nei 4 formati sono fra 0,4 e 9,9 ms di p95. La più pesante è «below», a 360×800.
- **CPU 4×.** «archive» sta fra 7,5 e 15,4 ms (15,4 a 844×390, giro di `c404731`); «finale» fra 10,2 e 11,7 ms; «tunnel», «toxic», «clockwork» e «collapse» restano sotto 5 ms.

## 4. Non misurato in questa sessione

- FPS su un telefono vero.
- Temperatura e batteria.
- Memoria del WebView su un dispositivo.
- Tempo di avvio su Android.
- La sessione lunga di 3 minuti di fuoco (`tools/verify_long_fire_r36.cjs`) non è stata rieseguita sull'albero finale: nella batteria era partita con argomenti sbagliati (errore mio). L'ultima misura valida è di R36, su un albero precedente.
