import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
// The Android build concatenates every module into one classic script. A duplicated top-level
// function silently replaces the other, so top-level names must be unique across modules.
const MODULES=['layouts.mjs','scenery.mjs','audio-engine.mjs','narrative.mjs','story-v08.mjs','campaign.mjs','missions.mjs','visuals.mjs','driving.mjs','runtime.mjs'];
function topLevelNames(source){
 const names=[];let depth=0,i=0,quote=null,line=false,block=false,templateDepth=[];
 const at=k=>source.startsWith(k,i);
 while(i<source.length){const ch=source[i];
  if(line){if(ch==='\n')line=false;i++;continue;}
  if(block){if(at('*/')){block=false;i+=2;continue;}i++;continue;}
  if(quote){if(ch==='\\'){i+=2;continue;}if(quote==='`'&&at('${')){templateDepth.push(depth);depth++;quote=null;i+=2;continue;}if(ch===quote)quote=null;i++;continue;}
  if(at('//')){line=true;i+=2;continue;}if(at('/*')){block=true;i+=2;continue;}
  if(ch==='"'||ch==="'"||ch==='`'){quote=ch;i++;continue;}
  if(ch==='{'||ch==='('||ch==='['){depth++;i++;continue;}
  if(ch==='}'||ch===')'||ch===']'){depth--;if(ch==='}'&&templateDepth.length&&templateDepth.at(-1)===depth){templateDepth.pop();quote='`';}i++;continue;}
  if(depth===0){const m=/^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)|^(?:export\s+)?(?:const|let|var)\s+/.exec(source.slice(i,i+200));
   if(m&&(i===0||/[\s;}]/.test(source[i-1]))){if(m[1]){names.push(m[1]);i+=m[0].length;continue;}
    // Declarator list: names at nesting depth zero, separated by commas, up to the statement end.
    let j=i+m[0].length,d=0,expectName=true,q=null;while(j<source.length){const c=source[j];if(q){if(c==='\\'){j+=2;continue;}if(c===q)q=null;j++;continue;}if(c==='"'||c==="'"||c==='`'){q=c;j++;continue;}if('({['.includes(c))d++;else if(')}]'.includes(c))d--;else if(d===0&&c===';')break;else if(d===0&&c===','){expectName=true;j++;continue;}if(expectName&&d===0&&/[A-Za-z_$]/.test(c)){const n=/^[A-Za-z_$][\w$]*/.exec(source.slice(j))[0];names.push(n);expectName=false;j+=n.length;continue;}j++;}
    i=j;continue;}}
  i++;}
 return names;}
test('flattened Android bundle has no duplicated top-level names',()=>{
 const seen=new Map();
 for(const file of MODULES){for(const name of topLevelNames(fs.readFileSync('game/'+file,'utf8'))){assert.ok(!seen.has(name)||seen.get(name)===file,`${name} declared in ${seen.get(name)} and ${file}`);seen.set(name,file);}}
 assert.ok(seen.has('tick')&&seen.has('render')&&seen.has('buildMission')&&seen.has('STORY'),'scanner finds real declarations');
});
