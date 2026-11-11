// HUD meters share one numeric model so DOM animation never becomes gameplay state.
export function meterModel(value,max,lowAt=.3){
 const safeMax=Number.isFinite(max)&&max>0?max:1;
 const current=Math.max(0,Math.min(safeMax,Number.isFinite(value)?value:0));
 const ratio=current/safeMax;
 return {current,max:safeMax,percent:ratio*100,low:current>0&&ratio<=lowAt,empty:current===0,full:current===safeMax};
}

const lagTimers=new WeakMap();
export function setVitalMeter(root,value,max,label,{lowAt=.3,immediate=false}={}){
 const model=meterModel(value,max,lowAt),previous=Number(root.dataset.value),previousMax=Number(root.dataset.max);
 const fill=root.querySelector('[data-meter-fill]'),lag=root.querySelector('[data-meter-lag]'),output=root.querySelector('output'),name=root.querySelector('[data-meter-label]');
 const width=model.percent+'%';
 fill.style.width=width;
 const pending=lagTimers.get(root);
 const changedMax=previousMax!==model.max;
 if(immediate||!Number.isFinite(previous)||changedMax||model.current>previous){
  if(pending)clearTimeout(pending);lagTimers.delete(root);lag.style.width=width;
 }else if(model.current<previous){
  if(pending)clearTimeout(pending);
  lagTimers.set(root,setTimeout(()=>{lag.style.width=width;lagTimers.delete(root);},350));
 }
 root.dataset.value=String(model.current);root.dataset.max=String(model.max);
 root.classList.toggle('low',model.low);root.classList.toggle('empty',model.empty);root.classList.toggle('full',model.full);
 const en=/ · (HEALTH|INTEGRITY)$/.test(label);
 const compactAlert=label.replace(/ · (VITA|INTEGRITÀ|HEALTH|INTEGRITY)$/u,model.low?en?' · LOW':' · BASSA':model.empty?' · ZERO':' · $1');
 name.textContent=model.low||model.empty?compactAlert:label;
 output.textContent=`${model.current} / ${model.max}`;
 root.setAttribute('aria-label',`${label}: ${model.current} ${en?'of':'su'} ${model.max}${model.low?en?', low':', livello basso':''}`);
 root.setAttribute('aria-valuemin','0');root.setAttribute('aria-valuemax',String(model.max));root.setAttribute('aria-valuenow',String(model.current));
 return model;
}
