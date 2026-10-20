import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,attack,magic,step} from '../game/engine.mjs';
function advance(s,n){for(let i=0;i<n;i++)step(s,{},.05);}
test('gun damage waits for muzzle frame and occurs once',()=>{const s=fresh();s.stage='rescue';s.x=600;s.y=540;assert.equal(attack(s),true);assert.equal(s.enemy[0].hp,3);advance(s,2);assert.equal(s.enemy[0].hp,3);advance(s,1);assert.equal(s.enemy[0].hp,2);advance(s,8);assert.equal(s.enemy[0].hp,2);});
test('magic has independent cooldown, blocks overlapping casts and preserves shield',()=>{const s=fresh();s.stage='boss';s.x=1350;s.y=560;assert.equal(magic(s),true);assert.equal(attack(s),false);advance(s,17);assert.equal(s.boss.hp,24);assert.equal(magic(s),false);s.magicCooldown=0;s.boss.state='recover';s.boss.clock=0;assert.equal(magic(s),true);advance(s,8);assert.equal(s.boss.hp,20);});
test('Lulu magic hits a front area; Nox hits one target',()=>{for(const hero of ['kai','zara']){const s=fresh(hero);s.stage='rescue';s.x=600;s.y=540;s.enemy[0].x=700;s.enemy[0].y=540;s.enemy[1].x=730;s.enemy[1].y=580;magic(s);advance(s,8);assert.equal(s.boxes.length,hero==='zara'?2:1);}});
