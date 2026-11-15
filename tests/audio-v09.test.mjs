import test from 'node:test';
import assert from 'node:assert/strict';
import {AudioDirector,musicalState} from '../game/audio-engine.mjs';

function deferredMixer(){
 const pending=[];const gain=()=>({gain:{value:0,cancelScheduledValues(){},setValueCurveAtTime(){this.value=1;}},connect(){},disconnect(){}});
 const context={currentTime:0,createGain:gain,createMediaElementSource:()=>({connect(){},disconnect(){}})};
 const director=new AudioDirector({context,mediaFactory:src=>({src,paused:true,pause(){this.paused=true},load(){},removeAttribute(){},play(){this.paused=false;return new Promise(resolve=>pending.push(resolve));}})});
 director.ready=true;director.music=gain();return {director,pending,context};
}
test('a late old play promise cannot retire the newer soundtrack (slow mobile decoder)',async()=>{
 const {director:d,pending,context}=deferredMixer();d.setCue('title');d.setCue('driving');
 pending[1]();await Promise.resolve();pending[0]();await Promise.resolve();
 assert.equal(d.tracks.at(-1).cue,'driving');assert.equal(d.tracks.at(-1).retireAt,undefined);
 context.currentTime=10;d.update();assert.equal(d.tracks.length,1);assert.equal(d.tracks[0].cue,'driving');
});
test('rapid state changes keep at most two music streams and dispose superseded sources',async()=>{
 const {director:d,pending,context}=deferredMixer();for(const cue of ['nox','danger','lulu','danger','reunion']){d.setCue(cue);assert.ok(d.tracks.length<=2);}
 for(const resolve of pending.reverse())resolve();await Promise.resolve();context.currentTime=10;d.update();assert.equal(d.tracks.length,1);assert.equal(d.tracks[0].cue,'reunion');
});
test('tension has a five-second release and the reunion has its own musical identity',()=>{
 assert.equal(musicalState({base:'lulu'}),'lulu');assert.equal(musicalState({base:'nox',tension:1}),'danger');assert.equal(musicalState({base:'lulu',tension:.2,quietFor:4.9}),'danger');assert.equal(musicalState({base:'lulu',quietFor:5}),'lulu');assert.equal(musicalState({base:'nox',joined:true,tension:1}),'reunion');
});
test('audio engine applies pitch and volume randomization to repetitive sound effects while preserving non-repetitive cues',()=>{
 const playedSources=[];
 const playedGains=[];
 const context={
  currentTime:1,
  createGain(){
   const g={gain:{value:1,setValueAtTime(v){this.value=v;},linearRampToValueAtTime(v){this.rampTo=v;},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};
   playedGains.push(g);
   return g;
  },
  createBufferSource(){
   const s={playbackRate:{value:1},connect(){},disconnect(){},start(){},stop(){}};
   playedSources.push(s);
   return s;
  },
  createOscillator(){
   const o={type:'sine',frequency:{value:0,setValueAtTime(v){this.value=v;},exponentialRampToValueAtTime(v){this.endVal=v;}},connect(){},disconnect(){},start(){},stop(){}};
   playedSources.push(o);
   return o;
  },
  createBiquadFilter(){return {type:'lowpass',frequency:{value:1000},Q:{value:.65},connect(){},disconnect(){}};}
 };
 let seq=0;const vals=[.2,.8,.15,.85];
 const d=new AudioDirector({context,random:()=>vals[seq++%vals.length]});
 d.ready=true;
 d.unlocked=true;
 d.effects={connect(){},disconnect(){}};
 d.chronoBuffers=new Map([['vx9_shot',{}],['save',{}]]);

 // 1. Repetitive buffer SFX (vx9_shot) should apply pitch jitter
 d.chronoSfx('vx9_shot', 1);
 const vx9Source=playedSources.at(-1);
 const vx9Gain=playedGains.at(-1);
 assert.ok(vx9Source.playbackRate.value >= 0.90 && vx9Source.playbackRate.value <= 1.10);
 assert.ok(vx9Gain.gain.value >= 0.40 && vx9Gain.gain.value <= 0.60);

 // 2. Non-repetitive buffer SFX (save) should remain deterministic (playbackRate = 1)
 context.currentTime=2;
 d.chronoSfx('save', 1);
 const saveSource=playedSources.at(-1);
 const saveGain=playedGains.at(-1);
 assert.equal(saveSource.playbackRate.value, 1);
 assert.equal(saveGain.gain.value, 0.5);

 // 3. Repetitive synth SFX (step) should randomize oscillator pitch and ramp gain
 context.currentTime=3;
 d.noise={getChannelData:()=>new Float32Array(10)};
 d.sfx('shot', 1);
 const shotOsc=playedSources.at(-1);
 const shotGain=playedGains.at(-1);
 assert.ok(shotOsc.frequency.value !== 650 || shotGain.gain.rampTo !== 0.22); // randomized from spec base
 assert.ok(shotOsc.frequency.value >= 650 * 0.92 && shotOsc.frequency.value <= 650 * 1.08);

 // 4. Non-repetitive synth SFX (fanfare) should remain strictly deterministic
 context.currentTime=4;
 d.sfx('fanfare', 1);
 const fanfareOsc=playedSources.at(-1);
 const fanfareGain=playedGains.at(-1);
 assert.equal(fanfareOsc.frequency.value, 440);
 assert.equal(fanfareGain.gain.rampTo, 0.28);
});
