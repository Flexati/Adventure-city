import test from 'node:test';
import assert from 'node:assert/strict';
import {createArsenalV9,grantWeaponRewardV9,switchWeaponV9,tickArsenalV9,fireWeaponV9,reloadWeaponV9,saveArsenalV9,loadArsenalV9,WEAPONS_V9} from '../game/weapons-v9.mjs';
import {newRun,tick,startAttack} from '../game/campaign.mjs';
const rewards=['tessa','anchor_component','vega_component','eden_technology'];
test('story rewards unlock only the protagonist kit; Needle needs both components and duplicate rewards cannot refill',()=>{
 const a=createArsenalV9('nox');assert.deepEqual(Object.keys(a.ammo),['c9']);
 assert.deepEqual(grantWeaponRewardV9(a,'vega_component'),[]);
 assert.deepEqual(grantWeaponRewardV9(a,'anchor_component'),['h17']);
 assert.deepEqual(grantWeaponRewardV9(a,'tessa'),['vx9']);a.ammo.vx9=1;
 assert.deepEqual(grantWeaponRewardV9(a,'tessa'),[]);assert.equal(a.ammo.vx9,1);
 assert.equal(switchWeaponV9(a,'arc7'),false);
 assert.deepEqual(Object.keys(createArsenalV9('lulu',rewards).ammo),['c9','r12','arc7']);
});
test('all weapons fire, exhaust, reload, switch and restore without bypassing cooldown',()=>{
 for(const hero of ['nox','lulu'])for(const id of Object.keys(createArsenalV9(hero,rewards).ammo)){
  let a=createArsenalV9(hero,rewards);if(id!=='c9')assert.ok(switchWeaponV9(a,id));tickArsenalV9(a,1);
  while(a.ammo[id]){assert.ok(fireWeaponV9(a));assert.equal(switchWeaponV9(a),false);a=loadArsenalV9(saveArsenalV9(a));assert.ok(a);assert.equal(fireWeaponV9(a),null);tickArsenalV9(a,1);}
  assert.equal(fireWeaponV9(a),null);assert.ok(a.reloadRemaining>0);assert.equal(switchWeaponV9(a),false);
  a=loadArsenalV9(saveArsenalV9(a));tickArsenalV9(a,2);assert.equal(a.ammo[id],WEAPONS_V9[id].magazine);assert.equal(reloadWeaponV9(a),false);
 }
});
test('corrupt or incompatible arsenal saves cannot grant locked weapons or invalid ammunition',()=>{
 const a=createArsenalV9('nox');for(const bad of [{...a,active:'h17'},{...a,ammo:{c9:-1}},{...a,ammo:{c9:99}},{...a,cooldown:null},{...a,reloadRemaining:99},{...a,rewards:['invented']},{...a,hero:'both'},{...a,version:2}])assert.equal(loadArsenalV9(JSON.stringify(bad)),null);
 assert.equal(loadArsenalV9('{'),null);
});
function arena(hero,id){
 const s=newRun(hero,0,'power',null,null,{id:'test',hp:100,speed:0,damage:10,cooldown:.4,magic:true,partner:false,combatV9:true,weaponRewards:rewards,waves:[['raider','raider','raider']],nodes:[{x:1300,y:710}],start:{x:768,y:850}});
 s.arsenal.active=id;s.enemies.forEach((e,i)=>{e.x=768;e.y=760-i*70;e.detectRange=0;e.moveSpeed=0;e.hp=e.max=100;});return s;
}
function shoot(s){assert.ok(startAttack(s,'gun',{x:0,y:-1}));for(let i=0;i<7;i++)tick(s,{},.05);}
test('VX-9 emits three timed hits and consumes three cartridges, not three simultaneous attacks',()=>{
 const s=arena('nox','vx9');assert.ok(startAttack(s,'gun',{x:0,y:-1}));tick(s,{},.05);assert.equal(s.enemies[0].hp,100);tick(s,{},.05);assert.equal(s.enemies[0].hp,93.5);for(let i=0;i<5;i++)tick(s,{},.05);assert.equal(s.enemies[0].hp,80.5);assert.equal(s.arsenal.ammo.vx9,21);
});
test('Needle pierces two enemies; Choir chains to three; C-9 hits only the first',()=>{
 for(const [hero,id,expected] of [['nox','h17',2],['lulu','arc7',3],['nox','c9',1]]){const s=arena(hero,id);shoot(s);assert.equal(s.enemies.filter(e=>e.hp<100).length,expected);}
});
test('R-12 rewards close-range spread and cannot hit outside its range',()=>{
 const s=arena('lulu','r12');s.enemies[0].x=750;s.enemies[0].y=790;s.enemies[1].x=800;s.enemies[1].y=760;s.enemies[2].y=600;shoot(s);assert.ok(s.enemies[0].hp<=80.5);assert.ok(s.enemies[1].hp<100);assert.equal(s.enemies[2].hp,100);
});
test('weapon rays and chain links cannot travel through district walls',()=>{
 for(const [hero,id] of [['nox','h17'],['lulu','arc7']]){const s=arena(hero,id);s.x=550;s.y=600;s.enemies.forEach(e=>{e.x=450;e.y=450;});assert.ok(startAttack(s,'gun',{x:-100,y:-150}));for(let i=0;i<7;i++)tick(s,{},.05);assert.ok(s.enemies.every(e=>e.hp===100));}
});
test('held switch input cycles once and failed missions freeze reload',()=>{
 const s=arena('nox','c9');for(let i=0;i<30;i++)tick(s,{switchWeapon:true},.05);assert.equal(s.arsenal.active,'vx9');tick(s,{},.05);tick(s,{switchWeapon:true},.05);assert.equal(s.arsenal.active,'h17');s.arsenal.ammo.h17=0;reloadWeaponV9(s.arsenal);s.status='failed';tick(s,{},.05);assert.equal(s.arsenal.reloadRemaining,WEAPONS_V9.h17.reload);
});
test('legacy missions remain on the baseline weapon rules until explicitly enabled',()=>{assert.equal(newRun().arsenal,undefined);});
