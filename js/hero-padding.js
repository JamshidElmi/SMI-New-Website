// Hero Padding Handler
// Adjusts hero section padding based on which header variant is active.
// Default header → 300px top padding, Header Toole → 0px.
// Also re-applies padding when hero variant is switched.

(function () {
  'use strict';

  var HEADER_PAD = 200;
  var TOOLE_KEY = 'header-toole';
  var observers = [];

  function getHeaderSection() {
    return document.querySelector('[data-variants*="header"]') ||
           document.querySelector('[data-variants*="header-toole"]');
  }

  function getHeroSections() {
    return document.querySelectorAll('[data-variants*="hero"]');
  }

  function isTooleActive() {
    var section = getHeaderSection();
    if (!section) return false;
    var active = section.dataset.activeVariant;
    if (active === TOOLE_KEY) return true;
    var tooleEl = section.querySelector('.topbar-toole');
    return !!tooleEl;
  }

  function applyPadding() {
    var pad = isTooleActive() ? 0 : HEADER_PAD;
    getHeroSections().forEach(function (heroSection) {
      var target = heroSection.querySelector('[data-component]');
      if (!target) return;
      var el = target.querySelector('.hero, .hero-toole');
      if (el) el.style.paddingTop = pad + 'px';
    });
  }

  function watchSection(section) {
    // Avoid duplicate observers on the same element
    if (section._heroPadObs) return;
    var obs = new MutationObserver(function () {
      setTimeout(applyPadding, 100);
    });
    obs.observe(section, { attributes: true, childList: true, subtree: true });
    section._heroPadObs = obs;
    observers.push(obs);
  }

  function init() {
    // Watch header section
    var headerSection = getHeaderSection();
    if (headerSection) watchSection(headerSection);

    // Watch all hero sections
    getHeroSections().forEach(watchSection);

    applyPadding();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('components:ready', function () {
    // Re-attach observers after component-loader rebuilds DOM
    var headerSection = getHeaderSection();
    if (headerSection) watchSection(headerSection);
    getHeroSections().forEach(watchSection);
    setTimeout(applyPadding, 50);
  });
})();
