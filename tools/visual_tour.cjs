// Visual QA tour: opens every campaign step from a v7 save (as a returning player would), plays a few
// seconds with real keys and captures the screen at several phone sizes. Not completion evidence:
// the full NEW GAME → ending path is verify_campaign_browser.cjs.
// Usage: node tools/visual_tour.cjs <url> <outDir> [steps,comma,separated]
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path');
const [url='http://127.0.0.1:8090/index.html',out='visual-tour',only='']=process.argv.slice(2);
const VIEWPORTS=[[390,844],[360,800],[412,915],[844,390]];
const FLAGS={opening_completed:true,glass_owned:true,heard_lulu:true,chosen_name_nox:true,blackout_choice:'workshop',rooftop_answer:'ask',clinic_hidden:true,heat:'unit9',unit9_saved:true,channel_called:false,eve_kept:true,line_choice:'stay'};
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const {CAMPAIGN}=await import(path.resolve(__dirname,'../game/missions.mjs'));
 const {makePolicy}=await import(path.resolve(__dirname,'../tests/helpers/autoplay.mjs'));
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});const report=[];
 for(const [width,height] of VIEWPORTS){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url());});
  for(let step=0;step<CAMPAIGN.length;step++){
   const id=CAMPAIGN[step].id;if(only&&!only.split(',').includes(id))continue;if(CAMPAIGN[step].type==='scene'&&width!==390&&!only.split(',').includes(id))continue;
   await require('./qa_v8.cjs').seed(page,url,id,{flags:FLAGS});
   let talked=0;while(await page.isVisible('#talk')&&talked<3){if(talked===1)await page.screenshot({path:path.join(out,`${String(step).padStart(2,'0')}-${id}-talk-${width}x${height}.png`)});await page.click('#next-line');talked++;await page.waitForTimeout(120);}
   while(await page.isVisible('#talk'))await page.click('#next-line');
   const st=await page.evaluate(()=>window.cityAdventure.status());
   if(st.mode==='foot'||st.mode==='drive'){const policy=makePolicy({reaction:.3,dodgeRate:.6,seed:step});const held=new Set();const t=Date.now();
    while(Date.now()-t<5500){const snap=await page.evaluate(()=>window.cityAdventure.snapshot());const want=new Set();
     if(snap.mode==='foot'){const i=policy(snap);if(i.x>.3)want.add('KeyD');if(i.x<-.3)want.add('KeyA');if(i.y>.3)want.add('KeyS');if(i.y<-.3)want.add('KeyW');if(i.gun)want.add('KeyJ');if(i.magic)want.add('KeyL');if(i.duo)want.add('KeyQ');}
     else if(snap.mode==='driving'){want.add('KeyW');}
     for(const k of [...held])if(!want.has(k)){await page.keyboard.up(k);held.delete(k);}for(const k of want)if(!held.has(k)){await page.keyboard.down(k);held.add(k);}await page.waitForTimeout(50);}
    for(const k of held)await page.keyboard.up(k);
   }
   const layout=await page.evaluate(()=>{const out={overflow:document.documentElement.scrollWidth>innerWidth,offscreen:[],small:[]};for(const el of document.querySelectorAll('button')){if(el.offsetParent===null)continue;const r=el.getBoundingClientRect();if(r.width===0)continue;if(r.left<-1||r.right>innerWidth+1||r.top<-1||r.bottom>innerHeight+1)out.offscreen.push(el.id||el.textContent.trim().slice(0,20));if(r.height<44||r.width<44)out.small.push(el.id||el.textContent.trim().slice(0,20));}return out;});
   await page.screenshot({path:path.join(out,`${String(step).padStart(2,'0')}-${id}-${width}x${height}.png`)});
   report.push({step:id,viewport:`${width}x${height}`,mode:st.mode,layout});
  }
  report.push({viewport:`${width}x${height}`,errors});await page.close();
 }
 fs.writeFileSync(path.join(out,'tour.json'),JSON.stringify(report,null,1));
 const problems=report.filter(r=>r.errors?.length||r.layout&&(r.layout.overflow||r.layout.offscreen.length||r.layout.small.length));
 console.log(JSON.stringify(problems,null,1));await browser.close();process.exitCode=problems.length?1:0;
})();
