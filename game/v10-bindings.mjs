// Explicit event bindings. Integration does not promote prototype quality.
export const V10_SFX_BINDINGS=Object.freeze({
 ui:{assetId:'ui.menu.ui_feedback_family',path:'audio/v10/ui.menu.ui_feedback_family.ogg',gain:.18,spacing:.06},
 choice:{assetId:'ui.dialogue.ui_feedback_family',path:'audio/v10/ui.dialogue.ui_feedback_family.ogg',gain:.23,spacing:.1},
 dash:{assetId:'ability.dash.ability_sfx_family',path:'audio/v10/ability.dash.ability_sfx_family.ogg',gain:.3,spacing:.09},
 perfectDodge:{assetId:'ability.perfect_dodge.ability_sfx_family',path:'audio/v10/ability.perfect_dodge.ability_sfx_family.ogg',gain:.35,spacing:.1},
 duo:{assetId:'ability.duo.ability_sfx_family',path:'audio/v10/ability.duo.ability_sfx_family.ogg',gain:.35,spacing:.1},
 'shot:c9':{assetId:'weapon.c9.weapon_sfx_family',path:'audio/v10/weapon.c9.weapon_sfx_family.ogg',gain:.32,spacing:.04},
 'shot:vx9':{assetId:'weapon.vx9.weapon_sfx_family',path:'audio/v10/weapon.vx9.weapon_sfx_family.ogg',gain:.28,spacing:.04},
 'shot:r12':{assetId:'weapon.r12.weapon_sfx_family',path:'audio/v10/weapon.r12.weapon_sfx_family.ogg',gain:.38,spacing:.04},
 'shot:h17':{assetId:'weapon.h17.weapon_sfx_family',path:'audio/v10/weapon.h17.weapon_sfx_family.ogg',gain:.35,spacing:.04},
 'shot:arc7':{assetId:'weapon.arc7.weapon_sfx_family',path:'audio/v10/weapon.arc7.weapon_sfx_family.ogg',gain:.32,spacing:.04}
});
export function v10ShotEvent(event){return event.type==='shot'?`shot:${event.weapon||'c9'}`:null;}
