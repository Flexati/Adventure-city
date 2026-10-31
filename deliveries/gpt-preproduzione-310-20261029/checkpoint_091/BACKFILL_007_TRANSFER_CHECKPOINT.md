# CHRONOS — BACKFILL 007: safeguarded in Git
Date 2026-10-31; `COMMERCIAL_RELEASE=BLOCKED`.
GitHub now contains two new direct PNG candidates `region/region_aurelia_span/v03_notte.png` and `v03_props.png`, plus all exact original bytes of the larger `v03.png` and `v03_evento.png` in lossless Base64 shards (four pieces each). Their originals reside on Google Drive. Byte size and SHA-256 are recorded in `MANIFEST_BACKFILL_007.csv`; all four were checked against Drive.
**The two sharded files are NOT canonical paths on this branch until restored and committed**. Restore by running `node deliveries/gpt-preproduzione-310-20261029/checkpoint_091/RESTORE_BACKFILL_007.mjs` in a clone. This reassembles exact bytes with SHA-256 checks; it does not overwrite different files.
Current GitHub: **258/623 canonical paths**, 9 extra PNGs, **365 canonical missing** (2 reconstructable from shards). Drive additionally contains Aurelia Span 04 day. Combined source union count is not equivalent to GitHub count or approved art.
Caution: `ASSET_MANCANTI_VERIFICATI_20261031_367.csv` was a **historic snapshot before this commit**; use `ASSET_MANCANTI_VERIFICATI_AFTER_007_365.csv` for GitHub canonical gap.
The 007 props needs chroma QA; all work is candidate only. No release.
