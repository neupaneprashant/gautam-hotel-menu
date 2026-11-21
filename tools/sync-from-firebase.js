#!/usr/bin/env node
/*
 * Copy the live menu from Firebase (Firestore menu/current) into menu-data.js and the
 * plain-HTML / Google copy inside index.html, so search engines see current prices.
 * Run by .github/workflows/sync-from-firebase.yml. Prints changed=true|false.
 * Optional: FIRESTORE_URL overrides the document URL (tests).
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const Format = require(path.join(ROOT, "menu-format.js"));
require(path.join(ROOT, "nepali.js"));
const Prerender = require(path.join(ROOT, "prerender.js"));

function setOutput(changed) {
  console.log("changed=" + changed);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, "changed=" + changed + "\n");
}

(async () => {
  const cfgBox = {};
  new Function("window", fs.readFileSync(path.join(ROOT, "firebase-config.js"), "utf8"))(cfgBox);
  const C = cfgBox.FIREBASE_CONFIG;
  if (!C) { console.log("Firebase is switched off; nothing to sync."); return setOutput(false); }

  const url = process.env.FIRESTORE_URL ||
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(C.projectId)}/databases/(default)/documents/menu/current?key=${encodeURIComponent(C.apiKey)}`;
  const res = await fetch(url);
  if (res.status === 404) { console.log("No menu in Firebase yet (publish once from the admin page)."); return setOutput(false); }
  if (!res.ok) { console.log("Firebase not reachable or not set up yet: HTTP " + res.status); return setOutput(false); }
  const doc = await res.json();
  const json = doc.fields && doc.fields.json && doc.fields.json.stringValue;
  if (!json) { console.log("menu/current has no json field"); return setOutput(false); }

  const menu = JSON.parse(json);
  if (!Array.isArray(menu) || !menu.length || !menu.every(s => s && s.id && Array.isArray(s.items))) {
    throw new Error("The menu in Firebase doesn't look right; not syncing.");
  }
  const dataPath = path.join(ROOT, "menu-data.js");
  const current = Format.parse(fs.readFileSync(dataPath, "utf8"));
  if (JSON.stringify(current) === JSON.stringify(menu)) { console.log("Already up to date."); return setOutput(false); }

  fs.writeFileSync(dataPath, Format.serialize(menu));
  const indexPath = path.join(ROOT, "index.html");
  const page = fs.readFileSync(indexPath, "utf8");
  const base = (page.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  fs.writeFileSync(indexPath, Prerender.apply(page, menu, base));
  const by = doc.fields.updatedBy ? doc.fields.updatedBy.stringValue : "admin";
  const ver = doc.fields.version ? (doc.fields.version.integerValue || doc.fields.version.doubleValue) : "?";
  console.log(`Updated menu-data.js and index.html to Firebase version ${ver} (by ${by}).`);
  setOutput(true);
})().catch(e => { console.error(e.message); process.exit(1); });
