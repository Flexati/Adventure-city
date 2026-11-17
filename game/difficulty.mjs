// R49 (D92, proposal of D86): a difficulty curve across the four acts. The simulation (tools/audit_combat.mjs) showed every
// stage won by the average and the weak player alike, with Act III as gentle as Act I (city 1 hit taken, glass_flood and
// ascent 0, Vega 2). The curve rises by act and leaves a breather after each peak, like a saw: a short chase after a boss,
// the chalk route after the signature. Only waves and boss health change: never timings, windows or hitboxes (rule 4).
// boss: multiplier on the boss health (a longer fight, so each phase has room); add: [wave index (-1 = last), ...roles].
// The two chases (glass_flood, ascent) stay short on purpose: 8–10 s of running between two hard fights is the breath of
// the saw (in the simulation the runner is caught before any enemy reaches the hero, so adding enemies changes nothing).
export const CURVE={
 app_clinic:{add:[[1,'shooter']]},
 bone_tyrant:{boss:1.15},
 city:{add:[[2,'shooter'],[-1,'breaker']]},
 forge_behemoth:{boss:1.1},
 glass_reaper:{boss:1.1},
 vega:{boss:1.15},
 archive:{boss:1.2},
 app_axis:{add:[[0,'shooter']]},
 finale:{boss:1.1}
};
export function applyCurve(c,id){
 const k=CURVE[id];if(!k)return c;
 if(k.boss&&c.boss)c.boss={...c.boss,hp:Math.round(c.boss.hp*k.boss/5)*5};
 for(const [i,...roles] of k.add||[]){const at=i<0?c.waves.length+i:i;if(c.waves[at])c.waves[at]=[...c.waves[at],...roles];}
 return c;
}
