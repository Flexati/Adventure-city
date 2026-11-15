// Pure mobile-input shaping shared by the browser module and flattened WebView bundle.
export const ACTIVATION_KEYS=new Set(['Space','Enter']);
export const GAME_KEYS=new Set(['KeyW','KeyA','KeyS','KeyD','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyJ','KeyK','KeyL','KeyQ','KeyE','Space','ShiftLeft','KeyP','KeyV','KeyR']);
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
// C1 (D27): SCHIVA, DUO and ATTIVA act on touch-down. A click counts only with detail 0 (keyboard or assistive
// activation), so a touch that already acted on pointerdown does not act twice.
export const PRESS_ACTIONS=new Set(['dash','duo','interact']);
export const pressQueues=(type,detail)=>type==='pointerdown'||type==='click'&&detail===0;

// Gamepad, D27/N2: W3C "standard" mapping (https://w3c.github.io/gamepad/#remapping). Button indices are the
// standard ones; thresholds are the approved design values (CHRONOS_COMBATTIMENTO_P1_INPUT.md, 1.6).
export const PAD_BUTTONS=Object.freeze({gun:[0,7],dash:[1],magic:[2],duo:[3],switchWeapon:[4],interact:[5],reload:[12],heal:[13],pause:[9]});
export const PAD_TRIGGER=.3,PAD_MOVE_DEADZONE=.15,PAD_MOVE_FULL=.95,PAD_AIM_DEADZONE=.25;

export function padAxes(x,y,deadzone=PAD_MOVE_DEADZONE,full=PAD_MOVE_FULL){
 x=finite(x);y=finite(y);
 const magnitude=Math.hypot(x,y);
 if(magnitude<=deadzone)return {x:0,y:0};
 const strength=limit((magnitude-deadzone)/Math.max(.001,full-deadzone),0,1);
 return {x:x/magnitude*strength,y:y/magnitude*strength};
}

function padButton(pad,index){
 const button=pad?.buttons?.[index];if(button==null)return false;
 const value=finite(typeof button==='number'?button:button.value);
 // Analog triggers (6, 7) count from 30 % travel; digital buttons use the browser's pressed flag.
 if(index===6||index===7)return value>PAD_TRIGGER;
 return typeof button==='number'?value>.5:!!button.pressed||value>.5;
}

export const pickGamepad=list=>[...(list||[])].find(pad=>pad&&pad.connected!==false&&pad.mapping==='standard')||null;

export function readGamepad(pad){
 if(!pad||pad.connected===false||pad.mapping!=='standard')return null;
 const held={};for(const [action,indices] of Object.entries(PAD_BUTTONS))held[action]=indices.some(index=>padButton(pad,index));
 const move=padAxes(pad.axes?.[0],pad.axes?.[1]);
 const ax=finite(pad.axes?.[2]),ay=finite(pad.axes?.[3]),reach=Math.hypot(ax,ay);
 return {move,aim:reach>PAD_AIM_DEADZONE?{x:ax/reach,y:ay/reach}:null,held};
}

export function padEdges(previous,held){
 const pressed=[],released=[];
 for(const action of Object.keys(PAD_BUTTONS)){const now=!!held?.[action],before=!!previous?.[action];if(now&&!before)pressed.push(action);else if(!now&&before)released.push(action);}
 return {pressed,released};
}
