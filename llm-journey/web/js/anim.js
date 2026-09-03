// anim.js — 3Blue1Brown 风格的数学动画剧场
// 四个逐场景动画（字幕推进 + 单步控制）：
//   matrix   矩阵 = 空间的变换（c01）        设计画布 980×560
//   gradient 梯度下降 = 下山寻谷（c05）      设计画布 900×470
//   chain    链式法则 = 敏感度回传（c07）    设计画布 900×470
//   netflow  神经网络 = 信号的旅程（c08）    设计画布 900×470
// 每帧：清屏 → 画场景。canvas 以 2× 分辨率渲染防模糊。
export const Anim = (function () {
  'use strict';

  const TAU = Math.PI * 2;
  const ease = t => (t < 0.5 ? 4 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  function arrow(ctx, x1, y1, x2, y2, color, lw = 3) {
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    const a = Math.atan2(y2 - y1, x2 - x1), L = 9 + lw * 1.5;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - L * Math.cos(a - 0.42), y2 - L * Math.sin(a - 0.42));
    ctx.lineTo(x2 - L * Math.cos(a + 0.42), y2 - L * Math.sin(a + 0.42));
    ctx.closePath(); ctx.fill();
  }
  function text(ctx, s, x, y, color, size, align, bold, mono) {
    ctx.fillStyle = color;
    ctx.font = `${bold ? 'bold ' : ''}${size}px ${mono ? 'ui-monospace,monospace' : '-apple-system,"PingFang SC",sans-serif'}`;
    ctx.textAlign = align || 'left';
    ctx.fillText(s, x, y);
    ctx.textAlign = 'left';
  }
  function box(ctx, x, y, w, h, fill, stroke, r = 12) {
    ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); ctx.stroke();
  }

  // ================= A1 · 矩阵 = 空间的变换（980×560） =================
  function matrixScenes() {
    const W = 980, H = 560;
    const M = [[2, 1], [-1, 1]];
    const Mt = t => [[1 + t * (M[0][0] - 1), t * M[0][1]], [t * M[1][0], 1 + t * (M[1][1] - 1)]];
    const apply = (m, x, y) => [m[0][0] * x + m[0][1] * y, m[1][0] * x + m[1][1] * y];
    const cx = 470, cy = 295, sc = 60;

    function grid(ctx, m) {
      ctx.lineWidth = 1.1;
      for (let c = -4; c <= 4; c++) {
        ctx.strokeStyle = c === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.13)';
        for (const fixed of ['v', 'h']) {
          ctx.beginPath();
          for (let u = -4; u <= 4.01; u += 0.34) {
            const [x, y] = fixed === 'v' ? apply(m, c, u) : apply(m, u, c);
            const px = cx + x * sc, py = cy - y * sc;
            u === -4 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }
    }
    function basis(ctx, m) {
      const [ix, iy] = apply(m, 1, 0), [jx, jy] = apply(m, 0, 1);
      arrow(ctx, cx, cy, cx + ix * sc, cy - iy * sc, '#60a5fa', 4);
      text(ctx, `î → (${ix.toFixed(1)}, ${iy.toFixed(1)})`, cx + ix * sc + 12, cy - iy * sc + 26, '#60a5fa', 13);
      arrow(ctx, cx, cy, cx + jx * sc, cy - jy * sc, '#4ade80', 4);
      text(ctx, `ĵ → (${jx.toFixed(1)}, ${jy.toFixed(1)})`, cx + jx * sc + 12, cy - jy * sc - 12, '#4ade80', 13);
    }

    return { w: W, h: H, scenes: [
      { cap: '平面上任何一点 (x, y)，都能由两个基向量到达：(x, y) = x·î + y·ĵ。橙色点 = (3, 2)。', dur: 6,
        draw(ctx, p) { grid(ctx, Mt(0)); basis(ctx, Mt(0));
          const t = ease(Math.min(1, p * 2));
          ctx.globalAlpha = 0.35 + 0.65 * t;
          ctx.fillStyle = '#ffb86b'; ctx.beginPath(); ctx.arc(cx + 3 * sc * t, cy - 2 * sc * t, 8, 0, TAU); ctx.fill();
          ctx.globalAlpha = 1;
          text(ctx, '(3, 2)', cx + 3 * sc * t + 14, cy - 2 * sc * t - 10, '#ffb86b', 14); } },
      { cap: '矩阵 M 登场：它的每一列，就是基向量要去的新位置——î 去往 (2, −1)，ĵ 去往 (1, 1)', dur: 7,
        draw(ctx, p) { const t = ease(p); const m = Mt(t); grid(ctx, m); basis(ctx, m);
          text(ctx, `M = [[${m[0][0].toFixed(2)}, ${m[0][1].toFixed(2)}], [${m[1][0].toFixed(2)}, ${m[1][1].toFixed(2)}]]`, 40, H - 40, '#dbe4f3', 15, 'left', false, true); } },
      { cap: '整个网格跟着被变形——矩阵不是一张数字表，它是一次空间变换', dur: 4.5,
        draw(ctx) { const m = Mt(1); grid(ctx, m); basis(ctx, m);
          text(ctx, '变形后的空间', 40, 48, '#8b96ad', 14); } },
      { cap: '点 (3, 2) 的新位置 = 3·î新 + 2·ĵ新 = (8, −1) —— 这就是矩阵乘法的几何含义', dur: 7,
        draw(ctx, p) { const m = Mt(1); grid(ctx, m); basis(ctx, m);
          const [ix, iy] = apply(m, 1, 0), [jx, jy] = apply(m, 0, 1);
          const ox = cx + 3 * sc, oy = cy - 2 * sc;
          const nx = cx + 8 * sc, ny = cy + 1 * sc;
          const t = ease(p);
          ctx.setLineDash([6, 6]); ctx.strokeStyle = 'rgba(255,184,107,0.65)'; ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(cx + ix * sc * 3, cy - iy * sc * 3);
          ctx.lineTo(nx, ny); ctx.lineTo(cx + jx * sc * 2, cy - jy * sc * 2);
          ctx.stroke(); ctx.setLineDash([]);
          ctx.globalAlpha = 0.3; ctx.fillStyle = '#ffb86b';
          ctx.beginPath(); ctx.arc(ox, oy, 8, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
          ctx.fillStyle = '#ffb86b'; ctx.beginPath(); ctx.arc(ox + (nx - ox) * t, oy + (ny - oy) * t, 9, 0, TAU); ctx.fill();
          text(ctx, '(3, 2)', ox + 12, oy - 10, 'rgba(255,184,107,0.8)', 13);
          text(ctx, '(8, −1)', nx - 14, ny - 12, '#ffb86b', 16, 'right', true); } },
    ] };
  }

  // ================= A2 · 梯度下降（900×470） =================
  function gradientScenes() {
    const W = 900, H = 470;
    const f = w => 0.35 * w * w + 0.8, df = w => 0.7 * w;
    const cx = 450, sx = 150, oy = 400, sy = 110;
    const X = w => cx + w * sx, Y = w => oy - f(w) * sy;
    const clampW = w => Math.max(-2.7, Math.min(2.7, w));

    function curve(ctx) {
      ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 2.4; ctx.beginPath();
      for (let w = -2.6; w <= 2.6; w += 0.04) { const x = X(w), y = Y(w); w === -2.6 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.stroke();
      text(ctx, '损失 L(w)', 60, 52, 'rgba(255,255,255,0.4)', 13, 'left', false, true);
      text(ctx, '参数 w →', W - 150, oy + 34, 'rgba(255,255,255,0.4)', 13, 'left', false, true);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath(); ctx.moveTo(60, oy); ctx.lineTo(60 + 4.4 * sx, oy); ctx.stroke();
    }
    function ball(ctx, w, color = '#ffb86b', r = 9) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(X(w), Y(w), r, 0, TAU); ctx.fill(); }
    function steps(lr, w0, n) { const arr = [w0]; for (let i = 0; i < n; i++) arr.push(arr[arr.length - 1] - lr * df(arr[arr.length - 1])); return arr; }

    function hopScene(lr, cap) {
      const seq = steps(lr, -2.2, 10).map(clampW);
      return { cap, dur: 10,
        draw(ctx, p) { curve(ctx);
          const pos = p * (seq.length - 1), i = Math.min(seq.length - 2, Math.floor(pos)), frac = ease(pos - i);
          const w = seq[i] + (seq[i + 1] - seq[i]) * frac;
          ctx.strokeStyle = 'rgba(94,234,212,0.55)'; ctx.setLineDash([5, 5]); ctx.lineWidth = 1.6; ctx.beginPath();
          seq.forEach((ww, k) => { const x = X(ww), y = Y(ww); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); ctx.setLineDash([]);
          ball(ctx, w);
          const slope = df(w);
          text(ctx, `w = ${w.toFixed(2)}　斜率 = ${slope.toFixed(2)}　更新：w ← w − ${lr} × 斜率`, 60, 46, '#dbe4f3', 13.5, 'left', false, true); } };
    }

    return { w: W, h: H, scenes: [
      { cap: '这条山谷就是损失函数：横轴 = 参数 w，纵轴 = 损失（模型有多差）。训练 = 走到谷底。', dur: 5.5,
        draw(ctx, p) { curve(ctx); ball(ctx, -2.2 + (2.5 - 2.2) * p);
          text(ctx, '谷底 = 最优参数', cx - 52, oy - 30, '#8b96ad', 13); } },
      { cap: '导数 = 脚下的坡度（往哪边更陡）。梯度下降一句话：w ← w − lr × 斜率', dur: 6.5,
        draw(ctx, p) { curve(ctx); const w = -1.6; ball(ctx, w);
          const s = df(w), x1 = X(w), y1 = Y(w), t = ease(p);
          arrow(ctx, x1, y1, x1 + (70 - t * 25), y1 - (70 - t * 25) * s * 0.35, '#fb923c', 2.6);
          text(ctx, `坡度（切线）= ${s.toFixed(2)}`, x1 + 20, y1 - 34, '#fb923c', 13.5); } },
      hopScene(0.5, 'lr = 0.5：每一步踩着"下坡最陡的方向"，步子越靠近谷底越小——稳稳收敛'),
      hopScene(3.1, 'lr = 3.1：步子太大，直接被甩过谷底，来回弹、越弹越远——发散。学习率的故事全在这条曲线里。'),
    ] };
  }

  // ================= A3 · 链式法则（900×470） =================
  function chainScenes() {
    const W = 900, H = 470;
    const nodes = [
      { x: 110, val: 3, label: 'x' },
      { x: 320, val: 6, label: 'a = 2x', local: '×2' },
      { x: 530, val: 7, label: 'b = a+1', local: '+1' },
      { x: 740, val: 49, label: 'L = b²', local: '平方' },
    ];
    const state = { showGrad: -1, g: [null, null, null, 1] };

    function draw(ctx, upto) {
      ctx.fillStyle = '#0d1322'; ctx.fillRect(0, 0, W, H);
      nodes.forEach((nd, i) => {
        box(ctx, nd.x - 62, 140, 124, 92, 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.2)');
        text(ctx, nd.label, nd.x, 168, '#8b96ad', 14, 'center');
        text(ctx, String(nd.val), nd.x, 205, '#dbe4f3', 24, 'center', true, true);
        if (i < nodes.length - 1) arrow(ctx, nd.x + 64, 186, nodes[i + 1].x - 64, 186, 'rgba(255,255,255,0.3)', 2);
      });
      if (upto >= 0) {
        for (let i = 3; i >= upto; i--) {
          if (state.g[i] !== null && state.g[i] !== undefined) {
            text(ctx, `dL/d· = ${state.g[i]}`, nodes[i].x, 285, '#5eead4', 16, 'center', true);
          }
        }
      }
    }
    const pulse = (ctx, x1, x2, p) => {
      const x = x1 + (x2 - x1) * ease(p);
      ctx.fillStyle = '#ffb86b'; ctx.beginPath(); ctx.arc(x, 186, 8, 0, TAU); ctx.fill();
    };

    return { w: W, h: H, scenes: [
      { cap: '前向传播：从 x=3 出发，×2 得 6，+1 得 7，平方得 49。数值从左流向右。', dur: 5.5,
        draw(ctx, p) { draw(ctx, -2); pulse(ctx, nodes[0].x, nodes[3].x, p); } },
      { cap: '反向开始：站在 L 处，dL/dL = 1。目标是走到最左边，算出 dL/dx。', dur: 5,
        draw(ctx, p) { draw(ctx, 3); const t = ease(p); ctx.fillStyle = '#ffb86b'; ctx.beginPath(); ctx.arc(nodes[3].x, 285, 7 + t * 5, 0, TAU); ctx.fill(); } },
      { cap: '「平方」站的局部斜率 = 2b = 14 → 1 × 14 = 14 = dL/db；「+1」站斜率是 1 → 14 原样传给 a。', dur: 8,
        draw(ctx, p) { draw(ctx, 2); pulse(ctx, nodes[3].x, nodes[1].x + 62, p); } },
      { cap: '「×2」站的局部斜率是 2：dL/dx = dL/da × 2 = 14 × 2 = 28。链式法则 = 沿途局部斜率的连乘。', dur: 8,
        draw(ctx, p) { state.g[2] = 14; state.g[1] = 14; state.g[0] = 28;
          draw(ctx, 0);
          const t = ease(p); pulse(ctx, nodes[1].x, nodes[0].x, t); } },
    ] };
  }

  // ================= A4 · 神经网络信号流（900×470） =================
  function netflowScenes() {
    const W = 900, H = 470;
    const layers = [3, 4, 2];
    const X = [170, 450, 730];
    const nodes = layers.map((n, li) => Array.from({ length: n }, (_, i) => ({
      x: X[li], y: 235 + (i - (n - 1) / 2) * 84,
    })));
    const act = [[0.9, -0.4, 1.3], [0.5, -1.1, 0.8, 0.2], [1.6, -0.7]];

    function net(ctx, litLayer = -1, bp = -1) {
      for (let li = 0; li < layers.length - 1; li++) {
        const hot = litLayer === li;
        nodes[li].forEach((a, i) => nodes[li + 1].forEach((b, j) => {
          ctx.strokeStyle = hot ? `rgba(94,234,212,${0.3 + 0.5 * Math.abs(Math.sin(i * 3 + j))})`
            : (bp === li ? `rgba(251,146,60,${0.3 + 0.5 * Math.abs(Math.sin(i * 2 + j))})` : 'rgba(255,255,255,0.09)');
          ctx.lineWidth = hot || bp === li ? 2 : 1.1;
          ctx.beginPath(); ctx.moveTo(a.x + 15, a.y); ctx.lineTo(b.x - 15, b.y); ctx.stroke();
        }));
      }
      nodes.forEach((layer, li) => layer.forEach((n, i) => {
        const active = li <= litLayer;
        ctx.fillStyle = active ? `rgba(96,165,250,${0.4 + 0.35 * Math.abs(act[li][i])})` : 'rgba(255,255,255,0.08)';
        ctx.strokeStyle = active ? '#60a5fa' : 'rgba(255,255,255,0.25)';
        ctx.beginPath(); ctx.arc(n.x, n.y, 19, 0, TAU); ctx.fill(); ctx.stroke();
        if (active) text(ctx, act[li][i].toFixed(1), n.x, n.y + 4, '#e6f0ff', 12, 'center', false, true);
      }));
    }

    return { w: W, h: H, scenes: [
      { cap: '一个 3→4→2 的神经网络：圆 = 神经元，线 = 权重。数字 = 激活值。', dur: 5.5,
        draw(ctx, p) { net(ctx, 0); } },
      { cap: '前向传播：每层做"加权求和 + 激活"，信号从左到右流过一层又一层。', dur: 6.5,
        draw(ctx, p) { net(ctx, 1 + Math.min(1, Math.floor(p * 2))); } },
      { cap: '输出与正确答案的差距 = 损失（橙色）。训练的目标就是让它变小。', dur: 5.5,
        draw(ctx, p) { net(ctx, 2);
          text(ctx, '损失', 780, 210, '#fb923c', 15, 'left', true);
          ctx.fillStyle = '#fb923c'; ctx.beginPath(); ctx.arc(770, 235, 8 + Math.sin(p * TAU * 2) * 2.5, 0, TAU); ctx.fill(); } },
      { cap: '反向传播：误差信号沿同一条线从右往左回流（橙色），沿途告诉每个权重"往哪边改、改多少"。', dur: 7.5,
        draw(ctx, p) { net(ctx, 2, 1 - Math.min(1, p * 1.2)); } },
    ] };
  }

  const ANIMS = { matrix: matrixScenes, gradient: gradientScenes, chain: chainScenes, netflow: netflowScenes };
  const TITLES = { matrix: '矩阵 = 空间的变换', gradient: '梯度下降 = 下山寻谷', chain: '链式法则 = 敏感度回传', netflow: '神经网络 = 信号的旅程' };

  function mount(container, animId) {
    const def = ANIMS[animId] || ANIMS.matrix;
    const scenes = def().scenes;
    const DW = def().w || 640, DH = def().h || 380;
    container.innerHTML = `
      <div class="ts-wrap an-wrap">
        <div style="flex:1; min-width:0">
          <div class="ts-panel"><canvas class="an-canvas"></canvas></div>
          <div class="an-caption"></div>
        </div>
        <div class="ts-side" style="width:190px">
          <div class="ag-title">${TITLES[animId] || ''}</div>
          <div class="an-dots"></div>
          <div class="ag-btns">
            <button class="an-prev">⏮ 上一步</button>
            <button class="an-play primary">▶ 播放</button>
            <button class="an-next">⏭ 下一步</button>
            <button class="an-reset">↺ 重播</button>
          </div>
          <div class="ld-row dim">像看视频一样推进：每一步停下来，把字幕里的说法在脑内演一遍，再点下一步。</div>
        </div>
      </div>`;
    const $ = s => container.querySelector(s);
    const canvas = $('.an-canvas'), capEl = $('.an-caption'), dots = $('.an-dots');
    canvas.width = DW * 2; canvas.height = DH * 2;           // 2× 分辨率防拉伸模糊
    canvas.style.aspectRatio = `${DW} / ${DH}`;
    const ctx = canvas.getContext('2d');
    let scene = 0, p = 0, playing = false, raf = null, last = 0;

    scenes.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'an-dot'; d.textContent = i + 1;
      d.onclick = () => { scene = i; p = 0; paint(); };
      dots.appendChild(d);
    });

    function paint() {
      const s = scenes[scene];
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      ctx.clearRect(0, 0, DW, DH);
      ctx.fillStyle = '#0d1322';
      ctx.fillRect(0, 0, DW, DH);
      s.draw(ctx, p);
      capEl.innerHTML = s.cap;
      dots.querySelectorAll('.an-dot').forEach((d, i) => d.classList.toggle('active-in', i === scene));
      $('.an-play').textContent = playing ? '⏸ 暂停' : '▶ 播放';
      $('.an-prev').disabled = scene === 0 && p === 0;
      $('.an-next').disabled = scene === scenes.length - 1;
    }
    function tick(now) {
      if (playing) {
        const dt = Math.min(50, now - last) / 1000; last = now;
        p += dt / scenes[scene].dur;
        if (p >= 1) { p = 1; paint(); if (scene < scenes.length - 1) { scene++; p = 0; } else playing = false; }
        paint();
      }
      if (playing) raf = requestAnimationFrame(tick);
    }
    function play() {
      playing = !playing; $('.an-play').textContent = playing ? '⏸ 暂停' : '▶ 播放';
      if (playing) { last = performance.now(); raf = requestAnimationFrame(tick); }
      else if (raf) cancelAnimationFrame(raf);
    }
    $('.an-play').onclick = play;
    $('.an-prev').onclick = () => { if (p > 0) p = 0; else scene = Math.max(0, scene - 1); paint(); };
    $('.an-next').onclick = () => { if (scene < scenes.length - 1) { scene++; p = 0; } paint(); };
    $('.an-reset').onclick = () => { scene = 0; p = 0; playing = false; $('.an-play').textContent = '▶ 播放'; if (raf) cancelAnimationFrame(raf); paint(); };
    paint();
    return {};
  }

  return { mount };
})();
