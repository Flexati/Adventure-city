import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';import {createRequire} from 'node:module';import {createHash} from 'node:crypto';
import {newRun,tick,ALLY_RULES,distance} from '../game/campaign.mjs';
import {CHRONO_MANIFEST} from '../game/chrono-manifest.mjs';
import {chronoAnimation} from '../game/chrono-art.mjs';
const {PNG}=createRequire(import.meta.url)('pngjs');
// Two raiders, the hero still; allies arrive where meetStrangers() places them.
function arena(){const s=newRun('nox',1);s.allies=[{id:'kairn',x:s.x-75,y:s.y-60,cd:0,face:1,anim:'idle',animT:0},{id:'morrow',x:s.x+75,y:s.y-60,cd:.3,face:-1,anim:'idle',animT:0}];s.allyTime=8;s.partner=null;for(const e of s.enemies){e.state='stun';e.stun=1e9;}return s;}
const run=(s,seconds,watch=()=>{})=>{for(let t=0;t<seconds;t+=.02){tick(s,{},.02);watch(s);}};

test('Kairn walks to the nearest raider and lands punches only on the release frame',()=>{
 const s=arena(),k=s.allies[0],e=s.enemies[0];e.x=k.x-200;e.y=k.y;const start=distance(k,e),hp=e.hp;let walked=false,released=null;
 run(s,3,st=>{if(k.anim==='walk')walked=true;for(const ev of st.events)if(ev.type==='allyStrike'&&released===null)released={t:k.strike?.t,move:ev.move,ally:ev.ally,face:k.face};});
 assert.ok(walked,'Kairn closes the distance');assert.ok(distance(k,e)<start||e.hp<=0);assert.equal(released.face,-1,'faces the raider on the left');
 assert.deepEqual({move:released.move,ally:released.ally},{move:'punch',ally:'kairn'});assert.ok(released.t>=ALLY_RULES.kairn.moves.punch.release);assert.ok(e.hp<hp);
});

test('Morrow covers with the shotgun at range and switches to the chainsaw up close',()=>{
 const s=arena(),m=s.allies[1],[far,near]=s.enemies;far.x=m.x+220;far.y=m.y;near.x=m.x+3000;near.y=m.y;s.allies.shift();const moves=[];
 run(s,1.2,st=>{for(const ev of st.events)if(ev.ally==='morrow')moves.push(ev.type+':'+ev.move);});
 assert.ok(moves.includes('partnerShot:shotgun'));assert.ok(!moves.some(m=>m.endsWith('saw')));
 far.x=m.x+40;far.y=m.y;far.hp=50;moves.length=0;run(s,1.2,st=>{for(const ev of st.events)if(ev.ally==='morrow')moves.push(ev.type+':'+ev.move);});
 assert.ok(moves.includes('allyStrike:saw'));assert.equal(m.face,1);
});

test('allies keep the eight-second window and never target a boss',()=>{
 const s=arena();for(const e of s.enemies){e.boss=true;e.x=s.allies[0].x+30;e.y=s.allies[0].y;}const hp=s.enemies.map(e=>e.hp);let hits=0;
 run(s,2,st=>{hits+=st.events.filter(ev=>ev.ally).length;});assert.equal(hits,0);assert.deepEqual(s.enemies.map(e=>e.hp),hp);
 const t=arena();run(t,8.2);assert.equal(t.allyTime,0);const before=t.enemies.map(e=>e.hp);run(t,1.5);assert.deepEqual(t.enemies.map(e=>e.hp),before,'no hits after the window');
 for(const a of t.allies)assert.ok(['idle','walk'].includes(a.anim),'allies regroup instead of freezing in an attack pose');
});

test('damage and cadence are unchanged from the previous ally support',()=>{
 const s=arena(),e=s.enemies[0];s.allies=[s.allies[1]];e.x=s.allies[0].x+150;e.y=s.allies[0].y;e.hp=1e6;const hp=e.hp;let shots=0;
 run(s,3.5,st=>{shots+=st.events.filter(ev=>ev.ally==='morrow').length;});
 assert.ok(shots>=4&&shots<=5,'one action every 0.7 s: '+shots);assert.equal(hp-e.hp,shots*Math.max(4,s.c.damage*3));
});

test('author-reference stranger atlases are clean, distinct and declared in both manifests',()=>{
 const report=JSON.parse(fs.readFileSync('assets/production/v10.2/strangers-production.json','utf8')),full=JSON.parse(fs.readFileSync('game/art/chrono/manifest.json','utf8'));
 for(const r of report){const id=r.runtime.split('/').pop().replace('.png','');
  assert.equal(createHash('sha256').update(fs.readFileSync(r.master)).digest('hex'),r.master_sha256);assert.equal(createHash('sha256').update(fs.readFileSync(r.runtime)).digest('hex'),r.runtime_sha256);
  assert.deepEqual(CHRONO_MANIFEST.atlases[id],full.atlases[id]);assert.equal(CHRONO_MANIFEST.atlases[id].reserve,false);
  const im=PNG.sync.read(fs.readFileSync(r.runtime));assert.deepEqual([im.width,im.height],r.dimensions_px);
  for(const name of r.rows){const a=chronoAnimation(id,name);assert.ok(a,id+' '+name);assert.equal(a.frame_count,4);
   const hashes=a.frame_rectangles.map(f=>{const h=createHash('sha256');let edge=0,opaque=0;for(let y=0;y<f.height;y++)for(let x=0;x<f.width;x++){const v=im.data[((f.y+y)*im.width+f.x+x)*4+3];h.update(Buffer.of(v));if(v)opaque++;if(v&&(x===0||y===0||x===f.width-1||y===f.height-1))edge++;}assert.equal(edge,0,id+' gutter');assert.ok(opaque>5000);return h.digest('hex');});
   assert.equal(new Set(hashes).size,4,id+' '+name+' frames are distinct');}
 }
 for(const move of Object.values(ALLY_RULES).flatMap(r=>Object.values(r.moves)))assert.ok(move.release<move.duration);
});
