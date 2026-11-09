package com.cityadventure.pizzaprotocol.debug;
/** Explicit APK allowlist; no arbitrary paths or network fallbacks. */
final class AssetRoutes {
    private AssetRoutes() { }
    static String path(String scheme, String host, int port, String path) {
        if (!"https".equals(scheme) || !"appassets.androidplatform.net".equals(host)
                || (port != -1 && port != 443) || path == null) return null;
        if ("/game/index.html".equals(path) || "/game/app.js".equals(path)
                || "/game/bootstrap.js".equals(path) || "/game/style.css".equals(path)) return path.substring(1);
        if (path.matches("/game/audio/v10/(chalk_route|chalk_scrape|heal_seal|rook_line|rook_aim|rook_shot|rook_mine|rook_burst|rook_disarm|tessa_workbench|tessa_case|weapon_switch|weapon_reload|vx9_shot|r12_shot|quickdraw_ready|kairn_impact|morrow_saw|morrow_shot|strangers_rift|anchor_moor|anchor_exposed|anchor_relink|anchor_line_tension|anchor_sweep|anchor_line_cut|anchor_weight|anchor_fight_loop|race_checkpoint|race_container_hit|race_finish|veyra_championship|veyra_championship_night|race_count_beep|race_go|refuge_theme|promise_theme|title_theme)\\.ogg")
                || path.matches("/game/video/jaguarzcreatorz-(720|1080)\\.mp4")
                || path.matches("/game/art/v05/(nox_walk|lulu_walk|nox_actions|lulu_actions|nox_gun|lulu_gun|nox_magic|lulu_magic|gang_states|alien_states|infected_states|custodian_states|fx_atlas|weapon_icons|district_props|menu_keyart|driving_cars|driving_road)\\.png")
                || path.matches("/game/audio/v05/(blackout|breach|contagion|zero|driving|hit|zara|dodge|duo|choice)\\.ogg")
                || path.matches("/game/art/chrono/(environment|effects|purple_guard|chrono_overlord|blacksmith|civilian|innkeeper|merchant|mechanic|masked_informant|potion_alchemist|relic_priestess|scavenger_kid|traveling_bard|toxic_mutant_zombie|interiors)\\.png")
                || path.matches("/game/audio/chrono/(old_town|cathedral|toxic_market|clockwork|impact|chrono_energy|boss_collapse|save|suspense_boss)\\.ogg")
                || path.matches("/game/art/v09/(reunion|chalk_flask|chalk_flask_states|rook|tessa)\\.png")
                || path.matches("/game/art/v10/(nox_vx9_gun|lulu_r12_gun|nox_vx9_reload|lulu_r12_reload|nox_h17_gun|nox_h17_reload|lulu_arc7_gun|lulu_arc7_reload|kairn|morrow|anchor_core|anchor_bollards|vfx_c9|vfx_vx9|vfx_r12|race_veyra_car|race_rival02_car|race_rival03_car|race_(obstacle|crane|pad|slick|barrier|finish)_[a-z0-9_]+|race_container|race_container_hit|race_container_ruggine|race_container_ruggine_hit|race_container_cobalto|race_container_cobalto_hit|race_container_verde|race_container_verde_hit|race_ashdocks_(banchina|gru|deposito)_(day|night)|race_cp_active|race_cp_passed|portrait_kairn|portrait_morrow|portrait_veyra|anchor_cable|anchor_cable_end|anchor_sweep|race_cp_pylon|race_cp_pylon_passed|race_cp_tape|race_cp_tape_passed|facciate_(moon|cathedral|toxic|clockwork))\\.png")
                || path.matches("/game/art/interiors/(moon_(inn|smith|shop)|cathedral_(smith|relic|shop|info)|toxic_(smith|alchemist|shop|info)|clockwork_(smith|shop|relic|info))\\.webp")
                || path.matches("/game/art/npc/(bran_kess|dario|elena|eren|eve_prime|ilyra|ines|ivo|lia|maelis|mara|neris|oren|rika_dorn|tarek|tomas_vale|vesper)\\.jpg")
                || path.matches("/game/art/brand/vanta-clock(-still)?\\.webp")
                || path.matches("/game/art/v09/(warm|tentative|fragile|chalk_route|medseal)\\.svg")
                || path.matches("/game/audio/v09/(nox|lulu|danger|reunion)\\.ogg")
                || path.matches("/game/art/v08/portraits\\.png")
                || path.matches("/game/audio/v08/(nox|lulu|danger|reunion)\\.ogg")
                || path.matches("/game/art/(city|port|clinic|fracture|car)\\.png")) return path.substring(1);
        return null;
    }
    static String mime(String path) {
        if (path.endsWith(".html")) return "text/html";
        if (path.endsWith(".js")) return "application/javascript";
        if (path.endsWith(".css")) return "text/css";
        if (path.endsWith(".svg")) return "image/svg+xml";
        if (path.endsWith(".png")) return "image/png";
        if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
        if (path.endsWith(".webp")) return "image/webp";
        if (path.endsWith(".mp4")) return "video/mp4";
        if (path.endsWith(".ogg")) return "audio/ogg";
        return "application/octet-stream";
    }
}

