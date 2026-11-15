// R36: the "monkey" stress test. For each scenario, about 75 s of random input as an impatient player would give it:
// taps anywhere and on any visible button, joystick drags, Esc, the app sent to background and back, the screen turned.
// Watches for: page errors, console errors, the fault panel ("Qualcosa si è inceppato"), HTTP errors, non-finite numbers,
// negative coins or scrap, health out of range, a game that stops running with nothing on screen to explain it.
// [SIMULAZIONE] Chromium, not a phone; random input finds crashes and dead ends, not whether the game is fun.
//   node tools/monkey_r36.cjs http://127.0.0.1:8090/game/ <out-dir>      (CHROMIUM=<chrome>; MONKEY_SECONDS, MONKEY_SEED)
const {chromium}=require('playwright'),qa=require('./qa_v8.cjs'),fs=require('fs'),path=require('path');
const [url='http://127.0.0.1:8090/game/',out='/tmp/monkey-r36']=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
const SECONDS=+(process.env.MONKEY_SECONDS||75);let seed=+(process.env.MONKEY_SEED||36);const rnd=()=>(seed=(seed*1664525+1013904223)>>>0)/4294967296;
const ALL=[['menu',null],['opening',null],['hub-moon','moon'],['foot-docks','docks_veyra'],['boss-tyrant','bone_tyrant'],['drive-escape','escape'],['boss-vega','vega'],['hub-toxic','toxic'],['finale','finale']];
// MONKEY_PLAY_ONLY=1: taps only the play controls and the screen below the top bar, never pause or menu, so drives and
// fights last the whole run. MONKEY_SCENARIOS=a,b picks scenarios by name.
const PLAY_ONLY=process.env.MONKEY_PLAY_ONLY==='1',PLAY_IDS='#gun,#magic,#dash,#duo,#interact,#heal,#weapon-change,#weapon-reload,#pulse,#nitro,#brake,#accelerate,#next-line,#card,#choice-options button,#hold-button';
const SCENARIOS=process.env.MONKEY_SCENARIOS?ALL.filter(s=>process.env.MONKEY_SCENARIOS.split(',').includes(s[0])):ALL;
(async()=>{
 const b=await chromium.launch(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),report={url,seconds:SECONDS,scenarios:[]};
 for(const [name,step] of SCENARIOS){
  const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true}),p=await ctx.newPage(),issues=[],add=(k,v)=>{if(issues.length<40&&!issues.some(i=>i.kind===k&&i.detail===v))issues.push({kind:k,detail:v,t:+((Date.now()-t0)/1000).toFixed(1)});};
  let t0=Date.now();
  p.on('pageerror',e=>add('pageerror',String(e.message).slice(0,200)));
  p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))add('console',m.text().slice(0,200));});
  p.on('response',r=>{if(r.status()>=400&&!/favicon/.test(r.url()))add('http',r.status()+' '+r.url().replace(url,''));});
  if(step){await qa.seed(p,url,step);}else{await p.goto(url);if(name==='menu'){await p.evaluate(()=>{sessionStorage.setItem('city-studio-shown','1');});await p.reload();}else{await p.evaluate(()=>{sessionStorage.setItem('city-studio-shown','1');localStorage.removeItem('city-adventure-progress-v7');});await p.reload();}}
  await p.waitForFunction(()=>window.cityAdventure?.status?.().loaded,null,{timeout:20000}).catch(()=>add('boot','never loaded'));
  if(name==='opening')await p.click('#start').catch(()=>{});
  t0=Date.now();let actions=0,quiet=0,landscape=false;const modes=new Set();
  while(Date.now()-t0<SECONDS*1000){
   const r=rnd();
   try{
    if(r<.45){const H=landscape?390:844,W=landscape?844:390;await p.touchscreen.tap(Math.floor(rnd()*W),Math.floor((PLAY_ONLY?.15+rnd()*.85:rnd())*H));}
    else if(r<.75){const btns=PLAY_ONLY?await p.$$(PLAY_IDS):await p.$$('button:visible, #card:visible, #talk:visible');if(btns.length){const el=btns[Math.floor(rnd()*btns.length)];const box=await el.boundingBox();if(box)await p.touchscreen.tap(box.x+box.width/2,box.y+box.height/2);}}
    else if(r<.88){const x=20+rnd()*150,y=(landscape?150:450)+rnd()*200;await p.mouse.move(x,y);await p.mouse.down();await p.mouse.move(x+(rnd()-.5)*160,y+(rnd()-.5)*160,{steps:4});await p.waitForTimeout(150+rnd()*500);await p.mouse.up();}
    else if(r<.91){if(!PLAY_ONLY)await p.keyboard.press('Escape');else{const d=await p.$('#drive-stick'),box=d&&await d.boundingBox();if(box){const cx=box.x+box.width/2,cy=box.y+box.height/2;await p.mouse.move(cx,cy);await p.mouse.down();await p.mouse.move(cx+(rnd()-.5)*90,cy,{steps:3});await p.waitForTimeout(300+rnd()*700);await p.mouse.up();}}}
    else if(r<.94){await p.evaluate(()=>window.dispatchEvent(new Event('citynativepause')));await p.waitForTimeout(200+rnd()*600);await p.evaluate(()=>window.dispatchEvent(new Event('citynativeresume')));}
    else if(r<.96){landscape=!landscape;await p.setViewportSize(landscape?{width:844,height:390}:{width:390,height:844});}
    else if(r<.97){await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});await p.waitForTimeout(300);await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'));});}
    else{await p.waitForTimeout(400);}
   }catch(e){if(!/Target closed|detached|not attached|not visible|outside of the viewport|intercepts pointer/.test(e.message))add('driver',String(e.message).slice(0,120));}
   actions++;
   if(actions%12===0){
    const st=await p.evaluate(()=>{const a=window.cityAdventure;if(!a)return null;const s=a.status(),sn=a.snapshot(),pr=a.progress();const fault=!document.getElementById('fault-panel')?.hidden;
     const shown=[...document.querySelectorAll('section,dialog,[role=dialog],.panel,#talk,#card,#menu,#options,#pause-panel,#hub-menu,#interior,#choice')].some(e=>!e.hidden&&e.offsetParent!==null);
     return {mode:s.mode,running:s.running,paused:s.paused,uiLock:s.uiLock,fault,shown,hp:sn?.hp,maxHp:sn?.maxHp,x:sn?.x,y:sn?.y,coins:pr?.world?.coins,scrap:pr?.world?.scrap};}).catch(()=>null);
    if(st){modes.add(st.mode);if(st.fault)add('fault','fault panel shown in mode '+st.mode);
     for(const k of ['hp','maxHp','x','y','coins','scrap'])if(st[k]!=null&&!Number.isFinite(st[k]))add('nan',k+'='+st[k]+' in '+st.mode);
     if(st.coins<0||st.scrap<0)add('economy','negative coins/scrap '+st.coins+'/'+st.scrap);
     if(st.hp!=null&&st.maxHp&&(st.hp<0||st.hp>st.maxHp))add('hp','hp '+st.hp+'/'+st.maxHp);
     if(!st.running&&!st.shown&&!st.paused&&!['menu','loading','ending','scene','card'].includes(st.mode))quiet++;else quiet=0;
     if(quiet>=6)add('stuck','not running and nothing on screen in mode '+st.mode);}
   }
  }
  await p.screenshot({path:path.join(out,name+'.png')}).catch(()=>{});
  report.scenarios.push({name,step,actions,modes:[...modes],issues});console.log(name.padEnd(14),'azioni',actions,'modi',[...modes].join(','),'problemi',issues.length?JSON.stringify(issues).slice(0,600):'nessuno');
  await ctx.close();
 }
 await b.close();report.issues=report.scenarios.reduce((n,s)=>n+s.issues.length,0);fs.writeFileSync(path.join(out,'monkey-r36.json'),JSON.stringify(report,null,1));
 console.log(report.issues?'PROBLEMI: '+report.issues:'PASS monkey: nessun problema');process.exit(report.issues?1:0);
})();
