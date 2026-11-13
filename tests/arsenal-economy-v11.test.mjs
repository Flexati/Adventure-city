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

test('nine new market weapons including machine guns and energy spheres are registered',()=>{
 assert.equal(MARKET_WEAPON_IDS.length,9);
 for(const id of ['mg_tempest','mg_vulcan','mg_helix','orb_nova','orb_void','plasma_carbine','scatter_flak','rail_lance','arc_tesla']){
  assert.ok(MARKET_WEAPONS[id],`missing market weapon ${id}`);
  assert.ok(WEAPONS_V9[id],`missing WEAPONS_V9 ${id}`);
  assert.ok(HUB_ITEMS[id],`missing HUB_ITEMS ${id}`);
  assert.equal(HUB_ITEMS[id].arsenalId,id);
 }
 assert.equal(Object.keys(MARKET_GEAR_ITEMS).length,7);
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
 assert.equal(ex.coins,24);
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
 assert.equal(buyHubItem(p,'toxic','smith','hazmat_coat').ok,true);

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
 const mgState=newRun('nox',1,'power',null,null,mgDef);
 mgState.enemies=[{id:1,role:'raider',x:mgState.x+140,y:mgState.y,hp:2,max:2,clock:0,state:'walk',walk:0,hurtAnim:0,deathAnim:0,face:-1,boss:false,moveSpeed:0,detectRange:300,windup:1,attackRadius:60,recovery:1,reach:60}];
 const mgEvents=runUntil(mgState,(i)=>i===0?{gun:true,aim:{x:1,y:0}}:{},0.6);
 const shots=mgEvents.filter(e=>e.type==='shot');
 assert.equal(shots.length,5,'mg_tempest should fire 5 shots in one burst');
 assert.equal(mgState.enemies[0].hp,0);
 assert.ok(mgState.bountyCoins>=2&&mgState.bountyScrap>=3,'killing enemy awards bounty coins & scrap');

 // 2. Energy Sphere (orb_nova) launches projectile & explodes AoE hitting clustered enemies
 const orbDef=buildMission('app_breach',{'weapon.tessa':true,'weapon.active.lulu':'orb_nova'},null,{inventory:{orb_nova:1}});
 const orbState=newRun('lulu',1,'power',null,null,orbDef);
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
 assert.deepEqual(unlockedMovesV11('nox',3),['nox_pulse','nox_orb','nox_flurry']);
 assert.deepEqual(unlockedMovesV11('nox',4),['nox_pulse','nox_orb','nox_flurry','nox_nova']);

 assert.deepEqual(unlockedMovesV11('lulu',1),['lulu_wave']);
 assert.deepEqual(unlockedMovesV11('lulu',4),['lulu_wave','lulu_orb','lulu_aegis','lulu_supernova']);
 assert.equal(HERO_MOVES.nox.length,4);
 assert.equal(HERO_MOVES.lulu.length,4);

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

