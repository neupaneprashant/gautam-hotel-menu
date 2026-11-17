(function () {
  "use strict";

  var MENU = window.MENU || [];
  var state = { q: "", diet: "all", group: "all" };
  var sizeSel = {};   // chosen size per sized section (phones)

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var qTokens = [];   // parsed search words (see search.js)
  function hl(text) {
    var t = esc(text);
    if (!state.q || !window.MenuSearch) return t;
    return window.MenuSearch.highlight(t, qTokens);
  }
  // keep "Non-Veg" together on one line
  function nb(html) { return html.replace(/Non-/g, "Non&#8209;"); }
  // 11935 -> "11,935"; also formats numbers inside "1245 / 745"
  function fmt(p) {
    return String(p).replace(/\d{4,}/g, function (n) { return Number(n).toLocaleString("en-IN"); });
  }
  function priceHTML(p) {
    if (p === null || p === undefined || p === "ask") return '<span class="price ask">Ask staff</span>';
    return '<span class="price"><span class="rs">Rs</span>' + esc(fmt(p)) + "</span>";
  }
  function cellHTML(p) {
    if (p === null || p === undefined) return '<span class="na" title="Not available in this size">—</span>';
    if (p === "ask") return '<span class="na ask" title="Please ask staff">Ask</span>';
    return '<span class="rs">Rs</span>' + esc(fmt(p));
  }
  function dotHTML(d) {
    if (!d) return "";
    var label = { v: "Vegetarian", n: "Non-vegetarian", b: "Veg and non-veg options" }[d];
    return '<span class="dot ' + d + '" role="img" aria-label="' + label + '" title="' + label + '"></span>';
  }

  function itemMatches(sec, it) {
    var diet = it[2];
    if (state.diet === "v" && !(diet === "v" || diet === "b" || !diet)) return false;
    if (state.diet === "n" && !(diet === "n" || diet === "b")) return false;
    if (!state.q) return true;
    if (window.MenuSearch) return window.MenuSearch.matches(qTokens, it, sec);
    return (it[0] + " " + (it[3] || "") + " " + sec.title).toLowerCase().indexOf(state.q.toLowerCase()) !== -1;
  }

  function listHTML(sec, items) {
    return items.map(function (it) {
      return '<li class="item"><div class="item-row"><span class="item-name">' + dotHTML(it[2]) +
        "<span>" + nb(hl(it[0])) + '</span></span><span class="leader"></span>' + priceHTML(it[1]) + "</div>" +
        (it[3] ? '<p class="desc">' + hl(it[3]) + "</p>" : "") + "</li>";
    }).join("");
  }

  function sectionHTML(sec, items, extra) {
    var head = '<h3>' + esc(sec.title) + "</h3>" + (sec.tagline ? '<p class="sub">' + esc(sec.tagline) + "</p>" : "");
    var top = '<div class="section-head"><span class="ornament" aria-hidden="true">✦</span>' + head + "</div>";

    var body;
    if (sec.cols) {
      body = '<div class="items-wrap">';
      if (items.length) {
        body += '<table class="ptable"><thead><tr><th scope="col">Item</th>' +
          sec.cols.map(function (c) { return '<th scope="col">' + esc(c) + "</th>"; }).join("") +
          "</tr></thead><tbody>" +
          items.map(function (it) {
            return '<tr><td><span class="item-name">' + dotHTML(it[2]) + "<span>" + nb(hl(it[0])) + "</span></span></td>" +
              it[1].map(function (p) { return "<td>" + cellHTML(p) + "</td>"; }).join("") +
              "</tr>";
          }).join("") + "</tbody></table>";
      }
      if (extra.length) body += '<ul class="items">' + listHTML(sec, extra) + "</ul>";
      body += "</div>";
    } else if (sec.sizes) {
      body = sizedHTML(sec, items);
    } else {
      body = '<ul class="items">' + listHTML(sec, items) + "</ul>";
    }
    if (sec.note) body += '<p class="sec-note">' + esc(sec.note) + "</p>";
    return '<article class="section' + (sec.sizes ? " wide" : "") + '" id="' + esc(sec.id) + '" data-group="' + sec.group + '">' + top + body + "</article>";
  }

  /* Hard drinks: full size table on wide screens, size picker + single-price list on phones */
  function sizedHTML(sec, items) {
    var sel = sizeSel[sec.id] != null ? sizeSel[sec.id] : (sec.defaultSize || 0);
    var table = '<div class="size-table-wrap"><table class="ptable size-table"><thead><tr><th scope="col">Drink</th>' +
      sec.sizes.map(function (s) { return '<th scope="col">' + esc(s) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      items.map(function (it) {
        return "<tr><td>" + nb(hl(it[0])) + "</td>" + it[1].map(function (p) { return "<td>" + cellHTML(p) + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>";
    var picker = '<div class="size-pick"><p class="size-label" id="lbl-' + esc(sec.id) + '">Choose a size</p>' +
      '<div class="size-chips" role="radiogroup" aria-labelledby="lbl-' + esc(sec.id) + '">' +
      sec.sizes.map(function (s, i) {
        return '<button type="button" class="size-chip' + (i === sel ? " is-active" : "") + '" role="radio" aria-checked="' + (i === sel) +
          '" data-sec="' + esc(sec.id) + '" data-i="' + i + '">' + esc(s) + "</button>";
      }).join("") + "</div>" +
      '<ul class="items">' + items.map(function (it) {
        var p = it[1][sel];
        var price = p === null ? '<span class="price na-price" title="Not available in this size">—</span>' : priceHTML(p);
        return '<li class="item' + (p === null ? " unavailable" : "") + '"><div class="item-row"><span class="item-name"><span>' + nb(hl(it[0])) +
          '</span></span><span class="leader"></span>' + price + "</div></li>";
      }).join("") + "</ul></div>";
    return '<div class="items-wrap">' + table + picker + "</div>";
  }

  var observer;
  function render() {
    var html = "", cats = "", count = 0, lastGroup = null;
    MENU.forEach(function (sec) {
      if (state.group !== "all" && sec.group !== state.group) return;
      var items = sec.items.filter(function (it) { return itemMatches(sec, it); });
      var extra = (sec.extra || []).filter(function (it) { return itemMatches(sec, it); });
      if (!items.length && !extra.length) return;
      if (sec.group !== lastGroup) {
        html += '<h2 class="group-title">' + (sec.group === "food" ? "Food" : "Drinks &amp; More") + "</h2>";
        lastGroup = sec.group;
      }
      html += sectionHTML(sec, items, extra);
      cats += '<a class="cat" href="#' + esc(sec.id) + '" data-id="' + esc(sec.id) + '">' + esc(sec.title) + "</a>";
      count++;
    });
    $("#sections").innerHTML = html;
    $("#cats").innerHTML = cats;
    $("#empty").hidden = count > 0;
    // keep the chosen size chip visible in its scrolling row
    $$(".size-chips").forEach(function (row) {
      var on = row.querySelector(".is-active");
      if (on) row.scrollLeft = on.offsetLeft - row.clientWidth / 2 + on.clientWidth / 2;
    });
    spy();
  }

  function spy() {
    if (observer) observer.disconnect();
    if (!("IntersectionObserver" in window)) return;
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        $$(".cat").forEach(function (c) { c.classList.toggle("is-current", c.dataset.id === e.target.id); });
        var cur = $('.cat[data-id="' + e.target.id + '"]');
        if (cur) {
          var bar = $("#cats");
          bar.scrollTo({ left: cur.offsetLeft - bar.clientWidth / 2 + cur.clientWidth / 2, behavior: "smooth" });
        }
      });
    }, { rootMargin: "-35% 0px -60% 0px" });
    $$(".section").forEach(function (s) { observer.observe(s); });
  }

  // Controls
  var t;
  $("#q").addEventListener("input", function (e) {
    clearTimeout(t);
    t = setTimeout(function () {
      state.q = e.target.value.trim();
      qTokens = window.MenuSearch ? window.MenuSearch.parse(state.q) : [];
      if (state.q && !qTokens.length) state.q = "";   // only filler words like "and"
      render();
    }, 120);
  });
  /* QR code popup */
  var qrDialog = $("#qrDialog");
  var menuUrl = ((document.querySelector('link[rel="canonical"]') || {}).href || location.href).split("#")[0].split("?")[0];
  if (qrDialog) {
    $("#qrUrl").textContent = menuUrl.replace(/^https?:\/\//, "");
    $$("[data-qr-open]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (typeof qrDialog.showModal === "function") qrDialog.showModal(); else qrDialog.setAttribute("open", "");
      });
    });
    function closeQr() { if (qrDialog.close) qrDialog.close(); else qrDialog.removeAttribute("open"); }
    $("[data-qr-close]").addEventListener("click", closeQr);
    qrDialog.addEventListener("click", function (e) { if (e.target === qrDialog) closeQr(); });   // tap outside
    $("#qrShare").addEventListener("click", function () {
      var btn = this, data = { title: "Gautam Hotel Menu", text: "Gautam Hotel, Bardibas: menu", url: menuUrl };
      if (navigator.share) { navigator.share(data).catch(function () {}); return; }
      var done = function () { btn.textContent = "Link copied ✓"; setTimeout(function () { btn.textContent = "Share link"; }, 2000); };
      if (navigator.clipboard) navigator.clipboard.writeText(menuUrl).then(done, function () { window.prompt("Copy this link:", menuUrl); });
      else window.prompt("Copy this link:", menuUrl);
    });
  }

  // size picker (event delegation survives re-renders)
  $("#sections").addEventListener("click", function (e) {
    var b = e.target.closest(".size-chip");
    if (!b) return;
    sizeSel[b.dataset.sec] = Number(b.dataset.i);
    var y = window.scrollY;
    render();
    window.scrollTo(0, y);
    var again = document.querySelector('.size-chip[data-sec="' + b.dataset.sec + '"][data-i="' + b.dataset.i + '"]');
    if (again) again.focus({ preventScroll: true });
  });

  $$(".tab").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".tab").forEach(function (x) { x.classList.remove("is-active"); x.setAttribute("aria-selected", "false"); });
      b.classList.add("is-active"); b.setAttribute("aria-selected", "true");
      state.group = b.dataset.group; render();
    });
  });
  $$(".chip").forEach(function (b) {
    b.addEventListener("click", function () {
      var on = !b.classList.contains("is-active");
      $$(".chip").forEach(function (x) { x.classList.remove("is-active"); x.setAttribute("aria-pressed", "false"); });
      if (on) { b.classList.add("is-active"); b.setAttribute("aria-pressed", "true"); }
      state.diet = on ? b.dataset.diet : "all"; render();
    });
  });

  /* ── Dynamic toolbar: tuck the search/filter row away while reading down
        the menu, bring it back on any upward scroll. Category bar stays. ── */
  var toolbar = $(".toolbar"), top = $("#toTop"), lastY = window.scrollY, ticking = false, jumping = false, idle;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function measure() {
    var root = document.documentElement.style;
    root.setProperty("--row-h", $(".toolbar-row").offsetHeight + "px");
    root.setProperty("--cats-h", $("#cats").offsetHeight + "px");
  }
  measure();
  window.addEventListener("resize", measure);
  window.addEventListener("orientationchange", function () { setTimeout(measure, 300); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

  function setCompact(on) {
    if (on && document.activeElement === $("#q")) on = false;   // never hide while typing
    toolbar.classList.toggle("is-compact", on);
    document.body.classList.toggle("reading", on);
  }
  function onScroll() {
    var y = window.scrollY, dy = y - lastY;
    var pinned = toolbar.getBoundingClientRect().top <= 0;
    if (jumping) {                       // a category jump is in progress: hold compact until it settles
      clearTimeout(idle);
      idle = setTimeout(function () { jumping = false; }, 180);
    } else {
      if (!pinned || y < 40) setCompact(false);
      else if (dy > 6) setCompact(true);
      else if (dy < -6) setCompact(false);
    }
    top.classList.toggle("show", y > 900);
    lastY = y; ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  $("#q").addEventListener("focus", function () { setCompact(false); });
  top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });

  // Category links: land the section exactly under the (compact) bar on any screen size
  $("#cats").addEventListener("click", function (e) {
    var a = e.target.closest(".cat");
    if (!a) return;
    var sec = document.getElementById(a.dataset.id);
    if (!sec) return;
    e.preventDefault();
    if (document.activeElement === $("#q")) $("#q").blur();   // close the keyboard so the bar can tuck away
    setCompact(true);
    jumping = true;                                // keep compact for the whole jump (up or down)
    clearTimeout(idle);
    idle = setTimeout(function () { jumping = false; }, 1500);
    var barH = $("#cats").offsetHeight;
    var y = sec.getBoundingClientRect().top + window.scrollY - barH - 12;
    window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
    if (history.replaceState) history.replaceState(null, "", "#" + sec.id);
  });

  render();
})();
