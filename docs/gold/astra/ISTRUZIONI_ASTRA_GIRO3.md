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

## In attesa di una decisione dell'autore — NON produrre ancora

### G6/G7 — sheet di tiro H-17 (Nox), ricarica H-17 (Nox), tiro ARC-7 (Lulù)
Conflitto segnalato da Astra: nelle celle 326,25×301,25 e 326,25×321,25, i piedi a y 299/300/319 non lasciano 12 px sotto. Le due strade possibili:
- **A (proposta Astra):** basi di runtime invariate (y 299/300/319) e 12 px di margine solo sugli altri tre lati, con ogni posa e ogni lampo isolati nella propria cella;
- **B:** 12 px anche sotto, spostando le basi e quindi l'allineamento con gli sheet VX-9/R-12 in gioco.
Aspetta la conferma dell'autore su A o B. Non reinserire gli sheet respinti in precedenza e non ridisegnare Nox e Lulù.

## Non produrre
A1 «Due colpi», cancelli di Aurelia Span, Veyra a piedi.

## Consegna
ZIP sotto i 20 MB, `INDICE.json` con byte e SHA-256, `PROVENIENZA.json` con strumento, origine e condizioni d'uso reali per ogni file, master inclusi. Pubblicare su un ramo `delivery/…` di `Flexati/Adventure-city`. Non dichiarare ascolti, approvazioni o test di gioco non avvenuti. Nox è maschile, Lulù è la protagonista femminile.
