"""Decode and fingerprint repository media. Never approves art, rights or commercial readiness."""
from pathlib import Path
import collections,hashlib,json,subprocess,xml.etree.ElementTree as ET
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
SUFFIXES={'.png','.jpg','.webp','.svg','.ogg','.wav','.mp4','.mid'}
def audit():
 manifest=ROOT/'android/build/assets/asset-manifest.json'
 packaged=json.loads(manifest.read_text()) if manifest.exists() else {}
 rows=[]
 for p in sorted((ROOT/'game').rglob('*')):
  if not p.is_file() or p.suffix not in SUFFIXES:continue
  b=p.read_bytes();name=p.relative_to(ROOT).as_posix();row={'path':name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'format':p.suffix[1:],'candidate_disposition':'REUSE','technical_status':'PASS','commercial_ready':False,'rights':'UNVERIFIED','art_review':'PENDING','runtime_event_review':'PENDING','android_packaged':name.removeprefix('game/') in packaged,'evidence_scope':'File decode and package listing only; no human listening or device playback.'}
  try:
   if p.suffix in {'.png','.jpg','.webp'}:
    with Image.open(p) as im:im.load();row.update(width=im.width,height=im.height,mode=im.mode)
   elif p.suffix=='.svg':
    tree=ET.fromstring(b);row.update(width=tree.get('width'),height=tree.get('height'),view_box=tree.get('viewBox'))
    if any(k.rsplit('}',1)[-1]=='href' and ('://' in v or v.startswith('data:')) for el in tree.iter() for k,v in el.attrib.items()):raise ValueError('External or embedded SVG dependency needs review')
   elif p.suffix=='.mid':
    if b[:4]!=b'MThd':raise ValueError('Invalid MIDI header')
    row['tracks']=int.from_bytes(b[10:12],'big');row['source_only']=True
   else:
    probe=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_name,codec_type,width,height,sample_rate,channels','-of','json',str(p)],check=True,capture_output=True,text=True,timeout=30)
    row['media']=json.loads(probe.stdout)
    subprocess.run(['ffmpeg','-v','error','-i',str(p),'-f','null','-'],check=True,capture_output=True,timeout=60)
  except Exception as e:row.update(technical_status='FAIL',candidate_disposition='REJECT',defect=str(e))
  rows.append(row)
 groups=collections.defaultdict(list)
 for r in rows:groups[r['sha256']].append(r['path'])
 result={'scope':'All discoverable game media; candidate dispositions are technical triage, not asset contract approval. MIDI records are source files.','files':len(rows),'technical':dict(collections.Counter(r['technical_status'] for r in rows)),'packaged_files':sum(r['android_packaged'] for r in rows),'commercial_ready':0,'duplicates':[v for v in groups.values() if len(v)>1],'entries':rows}
 out=ROOT/'docs/gold/FILE_INVENTORY.json';out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in result.items() if k not in ['entries','duplicates']},ensure_ascii=False))
 # Keep the supplied matrix intact and attach candidates to every stable requirement ID.
 matrix=json.loads((ROOT/'docs/production/v10.2/MATRICE_CONTENUTI_ASSET_V10_2.json').read_text())
 register_path=ROOT/'docs/gold/ASSET_REGISTER.json';register=json.loads(register_path.read_text())
 aliases={'bone_tyrant':'cathedral_bone_tyrant','forge_behemoth':'toxic_forge_behemoth','archon':'chrono_overlord'}
 owners={a:c['id'] for c in matrix['contents'] for a in c['asset_ids']}
 links=[]
 for requirement in matrix['assets']:
  rid=requirement['id'];owner=owners[rid];stem=owner.split('.')[-1];stem=aliases.get(stem,stem)
  candidates=[]
  if requirement['family']=='sprite_animation_set':
   candidates=[r['path'] for r in rows if Path(r['path']).stem==stem and r['format']=='png' and r['technical_status']=='PASS']
  for authored in register['real_files_audited']:
   if rid in authored.get('requirement_asset_ids',[]):candidates.append(authored['runtime_path'])
  links.append({'requirement_id':rid,'content_id':owner,'status':'OPEN','candidate_files':sorted(set(candidates)),'acceptance':'Family completeness, runtime event, art, rights and device evidence pending. A candidate file does not close this requirement.'})
 assert len(links)==442 and len({r['requirement_id'] for r in links})==442
 register['requirement_links']=links
 register['technical_inventory']='docs/gold/FILE_INVENTORY.json'
 register_path.write_text(json.dumps(register,ensure_ascii=False,indent=2)+'\n')
 return all(r['technical_status']=='PASS' for r in rows)
if __name__=='__main__':raise SystemExit(0 if audit() else 1)
