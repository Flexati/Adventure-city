"""Copy selected original archive members; never rewrite the source ZIPs."""
from pathlib import Path
import argparse, hashlib, json, zipfile
ROOT = Path(__file__).resolve().parents[1]
EXPECTED = {
 'CITY_ADVENTURE_PRODUCTION_PACK_FINAL.zip':'69ecac596afcfb16265f238d84b9642d837d61e5f702aac0036531ed15a20c19',
 'CITY_ADVENTURE_ALL_CHAT_PNGS_VERIFIED.zip':'fbf71a7085e07497003b13e79efb08456d9fe539485b31f8516fdef02ecee774',
 'CITY_ADVENTURE_COMPLETE_AUDIO_PACK.zip':'87caa537b190f288d70f52de24f13648544cd1d49d13f97e959fcb9851bc6321'}
SELECTION = {
 'CITY_ADVENTURE_ALL_CHAT_PNGS_VERIFIED.zip':{'heroes.png':'01_HEROES/RIOTLINE_Kai_Zara_Animation_Sheet.png','bosses.png':'02_BOSSES/RIOTLINE_Boss_Set_A_Pizzaiolo_ProfZombie_DragoDrone.png'},
 'CITY_ADVENTURE_COMPLETE_AUDIO_PACK.zip':{
 'hub.ogg':'music/runtime_ogg/hub_rookside.ogg','boss.ogg':'music/runtime_ogg/boss_suite.ogg','ending.ogg':'music/runtime_ogg/epilogue.ogg',
 'hit.ogg':'sfx/kai/runtime_ogg/wrench_hit.ogg','zara.ogg':'sfx/zara/runtime_ogg/pipe_swing.ogg','dodge.ogg':'sfx/zara/runtime_ogg/dodge.ogg',
 'clue.ogg':'sfx/ui/runtime_ogg/clue_found.ogg','choice.ogg':'sfx/ui/runtime_ogg/choice_commit.ogg','duo.ogg':'sfx/duo/runtime_ogg/assist.ogg','pizza.ogg':'sfx/bosses/runtime_ogg/robot_pizza_throw.ogg'}}
def prepare(source, target):
 report=[]
 for name,digest in EXPECTED.items():
  p=source/name
  actual=hashlib.sha256(p.read_bytes()).hexdigest()
  if actual!=digest: raise ValueError(f'Original archive mismatch: {name}')
  with zipfile.ZipFile(p) as archive:
   for output,suffix in SELECTION.get(name,{}).items():
    matches=[n for n in archive.namelist() if n.endswith('/'+suffix)]
    if len(matches)!=1: raise ValueError(f'Ambiguous asset: {suffix}')
    data=archive.read(matches[0]); target.mkdir(parents=True,exist_ok=True)
    (target/output).write_bytes(data)
    report.append(dict(output=output,source=name,member=matches[0],bytes=len(data),sha256=hashlib.sha256(data).hexdigest()))
 (target/'provenance.json').write_text(json.dumps(report,indent=2))
 print(f'{len(report)} original assets copied. All three original ZIP checksums match.')
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--source',type=Path,default=ROOT);args=parser.parse_args();prepare(args.source,ROOT/'game/assets')
