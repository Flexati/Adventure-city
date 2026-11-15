import test from 'node:test';
import assert from 'node:assert/strict';
import {chalkCivilianPose} from '../game/visuals.mjs';
import {getLayout,layoutWalkable} from '../game/layouts.mjs';
import {buildMission} from '../game/missions.mjs';
import {chronoAnimation,chronoFrame} from '../game/chrono-art.mjs';
test('chalk civilian walks a valid corridor without teleporting and rests at each endpoint',()=>{
 const layout=getLayout(buildMission('below',{}).layout);
 for(const route of ['direct','service']){let prev=chalkCivilianPose(0,route);const actions=new Set();
  for(let i=1;i<600;i++){const pose=chalkCivilianPose(i/10,route);assert.ok(layoutWalkable(layout,pose.x,pose.y,20));assert.ok(Math.hypot(pose.x-prev.x,pose.y-prev.y)<=2.401,'no jump at cycle boundary');actions.add(pose.animation);assert.ok(chronoFrame(chronoAnimation('civilian',pose.animation),pose.elapsed));prev=pose;}
  assert.deepEqual([...actions].sort(),['idle','walk']);assert.deepEqual(chalkCivilianPose(55,route,true),chalkCivilianPose(0,route,true));
 }
 assert.notEqual(chalkCivilianPose(0,'direct').x,chalkCivilianPose(0,'service').x);
});

test('flask frames follow actual access activation and reset when interaction breaks',async()=>{
 const {chalkFlaskFrame}=await import('../game/visuals.mjs');const node={on:false};
 assert.equal(chalkFlaskFrame(node,null,0),0);
 assert.equal(chalkFlaskFrame(node,{node:0,t:.2,need:1},0),1);
 assert.equal(chalkFlaskFrame(node,{node:0,t:.7,need:1},0),2);
 assert.equal(chalkFlaskFrame(node,{node:1,t:.7,need:1},0),0);
 assert.equal(chalkFlaskFrame({on:true},null,0),3);
});
