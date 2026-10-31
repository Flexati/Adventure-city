// Offline procedural SFX and streamed score. No timer-driven synthesis or decoded music heap.
export const MIX={master:.72,music:.48,effects:.75,ambience:.12,duck:.50,voices:24,crossfade:2.2};
const MODERN_CUES=new Set(['nox','lulu','danger','reunion']);
export function musicalState({base='nox',tension=0,quietFor=0,joined=false}){
 if(joined)return 'reunion';
 return tension>.55||quietFor<5&&tension>0?'danger':base;
}
export class AudioDirector{
 constructor({context=null,mediaFactory=src=>new Audio(src)}={}){this.context=context;this.mediaFactory=mediaFactory;this.enabled=true;this.suspended=false;this.unlocked=!!context;this.ready=false;this.tracks=[];this.voices=new Set();this.cooldowns=new Map();this.cue=null;this.dialogue=false;this.ambienceKind=null;this.ambientNodes=[];this.failures=0;}
 init(){
  if(this.ready)return true;
  try{
   const C=globalThis.AudioContext||globalThis.webkitAudioContext;
   this.context||=C?new C({latencyHint:'interactive'}):null;const c=this.context;if(!c)return false;
   this.master=c.createGain();this.master.gain.value=MIX.master;
   this.highpass=c.createBiquadFilter();this.highpass.type='highpass';this.highpass.frequency.value=34;this.highpass.Q.value=.5;
   this.limiter=c.createDynamicsCompressor();Object.assign(this.limiter.threshold,{value:-7});this.limiter.knee.value=5;this.limiter.ratio.value=16;this.limiter.attack.value=.003;this.limiter.release.value=.16;
   this.master.connect(this.highpass);this.highpass.connect(this.limiter);this.limiter.connect(c.destination);
   this.music=c.createGain();this.effects=c.createGain();this.ambient=c.createGain();
   this.music.gain.value=MIX.music*(this.dialogue?MIX.duck:1);this.effects.gain.value=MIX.effects;this.ambient.gain.value=MIX.ambience;
   this.music.connect(this.master);this.effects.connect(this.master);this.ambient.connect(this.master);
   this.reverb=c.createConvolver();const ir=c.createBuffer(2,Math.ceil(c.sampleRate*.32),c.sampleRate);let r=909;
   for(let ch=0;ch<2;ch++){const a=ir.getChannelData(ch);for(let i=0;i<a.length;i++){r=(1664525*r+1013904223)>>>0;a[i]=(r/2147483648-1)*Math.pow(1-i/a.length,3)*.28;}}this.reverb.buffer=ir;
   const wet=c.createGain();wet.gain.value=.13;this.effects.connect(this.reverb);this.reverb.connect(wet);wet.connect(this.master);
   this.noise=c.createBuffer(1,c.sampleRate,c.sampleRate);const a=this.noise.getChannelData(0);for(let i=0;i<a.length;i++){r=(1664525*r+1013904223)>>>0;a[i]=r/2147483648-1;}
   this.distortion=new Float32Array(1024);for(let i=0;i<1024;i++){const x=i/511.5-1;this.distortion[i]=Math.tanh(2*x)/Math.tanh(2);}
   this.ready=true;return true;
  }catch{this.failures++;return false;}
 }
 async unlock(){if(!this.enabled||this.suspended)return;this.unlocked=true;if(!this.init())return;try{await this.context.resume();}catch{this.failures++;}this.ensureCue();this.setAmbience(this.ambienceKind);}
 ramp(param,value,seconds=.12){const t=this.context.currentTime;param.cancelScheduledValues(t);param.setTargetAtTime(value,t,Math.max(.005,seconds/3));}
 setEnabled(value){this.enabled=!!value;if(!value)this.pause();else this.resume();}
 pause(){this.suspended=true;for(const voice of this.voices){try{voice.stop();}catch{}}for(const t of this.tracks)t.media.pause();if(this.ready)this.context.suspend().catch(()=>{});}
 resume(gesture=false){this.suspended=false;if(this.enabled&&(this.unlocked||gesture))this.unlock();}
 setCue(cue){this.cue=cue;if(this.unlocked)this.ensureCue();}
 ensureCue(){
  if(!this.enabled||this.suspended||!this.ready||!this.cue)return;
  const active=this.tracks.at(-1);if(active?.cue===this.cue){if(active.media.paused)active.media.play().catch(()=>{});return;}
  // A third change retires the oldest stream immediately; at most two media decoders exist.
  while(this.tracks.length>1)this.disposeTrack(this.tracks.shift());
  const c=this.context,media=this.mediaFactory(['chalk_route','rook_line','tessa_workbench','strangers_rift','anchor_fight_loop','veyra_championship','veyra_championship_night','refuge_theme','promise_theme'].includes(this.cue)?`audio/v10/${this.cue}.ogg`:`audio/${MODERN_CUES.has(this.cue)?'v09':'v05'}/${this.cue}.ogg`);media.loop=true;media.preload='none';media.volume=1;
  const source=c.createMediaElementSource(media),gain=c.createGain();gain.gain.value=0;source.connect(gain);gain.connect(this.music);
  const track={media,source,gain,cue:this.cue,started:false};this.tracks.push(track);
  // Fade only after playback starts; rejected autoplay must not fade the outgoing track to silence.
  media.play().then(()=>{
   if(!this.tracks.includes(track)||this.tracks.at(-1)!==track||this.cue!==track.cue)return;
   track.started=true;const now=c.currentTime,duration=MIX.crossfade;
   const up=new Float32Array(48),down=new Float32Array(48);for(let i=0;i<48;i++){const a=i/47*Math.PI/2;up[i]=Math.sin(a);down[i]=Math.cos(a);}
   gain.gain.cancelScheduledValues(now);gain.gain.setValueCurveAtTime(up,now,duration);
   for(const old of this.tracks)if(old!==track){old.gain.gain.cancelScheduledValues(now);old.gain.gain.setValueCurveAtTime(down.map(v=>v*old.gain.gain.value),now,duration);old.retireAt=now+duration;}
  }).catch(()=>{this.tracks=this.tracks.filter(t=>t!==track);this.disposeTrack(track);});
 }
 disposeTrack(t){t.media.pause();t.source.disconnect();t.gain.disconnect();t.media.removeAttribute('src');t.media.load();}
 update(){if(!this.ready)return;for(const t of [...this.tracks])if(t.retireAt!=null&&this.context.currentTime>=t.retireAt){this.tracks.splice(this.tracks.indexOf(t),1);this.disposeTrack(t);}}
 duck(value){if(this.dialogue===value)return;this.dialogue=value;if(this.ready)this.ramp(this.music.gain,MIX.music*(value?MIX.duck:1),value?.12:.6);}
 setAmbience(kind){
  this.ambienceKind=kind;if(!this.ready||!this.unlocked||!this.enabled||this.suspended)return;
  if(this.activeAmbience===kind)return;this.activeAmbience=kind;
  const c=this.context,now=c.currentTime;for(const voice of this.ambientNodes){this.ramp(voice.gain.gain,0,.4);voice.source.stop(now+.45);}this.ambientNodes=[];
  if(!kind)return;
  const add=(source,filterFreq,gain)=>{const filter=c.createBiquadFilter();filter.type='lowpass';filter.frequency.value=filterFreq;const g=c.createGain();g.gain.value=0;source.connect(filter);filter.connect(g);g.connect(this.ambient);source.start();this.ramp(g.gain,gain,1);source.onended=()=>{source.disconnect();filter.disconnect();g.disconnect();};this.ambientNodes.push({source,gain:g});};
  if(kind.startsWith('chrono_')&&this.chronoBuffers?.has(kind.slice(7))){const source=c.createBufferSource();source.buffer=this.chronoBuffers.get(kind.slice(7));source.loop=true;add(source,3200,.55);return;}
  const noise=c.createBufferSource();noise.buffer=this.noise;noise.loop=true;add(noise,kind==='port'?1200:kind==='drive'?380:220,kind==='port'?.34:.22);
  const hum=c.createOscillator();hum.type='sine';hum.frequency.value=kind==='drive'?58:kind==='port'?86:48;add(hum,150,.17);
 }
 engineSpeed(speed){if(this.activeAmbience==='drive'&&this.ready){const voice=this.ambientNodes[1];if(voice)this.ramp(voice.source.frequency,48+Math.min(90,speed*.12),.18);}}
 async preloadChrono(kind,extra=[]){
  // Decoding is silent: preload even while muted so a district change cannot retain
  // the previous district's ambience when sound is enabled again.
  if(!this.init())return;
  if((!this.enabled||this.suspended)&&this.context.state==='running')await this.context.suspend().catch(()=>{});
  const epoch=this.chronoEpoch=(this.chronoEpoch||0)+1,ambient=['old_town','cathedral','toxic_market','clockwork'][kind]||'old_town';
  const names=['impact','chrono_energy','boss_collapse','save','suspense_boss',ambient,'chalk_scrape','heal_seal','tessa_case','weapon_switch','weapon_reload','vx9_shot','r12_shot','quickdraw_ready',...(kind===0?['rook_aim','rook_shot','rook_mine','rook_burst','rook_disarm']:[]),...(kind===3?['kairn_impact','morrow_saw','morrow_shot']:[]),...extra],buffers=this.chronoBuffers||new Map();
  const decoded=await Promise.all(names.map(async name=>{if(buffers.has(name))return [name,buffers.get(name)];try{const r=await fetch(`audio/${(['chalk_scrape','heal_seal'].includes(name)||name.startsWith('rook_')||name.startsWith('anchor_')||name.startsWith('race_')||['kairn_impact','morrow_saw','morrow_shot'].includes(name)||['tessa_case','weapon_switch','weapon_reload','vx9_shot','r12_shot','quickdraw_ready'].includes(name))?'v10':'chrono'}/${name}.ogg`);if(!r.ok)throw Error(name);return [name,await this.context.decodeAudioData(await r.arrayBuffer())];}catch{this.failures++;return [name,null];}}));
  if(epoch!==this.chronoEpoch)return;this.chronoBuffers=new Map(decoded.filter(([,buffer])=>buffer));this.chronoAmbience=ambient;
 }
 chronoSfx(name,strength=1){
  const buffer=this.chronoBuffers?.get(name);if(!buffer||!this.enabled||this.suspended||!this.unlocked||!this.ready)return false;
  const now=this.context.currentTime,spacing=name==='vx9_shot'?.04:name.startsWith('suspense')?10:name==='save'?.5:.08;
  if(now-(this.cooldowns.get(name)??-10)<spacing||this.voices.size>=MIX.voices)return false;this.cooldowns.set(name,now);
  const source=this.context.createBufferSource(),gain=this.context.createGain();source.buffer=buffer;gain.gain.value=Math.max(0,Math.min(1,strength))*.5;source.connect(gain);gain.connect(this.effects);this.voices.add(source);source.onended=()=>{source.disconnect();gain.disconnect();this.voices.delete(source);};source.start();this.chronoPlayed||={};this.chronoPlayed[name]=(this.chronoPlayed[name]||0)+1;return true;
 }
 sfx(name,strength=1){
  const chronoName={tessaCase:'tessa_case',weaponSwitch:'weapon_switch',weaponReload:'weapon_reload',vx9Shot:'vx9_shot',r12Shot:'r12_shot',quickdrawReady:'quickdraw_ready',rookAim:'rook_aim',kairnImpact:'kairn_impact',morrowSaw:'morrow_saw',morrowShot:'morrow_shot',anchorMoor:'anchor_moor',anchorExposed:'anchor_exposed',anchorRelink:'anchor_relink',anchorTension:'anchor_line_tension',anchorSweep:'anchor_sweep',anchorCut:'anchor_line_cut',anchorWeight:'anchor_weight',raceCheckpoint:'race_checkpoint',raceHit:'race_container_hit',raceFinish:'race_finish',raceBeep:'race_count_beep',raceGo:'race_go',rookShot:'rook_shot',rookMine:'rook_mine',mineBurst:'rook_burst',mineDisarmed:'rook_disarm',chalk:'chalk_scrape',heal:'heal_seal',impact:'impact',boss_collapse:'boss_collapse',node:'chrono_energy',barrier:'chrono_energy',magic:'chrono_energy',save:'save',suspense_boss:'suspense_boss'}[name];if(chronoName&&this.chronoBuffers?.has(chronoName))return this.chronoSfx(chronoName,strength);
  // Authored cues without their buffer fall back to a synthesized family, never to the UI blip.
  name={anchorMoor:'barrier',anchorExposed:'pulse',anchorRelink:'barrier',anchorTension:'pulse',anchorSweep:'impact',anchorCut:'impact',anchorWeight:'heavy',raceCheckpoint:'choice',raceHit:'impact',raceFinish:'choice',raceBeep:'ui',raceGo:'node'}[name]||name;
  if(!this.enabled||this.suspended||!this.unlocked||!this.init())return false;
  const c=this.context,now=c.currentTime,spacing=['step','shot','impact'].includes(name)?.055:.035;
  if(now-(this.cooldowns.get(name)??-10)<spacing||this.voices.size>=MIX.voices)return false;this.cooldowns.set(name,now);
  const specs={shot:[650,180,.10,.22,'triangle',1900],impact:[180,64,.17,.40,'triangle',1000],heavy:[110,42,.38,.44,'sine',800],barrier:[240,94,.42,.42,'sine',1400],pulse:[140,39,.65,.48,'sine',900],magic:[390,110,.32,.32,'triangle',2100],ui:[750,950,.055,.085,'sine',3000],choice:[520,1040,.19,.14,'sine',2400],heal:[440,880,.26,.10,'sine',1800],chalk:[2100,480,.16,.13,'noise',3000],radio:[110,105,.16,.13,'noise',1800],dash:[900,350,.13,.16,'noise',2500],alarm:[460,660,.3,.24,'triangle',1500],step:[120,64,.055,.10,'noise',650],knock:[130,78,.13,.30,'sine',700],node:[420,840,.32,.24,'sine',2000]};
  const spec=specs[name==='boss_collapse'?'heavy':name]||specs.ui,[start,end,dur,vol,type,cutoff]=spec;
  const source=type==='noise'?c.createBufferSource():c.createOscillator();if(type==='noise')source.buffer=this.noise;else{source.type=type;source.frequency.setValueAtTime(start,now);source.frequency.exponentialRampToValueAtTime(end,now+dur);}
  const filter=c.createBiquadFilter();filter.type=name==='radio'?'bandpass':'lowpass';filter.frequency.value=cutoff;filter.Q.value=.65;
  const gain=c.createGain();gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(vol*Math.min(1,strength),now+.006);gain.gain.exponentialRampToValueAtTime(.0001,now+dur);
  const nodes=[source,filter,gain];source.connect(filter);
  if(name==='pulse'){const drive=c.createWaveShaper();drive.curve=this.distortion;drive.oversample='2x';filter.connect(drive);drive.connect(gain);nodes.push(drive);}else filter.connect(gain);
  gain.connect(this.effects);this.voices.add(source);source.onended=()=>{for(const n of nodes)n.disconnect();this.voices.delete(source);};source.start(now);source.stop(now+dur+.02);return true;
 }
 status(){return {enabled:this.enabled,unlocked:this.unlocked,context:this.context?.state||'unavailable',cue:this.cue,streams:this.tracks.length,voices:this.voices.size,ambience:this.activeAmbience||null,ambienceVoices:this.ambientNodes.length,chronoPlayed:{...(this.chronoPlayed||{})},chronoDecoded:[...(this.chronoBuffers?.keys()||[])],chronoDecodedBytes:[...(this.chronoBuffers?.values()||[])].reduce((n,b)=>n+b.length*b.numberOfChannels*4,0),musicPaused:!this.tracks.some(t=>!t.media.paused),failures:this.failures};}
}
