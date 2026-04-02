// app.js — Гол entry point: import, navigation, security
import './firebase-config.js';
import './auth.js';
import './player.js';
import './config.js';
import './weather.js';
import './games.js';
import './hero.js';
import './hero-pages.js';

import {} from './movies.js';
import { buildSeriesPage } from './series.js';
import './search.js';
import { loadData } from './data-loader.js';

window.MOVIES = [];
window.SERIES = [];

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
});

window.scrollRow = function (id, dx) {
  document.getElementById(id)?.scrollBy({ left: dx, behavior: 'smooth' });
};

window.showSeriesGrid = function () {
  const s = document.getElementById('seriesFullSection');
  if (!s) return;
  if (s.style.display !== 'none') {
    s.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    s.style.display = '';
    buildSeriesPage();
    s.scrollIntoView({ behavior: 'smooth' });
  }
};

window.gotoPage = function (p) {
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  document.getElementById('page-' + p)?.classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('t-' + p)?.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (window.setPageHero)  window.setPageHero(p);
  if (p === 'games'   && window.buildGamesPage) window.buildGamesPage();
  if (p === 'weather' && window.loadWeather)    window.loadWeather();
  if (p === 'search') setTimeout(() => document.getElementById('searchPageInput')?.focus(), 300);
};

loadData();

// ── 🛡️ Хамгаалалт (Anti-Inspect, No Right Click) ─────────────
document.addEventListener('contextmenu', e => e.preventDefault());
document.onkeydown = function (e) {
  if (e.keyCode === 123)                                return false; // F12
  if (e.ctrlKey && e.shiftKey && e.keyCode === 73)     return false; // Ctrl+Shift+I
  if (e.ctrlKey && e.shiftKey && e.keyCode === 67)     return false; // Ctrl+Shift+C
  if (e.ctrlKey && e.shiftKey && e.keyCode === 74)     return false; // Ctrl+Shift+J
  if (e.ctrlKey && e.keyCode === 85)                   return false; // Ctrl+U
};
console.log('%cЗОГС!', 'color: red; font-size: 50px; font-weight: bold;');
console.log('%cЭнэ сайтын кодыг хуулахыг хориглоно.', 'font-size: 18px;');
