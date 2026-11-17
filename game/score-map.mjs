// R46 (D91): the map of the score, so the music can follow the game instead of restarting. Sections and tempos come
// from the R38 score files (assets/production/r38/audio/<piece>-score.json, 4/4 everywhere); a test keeps them equal.
// Data only: it travels in world.js.
const piece=(bpm,bars,sections)=>({bpm,bars,sections});
export const SCORE_MAP={
 archon:piece(138,64,{trono:0,pressione:8,eroi:16,archon:32,scontro:40,crollo:56}),
 boss:piece(132,56,{ingresso:0,minaccia:8,eroi:16,'fase due':32,'assalto finale':40}),
 danger:piece(140,64,{assalto:0,pressione:8,tema:16,respiro:32,contrattacco:40,ritorno:56}),
 danger_b:piece(150,64,{assalto:0,pressione:8,tema:16,respiro:32,contrattacco:40,ritorno:56}),
 depths:piece(92,44,{discesa:0,mercato:12,ingranaggi:24,quiete:36}),
 drive:piece(128,48,{partenza:0,rettilineo:8,tema:16,tunnel:32,uscita:40}),
 eve:piece(120,52,{archivio:0,indice:16,specchio:32,silenzio:44}),
 lulu:piece(108,48,{mattino:0,corsa:16,aperto:32,respiro:40}),
 nox:piece(100,48,{ombra:0,passo:16,caccia:32}),
 promise:piece(72,24,{domanda:0,risposta:8,insieme:16}),
 race:piece(152,64,{griglia:0,sorpasso:16,tema:32,'ultimo giro':48}),
 refuge:piece(80,32,{casa:0,vita:8,insieme:16,sera:24}),
 reunion:piece(76,32,{ritorno:0,'promessa mantenuta':8,'noi due':16,casa:24}),
 title:piece(96,40,{orologio:0,risveglio:8,tema:16,promessa:32}),
 vega:piece(120,48,{metronomo:0,rottura:16,duello:32})
};
// Pieces that carry on where they were left (to the start of that four-bar phrase) instead of opening again: going
// from exploring to a fight and back no longer replays the same first bars. Story pieces, bosses and races keep their
// opening, because the opening is the point.
export const MUSIC_RESUME=['nox','lulu','depths','eve','danger','danger_b','drive','refuge'];
// A boss phase moves its piece to the section written for it, and from there it loops: the fight never falls back
// to the calm opening. Index 0 is phase 1 (two thirds of health), index 1 is phase 2 (one third).
export const PHASE_MUSIC={boss:['fase due','assalto finale'],archon:['archon','scontro'],vega:['rottura','duello'],eve:['indice','specchio']};
// In the bond moments each one hears the other: Lulú's voice on the radio brings her theme, Lulú at the chalk wall
// brings his. The five endings each close on their own piece.
export const MOMENT_MUSIC={radio_dark:'lulu',chalk_word:'nox'};
export const ENDING_MUSIC={ora_nuova:'title',alba:'reunion',attesa:'promise',compagni:'refuge',strade:'nox'};
// R47 (D92): the adaptive families of the v5 score (Argon, deliveries/argon-musica-adattiva-v5-20261117). One piece in three
// full versions (calm, alert, fight) with the same length, tempo, key and bars, so the game swaps them at the same point and
// the player hears one piece that grows and settles. The tempo and sections come from the delivered score files; a test keeps
// them equal. Only the families that exist are listed: a stage without one keeps the R38 pieces.
export const FAMILIES={vanta_est:piece(102,44,{pioggia_gru:0,passo_nox:12,risonanza_rele:24,ritorno_ombra:36})};
export const INTENSITIES=['calma','allerta','scontro'];
export const STAGE_FAMILY={blackout:'vanta_est',app_yard:'vanta_est',city:'vanta_est'};
// 'vanta_est_scontro' -> 'vanta_est'; any other piece -> null.
export const familyOf=p=>{const m=/^(.+)_(calma|allerta|scontro)$/.exec(p||'');return m&&FAMILIES[m[1]]?m[1]:null;};
export const pieceMap=p=>SCORE_MAP[p]||FAMILIES[familyOf(p)]||null;
// The music a stage opens with: its family at rest, or its authored cue.
export const stageMusic=step=>STAGE_FAMILY[step?.id]?STAGE_FAMILY[step.id]+'_calma':step?.music;
