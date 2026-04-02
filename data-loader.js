// data-loader.js — data.json татах, MOVIES/SERIES бэлдэх
import { fillRow } from './utils.js';

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

    const res  = await fetch('data.json?t=' + new Date().getTime(), { cache: 'no-store' });
    const json = await res.json();
    const raw  = json.data || json;

    raw.forEach((item, i) => {
      const isSeries = item.type?.toLowerCase().includes('series');
      const base = {
        id:       (isSeries ? 's' : 'm') + i,
        title:    item.mongolian_title || item.title,
        title_en: item.title,
        year:     item.year || window.FALLBACK_YEAR || 2024,
        rating:   item.ratings?.imdb ? parseFloat(item.ratings.imdb) : (window.FALLBACK_RATING || 7.0),
        poster:   (item.poster_link || '').replace(
          /http(s)?:\/\/www\.themoviedb\.org\/t\/p\/(original|w500)\//g,
          'https://image.tmdb.org/t/p/w500/'
        ),
        cat: (
          Array.isArray(item.genre)
            ? item.genre.join(',')
            : item.genre || ''
        ).toLowerCase(),
        country: (item.country || 'other').toLowerCase(),
      };

      if (isSeries) {
        const decodedEpisodes = (item.episodes || []).map(ep => ({
          ...ep,
          embed_links: ep.embed_links ? [decodeLink(ep.embed_links[0])] : []
        }));
        window.SERIES.push({ ...base, episodes: decodedEpisodes });
      } else {
        window.MOVIES.push({ ...base, embed: decodeLink(item.embed_links?.[0]) });
      }
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
