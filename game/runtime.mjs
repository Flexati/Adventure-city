import {WEAPONS_V9,deliverFieldKitV9} from './weapons-v9.mjs';
import {translateText,createLocaleView,localeStatus} from './locale.mjs';
import {RACES_V9,newRaceV9,tickRaceV9,raceStandings,raceResultV9,raceCheckpointX,raceVisibility,raceHazardX,raceGateOpen,raceRoadTile,raceRoadArt,RACE_ROAD_TILE,RACE_SCROLL,RACE_LANES,NITRO_COST,RACE_MODES_V9,raceMedal} from './racing-v9.mjs';
import {veyraLineV9} from './veyra-v9.mjs';
import {HUBS,HUB_ITEMS,hubPoints,nextHubRace,hubRaceModes,claimHubRace,availableHubs,acceptHubJob,workHubTarget,finishHubJob,hubCatalog,buyHubItem,equipHubItem,useHubMedicine,preparationNeeded,applyEquipment,rewardMission} from './hubs.mjs';
import {newCollapse,tickCollapse} from './traversal.mjs';
import {drawLegacySprite,ChronoArtBank,chronoAnimation,drawChronoFrame,chronoEnemyPose} from './chrono-art.mjs';
import {interiorFor,interiorAsk,interiorGreeting} from './interiors.mjs';
import {getLayout,nearestFloor,routeWaypoint} from './layouts.mjs';
import {setVitalMeter} from './hud.mjs';
import {GAME_KEYS,isActivationKey,PRESS_ACTIONS,pressQueues,radialControlVector,axialControlValue,movementVector,pickGamepad,readGamepad,padEdges} from './input-v9.mjs';
import {buildMapSurface} from './scenery.mjs';
import {AudioDirector,musicalState} from './audio-engine.mjs';
import {createProgressStore} from './progress-store.mjs';
import {createFaultMonitor,guardedFrame} from './stability.mjs';
import {DRIVING_MISSIONS,LANES,newDrive,driveTick,hazardVisible} from './driving.mjs';
import {heroFrame,enemyFrame,mirrorFrame,frameCamera,frameDuelCamera,framePlayCamera,cameraScale,chalkCivilianPose,chalkFlaskFrame,DISTRICT_ART,DISTRICT_MAPS,BOSS_NAMES,anchorFrame,ANCHOR_SHEET,bollardFrame,BOLLARD_SHEET,veyraCarFrame,VEYRA_CAR,RACE_CAR_ART,RACE_PROPS,RACE_CRANE,RACE_PROP_ART,raceRegion,racePropHit,hitstopFrames,hitstopStep,HITSTOP_FRAME} from './visuals.mjs';
import {ANCHOR_RULES,attackPreview,SIZE,GUN_RANGE,clamp,distance,unit,newRun,aimAt,trace,tick,cityOutcome,resumeAtBoss,moveActor,clearInputBuffer} from './campaign.mjs';
import {applyBeat,V07_BEATS} from './narrative.mjs';
import {CAMPAIGN,FOOT,ACTS,stepPov,buildMission,newProgress,saveProgress,loadProgress,finishCatchup,prepareRookRecovery,finishRookRecovery} from './missions.mjs';
import {storyLine,noxLine,luluLine,systemLine,SPEAKERS,STORY,BARKS,CHOICES,EPILOGUE,REACTIONS,resolveLines,resolveBark,reunionTier} from './story-v08.mjs';
const $=id=>document.getElementById(id),canvas=$('world'),ctx=canvas.getContext('2d',{alpha:false});

// ---------- Assets ----------
const images={},imageJobs={};const chronoArt=new ChronoArtBank();let loaded=false;
const LEGACY_ART=new Set(['city','port','clinic','fracture','car']);
// Astra G3/G5 race candidates accepted for the Ash Docks races (docs/gold/ASTRA_INTEGRAZIONE_20261027.md).
const RACE_CONTAINERS=['race_container','race_container_ruggine','race_container_cobalto','race_container_verde'];
const ASH_ROADS=['banchina','gru','deposito'].flatMap(v=>['day','night'].map(t=>`race_ashdocks_${v}_${t}`));
const RACE_ART=[...Object.values(RACE_CAR_ART),...RACE_PROP_ART,...RACE_CONTAINERS.flatMap(n=>[n,n+'_hit']),'race_cp_active','race_cp_passed','race_cp_pylon','race_cp_pylon_passed','race_cp_tape','race_cp_tape_passed'],RACE_SOUNDS=['race_checkpoint','race_container_hit','race_finish','race_count_beep','race_go'];
// The Anchor's A5 effects (Astra delivery 20261027), decoded only for missions that wake it.
const ANCHOR_SOUNDS=['anchor_moor','anchor_exposed','anchor_relink','anchor_line_tension','anchor_sweep','anchor_line_cut','anchor_weight'];
function artPath(name){if(['nox_vx9_gun','lulu_r12_gun','nox_vx9_reload','lulu_r12_reload','nox_h17_gun','nox_h17_reload','lulu_arc7_gun','lulu_arc7_reload','anchor_core','anchor_bollards','vfx_c9','vfx_vx9','vfx_r12',...Object.values(RACE_CAR_ART),...RACE_PROP_ART,...RACE_CONTAINERS.flatMap(n=>[n,n+'_hit']),'race_cp_active','race_cp_passed','anchor_cable','anchor_cable_end','anchor_sweep','race_cp_pylon','race_cp_pylon_passed','race_cp_tape','race_cp_tape_passed',...ASH_ROADS].includes(name))return `art/v10/${name}.png`;if(name==='tessa')return 'art/v09/tessa.png';if(name==='rook')return 'art/v09/rook.png';if(name==='chalk_flask_states')return 'art/v09/chalk_flask_states.png';if(name==='reunion_art')return 'art/v09/reunion.png';if(name.endsWith('_art'))return `art/v09/${name.slice(0,-4)}.svg`;return LEGACY_ART.has(name)?`art/${name}.png`:name==='portraits'?'art/v08/portraits.png':`art/v05/${name}.png`;}
function loadImage(name){if(imageJobs[name])return imageJobs[name];imageJobs[name]=new Promise((resolve,reject)=>{const im=new Image();images[name]=im;im.onload=()=>resolve(im);im.onerror=()=>{delete imageJobs[name];reject(new Error(name));};im.src=artPath(name);});return imageJobs[name];}
const CORE_ART=['city','car','nox_walk','lulu_walk','nox_actions','lulu_actions','nox_gun','lulu_gun','nox_magic','lulu_magic','fx_atlas','district_props','portraits'];
const imageReady=Promise.all(CORE_ART.map(loadImage));
// Only the active district's map and enemy atlas stay decoded; phones have little texture memory.
async function prepareDistrict(map,kind,extra=[],skipEnemy=false){
 const want=new Set([DISTRICT_MAPS[map],...(!skipEnemy?[DISTRICT_ART[kind]]:[]),...extra]);
 await Promise.all([...want].map(loadImage));
 for(const name of [...DISTRICT_MAPS,...DISTRICT_ART,'driving_cars','driving_road',...ASH_ROADS])if(!want.has(name)&&!CORE_ART.includes(name)&&images[name]){images[name].src='';delete images[name];delete imageJobs[name];delete tints[name];}
}
// Tinted copies are rendered once: EVE-Prime wears Nox's body, Archon wears the Custodi's.
const tints={};
function tinted(source,key,color){if(tints[key])return tints[key];const im=images[source];if(!im?.naturalWidth)return null;const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;c.layoutSrc=im.src;const g=c.getContext('2d');g.drawImage(im,0,0);g.globalCompositeOperation='source-atop';g.fillStyle=color;g.fillRect(0,0,c.width,c.height);tints[key]=c;return c;}
function atlas(name){if(name.startsWith('eve_'))return tinted('nox_'+name.slice(4),name,'#ff2a4a8c');if(name==='archon')return tinted('custodian_states','archon','#ffd9809a');return images[name];}

// ---------- Persistent state ----------
const STORE='city-adventure-progress-v7',LEGACY_STORES=['city-adventure-progress-v6','city-adventure-campaign-v5','city-adventure-districts-v4'];
let progress=null,saved=null,mode='boot',state=null,drive=null,running=false,paused=false,uiLock=0,last=0,acc=0,camera={x:0,y:0,scale:1},fx=[],shake=0,focusTime=0,hitstops=new Map();
let settings={sound:true,haptics:true,language:'it',reduced:matchMedia('(prefers-reduced-motion: reduce)').matches};
try{settings={...settings,...JSON.parse(localStorage.getItem('city-v4-settings')||'{}')};}catch{}
settings.language=settings.language==='en'?'en':'it';document.body.classList.toggle('reduced-motion',settings.reduced);
const localeView=createLocaleView(document,settings.language),tr=value=>translateText(value,settings.language);
const progressStore=createProgressStore({storage:()=>localStorage,key:STORE,serialize:saveProgress,deserialize:loadProgress});
let saveSource='none';
function readSave(){const result=progressStore.read();saveSource=result.source;return result.progress;}
saved=readSave();
function persist(newGame=false){if(!progress)return false;if(mode==='hub'&&state&&progress.world.hub){progress.world.hub.x=state.x;progress.world.hub.y=state.y;}const result=progressStore.write(progress,{newGame});if(result.ok){saved=result.progress;saveSource='primary';return true;}notice('Salvataggio non disponibile: mantieni aperta la partita.');return false;}
function flag(key,value){progress.narrative.flags[key]=value;}
const flags=()=>progress?.narrative.flags||{};
function memo(key){try{return localStorage.getItem(key)==='1';}catch{return false;}}
function remember(key){try{localStorage.setItem(key,'1');}catch{}}

// ---------- Audio ----------
const audioDirector=new AudioDirector();audioDirector.enabled=settings.sound;
let lifecycleMuted=false,musicQuiet=10,musicClock=0,lastStepSound=0;
function soundtrack(cue){audioDirector.setCue(cue);}
function audio(name){const aliases={hit:'shot',zara:'heavy',dodge:'dash',duo:'magic'};audioDirector.sfx(aliases[name]||name);}
function silence(){audioDirector.pause();}
function syncSoundscape(dt){
 audioDirector.update();audioDirector.duck(uiLock>0||barkTimer>0);
 if(paused||lifecycleMuted||!running)return;
 musicClock+=dt;
 if(mode==='foot'&&state){
  const threatened=state.enemies.some(e=>e.hp>0&&e.state!=='dormant'&&(e.boss||e.state==='warn'||e.state==='charge'||distance(state,e)<330));
  musicQuiet=threatened?0:musicQuiet+dt;
  if(musicClock>.5){musicClock=0;const authored=CAMPAIGN[progress.step].music,base=authored==='danger'?state.hero==='lulu'?'lulu':'nox':authored;const cue=musicalState({base,tension:threatened?1:musicQuiet<5?.2:0,quietFor:musicQuiet,joined:state.mission==='finale'&&!!state.partner});soundtrack(state.allies?'strangers_rift':state.enemies.some(e=>e.bossKind==='rook'&&e.hp>0&&e.state!=='dormant')?'rook_line':state.enemies.some(e=>e.bossKind==='anchor'&&e.hp>0&&e.state!=='dormant')?'anchor_fight_loop':cue);}
  if(state.walk-lastStepSound>2.5){lastStepSound=state.walk;audioDirector.sfx('step');}
 }else if(mode==='drive'&&drive)audioDirector.engineSpeed(drive.speed);else if(mode==='race'&&race)audioDirector.engineSpeed(race.s.cars[0].speed);
}

// ---------- Small UI helpers ----------
const textCache={};
function setText(id,value){if(textCache[id]!==value){textCache[id]=value;localeView.write($(id),value);}}
function panel(id,show){$(id).hidden=!show;}
function hideHudValues(){panel('health',false);panel('integrity',false);panel('coins',false);}
function showHealth(s){hideHudValues();panel('health',true);setVitalMeter($('health'),s.hp,s.maxHp,tr((s.hero==='lulu'?'LULÙ':'NOX')+' · VITA'),{immediate:settings.reduced});}
function showIntegrity(s){hideHudValues();panel('integrity',true);setVitalMeter($('integrity'),s.hp,s.maxIntegrity,(s.vehicle==='truck'?'CAMION':'VORTEX')+' · INTEGRITÀ',{lowAt:.34,immediate:settings.reduced});}
function showCoins(value){hideHudValues();panel('coins',true);setText('coins',value+' ◈');$('coins').setAttribute('aria-label',value+' monete');}
// A notice stays readable for at least 1.4 s; a newer one waits instead of erasing it (latest wins).
let noticeAt=-1e9;
function notice(t){const el=$('notice'),wait=noticeAt+1400-performance.now();if(el.classList.contains('on')&&wait>0&&el.textContent!==t){clearTimeout(notice.later);notice.later=setTimeout(()=>notice(t),wait);return;}
 noticeAt=performance.now();localeView.write(el,t);el.classList.add('on');clearTimeout(notice.timer);notice.timer=setTimeout(()=>el.classList.remove('on'),3200);}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function portraitClass(el,speaker){const sp=SPEAKERS[speaker]||SPEAKERS[''];el.className='portrait'+(sp.portrait==null?' none':sp.portrait?' p'+sp.portrait:'');return sp;}
function lock(){uiLock++;clearControls();}
function unlock(){uiLock=Math.max(0,uiLock-1);canvas.focus();}

// Dialogue: one box, portrait + speaker color; resolves after the last line.
function say(lines){lines=(lines||[]).filter(Boolean);if(!lines.length)return Promise.resolve();lock();panel('talk',true);let i=0;
 return new Promise(resolve=>{const show=()=>{const item=lines[i];const sp=portraitClass($('talk').querySelector('.portrait'),item.speaker);$('talk').firstElementChild.style.setProperty('--speaker',sp.color);localeView.write($('speaker'),item.speaker||' ');localeView.write($('line'),item.text);localeView.write($('next-line'),i===lines.length-1?'Continua':'Avanti');};
  const next=e=>{e?.stopPropagation();if(i<lines.length-1){i++;show();return;}$('talk').firstElementChild.onclick=null;$('next-line').onclick=null;panel('talk',false);unlock();resolve();};
  $('talk').firstElementChild.onclick=next;$('next-line').onclick=next;show();$('next-line').focus();});}
// Choices write once into the narrative state; a resumed save never asks twice.
function choose(id){$('choice').dataset.choiceId=id;const def=CHOICES[id],n=progress.narrative;if(n.choices[id])return Promise.resolve(n.choices[id]);lock();panel('choice',true);localeView.write($('choice-title'),def.title);const box=$('choice-options');box.textContent='';
 return new Promise(resolve=>{for(const [key,opt] of Object.entries(def.options)){const b=document.createElement('button');b.innerHTML='<b></b><small></small>';localeView.write(b.querySelector('b'),opt.label);localeView.write(b.querySelector('small'),opt.hint);
  b.onclick=()=>{if(n.choices[id])return;for(const [k,v] of Object.entries(opt.writes||{}))n.flags[k]=v;if(Number.isFinite(opt.thermalDelta))n.thermal=clamp(Math.round(n.thermal+opt.thermalDelta),0,100);n.choices[id]=key;persist();audio('choice');panel('choice',false);unlock();resolve(key);};box.appendChild(b);}
  box.firstChild.focus();});}
let cancelHold=null;
function holdButton({kicker,title,text,label,ms=1200}){lock();panel('hold',true);localeView.write($('hold-kicker'),kicker);localeView.write($('hold-title'),title);localeView.write($('hold-text'),text);localeView.write($('hold-label'),label);const b=$('hold-button'),fill=$('hold-fill');fill.style.width='0';
 return new Promise(resolve=>{let start=null,raf=0;const step=t=>{if(start==null)return;const k=Math.min(1,(t-start)/ms);fill.style.width=(k*100)+'%';if(k>=1){cleanup();panel('hold',false);unlock();audio('choice');resolve();return;}raf=requestAnimationFrame(step);};
  const down=e=>{e.preventDefault();start=performance.now();raf=requestAnimationFrame(step);};const up=()=>{start=null;cancelAnimationFrame(raf);fill.style.width='0';};
  const cleanup=()=>{cancelHold=null;b.onpointerdown=b.onpointerup=b.onpointerleave=b.onpointercancel=b.onkeydown=b.onkeyup=null;};
  b.onpointerdown=down;b.onpointerup=b.onpointerleave=b.onpointercancel=up;b.onkeydown=e=>{if((e.code==='Space'||e.code==='Enter')&&start==null)down(e);};b.onkeyup=up;cancelHold=up;b.focus();});}
function knock(prompt){lock();panel('knock',true);localeView.write($('knock-prompt'),prompt);const count=$('knock-count');count.className='';let n=0;
 return new Promise(resolve=>{$('knock-surface').onclick=()=>{n++;audio('knock');shake=settings.reduced?0:4;count.className=n===1?'one':'two';if(n>=2){$('knock-surface').onclick=null;setTimeout(()=>{panel('knock',false);unlock();resolve();},500);}};$('knock-surface').focus();});}
// The card answers three questions before play: who leads, what to do, and that progress is safe.
function showCard(step,savedOk=true){const pov=stepPov(step),card=$('card');lock();
 const name=step.type==='foot'?FOOT[step.id].name:step.type==='drive'?DRIVING_MISSIONS[step.drive].title:step.title;
 card.className=pov;localeView.write($('card-act'),ACTS[step.act]);localeView.write($('card-title'),name.replace(/^\d+ · /,''));
 const label=pov==='both'?'NOX + LULÙ':pov==='lulu'?'LULÙ':'NOX';localeView.write($('card-pov').querySelector('span'),step.type==='drive'?label+' · ALLA GUIDA':label);
 portraitClass($('card-pov').querySelector('.portrait'),pov==='lulu'?'LULÙ':'NOX');if(pov==='both')$('card-pov').querySelector('.portrait').className='portrait none';
 const goal=step.type==='foot'?buildMission(step.id,flags(),progress.cityChoice).goal:step.type==='drive'?DRIVING_MISSIONS[step.drive].brief:'';localeView.write($('card-goal'),goal);panel('card-goal',!!goal);
 localeView.write($('card-meta'),`Tappa ${CAMPAIGN.indexOf(step)+1}/${CAMPAIGN.length}`+(savedOk?' · ✓ Progressi salvati':''));
 panel('card',true);
 return new Promise(resolve=>{let done=false;const close=()=>{if(done)return;done=true;card.onclick=null;panel('card',false);unlock();resolve();};card.onclick=close;setTimeout(close,goal?4200:2600);});}
// Barks never pause play: a queue of short lines with portraits.
const barkQueue=[];let barkTimer=0,barksSaid=new Set();
function bark(key,once=true){const step=CAMPAIGN[progress?.step];const table=BARKS[step?.id];if(!table)return;const id=step.id+':'+key;if(once&&barksSaid.has(id))return;const line=resolveBark(table[key],flags());if(!line)return;barksSaid.add(id);barkQueue.push(line);audioDirector.sfx('radio');}
function updateBark(dt){if(barkTimer>0){barkTimer-=dt;if(barkTimer<=0)panel('bark',false);}if(barkTimer<=0&&barkQueue.length&&!uiLock){const line=barkQueue.shift(),sp=portraitClass($('bark').querySelector('.portrait'),line.speaker);localeView.write($('bark').querySelector('small'),line.speaker);$('bark').querySelector('small').style.color=sp.color;localeView.write($('bark').querySelector('span'),line.text);panel('bark',true);barkTimer=Math.max(2.6,line.text.length*.055);}}

// ---------- Flow ----------
function hideGameplay(){for(const id of ['hud','controls','driving-controls','bossbar','bark','hint','result','talk','choice','hold','knock','city-choice','city-return','pause-panel','card','hub-panel','hub-tools','bag','supply','heal','field-kit','weapon-controls'])panel(id,false);document.body.classList.remove('boss-active');barkQueue.length=0;barkTimer=0;}
async function newGame(){renderQuality=1.75;qualityWindow.length=0;qualitySlow=0;progress=newProgress();barksSaid=new Set();persist(true);await enterStep(0);}
async function continueGame(){renderQuality=1.75;qualityWindow.length=0;qualitySlow=0;progress=loadProgress(saveProgress(saved));prepareRookRecovery(progress);barksSaid=new Set();if(progress.world.hub){const h=progress.world.hub;await openHub(h.id,h.reason,h.pov,true);}else await enterStep(progress.step,progress.status==='cleared');}
let runId=0;
async function enterStep(i,resumeCleared=false){
 const id=++runId;running=false;paused=false;state=null;drive=null;uiLock=0;hideGameplay();panel('menu',false);panel('ending',false);
 const step=CAMPAIGN[i];progress.step=i;if(!resumeCleared)progress.status='playing';const savedOk=persist();
 if(settings.sound&&!lifecycleMuted)audioDirector.resume();musicQuiet=10;musicClock=0;audioDirector.setAmbience(null);soundtrack(step.music);mode='card';await showCard(step,savedOk);if(id!==runId)return;
 if(step.id==='blackout'&&progress.rookCatchup&&!progress.rookCatchup.introSeen){await say([systemLine(flags()['encounter.rook.completed']?'RECUPERO EQUIPAGGIAMENTO · La tua tappa e le scelte restano salvate.':'RECUPERO ROOK · Completa lo scontro del cantiere. Poi riprenderai la tua tappa, con le scelte conservate.')]);progress.rookCatchup.introSeen=true;persist();}
 if(step.type==='hub'){await openHub(step.id,'campaign',step.pov==='both'?'nox':step.pov);return;}
 if(step.type==='escape'){await startCollapse();return;}
 if(step.type==='scene'){if(resumeCleared){await completeStep();return;}mode='scene';await playScene(step.id);if(id!==runId)return;await completeStep();return;}
 if(resumeCleared){await afterCleared(step);return;}
 if(step.type==='foot'&&progress.checkpoint!=='boss'&&preparationNeeded(progress,step.id)){await openHub(step.id==='archive'?'toxic':'clockwork','supply','nox');notice(preparationNeeded(progress,step.id));return;}
 if(step.id==='exp_chalk_marks'&&progress.catchup)await say(STORY.chalk_catchup);
 if(step.id==='exp_chalk_marks'&&!progress.narrative.choices.chalk_route){await say(resolveLines(STORY.chalk_pre,flags()));await choose('chalk_route');}
 if(step.type==='foot')await startFoot(step,true);else await startDrive(step,true);
}
async function completeStep(){audioDirector.sfx('save');progress.status='cleared';progress.checkpoint=null;persist();
 if(CAMPAIGN[progress.step].id==='blackout'&&progress.rookCatchup){
  if(!finishRookRecovery(progress))throw Error('Impossibile ripristinare la tappa dopo Rook');persist();
  if(progress.world.hub){const h=progress.world.hub;await openHub(h.id,h.reason,h.pov,true);}else await enterStep(progress.step,progress.status==='cleared');return;
 }
 if(CAMPAIGN[progress.step].id==='exp_chalk_marks'&&progress.catchup){
  if(!flags()['exp.chalk.callback_seen']){await say(resolveLines(STORY.chalk_nox_callback,flags()));flag('exp.chalk.callback_seen',true);persist();}
  if(!finishCatchup(progress))throw Error('Impossibile ripristinare la tappa dopo Segni di Gesso');persist();
  if(progress.world.hub){const h=progress.world.hub;await openHub(h.id,h.reason,h.pov,true);}else await enterStep(progress.step,progress.status==='cleared');return;
 }
 if(progress.step>=CAMPAIGN.length-1){showEnding();return;}progress.step++;progress.status='playing';persist();await enterStep(progress.step);}
let tutorial=null,lowHpWarned=false,halfSaid=false,lateSaid=false,overdriveSaid=false;
async function startFoot(step,first){
 const def=applyEquipment(progress,buildMission(step.id,flags(),progress.cityChoice));
 const extra=step.id==='blackout'?['rook','tessa']:['exp_chalk_marks','below'].includes(step.id)?['chalk_route_art','chalk_flask_states']:[];if(def.combatV9)extra.push('weapon_icons','vfx_c9',def.pov==='nox'?'vfx_vx9':'vfx_r12',...(def.pov==='nox'?['nox_vx9_gun','nox_vx9_reload','nox_h17_gun','nox_h17_reload']:['lulu_r12_gun','lulu_r12_reload','lulu_arc7_gun','lulu_arc7_reload']));if(def.boss?.kind==='anchor')extra.push('anchor_core','anchor_bollards','anchor_cable','anchor_cable_end','anchor_sweep');const allyArt=['ascent','finale'].includes(step.id)?['kairn','morrow']:[];
 try{await prepareDistrict(def.map,def.kind,extra,def.kind===3&&def.boss?.kind!=='custode');await chronoArt.prepare(def.kind,def.boss?.kind==='archon',[...allyArt,...(step.id==='below'&&flags()['exp.chalk.completed']?['civilian']:[])]);await audioDirector.preloadChrono(def.kind,def.boss?.kind==='anchor'?ANCHOR_SOUNDS:[]);}catch(e){notice('Risorsa non disponibile: '+e.message);fault(e,'asset',true);return;}
 activeMapSurface=def.layout?buildMapSurface(getLayout(def.layout),images[DISTRICT_MAPS[def.map]],images.district_props,def.palette,step.id==='exp_chalk_marks'?null:chronoArt.get('environment'),def.kind):null;
 lastStepSound=0;audioDirector.setAmbience(def.ambience|| (audioDirector.chronoAmbience?'chrono_'+audioDirector.chronoAmbience:def.dark?'dark':def.map===1?'port':'city'));
 state=newRun(def.pov,def.map,progress.upgrade,progress.cityChoice,progress.narrative,def);
 const atBoss=progress.checkpoint==='boss'&&resumeAtBoss(state);
 prepareMapRasters();mode='foot';fx=[];for(const f of chronoFxPool)f.life=0;lowHpWarned=halfSaid=lateSaid=overdriveSaid=false;
 document.body.classList.toggle('lulu-pov',def.pov==='lulu');
 panel('hud',true);panel('controls',true);panel('driving-controls',false);panel('bag',true);configureControls();
 if(first&&!atBoss&&step.id!=='exp_chalk_marks')await say(resolveLines(STORY[step.pre],flags()));
 if(first&&step.id==='below'&&flags()['exp.chalk.completed']&&!flags()['exp.chalk.callback_seen']){flag('exp.chalk.callback_seen',true);persist();}
 if(step.id==='blackout'&&!memo('city-tutorial-v8'))tutorial={step:'move',from:{x:state.x,y:state.y},slow:false};else tutorial=null;
 bark('start');if(def.ally==='unit9'){bark('unit9');setTimeout(()=>bark('unit9b'),4000);}
 if(atBoss){audioDirector.sfx('suspense_boss');notice('Checkpoint: '+BOSS_NAMES[def.boss.kind]+'. I dispositivi restano attivi.');}
 lastHurt=null;running=true;paused=false;
}
function configureControls(){frameInsets=null;panel('weapon-controls',!!state.arsenal);panel('heal',progress.world.visited.length>0||(progress.world.inventory.medkit||0)>0);const s=state,c=s.c;const unlocked=c.magic||s.hero==='lulu';setText('gun','SPARA');panel('magic',unlocked);$('magic').dataset.label=s.hero==='lulu'?'RISONANZA':'PULSE';
 $('duo').dataset.label=s.signature==='duo'?'DUO':s.signature==='overdrive'?'BLACK PULSE':'BARRIERA';panel('duo',s.signature!=='duo'||memo('city-duo-seen-v8'));panel('interact',false);}
async function onFootEnd(){const s=state,step=CAMPAIGN[progress.step];running=false;clearControls();
 if(s.status==='failed'){progress.stats.deaths++;persist();await wait(700);const boss=progress.checkpoint==='boss'&&s.c.boss;
  showResult({tag:'RIPROVIAMO',title:'Nessuno resta indietro.',text:(boss?'Riparti dallo scontro con '+BOSS_NAMES[s.c.boss.kind]+', con la salute piena: i dispositivi restano attivi.':'Riparti dall’inizio della missione, con la salute piena.')+' Le scelte fatte restano.',tip:DEFEAT_TIPS[lastHurt]||'',retry:true});return;}
 if(s.allies)await leaveStrangers();
 if(s.enemies.some(e=>e.bossKind==='rook'&&e.hp<=0)){flag('encounter.rook.completed',true);flag('weapon.quickdraw.component',true);}if(s.enemies.some(e=>e.bossKind==='anchor'&&e.hp<=0)&&!flags()['encounter.anchor.completed']){flag('encounter.anchor.completed',true);flag('weapon.anchor_component',true);notice('Nel nucleo di The Anchor c’è un ago di guida intatto. Nox lo tiene: Tessa saprà a cosa serve.');}progress.status='cleared';progress.checkpoint=null;persist();await wait(900);await afterCleared(step);}
// What hit the hero last decides the one tip shown after a defeat.
const DEFEAT_TIPS={sweep:'La cima spazza lungo la fascia arancione: esci di lato prima che diventi rossa, o mettiti dietro un riparo.',mine:'Le mine hanno una croce e un perimetro tratteggiato. Spara per disattivarle oppure esci dal raggio prima che si armino.',melee:'Il cerchio rosso segna dove cadrà il colpo: esci dal cerchio o SCHIVA mentre si chiude.',charge:'La fascia rossa annuncia una carica: spostati di lato prima che parta.',shot:'La linea tratteggiata segna un proiettile: mettiti dietro un muro o SCHIVA attraverso il colpo.'};
let lastHurt=null;
async function afterCleared(step){
 running=false;panel('controls',false);panel('bossbar',false);panel('bag',false);if(!progress.rookCatchup)rewardMission(progress,step.id);if(step.id==='exp_chalk_marks')flag('exp.chalk.completed',true);persist();
 if(step.type==='drive'){showDriveResult();return;}
 await say(resolveLines(STORY[step.post],flags()));
 if(step.choice==='blackout_power'){if(!progress.cityChoice)await chooseCityPanel();if(flags()['encounter.rook.completed']&&!flags()['weapon.tessa'])await offerFieldKit();}
 else if(step.choice){const pick=await choose(step.choice);await say(resolveLines(STORY[REACTIONS[step.choice]?.[pick]],flags()));}
 if(step.id==='port'&&!flags().consent_channel_respected){flag('consent_channel_respected',true);progress.narrative.thermal=clamp(progress.narrative.thermal+3,0,100);persist();}
 if(step.id==='breach')applyBeat(progress.narrative,V07_BEATS.breach_helios_promise)&&persist();
 panel('supply',!['zero','finale'].includes(step.id)&&availableHubs(progress,stepPov(step)).length>0);
 const def=FOOT[step.id],nextFoot=CAMPAIGN.slice(progress.step+1).some(s=>s.type==='foot');
 showResult({tag:'MISSIONE COMPIUTA',title:def.name,text:def.end,upgrades:nextFoot&&!progress.rookCatchup,nextLabel:progress.rookCatchup?'Riprendi la tua tappa':'Avanti'});
}
function showResult({tag,title,text,tip='',retry=false,upgrades=false,next=false,nextLabel='Avanti'}){panel('weapon-controls',false);lock();panel('result',true);localeView.write($('result-tag'),tag);localeView.write($('result-title'),title);localeView.write($('result-text'),text);localeView.write($('result-tip'),tip);panel('result-tip',!!tip);panel('upgrades',upgrades&&!retry);panel('retry',retry);panel('next',!retry&&(!upgrades||next));localeView.write($('next'),nextLabel);(retry?$('retry'):upgrades?$('power'):$('next')).focus();}
for(const type of ['power','shield'])$(type).onclick=()=>{if($('result').hidden)return;progress.upgrade=type;panel('result',false);unlock();completeStep();};
$('next').onclick=()=>{if($('result').hidden)return;panel('result',false);unlock();const step=CAMPAIGN[progress.step];if(step.id==='escape'&&progress.cityChoice&&!$('city-return').dataset.shown){showCity();return;}completeStep();};
$('retry').onclick=()=>{if($('result').hidden)return;panel('result',false);unlock();restartMission();};
function restartMission(){if(mode==='hub'){panel('pause-panel',false);paused=false;return;}if(mode==='escape'){startCollapse();return;}if(settings.sound&&!lifecycleMuted)audioDirector.resume(true);musicQuiet=10;const step=CAMPAIGN[progress.step];hideGameplay();if(step.type==='foot')startFoot(step,false);else if(step.type==='drive')startDrive(step,false);}
async function offerFieldKit(){
 await loadImage('tessa');await audioDirector.preloadChrono(0);lock();panel('field-kit',true);soundtrack('tessa_workbench');audioDirector.sfx('tessaCase');$('equip-kit').focus();
 return new Promise(resolve=>{$('equip-kit').onclick=()=>{
  if(!deliverFieldKitV9(progress,()=>persist())){notice('Equipaggiamento non salvato. Riprova.');return;}
  audioDirector.sfx('weaponSwitch');panel('field-kit',false);$('equip-kit').onclick=null;unlock();resolve();
 };});
}
function chooseCityPanel(){lock();panel('city-choice',true);$('choose-workshop').focus();return new Promise(resolve=>{for(const choice of ['workshop','shelter'])$('choose-'+choice).onclick=()=>{if(progress.cityChoice)return;progress.cityChoice=choice;flag('blackout_choice',choice);progress.narrative.choices.blackout_power=choice;persist();audio('choice');panel('city-choice',false);unlock();resolve(choice);};});}
function showCity(){const outcome=cityOutcome(progress.cityChoice);if(!outcome){completeStep();return;}lock();$('city-return').dataset.shown='1';localeView.write($('city-title'),outcome.title);localeView.write($('city-return-text'),outcome.returnText);$('site-workshop').classList.toggle('lit',progress.cityChoice==='workshop');$('site-shelter').classList.toggle('lit',progress.cityChoice==='shelter');panel('city-return',true);$('city-close').focus();}
$('city-close').onclick=()=>{panel('city-return',false);unlock();completeStep();};

// ---------- Walkable hubs, local errands, inventory and revisits ----------
let hubTracked=null,hubNearest=null,exploreBusy=false;
function hubClose(){panel('hub-panel',false);unlock();}
function hubMenu(title,copy,buttons){
 lock();panel('hub-panel',true);localeView.write($('hub-title'),title);localeView.write($('hub-copy'),copy);const list=$('hub-options');list.textContent='';
 for(const item of buttons){const b=document.createElement('button');localeView.write(b,item.label);b.dataset.action=item.id||'';b.disabled=!!item.disabled;b.onclick=async()=>{hubClose();await item.action();};list.appendChild(b);}
 const close=document.createElement('button');localeView.write(close,'Chiudi');close.onclick=hubClose;list.appendChild(close);list.firstChild.focus();
}
function hubNavigation(){
 if(mode!=='hub')return;const id=progress.world.hub.id;
 const points=hubPoints(id,progress).filter(p=>p.kind!=='secret'||progress.world.secrets.includes(id+':map')||progress.world.secrets.includes(id));
 hubMenu(HUBS[id].name,'Scegli una destinazione da seguire a piedi. Gli incarichi si consegnano alla bacheca.',points.filter(p=>p.kind!=='target'||HUBS[id].jobs.some(j=>j.targets.includes(p.id)&&progress.world.quests[j.id]?.status==='active')).map(p=>({id:'track:'+p.id,label:p.label+(p.kind==='target'?' · '+p.id.replaceAll('_',' '):''),action:()=>{hubTracked=p.id;notice('Segui la freccia: '+p.label);}})));
}
function hubBoard(){
 const id=progress.world.hub.id,h=HUBS[id];
 hubMenu('Incarichi · '+h.name,'Ogni ricompensa si riceve una volta. I componenti sono riservati alla preparazione.',h.jobs.map(j=>{const q=progress.world.quests[j.id],ready=q?.targets.length===j.targets.length;return {id:'job:'+j.id,label:j.title+' · '+(q?.status==='complete'?'completato':q?`${q.targets.length}/${j.targets.length}${ready?' · consegna':''}`:`${j.reward} monete${j.part?' + componente':''}`),disabled:q?.status==='complete',action:()=>{if(!q)acceptHubJob(progress,id,j.id);else if(ready){finishHubJob(progress,id,j.id);notice(j.finish);}const current=progress.world.quests[j.id];hubTracked=current.status==='complete'?null:j.targets.find(t=>!current.targets.includes(t))||'board';persist();}};}));
}
function activateMedicine(fromBag=false){
 if(mode!=='foot'||!running||paused||(!fromBag&&uiLock)||state?.status!=='playing')return false;
 if(!(progress.world.inventory.medkit>0)){notice('Nessun kit: acquista la medicina nei negozi dei quartieri.');return false;}
 if(state.hp>=state.maxHp){notice('Salute già al massimo. Kit conservato.');return false;}
 const before=state.hp;if(!useHubMedicine(progress,state,()=>persist()))return false;
 audio('heal');floatText(state.x,state.y-80,'+'+(state.hp-before),'#b9ffe4');
 fx.push({type:'ring',x:state.x,y:state.y,r:65,life:settings.reduced?.15:.45,max:settings.reduced?.15:.45,color:'#b9ffe4'});return true;
}
$('heal').onclick=()=>activateMedicine();
$('heal').onkeydown=e=>{if(isActivationKey(e.code)){e.preventDefault();e.stopPropagation();if(!e.repeat)activateMedicine();}};
$('heal').onkeyup=e=>{if(isActivationKey(e.code)){e.preventDefault();e.stopPropagation();}};
function showBag(){
 if(!progress||!['hub','foot'].includes(mode))return;
 const w=progress.world;
 hubMenu('Bagaglio',`${w.coins} monete · ${Object.keys(w.preparation).length}/2 preparazioni installate`,Object.entries(w.inventory).filter(([,n])=>n>0).map(([id,n])=>({id:'item:'+id,label:`${HUB_ITEMS[id].name} ×${n}${Object.values(w.equipment).includes(id)?' · equipaggiato':''}`,action:()=>{if(id==='medkit'){if(mode==='foot')activateMedicine(true);else notice('Usa la medicina quando sei ferito in missione.');}else if(equipHubItem(progress,id)){persist();notice('Equipaggiato: '+HUB_ITEMS[id].name+'. Effetto dalla prossima missione.');}else notice(HUB_ITEMS[id].description);}})));
}
async function openHub(id,reason='campaign',pov='nox',resume=false){
 ++runId;running=false;paused=false;uiLock=0;hideGameplay();panel('menu',false);panel('ending',false);scene=null;drive=null;
 const h=HUBS[id],previous=resume?progress.world.hub:null;if(!h)return;
 const fresh=!progress.world.visited.includes(id);if(fresh)progress.world.visited.push(id);
 const npcAssets=[...new Set(hubPoints(id).map(p=>p.atlas).filter(Boolean))];
 mode='loading';await prepareDistrict(h.district,h.district,nextHubRace(progress,pov)||hubRaceModes(progress,pov).length?['driving_cars',...RACE_ART]:[],true);await chronoArt.prepare(h.district,false,npcAssets);await audioDirector.preloadChrono(h.district,nextHubRace(progress,pov)?RACE_SOUNDS:[]);
 const l=getLayout(h.layout),def={id,layout:h.layout,map:h.district,kind:h.district,palette:h.color,pov,partner:false,magic:false,hp:1,speed:0,damage:0,cooldown:1,nodes:[],waves:[],start:l.start};
 state=newRun(pov,h.district,progress.upgrade,progress.cityChoice,progress.narrative,def);
 if(previous){const at=nearestFloor(l,{x:previous.x,y:previous.y});state.x=at.x;state.y=at.y;}
 progress.world.hub={id,reason,pov,returnStep:progress.step,x:state.x,y:state.y};
 activeMapSurface=buildMapSurface(l,images[DISTRICT_MAPS[h.district]],images.district_props,h.color,chronoArt.get('environment'),h.district);prepareMapRasters();
 mode='hub';hubTracked='board';hubNearest=null;exploreBusy=false;frameInsets=null;
 document.body.classList.toggle('lulu-pov',pov==='lulu');panel('hud',true);panel('controls',true);panel('hub-tools',true);panel('bag',true);
 for(const id of ['gun','magic','duo','dash'])panel(id,false);audioDirector.setAmbience('chrono_'+['old_town','cathedral','toxic_market','clockwork'][h.district]);soundtrack(pov==='lulu'?'lulu':'refuge_theme');
 if(settings.sound&&!lifecycleMuted)audioDirector.resume();persist();
 if(fresh){await say(h.intro.map(text=>storyLine('',text)));if(id==='moon')await say([storyLine(progress.cityChoice==='workshop'?'MIRA':'DARIO',progress.cityChoice==='workshop'?'Il rifugio ha ancora le lampade. Abbiamo aperto lo stesso.':'L’officina è ferma. Il rifugio ha accolto chi aspettava qui.')]);}
 if(reason==='epilogue')await say([storyLine('',h.epilogue)]);
 running=true;
}
async function hubExit(){
 const loc=progress.world.hub,needed=loc.reason==='campaign'&&(loc.id==='toxic'||loc.id==='clockwork')&&!progress.world.preparation[loc.id];
 if(needed){hubTracked='smith';notice('Prima di partire: completa un incarico e scegli la preparazione dal fabbro.');return;}
 progress.world.hub=null;running=false;persist();hideGameplay();
 if(loc.reason==='epilogue'){showEnding();return;}
 if(loc.reason==='campaign'){await completeStep();return;}
 await enterStep(progress.step,progress.status==='cleared');
}
function hubTravel(){
 const loc=progress.world.hub,ids=availableHubs(progress,loc.pov);
 hubMenu('Collegamenti','I collegamenti rispettano la strada del personaggio che stai seguendo.',ids.filter(id=>id!==loc.id).map(id=>({id:'travel:'+id,label:HUBS[id].name,action:()=>openHub(id,loc.reason==='epilogue'?'epilogue':'supply',loc.pov)})));
}
// Veyra's championship in Vanta: the hub stays the saved location, so closing the app mid-race
// resumes in the hub and the race simply starts again. Rewards come only from recordRaceV9.
let race=null;
const raceLang=()=>settings.language==='en'?'en':'it';
function hubRace(id){
 const modes=hubRaceModes(progress,progress.world.hub?.pov),rec=progress.world.races,buttons=[];
 if(id){const r=RACES_V9[id],first=!rec?.events?.ash_docks?.completed;buttons.push({id:'race:'+id,label:'Sfida di Veyra · '+r.name[raceLang()].split(' · ')[1],action:()=>startHubRace(id)});
  if(!modes.length){hubMenu('Vortex · '+r.name[raceLang()],(first?'Veyra «Ash» Kor corre al porto esterno. Facoltativa: completarla sblocca la sfida successiva, vincerla dà un premio in più.':'Prossima sfida di Veyra.')+' Completa tutti i checkpoint; un checkpoint mancato costa 3 s, un recupero 5 s.',[{id:'race:'+id,label:'Raggiungi Ash Docks',action:()=>startHubRace(id)}]);return;}}
 for(const m of Object.keys(RACE_MODES_V9)){const list=modes.filter(x=>x.startsWith(m+':'));if(list.length)buttons.push({id:'mode:'+m,label:RACE_MODES_V9[m][raceLang()],action:()=>hubRaceMode(m,list)});}
 hubMenu('Vortex · Ash Docks','Sfide della Vortex: Contro il tempo (da solo, medaglie sul tempo), Eliminazione (a ogni checkpoint esce l’ultimo) e Rivincita (il percorso al contrario, Veyra più aggressiva). Si aprono su ogni percorso già completato.'+(id?' La serie con Veyra continua.':''),buttons);
}
function hubRaceMode(mode,ids){
 const rec=progress.world.races,medal={gold:'oro',silver:'argento',bronze:'bronzo'};
 hubMenu('Vortex · '+RACE_MODES_V9[mode][raceLang()],{tt:'Da solo, con più rampe nitro. Oro, argento e bronzo sul tempo.',elim:'Quattro auto: a ogni checkpoint esce l’ultima ancora in corsa. All’ultimo resta un duello.',rev:'Il percorso al contrario, più container, Veyra più aggressiva.'}[mode],
  ids.map(id=>{const r=RACES_V9[id],e=rec?.modes?.[id],[g,sv,b]=r.medals||[];return {id:'race:'+id,label:r.name[raceLang()].split(' · ')[1]+(e?` · ${e.bestTime.toFixed(1)} s`+(e.medal?` · ${medal[e.medal]}`:e.won?' · vinta':''):'')+(mode==='tt'&&!e?` · oro ${g} s`:''),action:()=>startHubRace(id)};}));
}
async function startHubRace(id){
 if(mode!=='hub'||race)return;running=false;clearControls();
 try{await Promise.all(['driving_cars','driving_road',...raceRoadArt(RACES_V9[id])].map(loadImage));}catch(e){notice('Gara non caricata: '+e.message);running=true;return;}
 const def=RACES_V9[id];
 await say([def.solo?systemLine(raceLang()==='en'?`Time trial · ${def.name.en.split(' · ')[1]}. Gold ${def.medals[0]} s, silver ${def.medals[1]} s, bronze ${def.medals[2]} s. Extra nitro pads on the course.`:`Contro il tempo · ${def.name.it.split(' · ')[1]}. Oro ${def.medals[0]} s, argento ${def.medals[1]} s, bronzo ${def.medals[2]} s. Più rampe nitro sul percorso.`):storyLine('VEYRA',veyraLineV9(id,'intro',raceLang()))]);
 hideGameplay();race={s:newRaceV9(id),claimed:false};mode='race';fx=[];
 panel('hud',true);panel('driving-controls',true);panel('pulse',false);panel('nitro',true);raceCallouts=[];raceRings=[];raceMarks=[];raceParticles=[];raceBump=0;raceLean=0;nitroQueued=false;audioDirector.setAmbience('drive');soundtrack(RACES_V9[race.s.id].mode==='night'?'veyra_championship_night':'veyra_championship');running=true;paused=false;
}
// Nitro moments and new obstacles are called out over the Vortex; synthesized cues until authored ones exist.
const RACE_CALLOUTS={nitro:['NITRO','#7af3ff','dash'],pad:['RAMPA NITRO','#7af3ff','dash'],perfectStart:['PARTENZA PERFETTA','#9ff7b8','choice'],wheelspin:['TROPPO PRESTO','#f4bd72','ui'],nearMiss:['SFIORATO · +NITRO','#ffe28a','ui'],perfectCheckpoint:['CENTRATO · +NITRO','#9ff7b8',null],draft:['SCIA','#c8d4e2',null],slick:['OLIO','#f4bd72','ui']};
let raceCallouts=[],nitroQueued=false;
// Short vibrations for the moments the hands should feel (Android WebView: VIBRATE permission).
function haptic(pattern){if(settings.haptics&&!document.hidden)try{navigator.vibrate?.(pattern);}catch{}}
const RACE_HAPTICS={impact:45,nitro:[18,40,18],pad:22,perfectStart:30,checkpoint:12,nearMiss:10,start:20};
let raceRings=[],raceMarks=[],raceParticles=[],raceBump=0,raceLean=0;
function raceFx(e){if(e.type==='eliminated'){const c=race.s.cars.find(x=>x.id===e.car);raceCallouts.push({text:e.car==='player'?'ELIMINATO':'FUORI: '+(c?.id==='veyra'?'VEYRA':c?.name||''),color:'#f4bd72',t0:race.s.time});haptic(30);return;}
 if(e.car!=='player'&&e.type!=='start'&&e.type!=='count')return;
 if(RACE_HAPTICS[e.type])haptic(RACE_HAPTICS[e.type]);
 if(['checkpoint','perfectCheckpoint','pad','nitro','perfectStart'].includes(e.type))raceRings.push({t0:race.s.time,color:e.type==='checkpoint'||e.type==='perfectCheckpoint'?'#77f5d2':'#7af3ff'});
 if(e.type==='impact')raceBump=.3;
 if(e.type==='count'){audioDirector.sfx('raceBeep');return;}
 if(e.type==='impact'){audioDirector.sfx('raceHit');if(!settings.reduced)shake=5;}else if(e.type==='checkpoint')audioDirector.sfx('raceCheckpoint');else if(e.type==='finish')audioDirector.sfx('raceFinish');else if(e.type==='start')audioDirector.sfx('raceGo');
 else if(e.type==='missedCheckpoint')notice('Checkpoint mancato: +3 s. Riparti dal varco.');
 else if(RACE_CALLOUTS[e.type]){const [text,color,cue]=RACE_CALLOUTS[e.type];raceCallouts.push({text:e.type==='slick'&&['sand','storm'].includes(RACES_V9[race.s.id].mode)?'SABBIA':text,color,t0:race.s.time});if(raceCallouts.length>3)raceCallouts.shift();if(cue)audioDirector.sfx(cue);if(['nitro','pad'].includes(e.type)&&!settings.reduced)shake=Math.max(shake,2);}else if(e.type==='recovery')notice('Vortex recuperata: +5 s.');}
async function finishHubRace(){
 if(!race||race.claimed)return;race.claimed=true;running=false;clearControls();
 const s=race.s,result=raceResultV9(s);let reward=0;if(result){reward=claimHubRace(progress,s).reward;persist();}
 panel('driving-controls',false);
 const def=RACES_V9[s.id],medal=result&&raceMedal(def,result.time);
 const en=raceLang()==='en',medalText={gold:en?'Gold medal':'Medaglia d’oro',silver:en?'Silver medal':'Medaglia d’argento',bronze:en?'Bronze medal':'Medaglia di bronzo'}[medal];
 await say(s.status==='eliminated'?[storyLine('VEYRA',veyraLineV9(s.id,'out',raceLang()))]:result?(def.solo?[systemLine(medal?`${medalText}: ${result.time.toFixed(1)} s.`:en?`${result.time.toFixed(1)} s: no medal. Bronze at ${def.medals[2]} s.`:`${result.time.toFixed(1)} s: niente medaglia. Bronzo a ${def.medals[2]} s.`)]:[storyLine('VEYRA',veyraLineV9(s.id,result.rank===1?'win':'lose',raceLang()))]):[systemLine('Tempo scaduto. La sfida resta aperta: Veyra aspetta al porto.')]);
 if(result)notice((def.solo?`Contro il tempo · ${result.time.toFixed(1)} s`:`Arrivo ${result.rank}/${s.cars.length} · ${result.time.toFixed(1)} s`)+(reward?` · +${reward} monete`:''));
 race=null;const loc=progress.world.hub;await openHub(loc.id,loc.reason,loc.pov,true);
}
function drawRace(w,h){
 const s=race.s,r=RACES_V9[s.id],p=s.cars[0],scale=Math.min(w/720,h/1050),worldH=h/scale,fast=Math.min(1,p.speed/470),carY=worldH*(.74-.05*fast),at=d=>carY-(d-p.distance)*.65,jitter=settings.reduced?0:(Math.random()-.5)*shake;
 // The camera leans into the steering and the Vortex sits lower when slow, higher (more road ahead) when fast.
 raceLean+=((settings.reduced?0:-p.vx*.05)-raceLean)*.12;
 ctx.save();ctx.translate((w-720*scale)/2+jitter+raceLean*scale,0);ctx.scale(scale,scale);const scrolled=p.distance*RACE_SCROLL,base=Math.floor(scrolled/RACE_ROAD_TILE),offset=scrolled%RACE_ROAD_TILE;
 for(let y=-RACE_ROAD_TILE+offset,i=base+1;y<worldH;y+=RACE_ROAD_TILE,i--){const t=images[raceRoadTile(r,i)];ctx.drawImage(t?.naturalWidth?t:images.driving_road,0,y,720,RACE_ROAD_TILE);}
 r.checkpoints.forEach((cp,i)=>{const y=at(cp),x=raceCheckpointX(r,i),half=r.checkpointWidth||165;if(y<-40||y>worldH+40)return;const done=i<p.checkpoint,color=done?'#6f8b92':'#77f5d2',art=images[done?'race_cp_passed':'race_cp_active'];
  if(half<=100&&art?.naturalWidth){const k=(half*2+14)/96;ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(art,x-64*k,y+4-160*k,128*k,256*k);ctx.restore();label('CP '+(i+1),x,y-112,color,22);return;}
  const pylon=images[done?'race_cp_pylon_passed':'race_cp_pylon'],tape=images[done?'race_cp_tape_passed':'race_cp_tape'];
  if(half>100&&pylon?.naturalWidth&&tape?.naturalWidth){const tk=.5,step=63*tk,pk=70/182;ctx.save();ctx.imageSmoothingEnabled=false;for(let tx=x-half;tx<x+half;tx+=step){const w=Math.min(step,x+half-tx);ctx.drawImage(tape,0,0,w/tk,32,tx,y-20,w,16);}for(const sx of [x-half,x+half])ctx.drawImage(pylon,sx-64*pk,y+6-218*pk,128*pk,256*pk);ctx.restore();label('CP '+(i+1),x,y-80,color,22);return;}
  ctx.fillStyle=color+'55';ctx.fillRect(x-half,y-4,half*2,8);for(const sx of [x-half,x+half]){ctx.fillStyle='#071019';ctx.fillRect(sx-7,y-36,14,40);ctx.fillStyle=color;ctx.fillRect(sx-4,y-33,8,34);}label('CP '+(i+1),x,y-46,color,22);});
 r.gates.forEach((g,i)=>{const y=at(g);if(y<-60||y>worldH+60)return;const open=raceGateOpen(s.time,i);ctx.fillStyle=open?'#72ebd5':'#f4bd72';ctx.fillRect(130,y,460,open?5:18);label(open?'APERTO':'CHIUSO',360,y-18,open?'#72ebd5':'#f4bd72',22);});
 // Nitro pads: chevrons on the lane that boost whoever crosses them.
 const props=RACE_PROPS[raceRegion(r.mode)],img=n=>images[n]?.naturalWidth?images[n]:null;
 for(const q of r.pads||[]){const y=at(q.at);if(y<-120||y>worldH+120)continue;const glow=settings.reduced?1:.65+.35*Math.sin(s.time*9+q.at),padArt=img(props.pad);if(padArt){ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(padArt,q.x-58,y-62,116,124);ctx.globalAlpha=(1-glow)*.5;ctx.fillStyle='#04131c';ctx.fillRect(q.x-56,y-60,112,120);ctx.restore();continue;}ctx.save();ctx.globalAlpha=.85;ctx.fillStyle='#04131c';ctx.fillRect(q.x-58,y-62,116,124);ctx.strokeStyle='#59e0ff';ctx.lineWidth=3;ctx.strokeRect(q.x-58,y-62,116,124);
  for(let k=0;k<3;k++){const cy=y+40-k*38;ctx.globalAlpha=glow*(.55+k*.2);ctx.fillStyle=k===2?'#e9feff':'#59e0ff';ctx.beginPath();ctx.moveTo(q.x-44,cy+14);ctx.lineTo(q.x,cy-16);ctx.lineTo(q.x+44,cy+14);ctx.lineTo(q.x+44,cy+26);ctx.lineTo(q.x,cy-4);ctx.lineTo(q.x-44,cy+26);ctx.closePath();ctx.fill();}ctx.restore();}
 // Port cargo: framed containers with hazard stripes, drawn where the model collides.
 // Each obstacle keeps its own container model on every run: the model follows its place in the course.
 const box=(model,hit,x,y,k=.625)=>{const im=images[hit?racePropHit(model):model];if(im?.naturalWidth){ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(im,x-64*k,y-96*k,128*k,192*k);ctx.restore();return;}ctx.fillStyle='#1b2630';ctx.fillRect(x-30,y-42,60,84);ctx.fillStyle='#c9774f';ctx.fillRect(x-26,y-38,52,76);ctx.fillStyle='#2a1a14';for(let j=-30;j<40;j+=16)ctx.fillRect(x-26,y+j,52,5);ctx.strokeStyle='#ffd27a';ctx.lineWidth=3;ctx.strokeRect(x-26,y-38,52,76);};
 for(const [i,hz] of r.hazards.entries()){const y=at(hz.at);if(y<-150||y>worldH+150||hz.at-p.distance>raceVisibility(r))continue;const x=raceHazardX(hz,s.time),model=props.obstacles[i%props.obstacles.length],hit=p.hits.includes(hz.at);
  if(hz.kind==='slick'){const w=hz.w||75,slickArt=img(props.slicks[i%props.slicks.length]);if(slickArt){const k=w/76;ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(slickArt,x-80*k,y-88*k*1.03,160*k,176*k*1.03);ctx.restore();continue;}const sand=['sand','storm'].includes(r.mode),g=ctx.createRadialGradient(x,y,4,x,y,w);ctx.save();ctx.translate(x,y);ctx.scale(1,1.15);ctx.translate(-x,-y);
   if(sand){g.addColorStop(0,'#e8c27ad9');g.addColorStop(.7,'#c99a55a6');g.addColorStop(1,'#c99a5500');}else{g.addColorStop(0,'#05070be6');g.addColorStop(.55,'#141a26d0');g.addColorStop(.8,'#3c2a5a66');g.addColorStop(1,'#0a0d1400');}
   ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,w,w*.78,0,0,Math.PI*2);ctx.fill();if(!sand){ctx.strokeStyle='#7af3ff40';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x-w*.15,y-w*.12,w*.45,w*.25,-.3,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#ff9ad640';ctx.beginPath();ctx.ellipse(x+w*.2,y+w*.15,w*.3,w*.16,.4,0,Math.PI*2);ctx.stroke();}else{ctx.strokeStyle='#fff1c855';ctx.lineWidth=2;for(let j=-2;j<=2;j++){ctx.beginPath();ctx.moveTo(x-w*.7,y+j*14);ctx.quadraticCurveTo(x,y+j*14-10,x+w*.7,y+j*14);ctx.stroke();}}ctx.restore();continue;}
  if(hz.kind==='barrier'){for(const [j,lx] of RACE_LANES.entries())if(lx!==hz.gap)box(props.obstacles[(i+j)%props.obstacles.length],hit,lx,y);const post=img(RACE_CRANE.post),gapArt=img(RACE_CRANE.gap);if(post){ctx.save();ctx.imageSmoothingEnabled=false;for(const sx of [hz.gap-46,hz.gap+46])ctx.drawImage(post,sx-24*.75,y-60,48*.75,96*.75);ctx.restore();}if(!hit&&gapArt){ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalAlpha=settings.reduced?.9:.65+.3*Math.sin(s.time*8);ctx.drawImage(gapArt,hz.gap-40,y+56,80,64);ctx.restore();}else if(!hit){ctx.save();ctx.globalAlpha=settings.reduced?.8:.55+.3*Math.sin(s.time*8);ctx.fillStyle='#9ff7b8';for(let k=0;k<2;k++){const cy=y+70+k*26;ctx.beginPath();ctx.moveTo(hz.gap-20,cy);ctx.lineTo(hz.gap,cy-16);ctx.lineTo(hz.gap+20,cy);ctx.lineTo(hz.gap+20,cy+7);ctx.lineTo(hz.gap,cy-9);ctx.lineTo(hz.gap-20,cy+7);ctx.closePath();ctx.fill();}ctx.restore();}continue;}
  if(hz.kind==='swing'){const beam=img(r.mode==='night'?RACE_CRANE.night:RACE_CRANE.day),trolley=img(RACE_CRANE.trolley);if(beam&&trolley){ctx.save();ctx.fillStyle='#000a';ctx.beginPath();ctx.ellipse(x+22,y+22,44,62,0,0,Math.PI*2);ctx.fill();ctx.imageSmoothingEnabled=false;ctx.drawImage(beam,0,y-160,720,120);ctx.drawImage(trolley,x-24,y-128,48,84);ctx.restore();box(props.loads[i%props.loads.length],hit,x,y,.7);continue;}ctx.save();ctx.fillStyle='#000a';ctx.beginPath();ctx.ellipse(x+22,y+22,44,62,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#1d252c';ctx.fillRect(118,y-112,484,22);ctx.fillStyle='#f2b33d';for(let bx=122;bx<598;bx+=36)ctx.fillRect(bx,y-108,18,14);ctx.strokeStyle='#0b0f13';ctx.lineWidth=3;ctx.strokeRect(118,y-112,484,22);ctx.fillStyle='#39434c';ctx.fillRect(x-20,y-118,40,34);ctx.strokeStyle='#c8d4e2';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-8,y-90);ctx.lineTo(x-8,y-62);ctx.moveTo(x+8,y-90);ctx.lineTo(x+8,y-62);ctx.stroke();ctx.restore();box(model,hit,x,y,.7);continue;}
  box(model,hit,x,y);}
 const finish=at(r.length),finishArt=img(props.finish);if(finish>-50&&finish<worldH+50&&finishArt){ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(finishArt,130,finish,460,40);ctx.restore();}else if(finish>-50&&finish<worldH+50)for(let x=130;x<590;x+=20)for(let row=0;row<2;row++){ctx.fillStyle=((x-130)/20+row)%2?'#f4f7ff':'#15202a';ctx.fillRect(x,finish+row*20,20,20);}
 // Cars never collide in the race model: a rival overlapping the Vortex is drawn as a ghost.
 const look={veyra:[3,0],rival_2:[3,3],rival_3:[0,2]};
 for(const c of s.cars){if(c.id==='player'||c.out)continue;const y=at(c.distance);if(y<-120||y>worldH+120||c.distance-p.distance>raceVisibility(r))continue;const [row,col]=look[c.id];ctx.globalAlpha=Math.abs(c.distance-p.distance)<120&&Math.abs(c.x-p.x)<95?.5:1;const carArt=images[RACE_CAR_ART[c.id]];if(carArt?.naturalWidth){const f=veyraCarFrame(c,r.mode==='night',s.time,settings.reduced),[cw,ch]=VEYRA_CAR.cell,k=110/VEYRA_CAR.bodyHeight;ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(carArt,f.col*cw,f.row*ch,cw,ch,c.x-VEYRA_CAR.centre[0]*k,y+3-VEYRA_CAR.centre[1]*k,cw*k,ch*k);ctx.restore();}else sprite(images.driving_cars,row,col,c.x,y+60,c.id==='rival_2'?112:118);ctx.globalAlpha=1;label(c.id==='veyra'?'VEYRA':c.name,c.x,y-58,c.id==='veyra'?'#ed857c':'#c8d4e2',18);}
 // Tyre marks on hard steering or slicks, sparks against the kerb, dust or spray: anchored to the course.
 if(s.status==='racing'&&p.speed>120){const hard=Math.abs(p.vx)>150||p.slick>0;if(hard)for(const off of [-24,24])raceMarks.push({d:p.distance-140,x:p.x+off,a:p.slick>0?.5:.35});
  const wall=p.x<147||p.x>573,sand=['sand','storm'].includes(r.mode);
  if(!settings.reduced&&(wall||p.slick>0||(sand&&hard))){for(let k=0;k<(wall?3:2);k++)raceParticles.push({d:p.distance-120,x:p.x+(wall?(p.x<360?-30:30):(Math.random()-.5)*50),vx:(Math.random()-.5)*120+(wall?(p.x<360?-80:80):0),vy:-40-Math.random()*90,life:wall?.35:.6,max:wall?.35:.6,c:wall?'#ffcf6a':sand?'#e2c48a':'#9aa6b2',size:wall?3:7});}}
 raceMarks=raceMarks.filter(m=>p.distance-m.d<900).slice(-220);ctx.fillStyle='#0b0d10';for(const m of raceMarks){const y=at(m.d);if(y<-10||y>worldH+10)continue;ctx.globalAlpha=m.a*Math.max(0,1-(p.distance-m.d)/900);ctx.fillRect(m.x-4,y,8,9);}ctx.globalAlpha=1;
 for(const q of raceParticles){q.life-=1/60;q.x+=q.vx/60;q.d+=-q.vy/60/.65;}raceParticles=raceParticles.filter(q=>q.life>0).slice(-120);
 for(const q of raceParticles){const y=at(q.d);ctx.globalAlpha=Math.max(0,q.life/q.max);ctx.fillStyle=q.c;ctx.beginPath();ctx.arc(q.x,y,q.size*(q.c==='#ffcf6a'?1:1.6-q.life/q.max),0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
 for(const c of s.cars){if(c.boost<=0)continue;const y=c.id==='player'?carY:at(c.distance);if(y<-120||y>worldH+120)continue;const len=(settings.reduced?50:60+Math.random()*30)*Math.min(1,c.boost*2),g=ctx.createLinearGradient(0,y+92,0,y+92+len);g.addColorStop(0,'#e9feffee');g.addColorStop(.35,'#59e0ffcc');g.addColorStop(1,'#1f6bff00');ctx.fillStyle=g;for(const off of [-22,22]){ctx.beginPath();ctx.moveTo(c.x+off-9,y+92);ctx.lineTo(c.x+off+9,y+92);ctx.lineTo(c.x+off,y+92+len);ctx.closePath();ctx.fill();}}
 if(p.boost>0&&!settings.reduced){ctx.save();ctx.strokeStyle='#cfefff55';ctx.lineWidth=2;for(let k=0;k<14;k++){const lx=130+Math.random()*460,ly=Math.random()*worldH;ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx,ly+60+Math.random()*80);ctx.stroke();}ctx.restore();}
 const dmg=p.integrity>70?[0,0]:p.integrity>35?[2,2]:[2,3];raceBump=Math.max(0,raceBump-1/60);const bump=settings.reduced?0:Math.sin(raceBump/.3*Math.PI)*.08,stretch=p.boost>0&&!settings.reduced?.04:0;
 ctx.save();ctx.translate(p.x,carY+60);ctx.rotate(Math.max(-.16,Math.min(.16,p.vx*.0011)));ctx.scale(1+bump-stretch*.5,1+bump+stretch);ctx.translate(0,-60);sprite(images.driving_cars,dmg[0],dmg[1],0,60,118,false);ctx.restore();
 raceRings=raceRings.filter(g=>s.time-g.t0<.5);for(const g of raceRings){const t=(s.time-g.t0)/.5;ctx.globalAlpha=1-t;ctx.strokeStyle=g.color;ctx.lineWidth=6*(1-t)+1;ctx.beginPath();ctx.ellipse(p.x,carY+60,50+90*t,70+110*t,0,0,Math.PI*2);ctx.stroke();}ctx.globalAlpha=1;
 if(r.visibility){const edge=at(p.distance+r.visibility),shade=ctx.createLinearGradient(0,0,0,edge+140);shade.addColorStop(0,'#050911f4');shade.addColorStop(1,'#05091100');ctx.fillStyle=shade;ctx.fillRect(0,0,720,edge+140);}
 raceCallouts=raceCallouts.filter(c=>s.time-c.t0<1.4);for(const [k,c] of raceCallouts.entries()){const t=s.time-c.t0;ctx.globalAlpha=Math.max(0,1-t/1.4);label(c.text,p.x,carY-90-(raceCallouts.length-1-k)*32-t*20,c.color,24);ctx.globalAlpha=1;}
 const nb=$('nitro');nb.style.setProperty('--fill',`${Math.round(p.nitro)}%`);nb.classList.toggle('ready',p.nitro>=NITRO_COST&&p.boost<=0);nb.classList.toggle('active',p.boost>0);
 if(s.status==='countdown'){const f=s.countdown%1||1,k=settings.reduced?1:1+.45*Math.pow(f,4);ctx.globalAlpha=Math.min(1,.35+f);label(String(Math.ceil(s.countdown)),360,worldH*.4,s.countdown<=.6?'#9ff7b8':'#efffff',Math.round(110*k));ctx.globalAlpha=1;}
 else if(s.time<.9){ctx.globalAlpha=1-s.time/.9;label('VIA!',360,worldH*.4,'#9ff7b8',Math.round(120*(settings.reduced?1:1+s.time*.5)));ctx.globalAlpha=1;}
 $('accelerate').classList.toggle('go-now',s.status==='countdown'&&s.countdown<=.6);
 ctx.restore();
 const place=raceStandings(s).findIndex(c=>c.id==='player')+1;
 setText('district',r.variant?RACE_MODES_V9[r.variant][raceLang()].toUpperCase():'ASH DOCKS');const kmh=`${Math.round(p.speed*.6)}\u00a0km/h`,alive=s.cars.filter(c=>!c.out).length;
 setText('objective',r.solo?`CP ${p.checkpoint}/${r.checkpoints.length} · ${s.time.toFixed(1)} s · oro ${r.medals[0]} s · ${kmh}${p.penalty?' · +'+p.penalty+' s':''}`:`Posizione ${place}/${alive} · CP ${p.checkpoint}/${r.checkpoints.length} · ${s.time.toFixed(1)} s · ${kmh}${p.penalty?' · +'+p.penalty+' s':''}`);showIntegrity({hp:Math.max(0,p.integrity),maxIntegrity:100,vehicle:'car'});
}
async function hubInteract(point){
 const id=progress.world.hub.id,h=HUBS[id];
 if(point.kind==='exit'){await hubExit();return;}
 if(point.kind==='board'){hubBoard();return;}if(point.kind==='travel'){hubTravel();return;}if(point.kind==='race'){hubRace(point.race);return;}
 if(point.kind==='target'){
  if(workHubTarget(progress,id,point.id)){audio('node');const j=h.jobs.find(j=>j.targets.includes(point.id)),q=progress.world.quests[j.id];hubTracked=j.targets.find(t=>!q.targets.includes(t))||'board';persist();notice(q.targets.length===j.targets.length?'Lavoro finito. Torna alla bacheca per la ricompensa.':j.title+`: ${q.targets.length}/${j.targets.length}`);}else notice('La bacheca indica chi ha bisogno di questo lavoro.');return;
 }
 if(point.kind==='secret'){
  if(!progress.world.secrets.includes(id)){progress.world.secrets.push(id);progress.world.coins+=12;persist();}
  await say([storyLine('',h.secret)]);return;
 }
 if(point.kind==='person'||point.kind==='service'){await openInterior(point);return;}
}
// Hub services: shared by the interior scene (M-I1). Economy and copy unchanged.
async function serviceRest(){flag('rested_moon',true);persist();await say(flags().separated&&!flags().reunited?[storyLine('','Sul tavolo resta anche la tazza di Nox.')]:[luluLine('Vuoi restare un momento?'),noxLine('Sì.')]);}
function serviceWallet(id){return `${progress.world.coins} monete${['toxic','clockwork'].includes(id)?' · '+progress.world.parts[id]+' componenti locali':''}`;}
function serviceCatalog(id,service){return hubCatalog(id,service).map(itemId=>{const it=HUB_ITEMS[itemId];return {id:'buy:'+itemId,label:it.name+' · '+(it.part?'1 componente locale':it.price+' monete')+' — '+it.description,action:async()=>{const result=buyHubItem(progress,id,service,itemId);persist();notice(result.ok?'Ottenuto: '+it.name:result.reason);if(result.ok&&itemId==='glass_bead')await say(flags().separated&&!flags().reunited?[noxLine('Sto iniziando ad apprezzare le cose che non servono.')]:[luluLine('A cosa serve?'),noxLine('Sto iniziando ad apprezzare le cose che non servono.')]);return result;}};});}
// Interior scene: painted interior and NPC when delivered, otherwise blurred hub and the enlarged sprite.
let interior=null;
function interiorButtons(list){const box=$('interior-options');box.textContent='';for(const item of list){const b=document.createElement('button');localeView.write(b,item.label);b.dataset.action=item.id;b.disabled=!!item.disabled;if(item.primary)b.classList.add('primary');b.onclick=()=>{if(interior)item.action();};box.appendChild(b);}box.firstChild?.focus();}
function interiorSay(text){localeView.write($('interior-line'),text);}
function interiorJob(scene){const h=HUBS[scene.hubId];return scene.job?h.jobs.find(j=>j.id===scene.job):null;}
function interiorMain(){
 const s=interior.scene,list=[];
 if(s.kind==='service'){
  if(s.service==='inn')list.push({id:'rest',label:'Riposa',primary:true,action:async()=>{const keep=interior;closeInterior(false);await serviceRest();reopenInterior(keep);}});
  else list.push({id:'shop',label:'Compra',primary:true,action:interiorShop});
  list.push({id:'ask',label:'Chiedi',action:()=>{interiorSay(interiorAsk(s,flags(),interior.asked++));}});
  const j=interiorJob(s);if(j)list.push({id:'job:'+j.id,label:j.title,action:()=>interiorErrand(j)});
 }
 list.push({id:'leave',label:'Esci',action:()=>closeInterior()});interiorButtons(list);
}
function interiorShop(){
 const s=interior.scene;interiorSay(serviceWallet(s.hubId));
 interiorButtons([...serviceCatalog(s.hubId,s.service).map(item=>({...item,action:async()=>{const r=await item.action();if(interior){interiorSay(r?.ok?serviceWallet(s.hubId):r?.reason||serviceWallet(s.hubId));}}})),{id:'back',label:'Indietro',action:()=>{interiorSay(interiorGreeting(s));interiorMain();}}]);
}
function interiorErrand(j){
 const id=interior.scene.hubId,q=progress.world.quests[j.id];
 if(!q){acceptHubJob(progress,id,j.id);interiorSay(j.brief);}
 else if(q.status==='complete')interiorSay('Già fatto. Grazie ancora.');
 else if(q.targets.length===j.targets.length){finishHubJob(progress,id,j.id);interiorSay(j.finish);audioDirector.sfx('save');}
 else interiorSay('Torna quando hai finito.');
 const current=progress.world.quests[j.id];hubTracked=current?.status==='complete'?null:current?j.targets.find(t=>!current.targets.includes(t))||'board':hubTracked;persist();
}
function drawInteriorNpc(t){
 if(!interior)return;const c=$('interior-npc'),g=c.getContext('2d'),s=interior.scene;g.clearRect(0,0,c.width,c.height);
 const img=chronoArt.get(s.atlas),anim=chronoAnimation(s.atlas,'idle');
 if(img&&anim){g.imageSmoothingEnabled=false;drawChronoFrame(g,img,anim,settings.reduced?0:t/1000,c.width/2,c.height-14,c.height*.92,false,settings.reduced);}
 if(!settings.reduced)interior.raf=requestAnimationFrame(drawInteriorNpc);
}
function showInterior(){
 const el=$('interior'),s=interior.scene;el.style.setProperty('--hub-tint',HUBS[s.hubId].color);
 el.classList.toggle('street',s.kind==='person');el.classList.toggle('painted',!!s.background);
 if(s.background)el.style.setProperty('--interior-bg',`url('${s.background}')`);else el.style.removeProperty('--interior-bg');
 localeView.write($('interior-place'),s.kind==='person'?'PER STRADA':s.place);localeView.write($('interior-name'),s.npc);
 lock();panel('interior',true);el.classList.remove('open');void el.offsetWidth;el.classList.add('open');
 interiorSay(interiorGreeting(s));interiorMain();drawInteriorNpc(0);
}
async function openInterior(point){
 const scene=interiorFor(progress.world.hub.id,point);if(!scene)return;
 if(scene.kind==='service')audioDirector.sfx('ui');
 interior={scene,asked:0,raf:0};showInterior();
}
function closeInterior(release=true){if(!interior)return;cancelAnimationFrame(interior.raf);panel('interior',false);unlock();if(release)interior=null;}
function reopenInterior(keep){if(mode!=='hub'||!keep)return;interior=keep;showInterior();}
$('hub-map').onclick=hubNavigation;$('hub-journal').onclick=()=>{const h=HUBS[progress.world.hub.id];hubMenu('Diario','Segui un incarico o torna alla bacheca per accettarlo e consegnarlo.',h.jobs.map(j=>({id:'journal:'+j.id,label:j.title+' · '+(progress.world.quests[j.id]?.status||'da accettare'),action:()=>{const q=progress.world.quests[j.id];hubTracked=q?.status==='active'?j.targets.find(t=>!q.targets.includes(t))||'board':'board';}})));};$('bag').onclick=showBag;
$('supply').onclick=()=>{const pov=stepPov(CAMPAIGN[progress.step]);const ids=availableHubs(progress,pov);if(ids.length)openHub(ids.at(-1),'supply',pov==='lulu'?'lulu':'nox');};
function drawStrangers(actors,time){for(const a of actors){const anim=chronoAnimation(a.id,a.anim||(a.fighting?'attack':'idle'))||chronoAnimation(a.id,'idle'),elapsed=a.anim?a.animT:a.cycle?time%a.cycle:time;circle(a.x,a.y,19,'#00000060');drawChronoFrame(ctx,chronoArt.get(a.id),anim,elapsed,a.x,a.y,anim?.draw_height||128,(a.face??1)<0,settings.reduced);}}
function drawRiftFront(time){
 ctx.fillStyle='#ad79ff33';ctx.fillRect(400,180,736,70);label('FRATTURA · KAIRN E MORROW TENGONO IL VARCO',768,200,'#d6b4ff',14);
 drawStrangers([{id:'kairn',x:540,y:300,fighting:true,cycle:.9},{id:'morrow',x:1000,y:300,anim:'shotgun',animT:time%1.1,face:-1}],time);
 // Creatures remain outside the arena: the allies never damage Archon.
 for(let i=0;i<4;i++){const x=590+i*100,y=225+Math.sin(time*3+i)*12;circle(x,y,16,'#8f5acb');line(x,y,x+16*Math.sin(time*6),y+25,'#c3a3f0',4);}
}
async function meetStrangers(){
 running=false;clearControls();persist();
 state.allies=[{id:'kairn',x:state.x-75,y:state.y-60,cd:0,face:1,anim:'idle',animT:0},{id:'morrow',x:state.x+75,y:state.y-60,cd:.3,face:-1,anim:'idle',animT:0}];state.allyTime=8;for(const a of state.allies)spawnChronoFx('chrono_rings',a.x,a.y-40);soundtrack('strangers_rift');
 // The window starts with the arrival; the model is paused while they speak, so it lasts 8 s of play.
 await say(STORY.strangers);running=true;
}
async function leaveStrangers(){
 if(!state?.allies)return;delete state.allies;running=false;clearControls();
 await say(STORY.strangers_after);flag('strangers_met',true);flag('broken_clock_fragment',true);persist();if(mode==='foot'&&state?.status==='playing')running=true;
}
async function relayRecognition(){running=false;clearControls();await say([systemLine('EVE-47 — ACCESSO RICONOSCIUTO')]);if(mode==='foot'&&state?.status==='playing')running=true;}
async function finalConsentScene(){
 running=false;clearControls();await say(STORY.final_glass);
 await holdButton({kicker:'NOX',title:'Il diritto di dire no',text:'Le mani sono tue.',label:'COLPISCI',ms:650});
 state.finalConsent=true;const boss=state.enemies.find(e=>e.boss);if(boss){boss.guard=0;boss.state='recover';boss.clock=0;}state.fireCd=0;state.action=null;
 notice('Archon non può più scegliere per te. Il colpo finale è tuo.');
 running=true;
}
async function beginOpeningWalk(){
 panel('opening',false);mode='loading';await prepareDistrict(0,0,[],true);await chronoArt.prepare(0);
 const l=getLayout('elbow'),def={id:'awakening',layout:'elbow',map:0,kind:0,partner:false,magic:false,hp:1,speed:0,damage:0,cooldown:1,nodes:[],waves:[],start:{x:480,y:1312}};
 state=newRun('nox',0,'power',null,progress.narrative,def);activeMapSurface=buildMapSurface(l,images.city,images.district_props,'#419eb9',chronoArt.get('environment'),0);prepareMapRasters();
 mode='openingWalk';frameInsets=null;panel('hud',true);panel('controls',true);for(const id of ['gun','magic','duo','dash','bag'])panel(id,false);running=true;notice('Muovi Nox verso il vetro. Poi tocca RACCOGLI.');
}
async function startCollapse(){
 running=false;paused=false;uiLock=0;hideGameplay();mode='loading';await prepareDistrict(3,3,[],true);await chronoArt.prepare(3,true);
 const def={id:'collapse',layout:'spine',map:3,kind:3,partner:false,magic:false,hp:1,speed:0,damage:0,cooldown:1,nodes:[],waves:[]};state=Object.assign(newRun('nox',3,'power',null,progress.narrative,def),newCollapse());state.c=def;
 activeMapSurface=buildMapSurface(getLayout('spine'),images.fracture,images.district_props,'#bba1ed',chronoArt.get('environment'),3);prepareMapRasters();frameInsets=null;mode='escape';exploreBusy=false;
 panel('hud',true);panel('controls',true);for(const id of ['gun','magic','duo','dash'])panel(id,false);await say([luluLine('La corona sta cedendo! Ho aperto la passerella. Seguimi!')]);if(settings.sound&&!lifecycleMuted)audioDirector.resume();running=true;
}
function explorationTarget(){
 if(mode==='openingWalk')return {id:'glass',label:'Vetro',x:480,y:1120};
 if(mode==='escape')return {...state.goal,label:'Uscita'};
 const points=hubPoints(progress.world.hub.id,progress);return points.find(p=>p.id===hubTracked)||points.find(p=>p.id==='board');
}
async function updateExploration(dt){
 const input=footInputs();interact=false;pending=null;
 if(mode==='escape'){
  tickCollapse(state,input,dt);
  for(const e of state.events){audio('zara');if(!settings.reduced)shake=6;}
  if(state.status==='failed'){running=false;showResult({tag:'IL PASSAGGIO È ANCORA APERTO',title:'Raggiungi Lulù',text:'Riparti dalla passerella. La battaglia è già vinta.',retry:true});return;}
  if(state.status==='cleared'&&!exploreBusy){exploreBusy=true;running=false;clearControls();await say(STORY.collapse_end);await completeStep();}return;
 }
 const v={x:input.x,y:input.y},n=Math.max(1,Math.hypot(v.x,v.y)),old={x:state.x,y:state.y};
 moveActor(state,v.x/n*205*dt,v.y/n*205*dt);if(Math.hypot(v.x,v.y)>.1)state.face=unit(v);state.walk+=distance(old,state)*.065;state.time+=dt;
 if(mode==='hub'){
  const loc=progress.world.hub;loc.x=state.x;loc.y=state.y;
  const points=hubPoints(loc.id,progress).filter(p=>p.kind!=='target'||HUBS[loc.id].jobs.some(j=>j.targets.includes(p.id)&&progress.world.quests[j.id]?.status==='active'&&!progress.world.quests[j.id].targets.includes(p.id)));
  hubNearest=points.filter(p=>distance(state,p)<90).sort((a,b)=>distance(state,a)-distance(state,b))[0];
  if(input.interact&&hubNearest&&!exploreBusy){exploreBusy=true;clearControls();try{await hubInteract(hubNearest);}finally{exploreBusy=false;}}
 }else if(mode==='openingWalk'&&input.interact&&distance(state,explorationTarget())<85&&!exploreBusy){
  exploreBusy=true;running=false;clearControls();await say([luluLine('A cosa serve?'),noxLine('A niente.')]);applyBeat(progress.narrative,V07_BEATS.glass_pickup);persist();finishOpening();exploreBusy=false;
 }
}
function drawExploration(w,h){
 followCamera(state,w,h);
 drawMapBackdrop(w,0);ctx.save();ctx.scale(camera.scale,camera.scale);ctx.translate(-camera.x,-camera.y);
 const target=explorationTarget();
 if(mode==='hub'){
  const id=progress.world.hub.id;
  for(const p of hubPoints(id,progress)){
   if(p.kind==='target'&&!HUBS[id].jobs.some(j=>j.targets.includes(p.id)&&progress.world.quests[j.id]?.status==='active'&&!progress.world.quests[j.id].targets.includes(p.id)))continue;
   if(p.atlas)drawChronoFrame(ctx,chronoArt.get(p.atlas),chronoAnimation(p.atlas,'idle'),state.time,p.x,p.y,96,false,settings.reduced);
   else if(p.kind==='race'&&images.driving_cars?.naturalWidth){circle(p.x,p.y+6,44,'#00000055');sprite(images.driving_cars,0,1,p.x,p.y+34,96);}
   else{circle(p.x,p.y,24,p.kind==='secret'?'#9d8ab740':'#9ed9ce55');circle(p.x,p.y,18,'#96c8cf',true,2);}
   if(p.kind!=='secret'||distance(state,p)<130||progress.world.secrets.includes(id+':map'))label(p.label,p.x,p.y+32,'#e3eff5',12);
  }
 }else if(mode==='escape'){
  const beat=state.time%2.8;
  for(const hz of state.hazards){circle(hz.x,hz.y,76,beat<1.5?'#ff634333':'#c38dff66');circle(hz.x,hz.y,76*Math.min(1,beat/1.5),'#ff997b',true,3);label(beat<1.5?'CROLLO':'DETRITI',hz.x,hz.y-85,'#fff0df',13);}
  drawHero({x:state.goal.x,y:state.goal.y,walk:0},'lulu',true);
  label('USCITA',state.goal.x,state.goal.y+40,'#b4f5c7',16);
 }else{circle(target.x,target.y,16,'#aff9ff');label('VETRO',target.x,target.y+36);}
 drawHero(state,state.hero);if(target){const waypoint=routeWaypoint(getLayout(state.layoutId),state,target);circle(waypoint.x,waypoint.y,12,'#b5f4e177');}ctx.restore();
 const px=(target.x-camera.x)*camera.scale,py=(target.y-camera.y)*camera.scale,ax=clamp(px,28,w-28),ay=clamp(py,115,h-200);
 circle(ax,ay,16,'#132c3fee');label('◆',ax,ay+5,'#bdffe7',17);
 setText('district',mode==='hub'?HUBS[progress.world.hub.id].name:mode==='escape'?'L’ASSE CROLLA':'DUE COLPI');
 setText('objective',mode==='hub'?'Esplora · '+target.label:mode==='escape'?'Raggiungi Lulù · evita i cerchi rossi':'Muovi Nox · raccogli il vetro');
 if(mode==='hub')showCoins(progress.world.coins);else if(mode==='escape')showHealth(state);else hideHudValues();panel('meter',false);panel('bossbar',false);
 const near=mode==='hub'?hubNearest:mode==='openingWalk'&&distance(state,target)<85;
 panel('interact',!!near);setText('interact',mode==='hub'?'INTERAGISCI':'RACCOGLI');
}

// ---------- Driving ----------
async function startDrive(step,first){
 try{await Promise.all([loadImage('driving_cars'),loadImage('driving_road')]);}catch(e){notice('Guida non caricata: '+e.message);fault(e,'asset',true);return;}
 chronoArt.clear();drive=newDrive(step.drive,progress.cityChoice);state=null;audioDirector.setAmbience('drive');mode='drive';fx=[];halfSaid=lateSaid=false;delete $('city-return').dataset.shown;
 document.body.classList.toggle('lulu-pov',drive.driver==='lulu');
 panel('hud',true);panel('controls',false);panel('driving-controls',true);panel('pulse',drive.mode==='dark');panel('nitro',false);
 if(first)await say(resolveLines(STORY[step.pre],flags()));
 running=true;paused=false;
}
function showDriveResult(){const d=drive,step=CAMPAIGN[progress.step];running=false;clearControls();
 if(d&&d.status==='failed'){progress.stats.deaths++;persist();showResult({tag:'LA CORSA NON È FINITA',title:'Riprova la corsa',text:d.reason,retry:true});return;}
 progress.status='cleared';rewardMission(progress,step.id);persist();
 const text=step.drive===3?'Il camion esce dall’anello. Dietro, i droni perdono la traccia.':step.drive===4?'La Vortex esce dal tunnel. Il posto accanto è ancora vuoto.':'Nox parcheggia la Vortex. Lulù prepara l’equipaggiamento.';
 showResult({tag:'GUIDA COMPLETATA',title:step.drive>2?'Fuori.':'Siete arrivati. Insieme.',text,next:true});}

// ---------- Scenes ----------
let scene=null;
function sceneCast(list){return list.map(a=>({alpha:1,walk:0,row:0,col:0,flip:false,...a}));}
async function playScene(id){chronoArt.clear();
 if(id==='opening'){await runOpening();return;}
 const map=['rooftop','rooftop_end','home'].includes(id)?1:3;
 await prepareDistrict(map,map===1?1:3);
 if(id==='postcredits')await chronoArt.prepare(3,false,['kairn','morrow']);
 scene={map,tint:'#030a14b0',cam:{x:770,y:600},zoom:1.15,cast:sceneCast([{name:'nox',x:715,y:610,row:2},{name:'lulu',x:825,y:610,row:2,flip:true}]),rain:id!=='home'};
 if(id==='home')await say(STORY.home);
 else if(id==='rooftop'){
  await say([luluLine('Lo tieni ancora.'),noxLine('Sì.')]);
  await choose('rooftop_glass');await choose('rooftop_ask');
  await say(STORY.promise_repair);await say(STORY.promise_ask);{const t=await choose('promise_trust');await say(STORY[REACTIONS.promise_trust[t]]);}
  await say(STORY.promise_offer);{const a=await choose('promise_accept');await say(STORY[REACTIONS.promise_accept[a]]);}
  await say([luluLine('Andiamo. Dal clinico chiedono aiuto.')]);
 }else if(id==='separation'){
  await say(STORY.separation);flag('separated',true);persist();
  scene.collapse=true;scene.crack=1;shake=settings.reduced?0:9;audio('zara');
  await moveCast([[0,560],[1,980]],settings.reduced?100:900);scene.cast[0].alpha=0;
  await say(STORY.separation_after);
 }else if(id==='reunion'){
  await say(resolveLines(STORY.reunion_open,flags()));const tier=reunionTier(progress.narrative.thermal);flag('reunion_tier',tier);
  await say(STORY['reunion_'+tier]);flag('reunited',true);persist();
 }else if(id==='aftermath'){
  await say(STORY.aftermath);
  for(const [hub,h] of Object.entries(HUBS))await say([systemLine(h.name),storyLine('',h.epilogue),...(h.jobs.filter(j=>flags()[j.id]).map(j=>storyLine('',j.finish)))]);
 }else if(id==='rooftop_end'){
  await say(STORY.rooftop_end);const hand=await choose('hand');
  await say([storyLine('',hand==='take'?'Nox prende la mano di Lulù.':'Nox si siede accanto a lei. La mano resta lì.')]);flag('story_complete',true);persist();
 }else if(id==='credits'){
  await say([systemLine('CHRONOS ADVENTURE: NOX & LULÚ · FINE DELLA STORIA PRINCIPALE'),storyLine('','Un gioco di jaguarzcreatorz. Nox e Lulù hanno scelto la propria strada.'),systemLine('TITOLI DI CODA')]);
  await wait(settings.reduced?500:2500);
 }else if(id==='postcredits'){
  scene.cast=[];scene.strangers=true;await say(STORY.postcredits);flag('postcredits_seen',true);persist();
 }
 scene=null;
}
function moveCast(moves,ms){return new Promise(resolve=>{const start=performance.now(),from=moves.map(([i])=>scene.cast[i].x);const step=t=>{if(!scene)return resolve();const k=Math.min(1,(t-start)/ms);moves.forEach(([i,to],j)=>{const a=scene.cast[i];a.x=from[j]+(to-from[j])*k;a.walk=k*ms/140;a.col=k<1?Math.floor(a.walk)%4:0;});if(k<1)requestAnimationFrame(step);else resolve();};requestAnimationFrame(step);});}
// The opening is the first input of the game: two knocks, answered.
let openingResolve=null,openingKnocks=0,openingStage=0;
function runOpening(){mode='scene';panel('opening',true);openingKnocks=0;openingStage=0;$('opening-surface').hidden=false;$('opening-choice').hidden=true;$('opening-glass').hidden=true;$('opening-crack').className='';localeView.write($('opening-title'),'...');localeView.write($('opening-prompt'),'Se mi senti, batti due volte.');$('opening-count').className='';$('opening-skip').hidden=!memo('city-opening-seen-v8');$('opening-surface').focus();return new Promise(r=>openingResolve=r);}
function finishOpening(){running=false;hideGameplay();panel('opening',false);mode='scene';state=null;remember('city-opening-seen-v8');persist();const r=openingResolve;openingResolve=null;r?.();}
$('opening-surface').onclick=()=>{if(!openingResolve)return;openingKnocks=Math.min(2,openingKnocks+1);$('opening-count').className=openingKnocks===1?'one':'two';const surface=$('opening-surface');surface.classList.remove('thud');void surface.offsetWidth;surface.classList.add('thud');audio('knock');
 if(openingKnocks===1){localeView.write($('opening-prompt'),'…');return;}
 applyBeat(progress.narrative,V07_BEATS.opening_two_knocks);persist();$('opening-crack').className='open';
 setTimeout(()=>{if(!openingResolve)return;$('opening-surface').hidden=true;$('opening-choice').hidden=false;localeView.write($('opening-title'),'ARIA.');localeView.write($('opening-copy'),'Il coperchio si apre. Una ragazza con la giacca verde ti guarda come se avesse corso fin qui. Sulla parete interna: EVE-47 · NOX SERIES. «È il tuo nome?»');localeView.write($('opening-name'),'«Era sulla cassa.»');$('opening-name').focus();},650);};
$('opening-name').onclick=()=>{if(!openingResolve)return;
 if(openingStage===0){openingStage=1;localeView.write($('opening-copy'),'«Non è la stessa cosa.»');localeView.write($('opening-name'),'«Adesso sì.»');return;}
 applyBeat(progress.narrative,V07_BEATS.opening_name);persist();beginOpeningWalk();};
$('opening-pick').onclick=()=>{if(!openingResolve)return;applyBeat(progress.narrative,V07_BEATS.glass_pickup);persist();audio('choice');$('opening-pick').hidden=true;localeView.write($('opening-title'),'—');localeView.write($('opening-glass').querySelector('p'),'«A cosa serve?» «A niente.» Nox lo tiene.');setTimeout(()=>{if(openingResolve)finishOpening();},1300);};
$('opening-skip').onclick=()=>{if(!openingResolve)return;for(const beat of [V07_BEATS.opening_two_knocks,V07_BEATS.opening_name,V07_BEATS.glass_pickup])applyBeat(progress.narrative,beat);finishOpening();};

// ---------- Ending ----------
function showEnding(){mode='ending';state=null;drive=null;scene=null;running=false;hideGameplay();$('ending').style.setProperty('--ending-art',`url('art/v09/${reunionTier(progress.narrative.thermal)}.svg')`);audioDirector.setAmbience(null);remember('city-complete-v1');soundtrack('reunion');const f={...flags(),__races:progress.world?.races},list=$('epilogue');list.textContent='';
 for(const line of EPILOGUE){const li=document.createElement('li');localeView.write(li,line(f));list.appendChild(li);}
 localeView.write($('ending-line'),'Nox e Lulù hanno scelto la propria strada. Chronos Adventure continua con Chrono Shadows.');$('ending-line').classList.remove('on');$('credits').classList.remove('on');panel('ending',true);
 [...list.children].forEach((li,i)=>{li.classList.remove('on');setTimeout(()=>li.classList.add('on'),600+i*1500);});
 setTimeout(()=>$('ending-line').classList.add('on'),600+EPILOGUE.length*1500);setTimeout(()=>$('credits').classList.add('on'),1600+EPILOGUE.length*1500);}
$('ending-explore').onclick=()=>openHub('moon','epilogue','nox');
$('ending-menu').onclick=()=>{panel('ending',false);showMenu();};

// ---------- Menu & studio ----------
function showMenu(){chronoArt.clear();mode='menu';running=false;paused=false;state=null;drive=null;scene=null;uiLock=0;hideGameplay();panel('opening',false);panel('menu',true);saved=readSave();progress=null;
 const c=$('continue');c.hidden=!saved;if(saved){const step=CAMPAIGN[saved.step],name=step.type==='foot'?FOOT[step.id].name:step.type==='drive'?DRIVING_MISSIONS[step.drive].title:step.title;c.innerHTML='<span></span><small></small>';localeView.write(c.querySelector('span'),'Continua');localeView.write(c.querySelector('small'),(step.id==='postcredits'&&saved.status==='cleared'?'Storia completata · rivedi il finale':ACTS[step.act].split(' · ')[0]+' · '+name));}
 let legacy=false;try{legacy=LEGACY_STORES.some(key=>localStorage.getItem(key));}catch{}panel('legacy-note',legacy);
 if(saveSource==='backup')notice('Salvataggio danneggiato: disponibile una copia di recupero.');
 else if(saveSource==='corrupt')notice('Salvataggio non recuperabile. I dati precedenti sono conservati.');
 else if(saveSource==='unavailable')notice('Salvataggi non disponibili su questo dispositivo.');
 if(settings.sound&&!lifecycleMuted)audioDirector.resume();audioDirector.setAmbience(null);soundtrack('title');}
$('start').onclick=()=>{if(!loaded)return;if(saved){panel('restart',true);$('confirm-new').focus();return;}newGame();};
$('confirm-new').onclick=()=>{panel('restart',false);newGame();};$('cancel-new').onclick=()=>panel('restart',false);
$('continue').onclick=()=>{if(loaded&&saved)continueGame();};
$('menu-settings').onclick=()=>{panel('pause-panel',true);panel('restart-mission',false);panel('menu-return',false);localeView.write($('resume'),'Chiudi');$('resume').focus();};
function playStudio(){return new Promise(resolve=>{
 try{if(sessionStorage.getItem('city-studio-shown')){resolve();return;}sessionStorage.setItem('city-studio-shown','1');}catch{}
 const el=$('studio'),video=$('studio-video'),sound=$('studio-sound');let done=false,timer;
 const end=()=>{if(done)return;done=true;clearTimeout(timer);video.pause();video.removeAttribute('src');video.load();video.hidden=true;el.classList.remove('video-playing');video.onended=video.onerror=null;window.removeEventListener('blur',end);document.removeEventListener('visibilitychange',hidden);$('studio-skip').onclick=sound.onclick=null;panel('studio',false);resolve();};
 const hidden=()=>{if(document.hidden)end();};
 panel('studio',true);$('studio-skip').onclick=end;window.addEventListener('blur',end);document.addEventListener('visibilitychange',hidden);
 if(settings.reduced){sound.hidden=true;timer=setTimeout(end,1200);return;}
 video.src=matchMedia('(min-width:900px)').matches?'video/jaguarzcreatorz-1080.mp4':'video/jaguarzcreatorz-720.mp4';video.hidden=false;el.classList.add('video-playing');video.muted=true;sound.hidden=!settings.sound;
 sound.onclick=()=>{video.muted=!video.muted;sound.textContent=video.muted?'Attiva audio / Enable sound':'Disattiva audio / Mute';};
 video.onended=end;video.onerror=()=>{video.hidden=true;el.classList.remove('video-playing');sound.hidden=true;clearTimeout(timer);timer=setTimeout(end,1200);};
 timer=setTimeout(end,8500);video.play().catch(()=>{if(!done)video.onerror?.();});
 });}

$('language').value=settings.language;
$('language').onchange=()=>{settings.language=$('language').value==='en'?'en':'it';try{localStorage.setItem('city-v4-settings',JSON.stringify(settings));}catch{}localeView.setLanguage(settings.language);for(const key of Object.keys(textCache))delete textCache[key];};

// ---------- Pause & lifecycle ----------
function canPause(){return running&&!uiLock&&(mode==='foot'||mode==='drive'||mode==='race'||mode==='hub'||mode==='escape'||mode==='openingWalk');}
function setPause(v){if(v&&!canPause())return;if(!v&&!paused)return;paused=v;clearControls();panel('pause-panel',v);panel('restart-mission',mode==='foot'||mode==='drive'||mode==='escape');panel('menu-return',true);localeView.write($('resume'),'Riprendi');if(v){persist();audioDirector.pause();$('resume').focus();}else if(settings.sound)audioDirector.resume(true);}
$('pause').onclick=()=>setPause(true);
$('resume').onclick=()=>{if(mode==='menu'){panel('pause-panel',false);return;}setPause(false);};
$('restart-mission').onclick=()=>{paused=false;panel('pause-panel',false);restartMission();};
$('menu-return').onclick=()=>{persist();runId++;showMenu();};
for(const id of ['sound','reduced','haptics']){$(id).checked=settings[id];$(id).onchange=()=>{settings[id]=$(id).checked;document.body.classList.toggle('reduced-motion',settings.reduced);try{localStorage.setItem('city-v4-settings',JSON.stringify(settings));}catch{}audioDirector.enabled=settings.sound;if(!settings.sound||paused||lifecycleMuted||document.hidden)audioDirector.pause();else audioDirector.resume(true);};}
function suspend(){clearControls();cancelHold?.();lifecycleMuted=true;if(progress&&!faultShown)persist();if(canPause())setPause(true);silence();}
function restoreForeground(){if(!lifecycleMuted)return;lifecycleMuted=false;if(settings.sound&&!paused&&!document.hidden&&mode!=='boot'&&!faultShown)audioDirector.resume();}
window.addEventListener('blur',suspend);window.addEventListener('focus',restoreForeground);window.addEventListener('pagehide',suspend);
window.addEventListener('citynativepause',suspend);window.addEventListener('citynativeresume',restoreForeground);
document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend();else restoreForeground();});

// ---------- Input ----------
let keys=new Set(),stick={x:0,y:0,id:null},aimTouch=null,pending=null,interact=false,dash=false,special=false,pulse=false,weaponChange=false,weaponReload=false;
const drivingPointers={accelerate:new Set(),brake:new Set()},drivingKeys=new Set();
// Gamepad (D27/N2): read once per frame after the browser reports a pad; without one nothing here runs.
let gamepadSeen=false,gamepadState={move:{x:0,y:0},aim:null,held:{},armed:{}},gamepadAim=null;
function clearControls(){floatOrigin=null;$('float-stick').hidden=true;for(const held of Object.values(drivingPointers))held.clear();drivingKeys.clear();keys.clear();stick={x:0,y:0,id:null};aimTouch=null;pending=null;interact=dash=special=pulse=weaponChange=weaponReload=false;gamepadState.armed={};gamepadAim=null;$('knob').style.transform='';$('drive-knob').style.transform='';hitstops.clear();if(state)clearInputBuffer(state);}
const oneShotActions={'weapon-change':()=>weaponChange=true,'weapon-reload':()=>weaponReload=true,interact:()=>interact=true,dash:()=>dash=true,duo:()=>special=true,pulse:()=>pulse=true};
for(const [id,queue] of Object.entries(oneShotActions)){const button=$(id),act=()=>{if(running&&!paused&&!uiLock)queue();};if(PRESS_ACTIONS.has(id))button.onpointerdown=button.onclick=e=>{if(e.button>0||!pressQueues(e.type,e.detail))return;e.preventDefault();act();};else button.onclick=act;for(const event of ['keydown','keyup'])button.addEventListener(event,e=>{if(isActivationKey(e.code))e.stopPropagation();});}
for(const kind of ['gun','magic']){const b=$(kind);b.onpointerdown=e=>{if(!running||paused||uiLock||aimTouch||mode!=='foot'||state?.status!=='playing')return;e.preventDefault();b.setPointerCapture(e.pointerId);aimTouch={id:e.pointerId,kind,x:e.clientX,y:e.clientY,dir:null};};b.onpointermove=e=>{if(aimTouch?.id!==e.pointerId)return;const d={x:e.clientX-aimTouch.x,y:e.clientY-aimTouch.y};aimTouch.dir=Math.hypot(d.x,d.y)>12?unit(d):null;};b.onpointerup=e=>{if(aimTouch?.id===e.pointerId){pending={kind,dir:aimTouch.dir};aimTouch=null;}};for(const ev of ['pointercancel','lostpointercapture'])b.addEventListener(ev,e=>{if(aimTouch?.id===e.pointerId)aimTouch=null;});b.onkeydown=e=>{if(!isActivationKey(e.code))return;e.preventDefault();e.stopPropagation();if(!e.repeat)pending={kind,dir:null};};b.onkeyup=e=>{if(isActivationKey(e.code))e.stopPropagation();};}
const stickEl=$('stick');function updateStick(e){const r=stickEl.getBoundingClientRect(),v=radialControlVector(e.clientX-r.left-r.width/2,e.clientY-r.top-r.height/2);stick.x=v.x;stick.y=v.y;$('knob').style.transform=v.x||v.y?`translate(${v.x*32}px,${v.y*32}px)`:'';}
stickEl.onpointerdown=e=>{if(stick.id!==null)return;e.preventDefault();stick.id=e.pointerId;stickEl.setPointerCapture(e.pointerId);updateStick(e);};stickEl.onpointermove=e=>{if(stick.id===e.pointerId)updateStick(e);};for(const ev of ['pointerup','pointercancel','lostpointercapture'])stickEl.addEventListener(ev,e=>{if(stick.id===e.pointerId){stick={x:0,y:0,id:null};$('knob').style.transform='';}});
for(const id of ['accelerate','brake']){const button=$(id),pointers=drivingPointers[id];button.onpointerdown=e=>{e.preventDefault();button.setPointerCapture(e.pointerId);pointers.add(e.pointerId);};for(const ev of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(ev,e=>pointers.delete(e.pointerId));button.onkeydown=e=>{if(!isActivationKey(e.code))return;e.preventDefault();e.stopPropagation();drivingKeys.add(id);};button.onkeyup=e=>{if(!isActivationKey(e.code))return;e.preventDefault();e.stopPropagation();drivingKeys.delete(id);};}
{const b=$('nitro');b.onpointerdown=e=>{e.preventDefault();if(running&&!paused&&!uiLock&&mode==='race')nitroQueued=true;};b.onkeydown=e=>{if(!isActivationKey(e.code))return;e.preventDefault();e.stopPropagation();if(running&&!paused&&!uiLock&&mode==='race')nitroQueued=true;};b.onkeyup=e=>{if(isActivationKey(e.code))e.stopPropagation();};}
// Floating stick: a finger anywhere on the open map steers (driving) or moves (on foot). The ring appears
// under the finger and follows it past its edge, so turning back is always one short move.
const floatEl=$('float-stick');let floatOrigin=null;
function floatKind(){if(['race','drive'].includes(mode))return $('driving-controls').hidden?null:'axis';if(['foot','hub','escape','openingWalk'].includes(mode))return $('controls').hidden?null:'radial';return null;}
function floatMove(e){const axis=floatOrigin.kind==='axis',R=axis?56:46;let dx=e.clientX-floatOrigin.x,dy=axis?0:e.clientY-floatOrigin.y;const d=Math.hypot(dx,dy);
 if(d>R){floatOrigin.x+=dx*(1-R/d);floatOrigin.y+=dy*(1-R/d);dx=e.clientX-floatOrigin.x;dy=axis?0:e.clientY-floatOrigin.y;floatEl.style.left=floatOrigin.x+'px';floatEl.style.top=floatOrigin.y+'px';}
 if(axis){stick.x=axialControlValue(dx,5,R);stick.y=0;$('drive-knob').style.transform=stick.x?`translateX(${stick.x*28}px)`:'';}else{const v=radialControlVector(dx,dy,8,R);stick.x=v.x;stick.y=v.y;$('knob').style.transform=v.x||v.y?`translate(${v.x*32}px,${v.y*32}px)`:'';}
 floatEl.firstElementChild.style.transform=`translate(${dx}px,${dy}px)`;}
function floatEnd(e){if(stick.id!==e.pointerId||!floatOrigin)return;stick={x:0,y:0,id:null};floatOrigin=null;floatEl.hidden=true;$('drive-knob').style.transform='';$('knob').style.transform='';}
canvas.onpointerdown=e=>{const kind=floatKind();if(!kind||!running||paused||uiLock||stick.id!==null)return;e.preventDefault();stick.id=e.pointerId;try{canvas.setPointerCapture(e.pointerId);}catch{}floatOrigin={x:e.clientX,y:e.clientY,kind};floatEl.classList.toggle('axis',kind==='axis');floatEl.style.left=e.clientX+'px';floatEl.style.top=e.clientY+'px';floatEl.hidden=false;floatMove(e);};
canvas.onpointermove=e=>{if(floatOrigin&&stick.id===e.pointerId)floatMove(e);};
for(const ev of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(ev,floatEnd);
for(const id of ['accelerate','brake','nitro']){const b=$(id);b.addEventListener('pointerdown',()=>b.classList.add('held'));for(const ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>b.classList.remove('held'));}
const wheel=$('drive-stick');function driveStick(e){const r=wheel.getBoundingClientRect();stick.x=axialControlValue(e.clientX-r.left-r.width/2);$('drive-knob').style.transform=stick.x?`translateX(${stick.x*28}px)`:'';}
wheel.onpointerdown=e=>{if(stick.id!==null)return;e.preventDefault();stick.id=e.pointerId;wheel.setPointerCapture(e.pointerId);driveStick(e);};wheel.onpointermove=e=>{if(stick.id===e.pointerId)driveStick(e);};for(const ev of ['pointerup','pointercancel','lostpointercapture'])wheel.addEventListener(ev,e=>{if(stick.id===e.pointerId){stick={x:0,y:0,id:null};$('drive-knob').style.transform='';}});
window.addEventListener('keydown',e=>{if(e.code==='Escape'){if(paused)setPause(false);else setPause(true);return;}if(!running||paused||uiLock)return;if(e.code==='KeyH'){e.preventDefault();if(!e.repeat)activateMedicine();return;}if(GAME_KEYS.has(e.code)){e.preventDefault();keys.add(e.code);}});window.addEventListener('keyup',e=>keys.delete(e.code));
function footInputs(){const move=movementVector({x:stick.x+gamepadState.move.x,y:stick.y+gamepadState.move.y},keys);return {x:move.x,y:move.y,aim:pending?.dir,switchWeapon:weaponChange||keys.has('KeyV'),reload:weaponReload||keys.has('KeyR'),gun:pending?.kind==='gun'||keys.has('KeyJ')||keys.has('Space'),magic:pending?.kind==='magic'||keys.has('KeyL'),dash:dash||keys.has('ShiftLeft'),duo:special||keys.has('KeyQ'),interact:interact||keys.has('KeyE')};}
// Gamepad, W3C standard mapping (D27/N2). Movement and buttons feed the same flags as touch and keyboard:
// SCHIVA, DUO, ATTIVA, cambio arma, ricarica e cura on press; SPARA and PULSE on release, aimed by the right stick
// (automatic aim below its deadzone), with the same dashed preview as a touch drag. Start toggles pause.
function pollGamepad(){
 const read=readGamepad(pickGamepad(typeof navigator.getGamepads==='function'?navigator.getGamepads():[]));
 if(!read){gamepadState={move:{x:0,y:0},aim:null,held:{},armed:{}};gamepadAim=null;return;}
 const {pressed,released}=padEdges(gamepadState.held,read.held),armed=gamepadState.armed;gamepadState={...read,armed};
 if(pressed.includes('pause')){if(paused)setPause(false);else setPause(true);}
 if(!running||paused||uiLock){gamepadState.armed={};gamepadState.move={x:0,y:0};gamepadAim=null;return;}
 const combat=mode==='foot'&&state?.status==='playing';
 for(const action of pressed){if(action==='dash')dash=true;else if(action==='duo')special=true;else if(action==='interact')interact=true;else if(action==='switchWeapon')weaponChange=true;else if(action==='reload')weaponReload=true;else if(action==='heal')activateMedicine();else if((action==='gun'||action==='magic')&&combat)armed[action]=true;}
 for(const action of released)if((action==='gun'||action==='magic')&&armed[action]){armed[action]=false;if(combat)pending={kind:action,dir:read.aim};}
 gamepadAim=combat&&(armed.gun||armed.magic)?{kind:armed.gun?'gun':'magic',dir:read.aim}:null;}
window.addEventListener('gamepadconnected',()=>{gamepadSeen=true;});window.addEventListener('gamepaddisconnected',()=>{if(gamepadSeen)pollGamepad();});

// ---------- Gameplay events ----------
function burst(x,y,color,count=15,speed=160){for(let i=0;i<count&&fx.length<200;i++){const a=i/count*Math.PI*2+Math.random()*.4;fx.push({type:'spark',x,y:y-28,vx:Math.cos(a)*speed*(.5+Math.random()),vy:Math.sin(a)*speed,life:.3+Math.random()*.25,max:.55,color});}}
function floatText(x,y,text,color,life=.6){fx.push({type:'text',x,y,text,life,max:life,color});}
async function clinicEvent(){running=false;clearControls();const companion=state.partner;state.partner=null;state.clinicSplit=true;
 await say(resolveLines(STORY.clinic_auth,flags()));
 await holdButton({kicker:'TERMINALE DI LULÙ',title:'Autenticazione EVE-47',text:'Diciannove persone dietro la porta. Nox è sotto attacco e non può risponderti.',label:'TIENI PREMUTO PER TRASMETTERE'});
 flag('eve_signature_exposed',true);persist();shake=settings.reduced?0:6;
 await say(resolveLines(STORY.clinic_after,flags()));
 flag('clinic_auth_complete',true);state.clinicSplit=false;state.partner=companion;persist();
 bark('after');setTimeout(()=>bark('afterb'),3500);if(mode==='foot'&&state?.status==='playing')running=true;}
const chronoFxPool=Array.from({length:16},()=>({life:0}));
function spawnChronoFx(id,x,y){if(settings.reduced&&id==='finish_flash')return;const f=chronoFxPool.find(f=>f.life<=0);if(!f)return;Object.assign(f,{id,x,y,life:.34,max:.34});}
// G1: the pose is taken after the tick; an impact and a down in the same tick keep the first pose and the longer hold.
function holdPose(e){const hold=hitstopFrames(e)*HITSTOP_FRAME,a=hold&&state.enemies.find(x=>x.id===e.id);if(!a)return;const old=hitstops.get(e.id),same=old?.at===state.time;
 hitstops.set(e.id,{at:state.time,t:Math.max(hold,same?old.t:0),flash:HITSTOP_FRAME,pose:same?old.pose:{state:a.state,clock:a.clock,windup:a.windup,walk:a.walk,hurtAnim:a.hurtAnim,deathAnim:a.deathAnim,face:a.face}});}
function eventFx(e){holdPose(e);
 const id={impact:'impact',shot:'muzzle_flash',magic:'energy_burst',node:'chrono_rings',bossPhase:'chrono_rings',down:e.boss?'gear_debris':'debris'}[e.type];
 const fxTarget=Number.isFinite(e.x)?e:e.type==='bossPhase'?state.enemies.find(actor=>actor.boss):null;
 if(id&&fxTarget&&Number.isFinite(fxTarget.y))spawnChronoFx(id,fxTarget.x,fxTarget.y-28);
 if(e.type==='bossWake')audioDirector.sfx('suspense_boss');
 if(['rookAim','rookShot','rookMine','mineDisarmed','mineBurst'].includes(e.type))audioDirector.sfx(e.type);
if(e.type==='weaponSwitch'){flag('weapon.active.'+state.hero,e.weapon);if(!flags()['weapon.lesson.'+state.hero]){flag('weapon.lesson.'+state.hero,true);notice(e.weapon==='r12'?'R-12: avvicinati per concentrare la rosata.':'VX-9: una pressione, tre colpi.');}persist();audioDirector.sfx('weaponSwitch');}
 if(e.type==='reload')audioDirector.sfx('weaponReload');
 if(e.type==='quickdrawReady')audioDirector.sfx('quickdrawReady');
 if(e.type==='quickdrawShot')floatText(state.x,state.y-130,'QUICKDRAW','#ffe5a8',.6);
const effect={impact:'impact',down:e.boss?'boss_collapse':'impact',barrier:'barrier',overdrive:'pulse',shotBlocked:'barrier',alarm:'alarm',node:'node',partnerJoin:'choice'}[e.type];if(effect)audioDirector.sfx(effect);const s=state,color=s.hero==='nox'?'#6bddff':'#ff72d9';
 if(e.type==='shot'&&e.wall&&images['vfx_'+e.weapon]?.naturalWidth)fx.push({type:'vfx',im:images['vfx_'+e.weapon],row:2,x:e.to.x,y:e.to.y-32,life:.3,max:.3});
 if(e.type==='shot'||e.type==='magic'){fx.push({type:'beam',x:e.x,y:e.y-32,to:{x:e.to.x,y:e.to.y-32},life:e.type==='magic'?.28:.12,max:.28,color,area:e.area,dir:e.dir,magic:e.type==='magic'});burst(e.x+e.dir.x*35,e.y+e.dir.y*35,color,e.type==='magic'?22:8,120);if(!settings.reduced)shake=Math.max(shake,e.type==='magic'?5:1.2);if(e.weapon&&e.weapon!=='c9')audioDirector.sfx(e.weapon==='vx9'?'vx9Shot':'r12Shot');else audio(e.type==='magic'?'duo':'hit');if(tutorial?.step==='shoot'&&e.type==='shot')advanceTutorial('dodge');}
 else if(e.type==='partnerShot'){fx.push({type:'beam',x:e.x+(e.to.x<e.x?-40:40),y:e.y-52,to:{x:e.to.x,y:e.to.y-32},life:.1,max:.1,color:e.ally==='morrow'?'#ffcf8a':s.hero==='nox'?'#ff72d9':'#6bddff'});if(e.ally==='morrow')audioDirector.sfx('morrowShot');}
 else if(e.type==='allyStrike'){spawnChronoFx('impact',e.to.x,e.to.y-28);if(!settings.reduced)shake=Math.max(shake,1.5);audioDirector.sfx(e.move==='saw'?'morrowSaw':'kairnImpact');}
 else if(e.type==='impact'){const im=e.source==='gun'&&s.arsenal&&images['vfx_'+s.arsenal.active];fx.push(im?.naturalWidth?{type:'vfx',im,row:1,x:e.x,y:e.y-34,life:.28,max:.28}:{type:'atlas',row:s.hero==='nox'?0:1,x:e.x,y:e.y-20,life:.3,max:.3});burst(e.x,e.y,color,10);floatText(e.x,e.y-70,String(e.amount),e.boss?'#f6e2a6':color);}
 else if(e.type==='down'){if(e.moor)audioDirector.sfx('anchorCut');burst(e.x,e.y,'#ffda88',e.boss?60:24,e.boss?260:190);if(e.boss&&!settings.reduced){shake=10;focusTime=.4;}}
 else if(e.type==='mineBurst'||e.type==='mineDisarmed'){fx.push({type:'ring',x:e.x,y:e.y,r:e.r||32,life:.35,max:.35,color:e.type==='mineDisarmed'?'#69f6ef':'#ffb74b'});}
 else if(e.type==='rookShot'){fx.push({type:'flash',x:e.x,y:e.y-34,life:.12,max:.12,color:'#ffcf8a'});}
 else if(e.type==='enemyAttack'){fx.push({type:'ring',x:e.x,y:e.y,r:e.r,life:.3,max:.3,color:'#ff765e'});if(e.bossKind==='anchor'){audioDirector.sfx('anchorWeight');if(!settings.reduced)shake=Math.max(shake,5);}}
 else if(e.type==='enemyShot'){fx.push({type:'flash',x:e.x,y:e.y-34,life:.12,max:.12,color:'#ffcf8a'});}
 else if(e.type==='shotBlocked'){burst(e.x,e.y+20,'#ff9fe6',6,80);}
 else if(e.type==='duo'){burst(e.x,e.y,'#b9fff1',32,210);fx.push({type:'ring',x:e.x,y:e.y,r:280,life:.65,max:.65,color:'#aafff4'});audio('choice');if(!settings.reduced)shake=7;}
 else if(e.type==='overdrive'){burst(e.x,e.y,'#ff4a6a',40,240);fx.push({type:'ring',x:e.x,y:e.y,r:200,life:.6,max:.6,color:'#ff4a6a'});floatText(e.x,e.y-100,'BLACK PULSE','#ff8a9a',.9);}
 else if(e.type==='heat'){floatText(s.x,s.y-100,'SURRISCALDATO','#ffb0a0',.9);}
 else if(e.type==='barrier'){burst(e.x,e.y,'#ff7fd8',18,120);}
 else if(e.type==='node'){burst(e.x,e.y,'#b9fff1',32,210);fx.push({type:'ring',x:e.x,y:e.y,r:80,life:.65,max:.65,color:'#aafff4'});audio(s.mission==='exp_chalk_marks'?'chalk':'choice');
  if(s.mission==='blackout'&&e.firstActive&&applyBeat(progress.narrative,V07_BEATS.blackout_helios_clue)){persist();relayRecognition();}
  if(tutorial?.step==='interact')finishTutorial();
  bark('node'+e.count);setTimeout(()=>bark('node'+e.count+'b'),3200);
  if(s.c.midEvent&&e.count===s.c.midEvent.atNode){if(s.c.midEvent.id==='clinic_auth'&&!flags().clinic_auth_complete)clinicEvent();else if(s.c.midEvent.id==='strangers'&&!flags().strangers_met)meetStrangers();}}
 else if(e.type==='channel'){audio('dodge');}
 else if(e.type==='channelBroken'){notice('Interrotto: resta vicino al dispositivo.');}
 else if(e.type==='hurt'){lastHurt=e.source;haptic(35);if(!settings.reduced)shake=5;audio('zara');if(s.hp<=3&&!lowHpWarned){lowHpWarned=true;bark('lowHp');}}
 else if(e.type==='dash'){audio('dodge');burst(s.x,s.y,color,10,50);if(tutorial?.step==='dodge')advanceTutorial('interact');}
 else if(e.type==='perfectDodge'){haptic(e.shift?[15,30,15]:20);if(!settings.reduced&&!e.shift)focusTime=.16;fx.push({type:'ring',x:e.x,y:e.y,r:105,life:.32,max:.32,color:'#e8fbff'});floatText(e.x,e.y-76,'PERFETTA','#e8fbff',.55);audio('dodge');bark('perfect');}
 else if(e.type==='counter'){floatText(s.x,s.y-90,'CONTRATTACCO','#fff2bd',.5);burst(s.x,s.y,'#fff2bd',14,150);}
 else if(e.type==='silent'){floatText(e.x,e.y-80,'SILENZIOSO','#d6c6ff',.6);bark('silent');}
 else if(e.type==='alarm'){notice('Allarme! Le pattuglie ti cercano.');bark('alarm');}
 else if(e.type==='wave'){notice(e.index===1?'Rinforzi in arrivo.':'Un’altra ondata.');bark('wave'+e.index);}
 else if(e.type==='bossWake'){progress.checkpoint='boss';const ok=persist();notice(BOSS_NAMES[e.kind]+(e.kind==='mirror'?' si è svegliata.':' si è svegliato.')+(ok?' Checkpoint salvato.':''));bark('bossWake');setTimeout(()=>bark('bossWakeb'),2800);if(!settings.reduced)shake=8;soundtrack('danger');}
 else if(e.type==='bossPhase'){bark('phase'+e.phase);setTimeout(()=>bark('phase'+e.phase+'b'),3000);}
 else if(e.type==='adapt'){floatText(e.x,e.y-140,'PREVEDIBILE','#ff8a8a',1);notice('EVE-Prime ha letto il tuo ritmo: schiva per contrattaccare o usa l’impulso.');bark('adapt');}
 else if(e.type==='guarded'){floatText(e.x,e.y-110,e.moored?'ORMEGGIATO':'PARATO','#ff8a8a',.4);}
 else if(e.type==='anchorMoored'){notice('The Anchor tiene ferma la breccia con tre cime. Tagliale (la Risonanza ne taglia una subito), poi colpisci il nucleo.');audioDirector.sfx('anchorMoor');}
 else if(e.type==='anchorExposed'){floatText(e.x,e.y-130,'NUCLEO ESPOSTO','#ffd48a',.9);audioDirector.sfx('anchorExposed');if(!settings.reduced)shake=Math.max(shake,4);}
 else if(e.type==='anchorShielded'){floatText(e.x,e.y-130,'DI NUOVO ORMEGGIATO','#9fe9ff',.7);}
 else if(e.type==='anchorRelink'){audioDirector.sfx('anchorRelink');burst(e.x,e.y-40,'#9fe9ff',10,90);}
 else if(e.type==='anchorSweepWarn'){audioDirector.sfx('anchorTension');}
 else if(e.type==='anchorSweep'){audioDirector.sfx('anchorSweep');if(images.anchor_sweep?.naturalWidth)for(const u of e.dirs||[])fx.push({type:'lane',x:e.x,y:e.y-20,a:Math.atan2(u.y,u.x),length:e.length,life:.32,max:.32});if(!settings.reduced)shake=Math.max(shake,6);}
 else if(e.type==='guardBroken'){floatText(e.x,e.y-120,'GUARDIA ROTTA','#fff2bd',.7);}
 else if(e.type==='partnerJoin'){burst(e.x,e.y,'#ff7fd8',40,220);fx.push({type:'ring',x:e.x,y:e.y,r:160,life:.8,max:.8,color:'#ff7fd8'});configureControls();panel('duo',true);bark('join');setTimeout(()=>bark('joinb'),3000);notice('DUO riattivato.');}
 else if(e.type==='blocked'){if(!eventFx.blockedAt||s.time-eventFx.blockedAt>2.5){eventFx.blockedAt=s.time;notice('Allontana i nemici dal dispositivo prima di attivarlo.');}}
 else if(e.type==='finalConsent')finalConsentScene();
 else if(e.type==='failed'||e.type==='cleared')onFootEnd();}
function advanceTutorial(next){if(!tutorial)return;tutorial.step=next;tutorial.slow=false;}
function finishTutorial(){tutorial=null;remember('city-tutorial-v8');panel('hint',false);for(const id of ['stick','gun','dash','interact'])$(id).classList.remove('pulse-hint');}
function updateTutorial(){if(!tutorial||!state)return;const s=state;let text='',target=null;
 if(tutorial.step==='move'){text='Trascina il cerchio a sinistra per muoverti';target='stick';if(distance(s,tutorial.from)>90)advanceTutorial('shoot');}
 else if(tutorial.step==='shoot'){const e=s.enemies.find(e=>e.hp>0&&distance(s,e)<GUN_RANGE+40);if(e){text='Tocca SPARA: la mira è automatica';target='gun';}}
 else if(tutorial.step==='dodge'){const e=s.enemies.find(e=>e.hp>0&&e.state==='warn'&&!e.ranged&&e.target&&distance(s,e.target)<e.attackRadius+10);if(e){text='Il cerchio rosso sta per colpire: SCHIVA!';target='dash';tutorial.slow=true;if(e.clock>e.windup-.06)s.inv=Math.max(s.inv,.12);}else{tutorial.slow=false;if(s.time>40)advanceTutorial('interact');}}
 else if(tutorial.step==='interact'){const n=s.nodes.find(n=>!n.on&&distance(s,n)<85);if(n){text='Tocca ATTIVA e resta vicino al relè';target='interact';}else{const goal=s.nodes.find(n=>!n.on);if(goal&&!s.enemies.some(e=>e.hp>0)){text='Segui la freccia fino al relè';}}}
 for(const id of ['stick','gun','dash','interact'])$(id).classList.toggle('pulse-hint',id===target);
 panel('hint',!!text);if(text)localeView.write($('hint').firstElementChild,text);}

// ---------- Rendering ----------
function circle(x,y,r,color,stroke=false,width=2){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(stroke){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}else{ctx.fillStyle=color;ctx.fill();}}
function line(x,y,a,b,color,width=2){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(a,b);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
function label(t,x,y,color='#e9f5ff',size=13){ctx.fillStyle=color;ctx.font=`800 ${size}px system-ui`;ctx.textAlign='center';ctx.fillText(tr(t),x,y);}
function sprite(im,row,col,x,y,size,flip=false){drawLegacySprite(ctx,im,row,col,x,y,size,flip);}
function drawHero(actor,name,partner=false){circle(actor.x,actor.y,19,'#00000060');const f=heroFrame(state,actor,name,partner);sprite(images[f.atlas],f.row,f.col,actor.x,actor.y,112*(f.scale||1),f.flip);if(!partner){circle(actor.x,actor.y+4,23,name==='nox'?'#64deff':'#ff75d8',true,2);const a=state.arsenal;if(a?.reloadRemaining>0){const k=1-a.reloadRemaining/WEAPONS_V9[a.active].reload;ctx.lineCap='round';for(const [color,width] of [['#05080dcc',7],['#f4f7ff',3]]){ctx.beginPath();ctx.arc(actor.x,actor.y+4,23,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.max(.04,k));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}ctx.lineCap='butt';}if(state.overdrive>0)circle(actor.x,actor.y-50,48,'#ff4a6a55',true,4);}}
const shade=document.createElement('canvas'),shadeCtx=shade.getContext('2d');
const lightStamp=document.createElement('canvas');lightStamp.width=lightStamp.height=256;{const g=lightStamp.getContext('2d'),gradient=g.createRadialGradient(128,128,32,128,128,128);gradient.addColorStop(0,'#000');gradient.addColorStop(1,'#0000');g.fillStyle=gradient;g.fillRect(0,0,256,256);}
// The light mask is soft by nature: half resolution looks identical and costs a quarter of the fill.
function drawDark(w,h){const s=state,sw=Math.ceil(canvas.width/2),sh=Math.ceil(canvas.height/2);if(shade.width!==sw||shade.height!==sh){shade.width=sw;shade.height=sh;}const g=shadeCtx,dpr=sw/w;g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.clearRect(0,0,shade.width,shade.height);g.fillStyle=s.rookDark?'#020816b0':s.c.tint?s.c.tint+'f2':'#000000f0';g.fillRect(0,0,shade.width,shade.height);g.globalCompositeOperation='destination-out';
 const hole=(x,y,r,a=1)=>{const px=(x-camera.x)*camera.scale*dpr,py=(y-camera.y)*camera.scale*dpr,rr=r*camera.scale*dpr;g.globalAlpha=a;g.drawImage(lightStamp,px-rr,py-rr,rr*2,rr*2);g.globalAlpha=1;};
 hole(s.x,s.y-30,260);for(const n of s.nodes)hole(n.x,n.y,n.on?150:90,.8);if(s.reveal>0)for(const e of s.enemies)if(e.hp>0)hole(e.x,e.y-40,110,Math.min(1,s.reveal));for(const e of s.enemies)if(e.hp>0&&e.boss&&e.state!=='dormant')hole(e.x,e.y-60,140,.7);
 ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(shade,0,0,canvas.width,canvas.height);ctx.restore();}
// Tunnel headlights: one pre-rendered vignette, moved with the car instead of rebuilt every frame.
const vignette=document.createElement('canvas');vignette.width=360;vignette.height=520;{const g=vignette.getContext('2d'),grad=g.createRadialGradient(180,260,20,180,260,190);grad.addColorStop(0,'rgba(0,0,0,0)');grad.addColorStop(1,'rgba(2,3,8,.93)');g.fillStyle=grad;g.fillRect(0,0,360,520);}
// The Anchor and its bollards use the Astra G11/G12 candidates when loaded (tools/build_anchor_sheets.py);
// the procedural forms below stay as the fallback. Lines and telegraphs remain procedural (G12 cable rejected).
const BOLLARD_SCALE=1.3,ANCHOR_WIDTH=200;
function drawBollard(m){const im=images.anchor_bollards;if(!im?.naturalWidth)return false;const core=state.enemies.find(e=>e.id===m.anchorId),f=bollardFrame(m,ANCHOR_RULES.relink[core?.phase||0]),[cw,ch]=BOLLARD_SHEET.cell,[bx,by]=BOLLARD_SHEET.base,k=BOLLARD_SCALE;
 ctx.save();ctx.translate(m.x,m.y+4);if(core&&core.x>m.x)ctx.scale(-1,1);ctx.imageSmoothingEnabled=false;ctx.drawImage(im,f*cw,0,cw,ch,-bx*k,-by*k,cw*k,ch*k);ctx.restore();return true;}
// Taut line: the Astra 64x64 segment (rope in columns 22-41) repeats every 63 rows, because its first
// and last rows are the same pixels; the tile scrolls toward the core unless motion is reduced.
// The cap (tools/build_cable_end.py) closes the line at the core.
let ropeTile=null;
function drawRope(x0,y0,x1,y1){const im=images.anchor_cable;if(!im?.naturalWidth)return false;
 if(!ropeTile){ropeTile=document.createElement('canvas');ropeTile.width=20;ropeTile.height=63;ropeTile.getContext('2d').drawImage(im,22,0,20,63,0,0,20,63);}
 const dx=x1-x0,dy=y1-y0,len=Math.hypot(dx,dy),k=.6,off=settings.reduced?0:(performance.now()/25)%63;
 ctx.save();ctx.translate(x0,y0);ctx.rotate(Math.atan2(dy,dx)-Math.PI/2);ctx.scale(k,k);ctx.translate(-10,-off);ctx.fillStyle=ctx.createPattern(ropeTile,'repeat');ctx.fillRect(0,off,20,len/k);
 // End cap at the core: its row 63 joins the rope, so it is drawn mirrored past the rope's end.
 const cap=images.anchor_cable_end;if(cap?.naturalWidth){ctx.translate(-22,off+len/k);ctx.scale(1,-1);ctx.imageSmoothingEnabled=false;ctx.drawImage(cap,0,-64,64,64);}
 ctx.restore();return true;}
function enemySprite(a,kind){
 if(a.role==='moor'&&drawBollard(a)){if(a.hp>0)label('CIMA',a.x,a.y-80,'#fff0c8',12);return;}
 if(a.bossKind==='anchor'&&images.anchor_core?.naturalWidth){const f=anchorFrame(a,performance.now()/1000,settings.reduced),[cw,ch]=ANCHOR_SHEET.cell,[bx,by]=ANCHOR_SHEET.base,k=ANCHOR_WIDTH/ANCHOR_SHEET.bodyWidth,jolt=a.hurtAnim>0&&!settings.reduced?(Math.random()-.5)*4:0;
  ctx.drawImage(images.anchor_core,f.col*cw,f.row*ch,cw,ch,a.x-bx*k+jolt,a.y+8-by*k,cw*k,ch*k);
  if(a.hp>0)label(a.exposed?'NUCLEO ESPOSTO':'ORMEGGIATO',a.x,a.y-170,a.exposed?'#ffd48a':'#9fe9ff',14);return;}
 // PROTOTYPE FORMS (fallback): drawn only when the Anchor sheets are not loaded.
 if(a.role==='moor'){if(a.hp<=0)return;ctx.fillStyle='#0c1620';ctx.fillRect(a.x-20,a.y-58,40,62);ctx.fillStyle='#3f5d6e';ctx.fillRect(a.x-16,a.y-54,32,54);ctx.fillStyle='#ffcf5a';ctx.fillRect(a.x-16,a.y-40,32,6);ctx.fillRect(a.x-16,a.y-22,32,6);circle(a.x,a.y-62,10,'#9fe9ff');label('CIMA',a.x,a.y-76,'#fff0c8',12);return;}
 if(a.bossKind==='anchor'){const t=performance.now()/1000,hurt=a.hurtAnim>0?4:0,open=a.exposed&&a.hp>0;ctx.save();ctx.translate(a.x+(Math.random()-.5)*hurt,a.y);
  ctx.fillStyle='#00000066';ctx.beginPath();ctx.ellipse(0,4,96,34,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#22313c';ctx.beginPath();ctx.ellipse(0,-30,84,62,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#5d7c8d';ctx.lineWidth=6;ctx.stroke();
  for(let i=0;i<8;i++){const q=i*Math.PI/4+(settings.reduced?0:t*.3);circle(Math.cos(q)*66,-30+Math.sin(q)*46,7,'#8aa5b4');}
  ctx.fillStyle=open?'#ffb35c':'#2c4a5c';ctx.beginPath();ctx.ellipse(0,-34,34,26,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle=open?'#fff1c8':'#7fd7ff';ctx.lineWidth=4;ctx.stroke();
  ctx.restore();if(a.hp>0)label(open?'NUCLEO ESPOSTO':'ORMEGGIATO',a.x,a.y-112,open?'#ffd48a':'#9fe9ff',14);return;}
 if(a.bossKind==='rook'&&images.rook?.naturalWidth){
  const frame=a.hp<=0?7:a.hurtAnim>0?6:a.state==='rookAim'?(a.clock<a.windup*.5?2:3):a.state==='recover'?(a.clock<.18?4:5):a.state==='rookMove'?1:0;
  ctx.save();ctx.translate(a.x,a.y);if(a.face<0)ctx.scale(-1,1);ctx.imageSmoothingEnabled=false;ctx.drawImage(images.rook,(frame%4)*128,Math.floor(frame/4)*144,128,144,-64,-134,128,144);ctx.restore();return;
 }
 if(a.boss&&a.bossKind==='archon'&&chronoArt.get('chrono_overlord')){
  let name='idle',elapsed=0;
  if(a.hp<=0){elapsed=Math.max(0,.7-a.deathAnim);name=elapsed<.18?'final_hit':elapsed<.48?'collapse':'reward_portal';}
  else if(a.hurtAnim>0)name='stagger';
  else if(a.state==='recover')name=a.hp/a.max<.25?'core_exposed':'idle';
  else if(['warn','charge','volley'].includes(a.state))name=a.clock<a.windup?'anticipation':'attack';
  drawChronoFrame(ctx,chronoArt.get('chrono_overlord'),chronoAnimation('chrono_overlord',name),elapsed,a.x,a.y,230,a.face<0,settings.reduced);return;
 }
 if(!a.boss&&kind===3&&chronoArt.get('purple_guard')){const pose=chronoEnemyPose(a),animation=chronoAnimation('purple_guard',pose.name),elapsed=pose.progress==null?pose.elapsed:pose.progress*animation.frame_count/animation.fps;drawChronoFrame(ctx,chronoArt.get('purple_guard'),animation,elapsed,a.x,a.y,104,a.face<0,settings.reduced);return;}
if(a.boss&&a.bossKind==='mirror'){const f=mirrorFrame(a);sprite(atlas(f.atlas),f.row,f.col,a.x,a.y,124,f.flip);return;}
 if(a.boss&&a.bossKind==='archon'){const f=enemyFrame(a,3);sprite(atlas('archon'),f.row,f.col,a.x,a.y,230,f.flip);return;}
 const f=enemyFrame(a,kind);sprite(images[f.atlas],f.row,f.col,a.x,a.y,a.boss?190:a.role==='brute'?132:104,f.flip);}
let activeMapSurface=null,mapRasterSource=null,mapRasterViewScale=0,mapRasterDevice=0;
const mapRasters=new Map();
// Prepare all three drawing levels before play; a quality change never rebuilds the map in a frame.
function prepareMapRasters(){
 const source=activeMapSurface||images[DISTRICT_MAPS[state.c.map]],viewScale=innerWidth<650?.66:Math.min(.95,innerHeight/760),device=Math.min(devicePixelRatio||1,1.75);
 if(mapRasterSource===source&&mapRasterViewScale===viewScale&&mapRasterDevice===device)return;
 for(const raster of mapRasters.values())raster.width=raster.height=1;mapRasters.clear();
 for(const level of [1.75,1.25,1]){const ratio=Math.min(device,level);if(mapRasters.has(ratio))continue;const scale=viewScale*ratio,raster=document.createElement('canvas');raster.width=raster.height=Math.ceil(SIZE*scale);const g=raster.getContext('2d',{alpha:false});g.setTransform(scale,0,0,scale,0,0);g.imageSmoothingEnabled=false;g.drawImage(source,0,0,SIZE,SIZE);mapRasters.set(ratio,raster);}
 mapRasterSource=source;mapRasterViewScale=viewScale;mapRasterDevice=device;
}
function drawMapBackdrop(w,jitter){
 prepareMapRasters();const ratio=ctx.getTransform().a,scale=camera.scale*ratio,raster=mapRasters.get(ratio);
 if(!raster)return;
 ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(raster,Math.round((-camera.x+jitter)*scale),Math.round(-camera.y*scale));ctx.restore();
}
function drawWorld(w,h){const s=state,c=s.c,backdrop=images[DISTRICT_MAPS[c.map]];if(!backdrop?.naturalWidth)return;
 if(s.mission==='exp_chalk_marks'||s.mission==='below'&&flags()['exp.chalk.completed']){
  const marks=s.mission==='exp_chalk_marks'?[{x:416,y:1248},{x:1120,y:800},c.zone]:flags()['exp.chalk.route']==='service'?[{x:480,y:1000},{x:480,y:930}]:[{x:480,y:1000},{x:525,y:930}];
  for(const [i,m] of marks.entries()){const art=images.chalk_route_art;if(art?.naturalWidth){ctx.save();ctx.globalAlpha=i===marks.length-1?.95:.58;ctx.drawImage(art,m.x-45,m.y-40,90,80);ctx.restore();}}
  if(s.mission==='below'){const person=chalkCivilianPose(s.time,flags()['exp.chalk.route'],settings.reduced);drawChronoFrame(ctx,chronoArt.get('civilian'),chronoAnimation('civilian',person.animation),person.elapsed,person.x,person.y,88,person.flip,settings.reduced);const flask=images.chalk_flask_states;if(flask?.naturalWidth){ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(flask,144,0,48,64,person.x-21,person.y-27,18,24);ctx.restore();}}
 }
 if(c.tint&&!c.dark&&!c.layout){ctx.fillStyle=c.tint+'99';ctx.fillRect(0,0,SIZE,SIZE);}else if(c.map>0&&!c.dark&&!c.layout){ctx.fillStyle=['','#112d3b30','#34501b25','#35144738'][c.map];ctx.fillRect(0,0,SIZE,SIZE);}
 if(c.mode==='defend'||c.mode==='chalk'){const z=c.zone,active=c.mode==='defend'||s.nodes.every(n=>n.on);ctx.save();ctx.setLineDash([10,8]);circle(z.x,z.y,z.r,active?'#7dffd0':'#e9d5b1',true,3);ctx.restore();circle(z.x,z.y,z.r,active?'#7dffd014':'#e9d5b114');ctx.beginPath();ctx.arc(z.x,z.y,z.r+10,-Math.PI/2,-Math.PI/2+Math.PI*2*s.progress);ctx.strokeStyle='#b8f27c';ctx.lineWidth=8;ctx.stroke();label(c.site||'LINEA',z.x,z.y-z.r-18,'#cfffe8',16);}
 for(const [nodeIndex,n] of s.nodes.entries()){if(s.mission==='exp_chalk_marks'&&images.chalk_flask_states?.naturalWidth){const frame=chalkFlaskFrame(n,s.channel,nodeIndex);ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(images.chalk_flask_states,frame*48,0,48,64,n.x+38,n.y-30,30,40);ctx.restore();}const color=n.on?'#7dffd0':c.color;circle(n.x,n.y,38,color+'22');circle(n.x,n.y,28,color,true,3);sprite(images.district_props,Math.min(3,c.kind),n.on?1:0,n.x,n.y,84);label(n.on?'ATTIVO':c.nodeLabel||'DISPOSITIVO',n.x,n.y+55,color,12);
  if(c.marks){circle(n.x-60,n.y-6,4,'#f4f1e6');circle(n.x-46,n.y-6,4,'#f4f1e6');}
  if(s.channel&&s.nodes[s.channel.node]===n){ctx.beginPath();ctx.arc(n.x,n.y,44,-Math.PI/2,-Math.PI/2+Math.PI*2*s.channel.t/s.channel.need);ctx.strokeStyle='#fff';ctx.lineWidth=6;ctx.stroke();}}
 if(s.clinicSplit){ctx.fillStyle='#253744';ctx.fillRect(s.x+95,s.y-220,24,440);label('PARATIA · RADIO INTERROTTA',s.x+105,s.y-235,'#ffb880',14);drawHero({x:s.x+210,y:s.y,walk:performance.now()/150},'nox',true);}
 if(s.mission==='blackout'){ctx.drawImage(images.car,560,1080,190,125);label('VORTEX',650,1218,'#9ec5d3',11);}
 for(const b of s.barriers){circle(b.x,b.y,b.r,'#ff7fd822');circle(b.x,b.y,b.r,'#ff7fd8',true,2);sprite(images.district_props,2,3,b.x,b.y+18,92);ctx.beginPath();ctx.arc(b.x,b.y,b.r+6,-Math.PI/2,-Math.PI/2+Math.PI*2*b.life/(c.barrierLife||9));ctx.strokeStyle='#ffc2ee';ctx.lineWidth=3;ctx.stroke();}
 // Patrol vision cones: amber while unaware, red as suspicion fills.
 if(c.mode==='stealth'&&!s.alarm)for(const e of s.enemies){if(e.hp<=0||e.state!=='patrol')continue;const f=e.dir||{x:e.face,y:0},a=Math.atan2(f.y,f.x),r=c.vision||240,cone=c.cone||.6;ctx.beginPath();ctx.moveTo(e.x,e.y-10);ctx.arc(e.x,e.y-10,r,a-cone,a+cone);ctx.closePath();ctx.fillStyle=e.seen>.05?`rgba(255,${Math.round(180-150*e.seen)},80,${.16+e.seen*.25})`:'rgba(255,214,120,.13)';ctx.fill();}
 const archon=s.enemies.find(e=>e.bossKind==='archon');
 if(archon?.phase===2&&archon.hp>0){for(const [i,text]of ['Una festa. Il nome di Lia.','Una porta. Una mano.','Ricordi di un’altra vita.'].entries()){const x=470+i*300,y=380+i%2*100;ctx.fillStyle='#d6b89422';ctx.fillRect(x-110,y-65,220,90);label(text,x,y,'#f6e2a6',13);}}
 if(archon?.hp===0){const t=.7-archon.deathAnim,r=t<.22?150*(1-t/.22):40+(t-.22)*700;for(let i=0;i<12;i++){const a=i*Math.PI/6+s.time;line(archon.x+Math.cos(a)*r,archon.y-100+Math.sin(a)*r,archon.x+Math.cos(a)*(r+25),archon.y-100+Math.sin(a)*(r+25),'#bb8aff',5);}}
 if(s.allies)drawStrangers(s.allies,s.time);
 if(s.mission==='finale'&&s.enemies.some(e=>e.boss&&e.phase>=1))drawRiftFront(s.time);
 for(const m of s.enemies)if(m.role==='moor'&&m.hp<=0)drawBollard(m);
 const actors=[{...s,role:'hero'},...(s.partner?[{...s.partner,role:'partner'}]:[]),...s.enemies.filter(e=>e.hp>0||e.deathAnim>0).map(e=>({...e,...hitstops.get(e.id)?.pose,role:'enemy'}))].sort((a,b)=>a.y-b.y);
 // Q2-U2a: reduced motion turns the blink off, so invulnerability gets a still dashed ring instead.
 for(const a of actors){if(a.role==='hero'){if(s.inv<=0||settings.reduced||Math.floor(s.time*15)%2===0)drawHero(a,s.hero);if(s.inv>0&&settings.reduced){ctx.save();ctx.setLineDash([5,6]);circle(a.x,a.y-24,46,'#e8fbff',true,3);ctx.restore();}}else if(a.role==='partner')drawHero(a,s.hero==='nox'?'lulu':'nox',true);
  else{circle(a.x,a.y,a.boss?34:22,'#00000070');ctx.globalAlpha=a.state==='dormant'?.55:a.state==='stun'?.75:1;if(!settings.reduced&&hitstops.get(a.id)?.flash>0)ctx.filter='brightness(0) invert(1)';enemySprite(a,c.kind);ctx.filter='none';ctx.globalAlpha=1;
   if(a.state==='stun'){label('✶',a.x,a.y-112,'#ffc2ee',18);}
   if(a.guard>0)circle(a.x,a.y-60,62,'#ff6a6a99',true,4);
   if(!a.boss&&a.hp>0){ctx.fillStyle='#0d1523';ctx.fillRect(a.x-24,a.y-110,48,5);ctx.fillStyle=c.color;ctx.fillRect(a.x-24,a.y-110,48*Math.max(0,a.hp)/a.max,5);}}}
}
// Telegraphs and projectiles sit above darkness: danger is always readable.
function drawThreats(){const s=state;
 for(const core of s.enemies){if(core.bossKind!=='anchor'||core.state==='dormant'||core.hp<=0)continue;
  for(const m of s.enemies){if(m.anchorId!==core.id)continue;
   if(m.hp>0){ctx.save();ctx.setLineDash([14,8]);ctx.lineDashOffset=settings.reduced?0:-performance.now()/40;const art=images.anchor_core?.naturalWidth,y0=m.y-(images.anchor_bollards?.naturalWidth?(BOLLARD_SHEET.base[1]-BOLLARD_SHEET.ropeY)*BOLLARD_SCALE-4:50),dx=core.x-m.x,dy=core.y-34-y0,n=Math.hypot(dx,dy)||1,stop=art?Math.min(n*.5,82):0;if(!drawRope(m.x,y0,core.x-dx/n*stop,core.y-34-dy/n*stop))line(m.x,y0,core.x-dx/n*stop,core.y-34-dy/n*stop,'#9fe9ff',5);ctx.restore();}
   else if(!m.released){const k=m.relink/ANCHOR_RULES.relink[core.phase];circle(m.x,m.y-20,24,'#0a121acc');ctx.beginPath();ctx.arc(m.x,m.y-20,24,-Math.PI/2,-Math.PI/2+Math.PI*2*(1-k));ctx.strokeStyle='#9fe9ff';ctx.lineWidth=4;ctx.stroke();label('TAGLIATA · '+Math.ceil(m.relink)+' s',m.x,m.y-54,'#cfefff',12);}}
  if(core.state==='anchorSweep'&&core.sweepDirs){const locked=core.clock>=core.windup*ANCHOR_RULES.sweep.lock,w=ANCHOR_RULES.sweep.width,L=ANCHOR_RULES.sweep.length;
   const k=Math.min(1,core.clock/core.windup);let inLane=false;
   for(const u of core.sweepDirs){const dx=s.x-core.x,dy=s.y-core.y,along=dx*u.x+dy*u.y;if(along>=0&&along<=L&&Math.abs(dx*u.y-dy*u.x)<w/2)inLane=true;
    ctx.save();ctx.translate(core.x,core.y-20);ctx.rotate(Math.atan2(u.y,u.x));
    // Astra lane atlas: row 0 charge up to the lock, row 1 locked; the 560x64 band is the hitbox itself.
    const lane=images.anchor_sweep,lockAt=core.windup*ANCHOR_RULES.sweep.lock;if(lane?.naturalWidth){const row=locked?1:0,phase=locked?(core.clock-lockAt)/(core.windup-lockAt):core.clock/lockAt;ctx.imageSmoothingEnabled=false;ctx.drawImage(lane,Math.min(3,Math.floor(phase*4))*576+16,row*96+16,560,64,0,-w/2,L,w);ctx.restore();continue;}
    ctx.fillStyle=locked?'#ff4a3a8c':'#ffa84a5c';ctx.fillRect(0,-w/2,L,w);
    // Hazard chevrons advance with the windup: the lane fills before it fires.
    ctx.fillStyle=locked?'#ffd2c0cc':'#ffcf8a99';for(let x=24;x<L*k;x+=48){ctx.beginPath();ctx.moveTo(x,-w/2+8);ctx.lineTo(x+16,0);ctx.lineTo(x,w/2-8);ctx.lineTo(x+8,0);ctx.closePath();ctx.fill();}
    ctx.setLineDash(locked?[]:[18,8]);ctx.strokeStyle=locked?'#ff6a52':'#ffb35c';ctx.lineWidth=6;ctx.strokeRect(0,-w/2,L,w);ctx.restore();}
   label(locked?'CIMA · ESCI DALLA LINEA':'CIMA IN TENSIONE',core.x,core.y+40,'#ffd2c0',13);if(inLane)label(locked?'ESCI DALLA LINEA':'CIMA IN TENSIONE',s.x,s.y-128,locked?'#ff8a7a':'#ffcf8a',15);}}
 for(const m of s.mines||[]){circle(m.x,m.y,m.r,'#ffb74b18');ctx.save();ctx.setLineDash(m.age<.9?[4,8]:[12,5]);circle(m.x,m.y,m.r,'#ffb74b',true,2);ctx.restore();ctx.fillStyle='#263c48';ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI*i/3;const x=m.x+Math.cos(a)*16,y=m.y+Math.sin(a)*12;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.fill();ctx.strokeStyle='#ffb74b';ctx.lineWidth=2;ctx.stroke();for(let i=0;i<3;i++){const a=Math.PI*(i*2/3-.5);line(m.x+Math.cos(a)*6,m.y+Math.sin(a)*6,m.x+Math.cos(a)*18,m.y+Math.sin(a)*18,'#69f6ef',3);}label(m.age<.9?'SI ARMA':'SPARA · MINA',m.x,m.y-22,'#fff0df',11);}
 for(const e of s.enemies){if(e.hp<=0)continue;
  if(e.state==='rookAim'){const end=trace({...s,x:e.x,y:e.y},unit({x:e.target.x-e.x,y:e.target.y-e.y}),580);ctx.save();ctx.setLineDash(e.clock<e.windup*.5?[7,8]:[]);line(e.x,e.y-34,end.x,end.y-34,'#ffc07a',3);ctx.restore();circle(e.target.x,e.target.y-30,15,'#ffc07a',true,2);label(e.clock<e.windup*.5?'MIRA':'SCHIVA',e.target.x,e.target.y-55,'#fff0df',12);}
  // Q2-U1: the lock (campaign.mjs warn, .55 melee / .6 ranged) has a shape of its own: dashed while tracking, solid with ticks once locked.
  else if(e.state==='warn'&&!e.ranged){const t=e.target,radius=e.attackRadius,k=clamp(e.clock/e.windup,0,1),lock=k>=.55,cue=e.role==='breaker'?'CARICA':e.role==='signal'?'CAMPO':e.boss?'IMPATTO':'SCHIVA';circle(t.x,t.y,radius,'#ff634333');circle(t.x,t.y,radius*k,'#ff634355');ctx.save();ctx.setLineDash(lock?[]:[8,8]);circle(t.x,t.y,radius,'#ff997b',true,lock?5:3);ctx.restore();if(lock)for(const [u,v] of [[1,0],[-1,0],[0,1],[0,-1]])line(t.x+u*radius,t.y+v*radius,t.x+u*(radius-14),t.y+v*(radius-14),'#fff0df',3);label(cue,t.x,t.y-8,'#fff0df',12);}
  else if(e.state==='warn'&&e.ranged){const lock=e.clock>=e.windup*.6;ctx.save();ctx.setLineDash(lock?[]:[6,8]);line(e.x,e.y-34,e.target.x,e.target.y-30,`rgba(255,120,90,${.35+.5*e.clock/e.windup})`,lock?3:2);ctx.restore();circle(e.target.x,e.target.y-30,8+6*e.clock/e.windup,'#ff8a6a',true,2);}
  else if(e.state==='charge'&&e.clock<e.windup){const d=e.dir;ctx.save();ctx.globalAlpha=.25+.35*e.clock/e.windup;ctx.strokeStyle='#ff5a5a';ctx.lineWidth=56;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+d.x*420,e.y+d.y*420);ctx.stroke();ctx.restore();label('CARICA',e.x+d.x*200,e.y+d.y*200,'#fff0df',13);}
  else if(e.state==='volley'){const at=e.emitter||e;circle(at.x,at.y-60,30+20*e.clock/e.windup,'#ffcf8a',true,3);ctx.save();ctx.setLineDash([6,8]);line(at.x,at.y-34,e.target.x,e.target.y-30,'#ff8a6a',2);ctx.restore();}}
 for(const b of s.shots){const col=b.boss?'#ff6a8a':'#ffb070';line(b.x,b.y,b.x-b.vx*.05,b.y-b.vy*.05,col+'88',6);circle(b.x,b.y,8,col);circle(b.x,b.y,4,'#fff');}
 const aimView=aimTouch||gamepadAim;if(aimView){const preview=attackPreview(s,aimView.kind,aimView.dir);ctx.save();ctx.setLineDash([8,7]);for(const end of preview.rays){line(s.x,s.y-30,end.x,end.y-30,'#eaffff',2);circle(end.x,end.y-30,5,'#eaffff',true);}ctx.restore();}

 const locked=s.enemies.find(e=>e.hp>0&&e.id===s.lock);if(locked)circle(locked.x,locked.y-40,29,'#fff2bd',true,1);
 for(const f of chronoFxPool)if(f.life>0){ctx.globalAlpha=settings.reduced?.45:Math.min(1,f.life/.08);drawChronoFrame(ctx,chronoArt.get('effects'),chronoAnimation(f.id,'play'),f.max-f.life,f.x,f.y,settings.reduced?70:100,false,settings.reduced);}ctx.globalAlpha=1;
 for(const f of fx){ctx.globalAlpha=clamp(f.life/f.max,0,1);if(f.type==='atlas'){sprite(images.fx_atlas,f.row,Math.min(3,Math.floor((1-f.life/f.max)*4)),f.x,f.y+30,110);}else if(f.type==='lane'){ctx.globalAlpha=1;ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.a);ctx.imageSmoothingEnabled=false;ctx.drawImage(images.anchor_sweep,Math.min(3,Math.floor((1-f.life/f.max)*4))*576+16,2*96+16,560,64,0,-ANCHOR_RULES.sweep.width/2,f.length,ANCHOR_RULES.sweep.width);ctx.restore();}else if(f.type==='vfx'){ctx.globalAlpha=1;ctx.drawImage(f.im,Math.min(3,Math.floor((1-f.life/f.max)*4))*128,f.row*128,128,128,f.x-48,f.y-48,96,96);}else if(f.type==='spark'){line(f.x,f.y,f.x-f.vx*.035,f.y-f.vy*.035,f.color,3);}else if(f.type==='flash'){circle(f.x,f.y,14,f.color);}else if(f.type==='beam'){if(f.area){ctx.strokeStyle=f.color;ctx.lineWidth=13;ctx.beginPath();const a=Math.atan2(f.dir.y,f.dir.x);ctx.arc(f.x,f.y,170*(1-f.life/f.max)+30,a-1.1,a+1.1);ctx.stroke();}else{line(f.x,f.y,f.to.x,f.to.y,f.color,f.magic?13:5);line(f.x,f.y,f.to.x,f.to.y,'#fff',f.magic?4:2);}}else if(f.type==='ring')circle(f.x,f.y,f.r*(1-f.life/f.max),f.color,true,4);else label(f.text,f.x,f.y,f.color,20);ctx.globalAlpha=1;}}
function updateFootHud(w,h){const s=state,c=s.c;
 if(s.arsenal){const a=s.arsenal,w=WEAPONS_V9[a.active];setText('weapon-state',w.name+' · '+a.ammo[a.active]+'/'+w.magazine+(s.quickdrawWindow>0?' · QUICKDRAW':''));$('weapon-controls').dataset.weapon=a.active;setText('weapon-reload',a.reloadRemaining>0?'RICARICA '+a.reloadRemaining.toFixed(1)+' s':'RICARICA');$('weapon-reload').disabled=a.reloadRemaining>0||a.ammo[a.active]===w.magazine;$('weapon-change').disabled=!!s.action||a.reloadRemaining>0||a.cooldown>0;}
 setText('district',c.district+(s.hero==='lulu'?' · LULÙ':' · NOX'));
 const on=s.nodes.filter(n=>n.on).length,boss=s.enemies.find(e=>e.boss&&e.hp>0&&e.state!=='dormant'),foes=s.enemies.filter(e=>e.hp>0&&e.state!=='dormant').length;
 let obj=c.goal;const foesText=foes===1?'1 nemico':foes+' nemici';
 if(c.mode==='defend')obj=c.goal;else if(c.mode==='chalk'&&s.nodes.every(n=>n.on))obj=c.holdGoal;else if(boss)obj='Abbatti '+BOSS_NAMES[boss.bossKind];
 else if(s.nodes.length&&on===s.nodes.length&&foes&&!c.boss)obj='Elimina gli ultimi nemici · '+foes;
 else if(s.nodes.length)obj=`${c.task||c.nodeLabel||'Dispositivi'} ${on}/${s.nodes.length}`+(c.mode==='stealth'?' · resta nell’ombra':foes?' · '+foesText:'');
 setText('objective',obj);showHealth(s);
 const kits=progress.world.inventory.medkit||0;panel('heal',progress.world.visited.length>0||kits>0);setText('heal-label','CURA · '+kits);$('heal').setAttribute('aria-label',tr('Cura: '+kits+' kit, recupera fino a 4 salute'));$('heal').setAttribute('aria-disabled',String(!kits||s.hp>=s.maxHp));
 const meter=$('meter');if(c.mode==='stealth'){panel('meter',true);meter.classList.add('alert');$('meter-fill').style.width=Math.round((s.alarm?1:s.alert)*100)+'%';setText('meter-label',s.alarm?'ALLARME':'ALLERTA');}else if(c.mode==='defend'||c.mode==='chalk'&&s.nodes.every(n=>n.on)){panel('meter',true);meter.classList.remove('alert');$('meter-fill').style.width=Math.round(s.progress*100)+'%';setText('meter-label',(c.site||'LINEA')+' '+Math.round(s.progress*100)+'%');}else panel('meter',false);
 document.body.classList.toggle('boss-active',!!boss);
 if(boss){panel('bossbar',true);const bossName=boss.bossKind==='archon'?['ARCHON · LA CUSTODE','ARCHON · LA CITTÀ','ARCHON · LIA'][boss.phase]:BOSS_NAMES[boss.bossKind];setText('boss-name',bossName);setVitalMeter($('bossbar'),boss.hp,boss.max,bossName,{lowAt:0,immediate:settings.reduced});}else panel('bossbar',false);
 const unlocked=c.magic||s.hero==='lulu';$('magic').disabled=!unlocked;$('magic').classList.toggle('cooling',s.magicCd>0);setText('magic',s.magicCd>0?s.magicCd.toFixed(1)+' s':$('magic').dataset.label);
 const sig=$('duo');if(s.signature==='barrier'){sig.disabled=s.sigCd>0;setText('duo',s.sigCd>0?'BARRIERA '+s.sigCd.toFixed(0)+' s':'BARRIERA');sig.classList.toggle('ready',s.sigCd===0);}
 else{sig.disabled=s.duo<100||s.overdrive>0;setText('duo',s.overdrive>0?'ATTIVO':`${sig.dataset.label} ${s.duo}%`);sig.classList.toggle('ready',s.duo>=100&&!s.overdrive);if(s.duo>=100&&sig.hidden){panel('duo',true);remember('city-duo-seen-v8');notice(s.signature==='duo'?'DUO pronto: attacco combinato con il partner.':'BLACK PULSE pronto.');}
  if(s.signature==='overdrive'&&s.duo>=100&&!overdriveSaid){overdriveSaid=true;bark('overdriveReady');}}
 const db=$('dash');db.classList.toggle('cooling',s.dashCd>0);db.classList.toggle('shift',s.hero==='nox'&&!(s.shiftCd>0));db.style.setProperty('--cd',Math.min(1,s.dashCd/(s.overdrive>0?.6:1.1)));const near=s.nodes.some(n=>!n.on&&distance(s,n)<85);panel('interact',near||!!s.channel);setText('interact',s.channel?'…'+Math.round(100*s.channel.t/s.channel.need)+'%':'ATTIVA');
 if(c.mode==='defend'){if(s.progress>=.5&&!halfSaid){halfSaid=true;bark('half');}if(s.progress>=.85&&!lateSaid){lateSaid=true;bark('late');const owner=progress.step;setTimeout(()=>{if(progress?.step===owner)bark('lateb');},2800);setTimeout(()=>{if(progress?.step===owner)bark('latec');},5600);}}
 // Off-screen objective arrow.
 const goal=(boss)||s.nodes.find(n=>!n.on)||(['defend','chalk'].includes(c.mode)?c.zone:null)||s.enemies.find(e=>e.hp>0&&e.state!=='dormant');if(goal){const px=(goal.x-camera.x)*camera.scale,py=(goal.y-camera.y)*camera.scale;if(px<30||px>w-30||py<100||py>h-190){const x=clamp(px,28,w-28),y=clamp(py,115,h-200);circle(x,y,18,'#122337ee');ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(py-y,px-x));ctx.fillStyle=c.color;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-6,-6);ctx.lineTo(-6,6);ctx.closePath();ctx.fill();ctx.restore();}}}
// HUD and controls are measured once per layout, not per frame; a button appearing never moves the camera.
let frameInsets=null;
// Landscape docks the weapon bar between the thumbs (CSS); portrait stacks it above heal/actions.
const DOCKED_KIT='(max-height:520px) and (orientation:landscape)';
function measureInsets(w,h){const hud=$('hud').getBoundingClientRect(),ctl=$('controls').getBoundingClientRect(),kit=$('weapon-controls');if(!kit.hidden)kit.style.bottom=matchMedia(DOCKED_KIT).matches?'':(h-Math.min(ctl.top,$('heal').hidden?ctl.top:$('heal').getBoundingClientRect().top)+8)+'px';const overlays=ctl.height?['stick','heal','interact','duo','magic','dash','gun','weapon-controls'].map(id=>$(id)).filter(e=>e&&!e.hidden&&e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return {l:r.left,r:r.right,t:r.top};}):[];frameInsets={w,h,top:hud.height?hud.bottom+6:0,overlays,bottom:0};}
function followCamera(target,w,h){camera.scale=cameraScale(w,h);if(!frameInsets||frameInsets.w!==w||frameInsets.h!==h)measureInsets(w,h);const c=framePlayCamera(target,w,h,camera.scale,frameInsets.top,frameInsets.overlays,SIZE);frameInsets.bottom=c.bottom;camera.x=c.x;camera.y=c.y;}
function drawFoot(w,h){const s=state;followCamera(s,w,h);const duel=s.enemies.find(e=>e.bossKind==='rook'&&e.hp>0&&e.state!=='dormant');if(duel)Object.assign(camera,frameDuelCamera(camera,s,duel,w,h,Math.max(frameInsets.top,h>520?202:110),frameInsets.bottom,camera.scale));
 const jitter=settings.reduced?0:(Math.random()-.5)*shake;drawMapBackdrop(w,jitter);ctx.save();ctx.scale(camera.scale,camera.scale);ctx.translate(-camera.x+jitter,-camera.y);drawWorld(w,h);ctx.restore();
 if(s.c.dark||s.rookDark)drawDark(w,h);
 ctx.save();ctx.scale(camera.scale,camera.scale);ctx.translate(-camera.x+jitter,-camera.y);drawThreats();ctx.restore();
 if(focusTime>0&&!settings.reduced){ctx.fillStyle='#dff8ff12';ctx.fillRect(0,0,w,h);}
 if(s.hp<=2&&s.status==='playing'){const g=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.3,w/2,h/2,Math.max(w,h)*.7);g.addColorStop(0,'rgba(120,0,20,0)');g.addColorStop(1,`rgba(140,0,30,${.25+.1*Math.sin(s.time*6)})`);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}
 // Chrono Shift: a still cyan frame, also with reduced motion (it does not move) and without audio.
 if(s.shift>0&&s.status==='playing'){const b=Math.max(6,Math.min(w,h)*.018);ctx.strokeStyle='#59e0ff';ctx.lineWidth=b;ctx.strokeRect(b/2,b/2,w-b,h-b);}
 updateFootHud(w,h);}
function drawDriving(w,h){
 const d=drive,c=DRIVING_MISSIONS[d.index],scale=Math.min(w/720,h/1050),worldH=h/scale,carY=worldH*.72,jitter=settings.reduced?0:(Math.random()-.5)*shake;
 ctx.save();ctx.translate((w-720*scale)/2+jitter,0);ctx.scale(scale,scale);const road=images.driving_road,tileH=road.naturalHeight/road.naturalWidth*720,offset=d.distance%tileH;
 for(let y=-tileH+offset;y<worldH;y+=tileH)ctx.drawImage(road,0,y,720,tileH);
 if(d.index===0&&d.distance/c.distance>.45&&d.distance/c.distance<.58){label('↶',170,carY-230,'#ff4e69',42);}
 if(d.mode==='chase'){ctx.fillStyle='#2a0a0a55';ctx.fillRect(0,0,720,worldH);}
 for(const k of d.strikes){const a=k.done?1-(k.t-k.warn)/.35:.25+.35*Math.abs(Math.sin(k.t*14));ctx.fillStyle=k.done?`rgba(255,240,220,${a})`:`rgba(255,60,60,${a})`;ctx.fillRect(k.x-48,0,96,worldH);sprite(images.driving_cars,3,1,k.x,carY-260+Math.sin(k.t*8)*6,110);}
 for(const hazard of d.hazards){const y=carY-(hazard.at-d.distance);if(y<-170||y>worldH+170||hazard.hit||!hazardVisible(d,hazard))continue;sprite(images.driving_cars,3,d.index>2?2:d.index,hazard.x,y+65,120);}
 for(const stop of d.stops){const y=carY-(stop.at-d.distance);if(y<-120||y>worldH+130)continue;const chalk=d.index===4,color=stop.done?'#bcffe8':chalk?'#f4f1e6':c.stopKind==='pass'?'#70e6ff':'#a8ffb0';circle(stop.x,y,64,color+'22');circle(stop.x,y,61,color,true,4);
  if(chalk){circle(stop.x-14,y,8,'#f4f1e6');circle(stop.x+14,y,8,'#f4f1e6');}else sprite(images.district_props,c.stopKind==='pass'?1:2,c.stopKind==='pass'?3:2,stop.x,y+24,65);
  label(stop.done?(c.stopKind==='hold'?'A BORDO':'PRESO'):chalk?'GESSO':c.stopKind==='pass'?'SEGNALE':'FRENA E FERMATI',stop.x,y-72,color,15);if(stop.hold>0)line(stop.x-40,y+68,stop.x-40+80*Math.min(1,stop.hold/.8),y+68,'#dcffba',6);}
 ctx.save();ctx.translate(d.x,carY);ctx.rotate(d.vx*.0015);if(d.inv<=0||settings.reduced||Math.floor(d.time*12)%2===0){if(d.vehicle==='truck')sprite(images.driving_cars,3,3,0,65,150);else sprite(images.driving_cars,2,d.hp>=4?0:d.hp===3?1:d.hp>0?2:3,0,65,135);}ctx.restore();
 if(d.mode==='dark'){ctx.save();const vx=d.x-380,vy=carY-120-520;ctx.drawImage(vignette,vx,vy,760,1040);ctx.fillStyle='rgba(2,3,8,.93)';ctx.fillRect(0,0,720,Math.max(0,vy));ctx.fillRect(0,vy+1040,720,worldH);ctx.fillRect(0,vy,Math.max(0,vx),1040);ctx.fillRect(vx+760,vy,720,1040);if(d.pulse>0){const r=(1.1-d.pulse)*1100+120;ctx.strokeStyle=`rgba(255,127,216,${d.pulse/1.1})`;ctx.lineWidth=5;ctx.beginPath();ctx.arc(d.x,carY,r,Math.PI*1.1,Math.PI*1.9);ctx.stroke();}ctx.restore();
  for(const hazard of d.hazards){const y=carY-(hazard.at-d.distance);if(hazard.seen&&!hazard.hit&&y>-60&&y<carY-120){ctx.strokeStyle='#ff7fd8aa';ctx.lineWidth=2;ctx.strokeRect(hazard.x-40,y+10,80,110);}}}
 label((d.driver==='lulu'?'LULÙ':'NOX')+(d.passenger?' · CON LULÙ':d.driver==='lulu'?' · DA SOLA':' · IN SOLITARIA'),d.x,carY+108,d.driver==='lulu'?'#ffd6f3':'#e3f9ff',14);ctx.restore();
 setText('district','GUIDA · '+c.title);setText('objective',c.goal+' · '+Math.min(100,Math.floor(d.distance/c.distance*100))+'%'+(d.stops.length?' · '+d.stops.filter(p=>p.done).length+'/'+d.stops.length:''));showIntegrity(d);
 panel('meter',true);$('meter').classList.toggle('alert',c.limit-d.time<15);$('meter-fill').style.width=Math.max(0,100*(1-d.time/c.limit))+'%';setText('meter-label',Math.max(0,Math.ceil(c.limit-d.time))+' s · '+Math.round(d.speed*.25)+' km/h');panel('bossbar',false);
 if(d.distance/c.distance>.5&&!halfSaid){halfSaid=true;bark('half');}if(d.distance/c.distance>.8&&!lateSaid){lateSaid=true;bark('late');const owner=progress.step;setTimeout(()=>{if(progress?.step===owner)bark('lateb');},2800);setTimeout(()=>{if(progress?.step===owner)bark('latec');},5600);}}
function drawScene(w,h){const sc=scene;if(sc.art){const im=images[sc.art];if(im?.naturalWidth){const k=Math.max(w/im.naturalWidth,h/im.naturalHeight);ctx.drawImage(im,(w-im.naturalWidth*k)/2,(h-im.naturalHeight*k)*(w>h?.25:.5),im.naturalWidth*k,im.naturalHeight*k);}return;}const map=images[DISTRICT_MAPS[sc.map]];if(!map?.naturalWidth)return;const scale=Math.min(w,h)/(w<650?380:520)*sc.zoom;const cx=sc.cam.x-w/scale/2,cy=sc.cam.y-h/scale*(h>w?.3:.42),jitter=settings.reduced?0:(Math.random()-.5)*shake;
 ctx.save();ctx.scale(scale,scale);ctx.translate(-cx+jitter,-cy);ctx.drawImage(map,0,0,SIZE,SIZE);ctx.fillStyle=sc.tint;ctx.fillRect(0,0,SIZE,SIZE);
 if(sc.crack){ctx.strokeStyle='#ffdca8';ctx.lineWidth=6;ctx.shadowColor='#ff9d5c';ctx.shadowBlur=20;ctx.beginPath();ctx.moveTo(770,380);for(let i=1;i<=10;i++){const k=i/10;if(k>sc.crack)break;ctx.lineTo(770+(i%2?18:-14),380+k*520);}ctx.stroke();ctx.shadowBlur=0;}
 for(const a of sc.cast){ctx.globalAlpha=a.alpha;circle(a.x,a.y,19,'#00000060');const breathe=Math.sin(performance.now()/600+a.x)*1.5;sprite(images[a.atlas||a.name+'_walk'],a.row,a.col,a.x,a.y+breathe,112,a.flip);ctx.globalAlpha=1;}
 if(sc.strangers)drawStrangers([{id:'kairn',x:710,y:610},{id:'morrow',x:840,y:610,face:-1}],performance.now()/1000);ctx.restore();
 if(sc.rain&&!settings.reduced){ctx.strokeStyle='#bfe8ff22';ctx.lineWidth=1;for(let i=0;i<70;i++){const x=(i*97+performance.now()*.35)%(w+60)-30,y=(i*53+performance.now()*.9)%(h+40)-20;line(x,y,x-6,y+16,'#bfe8ff2a',1);}}
 if(sc.dawn){const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(255,170,110,.22)');g.addColorStop(1,'rgba(255,170,110,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}}
function render(){const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,mode==='foot'||mode==='drive'||mode==='race'||mode==='hub'||mode==='escape'||mode==='openingWalk'?Math.min(renderQuality,w>h?1.25:1.75):1.75);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#05080e';ctx.fillRect(0,0,w,h);if(!loaded)return;
 if(['hub','escape','openingWalk'].includes(mode)&&state)drawExploration(w,h);else if(mode==='drive'&&drive)drawDriving(w,h);else if(mode==='race'&&race)drawRace(w,h);else if(mode==='foot'&&state)drawFoot(w,h);else if(mode==='scene'&&scene)drawScene(w,h);}
const frameSamples=[];let frameSerial=0,renderQuality=1.75,qualitySlow=0;const qualityWindow=[];
// ---------- Fault recovery (Q1: R1, R2, R4) ----------
// Three faults inside 5 s, or one rejected promise (a flow has already died), open the recovery panel.
// No persist() on a fault: the last checkpoint written before it is the one that reloads (D35, documented choice).
const faultMonitor=createFaultMonitor({now:()=>performance.now()});let faultShown=false;
function fault(error,source,immediate=false){const verdict=faultMonitor.record(error,source);if(faultShown)return;console.error('CHRONOS fault ('+source+')',error);if(verdict!=='recover'&&!immediate)return;faultShown=true;running=false;clearControls();silence();panel('fault-panel',true);$('fault-reload').focus();}
$('fault-reload').onclick=()=>location.reload();
window.addEventListener('error',e=>fault(e.error??e.message,'error'));
window.addEventListener('unhandledrejection',e=>fault(e.reason,'unhandledrejection',true));
function frameStep(t){const frameStart=performance.now(),gap=last?t-last:0;const rawDt=Math.min(.05,(t-last)/1000||0);last=t;const slow=(focusTime>0&&!settings.reduced?.4:1)*(tutorial?.slow?.35:1);const dt=rawDt*slow;focusTime=Math.max(0,focusTime-rawDt);for(const [id,h] of hitstops)if(!hitstopStep(h,rawDt))hitstops.delete(id);if(gamepadSeen)pollGamepad();
 if(running&&!paused&&!uiLock&&!document.hidden){
  if(mode==='drive'&&drive){driveTick(drive,{steer:clamp(stick.x+(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0),-1,1),throttle:drivingPointers.accelerate.size||drivingKeys.has('accelerate')||keys.has('KeyW')||keys.has('ArrowUp')?1:0,brake:drivingPointers.brake.size||drivingKeys.has('brake')||keys.has('KeyS')||keys.has('ArrowDown')?1:0,pulse:pulse||keys.has('KeyP')},dt);pulse=false;
   for(const e of drive.events){if(e.type==='driveHit'){audio('zara');if(!settings.reduced)shake=e.kind==='strike'?8:4;}else if(e.type==='checkpoint'||e.type==='pickup'){audio('choice');if(e.type==='pickup')bark('pickup',false);}else if(e.type==='strikeWarn')audio('dodge');else if(e.type==='pulse')audio('hit');else if(e.type==='driveCleared'||e.type==='driveFailed'){running=false;showDriveResult();}}}
  else if(mode==='race'&&race){tickRaceV9(race.s,{steer:clamp(stick.x+(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0),-1,1),throttle:drivingPointers.accelerate.size||drivingKeys.has('accelerate')||keys.has('KeyW')||keys.has('ArrowUp')?1:0,brake:drivingPointers.brake.size||drivingKeys.has('brake')||keys.has('KeyS')||keys.has('ArrowDown')?1:0,nitro:nitroQueued||keys.has('Space')||keys.has('ShiftLeft')},dt);nitroQueued=false;for(const e of race.s.events)raceFx(e);if(['finished','retired','eliminated'].includes(race.s.status))finishHubRace();}
  else if(['hub','escape','openingWalk'].includes(mode)&&state){updateExploration(dt);}
  else if(mode==='foot'&&state){tick(state,footInputs(),dt);pending=null;interact=dash=special=weaponChange=weaponReload=false;for(const e of state.events)eventFx(e);updateTutorial();if(state?.allies&&state.allyTime<=0)leaveStrangers();}
  if(progress)progress.stats.seconds+=rawDt;acc+=rawDt;if(acc>10){persist();acc=0;}}
 if(state?.status==='cleared'&&!running&&!paused&&!document.hidden)for(const e of state.enemies)if(e.hp<=0)e.deathAnim=Math.max(0,e.deathAnim-dt);
 for(const f of chronoFxPool)f.life=Math.max(0,f.life-dt);
 for(const f of fx){f.life-=dt;if(f.type==='spark'){f.x+=f.vx*dt;f.y+=f.vy*dt;}if(f.type==='text')f.y-=25*dt;}fx=fx.filter(f=>f.life>0);shake=Math.max(0,shake-rawDt*28);updateBark(rawDt);
 syncSoundscape(rawDt);render();const cost=performance.now()-frameStart;frameSamples.push({id:++frameSerial,cost,gap,ratio:canvas.width/innerWidth,voices:audioDirector.voices.size});
 // Respond to repeated spikes as well as sustained load, while ignoring isolated GC pauses.
 if(running&&!paused&&!uiLock&&(mode==='foot'||mode==='drive'||mode==='hub'||mode==='escape'||mode==='openingWalk')){qualityWindow.push(cost);if(cost>10)qualitySlow++;if(qualityWindow.length>30&&qualityWindow.shift()>10)qualitySlow--;if(qualitySlow>=2&&renderQuality>1){renderQuality=Math.max(1,renderQuality-.5);qualityWindow.length=0;qualitySlow=0;}}
 if(frameSamples.length>600)frameSamples.shift();}
const frame=guardedFrame(frameStep,next=>requestAnimationFrame(next),error=>fault(error,'frame'));
requestAnimationFrame(frame);

// ---------- Boot ----------
window.addEventListener('pointerdown',()=>audioDirector.unlock());
window.addEventListener('keydown',()=>audioDirector.unlock());
document.addEventListener('click',e=>{if(e.target.closest('button')&&!e.target.closest('#controls,#driving-controls'))audioDirector.sfx('ui');});
imageReady.then(()=>{loaded=true;localeView.write($('loading'),'Storia completa offline · nessuna pubblicità');}).catch(e=>{localeView.write($('loading'),'Asset non disponibile: '+e.message);});
playStudio().then(showMenu);
// Read-only hooks for automated verification; they expose copies, never live state.
window.cityAdventure={locale:()=>({language:settings.language,...localeStatus()}),performance:()=>frameSamples.map(s=>({...s})),snapshot:()=>JSON.parse(JSON.stringify(mode==='drive'&&drive?{mode:'driving',driving:drive}:mode==='race'&&race?{mode:'race',race:race.s}:state?{...state,c:{id:state.c.id,layout:state.c.layout,mode:state.c.mode,zone:state.c.zone,boss:!!state.c.boss,dark:!!state.c.dark},mode,hub:mode==='hub'?progress.world.hub.id:null,points:mode==='hub'?hubPoints(progress.world.hub.id,progress):undefined}:{mode})),view:()=>({...camera}),progress:()=>progress?JSON.parse(saveProgress(progress)):null,controls:()=>({keys:[...keys].sort(),stick:{...stick},aim:aimTouch?{...aimTouch}:null,pending:pending?{...pending}:null,gamepad:{seen:gamepadSeen,move:{...gamepadState.move},aim:gamepadState.aim?{...gamepadState.aim}:null,held:{...gamepadState.held},preview:gamepadAim?{...gamepadAim}:null},actions:{interact,dash,special,pulse},driving:{acceleratePointers:drivingPointers.accelerate.size,brakePointers:drivingPointers.brake.size,keys:[...drivingKeys].sort()}}),status:()=>({mode,running,paused,uiLock,dialogue:!$('talk').hidden,loaded,lifecycleMuted,saveSource,chrono:{...chronoArt.status(),fxActive:chronoFxPool.filter(f=>f.life>0).length,fxCapacity:chronoFxPool.length},musicPaused:audioDirector.status().musicPaused,audio:audioDirector.status(),step:progress?CAMPAIGN[progress.step].id:null,faults:faultMonitor.status()})};
