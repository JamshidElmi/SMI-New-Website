// Variant Selector
// Adds a hover-activated panel on the right edge of sections that have variants.
// Saves user's choice to localStorage so it persists across visits.

(function () {
  'use strict';

  const STORAGE_KEY = 'smi-variants';

  function getSaved() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }

  function save(section, variant) {
    const data = getSaved();
    data[section] = variant;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  async function fetchComponent(name) {
    const resp = await fetch('components/' + name + '/index.html', { cache: 'no-cache' });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    return resp.text();
  }

  function injectCSS(name) {
    if (document.querySelector('link[data-variant-style="' + name + '"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'components/' + name + '/style.css';
    link.dataset.variantStyle = name;
    document.head.appendChild(link);
  }

  function removeCSS(name) {
    const el = document.querySelector('link[data-variant-style="' + name + '"]');
    if (el) el.remove();
  }

  async function applyVariant(sectionEl, variantName, defaultName) {
    const target = sectionEl.querySelector('[data-component]');
    if (!target) return;

    try {
      const html = await fetchComponent(variantName);
      target.innerHTML = html;
      injectCSS(variantName);

      // Remove old variant CSS if different from default
      const current = sectionEl.dataset.activeVariant || defaultName;
      if (current !== variantName && current !== defaultName) {
        removeCSS(current);
      }
      sectionEl.dataset.activeVariant = variantName;

      // Highlight active button
      sectionEl.querySelectorAll('.vs-option').forEach(btn => {
        btn.classList.toggle('vs-active', btn.dataset.variant === variantName);
      });
    } catch (e) {
      console.error('[variant-selector]', e);
    }
  }

  function buildSelector(sectionEl) {
    const variants = sectionEl.dataset.variants.split(',').map(s => s.trim());
    const defaultName = sectionEl.querySelector('[data-component]').dataset.component;
    const saved = getSaved();
    const current = saved[defaultName] || defaultName;

    // Create the floating panel
    const panel = document.createElement('div');
    panel.className = 'vs-panel';

    const icon = document.createElement('div');
    icon.className = 'vs-icon';
    icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.5"/></svg>';
    icon.title = 'Switch variant';

    const menu = document.createElement('div');
    menu.className = 'vs-menu';

    variants.forEach(v => {
      const btn = document.createElement('button');
      btn.className = 'vs-option' + (v === current ? ' vs-active' : '');
      btn.dataset.variant = v;
      btn.textContent = v.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      btn.addEventListener('click', () => {
        save(defaultName, v);
        applyVariant(sectionEl, v, defaultName);
      });
      menu.appendChild(btn);
    });

    panel.appendChild(icon);
    panel.appendChild(menu);
    sectionEl.appendChild(panel);

    // Apply saved variant on load
    if (current !== defaultName) {
      applyVariant(sectionEl, current, defaultName);
    } else {
      sectionEl.dataset.activeVariant = defaultName;
    }
  }

  function init() {
    document.querySelectorAll('[data-variants]').forEach(buildSelector);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Also re-init after component-loader finishes (dev server mode)
  document.addEventListener('components:ready', init);
})();
