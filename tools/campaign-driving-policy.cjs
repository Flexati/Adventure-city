// Read-only test driver. Hold the brake through pickup instead of oscillating at its speed limit.
module.exports=function drivingKeys(d){
 const stop=d.stops.find(x=>!x.done);let best=null;
   for(const lane of [170,265,360,455,550]){let cost=Math.abs(lane-d.x)/250;if(d.hazards.some(h=>!h.hit&&(d.mode!=='dark'||h.seen||h.at-d.distance<300)&&h.at>d.distance-60&&h.at<d.distance+560&&Math.abs(h.x-lane)<60))cost+=10;if(d.strikes.some(k=>!k.done&&Math.abs(k.x-lane)<62))cost+=8;if(stop&&stop.at-d.distance<1300)cost+=Math.abs(stop.x-lane)/40;if(!best||cost<best.cost)best={lane,cost};}
   const want=new Set();if(best.lane-d.x>14)want.add('KeyD');if(best.lane-d.x< -14)want.add('KeyA');const hold=stop&&d.index===2&&stop.at-d.distance<420&&stop.at-d.distance> -100;
   if(hold){if(stop.at-d.distance<=150||d.speed>40)want.add('KeyS');else want.add('KeyW');}else want.add('KeyW');if(d.mode==='dark')want.add('KeyP');return want;
};
