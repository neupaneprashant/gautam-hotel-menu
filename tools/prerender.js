#!/usr/bin/env node
/*
 * Rebuild the plain-HTML menu and Google menu data inside index.html from menu-data.js.
 * Usage: node tools/prerender.js
 * (The admin page does the same automatically on every Publish.)
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const P = require(path.join(ROOT, "prerender.js"));

const sandbox = {};
new Function("window", fs.readFileSync(path.join(ROOT, "menu-data.js"), "utf8"))(sandbox);
const indexPath = path.join(ROOT, "index.html");
const html = fs.readFileSync(indexPath, "utf8");
const base = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
if (!base) throw new Error("index.html has no canonical link");
fs.writeFileSync(indexPath, P.apply(html, sandbox.MENU, base));
console.log("index.html updated: " + sandbox.MENU.length + " sections for " + base);
