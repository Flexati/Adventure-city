package com.cityadventure.pizzaprotocol.debug;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.DisplayCutout;
import android.view.View;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.json.JSONObject;

/** Offline shell: stream APK assets, never pass a giant HTML string to WebView. */
public final class MainActivity extends Activity {
    private static final String ENTRY = "https://appassets.androidplatform.net/game/index.html";
    private WebView web;
    private FrameLayout root;
    private TextView loading;
    private boolean destroyed;
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        root = new FrameLayout(this);
        root.setBackgroundColor(0xff0b1525);
        root.setOnApplyWindowInsetsListener((v, insets) -> {
            int left = insets.getSystemWindowInsetLeft(), top = insets.getSystemWindowInsetTop();
            int right = insets.getSystemWindowInsetRight(), bottom = insets.getSystemWindowInsetBottom();
            // R37: edge to edge (targetSdk 35+), a camera cutout on the side in landscape (the drive) is not a system bar.
            DisplayCutout cut = Build.VERSION.SDK_INT >= 28 ? insets.getDisplayCutout() : null;
            if (cut != null) {
                left = Math.max(left, cut.getSafeInsetLeft()); top = Math.max(top, cut.getSafeInsetTop());
                right = Math.max(right, cut.getSafeInsetRight()); bottom = Math.max(bottom, cut.getSafeInsetBottom());
            }
            v.setPadding(left, top, right, bottom);
            return insets;
        });
        setContentView(root);
        root.addOnLayoutChangeListener((v, l, t, r, b, ol, ot, or, ob) -> excludeBackGesture(v));
        startWebView();
        root.requestApplyInsets();
    }
    /** R37: the joystick works anywhere (rule 8), so a drag that starts at the left or right edge became the system Back
     *  gesture: the game lost the touch and the exit dialog opened mid-fight. The thumb zones stay with the game; Android
     *  honours at most 200 dp per edge, and Back still works from the upper part of the edges and from the back button. */
    private void excludeBackGesture(View v) {
        if (Build.VERSION.SDK_INT < 29) return;
        int w = v.getWidth(), bottom = v.getHeight() - v.getPaddingBottom();
        if (w <= 0 || bottom <= 0) return;
        float dp = getResources().getDisplayMetrics().density;
        int edge = Math.round(48 * dp), top = Math.max(v.getPaddingTop(), bottom - Math.round(200 * dp));
        List<Rect> zones = new ArrayList<>();
        zones.add(new Rect(0, top, edge, bottom));
        zones.add(new Rect(w - edge, top, w, bottom));
        v.setSystemGestureExclusionRects(zones);
    }
    private void startWebView() {
        root.removeAllViews();
        loading = new TextView(this);
        loading.setText("Chronos Adventure: Nox & Lulú\nCaricamento del quartiere…");
        loading.setTextColor(0xffedf7ff);
        loading.setTextSize(20);
        loading.setPadding(28, 64, 28, 28);
        try {
            boolean debuggable = (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0;
            WebView.setWebContentsDebuggingEnabled(debuggable);
            web = new WebView(this);
            root.addView(web, new FrameLayout.LayoutParams(-1, -1));
            root.addView(loading);
            web.setBackgroundColor(0xff0b1525);
            WebSettings cfg = web.getSettings();
            cfg.setJavaScriptEnabled(true);
            cfg.setDomStorageEnabled(true);
            cfg.setAllowFileAccess(false);
            cfg.setAllowContentAccess(false);
            cfg.setBlockNetworkLoads(true);
            cfg.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
            cfg.setMediaPlaybackRequiresUserGesture(false); // R30 (D74): menu music and the intro roar start without a touch
            cfg.setSupportZoom(false);
            // R37: the WebView scales text by the phone's font size on its own, inside buttons and panels measured in pixels.
            // Text stays at 100%; the page gets fontScale and turns on its tested big-text mode instead (versionScript).
            cfg.setTextZoom(100);
            web.setWebViewClient(new WebViewClient() {
                @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                    return !ENTRY.equals(request.getUrl().toString());
                }
                @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                    Uri uri = request.getUrl();
                    String path = AssetRoutes.path(uri.getScheme(), uri.getHost(), uri.getPort(), uri.getPath());
                    if (path == null || !"GET".equals(request.getMethod())) return failure(403, "Blocked");
                    try {
                        String mime = AssetRoutes.mime(path);
                        return new WebResourceResponse(mime, mime.startsWith("text/") || mime.equals("application/javascript") ? "UTF-8" : null,
                                200, "OK", Collections.singletonMap("Cache-Control", "no-cache"), getAssets().open(path));
                    } catch (IOException error) { return failure(404, "Missing asset"); }
                }
                @Override public void onPageFinished(WebView view, String url) {
                    if (view == web && loading != null) loading.setVisibility(View.GONE);
                    if (view == web) view.evaluateJavascript(versionScript(), null);
                }
                @Override public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                    if (view == web && request.isForMainFrame()) showFailure("La pagina iniziale non è stata caricata.");
                }
                @Override public void onReceivedHttpError(WebView view, WebResourceRequest request, WebResourceResponse response) {
                    if (view == web && request.isForMainFrame())
                        showFailure("La pagina iniziale non è disponibile. Riprova.");
                }
                @Override public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                    if (view != web) return true;
                    root.removeView(view);
                    if (web == view) web = null;
                    view.destroy();
                    showFailure("Il motore grafico si è arrestato. Chiudi le altre app e riprova.");
                    return true;
                }
            });
            web.loadUrl(ENTRY);
        } catch (RuntimeException error) {
            disposeWebView();
            showFailure("Impossibile inizializzare Android System WebView.\n" + error.getClass().getSimpleName());
        }
    }
    /** Credits show the installed build: values only, the page gets no bridge into Java. */
    private String versionScript() {
        String name = "?";
        long code = 0;
        try {
            PackageInfo info = getPackageManager().getPackageInfo(getPackageName(), 0);
            if (info.versionName != null) name = info.versionName;
            code = Build.VERSION.SDK_INT >= 28 ? info.getLongVersionCode() : info.versionCode;
        } catch (PackageManager.NameNotFoundException ignored) { }
        float scale = getResources().getConfiguration().fontScale;
        return "window.chronosAppVersion={name:" + JSONObject.quote(name) + ",code:" + code + ",fontScale:" + (scale > 0 ? scale : 1)
                + "};window.dispatchEvent(new Event('chronosversion'));";
    }
    private static WebResourceResponse failure(int code, String reason) {
        return new WebResourceResponse("text/plain", "UTF-8", code, reason,
                Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
    }
    private void showFailure(String reason) {
        if (destroyed) return;
        disposeWebView();
        root.removeAllViews();
        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setPadding(28, 64, 28, 28);
        TextView message = new TextView(this);
        message.setTextColor(0xffedf7ff);
        message.setTextSize(17);
        String provider = "";
        try {
            PackageInfo info = WebView.getCurrentWebViewPackage();
            if (info != null) provider = "\nWebView: " + info.versionName;
        } catch (RuntimeException ignored) { }
        message.setText("Chronos Adventure: Nox & Lulú\n\n" + reason
                + "\n\nSe persiste, aggiorna Android System WebView o Chrome dal Play Store." + provider);
        card.addView(message);
        Button retry = new Button(this);
        retry.setText("Riprova");
        retry.setContentDescription("Riprova caricamento gioco");
        retry.setOnClickListener(v -> { disposeWebView(); startWebView(); });
        card.addView(retry);
        root.addView(card, new FrameLayout.LayoutParams(-1, -1));
    }
    private void pauseGame() {
        if (web != null) web.evaluateJavascript("window.dispatchEvent(new Event('citynativepause'));", null);
    }
    private void resumeGame() {
        if (web != null) web.evaluateJavascript("window.dispatchEvent(new Event('citynativeresume'));", null);
    }
    @Override protected void onPause() {
        pauseGame();
        if (web != null) { web.onPause(); web.pauseTimers(); }
        super.onPause();
    }
    @Override protected void onResume() {
        super.onResume();
        if (web != null) { web.resumeTimers(); web.onResume(); resumeGame(); }
    }
    @Override public void onBackPressed() {
        pauseGame();
        new AlertDialog.Builder(this).setTitle("Tornare al telefono?")
            .setMessage("Il progresso resta salvato su questo dispositivo.")
            .setOnCancelListener(dialog -> resumeGame())
            .setPositiveButton("Esci", (dialog, which) -> finish())
            .setNegativeButton("Resta", (dialog, which) -> { dialog.dismiss(); resumeGame(); }).show();
    }
    private void disposeWebView() {
        if (web != null) { WebView old = web; web = null; root.removeView(old); old.destroy(); }
    }
    @Override protected void onDestroy() {
        destroyed = true;
        disposeWebView();
        super.onDestroy();
    }
}
