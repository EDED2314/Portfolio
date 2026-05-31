// ------------------------
// Entry point — loads all modules.
// Add or remove files here to control what runs on every page.
// ------------------------

// Resolved at runtime so this works from any folder depth
(function () {
  const scripts = [
    'navbar.js',
    'footer.js',
    'hero.js',
    'projects.js',
    'skills.js',
    'gallery.js',
  ];

  const pathParts = window.location.pathname.split('/').filter(p => p);
  let depth = pathParts.length - 1;
  if (window.location.pathname.includes('Portfolio')) depth -= 1;

  let prefix = '';
  for (let i = 0; i < depth; i++) prefix += '../';

  scripts.forEach(file => {
    const s = document.createElement('script');
    s.src = prefix + 'js/' + file;
    s.defer = true;
    document.head.appendChild(s);
  });
})();
