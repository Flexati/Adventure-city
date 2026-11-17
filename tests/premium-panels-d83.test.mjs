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
