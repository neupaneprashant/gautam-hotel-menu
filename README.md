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
### Easiest: the admin page
**Admin page:** https://neupaneprashant.github.io/gautam-hotel-menu/admin/

**Owner, one-time setup**
1. Create a GitHub **fine-grained access key** that can access only this repository, with **Repository permissions → Contents: Read and write**. The sign-in page links to the GitHub page and explains each step.
2. On the admin page, open the **Owner access key** tab, paste the key and sign in.
3. Tap **Staff logins** and add an email address and a password (12+ characters) for each person who may edit the menu.

**Staff, every day**
1. Sign in with your **email and password**.
2. Find a dish, then change its price, name, veg/non-veg mark, description or "Also known as" names. You can also add, delete or reorder dishes and sections.
3. Tap **Publish**. The live menu updates in about a minute.

**How the logins work:** `admin/accounts.json` holds, for each email, a copy of the owner's key locked with that person's password (PBKDF2-SHA256, 600,000 rounds, then AES-256-GCM). Passwords are never stored anywhere. The file is public, so use long passwords.
- **Removing someone:** in **Staff logins**, remove them. Their saved sign-in is cleared the next time they open the page.
- **If a password or phone may have been exposed:** delete the key on GitHub. That switches off every login at once. Then make a new key and re-add the logins.

**Search names:** dishes are found by their name, section, price-table columns ("chicken chilli momo" finds Momo → Chicken → Chilli) and any **Also known as** names you add in the admin.

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

## Search engines
- `index.html` contains a plain-HTML copy of the whole menu plus Google menu data (schema.org `Restaurant` and `Menu`), between the `PRERENDER` markers, so search engines can read every dish and price without running JavaScript. The admin page refreshes this copy on every **Publish**. After editing `menu-data.js` by hand, run `node tools/prerender.js`.
- Getting found (owner): add the site to Google Search Console, submit `sitemap.xml`, and use the menu link as the **Menu** link on the hotel's Google Business Profile and on gautamhotel.com.np.

## Custom web address (e.g. menu.gautamhotel.com.np)
1. Whoever manages the gautamhotel.com.np domain adds this DNS record: **CNAME** `menu` → `neupaneprashant.github.io`
2. In this repository, go to **Settings → Pages → Custom domain**, enter `menu.gautamhotel.com.np`, save, and tick **Enforce HTTPS** once it becomes available.
3. Update the address in the code: canonical, sitemap and QR code (`python3 qr/make_qr.py https://menu.gautamhotel.com.np/`).

The old github.io link redirects to the new address automatically, so printed QR codes keep working.

