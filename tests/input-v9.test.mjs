import test from 'node:test';
import assert from 'node:assert/strict';
import {GAME_KEYS,isActivationKey,radialControlVector,axialControlValue,movementVector} from '../game/input-v9.mjs';

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
