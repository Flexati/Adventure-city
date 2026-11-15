import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {newRun,tick,INPUT_BUFFER,clearInputBuffer,startAttack} from '../game/campaign.mjs';
import {buildMission} from '../game/missions.mjs';import {createArsenalV9} from '../game/weapons-v9.mjs';

// N1 (D27, Pilastro 1 righe 156-173): 100 ms buffer for SCHIVA, SPARA and PULSE only.
const solo=(...args)=>{const s=newRun(...args);s.enemies=[];return s;};
const busy=(s,duration)=>{s.action={kind:'gun',t:0,duration,dir:{x:0,y:-1},fired:true};};
const until=(s,done,limit=60,dt=1/60)=>{for(let k=0;k<limit;k++){tick(s,{},dt);if(done(s))return k+1;}return null;};

test('a dash pressed 0.08 s before the cooldown ends starts within 0.1 s with unchanged timings',()=>{
 assert.equal(INPUT_BUFFER,.1);assert.ok(Math.abs(INPUT_BUFFER*60-6)<1e-9,'100 ms = 6 frames at 60 Hz');
 for(const dt of [1/60,.05]){const s=solo('nox');s.dashCd=.08;
  tick(s,{dash:true},dt);assert.equal(s.dash,0,'still cooling on the press tick');
  const ticks=until(s,s=>s.dash>0,10,dt);assert.ok(ticks!==null&&ticks*dt<INPUT_BUFFER,`dt ${dt}: buffered dash started after ${ticks} ticks`);
  assert.deepEqual([s.dash,s.dashCd,s.inv,s.perfectWindow],[.18,1.1,.3,.14]);assert.equal(s.dashBuf,0);assert.ok(s.events.some(e=>e.type==='dash'));}
});

test('a dash pressed 0.15 s or more before the cooldown ends is dropped',()=>{
 // dt .05 uses 0.2 s: with 0.15 s the first free tick would land exactly on the 0.1 s edge.
 for(const [dt,cd] of [[1/60,.15],[.05,.2]]){const s=solo('nox');s.dashCd=cd;tick(s,{dash:true},dt);
  assert.equal(until(s,s=>s.dash>0||s.events.some(e=>e.type==='dash'),Math.ceil(.5/dt),dt),null,`dt ${dt}`);assert.equal(s.dashCd,0);assert.equal(s.dashBuf,0);}
});

test('SPARA pressed during an action fires on the first free tick, keeping a dragged aim or aiming automatically then',()=>{
 const s=solo('nox');busy(s,.04);tick(s,{gun:true,aim:{x:1,y:0}},1/60);assert.equal(s.fireCd,0,'blocked by the running action');
 assert.equal(until(s,s=>s.fireCd>0,10),3,'the action ends on the second tick after the press, the shot starts on the next');assert.deepEqual(s.action.dir,{x:1,y:0});assert.equal(s.gunBuf,0);
 const a=newRun('nox'),e=a.enemies[0];a.enemies=[e];Object.assign(e,{x:a.x+150,y:a.y});busy(a,.04);tick(a,{gun:true},1/60);assert.equal(a.gunAim,null);
 e.x=a.x-150;assert.equal(until(a,s=>s.fireCd>0,10),3);assert.ok(a.action.dir.x<-.99,'automatic aim is read when the shot starts');
});

test('a buffered PULSE starts; SPARA wins over PULSE on the same tick and PULSE does not start later',()=>{
 const s=solo('nox',1);s.magicCd=.04;tick(s,{magic:true},1/60);assert.equal(s.action,null);
 assert.ok(until(s,s=>s.action?.kind==='magic',10)*(1/60)<INPUT_BUFFER);assert.equal(s.magicCd,3.5);assert.equal(s.magicBuf,0);
 const both=solo('nox',1);tick(both,{gun:true,magic:true},1/60);assert.equal(both.action.kind,'gun');
 assert.equal(until(both,s=>s.action?.kind==='magic'||s.magicCd>0),null);assert.equal(both.magicBuf,0);
});

test('the newest press replaces the buffered aim and restarts the 0.1 s timer',()=>{
 const run=(second)=>{const s=solo('nox');busy(s,.14);tick(s,{gun:true,aim:{x:1,y:0}},1/60);
  for(let k=1;k<9;k++)tick(s,k===4&&second?{gun:true,aim:{x:0,y:1}}:{},1/60);return s;};
 const old=run(false);assert.equal(old.action,null,'action over');tick(old,{},1/60);assert.equal(old.fireCd,0,'the first press alone has expired');
 const s=run(true);assert.equal(s.action,null);tick(s,{},1/60);assert.ok(s.fireCd>0);assert.deepEqual(s.action.dir,{x:0,y:1});
});

test('Duo and ATTIVA are not buffered; SCHIVA and PULSE stay tappable while cooling',()=>{
 const s=solo('nox');s.duo=99;tick(s,{duo:true},1/60);s.duo=100;tick(s,{},1/60);assert.equal(s.duo,100);assert.equal(s.duoAnim,0);assert.ok(!s.events.some(e=>e.type==='duo'));
 const n=s.nodes[0];tick(s,{interact:true},1/60);assert.equal(s.channel,null);s.x=n.x;s.y=n.y;tick(s,{},1/60);assert.equal(s.channel,null);
 const runtime=fs.readFileSync('game/runtime.mjs','utf8');
 assert.doesNotMatch(runtime,/\$\('dash'\)\.disabled=/);assert.match(runtime,/\$\('magic'\)\.disabled=!unlocked;/);assert.doesNotMatch(runtime,/\$\('magic'\)\.disabled=[^;]*magicCd/);
 assert.match(runtime,/db\.classList\.toggle\('cooling',s\.dashCd>0\)/);assert.match(runtime,/\$\('magic'\)\.classList\.toggle\('cooling',s\.magicCd>0\)/);
 assert.match(fs.readFileSync('game/style.css','utf8'),/\.cooling:not\(:disabled\)::after\{[^}]*width:calc\(var\(--cd,1\)\*100%\)/);
});

test('clearInputBuffer drops pending presses and adds no fields',()=>{
 const s=solo('nox');s.arsenal=createArsenalV9('nox');const ammo={...s.arsenal.ammo};busy(s,.04);const running=s.action;s.dashCd=.05;
 tick(s,{dash:true,gun:true,aim:{x:1,y:0}},1/60);assert.ok(s.dashBuf>0&&s.gunBuf>0,'both presses are buffered');assert.equal(s.dash,0);assert.equal(s.action,running);
 clearInputBuffer(s);assert.deepEqual([s.dashBuf,s.gunBuf,s.magicBuf,s.gunAim],[0,0,0,null]);assert.equal('magicAim' in s,false,'no field is created');
 let started=false,dashed=false;for(let k=0;k<12;k++){tick(s,{},1/60);if(s.action&&s.action!==running)started=true;if(s.events.some(e=>e.type==='dash'))dashed=true;}
 assert.equal(dashed,false);assert.equal(s.dash,0);assert.equal(started,false);assert.equal(s.fireCd,0);assert.deepEqual(s.arsenal.ammo,ammo);
 const empty={};clearInputBuffer(empty);assert.deepEqual(empty,{});
});

test('the final hit stays the player\'s: a SPARA buffered before the consent scene does not fire after it',()=>{
 const c=buildMission('finale',{line_choice:'go'}),s=newRun('nox',3,'power',null,null,c),boss=s.enemies.find(e=>e.boss);
 s.enemies=[boss];s.partner.cd=999;s.inv=999;boss.state='walk';boss.hp=2;s.x=boss.x;s.y=boss.y+60;
 assert.ok(startAttack(s,'gun',{x:0,y:-1}));tick(s,{gun:true},.05);assert.ok(s.gunBuf>0,'SPARA buffered during the action');
 tick(s,{},.05);assert.ok(s.events.some(e=>e.type==='finalConsent'));assert.equal(boss.hp,1);assert.ok(s.gunBuf>0,'still pending when the scene opens');
 // Same steps as finalConsentScene in game/runtime.mjs: clearControls() (which calls clearInputBuffer), then after the scene:
 clearInputBuffer(s);s.finalConsent=true;boss.guard=0;boss.state='recover';boss.clock=0;s.fireCd=0;s.action=null;
 let started=false;for(let k=0;k<18;k++){tick(s,{},1/60);if(s.action)started=true;}
 assert.equal(started,false,'no startAttack without a new press');assert.equal(boss.hp,1);assert.equal(s.status,'playing');
 tick(s,{gun:true},1/60);assert.ok(s.action,'a new SPARA starts');for(let k=0;k<12&&boss.hp>0;k++)tick(s,{},1/60);assert.equal(boss.hp,0);
});

test('every interruption reaches clearInputBuffer through clearControls',()=>{
 const runtime=fs.readFileSync('game/runtime.mjs','utf8'),lines=runtime.split('\n');
 assert.match(runtime,/import \{[^}]*\bclearInputBuffer\b[^}]*\} from '\.\/campaign\.mjs'/);
 const clear=lines.find(l=>l.startsWith('function clearControls(){'));assert.ok(clear?.includes('clearInputBuffer(state)'),'clearControls empties the buffer');
 for(const head of ['function lock(){','function setPause(v){','function suspend(){'])assert.ok(lines.find(l=>l.startsWith(head))?.includes('clearControls()'),head);
 const scene=runtime.slice(runtime.indexOf('async function finalConsentScene(){'));assert.ok(scene.indexOf('clearControls()')>0&&scene.indexOf('clearControls()')<scene.indexOf('await say('),'finalConsentScene clears before the scene');
});
