# CHRONOS V10.2 — Appendice C / Nemici e varianti territoriali

Data 28 ottobre 2026. Produrre tavole anche per nemici **non presenti nel runtime**: stato `CONCEPT_PREPRODUCTION` e nessun auto-collegamento. Base canonica `docs/gold/ASSET_NECESSARI.md`. Le quattro famiglie legacy `gang`, `infected`, `alien`, `custodian` devono mantenere le hitbox e gli sheet esistenti quando si ricavano semplici varianti.

## Schema di consegna per ogni variante

Tavola pixel art PNG con quattro direzioni, `idle 4f`, `walk 6f`, `anticipation 4f`, `attack 4f`, `hit 2f`, `defeat 6f` **solo come proposta** finché il runtime non assegna tempi e frame definitivi. Tavola VFX separata (telegraph/in-flight/impact/cancel), eventuale icona schermata e palette; la versione élite è identificabile per silhouette/accessori, non solo tinta. Nessuna modifica delle coordinate di collisione senza mandato. Per ogni tavola preproduzione usare `enemy_<id>_<base|region|elite>_concept`, con `PROVENIENZA.json` e `STATO.md`.

## Breaker — enemy.breaker

Stato: **nel codice**. Relay: sfonda coperture.

- **Base:** Base: figura bassa e larga, martello pneumatico e anticipo del colpo con spalle. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Territoriale:** Relay: attrezzo arrugginito, fasce ocra e schegge di cemento. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Élite:** Élite: spallacci triangolari arancio e doppio segno di attrezzo; nessuna nuova resistenza implicita. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.

## Echo — enemy.echo

Stato: **nel codice**. Infected: ripete azioni.

- **Base:** Base: posa ripetuta in tre battute con pausa chiaramente identificabile. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Territoriale:** Infected: stoffa consumata blu scuro, segni di ripetizione in coda. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Élite:** Élite: afterimage separato dal corpo, mai dannoso fuori telegraph. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.

## Raider — enemy.raider

Stato: **nel codice**. Relay: assaltatore di base.

- **Base:** Base: assaltatore mobile con arma corta, diverso da Breaker. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Territoriale:** Relay: casco lavorato e borsa utensili recuperati. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Élite:** Élite: doppia fascia sul braccio, profilo più alto senza cambiare collider. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.

## Anchor Beast — enemy.anchor_beast

Stato: **futuro**. Maintenance: bestia-ancora collegata a The Anchor.

- **Base:** Base: corpo massiccio legato con cavi ai punti di carico. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Territoriale:** Breccia: patina salina, funi consumate e piastre riparate. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Élite:** Élite: doppi anelli di ormeggio; segnale invulnerabilità distinto da attacco. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.

## Binder — enemy.binder

Stato: **futuro**. Custodian: lega/immobilizza.

- **Base:** Base: bracci estensibili con nodo di cattura ben visibile. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Territoriale:** Custodian: armatura avorio e acciaio con indicatori ambrati. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Élite:** Élite: due cerchi prima della presa; lunghezza effettiva determinata solo dal codice. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.

## Carrier — enemy.carrier

Stato: **futuro**. Infected: porta e diffonde.

- **Base:** Base: sagoma curva che trasporta modulo fragile. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Territoriale:** Infected: guaine penzolanti e tubi nastrati. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Élite:** Élite: carico con sigillo rotto, VFX di apertura solo su trigger reale. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.

## Choir — enemy.choir

Stato: **futuro**. Élite da interrompere.

- **Base:** Base: proiettori a quattro nodi, apparato sonoro orientato. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Territoriale:** Custodian: cavi violetto scuro e piastra di risonanza. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Élite:** Élite: triplo flash a ritmo di preavviso, interrompibile solo se implementato. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.

## Drifter — enemy.drifter

Stato: **futuro**. Infected: vagante.

- **Base:** Base: camminata incerta con corpo inclinato e braccia basse. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Territoriale:** Glass Flood: abiti pesanti bagnati e deposito salino. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Élite:** Élite: dorsale illuminata e passo teso, non falso avviso d'attacco. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.

## Enforcer — enemy.enforcer

Stato: **futuro**. Relay: corazzato pesante.

- **Base:** Base: corpo alto blindato con punti di appoggio forti. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Territoriale:** Relay: piastre numerate originali e scudo antischeggia. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Élite:** Élite: profilo ocra sulle spalle e marcatura del fronte protetto. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.

## Glassback — enemy.glassback

Stato: **futuro**. Élite corazzata, contrastata da fiancheggiamento e perforazione.

- **Base:** Base: placche vetrose triangolari sul dorso, fianchi visibili. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Territoriale:** Glass Flood: minerali azzurri, superfici torbide e angoli netti. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Élite:** Élite: contorno caldo sui fianchi, utile a mostrare zone di aggiramento. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.

## Prism — enemy.prism

Stato: **futuro**. Custodian: rifrange, contrastato dalla mobilità.

- **Base:** Base: scafo sfaccettato con emettitore orientabile. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Territoriale:** Custodian: superfici traslucide azzurre, una direzione di rifrazione. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Élite:** Élite: tre raggi fantasma di preavviso, soltanto quello reale colpisce. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.

## Seraph — enemy.seraph

Stato: **futuro**. Élite aerea.

- **Base:** Base: drone alto aereo con quattro punte e ombra di quota. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Territoriale:** Aurelia: ali tecniche chiare adatte al ponte. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Élite:** Élite: tre fari di allarme, ombra e telegraph sempre visibili. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.

## Signal Tech — enemy.signal_tech

Stato: **futuro**. Relay: supporto, va colpito per primo.

- **Base:** Base: zaino di comunicazione, antenna corta e arma secondaria inerte. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Territoriale:** Relay: cinghie logore e luci su pannello di supporto. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Élite:** Élite: pannello rosso attivo durante buff, mai simulare nuova portata. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.

## Skitter — enemy.skitter

Stato: **futuro**. Maintenance: piccolo e rapido.

- **Base:** Base: piccola forma a quattro zampe, corsa segmentata netta. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Territoriale:** Maintenance: olio e bulloni abbandonati sul dorso. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Élite:** Élite: estremità bianche e antenne più alte, velocità invariata. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.

## Spitter — enemy.spitter

Stato: **futuro**. Maintenance: attacco a distanza, contrastato dalla mobilità.

- **Base:** Base: sacca emissiva e corpo arretrato, preavviso bocca. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Territoriale:** Maintenance: residui ferrosi sulle piastre laterali. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Élite:** Élite: righe bianco ocra intorno alla sacca, VFX prima del proiettile. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.

## Warden — enemy.warden

Stato: **futuro**. Custodian: guardiano.

- **Base:** Base: figura custode verticale con scudo e asta. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Territoriale:** Custodian: rivetti avorio, sigilli inventati di manutenzione. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.
- **Élite:** Élite: pennacchio di metallo e due linee ambrate, scudo non più grande. Sheet direzionale + anticipo + impatto + sconfitta + riferimento a distretto.

## Test di leggibilità

Differenziare silhouette fra classi nelle stesse condizioni di luce. Ogni attacco ha una sola lettura di preparazione, un momento reale di hit e un recupero; la grafica non può promettere o dissimulare un'area di danno. Test di overlay su sfondi chiari, scuri e sovraccarichi, a 110 px. Non chiamare `PASS` le tavole non decodificate o non provate. Diritti e strumenti effettivi da documentare. `COMMERCIAL_RELEASE = BLOCKED`.
