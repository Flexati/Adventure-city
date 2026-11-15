# Prompt per GPT 6.1 Terra — giro 1

Incolla tutto il blocco qui sotto in Terra.

```
Sei il produttore di asset di CHRONOS Adventure: Nox & Lulù, avventura d'azione premium offline per Android (pixel art dettagliata vista dall'alto 3/4, fantascienza industriale abitata, luce dall'alto a sinistra). Il livello richiesto è quello dei grandi classici: ogni pixel deve servire al gioco.

REPOSITORY E MATERIALE
- Repository Flexati/Adventure-city, ramo work/chronos-adventure-commercial. Non usare amzajaguar-blip/City-Adventure-.
- Cartella requests/terra-giro1-20261027/: questo prompt, README.md, MISURE.json, INDICE.json (byte e SHA-256), archivi/CHRONOS_TERRA_GIRO1_KIT.zip.
- Istruzioni complete: docs/gold/terra/ISTRUZIONI_TERRA_GIRO1.md (anche dentro il kit).
- Prima di lavorare verifica byte e SHA-256 del kit con INDICE.json.

IL KIT
Estrai lo ZIP ed entra in kit/: è un mini-repository con i riferimenti in gioco (game/art/v10/), le celle degli sheet (game/sheet-layout.mjs), le icone delle armi e gli STESSI strumenti di controllo che uso io (tools/). Python 3 con numpy e Pillow. Consegni un punto solo se il suo strumento dà PASS.

TRE REGOLE NUOVE
1. Gli sheet in gioco sono stati puliti: formati e celle nuovi in MISURE.json. Le misure dei giri con Astra non valgono più.
2. Le armi si cambiano DENTRO UNA MASCHERA, il personaggio non si ridisegna: arma, mani ed effetto si generano a parte, poi si compongono sopra il riferimento. Fuori dalla maschera i pixel restano identici byte per byte (out = maschera ? nuovo : riferimento).
3. La notte delle strade è una MAPPA DI LUCI: il gioco scurisce il giorno e somma la tua luce, quindi la geometria è identica per costruzione.

DA PRODURRE

1) G6/G7 — quattro sheet armi, ciascuno con la sua maschera <nome>_mask.png (bianco opaco = pixel toccati)
- nox_h17_gun.png da game/art/v10/nox_vx9_gun.png (1676×1348, celle 419×337)
- nox_h17_reload.png da game/art/v10/nox_vx9_reload.png (1305×1285)
- lulu_arc7_gun.png da game/art/v10/lulu_r12_gun.png (1508×1392, celle 377×348)
- lulu_arc7_reload.png da game/art/v10/lulu_r12_reload.png (1305×1285). La ricarica ARC-7 del giro precedente resta solo riferimento di design.
H-17 «Needle»: fucile di precisione bianco e nero, celle azzurre, mirino; lampo stretto e lungo come un ago. ARC-7 «Choir»: emettitore nero e viola con tre anelli e antenna; in bocca solo una scarica breve (la catena tra i bersagli la disegna il gioco). Seguire le icone nel kit (riferimenti/).
Pose identiche al riferimento cella per cella. Righe: lato, schiena, fronte, diagonale-schiena. Colonne tiro: anticipo, rilascio, rinculo, recupero. Colonne ricarica: abbassa, estrai, inserisci, pronta. Dove sotto l'arma vecchia manca il corpo, completalo dentro la maschera nello stesso stile. Nox è maschile, Lulù è la protagonista femminile: volto, capelli e vestiti non cambiano.
Controllo: python3 -I tools/verify_terra_weapon_sheet.py <riferimento> <sheet> <maschera> <report.json>. Serve PASS. Consegna report e <report>.mask.png.

2) G4 — Ash Docks: tre strade (banchina, gru, deposito)
- ASHDOCKS_road_<variante>_body.png 720×1392, giorno, SENZA segnaletica (i trattini li disegna lo strumento, per ultimi, con ritmo esatto).
- ASHDOCKS_road_<variante>_light.png 720×1392: mappa luci notturna, nera o trasparente dove non c'è luce, al massimo il 50% illuminato. Lampioni caldi, luci rosse delle gru, finestre, riflessi sull'asfalto bagnato.
- ASHDOCKS_joint.png e ASHDOCKS_joint_light.png 720×48: giunto di dilatazione in acciaio con bulloni, bordi diritti alle righe 0 e 47. Ogni tile in gioco = metà inferiore del giunto + corpo + metà superiore: qualunque variante segue qualunque altra senza raccordi.
- Geometria uguale per tutte: marciapiedi x 0–117 e 603–719, cordoli chiari x 118–129 e 590–602, carreggiata in asfalto scuro x 130–589 a cinque corsie, corpo opaco. Nessun oggetto attraversa il bordo alto o basso: ringhiere e recinzioni finiscono con un paletto a 4–8 px dal bordo.
- Banchina: bitte, catene, acqua oltre la ringhiera. Gru: binari e basi delle gru a portale lungo i marciapiedi. Deposito: pile di container e recinzioni.
Controllo e anteprime: python3 -I tools/build_ashdocks_roads.py <cartella> --out=<cartella>/anteprima. Serve PASS. Consegna anche anteprime e rapporto.

3) G5b — container, tre varianti: ruggine, cobalto, verde
- RACE_ashdocks_container_<variante>_{normale,colpito}.png, 128×192, stessa vista di game/art/v10/race_container.png.
- Riquadro opaco x 16–111, y 22–168 (±2), base a y 168, 8 px vuoti sul bordo. «Colpito»: ammaccatura e vernice graffiata dentro lo stesso riquadro. Marchi inventati, nessuna azienda reale.
Controllo: python3 -I tools/verify_terra_containers.py <cartella>. Serve PASS.

NON PRODURRE
Cavo e terminale di The Anchor, «Due colpi» (A1), cancelli di Aurelia Span, Veyra a piedi, e qualunque asset già integrato.

CONSEGNA
- Ramo delivery/terra-giro1-20261027 di Flexati/Adventure-city, cartella deliveries/terra-giro1-20261027/.
- ZIP sotto i 20.000.000 byte ciascuno, INDICE.json con byte e SHA-256 di ogni file e archivio, PROVENIENZA.json con strumento, origine e condizioni d'uso reali per ogni file, master e generazioni intermedie, rapporti e anteprime degli strumenti.
- Un punto si consegna solo con PASS. Se un punto non riesce, consegna gli altri e spiega in STATO.md cosa blocca, con le misure. Niente compromessi non dichiarati.
- Non dichiarare ascolti, approvazioni artistiche o test di gioco non fatti.
```
