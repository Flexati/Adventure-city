// R19 (D61): the studio intro is the key art of the pack plus CSS lightning: no video, no buttons, bounded time, tap passes through.
// [SIMULAZIONE] Chromium headless; it proves the contract and the picture, not how it feels on a phone.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const [url='http://127.0.0.1:8090/game/',out='docs/evidence/r19/studio']=process.argv.slice(2);
(async()=>{fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({executablePath:process.env.CHROMIUM}),reports=[];
 try{for(const [kind,vp] of [['portrait',{width:390,height:844}],['small',{width:360,height:800}],['landscape',{width:844,height:390}],['desktop',{width:1280,height:800}],['reduced',{width:390,height:844}]]){
  const p=await b.newPage({viewport:vp,reducedMotion:kind==='reduced'?'reduce':'no-preference'}),errors=[],bad=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)bad.push(r.url());});
  await p.goto(url);await p.waitForSelector('#studio',{state:'visible'});
  assert.equal(await p.locator('#studio video,#studio button').count(),0,'no video and no button in the intro');
  const art=await p.locator('.studio-art').evaluate(e=>({img:getComputedStyle(e).backgroundImage,w:innerWidth>=innerHeight}));
  assert.match(art.img,art.w?/jaguar_keyart_16x9\.webp/:/jaguar_keyart_9x16\.webp/,'the right crop for the orientation');
  await p.waitForTimeout(kind==='reduced'?200:1400);
  const box=await p.locator('#studio .studio-mark').boundingBox();assert.ok(box&&box.x>=0&&box.x+box.width<=vp.width,'studio name inside the screen');
  await p.screenshot({path:`${out}/${kind}.png`});
  if(kind==='portrait'){await p.click('#studio');await p.waitForSelector('#menu',{state:'visible',timeout:3000});}else await p.waitForSelector('#menu',{state:'visible',timeout:6000});
  await p.reload();await p.waitForSelector('#menu',{state:'visible'});assert.equal(await p.isVisible('#studio'),false,'shown once per session');
  assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);reports.push({kind,result:'PASS'});await p.close();}
 }finally{await b.close();}
 fs.writeFileSync(out+'/report.json',JSON.stringify({evidence:'[SIMULAZIONE] Chromium headless',reports},null,1)+'\n');console.log('PASS studio:',reports.length,'formati');
})().catch(e=>{console.error(e);process.exit(1);});
