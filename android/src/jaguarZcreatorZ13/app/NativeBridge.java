package jaguarZcreatorZ13.app;

import android.content.SharedPreferences;
import android.webkit.JavascriptInterface;
import org.json.JSONObject;

/**
 * R52 (D93): the one door between the page and the shell, registered as {@code ChronosNative} before the page loads.
 *
 * It carries three things and nothing else: the language the shell has chosen, the three storage keys of the game (read at
 * start so a restored backup finds its saves), and one write call for them. Saves reached the shell as a GET query string
 * until now, which stops working when a save outgrows the longest URL; a JavaScript call has no such limit. Keys are on an
 * allow-list, sizes are capped, and a method never throws into the page. No purchase, no file, no network, no other state.
 */
final class NativeBridge {
    static final String NAME = "ChronosNative";
    static final String SAVE = "city-adventure-progress-v7";
    static final String BACKUP = "city-adventure-progress-v7.backup";
    static final String SETTINGS = "city-v4-settings";
    static final String LANG = "lang";
    /** Characters per value: far above a campaign save (a few hundred KB), far below a memory problem. */
    static final int MAX_VALUE = 8 * 1024 * 1024;

    /** The shell's own pick: the saved choice, otherwise the phone's language. */
    interface Language { boolean english(); }

    private final SharedPreferences prefs;
    private final Language language;

    NativeBridge(SharedPreferences prefs, Language language) {
        this.prefs = prefs;
        this.language = language;
    }

    static boolean allowed(String key) {
        return SAVE.equals(key) || BACKUP.equals(key) || SETTINGS.equals(key);
    }

    /** "en" or "it": the same answer the native dialogs use, so the first start of the game speaks the same language. */
    @JavascriptInterface
    public String lang() {
        try {
            return language.english() ? "en" : "it";
        } catch (RuntimeException ignored) {
            return "en";
        }
    }

    /** A stored value, or null: used once at start to put a restored backup back into the page's storage. */
    @JavascriptInterface
    public String get(String key) {
        if (!allowed(key)) return null;
        try {
            return prefs.getString(key, null);
        } catch (RuntimeException ignored) {
            return null;
        }
    }

    /** One JSON object with any of lang, save, backup, settings. Empty or oversized values are ignored, never stored. */
    @JavascriptInterface
    public void sync(String json) {
        if (json == null || json.isEmpty() || json.length() > 3 * MAX_VALUE) return;
        try {
            JSONObject in = new JSONObject(json);
            SharedPreferences.Editor ed = prefs.edit();
            String lang = in.isNull(LANG) ? "" : in.optString(LANG, "");
            if ("it".equals(lang) || "en".equals(lang)) ed.putString(LANG, lang);
            put(ed, in, "save", SAVE);
            put(ed, in, "backup", BACKUP);
            put(ed, in, "settings", SETTINGS);
            ed.apply();
        } catch (Exception ignored) {
            // A bad message from the page must never take the shell down.
        }
    }

    private static void put(SharedPreferences.Editor ed, JSONObject in, String field, String key) {
        if (in.isNull(field)) return;
        String value = in.optString(field, "");
        if (!value.isEmpty() && value.length() <= MAX_VALUE) ed.putString(key, value);
    }
}
