// zar.js
import './zar-config.js'; 
import { ZAR_CSS } from './zar-styles.js'; 

function _zarInjectCSS() {
  if (document.getElementById('_zar_css')) return;
  const s = document.createElement('style');
  s.id = '_zar_css';
  s.textContent = ZAR_CSS;
  document.head.appendChild(s);
}

function _zarBuildEl(ad) {
  const wrap = document.createElement('div');
  wrap.className = 'ad-wrap';
  
  // Зураг байгаа эсэхийг шалгах
  const hasImage = ad.image && ad.image.length > 5;
  const targetLink = ad.link || ad.src;

  if (hasImage) {
    // Хэрэв зураг байвал Premium Banner хэлбэрээр гаргана
    wrap.innerHTML = `
      <a href="${targetLink}" target="_blank" rel="noopener" class="ad-img-box">
        <div class="ad-corner-badge">${ad.label || 'РЕКЛАМ'}</div>
        <img src="${ad.image}" alt="Nabooshy Ads" loading="lazy">
      </a>`;
  } else {
    // Зураг байхгүй үед хуучин бичгэн хэлбэрээр гаргана
    wrap.innerHTML = `
      <div class="ad-link-box">
        <div class="ad-link-left">
          <div class="ad-badge">${ad.label || 'BANNER'}</div>
          <div class="ad-link-texts">
            <div class="ad-link-title">Спонсор холбоос</div>
            <div class="ad-link-sub">Рекламаа явуулах бол: 99376238</div>
          </div>
        </div>
        <a href="${targetLink}" target="_blank" class="ad-goto-btn">↗ ҮЗЭХ</a>
      </div>`;
  }
  return wrap;
}

export function insertAds() {
  _zarInjectCSS();
  document.querySelectorAll('.ad-wrap').forEach(el => el.remove());
  
  const ads = window.MY_ADS || [];
  ads.forEach(ad => {
    if (!ad.isActive) return;
    const row = document.getElementById(ad.afterRowId);
    if (row && row.parentElement) {
      row.parentElement.insertAdjacentElement('afterend', _zarBuildEl(ad));
    }
  });
}

// Хуудас ачаалагдсаны дараа зарыг оруулна
if (document.readyState === 'complete') {
  insertAds();
} else {
  window.addEventListener('load', insertAds);
}

window.insertAds = insertAds;