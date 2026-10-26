// Pure mobile-input shaping shared by the browser module and flattened WebView bundle.
export const ACTIVATION_KEYS=new Set(['Space','Enter']);
export const GAME_KEYS=new Set(['KeyW','KeyA','KeyS','KeyD','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyJ','KeyL','KeyQ','KeyE','Space','ShiftLeft','KeyP','KeyV','KeyR']);
const finite=value=>Number.isFinite(value)?value:0;
const limit=(value,min,max)=>Math.max(min,Math.min(max,value));

export function radialControlVector(dx,dy,deadzone=8,radius=38){
 dx=finite(dx);dy=finite(dy);deadzone=Math.max(0,finite(deadzone));radius=Math.max(deadzone+.001,finite(radius));
 const magnitude=Math.hypot(dx,dy);
 if(magnitude<=deadzone)return {x:0,y:0};
 const strength=limit((magnitude-deadzone)/(radius-deadzone),0,1);
 return {x:dx/magnitude*strength,y:dy/magnitude*strength};
}

export function axialControlValue(delta,deadzone=5,radius=36){
 delta=finite(delta);deadzone=Math.max(0,finite(deadzone));radius=Math.max(deadzone+.001,finite(radius));
 const magnitude=Math.abs(delta);
 if(magnitude<=deadzone)return 0;
 return Math.sign(delta)*limit((magnitude-deadzone)/(radius-deadzone),0,1);
}

export function movementVector(stick,keys){
 let x=finite(stick?.x)+(keys?.has('KeyD')||keys?.has('ArrowRight')?1:0)-(keys?.has('KeyA')||keys?.has('ArrowLeft')?1:0);
 let y=finite(stick?.y)+(keys?.has('KeyS')||keys?.has('ArrowDown')?1:0)-(keys?.has('KeyW')||keys?.has('ArrowUp')?1:0);
 const magnitude=Math.hypot(x,y);if(magnitude>1){x/=magnitude;y/=magnitude;}
 return {x,y};
}

export const isActivationKey=code=>ACTIVATION_KEYS.has(code);
