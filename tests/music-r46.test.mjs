// R46 (D91): «indagine più logiche ed immersive per la musica del gioco e diverse varietà in situazioni diverse».
// The music follows the game: pieces carry on instead of restarting, boss phases move to their section, sneaking
// keeps the stage piece until the alarm, the score closes when the hero is nearly down, moments and endings have
// their own piece.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {SCORE_MAP,MUSIC_RESUME,PHASE_MUSIC,MOMENT_MUSIC,ENDING_MUSIC} from '../game/score-map.mjs';
import {AudioDirector,resumeAt} from '../game/audio-engine.mjs';
import {ENDINGS} from '../game/bond.mjs';
import {CHOICES} from '../game/story-v08.mjs';
const rt=fs.readFileSync('game/runtime.mjs','utf8');

function director(){
 const param=()=>({value:0,cancelScheduledValues(){},setValueAtTime(){},setValueCurveAtTime(){},setTargetAtTime(v){this.value=v;}});
 const node=()=>({gain:param(),frequency:param(),connect(){},disconnect(){}}),made=[];
 const context={currentTime:0,createGain:node,createMediaElementSource:()=>node()};
 const d=new AudioDirector({context,mediaFactory:src=>{const m={src,paused:true,currentTime:0,duration:120,pause(){this.paused=true;},load(){},removeAttribute(){},play(){this.paused=false;return Promise.resolve();}};made.push(m);return m;}});
 d.ready=true;d.unlocked=true;d.music=node();d.tone=node();return {d,made,context};
}
const tick=()=>new Promise(r=>setImmediate(r));

test('the score map matches the score files: tempo, length and every section, in 4/4',()=>{
 for(const [piece,m] of Object.entries(SCORE_MAP)){const f=JSON.parse(fs.readFileSync(`assets/production/r38/audio/${piece}-score.json`,'utf8'));
  assert.equal(f.meter,4,piece);assert.equal(m.bpm,f.bpm,piece);assert.equal(m.bars,f.bars,piece);assert.deepEqual(m.sections,Object.fromEntries(f.sections.map(([n,b])=>[n,b])),piece);}
 assert.equal(Object.keys(SCORE_MAP).length,fs.readdirSync('game/audio/v11').filter(f=>f.endsWith('.ogg')).length,'every piece of the score is mapped');
});

test('a piece picks up at the start of the four-bar phrase it was in, and from the top when the end is near',()=>{
 const nox=SCORE_MAP.nox,phrase=960/nox.bpm;// 9.6 s
 assert.equal(resumeAt(nox,0),0);assert.equal(resumeAt(nox,undefined),0);
 assert.equal(resumeAt(nox,25),2*phrase);assert.equal(resumeAt(nox,nox.bars*240/nox.bpm-3),0,'too close to the loop point: start over');
});

test('exploring, fighting and exploring again: the stage piece carries on, story pieces keep their opening',async()=>{
 const {d,made}=director();
 d.setCue('blackout');await tick();made[0].currentTime=50;// nox, 50 s in
 d.setCue('danger');await tick();d.disposeTrack(d.tracks.shift());// the old stream retires: its position is remembered
 assert.equal(d.memory.nox,50);
 d.setCue('zero');await tick();assert.equal(made[2].src,'audio/v11/nox.ogg');assert.equal(made[2].currentTime,resumeAt(SCORE_MAP.nox,50),'back to the phrase it was in, not to bar one');
 d.memory.title=40;d.setCue('title_theme');await tick();assert.equal(made.at(-1).currentTime,0,'the title theme always opens');
 for(const p of MUSIC_RESUME)assert.ok(SCORE_MAP[p],p);for(const p of ['title','promise','reunion','boss','archon','vega','race'])assert.ok(!MUSIC_RESUME.includes(p),p);
});

test('a boss phase moves the piece to its section and loops from there, never back to the calm opening',async()=>{
 const {d,made}=director();
 d.setCue('anchor_fight_loop');await tick();assert.equal(made.length,1);
 assert.equal(d.phase(1),true);await tick();assert.equal(made.length,2,'same piece, new stream at the section');
 const at=32*240/132;assert.equal(made[1].currentTime,at);assert.equal(d.tracks.at(-1).loopFrom,at);
 d.setCue('anchor_fight_loop');assert.equal(made.length,2,'the half-second refresh does not restart it');
 made[1].currentTime=made[1].duration-.02;d.update();assert.equal(made[1].currentTime,at,'the end loops to the phase section');
 d.phase(2);await tick();assert.equal(made.at(-1).currentTime,40*240/132);
 for(const [piece,names] of Object.entries(PHASE_MUSIC))for(const n of names)assert.ok(SCORE_MAP[piece].sections[n]!=null,piece+' '+n);
 d.setCue('refuge_theme');await tick();assert.equal(d.phase(1),false,'pieces without phases ignore it');
 assert.match(rt,/else if\(e\.type==='bossPhase'\)\{audioDirector\.phase\(e\.phase\);/);
});

test('nearly down, the score closes to a muffled tone; back on your feet it opens again',()=>{
 const {d}=director();d.context.currentTime=1;
 d.peril(true);assert.equal(d.tone.frequency.value,1200);assert.equal(d.status().peril,true);
 d.peril(false);assert.equal(d.tone.frequency.value,22000);
 assert.match(rt,/audioDirector\.peril\(state\.hp>0&&state\.hp<=Math\.ceil\(state\.maxHp\*\.3\)\);/);
 assert.match(fs.readFileSync('game/audio-engine.mjs','utf8'),/this\.music\.connect\(this\.tone\);this\.tone\.connect\(this\.master\);/);
});

test('sneaking unseen keeps the stage piece; the battle music starts with the alarm, not with a patrol walking by',()=>{
 assert.match(rt,/const threatened=!\(state\.c\?\.mode==='stealth'&&!state\.alarm\)&&state\.enemies\.some\(/);
});

test('in the bond moments each hears the other; each of the five endings closes on its own piece',()=>{
 assert.deepEqual(MOMENT_MUSIC,{radio_dark:'lulu',chalk_word:'nox'});for(const id of Object.keys(MOMENT_MUSIC))assert.ok(CHOICES[id],id);
 assert.match(rt,/const mm=MOMENT_MUSIC\[id\];if\(mm\)\{audioDirector\.memory\[mm\]=0;soundtrack\(mm\);\}await say\(resolveLines\(STORY\[id\+'_pre'\],flags\(\)\)\);/,'R48: the theme of a moment opens from its first bar');
 assert.match(rt,/if\(mm\)soundtrack\(stageMusic\(CAMPAIGN\[progress\.step\]\)\);\}/);
 assert.deepEqual(Object.keys(ENDING_MUSIC).sort(),ENDINGS.map(e=>e[0]).sort());for(const p of Object.values(ENDING_MUSIC))assert.ok(SCORE_MAP[p],p);
 assert.equal(new Set(Object.values(ENDING_MUSIC)).size,5,'five endings, five pieces');
 assert.match(rt,/soundtrack\(ENDING_MUSIC\[end\]\|\|'reunion'\);/);assert.doesNotMatch(rt.slice(rt.indexOf('function showEnding')),/^[^\n]*soundtrack\('reunion'\)/);
});
