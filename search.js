/*
 * Menu search: matches words in any order, understands common spellings,
 * Nepali names and small typos.
 *   "chicken chilli"  -> Chilli Chicken Dry, Chilli Chicken Gravy, ...
 *   "chili" / "chilly" -> everything with "Chilli"
 *   "kukhura", "khasi", "chiya", "panner", "chaumin" ...
 * Used by app.js: MenuSearch.parse(query) and MenuSearch.matches(...).
 */
(function () {
  "use strict";

  // spelling variants / local names -> one canonical word
  var SYN = {
    chili: "chilli", chilly: "chilli", chille: "chilli", chilie: "chilli", chillie: "chilli", chilli: "chilli",
    panner: "paneer", panir: "paneer", paner: "paneer",
    chaumin: "chowmein", chowmin: "chowmein", chowmien: "chowmein", chaumein: "chowmein", chawmin: "chowmein",
    biriyani: "biryani", briyani: "biryani", biriani: "biryani", biriyan: "biryani", pulao: "pulau", pilau: "pulau",
    pakoda: "pakauda", pakora: "pakauda", pakaura: "pakauda", pakode: "pakauda",
    tika: "tikka",
    aloo: "alu", alo: "alu", potato: "alu", aaloo: "alu",
    daal: "dal", dhal: "dal", lentil: "dal",
    khasi: "mutton", khashi: "mutton", goat: "mutton",
    kukhura: "chicken", murgh: "chicken", murg: "chicken", chiken: "chicken", chikken: "chicken", chikan: "chicken",
    machha: "fish", maachha: "fish", macha: "fish", machh: "fish", maacha: "fish",
    has: "duck", hans: "duck",
    bhat: "rice", bhaat: "rice", chamal: "rice",
    chiya: "tea", chai: "tea", chiyaa: "tea",
    coffe: "coffee", cofee: "coffee", kofi: "coffee", caffe: "cafe",
    capuccino: "cappuccino", cappucino: "cappuccino", capuchino: "cappuccino", cappuchino: "cappuccino",
    expresso: "espresso",
    whiskey: "whisky", wisky: "whisky",
    kebab: "kabab", kabob: "kabab", kebap: "kabab", kebob: "kabab",
    chapati: "roti", chapatti: "roti", chapathi: "roti",
    parantha: "paratha", parotta: "paratha", parata: "paratha",
    nan: "naan",
    manchuria: "manchurian", manchurin: "manchurian", manchuran: "manchurian",
    sandwitch: "sandwich", sandwhich: "sandwich", sanwich: "sandwich",
    burgur: "burger", burgar: "burger",
    piza: "pizza", pizaa: "pizza",
    sekua: "sekuwa", sekwa: "sekuwa", sekhuwa: "sekuwa",
    choyla: "choila", chhoila: "choila", choela: "choila", chhwela: "choila",
    thupka: "thukpa", thukpaa: "thukpa",
    lasi: "lassi",
    vegetable: "veg", vegitable: "veg", veggie: "veg", vegetarian: "veg", vej: "veg",
    noodle: "noodle", noddle: "noodle", noodel: "noodle",
    softdrink: "soft", coke: "coke", cocacola: "coke",
    beers: "beer", bir: "beer",
    mushroom: "mushroom", mashroom: "mushroom", musroom: "mushroom", chyau: "mushroom",
    egg: "egg", anda: "egg", phul: "egg",
    corn: "corn", makai: "corn",
    juice: "juice", jus: "juice",
    pani: "water"
  };

  // extra words a section can be found by (keyed by section id)
  var SECTION_WORDS = {
    "hard-drinks": "whisky alcohol liquor daru peg bottle spirit drink",
    "mini-items": "whisky alcohol liquor daru drink",
    beer: "alcohol daru drink",
    wine: "alcohol daru drink",
    cold: "soft drink cold water",
    "hot-coffee": "coffee hot drink",
    "iced-coffee": "coffee cold drink",
    tea: "drink hot",
    juice: "drink fresh fruit",
    mocktail: "drink",
    momo: "dumpling",
    "chef-momo": "momo dumpling",
    "nepali-thali": "thali khana lunch dinner set dal rice",
    "rice-noodles": "chinese",
    "nonveg-chinese": "chinese starter",
    "chinese-veg-gravy": "chinese curry",
    "chinese-nonveg-gravy": "chinese curry",
    "tandoori-veg": "tandoor starter",
    "tandoori-nonveg": "tandoor starter",
    "indian-nonveg": "curry gravy",
    "veg-gravy-indian": "curry",
    biryani: "rice",
    naan: "bread",
    roti: "bread",
    "nonveg-snacks": "khaja snack meat starter",
    "veg-snacks": "khaja snack starter",
    "gautam-special": "special snack starter",
    platter: "sharing combo",
    pizza: "fast food",
    burger: "fast food",
    sandwich: "fast food snack",
    baby: "kids child children baby",
    breakfast: "morning",
    tobacco: "smoke cigarette"
  };
  var STOP = { and: 1, with: 1, the: 1, of: 1, a: 1, an: 1, "in": 1, or: 1, ko: 1, ra: 1 };

  function words(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/non[\s-]*veg(etarian)?/g, " nonveg ")
      .replace(/mo\s*:\s*mo/g, "momo")
      .replace(/soft\s+drink/g, "softdrink")
      .replace(/'/g, "")
      .split(/[^a-z0-9]+/)
      .filter(Boolean);
  }
  function canon(w) {
    if (SYN[w]) return SYN[w];
    // simple plural: momos -> momo, fries -> frie (applied the same way on both sides)
    if (w.length > 3 && w.charAt(w.length - 1) === "s" && w.charAt(w.length - 2) !== "s") {
      var s = w.slice(0, -1);
      return SYN[s] || s;
    }
    return w;
  }
  function tokens(text) { return words(text).map(canon); }

  function lev(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      var best = i;
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (cur[j] < best) best = cur[j];
      }
      if (best > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }

  // does one query word match one menu word?
  function wordMatch(q, w) {
    if (w === q) return true;
    if (q.length >= 2 && w.indexOf(q) === 0) return true;          // typing in progress: "chick" -> chicken
    // small typos only for words of 5+ letters, so short words like "beer"/"wine" stay exact
    if (q.length >= 5 && w.length >= 4) {
      var sameStart = q.slice(0, 2) === w.slice(0, 2);
      var max = (q.length >= 8 || sameStart) ? 2 : 1;               // "chikn" -> chicken
      if (lev(q, w, max) <= max) return true;
      if (sameStart && w.length > q.length && lev(q, w.slice(0, q.length), 1) <= 1) return true;   // typo while typing
    }
    return false;
  }

  function parse(query) {
    return tokens(query).filter(function (t) { return !STOP[t]; });
  }

  /* What a dish can be found by. One dish has many names:
   *   the Momo row "Chicken" (Steam / Fried / Kothey / Chilli) is also
   *   "chicken momo", "chicken steam momo", "chicken chilli momo", "kothey chicken momo" ...
   *   "Fried Rice" (Veg / Chicken / Mix) is also "chicken fried rice", "mix fried rice" ...
   *   "Jack Daniel's" (1000 ml … 30 ml) is also "jack daniels 60 ml" ...
   * plus any extra names typed in the admin ("Also known as", item[4]). */
  function labelsOf(item, section) {
    return Array.isArray(item[1]) ? (section.cols || section.sizes || []) : [];
  }
  function baseWords(item, section) {
    return tokens([item[0], item[3] || "", item[4] || "", section.title, SECTION_WORDS[section.id] || ""].join(" "));
  }

  // all query words must be found somewhere in the dish, its other names, its section, its columns or its diet
  function matches(qTokens, item, section) {
    if (!qTokens.length) return true;
    var diet = item[2] === "v" ? "veg" : item[2] === "n" ? "nonveg" : item[2] === "b" ? "veg nonveg" : "";
    var hay = baseWords(item, section).concat(tokens(labelsOf(item, section).join(" ") + " " + diet));
    return qTokens.every(function (q) {
      return hay.some(function (w) { return wordMatch(q, w); });
    });
  }

  // which price columns did the search point at? ("chicken chilli momo" -> the Chilli column)
  function matchedColumns(qTokens, item, section) {
    var labels = labelsOf(item, section);
    if (!qTokens.length || !labels.length) return [];
    var base = baseWords(item, section), scores = [], best = 0;
    labels.forEach(function (lab, k) {
      var lt = tokens(lab);
      // count the query words that point at this column (and aren't already explained by the dish name)
      var n = qTokens.filter(function (q) {
        return lt.some(function (w) { return wordMatch(q, w); }) && !base.some(function (w) { return wordMatch(q, w); });
      }).length;
      scores[k] = n;
      if (n > best) best = n;
    });
    if (!best) return [];
    // "60 ml" -> only the 60 ml column, not every column containing "ml"
    var out = [];
    scores.forEach(function (n, k) { if (n === best) out.push(k); });
    return out.length === labels.length ? [] : out;
  }

  // wrap the matching words of an already-escaped display string in <mark>
  function highlight(escapedHTML, qTokens) {
    if (!qTokens.length) return escapedHTML;
    return escapedHTML.replace(/[A-Za-z0-9À-ɏ']+/g, function (word) {
      var ws = tokens(word);
      var hit = ws.some(function (w) { return qTokens.some(function (q) { return wordMatch(q, w); }); });
      return hit ? "<mark>" + word + "</mark>" : word;
    });
  }

  window.MenuSearch = { parse: parse, matches: matches, matchedColumns: matchedColumns, highlight: highlight, tokens: tokens };
})();
