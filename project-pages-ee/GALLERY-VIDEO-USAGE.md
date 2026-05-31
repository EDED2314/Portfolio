# Video Gallery Usage Guide

This guide explains how to use videos in the image galleries on your portfolio site.

## Features Added

1. **Video thumbnails** - Videos can now be used as thumbnails in galleries
2. **Video main display** - Videos can be the main display item in a gallery
3. **Video lightbox** - Clicking on videos opens them in a lightbox modal with controls
4. **Mixed galleries** - You can mix images and videos in the same gallery

## Basic Usage

### Image-Only Gallery (Original)
```html
<div class="image-gallery" data-gallery>
  <img class="gallery-main" src="path/to/main-image.jpg" alt="Main Image">
  <div class="gallery-thumbs">
    <img src="path/to/thumb1.jpg" alt="Thumbnail 1">
    <img src="path/to/thumb2.jpg" alt="Thumbnail 2">
  </div>
</div>
```

### Video-First Gallery (New)
```html
<div class="image-gallery" data-gallery>
  <!-- Main video display (shown by default) -->
  <video class="gallery-main-video" controls>
    <source src="path/to/video.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  
  <!-- Main image (hidden by default, shown when image thumb is clicked) -->
  <img class="gallery-main" src="path/to/image.jpg" alt="Image" style="display: none;">
  
  <!-- Thumbnails (mix of videos and images) -->
  <div class="gallery-thumbs">
    <video muted>
      <source src="path/to/video1.mp4" type="video/mp4">
    </video>
    <video muted>
      <source src="path/to/video2.mp4" type="video/mp4">
    </video>
    <img src="path/to/image1.jpg" alt="Image 1">
    <img src="path/to/image2.jpg" alt="Image 2">
  </div>
</div>
```

### Image-First Gallery with Videos
```html
<div class="image-gallery" data-gallery>
  <!-- Main image display (shown by default) -->
  <img class="gallery-main" src="path/to/main-image.jpg" alt="Main Image">
  
  <!-- Main video (hidden by default, shown when video thumb is clicked) -->
  <video class="gallery-main-video" controls style="display: none;">
    <source src="path/to/video.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
  
  <!-- Thumbnails -->
  <div class="gallery-thumbs">
    <img src="path/to/image1.jpg" alt="Image 1">
    <img src="path/to/image2.jpg" alt="Image 2">
    <video muted>
      <source src="path/to/video1.mp4" type="video/mp4">
    </video>
  </div>
</div>
```

## Important Notes

1. **Video thumbnail muting**: Always use `muted` attribute on thumbnail videos to prevent audio from playing when hovering
2. **Main video controls**: Use `controls` attribute on main display videos so users can play/pause/seek
3. **Display toggling**: Use `style="display: none;"` on the element you want hidden by default
4. **Video formats**: Use MP4 format for best browser compatibility. MOV files work in most browsers but MP4 is more universal
5. **File size**: Be mindful of video file sizes - large videos may take time to load

## Behavior

- Clicking a video thumbnail switches the main display to that video
- Clicking an image thumbnail switches the main display to that image
- Clicking the main display (image or video) opens it in a lightbox modal
- Videos in the lightbox have full controls (play, pause, seek, volume, fullscreen)
- Closing the lightbox pauses any playing video

## CSS Classes

- `.gallery-main` - Main image display
- `.gallery-main-video` - Main video display
- `.gallery-thumbs` - Container for thumbnails
- `.gallery-thumbs img` - Image thumbnails
- `.gallery-thumbs video` - Video thumbnails
- `.active-thumb` - Applied to the currently selected thumbnail
- `.lightbox` - Lightbox modal container
- `.lightbox-image` - Image in lightbox
- `.lightbox-video` - Video in lightbox

## Example from CAM-MK3 Project

See `/project-pages-ee/cam-mk3.html` for a real-world example in the "Integration and Testing Section".
