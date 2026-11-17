# Kit per i playtest con persone vere

Serve a riempire l’unico vuoto che il codice non può riempire: **sessioni umane registrate, oggi 0** (`PLAYTEST.md`). Finché restano 0, `COMMERCIAL_RELEASE = BLOCKED`.

## Chi e quanti

- **5 persone nuove** che non hanno mai visto il gioco: con 5 si trovano i problemi più gravi. Meglio se diverse tra loro:
  - un bambino tra 8 e 12 anni, con un genitore accanto;
  - un adulto che gioca poco;
  - un giocatore di action;
  - una persona che preferisce l’inglese.
- Un telefono Android vero, con l’APK di prova più recente (il numero di build è nei Crediti delle Opzioni).
- Il volume a piacere: il gioco deve funzionare anche senza audio.

## Come si conduce (35 minuti a persona)

1. **Non spiegare niente.** Dì solo: «È un gioco d’azione. Gioca come faresti a casa. Pensa ad alta voce, se ti va.»
2. **Non aiutare.** Se la persona è bloccata da 60 secondi, segna il punto e poi dai un solo suggerimento.
3. **Guarda le mani**, non lo schermo: tocchi sbagliati, pulsanti cercati, dita che coprono qualcosa.
4. **Fermati a 25 minuti di gioco.** Poi fai le domande qui sotto.

## Cosa annotare durante il gioco

Una riga per ogni evento, con il minuto:

| Minuto | Tappa | Cosa è successo | Tipo |
|---|---|---|---|
| | | | blocco · tocco sbagliato · non capisce · sconfitta · sorriso/sorpresa · noia |

Alla fine segna anche:
- l’ultima tappa raggiunta;
- quante sconfitte e dove;
- se ha usato da solo SCHIVA, l’abilità, il Bagaglio e la cura;
- se ha aperto le Opzioni e se ha cambiato qualcosa (per esempio la Modalità storia).

## Domande alla fine (risposte a parole, poi un voto da 1 a 5)

1. Con parole tue: cosa dovevi fare nella prima tappa?
2. Chi sono Nox e Lulù l’uno per l’altra?
3. C’è stato un momento in cui non sapevi cosa fare? Quale?
4. Il combattimento: troppo facile, giusto o troppo difficile? Dove?
5. C’è qualcosa che ti ha dato fastidio o spaventato?
6. Cosa ricordi di più?
7. Continueresti a giocare stasera? (1–5)
8. Lo pagheresti 5,99 €? Sì, no o forse, e perché.

## Dove si registra

- Una sezione nuova in `docs/gold/PLAYTEST.md` per ogni persona, con:
  - il codice anonimo (P1, P2, …);
  - la build;
  - la tabella degli eventi;
  - le risposte.
- **Niente nomi, foto o dati personali dei bambini.**
- Poi l’autore decide le correzioni, e ogni scelta nuova diventa una riga in `DECISIONI.md`.

## Cosa NON vale come playtest

- I giocatori automatici (`audit_combat`, `verify_campaign_browser`).
- I tester simulati con agenti (R30, R50): danno ipotesi utili da verificare, non misure su persone.
