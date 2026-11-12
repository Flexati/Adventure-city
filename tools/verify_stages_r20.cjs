// R20-c: every new stage of the 150-minute plan opens from a seeded save, loads its painted map and becomes playable,
// with no page error and no failed request. Seeded states are not campaign-completion evidence.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),qa=require('./qa_v8.cjs');
const [url='http://127.0.0.1:8090/game/',out='docs/evidence/r20/stages']=process.argv.slice(2);
const STAGES=['docks_veyra','app_breach','bone_tyrant','app_clinic','app_node','app_yard','forge_behemoth','app_port','glass_flood','glass_reaper','vega','app_archive','app_axis'];
(async()=>{fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined}),report=[];
 for(const step of STAGES){const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`HTTP ${r.status()} ${r.url()}`);});
  const data=JSON.parse(await qa.makeSave(step));if(process.env.BOSS==='1')data.checkpoint='boss';
  await page.goto(url);await page.evaluate(raw=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');localStorage.setItem('city-v4-settings',JSON.stringify({sound:false,reduced:false}));localStorage.setItem('city-adventure-progress-v7',raw);},JSON.stringify(data));
  await page.reload();await page.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');await page.click('#continue');let status=null;
  for(let k=0;k<120&&!status;k++){if(await page.isVisible('#card')){await page.click('#card');continue;}if(await page.isVisible('#talk')){await page.click('#next-line');continue;}const s=await page.evaluate(()=>window.cityAdventure.status());if(s.running)status=s;else await page.waitForTimeout(60);}
  assert.ok(status,step+' did not become playable');await page.waitForTimeout(900);
  const view=await page.evaluate(()=>({objective:document.getElementById('objective').textContent,gun:!document.getElementById('gun').hidden,boss:!document.getElementById('bossbar').hidden}));
  await page.screenshot({path:path.join(out,step+(process.env.BOSS==='1'?'-boss':'')+'.png')});assert.deepEqual(errors,[],step);assert.ok(view.objective.length>3,step+' objective');assert.ok(view.gun,step+' SPARA visible');
  report.push({step,...view});await page.close();}
 await browser.close();fs.writeFileSync(path.join(out,'report'+(process.env.BOSS==='1'?'-boss':'')+'.json'),JSON.stringify(report,null,1));console.log('R20 stages PASS ·',report.length,'stages');})().catch(e=>{console.error(e);process.exit(1);});
