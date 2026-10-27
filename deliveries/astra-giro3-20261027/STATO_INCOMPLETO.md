# Stato della consegna Astra giro 3

Aggiornamento sulla richiesta revisione 4, letta dal ramo `work/chronos-adventure-commercial` al commit `ddd5d29d09eff55e2af4ad501a410a764f0fa7c2`. Consegna **incompleta**: nessun nuovo asset è dichiarato pronto o integrabile. Non sono stati aggiunti ZIP o file artistici di consegna.

## Verifica dei materiali

Prima della lavorazione sono stati confrontati byte e SHA-256 dei due ZIP con `requests/astra-giro3-20261027/INDICE.json` revisione 4:

- AMBIENTE: 10.619.493 byte; SHA-256 `0282c805db0ff4ee237603f4ced32ff161278be4990bcabdfca7f896b60dae6e` — corrisponde.
- PERSONAGGI: 12.047.725 byte; SHA-256 `359ada619c01cd83fa581db1b4ca9b8882e539011747419e1b4e7871bdab9fbf` — corrisponde.

Questi valori sostituiscono quelli della verifica precedente, relativi a una revisione precedente della richiesta.

## G6/G7: aperti

La decisione A e la precisazione sulla scala risolvono il conflitto riportato nella precedente versione di questo documento: le basi restano quelle di runtime, il margine di 12 px vale sopra e ai lati, e `body_height` delle righe 1–3 non è l'obiettivo perché può comprendere effetti. Non si assume più che il valore 300 della cella Lulù riga 1 colonna 1 sia altezza del solo corpo.

Un tentativo di modifica con image_gen del riferimento `nox_vx9_gun` e dell'icona H-17 ha prodotto un master 1306×1205. Il formato è correggibile in esportazione, ma la modifica ha alterato anche il personaggio: nella sola regione della testa x 140–189, y 40–79, 1.865 pixel RGBA su 2.000 differiscono dal riferimento. Inoltre si osservano effetti che raggiungono celle adiacenti. Non è stato ottenuto uno sheet che preservi il corpo di riferimento e rispetti l'isolamento richiesto. Non sono stati prodotti gli altri due sheet né i rapporti per cella. Nessun tentativo è consegnato come asset.

## G4: aperto

Un tentativo con image_gen ha rimosso la segnaletica dal master giorno esistente; un secondo passaggio ha ridipinto la vecchia giunzione dopo uno spostamento verticale. Nel master intermedio 887×1774, la differenza media RGB tra le due righe della giunzione ridipinta è 6,19, rispetto a 5,84 mediamente tra righe adiacenti dell'immagine. Questa è una misura del master intermedio, **non** la misura richiesta sulle righe 1439 e 0 del file finale. Non è stata verificata un'esportazione 720×1440 con carreggiata x 130–590, né tracciata e misurata la segnaletica finale; manca anche la versione notte con la stessa geometria. Nessun tentativo è consegnato come asset.

G12 è già sistemato dal team e non è stato rifatto. La ricarica ARC-7 e gli altri elementi indicati come integrati o conservati non sono stati rifatti. Nessun test di gioco, approvazione artistica o ascolto è stato effettuato. Per chiudere la richiesta servono asset conformi, master, rapporti di misura, provenienza e indici e archivi richiesti.
