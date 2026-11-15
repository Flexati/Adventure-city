import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// The recovery panel (#fault-panel) means the simulation state may be inconsistent: lifecycle events must neither
// restart music nor write the save. tools/verify_stability.cjs S5 proves the behaviour in a browser; this pins the guards.
const runtime=fs.readFileSync('game/runtime.mjs','utf8');
const line=name=>{const found=runtime.split('\n').filter(l=>l.startsWith('function '+name+'('));assert.equal(found.length,1,name+' is defined once');return found[0];};

test('suspend does not persist after a fault',()=>{
 assert.match(line('suspend'),/if\(progress&&!faultShown\)persist\(\);/);
});

test('restoreForeground does not restart audio after a fault',()=>{
 const restore=line('restoreForeground');
 assert.match(restore,/if\(settings\.sound&&!paused&&!document\.hidden&&mode!=='boot'&&!faultShown\)audioDirector\.resume\(\);/);
 assert.match(restore,/lifecycleMuted=false;/,'the mute flag is still reset');
});

test('faultShown is declared before any lifecycle event can read it',()=>{
 const declared=runtime.indexOf('let faultShown=false');
 assert.ok(declared>0,'faultShown is declared with let');
 assert.equal(runtime.includes('let faultShown',declared+1),false,'declared once');
 // Event handlers only run after the module has finished evaluating; a top-level await between the listeners and
 // the declaration would open a temporal-dead-zone window.
 const listeners=runtime.indexOf("window.addEventListener('blur',suspend)");
 assert.ok(listeners>0&&listeners<declared,'listeners are registered before the declaration');
 const between=runtime.slice(listeners,declared).split('\n').filter(l=>/^(await |(const|let|var) [^=(]*=\s*await )/.test(l));
 assert.deepEqual(between,[],'no top-level await between listener registration and faultShown');
});

// R5: a mission whose first images or sounds fail to load used to leave mode 'card', running false and no usable button.
// The notice stays; the catch now opens the recovery panel at once. tools/verify_stability.cjs S6 proves startFoot in a browser.
test('startFoot opens the recovery panel when mission assets fail to load',()=>{
 const start=runtime.split('\n').filter(l=>l.startsWith(' try{await prepareDistrict('));
 assert.equal(start.length,1,'startFoot has one asset try');
 assert.ok(start[0].endsWith("catch(e){notice('Risorsa non disponibile: '+e.message);fault(e,'asset',true);return;}"));
});

test('startDrive opens the recovery panel when the driving images fail to load',()=>{
 assert.ok(runtime.includes("async function startDrive(step,first){\n try{await Promise.all([loadImage('driving_cars'),loadImage('driving_road')]);}catch(e){notice('Guida non caricata: '+e.message);fault(e,'asset',true);return;}"));
});

test('startHubRace keeps its playable fallback: back to the hub, no recovery panel',()=>{
 assert.ok(runtime.includes("catch(e){notice('Gara non caricata: '+e.message);running=true;return;}"));
});

// R17: the hold button measures its press with performance.now(), which keeps running in the background. A blur with the finger
// still down used to leave `start` set, so the first frame after the return confirmed the choice by itself. suspend() now calls
// the active press' own release. tools/verify_stability.cjs S7 proves it in a browser; this pins the wiring.
const holdBlock=()=>{const from=runtime.indexOf('function holdButton(');assert.ok(from>0,'holdButton exists');const to=runtime.indexOf('\nfunction knock(',from);assert.ok(to>from,'holdButton ends before knock');return runtime.slice(from,to);};

test('suspend releases the active hold press, and keeps its persist guard',()=>{
 const suspend=line('suspend');
 assert.match(suspend,/cancelHold\?\.\(\);/);
 assert.match(suspend,/if\(progress&&!faultShown\)persist\(\);/,'the fault guard is untouched');
});

test('holdButton registers its own release as the active cancel and clears it when it closes',()=>{
 const hold=holdBlock();
 assert.equal(runtime.split('let cancelHold=null;').length-1,1,'cancelHold is declared once');
 assert.ok(runtime.indexOf('let cancelHold=null;')<runtime.indexOf('function holdButton('),'declared before holdButton');
 assert.match(hold,/const up=\(\)=>\{start=null;cancelAnimationFrame\(raf\);fill\.style\.width='0';\};/,'the release resets start, the frame and the fill');
 assert.match(hold,/b\.onpointerup=b\.onpointerleave=b\.onpointercancel=up;/,'the same release serves the pointer events');
 assert.match(hold,/cancelHold=up;/,'the release is the active cancel');
 assert.match(hold,/const cleanup=\(\)=>\{cancelHold=null;/,'completion clears the active cancel');
});

test('the hold durations are unchanged: 1200 ms terminal, 650 ms right to say no',()=>{
 assert.match(holdBlock(),/function holdButton\(\{kicker,title,text,label,ms=1200\}\)/);
 assert.equal(runtime.split("label:'COLPISCI',ms:650}").length-1,1,'the final consent hold stays 650 ms');
});
