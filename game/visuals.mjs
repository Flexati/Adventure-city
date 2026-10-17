// Four equally spaced frames per row. Atlas metadata is kept outside the renderer.
export const DISTRICT_ART=['gang_states','alien_states','infected_states','custodian_states'];
export const DISTRICT_MAPS=['city','port','clinic','fracture'];
export const MUSIC_CUES=['blackout','breach','contagion','zero'];
export function heroFrame(s,actor,name,partner=false){
 const dir=(!partner&&s.action?.dir)||s.face;
 if(!partner&&s.status==='failed')return {atlas:name+'_actions',row:2,col:3,flip:dir.x<0};
 if(!partner&&s.hurtAnim>0)return {atlas:name+'_actions',row:1,col:Math.min(3,Math.floor((.28-s.hurtAnim)/.28*4)),flip:dir.x<0};
 if(s.duoAnim>0)return {atlas:name+'_actions',row:3,col:Math.min(3,Math.floor((.65-s.duoAnim)/.65*4)),flip:dir.x<0};
 if(!partner&&s.dash>0)return {atlas:name+'_actions',row:0,col:Math.min(3,Math.floor((.18-s.dash)/.18*4)),flip:dir.x<0};
 if(!partner&&s.action)return {atlas:name+'_'+s.action.kind,row:Math.abs(dir.x)>.45&&dir.y<-.5?3:Math.abs(dir.x)>.55?0:dir.y<0?1:2,col:Math.min(3,Math.floor(s.action.t/s.action.duration*4)),flip:dir.x<0};
 return {atlas:name+'_walk',row:Math.abs(dir.x)>.4?2:dir.y<0?1:0,col:Math.floor(actor.walk)%4,flip:dir.x<0};
}
export function enemyFrame(e,level){
 const atlas=DISTRICT_ART[level];
 if(e.hp<=0)return {atlas,row:3,col:Math.min(3,Math.floor((.7-e.deathAnim)/.7*4)),flip:e.face<0};
 if(e.hurtAnim>0)return {atlas,row:2,col:Math.min(3,Math.floor((.24-e.hurtAnim)/.24*4)),flip:e.face<0};
 if(e.state==='warn')return {atlas,row:1,col:Math.min(1,Math.floor(e.clock/(e.boss?1.4:1)*2)),flip:e.face<0};
 if(e.state==='recover'&&e.clock<.4)return {atlas,row:1,col:e.clock<.15?2:3,flip:e.face<0};
 return {atlas,row:0,col:Math.floor(e.walk)%4,flip:e.face<0};
}
