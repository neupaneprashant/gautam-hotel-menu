"""Generate the menu QR code.

Usage:  python3 qr/make_qr.py [URL]
Needs:  pip install qrcode pillow
Writes qr/menu-qr.png (print size, 1200px) and qr/menu-qr.svg.
"""
import os
import sys

import qrcode
import qrcode.image.svg

URL = sys.argv[1] if len(sys.argv) > 1 else "https://neupaneprashant.github.io/Gautam-Hotel-Menu/"
HERE = os.path.dirname(os.path.abspath(__file__))

qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=40, border=2)
qr.add_data(URL)
qr.make(fit=True)
img = qr.make_image(fill_color="#002b84", back_color="white").convert("RGB")
img = img.resize((1200, 1200))
img.save(os.path.join(HERE, "menu-qr.png"))

svg = qrcode.make(URL, image_factory=qrcode.image.svg.SvgPathImage, error_correction=qrcode.constants.ERROR_CORRECT_H, border=2)
svg.save(os.path.join(HERE, "menu-qr.svg"))
print("QR written for", URL)
