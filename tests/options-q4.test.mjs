import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {AudioDirector,MIX} from '../game/audio-engine.mjs';
// Q4 (D34, D35 priority 5): a professional Options screen. Volumes ride on the authored mix; 100 % is the mix as it was.
const html=fs.readFileSync('game/index.html','utf8'),runtime=fs.readFileSync('game/runtime.mjs','utf8'),css=fs.readFileSync('game/style.css','utf8');
const director=()=>{const d=new AudioDirector({context:{}}),log={};d.ready=true;d.music={gain:{name:'music'}};d.effects={gain:{name:'effects'}};d.ambient={gain:{name:'ambient'}};d.ramp=(p,v)=>{log[p.name]=v;};return {d,log};};
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,a+' ~ '+b);

test('Q4: player volumes scale music, effects and ambience on top of MIX; 100 % is the authored mix',()=>{
 const {d,log}=director();d.setLevels(1,1);near(log.music,MIX.music);near(log.effects,MIX.effects);near(log.ambient,MIX.ambience);
 d.setLevels(.3,.6);near(log.music,MIX.music*.3);near(log.effects,MIX.effects*.6);near(log.ambient,MIX.ambience*.6);
 d.duck(true);near(log.music,MIX.music*.3*MIX.duck);d.setLevels(.5,.6);near(log.music,MIX.music*.5*MIX.duck);d.duck(false);near(log.music,MIX.music*.5);
 d.setLevels(0,0);assert.equal(log.music,0);assert.equal(log.effects,0);
});

test('Q4: stored volumes are clamped, and a broken value falls back to the authored mix',()=>{
 const {d}=director();for(const [m,e,want] of [[NaN,undefined,[1,1]],[3,-1,[1,0]],['x',.4,[1,.4]]]){d.setLevels(m,e);assert.deepEqual([d.levels.music,d.levels.effects],want);}
 const fresh=new AudioDirector({context:{}});assert.deepEqual(fresh.levels,{music:1,effects:1});assert.deepEqual(fresh.status().levels,{music:1,effects:1});
});

test('Q4: the main menu opens Options with four tabs, each bound to its page, and one Close',()=>{
 assert.match(runtime,/\$\('menu-settings'\)\.onclick=\(\)=>openOptions\(\$\('menu-settings'\)\);/);
 const tabs=[...html.matchAll(/<button role="tab" id="tab-(\w+)" aria-controls="page-(\w+)"/g)];assert.deepEqual(tabs.map(m=>m[1]),['audio','access','controls','credits']);
 for(const m of tabs){assert.equal(m[1],m[2]);assert.match(html,new RegExp('<div id="page-'+m[1]+'" class="options-page" role="tabpanel"'));}
 for(const id of ['opt-sound','opt-music','opt-effects','opt-language','opt-reduced','opt-big-text','opt-haptics','options-close','pause-options'])assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(css,/\.options-tabs button\{margin:0;min-height:44px;/);
});

test('Q4: Options over the pause panel close first on Esc, and resuming never leaves Options open over play',()=>{
 assert.match(runtime,/if\(e\.code==='Escape'\)\{if\(!\$\('options'\)\.hidden\)\{closeOptions\(\);return;\}/);
 assert.match(runtime,/panel\('pause-panel',v\);if\(!v\)panel\('options',false\);/);
 assert.match(css,/#options\{position:fixed;z-index:56\}/);
});

test('Q4: the pause switches and the Options switches write the same settings',()=>{
 for(const id of ['sound','reduced','haptics'])assert.match(runtime,new RegExp("\\$\\('opt-'\\+id\\)\\.onchange=\\(\\)=>\\{\\$\\(id\\)\\.checked=\\$\\('opt-'\\+id\\)\\.checked;\\$\\(id\\)\\.onchange\\(\\);\\};"));
 assert.match(runtime,/\$\('opt-language'\)\.onchange=\(\)=>\{\$\('language'\)\.value=\$\('opt-language'\)\.value;\$\('language'\)\.onchange\(\);\};/);
 assert.match(runtime,/audioDirector\.setLevels\(level\(settings\.music\),level\(settings\.effects\)\);applyTextSize\(\);syncOptions\(\);/);
});
