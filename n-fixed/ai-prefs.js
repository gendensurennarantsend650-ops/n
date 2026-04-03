// ai-prefs.js — Хэрэглэгчийн сонголт (localStorage)
export function getPrefs() {
  try {
    return JSON.parse(localStorage.getItem('nb_prefs') || '{"liked":[],"disliked":[]}');
  } catch { return { liked: [], disliked: [] }; }
}

export function savePrefs(prefs) {
  try { localStorage.setItem('nb_prefs', JSON.stringify(prefs)); } catch {}
}

export function addLiked(title) {
  const p = getPrefs();
  if (!p.liked.includes(title)) { p.liked.push(title); savePrefs(p); }
}

export function addDisliked(title) {
  const p = getPrefs();
  if (!p.disliked.includes(title)) { p.disliked.push(title); savePrefs(p); }
  p.liked = p.liked.filter(t => t !== title);
  savePrefs(p);
}
