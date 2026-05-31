// ------------------------
// Image gallery thumbnail switcher
// ------------------------
document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const mainImg = gallery.querySelector('.gallery-main');
    const thumbs = gallery.querySelectorAll('.gallery-thumbs img');

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            mainImg.src = thumb.src;
            thumbs.forEach(t => t.classList.remove('active-thumb'));
            thumb.classList.add('active-thumb');
        });
    });
});
