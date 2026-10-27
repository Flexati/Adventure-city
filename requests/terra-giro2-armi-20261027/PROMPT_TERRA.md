# Prompt per GPT 6.1 Terra — giro 2, armi con maschera

Incolla tutto il blocco qui sotto in Terra.

```
Giro 2 di CHRONOS Adventure: Nox & Lulù: H-17 «Needle» e ARC-7 «Choir» negli sheet del gioco. Non serve l'ambiente di esecuzione: usa solo la modifica d'immagine con maschera e GitHub.

MATERIALE
Repository Flexati/Adventure-city, ramo work/chronos-adventure-commercial, cartella requests/terra-giro2-armi-20261027/pacchetti/. Ci sono quattro sheet: nox_vx9_gun, nox_vx9_reload, lulu_r12_gun, lulu_r12_reload. Ognuno ha 16 celle in celle/:
- <sheet>_r<riga>c<colonna>.png: la cella ingrandita 3 volte, su verde puro #00FF00;
- <sheet>_r<riga>c<colonna>_mask.png: la maschera, stessa misura. Bianco = puoi modificare. Trasparente = non toccare.
<sheet>_zones_view.png mostra tutte le zone in magenta sopra lo sheet.
Le tue viste delle armi sono sul ramo delivery/terra-giro1-20261027, in deliveries/terra-giro1-20261027/master/: h17_side, h17_back, h17_front, h17_diag_back, h17_mag, h17_flash, arc7_side, arc7_back, arc7_front, arc7_diag_back, arc7_cell, arc7_burst.

COSA FARE, CELLA PER CELLA
Per ogni cella usa la modifica d'immagine con la maschera della cella. Dentro la maschera sostituisci l'arma vecchia con quella nuova; il resto dell'immagine non conta, il team lo scarta.
- nox_vx9_gun e nox_vx9_reload: H-17 «Needle», fucile di precisione bianco e nero con celle azzurre e mirino.
- lulu_r12_gun e lulu_r12_reload: ARC-7 «Choir», emettitore nero e viola con tre anelli e antenna.
- Vista per riga: 0 lato (side), 1 schiena (back), 2 fronte (front), 3 diagonale di schiena (diag_back). Stessa direzione e stessa inclinazione dell'arma vecchia.
- Colonne del tiro: 0 anticipo, 1 rilascio (H-17: lampo stretto e lungo come un ago, h17_flash; ARC-7: scarica breve viola, arc7_burst), 2 rinculo (H-17: bossoli piccoli come nel riferimento; ARC-7: scintille viola, niente bossoli), 3 recupero.
- Colonne della ricarica: 0 abbassa, 1 estrai (in mano il caricatore h17_mag o la cella arc7_cell), 2 inserisci, 3 pronta.
- Ridisegna le mani sull'impugnatura con la stessa pelle e lo stesso stile. Nox è maschile, Lulù è la protagonista femminile: volto, capelli e vestiti fuori dalla maschera non si toccano.
- L'arma nuova può essere più lunga o più grossa della vecchia, ma deve restare dentro la maschera.
- Dove non c'è niente lascia il verde #00FF00. Stessa misura del file di partenza: non ritagliare, non ridimensionare.
Salva ogni risultato come <sheet>_r<riga>c<colonna>_edit.png (per esempio nox_vx9_gun_r0c0_edit.png).

CONSEGNA
Ramo delivery/terra-giro2-armi-20261027 di Flexati/Adventure-city, cartella deliveries/terra-giro2-armi-20261027/<sheet>/. Comincia da nox_vx9_gun: carica le 16 celle e fai un commit, poi passa agli altri sheet, un commit per sheet. Aggiungi PROVENIENZA.json (strumento, data, condizioni d'uso reali per ogni file) e STATO.md (cosa è fatto e cosa no). Se una cella non riesce, saltala e scrivilo in STATO.md: il team tiene l'arma vecchia in quella cella finché non arriva.
Non serve dichiarare PASS: composizione e controlli li fa il team. Non dichiarare approvazioni o test non fatti. Nessuna credenziale nei file.
```
