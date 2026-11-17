import {WEAPONS_V9,createArsenalV9,tickArsenalV9,fireWeaponV9,switchWeaponV9,reloadWeaponV9,unlockedMovesV11,moveDefV11,maxMagV11,muzzleV9,foeBodyV9} from './weapons-v9.mjs';
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
  waves:[['raider','shooter','signal','raider'],['breaker','shooter','shooter','raider'],['brute','breaker','shooter','signal','raider']],brief:['Gli infetti seguono il rumore. I filtri possono contenere le spore.','Il corridoio civile è sigillato. Apriamolo, poi pensiamo al resto.'],end:'Il corridoio è aperto. Sotto l’asfalto qualcosa ha sentito il tuo nome.'},
 {id:'zero',name:'04 · Ora zero',district:'Nodo Centrale',threat:'Custodi della frattura',goal:'Spegni i 3 nuclei, abbatti il Custode',kind:3,map:3,color:'#d395ff',hp:18,speed:62,weapon:'Risonatore',damage:4,cooldown:.30,magic:true,partner:true,nodeLabel:'NUCLEO',
  waves:[['raider','shooter','raider'],['breaker','shooter','brute'],['signal','breaker','shooter']],boss:{kind:'custode',hp:375},brief:['Blackout, breccia, contagio. Tutto porta qui.','Allora finisce qui. Tu tieni la linea. Io chiudo il Nodo.'],end:'Il Custode cade. Nel suo nucleo c’è un registro con il tuo nome.'}
];
// Tactical roles are shared by every district; the district atlas changes their silhouette.
export const ROLE_SPECS={
 raider:{speed:1.25,detect:320,windup:.95,radius:68,recovery:.85,hp:1,reach:70},
 breaker:{speed:1.6,detect:300,windup:1.1,radius:92,recovery:1.0,hp:1,reach:96},
 signal:{speed:.95,detect:360,windup:1.3,radius:112,recovery:1.1,hp:1.2,reach:150},
 shooter:{speed:.95,detect:420,windup:.7,radius:0,recovery:.95,hp:.9,reach:330,ranged:true},
 brute:{speed:.9,detect:320,windup:1.35,radius:120,recovery:1.3,hp:2.4,reach:96},
 patrol:{speed:.6,detect:0,windup:1.0,radius:72,recovery:.9,hp:1,reach:74},
 moor:{speed:0,detect:0,windup:99,radius:0,recovery:1,hp:.45,reach:0},
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
// R42: a body 32 px wide can walk straight only if the corridor as wide as the body is clear, not just the centre ray.
export function clearWalk(a,b){const dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy)||1,ox=-dy/l*15,oy=dx/l*15;return visible(a,b)&&visible({...a,x:a.x+ox,y:a.y+oy},{...b,x:b.x+ox,y:b.y+oy})&&visible({...a,x:a.x-ox,y:a.y-oy},{...b,x:b.x-ox,y:b.y-oy});}
// Barriers are Lulú's temporary walls: they stop enemy bodies and shots, never the heroes.
export function moveActor(a,dx,dy,barriers=null){const blocked=(x,y)=>(getLayout(a.layoutId)?.walls||WALLS).some(w=>x+16>w.x&&x-16<w.x+w.w&&y+10>w.y&&y-10<w.y+w.h)||!!barriers?.some(b=>Math.hypot(x-b.x,y-b.y)<b.r+14);const x=clamp(a.x+dx,30,SIZE-30),y=clamp(a.y+dy,30,SIZE-30);if(!blocked(x,a.y))a.x=x;if(!blocked(a.x,y))a.y=y;}
function makeEnemy(s,role,at,id,boss=null){
 const c=s.c,spec=ROLE_SPECS[boss?'boss':role]||ROLE_SPECS.raider,legacy=s.level===0&&s.mission==='blackout'&&BLACKOUT_ENEMY_SPECS[role];
 const hp=boss?boss.hp:Math.max(1,Math.round(c.hp*spec.hp)),actScale=c.boss?0:Math.max(0,(c.act||(s.level+1))-1); // R22: boss stages keep their hand-tuned pace (D63, D48)
 return {id,layoutId:s.layoutId,role:boss?'boss':role,x:at.x,y:at.y,hp,max:hp,clock:(id%4)*.3,state:role==='patrol'?'patrol':'walk',walk:0,hurtAnim:0,deathAnim:0,face:1,boss:!!boss,bossKind:boss?.kind||null,
  moveSpeed:legacy?legacy.speed:c.speed*spec.speed*(1+.03*actScale),detectRange:legacy?legacy.detect:(c.dark?spec.detect*.7:spec.detect),windup:(legacy?legacy.windup:spec.windup)+(c.windupBonus||0),attackRadius:legacy?legacy.radius:spec.radius,recovery:Math.max(.55,legacy?legacy.recovery:spec.recovery*(1-.03*actScale)),reach:spec.reach,ranged:!!spec.ranged,
  path:at.path||null,pathIndex:0,hunting:false,seen:0,stun:0,phase:0,pattern:0,guard:0,target:null,dir:null};
}
function spawnWave(s,index,initial=false){
 const wave=s.c.waves?.[index];if(!wave)return false;
 const entries=getLayout(s.layoutId)?.entries||EDGES;
 const far=entries.map((p,i)=>({p,i,d:distance(p,s)})).sort((a,b)=>b.d-a.d);
 let cmdAssigned=false;
 wave.forEach((role,k)=>{
  const spot=initial?(role.path?.[0]||s.c.spawns?.[k]||START_SPOTS[k%START_SPOTS.length]):s.c.mode==='defend'?entries[(index+k)%entries.length]:far[k%2].p;
  const offset=initial||s.layoutId?{x:0,y:0}:{x:(k%3-1)*46,y:((k+1)%3-1)*46};
  const e=makeEnemy(s,typeof role==='string'?role:role.role,{...spot,x:spot.x+offset.x,y:spot.y+offset.y,path:role.path||null},s.nextId++);e.hunting=!initial;
  if(!initial&&!cmdAssigned&&!s.c.boss&&index===(s.c.waves?.length||1)-1&&(e.role==='brute'||e.role==='breaker')){
   cmdAssigned=true;e.commander=true;e.commanderTitle=['CAPO RELÈ · KROVG','ARCONTE DI PRUA · VEX','ESECUTORE CLINICO · MORN','PRETORIANO D’ASSE · ZAEL'][ clamp((s.c.act||1)-1,0,3)];
   e.hp=e.max=Math.max(e.hp+2,Math.round(e.hp*1.35));
  }
  s.enemies.push(e);
 });
 s.wave=index;if(!initial)campaignEvent(s,'wave',{index,count:wave.length,commander:cmdAssigned});
 return true;
}
// R43 (D88): unstable chrono capsules. A round, an orb or a nova arms one; after a short fuse it bursts: enemies in sight
// are thrown back by the blast, other capsules chain, mines are cleared, and the hero standing inside is hit (dodgeable).
const CAPSULE={r:135,fuse:.45,chain:.2,damage:6,boss:3};
function capsuleOnLine(s,dir,range){return (s.capsules||[]).filter(k=>{const dx=k.x-s.x,dy=k.y-s.y,al=dx*dir.x+dy*dir.y;return k.hp>0&&!(k.fuse>0)&&al>=0&&al<=range&&Math.abs(dx*dir.y-dy*dir.x)<26&&visible(s,k);}).sort((x,y)=>distance(s,x)-distance(s,y))[0]||null;}
function armCapsule(s,k,f=CAPSULE.fuse){if(!k||k.hp<=0||k.fuse>0)return;k.fuse=k.max=f;campaignEvent(s,'capsuleArmed',{x:k.x,y:k.y,r:CAPSULE.r,fuse:f});}
function armCapsulesNear(s,at,r){for(const k of s.capsules||[])if(Math.hypot(k.x-at.x,k.y-at.y)<=r)armCapsule(s,k);}
function tickCapsules(s,dt){for(const k of s.capsules||[]){if(k.hp<=0||!(k.fuse>0))continue;k.fuse-=dt;if(k.fuse>0)continue;k.hp=0;
 for(const e of liveEnemies(s))if(distance(k,e)<=CAPSULE.r&&visible(k,e))hitEnemy(s,e,e.boss?CAPSULE.boss:CAPSULE.damage,'blast');
 for(const o of s.capsules)if(o!==k&&distance(k,o)<=CAPSULE.r)armCapsule(s,o,CAPSULE.chain);
 for(const m of s.mines||[])if(m.hp>0&&distance(k,m)<=CAPSULE.r){m.hp=0;campaignEvent(s,'mineDisarmed',{x:m.x,y:m.y});}
 campaignEvent(s,'capsuleBlast',{x:k.x,y:k.y,r:CAPSULE.r});if(distance(k,s)<=CAPSULE.r-20&&visible(k,s))resolveThreat(s,'shot');}}
function spawnChests(c){
 if(['awakening','collapse'].includes(c.id)||(!c.damage&&!(c.nodes?.length)))return [];
 // R42: a plan with its own alcoves hides the chests off the main path; the others keep the six corners.
 const l=getLayout(c.layout),spots=l?.chests?.length?l.chests:[{x:310,y:340},{x:1226,y:340},{x:310,y:1190},{x:1226,y:1190},{x:768,y:320},{x:768,y:1220}],out=[];
 for(const pt of spots){
  if(out.length>=2)break;
  const at=nearestFloor(l,pt);
  if(c.start&&distance(at,c.start)<170)continue;
  if((c.nodes||[]).some(n=>distance(at,n)<135))continue;
  if(out.some(ch=>distance(at,ch)<280))continue;
  out.push({id:'chest_'+out.length,x:at.x,y:at.y,open:false,kind:out.length===0?'supply':'chrono'});
 }
 return out;
}
export function newRun(hero='nox',level=0,upgrade='power',cityChoice=null,narrative=null,def=null){
 level=clamp(Math.floor(level),0,3);const c=def||CHAPTERS[level];
 const solo=c.partner===false,shield=upgrade==='shield',bonus=(c.hpBonus||0),h=hero==='lulu'?'lulu':'nox',act=c.act||(level+1),moves=unlockedMovesV11(h,act,{...(narrative?.flags||{}),...Object.fromEntries((c.moveUnlocks||[]).map(id=>['move.unlock.'+id,true]))});
 const s={version:5,layoutId:c.layout,mission:c.id,c,narrative:createNarrativeState(narrative||{}),cityChoice:['workshop','shelter'].includes(cityChoice)?cityChoice:null,hero:h,level,upgrade,
  x:c.start?.x??768,y:c.start?.y??1130,partner:solo?null:{layoutId:c.layout,x:(c.start?.x??768)-54,y:(c.start?.y??1130)+40,walk:0,cd:1.5},hp:(shield?10:8)+bonus,maxHp:(shield?10:8)+bonus,time:0,walk:0,face:{x:0,y:-1},aim:{x:0,y:-1},lock:null,action:null,
  fireCd:0,magicCd:0,dashCd:0,dash:0,inv:0,perfectWindow:0,counterReady:0,hurtAnim:0,duoAnim:0,duo:0,kills:0,bountyCoins:0,bountyScrap:0,spinUp:0,combo:0,comboTimer:0,drops:[],status:'playing',events:[],fx:[],
  signature:solo?(h==='lulu'?'sonic_nova':'overdrive'):'duo',sigCd:0,sonicAura:0,sonicShield:0,overdrive:0,heat:0,barriers:[],shots:[],heroShots:[],mines:[],chests:spawnChests(c),capsules:(getLayout(c?.layout)?.capsules||[]).map(p=>({layoutId:c.layout,x:p.x,y:p.y,hp:1,fuse:0,max:0})),channel:null,alert:0,alarm:false,progress:0,waveClock:0,actions:[],
  moves,activeMove:(c.moveSelection&&moves.includes(c.moveSelection)?c.moveSelection:moves[0])||(h==='lulu'?'lulu_wave':'nox_pulse'),
  nodes:(c.nodes||DEFAULT_NODES).map(n=>({x:n.x,y:n.y,on:false})),enemies:[],nextId:0,wave:-1};
 if(c.combatV9){s.arsenal=createArsenalV9(s.hero,c.weaponRewards||[],c.marketWeapons||[],c.magBonus||0);const pick=c.weaponSelection||c.equippedWeapon;if(pick&&Object.hasOwn(s.arsenal.ammo,pick))s.arsenal.active=pick;}
 if(c.mode==='defend'||c.mode==='duel')s.nodes=[];
 if(c.mode==='pressure')s.nodes=s.nodes.slice(0,1);
 if(c.mode==='escort')s.escort={layoutId:s.layoutId,...nearestFloor(getLayout(s.layoutId),{x:s.x-40,y:s.y+24}),hp:3,at:0,wait:0,name:c.escortName||'CIVILE'};
 if(s.mission==='docks_veyra'){s.allies=[{id:'veyra',atlas:'demon_hunter_survivor',name:'VEYRA',x:s.x+72,y:s.y-42,cd:.85,face:1,anim:'idle',animT:0}];s.allyTime=999;}
 if(c.mode==='chase'){const spot=nearestFloor(getLayout(s.layoutId),{x:s.x+70,y:Math.max(80,s.y-80)});const e=makeEnemy(s,'raider',spot,s.nextId++);e.role='runner';e.state='flee';e.hp=e.max=30;e.runnerAt=0;e.wait=0;e.moveSpeed=88;s.enemies.push(e);s.wave=(c.waves?.length||1)-1;}
 else spawnWave(s,0,true);
 if(c.mode==='stealth'){const pts=s.nodes.length?s.nodes:[{x:480,y:520},{x:980,y:760}];s.enemies.forEach((e,i)=>{if(e.boss||e.path)return;const a=pts[i%pts.length],b=pts[(i+1)%pts.length],shift=70+i*36;e.role='patrol';e.state='patrol';e.path=[{x:a.x,y:a.y},{x:b.x,y:a.y},{x:b.x+((i%2)?.1:-1)*shift,y:b.y},{x:a.x,y:b.y}];});}
 if(c.boss){const b=makeEnemy(s,'boss',getLayout(s.layoutId)?.boss||c.boss.at||{x:770,y:430},s.nextId++,c.boss);b.state=s.nodes.length?'dormant':'walk';s.enemies.push(b);if(!s.nodes.length)s.bossWakeDue=true;} // R34: a boss without devices (Vega) starts awake; its entrance (barks, sound) is announced on the first tick
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
const lockCue=(s,e,at,dt,kind,p=e.target)=>{if(e.clock>=at&&e.clock-dt<at)campaignEvent(s,'telegraphLock',{x:p.x,y:p.y,kind});};
const liveEnemies=s=>s.enemies.filter(e=>e.hp>0&&e.state!=='dormant');
// Assisted aim never wastes a press on The Anchor while it is moored: its lines come first.
// R28 (D72): a manual aim (a drag on the fire button, the right stick, or the facing with assisted aim off) is a ray from
// the barrel as the player sees it. The first foe whose drawn body it crosses, with 12 px of room for the thumb, becomes
// the target, so what the player points at is what is hit. The shot itself is unchanged: same rays and corridors, same damage.
export function pickAlong(s,d,range,kind='gun'){const m=kind==='gun'?muzzleV9(s.hero,s.arsenal?.active,d):{x:0,y:-48},ox=s.x+m.x,oy=s.y+m.y;let best=null,bt=Infinity;
 for(const e of liveEnemies(s)){if(distance(s,e)>range||!visible(s,e))continue;const b=foeBodyV9(e),A=b.w/2+12,B=b.h/2+12,px=(ox-e.x)/A,py=(oy-e.y+b.h/2)/B,qx=d.x/A,qy=d.y/B,a=qx*qx+qy*qy,h=px*qx+py*qy,c=px*px+py*py-1,disc=h*h-a*c;if(disc<0)continue;const t=c<=0?0:(-h-Math.sqrt(disc))/a;if(t>=0&&t<bt){bt=t;best=e;}}
 return best;}
// The aimed direction is kept when its own ray already takes that foe; otherwise it turns onto the foe's feet.
const onto=(s,d,e)=>{const dx=e.x-s.x,dy=e.y-s.y;return dx*d.x+dy*d.y>=0&&Math.abs(dx*d.y-dy*d.x)<(e.boss?37:25)?d:unit({x:dx,y:dy});};
export function aimAt(s,manual,range=GUN_RANGE,kind='gun'){if(manual){const d=unit(manual),e=pickAlong(s,d,range,kind);if(!e)return d;s.lock=e.id;return onto(s,d,e);}const all=liveEnemies(s).filter(e=>distance(s,e)<=range&&visible(s,e)),open=all.filter(e=>!(e.bossKind==='anchor'&&anchorShielded(s,e))),list=(open.length?open:all).sort((a,b)=>distance(s,a)-distance(s,b));const old=list.find(e=>e.id===s.lock),e=old&&distance(s,old)<=distance(s,list[0])*1.25?old:list[0];s.lock=e?.id??null;return e?unit({x:e.x-s.x,y:e.y-s.y}):s.aim;}
export function trace(s,dir,range){
 let end=range;for(const w of (getLayout(s.layoutId)?.walls||WALLS)){const entry=wallEntry(s.x,s.y,dir.x,dir.y,w,range);if(entry===Infinity)continue;
  // Preserve the original four-pixel beam stop; gameplay ranges and collision semantics are unchanged.
  const sample=Math.max(4,Math.ceil((entry-1e-9)/4)*4);if(sample<=range)end=Math.min(end,sample-4);
 }return {x:s.x+dir.x*end,y:s.y+dir.y*end};
}
function rememberAction(s,kind){s.actions.push(kind);if(s.actions.length>8)s.actions.shift();}
export function switchMove(s,id){if(!s?.moves?.length||s.status!=='playing')return false;const next=id??s.moves[(s.moves.indexOf(s.activeMove)+1)%s.moves.length];if(!s.moves.includes(next)||next===s.activeMove)return false;s.activeMove=next;campaignEvent(s,'moveSwitch',{move:next});return true;}
export function startAttack(s,kind='gun',manual=null){if(s.status!=='playing'||s.action)return false;const c=s.c,abilityUnlocked=c.magic||s.hero==='lulu';if(kind==='magic'&&(!abilityUnlocked||s.magicCd>0)||kind==='gun'&&s.fireCd>0)return false;
 const weapon=kind==='gun'&&s.arsenal?fireWeaponV9(s.arsenal):null;if(kind==='gun'&&s.arsenal&&!weapon)return false;
 if(weapon?.id==='c9'&&s.c.quickdraw&&s.quickdrawWindow>0){weapon.cooldown=.26;s.arsenal.cooldown=.26;s.quickdrawWindow=0;campaignEvent(s,'quickdrawShot');}
 const rapid=!!(weapon&&(weapon.fastWindup||String(weapon.proj||'').endsWith('tracer')||weapon.proj==='flame'));
 if(weapon&&rapid)s.spinUp=clamp((s.spinUp||0)+.28,0,1);else if(weapon)s.spinUp=0;
 if(weapon&&s.arsenal)s.arsenal.cooldown=weapon.cooldown;
 const move=kind==='magic'?(moveDefV11(s.activeMove)||moveDefV11(s.hero==='lulu'?'lulu_wave':'nox_pulse')):null;
 const dir=aimAt(s,manual,kind==='magic'?(!move||['beam','cone'].includes(move.kind)?420:move.range||420):weapon?.range||GUN_RANGE,kind);s.aim=dir;s.action={kind,t:0,duration:kind==='gun'?Math.min(c.cooldown,.34):.65,dir,fired:false};
 if(weapon){const step=weapon.burst>=4?.045:.065;s.action.weapon=weapon;s.action.windup=.09;s.action.step=step;s.action.shotsReleased=0;s.action.duration=Math.max(.26,.09+(weapon.burst-1)*step+.08);}
 if(move)s.action.move=move;
 if(kind==='gun')s.fireCd=weapon?.cooldown||c.cooldown;else s.magicCd=Math.max(1.8,(s.upgrade==='power'?move.cd:move.cd+1)-(c.magicHaste||0));rememberAction(s,kind);return true;}
// Kairn closes in and strikes; Morrow covers with the shotgun and saws up close. Damage, the 0.7 s
// cadence and the eight-second window are unchanged; bosses are never targets, so neither ally can
// defeat Archon. They guard the hero (targets within ALLY_LEASH of her), path around walls like the
// enemies, and the hit lands on the release frame of the action, never when it is chosen.
export const ALLY_LEASH=420;
export const ALLY_RULES=Object.freeze({
 kairn:Object.freeze({speed:230,melee:58,range:0,moves:Object.freeze({punch:{anim:'attack',release:.12,duration:.4,event:'allyStrike'}})}),
 morrow:Object.freeze({speed:185,melee:70,range:270,moves:Object.freeze({saw:{anim:'attack',release:.12,duration:.4,event:'allyStrike'},shotgun:{anim:'shotgun',release:.1,duration:.4,event:'partnerShot'}})}),
 veyra:Object.freeze({speed:195,melee:72,range:285,moves:Object.freeze({saw:{anim:'attack',release:.12,duration:.4,event:'allyStrike'},shotgun:{anim:'special',release:.1,duration:.4,event:'partnerShot'}})})
});
const allyAnim=(a,name)=>{if(a.anim!==name){a.anim=name;a.animT=0;}};
function tickAllies(s,dt){
 s.allyTime=Math.max(0,s.allyTime-dt);
 const dummyTest=s.enemies.length===1&&s.enemies[0].detectRange===0;
 for(const a of s.allies){
  const rule=ALLY_RULES[a.id];a.cd=Math.max(0,(a.cd||0)-dt);a.animT=(a.animT||0)+dt;if(!rule)continue;a.layoutId??=s.layoutId;
  if(a.strike){const k=a.strike,move=rule.moves[k.move],e=s.enemies[k.target];k.t+=dt;
   if(!k.done&&k.t>=move.release){k.done=true;if(e?.hp>0){hitEnemy(s,e,Math.max(4,s.c.damage*3),'ally');campaignEvent(s,move.event,{ally:a.id,move:k.move,x:a.x,y:a.y,to:{x:e.x,y:e.y}});}}
   if(k.t>=move.duration){a.strike=null;allyAnim(a,'idle');}continue;}
  const targets=s.allyTime>0&&!dummyTest?liveEnemies(s).filter(e=>!e.boss&&distance(s,e)<=ALLY_LEASH):[],e=targets.sort((p,q)=>distance(a,p)-distance(a,q))[0];
  const goal=e||{x:s.x+(a.id==='kairn'?-75:75),y:s.y-60},d=distance(a,goal);
  if(goal.x!==a.x)a.face=goal.x<a.x?-1:1;
  const move=e&&(d<=rule.melee?(a.id==='kairn'?'punch':'saw'):d<=rule.range?'shotgun':null);
  if(move){if(a.cd===0){a.cd=.7;a.strike={move,target:s.enemies.indexOf(e),t:0,done:false};allyAnim(a,rule.moves[move].anim);}else if(!a.strike&&a.anim!=='idle'&&a.animT>.3)allyAnim(a,'idle');continue;}
  if(d>(e?rule.melee*.8:24)){const step=visible(a,goal)?goal:routeWaypoint(getLayout(s.layoutId),a,goal),u=unit({x:step.x-a.x,y:step.y-a.y}),q={x:a.x,y:a.y};moveActor(a,u.x*rule.speed*dt,u.y*rule.speed*dt,s.barriers);a.walk=(a.walk||0)+distance(a,q)*.06;allyAnim(a,distance(a,q)>.1?'walk':'idle');}
  else allyAnim(a,'idle');
 }
}
function hitEnemy(s,e,n,source='gun'){if(e.hp<=0||e.state==='dormant')return;
 if(e.bossKind==='anchor'&&anchorShielded(s,e)){campaignEvent(s,'guarded',{x:e.x,y:e.y,moored:true});return;}
 // A mooring line is tuned to hold, not to vibrate: an ability reaching it cuts it outright.
 if(e.role==='moor'&&source==='magic')n=e.hp;
 if(e.guard>0&&source==='gun'){campaignEvent(s,'guarded',{x:e.x,y:e.y});return;}
 // Support fire can expose a boss, but the player's command owns the final hit.
 if(source==='partner'&&e.boss){n=Math.min(n,Math.max(0,e.hp-1));if(n<=0)return;}
 if(e.bossKind==='archon'&&s.c.consentFinale&&!s.finalConsent&&e.hp-n<=1){n=Math.max(0,e.hp-1);if(!s.consentRequested){s.consentRequested=true;campaignEvent(s,'finalConsent');}}
 const unaware=source!=='sonic'&&e.state==='patrol'&&e.seen<.35;if(unaware){n*=3;campaignEvent(s,'silent',{x:e.x,y:e.y});}
 if(e.bossKind==='tyrant'&&s.mines?.some(m=>m.hp>0&&m.tyrantBone))n*=.85;
 if(e.weakExposed>0&&source!=="partner"){n=Math.ceil(n*1.5);campaignEvent(s,"weakHit",{id:e.id,x:e.x,y:e.y});}
 e.hp=Math.max(0,Math.round((e.hp-n)*1e6)/1e6);if(e.hp<1e-4)e.hp=0;e.hurtAnim=.24;if(s.signature!=='sonic_nova')s.duo=clamp(s.duo+(s.overdrive>0?0:(source==='partner'?2:5)+(s.c?.duoBonus||0)),0,100);
 if(n>0&&e.role!=='moor'){s.combo=(s.combo||0)+1;s.comboTimer=3.8;if([3,6,10,15,25].includes(s.combo))campaignEvent(s,'comboMilestone',{count:s.combo,x:e.x,y:e.y});}
 if(e.state==='patrol'){e.state='walk';e.clock=0;}
 campaignEvent(s,'impact',{id:e.id,x:e.x,y:e.y,amount:n,boss:e.boss,source});
 if(e.hp===0){e.deathAnim=.7;s.kills++;s.bountyCoins+=(e.boss?12:e.role==='brute'?3:e.role==='moor'?0:1);s.bountyScrap+=(e.boss?10:e.role==='brute'?3:1)+(source==='magic'&&e.role!=='moor'?1:0);if(e.role!=='moor')s.drops.push({x:e.x,y:e.y,kind:s.hp<s.maxHp&&s.kills%4===0?'vital':'energy',life:12});campaignEvent(s,'down',{id:e.id,x:e.x,y:e.y,boss:e.boss,source,moor:e.role==='moor'});if(e.bossKind==='anchor')for(const m of anchorMoors(s,e)){m.hp=0;m.relink=0;m.released=true;}}}
function shotTarget(s,m,dir,hit,th,end){
 const ox=s.x+m.x,oy=s.y+m.y;
 if(hit){const vx=hit.x-ox,vy=hit.y+th-oy,n=Math.hypot(vx,vy);if(n>=24&&(vx*dir.x+vy*dir.y)/n>=.7)return {x:hit.x,y:hit.y};}
 const d=Math.max(32,distance(s,hit||end));return {x:ox+dir.x*d,y:oy+dir.y*d-th};
}
function release(s){if(s.action.weapon){releaseWeaponV9(s);return;}const a=s.action,c=s.c,magic=a.kind==='magic',m=magic?a.move:null,bm=magic?{x:a.dir.x*26,y:-44+a.dir.y*16}:muzzleV9(s.hero,s.arsenal?.active||'c9',a.dir),chest=e=>-foeBodyV9(e).h/2;
 if(magic){s.moveAnim=.48;s.moveKind=m?.id||(s.hero==='lulu'?'lulu_wave':'nox_pulse');}
 if(m&&!['beam','cone'].includes(m.kind)){
  let dmg=c.damage*m.mult+m.bonus+(c.movePower||0);
  if(s.counterReady>0){dmg+=Math.max(1,c.damage);s.counterReady=0;campaignEvent(s,'counter');}
  if(m.kind==='orb'){if(s.hero==='nox'&&c.dark)s.reveal=2.6;s.heroShots.push({layoutId:s.layoutId,x:s.x,y:s.y,ox:bm.x,my:bm.y,vx:a.dir.x*m.orbSpeed,vy:a.dir.y*m.orbSpeed,startX:s.x,startY:s.y,range:m.range,radius:m.radius,damage:dmg,stun:m.stun||0,heal:m.heal||0,shift:m.shift||0,color:m.color,isOrb:true,special:true,moveId:m.id});campaignEvent(s,'orbLaunch',{x:s.x,y:s.y,mx:bm.x,my:bm.y,dir:a.dir,color:m.color,moveId:m.id});return;}
  if(m.kind==='nova_shot'){for(const e of liveEnemies(s))if(distance(s,e)<=m.radius&&visible(s,e)){hitEnemy(s,e,dmg,'magic');if(e.hp>0&&!e.boss&&m.stun){e.state='stun';e.stun=Math.max(e.stun||0,m.stun);e.clock=0;}}for(const mn of s.mines||[])if(mn.hp>0&&distance(s,mn)<=m.radius){mn.hp=0;campaignEvent(s,'mineDisarmed',{x:mn.x,y:mn.y});}armCapsulesNear(s,s,m.radius);
   if(s.arsenal){const mx=maxMagV11(s.arsenal,s.arsenal.active);s.arsenal.ammo[s.arsenal.active]=Math.min(mx,s.arsenal.ammo[s.arsenal.active]+Math.ceil(mx*m.refill));s.arsenal.cooldown=0;s.arsenal.reloadRemaining=0;s.fireCd=0;}
   if(c.dark)s.reveal=2.6;campaignEvent(s,'magic',{x:s.x,y:s.y,mx:bm.x,my:bm.y,th:bm.y,dir:a.dir,to:{x:s.x+bm.x+a.dir.x*m.radius,y:s.y+a.dir.y*m.radius},area:true,rays:m.rays,r:m.radius,color:m.color,moveId:m.id});return;}
  if(m.kind==='aegis'){s.inv=Math.max(s.inv,m.inv||1.5);for(const e of liveEnemies(s))if(distance(s,e)<=m.radius&&visible(s,e)){if(e.guard>0){e.guard=0;campaignEvent(s,'guardBroken',{x:e.x,y:e.y});}hitEnemy(s,e,dmg,'magic');if(e.hp>0&&!e.boss){e.state='stun';e.stun=Math.max(e.stun||0,(m.stun||2)+(c.resonanceBonus||0));e.clock=0;}}campaignEvent(s,'aegis',{x:s.x,y:s.y,r:m.radius,color:m.color,moveId:m.id});return;}
  if(m.kind==='chain_burst'){const hits=liveEnemies(s).filter(e=>distance(s,e)<=m.range&&visible(s,e)).sort((x,y)=>distance(s,x)-distance(s,y)).slice(0,m.chains);for(const e of hits){hitEnemy(s,e,dmg,'magic');if(e.hp>0&&!e.boss){e.state='stun';e.stun=Math.max(e.stun||0,(m.stun||2.4)+(c.resonanceBonus||0));e.clock=0;}}if(m.heal&&hits.length)s.hp=Math.min(s.maxHp,s.hp+m.heal);campaignEvent(s,'supernova',{x:s.x,y:s.y,hits:hits.map(e=>({x:e.x,y:e.y})),r:m.range,color:m.color,moveId:m.id});return;}
  if(m.kind==='blade_dash'){const start={x:s.x,y:s.y},step=m.dashDist/6;for(let k=0;k<6;k++)moveActor(s,a.dir.x*step,a.dir.y*step,s.barriers);s.inv=Math.max(s.inv,.35);const hits=[];for(const e of liveEnemies(s))if(distance(s,e)<=m.radius+35&&visible(s,e)){if(e.guard>0){e.guard=0;campaignEvent(s,'guardBroken',{x:e.x,y:e.y});}hitEnemy(s,e,dmg,'magic');hits.push({x:e.x,y:e.y});if(e.hp>0&&!e.boss&&m.stun){e.state='stun';e.stun=Math.max(e.stun||0,m.stun);e.clock=0;}}for(const mn of s.mines||[])if(mn.hp>0&&distance(s,mn)<=m.radius){mn.hp=0;campaignEvent(s,'mineDisarmed',{x:mn.x,y:mn.y});}armCapsulesNear(s,s,m.radius);if(c.dark)s.reveal=2.6;campaignEvent(s,'bladeSlash',{from:start,x:s.x,y:s.y,dir:a.dir,r:m.radius,hits,color:m.color,moveId:m.id});return;}
  if(m.kind==='stasis_field'){if(m.shift)s.shift=Math.max(s.shift||0,m.shift);const hits=[];for(const e of liveEnemies(s))if(distance(s,e)<=m.radius&&visible(s,e)){hitEnemy(s,e,dmg,'magic');hits.push({x:e.x,y:e.y});if(e.hp>0&&!e.boss){e.state='stun';e.stun=Math.max(e.stun||0,(m.stun||3)+(c.resonanceBonus||0));e.clock=0;}}campaignEvent(s,'stasisField',{x:s.x,y:s.y,r:m.radius,hits,color:m.color,moveId:m.id});return;}
 }
 const area=magic&&s.hero==='lulu',range=magic?(area?240:420):GUN_RANGE;const end=trace(s,a.dir,range);
 const hitList=liveEnemies(s).filter(e=>{const dx=e.x-s.x,dy=e.y-s.y,d=Math.hypot(dx,dy),along=dx*a.dir.x+dy*a.dir.y,side=Math.abs(dx*a.dir.y-dy*a.dir.x);return d<=range&&visible(s,e)&&along>=0&&(area?along/Math.max(1,d)>.3:side<(e.boss?34:22)+(magic?14:3));}).sort((x,y)=>distance(s,x)-distance(s,y));
 // Ordinary rounds stop at the first solid target: a mine cannot be disarmed through an enemy.
 const mine=!magic?(s.mines||[]).filter(m=>{const dx=m.x-s.x,dy=m.y-s.y,along=dx*a.dir.x+dy*a.dir.y;return m.hp>0&&along>=0&&along<=range&&Math.abs(dx*a.dir.y-dy*a.dir.x)<23&&visible(s,{...m,layoutId:s.layoutId});}).sort((x,y)=>distance(s,x)-distance(s,y))[0]:null;
 const mineHit=mine&&(!hitList[0]||distance(s,mine)<distance(s,hitList[0]));
 if(mineHit){hitList.length=0;mine.hp=0;campaignEvent(s,'mineDisarmed',{x:mine.x,y:mine.y});}
 const cap=!magic?capsuleOnLine(s,a.dir,range):null;if(cap&&(!hitList[0]||distance(s,cap)<distance(s,hitList[0]))){hitList.length=0;armCapsule(s,cap);}
 const resonance=magic&&s.hero==='lulu';let n=(resonance?c.damage+1:magic?c.damage*3+2:c.damage)+(magic?(c.movePower||0):0);
 if(s.counterReady>0){n+=Math.max(1,c.damage);s.counterReady=0;campaignEvent(s,'counter');for(const e of hitList)if(e.guard>0){e.guard=0;campaignEvent(s,'guardBroken',{x:e.x,y:e.y});}}
 for(const e of area?hitList:hitList.slice(0,1)){hitEnemy(s,e,n,magic?'magic':'gun');if(resonance&&e.hp>0){e.state='stun';e.stun=(c.mode==='stealth'?5:2.2)+(c.resonanceBonus||0);e.clock=0;}}
 if(magic&&s.hero==='nox'&&c.dark)s.reveal=2.6;
 const hit=mineHit?mine:!area&&hitList[0]?hitList[0]:null,th=mineHit?-10:hit?chest(hit):bm.y,to=shotTarget(s,bm,a.dir,hit,th,end);
 campaignEvent(s,magic?'magic':'shot',{x:s.x,y:s.y,dir:a.dir,to,area,mx:bm.x,my:bm.y,th,wall:!hit&&distance(s,end)<range-2,...(magic?{moveId:m?.id,color:m?.color}:{weapon:s.arsenal?.active||'c9'})});
}
// Weapon rays use the same walls, target state and player-owned boss damage as legacy attacks.
function releaseWeaponV9(s){
 const a=s.action,w=a.weapon,m=muzzleV9(s.hero,w.id,a.dir),mz={mx:m.x,my:m.y},chest=e=>-foeBodyV9(e).h/2; // R28: where the bullet leaves and lands, for the renderer
 if(w.proj==='orb'||w.proj==='bolt'){
  const counter=s.counterReady>0;if(counter){s.counterReady=0;campaignEvent(s,'counter');}
  const dmg=s.c.damage*w.damage+(counter?s.c.damage:0)+(w.proj==='orb'?(s.c.movePower||0):0);
  s.heroShots.push({layoutId:s.layoutId,x:s.x,y:s.y,ox:m.x,my:m.y,vx:a.dir.x*w.orbSpeed,vy:a.dir.y*w.orbSpeed,startX:s.x,startY:s.y,range:w.range,radius:w.orbRadius||24,damage:dmg,stun:w.stun||0,color:w.color,isOrb:w.proj==='orb',weapon:w.id});
  campaignEvent(s,w.proj==='orb'?'orbLaunch':'shot',{x:s.x,y:s.y,dir:a.dir,to:{x:s.x+m.x+a.dir.x*120,y:s.y+a.dir.y*120},th:m.y,weapon:w.id,proj:w.proj,color:w.color,bolt:w.proj==='bolt',...mz});
  return;
 }
 const targets=liveEnemies(s),counter=s.counterReady>0;
 if(counter){s.counterReady=0;campaignEvent(s,'counter');}
 for(let pellet=0;pellet<w.pellets;pellet++){
  const angle=Math.atan2(a.dir.y,a.dir.x)+(pellet-(w.pellets-1)/2)*w.spread,dir={x:Math.cos(angle),y:Math.sin(angle)},pm=muzzleV9(s.hero,w.id,dir);
  const hits=targets.filter(e=>{const dx=e.x-s.x,dy=e.y-s.y;return distance(s,e)<=w.range&&visible(s,e)&&dx*dir.x+dy*dir.y>=0&&Math.abs(dx*dir.y-dy*dir.x)<(e.boss?37:25);}).sort((x,y)=>distance(s,x)-distance(s,y)).slice(0,w.pierce);
  const mine=(s.mines||[]).filter(m=>{const dx=m.x-s.x,dy=m.y-s.y,along=dx*dir.x+dy*dir.y;return m.hp>0&&along>=0&&along<=w.range&&Math.abs(dx*dir.y-dy*dir.x)<23&&visible(s,{...m,layoutId:s.layoutId});}).sort((x,y)=>distance(s,x)-distance(s,y))[0];
  const cap=capsuleOnLine(s,dir,w.range);if(cap&&(!hits[0]||distance(s,cap)<distance(s,hits[0]))&&(!mine||distance(s,cap)<distance(s,mine))){armCapsule(s,cap);campaignEvent(s,'shot',{x:s.x,y:s.y,to:shotTarget(s,pm,dir,cap,-10,cap),dir,weapon:w.id,proj:w.proj,color:w.color,mx:pm.x,my:pm.y,th:-10});continue;}
  if(mine&&(!hits[0]||distance(s,mine)<distance(s,hits[0]))){mine.hp=0;campaignEvent(s,'mineDisarmed',{x:mine.x,y:mine.y});campaignEvent(s,'shot',{x:s.x,y:s.y,to:shotTarget(s,pm,dir,mine,-10,mine),dir,weapon:w.id,proj:w.proj,color:w.color,mx:pm.x,my:pm.y,th:-10});continue;}
  const damage=s.c.damage*w.damage+(counter?s.c.damage:0);
  let from=s;
  for(let i=0;i<hits.length;i++){
   const e=hits[i];if(counter)e.guard=0;hitEnemy(s,e,damage*(i>=w.pierce?.7:1),'gun');
   if(w.stun&&!e.boss&&e.hp>0){e.state='stun';e.stun=w.stun;e.clock=0;}
   if(i>=w.pierce)campaignEvent(s,'shot',{x:from.x,y:from.y,to:{x:e.x,y:e.y},dir,weapon:w.id,proj:w.proj,color:w.color,mx:0,my:chest(from),th:chest(e),chain:true});from=e;
   if(w.chain&&hits.length<1+w.chain){const next=targets.filter(t=>t.hp>0&&!hits.includes(t)&&distance(e,t)<=w.chainRange&&visible(e,t)).sort((x,y)=>distance(e,x)-distance(e,y))[0];if(next)hits.push(next);}
  }
  const end=hits[0]||trace(s,dir,w.range),th=hits[0]?chest(hits[0]):pm.y;campaignEvent(s,'shot',{x:s.x,y:s.y,to:shotTarget(s,pm,dir,hits[0],th,end),dir,weapon:w.id,proj:w.proj,color:w.color,wall:!hits[0]&&distance(s,end)<w.range-2,mx:pm.x,my:pm.y,th});
 }
}
// Boss checkpoint after a defeat: devices stay secured, minions are gone, the boss is awake at full strength.
export function resumeAtBoss(s){const b=s.enemies.find(e=>e.boss);if(!b||s.status!=='playing')return false;
 for(const n of s.nodes)n.on=true;s.enemies=[b];s.wave=Math.max(0,(s.c.waves?.length||1)-1);b.state='walk';b.clock=0;b.hunting=true;s.actions=[];return true;}
function nodeContested(s,n){return liveEnemies(s).some(e=>distance(e,n)<145&&e.state!=='patrol'&&e.state!=='stun');}
function activateNode(s,n){n.on=true;s.channel=null;s.hp=Math.min(s.maxHp,s.hp+2+(s.c.nodeHeal||0));const count=s.nodes.filter(v=>v.on).length;
 campaignEvent(s,'node',{x:n.x,y:n.y,nodeIndex:s.nodes.indexOf(n),firstActive:count===1,count});
 if(s.mission==='zero'&&count===2){s.duoDesync=10;if(s.partner)s.partner.cd=Math.max(s.partner.cd||0,3.6);campaignEvent(s,'duoBroken',{x:s.x,y:s.y,count});}
 if(s.c.mode!=='stealth'&&s.wave<(s.c.waves?.length||0)-1)spawnWave(s,s.wave+1);
 if(s.c.boss&&count===s.nodes.length)wakeBoss(s);}
export function interactNode(s){if(s.status!=='playing')return false;const n=s.nodes.find(n=>!n.on&&distance(s,n)<85);if(!n)return false;if(nodeContested(s,n)){campaignEvent(s,'blocked');return false;}activateNode(s,n);return true;}
function startChannel(s){const n=s.nodes.find(n=>!n.on&&distance(s,n)<85);if(!n)return false;if(nodeContested(s,n)){campaignEvent(s,'blocked');return false;}
 const need=s.c.channel??(s.hero==='lulu'?.45:.8);if(need<=0){activateNode(s,n);return true;}s.channel={node:s.nodes.indexOf(n),t:0,need};campaignEvent(s,'channel');return true;}
// The boss reads the rhythm of its own fight, never shots spent on the minions before it woke.
function wakeBoss(s){const b=s.enemies.find(e=>e.boss&&e.state==='dormant');if(!b)return;b.state='walk';b.clock=0;s.actions=[];for(const [i,role]of (s.c.boss.openingAdds||[]).entries()){const at=getLayout(s.layoutId)?.entries[i]||EDGES[i];const escort=makeEnemy(s,role,at,s.nextId++);escort.hunting=true;s.enemies.push(escort);}campaignEvent(s,'bossWake',{x:b.x,y:b.y,kind:b.bossKind});}
function hurtHero(s,source){if(s.inv>0)return false;s.hp--;if(s.c?.loveAid&&!s.loveCame&&s.hp>0&&s.hp<=Math.ceil(s.maxHp*.3)){s.loveCame=true;s.hp=Math.min(s.maxHp,s.hp+3);campaignEvent(s,'loveAid',{x:s.x,y:s.y});}s.hurtAnim=.28;s.inv=.7;if(s.combo>0){s.combo=0;s.comboTimer=0;}if(s.channel){s.channel=null;campaignEvent(s,'channelBroken');}campaignEvent(s,'hurt',{source});return true;}
// CS (D29): Nox's Perfect Dodge with the shift charged slows enemies to x.5 for .6 s; recharge 3 s from activation.
function perfectDodge(s){s.perfectWindow=0;s.counterReady=.6;s.duo=clamp(s.duo+(s.signature==='sonic_nova'?0:14),0,100);if(s.signature==='sonic_nova'&&s.sigCd>0)s.sigCd=Math.max(0,s.sigCd-.6);const shift=s.hero==='nox'&&!s.shiftCd;if(shift){s.shift=.6;s.shiftCd=3;}campaignEvent(s,'perfectDodge',{x:s.x,y:s.y,...shift&&{shift:true}});}
// An attack resolves against the hero: damage, plain i-frames, or Perfect Dodge.
function resolveThreat(s,source){if(s.perfectWindow>0){perfectDodge(s);return 'perfect';}if(hurtHero(s,source))return 'hit';return 'avoided';}
function fireShot(s,e,to,speed=430,spread=0){const spd=speed+(s.c?.boss?0:Math.max(0,(s.c?.act||(s.level+1))-1)*12),d=unit({x:to.x-e.x,y:to.y-e.y}),a=Math.atan2(d.y,d.x)+spread;s.shots.push({x:e.x,y:e.y-34,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,life:1.6,boss:e.boss});}
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
  if(e.clock<e.windup*.5)e.target={x:s.x,y:s.y};if(e.target&&e.target.x!==e.x)e.face=e.target.x<e.x?-1:1;lockCue(s,e,e.windup*.5,dt,'rook');
  if(e.clock>=e.windup){for(let i=-1;i<=1;i++)fireShot(s,e,e.target,365,i*.095);campaignEvent(s,'rookShot',{x:e.x,y:e.y,to:e.target});e.state='recover';e.clock=0;}
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
// The Anchor holds the breach still and calls that protection. Three mooring lines make the core
// untouchable; any attack can cut a line (Lulú's Resonance cuts one at once and interrupts the core,
// rounds need two hits, Nox's support fire helps). With every line cut the core is exposed until the
// first line re-moors. It never moves: the player must move around it, using cover against sweeps.
export const ANCHOR_RULES=Object.freeze({lineRadius:250,relink:Object.freeze([10,7.5]),phase2At:.5,
 sweep:Object.freeze({windup:1.25,lock:.55,length:560,width:64,spread:.42}),slam:Object.freeze({windup:1.1,r:120,trigger:190}),recover:Object.freeze([1.1,.8])});
export const anchorMoors=(s,e)=>s.enemies.filter(m=>m.role==='moor'&&m.anchorId===e.id);
export const anchorShielded=(s,e)=>anchorMoors(s,e).some(m=>m.hp>0);
function anchorThink(s,e,dt){
 const R=ANCHOR_RULES,l=getLayout(s.layoutId);let moors=anchorMoors(s,e);
 if(!moors.length){moors=[0,1,2].map(i=>{const a=-Math.PI/2+i*2*Math.PI/3,at=nearestFloor(l,{x:e.x+Math.cos(a)*R.lineRadius,y:e.y+Math.sin(a)*R.lineRadius}),m=makeEnemy(s,'moor',at,s.nextId++);m.anchorId=e.id;m.state='moor';m.relink=0;s.enemies.push(m);return m;});campaignEvent(s,'anchorMoored',{x:e.x,y:e.y});}
 if(e.hp/e.max<R.phase2At&&e.phase===0){e.phase=1;for(const i of [0,1]){const at=l?.entries[i]||EDGES[i],add=makeEnemy(s,'raider',at,s.nextId++);add.hunting=true;s.enemies.push(add);}campaignEvent(s,'bossPhase',{phase:1,kind:'anchor'});}
 for(const m of moors){if(m.hp>0||m.released)continue;if(!m.relink){m.relink=R.relink[e.phase];continue;}m.relink=Math.max(0,m.relink-dt);
  if(m.relink===0){m.hp=m.max;m.deathAnim=0;m.state='moor';m.relink=0;campaignEvent(s,'anchorRelink',{x:m.x,y:m.y});}}
 const exposed=!moors.some(m=>m.hp>0);if(exposed!==!!e.exposed){e.exposed=exposed;campaignEvent(s,exposed?'anchorExposed':'anchorShielded',{x:e.x,y:e.y});}
 e.face=s.x<e.x?-1:1;
 if(e.state==='anchorSweep'){
  if(e.clock<e.windup*R.sweep.lock){const base=Math.atan2(s.y-e.y,s.x-e.x);e.sweepDirs=(e.phase?[-R.sweep.spread,R.sweep.spread]:[0]).map(o=>({x:Math.cos(base+o),y:Math.sin(base+o)}));}lockCue(s,e,e.windup*R.sweep.lock,dt,'sweep',e);
  if(e.clock>=e.windup){const hit=e.sweepDirs.some(u=>{const dx=s.x-e.x,dy=s.y-e.y,along=dx*u.x+dy*u.y;return along>=0&&along<=R.sweep.length&&Math.abs(dx*u.y-dy*u.x)<R.sweep.width/2;});
   if(hit&&visible(e,s))resolveThreat(s,'sweep');campaignEvent(s,'anchorSweep',{x:e.x,y:e.y,dirs:e.sweepDirs,length:R.sweep.length});e.state='recover';e.clock=0;}
 }else if(e.state==='warn'){
  return false;
 }else if(e.state==='recover'){
  if(e.clock>=R.recover[e.phase]){e.state='walk';e.clock=0;}
 }else if(e.clock>.9&&distance(s,e)<=R.sweep.length+40){
  // Out of reach the core waits: a sweep that cannot land is noise, not pressure.
  e.clock=0;e.pattern++;
  // Too close: the weight drops where the hero stands, with the shared red-circle telegraph.
  if(distance(s,e)<R.slam.trigger){e.state='warn';e.attack='slam';e.target={x:s.x,y:s.y};e.windup=R.slam.windup;e.attackRadius=R.slam.r;}
  else{e.state='anchorSweep';e.attack='sweep';e.windup=R.sweep.windup;const base=Math.atan2(s.y-e.y,s.x-e.x);e.sweepDirs=(e.phase?[-R.sweep.spread,R.sweep.spread]:[0]).map(o=>({x:Math.cos(base+o),y:Math.sin(base+o)}));campaignEvent(s,'anchorSweepWarn',{x:e.x,y:e.y});}
 }
 return true;
}
function bossThink(s,e,dt,d){
 if(e.bossKind==='rook')return rookThink(s,e,dt);
 if(e.bossKind==='anchor')return anchorThink(s,e,dt);
 const kind=e.bossKind,ratio=e.hp/e.max;
 const phase=ratio<.34?2:ratio<.67?1:0;if(phase>e.phase){e.phase=phase;if(kind==='archon'&&s.c.strangersAid&&!s.strangersCame){s.strangersCame=true;s.allies=[{id:'kairn',x:s.x-75,y:s.y-60,cd:0,face:1,anim:'idle',animT:0},{id:'morrow',x:s.x+75,y:s.y-60,cd:.3,face:-1,anim:'idle',animT:0}];s.allyTime=8;campaignEvent(s,'strangersAid',{x:s.x,y:s.y});}if(['tyrant','behemoth','reaper','vega'].includes(kind))e.phaseFlash=.48;if(kind!=='mirror'&&s.c.waves?.length)spawnWave(s,Math.min(s.c.waves.length-1,s.wave+1));campaignEvent(s,'bossPhase',{phase,kind});
  if(s.c.join&&phase>=s.c.join.phase&&!s.partner){s.partner={layoutId:s.layoutId,...nearestFloor(getLayout(s.layoutId),{x:clamp(s.x-70,40,SIZE-40),y:clamp(s.y+60,40,SIZE-40)}),walk:0,cd:1};s.signature='duo';s.overdrive=0;s.heat=0;s.sonicAura=0;s.sonicShield=0;s.duo=100;campaignEvent(s,'partnerJoin',{x:s.partner.x,y:s.partner.y});}}
 if(kind==='mirror'){const recent=s.actions.slice(-8);if(recent.length>=8&&recent.every(k=>k==='gun')&&e.guard<=0&&e.state==='walk'){e.guard=2.2;s.actions=[];campaignEvent(s,'adapt',{x:e.x,y:e.y});}}
 if(e.state==='vegaTempo'){
  e.tempoBeat=e.vegaShots||0;
  if(e.vegaShots<3){if(e.clock>=.42){e.target={x:s.x,y:s.y};if(e.target.x!==e.x)e.face=e.target.x<e.x?-1:1;fireShot(s,e,e.target,320,0);e.vegaShots++;e.tempoBeat=e.vegaShots;e.clock=0;campaignEvent(s,'vegaRhythm',{id:e.id,shot:e.vegaShots,x:e.x,y:e.y,to:e.target});}}
  else{if(e.clock<e.windup*.6)e.target={x:s.x,y:s.y};if(e.target&&e.target.x!==e.x)e.face=e.target.x<e.x?-1:1;lockCue(s,e,e.windup*.6,dt,'ranged');if(e.clock>=e.windup){fireShot(s,e,e.target,540,0);campaignEvent(s,'vegaFourth',{id:e.id,x:e.x,y:e.y,to:e.target});e.weakExposed=1.6;campaignEvent(s,'weakExposed',{id:e.id,kind,x:e.x,y:e.y});e.state='recover';e.clock=0;}}
  return true;
 }
 if(e.state==='tyrantBone'){
  if(e.clock>=(e.windup||.7)){const u=unit({x:s.x-e.x,y:s.y-e.y}),at=nearestFloor(getLayout(s.layoutId),{x:e.x+u.x*96,y:e.y+u.y*96});s.mines.push({...at,age:0,life:6.5,hp:1,r:56,tyrantBone:true});if(s.mines.length>3)s.mines.shift();campaignEvent(s,'tyrantBone',{x:at.x,y:at.y});e.weakExposed=1.5;campaignEvent(s,'weakExposed',{id:e.id,kind,x:e.x,y:e.y});e.state='recover';e.clock=0;}
  return true;
 }
 if(e.state==='behemothVent'){
  e.weakExposed=Math.max(e.weakExposed||0,.05);
  if(e.clock>=(e.windup||1.4)){e.weakExposed=1.7;campaignEvent(s,'behemothVent',{x:e.x,y:e.y});campaignEvent(s,'weakExposed',{id:e.id,kind,x:e.x,y:e.y});e.state='recover';e.clock=0;}
  return true;
 }
 if(e.state==='reaperMirage'){
  if(e.clock<e.windup*.55){e.target={x:s.x,y:s.y};if(e.target.x!==e.x)e.face=e.target.x<e.x?-1:1;e.possibleStrikes=e.mirages=[{x:s.x,y:s.y,real:true},{x:s.x-110,y:s.y+70,real:false},...(e.phase>0?[{x:s.x+110,y:s.y-70,real:false}]:[])];}
  lockCue(s,e,e.windup*.55,dt,'melee');
  if(e.clock>=e.windup){if(distance(s,e.target)<e.attackRadius&&visible(e,s))resolveThreat(s,'melee');campaignEvent(s,'enemyAttack',{id:e.id,x:e.target.x,y:e.target.y,r:e.attackRadius,bossKind:kind,mirage:true});e.weakExposed=1.5;campaignEvent(s,'weakExposed',{id:e.id,kind,x:e.x,y:e.y});e.state='recover';e.clock=0;}
  return true;
 }
 if(e.state==='recover'&&(kind==='tyrant'||kind==='behemoth')&&!e.weakTriggered){e.weakTriggered=true;e.weakExposed=1.6;campaignEvent(s,'weakExposed',{id:e.id,kind,x:e.x,y:e.y});}
 if(e.state!=='walk')return false;
 const ready=e.clock>(phase===2?.7:1.1);if(!ready)return false;
 const patterns=kind==='vega'?['vegaTempo','volley','vegaDash']:kind==='reaper'?['reaperMirage','charge','volley']:kind==='tyrant'?['tyrantBone','slam','volley']:kind==='behemoth'?['behemothVent','charge','behemothSlag']:kind==='mirror'?['charge','volley','charge','slam']:kind==='archon'?['slam','volley','charge','volley']:['slam','charge','slam','volley'];
 const p=patterns[e.pattern++%patterns.length];e.clock=0;e.attack=p;e.weakTriggered=false;if(s.x!==e.x)e.face=s.x<e.x?-1:1;
 if(p==='tyrantBone'){e.state='tyrantBone';e.windup=.75;campaignEvent(s,'tyrantBoneWarn',{id:e.id,x:e.x,y:e.y});}
 else if(p==='behemothVent'){e.state='behemothVent';e.windup=.55;e.weakExposed=1.2;campaignEvent(s,'behemothVent',{x:e.x,y:e.y});campaignEvent(s,'weakExposed',{id:e.id,kind,x:e.x,y:e.y});}
 else if(p==='vegaTempo'){e.state='vegaTempo';e.vegaShots=0;e.tempoBeat=0;e.target={x:s.x,y:s.y};e.windup=.85-phase*.12;campaignEvent(s,'vegaTempoWarn',{id:e.id,x:e.x,y:e.y});}
 else if(p==='vegaDash'){const at=nearestFloor(getLayout(s.layoutId),{x:e.x,y:e.y});s.mines.push({...at,age:0,life:7,hp:1,r:78});if(s.mines.length>3)s.mines.shift();campaignEvent(s,'rookMine',{x:at.x,y:at.y});e.state='charge';e.target={x:s.x,y:s.y};e.dir=unit({x:s.x-e.x,y:s.y-e.y});e.windup=.75;}
 else if(p==='reaperMirage'){e.state='reaperMirage';e.target={x:s.x,y:s.y};e.attackRadius=115;e.windup=1.1-phase*.1;e.possibleStrikes=e.mirages=[{x:s.x,y:s.y,real:true},{x:s.x-110,y:s.y+70,real:false},...(phase>0?[{x:s.x+110,y:s.y-70,real:false}]:[])];campaignEvent(s,'reaperMirageWarn',{id:e.id,x:e.x,y:e.y,strikes:e.possibleStrikes});}
 else if(p==='behemothSlag'){const u=unit({x:s.x-e.x,y:s.y-e.y}),at=nearestFloor(getLayout(s.layoutId),{x:e.x+u.x*160,y:e.y+u.y*160});s.mines.push({...at,age:0,life:8,hp:1,r:88});if(s.mines.length>3)s.mines.shift();campaignEvent(s,'behemothSlag',{x:at.x,y:at.y});e.state='warn';e.target={x:s.x,y:s.y};e.attackRadius=142+phase*10;e.windup=1.1-phase*.08;}
 else if(p==='slam'){e.state='warn';e.target={x:s.x,y:s.y};e.attackRadius=kind==='mirror'?110:140+phase*12;e.windup=1.15-phase*.12;}
 else if(p==='charge'){e.state='charge';e.target={x:s.x,y:s.y};e.dir=unit({x:s.x-e.x,y:s.y-e.y});e.windup=.85-phase*.08;}
 else{e.state='volley';e.target={x:s.x,y:s.y};e.windup=.7;e.emitter=kind==='archon'&&phase===1?s.nodes[e.pattern%s.nodes.length]:null;}
 return true;
}
// N1 (D27): a SCHIVA, SPARA or PULSE press that cannot act yet is kept for 100 ms of game time
// (6 frames at 60 Hz) and retried every tick; the newest press replaces the old one and its aim.
export const INPUT_BUFFER=.1;
// Pause, scenes and app suspends drop any buffered press: only fields the state already has are reset.
export function clearInputBuffer(s){for(const k of ['dashBuf','gunBuf','magicBuf'])if(k in s)s[k]=0;for(const k of ['gunAim','magicAim'])if(k in s)s[k]=null;}
export function tick(s,input,dt){const reloadBefore=s.arsenal?.reloadRemaining||0;dt=clamp(dt,0,.05)||0;s.events=[];if(s.status!=='playing')return;s.time+=dt;if(s.bossWakeDue){s.bossWakeDue=false;const b=s.enemies.find(e=>e.boss&&e.hp>0);if(b)campaignEvent(s,'bossWake',{x:b.x,y:b.y,kind:b.bossKind,entrance:true});}const c=s.c;
 for(const k of ['fireCd','magicCd','dashCd','dash','inv','perfectWindow','counterReady','hurtAnim','duoAnim','moveAnim','sigCd','sonicAura','overdrive','heat','reveal','quickdrawWindow','dashBuf','gunBuf','magicBuf','shiftCd','duoDesync'])s[k]=Math.max(0,(s[k]||0)-dt);
 if(s.sonicAura===0)s.sonicShield=0;
 if(s.sonicAura>0)s.magicCd=Math.max(0,s.magicCd-dt*.5);
 // Enemy time: read before the shift timer runs down, so a .6 s shift slows 36 ticks of 1/60 s.
 // Outside the decrement list above on purpose (D29): the Perfect Dodge sets s.shift mid-tick, so decrementing after the read gives the full 36 ticks.
 const edt=dt*(s.shift>0?.5:1);s.shift=Math.max(0,(s.shift||0)-dt);
 if(input.dash)s.dashBuf=INPUT_BUFFER;for(const k of ['gun','magic'])if(input[k]){s[k+'Buf']=INPUT_BUFFER;s[k+'Aim']=input.aim||null;}
 if(s.arsenal){tickArsenalV9(s.arsenal,dt);if(input.reload)s.reloadRequested=true;if(!s.action){if(input.switchWeapon&&!s.weaponSwitchHeld&&switchWeaponV9(s.arsenal,typeof input.switchWeapon==='string'?input.switchWeapon:undefined))campaignEvent(s,'weaponSwitch',{weapon:s.arsenal.active});if(s.reloadRequested){if(reloadWeaponV9(s.arsenal))campaignEvent(s,'reload');s.reloadRequested=false;}}s.weaponSwitchHeld=!!input.switchWeapon;}
 if(input.switchMove&&!s.moveSwitchHeld&&switchMove(s,typeof input.switchMove==='string'?input.switchMove:undefined));s.moveSwitchHeld=!!input.switchMove;
 const raw={x:input.x||0,y:input.y||0},mag=Math.hypot(raw.x,raw.y),v=mag>1?unit(raw):raw;
 if(mag>.08)s.face=unit(v);if(input.aim)s.aim=unit(input.aim);
 if(s.dashBuf>0&&s.dashCd===0){s.dashBuf=0;s.dash=.18;s.dashCd=s.overdrive>0?.6:1.1;s.inv=.3;s.perfectWindow=s.overdrive>0?.2:.14;campaignEvent(s,'dash');if(c.quickdraw&&s.arsenal?.active==='c9'){s.quickdrawWindow=1;campaignEvent(s,'quickdrawReady');}rememberAction(s,'dash');}
 const speed=s.dash?660:205*(s.heat>0?.72:1)*(s.sonicAura>0&&c.mode!=='stealth'?1.12:1);const before={x:s.x,y:s.y};moveActor(s,(s.dash?s.face.x:v.x)*speed*dt,(s.dash?s.face.y:v.y)*speed*dt);const moved=distance(s,before);s.stride=moved;s.walk+=moved*.065;
 if(s.channel){const n=s.nodes[s.channel.node];if(!n||distance(s,n)>95){s.channel=null;campaignEvent(s,'channelBroken');}else{s.channel.t+=dt;if(s.channel.t>=s.channel.need)activateNode(s,n);}}
 if(s.allies)tickAllies(s,dt);
 if((s.mission==='app_breach'||s.mission==='breach'||s.mission==='bone_tyrant')&&!s.breachDoorActivated){
  const dy=s.mission==='bone_tyrant'?1290:512;
  if(Math.hypot(s.x-768,s.y-dy)<96||s.nodes.some(n=>n.on)){
   s.breachDoorActivated=true;s.breachDoorOpen=1;s.hp=Math.min(s.maxHp,s.hp+2);s.duo=clamp(s.duo+25,0,100);
   for(const e of liveEnemies(s))if(!e.boss&&Math.hypot(e.x-768,e.y-dy)<185){e.state='stun';e.stun=Math.max(e.stun||0,1.6);e.clock=0;}
   campaignEvent(s,'breachDoor',{x:768,y:dy,mission:s.mission});
  }
 }
 const p=s.partner;if(p){const pd=distance(s,p);if(pd>55){const pg=clearWalk(p,s)?s:routeWaypoint(getLayout(s.layoutId),p,s);const u=unit({x:pg.x-p.x,y:pg.y-p.y});const q={x:p.x,y:p.y};moveActor(p,u.x*Math.min(240,(pd-45)*5)*dt,u.y*Math.min(240,(pd-45)*5)*dt);p.walk+=distance(p,q)*.065;}
  // The partner is an ally, not decoration: a steady covering shot at the nearest visible threat.
  p.cd=(p.cd??1.5)-dt;if(p.cd<=0){const e=liveEnemies(s).filter(e=>distance(p,e)<320&&visible(p,e)&&!(e.bossKind==='anchor'&&anchorShielded(s,e))).sort((a,b)=>distance(p,a)-distance(p,b))[0];p.cd=e?(s.duoDesync>0?3.8:2.8):.4;if(e){hitEnemy(s,e,Math.max(1,Math.floor(c.damage/2)),'partner');campaignEvent(s,'partnerShot',{x:p.x,y:p.y,to:{x:e.x,y:e.y}});}}}
 if(input.gun&&s.arsenal&&String(WEAPONS_V9[s.arsenal.active]?.proj||'').endsWith('tracer'))s.spinUp=clamp((s.spinUp||0)+dt*.9,0,1);
 if(s.gunBuf>0&&startAttack(s,'gun',s.gunAim))s.gunBuf=0;if(s.magicBuf>0&&startAttack(s,'magic',s.magicAim))s.magicBuf=0;
 if(!input.gun&&!s.action)s.spinUp=Math.max(0,(s.spinUp||0)-dt*1.4);
 if(s.arsenal?.reloadRemaining>0&&reloadBefore===0&&!s.events.some(e=>e.type==='reload'))campaignEvent(s,'reload');
 if(s.action){const live=input.aimLive!==undefined?input.aimLive:input.aim;if(live&&!input.gun&&!input.magic&&s.action.t>0){const w=s.action.weapon,m=s.action.move,rng=s.action.kind==='magic'?(!m||['beam','cone'].includes(m.kind)?420:m.range||420):w?.range||GUN_RANGE;s.action.dir=s.aim=aimAt(s,live,rng,s.action.kind);}s.action.t+=dt;if(s.action.weapon){const sp=s.action.step||.065,wd=s.action.windup??.09;while(s.action.shotsReleased<s.action.weapon.burst&&s.action.t>=wd+s.action.shotsReleased*sp){release(s);s.action.shotsReleased++;}}else if(!s.action.fired&&s.action.t>=(s.action.kind==='gun'?.09:.27)){s.action.fired=true;release(s);}if(s.action.t>=s.action.duration)s.action=null;}
 if(input.duo&&s.signature==='duo'&&s.duo>=100){
  if(s.duoDesync>0&&!s.duoBrokenOnce){s.duoBrokenOnce=true;s.duoAnim=.45;s.duo=60;s.hp=Math.min(s.maxHp,s.hp+1);s.inv=.8;campaignEvent(s,'duoBroken',{x:s.x,y:s.y});rememberAction(s,'duo');}
  else{s.duoAnim=.65;s.duo=0;s.hp=Math.min(s.maxHp,s.hp+2);s.inv=1;const hits=[];for(const e of liveEnemies(s))if(distance(s,e)<300&&visible(s,e)){hits.push({x:e.x,y:e.y});hitEnemy(s,e,c.damage*2,'duo');if(e.hp>0){e.state='stun';e.stun=1.2;e.clock=0;}}campaignEvent(s,'duo',{x:s.x,y:s.y,hits});rememberAction(s,'duo');}
 }
 if(input.duo&&s.signature==='overdrive'&&s.duo>=100&&!s.overdrive){s.overdrive=1.35;s.duo=0;s.inv=.4;for(const e of liveEnemies(s)){if(distance(s,e)>172)continue;hitEnemy(s,e,Math.max(2,s.c.damage*2),'pulse');if(e.hp<=0)continue;if(e.boss){e.weakExposed=Math.max(e.weakExposed||0,1.25);campaignEvent(s,'weakExposed',{id:e.id,kind:e.bossKind,x:e.x,y:e.y});}else{e.state='stun';e.stun=1.1;e.clock=0;}}campaignEvent(s,'overdrive',{x:s.x,y:s.y,shock:true});rememberAction(s,'overdrive');}
 if(s.signature==='overdrive'&&s.overdrive===0&&s.wasOverdrive){s.heat=2.2;campaignEvent(s,'heat');}s.wasOverdrive=s.overdrive>0;
 if(input.duo&&s.signature==='sonic_nova'&&s.sigCd===0){
  const r=190,auraLife=c.sonicAuraLife||2.4,hits=[];let shotsCleared=0,minesDisarmed=0;
  for(const b of s.shots)if(Math.hypot(b.x-s.x,b.y+34-s.y)<=110){b.life=0;shotsCleared++;campaignEvent(s,'shotBlocked',{x:b.x,y:b.y});}
  for(const m of s.mines||[])if(m.hp>0&&distance(s,m)<=r){m.hp=0;minesDisarmed++;campaignEvent(s,'mineDisarmed',{x:m.x,y:m.y});}armCapsulesNear(s,s,r);
  for(const e of liveEnemies(s))if(distance(s,e)<=r&&visible(s,e)){hitEnemy(s,e,c.damage,'sonic');hits.push({x:e.x,y:e.y});if(e.hp>0&&!e.boss){e.state='stun';e.stun=Math.max(e.stun||0,.9);e.clock=0;const u=unit({x:e.x-s.x,y:e.y-s.y});moveActor(e,u.x*60,u.y*60);}}
  if(c.mode==='stealth'&&!s.alarm&&hits.length)raiseAlarm(s);
  if((hits.length||shotsCleared||minesDisarmed)&&s.hp<s.maxHp)s.hp=Math.min(s.maxHp,s.hp+1);
  s.inv=Math.max(s.inv,.25);s.sonicAura=auraLife;s.sonicShield=c.sonicAuraLife?2:1;s.sigCd=13;
  campaignEvent(s,'sonicNova',{x:s.x,y:s.y,r,aura:auraLife,shield:s.sonicShield,hits,shotsCleared,minesDisarmed});rememberAction(s,'sonicNova');
 }
 if(s.signature==='sonic_nova')s.duo=Math.round(100*(1-s.sigCd/13));
 // Hero traveling projectiles (Energy Spheres & plasma bolts).
 for(const q of s.heroShots){if(q.done)continue;const prev={layoutId:s.layoutId,x:q.x,y:q.y};q.x+=q.vx*dt;q.y+=q.vy*dt;const cur={layoutId:s.layoutId,x:q.x,y:q.y},wall=!visible(prev,cur),mine=(s.mines||[]).find(m=>m.hp>0&&distance(q,m)<24),direct=liveEnemies(s).find(e=>!(e.bossKind==='anchor'&&anchorShielded(s,e))&&distance(q,e)<(e.boss?36:24));
  if(wall||mine||direct||Math.hypot(q.x-q.startX,q.y-q.startY)>=q.range){q.done=true;const cx=wall?prev.x:q.x,cy=wall?prev.y:q.y;
   if(q.isOrb){armCapsulesNear(s,{x:cx,y:cy},q.radius);for(const m of s.mines||[])if(m.hp>0&&Math.hypot(m.x-cx,m.y-cy)<=q.radius){m.hp=0;campaignEvent(s,'mineDisarmed',{x:m.x,y:m.y});}
    let hitCount=0;for(const e of liveEnemies(s))if(Math.hypot(e.x-cx,e.y-cy)<=q.radius&&visible({layoutId:s.layoutId,x:cx,y:cy},e)){hitEnemy(s,e,q.damage,q.special?'magic':'gun');hitCount++;if(q.stun&&e.hp>0&&!e.boss){e.state='stun';e.stun=Math.max(e.stun||0,q.stun+(s.hero==='lulu'?(c.resonanceBonus||0):0));e.clock=0;}}
    if(q.shift&&hitCount>0)s.shift=Math.max(s.shift||0,q.shift);if(q.heal&&hitCount>0)s.hp=Math.min(s.maxHp,s.hp+q.heal);
    campaignEvent(s,'orbBurst',{x:cx,y:cy,r:q.radius,color:q.color,weapon:q.weapon,moveId:q.moveId});}
   else{if(mine){mine.hp=0;campaignEvent(s,'mineDisarmed',{x:mine.x,y:mine.y});}if(direct)hitEnemy(s,direct,q.damage,'gun');campaignEvent(s,'shotBlocked',{x:cx,y:cy-20});}}}
 s.heroShots=s.heroShots.filter(q=>!q.done);
 // Enemy projectiles: walls and Lulú's harmonic shield charges stop them; a dash through one is a Perfect Dodge.
 for(const b of s.shots){if(b.life<=0)continue;const prev={layoutId:s.layoutId,x:b.x,y:b.y+34};b.x+=b.vx*edt;b.y+=b.vy*edt;b.life-=edt;const at={x:b.x,y:b.y+34};
  if(!visible(prev,at)||(s.sonicAura>0&&s.sonicShield>0&&Math.hypot(at.x-s.x,at.y-s.y)<68)){if(visible(prev,at))s.sonicShield--;b.life=0;campaignEvent(s,'shotBlocked',{x:b.x,y:b.y});continue;}
  if(Math.hypot(at.x-s.x,at.y-s.y)<24){b.life=0;resolveThreat(s,'shot');}}
 s.shots=s.shots.filter(b=>b.life>0);
 if(s.enemies.some(e=>e.bossKind==='rook'&&e.hp<=0)){s.mines=[];s.rookDark=false;}
 tickCapsules(s,edt);
 for(const m of s.mines){m.age+=edt;m.life-=edt;if(m.hp<=0)continue;
  if(m.age>=.9&&(distance(s,m)<m.r||m.life<=0)){if(distance(s,m)<m.r&&visible(s,{...m,layoutId:s.layoutId}))resolveThreat(s,'mine');m.hp=0;campaignEvent(s,'mineBurst',{x:m.x,y:m.y,r:m.r});}}
 s.mines=s.mines.filter(m=>m.hp>0&&m.life>0);

 if(c.mode==='stealth'&&!s.alarm){let seen=false;for(const e of s.enemies){if(e.hp<=0||e.state!=='patrol')continue;if(patrolSees(s,e)){seen=true;e.seen=clamp(e.seen+edt*(1.9-distance(s,e)/(c.vision||260))*(s.channel?1.6:1),0,1);s.alert=Math.max(s.alert,e.seen);if(e.seen>=1)raiseAlarm(s);}else e.seen=Math.max(0,e.seen-edt*.4);}if(!seen)s.alert=Math.max(0,s.alert-edt*.35);}
 if(c.mode==='stealth'&&s.alarm){const seen=s.enemies.some(e=>e.hp>0&&patrolSees(s,e));s.hide=seen?0:(s.hide||0)+edt;if(!seen&&s.hide>3.2){s.alarm=false;s.alert=0;s.hide=0;for(const e of s.enemies)if(e.hp>0&&e.role==='patrol'){e.state='patrol';e.seen=0;}campaignEvent(s,'alarmDrop');}}
 if(s.escort&&s.escort.hp>0){const g=s.escort,n=s.nodes[g.at];if(!n)g.at=s.nodes.length;else if(distance(s,n)<100&&distance(g,n)<140){if(!n.on)activateNode(s,n);g.at++;}else if(distance(s,g)>62){const gg=clearWalk(g,s)?s:routeWaypoint(getLayout(s.layoutId),g,s),u=unit({x:gg.x-g.x,y:gg.y-g.y});moveActor(g,u.x*120*dt,u.y*120*dt);}}
 for(const e of s.enemies){e.hurtAnim=Math.max(0,(e.hurtAnim||0)-edt);e.deathAnim=Math.max(0,(e.deathAnim||0)-edt);e.phaseFlash=Math.max(0,(e.phaseFlash||0)-edt);e.guard=Math.max(0,(e.guard||0)-edt);e.weakExposed=Math.max(0,(e.weakExposed||0)-edt);if(e.hp<=0||e.state==='dormant')continue;e.clock+=edt;const d=distance(s,e);
 if(e.role==='runner'){const n=s.nodes[e.runnerAt];if(!n){e.hp=0;continue;}if(d<76){if(!n.on)activateNode(s,n);e.runnerAt++;e.wait=0;const nxt=s.nodes[e.runnerAt];if(nxt){const spot=nearestFloor(getLayout(s.layoutId),nxt);e.x=spot.x;e.y=spot.y;}else e.hp=0;continue;}const rg=clearWalk(e,{...n,layoutId:s.layoutId})?n:routeWaypoint(getLayout(s.layoutId),e,n),u=unit({x:rg.x-e.x,y:rg.y-e.y});moveActor(e,u.x*e.moveSpeed*edt,u.y*e.moveSpeed*edt);e.face=u.x<0?-1:1;if(distance(e,n)<42){e.wait=(e.wait||0)+edt;if(e.wait>8){s.status='failed';campaignEvent(s,'chaseLost');}}continue;}
  if(e.role==='moor'){e.state='moor';continue;}
  if(e.state==='stun'){e.stun-=edt;if(e.stun<=0){e.state=c.mode==='stealth'&&!s.alarm?'patrol':'walk';e.clock=0;e.seen=0;}continue;}
  if(e.state==='patrol'){const path=e.path||[{x:e.x,y:e.y}],to=path[e.pathIndex%path.length],u=unit({x:to.x-e.x,y:to.y-e.y});if(distance(e,to)<8)e.pathIndex++;else{const q={x:e.x,y:e.y};moveActor(e,u.x*e.moveSpeed*edt,u.y*e.moveSpeed*edt,s.barriers);e.walk+=distance(e,q)*.06;e.dir=u;e.face=u.x<0?-1:1;}continue;}
  if(e.boss&&bossThink(s,e,edt,d))continue;
  if(e.state==='walk'){
   const aware=d<e.detectRange&&visible(e,s)||e.hp<e.max||s.alarm||e.boss||e.hunting;if(aware)e.hunting=true;
   if(aware&&d<e.reach&&visible(e,s)&&e.clock>.35&&!e.boss){e.state='warn';e.clock=0;e.target={x:s.x,y:s.y};if(s.x!==e.x)e.face=s.x<e.x?-1:1;}
   else if(aware||d<760){
    // Approach from a personal angle so groups surround instead of stacking.
    const ang=Math.atan2(e.y-s.y,e.x-s.x)+((e.id%3)-1)*.5,goal=e.ranged?{x:s.x+Math.cos(ang)*240,y:s.y+Math.sin(ang)*240}:{x:s.x+Math.cos(ang)*e.reach*.6,y:s.y+Math.sin(ang)*e.reach*.6};
    const target=visible(e,{...goal,layoutId:s.layoutId})?goal:routeWaypoint(getLayout(s.layoutId),e,s);const u=unit({x:target.x-e.x,y:target.y-e.y}),q={x:e.x,y:e.y},go=distance(e,goal)>12?1:0;moveActor(e,u.x*e.moveSpeed*edt*go,u.y*e.moveSpeed*edt*go,s.barriers);e.walk+=distance(e,q)*.06;e.face=s.x<e.x?-1:1;}}
  else if(e.state==='warn'){
   // Telegraphs track the hero for the first half, then lock: dodging is about timing, not distance.
   if(e.clock<e.windup*.55&&!e.ranged)e.target={x:s.x,y:s.y};
   if(e.ranged&&e.clock<e.windup*.6)e.target={x:s.x,y:s.y};if(e.target&&e.target.x!==e.x)e.face=e.target.x<e.x?-1:1;lockCue(s,e,e.windup*(e.ranged?.6:.55),edt,e.ranged?'ranged':'melee');
   if(e.clock>e.windup){
    if(e.ranged){fireShot(s,e,e.target);campaignEvent(s,'enemyShot',{id:e.id,x:e.x,y:e.y,to:{x:e.target.x,y:e.target.y}});}
    else{const r=e.attackRadius;if(distance(s,e.target)<r&&visible(e,s))resolveThreat(s,'melee');campaignEvent(s,'enemyAttack',{id:e.id,x:e.target.x,y:e.target.y,r,bossKind:e.bossKind});}
    e.state='recover';e.clock=0;}}
  else if(e.state==='charge'){
   if(e.clock<e.windup){e.dir=unit({x:e.target.x-e.x,y:e.target.y-e.y});if(e.dir.x)e.face=e.dir.x<0?-1:1;}
   else{const q={x:e.x,y:e.y};moveActor(e,e.dir.x*720*edt,e.dir.y*720*edt);e.face=e.dir.x<0?-1:1;if(distance(s,e)<58&&!e.hitThisCharge){e.hitThisCharge=true;resolveThreat(s,'charge');}
    if(e.clock>e.windup+.55||distance(q,e)<1){e.state='recover';e.clock=0;e.hitThisCharge=false;campaignEvent(s,'chargeEnd',{x:e.x,y:e.y});}}}
  else if(e.state==='volley'){if(e.target&&e.target.x!==e.x)e.face=e.target.x<e.x?-1:1;if(e.clock>e.windup){const n=e.phase===2?7:5;for(let i=0;i<n;i++)fireShot(s,e.emitter?{...e.emitter,boss:true}:e,e.target,380,(i-(n-1)/2)*.17);campaignEvent(s,'enemyShot',{id:e.id,x:e.x,y:e.y,volley:true});e.state='recover';e.clock=0;}}
  else if(e.state==='recover'&&e.clock>e.recovery){e.state='walk';e.clock=0;}}
 if(s.chests?.length)for(const ch of s.chests)if(!ch.open&&(distance(s,ch)<64||(input.interact&&distance(s,ch)<104))){ch.open=true;s.hp=Math.min(s.maxHp,s.hp+3);s.duo=clamp(s.duo+25,0,100);s.bountyCoins+=15;s.bountyScrap+=12;if(s.arsenal){const aid=s.arsenal.active;s.arsenal.ammo[aid]=maxMagV11(s.arsenal,aid);s.arsenal.reloadRemaining=0;}campaignEvent(s,'chestOpened',{id:ch.id,x:ch.x,y:ch.y,kind:ch.kind});}
 if(s.comboTimer>0){s.comboTimer=Math.max(0,s.comboTimer-dt);if(s.comboTimer===0)s.combo=0;}
 if(s.drops?.length){for(const d of s.drops){d.life-=dt;const dist=distance(s,d);if(dist<115&&dist>1){const u=unit({x:s.x-d.x,y:s.y-d.y});d.x+=u.x*260*dt;d.y+=u.y*260*dt;}if(distance(s,d)<34){d.life=0;if(d.kind==='vital')s.hp=Math.min(s.maxHp,s.hp+1);else{s.duo=clamp(s.duo+6,0,100);if(s.arsenal){const aid=s.arsenal.active;s.arsenal.ammo[aid]=Math.min(maxMagV11(s.arsenal,aid),s.arsenal.ammo[aid]+2);}}campaignEvent(s,'dropPickup',{kind:d.kind,x:d.x,y:d.y});}}s.drops=s.drops.filter(d=>d.life>0);}
 if(input.interact&&!s.channel)startChannel(s);
 // Defend: hold the zone while it is not contested; waves arrive on a clock. D44: once the wave is cleared the zone charges ×1.25.
 if(c.mode==='defend'||c.mode==='chalk'&&s.nodes.every(n=>n.on)){const z=c.zone,inside=distance(s,z)<z.r,contested=liveEnemies(s).some(e=>distance(e,z)<z.r);if(inside&&!contested)s.progress=Math.min(1,s.progress+dt*(liveEnemies(s).length?1:1.25)/c.hold);
  s.waveClock+=dt;if(s.waveClock>(c.waveEvery||14)&&s.wave<(c.waves?.length||0)-1){s.waveClock=0;spawnWave(s,s.wave+1);}}
 if(s.hp<=0){s.status='failed';s.action=null;s.channel=null;campaignEvent(s,'failed');return;}
 const enemiesDown=s.enemies.every(e=>e.hp<=0)&&s.wave>=(c.waves?.length||1)-1;
 let done;
 if(c.mode==='stealth')done=s.nodes.every(n=>n.on);
 else if(c.mode==='defend')done=s.progress>=1;
 else if(c.mode==='chalk')done=s.nodes.every(n=>n.on)&&s.progress>=1;
 else if(c.mode==='duel')done=s.enemies.filter(e=>e.boss).every(e=>e.hp<=0);
 else if(c.mode==='chase')done=s.nodes.every(n=>n.on)&&s.enemies.every(e=>e.role!=='runner'||e.hp<=0);
 else if(c.mode==='escort')done=s.nodes.every(n=>n.on)&&s.escort?.hp>0&&(c.boss?s.enemies.filter(e=>e.boss).every(e=>e.hp<=0):enemiesDown);
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
 if(choice==='workshop')return {title:'Officina accesa',benefit:'Il meccanico rinforza la Vortex: +1 integrità nella fuga.',cost:'Il rifugio resta al buio. Lulú consegna le lampade di emergenza.',returnText:'Il ponte dell’officina è in funzione. La Vortex porta il nuovo rinforzo; al rifugio restano accese soltanto le lampade.',color:'#ffb65c'};
 if(choice==='shelter')return {title:'Rifugio acceso',benefit:'Mira indica una strada secondaria: meno ostacoli nella fuga.',cost:'L’officina resta chiusa: la Vortex parte senza rinforzo.',returnText:'Le finestre del rifugio sono illuminate. Mira vi saluta dalla porta; il ponte dell’officina resta fermo.',color:'#7dffd0'};
 return null;
}

// Preview shares weapon range/spread and the actual wall trace; it never consumes ammo.
export function attackPreview(s,kind='gun',manual=null){
 const w=kind==='gun'&&s.arsenal?WEAPONS_V9[s.arsenal.active]:null;
 const range=kind==='magic'?(moveDefV11(s.activeMove)?.range||(s.hero==='lulu'?240:420)):w?.range||GUN_RANGE;
 // R28 (D72): the line starts at the barrel and ends on the foe the shot will take, which the renderer rings.
 const picked=manual&&pickAlong(s,unit(manual),range,kind),dir=picked?onto(s,unit(manual),picked):manual?unit(manual):aimAt(s,null,range,kind),half=w?(w.pellets-1)*w.spread/2:0;
 const offsets=half?[-half,0,half]:[0],t=picked||(!manual&&liveEnemies(s).find(e=>e.id===s.lock)),m=kind==='gun'?muzzleV9(s.hero,s.arsenal?.active,dir):{x:0,y:-48};
 return {range,origin:{x:s.x+m.x,y:s.y+m.y},target:t?{id:t.id,x:t.x,y:t.y-foeBodyV9(t).h/2,r:foeBodyV9(t).w/2+8}:null,rays:offsets.map(offset=>{const a=Math.atan2(dir.y,dir.x)+offset;return trace(s,{x:Math.cos(a),y:Math.sin(a)},range);})};
}
