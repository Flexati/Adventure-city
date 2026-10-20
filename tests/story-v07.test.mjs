import test from 'node:test';import assert from 'node:assert/strict';
import {V07_DIALOGUE,validateDialogue} from '../game/story-v07.mjs';
test('all v0.7 dialogue blocks are short mobile-readable units',()=>{
 for(const [id,lines] of Object.entries(V07_DIALOGUE)){assert.equal(validateDialogue(lines),true,id);assert.ok(lines.length<=5,id);}
});
test('dialogue validator rejects empty and oversized mobile copy',()=>{
 assert.equal(validateDialogue([]),false);
 assert.equal(validateDialogue([{speaker:'NOX',text:'x'.repeat(241)}]),false);
});
