# CHRONOS V9 — stato di ripresa

Aggiornato: 2026-10-25 10:15 UTC

Branch operativo: `work/chronos-adventure-commercial`. Ultimo sorgente sottoposto
al ciclo Android completo: `50b9d94449bf9be5c4d1f76011a331a0c14c9ece`.
La riconciliazione documentale è conservata in commit successivi senza alterare
il sorgente APK al quale la prova è vincolata.

## Stato verificato

- E00 — **VERIFICATA**: scope autorevole allineato a 9 regioni, 17 incontri
  maggiori e 7 gare; i tre nuovi incontri restano da realizzare.
- E01 — **VERIFICATA**: G0 è PASS con suite logica/browser e run Android
  autoritativo corrente `40183475468` sul commit pertinente.
- E02 — **VERIFICATA**: cuoricini sostituiti da barre numeriche; 11 stati
  mirati, quattro formati, lifecycle, campagna A e WebView Android provati.
- E03 — **VERIFICATA tecnicamente**: joystick e pulsanti coprono deadzone,
  diagonali normalizzate, arresto, pointer cancel, focus/background, multitouch,
  isolamento tastiera, safe area e quattro viewport. La parte umana su telefoni
  fisici resta separata e non viene sostituita dall’automazione.
- E04 — **PRONTA**: prossimo blocco eseguibile del mandato; E03 non autorizza
  l’integrazione commerciale finché le dipendenze G1/G2 restano aperte.

`BASELINE_STATUS = VERIFIED`. `COMMERCIAL_RELEASE = BLOCKED`: G1–G5 e G4.5
restano obbligatori e non sono implicati dal PASS della baseline.

## Prova Android vincolante

Run: `40183475468`, job `121139238975`, commit `50b9d94`, API 35 x86_64.
Build/installazione, gameplay WebView con touch fidati, audio, pausa/ripresa,
quattro viewport, force-stop e recupero schema 7, fallback da checksum corrotto,
cold start con Wi-Fi/dati disabilitati, crash renderer/Riprova nativo e
HOME/background/foreground sono PASS.

APK: 50.207.469 byte, SHA-256
`6d582658c76d15695e9a00f04ccf82cfaeacc847f182b1dfd99aa0595fc8415e`.
Ramo prove: `build/chronos-v8-rc-40183475468`, evidence commit `1a0dd1a`.
Indice locale: `docs/evidence/v9/android-ci-40183475468.json`.

I run `40129723295` e `40130961262` sono fallimenti diagnostici. Il run
`40130289860` è escluso dalle prove positive perché una pipeline con `tee`
mascherava il fallimento del subprocess recovery. Il workflow ora impone
`pipefail`, attende le transizioni asincrone osservabili e fallisce correttamente.
Il run `40134029202` è anch’esso solo diagnostico: Android manteneva
`mobile_data=1` dopo `svc data disable`. La prova corrente vincola sia il servizio
sia l’impostazione persistente, osserva entrambe disabilitate e solo allora esegue
il cold start reale.

## Verifiche correnti

- `npm test`: 141/141 PASS.
- `npm run qa:v9`: PASS; G0 PASS; `G3-INPUT` e `G3-HUD` VERIFIED pur con
  gate G3 ancora bloccato dalle dipendenze di prodotto.
- Copertura prodotto: 0/41 elementi accettati; integrazione commerciale ancora
  mancante per 9 regioni, 17 incontri, 7 gare, rivale, 5 armi e IT/EN.
- Copertura audio: 0/129 brief accettati.
- HUD browser: 11 casi PASS; tour 20 casi su quattro viewport PASS; campagna A
  30/30, 8 incarichi, 2 preparazioni e postcrediti PASS.
- Controlli browser: 9/9 PASS fra logica input, multitouch/cancel, focus e layout;
  la stessa revisione completa campagna A e il ciclo Android nativo.

## Limiti e dipendenze

La prova Android è su emulatore, non su telefoni fisici; non certifica FPS,
frame pacing, memoria, termiche, comfort, divertimento, firma release o AAB.
I binari di riferimento V8.5 su `origin/main@93c128e` restano invalidi: il file
WebP non ha firma riconoscibile e lo ZIP non ha directory centrale. Occorrono le
18 tavole sorgente valide, la produzione artistica/audio, tester umani e device
fisici prima dei gate successivi e del rilascio.

Prossima azione concreta: E04, continuando a tenere separati risultati automatici
e osservazioni umane; quindi E05. E06 può iniziare soltanto dopo la chiusura del
contratto/budget G1.
