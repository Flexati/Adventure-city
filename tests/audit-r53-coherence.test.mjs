// R53 adversarial audit & narrative coherence regression suite.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createNativeSync} from '../game/native-bridge.mjs';
import {newRun,tick,startAttack,switchMove} from '../game/campaign.mjs';
import {getLayout,nearestFloor} from '../game/layouts.mjs';
import {CAMPAIGN,FOOT,buildMission,stepIndex} from '../game/missions.mjs';
import {DRIVING_MISSIONS,newDrive,driveTick} from '../game/driving.mjs';
import {CODEX,codexOpen} from '../game/codex.mjs';
import {STORY,BARKS,EPILOGUE,resolveLines} from '../game/story-v08.mjs';
import {EN_TEXT,translateText} from '../game/locale.mjs';
import {veyraLineV9} from '../game/veyra-v9.mjs';
import {HUBS} from '../game/hubs.mjs';
import {INTERIORS} from '../game/interiors.mjs';

const rt=fs.readFileSync('game/runtime.mjs','utf8');

test('R53 native-bridge: a failed sync restores its keys into pending and retries cleanly',()=>{
 let fail=true;const calls=[];
 const bridge={sync(raw){if(fail)throw new Error('offline');calls.push(JSON.parse(raw));}};
 const sync=createNativeSync(bridge,{setTimer:()=>1,clearTimer:()=>{}});
 sync.push({save:'v1',lang:'it'});
 assert.equal(sync.flush(),false,'first sync fails cleanly');
 fail=false;
 assert.equal(sync.flush(),true,'retried flush sends the restored payload');
 assert.deepEqual(calls,[{save:'v1',lang:'it'}]);
});

test('R53 campaign: stealth patrol waypoints stay on walkable floor tiles and avoid the .1 typo',()=>{
 for(const id of ['port','app_yard']){
  const def=buildMission(id,{}),s=newRun(def.pov,def.map,'power',null,null,def),layout=getLayout(s.layoutId);
  const patrols=s.enemies.filter(e=>e.role==='patrol'&&Array.isArray(e.path));
  assert.ok(patrols.length>0,`${id} spawns stealth patrols`);
  for(const p of patrols)for(const wp of p.path){
   const snapped=nearestFloor(layout,wp);
   assert.equal(Math.hypot(wp.x-snapped.x,wp.y-snapped.y)<1,true,`${id} patrol waypoint (${wp.x},${wp.y}) must lie on walkable floor`);
  }
 }
 const src=fs.readFileSync('game/campaign.mjs','utf8');
 assert.ok(!src.includes('((i%2)?.1:-1)'),'.1 patrol typo must stay gone');
});

test('R53 missions: hpBonus accumulates, no impossible future eve_kept check on vega, and app_breach POV matches driver',()=>{
 const arch=buildMission('archive',{heat:'self',archive_key:true});
 assert.ok((arch.hpBonus||0)>=3,`archive hpBonus should stack heat+archive_key, got ${arch.hpBonus}`);
 assert.equal(buildMission('vega',{eve_kept:false}).boss.hp,buildMission('vega',{}).boss.hp,'vega precedes archive and must not scale on future eve_kept flag');
 assert.equal(buildMission('finale',{eve_kept:false}).boss.hp,buildMission('finale',{}).boss.hp+18,'finale scales on eve_kept===false');
 assert.equal((buildMission('finale',{vega_calibrator:true}).movePower||0)-(buildMission('finale',{}).movePower||0),1,'vega calibrator grants +1 movePower on Axis finale');
 const appBreachStep=CAMPAIGN.find(s=>s.id==='app_breach');
 assert.equal(appBreachStep.pov,DRIVING_MISSIONS[appBreachStep.drive].driver,'app_breach card POV matches driving driver');
 for(const [id,def] of Object.entries(FOOT))if(def.midEvent?.notice)assert.equal(def.midEvent.notice.startsWith(' '),false,`${id} midEvent notice has no leading space`);
});

test('R53 codex: Ines unlocks after contagion (no spoiler) and Tyrant/Archon tips match actual mechanics',()=>{
 const ines=CODEX.find(e=>e.id==='ines');
 assert.equal(ines.after,'contagion');
 const clinicIdx=stepIndex('app_clinic'),contagionIdx=stepIndex('contagion');
 assert.equal(codexOpen(ines,{step:clinicIdx+1,world:{rewards:['app_clinic']}},CAMPAIGN),false,'Ines stays locked right after app_clinic');
 assert.equal(codexOpen(ines,{step:contagionIdx+1,world:{rewards:['contagion']}},CAMPAIGN),true,'Ines unlocks after contagion');
 const tyrant=CODEX.find(e=>e.id==='tyrant'),archon=CODEX.find(e=>e.id==='archon');
 assert.ok(!/pannelli/i.test(tyrant.tipIt)&&!/panels/i.test(tyrant.tipEn),'Tyrant tip no longer claims moving panels');
 assert.match(tyrant.tipIt,/torace aperto/i);assert.match(tyrant.tipEn,/open chest/i);
 assert.ok(!/brilla d’oro/i.test(archon.tipIt)&&!/glows gold/i.test(archon.tipEn),'Archon tip no longer claims a golden weak point');
 assert.match(archon.tipIt,/Lulú rientra/i);assert.match(archon.tipEn,/Lulú rejoins/i);
});

test('R53 narrative & plot-twist coherence: pronouns, epilogue polarity/location, missing barks, and aligned pre/end scenes',()=>{
 assert.equal(EN_TEXT['Se torna, deve essere perché ha scelto di farlo.'],'If he comes back, it must be because he chose to.');
 const epGo=EPILOGUE[4]({line_choice:'go'}),epStay=EPILOGUE[4]({line_choice:'stay'});
 assert.match(epGo,/Ines guida i convogli/);assert.match(epStay,/ultimo autobus/);
 assert.ok(Object.hasOwn(EN_TEXT,epGo)&&Object.hasOwn(EN_TEXT,epStay));
 const epHand=EPILOGUE[7]({hand_taken:true}),epWait=EPILOGUE[7]({hand_taken:false});
 assert.match(epHand,/tetto del rifugio/);assert.match(epWait,/tetto del rifugio/);
 assert.ok(!epHand.includes('Asse')&&!epWait.includes('Asse'));
 assert.match(EN_TEXT[epHand],/shelter roof/);assert.match(EN_TEXT[epWait],/shelter roof/);
 assert.ok(BARKS.contagion.after?.text&&BARKS.contagion.afterb?.text,'contagion after/afterb barks exist');
 assert.ok(BARKS.line.unit9b?.text,'line unit9b bark exists');
 for(const line of [BARKS.contagion.after,BARKS.contagion.afterb,BARKS.line.unit9b])assert.ok(Object.hasOwn(EN_TEXT,line.text),line.text);
 for(const key of ['app_breach_pre','app_breach_end','app_port_pre','app_port_end','app_archive_pre','app_archive_end']){
  const lines=resolveLines(STORY[key],{});
  assert.ok(lines.length>=2,key);
  for(const l of lines)assert.ok(Object.hasOwn(EN_TEXT,l.text),`${key}: ${l.text}`);
 }
 assert.match(STORY.app_breach_pre[0].text,/boe|banchina/i);
 assert.match(STORY.app_port_pre[0].text,/pattuglie|vetro/i);
 assert.match(STORY.app_archive_pre[0].text,/capsula/i);
 assert.ok(resolveLines(STORY.ascent_pre,{eve_kept:true}).some(l=>l.text==='Sì. Avvertimi.'));
 assert.ok(STORY.glass_flood_end.some(l=>l.text==='Erano tre minuti miei.'));
 assert.match(veyraLineV9('ash_night','lose','it'),/vai dritto\./);
 assert.ok(HUBS.lower_hearth.people.some(p=>p[3].includes('a reggere')));
 assert.ok(HUBS.lower_hearth.people.some(p=>p[3].includes('Tengono caldo')));
 assert.equal(INTERIORS.antenna_port.smith.ask.apart,'Da solo contro i ricevitori di Elyon? Ti serve una schermatura doppia.');
 assert.equal(EN_TEXT['Hai lasciato andare la voce che ti guidava. Ora ogni passo che fai è solo tuo.'],'You let go of the voice that guided you. Now every step you take is yours alone.');
});

test('R53 locale & runtime flow: cargo travel Act IV EN rules, driveCleared->afterCleared, and guarded timers',()=>{
 assert.equal(translateText('Carico · Corona dell’Asse (Atto IV)','en'),'Cargo · Axis Crown (Act IV)');
 assert.equal(translateText('Imbarco Carico · Prosegui Missione (ATTO III)','en'),'Board Cargo · Continue Mission (ACT III)');
 assert.equal(translateText('42 monete','en'),'42 coins');
 assert.match(rt,/e\.type==='driveCleared'\{?[^}]*afterCleared\(CAMPAIGN\[progress\.step\]\)/);
 assert.match(rt,/title:step\.drive===3\|\|step\.drive===4\?'Fuori\.':'Siete arrivati\. Insieme\.'/);
 assert.match(rt,/const newMove=state\.moves\?\.at\(-1\),moveUnlocked=Boolean/);
 assert.match(rt,/else if\(!moveUnlocked&&!preparationNeeded/);
 assert.match(rt,/id==='axis_crown'\?'IV':'III'/);
 assert.match(rt,/const afterRun=\(fn,ms\)=>\{const r=runId;setTimeout\(\(\)=>\{if\(r===runId\)fn\(\);\},ms\);\};/);
 assert.match(rt,/function clearEndingTimers\(\)\{while\(endingTimers\.length\)clearTimeout\(endingTimers\.pop\(\)\);\}/);
});

test('R53 combat hitboxes: wide bosses like The Anchor take hull hits and blade_dash hits foes along its dash path',()=>{
 const def=buildMission('breach',{}),s=newRun(def.pov,def.map,'power',null,null,def);
 for(const n of s.nodes)n.on=true;
 const boss=s.enemies.find(e=>e.bossKind==='anchor');
 assert.ok(boss,'anchor boss spawns in breach');
 boss.state='walk';
 tick(s,{},.03);
 for(const m of s.enemies)if(m.role==='moor'){m.hp=0;m.relink=0;m.released=true;}
 s.x=boss.x-220;s.y=boss.y+60;s.aim={x:1,y:0};
 const hpBefore=boss.hp;
 assert.equal(startAttack(s,'gun',{x:1,y:0}),true,'fires horizontally across Anchor 160 px wide hull at y+60');
 for(let i=0;i<8;i++)tick(s,{},.03);
 assert.ok(boss.hp<hpBefore,`Anchor wide hull hit at +60 px offset must register damage (before ${hpBefore}, after ${boss.hp})`);

 const bDef=buildMission('blackout',{}),b=newRun('nox',bDef.map,'power',null,null,{...bDef,magic:true});
 b.moves=['nox_pulse','nox_slash'];b.activeMove='nox_slash';b.magicCd=0;
 b.x=700;b.y=700;
 b.enemies=[{...b.enemies[0],id:99,x:730,y:700,hp:50,max:50,state:'walk',boss:false,role:'raider',detectRange:0}];
 assert.equal(switchMove(b,'nox_slash'),false,'nox_slash already active');
 assert.equal(startAttack(b,'magic',{x:1,y:0}),true,'starts blade_dash through enemy');
 for(let i=0;i<15;i++)tick(b,{},.03);
 assert.ok(b.x>820,`Nox dashed past enemy to x=${b.x}`);
 assert.ok(b.enemies[0].hp<50,'blade_dash must damage enemies crossed along the dash path, not only at the endpoint');
});

test('R53 combat telegraphs & Sonic Nova: Nova clears shots out to 190 px and boss charge matches its 116 px painted corridor',()=>{
 const def=buildMission('contagion',{}),s=newRun('lulu',def.map,'power',null,null,def);
 s.signature='sonic_nova';s.sigCd=0;s.x=768;s.y=768;
 s.shots=[{x:768+155,y:768-34,vx:-200,vy:0,life:2}];
 tick(s,{duo:true},.02);
 assert.equal(s.shots.length,0,'sonic_nova must clear enemy projectiles inside its visible 190 px shockwave ring');

 const fDef=buildMission('zero',{}),f=newRun(fDef.pov,fDef.map,'power',null,null,fDef);
 const boss=f.enemies.find(e=>e.boss);
 assert.ok(boss,'custode boss spawns');
 f.enemies=[boss];f.x=768;f.y=768+62;
 boss.x=768-80;boss.y=768;boss.state='charge';boss.windup=.5;boss.clock=.6;boss.dir={x:1,y:0};boss.hitThisCharge=false;
 const hp0=f.hp;
 for(let i=0;i<12;i++)tick(f,{},.02);
 assert.equal(f.hp,hp0,'standing 62 px outside boss charge centerline (painted ±58 px corridor) avoids phantom hits');
 assert.match(rt,/ctx\.lineWidth=116;/,'boss charge corridor width matches ±58 px contact radius (boss 38 + hero 20)');
 assert.match(rt,/nx=-d\.y\*58,ny=d\.x\*58;/,'boss charge draws outer boundary rails at ±58 px');
});

test('R53 driving, racing & scenery dimensions: strike/sonar/vortex alignment and human-scale non-objective cover props',()=>{
 const dSafe=newDrive(3);dSafe.hazards=[];dSafe.x=360+58;dSafe.strikes=[{x:360,warn:.05,t:0}];
 const hpBefore=dSafe.hp;
 driveTick(dSafe,{throttle:0,brake:0,steer:0},.05);
 assert.equal(dSafe.hp,hpBefore,'driving outside the painted 112 px (±56 px) drone strike lane takes no damage');
 assert.match(rt,/fillRect\(k\.x-56,0,112,worldH\)/,'driving drone telegraph matches ±56 px hit width');
 assert.match(rt,/strokeRect\(hazard\.x-48,y-52,96,122\)/,'dark-tunnel sonar frame vertically wraps hazard sprite [y-49, y+71]');
 assert.ok(rt.includes('ctx.translate(p.x,carY+3);'),
  'race player Vortex translates to carY+3 matching rivals and nitro jets');
 assert.ok(rt.includes('ctx.drawImage(vortex,f.col*cw,f.row*ch,cw,ch,-VEYRA_CAR.centre[0]*vk,-VEYRA_CAR.centre[1]*vk,cw*vk,ch*vk)'),
  'race player Vortex is centered on VEYRA_CAR.centre without the legacy +60 px downward shift');
 assert.ok(!rt.includes('60-VEYRA_CAR.centre[1]*vk'),'legacy +60 px race car vertical offset must stay gone');
 const sc=fs.readFileSync('game/scenery.mjs','utf8');
 assert.match(sc,/sz=Math\.min\(88,Math\.min\(W,H\)-16\),cell=d===2\?3:2\+\(k&1\)/,
  'scenery interior cover props clamp to <=88 px and never stamp objective relays or Clinic medkits onto solid walls');
});

