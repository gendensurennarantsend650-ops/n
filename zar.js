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
  
  // Зураг байгаа эсэхийг шалгах (ad.image эсвэл ad.src)
  const adImage = ad.image || ad.src;
  const hasImage = adImage && adImage.includes('http');
  const targetLink = ad.link || ad.src;

  if (hasImage) {
    // Зурагтай Premium Banner
    wrap.innerHTML = `
      <a href="${targetLink}" target="_blank" rel="noopener" class="ad-img-box" style="display:block; text-decoration:none; position:relative;">
        <div class="ad-corner-badge" style="position:absolute; top:8px; left:10px; background:linear-gradient(135deg,#c9a800,#f0d060); color:#000; font-size:10px; font-weight:800; padding:3px 9px; border-radius:4px; z-index:5;">${ad.label || 'РЕКЛАМ'}</div>
        <img src="${adImage}" alt="Ads" style="width:100%; border-radius:10px; display:block; border:1px solid rgba(212,175,55,0.3);">
      </a>`;
  } else {
    // Зураггүй үед гарах блок
    wrap.innerHTML = `
      <div class="ad-empty-box" style="border:1.5px dashed rgba(212,175,55,0.3); padding:14px 20px; border-radius:10px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="color:#D4AF37; font-weight:600;">${ad.label || 'BANNER'} - Реклам байрлуул</div>
          <div style="color:rgba(212,175,55,0.5); font-size:12px;">Холбогдох: 99376238</div>
        </div>
        <a href="tel:99376238" style="background:#f0d060; color:#000; padding:8px 15px; border-radius:6px; text-decoration:none; font-weight:800;">📞 99376238</a>
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

// Глобал болгох
window.insertAds = insertAds;
window.addEventListener('load', () => {
    setTimeout(insertAds, 800);
});