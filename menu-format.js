/*
 * Writes the menu back out as menu-data.js (one line per dish, so changes are easy to review).
 * Shared by the admin page (browser) and tools/sync-from-firebase.js (Node).
 */
(function (root) {
  "use strict";
  var J = function (v) { return JSON.stringify(v); };
  function jsVal(v) { return Array.isArray(v) ? "[" + v.map(jsVal).join(", ") + "]" : J(v); }
  // [name, price, diet, description, also known as, nepali name, nepali description]; trailing empty parts are left out
  function itemJS(it) {
    var arr = [it[0], it[1] === undefined ? null : it[1]], last = it.length - 1;
    while (last > 1 && (it[last] == null || it[last] === "")) last--;
    for (var i = 2; i <= last; i++) arr.push(it[i] == null || it[i] === "" ? null : it[i]);
    return "[" + arr.map(jsVal).join(", ") + "]";
  }
  var KNOWN = { id: 1, group: 1, title: 1, tagline: 1, note: 1, title_ne: 1, tagline_ne: 1, cols: 1, sizes: 1, defaultSize: 1, items: 1, extra: 1 };
  function serialize(menu) {
    var out = [
      "/*",
      " * Gautam Hotel, Bardibas-14, Mahottari: menu data.",
      " * Prices are in Nepali Rupees (Rs.). Edited with the menu admin (/admin/) or by hand.",
      " *",
      " * Item format: [name, price, diet, description, also known as, nepali name]",
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
      if (sec.title_ne) out.push("    title_ne: " + J(sec.title_ne) + ",");
      if (sec.tagline_ne) out.push("    tagline_ne: " + J(sec.tagline_ne) + ",");
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

  function parse(text) {
    var sandbox = {};
    new Function("window", text)(sandbox);          // the file is plain data: window.MENU = [...]
    if (!Array.isArray(sandbox.MENU)) throw new Error("menu-data.js does not contain window.MENU");
    return sandbox.MENU;
  }
  var api = { serialize: serialize, parse: parse, itemJS: itemJS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.MenuFormat = api;
})(typeof window !== "undefined" ? window : globalThis);
