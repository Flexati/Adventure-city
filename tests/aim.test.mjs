import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,aim,clearShot,attack,step} from '../game/engine.mjs';
test('manual direction overrides nearby enemy and normalizes',()=>{const s=fresh();s.stage='rescue';s.x=600;s.y=540;assert.deepEqual(aim(s,300,{x:0,y:-20}),{x:0,y:-1});attack(s,{x:0,y:-1});for(let i=0;i<4;i++)step(s,{},.05);assert.equal(s.enemy[0].hp,3);});
test('lock resists small distance changes but releases dead target',()=>{const s=fresh();s.stage='rescue';s.x=600;s.y=540;s.enemy[1].x=710;s.enemy[1].y=540;aim(s,300);assert.equal(s.aimTarget,0);s.enemy[1].x=695;aim(s,300);assert.equal(s.aimTarget,0);s.enemy[0].hp=0;aim(s,300);assert.equal(s.aimTarget,1);});
test('walls block aim selection and damage',()=>{assert.equal(clearShot({x:800,y:150},{x:1400,y:150}),false);assert.equal(clearShot({x:800,y:400},{x:1400,y:400}),true);const s=fresh();s.stage='rescue';s.x=850;s.y=150;s.enemy[1].hp=0;s.enemy[2].hp=0;s.enemy[0].x=1100;s.enemy[0].y=150;aim(s,700);assert.equal(s.aimTarget,null);attack(s,{x:1,y:0});for(let i=0;i<4;i++)step(s,{},.05);assert.equal(s.enemy[0].hp,3);});
