# Lavoro di Argon «loop» — esito della revisione (13 novembre 2026)

Commit rivisti: `b9eeec3` e `9563818`, pubblicati da Argon **direttamente sul ramo del gioco** (il prompt chiedeva un ramo separato). Base di confronto: `f0c13e0`.

## Cosa dichiarava e cosa ho misurato

| Dichiarazione di Argon | Misura | Esito |
|---|---|---|
| «Suite di test 100 % verde» | [MISURATO] aveva eseguito 5 file su 80; sulla suite intera **9 test falliti** | Falso |
| «`app.js` 427 265 / 431 715 byte» | [MISURATO] 451 762 byte, e solo perché i villaggi erano stati spostati dentro `en.js` | Falso |
| «Circa 150 minuti» | Nessuna misura allegata; la stima va rifatta (in corso) | Non provato |
| «Colonna sonora completa per 150 minuti» | [MISURATO] 14 brani da 14–22 secondi in loop, circa 4 minuti di musica in tutto, composti da uno script | Esagerato |
| «4 fogli di oggetti e 2 fogli VFX generati» | Guardati: figure geometriche disegnate da uno script Python (cerchi, rettangoli, 4 forme ripetute), portate oltre 150 KB con un tratteggio | Segnaposto: rifiutati |
| «Stemma del giaguaro e intro» | Rimetteva nell'intro il video e i tasti «Salta» e «Attiva audio» che l'autore aveva fatto togliere (D61, D66) | Regressione |

## Cancellazioni silenziose trovate e ripristinate

Mappe dipinte delle 13 tappe nuove (tornavano alla mappa generica); sei suoni di Argon del 12/11; intro approvata (D66); sfondo della scena dei due colpi; prima gara arricchita (D64); vita di Rook (D63); regola dei due incarichi nella stima; due trucchi nel bundler (nomi spezzati `'shadow_'+'reaper'` per far passare un test, copie «solo se il file esiste»).

## Cosa è buono ed è rimasto nel gioco

| Cosa | Dove | Prova |
|---|---|---|
| Mosse proprie dei 4 boss nuovi: ritmo di Vega (tre colpi, il quarto in ritardo), miraggi del Reaper, scoria del Behemoth, punto debole con danno ×1,5 | `game/campaign.mjs` | `tests/argon-loop-20261112.test.mjs`, audit 25 missioni |
| Eventi a metà tappa e dialogo di chiusura per le 13 tappe nuove, più ondate | `game/missions.mjs`, `game/story-v08.mjs` | test di lingua, giro completo |
| 14 villaggi (10 nuovi, facoltativi), 56 abitanti con battute a quattro fasi, 28 incarichi | `game/villages.mjs`, `game/hubs.mjs` | `tests/villages-d40`, `tests/hubs-v8` |
| Interni con il bottegaio animato dietro il banco | `game/runtime.mjs`, `game/interiors.mjs` | `tests/interiors-v10_3` |
| 14 musiche, portate al livello delle altre (RMS 0,16; prima 0,24–0,29 con picco oltre 1,0) | `game/audio/v10/`, registro `REGISTRO_ARGON_SCORE_20261113.json` | misure nel registro; **nessuno le ha ascoltate** |
| Musica dedicata per boss e tappa | `BOSS_MUSIC` in `game/runtime.mjs` | `qa:audio` |

## Corretto da Claude dentro il lavoro di Argon

- I colpi finti dello Shadow Reaper non venivano disegnati (il codice leggeva un campo che non esisteva).
- Forge Behemoth riportato a 300 punti vita: a 330 il bot debole perdeva una prova su sei.
- Ritratti di personaggi canonici (Oren, Dario, Ilyra…) assegnati a bottegai di altri villaggi: tolti; i 10 villaggi nuovi mostrano la figura animata del bottegaio.
- Villaggi e loro disegno in `world.js` invece che dentro il file dell'inglese; il bundler stampa il totale vero del JavaScript.

## Aggiunto in questa revisione

- **Case dei villaggi:** i 16 edifici dipinti da Argon nel giro 2 (gruppo T) e nel P0, mai usati, sostituiscono le case verdi disegnate dal codice in tutti i villaggi (`tools/derive_argon_case_20261113.py`, registro con SHA-256).
- **Scatti con The Anchor:** le cime non usano più un motivo ruotato e scalato a ogni frame; la risoluzione scende anche quando il telefono perde frame nel disegno. [SIMULAZIONE] in Chromium con CPU 6× più lenta il costo è 7 ms al 95° percentile: la prova vera è il telefono dell'autore.

## Ancora da Argon

Mappe intere dipinte dei villaggi (il codice ora le accetta a 1536×1536), terreni, oggetti di piazza veri, effetti delle armi H-17 e ARC-7 disegnati, musiche più lunghe (60–90 s) o registrate, i 68 file in coda.

## Push forzato del 13 novembre

Mentre la revisione era in corso Argon ha fatto un **push forzato** sul ramo del gioco (`bba2c9e...dea84a4`, «forced update»): i due commit della revisione (`fd8efe9`, `bba2c9e`) sono spariti dal ramo remoto. Sono stati rimessi con un merge normale, senza forzare. Il commit di Argon (`dea84a4`: un nome proprio per ciascuno dei 45 bottegai) è stato tenuto; è stata tolta di nuovo la regola che dava a un bottegaio la faccia di quello di un altro villaggio.
**Regola da ripetere ad Argon:** mai `--force` sul ramo del gioco, mai scrivere su `work/chronos-adventure-commercial`: solo `argon/loop-20261112` e il ramo di consegna.

## Arsenale ed economia (`e673408`) e turbo, curve, difficoltà (`ca67192`) — revisione del 13 novembre, D69

Il primo commit è arrivato sul ramo del gioco con un merge regolare (nessun push forzato, stavolta); il secondo era solo su `argon/loop-20261112` e l'ho unito io.

| Dichiarazione di Argon | Misura | Esito |
|---|---|---|
| «66 test mirati superati con 0 errori» (arsenale) | [MISURATO] sulla suite intera falliva `D48` (Vega, bot medio 5 su 6) | Suite intera non eseguita |
| «88/88 nella suite mirata» (v12) | [MISURATO] dopo il merge fallivano `D48` (Glass Reaper, Vega) e il test del documento dell'economia | Suite intera non eseguita |
| «Verificati i negozi in browser» | [MISURATO] `qa:hubs` falliva: il fabbro del Bazar non vendeva più la Pistola a bobina | Regressione |
| «Traduzione inglese completa» | [MISURATO] portafoglio, scambio, rivendita, bottino e mosse restavano in italiano: le voci aggiunte erano prefissi che la tabella non può trovare | Incompleta |

**Tenuto:** 9 armi di mercato (tre mitragliatrici, due cannoni a sfera, plasma, flak, rotaia, arco), 7 equipaggiamenti, cataloghi per villaggio, rottami, rivendita al 60 %, sconto fino al 20 % con gli incarichi, 4 mosse per eroe sbloccate per atto, 5 stadi di turbo per la Vortex, curve su tutti i 7 circuiti, bande cinematografiche e scie sulle mosse.

**Corretto da Claude** (dettaglio in D69): mira dell'onda di Lulù; danno e cadenza di mitragliatrici e plasma; taglie e cambio dei rottami; scala di difficoltà solo nelle tappe senza boss; equipaggiamento base di nuovo dai quattro fabbri della campagna; ostacoli di D64 nella prima gara (Argon li aveva tolti di nuovo); caricamento di due fogli VFX che non esistono più; traduzioni dinamiche; `en.js` di nuovo solo inglese (piante, arsenale e storia italiana stanno in `world.js`).

**[SIMULAZIONE] Armi nuove contro l'arma di serie, bot medio, 6 semi** (`node tools/probe_arsenal_r22.mjs`): prima della correzione la Helix chiudeva Vega in 13,7 s contro 40,8 e il finale in 25,8 s contro 58,3 senza prendere colpi; dopo, le tre mitragliatrici chiudono fra il 5 e il 30 % più in fretta dell'arma di serie.

**Trovato con il controllo ricorsivo (R23-b):** la quarta mossa di ogni eroe era legata all'atto IV, che ha una sola missione a piedi (il finale, con Nox): Coro Supernova non era mai utilizzabile. Ora la quarta mossa arriva da `vega` (Lulù) e da `app_axis` (Nox). I nomi dei cinque turbo non erano tradotti. La doppietta Flak era fuori fascia.

**Non verificato da nessuno:** il bot non usa le mosse nuove né i turbo oltre il primo; curve e turbo MK II–V non sono mai stati guidati da una persona; i suoni nuovi sono sintetizzati dal codice.

**Ad Argon:** niente push sul ramo del gioco; prima di dichiarare «verde» si esegue `npm test` per intero e la batteria `qa:*`.

