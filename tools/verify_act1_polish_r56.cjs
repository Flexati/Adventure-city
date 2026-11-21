// R56 (D96), paid line: the free app's teaser/unlock scenario is not here; every run is the paid app (no ChronosEdition).
// R56 (D96): browser proof of the Act I polish, in the PACKAGED page with the free-edition stubs (like verify_free_variant_r55.cjs).
// 1 stage card shows "Atto N · Tappa x di y"; 2 Blackout starts with NO blocking dialogue (the opener is a bark) and the first
// enemy is in play; 3 free app: teaser art shown, Veyra's competing hook never said, no stale toast, then the unlock screen with the
// buy button above the fold; 4 paid app (no edition): the hook line is still said and no teaser art ever appears; 5 EN labels.
const {chromium}=require('playwright');const fs=require('fs');const {makeSave}=require('./qa_v8.cjs');
const URL=process.argv[2]||'http://127.0.0.1:8090/android/build/assets/game/index.html',OUT='docs/evidence/r56';fs.mkdirSync(OUT,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});const report={checks:[]};const errors=[];
 const ok=(name,pass,detail)=>{report.checks.push({name,pass:!!pass,detail});console.log((pass?'PASS ':'FAIL ')+name+(detail!=null?' · '+detail:''));};
 async function open({edition,lang='it',save,vw=412,vh=860}){
  const ctx=await browser.newContext({viewport:{width:vw,height:vh},locale:lang==='en'?'en-US':'it-IT'});const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(({edition,lang,save})=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');if(save)localStorage.setItem('city-adventure-progress-v7',save);
   const kv={};window.ChronosNative={lang:()=>lang,get:k=>Object.prototype.hasOwnProperty.call(kv,k)?kv[k]:null,sync:()=>{}};
   if(edition){window.ChronosEdition={edition:()=>edition};window.ChronosStore={state:()=>JSON.stringify({entitled:false,status:'ready',price:'5,99 €'}),buy:()=>{},restore:()=>{}};}},{edition,lang,save});
  await page.goto(URL);await page.waitForFunction(()=>window.cityAdventure?.status().mode==='menu',null,{timeout:20000});return {ctx,page};}
 const vis=(page,id)=>page.evaluate(id=>{const e=document.getElementById(id);return !!e&&!e.hidden;},id);
 // 1+2 · Continue at Blackout (a fresh save at that stage) → card, then play
 {const {ctx,page}=await open({edition:undefined,save:await makeSave('blackout')});await page.click('#continue');const cards=[];let sawBlackoutTalk=false,inFoot=false,barkSeen=null,t0=Date.now();
  while(!inFoot&&Date.now()-t0<30000){
   if(await vis(page,'card')){const c=await page.evaluate(()=>({meta:document.getElementById('card-meta').textContent,step:window.cityAdventure.status().step}));if(!cards.some(x=>x.step===c.step))cards.push(c);await page.waitForTimeout(100);continue;}
   const st=await page.evaluate(()=>window.cityAdventure.status());
   if(st.step==='blackout'&&st.mode==='foot'&&st.running){inFoot=true;break;}
   if(await vis(page,'talk')){sawBlackoutTalk=true;await page.click('#next-line').catch(()=>{});continue;}
   await page.waitForTimeout(80);}
  ok('Blackout reaches play with no blocking dialogue',inFoot&&!sawBlackoutTalk,'cards='+JSON.stringify(cards.map(c=>c.meta)));
  ok('the stage card shows the position inside the act',cards.length===1&&/^Atto 1 · Tappa 3 di 6/.test(cards[0].meta),cards.map(c=>c.meta).join(' | '));
  for(let k=0;k<40&&!barkSeen;k++){barkSeen=await page.evaluate(()=>{const b=document.getElementById('bark');return b&&!b.hidden?b.textContent:null;});if(!barkSeen)await page.waitForTimeout(100);}
  ok('the opener arrives as a radio bark during play',/Hanno spento|Riaccendiamoli|Io tengo lontana/.test(barkSeen||''),barkSeen);
  await page.waitForTimeout(600);await page.screenshot({path:OUT+'/blackout_0of3.png'});
  ok('a notice never covers the visible bark (toast sits below it)',await page.evaluate(()=>{const b=document.getElementById('bark'),n=document.getElementById('notice');if(b.hidden||!n.classList.contains('on'))return true;const rb=b.getBoundingClientRect(),rn=n.getBoundingClientRect();return rn.top>=rb.bottom-1||rn.bottom<=rb.top+1;}));
  await ctx.close();}
 // 4 · paid app keeps the hook and never shows teaser art
 {const {ctx,page}=await open({edition:undefined,save:await makeSave('docks_veyra',{status:'cleared'})});await page.click('#continue');
  const said=[];let art=false,t0=Date.now();
  while(Date.now()-t0<30000&&said.length<12){
   if(await vis(page,'teaser-art'))art=true;
   if(await vis(page,'talk')){said.push(await page.textContent('#line'));await page.click('#next-line').catch(()=>{});if(said.some(t=>/sapete anche guidarla/.test(t)))break;continue;}
   if(await vis(page,'result')){const id=(await page.isVisible('#power'))?'#power':'#next';await page.click(id,{timeout:1500}).catch(()=>{});continue;}
   await page.waitForTimeout(100);}
  ok('paid: the "sapete anche guidarla" line is still said, no teaser art, no store',said.some(t=>/sapete anche guidarla/.test(t))&&!art&&!(await vis(page,'store-panel')));await ctx.close();}
 // 5 · English: card label and unlock
 {const {ctx,page}=await open({edition:undefined,lang:'en'});await page.click('#start');await page.waitForSelector('#card:not([hidden])',{timeout:10000});
  const meta=await page.textContent('#card-meta');ok('EN: card label',/^Act 1 · Stage 1 of 6/.test(meta),meta);await ctx.close();}
 report.errors=errors;fs.writeFileSync(OUT+'/verify_act1_polish_r56.json',JSON.stringify(report,null,2));
 ok('no page errors',errors.length===0,errors.slice(0,2).join(' | '));
 await browser.close();if(report.checks.some(c=>!c.pass)){process.exitCode=1;}})();
