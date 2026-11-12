// Arte procedurale e composizione dei villaggi (D40 + Master Prompt V3): bakeVillage + drawVillageLife.
const VT=64,HID={moon:0,cathedral:1,toxic:2,clockwork:3};
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
function vDrawProp(g,H,p,m){
 const cx=p.x*VT+32,cy=p.y*VT+32,v=(p.x*7+p.y*13)%3,base=['#273848','#352f44','#2d3a22','#3d3226'][H];
 g.fillStyle='#00000066';g.beginPath();g.ellipse(cx,cy+18,18,7,0,0,7);g.fill();
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
function vDrawBuilding(g,b,v,H,env){
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
export function bakeVillage(g,v,id,env,d,bg){
 const N=24,S=N*VT,m=v.mood,H=HID[id]??0,propSet=new Set(v.props.map(p=>p.y*N+p.x));
 if(bg?.naturalWidth===S&&bg?.naturalHeight===S){g.drawImage(bg,0,0,S,S);return;}
 vRect(g,0,0,S,S,'#0d1520');
 const open=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&(v.cells[y*N+x]===1||propSet.has(y*N+x));
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){
  const px=x*VT,py=y*VT;
  if(open(x,y)){
   vFloorTile(g,env,d,px,py,m,v.plaza[y*N+x]===1,x,y,H);
   for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]])if(!open(x+dx,y+dy)){
    vRect(g,px+(dx>0?54:0),py+(dy>0?54:0),dx?10:VT,dy?10:VT,'#080e16');
    vRect(g,px+(dx>0?57:dx<0?2:0),py+(dy>0?57:dy<0?2:0),dx?5:VT,dy?5:VT,vShade(m.trim,-.25));
   }
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
 for(const p of v.props)vDrawProp(g,H,p,m);
 for(const b of [...v.buildings].sort((a,c)=>a.y-c.y))vDrawBuilding(g,b,v,H,env);
 g.globalCompositeOperation='soft-light';g.globalAlpha=.16;vRect(g,0,0,S,S,m.trim);g.globalAlpha=1;g.globalCompositeOperation='source-over';
}
export function drawVillageLife(ctx,t,v,player,{reduced:red=false,label=null}={}){
 const m=v.mood;ctx.save();
 for(const b of v.buildings){
  for(const w of b.windows||[]){const a=red?.35:.14+.2*(.5+.5*Math.sin(t*w.speed+w.phase))+(Math.sin(t*7+w.phase*3)>.96?.18:0);vRect(ctx,w.x,w.y,w.w,w.h,`rgba(255,226,160,${a})`);}
  for(const [i,c] of (b.chimneys||[]).entries())if(!red)for(let k=0;k<4;k++){const ph=((t*.35+k/4+i*.31)%1);vCir(ctx,c.x+Math.sin(ph*6+k+i)*9+ph*14,c.y-ph*70,5+ph*13,c.hot?`rgba(255,150,80,${.3*(1-ph)})`:`rgba(210,220,230,${.26*(1-ph)})`);}
  if(b.clock&&!red){const sc=t%60,mn=(t/60)%60,hr=(t/720)%12,c=b.clock;ctx.lineCap='round';
   for(const [ang,len,wd] of [[hr/12*6.283,c.r*.5,5],[mn/60*6.283,c.r*.75,3]])vLine(ctx,c.x,c.y,c.x+Math.sin(ang)*len,c.y-Math.cos(ang)*len,'#2a1f12',wd);
   vLine(ctx,c.x,c.y,c.x+Math.sin(sc*.6283)*c.r*.85,c.y-Math.cos(sc*.6283)*c.r*.85,'#c2412d',2);}
  for(const s of b.signs||[]){ctx.globalAlpha=red?.15:.1+.1*Math.sin(t*2+s.x);vCir(ctx,s.x,s.y,26,m.glow);ctx.globalAlpha=1;}
 }
 for(const w of v.water)if(!red){const x=w.x*VT,y=w.y*VT,W=w.w*VT,H=w.h*VT;
  if(v.id==='toxic')for(let k=0;k<7;k++){const ph=(t*.5+k*.37)%1;vCir(ctx,x+20+vHash(k,3)*(W-40),y+H-18-ph*(H-30),3+ph*5,0,`rgba(190,255,140,${.7*(1-ph)})`,2);}
  else{for(let k=0;k<6;k++){const ph=(t*.8+k/6)%1,a=ph*6.283+k;vRect(ctx,x+W/2+Math.cos(a)*ph*(W/2-18)-1,y+H/2+Math.sin(a)*ph*(H/2-18)-1,3,3,`rgba(220,245,255,${.8*(1-ph)})`);}
   vCir(ctx,x+W/2,y+H/2,10+((t*14)%24),0,`rgba(255,255,255,${.25+.15*Math.sin(t*3)})`,2);}
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
