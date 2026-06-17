# SMI Homepage — Agent Guide

## What this is

A static single-page homepage for Shared Mobility Inc. (SMI). No build tools, no Node, no frameworks — just HTML/CSS/JS with a runtime component loader.

## Architecture

- `SMI Home.html` — shell with `<div data-component="name">` placeholders. This is the source of truth.
- `components/<name>/` — each folder has `index.html` + `style.css`.
- `css/` — global shared styles (`base.css`, `buttons.css`, `sections.css`, `responsive.css`, `variant-selector.css`).
- `js/component-loader.js` — fetches components at runtime via `fetch()`.
- `js/main.js` — sticky header scroll behavior.
- `js/variant-selector.js` — live variant switcher UI.
- `js/cache-bust.js` — defines `__SMI_VERSION` for cache busting. Bump the version when deploying.
- `js/hero-padding.js` — adjusts hero padding based on active header variant.
- `SMI Home (2)/` — old reference homepage, read-only. Never modify.
- `SMI-Design-System-Rules.md` — design system (colors, typography, spacing, rules). Follow this when editing components.

## Commands

```bash
python -m http.server 8000   # Dev server (required — component-loader.js uses fetch)
```

VS Code: install **Live Server**, right-click `SMI Home.html` → "Open with Live Server".

## Variant swap workflow

Sections have multiple design variants (e.g. `projects/`, `projects-grid/`, `projects-list/`). The live variant selector handles this automatically — hover the icon on the right edge of a section to switch variants. Selections persist in localStorage.

To add a new variant to an existing section:
1. Create the component folder (`components/<variant-name>/index.html` + `style.css`)
2. Add the variant name to the `data-variants` attribute on the section's `.vs-section` wrapper in `SMI Home.html`
3. Refresh the browser

**Do NOT forget step 2** — without updating `data-variants`, the selector won't show the new option.

Example — adding `projects-new` variant:
```html
<!-- Before -->
<div class="vs-section" data-variants="projects,projects-grid,projects-list,projects-mosaic,projects-spread">

<!-- After -->
<div class="vs-section" data-variants="projects,projects-grid,projects-list,projects-mosaic,projects-spread,projects-new">
```

## Key gotchas

- **Requires a local server** — `component-loader.js` uses `fetch()`, which is blocked on `file://`. Always serve over http.
- **`main.js` listens to both `DOMContentLoaded` and `components:ready`** event to work with the component loader.
- **Component CSS `<link>` tags use `data-component-style` attribute** — the `component-loader.js` checks this to avoid double-injecting styles.
- **Variant folders must have `index.html`** — CSS-only variant folders won't produce HTML output.
- **`preview (24).html`** is a standalone preview file, not part of the build system.

## Design system

Read `SMI-Design-System-Rules.md` before creating or editing components. Key constraints:
- Font: **Dosis** (400–800)
- Colors: SMI Blue `#05527E`, SMI Green `#8DC641`
- Headings: uppercase, heavy weight, strong letter-spacing
- Max content width: **1380px**
- Sections alternate between white and `var(--soft)` backgrounds
- Corner radius uses `--radius-sm` (8px), `--radius-md` (16px), `--radius-lg` (24px)
