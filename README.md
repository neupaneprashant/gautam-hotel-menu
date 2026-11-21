# Gautam Hotel: Digital Menu

The digital menu for **Gautam Hotel, Bardibas-14, Mahottari** (serving since 2002 A.D.), made from the printed menu card.

It's a static website with no build step or server code. Open `index.html` in a browser or host the folder anywhere (GitHub Pages, Netlify, any web host).

## Features
- Every category and price from the printed menu
- Search box (try "momo", "paneer", "latte")
- Veg / Non-veg filter, using the standard green and red diet marks
- Food / Drinks tabs and a sticky category bar that follows your scroll
- A one-tap call button and contact details
- Built for phones first, so guests can scan a QR code at the table

## Updating prices or dishes
### The admin page (Firebase)
**Admin page:** https://neupaneprashant.github.io/gautam-hotel-menu/admin/

Staff sign in with their **email (e.g. Gmail) and password**, change prices or dishes, and tap **Publish**. Guests see the change straight away.

- **Who can edit:** people listed in Firestore `admins/{email}` with `role` set to `owner` or `editor`. This is enforced by `firestore.rules`, which is pasted into Firebase → Firestore → Rules.
- **Team:** owners use the **Team** button to add people (email, role, password) or remove them. Editors can change the menu but not the team.
- **History:** every publish is saved in `menuHistory`. Use **History** to load an older version, then Publish it.
- **Forgot password?** on the sign-in page sends a reset email.
- **Search engines:** the GitHub Action *Sync menu from Firebase* copies the live menu into `menu-data.js` and `index.html` about every 30 minutes, so Google sees current prices.
- **Firebase project:** `gautam-hotel-admin`, configured in `firebase-config.js` (the values there are public by design).

### By hand
Everything lives in **`menu-data.js`**. Each dish is one line:

```js
["Chicken Thukpa", 205, "n"],        // name, price, diet (v = veg, n = non-veg, b = both)
["Special Veg Rice Set", 620, "v", "Rice, dal fry, ..."],  // optional description
["Veg Sizzler", null, "v"],          // null shows "Ask staff"
```

Hard Drinks lists one price per size, in the order 1000 / 750 / 375 / 180 / 90 / 60 / 30 ml:

```js
["Khukri Rum", [null, 3420, 1710, 860, 450, 310, 160]],  // null = not sold in that size, "ask" = ask staff
```
Phones show a size picker; tablets and computers show the full table.

Save the file and reload the page.

## Files
| File | Purpose |
| --- | --- |
| `index.html` | Page layout |
| `styles.css` | Design |
| `app.js` | Search, filters and rendering |
| `search.js` | Smart search: any word order, spelling variants, Nepali names, small typos |
| `admin/` | Admin page for editing the menu |
| `menu-data.js` | All menu items and prices |
| `logo.png` / `logo.webp` | Official Gautam Hotel logo |
| `favicon-*.png`, `apple-touch-icon.png`, `icon-192.png` | Browser tab and phone home-screen icons |

## Live site
Menu link: **https://neupaneprashant.github.io/gautam-hotel-menu/**

Hosting is GitHub Pages: Settings → Pages → "Deploy from a branch" → `main`, folder `/ (root)`. Every change pushed to `main` goes live within about a minute.

## QR code
`qr/` holds the QR code that points to the address above:
- `menu-qr.png` / `menu-qr.svg`: the QR code alone
- `table-card.pdf` / `table-card.png`: a branded A6 table card, ready to print

If the menu is hosted at a different address, regenerate the QR code with `python3 qr/make_qr.py https://your-new-address/`.

## English / नेपाली
- **The switch:** the **EN | नेपाली** switch sits at the top of the menu and in the footer. It's remembered on each phone, and phones set to Nepali open in Nepali. `?lang=ne` or `?lang=en` in the link forces a language.
- **Default Nepali text:** dish and section names, buttons and labels are in `nepali.js`. Drink brand names stay in English.
- **Corrections:** staff can override any dish in the admin (the **Nepali name** box, saved as item[5]) and any section (**Section name in Nepali**).
- **Search:** works in both languages. कुखुरा, चिकेन and "chicken" find the same dishes.

## Search engines
- `index.html` contains a plain-HTML copy of the whole menu plus Google menu data (schema.org `Restaurant` and `Menu`), between the `PRERENDER` markers, so search engines can read every dish and price without running JavaScript. The admin page refreshes this copy on every **Publish**. After editing `menu-data.js` by hand, run `node tools/prerender.js`.
- Getting found (owner): add the site to Google Search Console, submit `sitemap.xml`, and use the menu link as the **Menu** link on the hotel's Google Business Profile and on gautamhotel.com.np.

## Custom web address (e.g. menu.gautamhotel.com.np)
1. Whoever manages the gautamhotel.com.np domain adds this DNS record: **CNAME** `menu` → `neupaneprashant.github.io`
2. In this repository, go to **Settings → Pages → Custom domain**, enter `menu.gautamhotel.com.np`, save, and tick **Enforce HTTPS** once it becomes available.
3. Update the address in the code: canonical, sitemap and QR code (`python3 qr/make_qr.py https://menu.gautamhotel.com.np/`).

The old github.io link redirects to the new address automatically, so printed QR codes keep working.

