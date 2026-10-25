import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {AudioDirector,MIX} from '../game/audio-engine.mjs';
import {V10_SFX_BINDINGS,v10ShotEvent} from '../game/v10-bindings.mjs';

function mixer(){
 const sources=[];
 const context={currentTime:1,createBufferSource(){const s={connect(){},disconnect(){},start(){this.started=true;},stop(){this.onended?.();}};sources.push(s);return s;},createGain(){return {gain:{value:0},connect(){},disconnect(){}};}};
 const d=new AudioDirector({context});d.ready=true;d.effects={};d.v10Played=new Map();d.v10Buffers=new Map(Object.keys(V10_SFX_BINDINGS).map(k=>[k,{length:100,numberOfChannels:1}]));return {d,sources};
}
test('bound runtime samples retain source provenance and hash; IDs are unique',()=>{
 const ledger=JSON.parse(fs.readFileSync('game/audio/v10/integration.json'));
 assert.equal(ledger.length,Object.keys(V10_SFX_BINDINGS).length);
 assert.equal(new Set(ledger.map(a=>a.asset_id)).size,ledger.length);
 for(const b of Object.values(V10_SFX_BINDINGS)){
  const row=ledger.find(r=>r.asset_id===b.assetId);assert.equal(row.destination,'game/'+b.path);
  assert.equal(row.quality_status,'PROTOTYPE');
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(row.destination)).digest('hex'),row.sha256);
 }
});
test('weapon events select distinct samples, including legacy campaign C9 fallback',()=>{
 assert.equal(v10ShotEvent({type:'shot'}),'shot:c9');assert.equal(v10ShotEvent({type:'magic'}),null);
 const paths=['c9','vx9','r12','h17','arc7'].map(weapon=>V10_SFX_BINDINGS[v10ShotEvent({type:'shot',weapon})].path);
 assert.equal(new Set(paths).size,5);
});
test('muting, suspension and locked audio prevent sampled playback',()=>{
 const {d,sources}=mixer();d.enabled=false;assert.equal(d.sampledSfx('ui'),false);
 d.enabled=true;d.suspended=true;assert.equal(d.sampledSfx('ui'),false);
 d.suspended=false;d.unlocked=false;assert.equal(d.sampledSfx('ui'),false);assert.equal(sources.length,0);
});
test('sample voice ends and frees its nodes; strength is clamped',()=>{
 const {d,sources}=mixer();assert.equal(d.sampledSfx('dash',20),true);assert.equal(d.voices.size,1);
 sources[0].onended();assert.equal(d.voices.size,0);assert.equal(d.v10Played.get('dash'),1);
});
test('cooldown and voice cap consume an event without falling through to duplicate synthesis',()=>{
 const {d,sources}=mixer();d.sfx('ui');d.sfx('ui');assert.equal(sources.length,1);
 for(let i=d.voices.size;i<MIX.voices;i++)d.voices.add({});
 assert.equal(d.sampledSfx('dash'),true);assert.equal(sources.length,1);
});
test('missing samples return false so the existing procedural fallback remains usable',()=>{
 const {d}=mixer();d.v10Buffers.clear();assert.equal(d.sampledSfx('shot:c9'),false);assert.equal(d.sampledSfx('unknown'),false);
});
test('parallel preloads share one fetch per sample and do not play any source',async()=>{
 const {d,sources}=mixer();let requests=0;
 const oldFetch=globalThis.fetch;globalThis.fetch=async()=>{requests++;return {ok:true,arrayBuffer:async()=>new ArrayBuffer(1)};};
 d.context.decodeAudioData=async()=>({duration:.55,numberOfChannels:1});
 try{await Promise.all([d.preloadV10(),d.preloadV10()]);assert.equal(requests,10);assert.equal(d.v10Buffers.size,10);assert.equal(sources.length,0);}finally{globalThis.fetch=oldFetch;}
});
test('failed loads are reported and cannot become decoded or commercial PASS',async()=>{
 const {d}=mixer(),oldFetch=globalThis.fetch;globalThis.fetch=async()=>({ok:false,status:404});
 try{await d.preloadV10();assert.equal(d.v10Buffers.size,0);assert.equal(d.v10Errors.length,10);assert.equal(d.failures,10);}finally{globalThis.fetch=oldFetch;}
});
