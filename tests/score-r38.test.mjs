// R38 (D74): «La musica è orribile… Ricambiala, alza la qualità». The game plays fifteen original pieces, rendered by
// tools/compose_score_r38.py (deterministic synthesis, no samples, no providers) and checked against Gate 2 of
// docs/gold/PIANO_PLAY_STORE_20261114.md on the encoded file. An agent cannot listen: human approval is still pending.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {CAMPAIGN} from '../game/missions.mjs';
import {DRIVING_MISSIONS} from '../game/driving.mjs';
import {scorePiece,musicalState,MUSIC_GAIN} from '../game/audio-engine.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const PIECES=['title','refuge','nox','lulu','danger','danger_b','drive','race','boss','vega','eve','depths','promise','reunion','archon'];

function cuesOfTheGame(){
 const rt=read('game/runtime.mjs'),racing=read('game/racing-v9.mjs'),cues=new Set();
 for(const s of CAMPAIGN)if(s.music)cues.add(s.music);
 for(const d of Object.values(DRIVING_MISSIONS))if(d.music)cues.add(d.music);
 for(const m of racing.matchAll(/music:'([a-z_0-9]+)'/g))cues.add(m[1]);
 for(const m of rt.matchAll(/soundtrack\('([a-z_0-9]+)'\)/g))cues.add(m[1]);
 for(const m of rt.match(/const BOSS_MUSIC=\{([^}]*)\}/)[1].matchAll(/:'([a-z_0-9]+)'/g))cues.add(m[1]);
 for(const m of rt.match(/const hubCue=\{([^}]*)\}/)[1].matchAll(/:'([a-z_0-9]+)'/g))cues.add(m[1]);
 for(const c of ['lulu','refuge_theme','strangers_rift'])cues.add(c);// soundtrack(pov==='lulu'?'lulu':'refuge_theme'), allies
 for(const args of [{base:'nox'},{base:'lulu'},{base:'nox',tension:1},{base:'nox',tension:1,late:true},{base:'lulu',joined:true}])cues.add(musicalState(args));
 return cues;
}

test('every cue the game can ask for plays an existing piece of the new score',()=>{
 const cues=cuesOfTheGame();assert.ok(cues.size>=30,'cues found: '+cues.size);
 const used=new Set();
 for(const cue of cues){const piece=scorePiece(cue);assert.ok(PIECES.includes(piece),cue+' → '+piece+' is not a piece of the score');used.add(piece);}
 assert.deepEqual([...used].sort(),[...PIECES].sort(),'every piece is used somewhere');
 assert.equal(musicalState({base:'nox',tension:1}),'danger');assert.equal(musicalState({base:'nox',tension:1,late:true}),'danger_b');
 assert.match(read('game/runtime.mjs'),/late:CAMPAIGN\[progress\.step\]\.act>2\}\)/,'Acts III and IV fight to the second battle piece');
 assert.match(read('game/audio-engine.mjs'),/media=this\.mediaFactory\('audio\/v11\/'\+scorePiece\(this\.cue\)\+'\.ogg'\)/);
});

test('R39: two steps in a row never play the same piece (drives read their own music)',()=>{
 let prev=null,prevId=null;const same=[];
 for(const s of CAMPAIGN){const cue=s.type==='drive'?(DRIVING_MISSIONS[s.drive]?.music||s.music):s.music,piece=scorePiece(cue);if(piece===prev)same.push(prevId+'→'+s.id);prev=piece;prevId=s.id;}
 assert.deepEqual(same,[]);
});

test('two cues of the same piece are one stream: the tune does not restart',async()=>{
 const {AudioDirector}=await import('../game/audio-engine.mjs');
 const gain=()=>({gain:{value:0,cancelScheduledValues(){},setValueAtTime(){},setValueCurveAtTime(){}},connect(){},disconnect(){}}),made=[];
 const d=new AudioDirector({context:{currentTime:0,createGain:gain,createMediaElementSource:()=>({connect(){},disconnect(){}})},mediaFactory:src=>{const m={src,paused:true,pause(){},load(){},removeAttribute(){},play(){this.paused=false;return Promise.resolve();}};made.push(m);return m;}});
 d.ready=true;d.music=gain();d.unlocked=true;
 d.setCue('refuge_theme');d.setCue('tessa_workbench');assert.equal(made.length,1,'refuge and Tessa\'s bench share the refuge piece');
 assert.equal(made[0].src,'audio/v11/refuge.ogg');
 d.setCue('danger');assert.equal(made.length,2);assert.equal(made[1].src,'audio/v11/danger.ogg');
});

test('Gate 2 on every encoded piece: loudness, true peak, no clipping, seamless loop, clean harmony; files match their metrics',()=>{
 let bytes=0;
 for(const p of PIECES){
  const m=JSON.parse(read(`assets/production/r38/audio/${p}-metrics.json`)),f=fs.readFileSync(new URL(`../game/audio/v11/${p}.ogg`,import.meta.url));
  assert.equal(crypto.createHash('sha256').update(f).digest('hex'),m.sha256,p+' file differs from its measured render');
  assert.equal(f.subarray(0,4).toString(),'OggS');bytes+=f.length;
  assert.ok(Math.abs(m.integrated_lufs+16)<=1,p+' loudness '+m.integrated_lufs);
  assert.ok(m.true_peak_dbtp<=-1.5,p+' true peak '+m.true_peak_dbtp);
  assert.equal(m.clipped_samples,0,p);assert.equal(m.samples,m.samples_expected,p+' length');
  assert.ok(m.loop_seam_step_db<=-40,p+' loop seam '+m.loop_seam_step_db);
  assert.deepEqual(m.harmony_clashes,[],p+' harmony');assert.deepEqual(m.gate2_problems,[],p);
  assert.equal(m.human_listening,false,'nobody has listened yet: never claim it');assert.equal(m.commercial_ready,false);
  const score=JSON.parse(read(`assets/production/r38/audio/${p}-score.json`));assert.match(score.provenance,/Original, deterministic synthesis/);
 }
 assert.ok(bytes<16*1024*1024,'the whole score stays under 16 MB: '+bytes);
 assert.deepEqual(MUSIC_GAIN,{},'one loudness for all: no per-track correction');
});

test('the score is reproducible from the repo: generator, fixed seeds, bitexact encoding',()=>{
 const gen=read('tools/compose_score_r38.py'),tracks=read('tools/score_r38/tracks.py'),master=read('tools/score_r38/master.py');
 assert.match(gen,/Deterministic: fixed seeds, no samples, no recordings, no providers/);
 assert.match(master,/'-fflags', '\+bitexact', '-flags:a', '\+bitexact'/);
 for(const p of PIECES)assert.match(tracks,new RegExp(`'${p}': dict\\(|'${p}':\\s*\\{|\\b${p}\\b`),p);
});
