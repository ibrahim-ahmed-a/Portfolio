/* Motion, clickable cards and the image lightbox (added after the build). */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  /* Home page: tag the blocks that should animate in. */
  if (!document.body.classList.contains('project-page')) {
    document.querySelectorAll('.section-head, .card, .timeline-item').forEach(function (el) {
      if (!el.closest('.hero') && !el.closest('.topbar')) el.setAttribute('data-reveal', '');
    });
  }

  var items = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  items.forEach(function (el) {
    var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.hasAttribute('data-reveal'); });
    el.style.setProperty('--d', Math.min(sibs.indexOf(el), 5) * 90 + 'ms');
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Safety net: anything already on screen is shown even if the observer never fires. */
  window.addEventListener('load', function () {
    window.setTimeout(function () {
      items.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
      });
    }, 1200);
  });

  /* Whole project card opens its page; the card image morphs into the page cover. */
  document.querySelectorAll('.card-project').forEach(function (card) {
    var link = card.querySelector('a.project-link');
    var img = card.querySelector('.work-media img');
    if (!link) return;
    var slug = (link.getAttribute('href') || '').split('/').pop().replace('.html', '');
    function name() { if (img && slug) img.style.viewTransitionName = 'work-' + slug; }
    link.addEventListener('click', name);
    card.addEventListener('click', function (event) {
      if (event.target.closest('a')) return;
      name();
      window.location.href = link.href;
    });
  });

  /* Lightbox */
  var box = document.getElementById('lightbox');
  if (box && typeof box.showModal === 'function') {
    var big = box.querySelector('img');
    document.querySelectorAll('.shot-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var small = btn.querySelector('img');
        big.src = btn.dataset.full;
        big.alt = small ? small.alt : '';
        box.showModal();
      });
    });
    box.addEventListener('click', function (event) {
      if (event.target === box || event.target.closest('.lightbox-close')) box.close();
    });
  }
})();
