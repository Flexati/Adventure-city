// Plays City Adventure from NEW GAME to the ending through the real UI: taps, held keys and buttons only.
// The page exposes read-only snapshots; this script never writes game state.
// Usage: node tools/verify_campaign_browser.cjs <url> <strategy:a|b> <outDir>
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path');
const [url='http://127.0.0.1:8090/index.html',strategy='a',out='campaign-run']=process.argv.slice(2);
const PICKS={a:{blackout:'workshop',rooftop_glass:0,rooftop_ask:0,clinic_log:0,below_heat:0,port_channel:0,archive_eve:0,line_wait:0},b:{blackout:'shelter',rooftop_glass:1,rooftop_ask:1,clinic_log:1,below_heat:1,port_channel:1,archive_eve:1,line_wait:1}}[strategy];
const LANES=[170,265,360,455,550];
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const {makePolicy}=await import(path.resolve(__dirname,'../tests/helpers/autoplay.mjs'));
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url());});
 await page.goto(url);
 await page.waitForFunction(()=>window.cityAdventure?.status().mode==='menu'&&window.cityAdventure.status().loaded,null,{timeout:30000});
 const log=[],t0=Date.now();let stepStart=Date.now(),lastStep=null,deaths=0,policy=null,held=new Set(),softlock=0,lastSig='';
 const visible=sel=>page.isVisible(sel);
 async function setKeys(want){for(const k of [...held])if(!want.has(k)){await page.keyboard.up(k);held.delete(k);}for(const k of want)if(!held.has(k)){await page.keyboard.down(k);held.add(k);}}
 async function shot(name){await page.screenshot({path:path.join(out,name+'.png')});}
 await page.click('#start');
 for(let guard=0;guard<200000;guard++){
  const st=await page.evaluate(()=>window.cityAdventure.status());
  if(st.step!==lastStep&&st.step){if(lastStep)log.push({step:lastStep,seconds:Math.round((Date.now()-stepStart)/1000),deaths});stepStart=Date.now();deaths=0;lastStep=st.step;policy=makePolicy({reaction:.3,dodgeRate:.6,seed:7});await shot('step-'+String(log.length).padStart(2,'0')+'-'+st.step);}
  if(await visible('#ending')){await setKeys(new Set());log.push({step:lastStep,seconds:Math.round((Date.now()-stepStart)/1000),deaths});await page.waitForTimeout(12000);await shot('ending');break;}
  if(await visible('#card')){await setKeys(new Set());await page.click('#card');continue;}
  if(await visible('#opening')){for(const sel of ['#opening-surface','#opening-name','#opening-pick'])if(await visible(sel)){await page.click(sel);break;}await page.waitForTimeout(200);continue;}
  if(await visible('#talk')){await setKeys(new Set());await page.click('#next-line');await page.waitForTimeout(40);continue;}
  if(await visible('#city-choice')){await shot('choice-blackout');await page.click('#choose-'+PICKS.blackout);continue;}
  if(await visible('#choice')){const k=await page.textContent('#choice-title');const buttons=await page.$$('#choice-options button');
   const order={'Perché lo tieni?':'rooftop_glass','Se dovessi scegliere tra te e un quartiere intero…':'rooftop_ask','UNITÀ EVE LOCALIZZATA':'clinic_log','Una sola cella termica':'below_heat','Chiamare Nox?':'port_channel','La testimone':'archive_eve','L’asse si apre':'line_wait'};
   await shot('choice-'+(order[k]||'x'));await buttons[PICKS[order[k]]??0].click();continue;}
  if(await visible('#hold')){const b=await page.$('#hold-button');const box=await b.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.waitForTimeout(1500);await page.mouse.up();continue;}
  if(await visible('#knock')){await shot('knock');await page.click('#knock-surface');await page.waitForTimeout(150);await page.click('#knock-surface');await page.waitForTimeout(700);continue;}
  if(await visible('#city-return')){await page.click('#city-close');continue;}
  if(await visible('#result')){await setKeys(new Set());if(await visible('#retry')){deaths++;await shot('fail-'+lastStep+'-'+deaths);await page.click('#retry');}else if(await visible('#power'))await page.click(strategy==='a'?'#power':'#shield');else await page.click('#next');continue;}
  const snap=await page.evaluate(()=>window.cityAdventure.snapshot());
  if(st.mode==='foot'&&snap.mode==='foot'&&st.running&&!st.uiLock){
   const inp=policy(snap),want=new Set();
   if(inp.x>.3)want.add('KeyD');if(inp.x<-.3)want.add('KeyA');if(inp.y>.3)want.add('KeyS');if(inp.y<-.3)want.add('KeyW');
   if(inp.gun)want.add('KeyJ');if(inp.magic)want.add('KeyL');if(inp.dash)want.add('ShiftLeft');if(inp.duo)want.add('KeyQ');if(inp.interact)want.add('KeyE');
   await setKeys(want);
   const sig=`${Math.round(snap.x/40)},${Math.round(snap.y/40)},${snap.kills},${(snap.nodes||[]).filter(n=>n.on).length},${Math.round((snap.progress||0)*20)}`;softlock=sig===lastSig?softlock+1:0;lastSig=sig;
   if(softlock>900){errors.push('Possible softlock in '+lastStep+' at '+sig);await shot('softlock-'+lastStep);softlock=0;}
  }else if(st.mode==='drive'&&snap.driving&&st.running&&!st.uiLock){
   const d=snap.driving,stop=d.stops.find(p=>!p.done);let best=null;
   for(const lane of LANES){let cost=Math.abs(lane-d.x)/250;if(d.hazards.some(h=>!h.hit&&(d.mode!=='dark'||h.seen||h.at-d.distance<300)&&h.at>d.distance-60&&h.at<d.distance+560&&Math.abs(h.x-lane)<60))cost+=10;if(d.strikes.some(k=>!k.done&&Math.abs(k.x-lane)<62))cost+=8;if(stop&&stop.at-d.distance<1300)cost+=Math.abs(stop.x-lane)/40;if(!best||cost<best.cost)best={lane,cost};}
   const want=new Set(),dx=best.lane-d.x;if(dx>14)want.add('KeyD');if(dx<-14)want.add('KeyA');
   const hold=stop&&d.index===2&&stop.at-d.distance<420&&stop.at-d.distance>-100;if(hold){if(d.speed>45)want.add('KeyS');else if(d.speed<30)want.add('KeyW');}else want.add('KeyW');
   if(d.mode==='dark')want.add('KeyP');await setKeys(want);
  }else await page.waitForTimeout(60);
  if(Date.now()-t0>60*60*1000){errors.push('Timeout');break;}
 }
 await setKeys(new Set());
 const progress=await page.evaluate(()=>window.cityAdventure.progress());
 const report={strategy,minutes:+((Date.now()-t0)/60000).toFixed(1),steps:log,flags:progress?.narrative?.flags,thermal:progress?.narrative?.thermal,deaths:progress?.stats?.deaths,errors};
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 await browser.close();process.exit(errors.length?1:0);
})();
