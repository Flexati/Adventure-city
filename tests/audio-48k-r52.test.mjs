// R52 (D93): the 91 sounds and pieces that were still at 32 or 44.1 kHz are at 48 kHz now, same name and format, and the
// volumes did not move. The rate of every file in game/audio is also checked in r51-play-release.test.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync, spawnSync} from 'node:child_process';

const report = JSON.parse(fs.readFileSync('docs/evidence/r52/audio_48k.json', 'utf8'));

test('the report lists the 91 converted files, none failed, each with the hash of the shipped file', () => {
 assert.equal(report.converted.length, 91);
 assert.deepEqual(report.failed, []);
 const rates = new Set(report.converted.map(r => r.rate_before));
 assert.deepEqual([...rates].sort(), [32000, 44100]);
 for (const r of report.converted) {
  assert.equal(r.rate_after, 48000, r.file);
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(r.file)).digest('hex'), r.sha256, r.file + ' differs from the report');
 }
});

test('volumes did not move: RMS within 0.3 dB, loudness within 0.3 dB on pieces of 3 s or more, peak within 1.5 dB', () => {
 for (const r of report.converted) {
  const long = r.seconds_before >= 3;
  if (long && r.lufs_before != null && r.lufs_after != null) assert.ok(Math.abs(r.lufs_after - r.lufs_before) <= 0.3, r.file + ' loudness');
  assert.ok(Math.abs(r.peak_after_db - r.peak_before_db) <= 1.5, r.file + ' peak');
 }
});

test('every converted file keeps its format (Ogg Vorbis) and channel count on disk', () => {
 for (const r of report.converted) {
  const out = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-of', 'json', r.file], {encoding: 'utf8'}));
  assert.equal(out.streams[0].codec_name, 'vorbis', r.file);
  assert.equal(out.streams[0].channels, r.channels, r.file);
  assert.equal(+out.streams[0].sample_rate, 48000, r.file);
 }
});

test("the jaguar's roar stays at about -16 LUFS", () => {
 const out = spawnSync('ffmpeg', ['-nostats', '-i', 'game/audio/v10/jaguar_roar.ogg', '-af', 'ebur128', '-f', 'null', '-'], {encoding: 'utf8'}).stderr;
 const lufs = +[...out.matchAll(/I:\s+(-?[\d.]+) LUFS/g)].pop()[1];
 assert.ok(Math.abs(lufs + 16) <= 0.5, 'roar loudness ' + lufs);
 assert.match(fs.readFileSync('tools/synth_jaguar_roar_r30.py', 'utf8'), /'-ar', '48000', '-c:a', 'libvorbis'/, 'the synth script encodes at 48 kHz');
});
