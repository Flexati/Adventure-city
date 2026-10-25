# Asset prodotti — V10.2

`chalk_flask-master.png` è il master effettivamente generato con `image_gen` durante questa lavorazione: borraccia industriale teal, tappo rame, due segni di gesso, sfondo trasparente. Nessun ritratto o sprite di Nox/Lulù è stato rigenerato. Il master conserva l'esportazione originale del generatore.

L'export runtime è `game/art/v09/chalk_flask.png`, 48×64 RGBA, derivato con:

```sh
ffmpeg -i assets/production/v10.2/chalk_flask-master.png -vf scale=48:64:flags=neighbor -frames:v 1 game/art/v09/chalk_flask.png
```

La riduzione serve al renderer mobile: 12.288 byte decodificati per l'export, rispetto a 6.290.112 byte per il master 1086×1448. Il master rimane fuori dal pacchetto Android. L'oggetto viene disegnato nella scena `below`, accanto al civile che segue la traccia fisica dopo `Segni di Gesso`.

Provenienza, hash e prove sono in `docs/gold/ASSET_REGISTER.json` e `docs/evidence/v10.2/chalk-scene-report.json`. La prova browser copre entrambe le rotte e il caricamento dei file. Non attesta diritti commerciali, ascolto, qualità finale o resa Android fisica. La famiglia di regia della scena resta PARTIAL: sono ancora necessarie revisione dei gesti e verifica della presenza del civile durante il combattimento.
