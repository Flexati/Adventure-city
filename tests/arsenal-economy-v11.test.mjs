import test from 'node:test';
import assert from 'node:assert/strict';
import {MARKET_GEAR_ITEMS} from '../game/arsenal-data.mjs';
import {
 MARKET_WEAPONS,HERO_MOVES,WEAPONS_V9,MARKET_WEAPON_IDS,
 unlockedWeaponsV9,createArsenalV9,loadArsenalV9,saveArsenalV9,
 unlockedMovesV11,moveDefV11,maxMagV11
} from '../game/weapons-v9.mjs';
import {
 HUBS,HUB_ITEMS,newWorld,validateWorld,acceptHubJob,workHubTarget,finishHubJob,
 hubCatalog,hubReputation,hubDiscount,itemPrice,buyHubItem,sellHubItem,
 exchangeScrap,claimCombatLoot,applyEquipment
} from '../game/hubs.mjs';
import {newRun,tick,switchMove} from '../game/campaign.mjs';
import {buildMission,newProgress} from '../game/missions.mjs';

function runUntil(s,fn,seconds=2,dt=1/60){
 const steps=Math.ceil(seconds/dt);
 const events=[];
 for(let i=0;i<steps;i++){
  const input=typeof fn==='function'?fn(i,s):{};
  tick(s,input,dt);
  events.push(...s.events);
 }
 return events;
}

test('thirteen market weapons and nine gear items are registered',()=>{
 assert.equal(MARKET_WEAPON_IDS.length,13);
 for(const id of ['mg_tempest','mg_vulcan','mg_helix','mg_shredder','orb_nova','orb_void','plasma_carbine','scatter_flak','rail_lance','arc_tesla','flame_pyre','cryo_shard','sniper_chronos']){
  assert.ok(MARKET_WEAPONS[id],`missing market weapon ${id}`);
  assert.ok(WEAPONS_V9[id],`missing WEAPONS_V9 ${id}`);
  assert.ok(HUB_ITEMS[id],`missing HUB_ITEMS ${id}`);
  assert.equal(HUB_ITEMS[id].arsenalId,id);
 }
 assert.equal(Object.keys(MARKET_GEAR_ITEMS).length,9);
});

test('all 14 village hubs have diversified catalogs covering all new weapons and gear',()=>{
 const signatures=new Map();
 const covered=new Set();
 for(const [hubId,h] of Object.entries(HUBS)){
  const perService=h.services.map(svc=>`${svc}:${hubCatalog(hubId,svc).join(',')}`).join('|');
  assert.ok(!signatures.has(perService),`duplicate catalog signature between ${hubId} and ${signatures.get(perService)}`);
  signatures.set(perService,hubId);
  for(const svc of h.services)for(const itemId of hubCatalog(hubId,svc))covered.add(itemId);
 }
 assert.equal(signatures.size,14);
 for(const id of [...MARKET_WEAPON_IDS,...Object.keys(MARKET_GEAR_ITEMS)]){
  assert.ok(covered.has(id),`item ${id} not sold in any of the 14 hubs`);
 }
});

test('world economy supports scrap persistence, exchange, resale, reputation discounts and combat bounties',()=>{
 const p=newProgress();
 p.world.visited.push('toxic');
 assert.equal(p.world.scrap,0);
 assert.equal(hubReputation(p,'toxic'),0);
 assert.equal(hubDiscount(p,'toxic'),0);
 const basePrice=itemPrice(p,'toxic','mg_vulcan');
 assert.equal(basePrice,HUB_ITEMS.mg_vulcan.price);

 // Complete first toxic job -> 10% local reputation discount
 const job1=HUBS.toxic.jobs[0];
 assert.ok(acceptHubJob(p,'toxic',job1.id));
 for(const t of job1.targets)assert.ok(workHubTarget(p,'toxic',t));
 assert.ok(finishHubJob(p,'toxic',job1.id));
 assert.equal(hubReputation(p,'toxic'),1);
 assert.equal(hubDiscount(p,'toxic'),0.1);
 assert.equal(itemPrice(p,'toxic','mg_vulcan'),Math.round(HUB_ITEMS.mg_vulcan.price*0.9));

 // Second job -> 20% cap
 const job2=HUBS.toxic.jobs[1];
 assert.ok(acceptHubJob(p,'toxic',job2.id));
 for(const t of job2.targets)assert.ok(workHubTarget(p,'toxic',t));
 assert.ok(finishHubJob(p,'toxic',job2.id));
 assert.equal(hubDiscount(p,'toxic'),0.2);

 // Scrap & resale loop
 p.world.scrap=20;
 const ex=exchangeScrap(p);
 assert.equal(ex.ok,true);
 assert.equal(ex.spent,20);
 assert.equal(ex.coins,10); // R22: two scrap for one coin
 assert.equal(p.world.scrap,0);

 const beforeCoins=p.world.coins;
 const bought=buyHubItem(p,'toxic','smith','mg_vulcan');
 assert.equal(bought.ok,true);
 assert.equal(p.world.coins,beforeCoins-Math.round(HUB_ITEMS.mg_vulcan.price*0.8));
 assert.equal(p.world.equipment.weapon,'mg_vulcan');

 // Selling refunds 60% and clears equipment slot
 const sold=sellHubItem(p,'mg_vulcan');
 assert.equal(sold.ok,true);
 assert.equal(sold.coins,Math.round(HUB_ITEMS.mg_vulcan.price*0.6));
 assert.equal(p.world.equipment.weapon,undefined);
 assert.ok(validateWorld(p.world));
 assert.equal(validateWorld({...p.world,scrap:-1}),null);

 // Combat loot bounty claim
 const loot=claimCombatLoot(p,{bountyCoins:14,bountyScrap:11});
 assert.deepEqual(loot,{coins:14,scrap:11});
 assert.equal(p.world.scrap,11);
});

test('ammo_belt and market gear integrate with buildMission and createArsenalV9',()=>{
 const p=newProgress();
 p.world.visited.push('moon','toxic');
 p.world.coins=500;
 assert.equal(buyHubItem(p,'moon','smith','mg_tempest').ok,true);
 assert.equal(buyHubItem(p,'moon','shop','ammo_belt').ok,true);
 assert.equal(buyHubItem(p,'toxic','shop','hazmat_coat').ok,true); // R22: the smith keeps the base gear, the coat is in the shop

 const raw=buildMission('app_breach',p.narrative.flags,p.cityChoice,p.world);
 const def=applyEquipment(p,raw);
 assert.equal(def.combatV9,true);
 assert.ok(def.marketWeapons.includes('mg_tempest'));
 assert.equal(def.magBonus,2);
 assert.equal(def.hpBonus,3);

 const a=createArsenalV9('nox',['tessa'],['mg_tempest'],def.magBonus);
 assert.equal(maxMagV11(a,'mg_tempest'),42);
 assert.equal(a.ammo.mg_tempest,42);
 const reloaded=loadArsenalV9(saveArsenalV9(a));
 assert.deepEqual(reloaded,a);
 assert.ok(unlockedWeaponsV9('nox',['tessa'],['mg_tempest']).includes('mg_tempest'));
});

test('machine gun bursts, energy sphere AoE detonation, rail pierce and arc chain work in combat ticks',()=>{
 // 1. Machine gun rapid burst (tempest = 5 rounds per burst) + bounty accumulation
 const mgDef=buildMission('docks_veyra',{'weapon.tessa':true,'weapon.active.nox':'mg_tempest'},null,{inventory:{mg_tempest:1}});
 const mgState=newRun('nox',1,'power',null,null,mgDef);mgState.x=800;mgState.y=1184; // R26: the open street of Ash Docks, east of it is floor (the start sits in the gate)
 mgState.enemies=[{id:1,role:'raider',x:mgState.x+140,y:mgState.y,hp:2,max:2,clock:0,state:'walk',walk:0,hurtAnim:0,deathAnim:0,face:-1,boss:false,moveSpeed:0,detectRange:300,windup:1,attackRadius:60,recovery:1,reach:60}];
 const mgEvents=runUntil(mgState,(i)=>i===0?{gun:true,aim:{x:1,y:0}}:{},0.6);
 const shots=mgEvents.filter(e=>e.type==='shot');
 assert.equal(shots.length,5,'mg_tempest should fire 5 shots in one burst');
 assert.equal(mgState.enemies[0].hp,0);
 assert.ok(mgState.bountyCoins>=1&&mgState.bountyScrap>=1,'killing enemy awards bounty coins & scrap');

 // 2. Energy Sphere (orb_nova) launches projectile & explodes AoE hitting clustered enemies
 const orbDef=buildMission('app_breach',{'weapon.tessa':true,'weapon.active.lulu':'orb_nova'},null,{inventory:{orb_nova:1}});
 const orbState=newRun('lulu',1,'power',null,null,orbDef);orbState.x=672;orbState.y=800; // R26: middle of the courtyard
 orbState.enemies=[
  {id:1,role:'raider',x:orbState.x+120,y:orbState.y,hp:6,max:6,clock:0,state:'walk',walk:0,hurtAnim:0,deathAnim:0,face:-1,boss:false,moveSpeed:0,detectRange:300,windup:1,attackRadius:60,recovery:1,reach:60},
  {id:2,role:'raider',x:orbState.x+160,y:orbState.y+25,hp:6,max:6,clock:0,state:'walk',walk:0,hurtAnim:0,deathAnim:0,face:-1,boss:false,moveSpeed:0,detectRange:300,windup:1,attackRadius:60,recovery:1,reach:60}
 ];
 const orbEvents=runUntil(orbState,(i)=>i===0?{gun:true,aim:{x:1,y:0}}:{},1.0);
 assert.ok(orbEvents.some(e=>e.type==='orbLaunch'));
 assert.ok(orbEvents.some(e=>e.type==='orbBurst'));
 assert.ok(orbState.enemies[0].hp<6&&orbState.enemies[1].hp<6,'energy sphere AoE should hit both clustered enemies');

 // 3. Rail lance pierces 3 enemies in line; Arc tesla chains across nearby targets
 const railDef=buildMission('docks_veyra',{'weapon.tessa':true,'weapon.active.nox':'rail_lance'},null,{inventory:{rail_lance:1}});
 const railState=newRun('nox',1,'power',null,null,railDef);
 railState.enemies=[1,2,3].map(k=>({id:k,role:'raider',x:railState.x,y:railState.y-80*k,hp:10,max:10,clock:0,state:'walk',walk:0,hurtAnim:0,deathAnim:0,face:-1,boss:false,moveSpeed:0,detectRange:300,windup:1,attackRadius:60,recovery:1,reach:60}));
 runUntil(railState,(i)=>i===0?{gun:true,aim:{x:0,y:-1}}:{},0.35);
 assert.ok(railState.enemies.every(e=>e.hp<10),'rail lance should pierce through all 3 lined-up enemies');

 const arcDef=buildMission('app_breach',{'weapon.tessa':true,'weapon.active.lulu':'arc_tesla'},null,{inventory:{arc_tesla:1}});
 const arcState=newRun('lulu',1,'power',null,null,arcDef);
 arcState.enemies=[
  {id:1,role:'raider',x:arcState.x,y:arcState.y-100,hp:10,max:10,clock:0,state:'walk',walk:0,hurtAnim:0,deathAnim:0,face:-1,boss:false,moveSpeed:0,detectRange:300,windup:1,attackRadius:60,recovery:1,reach:60},
  {id:2,role:'raider',x:arcState.x+40,y:arcState.y-180,hp:10,max:10,clock:0,state:'walk',walk:0,hurtAnim:0,deathAnim:0,face:-1,boss:false,moveSpeed:0,detectRange:300,windup:1,attackRadius:60,recovery:1,reach:60},
  {id:3,role:'raider',x:arcState.x-40,y:arcState.y-240,hp:10,max:10,clock:0,state:'walk',walk:0,hurtAnim:0,deathAnim:0,face:-1,boss:false,moveSpeed:0,detectRange:300,windup:1,attackRadius:60,recovery:1,reach:60}
 ];
 runUntil(arcState,(i)=>i===0?{gun:true,aim:{x:0,y:-1}}:{},0.35);
 assert.ok(arcState.enemies.every(e=>e.hp<10&&e.state==='stun'),'arc tesla should chain across all 3 enemies and stun them');
});

test('Nox and Lulù unlock progression special moves across Acts I-IV and fire distinctly',()=>{
 assert.deepEqual(unlockedMovesV11('nox',1),['nox_pulse']);
 assert.deepEqual(unlockedMovesV11('nox',2),['nox_pulse','nox_orb']);
 assert.deepEqual(unlockedMovesV11('nox',3),['nox_pulse','nox_orb','nox_flurry','nox_slash']);
 assert.deepEqual(unlockedMovesV11('nox',4),['nox_pulse','nox_orb','nox_flurry','nox_slash','nox_nova']);

 assert.deepEqual(unlockedMovesV11('lulu',1),['lulu_wave']);
 assert.deepEqual(unlockedMovesV11('lulu',4),['lulu_wave','lulu_orb','lulu_aegis','lulu_stasis','lulu_supernova']);
 assert.equal(HERO_MOVES.nox.length,5);
 assert.equal(HERO_MOVES.lulu.length,5);

 // Act 4 Nox: defaults to nox_pulse, can select/switch to nova, flurry (refills half magazine), and orb
 const defN=buildMission('finale',{'weapon.tessa':true,'move.active.nox':'nox_nova'});
 const sN=newRun('nox',3,'power',null,null,defN);
 assert.equal(sN.activeMove,'nox_nova');
 assert.equal(switchMove(sN,'nox_flurry'),true);
 sN.arsenal.ammo.c9=0;
 sN.enemies=[{id:1,role:'raider',x:sN.x+90,y:sN.y,hp:30,max:30,clock:0,state:'walk',walk:0,hurtAnim:0,deathAnim:0,face:-1,boss:false,moveSpeed:0,detectRange:300,windup:1,attackRadius:60,recovery:1,reach:60}];
 runUntil(sN,(i)=>i===0?{magic:true,aim:{x:1,y:0}}:{},0.5);
 assert.ok(sN.arsenal.ammo.c9>=6,'nox_flurry should refill at least half magazine');
 assert.ok(sN.enemies[0].hp<30);

 // Act 4 Lulù: defaults to lulu_wave, switch to supernova (heal + chain burst) and aegis (invulnerability dome)
 const sL=newRun('lulu',3,'power',null,null,null);
 assert.equal(sL.activeMove,'lulu_wave');
 assert.equal(switchMove(sL,'lulu_supernova'),true);
 sL.hp=sL.maxHp-2;
 sL.enemies=[
  {id:1,role:'raider',x:sL.x+120,y:sL.y,hp:30,max:30,clock:0,state:'walk',walk:0,hurtAnim:0,deathAnim:0,face:-1,boss:false,moveSpeed:0,detectRange:300,windup:1,attackRadius:60,recovery:1,reach:60},
  {id:2,role:'raider',x:sL.x-110,y:sL.y+80,hp:30,max:30,clock:0,state:'walk',walk:0,hurtAnim:0,deathAnim:0,face:1,boss:false,moveSpeed:0,detectRange:300,windup:1,attackRadius:60,recovery:1,reach:60}
 ];
 const superEv=runUntil(sL,(i)=>i===0?{magic:true}:{},0.75);
 assert.ok(superEv.some(e=>e.type==='supernova'));
 assert.equal(sL.hp,sL.maxHp-1,'lulu_supernova heals +1 on hit');
 assert.ok(sL.enemies.every(e=>e.hp<30&&e.state==='stun'));

 sL.magicCd=0;
 assert.equal(switchMove(sL,'lulu_aegis'),true);
 const aegisEv=runUntil(sL,(i)=>i===0?{magic:true}:{},0.75);
 assert.ok(aegisEv.some(e=>e.type==='aegis'));
 assert.ok(sL.inv>0.5,'lulu_aegis should grant 1.5s invulnerability');
});

test('machine-gun spinUp accelerates fire cadence, blade_dash and stasis_field work, and chests/combo/drops reward play',()=>{
 // 1. MG spinUp increases when holding gun and accelerates cadence (cooldown shrinks)
 const mgDef=buildMission('docks_veyra',{'weapon.tessa':true,'weapon.active.nox':'mg_shredder'},null,{inventory:{mg_shredder:1}});
 const mgState=newRun('nox',1,'power',null,null,mgDef);mgState.x=800;mgState.y=1184;
 mgState.enemies=[{id:1,role:'raider',x:mgState.x+160,y:mgState.y,hp:60,max:60,clock:0,state:'walk',walk:0,hurtAnim:0,deathAnim:0,face:-1,boss:false,moveSpeed:0,detectRange:300,windup:1,attackRadius:60,recovery:1,reach:60}];
 runUntil(mgState,()=>({gun:true,aim:{x:1,y:0}}),0.45);
 assert.ok(mgState.spinUp>0.3,'holding fire builds spinUp momentum');

 // 2. Nox blade_dash (nox_slash) & Lulù stasis_field (lulu_stasis)
 const sN=newRun('nox',2,'power',null,null,null);sN.x=672;sN.y=800;
 assert.equal(switchMove(sN,'nox_slash'),true);
 sN.enemies=[{id:1,role:'raider',x:sN.x+120,y:sN.y,hp:30,max:30,clock:0,state:'walk',walk:0,hurtAnim:0,deathAnim:0,face:-1,boss:false,moveSpeed:0,detectRange:300,windup:1,attackRadius:60,recovery:1,reach:60}];
 const slashEv=runUntil(sN,(i)=>i===0?{magic:true,aim:{x:1,y:0}}:{},0.4);
 assert.ok(slashEv.some(e=>e.type==='bladeSlash'),'nox_slash should emit bladeSlash');
 assert.ok(sN.enemies[0].hp<30&&sN.enemies[0].state==='stun','nox_slash damages and stuns');

 const sL=newRun('lulu',2,'power',null,null,null);sL.x=672;sL.y=800;
 assert.equal(switchMove(sL,'lulu_stasis'),true);
 sL.enemies=[{id:1,role:'raider',x:sL.x+130,y:sL.y,hp:30,max:30,clock:0,state:'walk',walk:0,hurtAnim:0,deathAnim:0,face:-1,boss:false,moveSpeed:0,detectRange:300,windup:1,attackRadius:60,recovery:1,reach:60}];
 const stasisEv=runUntil(sL,(i)=>i===0?{magic:true}:{},0.4);
 assert.ok(stasisEv.some(e=>e.type==='stasisField'),'lulu_stasis should emit stasisField');
 assert.ok(sL.shift>0,'lulu_stasis activates Chrono Shift');
 assert.ok(sL.enemies[0].hp<30&&sL.enemies[0].state==='stun');

 // 3. Interactive 3D Chest spawning & opening + Combo streak & magnetized drops
 const chDef=buildMission('blackout',{'weapon.tessa':true},null,{inventory:{}});
 const chState=newRun('nox',0,'power',null,null,chDef);
 assert.ok(Array.isArray(chState.chests)&&chState.chests.length>=1,'missions spawn interactive treasure chests');
 const chest=chState.chests[0];
 chState.x=chest.x+18;chState.y=chest.y;chState.hp=Math.max(1,chState.maxHp-3);
 const chEv=runUntil(chState,(i)=>i===0?{interact:true}:{},0.2);
 assert.ok(chEv.some(e=>e.type==='chestOpened'),'pressing interact near chest opens it');
 assert.equal(chest.open,true);
 assert.ok(chState.bountyCoins>=15,'opening chest grants bonus coins');

 chState.enemies=[
  {id:1,role:'raider',x:chState.x+80,y:chState.y,hp:1,max:1,clock:0,state:'walk',walk:0,hurtAnim:0,deathAnim:0,face:-1,boss:false,moveSpeed:0,detectRange:300,windup:1,attackRadius:60,recovery:1,reach:60},
  {id:2,role:'raider',x:chState.x+110,y:chState.y,hp:1,max:1,clock:0,state:'walk',walk:0,hurtAnim:0,deathAnim:0,face:-1,boss:false,moveSpeed:0,detectRange:300,windup:1,attackRadius:60,recovery:1,reach:60}
 ];
 const killEv=runUntil(chState,(i)=>i===0||i===22?{gun:true,aim:{x:1,y:0}}:{},1.2);
 assert.ok(chState.combo>=2,'consecutive kills build combo streak');
 assert.ok(killEv.some(e=>e.type==='comboMilestone')||chState.drops.length>0||killEv.some(e=>e.type==='dropPickup'),'kills spawn magnetized drops and combo milestones');
});

test('all story choices have non-empty mechanical or epilogue outcomes and English coverage',async()=>{
 const {CHOICES,CHOICE_NOTICES,EPILOGUE}=await import('../game/story-v08.mjs');
 const {EN_TEXT}=await import('../game/locale.mjs');
 for(const [cid,notices] of Object.entries(CHOICE_NOTICES)){
  for(const text of Object.values(notices))assert.ok(Object.hasOwn(EN_TEXT,text),'missing EN_TEXT for choice notice: '+cid);
 }
 // chalk_route: direct vs service produce distinct buildMission stats
 const directM=buildMission('exp_chalk_marks',{'exp.chalk.route':'direct'});
 const serviceM=buildMission('exp_chalk_marks',{'exp.chalk.route':'service'});
 assert.ok(directM.speed>serviceM.speed&&directM.choiceBonusScrap>=15);
 assert.ok((serviceM.hpBonus||0)>=2&&(serviceM.nodeHeal||0)>=1);
 // rooftop_glass & promise_accept & promise_trust
 const truthM=buildMission('app_clinic',{glass_truth:true,promise_trust:'blind',promise_accept:true});
 const unsureM=buildMission('app_clinic',{glass_truth:false,promise_trust:'evasive',promise_accept:false});
 assert.notDeepEqual({dmg:truthM.damage,hp:truthM.hpBonus||0,duo:truthM.duoBonus||0},{dmg:unsureM.damage,hp:unsureM.hpBonus||0,duo:unsureM.duoBonus||0});
 // archive_eve & line_wait
 const keepM=buildMission('finale',{eve_kept:true,line_choice:'stay'});
 const silM=buildMission('finale',{eve_kept:false,line_choice:'go'});
 assert.ok(keepM.windupBonus>0&&silM.speed>keepM.speed);
 // hand choice alters epilogue line
 const epTake=EPILOGUE.map(fn=>fn({hand_taken:true})).join('|');
 const epWait=EPILOGUE.map(fn=>fn({hand_taken:false})).join('|');
 assert.notEqual(epTake,epWait,'hand choice changes epilogue');
 assert.ok(Object.keys(CHOICES).every(id=>CHOICE_NOTICES[id]),'every CHOICES entry has CHOICE_NOTICES');
});

test('all 14 hubs have KEY_CHARACTER_ARCS with English copy and campaign hubs unlock distinct Act perks',async()=>{
 const {KEY_CHARACTER_ARCS,keyCharacterArc,keyArcTexts}=await import('../game/arsenal-data.mjs');
 const {EN_TEXT}=await import('../game/locale.mjs');
 for(const hubId of Object.keys(HUBS)){
  assert.ok(KEY_CHARACTER_ARCS[hubId],'missing KEY_CHARACTER_ARCS for '+hubId);
  const arc=keyCharacterArc(hubId,{blackout_choice:'workshop'});
  assert.ok(arc&&Object.keys(arc.options).length===2,hubId+' has 2 options');
 }
 for(const text of keyArcTexts())assert.ok(Object.hasOwn(EN_TEXT,text),'missing EN_TEXT for keyArcTexts: '+text);
 assert.equal(keyCharacterArc('moon',{blackout_choice:'workshop'}).service,'smith');
 assert.equal(keyCharacterArc('moon',{blackout_choice:'shelter'}).service,'inn');
 // Campaign unlocks produce distinct mission stats
 assert.ok(buildMission('breach',{'unlock.moon':'flank'}).damage>buildMission('breach',{'unlock.moon':'armor'}).damage);
 assert.ok((buildMission('zero',{'unlock.cathedral':'seal'}).movePower||0)>(buildMission('zero',{'unlock.cathedral':'sanctuary'}).movePower||0));
 assert.ok((buildMission('archive',{'unlock.toxic':'purify'}).hpBonus||0)>(buildMission('archive',{'unlock.toxic':'cipher'}).hpBonus||0));
 assert.ok(buildMission('ascent',{'unlock.clockwork':'bypass'}).speed>buildMission('ascent',{'unlock.clockwork':'overload'}).speed);
});


