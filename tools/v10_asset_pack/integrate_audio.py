"""Stage only explicitly bound SFX; preserve prototype provenance and source hashes."""
import csv
import hashlib
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PACK = ROOT / 'generated/CHRONOS_V10_ASSET_PRODUCTION_PACK'

def integrate():
    rows = list(csv.DictReader((PACK / '10_MANIFESTS/ASSET_MANIFEST_V10_GENERATED.csv').open()))
    by_id = {row['asset_id']: row for row in rows}
    bindings = re.findall(r"^\s*(?:'([^']+)'|(\w+)):\{assetId:'([^']+)',path:'([^']+)'", (ROOT / 'game/v10-bindings.mjs').read_text(), re.M)
    ledger = []
    for quoted, plain, asset_id, destination in bindings:
        row = by_id[asset_id]
        source = (PACK / row['runtime_path']).resolve()
        if not source.is_relative_to(PACK.resolve()) or source.suffix != '.ogg':
            raise ValueError('Invalid source: ' + asset_id)
        digest = hashlib.sha256(source.read_bytes()).hexdigest()
        if digest != row['sha256']:
            raise ValueError('Source hash mismatch: ' + asset_id)
        target = (ROOT / 'game' / destination).resolve()
        if not target.is_relative_to((ROOT / 'game/audio/v10').resolve()):
            raise ValueError('Invalid destination: ' + destination)
        if target.exists() and hashlib.sha256(target.read_bytes()).hexdigest() != digest:
            raise ValueError('Review modified destination before replacement: ' + destination)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
        ledger.append({'asset_id': asset_id, 'event': quoted or plain, 'source_path': row['runtime_path'],
            'destination': 'game/' + destination, 'sha256': digest, 'classification': 'NEW',
            'original_status': row['status'], 'quality_status': 'PROTOTYPE',
            'runtime_owner': 'AudioDirector / explicit V10_SFX_BINDINGS',
            'scope': 'One event sample; does not complete the whole SFX family',
            'rights_status': 'NOT_VERIFIED', 'auditory_qa': 'NOT_TESTED'})
    (ROOT / 'game/audio/v10/integration.json').write_text(json.dumps(ledger, indent=2) + '\n')
    print(json.dumps({'staged_audio': len(ledger), 'commercial_ready': 0}))

if __name__ == '__main__':
    integrate()
