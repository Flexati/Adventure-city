# Prompt per GPT — auto dei rivali e immagine per il Play Store (28 ottobre 2026)

Incolla tutto il blocco qui sotto in GPT. Restituisci le immagini al team così come escono: misura, ritaglio, composizione degli sheet e controllo li fa il team.

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù, avventura d'azione per Android. Ti allego come riferimento race_veyra_car.png: l'auto di Veyra, rivale principale, nello stile del gioco. Disegna due auto rivali nuove e un'immagine promozionale.

STILE DELLE AUTO
- Pixel art dettagliata come race_veyra_car.png: contorno scuro di 1 pixel, ombreggiatura a gradini, riflessi netti, luce dall'alto a sinistra.
- Vista esattamente dall'alto, muso verso l'ALTO dell'immagine, fanali posteriori in basso.
- Proporzione della carrozzeria, ruote comprese: larghezza:altezza = 4:5.
- Ogni auto deve distinguersi da quella di Veyra (rame con strisce chiare) e dalla Vortex di Nox e Lulù (grigio scuro con luci azzurre e fucsia) per sagoma e colore, anche vista piccola, alta 110 pixel sullo schermo.
- Marchi, numeri e scritte inventati; nessun marchio reale.

REGOLE DI COMPOSIZIONE DELLE AUTO, OBBLIGATORIE
1. Immagine 1024×1536, sfondo verde puro #00FF00 piatto. Niente ombra a terra, niente strada, niente aloni verdi sull'auto.
2. Un'auto sola, centrata, intera, con 60 px circa di verde su ogni lato.
3. Nessun colore dell'auto vicino al verde #00FF00.
4. Le versioni danneggiate e notturne si ottengono MODIFICANDO l'immagine base della stessa auto: stessa sagoma, stessa misura, stessa posizione. Cambiano solo danni, fumo e luci. Fumo e scintille possono uscire un poco dalla sagoma, mai fino ai bordi.
5. PNG, nome file esattamente come indicato.

AUTO 1 — RIVALE «02»: muscolosa e pesante, telaio largo, verniciata verde petrolio con bande ocra, paraurti rinforzati, luci gialle.
- rival02_base.png: integra, luci spente.
- rival02_danno1.png: graffi e un parafango ammaccato.
- rival02_danno2.png: cofano piegato, vetro incrinato, vernice scrostata.
- rival02_danno3.png: molto danneggiata, fumo grigio dal cofano.
- rival02_notte_a.png: di notte, fari gialli accesi davanti, fanali posteriori rossi accesi.
- rival02_notte_b.png: come notte_a, con in più le luci di posizione laterali gialle accese (si alterna con notte_a per lampeggiare).

AUTO 2 — RIVALE «03»: leggera e affilata, abitacolo stretto e alettone, bianco perla con dettagli viola elettrico, luci viola.
- rival03_base.png, rival03_danno1.png, rival03_danno2.png, rival03_danno3.png, rival03_notte_a.png, rival03_notte_b.png: stesse regole dell'auto 1, con luci viola al posto di quelle gialle.

IMMAGINE PROMOZIONALE PER IL PLAY STORE
- store_feature.png, 1536×1024. La parte importante sta nella fascia centrale alta il 50% dell'immagine, perché il team la ritaglia a 1024×500.
- Scena: notte sul porto di Ash Docks, gru a portale e container, asfalto bagnato con riflessi; la Vortex (grigio scuro, luci azzurre e fucsia) in gara affiancata all'auto di Veyra (rame con strisce chiare), scie di nitro azzurre.
- Pixel art dettagliata come i riferimenti; inquadratura dinamica dal basso 3/4.
- Lascia libero da elementi importanti il terzo sinistro della fascia centrale: lì il team mette il titolo.
- Nessun testo, nessun logo, nessuna persona riconoscibile.

CONSEGNA
Comincia dalle due immagini base. Se un'immagine non rispetta le regole di composizione (sfondo non verde puro, auto tagliata o vicina ai bordi, muso non verso l'alto, proporzioni diverse), rifalla prima di passare alla successiva. Per ogni file indica lo strumento usato. Non dichiarare controlli: li fa il team.
```

## Per il team

- **Auto.** Il team ricava ogni auto dal verde, la porta all'altezza della carrozzeria dell'auto di Veyra (196 px in una cella 384×256, centro 192,128) e compone `race_rival02_car.png` e `race_rival03_car.png` come `race_veyra_car.png`. Riga 0: base e tre danni. Riga 1: vista base, base, notte A, notte B. Poi il gioco disegna ciascun rivale con la sua auto: oggi il rivale «03» usa un'auto della versione precedente vista di lato invece che dall'alto. Controllo: stessa sagoma fra base e danni entro ±2 px (fumo escluso), muso in alto, altezza 196 ± 4 px.
- **Immagine promozionale.** Il team ritaglia `store_feature.png` a 1024×500 e aggiunge il titolo dal logo del gioco.

Riferimento da allegare: `game/art/v10/race_veyra_car.png`.
