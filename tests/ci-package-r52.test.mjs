// D94: the debug APK keeps applicationId com.cityadventure.pizzaprotocol.debug
// so it cannot collide with the Play app (jaguarZcreatorZ13.app, versionCode 5).
// Java sources stay in jaguarZcreatorZ13.app; smoke CI must launch that pair.
// tools/build_play_aab.sh (untouched) still forces the Play identity.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const DEBUG_APP = 'com.cityadventure.pizzaprotocol.debug';
const PLAY_APP = 'jaguarZcreatorZ13.app';
const ACTIVITY = 'jaguarZcreatorZ13.app.MainActivity';
const COMPONENT = DEBUG_APP+'/'+ACTIVITY;

test('debug APK identity is the pre-PR test package, not the Play applicationId', () => {
 const manifest = fs.readFileSync('android/AndroidManifest.xml', 'utf8');
 assert.ok(manifest.includes('package="'+DEBUG_APP+'"'), 'debug manifest applicationId');
 assert.ok(!manifest.includes('package="'+PLAY_APP+'"'), 'Play applicationId must not be the debug package');
 assert.ok(manifest.includes('android:name="'+ACTIVITY+'"'), 'debug manifest must name the Java activity with its full class');
 assert.ok(fs.existsSync('android/src/jaguarZcreatorZ13/app/MainActivity.java'));
 assert.ok(!fs.existsSync('android/src/com/cityadventure/pizzaprotocol/debug/MainActivity.java'));
});

test('CI smoke build launches the debug package and the existing Java activity', () => {
 const yml = fs.readFileSync('.github/workflows/android-smoke-build.yml', 'utf8');
 assert.ok(yml.includes('am start -W -n '+COMPONENT), 'am start must name debug package / Java activity');
 assert.ok(yml.includes('pidof '+DEBUG_APP));
 assert.ok(yml.includes('force-stop '+DEBUG_APP));
 assert.ok(yml.includes('Process: com\\.cityadventure\\.pizzaprotocol\\.debug'), 'the crash filter must match the debug process');
 assert.ok(!yml.includes('pidof '+PLAY_APP), 'smoke CI must not pidof the Play applicationId');
 const recovery = fs.readFileSync('tools/verify_android_recovery.mjs', 'utf8');
 assert.ok(recovery.includes("'"+DEBUG_APP+"'"), 'recovery verifier defaults to the debug APK');
 assert.ok(recovery.includes("'"+ACTIVITY+"'"), 'recovery verifier must start the Java activity class');
});

test('Play AAB script still forces jaguarZcreatorZ13.app (unchanged)', () => {
 const play = fs.readFileSync('tools/build_play_aab.sh', 'utf8');
 assert.match(play, /export AAB_PACKAGE_NAME='jaguarZcreatorZ13\.app'/);
 assert.match(play, /export AAB_ACTIVITY_NAME='jaguarZcreatorZ13\.app\.MainActivity'/);
 assert.match(play, /export AAB_VERSION_NAME="\$\{PLAY_VERSION_NAME:-1\.0\.0\}"/);
 const aab = fs.readFileSync('tools/build_aab.sh', 'utf8');
 assert.match(aab, /PACKAGE_NAME="\$\{AAB_PACKAGE_NAME:-jaguarZcreatorZ13\.app\}"/);
});
