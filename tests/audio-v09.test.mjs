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
