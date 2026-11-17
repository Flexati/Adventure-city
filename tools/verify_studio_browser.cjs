// D78 (was R19, D61/D66): the studio intro is the author's three frames (head, charged head, name) over the storm sky of the
// key art, with the theme and the roar: no video, no buttons, bounded time, a tap passes through.
// [SIMULAZIONE] Chromium headless, started like the Android WebView (sound without a touch). It proves the contract, the
// geometry and the picture; it cannot hear, and it does not prove how the intro feels on a phone.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const [url='http://127.0.0.1:8090/game/',out='docs/evidence/ms1/studio']=process.argv.slice(2);
(async()=>{fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({executablePath:process.env.CHROMIUM,args:['--autoplay-policy=no-user-gesture-required']}),reports=[];
 try{for(const [kind,vp] of [['portrait',{width:390,height:844}],['small',{width:320,height:568}],['landscape',{width:844,height:390}],['desktop',{width:1280,height:800}],['reduced',{width:390,height:844}]]){
  const p=await b.newPage({viewport:vp,reducedMotion:kind==='reduced'?'reduce':'no-preference'}),errors=[],bad=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)bad.push(r.url());});
  await p.goto(url);await p.waitForSelector('#studio',{state:'visible'});const t0=Date.now();
  assert.equal(await p.locator('#studio video,#studio button').count(),0,'no video and no button in the intro');
  const art=await p.locator('.studio-art').evaluate(e=>({img:getComputedStyle(e).backgroundImage,w:innerWidth>=innerHeight}));
  assert.match(art.img,art.w?/jaguar_keyart_16x9\.webp/:/jaguar_keyart_9x16\.webp/,'the right crop of the sky for the orientation');
  const frames=await p.evaluate(()=>Promise.all(['f1','f2','f3'].map(k=>new Promise(done=>{const u=getComputedStyle(document.querySelector('#studio .studio-'+k)).backgroundImage.match(/url\("?([^")]+)/)?.[1],i=new Image();i.onload=()=>done([k,i.naturalWidth,i.naturalHeight]);i.onerror=()=>done([k,0,0]);i.src=u||'missing';}))));
  assert.deepEqual(frames,[['f1',960,424],['f2',960,424],['f3',960,424]],'the three frames load, all the same size');
  // First beat: the head alone. Third beat: the name. Opacities are read from the running animation.
  const seen=()=>p.evaluate(()=>Object.fromEntries(['f1','f2','f3'].map(k=>[k,+getComputedStyle(document.querySelector('#studio .studio-'+k)).opacity])));
  if(kind!=='reduced'){await p.waitForTimeout(Math.max(0,450-(Date.now()-t0)));const a=await seen();assert.ok(a.f1>.9&&a.f2<.05&&a.f3<.05,'0.45 s: the head alone '+JSON.stringify(a));
   await p.waitForTimeout(Math.max(0,1250-(Date.now()-t0)));const c=await seen();assert.ok(c.f2>.6&&c.f3<.05,'1.25 s: the charged head '+JSON.stringify(c));}
  await p.waitForTimeout(Math.max(0,(kind==='reduced'?350:2700)-(Date.now()-t0)));const z=await seen();assert.ok(z.f3>.95&&z.f1<.05&&z.f2<.05,'the name alone at the end '+JSON.stringify(z));
  // The name (columns 192-793 of the 960 of the frame) inside the screen; the shock wave a true circle.
  const geo=await p.evaluate(()=>{const r=s=>document.querySelector(s).getBoundingClientRect(),st=r('#studio .studio-stage'),ring=r('#studio .studio-ring');return {left:st.x+st.width*192/960,right:st.x+st.width*793/960,top:st.y,bottom:st.y+st.height,ringW:ring.width,ringH:ring.height,scroll:document.documentElement.scrollWidth};});
  assert.ok(geo.left>=4&&geo.right<=vp.width-4,'studio name inside the screen '+JSON.stringify(geo));assert.ok(geo.top>=0&&geo.bottom<=vp.height,'the picture inside the height');
  assert.ok(Math.abs(geo.ringW-geo.ringH)<1,'the shock wave is a circle');assert.equal(geo.scroll,vp.width,'the wide stage does not scroll the page');
  const share=(geo.right-geo.left)/vp.width;if(kind==='portrait'||kind==='small')assert.ok(share>.8,'upright, the name fills the width: '+share.toFixed(2));
  const played=await p.evaluate(()=>window.cityAdventure.status().audio.chronoPlayed?.sting||0);assert.equal(played,kind==='reduced'?1:2,'theme and roar start without a touch (reduced motion: the roar alone)');
  await p.screenshot({path:`${out}/${kind}.png`});
  if(kind==='portrait'){await p.click('#studio');await p.waitForSelector('#menu',{state:'visible',timeout:3000});}else await p.waitForSelector('#menu',{state:'visible',timeout:6000});
  const total=Date.now()-t0;if(kind!=='portrait')assert.ok(total<(kind==='reduced'?2600:5600),'bounded time: '+total+' ms');
  await p.reload();await p.waitForSelector('#menu',{state:'visible'});assert.equal(await p.isVisible('#studio'),false,'shown once per session');
  assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);reports.push({kind,result:'PASS',viewport:vp,name_share_of_width:+share.toFixed(3),stings:played,ms_to_menu:total});await p.close();}
 }finally{await b.close();}
 fs.writeFileSync(out+'/report.json',JSON.stringify({evidence:'[SIMULAZIONE] Chromium headless',reports},null,1)+'\n');console.log('PASS studio:',reports.length,'formati');
})().catch(e=>{console.error(e);process.exit(1);});
