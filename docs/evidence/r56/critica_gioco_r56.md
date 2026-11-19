# Critica di tutto il gioco — Chronos Adventure: Nox & Lulú (R56)

Data: 19 novembre 2026, notte (Europe/Rome). Codice: ramo `feat/act1-polish-r56` (parte da `feat/free-variant-iap` `8d9cf0c`, che contiene la PR #22 `5dd683f`).
Metodo: lettura del codice, dati strutturati di `game/missions.mjs` e `game/story-v08.mjs`, la stima durata già nel repo (`docs/evidence/r36/PLAYTIME_ESTIMATE_R35.md`), 83 schermate dell'Atto I già prese (`/workspace/analisi_cap1/shots`), una nuova partita guidata dal bot (`play_act1_r56.cjs`), le skill di gamedev (game-feel, game-ui-ux, camera-systems, performance-optimization, level-design, dialogue-systems, audio-design, game-ai, visual-novel).

## 0. Cosa NON so (leggi prima)

- **Nessun giocatore vero ha giocato questa build.** Tutti i tempi «umani» sono un modello (`tools/estimate_playtime.mjs`: 180 parole/min, 1,2 s per avanzamento, 3 s a scelta), non una misura.
- **Audio**: non ascoltabile in headless; i 91 file non sono mai stati ascoltati da una persona (`docs/gold/AUDIO_PLAN_V10_3.md`: «Nessun brano è approvato all'ascolto umano»). Nessun giudizio sul suono.
- **Fluidità reale su telefono, nausea da scossa, comfort dei comandi**: non verificabili qui.
- Atti II–IV: li ho giudicati dai dati strutturali (missioni, nemici, testi, stima durata), **non rigiocati a mano**. Le voci sono marcate [DATI] (misurate dal codice) o [STIMA].

## 1. Classifica dei difetti (per impatto sul giocatore e sulla conversione)

Stato: **FATTO** = corretto in questa PR; **PARZIALE**; **RESTA** = non fatto (motivo in §5).

| # | Area | Difetto | Prova | Stato |
|---|---|---|---|---|
| 1 | Ritmo Atto I | Il **primo sparo arriva troppo tardi**: modello 102,8 s (obiettivo 60–90): 17 battute / 150 parole / 3 schede / 1 scelta prima di poter sparare | `r56_shots/ttfs_before.json`; `game/runtime.mjs` (prima) righe 160 (schede 2,6 s/4,2 s) e 241 (`say(pre)` bloccante) | **FATTO** → 86,6 s (14 battute, 123 parole) |
| 2 | Gancio/paywall | Il **teaser** (la scena più importante dell'Atto I) stava su **sfondo nero**, con il toast «Bottino +30 monete» rimasto sopra | `shots/q_017`, `q_018`; `runtime.mjs` (prima) riga 206 | **FATTO**: arte della breccia (`art/atti/atto_2.webp`, già nel pacchetto), toast pulito |
| 3 | Gancio | **Due ganci in competizione**: l'ultima battuta di Veyra («Adesso fatemi vedere se sapete anche guidarla») punta alla guida, il teaser alla breccia | `story-v08.mjs` `docks_veyra_end`; `FREE_TEASER_LINES` | **FATTO** nell'app gratuita (la riga non viene detta; nessun testo cambiato; l'app a pagamento la tiene) |
| 4 | Atto III | **13 tappe a piedi su 19** con lo stesso schema («raccogli N nodi + 3–4 ondate»); 11 compiti su 25 si chiamano «Apri …» | [DATI] `FOOT[*].task`, `waves` | RESTA (design, vedi `prompts_r56/05`) |
| 5 | Nemici | In **tutto il gioco** i nemici base sono **5** (raider, breaker, signal, shooter, brute). Atto III: 45 raider + 43 shooter + 31 breaker + 19 signal + 19 brute (+4 speciali) | [DATI] conteggio ondate di `FOOT` | RESTA (`prompts_r56/07`) |
| 6 | Atto IV | Il **finale ha un solo combattimento** (Archon 575 PV, 8 nemici); 5 tappe su 7 sono scene. `aftermath`: 355 parole / 41 avanzamenti, 2,8 min senza interazione | [DATI] `CAMPAIGN` Atto 4; stima r35 | RESTA (`prompts_r56/03`, `05`) |
| 7 | Atto I | **«Blackout» non ha il buio**: la mappa era illuminata uguale a 0/3 e 3/3 relè | `runtime.mjs` (prima) riga 1359: `drawDark` solo con `c.dark` o `rookDark` (solo `below` e `archive`) | **FATTO**: buio .66 a 0/3 → .14 a 3/3, pozze di luce ai relè accesi |
| 8 | HUD | Barks, toast e barra boss **si sovrappongono** e coprono «Bagaglio»; testo del bark tagliato dal toast | `shots/s1_011`, `s1_012` | **FATTO** (un solo canale: toast sotto il bark; bark a sinistra in boss fight). Verifica: `tools/verify_act1_polish_r56.cjs` |
| 9 | Game feel | **Scossa schermo con `Math.random()` a ogni frame** (4 punti di disegno) e, in 10 punti, `shake=N` che **sovrascrive** invece di sommare | `runtime.mjs` (prima) righe 452, 1358, 1369, 1387; 428, 1092, 1103 | **FATTO**: somme limitate (tetto 12), offset a somma di seni, 0 con `reduced` |
| 10 | Guida | Una sola autostrada, nessuna linea di velocità, nessuna scintilla, auto del giocatore poco staccata dal traffico | `shots/p_037`, `p_039` | **PARZIALE/FATTO**: linee di velocità (fisse, nessun random), scintille all'urto, alone ciano sull'auto; resta una sola strada (asset) |
| 11 | Leggibilità | Eroi alti ~55–70 px su 412 px, Lulú (giacca verde) poco staccata dal suolo | `shots/p_025`, `s4_012` | **PARZIALE**: ombra a terra più scura, alone più forte, anello sottile sul partner. Contorno vero = asset (RESTA) |
| 12 | Sblocco | Gerarchia debole: pulsante sotto la lista, nessuna arte, atti bloccati solo testo | `shots/q_020` | **FATTO**: arte in testa, acquisto subito sotto il testo (dentro la prima schermata: 314–370 px su 860), tre atti con la loro arte. (Il pulsante «grigio» del primo rilievo era un artefatto di cattura a metà animazione: `shot_unlock.cjs` lo mostra a regime.) |
| 13 | Schede tappa | «Tappa 3/44», 12 px, opacità 60 %: non dice quanto manca nell'atto | `style.css` righe 93–95 | **FATTO**: «Atto 1 · Tappa 3 di 6», 14 px; schede 1,5 s (2,8 s con obiettivo) invece di 2,6/4,2 s |
| 14 | Atto I | La scena `home` è passiva: 7 battute (≈85 parole) + scelta della tazza + 4 battute di reazione, 36 s modellati senza gioco | `story-v08.mjs` `home` | RESTA: tagliare richiede un tuo OK sul testo |
| 15 | Dialoghi | **Non c'è «Salta»** (solo `credits-skip`): chi rigioca o ha fretta tocca tutto | `runtime.mjs` riga ~811; `say()` | RESTA (`prompts_r56/08`) |
| 16 | Durata totale | ≈72 min (r35, modello probabile: Atto I 7,7 · II 20,5 · III 34,9 · IV 9,3) contro l'obiettivo dell'autore 105–120 min. L'Atto gratuito è l'11 % | [DATI] stima r35 | RESTA: dichiarare il tempo vero ai tester; non gonfiare |
| 17 | Grafica | Tre stili insieme (menu dipinto, sprite pixel-art, cornici in bronzo steampunk) | `shots/p_001`, `p_031`, `p_025` | RESTA (proposta asset, `prompts_r56/01`) |
| 18 | Comandi porto | 5–6 controlli in basso nel porto, terzo inferiore affollato | `shots/q_010` | RESTA |
| 19 | Sblocco | «6 tappe su 44 / 38 ancora da giocare» comunica «hai giocato poco»; nessun riepilogo delle scelte | `STORE_TEXT` | RESTA (nuovo testo = tuo OK) |
| 20 | Audio | Non valutabile | – | NON VERIFICABILE |

**Punti di forza da non rovinare** (conta anche questo): dialoghi concisi — 171 battute uniche, media 7,9 parole, massimo 24, nessuna oltre 25 [DATI]; apertura Morse («Due colpi») originale; barra boss di Rook; tono e personaggi coerenti; tempi di combattimento/hitbox protetti dalla regola 4/D75 (non toccati); salvataggio con copia di backup e recupero errori; prestazioni ottime (vedi §4).

## 2. Narrativa, livelli, nemici (Atti I–IV) — giudizio duro

- **Atto I** funziona come prologo scritto bene, meno come dimostrazione del combattimento: l'azione vera è ~4–7 min su 9–15. Il boss Rook (60 PV) è il pezzo migliore. Dopo la correzione n. 1 il primo sparo è nel primo minuto e mezzo circa (modello).
- **Atto II** (12 tappe, ~20 min): alterna guida/a piedi/scena ed è il più vario (3 guide, 6 a piedi, 2 scene, hub Cathedral); ha 3 boss (Anchor 112, Tiranno 325, Custode 375). Rischio: «Scorta/Attiva/Spegni N» ripetuti.
- **Atto III** (19 tappe, ~35 min): il cuore del gioco ma il più ripetitivo (13 a piedi). La separazione Nox/Lulú è una buona idea, ma la meccanica non la sfrutta: lo schema delle tappe resta lo stesso. Boss: Behemoth 265, Mirror 238, Reaper 250, Vega 265.
- **Atto IV** (7 tappe, ~9 min): climax corto e quasi tutto parlato; il solo combattimento è Archon (575 PV). Il finale (cinque finali, `aftermath`) è lungo da leggere ma non da giocare.
- **Nemici/IA** [DATI]: 5 tipi base per 25 stage; la difficoltà cresce con più unità e più PV, non con comportamenti nuovi. Non ho misurato l'IA dei boss in questo giro; `qa:foes` e i test esistenti passano.
- **Livelli**: curva tensione/riposo irregolare nell'Atto III (4 hub in tutto il gioco, 2 nell'Atto III); `line` è la tappa più lunga (6 ondate, 17 nemici, ~3,9 min).

## 3. Grafica (verso lo standard AAA mobile) — cosa ho fatto e cosa è solo proposta

Fatto (tutto in codice, sicuro per le prestazioni, nessun asset nuovo):
1. **Buio di Blackout** con luce che torna a ogni relè + alone caldo additivo sui relè accesi.
2. **Color grade per atto**: vignetta pre-renderizzata (una per atto: I teal freddo, II magenta, III ambra, IV oro pallido), un solo `drawImage` per frame.
3. **26 particelle di polvere/lucciole** su traiettorie a seni fissi (nessun `Math.random`, nessuna con «ridurre movimento»).
4. **Guida**: linee di velocità, scintille all'urto, alone ciano sull'auto del giocatore.
5. **Teaser e sblocco con arte** (`atto_2/3/4.webp`, già nel pacchetto: nessun peso aggiunto), deriva lenta della camera sul teaser (ferma con «ridurre movimento»).
6. **Leggibilità**: ombra a terra più scura, alone più forte, anello sul partner.
7. **Scossa** a somma di seni con tetto, **un solo canale di messaggi**, schede più leggibili.

**Non fatto di proposito (troppo costoso o rischioso in questo giro):** contorni/«rim light» veri sugli sprite (richiedono sheet nuovi: i personaggi vanno solo «modificati», non ridisegnati, `ASSET_NECESSARI.md` righe 127), parallax di sfondo nella guida (serve una strada a livelli), shader WebGL (il gioco è su canvas 2D; un passaggio WebGL sarebbe un rischio sulle WebView economiche), nuove strade/ambientazioni, arte per il finale. Tutto è descritto nei file `prompts_r56/01` e `02`.

## 4. Prestazioni e vincoli (misure)

- `app.js`: 409 778 B (prima) → ~415 000 B (dopo): sotto 524 288 B e sotto la guardia del test (458 752 B).
- Frame p95 (`verify_performance_v09.cjs`, Chromium software, 360×800 … 844×390, throttle CPU 1× e 4×): **dopo la passata grafica**: massimo p95 7,0 ms a CPU 1× e 12,4 ms a CPU 4× (scena «finale», 390×844), limite 16 ms. Passa tutto (`perf=0`). Misure in software rendering: su telefono vero conviene ricontrollare.
- Nessun testo di storia scritto o cambiato (vedi PR: «da approvare»: nessuno; l'unico testo nuovo è l'etichetta UI «Atto N · Tappa x di y», con la traduzione «Act N · Stage x of y»).

## 5. Cosa resta e perché

Tagliare `home` e riscrivere ganci (testo = tuo OK) · pulsante «Salta» (UX nuova: va progettata) · varietà di nemici e di stage nell'Atto III/IV (design e asset) · rim light/contorni e parallax (asset) · comandi del porto · riepilogo scelte nella schermata di sblocco (testo nuovo) · audio (serve un ascolto umano) · prova d'acquisto reale su telefono.


## Verifiche finali (R56)
Lint 0 errori · 652/652 test · prepare_android_assets · campagna A/B/C complete (44 tappe, finale) · variante gratuita verificata · `app.js` 415.022 B (< 524.288) · `verify_release_flow.cjs`: restano 2 controlli rossi già rossi prima di R56 (il browser di test parte in inglese e controllano testo italiano); non toccati.
Immagini prima/dopo: `r56_shots/prima_dopo_*.png` (teaser, sblocco, Blackout 0/3, guida). Le altre scene non sono confrontabili 1:1 e non sono state accoppiate.
