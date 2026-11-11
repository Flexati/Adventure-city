# Esito della consegna Argon — terzo giro (11 novembre 2026)

Ramo di consegna: `delivery/argon-asset-giro2-20261110`, da `e776c13` a `f39dd3d` (mai modificato da questa parte).
Controllo fatto guardando tutte le 46 immagini nuove; misure e SHA-256 nel registro
`assets/production/v10.3/derived/REGISTRO_ARGON_GIRO3_20261111.json`.

## Giudizio

**[FATTO]** 46 PNG nuovi, tutti illustrazioni del modello di immagini, nessuna figura tracciata da codice,
nessun duplicato fra loro. Le coppie azione/reazione dei nemici ora mostrano lo stesso personaggio.
Dove la quota è finita Argon ha saltato e lo ha scritto in `STATO_CODA.md`.

## Entrano subito nel gioco (9 derivati)

| Derivato | Origine | Dove si vede |
|---|---|---|
| `art/chrono/gang_shooter.png` | `N/gang_shooter_a` + `_b` | tiratore della Gang dei Relè: «Blackout», «La città senza di te» |
| `art/chrono/gang_breaker.png` | `N/gang_breaker_a` + `_b` (rifatto, senza scritte) | sfondatore della gang: stesse missioni |
| `art/chrono/alien_breaker.png` | `N/alien_breaker_a` + `_b` | scarabeo della breccia, sfondatore: «Breccia», «Segni di gesso», «Porto» |
| `art/chrono/infected_brute.png` | `N/infected_brute_a` + `_b` | infermiere infetto, colosso: «Contagio», «Archivio» |
| `art/chrono/port_patrol.png` | `N/port_patrol_a` + `_b` | guardia con la lampada, pattuglia: «Porto» |
| `art/atti/atto_1…4.webp` | `C/atto_1…4` | sfondo della scheda di ogni missione, secondo l'atto |

Con il segnalatore di R17, la Gang dei Relè ha ora tre ruoli su quattro con il foglio di Argon.

## Accettati, in attesa di un posto nel codice

| Cosa | Perché aspetta |
|---|---|
| `gang_brute_a` + `gang_brute_b` (colosso con la mazza a bobina) | l'unico colosso del distretto della gang è in «La città senza di te», dove il ruolo è di `desert_chrono_fighter` (D46). Decisione dell'autore. |
| `alien_brute_a` + `_b` (predatore con le ancore) | nessuna missione della breccia ha un colosso nelle ondate |
| Gruppo U, 8 tavole d'interfaccia (pulsanti, pulsanti tondi, cornici, 24 icone, HUD, medaglie, emblema) | vanno tagliate e applicate schermata per schermata, con prove al tocco su ogni formato: è un giro a sé, e il codice ha 927 byte di margine |
| Gruppo T, 11 tavole (3 terreni, 4 set di palazzi, 4 set di oggetti) | i distretti usano mappe dipinte intere: servono come pezzi per ridisegnare le mappe |
| `bone_tyrant_a…d` | i boss entrano con la loro logica (D23); nota: in `_a` l'arma è una clava d'ossa, in `_b…d` una mazza tonda con scudo |
| `shadow_reaper_a…c` | manca `_d` (quota esaurita) |
| `forge_behemoth_a`, `_c`, `_d` | manca un `_b` coerente |

## Scartato (1)

| File | Motivo |
|---|---|
| `B/forge_behemoth_b.png` | è un robot d'acciaio grigio con serbatoi verdi: non è il golem di bronzo degli altri tre fogli |

## Da controllare prima dell'uso

- `T/oggetti_clinica.png` (armadietto e carrello) e `T/palazzi_clockwork.png` (quadrante della torre): a
  grandezza piena vanno guardati per cifre o lettere prima di entrare in un livello (regola 9).

## Coda di Argon (dal suo `STATO_CODA.md`)

`B/shadow_reaper_d`, poi i gruppi M (6), V (16), G (12), F (6). Da aggiungere: `forge_behemoth_b` rifatto come
gli altri tre. Gruppo A (104 suoni): Argon non ha un modello audio in quell'ambiente.
