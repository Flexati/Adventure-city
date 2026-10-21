# Checklist Google Play — Adventure City (prezzo previsto 4,99 €)

Stato al 2026-10-21: **non inviabile**. Requisiti verificati sulle pagine ufficiali in questa data:
[target API](https://developer.android.com/google/play/requirements/target-sdk),
[test per account personali](https://support.google.com/googleplay/android-developer/answer/14151465).
Ricontrollare prima dell'invio: le regole cambiano.

Legenda: ✅ fatto e provato · ⛔ blocco · 👤 richiede il titolare (dati, account o decisioni non deducibili dal repository).

## Build tecnica

| Voce | Stato | Dettaglio |
|---|---|---|
| Target API | ⛔ | Dal 31/08/2026 nuove app e aggiornamenti devono avere `targetSdkVersion` **36** (proroga richiedibile fino al 01/11/2026). Ora: 35 in `android/AndroidManifest.xml`. Serve platform 36 nel build e una prova su immagine API 36 (inset, back, ridimensionamento su schermi ≥600 dp). L'Activity applica già gli inset di sistema come padding |
| applicationId definitivo | 👤 ⛔ | Ora `com.cityadventure.pizzaprotocol.debug`. È permanente dopo la prima pubblicazione: lo sceglie il titolare |
| Build release | ⛔ | Il manifest è `debuggable=true`; serve variante release senza debug, versionCode/versionName di produzione |
| Formato | ⛔ | Play richiede **AAB** per le nuove app; `tools/build_apk.sh` produce solo APK debug |
| Firma | 👤 | Play App Signing + chiave di upload privata del titolare. Nessuna chiave è nel repository e nessuna va inventata |
| Funzionamento offline, nessuna rete a runtime | ✅ | `usesCleartextTraffic=false`, risorse locali; verificato nel browser |
| Codice nativo / 16 KB page size | ✅ | Nessuna libreria nativa nel pacchetto |
| Dimensione | ✅ | APK debug 44,75 MB, sotto i limiti Play |
| Emulatore corrente | da eseguire | Workflow `Android smoke build` (`workflow_dispatch`) sul branch di consegna |
| Telefono fisico (fascia media ed economica) | ⛔ | Tocchi, notch, speaker/cuffie, lifecycle, FPS sostenuti, termica |

## Scheda Play Console (👤 tutte)

- Account sviluppatore; se personale e creato dopo il 13/11/2023: **test chiuso con almeno 12 tester
  per 14 giorni consecutivi** prima di chiedere l'accesso alla produzione.
- Profilo pagamenti per app a pagamento; prezzo 4,99 € e paesi.
- Norme sulla privacy (URL pubblico) e modulo **Sicurezza dei dati**. Il codice non contiene SDK di
  analisi, pubblicità o rete; i salvataggi restano in `localStorage` del WebView. La dichiarazione resta
  responsabilità del titolare e non è compilata qui.
- Questionario di classificazione dei contenuti (IARC): combattimento con armi e creature, nessun sangue
  realistico osservato; da compilare dal titolare, nessuna classificazione è dichiarata qui.
- Pubblico di destinazione, accesso all'app (nessun login), annunci (nessuno).
- Asset della scheda: icona 512×512, grafica in primo piano 1024×500, almeno 2 screenshot telefono.
  Le prove in `docs/evidence/` sono materiale QA, non screenshot di marketing approvati.

## Qualità prima della vendita

- Protocollo cieco `docs/BLIND_PLAYTEST_V09.md` con almeno cinque persone.
- Ascolto umano dell'audio su telefono.
- Criteri commerciali di `docs/RELEASE_GATE.md`.
