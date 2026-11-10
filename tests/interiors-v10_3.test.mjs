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
// D50: Argon delivery of 9 November 2026. Every service has its room; the faces follow the canon first.
test('D50: 15 painted rooms and 8 service faces are registered, packaged and routed',()=>{
 const reg=JSON.parse(read('assets/production/v10.3/derived/REGISTRO_ARGON_20261109.json')).assets,routes=read('android/src/com/cityadventure/pizzaprotocol/debug/AssetRoutes.java'),prep=read('tools/prepare_android_assets.py');
 const paths=[...Object.values(INTERIOR_ART.backgrounds),...Object.values(INTERIOR_ART.portraits)];assert.equal(paths.length,23);
 for(const path of paths){assert.ok(reg.some(a=>a.derivato==='game/'+path&&/^[0-9a-f]{64}$/.test(a.grezzo_sha256)),path+' registered');assert.ok(routes.includes(path.split('/').pop().replace(/^svc_/,'').replace(/\.\w+$/,'')),path+' routed');}
 assert.match(prep,/art\/interiors'\)\.glob\('\*\.webp'\)/);
 let rooms=0;for(const [hub,services] of Object.entries(INTERIORS))for(const service of Object.keys(services)){const sc=interiorFor(hub,hubPoints(hub).find(p=>p.kind==='service'&&p.service===service));assert.ok(sc.background,hub+'.'+service+' has a room');assert.ok(sc.portrait,hub+'.'+service+' has a face');rooms++;}
 assert.equal(rooms,15);
 const guard=interiorFor('cathedral',hubPoints('cathedral').find(p=>p.atlas==='gate_guard'));assert.equal(guard.portrait,'art/npc/svc_cathedral_gate_guard.jpg');
});
