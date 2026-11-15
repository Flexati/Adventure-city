// R24 (D70): «Elimina oggetti inutili, migliora la grafica dei negozianti. Non deve sembrare AI».
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {HUBS,HUB_ITEMS,hubCatalog,hubPoints} from '../game/hubs.mjs';
import {interiorFor,INTERIOR_ART,NPC_PORTRAIT,portraitSrc} from '../game/interiors.mjs';
const read=f=>fs.readFileSync(new URL('../'+f,import.meta.url));
test('no shop sells an item without an effect; old saves that own the bead still load',()=>{
 for(const [id,h] of Object.entries(HUBS))for(const service of h.services)for(const item of hubCatalog(id,service)){
  assert.notEqual(item,'glass_bead',`${id}/${service} no longer sells the useless bead`);const it=HUB_ITEMS[item];
  assert.ok(it.part||it.consumable||it.slot||item==='intel',`${id}/${service}: ${item} does something`);}
 assert.ok(HUB_ITEMS.glass_bead,'the item definition stays, so a save that holds it is still valid');
});
test('every shop portrait and backdrop is pixel art: small, on a short palette, drawn without smoothing',()=>{
 const reg=JSON.parse(read('assets/production/v10.3/derived/REGISTRO_RITRATTI_PIXEL_20261113.json')).derivati;
 const faces=[...Object.values(INTERIOR_ART.portraits),...Object.values(NPC_PORTRAIT).flatMap(v=>Object.values(v)).map(portraitSrc)];
 for(const path of new Set(faces)){assert.match(path,/\.png$/);const b=read('game/'+path);
  // PNG header: width at byte 16, colour type at byte 25 (3 = palette).
  assert.ok(b.readUInt32BE(16)<=170,path+' is at most 170 pixels wide');assert.equal(b[25],3,path+' uses a palette');
  const plte=b.indexOf('PLTE');assert.ok(plte>0&&b.readUInt32BE(plte-4)/3<=48,path+' has at most 48 colours');
  assert.ok(reg.some(e=>e.derivato==='game/'+path&&fs.existsSync(new URL('../'+e.sorgente,import.meta.url))),path+' keeps its source on record');}
 for(const path of Object.values(INTERIOR_ART.backgrounds))assert.ok(read('game/'+path).length<40000&&reg.some(e=>e.derivato==='game/'+path),path+' is the pixel backdrop');
 const rt=read('game/runtime.mjs').toString(),css=read('game/style.css').toString();
 assert.match(rt,/g\.imageSmoothingEnabled=false;g\.drawImage\(pim,Math\.round\(/);assert.match(css,/#interior \.interior-bg\{image-rendering:pixelated;/);
});
test('the name on the plate matches the figure in the portrait',()=>{
 const name=(hub,service)=>interiorFor(hub,hubPoints(hub).find(p=>p.service===service)).npc;
 assert.equal(name('toxic','smith'),'Sara · Saldatrice dei Tubi');   // a woman at the welding torch
 assert.equal(name('clockwork','relic'),'Vasco · Custode delle Fondamenta'); // an old man with a lantern
});
