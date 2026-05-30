// ------------------------
// Header image changer lol
// ------------------------
(function () {
    const headerImage = document.querySelector('.portfolio-header-image');

    if (headerImage) {
        // Create a custom tooltip element
        const tooltip = document.createElement('div');
        tooltip.textContent = 'I also like cats :)';
        tooltip.style.position = 'fixed';
        tooltip.style.backgroundColor = 'rgba(30, 30, 30, 0.9)';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '6px 12px';
        tooltip.style.borderRadius = '6px';
        tooltip.style.fontSize = '13px';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.15s ease';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.zIndex = '1000';
        tooltip.style.boxShadow = '0px 2px 4px rgba(0,0,0,0.2)';
        
        document.body.appendChild(tooltip);

        headerImage.addEventListener('mouseenter', () => {
            headerImage.src = './assets/images/goob-modified.png';
            tooltip.style.opacity = '1';
        });

        headerImage.addEventListener('mousemove', (e) => {
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY + 15) + 'px';
        });

        headerImage.addEventListener('mouseleave', () => {
            headerImage.src = './assets/images/newprofilepic-modified.png';
            tooltip.style.opacity = '0';
        });
    }
})();
