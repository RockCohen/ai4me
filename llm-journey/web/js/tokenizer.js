// tokenizer.js — 分词可视化（阶段 1 · c13）
// 同一段文本：字符级 vs 词级（空格切分）的 token 数量对照 + token id 序列。
// 顺带解释为什么 GPT 用 BPE（字符太碎、词表爆炸），BPE 实现见 minbpe 选做。
export const TokenizerSim = (function () {
  'use strict';

  const DEFAULT_TEXT = '我爱大模型。The cat sat on the mat. 深度学习改变了世界！';

  function charTokenize(s) { return [...s]; }
  function wordTokenize(s) { return s.split(/\s+/).filter(Boolean); }
  function ids(tokens) {
    // 演示用：按"首次出现顺序"编 id（真实分词器有全局词表）
    const vocab = new Map();
    return tokens.map(t => { if (!vocab.has(t)) vocab.set(t, vocab.size); return vocab.get(t); });
  }

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <label class="ag-row">输入文本<textarea class="tk-text" rows="3">${DEFAULT_TEXT}</textarea></label>
          <div class="ag-btns">
            <button class="tk-char primary">字符级切分</button>
            <button class="tk-word">词级切分（按空格）</button>
          </div>
          <div class="tk-stats"></div>
        </div>
        <div class="ts-panel tk-panel"><div class="tk-tokens"></div></div>
      </div>`;
    const $ = s => container.querySelector(s);
    const tokensEl = $('.tk-tokens'), stats = $('.tk-stats');

    function render(tokens, mode) {
      const is = ids(tokens);
      tokensEl.innerHTML = '';
      tokens.forEach((t, i) => {
        const s = document.createElement('span');
        s.className = 'tk-token';
        s.innerHTML = `${escapeHtml(t)}<i>${is[i]}</i>`;
        tokensEl.appendChild(s);
      });
      const src = $('.tk-text').value;
      const zh = (src.match(/[\u4e00-\u9fff]/g) || []).length;
      stats.innerHTML = `
        <div class="ld-row"><b>${tokens.length}</b> 个 token ｜ 词表大小（演示）<b>${new Set(tokens).size}</b></div>
        <div class="ld-row dim">${mode === 'char'
          ? '字符级：中文 ≈ 每字一个 token，英文被拆成单字母——序列很长，但没有"没见过的词"。'
          : '词级：英文靠空格切得不错，但中文粘连、"cat"和"cats"是两个 token，遇到生词（词表外）直接抓瞎。'}</div>
        <div class="ld-row dim">GPT 的 BPE = 两者的折中：高频片段合并成 token，生词自动退回字符。<code>minbpe</code>（S16 选做）就是亲手实现它。</div>`;
    }
    function escapeHtml(s) { return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

    $('.tk-char').onclick = () => render(charTokenize($('.tk-text').value), 'char');
    $('.tk-word').onclick = () => render(wordTokenize($('.tk-text').value), 'word');
    render(charTokenize(DEFAULT_TEXT), 'char');
    return {};
  }

  return { mount };
})();
