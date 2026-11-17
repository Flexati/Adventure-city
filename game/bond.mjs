// R45 (D90): the bond between Nox and Lulú. Four quiet moments (the cup at home, the radio in the dark, the chalk
// word, the lift to the Axis) plus three choices that already existed (the glass, the honest answer, the hand) give the
// heart a value. Like the reputation (R44) it is worked out from saved flags only: nothing new is stored beyond the
// choices themselves, and an old save that never saw the moments sits in the middle, which is the canon ending.
// Five endings come from the heart, the trust the game already keeps (thermal), and how the city went (R44).
// The player never sees a number: the moments end with «Lulú lo ricorderà», the Archive speaks in words.
export const BOND_MOMENTS={below:'radio_dark',city:'chalk_word'};
const HEART={home_cup:{hold:8,window:10,door:0},radio_dark:{answer:12,listen:6,off:-6},chalk_word:{wait:10,sorry:8,arrow:0},last_lift:{stay:14,free:6,quiet:0}};
export function bondOf(flags={}){
 let c=40;for(const [id,w] of Object.entries(HEART))c+=w[flags['bond.'+id]]||0;
 c+=flags.glass_truth===true?6:flags.glass_truth===false?-6:0;
 if(flags.promise_trust==='honest')c+=3;if(flags.hand_taken===true)c+=6;
 return Math.max(0,Math.min(100,Math.round(c)));
}
export const heartTier=v=>v>=65?'alta':v<=35?'bassa':'media';
// [id, Italian title, English title], from the rarest to the most distant.
export const ENDINGS=[['ora_nuova','Ora nuova','A New Hour'],['alba','L’alba insieme','Dawn Together'],['attesa','Te lo chiederò prima','I Will Ask You First'],['compagni','Compagni di strada','Companions on the Road'],['strade','Due strade','Two Roads']];
export function endingOf(flags={},thermal=50,rep={}){
 const h=heartTier(bondOf(flags));
 if(h==='alta'&&thermal>=60&&flags.hand_taken===true)return rep.quartieri>=65&&flags.unit9_saved&&flags.strangers_trust==='keep'?'ora_nuova':'alba';
 if(h==='alta')return 'attesa';
 return h==='bassa'?'strade':'compagni';
}
// In the finale, a high heart brings Lulú's «Sono qui» into the fight once (campaign.mjs hurtHero). Middle and low
// play the finale exactly as tuned.
export function applyBond(c,id,flags){if(id==='finale'&&heartTier(bondOf(flags))==='alta')c.loveAid=true;return c;}
