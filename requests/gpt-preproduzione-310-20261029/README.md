# Richiesta a GPT — 310 tavole di preproduzione V10.2 (29 ottobre 2026)

L'autore ha autorizzato la produzione anticipata: si generano anche città, personaggi, nemici, boss e mosse che non hanno ancora una scena giocabile. Le misure di gioco, invece, non si inventano.

`COMMERCIAL_RELEASE = BLOCKED`. **Un prompt pronto non è un'immagine generata**: nel registro le tavole restano `SPECIFIED_NOT_GENERATED` finché il file non arriva e non passa i controlli.

## Cosa c'è qui

| File | Contenuto |
|---|---|
| `TUTTI_I_PROMPT.md` | I 310 prompt in un solo file. Prima i contenuti già nel gioco, poi quelli futuri. |
| `prompt/<categoria>/<asset_id>.md` | Un file per prompt, con allegati, nomi dei file da consegnare e master atteso. |
| `riferimenti/` | 15 tavole di riferimento fatte **solo con arte reale del gioco**, da allegare in GPT. `SORGENTI.json` riporta l'SHA-256 di ogni immagine usata. |
| `INDICE.json` | Per ogni prompt: percorso, SHA-256, allegati, file attesi, produzione (`GPT_IMAGE` o `TEAM_COMPOSITION`). |

Ogni prompt ha le stesse 8 sezioni:
1. identità e collegamento narrativo;
2. soggetto, materiali e colori in hex;
3. stile pixel art HD del gioco;
4. camera, luce e composizione;
5. viste, pose e animazioni;
6. coerenza della famiglia;
7. sfondo e formato;
8. restrizioni.

## Conteggio

| Categoria | Tavole | Come si producono |
|---|---:|---|
| Città e quartieri | 36 | GPT, 4 immagini per tavola: giorno, notte (modifica del giorno), evento (modifica del giorno), foglio oggetti su verde |
| Personaggi e NPC | 72 + 6 | 72 con GPT (model sheet su verde + 3 ritratti). Le **6 tavole di Nox e Lulù le compone il team dai fotogrammi reali**: sono già fatte e verificate pixel per pixel. |
| Nemici | 48 | GPT: sprite sheet 8×4 e foglio effetti; le varianti territoriale ed élite modificano la base |
| Boss | 68 | GPT: scena del momento e foglio effetti; nella tavola 1 anche lo sprite su verde |
| Mosse | 80 | GPT disegna **solo gli effetti**; il team li monta sui fotogrammi reali di Nox e Lulù |

## Come usarli in GPT

1. Una chat per famiglia, cioè per contenuto: per esempio tutte e 4 le tavole di Ash Docks nella stessa chat.
2. Carica gli allegati indicati in cima al prompt (cartella `riferimenti/`).
3. Incolla il blocco del prompt. Per le varianti 02 e seguenti allega anche le immagini già fatte della stessa famiglia: così volto, colori e geometria restano gli stessi.
4. Notte ed evento delle città si chiedono come **modifica** dell'immagine del giorno, non come nuova generazione.
5. Salva i file con i nomi esatti indicati nel prompt.

**Consegna:** ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/<categoria>/<contenuto>/`. Per ogni file aggiungi la provenienza (strumento, data, condizioni d'uso). Non dichiarare controlli: li fa il team.

## Cosa fa il team quando arrivano

Lancia `python3 tools/verify_preproduction_delivery.py <checkout del ramo> <rapporto.json> [--write]`. Controlla:
- decodifica, misura, byte e SHA-256;
- sfondo verde e soggetto staccato dai bordi;
- stessa geometria fra giorno, notte ed evento (correlazione dei contorni);
- stessa scala del soggetto fra le varianti.

Le tavole che passano vanno in `assets/preproduction/v10.2/variants/` con il loro JSON. Lo stato diventa:
- `TECHNICALLY_VERIFIED` per i contenuti già nel gioco;
- `CONCEPT_ONLY` per quelli futuri.

Nessuna tavola diventa sprite di gioco senza una lavorazione a parte: ritaglio, maschere, misure e prova in gioco.

## Rigenerare

```
python3 tools/build_preproduction_refs.py requests/gpt-preproduzione-310-20261029/riferimenti
python3 tools/build_preproduction_prompts.py --registry
python3 tools/compose_protagonist_boards.py
```

I dati artistici (identità, materiali, palette, riferimenti) stanno in `tools/preproduction_art_direction.py`. Dove il canone tace, il dato è marcato «proposta».
