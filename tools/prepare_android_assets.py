"""Prepare streamed APK resources, never a binary-filled entry document."""
from pathlib import Path
import json,re,shutil
ROOT=Path(__file__).resolve().parents[1]
GAME=ROOT/'game'
DEST=ROOT/'android/build/assets/game'
ART=('city','port','clinic','fracture','car')
AUDIO=('title','blackout','breach','contagion','zero','driving','hit','zara','dodge','duo','choice')
def prepare():
    if DEST.exists(): shutil.rmtree(DEST)
    (DEST/'art').mkdir(parents=True)
    (DEST/'audio/v05').mkdir(parents=True)
    (DEST/'art/v05').mkdir(parents=True)
    for name in ART: shutil.copyfile(GAME/'art'/(name+'.png'),DEST/'art'/(name+'.png'))
    for source in (GAME/'art/v05').glob('*.png'): shutil.copyfile(source,DEST/'art/v05'/source.name)
    for name in AUDIO: shutil.copyfile(GAME/'audio/v05'/(name+'.ogg'),DEST/'audio/v05'/(name+'.ogg'))
    engine=re.sub(r'\bexport ','',(GAME/'campaign.mjs').read_text())
    driving=re.sub(r'\bexport ','',(GAME/'driving.mjs').read_text())
    visuals=re.sub(r'\bexport ','',(GAME/'visuals.mjs').read_text())
    ui=re.sub(r'^import .*?;\n','',(GAME/'runtime.mjs').read_text(),flags=re.M)
    (DEST/'app.js').write_text(engine+'\n'+visuals+'\n'+driving+'\n'+ui)
    shutil.copyfile(GAME/'style.css',DEST/'style.css')
    shutil.copyfile(GAME/'android_bootstrap.js',DEST/'bootstrap.js')
    html=(GAME/'index.html').read_text().replace('<script type="module" src="runtime.mjs"></script>','<script src="bootstrap.js"></script><script src="app.js"></script>')
    (DEST/'index.html').write_text(html)
    sizes={str(p.relative_to(DEST)):p.stat().st_size for p in DEST.rglob('*') if p.is_file()}
    if any(size==0 for size in sizes.values()): raise ValueError('Empty packaged resource')
    if sizes['index.html']>65536 or sizes['app.js']>262144: raise ValueError('Android entry too large')
    if 'data:image' in html or 'base64,' in (DEST/'app.js').read_text(): raise ValueError('Android binary assets must be separate')
    print('Android entry: %d bytes; script: %d bytes; %d local resources'%(sizes['index.html'],sizes['app.js'],len(sizes)))
    (DEST.parent/'asset-manifest.json').write_text(json.dumps(sizes,indent=2)+'\n')
if __name__=='__main__': prepare()

