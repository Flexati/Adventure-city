import test from 'node:test';
import assert from 'node:assert/strict';
import {
 createNarrativeState,validateNarrativeState,adjustThermal,setNarrativeFlag,
 canTriggerBeat,applyBeat,applyBeatChoice,V07_BEATS
} from '../game/narrative.mjs';

test('narrative state is strict, deterministic and bounded',()=>{
 const n=createNarrativeState();assert.equal(n.thermal,50);assert.deepEqual(n.flags,{});assert.deepEqual(n.choices,{});
 assert.ok(validateNarrativeState(n));
 const corrupt={...n,thermal:101};assert.equal(validateNarrativeState(corrupt),null);
 adjustThermal(n,70);assert.equal(n.thermal,100);adjustThermal(n,-250);assert.equal(n.thermal,0);
 assert.equal(setNarrativeFlag(n,'valid.flag',true),true);assert.equal(setNarrativeFlag(n,'bad flag',true),false);
});

test('v0.7 beats unlock in authored order and one-shot beats cannot replay',()=>{
 const n=createNarrativeState();
 assert.equal(canTriggerBeat(n,V07_BEATS.opening_name),false);
 assert.equal(applyBeat(n,V07_BEATS.opening_two_knocks),true);
 assert.equal(applyBeat(n,V07_BEATS.opening_two_knocks),false);
 assert.equal(applyBeat(n,V07_BEATS.opening_name),true);
 assert.equal(applyBeat(n,V07_BEATS.glass_pickup),true);
 assert.equal(n.flags.glass_owned,true);
 assert.equal(applyBeat(n,V07_BEATS.breach_helios_promise),true);
 assert.equal(n.thermal,53);
});

test('choices require a seen beat, apply once and never expose a morality score',()=>{
 const beat={id:'power_route',options:{
  workshop:{writes:{blackout_choice:'workshop'},thermalDelta:0},
  shelter:{writes:{blackout_choice:'shelter'},thermalDelta:0}
 }};
 const n=createNarrativeState();
 assert.equal(applyBeatChoice(n,beat,'workshop'),false);
 assert.equal(applyBeat(n,beat),true);
 assert.equal(applyBeatChoice(n,beat,'workshop'),true);
 assert.equal(n.flags.blackout_choice,'workshop');
 assert.equal(n.choices.power_route,'workshop');
 assert.equal(applyBeatChoice(n,beat,'shelter'),false);
});
