// R52 (D93): what the system Back button does on the screens that block the story. Until now none of them was known to
// window.__chronosBack, so Back fell through to the pause test (blocked while the screen holds the input lock) and then to
// the «Tornare al telefono?» dialog in the middle of a story beat.
//
// Rules, one per screen. «Nothing» still means the Back press is HANDLED (the caller returns true): returning false is what
// opens the exit dialog.
//  - field-kit   Tessa's gift: story weapons come only from here, a skip would lose them for the run. Nothing.
//  - choice      A story choice or a village arc: a choice nobody made is not allowed to resolve itself. Nothing.
//  - city-choice The blackout choice (workshop or shelter). Nothing.
//  - knock       The knock the story waits for. Nothing.
//  - hold        The press-and-hold confirmation: the press in progress is cancelled (the bar empties), the screen stays.
//  - opening     The two knocks of the first night. The skip button exists only for a player who has seen it once (it
//                applies three story beats on their behalf), so: skip when it is on screen, otherwise nothing.
// visible(id): is the element with that id on screen. act: {skipOpening, cancelHold}. Returns the screen it handled, or
// null when none of them is open (the caller goes on with its usual order).
export const BACK_STORY_SCREENS=['opening','hold','field-kit','choice','knock','city-choice'];
export function backOnStoryScreen(visible,act){
 if(visible('opening')){if(visible('opening-skip'))act.skipOpening();return 'opening';}
 if(visible('hold')){act.cancelHold();return 'hold';}
 for(const id of ['field-kit','choice','knock','city-choice'])if(visible(id))return id;
 return null;
}
