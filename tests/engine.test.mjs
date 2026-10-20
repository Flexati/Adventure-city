import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,step,attack,dodge,assist,interact,choose,hydrate,serialize,SPOTS,OUTCOMES,move,dist} from '../game/engine.mjs';
const tick=(s,t,input={},easy=false)=>{for(let i=0;i<Math.ceil(t/.05);i++)step(s,input,.05,easy);};
for(const hero of ['kai','zara'])test(`${hero}: complete mission, three boxes, boss recovery and persistent endings`,()=>{
 const s=fresh(hero);Object.assign(s,SPOTS.owner);assert.equal(interact(s),'owner');assert.equal(s.stage,'rescue');
 for(const e of s.enemy){s.x=e.x-60;s.y=e.y;for(let i=0;i<3;i++){attack(s);tick(s,.65);}}
 assert.equal(s.boxes.length,3);assert.equal(s.stage,'boss');
 s.x=s.boss.x-70;s.y=s.boss.y;const start=s.boss.hp;attack(s);assert.equal(s.boss.hp,start,'shield blocks damage');
 for(let i=0;i<60&&s.stage==='boss';i++){
   // React to the telegraph through actual movement, then return for recovery.
   if(s.boss.state==='warn'){s.x=s.boss.target.x-180;s.y=s.boss.target.y+180;}else if(s.boss.state==='recover'){s.x=s.boss.x-70;s.y=s.boss.y;}
   tick(s,.5,{attack:true});
 }
 assert.equal(s.stage,'choice');
 for(const id of Object.keys(OUTCOMES)){const route=hydrate(serialize(s));assert(choose(route,id));assert.equal(route.stage,'return');Object.assign(route,SPOTS.owner);interact(route);assert(route.visited);Object.assign(route,SPOTS.car);interact(route);assert.equal(route.stage,'done');assert(route.finished);const restored=hydrate(serialize(route));assert.equal(restored.outcome,id);assert(restored.finished);}
});
test('choice cannot be committed before victory or overwritten',()=>{let s=fresh();assert(!choose(s,'repair'));s.stage='choice';assert(!choose(s,'invalid'));assert(choose(s,'repair'));assert(!choose(s,'shop'));});
test('all outcome interactions are reachable and functional',()=>{
 for(const id of Object.keys(OUTCOMES)){let s=fresh();s.stage='choice';choose(s,id);const spot=id==='repair'?'shortcut':id==='shop'?'rest':'rematch';Object.assign(s,SPOTS[spot]);s.hp=2;assert.equal(interact(s),spot);if(id==='repair')assert.equal(s.x,1270);if(id==='shop')assert.equal(s.hp,6);if(id==='show'){assert.equal(s.boss.hp,30);assert.equal(s.stage,'boss');assert.equal(s.outcome,'show');}}
});
test('dodge has cooldown, duo requires earned meter and cannot repeat',()=>{const s=fresh();assert(dodge(s));assert(!dodge(s));assert(!assist(s));s.duo=100;s.hp=4;assert(assist(s));assert.equal(s.hp,5);assert(!assist(s));});
test('collision prevents crossing buildings and boundaries',()=>{const s=fresh();s.x=40;s.y=200;move(s,30,0);assert.equal(s.x,40);s.x=30;s.y=500;move(s,-100,0);assert.equal(s.x,25);});
test('diagonal movement is not faster',()=>{const a=fresh(),b=fresh();a.x=b.x=1400;a.y=b.y=700;const start={x:1400,y:700};step(a,{x:1},.05);step(b,{x:1,y:1},.05);assert(Math.abs(dist(a,start)-dist(b,start))<.001);});
test('corrupted saves are rejected and values bounded',()=>{assert.equal(hydrate('{oops'),null);assert.equal(hydrate(JSON.stringify({version:500})),null);let s=fresh();s.stage='return';assert.equal(hydrate(serialize(s)),null);s=fresh();s.x=1e9;s.hp=99;s.duo=200;s.boxes=[0,0,9];const r=hydrate(serialize(s));assert.equal(r.x,1970);assert.equal(r.hp,6);assert.equal(r.duo,100);assert.deepEqual(r.boxes,[0]);});
test('boss reload restarts safe checkpoint without pending attacks',()=>{const s=fresh();s.stage='boss';s.boss.hp=1;s.boss.state='warn';s.hp=1;const r=hydrate(serialize(s));assert.equal(r.boss.hp,24);assert.equal(r.boss.state,'idle');assert.equal(r.hp,6);});
test('optional clue saved independently from final decision',()=>{const s=fresh();Object.assign(s,SPOTS.clue);assert.equal(interact(s),'clue');assert(hydrate(serialize(s)).clue);assert.equal(interact(s),null);});
test('defeat respawns with full health and keeps rescued deliveries',()=>{const s=fresh();s.stage='boss';s.boxes=[0,1,2];s.hp=1;s.boss.state='warn';s.boss.clock=1.2;s.boss.target={x:s.x,y:s.y};step(s,{},.05);assert.equal(s.hp,6);assert.equal(s.deaths,1);assert.deepEqual(s.boxes,[0,1,2]);});
