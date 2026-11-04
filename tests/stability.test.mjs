import test from 'node:test';
import assert from 'node:assert/strict';
import {createFaultMonitor,guardedFrame} from '../game/stability.mjs';

test('guardedFrame requests the next frame before the step, even when the step throws',()=>{
 const calls=[],faults=[];let scheduled=null;
 const frame=guardedFrame(t=>{calls.push('step:'+t);throw new Error('boom');},next=>{calls.push('schedule');scheduled=next;},e=>faults.push(e.message));
 assert.doesNotThrow(()=>frame(16));
 assert.deepEqual(calls,['schedule','step:16']);
 assert.equal(scheduled,frame,'the same guarded frame is scheduled again');
 assert.deepEqual(faults,['boom']);
 frame(32);
 assert.deepEqual(calls,['schedule','step:16','schedule','step:32']);
 assert.deepEqual(faults,['boom','boom']);
});

test('two faults inside five seconds continue, the third recovers',()=>{
 let clock=1000;const monitor=createFaultMonitor({now:()=>clock});
 assert.equal(monitor.record(new Error('a'),'frame'),'continue');
 clock+=2000;assert.equal(monitor.record(new Error('b'),'frame'),'continue');
 clock+=2000;assert.equal(monitor.record(new Error('c'),'error'),'recover');
 assert.deepEqual(monitor.status(),{total:3,recent:3,last:{source:'error',message:'c'}});
});

test('faults further apart than five seconds keep continuing',()=>{
 let clock=0;const monitor=createFaultMonitor({now:()=>clock});
 for(let i=0;i<6;i++){assert.equal(monitor.record(new Error('spaced '+i),'frame'),'continue',`fault ${i}`);clock+=5001;}
 const status=monitor.status();
 assert.equal(status.total,6);
 assert.ok(status.recent<=1,'only faults inside the window are recent');
});

test('the last message is capped at 160 characters and total counts every fault',()=>{
 let clock=0;const monitor=createFaultMonitor({now:()=>clock});
 assert.deepEqual(monitor.status(),{total:0,recent:0,last:null});
 for(let i=0;i<4;i++){monitor.record(new Error('x'.repeat(400)),'frame');clock+=10000;}
 monitor.record('plain string reason','unhandledrejection');
 const status=monitor.status();
 assert.equal(status.total,5);
 assert.equal(status.last.source,'unhandledrejection');
 assert.equal(status.last.message,'plain string reason');
 monitor.record(new Error('y'.repeat(400)),'frame');
 assert.equal(monitor.status().last.message.length,160);
 assert.equal(monitor.status().total,6);
});
