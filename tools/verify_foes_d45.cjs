// D45 in Chromium: the breach, contagion and node missions decode their family sheets and draw them on the world canvas.
// Usage: node tools/verify_foes_d45.cjs <url> <out-dir>   (the output goes outside the repo)
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),qa=require('./qa_v8.cjs');
const [url='http://127.0.0.1:8090/game/',out]=process.argv.slice(2);
if(!out){console.error('Usage: node tools/verify_foes_d45.cjs <url> <out-dir>');process.exit(2);}
fs.mkdirSync(out,{recursive:true});
const WANT={breach:['mech_hound','striker_unit','chrono_drone'],contagion:['ghoul_runner','toxic_brawler','toxic_bomber','plague_cultist_caster'],zero:['skeleton_swordsman','iron_penitent','flame_alchemist','skeleton_shield_bearer','purple_guard']};
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined}),checks=[],errors=[];
 try{
  for(const [step,ids] of Object.entries(WANT)){
   const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,deviceScaleFactor:2}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
   await qa.seed(p,url,step);
   const decoded=(await p.evaluate(()=>window.cityAdventure.status().chrono.decoded));
   for(const id of ids)assert.ok(decoded.includes(id),step+' decodes '+id+' ('+decoded+')');
   // Count drawImage calls that read each family sheet during a few seconds of live play.
   const drawn=await p.evaluate(ids=>new Promise(resolve=>{const seen={},orig=CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage=function(im,...r){if(this.canvas.id==='world'&&im?.src){const m=/chrono\/([a-z_]+)\.png/.exec(im.src);if(m&&ids.includes(m[1]))seen[m[1]]=(seen[m[1]]||0)+1;}return orig.call(this,im,...r);};
    setTimeout(()=>{CanvasRenderingContext2D.prototype.drawImage=orig;resolve(seen);},4000);}),ids);
   assert.ok(Object.keys(drawn).length>=1,step+' draws at least one family sheet: '+JSON.stringify(drawn));
   checks.push({id:'foes-'+step,result:'PASS',decoded:ids,drawn});
   await p.screenshot({path:path.join(out,`foes-${step}-390x844.png`)});await c.close();
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(out,'foes-d45.json'),JSON.stringify({ok:true,checks,errors},null,1));console.log('D45 foes PASS · '+checks.length+' missions · '+JSON.stringify(checks.map(c=>c.drawn)));
 }catch(e){fs.writeFileSync(path.join(out,'foes-d45.json'),JSON.stringify({ok:false,checks,errors,failure:String(e.stack||e)},null,1));console.error(e);process.exitCode=1;}
 finally{await browser.close();}
})();
