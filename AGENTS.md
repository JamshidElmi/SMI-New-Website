# SMI Homepage — Agent Guide

## What this is

A static single-page homepage for Shared Mobility Inc. (SMI). No build tools, no Node, no frameworks — just HTML/CSS/JS with a Python bake script.

## Architecture

- `SMI Home.html` — thin shell with `<div data-component="name">` placeholders. This is the source of truth.
- `SMI Home.baked.html` — fully inlined output (HTML + CSS). Works from `file://`.
- `components/<name>/` — each folder has `index.html` + `style.css`. Some folders are CSS-only variants (no `index.html`).
- `css/` — global shared styles (`base.css`, `buttons.css`, `sections.css`, `responsive.css`).
- `js/component-loader.js` — runtime fetch loader (dev server only, blocked on `file://`).
- `js/main.js` — sticky header scroll behavior.
- `SMI Home (2)/` — old reference homepage, read-only. Never modify.
- `SMI-Design-System-Rules.md` — design system (colors, typography, spacing, rules). Follow this when editing components.

## Commands

```bash
python build.py          # Rebuild SMI Home.baked.html from shell + components
python -m http.server 8000   # Dev server for live editing (component-loader.js uses fetch)
```

**Always re-run `python build.py` after editing any component CSS or HTML.** The baked file does not auto-update.

## Variant swap workflow

Sections have multiple design variants (e.g. `projects/`, `projects-grid/`, `projects-list/`). To swap:

1. In `SMI Home.html`, uncomment the desired variant's `<link>` tag (CSS) and `<div>` (HTML).
2. Comment out the current default for that section.
3. Re-run `python build.py`.

Both the CSS `<link>` AND the HTML `<div>` must be uncommented — the build script only inlines components referenced by `data-component` attributes.

## Variant selector (live UI)

Each variant-enabled section has a floating selector pinned to the right edge. Users can hover to reveal options and switch variants live. Selections persist in `localStorage`.

### How it works
- Sections with variants are wrapped in `<div class="vs-section" data-variants="...">` containers
- `js/variant-selector.js` scans for `[data-variants]` elements, builds the UI, and handles fetch/swap
- `css/variant-selector.css` styles the icon, dropdown menu, and active states

### When adding a new variant to an existing section
1. Create the component folder (`components/<variant-name>/index.html` + `style.css`)
2. Add the variant name to the `data-variants` attribute on the section's `.vs-section` wrapper in `SMI Home.html`
3. Re-run `python build.py`

**Do NOT forget step 2** — without updating `data-variants`, the selector won't show the new option.

Example — adding `projects-new` variant:
```html
<!-- Before -->
<div class="vs-section" data-variants="projects,projects-grid,projects-list,projects-mosaic,projects-spread">

<!-- After -->
<div class="vs-section" data-variants="projects,projects-grid,projects-list,projects-mosaic,projects-spread,projects-new">
```

## Key gotchas

- **Two viewing modes**: Baked file (inlined, `file://` works) vs dev server (fetch-loaded). They use different init paths — `main.js` listens to both `DOMContentLoaded` and `components:ready` event.
- **`main.js` has an `attached` flag** to prevent duplicate scroll listeners if both events fire.
- **Component CSS `<link>` tags in the shell use `data-component-style` attribute** — the `component-loader.js` checks this to avoid double-injecting styles. The build script strips these tags and inlines the CSS instead.
- **`build.py` regex** only matches `<div data-component="..."></div>` on a single line with no whitespace inside the tag. If you reformat the placeholder, the build will silently skip it.
- **`build.py` inlines** component CSS + `variant-selector.css` + `variant-selector.js` into the baked file. The shell still references them via `<link>`/`<script>` for dev server mode.
- **Variant folders without `index.html`** (like early `what-we-do-cards/`) only contribute CSS — they won't produce HTML output. Newer variants have both files.
- **`preview (24).html`** is a standalone preview file, not part of the build system.

## Design system

Read `SMI-Design-System-Rules.md` before creating or editing components. Key constraints:
- Font: **Dosis** (400–800)
- Colors: SMI Blue `#05527E`, SMI Green `#8DC641`
- Headings: uppercase, heavy weight, strong letter-spacing
- Max content width: **1180px**
- Sections alternate between white and `var(--soft)` backgrounds
- Corner radius uses `--radius-sm` (8px), `--radius-md` (16px), `--radius-lg` (24px)
