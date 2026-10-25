# Asset prodotti — V10.2

`chalk_flask-master.png` è il master effettivamente generato con `image_gen` durante questa lavorazione: borraccia industriale teal, tappo rame, due segni di gesso, sfondo trasparente. Nessun ritratto o sprite di Nox/Lulù è stato rigenerato. Il master conserva l'esportazione originale del generatore.

L'export runtime è `game/art/v09/chalk_flask.png`, 48×64 RGBA, derivato con:

```sh
ffmpeg -i assets/production/v10.2/chalk_flask-master.png -vf scale=48:64:flags=neighbor -frames:v 1 game/art/v09/chalk_flask.png
```

La riduzione serve al renderer mobile: 12.288 byte decodificati per l'export, rispetto a 6.290.112 byte per il master 1086×1448. Il master rimane fuori dal pacchetto Android. L'oggetto viene disegnato nella scena `below`, accanto al civile che segue la traccia fisica dopo `Segni di Gesso`.

Provenienza, hash e prove sono in `docs/gold/ASSET_REGISTER.json` e `docs/evidence/v10.2/chalk-scene-report.json`. La prova browser copre entrambe le rotte e il caricamento dei file. Non attesta diritti commerciali, ascolto, qualità finale o resa Android fisica. La famiglia di regia della scena resta PARTIAL: sono ancora necessarie revisione dei gesti e verifica della presenza del civile durante il combattimento.

## Sprite sheet prodotto

`chalk_flask-states-master.png` è una nuova generazione effettiva basata sul master della borraccia: quattro stati fisici distinti, con acqua e tappo diversi. L'export `game/art/v09/chalk_flask_states.png` misura 192×64, quattro celle 48×64. Gli hash separati delle celle sono nel registro asset. Nel gioco i frame seguono accesso inattivo, interazione prima/dopo metà avanzamento e accesso attivo; interrompere l'interazione ripristina il frame vuoto. Il callback del civile usa il frame chiuso. Il file statico precedente rimane conservato; non viene contato come nuova produzione.

## Musica composta e sintetizzata

`chalk-route-master.flac` contiene la composizione originale «Una strada per chi torna»: 40 secondi, 16 battute a 96 BPM in re dorico, mallet, basso, pad e percussioni meccaniche sintetizzate. Nessun campione o registrazione esterna. `chalk-route-score.json` conserva tutti gli eventi; `tools/compose_chalk_score.py` riproduce master ed export Ogg `game/audio/v10/chalk_route.ogg`. La traccia è usata da `exp_chalk_marks` tramite il direttore audio, con pausa/ripresa e mix ducking esistenti.

La richiesta a Creative Claw/ElevenLabs è stata bloccata prima della generazione per saldo zero, senza addebito; questo FLAC è prodotto localmente e non è un output di quel servizio. Il blocco è registrato senza informazioni private sull'account. `chalk-route-metrics.json` conserva durata, picco, RMS, discontinuità campionaria al bordo e clipping: nessun campione decodificato supera il fondo scala. Il raccordo deve ancora essere ascoltato; una metrica non attesta un loop musicalmente fluido. Nessun ascolto umano o mix finale è dichiarato.
