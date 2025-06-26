const img    = document.getElementById('sat');

//let currentBitmap = null;   // last successfully decoded frame
let state         = 0;      // 0 = full‑disk, 1 = regional
let timerId       = null;   // single refresh timer

// ------------------------------------------------------------
// Helper: pick URL & cache‑buster
// ------------------------------------------------------------
function nextUrl() {
  const fullDisk  = 'https://corsproxy.io/?url=https://cdn.star.nesdis.noaa.gov/GOES19/ABI/FD/GEOCOLOR/1808x1808.jpg';// 'https://corsproxy.io/?url=https://cdn.star.nesdis.noaa.gov/GOES19/ABI/FD/GEOCOLOR/10848x10848.jpg';
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
    const url = nextUrl();
    img.src = url;
  } catch (err) {
    console.error('loadImage failed:', err);
  } finally {
    scheduleNext();
  }
}

// ------------------------------------------------------------
// Single‑shot timer management
// ------------------------------------------------------------
function scheduleNext() {
  clearTimeout(timerId);
  timerId = setTimeout(loadImage, 90_000);  // 5 minutes
}

// ------------------------------------------------------------
// Kick things off
// ------------------------------------------------------------
loadImage();
