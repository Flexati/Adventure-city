# character.nox.02 — Nox · v02

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: **il team compone la tavola dagli sheet reali** (non si chiede a GPT)

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_protagonisti.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/character/character_nox/`, file: `v02.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/character/character_nox/v02.png`

```
TAVOLA DA COMPORRE DAL TEAM, NON DA GENERARE.
Nox è protagonista (maschile (canone)). Regola dell'autore: il corpo e il volto V8 non si ridisegnano. Questa tavola si compone solo con fotogrammi reali del gioco.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
protagonista: pilota della Vortex e combattente con guanto Pulse. Variante 02: H-17: precisione bianco-nera e cellette azzurre solo in maschera.

2. SOGGETTO, MATERIALI E COLORI
Fotogrammi reali, senza ritocchi: game/art/v10/nox_h17_gun.png (H-17 in maschera, 16 celle), game/art/v10/nox_h17_reload.png. Palette letta dagli sheet: #F2F2F2, #1A1A1E, #2C6BD8, #7A4A2E, #59E0FF.

3. STILE
Lo stile è quello degli sheet originali: nessun filtro, nessun ridimensionamento non intero.

4. ANGOLAZIONE E COMPOSIZIONE
Quattro direzioni (fronte, schiena, lato, diagonale), posa idle, gesto della variante, ritratto da portraits.png, palette; stessa scala per tutte le figure, piedi sulla stessa linea.

5. VISTE E POSE
Scelte dal team fra le celle esistenti; per le varianti con arma solo celle già verificate (rapporti in docs/evidence/v10.2/production/armi/).

6. COERENZA
Identità garantita perché i pixel sono quelli del gioco: verifica SHA-256 delle sorgenti in v02.json.

7. FORMATO
PNG 1536×1024 opaco, intestazione con ID canonico.

8. RESTRIZIONI
- nessun pixel del personaggio modificato fuori dalle maschere già approvate
- se servirà un'immagine nuova (posa che non esiste), si chiede a GPT SOLO una modifica in maschera sopra la cella reale, come per H-17/ARC-7
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```
