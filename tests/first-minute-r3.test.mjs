import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {translateText,localeStatus} from '../game/locale.mjs';
// R3, the first minute of a pretest: the build a tester reports, where to tap first, the field kit in English, D39 in the Controls tab.
const java=fs.readFileSync('android/src/com/cityadventure/pizzaprotocol/debug/MainActivity.java','utf8'),html=fs.readFileSync('game/index.html','utf8'),runtime=fs.readFileSync('game/runtime.mjs','utf8');

test('Credits show the installed build: the shell writes versionName and versionCode from the package, the page reads them',()=>{
 assert.match(java,/getPackageManager\(\)\.getPackageInfo\(getPackageName\(\), 0\)/);
 assert.match(java,/"window\.chronosAppVersion=\{name:" \+ JSONObject\.quote\(name\) \+ ",code:" \+ code/);
 assert.match(java,/onPageFinished\(WebView view, String url\) \{[^}]*evaluateJavascript\(versionScript\(\), null\);/);
 assert.doesNotMatch(java,/addJavascriptInterface/,'the page gets values, not a bridge into Java');
 assert.match(html,/<div id="page-credits"[^]*?<p id="app-version" class="app-version"><\/p>/);
 assert.match(runtime,/window\.addEventListener\('chronosversion',showVersion\);showVersion\(\);/);
 assert.equal(translateText('Versione 1.0.0 (2)','en'),'Version 1.0.0 (2)');
 assert.equal(translateText('Versione 0.10-v8-rc.2-debug (13)','en'),'Version 0.10-v8-rc.2-debug (13)');
 assert.equal(translateText('Versione di sviluppo','en'),'Development build');
});

test('D39: the Controls tab lists touch and gamepad, no keyboard keys',()=>{
 const page=html.match(/<div id="page-controls".*?<\/div>/s)[0];
 assert.doesNotMatch(page,/Tastiera|WASD/);assert.match(page,/<dt>Tocco<\/dt>/);assert.match(page,/<dt>Gamepad<\/dt>/);
});

test('the opening and the knock carry a tap invitation that appears after 2.5 s without a knock',()=>{
 for(const id of ['opening-surface','knock-surface'])assert.match(html,new RegExp('<button id="'+id+'"[^>]*>(?:(?!</button>).)*<i class="tap-invite" aria-hidden="true"></i></button>','s'),id);
 assert.match(runtime,/function inviteTap\(el,waiting\)\{[^}]*setTimeout\(\(\)=>\{if\(waiting\(\)\)el\.classList\.add\('invite'\);\},2500\);\}/);
 assert.match(fs.readFileSync('game/style.css','utf8'),/\.reduced-motion \.invite \.tap-invite\{animation:none;opacity:\.7\}/);
});

test('Tessa field kit and the weapon bar read in English',()=>{
 for(const t of ['Armi','CAMBIA','RICARICA','RICARICA 1.2 s','TECNICA D’OFFICINA','Un attrezzo per ogni distanza.','Monta Quickdraw e prendi le armi',
  'Il componente di Rook diventa Quickdraw: dopo Schiva, il prossimo tiro C-9 recupera più in fretta. Usa CAMBIA nel prossimo combattimento; RICARICA riempie il caricatore.',
  '«Il mio banco viaggia anche a officina chiusa. VX-9 a Nox: raffiche da tre. R-12 a Lulù: rosate da vicino. La C-9 resta con voi.»'])assert.notEqual(translateText(t,'en'),t,t);
 for(const t of ['TESSA','NITRO','Nitro'])assert.equal(translateText(t,'en'),t);
 assert.deepEqual(localeStatus().untranslated,[]);
});
