"""Inspect actual files; technical decoding is never commercial/artistic approval."""
import argparse
import csv
import hashlib
import json
import math
import re
import subprocess
import zipfile
from collections import Counter, defaultdict
from pathlib import Path

import numpy as np
import soundfile as sf
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
PACK = ROOT / 'generated/CHRONOS_V10_ASSET_PRODUCTION_PACK'

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def safe_file(base, value):
    candidate = (base / value).resolve()
    if not value or not candidate.is_relative_to(base.resolve()):
        raise ValueError('Missing/unsafe path: ' + value)
    if not candidate.is_file() or candidate.stat().st_size == 0:
        raise ValueError('Missing/empty file: ' + value)
    return candidate

def inspect(path):
    result = {'bytes': path.stat().st_size, 'format': path.suffix[1:]}
    if path.suffix in ('.png', '.webp'):
        with Image.open(path) as image:
            image.load()
            result.update(width=image.width, height=image.height,
                decoded_bytes=image.width * image.height * 4,
                alpha='A' in image.getbands(), oversized=max(image.size) > 2048)
            if image.mode == 'RGBA':
                result['alpha_extrema'] = list(image.getchannel('A').getextrema())
    elif path.suffix == '.zip':
        with zipfile.ZipFile(path) as archive:
            bad = archive.testzip()
            if bad:
                raise ValueError('Archive CRC failure: ' + bad)
            result['archive_entries'] = len(archive.namelist())
    elif path.suffix == '.ogg':
        audio, rate = sf.read(path, always_2d=True, dtype='float32')
        if not len(audio) or not np.isfinite(audio).all():
            raise ValueError('Invalid PCM')
        peak = float(np.max(np.abs(audio)))
        rms = math.sqrt(float(np.mean(audio.astype('float64') ** 2)))
        result.update(sample_rate=rate, channels=audio.shape[1], duration=len(audio)/rate,
            decoded_bytes=audio.size*4, peak=peak, rms=rms,
            peak_dbfs=20*math.log10(max(peak, 1e-12)),
            rms_dbfs=20*math.log10(max(rms, 1e-12)),
            clipped_samples=int(np.sum(np.abs(audio) >= 1)),
            loop_boundary_delta=float(np.max(np.abs(audio[0]-audio[-1]))),
            auditory_qa='NOT_TESTED', three_loop_listening='NOT_TESTED')
    elif path.suffix == '.json':
        metadata = json.loads(path.read_text())
        result['valid_json'] = True
        if 'frameWidth' in metadata:
            with Image.open(path.with_suffix('.png')) as image:
                fw, fh = metadata['frameWidth'], metadata['frameHeight']
                cols, rows = metadata['columns'], metadata['rows']
                if fw <= 0 or fh <= 0 or (fw*cols, fh*rows) != image.size:
                    raise ValueError('Atlas dimensions inconsistent')
                px, py = metadata['pivot']
                if not (0 <= px <= fw and 0 <= py <= fh):
                    raise ValueError('Invalid pivot')
                duplicates, bounds = {}, {}
                for name, animation in metadata['animations'].items():
                    row, frames = animation['row'], animation['frames']
                    if not (0 <= row < rows and 0 < frames <= cols):
                        raise ValueError('Animation outside atlas: ' + name)
                    hashes, boxes = [], []
                    for frame in range(frames):
                        cell = image.crop((frame*fw, row*fh, (frame+1)*fw, (row+1)*fh))
                        hashes.append(hashlib.sha256(cell.tobytes()).hexdigest())
                        boxes.append(cell.getchannel('A').getbbox())
                    duplicates[name] = frames-len(set(hashes))
                    bounds[name] = boxes
                result.update(atlas_valid=True, frame_size=[fw, fh], pivot=[px, py],
                    animations=list(metadata['animations']), duplicate_frames=duplicates,
                    alpha_bounds=bounds,
                    missing_player_states=sorted(set(['idle','walk','run','attack','ranged_attack','dodge','hit','hurt','death','interaction'])-metadata['animations'].keys()))
    return result

def audit():
    docs = ROOT / 'docs'
    docs.mkdir(exist_ok=True)
    evidence = ROOT / 'artifacts/v10'
    evidence.mkdir(parents=True, exist_ok=True)
    rows = list(csv.DictReader((PACK/'10_MANIFESTS/ASSET_MANIFEST_V10_GENERATED.csv').open()))
    matrix = list(csv.DictReader((ROOT/'tools/v10_asset_pack/source/MATRICE_CONTENUTI_ASSET_V10_2.csv').open()))
    ids = [r['asset_id'] for r in rows]
    assert len(ids) == len(set(ids)) == 442
    assert set(ids) == {r['asset_id'] for r in matrix}
    ledger = json.loads((ROOT/'game/audio/v10/integration.json').read_text())
    chosen = {r['asset_id']: r for r in ledger}
    mobile_report = ROOT/'artifacts/v10/mobile/report.json'
    observations = []
    if mobile_report.exists():
        report = json.loads(mobile_report.read_text())
        fingerprint = hashlib.sha256()
        for name in ['runtime.mjs','audio-engine.mjs','v10-bindings.mjs']:
            fingerprint.update((ROOT/'game'/name).read_bytes())
        if report.get('result') == 'PASS' and report.get('sourceFingerprint') == fingerprint.hexdigest():
            observations = [r['audio'] for r in report['rows'] if r.get('scene') == 'sample-playback']
    checked, errors, hashes, referenced = {}, [], defaultdict(list), set()
    for file in sorted(PACK.rglob('*')):
        if not file.is_file():
            continue
        rel = file.relative_to(PACK).as_posix()
        hashes[digest(file)].append(rel)
        try:
            checked[rel] = inspect(file)
        except Exception as error:
            checked[rel] = {'error': str(error)}
            errors.append({'file': rel, 'error': str(error)})
    checksum_errors = []
    for line in (PACK/'10_MANIFESTS/SHA256SUMS.txt').read_text().splitlines():
        expected, name = line.split('  ', 1)
        try:
            if digest(safe_file(PACK, name)) != expected:
                raise ValueError('SHA mismatch')
        except Exception as error:
            checksum_errors.append({'file': name, 'error': str(error)})
    records = []
    for row in rows:
        paths = set(filter(None, [row['source_path'], row['runtime_path'], *row.get('extras','').split('|')]))
        issues = []
        for name in paths:
            referenced.add(name)
            try:
                safe_file(PACK, name)
                if checked.get(name, {}).get('error'):
                    raise ValueError(checked[name]['error'])
            except Exception as error:
                issues.append(str(error))
        try:
            if digest(safe_file(PACK, row['runtime_path'])) != row['sha256']:
                raise ValueError('Manifest SHA mismatch')
        except Exception as error:
            issues.append(str(error))
        selected = chosen.get(row['asset_id'])
        metrics = checked.get(row['runtime_path'], {})
        record = {**row, 'classification': 'NEW' if selected else 'REJECT',
            'destination': selected['destination'] if selected else None,
            'runtime_owner': selected['runtime_owner'] if selected else None,
            'original_status': row['status'], 'quality_status': 'PROTOTYPE' if selected else 'REJECTED',
            'technical_check': 'FAIL' if issues else 'PASS', 'issues': issues,
            'runtime_qa': 'NOT_TESTED', 'art_qa': 'NOT_TESTED', 'replaces_existing': False,
            'metrics': metrics,
            'note': 'Partial family: one bound event sample; listening/Android QA pending.' if selected else
                'Rejected for shipping this pass; retain existing assets. Prototype needs authored identity, missing functional states or contextual review. Not a claim of individual visual approval.'}
        if selected:
            event = selected.get('event')
            observed = any(audio['played'].get(event,0)>0 for audio in observations)
            loaded = bool(observations) and all(event in audio['decoded'] for audio in observations)
            record['runtime_qa'] = 'PASS_EVENT_BROWSER' if observed else 'LOADED_BROWSER' if loaded else 'NOT_TESTED'
            record['runtime_event'] = event
            record['runtime_evidence'] = 'artifacts/v10/mobile/report.json' if loaded else None
            target = ROOT/selected['destination']
            record['destination_hash_matches'] = target.is_file() and digest(target) == row['sha256']
            if not record['destination_hash_matches']:
                record['technical_check'] = 'FAIL'
                record['issues'].append('Destination hash mismatch')
        records.append(record)
    unreferenced = sorted(name for name in checked if name.endswith(('.ogg','.png')) and name not in referenced and not name.startswith('01_REFERENCE_CANON/'))
    bindings = {b['destination'] for b in ledger}
    runtime_orphans = sorted(str(p.relative_to(ROOT)) for p in (ROOT/'game/audio/v10').glob('*.ogg') if str(p.relative_to(ROOT)) not in bindings)
    duplicates = [names for names in hashes.values() if len(names)>1]
    summary = {'head_before':'84d2e45ca752e62aa491b022fb239b04c2c62ce1',
        'audited_head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),
        'generator_head':'cb26253ac4f83ba019a90912c699aa8651a439c1',
        'pack_files':len(checked), 'asset_requirements':len(rows), 'integrated_samples':len(ledger),
        'commercial_ready':0, 'classifications':dict(Counter(r['classification'] for r in records)),
        'file_errors':errors, 'checksum_errors':checksum_errors,
        'manifest_failures':[r['asset_id'] for r in records if r['technical_check']=='FAIL'],
        'unreferenced_media':unreferenced, 'runtime_orphans':runtime_orphans,
        'duplicate_file_groups':duplicates,
        'oversized_textures':[name for name,m in checked.items() if m.get('oversized')],
        'sfx_decoded_bytes':sum(r['metrics'].get('decoded_bytes',0) for r in records if r['classification']=='NEW'),
        'commercial_release':'BLOCKED',
        'limits':['Technical checks are not artistic, listening, legal, physical-device or human-playtest approval.','Rejected is a shipping decision; not all images were individually viewed.','One sample does not fulfill all events of an SFX family.']}
    (evidence/'asset-audit.json').write_text(json.dumps({'summary':summary,'records':records,'files':checked},indent=2)+'\n')
    lines = ['# V10 asset integration matrix','',
        'Baseline: `84d2e45ca752e62aa491b022fb239b04c2c62ce1`. Generator: `cb26253ac4f83ba019a90912c699aa8651a439c1`.',
        'Runtime: Canvas ES modules; Android offline WebView flattens modules and explicitly allowlists resources.',
        'Local original workspace has untracked user work; preserved using a separate worktree.',
        'NEW means copied and bound, not artistically approved. REJECT means excluded from shipping this pass.',
        'PASS in the technical column means file/hash/decode checks only. See JSON for dimensions, sizes, dependencies and errors.', '',
        '| Asset ID | Content | Source / dependencies | Destination / owner | Original → quality | Replaces existing | Decision | Resolution | Bytes | Format | Technical | Runtime / art | Note |',
        '|---|---|---|---|---|---|---|---|---|---|---|---|---|']
    for r in records:
        m = r['metrics']
        resolution = f"{m['width']}×{m['height']}" if 'width' in m else f"{m.get('sample_rate','—')} Hz / {m.get('channels','—')} ch" if 'sample_rate' in m else '—'
        lines.append(f"| {r['asset_id']} | {r['content_name']} | {r['runtime_path']} {r.get('extras','')} | {r['destination'] or '—'} / {r['runtime_owner'] or '—'} | {r['original_status']} → {r['quality_status']} | No | {r['classification']} | {resolution} | {m.get('bytes','—')} | {m.get('format','—')} | {r['technical_check']} | {r['runtime_qa']} / NOT_TESTED | {r['note']} |")
    (docs/'V10_ASSET_INTEGRATION_MATRIX.md').write_text('\n'.join(lines)+'\n')
    (docs/'V10_ASSET_VALIDATION_REPORT.md').write_text('# V10 automated asset validation\n\n'
        + 'Reproduce: `.venv-v10/bin/python tools/v10_asset_pack/audit.py`\n\n'
        + 'Full per-file metrics and findings: `artifacts/v10/asset-audit.json`.\n\n'
        + '```json\n'+json.dumps(summary,indent=2)+'\n```\n\n'
        + 'Atlas inspection covers dimensions, row bounds, pivots, duplicate frames and alpha bounds. '
        + 'Foot anchoring, facing, face/costume drift and choreography still require visual QA. '
        + 'Audio inspection measures decoded PCM, peak/RMS and boundary discontinuity; it is not loudness mastering or listening approval. '
        + 'The canonical V8.5 WebP/ZIP decode errors are retained as blockers. No reference board enters the APK.\n')
    print(json.dumps({k:v for k,v in summary.items() if k not in ['duplicate_file_groups','limits']},indent=2))
    return not (summary['manifest_failures'] or checksum_errors or runtime_orphans or errors)

if __name__ == '__main__':
    raise SystemExit(0 if audit() else 1)
