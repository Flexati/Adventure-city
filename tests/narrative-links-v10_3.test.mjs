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

test('promise choices echo at the clinic and at the reunion, with English text',()=>{
 const t=(id,f)=>resolveLines(STORY[id],f).map(l=>l.text);
 const clinic=['blind','evasive','honest'].map(v=>t('clinic_auth',{promise_trust:v}).at(-1));
 assert.equal(new Set(clinic).size,3);
 assert.equal(t('clinic_auth',{}).at(-1),'Nox combatte dall’altra parte. Non può sentirmi.');
 assert.ok(t('reunion_open',{promise_accept:true}).includes('Ti avevo promesso niente trasmissioni. L’ho rotta io.'));
 assert.ok(t('reunion_open',{promise_accept:false}).includes('Mi avevi chiesto di chiedertelo. Non ho trovato il tempo.'));
 for(const f of [{promise_trust:'blind',promise_accept:true},{promise_trust:'evasive',promise_accept:false},{promise_trust:'honest'}])
  for(const id of ['clinic_auth','reunion_open'])for(const x of t(id,f))assert.ok(Object.hasOwn(EN_TEXT,x),x);
 for(const id of ['promise_repair','promise_ask','promise_offer','promise_blind','promise_evasive','promise_honest','promise_yes','promise_no'])for(const x of t(id,{}))assert.ok(Object.hasOwn(EN_TEXT,x),x);
});
