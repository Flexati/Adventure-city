import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
// D83: i pannelli non sono più blu piatti. Vetro color notte con le luci di Nox e Lulú, titoli in sfumatura,
// pulsanti a lama; con «Riduci movimento» il riflesso resta fermo. Il menu principale non cambia.
const css=fs.readFileSync('game/style.css','utf8');
const d83=css.slice(css.indexOf('/* D83: pannelli premium.'));
test('D83: la sezione dei pannelli premium esiste e viene dopo le regole di base',()=>{
 assert.ok(css.indexOf('/* D83: pannelli premium.')>css.indexOf('.card{max-width:520px;'));
});
test('D83: il pannello ha le due luci degli eroi e non un fondo blu piatto',()=>{
 const card=d83.match(/\n\.card\{position:relative;isolation:isolate;background:([\s\S]*?)\}/)[1];
 assert.match(card,/#6bddff/);assert.match(card,/#ff7fd8/);
 assert.ok((card.match(/gradient\(/g)||[]).length>=5,'più strati, non una sola sfumatura');
 assert.doesNotMatch(card,/#122438|#0b1726/,'il vecchio blu non torna');
});
test('D83: titoli e pulsanti hanno il trattamento nuovo, il dialogo usa la luce di chi parla',()=>{
 assert.match(d83,/\.card h2\{background:linear-gradient/);
 assert.match(d83,/\.card \.primary\{[^}]*linear-gradient\(100deg/);
 assert.match(d83,/\.card button:not\(\.primary\)\{[^}]*border-left:3px solid/);
 assert.match(d83,/#talk>div\{background:linear-gradient\(100deg,color-mix\(in srgb,var\(--speaker/);
});
test('D83: con «Riduci movimento» il riflesso dei pulsanti è fermo',()=>{
 assert.match(d83,/\.reduced-motion \.card \.primary::after\{animation:none;opacity:0\}/);
 assert.match(d83,/@media\(prefers-reduced-motion:reduce\)\{\.card \.primary::after\{animation:none;opacity:0\}\}/);
});
test('D83: nessuna scritta nuova sotto i 12 px e il menu principale non viene toccato',()=>{
 for(const m of d83.matchAll(/font-size:(\d+(?:\.\d+)?)px/g))assert.ok(+m[1]>=12,`font-size ${m[1]}px`);
 assert.doesNotMatch(d83,/#menu/,'il menu resta quello di sempre');
 assert.doesNotMatch(d83,/(^|\n|\})button\{/,'lo stile di base dei pulsanti non cambia');
});
test('D83: la fine tappa dice l\'esito anche con la forma (rombo o croce), non solo con il colore',()=>{
 assert.match(d83,/#result:not\(\.fail\) \.card>small:first-child::before\{content:"◆ "\}/);
 assert.match(d83,/#result\.fail \.card>small:first-child::before\{content:"✕ "\}/);
 assert.match(fs.readFileSync('game/runtime.mjs','utf8'),/panel\('result',true\);\$\('result'\)\.classList\.toggle\('fail',!!retry\);/);
});
test('D83: i pannelli entrano a strati in meno di mezzo secondo, e subito con «Riduci movimento»',()=>{
 const dur=+d83.match(/\.modal:not\(\[hidden\]\)>\.card>\*\{animation:panelRise ([\d.]+)s/)[1];
 const delays=[...d83.matchAll(/\.card>:nth-child\([^)]*\)\{animation-delay:([\d.]+)s\}/g)].map(m=>+m[1]);
 assert.ok(dur+Math.max(...delays)<=.5,`entrata di ${dur+Math.max(...delays)} s`);
 assert.match(d83,/\.reduced-motion \.modal>\.card>\*\{animation:none\}/);
 assert.match(d83,/@media\(prefers-reduced-motion:reduce\)\{\.modal>\.card>\*\{animation:none\}\}/);
});
test('R30 (#23): la fiammata tinta legge fotogrammi e fps dal manifest, non numeri scritti a mano',async()=>{
 const rt=fs.readFileSync('game/runtime.mjs','utf8');
 assert.match(rt,/const an=chronoAnimation\(f\.id,'play'\),i=settings\.reduced\|\|!an\?0:Math\.min\(an\.frame_count-1,Math\.floor\(\(f\.max-f\.life\)\*an\.fps\)\);/);
 assert.doesNotMatch(rt,/Math\.min\(3,Math\.floor\(\(f\.max-f\.life\)\*12\)\)/);
 const {chronoAnimation}=await import('../game/chrono-art.mjs');const an=chronoAnimation('muzzle_flash','play');
 assert.ok(an.frame_count>=1&&an.fps>0,'il manifest descrive la fiammata');
 assert.ok(an.frame_count/an.fps<=.34+1e-9,'tutti i fotogrammi entrano nella vita della fiammata (0,34 s)');
});
