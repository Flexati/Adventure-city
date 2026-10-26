import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {SIZE,newRun,tick,resumeAtBoss} from '../game/campaign.mjs';
import {CAMPAIGN,FOOT,buildMission,newProgress,saveProgress,loadProgress,bossCheckpoint,stepIndex} from '../game/missions.mjs';
import {frameCamera} from '../game/visuals.mjs';
import {makePolicy} from './helpers/autoplay.mjs';

// Phone layouts measured in Chromium: HUD bottom and controls top, in CSS pixels.
const PHONES=[{w:360,h:800,top:74,bottom:236},{w:390,h:844,top:74,bottom:236},{w:412,h:915,top:74,bottom:236},{w:844,h:390,top:70,bottom:132}];
const SPRITE=112;
test('the hero is framed between HUD and touch controls, even at the edges of the world',()=>{
 for(const p of PHONES){const scale=p.w<650?.66:Math.min(.95,p.h/760);
  for(const y of [30,200,768,1300,SIZE-30])for(const x of [30,768,SIZE-30]){
   const cam=frameCamera({x,y},p.w,p.h,scale,p.top,p.bottom,SIZE),feet=(y-cam.y)*scale,head=feet-SPRITE*scale,sx=(x-cam.x)*scale;
   assert.ok(feet<=p.h-p.bottom,`${p.w}x${p.h} hero at y=${y}: feet ${feet.toFixed(0)} under the controls`);
   assert.ok(head>=p.top-1,`${p.w}x${p.h} hero at y=${y}: head ${head.toFixed(0)} under the HUD`);
   assert.ok(sx>=0&&sx<=p.w,`${p.w}x${p.h} hero at x=${x} off screen`);
  }}
 // Away from the edges the camera follows smoothly: one unit of movement is one unit of camera.
 const a=frameCamera({x:768,y:700},390,844,.66,74,236,SIZE),b=frameCamera({x:769,y:701},390,844,.66,74,236,SIZE);
 assert.equal(+(b.x-a.x).toFixed(6),1);assert.equal(+(b.y-a.y).toFixed(6),1);
});

test('every device mission states its action as a verb, and every step a readable goal',()=>{
 for(const step of CAMPAIGN.filter(s=>s.type==='foot')){const m=FOOT[step.id];
  assert.ok(m.goal&&m.goal.length>12,step.id+' goal');
  if(m.mode!=='defend'){assert.match(m.task||'',/^[A-ZÈ][a-zà-ù]+ (i|le|gli) [a-zà-ù]/,step.id+' task reads as verb + object');assert.ok(!/^Ancora/.test(m.task));}
 }
});

test('boss checkpoint survives a save only while the boss step is still being played',()=>{
 const finale=stepIndex('finale'),blackout=stepIndex('blackout');
 const p=newProgress();assert.equal(p.checkpoint,null);p.step=finale;p.checkpoint='boss';p.narrative.flags['exp.chalk.completed']=true;
 assert.equal(loadProgress(saveProgress(p)).checkpoint,'boss');
 assert.equal(bossCheckpoint(finale,'cleared','boss'),null,'a cleared step has no checkpoint');
 assert.equal(bossCheckpoint(blackout,'playing','boss'),'boss','Rook is a campaign boss checkpoint');
 assert.equal(bossCheckpoint(stepIndex('breach'),'playing','boss'),null,'no boss, no checkpoint');
 assert.equal(bossCheckpoint(stepIndex('reunion'),'playing','boss'),null,'scenes have no checkpoint');
 const raw=JSON.parse(saveProgress(p));
 // Invalid or foreign values are dropped; the rest of the save is kept.
 for(const bad of ['teleport',7,{x:1}]){const r=loadProgress(JSON.stringify({...raw,checkpoint:bad}));assert.ok(r,'save kept');assert.equal(r.checkpoint,null);assert.equal(r.step,finale);}
 // A v6 save written before checkpoints existed loads unchanged.
 const old={...raw};delete old.checkpoint;const r=loadProgress(JSON.stringify(old));assert.equal(r.checkpoint,null);assert.equal(r.step,finale);
});

for(const [id,flags] of [['zero',{}],['archive',{channel_called:true}],['finale',{line_choice:'go',eve_kept:true}],['finale',{line_choice:'stay',eve_kept:false}]])
 test(`${id} ${JSON.stringify(flags)}: resuming at the boss is a fair, winnable fight closed by the player`,()=>{
  const c=buildMission(id,flags),s=newRun(c.pov,c.map,'power',null,{flags},c);
  assert.equal(resumeAtBoss(s),true);
  assert.ok(s.nodes.every(n=>n.on),'devices stay secured');assert.deepEqual(s.enemies.map(e=>e.boss),[true],'only the boss remains');
  const boss=s.enemies[0];assert.equal(boss.hp,boss.max);assert.equal(boss.state,'walk');assert.equal(s.hp,s.maxHp);
  s.finalConsent=true;const policy=makePolicy({reaction:.3,dodgeRate:.6,seed:11});let finalHit=null;
  while(s.status==='playing'&&s.time<600){tick(s,policy(s),1/30);for(const e of s.events)if(e.type==='down'&&e.boss)finalHit=e.source;}
  assert.equal(s.status,'cleared',`cleared in ${s.time.toFixed(0)}s`);assert.ok(finalHit&&finalHit!=='partner','final hit belongs to the player: '+finalHit);
 });

test('resume at boss refuses missions without a boss and finished runs',()=>{
 const c=buildMission('breach',{}),s=newRun(c.pov,c.map,'power',null,null,c);assert.equal(resumeAtBoss(s),false);
 const f=buildMission('finale',{}),t=newRun(f.pov,f.map,'power',null,null,f);t.status='cleared';assert.equal(resumeAtBoss(t),false);
});

test('runtime wires the checkpoint, the save confirmation and the defeat tip',()=>{
 const rt=fs.readFileSync('game/runtime.mjs','utf8');
 assert.match(rt,/type==='bossWake'\)\{progress\.checkpoint='boss';const ok=persist\(\)/,'reaching a boss saves a checkpoint');
 assert.match(rt,/async function completeStep\(\)\{[^}]*progress\.checkpoint=null/,'finishing a step clears it');
 assert.match(rt,/progress\.checkpoint==='boss'&&resumeAtBoss\(state\)/,'retry and continue resume at the boss');
 assert.match(rt,/✓ Progressi salvati/,'the step card confirms the save');
 assert.match(rt,/DEFEAT_TIPS\[lastHurt\]/,'a defeat explains the last hit');
 const html=fs.readFileSync('game/index.html','utf8');for(const id of ['card-goal','card-meta','result-tip'])assert.match(html,new RegExp(`id="${id}"`));
});

test('the defended site in Act II names the place the Blackout choice left in the dark',()=>{
 assert.match(buildMission('city',{blackout_choice:'workshop'},'workshop').goal,/il rifugio/);
 assert.match(buildMission('city',{blackout_choice:'shelter'},'shelter').goal,/l’officina/);
});

test('EVE-Prime judges the rhythm of her own fight, not the shots spent before she woke',()=>{
 const c=buildMission('archive',{}),s=newRun('nox',2,'power',null,null,c);s.actions=Array(8).fill('gun');
 for(const e of s.enemies)if(!e.boss)e.hp=0;s.wave=c.waves.length-1;
 for(const n of s.nodes){if(n.on)continue;s.x=n.x;s.y=n.y;s.inv=99;tick(s,{interact:true},.05);for(let k=0;k<60&&!n.on;k++)tick(s,{},.05);for(const e of s.enemies)if(!e.boss)e.hp=0;}
 const boss=s.enemies.find(e=>e.boss);assert.notEqual(boss.state,'dormant','boss awake');s.inv=99;tick(s,{},.05);
 assert.equal(boss.guard,0,'no guard raised from pre-fight shots');
});
