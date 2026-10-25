// Real decoded V10 samples rendered through the shipping master bus; not listening QA.
const {chromium}=require('playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const [url='http://127.0.0.1:8091/game/',out='artifacts/v10/audio-render.json']=process.argv.slice(2);
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||'/usr/bin/chromium'});
 try{
  const page=await browser.newPage();await page.goto(url);
  const renders=await page.evaluate(async()=>{
   const {AudioDirector,MIX}=await import('./audio-engine.mjs');const {V10_SFX_BINDINGS}=await import('./v10-bindings.mjs');
   const rows=[];
   for(const event of [...Object.keys(V10_SFX_BINDINGS),'stress']){
    const context=new OfflineAudioContext(2,48000*2,48000),director=new AudioDirector({context});
    await director.preloadV10();
    if(director.v10Errors.length)throw Error(JSON.stringify(director.v10Errors));
    if(event==='stress'){
     for(const key of Object.keys(V10_SFX_BINDINGS))director.sampledSfx(key);
     for(const key of ['heavy','impact','alarm','pulse'])director.sfx(key);
    }else if(!director.sampledSfx(event))throw Error('Sample did not start: '+event);
    const voices=director.voices.size,rendered=await context.startRendering();
    let peak=0,energy=0;
    for(let ch=0;ch<2;ch++)for(const x of rendered.getChannelData(ch)){
     if(!Number.isFinite(x))throw Error('Non-finite PCM');peak=Math.max(peak,Math.abs(x));energy+=x*x;
    }
    if(peak>=.98||peak<=.0001||voices>MIX.voices||director.voices.size)throw Error('Mix bounds/leak: '+event);
    rows.push({event,peak,rms:Math.sqrt(energy/(rendered.length*2)),peakVoices:voices,tailVoices:director.voices.size,result:'PASS'});
   }return rows;
  });
  assert.equal(renders.length,11);
  fs.writeFileSync(out,JSON.stringify({result:'PASS',engine:browser.version(),sampleRate:48000,renders,
   limits:['Offline browser rendering, not human listening, three-loop music review, or physical Android audio.']},null,2)+'\n');
  console.log('V10 decoded sample bus: 11 renders PASS');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
