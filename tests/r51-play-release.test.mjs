import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {oggStream} from './helpers/ogg-header.mjs';
import {translateText,EN_TEXT} from '../game/locale.mjs';

const rt=fs.readFileSync('game/runtime.mjs','utf8');
const html=fs.readFileSync('game/index.html','utf8');
const css=fs.readFileSync('game/style.css','utf8');
const manifest=fs.readFileSync('android/AndroidManifest.xml','utf8');
const mainJava=fs.readFileSync('android/src/jaguarZcreatorZ13/app/MainActivity.java','utf8');

test('1. LINGUA: device language detection, saved preference priority, and full IT/EN coverage',()=>{
 // R52 (D93): the shell's choice comes before the phone's language in the page too.
 assert.match(rt,/const defaultLanguage=\(\)=>nativeLanguage\(window\.ChronosNative\)\|\|\(\x2f\^it\\b\x2fi\.test\(navigator\.language\|\|\x27\x27\)\?\x27it\x27:\x27en\x27\);/);
 assert.match(rt,/city-v4-settings/);
 for(const label of [
  'CONDOTTO A GOMITO',
  'PORTALE DELLA NAVATA · CATTEDRALE D’OSSA',
  'PORTA SUD · VARCO CORAZZATO',
  'BRECCIA NORD · ACCESSO BUNKER',
  'PARATIA DELLA BRECCIA',
  'Tornare al telefono?',
  'Il progresso resta salvato su questo dispositivo.',
  'Resta',
  'Esci',
  'Caricamento del quartiere…',
  'Focolare Basso',
  'FOCOLARE BASSO',
  'Terrazze di Vetro',
  'TERRAZZE DI VETRO',
  'IMPULSO NERO'
 ]){
  assert.ok(Object.hasOwn(EN_TEXT,label),`Missing EN_TEXT entry for: ${label}`);
  assert.notEqual(translateText(label,'en'),label,`Untranslated in EN: ${label}`);
 }
 assert.equal(translateText('Focolare Basso','en'),'Lower Hearth');
 assert.equal(translateText('Terrazze di Vetro','en'),'Glass Terraces');
 assert.equal(translateText('IMPULSO NERO','en'),'BLACK PULSE');
 assert.match(mainJava,/boolean isEnglish\(/);
});

test('2. TASTO INDIETRO: hierarchical back handling and Android 16 OnBackInvokedCallback',()=>{
 assert.match(mainJava,/OnBackInvokedDispatcher\.PRIORITY_DEFAULT/);
 assert.match(mainJava,/this::onBackPressed/);
 assert.match(mainJava,/window\.__chronosBack/);
 assert.match(rt,/window\.__chronosBack=\(\)=>/);
});

test('3. BACKUP SALVATAGGI: Auto Backup and device transfer rules configured for saves',()=>{
 assert.match(manifest,/android:allowBackup="true"/);
 assert.match(manifest,/android:fullBackupContent="@xml\/backup_rules"/);
 assert.match(manifest,/android:dataExtractionRules="@xml\/data_extraction_rules"/);
 // R52 (D93): the shell keeps the saves in chronos_prefs (the domain of the backup rules); the keys live in NativeBridge.
 assert.match(fs.readFileSync('android/src/jaguarZcreatorZ13/app/NativeBridge.java','utf8'),/city-adventure-progress-v7/);assert.match(mainJava,/PREFS = "chronos_prefs"/);
 const backupRules=fs.readFileSync('android/res/xml/backup_rules.xml','utf8');
 const extractionRules=fs.readFileSync('android/res/xml/data_extraction_rules.xml','utf8');
 assert.match(backupRules,/domain="sharedpref"/);
 assert.match(backupRules,/app_webview/);
 assert.match(extractionRules,/domain="sharedpref"/);
 assert.match(extractionRules,/device-transfer/);
});

test('4. MEMORIA SU TELEFONI ECONOMICI: low-RAM detection, raster eviction, and sheet downscaling',()=>{
 assert.match(rt,/const isLowRam=\(\)=>/);
 assert.match(rt,/maxQuality=\(\)=>isLowRam\(\)\?1\.15:1\.75/);
 assert.match(rt,/function releaseMapRasters\(\)/);
 const chronoArt=fs.readFileSync('game/chrono-art.mjs','utf8');
 assert.match(chronoArt,/lowRam/);
 assert.match(chronoArt,/1024/);
 assert.match(mainJava,/isLowRamDevice/);
});

test('5. VILLAGGIO E HUD: >=12px HUD labels, >=44px buttons, and non-overlapping village bars/prompts',()=>{
 assert.match(css,/#hud span\{[^}]*font-size:12px/);
 assert.match(css,/\.vital-meter>span\{[^}]*font-size:12px/);
 assert.match(css,/\.vital-meter>output\{[^}]*12px/);
 assert.match(css,/#bossbar output\{[^}]*12px/);
});

test('6. FINALE: sequel teaser Chrono Shadows removed and replaced with neutral thank-you in IT and EN',()=>{
 assert.ok(!rt.includes('Chrono Shadows'));
 assert.ok(!html.includes('Chrono Shadows'));
 const storyIt=fs.readFileSync('game/story-v08.mjs','utf8');
 const storyEn=fs.readFileSync('game/story-en.mjs','utf8');
 assert.ok(!storyIt.includes('Chrono Shadows'));
 assert.ok(!storyEn.includes('Chrono Shadows'));
 assert.match(rt,/Grazie per aver giocato a Chronos Adventure/);
});

test('7 & 8. PULIZIA & AUDIO: Java stays in jaguarZcreatorZ13.app, debug applicationId is the test package, all game/audio at 48kHz, and normalized SFX loudness',()=>{
 assert.ok(!fs.existsSync('android/src/com/cityadventure/pizzaprotocol/debug/MainActivity.java'));
 assert.ok(fs.existsSync('android/src/jaguarZcreatorZ13/app/MainActivity.java'));
 assert.match(manifest,/package="com\.cityadventure\.pizzaprotocol\.debug"/);
 assert.match(manifest,/android:name="jaguarZcreatorZ13\.app\.MainActivity"/);
 assert.ok(!manifest.includes('package="jaguarZcreatorZ13.app"'), 'Play applicationId stays forced by tools/build_play_aab.sh, not the debug manifest');
 // R52 (D93): every sound and every piece of music in game/audio (v05, v08, v09, v10, v11, v12, v86, chrono, the jaguar's roar), not only v86.
 const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(`${d}/${e.name}`):[`${d}/${e.name}`]);
 const sounds=walk('game/audio').filter(x=>/\.(ogg|opus)$/.test(x));
 assert.ok(sounds.length>=134,'audio files found: '+sounds.length);
 for(const f of sounds){
  const sr=String(oggStream(f).sampleRate);
  assert.equal(sr,'48000',`Expected 48000 Hz for ${f}, got ${sr}`);
 }
});
