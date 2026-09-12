"""Regenerate public/og.jpg — the link-preview card.

A one-off asset, not part of `npm run build`. Run it when the name, the
position or the portrait changes, so the card keeps matching the site.

    python3 -m venv /tmp/og && /tmp/og/bin/pip install fonttools brotli pillow
    /tmp/og/bin/python scripts/og-card.py

It needs IBM Plex Sans 400 and 600 as .ttf in the directory given by
OG_FONT_DIR (default: ./.og-fonts), named PlexSans-400.ttf / PlexSans-600.ttf.
Google Fonts serves TTF to an old user agent:

    curl -A "Mozilla/4.0" \
      "https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,600"

Colours below are the light-theme tokens from src/app/globals.css; the layout
is the homepage hero — name, rule stopping at the photo, position beneath.
"""

import os
import pathlib
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONTS = pathlib.Path(os.environ.get("OG_FONT_DIR", ROOT / ".og-fonts"))

S = 2  # supersample, downscaled at the end
W, H = 1200 * S, 630 * S
PAPER, INK, MUTED, RULE = "#f7f8f9", "#16191c", "#5c656d", "#d7dbdf"
MARGIN, GAP = 72 * S, 48 * S


def face(weight, px):
    return ImageFont.truetype(str(FONTS / f"PlexSans-{weight}.ttf"), px * S)


def main():
    card = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(card)

    photo = Image.open(ROOT / "public/me.webp").convert("RGB")
    pw = 440 * S
    ph = round(pw * photo.height / photo.width)  # native 16:9, no crop
    photo = photo.resize((pw, ph), Image.LANCZOS)
    px, py = W - MARGIN - pw, (H - ph) // 2
    card.paste(photo, (px, py))

    col_w = px - GAP - MARGIN  # the rule stops where the photo starts

    f_name = face(600, 76)
    name_y = 232 * S
    box = d.textbbox((0, 0), "Glenn Feng", font=f_name)
    d.text((MARGIN, name_y), "Glenn Feng", font=f_name, fill=INK)

    rule_y = name_y + (box[3] - box[1]) + 34 * S
    d.rectangle([MARGIN, rule_y, MARGIN + col_w, rule_y + S], fill=RULE)

    f_meta = face(400, 25)
    d.text((MARGIN, rule_y + 26 * S), "Empirical Research Fellow", font=f_meta, fill=MUTED)
    d.text((MARGIN, rule_y + 62 * S), "Northwestern Kellogg", font=f_meta, fill=MUTED)
    d.text((MARGIN, H - MARGIN - 26 * S), "glenntfung.github.io", font=face(400, 22), fill=MUTED)

    out = ROOT / "public/og.jpg"
    card.resize((1200, 630), Image.LANCZOS).save(
        out, "JPEG", quality=92, optimize=True, progressive=True
    )
    print(f"wrote {out.relative_to(ROOT)} ({out.stat().st_size / 1024:.0f} kB)")


if __name__ == "__main__":
    main()
