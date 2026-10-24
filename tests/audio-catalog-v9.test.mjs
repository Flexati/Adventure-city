import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {audioCoverageV9} from '../tools/audio_coverage_v9.mjs';
const catalog=JSON.parse(fs.readFileSync('docs/production/v9/audio-catalog.json'));
const source=fs.readFileSync(catalog.source,'utf8');
test('the full audio chat remains required beyond the initial twenty-item lot',()=>{
 const result=audioCoverageV9(catalog,source,new Map());
 assert.deepEqual(result.errors,[]);assert.equal(result.required,129);assert.equal(result.accepted,0);
 assert.ok(result.missing.includes('audio_128'));
 const partial=structuredClone(catalog);partial.entries=partial.entries.slice(0,20);
 assert.ok(audioCoverageV9(partial,source,new Map()).errors.length>0);
 assert.ok(audioCoverageV9(catalog,source.replace('MAIN TITLE','ALTERED TITLE'),new Map()).errors.length>0);
});
test('generated previews and decode tests cannot close music or final mix requirements',()=>{
 const copy=structuredClone(catalog),entry=copy.entries[128];
 entry.status='ACCEPTED';entry.integration='preview';entry.artifacts=['mix-proof'];entry.evidence=['runtime','technical'];
 const proof=new Map([['runtime',{result:'PASS',category:'runtime'}],['technical',{result:'PASS',category:'technical'}],['human',{result:'PASS',category:'human'}]]);
 assert.equal(audioCoverageV9(copy,source,proof).accepted,0);
 entry.integration='campaign';assert.equal(audioCoverageV9(copy,source,proof).accepted,0);
 entry.evidence.push('human');assert.equal(audioCoverageV9(copy,source,proof).accepted,1);
 proof.get('human').result='FAIL';assert.equal(audioCoverageV9(copy,source,proof).accepted,0);
});
