# CHRONOS V10 ASSET INTEGRATION — release gate

COMMERCIAL_RELEASE = BLOCKED

HEAD BEFORE: `84d2e45ca752e62aa491b022fb239b04c2c62ce1`.
HEAD AFTER: usare il commit di integrazione che contiene questo report,
ottenibile con `git log -1 --format=%H -- docs/V10_RELEASE_GATE.md`.
Un documento non può contenere il proprio hash Git prima di essere committato.

Generatore importato da `cb26253ac4f83ba019a90912c699aa8651a439c1`.
Baseline remota verificata con fetch, worktree isolato e branch dedicato
`work/v10-asset-integration`. Le modifiche locali del checkout iniziale
rimangono intatte. Nessun AGENTS.md applicabile trovato nel repository.

## Gate

| Gate | Stato | Motivo |
|---|---|---|
| ART_GATE | BLOCKED | Tavole V8.5 corrotte; revisione finale mancante |
| SPRITE_GATE | BLOCKED | Prototipi schematici, stati player incompleti; nessuna sostituzione |
| AUDIO_GATE | BLOCKED | Dieci campioni parziali; ascolto, licenze e famiglie complete aperti |
| MUSIC_GATE | BLOCKED | Nuovi score, brief e tre loop non verificati |
| GAMEPLAY_GATE | BLOCKED | Espansione regioni/incontri/missioni e armi/gare non completata |
| MOBILE_UI_GATE | BLOCKED | Screenshot browser disponibili; UX umana e Android aperti |
| PERFORMANCE_GATE | BLOCKED | Probe browser seriale passa; hardware Android non misurato |
| PLAYTEST_GATE | BLOCKED | Nessun playtest umano e durata ~120 min misurata |

## Contabilità

- ASSETS FOUND: 570 file effettivi nel runtime-only pack, inclusi documenti
  e reference; 442 righe/requisiti, non 442 famiglie commercialmente finite.
- ASSETS REUSED: 0 nuove assegnazioni di righe V10 certificate REUSE.
  Gli asset precedenti sono preservati; non si pretende di averli ricertificati.
- ASSETS ADAPTED: 0 file media trasformati in questo strike.
- ASSETS NEW: 10 campioni copiati, collegati per evento, qualità PROTOTYPE.
- ASSETS REJECTED: 432 requisiti esclusi dalla consegna runtime di questo pass.
  REJECT è una decisione di shipping; non sono 432 revisioni visive individuali.
- SPRITES / VFX / UI / REGIONS / BOSSES / RACING: produzione V10 aperta;
  nessuna falsa promozione del pack. Racing preview separata.
- AUDIO: integrazione parziale e prove tecniche documentate.
- MUSIC: nessuna musica V10 importata come finale.

Il contatore del generatore stampa 569 perché calcola prima di scrivere
PACKAGE_INVENTORY.json; il censimento successivo effettivo conta 570.
Non si ripete la stima di 756 file come risultato verificato runtime-only.

## Blocchi e ripresa

1. Recuperare copie decodificabili delle tavole V8.5 e gli output AutoSprite
   effettivi; poi confronto individuale e produzione dei personaggi.
2. Completare le famiglie asset con identità e stati funzionali reali.
   I 432 requisiti esclusi non sono automaticamente soddisfatti dagli asset vecchi.
3. Integrare campagne, regioni, incontri, armi, gare, IT/EN e relativi asset.
4. Riconciliare i 129 brief originali; produrre e ascoltare audio/music system.
5. Eseguire QA Android fisica, prestazioni e playtest umani della durata.
6. Solo dopo i gate: SDK/API/build-tools 36 e chiave privata di upload
   esistente, verifiche di firma e AAB Play. Non generarne una sostitutiva.

Disponibile SDK 35 per l'APK debug; SDK 36 e dispositivo Android non
verificabili qui. Nessun AAB commerciale prodotto, nessuna pubblicazione.
L'APK debug è una candidata QA tecnica, non una consegna commerciale.
I 74 criteri originari e AS01–AS12 non sono promossi da questo report.

## Prossimo blocco eseguibile

Con reference valide: character sheet canonico → stati mancanti → pulizia
atlas/pivot → confronto runtime → Android → revisione. In parallelo alle
dipendenze artistiche, continuare le integrazioni gameplay riportate aperte;
questa consegna tecnica non equivale a chiusura del mandato V10.
