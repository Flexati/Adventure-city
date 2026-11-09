import {TILE_SIZE,GRID_SIZE} from './layouts.mjs';
import {bakeVillage} from './village-art.mjs';
export function buildMapSurface(layout,backdrop,props,palette,chrono=null,district=0){
 const surface=document.createElement('canvas');surface.width=surface.height=1536;const g=surface.getContext('2d');g.imageSmoothingEnabled=false;
 if(layout.village){bakeVillage(g,layout.village,layout.id,chrono,district,backdrop);return surface;}
 const iw=backdrop?.naturalWidth||1024,ih=backdrop?.naturalHeight||1024,ts=TILE_SIZE,G=GRID_SIZE,r=(x,y,w,h,c)=>{if(c)g.fillStyle=c;g.fillRect(x,y,w,h);};
 const roofTint=['#1b2836','#162936','#1f2d24','#241b35'][district]||'#1b2836',roadTint=['#1e2d3d','#1a2c38','#223028','#261f38'][district]||'#1e2d3d',curb=['#3d5266','#36586e','#4a5d46','#52436e'][district]||'#3d5266';
 r(0,0,1536,1536,'#0e1722');
 const open=(x,y)=>x>=0&&y>=0&&x<G&&y<G&&layout.cells[y*G+x],cov=new Uint8Array(G*G);
 for(let y=0;y<G;y++)for(let x=0;x<G;x++){
  const px=x*ts,py=y*ts,h=(x*13+y*17)%5;
  if(open(x,y)){
   const edge=!open(x,y-1)||!open(x+1,y)||!open(x,y+1)||!open(x-1,y);
   if(chrono?.naturalWidth){const b=[0,2,3,7][district]??0,a=[1,4,5,6][district]??b,t=edge?b:(x+y)%4===0?a:b;g.drawImage(chrono,t%4*128,Math.floor(t/4)*128,128,128,px,py,ts,ts);}
   else if(backdrop?.naturalWidth)g.drawImage(backdrop,(.425+(h%2)*.045)*iw,(.39+Math.floor(h/2)*.045)*ih,iw*.075,ih*.075,px,py,ts,ts);
   r(px,py,ts,ts,edge?'#1c2c3c66':roadTint+'44');g.strokeStyle=edge?'#8ab4cc24':'#7da1b81a';g.lineWidth=1;
   if(edge){
    for(const [ox,oy] of [[1,1],[33,1],[1,33],[33,33]])g.strokeRect(px+ox,py+oy,30,30);
    r(px+3,py+3,ts-6,2,'#ffffff09');
   }else{
    for(let i=0;i<4;i++){const ry=py+i*16,o=(i%2)*16;g.beginPath();g.moveTo(px,ry+.5);g.lineTo(px+ts,ry+.5);for(let c=o;c<ts;c+=32){g.moveTo(px+c+.5,ry);g.lineTo(px+c+.5,ry+16);}g.stroke();}
    if(((x*37+y*67)%19)>11)r(px+4,py+((x+y)%4)*16+2,26,12,'#a8cce012');
    if((x*7+y*11)%15===0){r(px+20,py+20,24,24,'#0d1620');g.strokeStyle='#4e687d';g.lineWidth=1.5;g.strokeRect(px+20,py+20,24,24);for(let k=24;k<42;k+=4)r(px+k,py+23,2,18,'#293b4a');}
    else if((x*11+y*5)%19===0){g.fillStyle='#182430';g.beginPath();g.arc(px+32,py+32,12,0,7);g.fill();g.strokeStyle='#4d657a';g.lineWidth=1.5;g.stroke();g.beginPath();g.arc(px+32,py+32,6,0,7);g.stroke();}
   }
   for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]])if(!open(x+dx,y+dy)){
    r(px+(dx>0?ts-14:0),py+(dy>0?ts-14:0),dx?14:ts,dy?14:ts,'#08101a');
    r(px+(dx>0?ts-10:dx<0?2:0),py+(dy>0?ts-10:dy<0?2:0),dx?8:ts,dy?8:ts,curb);
    g.strokeStyle=palette+'cc';g.lineWidth=2;g.beginPath();const ax=px+(dx>0?ts-10:dx<0?10:0),ay=py+(dy>0?ts-10:dy<0?10:0);g.moveTo(ax,ay);g.lineTo(ax+(dy?ts:0),ay+(dx?ts:0));g.stroke();
   }
  }else{
   if(backdrop?.naturalWidth)g.drawImage(backdrop,iw*(.08+(h%3)*.08),ih*(.08+(h%2)*.08),iw*.09,ih*.09,px,py,ts,ts);
   r(px,py,ts,ts,roofTint+'e6');r(px,py,ts,2,'#0a111a');r(px,py,2,ts);
   for(let k=8;k<ts;k+=16)r(px+4,py+k,ts-8,3,'#2a3b4e55');g.strokeStyle='#394d6344';g.lineWidth=1;g.strokeRect(px+2.5,py+2.5,ts-5,ts-5);
   if((x*3+y*7)%5===0){r(px+14,py+14,36,36,'#121c27');g.strokeStyle='#48607866';g.strokeRect(px+14.5,py+14.5,35,35);r(px+20,py+20,24,24,palette+'33');}
  }
 }
 if(chrono?.naturalWidth)for(let y=0;y<G-1;y+=2)for(let x=0;x<G-1;x+=2)if(!open(x,y)&&!open(x+1,y)&&!open(x,y+1)&&!open(x+1,y+1)){
  const t=[8,9,11,10][district]??8;g.drawImage(chrono,t%4*128,Math.floor(t/4)*128,128,128,x*ts,y*ts,2*ts,2*ts);g.strokeStyle='#3e546988';g.lineWidth=2;g.strokeRect(x*ts+2,y*ts+2,2*ts-4,2*ts-4);
  cov[y*G+x]=cov[y*G+x+1]=cov[(y+1)*G+x]=cov[(y+1)*G+x+1]=1;
 }
 if(layout.nodes?.length){g.save();g.strokeStyle=palette+'38';g.lineWidth=4;g.setLineDash([10,6]);for(const n of layout.nodes){g.beginPath();g.moveTo(layout.start.x,layout.start.y);g.lineTo(n.x,layout.start.y);g.lineTo(n.x,n.y);if(open(Math.floor(n.x/ts),Math.floor(layout.start.y/ts)))g.stroke();}g.restore();}
 g.globalCompositeOperation='soft-light';g.globalAlpha=.26;r(0,0,1536,1536,palette);g.globalAlpha=1;g.globalCompositeOperation='source-over';
 for(let y=0;y<G;y++)for(let x=0;x<G;x++)if(!open(x,y)&&[[-1,0],[1,0],[0,-1],[0,1]].some(([dx,dy])=>open(x+dx,y+dy))){
  const px=x*ts,py=y*ts;if(!cov[y*G+x]){r(px+3,py+3,ts-6,ts-6,'#1b2735');r(px+6,py+6,ts-12,10,'#2b3d50');}
  g.strokeStyle='#63788c99';g.lineWidth=2;g.strokeRect(px+4,py+4,ts-8,ts-8);r(px+10,py+10,ts-20,4,palette+'44');
  if(!chrono&&(x+y)%3===0&&props?.naturalWidth){const cw=props.naturalWidth/4,ch=props.naturalHeight/4;g.drawImage(props,cw*3,ch*3,cw,ch,px+4,py-12,56,76);}
 }
 g.font='700 20px monospace';g.textAlign='center';g.fillStyle=palette;g.fillText(layout.label,layout.start.x,layout.start.y+65);
 for(let i=0;i<layout.nodes.length;i++){const n=layout.nodes[i];g.strokeStyle=palette+'66';g.setLineDash([7,9]);g.lineWidth=2;g.strokeRect(n.x-64,n.y-64,128,128);g.setLineDash([]);g.fillStyle='#d7e6e6aa';g.font='14px monospace';g.fillText('0'+(i+1),n.x,n.y-78);}
 return surface;
}
