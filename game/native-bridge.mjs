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
// R55 (D95): the free edition. The same game ships twice: the paid app (jaguarZcreatorZ13.app, everything open, no store) and the
// free app (jaguarZcreatorZ13.app.free): Act I free, one purchase (STORE_PRODUCT) opens the rest. The shell says which one it is
// (window.ChronosEdition.edition(), registered only by the free app, decided by its package name in Java) and owns the purchase
// (ChronosStore, free build only). The page
// never grants anything by itself: «entitled» comes only from the shell's own state, read back as JSON.
// A browser, the paid app (no ChronosEdition at all): 'paid', nothing is locked. In the free app a missing or broken store
// bridge leaves the story locked after Act I (status 'unavailable'): the lock fails closed, the paid app never fails closed.
export const FREE_ACTS=1;
export const STORE_PRODUCT='unlock_full_game';
export function shellEdition(bridge){try{return bridge&&typeof bridge.edition==='function'&&bridge.edition()==='free'?'free':'paid';}catch{return 'paid';}}
const STORE_STATUS=['loading','ready','purchasing','pending','owned','canceled','notfound','error','unavailable'];
// state() answers one JSON object {entitled, status, price}: anything else is «not entitled, unavailable».
export function parseStoreState(raw){
 const none={entitled:false,status:'unavailable',price:null};
 try{const o=typeof raw==='string'?JSON.parse(raw):raw;if(!o||typeof o!=='object')return none;
  const entitled=o.entitled===true,status=STORE_STATUS.includes(o.status)?o.status:entitled?'owned':'unavailable';
  return {entitled,status:entitled?'owned':status,price:typeof o.price==='string'&&o.price.length<=24?o.price:null};}catch{return none;}
}
export function createStoreGate({shell=null,store=null}={}){
 const edition=shellEdition(shell),subs=new Set();let state={entitled:false,status:store?'loading':'unavailable',price:null};
 const pull=()=>{if(edition!=='free')return;if(!store||typeof store.state!=='function'){state={entitled:false,status:'unavailable',price:null};return;}
  try{state=parseStoreState(store.state());}catch{state={entitled:false,status:'error',price:null};}};
 const notify=()=>{for(const f of [...subs])try{f(api);}catch{}};
 const call=name=>{if(edition!=='free')return false;try{if(store&&typeof store[name]==='function'){store[name]();return true;}}catch{}state={...state,status:'error'};notify();return false;};
 const api={edition,get free(){return edition==='free';},get state(){return {...state};},
  entitled:()=>edition!=='free'||state.entitled===true,
  // An act number that is not a number counts as locked: a free app never opens a step it cannot place.
  locked:act=>edition==='free'&&state.entitled!==true&&!(Number(act)>=1&&Number(act)<=FREE_ACTS),
  refresh(){pull();notify();return api.state;},
  buy:()=>call('buy'),restore:()=>call('restore'),
  subscribe(f){subs.add(f);return()=>subs.delete(f);}};
 pull();return api;
}
export const STORE_TEXT={
 it:{kicker:'ATTO I COMPLETATO',title:'Continua la storia',body:'Hai finito il primo atto. Un solo acquisto, per sempre, sblocca tutti gli atti successivi. Niente pubblicità, niente altri acquisti.',buy:'Sblocca tutto',buyPrice:'Sblocca tutto · ',restore:'Ripristina acquisto',menu:'Torna al menu',
  loading:'Controllo l’acquisto…',ready:'Il pagamento passa da Google Play. Il tuo progresso resta salvato.',purchasing:'Apro Google Play…',pending:'Pagamento in attesa. Quando Google Play lo conferma, il gioco si sblocca da solo.',owned:'Acquisto trovato. Tutti gli atti sono sbloccati.',canceled:'Acquisto annullato. Nessun addebito.',notfound:'Nessun acquisto trovato su questo account Google.',error:'Qualcosa non ha funzionato. Riprova tra poco.',unavailable:'Google Play non è raggiungibile adesso. Controlla la connessione e riprova.',thanks:'Grazie! Tutti gli atti sono sbloccati.',coming:'Cosa ti aspetta',lockedTag:'BLOCCATO',progress:(d,t,m)=>'Atto I di 4 completato · '+d+' tappe su '+t+(m>=1?' · hai giocato '+m+' min':''),remaining:n=>n+' tappe ancora da giocare',
  acts:[['ATTO II · LA BRECCIA','Il porto, la frattura sopra le antenne, il Tiranno e la Clinica sigillata, fino all’Ora zero.'],['ATTO III · DUE STRADE','Nox e Lulú si separano: due storie in parallelo, pattuglie da evitare, EVE e Vega.'],['ATTO IV · ORA UNO','Archon, la piattaforma dell’asse e cinque finali che dipendono dalle tue scelte.']]},
 en:{kicker:'ACT I COMPLETE',title:'Continue the story',body:'You have finished the first act. One purchase, forever, unlocks every act that follows. No ads, no other purchases.',buy:'Unlock everything',buyPrice:'Unlock everything · ',restore:'Restore purchase',menu:'Back to menu',
  loading:'Checking your purchase…',ready:'Payment goes through Google Play. Your progress stays saved.',purchasing:'Opening Google Play…',pending:'Payment pending. When Google Play confirms it, the game unlocks by itself.',owned:'Purchase found. Every act is unlocked.',canceled:'Purchase cancelled. You have not been charged.',notfound:'No purchase found on this Google account.',error:'Something went wrong. Please try again shortly.',unavailable:'Google Play cannot be reached right now. Check your connection and try again.',thanks:'Thank you! Every act is unlocked.',coming:'What awaits you',lockedTag:'LOCKED',progress:(d,t,m)=>'Act I of 4 complete · '+d+' of '+t+' stages'+(m>=1?' · '+m+' min played':''),remaining:n=>n+' stages still to play',
  acts:[['ACT II · THE BREACH','The harbour, the fracture above the antennas, the Tyrant and the sealed Clinic, up to Zero Hour.'],['ACT III · TWO ROADS','Nox and Lulú part ways: two stories side by side, patrols to avoid, EVE and Vega.'],['ACT IV · HOUR ONE','Archon, the axis platform and five endings that depend on your choices.']]}
};
// What the unlock screen writes for a language and a state: one place, so the page and the tests read the same words.
export function storeScreenText(language,state){
 const t=STORE_TEXT[language==='en'?'en':'it'],st=state?.status||'unavailable',busy=st==='loading'||st==='purchasing'||st==='pending'||st==='owned';
 return {coming:t.coming,lockedTag:t.lockedTag,progress:t.progress,remaining:t.remaining,acts:t.acts,kicker:t.kicker,title:t.title,body:t.body,status:t[st]||t.unavailable,buy:state?.price?t.buyPrice+state.price:t.buy,restore:t.restore,menu:t.menu,thanks:t.thanks,buyDisabled:busy||st==='unavailable',restoreDisabled:busy};
}
// The last beat of Act I in the free app, said once just before the unlock screen: it ends on the breach, not on a price tag.
export const FREE_TEASER_LINES=[
 {speaker:'VEYRA',text:'Fermi. Sentite? Il muro della breccia ha smesso di respirare.'},
 {speaker:'LULÚ',text:'Non è silenzio. Qualcosa sta ascoltando noi.'},
 {speaker:'NOX',text:'Allora andiamo a vedere cosa c’è dall’altra parte.'},
 {speaker:'SISTEMA',text:'ATTO II · LA BRECCIA. Il segnale si è appena acceso.'}
];
