import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {CAMPAIGN} from '../game/missions.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('the reunion theme is reserved for the reunion and what follows it',()=>{
 const first=CAMPAIGN.findIndex(s=>s.id==='reunion');
 for(const [i,s] of CAMPAIGN.entries())if(s.music==='reunion')assert.ok(i>=first,s.id+' plays the reunion theme before the reunion');
 assert.equal(CAMPAIGN.find(s=>s.id==='rooftop').music,'promise_theme');
 for(const id of ['home','moon','cathedral'])assert.equal(CAMPAIGN.find(s=>s.id===id).music,'refuge_theme',id);
 assert.match(read('game/runtime.mjs'),/soundtrack\(pov==='lulu'\?'lulu':'refuge_theme'\)/);
});
test('leitmotif cues exist, are streamed from v10 and routed on Android',()=>{
 const engine=read('game/audio-engine.mjs'),routes=read('android/src/com/cityadventure/pizzaprotocol/debug/AssetRoutes.java');
 for(const cue of ['refuge_theme','promise_theme']){
  assert.ok(fs.statSync(new URL(`../game/audio/v10/${cue}.ogg`,import.meta.url)).size>100000,cue);
  assert.ok(engine.includes(`'${cue}'`),cue);assert.ok(routes.includes(cue),cue);
  const m=JSON.parse(read(`assets/production/v10.3/audio/${cue}-metrics.json`));
  assert.equal(m.clipped_samples,0);assert.ok(m.loop_boundary_step<.02,cue+' loop seam');assert.equal(m.human_listening,false);assert.equal(m.commercial_ready,false);
 }
});
