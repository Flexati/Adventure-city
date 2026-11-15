// Storage integrity is independent of campaign schema 7. Legacy campaign keys are never read.
export function progressChecksum(text){
 let hash=0x811c9dc5;
 for(let i=0;i<text.length;i++)hash=Math.imul(hash^text.charCodeAt(i),0x01000193)>>>0;
 return hash.toString(16).padStart(8,'0');
}
export function createProgressStore({storage,key,serialize,deserialize}){
 const backupKey=key+'.backup';
 const decode=raw=>{
  if(!raw)return null;
  try{
   const data=JSON.parse(raw),integrity=data.integrity;
   if(integrity!==undefined){
    delete data.integrity;
    if(integrity?.algorithm!=='fnv1a32-utf16'||integrity.checksum!==progressChecksum(JSON.stringify(data)))return null;
   }
   return deserialize(JSON.stringify(data));
  }catch{return null;}
 };
 const encode=value=>{
  const data=JSON.parse(serialize(value));
  if(!deserialize(JSON.stringify(data)))throw new Error('Invalid campaign checkpoint');
  data.integrity={algorithm:'fnv1a32-utf16',checksum:progressChecksum(JSON.stringify(data))};
  return JSON.stringify(data);
 };
 return {
  read(){
   try{
    const store=storage(),primary=store.getItem(key),current=decode(primary);
    if(current)return {progress:current,source:'primary'};
    const backup=store.getItem(backupKey),recovered=decode(backup);
    if(recovered)return {progress:recovered,source:'backup'};
    return {progress:null,source:primary||backup?'corrupt':'none'};
   }catch{return {progress:null,source:'unavailable'};}
  },
  write(value,{newGame=false}={}){
   try{
    const store=storage(),next=encode(value),previous=store.getItem(key);
    // Each setItem is atomic. If either write fails, a previously valid checkpoint survives.
    // A deliberate new game seeds both slots with its own initial checkpoint.
    if(newGame||!decode(previous)&&!decode(store.getItem(backupKey)))store.setItem(backupKey,next);
    else if(decode(previous))store.setItem(backupKey,previous);
    store.setItem(key,next);
    return {ok:true,progress:decode(next)};
   }catch{return {ok:false,progress:null};}
  }
 };
}
