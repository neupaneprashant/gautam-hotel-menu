/*
 * Nepali (नेपाली) text for the menu: buttons/labels, section names and dish names.
 * Dish names here are the defaults; staff can override any dish in the admin
 * ("Nepali name" box), which is saved with the menu as item[5].
 * Drinks brand names (Tuborg, Jack Daniel's …) stay in English on purpose.
 * Keys: "section-id|English name" for names that need their section, else "English name".
 */
(typeof window !== "undefined" ? window : globalThis).MENU_NE = {
  ui: {
    "Hotel Website": "होटल वेबसाइट",
    "Restaurant & Bar Menu": "रेस्टुरेन्ट तथा बार मेनु",
    "Bardibas-14, Mahottari": "बर्दिबास-१४, महोत्तरी",
    "A vision to serve from the heart": "हृदयदेखि सेवा गर्ने हाम्रो लक्ष्य",
    "Serving you since 2002 A.D.": "सन् २००२ देखि तपाईंको सेवामा",
    "View Menu": "मेनु हेर्नुहोस्",
    "Call to Order": "अर्डरका लागि फोन",
    "Visit Website": "वेबसाइट हेर्नुहोस्",
    "QR": "QR कोड",
    "All": "सबै", "Food": "खाना", "Drinks": "पेय", "Drinks & More": "पेय तथा अन्य",
    "Veg": "शाकाहारी", "Non-veg": "मांसाहारी",
    "Search dishes… e.g. momo, paneer, latte": "परिकार खोज्नुहोस्… जस्तै मोमो, पनिर, चिया",
    "No dishes match your search. Try another word.": "खोजसँग मिल्ने परिकार भेटिएन। अर्को शब्द प्रयोग गर्नुहोस्।",
    "Ask staff": "कर्मचारीलाई सोध्नुहोस्", "Ask": "सोध्नुहोस्",
    "Rs": "रु",
    "Item": "परिकार", "Drink": "पेय",
    "Choose a size": "साइज छान्नुहोस्",
    "Not available in this size": "यो साइजमा उपलब्ध छैन",
    "Vegetarian": "शाकाहारी", "Non-vegetarian": "मांसाहारी", "Veg & non-veg options": "शाकाहारी तथा मांसाहारी दुवै",
    "Veg and non-veg options": "शाकाहारी तथा मांसाहारी दुवै", "Please ask staff": "कर्मचारीलाई सोध्नुहोस्",
    "Language": "भाषा",
    "All prices are in Nepali Rupees (Rs.). Prices may change; please ask our staff for today's specials.":
      "सबै मूल्य नेपाली रुपैयाँमा छन्। मूल्य परिवर्तन हुन सक्छ; आजको विशेष परिकारबारे कर्मचारीलाई सोध्नुहोस्।",
    "Visit Gautam Hotel Bardibas →": "गौतम होटल बर्दिबासको वेबसाइट →",
    "Menu QR code": "मेनु QR कोड",
    "Scan for our menu": "हाम्रो मेनु हेर्न स्क्यान गर्नुहोस्",
    "Point a phone camera at the code to open this menu.": "मेनु खोल्न फोनको क्यामेरा यो कोडतिर देखाउनुहोस्।",
    "Save QR": "QR सेभ गर्नुहोस्", "Share link": "लिंक सेयर गर्नुहोस्", "Print table card": "टेबल कार्ड प्रिन्ट गर्नुहोस्",
    "Link copied ✓": "लिंक कपी भयो ✓",
    "Gautam Hotel, Bardibas · Food & Drinks Menu": "गौतम होटल, बर्दिबास · खाना तथा पेय मेनु"
  },

  cols: {
    "Steam": "स्टिम", "Fried / Kothey": "फ्राइड / कोठे", "Chilli": "चिल्ली",
    "Veg": "भेज", "Chicken": "चिकेन", "Mix": "मिक्स"
  },

  sections: {
    "breakfast": ["बिहानको खाजा", "दिनको राम्रो सुरुवात"],
    "soup": ["सुप", "तातो सुप, भेज / ननभेज"],
    "nepali-thali": ["नेपाली खाना (दिउँसो र बेलुका)", "परम्परागत दाल भात सेट"],
    "momo": ["मोमो", "नेपालीहरूको मनपर्ने परिकार"],
    "chef-momo": ["सेफ स्पेसल मोमो", "तन्दुरमा पकाइएको"],
    "thukpa": ["थुक्पा", "हिमाली चाउचाउ सुप"],
    "nonveg-snacks": ["ननभेज खाजा", "सेकुवा, छोयला, तास र अन्य"],
    "veg-snacks": ["भेज खाजा", "पकौडा, सादेको र सलाद"],
    "gautam-special": ["गौतम स्पेसल खाजा (भेज)", "हाम्रो विशेष परिकार"],
    "platter": ["सेफ स्पेसल प्लाटर", "मिलेर खान उत्तम"],
    "nonveg-chinese": ["ननभेज (चाइनिज स्टार्टर)", "इन्डो-चाइनिज मनपर्ने परिकार"],
    "rice-noodles": ["भात / चाउचाउ", "चाउमिन, फ्राइड राइस र अन्य"],
    "chinese-veg-gravy": ["चाइनिज भेज ग्रेभी", "रसिलो र पिरो"],
    "chinese-nonveg-gravy": ["ननभेज ग्रेभी (चाइनिज)", "स्वादिलो ससमा पकाइएको"],
    "chop-suey": ["चप्सुई", "चिकेन / मटन / मिक्स ननभेज"],
    "tandoori-veg": ["तन्दुरी खाजा (भेज)", "माटोको तन्दुरबाट ताजा"],
    "tandoori-nonveg": ["तन्दुरी खाजा (ननभेज)", "आगोमा पोलेको स्वादिलो परिकार"],
    "indian-nonveg": ["इन्डियन (ननभेज करी)", "गाढा ग्रेभी र करी"],
    "veg-gravy-indian": ["भेज ग्रेभी (इन्डियन)", "पनिर, दाल र मौसमी तरकारी"],
    "biryani": ["पुलाउ / बिरयानी", "सुगन्धित, बिस्तारै पकाइएको भात"],
    "naan": ["नान", "तन्दुरमा पकाइएको"],
    "roti": ["रोटी / पराठा", "ताजा रोटी"],
    "raita": ["रायता", "चिसो दहीका परिकार"],
    "burger": ["बर्गर", "ठूलो र रसिलो"],
    "pizza": ["पिज्जा", "ओभनबाट तातो"],
    "pasta": ["पास्ता: पेन्ने / स्पागेटी", "मनपर्ने सस छान्नुहोस्"],
    "sizzler": ["सिज्लर", "धुवाँ निस्कँदै तातो पस्किइने"],
    "sandwich": ["स्यान्डविच / कटलेट", "छिटो खाजा"],
    "baby": ["बच्चाको खाना", "साना नानीहरूका लागि हल्का खाना"],
    "hot-coffee": ["तातो एस्प्रेसो कफी", "भर्खरै बनाइएको एस्प्रेसो"],
    "iced-coffee": ["आइस्ड / ब्लेन्डेड एस्प्रेसो", "चिसो कफी"],
    "tea": ["चिया, लस्सी र अन्य पेय", "चिया, लस्सी र सेक"],
    "juice": ["ताजा मौसमी जुस", "अर्डरपछि ताजा बनाइने"],
    "mocktail": ["मकटेल", "मदिरारहित पेय"],
    "cold": ["चिसो पेय", "सफ्ट ड्रिंक, पानी र आइसक्रिम"],
    "beer": ["बियर", "चिसो र तयार"],
    "hard-drinks": ["हार्ड ड्रिंक्स", "बोतल र पेगको मूल्य · १८+ मात्र"],
    "mini-items": ["मिनी बोतल", "साना बोतल र सट"],
    "wine": ["वाइन", "प्रति बोतल", "कर्केज शुल्क: मेनु मूल्यको २५%।"],
    "tobacco": ["सुर्तीजन्य", "वयस्क (१८+) का लागि मात्र"]
  },

  items: {
    // breakfast
    "Bread Toast": "ब्रेड टोस्ट", "Omelette Toast": "अम्लेट टोस्ट", "Butter Toast": "बटर टोस्ट",
    "Toast Butter Jam": "टोस्ट बटर जाम", "Egg Toast": "अन्डा टोस्ट", "Honey / Apple / Banana Pancake": "मह / स्याउ / केरा प्यानकेक",
    "Puri with Sabji": "पुरी तरकारी", "Cornflakes with Milk": "दूधसँग कर्नफ्लेक्स", "Oats Milk": "ओट्स दूध",
    "Special Breakfast (Buffet)": "स्पेसल ब्रेकफास्ट (बुफे)", "Normal Breakfast": "साधारण ब्रेकफास्ट",
    // soup
    "Clear Soup (Veg / Non-Veg)": "क्लियर सुप (भेज / ननभेज)", "Hot and Sour (Veg / Non-Veg)": "हट एन्ड सावर सुप (भेज / ननभेज)",
    "soup|Chicken Mushroom": "चिकेन च्याउ सुप", "soup|Chicken": "चिकेन सुप", "soup|Mutton": "खसीको सुप",
    "soup|Vegetable": "तरकारी सुप", "soup|Mushroom": "च्याउको सुप", "Manchow (Veg / Non-Veg)": "मन्चाउ सुप (भेज / ननभेज)",
    "Lemon Coriander (Veg / Non-Veg)": "कागती धनिया सुप (भेज / ननभेज)", "Sweet Corn (Veg / Non-Veg)": "स्वीट कर्न सुप (भेज / ननभेज)",
    // nepali thali
    "Veg Rice Set": "भेज खाना सेट", "Local Chicken Rice Set": "लोकल कुखुराको खाना सेट", "Broiler Chicken Rice Set": "ब्रोइलर कुखुराको खाना सेट",
    "Mutton Rice Set": "खसीको मासुको खाना सेट", "Fish Rice Set": "माछाको खाना सेट", "Dhido with Local Chicken": "लोकल कुखुरासँग ढिँडो",
    "Egg Curry Rice Set": "अन्डा करी खाना सेट", "Special Veg Rice Set": "स्पेसल भेज खाना सेट", "Special Non-Veg Rice Set": "स्पेसल ननभेज खाना सेट",
    // momo
    "momo|Chicken": "चिकेन मोमो", "momo|Veg": "भेज मोमो", "momo|Paneer": "पनिर मोमो",
    "Momo Sadeko (Veg / Non-Veg)": "मोमो सादेको (भेज / ननभेज)", "Momo Choila (Veg / Non-Veg)": "मोमो छोयला (भेज / ननभेज)",
    "Veg Tandoori / Afghani Momo": "भेज तन्दुरी / अफगानी मोमो", "Chicken Tandoori / Afghani Momo": "चिकेन तन्दुरी / अफगानी मोमो",
    // thukpa
    "Veg Thukpa": "भेज थुक्पा", "Egg Thukpa": "अन्डा थुक्पा", "Chicken Thukpa": "चिकेन थुक्पा", "Mutton Thukpa": "मटन थुक्पा", "Mixed Thukpa": "मिक्स थुक्पा",
    // non-veg snacks
    "Mutton Boiled": "उसिनेको खसीको मासु", "Chicken Boiled": "उसिनेको कुखुराको मासु", "Mutton Sekuwa": "खसीको सेकुवा", "Mutton Tas": "खसीको तास",
    "Mutton Choila": "खसीको छोयला", "Mutton Sekuwa Set": "खसीको सेकुवा सेट", "Mutton Tas Set": "खसीको तास सेट", "Local Chicken Tas": "लोकल कुखुराको तास",
    "Local Chicken Tas Set": "लोकल कुखुराको तास सेट", "Broiler Chicken Tas": "ब्रोइलर कुखुराको तास", "Broiler Chicken Sekuwa": "ब्रोइलर कुखुराको सेकुवा",
    "Local Chicken Khaja Set": "लोकल कुखुराको खाजा सेट", "Chicken Sadeko": "चिकेन सादेको", "Head Boiled (Mutton)": "खसीको टाउको (उसिनेको)",
    "Head Fry (Mutton)": "खसीको टाउको (फ्राई)", "Has (Duck) Choila": "हाँसको छोयला", "Local Chicken Choila": "लोकल कुखुराको छोयला",
    "Local Chicken Ghattey Fry": "लोकल कुखुराको घट्टे फ्राई", "Chicken Roast (Full / Half)": "चिकेन रोस्ट (पूरा / आधा)", "Mutton Fry": "खसीको मासु फ्राई",
    "Local Chicken Fry": "लोकल कुखुरा फ्राई", "Special Fish Fry": "स्पेसल माछा फ्राई", "Fish Fry": "माछा फ्राई", "Tawa Fish Fry": "तावा माछा फ्राई",
    "Fish Boiled": "उसिनेको माछा", "Chicken Sausage Fry": "चिकेन ससेज फ्राई",
    // veg snacks
    "French Fries": "फ्रेन्च फ्राइज", "Veg Boiled": "उसिनेको तरकारी", "Sweet Corn Fry": "स्वीट कर्न फ्राई", "Sweet Corn Pakauda": "स्वीट कर्न पकौडा",
    "Onion Pakauda": "प्याज पकौडा", "Veg Pakauda": "तरकारी पकौडा", "Veg Tempura": "भेज टेम्पुरा", "Paneer Pakauda": "पनिर पकौडा",
    "Cheese Ball": "चिज बल", "Alu Sadeko": "आलु सादेको", "Alu Jeera": "आलु जिरा", "Piro Alu": "पिरो आलु", "Peanuts Sadeko": "बदाम सादेको",
    "Bhatmas Sadeko": "भटमास सादेको", "Kaju Fry": "काजु फ्राई", "Dry / Fry Papad": "पापड (सुक्खा / फ्राई)", "Masala Papad": "मसला पापड",
    "Nepali Salad": "नेपाली सलाद", "Fruits Salad": "फलफूल सलाद", "Russian Salad": "रसियन सलाद", "Veg Khaja Set": "भेज खाजा सेट",
    // gautam special
    "Honey Chilli Potato": "हनी चिल्ली आलु", "Chilli Potato": "चिल्ली आलु", "Veg Salt & Pepper": "भेज साल्ट एन्ड पेपर", "Crispy Veg": "क्रिस्पी भेज",
    "Corn Chilli": "कर्न चिल्ली", "Chilli Paneer": "चिल्ली पनिर", "Chilli Mushroom": "चिल्ली च्याउ", "Veg Manchurian": "भेज मन्चुरियन",
    // platter
    "Non-Veg Platter": "ननभेज प्लाटर", "Veg Platter": "भेज प्लाटर",
    // chinese starters
    "Dragon Chicken": "ड्रागन चिकेन", "Chicken Spring Roll": "चिकेन स्प्रिङ रोल", "Chicken Manchurian": "चिकेन मन्चुरियन",
    "Chicken Salt & Pepper": "चिकेन साल्ट एन्ड पेपर", "Chilli Chicken Dry (Boneless / Bone)": "चिल्ली चिकेन ड्राई (हड्डीविना / हड्डीसहित)",
    "Chicken Lollipop": "चिकेन ललिपप", "Chicken Drumsticks": "चिकेन ड्रमस्टिक", "Chicken Leg Piece (per piece)": "चिकेन लेग पिस (प्रति पिस)",
    "Crispy Chicken": "क्रिस्पी चिकेन", "KFC-Style Fried Chicken": "केएफसी-शैली फ्राइड चिकेन", "Fish Finger": "फिस फिंगर", "Fish Chilli": "फिस चिल्ली",
    // rice / noodles
    "Chowmein": "चाउमिन", "Fried Rice": "फ्राइड राइस", "Chilli Garlic Fried Rice": "चिल्ली गार्लिक फ्राइड राइस", "Szechwan Fried Rice": "सेजवान फ्राइड राइस",
    "Hakka Noodles (Normal)": "हक्का नुडल्स (साधारण)", "Chilli Garlic Noodles": "चिल्ली गार्लिक नुडल्स", "Szechwan Noodles": "सेजवान नुडल्स",
    "Keema Noodles": "किमा नुडल्स", "Rice Noodles Shanghai": "राइस नुडल्स साङ्घाई",
    // chinese gravies
    "Veg Manchurian Gravy": "भेज मन्चुरियन ग्रेभी", "Mix Veg Hot Garlic": "मिक्स भेज हट गार्लिक", "Chilli Paneer Gravy": "चिल्ली पनिर ग्रेभी",
    "Chilli Mushroom Gravy": "चिल्ली च्याउ ग्रेभी", "Chicken Manchurian Gravy": "चिकेन मन्चुरियन ग्रेभी", "Chilli Chicken Gravy": "चिल्ली चिकेन ग्रेभी",
    "Chicken Hot & Garlic": "चिकेन हट एन्ड गार्लिक", "Lemon Chicken": "लेमन चिकेन", "Chicken Szechwan": "चिकेन सेजवान", "Fish Chilli Gravy": "फिस चिल्ली ग्रेभी",
    // chop suey
    "American Chop Suey (Chicken / Mutton / Mix)": "अमेरिकन चप्सुई (चिकेन / मटन / मिक्स)", "Chinese Chop Suey (Chicken / Mutton / Mix)": "चाइनिज चप्सुई (चिकेन / मटन / मिक्स)",
    // tandoori
    "Veg Seekh Kabab": "भेज सिख कबाब", "Hara Bhara Kabab": "हरा भरा कबाब", "tandoori-veg|Paneer Tikka": "पनिर टिक्का", "Paneer Achaari Tikka": "पनिर अचारी टिक्का",
    "Mushroom Tikka": "च्याउ टिक्का", "Tandoori Alu": "तन्दुरी आलु", "Stuffed Mushroom Tikka": "स्टफ्ड च्याउ टिक्का", "Chef's Special Dahi Kabab": "सेफ स्पेसल दही कबाब",
    "tandoori-nonveg|Chicken Tikka": "चिकेन टिक्का", "Chicken Hariyali Tikka": "चिकेन हरियाली टिक्का", "Tandoori Chicken (Full / Half)": "तन्दुरी चिकेन (पूरा / आधा)",
    "Wings Tandoori": "तन्दुरी विङ्स", "Chicken Seekh Kabab": "चिकेन सिख कबाब", "Afghani Chicken (Full / Half)": "अफगानी चिकेन (पूरा / आधा)",
    "Chicken Angara": "चिकेन अंगारा", "Chicken Lasuni Tikka": "चिकेन लसुनी टिक्का", "Achaar Chicken Tikka": "अचारी चिकेन टिक्का", "Fish Tikka": "माछा टिक्का",
    "Chicken Butter Tandoori": "चिकेन बटर तन्दुरी",
    // indian curries
    "Chicken Butter Masala": "चिकेन बटर मसला", "Chicken Tikka Masala": "चिकेन टिक्का मसला", "Chicken Malai Kabab": "चिकेन मलाई कबाब",
    "Chicken Korma": "चिकेन कोर्मा", "Cream Chicken": "क्रिम चिकेन", "Mutton Shahi Korma": "मटन शाही कोर्मा", "Mutton Dopyaza": "मटन दोप्याजा",
    "Mutton Gravy": "खसीको मासु (ग्रेभी)", "Broiler Chicken Gravy": "ब्रोइलर कुखुराको मासु (ग्रेभी)", "Local Chicken Gravy": "लोकल कुखुराको मासु (ग्रेभी)",
    "Fish Gravy": "माछाको ग्रेभी", "Egg Curry": "अन्डा करी", "Egg Masala": "अन्डा मसला", "Butter Chicken": "बटर चिकेन",
    // veg curries
    "Paneer Lababdar": "पनिर लबाबदार", "Kadai Paneer": "कडाई पनिर", "Paneer Tikka Masala": "पनिर टिक्का मसला", "Shahi Paneer": "शाही पनिर",
    "Malai Kofta": "मलाई कोफ्ता", "Palak Paneer": "पालुङ्गो पनिर", "Mattar Paneer": "केराउ पनिर", "Paneer Butter Masala": "पनिर बटर मसला",
    "Mushroom Paneer": "च्याउ पनिर", "Chana Masala": "चना मसला", "Dal Tadka": "दाल तड्का", "Alu Mattar": "आलु केराउ", "Alu Gobi Masala": "आलु काउली मसला",
    "Dal Makhani": "दाल मखनी", "Paneer Methi Malai": "पनिर मेथी मलाई",
    // biryani
    "biryani|Vegetable": "भेज पुलाउ / बिरयानी", "biryani|Broiler Chicken": "ब्रोइलर चिकेन बिरयानी", "biryani|Local Chicken": "लोकल चिकेन बिरयानी",
    "Chicken Hyderabadi Biryani": "चिकेन हैदराबादी बिरयानी", "biryani|Mutton": "मटन बिरयानी", "biryani|Egg": "अन्डा बिरयानी",
    "Kashmiri Pulau": "कश्मिरी पुलाउ", "Handi Biryani (Chicken / Paneer)": "हाँडी बिरयानी (चिकेन / पनिर)",
    // naan / roti / raita
    "Plain Naan": "प्लेन नान", "Butter Naan": "बटर नान", "Alu Naan": "आलु नान", "Keema Naan": "किमा नान", "Paneer Naan": "पनिर नान",
    "Kulcha Naan (Alu / Gobi)": "कुल्चा नान (आलु / काउली)", "Kulcha Naan (Paneer)": "कुल्चा नान (पनिर)",
    "Missi Roti": "मिस्सी रोटी", "Tawa Roti": "तावा रोटी", "Butter Roti": "बटर रोटी", "Tandoori Roti": "तन्दुरी रोटी", "Plain Paratha": "प्लेन पराठा",
    "Alu Paratha": "आलु पराठा", "Veg Paratha": "तरकारी पराठा", "Paneer Paratha": "पनिर पराठा", "Lachha Paratha": "लच्छा पराठा",
    "Plain Dahi": "सादा दही", "Alu Raita": "आलु रायता", "Mix Raita": "मिक्स रायता", "Pineapple Raita": "भुइँकटहर रायता", "Boondi Raita": "बुँदी रायता",
    // burger / pizza / pasta / sizzler / sandwich
    "Chicken Burger": "चिकेन बर्गर", "Cheese Burger": "चिज बर्गर", "Vegetable Burger": "भेज बर्गर",
    "pizza|Simply Veg": "सिम्प्ली भेज पिज्जा", "pizza|Chicken / Sausage": "चिकेन / ससेज पिज्जा", "pizza|Margherita (Cheese)": "मार्गेरिटा पिज्जा (चिज)",
    "pizza|Mushroom (Funghi Pizza)": "च्याउ पिज्जा", "pizza|Mixed": "मिक्स पिज्जा", "pizza|Paneer Tikka": "पनिर टिक्का पिज्जा", "pizza|Chicken Tikka": "चिकेन टिक्का पिज्जा",
    "Aglio Olio": "आलियो ओलियो", "Alfredo Sauce": "अल्फ्रेडो सस", "Arrabbiata Sauce": "अराबियाटा सस", "Pink Sauce": "पिंक सस",
    "Keema Spaghetti": "किमा स्पागेटी", "Keema Penne": "किमा पेन्ने",
    "Chicken Sizzler": "चिकेन सिज्लर", "Veg Sizzler": "भेज सिज्लर", "Fish Sizzler": "माछा सिज्लर", "Paneer Sizzler": "पनिर सिज्लर",
    "Vegetable Sandwich": "भेज स्यान्डविच", "Chicken Sandwich": "चिकेन स्यान्डविच", "Egg Sandwich": "अन्डा स्यान्डविच", "Cheese Sandwich": "चिज स्यान्डविच",
    "Vegetable Cutlet": "भेज कटलेट", "Chicken Cutlet": "चिकेन कटलेट",
    // baby
    "Jaulo": "जाउलो", "Carrot Potato Rice": "गाजर आलु भात", "Apple Banana Porridge": "स्याउ केराको लिटो", "Daal Khichadi": "दाल खिचडी",
    // coffee
    "Espresso": "एस्प्रेसो", "Doppio Espresso": "डोप्पियो एस्प्रेसो", "Cappuccino": "क्यापुचिनो", "Americano": "अमेरिकानो",
    "Americano Double Shot": "अमेरिकानो डबल सट", "Café Latte": "क्याफे लाते", "Caramel Latte": "क्यारामेल लाते", "Honey Latte": "हनी लाते",
    "Latte Macchiato": "लाते माकियातो", "Café Mocha": "क्याफे मोका", "Mocha Madness": "मोका म्याडनेस",
    "Iced Americano": "आइस्ड अमेरिकानो", "Iced Latte": "आइस्ड लाते", "Iced Cappuccino": "आइस्ड क्यापुचिनो", "Iced Mocha": "आइस्ड मोका",
    "Iced Caramel Macchiato": "आइस्ड क्यारामेल माकियातो",
    // tea etc.
    "Hot Chocolate": "हट चकलेट", "Hot Lemon": "तातो कागती पानी", "Hot Lemon with Honey": "महसहित तातो कागती पानी",
    "Ginger Lemon with Honey": "अदुवा, कागती र मह", "Tulsi Tea": "तुलसी चिया", "Herbal Tea": "हर्बल चिया", "Masala Tea": "मसला चिया",
    "Green Tea": "ग्रिन टी", "Milk Tea": "दूध चिया", "Black Tea": "कालो चिया", "Fresh Lemonade": "ताजा कागती पानी (लेमनेड)",
    "Vanilla / Chocolate Milkshake": "भेनिला / चकलेट मिल्कसेक", "Plain / Sweet / Salty Lassi": "सादा / गुलियो / नुनिलो लस्सी", "Banana Lassi": "केरा लस्सी",
    "Apple / Lemon / Peach Iced Tea": "स्याउ / कागती / आरु आइस्ड टी",
    // juice / mocktail / cold
    "Apple Juice": "स्याउको जुस", "Orange Juice": "सुन्तलाको जुस", "Watermelon Juice": "खरबुजाको जुस", "Pineapple Juice": "भुइँकटहरको जुस",
    "Pomegranate Juice": "अनारको जुस", "Mix Juice": "मिक्स जुस", "Fruit Punch": "फ्रुट पन्च", "Shirley Temple": "सर्ली टेम्पल", "Virgin Zombie": "भर्जिन जोम्बी",
    "Coke / Fanta / Sprite / Slice": "कोक / फ्यान्टा / स्प्राइट / स्लाइस", "Soda (250 ml)": "सोडा (२५० एमएल)", "Fresh Lemon Soda (250 ml)": "ताजा कागती सोडा (२५० एमएल)",
    "Mineral Water": "मिनरल पानी", "Real Juice (Big)": "रियल जुस (ठूलो)", "Red Bull (Blue)": "रेड बुल (निलो)", "Can Juice": "क्यान जुस",
    "Badam Juice": "बदाम जुस", "Jumbo 2.25 L": "जम्बो २.२५ लिटर", "Jumbo 1.5 L": "जम्बो १.५ लिटर", "Ice-Cream Cup (All Types)": "आइसक्रिम कप (सबै किसिम)",
    // beer / wine / tobacco (brands stay in English)
    "Apple Cider": "एप्पल साइडर", "Tequila (per shot)": "टकिला (प्रति सट)",
    "Surya Cigarette (Red / Light)": "सूर्य चुरोट (रेड / लाइट)", "Hookah (Your Choice of Flavour)": "हुक्का (मनपर्ने फ्लेभर)"
  },

  descs: {
    "Special Veg Rice Set": "भात, दाल फ्राई, केराउ पनिर, साग, पापड, सलाद, भुजिया, अचार, मिठाई",
    "Special Non-Veg Rice Set": "भात, दाल फ्राई, मासु, साग, पापड, सलाद, भुजिया, अचार, मिठाई",
    "Non-Veg Platter": "लेग पिस फ्राई, ससेज फ्राई, कोठे मोमो, पोच अन्डा, चिकेन सलाद, प्रन चिप्स",
    "Veg Platter": "क्रिस्पी भेज, पनिर फिंगर, रसियन सलाद, कोठे मोमो, स्वीट कर्न पकौडा, पिरो आलु, बदाम सादेको"
  },
  desc: function (sec, it) { return (it && it[6]) || this.descs[it[0]] || ""; },

  // Nepali name of a dish: admin override (item[5]) > section-specific default > general default
  name: function (sec, it) {
    if (it && it[5]) return it[5];
    var d = this.items;
    return (sec && d[sec.id + "|" + it[0]]) || d[it[0]] || "";
  },
  section: function (sec) {
    var s = this.sections[sec.id] || [];
    return { title: sec.title_ne || s[0] || "", tagline: sec.tagline_ne || s[1] || "", note: sec.note_ne || s[2] || "" };
  }
};
if (typeof module !== "undefined" && module.exports) module.exports = globalThis.MENU_NE || window.MENU_NE;
