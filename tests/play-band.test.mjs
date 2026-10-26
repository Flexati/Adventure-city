import test from 'node:test';import assert from 'node:assert/strict';
import {bandBottom,framePlayCamera,cameraScale,frameCamera} from '../game/visuals.mjs';
const SIZE=1536,SPRITE=112;
// 844x390 landscape: stick and weapon bar bottom-left/centre, actions and heal bottom-right.
const landscape=[{l:16,r:134,t:256},{l:144,r:444,t:318},{l:492,r:828,t:310},{l:740,r:828,t:250}];
const portrait=[{l:16,r:134,t:710},{l:12,r:378,t:580},{l:194,r:374,t:648},{l:290,r:374,t:640}];

test('landscape phones use a readable hero scale; portrait and desktop keep theirs',()=>{
 assert.equal(cameraScale(390,844),.66);assert.equal(cameraScale(844,390),.62);assert.equal(cameraScale(740,360),.62);assert.equal(cameraScale(1280,720),Math.min(.95,720/760));
});

test('the band closes only on overlays covering the hero column',()=>{
 assert.equal(bandBottom(landscape,422,390),390-318+6,'centre: weapon bar only');
 assert.equal(bandBottom(landscape,60,390),390-256+6,'left edge: the stick');
 assert.equal(bandBottom(landscape,780,390),390-250+6,'right edge: heal above actions');
 assert.equal(bandBottom([],422,390),0);
});

test('the hero never stands under a control, at the centre or at either map edge',()=>{
 for(const [w,h,overlays,top] of [[844,390,landscape,64],[390,844,portrait,74]]){const k=cameraScale(w,h);
  for(const x of [40,300,768,1200,1500])for(const y of [60,500,900,1506]){
   const c=framePlayCamera({x,y},w,h,k,top,overlays,SIZE),sx=(x-c.x)*k,feet=(y-c.y)*k,head=feet-SPRITE*k;
   for(const o of overlays)if(o.l-30<sx&&sx<o.r+30)assert.ok(feet<=o.t,`${w}x${h} hero ${x},${y} under overlay ${JSON.stringify(o)}`);
   assert.ok(head>=top-90*k||y<=120,`${w}x${h} head under HUD at ${x},${y}`);
   assert.equal(c.x,frameCamera({x,y},w,h,k,top,0,SIZE).x,'horizontal framing does not depend on the band');}}
});

test('landscape band is at least 200 px wherever the hero is horizontally centred',()=>{
 const k=cameraScale(844,390),c=framePlayCamera({x:768,y:768},844,390,k,64,landscape,SIZE);
 assert.ok(390-c.bottom-64>=200,'band '+(390-c.bottom-64));
});
