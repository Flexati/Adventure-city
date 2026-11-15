import test from 'node:test';import assert from 'node:assert/strict';
import {stepEstimate,MODELS} from '../tools/estimate_playtime.mjs';
const t=(o={})=>({action:{foot:60000,drive:0,escape:0,openingWalk:0,hold:0},passive_ms:2000,ui_bot_ms:99999,talk_lines:2,talk_words:18,cards:1,card_words:0,choices:0,choice_words:0,results:0,result_words:0,retries:0,city_panels:0,city_words:0,...o});
test('playtime model: factors, reading and boss share as declared; bot dialogue time never counted',()=>{
 const e=stepEstimate(t(),MODELS.probable,'below');
 assert.equal(e.combat_s,96);assert.equal(e.boss_extra_s,0);assert.ok(Math.abs(e.reading_s-(18/180*60+3*1.2))<1e-9);
 assert.ok(Math.abs(e.total_s-(96+e.reading_s+2))<1e-9,'ui_bot_ms excluded');
 assert.equal(stepEstimate(t(),MODELS.probable,'finale').boss_extra_s,96*.25);
 assert.ok(stepEstimate(t(),MODELS.min,'x').total_s<e.total_s&&e.total_s<stepEstimate(t(),MODELS.high,'x').total_s);
});
