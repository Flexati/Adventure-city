// R54 (D95): the free edition in the real, PACKAGED page (android/build/assets/game, after tools/prepare_android_assets.py).
// window.ChronosEdition (free app only) and window.ChronosStore are stubbed before any page script runs, as addJavascriptInterface does.
// Proves: the paid app (no edition, or "paid") locks nothing; the free app plays Act I, says the teaser beat, then shows the
// unlock screen instead of Act II; Back and Continue behave; a simulated purchase unlocks Act II; restore reaches the shell;
// English works; a store that is down keeps the story locked. Not provable here: Google Play itself and the Java side.
const {chromium}=require('playwright');const fs=require('fs');const {makeSave}=require('./qa_v8.cjs');
const URL=process.argv[2]||'http://127.0.0.1:8090/android/build/assets/game/index.html',OUT='docs/evidence/r54';fs.mkdirSync(OUT,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});const report={checks:[]};const errors=[];
 const ok=(name,pass,detail)=>{report.checks.push({name,pass:!!pass,detail});console.log((pass?'PASS ':'FAIL ')+name+(detail!=null?' · '+detail:''));};
 async function open({edition,entitled=false,price='5,99 €',lang='it',save,store=true}){
  const ctx=await browser.newContext({viewport:{width:412,height:860},locale:lang==='en'?'en-US':'it-IT'});const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(({edition,entitled,price,lang,save,store})=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');
   if(save)localStorage.setItem('city-adventure-progress-v7',save);
   const kv={};const calls=[];window.__storeCalls=calls;
   window.ChronosNative={lang:()=>lang,get:k=>Object.prototype.hasOwnProperty.call(kv,k)?kv[k]:null,sync:()=>{}};
   if(edition)window.ChronosEdition={edition:()=>edition};
   if(store){let st={entitled,status:entitled?'owned':'ready',price};
    window.__setStore=s=>{st={...st,...s};window.dispatchEvent(new Event('chronosstore'));};
    window.ChronosStore={state:()=>JSON.stringify(st),buy:()=>{calls.push('buy');window.__setStore({status:'purchasing'});setTimeout(()=>window.__setStore({entitled:true,status:'owned'}),200);},restore:()=>{calls.push('restore');window.__setStore({status:'ready'});}};}
  },{edition,entitled,price,lang,save,store});
  await page.goto(URL);await page.waitForFunction(()=>window.cityAdventure?.status().mode==='menu',null,{timeout:20000});return {ctx,page};
 }
 const vis=(page,id)=>page.evaluate(id=>{const e=document.getElementById(id);return !!e&&!e.hidden;},id);
 const step=page=>page.evaluate(()=>window.cityAdventure.status().step);
 async function sayAll(page,max=12){for(let k=0;k<max;k++){if(await vis(page,'store-panel'))return;if(await vis(page,'card')){await page.click('#card');continue;}if(await vis(page,'talk')){await page.click('#next-line');continue;}await page.waitForTimeout(150);}}
 const breachSave=await makeSave('app_breach'),clearedSave=await makeSave('docks_veyra',{status:'cleared'});

 // 1 · the paid app: nothing locked, the store is never touched
 for(const edition of [undefined,'paid']){
  const {ctx,page}=await open({edition,save:breachSave});await page.click('#continue');
  await page.waitForFunction(()=>window.cityAdventure.status().step==='app_breach'&&(document.getElementById('card')&&!document.getElementById('card').hidden||window.cityAdventure.status().running),null,{timeout:20000});
  ok('paid ('+(edition||'no edition')+'): Continue at Act II opens the mission, no unlock screen',!(await vis(page,'store-panel')));
  ok('paid ('+(edition||'no edition')+'): the store is never called',(await page.evaluate(()=>window.__storeCalls)).length===0);await ctx.close();}

 // 2 · the free app, first locked step: teaser beat, then the unlock screen; Act II does not start
 {const {ctx,page}=await open({edition:'free',save:breachSave});await page.click('#continue');
  await page.waitForFunction(()=>!document.getElementById('talk').hidden,null,{timeout:20000});const first=await page.textContent('#line');
  await sayAll(page);await page.waitForFunction(()=>!document.getElementById('store-panel').hidden,null,{timeout:10000});
  ok('free: the teaser beat comes first',/breccia/i.test(first),first);
  const t=await page.evaluate(()=>({title:document.getElementById('store-title').textContent,acts:[...document.querySelectorAll('#store-acts b')].map(b=>b.textContent),prog:document.querySelector('#store-acts>span').textContent,buy:document.getElementById('store-buy').textContent,buyOff:document.getElementById('store-buy').disabled,mode:window.cityAdventure.status().mode,running:window.cityAdventure.status().running,step:window.cityAdventure.status().step}));
  ok('free: the unlock screen shows, Act II has not started',t.mode==='store'&&!t.running&&t.step==='app_breach',JSON.stringify({mode:t.mode,step:t.step}));
  ok('free: it shows the progress already made ("Atto I di 4 completato")',/^Atto I di 4 completato · \d+ tappe su \d+/.test(t.prog),t.prog);
  ok('free: it lists what is coming, each act marked as locked',t.acts.length===4&&t.acts.some(a=>/ATTO II · LA BRECCIA · BLOCCATO/.test(a))&&t.acts.some(a=>/ATTO IV · ORA UNO · BLOCCATO/.test(a)),t.acts.join(' | '));
  ok('free: Buy shows the price the shell reported',t.buy==='Sblocca tutto · 5,99 €'&&!t.buyOff,t.buy);
  const saved=await page.evaluate(()=>window.cityAdventure.progress());ok('free: the save points at the first locked step and keeps the teaser flag',saved.stepId==='app_breach'&&saved.narrative.flags['free.act1_teaser']===true);
  await page.evaluate(()=>window.__chronosBack());await page.waitForFunction(()=>window.cityAdventure.status().mode==='menu');
  ok('free: Back from the unlock screen goes to the menu',!(await vis(page,'store-panel')));
  await page.click('#continue');await page.waitForFunction(()=>!document.getElementById('store-panel').hidden||!document.getElementById('talk').hidden,null,{timeout:10000});
  ok('free: Continue returns to the unlock screen, the teaser is not repeated',await vis(page,'store-panel')&&!(await vis(page,'talk')));
  await page.click('#store-restore');await page.waitForTimeout(200);ok('free: Restore calls the shell and the story stays locked',(await page.evaluate(()=>window.__storeCalls)).includes('restore')&&await vis(page,'store-panel'));
  await page.click('#store-buy');await page.waitForFunction(()=>document.getElementById('store-panel').hidden,null,{timeout:10000});
  await page.waitForFunction(()=>window.cityAdventure.status().step==='app_breach'&&window.cityAdventure.status().mode!=='store',null,{timeout:10000});
  ok('free: after the simulated purchase the unlock screen closes and Act II starts',(await page.evaluate(()=>window.__storeCalls)).includes('buy')&&(await step(page))==='app_breach');
  await ctx.close();}

 // 3 · the real Act I → Act II boundary: finish docks_veyra, press Avanti, land on the unlock screen
 {const {ctx,page}=await open({edition:'free',save:clearedSave});await page.click('#continue');
  for(let k=0;k<40;k++){if(await vis(page,'store-panel'))break;if(await vis(page,'card')){await page.click('#card');continue;}if(await vis(page,'talk')){await page.click('#next-line');continue;}
   if(await vis(page,'choice')){await page.click('#choice-options button');continue;}if(await vis(page,'upgrades')&&await vis(page,'power')){await page.click('#power');continue;}if(await vis(page,'next')){await page.click('#next');continue;}await page.waitForTimeout(150);}
  ok('free: finishing the last stage of Act I ends on the unlock screen, not on Act II',await vis(page,'store-panel')&&(await step(page))==='app_breach',await step(page));await ctx.close();}

 // 4 · already owned at start (a returning buyer): Act II opens at once
 {const {ctx,page}=await open({edition:'free',entitled:true,save:breachSave});await page.click('#continue');
  await page.waitForFunction(()=>window.cityAdventure.status().step==='app_breach'&&(!document.getElementById('card').hidden||window.cityAdventure.status().running),null,{timeout:20000});
  ok('free + owned at start: no unlock screen, Act II opens',!(await vis(page,'store-panel')));await ctx.close();}

 // 5 · English
 {const {ctx,page}=await open({edition:'free',lang:'en',price:'€5.99',save:breachSave});await page.click('#continue');await sayAll(page);await page.waitForFunction(()=>!document.getElementById('store-panel').hidden,null,{timeout:10000});
  const t=await page.evaluate(()=>({title:document.getElementById('store-title').textContent,buy:document.getElementById('store-buy').textContent,restore:document.getElementById('store-restore').textContent,acts:[...document.querySelectorAll('#store-acts b')].map(b=>b.textContent),prog:document.querySelector('#store-acts>span').textContent}));
  ok('free (English): the unlock screen speaks English',t.title==='Continue the story'&&t.buy==='Unlock everything · €5.99'&&t.restore==='Restore purchase'&&t.acts.includes('ACT II · THE BREACH · LOCKED')&&/^Act I of 4 complete/.test(t.prog),JSON.stringify(t));await ctx.close();}

 // 6 · the store is down: the story stays locked and the screen says so; Buy is off
 {const {ctx,page}=await open({edition:'free',save:breachSave,store:false});await page.click('#continue');await sayAll(page);await page.waitForFunction(()=>!document.getElementById('store-panel').hidden,null,{timeout:10000});
  const t=await page.evaluate(()=>({off:document.getElementById('store-buy').disabled,status:document.getElementById('store-status').textContent}));
  ok('free, no store bridge: still locked, Buy disabled, the screen explains',t.off&&/Google Play/.test(t.status),t.status);await ctx.close();}

 ok('no page errors',!errors.length,errors.join(' | '));
 fs.writeFileSync(OUT+'/verify_free_variant_r54.json',JSON.stringify(report,null,1)+'\n');await browser.close();process.exit(report.checks.every(c=>c.pass)?0:1);})();
