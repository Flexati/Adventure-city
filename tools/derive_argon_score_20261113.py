#!/usr/bin/env python3
"""R21: derivati a livello controllato delle 14 musiche composte da Argon (commit 9563818, tools/compose_full_game_score_v10_4.py).

Gli originali sono i file del commit 9563818 (letti con `git show`, mai modificati la' dove stanno nella storia).
Ogni brano viene portato allo stesso livello medio delle musiche gia' nel gioco (RMS 0,16) con picco sotto -1 dBFS:
gli originali avevano RMS 0,24-0,29 e picco oltre 1,0 [MISURATO], cioe' suonavano molto piu' forte del resto.
Uso: python3 tools/derive_argon_score_20261113.py
"""
import subprocess,hashlib,json,tempfile,os
from pathlib import Path
import numpy as np
ROOT=Path(__file__).resolve().parents[1];SRC='9563818'
NAMES=['docks_veyra','below_descent','toxic_bazaar','port_stealth','glass_flood','archive_theme','clockwork_outpost','axis_ascent','bone_tyrant','warden_node','forge_behemoth','glass_reaper','vega_duel','archon_finale']
def pcm(path): return np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','f32le','-ac','1','-ar','48000','-'],capture_output=True,check=True).stdout,dtype=np.float32)
def main():
    out=[]
    for n in NAMES:
        rel='game/audio/v10/%s.ogg'%n;raw=subprocess.run(['git','show',SRC+':'+rel],capture_output=True,check=True,cwd=ROOT).stdout
        with tempfile.NamedTemporaryFile(suffix='.ogg',delete=False) as t: t.write(raw);tmp=t.name
        x=pcm(tmp);rms=float(np.sqrt((x**2).mean()));peak=float(np.abs(x).max());gain=min(.16/rms,.89/peak)
        dest=ROOT/rel;subprocess.run(['ffmpeg','-v','error','-y','-i',tmp,'-af','volume=%.5f'%gain,'-c:a','libvorbis','-q:a','4',str(dest)],check=True);os.unlink(tmp)
        y=pcm(dest)
        out.append({'id':n,'originale':SRC+':'+rel,'sha256_originale':hashlib.sha256(raw).hexdigest(),'derivato':rel,'sha256_derivato':hashlib.sha256(dest.read_bytes()).hexdigest(),'byte':dest.stat().st_size,'secondi':round(len(y)/48000,1),
          'guadagno':round(gain,3),'rms_prima':round(rms,3),'picco_prima':round(peak,3),'rms_dopo':round(float(np.sqrt((y**2).mean())),3),'picco_dopo':round(float(np.abs(y).max()),3),'ascoltato':False})
    (ROOT/'assets/production/v10.3/derived/REGISTRO_ARGON_SCORE_20261113.json').write_text(json.dumps({'origine':'composizione da script di Argon (tools/compose_full_game_score_v10_4.py), non registrazione','strumento':'tools/derive_argon_score_20261113.py','nota':'Nessuno ha ascoltato questi brani: i numeri dicono il livello, non se sono belli. Durano 14-22 secondi in loop.','derivati':out},indent=1,ensure_ascii=False)+'\n')
    for o in out: print('%-18s %5.1fs rms %.3f -> %.3f  picco %.2f -> %.2f'%(o['id'],o['secondi'],o['rms_prima'],o['rms_dopo'],o['picco_prima'],o['picco_dopo']))
if __name__=='__main__': main()
