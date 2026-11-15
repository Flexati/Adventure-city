import fs from 'node:fs';
import crypto from 'node:crypto';
import {STORY,BARKS,CHOICES,resolveLines,resolveBark} from '../game/story-v08.mjs';
import {FOOT} from '../game/missions.mjs';
import {HUBS,HUB_ITEMS} from '../game/hubs.mjs';
import {EN_TEXT} from '../game/locale.mjs';
const found=new Map();const add=(id,text)=>{if(typeof text!=='string'||!text.trim())return;const row=found.get(text)||{source:text,ids:[],english:EN_TEXT[text]??null,status:Object.hasOwn(EN_TEXT,text)?'AUTHORED_TRANSLATION':'OPEN'};if(!row.ids.includes(id))row.ids.push(id);found.set(text,row);};
const variants=[{},...['direct','service'].flatMap(route=>[false,true].map(b=>({'exp.chalk.route':route,'exp.chalk.completed':true,blackout_choice:b?'workshop':'shelter',eve_kept:b,unit9_saved:b,hand_taken:b})))];
for(const [id,entry]of Object.entries(STORY))for(const flags of variants)for(const [i,line]of resolveLines(entry,flags).entries())add(`story.${id}.${i}`,line.text);
for(const [scene,table]of Object.entries(BARKS))for(const [id,line]of Object.entries(table))for(const flags of variants)add(`bark.${scene}.${id}`,resolveBark(line,flags)?.text);
for(const [id,choice]of Object.entries(CHOICES)){add(`choice.${id}.title`,choice.title);for(const [key,opt]of Object.entries(choice.options)){add(`choice.${id}.${key}.label`,opt.label);add(`choice.${id}.${key}.hint`,opt.hint);}}
for(const [id,mission]of Object.entries(FOOT))for(const key of ['name','district','goal','task','end','nodeLabel','threat'])add(`mission.${id}.${key}`,mission[key]);
for(const [id,hub]of Object.entries(HUBS)){for(const [i,text]of hub.intro.entries())add(`hub.${id}.intro.${i}`,text);add(`hub.${id}.secret`,hub.secret);add(`hub.${id}.epilogue`,hub.epilogue);for(const person of hub.people)add(`hub.${id}.person.${person[0]}`,person[3]);for(const job of hub.jobs)for(const key of ['title','brief','finish'])add(`job.${job.id}.${key}`,job[key]);}
for(const [id,item]of Object.entries(HUB_ITEMS)){add(`item.${id}.name`,item.name);add(`item.${id}.description`,item.description);}
const entries=[...found.values()].sort((a,b)=>a.ids[0].localeCompare(b.ids[0]));const source_hashes=Object.fromEntries(['game/story-v08.mjs','game/missions.mjs','game/hubs.mjs','game/locale.mjs','game/story-en.mjs','game/world-en.mjs'].map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')]));const report={source_hashes,scope:'Sampled authored story branches, barks, choices, mission definitions and hub copy. Not a full DOM/dynamic-string or IT/EN acceptance audit.',unique_source_strings:entries.length,authored_english:entries.filter(e=>e.english!==null).length,open:entries.filter(e=>e.english===null).length,human_review:false,commercial_ready:false,entries};fs.writeFileSync('docs/gold/LOCALE_REGISTER.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(Object.fromEntries(Object.entries(report).filter(([k])=>k!=='entries'))));
