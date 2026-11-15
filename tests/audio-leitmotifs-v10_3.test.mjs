import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
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
 for(const cue of ['refuge_theme','promise_theme','title_theme']){
  assert.ok(fs.statSync(new URL(`../game/audio/v10/${cue}.ogg`,import.meta.url)).size>100000,cue);
  assert.ok(engine.includes(`'${cue}'`),cue);assert.ok(routes.includes(cue),cue);
  const m=JSON.parse(read(`assets/production/v10.3/audio/${cue}-metrics.json`));
  assert.equal(m.clipped_samples,0);assert.ok(m.loop_boundary_step<.02,cue+' loop seam');assert.equal(m.human_listening,false);assert.equal(m.commercial_ready,false);
 }
});
test('D44: menu and opening play the title theme, a registered derivative mastered for phone speakers; the v05 original is untouched',()=>{
 assert.equal(CAMPAIGN.find(s=>s.id==='opening').music,'title_theme');
 assert.match(read('game/runtime.mjs'),/audioDirector\.setAmbience\(null\);soundtrack\('title_theme'\);\}/);
 const m=JSON.parse(read('assets/production/v10.3/audio/title_theme-metrics.json')),file=fs.readFileSync(new URL('../game/audio/v10/title_theme.ogg',import.meta.url));
 assert.equal(m.sha256,crypto.createHash('sha256').update(file).digest('hex'),'metrics describe the shipped file');
 assert.ok(Math.abs(m.integrated_lufs+15)<=1,'action cue at -15 LUFS +-1 (AUDIO_PLAN_V10_3.md): '+m.integrated_lufs);
 assert.ok(m.true_peak_dbfs<=-1,'true peak under -1 dBTP: '+m.true_peak_dbfs);
 assert.ok(m.phone_band_lufs>=-19.5,'audible on a phone speaker (above 300 Hz): '+m.phone_band_lufs);
 assert.ok(m.head_tail_correlation<.9,'no copied segment at the loop point');assert.equal(m.duration_seconds,60);
 assert.equal(m.original_untouched_sha256,crypto.createHash('sha256').update(fs.readFileSync(new URL('../game/audio/v05/title.ogg',import.meta.url))).digest('hex'));
 const reg=JSON.parse(read('docs/gold/AUDIO_REGISTER.json')).additional_production.find(e=>e.id==='audio.title_theme');
 assert.equal(reg.file,'game/audio/v10/title_theme.ogg');assert.equal(reg.sha256,m.sha256);assert.equal(reg.generator,'tools/compose_title_theme_v10_3.py');
});
