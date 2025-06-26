const canvas = document.getElementById('satelliteCanvas');
const ctx    = canvas.getContext('2d');

let currentBitmap = null;   // last successfully decoded frame
let state         = 0;      // 0 = full‑disk, 1 = regional
let timerId       = null;   // single refresh timer

// ------------------------------------------------------------
// Responsive canvas size + redraw
// ------------------------------------------------------------
function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  if (currentBitmap) {
    draw(currentBitmap);    // redraw at new size
  }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();             // initial size set‑up

// ------------------------------------------------------------
// Helper: pick URL & cache‑buster
// ------------------------------------------------------------
function nextUrl() {
  const fullDisk  = 'https://corsproxy.io/?url=https://cdn.star.nesdis.noaa.gov/GOES19/ABI/FD/GEOCOLOR/10848x10848.jpg';
  const regional  = 'https://corsproxy.io/?url=https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/cgl/14/1200x1200.jpg';
  const chosen    = state ? regional : fullDisk;
  state ^= 1;                          // toggle 0 ⇄ 1
  return `${chosen}?t=${Date.now()}`;  // bust cache
}

// ------------------------------------------------------------
// Load, down‑scale on decode, then draw
// ------------------------------------------------------------
async function loadImage() {
  try {
    const resp  = await fetch(nextUrl(), { mode: 'cors' });
    const blob  = await resp.blob();

    // decode directly to viewport‑sized bitmap
    const bitmap = await createImageBitmap(blob, {
      resizeWidth:  Math.min(canvas.width, canvas.height),
      resizeHeight: Math.min(canvas.width, canvas.height),
      resizeQuality: 'high',
    });

    currentBitmap = bitmap;
    draw(bitmap);
    scheduleNext();              // after successful draw
  } catch (err) {
    console.error('loadImage failed:', err);
    scheduleNext();              // retry after interval anyway
  }
}

// ------------------------------------------------------------
// Single‑shot timer management
// ------------------------------------------------------------
function scheduleNext() {
  clearTimeout(timerId);
  timerId = setTimeout(loadImage, 300_000);  // 5 minutes
}

// ------------------------------------------------------------
// Draw helper – keep aspect ratio, center on canvas
// ------------------------------------------------------------
function draw(bitmap) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const scale = Math.min(canvas.width / bitmap.width, canvas.height / bitmap.height);
  const w     = bitmap.width  * scale;
  const h     = bitmap.height * scale;
  const x     = (canvas.width  - w) / 2;
  const y     = (canvas.height - h) / 2;

  ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, x, y, w, h);
}

// ------------------------------------------------------------
// Kick things off
// ------------------------------------------------------------
loadImage();
