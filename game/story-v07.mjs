// Presentation-only v0.7 story copy. Persistent consequences belong in narrative.mjs.
export const V07_DIALOGUE={
 breach_helios_promise:[
  {speaker:'LULÙ',text:'Questo terminale riconosce la tua firma. Posso inviare una scansione profonda e chiedere una rotta pulita.'},
  {speaker:'NOX',text:'Non inviarla.'},
  {speaker:'LULÙ',text:'Va bene. Restiamo locali.'}
 ]
};

export function validateDialogue(lines){
 return Array.isArray(lines)&&lines.length>0&&lines.every(line=>
  line&&typeof line==='object'&&typeof line.speaker==='string'&&line.speaker.length>0&&
  typeof line.text==='string'&&line.text.length>0&&line.text.length<=240
 );
}
