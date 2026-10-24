# CHRONOS V9 — stato di ripresa

Aggiornato: 2026-10-24 20:56 UTC

Branch operativo: `work/chronos-adventure-commercial`. Ultimo sorgente sottoposto
al ciclo Android completo: `c26e3c4e370cbbb6aef4ac8088c93f5cb6af9de5`.
La riconciliazione documentale è conservata in commit successivi senza alterare
il sorgente APK al quale la prova è vincolata.

## Stato verificato

- E00 — **VERIFICATA**: scope autorevole allineato a 9 regioni, 17 incontri
  maggiori e 7 gare; i tre nuovi incontri restano da realizzare.
- E01 — **VERIFICATA**: G0 è PASS con suite logica/browser e run Android
  autoritativo `40131522119` sul commit pertinente.
- E02 — **VERIFICATA**: cuoricini sostituiti da barre numeriche; 11 stati
  mirati, quattro formati, lifecycle, campagna A e WebView Android provati.
- E03 — **PRONTA**: prossimo blocco; joystick e pulsanti, inclusi diagonali,
  arresto, pareti, pointer cancel, focus/background, doppio evento, safe area
  e camera. La parte umana va registrata separatamente quando disponibile.

`BASELINE_STATUS = VERIFIED`. `COMMERCIAL_RELEASE = BLOCKED`: G1–G5 e G4.5
restano obbligatori e non sono implicati dal PASS della baseline.

## Prova Android vincolante

Run: `40131522119`, job `120984047333`, commit `c26e3c4`, API 35 x86_64.
Build/installazione, gameplay WebView con touch fidati, audio, pausa/ripresa,
quattro viewport, force-stop e recupero schema 7, fallback da checksum corrotto,
cold start con Wi-Fi/dati disabilitati, crash renderer/Riprova nativo e
HOME/background/foreground sono PASS.

APK: 50.207.469 byte, SHA-256
`2f68e2f8360c3fd6f655f35527704dca8036671c8ddec09b03c20bbac92fe2bf`.
Ramo prove: `build/chronos-v8-rc-40131522119`, evidence commit `7d01b19`.
Indice locale: `docs/evidence/v9/android-ci-40131522119.json`.

I run `40129723295` e `40130961262` sono fallimenti diagnostici. Il run
`40130289860` è escluso dalle prove positive perché una pipeline con `tee`
mascherava il fallimento del subprocess recovery. Il workflow ora impone
`pipefail`, attende le transizioni asincrone osservabili e fallisce correttamente.

## Verifiche correnti

- `npm test`: 137/137 PASS.
- `npm run qa:v9`: PASS; 33 requisiti, 14 evidenze, G0 PASS.
- Copertura prodotto: 0/41 elementi accettati; integrazione commerciale ancora
  mancante per 9 regioni, 17 incontri, 7 gare, rivale, 5 armi e IT/EN.
- Copertura audio: 0/129 brief accettati.
- HUD browser: 11 casi PASS; tour 20 casi su quattro viewport PASS; campagna A
  30/30, 8 incarichi, 2 preparazioni e postcrediti PASS.

## Limiti e dipendenze

La prova Android è su emulatore, non su telefoni fisici; non certifica FPS,
frame pacing, memoria, termiche, comfort, divertimento, firma release o AAB.
I binari di riferimento V8.5 su `origin/main@93c128e` restano invalidi: il file
WebP non ha firma riconoscibile e lo ZIP non ha directory centrale. Occorrono le
18 tavole sorgente valide, la produzione artistica/audio, tester umani e device
fisici prima dei gate successivi e del rilascio.

Prossima azione concreta: eseguire E03 sui percorsi input reali, conservando
separati i risultati automatici dalle osservazioni umane; quindi E04/E05. E06
può iniziare soltanto dopo la chiusura del contratto/budget G1.
