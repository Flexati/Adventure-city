// R37 (D77, stress before the players): what a real phone does and Chromium on a server does not.
// (1) The Android WebView scales the text of the page by the phone's font size on its own, inside buttons and panels measured
// in pixels and never tested that way. The shell keeps text at 100% and passes the font scale to the page, which turns on its
// tested big-text mode for Large (1.15) and above unless the player chose in Options. (2) Gesture navigation: a joystick drag
// from the screen edge was the system Back. (3) Edge to edge, a side camera cutout. (4) Small screens: a 360x640 dp phone
// leaves about 568 px to the WebView; the pause panel hid «Menu principale» and the menu heroes covered the title.
// Browser checks: tools/verify_text_zoom_r37.cjs, tools/verify_small_screens_r37.cjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const java=fs.readFileSync('android/src/jaguarZcreatorZ13/app/MainActivity.java','utf8'),runtime=fs.readFileSync('game/runtime.mjs','utf8'),css=fs.readFileSync('game/style.css','utf8');

test('short portrait screens: the pause panel tightens and the menu heroes leave the title block alone',()=>{
 const pause=css.match(/@media\(max-height:700px\) and \(orientation:portrait\)\{([^]*?)\n\}/)?.[1]||'';
 assert.match(pause,/#pause-panel \.card>small\{display:none\}/);assert.match(pause,/#pause-panel \.card button\{margin:3px 0\}/);
 assert.doesNotMatch(pause,/min-height|button\{display:none|label\{display:none/,'no control is removed or shrunk');
 const menu=css.match(/@media\(max-height:740px\) and \(orientation:portrait\)\{([^]*?)\n\}/)?.[1]||'';
 assert.match(menu,/\.brand-kicker\{display:none\}/,'as below 520 px');
 assert.match(menu,/\.menu-heroes\{top:calc\(max\(24px,env\(safe-area-inset-top\)\) \+ 18px\);--hw:min\(60vw,270px,21vh\)\}/,'under the studio label');
 assert.match(menu,/#menu #start\{min-height:52px\}/);
 assert.ok(fs.readFileSync('tools/verify_small_screens_r37.cjs','utf8').includes('[[360,568],[592,336],[360,640],[360,800]]'),'the browser check uses the WebView sizes of a small phone');
});

test('the shell keeps text at 100% and gives the page the phone font scale, as a value and not a bridge',()=>{
 assert.match(java,/cfg\.setTextZoom\(100\);/);
 assert.match(java,/float scale = getResources\(\)\.getConfiguration\(\)\.fontScale;/);
 assert.match(java,/",fontScale:" \+ \(scale > 0 \? scale : 1\)/);
 // R52 (D93): the one bridge of the shell carries saves and language (NativeBridge); the font scale still travels as a value.
 assert.equal((java.match(/addJavascriptInterface\(/g)||[]).length,1);assert.match(java,/addJavascriptInterface\(new NativeBridge\([^;]*\), NativeBridge\.NAME\);/);
});

test('the thumb zones at the bottom of both edges are kept from the system Back gesture, within the 200 dp Android honours',()=>{
 assert.match(java,/root\.addOnLayoutChangeListener\(\(v, l, t, r, b, ol, ot, or, ob\) -> excludeBackGesture\(v\)\);/);
 assert.match(java,/if \(Build\.VERSION\.SDK_INT < 29\) return;/,'the call exists from Android 10, minSdk is 26');
 assert.match(java,/int edge = Math\.round\(48 \* dp\), top = Math\.max\(v\.getPaddingTop\(\), bottom - Math\.round\(200 \* dp\)\);/);
 assert.match(java,/zones\.add\(new Rect\(0, top, edge, bottom\)\);\s*zones\.add\(new Rect\(w - edge, top, w, bottom\)\);\s*v\.setSystemGestureExclusionRects\(zones\);/);
 assert.match(java,/registerOnBackInvokedCallback\([\s\S]*?this::onBackPressed\)/,'Android 13-16 predictive back callback registered');
 assert.match(java,/@Override public void onBackPressed\(\) \{[\s\S]*?window\.__chronosBack[\s\S]*?pauseGame\(\);/,'Back first closes open panels, then asks before leaving');
});

test('edge to edge, the game is padded by the larger of system bars and camera cutout on every side',()=>{
 assert.match(java,/DisplayCutout cut = Build\.VERSION\.SDK_INT >= 28 \? insets\.getDisplayCutout\(\) : null;/);
 for(const [side,get] of [['left','Left'],['top','Top'],['right','Right'],['bottom','Bottom']])
  assert.match(java,new RegExp(side+' = Math\\.max\\('+side+', cut\\.getSafeInset'+get+'\\(\\)\\);'),side);
 assert.match(java,/v\.setPadding\(left, top, right, bottom\);/);
});

test('the page follows the phone font only while the player has not chosen, and never saves it',()=>{
 assert.match(runtime,/let sysBigText=false;function applyTextSize\(\)\{document\.body\.classList\.toggle\('big-text',!!\(settings\.bigText\?\?sysBigText\)\);\}/);
 assert.match(runtime,/sysBigText=v\?\.fontScale>=1\.15;applyTextSize\(\);\}/);
 assert.match(runtime,/\$\('opt-big-text'\)\.checked=!!\(settings\.bigText\?\?sysBigText\);/,'Options show the mode in use');
 assert.doesNotMatch(runtime,/settings\.bigText=sysBigText/,'the automatic choice is not written into the saved settings');
});
