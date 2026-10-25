# V10 sprite QA

SPRITE_GATE = BLOCKED.

Nessun atlante player/NPC/enemy/boss del pack è entrato nel runtime.
Le animazioni esistenti sono preservate; nessuna sostituzione di Nox/Lulù.

L'audit legge tutti i PNG e i JSON pertinenti e verifica:
dimensioni, alpha, griglia, numero e limiti dei frame, pivot in canvas,
frame duplicati e bounding box alpha per frame.
Risultati integrali: `artifacts/v10/asset-audit.json`, sezione `files`.

La pipeline generata usa frame 128×128, 8 colonne, 5 righe e pivot [64,110].
Gli stati sono idle/walk/run/attack/hurt: mancano ranged_attack, dodge,
hit distinto, death e interaction richiesti per il player.
Non vengono inventati alias per dichiarare questi stati completi.
Gli stati aggiuntivi vanno prodotti con animazioni reali pertinenti.

La verifica statica non certifica foot anchor stabile, facing corretto,
timing, loop percettivo, silhouette, volto, armi, costume o anatomia.
Queste verifiche rimangono NOT_TESTED per i pack esclusi.

AutoSprite Nox Idle/Run: nessun output PNG/JSON utilizzabile è stato
identificato fra i file del generatore importati in questo strike.
Nessuna animazione AutoSprite è dichiarata integrata o verificata.
La mera disponibilità di uno strumento esterno non costituisce un file sorgente.

I campioni sintetici di test dell'auditor verificano casi negativi:
griglia errata, pivot/righe fuori range, duplicati, stati mancanti e file corrotti.
Non sono asset del gioco né prove artistiche.
