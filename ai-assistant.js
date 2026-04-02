// ai-assistant.js — Гол controller: нээх/хаах, мессеж илгээх
import { aiStyles, aiHTML } from './ai-ui.js';
import { askAI } from './ai-logic.js';
import { getPrefs } from './ai-prefs.js';
import { addUserMsg, addBotMsg, addTyping, addQuickChips } from './ai-messages.js';

document.body.insertAdjacentHTML('beforeend', aiStyles + aiHTML);

const aiInput  = document.getElementById('ai-input');
const aiSend   = document.getElementById('ai-send-btn');
const aiMsgs   = document.getElementById('ai-msgs');
const aiBox    = document.getElementById('ai-chat-box');
const aiToggle = document.getElementById('ai-toggle-btn');
const aiClose  = document.getElementById('ai-close-btn');

let isOpen    = false;
let isSending = false;
let _weather  = null;
let _context  = {};

// ── Цаг агаар татах ──────────────────────────────────────────
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

// ── Одоогийн цаг ─────────────────────────────────────────────
function getCurrentTime() {
  const h = new Date().getHours();
  if (h >= 6  && h < 11) return `${h}:00 (өглөө)`;
  if (h >= 11 && h < 17) return `${h}:00 (өдөр)`;
  if (h >= 17 && h < 21) return `${h}:00 (орой)`;
  if (h >= 21)            return `${h}:00 (шөнө)`;
  return `${h}:00 (гүн шөнө)`;
}

const WELCOME_MSG = `Nabooshy сайтад тавтай морилно уу! 🎬✨\n\nТа манай сайт дотор дуртай кино, цуврал, тоглоомоо **үнэгүй** үзнэ үү.\n\n⚠️ Манайх ямар нэгэн хэлбэрээр мөнгө авдаггүй. Хэрвээ танаас мөнгө нэхэж байвал **луйвар** болно — өөрийгөө хамгаалаарай!\n\nДоорх товчнуудаас сонгох эсвэл шууд бичнэ үү 👇`;

// ── Чат нээх / хаах ──────────────────────────────────────────
async function toggleChat() {
  isOpen = !isOpen;
  if (isOpen) {
    aiBox.classList.add('open');
    aiInput.focus();
    if (aiMsgs.children.length === 0) {
      addBotMsg(aiMsgs, WELCOME_MSG);
      addQuickChips(aiMsgs, handleSend);
      _weather = await fetchWeather();
      _context = { weather: _weather, userPrefs: getPrefs(), currentTime: getCurrentTime() };
    }
  } else {
    aiBox.classList.remove('open');
  }
}

aiToggle.onclick = toggleChat;
aiClose.onclick  = toggleChat;

// ── Мессеж илгээх ────────────────────────────────────────────
async function handleSend(text) {
  const msg = (text || aiInput.value).trim();
  if (!msg || isSending) return;

  const chipsEl = document.getElementById('ai-chips-row');
  if (chipsEl) chipsEl.remove();

  isSending = true;
  aiSend.disabled = true;
  aiInput.value = '';

  addUserMsg(aiMsgs, msg);
  const typingEl = addTyping(aiMsgs);

  _context.userPrefs   = getPrefs();
  _context.currentTime = getCurrentTime();

  await askAI(
    msg,
    (fullText) => {
      typingEl.remove();
      addBotMsg(aiMsgs, fullText, true);
      isSending       = false;
      aiSend.disabled = false;
      aiInput.focus();
    },
    (errMsg) => {
      typingEl.remove();
      addBotMsg(aiMsgs, '⚠️ ' + errMsg, false);
      isSending       = false;
      aiSend.disabled = false;
    },
    _context
  );
}

// ── Keyboard + send товч ─────────────────────────────────────
aiInput.onkeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
};
aiSend.onclick = () => handleSend();
