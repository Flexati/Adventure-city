# Catalogo grafica e audio 0.5

I PNG sono output originali di generazione, copiati senza ritocco. PROMPTS.json conserva le istruzioni; ASSETS.json dimensioni, trasparenza e SHA-256. Le mappe a piedi di 0.4 restano attive; questa estensione aggiunge atlanti coerenti e la strada delle missioni di guida.

| Asset | Griglia e uso |
| --- | --- |
| nox_walk, lulu_walk | 4×4: frontale, dorso, cammino laterale, corsa laterale; sinistra specchiata |
| nox_actions, lulu_actions | 4×4: schivata, danno, caduta, Duo |
| nox_gun, lulu_gun | 4×4: destra, alto, basso, diagonale; mira, lampo, rinculo, recupero |
| nox_magic, lulu_magic | 4×4: direzioni degli attacchi magici |
| gang_states, alien_states, infected_states, custodian_states | 4×4: cammino, attacco, danno, sconfitta |
| fx_atlas | 4×4: impatto ciano, falce magenta, lampo ambra, anello viola; impatti integrati |
| weapon_icons | 4×4: quattro fasce tecnologiche; una icona per capitolo usata nell’HUD |
| district_props | 4×4: dispositivi per capitolo; altre varianti riservate |
| menu_keyart | Sfondo con testo e controlli HTML separati |
| driving_road | Strada verticale scorrevole senza ostacoli incorporati |
| driving_cars | 4×4: nel gioco solo riga 3 (danni verso nord) e riga 4 (veicoli ostili) |

## Limiti

Gli atlanti sono candidati per il prototipo, non animazioni rifinite manualmente. Alcuni bagliori raggiungono i bordi delle celle e alcune pose variano di scala o prospettiva: serve rifinitura prima della pubblicazione commerciale. Le orientazioni delle prime due righe del veicolo non rispettano tutte la sequenza richiesta e non sono usate. Le icone aggiuntive non equivalgono ad armi implementate. Il compagno segue a piedi e interviene tramite Duo; non è multiplayer.

La guida ha fisica arcade semplificata, ostacoli deterministici, collisioni, danni, obiettivi e ripresa dall’inizio della corsa. Non ha traffico con IA, cambio manuale, inseguimenti fisici o interni dell’auto. I soccorsi sono un obiettivo di sosta, senza animazione individuale di imbarco.

## Audio

Titolo, blackout, breccia, contagio, finale e guida hanno arrangiamenti sintetizzati originali. Sorgente Python, MIDI e note JSON sono inclusi. La generazione è locale: il servizio musicale esterno non aveva crediti disponibili. La QA numerica controlla decodifica, valori finiti, segnale presente e assenza di clipping; non sostituisce una revisione all’ascolto. Nessun campione o melodia di Zelda è stato riutilizzato.
