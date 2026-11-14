// V9/V11 arsenal and hero progression moves. Activated explicitly by a mission; the verified V8 campaign stays unchanged.
import {MARKET_WEAPONS,HERO_MOVES} from './arsenal-data.mjs';
export {MARKET_WEAPONS,HERO_MOVES};
// R28 (D72): the pose nearest to the angle of the shot (rows of the gun sheets: 0 side, 1 up, 2 down, 3 up-diagonal at
// about -33 degrees), and where its barrel is: the centre of the painted flash on the release frame, measured on the
// sheets by tools/measure_muzzles_r28.py, in world pixels from the feet, facing right (mirrored when dir.x<0).
export const gunRowV9=d=>d.y>.707?2:d.y<-.879?1:d.y<-.284?3:0;
export const MUZZLE_V9=Object.freeze({nox:[[42,-66],[0,-96],[1,-23],[34,-87]],lulu:[[37,-68],[0,-99],[-4,-23],[41,-95]],nox_vx9:[[50,-67],[0,-97],[1,-20],[44,-88]],lulu_r12:[[42,-69],[1,-101],[-4,-21],[43,-95]]});
export function muzzleV9(hero,weapon,d){const m=MUZZLE_V9[hero==='nox'&&(weapon==='vx9'||weapon==='h17')?'nox_vx9':hero==='lulu'&&(weapon==='r12'||weapon==='arc7')?'lulu_r12':hero==='lulu'?'lulu':'nox'][gunRowV9(d)];return {x:d.x<0?-m[0]:m[0],y:m[1]};}
// The drawn body of a foe (height and width in world pixels, standing on its feet), for a manual aim and the bullet's end.
export function foeBodyV9(e){const k=e.bossKind;return e.boss?{h:k==='vega'?130:k==='mirror'?96:k==='rook'?118:k==='anchor'?150:160,w:k==='anchor'?160:k==='mirror'||k==='rook'?50:76}:e.role==='brute'?{h:92,w:50}:{h:72,w:40};}
export const WEAPONS_V9=Object.freeze(Object.fromEntries(Object.entries({
 'c9':{name:'C-9',damage:1,range:310,magazine:12,reload:1.1,cooldown:.4,burst:1,pellets:1,spread:0,pierce:1,chain:0},
 'vx9':{name:'VX-9',damage:.65,range:340,magazine:24,reload:1.4,cooldown:.48,burst:3,pellets:1,spread:0,pierce:1,chain:0},
 'r12':{name:'R-12',damage:.65,range:195,magazine:6,reload:1.6,cooldown:.8,burst:1,pellets:5,spread:.16,pierce:1,chain:0},
 'h17':{name:'H-17 Needle',damage:3,range:500,magazine:4,reload:1.8,cooldown:.9,burst:1,pellets:1,spread:0,pierce:2,chain:0},
 'arc7':{name:'ARC-7 Choir',damage:1.3,range:320,magazine:8,reload:1.5,cooldown:.65,burst:1,pellets:1,spread:0,pierce:1,chain:2,chainRange:125,stun:.65},
 ...MARKET_WEAPONS
}).map(([id,w])=>[id,Object.freeze({id,...w})])));
export const MARKET_WEAPON_IDS=Object.freeze(Object.keys(MARKET_WEAPONS));
export const WEAPON_KITS_V9=Object.freeze({nox:Object.freeze(['c9','vx9','h17']),lulu:Object.freeze(['c9','r12','arc7'])});
export const WEAPON_REWARDS_V9=Object.freeze(['tessa','anchor_component','vega_component','eden_technology']);
export function unlockedWeaponsV9(hero,rewards=[],market=[]){
 if(!WEAPON_KITS_V9[hero])throw Error('Unknown protagonist');
 const base=WEAPON_KITS_V9[hero].filter(id=>id==='c9'||(['vx9','r12'].includes(id)&&rewards.includes('tessa'))||(id==='h17'&&['anchor_component','vega_component'].every(r=>rewards.includes(r)))||(id==='arc7'&&rewards.includes('eden_technology')));
 const extra=(market||[]).filter(id=>MARKET_WEAPON_IDS.includes(id)&&!base.includes(id));
 return [...base,...extra];
}
export function maxMagV11(a,id){return WEAPONS_V9[id].magazine+(a?.magBonus||0);}
export function createArsenalV9(hero,rewards=[],market=[],magBonus=0){
 const earned=[...new Set(rewards)].filter(r=>WEAPON_REWARDS_V9.includes(r));
 const owned=[...new Set(market||[])].filter(id=>MARKET_WEAPON_IDS.includes(id));
 const kit=unlockedWeaponsV9(hero,earned,owned);
 const a={version:1,hero,rewards:earned,active:'c9',ammo:Object.fromEntries(kit.map(id=>[id,WEAPONS_V9[id].magazine+(magBonus|0)])),cooldown:0,reloadRemaining:0};
 if(owned.length)a.market=owned;if(magBonus>0)a.magBonus=magBonus|0;return a;
}
export function grantWeaponRewardV9(a,reward){
 if(!WEAPON_REWARDS_V9.includes(reward)||a.rewards.includes(reward))return [];
 a.rewards.push(reward);const unlocked=unlockedWeaponsV9(a.hero,a.rewards,a.market||[]).filter(id=>!(id in a.ammo));
 for(const id of unlocked)a.ammo[id]=maxMagV11(a,id);return unlocked;
}
export function switchWeaponV9(a,id){
 if(a.reloadRemaining>0||a.cooldown>0)return false;
 const kit=unlockedWeaponsV9(a.hero,a.rewards,a.market||[]),next=id??kit[(kit.indexOf(a.active)+1)%kit.length];
 if(!kit.includes(next)||next===a.active)return false;a.active=next;a.cooldown=.18;return true;
}
export function reloadWeaponV9(a){
 const max=maxMagV11(a,a.active);if(a.reloadRemaining>0||a.ammo[a.active]===max)return false;
 a.reloadRemaining=WEAPONS_V9[a.active].reload;return true;
}
export function tickArsenalV9(a,dt){
 if(!Number.isFinite(dt)||dt<0)return;
 a.cooldown=Math.max(0,a.cooldown-dt);
 if(a.reloadRemaining>0){a.reloadRemaining=Math.max(0,a.reloadRemaining-dt);if(a.reloadRemaining===0)a.ammo[a.active]=maxMagV11(a,a.active);}
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
 if(a.market!==undefined&&(!Array.isArray(a.market)||a.market.some(id=>!MARKET_WEAPON_IDS.includes(id))||new Set(a.market).size!==a.market.length))return null;
 if(a.magBonus!==undefined&&(!Number.isInteger(a.magBonus)||a.magBonus<0||a.magBonus>12))return null;
 const kit=unlockedWeaponsV9(a.hero,a.rewards,a.market||[]);if(!kit.includes(a.active)||!a.ammo||Object.keys(a.ammo).length!==kit.length)return null;
 for(const id of kit)if(!Number.isInteger(a.ammo[id])||a.ammo[id]<0||a.ammo[id]>maxMagV11(a,id))return null;
 for(const [field,max] of [['cooldown',WEAPONS_V9[a.active].cooldown],['reloadRemaining',WEAPONS_V9[a.active].reload]])if(!Number.isFinite(a[field])||a[field]<0||a[field]>max)return null;
 const out={version:1,hero:a.hero,rewards:[...a.rewards],active:a.active,ammo:{...a.ammo},cooldown:a.cooldown,reloadRemaining:a.reloadRemaining};
 if(a.market)out.market=[...a.market];if(a.magBonus)out.magBonus=a.magBonus;return out;
}catch{return null;}}

export function unlockedMovesV11(hero,act=1,flags={}){
 const list=HERO_MOVES[hero];if(!list)return [];
 return list.filter(m=>m.act<=act||flags['move.unlock.'+m.id]===true).map(m=>m.id);
}
export function moveDefV11(id){return HERO_MOVES.nox.find(m=>m.id===id)||HERO_MOVES.lulu.find(m=>m.id===id)||null;}

// Rewards are scalar stable narrative IDs; granting them never refills a live arsenal.
export function deliverFieldKitV9(progress,write=()=>true){
 const f=progress.narrative.flags;
 if(f['weapon.tessa']===true||f['encounter.rook.completed']!==true||!['workshop','shelter'].includes(progress.cityChoice))return false;
 const ids=['weapon.quickdraw.component','weapon.tessa','weapon.quickdraw','weapon.active.nox','weapon.active.lulu'];const before=Object.fromEntries(ids.map(id=>[id,f[id]]));
 f['weapon.quickdraw.component']=true;f['weapon.tessa']=true;f['weapon.quickdraw']=true;f['weapon.active.nox']='c9';f['weapon.active.lulu']='c9';
 let ok=false;try{ok=write()===true;}catch{}
 if(!ok){for(const id of ids)if(before[id]===undefined)delete f[id];else f[id]=before[id];return false;}return true;
}
export function campaignArsenalV9(mission,flags,market=[]){
 if(mission.id==='blackout'||(flags['weapon.tessa']!==true&&!market.length))return mission;
 mission.combatV9=true;mission.weaponRewards=[...(flags['weapon.tessa']===true?['tessa']:[]),...(flags['weapon.anchor_component']===true?['anchor_component']:[]),...(flags['weapon.vega_component']===true?['vega_component']:[]),...(flags['weapon.eden_technology']===true?['eden_technology']:[])];mission.quickdraw=flags['weapon.quickdraw']===true;
 if(market.length)mission.marketWeapons=[...market];
 mission.weaponSelection=flags['weapon.active.'+mission.pov]||mission.equippedWeapon||'c9';return mission;
}
