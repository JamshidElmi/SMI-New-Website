// Sticky header scroll behavior.
// Toggles .scrolled on .topbar once user scrolls past the topstrip height.
// Works with both the baked file (inline markup) and the dev server (fetch loader).

(function () {
  'use strict';

  let attached = false;

  function init() {
    if (attached) return;

    const topbar = document.querySelector('.topbar');
    if (!topbar) return;

    const topstrip = topbar.querySelector('.topstrip');
    const update = () => {
      const trigger = topstrip ? topstrip.offsetHeight + 10 : 60;
      topbar.classList.toggle('scrolled', window.scrollY > trigger);
    };

    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            update();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
    window.addEventListener('resize', update);
    update();
    attached = true;
  }

  // Init as soon as DOM is ready (works for baked file — markup is inline).
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Also init when component-loader finishes (works for dev server — markup is fetched).
  document.addEventListener('components:ready', init);
})();
