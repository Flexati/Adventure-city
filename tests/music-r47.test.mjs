// R47 (D92): Argon's first adaptive family (vanta_est, prompt v5 N0) in the game. Three full versions of one piece — calm, alert,
// fight — swap at the same point of the piece in Cantiere Est and Old Town; the cup moment sits on Argon's painted refuge night.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {FAMILIES,INTENSITIES,STAGE_FAMILY,familyOf,pieceMap,stageMusic} from '../game/score-map.mjs';
import {AudioDirector,musicSrc,familyIntensity,resumeAt} from '../game/audio-engine.mjs';
import {CAMPAIGN} from '../game/missions.mjs';
const rt=fs.readFileSync('game/runtime.mjs','utf8');

function director(){
 const param=()=>({value:0,cancelScheduledValues(){},setValueAtTime(){},setValueCurveAtTime(){},setTargetAtTime(v){this.value=v;}});
 const node=()=>({gain:param(),frequency:param(),connect(){},disconnect(){}}),made=[];
 const context={currentTime:0,createGain:node,createMediaElementSource:()=>node()};
 const d=new AudioDirector({context,mediaFactory:src=>{const m={src,paused:true,currentTime:0,duration:103.53,pause(){this.paused=true;},load(){},removeAttribute(){},play(){this.paused=false;return Promise.resolve();}};made.push(m);return m;}});
 d.ready=true;d.unlocked=true;d.music=node();d.tone=node();return {d,made};
}
const tick=()=>new Promise(r=>setImmediate(r));

test('the three versions of each family are in the game, the same length, and match their score files',()=>{
 const reg=JSON.parse(fs.readFileSync('assets/production/r47/REGISTRO.json','utf8'));
 for(const [fam,m] of Object.entries(FAMILIES))for(const v of INTENSITIES){const p=fam+'_'+v,f=JSON.parse(fs.readFileSync(`assets/production/r47/audio/${p}-score.json`,'utf8'));
  assert.equal(f.meter,4,p);assert.equal(f.bpm,m.bpm,p);assert.equal(f.bars,m.bars,p);assert.deepEqual(m.sections,Object.fromEntries(f.sections.map(([n,b])=>[n,b])),p);
  const ogg=fs.readFileSync('game/audio/'+musicSrc(p).slice(6));assert.ok(ogg.length>500000,p);assert.equal(ogg.subarray(0,4).toString(),'OggS',p);
  const metrics=JSON.parse(fs.readFileSync(`assets/production/r47/audio/${p}-metrics.json`,'utf8'));assert.equal(metrics.samples,metrics.samples_expected,p);
  assert.ok(reg.file.some(r=>r.path==='game/audio/v12/'+p+'.ogg'&&r.bytes===ogg.length),p+' registered');}
 const lengths=INTENSITIES.map(v=>JSON.parse(fs.readFileSync(`assets/production/r47/audio/vanta_est_${v}-metrics.json`,'utf8')).samples);assert.equal(new Set(lengths).size,1,'same length to the sample');
 assert.match(fs.readFileSync('tools/prepare_android_assets.py','utf8'),/SCORE_V12=\('vanta_est_calma','vanta_est_allerta','vanta_est_scontro'\)/);
});

test('which version plays: calm at rest, alert near a threat or just after, fight while enemies wind up or strike',()=>{
 assert.equal(familyIntensity({quietFor:10}),'calma');assert.equal(familyIntensity({threatened:true,quietFor:0}),'allerta');
 assert.equal(familyIntensity({quietFor:3}),'allerta','a threat 3 s ago still keeps the alert');assert.equal(familyIntensity({fight:true,threatened:true}),'scontro');
 assert.equal(familyOf('vanta_est_scontro'),'vanta_est');assert.equal(familyOf('nox'),null);assert.equal(familyOf('porto_calma'),null,'a family not delivered yet is not a family');
 assert.equal(musicSrc('vanta_est_calma'),'audio/v12/vanta_est_calma.ogg');assert.equal(musicSrc('nox'),'audio/v11/nox.ogg');
 for(const id of Object.keys(STAGE_FAMILY)){const s=CAMPAIGN.find(x=>x.id===id);assert.equal(s?.type,'foot',id);assert.equal(stageMusic(s),STAGE_FAMILY[id]+'_calma');}
 assert.equal(stageMusic(CAMPAIGN.find(x=>x.id==='below')),'below_descent','other stages keep their piece');
 assert.match(rt,/const cue=family\?family\+'_'\+familyIntensity\(\{fight:musicFight>0,threatened,quietFor:musicQuiet\}\):musicalState\(/);
 assert.match(rt,/if\(state\.alarm\|\|state\.enemies\.some\(e=>e\.hp>0&&\(e\.state==='warn'\|\|e\.state==='charge'\)\)\)musicFight=6;else musicFight=Math\.max\(0,musicFight-dt\);/);
 assert.match(rt,/soundtrack\(stageMusic\(step\)\)/,'the stage opens on its family at rest, not on the old piece for half a second');
});

test('a swap inside a family starts where the playing version is, and fades in 1.2 s instead of 2.2',async()=>{
 const {d,made}=director();
 d.setCue('vanta_est_calma');await tick();assert.equal(made[0].src,'audio/v12/vanta_est_calma.ogg');made[0].currentTime=37.4;
 d.setCue('vanta_est_scontro');assert.equal(made[1].src,'audio/v12/vanta_est_scontro.ogg');assert.equal(made[1].currentTime,37.4,'same point of the piece');
 made[0].currentTime=37.6;await tick();assert.equal(made[1].currentTime,37.6,'catches up with the version it replaces once it starts');
 assert.equal(d.tracks.at(-1).fadeUntil,1.2);
 d.setCue('nox');await tick();assert.equal(made[2].currentTime,0,'leaving the family: an R38 piece is not aligned to it');
});

test('coming back to the family later picks up its phrase, whichever version was playing',async()=>{
 const {d,made}=director();
 d.setCue('vanta_est_allerta');await tick();made[0].currentTime=50;d.setCue('boss');await tick();d.disposeTrack(d.tracks.shift());
 assert.equal(d.memory.vanta_est,50);
 d.setCue('vanta_est_calma');await tick();assert.equal(made.at(-1).currentTime,resumeAt(pieceMap('vanta_est_calma'),50));
});

test('the cup moment sits on Argon’s painted night at the refuge, with the steaming cup when the screen is tall',()=>{
 const css=fs.readFileSync('game/style.css','utf8');
 assert.match(css,/#choice\[data-choice-id=home_cup\]\{background:linear-gradient\([^)]*\),url\('art\/moments\/moment_home_cup\.webp'\) center\/cover no-repeat/);
 assert.match(css,/@media \(min-height:700px\)\{#choice\[data-choice-id=home_cup\]>\.card::before\{[^}]*url\('art\/moments\/detail_cup_steam\.webp'\)/);
 for(const f of ['moment_home_cup','detail_cup_steam']){const b=fs.readFileSync(`game/art/moments/${f}.webp`);assert.equal(b.subarray(8,12).toString(),'WEBP',f);}
 assert.match(fs.readFileSync('tools/prepare_android_assets.py','utf8'),/for source in \(GAME\/'art\/moments'\)\.glob\('\*\.webp'\)/);
});
