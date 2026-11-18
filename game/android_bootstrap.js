/* ES5 deliberately: report incompatible WebView syntax before the game starts. */
(function () {
  var interval, timeout;
  // R52 (D93): the Android shell (NativeBridge, registered as window.ChronosNative before any page script runs) holds the saves
  // and the language it chose. Without the shell (a browser) there is no bridge and none of this runs.
  var NATIVE_KEYS = ['city-adventure-progress-v7', 'city-adventure-progress-v7.backup', 'city-v4-settings'];
  function nativeShell() {
    try {
      var shell = window.ChronosNative;
      return shell && typeof shell.get === 'function' ? shell : null;
    } catch (e) { return null; }
  }
  // Before the game reads a single key: a backup restored by Android brings back the shell's copy, the page's storage is
  // empty, and the settings and the saves must be there when the runtime starts (not after the first frame).
  function restoreFromNative() {
    var shell = nativeShell();
    if (!shell) return;
    for (var i = 0; i < NATIVE_KEYS.length; i++) {
      try {
        var key = NATIVE_KEYS[i];
        if (window.localStorage.getItem(key)) continue;
        var value = shell.get(key);
        if (typeof value === 'string' && value) window.localStorage.setItem(key, value);
      } catch (e) { }
    }
  }
  function nativeLanguage() {
    try {
      var shell = window.ChronosNative;
      var lang = shell && typeof shell.lang === 'function' ? shell.lang() : null;
      return lang === 'en' || lang === 'it' ? lang : null;
    } catch (e) { return null; }
  }
  restoreFromNative();
  // One rule for every language decision of the app (this screen, the game, the native dialogs): the choice saved in the
  // settings, else the language the shell chose, else the phone's. Italian only for it*; anything else, or nothing, is English.
  function isEnglish() {
    try {
      var raw = window.localStorage && window.localStorage.getItem('city-v4-settings');
      if (raw) {
        if (/"language"\s*:\s*"en"/.test(raw)) return true;
        if (/"language"\s*:\s*"it"/.test(raw)) return false;
      }
      var chosen = nativeLanguage();
      if (chosen) return chosen === 'en';
      var lang = window.navigator && (window.navigator.language || window.navigator.userLanguage);
      if (lang) return !/^it\b/i.test(String(lang));
    } catch (e) { }
    return true;
  }
  function problem(message) {
    if (document.getElementById('startup-recovery')) return;
    window.clearInterval(interval);
    window.clearTimeout(timeout);
    var en = isEnglish();
    var box = document.createElement('section');
    box.id = 'startup-recovery';
    box.style.cssText = 'position:fixed;inset:0;z-index:1000;background:#0b1525;color:#edf7ff;padding:28px;display:flex;align-items:center;justify-content:center;font:16px system-ui,sans-serif';
    var card = document.createElement('div'); card.style.cssText = 'max-width:480px';
    var title = document.createElement('h2'); title.textContent = en ? 'The game could not start' : 'Il gioco non è riuscito a partire';
    var detail = document.createElement('p'); detail.textContent = message;
    var hint = document.createElement('p'); hint.textContent = en
      ? 'If the problem continues, update Android System WebView or Chrome from the Play Store and reopen Chronos Adventure: Nox & Lulú.'
      : 'Se il problema continua, aggiorna Android System WebView o Chrome dal Play Store e riapri Chronos Adventure: Nox & Lulú.';
    var retry = document.createElement('button'); retry.textContent = en ? 'Retry' : 'Riprova';
    retry.onclick = function () { window.location.reload(); };
    card.appendChild(title); card.appendChild(detail); card.appendChild(hint); card.appendChild(retry);
    box.appendChild(card); document.body.appendChild(box);
  }
  // Same signal as the timeout and interval below. After the start the runtime's own fault panel owns errors.
  function started() {
    try { return !!(window.cityAdventure && window.cityAdventure.status().loaded); }
    catch (error) { return false; } // not confirmed as started: keep the startup behaviour
  }
  window.addEventListener('error', function (event) {
    var target = event.target;
    if (target && target.tagName === 'SCRIPT') problem(isEnglish() ? 'A game resource failed to load.' : 'Una risorsa del gioco non è stata caricata.');
    else if (event.message && !started()) problem((isEnglish() ? 'Startup error: ' : 'Errore di avvio: ') + String(event.message).slice(0, 220));
  }, true);
  window.addEventListener('unhandledrejection', function () {
    if (!window.cityAdventure) problem(isEnglish() ? 'Initialization interrupted. Please try again.' : 'Inizializzazione interrotta. Riprova.');
  });
  timeout = window.setTimeout(function () {
    if (!window.cityAdventure || !window.cityAdventure.status().loaded)
      problem(isEnglish() ? 'Loading local resources did not finish.' : 'Il caricamento delle risorse locali non è terminato.');
  }, 20000);
  interval = window.setInterval(function () {
    if (window.cityAdventure && window.cityAdventure.status().loaded) {
      window.clearInterval(interval); window.clearTimeout(timeout);
    }
  }, 250);
  window.addEventListener('pagehide', function () { window.clearInterval(interval); window.clearTimeout(timeout); });
}());
