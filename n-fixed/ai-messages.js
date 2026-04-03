// ai-messages.js — AI чатын UI элементүүд (мессеж, typing, chips)
import { addLiked, addDisliked } from './ai-prefs.js';

const QUICK_CHIPS = [
  { label: '🎭 Сэтгэлтэйгээр хайх',     msg: 'Өнөөдрийн сэтгэл байдалд тохирсон кино санал болго' },
  { label: '🌤️ Цаг агаарт тохирсон',     msg: 'Одоогийн цаг агаарт тохирсон кино санал болго' },
  { label: '⭐ Хамгийн шилдэг кинонууд', msg: 'Хамгийн өндөр IMDB оноотой кинонуудыг харуул' },
  { label: '🎮 Тоглоом санал болго',      msg: 'Надад тоглоом санал болго' },
];

export function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

export function scrollDown(aiMsgs) {
  requestAnimationFrame(() => { aiMsgs.scrollTop = aiMsgs.scrollHeight; });
}

export function addUserMsg(aiMsgs, text) {
  const row = document.createElement('div');
  row.className = 'ai-row user';
  row.innerHTML = `<div class="ai-bbl">${escHtml(text)}</div>`;
  aiMsgs.appendChild(row);
  scrollDown(aiMsgs);
}

export function addBotMsg(aiMsgs, text, showRating = false) {
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

  if (showRating) {
    const likeBtn    = row.querySelector('.like');
    const dislikeBtn = row.querySelector('.dislike');
    likeBtn.onclick = () => {
      addLiked(text.substring(0, 40));
      likeBtn.textContent = '✅';
      dislikeBtn.disabled = true;
      likeBtn.disabled    = true;
    };
    dislikeBtn.onclick = () => {
      addDisliked(text.substring(0, 40));
      dislikeBtn.textContent = '❌';
      likeBtn.disabled       = true;
      dislikeBtn.disabled    = true;
    };
  }

  aiMsgs.appendChild(row);
  scrollDown(aiMsgs);
}

export function addTyping(aiMsgs) {
  const row = document.createElement('div');
  row.className = 'ai-row bot';
  row.innerHTML = `<div class="ai-bbl"><div class="ai-typing"><span></span><span></span><span></span></div></div>`;
  aiMsgs.appendChild(row);
  scrollDown(aiMsgs);
  return row;
}

export function addQuickChips(aiMsgs, onChipClick) {
  const wrap = document.createElement('div');
  wrap.id        = 'ai-chips-row';
  wrap.className = 'ai-chips';
  QUICK_CHIPS.forEach(chip => {
    const btn = document.createElement('button');
    btn.className   = 'ai-chip';
    btn.textContent = chip.label;
    btn.onclick     = () => onChipClick(chip.msg);
    wrap.appendChild(btn);
  });
  aiMsgs.appendChild(wrap);
  scrollDown(aiMsgs);
}
