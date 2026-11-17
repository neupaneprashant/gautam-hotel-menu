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
Open **`/admin/`** on the menu site, e.g. https://neupaneprashant.github.io/gautam-hotel-menu/admin/

1. Sign in with a GitHub **fine-grained access key** that can access only this repository, with **Contents: Read and write** permission. The sign-in page explains how to create one.
2. Find a dish, then change its name, price, veg/non-veg mark or description. You can also add, delete or reorder dishes and sections.
3. Tap **Publish**. The live menu updates in about a minute.

The admin page is hidden from search engines and does nothing without a valid key. Anyone who has a key can edit the menu, so give keys only to staff you trust; you can delete a key on GitHub at any time.

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
