// attention.js — 注意力交互台（阶段 1 核心模拟器）
// 玩具句子 5 个 token、4 维嵌入、真实的 QK^T / softmax / 因果掩码 / 多头。
// 重点看机制，不追求语言学效果（嵌入与投影是种子随机数）。
export const AttentionSim = (function () {
  'use strict';

  const TOKENS = ['小猫', '坐', '在', '垫子', '上'];
  const D = 4, T = TOKENS.length;
  // 4 维玩具嵌入（语义只求"有点道理"，不求真实词向量）
  const E = [
    [1.0, 0.8, 0.2, 0.0],   // 小猫（名词·动物）
    [0.2, 0.1, 1.0, 0.5],   // 坐（动词）
    [0.0, 0.1, 0.6, 1.0],   // 在（介词）
    [0.9, 0.9, 0.2, 0.1],   // 垫子（名词·物品）
    [0.1, 0.2, 0.5, 0.9],   // 上（方位）
  ];

  // 种子随机（固定可复现）
  function rng(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
  function makeW(seed) {
    const r = rng(seed);
    return Array.from({ length: D }, () => Array.from({ length: D }, () => (r() * 2 - 1) * 0.9));
  }
  const HEADS = [
    { name: '头 A（seed 7）', wq: makeW(7), wk: makeW(8) },
    { name: '头 B（seed 99）', wq: makeW(99), wk: makeW(100) },
  ];

  function matvec(W, v) {
    return W.map(row => row.reduce((s, w, i) => s + w * v[i], 0));
  }
  function softmax(xs) {
    const m = Math.max(...xs);
    const es = xs.map(x => Math.exp(x - m));
    const s = es.reduce((a, b) => a + b, 0);
    return es.map(e => e / s);
  }

  // 计算 head 的全部注意力权重（含缩放/掩码选项）
  function compute(head, scale, causal) {
    const Q = E.map(v => matvec(head.wq, v));
    const K = E.map(v => matvec(head.wk, v));
    const w = [];
    for (let i = 0; i < T; i++) {
      const scores = [];
      for (let j = 0; j < T; j++) {
        let s = Q[i].reduce((acc, q, k) => acc + q * K[j][k], 0);
        if (scale) s /= Math.sqrt(D);
        scores.push(causal && j > i ? -Infinity : s);
      }
      w.push(softmax(scores));
    }
    return w;
  }

  function drawHeat(ctx, x0, y0, size, w, causal, focusRow) {
    const cell = size / (T + 1);
    ctx.font = '12px ui-monospace,monospace';
    // 列标签（key）
    TOKENS.forEach((t, j) => label(ctx, t, x0 + (j + 0.5) * cell, y0 - 6, '#8b96ad', cell / 4));
    for (let i = 0; i < T; i++) {
      // 行标签（query）
      label(ctx, TOKENS[i], x0 - 4, y0 + (i + 0.7) * cell, i === focusRow ? '#5eead4' : '#8b96ad', cell / 4.5, 'right');
      for (let j = 0; j < T; j++) {
        const masked = causal && j > i;
        const p = w[i][j];
        if (masked) {
          ctx.fillStyle = 'rgba(255,255,255,0.03)';
        } else {
          ctx.fillStyle = `rgba(94,234,212,${0.06 + p * 1.5})`;
        }
        ctx.fillRect(x0 + j * cell, y0 + i * cell, cell - 2, cell - 2);
        if (cell >= 42) {
          ctx.fillStyle = masked ? 'rgba(255,255,255,0.16)' : (p > 0.45 ? '#05281e' : '#dbe4f3');
          ctx.font = `bold ${Math.min(13, cell / 3.2)}px ui-monospace,monospace`;
          ctx.fillText(masked ? '×' : Math.round(p * 100) + '%', x0 + j * cell + cell / 2 - 10, y0 + i * cell + cell / 2 + 4);
        }
      }
    }
    // 焦点行框
    ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 1.5;
    ctx.strokeRect(x0 - 1, y0 + focusRow * cell - 1, T * cell, cell);
  }
  function label(ctx, t, x, y, color, maxlen, align) {
    ctx.fillStyle = color;
    ctx.font = '12px -apple-system,"PingFang SC",sans-serif';
    ctx.textAlign = align || 'center';
    const s = t.length > 4 ? t.slice(0, 4) : t;
    ctx.fillText(s, x, y + 4);
    ctx.textAlign = 'left';
  }

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <div class="ag-btns">
            <button class="at-head0 active-head">头 A</button>
            <button class="at-head1">头 B</button>
          </div>
          <label class="tr-bug"><input type="checkbox" class="at-scale" checked> 除以 √d（缩放打分）</label>
          <label class="tr-bug"><input type="checkbox" class="at-causal" checked> 因果掩码（看不见未来）</label>
          <div class="at-info"></div>
          <div class="ag-msg ok">点击热力图任意一行，聚焦该 token 的查询。颜色越亮 = 注意力权重越大；灰色的 × = 被因果掩码挡住。</div>
        </div>
        <div class="ts-panel"><canvas class="at-canvas" width="560" height="330"></canvas></div>
      </div>`;

    const $ = s => container.querySelector(s);
    const canvas = $('.at-canvas'), info = $('.at-info');
    let head = 0, focus = 0;

    function render() {
      const headDef = HEADS[head];
      const scale = $('.at-scale').checked, causal = $('.at-causal').checked;
      const w = compute(headDef, scale, causal);
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#10141f'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      const size = Math.min(canvas.width - 150, canvas.height - 70);
      const cell = size / T;
      drawHeat(ctx, 150, 46, size, w, causal, focus);

      // 焦点行的权重文字
      const row = w[focus];
      const parts = TOKENS.map((t, j) => causal && j > focus ? null : `${t} ${Math.round(row[j] * 100)}%`).filter(Boolean);
      info.innerHTML = `
        <div class="ld-name">查询：${TOKENS[focus]}（第 ${focus + 1} 个 token）</div>
        <div class="ld-row">${headDef.name} · ${scale ? '已除以 √' + D : '未缩放（打分容易过大）'} · ${causal ? '因果掩码开' : '双向（类似 BERT 的注意力）'}</div>
        <div class="ld-row dim">权重分布：${parts.join('，')}</div>
        <div class="ld-row dim">输出 = 按权重混合 V 向量：out(${TOKENS[focus]}) = Σ weight_j · V_j</div>`;
      // 双头按钮态
      $('.at-head0').classList.toggle('active-head', head === 0);
      $('.at-head1').classList.toggle('active-head', head === 1);
    }

    $('.at-head0').onclick = () => { head = 0; render(); };
    $('.at-head1').onclick = () => { head = 1; render(); };
    $('.at-scale').onchange = render;
    $('.at-causal').onchange = render;
    canvas.onclick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scale = $('.at-scale').checked, causal = $('.at-causal').checked;
      const size = Math.min(canvas.width - 150, canvas.height - 70), cell = size / T;
      const y = (e.clientX - rect.left) * 0; // 横向不用于选行
      const ry = (e.clientY - rect.top) * (canvas.height / rect.height) - 46;
      if (ry >= 0) { focus = Math.max(0, Math.min(T - 1, Math.floor(ry / cell))); render(); }
    };
    render();
    return {};
  }

  return { mount };
})();
