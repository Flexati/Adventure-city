import test from 'node:test';import assert from 'node:assert/strict';
import {HUB_RACES,nextHubRace,claimHubRace,hubPoints,validateWorld,newWorld} from '../game/hubs.mjs';
import {newRaceV9,tickRaceV9,racePilot,RACE_SERIES_V9} from '../game/racing-v9.mjs';
import {newProgress,saveProgress,loadProgress,stepIndex} from '../game/missions.mjs';
// Drive the player with the same pilot rules as the rivals until the race ends.
function finished(id){const s=newRaceV9(id);for(let i=0;i<20000&&!['finished','retired'].includes(s.status);i++)tickRaceV9(s,racePilot(s,s.cars[0]),1/30);return s;}

test('only the three Ash Docks races are reachable in Vanta, in series order, while following Nox',()=>{
 assert.deepEqual(HUB_RACES,RACE_SERIES_V9.slice(0,3));const p=newProgress();
 assert.equal(nextHubRace(p,'nox'),'ash_docks');assert.equal(nextHubRace(p,'lulu'),null,'Ash never presumes Lulù on board');
 p.world.hub={id:'moon',reason:'campaign',pov:'nox',returnStep:4,x:800,y:864};assert.equal(hubPoints('moon',p).find(x=>x.kind==='race').race,'ash_docks');
 p.world.hub.pov='lulu';assert.equal(hubPoints('moon',p).some(x=>x.kind==='race'),false);assert.equal(hubPoints('moon').some(x=>x.kind==='race'),false);
});

test('completing pays once, winning pays once more, and replays never farm coins',()=>{
 const p=newProgress(),s=finished('ash_docks');assert.equal(s.status,'finished');const coins=p.world.coins;
 const first=claimHubRace(p,s);assert.ok([15,25].includes(first.reward));assert.equal(p.world.coins,coins+first.reward);assert.equal(nextHubRace(p,'nox'),'ash_slalom');
 const again=claimHubRace(p,finished('ash_docks'));assert.ok(again.reward<=10);if(first.reward===25)assert.equal(again.reward,0);
 assert.equal(p.world.races.coins,p.world.coins-coins,'record and wallet agree');
 const retired=newRaceV9('ash_slalom');retired.status='retired';assert.equal(claimHubRace(p,retired).reward,0);assert.equal(p.world.races.events.ash_slalom,undefined);
 assert.equal(claimHubRace(p,finished('solkara')).reward,0,'Solkara is outside the campaign graph');assert.equal(p.world.races.events.solkara,undefined);
});

test('race records survive save and reload; older v7 saves without them still load',()=>{
 const p=newProgress();p.step=stepIndex('moon');claimHubRace(p,finished('ash_docks'));
 const back=loadProgress(saveProgress(p));assert.deepEqual(back.world.races,p.world.races);
 const old=newProgress();old.step=stepIndex('moon');const raw=JSON.parse(saveProgress(old));delete raw.world.races;const legacy=loadProgress(JSON.stringify(raw));assert.ok(legacy);assert.equal(nextHubRace(legacy,'nox'),'ash_docks');
 const w=newWorld();assert.equal(validateWorld({...w,races:{version:1,coins:99,events:{}}}),null,'inconsistent coins rejected');
 assert.equal(validateWorld({...w,races:{version:1,coins:15,events:{solkara:{completed:true,won:false,bestTime:90,bestRank:2}}}}),null,'non-campaign race rejected');
});
