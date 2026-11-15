// Real Chromium Web Audio: decoded music + overlapping procedural SFX through the shipping master bus.
// Usage: node tools/verify_audio_v09.cjs <gameURL> <report.json>
const {chromium}=require('playwright');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
 const page=await browser.newPage();await page.goto(process.argv[2]||'http://127.0.0.1:8090/game/');
 const report=await page.evaluate(async()=>{
  const {AudioDirector,MIX,musicalState}=await import('./audio-engine.mjs');
  const fx=['shot','impact','heavy','barrier','pulse','magic','ui','choice','radio','dash','alarm','step','knock','node'];
  const renders=[];
  for(const name of [...fx,'stress']){
   const context=new OfflineAudioContext(2,48000*2,48000),director=new AudioDirector({context});director.init();
   if(name==='stress'){
    // Two equally powered decoded streams at a score transition, not a silent SFX-only test.
    for(const cue of ['danger','nox']){const bytes=await(await fetch('audio/v09/'+cue+'.ogg')).arrayBuffer(),source=context.createBufferSource();source.buffer=await context.decodeAudioData(bytes);const gain=context.createGain();gain.gain.value=Math.SQRT1_2;source.connect(gain);gain.connect(director.music);source.start();}
    for(const s of fx)director.sfx(s);
   }else director.sfx(name);
   let peakVoices=director.voices.size;const overlap=name==='stress'?context.suspend(.064).then(()=>{for(const s of fx)director.sfx(s);peakVoices=Math.max(peakVoices,director.voices.size);if(peakVoices>24)throw Error('Voice cap exceeded');return context.resume();}):Promise.resolve();
   const rendered=await context.startRendering();await overlap;let peak=0,energy=0,dc=0,last=0,step=0;
   for(let ch=0;ch<2;ch++){const a=rendered.getChannelData(ch);last=0;for(const x of a){if(!Number.isFinite(x))throw Error('Non-finite audio '+name);peak=Math.max(peak,Math.abs(x));energy+=x*x;dc+=x;step=Math.max(step,Math.abs(x-last));last=x;}}
   const result={name,peakVoices,peak:+peak.toFixed(6),rms:+Math.sqrt(energy/(rendered.length*2)).toFixed(6),dc:+(dc/(rendered.length*2)).toFixed(6),maxSampleStep:+step.toFixed(6),tailVoices:director.voices.size};
   if(peak>=.98||peak<=.0001)throw Error('Audio level out of bounds '+JSON.stringify(result));if(director.voices.size)throw Error('Leaked voice '+name);renders.push(result);
  }
  return {sampleRate:48000,engine:'Chromium OfflineAudioContext',mix:MIX,renders,states:{explore:musicalState({base:'lulu'}),fight:musicalState({base:'lulu',tension:1}),hold:musicalState({base:'lulu',tension:.2,quietFor:3}),quiet:musicalState({base:'lulu',quietFor:6}),join:musicalState({joined:true})}};
 });
 const target=process.argv[3]||'audio-v09.json';fs.writeFileSync(target,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
