// R22 (D68): «dove sta il palazzo deve comparire il suo terreno»: every village building stands on a paved lot of its own.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {HUBS} from '../game/hubs.mjs';
import {getLayout} from '../game/layouts.mjs';
import {villageFamily,lotPlan} from '../game/village-art.mjs';
const src=readFileSync(new URL('../game/village-art.mjs',import.meta.url),'utf8'),VT=64;
test('the painted buildings no longer sit on a dark veil with a frame',()=>{
 const house=src.slice(src.indexOf('function vDrawHouse('),src.indexOf('function vDrawBuilding('));
 assert.ok(!house.includes('#06101a66'),'no dark box under the building');
 assert.ok(!house.includes('strokeRect'),'no frame around the lot');
 assert.match(house,/vLotGround\(g,b,v,env,d\)/,'the lot is paved first');
});
test('the lot stone of a district is not the stone of its streets or of its square',()=>{
 const lot=JSON.parse(/const LOT_TILE=(\[[\d,]+\])/.exec(src)[1]),floor=[0,2,7,0],plaza=[0,2,7,6];
 assert.equal(lot.length,4);
 for(let d=0;d<4;d++){assert.notEqual(lot[d],floor[d],'district '+d+' street');assert.notEqual(lot[d],plaza[d],'district '+d+' square');assert.ok(lot[d]>=0&&lot[d]<8,'a ground tile of the environment atlas');}
});
test('in all 14 villages every building fills its lot and stays inside it',()=>{
 let count=0;
 for(const id of Object.keys(HUBS)){
  const v=getLayout(HUBS[id].layout).village,H=villageFamily(id);
  for(const b of v.buildings){
   const plan=lotPlan(b,H),px=b.x*VT,W=b.w*VT,base=(b.y+b.h)*VT;count++;
   assert.ok(plan.length>=1&&plan.length<=2,id+' '+b.letter);
   const l=Math.min(...plan.map(q=>q[1]-q[3]/2)),r=Math.max(...plan.map(q=>q[1]+q[3]/2));
   assert.ok(l>=px-14&&r<=px+W+14,`${id} ${b.letter}: the building stays on its lot (${Math.round(l-px)}, ${Math.round(r-px-W)})`);
   assert.ok((Math.min(r,px+W)-Math.max(l,px))/W>=.7,`${id} ${b.letter}: at least 70 % of the lot width is building`);
   for(const q of plan)assert.ok(q[2]>=base-10&&q[2]<=base+8,id+' '+b.letter+': it stands on the front edge of the lot');
   assert.deepEqual([b.door.y,b.door.x>=b.x&&b.door.x<b.x+b.w],[b.y+b.h,true],id+' '+b.letter+': the doorstep is right below the lot');
  }
 }
 assert.equal(count,92);
});
test('streets touching a lot get a contact shadow, not the wall edging, and lot cells are not painted as outside',()=>{
 assert.match(src,/if\(lots\?\.has\(\(y\+dy\)\*N\+x\+dx\)\)\{[^}]*continue;\}/);
 assert.match(src,/\}else if\(lots\?\.has\(y\*N\+x\)\)\{\s*\}else\{/);
});
test('the derived sheets are scaled with premultiplied alpha and lose the magenta rim',()=>{
 const py=readFileSync(new URL('../tools/derive_argon_case_20261113.py',import.meta.url),'utf8');
 assert.match(py,/convert\('RGBa'\)\.resize/);assert.match(py,/def defringe\(im\)/);
});
