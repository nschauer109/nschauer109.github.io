const canvas = document.getElementById('satelliteCanvas');
const ctx = canvas.getContext('2d');

let img = new Image();
img.crossOrigin = "anonymous"; // Allow loading the image from a different origin

let state = 0;

// Function to set canvas to fullscreen and redraw the image
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (img.complete) {
        displayImage(img); // Redraw the image if it's already loaded
    }
}

// Function to load the image in the background
function loadImage() {
    switch(state){
        case 0:
            img.src = "https://corsproxy.io/?url=https://cdn.star.nesdis.noaa.gov/GOES19/ABI/FD/GEOCOLOR/10848x10848.jpg?" + new Date().getTime();
            state = 1;
            break;
        case 1:
            img.src = "https://corsproxy.io/?url=https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/cgl/14/1200x1200.jpg?" + new Date().getTime();
            state = 0;
            break;
    }
    //img.src = "https://corsproxy.io/?url=https://cdn.star.nesdis.noaa.gov/GOES19/ABI/FD/GEOCOLOR/10848x10848.jpg?" + new Date().getTime(); // Cache busting with timestamp
    img.onload = () => {
        displayImage(img);
    };
}

// Function to draw the image on the canvas, maintaining aspect ratio
function displayImage(img) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate the scaling factor to maintain aspect ratio
    const scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height);

    // Calculate the top-left position to center the image
    const x = (canvas.width - img.width * scaleFactor) / 2;
    const y = (canvas.height - img.height * scaleFactor) / 2;

    // Draw the image on the canvas
    ctx.drawImage(img, 0, 0, img.width, img.height, x, y, img.width * scaleFactor, img.height * scaleFactor);

    setTimeout(loadImage, 800000);
}

// Adjust the canvas size and redraw the image whenever the window is resized
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Load the image for the first time
loadImage();
