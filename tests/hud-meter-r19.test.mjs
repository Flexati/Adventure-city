import test from 'node:test';import assert from 'node:assert/strict';
import {setVitalMeter} from '../game/hud.mjs';
// R19 characterization: setVitalMeter was only exercised in the browser. A minimal stand-in for the four nodes it touches.
function meter(){
 const node=()=>({style:{},textContent:''}),parts={'[data-meter-fill]':node(),'[data-meter-lag]':node(),output:node(),'[data-meter-label]':node()},classes=new Set(),attrs={};
 return {dataset:{},parts,classes,attrs,querySelector:s=>parts[s],classList:{toggle:(c,on)=>on?classes.add(c):classes.delete(c)},setAttribute:(k,v)=>{attrs[k]=v;}};
}
const wait=ms=>new Promise(r=>setTimeout(r,ms));

test('R19: the first draw fills bar and lag together and writes the accessible values',()=>{
 const m=meter(),model=setVitalMeter(m,8,8,'NOX · VITA');
 assert.equal(model.full,true);assert.equal(m.parts['[data-meter-fill]'].style.width,'100%');assert.equal(m.parts['[data-meter-lag]'].style.width,'100%');
 assert.equal(m.parts.output.textContent,'8 / 8');assert.equal(m.parts['[data-meter-label]'].textContent,'NOX · VITA');
 assert.deepEqual([m.attrs['aria-valuemin'],m.attrs['aria-valuemax'],m.attrs['aria-valuenow']],['0','8','8']);
 assert.equal(m.attrs['aria-label'],'NOX · VITA: 8 su 8');assert.ok(m.classes.has('full'));
});

test('R19: damage moves the bar at once and the lag bar 350 ms later; healing snaps both',async()=>{
 const m=meter();setVitalMeter(m,8,8,'NOX · VITA');setVitalMeter(m,5,8,'NOX · VITA');
 assert.equal(m.parts['[data-meter-fill]'].style.width,'62.5%');assert.equal(m.parts['[data-meter-lag]'].style.width,'100%','lag still shows the lost health');
 await wait(400);assert.equal(m.parts['[data-meter-lag]'].style.width,'62.5%');
 setVitalMeter(m,3,8,'NOX · VITA');setVitalMeter(m,7,8,'NOX · VITA');
 assert.equal(m.parts['[data-meter-lag]'].style.width,'87.5%','healing cancels the pending lag');
 await wait(400);assert.equal(m.parts['[data-meter-lag]'].style.width,'87.5%','the cancelled timer does not fire');
});

test('R19: low and empty states are told by label and class, not by colour alone',()=>{
 const m=meter();setVitalMeter(m,2,8,'NOX · VITA',{immediate:true});
 assert.equal(m.parts['[data-meter-label]'].textContent,'NOX · BASSA');assert.ok(m.classes.has('low'));assert.match(m.attrs['aria-label'],/livello basso$/);
 setVitalMeter(m,0,8,'VORTEX · INTEGRITÀ',{immediate:true});
 assert.equal(m.parts['[data-meter-label]'].textContent,'VORTEX · ZERO');assert.ok(m.classes.has('empty')&&!m.classes.has('low'));
 setVitalMeter(m,6,6,'VORTEX · INTEGRITÀ');assert.equal(m.dataset.max,'6');assert.equal(m.parts['[data-meter-lag]'].style.width,'100%','a new maximum redraws at once');
});
