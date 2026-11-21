// R52 (D93): the Back button on the screens that block the story: field kit, story choice, press-and-hold, knock, the city
// choice and the opening. Each one is handled (true, so the exit dialog does not open); what else happens is the rule of
// game/back-route.mjs. The real page is checked in Chromium by tools/verify_back_r52.cjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {backOnStoryScreen,BACK_STORY_SCREENS} from '../game/back-route.mjs';
const rt=fs.readFileSync('game/runtime.mjs','utf8');

function press(open){const calls=[];const r=backOnStoryScreen(id=>open.includes(id),{skipOpening:()=>calls.push('skip'),cancelHold:()=>calls.push('cancelHold')});return {r,calls};}

test('field kit, story choice, knock and city choice: Back is handled and changes nothing',()=>{
 for(const id of ['field-kit','choice','knock','city-choice']){const {r,calls}=press([id]);assert.equal(r,id,id);assert.deepEqual(calls,[],id+': no action, the screen stays and nothing resolves');}
});

test('press-and-hold: Back cancels the press in progress and the screen stays',()=>{
 const {r,calls}=press(['hold']);assert.equal(r,'hold');assert.deepEqual(calls,['cancelHold']);
});

test('opening: Back skips it when the skip button is on screen, otherwise it is swallowed (a first run is never skipped for the player)',()=>{
 const first=press(['opening']);assert.equal(first.r,'opening');assert.deepEqual(first.calls,[],'first night: the skip button is hidden, Back does nothing');
 const again=press(['opening','opening-skip']);assert.equal(again.r,'opening');assert.deepEqual(again.calls,['skip'],'a player who has seen it: Back is the skip');
 const stage=press(['opening','opening-skip']);assert.equal(stage.calls.length,1,'one press, one skip');
});

test('nothing open: the router stays out of the way and the usual order goes on (pause, then the exit question)',()=>{
 assert.equal(press([]).r,null);assert.equal(press(['pause-panel','talk','card','hud']).r,null,'panels the old order already handles are not touched here');
 assert.deepEqual([...BACK_STORY_SCREENS].sort(),['choice','city-choice','field-kit','hold','knock','opening']);
});

test('the runtime asks the router before the pause test, so a locked screen never reaches «Tornare al telefono?»',()=>{
 const body=rt.slice(rt.indexOf('window.__chronosBack=()=>'),rt.indexOf('// ---------- Input ----------'));
 assert.match(body,/if\(backOnStoryScreen\(id=>!\$\(id\)\.hidden,\{skipOpening:\(\)=>\$\('opening-skip'\)\.click\(\),cancelHold:\(\)=>cancelHold\?\.\(\)\}\)\)return true;/);
 assert.ok(body.indexOf('backOnStoryScreen')<body.indexOf('canPause()&&!paused'),'before the pause test');
 assert.ok(body.indexOf('backOnStoryScreen')<body.indexOf("$('talk').hidden"),'before the dialogue and the other panels');
 assert.match(body,/return false;\n\};$/m,'the exit question stays the last resort');
 // The ids the router asks about exist in the page, and the hold press can be cancelled from outside.
 const html=fs.readFileSync('game/index.html','utf8');for(const id of ['opening','opening-skip','hold','field-kit','choice','knock','city-choice'])assert.match(html,new RegExp(`id="${id}"`),id);
 assert.match(rt,/let cancelHold=null;/);assert.match(rt,/cancelHold=up;b\.focus\(\)/);
});

test('the Java side still asks the page first and only then pauses and asks to leave',()=>{
 const java=fs.readFileSync('android/src/jaguarZcreatorZ13/app/MainActivity.java','utf8');
 assert.match(java,/@Override public void onBackPressed\(\) \{[\s\S]*?window\.__chronosBack[\s\S]*?if \("true"\.equals\(handled\)\) return;[\s\S]*?pauseGame\(\);/);
});
