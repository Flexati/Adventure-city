# AUDIO_PLAN_V10_3.md: piano suoni e musiche

**Stato:** APPROVATO dall'autore («Approvo prosegui», 2026-10-31).
**Blocco:** `COMMERCIAL_RELEASE = BLOCKED`. Nessun brano è approvato all'ascolto umano e nessun diritto commerciale è verificato.
**Obiettivo:** una colonna sonora che accompagni 120 minuti senza stancare, che renda riconoscibili Nox e Lulù e che faccia sentire il ricongiungimento come un arrivo.

---

## 1. Com'è oggi (misurato, 2026-10-31)

| Voce | Dato |
|---|---|
| Tappe della campagna | 31 |
| Brani musicali diversi in campagna (prima di questo piano) | 12, con anelli da 40–60 s |
| `reunion` sentito **prima** del ricongiungimento | in 4 tappe (casa, Moon Refuge, tetto, Cattedrale) e in tutti gli hub di Nox |
| `driving` | lo stesso anello di 42 s per 5 tappe di guida |
| `danger` | 5 tappe (separazione, archivio, finale, crollo, post-credits) |
| Boss con tema proprio | Rook (`rook_line`) e The Anchor (`anchor_fight_loop`); Custode e Archon no |
| Effetti | 35 file v10 e 28 chrono, più quelli sintetizzati dal motore; mancano stinger di vittoria, sconfitta e capitolo |
| Volume integrato | azione circa −15 LUFS; `chalk_route` −20 LUFS, quindi troppo basso rispetto al resto |
| Registro (`AUDIO_REGISTER.json`) | 129 voci, tutte `PENDING`, licenza `UNVERIFIED` |

**I tre problemi che contano per il successo:**
1. **Il tema del ricongiungimento è bruciato.** Lo si sente dal secondo minuto, quindi alla scena «Posso venire con te?» non ha più forza.
2. **Ripetizione.** Su 120 minuti un anello da 42 s ripetuto per 5 guide si sente decine di volte. È la prima cosa che i giocatori segnalano nelle recensioni.
3. **Nessuna identità musicale dei personaggi.** I temi `nox` e `lulu` esistono, ma non condividono materiale. Non c'è una melodia che il giocatore possa riconoscere e canticchiare.

## 2. Direzione: un sistema di leitmotiv

Quattro melodie brevi, sempre le stesse, variate per strumento, tempo e armonia. Le giornate cambiano, le melodie restano: il giocatore le riconosce senza saperlo.

| Motivo | Note | Carattere | Dove |
|---|---|---|---|
| **NOX** | Re3 Fa3 La3 Sol3 · Fa3 Re3 (lunga-breve-breve, scende e si posa) | registro grave, pianoforte o basso, re minore | tappe di Nox, guida, Below |
| **LULÙ** | La4 Do5 Mi5 Re5 · Mi5 Sol5 (sale, si sporge in avanti) | registro acuto, campane e mallet | tappe di Lulù, città, porto |
| **PROMESSA** | i due motivi si rispondono e si fermano su un accordo sospeso (La sus4), senza risolvere | intimo, il ticchettio dell'orologio della Vortex | tetto, eco al clinico |
| **EVE** | intervalli di vetro, il tic-tac a 60 al minuto della lancetta del menu | freddo, preciso | archivio, Glass Flood, Shadow Reaper, finale |

**Regola d'oro:** la PROMESSA si risolve una volta sola, nel ricongiungimento. Il tema `reunion` si sente solo da `reunion` in poi. Un test lo controlla (`tests/audio-leitmotifs-v10_3.test.mjs`).

## 3. Mappa musicale per tappa (obiettivo)

| Atto | Tappa | Oggi | Obiettivo | Stato |
|---|---|---|---|---|
| Menu | menu con orologio | `title` | `title` più il tic-tac EVE a tempo con la lancetta dei secondi | M-A4 |
| I | opening | `title` | invariato | — |
| I | home | `reunion` | `refuge_theme` | **FATTO** |
| I | blackout | `blackout`, poi `rook_line` | invariato | — |
| I | escape | `driving` | `drive_nox_a` (vedi 4) | M-A2 |
| I | moon (hub) | `reunion` | `refuge_theme` | **FATTO** |
| I | docks_veyra (nuova) | — | `veyra_docks` e le gare già presenti | con le tavole |
| II | breach | `breach`, poi `anchor_fight_loop` | invariato | — |
| II | signal | `driving` | `drive_nox_b` | M-A2 |
| II | rooftop e promise | `reunion` | `promise_theme` | **FATTO** |
| II | cathedral (hub) | `reunion` | `refuge_theme` | **FATTO** |
| II | contagion | `contagion` | invariato | — |
| II | evacuation | `driving` | `drive_urgent` | M-A2 |
| II | zero | `zero` | aggiungere lo strato `custode_boss` all'ingresso del Custode | M-A3 |
| II | separation | `danger` | `fracture`: il motivo PROMESSA spezzato a metà | M-A3 |
| III | chalk, below, city, port | percorsi | invariati, `chalk_route` portato a −17 LUFS | M-A1b |
| III | glass_flood, glass_reaper (nuove) | — | `glass_tide`, `shadow_reaper` (motivo EVE) | con le tavole |
| III | vega_approach, vega (nuove) | — | `vega_rhythm`: metronomo rigido che Lulù deve rompere | con le tavole |
| III | ring, tunnel | `driving` | `drive_lulu`, `drive_night` | M-A2 |
| III | archive | `danger` | `eve_archive` (motivo EVE) | M-A3 |
| IV | reunion | `reunion` | `reunion` con la PROMESSA finalmente risolta | M-A3 |
| IV | finale, collapse | `danger` | `archon_boss` e `collapse_run` | M-A3 |
| IV | aftermath, rooftop_end, credits | `reunion` | invariati; titoli di coda con suite dei quattro motivi | M-A5 |

## 4. Musica adattiva (sul motore esistente)

Il motore `AudioDirector` mantiene già al massimo due flussi, con dissolvenza di 2,2 s, abbassamento della musica sotto i dialoghi e il passaggio a `danger` quando il giocatore è minacciato. Si aggiunge, senza cambiare hitbox né tempi di gioco:

- **Varianti di guida:** 5 brani diversi al posto di uno; lo stesso tempo (120 BPM) e la stessa tonalità, quindi le dissolvenze restano pulite.
- **Fase 2 dei boss:** sotto il 50% di salute il brano passa a una variante più densa, sullo stesso evento che oggi fa partire le battute `phaseN`.
- **Stinger (2–4 s):** vittoria, sconfitta, scelta confermata, nuovo capitolo, oggetto raro, gara vinta e gara persa. Si sentono sopra la musica abbassata.
- **Silenzio come strumento:** 3 s senza musica prima delle battute decisive (la firma, «Posso venire con te?»).

## 5. Effetti sonori da aggiungere

| Gruppo | Effetti | Priorità |
|---|---|---|
| Interfaccia | tocco su pulsante più caldo, scelta confermata, scelta a tre opzioni, apertura del menu, tic-tac dell'orologio | P1 |
| Narrativa | saldatura della Vortex (promessa), radio di Unità 9, firma EVE-47 | P1 |
| Passi | per superficie: asfalto, metallo, acqua (Glass Flood), vetro | P2 |
| Boss nuovi | Shadow Reaper (eco dei futuri falsi, colpo vero), Vega (metronomo, colpo al centro) | con le tavole |
| Mondo | gru del porto, marea, folla degli hub | P2 |

## 6. Mix e consegna tecnica

| Regola | Valore |
|---|---|
| Volume integrato | azione −15 LUFS ±1; brani calmi −17 LUFS ±1; stinger −14 |
| Picco | sotto −1 dBTP, zero campioni saturati |
| Anelli | giunzione con gradino sotto 0,02 (misurato dal compositore) |
| Formato | Ogg Vorbis q4, 44,1 kHz stereo; master FLAC in `assets/production/` |
| Spazio | oggi 7,0 MB di audio; tetto per V10.3: +15 MB in tutto |
| Android | ogni file nuovo va aggiunto a `AssetRoutes.java` (lo controlla il test) |

## 7. Come si produce e chi ne ha i diritti

1. **Default:** sintesi originale deterministica con gli strumenti del progetto (`tools/compose_*.py`). La partitura è scritta qui, senza campioni, registrazioni, servizi esterni o imitazioni di artisti. I diritti restano `COMMERCIAL_REVIEW_PENDING` finché qualcuno non li esamina.
2. **Raccomandato per un gioco a 5,99 €:** un compositore umano per tema principale, ricongiungimento e titoli di coda. I motivi del punto 2 diventano il suo brief, e i brani sintetizzati restano come riferimento e come riserva.
3. **Generatori musicali IA esterni:** solo se l'autore lo decide e dopo aver verificato per iscritto la licenza commerciale del piano usato. Qui non se ne usa nessuno.

Nessun brano viene dichiarato «pronto» senza un ascolto umano annotato in `listening_evidence`.

## 8. Milestone

| ID | Contenuto | Asset esterni | Stato |
|---|---|---|---|
| **M-A1** | Leitmotiv: `refuge_theme` e `promise_theme`; `reunion` riservato; test e verifica nel browser | no | **FATTO** |
| M-A1b | Riportare `chalk_route` da −20 a −17 LUFS | no | prossima |
| M-A2 | 5 varianti di guida sui motivi NOX e LULÙ | no | prossima |
| M-A3 | `fracture`, `eve_archive`, `custode_boss`, `archon_boss`, `collapse_run`, `reunion` con la PROMESSA risolta, fase 2 dei boss | no | dopo M-A2 |
| M-A4 | Stinger, effetti P1, tic-tac del menu sincronizzato con la lancetta CSS | no | dopo M-A3 |
| M-A5 | Brani delle tappe nuove (`veyra_docks`, `glass_tide`, `shadow_reaper`, `vega_rhythm`) e suite dei titoli di coda | quando arrivano le tavole GPT delle tappe | in attesa |
| M-A6 | Ascolto umano su telefono, con cuffie e altoparlante, poi revisione dei diritti | persone | in attesa |

## 9. Verifica a ogni milestone

- `npm test`, più i test dei leitmotiv (riserva di `reunion`, file presenti, rotte Android, giunzione e saturazione).
- `node tools/verify_leitmotifs_browser.cjs <url>`: il brano giusto parte nelle tappe giuste, senza errori di pagina e con al massimo 2 flussi.
- Le metriche di ogni brano (`assets/production/v10.3/audio/*-metrics.json`) dichiarano sempre `human_listening: false` finché non c'è un ascolto vero.
