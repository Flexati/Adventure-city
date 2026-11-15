# Direzione di gioco — Release candidate 2 (debug)

> **Nota (M5, 4 novembre 2026):** documento storico, non riscritto. Il prezzo ufficiale è **5,99 €**, acquisto unico (D18 in [DECISIONI.md](../../../gold/DECISIONI.md)). Dove qui si legge 4,99 € vale 5,99 €.

Branch: **ccr-02793d11-6genwh** su Flexati/Adventure-city. Base: `art/chrono-shadows-production`
al commit verificato `75e8452`, unita senza conflitti a `main` (`e1dbc13`), quindi v0.9 e
integrazione artistica sono entrambe presenti. **RELEASE_GATE: BLOCKED** (vedi sotto).

Metodo: STRIKE loop. Ogni modifica nasce da un difetto osservato nel gioco reale, ha un test o
una prova nel runtime, ed è stata rigiocata.

## Cosa ho visto giocando (prima)

| Osservazione nella build `75e8452` | Prova |
|---|---|
| In quasi ogni missione il protagonista parte **dietro i pulsanti touch** (Lulù sotto RISONANZA, Nox sotto BLACK PULSE): la camera era vincolata al bordo mappa e l'inizio è in basso | [Breccia](img/before-breach-390.png), [Finale](img/before-finale-390.png) |
| L'obiettivo testuale delle missioni a dispositivi **non veniva mai mostrato**: HUD `Ancora 0/3 · nemici 2`, dove "Ancora" (àncora) si legge "ancora/di nuovo" | [observe-before.json](observe-before.json) |
| La card di tappa diceva chi guida, ma non cosa fare né che il gioco aveva salvato | [card Finale](img/before-finale-card-390.png) |
| Una sconfitta contro un boss obbligava a rifare dispositivi, ondate e boss; il testo non spiegava perché si era caduti | codice `onFootEnd` |
| EVE-Prime alzava la guardia appena sveglia: il suo "ritmo" contava i colpi sparati ai nemici **prima** dello scontro. Nella baseline B entrambe le sconfitte erano all'Archivio | [baseline B](campaign-b-baseline.json), test dedicato |
| La difesa dell'Atto II diceva "Difendi il cancello" mentre la zona era RIFUGIO/OFFICINA secondo la scelta del Blackout | [observe-before.json](observe-before.json) |
| Avvisi importanti sovrascritti in pochi millisecondi dal successivo | release-flow Archivio, primo passaggio |

## Cosa è cambiato, concretamente giocabile

- **Inquadratura:** il protagonista sta nella fascia libera fra HUD e comandi; al bordo del mondo
  scorre la mappa, non l'eroe. Nelle campagne A/B/C: **0 frame su 11.810** con l'eroe sotto i comandi
  o con la testa sotto l'HUD ([A](campaign-a.json), [B](campaign-b.json), [C](campaign-c.json)).
- **Card di tappa:** obiettivo (per le guide il brief con i comandi), `Tappa N/20` e
  `✓ Progressi salvati` solo se il salvataggio è riuscito davvero. Senza numero di missione nel titolo.
  [360×800](img/after-evacuation-card-360.png) · [412×915](img/after-finale-card-412.png)
- **HUD:** verbo + progresso (`Chiudi le ancore 1/3 · 2 nemici`), `Elimina gli ultimi nemici · N`
  quando mancano solo nemici, `Difendi il rifugio/l'officina` coerente con la scelta.
  [Breccia](img/after-breach-390.png) · [Finale](img/after-finale-390.png) · [Porto 360](img/after-port-360.png)
- **Checkpoint boss:** al risveglio di Custode, EVE-Prime o Archon il gioco salva e lo dice
  ([avviso](img/checkpoint-notice-archive.png)). Sconfitta, Riprova o chiusura dell'app riprendono dallo
  scontro con dispositivi attivi e salute piena ([ripresa](img/retry-at-boss-finale.png)).
  Campo opzionale nel salvataggio v6: le build precedenti lo ignorano, un valore non valido viene
  scartato senza perdere il salvataggio, completare la tappa lo azzera.
- **Sconfitta che insegna:** dice da dove si riparte e dà un solo consiglio basato sull'ultimo colpo
  subito (cerchio, carica o proiettile). [Esempio](img/defeat-tip-finale.png)
- **EVE-Prime equa:** legge il ritmo solo del proprio scontro.
- **Avvisi:** restano leggibili almeno 1,4 s; il successivo attende invece di cancellarli.
- Concordanza: "EVE-PRIME si è svegliat**a**".

## Interventi narrativi e motivazione

Nessuna battuta, scelta o finale è stato riscritto: la scrittura di Nox e Lulù, le sette scelte e il
termometro del rapporto restano intatti. Gli interventi riguardano la **leggibilità della conseguenza**:
la missione di Lulù nell'Atto II ora nomina il luogo rimasto al buio per la scelta fatta nel Blackout,
così il giocatore riconosce l'effetto della propria decisione nell'obiettivo stesso. Il checkpoint e
il consiglio di sconfitta riducono la ripetizione punitiva prima dei tre momenti più importanti della
storia (Ora zero, Archivio EVE, Ora uno), dove la frustrazione rompeva il ritmo. Il colpo finale resta
del giocatore anche dopo la ripresa (verificato).

Valutato e **non** cambiato: Risalita e Ora uno sono missioni a dispositivi consecutive con Nox, ma su
geometrie diverse (asse/arena) e con ruolo di "salita prima del climax". Senza un test con persone non
ho prove sufficienti per rifarne la struttura: resta una criticità da misurare nel test cieco.

## Verifiche eseguite (ambiente: container Linux, Chromium 141 headless)

| Prova | Esito |
|---|---|
| `npm test` | **85/85 PASS**, zero skip ([log](tests.txt)); 11 test nuovi in `tests/release-flow.test.mjs` |
| Campagna completa A/B/C nel browser, input reali, clock accelerato | **20/20 ciascuna**, zero errori. A: 1 sconfitta, finale **fragile** (44). B: 1 sconfitta, **caldo** (66). C: 0 sconfitte, **esitante** (49) |
| Baseline prima delle modifiche | A: 2 sconfitte (Archivio, Linea); B: 2 sconfitte (entrambe Archivio) ([A](campaign-a-baseline.json), [B](campaign-b-baseline.json)) |
| Flusso boss nel runtime (13 controlli) | Ora zero, Archivio, Finale: **13/13** ciascuno ([finale](release-flow-finale.json), [zero](release-flow-zero.json), [archivio](release-flow-archive.json)) |
| Stesso flusso sul **bundle classico preparato per l'APK** | **13/13** ([report](release-flow-bundle.json)). È Chromium, non WebView Android |
| Osservazione di tutte le 16 tappe giocabili | 360×800, 390×844, 412×915: zero errori di pagina ([360](observe-360.json), [390](observe-after.json), [412](observe-412.json)) |
| APK debug | Build con SDK 35/build-tools 35.0.0 e JDK 21 standard (`--release 8`), firma v2/v3, zipalign PASS |
| **Emulatore Android API 35, WebView reale (CI)** | **PASS** — [run #39687984453](https://github.com/Flexati/Adventure-city/actions/runs/39687984453) sul commit `08c7301`: 85 test, build APK, avvio a freddo 5,2 s, tocchi fidati, audio attivo e ripreso dopo pausa/ripresa nativa, movimento, pausa, 4 viewport, zero `FATAL EXCEPTION`. [Prova](android-emulator/android-renderer-proof.json), [gameplay](android-emulator/city-adventure-gameplay.png). Uscita audio dell'emulatore disabilitata: stato audio, non ascolto |

Le durate dei bot (277–319 s di clock accelerato) **non** sono durate umane né prove di FPS.

**Non eseguiti:** telefono fisico, ascolto umano, test cieco con persone. L'emulatore non gira nel
container (nessun KVM): è stato eseguito in CI. Per farlo arrivare all'emulatore ho corretto il workflow:
mancava `npm ci` (il test Chrono richiede `pngjs`) e l'AVD non entrava nel disco del runner
(partizione dati ridotta a 2 GB). L'APK della CI ha firma di debug diversa da quello locale.

## APK

[Adventure_City_rc2_debug.apk](../../../../artifacts/chrono_shadows/Adventure_City_rc2_debug.apk) —
`0.9-rc.2-debug`, versionCode 11, **44.754.400 byte** (+4.096 rispetto all'APK Chrono precedente),
SHA-256 `869d5b856b26f931bd33946640bbbbe736157e639cc0be21520fd24b0d929c10`. Firma di debug, non di produzione.

## Criticità residue

1. **Play Store:** dal 31 agosto 2026 le nuove app devono avere target **API 36**; il manifest è a 35.
   Il package è `com.cityadventure.pizzaprotocol.debug` con `debuggable=true`: serve un applicationId
   definitivo (scelta permanente del titolare), build release firmata con chiave di upload e **AAB**.
   Vedi [checklist](../../../PLAY_RELEASE_CHECKLIST.md).
2. Nessuna prova su telefono fisico: tocchi su vetro, notch, audio su speaker/cuffie, termica, FPS sostenuti.
3. Nessun test con persone: comprensione dei primi 10 minuti, durata reale, valore percepito a 4,99 €.
4. L'avviso di checkpoint copre per circa 3 s la parte alta della barra del boss.
5. Le risorse Chrono di riserva (NPC, alleati, negozi, altri boss) restano riserve: nessuna funzione
   è presentata come esistente.
