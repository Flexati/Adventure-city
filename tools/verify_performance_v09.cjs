// Measures the actual requestAnimationFrame update+Canvas call time, plus wall-clock presentation gaps.
// Headless host evidence only: this cannot certify Android GPU, DAC, thermals or sustained device FPS.
const {chromium}=require('playwright');const fs=require('fs');const crypto=require('node:crypto');const path=require('node:path');const assert=require('node:assert/strict');
const [url='http://127.0.0.1:8090/game/',out='performance-v09.json',quick='']=process.argv.slice(2);
const fingerprint=()=>{const hash=crypto.createHash('sha256');for(const name of ['runtime.mjs','campaign.mjs','layouts.mjs','scenery.mjs','audio-engine.mjs','missions.mjs','visuals.mjs','driving.mjs'])hash.update(fs.readFileSync(path.join(__dirname,'../game',name)));return hash.digest('hex');};
const codeFingerprint=fingerprint();
const sizes=quick==='probe'?[[390,844]]:[[360,800],[390,844],[412,915],[844,390]];
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROMIUM||undefined,args:['--disable-gpu']});const errors=[],rows=[];let reportWritten=false;
 async function saveReport(){fs.writeFileSync(out,JSON.stringify({description:'Real Chromium headless, software rendering, shipping Web Audio enabled; main-thread frame callback excludes async raster/presentation. CPU4 is a stress scenario, not an Android equivalence.',chromium:b.version(),profile:quick||'full',codeFingerprint,complete:rows.length===(quick==='probe'?3:quick==='quick'?20:64),rows,errors,failures:rows.filter(r=>r.costMs.p95>=16)},null,2)+'\n');reportWritten=true;}
 const missionSteps=[1,3,6,8,10,11,13,14,16,17,18,15];
 const {CAMPAIGN}=await import('../game/missions.mjs');
 const {makePolicy}=await import('../tests/helpers/autoplay.mjs');
 const quantile=(values,p)=>[...values].sort((a,b)=>a-b)[Math.min(values.length-1,Math.floor(values.length*p))];
 try{
 for(const rate of quick==='probe'?[4]:quick==='quick'?[1]:[1,4])for(const [width,height] of sizes){
  const p=await b.newPage({viewport:{width,height},deviceScaleFactor:1.75,hasTouch:true});p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url())});const cdp=await p.context().newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate});
  for(const step of (quick==='probe'?[10,14,15]:quick==='quick'?[10,14,17,18,15]:rate===4?[10,14,18,15]:missionSteps)){
   await p.goto(url);await p.evaluate(step=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');localStorage.setItem('city-adventure-progress-v6',JSON.stringify({version:6,step,status:'playing',upgrade:'power',cityChoice:'workshop',narrative:{version:1,thermal:58,flags:{opening_completed:true,unit9_saved:true},choices:{},beatsSeen:[]},stats:{deaths:0,seconds:0}}));},step);
   await p.reload();await p.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');await p.click('#continue');if(await p.isVisible('#card'))await p.click('#card');await p.waitForTimeout(200);for(let i=0;i<15&&await p.isVisible('#talk');i++)await p.click('#next-line');
   assert.ok(await p.evaluate(()=>window.cityAdventure.status().running),'must sample live gameplay');
   let bossActive=false;
   if(step===18&&width===390){
    const policy=makePolicy({reaction:.3,dodgeRate:.7,seed:7}),held=new Set(),deadline=Date.now()+180000;
    while(Date.now()<deadline){
     const s=await p.evaluate(()=>window.cityAdventure.snapshot());if(s.enemies.some(e=>e.boss&&e.hp>0&&e.state!=='dormant')){bossActive=true;break;}assert.equal(s.status,'playing','boss setup must use a surviving real-input player');
     const i=policy(s),want=new Set();for(const [yes,key] of [[i.x>.3,'KeyD'],[i.x<-.3,'KeyA'],[i.y>.3,'KeyS'],[i.y<-.3,'KeyW'],[i.gun,'KeyJ'],[i.magic,'KeyL'],[i.dash,'ShiftLeft'],[i.duo,'KeyQ'],[i.interact,'KeyE']])if(yes)want.add(key);
     for(const k of [...held])if(!want.has(k)){await p.keyboard.up(k);held.delete(k);}for(const k of want)if(!held.has(k)){await p.keyboard.down(k);held.add(k);}await p.waitForTimeout(50);
    }for(const k of held)await p.keyboard.up(k);assert.ok(bossActive,'must reach live Archon through ordinary inputs');
   }
   await p.keyboard.down('KeyJ');await p.keyboard.down('KeyL');await p.keyboard.down('KeyW');await p.keyboard.down('KeyQ');if(CAMPAIGN[step].type==='drive')await p.keyboard.down('KeyP');
   await p.waitForTimeout(700);const before=await p.evaluate(()=>window.cityAdventure.performance().at(-1)?.id||0);await p.waitForTimeout(2600);
   const snap=await p.evaluate(()=>({samples:window.cityAdventure.performance(),audio:window.cityAdventure.status().audio,running:window.cityAdventure.status().running}));
   for(const k of ['KeyJ','KeyL','KeyW','KeyQ','KeyP'])await p.keyboard.up(k);
   const samples=snap.samples.filter(s=>s.id>before);assert.ok(samples.length>=35,'insufficient live frames');assert.equal(snap.audio.context,'running','audio must be active');assert.equal(snap.audio.musicPaused,false,'music must be playing: '+JSON.stringify(snap.audio));
   rows.push({mission:CAMPAIGN[step].id,bossActive,viewport:`${width}x${height}`,requestedDpr:1.75,renderDprMin:Math.min(...samples.map(s=>s.ratio)),renderDprMax:Math.max(...samples.map(s=>s.ratio)),cpuRate:rate,sfxVoicePeak:Math.max(...samples.map(s=>s.voices||0)),frames:samples.length,costMs:{mean:samples.reduce((n,s)=>n+s.cost,0)/samples.length,p95:quantile(samples.map(s=>s.cost),.95),p99:quantile(samples.map(s=>s.cost),.99),max:Math.max(...samples.map(s=>s.cost))},presentationMs:{mean:samples.reduce((n,s)=>n+s.gap,0)/samples.length,p95:quantile(samples.map(s=>s.gap),.95),max:Math.max(...samples.map(s=>s.gap)),fpsMean:1000*samples.length/samples.reduce((n,s)=>n+s.gap,0),over25:samples.filter(s=>s.gap>25).length},audio:snap.audio});
   console.log(`${CAMPAIGN[step].id} ${width}x${height} cpu${rate} p95=${rows.at(-1).costMs.p95.toFixed(2)}ms`);
  }await p.close();
 }
 assert.equal(fingerprint(),codeFingerprint,'game code changed during the benchmark');
 const failures=rows.filter(r=>r.costMs.p95>=16);
 await saveReport();assert.deepEqual(errors,[]);assert.equal(failures.length,0,'p95 frame callback >=16ms; see report');
 }finally{if(!reportWritten)await saveReport();await b.close();}
})().catch(e=>{console.error(e);process.exit(1)});
