# V8 giocabile — contratto e consegna

Base: `b6bd7772b02437d0455a87b921bbceaff130a48b`, branch Claude `ccr-02793d11-6genwh`.
Canone: [Narrative v8](NARRATIVE_V80.md). Applicazione: `0.10.0-v8.0-rc.1`. Salvataggio: schema 7.

## Campagna e hub

30 tappe ordinate tramite ID stabili, comprendenti quattro hub, undici missioni di combattimento,
cinque corse, prologo con movimento, ricongiungimento prima di Archon, fuga dal crollo, epilogo,
scelta della mano, titoli e scena del seguito. Kairn e Morrow sono alleati non controllabili.

Gli hub hanno quattro geometrie distinte e otto incarichi complessivi. Ogni incarico richiede
accettazione, interventi nel quartiere e consegna alla bacheca. Il diario indica una destinazione;
la mappa guida a piedi senza teletrasportare il personaggio. NPC, stanza segreta, servizi e risultati
degli incarichi restano disponibili ai ritorni. Durante la separazione Lulù visita Moon/Cathedral,
Nox Toxic/Clockwork; il ricongiungimento riapre i collegamenti. Nel finale i collegamenti sono
sospesi; dopo la conclusione «Torna a Vanta» apre tutti gli hub nello stato dell’epilogo.

I servizi includono locanda gratuita, armi con statistiche distinte, armatura, reliquia, medicina,
informazioni e oggetti inutili. Le scorte sono finite; gli oggetti permanenti si acquistano una sola
volta. Il bagaglio equipaggia gli oggetti e usa medicine in combattimento. Gli effetti del nuovo
carico si applicano alla missione successiva, mentre la medicina agisce subito e resta consumata
anche dopo una sconfitta. Ogni missione paga 20 monete una volta, ogni incarico 40–60; i segreti 12.

## Preparazione necessaria

Prima dell’Archivio serve un isolamento del Bazaar; prima dell’Asse uno schermo di Clockwork.
Il fabbro offre per ciascuno una variante offensiva (+1 danno) e difensiva (+2 salute) per Nox.
Ogni incarico locale assegna un componente; ogni preparazione ne richiede uno. I componenti non si
spendono in consumabili: anche spendendo tutte le monete la campagna resta completabile. Nessun
acquisto esterno, rete a runtime, farming obbligatorio o ricompensa duplicata con i ricaricamenti.

## Persistenza e confezionamento

`city-adventure-progress-v7` conserva ID della tappa, checkpoint boss, stato narrativo e mondo:
posizione/ritorno dell’hub, visite, incarichi, monete, componenti, scorte, inventario, equipaggiamento,
segreti e ricompense. Le chiavi v4/v5/v6 restano intatte. Il menu spiega che la nuova campagna richiede
una nuova partita. Le impostazioni compatibili restano attive. Un salvataggio corrotto non viene
reinterpretato come un’altra versione della campagna.

Il bundle classico Android include i nuovi moduli e gli atlanti NPC/alleati già prodotti. Le risorse
restano file locali ammessi esplicitamente da AssetRoutes. Il budget dello script passa da 256 a
512 KiB per includere gli hub e le loro animazioni; niente immagini base64 nell’entrypoint.
L’APK resta debug, target API 35: non è una consegna Play Store o una migrazione ad API 36.

## Validazione

`npm test` verifica logica, vincibilità, percorsi/collisioni degli hub, transazioni, preparazioni,
ricompense, salvataggi e bundle. `verify_campaign_browser.cjs` parte da Nuova storia e usa input
reali, senza iniettare stato: tre strategie coprono i ricongiungimenti e le specializzazioni.
`verify_hubs_v8.cjs` usa fixture dichiarate per verificare ripresa, ritorni e conservazione dei dati
precedenti. Tour a quattro viewport, audio/lifecycle, benchmark e WebView Android completano la QA.

Le prove v0.9 sono storiche; nuove evidenze in `docs/evidence/v8/`. Il clock accelerato delle partite
non misura durata umana o FPS. Il rilascio commerciale rimane **BLOCKED** finché mancano le prove
richieste con giocatori e telefono fisico.
