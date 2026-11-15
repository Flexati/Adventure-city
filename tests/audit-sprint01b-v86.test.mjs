import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MUSIC_GAIN, AudioDirector } from '../game/audio-engine.mjs';
import { STORY, BARKS } from '../game/story-v08.mjs';
import { newRun, tick, interactNode } from '../game/campaign.mjs';
import { buildMission } from '../game/missions.mjs';

test('Sprint Arte 01b (v02) and V8.6 Play Store graphic/audio assets exist and satisfy audit thresholds', () => {
  const manifest = JSON.parse(fs.readFileSync('deliveries/argon-sprint-arte-01-20261114/MANIFEST_SPRINT_01B.json', 'utf8'));
  assert.ok(manifest.metrics.nox_contrast_ratio >= 3, 'Nox contrast >= 3:1');
  assert.ok(manifest.metrics.lulu_contrast_ratio >= 3, 'Lulù contrast >= 3:1');
  assert.ok(manifest.metrics.yard_floor_minus_obstacle_delta >= 25, 'Yard floor brightness delta >= +25');
  assert.ok(manifest.metrics.yard_walkable_area_percent >= 45, 'Yard walkable area >= 45%');

  const sprint01Files = [
    'nox_sheet_base_v02.png',
    'lulu_sheet_base_v02.png',
    'prova_silhouette_nox_lulu_v02.png',
    'vfx_due_colpi_v02.png',
    'vfx_due_colpi_marca_v02.png',
    'vfx_due_colpi_chiusura_v02.png',
    'vfx_due_colpi_rimbalzo_v02.png',
    'vfx_due_colpi_scudo_spezzato_v02.png',
    'bg_cantiere_apertura_v02.webp',
    'bg_cantiere_apertura_calpestabile_v02.png',
    'boss_the_anchor_v02.png',
    'boss_the_anchor_cavi_v02.png',
    'hud_vertical_slice_v02.png',
    'hub_moon_bg_v01.webp'
  ];
  for (const f of sprint01Files) {
    assert.ok(fs.existsSync(`deliveries/argon-sprint-arte-01-20261114/${f}`), `delivery ${f}`);
    assert.ok(fs.existsSync(`game/art/sprint01/${f}`), `runtime ${f}`);
  }

  const v86Art = [
    'collezione_nox_v86.png',
    'iron_orchard_root_engine_v86.png',
    'elena_lia_eve_v86.png',
    'npc_conseguenze_v86.png',
    'distretti_v86_mechanics.png',
    'nemici_v86_telegraph.png',
    'citta_esterne_v86.png'
  ];
  for (const f of v86Art) {
    assert.ok(fs.existsSync(`game/art/v86/${f}`), `v86 art ${f}`);
  }

  const v86Audio = [
    'nox_keepsake_chime.ogg',
    'iron_orchard_pulse.ogg',
    'lia_memory_tape.ogg',
    'eve_adapt_lock.ogg',
    'unit9_halt_chime.ogg',
    'bell_thirteen_anomaly.ogg',
    'the_ram_convoy_horn.ogg',
    'enemy_telegraph_v86.ogg',
    'distant_cities_motif.ogg'
  ];
  for (const f of v86Audio) {
    const p = `game/audio/v86/${f}`;
    assert.ok(fs.existsSync(p), `v86 audio ${f}`);
    assert.ok(fs.statSync(p).size > 2000, `v86 audio non-empty ${f}`);
  }

  const artboards = fs.readdirSync('assets/chrono_shadows/artboards').filter(f => f.endsWith('.webp'));
  assert.equal(artboards.length, 18, '18/18 artboards present in assets/chrono_shadows/artboards/');
});

test('Audit A1, A2, A4: MUSIC_GAIN normalizes tracks to -16 LUFS and Boss Music takes precedence over allies', () => {
  assert.ok(MUSIC_GAIN['v10/title_theme.ogg'] < 0.7, 'loud title_theme attenuated');
  assert.ok(MUSIC_GAIN['v10/archon_finale.ogg'] < 0.7, 'loud archon_finale attenuated');
  assert.ok(MUSIC_GAIN['v09/vega_duel.ogg'] > 1.2, 'quiet vega_duel boosted');
  const rt = fs.readFileSync('game/runtime.mjs', 'utf8');
  const bossIdx = rt.indexOf('activeBoss&&BOSS_MUSIC[activeBoss.bossKind]');
  const allyIdx = rt.indexOf("state.allies?'strangers_rift'");
  assert.ok(bossIdx > 0 && allyIdx > bossIdx, 'activeBoss music takes priority over allies');
});

test('Audit N1, N2, N3, N4: Rook, The Anchor and Custode have >= 3 lines and >= 20 words, and Ora zero triggers duoBroken', () => {
  const countWords = lines => lines.join(' ').trim().split(/\s+/).length;
  const rookLines = [BARKS.blackout.bossWake.text, BARKS.blackout.phase1.text, STORY.blackout_end[0].text];
  const anchorLines = [BARKS.breach.bossWake.text, BARKS.breach.phase1.text, STORY.breach_promise[0].text];
  const custodeLines = [BARKS.zero.bossWake.text, BARKS.zero.bossWakeb.text, STORY.separation[0].text];

  assert.equal(rookLines.length, 3);
  assert.ok(countWords(rookLines) >= 20, 'Rook >= 20 words');
  assert.equal(anchorLines.length, 3);
  assert.ok(countWords(anchorLines) >= 20, 'The Anchor >= 20 words');
  assert.equal(custodeLines.length, 3);
  assert.ok(countWords(custodeLines) >= 20, 'Custode >= 20 words');

  const c = buildMission('zero', {});
  const s = newRun('nox', 3, 'power', null, null, c);
  for (const e of s.enemies) if (!e.boss) e.hp = 0;
  s.x = s.nodes[0].x; s.y = s.nodes[0].y; interactNode(s);
  for (const e of s.enemies) if (!e.boss) e.hp = 0;
  s.x = s.nodes[1].x; s.y = s.nodes[1].y; interactNode(s);
  assert.ok(s.duoDesync > 0, 'duoDesync active after 2nd node in Ora zero');
  assert.ok(s.events.some(e => e.type === 'duoBroken'), 'duoBroken emitted at 2nd node in Ora zero');
  s.duo = 100;
  tick(s, { duo: true }, 0.05);
  assert.equal(s.duoBrokenOnce, true, 'pressing duo during duoDesync triggers tactile misfire once');
});
