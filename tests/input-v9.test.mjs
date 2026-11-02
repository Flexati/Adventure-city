import test from 'node:test';
import assert from 'node:assert/strict';
import {GAME_KEYS,isActivationKey,radialControlVector,axialControlValue,movementVector,PAD_BUTTONS,padAxes,readGamepad,pickGamepad,padEdges} from '../game/input-v9.mjs';

test('joystick deadzone removes center drift and reaches full range',()=>{
 assert.deepEqual(radialControlVector(0,0),{x:0,y:0});
 assert.deepEqual(radialControlVector(7.9,-1),{x:0,y:0});
 const right=radialControlVector(80,0);assert.deepEqual(right,{x:1,y:0});
 const diagonal=radialControlVector(80,80);assert.ok(Math.abs(Math.hypot(diagonal.x,diagonal.y)-1)<1e-12);assert.ok(Math.abs(diagonal.x-diagonal.y)<1e-12);
 assert.deepEqual(radialControlVector(NaN,Infinity),{x:0,y:0});
});

test('driving wheel has a deadzone and clamps finite steering',()=>{
 assert.equal(axialControlValue(4.9),0);assert.equal(axialControlValue(100),1);assert.equal(axialControlValue(-100),-1);assert.equal(axialControlValue(NaN),0);
});

test('touch and keyboard movement combine without diagonal speed boost',()=>{
 const diagonal=movementVector({x:0,y:0},new Set(['KeyW','KeyD']));assert.ok(Math.abs(Math.hypot(diagonal.x,diagonal.y)-1)<1e-12);
 const mixed=movementVector({x:.8,y:0},new Set(['KeyD']));assert.deepEqual(mixed,{x:1,y:0});
 assert.deepEqual(movementVector({x:.5,y:0},new Set(['KeyA'])),{x:-.5,y:0});
});

test('only intended gameplay and activation keys are captured',()=>{
 assert.equal(isActivationKey('Space'),true);assert.equal(isActivationKey('Enter'),true);assert.equal(isActivationKey('KeyJ'),false);
 for(const code of ['KeyW','KeyA','KeyS','KeyD','KeyJ','KeyL','KeyQ','KeyE','Space','ShiftLeft','KeyP'])assert.equal(GAME_KEYS.has(code),true);
 assert.equal(GAME_KEYS.has('Tab'),false);assert.equal(GAME_KEYS.has('Escape'),false);
});

// D27/N2: W3C standard gamepad mapping.
const button=(value)=>({pressed:value>.5,touched:value>0,value});
const pad=(axes=[0,0,0,0],pressed={})=>({connected:true,mapping:'standard',axes,buttons:Array.from({length:17},(_,i)=>button(pressed[i]??0))});

test('gamepad left stick: 15 % radial deadzone, full strength from 95 %, linear between',()=>{
 assert.deepEqual(padAxes(.1,.1),{x:0,y:0});
 assert.deepEqual(padAxes(.95,0),{x:1,y:0});assert.deepEqual(padAxes(1,0),{x:1,y:0});
 const half=padAxes(.55,0);assert.ok(Math.abs(half.x-.5)<1e-12,'(0.55 - 0.15) / (0.95 - 0.15) = 0.5');
 assert.deepEqual(padAxes(NaN,Infinity),{x:0,y:0});
});

test('gamepad mapping follows the approved table and ignores non-standard pads',()=>{
 assert.deepEqual(PAD_BUTTONS,{gun:[0,7],dash:[1],magic:[2],duo:[3],switchWeapon:[4],interact:[5],reload:[12],heal:[13],pause:[9]});
 assert.equal(readGamepad({...pad(),mapping:''}),null);assert.equal(readGamepad(null),null);assert.equal(readGamepad({...pad(),connected:false}),null);
 const all=readGamepad(pad([0,0,0,0],{0:1,1:1,2:1,3:1,4:1,5:1,9:1,12:1,13:1}));
 for(const action of Object.keys(PAD_BUTTONS))assert.equal(all.held[action],true,action);
 assert.equal(readGamepad(pad([0,0,0,0],{7:.3})).held.gun,false,'trigger at exactly 30 % is not pressed');
 assert.equal(readGamepad(pad([0,0,0,0],{7:.31})).held.gun,true);
 assert.equal(pickGamepad([null,{...pad(),mapping:''},pad()]).mapping,'standard');assert.equal(pickGamepad([]),null);
});

test('gamepad right stick aims above 25 % and leaves automatic aim below',()=>{
 assert.equal(readGamepad(pad([0,0,.2,.1])).aim,null);
 const up=readGamepad(pad([0,0,0,-.4])).aim;assert.deepEqual(up,{x:0,y:-1});
 const diagonal=readGamepad(pad([0,0,.5,.5])).aim;assert.ok(Math.abs(Math.hypot(diagonal.x,diagonal.y)-1)<1e-12);
});

test('gamepad edges report each press and release once',()=>{
 assert.deepEqual(padEdges({},{dash:true,gun:true}),{pressed:['gun','dash'],released:[]});
 assert.deepEqual(padEdges({dash:true,gun:true},{dash:true,gun:false}),{pressed:[],released:['gun']});
 assert.deepEqual(padEdges({dash:true},{dash:true}),{pressed:[],released:[]});
});
