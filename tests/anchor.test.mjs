import test from 'node:test';import assert from 'node:assert/strict';
import {buildMission} from '../game/missions.mjs';
import {newRun,tick,aimAt,resumeAtBoss,ANCHOR_RULES,anchorMoors,anchorShielded,visible} from '../game/campaign.mjs';
import {getLayout,layoutWalkable} from '../game/layouts.mjs';
// A floor point at `d` from the target with a clear line to it (walls block shots and sweeps alike).
function spot(s,t,d){for(let k=0;k<72;k++){const a=k*Math.PI/36,p={x:t.x+Math.cos(a)*d,y:t.y+Math.sin(a)*d,layoutId:s.layoutId};if(layoutWalkable(getLayout(s.layoutId),p.x,p.y)&&visible(p,{...t,layoutId:s.layoutId}))return {...p,a};}throw Error('no clear spot');}
const place=(s,p)=>{s.x=p.x;s.y=p.y;};
// Breach at the boss: anchors closed, adds cleared, The Anchor awake.
function atBoss(){const c=buildMission('breach',{blackout_choice:'workshop'},'workshop'),s=newRun(c.pov,c.map,'power','workshop',{flags:{}},c);s.partner=null;
 for(const n of s.nodes)n.on=true;s.enemies=s.enemies.filter(e=>e.boss);assert.ok(resumeAtBoss(s));tick(s,{},.02);s.enemies=s.enemies.filter(e=>e.boss||e.role==='moor');return s;}
const core=s=>s.enemies.find(e=>e.bossKind==='anchor');
const run=(s,seconds,input={})=>{const ev=[];for(let t=0;t<seconds;t+=.02){tick(s,typeof input==='function'?input(s):input,.02);ev.push(...s.events);}return ev;};

test('The Anchor wakes in the Breach moored by three reachable lines',()=>{
 const s=atBoss(),b=core(s),moors=anchorMoors(s,b);
 assert.equal(buildMission('breach',{}).boss.kind,'anchor');assert.equal(moors.length,3);assert.ok(anchorShielded(s,b));
 for(const m of moors){assert.ok(m.hp>0);assert.ok(Math.hypot(m.x-b.x,m.y-b.y)>120,'lines stand away from the core');}
});

test('while moored the core takes no damage and assisted aim picks a line instead',()=>{
 const s=atBoss(),b=core(s);place(s,spot(s,b,200));const hp=b.hp;
 const dir=aimAt(s,null,600),toCore={x:b.x-s.x,y:b.y-s.y},n=Math.hypot(toCore.x,toCore.y);
 assert.ok(Math.abs(dir.x*toCore.x/n+dir.y*toCore.y/n)<.999,'aim does not lock the shielded core');
 const ev=run(s,1.5,{gun:true});assert.equal(b.hp,hp);assert.ok(ev.some(e=>e.type==='guarded'&&e.moored)||anchorMoors(s,b).some(m=>m.hp<m.max));
});

test('cutting every line exposes the core until the first line re-moors',()=>{
 const s=atBoss(),b=core(s);for(const m of anchorMoors(s,b))m.hp=0;
 let ev=run(s,.1);assert.ok(ev.some(e=>e.type==='anchorExposed'));assert.equal(anchorShielded(s,b),false);
 const hp=b.hp;place(s,spot(s,b,230));run(s,.6,{gun:true});assert.ok(b.hp<hp,'exposed core is damaged by ordinary fire');
 ev=run(s,ANCHOR_RULES.relink[0]+.3);assert.ok(ev.some(e=>e.type==='anchorRelink'));assert.ok(ev.some(e=>e.type==='anchorShielded'));assert.ok(anchorShielded(s,b));
});

test('one Resonance cuts a line in a single cast and interrupts the core',()=>{
 const s=atBoss(),b=core(s),m=anchorMoors(s,b)[0],p=spot(s,m,110);place(s,p);s.magicCd=0;
 run(s,.8,{magic:true,aim:{x:m.x-p.x,y:m.y-p.y}});assert.equal(m.hp,0,'Lulù cuts the line at once');
 const t=atBoss(),c=core(t),q=spot(t,c,150);place(t,q);c.state='anchorSweep';c.clock=.2;c.windup=ANCHOR_RULES.sweep.windup;c.sweepDirs=[{x:Math.cos(q.a),y:Math.sin(q.a)}];t.magicCd=0;
 run(t,.75,{magic:true,aim:{x:c.x-q.x,y:c.y-q.y}});assert.notEqual(c.state,'anchorSweep','the sweep is interrupted');
});

test('the sweep locks its line, hits only inside it and respects cover rules',()=>{
 const s=atBoss(),b=core(s);place(s,spot(s,b,300));s.inv=0;b.state='walk';b.clock=1;
 let ev=run(s,.04);assert.equal(b.state,'anchorSweep');ev=run(s,ANCHOR_RULES.sweep.windup+.05);
 assert.ok(ev.some(e=>e.type==='anchorSweep'));assert.ok(ev.some(e=>e.type==='hurt'&&e.source==='sweep'),'standing in the locked lane is a hit');
 const t=atBoss(),c=core(t),q=spot(t,c,300);place(t,q);c.state='walk';c.clock=1;run(t,.04);
 run(t,ANCHOR_RULES.sweep.windup*ANCHOR_RULES.sweep.lock+.05);t.x+=-Math.sin(q.a)*120;t.y+=Math.cos(q.a)*120;const ev2=run(t,ANCHOR_RULES.sweep.windup);
 assert.ok(!ev2.some(e=>e.type==='hurt'&&e.source==='sweep'),'leaving the lane after the lock avoids it');
});

test('below half health a second lane opens, lines re-moor faster and two raiders join',()=>{
 const s=atBoss(),b=core(s);b.hp=Math.floor(b.max*.45);const ev=run(s,.05);
 assert.equal(b.phase,1);assert.ok(ev.some(e=>e.type==='bossPhase'&&e.kind==='anchor'));assert.equal(s.enemies.filter(e=>e.role==='raider').length,2);
 place(s,spot(s,b,300));b.state='walk';b.clock=1;run(s,.04);assert.equal(b.sweepDirs.length,2);assert.ok(ANCHOR_RULES.relink[1]<ANCHOR_RULES.relink[0]);
});

test('defeat releases the lines for good and clears the Breach; retry rebuilds them',()=>{
 const s=atBoss(),b=core(s);for(const m of anchorMoors(s,b))m.hp=0;run(s,.05);b.hp=1;place(s,spot(s,b,230));
 run(s,1,{gun:true});assert.equal(b.hp,0);run(s,ANCHOR_RULES.relink[0]+1);assert.ok(anchorMoors(s,b).every(m=>m.hp===0&&m.released));assert.equal(s.status,'cleared');
 const t=atBoss();t.enemies=t.enemies.filter(e=>e.boss);assert.ok(resumeAtBoss(t));tick(t,{},.02);assert.equal(anchorMoors(t,core(t)).length,3,'checkpoint retry re-moors');
});
