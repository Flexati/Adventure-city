# Chrono Shadows — pacchetto artistico candidato

Base applicativa: `work/v09-rc` / `bef518bba631c0e6d704a4d066bbb9e2f65df82e`.
Tavole: `main` / `e1dbc13874c3ce4a85018fd0d2fb29335ebea84f`.
Destinazione: **Flexati/Adventure-city**, branch `art/chrono-shadows-production`.
Le quindici tavole originali e il loro `MANIFEST.json` sono conservati invariati.

Il manifest utilizzabile dal renderer è [`game/art/chrono/manifest.json`](../../game/art/chrono/manifest.json).
[`game/chrono-manifest.mjs`](../../game/chrono-manifest.mjs) contiene il sottoinsieme necessario al gioco/APK.
Il manifest delle tavole non è un manifest runtime.

## Risorse e confini dell'integrazione

| Gruppo | Contenuto | Impiego |
|---|---|---|
| Protagonisti | Nox e Lulù: identità, costumi e animazioni direzionali v0.9 conservati | Runtime e banco artistico; nessuna sostituzione |
| Alleati/personaggi aggiuntivi | Desert Chrono Fighter, Demon-Hunter Survivor, Chrono Huntress, Iron Penitent, Toxic Brawler, Valkyrie Striker; 24 frame ciascuno | Riserva. I due alleati di supporto non sono selezionabili |
| NPC | Mercante, guardia, fabbro, alchimista, sacerdotessa, locandiere, meccanico, informatore, scavenger kid, bardo, civile | Animazioni di risorsa; nessun nuovo negozio, prezzo, acquisto o quest |
| Nemici | Tutte le sei specie undead e le sei techno-occult richieste | Purple Guard veste i Custodi ordinari; gli altri restano in riserva |
| Boss | Chrono Overlord, Shadow Reaper, Cathedral Bone Tyrant, Toxic Forge Behemoth | Archon usa l'aspetto Chrono Overlord. Gli altri boss non sostituiscono autonomamente quelli della campagna |
| Ambienti | 16 moduli: otto pavimenti, quattro facciate/tetti, porta, ponte, scala, ascensore | Pavimenti/facciate nelle geometrie v0.9; connessioni e segreti sono risorse di riserva |
| Interni/props | Otto stanze e otto props: blacksmith, gunsmith, alchemy, relic, food, upgrade, inn/save, secret workshop e relativi ingressi/arredi | Kit visivi; non nuove aree o sistemi funzionanti |
| Hub e distretti | Dieci combinazioni del kit, con anteprime nominate come nel brief | Quattro hub e sei distretti come risorse modulari; nessuna nuova mappa di campagna |
| FX | 14 effetti, quattro frame ciascuno, varianti di presentazione reduced motion | Sei tipi collegati a eventi esistenti; otto tipi disponibili nel medesimo atlas |
| Audio | Sei ambienti e 22 cue originali, Ogg offline | Quattro ambienti e cinque cue collegati; gli altri sono riserve |

La geometria resta quella del piano 2D esistente, con griglia 24×24 e tile di 64 unità.
Facciate e landmark sono disegnati soltanto in blocchi 2×2 interamente non percorribili;
non coprono pavimenti percorribili o telegraph. Il pavimento clockwork nel runtime usa
il ferro meno fitto del workshop: la texture con grande ingranaggio resta un modulo di riserva.

## Produzione e provenienza

[`GENERATION_LOG.json`](GENERATION_LOG.json) registra gli output effettivi di `image_gen.imagegen`,
gli input conservati e i tentativi respinti. [GENERATION_COMPLETIONS.json](GENERATION_COMPLETIONS.json) registra i passaggi completi di NPC e nemici. Il servizio non espone il nome del modello backend:
non viene attribuito un modello inventato. Le tavole sono state aperte e interpretate come art direction;
non sono state ritagliate per ricavarne il pacchetto runtime. Gli edit successivi usano riferimenti
generati conservati in `production_sources/` e `production_sources/identity_references/`.

Il primo tentativo Creative Claw / `sfx/elevenlabs-sound-v2` è stato rifiutato prima della generazione
per saldo zero: nessun addebito. Tutti i file audio consegnati provengono invece dalla sintesi originale
di [`tools/chrono_audio.py`](../../tools/chrono_audio.py): rumore deterministico, oscillatori,
inviluppi e risonanze, senza registrazioni o brani copiati. Gli ambienti usano componenti periodiche;
il report conserva anche il salto di campione al confine dopo la decodifica Vorbis.

Non è stata fornita una licenza separata per le tavole dell'utente. Per le immagini generate valgono
i termini del servizio utilizzato; non viene dichiarata una verifica indipendente dei diritti.
Nessuna registrazione o composizione di terzi è stata importata nell'audio.

## Pulizia e convenzioni

`node tools/chrono_pack.cjs` isola le componenti connesse prima di impacchettarle. Questo evita
che la punta di una lancia oltre la griglia nominale finisca nel frame vicino. Elimina alpha <64,
alone e particelle staccate dai personaggi; gli FX hanno un atlas separato. Il ridimensionamento
usa nearest-neighbor. I tentativi con pose collegate da glow sono conservati come `*-rejected.png`.

L'altezza delle celle attore è 128 px, scelta rispetto ai 104/112/230 world unit già usati dal renderer.
La larghezza varia secondo l'estensione reale delle armi; non si comprime ogni attore in un quadrato.
Il pivot sul piano usa la mediana dei pixel dei piedi, con baseline comune. Le immagini runtime
rimangono entro 2048 px per lato. Le collisioni e gli attacchi continuano a derivare dal runtime:
il manifest documenta lo spazio e la fonte, senza introdurre danno dagli sprite.

Il nuovo renderer seleziona rettangoli e pivot dai metadati. `drawLegacySprite` mantiene esattamente
il campionamento 4×4 precedente, incluse le dimensioni frazionarie dei vecchi PNG. I tempi di
anticipazione, contatto, recupero, danno e morte dei nuovi Custodi seguono la fase AI esistente.

Per Archon il core esposto usa il recupero a bassa salute già presente. Nessuna nuova fase invulnerabile
o nuova AI è stata aggiunta. La sola modifica alla proprietà del danno impedisce al tiro automatico
del partner di sottrarre l'ultimo HP di un boss: il colpo finale deve arrivare da un comando del giocatore.
La sconfitta continua ad animarsi durante l'attesa visiva di fine missione, senza avanzare la simulazione.

## Caricamento, audio e Android

Il preload di missione decodifica il kit condiviso, FX, Custodi ove necessari e Chrono Overlord
prima di rendere interattivo il boss. Gli atlas precedenti non più necessari vengono ritirati;
in guida/menu/scene le immagini Chrono vengono rilasciate. Il pool dei nuovi FX contiene 16 slot.
Reduced motion usa il piccolo frame iniziale a opacità ridotta e sopprime il finish flash.

I sample passano dagli stessi bus, master, compressore, ducking, mute e lifecycle Android esistenti.
Restano il limite di 24 voci, i cooldown, al massimo due stream musicali e il crossfade precedente.
Il preload conserva cinque cue e un solo ambiente decodificato per distretto.

`tools/prepare_android_assets.py` include solamente quattro PNG e nove Ogg Chrono.
Tavole, sorgenti, banco artistico, atlas di riserva e manifest completo non entrano nell'APK.
L'allowlist Android è stata aggiornata per le sole risorse incluse.

## Riprodurre e verificare

```sh
npm ci
python3 -m pip install -r tools/chrono-requirements.txt
npm run art:pack
npm run art:audio
npm test
python3 -m http.server 8090 --bind 127.0.0.1
```

Aprire `/game/chrono-lab.html` per animazioni, kit e interni, oppure `/game/` per la campagna.
Gli script `verify_chrono.cjs`, `chrono_previews.cjs`, `verify_chrono_boss.cjs` e `chrono_memory.cjs`
producono prove in `docs/evidence/chrono_shadows/`. La misura RAM comparata richiede anche la baseline
`bef518bb` servita sulla porta 8091. `CHROMIUM` può indicare l'eseguibile locale.

Il [rapporto di consegna](../../docs/evidence/chrono_shadows/README.md) riporta conteggi finali,
SHA, test, APK, prestazioni, RAM e limiti. **RELEASE_GATE resta BLOCKED**: compilazione e prove Chromium
non certificano WebView/telefono fisico, ascolto umano, safe area di un dispositivo reale o qualità commerciale.
