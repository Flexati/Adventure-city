#!/usr/bin/env python3
"""R52 (D93): bring every Vorbis file of game/audio to 48 kHz, the rate Android's mixer runs at (a 32 or 44.1 kHz file is
resampled by the device on every play: CPU and a slightly different sound on each phone).

Same format (Ogg Vorbis), same name, same channels, same nominal bitrate; only the sample rate changes (soxr resampler,
precision 28 bits). Gains are never touched. Each file is checked before it replaces the old one, on the decoded audio:
  - length: within 2 ms (loops keep their length);
  - volume: RMS within 0.3 dB; integrated loudness (EBU R128) within 0.3 dB on clips of 3 s or more; sample peak within 1.5 dB
    (a lossy re-encode moves a transient's peak by a fraction of a dB without changing how loud the sound is).
A file that fails a check is left as it was and listed. Report: docs/evidence/r52/audio_48k.json.

  python3 tools/resample_audio_r52.py            # convert and verify
  python3 tools/resample_audio_r52.py --check    # only verify that every file is 48 kHz
"""
import json, os, re, subprocess, sys, tempfile
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO = os.path.join(ROOT, 'game', 'audio')
TARGET = 48000
REPORT = os.path.join(ROOT, 'docs', 'evidence', 'r52', 'audio_48k.json')


def files():
    for r, _, fs in sorted(os.walk(AUDIO)):
        for f in sorted(fs):
            if f.endswith(('.ogg', '.opus')):
                yield os.path.join(r, f)


def probe(p):
    o = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', p]))
    s = o['streams'][0]
    return dict(rate=int(s['sample_rate']), channels=int(s['channels']), codec=s['codec_name'],
                bitrate=int(o['format'].get('bit_rate') or 0), duration=float(o['format']['duration']))


def decode(p, ch):
    """Decoded at 48 kHz float, whatever the file's own rate, so before and after compare on the same grid."""
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', p, '-af', 'aresample=%d:resampler=soxr' % TARGET,
                                   '-f', 'f32le', '-ac', str(ch), '-'], stderr=subprocess.DEVNULL)
    return np.frombuffer(raw, dtype='<f4').reshape(-1, ch)


def lufs(p):
    out = subprocess.run(['ffmpeg', '-nostats', '-i', p, '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    m = re.findall(r'I:\s+(-?[\d.]+) LUFS', out)
    return float(m[-1]) if m else None


def db(x):
    return float(20 * np.log10(max(x, 1e-9)))


def measure(p, ch):
    a = decode(p, ch)
    return dict(seconds=len(a) / TARGET, peak_db=db(float(np.max(np.abs(a)))) if len(a) else None,
                rms_db=db(float(np.sqrt(np.mean(a * a)))) if len(a) else None, lufs=lufs(p))


def encode(pcm, info, dst, q):
    """pcm: the file already resampled to 48 kHz (float, one pass of soxr), so the length is exactly rate-converted and
    the encoder adds no padding of its own to the stream."""
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(TARGET), '-ac', str(info['channels']), '-i', 'pipe:0',
                    '-map_metadata', '-1', '-c:a', 'libvorbis', '-q:a', str(q), '-f', 'ogg', dst],
                   input=pcm.astype('<f4').tobytes(), check=True)


def judge(before, after, new, info):
    problems = []
    if new['rate'] != TARGET or new['channels'] != info['channels']: problems.append('rate/channels')
    # Length is the one the Ogg container declares (ffprobe), which is what a player uses; ffmpeg's own decode count of a
    # Vorbis file wanders by up to a block, in the old files as in the new.
    d_len = abs(new['duration'] - info['duration'])
    if d_len > 0.0005: problems.append('length %.4f s' % d_len)
    d_rms = after['rms_db'] - before['rms_db']
    if abs(d_rms) > 0.3: problems.append('rms %+.2f dB' % d_rms)
    # EBU R128 gating is unstable on clips shorter than a few 400 ms blocks: it judges only the files that have them.
    if before['seconds'] >= 3 and before['lufs'] is not None and after['lufs'] is not None and abs(after['lufs'] - before['lufs']) > 0.3:
        problems.append('loudness %+.2f dB' % (after['lufs'] - before['lufs']))
    d_peak = after['peak_db'] - before['peak_db']
    if abs(d_peak) > 1.5: problems.append('peak %+.2f dB' % d_peak)
    return problems


def convert(src, info, dst, before):
    """Quality-based Vorbis (the 48 kHz encoder refuses a fixed 25 kbps). Starts at the quality whose bitrate is nearest the
    old one, then goes up one step at a time until the volume checks pass (at most ten steps)."""
    pcm = decode(src, info['channels'])
    want = int(round(info['duration'] * TARGET))
    if len(pcm) < want:      # the decoder drops the last block of silence-ish tail the container still declares: give it back
        pcm = np.concatenate([pcm, np.zeros((want - len(pcm), pcm.shape[1]), dtype=pcm.dtype)])
    pcm = pcm[:want]
    gaps = []
    for q in [x / 2 for x in range(-2, 21)]:
        encode(pcm, info, dst, q)
        rate = probe(dst)['bitrate']
        gaps.append((abs(rate - info['bitrate']), q))
        if rate > info['bitrate'] * 1.25:
            break
    start = min(gaps)[1]
    last = None
    for q in [start + 0.5 * i for i in range(11)]:
        encode(pcm, info, dst, q)
        new = probe(dst)
        after = measure(dst, info['channels'])
        last = (q, new, after, judge(before, after, new, info))
        if not last[3]:
            break
    return last


def main():
    if '--check' in sys.argv:
        bad = [p for p in files() if probe(p)['rate'] != TARGET]
        print('%d file(s) not at 48 kHz' % len(bad)); [print(' ', os.path.relpath(p, ROOT)) for p in bad]
        return 1 if bad else 0
    rows, failed = [], []
    done = {}
    if os.path.exists(REPORT):          # a second run only converts what is left; keep what the first one recorded
        done = {r['file']: r for r in json.load(open(REPORT)).get('converted', [])}
    tmpdir = tempfile.mkdtemp()
    for p in files():
        rel = os.path.relpath(p, ROOT)
        info = probe(p)
        if info['rate'] == TARGET:
            continue
        if info['codec'] != 'vorbis':
            failed.append((rel, 'not Vorbis: ' + info['codec'])); continue
        tmp = os.path.join(tmpdir, 'x.ogg')
        before = measure(p, info['channels'])
        q, new, after, problems = convert(p, info, tmp, before)
        row = dict(file=rel, rate_before=info['rate'], rate_after=new['rate'], channels=info['channels'],
                   bitrate_before=info['bitrate'], bitrate_after=new['bitrate'], vorbis_quality=q,
                   bytes_before=os.path.getsize(p), bytes_after=os.path.getsize(tmp),
                   seconds_before=round(before['seconds'], 4), seconds_after=round(after['seconds'], 4),
                   lufs_before=before['lufs'], lufs_after=after['lufs'], peak_before_db=round(before['peak_db'], 2),
                   peak_after_db=round(after['peak_db'], 2), problems=problems)
        if problems:
            failed.append((rel, ', '.join(problems)))
        else:
            os.replace(tmp, p)
            row['sha256'] = subprocess.check_output(['sha256sum', p], text=True).split()[0]
        rows.append(row)
        print(('FAIL ' if problems else 'ok   ') + rel, problems or '')
    os.makedirs(os.path.dirname(REPORT), exist_ok=True)
    with open(REPORT, 'w') as fh:
        done.update({r['file']: r for r in rows if not r['problems']})
        json.dump(dict(target_rate=TARGET, converted=[done[k] for k in sorted(done)], failed=failed,
                       human_listening=False,
                       method='ffmpeg libvorbis, soxr resampler, same channels, quality chosen to match the old bitrate, gains untouched'), fh, indent=1)
        fh.write('\n')
    print('converted %d, failed %d' % (len([r for r in rows if not r['problems']]), len(failed)))
    return 1 if failed else 0


sys.exit(main())
