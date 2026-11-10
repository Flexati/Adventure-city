"""Prepare streamed APK resources, never a binary-filled entry document."""
from pathlib import Path
import json,re,shutil,struct,zlib
ROOT=Path(__file__).resolve().parents[1]
GAME=ROOT/'game'
DEST=ROOT/'android/build/assets/game'
ART=('city','port','clinic','fracture','car')
AUDIO=('blackout','breach','contagion','zero','driving','hit','zara','dodge','duo','choice')
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

# Q3 weight plan: the APK copy of CHRONO_MANIFEST keeps only the fields game code reads (chrono-art.mjs,
# runtime.mjs); documentation fields (boxes, policies, quality notes) stay in game/chrono-manifest.mjs.
# tests/bundle-weight.test.mjs proves every animation and atlas path resolves to the same values.
CHRONO_ANIMATION_KEYS=('character_id','animation_id','frame_count','fps','loop','sprite_height','pivot_x','pivot_y','frame_rectangles','draw_height')
def runtime_chrono_manifest():
    source=(GAME/'chrono-manifest.mjs').read_text()
    head='export const CHRONO_MANIFEST='
    body=source[source.index(head)+len(head):].strip()
    if not body.endswith(';'): raise ValueError('chrono-manifest.mjs: expected one exported object literal')
    manifest=json.loads(body[:-1])
    def rects(a,atlas):
        r=[[f[k] for k in ('x','y','width','height')] for f in a['frame_rectangles']]
        w,h=r[0][2],r[0][3];cols=(atlas.get('width') or 0)//w if w else 0
        if cols and len(r)==a['frame_count'] and all(q[2]==w and q[3]==h for q in r) and r[0][0]%w==0 and r[0][1]%h==0:
            k0=r[0][1]//h*cols+r[0][0]//w
            # Frames on a regular grid travel as [width,height,columns,first cell]: the same rectangles, a fraction of the bytes.
            if all(q==[(k0+i)%cols*w,(k0+i)//cols*h,w,h] for i,q in enumerate(r)): return [w,h,cols,k0]
        return r
    def row(a):
        if any(a.get(k) is None for k in CHRONO_ANIMATION_KEYS if k in a): raise ValueError('null animation field: '+a['character_id'])
        v=[(rects(a,manifest['atlases'].get(a.get('atlas_reference',a['character_id']),{})) if k=='frame_rectangles' else a[k]) if k in a else None for k in CHRONO_ANIMATION_KEYS]
        while v and v[-1] is None: v.pop()
        return v
    lean={'atlases':{k:v['path'] for k,v in manifest['atlases'].items()},'animations':[row(a) for a in manifest['animations']]}
    # Each animation travels as its values in CHRONO_ANIMATION_KEYS order (null = absent) and is rebuilt once at load, on the same
    # line, so game code and tests see the same objects as in game/chrono-manifest.mjs.
    keys=json.dumps(list(CHRONO_ANIMATION_KEYS),separators=(',',':'))
    return ('const CHRONO_MANIFEST=(m=>{for(const k in m.atlases)m.atlases[k]={path:m.atlases[k]};m.animations=m.animations.map(v=>{const a={};'+keys+'.forEach((k,i)=>{if(v[i]!=null)a[k]=v[i];});const f=a.frame_rectangles;'
     'a.frame_rectangles=typeof f[0]=="number"?Array.from({length:a.frame_count},(_,i)=>({x:(f[3]+i)%f[2]*f[0],y:((f[3]+i)/f[2]|0)*f[1],width:f[0],height:f[1]})):f.map(([x,y,width,height])=>({x,y,width,height}));return a;});return m;})('
     +json.dumps(lean,separators=(',',':'),ensure_ascii=False)+');')

def prepare():
    import fcntl
    (ROOT/'android/build').mkdir(parents=True,exist_ok=True)
    lock_file=open(ROOT/'android/build/.prepare_android.lock','w')
    fcntl.flock(lock_file,fcntl.LOCK_EX)
    for path in (GAME/'art').rglob('*.png'): validate_png(path)
    if DEST.exists(): shutil.rmtree(DEST)
    (DEST/'art').mkdir(parents=True,exist_ok=True)
    (DEST/'audio/v05').mkdir(parents=True)
    (DEST/'art/v05').mkdir(parents=True)
    (DEST/'art/v08').mkdir(parents=True)
    (DEST/'audio/v08').mkdir(parents=True)
    (DEST/'audio/v09').mkdir(parents=True)
    (DEST/'art/v09').mkdir(parents=True)
    (DEST/'art/v10').mkdir(parents=True)
    (DEST/'art/npc').mkdir(parents=True)
    for source in (GAME/'art/npc').glob('*.jpg'): shutil.copyfile(source,DEST/'art/npc'/source.name)
    (DEST/'art/interiors').mkdir(parents=True)
    for source in (GAME/'art/interiors').glob('*.webp'): shutil.copyfile(source,DEST/'art/interiors'/source.name)
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
    for name in ('chalk_route','chalk_scrape','heal_seal','rook_line','rook_aim','rook_shot','rook_mine','rook_burst','rook_disarm','tessa_workbench','tessa_case','weapon_switch','weapon_reload','vx9_shot','r12_shot','quickdraw_ready','kairn_impact','morrow_saw','morrow_shot','strangers_rift','anchor_moor','anchor_exposed','anchor_relink','anchor_line_tension','anchor_sweep','anchor_line_cut','anchor_weight','anchor_fight_loop','race_checkpoint','race_container_hit','race_finish','veyra_championship','veyra_championship_night','race_count_beep','race_go','refuge_theme','promise_theme','title_theme'):
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
    for name in ('environment','effects','purple_guard','chrono_overlord','blacksmith','civilian','innkeeper','merchant','mechanic','masked_informant','potion_alchemist','relic_priestess','scavenger_kid','traveling_bard','toxic_mutant_zombie','interiors',
                 # D45: enemy sheets of the breach, contagion and node families.
                 'mech_hound','striker_unit','chrono_drone','ghoul_runner','toxic_brawler','toxic_bomber','plague_cultist_caster','skeleton_swordsman','iron_penitent','flame_alchemist','skeleton_shield_bearer',
                 # D46: the rest of the reserve, spread over the Act III regions, and the Cathedral gate guard.
                 'valkyrie_striker','chrono_huntress','demon_hunter_survivor','desert_chrono_fighter','crawling_corpse','gate_guard'):
        shutil.copyfile(GAME/'art/chrono'/(name+'.png'),DEST/'art/chrono'/(name+'.png'))
    for name in ('old_town','cathedral','toxic_market','clockwork','impact','chrono_energy','boss_collapse','save','suspense_boss',
                 # D47: the rest of the original chrono cues, placed at their moments in game/runtime.mjs.
                 'refuge','necropolis','cathedral_bell','mechanism','toxic_reactor','crowd_shop','chainsaw','shotgun','purchase','upgrade','relic','bone_break','gear_break','toxic_splash','portal','suspense_entry','suspense_appearance','suspense_activation','suspense_final'):
        shutil.copyfile(GAME/'audio/chrono'/(name+'.ogg'),DEST/'audio/chrono'/(name+'.ogg'))
    def flatten_module(name):
        source=(GAME/name).read_text()
        source=re.sub(r'^import .*?;\n','',source,flags=re.M)
        # Full-line comments are documentation only; dropping them keeps app.js inside the 512 KB entry budget.
        source=re.sub(r'^[ \t]*//[^\n]*\n','',source,flags=re.M)
        # Indentation and blank lines carry no meaning outside a multi-line template literal; the guard refuses to touch such a module.
        inside=False
        for line in source.split('\n'):
            if inside and line.strip(): raise ValueError(name+': multi-line template literal, whitespace cannot be stripped safely')
            if len(re.findall(r'(?<!\\)`',line))%2: inside=not inside
        source=re.sub(r'\n{2,}','\n',re.sub(r'^[ \t]+','',source,flags=re.M))
        return re.sub(r'\bexport ','',source)
    villages=flatten_module('villages.mjs')
    village_art=flatten_module('village-art.mjs')
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
    chrono_manifest=runtime_chrono_manifest()
    sheet_layout=flatten_module('sheet-layout.mjs')
    chrono_art=flatten_module('chrono-art.mjs')
    runtime_en=flatten_module('runtime-en.mjs')
    world_en=flatten_module('world-en.mjs')
    interiors_en=flatten_module('interiors-en.mjs')
    story_en=flatten_module('story-en.mjs')
    locale=flatten_module('locale.mjs')
    stability=flatten_module('stability.mjs')
    ui=flatten_module('runtime.mjs')
    (DEST/'app.js').write_text('\n'.join((villages,village_art,layouts,scenery,sound,progress_store,hud,input_v9,narrative,story8,weapons,engine,racing,veyra,hubs,interiors,traversal,missions,visuals,driving,chrono_manifest,sheet_layout,chrono_art,story_en,world_en,interiors_en,runtime_en,locale,stability,ui)))
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

