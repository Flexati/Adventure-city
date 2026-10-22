// Persistent narrative state and beat resolver. No DOM or renderer dependencies.
export const NARRATIVE_VERSION=1;
export const DEFAULT_THERMAL=50;
const ID=/^[a-z0-9][a-z0-9_.:-]{0,63}$/i;
const scalar=v=>typeof v==='boolean'||typeof v==='string'||(typeof v==='number'&&Number.isFinite(v));
const safeId=v=>typeof v==='string'&&ID.test(v);
const clampNarrative=(v,a,b)=>Math.max(a,Math.min(b,v));

function validRecord(value){
 if(value==null||typeof value!=='object'||Array.isArray(value))return false;
 return Object.entries(value).every(([k,v])=>safeId(k)&&scalar(v));
}
function validChoices(value){
 if(value==null||typeof value!=='object'||Array.isArray(value))return false;
 return Object.entries(value).every(([k,v])=>safeId(k)&&safeId(v));
}
export function createNarrativeState(seed={}){
 const thermal=Number.isFinite(seed.thermal)?clampNarrative(Math.round(seed.thermal),0,100):DEFAULT_THERMAL;
 return {
  version:NARRATIVE_VERSION,
  thermal,
  flags:validRecord(seed.flags)?{...seed.flags}:{},
  choices:validChoices(seed.choices)?{...seed.choices}:{},
  beatsSeen:Array.isArray(seed.beatsSeen)?[...new Set(seed.beatsSeen.filter(safeId))]:[]
 };
}
export function validateNarrativeState(value){
 if(value==null||typeof value!=='object'||Array.isArray(value)||value.version!==NARRATIVE_VERSION)return null;
 if(!Number.isInteger(value.thermal)||value.thermal<0||value.thermal>100)return null;
 if(!validRecord(value.flags)||!validChoices(value.choices))return null;
 if(!Array.isArray(value.beatsSeen)||value.beatsSeen.some(v=>!safeId(v))||new Set(value.beatsSeen).size!==value.beatsSeen.length)return null;
 return createNarrativeState(value);
}
export function adjustThermal(state,delta){
 if(!Number.isFinite(delta))return false;
 state.thermal=clampNarrative(Math.round(state.thermal+delta),0,100);
 return true;
}
export function setNarrativeFlag(state,id,value=true){
 if(!safeId(id)||!scalar(value))return false;
 state.flags[id]=value;return true;
}
export function hasSeenBeat(state,id){return safeId(id)&&state.beatsSeen.includes(id);}
function requirementsMet(state,requires={}){
 if(requires==null||typeof requires!=='object'||Array.isArray(requires))return false;
 return Object.entries(requires).every(([key,value])=>safeId(key)&&scalar(value)&&state.flags[key]===value);
}
export function canTriggerBeat(state,beat){
 if(!state||!beat||!safeId(beat.id))return false;
 if(beat.once!==false&&hasSeenBeat(state,beat.id))return false;
 return requirementsMet(state,beat.requires||{});
}
function applyWrites(state,writes={}){
 if(writes==null||typeof writes!=='object'||Array.isArray(writes))return false;
 for(const [key,value] of Object.entries(writes))if(!safeId(key)||!scalar(value))return false;
 for(const [key,value] of Object.entries(writes))state.flags[key]=value;
 return true;
}
export function applyBeat(state,beat){
 if(!canTriggerBeat(state,beat))return false;
 if(!applyWrites(state,beat.writes||{}))return false;
 if(Number.isFinite(beat.thermalDelta))adjustThermal(state,beat.thermalDelta);
 if(!state.beatsSeen.includes(beat.id))state.beatsSeen.push(beat.id);
 return true;
}
export function applyBeatChoice(state,beat,optionId){
 if(!state||!beat||!safeId(beat.id)||!safeId(optionId)||!beat.options||typeof beat.options!=='object')return false;
 if(state.choices[beat.id])return false;
 const option=beat.options[optionId];if(!option||typeof option!=='object')return false;
 // A choice can be applied only after its owning beat has been seen.
 if(!hasSeenBeat(state,beat.id))return false;
 if(!applyWrites(state,option.writes||{}))return false;
 if(Number.isFinite(option.thermalDelta))adjustThermal(state,option.thermalDelta);
 state.choices[beat.id]=optionId;
 return true;
}

// Canonical v0.7 beats. Presentation text remains separate from persistent rules.
export const V07_BEATS={
 opening_two_knocks:{id:'opening_two_knocks',writes:{heard_lulu:true}},
 opening_name:{id:'opening_name',requires:{heard_lulu:true},writes:{chosen_name_nox:true}},
 glass_pickup:{id:'glass_pickup',requires:{chosen_name_nox:true},writes:{glass_owned:true,opening_completed:true}},
 blackout_helios_clue:{id:'blackout_helios_clue',requires:{opening_completed:true},writes:{helios_connector_seen:true}},
 breach_helios_promise:{id:'breach_helios_promise',requires:{glass_owned:true},writes:{helios_promise_respected:true},thermalDelta:3}
};
