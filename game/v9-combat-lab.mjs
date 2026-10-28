import {newRun,tick,WALLS} from './campaign.mjs';
import {WEAPONS_V9,saveArsenalV9,loadArsenalV9} from './weapons-v9.mjs';
import {heroFrame,enemyFrame} from './visuals.mjs';
import {drawLegacySprite} from './chrono-art.mjs';
const el=id=>document.getElementById(id),canvas=el('arena'),ctx=canvas.getContext('2d');
const copy={it:{title:'Arena combat V9',intro:'Prova di sviluppo: cinque armi funzionanti, equipaggiamenti sbloccati per l’allenamento. Non modifica i salvataggi della storia.',fire:'Spara',dash:'Schiva',reload:'Ricarica',switch:'Cambia arma',activate:'Attiva',pause:'Pausa',resume:'Riprendi',restart:'Nuova prova',keys:'WASD / frecce: movimento · Spazio: spara · Shift: schiva · R: ricarica · Q: cambia · E: attiva · P: pausa',aim:'Mira automatica sul bersaglio visibile più vicino.',save:'Salva equipaggiamento',load:'Ripristina',storage:'Salvataggio separato dell’arena: arma, munizioni e tempi di ricarica. Il campo riparte quando ripristini.',back:'Torna alla campagna attuale',health:'Vita',targets:'Bersagli',ready:'Pronta',reloading:'Ricarica',cleared:'Prova completata',failed:'Riprova: nuova prova',saved:'Equipaggiamento salvato.',restored:'Equipaggiamento ripristinato.',unavailable:'Salvataggio non disponibile.',badSave:'Nessun equipaggiamento valido da ripristinare.',c9:'Versatile, preciso. Un bersaglio per colpo.',vx9:'Raffica di tre colpi. Mantieni la linea di tiro.',r12:'Cinque proiettili a ventaglio. Efficace da vicino.',h17:'Lungo raggio. Perfora due bersagli allineati.',arc7:'Concatena fino a tre bersagli vicini e li stordisce.'},en:{title:'Combat V9 arena',intro:'Development preview: five working weapons, kits unlocked for training. Story saves are untouched.',fire:'Fire',dash:'Dodge',reload:'Reload',switch:'Switch weapon',activate:'Activate',pause:'Pause',resume:'Resume',restart:'New trial',keys:'WASD / arrows: move · Space: fire · Shift: dodge · R: reload · Q: switch · E: activate · P: pause',aim:'Automatically aims at the nearest visible target.',save:'Save loadout',load:'Restore',storage:'Separate arena save: weapon, ammunition and reload timers. Restoring starts a fresh field.',back:'Back to the current campaign',health:'Health',targets:'Targets',ready:'Ready',reloading:'Reloading',cleared:'Trial complete',failed:'Defeated: start a new trial',saved:'Loadout saved.',restored:'Loadout restored.',unavailable:'Storage unavailable.',badSave:'No valid loadout to restore.',c9:'Versatile and precise. One target per shot.',vx9:'Three-shot burst. Hold the line of fire.',r12:'Five-pellet spread. Effective at close range.',h17:'Long range. Pierces two aligned targets.',arc7:'Chains through up to three nearby targets and stuns them.'}};
let lang='it',state,paused=false,last=0,frames=[],nextInput={},images={},loaded=false;
const held=new Set(),pointers=new Map(),storageKey='chronos-v9-training-arsenal-v1';
const message=id=>el('notice').textContent=copy[lang][id];
function reset(hero='nox',arsenal=null){
 state=newRun(hero,0,'power',null,null,{id:'v9_training',hp:24,speed:50,damage:5,cooldown:.4,magic:false,partner:false,combatV9:true,weaponRewards:['tessa','anchor_component','vega_component','eden_technology'],start:{x:768,y:1130},nodes:[{x:250,y:720},{x:768,y:220},{x:1270,y:720}],waves:[['raider','raider','raider'],['breaker','shooter','raider'],['brute','shooter','signal']]});
 if(arsenal)state.arsenal=arsenal;paused=false;held.clear();pointers.clear();frames=[];nextInput={};
 el('nox').setAttribute('aria-pressed',String(hero==='nox'));el('lulu').setAttribute('aria-pressed',String(hero==='lulu'));
 el('weapons').replaceChildren(...Object.keys(state.arsenal.ammo).map(id=>{const b=document.createElement('button');b.textContent=WEAPONS_V9[id].name;b.dataset.weapon=id;b.onclick=()=>nextInput.switchWeapon=id;return b;}));refresh();
}
function refresh(){
 document.documentElement.lang=lang;document.querySelectorAll('[data-copy]').forEach(e=>e.textContent=copy[lang][e.dataset.copy]);el('pause').textContent=copy[lang][paused?'resume':'pause'];
 el('description').textContent=copy[lang][state.arsenal.active];
}
function pause(){paused=!paused;held.clear();pointers.clear();nextInput={};refresh();}
function circle(x,y,r,color,outline=false){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx[outline?'strokeStyle':'fillStyle']=color;ctx.lineWidth=5;ctx[outline?'stroke':'fill']();}
function sprite(frame,x,y,size){drawLegacySprite(ctx,images[frame.atlas],frame.row,frame.col,x,y,size*(frame.scale||1),frame.flip);}
function render(){
 ctx.fillStyle='#142335';ctx.fillRect(0,0,1536,1536);ctx.strokeStyle='#203247';ctx.lineWidth=1;
 for(let x=0;x<1536;x+=64){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,1536);ctx.moveTo(0,x);ctx.lineTo(1536,x);ctx.stroke();}
 for(const w of WALLS){ctx.fillStyle='#0b1423';ctx.fillRect(w.x,w.y,w.w,w.h);ctx.strokeStyle='#38506a';ctx.strokeRect(w.x,w.y,w.w,w.h);}
 for(const n of state.nodes){circle(n.x,n.y,36,n.on?'#62d8ac':'#dec36e',true);ctx.fillStyle='#eaf3ff';ctx.font='24px system-ui';ctx.textAlign='center';ctx.fillText(n.on?'✓':'E',n.x,n.y+8);}
 for(const e of state.enemies){if(e.hp<=0&&e.deathAnim<=0)continue;if(e.state==='warn'&&e.target)circle(e.target.x,e.target.y,e.attackRadius,'#ffb75b',true);sprite(enemyFrame(e,0),e.x,e.y,120);if(e.hp>0){ctx.fillStyle='#591c35';ctx.fillRect(e.x-30,e.y-125,60,6);ctx.fillStyle='#fb8f96';ctx.fillRect(e.x-30,e.y-125,60*e.hp/e.max,6);}}
 for(const shot of state.shots)circle(shot.x,shot.y+34,8,'#ffd273');
 for(const shot of frames){ctx.strokeStyle=state.hero==='nox'?'#7df0f4':'#e4a4ff';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(shot.x,shot.y-30);ctx.lineTo(shot.to.x,shot.to.y-30);ctx.stroke();}
 circle(state.x,state.y+5,24,state.hero==='nox'?'#7df0f4':'#e4a4ff',true);sprite(heroFrame(state,state,state.hero),state.x,state.y,130);
 if(paused||state.status!=='playing'){ctx.fillStyle='#080e1bc9';ctx.fillRect(0,600,1536,250);ctx.fillStyle='#eaf3ff';ctx.font='52px system-ui';ctx.textAlign='center';ctx.fillText(copy[lang][paused?'pause':state.status==='cleared'?'cleared':'failed'],768,740);}
 const a=state.arsenal,w=WEAPONS_V9[a.active];el('readout').textContent=`${copy[lang].health} ${state.hp}/${state.maxHp} · ${copy[lang].targets} ${state.kills}\n${w.name} ${a.ammo[a.active]}/${w.magazine} · ${a.reloadRemaining>0?copy[lang].reloading+' '+a.reloadRemaining.toFixed(1)+'s':copy[lang].ready}`;
 el('description').textContent=copy[lang][a.active];for(const b of el('weapons').children)b.setAttribute('aria-pressed',String(b.dataset.weapon===a.active));
}
function loop(now){const dt=Math.min(.05,(now-last)/1000||0);last=now;if(loaded&&!paused){
 const active=name=>held.has(name)||[...pointers.values()].includes(name);
 tick(state,{x:Number(active('right'))-Number(active('left')),y:Number(active('down'))-Number(active('up')),gun:active('gun'),dash:active('dash'),interact:active('interact'),...nextInput},dt);nextInput={};
 frames=frames.map(s=>({...s,life:s.life-dt})).filter(s=>s.life>0);for(const e of state.events)if(e.type==='shot')frames.push({...e,life:.1});
 }if(loaded)render();requestAnimationFrame(loop);}
const keyMap={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',Space:'gun',ShiftLeft:'dash',ShiftRight:'dash',KeyE:'interact'};
window.addEventListener('keydown',e=>{if(e.target.matches('select,input,textarea')||(e.code==='Space'&&e.target.matches('button,a')))return;if(keyMap[e.code]){e.preventDefault();held.add(keyMap[e.code]);}if(!e.repeat){if(e.code==='KeyR')nextInput.reload=true;if(e.code==='KeyQ')nextInput.switchWeapon=true;if(e.code==='KeyP')pause();}});
window.addEventListener('keyup',e=>held.delete(keyMap[e.code]));
window.addEventListener('blur',()=>{if(!paused)pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&!paused)pause();});
for(const b of document.querySelectorAll('[data-hold]')){b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);pointers.set(e.pointerId,b.dataset.hold);});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,e=>pointers.delete(e.pointerId));}
el('language').onchange=e=>{lang=e.target.value;refresh();};el('nox').onclick=()=>reset('nox');el('lulu').onclick=()=>reset('lulu');el('restart').onclick=()=>reset(state.hero);el('pause').onclick=pause;el('reload').onclick=()=>nextInput.reload=true;el('switch').onclick=()=>nextInput.switchWeapon=true;
el('save').onclick=()=>{try{localStorage.setItem(storageKey,saveArsenalV9(state.arsenal));message('saved');}catch{message('unavailable');}};
el('load').onclick=()=>{try{const a=loadArsenalV9(localStorage.getItem(storageKey));if(!a){message('badSave');return;}reset(a.hero,a);message('restored');}catch{message('unavailable');}};
reset();
const names=['gang_states',...['nox','lulu'].flatMap(h=>['walk','actions','gun','magic'].map(a=>h+'_'+a))],equipped=['nox_vx9_gun','nox_vx9_reload','lulu_r12_gun','lulu_r12_reload','nox_h17_gun','nox_h17_reload','lulu_arc7_gun','lulu_arc7_reload'];
try{await Promise.all([...names,...equipped].map(name=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{images[name]=im;resolve();};im.onerror=reject;im.src=(equipped.includes(name)?'art/v10/':'art/v05/')+name+'.png';})));loaded=true;}catch{el('notice').textContent='Asset loading failed. Reload the page.';}
window.chronosCombatLab={snapshot:()=>({loaded,paused,hero:state.hero,status:state.status,hp:state.hp,x:state.x,y:state.y,time:state.time,kills:state.kills,arsenal:JSON.parse(saveArsenalV9(state.arsenal))})};requestAnimationFrame(loop);
