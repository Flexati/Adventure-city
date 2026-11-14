# CHRONOS Adventure: Nox & Lulù — Piano dalla A alla Z per il Play Store

**Data:** 14 novembre 2026. **Decisioni:** D74, D75 (vince la più recente). **Base:** `d3ea80d` → ramo `ccr-022499ad-zq9iu5` (Fase 0).
**Convenzione:** [FATTO] con fonte · [MISURATO] con comando · [IPOTESI] con motivo. Un bot o un agente non è una persona, Chromium non è un telefono.
**Stato di partenza:** `COMMERCIAL_RELEASE = BLOCKED` (0 playtest su 5, nessuna prova su telefono registrata, acquisto Play non collegato, firma dell'autore mancante).

## 0. La regola che decide tutto

Si passa alla fase successiva solo quando il gate della fase è verde e misurato. Se un gate fallisce, si corregge o si taglia lo
scope: non si va avanti «a sensazione» e non si indebolisce un test per farlo passare. Ogni ruolo firma il proprio gate nel
riepilogo della fase. Ogni nuova scelta dell'autore diventa una riga in `docs/gold/DECISIONI.md`; lo stato va in cima a `docs/gold/STATO.md`.

## 1. Regole di lavoro (Producer, Lead Engineer)

- **Rami.** Un ramo per agente (`ccr-…` per Claude, `argon/…` per Argon, `studio/…` per gli altri). Nessuno scrive su `main` né sul
  ramo di lavoro `work/chronos-adventure-commercial`: si entra solo con una PR con `npm test` verde e la batteria dei controlli della propria area.
- **Mai force-push, mai riscrittura della storia.** [FATTO] `d3ea80d` è arrivato su `main` e sul ramo di lavoro con un push forzato
  (`git fetch`: «forced update»); i 29 commit R22–R29 sopravvivono solo in `origin/backup/work-r29-14f5bdc`. **Azione per l'autore:**
  attivare su GitHub la protezione di `main` e di `work/chronos-adventure-commercial` (PR obbligatoria, niente force-push).
- **Ogni consegna esterna (Argon) si verifica per intero** prima di crederle: `npm test` completo e batteria `qa:*`.
  [MISURATO] `d3ea80d` dichiarava «460/460»: erano 458 su 469, più un crash del gioco nella tappa 20 che nessun test unitario vedeva.
- **Niente segnaposto.** Un'immagine piatta (pochi colori, forme geometriche) non entra nel gioco: va nel brief per l'arte.

## 2. Ruoli e gate

| Ruolo | Possiede | Gate che firma |
|---|---|---|
| Game Director | visione, pilastri, canone, scope | ogni fase: cosa entra e cosa esce |
| Lead Engineer | codice, test, build Android | `npm test` verde, APK/AAB costruiti, peso `app.js` < 458 752 byte |
| Gameplay Designer | loop dei Due Colpi, telegraph, boss, difficoltà | audit D48 6/6, curva dei primi 10 minuti |
| Level Designer | tappe, hub, mappe 24×24, collisioni dalla maschera | piante calpestabili coerenti con l'immagine (test R26) |
| Narrative Designer | canone, dialoghi, battute dei boss | canone rispettato, testi IT/EN completi |
| Art Director | bibbia visiva, palette, brief per Argon | 10 controlli sui derivati, nessun segnaposto |
| Audio Director | musica, suoni, vibrazione | −16 LUFS ±1, true peak ≤ −1,5 dBTP, loop senza giunture |
| QA Lead | test, telefono, triage P0–P3, playtest | nessun P0/P1 aperto |
| Debugger | riproduzione e misura dei difetti | ogni bug con `file:riga`, comando, prova |
| Producer | calendario, rischi, decisioni aperte | piano aggiornato a ogni fase |
| Store & Marketing | scheda Play, KPI, soft launch | scheda completa, KPI misurati |

## 3. Le fasi

### Fase 0 — Base vera e verde (fatta sul ramo `ccr-022499ad-zq9iu5`)

| Passo | Cosa | Ruolo |
|---|---|---|
| 0.1 | Pacchetto Android ripristinato: ritratti `.png`, edifici dei villaggi, `world.js`, boss chrono; un file mancante ferma la build; suoni v86 nel pacchetto | Lead Engineer |
| 0.2 | Via l'arte segnaposto (mappa blu della prima missione, cerchi del DUO, fogli v86/sprint01) e i «ricordi» senza effetto | Art Director, Game Director |
| 0.3 | Test riportati a R29 dove erano stati indeboliti; specifica economica riallineata | QA Lead |
| 0.4 | D74: audio libero di partire su Android, musica del menu da sola, ruggito del giaguaro | Audio Director |
| 0.5 | Crash della tappa 20 (`below`) e di ogni missione nell'APK: caricava immagini segnaposto non presenti | Debugger |
| 0.6 | Documenti e prove cancellati da `d3ea80d` ripristinati; D74, D75, questo piano | Producer |

**Gate 0:** `npm test` per intero verde · batteria browser verde · `app.js` sotto la guardia · `STATO.md` cita D75. Esito nella prima sezione di `STATO.md`.

### Fase 1 — Diagnosi con agenti (2 giorni)

- Tre giocatori simulati (casual da metro, veterano action con mira manuale, esploratore completista) giocano nel browser con
  profilo telefono e consegnano resoconti con foto; un **designer delle logiche** rivede ciclo, curva, economia, varietà, durata;
  un **compositore** prepara la colonna sonora (Fase 2). I cinque agenti erano partiti e si sono fermati per il limite d'uso:
  si riprendono dal punto in cui erano.
- Il QA Lead fonde i resoconti in un backlog unico P0–P3, ognuno con ruolo, `file:riga` e prova.

**Gate 1:** 4 resoconti consegnati · backlog triato · ogni P0/P1 ha un responsabile. [SIMULAZIONE]: non sostituisce le persone.

### Fase 2 — Audio di qualità (3–4 giorni) · Audio Director

- **Colonna sonora nuova** (D74): 12–14 brani tematici al posto delle tracce attuali [MISURATO: mono 32 kHz rese da MIDI, ~60 s;
  loop di 13–22 s; ambienti di 8 s]. Leitmotiv di Nox, di Lulù e di Archon; melodie dei MIDI del gioco riarrangiate, il resto
  originale; script deterministico in `tools/`, mappa cue→brano.
- **Fiammata di bocca:** colore coerente con il lampo dipinto degli sprite (azzurro Nox, rosa #FF7FD8 Lulù), bagliore additivo, durata.
- **Vibrazione** sui colpi presi, sulla schivata perfetta e sui boss (già presente come opzione: tarare).

**Gate 2:** ogni brano −16 LUFS ±1 integrati e true peak ≤ −1,5 dBTP (`ffmpeg ebur128`) · loop senza scatto (differenza al punto di
loop < −40 dB) · budget musica ≤ 16 MB · verifica audio del menu PASS · l'autore ascolta e approva (l'agente non può ascoltare).

### Fase 3 — Feel e primi 10 minuti (3 giorni) · Gameplay Designer, Level Designer

- Curva dei primi 10 minuti: prima azione entro 60 s dall'avvio, un'abilità nuova ogni 2–3 minuti, prima vittoria «sentita» (Rook) senza muri di difficoltà.
- Telegraph leggibili anche senza colore (forma + tempo); battute dei boss legate alla meccanica (già in `d3ea80d`).
- Spigoli delle mappe dipinte: [MISURATO R28] il bot da tastiera si è incastrato 74/246/66 volte per rotta; correzione da
  provare con il joystick senza cambiare tempi né hitbox (D75); audit D48 a ogni modifica.

**Gate 3:** audit D48 50/50 righe 6/6 · giro completo delle tre rotte PASS · giocatore simulato casual alla prima azione < 60 s · nessun tempo né hitbox cambiato (test).

### Fase 4 — Contenuto e durata (5–7 giorni) · Level Designer, Narrative Designer

- [MISURATO R28–R29] durata probabile 79,9 / 84,0 / 80,0 minuti; obiettivo dell'autore circa 150 (D65).
- Leve in ordine di resa: gare Vortex nella campagna (blocco 11, **decisione dell'autore**, cambia D05); collegamenti narrativi fra
  le tappe; uso degli asset veri di Argon non ancora nel gioco; seconda metà dei villaggi con incarichi propri. Niente riempitivi:
  ogni minuto in più deve avere una decisione o un'abilità da usare.

**Gate 4:** stima ≥ 120 minuti probabili su ogni rotta (`tools/estimate_playtime.mjs`) · nessuna tappa nuova senza test e audit · testi IT/EN completi (`verify_bundle_en_r20`).

### Fase 5 — Arte (in parallelo alle Fasi 2–4) · Art Director con Argon

- Brief per Argon sui buchi veri: vuoto blu dell'Asse (`a_axis`), icone proprie delle 9 armi di mercato, i concetti di V8.6
  (oggi segnaposto), schermate e grafica per lo store. Ogni consegna va su un ramo `argon/…` e passa i 10 controlli
  (`tools/art_derived_checks.mjs`) con registro SHA-256; gli originali non si toccano; corpi e volti V8 di Nox e Lulù intoccabili.

**Gate 5:** nessuna immagine piatta in gioco (script di scansione da aggiungere: colori e varianza minimi) · 10/10 controlli su ogni derivato · niente testo leggibile negli sprite.

### Fase 6 — Prova su telefono (1–2 giorni con l'autore) · QA Lead

- Tre telefoni: fascia bassa (2–3 GB RAM), media, alta; Android 10–15. Sessione registrata in `docs/gold/PLAYTEST.md`.
- Misure: avvio a freddo < 4 s fino al menu · 60 fps mediani, p95 del frame < 33 ms in combattimento · memoria < 450 MB · nessun crash in 30 minuti · audio, vibrazione, tocco, testo leggibile a 360 px · gioco possibile senza audio.

**Gate 6:** i valori sopra su tutti e tre i telefoni, oppure difetti P0/P1 aperti e corretti prima di andare avanti.

### Fase 7 — Playtest ciechi (5 persone, 3–5 giorni) · QA Lead, Game Director

- Protocollo `PLAYTEST.md`: persone che non conoscono il gioco, nessun aiuto, 30–45 minuti ciascuna; si registrano morti, blocchi, abbandoni, frasi spontanee.
- Metriche: completamento del primo atto, tempo alla prima azione, punti di abbandono, «lo ricompreresti a 5,99 €?».

**Gate 7:** almeno 4 persone su 5 finiscono il primo atto · nessun P0/P1 aperto · durata umana misurata (la prima vera).

### Fase 8 — Acquisto e demo (2 giorni + tempo dell'autore) · Lead Engineer, autore

- Ponte con Google Play Billing per l'acquisto unico a 5,99 € (D18) e variante demo gratuita (M3, D60). Servono dall'autore:
  ID del prodotto, account di test. **L'agente non crea nulla in Play Console.**

**Gate 8:** acquisto reale e ripristino dell'acquisto provati sulla traccia interna (autore) · demo che si ferma al punto giusto.

### Fase 9 — Release engineering (1 giorno) · Lead Engineer, autore

- AAB con `bash tools/build_aab.sh`, firmato dall'autore con il suo keystore (mai nel repo né in chat); `versionCode` crescente; target API richiesto da Play in quel momento [IPOTESI: 35, da verificare in Play Console].
- Informativa privacy, modulo «Sicurezza dei dati», classificazione IARC, permessi minimi (il gioco non usa rete).

**Gate 9:** rapporto di pre-lancio di Play senza crash né avvisi bloccanti (autore).

### Fase 10 — Scheda dello store (2 giorni) · Store & Marketing, Art Director

- Titolo, descrizione breve (80 caratteri) e lunga in italiano e inglese; icona 512×512; grafica in evidenza 1024×500;
  8 schermate verticali vere del gioco (nessuna immagine ingannevole); video di 30 s dal gioco.
- [IPOTESI, da verificare nella Play Console dell'autore] un account sviluppatore personale nuovo deve fare un test chiuso con almeno 12 tester per 14 giorni prima della produzione: va messo a calendario subito.

**Gate 10:** scheda completa e approvata dall'autore · test chiuso avviato se richiesto.

### Fase 11 — Lancio e dopo (continuo) · Producer, QA Lead

- Rilascio graduale 10 % → 50 % → 100 % in una settimana. KPI: senza crash ≥ 99,5 % degli utenti, ANR < 0,47 %, voto ≥ 4,3,
  conversione della scheda ≥ 25 %, rimborsi < 5 %. Correzioni in 48 ore per ogni P0.

**Gate 11:** KPI misurati in Play Console per due settimane; poi Parte II.

## 4. Rischi (Producer)

| Rischio | Probabilità | Effetto | Contromisura |
|---|---|---|---|
| Altri push forzati sui rami condivisi | alta (già successo) | lavoro perso, regressioni | protezione dei rami (autore), PR obbligatorie |
| Consegne esterne con test indeboliti | alta (già successo) | difetti nascosti | `npm test` completo + `qa:*` a ogni PR |
| Musica generata da codice non all'altezza | media | qualità percepita | approvazione all'ascolto dell'autore; in alternativa un compositore umano |
| Durata sotto l'obiettivo | alta | recensioni «corto» | Fase 4; prezzo e descrizione onesti sulla durata |
| Prestazioni su telefoni economici | media | scatti, abbandoni | Fase 6 con fascia bassa; risoluzione adattiva già presente |
| Requisiti Play cambiati | media | ritardi | verifica in Play Console all'inizio della Fase 8 |

## 5. Decisioni aperte per l'autore (Game Director)

1. Gare Vortex obbligatorie nella campagna (blocco 11, cambia D05): sì o no.
2. Eren: «vecchio cartografo» nel canone, ritratto giovane nel gioco.
3. Turbo: tutti sbloccati dagli atti o anche solo comprabili.
4. Protezione dei rami su GitHub (azione dell'autore).
5. ID del prodotto Play e account di test (Fase 8).
6. Musica: approvazione all'ascolto dei brani della Fase 2.

## 6. Calendario realistico (Producer)

| Giorni | Fase |
|---|---|
| 0 | Fase 0 (fatta) |
| 1–2 | Fase 1 · inizio Fase 5 (brief Argon) |
| 3–6 | Fase 2 · Fase 3 |
| 7–13 | Fase 4 |
| 14–15 | Fase 6 (telefono con l'autore) |
| 16–20 | Fase 7 (5 persone) · Fase 8 |
| 21–22 | Fase 9 · Fase 10 |
| 23+ | test chiuso se richiesto (14 giorni) · Fase 11 |

[IPOTESI] La data di D67 («tra 3 giorni lo pubblicherò») non è compatibile con i gate: con le persone, il telefono e l'acquisto
reale servono circa tre settimane, più l'eventuale test chiuso di 14 giorni.
