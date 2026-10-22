// Read-only QA: generated images are never silently cropped or promoted into runtime.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {PNG} from 'pngjs';
import {execFileSync} from 'node:child_process';
const dir='assets/preproduction/v9',strict=process.argv.includes('--strict');
const art=JSON.parse(fs.readFileSync(dir+'/art-manifest.json')).entries;
const audio=JSON.parse(fs.readFileSync(dir+'/audio-manifest.json')).entries;
const failures=[],quarantined=[];
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
for(const asset of art){
 if(sha(asset.file)!==asset.sha256){failures.push(asset.id+': checksum mismatch');continue;}
 const png=PNG.sync.read(fs.readFileSync(asset.file));
 if(png.width!==asset.dimensions[0]||png.height!==asset.dimensions[1])failures.push(asset.id+': dimensions changed');
 if(asset.contract){
  const c=asset.contract,valid=png.width===c.columns*c.cell_width&&png.height===c.rows*c.cell_height;
  let transparent=false;for(let i=3;i<png.data.length;i+=4)if(png.data[i]===0){transparent=true;break;}
  if(!valid||!transparent){quarantined.push(asset.id);if(asset.status!=='TECH_REJECTED'||asset.runtime_ready)failures.push(asset.id+': invalid atlas was not quarantined');}
 }
 if(asset.runtime_ready)failures.push(asset.id+': preproduction cannot be runtime ready');
}
for(const asset of audio){
 if(sha(asset.file)!==asset.sha256||sha(asset.master)!==asset.master_sha256){failures.push(asset.id+': checksum mismatch');continue;}
 const pcm=execFileSync('ffmpeg',['-v','error','-i',asset.file,'-f','f32le','-acodec','pcm_f32le','-'],{maxBuffer:64*1024*1024});
 let peak=0,sum=0;for(let i=0;i<pcm.length;i+=4){const n=pcm.readFloatLE(i);if(!Number.isFinite(n)){failures.push(asset.id+': non-finite audio');break;}peak=Math.max(peak,Math.abs(n));sum+=n*n;}
 if(!pcm.length||peak>=1||sum===0)failures.push(asset.id+': empty, clipped or silent decode');
 if(asset.runtime_ready)failures.push(asset.id+': preproduction cannot be runtime ready');
}
const report={ok:failures.length===0,art:art.length,audio:audio.length,quarantined,failures,runtimeIntegration:'BLOCKED',humanReview:'NOT_PERFORMED'};
console.log(JSON.stringify(report,null,2));
if(failures.length||strict&&(quarantined.length||art.some(a=>!a.runtime_ready)||audio.some(a=>!a.runtime_ready)))process.exitCode=1;
