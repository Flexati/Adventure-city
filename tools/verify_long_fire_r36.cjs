// R36: a long session under fire. In the Archon arena (the heaviest), fire is held and the hero moves for several minutes;
// a defeat is retried at once. Every 15 s: JS heap in use (CDP Performance.getMetrics), frame cost (window.cityAdventure
// .performance()), active chrono effects. Fails on a fault, a page error, or heap growth beyond 40 MB between the first
// and the last minute. [SIMULAZIONE] Chromium on a server, not a phone: it finds leaks and runaway lists, not phone fps.
//   node tools/verify_long_fire_r36.cjs http://127.0.0.1:8090/game/ [step] [seconds]   (CHROMIUM=<chrome>)
const {chromium}=require('playwright'),qa=require('./qa_v8.cjs');
const [url='http://127.0.0.1:8090/game/',step='finale',secs='180']=process.argv.slice(2);
(async()=>{const b=await chromium.launch(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),p=await b.newPage({viewport:{width:390,height:844},hasTouch:true}),errs=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push(m.text().slice(0,160));});
 const cdp=await p.context().newCDPSession(p);await cdp.send('Performance.enable');
 const heap=async()=>{const {metrics}=await cdp.send('Performance.getMetrics');return Math.round(metrics.find(m=>m.name==='JSHeapUsedSize').value/1048576*10)/10;};
 await qa.seed(p,url,step);const t0=Date.now(),samples=[];let retries=0,dir=0;const keys=['KeyW','KeyA','KeyS','KeyD'];
 await p.keyboard.down('KeyJ');
 while(Date.now()-t0<+secs*1000){
  await p.keyboard.up(keys[dir]);dir=(dir+1)%4;await p.keyboard.down(keys[dir]);
  for(let k=0;k<6;k++){await p.waitForTimeout(500);if(k%3===0){await p.keyboard.press('KeyL');await p.keyboard.press('ShiftLeft');}}
  const st=await p.evaluate(()=>{const s=window.cityAdventure.status(),f=window.cityAdventure.performance().slice(-120),c=f.map(x=>x.cost||x.ms||0).sort((a,b)=>a-b);return {mode:s.mode,running:s.running,fault:!document.getElementById('fault-panel')?.hidden,fx:s.chrono?.fxActive,p95:c.length?c[Math.floor(c.length*.95)]:null,status:window.cityAdventure.snapshot()?.status};});
  if(st.fault)errs.push('fault panel');
  if(st.status==='failed'||!st.running){const again=await p.$('button:visible:has-text("Riprova"), button:visible:has-text("Riprendi"), #card:visible, #next-line:visible');if(again){await again.click().catch(()=>{});retries++;}}
  const s=Math.round((Date.now()-t0)/1000);if(!samples.length||s-samples.at(-1).s>=15)samples.push({s,heapMB:await heap(),p95ms:st.p95,fx:st.fx,mode:st.mode});
 }
 await p.keyboard.up('KeyJ');await b.close();
 const first=samples.filter(x=>x.s<=60),last=samples.filter(x=>x.s>=+secs-60),avg=a=>a.reduce((n,x)=>n+x.heapMB,0)/Math.max(1,a.length),growth=+(avg(last)-avg(first)).toFixed(1);
 console.log(JSON.stringify({step,seconds:+secs,retries,samples,heapGrowthMB:growth,errors:errs.slice(0,5)}));
 const ok=!errs.length&&growth<40;console.log(ok?'PASS long fire':'FAIL long fire');process.exit(ok?0:1);
})();
