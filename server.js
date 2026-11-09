// Pretest hub: serves only the hub page, game/, assets/, docs/ and the debug APK. Never dotfiles, keys or other build output
// (tools/generate_play_upload_key.mjs keeps the Play upload key and its password under dist/play-upload).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const DIRS=new Set(['game','assets','docs']);
const FILES=new Set(['index.html','dist/Chronos_Adventure_Nox_Lulu_debug.apk']);
const SECRET=/\.(jks|keystore|p12|pfx|pem|key|env)$/i;
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.cjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/markdown; charset=utf-8','.txt':'text/plain; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ogg':'audio/ogg','.mp3':'audio/mpeg','.wav':'audio/wav','.mp4':'video/mp4','.webm':'video/webm','.woff2':'font/woff2','.apk':'application/vnd.android.package-archive'};

// Returns the file to serve under root, or the HTTP status that refuses the request.
export function resolveRequest(root,rawUrl){
 let pathname;
 try{pathname=decodeURIComponent(new URL(rawUrl,'http://hub.invalid').pathname);}catch{return {status:400};}
 if(pathname.includes('\0')||pathname.includes('\\'))return {status:400};
 const parts=pathname.split('/').filter(Boolean);
 if(parts.some(p=>p.startsWith('.')))return {status:404};
 const rel=parts.length?parts.join('/'):'index.html';
 if(!FILES.has(rel)&&!DIRS.has(parts[0]))return {status:404};
 if(SECRET.test(rel))return {status:404};
 const file=path.join(root,rel),inside=path.relative(root,file);
 if(!inside||inside.startsWith('..')||path.isAbsolute(inside))return {status:403};
 return {file,slash:pathname.endsWith('/')};
}

function refuse(res,status,text){res.writeHead(status,{'Content-Type':'text/plain; charset=utf-8'});res.end(text);}

export function createHubServer(root){
 const realRoot=fs.realpathSync(root);
 return http.createServer((req,res)=>{
  if(req.method!=='GET'&&req.method!=='HEAD')return refuse(res,405,'Method Not Allowed');
  const r=resolveRequest(realRoot,req.url);
  if(r.status)return refuse(res,r.status,r.status===400?'Bad Request':r.status===403?'Forbidden':'Not Found');
  fs.realpath(r.file,(err,real)=>{
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
    send(res,req,real,stats);
   });
  });
 });
}

function send(res,req,file,stats){
 const ext=path.extname(file).toLowerCase(),headers={'Content-Type':MIME[ext]||'application/octet-stream','Content-Length':stats.size,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'};
 if(ext==='.apk')headers['Content-Disposition']=`attachment; filename="${path.basename(file)}"`;
 if(req.method==='HEAD'){res.writeHead(200,headers);return res.end();}
 const stream=fs.createReadStream(file);
 stream.on('open',()=>{res.writeHead(200,headers);stream.pipe(res);});
 stream.on('error',()=>{if(res.headersSent)res.destroy();else refuse(res,404,'Not Found');});
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const host=process.env.HOST||'127.0.0.1',port=Number(process.env.PORT??3000);
 const server=createHubServer(path.dirname(fileURLToPath(import.meta.url)));
 server.listen(port,host,()=>{const a=server.address();console.log(`[CHRONOS hub] http://${a.address}:${a.port}/ (solo index.html, game/, assets/, docs/ e l'APK di debug)`);if(host!=='127.0.0.1'&&host!=='localhost')console.log('[CHRONOS hub] Visibile in rete locale: usalo solo sulla tua Wi-Fi di casa.');});
}
