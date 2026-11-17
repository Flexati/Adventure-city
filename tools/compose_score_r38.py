"""R38 (D74): renders the new score into game/audio/v11/ and its metrics into assets/production/r38/audio/.

  python3 tools/compose_score_r38.py                 # every piece
  python3 tools/compose_score_r38.py title danger    # some pieces
  python3 tools/compose_score_r38.py --out DIR ...   # somewhere else (listening drafts)

Deterministic: fixed seeds, no samples, no recordings, no providers; Opus written bitexact, so the same numpy/scipy and
ffmpeg/libopus give the same bytes. Gate 2 of docs/gold/PIANO_PLAY_STORE_20261114.md is checked on the decoded file:
-16 LUFS +-1 integrated, true peak <= -1.5 dBTP, no clipped sample, the loop with no jump. Human listening is pending:
an agent cannot listen, so every metrics file says human_listening false until the author approves.
"""
import json, sys, time
from pathlib import Path
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from score_r38 import master as M  # noqa: E402
from score_r38.song import Song  # noqa: E402
from score_r38.tracks import SPEC  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
GATE = dict(lufs=-16.0, tol=1.0, true_peak=-1.5, seam_db=-40.0)


def render(name, out_dir, meta_dir):
    spec = SPEC[name]
    t0 = time.time()
    s = Song(name, spec['bpm'], spec['bars'], spec['seed'], swing=spec.get('swing', 0.0))
    spec['fn'](s)
    mix = M.mixdown(s, spec.get('mix', {}))
    y = M.master(mix, spec['target'], spec.get('ceiling', -2.2), fade_ms=spec.get('fade_ms', 6.0))
    out = out_dir / f'{name}.ogg'
    for attempt in range(4):
        M.encode_opus(y, out, spec.get('kbps', 64))
        met = M.metrics(out, s.n, spec['target'])
        if met['true_peak_dbtp'] <= GATE['true_peak']:
            break
        y = y * 10 ** (-.3 / 20)
    clashes = s.harmony_report(allow=spec.get('allow', ()))
    problems = [k for k, bad in [
        ('loudness', abs(met['integrated_lufs'] - GATE['lufs']) > GATE['tol']),
        ('true peak', met['true_peak_dbtp'] > GATE['true_peak']),
        ('clipped', met['clipped_samples'] > 0),
        ('length', met['samples'] != s.n),
        ('loop seam', met['loop_seam_step_db'] > GATE['seam_db']),
        ('harmony', bool(clashes)),
    ] if bad]
    met.update({'piece': name, 'bpm': spec['bpm'], 'bars': spec['bars'], 'seed': spec['seed'], 'opus_kbps': spec.get('kbps', 64),
                'sections': s.sections, 'notes': len(s.events), 'balance_db': getattr(s, 'balance', {}), 'harmony_clashes': clashes, 'gate2_problems': problems,
                'render_seconds': round(time.time() - t0, 1), 'human_listening': False, 'commercial_ready': False})
    meta_dir.mkdir(parents=True, exist_ok=True)
    (meta_dir / f'{name}-metrics.json').write_text(json.dumps(met, indent=1) + '\n')
    (meta_dir / f'{name}-score.json').write_text(json.dumps({
        'piece': name, 'bpm': spec['bpm'], 'bars': spec['bars'], 'meter': 4, 'seed': spec['seed'], 'sections': s.sections,
        'chords': {str(k): v for k, v in sorted(s.chords.items())},
        'events': [dict(beat=b, midi=n, beats=d, instrument=i, bus=bu, velocity=v) for b, n, d, i, bu, v in s.events],
        'provenance': 'Original, deterministic synthesis in tools/score_r38 (no samples, recordings, providers or artist imitation).'},
        separators=(',', ':')) + '\n')
    return met


def main(argv):
    out_dir, meta_dir = ROOT / 'game/audio/v11', ROOT / 'assets/production/r38/audio'
    if '--out' in argv:
        i = argv.index('--out')
        out_dir = meta_dir = Path(argv[i + 1])
        argv = argv[:i] + argv[i + 2:]
    out_dir.mkdir(parents=True, exist_ok=True)
    names = argv or list(SPEC)
    failed = []
    for name in names:
        met = render(name, out_dir, meta_dir)
        print(f"{name:10s} {met['duration_seconds']:6.1f}s {met['integrated_lufs']:6.1f} LUFS {met['true_peak_dbtp']:5.1f} dBTP "
              f"phone {met['phone_band_lufs']:6.1f} LRA {met['loudness_range_lu']:4.1f} seam {met['loop_seam_step_db']:6.1f} dB "
              f"{met['bytes'] // 1024:5d} KB  {met['render_seconds']:5.1f}s  {'PASS' if not met['gate2_problems'] else 'FAIL ' + ','.join(met['gate2_problems'])}")
        if met['gate2_problems']:
            failed.append(name)
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main(sys.argv[1:])
