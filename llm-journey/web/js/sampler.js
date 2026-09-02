// sampler.js — 生成与采样模拟器（阶段 1 · c18）
// 加载时在浏览器里用 400 字中文语料现训一个"字符 bigram 模型"（数频次即可），
// 真实的 next-char 分布 + 温度缩放 + top-k 截断 + 按分布采样。
export const SamplerSim = (function () {
  'use strict';

  const CORPUS = [
    '春天花会开，秋天叶会落。',
    '小鸟在枝头唱歌，风吹过湖面。',
    '山上有树，树下有草，草上有露水。',
    '太阳升起，月亮落下，星星在夜里闪烁。',
    '小猫追蝴蝶，小狗追小猫，蝴蝶飞进花丛。',
    '雨落在屋顶上，也落在树叶上。',
    '冬天来了，雪把山染成白色。',
    '花开花落，云卷云舒，河水不停地流。',
  ].join('');

  // ---------- 字符 bigram 模型：counts[c1][c2] ----------
  const chars = [...new Set(CORPUS)];
  const idx = new Map(chars.map((c, i) => [c, i]));
  const V = chars.length;
  const counts = Array.from({ length: V }, () => new Array(V).fill(0));
  for (let i = 0; i < CORPUS.length - 1; i++) {
    counts[idx.get(CORPUS[i])][idx.get(CORPUS[i + 1])]++;
  }
  // 句首分布（从 '。'/开头的转移 + 语料首字）
  const startCounts = new Array(V).fill(0);
  startCounts[idx.get(CORPUS[0])]++;
  for (let i = 0; i < CORPUS.length - 1; i++) {
    if (CORPUS[i] === '。' || CORPUS[i] === '，') startCounts[idx.get(CORPUS[i + 1])]++;
  }

  function dist(contextChar, temperature, topK, topP) {
    let ci = contextChar && idx.has(contextChar) ? idx.get(contextChar) : idx.get(CORPUS[0]);
    const logits = counts[ci].map(c => Math.log(Math.max(c, 1e-9)));
    const scaled = logits.map(l => l / temperature);
    // top-k：只保留分数最大的 k 个，其余 -inf
    const order = scaled.map((l, i) => [l, i]).sort((a, b) => b[0] - a[0]);
    const keep = new Set(order.slice(0, Math.max(1, Math.min(topK, V))).map(p => p[1]));
    const masked = scaled.map((l, i) => keep.has(i) ? l : -Infinity);
    // top-p（核采样）：概率降序累加，加满 p 封口，之后的再丢弃（与 top-k 取交集）
    const m0 = Math.max(...masked.filter(x => x > -Infinity));
    const es0 = masked.map(l => l === -Infinity ? 0 : Math.exp(l - m0));
    const sum0 = es0.reduce((a, b) => a + b, 0);
    const probs = es0.map(e => e / sum0);
    const desc = probs.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]);
    let cum = 0;
    const nucleus = new Set();
    for (const [v, i] of desc) { nucleus.add(i); cum += v; if (cum >= topP) break; }
    const finalMasked = masked.map((l, i) => nucleus.has(i) ? l : -Infinity);
    const m = Math.max(...finalMasked.filter(x => x > -Infinity));
    const es = finalMasked.map(l => l === -Infinity ? 0 : Math.exp(l - m));
    const s = es.reduce((a, b) => a + b, 0);
    return es.map(e => e / s);
  }

  function sample(p) {
    let r = Math.random(), acc = 0;
    for (let i = 0; i < p.length; i++) { acc += p[i]; if (r < acc) return i; }
    return p.length - 1;
  }

  function mount(container) {
    container.innerHTML = `
      <div class="sp-wrap">
        <div class="ts-side">
          <label class="tr-slider">温度 T <output class="sp-tout">1.0</output>
            <input type="range" class="sp-temp" min="1" max="30" value="10"></label>
          <label class="tr-slider">top-k <output class="sp-kout">10</output>
            <input type="range" class="sp-k" min="1" max="${V}" value="10"></label>
          <label class="tr-slider">top-p <output class="sp-pout">1.00</output>
            <input type="range" class="sp-p" min="5" max="100" value="100"></label>
          <div class="ag-btns">
            <button class="sp-one">🎲 采样下一字</button>
            <button class="sp-gen primary">生成 120 字</button>
            <button class="sp-clear">清空</button>
          </div>
          <div class="sp-out"></div>
        </div>
        <div class="ts-panel"><canvas class="sp-canvas" width="600" height="330"></canvas></div>
      </div>`;
    const $ = s => container.querySelector(s);
    const canvas = $('.sp-canvas'), out = $('.sp-out');
    let ctxChar = CORPUS[0];
    let lastP = null;

    function params() {
      const t = $('.sp-temp').value / 10;
      const k = +$('.sp-k').value;
      const p = +$('.sp-p').value / 100;
      $('.sp-tout').textContent = t.toFixed(1);
      $('.sp-kout').textContent = k;
      $('.sp-pout').textContent = p.toFixed(2);
      return { t, k, p };
    }

    function renderBars() {
      const { t, k, p } = params();
      const p2 = dist(ctxChar, t, k, p);
      lastP = p2;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#10141f'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#8b96ad'; ctx.font = '13px -apple-system,"PingFang SC",sans-serif';
      ctx.fillText(`给定上文「${ctxChar}」→ 下一个字符的分布（T=${t.toFixed(1)}, top-k=${k}, top-p=${p.toFixed(2)}）`, 14, 24);
      // 取概率最大的前 14 个画柱状图
      const order = p2.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]).slice(0, 14);
      const bw = (canvas.width - 60) / order.length;
      order.forEach(([pr, i], rank) => {
        const h = pr * 240;
        const x = 30 + rank * bw, y = canvas.height - 46 - h;
        ctx.fillStyle = pr > 0 ? 'rgba(94,234,212,0.75)' : 'rgba(255,255,255,0.06)';
        ctx.fillRect(x, y, bw - 8, h);
        ctx.fillStyle = '#dbe4f3'; ctx.font = '14px -apple-system,"PingFang SC",sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(chars[i], x + (bw - 8) / 2, canvas.height - 26);
        if (pr > 0.005) { ctx.fillStyle = '#8b96ad'; ctx.font = '10px ui-monospace,monospace'; ctx.fillText((pr * 100).toFixed(0) + '%', x + (bw - 8) / 2, y - 5); }
        ctx.textAlign = 'left';
      });
    }

    function append(ch) {
      out.textContent = (out.textContent + ch).slice(-400);
      ctxChar = ch;
    }

    $('.sp-temp').oninput = renderBars;
    $('.sp-k').oninput = renderBars;
    $('.sp-p').oninput = renderBars;
    $('.sp-one').onclick = () => { const { t, k, p } = params(); append(chars[sample(dist(ctxChar, t, k, p))]); renderBars(); };
    $('.sp-gen').onclick = () => {
      const { t, k, p } = params();
      let acc = '';
      for (let i = 0; i < 120; i++) { const ch = chars[sample(dist(ctxChar, t, k, p))]; acc += ch; ctxChar = ch; }
      append(acc);
      renderBars();
    };
    $('.sp-clear').onclick = () => { out.textContent = ''; ctxChar = CORPUS[0]; renderBars(); };
    renderBars();
    return {};
  }

  return { mount };
})();
