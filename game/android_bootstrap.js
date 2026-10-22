/* ES5 deliberately: report incompatible WebView syntax before the game starts. */
(function () {
  var interval, timeout;
  function problem(message) {
    if (document.getElementById('startup-recovery')) return;
    window.clearInterval(interval);
    window.clearTimeout(timeout);
    var box = document.createElement('section');
    box.id = 'startup-recovery';
    box.style.cssText = 'position:fixed;inset:0;z-index:1000;background:#0b1525;color:#edf7ff;padding:28px;display:flex;align-items:center;justify-content:center;font:16px system-ui,sans-serif';
    var card = document.createElement('div'); card.style.cssText = 'max-width:480px';
    var title = document.createElement('h2'); title.textContent = 'Il gioco non è riuscito a partire';
    var detail = document.createElement('p'); detail.textContent = message;
    var hint = document.createElement('p'); hint.textContent = 'Se il problema continua, aggiorna Android System WebView o Chrome dal Play Store e riapri CHRONOS: Nox & Lulù.';
    var retry = document.createElement('button'); retry.textContent = 'Riprova';
    retry.onclick = function () { window.location.reload(); };
    card.appendChild(title); card.appendChild(detail); card.appendChild(hint); card.appendChild(retry);
    box.appendChild(card); document.body.appendChild(box);
  }
  window.addEventListener('error', function (event) {
    var target = event.target;
    if (target && target.tagName === 'SCRIPT') problem('Una risorsa del gioco non è stata caricata.');
    else if (event.message) problem('Errore di avvio: ' + String(event.message).slice(0, 220));
  }, true);
  window.addEventListener('unhandledrejection', function () {
    if (!window.cityAdventure) problem('Inizializzazione interrotta. Riprova.');
  });
  timeout = window.setTimeout(function () {
    if (!window.cityAdventure || !window.cityAdventure.status().loaded)
      problem('Il caricamento delle risorse locali non è terminato.');
  }, 20000);
  interval = window.setInterval(function () {
    if (window.cityAdventure && window.cityAdventure.status().loaded) {
      window.clearInterval(interval); window.clearTimeout(timeout);
    }
  }, 250);
  window.addEventListener('pagehide', function () { window.clearInterval(interval); window.clearTimeout(timeout); });
}());
