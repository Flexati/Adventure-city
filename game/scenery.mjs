import {TILE_SIZE,GRID_SIZE} from './layouts.mjs';
import {bakeVillage,vHash,vRect,vBox,vCir,vLine} from './village-art.mjs';
// Costruzione superfici missione/esplorazione con identità per distretto e layout (Master Prompt V3).
export function buildMapSurface(lay,bg,props,pal,chrono=null,d=0){
 const s=document.createElement('canvas');s.width=s.height=1536;const g=s.getContext('2d');g.imageSmoothingEnabled=false;
 if(lay.village){bakeVillage(g,lay.village,lay.id,chrono,d,bg,props);return s;}
 const iw=bg?.naturalWidth||1024,ih=bg?.naturalHeight||1024,ts=TILE_SIZE,G=GRID_SIZE,lid=lay.id||'yard';
 const rf=['#162230','#122230','#18261e','#1e152c'][d]||'#162230',rd=['#182432','#142430','#1b2820','#1e172e'][d]||'#182432',cb=['#3e5468','#35586e','#485e46','#544270'][d]||'#3e5468',ac=['#f2a65a','#4cc9f0','#7ae582','#c77dff'][d]||pal;
 vRect(g,0,0,1536,1536,'#0c141e');
 const open=(x,y)=>x>=0&&y>=0&&x<G&&y<G&&lay.cells[y*G+x],pts=[lay.start,lay.boss,...(lay.nodes||[])].filter(Boolean);
 for(let y=0;y<G;y++)for(let x=0;x<G;x++){
  const px=x*ts,py=y*ts,h=vHash(x,y,d+1),inn=x>=4&&x<=19&&y>=4&&y<=19;
  if(open(x,y)){
   const ed=!open(x,y-1)||!open(x+1,y)||!open(x,y+1)||!open(x-1,y),sf=pts.some(p=>Math.hypot(px+32-p.x,py+32-p.y)<120);
   if(bg?.naturalWidth)g.drawImage(bg,(.4+(x%4)*.045)*iw,(.4+(y%4)*.045)*ih,iw*.055,ih*.055,px,py,ts,ts);
   if(chrono?.naturalWidth){const ft=[0,2,7,5][d]??0;g.globalAlpha=ed?.42:.28;g.drawImage(chrono,ft%4*128+(x%2)*64,(ft>>2)*128+(y%2)*64,64,64,px,py,ts,ts);g.globalAlpha=1;}
   vRect(g,px,py,ts,ts,ed?rd+'66':rd+'4c');
   if(!ed&&!sf){
    if((x*7+y*11)%19===0){vBox(g,px+20,py+20,24,24,'#0d1620','#4a6478',1.5);for(let k=24;k<42;k+=4)vRect(g,px+k,py+23,2,18,'#263846');}
    else if((x*11+y*5)%23===0){vCir(g,px+32,py+32,11,'#16222e','#486074');vCir(g,px+32,py+32,5,0,'#486074',1);}
    else if(h>.66)vRect(g,px+8+((x*7)%24),py+8+((y*11)%28),22,12,'#0a121a30');
   }
   if(lid==='yard'&&(x===11||y===11)&&!ed)vLine(g,px+(x===11?60:8),py+(y===11?60:8),px+56,py+56,ac+'2e',2);
   else if(lid==='spine'&&(x===11||x===12))vLine(g,px+(x===11?54:10),py,px+(x===11?54:10),py+ts,ac+'38',2);
   else if(lid==='gallery'&&(y===5||y===12||y===18))vBox(g,px,py+26,ts,12,ac+'14',ac+'30');
   for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]])if(!open(x+dx,y+dy)){
    vRect(g,px+(dx>0?50:0),py+(dy>0?50:0),dx?14:ts,dy?14:ts,'#070e17');
    vRect(g,px+(dx>0?54:dx<0?2:0),py+(dy>0?54:dy<0?2:0),dx?8:ts,dy?8:ts,cb);
    const ax=px+(dx>0?54:dx<0?10:0),ay=py+(dy>0?54:dy<0?10:0);vLine(g,ax,ay,ax+(dy?ts:0),ay+(dx?ts:0),pal+'aa',2);
   }
  }else if(!inn){
   if(bg?.naturalWidth)g.drawImage(bg,(x<12?0:iw*.648)+(x%6)*iw*.058,(y<12?0:ih*.648)+(y%6)*ih*.058,iw*.058,ih*.058,px,py,ts,ts);
   vRect(g,px,py,ts,ts,rf+(bg?.naturalWidth?'38':'e8'));
  }else vRect(g,px,py,ts,ts,rf);
 }
 const seen=new Uint8Array(G*G);let idx=0;
 for(let y=4;y<=19;y++)for(let x=4;x<=19;x++)if(!open(x,y)&&!seen[y*G+x]){
  let bw=1,bh=1;
  while(bw<4&&x+bw<=19&&!open(x+bw,y)&&!seen[y*G+x+bw])bw++;
  while(bh<4&&y+bh<=19&&[...Array(bw).keys()].every(dx=>!open(x+dx,y+bh)&&!seen[(y+bh)*G+x+dx]))bh++;
  for(let dy=0;dy<bh;dy++)for(let dx=0;dx<bw;dx++)seen[(y+dy)*G+x+dx]=1;
  const px=x*ts,py=y*ts,W=bw*ts,H=bh*ts,k=(idx++)%4;
  vRect(g,px+6,py+10,W-4,H-4,'#04080ecc');
  if(bg?.naturalWidth)g.drawImage(bg,(k&1?iw*.68:iw*.04),(k&2?ih*.68:ih*.04),iw*.22,ih*.22,px+2,py+2,W-4,H-4);
  vBox(g,px+2,py+2,W-4,H-4,rf+'88',cb,2);vBox(g,px+8,py+8,W-16,H-16,'#0d1520aa',ac+'66',1.5);
  if(props?.naturalWidth){const cw=props.naturalWidth/4,ch=props.naturalHeight/4,sz=Math.min(W,H)-16;g.drawImage(props,k*cw,(d%4)*ch,cw,ch,px+(W-sz)/2,py+(H-sz)/2-4,sz,sz);}
 }
 for(let y=0;y<G;y++)for(let x=0;x<G;x++)if(!open(x,y)&&(x<4||x>19||y<4||y>19)){
  const px=x*ts,py=y*ts;
  if(open(x,y+1)){vRect(g,px,py+52,ts,12,'#101a26dd');vLine(g,px,py+52,px+ts,py+52,cb,2);}
  if(open(x,y-1)){vRect(g,px,py,ts,10,'#101a26cc');vLine(g,px,py+10,px+ts,py+10,cb,1.5);}
  if(open(x+1,y))vRect(g,px+54,py,10,ts,'#101a26cc');
  if(open(x-1,y))vRect(g,px,py,10,ts,'#101a26cc');
 }
 if(lid==='arena'){vCir(g,768,768,250,0,pal+'44',3);vCir(g,768,768,170,0,ac+'33',2);}
 if(lay.nodes?.length){
  g.save();g.strokeStyle=pal+'38';g.lineWidth=3.5;g.setLineDash([10,7]);
  for(const n of lay.nodes){g.beginPath();g.moveTo(lay.start.x,lay.start.y);g.lineTo(n.x,lay.start.y);g.lineTo(n.x,n.y);if(open((n.x/ts)|0,(lay.start.y/ts)|0))g.stroke();}
  g.restore();
 }
 g.globalCompositeOperation='soft-light';g.globalAlpha=.20;vRect(g,0,0,1536,1536,pal);g.globalAlpha=1;g.globalCompositeOperation='source-over';
 g.font='700 20px monospace';g.textAlign='center';g.fillStyle=pal;g.fillText(lay.label,lay.start.x,lay.start.y+65);
 for(let i=0;i<lay.nodes.length;i++){
  const n=lay.nodes[i];vCir(g,n.x,n.y,44,'#0b131c88',pal+'55');
  g.strokeStyle=pal+'66';g.setLineDash([7,9]);g.lineWidth=2;g.strokeRect(n.x-64,n.y-64,128,128);g.setLineDash([]);
  g.fillStyle='#d7e6e6aa';g.font='14px monospace';g.fillText('0'+(i+1),n.x,n.y-78);
 }
 return s;
}
