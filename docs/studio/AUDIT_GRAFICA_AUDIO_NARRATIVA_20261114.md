# CHRONOS ADVENTURE — Audit distruttivo: grafica, audio, narrativa

Data: 14 novembre 2026
Ramo analizzato: `studio/allineamento-20261114` (= `work/chronos-adventure-commercial` 14f5bdc + consegna Argon 50cc176)
Metodo: misure sui file reali (Pillow, ffmpeg `ebur128`, simulazione `tools/audit_combat.mjs`, `npm test`). Nessun difetto è dichiarato senza una misura. Ciò che richiede un telefono è marcato **DA RIPRODURRE**.

---

## 0. Esito in una riga

La consegna Argon è integra (17 file, tutti gli SHA-256 del manifest corrispondono) ma **non è collegata al gioco**: nessun file di `game/` o `tools/` la carica. In più ha tre difetti che la rendono inutilizzabile così com'è: Nox non si vede sul suo stesso sfondo, Lulù non ha un colore suo, e l'HUD ripete le icone invece di distinguere le funzioni.

---

## 1. Allineamento GitHub

| Ramo | Stato prima | Stato dopo |
| --- | --- | --- |
| `work/chronos-adventure-commercial` | Linea principale, R29, 14f5bdc | Invariato (base dell'allineamento) |
| `argon/loop-20261112` | 1 commit sopra una base vecchia di 29 commit | Portato sopra `work` |
| `delivery/argon-sprint-arte-01-20261114` | Solo consegna | Invariato |
| `studio/allineamento-20261114` | — | **Nuovo**: `work` + consegna Argon + fix Vega/Reaper + questi documenti |
| `main` | Bersaglio del workflow con force-push | **Non toccato**: ogni push su `main` lo sovrascrive |

Conflitti risolti: `game/index.html` e `game/runtime.mjs` (intro studio D61). In entrambi ho tenuto la versione di `work`, che implementa già D61 senza `<video>`.

**Test sul ramo allineato:** 441 test, 435 passano. I 6 falliti (`art-derived`, `chrono-art`, `chrono-foes-d46`, `reload-animation`, `sheet-layout`, `strangers`) si fermano tutti con `Cannot find module 'pngjs'`, perché in questo ambiente la rete è chiusa. `pngjs 7.0.0` è dichiarato in `package.json`: dopo `npm ci` vanno rilanciati.

**Smentita alla consegna Argon:** il rapporto dice «39 pass / 0 fail». È vero solo per le suite toccate. Sul suo ramo la suite completa dava 395 su 405, con 4 errori reali: tyrant che non subisce danno sul punto debole, economia (atteso 24, trovato 10), ammo_belt e D48. Sul ramo allineato questi 4 errori spariscono, perché `work` li aveva già corretti.

---

## 2. Grafica — difetti misurati

### G1 · Nox è invisibile nella scena di apertura — P0
- Luminosità mediana di Nox: 30/255. Del pavimento calpestabile del cantiere: 17/255.
- **Rapporto di contrasto 1,12:1.** Come riferimento, il minimo per distinguere elementi grafici è circa 3:1.
- I primi 10 secondi di gioco sono esattamente quella scena.
- **Correzione:** rim light (contorno chiaro di 2 px) su Nox e Lulù, oppure un cono di luce che segue il giocatore. In più, alzare il pavimento calpestabile di almeno +25 di luminosità rispetto agli ostacoli.

### G2 · Lulù non ha un'identità di colore — P1
- Il brief chiedeva un accento complementare a quello di Nox. Nello sheet Lulù è tutta blu e navy, con una sciarpa grigia.
- Il codice le assegna `#ff7fd8` (rosa) in `SPEAKERS`, ma nello sprite non c'è nemmeno un pixel rosa: UI e personaggio dicono due cose diverse.
- Gli effetti `marca` e `scudo` di Lulù sono anelli grigio scuro: su sfondo scuro spariscono.
- **Correzione:** rosa `#ff7fd8` sulla sciarpa e sugli effetti di risonanza, e scudo con riempimento semitrasparente rosa.

### G3 · Il boss usa il colore di Lulù — P2
- The Anchor usa magenta e rosa per il telegraph e per il nucleo esposto. È lo stesso colore che dovrebbe identificare Lulù (G2).
- **Correzione:** riservare il rosa a Lulù. Per il pericolo dei nemici usare un rosso-arancio unico per tutti i boss: rosso = colpo in arrivo.

### G4 · HUD con icone duplicate e barre indistinguibili — P1
- Le 9 icone dell'HUD comprendono due mirini identici e due doppie frecce identiche. Il brief chiedeva SPARA, SCHIVA, CAMBIA più un indicatore.
- La seconda barra vita è vuota e grigia: non si capisce quale sia di Nox e quale di Lulù.
- La "grana" dei pixel dell'HUD è circa 3–4 volte più grossa di quella degli sprite (2 px): sullo stesso schermo sembrano due giochi diversi. **DA RIPRODURRE** a dimensione reale su telefono.
- **Correzione:** 1 icona per funzione, barra Nox ciano e barra Lulù rosa, stessa densità di pixel degli sprite.

### G5 · Area calpestabile del cantiere sotto la soglia del piano — P1
- La maschera `bg_cantiere_apertura_calpestabile_v01.png` ha 170 celle su 576 calpestabili: **29,5%**. L'invariante proposto nel piano è ≥45%.
- Per un tutorial il problema è minore (lo spazio stretto guida), ma va deciso in modo esplicito, non lasciato al caso.

### G6 · Animazioni rigide per normalizzazione dell'altezza — P2
- In tutti i 40 frame occupati di Nox e Lulù la figura è alta esattamente 288 px, sempre tra y=16 e y=304, anche durante la schivata e la corsa.
- Conseguenza: niente rimbalzo verticale nella camminata e niente schiacciamento nella schivata. La posa accovacciata viene ingrandita fino a 288 px, quindi il personaggio "cresce" mentre schiva.
- Nelle righe spara e schiva la figura è larga 304 px su una cella di 320: rischio di sbavature con il filtro di scala. **DA RIPRODURRE** in gioco.
- **Correzione:** altezza di riferimento 288 px solo per idle. Le altre pose mantengono la scala della idle, con i piedi su una linea di base fissa.

### G7 · Prospettive diverse nell'hub Moon — P2
- Lo sfondo dell'hub è una vista dall'alto in tre quarti, con case in prospettiva. I 3 interni sono illustrazioni frontali.
- Va bene se gli interni sono solo sfondi di dialogo o negozio. Diventa un problema se il personaggio ci deve camminare sopra con la griglia 24×24.
- L'identità "Moon" si regge su un solo simbolo di luna su una porta. A colpo d'occhio è un villaggio in caverna generico.

### G8 · Asset non integrati — P0 per la Vertical Slice
- `grep` su `game/` e `tools/`: zero riferimenti a `deliveries/argon-sprint-arte-01-20261114`.
- Finché non sono caricati dal motore e visti su un telefono, lo sprint non è chiuso (regola 4 della sezione 6 del brief).

---

## 3. Audio — difetti misurati

Misure EBU R128 su `game/audio/v10/*.ogg`: loudness integrata (LUFS) e true peak (dBTP).

| Brano | Uso | LUFS | True peak | Problema |
| --- | --- | --- | --- | --- |
| `title_theme` | Menu | −15,1 | −1,5 | **Risolto** (prima +1,1 dBFS) |
| `refuge_theme` | Hub | −16,9 | −1,4 | Picco al limite |
| `vega_duel` | Boss | −16,8 | −7,0 | Riferimento per i boss |
| `anchor_fight_loop` | Boss The Anchor | **−26,6** | −3,5 | 10 dB sotto gli altri boss |
| `strangers_rift` | Alleati Kairn/Morrow | **−26,1** | −13,4 | Entra *durante* i boss |
| `veyra_championship` | Gara diurna | **−30,5** | −13,9 | Quasi muta |
| `veyra_championship_night` | Gara notturna | **−34,0** | −18,9 | Quasi muta |

### A1 · Differenza di volume di 22 dB tra brani — P0 audio
- Il resto della colonna sonora sta tra −17 e −11,6 LUFS. Quattro brani stanno tra −26 e −34.
- `audio-engine.mjs` riproduce ogni brano con `media.volume=1` e lo stesso guadagno: **non c'è compensazione per brano**.
- Effetto in gioco: il boss della Vertical Slice (The Anchor) suona molto più debole del boss Vega, e le gare sembrano senza musica. **DA RIPRODURRE** su speaker del telefono.

### A2 · La musica degli alleati abbassa il volume del boss — P1
- `runtime.mjs` (riga 82): se ci sono alleati, `strangers_rift` ha la precedenza sulla musica del boss.
- Durante un boss il volume cala di colpo di circa 10 dB e la tensione crolla proprio nel momento della svolta.
- **Correzione:** con gli alleati presenti, tenere il tema del boss e aggiungere uno strato (stinger) degli alleati. In alternativa, riportare `strangers_rift` a −16 LUFS.

### A3 · Musica duplicata nel pacchetto — P2
- `game/audio/v08/` (1,3 MB) contiene `danger`, `nox`, `lulu` e `reunion` con loudness identica alle versioni `v09`. `prepare_android_assets.py` li copia ancora nell'APK.
- **Correzione:** verificare se `v08` è ancora referenziato a runtime. Se non lo è, rimuoverlo dal pacchetto (budget del bundle, P1.3 dell'audit).

### Obiettivo di mix
Musica: **−16 LUFS ±1**, true peak **≤ −1,5 dBTP**. Effetti sonori: normalizzati per categoria. In alternativa, se non si vuole rimasterizzare, una tabella `MUSIC_GAIN` per brano in `audio-engine.mjs`.

---

## 4. Narrativa — difetti misurati

Conteggio parole sul canone `game/story-v08.mjs` (89 scene).

| Voce | Parole |
| --- | --- |
| Totale storia | **1.874** (media 21 per scena) |
| Lulù | 460 |
| Nox | 426 |
| ABITANTE (generico) | 281 |
| Narratore / senza nome | 206 |
| Eve | 97 |
| Archon (antagonista finale) | 52 |
| Veyra | 44 |
| Vega | 43 |
| The Anchor (boss della Vertical Slice) | **7** |
| Rook | **5** |
| Custode | **5** |

### N1 · I boss non hanno voce — P1
- Rook, Custode e The Anchor insieme pronunciano 17 parole in tutto il gioco. Gli abitanti generici ne pronunciano 281.
- Un boss senza voce è solo una barra vita. È lo stesso difetto di game feel dell'audit, ma sul piano narrativo.
- **Correzione:** per ogni boss, 3 battute (entrata, cambio fase, sconfitta), ciascuna legata a una meccanica. Esempio: The Anchor annuncia il colpo pesante; quando i cavi vengono tagliati reagisce.

### N2 · La separazione è troppo corta per reggere il paywall — P1
- La scena `separation`, il momento in cui il gioco chiede €5,99, ha 44 parole in 12 battute: circa 4 parole per battuta.
- Non è un problema di lunghezza in sé. Il punto è che il distacco non viene preparato da nessun momento giocato insieme e poi tolto.
- **Correzione:** non allungare il testo. Mettere una meccanica: nell'ultima missione prima della separazione il Due Colpi si interrompe a metà, e il giocatore lo sente nelle mani.

### N3 · Il tema "Due Colpi" vive nell'interfaccia, non nella storia — P2
- L'espressione compare 10 volte nei file di gioco, quasi solo in UI e meccaniche. Nel canone narrativo è quasi assente.
- **Correzione:** rendere i due colpi un segnale ricorrente tra Nox e Lulù (bussare, chiamarsi, il "sì" prima di agire), in modo che il tema stia insieme nella trama e nei comandi.

### N4 · Premessa dell'audit da correggere
- L'audit parlava di "muro di testo nei primi 60 secondi". La scena `home` ha 62 parole in 6 battute: non è un muro.
- Il problema reale è l'**ordine**: l'emozione arriva prima del gioco. La soluzione resta quella del piano (apertura giocabile in 10 secondi), ma il testo non va tagliato. Va spostato dopo il primo Due Colpi.

---

## 5. Gameplay — dati della simulazione sul ramo allineato

- `tools/audit_combat.mjs`: 25 missioni, tutte vinte dal bot medio e dal bot debole a ogni seed. Nessun nemico incastrato, nessun timeout.
- Missioni innocue (colpi subiti mediani dal bot medio): **port 0**, app_node 1. Una missione in cui il giocatore non viene mai colpito non ha tensione.
- La curva di difficoltà nella simulazione è coerente: blackout 5, zero 7, finale 11.
- La durata dichiarata nel ramo `work` (R28–R29) è 79,9–84,0 minuti, già nella fascia 75–90 del piano. L'obiettivo dei 150 minuti va abbandonato in modo ufficiale.

---

## 6. Correzioni ordinate (prossimo sprint)

| # | Intervento | Area | Priorità | Criterio di chiusura |
| --- | --- | --- | --- | --- |
| 1 | Rim light Nox/Lulù + pavimento cantiere più chiaro | Grafica | P0 | Contrasto ≥ 3:1 misurato |
| 2 | Integrare gli asset Sprint 01 nel motore | Codice | P0 | Visti su telefono in apertura e nell'hub Moon |
| 3 | Normalizzare la musica a −16 LUFS o aggiungere `MUSIC_GAIN` | Audio | P0 | Scarto tra brani ≤ 2 dB |
| 4 | Lulù rosa (sciarpa, marca, scudo) e boss in rosso-arancio | Grafica | P1 | Silhouette e colore distinti a 48 px |
| 5 | HUD: un'icona per funzione, barre colorate per personaggio | Grafica | P1 | Test touch su 2 telefoni |
| 6 | Musica del boss mantenuta con alleati presenti | Audio | P1 | Nessun calo > 3 dB durante i boss |
| 7 | 3 battute per boss legate alla meccanica | Narrativa | P1 | Rook, Custode e Anchor ≥ 20 parole ciascuno |
| 8 | Due Colpi interrotto prima della separazione | Design | P1 | Playtest: i giocatori notano la mancanza |
| 9 | Animazioni con linea di base fissa e scala coerente | Grafica | P2 | Nessun cambio di scala tra righe |
| 10 | Rimuovere `audio/v08` dal pacchetto se non usato | Build | P2 | Bundle più piccolo, test verdi |
| 11 | Rendere pericolosa la missione port (0 colpi) | Design | P2 | Colpi mediani ≥ 2 |

---

## 7. Brief di correzione per Argon (Sprint Arte 01b)

```
Correggi gli asset dello Sprint 01 senza cambiarne lo stile.

1. nox_sheet_base_v02 e lulu_sheet_base_v02:
   - contorno chiaro di 2 px (rim light) sul lato in luce, colore #9fe9ff per Nox e #ffb3ea per Lulù;
   - Lulù: sciarpa ed elementi di risonanza in #ff7fd8;
   - scala unica: la idle è alta 288 px, le altre pose mantengono la stessa scala;
     piedi sempre su y=304, niente ingrandimento delle pose basse;
   - margine minimo di 16 px dai bordi della cella.
2. vfx_due_colpi_v02: effetti di Lulù (marca, scudo) con riempimento rosa semitrasparente, non anelli grigi.
3. boss_the_anchor_v02: telegraph e nucleo esposto in rosso-arancio (#ff5a36), niente rosa o magenta.
4. hud_vertical_slice_v02: 3 icone diverse (SPARA, SCHIVA, CAMBIA), barra Nox ciano e barra Lulù rosa,
   pixel della stessa grandezza degli sprite.
5. bg_cantiere_apertura_v02: pavimento calpestabile più chiaro di almeno +25 di luminosità rispetto agli ostacoli,
   cassa sempre punto focale.

Consegna con checklist e manifest SHA-256, come nello Sprint 01.
Verifica tu stesso il contrasto Nox/pavimento: deve essere almeno 3:1.
```
