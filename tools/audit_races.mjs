// Race audit by simulation: every Veyra race, driven by the game's own pilot (racePilot) degraded to three skill levels.
// Reports result, rank, time against the medals, impacts, missed checkpoints and recoveries, for the player and the rivals.
// Usage: node tools/audit_races.mjs [out.json]      Pure simulation: no browser, no game state is edited.
import fs from 'node:fs';
import {RACES_V9,newRaceV9,tickRaceV9,racePilot,raceResultV9,raceMedal} from '../game/racing-v9.mjs';
// lag: seconds of reaction delay on steering; grip: how much of the pilot's throttle is used; start: perfect start; nitro: uses it.
export const RACE_SKILLS={esperto:{lag:0,grip:1,start:true,nitro:true},medio:{lag:.2,grip:.94,start:false,nitro:true},debole:{lag:.4,grip:.86,start:false,nitro:false}};
const DT=1/60;
export function playRace(id,skill){
 const k=RACE_SKILLS[skill],s=newRaceV9(id),queue=[],r={impacts:0,missed:0,rivalImpacts:0,rivalMissed:0};
 while(['countdown','racing'].includes(s.status)){
  let input;
  if(s.status==='countdown')input={throttle:k.start&&s.countdown<=.5?1:0};
  else{const p=racePilot(s,s.cars[0]);queue.push(p.steer);const steer=queue.length>k.lag/DT?queue.shift():0;input={steer,throttle:p.throttle*k.grip,brake:p.brake,nitro:k.nitro&&p.nitro};}
  tickRaceV9(s,input,DT);
  for(const e of s.events){const mine=e.car==='player';if(e.type==='impact')mine?r.impacts++:r.rivalImpacts++;if(e.type==='missedCheckpoint')mine?r.missed++:r.rivalMissed++;}
 }
 const res=raceResultV9(s),def=RACES_V9[id],p=s.cars[0],rivals=s.cars.slice(1).filter(c=>c.finishTime!==null).map(c=>c.finishTime);
 return {status:s.status,rank:res?.rank??null,time:res?+res.time.toFixed(1):null,medal:res?raceMedal(def,res.time):null,impacts:r.impacts,missed:r.missed,recoveries:p.recoveries,
  rivalImpacts:r.rivalImpacts,rivalMissed:r.rivalMissed,gap:res&&rivals.length?+(res.time-Math.min(...rivals)).toFixed(1):null,limit:def.limit};
}
// Static coherence of a course: things a player would call unfair before any driving.
export function raceLayoutIssues(def){
 const out=[],half=def.checkpointWidth||165;
 def.checkpoints.forEach((cp,i)=>{const x=def.checkpointXs?.[i]??360;
  for(const h of def.hazards){if(Math.abs(h.at-cp)>=260)continue;
   if(h.kind==='barrier'&&Math.abs(h.gap-x)>half)out.push(`checkpoint ${i+1}: il varco della barriera a ${h.at} è fuori dal corridoio`);
   if(!h.kind&&!h.moving&&Math.abs(h.x-x)<55&&half<110)out.push(`checkpoint ${i+1}: ostacolo fisso a ${h.at} nel centro del corridoio stretto`);}});
 for(const q of def.pads||[])for(const h of def.hazards)if(h.kind!=='slick'&&Math.abs(h.at-q.at)<200&&(h.kind==='barrier'?h.gap!==q.x:Math.abs((h.x??360)-q.x)<110))out.push(`rampa nitro a ${q.at}: porta contro l'ostacolo a ${h.at}`);
 for(const g of def.gates)for(const h of def.hazards)if(h.kind!=='slick'&&Math.abs(h.at-g)<300)out.push(`cancello a ${g}: ostacolo a ${h.at} troppo vicino`);
 if(def.checkpoints.at(-1)>def.length-300)out.push('ultimo checkpoint a meno di 300 dal traguardo');
 return out;
}
if(import.meta.url===`file://${process.argv[1]}`){
 const report={};
 console.log('gara                   abilità  esito      posto  tempo  medaglia  urti  cp mancati  recuperi  distacco  urti rivali');
 for(const [id,def] of Object.entries(RACES_V9)){report[id]={layout:raceLayoutIssues(def)};
  for(const skill of Object.keys(RACE_SKILLS)){const x=report[id][skill]=playRace(id,skill);
   console.log(id.padEnd(22),skill.padEnd(8),x.status.padEnd(10),String(x.rank??'-').padStart(5),String(x.time??'-').padStart(6),String(x.medal??'-').padStart(9),String(x.impacts).padStart(5),String(x.missed).padStart(11),String(x.recoveries).padStart(9),String(x.gap??'-').padStart(9),String(x.rivalImpacts).padStart(12));}
  for(const l of report[id].layout)console.log('   !! '+l);}
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,1));
}
