// R35: the entrance of a boss that has no devices (Vega). In Chromium (not a phone), with the audio allowed to start:
//   - the notice is in the feminine and does not claim a saved checkpoint;
//   - the saved progress holds NO boss checkpoint (it would let a retry skip the opening waves);
//   - the boss-appearance sound plays once.
// And, as a contrast, Forge Behemoth (it has devices) is not announced at the start.
//   node tools/verify_boss_entrance_r35.cjs http://127.0.0.1:8090/game/      (CHROMIUM=<chrome> if needed)
const {chromium}=require('playwright'),qa=require('./qa_v8.cjs'),assert=require('node:assert/strict');
const [url='http://127.0.0.1:8090/game/']=process.argv.slice(2);
async function open(step,b){const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true}),errs=[];p.on('pageerror',e=>errs.push(e.message));
 await qa.seed(p,url,step);const seen=[];for(let k=0;k<30;k++){await p.waitForTimeout(100);const t=await p.evaluate(()=>{const n=document.getElementById('notice');return n&&n.classList.contains('on')?n.textContent:null;});if(t&&!seen.includes(t))seen.push(t);}
 const state=await p.evaluate(()=>({sound:window.cityAdventure.status().audio.chronoPlayed?.suspense_boss||0,checkpoint:window.cityAdventure.progress().checkpoint}));return {p,errs,seen,...state};}
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--autoplay-policy=no-user-gesture-required']});
 const v=await open('vega',b);console.log('vega',JSON.stringify({notices:v.seen,sound:v.sound,checkpoint:v.checkpoint,errors:v.errs}));
 assert.ok(v.seen.some(t=>/VEGA si è svegliata\.$/.test(t)),'feminine notice');assert.ok(!v.seen.some(t=>/Checkpoint/.test(t)),'no checkpoint claimed');
 assert.notEqual(v.checkpoint,'boss','no boss checkpoint saved at the entrance');assert.equal(v.sound,1,'the boss sound plays once');assert.deepEqual(v.errs,[]);
 const f=await open('forge_behemoth',b);console.log('behemoth',JSON.stringify({notices:f.seen,sound:f.sound,checkpoint:f.checkpoint}));
 assert.equal(f.sound,0,'a boss with devices is not announced before they are on');assert.notEqual(f.checkpoint,'boss');
 await b.close();console.log('PASS boss entrance');})().catch(e=>{console.error(e);process.exit(1);});
