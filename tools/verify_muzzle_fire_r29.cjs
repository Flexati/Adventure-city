// R29 (D73): in Chromium (not a phone), with assisted aim OFF, drag the fire button in 8 directions with Nox and with
// Lulù and photograph the muzzle fire, so it can be checked by eye that it leaves the barrel and points where the shot
// goes. Writes one contact sheet per hero and fails on any page error or game fault.
//   node tools/verify_muzzle_fire_r29.cjs http://127.0.0.1:8090/game/ <out-dir>     (CHROMIUM=<chrome> if needed)
const {chromium}=require('playwright'),qa=require('./qa_v8.cjs'),fs=require('fs'),path=require('path');
const [url='http://127.0.0.1:8090/game/',out='/tmp/fire-r29']=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
const CASES=[['docks_veyra','nox'],['app_breach','lulu']],DIRS=[0,45,90,135,180,225,270,315];
(async()=>{
 const b=await chromium.launch(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),report={url,cases:[],errors:[]};
 for(const [step,hero] of CASES){
  const c=await b.newContext({viewport:{width:390,height:844},hasTouch:true,deviceScaleFactor:2}),p=await c.newPage();
  p.on('pageerror',e=>report.errors.push(step+': '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))report.errors.push(step+' console: '+m.text().slice(0,300));});
  // a slowed clock for frames and performance.now together, so the 0.34 s fire can be photographed
  await c.addInitScript(()=>{const raf=window.requestAnimationFrame.bind(window),real=performance.now.bind(performance);let lr=real(),lv=lr;window.__slow=1;const now=()=>{const r=real();lv+=(r-lr)*window.__slow;lr=r;return lv;};performance.now=now;window.requestAnimationFrame=cb=>raf(()=>cb(now()));});
  const raw=await qa.makeSave(step);await p.goto(url);
  await p.evaluate(raw=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');localStorage.setItem('city-adventure-progress-v7',raw);localStorage.setItem('city-v4-settings',JSON.stringify({assist:false,sound:false}));},raw);
  await p.reload();await p.waitForFunction(()=>window.cityAdventure?.status().loaded);await p.click('#continue');
  const settle=async()=>{for(let k=0;k<120;k++){const st=await p.evaluate(()=>window.cityAdventure.status());if(st.running&&st.mode==='foot'&&!st.dialogue&&!st.uiLock)return;if(await p.isVisible('#talk'))await p.click('#next-line').catch(()=>{});else if(await p.isVisible('#card'))await p.click('#card').catch(()=>{});else{const ch=p.locator('#choice-options button:visible').first();if(await ch.count())await ch.click().catch(()=>{});}await p.waitForTimeout(120);}};
  await settle();const rec={step,hero,shots:[]};report.cases.push(rec);
  for(const deg of DIRS){
   await settle();await p.waitForFunction(()=>{const s=window.cityAdventure.snapshot();return !s.fireCd&&!s.action&&!(s.arsenal?.reloadRemaining>0);},null,{timeout:8000}).catch(()=>{});
   const s=await p.evaluate(()=>window.cityAdventure.snapshot()),cam=await p.evaluate(()=>window.cityAdventure.view()),a=deg*Math.PI/180,u={x:Math.cos(a),y:Math.sin(a)};
   const box=await p.locator('#gun').boundingBox(),cx=box.x+box.width/2,cy=box.y+box.height/2,ammo=s.arsenal?.ammo?.[s.arsenal.active];
   await p.evaluate(()=>{window.__slow=.04;});
   await p.mouse.move(cx,cy);await p.mouse.down();await p.mouse.move(cx+u.x*44,cy+u.y*44,{steps:4});await p.mouse.up();
   await p.waitForTimeout(4500);
   const hx=(s.x-cam.x)*cam.scale,hy=(s.y-cam.y)*cam.scale,clip={x:Math.max(0,Math.min(390-200,hx-100)),y:Math.max(0,Math.min(844-220,hy-160)),width:200,height:220};
   const file=path.join(out,`${hero}-${deg}.png`);await p.screenshot({path:file,clip});
   const fx=await p.evaluate(()=>window.cityAdventure.status().chrono?.fxActive??null);
   await p.evaluate(()=>{window.__slow=1;});await p.waitForTimeout(400);
   const after=await p.evaluate(()=>window.cityAdventure.snapshot());
   rec.shots.push({deg,file:path.basename(file),fired:(after.arsenal?.ammo?.[after.arsenal.active]??0)<ammo||after.arsenal?.reloadRemaining>0,fxActive:fx});
  }
  await c.close();
 }
 await b.close();
 const all=report.cases.flatMap(c=>c.shots);report.summary={shots:all.length,fired:all.filter(s=>s.fired).length,withFire:all.filter(s=>s.fxActive>0).length,errors:report.errors.length};
 report.pass=all.length===16&&all.every(s=>s.fired&&s.fxActive>0)&&!report.errors.length;
 fs.writeFileSync(path.join(out,'muzzle-fire-r29.json'),JSON.stringify(report,null,1));
 console.log(JSON.stringify(report.summary),report.pass?'PASS':'FAIL');process.exit(report.pass?0:1);
})();
