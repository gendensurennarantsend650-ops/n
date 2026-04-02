// data-loader.js
import { fillRow } from './utils.js';

// 1. Өөрийн Worker-ийн хаягийг энд заавал зөв оруул (https://-тэй нь)
const WORKER_URL = "https://dark-meadow-83ae.narhantv.workers.dev";

function decodeLink(link) {
  if (!link) return '';
  if (link.startsWith('http')) return link;
  try { return atob(link); } catch (e) { return link; }
}

export async function loadData() {
  try {
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
        
        // Зургийн замыг тодорхойлох (Worker-ийн хаягийг залгах)
        // JSON-д 'poster' эсвэл 'poster_link' ашигласан бол хоёуланг нь танина
        let pLink = item.poster_link || item.poster || '';
        if (pLink && !pLink.startsWith('http')) {
          pLink = WORKER_URL + (pLink.startsWith('/') ? '' : '/') + pLink;
        }

        const base = {
          id: (isSeries ? 's' : 'm') + globalIndex++,
          title: item.mongolian_title || item.title,
          title_en: item.title,
          year: item.year || 2024,
          rating: item.ratings?.imdb || item.rating || 7.0,
          poster: pLink, // Энд эцсийн зургийн линк орно
          cat: (Array.isArray(item.genre) ? item.genre.join(',') : (item.genre || item.cat || '')).toLowerCase(),
          country: (item.country || 'other').toLowerCase(),
        };

        if (isSeries) {
          window.SERIES.push({ ...base, episodes: item.episodes || [] });
        } else {
          window.MOVIES.push({ ...base, embed: item.embed_links?.[0] || item.embed || '' });
        }
      });
    });

    buildHomeRows();
  } catch (e) {
    console.error("Алдаа:", e);
  }
}

// buildHomeRows функц хэвээрээ үлдэнэ...
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
}
