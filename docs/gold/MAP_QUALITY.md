# Qualità delle mappe: criteri scritti prima del giudizio

Una mappa passa solo se rispetta tutti i criteri. Chi giudica scrive PASS o FAIL per criterio, con una schermata.

| # | Criterio | Come si verifica |
|---|---|---|
| M1 | Ogni porta dà su una casella calpestabile e raggiungibile dall'ingresso del villaggio | `tests/villages-d40.test.mjs` (percorso dalla porta all'ingresso) |
| M2 | Strade larghe almeno 2 caselle (128 px): l'eroe e un abitante si incrociano | misura sulla pianta in `game/villages.mjs` |
| M3 | Un punto di riferimento visibile da ogni incrocio (piazza, edificio più alto) | schermate a 360×800 dai 4 angoli |
| M4 | I servizi si riconoscono senza leggere: forma e simbolo, anche in scala di grigi | schermata desaturata |
| M5 | Nessuna casella «vuota a tinta unita» più larga di 4×4 senza un oggetto o una variazione | conteggio sulla pianta |
| M6 | L'obiettivo corrente è indicato (freccia fuori schermo, segnale sul bersaglio) | `npm run qa:hud`, schermata |
| M7 | Nessun testo leggibile negli sprite; il fondo `#FF00FF` non si vede mai | `tools/art_derived_checks.mjs` |
| M8 | Costo del disegno: nessun frame oltre 16,67 ms sul telefono di prova | misura su telefono (oggi mancante) |

## Stato al 12 novembre 2026

Non giudicate. I quattro villaggi usano edifici disegnati dal codice (`game/village-art.mjs`), non sprite:
il giudizio si fa quando arrivano le 25 case chieste ad Argon (`requests/argon-case-villaggi-20261112/README.md`).
M6 è coperto nel combattimento (freccia e segnale sul dispositivo); M8 è aperto.
