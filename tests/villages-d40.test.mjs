import test from 'node:test';import assert from 'node:assert/strict';
import {VILLAGES,VILLAGE_SIZE,compileVillage,doorOf} from '../game/villages.mjs';
import {HUBS,hubPoints} from '../game/hubs.mjs';
import {getLayout,layoutWalkable} from '../game/layouts.mjs';
// D40: villages are authored plans with real buildings, doors and a plaza, not one cross copied four times.
const N=VILLAGE_SIZE,IDS=Object.keys(VILLAGES);
const reachable=(v,from)=>{const seen=new Set([from[1]*N+from[0]]),q=[from];while(q.length){const [x,y]=q.shift();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx>=0&&ny>=0&&nx<N&&ny<N&&v.cells[ny*N+nx]&&!seen.has(ny*N+nx)){seen.add(ny*N+nx);q.push([nx,ny]);}}}return seen;};

test('four villages, one per hub, each a 24×24 plan with only known symbols',()=>{
 assert.deepEqual(IDS.sort(),Object.keys(HUBS).sort());
 for(const id of IDS){const m=VILLAGES[id].map;assert.equal(m.length,N,id);for(const row of m){assert.equal(row.length,N,id);assert.match(row,/^[#.,xA-Z]+$/,id);}}
});

test('the four plans are different from each other (not the same cross with new colours)',()=>{
 const maps=IDS.map(id=>VILLAGES[id].map.join(''));assert.equal(new Set(maps).size,IDS.length);
 for(let i=0;i<IDS.length;i++)for(let j=i+1;j<IDS.length;j++){
  const a=maps[i],b=maps[j];let same=0;for(let k=0;k<a.length;k++)if(a[k]===b[k])same++;
  assert.ok(same/a.length<.85,`${IDS[i]} and ${IDS[j]} share ${(same/a.length*100|0)}% of their tiles`);
 }
});

test('every building is one solid rectangle with a walkable door under the middle of its south side',()=>{
 for(const id of IDS){const v=compileVillage(id);assert.ok(v.buildings.length>=5,id);
  for(const b of v.buildings){
   for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++){assert.equal(v.cells[y*N+x],0,`${id} ${b.letter} is solid`);}
   assert.ok(b.w>=3&&b.h>=3,`${id} ${b.letter} is big enough to read on a phone`);
   assert.equal(v.cells[b.door.y*N+b.door.x],1,`${id} ${b.letter} door is walkable`);
   assert.equal(b.door.y,b.y+b.h);assert.ok(b.door.x>=b.x&&b.door.x<b.x+b.w);
  }
 }
});

test('each hub service has its own building, its point stands on that door, and the point is reachable from the start',()=>{
 for(const id of IDS){
  const v=compileVillage(id),start=getLayout(id).start,pts=hubPoints(id),reach=reachable(v,[Math.floor(start.x/64),Math.floor(start.y/64)]);
  assert.ok(layoutWalkable(getLayout(id),start.x,start.y),id+' start');
  for(const service of HUBS[id].services){
   const door=doorOf(id,service);assert.ok(door,`${id}: building for ${service}`);
   const p=pts.find(q=>q.kind==='service'&&q.service===service);assert.equal([Math.floor(p.x/64),Math.floor(p.y/64)].join(),[door.x,door.y].join(),`${id}: ${service} point on its door`);
  }
  assert.equal(new Set(v.buildings.filter(b=>b.service).map(b=>b.service)).size,HUBS[id].services.length,id+': no service without a building and no building without a service');
  for(const p of pts)assert.ok(reach.has(Math.floor(p.y/64)*N+Math.floor(p.x/64)),`${id}: ${p.id} reachable`);
 }
});

test('no two points share a tile, and the plaza and the street are both walkable ground',()=>{
 for(const id of IDS){const v=compileVillage(id),seen=new Set();
  for(const p of hubPoints(id)){const k=Math.floor(p.x/64)+','+Math.floor(p.y/64);assert.ok(!seen.has(k),`${id}: two points on ${k}`);seen.add(k);}
  assert.ok(v.plaza.some(Boolean),id+' has a plaza');
  for(let i=0;i<N*N;i++)if(v.plaza[i])assert.equal(v.cells[i],1);
 }
});
