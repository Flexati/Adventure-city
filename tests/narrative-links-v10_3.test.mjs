import test from 'node:test';
import assert from 'node:assert/strict';
import {STORY,BARKS,EPILOGUE,resolveLines,veyraEpilogue} from '../game/story-v08.mjs';
import {CAMPAIGN,ACTS} from '../game/missions.mjs';
import {AudioDirector} from '../game/audio-engine.mjs';
import {EN_TEXT} from '../game/locale.mjs';

test('reunion echoes follow the separation flags and Act I-III choices',()=>{
 const t=f=>resolveLines(STORY.reunion_open,f).map(l=>l.text);
 assert.ok(!t({}).includes('I due punti sulle botole. Eri tu.'));
 assert.ok(t({'exp.chalk.completed':true}).includes('I due punti sulle botole. Eri tu.'));
 assert.ok(!t({}).some(x=>x.startsWith('Unità 9')));
 assert.ok(t({unit9_saved:true}).some(x=>x.startsWith('Unità 9')));
 assert.ok(t({blackout_choice:'workshop'}).includes('Al rifugio le tue lampade sono rimaste accese tutta la notte.'));
 assert.ok(t({blackout_choice:'shelter'}).includes('All’officina Dario ha tenuto il cancello anche senza corrente.'));
 assert.ok(t({eve_kept:true}).includes('Nell’Archivio ho tolto le mani a EVE-Prime. Ma le ho lasciato la memoria.'));
 assert.ok(t({eve_kept:false}).includes('Nell’Archivio ho lasciato che EVE-Prime si spegnesse. Adesso ci sono solo io.'));
 assert.ok(t({strangers_met:true}).includes('Sulla risalita due stranieri sono usciti da una frattura: uno combatteva a pugni nudi, l’altro con una motosega.'));
 assert.ok(t({line_choice:'stay'}).includes('Sulla linea sono rimasta finché è partito l’ultimo autobus.'));
 assert.ok(t({line_choice:'go'}).includes('Sulla linea Ines ha preso gli ultimi. Sono corsa qui prima che chiudessero l’Asse.'));
 assert.equal(t({}).at(-1),'Posso venire con te?');
});

test('chronicle is balanced across 4 distinct acts and epilogue reflects chalk route, line choice, and the two strangers',()=>{
 assert.deepEqual(Object.keys(ACTS),['1','2','3','4']);
 assert.equal(ACTS[4],'ATTO IV · ORA UNO');
 assert.ok(Object.hasOwn(EN_TEXT,ACTS[4]));
 const actCounts=[1,2,3,4].map(a=>CAMPAIGN.filter(s=>s.act===a).length);
 assert.deepEqual(actCounts,[6,12,19,7]);
 const epService=EPILOGUE.map(fn=>fn({'exp.chalk.route':'service',line_choice:'stay',strangers_met:true}));
 const epDirect=EPILOGUE.map(fn=>fn({'exp.chalk.route':'direct',line_choice:'go'}));
 assert.ok(epService[1].includes('rotta riparata'));
 assert.ok(epDirect[1].includes('passaggio diretto'));
 assert.ok(epService[4].includes('Ines guida i convogli'));
 assert.ok(epService[5].includes('pugni di Kairn e della motosega di Morrow'));
 for(const line of [...epService,...epDirect])assert.ok(Object.hasOwn(EN_TEXT,line),line);
});

test('audio ambience spawns zero continuous sine hum or white-noise drone loops on city, port and drive',()=>{
 let oscCount=0;
 const ctx={currentTime:0,sampleRate:44100,destination:{},createGain:()=>({gain:{value:1,cancelScheduledValues(){},setTargetAtTime(){}},connect(){},disconnect(){}}),createBiquadFilter:()=>({frequency:{value:0},Q:{value:0},connect(){},disconnect(){}}),createDynamicsCompressor:()=>({threshold:{},knee:{},ratio:{},attack:{},release:{},connect(){}}),createConvolver:()=>({connect(){}}),createBuffer:()=>({getChannelData:()=>new Float32Array(64)}),createOscillator:()=>{oscCount++;return {frequency:{value:0},connect(){},start(){},stop(){},disconnect(){}};}};
 const d=new AudioDirector({context:ctx});d.init();
 for(const kind of ['city','port','drive','dark']){d.setAmbience(kind);assert.equal(d.ambientNodes.length,0,kind);assert.equal(oscCount,0,kind);}
});

test('R5 landscape road scale widens the 720px road to 52% of 844x390 while keeping portrait unchanged',async()=>{
 const fs=await import('node:fs');
 const rt=fs.readFileSync('game/runtime.mjs','utf8');
 assert.equal((rt.match(/Math\.min\(w\/720,h\/\(w>h\?640:1050\)\)/g)||[]).length,2);
 const w=844,h=390,scale=Math.min(w/720,h/(w>h?640:1050));
 assert.ok(720*scale/w>0.51,'landscape road occupies >51% of viewport width');
});

test('boss entrance lines exist for Rook, The Anchor and the Custode',()=>{
 assert.equal(BARKS.blackout.bossWake.speaker,'ROOK');
 assert.equal(BARKS.breach.bossWake.speaker,'THE ANCHOR');
 assert.equal(BARKS.zero.bossWake.speaker,'CUSTODE');
 assert.match(BARKS.zero.bossWakeb.text,/EVE-47/);
});

test('Veyra epilogue reads only observed race results',()=>{
 const lines=[veyraEpilogue(null),veyraEpilogue({events:{a:{completed:true,won:true}}}),veyraEpilogue({events:{a:{completed:true,won:false}}}),veyraEpilogue({events:{},modes:{tt:{}}})];
 assert.equal(new Set(lines).size,4);
 assert.match(lines[0],/Forse basta/);
 for(const l of lines)assert.ok(Object.hasOwn(EN_TEXT,l),l);
});

test('promise choices echo at the clinic and at the reunion, with English text',()=>{
 const t=(id,f)=>resolveLines(STORY[id],f).map(l=>l.text);
 const clinic=['blind','evasive','honest'].map(v=>t('clinic_auth',{promise_trust:v}).at(-1));
 assert.equal(new Set(clinic).size,3);
 assert.equal(t('clinic_auth',{}).at(-1),'Nox combatte dall’altra parte. Non può sentirmi.');
 assert.ok(t('reunion_open',{promise_accept:true}).includes('Ti avevo promesso niente trasmissioni. L’ho rotta io.'));
 assert.ok(t('reunion_open',{promise_accept:false}).includes('Mi avevi chiesto di chiedertelo. Non ho trovato il tempo.'));
 for(const f of [{promise_trust:'blind',promise_accept:true},{promise_trust:'evasive',promise_accept:false},{promise_trust:'honest'}])
  for(const id of ['clinic_auth','reunion_open'])for(const x of t(id,f))assert.ok(Object.hasOwn(EN_TEXT,x),x);
 for(const id of ['promise_repair','promise_ask','promise_offer','promise_blind','promise_evasive','promise_honest','promise_yes','promise_no'])for(const x of t(id,{}))assert.ok(Object.hasOwn(EN_TEXT,x),x);
});
