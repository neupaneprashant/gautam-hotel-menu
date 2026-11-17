/*
 * Loads the latest menu from Firebase (Firestore) and, if it differs from the
 * copy built into the page, redraws the menu with it. One small request,
 * no Firebase library needed. If Firebase is off or unreachable, nothing changes.
 */
(function () {
  "use strict";
  var C = window.FIREBASE_CONFIG;
  if (!C || !C.projectId || !window.fetch || !window.MenuApp) return;
  var url = "https://firestore.googleapis.com/v1/projects/" + encodeURIComponent(C.projectId) +
    "/databases/(default)/documents/menu/current?key=" + encodeURIComponent(C.apiKey);
  if (window.__FIRESTORE_REST) url = window.__FIRESTORE_REST;        // tests (local emulator)
  fetch(url, { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (doc) {
      var f = doc && doc.fields && doc.fields.json && doc.fields.json.stringValue;
      if (!f) return;
      var menu = JSON.parse(f);
      if (!Array.isArray(menu) || !menu.length) return;
      if (JSON.stringify(menu) === JSON.stringify(window.MENU)) return;   // already up to date
      window.MenuApp.setMenu(menu);
    })
    .catch(function () { /* keep the built-in menu */ });
})();
