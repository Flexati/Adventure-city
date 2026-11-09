// Pretest hub: serves only the hub page, game/, assets/, docs/ and the debug APK. Never dotfiles, keys or other build output
// (tools/generate_play_upload_key.mjs keeps the Play upload key and its password under dist/play-upload).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFile} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const REPO_URL='https://github.com/Flexati/Adventure-city.git';
const BRANCH='work/chronos-adventure-commercial';
const DIRS=new Set(['game','assets','docs']);
const FILES=new Set([
 'index.html',
 'dist/Chronos_Adventure_Nox_Lulu_debug.apk',
 'dist/Chronos_Modifiche_R4.zip',
 'dist/Chronos_Modifiche_R4_Completo.zip',
 'dist/chronos-r4-code.patch',
 'dist/chronos-tier3-update.patch'
]);
const ALIASES=new Map([
 ['apk','dist/Chronos_Adventure_Nox_Lulu_debug.apk'],
 ['download-apk','dist/Chronos_Adventure_Nox_Lulu_debug.apk'],
 ['chronos_adventure_nox_lulu_debug.apk','dist/Chronos_Adventure_Nox_Lulu_debug.apk'],
 ['modifiche-r4.zip','dist/Chronos_Modifiche_R4.zip'],
 ['chronos_modifiche_r4.zip','dist/Chronos_Modifiche_R4.zip'],
 ['modifiche-r4-completo.zip','dist/Chronos_Modifiche_R4_Completo.zip'],
 ['r4-code.patch','dist/chronos-r4-code.patch'],
 ['git-patch','dist/chronos-r4-code.patch'],
 ['git-patch-full','dist/chronos-tier3-update.patch'],
 ['chronos-tier3-update.patch','dist/chronos-tier3-update.patch']
]);
const SECRET=/\.(jks|keystore|p12|pfx|pem|key|env)$/i;
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.cjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/markdown; charset=utf-8','.txt':'text/plain; charset=utf-8','.patch':'text/plain; charset=utf-8','.zip':'application/zip','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ogg':'audio/ogg','.mp3':'audio/mpeg','.wav':'audio/wav','.mp4':'video/mp4','.webm':'video/webm','.woff2':'font/woff2','.apk':'application/vnd.android.package-archive'};

// Returns the file to serve under root, or the HTTP status that refuses the request.
export function resolveRequest(root,rawUrl){
 let pathname;
 try{pathname=decodeURIComponent(new URL(rawUrl,'http://hub.invalid').pathname);}catch{return {status:400};}
 if(pathname.includes('\0')||pathname.includes('\\'))return {status:400};
 const parts=pathname.split('/').filter(Boolean);
 if(parts.some(p=>p.startsWith('.')))return {status:404};
 let rel=parts.length?parts.join('/'):'index.html';
 if(ALIASES.has(rel.toLowerCase()))rel=ALIASES.get(rel.toLowerCase());
 if(!FILES.has(rel)&&!DIRS.has(parts[0]))return {status:404};
 if(SECRET.test(rel))return {status:404};
 const file=path.join(root,rel),inside=path.relative(root,file);
 if(!inside||inside.startsWith('..')||path.isAbsolute(inside))return {status:403};
 return {file,slash:pathname.endsWith('/')};
}

function refuse(res,status,text){res.writeHead(status,{'Content-Type':'text/plain; charset=utf-8'});res.end(text);}

function runGit(cwd,args,envExtra={}){
 return new Promise((resolve,reject)=>{
  execFile('git',args,{cwd,env:{...process.env,GIT_TERMINAL_PROMPT:'0',...envExtra},timeout:60000},(err,stdout,stderr)=>{
   if(err)reject(new Error((stderr||stdout||err.message).trim()));
   else resolve((stdout||stderr||'').trim());
  });
 });
}

export function createHubServer(root){
 const realRoot=fs.realpathSync(root);
 return http.createServer((req,res)=>{
  if(req.method==='POST'&&req.url==='/api/github-push'){
   let body='';
   req.on('data',chunk=>{if(body.length<16384)body+=chunk;});
   req.on('end',async()=>{
    let askpassPath=null;
    try{
     const parsed=JSON.parse(body||'{}'),token=String(parsed.token||'').trim(),targetBranch=String(parsed.branch||BRANCH).trim();
     if(!token){res.writeHead(400,{'Content-Type':'application/json; charset=utf-8'});return res.end(JSON.stringify({ok:false,error:'Token GitHub mancante.'}));}
     askpassPath=path.join(os.tmpdir(),`git-askpass-${Date.now()}-${Math.random().toString(36).slice(2)}.sh`);
     fs.writeFileSync(askpassPath,'#!/bin/sh\ncase "$1" in\n*Username*) echo "x-access-token" ;;\n*) echo "$GH_EPHEMERAL_PAT" ;;\nesac\n',{mode:0o700});
     const pushOut=await runGit(realRoot,['push',REPO_URL,`HEAD:refs/heads/${targetBranch}`],{GIT_ASKPASS:askpassPath,GH_EPHEMERAL_PAT:token});
     const head=await runGit(realRoot,['rev-parse','--short','HEAD']);
     res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});
     res.end(JSON.stringify({ok:true,commit:head,branch:targetBranch,output:pushOut||`Pushed HEAD (${head}) to ${targetBranch}`}));
    }catch(err){
     res.writeHead(500,{'Content-Type':'application/json; charset=utf-8'});
     res.end(JSON.stringify({ok:false,error:err.message}));
    }finally{
     if(askpassPath&&fs.existsSync(askpassPath)){try{fs.unlinkSync(askpassPath);}catch{}}
    }
   });
   return;
  }
  if(req.method!=='GET'&&req.method!=='HEAD')return refuse(res,405,'Method Not Allowed');
  const r=resolveRequest(realRoot,req.url);
  if(r.status)return refuse(res,r.status,r.status===400?'Bad Request':r.status===403?'Forbidden':'Not Found');
  let targetFile=r.file;
  if(targetFile.endsWith('Chronos_Adventure_Nox_Lulu_debug.apk')&&!fs.existsSync(targetFile)){
   const fallbackApk=path.join(realRoot,'artifacts/chrono_shadows/Adventure_City_rc2_debug.apk');
   if(fs.existsSync(fallbackApk))targetFile=fallbackApk;
  }
  fs.realpath(targetFile,(err,real)=>{
   if(err){const apk=r.file.endsWith('.apk');return refuse(res,404,apk?'APK non ancora costruito: bash tools/build_apk.sh':'Not Found');}
   const inside=path.relative(realRoot,real);
   if(!inside||inside.startsWith('..')||path.isAbsolute(inside))return refuse(res,403,'Forbidden');
   fs.stat(real,(statErr,stats)=>{
    if(!statErr&&stats.isDirectory()){
     // Like python's http.server: a folder answers with its index.html, after a redirect that makes relative links resolve inside it.
     if(!r.slash){res.writeHead(301,{Location:new URL(req.url,'http://hub.invalid').pathname+'/'});return res.end();}
     const index=path.join(real,'index.html');return fs.stat(index,(e,s)=>e||!s.isFile()?refuse(res,404,'Not Found'):send(res,req,index,s));
    }
    if(statErr||!stats.isFile())return refuse(res,404,'Not Found');
    send(res,req,real,stats,path.basename(r.file));
   });
  });
 });
}

function send(res,req,file,stats,downloadName=path.basename(file)){
 const ext=path.extname(file).toLowerCase(),headers={'Content-Type':MIME[ext]||'application/octet-stream','Accept-Ranges':'bytes','Content-Length':stats.size,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'};
 if(ext==='.apk'||ext==='.patch'||ext==='.zip')headers['Content-Disposition']=`attachment; filename="${downloadName}"`;
 if(req.method==='HEAD'){res.writeHead(200,headers);return res.end();}
 const range=req.headers.range;
 if(range&&range.startsWith('bytes=')){
  const [s0,s1]=range.replace('bytes=','').split('-'),start=parseInt(s0,10)||0,end=s1?parseInt(s1,10):stats.size-1;
  if(start>=stats.size||end>=stats.size||start>end){res.writeHead(416,{'Content-Range':`bytes */${stats.size}`});return res.end();}
  headers['Content-Range']=`bytes ${start}-${end}/${stats.size}`;headers['Content-Length']=end-start+1;
  const part=fs.createReadStream(file,{start,end});
  part.on('open',()=>{res.writeHead(206,headers);part.pipe(res);});
  part.on('error',()=>{if(res.headersSent)res.destroy();else refuse(res,404,'Not Found');});
  return;
 }
 const stream=fs.createReadStream(file);
 stream.on('open',()=>{res.writeHead(200,headers);stream.pipe(res);});
 stream.on('error',()=>{if(res.headersSent)res.destroy();else refuse(res,404,'Not Found');});
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const isTestPort=process.env.PORT==='0';
 const host=process.env.HOST||(isTestPort?'127.0.0.1':'0.0.0.0'),port=Number(process.env.PORT??3000);
 const server=createHubServer(path.dirname(fileURLToPath(import.meta.url)));
 server.listen(port,host,()=>{const a=server.address();console.log(`[CHRONOS hub] http://127.0.0.1:${a.port}/ (solo index.html, game/, assets/, docs/ e l'APK di debug)`);if(host!=='127.0.0.1'&&host!=='localhost')console.log('[CHRONOS hub] Visibile in rete locale: usalo solo sulla tua Wi-Fi di casa.');});
}

