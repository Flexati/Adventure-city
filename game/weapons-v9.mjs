// V9 arsenal. Activated explicitly by a mission; the verified V8 campaign stays unchanged.
export const WEAPONS_V9=Object.freeze(Object.fromEntries(Object.entries({
 'c9':{name:'C-9',damage:1,range:310,magazine:12,reload:1.1,cooldown:.4,burst:1,pellets:1,spread:0,pierce:1,chain:0},
 'vx9':{name:'VX-9',damage:.65,range:340,magazine:24,reload:1.4,cooldown:.48,burst:3,pellets:1,spread:0,pierce:1,chain:0},
 'r12':{name:'R-12',damage:.65,range:195,magazine:6,reload:1.6,cooldown:.8,burst:1,pellets:5,spread:.16,pierce:1,chain:0},
 'h17':{name:'H-17 Needle',damage:3,range:500,magazine:4,reload:1.8,cooldown:.9,burst:1,pellets:1,spread:0,pierce:2,chain:0},
 'arc7':{name:'ARC-7 Choir',damage:1.3,range:320,magazine:8,reload:1.5,cooldown:.65,burst:1,pellets:1,spread:0,pierce:1,chain:2,chainRange:125,stun:.65}
}).map(([id,w])=>[id,Object.freeze({id,...w})])));
export const WEAPON_KITS_V9=Object.freeze({nox:Object.freeze(['c9','vx9','h17']),lulu:Object.freeze(['c9','r12','arc7'])});
export const WEAPON_REWARDS_V9=Object.freeze(['tessa','anchor_component','vega_component','eden_technology']);
export function unlockedWeaponsV9(hero,rewards=[]){
 if(!WEAPON_KITS_V9[hero])throw Error('Unknown protagonist');
 return WEAPON_KITS_V9[hero].filter(id=>id==='c9'||(['vx9','r12'].includes(id)&&rewards.includes('tessa'))||(id==='h17'&&['anchor_component','vega_component'].every(r=>rewards.includes(r)))||(id==='arc7'&&rewards.includes('eden_technology')));
}
export function createArsenalV9(hero,rewards=[]){
 const earned=[...new Set(rewards)].filter(r=>WEAPON_REWARDS_V9.includes(r));
 return {version:1,hero,rewards:earned,active:'c9',ammo:Object.fromEntries(unlockedWeaponsV9(hero,earned).map(id=>[id,WEAPONS_V9[id].magazine])),cooldown:0,reloadRemaining:0};
}
export function grantWeaponRewardV9(a,reward){
 if(!WEAPON_REWARDS_V9.includes(reward)||a.rewards.includes(reward))return [];
 a.rewards.push(reward);const unlocked=unlockedWeaponsV9(a.hero,a.rewards).filter(id=>!(id in a.ammo));
 for(const id of unlocked)a.ammo[id]=WEAPONS_V9[id].magazine;return unlocked;
}
export function switchWeaponV9(a,id){
 if(a.reloadRemaining>0||a.cooldown>0)return false;
 const kit=unlockedWeaponsV9(a.hero,a.rewards),next=id??kit[(kit.indexOf(a.active)+1)%kit.length];
 if(!kit.includes(next)||next===a.active)return false;a.active=next;a.cooldown=.18;return true;
}
export function reloadWeaponV9(a){
 const w=WEAPONS_V9[a.active];if(a.reloadRemaining>0||a.ammo[a.active]===w.magazine)return false;
 a.reloadRemaining=w.reload;return true;
}
export function tickArsenalV9(a,dt){
 if(!Number.isFinite(dt)||dt<0)return;
 a.cooldown=Math.max(0,a.cooldown-dt);
 if(a.reloadRemaining>0){a.reloadRemaining=Math.max(0,a.reloadRemaining-dt);if(a.reloadRemaining===0)a.ammo[a.active]=WEAPONS_V9[a.active].magazine;}
}
export function fireWeaponV9(a){
 if(a.cooldown>0||a.reloadRemaining>0)return null;
 const w=WEAPONS_V9[a.active];if(a.ammo[a.active]===0){reloadWeaponV9(a);return null;}
 const burst=Math.min(w.burst,a.ammo[a.active]);a.ammo[a.active]-=burst;a.cooldown=w.cooldown;
 return {...w,burst};
}
export function saveArsenalV9(a){return JSON.stringify(a);}
export function loadArsenalV9(raw){try{
 const a=JSON.parse(raw);if(a.version!==1||!WEAPON_KITS_V9[a.hero]||!Array.isArray(a.rewards)||a.rewards.some(r=>!WEAPON_REWARDS_V9.includes(r))||new Set(a.rewards).size!==a.rewards.length)return null;
 const kit=unlockedWeaponsV9(a.hero,a.rewards);if(!kit.includes(a.active)||!a.ammo||Object.keys(a.ammo).length!==kit.length)return null;
 for(const id of kit)if(!Number.isInteger(a.ammo[id])||a.ammo[id]<0||a.ammo[id]>WEAPONS_V9[id].magazine)return null;
 for(const [field,max] of [['cooldown',WEAPONS_V9[a.active].cooldown],['reloadRemaining',WEAPONS_V9[a.active].reload]])if(!Number.isFinite(a[field])||a[field]<0||a[field]>max)return null;
 return {version:1,hero:a.hero,rewards:[...a.rewards],active:a.active,ammo:{...a.ammo},cooldown:a.cooldown,reloadRemaining:a.reloadRemaining};
}catch{return null;}}

// Rewards are scalar stable narrative IDs; granting them never refills a live arsenal.
export function deliverFieldKitV9(progress,write=()=>true){
 const f=progress.narrative.flags;
 if(f['weapon.tessa']===true||f['encounter.rook.completed']!==true||!['workshop','shelter'].includes(progress.cityChoice))return false;
 const ids=['weapon.quickdraw.component','weapon.tessa','weapon.quickdraw','weapon.active.nox','weapon.active.lulu'];const before=Object.fromEntries(ids.map(id=>[id,f[id]]));
 f['weapon.quickdraw.component']=true;f['weapon.tessa']=true;f['weapon.quickdraw']=true;f['weapon.active.nox']='c9';f['weapon.active.lulu']='c9';
 let ok=false;try{ok=write()===true;}catch{}
 if(!ok){for(const id of ids)if(before[id]===undefined)delete f[id];else f[id]=before[id];return false;}return true;
}
export function campaignArsenalV9(mission,flags){
 if(mission.id==='blackout'||flags['weapon.tessa']!==true)return mission;
 mission.combatV9=true;mission.weaponRewards=['tessa',...(flags['weapon.anchor_component']===true?['anchor_component']:[]),...(flags['weapon.vega_component']===true?['vega_component']:[]),...(flags['weapon.eden_technology']===true?['eden_technology']:[])];mission.quickdraw=flags['weapon.quickdraw']===true;
 mission.weaponSelection=flags['weapon.active.'+mission.pov]||'c9';return mission;
}
