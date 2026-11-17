import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {CAMPAIGN} from '../game/missions.mjs';
import {scorePiece} from '../game/audio-engine.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('the reunion theme is reserved for the reunion and what follows it',()=>{
 const first=CAMPAIGN.findIndex(s=>s.id==='reunion');
 for(const [i,s] of CAMPAIGN.entries())if(s.music==='reunion')assert.ok(i>=first,s.id+' plays the reunion theme before the reunion');
 assert.equal(CAMPAIGN.find(s=>s.id==='rooftop').music,'promise_theme');
 for(const id of ['home','moon','cathedral'])assert.equal(CAMPAIGN.find(s=>s.id===id).music,'refuge_theme',id);
 assert.match(read('game/runtime.mjs'),/soundtrack\(pov==='lulu'\?'lulu':'refuge_theme'\)/);
});
test('leitmotif cues exist and, since R38 (D74), play pieces of the new score from v11, routed on Android; the v10 tracks stay untouched',()=>{
 const routes=read('android/src/com/cityadventure/pizzaprotocol/debug/AssetRoutes.java');
 for(const [cue,piece] of [['refuge_theme','refuge'],['promise_theme','promise'],['title_theme','title']]){
  assert.equal(scorePiece(cue),piece,cue);
  assert.ok(fs.statSync(new URL(`../game/audio/v11/${piece}.ogg`,import.meta.url)).size>100000,piece);
  assert.match(routes,new RegExp(`audio/v11/\\([^)]*\\b${piece}\\b`),piece);
  const m=JSON.parse(read(`assets/production/r38/audio/${piece}-metrics.json`));
  assert.equal(m.clipped_samples,0);assert.ok(m.loop_seam_step_db<=-40,piece+' loop seam');assert.equal(m.human_listening,false);assert.equal(m.commercial_ready,false);
  // the V10.3 derivative is kept as it was: the history stays reproducible
  assert.ok(fs.statSync(new URL(`../game/audio/v10/${cue}.ogg`,import.meta.url)).size>100000,cue);
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
