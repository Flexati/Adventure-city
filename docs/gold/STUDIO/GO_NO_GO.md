# Go / No-Go del rilascio commerciale

**Esito al 12 novembre 2026: NO-GO. `COMMERCIAL_RELEASE = BLOCKED`.**

| Condizione | Stato | Chi la chiude |
|---|---|---|
| `npm test` verde, tre volte di fila sul commit di rilascio | Verde una volta sul commit corrente; le tre esecuzioni vanno rifatte sul commit finale | Claude |
| Controlli nel browser tutti PASS | PASS [SIMULAZIONE], output in `docs/evidence/r19/m5/` | Claude |
| `app.js` sotto la guardia di 458 752 byte | Sì (vedi `SIZE_LOG.md`) | Claude |
| Playtest con persone (5) | **0 su 5** | Autore |
| Prova su telefono fisico: 60 fps nei boss, audio, tocco | **Non fatta** | Autore |
| Acquisto reale su Play (ponte nativo, prezzo 5,99 €, ripristino) | **Non esiste il ponte** | Autore (Play Console) + Claude (codice) |
| Variante gratuita con demo separata dalla premium (D60) | **Non costruita** | Claude, dopo il ponte |
| AAB firmato con la chiave vera | **Solo firma di prova** | Autore, sul suo PC |
| Token incollati in chat revocati | Da confermare | Autore |
| Arte: case dei villaggi, boss mancanti, suoni dei boss | Richiesta scritta (`requests/argon-case-villaggi-20261112/`), nulla consegnato | Argon |

Si passa a GO solo quando ogni riga in grassetto è chiusa con una prova scritta in `docs/evidence/`.
