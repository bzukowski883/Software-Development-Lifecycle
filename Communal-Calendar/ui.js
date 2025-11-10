// ui.js
// Toggle sections for the Communal Calendar UI

document.addEventListener('DOMContentLoaded', () => {
  const qs = (selector) => document.querySelector(selector);

  const toggle = (btnId, sectionId) => {
    const btn = qs(btnId);
    const section = qs(sectionId);
    if (!btn || !section) return;
    btn.addEventListener('click', () => section.classList.toggle('hidden'));
  };

  toggle('#btn-filter', '#filter-section');
  toggle('#btn-friends', '#friends-section');
  toggle('#btn-events', '#events-section');
});
