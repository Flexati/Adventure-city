# R50 — Tester simulati sulle schermate del primo quarto d’ora

**Sono simulazioni, non persone.** Tre agenti hanno guardato 13 schermate ferme (412×860, l’ultima 860×412), ciascuno con una persona assegnata:
- un bambino di 10 anni;
- un genitore che decide se pagare 5,99 €;
- un designer di action giapponesi.

Contano come ipotesi da verificare. Ogni rilievo qui sotto è stato controllato sulle schermate prima di correggerlo. Le misure vere arriveranno dai playtest con persone (`docs/gold/PLAYTEST_KIT.md`).

## Rilievi confermati e corretti

| Rilievo | Chi | Correzione |
|---|---|---|
| Con un obiettivo su tre righe, la barra del boss passa sotto il riquadro (Vega) | tutti e tre | La barra si sposta sotto l’obiettivo; il fumetto e gli avvisi del boss scendono sotto la barra (`placeBossBar`, `--bossbar-bottom`) |
| Gli avvisi coprono il titolo del menu di pausa | tutti e tre | Gli avvisi non si vedono con la pausa, le Opzioni o l’Archivio aperti |
| In orizzontale l’avviso copre il fumetto | tutti e tre | L’avviso scende sotto il fumetto |
| Nel villaggio i nomi si tagliano ai bordi («rendista di Tessa», «Sentinella del vi», «Ash Doc») | tutti e tre | Le etichette restano intere dentro lo schermo |
| Il suggerimento «referente chiave del quartiere (★ CHIAVE) prima di partire sul carico» non si capisce | bambino, genitore, designer | Diventa «Prima di partire, parla con chi ha ★ CHIAVE sopra la testa.» (IT/EN) |

## Rilievi lasciati all’autore (scelte di design, non difetti)

- **Sette comandi a destra, solo testo, tutti simili** (designer e bambino). Possibili rimedi: icone sui pulsanti, SCHIVA più grande, CURA nascosta a zero. Le icone appartengono al kit dell’interfaccia di Argon (lotto G6 del prompt v2).
- **La parte alta dello schermo resta affollata durante i boss.** Ci sono obiettivo, barra, fumetto e avviso. Il designer propone una fascia riservata ai pannelli; cambia l’inquadratura, quindi decide l’autore.
- **Pericolo e obiettivo hanno lo stesso arancione nel Cantiere Est.** Le minacce hanno già cerchi tratteggiati e pieni (D88), ma il segno sopra i nemici è piccolo.
- **Parole difficili per un bambino** («relè», «Reputazione: Quartieri media»). Nomi inglesi delle mosse accanto all’italiano (BLACK PULSE).
- **L’apertura «Batti due volte».** Il cerchio che invita a toccare arriva dopo 2,5 s: il bambino e il genitore temono che sembri bloccata, il designer la indica come punto forte.
- **Il tono per gli 8 anni.** Ci sono nemici incappucciati e uno scheletro con la spada; il genitore la darebbe al dodicenne.

## Cosa ha convinto

- Offline e senza pubblicità.
- Nox e Lulù.
- La guida chiara.
- La regola di Vega «conta i colpi» con il contatore vicino al personaggio.
- Le opzioni di accessibilità.
- I testi dell’Archivio.
