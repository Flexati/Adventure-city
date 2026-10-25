"""Structural checks are not artistic, legal or human certification."""
import argparse
import hashlib
import json
from pathlib import Path


def validate(data, root, release=False):
    errors = []
    contents, assets = data.get('contents', []), data.get('assets', [])
    asset_map = {a['id']: a for a in assets}
    if len(asset_map) != len(assets):
        errors.append('Duplicate asset IDs')
    if len({c['id'] for c in contents}) != len(contents):
        errors.append('Duplicate content IDs')
    used = set()
    root = Path(root).resolve()

    def check_file(value, label, sha=None):
        if not isinstance(value, str) or not value:
            errors.append(label + ': missing file path')
            return
        candidate = (root / value).resolve()
        if not candidate.is_relative_to(root):
            errors.append(label + ': path outside root')
        elif not candidate.is_file() or candidate.stat().st_size == 0:
            errors.append(label + ': file missing or empty')
        elif sha is not None and hashlib.sha256(candidate.read_bytes()).hexdigest() != sha:
            errors.append(label + ': SHA-256 mismatch')

    for c in contents:
        links = c.get('asset_ids', [])
        if not links:
            errors.append(c['id'] + ': no associated assets')
        for aid in links:
            used.add(aid)
            if aid not in asset_map:
                errors.append(c['id'] + ': unknown asset ' + aid)
        if not release:
            continue
        if c.get('required') is False and c.get('selected') is False:
            if not c.get('decision_reason'):
                errors.append(c['id'] + ': missing non-adoption reason')
            continue
        if c.get('status') != 'VERIFIED' or not isinstance(c.get('is_new'), bool):
            errors.append(c['id'] + ': content not verified/classified')
        linked = [asset_map[a] for a in links if a in asset_map]
        if c.get('is_new') and not any(a.get('mode') in ['new', 'adapted'] for a in linked):
            errors.append(c['id'] + ': new content has no specific new/adapted asset')
        for a in linked:
            label = c['id'] + '/' + a['id']
            if a.get('status') != 'VERIFIED' or a.get('mode') not in ['new', 'adapted', 'reuse']:
                errors.append(label + ': asset not verified/classified')
            if not a.get('event') or not a.get('build'):
                errors.append(label + ': missing event/build association')
            if not a.get('provenance') or a.get('rights') != 'VERIFIED':
                errors.append(label + ': provenance/rights unresolved')
            if a.get('mode') in ['reuse', 'adapted'] and not a.get('source_asset_id'):
                errors.append(label + ': missing source asset reference')
            sha = a.get('sha256')
            if not isinstance(sha, str) or len(sha) != 64 or any(x not in '0123456789abcdef' for x in sha):
                errors.append(label + ': invalid SHA-256')
                sha = ''
            check_file(a.get('runtime_path'), label, sha)
            check_file(a.get('source_path'), label + '/source')
            for check in ['technical', 'art_narrative_review', 'runtime', 'android']:
                check_file(a.get('evidence', {}).get(check), label + '/' + check)
    for aid in asset_map:
        if aid not in used:
            errors.append(aid + ': orphan asset requirement')
    briefs = data.get('audio_briefs', [])
    if [b.get('prompt') for b in briefs] != list(range(129)):
        errors.append('Audio brief index must contain exactly 00 through 128')
    for brief in briefs:
        for aid in brief.get('asset_ids', []):
            if aid not in asset_map:
                errors.append('Audio brief links an unknown asset: ' + aid)
        if release:
            if brief.get('status') != 'VERIFIED':
                errors.append('audio brief %03d: unresolved' % brief['prompt'])
            if brief['prompt'] not in [0, 128] and not brief.get('asset_ids'):
                errors.append('audio brief %03d: no produced asset/family mapped' % brief['prompt'])
            if brief['prompt'] in [0, 128]:
                check_file(brief.get('evidence_path'), 'audio direction/mix %03d' % brief['prompt'])
    return {'ok': not errors, 'mode': 'release' if release else 'plan',
            'contents': len(contents), 'asset_requirements': len(assets),
            'errors': errors,
            'limit': 'File/link checks only; does not certify authenticity, quality, rights or human review.'}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('manifest', type=Path)
    parser.add_argument('--root', type=Path, default=Path('.'))
    parser.add_argument('--mode', choices=['plan', 'release'], default='plan')
    args = parser.parse_args()
    result = validate(json.loads(args.manifest.read_text(encoding='utf-8')),
                      args.root, args.mode == 'release')
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(0 if result['ok'] else 1)
