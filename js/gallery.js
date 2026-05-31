// ------------------------
// Image/Video gallery thumbnail switcher
// ------------------------
document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const mainContainer = gallery.querySelector('.gallery-main-container');
    const mainImg = gallery.querySelector('.gallery-main');
    const mainVideo = gallery.querySelector('.gallery-main-video');
    const thumbs = gallery.querySelectorAll('.gallery-thumbs img, .gallery-thumbs video');

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Remove active class from all thumbnails
            thumbs.forEach(t => t.classList.remove('active-thumb'));
            thumb.classList.add('active-thumb');

            // Check if thumbnail is a video or image
            if (thumb.tagName === 'VIDEO') {
                // Show video, hide image
                if (mainVideo) {
                    mainVideo.src = thumb.querySelector('source')?.src || thumb.src;
                    mainVideo.style.display = 'block';
                    mainVideo.load();
                }
                if (mainImg) {
                    mainImg.style.display = 'none';
                }
            } else {
                // Show image, hide video
                if (mainImg) {
                    mainImg.src = thumb.src;
                    mainImg.style.display = 'block';
                }
                if (mainVideo) {
                    mainVideo.style.display = 'none';
                    mainVideo.pause();
                }
            }
        });
    });
});

// ------------------------
// Lightbox functionality (supports images and videos)
// ------------------------
(function () {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img class="lightbox-image" src="" alt="" style="display: none;">
            <video class="lightbox-video" controls style="display: none;">
                <source src="" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxVideo = lightbox.querySelector('.lightbox-video');
    const lightboxVideoSource = lightboxVideo.querySelector('source');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    // Add click handlers to all gallery main images
    document.querySelectorAll('.gallery-main').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxImg.style.display = 'block';
            lightboxVideo.style.display = 'none';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Add click handlers to all gallery main videos
    document.querySelectorAll('.gallery-main-video').forEach(video => {
        video.style.cursor = 'pointer';
        video.addEventListener('click', () => {
            const videoSrc = video.querySelector('source')?.src || video.src;
            lightboxVideoSource.src = videoSrc;
            lightboxVideo.load();
            lightboxVideo.style.display = 'block';
            lightboxImg.style.display = 'none';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close lightbox function
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        // Pause video if playing
        if (lightboxVideo.style.display === 'block') {
            lightboxVideo.pause();
        }
    }

    // Close on button click
    closeBtn.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
})();
