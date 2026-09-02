// anim.js — 3Blue1Brown 风格的数学动画剧场
// 四个逐场景动画（字幕推进 + 单步控制）：
//   matrix   矩阵 = 空间的变换（c01）
//   gradient 梯度下降 = 下山寻谷（c05）
//   chain    链式法则 = 敏感度回传（c07）
//   netflow  神经网络 = 信号的旅程（c08）
// 每个动画 = scenes[{cap, dur, draw(ctx, p)}]，p ∈ [0,1] 为场景内进度。
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

  // ================= A1 · 矩阵 = 空间的变换 =================
  function matrixScenes() {
    const M = [[2, 1], [-1, 1]];                 // 目标矩阵
    const Mt = t => [[1 + t * (M[0][0] - 1), t * M[0][1]], [t * M[1][0], 1 + t * (M[1][1] - 1)]];
    const apply = (m, x, y) => [m[0][0] * x + m[0][1] * y, m[1][0] * x + m[1][1] * y];
    const cx = 290, cy = 190, sc = 33;

    function grid(ctx, m) {
      ctx.lineWidth = 1;
      for (let c = -6; c <= 6; c++) {
        ctx.strokeStyle = c === 0 ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.12)';
        ctx.beginPath();
        for (let y = -6; y <= 6.01; y += 0.5) { const [X, Y] = apply(m, c, y); const px = cx + X * sc, py = cy - Y * sc; y === -6 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); }
        ctx.stroke();
        ctx.beginPath();
        for (let x = -6; x <= 6.01; x += 0.5) { const [X, Y] = apply(m, x, c); const px = cx + X * sc, py = cy - Y * sc; x === -6 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); }
        ctx.stroke();
      }
    }
    function basis(ctx, m, scale = 1) {
      const [ix, iy] = apply(m, 1, 0), [jx, jy] = apply(m, 0, 1);
      arrow(ctx, cx, cy, cx + ix * sc * scale, cy - iy * sc * scale, '#60a5fa', 3.5);
      arrow(ctx, cx, cy, cx + jx * sc * scale, cy - jy * sc * scale, '#4ade80', 3.5);
      text(ctx, `î → (${ix.toFixed(1)}, ${iy.toFixed(1)})`, cx + ix * sc * scale + 8, cy - iy * sc * scale, '#60a5fa', 12);
      text(ctx, `ĵ → (${jx.toFixed(1)}, ${jy.toFixed(1)})`, cx + jx * sc * scale + 8, cy - jy * sc * scale + 16, '#4ade80', 12);
    }

    return [
      { cap: '平面上任何一点 (x, y)，都能由两个基向量到达：(x, y) = x·î + y·ĵ', dur: 5,
        draw(ctx, p) { const t = ease(Math.min(1, p * 2)); grid(ctx, Mt(0)); basis(ctx, Mt(0));
          const [px, py] = [3 * sc, 2 * sc];
          ctx.globalAlpha = t; ctx.fillStyle = '#ffb86b'; ctx.beginPath(); ctx.arc(cx + px * t, cy - py * t, 6, 0, TAU); ctx.fill();
          ctx.globalAlpha = 1; text(ctx, '(3, 2) = 3·î + 2·ĵ', cx + px * t + 12, cy - py * t - 8, '#ffb86b', 13); } },
      { cap: '矩阵 M 登场：它的每一列，就是基向量要去的新位置', dur: 6,
        draw(ctx, p) { const t = ease(p); const m = Mt(t); grid(ctx, m); basis(ctx, m);
          text(ctx, `M = [[${m[0][0].toFixed(2)}, ${m[0][1].toFixed(2)}],[${m[1][0].toFixed(2)}, ${m[1][1].toFixed(2)}]]`, 40, 340, '#dbe4f3', 13, 'left', false, true); } },
      { cap: '整个网格跟着被变形——矩阵不是一张数字表，它是一次空间变换', dur: 4,
        draw(ctx) { const m = Mt(1); grid(ctx, m); basis(ctx, m);
          text(ctx, '变形后的空间', 40, 30, '#8b96ad', 13); } },
      { cap: '点 (3, 2) 的新位置 = 3·î新 + 2·ĵ新 = (8, −1) —— 这就是矩阵乘法的几何含义', dur: 6,
        draw(ctx, p) { const m = Mt(1); grid(ctx, m);
          const [ox, oy] = [3 * sc, 2 * sc];                      // 原位置
          const [nx, ny] = apply(m, 3, 2);                        // 新位置
          const t = ease(p);
          // 平行四边形虚线
          const [ix, iy] = apply(m, 1, 0), [jx, jy] = apply(m, 0, 1);
          ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(255,184,107,0.6)';
          ctx.beginPath(); ctx.moveTo(cx + ix * sc * 3, cy - iy * sc * 3); ctx.lineTo(cx + nx * sc, cy - ny * sc); ctx.lineTo(cx + jx * sc * 2, cy - jy * sc * 2); ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 0.35; ctx.fillStyle = '#ffb86b'; ctx.beginPath(); ctx.arc(cx + ox, cy - oy, 6, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
          ctx.fillStyle = '#ffb86b'; ctx.beginPath(); ctx.arc(cx + ox + (nx - ox) * t, cy - oy + (ny - oy) * t, 7, 0, TAU); ctx.fill();
          text(ctx, '(3, 2)', cx + ox + 10, cy - oy - 8, 'rgba(255,184,107,0.7)', 12);
          text(ctx, `(8, −1)`, cx + nx * sc + 12, cy - ny * sc, '#ffb86b', 14, 'left', true);
          basis(ctx, m); } },
    ];
  }

  // ================= A2 · 梯度下降 =================
  function gradientScenes() {
    const f = w => 0.35 * w * w + 0.8, df = w => 0.7 * w;
    const cx = 320, cy = 200, sx = 105, sy = 90, ox = 320, oy = 330; // y 轴向上为损失
    const X = w => cx + w * sx, Y = w => oy - f(w) * sy;

    function curve(ctx) {
      ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 2.2; ctx.beginPath();
      for (let w = -2.6; w <= 2.6; w += 0.05) { const x = X(w), y = Y(w); w === -2.6 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.font = '12px ui-monospace,monospace';
      ctx.fillText('损失 L(w)', 40, 46); ctx.fillText('参数 w →', cx + 2.1 * sx, oy + 24);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath(); ctx.moveTo(30, oy); ctx.lineTo(30 + 4.6 * sx, oy); ctx.stroke();
    }
    function ball(ctx, w, color = '#ffb86b', r = 8) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(X(w), Y(w), r, 0, TAU); ctx.fill(); }
    function steps(lr, w0, n) { const arr = [w0]; for (let i = 0; i < n; i++) arr.push(arr[arr.length - 1] - lr * df(arr[arr.length - 1])); return arr; }

    function hopScene(lr, cap) {
      const seq = steps(lr, -2.2, 9);
      return { cap, dur: 9,
        draw(ctx, p) { curve(ctx);
          const pos = p * (seq.length - 1), i = Math.min(seq.length - 2, Math.floor(pos)), frac = ease(pos - i);
          const w = seq[i] + (seq[i + 1] - seq[i]) * frac;
          // 轨迹
          ctx.strokeStyle = 'rgba(94,234,212,0.5)'; ctx.setLineDash([4, 4]); ctx.beginPath();
          seq.forEach((ww, k) => { const x = X(ww), y = Y(ww); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); ctx.setLineDash([]);
          ball(ctx, w);
          const slope = df(w);
          text(ctx, `w = ${w.toFixed(2)}　斜率 = ${slope.toFixed(2)}　步长 = lr·斜率`, 40, 46, '#dbe4f3', 12.5, 'left', false, true); } };
    }

    return [
      { cap: '这条山谷就是损失函数：横轴 = 参数 w，纵轴 = 损失（模型有多差）。训练 = 走到谷底。', dur: 5,
        draw(ctx, p) { curve(ctx); const w = -2.2 + (2.6 - 2.2) * p; ball(ctx, w); } },
      { cap: '导数 = 脚下的坡度（往哪边更陡）。梯度下降一句话：w ← w − lr × 斜率', dur: 6,
        draw(ctx, p) { curve(ctx); const w = -1.6; ball(ctx, w);
          const s = df(w), x1 = X(w), y1 = Y(w);
          const t = ease(p);
          arrow(ctx, x1, y1, x1 + (60 - t * 20), y1 - (60 - t * 20) * s * 0.4, '#fb923c', 2.5);
          text(ctx, `坡度（切线）= ${s.toFixed(2)}`, x1 + 18, y1 - 30, '#fb923c', 13); } },
      hopScene(0.5, 'lr = 0.5：每一步都踩着"下坡最陡的方向"，稳稳滑向谷底'),
      hopScene(3.0, 'lr = 3.0：步子太大，坡度直接把你甩过谷底——来回弹、越弹越偏。学习率的故事，全在这条曲线里。'),
    ];
  }

  // ================= A3 · 链式法则 =================
  function chainScenes() {
    const nodes = [
      { x: 80, val: 3, label: 'x' },
      { x: 240, val: 6, label: 'a = 2x', local: '×2' },
      { x: 400, val: 7, label: 'b = a+1', local: '+1' },
      { x: 560, val: 49, label: 'L = b²', local: '平方' },
    ];
    const grads = [null, null, null, 1]; // dL/dL = 1

    function draw(ctx, showGradTo) {
      ctx.fillStyle = '#10141f'; ctx.fillRect(0, 0, 640, 380);
      nodes.forEach((nd, i) => {
        box(ctx, nd.x - 52, 130, 104, 84, 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.2)');
        text(ctx, nd.label, nd.x, 155, '#8b96ad', 13, 'center');
        text(ctx, String(nd.val), nd.x, 190, '#dbe4f3', 22, 'center', true, true);
        if (i < nodes.length - 1) arrow(ctx, nd.x + 54, 172, nodes[i + 1].x - 54, 172, 'rgba(255,255,255,0.3)', 2);
      });
      if (showGradTo >= 0) {
        for (let i = 3; i >= showGradTo; i--) {
          if (grads[i] !== null && grads[i] !== undefined) {
            text(ctx, `dL/d· = ${grads[i]}`, nodes[i].x, 250, '#5eead4', 15, 'center', true);
          }
        }
      }
    }
    const pulse = (ctx, x1, x2, p) => {
      const x = x1 + (x2 - x1) * ease(p);
      ctx.fillStyle = '#ffb86b'; ctx.beginPath(); ctx.arc(x, 172, 7, 0, TAU); ctx.fill();
    };

    return [
      { cap: '前向传播：从 x=3 出发，×2 得 6，+1 得 7，平方得 49。数字从左流向右。', dur: 5,
        draw(ctx, p) { draw(ctx, -2); pulse(ctx, nodes[0].x, nodes[3].x, p); } },
      { cap: '反向开始：站在 L 处，dL/dL = 1。目标是走到最左边，算出 dL/dx。', dur: 5,
        draw(ctx, p) { draw(ctx, 3); const t = ease(p); ctx.fillStyle = '#ffb86b'; ctx.beginPath(); ctx.arc(nodes[3].x, 250, 6 + t * 4, 0, TAU); ctx.fill(); } },
      { cap: '「平方」站的局部斜率 = 2b = 14 → 1 × 14 = 14 = dL/db；「+1」站斜率是 1 → 14 传给 a。', dur: 7,
        draw(ctx, p) { draw(ctx, 2); const t = ease(p); pulse(ctx, nodes[3].x, nodes[1].x + 52, p); } },
      { cap: '「×2」站局部斜率是 2 → 14 × 2 = 28 = dL/dx。链式法则 = 沿途局部斜率的连乘。', dur: 7,
        draw(ctx, p) { draw(ctx, 0); grads[2] = 14; grads[1] = 28 * 0.5; grads[0] = 28;
          text(ctx, 'dL/db = 14　dL/da = 28　dL/dx = 28', 150, 300, '#5eead4', 15, 'left', true);
          const t = ease(p); pulse(ctx, nodes[1].x, nodes[0].x, t); } },
    ];
  }

  // ================= A4 · 神经网络信号流 =================
  function netflowScenes() {
    const layers = [3, 4, 2];
    const X = [100, 320, 540];
    const nodes = layers.map((n, li) => Array.from({ length: n }, (_, i) => ({
      x: X[li], y: 190 + (i - (n - 1) / 2) * 78,
    })));
    const act = [[0.9, -0.4, 1.3], [0.5, -1.1, 0.8, 0.2], [1.6, -0.7]];

    function net(ctx, litLayer = -1, bp = -1) {
      for (let li = 0; li < layers.length - 1; li++) {
        const hot = litLayer === li;
        nodes[li].forEach((a, i) => nodes[li + 1].forEach((b, j) => {
          ctx.strokeStyle = hot ? `rgba(94,234,212,${0.25 + 0.5 * Math.abs(Math.sin(i * 3 + j))})`
            : (bp === li ? `rgba(251,146,60,${0.25 + 0.5 * Math.abs(Math.sin(i * 2 + j))})` : 'rgba(255,255,255,0.09)');
          ctx.lineWidth = hot || bp === li ? 1.8 : 1;
          ctx.beginPath(); ctx.moveTo(a.x + 13, a.y); ctx.lineTo(b.x - 13, b.y); ctx.stroke();
        }));
      }
      nodes.forEach((layer, li) => layer.forEach((n, i) => {
        const active = li <= litLayer;
        ctx.fillStyle = active ? `rgba(96,165,250,${0.4 + 0.35 * Math.abs(act[li][i])})` : 'rgba(255,255,255,0.08)';
        ctx.strokeStyle = active ? '#60a5fa' : 'rgba(255,255,255,0.25)';
        ctx.beginPath(); ctx.arc(n.x, n.y, 17, 0, TAU); ctx.fill(); ctx.stroke();
        if (active) text(ctx, act[li][i].toFixed(1), n.x, n.y + 4, '#e6f0ff', 11, 'center', false, true);
      }));
    }

    return [
      { cap: '一个 3→4→2 的神经网络：圆 = 神经元，线 = 权重。数字 = 激活值。', dur: 5,
        draw(ctx, p) { net(ctx, 0); } },
      { cap: '前向传播：每层做"加权求和 + 激活"，信号从左到右流过一层又一层。', dur: 6,
        draw(ctx, p) { net(ctx, 1 + Math.min(1, Math.floor(p * 2))); } },
      { cap: '输出与正确答案的差距 = 损失（橙色）。训练的目标就是让它变小。', dur: 5,
        draw(ctx, p) { net(ctx, 2);
          text(ctx, '损失', 540 + 40, 190 + 20, '#fb923c', 14, 'left', true);
          ctx.fillStyle = '#fb923c'; ctx.beginPath(); ctx.arc(580, 180, 8 + Math.sin(p * TAU * 2) * 2, 0, TAU); ctx.fill(); } },
      { cap: '反向传播：误差信号沿同一条线从右往左回流（橙色），沿途告诉每个权重"往哪边改、改多少"。', dur: 7,
        draw(ctx, p) { net(ctx, 2, 1 - Math.min(1, p * 1.2)); } },
    ];
  }

  const ANIMS = { matrix: matrixScenes, gradient: gradientScenes, chain: chainScenes, netflow: netflowScenes };
  const TITLES = { matrix: '矩阵 = 空间的变换', gradient: '梯度下降 = 下山寻谷', chain: '链式法则 = 敏感度回传', netflow: '神经网络 = 信号的旅程' };

  function mount(container, animId) {
    const def = ANIMS[animId] || ANIMS.matrix;
    const scenes = def();
    container.innerHTML = `
      <div class="ts-wrap an-wrap">
        <div style="flex:1; min-width:0">
          <div class="ts-panel"><canvas class="an-canvas" width="640" height="380"></canvas></div>
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
    let scene = 0, p = 0, playing = false, raf = null, last = 0;

    scenes.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'an-dot'; d.textContent = i + 1;
      d.onclick = () => { scene = i; p = 0; paint(); };
      dots.appendChild(d);
    });

    function paint() {
      const s = scenes[scene];
      s.draw(canvas.getContext('2d'), p);
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
