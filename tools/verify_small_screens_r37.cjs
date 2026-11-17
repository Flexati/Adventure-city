// R37: from R37 the big-text mode is on by default for phones with the font at Large or above (MainActivity passes
// fontScale). Here it is measured where it is most likely to break: small screens. A 360x640 dp phone (Android 8, minSdk 26)
// gives the WebView about 360x568 once status and navigation bars are padded (24 + 48 dp), 592x336 in landscape; 360x640
// and 360x800 as well. On steps that open with lines, every line up to 12: the dialogue box and its "Avanti" inside the
// screen, "Avanti" at least 44 x 44 px, the line not clipped. A choice, when it appears: every option reachable (on screen,
// or in a card that scrolls), at least 44 px tall, its text not clipped. The pause panel, Italian and English: every
// control on screen, at least 44 px, no hidden scroll (at 360x640 «Menu principale» was off screen before R37).
// The main menu in portrait, with and without a save («Continua» shown): the heroes do not cover the title block or the
// studio label, and every button is on screen (before R37, Nox covered the kicker and CHRONOS up to 720 px tall).
// [SIMULAZIONE] Chromium, not a phone.
//   node tools/verify_small_screens_r37.cjs http://127.0.0.1:8090/game/ <out-dir>     (CHROMIUM=<chrome>)
const {chromium}=require('playwright'),qa=require('./qa_v8.cjs'),fs=require('fs'),path=require('path');
const [url='http://127.0.0.1:8090/game/',out='/tmp/bigtext-r37']=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
const VIEWPORTS=[[360,568],[592,336],[360,640],[360,800]],STEPS=['blackout','docks_veyra','bone_tyrant','vega','finale','moon','toxic'];
const measureTalk=()=>{const W=innerWidth,H=innerHeight,P=[],r=e=>e.getBoundingClientRect(),inside=b=>b.left>=-.5&&b.top>=-.5&&b.right<=W+.5&&b.bottom<=H+.5;
 const talk=document.getElementById('talk'),line=document.getElementById('line'),next=document.getElementById('next-line');if(talk.hidden)return null;
 const t=r(talk),n=r(next),cs=getComputedStyle(line);
 if(!inside(t))P.push({kind:'talk-outside',rect:[t.left,t.top,t.right,t.bottom].map(Math.round)});
 if(!inside(n))P.push({kind:'next-outside',rect:[n.left,n.top,n.right,n.bottom].map(Math.round)});
 if(n.width<44||n.height<44)P.push({kind:'next-small',w:Math.round(n.width),h:Math.round(n.height)});
 if(['hidden','clip'].includes(cs.overflowY)&&line.scrollHeight>line.clientHeight+1)P.push({kind:'line-clipped',text:line.textContent.slice(0,80)});
 for(const el of talk.querySelectorAll('*')){const b=r(el);if(b.width&&b.height&&(b.bottom>t.bottom+1||b.right>t.right+1))P.push({kind:'outside-box',el:el.id||el.className,text:(el.textContent||'').slice(0,40)});}
 return {problems:P,text:line.textContent.slice(0,60),fontPx:parseFloat(cs.fontSize)};};
const measureChoice=()=>{const W=innerWidth,H=innerHeight,P=[],card=document.querySelector('#choice .card');if(document.getElementById('choice').hidden)return null;
 const scrolls=card.scrollHeight>card.clientHeight+1&&['auto','scroll'].includes(getComputedStyle(card).overflowY),c=card.getBoundingClientRect();
 if(c.left<-.5||c.right>W+.5||c.top<-.5||c.bottom>H+.5)P.push({kind:'card-outside',rect:[c.left,c.top,c.right,c.bottom].map(Math.round)});
 for(const b of document.querySelectorAll('#choice-options button')){const r=b.getBoundingClientRect();
  if(r.height<44)P.push({kind:'option-small',h:Math.round(r.height),text:b.textContent.slice(0,40)});
  if(r.left<c.left-.5||r.right>c.right+.5)P.push({kind:'option-outside-x',text:b.textContent.slice(0,40)});
  if(!scrolls&&(r.top<c.top-.5||r.bottom>c.bottom+.5))P.push({kind:'option-unreachable',text:b.textContent.slice(0,40)});
  for(const el of b.querySelectorAll('*')){const s=getComputedStyle(el);if(['hidden','clip'].includes(s.overflowX)&&el.scrollWidth>el.clientWidth+1)P.push({kind:'option-text-clipped',text:el.textContent.slice(0,40)});}}
 return {problems:P,options:document.querySelectorAll('#choice-options button').length,scrolls};};
(async()=>{const b=await chromium.launch(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),checks=[],errors=[];
 for(const [width,height] of VIEWPORTS){const vp=width+'x'+height;
  for(const step of STEPS){const c=await b.newContext({viewport:{width,height},hasTouch:true});
   await c.addInitScript(()=>{try{localStorage.setItem('city-v4-settings',JSON.stringify({bigText:true}));}catch{}});
   const p=await c.newPage();p.on('pageerror',e=>errors.push(vp+' '+step+': '+e.message));
   try{await qa.seed(p,url,step,{stopOnDialogue:true});
    if(!(await p.evaluate(()=>document.body.classList.contains('big-text'))))errors.push(vp+' '+step+': big-text not on');
    let lines=0,shot=false;
    for(let k=0;k<40&&lines<12;k++){
     const talk=await p.evaluate(measureTalk),choice=await p.evaluate(measureChoice);
     if(talk){lines++;checks.push({vp,step,kind:'line',...talk,result:talk.problems.length?'FAIL':'PASS'});if(!shot){await p.screenshot({path:path.join(out,`${step}-${vp}.png`)});shot=true;}await p.click('#next-line').catch(()=>{});await p.waitForTimeout(60);continue;}
     if(choice){checks.push({vp,step,kind:'choice',...choice,result:choice.problems.length?'FAIL':'PASS'});await p.screenshot({path:path.join(out,`${step}-${vp}-scelta.png`)});await p.click('#choice-options button').catch(()=>{});await p.waitForTimeout(80);continue;}
     if(await p.isVisible('#card')){await p.click('#card').catch(()=>{});continue;}
     await p.waitForTimeout(120);if(await p.evaluate(()=>window.cityAdventure.status().running)&&!(await p.isVisible('#talk')))break;
    }
    if(!lines)checks.push({vp,step,kind:'no-dialogue',result:'INFO'});
   }catch(e){checks.push({vp,step,kind:'error',error:String(e.message).slice(0,200),result:'FAIL'});}
   await c.close();}
  // Pause panel on a running foot step, as verify_hud_p1 measures it, at these smaller sizes.
  {const c=await b.newContext({viewport:{width,height},hasTouch:true}),p=await c.newPage();p.on('pageerror',e=>errors.push(vp+' pause: '+e.message));
   try{await qa.seed(p,url,'blackout');
    for(let k=0;k<60&&!(await p.evaluate(()=>window.cityAdventure.status().running));k++){if(await p.isVisible('#choice'))await p.click('#choice-options button');else if(await p.isVisible('#card'))await p.click('#card');else if(await p.isVisible('#talk'))await p.click('#next-line');else await p.waitForTimeout(80);}
    await p.keyboard.press('Escape');await p.waitForSelector('#pause-panel:not([hidden])');
    for(const lang of ['it','en']){if(lang==='en')await p.selectOption('#language','en');await p.waitForTimeout(450);
     const P=await p.evaluate(()=>{const W=innerWidth,H=innerHeight,card=document.querySelector('#pause-panel .card'),P=[];
      for(const id of ['language','sound','reduced','haptics','pause-options','resume','restart-mission','menu-return']){const el=document.getElementById(id);if(el.hidden||getComputedStyle(el).display==='none')continue;
       const r=(el.type==='checkbox'?el.closest('label'):el).getBoundingClientRect();if(r.width<44||r.height<44)P.push({kind:'target-too-small',id,h:Math.round(r.height)});
       if(r.top<-.5||r.bottom>H+.5||r.left<-.5||r.right>W+.5)P.push({kind:'outside-screen',id,rect:[r.left,r.top,r.right,r.bottom].map(Math.round)});}
      if(card.scrollHeight>card.clientHeight+1)P.push({kind:'card-scrolls',scrollHeight:card.scrollHeight,clientHeight:card.clientHeight});return P;});
     checks.push({vp,step:'blackout',kind:'pause',lang,problems:P,result:P.length?'FAIL':'PASS'});
     if(lang==='it')await p.screenshot({path:path.join(out,`pausa-${vp}.png`)});}
   }catch(e){checks.push({vp,kind:'pause',error:String(e.message).slice(0,200),result:'FAIL'});}
   await c.close();}
 }
 // Main menu, portrait, with and without a save. Landscape is left out on purpose: there the heroes stand behind the
 // buttons' right edge and only their transparent cell margins touch (seen in screenshots), which a box test cannot tell.
 const raw=await qa.makeSave('docks_veyra');
 for(const [width,height] of [[360,568],[360,640],[390,700],[360,720],[390,772],[412,800],[390,844]])for(const save of [false,true]){
  const p=await b.newPage({viewport:{width,height},hasTouch:true});p.on('pageerror',e=>errors.push(width+'x'+height+' menu: '+e.message));
  await p.goto(url);await p.evaluate(([r,s])=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-v4-settings',JSON.stringify({reduced:true}));if(s)localStorage.setItem('city-adventure-progress-v7',r);else localStorage.removeItem('city-adventure-progress-v7');},[raw,save]);
  await p.reload();await p.waitForFunction(()=>window.cityAdventure?.status?.().mode==='menu');await p.waitForTimeout(700);
  const m=await p.evaluate(()=>{const hs=[...document.querySelectorAll('.mh')].map(e=>e.getBoundingClientRect()),hb={l:Math.min(...hs.map(r=>r.left)),r:Math.max(...hs.map(r=>r.right)),t:Math.min(...hs.map(r=>r.top)),b:Math.max(...hs.map(r=>r.bottom))};
   const parts=[...document.querySelectorAll('#menu .title > *')].filter(e=>e.offsetParent&&getComputedStyle(e).display!=='none'&&e.id!=='loading').map(e=>({id:e.id||e.className||e.tagName,r:e.getBoundingClientRect()}));
   const P=parts.filter(x=>x.r.left<hb.r-8&&x.r.right>hb.l+8&&x.r.top<hb.b-6&&x.r.bottom>hb.t+6).map(x=>({kind:'heroes-cover',id:x.id}));
   const ed=document.querySelector('.menu-edition'),er=ed.getBoundingClientRect();if(getComputedStyle(ed).display!=='none'&&er.bottom>hb.t-2&&er.right>hb.l+8)P.push({kind:'heroes-cover',id:'menu-edition'});
   for(const e of document.querySelectorAll('#menu button'))if(e.offsetParent){const r=e.getBoundingClientRect();if(r.bottom>innerHeight+.5)P.push({kind:'button-outside',id:e.id});if(r.height<44)P.push({kind:'button-small',id:e.id});}
   return P;});
  checks.push({vp:width+'x'+height,kind:'menu',save,problems:m,result:m.length?'FAIL':'PASS'});
  if(save&&width===360&&height===568)await p.screenshot({path:path.join(out,'menu-360x568-salvataggio.png')});await p.close();}
 await b.close();const failed=checks.filter(x=>x.result==='FAIL');
 fs.writeFileSync(path.join(out,'small-screens-r37.json'),JSON.stringify({passed:checks.filter(x=>x.result==='PASS').length,failed:failed.length,errors,checks},null,1));
 for(const f of failed.slice(0,12))console.error('FAIL',JSON.stringify(f).slice(0,400));
 console.log(`${failed.length||errors.length?'FAIL':'PASS'} small screens · ${checks.filter(x=>x.result==='PASS').length} passed, ${failed.length} failed, ${errors.length} page errors`);
 process.exit(failed.length||errors.length?1:0);
})();
