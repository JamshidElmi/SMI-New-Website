// Component loader
// Scans the document for <div data-component="name"> placeholders,
// fetches /components/<name>/index.html and injects the markup.
// Also injects /components/<name>/style.css once per component.
//
// Requires the page to be served over http (e.g. python -m http.server)
// because fetch() is blocked on file:// in most browsers.

(function () {
  'use strict';

  const COMPONENTS_DIR = 'components/';

  function injectStyle(name) {
    return new Promise((resolve) => {
      const v = (typeof __SMI_VERSION !== 'undefined') ? __SMI_VERSION : '1';
      const href = COMPONENTS_DIR + name + '/style.css?v=' + v;
      if (document.querySelector('link[data-component-style="' + name + '"]')) {
        return resolve();
      }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.dataset.componentStyle = name;
      link.onload = () => resolve();
      link.onerror = () => {
        console.warn('[component-loader] missing style:', href);
        resolve();
      };
      document.head.appendChild(link);
    });
  }

  function fetchHTML(url) {
    return fetch(url, { cache: 'no-cache' }).then((r) => {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + url);
      return r.text();
    });
  }

  function loadComponent(el) {
    const name = el.dataset.component;
    const base = COMPONENTS_DIR + name + '/';
    return Promise.all([
      fetchHTML(base + 'index.html').catch((e) => {
        console.error('[component-loader] failed:', e);
        return '';
      }),
      injectStyle(name),
    ]).then(([html]) => {
      if (html) el.innerHTML = html;
      el.dispatchEvent(new CustomEvent('component:loaded', { bubbles: true }));
    });
  }

  function loadAll() {
    const placeholders = Array.from(document.querySelectorAll('[data-component]'));
    return Promise.all(placeholders.map(loadComponent)).then(() => {
      document.dispatchEvent(new CustomEvent('components:ready'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAll);
  } else {
    loadAll();
  }
})();
