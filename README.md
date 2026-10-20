# City Adventure

Avventura d'azione premium per Android (€4,99, acquisto unico, nessuna pubblicità, campagna offline).

**Nox e Lulù.** Una notte di blackout, una breccia sopra il porto, un contagio, un Nodo che si spacca.
Una firma trasmessa senza chiedere li separa; il giocatore vive le due strade alternandole, finché
si ritrovano in cima all'asse e uno dei due batte due volte.

## Stato

**v0.9-rc.1 — campagna completa, mappe modulari, finale illustrato e audio dinamico.** RELEASE_GATE: **BLOCKED**
(vedi [docs/RELEASE_GATE.md](docs/RELEASE_GATE.md) per prove, punteggio e asset mancanti).

- 20 tappe: Atto I insieme, separazione, missioni alternate di Nox e Lulù, ricongiungimento.
- Assalto, buio, difesa, infiltrazione, tre boss, cinque corse (inseguimento e tunnel al buio inclusi).
- 7 scelte persistenti con conseguenze vissute anche dall'altro protagonista; 3 varianti del finale.
- Quattro nuove geometrie per dieci missioni, collisioni e navigazione condivise; palette cian/ambra.
- Illustrazione del ricongiungimento, tre sfondi del finale, SFX/ambienti Web Audio e master protetto.
- Salvataggio v6 con migrazione dai checkpoint v4/v5.

## Documenti

- [Campagna v0.8](docs/V08_CAMPAIGN.md) — struttura, scelte, conseguenze, identità di gioco, musica.
- [RELEASE_GATE](docs/RELEASE_GATE.md) — evidenze, punteggio commerciale, condizioni di sblocco.
- [Canone narrativo v6.0](docs/NOX_LULU_NARRATIVE_FUSION_V60.md) · [Piano v7.0](docs/MASTER_DEVELOPMENT_PLAN_V70.md) · [Bibbia visiva v7.0](docs/SPRITE_VISUAL_PRODUCTION_BIBLE_V70.md)

- [Protocollo cieco v0.9](docs/BLIND_PLAYTEST_V09.md) — schede, criteri e prove ancora da raccogliere.
- [Asset v0.9](docs/art-v09.json) — provenienza e rigenerazione.

## Sviluppo

```bash
npm ci                                     # strumenti QA, nessuna dipendenza a runtime
npm test                                   # logica, scelte, salvataggi, bundle Android
cd game && python3 -m http.server 8090     # gioco nel browser
node tools/verify_campaign_browser.cjs http://127.0.0.1:8090/index.html a out-a   # partita completa
node tools/visual_tour.cjs http://127.0.0.1:8090/index.html tour                   # screenshot in 4 viewport
ANDROID_SDK_ROOT=… bash tools/build_apk.sh  # APK debug (platform 35, build-tools 35.0.0)
python3 tools/compose_soundtrack_v08.py --v09 # rigenera i quattro temi v0.9
python3 tools/build_finale_art.py          # rigenera i tre sfondi SVG del finale
node tools/verify_audio_v09.cjs http://127.0.0.1:8090/ audio.json
node tools/verify_runtime_v09.cjs http://127.0.0.1:8090/ runtime.json
node tools/verify_performance_v09.cjs http://127.0.0.1:8090/ performance.json
```

Per i test browser installare Chromium con `npx playwright install chromium`, oppure impostare
`CHROMIUM=/percorso/chromium`. Il benchmark va eseguito da solo: altri browser alterano i tempi.
La nuova CI Web QA esegue test, rendering audio, lifecycle e benchmark; non pubblica il gioco.

La regressione completa può usare `CITY_VIRTUAL_TIME=1` per avanzare il clock del browser con
input reali e regole invariate. I report marcano questa modalità: non è una misura di durata
umana o prestazioni. Per il benchmark il clock rimane sempre reale.

Su dispositivi sotto carico la sola scena adatta la risoluzione per preservare il tempo del frame;
HUD e testi rimangono nativi. I report prestazionali registrano anche il pixel ratio effettivo.

Per rigenerare la musica servono anche Python con NumPy e `ffmpeg`.
