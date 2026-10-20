# City Adventure

Avventura d'azione premium per Android (€4,99, acquisto unico, nessuna pubblicità, campagna offline).

**Nox e Lulù.** Una notte di blackout, una breccia sopra il porto, un contagio, un Nodo che si spacca.
Una firma trasmessa senza chiedere li separa; il giocatore vive le due strade alternandole, finché
si ritrovano in cima all'asse e uno dei due batte due volte.

## Stato

**v0.8 — campagna completa giocabile da NUOVA STORIA al finale.** RELEASE_GATE: **BLOCKED**
(vedi [docs/RELEASE_GATE.md](docs/RELEASE_GATE.md) per prove, punteggio e asset mancanti).

- 20 tappe: Atto I insieme, separazione, missioni alternate di Nox e Lulù, ricongiungimento.
- Assalto, buio, difesa, infiltrazione, tre boss, cinque corse (inseguimento e tunnel al buio inclusi).
- 7 scelte persistenti con conseguenze vissute anche dall'altro protagonista; 3 varianti del finale.
- Salvataggio v6 con migrazione dai checkpoint v4/v5.

## Documenti

- [Campagna v0.8](docs/V08_CAMPAIGN.md) — struttura, scelte, conseguenze, identità di gioco, musica.
- [RELEASE_GATE](docs/RELEASE_GATE.md) — evidenze, punteggio commerciale, condizioni di sblocco.
- [Canone narrativo v6.0](docs/NOX_LULU_NARRATIVE_FUSION_V60.md) · [Piano v7.0](docs/MASTER_DEVELOPMENT_PLAN_V70.md) · [Bibbia visiva v7.0](docs/SPRITE_VISUAL_PRODUCTION_BIBLE_V70.md)

## Sviluppo

```bash
npm test                                   # logica, scelte, salvataggi, bundle Android
cd game && python3 -m http.server 8090     # gioco nel browser
node tools/verify_campaign_browser.cjs http://127.0.0.1:8090/index.html a out-a   # partita completa
node tools/visual_tour.cjs http://127.0.0.1:8090/index.html tour                   # screenshot in 4 viewport
ANDROID_SDK_ROOT=… bash tools/build_apk.sh  # APK debug (platform 35, build-tools 35.0.0)
python3 tools/compose_soundtrack_v08.py    # rigenera i temi originali v0.8
```
