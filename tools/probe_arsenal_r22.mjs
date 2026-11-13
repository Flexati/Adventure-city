// R22: how much each market weapon and special move shortens a fight, played by the same bot as tools/audit_combat.mjs.
// Usage: node tools/probe_arsenal_r22.mjs [mission ...]     Pure simulation [SIMULAZIONE]: a bot is not a playtest.
import {newRun,tick} from '../game/campaign.mjs';
import {buildMission,FOOT} from '../game/missions.mjs';
import {MARKET_WEAPON_IDS,WEAPONS_V9,unlockedMovesV11} from '../game/weapons-v9.mjs';
import {makePolicy} from '../tests/helpers/autoplay.mjs';
const BASE={blackout_choice:'workshop',glass_truth:true,rooftop_answer:'them',clinic_hidden:true,heat:'self',channel_called:true,eve_kept:true,line_choice:'go','weapon.tessa':true};
const ids=process.argv.slice(2).length?process.argv.slice(2):['bone_tyrant','forge_behemoth','glass_reaper','vega','finale','app_axis'];
function play(id,weapon,move,seed){
 const pov=FOOT[id].pov||'nox',flags={...BASE,...(weapon?{['weapon.active.'+pov]:weapon}:{}),...(move?{['move.active.'+pov]:move}:{})};
 const c=buildMission(id,flags,'workshop',{inventory:Object.fromEntries(MARKET_WEAPON_IDS.map(k=>[k,1]))}),s=newRun(c.pov||'nox',c.map,'power','workshop',null,c),policy=makePolicy({reaction:.22,dodgeRate:.75,seed});let hurts=0;
 while(s.status==='playing'&&s.time<900){tick(s,policy(s),1/30);if(s.events.some(e=>e.type==='finalConsent')){s.finalConsent=true;const b=s.enemies.find(e=>e.boss);if(b){b.guard=0;b.state='recover';b.clock=0;}}for(const e of s.events)if(e.type==='hurt')hurts++;}
 return {won:s.status==='cleared',time:s.time,hurts,hp:s.hp};
}
const med=a=>[...a].sort((x,y)=>x-y)[a.length>>1];
for(const id of ids){
 const pov=FOOT[id].pov||'nox',c0=buildMission(id,BASE,'workshop'),moves=unlockedMovesV11(pov,c0.act,{}),kit=pov==='nox'?'vx9':'r12';
 const row=(label,w,m)=>{const r=[1,2,3,4,5,6].map(seed=>play(id,w,m,seed));return `${label.padEnd(30)} ${r.filter(x=>x.won).length}/6  ${med(r.map(x=>x.time)).toFixed(1).padStart(6)} s  colpi presi ${String(med(r.map(x=>x.hurts))).padStart(2)}`;};
 console.log(`\n${id} (${pov}, atto ${c0.act})`);console.log(row('c9',null,null));console.log(row(kit+' (di serie)',kit,null));
 for(const w of MARKET_WEAPON_IDS)console.log(row(w,w,null));
 for(const m of moves.slice(1))console.log(row(kit+' + '+m,kit,m));
}
