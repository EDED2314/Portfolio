// ------------------------
// Navbar loader
// ------------------------
(function () {
    const pathParts = window.location.pathname.split('/').filter(p => p);
    let depth = pathParts.length - 1;

    if (window.location.pathname.includes('Portfolio')) depth -= 1;

    let prefix = '';
    for (let i = 0; i < depth; i++) prefix += '../';

    fetch(prefix + 'navbar.html')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.text();
        })
        .then(data => {
            if (prefix) {
                data = data.replaceAll('./assets/', prefix + 'assets/');
                data = data.replaceAll('./index.html', prefix + 'index.html');
                data = data.replaceAll('./experiences.html', prefix + 'experiences.html');
            }
            document.getElementById('navbar-placeholder').innerHTML = data;
            window.dispatchEvent(new Event('navbar:loaded'));

            // Wire up hamburger menu
            const hamburger = document.getElementById('hamburger-btn');
            const mobileMenu = document.getElementById('mobile-menu');

            if (hamburger && mobileMenu) {
                hamburger.addEventListener('click', () => {
                    hamburger.classList.toggle('active');
                    mobileMenu.classList.toggle('active');
                });

                // Close menu when clicking a link
                mobileMenu.querySelectorAll('.mobile-menu-link').forEach(link => {
                    link.addEventListener('click', () => {
                        hamburger.classList.remove('active');
                        mobileMenu.classList.remove('active');
                    });
                });

                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                        hamburger.classList.remove('active');
                        mobileMenu.classList.remove('active');
                    }
                });
            }
        })
        .catch(err => console.error('Failed to load navbar:', err));
})();
