// R52 (D93): language and saves between the page and the Android shell. One bridge (window.ChronosNative, NativeBridge.java)
// replaces GET /__sync, which put the saves in a query string. Saves over 100 KB must go through whole; a restored backup must
// be back in the page's storage before the game reads it; the language chain is the same in the bootstrap, the game and Java.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {NATIVE_KEYS,nativeLanguage,createNativeSync} from '../game/native-bridge.mjs';
const read=p=>fs.readFileSync(p,'utf8');
const bootstrap=read('game/android_bootstrap.js'),rt=read('game/runtime.mjs');
const javaDir='android/src/jaguarZcreatorZ13/app/',main=read(javaDir+'MainActivity.java'),bridge=read(javaDir+'NativeBridge.java');

// A campaign save grows with choices, stats and the world: this one is 300 KB, three times the size of the check.
const bigSave=JSON.stringify({version:7,stepId:'finale',world:{log:Array.from({length:6000},(_,i)=>({i,text:'È l’alba «Città» '+i+' ✓ '.repeat(3)}))}});
const timers=()=>{const q=new Map();let n=0;return {setTimer:f=>{q.set(++n,f);return n;},clearTimer:id=>{q.delete(id);},fire:()=>{const [id,f]=[...q][0]||[];if(id){q.delete(id);f();}},pending:()=>q.size};};

test('a save over 100 KB goes through the bridge whole, in one call, and never as a URL',()=>{
 assert.ok(bigSave.length>250*1024,'the test save is big: '+bigSave.length);
 const calls=[],t=timers(),sync=createNativeSync({sync:json=>calls.push(json)},{setTimer:t.setTimer,clearTimer:t.clearTimer});
 const realFetch=globalThis.fetch;let fetched=0;globalThis.fetch=()=>{fetched++;return Promise.resolve();};
 try{for(let i=0;i<20;i++)sync.push({lang:'it',save:bigSave,backup:bigSave,settings:'{"language":"it"}'});}finally{globalThis.fetch=realFetch;}
 assert.equal(calls.length,0,'nothing is sent while the burst is still going');t.fire();
 assert.equal(calls.length,1,'twenty persists, one call');assert.equal(fetched,0,'no request, so no URL length to hit');
 const got=JSON.parse(calls[0]);assert.equal(got.save,bigSave,'the save arrives byte for byte');assert.equal(got.backup,bigSave);assert.equal(got.lang,'it');
 assert.ok(calls[0].length>500*1024,'the call carries both copies: '+calls[0].length);
});

test('only what changed is sent, an empty value never wipes the shell, a failed call is retried, going to the background flushes',()=>{
 const calls=[];let fail=false;const t=timers();
 const sync=createNativeSync({sync:json=>{if(fail)throw new Error('bridge gone');calls.push(JSON.parse(json));}},{setTimer:t.setTimer,clearTimer:t.clearTimer});
 sync.push({lang:'en',save:'A',backup:'',settings:'S'});t.fire();assert.deepEqual(calls[0],{lang:'en',save:'A',settings:'S'},'the empty backup is left out');
 sync.push({lang:'en',save:'A',settings:'S'});t.fire();assert.equal(calls.length,1,'nothing changed, nothing sent');
 sync.push({save:'B'});t.fire();assert.deepEqual(calls[1],{save:'B'},'only the new save');
 fail=true;sync.push({save:'C'});t.fire();assert.equal(calls.length,2,'the call failed and did not take the page down');fail=false;
 sync.push({save:'C'});assert.equal(sync.flush(),true,'flush sends now (suspend)');assert.deepEqual(calls[2],{save:'C'},'and the failed value went out with the next push');assert.equal(t.pending(),0);
 for(const none of [null,undefined]){const s=createNativeSync(none);s.push({save:'x'});assert.equal(s.flush(),false,'no shell, nothing to do');}
});

test('the language the shell chose is read only when it is it or en',()=>{
 assert.equal(nativeLanguage({lang:()=>'en'}),'en');assert.equal(nativeLanguage({lang:()=>'it'}),'it');
 for(const bad of [{lang:()=>'fr'},{lang:()=>null},{lang(){throw new Error('x');}},{},null,undefined])assert.equal(nativeLanguage(bad),null);
});

// The classic bootstrap, run on a fake window like tests/android-bootstrap.test.mjs does.
function boot({native,settings,navLang,stored={}}){
 const byId={},store={...stored},log=[];
 const element=()=>({style:{},children:[],appendChild(c){this.children.push(c);return c;}});
 const document={body:{appendChild(b){if(b.id)byId[b.id]=b;return b;}},createElement:()=>element(),getElementById:id=>byId[id]||null};
 const localStorage={getItem:k=>Object.hasOwn(store,k)?store[k]:null,setItem(k,v){log.push(k);store[k]=String(v);}};
 if(settings!==undefined)store['city-v4-settings']=settings;
 const listeners={},window={addEventListener:(t,f)=>(listeners[t]||(listeners[t]=[])).push(f),setInterval:()=>1,setTimeout:()=>2,clearInterval(){},clearTimeout(){},location:{reload(){}},localStorage};
 if(navLang!==undefined)window.navigator={language:navLang};if(native)window.ChronosNative=native;
 vm.runInNewContext(bootstrap,{window,document,String});
 const title=()=>{(listeners.error||[]).forEach(f=>f({message:'SyntaxError: x',target:window}));const card=byId['startup-recovery']?.children[0];return card?.children[0].textContent;};
 return {store,log,title};
}

test('a backup restored by Android: the shell\'s saves are in the page\'s storage before anything else runs, a 300 KB save included',()=>{
 const shell={get:k=>({[NATIVE_KEYS[0]]:bigSave,[NATIVE_KEYS[1]]:bigSave.slice(0,1000),[NATIVE_KEYS[2]]:'{"language":"it"}'}[k]??null),lang:()=>'en'};
 const page=boot({native:shell});
 assert.equal(page.store[NATIVE_KEYS[0]],bigSave,'the big save came back whole');assert.equal(page.store[NATIVE_KEYS[2]],'{"language":"it"}');assert.deepEqual(page.log.sort(),[...NATIVE_KEYS].sort());
 const keep=boot({native:shell,stored:{[NATIVE_KEYS[0]]:'newer save of this session'}});
 assert.equal(keep.store[NATIVE_KEYS[0]],'newer save of this session','what the page already has is never overwritten by the shell\'s copy');
 const throwing=boot({native:{get(){throw new Error('x');},lang:()=>'en'}});assert.deepEqual(throwing.log,[],'a broken bridge restores nothing and does not stop the start');
 const noShell=boot({});assert.deepEqual(noShell.log,[],'in a browser nothing happens');
});

test('one language rule: saved settings, else the shell\'s choice, else the phone, else English; Italian only for it*',()=>{
 const en='The game could not start',it='Il gioco non è riuscito a partire';
 const table=[
  ['saved it beats everything',{settings:'{"language":"it"}',native:{get:()=>null,lang:()=>'en'},navLang:'en-US'},it],
  ['saved en beats everything',{settings:'{"language":"en"}',native:{get:()=>null,lang:()=>'it'},navLang:'it-IT'},en],
  ['no setting: the shell\'s choice (it) beats the phone (en)',{native:{get:()=>null,lang:()=>'it'},navLang:'en-US'},it],
  ['no setting: the shell\'s choice (en) beats the phone (it)',{native:{get:()=>null,lang:()=>'en'},navLang:'it-IT'},en],
  ['no shell, phone it-IT',{navLang:'it-IT'},it],['no shell, phone it',{navLang:'it'},it],
  ['no shell, phone fr-FR is English, not Italian',{navLang:'fr-FR'},en],['no shell, phone en-GB',{navLang:'en-GB'},en],
  ['nothing to read at all falls back to English (it used to be Italian)',{},en],
  ['a bridge that fails falls back to the phone',{native:{get:()=>null,lang(){throw new Error('x');}},navLang:'it-IT'},it],
  ['a bridge that says something else falls back to the phone, then English',{native:{get:()=>null,lang:()=>'de'}},en],
 ];
 for(const [label,args,expected] of table)assert.equal(boot(args).title(),expected,label);
 // The game and Java use the same order.
 assert.match(rt,/const defaultLanguage=\(\)=>nativeLanguage\(window\.ChronosNative\)\|\|\(\/\^it\\b\/i\.test\(navigator\.language\|\|''\)\?'it':'en'\);/);
 assert.match(main,/return sys == null \|\| !sys\.toLowerCase\(Locale\.ROOT\)\.startsWith\("it"\);/,'Java: Italian only for it*');
 assert.match(main,/String saved = getSharedPreferences\(PREFS, MODE_PRIVATE\)\.getString\("lang", null\);/);
 assert.match(main,/this::isEnglish\), NativeBridge\.NAME\)/,'the shell\'s choice is what the page reads from the bridge');
});

test('the shell: one allow-listed bridge registered before the page loads, no GET /__sync left',()=>{
 assert.equal((main.match(/addJavascriptInterface\(/g)||[]).length,1);
 assert.ok(main.indexOf('addJavascriptInterface(')<main.indexOf('web.loadUrl(ENTRY)'),'registered before loadUrl');
 for(const gone of ['/__sync','handleSync','getQueryParameter'])assert.ok(!main.includes(gone),gone+' is gone from MainActivity');
 const methods=[...bridge.matchAll(/@JavascriptInterface\s+public (?:String|void) (\w+)\(/g)].map(m=>m[1]);assert.deepEqual(methods.sort(),['get','lang','sync'],'exactly three calls, nothing else exposed');
 assert.equal((bridge.match(/@JavascriptInterface/g)||[]).length,3);
 assert.match(bridge,/static boolean allowed\(String key\) \{\s*return SAVE\.equals\(key\) \|\| BACKUP\.equals\(key\) \|\| SETTINGS\.equals\(key\);/);
 assert.match(bridge,/if \(!allowed\(key\)\) return null;/);assert.match(bridge,/value\.length\(\) <= MAX_VALUE/);assert.match(bridge,/catch \(Exception ignored\)/,'a bad message never throws into the shell');
 const code=bridge.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/.*$/gm,'');
 assert.doesNotMatch(code,/Billing|Intent|File|URL|Socket|exec\(|getAssets|startActivity/,'no purchase, no file, no network, no process');
 const javaKeys=[bridge.match(/SAVE = "([^"]+)"/)[1],bridge.match(/BACKUP = "([^"]+)"/)[1],bridge.match(/SETTINGS = "([^"]+)"/)[1]];
 assert.deepEqual(javaKeys,NATIVE_KEYS,'Java and the game share the keys');
 assert.deepEqual([...bootstrap.match(/var NATIVE_KEYS = \[([^\]]+)\]/)[1].matchAll(/'([^']+)'/g)].map(m=>m[1]),NATIVE_KEYS,'and so does the bootstrap');
 assert.match(main,/private static final String PREFS = "chronos_prefs";/,'the preferences file the backup rules name');
 // The restore moved out of the post-load script: it ran after the game had read its storage.
 assert.doesNotMatch(main,/localStorage\.setItem|restore/);
 assert.match(main,/onPageFinished\(WebView view, String url\) \{[^}]*evaluateJavascript\(versionScript\(\), null\);/);
});

test('the game talks to the bridge through one coalescing sync that flushes when it goes to the background',()=>{
 assert.match(rt,/const nativeSync=createNativeSync\(window\.ChronosNative\|\|null\);\nfunction syncNativeShell\(payload\)\{nativeSync\.push\(payload\);\}/);
 assert.match(rt,/function suspend\(\)\{clearControls\(\);cancelHold\?\.\(\);lifecycleMuted=true;if\(progress&&!faultShown\)persist\(\);nativeSync\.flush\(\);/);
 assert.ok(!rt.includes("fetch('/__sync"),'no more GET sync');assert.ok(!rt.includes('URLSearchParams'));
 // Every place that persists or changes the settings still pushes the language with them.
 assert.equal((rt.match(/syncNativeShell\(\{lang:settings\.language,/g)||[]).length,4,'boot, persist, language switch, saveSettings');
 const prep=read('tools/prepare_android_assets.py');assert.match(prep,/native_bridge=flatten_module\('native-bridge\.mjs'\)/);assert.match(prep,/back_route,native_bridge,weapons/);
});
