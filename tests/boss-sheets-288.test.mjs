// The four Part I bosses used to hold one frame per state. The sheets at 288 px are derived from those poses
// (tools/derive_boss_frames_288.py). The 128 px strips stay byte-for-byte: they are the reference, D28.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {chronoAnimation} from '../game/chrono-art.mjs';
const {PNG} = createRequire(import.meta.url)('pngjs');
const BOSSES = ['cathedral_bone_tyrant', 'toxic_forge_behemoth', 'shadow_reaper', 'vega'];
const STATES = ['idle', 'anticipation', 'attack', 'phase_transition', 'stagger', 'core_exposed', 'final_hit', 'collapse', 'reward_portal'];

function opaqueHeight(im, r) {
  let top = r.height, bot = -1;
  for (let y = 0; y < r.height; y++) for (let x = 0; x < r.width; x++) if (im.data[((r.y + y) * im.width + r.x + x) * 4 + 3]) {
    if (y < top) top = y;
    if (y > bot) bot = y;
  }
  return bot - top + 1;
}

test('Tiranno, Behemoth, Reaper and Vega each play four different frames per state, at the pipeline cell', () => {
  const manifest = JSON.parse(fs.readFileSync('game/art/chrono/manifest.json', 'utf8'));
  const report = JSON.parse(fs.readFileSync('docs/evidence/r40/boss-frames.json', 'utf8'));
  const rt = fs.readFileSync('game/runtime.mjs', 'utf8');
  assert.match(rt, /name='anticipation';elapsed=a\.clock/);
  assert.match(rt, /name='reward_portal';elapsed=state\.time/);
  for (const id of BOSSES) {
    const atlas = manifest.atlases[id];
    assert.equal(atlas.path, `art/chrono/${id}_288.png`);
    assert.equal(atlas.width, 1920);
    assert.equal(atlas.height, 1920);
    assert.ok(atlas.width <= 2048 && atlas.height <= 2048);
    const im = PNG.sync.read(fs.readFileSync('game/' + atlas.path));
    const src = fs.readFileSync('game/' + report.bosses[id].source);
    assert.equal(createHash('sha256').update(src).digest('hex'), report.bosses[id].source_sha256, id + ' reference strip was rewritten');
    for (const name of STATES) {
      const a = chronoAnimation(id, name);
      assert.equal(a.frame_count, 4, id + ' ' + name);
      assert.equal(a.sprite_width, 320);
      assert.equal(a.pivot_y, 308);
      const hashes = a.frame_rectangles.map(r => {
        const h = createHash('sha256');
        for (let y = 0; y < r.height; y++) h.update(im.data.subarray(((r.y + y) * im.width + r.x) * 4, ((r.y + y) * im.width + r.x + r.width) * 4));
        return h.digest('hex');
      });
      assert.equal(new Set(hashes).size, 4, id + ' ' + name + ' repeats a frame');
      for (const r of a.frame_rectangles) for (let x = 0; x < r.width; x++) assert.equal(im.data[(r.y * im.width + r.x + x) * 4 + 3], 0, id + ' gutter');
    }
    const h = opaqueHeight(im, chronoAnimation(id, 'idle').frame_rectangles[0]);
    if (id === 'toxic_forge_behemoth') assert.ok(h >= 250 && h < 288, 'Behemoth is wider than a 320 px cell at 288 px tall, so the pose stays whole at ' + h);
    else assert.ok(Math.abs(h - 288) <= 2, id + ' idle height ' + h);
  }
});
