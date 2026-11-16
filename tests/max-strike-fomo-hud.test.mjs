import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { computeTacticalHudState, drawComboStreakHud } from '../game/village-art.mjs';
import { RUNTIME_EN_TEXT } from '../game/runtime-en.mjs';

const REQUIRED_DELIVERABLES = [
  'CHRONOS_MAX_STRIKE_MASTER_AUDIT.md',
  'CHRONOS_WORLD_CLASS_ENGINEERING_RESEARCH.md',
  'CHRONOS_COMPLETE_GAMEPLAY_AUDIT.md',
  'CHRONOS_NARRATIVE_PREMIUM_REDESIGN.md',
  'CHRONOS_PREMIUM_GAMEPLAY_IMPLEMENTATION.md',
  'CHRONOS_MULTI_AGENT_REVIEW_LOG.md',
  'CHRONOS_RECURSIVE_CODE_REVIEW.md',
  'CHRONOS_PERFORMANCE_BENCHMARKS.md',
  'CHRONOS_FINAL_REGRESSION_REPORT.md',
  'CHRONOS_COMMERCIAL_RELEASE_READINESS.md',
];

test('MAX STRIKE — computeTacticalHudState returns null when not in playing state', () => {
  assert.equal(computeTacticalHudState(null), null);
  assert.equal(computeTacticalHudState({ status: 'menu', x: 100, y: 100 }), null);
});

test('MAX STRIKE — computeTacticalHudState computes combo tiers accurately', () => {
  const baseState = {
    status: 'playing',
    x: 100,
    y: 100,
    chests: [],
    enemies: [],
    combo: 1,
    comboTimer: 2.5,
  };
  assert.equal(computeTacticalHudState(baseState).combo, null);

  const streak3 = computeTacticalHudState({ ...baseState, combo: 3 });
  assert.equal(streak3.combo.count, 3);
  assert.equal(streak3.combo.tier, 'streak');

  const streak5 = computeTacticalHudState({ ...baseState, combo: 5 });
  assert.equal(streak5.combo.count, 5);
  assert.equal(streak5.combo.tier, 'fury');

  const streak10 = computeTacticalHudState({ ...baseState, combo: 10 });
  assert.equal(streak10.combo.count, 10);
  assert.equal(streak10.combo.tier, 'unstoppable');
});

test('MAX STRIKE — computeTacticalHudState detects nearby unopened secret chests and ignores opened or distant chests', () => {
  const nearState = {
    status: 'playing',
    x: 200,
    y: 200,
    chests: [
      { x: 350, y: 200, open: false, kind: 'relic' },
      { x: 900, y: 200, open: false },
    ],
    enemies: [],
  };
  const nearHud = computeTacticalHudState(nearState);
  assert.ok(nearHud.secretRadar, 'Expected secretRadar for chest at 150px');
  assert.equal(nearHud.secretRadar.dist, 150);
  assert.equal(nearHud.secretRadar.near, true);
  assert.equal(nearHud.secretRadar.kind, 'relic');

  const detectedState = {
    status: 'playing',
    x: 500,
    y: 200,
    chests: [{ x: 180, y: 200, open: false }],
    enemies: [],
  };
  const detectedHud = computeTacticalHudState(detectedState);
  assert.ok(detectedHud.secretRadar, 'Expected secretRadar for chest at 320px');
  assert.equal(detectedHud.secretRadar.dist, 320);
  assert.equal(detectedHud.secretRadar.near, false);

  const openedOrFarState = {
    status: 'playing',
    x: 200,
    y: 200,
    chests: [
      { x: 260, y: 200, open: true },
      { x: 800, y: 200, open: false },
    ],
    enemies: [],
  };
  const emptyHud = computeTacticalHudState(openedOrFarState);
  assert.equal(emptyHud.secretRadar, null);
});

test('MAX STRIKE — computeTacticalHudState triggers bossAlert when active boss exposes weak point', () => {
  const stateNoWeak = {
    status: 'playing',
    x: 100,
    y: 100,
    chests: [],
    enemies: [{ boss: true, hp: 100, weakExposed: 0, phase: 0 }],
  };
  assert.equal(computeTacticalHudState(stateNoWeak).bossAlert, null);

  const stateWeakExposed = {
    status: 'playing',
    x: 100,
    y: 100,
    chests: [],
    enemies: [{ boss: true, bossKind: 'anchor', hp: 100, weakExposed: 45, phase: 1 }],
  };
  const hud = computeTacticalHudState(stateWeakExposed);
  assert.ok(hud.bossAlert, 'Expected bossAlert object');
  assert.equal(hud.bossAlert.weak, true);
  assert.equal(hud.bossAlert.kind, 'anchor');
});

test('MAX STRIKE — drawComboStreakHud renders tactical HUD elements without error and RUNTIME_EN_TEXT translates them', () => {
  assert.equal(RUNTIME_EN_TEXT['✦ FORZIERE VICINO'], '✦ CHEST NEARBY');
  assert.equal(RUNTIME_EN_TEXT['◈ SEGRETO RILEVATO'], '◈ SECRET DETECTED');
  assert.equal(RUNTIME_EN_TEXT['PUNTO DEBOLE ESPOSTO'], 'WEAK POINT EXPOSED');

  const drawnTexts = [];
  const mockCtx = {
    canvas: { height: 800 },
    save() {},
    restore() {},
    translate() {},
    rotate() {},
    scale() {},
    beginPath() {},
    roundRect() {},
    moveTo() {},
    lineTo() {},
    closePath() {},
    fill() {},
    stroke() {},
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    globalAlpha: 1,
    font: '',
    textAlign: 'left',
    fillRect() {},
    strokeRect() {},
    fillText(txt) {
      drawnTexts.push(txt);
    },
  };
  const activeState = {
    status: 'playing',
    x: 200,
    y: 200,
    combo: 5,
    comboTimer: 3.0,
    chests: [{ x: 320, y: 200, open: false }],
    enemies: [{ boss: true, hp: 120, weakExposed: 30, phase: 1 }],
  };
  drawComboStreakHud(mockCtx, activeState, 960, 12, false, (t) => RUNTIME_EN_TEXT[t] || t);
  assert.ok(drawnTexts.some((t) => t.includes('×5')), 'Should draw combo count ×5');
  // MS-2 review: the weak-point callout no longer lives on the canvas (it ended under the boss bar's own numbers and behind the
  // dialogue bubble); the boss bar says it instead. See the tests below.
  assert.ok(!drawnTexts.some((t) => t.includes('WEAK POINT')), 'The canvas must not draw the weak-point callout any more');
  // …and the secret radar rests while a boss is awake (the boss bar sits where it would go).
  assert.ok(!drawnTexts.some((t) => t.includes('CHEST NEARBY')), 'No radar during a boss fight');
  const calm = [];
  drawComboStreakHud({ ...mockCtx, fillText(t) { calm.push(t); } }, { ...activeState, enemies: [] }, 960, 12, false, (t) => RUNTIME_EN_TEXT[t] || t);
  assert.ok(calm.some((t) => t.includes('CHEST NEARBY')), 'Should draw translated chest radar when no boss is awake');
});

test('MS-2 review — the radar follows the nearest closed chest, not the first of the list', () => {
  // Measured in the real mission «below»: the hero starts 209 px from the second chest while the first is 987 px away.
  const hud = computeTacticalHudState({ status: 'playing', x: 310, y: 981, chests: [{ x: 310, y: 340, open: false }, { x: 310, y: 1190, open: false, kind: 'relic' }], enemies: [] });
  assert.ok(hud.secretRadar, 'a chest 209 px away must be on the radar');
  assert.equal(hud.secretRadar.dist, 209);
  assert.equal(hud.secretRadar.near, true);
  assert.equal(hud.secretRadar.kind, 'relic');
  assert.ok(Math.abs(hud.secretRadar.angle - Math.PI / 2) < 1e-9, 'the arrow points down, to the near chest');
  // an opened near chest is skipped in favour of the next nearest closed one
  const next = computeTacticalHudState({ status: 'playing', x: 0, y: 0, chests: [{ x: 50, y: 0, open: true }, { x: 400, y: 0, open: false }, { x: 300, y: 0, open: false }], enemies: [] });
  assert.equal(next.secretRadar.dist, 300);
});

test('MS-2 review — the canvas HUD keeps clear of the DOM HUD: logical height, and it moves down with a notch or a tall objective', () => {
  const calls = [];
  const ctx = (canvas) => ({ canvas, save() {}, restore() {}, translate(x, y) { calls.push([x, y]); }, rotate() {}, scale() {}, beginPath() {}, roundRect() {}, moveTo() {}, lineTo() {}, closePath() {}, fill() {}, stroke() {}, fillRect() {}, fillText() {}, fillStyle: '', strokeStyle: '', lineWidth: 1, globalAlpha: 1, font: '', textAlign: 'left' });
  const st = { status: 'playing', x: 0, y: 0, chests: [{ x: 100, y: 0, open: false }], enemies: [] };
  const radarY = (canvas, w, top) => { calls.length = 0; drawComboStreakHud(ctx(canvas), st, w, 0, true, (t) => t, top); return calls[0][1]; };
  // A phone held sideways at pixel ratio 2: 844x390 CSS pixels are 1688x780 canvas pixels. It must be laid out as landscape.
  assert.equal(radarY({ width: 1688, height: 780 }, 844, 74), 116);
  assert.equal(radarY({ width: 780, height: 1688 }, 390, 91), 138);
  // A 40 px notch pushes the DOM HUD 40 px down; the radar follows.
  assert.equal(radarY({ width: 780, height: 1688 }, 390, 131), 178);
  // No measure yet (0): the base position.
  assert.equal(radarY({ width: 780, height: 1688 }, 390, 0), 138);
});

test('MS-2 review — the weak point is announced on the boss bar, in words and with a shape, in both languages', () => {
  const rt = fs.readFileSync(path.resolve(process.cwd(), 'game/runtime.mjs'), 'utf8');
  const css = fs.readFileSync(path.resolve(process.cwd(), 'game/style.css'), 'utf8');
  assert.match(rt, /const wk=boss\.weakExposed>0;\$\('bossbar'\)\.classList\.toggle\('weak',wk\);setText\('boss-name',wk\?'◆ PUNTO DEBOLE ESPOSTO ◆':bossName\);/);
  assert.match(rt, /drawComboStreakHud\(ctx,s,w,s\.time,settings\.reduced,tr,frameInsets\.top\);/);
  assert.equal(RUNTIME_EN_TEXT['◆ PUNTO DEBOLE ESPOSTO ◆'], '◆ WEAK POINT EXPOSED ◆');
  assert.match(css, /#bossbar\.weak span\{color:#ffe596;font-size:12px/);
  assert.match(css, /#bossbar\.weak \.vital-track\{border-color:#ffd48a/);
});

test('MAX STRIKE — All 10 deliverables exist in root and docs/gold with substantive content and zero leaked tokens', () => {
  for (const fileName of REQUIRED_DELIVERABLES) {
    const rootPath = path.resolve(process.cwd(), fileName);
    const docsPath = path.resolve(process.cwd(), 'docs', 'gold', fileName);
    assert.ok(fs.existsSync(rootPath), `Missing root deliverable: ${fileName}`);
    assert.ok(fs.existsSync(docsPath), `Missing docs/gold deliverable: ${fileName}`);
    const content = fs.readFileSync(rootPath, 'utf8');
    assert.ok(content.length > 1500, `Deliverable ${fileName} is too short (${content.length} chars)`);
    assert.ok(!content.includes('ghp_'), `Deliverable ${fileName} must never contain a GitHub token`);
  }
});
