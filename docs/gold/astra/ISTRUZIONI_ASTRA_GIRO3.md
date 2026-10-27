# Istruzioni per Astra — giro 3

Repository: `Flexati/Adventure-city`, ramo di riferimento `work/chronos-adventure-commercial` (commit `e55734b` o successivo). Registro con misure e motivi: `docs/gold/ASTRA_INTEGRAZIONE_20261027.md`, sezione «Correzioni 20261027».

## Già integrati: non rifare

The Anchor (nucleo G11 riesportato, bitte, segmento del cavo, corsia della spazzata, audio A5). Impatti C-9/VX-9/R-12. Auto di Veyra, container, checkpoint stretti e larghi (piloni e nastro). Ritratti di Kairn, Morrow e Veyra. Musica e suoni delle gare, compresi bip e «via». Conservati senza rifacimenti: icone H-17 e ARC-7, ricarica ARC-7, VFX e audio H-17/ARC-7, ritratti con altre espressioni, `race_rival_pass`.

## Da correggere

### 1. G12 — terminale del cavo (`ARENA_anchor_cable_end.png`)
Respinto per tre motivi: una linea isolata di 1 px a x 8; il terminale è centrato a x 45 invece che sull'asse della corda (colonne 22–41 del segmento, centro x 31,5); finisce a y 48 e lascia 16 px vuoti prima del segmento.
Richiesta: 64×64, terminale centrato sulle colonne 22–41, a contatto con il bordo inferiore (riga 63) così da proseguire senza vuoti nel segmento `ARENA_anchor_cable_segment.png` già integrato, nessun pixel isolato. Stessa luce e stessi materiali del segmento.

### 2. G4 — strade di Ash Docks giorno e notte (`RACE_ashdocks_road_{day,night}.png`)
Il bordo netto non c'è più, ma in scorrimento si vedono due difetti:
- il ritmo del tratteggio si spezza a ogni tile: normalmente c'è un trattino da 43 px ogni ~137 px, alla giunzione un trattino tronco di 8–17 px seguito da uno intero dopo soli 58 px;
- il raccordo tecnico degli ultimi ~96 px lascia una fascia di pixel stirati in verticale su cordoli e ringhiere.
Prova: `docs/evidence/v10.2/astra-correzioni-20261027/G4-road-seam-rejected-390x844.png`.
Richiesta:
- 720×1440, carreggiata x 130–590 a cinque corsie (va bene così);
- **altezza della tile multipla esatta del passo del tratteggio**: per esempio passo 144 px (trattino ~43 px + spazio ~101 px), 10 periodi in 1440;
- **nessuna riga duplicata** tra la fine e l'inizio: la riga 1439 deve proseguire naturalmente nella riga 0;
- giunzione ridisegnata nel contenuto (crepe, sporco, bulloni delle ringhiere), mai stirata o sfumata;
- nessun oggetto che attraversa il bordo superiore o inferiore.

### 3. G6/G7 — sheet H-17 (Nox) e ARC-7 (Lulù): decisione A dell'autore
L'autore ha scelto **A**: basi di runtime invariate e 12 px di margine sugli altri tre lati. Il margine inferiore resta quello che le basi lasciano: è voluto e non va segnalato come difetto.

File da consegnare: `nox_h17_gun.png`, `nox_h17_reload.png`, `lulu_arc7_gun.png`. La ricarica ARC-7 è già conservata: non rifarla.

| File | Formato | Riferimento in gioco | Corpo nella riga 0 (lato) | Piedi per riga 0 / 1 / 2 / 3 (y nella cella) |
|---|---|---|---|---|
| `nox_h17_gun.png` | 1305×1205, 4×4 | `game/art/v10/nox_vx9_gun.png` | 267 px | 299 / 300 / 292–294 / 273–274 |
| `nox_h17_reload.png` | 1305×1285, 4×4 | `game/art/v10/nox_vx9_reload.png` | 281 px | 319 / 319 / 312 / 294 |
| `lulu_arc7_gun.png` | 1305×1205, 4×4 | `game/art/v10/lulu_r12_gun.png` | 250–254 px | 300 / 300 / 294–297 / 273 |

Le misure di ogni cella degli sheet di riferimento (rettangolo della cella, rettangolo del contenuto, y dei piedi, altezza del corpo) sono in `requests/astra-giro3-20261027/MISURE_RIFERIMENTO.json`.

Regole:
- celle logiche 326,25×301,25 (tiro) e 326,25×321,25 (ricarica): la cella della colonna c e della riga r parte da x = round(c × 326,25) e y = round(r × altezza cella);
- **piedi alla stessa y del riferimento, riga per riga** (tolleranza ±2 px), perché il gioco disegna ogni cella con la base nello stesso punto: se la y cambia rispetto a VX-9/R-12, il personaggio salta quando cambia arma;
- **stessa scala del riferimento**: altezza del corpo entro ±3% della cella corrispondente. Le consegne precedenti erano più piccole del 10% circa (0,895–0,907×);
- **12 px di margine in alto, a sinistra e a destra** in ogni cella. Nei riferimenti alcuni lampi della vista di schiena toccano il bordo alto: negli sheet nuovi vanno accorciati, non tagliati;
- ogni posa isolata nella propria cella: nessun frammento della riga sopra o sotto (nelle consegne precedenti c'erano piedi della riga sopra in cima alla riga frontale);
- lampi, fulmini e bossoli **dentro la cella**, entro i margini: se non ci stanno si accorciano, non sconfinano;
- righe: lato, schiena, fronte, diagonale-schiena. Colonne del tiro: anticipo, rilascio, rinculo, recupero. Colonne della ricarica: abbassa, estrai, inserisci, pronta;
- la ricarica 1305×1285 segue il gioco (`RELOAD_DRAW_SCALE=321.25/301.25`): è voluta;
- **non ridisegnare Nox e Lulù**: si parte dagli sheet di riferimento e cambiano solo arma, mani ed effetto. Nox è maschile, Lulù è la protagonista femminile;
- non reinserire gli sheet respinti in precedenza;
- nel rapporto, per ogni cella: rettangolo del contenuto, y dei piedi, altezza del corpo e scarto rispetto al riferimento.

## Non produrre
A1 «Due colpi», cancelli di Aurelia Span, Veyra a piedi.

## Consegna
ZIP sotto i 20 MB, `INDICE.json` con byte e SHA-256, `PROVENIENZA.json` con strumento, origine e condizioni d'uso reali per ogni file, master inclusi. Pubblicare su un ramo `delivery/…` di `Flexati/Adventure-city`. Non dichiarare ascolti, approvazioni o test di gioco non avvenuti. Nox è maschile, Lulù è la protagonista femminile.
