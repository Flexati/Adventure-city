// R54 (D95): the free edition. Act I open, one purchase opens the rest; the paid app and a browser never lock anything.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {shellEdition,parseStoreState,createStoreGate,storeScreenText,STORE_TEXT,STORE_PRODUCT,FREE_ACTS,FREE_TEASER_LINES} from '../game/native-bridge.mjs';
import {CAMPAIGN,ACTS} from '../game/missions.mjs';
import {translateText} from '../game/locale.mjs';
const freeShell={edition:()=>'free'};
const store=(state,calls=[])=>({state:()=>JSON.stringify(state.v),buy:()=>calls.push('buy'),restore:()=>calls.push('restore')});

test('the edition is free only when the shell says "free"; anything else is the paid game',()=>{
 assert.equal(shellEdition(freeShell),'free');
 for(const other of [null,undefined,{},{edition:()=>'paid'},{edition:()=>'FREE'},{edition:()=>null},{edition(){throw new Error('x');}}])assert.equal(shellEdition(other),'paid');
});

test('paid app and browser: no step of the campaign is ever locked, and no store call is made',()=>{
 const calls=[];for(const shell of [null,{},{edition:()=>'paid'}]){const g=createStoreGate({shell,store:store({v:{entitled:false}},calls)});
  assert.equal(g.free,false);assert.equal(g.entitled(),true);for(const s of CAMPAIGN)assert.equal(g.locked(s.act),false,s.id);
  g.buy();g.restore();}
 assert.deepEqual(calls,[],'a paid build never opens the store');
});

test('free app without the purchase: Act I is open, every later act is locked, and so is an act nobody can place',()=>{
 const g=createStoreGate({shell:freeShell,store:store({v:{entitled:false,status:'ready',price:'5,99 €'}})});
 assert.equal(FREE_ACTS,1);assert.equal(g.entitled(),false);
 for(const s of CAMPAIGN)assert.equal(g.locked(s.act),s.act>1,s.id+' act '+s.act);
 for(const bad of [undefined,null,NaN,0,'x'])assert.equal(g.locked(bad),true,'unplaceable act '+bad+' stays locked');
 assert.ok(CAMPAIGN.some(s=>s.act===1)&&CAMPAIGN.some(s=>s.act>1));
 assert.equal(CAMPAIGN.findIndex(s=>s.act>1),CAMPAIGN.filter(s=>s.act===1).length,'Act I is one block at the start: the first locked step follows the last free one');
});

test('with the entitlement every act opens; the page cannot grant it by itself',()=>{
 const st={v:{entitled:false,status:'ready',price:'5,99 €'}},g=createStoreGate({shell:freeShell,store:store(st)}),seen=[];
 g.subscribe(x=>seen.push(x.state.status));
 assert.equal(g.locked(2),true);st.v={entitled:true};g.refresh();
 assert.equal(g.locked(2),false);assert.equal(g.locked(4),false);assert.equal(g.state.status,'owned');assert.deepEqual(seen,['owned']);
 // nothing the page can do flips it: state is a copy, and only the shell's JSON counts
 const copy=g.state;copy.entitled=false;assert.equal(g.entitled(),true);
 const g2=createStoreGate({shell:freeShell,store:store({v:{entitled:false}})});g2.state.entitled=true;assert.equal(g2.locked(2),true);
 for(const raw of ['{"entitled":"true"}','{"entitled":1}','{"entitled":"yes"}','not json','null','[]',undefined])assert.equal(parseStoreState(raw).entitled,false,String(raw));
});

test('a refund or a different account takes the entitlement back at the next refresh',()=>{
 const st={v:{entitled:true}},g=createStoreGate({shell:freeShell,store:store(st)});assert.equal(g.locked(3),false);
 st.v={entitled:false,status:'ready'};g.refresh();assert.equal(g.locked(3),true);
});

test('free app with a missing or broken store bridge stays locked (fails closed) and says so',()=>{
 for(const broken of [null,{},{state(){throw new Error('x');}},{state:()=>'garbage'}]){const g=createStoreGate({shell:freeShell,store:broken});
  assert.equal(g.locked(2),true);assert.ok(['unavailable','error'].includes(g.state.status),g.state.status);
  assert.doesNotThrow(()=>{g.buy();g.restore();});}
});

test('buy and restore reach the shell; a failing shell call is an error, not a crash or an unlock',()=>{
 const calls=[],g=createStoreGate({shell:freeShell,store:store({v:{entitled:false,status:'ready'}},calls)});
 assert.equal(g.buy(),true);assert.equal(g.restore(),true);assert.deepEqual(calls,['buy','restore']);
 const bad=createStoreGate({shell:freeShell,store:{state:()=>'{"status":"ready"}',buy(){throw new Error('no');},restore(){throw new Error('no');}}});
 assert.equal(bad.buy(),false);assert.equal(bad.state.status,'error');assert.equal(bad.locked(2),true);
});

test('the shell states map to words in both languages, and the price shows on the button when the shell knows it',()=>{
 for(const lang of ['it','en'])for(const status of ['loading','ready','purchasing','pending','owned','canceled','notfound','error','unavailable']){
  const t=storeScreenText(lang,{status,price:null});assert.ok(t.status&&t.status.length>8,lang+' '+status);}
 assert.equal(storeScreenText('it',{status:'ready',price:'5,99 €'}).buy,'Sblocca tutto · 5,99 €');
 assert.equal(storeScreenText('en',{status:'ready',price:'€5.99'}).buy,'Unlock everything · €5.99');
 assert.equal(storeScreenText('en',{status:'ready'}).buyDisabled,false);
 for(const status of ['loading','purchasing','pending','owned','unavailable'])assert.equal(storeScreenText('it',{status}).buyDisabled,true,'no double purchase while '+status);
 assert.equal(storeScreenText('it',{status:'canceled'}).buyDisabled,false,'a cancelled purchase can be retried');
 assert.equal(storeScreenText('xx',{status:'ready'}).kicker,STORE_TEXT.it.kicker);
});

test('the unlock screen shows what is coming: the three later acts, in Italian and English, with the real act names',()=>{
 for(const lang of ['it','en']){const t=storeScreenText(lang,{status:'ready'});assert.equal(t.acts.length,3);for(const [name,text] of t.acts)assert.ok(name&&text.length>30);}
 const it=STORE_TEXT.it.acts.map(a=>a[0]);assert.deepEqual(it,[2,3,4].map(n=>ACTS[n]),'the Italian act names are the game\'s own');
 assert.match(STORE_TEXT.en.remaining(31),/31 stages/);assert.match(STORE_TEXT.it.remaining(31),/31 tappe/);
});

test('Act I ends on a teaser beat that has an English line for every Italian one',()=>{
 assert.ok(FREE_TEASER_LINES.length>=3);
 for(const l of FREE_TEASER_LINES){assert.ok(l.speaker&&l.text);const en=translateText(l.text,'en');assert.notEqual(en,l.text,'English for: '+l.text);}
 const last=FREE_TEASER_LINES.at(-1).text;assert.ok(last.includes(ACTS[2]),'the beat ends by naming Act II');
});

test('the product id is the one the Play Console must have',()=>{assert.equal(STORE_PRODUCT,'unlock_full_game');});

test('runtime: the lock sits in enterStep and in Continue, the screen is a modal that Back closes to the menu, hubs and result screens hide it',()=>{
 const rt=fs.readFileSync('game/runtime.mjs','utf8'),html=fs.readFileSync('game/index.html','utf8');
 assert.match(rt,/progress\.step=i;if\(!resumeCleared\)progress\.status='playing';\n if\(storeGate\.locked\(step\.act\)\)\{persist\(\);await showStoreScreen\(\);return;\}/);
 assert.match(rt,/progress\.world\.hub&&!storeGate\.locked\(CAMPAIGN\[progress\.step\]\.act\)/);
 assert.match(rt,/'credits-skip','store-panel'\]/);assert.match(rt,/if\(!\$\('store-panel'\)\.hidden\)\{\$\('store-menu'\)\.click\(\);return true;\}/);
 for(const id of ['store-panel','store-buy','store-restore','store-menu','store-acts','store-status'])assert.ok(html.includes('id="'+id+'"'),id);
 assert.match(html,/id="store-panel" class="modal" hidden role="dialog" aria-modal="true"/,'it starts hidden');
});

// ---- the Android side (cannot run a phone here; these keep the two apps and the two manifests from drifting) ----
const read=p=>fs.readFileSync(p,'utf8');
const code=p=>read(p).replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/.*$/gm,'');
const attrs=xml=>{const m=xml.match(/<application\b([^>]*)>/s)[1];return Object.fromEntries([...m.matchAll(/android:(\w+)="([^"]*)"/g)].map(x=>[x[1],x[2]]));};

test('the free manifest is the paid one with only the Gradle-owned attributes different',()=>{
 const paid=read('android/AndroidManifest.xml'),free=read('android-free/app/src/main/AndroidManifest.xml');
 const a=attrs(paid),b=attrs(free);
 assert.equal(b.label,a.label,'same launcher label as the paid app');assert.doesNotMatch(free.replace(/<!--[\s\S]*?-->/g,'').replace(/jaguarZcreatorZ13\.app\.free/g,''),/free|gratis|gratuit/i,'no Free or Gratis in the free manifest strings');
 for(const k of Object.keys(a))if(!['debuggable'].includes(k))assert.equal(b[k],a[k],'application attribute '+k);
 for(const k of Object.keys(b))assert.ok(k in a,'no new application attribute: '+k);
 assert.equal(b.debuggable,undefined,'the free manifest does not set debuggable: Gradle release builds are not');
 const act=x=>x.match(/<activity\b[\s\S]*?<\/activity>/)[0].replace(/\s+/g,' ');assert.equal(act(free),act(paid),'same activity, same configChanges');
 assert.deepEqual([...free.matchAll(/<uses-permission android:name="([^"]+)"/g)].map(m=>m[1]),[...paid.matchAll(/<uses-permission android:name="([^"]+)"/g)].map(m=>m[1]),'the library adds BILLING by manifest merge, nothing else is declared by hand');
 assert.doesNotMatch(free,/package=|versionCode|targetSdkVersion/,'Gradle owns these');
});

test('the paid app is untouched: applicationId, version, signing script and manifest still say what D93/D94 say',()=>{
 const play=read('tools/build_play_aab.sh'),man=read('android/AndroidManifest.xml'),aab=read('tools/build_aab.sh');
 assert.match(play,/AAB_PACKAGE_NAME='jaguarZcreatorZ13\.app'/);assert.match(play,/PLAY_VERSION_CODE:-4/);assert.match(play,/AAB_EXPECTED_CERT_SHA256='6E:0A:ED:9C[^']*59:DB'/);assert.match(play,/chronos-upload/);
 assert.match(man,/package="com\.cityadventure\.pizzaprotocol\.debug"/);
 assert.doesNotMatch(play+aab+man,/billing|\.free\b|unlock_full_game/i,'no billing, no free id in the paid build files');
 const main=code('android/src/jaguarZcreatorZ13/app/MainActivity.java');
 assert.ok(!/billingclient|ChronosStore/.test(main),'the shared activity names no billing class');
 assert.match(read('android/src/jaguarZcreatorZ13/app/StoreHook.java'),/endsWith\(FREE_SUFFIX\)/);
 assert.match(read('android/src/jaguarZcreatorZ13/app/StoreHook.java'),/if \(!isFree\(activity\.getPackageName\(\)\)\) return null;\n/,'the paid app returns before touching any billing or edition class');
});

test('the free module: its own applicationId, versionCode from 1, no signing or keys, Play Billing 8+ with the Kotlin versions aligned',()=>{
 const g=read('android-free/app/build.gradle'),gc=code('android-free/app/build.gradle');
 assert.match(g,/applicationId 'jaguarZcreatorZ13\.app\.free'/);assert.match(g,/FREE_VERSION_CODE'\) \?: '1'/);
 assert.match(g,/targetSdk 36/);assert.match(g,/minSdk 26/);assert.match(g,/minifyEnabled false/);
 assert.ok(!/signingConfig|storeFile|keystore|storePassword/i.test(gc),'no key or password in Gradle');
 const v=g.match(/billing:(\d+)\.(\d+)\.(\d+)/);assert.ok(v&&Number(v[1])>=8,'Play requires Billing 8+ for new apps and updates after 31 Aug 2026');
 assert.match(g,/kotlin-bom/);assert.match(g,/'\.\.\/\.\.\/android\/src', 'src\/main\/java'/);
 const sh=read('tools/build_free_aab.sh');assert.doesNotMatch(sh,/keytool -genkey|-genkeypair|generate_play_upload_key/,'the script never creates a key');
 assert.match(sh,/PLAY_UPLOAD_KEYSTORE:\?/);
});

test('the store bridge: one product, one JavaScript name, the three calls and the states the page knows',()=>{
 const j=read('android-free/app/src/main/java/jaguarZcreatorZ13/app/StoreBridge.java');
 assert.match(j,new RegExp('PRODUCT = "'+STORE_PRODUCT+'"'));assert.match(j,/NAME = "ChronosStore"/);
 for(const m of ['state','buy','restore'])assert.match(j,new RegExp('@JavascriptInterface\\s+public \\w+ '+m+'\\('));
 assert.equal([...j.matchAll(/@JavascriptInterface/g)].length,4,'the three store calls and edition(): nothing else is open to the page');
 assert.match(j,/web\.addJavascriptInterface\(new Edition\(\), "ChronosEdition"\);\n[\s\S]*new StoreBridge/,'the edition is registered before any billing object exists');
 for(const call of ['queryPurchasesAsync','queryProductDetailsAsync','launchBillingFlow','acknowledgePurchase','enablePendingPurchases','enableAutoServiceReconnection'])assert.ok(j.includes(call),call);
 assert.match(j,/ProductType\.INAPP/);assert.match(j,/PurchaseState\.PURCHASED/);assert.match(j,/PurchaseState\.PENDING/);
 const states=new Set([...j.matchAll(/set\("(\w+)"\)/g)].map(m=>m[1]).concat(['loading','owned']));
 for(const s of states)assert.ok(Object.keys(STORE_TEXT.it).includes(s),'the page has a text for the state '+s);
 assert.ok(!/setEntitled\(true\)/.test(j.replace(/if \(owned\) \{\s*setEntitled\(true\);/,'')),'entitled is granted in one place only, from a PURCHASED purchase');
});

test('nothing the player reads says Free or Gratis: unlock screen, teaser, act teasers (IT and EN)',()=>{
 const texts=[JSON.stringify(STORE_TEXT,(k,v)=>typeof v==='function'?v(12,44,3):v),JSON.stringify(FREE_TEASER_LINES)].join(' ');
 assert.doesNotMatch(texts,/\bfree\b|gratis|gratuit/i);
});
