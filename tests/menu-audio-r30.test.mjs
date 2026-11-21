// R30 (D74): «all'intro con il giaguaro ci sia una specie di ruggito e quando entro nel menu la musica non parte, parte solo
// se schiaccio settings». The WebView required a touch before any sound; the intro ended by itself, so the menu stayed silent.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Android lets the audio start without a touch, and the game starts it at boot',()=>{
 assert.match(read('android/src/jaguarZcreatorZ13/app/MainActivity.java'),/cfg\.setMediaPlaybackRequiresUserGesture\(false\);/);
 assert.match(read('game/runtime.mjs'),/if\(settings\.sound\)audioDirector\.unlock\(\);[^\n]*\nplayStudio\(\)\.then\(showMenu\)/);
});
test('the jaguar roars into the hit of the name (1.8 s), a skip before then silences it, and a late roar is never played',()=>{
 const rt=read('game/runtime.mjs'),ae=read('game/audio-engine.mjs');
 assert.match(rt,/roar=on\?audioDirector\.sting\('audio\/v10\/jaguar_roar\.ogg',settings\.reduced\?\.1:1\.62,\.55\):null/);
 assert.match(rt,/if\(performance\.now\(\)-t0<1600\)roar\?\.then\(r=>audioDirector\.hush\(r\)\);/);
 assert.match(ae,/if\(this\.context\.state!=='running'\|\|late>delay\+\.6\|\|this\.suspended\)return null;/);
});
test('D78: the theme of the intro is one sound in step with the three frames, not a cue that fades in; a skip fades it out',()=>{
 const rt=read('game/runtime.mjs'),ae=read('game/audio-engine.mjs');
 assert.match(rt,/const theme=on&&!settings\.reduced\?audioDirector\.sting\('audio\/v10\/jaguar_intro_theme\.ogg',0,1\):null/);
 assert.match(rt,/theme\?\.then\(r=>audioDirector\.hush\(r\)\);/);
 assert.doesNotMatch(rt,/soundtrack\('jaguar_intro_theme'\)/);assert.doesNotMatch(ae,/jaguar_intro_theme/,'no streamed cue left behind');
 // Ready late, it starts inside itself: the hit of the name stays at 1.8 s of the picture.
 assert.match(ae,/skip=Math\.max\(0,late-delay\);if\(skip\)\{g\.gain\.setValueAtTime\(0,now\);g\.gain\.linearRampToValueAtTime\(level,now\+\.02\);\}s\.start\(now\+Math\.max\(0,delay-late\),skip\);/);
 assert.match(ae,/hush\(s\)\{try\{s\.g\.gain\.setTargetAtTime\(0,this\.context\.currentTime,\.04\);s\.stop\(this\.context\.currentTime\+\.2\);\}catch\{\}\}/);
 const b=fs.readFileSync(new URL('../game/audio/v10/jaguar_intro_theme.ogg',import.meta.url));assert.equal(b.subarray(0,4).toString(),'OggS');
});
test('the roar is an original synthesis, reproducible, packaged and routed',()=>{
 const b=fs.readFileSync(new URL('../game/audio/v10/jaguar_roar.ogg',import.meta.url));assert.equal(b.subarray(0,4).toString(),'OggS');assert.ok(b.length>20000&&b.length<200000);
 assert.match(read('tools/synth_jaguar_roar_r30.py'),/glottal_source|formant_bank/);
 assert.match(read('tools/prepare_android_assets.py'),/'jaguar_roar'\)/);assert.match(read('android/src/jaguarZcreatorZ13/app/AssetRoutes.java'),/audio\/v10\/\(jaguar_roar\|/);
});
