// R52 (D93): the game's side of the Android shell's one door (window.ChronosNative, NativeBridge.java). Saves used to leave the
// page as a GET query string, which fails once a save outgrows the longest URL; they now travel as one JavaScript call, and
// only what changed. Without the shell (a browser) there is no bridge and every function here does nothing.
// The keys are the ones the shell allows (NativeBridge.java) and the bootstrap restores (android_bootstrap.js); a test keeps
// the three lists equal.
export const NATIVE_KEYS=['city-adventure-progress-v7','city-adventure-progress-v7.backup','city-v4-settings'];
// The language the shell chose (the saved choice, else the phone's): 'it', 'en' or null.
export function nativeLanguage(bridge){try{const l=bridge&&typeof bridge.lang==='function'?bridge.lang():null;return l==='it'||l==='en'?l:null;}catch{return null;}}
// push(payload) takes {lang, save, backup, settings} (empty values are ignored); the latest values of a burst are sent as one
// call, a short moment later, and a value the shell already has is not sent again. flush() sends now: the game calls it when it
// goes to the background. A failed call is retried with the next push.
export function createNativeSync(bridge,{delay=300,setTimer=(f,ms)=>setTimeout(f,ms),clearTimer=t=>clearTimeout(t)}={}){
 let pending={},timer=null,calls=0;const sent={};
 const flush=()=>{if(timer!==null){clearTimer(timer);timer=null;}const out={};let any=false;
  for(const [k,v] of Object.entries(pending))if(v!==sent[k]){out[k]=v;any=true;}
  pending={};if(!any||!bridge||typeof bridge.sync!=='function')return false;
  try{bridge.sync(JSON.stringify(out));Object.assign(sent,out);calls++;return true;}catch{pending={...out,...pending};return false;}};
 return {push(payload){if(!bridge)return;for(const [k,v] of Object.entries(payload||{}))if(v!==undefined&&v!==null&&v!=='')pending[k]=String(v);if(timer===null)timer=setTimer(flush,delay);},flush,get calls(){return calls;}};
}
