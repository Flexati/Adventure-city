import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {FOOT} from '../game/missions.mjs';

const css=fs.readFileSync(new URL('../game/style.css',import.meta.url),'utf8');
const rt=fs.readFileSync(new URL('../game/runtime.mjs',import.meta.url),'utf8');
const routes=fs.readFileSync(new URL('../android/src/jaguarZcreatorZ13/app/AssetRoutes.java',import.meta.url),'utf8');

test('R57 A1-A3: store feature graphic, dedicated 9:16 teaser art, and 1200x540 unlock hero banner exist and are wired',()=>{
 assert.ok(fs.statSync('assets/source/store/store_feature_1024x500_notitle.png').size>100000);
 assert.ok(fs.statSync('game/art/atti/teaser_breccia_9x16.webp').size>50000);
 assert.ok(fs.statSync('game/art/atti/unlock_hero_1200x540.webp').size>20000);
 assert.match(css,/#teaser-art\{[^}]*url\(art\/atti\/teaser_breccia_9x16\.webp\)/);
 assert.doesNotMatch(css,/#teaser-art\{[^}]*atto_2\.webp/);
 assert.match(css,/\.store-hero\{[^}]*url\(art\/atti\/unlock_hero_1200x540\.webp\)/);
 assert.doesNotMatch(css,/\.store-hero\{[^}]*atto_2\.webp/);
 assert.ok(routes.includes('teaser_breccia_9x16|unlock_hero_1200x540'));
});

test('R57 A4: all 18 512x512 dialogue portraits exist and are wired in CSS and PORTRAIT_ALIAS/portraitClass',()=>{
 const portraits=[
  'portrait_nox_neutral.png','portrait_nox_tense.png','portrait_nox_warm.png',
  'portrait_lulu_neutral.png','portrait_lulu_tense.png','portrait_lulu_warm.png',
  'portrait_veyra.png','portrait_veyra_tense.png','portrait_veyra_warm.png',
  'portrait_kairn.png','portrait_morrow.png',
  'portrait_rook_neutral.png','portrait_eve_neutral.png','portrait_vega_neutral.png',
  'portrait_mira_neutral.png','portrait_tessa_neutral.png','portrait_dario_neutral.png','portrait_ines_neutral.png'
 ];
 for(const file of portraits){
  assert.ok(fs.statSync('game/art/v10/'+file).size>50000,file);
  assert.ok(css.includes('art/v10/'+file),'style.css references '+file);
 }
 assert.match(rt,/'TESSA':'ptessa'/);
 assert.match(rt,/function portraitMood\(cls\)/);
});

test('R57 A5: road parallax layers exist, load only on Act II/III drives, respect reduced motion, and draw under hazards and the car',()=>{
 for(const file of ['road_layer_mid_a2.png','road_layer_near_a2.png','road_layer_mid_a3.png']){
  assert.ok(fs.statSync('game/art/v10/'+file).size>50000,file);
 }
 const coreLine=rt.slice(rt.indexOf('const CORE_ART='),rt.indexOf('const imageReady='));
 assert.doesNotMatch(coreLine,/road_layer_/,'A5 layers must not be in CORE_ART');
 assert.match(rt,/const roadLayers=step\.act===2\?\['road_layer_mid_a2','road_layer_near_a2'\]:step\.act===3\?\['road_layer_mid_a3'\]:\[\];/);
 const draw=rt.slice(rt.indexOf('function drawDriving('),rt.indexOf('function drawScene('));
 const layerPos=draw.indexOf("if(!settings.reduced&&(d.act===2||d.act===3))");
 const strikesPos=draw.indexOf('for(const k of d.strikes)');
 const hazardsPos=draw.indexOf('for(const hazard of d.hazards)');
 const stopsPos=draw.indexOf('for(const stop of d.stops)');
 assert.ok(layerPos>0&&layerPos<strikesPos&&layerPos<hazardsPos&&layerPos<stopsPos,'road parallax draws underneath strikes, hazards, stops, and car');
 assert.match(draw,/\.6\*d\.distance/);
 assert.match(draw,/1\.4\*d\.distance/);
});

test('R57 A6-A9: 16:9 and 9:16 act cards, stronger Act III scrim, A8 UI kit, and A9 rim-lit hero sheets exist and are wired',()=>{
 for(const n of [1,2,3,4]){
  assert.ok(fs.statSync(`game/art/atti/atto_${n}.webp`).size>30000);
  assert.ok(fs.statSync(`game/art/atti/atto_${n}_9x16.webp`).size>30000);
  assert.ok(css.includes(`url(art/atti/atto_${n}_9x16.webp)`),`portrait rule for atto_${n}_9x16.webp`);
 }
 assert.equal(fs.statSync('game/art/atti/atto_1.webp').size,143892,'clean Act I 16:9 plate without corner mark');
 assert.match(css,/#card\.a3\{background:radial-gradient\(circle at 50% 48%,#04070cf5 0,#04070cde 52%,#04070c99 100%\)/);
 for(const ui of ['frame_menu.webp','button_primary.png','button_secondary.png','healthbar_shell.png','icon_shoot.png','icon_dodge.png','icon_pulse.png','icon_duo.png','icon_heal.png','icon_bag.png']){
  assert.ok(fs.statSync('game/art/ui/'+ui).size>1000,ui);
  assert.ok(css.includes('art/ui/'+ui),'style.css wires '+ui);
 }
 for(const sheet of ['nox_walk.png','nox_gun.png','nox_actions.png','nox_magic.png','lulu_walk.png','lulu_gun.png','lulu_actions.png','lulu_magic.png']){
  assert.ok(fs.statSync('game/art/v05/'+sheet).size>200000,sheet);
 }
});

test('R57 Audio: per-stage and per-hub ambience overrides, escape drive loop, exp_chalk_marks port ambience, collapse reset, and Act I one-shots',()=>{
 const audioFiles=[
  'act1_blackout_cantiere.ogg','act1_docks_veyra.ogg','act1_moon_refuge.ogg','act1_escape_drive.ogg',
  'act2_clinic_contagion.ogg','act2_port_antenne.ogg','act2_cathedral_quarter.ogg',
  'act3_forge.ogg','act3_toxic_bazaar.ogg','act3_eve_archive.ogg','act3_vega_sky_rail.ogg',
  'act4_axis_wind.ogg',
  'act1_thunder_distant.ogg','act1_relay_spark.ogg','act1_crane_groan.ogg'
 ];
 for(const f of audioFiles){
  assert.ok(fs.statSync('game/audio/chrono/'+f).size>10000,f);
 }
 assert.equal(FOOT.exp_chalk_marks.ambience,undefined,'FOOT.exp_chalk_marks must not hardcode legacy silent ambience:"port"');
 assert.match(rt,/docks_veyra:'act1_docks_veyra'/);
 assert.match(rt,/exp_chalk_marks:'act2_port_antenne'/);
 assert.match(rt,/bone_tyrant:'act2_cathedral_quarter'/);
 assert.match(rt,/forge_behemoth:'act3_forge'/);
 assert.match(rt,/archive:'act3_eve_archive'/);
 assert.match(rt,/vega:'act3_vega_sky_rail'/);
 assert.match(rt,/app_axis:'act4_axis_wind',ascent:'act4_axis_wind',finale:'act4_axis_wind'/);
 assert.match(rt,/if\(step\.id==='escape'\)await audioDirector\.preloadChrono\(0,\[\],'act1_escape_drive'\)/);
 assert.match(rt,/audioDirector\.setAmbience\(step\.id==='escape'\?'chrono_act1_escape_drive':'drive'\)/);
 assert.match(rt,/async function startCollapse\(\)\{\n running=false;paused=false;uiLock=0;hideGameplay\(\);audioDirector\.setAmbience\(null\);/);
 assert.match(rt,/audioDirector\.chronoSfx\('act1_relay_spark'\)/);
 assert.match(rt,/audioDirector\.chronoSfx\('act1_thunder_distant'\)/);
 assert.match(rt,/audioDirector\.chronoSfx\('act1_crane_groan'\)/);
});
