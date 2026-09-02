// moe.js — MoE 路由可视化（阶段 4 · c28）
// 8 个专家、每 token 由路由器打分取 top-k 加权混合。数值是手工设计的示意，
// 但"打分 → 选 top-k → 加权组合"的机制与 Switch/Mixtral 一致。
export const MoESim = (function () {
  'use strict';

  const EXPERTS = ['语法家', '词义家', '事实家', '诗人', '数学家', '程序员', '翻译官', '杂学家'];
  // 每个 token 对 8 个专家的"路由打分"（手工设计，保证讲解性）
  const ROUTES = {
    '写一句诗':  [0.2, 1.8, 0.4, 3.2, 0.1, 0.2, 0.6, 0.9],
    '1+1=?':     [0.1, 0.3, 0.6, 0.2, 3.4, 0.8, 0.2, 0.5],
    'def main():': [0.3, 0.2, 0.4, 0.1, 1.2, 3.5, 0.3, 0.6],
    '"可爱"英语?': [0.4, 1.2, 0.5, 0.6, 0.1, 0.2, 2.9, 0.8],
    '今天天气':   [0.6, 0.9, 2.8, 0.5, 0.2, 0.3, 0.4, 1.6],
  };
  const K_NOISE = 8;

  function softmaxTopK(scores, k) {
    const order = scores.map((s, i) => [s, i]).sort((a, b) => b[0] - a[0]);
    const top = order.slice(0, k);
    const m = Math.max(...top.map(t => t[0]));
    const es = top.map(([s]) => Math.exp((s - m) * 2));
    const sum = es.reduce((a, b) => a + b, 0);
    const weights = new Array(scores.length).fill(0);
    top.forEach(([s, i], idx) => { weights[i] = es[idx] / sum; });
    return weights; // 未选中的为 0
  }

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <div class="ag-title">选一个输入</div>
          <div class="moe-inputs"></div>
          <label class="tr-slider">激活专家数 top-k <output class="moe-kout">2</output>
            <input type="range" class="moe-k" min="1" max="8" value="2"></label>
          <div class="moe-stats"></div>
          <div class="ld-row dim">每个专家是一个独立的 FFN 子网络。路由器只把 token 送给打分最高的 k 个——其余专家完全闲置。</div>
        </div>
        <div class="ts-panel"><canvas class="moe-canvas" width="600" height="330"></canvas></div>
      </div>`;
    const $ = s => container.querySelector(s);
    const canvas = $('.moe-canvas');
    let input = '写一句诗';

    const inputsBox = $('.moe-inputs');
    Object.keys(ROUTES).forEach(key => {
      const b = document.createElement('button');
      b.className = 'moe-in'; b.textContent = key;
      b.onclick = () => { input = key; container.querySelectorAll('.moe-in').forEach(x => x.classList.remove('active-in')); b.classList.add('active-in'); render(); };
      inputsBox.appendChild(b);
    });
    inputsBox.querySelector('.moe-in').classList.add('active-in');

    function render() {
      const k = +$('.moe-k').value;
      $('.moe-kout').textContent = k;
      const scores = ROUTES[input];
      const w = softmaxTopK(scores, k);
      const active = w.filter(x => x > 0).length;
      $('.moe-stats').innerHTML = `
        <div class="ld-row">输入「${input}」</div>
        <div class="ld-row">激活 <b>${active}/8</b> 个专家 = 参数的 <b>${Math.round(active / 8 * 100)}%</b></div>
        <div class="ld-row dim">MoE 的交易：总参数很大（知识多），每个 token 只付一小份计算（快）——代价是必须把全部专家都装进显存。</div>`;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#10141f'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#8b96ad'; ctx.font = '13px -apple-system,"PingFang SC",sans-serif';
      ctx.fillText(`路由器给「${input}」的分与权重（top-${k} 加权）`, 20, 26);
      const cell = (canvas.width - 40) / 4, rowH = 110;
      EXPERTS.forEach((name, i) => {
        const col = i % 4, row = Math.floor(i / 4);
        const x = 20 + col * cell, y = 44 + row * rowH;
        const active = w[i] > 0;
        ctx.fillStyle = active ? `rgba(94,234,212,${0.15 + w[i] * 0.5})` : 'rgba(255,255,255,0.04)';
        ctx.fillRect(x, y, cell - 10, 84);
        ctx.strokeStyle = active ? '#5eead4' : 'rgba(255,255,255,0.1)';
        ctx.strokeRect(x, y, cell - 10, 84);
        ctx.fillStyle = active ? '#e6fff8' : '#8b96ad';
        ctx.font = 'bold 14px -apple-system,"PingFang SC",sans-serif';
        ctx.fillText(name, x + 10, y + 28);
        ctx.font = '12px ui-monospace,monospace';
        ctx.fillText(`打分 ${scores[i].toFixed(1)}`, x + 10, y + 50);
        if (active) { ctx.fillStyle = '#5eead4'; ctx.fillText(`权重 ${(w[i] * 100).toFixed(0)}%`, x + 10, y + 70); }
        else { ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fillText('休眠', x + 10, y + 70); }
      });
    }
    $('.moe-k').oninput = render;
    render();
    return {};
  }

  return { mount };
})();
