// Campaign rules: independent of DOM, renderer and Android wrapper.
export const SIZE=1536;
export const CHAPTERS=[
 {id:'blackout',name:'01 · Blackout',district:'Cantiere Est',threat:'Gang dei Relè',goal:'Ripristina 3 relè. Libera il quartiere dalla gang.',kind:0,color:'#ffb65c',hp:4,speed:66,count:4,weapon:'Pistola di servizio',damage:1,cooldown:.40,magic:false,brief:['La gang ha spento il quartiere. Tre relè tengono chiuse le uscite.','Li riattiviamo. Nessuno resta qui dentro.'],end:'Le luci tornano. Nei relè troviamo un segnale che non proviene dalla città.'},
 {id:'breach',name:'02 · La breccia',district:'Porto delle Antenne',threat:'Predatori alieni',goal:'Chiudi 3 ancore aliene e ferma i predatori.',kind:1,color:'#58d9ff',hp:7,speed:85,count:5,weapon:'Pistola a impulsi',damage:2,cooldown:.36,magic:true,brief:['Quel segnale ha aperto qualcosa sopra il porto.','Le ancore alimentano la breccia. Prima loro, poi le creature.'],end:'La breccia cede. Le vostre armi assorbono l’energia, ma una spora raggiunge il distretto sud.'},
 {id:'contagion',name:'03 · Ultima corsia',district:'Distretto Clinico',threat:'Infetti',goal:'Attiva 3 filtri e apri la via di evacuazione.',kind:2,color:'#b8f27c',hp:9,speed:49,count:7,weapon:'Carabina a scarica',damage:3,cooldown:.32,magic:true,brief:['Gli infetti seguono il rumore. I filtri possono contenere le spore.','Niente corse alla cieca. Restiamo insieme e apriamo il corridoio.'],end:'Il corridoio è sicuro. Sotto l’asfalto si accende il cuore della frattura.'},
 {id:'zero',name:'04 · Ora zero',district:'Nodo Centrale',threat:'Custodi della frattura',goal:'Disattiva 3 nuclei. Abbatti il Custode e salva la città.',kind:3,color:'#d395ff',hp:14,speed:57,count:5,weapon:'Risonatore',damage:4,cooldown:.30,magic:true,brief:['Tutto converge qui: blackout, invasione, contagio.','Allora finisce qui. Tu tieni la linea. Io chiudo la frattura.'],end:'La città respira ancora. Non siete diventati invincibili: avete imparato a proteggervi.'}
];
export const WALLS=[{x:0,y:0,w:530,h:520},{x:1005,y:0,w:531,h:520},{x:0,y:940,w:530,h:596},{x:1005,y:940,w:531,h:596}];
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const unit=(v)=>{const d=Math.hypot(v.x,v.y);return d>.0001?{x:v.x/d,y:v.y/d}:{x:1,y:0};};
export function visible(a,b){for(const w of WALLS){let lo=0,hi=1;for(const [o,d,m,M] of [[a.x,b.x-a.x,w.x,w.x+w.w],[a.y,b.y-a.y,w.y,w.y+w.h]]){if(Math.abs(d)<1e-8){if(o<m||o>M){lo=2;break;}}else{const t=(m-o)/d,u=(M-o)/d;lo=Math.max(lo,Math.min(t,u));hi=Math.min(hi,Math.max(t,u));}}if(lo<=hi&&hi>=0&&lo<=1)return false;}return true;}
export function moveActor(a,dx,dy){const blocked=(x,y)=>WALLS.some(w=>x+16>w.x&&x-16<w.x+w.w&&y+10>w.y&&y-10<w.y+w.h);const x=clamp(a.x+dx,30,SIZE-30),y=clamp(a.y+dy,30,SIZE-30);if(!blocked(x,a.y))a.x=x;if(!blocked(a.x,y))a.y=y;}
export function newRun(hero='nox',level=0,upgrade='power'){
 level=clamp(Math.floor(level),0,3);const c=CHAPTERS[level];
 return {version:4,hero:hero==='lulu'?'lulu':'nox',level,upgrade,x:768,y:1130,partner:{x:714,y:1170,walk:0},hp:upgrade==='shield'?10:8,maxHp:upgrade==='shield'?10:8,time:0,walk:0,face:{x:0,y:-1},aim:{x:0,y:-1},lock:null,action:null,fireCd:0,magicCd:0,dashCd:0,dash:0,inv:0,duo:0,kills:0,status:'playing',events:[],fx:[],nodes:[{x:220,y:710,on:false},{x:770,y:200,on:false},{x:1300,y:710,on:false}],enemies:Array.from({length:c.count},(_,i)=>({id:i,x:[400,1100,770,1350,650,880,200][i],y:[700,700,420,770,600,620,800][i],hp:c.hp,max:c.hp,clock:i*.3,state:'walk',walk:0,face:1,boss:level===3&&i===4})).map(e=>e.boss?{...e,hp:32,max:32}:e)};
}
export function saveRun(s){return JSON.stringify({version:4,hero:s.hero,level:s.level,upgrade:s.upgrade,status:s.status});}
export function loadRun(raw){try{const x=JSON.parse(raw);if(x.version!==4||!['nox','lulu'].includes(x.hero)||!Number.isInteger(x.level)||x.level<0||x.level>3||!['power','shield'].includes(x.upgrade))return null;const s=newRun(x.hero,x.level,x.upgrade);if(x.status==='cleared'){s.status='cleared';s.enemies=[];s.nodes.forEach(n=>n.on=true);}return s;}catch{return null;}}
export function nextDistrict(s,upgrade){if(s.status!=='cleared'||s.level===3||!['power','shield'].includes(upgrade))return null;return newRun(s.hero,s.level+1,upgrade);}
function event(s,type,data={}){s.events.push({type,...data});}
export function aimAt(s,manual,range=370){if(manual)return unit(manual);const list=s.enemies.filter(e=>e.hp>0&&distance(s,e)<=range&&visible(s,e)).sort((a,b)=>distance(s,a)-distance(s,b));const old=list.find(e=>e.id===s.lock),e=old&&distance(s,old)<=distance(s,list[0])*1.25?old:list[0];s.lock=e?.id??null;return e?unit({x:e.x-s.x,y:e.y-s.y}):s.aim;}
export function trace(s,dir,range){let end=range;for(let n=4;n<=range;n+=4)if(!visible(s,{x:s.x+dir.x*n,y:s.y+dir.y*n})){end=n-4;break;}return {x:s.x+dir.x*end,y:s.y+dir.y*end};}
export function startAttack(s,kind='gun',manual=null){if(s.status!=='playing'||s.action)return false;const c=CHAPTERS[s.level];if(kind==='magic'&&(!c.magic||s.magicCd>0)||kind==='gun'&&s.fireCd>0)return false;
 const dir=aimAt(s,manual,kind==='magic'?460:370);s.aim=dir;s.action={kind,t:0,duration:kind==='gun'?Math.min(c.cooldown,.34):.65,dir,fired:false};if(kind==='gun')s.fireCd=c.cooldown;else s.magicCd=s.upgrade==='power'?3.5:4.5;return true;}
function hit(s,e,n){if(e.hp<=0)return;e.hp=Math.max(0,e.hp-n);s.duo=clamp(s.duo+9,0,100);event(s,'impact',{x:e.x,y:e.y,amount:n});if(e.hp===0){s.kills++;event(s,'down',{x:e.x,y:e.y});}}
function release(s){const a=s.action,c=CHAPTERS[s.level],magic=a.kind==='magic',area=magic&&s.hero==='lulu',range=magic?(area?240:460):370;const end=trace(s,a.dir,range);
 const hitList=s.enemies.filter(e=>{const dx=e.x-s.x,dy=e.y-s.y,d=Math.hypot(dx,dy),along=dx*a.dir.x+dy*a.dir.y,side=Math.abs(dx*a.dir.y-dy*a.dir.x);return e.hp>0&&d<=range&&visible(s,e)&&along>=0&&(area?along/Math.max(1,d)>.3:side<(e.boss?34:22)+(magic?14:3));}).sort((x,y)=>distance(s,x)-distance(s,y));
 const n=magic?c.damage*3+2:c.damage;for(const e of area?hitList:hitList.slice(0,1))hit(s,e,n);
 const impact=!area&&hitList[0]?hitList[0]:end;event(s,magic?'magic':'shot',{x:s.x,y:s.y,dir:a.dir,to:{x:impact.x,y:impact.y},area});
}
export function interactNode(s){if(s.status!=='playing')return false;const n=s.nodes.find(n=>!n.on&&distance(s,n)<85);if(!n)return false;if(s.enemies.some(e=>e.hp>0&&distance(e,n)<145)){event(s,'blocked');return false;}n.on=true;s.hp=Math.min(s.maxHp,s.hp+2);event(s,'node',{x:n.x,y:n.y});return true;}
export function tick(s,input,dt){dt=clamp(dt,0,.05);s.events=[];if(s.status!=='playing')return;s.time+=dt;for(const k of ['fireCd','magicCd','dashCd','dash','inv'])s[k]=Math.max(0,s[k]-dt);
 const raw={x:input.x||0,y:input.y||0},mag=Math.hypot(raw.x,raw.y),v=mag>1?unit(raw):raw;
 if(mag>.08)s.face=unit(v);if(input.aim)s.aim=unit(input.aim);
 if(input.dash&&s.dashCd===0){s.dash=.18;s.dashCd=1.1;s.inv=.3;event(s,'dash');}
 const before={x:s.x,y:s.y};moveActor(s,(s.dash?s.face.x:v.x)*(s.dash?660:205)*dt,(s.dash?s.face.y:v.y)*(s.dash?660:205)*dt);const moved=distance(s,before);s.walk+=moved*.065;
 const p=s.partner,pd=distance(s,p);if(pd>55){const u=unit({x:s.x-p.x,y:s.y-p.y});const q={x:p.x,y:p.y};moveActor(p,u.x*Math.min(240,(pd-45)*5)*dt,u.y*Math.min(240,(pd-45)*5)*dt);p.walk+=distance(p,q)*.065;}
 if(input.gun)startAttack(s,'gun',input.aim);if(input.magic)startAttack(s,'magic',input.aim);
 if(s.action){s.action.t+=dt;if(!s.action.fired&&s.action.t>=(s.action.kind==='gun'?.09:.27)){s.action.fired=true;release(s);}if(s.action.t>=s.action.duration)s.action=null;}
 if(input.duo&&s.duo>=100){s.duo=0;s.hp=Math.min(s.maxHp,s.hp+2);s.inv=1;for(const e of s.enemies)if(e.hp>0&&distance(s,e)<300){hit(s,e,CHAPTERS[s.level].damage*2);e.state='recover';e.clock=-.5;}event(s,'duo',{x:s.x,y:s.y});}
 for(const e of s.enemies){if(e.hp<=0)continue;e.clock+=dt;const d=distance(s,e);if(e.state==='walk'){
 if(d<(s.level===0?230:100)&&visible(e,s)){e.state='warn';e.clock=0;e.target={x:s.x,y:s.y};}
 else if(d<760){const u=unit({x:s.x-e.x,y:s.y-e.y});const q={x:e.x,y:e.y};moveActor(e,u.x*CHAPTERS[s.level].speed*dt,u.y*CHAPTERS[s.level].speed*dt);e.walk+=distance(e,q)*.06;e.face=u.x<0?-1:1;}}
 else if(e.state==='warn'&&e.clock>(e.boss?1.4:1.0)){const r=e.boss?120:65;if(s.inv===0&&distance(s,e.target)<r&&visible(e,s)){s.hp--;s.inv=.7;event(s,'hurt');}event(s,'enemyAttack',{x:e.target.x,y:e.target.y,r});e.state='recover';e.clock=0;}
 else if(e.state==='recover'&&e.clock>.9){e.state='walk';e.clock=0;}}
 if(input.interact)interactNode(s);
 if(s.hp<=0){s.status='failed';s.action=null;event(s,'failed');}
 else if(s.enemies.every(e=>e.hp<=0)&&s.nodes.every(n=>n.on)){s.status='cleared';s.action=null;event(s,'cleared');}
}
