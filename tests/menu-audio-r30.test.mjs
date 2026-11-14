// R30 (D74): «all'intro con il giaguaro ci sia una specie di ruggito e quando entro nel menu la musica non parte, parte solo
// se schiaccio settings». The WebView required a touch before any sound; the intro ended by itself, so the menu stayed silent.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Android lets the audio start without a touch, and the game starts it at boot',()=>{
 assert.match(read('android/src/com/cityadventure/pizzaprotocol/debug/MainActivity.java'),/cfg\.setMediaPlaybackRequiresUserGesture\(false\);/);
 assert.match(read('game/runtime.mjs'),/if\(settings\.sound\)audioDirector\.unlock\(\);[^\n]*\nplayStudio\(\)\.then\(showMenu\)/);
});
test('the jaguar roars as it lands (1.45 s), a skip before then silences it, and a late roar is never played',()=>{
 const rt=read('game/runtime.mjs'),ae=read('game/audio-engine.mjs');
 assert.match(rt,/audioDirector\.sting\('audio\/v10\/jaguar_roar\.ogg',settings\.reduced\?\.1:1\.45,1\.15\)/);
 assert.match(rt,/if\(performance\.now\(\)-t0<1400\)roar\?\.then\(r=>\{try\{r\?\.stop\(\);\}catch\{\}\}\);/);
 assert.match(ae,/if\(this\.context\.state!=='running'\|\|late>delay\+\.6\|\|this\.suspended\)return null;/);
});
test('the roar is an original synthesis, reproducible, packaged and routed',()=>{
 const b=fs.readFileSync(new URL('../game/audio/v10/jaguar_roar.ogg',import.meta.url));assert.equal(b.subarray(0,4).toString(),'OggS');assert.ok(b.length>20000&&b.length<200000);
 assert.match(read('tools/synth_jaguar_roar_r30.py'),/glottal_source|formant_bank/);
 assert.match(read('tools/prepare_android_assets.py'),/'jaguar_roar'\)/);assert.match(read('android/src/com/cityadventure/pizzaprotocol/debug/AssetRoutes.java'),/audio\/v10\/\(jaguar_roar\|/);
});
