# Integrazione Terra — giro 1 (27 ottobre 2026)

Consegna: ramo `delivery/terra-giro1-20261027`, commit `346e56b`. Byte e SHA-256 dei 17 file in `INDICE.json`: tutti corrispondono. Copia in `assets/production/v10.2/handoff/terra_giro1_20261027/` (master, export, script, provenienza, stato; lo ZIP duplicato non è conservato).

## Integrato

| Punto | File consegnati | In gioco | Controllo |
|---|---|---|---|
| G5b | `RACE_ashdocks_container_{ruggine,cobalto,verde}_{normale,colpito}.png` | `game/art/v10/race_container_{ruggine,cobalto,verde}[_hit].png` | `verify_terra_containers.py` PASS (riquadro esatto x 16–111, y 22–168). Verifica gare nel browser 390×844 e 844×390 PASS, con il caricamento dei quattro modelli. Prova: `docs/evidence/v10.2/terra-g5b-containers-390x844-strip.png` |

In gara ogni ostacolo ha sempre lo stesso modello, scelto dalla sua posizione nel percorso: attuale, ruggine, cobalto, verde, poi si ricomincia. Hitbox e posizioni non cambiano.

Note dal controllo:
- L'export porta il ritaglio dei master a 96×147 senza mantenere le proporzioni. L'allungamento orizzontale va da −1,4% a +4,4%: dichiarato nello script, non visibile alla scala di gioco.
- Il verde è vicino al container attuale, che è verde oliva. Si distinguono, ma è la coppia meno contrastata: da valutare nella revisione umana.

## Aperti

- **G4 (strade):** nei master tentati ringhiere e oggetti attraversano il bordo alto o basso. Nessun corpo, mappa luci o giunto consegnato.
- **G6/G7 (armi):** ci sono solo viste isolate di H-17 e ARC-7. Mancano le 64 celle composte, le maschere e i controlli.

Nessun test di gioco umano, ascolto o approvazione artistica.
