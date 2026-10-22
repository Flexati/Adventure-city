// Opens every campaign step from a valid v7 save and captures what the player sees once play starts:
// the step card, then the first playable frame with HUD. Read-only: the page state is never written.
// Usage: node tools/observe_missions.cjs <url> <outDir> [width] [height]
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path');
const [url='http://127.0.0.1:8090/index.html',out='observe',W='390',H='844']=process.argv.slice(2);
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const {CAMPAIGN}=await import(path.resolve(__dirname,'../game/missions.mjs'));
 const {newProgress,saveProgress}=await import(path.resolve(__dirname,'../game/missions.mjs'));
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
 const report=[];
 for(let i=0;i<CAMPAIGN.length;i++){
  const step=CAMPAIGN[i];if(step.type==='scene')continue;
  const page=await browser.newPage({viewport:{width:+W,height:+H},deviceScaleFactor:1,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const p=newProgress();p.step=i;
  // Plausible flags for later steps so conditional lines resolve.
  Object.assign(p.narrative.flags,{blackout_choice:'workshop',rooftop_answer:'ask',clinic_hidden:false,heat:'unit9',unit9_saved:true,channel_called:false,eve_kept:true,line_choice:'go'});
  p.cityChoice='workshop';p.world.preparation={toxic:'attack',clockwork:'attack'};
  await page.addInitScript(raw=>{try{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-adventure-progress-v7',raw);localStorage.setItem('city-tutorial-v8','1');}catch{}},saveProgress(p));
  await page.goto(url);
  await page.waitForFunction(()=>window.cityAdventure?.status().mode==='menu'&&window.cityAdventure.status().loaded,null,{timeout:30000});
  await page.click('#continue');
  await page.waitForSelector('#card:not([hidden])',{timeout:10000});await page.waitForTimeout(700);
  const card=await page.evaluate(()=>({text:document.getElementById('card').innerText}));
  await page.screenshot({path:path.join(out,`${String(i).padStart(2,'0')}-${step.id}-card.png`)});
  await page.click('#card');
  for(let k=0;k<40;k++){if(await page.isVisible('#talk'))await page.click('#next-line');else if((await page.evaluate(()=>window.cityAdventure.status())).running)break;await page.waitForTimeout(120);}
  await page.waitForTimeout(900);
  const hud=await page.evaluate(()=>({district:document.getElementById('district').textContent,objective:document.getElementById('objective').textContent,meter:document.getElementById('meter').hidden?null:document.getElementById('meter-label').textContent,health:document.getElementById('health').textContent}));
  await page.screenshot({path:path.join(out,`${String(i).padStart(2,'0')}-${step.id}-play.png`)});
  report.push({step:step.id,type:step.type,card:card.text.replace(/\s+/g,' ').trim(),hud,errors});
  console.log(step.id,JSON.stringify(hud));
  await page.close();
 }
 fs.writeFileSync(path.join(out,'observe.json'),JSON.stringify({url,viewport:[+W,+H],report},null,1));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
