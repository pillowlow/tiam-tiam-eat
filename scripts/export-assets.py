"""Export web assets from the design masters in design/ into public/assets/.

Run from the repo root:  python -I scripts/export-assets.py
Masters (not tracked in git): design/title.png, design/new_theme.jpg, design/gradiant.jpg
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "design"
OUT = ROOT / "public" / "assets"
OUT.mkdir(parents=True, exist_ok=True)

INK = (0x2B, 0x25, 0x22)
CREAM = (0xDB, 0xD7, 0xC5)


def report(path: Path) -> None:
    print(f"  {path.relative_to(ROOT)}  {os.path.getsize(path) / 1024:.0f} KB")


def save_webp(img: Image.Image, name: str, quality: int = 80) -> None:
    path = OUT / name
    img.save(path, "WEBP", quality=quality, method=6)
    report(path)


# ---------------------------------------------------------------- wordmark
def wordmark() -> Image.Image:
    im = Image.open(SRC / "title.png").convert("RGBA")
    a = np.asarray(im)
    alpha = a[..., 3]
    if alpha.min() == 255:
        # White background baked in: derive alpha from darkness, colour = ink.
        lum = a[..., :3].mean(axis=2)
        alpha = np.clip((255 - lum) * 1.15, 0, 255).astype(np.uint8)
        rgb = np.empty_like(a[..., :3])
        rgb[...] = INK
        im = Image.fromarray(np.dstack([rgb, alpha]), "RGBA")
    bbox = im.getbbox()
    im = im.crop(bbox)
    pad = int(im.width * 0.02)
    canvas = Image.new("RGBA", (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0))
    canvas.paste(im, (pad, pad), im)
    print(f"wordmark trimmed to {canvas.size}")
    for width in (800, 1200):
        w = canvas.resize((width, round(canvas.height * width / canvas.width)), Image.LANCZOS)
        w.save(OUT / f"wordmark-{width}.webp", "WEBP", quality=80, alpha_quality=70, method=6)
        report(OUT / f"wordmark-{width}.webp")
    return canvas


# ------------------------------------------------------------------ favicon
def favicon(mark: Image.Image) -> None:
    # 釘 is the first glyph: left ~37 % of the width, top ~34 % of the height.
    w, h = mark.size
    glyph = mark.crop((0, 0, int(w * 0.37), int(h * 0.34)))
    glyph = glyph.crop(glyph.getbbox())
    side = int(max(glyph.size) * 1.3)
    for name, px in (("favicon.png", 64), ("apple-touch-icon.png", 180)):
        bg = Image.new("RGBA", (side, side), CREAM + (255,))
        bg.paste(glyph, ((side - glyph.width) // 2, (side - glyph.height) // 2), glyph)
        small = bg.resize((px, px), Image.LANCZOS)
        p = OUT / name
        small.save(p, "PNG", optimize=True)
        report(p)


# --------------------------------------------------------------- key visual
def keyvisual() -> Image.Image:
    im = Image.open(SRC / "new_theme.jpg").convert("RGB")
    a = np.asarray(im).astype(np.int16)
    minc = a.min(axis=2)  # whiteness: high min channel = near white
    near_white = minc > 238

    # Connected component of near-white pixels touching the top-left corner.
    try:
        from scipy import ndimage

        labels, _ = ndimage.label(near_white)
        region = labels == labels[0, 0] if labels[0, 0] else np.zeros_like(near_white)
        band = ndimage.binary_dilation(region, iterations=24) & ~region
    except ImportError:
        print("scipy missing; falling back to global whiteness mask (check highlights!)")
        region = near_white
        band = np.zeros_like(near_white)

    alpha = np.full(minc.shape, 255, dtype=np.float32)
    alpha[region] = 0
    # Soft edge: inside the band, fade by whiteness between min-channel 200 (opaque) and 245 (clear).
    soft = np.clip((245 - minc[band]) / 45.0, 0, 1) * 255
    alpha[band] = soft
    alpha_img = Image.fromarray(alpha.astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(1.5))

    rgba = im.copy()
    rgba.putalpha(alpha_img)
    # Un-premultiply halo: pull edge colours away from white toward the disc tone.
    bbox = rgba.getbbox()
    rgba = rgba.crop(bbox)
    print(f"keyvisual cropped to {rgba.size}; transparent px: {(alpha == 0).mean():.1%}")
    for width in (1200, 2400):
        r = rgba.resize((width, round(rgba.height * width / rgba.width)), Image.LANCZOS)
        save_webp(r, f"keyvisual-{width}.webp", quality=78 if width == 1200 else 72)
    return rgba


# ----------------------------------------------------------------- gradient
def gradient() -> Image.Image:
    im = Image.open(SRC / "gradiant.jpg").convert("RGB")
    a = np.asarray(im)
    col = a[:, a.shape[1] // 2 - 50 : a.shape[1] // 2 + 50, :].mean(axis=1)
    print("gradient samples (top→bottom):")
    for frac in (0.0, 0.25, 0.5, 0.75, 1.0):
        r, g, b = col[min(int((a.shape[0] - 1) * frac), a.shape[0] - 1)]
        print(f"  {frac:>4.0%}  #{int(r):02X}{int(g):02X}{int(b):02X}")
    small = im.resize((1200, round(im.height * 1200 / im.width)), Image.LANCZOS)
    save_webp(small, "bg-gradient.webp", quality=70)
    return im


# ----------------------------------------------------------------------- og
def og(mark: Image.Image, kv: Image.Image, grad: Image.Image) -> None:
    W, H = 1200, 630
    bg = grad.resize((W, round(grad.height * W / grad.width)), Image.LANCZOS)
    bg = bg.crop((0, 0, W, H)).convert("RGBA")
    # Fruit crop from the key visual (roughly centre of the disc).
    kw, kh = kv.size
    fruit = kv.crop((int(kw * 0.08), int(kh * 0.12), int(kw * 0.86), int(kh * 0.80)))
    fh = H + 80
    fruit = fruit.resize((round(fruit.width * fh / fruit.height), fh), Image.LANCZOS)
    bg.alpha_composite(fruit, (W - fruit.width + 40, -40))
    mh = 440
    m = mark.resize((round(mark.width * mh / mark.height), mh), Image.LANCZOS)
    bg.alpha_composite(m, (70, (H - mh) // 2))
    p = OUT / "og.jpg"
    bg.convert("RGB").save(p, "JPEG", quality=82, optimize=True, progressive=True)
    report(p)


if __name__ == "__main__":
    for f in ("title.png", "new_theme.jpg", "gradiant.jpg"):
        if not (SRC / f).exists():
            sys.exit(f"missing master: design/{f}")
    mark = wordmark()
    favicon(mark)
    kv = keyvisual()
    grad = gradient()
    og(mark, kv, grad)
    print("done")
