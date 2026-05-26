// ------------------------
// Header image changer lol
// ------------------------
(function () {
    const headerImage = document.querySelector('.portfolio-header-image');

    if (headerImage) {
        headerImage.addEventListener('mouseenter', () => {
            headerImage.src = './assets/images/goob-modified.png';
        });

        headerImage.addEventListener('mouseleave', () => {
            headerImage.src = './assets/images/newprofilepic-modified.png';
        });
    }
})();
