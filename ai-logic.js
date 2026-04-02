// ai-logic.js — AI API дуудалт ба яриаг удирдах
import { AI_CONFIG }        from './ai-config.js';
import { buildSystemPrompt } from './ai-prompt.js';

let _history         = [];
let _systemInjected  = false;

export async function askAI(userText, onDone, onError, context = {}) {
  if (!_systemInjected) {
    const sys = buildSystemPrompt(context);
    _history.push({ role: 'user',  parts: [{ text: sys }] });
    _history.push({ role: 'model', parts: [{ text: 'Ойлголоо! Nabooshy AI бэлэн. Зөвхөн монголоор хариулна.' }] });
    _systemInjected = true;
  }

  _history.push({ role: 'user', parts: [{ text: userText }] });

  const body = {
    contents: _history,
    generationConfig: {
      maxOutputTokens: AI_CONFIG.maxOutputTokens || 900,
      temperature: 0.75
    }
  };

  try {
    const res  = await fetch('/api/ai', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body)
    });
    const data = await res.json();

    if (!res.ok) {
      const msg = data.details?.error?.message || data.error || 'Серверийн алдаа';
      throw new Error(msg);
    }

    if (data.candidates?.[0]?.content) {
      const fullText = data.candidates[0].content.parts[0].text;
      _history.push({ role: 'model', parts: [{ text: fullText }] });
      onDone?.(fullText);
    } else {
      throw new Error('AI хариу өгсөнгүй');
    }

  } catch (e) {
    console.error('AI Error:', e);
    _history.pop();
    onError?.(`⚠️ ${e.message}`);
  }
}

export function resetAI() {
  _history        = [];
  _systemInjected = false;
}
