package com.cityadventure.pizzaprotocol.debug;
/** Explicit APK allowlist; no arbitrary paths or network fallbacks. */
final class AssetRoutes {
    private AssetRoutes() { }
    static String path(String scheme, String host, int port, String path) {
        if (!"https".equals(scheme) || !"appassets.androidplatform.net".equals(host)
                || (port != -1 && port != 443) || path == null) return null;
        if ("/game/index.html".equals(path) || "/game/app.js".equals(path)
                || "/game/bootstrap.js".equals(path) || "/game/style.css".equals(path)) return path.substring(1);
        if (path.matches("/game/art/v05/(nox_walk|lulu_walk|nox_actions|lulu_actions|nox_gun|lulu_gun|nox_magic|lulu_magic|gang_states|alien_states|infected_states|custodian_states|fx_atlas|weapon_icons|district_props|menu_keyart|driving_cars|driving_road)\\.png")
                || path.matches("/game/audio/v05/(title|blackout|breach|contagion|zero|driving|hit|zara|dodge|duo|choice)\\.ogg")
                || path.matches("/game/art/v08/portraits\\.png")
                || path.matches("/game/audio/v08/(nox|lulu|danger|reunion)\\.ogg")
                || path.matches("/game/art/(city|port|clinic|fracture|car)\\.png")) return path.substring(1);
        return null;
    }
    static String mime(String path) {
        if (path.endsWith(".html")) return "text/html";
        if (path.endsWith(".js")) return "application/javascript";
        if (path.endsWith(".css")) return "text/css";
        if (path.endsWith(".png")) return "image/png";
        if (path.endsWith(".ogg")) return "audio/ogg";
        return "application/octet-stream";
    }
}

