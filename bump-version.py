"""
Bump cache-bust version across all HTML and JS files.
Usage:  python bump-version.py
"""
import re, pathlib

ROOT = pathlib.Path(__file__).parent
FILES = [
    ROOT / 'js' / 'cache-bust.js',
    ROOT / 'SMI Home.html',
    ROOT / 'index.html',
]

# 1. Read current version from cache-bust.js
cb = ROOT / 'js' / 'cache-bust.js'
text = cb.read_text(encoding='utf-8')
m = re.search(r"__SMI_VERSION\s*=\s*'(\d+)'", text)
if not m:
    raise SystemExit('Could not find __SMI_VERSION in cache-bust.js')
old = int(m.group(1))
new = old + 1

# 2. Replace in all files
for f in FILES:
    t = f.read_text(encoding='utf-8')
    t = t.replace(f"__SMI_VERSION = '{old}'", f"__SMI_VERSION = '{new}'")
    t = re.sub(r'\?v=\d+', f'?v={new}', t)
    f.write_text(t, encoding='utf-8')

print(f'Version bumped: {old} -> {new}')
print(f'Updated {len(FILES)} files:')
for f in FILES:
    print(f'  {f.name}')
