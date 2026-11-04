# Q2 — Piano (Behemoth): leggibilità e feel del combattimento (D35, priorità 2 e 3)

Base: `8ba72cf` (dopo Q1 `c3d8a84`). Via dell'autore: «Sì, ti do l'ok, confermo, sviluppami il gioco senza problemi» (4 novembre 2026).

## Vincoli

- Regola 4: hitbox, finestre di schivata e parata, `windup`, durata e ricarica del Chrono Shift (D29) e memoria dei tocchi (D27) **non cambiano**. Q2 cambia solo il disegno, l'interfaccia e la vibrazione.
- Regola 8 e regola 9: ogni segnale nuovo funziona al tocco, senza audio e **senza colore**, cioè con una forma (tratteggio, croce, doppio bordo) e non solo con una tinta.
- `app.js` ha 7 194 byte di margine (517 094 su 524 288). Budget di Q2: al massimo 1 500 byte.
- `game/campaign.mjs` non si tocca: la simulazione resta byte per byte quella di Q1.

## Lacune trovate leggendo il codice

| # | Lacuna | Fonte |
| --- | --- | --- |
| L1 | Il telegraph a cerchio dei nemici corpo a corpo segue l'eroe per il 55 % del `windup`, poi si blocca (`campaign.mjs:345`). Sullo schermo il blocco non si vede: il bordo è identico prima e dopo. L'evento `telegraphLock` (E1) va solo al motore audio, quindi senza audio il momento del blocco è invisibile | `runtime.mjs:912`, `campaign.mjs:104,345-346` |
| L2 | Il telegraph a distanza (linea di mira) cambia solo trasparenza e raggio del mirino; il blocco al 60 % non ha forma propria | `runtime.mjs:913` |
| L3 | Con «movimento ridotto» l'invulnerabilità dopo la schivata non ha nessun segnale: il lampeggio dell'eroe è spento (`settings.reduced`) e non c'è altro | `runtime.mjs:886` |
| L4 | Il Chrono Shift di Nox non ha un indicatore di carica: chi gioca non sa se la prossima Perfect Dodge farà partire lo shift (ricarica 3,0 s, `s.shiftCd`) | `runtime.mjs:938`, `campaign.mjs:206` |
| L5 | A piedi la vibrazione non si usa mai (`haptic` serve solo alle gare): Perfect Dodge e colpo subito non hanno un segnale tattile | `runtime.mjs:312-317,756-758` |

## Unità

| Unità | Cosa | File | Verifica |
| --- | --- | --- | --- |
| Q2-U1 | **Blocco del telegraph visibile senza colore.** Cerchio corpo a corpo: bordo tratteggiato (8/8 px) finché segue l'eroe, bordo pieno da 5 px con una croce al centro dopo il blocco. Linea a distanza: tratteggiata finché segue, piena da 3 px dopo il blocco. Le frazioni di blocco (0,55 e 0,6) sono le stesse di `campaign.mjs:345-346`: un test controlla che i due file restino allineati | `game/runtime.mjs` | test nuovo con canvas registratore sulle righe vere di `drawThreats`; scala di grigi: il tratteggio e la croce non dipendono dalla tinta |
| Q2-U2 | **Stato dell'eroe.** (a) Con «movimento ridotto», durante l'invulnerabilità un anello fisso tratteggiato intorno all'eroe al posto del lampeggio. (b) Pulsante SCHIVA di Nox con classe `shift` quando lo shift è carico: doppio bordo (`outline` doppio, forma e non solo colore) | `game/runtime.mjs`, `game/style.css` | test sul sorgente e sul CSS; `qa:controls` |
| Q2-U3 | **Feel tattile.** Vibrazione a piedi: Perfect Dodge 20 ms, Perfect Dodge che avvia lo shift [15, 30, 15] ms, colpo subito 35 ms. Rispetta l'opzione «Vibrazione» (`settings.haptics`) e la pagina nascosta, come oggi nelle gare | `game/runtime.mjs` | test sul sorgente |
| Q2-U4 | **Documenti.** STATO (sezione in cima), PLAYTEST (voci M1 da provare sul telefono), registro | `docs/gold/` | `claude-guide` 5/5 |

Poi build: APK di debug (`tools/build_apk.sh`) e AAB con la configurazione Play di `RELEASE.md` (`jaguarZcreatorZ13.app`, `versionCode 2`, `targetSdk 36`, `debuggable=false`). La chiave di upload `chronos-upload` non è in questa macchina: l'AAB costruito qui è firmato con una chiave di prova fuori dal repo e **non è caricabile**. Quello per lo store lo costruisce l'autore con `npm run android:aab:play` e la sua chiave.

## Fuori da Q2 (motivo)

- Cambi di `windup`, raggi e finestre: regola 4.
- Desaturazione durante lo shift: esclusa da D33.
- Menù principale professionale: priorità 5 (finitura), milestone successiva.
