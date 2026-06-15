"""
Build script: inlines each component/<name>/index.html into the matching
<div data-component="name"> placeholder in SMI Home.html, AND inlines
each component's style.css into a <style> block in the <head>.

Also inlines css/variant-selector.css and js/variant-selector.js so the
baked file is fully self-contained and works from file://.

Produces SMI Home.baked.html — a fully self-contained, fetch-free file
that works directly from file:// with no server needed.

Usage:
    python build.py
"""

import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent
SHELL = ROOT / "SMI Home.html"
OUT = ROOT / "SMI Home.baked.html"
COMPONENTS = ROOT / "components"

PLACEHOLDER = re.compile(
    r'<div data-component="([a-z0-9\-]+)"></div>', re.IGNORECASE
)

# Matches the <head> closing tag so we can insert inlined component CSS before it
HEAD_CLOSE = re.compile(r'</head>', re.IGNORECASE)

# Matches component CSS link tags so we can remove them (we'll inline the content)
COMP_CSS_LINK = re.compile(
    r'<link\s+rel="stylesheet"\s+href="components/[^"]+/style\.css"\s*/?\s*>',
    re.IGNORECASE,
)

# Matches the variant-selector.css link tag
VS_CSS_LINK = re.compile(
    r'<link\s+rel="stylesheet"\s+href="css/variant-selector\.css"\s*/?\s*>',
    re.IGNORECASE,
)

# Matches the variant-selector.js script tag
VS_JS_TAG = re.compile(
    r'<script\s+src="js/variant-selector\.js"[^>]*>\s*</script>',
    re.IGNORECASE,
)


def main() -> int:
    if not SHELL.exists():
        print(f"error: shell not found at {SHELL}")
        return 1

    shell_text = SHELL.read_text(encoding="utf-8")

    # --- Step 1: inline component HTML ---
    def replace_html(match: re.Match) -> str:
        name = match.group(1)
        component_file = COMPONENTS / name / "index.html"
        if not component_file.exists():
            print(f"warning: component '{name}' missing {component_file}")
            return match.group(0)
        return component_file.read_text(encoding="utf-8").rstrip()

    baked, html_count = PLACEHOLDER.subn(replace_html, shell_text)
    print(f"inlined {html_count} component(s)")

    # --- Step 2: find all component names that were used ---
    used_names = set()
    for match in PLACEHOLDER.finditer(shell_text):
        used_names.add(match.group(1))

    # --- Step 3: collect all component CSS ---
    css_blocks = []
    for name in sorted(used_names):
        css_file = COMPONENTS / name / "style.css"
        if css_file.exists():
            css_content = css_file.read_text(encoding="utf-8").strip()
            css_blocks.append(f"/* {name} */\n{css_content}")
        else:
            print(f"warning: no style.css for component '{name}'")

    # --- Step 4: remove component CSS <link> tags from baked output ---
    baked = COMP_CSS_LINK.sub("", baked)

    # --- Step 5: inline variant-selector.css ---
    vs_css_file = ROOT / "css" / "variant-selector.css"
    if vs_css_file.exists():
        vs_css_content = vs_css_file.read_text(encoding="utf-8").strip()
        css_blocks.append(f"/* variant-selector */\n{vs_css_content}")
        baked = VS_CSS_LINK.sub("", baked)
        print("inlined variant-selector.css")

    # --- Step 6: insert inlined CSS before </head> ---
    if css_blocks:
        inline_css = "\n\n".join(css_blocks)
        style_block = f"\n<!-- Inlined component styles -->\n<style>\n{inline_css}\n</style>\n"
        baked = HEAD_CLOSE.sub(style_block + "</head>", baked, count=1)

    # --- Step 7: inline variant-selector.js ---
    vs_js_file = ROOT / "js" / "variant-selector.js"
    if vs_js_file.exists():
        vs_js_content = vs_js_file.read_text(encoding="utf-8").strip()
        js_block = f"\n<!-- Inlined variant-selector -->\n<script>\n{vs_js_content}\n</script>\n"
        # Use string replace instead of regex to avoid escape issues
        baked = baked.replace("</body>", js_block + "</body>", 1)
        baked = VS_JS_TAG.sub("", baked)
        print("inlined variant-selector.js")

    # --- Step 8: write output ---
    OUT.write_text(baked, encoding="utf-8")
    print(f"inlined CSS for {len(css_blocks)} component(s)")
    print(f"wrote {OUT.name} ({OUT.stat().st_size} bytes)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
