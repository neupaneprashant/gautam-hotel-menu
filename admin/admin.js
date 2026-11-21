/*
 * Gautam Hotel: menu admin.
 * Staff sign in with Firebase Authentication (email + password), edit the menu in a
 * form and Publish it to Firestore (menu/current); guests see the change right away.
 * Who may edit is decided by Firestore admins/{email} and enforced by firestore.rules.
 * A GitHub Action copies the published menu into menu-data.js + index.html for search engines.
 */
(function () {
  "use strict";

  var data = null, original = null, originalText = "";
  var bad = {};                       // input id -> true while its value is invalid

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ───────── helpers ───────── */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function toast(msg, opts) {
    opts = opts || {};
    var t = $("#toast");
    t.className = "toast" + (opts.bad ? " bad" : "");
    t.innerHTML = esc(msg) + (opts.action ? ' <button type="button">' + esc(opts.action) + "</button>" : "");
    t.hidden = false;
    if (opts.action) t.querySelector("button").onclick = function () { t.hidden = true; opts.onAction(); };
    clearTimeout(toast.timer);
    if (!opts.sticky) toast.timer = setTimeout(function () { t.hidden = true; }, opts.ms || 4000);
  }
  // menu-data.js writer lives in ../menu-format.js (shared with the GitHub sync job)
  var serialize = window.MenuFormat.serialize, itemJS = window.MenuFormat.itemJS;
  function tidy(it) { while (it.length > 2 && (it[it.length - 1] == null || it[it.length - 1] === "")) it.pop(); }
  /* ───────── prices ───────── */
  // single price box: "" -> null (Ask staff), "250" -> 250, "185/380" -> "185 / 380"
  function readSingle(raw) {
    var v = raw.trim();
    if (!v || /^ask( staff)?$/i.test(v)) return { ok: true, value: null };
    v = v.replace(/,/g, "").replace(/^rs\.?\s*/i, "");
    if (/^\d+$/.test(v)) return { ok: true, value: Number(v) };
    if (/^\d+(\s*\/\s*\d+)+$/.test(v)) return { ok: true, value: v.split("/").map(function (x) { return x.trim(); }).join(" / ") };
    return { ok: false };
  }
  // price-table box: "" -> null (not sold), "ask" -> "ask", "250" -> 250
  function readCell(raw) {
    var v = raw.trim().replace(/,/g, "").replace(/^rs\.?\s*/i, "");
    if (!v || v === "-" || v === "—") return { ok: true, value: null };
    if (/^ask$/i.test(v)) return { ok: true, value: "ask" };
    if (/^\d+$/.test(v)) return { ok: true, value: Number(v) };
    return { ok: false };
  }
  function showSingle(p) { return p === null || p === undefined || p === "ask" ? "" : String(p); }
  function showCell(p) { return p === null || p === undefined ? "" : String(p); }

  /* ───────── change tracking ───────── */
  // roughly "how many dishes/fields changed": the file has one line per dish
  function changeCount() {
    var a = originalText.split("\n"), b = serialize(data).split("\n");
    var left = {}, added = 0, removed = 0;
    a.forEach(function (l) { left[l] = (left[l] || 0) + 1; });
    b.forEach(function (l) { if (left[l]) left[l]--; else added++; });
    Object.keys(left).forEach(function (k) { removed += left[k]; });
    return Math.max(added, removed);
  }
  function refreshBar() {
    var n = changeCount(), invalid = Object.keys(bad).length;
    if (fbSeed && !invalid) {           // first time: the menu is not in Firebase yet
      $("#publishBar").classList.add("dirty");
      $("#changeCount").textContent = "Menu not in Firebase yet. Tap Publish once to move it there.";
      $("#publish").disabled = false; $("#discard").disabled = !n;
      return;
    }
    var bar = $("#publishBar");
    bar.classList.toggle("dirty", n > 0);
    $("#changeCount").textContent = invalid ? "Fix the price marked in red" : n ? n + (n === 1 ? " change" : " changes") + " not published" : "No changes";
    $("#publish").disabled = !n || invalid > 0;
    $("#discard").disabled = !n;
  }
  function markItemState(card, si, list, ii) {
    var origSec = original.filter(function (s) { return s.id === data[si].id; })[0];
    var cur = data[si][list][ii];
    var o = origSec && origSec[list] ? origSec[list].filter(function (x) { return x[0] === cur[0]; })[0] : null;
    card.classList.toggle("new", !o);
    card.classList.toggle("changed", !!o && itemJS(o) !== itemJS(cur));
  }

  // default Nepali names from ../nepali.js, shown as hints in the Nepali boxes
  function neDefault(sec, it) {
    var NE = window.MENU_NE;
    if (!NE) return "";
    return NE.items[sec.id + "|" + it[0]] || NE.items[it[0]] || "";
  }
  function neSection(sec) { var s = window.MENU_NE && window.MENU_NE.sections[sec.id]; return { title: s ? s[0] : "", tagline: s ? s[1] : "" }; }

  /* ───────── rendering ───────── */
  function itemHTML(sec, si, list, it, ii) {
    var base = 'data-si="' + si + '" data-list="' + list + '" data-ii="' + ii + '"';
    var isTable = list === "items" && (sec.cols || sec.sizes);
    var labels = sec.cols || sec.sizes || [];
    var price;
    if (isTable) {
      price = '<div class="cells">' + labels.map(function (lab, k) {
        var id = "p-" + si + "-" + list + "-" + ii + "-" + k;
        return '<div><label for="' + id + '">' + esc(lab) + '</label><input id="' + id + '" inputmode="numeric" ' + base +
          ' data-field="cell" data-k="' + k + '" value="' + esc(showCell((it[1] || [])[k])) + '" placeholder="—"></div>';
      }).join("") + "</div>";
    } else {
      var id1 = "p-" + si + "-" + list + "-" + ii;
      var cur = showSingle(it[1]);
      price = '<div class="price-row"><span class="rs">Rs</span><input id="' + id1 + '" ' + base + ' data-field="price" inputmode="' +
        (/\//.test(cur) ? "text" : "numeric") + '" value="' + esc(cur) + '" placeholder="Ask staff" aria-label="Price"></div>';
    }
    var diet = it[2] || "";
    return '<div class="item" ' + base + '>' +
      '<div class="item-row">' +
      '<input class="name" ' + base + ' data-field="name" value="' + esc(it[0]) + '" placeholder="Dish name" aria-label="Dish name">' +
      '<select ' + base + ' data-field="diet" aria-label="Veg or non-veg">' +
      [["", "No mark"], ["v", "🟢 Veg"], ["n", "🔴 Non-veg"], ["b", "Both"]].map(function (o) {
        return '<option value="' + o[0] + '"' + (o[0] === diet ? " selected" : "") + ">" + o[1] + "</option>";
      }).join("") + "</select>" +
      '<button class="icon-btn" type="button" data-act="item-up" ' + base + ' aria-label="Move up">↑</button>' +
      '<button class="icon-btn" type="button" data-act="item-down" ' + base + ' aria-label="Move down">↓</button>' +
      '<button class="icon-btn del" type="button" data-act="item-del" ' + base + ' aria-label="Delete dish">🗑</button>' +
      "</div>" + price +
      '<input class="desc" ' + base + ' data-field="desc" value="' + esc(it[3] || "") + '" placeholder="Description (optional)" aria-label="Description">' +
      '<input class="desc" ' + base + ' data-field="aliases" value="' + esc(it[4] || "") + '" placeholder="Also known as (optional), e.g. C momo, chicken dumpling" aria-label="Also known as">' +
      '<input class="desc ne" lang="ne" ' + base + ' data-field="ne" value="' + esc(it[5] || "") + '" placeholder="' +
        esc("नेपाली नाम" + (neDefault(sec, it) ? ": " + neDefault(sec, it) : " (optional)")) + '" aria-label="Nepali name">' +
      "</div>";
  }

  function sectionHTML(sec, si, open) {
    var count = sec.items.length + (sec.extra ? sec.extra.length : 0);
    var b = 'data-si="' + si + '"';
    var fields =
      '<div class="sec-fields">' +
      '<div><label>Section name</label><input ' + b + ' data-sfield="title" value="' + esc(sec.title) + '"></div>' +
      '<div><label>Shown under</label><select ' + b + ' data-sfield="group">' +
      '<option value="food"' + (sec.group === "food" ? " selected" : "") + '>Food</option>' +
      '<option value="drinks"' + (sec.group === "drinks" ? " selected" : "") + ">Drinks</option></select></div>" +
      '<div class="wide"><label>Line under the name</label><input ' + b + ' data-sfield="tagline" value="' + esc(sec.tagline || "") + '" placeholder="optional"></div>' +
      '<div><label>Section name in Nepali</label><input lang="ne" ' + b + ' data-sfield="title_ne" value="' + esc(sec.title_ne || "") + '" placeholder="' + esc(neSection(sec).title || "नेपाली नाम") + '"></div>' +
      '<div><label>Line under it in Nepali</label><input lang="ne" ' + b + ' data-sfield="tagline_ne" value="' + esc(sec.tagline_ne || "") + '" placeholder="' + esc(neSection(sec).tagline || "optional") + '"></div>' +
      '<div class="wide"><label>Note at the bottom</label><input ' + b + ' data-sfield="note" value="' + esc(sec.note || "") + '" placeholder="optional, e.g. Corkage charge 25%"></div>' +
      ((sec.cols || sec.sizes) ? '<div class="wide"><label>Price table columns (comma separated)</label><input ' + b + ' data-sfield="' +
        (sec.cols ? "cols" : "sizes") + '" value="' + esc((sec.cols || sec.sizes).join(", ")) + '"></div>' : "") +
      '<div class="sec-tools">' +
      '<button class="btn btn-small" type="button" data-act="sec-up" ' + b + '>↑ Move section up</button>' +
      '<button class="btn btn-small" type="button" data-act="sec-down" ' + b + '>↓ Move down</button>' +
      '<button class="btn btn-small" type="button" data-act="sec-del" ' + b + ' style="color:var(--bad)">Delete section</button>' +
      "</div></div>";
    var items = sec.items.map(function (it, ii) { return itemHTML(sec, si, "items", it, ii); }).join("");
    var add = '<button class="btn add-item" type="button" data-act="item-add" ' + b + ' data-list="items">+ Add dish to ' + esc(sec.title) + "</button>";
    var extra = "";
    if (sec.cols || sec.sizes) {
      extra = '<p class="list-title">Other items (one price each)</p>' +
        (sec.extra || []).map(function (it, ii) { return itemHTML(sec, si, "extra", it, ii); }).join("") +
        '<button class="btn add-item" type="button" data-act="item-add" ' + b + ' data-list="extra">+ Add single-price item</button>';
    }
    return '<details class="sec" data-si="' + si + '"' + (open ? " open" : "") + ">" +
      '<summary><span class="sec-name">' + esc(sec.title) + '</span><span class="badge">' + esc(sec.group) + "</span>" +
      '<span class="badge">' + count + "</span></summary>" +
      '<div class="sec-body">' + fields + items + add + extra + "</div></details>";
  }

  function render(keepOpen) {
    var open = {};
    if (keepOpen) $$(".sec[open]").forEach(function (d) { open[data[+d.dataset.si] ? data[+d.dataset.si].id : ""] = 1; });
    if (keepOpen && keepOpen.id) open[keepOpen.id] = 1;
    $("#sections").innerHTML = data.map(function (sec, si) { return sectionHTML(sec, si, open[sec.id]); }).join("");
    bad = {};
    $$(".item").forEach(function (card) { markItemState(card, +card.dataset.si, card.dataset.list, +card.dataset.ii); });
    applyFilter();
    refreshBar();
  }

  /* ───────── editing ───────── */
  function onInput(e) {
    var el = e.target, si = +el.dataset.si;
    if (isNaN(si) || !data[si]) return;
    var sec = data[si];
    if (el.dataset.sfield) {
      var f = el.dataset.sfield, v = el.value;
      if (f === "cols" || f === "sizes") {
        var labels = v.split(",").map(function (x) { return x.trim(); }).filter(Boolean);
        if (!labels.length) return;
        sec[f] = labels;
        sec.items.forEach(function (it) {
          var arr = Array.isArray(it[1]) ? it[1].slice(0, labels.length) : [];
          while (arr.length < labels.length) arr.push(null);
          it[1] = arr;
        });
        if (sec.defaultSize !== undefined && sec.defaultSize >= labels.length) sec.defaultSize = labels.length - 1;
        if (e.type === "change") render({ id: sec.id });
      } else if (f === "tagline" || f === "note" || f === "title_ne" || f === "tagline_ne") {
        if (v.trim()) sec[f] = v; else delete sec[f];
      } else {                                         // title or group
        sec[f] = v;
        if (f === "title") { var nameEl = el.closest(".sec").querySelector(".sec-name"); if (nameEl) nameEl.textContent = v; }
      }
      refreshBar();
      return;
    }
    var list = el.dataset.list, ii = +el.dataset.ii, it = sec[list] && sec[list][ii];
    if (!it) return;
    var field = el.dataset.field, r;
    if (field === "name") it[0] = el.value;
    else if (field === "desc") { it[3] = el.value.trim() ? el.value : null; tidy(it); }
    else if (field === "aliases") { while (it.length < 4) it.push(null); it[4] = el.value.trim() ? el.value : null; tidy(it); }
    else if (field === "ne") { while (it.length < 5) it.push(null); it[5] = el.value.trim() ? el.value.trim() : null; tidy(it); }
    else if (field === "diet") { it[2] = el.value || null; tidy(it); }
    else if (field === "price" || field === "cell") {
      r = field === "price" ? readSingle(el.value) : readCell(el.value);
      el.classList.toggle("invalid", !r.ok);
      if (r.ok) {
        delete bad[el.id];
        if (field === "price") it[1] = r.value;
        else { if (!Array.isArray(it[1])) it[1] = []; it[1][+el.dataset.k] = r.value; }
      } else bad[el.id] = true;
    }
    markItemState(el.closest(".item"), si, list, ii);
    refreshBar();
  }

  function slug(t) {
    var base = t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section", s = base, n = 2;
    while (data.some(function (x) { return x.id === s; })) s = base + "-" + n++;
    return s;
  }

  function onClick(e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    var act = b.dataset.act, si = +b.dataset.si, sec = data[si];
    if (act.indexOf("item-") === 0) {
      var list = b.dataset.list, ii = +b.dataset.ii;
      if (act === "item-add") {
        if (!sec[list]) sec[list] = [];
        var labels = sec.cols || sec.sizes;
        var diet = sec.group === "food" ? (sec.items[0] && sec.items[0][2]) || undefined : undefined;
        var it = ["", list === "items" && labels ? labels.map(function () { return null; }) : null];
        if (diet) it.push(diet);
        sec[list].push(it);
        render({ id: sec.id });
        var cards = $$('.item[data-si="' + si + '"][data-list="' + list + '"]');
        var last = cards[cards.length - 1];
        if (last) { last.scrollIntoView({ block: "center" }); last.querySelector(".name").focus(); }
        return;
      }
      var arr = sec[list];
      if (act === "item-del") {
        var name = arr[ii][0] || "this dish";
        if (!confirm("Delete “" + name + "” from " + sec.title + "?")) return;
        arr.splice(ii, 1);
      } else if (act === "item-up" && ii > 0) { arr.splice(ii - 1, 0, arr.splice(ii, 1)[0]); }
      else if (act === "item-down" && ii < arr.length - 1) { arr.splice(ii + 1, 0, arr.splice(ii, 1)[0]); }
      else return;
      render({ id: sec.id });
      return;
    }
    if (act === "sec-del") {
      if (!confirm("Delete the whole “" + sec.title + "” section and its " + sec.items.length + " items?")) return;
      data.splice(si, 1);
    } else if (act === "sec-up" && si > 0) { data.splice(si - 1, 0, data.splice(si, 1)[0]); }
    else if (act === "sec-down" && si < data.length - 1) { data.splice(si + 1, 0, data.splice(si, 1)[0]); }
    else return;
    render({ id: sec && sec.id });
  }

  /* admin search uses the same smart search as the menu */
  function applyFilter() {
    var q = $("#filter").value.trim();
    var tokens = q && window.MenuSearch ? window.MenuSearch.parse(q) : [];
    $$(".sec").forEach(function (d) {
      var sec = data[+d.dataset.si], any = false;
      $$(".item", d).forEach(function (card) {
        var it = sec[card.dataset.list][+card.dataset.ii];
        var hit = !q || (window.MenuSearch ? window.MenuSearch.matches(tokens, it, sec) : it[0].toLowerCase().indexOf(q.toLowerCase()) !== -1);
        card.classList.toggle("filtered-out", !hit);
        any = any || hit;
      });
      d.classList.toggle("filtered-out", !!q && !any);
      if (q && any) d.open = true;
    });
  }

  var signedInAs = "";
  function normEmail(e) { return String(e || "").trim().toLowerCase(); }

  /* ───────── new section dialog ───────── */
  function openNewSection() {
    var d = $("#sectionDialog");
    $("#sectionForm").reset(); $("#nsColsWrap").hidden = true;
    if (d.showModal) d.showModal(); else d.setAttribute("open", "");
  }
  $("#nsType").addEventListener("change", function () { $("#nsColsWrap").hidden = this.value !== "cols"; });
  $("#sectionDialog").addEventListener("close", function () {
    if (this.returnValue !== "ok") return;
    var title = $("#nsTitle").value.trim();
    if (!title) return;
    var sec = { id: slug(title), group: $("#nsGroup").value, title: title, items: [] };
    if ($("#nsTagline").value.trim()) sec.tagline = $("#nsTagline").value.trim();
    if ($("#nsType").value === "cols") {
      var cols = $("#nsCols").value.split(",").map(function (x) { return x.trim(); }).filter(Boolean);
      if (cols.length) sec.cols = cols;
    }
    // place it at the end of its group
    var at = data.length;
    if (sec.group === "food") { for (var i = 0; i < data.length; i++) if (data[i].group !== "food") { at = i; break; } }
    data.splice(at, 0, sec);
    render({ id: sec.id });
    var el = $('.sec[data-si="' + at + '"]');
    if (el) { el.scrollIntoView({ block: "start" }); }
    toast("Section added. Now add dishes to it, then Publish.");
  });

  /* ═══════════ Firebase ═══════════
   *   Firebase Authentication (email + password)  -> who can sign in
   *   Firestore admins/{email} {role}              -> who may edit (enforced by firestore.rules)
   *   Firestore menu/current {json, version, …}    -> the live menu guests load
   *   Firestore menuHistory                         -> every published version
   * A GitHub Action copies menu/current into menu-data.js + index.html for search engines. */
  var CFG = window.FIREBASE_CONFIG, FIREBASE = !!(CFG && CFG.projectId);
  var FB = null, fbVersion = 0, fbSeed = false, fbRole = "editor", fbEntering = false;
  var SDK = "https://www.gstatic.com/firebasejs/10.14.1/";

  function fbInit() {
    if (FB) return Promise.resolve(FB);
    return Promise.all([import(SDK + "firebase-app.js"), import(SDK + "firebase-auth.js"), import(SDK + "firebase-firestore.js")])
      .then(function (m) {
        var app = m[0].initializeApp(CFG);
        FB = { App: m[0], A: m[1], F: m[2], app: app, auth: m[1].getAuth(app), db: m[2].getFirestore(app) };
        var emu = window.__FB_EMULATOR;                        // automated tests only
        if (emu) { FB.A.connectAuthEmulator(FB.auth, emu.auth, { disableWarnings: true }); FB.F.connectFirestoreEmulator(FB.db, emu.host, emu.port); }
        return FB;
      });
  }
  function fbMessage(e) {
    var c = (e && e.code) || "";
    if (/invalid-credential|wrong-password|user-not-found|invalid-email/.test(c)) return "Wrong email or password.";
    if (/too-many-requests/.test(c)) return "Too many tries. Wait a few minutes, or use “Forgot password?”.";
    if (/network-request-failed|unavailable/.test(c)) return "No internet connection. Try again.";
    if (/operation-not-allowed|configuration-not-found/.test(c)) return "Email/password sign-in is not switched on in Firebase yet (Authentication → Sign-in method).";
    if (/permission-denied/.test(c)) return "Your account isn't allowed to do that.";
    return (e && e.message) || "Something went wrong.";
  }
  function showLoginError(msg) { busy(false); $("#emailError").textContent = msg; $("#emailError").hidden = false; }

  // full-screen "working…" indicator; offers a Reload button if a step hangs
  var slowTimer;
  function busy(msg) {
    var box = $("#loading");
    clearTimeout(slowTimer);
    if (!msg) { box.hidden = true; $("#loadingSlow").hidden = true; return; }
    $("#loadingText").textContent = msg;
    box.hidden = false; $("#loadingSlow").hidden = true;
    slowTimer = setTimeout(function () { $("#loadingSlow").hidden = false; }, 12000);
  }
  $("#loadingReload").addEventListener("click", function () { location.reload(); });

  function fbStart() {
    $("#forgot").addEventListener("click", fbForgot);
    $("#teamBtn").addEventListener("click", fbOpenTeam);
    $("#historyBtn").addEventListener("click", fbOpenHistory);
    $("#closeTeam").addEventListener("click", function () { $("#teamDialog").close(); });
    $("#closeHistory").addEventListener("click", function () { $("#historyDialog").close(); });
    $("#teamForm").addEventListener("submit", function (e) { e.preventDefault(); fbAddPerson(); });
    $("#teamList").addEventListener("click", function (e) { var b = e.target.closest("[data-remove]"); if (b) fbRemovePerson(b.dataset.remove); });
    $("#historyList").addEventListener("click", function (e) { var b = e.target.closest("[data-load]"); if (b) fbLoadVersion(b.dataset.load); });
    $("#who").textContent = "Loading…";
    busy("Connecting…");
    fbInit().then(function () {
      $("#who").textContent = "Not signed in";
      FB.A.onAuthStateChanged(FB.auth, function (user) {
        if (user) fbEnter(user);
        else if (!fbEntering) busy(false);           // not signed in: show the sign-in form
      });
    }).catch(function () { showLoginError("Could not reach Firebase. Check the internet connection and reload."); });
  }

  function fbSignIn(email, password, remember) {
    var btn = $("#emailBtn");
    $("#emailError").hidden = true; btn.disabled = true; btn.textContent = "Signing in…"; btn.classList.add("is-busy");
    busy("Signing in…");
    fbInit().then(function () {
      return FB.A.setPersistence(FB.auth, remember ? FB.A.browserLocalPersistence : FB.A.browserSessionPersistence);
    }).then(function () {
      return FB.A.signInWithEmailAndPassword(FB.auth, normEmail(email), password);
    }).catch(function (e) { showLoginError(fbMessage(e)); })
      .then(function () { btn.disabled = false; btn.textContent = "Sign in"; btn.classList.remove("is-busy"); });
  }

  function fbForgot() {
    var email = normEmail($("#email").value);
    if (!email) { showLoginError("Type your email above first, then tap “Forgot password?”."); return; }
    fbInit().then(function () { return FB.A.sendPasswordResetEmail(FB.auth, email); })
      .then(function () { toast("If " + email + " has an account, a password-reset email is on its way. Check the spam folder too.", { ms: 8000 }); },
            function (e) { showLoginError(fbMessage(e)); });
  }

  function fbEnter(user) {
    if (fbEntering) return; fbEntering = true;
    var email = normEmail(user.email), F = FB.F;
    busy("Checking your access…");
    F.getDoc(F.doc(FB.db, "admins", email)).then(function (snap) {
      if (!snap.exists()) { var e = new Error("not admin"); e.code = "not-admin"; throw e; }
      fbRole = snap.data().role === "owner" ? "owner" : "editor";
      signedInAs = email;
      busy("Loading the menu…");
      return F.getDoc(F.doc(FB.db, "menu", "current"));
    }).then(function (m) {
      if (m.exists()) { data = JSON.parse(m.data().json); fbVersion = m.data().version || 0; fbSeed = false; }
      else { data = clone(window.MENU || []); fbVersion = 0; fbSeed = true; }
      original = clone(data); originalText = serialize(original);
      $("#who").textContent = "Signed in as " + email + (fbRole === "owner" ? " · owner" : "");
      $("#login").hidden = true; $("#editor").hidden = false; $("#publishBar").hidden = false; $("#signOut").hidden = false;
      $("#teamBtn").hidden = fbRole !== "owner"; $("#historyBtn").hidden = false;
      render();
      busy(false);
      if (fbSeed) toast("First time with Firebase: tap Publish once to move the menu there.", { ms: 9000 });
    }).catch(function (e) {
      var msg = e.code === "not-admin" || /permission-denied/.test(e.code || "") ?
        "The account " + email + " isn't on the team yet. Ask the owner to add it." :
        /failed-precondition|not-found/.test(e.code || "") ? "The Firestore database isn't set up yet (Firebase console → Firestore → Create database)." :
        fbMessage(e);
      showLoginError(msg);
      FB.A.signOut(FB.auth);
    }).then(function () { fbEntering = false; });
  }

  function fbPublish() {
    if (Object.keys(bad).length) { toast("Fix the price marked in red first.", { bad: true }); return; }
    var n = changeCount();
    if (!n && !fbSeed) return;
    var btn = $("#publish"); btn.disabled = true; btn.textContent = "Publishing…"; btn.classList.add("is-busy");
    var F = FB.F, ref = F.doc(FB.db, "menu", "current"), json = JSON.stringify(data), next;
    F.runTransaction(FB.db, function (tx) {
      return tx.get(ref).then(function (s) {
        var cur = s.exists() ? (s.data().version || 0) : 0;
        if (cur !== fbVersion) { var e = new Error("conflict"); e.code = "conflict"; throw e; }
        next = cur + 1;
        tx.set(ref, { json: json, version: next, updatedAt: F.serverTimestamp(), updatedBy: signedInAs });
      });
    }).then(function () {
      fbVersion = next; fbSeed = false;
      original = clone(data); originalText = serialize(data);
      render(true);
      toast("Published ✓  Guests see the new menu right away.", { ms: 7000 });
      return F.addDoc(F.collection(FB.db, "menuHistory"),
        { json: json, version: next, updatedAt: F.serverTimestamp(), updatedBy: signedInAs, changes: n }).catch(function () {});
    }).catch(function (e) {
      if (e.code === "conflict") toast("Someone else published a change since you opened the menu. Reload to get the latest version, then make your change again.",
        { bad: true, sticky: true, action: "Reload", onAction: function () { location.reload(); } });
      else toast("Could not publish: " + fbMessage(e), { bad: true, sticky: true });
    }).then(function () { btn.textContent = "Publish"; btn.classList.remove("is-busy"); refreshBar(); });
  }

  function fbSignOut() {
    if (data && changeCount() && !confirm("You have changes that are not published. Sign out anyway?")) return;
    busy("Signing out…");
    FB.A.signOut(FB.auth).then(function () { location.reload(); });
  }

  /* team (owner only) */
  function fbOpenTeam() {
    $("#teamError").hidden = true;
    var d = $("#teamDialog"); if (d.showModal) d.showModal(); else d.setAttribute("open", "");
    fbRenderTeam();
  }
  function fbRenderTeam() {
    var list = $("#teamList"), F = FB.F;
    list.innerHTML = "<li><span class='muted'>Loading…</span></li>";
    F.getDocs(F.collection(FB.db, "admins")).then(function (qs) {
      var rows = [];
      qs.forEach(function (d) { rows.push({ email: d.id, role: d.data().role === "owner" ? "owner" : "editor" }); });
      rows.sort(function (a, b) { return a.role === b.role ? a.email.localeCompare(b.email) : a.role === "owner" ? -1 : 1; });
      list.innerHTML = rows.map(function (r) {
        return "<li><span>" + esc(r.email) + '<span class="role">' + r.role + "</span></span>" +
          (r.email === signedInAs ? "<small>you</small>" :
           '<button class="btn btn-small" type="button" data-remove="' + esc(r.email) + '" style="color:var(--bad)">Remove</button>') + "</li>";
      }).join("");
    }).catch(function (e) { list.innerHTML = "<li><span class='error'>" + esc(fbMessage(e)) + "</span></li>"; });
  }
  function fbAddPerson() {
    var email = normEmail($("#tEmail").value), role = $("#tRole").value, pass = $("#tPass").value;
    var err = $("#teamError"), btn = $("#teamAdd"), F = FB.F, existed = false;
    err.hidden = true;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = "Enter a valid email address."; err.hidden = false; return; }
    if (pass.length < 8) { err.textContent = "Give them a password of at least 8 characters."; err.hidden = false; return; }
    btn.disabled = true; btn.textContent = "Adding…";
    // create their sign-in account in a second Firebase instance so the owner stays signed in
    var app2 = FB.App.getApps().filter(function (a) { return a.name === "team"; })[0] || FB.App.initializeApp(CFG, "team");
    var auth2 = FB.A.getAuth(app2);
    if (window.__FB_EMULATOR && !auth2.emulatorConfig) FB.A.connectAuthEmulator(auth2, window.__FB_EMULATOR.auth, { disableWarnings: true });
    FB.A.createUserWithEmailAndPassword(auth2, email, pass).then(function () { return FB.A.signOut(auth2); }, function (e) {
      if (/email-already-in-use/.test(e.code || "")) { existed = true; return; }
      throw e;
    }).then(function () {
      return F.setDoc(F.doc(FB.db, "admins", email), { role: role, addedBy: signedInAs, addedAt: F.serverTimestamp() });
    }).then(function () {
      $("#teamForm").reset();
      toast(existed ? email + " already had an account, so their password is unchanged. They're now on the team as " + role + "."
                    : email + " can now sign in with the password you set.", { ms: 8000 });
      fbRenderTeam();
    }).catch(function (e) {
      err.textContent = /operation-not-allowed|admin-restricted/.test(e.code || "") ?
        "Firebase isn't allowing new accounts. In Firebase → Authentication → Settings → User actions, tick “Enable create (sign-up)”, or add the person under Authentication → Users." :
        /weak-password/.test(e.code || "") ? "That password is too weak. Use at least 8 characters." : fbMessage(e);
      err.hidden = false;
    }).then(function () { btn.disabled = false; btn.textContent = "Add person"; });
  }
  function fbRemovePerson(email) {
    if (!confirm("Remove " + email + " from the team? They won't be able to change the menu any more.")) return;
    FB.F.deleteDoc(FB.F.doc(FB.db, "admins", email)).then(function () { toast(email + " removed."); fbRenderTeam(); },
      function (e) { toast("Could not remove: " + fbMessage(e), { bad: true }); });
  }

  /* history */
  var fbHistory = {};
  function fbOpenHistory() {
    var d = $("#historyDialog"), list = $("#historyList"), F = FB.F;
    if (d.showModal) d.showModal(); else d.setAttribute("open", "");
    list.innerHTML = "<li><span class='muted'>Loading…</span></li>";
    F.getDocs(F.query(F.collection(FB.db, "menuHistory"), F.orderBy("updatedAt", "desc"), F.limit(15))).then(function (qs) {
      fbHistory = {}; var rows = [];
      qs.forEach(function (doc) {
        var v = doc.data(); fbHistory[doc.id] = v.json;
        var when = v.updatedAt && v.updatedAt.toDate ? v.updatedAt.toDate().toLocaleString() : "";
        rows.push("<li><span>Version " + esc(v.version) + " · " + esc(when) + "<br><small>" + esc(v.updatedBy || "") + " · " +
          esc(v.changes || 0) + " change(s)</small></span>" + '<button class="btn btn-small" type="button" data-load="' + esc(doc.id) + '">Load</button></li>');
      });
      list.innerHTML = rows.join("") || "<li><span class='muted'>No published changes yet.</span></li>";
    }).catch(function (e) { list.innerHTML = "<li><span class='error'>" + esc(fbMessage(e)) + "</span></li>"; });
  }
  function fbLoadVersion(id) {
    if (!fbHistory[id]) return;
    if (changeCount() && !confirm("Replace your unpublished changes with this older version?")) return;
    data = JSON.parse(fbHistory[id]);
    render(true);
    $("#historyDialog").close();
    toast("Older version loaded. Check it, then tap Publish to make it live (or Discard).", { ms: 8000 });
  }

  /* ───────── wire up ───────── */
  $("#signOut").addEventListener("click", fbSignOut);
  $("#sections").addEventListener("input", onInput);
  $("#sections").addEventListener("change", onInput);
  $("#sections").addEventListener("click", onClick);
  $("#filter").addEventListener("input", applyFilter);
  $("#expandAll").addEventListener("click", function () { $$(".sec").forEach(function (d) { if (!d.classList.contains("filtered-out")) d.open = true; }); });
  $("#collapseAll").addEventListener("click", function () { $$(".sec").forEach(function (d) { d.open = false; }); });
  $("#addSectionBtn").addEventListener("click", openNewSection);
  $("#publish").addEventListener("click", fbPublish);
  $("#discard").addEventListener("click", function () {
    if (!confirm("Throw away all changes that are not published?")) return;
    data = clone(original); render(true); toast("Changes discarded.");
  });
  window.addEventListener("beforeunload", function (e) {
    if (data && original && changeCount()) { e.preventDefault(); e.returnValue = ""; }
  });

  $("#emailForm").addEventListener("submit", function (e) {
    e.preventDefault();
    fbSignIn($("#email").value, $("#password").value, $("#remember2").checked);
  });

  if (FIREBASE) fbStart();
  else showLoginError("Firebase is switched off in firebase-config.js, so the menu can't be edited here.");

  // exposed for automated tests only
  window.__menuAdmin = { serialize: serialize, readSingle: readSingle, readCell: readCell };
})();
