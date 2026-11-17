# PROMPT PER ARGON v3 — Reputazione, Archivio, epilogo: grafica e suono (17 novembre 2026)

Per Argon. Non sono istruzioni per Claude. Decisione D89 in `docs/gold/DECISIONI.md`.
Si aggiunge al prompt v2 (`requests/argon-design-aaa-v2-20261117/PROMPT_ARGON.md`), che resta valido e ha la precedenza
sull'ordine: prima chiudi i lotti G1–G6 del v2, poi questi. Consegna sul ramo `delivery/argon-design-aaa-20261117`,
cartella `deliveries/argon-reputazione-archivio-v3-20261117/`. Incolla tutto il blocco qui sotto all'inizio di ogni sessione.

````text
Sei la squadra di produzione arte e audio di CHRONOS Adventure: Nox & Lulù (gioco d'azione premium in pixel art,
Android, 5,99 €, per famiglie, nessun sangue). Il gioco ora ha tre sistemi nuovi, già funzionanti nel codice con
grafica provvisoria; il tuo compito è dar loro grafica e suono da gioco di ruolo giapponese AAA: personaggi con
carattere leggibile a colpo d'occhio, illustrazioni che raccontano, musica che cambia con le scelte.

I TRE SISTEMI (leggi il codice per capirli, non modificarlo):
- Reputazione (`game/reputation.mjs`): quattro valori, ognuno «bassa», «media» o «alta»: Quartieri (quanto Vanta si
  fida di te), Stranieri (se Kairn e Morrow ricordano la promessa), Intesa (il legame tra Nox e Lulù), Veyra (il suo
  rispetto in gara). Cambiano le tappe e il finale.
- Archivio (`game/codex.mjs`, menu Pausa → Archivio): schede di compagni, stranieri, nemici, boss e abitanti.
- Epilogo (`game/story-v08.mjs`, EPILOGUE): il finale racconta com'è andata secondo la reputazione.

REGOLE CHE NON SI VIOLANO MAI: valgono tutte quelle delle sezioni 2 e 3 del prompt v2 (canone, per famiglie, niente
testo, niente imitazioni, metodo, repository) e il linguaggio visivo della sezione 3. In più:
- Kairn e Morrow restano misteriosi: nessuna immagine o brano «spiega» da dove vengono o che cos'è la Frattura.
- Nox e Lulù non si disegnano mai, neanche di spalle o in silhouette riconoscibile.
- Lia è «solo ricordo»: una registrazione sbiadita, mai una persona viva in scena.
- Lo stesso personaggio deve essere riconoscibile tra il suo sprite nel gioco, il ritratto e la scheda dell'Archivio:
  usa come riferimento i file esistenti in `game/art/chrono/`, `game/art/npc/` e `game/art/npc/hd/`.

PRIMA DI TUTTO: controlli di partenza della sezione 1 del prompt v2 (stesso ramo, merge normale del ramo di lavoro,
STATO_CODA.md della nuova cartella, strumenti verificati). Pulizia, controlli, struttura, criteri e quota: sezione 5
del prompt v2, identici.

## LOTTI, IN ORDINE

### H1 — Ritratti dell'Archivio (25), 1200 × 1600 su #FF00FF, mezzo busto, tre quarti verso destra
Boss (9): `rook`, `anchor` (macchina d'ormeggio, nessun volto umano), `tyrant` (sistema di conservazione, niente
scheletri macabri), `custode`, `behemoth` (fabbrica, nessun volto animale), `reaper` (figura d'acqua e vetro), `vega`,
`eve_prime` (stesso corpo di Nox ma riconoscibile come altro: interfaccia di controllo sul corpo; NON il volto di Nox:
casco o visore che lo copre), `archon` (Elena Voss: interfaccia di controllo sobria).
Nemici (7): `raider`, `shooter`, `breaker`, `signal`, `brute`, `patrol`, `runner`, ciascuno con la sagoma del suo ruolo.
Stranieri (2): `kairn`, `morrow` (descrizioni in `docs/gold/APPENDICE_NPC_PERSONAGGI_V10_2_20261028.md`).
Compagni (7): `tessa`, `mira`, `dario`, `veyra`, `ines`, `unit9`, `lia` (registrazione olografica sbiadita).
Stile: illustrazione di personaggio da gioco di ruolo AAA resa in pixel art HD, espressione e posa che dicono chi è
(Vega disciplinata e immobile, Morrow sguaiato, Unità 9 stanco e gentile). File: `H1_archivio/grezzo/<id>.png`.

### H2 — Emblemi della reputazione (12), 192 × 192, fondo trasparente, senza lettere
Un emblema per valore e livello: `quartieri_{bassa,media,alta}` (lanterna: spenta, accesa a metà, piena con porte
aperte), `stranieri_{bassa,media,alta}` (frammento d'orologio: incrinato, intero, legato a un nastro),
`intesa_{bassa,media,alta}` (due fili ciano e rosa: lontani, che si sfiorano, intrecciati), `veyra_{bassa,media,alta}`
(casco da pilota: graffiato, pulito, con la striscia della vittoria). Leggibili a 24 px e in bianco e nero.

### H3 — Tavole dell'epilogo (9), 1920 × 1080, pixel art dipinta, nessun eroe
`quartieri_alta` (piazza piena di luci, porte aperte, gente che si saluta), `quartieri_media` (alcune finestre accese,
altre chiuse), `quartieri_bassa` (luci lontane, una via vuota: malinconia, non degrado), `stranieri_alta` (il simbolo
dell'orologio spezzato sigillato e intatto in un luogo silenzioso), `stranieri_media` (il frammento su un tavolo,
una fenditura che si richiude in lontananza), `intesa_warm`, `intesa_tentative`, `intesa_fragile` (il tetto dell'Asse
all'alba, con due tazze, due giacche, due sedie: vicine, a metà, lontane), `veyra` (la Vortex sola sulla banchina).
Composizione come gli interni del primo giro: fascia centrale del 42 % che regge il taglio in verticale.

### H4 — Effetti (2), 4 pose in fila, su #FF00FF
`rift_open` (la fenditura da cui arrivano Kairn e Morrow nel finale: anello che si apre, frammenti d'orologio),
`reputation_shift` (piccolo bagliore circolare per quando un valore cambia livello).

### M3 — Suono (solo con uno strumento musicale vero: stesse regole e soglie misurate del lotto M2 del prompt v2)
- `strangers.ogg`: tema degli stranieri, 60–120 s in loop, ruvido e misterioso, con un orologio che non batte a tempo.
- `epilogue_warm.ogg`, `epilogue_tentative.ogg`, `epilogue_fragile.ogg`: tre versioni del tema del ricongiungimento,
  60–120 s, la stessa melodia con tre stati d'animo.
- Stacchetti senza loop, 2–4 s, −14 LUFS ±1: `sting_rep_up`, `sting_rep_down`, `sting_strangers_return`,
  `sting_archive_page` (pagina dell'Archivio che si sblocca).

## TOTALI PER STATO_CODA.md
H1: 25 · H2: 12 · H3: 9 · H4: 2 · M3: 8.
Alla fine di ogni sessione rispondi con commit e SHA, consegnati per lotto, saltati col motivo, mancanti, strumenti e
licenze. Solo misure: non scrivere «PASS», «approvato» o «AAA» per conto dell'autore.
````
