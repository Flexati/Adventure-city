# Lotto Astra P1 — candidati prodotti da Codex

Base verificata e preservata: d019eb4, inclusi i quattro blocchi Opus. Nessuna modifica al gameplay. Il conteggio 192/192 e le campagne sono prove del lavoro precedente, non nuove verifiche di questi file.

## Direzione artistica

G1: quattro ritratti Veyra 512×512 estratti da master generato con riferimento di stile ai ritratti V8. G2: 16 pose della stessa identità, isolate e impaginate in celle 340×340, baseline 320 e margine minimo 20; sorgente conservata. Rigenerazione con tools/pack_veyra_p1.py. Seguita la sequenza G2 dell'Excel (idle, walk, seguimi, braccia conserte); il documento precedente chiedeva saluto invece di cammino: conflitto documentato, prevale il foglio più recente. Il master tocca il bordo superiore: verificare la linea dei capelli; loop e passaggi richiedono revisione. G3: auto rust-red, otto stati, export 1536×512 con celle 384×256. Il fumo e le scintille sono vicini ai bordi; la richiesta dei margini non è ancora accettata. Non sostituire l'auto runtime senza controllare i crop.

## Audio

A1–A4: 16 export OGG con 16 master FLAC 48kHz. Due colpi fisici sintetizzati distanziati 0,5 s, varianti/risposta/lontano/senza risposta; cinque cue gare; due loop Veyra 80 s a 96 BPM; tiro e ricarica H17/ARC7. Composizione e sintesi originali senza campioni esterni; codice tools/compose_astra_p1.py, partitura e misure AUDIO_PRODUCTION.json. Il sorpasso è stereo con compatibilità mono. Le versioni giorno/notte condividono intenzionalmente il motivo ma cambiano basso/percussioni/densità. Picchi degli export decodificati controllati; nessuna prova di ascolto umano, qualità percepita della giunzione o mix su telefono. Prodotto non significa approvato.

## Coerenza narrativa

Veyra è una rivale adulta del porto, tuta riparata e occhiali, quattro espressioni previste. Aspetto originale specificato per questa produzione; nessun dialogo o canone riscritto. Nox resta come negli sheet esistenti; la dicitura ricevuta «Nox è una lei» è stata corretta dall’autore: Lulù è la protagonista femminile. Nessun ritocco dei protagonisti in questo lotto. Nessun nuovo contenuto P3 finale prima delle regole dell'incontro.

## Consegna e lacune

DELIVERY_MANIFEST.json collega file, hash e dimensioni. Questi sono candidati da integrare e verificare, non COMMERCIAL_READY. G4–G10 restano aperti: strade e props Ash Docks; sheet H17/ARC7; icone; cinque famiglie VFX; ritratti stranieri. Anche G1–G3 e A1–A4 rimangono parziali fino ai controlli pertinenti. Nessun gate commerciale chiuso.
