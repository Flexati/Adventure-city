# V10 automated asset validation

Reproduce: `.venv-v10/bin/python tools/v10_asset_pack/audit.py`

Full per-file metrics and findings: `artifacts/v10/asset-audit.json`.

```json
{
  "head_before": "84d2e45ca752e62aa491b022fb239b04c2c62ce1",
  "audited_head": "84d2e45ca752e62aa491b022fb239b04c2c62ce1",
  "generator_head": "cb26253ac4f83ba019a90912c699aa8651a439c1",
  "pack_files": 570,
  "asset_requirements": 442,
  "integrated_samples": 10,
  "commercial_ready": 0,
  "classifications": {
    "REJECT": 432,
    "NEW": 10
  },
  "file_errors": [
    {
      "file": "01_REFERENCE_CANON/CHRONOS_V85_LATEST_ART_BOARDS_18.zip",
      "error": "File is not a zip file"
    },
    {
      "file": "01_REFERENCE_CANON/CHRONOS_V85_LATEST_ART_BOARDS_MASTER_PREVIEW.webp",
      "error": "cannot identify image file '/workspace/chronos-v10-integration/generated/CHRONOS_V10_ASSET_PRODUCTION_PACK/01_REFERENCE_CANON/CHRONOS_V85_LATEST_ART_BOARDS_MASTER_PREVIEW.webp'"
    }
  ],
  "checksum_errors": [],
  "manifest_failures": [],
  "unreferenced_media": [],
  "runtime_orphans": [],
  "duplicate_file_groups": [
    [
      "02_CHARACTERS_SPRITES/character.bran_kess.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.dario.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.elena.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.eren.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.eve_prime.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.ilyra.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.ines.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.ivo.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.kairn.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.lulu.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.maelis.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.mara.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.mira.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.morrow.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.neris.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.nox.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.oren.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.rika_dorn.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.sia.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.tarek.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.tessa.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.tomas_vale.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.unit9.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.vesper.sprite_animation_set.json",
      "02_CHARACTERS_SPRITES/character.veyra.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/boss.anchor.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/boss.archon.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/boss.bone_tyrant.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/boss.custode.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/boss.eve_prime.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/boss.forge_behemoth.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/boss.helix.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/boss.lamplight_king.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/boss.parallax.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/boss.ram.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/boss.rook.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/boss.root_engine.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/boss.sera_venn.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/boss.shadow_reaper.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/boss.twelfth_observer.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/boss.vega.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/boss.volkov.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/enemy.anchor_beast.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/enemy.binder.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/enemy.breaker.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/enemy.carrier.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/enemy.choir.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/enemy.drifter.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/enemy.echo.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/enemy.enforcer.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/enemy.glassback.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/enemy.prism.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/enemy.raider.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/enemy.seraph.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/enemy.signal_tech.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/enemy.skitter.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/enemy.spitter.sprite_animation_set.json",
      "03_BOSSES_ENEMIES/enemy.warden.sprite_animation_set.json",
      "04_WEAPONS_ABILITIES/ability.axis_spine.action_animation.json",
      "04_WEAPONS_ABILITIES/ability.barrier.action_animation.json",
      "04_WEAPONS_ABILITIES/ability.black_pulse.action_animation.json",
      "04_WEAPONS_ABILITIES/ability.counter.action_animation.json",
      "04_WEAPONS_ABILITIES/ability.dash.action_animation.json",
      "04_WEAPONS_ABILITIES/ability.duo.action_animation.json",
      "04_WEAPONS_ABILITIES/ability.duo_switch.action_animation.json",
      "04_WEAPONS_ABILITIES/ability.final_sync.action_animation.json",
      "04_WEAPONS_ABILITIES/ability.heal.action_animation.json",
      "04_WEAPONS_ABILITIES/ability.heavy_strike.action_animation.json",
      "04_WEAPONS_ABILITIES/ability.melee.action_animation.json",
      "04_WEAPONS_ABILITIES/ability.node_override.action_animation.json",
      "04_WEAPONS_ABILITIES/ability.null_driver.action_animation.json",
      "04_WEAPONS_ABILITIES/ability.perfect_dodge.action_animation.json",
      "04_WEAPONS_ABILITIES/ability.pulse.action_animation.json",
      "04_WEAPONS_ABILITIES/ability.resonance.action_animation.json",
      "04_WEAPONS_ABILITIES/ability.resonance_arc.action_animation.json",
      "04_WEAPONS_ABILITIES/ability.tag_actions.action_animation.json",
      "04_WEAPONS_ABILITIES/ability.tether.action_animation.json",
      "04_WEAPONS_ABILITIES/ability.weapon_counter.action_animation.json",
      "06_REGIONS_RACES_PROPS/mission.exp_borrowed_light.scene_staging_animation.json",
      "06_REGIONS_RACES_PROPS/mission.exp_chalk_marks.scene_staging_animation.json",
      "06_REGIONS_RACES_PROPS/mission.exp_interrupted_shift.scene_staging_animation.json",
      "06_REGIONS_RACES_PROPS/motif.chalk.authored_gesture_sequence.json",
      "06_REGIONS_RACES_PROPS/motif.final_hand.authored_gesture_sequence.json",
      "06_REGIONS_RACES_PROPS/motif.free_seat.authored_gesture_sequence.json",
      "06_REGIONS_RACES_PROPS/motif.interrupted_hand.authored_gesture_sequence.json",
      "06_REGIONS_RACES_PROPS/motif.returned_light.authored_gesture_sequence.json",
      "06_REGIONS_RACES_PROPS/motif.two_knocks.authored_gesture_sequence.json",
      "06_REGIONS_RACES_PROPS/motif.unused_channel.authored_gesture_sequence.json",
      "06_REGIONS_RACES_PROPS/prop.borrowed_lamp.interaction_animation.json",
      "06_REGIONS_RACES_PROPS/prop.chalk_sign.interaction_animation.json",
      "06_REGIONS_RACES_PROPS/prop.glass_shard.interaction_animation.json",
      "06_REGIONS_RACES_PROPS/prop.helios_valve.interaction_animation.json",
      "06_REGIONS_RACES_PROPS/prop.lightline.interaction_animation.json",
      "06_REGIONS_RACES_PROPS/prop.medkit.interaction_animation.json",
      "06_REGIONS_RACES_PROPS/prop.switchyard.interaction_animation.json",
      "06_REGIONS_RACES_PROPS/prop.time_window.interaction_animation.json"
    ],
    [
      "05_UI_HUD/ui.ability.original_icon_states_or_layout.png",
      "05_UI_HUD/ui.ability.ui_feedback_family.png"
    ],
    [
      "05_UI_HUD/ui.dialogue.original_icon_states_or_layout.png",
      "05_UI_HUD/ui.dialogue.ui_feedback_family.png"
    ],
    [
      "05_UI_HUD/ui.dodge.original_icon_states_or_layout.png",
      "05_UI_HUD/ui.dodge.ui_feedback_family.png"
    ],
    [
      "05_UI_HUD/ui.duo.original_icon_states_or_layout.png",
      "05_UI_HUD/ui.duo.ui_feedback_family.png"
    ],
    [
      "05_UI_HUD/ui.fire.original_icon_states_or_layout.png",
      "05_UI_HUD/ui.fire.ui_feedback_family.png"
    ],
    [
      "05_UI_HUD/ui.gadget.original_icon_states_or_layout.png",
      "05_UI_HUD/ui.gadget.ui_feedback_family.png"
    ],
    [
      "05_UI_HUD/ui.heal.original_icon_states_or_layout.png",
      "05_UI_HUD/ui.heal.ui_feedback_family.png"
    ],
    [
      "05_UI_HUD/ui.health_bar.original_icon_states_or_layout.png",
      "05_UI_HUD/ui.health_bar.ui_feedback_family.png"
    ],
    [
      "05_UI_HUD/ui.inventory.original_icon_states_or_layout.png",
      "05_UI_HUD/ui.inventory.ui_feedback_family.png"
    ],
    [
      "05_UI_HUD/ui.joystick.original_icon_states_or_layout.png",
      "05_UI_HUD/ui.joystick.ui_feedback_family.png"
    ],
    [
      "05_UI_HUD/ui.menu.original_icon_states_or_layout.png",
      "05_UI_HUD/ui.menu.ui_feedback_family.png"
    ],
    [
      "05_UI_HUD/ui.pause_settings.original_icon_states_or_layout.png",
      "05_UI_HUD/ui.pause_settings.ui_feedback_family.png"
    ],
    [
      "05_UI_HUD/ui.race_result.original_icon_states_or_layout.png",
      "05_UI_HUD/ui.race_result.ui_feedback_family.png"
    ],
    [
      "05_UI_HUD/ui.recovery.original_icon_states_or_layout.png",
      "05_UI_HUD/ui.recovery.ui_feedback_family.png"
    ],
    [
      "05_UI_HUD/ui.reload.original_icon_states_or_layout.png",
      "05_UI_HUD/ui.reload.ui_feedback_family.png"
    ],
    [
      "05_UI_HUD/ui.save.original_icon_states_or_layout.png",
      "05_UI_HUD/ui.save.ui_feedback_family.png"
    ],
    [
      "05_UI_HUD/ui.shop.original_icon_states_or_layout.png",
      "05_UI_HUD/ui.shop.ui_feedback_family.png"
    ],
    [
      "05_UI_HUD/ui.vehicle.original_icon_states_or_layout.png",
      "05_UI_HUD/ui.vehicle.ui_feedback_family.png"
    ],
    [
      "06_REGIONS_RACES_PROPS/race.ash_docks.route_signal_visuals.png",
      "06_REGIONS_RACES_PROPS/race.ash_docks.track_visual_states.png"
    ],
    [
      "06_REGIONS_RACES_PROPS/race.ash_night.route_signal_visuals.png",
      "06_REGIONS_RACES_PROPS/race.ash_night.track_visual_states.png"
    ],
    [
      "06_REGIONS_RACES_PROPS/race.ash_slalom.route_signal_visuals.png",
      "06_REGIONS_RACES_PROPS/race.ash_slalom.track_visual_states.png"
    ],
    [
      "06_REGIONS_RACES_PROPS/race.ash_switchyard.route_signal_visuals.png",
      "06_REGIONS_RACES_PROPS/race.ash_switchyard.track_visual_states.png"
    ],
    [
      "06_REGIONS_RACES_PROPS/race.aurelia_span.route_signal_visuals.png",
      "06_REGIONS_RACES_PROPS/race.aurelia_span.track_visual_states.png"
    ],
    [
      "06_REGIONS_RACES_PROPS/race.noctis_lightline.route_signal_visuals.png",
      "06_REGIONS_RACES_PROPS/race.noctis_lightline.track_visual_states.png"
    ],
    [
      "06_REGIONS_RACES_PROPS/race.solkara.route_signal_visuals.png",
      "06_REGIONS_RACES_PROPS/race.solkara.track_visual_states.png"
    ],
    [
      "06_REGIONS_RACES_PROPS/race.solkara_regularity.route_signal_visuals.png",
      "06_REGIONS_RACES_PROPS/race.solkara_regularity.track_visual_states.png"
    ],
    [
      "06_REGIONS_RACES_PROPS/race.solkara_storm.route_signal_visuals.png",
      "06_REGIONS_RACES_PROPS/race.solkara_storm.track_visual_states.png"
    ],
    [
      "06_REGIONS_RACES_PROPS/race.veyra_duel.route_signal_visuals.png",
      "06_REGIONS_RACES_PROPS/race.veyra_duel.track_visual_states.png"
    ]
  ],
  "oversized_textures": [],
  "sfx_decoded_bytes": 970200,
  "commercial_release": "BLOCKED",
  "limits": [
    "Technical checks are not artistic, listening, legal, physical-device or human-playtest approval.",
    "Rejected is a shipping decision; not all images were individually viewed.",
    "One sample does not fulfill all events of an SFX family."
  ]
}
```

Atlas inspection covers dimensions, row bounds, pivots, duplicate frames and alpha bounds. Foot anchoring, facing, face/costume drift and choreography still require visual QA. Audio inspection measures decoded PCM, peak/RMS and boundary discontinuity; it is not loudness mastering or listening approval. The canonical V8.5 WebP/ZIP decode errors are retained as blockers. No reference board enters the APK.
