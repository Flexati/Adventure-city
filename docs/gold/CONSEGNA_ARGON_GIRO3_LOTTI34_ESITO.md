# Esito della consegna di Argon, giro 3, lotti 3 e 4 (12 novembre 2026)

Ramo di consegna `delivery/argon-asset-giro2-20261110`, da `f21e19d` a `10592a7` (due commit: `5857ac6`, `10592a7`; 24 file). Gli originali non sono stati modificati.
Ruoli che parlano: **Art/Audio Liaison** (controllo e registri), **QA Lead** (misure), **Tech Lead** (byte).

| Voce | Esito | Dove va | Prova |
|---|---|---|---|
| `JAGUAR_INTRO/jaguar_intro_keyart_16x9.png` (1920×1080) e `_9x16.png` (1080×1920) | **ACCETTATE E INTEGRATE** | sfondo dell'intro dello studio, due ritagli per orientamento | guardate intere: giaguaro bianco-argento in tempesta, fulmini fino ai bordi, nessun riquadro, nessun testo dipinto (il nome è testo del gioco). Registro `REGISTRO_ARGON_INTRO_20261112.json`; `tools/verify_studio_browser.cjs` (5 formati) |
| `A/sfx_special_duo_wave`, `sfx_special_black_pulse`, `sfx_special_barrier_deploy` | **INTEGRATI** (derivati a −1 dBFS) | eventi `duo`, `overdrive` (Black Pulse), `barrier` | decodificati in Chromium; `REGISTRO_ARGON_AUDIO_20261112.json` |
| `A/sfx_shop_open`, `sfx_smith_anvil_forge`, `sfx_npc_greet_warm` | **INTEGRATI** | apertura di negozio, fucina, incontro con un abitante | idem |
| `A/audio_intro_jaguar_storm.ogg` | **SCARTATO** | — | **[MISURATO]** riga spettrale persistente a 48 Hz nell'88 % delle finestre da 0,5 s (è il «ronzio» che l'autore ha chiesto di togliere) e 1 170 campioni oltre lo zero digitale |
| `A/sfx_melee_nox_slash`, `sfx_melee_lulu_strike` | **IN ATTESA** | — | il gioco non ha colpi in mischia (blueprint V10.4, vedi sotto) |
| `A/sfx_shop_buy_upgrade`, `sfx_relic_chime` | **NON USATI** | — | esistono già gli originali chrono `purchase`, `upgrade`, `relic` (D47) e non si sostituiscono |
| `A/sfx_alchemist_brew` | **IN ATTESA** | — | nel gioco non c'è un servizio «alchimista» |
| `A/title_theme.ogg` (rev 2) | **GIÀ NEL GIOCO** (commit `4d16af1` dell'altra sessione, file identico) | schermata del titolo | **[MISURATO] discrepanza:** il file decodificato ha picco 1,13 (+1,1 dBFS) e 147 campioni oltre lo zero, mentre `title_theme-metrics.json` dichiara −1,5 dBTP e zero campioni tagliati; il motore audio ha abbastanza margine di volume da non distorcere, ma la dichiarazione di Argon non è verificata. Il ronzio: nessuna riga persistente sotto i 400 Hz oltre il 29 % delle finestre (350 Hz, nota musicale). Da riascoltare su telefono |
| `T/palazzi_cathedral.png`, `T/palazzi_toxic.png` (rifatte) | **ACCETTATE, NON APPLICATE** | edifici dei distretti; entrano con il ridisegno delle mappe | guardate: otto edifici completi e riconoscibili, ognuno col suo carattere. **Difetto:** nel Bastione (cattedrale, in basso a destra) l'arco del portone lascia passare il magenta di fondo; da far correggere ad Argon prima dell'uso |
| `DESIGN_AAA/AAA_EXPANSION_BLUEPRINT_V10_4.json` | **PROPOSTA, NON APPROVATA** | — | introduce mischia a tre colpi, mosse speciali, negozi e villaggi ampliati: cambia il combattimento e l'economia, quindi serve una decisione dell'autore; con 4 618 byte di margine non c'è spazio per la mischia |
| `JAGUAR_INTRO` pilota (model sheet, marchio 64 px, wordmark) | già nel lotto precedente | — | usati solo come spunto; il nome dello studio resta testo del gioco |

## Cosa ha cambiato nel gioco

- **Intro dello studio rifatta** (D61): niente video, niente pulsanti «Salta» e «Audio», tre secondi e mezzo (1,2 s con «Riduci movimento»), un tocco la salta. Key art a tutto schermo con due lampi di tempesta fatti in CSS e il nome dello studio sotto. Il video dell'autore resta nel repo ma non entra più nel pacchetto Android (−5,6 MB). L'intro è muta: l'audio non può partire prima di un gesto dell'utente.
- **Sei suoni di Argon** sui loro eventi. Il motore ricade sul suono vecchio se un file manca.
- Peso: `app.js` 454 134 byte, margine 4 618 (`docs/gold/SIZE_LOG.md`).

## Ancora da Argon

`shadow_reaper_d`, `forge_behemoth_b` (golem di bronzo), gruppi M (6), V (16), G (12), F (6), il portone del Bastione senza magenta, i suoni dei boss e dell'ambiente (manifesto da 104 suoni: ne sono arrivati 13). Le case dei singoli villaggi **non** sono state generate: i palazzi di T sono dei distretti.
