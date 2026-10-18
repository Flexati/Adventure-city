package com.cityadventure.pizzaprotocol.debug;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.pm.PackageInfo;
import android.net.Uri;
import android.os.Bundle;
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
import java.util.Collections;

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
            v.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                    insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets;
        });
        setContentView(root);
        startWebView();
        root.requestApplyInsets();
    }
    private void startWebView() {
        root.removeAllViews();
        loading = new TextView(this);
        loading.setText("City Adventure\nCaricamento del quartiere…");
        loading.setTextColor(0xffedf7ff);
        loading.setTextSize(20);
        loading.setPadding(28, 64, 28, 28);
        try {
            WebView.setWebContentsDebuggingEnabled(true); // Test APK: enables CI to verify the real renderer.
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
            cfg.setMediaPlaybackRequiresUserGesture(true);
            cfg.setSupportZoom(false);
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
                    if (loading != null) loading.setVisibility(View.GONE);
                }
                @Override public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                    if (request.isForMainFrame()) showFailure("La pagina iniziale non è stata caricata.");
                }
                @Override public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
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
    private static WebResourceResponse failure(int code, String reason) {
        return new WebResourceResponse("text/plain", "UTF-8", code, reason,
                Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
    }
    private void showFailure(String reason) {
        if (destroyed) return;
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
        message.setText("City Adventure\n\n" + reason
                + "\n\nSe persiste, aggiorna Android System WebView o Chrome dal Play Store." + provider);
        card.addView(message);
        Button retry = new Button(this);
        retry.setText("Riprova");
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
