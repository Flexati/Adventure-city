import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {getCombatMapLifeCache, glassShardFrame, drawGlassKeepsakeProp} from '../game/village-art.mjs';
import {getLayout} from '../game/layouts.mjs';
import {codexProgress, CODEX} from '../game/codex.mjs';
import {CAMPAIGN, newProgress} from '../game/missions.mjs';
import {INTERIORS} from '../game/interiors.mjs';
import {translateText} from '../game/locale.mjs';
import crypto from 'node:crypto';
import {PNG} from 'pngjs';

test('R54 perf: getCombatMapLifeCache memoizes per layout and extracts deterministic map props', () => {
  const lay = getLayout('gallery');
  const first = getCombatMapLifeCache(lay);
  const second = getCombatMapLifeCache(lay);
  assert.equal(first, second, 'cache must return the exact same object for repeated frames');
  assert.ok(Array.isArray(first.vents) && Array.isArray(first.turbines) && Array.isArray(first.leds));
  assert.ok(first.vents.length + first.turbines.length + first.leds.length > 0, 'gallery layout must have cached ambient props');
  assert.deepEqual(getCombatMapLifeCache(null), {vents: [], turbines: [], leds: []});
});

test('R54 perf: no per-frame createRadialGradient inside hot render functions', () => {
  const va = fs.readFileSync(new URL('../game/village-art.mjs', import.meta.url), 'utf8');
  const rt = fs.readFileSync(new URL('../game/runtime.mjs', import.meta.url), 'utf8');

  const chestBlock = va.slice(va.indexOf('export function drawTreasureChest3D'), va.indexOf('export function drawHeldWeaponAndMuzzle'));
  assert.ok(!chestBlock.includes('createRadialGradient'), 'drawTreasureChest3D must use cached glow stamp');

  const narrBlock = va.slice(va.indexOf('export function drawNarrativeImmersion'), va.indexOf('const COMBAT_LIFE_CACHE'));
  assert.ok(!narrBlock.includes('createRadialGradient'), 'drawNarrativeImmersion must use cached vignette stamp');

  const fireGlowLine = rt.split('\n').find(l => l.startsWith('function fireGlow('));
  assert.ok(fireGlowLine && !fireGlowLine.includes('createRadialGradient'), 'fireGlow must use cached stamp canvas');

  assert.ok(!rt.includes('enemySprite(a,c.kind);enemySprite(a,c.kind);'), 'hitstop flash must not overdraw enemySprite twice');
  assert.ok(!rt.includes('fx=fx.filter(f=>f.life>0)'), 'frameStep must compact fx in-place without per-frame filter allocations');
});

test('R54 Android WebView/Back hardening: MainActivity deduplicates exit dialog and unregisters predictive back cleanly', () => {
  const java = fs.readFileSync(new URL('../android/src/jaguarZcreatorZ13/app/MainActivity.java', import.meta.url), 'utf8');
  assert.ok(java.includes('private Object backInvokedCallback;'), 'backInvokedCallback field required (Object for pre-API-33 safety)');
  assert.ok(java.includes('unregisterOnBackInvokedCallback((OnBackInvokedCallback) backInvokedCallback)'), 'predictive back callback must be unregistered in onDestroy');
  assert.ok(java.includes('private AlertDialog exitDialog;'), 'exitDialog field required to prevent stacked dialogs');
  assert.ok(java.includes('isFinishing() || isDestroyed()'), 'async evaluateJavascript callback must guard lifecycle state');
  assert.ok(java.includes('exitDialog.dismiss()'), 'onDestroy must dismiss exitDialog if open');
});

test('R54 Back routing: runtime __chronosBack guards fault-panel, studio intro, and credits-skip', () => {
  const rt = fs.readFileSync(new URL('../game/runtime.mjs', import.meta.url), 'utf8');
  const block = rt.slice(rt.indexOf('window.__chronosBack=()=>{'), rt.indexOf('// ---------- Input ----------'));
  assert.ok(block.includes("$('fault-panel').hidden"), '__chronosBack must guard fault-panel');
  assert.ok(block.includes("$('studio').hidden"), '__chronosBack must skip studio intro on Back');
  assert.ok(block.includes("$('credits-skip').hidden"), '__chronosBack must handle credits-skip on Back');
});

test('R54 CI workflow: android-smoke-build triggers on release & ccr PR target branches', () => {
  const yml = fs.readFileSync(new URL('../.github/workflows/android-smoke-build.yml', import.meta.url), 'utf8');
  assert.ok(yml.includes('ccr-*'), 'android-smoke-build must trigger on PRs targeting ccr-*');
  assert.ok(yml.includes('fix/play-store-release-*'), 'android-smoke-build must trigger on PRs targeting fix/play-store-release-*');
});

test('R54 Archive & Replay value: codexProgress counts all 70 pages and IT/EN translations cover new Replay & Archive copy', () => {
  const residents = Object.values(INTERIORS).reduce((n, h) => n + Object.keys(h).length, 0);
  const expectedTotal = CODEX.length + residents;
  const fresh = newProgress();
  const c0 = codexProgress(fresh, CAMPAIGN, INTERIORS);
  assert.equal(c0.total, expectedTotal);
  assert.equal(c0.open, 0, 'fresh run before clearing blackout starts at 0 open Archive pages');

  fresh.world.rewards.push('blackout');
  const c1 = codexProgress(fresh, CAMPAIGN, INTERIORS);
  assert.ok(c1.open > 0, 'clearing blackout must open initial codex pages');

  fresh.world.visited.push('moon');
  const c2 = codexProgress(fresh, CAMPAIGN, INTERIORS);
  assert.ok(c2.open > c1.open, 'visiting a district must open its residents in codexProgress');

  assert.equal(translateText('Finali scoperti: 2/5', 'en'), 'Endings found: 2/5');
  assert.equal(translateText(`Archivio: 12/${expectedTotal}`, 'en'), `Archive: 12/${expectedTotal}`);
  assert.equal(translateText('Conservi: armi, potenziamenti e bagaglio.', 'en'), 'Kept: weapons, upgrades and inventory.');
  assert.equal(translateText('Cambia: scelte, dialoghi e finale tra i 5 della storia.', 'en'), 'Changes: choices, dialogue and ending among the 5 in the story.');
  assert.equal(translateText('Nessuna scelta registrata in questa partita.', 'en'), 'No choices recorded in this run.');
  assert.equal(translateText('MIRA 3/4', 'en'), 'AIM 3/4');
  assert.equal(translateText('MIRA', 'en'), 'MIRA', 'character name MIRA must remain invariant');
});

test('R54 HUD & combat readability: bossbar phase markers, replay-summary slot, boss-active clearance, and cyan objective beacon exist', () => {
  const css = fs.readFileSync(new URL('../game/style.css', import.meta.url), 'utf8');
  const html = fs.readFileSync(new URL('../game/index.html', import.meta.url), 'utf8');
  const rt = fs.readFileSync(new URL('../game/runtime.mjs', import.meta.url), 'utf8');
  assert.ok(css.includes('#bossbar .vital-track::after'), 'bossbar must include phase threshold ticks');
  assert.ok(css.includes('.boss-active #bag{top:max('), 'portrait boss-active #bag must clear --bossbar-bottom');
  assert.ok(css.includes('.boss-active #bark{top:max(calc(72px'), 'landscape boss-active #bark must clear --bossbar-bottom');
  assert.ok(html.includes('id="replay-summary"'), 'index.html must include #replay-summary');
  assert.ok(rt.includes('#6df2ff'), 'objective beacon must use cyan-mint disambiguation');
});

test('R54 AAA initial glass shard sprite sheet: 4x1 PNG strip with 4 distinct states, binary alpha, Android allowlist, CSS step animation, and canvas prop rendering', () => {
  const pngPath = new URL('../game/art/v09/glass_shard_states.png', import.meta.url);
  assert.ok(fs.existsSync(pngPath), 'game/art/v09/glass_shard_states.png must exist');
  const png = PNG.sync.read(fs.readFileSync(pngPath));
  assert.equal(png.width, 256);
  assert.equal(png.height, 64);

  const hashes = new Set();
  for (let c = 0; c < 4; c++) {
    const cell = Buffer.alloc(64 * 64 * 4);
    let opaque = 0;
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 64; x++) {
        const sp = (y * 256 + (c * 64 + x)) * 4;
        const a = png.data[sp + 3];
        assert.ok(a === 0 || a === 255, 'sprite sheet must have crisp binary alpha');
        if (a === 255) opaque++;
        png.data.copy(cell, (y * 64 + x) * 4, sp, sp + 4);
      }
    }
    assert.ok(opaque > 400 && opaque < 3200, `frame ${c} must have non-empty foreground with transparent margins`);
    hashes.add(crypto.createHash('sha256').update(cell).digest('hex'));
  }
  assert.equal(hashes.size, 4, 'all 4 frames of glass_shard_states.png must be distinct visual states');

  assert.equal(glassShardFrame(0, false), 0);
  assert.equal(glassShardFrame(0.45, false), 1);
  assert.equal(glassShardFrame(0.85, false), 2);
  assert.equal(glassShardFrame(1.25, false), 3);
  assert.equal(glassShardFrame(1.25, true), 0, 'reduced motion must lock glass shard to frame 0');

  const drawn = [];
  const mockCtx = {
    save() {},
    restore() {},
    translate() {},
    beginPath() {},
    ellipse() {},
    fill() {},
    arc() {},
    drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh) {
      drawn.push({sx, sy, sw, sh, dx, dy, dw, dh});
    }
  };
  drawGlassKeepsakeProp(mockCtx, 480, 1120, 0.85, false, {naturalWidth: 256, naturalHeight: 64});
  assert.equal(drawn.length, 1);
  assert.deepEqual(drawn[0], {sx: 128, sy: 0, sw: 64, sh: 64, dx: -32, dy: -40, dw: 64, dh: 64});

  const routes = fs.readFileSync(new URL('../android/src/jaguarZcreatorZ13/app/AssetRoutes.java', import.meta.url), 'utf8');
  assert.ok(routes.includes('glass_shard_states'), 'AssetRoutes.java must allowlist glass_shard_states.png');
  const css = fs.readFileSync(new URL('../game/style.css', import.meta.url), 'utf8');
  assert.ok(css.includes("url('art/v09/glass_shard_states.png')") && css.includes('steps(4,end)'), '#opening-shard must animate the 4-frame sprite sheet');
});
