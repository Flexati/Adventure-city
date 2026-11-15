import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
// Shipped audio is never rewritten in place (rule 5): a new mix is a new, registered file. docs/gold/FILE_INVENTORY.json is the reference.
const REVISED={'game/audio/v10/chalk_route.ogg':'c0d818e, Audio V10.3 rev 2 (-17 LUFS), after the 27 October inventory'};
test('every inventoried game audio file matches the inventory byte for byte',()=>{
 const raw=fs.readFileSync('docs/gold/FILE_INVENTORY.json','utf8');
 const entries=[...raw.matchAll(/"path":\s*"(game\/audio\/[^"]+)",\s*"bytes":\s*(\d+),\s*"sha256":\s*"([0-9a-f]{64})"/g)];
 assert.ok(entries.length>=90,'inventory parsed: '+entries.length);
 for(const [,file,bytes,sha] of entries){
  if(REVISED[file])continue;
  const data=fs.readFileSync(file);
  assert.equal(data.length,+bytes,file+' size');assert.equal(crypto.createHash('sha256').update(data).digest('hex'),sha,file+' was rewritten in place');
 }
});
