# RELEASE_GATE — City Adventure v0.8

**Stato: BLOCKED.** Nessun AAB, nessuna release commerciale. Il gioco è completo dall'inizio alla fine,
ma diverse dimensioni sono sotto 8.0 e mancano prove che solo persone e dispositivi reali possono dare.

## Evidenze di questo loop (2026-10-20)

| Prova | Esito |
|---|---|
| `npm test` (58 test) | PASS — regole, scelte, salvataggi v6/v4/v5, vincibilità di ogni missione su entrambi i rami, collisioni nel bundle Android |
| Partita completa nel browser, input reali, strategia A (scelte "prime") | PASS — 20/20 tappe, 0 errori, finale *fragile* (thermal 44), 12,6 min di bot |
| Partita completa nel browser, strategia B (scelte opposte) | PASS — 20/20 tappe, 0 errori, finale *caldo* (thermal 66), 12 min di bot |
| Tour visivo 360×800, 390×844, 412×915, 844×390 | PASS — nessun overflow, nessun pulsante fuori schermo o sotto 44 px |
| Ripresa: chiusura a metà missione, pausa nativa, crash con scelta pendente, salvataggio corrotto | PASS |
| Bundle Android appiattito in Chromium via CDP (`verify_android_renderer.mjs`) | PASS |
| APK debug v0.8 compilato e firmato localmente | PASS (39 MB) |
| Emulatore Android / dispositivo fisico | **NON ESEGUITO** in questo ambiente (niente KVM). Da eseguire in CI o su telefono |
| Test con giocatori esterni alla cieca | **NON ESEGUITO** |
| Ascolto umano di musica e mix | **NON ESEGUITO** (solo picco/RMS/loop verificati) |

Durata stimata per un giocatore umano: **45–70 minuti** (il bot impiega 12 minuti con mira e reazioni perfette).

## Punteggio commerciale (0–10, onesto)

| Dimensione | Voto | Motivo principale |
|---|---|---|
| Prima impressione | 7.5 | sting dello studio e key art con entrambi; il menu è un'immagine fissa animata solo da pioggia/neon |
| Primi 10 minuti | 7.0 | interazione entro 5 s, tutorial contestuale; nessun test umano |
| Controlli | 7.0 | stick + pulsanti a 48 px; non provati su vetro |
| Combattimento | 7.0 | ondate, telegrafi, proiettili schivabili, 3 boss; animazioni a 4 fotogrammi |
| Guida | 6.5 | 5 corse con 4 varianti; fisica semplice |
| Varietà delle missioni | 7.0 | assalto, buio, difesa, infiltrazione, boss; **stessa pianta a incrocio su tutte e 4 le mappe** |
| Storia | 7.5 | arco completo con separazione e ritorno; solo testo |
| Relazione Nox/Lulù | 7.5 | scelte incrociate, ricongiungimento in battaglia e "due colpi" finale |
| Arte | 6.5 | asset coerenti e forti, ma mappe ripetute e scene senza illustrazioni dedicate |
| Animazione | 6.0 | sprite a 4 fotogrammi; le scene usano pose di camminata |
| Audio | 5.5 | temi originali sul motivo comune, mai ascoltati da una persona; pochi SFX, niente ambienti |
| UI | 7.5 | ritratti, schede missione, HUD compatto |
| UX mobile | 7.0 | 4 viewport verificate; nessun dispositivo |
| Prestazioni | 6.0 | maschera del buio ottimizzata; nessuna misura su telefono |
| Rifinitura | 6.5 | |
| Finale | 7.0 | tre varianti + epilogo; manca un'illustrazione del ricongiungimento |
| Rigiocabilità / scelte | 7.5 | 7 scelte con conseguenze reali, 3 finali di tono |
| Valore percepito a €4,99 | 6.0 | contenuto completo ma corto e su mappe ripetute |

## Asset di produzione mancanti (non sostituiti con segnaposto)

1. **Varianti di mappa** 1536×1536 (stesso stile pixel delle mappe esistenti) con piante diverse: livelli bassi del Nodo, archivio sotterraneo, tetto del porto, piattaforma dell'asse. Oggi quattro mappe a incrocio coprono undici missioni.
2. **Illustrazione del ricongiungimento** (16:9 e 9:16, stile del key art): Nox e Lulù all'alba sulla piattaforma.
3. **Pose da scena** per Nox e Lulù (seduti, mano tesa, abbraccio esitante) in fogli 4×4 come gli atlanti attuali.
4. **SFX**: passi, ricarica, impatto pesante, allarme pattuglia, drone, motore Vortex/camion; **ambienti** per buio e porto.

## Condizioni per sbloccare

- Ogni dimensione ≥ 8.0, nucleo ≥ 8.5, valore a €4,99 ≥ 8.5.
- Test alla cieca con almeno 5 persone: nessuna confusione bloccante nei primi 10 minuti, ≥ 4/5 finiscono la storia, nessuna morte "ingiusta" segnalata.
- Emulatore CI verde e almeno un telefono Android di fascia media: 60 fps stabili o 30 fps senza scatti, nessun crash in logcat, audio e ripresa corretti.
