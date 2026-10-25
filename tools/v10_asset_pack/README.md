# CHRONOS V10 Asset Bootstrap

This bootstrap avoids committing one 127 MB ZIP, which exceeds GitHub's normal single-file limit.

## Source of truth

Repository: `Flexati/Adventure-city`  
Branch: `work/v10-assets-generator`  
Base: `work/chronos-adventure-commercial`

Canonical visual direction remains:

`assets/chrono_shadows/latest_v85/`

The generator reads:

`tools/v10_asset_pack/source/MATRICE_CONTENUTI_ASSET_V10_2.csv`

and writes the generated pack to:

`generated/CHRONOS_V10_ASSET_PRODUCTION_PACK/`

## Build

From the repository root:

```bash
python3 -m venv .venv-v10
source .venv-v10/bin/activate
pip install -r tools/v10_asset_pack/requirements.txt
python tools/v10_asset_pack/build_chronos_v10_asset_pack.py
```

Expected result: roughly 750+ files covering all V10.2 matrix requirements.

## Verify

```bash
python - <<'PY'
from pathlib import Path
root = Path("generated/CHRONOS_V10_ASSET_PRODUCTION_PACK")
files = [p for p in root.rglob("*") if p.is_file()]
print("files:", len(files))
assert (root/"10_MANIFESTS/ASSET_MANIFEST_V10_GENERATED.csv").exists()
assert (root/"10_MANIFESTS/SHA256SUMS.txt").exists()
PY
```

Then inspect:

- `00_README/README_FIRST.md`
- `00_README/STATUS_REPORT.md`
- `10_MANIFESTS/ASSET_MANIFEST_V10_GENERATED.csv`
- `10_MANIFESTS/CONTENT_COVERAGE.json`
- `10_MANIFESTS/FINAL_ART_PROMPT_LEDGER.csv`
- `12_INTEGRATION/INTEGRATION_GUIDE.md`

## Important status rule

Generated files are `PROTOTYPE` / `GAMEPLAY_READY` candidates, not automatically commercial-final.

Do not replace a superior V8/V8.5 asset only because the generated V10 file is newer.

Use the integration classification:

- `REUSE`
- `ADAPT`
- `REPLACE`
- `NEW`
- `REJECT`

Characters, bosses and hero sprites require final visual comparison against V8.5 art direction and runtime QA.

## Apply to the game

Do not copy the whole directory blindly into runtime assets.

1. Build the pack.
2. Read the generated manifest.
3. Map each `asset_id` to the existing runtime path.
4. Compare against current V8/V8.5 asset.
5. Integrate only accepted assets.
6. Preserve asset IDs/event bindings where possible.
7. Test Android at 360x800, 390x844 and 412x915.
8. Validate audio mix, loops, telegraphs, memory and pause/resume.
9. Commit integration separately from bootstrap generation.

Recommended integration branch:

`work/v10-asset-integration`

## Commit strategy

The 127 MB size is fine when stored as many normal files; GitHub's hard problem is a *single* file >100 MB.

Do not commit the generated ZIP.

Commit the extracted/generated assets, preferably by family:

1. docs + manifests
2. UI/VFX
3. characters/enemies/bosses
4. weapons/regions/races
5. SFX
6. music

If repository size becomes undesirable, keep master WAV files outside Git and commit only runtime OGG plus manifests.

## Worker integration command

After generation, create or switch to:
work/v10-asset-integration

Then integrate by manifest rather than blindly copying the entire generated directory.

Suggested runtime-size pass:
python tools/v10_asset_pack/build_chronos_v10_asset_pack.py --runtime-only

Suggested full production pass:
python tools/v10_asset_pack/build_chronos_v10_asset_pack.py
