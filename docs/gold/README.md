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
| [AUDIO_REGISTER](AUDIO_REGISTER.json) | 129 brief originali e lacune di produzione/integrazione |
| [PLAYTEST](PLAYTEST.md) | Durata richiesta e sessioni umane effettivamente disponibili |
| [INTRO](INTRO.md) | Integrazione dei due video JaguarzCreatorz |
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
