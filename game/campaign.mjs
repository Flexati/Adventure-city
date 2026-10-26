import {WEAPONS_V9,createArsenalV9,tickArsenalV9,fireWeaponV9,switchWeaponV9,reloadWeaponV9} from './weapons-v9.mjs';
import {getLayout,routeWaypoint,layoutWalkable,nearestFloor} from './layouts.mjs';
import {createNarrativeState,validateNarrativeState} from './narrative.mjs';
// Campaign rules: independent of DOM, renderer and Android wrapper.
export const SIZE=1536;
// Legacy district definitions; campaign missions bind their own modular geometry.
export const CHAPTERS=[
 {id:'blackout',name:'01 · Blackout',district:'Cantiere Est',threat:'Gang dei Relè',goal:'Riaccendi i 3 relè',kind:0,map:0,color:'#ffb65c',hp:4,speed:66,weapon:'Pistola di servizio',damage:1,cooldown:.40,magic:false,partner:true,nodeLabel:'RELÈ',
  waves:[['raider'],['raider','breaker'],['signal','shooter','raider']],brief:['La gang ha spento il quartiere. Tre relè tengono chiuse le uscite.','Li riattiviamo. Nessuno resta qui dentro.'],end:'Le uscite si aprono. Il relè ha riconosciuto Nox prima che inserisse un codice.'},
 {id:'breach',name:'02 · La breccia',district:'Porto delle Antenne',threat:'Predatori della breccia',goal:'Chiudi le 3 ancore',kind:1,map:1,color:'#58d9ff',hp:9,speed:80,weapon:'Pistola a impulsi',damage:2,cooldown:.36,magic:true,partner:true,nodeLabel:'ANCORA',
  waves:[['raider','raider'],['breaker','shooter','raider'],['signal','breaker','shooter','raider']],brief:['Quel segnale ha aperto qualcosa sopra il porto.','Le ancore alimentano la breccia. Prima loro, poi le creature.'],end:'La breccia cede. Le creature non erano aliene: portavano numeri di serie più vecchi della città.'},
 {id:'contagion',name:'03 · Ultima corsia',district:'Distretto Clinico',threat:'Infetti',goal:'Attiva i 3 filtri, apri il corridoio',kind:2,map:2,color:'#b8f27c',hp:13,speed:58,weapon:'Pistola a scarica',damage:3,cooldown:.32,magic:true,partner:true,nodeLabel:'FILTRO',
  waves:[['raider','raider','signal','raider'],['breaker','raider','shooter','raider'],['brute','breaker','raider','signal','raider']],brief:['Gli infetti seguono il rumore. I filtri possono contenere le spore.','Il corridoio civile è sigillato. Apriamolo, poi pensiamo al resto.'],end:'Il corridoio è aperto. Sotto l’asfalto qualcosa ha sentito il tuo nome.'},
 {id:'zero',name:'04 · Ora zero',district:'Nodo Centrale',threat:'Custodi della frattura',goal:'Spegni i 3 nuclei, abbatti il Custode',kind:3,map:3,color:'#d395ff',hp:18,speed:62,weapon:'Risonatore',damage:4,cooldown:.30,magic:true,partner:true,nodeLabel:'NUCLEO',
  waves:[['raider','shooter','raider'],['breaker','shooter','brute'],['signal','breaker','shooter']],boss:{kind:'custode',hp:300},brief:['Blackout, breccia, contagio. Tutto porta qui.','Allora finisce qui. Tu tieni la linea. Io chiudo il Nodo.'],end:'Il Custode cade. Nel suo nucleo c’è un registro con il tuo nome.'}
];
// Tactical roles are shared by every district; the district atlas changes their silhouette.
export const ROLE_SPECS={
 raider:{speed:1.25,detect:320,windup:.95,radius:68,recovery:.85,hp:1,reach:70},
 breaker:{speed:1.6,detect:300,windup:1.1,radius:92,recovery:1.0,hp:1,reach:96},
 signal:{speed:.95,detect:360,windup:1.3,radius:112,recovery:1.1,hp:1.2,reach:150},
 shooter:{speed:.95,detect:420,windup:.7,radius:0,recovery:.95,hp:.9,reach:330,ranged:true},
 brute:{speed:.9,detect:320,windup:1.35,radius:120,recovery:1.3,hp:2.4,reach:96},
 patrol:{speed:.6,detect:0,windup:1.0,radius:72,recovery:.9,hp:1,reach:74},
 boss:{speed:1,detect:900,windup:1.25,radius:130,recovery:.9,hp:1,reach:150}
};
// v0.6 Blackout role names stay readable by older tests and tools.
export const BLACKOUT_ENEMY_SPECS={
 raider:{speed:66,detect:230,windup:1.0,radius:65,recovery:.9},
 breaker:{speed:80,detect:185,windup:1.2,radius:94,recovery:1.05},
 signal:{speed:50,detect:300,windup:1.35,radius:112,recovery:1.1}
};
const START_SPOTS=[{x:400,y:700},{x:1100,y:700},{x:770,y:420},{x:1350,y:770},{x:650,y:600},{x:880,y:620},{x:200,y:800}];
export const EDGES=[{x:768,y:60},{x:60,y:730},{x:1476,y:730},{x:768,y:1476}];
export const WALLS=[{x:0,y:0,w:530,h:520},{x:1005,y:0,w:531,h:520},{x:0,y:940,w:530,h:596},{x:1005,y:940,w:531,h:596}];
export const GUN_RANGE=310;
export const DEFAULT_NODES=[{x:220,y:710},{x:770,y:200},{x:1300,y:710}];
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const unit=(v)=>{const d=Math.hypot(v.x,v.y);return d>.0001?{x:v.x/d,y:v.y/d}:{x:1,y:0};};
// Slab intersection without per-wall temporary arrays; shared by visibility and the shot ray.
function wallEntry(ax,ay,dx,dy,w,limit){
 let lo=0,hi=limit;
 if(Math.abs(dx)<1e-8){if(ax<w.x||ax>w.x+w.w)return Infinity;}else{const t=(w.x-ax)/dx,u=(w.x+w.w-ax)/dx;lo=Math.max(lo,Math.min(t,u));hi=Math.min(hi,Math.max(t,u));}
 if(Math.abs(dy)<1e-8){if(ay<w.y||ay>w.y+w.h)return Infinity;}else{const t=(w.y-ay)/dy,u=(w.y+w.h-ay)/dy;lo=Math.max(lo,Math.min(t,u));hi=Math.min(hi,Math.max(t,u));}
 return lo<=hi?lo:Infinity;
}
export function visible(a,b){for(const w of (getLayout(a.layoutId||b.layoutId)?.walls||WALLS))if(wallEntry(a.x,a.y,b.x-a.x,b.y-a.y,w,1)!==Infinity)return false;return true;}
// Barriers are Lulù's temporary walls: they stop enemy bodies and shots, never the heroes.
export function moveActor(a,dx,dy,barriers=null){const blocked=(x,y)=>(getLayout(a.layoutId)?.walls||WALLS).some(w=>x+16>w.x&&x-16<w.x+w.w&&y+10>w.y&&y-10<w.y+w.h)||!!barriers?.some(b=>Math.hypot(x-b.x,y-b.y)<b.r+14);const x=clamp(a.x+dx,30,SIZE-30),y=clamp(a.y+dy,30,SIZE-30);if(!blocked(x,a.y))a.x=x;if(!blocked(a.x,y))a.y=y;}
function makeEnemy(s,role,at,id,boss=null){
 const c=s.c,spec=ROLE_SPECS[boss?'boss':role]||ROLE_SPECS.raider,legacy=s.level===0&&s.mission==='blackout'&&BLACKOUT_ENEMY_SPECS[role];
 const hp=boss?boss.hp:Math.max(1,Math.round(c.hp*spec.hp));
 return {id,layoutId:s.layoutId,role:boss?'boss':role,x:at.x,y:at.y,hp,max:hp,clock:(id%4)*.3,state:role==='patrol'?'patrol':'walk',walk:0,hurtAnim:0,deathAnim:0,face:1,boss:!!boss,bossKind:boss?.kind||null,
  moveSpeed:legacy?legacy.speed:c.speed*spec.speed,detectRange:legacy?legacy.detect:(c.dark?spec.detect*.7:spec.detect),windup:(legacy?legacy.windup:spec.windup)+(c.windupBonus||0),attackRadius:legacy?legacy.radius:spec.radius,recovery:legacy?legacy.recovery:spec.recovery,reach:spec.reach,ranged:!!spec.ranged,
  path:at.path||null,pathIndex:0,hunting:false,seen:0,stun:0,phase:0,pattern:0,guard:0,target:null,dir:null};
}
function spawnWave(s,index,initial=false){
 const wave=s.c.waves?.[index];if(!wave)return false;
 const entries=getLayout(s.layoutId)?.entries||EDGES;
 const far=entries.map((p,i)=>({p,i,d:distance(p,s)})).sort((a,b)=>b.d-a.d);
 wave.forEach((role,k)=>{
  const spot=initial?(role.path?.[0]||s.c.spawns?.[k]||START_SPOTS[k%START_SPOTS.length]):s.c.mode==='defend'?entries[(index+k)%entries.length]:far[k%2].p;
  const offset=initial||s.layoutId?{x:0,y:0}:{x:(k%3-1)*46,y:((k+1)%3-1)*46};
  const e=makeEnemy(s,typeof role==='string'?role:role.role,{...spot,x:spot.x+offset.x,y:spot.y+offset.y,path:role.path||null},s.nextId++);e.hunting=!initial;s.enemies.push(e);
 });
 s.wave=index;if(!initial)campaignEvent(s,'wave',{index,count:wave.length});
 return true;
}
export function newRun(hero='nox',level=0,upgrade='power',cityChoice=null,narrative=null,def=null){
 level=clamp(Math.floor(level),0,3);const c=def||CHAPTERS[level];
 const solo=c.partner===false,shield=upgrade==='shield',bonus=(c.hpBonus||0);
 const s={version:5,layoutId:c.layout,mission:c.id,c,narrative:createNarrativeState(narrative||{}),cityChoice:['workshop','shelter'].includes(cityChoice)?cityChoice:null,hero:hero==='lulu'?'lulu':'nox',level,upgrade,
  x:c.start?.x??768,y:c.start?.y??1130,partner:solo?null:{layoutId:c.layout,x:(c.start?.x??768)-54,y:(c.start?.y??1130)+40,walk:0,cd:1.5},hp:(shield?10:8)+bonus,maxHp:(shield?10:8)+bonus,time:0,walk:0,face:{x:0,y:-1},aim:{x:0,y:-1},lock:null,action:null,
  fireCd:0,magicCd:0,dashCd:0,dash:0,inv:0,perfectWindow:0,counterReady:0,hurtAnim:0,duoAnim:0,duo:0,kills:0,status:'playing',events:[],fx:[],
  signature:solo?(hero==='lulu'?'barrier':'overdrive'):'duo',sigCd:0,overdrive:0,heat:0,barriers:[],shots:[],mines:[],channel:null,alert:0,alarm:false,progress:0,waveClock:0,actions:[],
  nodes:(c.nodes||DEFAULT_NODES).map(n=>({x:n.x,y:n.y,on:false})),enemies:[],nextId:0,wave:-1};
 if(c.combatV9){s.arsenal=createArsenalV9(s.hero,c.weaponRewards||[]);if(Object.hasOwn(s.arsenal.ammo,c.weaponSelection))s.arsenal.active=c.weaponSelection;}
 if(c.mode==='defend')s.nodes=[];
 spawnWave(s,0,true);
 if(c.boss){const b=makeEnemy(s,'boss',getLayout(s.layoutId)?.boss||c.boss.at||{x:770,y:430},s.nextId++,c.boss);b.state=s.nodes.length?'dormant':'walk';s.enemies.push(b);}
 return s;
}
export function saveRun(s){return JSON.stringify({version:5,hero:s.hero,level:s.level,upgrade:s.upgrade,status:s.status,cityChoice:s.cityChoice,narrative:createNarrativeState(s.narrative||{})});}
export function loadRun(raw){try{
 const x=JSON.parse(raw);
 if(![4,5].includes(x.version)||!['nox','lulu'].includes(x.hero)||!Number.isInteger(x.level)||x.level<0||x.level>3||!['power','shield'].includes(x.upgrade))return null;
 if(x.cityChoice!=null&&!['workshop','shelter'].includes(x.cityChoice))return null;
 let narrative;
 if(x.version===4){
  narrative=createNarrativeState();
  if(x.cityChoice){narrative.flags.blackout_choice=x.cityChoice;narrative.choices.blackout_power=x.cityChoice;}
 }else{
  narrative=validateNarrativeState(x.narrative);if(!narrative)return null;
 }
 const s=newRun(x.hero,x.level,x.upgrade,x.cityChoice,narrative);
 if(x.status==='cleared'){s.status='cleared';s.enemies=[];s.nodes.forEach(n=>n.on=true);}
 else if(x.status!=='playing'&&x.status!=='failed')return null;
 return s;
}catch{return null;}}
export function nextDistrict(s,upgrade){if(s.status!=='cleared'||s.level===3||!['power','shield'].includes(upgrade))return null;return newRun(s.hero,s.level+1,upgrade,s.cityChoice,s.narrative);}
function campaignEvent(s,type,data={}){s.events.push({type,...data});}
const liveEnemies=s=>s.enemies.filter(e=>e.hp>0&&e.state!=='dormant');
export function aimAt(s,manual,range=GUN_RANGE){if(manual)return unit(manual);const list=liveEnemies(s).filter(e=>distance(s,e)<=range&&visible(s,e)).sort((a,b)=>distance(s,a)-distance(s,b));const old=list.find(e=>e.id===s.lock),e=old&&distance(s,old)<=distance(s,list[0])*1.25?old:list[0];s.lock=e?.id??null;return e?unit({x:e.x-s.x,y:e.y-s.y}):s.aim;}
export function trace(s,dir,range){
 let end=range;for(const w of (getLayout(s.layoutId)?.walls||WALLS)){const entry=wallEntry(s.x,s.y,dir.x,dir.y,w,range);if(entry===Infinity)continue;
  // Preserve the original four-pixel beam stop; gameplay ranges and collision semantics are unchanged.
  const sample=Math.max(4,Math.ceil((entry-1e-9)/4)*4);if(sample<=range)end=Math.min(end,sample-4);
 }return {x:s.x+dir.x*end,y:s.y+dir.y*end};
}
function rememberAction(s,kind){s.actions.push(kind);if(s.actions.length>8)s.actions.shift();}
export function startAttack(s,kind='gun',manual=null){if(s.status!=='playing'||s.action)return false;const c=s.c,abilityUnlocked=c.magic||s.hero==='lulu';if(kind==='magic'&&(!abilityUnlocked||s.magicCd>0)||kind==='gun'&&s.fireCd>0)return false;
 const weapon=kind==='gun'&&s.arsenal?fireWeaponV9(s.arsenal):null;if(kind==='gun'&&s.arsenal&&!weapon)return false;
 if(weapon?.id==='c9'&&s.c.quickdraw&&s.quickdrawWindow>0){weapon.cooldown=.26;s.arsenal.cooldown=.26;s.quickdrawWindow=0;campaignEvent(s,'quickdrawShot');}
 if(weapon&&s.overdrive>0)s.arsenal.cooldown=weapon.cooldown*.5;
 const dir=aimAt(s,manual,kind==='magic'?420:weapon?.range||GUN_RANGE);s.aim=dir;s.action={kind,t:0,duration:kind==='gun'?Math.min(c.cooldown,.34):.65,dir,fired:false};
 if(weapon){s.action.weapon=weapon;s.action.shotsReleased=0;s.action.duration=Math.max(.26,.09+(weapon.burst-1)*.065+.08);}
 if(kind==='gun')s.fireCd=(weapon?.cooldown||c.cooldown)*(s.overdrive>0?.5:1);else s.magicCd=s.upgrade==='power'?3.5:4.5;rememberAction(s,kind);return true;}
function hitEnemy(s,e,n,source='gun'){if(e.hp<=0||e.state==='dormant')return;
 if(e.guard>0&&source==='gun'){campaignEvent(s,'guarded',{x:e.x,y:e.y});return;}
 // Support fire can expose a boss, but the player's command owns the final hit.
 if(source==='partner'&&e.boss){n=Math.min(n,Math.max(0,e.hp-1));if(n<=0)return;}
 if(e.bossKind==='archon'&&s.c.consentFinale&&!s.finalConsent&&e.hp-n<=1){n=Math.max(0,e.hp-1);if(!s.consentRequested){s.consentRequested=true;campaignEvent(s,'finalConsent');}}
 const unaware=e.state==='patrol'&&e.seen<.35;if(unaware){n*=3;campaignEvent(s,'silent',{x:e.x,y:e.y});}
 e.hp=Math.max(0,e.hp-n);e.hurtAnim=.24;if(s.signature!=='barrier')s.duo=clamp(s.duo+(s.overdrive>0?0:source==='partner'?2:5),0,100);
 if(e.state==='patrol'){e.state='walk';e.clock=0;}
 campaignEvent(s,'impact',{x:e.x,y:e.y,amount:n,boss:e.boss});
 if(e.hp===0){e.deathAnim=.7;s.kills++;campaignEvent(s,'down',{x:e.x,y:e.y,boss:e.boss,source});}}
function release(s){if(s.action.weapon){releaseWeaponV9(s);return;}const a=s.action,c=s.c,magic=a.kind==='magic',area=magic&&s.hero==='lulu',range=magic?(area?240:420):GUN_RANGE;const end=trace(s,a.dir,range);
 const hitList=liveEnemies(s).filter(e=>{const dx=e.x-s.x,dy=e.y-s.y,d=Math.hypot(dx,dy),along=dx*a.dir.x+dy*a.dir.y,side=Math.abs(dx*a.dir.y-dy*a.dir.x);return d<=range&&visible(s,e)&&along>=0&&(area?along/Math.max(1,d)>.3:side<(e.boss?34:22)+(magic?14:3));}).sort((x,y)=>distance(s,x)-distance(s,y));
 // Ordinary rounds stop at the first solid target: a mine cannot be disarmed through an enemy.
 const mine=!magic?(s.mines||[]).filter(m=>{const dx=m.x-s.x,dy=m.y-s.y,along=dx*a.dir.x+dy*a.dir.y;return m.hp>0&&along>=0&&along<=range&&Math.abs(dx*a.dir.y-dy*a.dir.x)<23&&visible(s,{...m,layoutId:s.layoutId});}).sort((x,y)=>distance(s,x)-distance(s,y))[0]:null;
 const mineHit=mine&&(!hitList[0]||distance(s,mine)<distance(s,hitList[0]));
 if(mineHit){hitList.length=0;mine.hp=0;campaignEvent(s,'mineDisarmed',{x:mine.x,y:mine.y});}
 const resonance=magic&&s.hero==='lulu';let n=resonance?c.damage+1:magic?c.damage*3+2:c.damage;if(s.overdrive>0)n+=Math.max(1,Math.ceil(c.damage/2));
 if(s.counterReady>0){n+=Math.max(1,c.damage);s.counterReady=0;campaignEvent(s,'counter');for(const e of hitList)if(e.guard>0){e.guard=0;campaignEvent(s,'guardBroken',{x:e.x,y:e.y});}}
 for(const e of area?hitList:hitList.slice(0,1)){hitEnemy(s,e,n,magic?'magic':'gun');if(resonance&&e.hp>0){e.state='stun';e.stun=(c.mode==='stealth'?5:2.2)+(c.resonanceBonus||0);e.clock=0;}}
 if(magic&&s.hero==='nox'&&c.dark)s.reveal=2.6;
 const impact=mineHit?mine:!area&&hitList[0]?hitList[0]:end;campaignEvent(s,magic?'magic':'shot',{x:s.x,y:s.y,dir:a.dir,to:{x:impact.x,y:impact.y},area});
}
// Weapon rays use the same walls, target state and player-owned boss damage as legacy attacks.
function releaseWeaponV9(s){
 const a=s.action,w=a.weapon,targets=liveEnemies(s),counter=s.counterReady>0;
 if(counter){s.counterReady=0;campaignEvent(s,'counter');}
 for(let pellet=0;pellet<w.pellets;pellet++){
  const angle=Math.atan2(a.dir.y,a.dir.x)+(pellet-(w.pellets-1)/2)*w.spread,dir={x:Math.cos(angle),y:Math.sin(angle)};
  const hits=targets.filter(e=>{const dx=e.x-s.x,dy=e.y-s.y;return distance(s,e)<=w.range&&visible(s,e)&&dx*dir.x+dy*dir.y>=0&&Math.abs(dx*dir.y-dy*dir.x)<(e.boss?37:25);}).sort((x,y)=>distance(s,x)-distance(s,y)).slice(0,w.pierce);
  const damage=s.c.damage*w.damage+(counter?s.c.damage:0)+(s.overdrive>0?s.c.damage*.5:0);
  let from=s;
  for(let i=0;i<hits.length;i++){
   const e=hits[i];if(counter)e.guard=0;hitEnemy(s,e,damage*(i>=w.pierce?.7:1),'gun');
   if(w.stun&&!e.boss&&e.hp>0){e.state='stun';e.stun=w.stun;e.clock=0;}
   if(i>=w.pierce)campaignEvent(s,'shot',{x:from.x,y:from.y,to:{x:e.x,y:e.y},dir,weapon:w.id});from=e;
   if(w.chain&&hits.length<1+w.chain){const next=targets.filter(t=>t.hp>0&&!hits.includes(t)&&distance(e,t)<=w.chainRange&&visible(e,t)).sort((x,y)=>distance(e,x)-distance(e,y))[0];if(next)hits.push(next);}
  }
  const end=hits[0]||trace(s,dir,w.range);campaignEvent(s,'shot',{x:s.x,y:s.y,to:{x:end.x,y:end.y},dir,weapon:w.id});
 }
}
// Boss checkpoint after a defeat: devices stay secured, minions are gone, the boss is awake at full strength.
export function resumeAtBoss(s){const b=s.enemies.find(e=>e.boss);if(!b||s.status!=='playing')return false;
 for(const n of s.nodes)n.on=true;s.enemies=[b];s.wave=Math.max(0,(s.c.waves?.length||1)-1);b.state='walk';b.clock=0;b.hunting=true;s.actions=[];return true;}
function nodeContested(s,n){return liveEnemies(s).some(e=>distance(e,n)<145&&e.state!=='patrol'&&e.state!=='stun');}
function activateNode(s,n){n.on=true;s.channel=null;s.hp=Math.min(s.maxHp,s.hp+2);const count=s.nodes.filter(v=>v.on).length;
 campaignEvent(s,'node',{x:n.x,y:n.y,nodeIndex:s.nodes.indexOf(n),firstActive:count===1,count});
 if(s.c.mode!=='stealth'&&s.wave<(s.c.waves?.length||0)-1)spawnWave(s,s.wave+1);
 if(s.c.boss&&count===s.nodes.length)wakeBoss(s);}
export function interactNode(s){if(s.status!=='playing')return false;const n=s.nodes.find(n=>!n.on&&distance(s,n)<85);if(!n)return false;if(nodeContested(s,n)){campaignEvent(s,'blocked');return false;}activateNode(s,n);return true;}
function startChannel(s){const n=s.nodes.find(n=>!n.on&&distance(s,n)<85);if(!n)return false;if(nodeContested(s,n)){campaignEvent(s,'blocked');return false;}
 const need=s.c.channel??(s.hero==='lulu'?.45:.8);if(need<=0){activateNode(s,n);return true;}s.channel={node:s.nodes.indexOf(n),t:0,need};campaignEvent(s,'channel');return true;}
// The boss reads the rhythm of its own fight, never shots spent on the minions before it woke.
function wakeBoss(s){const b=s.enemies.find(e=>e.boss&&e.state==='dormant');if(!b)return;b.state='walk';b.clock=0;s.actions=[];for(const [i,role]of (s.c.boss.openingAdds||[]).entries()){const at=getLayout(s.layoutId)?.entries[i]||EDGES[i];const escort=makeEnemy(s,role,at,s.nextId++);escort.hunting=true;s.enemies.push(escort);}campaignEvent(s,'bossWake',{x:b.x,y:b.y,kind:b.bossKind});}
function hurtHero(s,source){if(s.inv>0)return false;s.hp--;s.hurtAnim=.28;s.inv=.7;if(s.channel){s.channel=null;campaignEvent(s,'channelBroken');}campaignEvent(s,'hurt',{source});return true;}
function perfectDodge(s){s.perfectWindow=0;s.counterReady=.6;s.duo=clamp(s.duo+(s.signature==='barrier'?0:14),0,100);campaignEvent(s,'perfectDodge',{x:s.x,y:s.y});}
// An attack resolves against the hero: damage, plain i-frames, or Perfect Dodge.
function resolveThreat(s,source){if(s.perfectWindow>0){perfectDodge(s);return 'perfect';}if(hurtHero(s,source))return 'hit';return 'avoided';}
function fireShot(s,e,to,speed=430,spread=0){const d=unit({x:to.x-e.x,y:to.y-e.y}),a=Math.atan2(d.y,d.x)+spread;s.shots.push({x:e.x,y:e.y-34,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,life:1.6,boss:e.boss});}
function patrolSees(s,e){if(e.stun>0)return false;const d=distance(s,e);if(d>(s.c.vision||240)||!visible(e,s))return false;const f=e.dir||{x:e.face,y:0},to=unit({x:s.x-e.x,y:s.y-e.y});return f.x*to.x+f.y*to.y>Math.cos(s.c.cone||.6)||d<60;}
function raiseAlarm(s){if(s.alarm)return;s.alarm=true;s.alert=1;for(const e of s.enemies)if(e.hp>0&&e.state==='patrol'){e.state='walk';e.clock=0;}campaignEvent(s,'alarm');if(s.c.alarmWave)s.c.waves&&spawnWave(s,s.c.alarmWave);}
// Rook commits his aim before firing. Walls use the same collision rules as every shot.
function rookThink(s,e,dt){
 if(e.hp/e.max<.5&&e.phase===0){e.phase=1;s.rookDark=true;
  const at=getLayout(s.layoutId)?.entries[0]||{x:768,y:180};
  const add=makeEnemy(s,'breaker',at,s.nextId++);add.hunting=true;s.enemies.push(add);
  campaignEvent(s,'bossPhase',{phase:1,kind:'rook'});}
 e.face=s.x<e.x?-1:1;
 if(e.state==='rookAim'){
  if(e.clock<e.windup*.5)e.target={x:s.x,y:s.y};
  if(e.clock>=e.windup){for(let i=-1;i<=1;i++)fireShot(s,e,e.target,365,i*.095);campaignEvent(s,'rookShot',{x:e.x,y:e.y});e.state='recover';e.clock=0;}
 }else if(e.state==='recover'){
  if(e.clock>=1.35){e.state='walk';e.clock=0;}
 }else if(e.state==='rookMove'){
  const goal=routeWaypoint(getLayout(s.layoutId),e,e.reposition),u=unit({x:goal.x-e.x,y:goal.y-e.y}),before={x:e.x,y:e.y};
  moveActor(e,u.x*125*dt,u.y*125*dt,s.barriers);e.walk+=distance(before,e)*.06;
  if(distance(e,e.reposition)<32||e.clock>2.4){e.state='walk';e.clock=0;}
 }else if(e.state==='walk'&&e.clock>.65){
  if(!visible(e,s)||distance(e,s)>330){const goal=routeWaypoint(getLayout(s.layoutId),e,s),u=unit({x:goal.x-e.x,y:goal.y-e.y}),before={x:e.x,y:e.y};moveActor(e,u.x*95*dt,u.y*95*dt,s.barriers);e.walk+=distance(before,e)*.06;return true;}
  e.pattern++;
  if(e.pattern%3===0){
   const u=unit({x:s.x-e.x,y:s.y-e.y}),at=nearestFloor(getLayout(s.layoutId),{x:e.x+u.x*145,y:e.y+u.y*145});
   s.mines.push({...at,age:0,life:8,hp:1,r:84});if(s.mines.length>3)s.mines.shift();campaignEvent(s,'rookMine',{x:at.x,y:at.y});
   e.reposition=nearestFloor(getLayout(s.layoutId),{x:e.x+(s.x>e.x?-210:210),y:e.y+(e.pattern%2?180:-180)});e.state='rookMove';e.clock=0;
  }else{e.state='rookAim';e.target={x:s.x,y:s.y};e.windup=1.2;e.clock=0;campaignEvent(s,'rookAim',{x:e.x,y:e.y});}
 }
 return true;
}
function bossThink(s,e,dt,d){
 if(e.bossKind==='rook')return rookThink(s,e,dt);
 const kind=e.bossKind,ratio=e.hp/e.max;
 // Thresholds call reinforcements once per phase; the Custode and Archon summon, the mirror adapts.
 const phase=ratio<.34?2:ratio<.67?1:0;if(phase>e.phase){e.phase=phase;if(kind!=='mirror'&&s.c.waves?.length)spawnWave(s,Math.min(s.c.waves.length-1,s.wave+1));campaignEvent(s,'bossPhase',{phase,kind});
  // The finale's reunion happens in combat: Lulù arrives and the Duo returns.
  if(s.c.join&&phase>=s.c.join.phase&&!s.partner){s.partner={layoutId:s.layoutId,...nearestFloor(getLayout(s.layoutId),{x:clamp(s.x-70,40,SIZE-40),y:clamp(s.y+60,40,SIZE-40)}),walk:0,cd:1};s.signature='duo';s.overdrive=0;s.heat=0;s.duo=100;campaignEvent(s,'partnerJoin',{x:s.partner.x,y:s.partner.y});}}
 if(kind==='mirror'){const recent=s.actions.slice(-8);if(recent.length>=8&&recent.every(k=>k==='gun')&&e.guard<=0&&e.state==='walk'){e.guard=2.2;s.actions=[];campaignEvent(s,'adapt',{x:e.x,y:e.y});}}
 if(e.state!=='walk')return false;
 const ready=e.clock>(phase===2?.7:1.1);if(!ready)return false;
 const patterns=kind==='mirror'?['charge','volley','charge','slam']:kind==='archon'?['slam','volley','charge','volley']:['slam','charge','slam','volley'];
 const p=patterns[e.pattern++%patterns.length];e.clock=0;e.attack=p;
 if(p==='slam'){e.state='warn';e.target={x:s.x,y:s.y};e.attackRadius=kind==='mirror'?110:140+phase*12;e.windup=1.15-phase*.12;}
 else if(p==='charge'){e.state='charge';e.target={x:s.x,y:s.y};e.dir=unit({x:s.x-e.x,y:s.y-e.y});e.windup=.85-phase*.08;}
 else{e.state='volley';e.target={x:s.x,y:s.y};e.windup=.7;e.emitter=kind==='archon'&&phase===1?s.nodes[e.pattern%s.nodes.length]:null;}
 return true;
}
export function tick(s,input,dt){const reloadBefore=s.arsenal?.reloadRemaining||0;dt=clamp(dt,0,.05);s.events=[];if(s.status!=='playing')return;s.time+=dt;const c=s.c;
 for(const k of ['fireCd','magicCd','dashCd','dash','inv','perfectWindow','counterReady','hurtAnim','duoAnim','sigCd','overdrive','heat','reveal','quickdrawWindow'])s[k]=Math.max(0,(s[k]||0)-dt);
 if(s.arsenal){tickArsenalV9(s.arsenal,dt);if(input.reload)s.reloadRequested=true;if(!s.action){if(input.switchWeapon&&!s.weaponSwitchHeld&&switchWeaponV9(s.arsenal,typeof input.switchWeapon==='string'?input.switchWeapon:undefined))campaignEvent(s,'weaponSwitch',{weapon:s.arsenal.active});if(s.reloadRequested){if(reloadWeaponV9(s.arsenal))campaignEvent(s,'reload');s.reloadRequested=false;}}s.weaponSwitchHeld=!!input.switchWeapon;}
 const raw={x:input.x||0,y:input.y||0},mag=Math.hypot(raw.x,raw.y),v=mag>1?unit(raw):raw;
 if(mag>.08)s.face=unit(v);if(input.aim)s.aim=unit(input.aim);
 if(input.dash&&s.dashCd===0){s.dash=.18;s.dashCd=s.overdrive>0?.6:1.1;s.inv=.3;s.perfectWindow=s.overdrive>0?.2:.14;campaignEvent(s,'dash');if(c.quickdraw&&s.arsenal?.active==='c9'){s.quickdrawWindow=1;campaignEvent(s,'quickdrawReady');}rememberAction(s,'dash');}
 const speed=s.dash?660:205*(s.heat>0?.72:1);const before={x:s.x,y:s.y};moveActor(s,(s.dash?s.face.x:v.x)*speed*dt,(s.dash?s.face.y:v.y)*speed*dt);const moved=distance(s,before);s.walk+=moved*.065;
 if(s.channel){const n=s.nodes[s.channel.node];if(!n||distance(s,n)>95){s.channel=null;campaignEvent(s,'channelBroken');}else{s.channel.t+=dt;if(s.channel.t>=s.channel.need)activateNode(s,n);}}
 if(s.allies){s.allyTime=Math.max(0,s.allyTime-dt);for(const a of s.allies){a.cd-=dt;if(a.cd<=0&&s.allyTime>0){const e=liveEnemies(s).find(e=>!e.boss);a.cd=.7;if(e){hitEnemy(s,e,Math.max(4,c.damage*3),'ally');campaignEvent(s,'partnerShot',{x:a.x,y:a.y,to:{x:e.x,y:e.y}});}}}}
 const p=s.partner;if(p){const pd=distance(s,p);if(pd>55){const pg=visible(p,s)?s:routeWaypoint(getLayout(s.layoutId),p,s);const u=unit({x:pg.x-p.x,y:pg.y-p.y});const q={x:p.x,y:p.y};moveActor(p,u.x*Math.min(240,(pd-45)*5)*dt,u.y*Math.min(240,(pd-45)*5)*dt);p.walk+=distance(p,q)*.065;}
  // The partner is an ally, not decoration: a steady covering shot at the nearest visible threat.
  p.cd=(p.cd??1.5)-dt;if(p.cd<=0){const e=liveEnemies(s).filter(e=>distance(p,e)<320&&visible(p,e)).sort((a,b)=>distance(p,a)-distance(p,b))[0];p.cd=e?2.8:.4;if(e){hitEnemy(s,e,Math.max(1,Math.floor(c.damage/2)),'partner');campaignEvent(s,'partnerShot',{x:p.x,y:p.y,to:{x:e.x,y:e.y}});}}}
 if(input.gun)startAttack(s,'gun',input.aim);if(input.magic)startAttack(s,'magic',input.aim);
 if(s.arsenal?.reloadRemaining>0&&reloadBefore===0&&!s.events.some(e=>e.type==='reload'))campaignEvent(s,'reload');
 if(s.action){s.action.t+=dt;if(s.action.weapon){while(s.action.shotsReleased<s.action.weapon.burst&&s.action.t>=.09+s.action.shotsReleased*.065){release(s);s.action.shotsReleased++;}}else if(!s.action.fired&&s.action.t>=(s.action.kind==='gun'?.09:.27)){s.action.fired=true;release(s);}if(s.action.t>=s.action.duration)s.action=null;}
 if(input.duo&&s.signature==='duo'&&s.duo>=100){s.duoAnim=.65;s.duo=0;s.hp=Math.min(s.maxHp,s.hp+2);s.inv=1;for(const e of liveEnemies(s))if(distance(s,e)<300){hitEnemy(s,e,c.damage*2,'duo');if(e.hp>0){e.state='stun';e.stun=1.2;e.clock=0;}}campaignEvent(s,'duo',{x:s.x,y:s.y});rememberAction(s,'duo');}
 if(input.duo&&s.signature==='overdrive'&&s.duo>=100&&!s.overdrive){s.overdrive=5;s.duo=0;s.inv=.5;campaignEvent(s,'overdrive',{x:s.x,y:s.y});rememberAction(s,'overdrive');}
 if(s.signature==='overdrive'&&s.overdrive===0&&s.wasOverdrive){s.heat=2.2;campaignEvent(s,'heat');}s.wasOverdrive=s.overdrive>0;
 if(input.duo&&s.signature==='barrier'&&s.sigCd===0){const at={layoutId:s.layoutId,x:s.x+s.face.x*80,y:s.y+s.face.y*80};if(!layoutWalkable(getLayout(s.layoutId),at.x,at.y,48)){at.x=s.x;at.y=s.y;}s.barriers.push({x:at.x,y:at.y,r:46,life:c.barrierLife||9});if(s.barriers.length>2)s.barriers.shift();s.sigCd=7;campaignEvent(s,'barrier',at);rememberAction(s,'barrier');}
 for(const b of s.barriers)b.life-=dt;s.barriers=s.barriers.filter(b=>b.life>0);
 if(s.signature==='barrier')s.duo=Math.round(100*(1-s.sigCd/7));
 // Enemy projectiles: walls and barriers stop them; a dash through one is a Perfect Dodge.
 for(const b of s.shots){const prev={layoutId:s.layoutId,x:b.x,y:b.y+34};b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;const at={x:b.x,y:b.y+34};
  if(!visible(prev,at)||s.barriers.some(r=>Math.hypot(at.x-r.x,at.y-r.y)<r.r)){b.life=0;campaignEvent(s,'shotBlocked',{x:b.x,y:b.y});continue;}
  if(Math.hypot(at.x-s.x,at.y-s.y)<24){b.life=0;resolveThreat(s,'shot');}}
 s.shots=s.shots.filter(b=>b.life>0);
 if(s.enemies.some(e=>e.bossKind==='rook'&&e.hp<=0)){s.mines=[];s.rookDark=false;}
 for(const m of s.mines){m.age+=dt;m.life-=dt;if(m.hp<=0)continue;
  if(m.age>=.9&&(distance(s,m)<m.r||m.life<=0)){if(distance(s,m)<m.r&&visible(s,{...m,layoutId:s.layoutId}))resolveThreat(s,'mine');m.hp=0;campaignEvent(s,'mineBurst',{x:m.x,y:m.y,r:m.r});}}
 s.mines=s.mines.filter(m=>m.hp>0&&m.life>0);

 if(c.mode==='stealth'&&!s.alarm){let seen=false;for(const e of s.enemies){if(e.hp<=0||e.state!=='patrol')continue;if(patrolSees(s,e)){seen=true;e.seen=clamp(e.seen+dt*(1.9-distance(s,e)/260)*(s.channel?1.6:1),0,1);s.alert=Math.max(s.alert,e.seen);if(e.seen>=1)raiseAlarm(s);}else e.seen=Math.max(0,e.seen-dt*.4);}if(!seen)s.alert=Math.max(0,s.alert-dt*.35);}
 for(const e of s.enemies){e.hurtAnim=Math.max(0,(e.hurtAnim||0)-dt);e.deathAnim=Math.max(0,(e.deathAnim||0)-dt);e.guard=Math.max(0,(e.guard||0)-dt);if(e.hp<=0||e.state==='dormant')continue;e.clock+=dt;const d=distance(s,e);
  if(e.state==='stun'){e.stun-=dt;if(e.stun<=0){e.state=c.mode==='stealth'&&!s.alarm?'patrol':'walk';e.clock=0;e.seen=0;}continue;}
  if(e.state==='patrol'){const path=e.path||[{x:e.x,y:e.y}],to=path[e.pathIndex%path.length],u=unit({x:to.x-e.x,y:to.y-e.y});if(distance(e,to)<8)e.pathIndex++;else{const q={x:e.x,y:e.y};moveActor(e,u.x*e.moveSpeed*dt,u.y*e.moveSpeed*dt,s.barriers);e.walk+=distance(e,q)*.06;e.dir=u;e.face=u.x<0?-1:1;}continue;}
  if(e.boss&&bossThink(s,e,dt,d))continue;
  if(e.state==='walk'){
   const aware=d<e.detectRange&&visible(e,s)||e.hp<e.max||s.alarm||e.boss||e.hunting;if(aware)e.hunting=true;
   if(aware&&d<e.reach&&visible(e,s)&&e.clock>.35&&!e.boss){e.state='warn';e.clock=0;e.target={x:s.x,y:s.y};}
   else if(aware||d<760){
    // Approach from a personal angle so groups surround instead of stacking.
    const ang=Math.atan2(e.y-s.y,e.x-s.x)+((e.id%3)-1)*.5,goal=e.ranged?{x:s.x+Math.cos(ang)*240,y:s.y+Math.sin(ang)*240}:{x:s.x+Math.cos(ang)*e.reach*.6,y:s.y+Math.sin(ang)*e.reach*.6};
    const target=visible(e,{...goal,layoutId:s.layoutId})?goal:routeWaypoint(getLayout(s.layoutId),e,s);const u=unit({x:target.x-e.x,y:target.y-e.y}),q={x:e.x,y:e.y},go=distance(e,goal)>12?1:0;moveActor(e,u.x*e.moveSpeed*dt*go,u.y*e.moveSpeed*dt*go,s.barriers);e.walk+=distance(e,q)*.06;e.face=s.x<e.x?-1:1;}}
  else if(e.state==='warn'){
   // Telegraphs track the hero for the first half, then lock: dodging is about timing, not distance.
   if(e.clock<e.windup*.55&&!e.ranged)e.target={x:s.x,y:s.y};
   if(e.ranged&&e.clock<e.windup*.6)e.target={x:s.x,y:s.y};
   if(e.clock>e.windup){
    if(e.ranged){fireShot(s,e,e.target);campaignEvent(s,'enemyShot',{x:e.x,y:e.y});}
    else{const r=e.attackRadius;if(distance(s,e.target)<r&&visible(e,s))resolveThreat(s,'melee');campaignEvent(s,'enemyAttack',{x:e.target.x,y:e.target.y,r});}
    e.state='recover';e.clock=0;}}
  else if(e.state==='charge'){
   if(e.clock<e.windup){e.dir=unit({x:e.target.x-e.x,y:e.target.y-e.y});}
   else{const q={x:e.x,y:e.y};moveActor(e,e.dir.x*720*dt,e.dir.y*720*dt);e.face=e.dir.x<0?-1:1;if(distance(s,e)<58&&!e.hitThisCharge){e.hitThisCharge=true;resolveThreat(s,'charge');}
    if(e.clock>e.windup+.55||distance(q,e)<1){e.state='recover';e.clock=0;e.hitThisCharge=false;campaignEvent(s,'chargeEnd',{x:e.x,y:e.y});}}}
  else if(e.state==='volley'){if(e.clock>e.windup){const n=e.phase===2?7:5;for(let i=0;i<n;i++)fireShot(s,e.emitter?{...e.emitter,boss:true}:e,e.target,380,(i-(n-1)/2)*.17);campaignEvent(s,'enemyShot',{x:e.x,y:e.y,volley:true});e.state='recover';e.clock=0;}}
  else if(e.state==='recover'&&e.clock>e.recovery){e.state='walk';e.clock=0;}}
 if(input.interact&&!s.channel)startChannel(s);
 // Defend: hold the zone while it is not contested; waves arrive on a clock.
 if(c.mode==='defend'||c.mode==='chalk'&&s.nodes.every(n=>n.on)){const z=c.zone,inside=distance(s,z)<z.r,contested=liveEnemies(s).some(e=>distance(e,z)<z.r);if(inside&&!contested)s.progress=Math.min(1,s.progress+dt/c.hold);
  s.waveClock+=dt;if(s.waveClock>(c.waveEvery||14)&&s.wave<(c.waves?.length||0)-1){s.waveClock=0;spawnWave(s,s.wave+1);}}
 if(s.hp<=0){s.status='failed';s.action=null;s.channel=null;campaignEvent(s,'failed');return;}
 const enemiesDown=s.enemies.every(e=>e.hp<=0)&&s.wave>=(c.waves?.length||1)-1;
 let done;
 if(c.mode==='stealth')done=s.nodes.every(n=>n.on);
 else if(c.mode==='defend')done=s.progress>=1;
 else if(c.mode==='chalk')done=s.nodes.every(n=>n.on)&&s.progress>=1;
 else if(c.boss)done=s.nodes.every(n=>n.on)&&s.enemies.filter(e=>e.boss).every(e=>e.hp<=0);
 else done=enemiesDown&&s.nodes.every(n=>n.on);
 // Out of nodes but a wave remains: release it so the district can always be finished.
 if(!done&&!c.boss&&c.mode!=='stealth'&&c.mode!=='defend'&&c.mode!=='chalk'&&s.nodes.every(n=>n.on)&&s.enemies.every(e=>e.hp<=0)&&s.wave<(c.waves?.length||0)-1)spawnWave(s,s.wave+1);
 if(done){for(const e of s.enemies)if(e.hp>0){e.hp=0;e.deathAnim=.7;}s.shots=[];s.status='cleared';s.action=null;s.channel=null;campaignEvent(s,'cleared');}
}


// A city decision is committed once; legacy checkpoints remain readable.
export function chooseCity(s,choice){
 if(s.level!==0||s.status!=='cleared'||s.cityChoice||!['workshop','shelter'].includes(choice))return false;
 s.cityChoice=choice;if(s.narrative){s.narrative.flags.blackout_choice=choice;s.narrative.choices.blackout_power=choice;}return true;
}
export function cityOutcome(choice){
 if(choice==='workshop')return {title:'Officina accesa',benefit:'Il meccanico rinforza la Vortex: +1 integrità nella fuga.',cost:'Il rifugio resta al buio. Lulù consegna le lampade di emergenza.',returnText:'Il ponte dell’officina è in funzione. La Vortex porta il nuovo rinforzo; al rifugio restano accese soltanto le lampade.',color:'#ffb65c'};
 if(choice==='shelter')return {title:'Rifugio acceso',benefit:'Mira indica una strada secondaria: meno ostacoli nella fuga.',cost:'L’officina resta chiusa: la Vortex parte senza rinforzo.',returnText:'Le finestre del rifugio sono illuminate. Mira vi saluta dalla porta; il ponte dell’officina resta fermo.',color:'#7dffd0'};
 return null;
}

// Preview shares weapon range/spread and the actual wall trace; it never consumes ammo.
export function attackPreview(s,kind='gun',manual=null){
 const w=kind==='gun'&&s.arsenal?WEAPONS_V9[s.arsenal.active]:null;
 const range=kind==='magic'?(s.hero==='lulu'?240:420):w?.range||GUN_RANGE;
 const dir=manual||aimAt(s,null,range),half=w?(w.pellets-1)*w.spread/2:0;
 const offsets=half?[-half,0,half]:[0];
 return {range,rays:offsets.map(offset=>{const a=Math.atan2(dir.y,dir.x)+offset;return trace(s,{x:Math.cos(a),y:Math.sin(a)},range);})};

}
