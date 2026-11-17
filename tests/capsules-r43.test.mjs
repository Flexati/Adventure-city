// R43 (D88): «Ambienti di gioco più dinamici… incentivati». Unstable chrono capsules: shoot one, it charges for a
// moment inside the same danger circle as an enemy strike, then bursts: enemies in sight are hit, other capsules chain,
// mines are cleared, and the hero who stays inside is hit too (a perfect dodge still works). No capsule in the tutorial.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newRun,tick,startAttack} from '../game/campaign.mjs';
import {buildMission} from '../game/missions.mjs';
import {getLayout} from '../game/layouts.mjs';
const run=id=>{const c=buildMission(id,{});const s=newRun(c.pov,c.map,'power',null,null,c);s.finalConsent=true;s.partner=null;return s;};
const quiet=s=>{for(const e of s.enemies)e.state='stun',e.stun=99;};
const step=(s,n)=>{const ev=[];for(let i=0;i<n;i++){tick(s,{},1/30);ev.push(...s.events.map(e=>e.type));}return ev;};

test('the stages with a new plan carry capsules; the tutorial yard has none',()=>{
 assert.equal(getLayout('blackout_r42').capsules.length,0,'first stage teaches the basics first');
 for(const id of ['breach','contagion','zero','exp_chalk_marks','below','city','archive','line','ascent','finale'])assert.equal(getLayout(id+'_r42').capsules.length,3,id);
 assert.equal(run('city').capsules.length,3);
});

test('a round arms the capsule, the blast hits the enemy in sight after the fuse, not before',()=>{
 const s=run('city'),k=s.capsules[0];s.enemies=s.enemies.slice(0,1);const e=s.enemies[0];quiet(s);e.x=k.x+70;e.y=k.y;e.hp=e.max=20;
 s.x=k.x;s.y=k.y+260;startAttack(s,'gun',{x:0,y:-1});
 let ev=step(s,6);assert.ok(ev.includes('capsuleArmed'));assert.ok(k.fuse>0&&k.hp>0,'still charging: the danger circle is on screen');assert.equal(e.hp,20);
 ev=step(s,20);assert.ok(ev.includes('capsuleBlast'));assert.equal(k.hp,0);assert.equal(e.hp,14,'six damage from the blast');
});

test('walls stop the blast; other capsules chain; mines in range are cleared',()=>{
 const s=run('city');s.enemies=s.enemies.slice(0,1);const e=s.enemies[0];quiet(s);
 // pillar at tile (9,9): capsule at tile (8,9), enemy at tile (10,9), 128 px apart with the pillar between them
 const k={layoutId:s.layoutId,x:8.5*64,y:9.5*64,hp:1,fuse:0,max:0},o={layoutId:s.layoutId,x:8.5*64,y:11.5*64,hp:1,fuse:0,max:0};
 s.capsules=[k,o];e.x=10.5*64;e.y=9.5*64;e.hp=e.max=20;s.mines=[{x:k.x+40,y:k.y+40,age:1,life:8,hp:1,r:84}];s.x=1300;s.y=1300;
 k.fuse=k.max=.05;const ev=step(s,4);
 assert.ok(ev.includes('capsuleBlast'));assert.equal(e.hp,20,'the pillar shields the enemy');
 assert.ok(o.fuse>0&&o.fuse<=.2,'the second capsule is set off with a short fuse');assert.equal(s.mines.length,0,'the mine is cleared');
 step(s,10);assert.equal(o.hp,0,'and bursts in turn');
});

test('the hero who stays inside is hit once; outside, never',()=>{
 const s=run('city'),k=s.capsules[0];s.enemies=[];s.x=k.x+40;s.y=k.y;const hp=s.hp;k.fuse=k.max=.05;step(s,6);assert.equal(s.hp,hp-1);
 const t=run('city'),q=t.capsules[1];t.enemies=[];t.x=q.x+300;t.y=q.y;const h2=t.hp;q.fuse=q.max=.05;step(t,6);assert.equal(t.hp,h2);
});

test('the capsule reads without colour and stays still under reduced motion; the tip is translated',()=>{
 const rt=fs.readFileSync('game/runtime.mjs','utf8'),en=fs.readFileSync('game/runtime-en.mjs','utf8');
 assert.match(rt,/ctx\.setLineDash\(p<\.5\?\[8,8\]:\[\]\);circle\(k\.x,k\.y,135,'#ff997b',true,p<\.5\?3:5\)/,'dashed while charging, solid and thick at the end');
 assert.match(rt,/pulse=settings\.reduced\?\.6:/);assert.match(rt,/if\(!settings\.reduced\)shake=Math\.max\(shake,6\)/);
 assert.match(en,/'Spara alle capsule: esplodono e travolgono i nemici vicini\.':'Shoot the capsules: they burst and sweep away nearby enemies\.'/);
});
