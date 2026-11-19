import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// game/android_bootstrap.js is shipped as a classic script (bootstrap.js). It runs here in node:vm against a minimal
// window/document: only the pieces the bootstrap touches. tools/verify_stability.cjs S5b proves the same in Chromium.
const source=fs.readFileSync('game/android_bootstrap.js','utf8');

function boot(cityAdventure){
 const listeners={},byId={},appended=[];
 const element=()=>({style:{},children:[],appendChild(child){this.children.push(child);return child;}});
 const document={
  body:{appendChild(box){appended.push(box);if(box.id)byId[box.id]=box;return box;}},
  createElement:()=>element(),
  getElementById:id=>byId[id]||null,
 };
 const window={
  addEventListener(type,fn){(listeners[type]||(listeners[type]=[])).push(fn);},
  setInterval:()=>1,setTimeout:()=>2,clearInterval(){},clearTimeout(){},
  location:{reload(){}},
 };
 if(cityAdventure!==undefined)window.cityAdventure=cityAdventure;
 vm.runInNewContext(source,{window,document,String});
 return {
  recovery:()=>byId['startup-recovery']||null,
  fire:(type,event)=>{for(const fn of listeners[type]||[])fn(event);},
  window,
 };
}
const runtimeError=(w,message)=>({message,target:w});

test('a runtime error before the game has started still opens the startup recovery screen',()=>{
 const notStarted={
  'no game object yet':undefined,
  'game object present but not loaded':{status:()=>({loaded:false})},
  'status() throws, so the start cannot be confirmed':{status(){throw new Error('not ready');}},
 };
 for(const [label,game] of Object.entries(notStarted)){
  const page=boot(game);
  assert.equal(page.recovery(),null,label+': nothing is open before any error');
  page.fire('error',runtimeError(page.window,'SyntaxError: Unexpected token'));
  assert.ok(page.recovery(),label+': the startup recovery screen opens');
 }
});

test('a runtime error after the game has started does not open the startup recovery screen',()=>{
 const page=boot({status:()=>({loaded:true})});
 page.fire('error',runtimeError(page.window,'TypeError: late error in a handler'));
 assert.equal(page.recovery(),null,'the runtime fault panel owns errors after the start');
});

test('startup recovery screen follows device language and saved player language',()=>{
 const bootLocale=(navLang,savedSettings)=>{
  const listeners={},byId={};
  const element=()=>({style:{},children:[],appendChild(child){this.children.push(child);return child;}});
  const document={body:{appendChild(box){if(box.id)byId[box.id]=box;return box;}},createElement:()=>element(),getElementById:id=>byId[id]||null};
  const window={
   navigator:{language:navLang},
   localStorage:{getItem:k=>k==='city-v4-settings'?savedSettings:null},
   addEventListener(type,fn){(listeners[type]||(listeners[type]=[])).push(fn);},
   setInterval:()=>1,setTimeout:()=>2,clearInterval(){},clearTimeout(){},location:{reload(){}}
  };
  vm.runInNewContext(source,{window,document,String});
  for(const fn of listeners.error||[])fn({target:{tagName:'SCRIPT'}});
  return byId['startup-recovery'].children[0].children.map(c=>c.textContent);
 };
 const en=bootLocale('en-US',null);
 assert.equal(en[0],'The game could not start');
 assert.equal(en[1],'A game resource failed to load.');
 assert.equal(en[3],'Retry');
 const it=bootLocale('it-IT',null);
 assert.equal(it[0],'Il gioco non è riuscito a partire');
 assert.equal(it[1],'Una risorsa del gioco non è stata caricata.');
 assert.equal(it[3],'Riprova');
 const savedEnOnItPhone=bootLocale('it-IT','{"language":"en"}');
 assert.equal(savedEnOnItPhone[0],'The game could not start');
});
