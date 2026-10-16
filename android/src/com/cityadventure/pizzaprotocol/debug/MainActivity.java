package com.cityadventure.pizzaprotocol.debug;

import android.app.Activity;
import android.app.AlertDialog;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import android.widget.FrameLayout;
import android.widget.TextView;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/** Offline debug shell. No permissions, JavaScript bridge, ads, accounts or remote content. */
public final class MainActivity extends Activity {
    private WebView web;
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(0xff142c40);
        root.setOnApplyWindowInsetsListener((v, insets) -> {
            v.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                    insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets;
        });
        setContentView(root);
        web = new WebView(this);
        root.addView(web, new FrameLayout.LayoutParams(-1, -1));
        web.setBackgroundColor(0xff142c40);
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
                return true; // the game has no navigation out of its bundled document
            }
        });
        try (InputStream input = getAssets().open("game.html")) {
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            byte[] block = new byte[16384];
            int n;
            while ((n = input.read(block)) != -1) buffer.write(block, 0, n);
            String html = new String(buffer.toByteArray(), StandardCharsets.UTF_8);
            web.loadDataWithBaseURL("https://appassets.androidplatform.net/", html, "text/html", "UTF-8", null);
        } catch (Exception error) {
            TextView message = new TextView(this);
            message.setText("Impossibile caricare il capitolo. Reinstalla l’APK di test.");
            message.setTextColor(0xffffffff);
            message.setPadding(24, 48, 24, 24);
            root.addView(message);
        }
        root.requestApplyInsets();
    }
    private void pauseGame() {
        if (web != null) web.evaluateJavascript("window.dispatchEvent(new Event('citynativepause'));", null);
    }
    @Override protected void onPause() {
        pauseGame();
        if (web != null) { web.onPause(); web.pauseTimers(); }
        super.onPause();
    }
    @Override protected void onResume() {
        super.onResume();
        if (web != null) { web.resumeTimers(); web.onResume(); }
    }
    @Override public void onBackPressed() {
        pauseGame();
        new AlertDialog.Builder(this).setTitle("Tornare al telefono?")
            .setMessage("Il progresso resta salvato su questo dispositivo.")
            .setPositiveButton("Esci", (dialog, which) -> finish())
            .setNegativeButton("Resta", (dialog, which) -> dialog.dismiss()).show();
    }
    @Override protected void onDestroy() {
        if (web != null) { web.destroy(); web = null; }
        super.onDestroy();
    }
}
