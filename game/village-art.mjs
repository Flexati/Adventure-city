// Arte procedurale e composizione dei villaggi (D40 + Master Prompt V3): bakeVillage + drawVillageLife.
import {VILLAGE_HOUSES} from './village-houses.mjs';
const VT=64,HID={moon:0,ash_docks:0,cathedral:1,antenna_port:1,chalk_harbor:1,glass_terrace:1,toxic:2,clinic_ward:2,deep_archive:2,clockwork:3,node_commons:3,lower_hearth:3,sky_rail:3,axis_crown:3};
export const vHash=(a,b=0,c=0)=>{let h=(a*374761393+b*668265263+c*2147483647)|0;h=(h^(h>>>13))*1274126177|0;return ((h^(h>>>16))>>>0)/4294967295;};
const vShade=(hex,amt)=>{const n=parseInt(hex.slice(1),16),f=c=>Math.max(0,Math.min(255,Math.round(c+amt*255)));return '#'+[(n>>16)&255,(n>>8)&255,n&255].map(f).map(v=>v.toString(16).padStart(2,'0')).join('');};
export const vRect=(g,x,y,w,h,c)=>{if(c)g.fillStyle=c;g.fillRect(x,y,w,h);};
export const vBox=(g,x,y,w,h,f,s,lw=1)=>{if(f)vRect(g,x,y,w,h,f);if(s){g.strokeStyle=s;g.lineWidth=lw;g.strokeRect(x+.5,y+.5,w-1,h-1);}};
export const vCir=(g,x,y,r,f,s,lw=1.5)=>{g.beginPath();g.arc(x,y,r,0,7);if(f){g.fillStyle=f;g.fill();}if(s){g.strokeStyle=s;g.lineWidth=lw;g.stroke();}};
export const vLine=(g,x1,y1,x2,y2,s,lw=1)=>{if(s){g.strokeStyle=s;g.lineWidth=lw;}g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();};
const V_ICON={
 inn:(g,x,y,c)=>{vRect(g,x-6,y-4,10,10,c);vRect(g,x+4,y-1,3,5,c);g.clearRect(x+5,y,1,3);vRect(g,x-7,y+6,13,2,c);},
 smith:(g,x,y,c)=>{vRect(g,x-8,y-5,16,5,c);vRect(g,x-4,y,8,4,c);vRect(g,x-7,y+4,14,3,c);},
 shop:(g,x,y,c)=>{vRect(g,x-7,y-3,14,10,c);vRect(g,x-4,y-7,8,4,c);g.clearRect(x-2,y-6,4,2);},
 relic:(g,x,y,c)=>{vCir(g,x,y,6,0,c,2);vRect(g,x-1,y-9,2,18,c);},
 info:(g,x,y,c)=>{vCir(g,x,y,8,c);vRect(g,x-1,y-1,2,6,'#10202c');vRect(g,x-1,y-5,2,2,'#10202c');},
 alchemist:(g,x,y,c)=>{vRect(g,x-2,y-8,4,6,c);g.fillStyle=c;g.beginPath();g.moveTo(x-2,y-3);gLine(g,x-8,y+7,x+8,y+7);},
};
function vFloorTile(g,env,d,px,py,m,plz,x,y,H){
 const t=plz?([0,2,7,6][d]??0):([0,2,7,0][d]??0),h=vHash(x,y,6);
 if(env?.naturalWidth){
  const ox=(x%2)*64,oy=(y%2)*64;
  g.drawImage(env,t%4*128+ox,(t>>2)*128+oy,64,64,px,py,VT,VT);
 }
 vRect(g,px,py,VT,VT,(plz?m.plaza:m.floor)+(plz?'70':'58'));
 if(plz){
  vBox(g,px+2,py+2,60,60,0,m.trim+'26');
  if(H===1&&(x+y)%2===0)vBox(g,px+8,py+8,48,48,0,m.trim+'22');
  else if(H===3&&(x+y)%2===0)vCir(g,px+32,py+32,10,0,m.trim+'28');
 }else if(h>.62)vRect(g,px+8+((x*9)%26),py+8+((y*11)%32),20,12,H===2?'#6bd23a14':'#ffffff0d');
}
function vDrawProp(g,H,p,m,props){
 const cx=p.x*VT+32,cy=p.y*VT+32,v=(p.x*7+p.y*13)%3,base=['#273848','#352f44','#2d3a22','#3d3226'][H];
 g.fillStyle='#00000066';g.beginPath();g.ellipse(cx,cy+18,18,7,0,0,7);g.fill();
 if(props?.naturalWidth===1536&&props?.naturalHeight===1024){
  const idx=(p.x*5+p.y*11)%12,cw=384,ch=341;
  g.drawImage(props,(idx%4)*cw,((idx/4)|0)*ch,cw,ch,cx-30,cy-38,60,56);
 }
 if(v===0){
  if(H<2){vRect(g,cx-3,cy-20,6,38,base);vBox(g,cx-10,cy-28,20,10,m.trim,'#141c24');vRect(g,cx-6,cy-25,12,5,m.glow);}
  else if(H===2){vBox(g,cx-14,cy-12,13,30,base,'#12190f');vBox(g,cx+1,cy-8,13,26,'#394a2a','#12190f');vCir(g,cx-7,cy-12,4,m.glow);}
  else{vCir(g,cx-5,cy+4,14,'#4b3a22',m.trim,2);vCir(g,cx+9,cy-5,9,'#6a5230',m.trim,2);vCir(g,cx-5,cy+4,4,m.glow);}
 }else if(v===1){
  vBox(g,cx-13,cy-10,26,28,base,m.trim,1.5);vCir(g,cx,cy+2,6,'#162028',m.glow,1.5);vRect(g,cx-8,cy-15,16,5,H===2?'#7aa050':m.trim);
 }else{
  vCir(g,cx,cy+4,14,base,m.trim,2);vCir(g,cx,cy+4,6,m.glow+'aa');vRect(g,cx-10,cy-12,20,5,m.trim);
 }
}
function vDrawWater(g,H,w,m){
 const x=w.x*VT,y=w.y*VT,W=w.w*VT,Hh=w.h*VT,liq=['#4aa9d8','#4aa9d8','#6bd23a','#3ca2c8'][H];
 g.fillStyle='#00000066';g.beginPath();g.roundRect(x+3,y+7,W-6,Hh-4,18);g.fill();
 g.fillStyle=['#46505c','#46505c','#2d3a22','#4a3b28'][H];g.beginPath();g.roundRect(x+2,y+2,W-4,Hh-4,18);g.fill();
 const gr=g.createRadialGradient(x+W/2,y+Hh/2,6,x+W/2,y+Hh/2,Math.max(W,Hh)/2);gr.addColorStop(0,liq);gr.addColorStop(1,vShade(liq,-.32));
 g.fillStyle=gr;g.beginPath();g.roundRect(x+12,y+12,W-24,Hh-24,12);g.fill();
 if(H!==2){vCir(g,x+W/2,y+Hh/2,H===3?16:8,'#5a6672',m.trim,2);vCir(g,x+W/2,y+Hh/2,5,H===3?m.glow:'#d8f3ff');}
}
// R21: the painted buildings of Argon (four per village family) stand on the footprint instead of the flat boxes.
// Which of the four a service gets; plain houses alternate and mirror so a street never repeats itself.
const HOUSE_CELL=[{inn:0,smith:1,shop:2,house:[3,3]},{relic:0,smith:1,shop:2,info:3,house:[2,3]},{alchemist:0,smith:1,shop:2,info:2,house:[3,3]},{smith:0,shop:1,relic:2,info:3,house:[1,3]}];
export const villageFamily=id=>HID[id]??0;
// R22 (D68): every building stands on its own ground, never on a dark box. The lot is paved with the foundation stone of
// its district (LOT_TILE), edged by a raised kerb and joined to the street by a doorstep; a lot much wider than its building
// gets a second, smaller building of the same family beside it, and a back yard deeper than a tile gets street furniture.
const LOT_TILE=[1,1,6,4];
function vLotTile(g,env,d,m,x,y,tint){
 const t=LOT_TILE[d]??1,px=x*VT,py=y*VT;
 if(env?.naturalWidth)g.drawImage(env,t%4*128+(x%2)*64,(t>>2)*128+(y%2)*64,64,64,px,py,VT,VT);else vRect(g,px,py,VT,VT,vShade(m.plaza,.08));
 vRect(g,px,py,VT,VT,m.plaza+tint);
}
function vLotGround(g,b,v,env,d){
 const m=v.mood,px=b.x*VT,py=b.y*VT,W=b.w*VT,Hh=b.h*VT,hi=vShade(m.trim,-.3),lo=vShade(m.trim,-.55);
 for(let ty=0;ty<b.h;ty++)for(let tx=0;tx<b.w;tx++)vLotTile(g,env,d,m,b.x+tx,b.y+ty,'4d');
 vRect(g,px,py,W,5,hi);vRect(g,px,py,5,Hh,hi);vRect(g,px+W-5,py,5,Hh,lo);vRect(g,px,py+Hh-7,W,7,lo);vRect(g,px+5,py+5,W-10,2,'#ffffff1f');vRect(g,px+5,py+Hh-9,W-10,2,'#00000040');
 if(b.door){const dx=b.door.x*VT,dy=b.door.y*VT;vLotTile(g,env,d,m,b.door.x,b.door.y,'33');vRect(g,dx,dy,4,VT,lo);vRect(g,dx+VT-4,dy,4,VT,lo);vRect(g,dx+4,py+Hh-7,VT-8,7,vShade(m.trim,-.12));vRect(g,dx+4,py+Hh-7,VT-8,2,'#ffffff33');}
}
// Where each painted building of a lot goes: [cell, centre x, base y, width, height, mirrored]. Pure, so a test can check it.
export function lotPlan(b,H){
 const px=b.x*VT,py=b.y*VT,W=b.w*VT,Hh=b.h*VT,seed=b.x*31+b.y*17,map=HOUSE_CELL[H],pick=map[b.service],cell=pick??(b.letter==='K'&&H===3?2:map.house[seed%2]),[sw,sh]=VILLAGE_HOUSES[H][cell];
 const k=Math.min((W+20)/sw,(Hh+VT*1.3)/sh),dw=sw*k,dh=sh*k,flip=pick==null&&seed%3===0,free=W-dw,out=[];
 let side=null;
 if(free>=VT*1.4)for(const c of [0,1,2,3])if(c!==cell){const [w2,h2]=VILLAGE_HOUSES[H][c],k2=Math.min(k,(free+14)/w2);if(k2>=k*.7&&(!side||w2*k2>side[3]))side=[c,0,py+Hh-6,w2*k2,h2*k2,seed%2===1];}
 if(side){const total=dw+side[3]-10,x0=px+(W-total)/2,left=seed%2===0;side[1]=left?x0+total-side[3]/2:x0+side[3]/2;out.push(side,[cell,left?x0+dw/2:x0+total-dw/2,py+Hh+6,dw,dh,flip]);}
 else{const want=b.door?b.door.x*VT+32:px+W/2,lim=Math.max(0,free/2);out.push([cell,Math.max(px+W/2-lim,Math.min(px+W/2+lim,want)),py+Hh+6,dw,dh,flip]);}
 return out;
}
function vDrawHouse(g,b,v,H,houses,env,d){
 const px=b.x*VT,py=b.y*VT,W=b.w*VT,Hh=b.h*VT,plan=lotPlan(b,H),top=Math.min(...plan.map(q=>q[2]-q[4]));
 b.windows=[];b.chimneys=[];b.signs=[];
 vLotGround(g,b,v,env,d);
 if(top-py>=VT*.85){const yard=[{x:b.x,y:b.y},{x:b.x+b.w-1,y:b.y},...(b.w>=5?[{x:b.x+(b.w>>1),y:b.y}]:[])];for(const q of yard)vDrawProp(g,H,q,v.mood,null);}
 for(const [cell,cx,by,dw,dh,flip] of plan){
  const [sw,sh]=VILLAGE_HOUSES[H][cell];
  g.fillStyle='#00000059';g.beginPath();g.ellipse(cx,by-8,dw*.47,13,0,0,6.283);g.fill();
  g.save();g.imageSmoothingEnabled=false;g.translate(cx,by);if(flip)g.scale(-1,1);g.drawImage(houses,cell*512+(512-sw)/2,512-sh,sw,sh,-dw/2,-dh,dw,dh);g.restore();
 }
}
function vDrawBuilding(g,b,v,H,env,houses,d){
 if(houses){vDrawHouse(g,b,v,H,houses,env,d);return;}
 const m=v.mood,px=b.x*VT,py=b.y*VT,W=b.w*VT,Hh=b.h*VT,F=Math.min(100,Hh*.5+10),rH=Hh-F,kind=b.service||'house',seed=b.x*31+b.y*17,ar=seed%3,sh=(ar-1)*.05;
 b.windows=[];b.chimneys=[];b.signs=[];
 vRect(g,px+6,py+Hh-2,W,18,'#00000066');
 const rg=g.createLinearGradient(0,py-6,0,py+rH);rg.addColorStop(0,vShade(m.roof,.1+sh));rg.addColorStop(1,vShade(m.roof,-.08+sh));
 vRect(g,px-4,py-6,W+8,rH+6,rg);
 if(env?.naturalWidth){
  g.globalAlpha=.22;const rt=[0,2,7,6][H];
  for(let ty=py;ty<py+rH;ty+=64)for(let tx=px;tx<px+W;tx+=64)g.drawImage(env,rt%4*128,(rt>>2)*128,128,128,tx,ty,Math.min(64,px+W-tx),Math.min(64,py+rH-ty));
  g.globalAlpha=1;
 }
 if(H===0){
  for(let r=py+6;r<py+rH;r+=14)vLine(g,px-4,r,px+W+4,r,'#00000030');
  if(ar===0)vBox(g,px+14,py+10,Math.min(48,W-28),18,'#1d3142',m.trim+'88');
 }else if(H===1){
  for(let c=px+12;c<px+W;c+=20)vLine(g,c,py-6,c,py+rH,'#0000002c');
  vLine(g,px-4,py+rH*.45,px+W+4,py+rH*.45,m.trim+'66',2);
 }else if(H===2){
  for(let c=px;c<px+W;c+=16)vRect(g,c,py-4,8,rH+4,((c/16+ar)&1)?'#00000018':'#ffffff08');
  vBox(g,px+12+(ar*18)%(W-56),py+10,42,rH-20,['#4b6a2e','#6a4e28','#2c4838'][ar],'#141c10');
 }else{
  vBox(g,px+4,py+2,W-8,rH-8,0,m.trim+'55',1.5);
  for(let c=px+28;c<px+W-16;c+=36)vLine(g,c,py-4,c,py+rH,'#00000038',1.5);
  if(ar===0)vCir(g,px+28,py+rH*.5,11,'#3a2d1e',m.trim,2);
 }
 vRect(g,px-4,py-6,W+8,4,vShade(m.trim,-.05));vRect(g,px-4,py+rH-3,W+8,5,'#0a1118');
 vRect(g,px,py+rH,W,F,vShade(m.wall,sh));
 if(H===1)for(let c=px+16;c<px+W;c+=32)vRect(g,c,py+rH,4,F,'#00000022');
 else if(H===3)for(let c=px+20;c<px+W;c+=40)vLine(g,c,py+rH,c,py+Hh,m.trim+'44',2);
 else{for(let r=py+rH+10;r<py+Hh;r+=14)vLine(g,px,r,px+W,r,'#00000028');if(H===2)vRect(g,px+W-18,py+rH,6,F,'#4c7032');}
 vRect(g,px,py+rH,W,3,vShade(m.trim,-.2));vRect(g,px,py+Hh-6,W,6,'#0a1118');
 if(kind==='inn'||kind==='house'||kind==='smith'||kind==='shop'){
  const n=kind==='smith'?1:b.w>5?2:ar===2?0:1;
  for(let i=0;i<n;i++){const cx=px+W*(n===1?.72:i?.78:.2),cy=py+10;vRect(g,cx-10,cy,20,rH*.55,'#2a2a30');vRect(g,cx-13,cy-4,26,6,'#3a3a42');b.chimneys.push({x:cx,y:cy-4,hot:kind==='smith'||H===3});}
  if(kind==='inn'){g.strokeStyle='#ffd28a';g.lineWidth=2;g.beginPath();g.moveTo(px+14,py+rH-10);for(let i=1;i<=b.w;i++)g.quadraticCurveTo(px+14+(i-.5)*(W-28)/b.w,py+rH+4,px+14+i*(W-28)/b.w,py+rH-10);g.stroke();}
 }
 if(kind==='shop')for(let i=0;i<b.w*2;i++)vRect(g,px+i*32,py+rH+3,32,18,i%2?m.trim:vShade(m.trim,-.28));
 if(kind==='relic')vCir(g,px+W/2,py+rH*.42,Math.min(26,rH*.35),m.glow+'55',m.trim,3);
 if(kind==='info'){const cx=px+W/2,cy=py+rH*.42;vRect(g,cx-2,cy-24,4,34,'#3a4650');vCir(g,cx,cy-24,10,0,m.trim,2);}
 if(kind==='alchemist')for(let i=0;i<3;i++){const cx=px+18+i*28;vCir(g,cx,py+rH*.5,11,['#6bd23a','#c28bff','#ffd25a'][i]+'cc');vRect(g,cx-3,py+rH*.5-20,6,10,'#cfd6dc');}
 if(b.letter==='N'){
  for(const tx of [px+8,px+W-88]){vRect(g,tx,py-34,80,rH+34,vShade(m.wall,.05));vRect(g,tx,py-34,80,6,m.trim);g.fillStyle=vShade(m.roof,.16);g.beginPath();g.moveTo(tx-6,py-34);gLine(g,tx+40,py-86,tx+86,py-34);vRect(g,tx+34,py-12,12,26,m.glow);}
  const cx=px+W/2,cy=py+rH*.52;vCir(g,cx,cy,30,m.glow+'88',m.trim,3);
  for(let a=0;a<13;a++)vLine(g,cx,cy,cx+Math.cos(a*.483)*30,cy+Math.sin(a*.483)*30,m.trim,1.5);
 }
 if(b.letter==='K'){
  const cx=px+W/2,cy=py+rH*.5,r=Math.min(W,rH)*.38;vCir(g,cx,cy,r,'#e8dcc0',m.trim,5);
  for(let i=0;i<12;i++){const a=i*.5236;vLine(g,cx+Math.cos(a)*(r-9),cy+Math.sin(a)*(r-9),cx+Math.cos(a)*(r-3),cy+Math.sin(a)*(r-3),'#4a3a22',2);}
  b.clock={x:cx,y:cy,r};
 }
 const wW=H===1?18:22,wH=H===2?24:30,wy=py+rH+14,u=W-20,cnt=Math.max(1,(u/52)|0),st=u/cnt;
 for(let i=0;i<cnt;i++){
  const wx=px+10+st*i+(st-wW)/2;if(Math.abs(wx+wW/2-(b.door.x*VT+32))<34)continue;
  vRect(g,wx-3,wy-3,wW+6,wH+6,'#0a1118');vRect(g,wx,wy,wW,wH,m.glow+'bb');
  if(H===1)vCir(g,wx+wW/2,wy+2,wW/2,m.glow+'cc','#0a1118',2);
  vRect(g,wx+wW/2-1,wy,2,wH,'#0a1118cc');vRect(g,wx,wy+wH/2-1,wW,2,'#0a1118cc');
  b.windows.push({x:wx,y:wy,w:wW,h:wH,phase:vHash(seed,i)*6.28,speed:.8+vHash(seed,i,9)*1.6});
 }
 const dx=b.door.x*VT+32,dy=py+Hh;
 if(!b.house){
  vRect(g,dx-26,dy-72,52,72,'#0a1118');vRect(g,dx-22,dy-68,44,68,vShade(m.wall,-.12));vRect(g,dx-18,dy-62,36,62,m.glow+'aa');vRect(g,dx-1,dy-62,2,62,'#0a1118aa');
  vBox(g,dx-32,dy-80,64,10,m.trim,vShade(m.trim,-.3),1.5);vRect(g,dx-30,dy-4,60,4,'#1a2530');vRect(g,dx-36,dy,72,5,'#141d27');
  vBox(g,dx-26,dy-104,52,22,'#0a1118ee',m.trim,2);V_ICON[kind]?.(g,dx,dy-93,m.trim);b.signs.push({x:dx,y:dy-93});
 }else{
  vRect(g,dx-20,dy-58,40,58,'#0a1118');vRect(g,dx-16,dy-54,32,54,vShade(m.wall,-.18));
  if(H===1)vCir(g,dx,dy-54,16,vShade(m.wall,-.18),'#0a1118',3);
  else if(H===2)vRect(g,dx-16,dy-56,32,6,m.trim);
  vRect(g,dx-1,dy-54,2,54,'#00000066');vRect(g,dx+8,dy-30,4,4,m.trim+'88');vRect(g,dx-26,dy-4,52,4,'#1a2530');
 }
}
export function bakeVillage(g,v,id,env,d,bg,props=null){
 const N=24,S=N*VT,m=v.mood,H=HID[id]??0,propSet=new Set(v.props.map(p=>p.y*N+p.x));
 if(bg?.naturalWidth===S&&bg?.naturalHeight===S){g.drawImage(bg,0,0,S,S);return;}
 vRect(g,0,0,S,S,'#0d1520');
 const open=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&(v.cells[y*N+x]===1||propSet.has(y*N+x));
 const houses=props?.naturalWidth===2048?props:null,lots=houses?new Set(v.buildings.flatMap(b=>Array.from({length:b.w*b.h},(_,i)=>(b.y+(i/b.w|0))*N+b.x+i%b.w))):null;
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){
  const px=x*VT,py=y*VT;
  if(open(x,y)){
   vFloorTile(g,env,d,px,py,m,v.plaza[y*N+x]===1,x,y,H);
   for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]])if(!open(x+dx,y+dy)){
    if(lots?.has((y+dy)*N+x+dx)){vRect(g,px+(dx>0?58:0),py+(dy>0?58:0),dx?6:VT,dy?6:VT,dy<0?'#00000047':'#00000026');continue;}
    vRect(g,px+(dx>0?54:0),py+(dy>0?54:0),dx?10:VT,dy?10:VT,'#080e16');
    vRect(g,px+(dx>0?57:dx<0?2:0),py+(dy>0?57:dy<0?2:0),dx?5:VT,dy?5:VT,vShade(m.trim,-.25));
   }
  }else if(lots?.has(y*N+x)){
  }else{
   if(bg?.naturalWidth){const iw=bg.naturalWidth,ih=bg.naturalHeight;g.drawImage(bg,(x<12?0:iw*.64)+(x%6)*iw*.055,(y<12?0:ih*.64)+(y%6)*ih*.055,iw*.055,ih*.055,px,py,VT,VT);}
   vRect(g,px,py,VT,VT,vShade(m.roof,-.16)+(bg?.naturalWidth?'a8':'f0'));
   for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]])if(open(x+dx,y+dy))vRect(g,px+(dx>0?58:0),py+(dy>0?58:0),dx?6:VT,dy?6:VT,vShade(m.trim,-.15));
  }
 }
 const pc=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(v.plaza[y*N+x])pc.push([x,y]);
 if(pc.length){
  const xs=pc.map(c=>c[0]),ys=pc.map(c=>c[1]),cx=(Math.min(...xs)+Math.max(...xs)+1)/2*VT,cy=(Math.min(...ys)+Math.max(...ys)+1)/2*VT;
  const n=[8,13,8,16][H],r1=[44,28,48,62][H],r2=[104,98,92,102][H];
  vCir(g,cx,cy,96,'#18223055',m.trim+'66',3);vCir(g,cx,cy,r1,'#222c3c66',m.glow+'66',2);
  for(let i=0;i<n;i++){const a=i*6.283/n;vLine(g,cx+Math.cos(a)*r1,cy+Math.sin(a)*r1,cx+Math.cos(a)*r2,cy+Math.sin(a)*r2,m.trim+'77',H===3?4:2);}
 }
 for(const w of v.water)vDrawWater(g,H,w,m);
 for(const p of v.props)vDrawProp(g,H,p,m,props);
 for(const b of [...v.buildings].sort((a,c)=>a.y-c.y))vDrawBuilding(g,b,v,H,env,houses,d);
 g.globalCompositeOperation='soft-light';g.globalAlpha=.16;vRect(g,0,0,S,S,m.trim);g.globalAlpha=1;g.globalCompositeOperation='source-over';
}
export function drawVillageLife(ctx,t,v,player,{reduced:red=false,label=null}={}){
 const m=v.mood,H=HID[v.id]??0;ctx.save();
 for(const b of v.buildings){
  const bx=b.x*VT,by=b.y*VT,W=b.w*VT,Hh=b.h*VT;
  if(b.windows?.length){
   for(const w of b.windows){const a=red?.35:.14+.2*(.5+.5*Math.sin(t*w.speed+w.phase))+(Math.sin(t*7+w.phase*3)>.96?.18:0);vRect(ctx,w.x,w.y,w.w,w.h,`rgba(255,226,160,${a})`);}
  }else if(!red){
   // Ambient window & lantern warm shimmer for painted/full-image hubs (e.g. Moon / vDrawHouse)
   const gx=bx+W*.5,gy=by+Hh*.68,pulse=.12+.10*Math.sin(t*2.4+bx*.03);
   vCir(ctx,gx,gy,22,H===2?`rgba(130,245,110,${pulse})`:`rgba(255,214,140,${pulse})`);
  }
  if(b.chimneys?.length){
   for(const [i,c] of b.chimneys.entries())if(!red)for(let k=0;k<4;k++){const ph=((t*.35+k/4+i*.31)%1);vCir(ctx,c.x+Math.sin(ph*6+k+i)*9+ph*14,c.y-ph*70,5+ph*13,c.hot?`rgba(255,150,80,${.3*(1-ph)})`:`rgba(210,220,230,${.26*(1-ph)})`);}
  }else if(!red&&(b.service||b.x%2===0)){
   const cx=bx+W*.72,cy=by+10;
   for(let k=0;k<3;k++){const ph=((t*.28+k/3+bx*.01)%1);vCir(ctx,cx+Math.sin(ph*5+k)*8+ph*12,cy-ph*54,4+ph*10,b.service==='smith'||H===3?`rgba(255,155,80,${.24*(1-ph)})`:`rgba(205,222,235,${.2*(1-ph)})`);}
  }
  if(b.clock&&!red){const sc=t%60,mn=(t/60)%60,hr=(t/720)%12,c=b.clock;ctx.lineCap='round';
   for(const [ang,len,wd] of [[hr/12*6.283,c.r*.5,5],[mn/60*6.283,c.r*.75,3]])vLine(ctx,c.x,c.y,c.x+Math.sin(ang)*len,c.y-Math.cos(ang)*len,'#2a1f12',wd);
   vLine(ctx,c.x,c.y,c.x+Math.sin(sc*.6283)*c.r*.85,c.y-Math.cos(sc*.6283)*c.r*.85,'#c2412d',2);}
  for(const s of b.signs||[]){ctx.globalAlpha=red?.15:.1+.1*Math.sin(t*2+s.x);vCir(ctx,s.x,s.y,26,m.glow);ctx.globalAlpha=1;}
 }
 // Animated plaza hearth/gears on town square regardless of baked art style
 if(!red&&v.plaza?.length){
  let sx=0,sy=0,cnt=0;
  for(let y=0;y<24;y++)for(let x=0;x<24;x++)if(v.plaza[y*24+x]){sx+=(x+.5)*VT;sy+=(y+.5)*VT;cnt++;}
  if(cnt){
   const pcx=sx/cnt,pcy=sy/cnt;
   ctx.strokeStyle=m.glow+'44';ctx.lineWidth=2;
   ctx.beginPath();ctx.arc(pcx,pcy,64+Math.sin(t*2.1)*6,t*.4,t*.4+Math.PI*1.3);ctx.stroke();
   if(H===3){ctx.beginPath();ctx.arc(pcx,pcy,38,-t*.8,-t*.8+Math.PI*1.4);ctx.stroke();}
  }
 }
 for(const p of v.props||[])if(!red){
  const cx=p.x*VT+32,cy=p.y*VT+32,kind=(p.x*7+p.y*13)%3,pulse=.5+.5*Math.sin(t*3.2+p.x*1.7+p.y);
  if(kind===0){ctx.globalAlpha=.14+.12*pulse;vCir(ctx,cx,cy-22,18+pulse*6,m.glow);ctx.globalAlpha=1;}
  else if(kind===1){const sway=Math.sin(t*2.6+p.x)*3;vLine(ctx,cx-10,cy-14,cx+10+sway,cy-14,m.trim,2);}
  else if(H===3){const ang=t*1.8+(p.x+p.y);for(let k=0;k<4;k++){const a=ang+k*1.57;vLine(ctx,cx+Math.cos(a)*4,cy+4+Math.sin(a)*4,cx+Math.cos(a)*12,cy+4+Math.sin(a)*12,m.trim,2);}}
  else{const ph=(t*.7+p.x*.23)%1;vCir(ctx,cx,cy+4-ph*18,2+ph*3,0,m.glow+'88',1.5);}
 }
 for(const w of v.water)if(!red){const x=w.x*VT,y=w.y*VT,W=w.w*VT,Hh=w.h*VT;
  if(H===2)for(let k=0;k<7;k++){const ph=(t*.5+k*.37)%1;vCir(ctx,x+20+vHash(k,3)*(W-40),y+Hh-18-ph*(Hh-30),3+ph*5,0,`rgba(190,255,140,${.7*(1-ph)})`,2);}
  else{for(let k=0;k<6;k++){const ph=(t*.8+k/6)%1,a=ph*6.283+k;vRect(ctx,x+W/2+Math.cos(a)*ph*(W/2-18)-1,y+Hh/2+Math.sin(a)*ph*(Hh/2-18)-1,3,3,`rgba(220,245,255,${.8*(1-ph)})`);}
   vCir(ctx,x+W/2,y+Hh/2,10+((t*14)%24),0,`rgba(255,255,255,${.25+.15*Math.sin(t*3)})`,2);}
 }
 // Ambient living district atmosphere (sea mist, stained-glass motes, spores, ozone sparks)
 if(!red){
  const col=H===0?'#9ee8ff44':H===1?'#e2b8ff44':H===2?'#9aff7855':'#ffd67a55';
  for(let i=0;i<18;i++){
   const mx=((i*197+t*(18+(i%5)*6))%1500)+18,my=((i*139+Math.sin(t*1.4+i)*26+(H===1?t*10:-t*8))%1500+1500)%1500;
   if(H===3&&(i%4===0)){ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(mx-4,my);ctx.lineTo(mx+4,my);ctx.moveTo(mx,my-4);ctx.lineTo(mx,my+4);ctx.stroke();}
   else vCir(ctx,mx,my,1.8+(i%3)*.8,col);
  }
  for(let b=0;b<4;b++){
   const bx=((t*(38+b*9)+b*390)%1640)-50,by=110+b*320+Math.sin(t*1.9+b*2.1)*18,wing=Math.sin(t*11+b*2)*4;
   if(H<=1){ctx.strokeStyle='#dceeffaa';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx-8,by+wing);ctx.quadraticCurveTo(bx-3,by-4,bx,by);ctx.quadraticCurveTo(bx+3,by-4,bx+8,by+wing);ctx.stroke();}
   else{vCir(ctx,bx,by,3.2,'#0c1622');vCir(ctx,bx,by,2,H===2?'#9aff78cc':'#6bddffcc');}
  }
 }
 for(const b of v.buildings){if(b.house||!player)continue;
  const dx=b.door.x*VT+32,dy=b.door.y*VT+32,d=Math.hypot(player.x-dx,player.y-dy);
  if(d<150){const k=1-Math.max(0,d-60)/90,r=ctx.createRadialGradient(dx,dy-30,4,dx,dy-30,90);r.addColorStop(0,`rgba(255,226,160,${.38*k})`);r.addColorStop(1,'rgba(255,226,160,0)');vRect(ctx,dx-100,dy-130,200,200,r);
   const bob=red?0:Math.sin(t*5)*4,p1=red?1:.55+.45*Math.sin(t*6),p2=red?1:.55+.45*Math.sin(t*6-1.1);
   vCir(ctx,dx-7,dy-56+bob,3,`rgba(125,255,208,${(.45+.5*k)*p1})`);vCir(ctx,dx+7,dy-56+bob,3,`rgba(125,255,208,${(.45+.5*k)*p2})`);
   ctx.fillStyle=`rgba(255,240,200,${.55+.4*k})`;ctx.beginPath();ctx.moveTo(dx-10,dy-34+bob);gLine(ctx,dx+10,dy-34+bob,dx,dy-20+bob);
   if(label&&d<120)label('ENTRA',dx,dy-42+bob,'#fff3d2',13);}
 }
 ctx.restore();
}
function gLine(c,x1,y1,x2,y2){c.lineTo(x1,y1);c.lineTo(x2,y2);c.fill();}

// AAA Third-Person Chronos Architectural Interior Room Diorama with Characters Inside (NPC + Nox & Lulù)
const ROOM_THEMES={
 moon:{wall:'#1a2432',wallHi:'#263549',floor:'#231c18',plank:'#31261f',trim:'#e0a858',glow:'#ffcf7a',win:'#58b8ff'},
 cathedral:{wall:'#221e30',wallHi:'#312b46',floor:'#1d1928',plank:'#2a2438',trim:'#d8b8ff',glow:'#9fe9ff',win:'#a58cff'},
 toxic:{wall:'#19261c',wallHi:'#243828',floor:'#1a2018',plank:'#252e22',trim:'#82e058',glow:'#a8ff78',win:'#6bd23a'},
 clockwork:{wall:'#2a2018',wallHi:'#3c2e22',floor:'#221a14',plank:'#33261d',trim:'#f0b254',glow:'#ffd88a',win:'#ffae52'}
};
function drawMiniHero(g,im,row,col,x,y,size,flip){
 if(!im?.naturalWidth)return;
 const cw=im.naturalWidth/4,ch=im.naturalHeight/4;
 g.save();g.imageSmoothingEnabled=false;g.translate(Math.round(x),Math.round(y));if(flip)g.scale(-1,1);
 g.drawImage(im,col*cw,row*ch,cw,ch,-size/2,-size*.92,size,size);g.restore();
}
export function drawChronosInteriorRoom(g,cw,ch,s,tint,ts,speaking,talk,npcImg,anim,drawChronoFrame,images,hero='nox',reduced=false){
 const H=HID[s.hubId]??0,th=ROOM_THEMES[['moon','cathedral','toxic','clockwork'][H]]||ROOM_THEMES.moon;
 const noxImg=images?.nox_walk,luluImg=images?.lulu_walk;
 const srv=s.service||(s.kind==='person'?'street':'shop'),flY=Math.round(ch*.52);
 g.save();g.imageSmoothingEnabled=false;
 // 1. Back Wall & Perspective Side Cutaway Walls
 const wg=g.createLinearGradient(0,0,0,flY);wg.addColorStop(0,vShade(th.wall,-.25));wg.addColorStop(1,th.wallHi);
 vRect(g,0,0,cw,flY,wg);
 // Stone/Panel courses on the back wall
 for(let y=18;y<flY-8;y+=22){
  vLine(g,24,y,cw-24,y,'#00000038',1);
  for(let x=28+((y/22|0)%2)*36;x<cw-32;x+=72)vLine(g,x,y,x,Math.min(flY-8,y+22),'#0000002c',1);
 }
 // Side cutaway structural pillars
 vBox(g,0,0,26,ch,vShade(th.wall,-.35),th.trim+'66',1.5);
 vBox(g,cw-26,0,26,ch,vShade(th.wall,-.35),th.trim+'66',1.5);
 // Ceiling rafters & hanging Chronos lanterns
 vRect(g,0,0,cw,14,vShade(th.wall,-.45));
 for(let x=44;x<cw-30;x+=84)vRect(g,x-5,0,10,flY,vShade(th.wall,-.2));
 // 2. Perspective Planks / Stone Tile Floor & Runner Rug
 const fg=g.createLinearGradient(0,flY,0,ch);fg.addColorStop(0,vShade(th.floor,-.15));fg.addColorStop(1,th.plank);
 vRect(g,26,flY,cw-52,ch-flY,fg);
 vRect(g,24,flY-4,cw-48,6,vShade(th.trim,-.35));
 for(let r=1;r<=6;r++){
  const py=flY+Math.pow(r/6,1.25)*(ch-flY);
  vLine(g,26,py,cw-26,py,'#00000044',1);
 }
 for(let i=-4;i<=4;i++){
  vLine(g,cw/2+i*34,flY+2,cw/2+i*76,ch,'#00000030',1);
 }
 // Woven district runner carpet leading from threshold to counter
 g.fillStyle=vShade(tint||th.trim,-.42)+'cc';
 g.beginPath();g.moveTo(cw*.34,flY+28);g.lineTo(cw*.66,flY+28);g.lineTo(cw*.78,ch);g.lineTo(cw*.22,ch);g.closePath();g.fill();
 g.strokeStyle=th.trim+'aa';g.lineWidth=2;g.stroke();
 // 3. Arched Windows & Volumetric Light Beams
 for(const wx of [cw*.22,cw*.78]){
  const wy=26,ww=42,wh=62;
  vBox(g,wx-ww/2-3,wy-3,ww+6,wh+6,'#090e16',th.trim+'88',1.5);
  vRect(g,wx-ww/2,wy,ww,wh,th.win+'44');
  vCir(g,wx,wy+6,ww/2-2,th.win+'33',th.trim+'66',1);
  vLine(g,wx,wy,wx,wy+wh,'#090e16',2);vLine(g,wx-ww/2,wy+wh*.5,wx+ww/2,wy+wh*.5,'#090e16',2);
  const lg=g.createLinearGradient(wx,wy+wh,wx+(wx<cw/2?35:-35),flY+55);
  lg.addColorStop(0,th.glow+'30');lg.addColorStop(1,'#00000000');
  g.fillStyle=lg;g.beginPath();g.moveTo(wx-ww/2,wy+wh);g.lineTo(wx+ww/2,wy+wh);g.lineTo(wx+ww/2+(wx<cw/2?50:-10),flY+55);g.lineTo(wx-ww/2+(wx<cw/2?10:-50),flY+55);g.closePath();g.fill();
 }
 // 4. Service-Specific Back-Wall Props (Behind the Shopkeeper)
 const cx=cw*.5,cy=flY+8;
 if(srv==='shop'){
  // Salvaged shelves, weapon rack & Nadia's elevator-door paneling
  for(const sx of [cx-92,cx+44]){
   vBox(g,sx,28,48,flY-32,'#161f2b',th.trim+'77',1.5);
   for(let sy=46;sy<flY-12;sy+=20){
    vRect(g,sx+3,sy,42,3,th.trim+'88');
    vBox(g,sx+6,sy-11,12,11,'#3b566e','#8ce9ff88',1);
    vBox(g,sx+22,sy-9,16,9,'#70482e',th.glow+'88',1);
   }
  }
  // Center salvaged elevator door frame behind Nadia/merchant
  vBox(g,cx-38,22,76,flY-24,'#1c2735',th.trim,2);
  vLine(g,cx,22,cx,flY-2,'#090f16',2);
  vCir(g,cx,18,8,'#101822',th.glow,1.5);
 }else if(srv==='smith'){
  // Roaring brick blast furnace on left + weapon rack on right
  vBox(g,36,20,76,flY-20,'#2c1c18',th.trim+'88',2);
  const flicker=reduced?.8:.65+.35*Math.sin(ts*11);
  vCir(g,74,flY-22,22,`rgba(255,110,32,${flicker})`,'#ffcf6a',2);
  vCir(g,74,flY-20,12,'#fff3b0');
  vBox(g,cw-114,28,74,56,'#16202a',th.trim+'88',1.5);
  for(let i=0;i<4;i++)vRect(g,cw-104+i*16,36,5,40,'#9ec5d8');
 }else if(srv==='inn'){
  // Cast-iron hearth & tavern shelves with bottles/mugs
  vBox(g,40,26,64,flY-26,'#241a16',th.trim+'88',1.5);
  vCir(g,72,flY-22,16,'#ff8a36cc','#ffd27a',1.5);
  vBox(g,cx-48,26,96,48,'#291d16',th.trim+'77',1.5);
  for(let i=0;i<6;i++)vRect(g,cx-40+i*15,34,8,16,i%2?'#6bd23a':'#ff9c52');
 }else if(srv==='alchemist'){
  // Bioluminescent distillation vats
  for(const [i,vx] of [56,cx,cw-56].entries()){
   if(i===1)continue;
   const col=['#6bd23a','#38f0d8','#c28bff'][i];
   vBox(g,vx-20,24,40,flY-28,'#10201c',col,1.5);
   vRect(g,vx-16,32,32,flY-42,col+'44');
   if(!reduced)for(let b=0;b<4;b++){const by=flY-16-((ts*28+b*18)%(flY-48));vCir(g,vx-6+(b%3)*6,by,3,col+'cc');}
  }
 }else if(srv==='relic'){
  // Rotating Chronos Astrolabe behind keeper
  const ang=reduced?0:ts*.7;
  vCir(g,cx,flY*.52,44,'#121828aa',th.trim,2.5);
  vCir(g,cx,flY*.52,28,0,th.glow+'aa',1.5);
  for(let k=0;k<6;k++){const a=ang+k*1.047;vLine(g,cx,flY*.52,cx+Math.cos(a)*42,flY*.52+Math.sin(a)*42,th.trim+'99',1.5);}
 }else if(srv==='info'){
  // Telemetry CRT bank & district holomap
  vBox(g,42,24,cw-84,flY-32,'#0c1824',th.win+'99',1.5);
  for(let i=0;i<3;i++){
   const sx=54+i*((cw-108)/3);
   vBox(g,sx,32,48,32,'#07121c',th.glow+'88',1);
   vLine(g,sx+4,48,sx+44,48+Math.sin(ts*4+i)*8,th.glow,1.5);
  }
 }
 // 5. Shopkeeper / NPC Standing Inside the Structure (Behind the Counter)
 const npcX=cx,npcY=flY+20+talk*.5;
 g.fillStyle='#00000077';g.beginPath();g.ellipse(npcX,npcY-2,28,10,0,0,Math.PI*2);g.fill();
 if(npcImg&&anim&&drawChronoFrame){
  drawChronoFrame(g,npcImg,anim,reduced?0:ts,npcX,npcY+4,Math.min(138,ch*.52),false,reduced);
 }
 // 6. Foreground Architectural Counter / Anvil / Table (Between Shopkeeper and Heroes!)
 if(srv!=='street'){
  const cwW=Math.min(220,cw*.56),cwH=34,cx0=cx-cwW/2,cy0=flY+10;
  // Counter shadow
  vRect(g,cx0-4,cy0+cwH-2,cwW+8,10,'#00000066');
  // Salvaged elevator door / carved counter body
  vBox(g,cx0,cy0,cwW,cwH,srv==='shop'?'#26384a':srv==='smith'?'#2c2420':'#38281e',th.trim,2);
  vRect(g,cx0-4,cy0-4,cwW+8,7,vShade(th.trim,-.15));
  for(let px=cx0+22;px<cx0+cwW-12;px+=32)vBox(g,px-8,cy0+6,16,cwH-10,'#00000028',th.trim+'55',1);
  // Props on top of the counter
  if(srv==='shop'){
   // Nadia's brass scale, salvaged battery & toolkit
   vBox(g,cx0+14,cy0-14,22,12,'#7c4d2b',th.trim,1);
   vBox(g,cx0+cwW-34,cy0-16,18,14,'#1c3448','#69f0ff',1.5);
   vCir(g,cx+38,cy0-8,6,th.glow);
  }else if(srv==='smith'){
   // Heavy steel anvil & glowing ingot
   vBox(g,cx-22,cy0-14,44,12,'#4a5664','#9eb4c8',1.5);
   vRect(g,cx-8,cy0-18,16,4,'#ff9436');
  }else if(srv==='inn'){
   // Steaming mugs & warm lantern
   for(const mx of [cx-34,cx+24]){
    vBox(g,mx,cy0-12,10,10,'#d89c52','#fff0c8',1);
    if(!reduced){const sy=cy0-16-((ts*14)%12);vCir(g,mx+5+Math.sin(ts*5+mx)*2,sy,2.5,'#ffffff66');}
   }
  }
 }
 // 7. Nox & Lulù Standing Inside the Structure in Third-Person (Facing the Shopkeeper!)
 const bobN=reduced?0:Math.sin(ts*3.4)*2,bobL=reduced?0:Math.sin(ts*3.4+1.2)*2;
 const nx=cw*.27,ny=ch-14+bobN,lx=cw*.73,ly=ch-12+bobL,hFrame=reduced?0:Math.floor(ts*2.2)%2;
 g.fillStyle='#00000070';
 g.beginPath();g.ellipse(nx,ch-16,22,8,0,0,Math.PI*2);g.fill();
 g.beginPath();g.ellipse(lx,ch-14,20,8,0,0,Math.PI*2);g.fill();
 // Row 1 of walk sheet is facing UP (towards the shopkeeper & counter!)
 drawMiniHero(g,noxImg,1,hFrame,nx,ny,hero==='lulu'?78:88,false);
 drawMiniHero(g,luluImg,1,hFrame,lx,ly,hero==='lulu'?86:76,true);
 // Subtle character name tags and speaking indicator
 g.font='700 10px system-ui';g.textAlign='center';
 g.fillStyle='#06101acc';vRect(g,npcX-48,14,96,16,'#06101acc');
 g.strokeStyle=speaking?'#ffe39a':th.trim+'aa';g.lineWidth=1;g.strokeRect(npcX-48,14,96,16);
 g.fillStyle=speaking?'#ffe39a':'#e9f5ff';g.fillText((s.npc||'CUSTODE').toUpperCase(),npcX,25);
 // Overhead hanging lantern glow & floating dust motes
 if(!reduced){
  for(let i=0;i<8;i++){
   const mx=40+((i*73+ts*12)%(cw-80)),my=24+((i*47+Math.sin(ts*1.5+i)*18)%(ch-50));
   vCir(g,mx,my,1.5,th.glow+'66');
  }
 }
 g.restore();
}

// Mission 3 (app_breach & breach) + Bone Tyrant (bone_tyrant): 3D-Depth Interactive Armored Breach Gate & Gothic Entrance Arch
export function drawBreachDoor3D(ctx,s,pass='base',reduced=false){
 if(!s||!['app_breach','breach','bone_tyrant'].includes(s.mission))return;
 if(s.mission==='bone_tyrant'){
  // Logical 3D Gothic Cathedral Entrance Archway at the player spawn (x:768, y:1360) so the entrance has true depth and torches
  const dx=768,dy=1365,dw=184,dh=104,flick=reduced?.85:.7+.3*Math.sin(s.time*9);
  ctx.save();
  if(pass==='base'){
   // Extended stone causeway threshold over the bottom seam so nothing looks cut off or repeated
   ctx.fillStyle='#1b1815';ctx.fillRect(dx-dw/2-24,dy-18,dw+48,180);
   for(let r=0;r<4;r++)for(let c=-2;c<=2;c++){
    vBox(ctx,dx+c*34-16,dy+r*36-10,32,34,((r+c)&1)?'#2c2722':'#24201c','#12100e',1);
   }
  }else{
   // Overhead 3D Gothic Stone Archway & Iron Portcullis (drawn AFTER characters so Nox & Lulù walk under the arch!)
   for(const sx of [dx-dw/2-18,dx+dw/2-10]){
    vBox(ctx,sx,dy-dh-14,28,dh+32,'#2d2823','#6e6254',2);
    // Warm burning cathedral braziers flanking the entrance
    vCir(ctx,sx+14,dy-dh+8,9*flick,'#ff8a3688');
    vCir(ctx,sx+14,dy-dh+8,4.5,'#ffe39a');
   }
   ctx.fillStyle='#06050499';ctx.fillRect(dx-dw/2,dy-dh+10,dw,20);
   vBox(ctx,dx-dw/2-22,dy-dh-22,dw+44,24,'#38312b','#8c7c68',2);
   worldText(ctx,'PORTALE DELLA NAVATA · CATTEDRALE D’OSSA',dx,dy-dh-6,'#e6cfa3',11);
  }
  ctx.restore();
  return;
 }
 const onCount=s.nodes?s.nodes.filter(n=>n.on).length:0,total=Math.max(1,s.nodes?.length||3);
 const openRatio=Math.min(1,onCount/total+(s.breachDoorOpen?1:0));
 const doors=s.mission==='app_breach'?[
  {x:768,y:1236,w:176,h:96,label:'PORTA SUD · VARCO CORAZZATO',main:true},
  {x:768,y:214,w:156,h:88,label:'BRECCIA NORD · ACCESSO BUNKER',main:false}
 ]:[{x:768,y:640,w:168,h:92,label:'PARATIA DELLA BRECCIA',main:true}];
 ctx.save();
 for(const d of doors){
  const slide=Math.round(openRatio*(d.w*.36)),pulse=reduced?.7:.55+.45*Math.sin(s.time*5);
  const col=openRatio>=1?'#7dffd0':onCount>0?'#ffcf5a':'#ff5a6e';
  if(pass==='base'){
   ctx.fillStyle='#05080fcc';ctx.fillRect(d.x-d.w/2-12,d.y-26,d.w+24,48);
   ctx.fillStyle='#1b2634';ctx.fillRect(d.x-d.w/2-8,d.y-20,d.w+16,36);
   ctx.strokeStyle='#395068';ctx.lineWidth=2;ctx.strokeRect(d.x-d.w/2-8,d.y-20,d.w+16,36);
   ctx.fillStyle='#e0a04055';
   for(let x=d.x-d.w/2;x<d.x+d.w/2-8;x+=20)ctx.fillRect(x,d.y+6,10,6);
   const leafW=Math.max(14,Math.round(d.w*.46)-slide);
   for(const [side,lx] of [[-1,d.x-d.w/2],[1,d.x+d.w/2-leafW]]){
    ctx.fillStyle='#243344';ctx.fillRect(lx,d.y-58,leafW,68);
    ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.strokeRect(lx,d.y-58,leafW,68);
    ctx.fillStyle='#131d28';ctx.fillRect(lx+4,d.y-48,Math.max(4,leafW-8),46);
    ctx.fillStyle=col+'aa';ctx.fillRect(side<0?lx+leafW-8:lx+2,d.y-34,6,22);
   }
   const dist=Math.hypot(s.x-d.x,s.y-d.y);
   if(dist<170){
    ctx.strokeStyle=col;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(d.x,d.y+12,56,22,0,0,Math.PI*2);ctx.stroke();
   }
  }else{
   for(const px of [d.x-d.w/2-18,d.x+d.w/2-10]){
    ctx.fillStyle='#1a2432';ctx.fillRect(px,d.y-d.h-18,28,d.h+28);
    ctx.strokeStyle='#496580';ctx.lineWidth=2;ctx.strokeRect(px,d.y-d.h-18,28,d.h+28);
    ctx.fillStyle=col;ctx.beginPath();ctx.arc(px+14,d.y-d.h+4,5*pulse+2,0,Math.PI*2);ctx.fill();
   }
   ctx.fillStyle='#04081088';ctx.fillRect(d.x-d.w/2,d.y-d.h+12,d.w,22);
   ctx.fillStyle='#223042';ctx.fillRect(d.x-d.w/2-20,d.y-d.h-22,d.w+40,28);
   ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.strokeRect(d.x-d.w/2-20,d.y-d.h-22,d.w+40,28);
   for(let i=0;i<total;i++){
    const sx=d.x-36+i*26,on=i<onCount||s.breachDoorOpen;
    ctx.fillStyle=on?'#7dffd0':'#2a394a';ctx.fillRect(sx,d.y-d.h-13,18,10);
    ctx.strokeStyle='#091018';ctx.lineWidth=1.5;ctx.strokeRect(sx,d.y-d.h-13,18,10);
   }
   ctx.font='800 12px system-ui';ctx.textAlign='center';
   ctx.fillStyle='#050b14dd';ctx.fillRect(d.x-115,d.y-d.h-44,230,18);
   ctx.fillStyle=col;
   const statusTxt=s.breachDoorOpen?'VARCO SBLOCCATO · PASSAGGIO ATTIVO':openRatio>=1?'PORTA PRONTA · AVVICINATI PER IMPULSO':`${d.label} (${onCount}/${total})`;
   ctx.fillText(statusTxt,d.x,d.y-d.h-31);
  }
 }
 ctx.restore();
}

// Seamless Architectural Perimeter Extension around Map Canvas (Replaces repeated dark edge tiles!)
export function drawMapPerimeterExtension(ctx,dx,dy,rw,rh,cw,ch,kind=0,missionId=''){
 if(dx<=0&&dy<=0&&dx+rw>=cw&&dy+rh>=ch)return;
 const pal=[
  {bg:'#0b1118',stone:'#16202c',trim:'#34495e',glow:'#ffb65c'},
  {bg:'#08111a',stone:'#122230',trim:'#2e5168',glow:'#58d9ff'},
  {bg:'#100e0c',stone:'#1d1916',trim:'#4a3f35',glow:'#e0a858'},
  {bg:'#0d0914',stone:'#191224',trim:'#463464',glow:'#d395ff'}
 ][kind||0]||{bg:'#0b1118',stone:'#16202c',trim:'#34495e',glow:'#58d9ff'};
 ctx.save();
 ctx.fillStyle=pal.bg;ctx.fillRect(0,0,cw,ch);
 // Draw architectural masonry courses in the off-map margins instead of cloning map doors/walls
 const step=Math.max(32,Math.round(rw/24));
 ctx.strokeStyle=pal.stone;ctx.lineWidth=2;
 for(let y=dy%step;y<ch;y+=step){
  if(y>=dy&&y<=dy+rh)continue;
  ctx.fillStyle=((Math.floor(y/step))&1)?pal.stone:pal.bg;
  ctx.fillRect(0,y,cw,step-2);
 }
 // Logical South Causeway / Stone Approach Bridge aligned with the map's center entrance (e.g. bone_tyrant)
 if(dy+rh<ch){
  const cx=dx+rw*.5,bw=Math.max(96,rw*.13),by=dy+rh;
  ctx.fillStyle=missionId==='bone_tyrant'?'#28231e':pal.stone;
  ctx.fillRect(cx-bw/2,by-4,bw,ch-by+8);
  ctx.strokeStyle=pal.trim;ctx.lineWidth=3;
  ctx.strokeRect(cx-bw/2,by-2,bw,ch-by+6);
  for(let py=by+12;py<ch;py+=24){
   ctx.fillStyle='#00000038';ctx.fillRect(cx-bw/2+6,py,bw-12,3);
  }
 }
 // Clean architectural border frame around the active map
 ctx.strokeStyle=pal.trim;ctx.lineWidth=4;
 ctx.strokeRect(dx-2,dy-2,rw+4,rh+4);
 ctx.restore();
}

// Clean Holographic Road Portal for Driving Missions (Replaces nonsensical village prop sprites on the road)
export function drawRoadPortalGate(ctx,x,y,color,done,kind='pass',chalk=false,time=0,reduced=false){
 ctx.save();
 const pulse=reduced?1:.75+.25*Math.sin(time*9),ringCol=chalk?'#f4f1e6':color;
 ctx.fillStyle=ringCol+'24';ctx.beginPath();ctx.ellipse(x,y,66,38,0,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle=ringCol;ctx.lineWidth=3.5;ctx.beginPath();ctx.ellipse(x,y,62,34,0,0,Math.PI*2);ctx.stroke();
 for(let k=-1;k<=1;k++){
  const cy=y+k*12;
  ctx.strokeStyle=done?'#bcffe8':ringCol;ctx.lineWidth=2.5;
  ctx.beginPath();ctx.moveTo(x-28,cy+6);ctx.lineTo(x,cy-6);ctx.lineTo(x+28,cy+6);ctx.stroke();
 }
 for(const sx of [x-64,x+64]){
  ctx.fillStyle='#101a26';ctx.fillRect(sx-7,y-44,14,48);
  ctx.strokeStyle=ringCol;ctx.lineWidth=2;ctx.strokeRect(sx-7,y-44,14,48);
  ctx.fillStyle=ringCol;ctx.beginPath();ctx.arc(sx,y-46,6*pulse,0,Math.PI*2);ctx.fill();
 }
 ctx.strokeStyle=ringCol+'aa';ctx.lineWidth=3;
 ctx.beginPath();ctx.moveTo(x-64,y-44);ctx.quadraticCurveTo(x,y-68,x+64,y-44);ctx.stroke();
 if(chalk){vCir(ctx,x,y,14,0,'#f4f1e6aa',2);}
 ctx.restore();
}

// Cinematic Multi-Frame Spritesheet-Style Nitro Afterburner & Overdrive VFX
export function drawNitroCinematicVfx(ctx,cx,y,td,boost,time=0,isPlayer=true,worldH=800,reduced=false){
 if(!(boost>0))return;
 const tier=td?.tier||1,col=td?.color||'#59e0ff',glow=td?.glow||'#e9feff';
 const jets=td?.jets===4?[-26,-9,9,26]:td?.jets===3?[-22,0,22]:[-22,22];
 const frame=reduced?2:Math.floor(time*24)%8,tierK=1+(tier-1)*.22;
 const len=(reduced?54:68+(frame%3)*18)*Math.min(1.35,boost*2.1)*tierK;
 ctx.save();
 const rg=ctx.createRadialGradient(cx,y+96,6,cx,y+96,68*tierK);
 rg.addColorStop(0,col+'88');rg.addColorStop(.5,col+'28');rg.addColorStop(1,'#0000');
 ctx.fillStyle=rg;ctx.beginPath();ctx.ellipse(cx,y+102,58*tierK,36*tierK,0,0,Math.PI*2);ctx.fill();
 for(const [jIdx,off] of jets.entries()){
  const jx=cx+off,jy=y+90,w0=9+tier*1.2;
  const g=ctx.createLinearGradient(0,jy,0,jy+len);
  g.addColorStop(0,'#ffffff');g.addColorStop(.2,glow);g.addColorStop(.6,col+'dd');g.addColorStop(1,'#0000');
  ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(jx-w0,jy);ctx.lineTo(jx+w0,jy);ctx.lineTo(jx+w0*.35,jy+len*.72);ctx.lineTo(jx,jy+len);ctx.lineTo(jx-w0*.35,jy+len*.72);ctx.closePath();ctx.fill();
  const rings=2+Math.min(3,tier);
  for(let r=0;r<rings;r++){
   const prog=((r/rings)+((frame+jIdx)%4)*.08)%1,ry=jy+prog*len*.78,rw=Math.max(2,(1-prog)*w0*.85);
   ctx.fillStyle=r%2===0?'#ffffffdd':glow+'cc';
   ctx.fillRect(Math.round(jx-rw),Math.round(ry),Math.round(rw*2),4);
  }
 }
 if(isPlayer&&!reduced){
  ctx.strokeStyle=glow+'aa';ctx.lineWidth=2.5;
  ctx.beginPath();ctx.arc(cx,y+52,44+((frame%4)*6),Math.PI*1.12,Math.PI*1.88);ctx.stroke();
  for(const wx of [-30,30]){
   ctx.strokeStyle=col+'bb';ctx.lineWidth=2;
   ctx.beginPath();ctx.moveTo(cx+wx,y+30);
   for(let s=1;s<=4;s++)ctx.lineTo(cx+wx+((frame+s)%2?4:-4),y+30+s*22);
   ctx.stroke();
  }
  ctx.strokeStyle=tier>=3?col+'88':'#cfefff66';ctx.lineWidth=tier>=4?3:2;
  for(let k=0;k<12+tier*4;k++){
   const side=k%2===0?40+((k*37)%110):570+((k*37)%110),ly=((k*97+time*1400)%(worldH+120))-60,lLen=75+(k%3)*35;
   ctx.beginPath();ctx.moveTo(side,ly);ctx.lineTo(side,ly+lLen);ctx.stroke();
  }
 }
 ctx.restore();
}

// 3D Open Armored Cargo Container Bay ("si entra nei carichi per cambiare mondo"), Interactive Secret Chest, Notice Board & Structures
export function drawHubStructurePoint(ctx,p,time=0,near=false,color='#7dffd0',reduced=false,carImg=null,opened=false,tr=v=>v){
 const x=p.x,y=p.y,pulse=reduced?1:.75+.25*Math.sin(time*5);
 ctx.save();
 if(p.kind==='exit'||p.kind==='travel'){
  const isExit=p.kind==='exit',col=near?'#7dffd0':isExit?'#ffd27a':'#58e8ff';
  ctx.fillStyle='#04081099';ctx.beginPath();ctx.ellipse(x,y+10,58,22,0,0,Math.PI*2);ctx.fill();
  vBox(ctx,x-36,y-6,72,28,'#1a2634',col,2);
  for(let k=-1;k<=1;k++){
   const cy=y+6+k*7-(reduced?0:((time*16)%8));
   ctx.strokeStyle=col;ctx.lineWidth=2.2;
   ctx.beginPath();ctx.moveTo(x-16,cy+4);ctx.lineTo(x,cy-4);ctx.lineTo(x+16,cy+4);ctx.stroke();
  }
  vBox(ctx,x-48,y-68,96,64,isExit?'#283848':'#1e3246',col,2);
  for(let rx=x-42;rx<=x+38;rx+=12)vLine(ctx,rx,y-66,rx,y-50,'#00000044',2);
  vBox(ctx,x-34,y-50,68,44,'#071018',col+'aa',1.5);
  const pg=ctx.createRadialGradient(x,y-28,4,x,y-28,34);
  pg.addColorStop(0,col+'88');pg.addColorStop(1,'#07101800');
  ctx.fillStyle=pg;ctx.fillRect(x-32,y-48,64,40);
  vBox(ctx,x-62,y-52,14,48,'#32465a',col,1.5);
  vBox(ctx,x+48,y-52,14,48,'#32465a',col,1.5);
  vBox(ctx,x-54,y-84,108,15,'#0b141e',col,1.5);
  worldText(ctx,tr(isExit?'CARICO · CAMBIA ATTO':'CARICO · CAMBIA MONDO'),x,y-90,col,9);
  if(isExit&&carImg?.naturalWidth){
   ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalAlpha=.94;
   ctx.drawImage(carImg,x+54,y-38,66,44);ctx.restore();
  }
 }else if(p.kind==='board'){
  ctx.fillStyle='#00000066';ctx.beginPath();ctx.ellipse(x,y+6,26,9,0,0,Math.PI*2);ctx.fill();
  vRect(ctx,x-18,y-38,5,42,'#3a281b');vRect(ctx,x+13,y-38,5,42,'#3a281b');
  vBox(ctx,x-22,y-42,44,28,'#2b1e14','#e0a858',2);
  vRect(ctx,x-16,y-37,10,12,'#f3e5c8');vRect(ctx,x-3,y-35,11,14,'#e8d5b5');vRect(ctx,x+10,y-36,8,10,'#f3e5c8');
  ctx.fillStyle='#4a3322';ctx.beginPath();ctx.moveTo(x-26,y-42);ctx.lineTo(x,y-54);ctx.lineTo(x+26,y-42);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#e0a858';ctx.lineWidth=1.5;ctx.stroke();
 }else if(p.kind==='secret'){
  drawTreasureChest3D(ctx,{x,y,open:opened,kind:'chrono'},time,reduced,near);
 }else{
  ctx.fillStyle='#00000066';ctx.beginPath();ctx.ellipse(x,y+5,20,8,0,0,Math.PI*2);ctx.fill();
  vBox(ctx,x-15,y-24,30,28,'#1c2c38',color||'#7dffd0',1.5);
  vBox(ctx,x-10,y-19,20,12,'#0c1822','#58e8ffaa',1);
  vCir(ctx,x,y-13,3*pulse,color||'#7dffd0');
 }
 ctx.restore();
}

export function drawCompassWaypoint(ctx,x,y,ang=0,time=0,edge=false,reduced=false){
 const bob=reduced?0:Math.sin(time*6)*(edge?2:3);
 ctx.save();ctx.translate(x,y+bob);
 if(edge){ctx.fillStyle='#07131ed8';ctx.beginPath();ctx.arc(0,0,16,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#7dffd088';ctx.lineWidth=1.5;ctx.stroke();}
 ctx.rotate(ang);
 ctx.fillStyle='#07131ecc';ctx.strokeStyle='#7dffd0cc';ctx.lineWidth=2;
 ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(-8,-9);ctx.lineTo(-3,0);ctx.lineTo(-8,9);ctx.closePath();
 ctx.fill();ctx.stroke();ctx.restore();
}

export function drawGlassKeepsakeProp(ctx,x,y,time=0,reduced=false){
 const pulse=reduced?1:.8+.2*Math.sin(time*5);
 ctx.save();ctx.translate(x,y);
 ctx.fillStyle='#00000055';ctx.beginPath();ctx.ellipse(0,6,16,6,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#7af3ffdd';ctx.strokeStyle='#ffffff';ctx.lineWidth=1.5;
 ctx.beginPath();ctx.moveTo(0,-16);ctx.lineTo(11,-4);ctx.lineTo(6,8);ctx.lineTo(-8,6);ctx.lineTo(-10,-6);ctx.closePath();
 ctx.fill();ctx.stroke();
 ctx.strokeStyle=`rgba(255,255,255,${.7*pulse})`;
 ctx.beginPath();ctx.moveTo(-14,-8);ctx.lineTo(14,-8);ctx.moveTo(0,-20);ctx.lineTo(0,4);ctx.stroke();
 ctx.restore();
}

// Emotional & Cinematic Atmospheric Director for Scenes and Active Narrative Beats
export function drawNarrativeImmersion(ctx,w,h,time=0,color='#6bddff',alpha=.7,reduced=false){
 ctx.save();ctx.globalAlpha=Math.min(1,Math.max(.35,alpha));
 const vg=ctx.createRadialGradient(w*.5,h*.45,Math.min(w,h)*.25,w*.5,h*.5,Math.max(w,h)*.72);
 vg.addColorStop(0,'#00000000');vg.addColorStop(1,'#030710aa');
 ctx.fillStyle=vg;ctx.fillRect(0,0,w,h);
 if(!reduced){
  for(let i=0;i<14;i++){
   const px=((i*137+time*(14+(i%5)*4))%(w+40))-20;
   const py=h-((i*89+time*(18+(i%4)*5))%(h+40))+20;
   const r=1.5+(i%3)*1.1,col=i%3===0?'#7af3ff88':i%3===1?'#ff9fe688':'#ffd88a88';
   ctx.fillStyle=col;ctx.beginPath();ctx.arc(px,py,r,0,Math.PI*2);ctx.fill();
  }
 }
 if(alpha<.95){
  const bar=Math.round(Math.min(36,h*.06));
  ctx.fillStyle='#02050be8';ctx.fillRect(0,0,w,bar);ctx.fillRect(0,h-bar,w,bar);
  ctx.fillStyle=(color||'#7af3ff')+'55';ctx.fillRect(0,bar-1,w,1.5);ctx.fillRect(0,h-bar,w,1.5);
 }
 ctx.restore();
}

// ---------- Live Animated Combat Map Details, 3D Treasure Chests, Held Weapons & Projectiles ----------
export function drawCombatMapLife(ctx,s,layout,reduced=false){
 if(!s||!layout?.cells)return;
 const t=s.time||0,ts=64,G=24,kind=s.c?.kind||0,lid=layout.id||'yard',pal=s.c?.color||'#58d9ff';
 const open=(x,y)=>x>=0&&y>=0&&x<G&&y<G&&layout.cells[y*G+x];
 const pts=[layout.start,layout.boss,...(layout.nodes||[])].filter(Boolean);
 ctx.save();
 // MS-1: only the cells in view (and one more around them) are drawn: the loop used to walk the whole 24x24 grid every frame.
 const vb=viewBounds(ctx,ts),cx0=Math.max(0,Math.floor(vb.x0/ts)),cx1=Math.min(G-1,Math.floor(vb.x1/ts)),cy0=Math.max(0,Math.floor(vb.y0/ts)),cy1=Math.min(G-1,Math.floor(vb.y1/ts));
 // 1. Animated Floor Vents (steam / spore mist puffs) & Spinning Floor Turbines
 for(let y=cy0;y<=cy1;y++)for(let x=cx0;x<=cx1;x++)if(open(x,y)){
  const px=x*ts,py=y*ts,ed=!open(x,y-1)||!open(x+1,y)||!open(x,y+1)||!open(x-1,y),sf=pts.some(p=>Math.hypot(px+32-p.x,py+32-p.y)<120);
  if(ed||sf)continue;
  if((x*7+y*11)%19===0){
   if(reduced){vRect(ctx,px+23,py+22,18,16,kind===2?'#9aff7822':'#a8dcff22');}
   else for(let k=0;k<3;k++){
    const ph=((t*.48+k/3+(x+y)*.13)%1),rx=px+32+Math.sin(ph*5+k+x)*7,ry=py+26-ph*32;
    vCir(ctx,rx,ry,3.5+ph*8,kind===2?`rgba(165,255,115,${.28*(1-ph)})`:`rgba(185,230,255,${.26*(1-ph)})`);
   }
  }else if((x*11+y*5)%23===0){
   const ang=reduced?.4:t*2.8+x+y;
   ctx.strokeStyle='#7cb6d488';ctx.lineWidth=2;
   for(let b=0;b<3;b++){const a=ang+b*2.094;vLine(ctx,px+32,py+32,px+32+Math.cos(a)*8,py+32+Math.sin(a)*8,'#7cb6d488',2);}
   vCir(ctx,px+32,py+32,2.2,pal+'aa');
  }
 }else if(x>=4&&x<=19&&y>=4&&y<=19&&((x*13+y*7)%17===0)){
  // Tactical block status LED blink
  const blink=reduced?.7:.25+.75*(.5+.5*Math.sin(t*4.5+x*3+y));
  ctx.fillStyle=kind===2?`rgba(155,255,110,${blink})`:kind===3?`rgba(255,190,90,${blink})`:`rgba(95,235,255,${blink})`;
  ctx.fillRect(x*ts+8,y*ts+8,6,4);
 }
 // 2. Live Energy Conduits & Arena Rings
 if(!reduced){
  if(lid==='yard'){
   const u=(t*.35)%1;
   vCir(ctx,736,u*1536,5,pal+'99');vCir(ctx,u*1536,736,5,pal+'99');
  }else if(lid==='spine'){
   for(let k=0;k<4;k++){const yy=((t*210+k*380)%1536);vRect(ctx,730,yy,5,24,pal+'88');vRect(ctx,796,1536-yy,5,24,pal+'88');}
  }else if(lid==='gallery'){
   for(const ry of [352,800,1184]){const rx=((t*240+ry)%1280)+128;vRect(ctx,rx,ry-3,36,6,pal+'66');}
  }else if(lid==='arena'){
   ctx.strokeStyle=pal+'55';ctx.lineWidth=2.5;
   ctx.beginPath();ctx.arc(768,768,250,t*.35,t*.35+Math.PI*1.1);ctx.stroke();
   ctx.beginPath();ctx.arc(768,768,170,-t*.5,-t*.5+Math.PI*.9);ctx.stroke();
  }
  // 3. District Atmospheric Particles (sparks, rain drizzle, bioluminescent spores, chronon motes)
  const pCol=kind===0?'#ffb86a55':kind===1?'#9be8ff44':kind===2?'#a2ff7555':'#d8a4ff55';
  for(let i=0;i<22;i++){
   const px=((i*211+t*(kind===1?46:24+(i%5)*7))%1480)+28,py=((i*167+t*(kind===1?130:-18)+Math.sin(t*1.6+i)*22)%1480+1480)%1480;
   if(px<vb.x0||px>vb.x1||py<vb.y0||py>vb.y1)continue;
   if(kind===1){vLine(ctx,px,py,px-5,py+12,pCol,1.5);}
   else vCir(ctx,px,py,1.6+(i%3)*.8,pCol);
  }
 }
 ctx.restore();
}

// MS-1: the part of the world on the screen, in world units, plus a margin; the whole world when the transform is not a plain zoom and shift.
function viewBounds(ctx,margin=0){const m=ctx.getTransform(),c=ctx.canvas;if(!c||!c.width||!m.a||!m.d||m.b||m.c)return {x0:-1e9,y0:-1e9,x1:1e9,y1:1e9};const xa=-m.e/m.a,xb=(c.width-m.e)/m.a,ya=-m.f/m.d,yb=(c.height-m.f)/m.d;return {x0:Math.min(xa,xb)-margin,x1:Math.max(xa,xb)+margin,y0:Math.min(ya,yb)-margin,y1:Math.max(ya,yb)+margin};}
// R4: text in the world is never under 12 px on the screen, whatever the zoom; a dark outline keeps it readable on any ground.
function worldText(ctx,text,x,y,color,size){const m=ctx.getTransform(),c=ctx.canvas,k=Math.hypot(m.a,m.b)/((c&&c.clientWidth?c.width/c.clientWidth:1)||1)||1,px=Math.max(size,12/k);ctx.font=`800 ${px}px system-ui`;ctx.textAlign='center';ctx.lineJoin='round';ctx.lineWidth=3/k;ctx.strokeStyle='#04070cd0';ctx.strokeText(text,x,y);ctx.fillStyle=color;ctx.fillText(text,x,y);}
export function drawTreasureChest3D(ctx,ch,time=0,reduced=false,near=false,tr=v=>v){
 const x=ch.x,y=ch.y,open=!!ch.open,isChrono=ch.kind==='chrono';
 {const vb=viewBounds(ctx,80);if(x<vb.x0||x>vb.x1||y<vb.y0||y>vb.y1)return;}
 const trim=open?'#6c7a88':isChrono?'#6df2ff':'#ffcf6a',glow=isChrono?'#6df2ff':'#ffd27a';
 const pulse=reduced?1:.65+.35*Math.sin(time*5.5+x);
 ctx.save();
 ctx.fillStyle='#00000066';ctx.beginPath();ctx.ellipse(x,y+8,24,9,0,0,Math.PI*2);ctx.fill();
 if(!open&&!reduced){
  const rg=ctx.createRadialGradient(x,y-8,3,x,y-8,34+pulse*6);
  rg.addColorStop(0,glow+(near?'55':'38'));rg.addColorStop(1,'#0000');
  ctx.fillStyle=rg;ctx.beginPath();ctx.arc(x,y-8,38,0,Math.PI*2);ctx.fill();
 }
 // Chest Body
 vBox(ctx,x-19,y-14,38,20,isChrono?'#1b2e3c':'#3c281c',trim,2);
 vRect(ctx,x-17,y-6,34,3,trim+'aa');
 if(open){
  // Hinged open lid + inner warm treasure gleam
  vBox(ctx,x-20,y-29,40,14,isChrono?'#223c4e':'#4a3220',trim,2);
  vRect(ctx,x-14,y-14,28,4,'#fff2b288');
  ctx.font='800 10px system-ui';ctx.textAlign='center';ctx.fillStyle='#9eb2be';
  ctx.fillText(tr('APERTO'),x,y+20);
 }else{
  vBox(ctx,x-20,y-24,40,12,isChrono?'#244056':'#523622',trim,2);
  vBox(ctx,x-5,y-15,10,9,'#ffe07d','#1b130a',1.5);
  if(!reduced){
   for(let k=0;k<3;k++){const ph=((time*.9+k*.33)%1);vCir(ctx,x-10+k*10+Math.sin(ph*6)*3,y-22-ph*16,2,glow);}
  }
  worldText(ctx,tr(near?'APRI FORZIERE':'FORZIERE'),x,y-30-(reduced?0:Math.sin(time*5)*2.5),near?'#b9ffe8':glow,11);
 }
 ctx.restore();
}

export function drawHeldWeaponAndMuzzle(ctx,actor,weaponId,dir,spinUp=0,time=0,reduced=false,muzzle=null){
 if(!weaponId||['c9','vx9','r12','h17','arc7'].includes(weaponId)||!dir)return;
 const ang=Math.atan2(dir.y,dir.x);
 const tx=actor.x+(muzzle?muzzle.x:(dir.x>=0?42:-42)),ty=actor.y+(muzzle?muzzle.y:(dir.y<-.6?-96:dir.y>.6?-23:-66));
 const col={mg_tempest:'#7de8ff',mg_vulcan:'#ffb85c',mg_helix:'#94ffd8',mg_shredder:'#58e8ff',scatter_flak:'#ffd478',orb_nova:'#ff9d52',orb_void:'#70f2ff',plasma_carbine:'#6fffb0',rail_lance:'#ffe89e',arc_tesla:'#cfa6ff',flame_pyre:'#ff7a36',cryo_shard:'#6bffb8',sniper_chronos:'#ffd88a'}[weaponId]||'#bff4ff';
 ctx.save();ctx.translate(tx,ty);ctx.rotate(ang);
 if(dir.x<0)ctx.scale(1,-1);
 if(weaponId.startsWith('mg_')){
  const spin=reduced?0:time*(14+spinUp*28),len=weaponId==='mg_shredder'?34:30;
  vBox(ctx,-len,-5,20,10,'#1c2732',col,1.5);
  for(let b=-1;b<=1;b+=2){
   const by=Math.sin(spin+b)*2.8;
   vRect(ctx,-len+16,by-1.5,len-16,3,'#9eb6c8');
  }
  if(spinUp>.18)vCir(ctx,0,0,4+spinUp*4,col+'aa');
 }else if(weaponId==='flame_pyre'){
  vBox(ctx,-28,-5,26,10,'#3b2016','#ff7a36',1.5);
  vCir(ctx,0,0,reduced?3:3.5+Math.sin(time*20)*1.5,'#ffcf6a');
 }else if(weaponId==='cryo_shard'){
  vBox(ctx,-25,-5,25,10,'#17323c','#6bffb8',1.5);
  vCir(ctx,0,0,4,'#aefeff');
 }else if(weaponId==='rail_lance'||weaponId==='sniper_chronos'){
  vBox(ctx,-34,-4,34,8,'#1b2330',col,1.5);
  vRect(ctx,-24,-2,22,4,col+'99');
 }else if(weaponId.startsWith('orb_')){
  vBox(ctx,-22,-6,20,12,'#211d30',col,1.5);
  vCir(ctx,0,0,4.5,col);
 }else if(weaponId==='arc_tesla'){
  vBox(ctx,-28,-4,22,8,'#211a34',col,1.5);
  vLine(ctx,-6,-4,0,-2,col,1.8);vLine(ctx,-6,4,0,2,col,1.8);
 }else if(weaponId==='scatter_flak'){
  vBox(ctx,-24,-5,22,10,'#2c241c',col,1.5);
  vRect(ctx,-6,-4,6,8,'#566470');
 }else{
  vBox(ctx,-22,-4,22,8,'#192836',col,1.5);
 }
 ctx.restore();
}

export function drawCustomProjectile(ctx,q,qx,qy,time=0,reduced=false){
 ctx.save();
 if(q.isOrb){
  const p=reduced?1:1+.16*Math.sin(time*16);
  vCir(ctx,qx,qy,22*p,q.color+'33');
  vCir(ctx,qx,qy,11*p,q.color);
  vCir(ctx,qx,qy,4,'#fff');
  if(!reduced){
   const ang=time*7;ctx.strokeStyle=q.color+'cc';ctx.lineWidth=2.2;
   ctx.beginPath();ctx.arc(qx,qy,18*p,ang,ang+Math.PI*.9);ctx.stroke();
   ctx.beginPath();ctx.arc(qx,qy,24*p,-ang,-ang+Math.PI*.75);ctx.stroke();
  }
 }else{
  vLine(ctx,qx,qy,qx-q.vx*.032,qy-q.vy*.032,q.color||'#6fffb0',6);
  vCir(ctx,qx,qy,5,'#fff');
 }
 ctx.restore();
}

export function drawCombatPickupOrb(ctx,d,time=0,reduced=false){
 const isVital=d.kind==='vital',col=isVital?'#7dffd0':'#ffd87a',bob=reduced?0:Math.sin(time*7+d.x)*3.5;
 const fade=d.life<2.5&&!reduced?Math.abs(Math.sin(time*12)):1;
 ctx.save();ctx.globalAlpha=fade;
 ctx.fillStyle='#00000055';ctx.beginPath();ctx.ellipse(d.x,d.y+4,11,4,0,0,7);ctx.fill();
 ctx.translate(d.x,d.y-12+bob);
 vCir(ctx,0,0,14,col+'28');
 if(!reduced)ctx.rotate(time*3.2);
 ctx.fillStyle=col;ctx.strokeStyle='#ffffff';ctx.lineWidth=1.5;
 ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(7,0);ctx.lineTo(0,8);ctx.lineTo(-7,0);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.restore();
}

export function drawRaceAtmosphere(ctx,r,p,worldH,sideW,time=0,reduced=false){
 if(reduced)return;
 const spd=p?.speed||0,fast=Math.max(0,(spd-210)/350),sand=['sand','storm'].includes(r?.mode),night=['night','bridges','docks'].includes(r?.mode);
 ctx.save();
 // Speed wind streaks on track shoulders & boost warp lines
 if(fast>.12||p?.boost>0){
  const n=p?.boost>0?18:10,a=p?.boost>0?.42:.16+.2*fast;
  ctx.strokeStyle=p?.boost>0?'#9ef6ffa8':`rgba(220,245,255,${a})`;ctx.lineWidth=p?.boost>0?2.4:1.4;
  for(let i=0;i<n;i++){
   const x=i%2===0?30+((i*47)%115):575+((i*53)%115),y=((i*131+time*(900+spd*1.9))%(worldH+140))-70,len=45+fast*75+(p?.boost>0?40:0);
   ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+len);ctx.stroke();
  }
 }
 // Dynamic race weather (sandstorm gusts or harbour drizzle)
 if(sand){
  ctx.strokeStyle='#ffd49444';ctx.lineWidth=2;
  for(let i=0;i<16;i++){
   const x=((i*97+time*520)%(720+sideW*2))-sideW,y=(i*73+Math.sin(time*3+i)*22)%worldH;
   ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+58,y+12);ctx.stroke();
  }
 }else if(night){
  ctx.strokeStyle='#a8dcff38';ctx.lineWidth=1.2;
  for(let i=0;i<24;i++){
   const x=((i*89+time*140)%(720+sideW*2))-sideW,y=((i*67+time*760)%worldH);
   ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-8,y+20);ctx.stroke();
  }
 }
 ctx.restore();
}

export function drawComboStreakHud(ctx,s,w,time=0,reduced=false,tr=v=>v){
 if(!s||!(s.combo>=2)||s.status!=='playing')return;
 const frac=Math.max(0,Math.min(1,(s.comboTimer||0)/3.8)),hot=s.combo>=10,warm=s.combo>=5;
 const col=hot?'#ff9fe6':warm?'#ffd87a':'#7af3ff',tag=tr(hot?'INARRESTABILE':warm?'FURIA':'SERIE');
 const ch=ctx.canvas?.height||800,hasBoss=!!s.enemies?.some(e=>e.boss&&e.hp>0&&e.state!=='dormant');
 const bx=w-158,by=ch<=500?124:hasBoss?202:148,pulse=reduced?1:1+.04*Math.sin(time*12);
 ctx.save();ctx.translate(bx+72,by+20);ctx.scale(pulse,pulse);ctx.translate(-72,-20);
 ctx.fillStyle='#06111ee0';ctx.strokeStyle=col;ctx.lineWidth=2;
 ctx.beginPath();ctx.roundRect(0,0,144,38,10);ctx.fill();ctx.stroke();
 ctx.font='800 12px system-ui';ctx.textAlign='left';ctx.fillStyle=col;ctx.fillText(tag,10,18);
 ctx.font='900 16px system-ui';ctx.textAlign='right';ctx.fillStyle='#ffffff';ctx.fillText('×'+s.combo,134,20);
 ctx.fillStyle='#132234';ctx.fillRect(10,26,124,5);
 ctx.fillStyle=col;ctx.fillRect(10,26,Math.round(124*frac),5);
 ctx.restore();
}




