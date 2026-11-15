// Q1 stability (R1, R2, R4): a fault never stops the frame loop, and repeated faults open the recovery panel.
// Diagnostics live in memory only (D25): nothing here is stored or leaves the device.
export function createFaultMonitor({limit=3,windowMs=5000,now=()=>Date.now()}={}){
 let total=0,last=null,times=[];
 const prune=at=>{times=times.filter(t=>at-t<windowMs);};
 return {
  record(error,source){
   const at=now();prune(at);times.push(at);total++;
   last={source:String(source),message:String(error?.message??error).slice(0,160)};
   return times.length>=limit?'recover':'continue';
  },
  status(){prune(now());return {total,recent:times.length,last:last?{...last}:null};}
 };
}
// The next frame is requested before the step runs, so an exception in the step cannot end the loop.
export function guardedFrame(step,schedule,onFault){
 const frame=t=>{schedule(frame);try{step(t);}catch(error){onFault(error);}};
 return frame;
}
