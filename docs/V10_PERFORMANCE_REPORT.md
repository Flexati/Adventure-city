# V10 performance

PERFORMANCE_GATE = BLOCKED per assenza di misure Android fisiche.

Dieci SFX brevi, caricati una volta con promessa condivisa; nessuna musica
decodificata in heap aggiunta. Guardia di durata <=2 secondi e <=2 canali.
Il limite voci preesistente è 24. Nessuna nuova texture runtime.
Reference, WAV master e 432 requisiti esclusi non sono copiati nell'APK.

## Misure effettive

`artifacts/v10/performance-initial.json`: prima prova browser headless,
CPU rallentata 4×, con altre attività QA/build concorrenti.
Below p95 19.2 ms: FAIL rispetto alla soglia di callback 16 ms.
Questo risultato è conservato, non cancellato dalla prova successiva.

`artifacts/v10/performance-serial.json`: ricontrollo seriale dello stesso
codice, 390×844, DPR richiesto 1.75, CPU 4×:

| Scena | Callback frame p95 |
|---|---:|
| Below | 7.5 ms |
| Archive | 5.4 ms |
| Tunnel | 4.1 ms |

PASS del solo probe seriale. La concorrenza è una differenza osservata di
condizioni, non una dimostrazione causale definitiva della prima anomalia.
I JSON riportano anche gap di presentazione, FPS, voci e memoria audio.
Non convertire CPU 4× del browser in una certificazione di Android mid-range.

Restano NOT_TESTED: GPU Android, overdraw reale, termiche, memoria di processo,
pressione dei decoder, sessioni sostenute e intera campagna sui dispositivi.
I VFX V10 non importati non hanno una falsa misura GPU di zero: sono esclusi.
