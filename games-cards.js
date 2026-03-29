// games-cards.js
window.makeGamePosterCard = function(g) {
  const d = document.createElement('div');
  d.className = 'mcard'; 
  d.style.cursor = 'pointer';
  
  // Хэрэв зураг байхгүй бол автоматаар нэрийг нь бичсэн зураг үүсгэнэ
  const posterUrl = g.poster || `https://placehold.co/400x600/1a1a2e/ffffff?text=${encodeURIComponent(g.title)}`;

  d.innerHTML = `
    <div class="mcard-poster-wrap" style="background-color: #111; overflow: hidden; position: relative;">
      <img src="${posterUrl}" alt="${g.title}" style="width:100%; height:100%; object-fit:cover; position:absolute; inset:0; z-index:0; transition: transform 0.3s ease;">
      <div style="position:absolute; inset:0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 40%); z-index:1;"></div>
      <div class="mcard-ov" style="z-index:2;">
        <div class="mcard-play">
          <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" fill="white"/></svg>
        </div>
      </div>
    </div>
    <div class="mcard-info">
      <div class="mcard-title">${g.title}</div>
      <div class="mcard-sub" style="color:#aaa;">${g.desc}</div>
    </div>`;
    
  // Хулгана очиход зураг томрох эффект
  d.addEventListener('mouseenter', () => {
    const img = d.querySelector('img');
    if(img) img.style.transform = 'scale(1.1)';
  });
  d.addEventListener('mouseleave', () => {
    const img = d.querySelector('img');
    if(img) img.style.transform = 'scale(1)';
  });

  d.onclick = () => window.openGame(g);
  return d;
};

window.makeGameListCard = function(g) {
  const d = document.createElement('div');
  d.className = 'game-card';
  const posterUrl = g.poster || `https://placehold.co/100x100/1a1a2e/ffffff?text=${encodeURIComponent(g.title)}`;
  
  d.innerHTML = `
    <div class="game-emoji" style="background-image: url('${posterUrl}'); background-size: cover; background-position: center; width: 60px; height: 60px; border-radius: 8px;"></div>
    <div class="game-info">
      <div class="game-title">${g.title}</div>
      <div class="game-desc">${g.desc}</div>
    </div>
    <button class="game-btn">▶ Тоглох</button>`;
  d.querySelector('.game-btn').onclick = (e) => { e.stopPropagation(); window.openGame(g); };
  return d;
};