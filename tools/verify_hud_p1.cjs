// U1 in Chromium: HUD text never truncated (no «…») at the four target sizes, on every playable step with an HUD,
// and the opening's toast does not survive into the next scene.
// U2: nothing in an HUD chip sticks out of its chip, and the pause panel shows every control on screen, unscrolled,
// at least 44 x 44 px, at the four target sizes in Italian and English, with no keyboard-key help text (D39).
// Usage: node tools/verify_hud_p1.cjs <url> <out.json>   (the output goes outside the repo)
const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const [url='http://127.0.0.1:8090/game/',out,only]=process.argv.slice(2);
if(!out){console.error('Usage: node tools/verify_hud_p1.cjs <url> <out.json> [step,step,…] (the output goes outside the repo; the optional list narrows the steps while developing)');process.exit(2);}
const VIEWPORTS=[[360,800],[390,844],[412,915],[844,390]],HUD_TYPES=new Set(['foot','drive','hub','escape']);
// Runs inside the page: every visible element of #hud, measured. Truncated = text clipped by overflow or ellipsis.
const audit=()=>{
 const hud=document.getElementById('hud'),W=innerWidth,H=innerHeight,problems=[];
 const visible=el=>{const r=el.getBoundingClientRect(),cs=getComputedStyle(el);return r.width>0&&r.height>0&&cs.display!=='none'&&cs.visibility!=='hidden';};
 const label=el=>(el.id?'#'+el.id:el.tagName.toLowerCase()+(el.className&&typeof el.className==='string'?'.'+el.className.trim().split(/\s+/).join('.'):''));
 if(hud.hidden||!visible(hud))return {shown:false,problems,bottom:0};
 for(const el of [hud,...hud.querySelectorAll('*')]){
  if(!visible(el))continue;const cs=getComputedStyle(el),r=el.getBoundingClientRect(),clipX=['hidden','clip','auto','scroll'].includes(cs.overflowX),clipY=['hidden','clip'].includes(cs.overflowY);
  if((cs.textOverflow==='ellipsis'||clipX)&&el.scrollWidth>el.clientWidth+1)problems.push({kind:'clipped-x',el:label(el),text:el.textContent.trim().slice(0,60),scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,ellipsis:cs.textOverflow==='ellipsis'});
  if(clipY&&el.scrollHeight>el.clientHeight+1)problems.push({kind:'clipped-y',el:label(el),text:el.textContent.trim().slice(0,60),scrollHeight:el.scrollHeight,clientHeight:el.clientHeight});
  if(r.left<-.5||r.top<-.5||r.right>W+.5||r.bottom>H+.5)problems.push({kind:'outside-screen',el:label(el),rect:[r.left,r.top,r.right,r.bottom].map(Math.round)});
 }
 for(const el of hud.querySelectorAll(':scope>div *')){
  if(!visible(el))continue;const chip=el.closest('#hud>div').getBoundingClientRect(),r=el.getBoundingClientRect();
  if(r.right>chip.right+.5)problems.push({kind:'outside-chip',el:label(el),right:Math.round(r.right),chipRight:Math.round(chip.right)});
 }
 const left=document.querySelector('.hud-left').getBoundingClientRect(),right=document.querySelector('.hud-right').getBoundingClientRect();
 if(left.right>right.left+.5)problems.push({kind:'chips-overlap',left:Math.round(left.right),right:Math.round(right.left)});
 return {shown:true,problems,bottom:Math.round(hud.getBoundingClientRect().bottom),district:document.getElementById('district').textContent,objective:document.getElementById('objective').textContent};
};
// seed() stops at a choice; this walks the remaining cards, lines and choices until the step is running.
const settle=async p=>{for(let k=0;k<60&&!(await p.evaluate(()=>window.cityAdventure.status().running));k++){if(await p.isVisible('#choice'))await p.click('#choice-options button');else if(await p.isVisible('#card'))await p.click('#card');else if(await p.isVisible('#talk'))await p.click('#next-line');else await p.waitForTimeout(80);}};
(async()=>{
 const {makeSave,seed}=require('./qa_v8.cjs'),{CAMPAIGN,FOOT,buildMission}=await import('../game/missions.mjs'),{DRIVING_MISSIONS}=await import('../game/driving.mjs'),{HUBS}=await import('../game/hubs.mjs'),{RACE_MODES_V9}=await import('../game/racing-v9.mjs');
 const steps=CAMPAIGN.filter(s=>HUD_TYPES.has(s.type)&&(!only||only.split(',').includes(s.id))).map(s=>s.id);
 // Every label the HUD can be asked to show, taken from the game data (the live sample below only sees what a step shows in its first seconds).
 const districts=[...Object.keys(FOOT).flatMap(id=>{const d=buildMission(id,{},'workshop').district;return [d+' · NOX',d+' · LULÙ'];}),...DRIVING_MISSIONS.map(m=>'GUIDA · '+m.title),...Object.values(HUBS).map(h=>h.name),...Object.values(RACE_MODES_V9).map(m=>m.it.toUpperCase()),'L’ASSE CROLLA','DUE COLPI','ASH DOCKS'];
 const objectives=[...Object.keys(FOOT).map(id=>buildMission(id,{},'workshop').goal),...DRIVING_MISSIONS.map(m=>m.goal+' · 100% · 3/3')].filter(Boolean).concat(['Muovi Nox · raccogli il vetro','Raggiungi Lulù · evita i cerchi rossi']);
 const meterLabels=['VORTEX · INTEGRITÀ','CAMION · INTEGRITÀ'];
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined}),checks=[],errors=[];
 const fail=(id,detail)=>{checks.push({id,result:'FAIL',...detail});};
 try{
  for(const [width,height] of VIEWPORTS){
   const vp=width+'x'+height,c=await browser.newContext({viewport:{width,height},hasTouch:true});
   // Live sample of each step with an HUD: right after entering and again a second later.
   for(const stepId of steps){
    const p=await c.newPage();p.on('pageerror',e=>errors.push(vp+' '+stepId+': '+e.message));
    try{
     await seed(p,url,stepId);await settle(p);await p.waitForTimeout(300);const first=await p.evaluate(audit);await p.waitForTimeout(1000);const second=await p.evaluate(audit);
     const problems=[...first.problems,...second.problems],mode=await p.evaluate(()=>window.cityAdventure.status().mode);
     if(!first.shown)problems.push({kind:'hud-not-shown',mode});
     if(!problems.length)checks.push({id:'hud-live',viewport:vp,step:stepId,mode,result:'PASS',hudBottom:second.bottom,district:second.district,objective:second.objective});
     else fail('hud-live',{viewport:vp,step:stepId,mode,problems});
    }catch(e){fail('hud-live',{viewport:vp,step:stepId,error:String(e.message||e)});}
    // Every label from the game data, one at a time, on the foot step (health bar) and on the drive step (integrity bar).
    if(stepId==='blackout'||stepId==='escape'){
     try{
      const bad=await p.evaluate(([audit,districts,objectives,meterLabels])=>{
       const run=new Function('return ('+audit+')')(),d=document.getElementById('district'),o=document.getElementById('objective'),m=document.querySelector('#hud .vital-meter:not([hidden]) [data-meter-label]');
       const keep=[d.textContent,o.textContent,m?.textContent],bad=[];
       for(const dist of districts){d.textContent=dist;const r=run();if(r.problems.length)bad.push({district:dist,problems:r.problems});}
       d.textContent=keep[0];
       for(const obj of objectives){o.textContent=obj;const r=run();if(r.problems.length)bad.push({objective:obj,problems:r.problems});}
       o.textContent=keep[1];
       if(m&&m.parentElement.id==='integrity')for(const l of meterLabels){m.textContent=l;const r=run();if(r.problems.length)bad.push({meter:l,problems:r.problems});}
       // The stealth/defend meter is shown only by some steps: force it open here so its width is always measured against the chip.
       const mt=document.getElementById('meter'),ml=document.getElementById('meter-label'),mHidden=mt.hidden,mKeep=ml.textContent;mt.hidden=false;
       for(const l of ['ALLERTA','ALLARME','128 s · 120 km/h']){ml.textContent=l;const r=run();if(r.problems.length)bad.push({stealthMeter:l,problems:r.problems});}
       mt.hidden=mHidden;ml.textContent=mKeep;
       if(m)m.textContent=keep[2];
       return bad;
      },[audit.toString(),districts,objectives,meterLabels]);
      if(!bad.length)checks.push({id:'hud-all-labels',viewport:vp,step:stepId,result:'PASS',districts:districts.length,objectives:objectives.length});
      else fail('hud-all-labels',{viewport:vp,step:stepId,problems:bad.slice(0,8),count:bad.length});
     }catch(e){fail('hud-all-labels',{viewport:vp,step:stepId,error:String(e.message||e)});}
    }
    if(stepId==='blackout'||stepId==='escape')await p.screenshot({path:out.replace(/\.json$/,'')+`-${stepId}-${vp}.png`});
    await p.close();
   }
   await c.close();
  }
  // The opening's toast must not outlive the opening: new game → two knocks → name → walk to the glass → pick it up → «home».
  {
   const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true}),p=await c.newPage();p.on('pageerror',e=>errors.push('opening: '+e.message));
   try{
    await p.goto(url);await p.evaluate(()=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');localStorage.removeItem('city-adventure-progress-v7');localStorage.removeItem('city-opening-seen-v8');});
    await p.reload();await p.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');
    const noticeState=()=>p.evaluate(()=>{const n=document.getElementById('notice');return {on:n.classList.contains('on'),opacity:+getComputedStyle(n).opacity,text:n.textContent};});
    await p.click('#start');await p.waitForSelector('#card:not([hidden])');await p.click('#card');
    await p.waitForSelector('#opening-surface:not([hidden])');await p.click('#opening-surface');await p.click('#opening-surface');
    await p.waitForSelector('#opening-name:visible');await p.click('#opening-name');await p.click('#opening-name');
    await p.waitForFunction(()=>window.cityAdventure.status().mode==='openingWalk'&&window.cityAdventure.status().running);
    const walking=await noticeState();assert.equal(walking.on,true,'the toast shows during the walk');assert.match(walking.text,/RACCOGLI/);
    const walkHud=await p.evaluate(audit);if(walkHud.shown&&!walkHud.problems.length)checks.push({id:'hud-opening-walk',viewport:'390x844',result:'PASS'});else fail('hud-opening-walk',{viewport:'390x844',problems:walkHud.problems,shown:walkHud.shown});
    // Touch only (the game is mobile-first): drag the stick up until the glass is in reach, then tap RACCOGLI and read the lines.
    const cdp=await c.newCDPSession(p),touch=(type,pts)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:pts.map(({x,y,id})=>({x,y,id,radiusX:4,radiusY:4,force:.8}))});
    const stick=await p.locator('#stick').boundingBox(),mid={x:stick.x+stick.width/2,y:stick.y+stick.height/2,id:0};
    await touch('touchStart',[mid]);await touch('touchMove',[{...mid,y:mid.y-34}]);
    try{await p.waitForFunction(()=>window.cityAdventure.snapshot().y<1180,null,{timeout:8000});}finally{await touch('touchEnd',[]);}
    await p.waitForSelector('#interact:not([hidden])');await p.tap('#interact');
    for(let k=0;k<60&&(await p.evaluate(()=>window.cityAdventure.status().step))==='opening';k++){if(await p.isVisible('#talk'))await p.click('#next-line');else await p.waitForTimeout(60);}
    await p.waitForFunction(()=>window.cityAdventure.status().step==='home',null,{timeout:8000});
    const atHome=await noticeState();
    await p.waitForTimeout(500);const settled=await noticeState();
    if(atHome.on||settled.opacity>.05||settled.on)fail('notice-clears-after-opening',{atHome,settled});
    else checks.push({id:'notice-clears-after-opening',result:'PASS',atHome,settled});
    await p.screenshot({path:out.replace(/\.json$/,'')+'-home-390x844.png'});
   }catch(e){fail('notice-clears-after-opening',{error:String(e.message||e)});}
   await c.close();
  }
  // Pause panel: opened with Esc on a foot step, measured as it first appears, then again after switching to English.
  for(const [width,height] of VIEWPORTS){
   const vp=width+'x'+height,c=await browser.newContext({viewport:{width,height},hasTouch:true}),p=await c.newPage();p.on('pageerror',e=>errors.push(vp+' pause: '+e.message));
   try{
    await seed(p,url,'blackout');await settle(p);await p.keyboard.press('Escape');await p.waitForSelector('#pause-panel:not([hidden])');
    for(const lang of ['it','en']){
     if(lang==='en'){await p.selectOption('#language','en');}
     await p.waitForTimeout(450);
     const m=await p.evaluate(()=>{
      const W=innerWidth,H=innerHeight,card=document.querySelector('#pause-panel .card'),problems=[],boxes={};
      for(const id of ['language','sound','reduced','haptics','pause-options','resume','restart-mission','menu-return']){
       const el=document.getElementById(id);if(el.hidden||getComputedStyle(el).display==='none'){if(id!=='restart-mission')problems.push({kind:'missing',id});continue;}
       const r=(el.type==='checkbox'?el.closest('label'):el).getBoundingClientRect();// a switch is the whole label; a select or button is itself
       boxes[id]=[r.left,r.top,r.right,r.bottom].map(Math.round);
       if(r.width<44||r.height<44)problems.push({kind:'target-too-small',id,w:Math.round(r.width),h:Math.round(r.height)});
       if(r.left<-.5||r.top<-.5||r.right>W+.5||r.bottom>H+.5)problems.push({kind:'outside-screen',id,rect:boxes[id]});
      }
      if(card.scrollTop!==0||card.scrollHeight>card.clientHeight+1)problems.push({kind:'card-scrolls',scrollTop:card.scrollTop,scrollHeight:card.scrollHeight,clientHeight:card.clientHeight});
      const text=card.innerText;
      if(/WASD|Tastiera|Keyboard|Maiusc|Shift dodge/.test(text))problems.push({kind:'keyboard-help',text:text.slice(0,200)});
      return {problems,boxes,text};
     });
     if(lang==='en'&&/Tastiera|Spara|Riprendi|Pausa|salvataggio|Vibrazione|Lingua/.test(m.text))m.problems.push({kind:'italian-in-english',text:m.text.slice(0,200)});
     if(!m.problems.length)checks.push({id:'pause-panel',viewport:vp,lang,result:'PASS',boxes:m.boxes});else fail('pause-panel',{viewport:vp,lang,problems:m.problems});
     if(lang==='it')await p.screenshot({path:out.replace(/\.json$/,'')+`-pausa-${vp}.png`});
    }
   }catch(e){fail('pause-panel',{viewport:vp,error:String(e.message||e)});}
   await c.close();
  }
  if(errors.length)fail('no-page-errors',{errors});
  const failed=checks.filter(x=>x.result!=='PASS');
  fs.writeFileSync(out,JSON.stringify({ok:!failed.length,passed:checks.length-failed.length,failed:failed.length,checks,errors},null,1));
  for(const f of failed)console.error('FAIL',JSON.stringify(f).slice(0,700));
  console.log((failed.length?'HUD P1 FAIL':'HUD P1 PASS')+' · '+(checks.length-failed.length)+' passed, '+failed.length+' failed');
  if(failed.length)process.exitCode=1;
 }catch(e){fs.writeFileSync(out,JSON.stringify({ok:false,checks,errors,failure:String(e.stack||e)},null,1));console.error(e);process.exitCode=1;}
 finally{await browser.close();}
})();
