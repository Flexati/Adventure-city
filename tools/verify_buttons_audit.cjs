// R19 button audit: every <button> of game/index.html, per state, size, hit test, overlap and clipped labels,
// at six phone formats in Italian and English. [SIMULAZIONE]: Chromium with emulated touch, not a hand on a phone.
const {chromium}=require('playwright');const fs=require('node:fs');const qa=require('./qa_v8.cjs');
const [url='http://127.0.0.1:8090/game/',out='docs/evidence/r19/buttons']=process.argv.slice(2);
const VIEWS=[[360,800],[390,844],[430,932],[800,360],[844,390],[932,430]];
const measure=()=>{
 const rows=[];for(const b of document.querySelectorAll('button')){
  const r=b.getBoundingClientRect(),cs=getComputedStyle(b),shown=!!(b.offsetParent||cs.position==='fixed')&&cs.visibility!=='hidden'&&r.width>0&&r.height>0&&!b.closest('[hidden]');
  if(!shown)continue;
  const cx=r.left+r.width/2,cy=r.top+r.height/2,on=cx>=0&&cy>=0&&cx<=innerWidth&&cy<=innerHeight,top=on?document.elementFromPoint(cx,cy):null;
  rows.push({id:b.id||b.textContent.trim().slice(0,24)||b.className,w:Math.round(r.width),h:Math.round(r.height),l:r.left,t:r.top,r:r.right,b:r.bottom,disabled:b.disabled,
   inView:r.left>=-1&&r.top>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1,scrollable:!!b.closest('.card,[data-scroll]'),
   hit:!!top&&(top===b||b.contains(top)||top.closest('button')===b),modal:!!b.closest('.modal'),clipped:b.scrollWidth>b.clientWidth+1,hud:!!b.closest('#controls,#driving-controls,#hud,#weapon-controls')});
 }return rows;};
(async()=>{
 fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined}),findings=[],table=[];
 const all=[...fs.readFileSync('game/index.html','utf8').matchAll(/<button[^>]*\bid="([^"]+)"/g)].map(m=>m[1]),seen=new Set();
 for(const lang of ['it','en'])for(const [w,h] of VIEWS){
  const context=await browser.newContext({viewport:{width:w,height:h},hasTouch:true}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const prep=async()=>{await page.goto(url);await page.evaluate(lang=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');localStorage.setItem('city-v4-settings',JSON.stringify({sound:false,reduced:true,language:lang}));},lang);};
  const states={
   menu:async()=>{await prep();await page.reload();await page.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');},
   options:async()=>{await page.evaluate(()=>{const b=[...document.querySelectorAll('#menu button')].find(b=>/opzion|option|impostaz|setting/i.test(b.textContent));b?.click();});await page.waitForTimeout(300);},
   foot:async()=>{await prep();await qa.seed(page,url,'below');await page.waitForTimeout(400);},
   pause:async()=>{await page.evaluate(()=>document.getElementById('pause')?.click());await page.waitForTimeout(300);},
   drive:async()=>{await prep();await qa.seed(page,url,'escape');await page.waitForTimeout(400);}
  };
  for(const [state,enter] of Object.entries(states)){
   try{await enter();}catch(e){findings.push({state,lang,view:`${w}x${h}`,id:'(state)',issue:'state not reached: '+e.message.split('\n')[0]});continue;}
   const rows=await page.evaluate(measure);
   const modalOpen=await page.evaluate(()=>!!document.querySelector('.modal:not([hidden])'));
   for(const b of rows){seen.add(b.id);const where={state,lang,view:`${w}x${h}`,id:b.id};
    if(b.w<44||b.h<44)findings.push({...where,issue:`size ${b.w}x${b.h} < 44`});
    if(!b.inView&&!b.scrollable)findings.push({...where,issue:'outside the screen'});
    if(modalOpen&&!b.modal){if(b.hit)findings.push({...where,issue:'reachable behind an open modal'});continue;}
    if(b.inView&&!b.hit&&!b.disabled)findings.push({...where,issue:'covered: the centre does not hit the button'});
    if(b.clipped)findings.push({...where,issue:'label clipped'});}
   const hud=rows.filter(b=>b.hud&&b.inView);
   for(let i=0;i<hud.length;i++)for(let j=i+1;j<hud.length;j++){const a=hud[i],c=hud[j];if(a.l<c.r-1&&c.l<a.r-1&&a.t<c.b-1&&c.t<a.b-1)findings.push({state,lang,view:`${w}x${h}`,id:a.id+' / '+c.id,issue:'HUD buttons overlap'});}
   table.push({state,lang,view:`${w}x${h}`,buttons:rows.length});
  }
  if(errors.length)findings.push({state:'*',lang,view:`${w}x${h}`,id:'(page)',issue:'page error: '+errors[0]});
  await context.close();
 }
 await browser.close();
 const never=all.filter(id=>!seen.has(id));
 fs.writeFileSync(`${out}/buttons.json`,JSON.stringify({evidence:'[SIMULAZIONE] Chromium headless, tocco emulato',states:table,declared:all.length,never_shown_in_these_states:never,findings},null,1)+'\n');
 console.log(`pulsanti dichiarati ${all.length}; visti ${seen.size}; mai visti in questi stati ${never.length}; rilievi ${findings.length}`);
 const groups={};for(const f of findings){const k=f.id+' | '+f.issue+' | '+f.state;(groups[k]=groups[k]||[]).push(f.lang+' '+f.view);}
 for(const [k,v] of Object.entries(groups))console.log(' -',k,'|',v.length,'casi:',v.slice(0,4).join(', '));
 if(process.argv.includes('--strict')&&findings.length)process.exit(1);
})().catch(e=>{console.error(e);process.exit(1);});
