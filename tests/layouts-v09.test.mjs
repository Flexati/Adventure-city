import test from 'node:test';
import assert from 'node:assert/strict';
import {getLayout,layoutWalkable,routeWaypoint,TILE_SIZE} from '../game/layouts.mjs';
import {buildMission,FOOT} from '../game/missions.mjs';
import {newRun,moveActor,visible,tick} from '../game/campaign.mjs';

function reaches(layout,from,to){let p={...from,layoutId:layout.id};for(let i=0;i<3000;i++){if(Math.hypot(p.x-to.x,p.y-to.y)<8)return true;const w=routeWaypoint(layout,p,to),d=Math.hypot(w.x-p.x,w.y-p.y);if(d<.01)return false;moveActor(p,(w.x-p.x)/d*5,(w.y-p.y)/d*5);}return false;}
test('all modular objectives, arrivals, patrol segments and boss platforms are reachable with actor clearance',()=>{
 for(const id of Object.keys(FOOT)){
  const c=buildMission(id),l=getLayout(c.layout);if(!l)continue;
  for(const p of [c.start,...(c.nodes||[]),...l.entries,...l.spawns,l.boss,...(c.zone?[c.zone]:[])]){assert.ok(layoutWalkable(l,p.x,p.y),id+' point embedded in wall');assert.ok(reaches(l,c.start,p),id+' disconnected point '+JSON.stringify(p));}
  if(id==='port')for(const patrol of c.waves[0]){for(let j=0;j<patrol.path.length;j++){const a=patrol.path[j],b=patrol.path[(j+1)%patrol.path.length];assert.ok(reaches(l,a,b),'patrol disconnected');for(let k=0;k<=20;k++)assert.ok(layoutWalkable(l,a.x+(b.x-a.x)*k/20,a.y+(b.y-a.y)*k/20),'patrol segment crosses a wall');}}
 }
});
test('geometry differs across missions and collision agrees with sight lines',()=>{
 const ids=new Set(Object.keys(FOOT).map(id=>buildMission(id).layout).filter(Boolean));assert.ok(ids.size>=3);
 const shapes=new Set();for(const id of ids){const l=getLayout(id);shapes.add(l.cells.join(''));for(const w of l.walls){const p={x:w.x+w.w/2,y:w.y+w.h/2};assert.equal(layoutWalkable(l,p.x,p.y,0),false);}}
 assert.equal(shapes.size,ids.size);
 const l=getLayout('elbow'),s=newRun('nox',3,'power',null,null,buildMission('below'));assert.equal(visible(s,{...l.nodes[2]}),false,'L bend blocks shooting across rooms');
 assert.ok(reaches(l,s,l.nodes[2]),'L bend can be navigated');
});
test('new wave entries and reunion ally stay outside collision geometry',()=>{
 for(const id of ['city','line','finale']){
  const c=buildMission(id),s=newRun(c.pov,c.map,'power',null,null,c),l=getLayout(c.layout);s.inv=999;
  if(id==='finale'){s.x=800;s.y=800;for(const n of s.nodes)n.on=true;const boss=s.enemies.find(e=>e.boss);boss.state='walk';boss.hp=10;}
  for(let i=0;i<1400;i++)tick(s,{},.05);
  for(const e of s.enemies)assert.ok(layoutWalkable(l,e.x,e.y,0),id+' enemy inside wall');
  if(s.partner)assert.ok(layoutWalkable(l,s.partner.x,s.partner.y,0),'ally inside wall');
 }
});
test('projectiles hit modular bulkheads rather than the old crossroads walls',()=>{
 const c=buildMission('below'),s=newRun('nox',3,'power',null,null,c);s.inv=999;
 // A valid horizontal road in the L elbow, blocked in the legacy cross.
 s.shots=[{x:1000,y:416-34,vx:100,vy:0,life:1}];tick(s,{},.05);assert.equal(s.shots.length,1,'shot must survive on new road');
 // A wall of the elbow, which was road in the legacy cross.
 s.shots=[{x:995,y:800-34,vx:500,vy:0,life:1}];tick(s,{},.05);assert.equal(s.shots.length,0,'new bulkhead must stop shots');
});
test('Lulù arrival projects into walkable floor even when Nox is against the outer edge',()=>{
 const c=buildMission('finale'),s=newRun('nox',3,'power',null,null,c);s.inv=999;s.x=200;s.y=800;for(const n of s.nodes)n.on=true;const boss=s.enemies.find(e=>e.boss);boss.state='walk';boss.hp=10;tick(s,{},.05);assert.ok(s.partner);assert.ok(layoutWalkable(getLayout(c.layout),s.partner.x,s.partner.y));
});
test('analytic beam preserves four-pixel stops and cannot cross the elbow wall',async()=>{
 const {trace}=await import('../game/campaign.mjs');
 const actor={x:480,y:800,layoutId:'elbow'};
 assert.deepEqual(trace(actor,{x:1,y:0},310),{x:636,y:800});
 assert.deepEqual(trace(actor,{x:0,y:-1},310),{x:480,y:490});
 // Beam end is visible, the next four-pixel sample is blocked, across varied authored rooms.
 for(const id of ['elbow','gallery','spine','arena']){const l=getLayout(id);for(const p of [l.start,...l.nodes])for(let angle=0;angle<6.28;angle+=.4){const a={...p,layoutId:id},dir={x:Math.cos(angle),y:Math.sin(angle)},end=trace(a,dir,420),d=Math.hypot(end.x-a.x,end.y-a.y);assert.ok(visible(a,end),id+' endpoint clipped');if(d<419)assert.equal(visible(a,{x:end.x+dir.x*4,y:end.y+dir.y*4}),false,id+' beam stopped in open floor');}}
});
