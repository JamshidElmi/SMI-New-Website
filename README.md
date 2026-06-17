

# SMI Home — Component-based structure

This project is split into independent components, each in its own folder.
Edit one file, the change shows up everywhere — no copy-paste.

```
SMI/
├── index.html                 # Shell with placeholders (the "source of truth")
├── css/                       # Global styles shared by all components
│   ├── base.css               # Variables, reset, .wrap
│   ├── buttons.css            # .btn, .btn.light
│   ├── sections.css           # .section, .section-head, headings
│   ├── responsive.css         # Global media queries
│   └── variant-selector.css   # Live variant switcher UI
├── js/
│   ├── component-loader.js    # Fetches components at runtime
│   ├── main.js                # Sticky-header scroll behavior
│   └── variant-selector.js    # Live variant switcher logic
└── components/                # One folder per page section
    ├── header/        index.html + style.css
    ├── hero/          index.html + style.css
    ├── what-we-do/    index.html + style.css
    ├── what-we-do-cards/    index.html + style.css (variant)
    ├── what-we-do-tabs/     index.html + style.css (variant)
    ├── what-we-do-feature/  index.html + style.css (variant)
    ├── ebike-programs/  index.html + style.css
    ├── projects/      index.html + style.css
    ├── projects-grid/ index.html + style.css (variant)
    ├── projects-list/ index.html + style.css (variant)
    ├── projects-mosaic/ index.html + style.css (variant)
    ├── projects-spread/ index.html + style.css (variant)
    ├── partners/      index.html + style.css
    ├── partners-marquee/ index.html + style.css (variant)
    ├── partners-featured/ index.html + style.css (variant)
    ├── partners-pill/ index.html + style.css (variant)
    ├── team/          index.html + style.css
    ├── team-list/     index.html + style.css (variant)
    ├── team-cards/    index.html + style.css (variant)
    ├── team-spotlight/ index.html + style.css (variant)
    ├── history/       index.html + style.css
    ├── history-timeline/ index.html + style.css (variant)
    ├── history-fullwidth/ index.html + style.css (variant)
    ├── history-cards/ index.html + style.css (variant)
    ├── contact/       index.html + style.css
    └── footer/        index.html + style.css
```

## How to view

Serve the folder over http (required for component fetching):

```bash
python -m http.server 8000        # then open http://localhost:8000
# or
npx serve .                       # Node
php -S localhost:8000             # PHP
```

VS Code users: install **Live Server**, right-click `index.html` →
"Open with Live Server".

## Editing workflow

1. Edit `components/<name>/index.html` and/or `style.css`.
2. Refresh the browser.

## Variant selector

Sections with multiple design variants have a floating selector pinned to the right edge. Hover the icon to see options, click to switch. Selections persist in localStorage.

To add a new variant:
1. Create `components/<variant-name>/index.html` + `style.css`
2. Add the variant name to the `data-variants` attribute on the section's `.vs-section` wrapper in `index.html`
3. Refresh

# Design System

The design system is defined in `SMI-Design-System-Rules.md`. It includes:
1. Brand Foundation
2. Typography
3. Layout
4. Corner Radius
5. Shadows
6. Buttons
7. Forms
8. Cards
9. Navigation
10. Content Style
11. Neuro Web Design Principles
12. Homepage Direction
13. Design Personality
14. Do / Don't

> make sure you follow the design system rules when editing/generating components, to keep everything cohesive.