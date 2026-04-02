// hero-pages.js — Хуудас бүрийн hero тохиргоо (games, weather, movies)
import { showPoster, hidePoster, animateContent, stopProgress } from './hero-utils.js';
import { startSlide } from './hero-movies.js';

window.setPageHero = function (page) {
  const heroWrap = document.getElementById('heroWrap');

  // ── ХАЙЛТ: hero нуух ──────────────────────────────────────
  if (page === 'search') {
    if (heroWrap) heroWrap.style.display = 'none';
    window.stopTrailer?.();
    clearInterval(window._heroInterval);
    stopProgress();
    return;
  }

  if (heroWrap) heroWrap.style.display = '';

  // ── КИНО ──────────────────────────────────────────────────
  if (page === 'movies') {
    if (window.HERO_MOVIES?.length) {
      window.initHero();
    } else if (window.fetchTMDBNowPlaying) {
      window.fetchTMDBNowPlaying();
    }
    return;
  }

  // ── ТОГЛООМ ───────────────────────────────────────────────
  if (page === 'games') {
    _initGamesHero();
    return;
  }

  // ── ЦАГ АГААР ─────────────────────────────────────────────
  if (page === 'weather') {
    _initWeatherHero();
    return;
  }
};

// ── Тоглоомын hero ────────────────────────────────────────────
function _initGamesHero() {
  window.stopTrailer?.();
  stopProgress();

  const games = window.HERO_GAMES || [];
  if (!games.length) return;

  let gi   = 0;
  let gInt = null;

  function showGame(idx) {
    const g = games[idx];
    if (!g) return;

    const posterUrl = `https://img.youtube.com/vi/${g.trailer}/hqdefault.jpg`;
    showPoster(posterUrl);

    const tag = document.getElementById('heroTag');
    if (tag) tag.innerHTML = `🎮 ${(g.cat || 'ТОГЛООМ').toUpperCase()}`;

    const title = document.getElementById('heroTitle');
    if (title) title.textContent = g.title;

    const meta = document.getElementById('heroMeta');
    if (meta) meta.innerHTML = `<span>${g.desc}</span>`;

    const desc = document.getElementById('heroDesc');
    if (desc) desc.textContent = '';

    const dotsEl = document.getElementById('heroDots');
    if (dotsEl) {
      dotsEl.innerHTML = '';
      games.forEach((_, i) => {
        const dot     = document.createElement('div');
        dot.className = 'hero-dot' + (i === idx ? ' active' : '');
        dot.onclick   = () => { clearInterval(gInt); gi = i; showGame(i); startGameSlide(); };
        dotsEl.appendChild(dot);
      });
    }

    const btns = document.getElementById('heroBtns');
    if (btns) {
      btns.innerHTML = `
        <button class="btn-watch"
          onclick="window.openPlayer({title:'${g.title}',embed:'https://www.youtube.com/embed/${g.trailer}?autoplay=1'})">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21"/>
          </svg> Трейлер үзэх
        </button>
        <button class="btn-more"
          onclick="document.getElementById('gameGenreBar')?.scrollIntoView({behavior:'smooth'})">
          🎮 Бүгд харах
        </button>
        <button class="btn-volume" id="heroVolumeBtn" onclick="toggleHeroVolume()" style="display:none">🔇 Дууг нээх</button>`;
    }

    animateContent();
    window.hideVolBtn?.();
    window.stopTrailer?.();

    const ytUrl = `https://www.youtube.com/watch?v=${g.trailer}`;
    const type  = window.detectTrailerType?.(ytUrl);
    if (type) {
      window.playTrailer?.(ytUrl, type,
        () => { hidePoster(); window.showVolBtn?.(); },
        () => { gi = (gi + 1) % games.length; showGame(gi); startGameSlide(); },
        () => { showPoster(posterUrl); window.hideVolBtn?.(); }
      );
    }
  }

  function startGameSlide() {
    clearInterval(gInt);
    gInt = setInterval(() => {
      const cont = document.getElementById('heroVideoContainer');
      if (!cont?.hasChildNodes()) {
        gi = (gi + 1) % games.length;
        showGame(gi);
      }
    }, window.GAME_TIMER || 14000);
  }

  showGame(0);
  startGameSlide();
}

// ── Цаг агаарын hero ──────────────────────────────────────────
function _initWeatherHero() {
  window.stopTrailer?.();
  stopProgress();

  const bg = document.querySelector('.hero-bg');
  if (bg) {
    bg.style.backgroundImage = '';
    bg.style.background = 'linear-gradient(135deg, #1a237e 0%, #0277bd 50%, #01579b 100%)';
    bg.style.opacity    = '1';
  }
  const vig = document.querySelector('.hero-vignette');
  if (vig) vig.style.opacity = '1';

  const tag = document.getElementById('heroTag');
  if (tag) tag.textContent = '🌤 ЦАГ АГААРЫН МЭДЭЭЛЭЛ';

  const title = document.getElementById('heroTitle');
  if (title) title.textContent = 'Монгол улс';

  const meta = document.getElementById('heroMeta');
  if (meta) meta.innerHTML = '<span>21 аймаг, хотын цаг агаар</span>';

  const desc = document.getElementById('heroDesc');
  if (desc) desc.textContent = '';

  const dots = document.getElementById('heroDots');
  if (dots) dots.innerHTML = '';

  const btns = document.getElementById('heroBtns');
  if (btns) {
    btns.innerHTML = `
      <button class="btn-watch" onclick="window.loadWeather?.()">☁️ Цаг агаар харах</button>
      <button class="btn-more"  onclick="window.refreshWeather?.()">🔄 Шинэчлэх</button>`;
  }
  window.hideVolBtn?.();
  animateContent();

  const cityQuery = window.DEFAULT_CITY || 'Ulaanbaatar';
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityQuery}&appid=${window.OW_KEY}&units=metric`)
    .then(r => r.json())
    .then(d => {
      if (!d?.main) return;
      const temp = Math.round(d.main.temp);
      const feel = Math.round(d.main.feels_like);
      const cond = d.weather[0].main.toLowerCase();
      let icon = '🌤';
      if      (cond.includes('clear'))                          icon = '☀️';
      else if (cond.includes('cloud'))                          icon = '⛅';
      else if (cond.includes('rain'))                           icon = '🌧️';
      else if (cond.includes('snow'))                           icon = '❄️';
      else if (cond.includes('thunder'))                        icon = '⛈️';
      else if (cond.includes('mist') || cond.includes('fog'))   icon = '🌫️';

      const t = document.getElementById('heroTitle');
      if (t) t.textContent = `${icon} ${cityQuery}  ${temp > 0 ? '+' : ''}${temp}°C`;

      const m = document.getElementById('heroMeta');
      if (m) m.innerHTML = `
        <span>${d.weather[0].description}</span>
        <span>·</span><span>🌡️ ${feel > 0 ? '+' : ''}${feel}°C</span>
        <span>·</span><span>💧 ${d.main.humidity}%</span>
        <span>·</span><span>💨 ${(d.wind.speed * 3.6).toFixed(0)} км/ц</span>`;

      let gradient = 'linear-gradient(135deg,#1a237e,#0277bd,#01579b)';
      if      (temp < -20) gradient = 'linear-gradient(135deg,#0d1b2a,#1b2a3b,#4fc3f7)';
      else if (temp <  -5) gradient = 'linear-gradient(135deg,#1a237e,#283593,#81d4fa)';
      else if (temp >  20) gradient = 'linear-gradient(135deg,#4a0000,#b71c1c,#ff8f00)';
      else if (temp >  10) gradient = 'linear-gradient(135deg,#1b5e20,#2e7d32,#66bb6a)';

      const b = document.querySelector('.hero-bg');
      if (b) b.style.background = gradient;
    })
    .catch(() => {});
}
