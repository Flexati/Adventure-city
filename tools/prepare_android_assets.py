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
    (DEST/'art/v10').mkdir(parents=True)
    for source in (GAME/'art/v10').glob('*.png'): shutil.copyfile(source,DEST/'art/v10'/source.name)
    for name in ART: shutil.copyfile(GAME/'art'/(name+'.png'),DEST/'art'/(name+'.png'))
    for source in (GAME/'art/v05').glob('*.png'): shutil.copyfile(source,DEST/'art/v05'/source.name)
    for name in AUDIO: shutil.copyfile(GAME/'audio/v05'/(name+'.ogg'),DEST/'audio/v05'/(name+'.ogg'))
    for source in (GAME/'art/v08').glob('*.png'): shutil.copyfile(source,DEST/'art/v08'/source.name)
    for name in AUDIO_V08: shutil.copyfile(GAME/'audio/v08'/(name+'.ogg'),DEST/'audio/v08'/(name+'.ogg'))
    for source in (GAME/'art/v09').glob('*'):
        if source.suffix in ('.svg','.png'): shutil.copyfile(source,DEST/'art/v09'/source.name)
    for name in AUDIO_V08: shutil.copyfile(GAME/'audio/v09'/(name+'.ogg'),DEST/'audio/v09'/(name+'.ogg'))
    (DEST/'audio/v10').mkdir(parents=True)
    for name in ('chalk_route','chalk_scrape','heal_seal','rook_line','rook_aim','rook_shot','rook_mine','rook_burst','rook_disarm','tessa_workbench','tessa_case','weapon_switch','weapon_reload','vx9_shot','r12_shot','quickdraw_ready','kairn_impact','morrow_saw','morrow_shot','strangers_rift','anchor_moor','anchor_exposed','anchor_relink','anchor_line_tension','anchor_sweep','anchor_line_cut','anchor_weight','anchor_fight_loop','race_checkpoint','race_container_hit','race_finish','veyra_championship','veyra_championship_night','race_count_beep','race_go','refuge_theme','promise_theme'):
        shutil.copyfile(GAME/'audio/v10'/(name+'.ogg'),DEST/'audio/v10'/(name+'.ogg'))
    (DEST/'video').mkdir(parents=True)
    for name in ('jaguarzcreatorz-720.mp4','jaguarzcreatorz-1080.mp4'):
        shutil.copyfile(GAME/'video'/name,DEST/'video'/name)
    # Branding is local and streamed in the browser and Android WebView alike.
    (DEST/'art/brand').mkdir(parents=True)
    for source in (GAME/'art/brand').glob('*.webp'):
        shutil.copyfile(source,DEST/'art/brand'/source.name)
    # Only shipping Chrono assets: references, generated masters and reserves stay out.
    (DEST/'art/chrono').mkdir(parents=True)
    (DEST/'audio/chrono').mkdir(parents=True)
    for name in ('environment','effects','purple_guard','chrono_overlord','blacksmith','civilian','innkeeper','merchant','mechanic','masked_informant','potion_alchemist','relic_priestess','scavenger_kid','traveling_bard','toxic_mutant_zombie','interiors'):
        shutil.copyfile(GAME/'art/chrono'/(name+'.png'),DEST/'art/chrono'/(name+'.png'))
    for name in ('old_town','cathedral','toxic_market','clockwork','impact','chrono_energy','boss_collapse','save','suspense_boss'):
        shutil.copyfile(GAME/'audio/chrono'/(name+'.ogg'),DEST/'audio/chrono'/(name+'.ogg'))
    def flatten_module(name):
        source=(GAME/name).read_text()
        source=re.sub(r'^import .*?;\n','',source,flags=re.M)
        # Full-line comments are documentation only; dropping them keeps app.js inside the 512 KB entry budget.
        source=re.sub(r'^[ \t]*//[^\n]*\n','',source,flags=re.M)
        return re.sub(r'\bexport ','',source)
    layouts=flatten_module('layouts.mjs')
    scenery=flatten_module('scenery.mjs')
    sound=flatten_module('audio-engine.mjs')
    progress_store=flatten_module('progress-store.mjs')
    hud=flatten_module('hud.mjs')
    input_v9=flatten_module('input-v9.mjs')
    racing=flatten_module('racing-v9.mjs')
    veyra=flatten_module('veyra-v9.mjs')
    hubs=flatten_module('hubs.mjs')
    interiors=flatten_module('interiors.mjs')
    traversal=flatten_module('traversal.mjs')
    narrative=flatten_module('narrative.mjs')
    story8=flatten_module('story-v08.mjs')
    missions=flatten_module('missions.mjs')
    weapons=flatten_module('weapons-v9.mjs')
    engine=flatten_module('campaign.mjs')
    visuals=flatten_module('visuals.mjs')
    driving=flatten_module('driving.mjs')
    chrono_manifest=flatten_module('chrono-manifest.mjs')
    sheet_layout=flatten_module('sheet-layout.mjs')
    chrono_art=flatten_module('chrono-art.mjs')
    runtime_en=flatten_module('runtime-en.mjs')
    world_en=flatten_module('world-en.mjs')
    interiors_en=flatten_module('interiors-en.mjs')
    story_en=flatten_module('story-en.mjs')
    locale=flatten_module('locale.mjs')
    ui=flatten_module('runtime.mjs')
    (DEST/'app.js').write_text('\n'.join((layouts,scenery,sound,progress_store,hud,input_v9,narrative,story8,weapons,engine,racing,veyra,hubs,interiors,traversal,missions,visuals,driving,chrono_manifest,sheet_layout,chrono_art,story_en,world_en,interiors_en,runtime_en,locale,ui)))
    shutil.copyfile(GAME/'style.css',DEST/'style.css')
    shutil.copyfile(GAME/'android_bootstrap.js',DEST/'bootstrap.js')
    html=(GAME/'index.html').read_text().replace('<script type="module" src="runtime.mjs"></script>','<script src="bootstrap.js"></script><script src="app.js"></script>')
    (DEST/'index.html').write_text(html)
    sizes={str(p.relative_to(DEST)):p.stat().st_size for p in DEST.rglob('*') if p.is_file()}
    if any(size==0 for size in sizes.values()): raise ValueError('Empty packaged resource')
    if sizes['index.html']>65536 or sizes['app.js']>524288: raise ValueError('Android entry too large')
    if 'data:image' in html or 'base64,' in (DEST/'app.js').read_text(): raise ValueError('Android binary assets must be separate')
    print('Android entry: %d bytes; script: %d bytes; %d local resources'%(sizes['index.html'],sizes['app.js'],len(sizes)))
    (DEST.parent/'asset-manifest.json').write_text(json.dumps(sizes,indent=2)+'\n')
if __name__=='__main__': prepare()

