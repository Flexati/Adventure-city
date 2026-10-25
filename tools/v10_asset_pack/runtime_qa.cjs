// Seeded browser evidence only. No physical Android, human listening or full campaign claim.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const qa=require('../qa_v8.cjs');
const [url='http://127.0.0.1:8091/game/',out='artifacts/v10/mobile']=process.argv.slice(2);
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||'/usr/bin/chromium'});
 const rows=[],errors=[],responses=[];
 const fingerprint=crypto.createHash('sha256');
 for(const file of ['runtime.mjs','audio-engine.mjs','v10-bindings.mjs'])fingerprint.update(fs.readFileSync('game/'+file));
 async function seed(page,step,{checkpoint=null,dialogue=false}={}){
  const p=JSON.parse(await qa.makeSave(step));p.checkpoint=checkpoint;
  await page.goto(url);await page.evaluate(raw=>{
   sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');
   localStorage.setItem('city-v4-settings',JSON.stringify({sound:true,reduced:true}));
   localStorage.setItem('city-adventure-progress-v7',raw);
  },JSON.stringify(p));await page.reload();
  await page.waitForFunction(()=>window.cityAdventure?.status().loaded);
  await page.click('#continue');
  for(let i=0;i<100;i++){
   if(await page.isVisible('#card')){await page.click('#card');continue;}
   if(await page.isVisible('#talk')){if(dialogue)return;await page.click('#next-line');continue;}
   if(await page.evaluate(()=>window.cityAdventure.status().running))return;
   await page.waitForTimeout(50);
  }throw Error('Failed to enter '+step);
 }
 for(const [width,height] of [[360,800],[390,844],[412,915]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true});
  const page=await context.newPage();page.on('pageerror',e=>errors.push({width,message:e.message}));
  page.on('response',r=>{if(r.url().includes('/audio/v10/'))responses.push({width,url:r.url(),status:r.status()});});
  const shot=async(name,scope='main-campaign')=>{
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   assert.equal(overflow,false,`${width} ${name}: horizontal overflow`);
   const file=`${name}-${width}x${height}.png`;await page.screenshot({path:path.join(out,file),fullPage:false});
   rows.push({scene:name,viewport:`${width}x${height}`,screenshot:file,scope,render:'CAPTURED',artApproval:'NOT_TESTED',horizontalOverflow:overflow});
  };
  await page.goto(url);await page.waitForFunction(()=>window.cityAdventure?.status().loaded);
  await page.evaluate(()=>sessionStorage.setItem('city-studio-shown','1'));await page.reload();
  await page.waitForFunction(()=>window.cityAdventure?.status().loaded);await shot('title');
  await seed(page,'below');await page.waitForFunction(()=>window.cityAdventure.status().audio.v10.decoded.length===10);
  await shot('nox');
  await page.keyboard.down('KeyJ');await page.waitForTimeout(350);await page.keyboard.up('KeyJ');
  await page.keyboard.down('ShiftLeft');await page.waitForTimeout(160);await page.keyboard.up('ShiftLeft');
  await page.waitForFunction(()=>window.cityAdventure.status().audio.v10.played.dash>0);await shot('combat');
  let audio=await page.evaluate(()=>window.cityAdventure.status().audio.v10);
  assert.ok(audio.played['shot:c9']>0,'C9 sample must actually start');assert.ok(audio.played.dash>0,'dash sample must actually start');
  assert.equal(audio.errors.length,0);assert.ok(audio.decodedBytes<2*1024*1024);
  rows.push({scene:'sample-playback',viewport:`${width}x${height}`,result:'PASS',audio,limits:'WebAudio source playback, not human listening'});
  await page.click('#pause');await shot('pause');await page.click('#resume');
  await page.click('#bag');await shot('inventory');
  await seed(page,'city');assert.equal(await page.evaluate(()=>window.cityAdventure.snapshot().hero),'lulu');await shot('lulu');
  await seed(page,'archive',{checkpoint:'boss'});
  assert.ok(await page.evaluate(()=>window.cityAdventure.snapshot().enemies.some(e=>e.boss&&e.hp>0&&e.state!=='dormant')));await shot('boss');
  await seed(page,'breach',{dialogue:true});assert.ok(await page.isVisible('#talk'));await shot('dialogue');
  await seed(page,'moon');assert.equal(await page.evaluate(()=>window.cityAdventure.status().mode),'hub');await shot('hub');
  await seed(page,'escape');assert.equal(await page.evaluate(()=>window.cityAdventure.status().mode),'drive');await shot('drive');
  await page.goto(new URL('v9-race-lab.html',url).href);await page.click('#start');await shot('race-lab','separate-V9-preview-NOT-campaign-or-APK');
  await context.close();
 }
 assert.deepEqual(errors,[]);assert.ok(responses.length>0);assert.ok(responses.every(r=>r.status===200));
 const report={browser:browser.version(),sourceFingerprint:fingerprint.digest('hex'),result:'PASS',rows,responses,errors,
  limits:['Seeded browser scenarios, not a full campaign run or human playtest.','Screenshots captured; not artistic approval.','Race screenshot is a separate V9 preview, not V10 campaign integration.','No physical Android device or headphone listening verified.']};
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');
 await browser.close();console.log(JSON.stringify({result:'PASS',screenshots:rows.filter(r=>r.screenshot).length,viewports:3}));
})().catch(e=>{console.error(e);process.exit(1);});
