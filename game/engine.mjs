export const WIDTH=2000, HEIGHT=1100;
export const SPOTS={owner:{x:340,y:590},clue:{x:780,y:245},boss:{x:1560,y:560},car:{x:180,y:880},shortcut:{x:1025,y:370},rest:{x:390,y:735},rematch:{x:1660,y:800}};
export const WALLS=[{x:50,y:55,w:520,h:325},{x:900,y:50,w:450,h:280},{x:1440,y:55,w:490,h:300},{x:650,y:790,w:590,h:250},{x:60,y:995,w:500,h:80}];
export const OUTCOMES={repair:{title:'Una consegna fuori programma',world:'Scorciatoia del robot aperta',relation:'Robot alleato',flag:'robot_pizzaiolo_ally'},shop:{title:'Il quartiere viene prima',world:'Punto di ristoro della pizzeria attivo',relation:'Robot informatore diffidente',flag:'pizzeria_protected'},show:{title:'Una sfida, non una figuraccia',world:'Arena di rivincita aperta',relation:'Robot rivale sportivo',flag:'robot_pizzaiolo_rival'}};
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const bot=(x,y,id)=>({x,y,id,hp:3,max:3,clock:0,state:'idle',target:null});
export function fresh(hero='kai') {return {version:1,hero,stage:'arrival',x:180,y:780,hp:6,duo:0,clue:false,boxes:[],outcome:null,visited:false,finished:false,deaths:0,playtime:0,enemy:[bot(700,540,0),bot(950,620,1),bot(1150,470,2)],boss:{x:1560,y:560,hp:24,max:24,clock:0,state:'idle',target:null,cycle:0},inv:0,attack:0,dodge:0,dodgeCooldown:0,assistCooldown:0,face:{x:1,y:0},effects:[],events:[],rematches:0};}
export function hydrate(raw) {
 try {const r=JSON.parse(raw);if(r.version!==1||!['kai','zara'].includes(r.hero)||!['arrival','rescue','boss','choice','return','done'].includes(r.stage))return null;
 const s=fresh(r.hero);for(const k of ['clue','visited','finished'])s[k]=r[k]===true;
 for(const k of ['x','y','hp','duo','deaths','playtime','rematches'])if(Number.isFinite(r[k]))s[k]=r[k];
 s.x=clamp(s.x,30,WIDTH-30);s.y=clamp(s.y,30,HEIGHT-30);s.hp=clamp(s.hp,1,6);s.duo=clamp(s.duo,0,100);s.stage=r.stage;
 s.boxes=Array.isArray(r.boxes)?[...new Set(r.boxes.filter(n=>[0,1,2].includes(n)))]:[];
 s.enemy.forEach(e=>{if(s.boxes.includes(e.id))e.hp=0;});
 s.outcome=Object.hasOwn(OUTCOMES,r.outcome)?r.outcome:null;
 if(['return','done'].includes(s.stage)&&!s.outcome)return null;
 if(['choice','return','done'].includes(s.stage))s.boss.hp=0;
 if(s.stage==='boss'){s.x=1350;s.y=600;s.hp=6;} // checkpoint, no stale telegraphs
 return s;}catch{return null;}
}
export function serialize(s){return JSON.stringify(s);}
export function move(s,dx,dy){
 const blocked=(x,y)=>WALLS.some(w=>x+15>w.x&&x-15<w.x+w.w&&y+15>w.y&&y-15<w.y+w.h);
 let x=clamp(s.x+dx,25,WIDTH-25),y=clamp(s.y+dy,25,HEIGHT-25);
 if(!blocked(x,s.y))s.x=x;if(!blocked(s.x,y))s.y=y;
}
function emit(s,type,data={}){s.events.push({type,...data});}
function effect(s,x,y,label,color='#ffe08a'){s.effects.push({x,y,label,color,ttl:.7});}
function hurt(s,n){if(s.inv>0)return;s.hp-=n;s.inv=1.2;emit(s,'hurt');effect(s,s.x,s.y-45,'Ahi!','#ff817b');if(s.hp<=0){s.deaths++;s.hp=6;s.x=s.stage==='boss'?1350:180;s.y=s.stage==='boss'?650:780;s.inv=2;s.boss.hp=s.boss.max;s.boss.state='idle';s.boss.clock=0;s.enemy.forEach(e=>{if(e.hp>0){e.state='idle';e.clock=0;}});emit(s,'retry');}}
export function attack(s){if(s.attack>0)return false;s.attack=s.hero==='kai'?.42:.58;
 const targets=s.stage==='boss'?[s.boss]:s.stage==='rescue'?s.enemy.filter(e=>e.hp>0):[];
 const range=s.hero==='kai'?240:118;const nearest=targets.filter(e=>dist(s,e)<range).sort((a,b)=>dist(s,a)-dist(s,b));
 const hit=s.hero==='kai'?nearest.slice(0,1):nearest;
 for(const e of hit){const boss=e===s.boss;if(boss&&e.state!=='recover'){effect(s,e.x,e.y-65,'Scudo!');continue;}
 e.hp=Math.max(0,e.hp-(boss?(s.hero==='kai'?2:3):1));s.duo=clamp(s.duo+13,0,100);effect(s,e.x,e.y-45,'TAC!',s.hero==='kai'?'#8ce8ff':'#ff9bab');
 s.effects.push({x:s.x,y:s.y-25,to:{x:e.x,y:e.y-25},ttl:.18,color:s.hero==='kai'?'#9af5ff':'#ff8bb2'});
 if(!boss&&e.hp===0){s.boxes.push(e.id);emit(s,'box');}}
 emit(s,s.hero==='kai'?'hit':'zara');return true;
}
export function dodge(s){if(s.dodgeCooldown>0)return false;s.dodge=.22;s.dodgeCooldown=1;s.inv=Math.max(s.inv,.35);emit(s,'dodge');return true;}
export function assist(s){if(s.duo<100||s.assistCooldown>0)return false;s.duo=0;s.assistCooldown=4;s.hp=Math.min(6,s.hp+1);s.inv=1.4;
 if(s.stage==='boss'){s.boss.state='recover';s.boss.clock=0;}else s.enemy.forEach(e=>{e.state='recover';e.clock=-1;});effect(s,s.x,s.y-70,'INSIEME!','#fff4aa');emit(s,'duo');return true;}
export function choose(s,outcome){if(s.stage!=='choice'||!Object.hasOwn(OUTCOMES,outcome))return false;s.outcome=outcome;s.stage='return';s.hp=6;emit(s,'choice');return true;}
export function objective(s){if(s.stage==='arrival')return 'Parla con Lia davanti alla pizzeria';if(s.stage==='rescue')return `Recupera le consegne · ${s.boxes.length}/3 robot fermati`;if(s.stage==='boss')return s.boss.state==='recover'?'Ora! Il robot è scoperto: attacca':'Evita il segnale di attacco, poi colpisci';if(s.stage==='choice')return 'Decidete insieme il futuro del robot';if(s.stage==='return')return s.visited?'Torna alla Vortex per concludere':'Torna da Lia: il quartiere ti aspetta';return 'Capitolo concluso · esplora il quartiere cambiato';}
export function objectivePoint(s){return s.stage==='arrival'?SPOTS.owner:s.stage==='rescue'?(s.enemy.find(e=>e.hp>0)||SPOTS.boss):s.stage==='boss'?SPOTS.boss:s.stage==='return'?(s.visited?SPOTS.car:SPOTS.owner):SPOTS.car;}
export function nearby(s){const options=[];if(dist(s,SPOTS.owner)<100)options.push('owner');if(!s.clue&&dist(s,SPOTS.clue)<85)options.push('clue');if(dist(s,SPOTS.car)<110)options.push('car');if(s.outcome==='repair'&&dist(s,SPOTS.shortcut)<85)options.push('shortcut');if(s.outcome==='shop'&&dist(s,SPOTS.rest)<85)options.push('rest');if(s.outcome==='show'&&dist(s,SPOTS.rematch)<85)options.push('rematch');return options[0]||null;}
export function interact(s){const n=nearby(s);if(!n)return null;
 if(n==='owner'){if(s.stage==='arrival')s.stage='rescue';else if(s.stage==='return')s.visited=true;}
 if(n==='clue'){s.clue=true;emit(s,'clue');}
 if(n==='car'&&s.stage==='return'&&s.visited){s.stage='done';s.finished=true;emit(s,'ending');}
 if(n==='shortcut'){s.x=1270;s.y=410;effect(s,s.x,s.y-50,'Consegna speciale!');}
 if(n==='rest'){s.hp=6;effect(s,s.x,s.y-50,'Una fetta per voi');}
 if(n==='rematch'){s.stage='boss';s.boss={...fresh().boss,max:30,hp:30};s.x=1370;s.y=650;s.rematches++;}
 return n;
}
export function step(s,input,dt,assistMode=false){
 dt=clamp(dt,0,.05);s.playtime+=dt;s.events=[];
 for(const k of ['inv','attack','dodge','dodgeCooldown','assistCooldown'])s[k]=Math.max(0,s[k]-dt);
 s.effects.forEach(e=>e.ttl-=dt);s.effects=s.effects.filter(e=>e.ttl>0);
 let dx=input.x||0,dy=input.y||0,len=Math.hypot(dx,dy);if(len>1){dx/=len;dy/=len;}
 if(len>.05)s.face={x:dx/Math.max(len,1),y:dy/Math.max(len,1)};
 const speed=s.dodge>0?650:210;move(s,(s.dodge>0?s.face.x:dx)*speed*dt,(s.dodge>0?s.face.y:dy)*speed*dt);
 if(input.attack)attack(s);if(input.dodge)dodge(s);if(input.assist)assist(s);
 if(s.stage==='rescue'){
 for(const e of s.enemy.filter(e=>e.hp>0)){e.clock+=dt;if(e.state==='idle'&&dist(s,e)<300){if(dist(s,e)>80){const d=dist(s,e);e.x+=(s.x-e.x)/d*65*dt;e.y+=(s.y-e.y)/d*65*dt;}else{e.state='warn';e.clock=0;e.target={x:s.x,y:s.y};}}
 else if(e.state==='warn'&&e.clock>(assistMode?1.5:1)){if(dist(s,e.target)<75)hurt(s,1);e.state='recover';e.clock=0;effect(s,e.target.x,e.target.y,'PLOF!');}
 else if(e.state==='recover'&&e.clock>1.2){e.state='idle';e.clock=0;}}
 if(s.boxes.length===3){s.stage='boss';s.hp=6;emit(s,'bossStart');}}
 if(s.stage==='boss'){
 const b=s.boss;b.clock+=dt;
 if(b.hp<=0){if(s.outcome){s.stage=s.finished?'done':'return';emit(s,'rematchWin');}else {s.stage='choice';emit(s,'victory');}}
 else if(b.state==='idle'&&dist(s,b)<560&&b.clock>1){b.state='warn';b.clock=0;b.target={x:s.x,y:s.y};b.cycle++;emit(s,'pizza');}
 else if(b.state==='warn'&&b.clock>(assistMode?1.8:1.15)){if(dist(s,b.target)<(b.cycle%2?105:150))hurt(s,assistMode?1:2);effect(s,b.target.x,b.target.y,'PIZZA!','#ffbe65');b.state='recover';b.clock=0;}
 else if(b.state==='recover'&&b.clock>(assistMode?3.2:2.3)){b.state='idle';b.clock=0;}}
}
