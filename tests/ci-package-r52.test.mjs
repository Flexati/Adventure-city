// R52 (D93): the smoke CI must launch the package that is actually built (jaguarZcreatorZ13.app), and no live file may
// point at the old debug package. Historical records (docs/, artifacts/, the R46 regression report, gallery) are not live files.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const OLD = /com[./]cityadventure[./]pizzaprotocol|com\\\.cityadventure\\\.pizzaprotocol/;
const HISTORICAL = [/^docs\//, /^artifacts\//, /gallery/i, /^CHRONOS_FINAL_REGRESSION_REPORT\.md$/, /^tests\//];

test('CI smoke build launches jaguarZcreatorZ13.app, the package of the built APK', () => {
 const yml = fs.readFileSync('.github/workflows/android-smoke-build.yml', 'utf8');
 assert.ok(!OLD.test(yml), 'old package still in the workflow');
 assert.ok(yml.includes('jaguarZcreatorZ13.app/jaguarZcreatorZ13.app.MainActivity'), 'am start must name the real activity');
 assert.ok(yml.includes('pidof jaguarZcreatorZ13.app'));
 assert.ok(/Process: jaguarZcreatorZ13\\\.app/.test(yml), 'the crash filter must match the real process');
 const manifest = fs.readFileSync('android/AndroidManifest.xml', 'utf8');
 assert.ok(manifest.includes('package="jaguarZcreatorZ13.app"'), 'workflow and manifest must name the same package');
});

test('no tracked live file refers to the old package', () => {
 const files = execFileSync('git', ['ls-files', '-z'], {encoding: 'utf8'}).split('\0').filter(Boolean);
 const hits = [];
 for (const f of files) {
  if (HISTORICAL.some(r => r.test(f)) || !fs.existsSync(f)) continue;
  const buf = fs.readFileSync(f);
  if (buf.includes(0)) continue; // binary
  if (OLD.test(buf.toString('utf8'))) hits.push(f);
 }
 assert.deepEqual(hits, []);
});
