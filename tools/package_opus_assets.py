"""Package actual files, never infer commercial completeness from file counts."""
from pathlib import Path
import hashlib,json,zipfile
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/production/v10.2/handoff'
files=[]
for folder in ['game/art','game/audio','game/video','assets/production/v10.2']:
 for p in sorted((ROOT/folder).rglob('*')):
  if p.is_file() and p.suffix.lower() in {'.png','.jpg','.webp','.svg','.ogg','.flac','.wav','.mp4','.mid','.json','.csv'} and p.name!='PACKAGE_MANIFEST.json':
   b=p.read_bytes();row={'path':p.relative_to(ROOT).as_posix(),'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'status':'EXISTING_FILE_REQUIRES_FAMILY_ACCEPTANCE'}
   if p.suffix in ['.png','.jpg','.webp']:
    with Image.open(p) as im:im.load();row.update(width=im.width,height=im.height,mode=im.mode)
   files.append(row)
manifest={'scope':'All existing art/audio/video and V10.2 production sources. Not a complete 442-family acceptance.','commercial_release':'BLOCKED','all_required_assets_complete':False,'files':files}
OUT.mkdir(parents=True,exist_ok=True);(OUT/'PACKAGE_MANIFEST.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
dest=ROOT.parent/'exports';dest.mkdir(exist_ok=True,parents=True)
with zipfile.ZipFile(dest/'CHRONOS_ASSET_HANDOFF_PARTIAL.zip','w',zipfile.ZIP_DEFLATED) as z:
 for row in files:z.write(ROOT/row['path'],row['path'])
 for p in [OUT/'PACKAGE_MANIFEST.json',OUT/'README.md',*sorted((ROOT/'docs/gold').glob('*.md')),*sorted((ROOT/'docs/production/v10.2').glob('*.txt'))]:
  if p.exists():z.write(p,p.relative_to(ROOT))
print(json.dumps({'actual_files':len(files),'archive':str(dest/'CHRONOS_ASSET_HANDOFF_PARTIAL.zip'),'complete':False}))
