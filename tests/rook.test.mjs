import test from 'node:test';import assert from 'node:assert/strict';
import {buildMission,newProgress,saveProgress,loadProgress,stepIndex} from '../game/missions.mjs';
import {newRun,tick,resumeAtBoss,startAttack,visible} from '../game/campaign.mjs';import {autoplay} from './helpers/autoplay.mjs';
const fight=()=>{const c=buildMission('blackout');const s=newRun('nox',0,'power',null,null,c);resumeAtBoss(s);return s;};
test('Rook commits aim for half the telegraph and releases finite colliding shotgun pellets',()=>{
 const s=fight(),b=s.enemies[0];s.partner=null;s.x=800;s.y=800;b.x=800;b.y=650;b.state='rookAim';b.target={x:800,y:800};b.windup=1.2;b.clock=.7;s.inv=99;
 const locked={...b.target};s.x=920;tick(s,{},.05);assert.deepEqual(b.target,locked);
 while(b.state==='rookAim')tick(s,{},.05);assert.equal(s.shots.length,3);assert.equal(b.state,'recover');
 assert.ok(s.shots.every(p=>Math.abs(Math.hypot(p.vx,p.vy)-365)<1e-6&&p.life<=1.6));
});
test('Rook cover blocks actual pellets, not just the warning line',()=>{
 const s=fight();s.partner=null;s.enemies[0].state='recover';s.enemies[0].clock=-100;s.x=610;s.y=735;
 // Left cover is x512..640, y640..768: hero sits below it, projectile crosses its solid face.
 s.x=610;s.y=810;const hp=s.hp;s.shots=[{x:610,y:590-34,vx:0,vy:365,life:1.6,boss:true}];
 assert.equal(visible({...s,x:610,y:590},s),false);for(let i=0;i<30;i++)tick(s,{},.05);assert.equal(s.hp,hp);assert.equal(s.shots.length,0);
});
test('mines arm with a delay, can be shot, and never hurt through cover',()=>{
 const s=fight();s.partner=null;const b=s.enemies[0];b.state='recover';b.clock=-100;s.x=800;s.y=900;
 s.mines=[{x:800,y:840,age:0,life:8,hp:1,r:84}];const hp=s.hp;for(let i=0;i<10;i++)tick(s,{},.05);assert.equal(s.hp,hp);
 startAttack(s,'gun',{x:0,y:-1});tick(s,{},.05);tick(s,{},.05);assert.equal(s.mines.length,0);assert.equal(s.hp,hp);
 s.x=650;s.y=710;s.mines=[{x:620,y:710,age:1,life:8,hp:1,r:84}];tick(s,{},.05);assert.equal(s.hp,hp,'wall shields mine detonation');
 s.x=800;s.y=900;s.mines=[{x:800,y:860,age:1,life:8,hp:1,r:84}];tick(s,{},.05);assert.equal(s.hp,hp-1,'unshielded armed mine damages once');tick(s,{},.05);assert.equal(s.hp,hp-1);
});
test('Rook phase two summons one Breaker, repositions and resets correctly on retry',()=>{
 const s=fight(),b=s.enemies[0];b.hp=23;tick(s,{},.05);assert.equal(s.rookDark,true);assert.equal(s.enemies.filter(e=>e.role==='breaker').length,1);
 for(let i=0;i<5;i++)tick(s,{},.05);assert.equal(s.enemies.filter(e=>e.role==='breaker').length,1);
 s.x=b.x;s.y=b.y+180;b.state='walk';b.clock=1;b.pattern=2;tick(s,{},.05);assert.equal(b.state,'rookMove');assert.equal(s.mines.length,1);const before={x:b.x,y:b.y};for(let i=0;i<12;i++)tick(s,{},.05);assert.ok(Math.hypot(b.x-before.x,b.y-before.y)>10);
 const retry=fight();assert.equal(retry.rookDark,undefined);assert.deepEqual(retry.mines,[]);assert.equal(retry.enemies[0].hp,48);
});
test('Rook is winnable from a saved checkpoint with ordinary inputs on three deterministic policies',()=>{
 for(const seed of [1,2,3]){const s=fight();const result=autoplay(s,{reaction:.3,dodgeRate:.55,seed});assert.equal(result.status,'cleared',JSON.stringify({seed,...result}));assert.ok(s.enemies.find(e=>e.boss).hp===0);}
 const p=newProgress();p.step=stepIndex('blackout');p.checkpoint='boss';const restored=loadProgress(saveProgress(p));assert.equal(restored.checkpoint,'boss');assert.equal(restored.step,p.step);assert.equal(restored.cityChoice,null);
});
test('duel framing keeps the Rook silhouette and hero clear of portrait HUD and thumbs',async()=>{
 const {frameCamera,frameDuelCamera}=await import('../game/visuals.mjs');const hero={x:800,y:874},boss={x:800,y:544},scale=.66;
 const c=frameDuelCamera(frameCamera(hero,390,844,scale,74,236,1536),hero,boss,390,844,202,236,scale);
 assert.ok((boss.y-134-c.y)*scale>=202-1e-6);assert.ok((hero.y-c.y)*scale<=844-236);assert.ok((hero.x-c.x)*scale>=24);
});
test('one ordinary round cannot pass through a mine into an enemy or through an enemy into a mine',()=>{
 for(const front of ['mine','enemy']){const s=fight();s.partner=null;const b=s.enemies[0];s.x=800;s.y=900;b.x=800;b.y=front==='mine'?700:780;b.state='recover';b.clock=-100;
  s.mines=[{x:800,y:front==='mine'?780:700,age:0,life:8,hp:1,r:84}];startAttack(s,'gun',{x:0,y:-1});tick(s,{},.05);tick(s,{},.05);
  if(front==='mine'){assert.equal(b.hp,48);assert.equal(s.mines.length,0);}else{assert.equal(b.hp,47);assert.equal(s.mines.length,1);}}
});
test('Rook defeat disables remaining mines before they can produce a post-defeat hit',()=>{
 const s=fight();s.partner=null;s.enemies[0].hp=0;s.hp=1;s.mines=[{x:s.x,y:s.y,age:1,life:8,hp:1,r:84}];tick(s,{},.05);assert.equal(s.hp,1);assert.equal(s.status,'cleared');assert.deepEqual(s.mines,[]);
});
test('first Rook activation introduces the two authored Raiders without replaying node waves',()=>{
 const c=buildMission('blackout'),s=newRun('nox',0,'power',null,null,c);s.wave=s.c.waves.length-1;const before=s.enemies.length;for(const n of s.nodes)n.on=true;s.nodes[2].on=false;s.x=s.nodes[2].x;s.y=s.nodes[2].y;for(const e of s.enemies)if(!e.boss)e.hp=0;s.c.channel=0;tick(s,{interact:true},.01);assert.equal(s.enemies.length,before+2);assert.equal(s.enemies.slice(-2).every(e=>e.role==='raider'&&e.hunting),true);assert.equal(s.enemies.find(e=>e.boss).state,'walk');
});
