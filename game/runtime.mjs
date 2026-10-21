import {drawLegacySprite,ChronoArtBank,chronoAnimation,drawChronoFrame,chronoEnemyPose} from './chrono-art.mjs';
import {getLayout} from './layouts.mjs';
import {buildMapSurface} from './scenery.mjs';
import {AudioDirector,musicalState} from './audio-engine.mjs';
import {DRIVING_MISSIONS,LANES,newDrive,driveTick,hazardVisible} from './driving.mjs';
import {heroFrame,enemyFrame,mirrorFrame,frameCamera,DISTRICT_ART,DISTRICT_MAPS,BOSS_NAMES} from './visuals.mjs';
import {SIZE,GUN_RANGE,clamp,distance,unit,newRun,aimAt,trace,tick,cityOutcome,resumeAtBoss} from './campaign.mjs';
import {applyBeat,V07_BEATS} from './narrative.mjs';
import {CAMPAIGN,FOOT,ACTS,stepPov,buildMission,newProgress,saveProgress,loadProgress} from './missions.mjs';
import {SPEAKERS,STORY,BARKS,CHOICES,EPILOGUE,REACTIONS,resolveLines,resolveBark,reunionTier} from './story-v08.mjs';
const $=id=>document.getElementById(id),canvas=$('world'),ctx=canvas.getContext('2d',{alpha:false});

// ---------- Assets ----------
const images={},imageJobs={};const chronoArt=new ChronoArtBank();let loaded=false;
const LEGACY_ART=new Set(['city','port','clinic','fracture','car']);
function artPath(name){if(name==='reunion_art')return 'art/v09/reunion.png';if(name.endsWith('_art'))return `art/v09/${name.slice(0,-4)}.svg`;return LEGACY_ART.has(name)?`art/${name}.png`:name==='portraits'?'art/v08/portraits.png':`art/v05/${name}.png`;}
function loadImage(name){if(imageJobs[name])return imageJobs[name];imageJobs[name]=new Promise((resolve,reject)=>{const im=new Image();images[name]=im;im.onload=()=>resolve(im);im.onerror=()=>{delete imageJobs[name];reject(new Error(name));};im.src=artPath(name);});return imageJobs[name];}
const CORE_ART=['city','car','nox_walk','lulu_walk','nox_actions','lulu_actions','nox_gun','lulu_gun','nox_magic','lulu_magic','fx_atlas','district_props','portraits'];
const imageReady=Promise.all(CORE_ART.map(loadImage));
// Only the active district's map and enemy atlas stay decoded; phones have little texture memory.
async function prepareDistrict(map,kind,extra=[],skipEnemy=false){
 const want=new Set([DISTRICT_MAPS[map],...(!skipEnemy?[DISTRICT_ART[kind]]:[]),...extra]);
 await Promise.all([...want].map(loadImage));
 for(const name of [...DISTRICT_MAPS,...DISTRICT_ART,'driving_cars','driving_road'])if(!want.has(name)&&!CORE_ART.includes(name)&&images[name]){images[name].src='';delete images[name];delete imageJobs[name];delete tints[name];}
}
// Tinted copies are rendered once: EVE-Prime wears Nox's body, Archon wears the Custodi's.
const tints={};
function tinted(source,key,color){if(tints[key])return tints[key];const im=images[source];if(!im?.naturalWidth)return null;const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d');g.drawImage(im,0,0);g.globalCompositeOperation='source-atop';g.fillStyle=color;g.fillRect(0,0,c.width,c.height);tints[key]=c;return c;}
function atlas(name){if(name.startsWith('eve_'))return tinted('nox_'+name.slice(4),name,'#ff2a4a8c');if(name==='archon')return tinted('custodian_states','archon','#ffd9809a');return images[name];}

// ---------- Persistent state ----------
const STORE='city-adventure-progress-v6',LEGACY_STORES=['city-adventure-campaign-v5','city-adventure-districts-v4'];
let progress=null,saved=null,mode='boot',state=null,drive=null,running=false,paused=false,uiLock=0,last=0,acc=0,camera={x:0,y:0,scale:1},fx=[],shake=0,focusTime=0;
let settings={sound:true,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches};
try{settings={...settings,...JSON.parse(localStorage.getItem('city-v4-settings')||'{}')};}catch{}
function readSave(){try{const v6=localStorage.getItem(STORE);if(v6)return loadProgress(v6);for(const key of LEGACY_STORES){const raw=localStorage.getItem(key);const p=raw&&loadProgress(raw);if(p)return p;}}catch{}return null;}
saved=readSave();
function persist(){if(!progress)return false;try{localStorage.setItem(STORE,saveProgress(progress));saved=loadProgress(localStorage.getItem(STORE));for(const key of LEGACY_STORES)localStorage.removeItem(key);return true;}catch{notice('Salvataggio non disponibile: mantieni aperta la partita.');return false;}}
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
  if(musicClock>.5){musicClock=0;const authored=CAMPAIGN[progress.step].music,base=authored==='danger'?state.hero==='lulu'?'lulu':'nox':authored;const cue=musicalState({base,tension:threatened?1:musicQuiet<5?.2:0,quietFor:musicQuiet,joined:state.mission==='finale'&&!!state.partner});soundtrack(cue);}
  if(state.walk-lastStepSound>2.5){lastStepSound=state.walk;audioDirector.sfx('step');}
 }else if(mode==='drive'&&drive)audioDirector.engineSpeed(drive.speed);
}

// ---------- Small UI helpers ----------
const textCache={};
function setText(id,value){if(textCache[id]!==value){textCache[id]=value;$(id).textContent=value;}}
function panel(id,show){$(id).hidden=!show;}
// A notice stays readable for at least 1.4 s; a newer one waits instead of erasing it (latest wins).
let noticeAt=-1e9;
function notice(t){const el=$('notice'),wait=noticeAt+1400-performance.now();if(el.classList.contains('on')&&wait>0&&el.textContent!==t){clearTimeout(notice.later);notice.later=setTimeout(()=>notice(t),wait);return;}
 noticeAt=performance.now();el.textContent=t;el.classList.add('on');clearTimeout(notice.timer);notice.timer=setTimeout(()=>el.classList.remove('on'),3200);}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function portraitClass(el,speaker){const sp=SPEAKERS[speaker]||SPEAKERS[''];el.className='portrait'+(sp.portrait==null?' none':sp.portrait?' p'+sp.portrait:'');return sp;}
function lock(){uiLock++;clearControls();}
function unlock(){uiLock=Math.max(0,uiLock-1);canvas.focus();}

// Dialogue: one box, portrait + speaker color; resolves after the last line.
function say(lines){lines=(lines||[]).filter(Boolean);if(!lines.length)return Promise.resolve();lock();panel('talk',true);let i=0;
 return new Promise(resolve=>{const show=()=>{const item=lines[i];const sp=portraitClass($('talk').querySelector('.portrait'),item.speaker);$('talk').firstElementChild.style.setProperty('--speaker',sp.color);$('speaker').textContent=item.speaker||' ';$('line').textContent=item.text;$('next-line').textContent=i===lines.length-1?'Continua':'Avanti';};
  const next=e=>{e?.stopPropagation();if(i<lines.length-1){i++;show();return;}$('talk').firstElementChild.onclick=null;$('next-line').onclick=null;panel('talk',false);unlock();resolve();};
  $('talk').firstElementChild.onclick=next;$('next-line').onclick=next;show();$('next-line').focus();});}
// Choices write once into the narrative state; a resumed save never asks twice.
function choose(id){const def=CHOICES[id],n=progress.narrative;if(n.choices[id])return Promise.resolve(n.choices[id]);lock();panel('choice',true);$('choice-title').textContent=def.title;const box=$('choice-options');box.textContent='';
 return new Promise(resolve=>{for(const [key,opt] of Object.entries(def.options)){const b=document.createElement('button');b.innerHTML='<b></b><small></small>';b.querySelector('b').textContent=opt.label;b.querySelector('small').textContent=opt.hint;
  b.onclick=()=>{if(n.choices[id])return;for(const [k,v] of Object.entries(opt.writes||{}))n.flags[k]=v;if(Number.isFinite(opt.thermalDelta))n.thermal=clamp(Math.round(n.thermal+opt.thermalDelta),0,100);n.choices[id]=key;persist();audio('choice');panel('choice',false);unlock();resolve(key);};box.appendChild(b);}
  box.firstChild.focus();});}
function holdButton({kicker,title,text,label,ms=1200}){lock();panel('hold',true);$('hold-kicker').textContent=kicker;$('hold-title').textContent=title;$('hold-text').textContent=text;$('hold-label').textContent=label;const b=$('hold-button'),fill=$('hold-fill');fill.style.width='0';
 return new Promise(resolve=>{let start=null,raf=0;const step=t=>{if(start==null)return;const k=Math.min(1,(t-start)/ms);fill.style.width=(k*100)+'%';if(k>=1){cleanup();panel('hold',false);unlock();audio('choice');resolve();return;}raf=requestAnimationFrame(step);};
  const down=e=>{e.preventDefault();start=performance.now();raf=requestAnimationFrame(step);};const up=()=>{start=null;cancelAnimationFrame(raf);fill.style.width='0';};
  const cleanup=()=>{b.onpointerdown=b.onpointerup=b.onpointerleave=b.onpointercancel=b.onkeydown=b.onkeyup=null;};
  b.onpointerdown=down;b.onpointerup=b.onpointerleave=b.onpointercancel=up;b.onkeydown=e=>{if((e.code==='Space'||e.code==='Enter')&&start==null)down(e);};b.onkeyup=up;b.focus();});}
function knock(prompt){lock();panel('knock',true);$('knock-prompt').textContent=prompt;const count=$('knock-count');count.className='';let n=0;
 return new Promise(resolve=>{$('knock-surface').onclick=()=>{n++;audio('knock');shake=settings.reduced?0:4;count.className=n===1?'one':'two';if(n>=2){$('knock-surface').onclick=null;setTimeout(()=>{panel('knock',false);unlock();resolve();},500);}};$('knock-surface').focus();});}
// The card answers three questions before play: who leads, what to do, and that progress is safe.
function showCard(step,savedOk=true){const pov=stepPov(step),card=$('card');lock();
 const name=step.type==='foot'?FOOT[step.id].name:step.type==='drive'?DRIVING_MISSIONS[step.drive].title:step.title;
 card.className=pov;$('card-act').textContent=ACTS[step.act];$('card-title').textContent=name.replace(/^\d+ · /,'');
 const label=pov==='both'?'NOX + LULÙ':pov==='lulu'?'LULÙ':'NOX';$('card-pov').querySelector('span').textContent=step.type==='drive'?label+' · ALLA GUIDA':label;
 portraitClass($('card-pov').querySelector('.portrait'),pov==='lulu'?'LULÙ':'NOX');if(pov==='both')$('card-pov').querySelector('.portrait').className='portrait none';
 const goal=step.type==='foot'?buildMission(step.id,flags(),progress.cityChoice).goal:step.type==='drive'?DRIVING_MISSIONS[step.drive].brief:'';$('card-goal').textContent=goal;panel('card-goal',!!goal);
 $('card-meta').textContent=`Tappa ${CAMPAIGN.indexOf(step)+1}/${CAMPAIGN.length}`+(savedOk?' · ✓ Progressi salvati':'');
 panel('card',true);
 return new Promise(resolve=>{let done=false;const close=()=>{if(done)return;done=true;card.onclick=null;panel('card',false);unlock();resolve();};card.onclick=close;setTimeout(close,goal?4200:2600);});}
// Barks never pause play: a queue of short lines with portraits.
const barkQueue=[];let barkTimer=0,barksSaid=new Set();
function bark(key,once=true){const step=CAMPAIGN[progress?.step];const table=BARKS[step?.id];if(!table)return;const id=step.id+':'+key;if(once&&barksSaid.has(id))return;const line=resolveBark(table[key],flags());if(!line)return;barksSaid.add(id);barkQueue.push(line);audioDirector.sfx('radio');}
function updateBark(dt){if(barkTimer>0){barkTimer-=dt;if(barkTimer<=0)panel('bark',false);}if(barkTimer<=0&&barkQueue.length&&!uiLock){const line=barkQueue.shift(),sp=portraitClass($('bark').querySelector('.portrait'),line.speaker);$('bark').querySelector('small').textContent=line.speaker;$('bark').querySelector('small').style.color=sp.color;$('bark').querySelector('span').textContent=line.text;panel('bark',true);barkTimer=Math.max(2.6,line.text.length*.055);}}

// ---------- Flow ----------
function hideGameplay(){for(const id of ['hud','controls','driving-controls','bossbar','bark','hint','result','talk','choice','hold','knock','city-choice','city-return','pause-panel','card'])panel(id,false);barkQueue.length=0;barkTimer=0;}
async function newGame(){renderQuality=1.75;qualityWindow.length=0;qualitySlow=0;progress=newProgress();barksSaid=new Set();persist();await enterStep(0);}
async function continueGame(){renderQuality=1.75;qualityWindow.length=0;qualitySlow=0;progress=loadProgress(saveProgress(saved));barksSaid=new Set();await enterStep(progress.step,progress.status==='cleared');}
let runId=0;
async function enterStep(i,resumeCleared=false){
 const id=++runId;running=false;paused=false;state=null;drive=null;uiLock=0;hideGameplay();panel('menu',false);panel('ending',false);
 const step=CAMPAIGN[i];progress.step=i;if(!resumeCleared)progress.status='playing';const savedOk=persist();
 if(settings.sound&&!lifecycleMuted)audioDirector.resume();musicQuiet=10;musicClock=0;audioDirector.setAmbience(null);soundtrack(step.music);mode='card';await showCard(step,savedOk);if(id!==runId)return;
 if(step.type==='scene'){if(resumeCleared){await completeStep();return;}mode='scene';await playScene(step.id);if(id!==runId)return;await completeStep();return;}
 if(resumeCleared){await afterCleared(step);return;}
 if(step.type==='foot')await startFoot(step,true);else await startDrive(step,true);
}
async function completeStep(){audioDirector.sfx('save');progress.status='cleared';progress.checkpoint=null;persist();if(progress.step>=CAMPAIGN.length-1){showEnding();return;}progress.step++;progress.status='playing';persist();await enterStep(progress.step);}
let tutorial=null,lowHpWarned=false,halfSaid=false,lateSaid=false,overdriveSaid=false;
async function startFoot(step,first){
 const def=buildMission(step.id,flags(),progress.cityChoice);
 const extra=[];
 try{await prepareDistrict(def.map,def.kind,extra,def.kind===3&&def.boss?.kind!=='custode');await chronoArt.prepare(def.kind,def.boss?.kind==='archon');await audioDirector.preloadChrono(def.kind);}catch(e){notice('Risorsa non disponibile: '+e.message);return;}
 activeMapSurface=def.layout?buildMapSurface(getLayout(def.layout),images[DISTRICT_MAPS[def.map]],images.district_props,def.palette,chronoArt.get('environment'),def.kind):null;
 lastStepSound=0;audioDirector.setAmbience(audioDirector.chronoAmbience?'chrono_'+audioDirector.chronoAmbience:def.dark?'dark':def.map===1?'port':'city');
 state=newRun(def.pov,def.map,progress.upgrade,progress.cityChoice,progress.narrative,def);
 const atBoss=progress.checkpoint==='boss'&&resumeAtBoss(state);
 prepareMapRasters();mode='foot';fx=[];for(const f of chronoFxPool)f.life=0;lowHpWarned=halfSaid=lateSaid=overdriveSaid=false;
 document.body.classList.toggle('lulu-pov',def.pov==='lulu');
 panel('hud',true);panel('controls',true);panel('driving-controls',false);configureControls();
 if(first)await say(resolveLines(STORY[step.pre],flags()));
 if(step.id==='blackout'&&!memo('city-tutorial-v8'))tutorial={step:'move',from:{x:state.x,y:state.y},slow:false};else tutorial=null;
 bark('start');if(def.ally==='unit9'){bark('unit9');setTimeout(()=>bark('unit9b'),4000);}
 if(atBoss){audioDirector.sfx('suspense_boss');notice('Checkpoint: '+BOSS_NAMES[def.boss.kind]+'. I dispositivi restano attivi.');}
 lastHurt=null;running=true;paused=false;
}
function configureControls(){frameInsets=null;const s=state,c=s.c;const unlocked=c.magic||s.hero==='lulu';panel('magic',unlocked);$('magic').dataset.label=s.hero==='lulu'?'RISONANZA':'PULSE';
 $('duo').dataset.label=s.signature==='duo'?'DUO':s.signature==='overdrive'?'BLACK PULSE':'BARRIERA';panel('duo',s.signature!=='duo'||memo('city-duo-seen-v8'));panel('interact',false);}
async function onFootEnd(){const s=state,step=CAMPAIGN[progress.step];running=false;clearControls();
 if(s.status==='failed'){progress.stats.deaths++;persist();await wait(700);const boss=progress.checkpoint==='boss'&&s.c.boss;
  showResult({tag:'RIPROVIAMO',title:'Nessuno resta indietro.',text:(boss?'Riparti dallo scontro con '+BOSS_NAMES[s.c.boss.kind]+', con la salute piena: i dispositivi restano attivi.':'Riparti dall’inizio della missione, con la salute piena.')+' Le scelte fatte restano.',tip:DEFEAT_TIPS[lastHurt]||'',retry:true});return;}
 await wait(900);progress.status='cleared';progress.checkpoint=null;persist();await afterCleared(step);}
// What hit the hero last decides the one tip shown after a defeat.
const DEFEAT_TIPS={melee:'Il cerchio rosso segna dove cadrà il colpo: esci dal cerchio o SCHIVA mentre si chiude.',charge:'La fascia rossa annuncia una carica: spostati di lato prima che parta.',shot:'La linea tratteggiata segna un proiettile: mettiti dietro un muro o SCHIVA attraverso il colpo.'};
let lastHurt=null;
async function afterCleared(step){
 running=false;panel('controls',false);panel('bossbar',false);
 if(step.type==='drive'){showDriveResult();return;}
 await say(resolveLines(STORY[step.post],flags()));
 if(step.choice==='blackout_power'){if(!progress.cityChoice)await chooseCityPanel();}
 else if(step.choice){const pick=await choose(step.choice);await say(resolveLines(STORY[REACTIONS[step.choice]?.[pick]],flags()));}
 if(step.id==='breach')applyBeat(progress.narrative,V07_BEATS.breach_helios_promise)&&persist();
 const def=FOOT[step.id],nextFoot=CAMPAIGN.slice(progress.step+1).some(s=>s.type==='foot');
 showResult({tag:'MISSIONE COMPIUTA',title:def.name,text:def.end,upgrades:nextFoot});
}
function showResult({tag,title,text,tip='',retry=false,upgrades=false,next=false,nextLabel='Avanti'}){lock();panel('result',true);$('result-tag').textContent=tag;$('result-title').textContent=title;$('result-text').textContent=text;$('result-tip').textContent=tip;panel('result-tip',!!tip);panel('upgrades',upgrades&&!retry);panel('retry',retry);panel('next',!retry&&(!upgrades||next));$('next').textContent=nextLabel;(retry?$('retry'):upgrades?$('power'):$('next')).focus();}
for(const type of ['power','shield'])$(type).onclick=()=>{if($('result').hidden)return;progress.upgrade=type;panel('result',false);unlock();completeStep();};
$('next').onclick=()=>{if($('result').hidden)return;panel('result',false);unlock();const step=CAMPAIGN[progress.step];if(step.id==='escape'&&progress.cityChoice&&!$('city-return').dataset.shown){showCity();return;}completeStep();};
$('retry').onclick=()=>{if($('result').hidden)return;panel('result',false);unlock();restartMission();};
function restartMission(){if(settings.sound&&!lifecycleMuted)audioDirector.resume(true);musicQuiet=10;const step=CAMPAIGN[progress.step];hideGameplay();if(step.type==='foot')startFoot(step,false);else if(step.type==='drive')startDrive(step,false);}
function chooseCityPanel(){lock();panel('city-choice',true);$('choose-workshop').focus();return new Promise(resolve=>{for(const choice of ['workshop','shelter'])$('choose-'+choice).onclick=()=>{if(progress.cityChoice)return;progress.cityChoice=choice;flag('blackout_choice',choice);progress.narrative.choices.blackout_power=choice;persist();audio('choice');panel('city-choice',false);unlock();resolve(choice);};});}
function showCity(){const outcome=cityOutcome(progress.cityChoice);if(!outcome){completeStep();return;}lock();$('city-return').dataset.shown='1';$('city-title').textContent=outcome.title;$('city-return-text').textContent=outcome.returnText;$('site-workshop').classList.toggle('lit',progress.cityChoice==='workshop');$('site-shelter').classList.toggle('lit',progress.cityChoice==='shelter');panel('city-return',true);$('city-close').focus();}
$('city-close').onclick=()=>{panel('city-return',false);unlock();completeStep();};

// ---------- Driving ----------
async function startDrive(step,first){
 try{await Promise.all([loadImage('driving_cars'),loadImage('driving_road')]);}catch(e){notice('Guida non caricata: '+e.message);return;}
 chronoArt.clear();drive=newDrive(step.drive,progress.cityChoice);state=null;audioDirector.setAmbience('drive');mode='drive';fx=[];halfSaid=lateSaid=false;delete $('city-return').dataset.shown;
 document.body.classList.toggle('lulu-pov',drive.driver==='lulu');
 panel('hud',true);panel('controls',false);panel('driving-controls',true);panel('pulse',drive.mode==='dark');
 if(first)await say(resolveLines(STORY[step.pre],flags()));
 running=true;paused=false;
}
function showDriveResult(){const d=drive,step=CAMPAIGN[progress.step];running=false;clearControls();
 if(d&&d.status==='failed'){progress.stats.deaths++;persist();showResult({tag:'LA CORSA NON È FINITA',title:'Riprova la corsa',text:d.reason,retry:true});return;}
 progress.status='cleared';persist();
 const text=step.drive===3?'Il camion esce dall’anello. Dietro, i droni perdono la traccia.':step.drive===4?'La Vortex esce dal tunnel. Il posto accanto è ancora vuoto.':'Nox parcheggia la Vortex. Lulù prepara l’equipaggiamento.';
 showResult({tag:'GUIDA COMPLETATA',title:step.drive>2?'Fuori.':'Siete arrivati. Insieme.',text,next:true});}

// ---------- Scenes ----------
let scene=null;
function sceneCast(list){return list.map(a=>({alpha:1,walk:0,row:0,col:0,flip:false,...a}));}
async function playScene(id){chronoArt.clear();
 if(id==='opening'){await runOpening();return;}
 const map=id==='rooftop'?1:3;try{await prepareDistrict(map,map===1?1:3,id==='reunion'?['reunion_art']:[]);}catch(e){notice('Risorsa non disponibile: '+e.message);}
 if(id==='rooftop'){
  scene={map,tint:'#030a14b0',cam:{x:770,y:330},zoom:1.25,cast:sceneCast([{name:'nox',x:715,y:340,row:2},{name:'lulu',x:825,y:340,row:2,flip:true}]),rain:true};
  await say([{speaker:'LULÙ',text:'Cinque minuti. Poi il distretto clinico.'},{speaker:'LULÙ',text:'Quel vetro. Dalla cassa hai preso solo quello. Perché lo tieni?'}]);
  const g=await choose('rooftop_glass');await say(g==='truth'?[{speaker:'LULÙ',text:'È la cosa più umana che ti abbia sentito dire.'}]:[{speaker:'LULÙ',text:'Va bene anche non saperlo. Per ora.'}]);
  await say([{speaker:'LULÙ',text:'Posso chiederti una cosa difficile?'},{speaker:'NOX',text:'Lo stai già facendo.'}]);
  const a=await choose('rooftop_ask');
  await say(a==='them'?[{speaker:'LULÙ',text:'Lo dici come se fosse facile.'},{speaker:'NOX',text:'Non lo è. Ma è giusto.'}]:[{speaker:'LULÙ',text:'E se non c’è tempo?'},{speaker:'NOX',text:'Allora trova il tempo.'}]);
  await say([{speaker:'LULÙ',text:'Andiamo. Il clinico chiede aiuto da un’ora.'}]);
 }else if(id==='separation'){
  scene={map,tint:'#12041cb0',cam:{x:770,y:600},zoom:1.2,cast:sceneCast([{name:'nox',x:705,y:610,row:2},{name:'lulu',x:835,y:610,row:2,flip:true}]),crack:0};
  await say(resolveLines(STORY.separation,flags()));
  scene.collapse=true;shake=settings.reduced?0:9;audio('zara');const nox=scene.cast[0],lulu=scene.cast[1];nox.atlas='nox_actions';nox.row=1;lulu.atlas='lulu_actions';lulu.row=0;
  for(let k=0;k<45;k++){scene.crack=Math.min(1,k/20);if(k>12){nox.row=2;nox.col=Math.min(3,Math.floor((k-12)/6));nox.y+=4;nox.alpha=Math.max(0,1-(k-20)/25);}lulu.col=Math.min(3,Math.floor(k/12));if(k%10===0&&!settings.reduced)shake=6;await wait(45);}
  await say(resolveLines(STORY.separation_after,flags()));
 }else if(id==='reunion'){
  scene={art:'reunion_art',map,tint:'#ffb46a26',dawn:true,cam:{x:770,y:600},zoom:1.2,cast:sceneCast([{name:'nox',x:560,y:610,row:2},{name:'lulu',x:980,y:610,row:2,flip:true}])};
  await wait(settings.reduced?150:1000);
  await say(resolveLines(STORY.reunion_open,flags()));
  const tier=reunionTier(progress.narrative.thermal);flag('reunion_tier',tier);persist();
  await say(resolveLines(STORY['reunion_'+tier],flags()));
  await knock(STORY.reunion_knock[0].text);
  await wait(settings.reduced?150:700);
  await say([{speaker:'NOX',text:STORY.reunion_close[tier]}]);
 }
 scene=null;
}
function moveCast(moves,ms){return new Promise(resolve=>{const start=performance.now(),from=moves.map(([i])=>scene.cast[i].x);const step=t=>{if(!scene)return resolve();const k=Math.min(1,(t-start)/ms);moves.forEach(([i,to],j)=>{const a=scene.cast[i];a.x=from[j]+(to-from[j])*k;a.walk=k*ms/140;a.col=k<1?Math.floor(a.walk)%4:0;});if(k<1)requestAnimationFrame(step);else resolve();};requestAnimationFrame(step);});}
// The opening is the first input of the game: two knocks, answered.
let openingResolve=null,openingKnocks=0,openingStage=0;
function runOpening(){mode='scene';panel('opening',true);openingKnocks=0;openingStage=0;$('opening-surface').hidden=false;$('opening-choice').hidden=true;$('opening-glass').hidden=true;$('opening-crack').className='';$('opening-title').textContent='...';$('opening-prompt').textContent='Se mi senti, batti due volte.';$('opening-count').className='';$('opening-skip').hidden=!memo('city-opening-seen-v1');$('opening-surface').focus();return new Promise(r=>openingResolve=r);}
function finishOpening(){panel('opening',false);remember('city-opening-seen-v1');persist();const r=openingResolve;openingResolve=null;r?.();}
$('opening-surface').onclick=()=>{if(!openingResolve)return;openingKnocks=Math.min(2,openingKnocks+1);$('opening-count').className=openingKnocks===1?'one':'two';const surface=$('opening-surface');surface.classList.remove('thud');void surface.offsetWidth;surface.classList.add('thud');audio('knock');
 if(openingKnocks===1){$('opening-prompt').textContent='…';return;}
 applyBeat(progress.narrative,V07_BEATS.opening_two_knocks);persist();$('opening-crack').className='open';
 setTimeout(()=>{if(!openingResolve)return;$('opening-surface').hidden=true;$('opening-choice').hidden=false;$('opening-title').textContent='ARIA.';$('opening-copy').textContent='Il coperchio si apre. Una ragazza con la giacca verde ti guarda come se avesse corso fin qui. Sulla parete interna: NOX-47. «È il tuo nome?»';$('opening-name').textContent='«Era sulla cassa.»';$('opening-name').focus();},650);};
$('opening-name').onclick=()=>{if(!openingResolve)return;
 if(openingStage===0){openingStage=1;$('opening-copy').textContent='«Non è la stessa cosa.»';$('opening-name').textContent='«Adesso sì.»';return;}
 applyBeat(progress.narrative,V07_BEATS.opening_name);persist();$('opening-choice').hidden=true;$('opening-glass').hidden=false;$('opening-title').textContent='NOX.';$('opening-glass').querySelector('p').textContent='Tra la polvere c’è un frammento di vetro levigato. Non contiene dati. Non apre porte. Non serve a nulla.';$('opening-pick').hidden=false;$('opening-pick').focus();};
$('opening-pick').onclick=()=>{if(!openingResolve)return;applyBeat(progress.narrative,V07_BEATS.glass_pickup);persist();audio('choice');$('opening-pick').hidden=true;$('opening-title').textContent='—';$('opening-glass').querySelector('p').textContent='Lo tieni. Fuori, il quartiere si spegne un isolato alla volta.';setTimeout(()=>{if(openingResolve)finishOpening();},1300);};
$('opening-skip').onclick=()=>{if(!openingResolve)return;for(const beat of [V07_BEATS.opening_two_knocks,V07_BEATS.opening_name,V07_BEATS.glass_pickup])applyBeat(progress.narrative,beat);finishOpening();};

// ---------- Ending ----------
function showEnding(){mode='ending';running=false;hideGameplay();$('ending').style.setProperty('--ending-art',`url('art/v09/${reunionTier(progress.narrative.thermal)}.svg')`);audioDirector.setAmbience(null);remember('city-complete-v1');soundtrack('reunion');const f=flags(),list=$('epilogue');list.textContent='';
 for(const line of EPILOGUE){const li=document.createElement('li');li.textContent=line(f);list.appendChild(li);}
 $('ending-line').textContent='Il vetro è sul davanzale. Non serve a niente.';$('ending-line').classList.remove('on');$('credits').classList.remove('on');panel('ending',true);
 [...list.children].forEach((li,i)=>{li.classList.remove('on');setTimeout(()=>li.classList.add('on'),600+i*1500);});
 setTimeout(()=>$('ending-line').classList.add('on'),600+EPILOGUE.length*1500);setTimeout(()=>$('credits').classList.add('on'),1600+EPILOGUE.length*1500);}
$('ending-menu').onclick=()=>{panel('ending',false);showMenu();};

// ---------- Menu & studio ----------
function showMenu(){chronoArt.clear();mode='menu';running=false;paused=false;state=null;drive=null;scene=null;uiLock=0;hideGameplay();panel('opening',false);panel('menu',true);saved=readSave();
 const c=$('continue');c.hidden=!saved;if(saved){const step=CAMPAIGN[saved.step],name=step.type==='foot'?FOOT[step.id].name:step.type==='drive'?DRIVING_MISSIONS[step.drive].title:step.title;c.innerHTML='Continua<small></small>';c.querySelector('small').textContent=(step.id==='reunion'&&saved.status==='cleared'?'Storia completata · rivedi il finale':ACTS[step.act].split(' · ')[0]+' · '+name);}
 if(settings.sound&&!lifecycleMuted)audioDirector.resume();audioDirector.setAmbience(null);soundtrack('title');}
$('start').onclick=()=>{if(!loaded)return;if(saved){panel('restart',true);$('confirm-new').focus();return;}newGame();};
$('confirm-new').onclick=()=>{panel('restart',false);newGame();};$('cancel-new').onclick=()=>panel('restart',false);
$('continue').onclick=()=>{if(loaded&&saved)continueGame();};
$('menu-settings').onclick=()=>{panel('pause-panel',true);panel('restart-mission',false);panel('menu-return',false);$('resume').textContent='Chiudi';$('resume').focus();};
function playStudio(){return new Promise(resolve=>{try{if(sessionStorage.getItem('city-studio-shown')){resolve();return;}sessionStorage.setItem('city-studio-shown','1');}catch{}const el=$('studio');panel('studio',true);let done=false;const end=()=>{if(done)return;done=true;el.classList.add('out');setTimeout(()=>{panel('studio',false);el.classList.remove('out');resolve();},420);};el.onclick=end;setTimeout(end,2700);});}

// ---------- Pause & lifecycle ----------
function canPause(){return running&&!uiLock&&(mode==='foot'||mode==='drive');}
function setPause(v){if(v&&!canPause())return;if(!v&&!paused)return;paused=v;clearControls();panel('pause-panel',v);panel('restart-mission',true);panel('menu-return',true);$('resume').textContent='Riprendi';if(v){persist();audioDirector.pause();$('resume').focus();}else if(settings.sound)audioDirector.resume(true);}
$('pause').onclick=()=>setPause(true);
$('resume').onclick=()=>{if(mode==='menu'){panel('pause-panel',false);return;}setPause(false);};
$('restart-mission').onclick=()=>{paused=false;panel('pause-panel',false);restartMission();};
$('menu-return').onclick=()=>{persist();runId++;showMenu();};
for(const id of ['sound','reduced']){$(id).checked=settings[id];$(id).onchange=()=>{settings[id]=$(id).checked;try{localStorage.setItem('city-v4-settings',JSON.stringify(settings));}catch{}audioDirector.enabled=settings.sound;if(!settings.sound||paused||lifecycleMuted||document.hidden)audioDirector.pause();else audioDirector.resume(true);};}
function suspend(){clearControls();lifecycleMuted=true;if(progress)persist();if(canPause())setPause(true);silence();}
function restoreForeground(){if(!lifecycleMuted)return;lifecycleMuted=false;if(settings.sound&&!paused&&!document.hidden&&mode!=='boot')audioDirector.resume();}
window.addEventListener('blur',suspend);window.addEventListener('focus',restoreForeground);
window.addEventListener('citynativepause',suspend);window.addEventListener('citynativeresume',restoreForeground);
document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend();else restoreForeground();});

// ---------- Input ----------
let keys=new Set(),stick={x:0,y:0,id:null},aimTouch=null,pending=null,interact=false,dash=false,special=false,pulse=false,drivingHeld=new Set();
function clearControls(){drivingHeld.clear();keys.clear();stick={x:0,y:0,id:null};aimTouch=null;pending=null;interact=dash=special=pulse=false;$('knob').style.transform='';$('drive-knob').style.transform='';}
$('interact').onclick=()=>interact=true;$('dash').onclick=()=>dash=true;$('duo').onclick=()=>special=true;$('pulse').onclick=()=>pulse=true;
for(const kind of ['gun','magic']){const b=$(kind);b.onpointerdown=e=>{if(!running||paused||uiLock||aimTouch||mode!=='foot'||state?.status!=='playing')return;e.preventDefault();b.setPointerCapture(e.pointerId);aimTouch={id:e.pointerId,kind,x:e.clientX,y:e.clientY,dir:null};};b.onpointermove=e=>{if(aimTouch?.id!==e.pointerId)return;const d={x:e.clientX-aimTouch.x,y:e.clientY-aimTouch.y};aimTouch.dir=Math.hypot(d.x,d.y)>12?unit(d):null;};b.onpointerup=e=>{if(aimTouch?.id===e.pointerId){pending={kind,dir:aimTouch.dir};aimTouch=null;}};for(const ev of ['pointercancel','lostpointercapture'])b.addEventListener(ev,e=>{if(aimTouch?.id===e.pointerId)aimTouch=null;});b.onkeydown=e=>{if(['Space','Enter'].includes(e.code)&&!e.repeat){e.preventDefault();pending={kind,dir:null};}};}
const stickEl=$('stick');function updateStick(e){const r=stickEl.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2,len=Math.max(35,Math.hypot(x,y));stick.x=x/len;stick.y=y/len;$('knob').style.transform=`translate(${stick.x*32}px,${stick.y*32}px)`;}
stickEl.onpointerdown=e=>{if(stick.id!==null)return;stick.id=e.pointerId;stickEl.setPointerCapture(e.pointerId);updateStick(e);};stickEl.onpointermove=e=>{if(stick.id===e.pointerId)updateStick(e);};for(const ev of ['pointerup','pointercancel','lostpointercapture'])stickEl.addEventListener(ev,e=>{if(stick.id===e.pointerId){stick={x:0,y:0,id:null};$('knob').style.transform='';}});
for(const id of ['accelerate','brake']){const button=$(id);button.onpointerdown=e=>{e.preventDefault();button.setPointerCapture(e.pointerId);drivingHeld.add(id);};for(const ev of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(ev,()=>drivingHeld.delete(id));button.onkeydown=e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();drivingHeld.add(id);}};button.onkeyup=()=>drivingHeld.delete(id);}
const wheel=$('drive-stick');function driveStick(e){const r=wheel.getBoundingClientRect();stick.x=clamp((e.clientX-r.left-r.width/2)/36,-1,1);$('drive-knob').style.transform=`translateX(${stick.x*28}px)`;}
wheel.onpointerdown=e=>{if(stick.id!==null)return;stick.id=e.pointerId;wheel.setPointerCapture(e.pointerId);driveStick(e);};wheel.onpointermove=e=>{if(stick.id===e.pointerId)driveStick(e);};for(const ev of ['pointerup','pointercancel','lostpointercapture'])wheel.addEventListener(ev,e=>{if(stick.id===e.pointerId){stick={x:0,y:0,id:null};$('drive-knob').style.transform='';}});
window.addEventListener('keydown',e=>{if(e.code==='Escape'){if(paused)setPause(false);else setPause(true);return;}if(!running||paused||uiLock)return;if(['KeyW','KeyA','KeyS','KeyD','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyJ','KeyL','KeyQ','KeyE','Space','ShiftLeft','KeyP'].includes(e.code)){e.preventDefault();keys.add(e.code);}});window.addEventListener('keyup',e=>keys.delete(e.code));
function footInputs(){return {x:stick.x+(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0),y:stick.y+(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0),aim:pending?.dir,gun:pending?.kind==='gun'||keys.has('KeyJ')||keys.has('Space'),magic:pending?.kind==='magic'||keys.has('KeyL'),dash:dash||keys.has('ShiftLeft'),duo:special||keys.has('KeyQ'),interact:interact||keys.has('KeyE')};}

// ---------- Gameplay events ----------
function burst(x,y,color,count=15,speed=160){for(let i=0;i<count&&fx.length<200;i++){const a=i/count*Math.PI*2+Math.random()*.4;fx.push({type:'spark',x,y:y-28,vx:Math.cos(a)*speed*(.5+Math.random()),vy:Math.sin(a)*speed,life:.3+Math.random()*.25,max:.55,color});}}
function floatText(x,y,text,color,life=.6){fx.push({type:'text',x,y,text,life,max:life,color});}
async function clinicEvent(){running=false;clearControls();
 await say(resolveLines(STORY.clinic_auth,flags()));
 await holdButton({kicker:'TERMINALE DI LULÙ',title:'Autenticazione EVE-47',text:'Diciannove persone dietro la porta. Nox è sotto attacco e non può risponderti.',label:'TIENI PREMUTO PER TRASMETTERE'});
 flag('eve_signature_exposed',true);persist();shake=settings.reduced?0:6;
 await say(resolveLines(STORY.clinic_after,flags()));
 const pick=await choose('clinic_log');await say(resolveLines(STORY[REACTIONS.clinic_log[pick]],flags()));
 bark('after');setTimeout(()=>bark('afterb'),3500);if(mode==='foot'&&state?.status==='playing')running=true;}
const chronoFxPool=Array.from({length:16},()=>({life:0}));
function spawnChronoFx(id,x,y){if(settings.reduced&&id==='finish_flash')return;const f=chronoFxPool.find(f=>f.life<=0);if(!f)return;Object.assign(f,{id,x,y,life:.34,max:.34});}
function eventFx(e){
 const id={impact:'impact',shot:'muzzle_flash',magic:'energy_burst',node:'chrono_rings',bossPhase:'chrono_rings',down:e.boss?'gear_debris':'debris'}[e.type];
 const fxTarget=Number.isFinite(e.x)?e:e.type==='bossPhase'?state.enemies.find(actor=>actor.boss):null;
 if(id&&fxTarget&&Number.isFinite(fxTarget.y))spawnChronoFx(id,fxTarget.x,fxTarget.y-28);
 if(e.type==='bossWake')audioDirector.sfx('suspense_boss');
const effect={impact:'impact',down:e.boss?'boss_collapse':'impact',barrier:'barrier',overdrive:'pulse',shotBlocked:'barrier',alarm:'alarm',node:'node',partnerJoin:'choice'}[e.type];if(effect)audioDirector.sfx(effect);const s=state,color=s.hero==='nox'?'#6bddff':'#ff72d9';
 if(e.type==='shot'||e.type==='magic'){fx.push({type:'beam',x:e.x,y:e.y-32,to:{x:e.to.x,y:e.to.y-32},life:e.type==='magic'?.28:.12,max:.28,color,area:e.area,dir:e.dir,magic:e.type==='magic'});burst(e.x+e.dir.x*35,e.y+e.dir.y*35,color,e.type==='magic'?22:8,120);if(!settings.reduced)shake=Math.max(shake,e.type==='magic'?5:1.2);audio(e.type==='magic'?'duo':'hit');if(tutorial?.step==='shoot'&&e.type==='shot')advanceTutorial('dodge');}
 else if(e.type==='partnerShot'){fx.push({type:'beam',x:e.x,y:e.y-32,to:{x:e.to.x,y:e.to.y-32},life:.1,max:.1,color:s.hero==='nox'?'#ff72d9':'#6bddff'});}
 else if(e.type==='impact'){fx.push({type:'atlas',row:s.hero==='nox'?0:1,x:e.x,y:e.y-20,life:.3,max:.3});burst(e.x,e.y,color,10);floatText(e.x,e.y-70,String(e.amount),e.boss?'#f6e2a6':color);}
 else if(e.type==='down'){burst(e.x,e.y,'#ffda88',e.boss?60:24,e.boss?260:190);if(e.boss&&!settings.reduced){shake=10;focusTime=.4;}}
 else if(e.type==='enemyAttack'){fx.push({type:'ring',x:e.x,y:e.y,r:e.r,life:.3,max:.3,color:'#ff765e'});}
 else if(e.type==='enemyShot'){fx.push({type:'flash',x:e.x,y:e.y-34,life:.12,max:.12,color:'#ffcf8a'});}
 else if(e.type==='shotBlocked'){burst(e.x,e.y+20,'#ff9fe6',6,80);}
 else if(e.type==='duo'){burst(e.x,e.y,'#b9fff1',32,210);fx.push({type:'ring',x:e.x,y:e.y,r:280,life:.65,max:.65,color:'#aafff4'});audio('choice');if(!settings.reduced)shake=7;}
 else if(e.type==='overdrive'){burst(e.x,e.y,'#ff4a6a',40,240);fx.push({type:'ring',x:e.x,y:e.y,r:200,life:.6,max:.6,color:'#ff4a6a'});floatText(e.x,e.y-100,'BLACK PULSE','#ff8a9a',.9);}
 else if(e.type==='heat'){floatText(s.x,s.y-100,'SURRISCALDATO','#ffb0a0',.9);}
 else if(e.type==='barrier'){burst(e.x,e.y,'#ff7fd8',18,120);}
 else if(e.type==='node'){burst(e.x,e.y,'#b9fff1',32,210);fx.push({type:'ring',x:e.x,y:e.y,r:80,life:.65,max:.65,color:'#aafff4'});audio('choice');
  if(s.mission==='blackout'&&e.firstActive&&applyBeat(progress.narrative,V07_BEATS.blackout_helios_clue))persist();
  if(tutorial?.step==='interact')finishTutorial();
  bark('node'+e.count);setTimeout(()=>bark('node'+e.count+'b'),3200);
  if(s.c.midEvent&&e.count===s.c.midEvent.atNode&&!progress.narrative.choices.clinic_log)clinicEvent();}
 else if(e.type==='channel'){audio('dodge');}
 else if(e.type==='channelBroken'){notice('Interrotto: resta vicino al dispositivo.');}
 else if(e.type==='hurt'){lastHurt=e.source;if(!settings.reduced)shake=5;audio('zara');if(s.hp<=3&&!lowHpWarned){lowHpWarned=true;bark('lowHp');}}
 else if(e.type==='dash'){audio('dodge');burst(s.x,s.y,color,10,50);if(tutorial?.step==='dodge')advanceTutorial('interact');}
 else if(e.type==='perfectDodge'){if(!settings.reduced)focusTime=.16;fx.push({type:'ring',x:e.x,y:e.y,r:105,life:.32,max:.32,color:'#e8fbff'});floatText(e.x,e.y-76,'PERFETTA','#e8fbff',.55);audio('dodge');bark('perfect');}
 else if(e.type==='counter'){floatText(s.x,s.y-90,'CONTRATTACCO','#fff2bd',.5);burst(s.x,s.y,'#fff2bd',14,150);}
 else if(e.type==='silent'){floatText(e.x,e.y-80,'SILENZIOSO','#d6c6ff',.6);bark('silent');}
 else if(e.type==='alarm'){notice('Allarme! Le pattuglie ti cercano.');bark('alarm');}
 else if(e.type==='wave'){notice(e.index===1?'Rinforzi in arrivo.':'Un’altra ondata.');bark('wave'+e.index);}
 else if(e.type==='bossWake'){progress.checkpoint='boss';const ok=persist();notice(BOSS_NAMES[e.kind]+(e.kind==='mirror'?' si è svegliata.':' si è svegliato.')+(ok?' Checkpoint salvato.':''));bark('bossWake');if(!settings.reduced)shake=8;soundtrack('danger');}
 else if(e.type==='bossPhase'){bark('phase'+e.phase);setTimeout(()=>bark('phase'+e.phase+'b'),3000);}
 else if(e.type==='adapt'){floatText(e.x,e.y-140,'PREVEDIBILE','#ff8a8a',1);notice('EVE-Prime ha letto il tuo ritmo: schiva per contrattaccare o usa l’impulso.');bark('adapt');}
 else if(e.type==='guarded'){floatText(e.x,e.y-110,'PARATO','#ff8a8a',.4);}
 else if(e.type==='guardBroken'){floatText(e.x,e.y-120,'GUARDIA ROTTA','#fff2bd',.7);}
 else if(e.type==='partnerJoin'){burst(e.x,e.y,'#ff7fd8',40,220);fx.push({type:'ring',x:e.x,y:e.y,r:160,life:.8,max:.8,color:'#ff7fd8'});configureControls();panel('duo',true);bark('join');setTimeout(()=>bark('joinb'),3000);notice('DUO riattivato.');}
 else if(e.type==='blocked'){if(!eventFx.blockedAt||s.time-eventFx.blockedAt>2.5){eventFx.blockedAt=s.time;notice('Allontana i nemici dal dispositivo prima di attivarlo.');}}
 else if(e.type==='failed'||e.type==='cleared')onFootEnd();}
function advanceTutorial(next){if(!tutorial)return;tutorial.step=next;tutorial.slow=false;}
function finishTutorial(){tutorial=null;remember('city-tutorial-v8');panel('hint',false);for(const id of ['stick','gun','dash','interact'])$(id).classList.remove('pulse-hint');}
function updateTutorial(){if(!tutorial||!state)return;const s=state;let text='',target=null;
 if(tutorial.step==='move'){text='Trascina il cerchio a sinistra per muoverti';target='stick';if(distance(s,tutorial.from)>90)advanceTutorial('shoot');}
 else if(tutorial.step==='shoot'){const e=s.enemies.find(e=>e.hp>0&&distance(s,e)<GUN_RANGE+40);if(e){text='Tocca SPARA: la mira è automatica';target='gun';}}
 else if(tutorial.step==='dodge'){const e=s.enemies.find(e=>e.hp>0&&e.state==='warn'&&!e.ranged&&e.target&&distance(s,e.target)<e.attackRadius+10);if(e){text='Il cerchio rosso sta per colpire: SCHIVA!';target='dash';tutorial.slow=true;if(e.clock>e.windup-.06)s.inv=Math.max(s.inv,.12);}else{tutorial.slow=false;if(s.time>40)advanceTutorial('interact');}}
 else if(tutorial.step==='interact'){const n=s.nodes.find(n=>!n.on&&distance(s,n)<85);if(n){text='Tocca ATTIVA e resta vicino al relè';target='interact';}else{const goal=s.nodes.find(n=>!n.on);if(goal&&!s.enemies.some(e=>e.hp>0)){text='Segui la freccia fino al relè';}}}
 for(const id of ['stick','gun','dash','interact'])$(id).classList.toggle('pulse-hint',id===target);
 panel('hint',!!text);if(text)$('hint').firstElementChild.textContent=text;}

// ---------- Rendering ----------
function circle(x,y,r,color,stroke=false,width=2){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(stroke){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}else{ctx.fillStyle=color;ctx.fill();}}
function line(x,y,a,b,color,width=2){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(a,b);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
function label(t,x,y,color='#e9f5ff',size=13){ctx.fillStyle=color;ctx.font=`800 ${size}px system-ui`;ctx.textAlign='center';ctx.fillText(t,x,y);}
function sprite(im,row,col,x,y,size,flip=false){drawLegacySprite(ctx,im,row,col,x,y,size,flip);}
function drawHero(actor,name,partner=false){circle(actor.x,actor.y,19,'#00000060');const f=heroFrame(state,actor,name,partner);sprite(images[f.atlas],f.row,f.col,actor.x,actor.y,112,f.flip);if(!partner){circle(actor.x,actor.y+4,23,name==='nox'?'#64deff':'#ff75d8',true,2);if(state.overdrive>0)circle(actor.x,actor.y-50,48,'#ff4a6a55',true,4);}}
const shade=document.createElement('canvas'),shadeCtx=shade.getContext('2d');
const lightStamp=document.createElement('canvas');lightStamp.width=lightStamp.height=256;{const g=lightStamp.getContext('2d'),gradient=g.createRadialGradient(128,128,32,128,128,128);gradient.addColorStop(0,'#000');gradient.addColorStop(1,'#0000');g.fillStyle=gradient;g.fillRect(0,0,256,256);}
// The light mask is soft by nature: half resolution looks identical and costs a quarter of the fill.
function drawDark(w,h){const s=state,sw=Math.ceil(canvas.width/2),sh=Math.ceil(canvas.height/2);if(shade.width!==sw||shade.height!==sh){shade.width=sw;shade.height=sh;}const g=shadeCtx,dpr=sw/w;g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.clearRect(0,0,shade.width,shade.height);g.fillStyle=s.c.tint?s.c.tint+'f2':'#000000f0';g.fillRect(0,0,shade.width,shade.height);g.globalCompositeOperation='destination-out';
 const hole=(x,y,r,a=1)=>{const px=(x-camera.x)*camera.scale*dpr,py=(y-camera.y)*camera.scale*dpr,rr=r*camera.scale*dpr;g.globalAlpha=a;g.drawImage(lightStamp,px-rr,py-rr,rr*2,rr*2);g.globalAlpha=1;};
 hole(s.x,s.y-30,260);for(const n of s.nodes)hole(n.x,n.y,n.on?150:90,.8);if(s.reveal>0)for(const e of s.enemies)if(e.hp>0)hole(e.x,e.y-40,110,Math.min(1,s.reveal));for(const e of s.enemies)if(e.hp>0&&e.boss&&e.state!=='dormant')hole(e.x,e.y-60,140,.7);
 ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(shade,0,0,canvas.width,canvas.height);ctx.restore();}
// Tunnel headlights: one pre-rendered vignette, moved with the car instead of rebuilt every frame.
const vignette=document.createElement('canvas');vignette.width=360;vignette.height=520;{const g=vignette.getContext('2d'),grad=g.createRadialGradient(180,260,20,180,260,190);grad.addColorStop(0,'rgba(0,0,0,0)');grad.addColorStop(1,'rgba(2,3,8,.93)');g.fillStyle=grad;g.fillRect(0,0,360,520);}
function enemySprite(a,kind){
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
 if(c.tint&&!c.dark&&!c.layout){ctx.fillStyle=c.tint+'99';ctx.fillRect(0,0,SIZE,SIZE);}else if(c.map>0&&!c.dark&&!c.layout){ctx.fillStyle=['','#112d3b30','#34501b25','#35144738'][c.map];ctx.fillRect(0,0,SIZE,SIZE);}
 if(c.mode==='defend'){const z=c.zone;ctx.save();ctx.setLineDash([10,8]);circle(z.x,z.y,z.r,'#7dffd0',true,3);ctx.restore();circle(z.x,z.y,z.r,'#7dffd014');ctx.beginPath();ctx.arc(z.x,z.y,z.r+10,-Math.PI/2,-Math.PI/2+Math.PI*2*s.progress);ctx.strokeStyle='#b8f27c';ctx.lineWidth=8;ctx.stroke();label(c.site||'LINEA',z.x,z.y-z.r-18,'#cfffe8',16);}
 for(const n of s.nodes){const color=n.on?'#7dffd0':c.color;circle(n.x,n.y,38,color+'22');circle(n.x,n.y,28,color,true,3);sprite(images.district_props,Math.min(3,c.kind),n.on?1:0,n.x,n.y,84);label(n.on?'ATTIVO':c.nodeLabel||'DISPOSITIVO',n.x,n.y+55,color,12);
  if(c.marks){circle(n.x-60,n.y-6,4,'#f4f1e6');circle(n.x-46,n.y-6,4,'#f4f1e6');}
  if(s.channel&&s.nodes[s.channel.node]===n){ctx.beginPath();ctx.arc(n.x,n.y,44,-Math.PI/2,-Math.PI/2+Math.PI*2*s.channel.t/s.channel.need);ctx.strokeStyle='#fff';ctx.lineWidth=6;ctx.stroke();}}
 if(s.mission==='blackout'){ctx.drawImage(images.car,560,1080,190,125);label('VORTEX',650,1218,'#9ec5d3',11);}
 for(const b of s.barriers){circle(b.x,b.y,b.r,'#ff7fd822');circle(b.x,b.y,b.r,'#ff7fd8',true,2);sprite(images.district_props,2,3,b.x,b.y+18,92);ctx.beginPath();ctx.arc(b.x,b.y,b.r+6,-Math.PI/2,-Math.PI/2+Math.PI*2*b.life/(c.barrierLife||9));ctx.strokeStyle='#ffc2ee';ctx.lineWidth=3;ctx.stroke();}
 // Patrol vision cones: amber while unaware, red as suspicion fills.
 if(c.mode==='stealth'&&!s.alarm)for(const e of s.enemies){if(e.hp<=0||e.state!=='patrol')continue;const f=e.dir||{x:e.face,y:0},a=Math.atan2(f.y,f.x),r=c.vision||240,cone=c.cone||.6;ctx.beginPath();ctx.moveTo(e.x,e.y-10);ctx.arc(e.x,e.y-10,r,a-cone,a+cone);ctx.closePath();ctx.fillStyle=e.seen>.05?`rgba(255,${Math.round(180-150*e.seen)},80,${.16+e.seen*.25})`:'rgba(255,214,120,.13)';ctx.fill();}
 const actors=[{...s,role:'hero'},...(s.partner?[{...s.partner,role:'partner'}]:[]),...s.enemies.filter(e=>e.hp>0||e.deathAnim>0).map(e=>({...e,role:'enemy'}))].sort((a,b)=>a.y-b.y);
 for(const a of actors){if(a.role==='hero'){if(s.inv<=0||settings.reduced||Math.floor(s.time*15)%2===0)drawHero(a,s.hero);}else if(a.role==='partner')drawHero(a,s.hero==='nox'?'lulu':'nox',true);
  else{circle(a.x,a.y,a.boss?34:22,'#00000070');ctx.globalAlpha=a.state==='dormant'?.55:a.state==='stun'?.75:1;enemySprite(a,c.kind);ctx.globalAlpha=1;
   if(a.state==='stun'){label('✶',a.x,a.y-112,'#ffc2ee',18);}
   if(a.guard>0)circle(a.x,a.y-60,62,'#ff6a6a99',true,4);
   if(!a.boss&&a.hp>0){ctx.fillStyle='#0d1523';ctx.fillRect(a.x-24,a.y-110,48,5);ctx.fillStyle=c.color;ctx.fillRect(a.x-24,a.y-110,48*Math.max(0,a.hp)/a.max,5);}}}
}
// Telegraphs and projectiles sit above darkness: danger is always readable.
function drawThreats(){const s=state;
 for(const e of s.enemies){if(e.hp<=0)continue;
  if(e.state==='warn'&&!e.ranged){const radius=e.attackRadius,k=clamp(e.clock/e.windup,0,1),cue=e.role==='breaker'?'CARICA':e.role==='signal'?'CAMPO':e.boss?'IMPATTO':'SCHIVA';circle(e.target.x,e.target.y,radius,'#ff634333');circle(e.target.x,e.target.y,radius*k,'#ff634355');circle(e.target.x,e.target.y,radius,'#ff997b',true,3);label(cue,e.target.x,e.target.y-8,'#fff0df',12);}
  else if(e.state==='warn'&&e.ranged){ctx.save();ctx.setLineDash([6,8]);line(e.x,e.y-34,e.target.x,e.target.y-30,`rgba(255,120,90,${.35+.5*e.clock/e.windup})`,2);ctx.restore();circle(e.target.x,e.target.y-30,8+6*e.clock/e.windup,'#ff8a6a',true,2);}
  else if(e.state==='charge'&&e.clock<e.windup){const d=e.dir;ctx.save();ctx.globalAlpha=.25+.35*e.clock/e.windup;ctx.strokeStyle='#ff5a5a';ctx.lineWidth=56;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+d.x*420,e.y+d.y*420);ctx.stroke();ctx.restore();label('CARICA',e.x+d.x*200,e.y+d.y*200,'#fff0df',13);}
  else if(e.state==='volley'){circle(e.x,e.y-60,30+20*e.clock/e.windup,'#ffcf8a',true,3);}}
 for(const b of s.shots){const col=b.boss?'#ff6a8a':'#ffb070';line(b.x,b.y,b.x-b.vx*.05,b.y-b.vy*.05,col+'88',6);circle(b.x,b.y,8,col);circle(b.x,b.y,4,'#fff');}
 if(aimTouch){const d=aimTouch.dir||aimAt(s,null,GUN_RANGE),range=aimTouch.kind==='magic'?(s.hero==='lulu'?240:420):GUN_RANGE,end=trace(s,d,range);ctx.save();ctx.setLineDash([8,7]);line(s.x,s.y-30,end.x,end.y-30,'#eaffff',2);ctx.restore();circle(end.x,end.y-30,9,'#eaffff',true);}
 const locked=s.enemies.find(e=>e.hp>0&&e.id===s.lock);if(locked)circle(locked.x,locked.y-40,29,'#fff2bd',true,1);
 for(const f of chronoFxPool)if(f.life>0){ctx.globalAlpha=settings.reduced?.45:Math.min(1,f.life/.08);drawChronoFrame(ctx,chronoArt.get('effects'),chronoAnimation(f.id,'play'),f.max-f.life,f.x,f.y,settings.reduced?70:100,false,settings.reduced);}ctx.globalAlpha=1;
 for(const f of fx){ctx.globalAlpha=clamp(f.life/f.max,0,1);if(f.type==='atlas'){sprite(images.fx_atlas,f.row,Math.min(3,Math.floor((1-f.life/f.max)*4)),f.x,f.y+30,110);}else if(f.type==='spark'){line(f.x,f.y,f.x-f.vx*.035,f.y-f.vy*.035,f.color,3);}else if(f.type==='flash'){circle(f.x,f.y,14,f.color);}else if(f.type==='beam'){if(f.area){ctx.strokeStyle=f.color;ctx.lineWidth=13;ctx.beginPath();const a=Math.atan2(f.dir.y,f.dir.x);ctx.arc(f.x,f.y,170*(1-f.life/f.max)+30,a-1.1,a+1.1);ctx.stroke();}else{line(f.x,f.y,f.to.x,f.to.y,f.color,f.magic?13:5);line(f.x,f.y,f.to.x,f.to.y,'#fff',f.magic?4:2);}}else if(f.type==='ring')circle(f.x,f.y,f.r*(1-f.life/f.max),f.color,true,4);else label(f.text,f.x,f.y,f.color,20);ctx.globalAlpha=1;}}
function updateFootHud(w,h){const s=state,c=s.c;
 setText('district',c.district+(s.hero==='lulu'?' · LULÙ':' · NOX'));
 const on=s.nodes.filter(n=>n.on).length,boss=s.enemies.find(e=>e.boss&&e.hp>0&&e.state!=='dormant'),foes=s.enemies.filter(e=>e.hp>0&&e.state!=='dormant').length;
 let obj=c.goal;const foesText=foes===1?'1 nemico':foes+' nemici';
 if(c.mode==='defend')obj=c.goal;else if(boss)obj='Abbatti '+BOSS_NAMES[boss.bossKind];
 else if(s.nodes.length&&on===s.nodes.length&&foes&&!c.boss)obj='Elimina gli ultimi nemici · '+foes;
 else if(s.nodes.length)obj=`${c.task||c.nodeLabel||'Dispositivi'} ${on}/${s.nodes.length}`+(c.mode==='stealth'?' · resta nell’ombra':foes?' · '+foesText:'');
 setText('objective',obj);setText('health','♥'.repeat(Math.max(0,s.hp))+'♡'.repeat(Math.max(0,s.maxHp-s.hp)));
 const meter=$('meter');if(c.mode==='stealth'){panel('meter',true);meter.classList.add('alert');$('meter-fill').style.width=Math.round((s.alarm?1:s.alert)*100)+'%';setText('meter-label',s.alarm?'ALLARME':'ALLERTA');}else if(c.mode==='defend'){panel('meter',true);meter.classList.remove('alert');$('meter-fill').style.width=Math.round(s.progress*100)+'%';setText('meter-label',(c.site||'LINEA')+' '+Math.round(s.progress*100)+'%');}else panel('meter',false);
 if(boss){panel('bossbar',true);setText('boss-name',BOSS_NAMES[boss.bossKind]);$('boss-fill').style.width=(100*boss.hp/boss.max)+'%';}else panel('bossbar',false);
 const unlocked=c.magic||s.hero==='lulu';$('magic').disabled=!unlocked||s.magicCd>0;setText('magic',s.magicCd>0?s.magicCd.toFixed(1)+' s':$('magic').dataset.label);
 const sig=$('duo');if(s.signature==='barrier'){sig.disabled=s.sigCd>0;setText('duo',s.sigCd>0?'BARRIERA '+s.sigCd.toFixed(0)+' s':'BARRIERA');sig.classList.toggle('ready',s.sigCd===0);}
 else{sig.disabled=s.duo<100||s.overdrive>0;setText('duo',s.overdrive>0?'ATTIVO':`${sig.dataset.label} ${s.duo}%`);sig.classList.toggle('ready',s.duo>=100&&!s.overdrive);if(s.duo>=100&&sig.hidden){panel('duo',true);remember('city-duo-seen-v8');notice(s.signature==='duo'?'DUO pronto: attacco combinato con il partner.':'BLACK PULSE pronto.');}
  if(s.signature==='overdrive'&&s.duo>=100&&!overdriveSaid){overdriveSaid=true;bark('overdriveReady');}}
 $('dash').disabled=s.dashCd>0;const near=s.nodes.some(n=>!n.on&&distance(s,n)<85);panel('interact',near||!!s.channel);setText('interact',s.channel?'…'+Math.round(100*s.channel.t/s.channel.need)+'%':'ATTIVA');
 if(c.mode==='defend'){if(s.progress>=.5&&!halfSaid){halfSaid=true;bark('half');}if(s.progress>=.85&&!lateSaid){lateSaid=true;bark('late');}}
 // Off-screen objective arrow.
 const goal=(boss)||s.nodes.find(n=>!n.on)||(c.mode==='defend'?c.zone:null)||s.enemies.find(e=>e.hp>0&&e.state!=='dormant');if(goal){const px=(goal.x-camera.x)*camera.scale,py=(goal.y-camera.y)*camera.scale;if(px<30||px>w-30||py<100||py>h-190){const x=clamp(px,28,w-28),y=clamp(py,115,h-200);circle(x,y,18,'#122337ee');ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(py-y,px-x));ctx.fillStyle=c.color;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-6,-6);ctx.lineTo(-6,6);ctx.fill();ctx.restore();}}}
// HUD and controls are measured once per layout, not per frame; a button appearing never moves the camera.
let frameInsets=null;
function measureInsets(w,h){const hud=$('hud').getBoundingClientRect(),ctl=$('controls').getBoundingClientRect();frameInsets={w,h,top:hud.height?hud.bottom+6:0,bottom:ctl.height?Math.max(0,h-ctl.top+6):0};}
function drawFoot(w,h){const s=state;camera.scale=w<650?.66:Math.min(.95,h/760);if(!frameInsets||frameInsets.w!==w||frameInsets.h!==h)measureInsets(w,h);Object.assign(camera,frameCamera(s,w,h,camera.scale,frameInsets.top,frameInsets.bottom,SIZE));
 const jitter=settings.reduced?0:(Math.random()-.5)*shake;drawMapBackdrop(w,jitter);ctx.save();ctx.scale(camera.scale,camera.scale);ctx.translate(-camera.x+jitter,-camera.y);drawWorld(w,h);ctx.restore();
 if(s.c.dark)drawDark(w,h);
 ctx.save();ctx.scale(camera.scale,camera.scale);ctx.translate(-camera.x+jitter,-camera.y);drawThreats();ctx.restore();
 if(focusTime>0&&!settings.reduced){ctx.fillStyle='#dff8ff12';ctx.fillRect(0,0,w,h);}
 if(s.hp<=2&&s.status==='playing'){const g=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.3,w/2,h/2,Math.max(w,h)*.7);g.addColorStop(0,'rgba(120,0,20,0)');g.addColorStop(1,`rgba(140,0,30,${.25+.1*Math.sin(s.time*6)})`);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}
 updateFootHud(w,h);}
function drawDriving(w,h){
 const d=drive,c=DRIVING_MISSIONS[d.index],scale=Math.min(w/720,h/1050),worldH=h/scale,carY=worldH*.72,jitter=settings.reduced?0:(Math.random()-.5)*shake;
 ctx.save();ctx.translate((w-720*scale)/2+jitter,0);ctx.scale(scale,scale);const road=images.driving_road,tileH=road.naturalHeight/road.naturalWidth*720,offset=d.distance%tileH;
 for(let y=-tileH+offset;y<worldH;y+=tileH)ctx.drawImage(road,0,y,720,tileH);
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
 setText('district','GUIDA · '+c.title);setText('objective',c.goal+' · '+Math.min(100,Math.floor(d.distance/c.distance*100))+'%'+(d.stops.length?' · '+d.stops.filter(p=>p.done).length+'/'+d.stops.length:''));setText('health',(d.vehicle==='truck'?'CAMION ':'VORTEX ')+'■'.repeat(Math.max(0,d.hp))+'□'.repeat(Math.max(0,(d.vehicle==='truck'?6:5)-d.hp)));
 panel('meter',true);$('meter').classList.toggle('alert',c.limit-d.time<15);$('meter-fill').style.width=Math.max(0,100*(1-d.time/c.limit))+'%';setText('meter-label',Math.max(0,Math.ceil(c.limit-d.time))+' s · '+Math.round(d.speed*.25)+' km/h');panel('bossbar',false);
 if(d.distance/c.distance>.5&&!halfSaid){halfSaid=true;bark('half');}if(d.distance/c.distance>.8&&!lateSaid){lateSaid=true;bark('late');}}
function drawScene(w,h){const sc=scene;if(sc.art){const im=images[sc.art];if(im?.naturalWidth){const k=Math.max(w/im.naturalWidth,h/im.naturalHeight);ctx.drawImage(im,(w-im.naturalWidth*k)/2,(h-im.naturalHeight*k)*(w>h?.25:.5),im.naturalWidth*k,im.naturalHeight*k);}return;}const map=images[DISTRICT_MAPS[sc.map]];if(!map?.naturalWidth)return;const scale=Math.min(w,h)/(w<650?380:520)*sc.zoom;const cx=sc.cam.x-w/scale/2,cy=sc.cam.y-h/scale*(h>w?.3:.42),jitter=settings.reduced?0:(Math.random()-.5)*shake;
 ctx.save();ctx.scale(scale,scale);ctx.translate(-cx+jitter,-cy);ctx.drawImage(map,0,0,SIZE,SIZE);ctx.fillStyle=sc.tint;ctx.fillRect(0,0,SIZE,SIZE);
 if(sc.crack){ctx.strokeStyle='#ffdca8';ctx.lineWidth=6;ctx.shadowColor='#ff9d5c';ctx.shadowBlur=20;ctx.beginPath();ctx.moveTo(770,380);for(let i=1;i<=10;i++){const k=i/10;if(k>sc.crack)break;ctx.lineTo(770+(i%2?18:-14),380+k*520);}ctx.stroke();ctx.shadowBlur=0;}
 for(const a of sc.cast){ctx.globalAlpha=a.alpha;circle(a.x,a.y,19,'#00000060');const breathe=Math.sin(performance.now()/600+a.x)*1.5;sprite(images[a.atlas||a.name+'_walk'],a.row,a.col,a.x,a.y+breathe,112,a.flip);ctx.globalAlpha=1;}
 ctx.restore();
 if(sc.rain&&!settings.reduced){ctx.strokeStyle='#bfe8ff22';ctx.lineWidth=1;for(let i=0;i<70;i++){const x=(i*97+performance.now()*.35)%(w+60)-30,y=(i*53+performance.now()*.9)%(h+40)-20;line(x,y,x-6,y+16,'#bfe8ff2a',1);}}
 if(sc.dawn){const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(255,170,110,.22)');g.addColorStop(1,'rgba(255,170,110,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}}
function render(){const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,mode==='foot'||mode==='drive'?renderQuality:1.75);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#05080e';ctx.fillRect(0,0,w,h);if(!loaded)return;
 if(mode==='drive'&&drive)drawDriving(w,h);else if(mode==='foot'&&state)drawFoot(w,h);else if(mode==='scene'&&scene)drawScene(w,h);}
const frameSamples=[];let frameSerial=0,renderQuality=1.75,qualitySlow=0;const qualityWindow=[];
function frame(t){const frameStart=performance.now(),gap=last?t-last:0;const rawDt=Math.min(.05,(t-last)/1000||0);last=t;const slow=(focusTime>0&&!settings.reduced?.4:1)*(tutorial?.slow?.35:1);const dt=rawDt*slow;focusTime=Math.max(0,focusTime-rawDt);
 if(running&&!paused&&!uiLock&&!document.hidden){
  if(mode==='drive'&&drive){driveTick(drive,{steer:stick.x+(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0),throttle:drivingHeld.has('accelerate')||keys.has('KeyW')||keys.has('ArrowUp')?1:0,brake:drivingHeld.has('brake')||keys.has('KeyS')||keys.has('ArrowDown')?1:0,pulse:pulse||keys.has('KeyP')},dt);pulse=false;
   for(const e of drive.events){if(e.type==='driveHit'){audio('zara');if(!settings.reduced)shake=e.kind==='strike'?8:4;}else if(e.type==='checkpoint'||e.type==='pickup'){audio('choice');if(e.type==='pickup')bark('pickup',false);}else if(e.type==='strikeWarn')audio('dodge');else if(e.type==='pulse')audio('hit');else if(e.type==='driveCleared'||e.type==='driveFailed'){running=false;showDriveResult();}}}
  else if(mode==='foot'&&state){tick(state,footInputs(),dt);pending=null;interact=dash=special=false;for(const e of state.events)eventFx(e);updateTutorial();}
  if(progress)progress.stats.seconds+=rawDt;acc+=rawDt;if(acc>10){persist();acc=0;}}
 if(state?.status==='cleared'&&!running&&!paused&&!document.hidden)for(const e of state.enemies)if(e.hp<=0)e.deathAnim=Math.max(0,e.deathAnim-dt);
 for(const f of chronoFxPool)f.life=Math.max(0,f.life-dt);
 for(const f of fx){f.life-=dt;if(f.type==='spark'){f.x+=f.vx*dt;f.y+=f.vy*dt;}if(f.type==='text')f.y-=25*dt;}fx=fx.filter(f=>f.life>0);shake=Math.max(0,shake-rawDt*28);updateBark(rawDt);
 syncSoundscape(rawDt);render();const cost=performance.now()-frameStart;frameSamples.push({id:++frameSerial,cost,gap,ratio:canvas.width/innerWidth,voices:audioDirector.voices.size});
 // Respond to repeated spikes as well as sustained load, while ignoring isolated GC pauses.
 if(running&&!paused&&!uiLock&&(mode==='foot'||mode==='drive')){qualityWindow.push(cost);if(cost>10)qualitySlow++;if(qualityWindow.length>30&&qualityWindow.shift()>10)qualitySlow--;if(qualitySlow>=2&&renderQuality>1){renderQuality=Math.max(1,renderQuality-.5);qualityWindow.length=0;qualitySlow=0;}}
 if(frameSamples.length>600)frameSamples.shift();requestAnimationFrame(frame);}
requestAnimationFrame(frame);

// ---------- Boot ----------
window.addEventListener('pointerdown',()=>audioDirector.unlock());
window.addEventListener('keydown',()=>audioDirector.unlock());
document.addEventListener('click',e=>{if(e.target.closest('button')&&!e.target.closest('#controls,#driving-controls'))audioDirector.sfx('ui');});
imageReady.then(()=>{loaded=true;$('loading').textContent='Storia completa offline · nessuna pubblicità';}).catch(e=>{$('loading').textContent='Asset non disponibile: '+e.message;});
playStudio().then(showMenu);
// Read-only hooks for automated verification; they expose copies, never live state.
window.cityAdventure={performance:()=>frameSamples.map(s=>({...s})),snapshot:()=>JSON.parse(JSON.stringify(mode==='drive'&&drive?{mode:'driving',driving:drive}:state?{...state,c:{id:state.c.id,layout:state.c.layout,mode:state.c.mode,zone:state.c.zone,boss:!!state.c.boss,dark:!!state.c.dark},mode:'foot'}:{mode})),view:()=>({...camera}),progress:()=>progress?JSON.parse(saveProgress(progress)):null,status:()=>({mode,running,paused,uiLock,dialogue:!$('talk').hidden,loaded,lifecycleMuted,chrono:{...chronoArt.status(),fxActive:chronoFxPool.filter(f=>f.life>0).length,fxCapacity:chronoFxPool.length},musicPaused:audioDirector.status().musicPaused,audio:audioDirector.status(),step:progress?CAMPAIGN[progress.step].id:null})};
