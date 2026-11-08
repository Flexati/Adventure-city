import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;
const HOST = '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ogg': 'audio/ogg',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.md': 'text/markdown; charset=utf-8',
  '.apk': 'application/vnd.android.package-archive',
  '.aab': 'application/octet-stream',
};

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(reqUrl.pathname);

  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const safePath = path.normalize(path.join(__dirname, pathname));
  if (!safePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  let targetPath = safePath;
  if (pathname.includes('Chronos_Adventure_Nox_Lulu_debug.apk') && !fs.existsSync(targetPath)) {
    const fallbackApk = path.join(__dirname, 'artifacts/chrono_shadows/Adventure_City_rc2_debug.apk');
    if (fs.existsSync(fallbackApk)) {
      targetPath = fallbackApk;
    }
  }

  fs.stat(targetPath, (err, stats) => {
    if (err || !stats.isFile()) {
      if (pathname.endsWith('.html') || !path.extname(pathname)) {
        const fallbackIndex = path.join(__dirname, 'index.html');
        fs.readFile(fallbackIndex, (fbErr, fbContent) => {
          if (fbErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fbContent);
          }
        });
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const headers = {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    };

    if (ext === '.apk' || ext === '.aab') {
      headers['Content-Disposition'] = `attachment; filename="${path.basename(safePath)}"`;
      headers['Content-Length'] = stats.size;
    }

    res.writeHead(200, headers);
    const readStream = fs.createReadStream(safePath);
    readStream.pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`[CHRONOS Server] In ascolto su http://${HOST}:${PORT}`);
});
