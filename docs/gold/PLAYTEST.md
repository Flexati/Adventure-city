# CHRONOS Gold — durata e playtest

Obiettivo: mediana circa 120 minuti attivi per la prima campagna completa. La fascia 100–140 minuti serve alla diagnosi del ritmo. Tempo attivo include lettura e retry, esclude pause e inattività prolungata.

**Sessioni umane registrate: 0.** Non sono disponibili partecipanti, misure di durata, osservazioni sui tocchi o prove di comprensione da attribuire a persone. Gli attraversamenti automatizzati [A](../evidence/v10.2/campaign-a-report.json) e [B](../evidence/v10.2/campaign-b-report.json) dimostrano raggiungibilità delle rotte sulla sorgente precedente alla migrazione; il clock accelerato non misura minuti umani. Le due [continuazioni browser v7](../evidence/v10.2/chalk-migration-report.json) verificano il ripristino di checkpoint, non la durata.

Per ogni futuro playtest annotare build/hash, persona nuova identificata con codice anonimo, rotta, tempi attivi per tappa, pause escluse, retry, difficoltà, incomprensioni, tocchi errati, difetti e variazioni dopo la correzione. Non stimare una mediana finché non esistono sessioni reali.

## Rook — QA automatica, 2026-10-26

Nessun partecipante umano. Fixture Blackout corrente seguita da input ordinari nel browser con clock accelerato; reload boss, combattimento, seconda fase, scelta Rifugio e reload della scelta. Zero retry automatici nel ricontrollo finale; due in una prova precedente. Non si deduce un miglioramento umano da queste differenze. `docs/evidence/v10.2/rook-report.json` e screenshot conservano i risultati. Questi tempi non misurano la durata umana o la mediana di due ore. Occorre ancora verificare con persone nuove lettura della mira, disarmo mine, uso effettivo delle coperture e motivi di sconfitta.

## Kit/Tessa e recupero — QA automatica successiva

Zero partecipanti umani e zero nuovi dispositivi fisici. A/B/C completi nel browser, 31 tappe/otto incarichi/due preparazioni ciascuno; clock accelerato, nessuna mediana umana di due ore deducibile. Fixture dichiarate verificano entrambe le consegne, touch, munizioni/ricarica e persistenza, oltre al recupero dei boss/hub e Gesso. Dodici combinazioni protagonista/viewport controllano geometria e testi. I rapporti correnti sono indicizzati in `FIELD_KIT.md`. Comprensione, difficoltà, gusto artistico, ascolto e durata restano da misurare con persone nuove.

## V10.3 — stima della durata (ESTIMATE_NOT_HUMAN), 31 ottobre 2026

**Sessioni umane: ancora 0.** Questa sezione contiene solo una **stima** ricavata da un modello. Non sostituisce le misure su persone.

**Metodo.** I giri automatici completi A/B/C girano con orologio virtuale. `tools/verify_campaign_browser.cjs` attribuisce ogni passo da 130 ms a una sola attività e registra le parole effettivamente lette. Il modello di `tools/estimate_playtime.mjs`:
- fattore 1,6 per il combattimento e 1,3 per navigazione e gare;
- lettura a 180 parole al minuto, più 1,2 s per ogni avanzamento;
- +25% sui boss;
- minimo e alto dichiarati.

**Risultato:**
- campagna obbligatoria: rotta A probabile 42 min (30–58), rotta B probabile 45 min (32–63), rotta C probabile 38 min (27–53);
- facoltativi, mai sommati: circa 13 min;
- obiettivo: 105 min. **La stima dice che oggi non è raggiunto.**

**Rapporti:** [`PLAYTIME_ESTIMATE.md`](../evidence/v10.2/playtime/PLAYTIME_ESTIMATE.md). Proposte: [`PLAYTIME_EXPANSION_PROPOSAL_V10_3.md`](PLAYTIME_EXPANSION_PROPOSAL_V10_3.md). Protocollo umano: [`PLAYER_MOTIVATION_V10_3.md`](PLAYER_MOTIVATION_V10_3.md).

## M2 — da provare sul telefono e con persone

Nessuna persona ha ancora provato M2: le prove di M2 sono automatiche o nel browser del PC. Lo stato di M2 è in [STATO.md](STATO.md). M1 è rimandata a fine lavoro (D33): queste prove si fanno lì, su un telefono Android vero e, per il gamepad, con un controller vero.

- **Latenza di C1.** SCHIVA, DUO e ATTIVA partono al tocco: il giocatore sente la risposta immediata? Un tocco su DUO in ricarica, rilasciato dopo la fine della ricarica, ora va perso: va bene così?
- **Sensazione del buffer di N1.** Un tocco poco prima della fine di una ricarica parte da solo appena si può: aiuta o sorprende? Nel rallentamento della Perfect Dodge e nel tutorial la memoria dura di più in tempo reale.
- **Leggibilità del fermo di G1.** Il fermo di 2, 4 o 6 frame si nota sul telefono? Si legge anche con «movimento ridotto», senza lampo?
- **Chrono Shift.** Si capisce quando parte e quando finisce? I nemici più lenti aiutano senza confondere?
- **Tocco breve su Start in pausa** con un controller vero: il gioco riprende?
- **Rilascio di B dopo lo scatto** con un controller vero: il rilascio viene letto?

La stima della durata del 31 ottobre (sezione sopra) è precedente a N1 e CS e non è stata rifatta.
