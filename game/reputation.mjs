// R44 (D89): reputation. Four standings, worked out from what the player already chose and did (flags, completed
// errands, races, the bond): nothing new is stored, so every old save has a reputation the first time it loads.
// Tiers change stages (help or pressure), bring the strangers back in the finale and write the epilogue.
const repClamp=v=>Math.max(0,Math.min(100,Math.round(v)));
export const tierOf=v=>v>=65?'alta':v<=35?'bassa':'media';
export function reputation(narrative={},world={}){
 const f=narrative.flags||narrative||{};
 let q=50;// Vanta's districts: who you protected when it cost you something
 q+=f.blackout_choice==='shelter'?6:f.blackout_choice==='workshop'?-4:0;
 q+=f.rooftop_answer==='them'?8:f.rooftop_answer==='ask'?-8:0;
 q+=f.heat==='unit9'?10:f.heat==='self'?-10:0;
 q+=f.line_choice==='stay'?10:f.line_choice==='go'?-8:0;
 q+=f['exp.chalk.route']==='service'?4:f['exp.chalk.route']==='direct'?-4:0;
 q+=Math.min(12,2*Object.values(world?.quests||{}).filter(x=>x?.status==='complete').length);
 let s=20;// the strangers: they remember a promise, never explain themselves
 if(f.strangers_met)s+=30;if(f.strangers_trust==='keep')s+=30;else if(f.strangers_trust==='ask')s-=10;if(f.broken_clock_fragment)s+=10;
 const ev=Object.values(world?.races?.events||{}),won=ev.filter(e=>e.won).length,lost=ev.filter(e=>e.completed&&!e.won).length;
 return {quartieri:repClamp(q),stranieri:repClamp(s),intesa:repClamp(Number.isFinite(narrative.thermal)?narrative.thermal:50),veyra:repClamp(50+12*won-8*lost)};
}
// The stage consequences, applied by buildMission. Only the outer tiers change a stage: a player who chose nothing
// (media everywhere) plays the stages exactly as tuned.
export function applyReputation(c,id,flags,world){
 const r=reputation({flags},world),q=tierOf(r.quartieri);
 if(id!=='blackout'&&c.mode!=='stealth'&&c.waves?.length&&c.waves.every(w=>w.every(x=>typeof x==='string'))){
  if(q==='alta'&&c.waves[0].length>1){c.waves[0]=c.waves[0].slice(0,-1);c.civicAid=true;}
  else if(q==='bassa'){c.waves[c.waves.length-1]=[...c.waves[c.waves.length-1],'raider'];c.civicCold=true;}}
 if(id==='finale'&&tierOf(r.stranieri)==='alta')c.strangersAid=true;
 return c;
}
