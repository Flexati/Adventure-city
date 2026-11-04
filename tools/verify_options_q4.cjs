// Q4 (D34) in Chromium: the Options screen from the main menu and from pause, on small portrait, tall portrait and landscape.
// Checks layout (inside the viewport, 44 px targets), tabs, persisted volumes and text size, English labels, Esc order.
const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const [url='http://127.0.0.1:8090/game/',out]=process.argv.slice(2);
if(!out){console.error('Usage: node tools/verify_options_q4.cjs <url> <out-dir> (the output goes outside the repo)');process.exit(2);}
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined}),checks=[],errors=[];
 try{
  for(const [width,height] of [[360,800],[390,844],[844,390]]){
   const c=await browser.newContext({viewport:{width,height},hasTouch:true}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
   await c.addInitScript(()=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');});
   await p.goto(url);await p.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');
   const inView=async sel=>{const b=await p.locator(sel).boundingBox();assert.ok(b&&b.x>=0&&b.y>=0&&b.x+b.width<=width+.5&&b.y+b.height<=height+.5,sel+' inside '+width+'x'+height+' '+JSON.stringify(b));assert.ok(b.height>=44,sel+' >= 44 px');};
   await p.tap('#menu-settings');await p.waitForSelector('#options:not([hidden])');await p.waitForTimeout(300);// cardPop scales the card for 220 ms
   assert.equal(await p.evaluate(()=>document.activeElement.id),'tab-audio');
   for(const t of ['audio','access','controls','credits']){await p.tap('#tab-'+t);assert.equal(await p.isVisible('#page-'+t),true);assert.equal(await p.getAttribute('#tab-'+t,'aria-selected'),'true');
    for(const o of ['audio','access','controls','credits'])if(o!==t)assert.equal(await p.isHidden('#page-'+o),true);
    await inView('#tab-'+t);await p.locator('#options-close').scrollIntoViewIfNeeded();await inView('#options-close');
    await p.screenshot({path:`${out}/options-${t}-${width}x${height}.png`});}
   assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');
   checks.push({id:'tabs-and-layout',viewport:width+'x'+height,result:'PASS'});
   // Volumes and text size persist and reach the mixer.
   await p.tap('#tab-audio');await p.locator('#opt-music').fill('3');await p.locator('#opt-effects').fill('7');
   assert.equal(await p.textContent('#opt-music-v'),'30%');
   assert.deepEqual(await p.evaluate(()=>window.cityAdventure.status().audio.levels),{music:.3,effects:.7});
   await p.tap('#tab-access');await p.check('#opt-big-text');assert.equal(await p.evaluate(()=>document.body.classList.contains('big-text')),true);
   const big=await p.evaluate(()=>parseFloat(getComputedStyle(document.getElementById('line')).fontSize));assert.ok(big>=18,'dialogue text '+big+' px');
   await p.tap('#options-close');await p.waitForSelector('#options',{state:'hidden'});assert.equal(await p.evaluate(()=>document.activeElement.id),'menu-settings');
   await p.reload();await p.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');
   assert.deepEqual(await p.evaluate(()=>window.cityAdventure.status().audio.levels),{music:.3,effects:.7});assert.equal(await p.evaluate(()=>document.body.classList.contains('big-text')),true);
   await p.tap('#menu-settings');assert.equal(await p.inputValue('#opt-music'),'3');assert.equal(await p.textContent('#opt-effects-v'),'70%');
   checks.push({id:'volumes-and-text-persist',viewport:width+'x'+height,result:'PASS',dialoguePx:big});
   // English: the Options screen follows the language switch.
   await p.tap('#tab-access');await p.selectOption('#opt-language','en');assert.equal(await p.textContent('#tab-credits'),'Credits');assert.equal(await p.textContent('#options-title'),'Options');
   await p.selectOption('#opt-language','it');assert.equal(await p.textContent('#tab-credits'),'Crediti');await p.tap('#options-close');
   checks.push({id:'language',viewport:width+'x'+height,result:'PASS'});
   await c.close();
  }
  // From pause: Options above the pause card, Esc closes Options first, then resumes; quick switches stay in sync.
  const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
  await p.goto(url);const {seed}=require('./qa_v8.cjs');await seed(p,url,'blackout');
  await p.keyboard.press('Escape');await p.waitForSelector('#pause-panel:not([hidden])');await p.tap('#pause-options');await p.waitForSelector('#options:not([hidden])');
  const box=await p.locator('#options-close').boundingBox();assert.equal(await p.evaluate(([x,y])=>document.elementFromPoint(x,y)?.id,[box.x+box.width/2,box.y+box.height/2]),'options-close','Options sit above pause');
  await p.tap('#tab-controls');await p.uncheck('#opt-haptics');
  await p.keyboard.press('Escape');await p.waitForSelector('#options',{state:'hidden'});assert.equal(await p.isVisible('#pause-panel'),true);assert.equal(await p.isChecked('#haptics'),false,'pause switch follows Options');
  assert.equal(await p.evaluate(()=>document.activeElement.id),'pause-options');
  await p.keyboard.press('Escape');await p.waitForSelector('#pause-panel',{state:'hidden'});assert.equal(await p.evaluate(()=>window.cityAdventure.status().running),true);
  checks.push({id:'pause-options-esc-order',result:'PASS'});await c.close();
  assert.deepEqual(errors,[]);
  fs.writeFileSync(out+'/options-q4.json',JSON.stringify({ok:true,checks,errors},null,1));console.log('Q4 options PASS · '+checks.length+' checks');
 }catch(e){fs.writeFileSync(out+'/options-q4.json',JSON.stringify({ok:false,checks,errors,failure:String(e.stack||e)},null,1));console.error(e);process.exitCode=1;}
 finally{await browser.close();}
})();
