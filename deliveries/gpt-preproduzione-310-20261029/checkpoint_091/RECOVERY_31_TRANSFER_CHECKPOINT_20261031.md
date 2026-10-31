# CHRONOS — Recupero integrità PNG e blocchi di sincronizzazione (31 ottobre 2026)

## Conclusione verificata

* **31 PNG originali recuperati e materializzati, SHA-256 = 31/31 identici al manifest precedente su Drive**.
* Composizione: **16** region Solkara (4 distretti × giorno/notte/evento/props), **12** enemy (Breaker 6, Echo 6), **3** Aurelia Span 04 (notte, evento vento, props). I 4 Axis Spine già su GitHub/Drive non sono duplicati nel delta.
* Creato un archivio ZIP immutato nei pixel e nei byte con percorsi canonici e manifest: `CHRONOS_31_ORIGINALI_RECUPERATI_SHA256_20261031.zip`, **77,742,223 byte**, SHA-256 `6414a63cdaedc647e7ce4f8b7ad3620194b8339b09c146405343aaf5872b4098`, CRC OK, **31/31 SHA OK**.
* Lo ZIP è nel filesystem della conversazione e disponibile come allegato scaricabile in quella conversazione; **NON** è su Drive né su GitHub.
* Il manifest certificato degli stessi 31 PNG è [RECOVERY_31_PNG_SHA256_VERIFICATI_20261031.csv](./RECOVERY_31_PNG_SHA256_VERIFICATI_20261031.csv).
* L'originale *alternativo* giorno Aurelia Span 04 (3,764,401 bytes, SHA-256 `075ab39f4afbba9144bd5f6f305d93033143d433d5f685f25af6e70889385579`) è stato salvato in modo reversibile su GitHub in **21 segmenti Base64** nel commit `608ee0774210e5f1f0cfbeb93c373e6fdd938c10` e riscontrato nell'albero GitHub (**21 segmenti + README**). Non sostituisce la mappa diurna canonica e non aumenta il conteggio dei PNG canonici.

## Blocco connessioni

* Drive: tentativi diretti di upload di PNG sia nella cartella dedicata sia alla radice attraverso Files sono stati respinti con `forbidden: location not writable`; un consenso in chat non cambia i permessi OAuth della connessione Drive.
* Library: il tentativo di caricare l'archivio di 77,7 MB è stato respinto con `library_storage_limit_exceeded`. I **31 PNG originali** sono già nella Library e sono stati materializzati per la verifica; nessun originale è stato cancellato.
* GitHub: la scrittura di file testuali, del manifest e di segmenti via Git data API funziona. I 31 PNG originali non sono ancora stati trasferiti come file binari in GitHub; `GITHUB_31_PNG_UPLOADED=0` nel presente intervento.

## Trasferimento residuo

Usare l'utility già presente in [upload_delta_35.py](./upload_delta_35.py) con il file ZIP creato. Carica i singoli PNG con verifica readback Git blob; supporta copia Drive via `rclone` quando la connessione è nuovamente scrivibile. Ripetere senza sovrascrivere file esistenti con hash divergente. Con credenziali disponibili su una macchina con accesso alle API:

```bash
python3 upload_delta_35.py CHRONOS_31_ORIGINALI_RECUPERATI_SHA256_20261031.zip --drive gdrive:CHRONOS_ASSET_DELTA_296_20261031
```

L'utility cerca `GITHUB_TOKEN` oppure il token di `gh auth token`, non è necessario comunicarlo in chat. Il remote `gdrive:` si configura tramite `rclone config`.

Stato attestato: 296/623 asset disponibili tra fonti, 265/623 PNG canonici già su GitHub secondo checkpoint pregresso; 31 originali recuperati e verificati, ma **non aggiunti** ai 265. Nessun avanzamento fittizio. `ART_QA_PENDING`, `COMMERCIAL_RELEASE=BLOCKED`.
