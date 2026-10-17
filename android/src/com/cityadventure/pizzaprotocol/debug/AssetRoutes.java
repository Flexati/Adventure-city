package com.cityadventure.pizzaprotocol.debug;
/** Explicit APK allowlist; no arbitrary paths or network fallbacks. */
final class AssetRoutes {
    private AssetRoutes() { }
    static String path(String scheme, String host, int port, String path) {
        if (!"https".equals(scheme) || !"appassets.androidplatform.net".equals(host)
                || (port != -1 && port != 443) || path == null) return null;
        if ("/game/index.html".equals(path) || "/game/app.js".equals(path)
                || "/game/bootstrap.js".equals(path) || "/game/style.css".equals(path)) return path.substring(1);
        if (path.matches("/game/art/(city|port|clinic|fracture|walk|enemies|car|combat)\\.png")
                || path.matches("/game/assets/(hub|boss|hit|zara|dodge|duo|choice)\\.ogg")) return path.substring(1);
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
