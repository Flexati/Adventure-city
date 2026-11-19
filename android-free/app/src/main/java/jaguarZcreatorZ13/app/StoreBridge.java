package jaguarZcreatorZ13.app;

import android.app.Activity;
import android.content.SharedPreferences;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import java.util.Collections;
import java.util.List;
import org.json.JSONObject;

/**
 * R54 (D95): the purchase of the FREE app, one non-consumable product ({@value #PRODUCT}) that unlocks every act after the
 * first. Compiled only into the free app (android-free/); the paid app has no billing library and never loads this class.
 *
 * It is the page's {@code ChronosStore}: state() answers one JSON object {entitled, status, price}, buy() and restore() start
 * the flows, and every change is announced to the page as a {@code chronosstore} event (the page then reads state() again).
 * The page can ask for a purchase but never grants one: «entitled» is set here, only from a PURCHASED purchase that Google Play
 * reports for this product, and it is cleared when an authoritative query finds none (a refund, another account).
 *
 * No server: the entitlement is cached on the device so the game still opens offline after the purchase; the cache is
 * re-checked with Google Play at every start and every resume. Purchases are acknowledged within seconds (Google refunds
 * an unacknowledged purchase after three days). A PENDING purchase unlocks nothing until it turns PURCHASED.
 */
public final class StoreBridge implements StoreHook.Handle {
    static final String NAME = "ChronosStore";
    static final String PRODUCT = "unlock_full_game";
    private static final String PREFS = "chronos_store";
    private static final String KEY_ENTITLED = "entitled";

    private final Activity activity;
    private final WebView web;
    private final SharedPreferences prefs;
    private BillingClient client;
    private ProductDetails details;
    private volatile boolean closed;
    private volatile boolean entitled;
    private volatile boolean connected;
    private volatile String status = "loading";
    private volatile String price;

    private StoreBridge(Activity activity, WebView web) {
        this.activity = activity;
        this.web = web;
        this.prefs = activity.getSharedPreferences(PREFS, Activity.MODE_PRIVATE);
        this.entitled = prefs.getBoolean(KEY_ENTITLED, false);
        if (entitled) status = "owned";
    }

    /** Called by StoreHook by name, on the main thread, before the page loads. */
    public static StoreHook.Handle attach(Activity activity, WebView web) {
        // First of all, before anything of Billing is touched: the page's proof that this is the free app. If the store then fails
        // in any way, the page still sees «free» and keeps Act II locked.
        web.addJavascriptInterface(new Edition(), "ChronosEdition");
        StoreBridge bridge = new StoreBridge(activity, web);
        web.addJavascriptInterface(bridge, NAME);
        bridge.connect();
        return bridge;
    }

    /** window.ChronosEdition.edition() answers "free". The paid app has no such bridge. */
    static final class Edition {
        @JavascriptInterface
        public String edition() {
            return "free";
        }
    }

    // ---- what the page may call (JavaBridge thread) ---------------------------------------------------------------

    /** {"entitled":bool,"status":"loading|ready|purchasing|pending|owned|canceled|notfound|error|unavailable","price":"5,99 €"|null} */
    @JavascriptInterface
    public String state() {
        try {
            JSONObject o = new JSONObject();
            o.put("entitled", entitled);
            o.put("status", entitled ? "owned" : status);
            o.put("price", price == null ? JSONObject.NULL : price);
            return o.toString();
        } catch (Exception e) {
            return "{\"entitled\":false,\"status\":\"error\",\"price\":null}";
        }
    }

    @JavascriptInterface
    public void buy() {
        activity.runOnUiThread(this::launchPurchase);
    }

    @JavascriptInterface
    public void restore() {
        activity.runOnUiThread(() -> {
            if (!ready()) { connect(); return; }
            set("loading");
            queryProduct();
            queryOwned(true);
        });
    }

    // ---- Handle (main thread) -------------------------------------------------------------------------------------

    @Override public void onResume() {
        // Google Play advises a purchase query on every resume: a pending purchase may have completed meanwhile.
        if (ready()) queryOwned(false);
        else if (!closed && (client == null || !connected)) connect();
    }

    @Override public void close() {
        closed = true;
        try { if (client != null) client.endConnection(); } catch (RuntimeException ignored) { }
        client = null;
    }

    // ---- Billing --------------------------------------------------------------------------------------------------

    private boolean ready() {
        return client != null && connected && client.isReady();
    }

    private void connect() {
        if (closed) return;
        try {
            if (client == null) {
                client = BillingClient.newBuilder(activity)
                        .setListener((result, purchases) -> onPurchasesUpdated(result, purchases))
                        .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
                        .enableAutoServiceReconnection()
                        .build();
            }
            client.startConnection(new BillingClientStateListener() {
                @Override public void onBillingSetupFinished(BillingResult result) {
                    if (closed) return;
                    if (result.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                        connected = true;
                        queryProduct();
                        queryOwned(false);
                    } else {
                        connected = false;
                        set("unavailable");
                    }
                }
                @Override public void onBillingServiceDisconnected() {
                    connected = false; // auto reconnection is on; the next call or resume reconnects
                }
            });
        } catch (RuntimeException e) {
            set("unavailable");
        }
    }

    private void queryProduct() {
        QueryProductDetailsParams.Product product = QueryProductDetailsParams.Product.newBuilder()
                .setProductId(PRODUCT).setProductType(BillingClient.ProductType.INAPP).build();
        client.queryProductDetailsAsync(
                QueryProductDetailsParams.newBuilder().setProductList(Collections.singletonList(product)).build(),
                (result, productDetails) -> {
                    if (closed) return;
                    List<ProductDetails> list = productDetails == null ? null : productDetails.getProductDetailsList();
                    if (result.getResponseCode() == BillingClient.BillingResponseCode.OK && list != null && !list.isEmpty()) {
                        details = list.get(0);
                        ProductDetails.OneTimePurchaseOfferDetails offer = details.getOneTimePurchaseOfferDetails();
                        price = offer == null ? null : offer.getFormattedPrice();
                        if (!entitled && "loading".equals(status)) set("ready");
                        else notifyPage();
                    } else {
                        details = null; // product not created or not active yet in the Play Console
                        if (!entitled) set("unavailable");
                    }
                });
    }

    /** authoritative: the user asked (Restore), so «nothing found» is an answer worth showing. */
    private void queryOwned(boolean userAsked) {
        client.queryPurchasesAsync(
                QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build(),
                (result, purchases) -> {
                    if (closed) return;
                    if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                        // Could not ask Google: keep what the device already knows, never take an unlock away on a failed call.
                        if (!entitled) set("error");
                        return;
                    }
                    applyPurchases(purchases, true, userAsked);
                });
    }

    private void onPurchasesUpdated(BillingResult result, List<Purchase> purchases) {
        if (closed) return;
        switch (result.getResponseCode()) {
            case BillingClient.BillingResponseCode.OK:
                applyPurchases(purchases, false, false);
                break;
            case BillingClient.BillingResponseCode.USER_CANCELED:
                set("canceled");
                break;
            case BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED:
                if (ready()) queryOwned(false); // the purchase exists: ask for it, then unlock
                break;
            case BillingClient.BillingResponseCode.BILLING_UNAVAILABLE:
            case BillingClient.BillingResponseCode.SERVICE_UNAVAILABLE:
            case BillingClient.BillingResponseCode.SERVICE_DISCONNECTED:
            case BillingClient.BillingResponseCode.NETWORK_ERROR:
                set("unavailable");
                break;
            default:
                set("error");
        }
    }

    private void applyPurchases(List<Purchase> purchases, boolean authoritative, boolean userAsked) {
        boolean owned = false, pending = false;
        if (purchases != null) {
            for (Purchase p : purchases) {
                if (!p.getProducts().contains(PRODUCT)) continue;
                if (p.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
                    owned = true;
                    if (!p.isAcknowledged()) acknowledge(p);
                } else if (p.getPurchaseState() == Purchase.PurchaseState.PENDING) {
                    pending = true;
                }
            }
        }
        if (owned) {
            setEntitled(true);
        } else if (pending) {
            set("pending");
        } else if (authoritative) {
            setEntitled(false); // Google Play says there is none: a refund, or another account
            set(userAsked ? "notfound" : (details != null ? "ready" : "unavailable"));
        }
    }

    private void acknowledge(Purchase purchase) {
        client.acknowledgePurchase(
                AcknowledgePurchaseParams.newBuilder().setPurchaseToken(purchase.getPurchaseToken()).build(),
                result -> { /* the purchase is already unlocked; a failed acknowledge is retried by the next query */ });
    }

    private void launchPurchase() {
        if (closed || entitled) return;
        if (!ready() || details == null) {
            set("unavailable");
            connect();
            return;
        }
        set("purchasing");
        try {
            BillingFlowParams params = BillingFlowParams.newBuilder()
                    .setProductDetailsParamsList(Collections.singletonList(
                            BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(details).build()))
                    .build();
            BillingResult result = client.launchBillingFlow(activity, params);
            if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                onPurchasesUpdated(result, null);
            }
        } catch (RuntimeException e) {
            set("error");
        }
    }

    // ---- State ----------------------------------------------------------------------------------------------------

    private void setEntitled(boolean value) {
        entitled = value;
        prefs.edit().putBoolean(KEY_ENTITLED, value).apply();
        if (value) status = "owned";
        notifyPage();
    }

    private void set(String next) {
        if (entitled && !"owned".equals(next)) next = "owned";
        status = next;
        notifyPage();
    }

    private void notifyPage() {
        if (closed) return;
        activity.runOnUiThread(() -> {
            if (!closed && web != null) {
                web.evaluateJavascript("window.dispatchEvent(new Event('chronosstore'));", null);
            }
        });
    }
}
