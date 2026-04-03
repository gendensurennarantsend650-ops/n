export const aiStyles = `
<style>
/* ── Үндсэн контейнер ── */
#ai-bot-wrap { position: fixed; bottom: 24px; right: 24px; z-index: 9999; font-family: 'Inter', sans-serif; }

/* ── Нээх товч ── */
#ai-toggle-btn { width: 58px; height: 58px; border-radius: 50%; background: linear-gradient(135deg, #E50914, #b20710); border: none; cursor: pointer; box-shadow: 0 8px 28px rgba(229,9,20,.55); display: flex; align-items: center; justify-content: center; transition: transform .25s; }
#ai-toggle-btn:hover { transform: scale(1.1); }

/* ── Чат хайрцаг ── */
#ai-chat-box { display: none; position: absolute; bottom: 70px; right: 0; width: 360px; height: 520px; background: rgba(15,15,20,.97); backdrop-filter: blur(20px); border-radius: 16px; border: 1px solid rgba(255,255,255,.1); box-shadow: 0 20px 50px rgba(0,0,0,.8); flex-direction: column; overflow: hidden; }
#ai-chat-box.open { display: flex; animation: slideUp .3s ease; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* ── Толгой хэсэг ── */
.ai-hdr { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: rgba(229,9,20,.12); border-bottom: 1px solid rgba(255,255,255,.07); }
.ai-hdr-title { color: #fff; font-weight: 700; font-size: 15px; display: flex; align-items: center; gap: 8px; }
.ai-hdr-title span { font-size: 18px; }
.ai-close { background: none; border: none; color: rgba(255,255,255,.45); cursor: pointer; font-size: 18px; transition: color .2s; padding: 0; }
.ai-close:hover { color: #fff; }

/* ── Мессежийн талбай ── */
#ai-msgs { flex: 1; overflow-y: auto; padding: 14px 14px 8px; display: flex; flex-direction: column; gap: 10px; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.1) transparent; }
#ai-msgs::-webkit-scrollbar { width: 4px; }
#ai-msgs::-webkit-scrollbar-thumb { background: rgba(255,255,255,.15); border-radius: 4px; }

/* ── Мессежийн мөрүүд ── */
.ai-row { display: flex; gap: 8px; max-width: 92%; }
.ai-row.user { align-self: flex-end; flex-direction: row-reverse; }
.ai-row.bot  { align-self: flex-start; }
.ai-bbl { padding: 10px 14px; border-radius: 14px; font-size: 13.5px; line-height: 1.55; word-break: break-word; }
.ai-row.user .ai-bbl { background: linear-gradient(135deg, #E50914, #c0070f); color: #fff; border-bottom-right-radius: 4px; }
.ai-row.bot  .ai-bbl { background: rgba(255,255,255,.09); color: #e8e8e8; border-bottom-left-radius: 4px; border: 1px solid rgba(255,255,255,.06); }

/* ── ⭐ Үнэлгээний товчнууд ── */
.ai-rating { display: flex; gap: 6px; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,.08); }
.ai-rate-btn { background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12); border-radius: 20px; padding: 3px 10px; font-size: 13px; cursor: pointer; color: #ccc; transition: all .2s; }
.ai-rate-btn:hover:not(:disabled) { background: rgba(255,255,255,.15); transform: scale(1.08); }
.ai-rate-btn:disabled { opacity: .5; cursor: default; }
.ai-rate-btn.like:hover:not(:disabled) { border-color: #4caf50; color: #4caf50; }
.ai-rate-btn.dislike:hover:not(:disabled) { border-color: #ef5350; color: #ef5350; }

/* ── 💬 Quick Chips ── */
.ai-chips { display: flex; flex-wrap: wrap; gap: 7px; padding: 4px 0 6px; align-self: flex-start; max-width: 100%; }
.ai-chip { background: rgba(229,9,20,.15); border: 1px solid rgba(229,9,20,.35); border-radius: 20px; padding: 6px 12px; font-size: 12.5px; color: #ffb3b3; cursor: pointer; transition: all .2s; white-space: nowrap; }
.ai-chip:hover { background: rgba(229,9,20,.3); color: #fff; transform: translateY(-1px); }

/* ── Оруулах мөр ── */
.ai-inp-row { display: flex; padding: 10px 12px; background: rgba(0,0,0,.45); border-top: 1px solid rgba(255,255,255,.06); gap: 8px; }
#ai-input { flex: 1; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 20px; padding: 9px 16px; color: #fff; outline: none; font-size: 13.5px; transition: border-color .2s; }
#ai-input::placeholder { color: rgba(255,255,255,.35); }
#ai-input:focus { border-color: rgba(229,9,20,.6); }
#ai-send-btn { background: linear-gradient(135deg, #E50914, #b20710); border: none; width: 40px; height: 40px; border-radius: 50%; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform .2s, opacity .2s; flex-shrink: 0; }
#ai-send-btn:hover { transform: scale(1.08); }
#ai-send-btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }

/* ── Typing animation ── */
.ai-typing { display: flex; gap: 4px; padding: 4px 2px; }
.ai-typing span { width: 6px; height: 6px; background: #aaa; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
.ai-typing span:nth-child(1) { animation-delay: -.32s; }
.ai-typing span:nth-child(2) { animation-delay: -.16s; }
@keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
</style>
`;

export const aiHTML = `
<div id="ai-bot-wrap">
  <div id="ai-chat-box">
    <div class="ai-hdr">
      <div class="ai-hdr-title"><span>✨</span> Nabooshy AI</div>
      <button class="ai-close" id="ai-close-btn">✕</button>
    </div>
    <div id="ai-msgs"></div>
    <div class="ai-inp-row">
      <input id="ai-input" type="text" placeholder="Кино хайх, асуух зүйлээ бичнэ үү..." autocomplete="off">
      <button id="ai-send-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
  </div>
  <button id="ai-toggle-btn">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  </button>
</div>
`;
