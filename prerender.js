/*
 * Builds a plain-HTML copy of the whole menu and Google's menu data
 * (schema.org Menu) from menu-data.js, and writes both into index.html
 * between the PRERENDER markers.
 *
 * Why: search engines read plain HTML immediately; JavaScript-drawn content
 * is read late or not at all. Visitors still get the interactive menu:
 * app.js redraws #sections as soon as it runs.
 *
 * Used by: tools/prerender.js (build), admin/admin.js (on every Publish), app.js (schema).
 */
(function (root) {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmt(p) {
    return String(p).replace(/\d{4,}/g, function (n) { return Number(n).toLocaleString("en-IN"); });
  }
  function price(p) {
    if (p === null || p === undefined || p === "ask") return '<span class="price ask">Ask staff</span>';
    return '<span class="price"><span class="rs">Rs</span>' + esc(fmt(p)) + "</span>";
  }
  function cell(p) {
    if (p === null || p === undefined) return '<span class="na">—</span>';
    if (p === "ask") return '<span class="na ask">Ask</span>';
    return '<span class="rs">Rs</span>' + esc(fmt(p));
  }
  var DIET = { v: "Vegetarian", n: "Non-vegetarian", b: "Veg and non-veg options" };
  function dot(d) {
    return DIET[d] ? '<span class="dot ' + d + '" role="img" aria-label="' + DIET[d] + '" title="' + DIET[d] + '"></span>' : "";
  }
  function list(items) {
    return '<ul class="items">' + items.map(function (it) {
      return '<li class="item"><div class="item-row"><span class="item-name">' + dot(it[2]) + "<span>" + esc(it[0]) +
        '</span></span><span class="leader"></span>' + price(it[1]) + "</div>" +
        (it[3] ? '<p class="desc">' + esc(it[3]) + "</p>" : "") + "</li>";
    }).join("") + "</ul>";
  }
  function table(sec, labels, first) {
    return '<table class="ptable"><thead><tr><th scope="col">' + first + "</th>" +
      labels.map(function (l) { return '<th scope="col">' + esc(l) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      sec.items.map(function (it) {
        return "<tr><td><span class=\"item-name\">" + dot(it[2]) + "<span>" + esc(it[0]) + "</span></span></td>" +
          (it[1] || []).map(function (p) { return "<td>" + cell(p) + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table>";
  }

  // the menu as plain HTML, same structure and classes as the live page
  function html(MENU) {
    var out = "", last = null;
    MENU.forEach(function (sec) {
      if (sec.group !== last) {
        out += '<h2 class="group-title">' + (sec.group === "food" ? "Food" : "Drinks &amp; More") + "</h2>";
        last = sec.group;
      }
      var body;
      if (sec.cols || sec.sizes) {
        body = '<div class="items-wrap">' + table(sec, sec.cols || sec.sizes, sec.sizes ? "Drink" : "Item") +
          (sec.extra && sec.extra.length ? list(sec.extra) : "") + "</div>";
      } else {
        body = list(sec.items);
      }
      if (sec.note) body += '<p class="sec-note">' + esc(sec.note) + "</p>";
      out += '<article class="section' + (sec.sizes ? " wide" : "") + '" id="' + esc(sec.id) + '">' +
        '<div class="section-head"><span class="ornament" aria-hidden="true">✦</span><h3>' + esc(sec.title) + "</h3>" +
        (sec.tagline ? '<p class="sub">' + esc(sec.tagline) + "</p>" : "") + "</div>" + body + "</article>";
    });
    return out;
  }

  // schema.org Menu with every dish and its NPR prices
  var SUFFIX = { momo: "Momo", soup: "Soup", pizza: "Pizza", biryani: "Pulau / Biryani" };
  function schema(MENU, base) {
    function offer(p, name) {
      var n = Number(String(p).replace(/,/g, ""));
      if (p === null || p === undefined || p === "ask" || isNaN(n)) return null;
      var o = { "@type": "Offer", price: String(n), priceCurrency: "NPR" };
      if (name) o.name = name;
      return o;
    }
    function offers(sec, p) {
      var outList = [];
      if (Array.isArray(p)) {
        var labels = sec.cols || sec.sizes || [];
        p.forEach(function (v, i) { var o = offer(v, labels[i]); if (o) outList.push(o); });
      } else if (typeof p === "string" && p.indexOf("/") !== -1) {
        p.split("/").forEach(function (v) { var o = offer(v.trim()); if (o) outList.push(o); });
      } else {
        var o1 = offer(p); if (o1) outList.push(o1);
      }
      return outList;
    }
    function item(sec, it) {
      var name = it[0];
      if (SUFFIX[sec.id] && name.toLowerCase().indexOf(SUFFIX[sec.id].toLowerCase()) === -1) name += " " + SUFFIX[sec.id];
      var m = { "@type": "MenuItem", name: name };
      if (it[3]) m.description = it[3];
      if (it[2] === "v") m.suitableForDiet = "https://schema.org/VegetarianDiet";
      var o = offers(sec, it[1]);
      if (o.length === 1) m.offers = o[0]; else if (o.length) m.offers = o;
      return m;
    }
    return {
      "@context": "https://schema.org", "@type": "Menu", "@id": base + "#menu",
      name: "Gautam Hotel Menu", url: base, inLanguage: "en",
      hasMenuSection: MENU.map(function (sec) {
        var s = { "@type": "MenuSection", name: sec.title,
                  hasMenuItem: sec.items.concat(sec.extra || []).map(function (it) { return item(sec, it); }) };
        if (sec.tagline) s.description = sec.tagline;
        return s;
      })
    };
  }

  // write both into index.html between the markers
  function between(text, name, inner) {
    var a = "<!-- PRERENDER:" + name + " -->", b = "<!-- /PRERENDER:" + name + " -->";
    var i = text.indexOf(a), j = text.indexOf(b);
    if (i === -1 || j === -1 || j < i) throw new Error("index.html is missing the " + name + " markers");
    return text.slice(0, i + a.length) + inner + text.slice(j);
  }
  function apply(indexHtml, MENU, base) {
    var json = JSON.stringify(schema(MENU, base)).replace(/</g, "\\u003c");
    var out = between(indexHtml, "SCHEMA", '\n  <script type="application/ld+json" id="ld-menu">' + json + "</script>\n  ");
    return between(out, "MENU", html(MENU));
  }

  var api = { html: html, schema: schema, apply: apply };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.MenuPrerender = api;
})(typeof window !== "undefined" ? window : globalThis);
