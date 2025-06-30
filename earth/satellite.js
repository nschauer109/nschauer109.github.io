const img   = document.getElementById('sat');

  // ————————————————————————————————
  // 1 · Restore last state (0 = full-disk, 1 = regional)
  // ————————————————————————————————
  let state = Number(sessionStorage.getItem('state') ?? 0);

  // ————————————————————————————————
  // 2 · Pick URL + cache-buster
  // ————————————————————————————————
  function currentUrl() {
    const urls = [
      'https://corsproxy.io/?url=https://cdn.star.nesdis.noaa.gov/GOES19/ABI/FD/GEOCOLOR/1808x1808.jpg',
      'https://corsproxy.io/?url=https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/cgl/14/1200x1200.jpg'
    ];
    return `${urls[state]}?t=${Date.now()}`;   // defeat browser cache
  }

  // ————————————————————————————————
  // 3 · Display, toggle, persist, schedule reload
  // ————————————————————————————————
  function showImage() {
    img.src = currentUrl();

    state ^= 1;                                // flip 0 ⇄ 1
    sessionStorage.setItem('state', state);    // remembered on next load

    setTimeout(() => location.reload(), 90_000);
  }

  // Kick off immediately (DOMContentLoaded safe if this <script> is in <head>)
  showImage();
