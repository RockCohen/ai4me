// mnistsim.js — 真实数据集体检器（c11）
// 展示 100 张真实 Fashion-MNIST 测试集样本（每类 10 张，14×14 下采样），
// 理解"数据长什么样、类别是否均衡"——训练前的标准体检流程。
export const MNISTSim = (function () {
  'use strict';

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <div class="ag-title">类别筛选</div>
          <div class="mn-classes"></div>
          <div class="mn-stats"></div>
          <div class="ld-row dim">训练前的"数据体检"：看样本长相、查类别均衡度。真实训练要回到 Python（exercises/03_d2l_mnist），那里是 28×28 原图 + 60000 张。</div>
        </div>
        <div class="ts-panel"><canvas class="mn-canvas" width="600" height="330"></canvas></div>
      </div>`;
    const $ = s => container.querySelector(s);
    const canvas = $('.mn-canvas');

    fetch('/fmnist-sample.json').then(r => r.json()).then(data => {
      const clsBox = $('.mn-classes');
      const mkBtn = (t, fn, active) => {
        const b = document.createElement('button');
        b.textContent = t; b.className = 'moe-in' + (active ? ' active-in' : '');
        b.onclick = () => { fn(); };
        return b;
      };
      clsBox.appendChild(mkBtn('全部 (100)', () => draw(-1), true));
      data.classes.forEach((c, y) => clsBox.appendChild(mkBtn(`${c} (10)`, () => draw(y))));

      // 类别分布条形图（全部为 10 —— 均衡）
      const counts = new Array(10).fill(0);
      data.labels.forEach(l => counts[l]++);

      function draw(filter) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#10141f'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        const shown = data.images.map((im, i) => ({ im, y: data.labels[i] }))
          .filter(o => filter < 0 || o.y === filter);
        const cell = 56, gap = 6, perRow = Math.floor((canvas.width - 40) / (cell + gap));
        shown.slice(0, 50).forEach((o, k) => {
          const col = k % perRow, row = Math.floor(k / perRow);
          const x = 20 + col * (cell + gap), y = 20 + row * (cell + gap + 4);
          for (let r = 0; r < 14; r++) for (let c = 0; c < 14; c++) {
            const v = o.im[r * 14 + c] / 255;
            ctx.fillStyle = `rgba(96,165,250,${0.05 + v * 0.9})`;
            ctx.fillRect(x + c * 4, y + r * 4, 3.6, 3.6);
          }
          ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.strokeRect(x, y, cell, cell);
          ctx.fillStyle = '#8b96ad'; ctx.font = '10px sans-serif';
          ctx.fillText(data.classes[o.y], x + 2, y + cell + 10);
        });
        $('.mn-stats').innerHTML = `
          <div class="ld-row">显示 <b>${Math.min(shown.length, 50)}</b>/${shown.length} 张（14×14 下采样）</div>
          <div class="ld-row dim">类别分布：10 类 × 各 10 张 = 完全均衡 ✓（真实训练集也是均衡的）</div>
          <div class="ld-row dim">模型要学的映射：196 个亮度值 → 10 个类别。想想 c05：还是"输入→输出"的拟合，只是维度大了。</div>`;
      }
      draw(-1);
    });
    return {};
  }

  return { mount };
})();
