// R37: the page receives the phone font scale from the Android shell (window.chronosAppVersion.fontScale, event
// 'chronosversion') and turns on its big-text mode at 1.15 and above, unless the player chose in Options. Three cases:
// font 1.3 with no choice -> on; font 1.3 with "big text" off in Options -> off; font 1.0 -> off. The choice must not be saved.
// [SIMULAZIONE] Chromium: the event is sent by hand as MainActivity.versionScript sends it; the phone itself is not tested.
//   node tools/verify_text_zoom_r37.cjs http://127.0.0.1:8090/game/      (CHROMIUM=<chrome>)
const {chromium}=require('playwright');
const url=process.argv[2]||'http://127.0.0.1:8090/game/';
(async()=>{const b=await chromium.launch(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),out=[],errs=[];
 for(const [name,scale,saved,want] of [['grande-senza-scelta',1.3,null,true],['grande-scelta-no',1.3,{bigText:false},false],['normale',1,null,false],['grande-scelta-si',1,{bigText:true},true]]){
  const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true});p.on('pageerror',e=>errs.push(e.message));
  await p.goto(url);await p.evaluate(s=>{sessionStorage.setItem('city-studio-shown','1');localStorage.removeItem('city-v4-settings');if(s)localStorage.setItem('city-v4-settings',JSON.stringify(s));},saved);
  await p.reload();await p.waitForFunction(()=>window.cityAdventure?.status?.().loaded);
  await p.evaluate(f=>{window.chronosAppVersion={name:'prova',code:1,fontScale:f};window.dispatchEvent(new Event('chronosversion'));},scale);
  const r=await p.evaluate(()=>({big:document.body.classList.contains('big-text'),stored:localStorage.getItem('city-v4-settings'),version:document.getElementById('app-version').textContent}));
  const ok=r.big===want&&(saved?JSON.parse(r.stored||'{}').bigText===saved.bigText:!/bigText/.test(r.stored||''))&&/prova/.test(r.version);
  out.push({name,scale,saved,big:r.big,stored:r.stored,ok});await p.close();
 }
 await b.close();console.log(JSON.stringify({cases:out,errors:errs.slice(0,5)}));
 const ok=out.every(c=>c.ok)&&!errs.length;console.log(ok?'PASS text zoom':'FAIL text zoom');process.exit(ok?0:1);
})();
