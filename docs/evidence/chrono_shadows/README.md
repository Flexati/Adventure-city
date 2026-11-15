# Chrono Shadows — consegna e prove

Repository: **Flexati/Adventure-city**. Branch: **art/chrono-shadows-production**.
Codice applicativo verificato: `cb71532056d020739c4229161eee56694ccc0e1a`.
Fingerprint di tutti i moduli applicativi: `d06564cade288d9e3a50f9db91839bdad6cf1c972313636bb64cd3a086c5981e`.
La consegna delle prove e dell'APK non cambia questi moduli. **RELEASE_GATE: BLOCKED**.

## File prodotti

**36 atlanti PNG RGBA, 816 frame/moduli, 251 definizioni di animazione/posa, 28 Ogg originali.**
Nox e Lulù conservano identità e animazioni originali. Tutte le quindici tavole sono conservate
byte per byte, con origine `e1dbc138`; la base applicativa è `bef518bb`, non `main`.

| Risorse nuove | Quantità e stato |
|---|---|
| Sei personaggi aggiuntivi | 24 frame ciascuno: idle, walk, attack, special, hurt, defeat; riserva |
| Undici NPC | 24 frame ciascuno; idle/walk/talk/gesture/sell/receive, più sequenza shop interaction; riserva |
| Dodici nemici richiesti | 24 frame ciascuno; idle/walk/anticipation/attack/recover/hurt/defeat; Purple Guard integrato, altri in riserva |
| Quattro boss | Otto keyframe ciascuno, dieci stati/sequenze nel manifest; Chrono Overlord è l'aspetto di Archon |
| Quattordici FX | Quattro frame ciascuno; sei tipi collegati a eventi, otto disponibili in riserva |
| Ambienti/interiori | 32 moduli; dieci combinazioni nominate per quattro hub e sei distretti; non nuove mappe di campagna |
| Audio | Sei ambienti + 22 cue sintetizzati senza registrazioni; quattro ambienti e cinque cue collegati |

Gli otto keyframe dei boss coprono posa, anticipazione/attacco, stagger/fase, core esposto,
colpo finale, crollo e reward/portal. Alcuni stati sono pose mantenute, non cicli completi:
non vengono conteggiati come 251 animazioni tutte fluide e indipendenti.
I quattro NPC-compagni della tavola dedicata restano riferimenti originali: non sono nuovi protagonisti.

Il [manifest completo](../../../game/art/chrono/manifest.json) include rettangoli, dimensioni, FPS,
loop, pivot, collision box, fonte dell'attack box dinamica, layer, audio event e provenienza.
Il [manuale di produzione](../../../assets/chrono_shadows/PRODUCTION.md) descrive pulizia e integrazione.
[Log generazioni](../../../assets/chrono_shadows/GENERATION_LOG.json),
[passaggi completi](../../../assets/chrono_shadows/GENERATION_COMPLETIONS.json) e
[inventario con SHA-256](inventory.json) indicano strumenti e sorgenti effettive.
Il backend del tool `image_gen.imagegen` non espone il nome del modello: non è inventato.
L'audio usa numpy 2.3.5 e ffmpeg 7.1.5/libvorbis. Creative Claw non ha generato audio per saldo zero.

## Integrazione effettiva

- Kit statico nelle geometrie esistenti; facciate solo in blocchi non percorribili. Nessuna nuova fisica/camera.
- Purple Guard per i Custodi ordinari; Archon conserva nome, ruolo e trama ma usa Chrono Overlord.
- Sei FX: chrono rings, energy burst, debris, gear debris, impact, muzzle flash. Pool di 16 elementi;
  reduced motion usa il piccolo frame iniziale e bassa opacità, con finish flash soppresso.
- Audio: old town/cathedral/toxic market/clockwork; impact, chrono energy, boss collapse, save,
  suspense all'attivazione boss. Bus, ducking, mute, due stream e limite di 24 voci conservati.
- Il tiro automatico del partner lascia l'ultimo HP del boss al giocatore. La sequenza finale è visiva;
  nessuna morte automatica applicata dagli asset.
- I nuovi asset sono decodificati prima dell'ingresso; immagini ritirate su cambi pertinenti.
  Il vecchio atlas dei Custodi resta caricato solo ove serve al boss legacy.
- NPC, interni, hub, alleati e altri nemici/boss sono risorse: non nuove quest, negozi o personaggi selezionabili.

`story-v08.mjs`, `missions.mjs`, `narrative.mjs`, `layouts.mjs` e `driving.mjs` sono invariati
rispetto alla base. In `campaign.mjs` cambia soltanto la proprietà del colpo finale e il relativo evento.

## Verifiche sulla revisione consegnata

| Prova | Risultato e limite |
|---|---|
| Node | **74/74 PASS**, zero skip; [log](tests.txt). Include campagna/migrazioni, rettangoli/alpha, frame distinti, pivot, retire immagini e colpo finale |
| Chromium/mobile | **9 casi** sulle viewport 360×800, 390×844 e 412×915; target visibili ≥44 px, nessun overflow. [Report](browser.json) |
| Reduced motion e cambio guida | Screenshot dedicato; immagini Chrono ritirate in guida; nessuna tavola/sorgente richiesta dal gioco |
| Audio campionato | Due temi sovrapposti e 24 impatti: picco **0.793**, zero voci residue; preload muto cambia correttamente distretto senza suonare |
| Audio legacy/lifecycle | [Rendering Web Audio](audio-engine.json), [runtime](runtime.json), mute/pausa/ripresa/salvataggi/finali PASS. Nessun ascolto umano dichiarato |
| Boss nel gioco | Missione finale da checkpoint, poi solo input ordinari; vittoria con tre retry. Clock accelerato, audio disattivato. [Traccia](boss-playthrough.json) |
| Bundle Android classico | Eseguito nel browser con il JS e le risorse preparati per APK; [report](bundle-runtime.json). Non è un emulatore/WebView Android |
| APK debug | Compilazione, firma v2/v3 e zipalign PASS; [audit](apk.json), [log](apk-build.txt) |

La safe area è verificata come layout CSS/bounds nel browser; non è una prova di notch o gesti di un
telefono reale. Il telegraph resta sopra oscurità e asset; i personaggi possono uscire parzialmente
dalla viewport ai bordi del mondo con la camera esistente. Non è dichiarata assenza di ogni occlusione
in tutte le posizioni possibili.

## Prestazioni e memoria misurate

Benchmark Chromium headless con raster software, audio attivo, DPR richiesto 1,75: **20 scenari**,
quattro viewport (incluse le tre richieste), **3128 frame** sulla versione finale.
[Baseline](performance-baseline.json) e [risultato](performance-current.json).

| Misura | Baseline | Chrono Shadows |
|---|---:|---:|
| Peggiore p95 del callback | 6.6 ms | 7.2 ms |
| Peggiore rAF p95 | 16.8 ms | 16.8 ms |
| Intervalli rAF >25 ms | 0 | 0 |
| FPS medi misurati per scenario | Non raccolti come media nella prima baseline | 60.00–60.00 |
| Somma RSS processi, mediana, missione finale | 713.71 MiB | 716.32 MiB |

Il callback ha un picco isolato di 24.1 ms: p95 sotto budget
non significa che ogni frame sia sotto 16 ms. Questi sono campioni del server, non FPS/RAM Android.
La somma RSS doppia le pagine condivise tra processi: [tre campioni comparabili](memory.json),
non memoria unica dell'app. Non è stata eseguita una sessione sostenuta su dispositivo.

Contabilità dei soli nuovi bitmap decodificati: 6.94–7.56 MiB;
nuovi buffer audio: 2.14 MiB.
Heap JS nei nove casi: 3.79–16.82 MiB.
Queste contabilità si sovrappongono alla RSS e non vanno sommate a essa.
Preload immagini locale con `Image.decode()`: 9.9–26.5 ms;
click→missione attiva nel bot: 338–666 ms, inclusi card/dialoghi.
Non è una misura di avvio APK a freddo.

## APK disponibile

[APK debug per test](../../../artifacts/chrono_shadows/Adventure_City_Chrono_Shadows_debug.apk)

- Baseline ricostruita: **43,229,589 byte**.
- Nuovo APK: **44,750,304 byte**.
- Delta: **+1,520,715 byte (+3.52%)**.
- SHA-256: `845668202c337c28efa11c1ba17ed4bfe9b3ff8fa2da53fdcfb2060d0960ec4d`.
- 64 risorse locali; soltanto **quattro PNG e nove Ogg Chrono** nell'APK.
- Tavole, sorgenti di produzione, riserve e banco artistico esclusi.

SDK ufficiale 35 / build-tools 35.0.0. Il JDK21 dell'ambiente è privo di `ct.sym`: entrambe le build
comparabili hanno usato `-source 8 -target 8 -bootclasspath core-lambda-stubs.jar:android.jar`
in luogo di `--release 8`, senza cambiare i sorgenti Java. Con un JDK completo supportato resta
il comando normale `tools/build_apk.sh`. Nessuna chiave di produzione o release commerciale.

## Prove visive e file modificati

[Campione mobile](sample-390x844.png) · [telegraph](boss-telegraph-mobile.png) ·
[colpo finale](boss-player-final-hit.png) · [crollo](boss-collapse.png) · [portale](boss-reward-portal.png).
Le immagini `runtime-*` documentano le tre viewport e reduced motion; gli altri PNG mostrano
hub, distretti e otto interni come kit visivi.

| Gruppo | Contatto frame | Anteprima animata |
|---|---|---|
| Alleati | [PNG](contact-allies.png) | [GIF](preview-allies.gif) |
| NPC | [PNG](contact-npc.png) | [GIF](preview-npc.gif) |
| Undead | [PNG](contact-undead.png) | [GIF](preview-undead.gif) |
| Techno-occult | [PNG](contact-tech.png) | [GIF](preview-tech.gif) |
| Boss | [PNG](contact-bosses.png) | [GIF](preview-bosses.gif) |
| FX | [PNG](contact-fx.png) | [GIF](preview-fx.gif) |

[Elenco completo dei file cambiati](changed-files.txt). I principali gruppi sono `game/art/chrono`,
`game/audio/chrono`, i due moduli Chrono, runtime/scenery/audio, il piccolo guard del colpo finale,
packager e allowlist Android, strumenti di produzione/QA, test e sorgenti conservate.

## Limiti residui

Nessun telefono fisico o emulatore Android eseguito in questa sessione. Mancano ascolto umano,
test su speaker/cuffie, controlli su vetro, notch reali, prestazioni termiche/sostenute e valutazione
artistica/commerciale con giocatori. I boss hanno keyframe mantenuti e una sequenza finita: non una
libreria completa di transizioni interpolata per ogni possibile attacco. Le riserve non sono
funzionalità di campagna. I kit condividono moduli e non costituiscono dieci mappe nuove uniche.
Nessuna certificazione “pronto per produzione”; nessuna nuova trama o variante del finale.
