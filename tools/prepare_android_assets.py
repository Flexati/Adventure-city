"""Prepare streamed APK resources, never a binary-filled entry document."""
from pathlib import Path
import json,re,shutil,struct,zlib
ROOT=Path(__file__).resolve().parents[1]
GAME=ROOT/'game'
DEST=ROOT/'android/build/assets/game'
ART=('city','port','clinic','fracture','car')
AUDIO=('title','blackout','breach','contagion','zero','driving','hit','zara','dodge','duo','choice')
AUDIO_V08=('nox','lulu','danger','reunion')
def validate_png(path):
    # A truncated PNG can fire browser onload while painting a black map.
    data=path.read_bytes()
    if data[:8]!=b'\x89PNG\r\n\x1a\n': raise ValueError('Invalid PNG: '+str(path))
    offset=8; compressed=[]; ended=False
    while offset<len(data):
        if offset+12>len(data): raise ValueError('Truncated PNG: '+str(path))
        length=struct.unpack('>I',data[offset:offset+4])[0]; end=offset+12+length
        if end>len(data): raise ValueError('Truncated PNG chunk: '+str(path))
        kind=data[offset+4:offset+8]; payload=data[offset+8:offset+8+length]
        crc=struct.unpack('>I',data[end-4:end])[0]
        if zlib.crc32(kind+payload)&0xffffffff!=crc: raise ValueError('Corrupt PNG CRC: '+str(path))
        if kind==b'IDAT': compressed.append(payload)
        if kind==b'IEND': ended=True;break
        offset=end
    if not ended or not compressed: raise ValueError('Incomplete PNG: '+str(path))
    decoder=zlib.decompressobj();decoder.decompress(b''.join(compressed))
    if not decoder.eof: raise ValueError('Truncated PNG pixels: '+str(path))

def prepare():
    for path in (GAME/'art').rglob('*.png'): validate_png(path)
    if DEST.exists(): shutil.rmtree(DEST)
    (DEST/'art').mkdir(parents=True)
    (DEST/'audio/v05').mkdir(parents=True)
    (DEST/'art/v05').mkdir(parents=True)
    (DEST/'art/v08').mkdir(parents=True)
    (DEST/'audio/v08').mkdir(parents=True)
    (DEST/'audio/v09').mkdir(parents=True)
    (DEST/'art/v09').mkdir(parents=True)
    for name in ART: shutil.copyfile(GAME/'art'/(name+'.png'),DEST/'art'/(name+'.png'))
    for source in (GAME/'art/v05').glob('*.png'): shutil.copyfile(source,DEST/'art/v05'/source.name)
    for name in AUDIO: shutil.copyfile(GAME/'audio/v05'/(name+'.ogg'),DEST/'audio/v05'/(name+'.ogg'))
    for source in (GAME/'art/v08').glob('*.png'): shutil.copyfile(source,DEST/'art/v08'/source.name)
    for name in AUDIO_V08: shutil.copyfile(GAME/'audio/v08'/(name+'.ogg'),DEST/'audio/v08'/(name+'.ogg'))
    for source in (GAME/'art/v09').glob('*'):
        if source.suffix in ('.svg','.png'): shutil.copyfile(source,DEST/'art/v09'/source.name)
    for name in AUDIO_V08: shutil.copyfile(GAME/'audio/v09'/(name+'.ogg'),DEST/'audio/v09'/(name+'.ogg'))
    # Only shipping Chrono assets: references, generated masters and reserves stay out.
    (DEST/'art/chrono').mkdir(parents=True)
    (DEST/'audio/chrono').mkdir(parents=True)
    for name in ('environment','effects','purple_guard','chrono_overlord'):
        shutil.copyfile(GAME/'art/chrono'/(name+'.png'),DEST/'art/chrono'/(name+'.png'))
    for name in ('old_town','cathedral','toxic_market','clockwork','impact','chrono_energy','boss_collapse','save','suspense_boss'):
        shutil.copyfile(GAME/'audio/chrono'/(name+'.ogg'),DEST/'audio/chrono'/(name+'.ogg'))
    def flatten_module(name):
        source=(GAME/name).read_text()
        source=re.sub(r'^import .*?;\n','',source,flags=re.M)
        return re.sub(r'\bexport ','',source)
    layouts=flatten_module('layouts.mjs')
    scenery=flatten_module('scenery.mjs')
    sound=flatten_module('audio-engine.mjs')
    narrative=flatten_module('narrative.mjs')
    story8=flatten_module('story-v08.mjs')
    missions=flatten_module('missions.mjs')
    engine=flatten_module('campaign.mjs')
    visuals=flatten_module('visuals.mjs')
    driving=flatten_module('driving.mjs')
    chrono_manifest=flatten_module('chrono-manifest.mjs')
    chrono_art=flatten_module('chrono-art.mjs')
    ui=flatten_module('runtime.mjs')
    (DEST/'app.js').write_text('\n'.join((layouts,scenery,sound,narrative,story8,engine,missions,visuals,driving,chrono_manifest,chrono_art,ui)))
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

