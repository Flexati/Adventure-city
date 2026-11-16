// MS-1 (review of the combat delta of a9e3afd): with «Mira assistita» off, footInputs() sent `aim: face` every frame, and the new
// «aim follows the drag during the action» line in tick() took it for the drag: the shot went where the hero looked, not where
// the thumb pointed (D72, R28). The live drag now travels in its own field, `aimLive`, which is null when nobody is dragging.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const rt=fs.readFileSync('game/runtime.mjs','utf8'),cp=fs.readFileSync('game/campaign.mjs','utf8'),va=fs.readFileSync('game/village-art.mjs','utf8');
test('the live drag is its own input field and never the facing fallback',()=>{
 assert.match(rt,/aimLive:aimTouch\?\.dir\|\|gamepadAim\?\.dir\|\|null,/);
 assert.match(cp,/const live=input\.aimLive!==undefined\?input\.aimLive:input\.aim;if\(live&&!input\.gun&&!input\.magic&&s\.action\.t>0\)/);
 assert.match(cp,/aimAt\(s,live,rng,s\.action\.kind\)/);
 assert.doesNotMatch(cp,/input\.aim&&!input\.gun&&!input\.magic&&s\.action\.t>0/,'the facing fallback must not retarget a running action');
});
test('R4: the labels of the cargo board and of the chest are never under 12 px on the screen',()=>{
 assert.match(va,/function worldText\(ctx,text,x,y,color,size\)\{[^}]*12\/k/);
 assert.match(va,/worldText\(ctx,tr\(isExit\?'CARICO · CAMBIA ATTO':'CARICO · CAMBIA MONDO'\)/);
 assert.match(va,/worldText\(ctx,tr\(near\?'APRI FORZIERE':'FORZIERE'\)/);
 assert.doesNotMatch(va,/ctx\.font='800 (9|11)px system-ui'/,'no fixed small world font left in the new points');
});
