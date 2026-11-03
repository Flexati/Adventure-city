import test from 'node:test';import assert from 'node:assert/strict';
import {newRun,tick,startAttack,resumeAtBoss,ANCHOR_RULES} from '../game/campaign.mjs';
import {buildMission} from '../game/missions.mjs';

test('Perfect Dodge triggers only when an attack would land inside the narrow window',()=>{
 const s=newRun('nox');const e=s.enemies[0];
 e.x=s.x+40;e.y=s.y;e.state='warn';e.clock=.98;e.target={x:s.x,y:s.y};
 tick(s,{dash:true},.05);
 assert.ok(s.events.some(v=>v.type==='perfectDodge'));
 assert.ok(s.counterReady>0);
 assert.equal(s.hp,s.maxHp);
});

test('ordinary invulnerability outside the perfect window avoids damage without granting counter',()=>{
 const s=newRun('nox');const e=s.enemies[0];
 e.x=s.x+40;e.y=s.y;e.state='warn';e.clock=.98;e.target={x:s.x,y:s.y};
 s.inv=.2;s.perfectWindow=0;
 tick(s,{},.05);
 assert.equal(s.hp,s.maxHp);
 assert.equal(s.counterReady,0);
 assert.equal(s.events.some(v=>v.type==='perfectDodge'),false);
});

test('the first attack after a Perfect Dodge consumes the counter and deals bonus damage',()=>{
 const s=newRun('nox');const e=s.enemies[0];e.x=s.x+70;e.y=s.y;e.hp=4;e.max=4;s.counterReady=.5;
 assert.equal(startAttack(s,'gun',{x:1,y:0}),true);
 tick(s,{},.05);tick(s,{},.05);
 assert.equal(s.counterReady,0);
 assert.equal(e.hp,2);
});

// E1 (D29): telegraphLock is informational. One event in the tick whose clock crosses the lock; the hero drifts every frame.
const snap=e=>JSON.parse(JSON.stringify({clock:e.clock,target:e.target,dirs:e.sweepDirs}));
function watchLock(s,e,state){const locks=[];for(let i=0;i<240&&e.state===state;i++){const before=snap(e),hp=s.hp;s.x+=2;tick(s,{},1/60);for(const v of s.events)if(v.type==='telegraphLock')locks.push({...v,before,after:snap(e),hp,hpAfter:s.hp});}return locks;}
const alone=(s,e)=>{s.partner=null;s.enemies=[e];e.state='warn';e.clock=0;e.target={x:s.x,y:s.y};s.inv=99;return e;};

test('a melee telegraph emits one telegraphLock when its clock crosses windup x .55, then stops tracking',()=>{
 const s=newRun('nox',1),e=alone(s,s.enemies.find(v=>!v.ranged)),at=e.windup*.55,locks=watchLock(s,e,'warn');
 assert.equal(locks.length,1);const [l]=locks;assert.equal(l.kind,'melee');
 assert.ok(l.before.clock<at&&l.after.clock>=at,`lock tick ${l.before.clock} -> ${l.after.clock}, threshold ${at}`);
 assert.deepEqual({x:l.x,y:l.y},l.after.target);assert.deepEqual(e.target,l.after.target,'the locked point no longer follows the hero');assert.ok(s.x-l.x>20);
});

test('a ranged telegraph locks at windup x .6 with kind ranged',()=>{
 const s=newRun('nox',3),e=alone(s,s.enemies.find(v=>v.ranged)),at=e.windup*.6,locks=watchLock(s,e,'warn');
 assert.equal(locks.length,1);const [l]=locks;assert.equal(l.kind,'ranged');
 assert.ok(l.before.clock<at&&l.after.clock>=at);assert.deepEqual({x:l.x,y:l.y},l.after.target);assert.deepEqual(e.target,l.after.target);
});

test('Rook (.5) and the Anchor sweep (.55) emit telegraphLock without changing the lock tick',()=>{
 const r=newRun('nox',0,'power',null,null,buildMission('blackout'));resumeAtBoss(r);r.partner=null;
 const b=r.enemies.find(v=>v.bossKind==='rook');b.state='rookAim';b.windup=1.2;b.clock=0;b.target={x:r.x,y:r.y};
 const c=buildMission('breach',{blackout_choice:'workshop'},'workshop'),a=newRun(c.pov,c.map,'power','workshop',{flags:{}},c);a.partner=null;for(const n of a.nodes)n.on=true;a.enemies=a.enemies.filter(v=>v.boss);assert.ok(resumeAtBoss(a));
 const k=a.enemies.find(v=>v.bossKind==='anchor');k.state='anchorSweep';k.windup=ANCHOR_RULES.sweep.windup;k.clock=0;k.sweepDirs=[{x:1,y:0}];
 for(const [s,e,state,kind,at,point] of [[r,b,'rookAim','rook',b.windup*.5,()=>b.target],[a,k,'anchorSweep','sweep',k.windup*ANCHOR_RULES.sweep.lock,()=>({x:k.x,y:k.y})]]){
  const locks=watchLock(s,e,state);assert.equal(locks.length,1,kind);const [l]=locks;assert.equal(l.kind,kind);
  assert.ok(l.before.clock<at&&l.after.clock>=at,kind);assert.deepEqual({x:l.x,y:l.y},point(),kind);
  assert.equal(l.after.clock,l.before.clock+1/60,kind);assert.deepEqual(l.after.target,l.before.target,kind);assert.deepEqual(l.after.dirs,l.before.dirs,kind);assert.equal(l.hpAfter,l.hp,kind);
 }
});

// CS (D29): Nox's Chrono Shift. Enemy time runs at x.5 for .6 s after a Perfect Dodge with the shift charged.
const SHIFT_TICK=1/60;
// The enemy's attack lands inside the Perfect Dodge window in the next tick.
function strike(s,e){e.x=s.x+40;e.y=s.y;e.state='warn';e.clock=e.windup;e.target={x:s.x,y:s.y};e.hp=e.max=99;s.perfectWindow=.14;tick(s,{},SHIFT_TICK);return s.events.find(v=>v.type==='perfectDodge');}
const duelist=(hero,c)=>{const s=c?newRun(hero,1,'power',null,null,c):newRun(hero,1);s.partner=null;s.allies=null;const e=s.enemies.find(v=>!v.ranged&&!v.boss);s.enemies=[e];return {s,e};};
// A still shot away from the hero: its life measures enemy time tick by tick.
const probe=(s,e)=>{const b={x:e.x,y:e.y-34,vx:0,vy:0,life:99};s.shots.push(b);return b;};

test('Nox Perfect Dodge with the shift charged starts the Chrono Shift; Lulù keeps counter and Duo unchanged',()=>{
 // The Duo gain is measured against a twin whose attack is absorbed by plain i-frames.
 const gain=(hero,c)=>{const a=duelist(hero,c),b=duelist(hero,c);b.s.inv=99;const v=strike(a.s,a.e);b.s.perfectWindow=0;b.e.x=b.s.x+40;b.e.y=b.s.y;b.e.state='warn';b.e.clock=b.e.windup;b.e.target={x:b.s.x,y:b.s.y};tick(b.s,{},SHIFT_TICK);return {s:a.s,v,duo:a.s.duo-b.s.duo,want:a.s.signature==='barrier'?0:14};};
 const n=gain('nox');assert.equal(n.v.shift,true);assert.equal(n.s.shift,.6);assert.equal(n.s.shiftCd,3);
 assert.equal(n.s.counterReady,.6);assert.equal(n.duo,n.want);assert.equal(n.s.hp,n.s.maxHp);
 const l=gain('lulu',buildMission('port',{}));
 assert.ok(l.v,'Lulù still gets a Perfect Dodge');assert.equal(l.v.shift,undefined);assert.ok(!l.s.shift&&!l.s.shiftCd);
 assert.equal(l.s.counterReady,.6);assert.equal(l.duo,l.want);
});

test('during the shift enemy clocks, shots, Rook mines and patrol perception run at x.5; the hero still moves at 205 x dt',()=>{
 const pair=make=>[make(),make()].map((s,i)=>{if(i)s.shift=.6;return s;});
 // Enemy clock, shot travel and life, mine age and life, hero walk.
 const [a,b]=pair(()=>{const {s,e}=duelist('nox');e.x=s.x-200;e.y=s.y-100;e.state='recover';e.clock=0;e.recovery=9;s.shots.push({x:e.x,y:e.y-34,vx:0,vy:-60,life:1.6});s.mines.push({x:e.x,y:e.y+200,age:0,life:8,hp:1,r:84});return s;});
 const x0=a.x;for(const s of [a,b])tick(s,{x:1,y:0},SHIFT_TICK);
 assert.equal(a.enemies[0].clock,SHIFT_TICK);assert.equal(b.enemies[0].clock,SHIFT_TICK/2);
 assert.equal(a.shots[0].life,1.6-SHIFT_TICK);assert.equal(b.shots[0].life,1.6-SHIFT_TICK/2);
 assert.ok(Math.abs((b.shots[0].y-b.enemies[0].y+34)*2-(a.shots[0].y-a.enemies[0].y+34))<1e-9,'shot travel halves');
 assert.equal(a.mines[0].age,SHIFT_TICK);assert.equal(b.mines[0].age,SHIFT_TICK/2);assert.equal(b.mines[0].life,8-SHIFT_TICK/2);
 for(const s of [a,b])assert.ok(Math.abs(s.x-x0-205*SHIFT_TICK)<1e-9,`hero moved ${s.x-x0}`);
 // A mine one normal tick from arming: it bursts at x1, holds at x.5.
 const [ma,mb]=pair(()=>{const {s}=duelist('nox');s.inv=99;s.mines.push({x:s.x,y:s.y,age:.9-SHIFT_TICK*.75,life:8,hp:1,r:84});return s;});
 for(const s of [ma,mb])tick(s,{},SHIFT_TICK);
 assert.ok(ma.events.some(v=>v.type==='mineBurst'));assert.equal(mb.events.some(v=>v.type==='mineBurst'),false);assert.equal(mb.mines.length,1);
 // Patrols (stealth): e.seen rises at half speed, then e.seen and s.alert fall at half speed.
 const c=buildMission('port',{}),[pa,pb]=pair(()=>{const s=newRun('nox',1,'power',null,null,c),p=s.enemies[0];assert.equal(s.c.mode,'stealth');p.dir={x:1,y:0};s.x=p.x+120;s.y=p.y+10;return s;});
 for(const s of [pa,pb])tick(s,{},SHIFT_TICK);
 const rise=pa.enemies[0].seen;assert.ok(rise>0);assert.ok(Math.abs(pb.enemies[0].seen-rise/2)<1e-12);
 for(const s of [pa,pb]){s.x=s.enemies[0].x-600;s.enemies[0].seen=.5;s.alert=.5;tick(s,{},SHIFT_TICK);}
 assert.ok(Math.abs(.5-pa.enemies[0].seen-.4*SHIFT_TICK)<1e-12);assert.ok(Math.abs(.5-pb.enemies[0].seen-.2*SHIFT_TICK)<1e-12);
 assert.ok(Math.abs(.5-pa.alert-.35*SHIFT_TICK)<1e-12);assert.ok(Math.abs(.5-pb.alert-.175*SHIFT_TICK)<1e-12);
});

test('the Chrono Shift slows the 36 ticks of 1/60 s after the Perfect Dodge, then ends',()=>{
 const {s,e}=duelist('nox');assert.equal(strike(s,e).shift,true);const b=probe(s,e),steps=[];
 for(let i=0;i<40;i++){const life=b.life;tick(s,{},SHIFT_TICK);steps.push(+(life-b.life).toFixed(9));if(i===35)assert.equal(s.shift,0,'shift over after 36 ticks');}
 assert.deepEqual(steps,[...Array(36).fill(+(SHIFT_TICK/2).toFixed(9)),...Array(4).fill(+SHIFT_TICK.toFixed(9))]);
});

test('a second Nox Perfect Dodge within 3.0 s keeps the old slow-down; after 3.0 s it starts the shift again',()=>{
 const {s,e}=duelist('nox');assert.equal(strike(s,e).shift,true);
 for(let i=0;i<119;i++)tick(s,{},SHIFT_TICK);
 const again=strike(s,e);assert.ok(again,'still a Perfect Dodge');assert.equal(again.shift,undefined);assert.equal(s.shift,0);assert.equal(s.counterReady,.6);
 let n=120;while(s.shiftCd>0){tick(s,{},SHIFT_TICK);n++;}
 assert.ok(n>=180&&n<=181,`recharge took ${n} ticks`);
 assert.equal(strike(s,e).shift,true);assert.equal(s.shift,.6);
});

test('during the shift telegraphLock arrives once, on the enemy clock, and dash timings do not change',()=>{
 const s=newRun('nox',1),e=alone(s,s.enemies.find(v=>!v.ranged)),at=e.windup*.55;e.clock=at-.1;s.shift=.6;const locks=[];
 for(let i=0;i<240&&e.state==='warn';i++){const before=e.clock,shift=s.shift;s.x+=2;tick(s,{},SHIFT_TICK);for(const v of s.events)if(v.type==='telegraphLock')locks.push({before,after:e.clock,shift});}
 assert.equal(locks.length,1);const [l]=locks;assert.ok(l.shift>0,'locked while shifting');
 assert.ok(l.before<at&&l.after>=at);assert.equal(l.after,l.before+SHIFT_TICK/2);
 const d=duelist('nox').s;d.shift=.6;d.face={x:1,y:0};tick(d,{dash:true},SHIFT_TICK);
 assert.equal(d.dash,.18);assert.equal(d.dashCd,1.1);assert.equal(d.inv,.3);assert.equal(d.perfectWindow,.14);
 tick(d,{},SHIFT_TICK);assert.equal(d.dash,.18-SHIFT_TICK);assert.equal(d.dashCd,1.1-SHIFT_TICK);assert.equal(d.perfectWindow,.14-SHIFT_TICK);
});

test('reduced motion keeps the Chrono Shift: rules ignore settings, the cyan frame and the focus rule read only the shift',async()=>{
 const {readFile}=await import('node:fs/promises'),campaign=await readFile(new URL('../game/campaign.mjs',import.meta.url),'utf8'),runtime=await readFile(new URL('../game/runtime.mjs',import.meta.url),'utf8');
 assert.equal(/settings|reduced/.test(campaign),false,'campaign.mjs never reads settings');
 const foot=runtime.slice(runtime.indexOf('function drawFoot('),runtime.indexOf('function drawDriving(')),frame=foot.match(/ if\(s\.shift>0&&s\.status==='playing'\)\{[^}]*strokeRect[^}]*\}/);
 assert.ok(frame,'drawFoot draws the cyan frame while shifting');assert.ok(frame[0].includes('#59e0ff'));assert.equal(frame[0].includes('settings'),false);
 assert.ok(runtime.includes("if(!settings.reduced&&!e.shift)focusTime=.16;"));assert.equal(runtime.split('focusTime=.16').length,2,'one Perfect Dodge focus rule');
});

test('the cyan frame is drawn only while the run is playing: a failed or cleared run hides it even with the shift left over',async()=>{
 const {readFile}=await import('node:fs/promises'),runtime=await readFile(new URL('../game/runtime.mjs',import.meta.url),'utf8');
 const foot=runtime.slice(runtime.indexOf('function drawFoot('),runtime.indexOf('function drawDriving(')),frame=foot.match(/ if\(s\.shift>0[^)]*\)\{[^}]*strokeRect[^}]*\}/);
 assert.ok(frame,'drawFoot has the Chrono Shift frame statement');
 // Runs the exact drawFoot statement with a recording canvas: runtime.mjs itself needs the DOM.
 const draw=new Function('s','w','h','ctx',frame[0]),rects=status=>{const calls=[],ctx={strokeRect:(...a)=>calls.push(a)};draw({shift:.5833,status},844,390,ctx);return calls.length;};
 assert.equal(rects('playing'),1,'frame while shifting in play');
 for(const status of ['failed','cleared'])assert.equal(rects(status),0,status+' run with the shift frozen above 0 shows no frame');
});
