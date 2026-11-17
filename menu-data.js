/*
 * Gautam Hotel, Bardibas-14, Mahottari: menu data.
 * Transcribed from the printed menu card. Prices are in Nepali Rupees (Rs.).
 *
 * Item format: [name, price, diet, description]
 *   price: a number, a string such as "185 / 380" for two portion/type prices,
 *          (sections with `sizes`, e.g. Hard Drinks, take one price per size:
 *           null = not served in that size, "ask" = confirm with staff),
 *          an array when the section has `cols` (one price per column),
 *          or null when the price must be confirmed with staff.
 *   diet:  "v" = vegetarian, "n" = non-vegetarian, "b" = both options available,
 *          omitted for drinks and others where it does not apply.
 * To change a price, edit the number here; the website updates automatically.
 */
window.MENU = [
  /* ───────────── BREAKFAST & LIGHT ───────────── */
  {
    id: "breakfast", group: "food", title: "Breakfast",
    tagline: "Start the day right",
    items: [
      ["Bread Toast", 95, "v"],
      ["Omelette Toast", 185, "n"],
      ["Butter Toast", 120, "v"],
      ["Toast Butter Jam", 145, "v"],
      ["Egg Toast", 185, "n"],
      ["Honey / Apple / Banana Pancake", 220, "v"],
      ["Puri with Sabji", 230, "v"],
      ["Cornflakes with Milk", 250, "v"],
      ["Oats Milk", 250, "v"],
      ["Special Breakfast (Buffet)", 500, "b"],
      ["Normal Breakfast", 375, "b"]
    ]
  },
  {
    id: "soup", group: "food", title: "Soup",
    tagline: "Warm bowls, veg / non-veg",
    items: [
      ["Clear Soup (Veg / Non-Veg)", "220 / 280", "b"],
      ["Hot and Sour (Veg / Non-Veg)", "220 / 280", "b"],
      ["Chicken Mushroom", 250, "n"],
      ["Chicken", 250, "n"],
      ["Mutton", 280, "n"],
      ["Vegetable", 220, "v"],
      ["Mushroom", 220, "v"],
      ["Manchow (Veg / Non-Veg)", "280 / 340", "b"],
      ["Lemon Coriander (Veg / Non-Veg)", "230 / 300", "b"],
      ["Sweet Corn (Veg / Non-Veg)", "250 / 310", "b"]
    ]
  },

  /* ───────────── NEPALI ───────────── */
  {
    id: "nepali-thali", group: "food", title: "Nepali Lunch & Dinner",
    tagline: "Traditional dal bhat sets",
    items: [
      ["Veg Rice Set", 310, "v"],
      ["Local Chicken Rice Set", 560, "n"],
      ["Broiler Chicken Rice Set", 435, "n"],
      ["Mutton Rice Set", 560, "n"],
      ["Fish Rice Set", 560, "n"],
      ["Dhido with Local Chicken", 620, "n"],
      ["Egg Curry Rice Set", 435, "n"],
      ["Special Veg Rice Set", 620, "v", "Rice, dal fry, mattar paneer, saag, papad, salad, bhujiya, pickle, dessert"],
      ["Special Non-Veg Rice Set", 810, "n", "Rice, dal fry, meat, saag, papad, salad, bhujiya, pickle, dessert"]
    ]
  },
  {
    id: "momo", group: "food", title: "Momo",
    tagline: "Nepal's favourite dumplings",
    cols: ["Steam", "Fried / Kothey", "Chilli"],
    items: [
      ["Chicken", [205, 210, 275], "n"],
      ["Veg", [150, 170, 170], "v"],
      ["Paneer", [205, 210, 275], "v"]
    ],
    extra: [
      ["Momo Sadeko (Veg / Non-Veg)", "185 / 380", "b"],
      ["Momo Choila (Veg / Non-Veg)", "185 / 380", "b"]
    ]
  },
  {
    id: "chef-momo", group: "food", title: "Chef's Special Momo",
    tagline: "From the tandoor",
    items: [
      ["Veg Tandoori / Afghani Momo", 375, "v"],
      ["Chicken Tandoori / Afghani Momo", 435, "n"]
    ]
  },
  {
    id: "thukpa", group: "food", title: "Thukpa",
    tagline: "Himalayan noodle soup",
    items: [
      ["Veg Thukpa", 150, "v"],
      ["Egg Thukpa", 185, "n"],
      ["Chicken Thukpa", 205, "n"],
      ["Mutton Thukpa", 365, "n"],
      ["Mixed Thukpa", 405, "n"]
    ]
  },
  {
    id: "nonveg-snacks", group: "food", title: "Non-Veg Snacks",
    tagline: "Sekuwa, choila, tas & more",
    items: [
      ["Mutton Boiled", 620, "n"],
      ["Chicken Boiled", 435, "n"],
      ["Mutton Sekuwa", 620, "n"],
      ["Mutton Tas", 620, "n"],
      ["Mutton Choila", 685, "n"],
      ["Mutton Sekuwa Set", 685, "n"],
      ["Mutton Tas Set", 685, "n"],
      ["Local Chicken Tas", 625, "n"],
      ["Local Chicken Tas Set", 685, "n"],
      ["Broiler Chicken Tas", 465, "n"],
      ["Broiler Chicken Sekuwa", 500, "n"],
      ["Local Chicken Khaja Set", 685, "n"],
      ["Chicken Sadeko", 475, "n"],
      ["Head Boiled (Mutton)", 490, "n"],
      ["Head Fry (Mutton)", 490, "n"],
      ["Has (Duck) Choila", 490, "n"],
      ["Local Chicken Choila", 685, "n"],
      ["Local Chicken Ghattey Fry", 685, "n"],
      ["Chicken Roast (Full / Half)", "1245 / 745", "n"],
      ["Mutton Fry", 560, "n"],
      ["Local Chicken Fry", 560, "n"],
      ["Special Fish Fry", 620, "n"],
      ["Fish Fry", 560, "n"],
      ["Tawa Fish Fry", 620, "n"],
      ["Fish Boiled", 620, "n"],
      ["Chicken Sausage Fry", 465, "n"]
    ]
  },
  {
    id: "veg-snacks", group: "food", title: "Vegetable Snacks",
    tagline: "Pakauda, sadeko & salads",
    items: [
      ["French Fries", 280, "v"],
      ["Veg Boiled", 220, "v"],
      ["Sweet Corn Fry", 375, "v"],
      ["Sweet Corn Pakauda", 435, "v"],
      ["Onion Pakauda", 220, "v"],
      ["Veg Pakauda", 220, "v"],
      ["Veg Tempura", 250, "v"],
      ["Paneer Pakauda", 415, "v"],
      ["Cheese Ball", 340, "v"],
      ["Alu Sadeko", 220, "v"],
      ["Alu Jeera", 220, "v"],
      ["Piro Alu", 310, "v"],
      ["Peanuts Sadeko", 220, "v"],
      ["Bhatmas Sadeko", 220, "v"],
      ["Kaju Fry", 500, "v"],
      ["Dry / Fry Papad", 45, "v"],
      ["Masala Papad", 250, "v"],
      ["Nepali Salad", 230, "v"],
      ["Fruits Salad", 250, "v"],
      ["Russian Salad", 310, "v"],
      ["Veg Khaja Set", 435, "v"]
    ]
  },
  {
    id: "gautam-special", group: "food", title: "Gautam Special Snacks (Veg)",
    tagline: "House favourites",
    items: [
      ["Honey Chilli Potato", 280, "v"],
      ["Chilli Potato", 220, "v"],
      ["Veg Salt & Pepper", 200, "v"],
      ["Crispy Veg", 325, "v"],
      ["Corn Chilli", 435, "v"],
      ["Chilli Paneer", 435, "v"],
      ["Chilli Mushroom", 375, "v"],
      ["Veg Manchurian", 310, "v"]
    ]
  },
  {
    id: "platter", group: "food", title: "Chef's Special Platter",
    tagline: "Perfect for sharing",
    items: [
      ["Non-Veg Platter", 995, "n", "Leg piece fry, sausage fry, kothey momo, poached egg, chicken salad, prawn chips"],
      ["Veg Platter", 810, "v", "Crispy veg, paneer finger, Russian salad, kothey momo, sweet corn pakauda, piro alu, peanuts sadeko"]
    ]
  },

  /* ───────────── CHINESE ───────────── */
  {
    id: "nonveg-chinese", group: "food", title: "Non-Veg (Chinese Starters)",
    tagline: "Indo-Chinese favourites",
    items: [
      ["Dragon Chicken", 510, "n"],
      ["Chicken Spring Roll", 405, "n"],
      ["Chicken Manchurian", 530, "n"],
      ["Chicken Salt & Pepper", 435, "n"],
      ["Chilli Chicken Dry (Boneless / Bone)", "500 / 435", "n"],
      ["Chicken Lollipop", 455, "n"],
      ["Chicken Drumsticks", 455, "n"],
      ["Chicken Leg Piece (per piece)", 340, "n"],
      ["Crispy Chicken", 500, "n"],
      ["KFC-Style Fried Chicken", 745, "n"],
      ["Fish Finger", 560, "n"],
      ["Fish Chilli", 560, "n"]
    ]
  },
  {
    id: "rice-noodles", group: "food", title: "Rice / Noodles",
    tagline: "Chowmein, fried rice & more",
    cols: ["Veg", "Chicken", "Mix"],
    items: [
      ["Chowmein", [150, 205, 310], "b"],
      ["Fried Rice", [220, 340, 405], "b"],
      ["Chilli Garlic Fried Rice", [250, 365, 435], "b"],
      ["Szechwan Fried Rice", [220, 350, 435], "b"],
      ["Hakka Noodles (Normal)", [220, 340, 435], "b"],
      ["Chilli Garlic Noodles", [230, 295, 350], "b"],
      ["Szechwan Noodles", [220, 350, 400], "b"],
      ["Keema Noodles", [220, 310, 340], "b"],
      ["Rice Noodles Shanghai", [250, 335, 375], "b"]
    ]
  },
  {
    id: "chinese-veg-gravy", group: "food", title: "Chinese Veg Gravy",
    tagline: "Saucy & spicy",
    items: [
      ["Veg Manchurian Gravy", 340, "v"],
      ["Mix Veg Hot Garlic", 340, "v"],
      ["Chilli Paneer Gravy", 465, "v"],
      ["Chilli Mushroom Gravy", 435, "v"]
    ]
  },
  {
    id: "chinese-nonveg-gravy", group: "food", title: "Non-Veg Gravy (Chinese)",
    tagline: "Wok-tossed in rich sauces",
    items: [
      ["Chicken Manchurian Gravy", 560, "n"],
      ["Chilli Chicken Gravy", 560, "n"],
      ["Chicken Hot & Garlic", 465, "n"],
      ["Lemon Chicken", 465, "n"],
      ["Chicken Szechwan", 465, "n"],
      ["Fish Chilli Gravy", 560, "n"]
    ]
  },
  {
    id: "chop-suey", group: "food", title: "Chop Suey",
    tagline: "Chicken / mutton / mix non-veg",
    items: [
      ["American Chop Suey (Chicken / Mutton / Mix)", null, "n"],
      ["Chinese Chop Suey (Chicken / Mutton / Mix)", 410, "n"]
    ]
  },

  /* ───────────── INDIAN ───────────── */
  {
    id: "tandoori-veg", group: "food", title: "Tandoori Snacks (Veg)",
    tagline: "Fresh from the clay oven",
    items: [
      ["Veg Seekh Kabab", 340, "v"],
      ["Hara Bhara Kabab", 375, "v"],
      ["Paneer Tikka", 465, "v"],
      ["Paneer Achaari Tikka", 500, "v"],
      ["Mushroom Tikka", 435, "v"],
      ["Tandoori Alu", 405, "v"],
      ["Stuffed Mushroom Tikka", 475, "v"],
      ["Chef's Special Dahi Kabab", 435, "v"]
    ]
  },
  {
    id: "tandoori-nonveg", group: "food", title: "Tandoori Snacks (Non-Veg)",
    tagline: "Smoky, char-grilled classics",
    items: [
      ["Chicken Tikka", 465, "n"],
      ["Chicken Hariyali Tikka", 500, "n"],
      ["Tandoori Chicken (Full / Half)", "1245 / 745", "n"],
      ["Wings Tandoori", 810, "n"],
      ["Chicken Seekh Kabab", 465, "n"],
      ["Afghani Chicken (Full / Half)", "1245 / 745", "n"],
      ["Chicken Angara", 500, "n"],
      ["Chicken Lasuni Tikka", 560, "n"],
      ["Achaar Chicken Tikka", 560, "n"],
      ["Fish Tikka", 620, "n"],
      ["Chicken Butter Tandoori", 1370, "n"]
    ]
  },
  {
    id: "indian-nonveg", group: "food", title: "Indian (Non-Veg Curries)",
    tagline: "Rich gravies & curries",
    items: [
      ["Chicken Butter Masala", 500, "n"],
      ["Chicken Tikka Masala", 500, "n"],
      ["Chicken Malai Kabab", 595, "n"],
      ["Chicken Korma", 595, "n"],
      ["Cream Chicken", 595, "n"],
      ["Mutton Shahi Korma", 620, "n"],
      ["Mutton Dopyaza", 620, "n"],
      ["Mutton Gravy", 560, "n"],
      ["Broiler Chicken Gravy", 475, "n"],
      ["Local Chicken Gravy", 595, "n"],
      ["Fish Gravy", 560, "n"],
      ["Egg Curry", 310, "n"],
      ["Egg Masala", 375, "n"],
      ["Butter Chicken", 560, "n"]
    ]
  },
  {
    id: "veg-gravy-indian", group: "food", title: "Veg Gravy (Indian)",
    tagline: "Paneer, dal & seasonal veg",
    items: [
      ["Paneer Lababdar", 490, "v"],
      ["Kadai Paneer", 560, "v"],
      ["Paneer Tikka Masala", 500, "v"],
      ["Shahi Paneer", 490, "v"],
      ["Malai Kofta", 530, "v"],
      ["Palak Paneer", 465, "v"],
      ["Mattar Paneer", 465, "v"],
      ["Paneer Butter Masala", 490, "v"],
      ["Mushroom Paneer", 465, "v"],
      ["Chana Masala", 220, "v"],
      ["Dal Tadka", 170, "v"],
      ["Alu Mattar", 310, "v"],
      ["Alu Gobi Masala", 340, "v"],
      ["Dal Makhani", 340, "v"],
      ["Paneer Methi Malai", 500, "v"]
    ]
  },
  {
    id: "biryani", group: "food", title: "Pulau / Biryani",
    tagline: "Fragrant, slow-cooked rice",
    items: [
      ["Vegetable", 340, "v"],
      ["Broiler Chicken", 465, "n"],
      ["Local Chicken", 560, "n"],
      ["Chicken Hyderabadi Biryani", 560, "n"],
      ["Mutton", 560, "n"],
      ["Egg", 375, "n"],
      ["Kashmiri Pulau", 535, "v"],
      ["Handi Biryani (Chicken / Paneer)", 685, "b"]
    ]
  },
  {
    id: "naan", group: "food", title: "Naan",
    tagline: "Baked in the tandoor",
    items: [
      ["Plain Naan", 125, "v"],
      ["Butter Naan", 185, "v"],
      ["Alu Naan", 200, "v"],
      ["Keema Naan", 250, "n"],
      ["Paneer Naan", 250, "v"],
      ["Kulcha Naan (Alu / Gobi)", 220, "v"],
      ["Kulcha Naan (Paneer)", null, "v"]
    ]
  },
  {
    id: "roti", group: "food", title: "Roti / Paratha",
    tagline: "Fresh breads",
    items: [
      ["Missi Roti", 65, "v"],
      ["Tawa Roti", 30, "v"],
      ["Butter Roti", 40, "v"],
      ["Tandoori Roti", 55, "v"],
      ["Plain Paratha", 125, "v"],
      ["Alu Paratha", 160, "v"],
      ["Veg Paratha", 160, "v"],
      ["Paneer Paratha", 220, "v"],
      ["Lachha Paratha", 160, "v"]
    ]
  },
  {
    id: "raita", group: "food", title: "Raita",
    tagline: "Cool yoghurt sides",
    items: [
      ["Plain Dahi", 100, "v"],
      ["Alu Raita", 185, "v"],
      ["Mix Raita", 185, "v"],
      ["Pineapple Raita", 185, "v"],
      ["Boondi Raita", 185, "v"]
    ]
  },

  /* ───────────── CONTINENTAL / FAST FOOD ───────────── */
  {
    id: "burger", group: "food", title: "Burger",
    tagline: "Stacked & juicy",
    items: [
      ["Chicken Burger", 250, "n"],
      ["Cheese Burger", 250, "v"],
      ["Vegetable Burger", 220, "v"]
    ]
  },
  {
    id: "pizza", group: "food", title: "Pizza",
    tagline: "Hot from the oven",
    items: [
      ["Simply Veg", 335, "v"],
      ["Chicken / Sausage", 435, "n"],
      ["Margherita (Cheese)", 435, "v"],
      ["Mushroom (Funghi Pizza)", 350, "v"],
      ["Mixed", 465, "n"],
      ["Paneer Tikka", 475, "v"],
      ["Chicken Tikka", 500, "n"]
    ]
  },
  {
    id: "pasta", group: "food", title: "Pasta: Penne / Spaghetti",
    tagline: "Choice of sauce",
    cols: ["Veg", "Chicken"],
    items: [
      ["Aglio Olio", [200, 250], "b"],
      ["Alfredo Sauce", [225, 285], "b"],
      ["Arrabbiata Sauce", [225, 285], "b"],
      ["Pink Sauce", [235, 285], "b"]
    ],
    extra: [
      ["Keema Spaghetti", 310, "n"],
      ["Keema Penne", 310, "n"]
    ]
  },
  {
    id: "sizzler", group: "food", title: "Sizzler",
    tagline: "Served smoking hot",
    items: [
      ["Chicken Sizzler", 745, "n"],
      ["Veg Sizzler", null, "v"],
      ["Fish Sizzler", null, "n"],
      ["Paneer Sizzler", null, "v"]
    ]
  },
  {
    id: "sandwich", group: "food", title: "Sandwich / Cutlet",
    tagline: "Quick bites",
    items: [
      ["Vegetable Sandwich", 220, "v"],
      ["Chicken Sandwich", 280, "n"],
      ["Egg Sandwich", 250, "n"],
      ["Cheese Sandwich", 280, "v"],
      ["Vegetable Cutlet", 280, "v"],
      ["Chicken Cutlet", 500, "n"]
    ]
  },
  {
    id: "baby", group: "food", title: "Baby Menu",
    tagline: "Gentle meals for little ones",
    items: [
      ["Jaulo", 185, "v"],
      ["Carrot Potato Rice", 250, "v"],
      ["Apple Banana Porridge", 250, "v"],
      ["Oats Milk", 250, "v"],
      ["Daal Khichadi", 185, "v"]
    ]
  },

  /* ───────────── DRINKS ───────────── */
  {
    id: "hot-coffee", group: "drinks", title: "Hot Espresso Beverages",
    tagline: "Freshly pulled espresso",
    items: [
      ["Espresso", 125],
      ["Doppio Espresso", 175],
      ["Cappuccino", 200],
      ["Americano", 155],
      ["Americano Double Shot", 195],
      ["Café Latte", 185],
      ["Caramel Latte", 250],
      ["Honey Latte", 250],
      ["Latte Macchiato", 220],
      ["Café Mocha", 245],
      ["Mocha Madness", 310]
    ]
  },
  {
    id: "iced-coffee", group: "drinks", title: "Iced / Blended Espresso",
    tagline: "Chilled coffee",
    items: [
      ["Iced Americano", 150],
      ["Iced Latte", 160],
      ["Iced Cappuccino", 165],
      ["Iced Mocha", 230],
      ["Iced Caramel Macchiato", 245]
    ]
  },
  {
    id: "tea", group: "drinks", title: "Tea, Lassi & Coffee Alternatives",
    tagline: "Chiya, lassi & shakes",
    items: [
      ["Hot Chocolate", 190],
      ["Hot Lemon", 45],
      ["Hot Lemon with Honey", 105],
      ["Ginger Lemon with Honey", 125],
      ["Tulsi Tea", 80],
      ["Herbal Tea", 80],
      ["Masala Tea", 80],
      ["Green Tea", 80],
      ["Milk Tea", 45],
      ["Black Tea", 35],
      ["Fresh Lemonade", 115],
      ["Vanilla / Chocolate Milkshake", 250],
      ["Plain / Sweet / Salty Lassi", 190],
      ["Banana Lassi", 250],
      ["Apple / Lemon / Peach Iced Tea", 150]
    ]
  },
  {
    id: "juice", group: "drinks", title: "Fresh Seasonal Juice",
    tagline: "Pressed to order",
    items: [
      ["Apple Juice", 310],
      ["Orange Juice", 310],
      ["Watermelon Juice", 310],
      ["Pineapple Juice", 310],
      ["Pomegranate Juice", 375],
      ["Mix Juice", 375]
    ]
  },
  {
    id: "mocktail", group: "drinks", title: "Mocktail",
    tagline: "Alcohol-free & fun",
    items: [
      ["Fruit Punch", 310],
      ["Shirley Temple", 250],
      ["Virgin Zombie", 250]
    ]
  },
  {
    id: "cold", group: "drinks", title: "Cold Beverages",
    tagline: "Soft drinks, water & ice-cream",
    items: [
      ["Coke / Fanta / Sprite / Slice", null],
      ["Soda (250 ml)", null],
      ["Fresh Lemon Soda (250 ml)", null],
      ["Mineral Water", 55],
      ["Real Juice (Big)", 450],
      ["Red Bull (Blue)", 400],
      ["Can Juice", 185],
      ["Badam Juice", 185],
      ["Jumbo 2.25 L", 390],
      ["Jumbo 1.5 L", 310],
      ["Ice-Cream Cup (All Types)", 100]
    ]
  },
  {
    id: "beer", group: "drinks", title: "Beer",
    tagline: "Chilled & ready",
    items: [
      ["Tuborg", 745],
      ["Carlsberg", 840],
      ["Tuborg 500 ml", 560],
      ["Carlsberg 500 ml", 620],
      ["Budweiser 650 ml", 745],
      ["Budweiser 330 ml", 500],
      ["Gorkha Premium", 655],
      ["Apple Cider", 325]
    ]
  },
  {
    id: "hard-drinks", group: "drinks", title: "Hard Drinks",
    tagline: "Bottle & peg prices · 18+ only",
    /* one price per size; null = not served in that size, "ask" = confirm with staff */
    sizes: ["1000 ml", "750 ml", "375 ml", "180 ml", "90 ml", "60 ml", "30 ml"],
    defaultSize: 5,
    items: [
      ["Absolut Vodka",           [11935, 8390, 4225, 2025, 1015, 695, 350]],
      ["Smirnoff Vodka (Red)",    [11125, 8515, 4290, 2175, 1105, 740, 375]],
      ["Ruslan Vodka",            [null, 3310, 1655, 835, 425, 295, 150]],
      ["Ruslan Ultra",            [null, 3730, 1925, 945, 475, 325, 170]],
      ["8848 Vodka",              [null, 3495, 1750, 900, 455, 305, 185]],
      ["Signature (Red)",         [5830, 4370, 2190, 1095, 545, 375, 195]],
      ["Signature (Green)",       [5220, 4095, 1970, 980, 490, 330, 170]],
      ["Antiquity (Blue)",        [null, 4850, 2485, 1305, 660, 450, 235]],
      ["Old Durbar (Red)",        [6040, 4675, 2340, 1230, 615, 405, 205]],
      ["Old Durbar (Black)",      [7770, 6040, 3045, 1555, 780, 530, 250]],
      ["Jack Daniel's",           [15660, 11810, 5905, 2970, 1490, 1000, 505]],
      ["Glenfiddich",             [23170, 17405, 8950, 4600, 2360, 1555, 785]],
      ["The Glenlivet",           [18085, 13675, 6960, 3545, 1780, 1195, 610]],
      ["Chivas Regal",            [16285, 12180, 6090, 3045, 1555, 990, 500]],
      ["Johnnie Walker Red Label",          [12770, 9695, 4790, 2425, 1225, 845, 435]],
      ["Johnnie Walker Black Label",        [14670, 11000, 5505, 2653, 1325, 890, 450]],
      ["Johnnie Walker Double Black Label", [17995, 13735, 6875, 3435, 1730, 1155, 585]],
      ["Johnnie Walker Blue Label",         [61530, 52205, null, null, null, null, null]],
      ["Johnnie Walker Green Label",        [20510, 15850, null, null, null, null, null]],
      ["Johnnie Walker Gold Label",         [22375, 18025, null, null, null, null, null]],
      ["VAT 69",                  [10350, 8575, 4290, 2175, 935, 745, 375]],
      ["Beefeater Gin",           [12555, 9445, 4725, 2425, 1210, 820, 410]],
      ["Khukri Rum",              [null, 3420, 1710, 860, 450, 310, 160]],
      ["Bardinet VSOP Brandy",    [12180, 9135, 4600, 2300, 1250, 775, 405]],
      ["100 Pipers",              [11560, 8700, 4475, 2240, 1245, 775, 375]],
      ["Dimple",                  [18645, null, null, null, null, null, null]],
      ["Swing",                   [23865, 18335, null, null, null, null, null]],
      ["Yarsa Gumba",             [null, 20510, 10255, 5135, 2575, 1740, 870]]
    ]
  },
  {
    id: "mini-items", group: "drinks", title: "Mini Items",
    tagline: "Small bottles & shots",
    items: [
      ["Johnnie Walker Black Label 200 ml", 3665],
      ["Johnnie Walker Black Label 50 ml", 1055],
      ["Johnnie Walker Red Label 200 ml", 2675],
      ["Johnnie Walker Red Label 50 ml", 785],
      ["Smirnoff Vodka 50 ml", 690],
      ["Beefeater Gin 50 ml", 745],
      ["Absolut Vodka 200 ml", 2425],
      ["Absolut Vodka 500 ml", 6820],
      ["Chivas Regal 500 ml", 8140],
      ["Tequila (per shot)", 810]
    ]
  },
  {
    id: "wine", group: "drinks", title: "Wine",
    tagline: "Per bottle",
    note: "Corkage charge: 25% of the menu rate.",
    items: [
      ["Jacob's Creek Moscato (Australia)", 3310],
      ["J.P. Chenet Red / White (French)", 3340],
      ["Lindeman's", 3315],
      ["Marques Wine", 2240],
      ["Rawson's Wine", 3730],
      ["Miracle Wine", 2985],
      ["Baron d'Arignac (French)", 3270],
      ["Don Barroso", 3230],
      ["Hinwa Wine Red / White", 1430],
      ["Big Master", 1245]
    ]
  },
  {
    id: "tobacco", group: "drinks", title: "Tobacco",
    tagline: "For adults (18+) only",
    items: [
      ["Surya Cigarette (Red / Light)", 50],
      ["Hookah (Your Choice of Flavour)", 650]
    ]
  }
];
