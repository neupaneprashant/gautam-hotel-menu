/*
 * Gautam Hotel: menu admin.
 * Reads menu-data.js from GitHub, lets staff edit it in a form, and saves it
 * back with the GitHub API. GitHub Pages then republishes the menu (about 1 minute).
 * No server: each editor signs in with a fine-grained GitHub access key that can
 * only read/write this repository's contents.
 */
(function () {
  "use strict";

  var FILE = "menu-data.js";
  var REPO = detectRepo();
  var API = "https://api.github.com";
  var KEY_STORE = "gautam-menu-admin-key";

  var token = null, branch = "main", sha = null, user = "";
  var data = null, original = null, originalText = "";
  var bad = {};                       // input id -> true while its value is invalid

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function detectRepo() {
    var parts = location.pathname.split("/").filter(Boolean);
    if (/\.github\.io$/i.test(location.hostname) && parts.length) {
      return { owner: location.hostname.split(".")[0], repo: parts[0] };
    }
    return { owner: "neupaneprashant", repo: "gautam-hotel-menu" };   // when opened outside GitHub Pages
  }

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
  function b64encode(str) {
    var bytes = new TextEncoder().encode(str), bin = "";
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  function b64decode(b64) {
    var bin = atob(b64.replace(/\s/g, "")), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  /* ───────── GitHub API ───────── */
  function gh(path, opts) {
    opts = opts || {};
    var headers = { Accept: "application/vnd.github+json", Authorization: "Bearer " + token, "X-GitHub-Api-Version": "2022-11-28" };
    if (opts.body) headers["Content-Type"] = "application/json";
    return fetch(API + path, { method: opts.method || "GET", headers: headers, body: opts.body, cache: "no-store" })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (body) {
          if (!r.ok) { var e = new Error(body.message || ("GitHub error " + r.status)); e.status = r.status; throw e; }
          return body;
        });
      });
  }
  var repoPath = "/repos/" + encodeURIComponent(REPO.owner) + "/" + encodeURIComponent(REPO.repo);

  /* ───────── menu-data.js read / write ───────── */
  function parseMenu(text) {
    var sandbox = {};
    new Function("window", text)(sandbox);          // the file is plain data: window.MENU = [...]
    if (!Array.isArray(sandbox.MENU)) throw new Error("menu-data.js does not contain window.MENU");
    return sandbox.MENU;
  }
  var J = function (v) { return JSON.stringify(v); };
  function jsVal(v) { return Array.isArray(v) ? "[" + v.map(jsVal).join(", ") + "]" : J(v); }
  function itemJS(it) {
    var arr = [it[0], it[1] === undefined ? null : it[1]];
    if (it[3]) arr.push(it[2] || null, it[3]);
    else if (it[2]) arr.push(it[2]);
    return "[" + arr.map(jsVal).join(", ") + "]";
  }
  var KNOWN = { id: 1, group: 1, title: 1, tagline: 1, note: 1, cols: 1, sizes: 1, defaultSize: 1, items: 1, extra: 1 };
  function serialize(menu) {
    var out = [
      "/*",
      " * Gautam Hotel, Bardibas-14, Mahottari: menu data.",
      " * Prices are in Nepali Rupees (Rs.). Edited with the menu admin (/admin/) or by hand.",
      " *",
      " * Item format: [name, price, diet, description]",
      " *   price: a number, a string such as \"185 / 380\" for two portion/type prices,",
      " *          an array when the section has `cols` (one price per column),",
      " *          (sections with `sizes`, e.g. Hard Drinks, take one price per size:",
      " *           null = not served in that size, \"ask\" = confirm with staff),",
      " *          or null when the price must be confirmed with staff.",
      " *   diet:  \"v\" = vegetarian, \"n\" = non-vegetarian, \"b\" = both options available,",
      " *          omitted for drinks and others where it does not apply.",
      " */",
      "window.MENU = ["
    ];
    var lastGroup = null;
    menu.forEach(function (sec, i) {
      if (sec.group !== lastGroup) {
        out.push("  /* ───────────── " + (sec.group === "drinks" ? "DRINKS" : "FOOD") + " ───────────── */");
        lastGroup = sec.group;
      }
      out.push("  {");
      out.push("    id: " + J(sec.id) + ", group: " + J(sec.group) + ", title: " + J(sec.title) + ",");
      if (sec.tagline) out.push("    tagline: " + J(sec.tagline) + ",");
      if (sec.note) out.push("    note: " + J(sec.note) + ",");
      Object.keys(sec).forEach(function (k) { if (!KNOWN[k] && sec[k] !== undefined) out.push("    " + k + ": " + J(sec[k]) + ","); });
      if (sec.cols) out.push("    cols: " + jsVal(sec.cols) + ",");
      if (sec.sizes) out.push("    sizes: " + jsVal(sec.sizes) + ",");
      if (sec.defaultSize !== undefined) out.push("    defaultSize: " + J(sec.defaultSize) + ",");
      out.push("    items: [");
      sec.items.forEach(function (it, j) { out.push("      " + itemJS(it) + (j < sec.items.length - 1 ? "," : "")); });
      out.push("    ]" + (sec.extra && sec.extra.length ? "," : ""));
      if (sec.extra && sec.extra.length) {
        out.push("    extra: [");
        sec.extra.forEach(function (it, j) { out.push("      " + itemJS(it) + (j < sec.extra.length - 1 ? "," : "")); });
        out.push("    ]");
      }
      out.push("  }" + (i < menu.length - 1 ? "," : ""));
    });
    out.push("];", "");
    return out.join("\n");
  }

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
      } else if (f === "tagline" || f === "note") {
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
    else if (field === "desc") { if (el.value.trim()) it[3] = el.value; else it.splice(3); }
    else if (field === "diet") { it[2] = el.value || undefined; if (!it[2] && !it[3]) it.splice(2); }
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

  /* ───────── load / publish ───────── */
  function load() {
    $("#who").textContent = "Loading menu…";
    return gh(repoPath + "/contents/" + FILE + "?ref=" + encodeURIComponent(branch)).then(function (f) {
      sha = f.sha;
      var text = b64decode(f.content);
      data = parseMenu(text);
      original = clone(data);
      originalText = serialize(original);
      $("#who").textContent = (user ? "@" + user + " · " : "") + REPO.owner + "/" + REPO.repo;
      $("#login").hidden = true; $("#editor").hidden = false; $("#publishBar").hidden = false; $("#signOut").hidden = false;
      render();
    });
  }

  function publish() {
    if (Object.keys(bad).length) { toast("Fix the price marked in red first.", { bad: true }); return; }
    var n = changeCount();
    if (!n) return;
    var btn = $("#publish");
    btn.disabled = true; btn.textContent = "Publishing…";
    var text = serialize(data);
    try { parseMenu(text); } catch (err) { toast("Could not prepare the menu file: " + err.message, { bad: true }); btn.textContent = "Publish"; refreshBar(); return; }
    gh(repoPath + "/contents/" + FILE, {
      method: "PUT",
      body: JSON.stringify({
        message: "Update menu (" + n + (n === 1 ? " change" : " changes") + ") from the admin page",
        content: b64encode(text), sha: sha, branch: branch
      })
    }).then(function (res) {
      sha = res.content.sha;
      original = clone(data);
      originalText = text;
      render(true);
      toast("Published ✓  The live menu updates in about a minute.", { ms: 7000 });
    }).catch(function (err) {
      if (err.status === 409 || err.status === 422) {
        toast("Someone else changed the menu since you opened it. Reload to get the latest version, then make your change again.",
          { bad: true, sticky: true, action: "Reload", onAction: function () { location.reload(); } });
      } else if (err.status === 401) {
        toast("Your access key has expired or was removed. Sign in again.", { bad: true, sticky: true, action: "Sign in", onAction: signOut });
      } else if (err.status === 403 || err.status === 404) {
        toast("This access key can't save changes. It needs “Contents: Read and write” for " + REPO.repo + ".", { bad: true, sticky: true });
      } else {
        toast("Could not publish: " + err.message + ". Check your internet connection and try again.", { bad: true, sticky: true });
      }
    }).then(function () { btn.textContent = "Publish"; refreshBar(); });
  }

  function signIn(key, remember) {
    token = key.trim();
    var err = $("#loginError");
    err.hidden = true;
    $("#loginBtn").disabled = true; $("#loginBtn").textContent = "Signing in…";
    return gh(repoPath).then(function (repo) {
      branch = repo.default_branch || "main";
      try { (remember ? localStorage : sessionStorage).setItem(KEY_STORE, token); } catch (e) {}
      return gh("/user").then(function (u) { user = u.login; }, function () {});
    }).then(load).catch(function (e) {
      token = null;
      try { localStorage.removeItem(KEY_STORE); sessionStorage.removeItem(KEY_STORE); } catch (x) {}
      err.textContent = e.status === 401 ? "That access key isn't valid. Check you copied all of it." :
        e.status === 404 || e.status === 403 ? "This key can't open the menu repository (" + REPO.owner + "/" + REPO.repo + "). Give it access to that repository." :
        "Could not sign in: " + e.message;
      err.hidden = false;
      $("#login").hidden = false; $("#editor").hidden = true; $("#publishBar").hidden = true;
    }).then(function () { $("#loginBtn").disabled = false; $("#loginBtn").textContent = "Sign in"; });
  }

  function signOut() {
    if (data && changeCount() && !confirm("You have changes that are not published. Sign out anyway?")) return;
    try { localStorage.removeItem(KEY_STORE); sessionStorage.removeItem(KEY_STORE); } catch (e) {}
    data = null; token = null;
    location.reload();
  }

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

  /* ───────── wire up ───────── */
  $("#repoName").textContent = REPO.repo;
  $("#loginForm").addEventListener("submit", function (e) { e.preventDefault(); signIn($("#token").value, $("#remember").checked); });
  $("#signOut").addEventListener("click", signOut);
  $("#sections").addEventListener("input", onInput);
  $("#sections").addEventListener("change", onInput);
  $("#sections").addEventListener("click", onClick);
  $("#filter").addEventListener("input", applyFilter);
  $("#expandAll").addEventListener("click", function () { $$(".sec").forEach(function (d) { if (!d.classList.contains("filtered-out")) d.open = true; }); });
  $("#collapseAll").addEventListener("click", function () { $$(".sec").forEach(function (d) { d.open = false; }); });
  $("#addSectionBtn").addEventListener("click", openNewSection);
  $("#publish").addEventListener("click", publish);
  $("#discard").addEventListener("click", function () {
    if (!confirm("Throw away all changes that are not published?")) return;
    data = clone(original); render(true); toast("Changes discarded.");
  });
  window.addEventListener("beforeunload", function (e) {
    if (data && original && changeCount()) { e.preventDefault(); e.returnValue = ""; }
  });

  var saved = null;
  try { saved = localStorage.getItem(KEY_STORE) || sessionStorage.getItem(KEY_STORE); } catch (e) {}
  if (saved) signIn(saved, !!localStorage.getItem(KEY_STORE));

  // exposed for automated tests only
  window.__menuAdmin = { serialize: serialize, parseMenu: parseMenu, readSingle: readSingle, readCell: readCell };
})();
