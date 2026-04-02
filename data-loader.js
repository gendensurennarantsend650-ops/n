// data-loader.js — Олон JSON файлаас өгөгдөл татах + Worker холболт
import { fillRow } from './utils.js';

// 1. Чиний Worker-ийн хаяг (Зургийг эндээс татна)
const WORKER_URL = "https://dark-meadow-83ae.narhantv.workers.dev";

function decodeLink(link) {
  if (!link) return '';
  if (link.startsWith('http')) return link;
  try { return atob(link); } catch (e) { return link; }
}

export async function loadData() {
  try {
    const titleEl = document.getElementById('appTitle');
    const phoneEl = document.getElementById('contactPhoneEl');
    if (titleEl) titleEl.textContent = `Nabooshy - ${window.CURRENT_YEAR || 2026} Оны Ухаалаг Платформ`;
    if (phoneEl) phoneEl.textContent = window.CONTACT_PHONE || '9937-6238';

    window.MOVIES = [];
    window.SERIES = [];

    const files = [
      'data_horror.json', 'data_drama.json', 'data_tsuwral.json',
      'data_action.json', 'data_adal.json', 'data_tvvhen.json',
      'data_aimshig.json', 'data_trailer.json', 'data_zognol.json',
      'data_hvvhed.json', 'data_gemt.json', 'data_hair.json',
      'data_nuutslag.json', 'data_barimt.json', 'data_gerbvl.json',
      'data_daintai.json', 'data_namtar.json', 'data_comedy.json'
    ];

    let globalIndex = 0;

    const responses = await Promise.all(files.map(file => 
      fetch(file + '?t=' + new Date().getTime()).then(res => res.json()).catch(e => [])
    ));

    responses.forEach(json => {
      const raw = json.data || json;
      if (!Array.isArray(raw)) return;

      raw.forEach((item) => {
        const isSeries = item.type?.toLowerCase().includes('series');

        // --- ПОСТЕР ХОЛБОЛТ (Worker-тэй холбох) ---
        let pLink = item.poster_link || item.poster || '';
        if (pLink && !pLink.startsWith('http')) {
          // Хэрэв линк / -ээр эхлээгүй бол нэмж өгнө
          const cleanPath = pLink.startsWith('/') ? pLink : '/' + pLink;
          pLink = WORKER_URL + cleanPath;
        } else {
          // TMDB-ийн зургийг засах хуучин логик
          pLink = pLink.replace(/http(s)?:\/\/www\.themoviedb\.org\/t\/p\/(original|w500)\//g, 'https://image.tmdb.org/t/p/w500/');
        }

        // --- ҮНЭЛГЭЭ (Ratings) ---
        let movieRating = window.FALLBACK_RATING || 7.0;
        if (item.ratings?.imdb) movieRating = parseFloat(item.ratings.imdb);
        else if (item.rating) movieRating = parseFloat(item.rating);

        // --- ТӨРӨЛ (Genre/Cat) ---
        let category = '';
        if (Array.isArray(item.genre)) category = item.genre.join(',');
        else if (item.genre) category = item.genre;
        else if (item.cat) category = item.cat;

        const base = {
          id: (isSeries ? 's' : 'm') + globalIndex++,
          title: item.mongolian_title || item.title,
          title_en: item.title,
          year: item.year || window.FALLBACK_YEAR || 2024,
          rating: movieRating,
          poster: pLink,
          cat: category.toLowerCase(),
          country: (item.country || 'other').toLowerCase(),
        };

        if (isSeries) {
          const decodedEpisodes = (item.episodes || []).map(ep => ({
            ...ep,
            embed_links: ep.embed_links ? [decodeLink(ep.embed_links[0])] : []
          }));
          window.SERIES.push({ ...base, episodes: decodedEpisodes });
        } else {
          // Embed линкийг 'embed_links' эсвэл 'embed' талбараас авах
          const eLink = (item.embed_links && item.embed_links[0]) || item.embed || '';
          window.MOVIES.push({ ...base, embed: decodeLink(eLink) });
        }
      });
    });

    buildHomeRows();
    if (window.fetchTMDBNowPlaying) window.fetchTMDBNowPlaying();

  } catch (e) {
    window.toast('Өгөгдөл татахад алдаа!');
    console.error(e);
  }
}

function buildHomeRows() {
  fillRow('rowFeatured', window.MOVIES.slice(0, 30));
  fillRow('rowSeries',   window.SERIES.slice(0, 20), true);

  const dc = document.getElementById('dynamicRows');
  if (dc && window.HOME_ROWS) {
    dc.innerHTML = '';
    window.HOME_ROWS.forEach(({ id, title, keys }) => {
      const items = window.MOVIES.filter(m => keys.some(k => m.cat.includes(k))).slice(0, 25);
      if (items.length > 0) {
        const sec = document.createElement('section');
        sec.className = 'sec';
        sec.innerHTML = `
          <div class="sec-head"><div class="sec-title">${title}</div></div>
          <div class="row-wrap">
            <button class="scroll-btn left" onclick="scrollRow('${id}',-600)">❮</button>
            <div class="scroll-row" id="${id}"></div>
            <button class="scroll-btn right" onclick="scrollRow('${id}',600)">❯</button>
          </div>`;
        dc.appendChild(sec);
        fillRow(id, items);
      }
    });
  }

  if (window.buildGamesRow) window.buildGamesRow();
  setTimeout(() => { if (window.insertAds) window.insertAds(); }, 500);
}
