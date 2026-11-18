// R52 (D93): the Android shell's bridge in the real page, with a stub of window.ChronosNative (what NativeBridge.java provides)
// injected before any page script runs, as addJavascriptInterface does. Proves the ORDER (a restored backup is in the page's
// storage before the game reads it), the language chain, a save over 100 KB, and that nothing goes out as a /__sync URL.
// It runs on the PACKAGED page (android/build/assets/game, after tools/prepare_android_assets.py): the bootstrap that does the restore
// ships only there. What it cannot prove: the Java side on a real WebView.
const {chromium}=require('playwright');const fs=require('fs');const {makeSave}=require('./qa_v8.cjs');
const URL=process.argv[2]||'http://127.0.0.1:8090/android/build/assets/game/index.html',OUT='docs/evidence/r52';fs.mkdirSync(OUT,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'});const report={checks:[]};
 const ok=(name,pass,detail)=>{report.checks.push({name,pass:!!pass,detail});console.log((pass?'PASS ':'FAIL ')+name+(detail!=null?' · '+detail:''));};
 const errors=[];
 // A legitimate large save: 3500 real story flags (the game keeps them through load+save), not padding it would drop.
 const flags={};for(let i=0;i<3500;i++)flags['pad.'+i]='«Città» '.repeat(8);const bigSave=await makeSave('vega',{flags});
 async function open({native,navLang,store}){
  const ctx=await browser.newContext({viewport:{width:412,height:860},locale:navLang});const page=await ctx.newPage();const urls=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>urls.push(r.url()));
  await page.addInitScript(({native,store})=>{if(!native)return;sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');
   const calls=[];window.__nativeCalls=calls;const kv={...store};
   window.ChronosNative={lang:()=>native,get:k=>Object.prototype.hasOwnProperty.call(kv,k)?kv[k]:null,sync:json=>{calls.push(json);}};},{native,store:store||{}});
  await page.goto(URL);await page.waitForFunction(()=>window.cityAdventure?.status().mode==='menu',null,{timeout:20000});
  return {ctx,page,urls};
 }
 // 1 · a restored backup with a 300 KB save: the storage is filled before the game reads it, so the menu offers to continue
 {const {ctx,page,urls}=await open({native:'it',navLang:'en-US',store:{'city-adventure-progress-v7':bigSave,'city-v4-settings':JSON.stringify({language:'en',sound:false})}});
  const r=await page.evaluate(()=>({len:(localStorage.getItem('city-adventure-progress-v7')||'').length,lang:window.cityAdventure.locale().language,settings:JSON.parse(localStorage.getItem('city-v4-settings')||'{}'),cont:!document.getElementById('continue').hidden}));
  ok('restore: the 300 KB save is back in the page storage before the game starts',r.len===bigSave.length,r.len+' of '+bigSave.length+' chars');
  ok('restore: the game offers to continue the restored save',r.cont===true);
  ok('restore: the restored settings win over the shell\'s language and the phone\'s',r.lang==='en'&&r.settings.sound===false,JSON.stringify({lang:r.lang,sound:r.settings.sound}));
  await page.click('#continue');await page.waitForFunction(()=>window.cityAdventure.status().running||document.getElementById('card')&&!document.getElementById('card').hidden,null,{timeout:20000});
  await page.evaluate(()=>window.dispatchEvent(new Event('citynativepause')));await page.waitForTimeout(300);
  const calls=await page.evaluate(()=>window.__nativeCalls);
  ok('sync: going to the background flushes a call to the bridge',calls.length>=1,calls.length+' call(s)');
  const parsed=calls.map(c=>JSON.parse(c));const merged=Object.assign({},...parsed);
  ok('sync: calls are JSON objects with only the allowed fields',parsed.every(o=>Object.keys(o).every(k=>['lang','save','backup','settings'].includes(k))),calls.map(c=>Object.keys(JSON.parse(c)).join('+')).join(' | '));
  ok('sync: the language travels with the settings',merged.lang==='en'||merged.lang==='it',merged.lang);
  const biggest=Math.max(0,...calls.map(c=>c.length));ok('sync: a call carries more than 100 KB in one piece (the old GET could not)',biggest>100*1024,'largest call this run: '+biggest+' chars');
  ok('sync: no /__sync request was made',!urls.some(u=>u.includes('__sync')),String(urls.filter(u=>u.includes('__sync')).length));
  await ctx.close();}
 // 2 · first start, nothing saved: the shell's choice decides, whatever the phone says
 for(const [native,navLang] of [['it','en-US'],['en','it-IT']]){
  const {ctx,page}=await open({native,navLang,store:{}});const lang=await page.evaluate(()=>window.cityAdventure.locale().language);
  ok('first start: shell says '+native+', phone says '+navLang+' → the game speaks '+native,lang===native,lang);await ctx.close();}
 // 3 · no shell (a browser): the phone's language, as before, and no error
 {const ctx=await browser.newContext({viewport:{width:412,height:860},locale:'it-IT'});const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{sessionStorage.setItem('city-studio-shown','1');});await page.goto(URL);await page.waitForFunction(()=>window.cityAdventure?.status().mode==='menu',null,{timeout:20000});
  ok('no shell: the phone\'s language (it-IT) decides',await page.evaluate(()=>window.cityAdventure.locale().language)==='it');await ctx.close();}
 ok('no page errors',!errors.length,errors.join(' | '));
 fs.writeFileSync(OUT+'/verify_native_bridge_r52.json',JSON.stringify(report,null,1)+'\n');await browser.close();process.exit(report.checks.every(c=>c.pass)?0:1);})();
