// R29 (D73): «Il fuoco che esce dalla canna dello sparo». The muzzle fire of the effects sheet is one flame painted
// pointing right; it was drawn unturned, so a shot to the left, up or down showed fire pointing right.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newRun,tick} from '../game/campaign.mjs';
const rt=fs.readFileSync(new URL('../game/runtime.mjs',import.meta.url),'utf8');
test('the fire is turned to the direction of the shot, its base on the barrel, upright when the shot goes left',()=>{
 assert.match(rt,/function muzzleFire\(x,y,tx,ty\)\{spawnChronoFx\('muzzle_flash',x,y,Math\.atan2\(ty-y,tx-x\)\);\}/);
 assert.match(rt,/function spawnChronoFx\(id,x,y,a=null\)\{[^\n]*Object\.assign\(f,\{id,x,y,a,life:\.34,max:\.34\}\)/);
 assert.match(rt,/else\{ctx\.save\(\);ctx\.translate\(f\.x,f\.y\);ctx\.rotate\(f\.a\);if\(Math\.cos\(f\.a\)<0\)ctx\.scale\(1,-1\);drawChronoFrame\(ctx,chronoArt\.get\('effects'\),chronoAnimation\(f\.id,'play'\),f\.max-f\.life,34\*k,-8\*k,h,false,settings\.reduced\);ctx\.restore\(\);\}/,'cell point (30,72), the base of the flame, lands on the barrel');
 assert.match(rt,/muzzleFire\(e\.x\+pm\.x,e\.y\+pm\.y,e\.to\.x,e\.to\.y\+from\.th\)/,'the partner\'s shot has its fire too');
});
test('the base of the flame in the sheet is where the renderer puts it (cell 30,72 within a few pixels)',()=>{
 const b=fs.readFileSync(new URL('../game/chrono-manifest.mjs',import.meta.url),'utf8');
 assert.match(b,/"character_id":"muzzle_flash".{0,900}"frame_rectangles":\[\{"x":0,"y":1664,"width":128,"height":128\}/s,'the flame is row y 1664 of art/chrono/effects.png');
});
test('a chained hit (one foe to the next) carries no fire of its own',()=>{
 assert.match(rt,/&&!e\.chain\)e\.type==='shot'/);
 const src=fs.readFileSync(new URL('../game/campaign.mjs',import.meta.url),'utf8');assert.match(src,/th:chest\(e\),chain:true\}\);from=e;/);
});
