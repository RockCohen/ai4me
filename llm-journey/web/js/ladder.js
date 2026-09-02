// ladder.js — 张量阶梯（c00 预备课专用）
// 从 0 维"一个数"逐级展开到 4 维"一批 RGB 图"：
// 每级显示形状 / 现实对应物 / Python 代码 / 索引预览。
export const TensorLadder = (function () {
  'use strict';

  const BASE = [
    [0.1, 0.2, 0.3, 0.2],
    [0.2, 0.9, 0.8, 0.3],
    [0.1, 0.8, 0.6, 0.2],
    [0.0, 0.2, 0.3, 0.1],
  ];
  const ROW = BASE[1]; // 1 维示例：取第 2 行

  const TINTS = {
    gray: v => `rgba(96,165,250,${0.12 + v * 0.7})`,
    r: v => `rgba(248,113,113,${0.12 + v * 0.7})`,
    g: v => `rgba(74,222,128,${0.12 + v * 0.7})`,
    b: v => `rgba(96,165,250,${0.12 + v * 0.7})`,
  };

  const LEVELS = [
    { name: '0 维 · 标量（一个数）', shape: '()', py: 'torch.tensor(0.8)', world: '一个数：比如某个像素的亮度。', slice: '—' },
    { name: '1 维 · 向量（一行数）', shape: '(4,)', py: 'torch.rand(4)', world: '一行数：Excel 里的一列，或一行像素的亮度。', slice: 't[1] → 0.9（取出一个数）' },
    { name: '2 维 · 矩阵（一张表）', shape: '(4, 4)', py: 'torch.rand(4, 4)', world: '一张表：一张 4×4 的灰度小图，每个像素一个亮度值。', slice: 't[1] → (4,) 取出第 2 行' },
    { name: '3 维 · 一摞表', shape: '(3, 4, 4)', py: 'torch.rand(3, 4, 4)', world: '一摞表：一张 RGB 彩图 = R / G / B 三张亮度表叠在一起。', slice: 't[0] → (4, 4) 取出红色通道那张表' },
    { name: '4 维 · 一批 3 维', shape: '(2, 3, 4, 4)', py: 'torch.rand(2, 3, 4, 4)', world: '一批彩图：2 张 RGB 图一起送进模型（真实训练时是 100 张）。', slice: 't[0] → (3,4,4) 第 1 张彩图；t[0][2] → (4,4) 它的蓝色通道' },
  ];

  function drawGrid(ctx, x0, y0, cell, tint) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const v = BASE[i][j];
        ctx.fillStyle = tint(v);
        ctx.fillRect(x0 + j * (cell + 2), y0 + i * (cell + 2), cell, cell);
        if (cell >= 24) {
          ctx.fillStyle = '#e6edf8';
          ctx.font = '10px ui-monospace,monospace';
          ctx.fillText(v.toFixed(1), x0 + j * (cell + 2) + 3, y0 + i * (cell + 2) + cell - 5);
        }
      }
    }
  }

  function label(ctx, text, x, y, color) {
    ctx.fillStyle = color || '#8b96ad';
    ctx.font = '12px ui-monospace,monospace';
    ctx.fillText(text, x, y);
  }

  function render(canvas, level) {
    const ctx = canvas.getContext('2d'), W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#10141f';
    ctx.fillRect(0, 0, W, H);

    if (level === 0) {
      ctx.fillStyle = TINTS.gray(0.8);
      ctx.fillRect(W / 2 - 34, H / 2 - 34, 68, 68);
      ctx.fillStyle = '#e6edf8';
      ctx.font = '18px ui-monospace,monospace';
      ctx.fillText('0.8', W / 2 - 16, H / 2 + 6);
      label(ctx, '就一个数', W / 2 - 26, H / 2 + 58);
    } else if (level === 1) {
      const cell = 46, x0 = (W - (4 * (cell + 2))) / 2, y0 = H / 2 - cell / 2;
      ROW.forEach((v, j) => {
        ctx.fillStyle = TINTS.gray(v);
        ctx.fillRect(x0 + j * (cell + 2), y0, cell, cell);
        ctx.fillStyle = '#e6edf8';
        ctx.font = '13px ui-monospace,monospace';
        ctx.fillText(v.toFixed(1), x0 + j * (cell + 2) + 12, y0 + cell - 12);
      });
      label(ctx, '一行 4 个数', x0, y0 - 12);
    } else if (level === 2) {
      const cell = 56, x0 = (W - (4 * (cell + 2))) / 2, y0 = (H - (4 * (cell + 2))) / 2;
      drawGrid(ctx, x0, y0, cell, TINTS.gray);
      label(ctx, '一张 4×4 的灰度图（数字 = 像素亮度）', x0 - 6, y0 - 12);
    } else if (level === 3) {
      const cell = 26, gap = 16, gw = 4 * (cell + 2);
      const x0 = (W - (3 * gw + 2 * gap)) / 2, y0 = (H - (4 * (cell + 2))) / 2;
      [['R', TINTS.r], ['G', TINTS.g], ['B', TINTS.b]].forEach(([t, tint], k) => {
        const x = x0 + k * (gw + gap);
        drawGrid(ctx, x, y0, cell, tint);
        label(ctx, t + ' 通道', x + gw / 2 - 22, y0 - 10, tint(0.9));
        label(ctx, `t[${k}]`, x + gw / 2 - 12, y0 + 4 * (cell + 2) + 18);
      });
      label(ctx, '三张亮度表叠起来 = 一张彩图', W / 2 - 96, 22);
    } else {
      const cell = 16, gw = 4 * (cell + 2);
      label(ctx, '批（batch）= 一摞"一摞表"一起算', W / 2 - 100, 22);
      for (let n = 0; n < 2; n++) {
        const y0 = 52 + n * (gw + 44);
        [['R', TINTS.r], ['G', TINTS.g], ['B', TINTS.b]].forEach(([t, tint], k) => {
          const x = 52 + k * (gw + 12);
          drawGrid(ctx, x, y0, cell, tint);
        });
        label(ctx, `图 ${n}（t[${n}] → (3,4,4)）`, 52, y0 + gw + 16, '#5eead4');
      }
    }
  }

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <div class="ag-btns">
            <button class="ld-prev">← 降一维</button>
            <button class="ld-next primary">升一维 →</button>
          </div>
          <div class="ld-dots"></div>
          <div class="ld-info"></div>
        </div>
        <div class="ts-panel"><canvas class="ld-canvas" width="380" height="340"></canvas></div>
      </div>`;
    const canvas = container.querySelector('.ld-canvas');
    const dots = container.querySelector('.ld-dots');
    const info = container.querySelector('.ld-info');
    let level = 0;

    LEVELS.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'ld-dot'; d.textContent = i + '维';
      d.onclick = () => set(i);
      dots.appendChild(d);
    });

    function set(i) {
      level = Math.max(0, Math.min(4, i));
      const L = LEVELS[level];
      render(canvas, level);
      container.querySelectorAll('.ld-dot').forEach((d, k) => d.classList.toggle('active', k === level));
      info.innerHTML = `
        <div class="ld-name">${L.name}</div>
        <div class="ld-row">形状 <code>${L.shape}</code></div>
        <div class="ld-row">${L.world}</div>
        <div class="ld-row">Python <code>${L.py}</code></div>
        <div class="ld-row dim">索引练习：${L.slice}</div>`;
      container.querySelector('.ld-prev').disabled = level === 0;
      container.querySelector('.ld-next').disabled = level === 4;
    }
    container.querySelector('.ld-prev').onclick = () => set(level - 1);
    container.querySelector('.ld-next').onclick = () => set(level + 1);
    set(0);
    return {};
  }

  return { mount };
})();
