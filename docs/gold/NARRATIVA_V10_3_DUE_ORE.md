# Revisione narrativa V10.3 — campagna da circa 2 ore

Stato: **PROPOSED**. Serve l'approvazione dell'autore prima di scrivere codice. `COMMERCIAL_RELEASE = BLOCKED`.

Base: la stima di oggi è di 38–45 minuti probabili (ESTIMATE_NOT_HUMAN). L'obiettivo è circa **120 minuti di campagna obbligatoria**.

## Regole che non cambiano

- Nox è maschile, Lulù femminile.
- I 19 civili salvati da Lulù con la firma EVE-47 restano la causa morale della frattura.
- Lulù non è una traditrice: ha scelto. Nox non perdona automaticamente.
- Le 31 tappe esistenti restano, con i loro ID: i salvataggi v7 continuano a funzionare. Le tappe nuove hanno ID stabili.
- Hitbox, danni e tempi d'attacco non cambiano. Più spazio di gioco sì, numeri più gonfiati no.

## Struttura in quattro atti

| Atto | Tappe | Minuti stimati | Domanda dell'atto |
|---|---|---:|---|
| I · La città al buio | opening → moon, + **porto di Veyra** | 25 | Chi è Nox, e perché la città lo riconosce? |
| II · La breccia | breach → separation, + **la promessa** | 30 | Fino a dove si spinge Lulù per salvare le persone? |
| III · Due strade | chalk → clockwork, + **Glass Flood** + **Vega** | 45 | Nox e Lulù, separati, diventano persone migliori o più sole? |
| IV · Ora uno | line → postcredits | 20 | Cosa vale la libertà, se il sistema può ricordare tutto per te? |

## Tappe nuove (ID stabili)

1. **`docks_veyra` — Il porto esterno (Atto I, dopo Moon).**
   - Nox incontra Veyra in un vicolo di Ash Docks e deve attraversare il porto a piedi per recuperare un pezzo della Vortex.
   - Alla fine c'è una gara obbligatoria **breve** di presentazione. Le gare complete restano facoltative (D05).
   - Gancio: Veyra ha visto il simbolo dell'orologio spezzato sulle gru.
   - Stima: +8 min.
2. **`promise` — La notte prima del clinico (Atto II, dopo il tetto).** Scena giocabile nel rifugio:
   - Nox e Lulù sistemano insieme la Vortex (collaborazione a due mani: uno tiene, l'altra salda);
   - parlano della promessa di non trasmettere la firma. Questo rende la rottura del clinico più dolorosa;
   - una scelta piccola sposta la fiducia.
   - Stima: +4 min.
3. **`glass_flood` — La riva delle torri (Atto III, ramo di Nox, dopo il porto).**
   - Nox, solo, segue un segnale di EVE nella città sommersa.
   - Contenuti: missione di esplorazione con passerelle e marea, gli abitanti dei pontili, una persona da riportare a riva.
   - Boss: **Shadow Reaper**, che mostra a Nox colpi «possibili» prima di quello reale (solo avviso, il danno arriva al momento vero).
   - Tema: EVE vuole scegliere al posto suo in base al futuro probabile, e Nox impara a non farlo.
   - Stima: +18 min (due tappe: `glass_flood`, `glass_reaper`).
4. **`vega` — La linea di Vega (Atto III, ramo di Lulù).**
   - Lulù affronta Vega, tiratrice che impone il proprio ritmo.
   - Vincendo ottiene il secondo componente: H-17 per Nox e ARC-7 per Lulù entrano in campagna, con recupero per i salvataggi già oltre come per Rook (D08).
   - Tema: Lulù rinuncia a controllare i tempi degli altri.
   - Stima: +10 min.
5. **Missioni esistenti più lunghe.** Ogni missione a piedi riceve una **sezione d'avvicinamento** fatta di moduli di quartiere ripetuti e variati, con:
   - un incontro;
   - una persona da aiutare, con una battuta;
   - un segreto con una ricompensa.

   Le guide diventano più lunghe ripetendo i tratti di strada, con un evento a metà.
   - Stima: +25 min.

Totale stimato: 42 + 8 + 4 + 18 + 10 + 25 + i collegamenti sotto (circa 5) ≈ **112 minuti probabili**. Con gli incarichi resi visibili e un incarico in più per hub, se lo vuoi obbligatorio, si arriva a circa 120.

## Collegamenti narrativi nelle tappe esistenti

- **Fiducia durante la separazione.** Tre decisioni piccole spostano il termico:
  - in chalk, Lulù chiede prima ai residenti;
  - in port, il terminale spento;
  - in below, il rifiuto di EVE.
- **Gesso.** Nel ricongiungimento Nox dice: «I due punti sulle botole. Eri tu.» Lulù: «Non volevo che mi trovassi. Volevo che trovassi la strada.»
- **Creature e spora.** Nell'Archivio, un registro collega i numeri di serie della breccia e la spora alle prime linee di unità di Elyon. Chiude due misteri senza inventare canone esterno.
- **Movente dei boss.** Una riga d'ingresso e una di sconfitta per Rook, The Anchor e il Custode.
- **Veyra.** Il suo atteggiamento cambia in base ai risultati osservati (vittorie, sconfitte, sfide). Nell'epilogo ha una riga sua.

## Domande lunghe e dove rispondono

| Domanda | Risposta |
|---|---|
| Nox e Lulù si fideranno di nuovo? | reunion, rooftop_end (tre toni) |
| Che rapporto c'è fra EVE, Elyon e le anomalie? | archive, glass_reaper, finale |
| Cosa vogliono gli antagonisti? | righe dei boss, Vega, Archon |
| Quale libertà resta? | aftermath: ogni hub mostra il suo «dopo» |
| Chi ha aperto la porta (orologio spezzato)? | seguito dichiarato (Book of Broken Hours) |

## Asset

Le tavole per Glass Flood, Shadow Reaper, Vega, Veyra e i moduli città sono già nei 310 prompt e arrivano da GPT. Le armi H-17 e ARC-7 sono pronte.

## Da approvare

1. Le 5 tappe nuove e l'ordine.
2. Le battute nuove sopra: tono e canone.
3. Facoltativo: un incarico obbligatorio in più per hub.
