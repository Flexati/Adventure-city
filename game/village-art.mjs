// Arte procedurale dei villaggi (D40): bakeVillage + drawVillageLife.
const VT=64;
const vHash=(a,b=0,c=0)=>{let h=(a*374761393+b*668265263+c*2147483647)|0;h=(h^(h>>>13))*1274126177|0;return ((h^(h>>>16))>>>0)/4294967295;};
const vShade=(hex,amt)=>{const n=parseInt(hex.slice(1),16),f=c=>Math.max(0,Math.min(255,Math.round(c+amt*255)));return '#'+[(n>>16)&255,(n>>8)&255,n&255].map(f).map(v=>v.toString(16).padStart(2,'0')).join('');};
const vRect=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};
const V_ICON={
 inn:(g,x,y,c)=>{g.fillStyle=c;g.fillRect(x-6,y-4,10,10);g.fillRect(x+4,y-1,3,5);g.clearRect(x+5,y,1,3);g.fillRect(x-7,y+6,13,2);},
 smith:(g,x,y,c)=>{g.fillStyle=c;g.fillRect(x-8,y-5,16,5);g.fillRect(x-4,y,8,4);g.fillRect(x-7,y+4,14,3);},
 shop:(g,x,y,c)=>{g.fillStyle=c;g.fillRect(x-7,y-3,14,10);g.fillRect(x-4,y-7,8,4);g.clearRect(x-2,y-6,4,2);},
 relic:(g,x,y,c)=>{g.strokeStyle=c;g.lineWidth=2;g.beginPath();g.arc(x,y,6,0,7);g.stroke();g.fillStyle=c;g.fillRect(x-1,y-9,2,18);},
 info:(g,x,y,c)=>{g.fillStyle=c;g.beginPath();g.arc(x,y,8,0,7);g.fill();g.fillStyle='#10202c';g.fillRect(x-1,y-1,2,6);g.fillRect(x-1,y-5,2,2);},
 alchemist:(g,x,y,c)=>{g.fillStyle=c;g.fillRect(x-2,y-8,4,6);g.beginPath();g.moveTo(x-2,y-3);g.lineTo(x-8,y+7);g.lineTo(x+8,y+7);g.lineTo(x+2,y-3);g.fill();},
};
function vFloorTile(g,env,district,px,py,mood,plaza,x,y){
 const tile=plaza?([1,6,5,4][district]??1):([0,2,3,7][district]??0);
 if(env?.naturalWidth)g.drawImage(env,tile%4*128,Math.floor(tile/4)*128,128,128,px,py,VT,VT);
 vRect(g,px,py,VT,VT,(plaza?mood.plaza:mood.floor)+(plaza?'c8':'78'));
 g.strokeStyle='#adc9d218';g.lineWidth=1;g.strokeRect(px+.5,py+.5,VT-1,VT-1);
 if(plaza){
  g.strokeStyle=mood.trim+'35';g.strokeRect(px+3.5,py+3.5,VT-7,VT-7);
  g.strokeStyle='#00000038';g.beginPath();g.moveTo(px,py+VT/2);g.lineTo(px+VT,py+VT/2);g.moveTo(px+VT/2,py);g.lineTo(px+VT/2,py+VT);g.stroke();
  if((x+y)%2===0)vRect(g,px+6,py+6,VT/2-8,VT/2-8,'#ffffff0c');
  if(vHash(x,y,3)>.65)vRect(g,px+10+vHash(x,y,4)*30,py+10+vHash(x,y,5)*30,8,4,'#ffffff16');
 }else{
  g.strokeStyle='#080e1640';g.lineWidth=1;
  for(let r=0;r<4;r++){const ry=py+r*16,off=(r%2)*16;g.beginPath();g.moveTo(px,ry+.5);g.lineTo(px+VT,ry+.5);for(let c=off;c<VT;c+=32){g.moveTo(px+c+.5,ry);g.lineTo(px+c+.5,ry+16);}g.stroke();}
  if(vHash(x,y,6)>.55)vRect(g,px+6+vHash(x,y,7)*36,py+4+((x+y)%3)*16,18,10,'#ffffff12');
 }
}
function vDrawIcon(g,kind,x,y,c){(V_ICON[kind]||null)?.(g,x,y,c);}
function vDrawProp(g,id,p,mood){
 const px=p.x*VT,py=p.y*VT,cx=px+VT/2,cy=py+VT/2;
 g.fillStyle='#00000055';g.beginPath();g.ellipse(cx,cy+22,20,7,0,0,7);g.fill();
 if(id==='moon'||id==='cathedral'){vRect(g,cx-3,cy-22,6,44,'#2a3a44');vRect(g,cx-9,cy-30,18,10,mood.trim);vRect(g,cx-6,cy-27,12,6,mood.glow);}
 else if(id==='toxic'){vRect(g,cx-14,cy-14,28,34,'#2d3a22');vRect(g,cx-14,cy-6,28,4,'#12190f');vRect(g,cx-14,cy+8,28,4,'#12190f');vRect(g,cx-8,cy-18,16,6,mood.trim);}
 else{g.fillStyle='#4b3a22';g.beginPath();g.arc(cx-6,cy+4,16,0,7);g.fill();g.fillStyle='#6a5230';g.beginPath();g.arc(cx+10,cy-6,11,0,7);g.fill();g.strokeStyle=mood.trim;g.lineWidth=2;g.beginPath();g.arc(cx-6,cy+4,16,0,7);g.arc(cx+10,cy-6,11,0,7);g.stroke();}
}
function vDrawWater(g,id,w,mood){
 const x=w.x*VT,y=w.y*VT,W=w.w*VT,H=w.h*VT;
 g.fillStyle='#00000066';g.beginPath();g.roundRect(x+3,y+7,W-6,H-4,18);g.fill();
 g.fillStyle=id==='toxic'?'#2d3a22':'#46505c';g.beginPath();g.roundRect(x+2,y+2,W-4,H-4,18);g.fill();
 const liquid=id==='toxic'?'#6bd23a':'#4aa9d8';
 const gr=g.createRadialGradient(x+W/2,y+H/2,6,x+W/2,y+H/2,Math.max(W,H)/2);gr.addColorStop(0,liquid);gr.addColorStop(1,vShade(liquid,-.32));
 g.fillStyle=gr;g.beginPath();g.roundRect(x+12,y+12,W-24,H-24,12);g.fill();
 if(id!=='toxic'){vRect(g,x+W/2-6,y+H/2-6,12,12,'#8fa0ad');g.fillStyle='#d8f3ff';g.beginPath();g.arc(x+W/2,y+H/2,5,0,7);g.fill();}
}
function vDrawBuilding(g,b,v,id){
 const m=v.mood,px=b.x*VT,py=b.y*VT,W=b.w*VT,H=b.h*VT,F=Math.min(100,H*.5+10),roofH=H-F;
 const kind=b.service||'house',seed=b.x*31+b.y*17;
 b.windows=[];b.chimneys=[];b.signs=[];
 g.fillStyle='#00000066';g.fillRect(px+6,py+H-2,W,18);
 const roofTop=vShade(m.roof,.10),roofBase=vShade(m.roof,-.08);
 const rg=g.createLinearGradient(0,py-6,0,py+roofH);rg.addColorStop(0,roofTop);rg.addColorStop(1,roofBase);
 g.fillStyle=rg;g.fillRect(px-4,py-6,W+8,roofH+6);
 g.strokeStyle='#00000030';g.lineWidth=1;
 for(let r=py+4;r<py+roofH;r+=11){g.beginPath();g.moveTo(px-4,r);g.lineTo(px+W+4,r);g.stroke();
  for(let c=px+(r%2?0:9);c<px+W;c+=18){g.beginPath();g.moveTo(c,r);g.lineTo(c,r+11);g.stroke();}}
 vRect(g,px-4,py-6,W+8,4,vShade(m.trim,-.05));vRect(g,px-4,py+roofH-3,W+8,5,'#0a1118');
 vRect(g,px,py+roofH,W,F,m.wall);
 g.strokeStyle='#00000026';for(let r=py+roofH+8;r<py+H;r+=12){g.beginPath();g.moveTo(px,r);g.lineTo(px+W,r);g.stroke();}
 vRect(g,px,py+roofH,W,3,vShade(m.trim,-.2));vRect(g,px,py+H-6,W,6,'#0a1118');
 if(kind==='inn'||kind==='house'||kind==='smith'||kind==='shop'){
  const n=kind==='smith'?1:b.w>5?2:1;
  for(let i=0;i<n;i++){const cx=px+W*(n===1?.72:i?.78:.2),cy=py+10;vRect(g,cx-10,cy,20,roofH*.55,'#2a2a30');vRect(g,cx-13,cy-4,26,6,'#3a3a42');b.chimneys.push({x:cx,y:cy-4,hot:kind==='smith'});}
  if(kind==='inn'){g.strokeStyle='#ffd28a';g.lineWidth=2;g.beginPath();g.moveTo(px+14,py+roofH-10);for(let i=1;i<=b.w;i++){g.quadraticCurveTo(px+14+(i-.5)*(W-28)/b.w,py+roofH+4,px+14+i*(W-28)/b.w,py+roofH-10);}g.stroke();}
 }
 if(kind==='shop'){for(let i=0;i<b.w*2;i++)vRect(g,px+i*32,py+roofH+3,32,18,i%2?m.trim:vShade(m.trim,-.28));}
 if(kind==='relic'||kind==='info'){const cx=px+W/2,cy=py+roofH*.42;
  if(kind==='relic'){g.strokeStyle=m.trim;g.lineWidth=3;g.beginPath();g.arc(cx,cy,Math.min(26,roofH*.35),0,7);g.stroke();g.fillStyle=m.glow+'55';g.beginPath();g.arc(cx,cy,Math.min(20,roofH*.28),0,7);g.fill();}
  else{vRect(g,cx-2,cy-24,4,34,'#3a4650');g.strokeStyle=m.trim;g.lineWidth=2;g.beginPath();g.arc(cx,cy-24,10,Math.PI,0);g.stroke();}
 }
 if(kind==='alchemist'){for(let i=0;i<3;i++){const cx=px+18+i*28;g.fillStyle=['#6bd23a','#c28bff','#ffd25a'][i]+'cc';g.beginPath();g.arc(cx,py+roofH*.5,11,0,7);g.fill();vRect(g,cx-3,py+roofH*.5-20,6,10,'#cfd6dc');}}
 if(b.letter==='N'){
  for(const tx of [px+8,px+W-88]){vRect(g,tx,py-34,80,roofH+34,vShade(m.wall,.05));vRect(g,tx,py-34,80,6,m.trim);g.fillStyle=vShade(m.roof,.16);g.beginPath();g.moveTo(tx-6,py-34);g.lineTo(tx+40,py-86);g.lineTo(tx+86,py-34);g.fill();vRect(g,tx+34,py-12,12,26,m.glow);}
  g.strokeStyle='#00000040';g.lineWidth=2;g.strokeRect(px+W/2-50,py+8,100,roofH-14);
  const cx=px+W/2,cy=py+roofH*.52;g.fillStyle=m.glow+'88';g.beginPath();g.arc(cx,cy,30,0,7);g.fill();g.strokeStyle=m.trim;g.lineWidth=3;g.beginPath();g.arc(cx,cy,30,0,7);for(let a=0;a<6;a++){g.moveTo(cx,cy);g.lineTo(cx+Math.cos(a*Math.PI/3)*30,cy+Math.sin(a*Math.PI/3)*30);}g.stroke();
 }
 if(b.letter==='K'){
  const cx=px+W/2,cy=py+roofH*.5,r=Math.min(W,roofH)*.38;
  g.fillStyle='#e8dcc0';g.beginPath();g.arc(cx,cy,r,0,7);g.fill();g.strokeStyle=m.trim;g.lineWidth=5;g.beginPath();g.arc(cx,cy,r,0,7);g.stroke();
  g.strokeStyle='#4a3a22';g.lineWidth=2;for(let i=0;i<12;i++){const a=i*Math.PI/6;g.beginPath();g.moveTo(cx+Math.cos(a)*(r-9),cy+Math.sin(a)*(r-9));g.lineTo(cx+Math.cos(a)*(r-3),cy+Math.sin(a)*(r-3));g.stroke();}
  b.clock={x:cx,y:cy,r};
 }
 const winW=22,winH=30,wy=py+roofH+14,gapStart=px+10,usable=W-20,count=Math.max(1,Math.floor(usable/52)),step=usable/count;
 for(let i=0;i<count;i++){
  const wx=gapStart+step*i+(step-winW)/2;
  if(Math.abs(wx+winW/2-(b.door.x*VT+VT/2))<34)continue;
  vRect(g,wx-3,wy-3,winW+6,winH+6,'#0a1118');vRect(g,wx,wy,winW,winH,'#1b2a33');
  const g2=g.createLinearGradient(0,wy,0,wy+winH);g2.addColorStop(0,m.glow+'cc');g2.addColorStop(1,vShade(m.glow,-.25)+'99');g.fillStyle=g2;g.fillRect(wx,wy,winW,winH);
  vRect(g,wx+winW/2-1,wy,2,winH,'#0a1118cc');vRect(g,wx,wy+winH/2-1,winW,2,'#0a1118cc');
  b.windows.push({x:wx,y:wy,w:winW,h:winH,phase:vHash(seed,i)*6.28,speed:.8+vHash(seed,i,9)*1.6});
 }
 const dx=b.door.x*VT+VT/2,dy=py+H;
 if(!b.house){
  vRect(g,dx-26,dy-72,52,72,'#0a1118');vRect(g,dx-22,dy-68,44,68,vShade(m.wall,-.12));
  const dg=g.createLinearGradient(0,dy-68,0,dy);dg.addColorStop(0,m.glow+'dd');dg.addColorStop(1,m.glow+'33');vRect(g,dx-18,dy-62,36,62,'#00000000');g.fillStyle=dg;g.fillRect(dx-18,dy-62,36,62);
  vRect(g,dx-1,dy-62,2,62,'#0a1118aa');
  g.fillStyle=m.trim;g.beginPath();g.moveTo(dx-34,dy-70);g.lineTo(dx+34,dy-70);g.lineTo(dx+28,dy-82);g.lineTo(dx-28,dy-82);g.fill();vRect(g,dx-34,dy-72,68,3,vShade(m.trim,-.3));
  vRect(g,dx-30,dy-4,60,4,'#1a2530');vRect(g,dx-36,dy,72,5,'#141d27');
  g.fillStyle='#0a1118ee';g.beginPath();g.roundRect(dx-26,dy-104,52,22,5);g.fill();g.strokeStyle=m.trim;g.lineWidth=2;g.beginPath();g.roundRect(dx-26,dy-104,52,22,5);g.stroke();
  vDrawIcon(g,kind,dx,dy-93,m.trim);b.signs.push({x:dx,y:dy-93});
 }else{
  vRect(g,dx-20,dy-58,40,58,'#0a1118');vRect(g,dx-16,dy-54,32,54,vShade(m.wall,-.18));vRect(g,dx-1,dy-54,2,54,'#00000066');vRect(g,dx+8,dy-30,4,4,m.trim+'88');
  vRect(g,dx-26,dy-4,52,4,'#1a2530');
 }
}
export function bakeVillage(g,v,id,env,district,backdrop){
 const N=24,S=N*VT,m=v.mood;
 g.fillStyle='#0d1520';g.fillRect(0,0,S,S);
 const open=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&v.cells[y*N+x]===1;
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){
  const px=x*VT,py=y*VT;
  if(open(x,y)){
   vFloorTile(g,env,district,px,py,m,v.plaza[y*N+x]===1,x,y);
   for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]])if(!open(x+dx,y+dy)){
    g.fillStyle='#080e16';if(dx)g.fillRect(px+(dx>0?VT-10:0),py,10,VT);else g.fillRect(px,py+(dy>0?VT-10:0),VT,10);
    g.fillStyle=vShade(m.trim,-.25);if(dx)g.fillRect(px+(dx>0?VT-7:2),py,5,VT);else g.fillRect(px,py+(dy>0?VT-7:2),VT,5);
   }
  }else{
   const terrace=vShade(m.roof,-.14);vRect(g,px,py,VT,VT,terrace);
   g.strokeStyle='#00000038';g.lineWidth=1;
   for(let r=py+8;r<py+VT;r+=16){g.beginPath();g.moveTo(px,r);g.lineTo(px+VT,r);g.stroke();}
   g.strokeStyle=vShade(m.wall,-.18);g.strokeRect(px+1.5,py+1.5,VT-3,VT-3);
   if(vHash(x,y,11)>.48){vRect(g,px+14,py+14,36,36,vShade(m.wall,-.08));vRect(g,px+18,py+18,28,6,vShade(m.trim,-.15));}
   for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]])if(open(x+dx,y+dy)){
    vRect(g,px+(dx>0?VT-6:0),py+(dy>0?VT-6:0),dx?6:VT,dy?6:VT,vShade(m.trim,-.12));
   }
  }
 }

 const plazaCells=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(v.plaza[y*N+x])plazaCells.push([x,y]);
 if(plazaCells.length){const xs=plazaCells.map(c=>c[0]),ys=plazaCells.map(c=>c[1]),cx=(Math.min(...xs)+Math.max(...xs)+1)/2*VT,cy=(Math.min(...ys)+Math.max(...ys)+1)/2*VT;
  g.strokeStyle=m.trim+'44';g.lineWidth=3;g.beginPath();g.arc(cx,cy,92,0,7);g.stroke();g.beginPath();g.arc(cx,cy,60,0,7);g.stroke();
  for(let i=0;i<12;i++){const a=i*Math.PI/6;g.beginPath();g.moveTo(cx+Math.cos(a)*60,cy+Math.sin(a)*60);g.lineTo(cx+Math.cos(a)*92,cy+Math.sin(a)*92);g.stroke();}}
 for(const w of v.water)vDrawWater(g,id,w,m);
 for(const p of v.props)vDrawProp(g,id,p,m);
 for(const b of [...v.buildings].sort((a,c)=>a.y-c.y))vDrawBuilding(g,b,v,id);
 g.globalCompositeOperation='soft-light';g.fillStyle=m.trim;g.globalAlpha=.18;g.fillRect(0,0,S,S);g.globalAlpha=1;g.globalCompositeOperation='source-over';
}

// Strato animato, in coordinate di mondo. player = {x,y}; label(testo,x,y,colore,corpo) disegna le scritte del gioco.
export function drawVillageLife(ctx,t,v,player,{reduced=false,label=null}={}){
 const m=v.mood;ctx.save();
 for(const b of v.buildings){
  for(const w of b.windows||[]){const a=reduced?.35:.14+.2*(.5+.5*Math.sin(t*w.speed+w.phase))+(Math.sin(t*7+w.phase*3)>.96?.18:0);ctx.fillStyle=`rgba(255,226,160,${a})`;ctx.fillRect(w.x,w.y,w.w,w.h);}
  for(const [i,c] of (b.chimneys||[]).entries()){
   if(reduced)continue;
   for(let k=0;k<4;k++){const ph=((t*.35+k/4+i*.31)%1),y=c.y-ph*70,x=c.x+Math.sin(ph*6+k+i)*9+ph*14,r=5+ph*13;
    ctx.fillStyle=c.hot?`rgba(255,150,80,${.30*(1-ph)})`:`rgba(210,220,230,${.26*(1-ph)})`;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();}
  }
  if(b.clock&&!reduced){const sc=t%60,mn=(t/60)%60,hr=(t/720)%12,c=b.clock;ctx.strokeStyle='#2a1f12';ctx.lineCap='round';
   for(const [ang,len,wd] of [[hr/12*6.283,c.r*.5,5],[mn/60*6.283,c.r*.75,3]]){ctx.lineWidth=wd;ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(c.x+Math.sin(ang)*len,c.y-Math.cos(ang)*len);ctx.stroke();}
   ctx.strokeStyle='#c2412d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(c.x+Math.sin(sc/60*6.283*6)*c.r*.85,c.y-Math.cos(sc/60*6.283*6)*c.r*.85);ctx.stroke();}
  for(const s of b.signs||[]){const a=.10+.10*Math.sin(t*2+s.x);ctx.fillStyle=m.glow;ctx.globalAlpha=a;ctx.beginPath();ctx.arc(s.x,s.y,26,0,7);ctx.fill();ctx.globalAlpha=1;}
 }
 for(const w of v.water){const x=w.x*VT,y=w.y*VT,W=w.w*VT,H=w.h*VT;
  if(reduced)continue;
  if(v.id==='toxic'){for(let k=0;k<7;k++){const ph=(t*.5+k*.37)%1,bx=x+20+vHash(k,3)*(W-40),by=y+H-18-ph*(H-30);ctx.strokeStyle=`rgba(190,255,140,${.7*(1-ph)})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(bx,by,3+ph*5,0,7);ctx.stroke();}}
  else{for(let k=0;k<6;k++){const ph=(t*.8+k/6)%1,a=ph*6.283+k;ctx.fillStyle=`rgba(220,245,255,${.8*(1-ph)})`;ctx.fillRect(x+W/2+Math.cos(a)*ph*(W/2-18)-1,y+H/2+Math.sin(a)*ph*(H/2-18)-1,3,3);}
   ctx.strokeStyle=`rgba(255,255,255,${.25+.15*Math.sin(t*3)})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+W/2,y+H/2,10+((t*14)%24),0,7);ctx.stroke();}
 }

 for(const b of v.buildings){if(b.house||!player)continue;
  const dx=b.door.x*VT+VT/2,dy=b.door.y*VT+VT/2,d=Math.hypot(player.x-dx,player.y-dy);
  if(d<150){const k=1-Math.max(0,d-60)/90,r=ctx.createRadialGradient(dx,dy-30,4,dx,dy-30,90);r.addColorStop(0,`rgba(255,226,160,${.38*k})`);r.addColorStop(1,'rgba(255,226,160,0)');ctx.fillStyle=r;ctx.fillRect(dx-100,dy-130,200,200);
   const bob=reduced?0:Math.sin(t*5)*4;ctx.fillStyle=`rgba(255,240,200,${.55+.4*k})`;ctx.beginPath();ctx.moveTo(dx-10,dy-34+bob);ctx.lineTo(dx+10,dy-34+bob);ctx.lineTo(dx,dy-20+bob);ctx.fill();
   if(label&&d<120)label('ENTRA',dx,dy-42+bob,'#fff3d2',13);}
 }
 ctx.restore();
}
