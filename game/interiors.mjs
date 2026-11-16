// Interior scenes for hub services and people (V10.3, M-I1). Pure data and rules: no DOM.
// Painted art is optional: until a file is listed in INTERIOR_ART the runtime uses the
// blurred hub and the NPC sprite enlarged, so no request ever 404s.
import {HUBS} from './hubs.mjs';
import {INTERIORS} from './arsenal-data.mjs';
export {INTERIORS};

// Painted art (D50): Argon delivery of 9 November 2026, derived by tools/derive_argon_20261109.py.
// Backgrounds: one per service. Portraits: the services without a canon face, keyed hub_service, and the gate guard by atlas.
const BG='moon_inn,moon_smith,moon_shop,cathedral_smith,cathedral_relic,cathedral_shop,cathedral_info,toxic_smith,toxic_alchemist,toxic_shop,toxic_info,clockwork_smith,clockwork_shop,clockwork_relic,clockwork_info'.split(',');
const FACES='moon_shop,cathedral_smith,cathedral_info,toxic_smith,clockwork_shop,clockwork_relic,clockwork_info'.split(',');
export const INTERIOR_ART={backgrounds:Object.fromEntries(BG.map(k=>[k,`art/interiors/${k}.webp`])),portraits:{...Object.fromEntries(FACES.map(k=>[k,`art/npc/svc_${k}.png`])),gate_guard:'art/npc/svc_cathedral_gate_guard.png'}};
// Ritratti reali (GPT preproduzione 310), solo dove il canone mette il personaggio in quel villaggio e in quel ruolo
// (APPENDICE_NPC_PERSONAGGI_V10_2_20261028.md) o dove il servizio lo nomina; nessun personaggio nominato è clonato in più villaggi.
export const NPC_PORTRAIT={
 moon:{inn:'oren',smith:'dario'},
 cathedral:{relic:'maelis',shop:'tomas_vale'},
 toxic:{alchemist:'ilyra',shop:'mara',info:'vesper'},
 clockwork:{smith:'rika_dorn'},
 clinic_ward:{inn:'ines'},
 node_commons:{smith:'bran_kess'},
 sky_rail:{info:'tarek'},
 deep_archive:{info:'eren'}
};
export const portraitSrc=id=>id?`art/npc/${id}.png`:null;
const DISTRICT_BASE=['moon','cathedral','toxic','clockwork'];
const SERVICE_BG_FALLBACK={inn:'moon_inn',smith:'clockwork_smith',shop:'cathedral_shop',relic:'cathedral_relic',info:'cathedral_info',alchemist:'toxic_alchemist'};

export function storyPhase(flags={}){return flags.reunited?'after':flags.separated?'apart':'before';}
export function interiorFor(hubId,point){
 const hub=HUBS[hubId];if(!hub||!point)return null;
 const baseHub=DISTRICT_BASE[hub.district]||'moon';
 if(point.kind==='service'){
  const def=INTERIORS[hubId]?.[point.service];if(!def)return null;
  const bgKey=INTERIOR_ART.backgrounds[`${hubId}_${point.service}`]?`${hubId}_${point.service}`:(INTERIOR_ART.backgrounds[`${baseHub}_${point.service}`]?`${baseHub}_${point.service}`:SERVICE_BG_FALLBACK[point.service]);
  const facePortrait=portraitSrc(NPC_PORTRAIT[hubId]?.[point.service])||INTERIOR_ART.portraits[`${hubId}_${point.service}`]||null;
  return {kind:'service',service:point.service,hubId,place:def.place,npc:def.npc,atlas:point.atlas,job:def.job||null,def,
   background:INTERIOR_ART.backgrounds[bgKey]||null,portrait:facePortrait};
 }
 if(point.kind==='person'){
  const idx=Math.max(0,hub.people.findIndex(p=>p[0]===point.id)),svcKey=hub.services[idx%hub.services.length],svc=INTERIORS[hubId]?.[svcKey]||INTERIORS[hubId]?.[hub.services[0]];
  const lorePool=[hub.intro?.[0],hub.intro?.[1],hub.jobs?.[0]?.brief,hub.secret].filter(Boolean);
  const pDef=svc?{place:hub.name,npc:point.label,greet:point.text,ask:idx===3&&hub.jobs?.[1]?{before:hub.jobs[1].brief,apart:svc.ask.apart,after:hub.epilogue}:svc.ask,lore:lorePool[idx%lorePool.length]||svc.lore}:null;
  return {kind:'person',hubId,place:hub.name,npc:point.label,atlas:point.atlas,job:null,def:pDef,line:point.text,
   background:null,portrait:portraitSrc(point.portrait)||INTERIOR_ART.portraits[point.atlas]||null};
 }
 return null;
}
// Lines the NPC says when asked: the current phase first, then the place's lore. Cycles.
export function interiorAsk(scene,flags,count=0){
 if(!scene?.def)return scene?.line||'';
 const lines=[scene.def.ask[storyPhase(flags)],scene.def.lore];return lines[count%lines.length];
}
export function interiorGreeting(scene){return scene?.def?scene.def.greet:scene?.line||'';}
export function interiorTexts(){
 const out=[];for(const hub of Object.values(INTERIORS))for(const d of Object.values(hub))out.push(d.place,d.npc,d.greet,d.ask.before,d.ask.apart,d.ask.after,d.lore);return out;
}
