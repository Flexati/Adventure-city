"""Technical pose isolation/packing of image_gen output; no repainting."""
from pathlib import Path
import sys,json,hashlib
import numpy as np
from PIL import Image
sys.path.insert(0,str(Path(__file__).parent/'lib'))
from sprite_isolation import isolate,foot
R=Path(__file__).resolve().parents[1];O=R/'assets/production/v10.2/handoff/astra_p1'
im=np.array(Image.open(O/'masters/veyra_sprite.png').convert('RGBA'));poses,_=isolate(im)
bounds=[]
for key,(layer,mask) in sorted(poses.items()):
 y,x=np.nonzero(layer[:,:,3]);bounds.append((key,layer,mask,(int(x.min()),int(y.min()),int(x.max()+1),int(y.max()+1))))
scale=min(300/(b[3]-b[1]) for _,_,_,b in bounds)
canvas=Image.new('RGBA',(1360,1360));report=[]
for (r,c),layer,mask,b in bounds:
 crop=Image.fromarray(layer).crop(b);w,h=round(crop.width*scale),round(crop.height*scale);crop=crop.resize((w,h),Image.Resampling.NEAREST)
 assert w<=316 and h<=300
 x=c*340+(340-w)//2;y=r*340+320-h;canvas.alpha_composite(crop,(x,y))
 report.append({'row':r,'col':c,'width':w,'height':h,'baseline':320,'minimum_margin':min((340-w)//2,320-h,20)})
canvas.save(O/'CHAR_veyra_sheet.png')
(O/'VEYRA_PACKING.json').write_text(json.dumps({'source':'masters/veyra_sprite.png','output':'CHAR_veyra_sheet.png','grid':[4,4],'cell':[340,340],'scale':scale,'cells':report,'limitations':'Technical packing only. Master touches top border in first row: inspect hair edge; walk loop and portrait compatibility need runtime review. Rows follow spreadsheet G2, which differs from older request (walk versus salute).'},indent=2)+'\n')
print('Packed 16 poses, 340px cells, constant baseline, min margin',min(x['minimum_margin'] for x in report))
