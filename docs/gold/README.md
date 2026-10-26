# CHRONOS Gold — indice di sviluppo

Branch operativo: `work/chronos-adventure-commercial`. **COMMERCIAL_RELEASE = BLOCKED.** Questo ramo contiene il lavoro V10.2 in corso, non una consegna commerciale approvata.

## Ordine di consultazione

| Documento | Funzione |
| --- | --- |
| [STATO](STATO.md) | Stato corrente, risultati e prossimo blocco eseguibile |
| [REQUISITI](REQUISITI.md) | Metodo di verifica e collegamento ai 74 ID originali |
| [Registro completo](../production/v10.2/CHECKLIST_STATUS.json) | 74 criteri, AS01–AS12 ed E00–E12, mantenuti separati |
| [DECISIONI](DECISIONI.md) | Scelte creative e motivazioni, incluse Neris, Ivo e L6 |
| [ASSET_REGISTER](ASSET_REGISTER.json) | File effettivamente censiti, hash, provenienza, uso e limiti |
| [FILE_INVENTORY](FILE_INVENTORY.json) | Censimento tecnico completo dei media trovati in `game/`, hash, formati e inclusione nel pacchetto |
| [AUDIO_REGISTER](AUDIO_REGISTER.json) | 129 brief originali e lacune di produzione/integrazione |
| [PLAYTEST](PLAYTEST.md) | Durata richiesta e sessioni umane effettivamente disponibili |
| [LOCALIZZAZIONE](LOCALIZZAZIONE.md) | IT/EN reversibile, copertura dei testi e prove di salvataggio/negozi |
| [LOCALE_REGISTER](LOCALE_REGISTER.json) | Testi censiti con traduzioni, origini e hash; ambito limitato esplicito |
| [INTRO](INTRO.md) | Integrazione dei due video JaguarzCreatorz |
| [Asset prodotti V10.2](../../assets/production/v10.2/README.md) | Master realmente generato, export runtime e provenienza della borraccia |
| [RELEASE](RELEASE.md) | Gate Android/Play e configurazione della futura candidata |

## Modifiche conservate

- Menu animato con riduzione del movimento e icona derivata dal riferimento dell'autore.
- Intro JaguarzCreatorz 720/1080, salto, audio su gesto, fallback e risorse locali Android.
- Segni di Gesso, due rotte, conseguenze salvate e traccia materiale nel percorso Nox.
- Recupero dei salvataggi v7 avanzati, inclusi checkpoint boss e ritorni agli hub.
- Correzione della conoscenza di Nox nell'Archivio e della sovrapposizione avviso/barra boss.
- Cura rapida, quantità visibile e rollback del consumo quando il salvataggio fallisce.

## Prove da consultare

| Ambito | Prova | Limite |
| --- | --- | --- |
| Logica e pacchetto risorse | `npm test`: 147/147 PASS al checkpoint | Non attesta resa o prestazioni Android |
| Campagna A/B/C | [A](../evidence/v10.2/campaign-a-report.json), [B](../evidence/v10.2/campaign-b-report.json), [C](../evidence/v10.2/campaign-c-report.json) | Sorgente precedente a intro/HUD/Cura, verificati separatamente |
| Migrazione v7 | [Rapporto](../evidence/v10.2/chalk-migration-report.json) | Due fixture storiche, non tutti i salvataggi possibili |
| Intro | [Rapporto](../evidence/v10.2/studio-report.json) | Browser; diritti e dispositivo ancora da verificare |
| Cura | [Rapporto](../evidence/v10.2/medicine-report.json) | Browser e logica; IT/EN e osservazioni umane aperti |
| Fonti V8.5 | [Audit](../evidence/v10.2/v85-source-audit.json) | Bibbia recuperata; ZIP e preview non decodificabili |

## Lavoro residuo

Direzione artistica e Coerenza narrativa restano gate autonomi. Il registro conserva **14 PARTIAL / 60 OPEN**, zero criteri commerciali dichiarati VERIFIED. Le 442 famiglie asset sono requisiti da completare: il censimento limitato di sei file runtime non equivale al loro completamento.

Sono ancora eseguibili integrazione di armi e gare nella campagna, incontri e regioni mancanti, missioni V10.2, localizzazione e produzione degli asset pertinenti. Servono inoltre fonti artistiche valide, attestazioni dei diritti, playtest umani, dispositivi Android e chiave privata di upload esistente. Queste dipendenze non autorizzano a dichiarare concluso il lavoro indipendente.

Il repository conserva i checkpoint; l'esecuzione dell'agente avviene soltanto durante una sessione attiva. Questo indice non configura un servizio autonomo o un loop in background.

## Ultimo censimento tecnico

`python3 tools/prepare_android_assets.py` e `python3 tools/audit_media.py`: 131 file controllati (117 media e 14 sorgenti MIDI); 80 media inclusi fra le 84 risorse del pacchetto Android. Immagini decodificate, XML SVG controllati, audio/video decodificati interamente con FFmpeg; per MIDI è verificata soltanto l'intestazione. Nessun file ha fallito questi controlli. Non sono prove di ascolto, licenza o qualità artistica.

`ASSET_REGISTER.json` collega tutti i 442 ID originali ai rispettivi contenuti. Nove requisiti hanno candidati file associati; gli altri richiedono ancora riconciliazione/produzione. La presenza di un candidato non prova completezza della famiglia. Nessuna famiglia è stata promossa a COMMERCIAL_READY dal censimento.

Ultimo blocco applicativo: borraccia realmente generata e civile animato nel callback di Nox. Il master resta fra i sorgenti di produzione, lo sprite 48×64 è nel gioco e nel pacchetto Android; il vecchio civile SVG è ritirato fra i prototipi. Suite 148/148 PASS e due rotte browser verificate, con screenshot e hash nel [rapporto della scena](../evidence/v10.2/chalk-scene-report.json). Queste prove non chiudono i gate commerciali residui.

## Sprite sheet e musica effettivamente prodotti

| File | Uso e prova |
| --- | --- |
| [Master sheet](../../assets/production/v10.2/chalk_flask-states-master.png) | Nuova generazione con quattro stati fisici distinti |
| [Sheet runtime](../../game/art/v09/chalk_flask_states.png) | Quattro celle 48×64, collegate al progresso degli accessi e al callback |
| [Master musicale FLAC](../../assets/production/v10.2/chalk-route-master.flac) | Composizione originale locale, 40 secondi, 96 BPM, senza campioni esterni |
| [Partitura JSON](../../assets/production/v10.2/chalk-route-score.json) | Eventi musicali riproducibili con `tools/compose_chalk_score.py` |
| [Ogg runtime](../../game/audio/v10/chalk_route.ogg) | Colonna sonora di Segni di Gesso, inclusa nel pacchetto Android |
| [Prova musicale](../evidence/v10.2/chalk-music-report.json) | Playback browser, pausa/ripresa e limite degli stream |

Ultima verifica: 149/149 test PASS, 133 file nel censimento tecnico (119 media e 14 sorgenti MIDI), 82 media nel pacchetto di risorse Android. La richiesta Creative Claw è stata bloccata per saldo zero senza generazione o addebito: il master musicale pubblicato è composto e sintetizzato localmente. Ascolto umano, diritti, mix finale e dispositivo restano aperti. E10 e AS10 non sono dichiarati completati.

## Blocco corrente: combattimento

[Rook: implementazione, asset, prove e lacune](ROOK.md). IT/EN non è la priorità corrente per istruzione dell’autore; le modifiche e prove già esistenti sono conservate. Stato commerciale: BLOCKED.

## Ultimo blocco pubblicabile

[Kit di Tessa, Quickdraw e recupero v7](FIELD_KIT.md): asset reali, armi in campagna, A/B/C, migrazione e limiti. È il punto di ingresso corrente; `ROOK.md` conserva anche il checkpoint precedente.

[Kairn e Morrow fedeli alla foto dell’autore](STRANIERI.md): sheet, comportamento, audio, prove e rischio di somiglianza. [Ricarica VX-9/R-12](EQUIPPED_WEAPONS.md#ricarica-vx-9--r-12--integrazione-dei-master-codex). Punto di ingresso corrente: [STATO.md](STATO.md).
[Banda di gioco su telefono orizzontale](LAYOUT_ORIZZONTALE.md): misure prima/dopo, contratto dei comandi e lacune.
