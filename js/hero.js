// ------------------------
// Hero reveal + navbar height CSS variable
// ------------------------
(function () {
    const hero = document.getElementById('hero');
    const page = hero ? document.querySelector('.page-content') : null;

    function getNavbar() {
        return document.querySelector('.navbar');
    }

    function getNavbarHeight() {
        const n = getNavbar();
        return n ? n.offsetHeight : 0;
    }

    function setNavVar() {
        document.documentElement.style.setProperty('--navbar-height', `${getNavbarHeight()}px`);
    }

    setNavVar();
    window.addEventListener('resize', setNavVar);
    window.addEventListener('navbar:loaded', setNavVar);

    if (hero) {
        document.body.classList.add('has-hero');
    } else {
        document.body.classList.add('no-hero');
    }

    if (hero && page && page.classList.contains('hidden')) {
        window.scrollTo(0, 0);
        page.style.display = 'none';
    }

    function scrollToElementWithOffset(element, offset) {
        if (!element) return;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }

    function revealAndScroll(targetSelector) {
        if (!page) return;
        if (page.classList.contains('revealed')) {
            if (targetSelector) {
                const target = document.querySelector(targetSelector);
                if (target) scrollToElementWithOffset(target, getNavbarHeight());
            }
            return;
        }

        page.style.display = 'flex';
        page.classList.add('revealed');

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (targetSelector) {
                    const target = document.querySelector(targetSelector);
                    if (target) scrollToElementWithOffset(target, getNavbarHeight());
                } else {
                    scrollToElementWithOffset(page, getNavbarHeight());
                }
            });
        });

        window.removeEventListener('wheel', onFirstScroll);
        window.removeEventListener('touchstart', onFirstScroll);
        window.removeEventListener('keydown', onFirstKey);
    }

    function onFirstScroll() { revealAndScroll(); }
    function onFirstKey(e) {
        if (e && (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ')) revealAndScroll();
    }

    window.addEventListener('wheel', onFirstScroll, { once: true, passive: true });
    window.addEventListener('touchstart', onFirstScroll, { once: true, passive: true });
    window.addEventListener('keydown', onFirstKey, { once: true });
})();
