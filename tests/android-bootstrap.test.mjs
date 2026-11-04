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
