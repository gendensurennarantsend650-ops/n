// player.js
import './player-hls.js';

// 1. Энд өөрийн Worker-ийн хаягийг оруулна
const WORKER_URL = "https://nabooshy-video-proxy.narhantv.workers.dev";

// Нэвтрэхийн өмнө дарсан кинонийг хадгалах
window._pendingMovie = null;

window.openPlayer = (m) => {
  if (!window.currentUser) {
    window._pendingMovie = m;
    window.closeM('movieModal');
    window.openAuth('login');
    window.toast('Үзэхийн тулд нэвтэрнэ үү 🔐');
    return;
  }
  _playMovie(m);
};

// Жинхэнэ тоглуулах функц
function _playMovie(m) {
  const wrap = document.getElementById('playerWrap');
  const p2p  = document.getElementById('p2pStatus');
  wrap.innerHTML = '';
  window.destroyHLS();

  // 2. Видеоны линкийг Worker-ээр дамжуулах эсэхийг шалгах
  let videoUrl = m.embed;
  
  // Хэрэв линк нь http-ээр эхлээгүй бол (энэ нь чиний R2-ын файл гэсэн үг)
  // Worker-ийн хаягийг урд нь залгана
  if (videoUrl && !videoUrl.startsWith('http')) {
    videoUrl = WORKER_URL + videoUrl;
  }

  if (videoUrl?.includes('.m3u8')) {
    window.playHLS(videoUrl, wrap, p2p);
  } else if (videoUrl) {
    if (p2p) p2p.style.display = 'none';
    wrap.innerHTML = `<iframe src="${videoUrl}" allowfullscreen
      style="width:100%;height:100%;border:none;background:#000;"></iframe>`;
  }

  document.getElementById('pTitle').textContent = m.title;
  document.getElementById('movieModal').classList.remove('open');
  document.getElementById('playerModal').classList.add('open');
}

// Нэвтэрсний дараа шууд нээх
window.onAfterLogin = () => {
  if (window._pendingMovie) {
    const m = window._pendingMovie;
    window._pendingMovie = null;
    window.closeAuth();
    setTimeout(() => _playMovie(m), 300);
  }
};

window.closeM = (id) => {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
  if (id === 'gameModal') document.getElementById('gmFrame').src = '';
  if (id === 'playerModal') {
    const w = document.getElementById('playerWrap');
    if (w) w.innerHTML = '';
    window.destroyHLS();
  }
};

window.closeMb = (e, id) => { if (e.target.id === id) window.closeM(id); };
