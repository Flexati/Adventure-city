import {fresh,hydrate,serialize,step,interact,nearby,objective,objectivePoint,OUTCOMES,SPOTS,WALLS,WIDTH,HEIGHT,dist,clamp} from './engine.mjs';
import {INTRO,OWNER,CLUE,BOSS,DECISION,RETURN,END} from './story.mjs';
const $=id=>document.getElementById(id),canvas=$('world'),ctx=canvas.getContext('2d');
const STORE='city-adventure-pizza-v1',SETTINGS='city-adventure-settings-v1';
let s=fresh(),running=false,paused=false,inDialogue=false,selected='kai',last=0,saveClock=0,toastTime=0,view={w:0,h:0,scale:1,x:0,y:0};
let settings={sound:true,easy:false,motion:matchMedia('(prefers-reduced-motion: reduce)').matches,large:false};
try{settings={...settings,...JSON.parse(localStorage.getItem(SETTINGS)||'{}')};}catch{}
let saved=null;try{saved=hydrate(localStorage.getItem(STORE));}catch{}
const keys=new Set(),held=new Set();let stick={x:0,y:0,id:null};
const audio={};for(const name of ['hub','boss','ending','hit','zara','dodge','clue','choice','duo','pizza']){audio[name]=new Audio(`assets/${name}.ogg`);audio[name].preload='none';audio[name].volume=['hub','boss','ending'].includes(name)?.22:.5;}
let music=null;
const combat=new Image();combat.src='art/combat.png';
const heroes=new Image();heroes.src='assets/heroes.png';const bosses=new Image();bosses.src='assets/bosses.png';
function sound(name){if(!settings.sound||document.hidden)return;const a=audio[name];if(a){a.currentTime=0;a.play().catch(()=>{});}}
function soundtrack(name){if(music===name){if(settings.sound&&!paused&&!document.hidden)audio[name].play().catch(()=>{});return;}if(music)audio[music].pause();music=name;audio[name].loop=true;if(settings.sound&&!paused&&!document.hidden)audio[name].play().catch(()=>{});}
function toast(text){$('toast').textContent=text;$('toast').classList.add('visible');toastTime=4;}
function save(){try{localStorage.setItem(STORE,serialize(s));saved=hydrate(serialize(s));}catch{toast('Salvataggio non disponibile in questo browser. Tieni aperta la partita.');}}
function clearInput(){keys.clear();held.clear();stick={x:0,y:0,id:null};$('knob').style.transform='';}
function btn(label,fn,description){const b=document.createElement('button');b.textContent=label;if(description){const sub=document.createElement('small');sub.textContent=description;b.append(sub);}b.onclick=fn;$('dialog-options').append(b);return b;}
let portrait=document.createElement('canvas');portrait.width=110;portrait.height=110;portrait.style.cssText='float:right;width:84px;height:84px;border-radius:16px;margin:0 0 8px 12px;background:#102637';$('speaker').before(portrait);
function drawPortrait(speaker){const c=portrait.getContext('2d');c.clearRect(0,0,110,110);const im=speaker==='Robot Pizzaiolo'?bosses:heroes;portrait.hidden=!['Kai','Zara','Robot Pizzaiolo'].includes(speaker)||!im.complete||!im.naturalWidth;if(portrait.hidden)return;const scale=im.naturalWidth/1448;
 const box=speaker==='Kai'?[535,0,180,220]:speaker==='Zara'?[1247,0,190,220]:[245,55,205,240];c.drawImage(im,...box.map(n=>n*scale),0,0,110,110);}
function dialog(lines,done=()=>{}){inDialogue=true;clearInput();$('dialogue').hidden=false;let i=0;function next(){if(i>=lines.length){$('dialogue').hidden=true;inDialogue=false;done();if(!inDialogue)$('world').focus();return;}const [who,line]=lines[i++];$('speaker').textContent=who==='Kai'?'Nox':who==='Zara'?'Lulù':who;$('line').textContent=line;portrait.hidden=true;$('dialog-options').replaceChildren();btn(i===lines.length?'Ci siamo →':'Continua →',next).focus();}next();}
function decision(){dialog(DECISION,()=>{inDialogue=true;$('dialogue').hidden=false;$('speaker').textContent='Come volete cambiare il quartiere?';$('line').textContent='Nessuna soluzione risolve tutto. La vostra scelta resterà nella città.';portrait.hidden=true;$('dialog-options').replaceChildren();
 for(const [id,label,detail] of [['repair','Ripariamo il robot','Un alleato e una nuova strada. Lia dovrà recuperare gli ordini.'],['shop','Prima salviamo la pizzeria','Il locale torna vivo. Il robot resta diffidente.'],['show','Facciamone una sfida leale','Una nuova arena. Il robot diventa un rivale, non un aiutante.']])btn(label,()=>commitChoice(id),detail);
 $('dialog-options').firstChild.focus();});}
async function commitChoice(id){const {choose}=await import('./engine.mjs');if(!choose(s,id))return;$('dialogue').hidden=true;inDialogue=false;sound('choice');soundtrack('hub');save();toast(OUTCOMES[id].world);$('world').focus();}
function begin(resume=false){s=resume&&saved?hydrate(serialize(saved)):fresh(selected);running=true;paused=false;inDialogue=false;$('menu').hidden=true;$('hud').hidden=false;$('controls').hidden=false;clearInput();soundtrack(s.stage==='boss'?'boss':s.finished?'ending':'hub');
 if(resume){if(s.stage==='choice')decision();else toast('Bentornati a Rookside. Il quartiere si ricorda.');}else{save();dialog(INTRO);}canvas.focus();}
for(const b of document.querySelectorAll('[data-hero]'))b.onclick=()=>{selected=b.dataset.hero;for(const x of document.querySelectorAll('[data-hero]')){x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b));}};
$('start').onclick=()=>{if(saved){dialog([['Una nuova storia','Iniziare di nuovo sostituirà il salvataggio locale. Vuoi ricominciare?']],()=>{inDialogue=true;$('dialogue').hidden=false;portrait.hidden=true;$('speaker').textContent='Ricominciare il capitolo?';$('line').textContent='Puoi invece continuare la storia già salvata.';$('dialog-options').replaceChildren();btn('Inizia una nuova storia',()=>{$('dialogue').hidden=true;begin();});btn('Conserva il salvataggio',()=>{$('dialogue').hidden=true;inDialogue=false;});});}else begin();};
$('continue').hidden=!saved;$('continue').onclick=()=>begin(true);
function pause(value=true){if(!running||inDialogue)return;paused=value;clearInput();$('settings').hidden=!value;if(value){save();if(music)audio[music].pause();$('resume').focus();}else{soundtrack(music||'hub');canvas.focus();}}
$('pause').onclick=()=>pause();$('resume').onclick=()=>pause(false);$('backmenu').onclick=()=>{save();running=false;paused=false;$('settings').hidden=true;$('menu').hidden=false;$('controls').hidden=true;$('hud').hidden=true;$('continue').hidden=false;if(music)audio[music].pause();};
for(const id of ['sound','easy','motion','large']){$(id).checked=settings[id];$(id).onchange=()=>{settings[id]=$(id).checked;document.body.classList.toggle('large',!!settings.large);try{localStorage.setItem(SETTINGS,JSON.stringify(settings));}catch{}if(!settings.sound){for(const a of Object.values(audio))a.pause();}};}document.body.classList.toggle('large',!!settings.large);
function use(){if(!running||paused||inDialogue)return;const before=s.stage,n=interact(s);if(!n)return;
 if(n==='owner'){if(before==='arrival')dialog(OWNER,()=>{toast('Avvicinati ai carrelli e attacca. I cerchi annunciano i loro colpi.');save();});else if(s.outcome)dialog(RETURN[s.outcome],save);else dialog([['Lia','Le tre consegne sono ancora in strada. I carrelli hanno il logo della pizza: non puoi sbagliare.']]);}
 else if(n==='clue'){sound('clue');dialog(CLUE,save);}
 else if(n==='car'){if(s.finished){soundtrack('ending');dialog(END,()=>{dialog([['Fine del capitolo pilota',`${OUTCOMES[s.outcome].title}. ${s.clue?'Avete trovato la scatola fuori copione.':'La scatola fuori copione vi aspetta ancora nel vicolo a nord.'} Potete continuare a esplorare il quartiere e usare ciò che avete aperto.`]],save);});}else dialog([['Nox','La Vortex ci aspetta. Prima aiutiamo Lia.'],['Lulù','È la prima volta che questa macchina è più paziente di me.']]);}
 else if(n==='rematch'){soundtrack('boss');toast('Rivincita amichevole. La scelta del quartiere resta tua.');}
 else toast(n==='rest'?'Vita ripristinata. Offre Lia.':'Il robot vi accompagna oltre il vicolo.');save();}
$('interact').onclick=use;
for(const id of ['attack','dodge','assist','magic']){const b=$(id);b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);held.add(id);};for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>held.delete(id));b.onkeydown=e=>{if(e.code==='Enter'||e.code==='Space'){e.preventDefault();held.add(id);}};b.onkeyup=()=>held.delete(id);}
const stickEl=$('stick');function updateStick(e){const r=stickEl.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2,d=Math.hypot(x,y),factor=35/Math.max(35,d);stick.x=x*factor/35;stick.y=y*factor/35;$('knob').style.transform=`translate(${stick.x*30}px,${stick.y*30}px)`;}
stickEl.onpointerdown=e=>{if(stick.id!==null)return;stick.id=e.pointerId;stickEl.setPointerCapture(e.pointerId);updateStick(e);};stickEl.onpointermove=e=>{if(e.pointerId===stick.id)updateStick(e);};for(const ev of ['pointerup','pointercancel','lostpointercapture'])stickEl.addEventListener(ev,e=>{if(e.pointerId===stick.id){stick={x:0,y:0,id:null};$('knob').style.transform='';}});
window.addEventListener('keydown',e=>{if(e.code==='Escape'&&running&&!inDialogue){e.preventDefault();pause(!paused);return;}if(!running||paused||inDialogue)return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyW','KeyA','KeyS','KeyD','KeyJ','KeyL','KeyK','KeyQ','KeyE','ShiftLeft','ShiftRight'].includes(e.code)){e.preventDefault();keys.add(e.code);if(e.code==='KeyE'&&!e.repeat)use();}});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{clearInput();if(running&&!inDialogue)pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();if(running){save();if(!inDialogue)pause();}Object.values(audio).forEach(a=>a.pause());}});
function input(){return {x:stick.x+(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0),y:stick.y+(keys.has('ArrowDown')||keys.has('KeyS')?1:0)-(keys.has('ArrowUp')||keys.has('KeyW')?1:0),attack:held.has('attack')||keys.has('KeyJ')||keys.has('Space'),dodge:held.has('dodge')||keys.has('KeyK')||keys.has('ShiftLeft')||keys.has('ShiftRight'),magic:held.has('magic')||keys.has('KeyL'),assist:held.has('assist')||keys.has('KeyQ')};}
// All scenery and in-world actors are prototype vector art, not falsely cut animation sheets.
function rect(x,y,w,h,color,r=0){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function line(x,y,xx,yy,color,width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(xx,yy);ctx.stroke();}
function text(t,x,y,size=14,color='#18384a',align='center'){ctx.fillStyle=color;ctx.font=`800 ${size}px system-ui`;ctx.textAlign=align;ctx.fillText(t,x,y);}
function pizza(x,y,r=18){ellipse(x,y,r,r,'#c56f42');ellipse(x,y,r-3,r-3,'#ffd77b');for(let i=0;i<5;i++){const a=i*1.256;ellipse(x+Math.cos(a)*r*.52,y+Math.sin(a)*r*.52,3,3,'#e75d57');}}
function building(w,color,name,awning){rect(w.x+12,w.y+20,w.w,w.h,'#244b4a35',12);rect(w.x,w.y,w.w,w.h,color,10);rect(w.x,w.y,w.w,22,'#ffffff25',8);rect(w.x+14,w.y+w.h-30,w.w-28,30,'#24485525');for(let x=w.x+30;x<w.x+w.w-30;x+=85){rect(x,w.y+48,45,60,'#254d62',5);rect(x+5,w.y+54,16,23,'#9ad5d3',2);rect(x+26,w.y+54,14,23,'#a8dddc',2);rect(x-4,w.y+108,53,7,'#e3d6b0',2);}
 rect(w.x+w.w*.22,w.y+w.h-120,w.w*.56,40,'#173b4e',5);text(name,w.x+w.w*.5,w.y+w.h-92,18,'#fff0c8');rect(w.x+w.w*.36,w.y+w.h-78,w.w*.28,78,'#23495b',4);if(awning){for(let i=0;i<10;i++)rect(w.x+25+i*(w.w-50)/10,w.y+w.h-64,(w.w-50)/10,22,i%2?'#fff1cc':awning,3);}}
function tree(x,y){ellipse(x+8,y+5,38,15,'#234b4422');rect(x-6,y-50,12,55,'#966649',4);ellipse(x,y-62,37,40,'#367f70');ellipse(x-15,y-75,26,28,'#4a9b77');ellipse(x+12,y-82,24,25,'#68b88b');}
function marker(p,label,color='#ffdb83'){ellipse(p.x,p.y+5,30,11,'#fff5cf55');rect(p.x-18,p.y-85,36,30,color,10);text(label,p.x,p.y-63,19);}
function person(x,y,hero,walk=false,companion=false){
 if(hero==='lia'){ellipse(x,y+3,22,8,'#183b4738');rect(x-13,y-36,26,35,'#dc765e',6);ellipse(x,y-52,16,19,'#e9b58c');ellipse(x,y-67,20,10,'#663f35');return;}
 const action=!companion?s.action:null,dir=action?.dir||s.face;
 const row=(hero==='zara'?2:0)+(action?.kind==='magic'?1:0);
 const frame=action?Math.min(3,Math.floor(action.time/action.duration*4)):0;
 const bob=walk&&!settings.motion?Math.sin(s.playtime*13)*2:0;
 ellipse(x,y+3,23,8,'#183b4738');
 if(combat.complete&&combat.naturalWidth){ctx.save();ctx.translate(x,y+bob);ctx.scale(dir.x<0?-1:1,1);ctx.imageSmoothingEnabled=false;
 const cw=combat.naturalWidth/4,ch=combat.naturalHeight/4;
 ctx.drawImage(combat,frame*cw,row*ch,cw,ch,-38,-90,96,96);ctx.restore();}
}
function robot(b,big=false){const x=b.x,y=b.y;ellipse(x,y+10,big?46:26,big?15:9,'#1b3f4933');rect(x-(big?29:18),y-32,big?58:36,40,'#d75f58',8);rect(x-(big?33:20),y-67,big?66:40,40,'#fff1d3',10);rect(x-(big?23:14),y-58,big?46:28,22,'#244557',7);ellipse(x-9,y-49,3,4,'#ffe19a');ellipse(x+9,y-49,3,4,'#ffe19a');ellipse(x-20,y+8,10,10,'#294253');ellipse(x+20,y+8,10,10,'#294253');if(big){ellipse(x,y-75,35,10,'#fff8e9');ellipse(x-14,y-85,15,15,'#fff8e9');ellipse(x+10,y-88,20,17,'#fff8e9');pizza(x-49,y-28,22);pizza(x+49,y-28,22);}
 else pizza(x,y-12,12);
 if(b.hp>0){rect(x-27,y-110,54,6,'#1c4054',3);rect(x-27,y-110,54*b.hp/b.max,6,'#ffd47e',3);}if(b.state==='recover')text('SCOPERTO!',x,y-125,12,'#173b4e');}
function drawWorld(){ctx.fillStyle='#83bda0';ctx.fillRect(0,0,WIDTH,HEIGHT);
 // Footpaths, avenue and brickwork.
 rect(0,380,2000,365,'#e7cda0');rect(0,430,2000,265,'#77969a');rect(580,0,300,1100,'#e7cda0');rect(625,0,210,1100,'#77969a');rect(0,770,640,200,'#d6c18e');
 for(let x=0;x<2000;x+=100){rect(x,552,48,6,'#e8dcb4',3);for(let y=395;y<430;y+=17)line(x,y,x+70,y,'#bcaf8d',1);}
 for(let y=15;y<1100;y+=95)rect(727,y,5,44,'#e8dcb4',2);
 for(let i=0;i<6;i++){rect(590+i*38,458,22,190,'#eee5ca');rect(1350+i*26,444,16,205,'#eee5ca');}
 building(WALLS[0],'#e8aa72','LIA · PIZZA & CHIACCHIERE','#d45b59');building(WALLS[1],'#77aeb1','OFFICINA / DIETRO LE QUINTE','#f3cd83');building(WALLS[2],'#9b9ac1','CINEMA AURORA','#b66992');building(WALLS[3],'#72999b','LAVANDERIA DELLE NUVOLE','#e5c67b');
 for(const [x,y] of [[55,470],[475,455],[580,110],[1380,160],[1920,460],[1420,960],[1820,950],[75,730],[520,930],[1270,745]])tree(x,y);
 for(const [x,y] of [[460,740],[1300,350],[1880,760]]){rect(x-30,y-20,60,15,'#b17a59',4);line(x-22,y-5,x-22,y+12,'#305056',5);line(x+22,y-5,x+22,y+12,'#305056',5);}
 // The Vortex is a usable checkpoint, with a visible outcome souvenir.
 ellipse(180,900,80,22,'#173c4933');rect(108,825,145,68,'#fff0cf',18);rect(131,804,96,50,'#dce8da',15);rect(143,812,71,30,'#467d8c',7);rect(111,866,140,12,'#c1cdbd',4);ellipse(130,888,15,16,'#244357');ellipse(232,888,15,16,'#244357');rect(108,850,12,12,'#ffce70',3);rect(240,850,12,12,'#ed796b',3);if(s.outcome)text(s.outcome==='repair'?'♥':s.outcome==='shop'?'★':'#1',182,867,17,'#ce6667');text('VORTEX VX-3',180,934,12,'#385b60');
 // Lia and optional anomaly.
 person(SPOTS.owner.x,SPOTS.owner.y,'lia');text('LIA',SPOTS.owner.x,SPOTS.owner.y-82,13);if(s.stage==='arrival'||s.stage==='return'&&!s.visited)marker(SPOTS.owner,'!');
 if(!s.clue){rect(763,230,34,25,'#f3d287',3);line(763,236,797,236,'#bb7852',2);marker(SPOTS.clue,'?','#b5eff0');text('DOPO IL BOSS',780,277,9);}
 if(s.stage==='rescue')for(const e of s.enemy)if(e.hp>0)robot(e);else{pizza(e.x,e.y,14);text('✓',e.x,e.y-25,22,'#26594a');}
 if(['boss','choice'].includes(s.stage)){robot(s.boss,true);text('ROBOT PIZZAIOLO',s.boss.x,s.boss.y-145,16);}
 if(s.stage==='return'||s.stage==='done'){
 if(s.outcome==='repair'){rect(940,337,320,43,'#54ae91',7);text('PASSAGGIO CONSEGNE',1100,365,17,'#f3f2d0');marker(SPOTS.shortcut,'↗','#aff1d0');robot({...s.boss,x:1110,y:420,hp:0},true);}
 if(s.outcome==='shop'){rect(345,715,95,35,'#f5d192',8);pizza(390,722,17);marker(SPOTS.rest,'+','#aff1d0');text('OFFRE LIA',390,780,13);}
 if(s.outcome==='show'){ctx.strokeStyle='#f5c173';ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(1660,815,120,55,0,0,7);ctx.stroke();marker(SPOTS.rematch,'★');text('RIVINCITA LEALE',1660,890,17);}}
 // Telegraphs have both a shape and a text label, never colour alone.
 const active=s.stage==='boss'?[s.boss]:s.enemy;for(const e of active)if(e.hp>0&&e.state==='warn'&&e.target){const r=e===s.boss?(e.cycle%2?105:150):75;ellipse(e.target.x,e.target.y,r,r*.65,'#ef625846');ctx.strokeStyle='#a83d40';ctx.lineWidth=4;ctx.setLineDash([8,6]);ctx.beginPath();ctx.ellipse(e.target.x,e.target.y,r,r*.65,0,0,7);ctx.stroke();ctx.setLineDash([]);text('! SCHIVA',e.target.x,e.target.y-14,17,'#763334');}
 const walk=Math.hypot(input().x,input().y)>.05&&!paused&&!inDialogue;person(s.x-48,s.y+28,s.hero==='kai'?'zara':'kai',walk,true);
 if(s.inv<=0||settings.motion||Math.floor(performance.now()/90)%2===0)person(s.x,s.y,s.hero,walk);text(s.hero==='kai'?'NOX':'LULÙ',s.x,s.y-82,12,'#173b4e');
 for(const e of s.effects){ctx.globalAlpha=clamp(e.ttl/.3,0,1);if(e.to){line(e.x,e.y,e.to.x,e.to.y,e.color,e.magic?12:4);line(e.x,e.y,e.to.x,e.to.y,'#ffffff',e.magic?4:1);ellipse(e.to.x,e.to.y,e.magic?15:7,e.magic?15:7,e.color);}else text(e.label,e.x,e.y-(.7-e.ttl)*22,23,e.color);ctx.globalAlpha=1;}
}
function render(){const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,2);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}view.w=w;view.h=h;view.scale=w<650?.76:Math.min(1.1,h/690);view.x=clamp(s.x-w/view.scale*.5,0,Math.max(0,WIDTH-w/view.scale));view.y=clamp(s.y-h/view.scale*.48,0,Math.max(0,HEIGHT-h/view.scale));ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.save();ctx.scale(view.scale,view.scale);ctx.translate(-view.x,-view.y);drawWorld();ctx.restore();
 if(!running)return;
 const p=objectivePoint(s),px=(p.x-view.x)*view.scale,py=(p.y-view.y)*view.scale;if((px<45||px>w-45||py<110||py>h-150)&&s.stage!=='done'&&s.stage!=='choice'){const x=clamp(px,40,w-40),y=clamp(py,120,h-160);ellipse(x,y,20,20,'#163449e8');ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(py-y,px-x));ctx.fillStyle='#ffda85';ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-6,-7);ctx.lineTo(-6,7);ctx.fill();ctx.restore();}
 // A small world map in landscape; portrait uses the unobstructive objective arrow.
 if(w>750){const x=w-175,y=110;rect(x,y,150,83,'#163449dd',8);for(const b of WALLS)rect(x+b.x/14,y+b.y/14,b.w/14,b.h/14,'#749f9a',2);ellipse(x+s.x/14,y+s.y/14,3,3,'#ffe3a3');ellipse(x+p.x/14,y+p.y/14,3,3,'#ff9097');}
 $('magic').disabled=s.magicCooldown>0;$('magic').textContent=s.magicCooldown>0?`Magia ${s.magicCooldown.toFixed(1)}s`:'Magia · L';$('objective').textContent=objective(s);$('health').textContent='♥'.repeat(Math.max(0,s.hp))+'♡'.repeat(6-Math.max(0,s.hp));$('health').setAttribute('aria-label',`Vita ${s.hp} di 6`);$('duo').textContent=`DUO ${s.duo}%`;$('assist').disabled=s.duo<100;$('assist').textContent=s.duo<100?`Insieme ${s.duo}%`:'Insieme · Q';$('dodge').style.opacity=s.dodgeCooldown>0?'.65':'1';const n=nearby(s);$('interact').disabled=!n;$('interact').textContent=n?({owner:'Parla · E',clue:'Esamina · E',car:'Vortex · E',shortcut:'Passaggio · E',rest:'Ristoro · E',rematch:'Rivincita · E'}[n]):'Interagisci · E';$('hint').hidden=!n||inDialogue||paused;$('hint').textContent=n==='clue'?'Una scatola con una scritta insolita…':n==='owner'?'Lia ha qualcosa da dirvi':n==='car'?'La Vortex vi aspetta':OUTCOMES[s.outcome]?.world||'';
}
function frame(t){const dt=Math.min(.05,(t-last)/1000||0);last=t;
 if(running&&!paused&&!inDialogue&&!document.hidden){step(s,input(),dt,settings.easy);saveClock+=dt;if(saveClock>5){save();saveClock=0;}
 for(const e of s.events){if(e.type==='bossStart'){save();soundtrack('boss');dialog(BOSS);}else if(e.type==='victory'){save();soundtrack('hub');decision();}else if(e.type==='retry'){toast('Si riparte insieme. Osserva il segnale, esci dal cerchio, poi attacca.');save();}else if(e.type==='box'){toast(`${s.boxes.length}/3 consegne al sicuro`);save();}else if(e.type==='rematchWin'){toast('Rivincita vinta. Il robot chiede il vostro autografo.');soundtrack('hub');save();}else sound(e.type);}}
 if(toastTime>0){toastTime-=dt;if(toastTime<=0)$('toast').classList.remove('visible');}render();requestAnimationFrame(frame);}
requestAnimationFrame(frame);
// Explicit read-only diagnostics for QA, never a game-state mutation interface.
window.cityAdventure={snapshot:()=>JSON.parse(serialize(s)),view:()=>({...view}),status:()=>({running,paused,inDialogue})};

// Keep keyboard focus inside open modal panels.
document.addEventListener('keydown',e=>{
 if(e.key!=='Tab')return;const panel=!$('dialogue').hidden?$('dialogue'):!$('settings').hidden?$('settings'):null;if(!panel)return;
 const controls=[...panel.querySelectorAll('button,input')].filter(x=>!x.disabled&&!x.hidden);if(!controls.length)return;
 const first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&(document.activeElement===first||!panel.contains(document.activeElement))){e.preventDefault();last.focus();}else if(!e.shiftKey&&(document.activeElement===last||!panel.contains(document.activeElement))){e.preventDefault();first.focus();}
});
// Android lifecycle signal: save and silence even if a dialogue is open.
window.addEventListener('citynativepause',()=>{clearInput();if(running){save();if(!inDialogue)pause();}Object.values(audio).forEach(a=>a.pause());});
