// lncalc.js — LayerNorm 计算器（c16）
// 8 个滑杆 = 一个 token 的 8 维特征向量；逐步演算 μ → σ² → 归一化 → 缩放平移。
export const LNCalc = (function () {
  'use strict';

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <div class="ag-title">token 的 8 维特征向量（拖动改变）</div>
          <div class="ln-sliders"></div>
          <div class="ln-params">
            <label class="tr-slider">γ（缩放，可学习）<output class="ln-g">1.0</output>
              <input type="range" class="ln-gin" min="5" max="30" value="10"></label>
            <label class="tr-slider">β（平移，可学习）<output class="ln-b">0.0</output>
              <input type="range" class="ln-bin" min="-20" max="20" value="0"></label>
          </div>
          <div class="ld-row dim">BatchNorm 按"batch 维"统计（同一特征跨样本），LayerNorm 按"单样本的特征维"统计——NLP 里序列长短不一、句子间无关联，LN 是自然选择。</div>
        </div>
        <div class="ts-panel"><canvas class="ln-canvas" width="600" height="330"></canvas></div>
      </div>`;
    const $ = s => container.querySelector(s);
    const canvas = $('.ln-canvas');
    let vec = [0.8, -1.2, 2.0, 0.3, -0.5, 1.6, -0.9, 0.4];

    const box = $('.ln-sliders');
    vec.forEach((v, i) => {
      const l = document.createElement('label');
      l.className = 'tr-slider';
      l.innerHTML = `x${i + 1} <output>${v.toFixed(1)}</output>`;
      const s = document.createElement('input');
      s.type = 'range'; s.min = -30; s.max = 30; s.value = v * 10;
      s.oninput = () => { vec[i] = +s.value / 10; l.querySelector('output').textContent = vec[i].toFixed(1); render(); };
      l.appendChild(s); box.appendChild(l);
    });
    $('.ln-gin').oninput = e => { $('.ln-g').textContent = (e.target.value / 10).toFixed(1); render(); };
    $('.ln-bin').oninput = e => { $('.ln-b').textContent = (e.target.value / 10).toFixed(1); render(); };

    function render() {
      const g = +$('.ln-gin').value / 10, b = +$('.ln-bin').value / 10;
      const n = vec.length;
      const mu = vec.reduce((a, x) => a + x, 0) / n;
      const varr = vec.reduce((a, x) => a + (x - mu) ** 2, 0) / n;
      const sd = Math.sqrt(varr + 1e-5);
      const norm = vec.map(x => (x - mu) / sd);
      const out = norm.map(x => x * g + b);

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#10141f'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      // 逐维柱状：原值（蓝）与归一化后（青）
      const bw = (canvas.width - 80) / n;
      ctx.fillStyle = '#8b96ad'; ctx.font = '12.5px -apple-system,"PingFang SC",sans-serif';
      ctx.fillText('每维一根柱：蓝 = 原始值，青 = LayerNorm 后（×γ + β）', 30, 24);
      const maxAbs = Math.max(2.5, ...vec.map(Math.abs));
      norm.forEach((nv, i) => {
        const x = 40 + i * bw;
        const h1 = (vec[i] / maxAbs) * 110, h2 = (out[i] / 3) * 110;
        ctx.fillStyle = 'rgba(96,165,250,0.75)';
        ctx.fillRect(x + bw * 0.15, 170 - h1, bw * 0.3, h1);
        ctx.fillStyle = 'rgba(94,234,212,0.8)';
        ctx.fillRect(x + bw * 0.5, 170 - h2, bw * 0.3, h2);
        ctx.fillStyle = '#8b96ad'; ctx.font = '11px ui-monospace,monospace'; ctx.textAlign = 'center';
        ctx.fillText(`x${i + 1}`, x + bw / 2, 186);
        ctx.textAlign = 'left';
      });
      ctx.fillStyle = '#dbe4f3'; ctx.font = '12.5px ui-monospace,monospace';
      const stats = `μ = ${mu.toFixed(2)}　σ² = ${varr.toFixed(2)}　归一化后：μ ≈ 0，σ² ≈ 1`;
      ctx.fillText(stats, 30, 210);
      ctx.fillStyle = '#5eead4';
      ctx.fillText(`LN(x) = γ ⊙ (x-μ)/√(σ²+ε) + β　→　γ=${g.toFixed(1)}, β=${b.toFixed(1)}`, 30, 236);
      ctx.fillStyle = '#8b96ad';
      ctx.fillText('注意：无论滑杆怎么拉，青色柱的"整体幅度"总被拉回同一尺度 —— 这就是"稳定器"的含义。', 30, 262);
      ctx.fillText('残差 x + f(x) 负责让梯度有高速公路；LN 负责让这条路不塌方。两者配合，网络才敢往深叠。', 30, 284);
    }
    render();
    return {};
  }

  return { mount };
})();
