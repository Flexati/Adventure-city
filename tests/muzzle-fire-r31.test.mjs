// R31 (D74, «Verifica che bella fiammata»): the painted flame was orange while the flash painted in the hero sheets is cyan
// (Nox) or pink (Lulù): two fires of two colours on one shot. The flame now takes the hero's colour, keeps a white core,
// glows additively on the barrel and still points where the shot goes (R29).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const rt=fs.readFileSync(new URL('../game/runtime.mjs',import.meta.url),'utf8');
test('the flame is recoloured per hero, white core kept, and the partner fires in its own colour',()=>{
 assert.match(rt,/function fireTint\(color\)\{/);
 assert.match(rt,/w=Math\.pow\(Math\.max\(0,\(l-\.6\)\/\.4\),1\.4\)/,'colour rises from the base, the brightest pixels stay white');
 assert.match(rt,/muzzleFire\(e\.x\+e\.mx,e\.y\+e\.my,e\.to\.x,e\.to\.y\+\(e\.th\?\?-32\),\/\^#\[0-9a-f\]\{6\}\$\/i\.test\(e\.color\|\|''\)&&e\.weapon!=='c9'\?e\.color:state\.hero==='nox'\?'#6bddff':'#ff7fd8'\)/);
 assert.match(rt,/muzzleFire\(e\.x\+pm\.x,e\.y\+pm\.y,e\.to\.x,e\.to\.y\+from\.th,s\.hero==='nox'\?'#ff7fd8':'#6bddff'\)/);
});
test('it glows additively on the barrel and keeps the R29 turn and base',()=>{
 assert.match(rt,/function fireGlow\(f\)\{ctx\.globalCompositeOperation='lighter';const r=22\*\(f\.life\/f\.max\)\+8[^\n]*\n[\s\S]*if\(tint&&!settings\.reduced\)fireGlow\(f\)/);
 assert.match(rt,/ctx\.drawImage\(tint,i\*128,0,128,128,\(34-64\)\*k,\(-8-64\)\*k,128\*k,128\*k\)/,'same base on the barrel as the untinted flame (cell 30,72)');
 assert.match(rt,/ctx\.rotate\(f\.a\);if\(Math\.cos\(f\.a\)<0\)ctx\.scale\(1,-1\);if\(tint\)/);
});
