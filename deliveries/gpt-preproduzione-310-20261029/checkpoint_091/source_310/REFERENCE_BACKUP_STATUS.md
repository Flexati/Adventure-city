# Source reference set for all 310 original CHRONOS prompts
Original from checkpoint083/riferimenti/ in verified Library archive `CHRONOS_V10_2_CHECKPOINT_083_PARTE_1.zip`.
Contains **15 canonical reference PNGs** and original `SORGENTI.json` (16 total).
ZIP `CHRONOS_310_RIFERIMENTI_CANONICI_CHECKPOINT_083.zip`: 12391492 bytes, SHA-256 `ca3130707cfc24388ed7b6b890426bd6286a2fdcaef8a63277333a17280ee423`. Zip CRC checked.
Cloud archive is backed up to the existing Google Drive folder. Git stores the original ZIP contents **losslessly** in `reference_archive_parts/ref.zip.b64.part01.txt` ... `part12.txt`, because a one-step binary write exceeded connector transport limits.
To restore exact original ZIP: `node RESTORE_310_REFERENCES.mjs`; unpack `unzip -n CHRONOS_310_RIFERIMENTI_CANONICI_CHECKPOINT_083.zip` from this directory; then `sha256sum -c REFS_SHA256SUMS.txt`.
The GitHub Action `restore-chronos-310-references.yml` performs those checks and commits the 16 originals into this folder on the delivery branch. **Never confuse missing art assets with these reference inputs**.
