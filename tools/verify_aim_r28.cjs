// R28 (D72): in Chromium (not a phone), with assisted aim OFF, drag the fire button from the barrel towards the chest of a
// real foe of the mission, photograph the preview line and the bullet, and check the foe loses health. For each shot it
// also says whether the floor corridor of before R28 would have taken it.
//   node tools/verify_aim_r28.cjs http://127.0.0.1:8090/game/ <out-dir>     (CHROMIUM=<chrome> if needed)
const {chromium}=require('playwright'),qa=require('./qa_v8.cjs'),fs=require('fs'),path=require('path');
const [url='http://127.0.0.1:8090/game/',out='/tmp/aim-r28']=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
const CASES=(process.env.CASES?JSON.parse(process.env.CASES):[['docks_veyra',3],['app_clinic',3],['app_breach',3],['rooftop',2]]);
(async()=>{
 const {muzzleV9,foeBodyV9}=await import('../game/weapons-v9.mjs'),{trace}=await import('../game/campaign.mjs');
 // a foe counts only with a clear line from the hero (walls stop shots, as they should)
 const clear=(s,e)=>{const L=Math.hypot(e.x-s.x,e.y-s.y),end=trace({x:s.x,y:s.y,layoutId:s.layoutId},{x:(e.x-s.x)/L,y:(e.y-s.y)/L},L);return Math.hypot(end.x-s.x,end.y-s.y)>=L-6;};
 const b=await chromium.launch(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),report={url,cases:[],errors:[]};
 for(const [step,shots] of CASES){
  const c=await b.newContext({viewport:{width:390,height:844},hasTouch:true,deviceScaleFactor:2}),p=await c.newPage();p.on('pageerror',e=>report.errors.push(step+': '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))report.errors.push(step+' console: '+m.text().slice(0,300));});p.on('response',r=>{if(r.status()>=400)report.errors.push(step+' '+r.status()+' '+r.url());});
  // A slowed clock (frames and performance.now together): the game runs at window.__slow of real time, so a 0.2 s bullet
  // can be photographed and the hit-stop, timed on performance.now, stays in step.
  await c.addInitScript(()=>{const raf=window.requestAnimationFrame.bind(window),real=performance.now.bind(performance);let lr=real(),lv=lr;window.__slow=1;const now=()=>{const r=real();lv+=(r-lr)*window.__slow;lr=r;return lv;};performance.now=now;window.requestAnimationFrame=cb=>raf(()=>cb(now()));});
  const raw=await qa.makeSave(step);await p.goto(url);
  await p.evaluate(raw=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');localStorage.setItem('city-adventure-progress-v7',raw);localStorage.setItem('city-v4-settings',JSON.stringify({assist:false,sound:false}));},raw);
  await p.reload();await p.waitForFunction(()=>window.cityAdventure?.status().loaded);await p.click('#continue');
  for(let k=0;k<120;k++){const st=await p.evaluate(()=>window.cityAdventure.status());if(st.running&&st.mode==='foot'&&!st.dialogue)break;if(await p.isVisible('#talk')){await p.click('#next-line');continue;}if(await p.isVisible('#card')){await p.click('#card');continue;}const ch=p.locator('#choice-options button:visible').first();if(await ch.count())await ch.click();await p.waitForTimeout(120);}
  const rec={step,shots:[]};report.cases.push(rec);
  for(let n=0;n<shots;n++){
   // close a line of dialogue or a card first: they pause the play and the fire button
   const settle=async()=>{for(let k=0;k<40;k++){const st=await p.evaluate(()=>window.cityAdventure.status());if(!st.dialogue&&!st.uiLock&&!st.paused)return;if(await p.isVisible('#talk'))await p.click('#next-line').catch(()=>{});else if(await p.isVisible('#card'))await p.click('#card').catch(()=>{});await p.waitForTimeout(150);}};
   await settle();
   // walk towards the nearest foe (keys move only in an automated browser, D39) until one stands 110-250 px away
   let pick=null,held=[];const hold=async ks=>{for(const k of held)if(!ks.includes(k))await p.keyboard.up(k);for(const k of ks)if(!held.includes(k))await p.keyboard.down(k);held=ks;};
   for(let k=0;k<150&&!pick;k++){await p.waitForTimeout(150);const s=await p.evaluate(()=>window.cityAdventure.snapshot());if(s.status!=='playing')break;
    const live=(s.enemies||[]).filter(e=>e.hp>0&&e.state!=='dormant'&&!e.boss).map(e=>({e,d:Math.hypot(e.x-s.x,e.y-s.y)})).sort((a,b)=>a.d-b.d);
    const alone=t=>live.every(o=>o.e===t||(()=>{const L=Math.hypot(t.x-s.x,t.y-s.y),ux=(t.x-s.x)/L,uy=(t.y-s.y)/L,a=(o.e.x-s.x)*ux+(o.e.y-s.y)*uy;return a<0||a>L+60||Math.abs((o.e.x-s.x)*uy-(o.e.y-s.y)*ux)>90;})()),near=live.find(o=>o.d>110&&o.d<250&&clear(s,o.e)&&alone(o.e));if(near){pick={s,e:near.e};break;}
    const t=live[0]?.e;if(!t){await hold([]);continue;}const dx=t.x-s.x,dy=t.y-s.y,ks=[];if(Math.abs(dx)>40)ks.push(dx>0?'KeyD':'KeyA');if(Math.abs(dy)>40)ks.push(dy>0?'KeyS':'KeyW');await hold(live[0].d<110?ks.map(k=>({KeyD:'KeyA',KeyA:'KeyD',KeyS:'KeyW',KeyW:'KeyS'})[k]):ks);}
   await hold([]);
   if(!pick){rec.shots.push({n,result:'nessun nemico a tiro'});continue;}
   await settle();rec.paused=(rec.paused||0);
   // a player waits for the gun to be ready: no cooldown, no reload, no attack still playing
   await p.waitForFunction(()=>{const s=window.cityAdventure.snapshot();return !s.fireCd&&!s.action&&!(s.arsenal?.reloadRemaining>0);},null,{timeout:8000}).catch(()=>{});
   await p.evaluate(()=>{window.__slow=.04;});
   const s=await p.evaluate(()=>window.cityAdventure.snapshot()),e=s.enemies.find(x=>x.id===pick.e.id),cam=await p.evaluate(()=>window.cityAdventure.view());
   const r0=Math.hypot(e.x-s.x,e.y-s.y),rough={x:(e.x-s.x)/r0,y:(e.y-s.y)/r0},m=muzzleV9(s.hero,s.arsenal?.active,rough),body=foeBodyV9(e),d={x:e.x-(s.x+m.x),y:e.y-body.h/2-(s.y+m.y)},L=Math.hypot(d.x,d.y),u={x:d.x/L,y:d.y/L};
   if(process.env.DUMP)fs.writeFileSync(path.join(out,`${step}-${n}-state.json`),JSON.stringify({s,u}));
   const oldPerp=Math.abs((e.x-s.x)*u.y-(e.y-s.y)*u.x),before=e.hp;
   const box=await p.locator('#gun').boundingBox(),cx=box.x+box.width/2,cy=box.y+box.height/2;
   await p.mouse.move(cx,cy);await p.mouse.down();await p.mouse.move(cx+u.x*44,cy+u.y*44,{steps:4});await p.waitForTimeout(250);
   const hx=(s.x-cam.x)*cam.scale,hy=(s.y-cam.y)*cam.scale,clip={x:Math.max(0,Math.min(hx,(e.x-cam.x)*cam.scale)-90),y:Math.max(0,Math.min(hy,(e.y-cam.y)*cam.scale)-190),width:0,height:0};
   clip.width=Math.min(390-clip.x,Math.abs((e.x-s.x)*cam.scale)+180);clip.height=Math.min(844-clip.y,Math.abs((e.y-s.y)*cam.scale)+260);
   await p.screenshot({path:path.join(out,`${step}-${n}-mira.png`),clip});
   const ctlDown=await p.evaluate(()=>window.cityAdventure.controls());
   await p.mouse.up();
   const ctlUp=await p.evaluate(()=>({c:window.cityAdventure.controls(),st:window.cityAdventure.status(),sn:(({fireCd,action,actions,gunBuf})=>({fireCd,action:!!action,actions,gunBuf}))(window.cityAdventure.snapshot())}));if(process.env.DUMP)fs.writeFileSync(path.join(out,`${step}-${n}-ctl.json`),JSON.stringify({ctlDown,ctlUp}));
   for(let k=0;k<3;k++){await p.waitForTimeout(700);await p.screenshot({path:path.join(out,`${step}-${n}-colpo-${k}.png`),clip});}
   await p.evaluate(()=>{window.__slow=1;});await p.waitForTimeout(300);
   const snapAfter=await p.evaluate(()=>window.cityAdventure.snapshot()),after=snapAfter.enemies.find(x=>x.id===e.id);
   rec.shots.push({n,hero:s.hero,weapon:s.arsenal?.active||'c9',foe:e.role,distance:Math.round(Math.hypot(e.x-s.x,e.y-s.y)),aim:[+u.x.toFixed(3),+u.y.toFixed(3)],muzzle:m,hpBefore:before,hpAfter:after?.hp??0,hit:!after||after.hp<before,others:snapAfter.enemies.filter(x=>x.id!==e.id&&(s.enemies.find(y=>y.id===x.id)?.hp??0)>x.hp).map(x=>x.id),fired:(snapAfter.arsenal?.ammo?.[snapAfter.arsenal.active]??0)<(s.arsenal?.ammo?.[s.arsenal.active]??0)||snapAfter.arsenal?.reloadRemaining>0,ammo:[s.arsenal?.ammo,snapAfter.arsenal?.ammo],foeState:after?.state,oldCorridor:+oldPerp.toFixed(1),oldWouldHit:oldPerp<25});
  }
  await c.close();
 }
 await b.close();
 const all=report.cases.flatMap(c=>c.shots).filter(s=>'hit' in s);report.summary={shots:all.length,hit:all.filter(s=>s.hit).length,oldWouldHit:all.filter(s=>s.oldWouldHit).length,errors:report.errors.length};
 report.pass=all.length>=4&&all.every(s=>s.hit)&&!report.errors.length;
 fs.writeFileSync(path.join(out,'aim-r28.json'),JSON.stringify(report,null,1));
 console.log(JSON.stringify(report.summary),report.pass?'PASS':'FAIL');process.exit(report.pass?0:1);
})();
