// D80: the menu always shows Nox and Lulù together. Measured on the real page (Chromium headless, [SIMULAZIONE]): from the first frame
// the two heroes have the same opacity, they are both inside the screen once settled, and neither is hidden or collapsed.
// Before D80 Lulù was at 100% on the first frame and Nox at 0%, so the menu opened with her alone for about 0.7 s.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const [url='http://127.0.0.1:8090/game/',out='docs/evidence/ms1/menu-heroes']=process.argv.slice(2);
(async()=>{fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({executablePath:process.env.CHROMIUM}),reports=[];
 try{for(const [w,h] of [[390,844],[360,800],[412,915],[320,568],[360,640],[844,390],[1280,800]]){
  const c=await b.newContext({viewport:{width:w,height:h},hasTouch:true});await c.addInitScript(()=>{try{sessionStorage.setItem('city-studio-shown','1');}catch{}});
  const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(url,{waitUntil:'commit'});
  await p.waitForFunction(()=>{const m=document.getElementById('menu');return m&&!m.hidden;},{timeout:15000,polling:'raf'});
  const read=()=>p.evaluate(()=>{const f=s=>{const e=document.querySelector(s),r=e.getBoundingClientRect(),cs=getComputedStyle(e);const vw=Math.max(0,Math.min(innerWidth,r.right)-Math.max(0,r.left)),vh=Math.max(0,Math.min(innerHeight,r.bottom)-Math.max(0,r.top));return {opacity:+(+cs.opacity).toFixed(2),shown:cs.display!=='none'&&cs.visibility!=='hidden',inside:r.width?+(vw*vh/(r.width*r.height)).toFixed(2):0,w:Math.round(r.width)};};return {nox:f('.mh.nox'),lulu:f('.mh.lulu')};});
  let worst=0,samples=0;const t0=Date.now();
  while(Date.now()-t0<1400){const r=await read();worst=Math.max(worst,Math.abs(r.nox.opacity-r.lulu.opacity));samples++;await p.waitForTimeout(40);}
  assert.ok(worst<=.04,`${w}x${h}: Nox and Lulù enter at the same pace (largest gap ${worst})`);
  const r=await read();for(const k of ['nox','lulu']){assert.ok(r[k].shown&&r[k].opacity>=.99,`${w}x${h} ${k} visible: ${JSON.stringify(r[k])}`);assert.ok(r[k].inside>=.98,`${w}x${h} ${k} inside the screen: ${r[k].inside}`);assert.ok(r[k].w>=60,`${w}x${h} ${k} not collapsed: ${r[k].w}px`);}
  await p.screenshot({path:`${out}/menu-${w}x${h}.png`});assert.deepEqual(errors,[]);reports.push({viewport:`${w}x${h}`,samples,largest_opacity_gap:+worst.toFixed(3),nox_px:r.nox.w,lulu_px:r.lulu.w,result:'PASS'});await c.close();}
 }finally{await b.close();}
 fs.writeFileSync(out+'/report.json',JSON.stringify({evidence:'[SIMULAZIONE] Chromium headless',reports},null,1)+'\n');console.log('PASS menu heroes:',reports.length,'formati');
})().catch(e=>{console.error(e);process.exit(1);});
