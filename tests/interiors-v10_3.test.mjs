import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {HUBS,hubPoints} from '../game/hubs.mjs';
import {INTERIORS,INTERIOR_ART,interiorFor,interiorAsk,interiorGreeting,interiorTexts,storyPhase} from '../game/interiors.mjs';
import {EN_TEXT} from '../game/locale.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('every hub service has an interior and every person a street scene',()=>{
 for(const [id,h] of Object.entries(HUBS)){
  for(const s of h.services)assert.ok(INTERIORS[id]?.[s],id+':'+s);
  for(const p of hubPoints(id).filter(p=>['service','person'].includes(p.kind))){const sc=interiorFor(id,p);assert.ok(sc,id+':'+p.id);assert.ok(sc.atlas,id+':'+p.id+' atlas');assert.ok(interiorGreeting(sc));}
 }
});
test('errands offered in person exist on the board of the same hub',()=>{
 for(const [id,hub] of Object.entries(INTERIORS))for(const d of Object.values(hub))if(d.job)assert.ok(HUBS[id].jobs.some(j=>j.id===d.job),id+':'+d.job);
});
test('asking follows the story phase and then the lore, cycling',()=>{
 assert.equal(storyPhase({}),'before');assert.equal(storyPhase({separated:true}),'apart');assert.equal(storyPhase({separated:true,reunited:true}),'after');
 const sc=interiorFor('moon',hubPoints('moon').find(p=>p.id==='smith'));
 assert.equal(interiorAsk(sc,{separated:true},0),INTERIORS.moon.smith.ask.apart);assert.equal(interiorAsk(sc,{},1),INTERIORS.moon.smith.lore);assert.equal(interiorAsk(sc,{},2),INTERIORS.moon.smith.ask.before);
});
test('every interior line and UI label has English',()=>{
 for(const t of interiorTexts())assert.ok(Object.hasOwn(EN_TEXT,t),t);
 for(const t of ['Entra','Chiedi','Compra','Riposa','Esci','Indietro','PER STRADA','Già fatto. Grazie ancora.','Torna quando hai finito.'])assert.ok(Object.hasOwn(EN_TEXT,t),t);
});
test('no painted art is referenced until it is delivered, so nothing 404s',()=>{
 for(const group of Object.values(INTERIOR_ART))for(const path of Object.values(group))assert.ok(fs.existsSync(new URL('../game/'+path,import.meta.url)),path);
});
test('the economy stays in the shared service functions',()=>{
 const rt=read('game/runtime.mjs');assert.match(rt,/function serviceCatalog\(id,service\)/);assert.match(rt,/buyHubItem\(progress,id,service,itemId\)/);assert.match(rt,/if\(point\.kind==='person'\|\|point\.kind==='service'\)\{await openInterior\(point\);return;\}/);
 assert.match(read('game/index.html'),/<section id="interior" hidden/);
});
