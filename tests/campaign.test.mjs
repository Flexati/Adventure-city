import test from 'node:test';import assert from 'node:assert/strict';
import {newRun,CHAPTERS,tick,startAttack,interactNode,saveRun,loadRun,nextDistrict,visible,moveActor} from '../game/campaign.mjs';
test('four districts can be completed by attacks and device activation',()=>{let s=newRun();for(let level=0;level<4;level++){assert.equal(s.level,level);s.inv=9999;for(const enemy of s.enemies){s.x=enemy.x-70;s.y=enemy.y;let n=0;while(enemy.hp>0&&n++<600)tick(s,{gun:true},.05);assert.equal(enemy.hp,0,'enemy defeated');}for(const node of s.nodes){s.x=node.x;s.y=node.y;assert.equal(interactNode(s),true);}tick(s,{},.05);assert.equal(s.status,'cleared');assert.equal(s.kills,CHAPTERS[level].count);if(level<3)s=nextDistrict(s,level%2?'power':'shield');else assert.equal(nextDistrict(s,'power'),null);}});
test('Nox power unlocks later while Lulù Resonance is available from Blackout and respects cooldown',()=>{const s=newRun('nox');assert.equal(startAttack(s,'magic'),false);const l=newRun('lulu',0);assert.equal(startAttack(l,'magic'),true);assert.equal(startAttack(l,'magic'),false);for(let i=0;i<20;i++)tick(l,{},.05);assert.equal(startAttack(l,'magic'),false);const n2=newRun('nox',1);assert.equal(startAttack(n2,'magic'),true);});
test('checkpoint validates data and keeps hero, level, upgrade and clearance',()=>{const s=newRun('lulu',2,'shield');let r=loadRun(saveRun(s));assert.equal(r.hp,10);assert.equal(r.hero,'lulu');assert.equal(r.level,2);s.status='cleared';r=loadRun(saveRun(s));assert.equal(r.status,'cleared');assert.equal(nextDistrict(r,'power').level,3);assert.equal(loadRun('{"version":4,"level":99}'),null);});
test('movement cannot enter building and footsteps stop at wall',()=>{const a={x:550,y:300};moveActor(a,-200,0);assert.equal(a.x,550);assert.equal(visible({x:500,y:300},{x:800,y:300}),false);const s=newRun();const before=s.walk;tick(s,{x:1},.05);assert.ok(s.walk>before);const after=s.walk;tick(s,{},.05);assert.equal(s.walk,after);});
test('device blocks while contested; no progression without clearance',()=>{const s=newRun();s.x=s.nodes[0].x;s.y=s.nodes[0].y;s.enemies[0].x=s.x+40;s.enemies[0].y=s.y;assert.equal(interactNode(s),false);assert.equal(nextDistrict(s,'power'),null);});
test('manual aiming takes priority and death stops attacks',()=>{const s=newRun();startAttack(s,'gun',{x:0,y:1});assert.deepEqual(s.action.dir,{x:0,y:1});s.hp=0;tick(s,{},.05);assert.equal(s.status,'failed');assert.equal(startAttack(s),false);});

test('first activated relay is marked for one-time narrative clue delivery',()=>{const s=newRun();for(const e of s.enemies)e.hp=0;s.x=s.nodes[0].x;s.y=s.nodes[0].y;assert.equal(interactNode(s),true);let nodes=s.events.filter(e=>e.type==='node');assert.equal(nodes.at(-1).firstActive,true);s.x=s.nodes[1].x;s.y=s.nodes[1].y;assert.equal(interactNode(s),true);nodes=s.events.filter(e=>e.type==='node');assert.equal(nodes.at(-1).firstActive,false);});

test('Lulù Resonance controls multiple nearby enemies instead of behaving like Nox precision fire',()=>{const s=newRun('lulu');const [a,b]=s.enemies;a.x=s.x+70;a.y=s.y;b.x=s.x+90;b.y=s.y+20;assert.equal(startAttack(s,'magic',{x:1,y:0}),true);for(let i=0;i<6;i++)tick(s,{},.05);assert.equal(a.hp,2);assert.equal(b.hp,2);assert.equal(a.state,'recover');assert.equal(b.state,'recover');});

test('Blackout enemy roles are deterministic and tactically distinct',()=>{
 const s=newRun('nox',0);
 assert.deepEqual(s.enemies.map(e=>e.role),['raider','breaker','signal','raider']);
 const [raider,breaker,signal]=s.enemies;
 assert.ok(breaker.moveSpeed>raider.moveSpeed);
 assert.ok(breaker.attackRadius>raider.attackRadius);
 assert.ok(signal.detectRange>raider.detectRange);
 assert.ok(signal.attackRadius>breaker.attackRadius);
 assert.ok(signal.windup>raider.windup);
});
