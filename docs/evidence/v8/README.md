# Evidenze v8 — Adventure City

Base Claude: `b6bd777`. La run storica `39687984453` è verde sul codice precedente.
Queste prove riguardano l’implementazione della campagna v8 e sono distinte dalla base v0.9.

- `npm test`: 94 test di logica, vincibilità, collisioni, transazioni, componenti, salvataggi e bundle.
- [Campagna A](campaign-a.json): da Nuova storia a postcrediti, 30 tappe, otto incarichi,
  due preparazioni offensive e ricongiungimento caldo. Input reali; nessuna scrittura nello stato.
- [Campagna B](campaign-b.json): 30 tappe, otto incarichi, preparazioni difensive e ricongiungimento freddo.
- [Campagna C sul bundle APK](campaign-c-bundle.json): 30 tappe, otto incarichi, ricongiungimento esitante; Chromium sullo script classico, non WebView Android.
- [Hub](hubs.json): fixture dichiarate, acquisti, scorte, ripresa nella stessa posizione,
  lifecycle nativo, ritorno di Lulù a Cathedral e dati legacy conservati; quattro viewport.
- [Runtime/audio](runtime.json): pausa nativa, impostazioni audio, riavvio, menu, tre atmosfere finali e salvataggio corrotto.
- [Tour](tour.json): hub, ricongiungimento, collasso e postcrediti su quattro viewport;
  nessun overflow, controllo fuori schermo o bersaglio sotto 44 px.

Le partite usano un clock browser accelerato: tempi e morti del bot non misurano durata umana,
framerate su telefono o qualità percepita. Le fixture dei test di ripresa non sono prove di una
partita completa. Gli atlanti erano già disponibili: NPC e alleati sono ora collegati al runtime.

La CI della PR esegue tre campagne, verifiche browser/audio, tour, benchmark e Android WebView.
L’APK debug e i report della CI sono consegnati dagli artifact e dal branch `build/v8-rc-<run-id>`.
Gli esiti della nuova CI vanno letti sulle run del commit applicativo, senza attribuire loro
l’esito della run storica. **Vendita ancora BLOCKED**: mancano prove fisiche e test umani.

Anteprime: [Moon Refuge](moon.png), [Toxic Bazaar](toxic.png), [Clockwork](clockwork.png), [conclusione](ending.png).
