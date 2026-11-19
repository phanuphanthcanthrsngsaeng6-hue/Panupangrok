# Runtime font sources

The runtime uses these six font files. The title's ManusCC0 Bold replacement is a full, unmodified CC0-1.0 output font. The other five files are subsets under SIL Open Font License 1.1. Retain their adjacent notices when copying or redistributing them.

| Font file | Role | License notice |
| --- | --- | --- |
| `ManusCC0-Bold.woff2` | Title and title eyebrow | `ManusCC0-CC0.txt` (CC0-1.0) |
| `Figtree-VF.subset.woff2` | UI body | `Figtree-OFL.txt` (OFL-1.1) |
| `NotoSansSC-VF.subset.woff2` | Chinese body and label fallback | `NotoSansSC-OFL.txt` (OFL-1.1) |
| `display/Cinzel-VF.subset.woff2` | Headings and section labels | `display/Cinzel-OFL.txt` (OFL-1.1) |
| `display/Oswald-VF.subset.woff2` | Score numerals | `display/Oswald-OFL.txt` (OFL-1.1) |
| `display/NotoSerifSC-VF.subset.woff2` | Chinese title and heading fallback | `display/NotoSerifSC-OFL.txt` (OFL-1.1) |

`assets.lock.json` records the exact file hashes. `docs/provenance/fonts/replacement-fonts.json` records the ManusCC0 replacement source and bytes. The replaced Cinzel Decorative fonts are absent from the runtime; their notice is archived at `docs/provenance/historical-font-licenses/CinzelDecorative-OFL.txt`.

Noto Sans SC (`NotoSansSC-VF.subset.woff2`, variable weight) supplies the
common Simplified Chinese glyph fallback after the template's body font. Its
hash and size are in `assets.lock.json` and `runtime-cjk.json`. It covers the
shared common repertoire, including player input, rather than only current UI
copy. Rare characters outside that repertoire remain unsupported.

Use `python3 tools/install_cjk_font.py --check` to verify the pinned runtime
font and its license. Loader fonts are separate lightweight subsets of the same
approved family. Runtime imports disable system fallback; web exports bundle the font.
