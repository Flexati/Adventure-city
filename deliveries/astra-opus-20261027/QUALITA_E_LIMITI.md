# Risultati e limiti

## Verificato
Baseline Flexati/Adventure-city work/chronos-adventure-commercial, commit 71a35ec; 199 test passati, zero falliti. Audio A5: otto file in due formati, 48 kHz, SFX <=1,5 s e loop 80 s; picchi dei campioni dopo decodifica OGG sotto −1 dBFS. Misure e hash in audio_A5/validation.json. Non sono misure true-peak.
Export grafici: dimensioni, griglie e posizionamento registrati automaticamente. Master e file precedenti preservati. Le dimensioni di un export non attestano la qualità del contenuto.

## Da controllare prima dell'accettazione
- G3: confrontare il fumo e gli effetti con i master. Il candidato precedente era respinto; la nuova impaginazione non dimostra da sola assenza di tagli nel master.
- G4: i bordi superiore/inferiore non sono garantiti identici; misurare la giunzione, provare lo scorrimento e correggere la carreggiata se differisce da x130–590. Non dichiarare tile seamless finché non supera il controllo.
- G5: checkpoint e container generati possono avere una prospettiva più inclinata della richiesta dall'alto; confrontare con la gara.
- G6/G7: la generazione non garantisce invarianza pixel per pixel del corpo. Confrontare viso, capelli, abbigliamento e proporzioni con gli originali. Il crop per cella può tagliare VFX attraversanti: controllare source_touched_edge. Verificare baseline piedi e scala comune tiro/ricarica.
- G8: verificare i quattro colpi visibili della camera H17; nel master l'icona può mostrare soltanto tre elementi luminosi. Verificare corrispondenza con l'arma impugnata.
- G9: leggere la sequenza dei 60 frame contro i tre tipi di evento; alcuni aloni raggiungono celle adiacenti nel master. Verificare distinzione in grigio.
- G10: i busti sono deliberatamente tagliati inferiormente; verificare che testa/spalle non siano involontariamente tagliate. Fedeltà agli stranieri da approvare rispetto ai riferimenti.
- G11: la prima versione collega alcune cime fra celle; preservata come sorgente diagnostica. La revisione con cime separate richiede comunque valutazione dei 32 stati e delle transizioni.
- G12: il cavo include terminali, quindi non è ancora un segmento ripetibile certificato. VFX e materiale delle cime devono restare coerenti col boss.
- Audio: nessun ascolto umano, prova altoparlante Android o verifica del mix attestati. Valutare in particolare il loop OGG e l'intelligibilità del lock a 0,6875 s.

## P2/P3
Le 460 righe includono richieste nuove, verifiche di esistenti ed esclusioni. P2/P3 non sono stati tutti generati: i file esistenti e i requisiti completi sono inclusi per proseguire senza inventario mancante. Nessun cambio di stato commerciale automatico.

## Provenienza
Nuove immagini: OpenAI image_gen, con riferimenti forniti dall'autore; successiva impaginazione tecnica con Pillow, senza disegnare nuove figure. Audio A5: sintesi/composizione originale numpy/scipy/ffmpeg, nessun campione esterno, parametri inclusi. Materiali precedenti: recuperati dal repository Flexati, mantenendone registri e condizioni dichiarate. Nessuna licenza ulteriore, approvazione o titolarità dei riferimenti viene inventata; si applicano i termini reali del servizio e le verifiche del progetto.
