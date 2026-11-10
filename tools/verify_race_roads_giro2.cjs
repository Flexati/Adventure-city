// Strade Solkara/Aurelia e auto Vortex (Argon giro 2, 10/11/2026), nel laboratorio gare: per ogni
// circuito con le tegole nuove si sblocca la gara, si parte e si verifica che la pagina chieda
// davvero le tegole WebP della regione e l'atlante race_vortex_car, senza errori; screenshot a gara in corso.
// Uso: node tools/verify_race_roads_giro2.cjs [url] [outDir]
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('node:fs'),path=require('node:path');
const [url='http://127.0.0.1:8090/game/v9-race-lab.html',out='docs/evidence/v10.3']=process.argv.slice(2);
(async()=>{
 const {RACE_SERIES_V9,RACES_V9,raceRoadArt,newRaceRecordV9,racePilot}=await import('../game/racing-v9.mjs');
 fs.mkdirSync(out,{recursive:true});const checks=[];let failed=false;
 const check=(name,ok,detail)=>{checks.push({name,ok:!!ok,detail});if(!ok)failed=true;console.log(ok?'PASS':'FAIL',name,detail===undefined?'':JSON.stringify(detail));};
 const b=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
 try{
  for(const target of ['solkara','solkara_storm','aurelia_span','veyra_duel']){
   const c=await b.newContext({viewport:{width:1280,height:950}}),p=await c.newPage();
   const errors=[],requested=[];p.on('pageerror',e=>errors.push(e.message));p.on('request',q=>{const f=q.url().split('/game/')[1];if(f)requested.push(f);});p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
   const record=newRaceRecordV9();
   for(const id of RACE_SERIES_V9){if(id===target)break;record.events[id]={completed:true,won:false,bestTime:90,bestRank:2};record.coins+=15;}
   await c.addInitScript(raw=>{try{localStorage.setItem('chronos-v9-races-v1',raw);}catch{}},JSON.stringify(record));
   await p.goto(url);await p.waitForFunction(()=>window.chronosRaceLab);
   await p.selectOption('#race',target);await p.click('#start');
   const t0=Date.now();let shot=false;
   const held=new Set();
   while(Date.now()-t0<20000){
    const s=await p.evaluate(()=>window.chronosRaceLab.snapshot());
    if(s.status==='racing'){
     const input=racePilot(s,s.cars[0]);
     const desired=new Set([...(input.throttle>.1?['ArrowUp']:[]),...(input.brake>.1?['ArrowDown']:[]),...(input.steer<-.12?['ArrowLeft']:input.steer>.12?['ArrowRight']:[])]);
     for(const k of held)if(!desired.has(k)){await p.keyboard.up(k);held.delete(k);}
     for(const k of desired)if(!held.has(k)){await p.keyboard.down(k);held.add(k);}
     if(s.time>6&&!shot){shot=true;await p.screenshot({path:path.join(out,`race-roads-lab-${target}.png`)});break;}
    }
    await p.waitForTimeout(80);
   }
   for(const k of held)await p.keyboard.up(k);
   const wantRoads=raceRoadArt(RACES_V9[target]);
   check(`${target}: tegole WebP della regione richieste dalla pagina`,wantRoads.every(n=>requested.includes(`art/v10/${n}.webp`)),{want:wantRoads,got:requested.filter(f=>/race_(solkara|aurelia|vortex)/.test(f))});
   check(`${target}: atlante dell'auto del giocatore richiesto`,requested.includes('art/v10/race_vortex_car.webp'));
   check(`${target}: screenshot a gara in corso`,shot);
   check(`${target}: zero errori di pagina e di rete`,errors.length===0,errors.slice(0,4));
   await c.close();
  }
 }finally{await b.close();}
 fs.writeFileSync(path.join(out,'race-roads-giro2.json'),JSON.stringify({url,checks,when:new Date().toISOString()},null,1));
 console.log(failed?'FAIL race roads giro 2':'PASS race roads giro 2');process.exit(failed?1:0);
})().catch(e=>{console.error(e);process.exit(1);});
