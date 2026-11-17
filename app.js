(function () {
  "use strict";

  var MENU = window.MENU || [];
  var state = { q: "", diet: "all", group: "all" };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function hl(text) {
    var t = esc(text);
    if (!state.q) return t;
    var q = state.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return t.replace(new RegExp("(" + esc(q) + ")", "ig"), "<mark>$1</mark>");
  }
  function priceHTML(p) {
    if (p === null || p === undefined) return '<span class="price ask">Ask staff</span>';
    return '<span class="price"><span class="rs">Rs</span>' + esc(p) + "</span>";
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
    var q = state.q.toLowerCase();
    return (it[0] + " " + (it[3] || "") + " " + sec.title).toLowerCase().indexOf(q) !== -1;
  }

  function listHTML(sec, items) {
    return items.map(function (it) {
      return '<li class="item"><div class="item-row"><span class="item-name">' + dotHTML(it[2]) +
        "<span>" + hl(it[0]) + '</span></span><span class="leader"></span>' + priceHTML(it[1]) + "</div>" +
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
            return '<tr><td><span class="item-name">' + dotHTML(it[2]) + "<span>" + hl(it[0]) + "</span></span></td>" +
              it[1].map(function (p) { return '<td><span class="rs" style="font-size:.72em;color:var(--muted);font-weight:500">Rs</span>' + esc(p) + "</td>"; }).join("") +
              "</tr>";
          }).join("") + "</tbody></table>";
      }
      if (extra.length) body += '<ul class="items">' + listHTML(sec, extra) + "</ul>";
      body += "</div>";
    } else {
      body = '<ul class="items">' + listHTML(sec, items) + "</ul>";
    }
    return '<article class="section" id="' + esc(sec.id) + '" data-group="' + sec.group + '">' + top + body + "</article>";
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
    t = setTimeout(function () { state.q = e.target.value.trim(); render(); }, 120);
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

  var top = $("#toTop");
  window.addEventListener("scroll", function () { top.classList.toggle("show", window.scrollY > 900); }, { passive: true });
  top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  render();
})();
