import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
// Q2 (D35, priorities 2 and 3): readability without audio or colour, and touch feel. Timings and hitboxes are untouched (rule 4).
const runtime=fs.readFileSync('game/runtime.mjs','utf8'),campaign=fs.readFileSync('game/campaign.mjs','utf8'),css=fs.readFileSync('game/style.css','utf8');
const statement=head=>{const i=runtime.indexOf(head);assert.ok(i>=0,'runtime has '+head);return runtime.slice(i,runtime.indexOf('\n',i));};
const recorder=()=>{const calls={dash:[],strokes:[],lines:[]};const ctx={save(){},restore(){},setLineDash:d=>calls.dash.push(d)};
 const circle=(x,y,r,color,stroke=false,width=2)=>{if(stroke)calls.strokes.push({r,width,dash:calls.dash.at(-1)});};
 const line=(...a)=>calls.lines.push(a);return {calls,ctx,circle,line,label(){},clamp:(v,a,b)=>Math.max(a,Math.min(b,v))};};
const runWarn=(head,e)=>{const r=recorder();new Function('e','ctx','circle','line','label','clamp','if(false){}'+statement(head).trimStart())(e,r.ctx,r.circle,r.line,r.label,r.clamp);return r.calls;};

test('Q2-U1: the telegraph lock fractions match the simulation (campaign.mjs warn branch)',()=>{
 assert.match(campaign,/if\(e\.clock<e\.windup\*\.55&&!e\.ranged\)e\.target=/);
 assert.match(campaign,/if\(e\.ranged&&e\.clock<e\.windup\*\.6\)e\.target=/);
 assert.match(statement("else if(e.state==='warn'&&!e.ranged)"),/lock=k>=\.55/);
 assert.match(statement("else if(e.state==='warn'&&e.ranged)"),/lock=e\.clock>=e\.windup\*\.6/);
});

test('Q2-U1: a melee circle is dashed while it tracks and solid with four ticks once locked',()=>{
 const e={state:'warn',ranged:false,role:'raider',attackRadius:68,windup:1,target:{x:100,y:200}};
 const before=runWarn("else if(e.state==='warn'&&!e.ranged)",{...e,clock:.3});
 assert.deepEqual(before.strokes.map(s=>[s.dash,s.width]),[[[8,8],3]]);assert.equal(before.lines.length,0);
 const after=runWarn("else if(e.state==='warn'&&!e.ranged)",{...e,clock:.7});
 assert.deepEqual(after.strokes.map(s=>[s.dash,s.width]),[[[],5]]);assert.equal(after.lines.length,4,'four lock ticks');
 // The ticks sit on the rim, 14 px long: they never cover the cue label at the centre.
 for(const [x,y,a,b] of after.lines)assert.equal(Math.hypot(x-a,y-b),14);
});

test('Q2-U1: a ranged aim line is dashed while it tracks and solid and thicker once locked',()=>{
 const e={state:'warn',ranged:true,x:0,y:0,windup:.7,target:{x:300,y:0}};
 const before=runWarn("else if(e.state==='warn'&&e.ranged)",{...e,clock:.2}),after=runWarn("else if(e.state==='warn'&&e.ranged)",{...e,clock:.5});
 assert.deepEqual(before.dash,[[6,8]]);assert.equal(before.lines[0][5],2);
 assert.deepEqual(after.dash,[[]]);assert.equal(after.lines[0][5],3);
});

test('Q2-U2a: with reduced motion, invulnerability shows a still dashed ring instead of the blink',()=>{
 const head=" for(const a of actors){if(a.role==='hero')",i=runtime.indexOf(head),body=runtime.slice(i,runtime.indexOf('else if(a.role===\'partner\')',i));
 assert.ok(i>=0);const hero=body.slice(body.indexOf("if(a.role==='hero')"));
 const run=(inv,reduced)=>{const r=recorder();let drawn=0;new Function('a','s','settings','ctx','circle','drawHero',hero)({role:'hero',x:10,y:50},{inv,time:0,hero:'nox'},{reduced},r.ctx,r.circle,()=>drawn++);return {rings:r.calls.strokes,drawn};};
 assert.deepEqual(run(.2,true).rings.map(s=>s.dash),[[5,6]]);assert.equal(run(.2,true).drawn,1,'hero always drawn with reduced motion');
 assert.equal(run(.2,false).rings.length,0,'normal motion keeps the blink only');
 assert.equal(run(0,true).rings.length,0,'no ring without invulnerability');
});

test('Q2-U2b: the SCHIVA button marks a charged Chrono Shift for Nox with a double outline',()=>{
 const m=runtime.match(/db\.classList\.toggle\('shift',(.*?)\);/);assert.ok(m);
 const charged=new Function('s','return '+m[1]);
 assert.equal(charged({hero:'nox',shiftCd:0}),true);assert.equal(charged({hero:'nox'}),true);
 assert.equal(charged({hero:'nox',shiftCd:2.4}),false);assert.equal(charged({hero:'lulu',shiftCd:0}),false,'Lulù keeps her Perfect Dodge without the shift (D33)');
 assert.match(css,/\.actions button\.shift\{outline:3px double currentColor;/);
});

test('Q2-U3: Perfect Dodge and damage vibrate on foot, through the same haptic gate as races',()=>{
 assert.match(runtime,/else if\(e\.type==='perfectDodge'\)\{haptic\(e\.shift\?\[15,30,15\]:20\);/);
 assert.match(runtime,/else if\(e\.type==='hurt'\)\{lastHurt=e\.source;haptic\(35\);/);
 assert.match(runtime,/function haptic\(pattern\)\{if\(settings\.haptics&&!document\.hidden\)/);
});
