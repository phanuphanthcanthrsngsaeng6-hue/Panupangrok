#!/usr/bin/env python3
"""Compose project-local sharing PNGs from existing artwork; never calls an image model."""
import argparse
import hashlib
import io
import json
from pathlib import Path, PurePosixPath
import re
import struct
import subprocess
import sys
import warnings

VERSION = 1
MAX_BYTES = 16 * 1024 * 1024
MAX_PIXELS = 16 * 1024 * 1024


def project_file(root, name):
    if not name or "\\" in name or any(ord(c) < 32 for c in name):
        raise ValueError("Use a regular file inside the game project.")
    parts = name.split("/")
    if PurePosixPath(name).is_absolute() or any(p in ("", ".", "..") for p in parts):
        raise ValueError("Use a project-relative path without traversal.")
    current = root
    for part in parts:
        current = current / part
        if current.is_symlink():
            raise ValueError("Sharing inputs and outputs must not be symlinks.")
    if not current.resolve().is_relative_to(root):
        raise ValueError("Sharing path escapes the game project.")
    return current


def read_bounded(path, limit=MAX_BYTES):
    if not path.is_file() or path.stat().st_size > limit:
        raise ValueError("Sharing input is missing or exceeds its size budget.")
    with path.open("rb") as stream:
        data = stream.read(limit + 1)
    if len(data) > limit:
        raise ValueError("Sharing input exceeds its size budget.")
    return data


def digest(data):
    return "sha256:" + hashlib.sha256(data).hexdigest()


def image_input(root, name):
    from PIL import Image, ImageOps
    raw = read_bounded(project_file(root, name))
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            with Image.open(io.BytesIO(raw)) as original:
                if original.format not in ("PNG", "JPEG", "WEBP") or getattr(original, "n_frames", 1) != 1:
                    raise ValueError("Use a single-frame PNG, JPEG or WebP; export SVG artwork to PNG in Godot first.")
                if original.width * original.height > MAX_PIXELS:
                    raise ValueError("Sharing input exceeds 16 million pixels.")
                image = ImageOps.exif_transpose(original).convert("RGBA")
                image.info.clear()
    except (Image.DecompressionBombError, Image.DecompressionBombWarning) as error:
        raise ValueError("Sharing input exceeds 16 million pixels.") from error
    return image, {"path": name, "digest": digest(raw)}


def font_codepoints(data):
    """Use the runtime's bounded format parser for the exact Unicode cmap."""
    helper = Path(__file__).with_name("font-coverage.mjs").resolve()
    script = "import {pathToFileURL} from 'node:url';import fs from 'node:fs';const {fontCodepoints}=await import(pathToFileURL(process.argv[1]));console.log(JSON.stringify([...fontCodepoints(fs.readFileSync(0))]));"
    result = subprocess.run(["node", "--input-type=module", "-e", script, str(helper)],
                            input=data, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=15)
    if result.returncode:
        raise ValueError("Use a valid TrueType, OpenType, WOFF or WOFF2 font with a readable Unicode map.")
    return set(json.loads(result.stdout))


def project_font(root, name, role):
    from PIL import ImageFont
    path = project_file(root, name)
    if not path.is_file():
        raise ValueError("Use a regular font file inside the game project.")
    raw = path.read_bytes()
    loaded = ImageFont.truetype(io.BytesIO(raw), 16, layout_engine=ImageFont.Layout.BASIC)
    try:
        points = font_codepoints(raw)
    except (ValueError, OSError, subprocess.SubprocessError):
        # Coverage only selects a fallback. A font the renderer can load is usable.
        points = set()
    family, style = loaded.getname()
    return raw, points, {"family": family, "style": style, "role": role, "path": name, "digest": digest(raw)}


DEFAULT_FONT = "NotoSansSC-VF.subset.woff2"
DEFAULT_WEIGHT = 700


def bundled_default(role=None):
    """The bundled Noto Sans SC default (OFL-1.1) covers Latin and common Chinese."""
    directory = Path(__file__).resolve().parents[1] / "fonts"
    manifest = json.loads(read_bounded(directory / "manifest.json", 65536))
    entry = next(item for item in manifest["files"] if item["name"] == DEFAULT_FONT)
    raw = (directory / entry["name"]).read_bytes()
    if len(raw) != entry["size"] or digest(raw) != entry["sha256"]:
        raise ValueError("The bundled Noto Sans SC font failed its integrity check.")
    return raw, font_codepoints(raw), {"family": entry["family"], "weight": DEFAULT_WEIGHT, "license": entry["license"],
                                       **({"role": role} if role else {}), "digest": digest(raw)}


def fonts(root, fallback, primary=None):
    if not primary and not fallback:
        return [bundled_default()]
    result = [project_font(root, primary, "primary") if primary else bundled_default()]
    result.append(project_font(root, fallback, "glyph-fallback") if fallback else bundled_default("glyph-fallback"))
    return result


def load_face(raw, meta, size):
    from PIL import ImageFont
    font = ImageFont.truetype(io.BytesIO(raw), size, layout_engine=ImageFont.Layout.BASIC)
    if "weight" in meta:
        try:
            axes = font.get_variation_axes()
        except OSError:
            axes = []
        # Variable defaults (Noto Sans SC starts at Thin) render at the recorded weight.
        if axes:
            font.set_variation_by_axes([meta["weight"] if axis.get("name") in (b"Weight", "Weight") else axis["default"] for axis in axes])
    return font


def title_lines(title, faces, size):
    loaded = [load_face(raw, meta, size) for raw, _, meta in faces]
    lines = [[]]
    width = 0
    for character in title:
        choice = next((i for i, (_, points, _) in enumerate(faces) if ord(character) in points), 0)
        font = loaded[choice]
        advance = font.getlength(character)
        while width + advance > 1072 and lines[-1]:
            # Prefer a word boundary, then recheck the carried word with this
            # glyph. A long carry may itself need a glyph-boundary split.
            space = next((i for i in range(len(lines[-1]) - 1, -1, -1) if lines[-1][i][0] == " "), None)
            carry = lines[-1][space + 1:] if space is not None else []
            if space is not None:
                lines[-1] = lines[-1][:space]
            lines.append(carry)
            width = sum(entry[2] for entry in carry)
        if character != " " or lines[-1]:
            lines[-1].append((character, font, advance))
            width += advance
    return lines


def compose(root, cover, icon, title, output, fallback=None, accent="#8cba74", pixel_art=False, primary=None):
    from PIL import Image, ImageDraw, ImageOps, __version__
    if not title.strip() or title != title.strip() or len(title) > 120 or any(ord(c) < 32 for c in title):
        raise ValueError("Use the exact game title, 1–120 characters, without line breaks or surrounding spaces.")
    if not re.fullmatch(r"#[0-9a-fA-F]{6}", accent):
        raise ValueError("Use an accent color in #rrggbb format.")
    target = project_file(root, output)
    if target.exists():
        raise ValueError("Use a new output directory; previous sharing artwork is preserved.")
    cover_image, cover_source = image_input(root, cover)
    icon_image, icon_source = image_input(root, icon)
    faces = fonts(root, fallback, primary)
    resample = Image.Resampling.NEAREST if pixel_art else Image.Resampling.LANCZOS
    background = (12, 22, 29, 255)
    canvas = Image.new("RGBA", (1200, 630), background)
    # Screenshots fill the card; transparent catalog artwork retains its silhouette.
    if cover_image.getextrema()[3][0] == 255:
        layer = ImageOps.fit(cover_image, canvas.size, method=resample)
    else:
        layer = ImageOps.contain(cover_image, (1072, 502), method=resample)
    canvas.alpha_composite(layer, ((1200 - layer.width) // 2, (502 - layer.height) // 2 if layer.height < 630 else 0))
    shade = Image.new("RGBA", canvas.size)
    draw = ImageDraw.Draw(shade)
    for y in range(630):
        draw.line((0, y, 1200, y), fill=(8, 15, 22, round(235 * (y / 629) ** 2.1)))
    canvas = Image.alpha_composite(canvas, shade)
    draw = ImageDraw.Draw(canvas)
    for size in range(80, 27, -2):
        lines = title_lines(title, faces, size)
        line_height = round(size * 1.25)
        if (len(lines) * line_height <= 240
                and all(sum(entry[2] for entry in line) <= 1072 for line in lines)):
            break
    else:
        raise ValueError("The full game title does not fit; use a custom composition with the same exact title.")
    y = 630 - 60 - len(lines) * line_height
    draw.rounded_rectangle((64, y - 27, 136, y - 20), radius=3, fill=accent)
    for line in lines:
        x = 64
        for character, font, advance in line:
            draw.text((x, y + size), character, font=font, anchor="ls", fill="#ffffff", stroke_width=0)
            x += advance
        y += line_height
    favicon = Image.new("RGBA", (512, 512), background)
    icon_image = ImageOps.contain(icon_image, (416, 416), method=resample)
    favicon.alpha_composite(icon_image, ((512 - icon_image.width) // 2, (512 - icon_image.height) // 2))
    outputs = {}
    for name, image in {"og.png": canvas, "favicon.png": favicon,
                        "favicon-32.png": favicon.resize((32, 32), resample)}.items():
        stream = io.BytesIO()
        image.convert("RGB").save(stream, format="PNG", compress_level=9)
        raw = stream.getvalue()
        if len(raw) > 8 * 1024 * 1024:
            raise ValueError("Sharing PNG exceeds the upload budget.")
        outputs[name] = (raw, {"path": f"{output}/{name}", "digest": digest(raw),
                               "width": image.width, "height": image.height, "sizeBytes": len(raw)})
    receipt = {"schemaVersion": VERSION, "renderer": "catalog-procedural", "pillowVersion": __version__,
               "title": title, "ogImageTitle": title, "source": "upload", "accent": accent,
               "pixelArt": pixel_art, "inputs": {"cover": cover_source, "icon": icon_source},
               "fonts": [item[2] for item in faces], "outputs": [item[1] for item in outputs.values()]}
    # All validation/rendering completes before creating any project output.
    target.parent.mkdir(parents=True, exist_ok=True)
    target.mkdir()
    for name, (raw, _) in outputs.items():
        (target / name).write_bytes(raw)
    (target / "render-receipt.json").write_text(json.dumps(receipt, indent=2, ensure_ascii=False) + "\n")
    return receipt


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cover", required=True, help="Project-relative catalog artwork or real game screenshot (PNG/JPEG/WebP).")
    parser.add_argument("--icon", required=True, help="Project-relative game symbol; use a cropped character/item for small-size clarity.")
    parser.add_argument("--title", required=True)
    parser.add_argument("--output", default="art/share/v1", help="New project-relative output directory.")
    parser.add_argument("--font", help="Project-relative title font; defaults to bundled Noto Sans SC Bold.")
    parser.add_argument("--fallback-font", help="Project-relative glyph fallback font; defaults to bundled Noto Sans SC Bold.")
    parser.add_argument("--accent", default="#8cba74")
    parser.add_argument("--pixel-art", action="store_true")
    args = parser.parse_args()
    try:
        result = compose(Path.cwd().resolve(), args.cover, args.icon, args.title, args.output,
                         args.fallback_font, args.accent, args.pixel_art, args.font)
        print(json.dumps({"ok": True, "source": result["source"], "ogImageTitle": result["ogImageTitle"],
                          "outputs": result["outputs"]}))
    except ImportError:
        print(json.dumps({"ok": False, "error": "Use a Python environment with Pillow, as used by the catalog adaptation helper; CairoSVG is not required."}), file=sys.stderr)
        return 1
    except (ValueError, OSError, KeyError, IndexError, struct.error) as error:
        print(json.dumps({"ok": False, "error": str(error)}), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
