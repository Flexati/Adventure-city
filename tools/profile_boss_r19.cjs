// R19: frame cost and hottest functions in a boss fight, with the CPU throttled to approximate a mid-range phone.
// [SIMULAZIONE] Chromium headless: it ranks costs, it does not replace a measurement on a real device.
const {chromium}=require('playwright');const fs=require('node:fs');const qa=require('./qa_v8.cjs');
const [url='http://127.0.0.1:8090/game/',out='docs/evidence/r19/perf',steps='blackout,breach,finale',rate='4']=process.argv.slice(2);
(async()=>{
 fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined}),report=[];
 for(const step of steps.split(','))for(const [w,h] of [(process.argv[6]||'390x844').split('x').map(Number)]){
  const context=await browser.newContext({viewport:{width:w,height:h},hasTouch:true,deviceScaleFactor:2}),page=await context.newPage();
  await page.goto(url);await page.evaluate(()=>localStorage.setItem('city-v4-settings',JSON.stringify({sound:false,reduced:false})));
  // Resume at the boss checkpoint, the way a player who died on the boss does.
  const raw=JSON.parse(await qa.makeSave(step));raw.checkpoint='boss';
  await page.evaluate(raw=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');localStorage.setItem('city-adventure-progress-v7',raw);},JSON.stringify(raw));
  await page.reload();await page.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');await page.click('#continue');
  for(let k=0;k<60;k++){if(await page.isVisible('#card')){await page.click('#card');continue;}if(await page.isVisible('#talk')){await page.click('#next-line');continue;}if((await page.evaluate(()=>window.cityAdventure.status())).running)break;await page.waitForTimeout(80);}
  const cdp=await context.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:Number(rate)});await cdp.send('Profiler.enable');await cdp.send('Profiler.start');
  await page.keyboard.down('KeyJ');await page.keyboard.down('KeyD');await page.waitForTimeout(6000);await page.keyboard.up('KeyD');await page.keyboard.up('KeyJ');
  const {profile}=await cdp.send('Profiler.stop');const samples=await page.evaluate(()=>window.cityAdventure.performance().slice(-300));
  const self=new Map(),dt=profile.timeDeltas,byId=new Map(profile.nodes.map(n=>[n.id,n]));
  profile.samples.forEach((id,i)=>{const n=byId.get(id),k=n.callFrame.functionName||'(anon)';self.set(k,(self.get(k)||0)+(dt[i]||0)/1000);});
  const total=[...self.values()].reduce((a,b)=>a+b,0),top=[...self.entries()].sort((a,b)=>b[1]-a[1]).slice(0,9).map(([k,v])=>`${k} ${(v/total*100).toFixed(1)}%`);
  const cost=samples.map(s=>s.cost).sort((a,b)=>a-b),gap=samples.map(s=>s.gap).sort((a,b)=>a-b),q=(a,p)=>a[Math.min(a.length-1,Math.floor(a.length*p))]?.toFixed(1);
  const st=await page.evaluate(()=>{const s=window.cityAdventure.snapshot();return {enemies:s.enemies?.filter(e=>e.hp>0).length,boss:s.enemies?.find(e=>e.boss)?.state};});
  report.push({step,view:`${w}x${h}`,rate:Number(rate),frames:samples.length,cost_p50:q(cost,.5),cost_p95:q(cost,.95),cost_max:q(cost,1),gap_p50:q(gap,.5),gap_p95:q(gap,.95),ratio:samples.at(-1)?.ratio,state:st,top});
  console.log(step,`${w}x${h}`,'cost p50/p95/max',q(cost,.5),q(cost,.95),q(cost,1),'gap p50/p95',q(gap,.5),q(gap,.95),'ratio',samples.at(-1)?.ratio,JSON.stringify(st));console.log('   ',top.join(' | '));
  await context.close();}
 await browser.close();fs.writeFileSync(`${out}/boss-profile.json`,JSON.stringify({evidence:'[SIMULAZIONE] Chromium headless, CPU rallentata',report},null,1)+'\n');
})().catch(e=>{console.error(e);process.exit(1);});
