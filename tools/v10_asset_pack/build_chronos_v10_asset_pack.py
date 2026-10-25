#!/usr/bin/env python3
import argparse, csv, hashlib, json, math, os, shutil
from pathlib import Path

import numpy as np
import soundfile as sf
from PIL import Image, ImageDraw, ImageFilter

SR = 44100

def seed_int(s):
    return int(hashlib.sha256(str(s).encode("utf-8")).hexdigest()[:8], 16)

def palette(key, typ="generic"):
    if key == "character.nox":
        return (30,42,60), (70,180,255), (235,235,225), (8,10,14)
    if key == "character.lulu":
        return (55,46,34), (230,55,145), (225,180,120), (10,8,14)
    if key == "character.veyra":
        return (58,43,34), (235,120,45), (185,110,65), (12,9,8)
    h=seed_int(key)
    acc=tuple(70+((h>>shift)&255)%150 for shift in (16,8,0))
    base=(25,25,30) if typ=="boss" else (35,35,42) if typ=="enemy" else (25,35,45) if typ=="region" else (15,18,24) if typ=="ui" else (30,34,42)
    hi=tuple(min(255,int(x*1.25)) for x in acc)
    return base,acc,hi,(8,10,14)

def dirs(root):
    for p in [
        "00_README","01_REFERENCE_CANON","02_CHARACTERS_SPRITES","03_BOSSES_ENEMIES",
        "04_WEAPONS_ABILITIES","05_UI_HUD","06_REGIONS_RACES_PROPS","07_VFX",
        "08_AUDIO_SFX/master_wav","08_AUDIO_SFX/runtime_ogg",
        "09_MUSIC/master_wav","09_MUSIC/runtime_ogg","10_MANIFESTS",
        "11_EXTERNAL_GENERATIONS","12_INTEGRATION"
    ]:
        (root/p).mkdir(parents=True,exist_ok=True)

def bg(size,key,typ="generic"):
    w,h=size; base,acc,hi,dark=palette(key,typ)
    a=np.zeros((h,w,3),dtype=np.uint8)
    for y in range(h):
        t=y/max(1,h-1)
        a[y,:,0]=int(base[0]*(1-t)+dark[0]*t)
        a[y,:,1]=int(base[1]*(1-t)+dark[1]*t)
        a[y,:,2]=int(base[2]*(1-t)+dark[2]*t)
    im=Image.fromarray(a,"RGB").convert("RGBA")
    d=ImageDraw.Draw(im,"RGBA"); rng=np.random.default_rng(seed_int(key))
    for _ in range(22):
        x=int(rng.integers(0,w)); bw=int(rng.integers(max(6,w//80),max(10,w//24))); bh=int(rng.integers(h//8,h//2))
        d.rectangle((x,h-bh,min(w,x+bw),h),fill=(8,10,16,190))
        for yy in range(h-bh+8,h-5,12):
            if rng.random()<.6:
                d.rectangle((x+3,yy,min(w,x+bw-3),yy+2),fill=acc+(70,))
    return im

def humanoid(d,cx,cy,scale,acc,frame=0,mode="idle",bulky=0):
    bob=math.sin(frame/8*math.tau)*3 if mode in ("idle","walk","run") else 0
    lean=7 if mode=="run" else -4 if mode=="attack" else 0
    x=cx+lean*scale; y=cy+bob*scale
    hr=9*scale; bw=(18+8*bulky)*scale; bh=32*scale; leg=28*scale; arm=24*scale
    d.ellipse((x-hr,y-hr,x+hr,y+hr),fill=(198,150,120,255))
    d.rounded_rectangle((x-bw/2,y+hr-2*scale,x+bw/2,y+hr+bh),radius=max(2,int(5*scale)),fill=(28,31,38,255),outline=acc,width=max(1,int(2*scale)))
    stride=math.sin(frame/8*math.tau)*(10 if mode=="walk" else 17 if mode=="run" else 2)*scale
    hip=y+hr+bh
    for s in (-1,1):
        d.line((x-5*scale*s,hip,x+stride*s,hip+leg),fill=(24,26,32,255),width=max(2,int(6*scale)))
    sh=y+hr+8*scale
    if mode=="attack":
        d.line((x,sh,x+28*scale,sh-8*scale),fill=(24,26,32,255),width=max(2,int(6*scale)))
        d.line((x,sh,x-14*scale,sh+18*scale),fill=(24,26,32,255),width=max(2,int(6*scale)))
    else:
        d.line((x,sh,x-stride*.6,sh+arm),fill=(24,26,32,255),width=max(2,int(6*scale)))
        d.line((x,sh,x+stride*.6,sh+arm),fill=(24,26,32,255),width=max(2,int(6*scale)))
    d.polygon([(x-bw/2+2*scale,y+hr+7*scale),(x,y+hr+18*scale),(x+bw/2-2*scale,y+hr+7*scale),(x,y+hr+12*scale)],fill=acc+(230,))

def sprite(key,typ,path):
    fw=128; cols=8; rows=5
    im=Image.new("RGBA",(fw*cols,fw*rows),(0,0,0,0)); d=ImageDraw.Draw(im,"RGBA")
    _,acc,hi,_=palette(key,typ); modes=["idle","walk","run","attack","hurt"]
    for r,mode in enumerate(modes):
        for c in range(cols):
            ox=c*fw; oy=r*fw
            humanoid(d,ox+64,oy+28,1.0,acc,c,"idle" if mode=="hurt" else mode,.9 if typ=="boss" else .35 if typ=="enemy" else 0)
            if mode=="hurt":
                rr=8+c%3*2; d.ellipse((ox+75-rr,oy+45-rr,ox+75+rr,oy+45+rr),outline=hi+(180,),width=3)
    im.save(path,optimize=True)
    atlas={"frameWidth":fw,"frameHeight":fw,"columns":cols,"rows":rows,"pivot":[64,110],"status":"PROTOTYPE",
           "animations":{m:{"row":i,"frames":cols,"loop":m in ("idle","walk","run")} for i,m in enumerate(modes)}}
    path.with_suffix(".json").write_text(json.dumps(atlas,indent=2))

def portrait(key,typ,path):
    im=bg((512,512),key,typ); d=ImageDraw.Draw(im,"RGBA"); _,acc,hi,_=palette(key,typ)
    humanoid(d,256,95,2.3,acc,0,"idle",.7 if typ=="boss" else .2 if typ=="enemy" else 0)
    d.rounded_rectangle((20,20,492,492),18,outline=hi+(220,),width=3)
    im.save(path,optimize=True)

def vfx(key,path):
    fw=128; n=8; im=Image.new("RGBA",(fw*n,fw),(0,0,0,0)); _,acc,hi,_=palette(key)
    rng=np.random.default_rng(seed_int(key)+11)
    for i in range(n):
        layer=Image.new("RGBA",(fw,fw),(0,0,0,0)); d=ImageDraw.Draw(layer,"RGBA")
        t=(i+1)/n; radius=int(12+48*t); cx=cy=64
        for k in range(6,0,-1):
            rr=radius+5*k; d.ellipse((cx-rr,cy-rr,cx+rr,cy+rr),outline=acc+(20+28*k,),width=max(1,k))
        for _ in range(10):
            a=rng.random()*math.tau; r=radius*rng.uniform(.6,1.15)
            d.line((cx,cy,cx+math.cos(a)*r,cy+math.sin(a)*r),fill=hi+(100,),width=2)
        im.alpha_composite(layer.filter(ImageFilter.GaussianBlur(1.4)),(i*fw,0))
    im.save(path,optimize=True)

def icons(key,path):
    s=96; im=Image.new("RGBA",(s*4,s),(0,0,0,0)); d=ImageDraw.Draw(im,"RGBA"); _,acc,hi,_=palette(key,"ui")
    for i,a in enumerate((70,140,230,80)):
        x=i*s; d.rounded_rectangle((x+8,8,x+88,88),18,fill=(12,15,22,220),outline=acc+(a,),width=3)
        cx=x+48; cy=48; h=seed_int(key); pts=[]
        for k in range(6):
            ang=k*math.tau/6+(h%17)/17; rr=20 if k%2==0 else 11
            pts.append((cx+math.cos(ang)*rr,cy+math.sin(ang)*rr))
        d.polygon(pts,outline=hi+(230,),fill=acc+(40+i*20,))
    im.save(path,optimize=True)

def weapon(key,path):
    im=Image.new("RGBA",(768,160),(0,0,0,0)); d=ImageDraw.Draw(im,"RGBA"); _,acc,hi,_=palette(key)
    for f in range(6):
        ox=f*128; y=80+int(math.sin(f/6*math.tau)*4)
        d.rounded_rectangle((ox+18,y-18,ox+92,y+8),6,fill=(35,38,46,255),outline=acc+(255,),width=2)
        d.rectangle((ox+85,y-12,ox+118,y-5),fill=(24,26,32,255))
        d.polygon([(ox+40,y+8),(ox+56,y+8),(ox+50,y+36),(ox+34,y+36)],fill=(26,28,35,255),outline=hi+(180,))
    im.save(path,optimize=True)

def environment(key,path,race=False):
    w,h=1024,576; im=bg((w,h),key,"region"); d=ImageDraw.Draw(im,"RGBA"); _,acc,hi,_=palette(key,"region")
    if race:
        d.polygon([(60,h),(420,310),(600,310),(960,h)],fill=(15,16,22,230))
        for i in range(9):
            yy=330+i*27; d.line((420-i*38,yy,600+i*38,yy),fill=hi+(120,),width=3)
    else:
        d.ellipse((190,280,840,620),fill=(12,14,20,210),outline=acc+(150,),width=4)
    im.save(path,optimize=True)

def props(key,path):
    s=192; im=Image.new("RGBA",(s*4,s),(0,0,0,0)); d=ImageDraw.Draw(im,"RGBA"); _,acc,hi,_=palette(key)
    for i in range(4):
        ox=i*s
        d.rounded_rectangle((ox+52,38,ox+140,154),15,fill=(35,37,44,255),outline=acc+(120+i*30,),width=3)
        d.rectangle((ox+69,60,ox+123,112),fill=(10,14,18,255))
        if i==2:d.ellipse((ox+54,54,ox+138,138),outline=hi+(180,),width=3)
    im.save(path,optimize=True)

def norm(x,peak=.82):
    m=float(np.max(np.abs(x)))+1e-9
    return (x*(peak/m)).astype(np.float32)

def sfx(key,family,seconds=.65):
    rng=np.random.default_rng(seed_int(key)); n=int(SR*seconds); t=np.arange(n)/SR
    f0=120+(seed_int(key)%900)
    if "telegraph" in family:
        freq=f0*(1+1.2*t/seconds); x=np.sin(2*np.pi*freq*t)*np.exp(-2.3*t/seconds)
    elif "weapon" in family or "shot" in family:
        e=np.exp(-8*t/seconds); x=.7*rng.standard_normal(n)*e+.3*np.sin(2*np.pi*(70+f0*.2)*t)*e
    elif "ui" in family:
        x=np.sin(2*np.pi*f0*t)*np.exp(-10*t/seconds)+.35*np.sin(2*np.pi*f0*1.5*t)*np.exp(-13*t/seconds)
    else:
        x=.55*np.sin(2*np.pi*f0*t)*np.exp(-5*t/seconds)+.12*rng.standard_normal(n)*np.exp(-8*t/seconds)
    fade=min(len(x)//2,int(SR*.015))
    if fade:
        r=np.linspace(0,1,fade); x[:fade]*=r; x[-fade:]*=r[::-1]
    return norm(x)

def music(key,family,dur=12):
    rng=np.random.default_rng(seed_int(key)); n=int(SR*dur); t=np.arange(n)/SR; h=seed_int(key)
    bpm=76+(h%65); beat=60/bpm; root=43+(h%10); scale=[0,2,3,5,7,8,10]
    x=np.zeros(n,dtype=np.float32)
    for ci,st in enumerate((scale[0],scale[2],scale[4])):
        f=440*2**(((root+st)-69)/12); x += (.13/(ci+1))*np.sin(2*np.pi*f*t)
    for k in range(int(dur/beat)+1):
        st=scale[(k+(h%5))%len(scale)]; f=440*2**(((root+12+st)-69)/12)
        i0=int(k*beat*SR); i1=min(n,i0+int(.38*beat*SR))
        if i0<i1:
            tt=np.arange(i1-i0)/SR; x[i0:i1]+=.12*np.sin(2*np.pi*f*tt)*np.exp(-5*tt/max(.1,beat))
    if "boss" in family:
        x += .055*np.sin(2*np.pi*55*t)*(0.5+0.5*np.sin(2*np.pi*(1/beat)*t))
    x += .018*rng.standard_normal(n)
    cf=min(int(.25*SR),n//4)
    if cf:
        a=np.linspace(0,1,cf); x[-cf:]=x[-cf:]*(1-a)+x[:cf]*a
    stereo=np.stack([x,np.roll(x,137)],axis=1)
    return norm(stereo,.72)

def write_audio(root,key,family,music_mode=False,runtime_only=False):
    safe=key.replace("/","_")
    if music_mode:
        dur=14 if "boss" in family else 12; sig=music(key,family,dur)
        wav=root/"09_MUSIC/master_wav"/f"{safe}.wav"; ogg=root/"09_MUSIC/runtime_ogg"/f"{safe}.ogg"
    else:
        dur=.9 if "telegraph" in family else .55; sig=sfx(key,family,dur)
        wav=root/"08_AUDIO_SFX/master_wav"/f"{safe}.wav"; ogg=root/"08_AUDIO_SFX/runtime_ogg"/f"{safe}.ogg"
    if not runtime_only: sf.write(wav,sig,SR,subtype="PCM_16")
    sf.write(ogg,sig,SR,format="OGG",subtype="VORBIS")
    return (None if runtime_only else wav),ogg

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--repo-root",default=".")
    ap.add_argument("--source",default="tools/v10_asset_pack/source")
    ap.add_argument("--output",default="generated/CHRONOS_V10_ASSET_PRODUCTION_PACK")
    ap.add_argument("--runtime-only",action="store_true",help="Skip master WAV files to reduce repository size")
    args=ap.parse_args()

    repo=Path(args.repo_root).resolve(); source=(repo/args.source).resolve(); root=(repo/args.output).resolve()
    matrix=source/"MATRICE_CONTENUTI_ASSET_V10_2.csv"
    if not matrix.exists(): raise SystemExit(f"Missing matrix: {matrix}")
    if root.exists(): shutil.rmtree(root)
    dirs(root)

    for name in ("MATRICE_CONTENUTI_ASSET_V10_2.csv","CONTRATTO_ASSET_PER_OGNI_CONTENUTO_V10_2.md"):
        p=source/name
        if p.exists(): shutil.copy2(p,root/"00_README"/name)

    canon=repo/"assets/chrono_shadows/latest_v85"
    if canon.exists():
        for p in canon.iterdir():
            if p.is_file() and p.suffix.lower() in {".png",".jpg",".jpeg",".webp",".md",".zip"}:
                shutil.copy2(p,root/"01_REFERENCE_CANON"/p.name)

    rows=list(csv.DictReader(matrix.open(newline="",encoding="utf-8")))
    records=[]
    audio_fams={"telegraph_sfx_family","action_sfx_family","ability_sfx_family","interaction_sfx_family","race_sfx_family","weapon_sfx_family","two_knocks_signature_sfx"}
    music_fams={"boss_music_cues","ambience_or_music_variant","music_cue_or_variant","ambience_loop_set","memory_audio_or_soundscape"}

    for row in rows:
        aid=row["asset_id"]; fam=row["asset_family"]; cid=row["content_id"]; typ=row["type"]; safe=aid.replace("/","_")
        status="PROTOTYPE"; src=""; run=""; extras=[]
        try:
            if fam=="sprite_animation_set":
                sub="02_CHARACTERS_SPRITES" if typ=="character" else "03_BOSSES_ENEMIES"; p=root/sub/f"{safe}.png"; sprite(cid,typ,p); src=run=str(p.relative_to(root)); extras=[str(p.with_suffix(".json").relative_to(root))]
            elif fam=="portrait_or_story_gestures":
                p=root/"02_CHARACTERS_SPRITES"/f"{safe}.png"; portrait(cid,typ,p); src=run=str(p.relative_to(root))
            elif fam in {"attack_vfx_set","attack_vfx","ability_vfx","shot_impact_vfx","memory_visual_sequence"}:
                p=root/"07_VFX"/f"{safe}.png"; vfx(cid,p); src=run=str(p.relative_to(root))
            elif fam in {"original_icon_states_or_layout","android_icon_artwork_variants","weapon_icon"}:
                sub="04_WEAPONS_ABILITIES" if fam=="weapon_icon" else "05_UI_HUD"; p=root/sub/f"{safe}.png"; icons(cid,p); src=run=str(p.relative_to(root))
            elif fam=="ui_feedback_family":
                p=root/"05_UI_HUD"/f"{safe}.png"; icons(cid,p); wav,ogg=write_audio(root,aid,fam,False,args.runtime_only); src=str(p.relative_to(root)); run=str(ogg.relative_to(root)); extras=[str(p.relative_to(root))]+([] if wav is None else [str(wav.relative_to(root))])
            elif fam=="equipped_visual_animation":
                p=root/"04_WEAPONS_ABILITIES"/f"{safe}.png"; weapon(cid,p); src=run=str(p.relative_to(root))
            elif fam in {"action_animation","interaction_animation","authored_gesture_sequence","scene_staging_animation"}:
                sub="04_WEAPONS_ABILITIES" if typ=="ability" else "06_REGIONS_RACES_PROPS"; p=root/sub/f"{safe}.png"; sprite(cid,typ,p); src=run=str(p.relative_to(root)); extras=[str(p.with_suffix(".json").relative_to(root))]
            elif fam in {"arena_visual_set","environment_visual_set","track_visual_states","route_signal_visuals"}:
                sub="03_BOSSES_ENEMIES" if fam=="arena_visual_set" else "06_REGIONS_RACES_PROPS"; p=root/sub/f"{safe}.png"; environment(cid,p,typ=="race" or "track" in fam or "route" in fam); src=run=str(p.relative_to(root))
            elif fam in {"prop_visual_states","specific_prop_states"}:
                p=root/"06_REGIONS_RACES_PROPS"/f"{safe}.png"; props(cid,p); src=run=str(p.relative_to(root))
            elif fam in audio_fams:
                wav,ogg=write_audio(root,aid,fam,False,args.runtime_only); src=str((ogg if wav is None else wav).relative_to(root)); run=str(ogg.relative_to(root))
            elif fam in music_fams:
                wav,ogg=write_audio(root,aid,fam,True,args.runtime_only); src=str((ogg if wav is None else wav).relative_to(root)); run=str(ogg.relative_to(root))
            else:
                p=root/"10_MANIFESTS"/f"{safe}.json"; p.write_text(json.dumps({"asset_id":aid,"content_id":cid,"family":fam,"status":"PROTOTYPE","note":"Dedicated final media pass required."},indent=2)); src=run=str(p.relative_to(root))
            hp=root/run; sha=hashlib.sha256(hp.read_bytes()).hexdigest() if hp.exists() else ""
            rec=dict(row); rec.update(status=status,source_path=src,runtime_path=run,sha256=sha,extras="|".join(extras)); records.append(rec)
        except Exception as e:
            rec=dict(row); rec.update(status="BLOCKED",source_path="",runtime_path="",sha256="",extras="",error=str(e)); records.append(rec)

    fields=list(records[0].keys())
    with (root/"10_MANIFESTS/ASSET_MANIFEST_V10_GENERATED.csv").open("w",newline="",encoding="utf-8") as f:
        w=csv.DictWriter(f,fieldnames=fields); w.writeheader(); w.writerows(records)
    (root/"10_MANIFESTS/ASSET_MANIFEST_V10_GENERATED.json").write_text(json.dumps(records,indent=2,ensure_ascii=False))

    coverage={}
    for r in records:
        k=(r["type"],r["content_id"],r["content_name"]); coverage.setdefault(k,{"requirements":0,"prototype_ready":0,"blocked":0})
        coverage[k]["requirements"]+=1; coverage[k]["prototype_ready"]+=r["status"]=="PROTOTYPE"; coverage[k]["blocked"]+=r["status"]=="BLOCKED"
    cov=[{"type":k[0],"content_id":k[1],"content_name":k[2],**v} for k,v in coverage.items()]
    (root/"10_MANIFESTS/CONTENT_COVERAGE.json").write_text(json.dumps(cov,indent=2,ensure_ascii=False))

    status={}
    for r in records: status[r["status"]]=status.get(r["status"],0)+1
    (root/"00_README/README_FIRST.md").write_text(
        "# CHRONOS V10 Asset Production Pack\n\n"
        f"Matrix requirements: {len(records)}\n\nStatuses: {json.dumps(status)}\n\n"
        "Generated media are integration/playtest prototypes, not commercial-final certification. "
        "Compare hero art, bosses and sprites against assets/chrono_shadows/latest_v85 before replacement.\n"
    )
    (root/"00_README/STATUS_REPORT.md").write_text(
        "# V10 status\n\nCOMMERCIAL_RELEASE = BLOCKED\n\n"
        "Required before PASS: art review, sprite cleanup, audio mix, runtime binding, Android QA, performance QA and blind playtest.\n"
    )
    (root/"12_INTEGRATION/INTEGRATION_GUIDE.md").write_text(
        "# Integration\n\n"
        "Sprites: 128x128 prototype frames; rows idle/walk/run/attack/hurt; pivot [64,110].\n"
        "VFX: horizontal 8-frame strips, 128x128, alpha.\n"
        "UI: four states per strip.\n"
        "Audio runtime: OGG Vorbis 44.1kHz. Master WAV omitted only with --runtime-only.\n"
        "Do not overwrite superior V8/V8.5 art automatically. Classify each item REUSE/ADAPT/REPLACE/NEW/REJECT.\n"
    )

    prompt_rows=[]
    for (typ,cid,name),v in coverage.items():
        _,acc,_,_=palette(cid,typ)
        prompt_rows.append({"content_id":cid,"content_name":name,"type":typ,
          "final_art_prompt":f"CHRONOS V10.2 canon asset for {name} ({typ}). Match Flexati Adventure-city V8.5 visual direction: premium semi-realistic anime/cyberpunk, adult readable silhouettes, weathered functional design, restrained energy accents, mobile readability, palette accent RGB {acc}. No unrelated text or logos."})
    with (root/"10_MANIFESTS/FINAL_ART_PROMPT_LEDGER.csv").open("w",newline="",encoding="utf-8") as f:
        w=csv.DictWriter(f,fieldnames=prompt_rows[0].keys()); w.writeheader(); w.writerows(prompt_rows)

    sums=[]
    for p in sorted(root.rglob("*")):
        if p.is_file(): sums.append(f"{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.relative_to(root)}")
    (root/"10_MANIFESTS/SHA256SUMS.txt").write_text("\n".join(sums)+"\n")
    inv={"files":sum(p.is_file() for p in root.rglob("*")),"bytes":sum(p.stat().st_size for p in root.rglob("*") if p.is_file()),"matrix_requirements":len(records),"statuses":status}
    (root/"10_MANIFESTS/PACKAGE_INVENTORY.json").write_text(json.dumps(inv,indent=2))
    print(json.dumps(inv,indent=2))
    print("Generated:",root)

if __name__=="__main__":
    main()
