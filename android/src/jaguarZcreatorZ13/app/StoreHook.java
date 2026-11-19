package jaguarZcreatorZ13.app;

import android.app.Activity;
import android.webkit.WebView;

/**
 * R55 (D95): the one place where the shell learns that it is the FREE edition. The free app is the same code under another
 * applicationId ({@code jaguarZcreatorZ13.app.free}); only then is the purchase bridge looked for, by name, so the paid app
 * never loads a billing class and has no billing library inside it. The free app's StoreBridge also registers {@code ChronosEdition},
 * which the paid app does not have: the page locks Act II only when it finds it (the paid app registers no second bridge).
 */
final class StoreHook {
    static final String FREE_SUFFIX = ".free";
    static final String STORE_CLASS = "jaguarZcreatorZ13.app.StoreBridge";

    /** What the activity needs from the purchase bridge: be told about resume and teardown. */
    interface Handle {
        void onResume();
        void close();
    }

    private StoreHook() { }

    static boolean isFree(String packageName) {
        return packageName != null && packageName.endsWith(FREE_SUFFIX);
    }

    /** The purchase bridge of the free app (registered as ChronosStore on the page), or null in the paid app. */
    static Handle attach(Activity activity, WebView web) {
        if (!isFree(activity.getPackageName())) return null;
        try {
            return (Handle) Class.forName(STORE_CLASS)
                    .getMethod("attach", Activity.class, WebView.class).invoke(null, activity, web);
        } catch (Throwable ignored) {
            return null;
        }
    }
}
