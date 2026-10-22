import test from 'node:test';import assert from 'node:assert/strict';
import {newRun,tick,startAttack} from '../game/campaign.mjs';

test('Perfect Dodge triggers only when an attack would land inside the narrow window',()=>{
 const s=newRun('nox');const e=s.enemies[0];
 e.x=s.x+40;e.y=s.y;e.state='warn';e.clock=.98;e.target={x:s.x,y:s.y};
 tick(s,{dash:true},.05);
 assert.ok(s.events.some(v=>v.type==='perfectDodge'));
 assert.ok(s.counterReady>0);
 assert.equal(s.hp,s.maxHp);
});

test('ordinary invulnerability outside the perfect window avoids damage without granting counter',()=>{
 const s=newRun('nox');const e=s.enemies[0];
 e.x=s.x+40;e.y=s.y;e.state='warn';e.clock=.98;e.target={x:s.x,y:s.y};
 s.inv=.2;s.perfectWindow=0;
 tick(s,{},.05);
 assert.equal(s.hp,s.maxHp);
 assert.equal(s.counterReady,0);
 assert.equal(s.events.some(v=>v.type==='perfectDodge'),false);
});

test('the first attack after a Perfect Dodge consumes the counter and deals bonus damage',()=>{
 const s=newRun('nox');const e=s.enemies[0];e.x=s.x+70;e.y=s.y;e.hp=4;e.max=4;s.counterReady=.5;
 assert.equal(startAttack(s,'gun',{x:1,y:0}),true);
 tick(s,{},.05);tick(s,{},.05);
 assert.equal(s.counterReady,0);
 assert.equal(e.hp,2);
});
