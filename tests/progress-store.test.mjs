import test from 'node:test';
import assert from 'node:assert/strict';
import {createProgressStore} from '../game/progress-store.mjs';
import {newProgress,saveProgress,loadProgress} from '../game/missions.mjs';

const key='city-adventure-progress-v7';
function fixture(){
 const data=new Map(),writes=[];
 const storage={getItem:k=>data.get(k)??null,setItem(k,v){writes.push(k);data.set(k,v);}};
 const journal=createProgressStore({storage:()=>storage,key,serialize:saveProgress,deserialize:loadProgress});
 return {data,writes,storage,journal};
}
test('schema 7 upgrades to integrity protection without touching v4/v5/v6 data',()=>{
 const {data,journal}=fixture(),p=newProgress();
 data.set('city-adventure-progress-v6','legacy');data.set(key,saveProgress(p));
 assert.equal(journal.read().source,'primary');assert.equal(journal.write(p).ok,true);
 assert.equal(JSON.parse(data.get(key)).version,7);assert.ok(JSON.parse(data.get(key)).integrity);
 assert.equal(data.get('city-adventure-progress-v6'),'legacy');
});
test('a changed valid field fails checksum and recovers the last valid checkpoint',()=>{
 const {data,journal}=fixture(),p=newProgress();journal.write(p);p.world.coins=40;journal.write(p);
 const bad=JSON.parse(data.get(key));bad.world.coins=400;data.set(key,JSON.stringify(bad));
 const r=journal.read();assert.equal(r.source,'backup');assert.equal(r.progress.world.coins,newProgress().world.coins);
 assert.equal(JSON.parse(data.get(key)).world.coins,400,'read preserves damaged data');
});
test('interruption or quota failure at either atomic write retains a recoverable save',()=>{
 for(const failAt of [1,2]){
  const {data,journal,storage}=fixture(),p=newProgress();journal.write(p);p.world.coins=40;
  let count=0;const set=storage.setItem;storage.setItem=(...args)=>{if(++count===failAt)throw Error('QuotaExceededError');set(...args);};
  assert.equal(journal.write(p).ok,false);assert.equal(journal.read().progress.world.coins,newProgress().world.coins);
  assert.equal(loadProgress(data.get(key)).world.coins,newProgress().world.coins);
 }
});
test('missing or truncated primary recovers backup, while two damaged slots never load legacy',()=>{
 for(const primary of [null,'{broken']){
  const {data,journal}=fixture();journal.write(newProgress());if(primary===null)data.delete(key);else data.set(key,primary);
  assert.equal(journal.read().source,'backup');data.set(key+'.backup','{broken');
  data.set('city-adventure-progress-v6',saveProgress(newProgress()));assert.equal(journal.read().source,'corrupt');assert.equal(journal.read().progress,null);
 }
});
test('storage denial and invalid checkpoint are reported without writes',()=>{
 const {journal,storage,writes}=fixture();const p=newProgress();p.world.coins=-1;
 assert.equal(journal.write(p).ok,false);assert.equal(writes.length,0);
 storage.getItem=()=>{throw Error('SecurityError');};assert.equal(journal.read().source,'unavailable');assert.equal(journal.write(newProgress()).ok,false);
});
test('explicit new game replaces the backup so recovery cannot resurrect the abandoned run',()=>{
 const {data,journal}=fixture(),p=newProgress();p.world.coins=900;journal.write(p);
 journal.write(newProgress(),{newGame:true});data.set(key,'{broken');
 assert.equal(journal.read().progress.world.coins,newProgress().world.coins);
});
