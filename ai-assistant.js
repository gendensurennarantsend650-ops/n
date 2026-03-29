import { aiStyles, aiHTML } from './ai-ui.js';
import { askAI } from './ai-logic.js';

// ═══════════════════════════════════════
// UI НЭМЭХ
// ═══════════════════════════════════════
document.body.insertAdjacentHTML('beforeend', aiStyles + aiHTML);

const aiInput  = document.getElementById('ai-input');
const aiSend   = document.getElementById('ai-send-btn');
const aiMsgs   = document.getElementById('ai-msgs');
const aiBox    = document.getElementById('ai-chat-box');
const aiToggle = document.getElementById('ai-toggle-btn');
const aiClose  = document.getElementById('ai-close-btn');

let isOpen    = false;
let isSending = false;
let _weather  = null;   // 🌤️ Цаг агаарын кэш
let _context  = {};     // AI-д дамжуулах нэгдсэн контекст

// ═══════════════════════════════════════
// ⭐ 10. ХЭРЭГЛЭГЧИЙН СОНГОЛТ (localStorage)
// ═══════════════════════════════════════
function getPrefs() {
  try {
    return JSON.parse(localStorage.getItem('nb_prefs') || '{"liked":[],"disliked":[]}');
  } catch { return { liked: [], disliked: [] }; }
}

function savePrefs(prefs) {
  try { localStorage.setItem('nb_prefs', JSON.stringify(prefs)); } catch {}
}

function addLiked(title) {
  const p = getPrefs();
  if (!p.liked.includes(title)) { p.liked.push(title); savePrefs(p); }
}

function addDisliked(title) {
  const p = getPrefs();
  if (!p.disliked.includes(title)) { p.disliked.push(title); savePrefs(p); }
  // Таалагдаагүй бол liked-аас хас
  p.liked = p.liked.filter(t => t !== title);
  savePrefs(p);
}

// ═══════════════════════════════════════
// 🌤️ 7. ЦАГ АГААР ТАТАХ
// ═══════════════════════════════════════
async function fetchWeather() {
  try {
    const key  = window.OW_KEY;
    const city = window.DEFAULT_CITY || 'Ulaanbaatar';
    if (!key) return null;
    const res  = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric&lang=en`
    );
    if (!res.ok) return null;
    const d = await res.json();
    return {
      temp  : Math.round(d.main.temp),
      feels : Math.round(d.main.feels_like),
      desc  : d.weather[0].description
    };
  } catch { return null; }
}

// ═══════════════════════════════════════
// 📅 4. ОДООГИЙН ЦАГ АВАХ
// ═══════════════════════════════════════
function getCurrentTime() {
  const h = new Date().getHours();
  if (h >= 6  && h < 11) return `${h}:00 (өглөө)`;
  if (h >= 11 && h < 17) return `${h}:00 (өдөр)`;
  if (h >= 17 && h < 21) return `${h}:00 (орой)`;
  if (h >= 21)            return `${h}:00 (шөнө)`;
  return `${h}:00 (гүн шөнө)`;
}

// ═══════════════════════════════════════
// 💬 ТАВТАЙ МОРИЛОХ МЕССЕЖ
// ═══════════════════════════════════════
const WELCOME_MSG = `Nabooshy сайтад тавтай морилно уу! 🎬✨

Та манай сайт дотор дуртай кино, цуврал, тоглоомоо **үнэгүй** үзнэ үү.

⚠️ Манайх ямар нэгэн хэлбэрээр мөнгө авдаггүй. Хэрвээ танаас мөнгө нэхэж байвал **луйвар** болно — өөрийгөө хамгаалаарай!

Доорх товчнуудаас сонгох эсвэл шууд бичнэ үү 👇`;

// ═══════════════════════════════════════
// 🚀 ХУРДАН САНАЛ ТОВЧНУУД (Quick Chips)
// ═══════════════════════════════════════
const QUICK_CHIPS = [
  { label: '🎭 Сэтгэлтэйгээр хайх',       msg: 'Өнөөдрийн сэтгэл байдалд тохирсон кино санал болго' },
  { label: '🌤️ Цаг агаарт тохирсон',       msg: 'Одоогийн цаг агаарт тохирсон кино санал болго' },
  { label: '⭐ Хамгийн шилдэг кинонууд',    msg: 'Хамгийн өндөр IMDB оноотой кинонуудыг харуул' },
  { label: '🎮 Тоглоом санал болго',        msg: 'Надад тоглоом санал болго' },
];

// ═══════════════════════════════════════
// 🔓 ЧАТ НЭЭХ / ХААХ
// ═══════════════════════════════════════
async function toggleChat() {
  isOpen = !isOpen;
  if (isOpen) {
    aiBox.classList.add('open');
    aiInput.focus();

    if (aiMsgs.children.length === 0) {
      // Тавтай морилох мессеж — API дуудлага ХИЙХГҮЙ
      addBotMsg(WELCOME_MSG);
      addQuickChips();

      // Арын ажлыг далдуур хийнэ
      _weather = await fetchWeather();
      _context = {
        weather     : _weather,
        userPrefs   : getPrefs(),
        currentTime : getCurrentTime()
      };
    }
  } else {
    aiBox.classList.remove('open');
  }
}

aiToggle.onclick = toggleChat;
aiClose.onclick  = toggleChat;

// ═══════════════════════════════════════
// ✉️ МЕССЕЖ ИЛГЭЭХ
// ═══════════════════════════════════════
async function handleSend(text) {
  const msg = (text || aiInput.value).trim();
  if (!msg || isSending) return;

  // Chips-ийг нуух
  const chipsEl = document.getElementById('ai-chips-row');
  if (chipsEl) chipsEl.remove();

  isSending     = true;
  aiSend.disabled = true;
  aiInput.value = '';

  addUserMsg(msg);
  const typingEl = addTyping();

  // Context-ийг шинэчлэх
  _context.userPrefs   = getPrefs();
  _context.currentTime = getCurrentTime();

  await askAI(
    msg,
    (fullText) => {
      typingEl.remove();
      addBotMsg(fullText, true); // true = rating товч харуулах
      isSending       = false;
      aiSend.disabled = false;
      aiInput.focus();
    },
    (errMsg) => {
      typingEl.remove();
      addBotMsg('⚠️ ' + errMsg, false);
      isSending       = false;
      aiSend.disabled = false;
    },
    _context
  );
}

// ═══════════════════════════════════════
// 🧱 UI ЭЛЕМЕНТҮҮД
// ═══════════════════════════════════════
function addUserMsg(text) {
  const row = document.createElement('div');
  row.className = 'ai-row user';
  row.innerHTML = `<div class="ai-bbl">${escHtml(text)}</div>`;
  aiMsgs.appendChild(row);
  scrollDown();
}

// ⭐ 10. Үнэлгээний товч бүхий бот мессеж
function addBotMsg(text, showRating = false) {
  const row = document.createElement('div');
  row.className = 'ai-row bot';
  const fmt = escHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');

  let ratingHtml = '';
  if (showRating) {
    ratingHtml = `
    <div class="ai-rating">
      <button class="ai-rate-btn like"  title="Таалагдсан">👍</button>
      <button class="ai-rate-btn dislike" title="Таалагдаагүй">👎</button>
    </div>`;
  }

  row.innerHTML = `<div class="ai-bbl">${fmt}${ratingHtml}</div>`;

  // Үнэлгээний товчны event
  if (showRating) {
    const likeBtn    = row.querySelector('.like');
    const dislikeBtn = row.querySelector('.dislike');

    likeBtn.onclick = () => {
      addLiked(text.substring(0, 40)); // Хариултын эхний 40 тэмдэгтийг хадгална
      likeBtn.textContent    = '✅';
      dislikeBtn.disabled    = true;
      likeBtn.disabled       = true;
    };
    dislikeBtn.onclick = () => {
      addDisliked(text.substring(0, 40));
      dislikeBtn.textContent = '❌';
      likeBtn.disabled       = true;
      dislikeBtn.disabled    = true;
    };
  }

  aiMsgs.appendChild(row);
  scrollDown();
}

// 💬 Quick Chips товчнууд
function addQuickChips() {
  const wrap = document.createElement('div');
  wrap.id        = 'ai-chips-row';
  wrap.className = 'ai-chips';
  QUICK_CHIPS.forEach(chip => {
    const btn = document.createElement('button');
    btn.className   = 'ai-chip';
    btn.textContent = chip.label;
    btn.onclick     = () => handleSend(chip.msg);
    wrap.appendChild(btn);
  });
  aiMsgs.appendChild(wrap);
  scrollDown();
}

function addTyping() {
  const row = document.createElement('div');
  row.className = 'ai-row bot';
  row.innerHTML = `<div class="ai-bbl"><div class="ai-typing"><span></span><span></span><span></span></div></div>`;
  aiMsgs.appendChild(row);
  scrollDown();
  return row;
}

function scrollDown() {
  requestAnimationFrame(() => { aiMsgs.scrollTop = aiMsgs.scrollHeight; });
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

// ═══════════════════════════════════════
// ⌨️ KEYBOARD + SEND ТОВЧ
// ═══════════════════════════════════════
aiInput.onkeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
};
aiSend.onclick = () => handleSend();
