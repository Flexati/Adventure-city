import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// CLAUDE.md and the prompts in §2 of the MX Linux instructions tell a new Claude session where every
// resource lives (D31). These tests keep that map honest: a renamed or deleted file breaks the build
// instead of sending the next session to a path that no longer exists.
const GUIDE='CLAUDE.md',INSTRUCTIONS='docs/gold/ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md';
const guide=fs.readFileSync(GUIDE,'utf8'),instructions=fs.readFileSync(INSTRUCTIONS,'utf8');
const section=(text,from,to)=>{const a=text.indexOf(from),b=text.indexOf(to,a+1);assert.ok(a>=0&&b>a,`${from} … ${to}`);return text.slice(a,b);};
const prompts=section(instructions,'## 2. ','## 3. ');
const blocks=[...prompts.matchAll(/```\n([\s\S]*?)```/g)].map(m=>m[1]);

const ROOTS='docs|game|tools|tests|requests|assets|android|deliveries';
const PATH=new RegExp(`(?<![\\w/.-])(CLAUDE\\.md|package\\.json|(?:${ROOTS})/[^\\s\`)»,;:]*)`,'g');
const repoPaths=text=>[...new Set([...text.matchAll(PATH)].map(m=>m[1].replace(/[.]+$/,'')))];
function exists(p){
 if(!p.includes('*'))return fs.existsSync(p);
 const dir=path.dirname(p),re=new RegExp(`^${path.basename(p).split('*').map(s=>s.replace(/[.+?^${}()|[\]\\]/g,'\\$&')).join('.*')}$`);
 return !dir.includes('*')&&fs.existsSync(dir)&&fs.readdirSync(dir).some(f=>re.test(f));
}

test('every repo path named in CLAUDE.md and in the §2 prompts exists',()=>{
 const named=[...repoPaths(guide),...repoPaths(prompts)];
 assert.ok(named.length>=40,`only ${named.length} paths found: the extractor is broken`);
 assert.deepEqual(named.filter(p=>!exists(p)),[]);
});

test('the start prompt and the resume prompt point to the guide, the branch and the reading order',()=>{
 assert.equal(blocks.length,2,'§2 must hold exactly the start prompt and the resume prompt');
 const [start,resume]=blocks;
 for(const needle of ['Flexati/Adventure-city','work/chronos-adventure-commercial','CLAUDE.md','COMMERCIAL_RELEASE = BLOCKED','main','requests/'])assert.ok(start.includes(needle),needle);
 // The reading order goes from the most authoritative source down (CLAUDE.md's precedence list).
 const order=['CLAUDE.md','docs/gold/ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md','docs/gold/DECISIONI.md','docs/gold/STATO.md','docs/design/v10.3/README.md'].map(f=>start.indexOf(f));
 assert.ok(order.every((at,i)=>at>=0&&(i===0||at>order[i-1])),JSON.stringify(order));
 for(const needle of ['work/chronos-adventure-commercial','CLAUDE.md','docs/gold/STATO.md','docs/gold/DECISIONI.md'])assert.ok(resume.includes(needle),needle);
});

test('CLAUDE.md carries the fixed rules, and the decisions it cites exist',()=>{
 for(const needle of ['COMMERCIAL_RELEASE = BLOCKED','work/chronos-adventure-commercial','`main`','19 civili','Archon','Kairn e Morrow','5,99 €','italiano','[FATTO]','[IPOTESI]','16,67 ms'])assert.ok(guide.includes(needle),needle);
 const decisions=fs.readFileSync('docs/gold/DECISIONI.md','utf8');
 for(const id of ['D18','D27','D29','D31'])assert.match(decisions,new RegExp(`^\\| ${id} \\|`,'m'),id);
});

test('no model identifiers in CLAUDE.md or in the MX Linux instructions',()=>{
 for(const [file,text] of [[GUIDE,guide],[INSTRUCTIONS,instructions]]){
  assert.doesNotMatch(text,/\b(opus|sonnet|haiku|fable)\b/i,file);
  assert.doesNotMatch(text,/claude-(?:opus|sonnet|haiku|fable|\d)/i,file);
 }
});

// CLAUDE.md: a new decision gets the next Dnn in DECISIONI.md and the updated state goes at the top of
// STATO.md. The top section must therefore name the latest decision, whatever its number is today.
test('the first section of STATO.md cites the latest decision in DECISIONI.md',()=>{
 const decisions=fs.readFileSync('docs/gold/DECISIONI.md','utf8'),state=fs.readFileSync('docs/gold/STATO.md','utf8');
 const ids=[...decisions.matchAll(/^\| D(\d+) \|/gm)].map(m=>Number(m[1]));
 assert.ok(ids.length>=31,`only ${ids.length} decision rows found: the extractor is broken`);
 const latest=`D${String(Math.max(...ids)).padStart(2,'0')}`;
 const headings=[...state.matchAll(/^#{1,2} .*$/gm)];
 assert.ok(headings.length>=2,'STATO.md has no sections');
 const top=state.slice(0,headings[1].index);
 assert.match(top,new RegExp(`\\b${latest}\\b`),`the first section of STATO.md (${headings[0][0]}) does not cite ${latest}`);
});
