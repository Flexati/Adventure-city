# CHRONOS: Nox & Lulù

Nox cerca chi è. Lulù cerca di salvare tutti. Vanta continua a decidere chi sacrificare.
**Puoi proteggere qualcuno senza possederne le scelte?**

Marchio: **CHRONOS: Nox & Lulù**. Vanta è la città; **Chrono Shadows** è il seguito.
[Identità e compatibilità](docs/BRANDING.md).

Canone narrativo **v8.0** · applicazione **0.10.0-v8.0-rc.2** · salvataggi **v7**.
Campagna offline per Android, senza pubblicità. **Rilascio commerciale BLOCKED**:
le verifiche automatiche non sostituiscono test con giocatori e telefono fisico.

- 30 tappe: prologo interattivo, 11 missioni, 5 corse, 4 hub estesi, tre boss, fuga giocabile e conclusione completa.
- Moon Refuge, Cathedral Quarter, Toxic Slum Bazaar e Clockwork Outpost: NPC, negozi, equipaggiamento, otto incarichi, segreti e ritorni.
- Due preparazioni necessarie con specializzazione offensiva o difensiva; ricompense e acquisti persistenti.
- Nox e Lulù si ricongiungono prima di Archon. Kairn e Morrow restano alleati non controllabili.
- Tre tonalità del ricongiungimento, scelta della mano e scena del seguito dopo i titoli.
- La nuova storia richiede una nuova partita; i salvataggi v4/v5/v6 restano conservati.

## Documenti

[Canone v8](docs/NARRATIVE_V80.md) · [Implementazione e regole](docs/V8_IMPLEMENTATION.md) ·
[Prove v8](docs/evidence/v8/README.md) · [Release gate](docs/RELEASE_GATE.md) ·
[Checklist Play Store](docs/PLAY_RELEASE_CHECKLIST.md).

## Sviluppo e verifica

```bash
npm ci
npm test
python3 -m http.server 8090 --bind 127.0.0.1
# In un altro terminale:
CITY_VIRTUAL_TIME=1 node tools/verify_campaign_browser.cjs http://127.0.0.1:8090/game/ a out-a
node tools/verify_hubs_v8.cjs http://127.0.0.1:8090/game/ hubs.json
node tools/verify_runtime_v09.cjs http://127.0.0.1:8090/game/ runtime.json
node tools/verify_performance_v09.cjs http://127.0.0.1:8090/game/ performance.json
ANDROID_SDK_ROOT=… bash tools/build_apk.sh
```

Per i test browser: `npx playwright install chromium` oppure `CHROMIUM=/percorso/chromium`.
Il benchmark va eseguito da solo; le partite con clock accelerato non misurano durata umana o FPS.
Il build Android produce `dist/Chronos_Nox_Lulu_v8_RC_debug.apk` con SDK 35, build-tools 35.0.0 e JDK 17+.
