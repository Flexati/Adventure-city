// Comparable host measurements; process RSS sums include shared pages more than once.
const {chromium}=require('playwright'),fs=require('fs');
(async()=>{const results=[];
 for(const [name,url]of [['baseline','http://127.0.0.1:8091/game/'],['chrono','http://127.0.0.1:8090/game/']]){
  const b=await chromium.launch({executablePath:process.env.CHROMIUM||'/usr/bin/chromium'}),p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1.75,hasTouch:true}),errors=[];p.on('pageerror',e=>errors.push(e.message));if(name==='baseline'){
   // The comparison server intentionally serves the historical v0.9/v6 build.
   await p.goto(url);await p.evaluate(()=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');localStorage.setItem('city-adventure-progress-v6',JSON.stringify({version:6,step:18,status:'playing',upgrade:'power',cityChoice:'workshop',narrative:{version:1,thermal:60,flags:{opening_completed:true},choices:{},beatsSeen:[]},stats:{deaths:0,seconds:0}}));});
   await p.reload();await p.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');await p.click('#continue');if(await p.isVisible('#card'))await p.click('#card');for(let i=0;i<30;i++){if(await p.isVisible('#talk'))await p.click('#next-line');if(await p.evaluate(()=>window.cityAdventure.status().running))break;await p.waitForTimeout(80);}await p.waitForFunction(()=>window.cityAdventure.status().running);
  }else await require('./qa_v8.cjs').seed(p,url,'finale');await p.waitForTimeout(2000);
  const browserCdp=await b.newBrowserCDPSession(),cdp=await p.context().newCDPSession(p),samples=[];for(let i=0;i<3;i++){const processes=(await browserCdp.send('SystemInfo.getProcessInfo')).processInfo,rows=[];for(const process of processes){try{const s=fs.readFileSync('/proc/'+process.id+'/status','utf8'),match=s.match(/^VmRSS:\s+(\d+) kB/m);if(match)rows.push({type:process.type,pid:process.id,rssBytes:Number(match[1])*1024});}catch{}}
   samples.push({heap:await cdp.send('Runtime.getHeapUsage'),processes:rows,summedRssBytes:rows.reduce((n,r)=>n+r.rssBytes,0)});await p.waitForTimeout(300);}
  results.push({name,viewport:'390x844',step:name==='baseline'?18:'finale',dpr:1.75,status:await p.evaluate(()=>window.cityAdventure.status()),samples,errors});await b.close();
 }
 fs.writeFileSync('docs/evidence/chrono_shadows/memory.json',JSON.stringify({environment:'Cloud Linux Chromium; separate fresh browser per build; final mission at rest; no Android memory measurement',rssCaveat:'Sum of process RSS double-counts shared pages; useful host comparison, not unique app RAM. JS heap, audio buffers and decoded texture accounting are separate and overlap process RSS.',results},null,2)+'\n');console.log('Baseline/current Chromium memory samples recorded');
})().catch(e=>{console.error(e);process.exit(1)});
