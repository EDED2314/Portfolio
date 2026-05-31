// ------------------------
// Footer loader + clipboard toast
// ------------------------
(function () {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;

    const pathParts = window.location.pathname.split('/').filter(p => p);
    let depth = pathParts.length - 1;
    if (window.location.pathname.includes('Protfolio')) depth -= 1;

    let prefix = '';
    for (let i = 0; i < depth; i++) prefix += '../';

    fetch(prefix + 'footer.html')
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
        .then(data => {
            if (prefix) data = data.replaceAll('./assets/', prefix + 'assets/');
            placeholder.outerHTML = data;

            const emailBtn = document.querySelector('.footer-email-btn');
            if (!emailBtn) return;

            emailBtn.addEventListener('click', () => {
                const email = 'eddiejt2@outlook.com';
                navigator.clipboard.writeText(email)
                    .then(() => showToast('Email copied!', emailBtn))
                    .catch(() => {
                        // Fallback for older browsers
                        const ta = document.createElement('textarea');
                        ta.value = email;
                        ta.style.cssText = 'position:fixed;opacity:0';
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand('copy');
                        document.body.removeChild(ta);
                        showToast('Email copied!', emailBtn);
                    });
            });
        })
        .catch(err => console.error('Failed to load footer:', err));

    function showToast(msg, anchor) {
        const existing = document.getElementById('footer-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'footer-toast';
        toast.textContent = msg;
        // Position off-screen first so we can measure it
        toast.style.visibility = 'hidden';
        document.body.appendChild(toast);

        // Anchor the toast to the left of the email button
        const btnRect = anchor.getBoundingClientRect();
        const toastRect = toast.getBoundingClientRect();
        const gap = 5;

        toast.style.position = 'fixed';
        toast.style.right = (window.innerWidth - btnRect.left + gap) + 'px';
        toast.style.top = (btnRect.top + (btnRect.height / 2) - (toastRect.height / 2)) + 'px';
        toast.style.visibility = '';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => toast.classList.add('footer-toast-visible'));
        });

        setTimeout(() => {
            toast.classList.remove('footer-toast-visible');
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        }, 2000);
    }
})();
