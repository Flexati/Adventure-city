import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {BOSS_NAMES} from '../game/visuals.mjs';import {FOOT} from '../game/missions.mjs';import {HUBS} from '../game/hubs.mjs';import {WEAPONS_V9} from '../game/weapons-v9.mjs';import {translateText} from '../game/locale.mjs';
// Rule 3 on the paywall: what the unlock screen promises for 5,99 € is counted from the game itself, and every line reads in English too.
const card=fs.readFileSync('game/index.html','utf8').match(/<section id="unlock".*?<\/section>/s)[0];
const count=label=>Number(card.match(new RegExp('<b>(\\d+) '+label+'</b>'))?.[1]);

test('unlock screen: every number and name it promises exists in the game',()=>{
 assert.equal(count('Boss'),Object.keys(BOSS_NAMES).length,'bosses in visuals.mjs BOSS_NAMES');
 assert.equal(count('Regioni'),new Set(Object.values(FOOT).map(m=>m.district)).size,'districts of the on-foot missions');
 assert.match(card,new RegExp('Più '+Object.keys(HUBS).length+' villaggi'),'villages in hubs.mjs');
 for(const id of ['h17','arc7'])assert.ok(card.includes(WEAPONS_V9[id].name),WEAPONS_V9[id].name);
 assert.match(card,/<p id="unlock-price">5,99 €<\/p>/,'D18 price as the fallback label');
});

test('unlock screen: every visible line has an English translation',()=>{
 const lines=[...card.matchAll(/>([^<>]+)</g)].map(m=>m[1].trim()).filter(t=>t&&t!=='5,99 €');
 assert.ok(lines.length>=10,lines.length+' lines');
 for(const line of lines)assert.notEqual(translateText(line,'en'),line,'untranslated: '+line);
});
