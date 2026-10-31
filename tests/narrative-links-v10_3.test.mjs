import test from 'node:test';
import assert from 'node:assert/strict';
import {STORY,BARKS,resolveLines,veyraEpilogue} from '../game/story-v08.mjs';
import {EN_TEXT} from '../game/locale.mjs';

test('reunion echoes follow the separation flags',()=>{
 const t=f=>resolveLines(STORY.reunion_open,f).map(l=>l.text);
 assert.ok(!t({}).includes('I due punti sulle botole. Eri tu.'));
 assert.ok(t({'exp.chalk.completed':true}).includes('I due punti sulle botole. Eri tu.'));
 assert.ok(!t({}).some(x=>x.startsWith('Unità 9')));
 assert.ok(t({unit9_saved:true}).some(x=>x.startsWith('Unità 9')));
 assert.equal(t({}).at(-1),'Posso venire con te?');
});

test('boss entrance lines exist for Rook, The Anchor and the Custode',()=>{
 assert.equal(BARKS.blackout.bossWake.speaker,'ROOK');
 assert.equal(BARKS.breach.bossWake.speaker,'THE ANCHOR');
 assert.equal(BARKS.zero.bossWake.speaker,'CUSTODE');
 assert.match(BARKS.zero.bossWakeb.text,/EVE-47/);
});

test('Veyra epilogue reads only observed race results',()=>{
 const lines=[veyraEpilogue(null),veyraEpilogue({events:{a:{completed:true,won:true}}}),veyraEpilogue({events:{a:{completed:true,won:false}}}),veyraEpilogue({events:{},modes:{tt:{}}})];
 assert.equal(new Set(lines).size,4);
 assert.match(lines[0],/Forse basta/);
 for(const l of lines)assert.ok(Object.hasOwn(EN_TEXT,l),l);
});
