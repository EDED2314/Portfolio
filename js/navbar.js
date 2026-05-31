// ------------------------
// Navbar loader
// ------------------------
(function () {
    const pathParts = window.location.pathname.split('/').filter(p => p);
    let depth = pathParts.length - 1;

    if (window.location.pathname.includes('Protfolio')) depth -= 1;

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
        })
        .catch(err => console.error('Failed to load navbar:', err));
})();
