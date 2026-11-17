// R48 (D92): the defects found by the code review of R43–R47, each one closed and kept closed.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {applyReputation} from '../game/reputation.mjs';
import {heartTier} from '../game/bond.mjs';
import {tierOf} from '../game/reputation.mjs';
import {CODEX} from '../game/codex.mjs';
import {INTERIORS} from '../game/interiors.mjs';
import {EN_TEXT} from '../game/locale.mjs';
import {AudioDirector} from '../game/audio-engine.mjs';
const rt=fs.readFileSync('game/runtime.mjs','utf8');

test('Kairn and Morrow helping in the finale leave without replaying their first meeting or its choice',()=>{
 assert.match(rt,/async function leaveStrangers\(\)\{\n[^\n]*\n if\(!state\?\.allies\)return;delete state\.allies;if\(state\.strangersCame\)return;/);
});

test('the muffled tone of low health opens again once the stage is over',()=>{
 assert.match(rt,/function syncSoundscape\(dt\)\{\n audioDirector\.update\(\);audioDirector\.duck\(uiLock>0\|\|barkTimer>0\);if\(mode!=='foot'\|\|!state\|\|state\.status!=='playing'\)audioDirector\.peril\(false\);/);
});

test('Escape or going to the background with the Archive open: back to the pause menu, never two panels or a running game behind',()=>{
 assert.match(rt,/function setPause\(v\)\{if\(v&&!canPause\(\)\)return;if\(!v&&!paused\)return;if\(v&&paused\)return;if\(!v&&!\$\('codex'\)\.hidden\)\{\$\('codex-close'\)\.click\(\);return;\}/);
});

test('a boss phase keeps looping its section even when a long frame lets the media wrap to the start',()=>{
 const param=()=>({value:0,cancelScheduledValues(){},setValueAtTime(){},setValueCurveAtTime(){},setTargetAtTime(v){this.value=v;}});
 const d=new AudioDirector({context:{currentTime:0}});d.ready=true;
 const media={currentTime:80,duration:101.8};d.tracks=[{media,loopFrom:58.18,gain:{gain:param()}}];
 d.update();assert.equal(media.currentTime,80);media.currentTime=0.4;d.update();assert.equal(media.currentTime,58.18,'wrapped past the end between two frames');
});

test('the districts’ help takes a raider away when the first wave has one, and the notices say what happens',()=>{
 const warm={blackout_choice:'shelter',rooftop_answer:'them',heat:'unit9'};// 50+6+8+10 = 74: high
 assert.deepEqual(applyReputation({waves:[['raider','shooter','breaker'],['raider']]},'zero',warm,{}).waves[0],['shooter','breaker'],'the raider goes, as the notice says');
 assert.deepEqual(applyReputation({waves:[['shooter','breaker'],['raider']]},'zero',warm,{}).waves[0],['shooter'],'no raider: the last enemy goes, the notice says «un nemico»');
 assert.deepEqual(applyReputation({waves:[['raider','shooter','breaker'],['raider']]},'zero',{},{}).waves[0],['raider','shooter','breaker'],'middle standing: as tuned');
 for(const t of ['I quartieri vi coprono le spalle: un nemico in meno all’inizio.','Nessuno vi copre: alla fine arriva un assaltatore in più.']){assert.ok(rt.includes(t),t);assert.ok(Object.hasOwn(EN_TEXT,t),t);}
 assert.ok(!rt.includes('la gang manda'),'not every stage is the gang');
});

test('the ending waits for the lines it actually shows, and closes on its piece from the first bar',()=>{
 assert.match(rt,/const shown=list\.children\.length,reveal=setTimeout\(\(\)=>\$\('ending-line'\)\.classList\.add\('on'\),600\+shown\*1500\),roll=setTimeout\(\(\)=>\$\('credits'\)\.classList\.add\('on'\),1600\+shown\*1500\);/);
 assert.match(rt,/audioDirector\.memory=\{\};soundtrack\(ENDING_MUSIC\[end\]\|\|'reunion'\);/);
});

test('the Archive speaks English in English: every role and every place goes through the locale',()=>{
 for(const e of CODEX)assert.ok(Object.hasOwn(EN_TEXT,e.role),e.role);
 for(const svcs of Object.values(INTERIORS))for(const d of Object.values(svcs))assert.ok(Object.hasOwn(EN_TEXT,d.place),d.place);
 assert.match(rt,/if\(open\)localeView\.write\(r,role\);else r\.textContent=/);
});

test('the heart and the reputation share one set of thresholds',()=>{
 assert.equal(heartTier,tierOf);for(const v of [0,35,36,64,65,100])assert.equal(heartTier(v),tierOf(v));
});
