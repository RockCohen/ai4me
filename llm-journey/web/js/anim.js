// anim.js — 3Blue1Brown 风格的数学动画剧场
// 原则：动画内容 = 章节内容本身。每个视觉元素都对应讲述中的一个具体量。
//   broadcast（c01）广播的两步流程：右对齐 → 补 1 → 拉伸 → 相加，含失败案例
//   linreg   （c05）梯度下降拟合真实数据点：线自己找到规律，lr 过大则发散
//   chaindiamond（c07）章节原例 a·b + a·c + b·c：拓扑反向 + 菱形汇合的 += 时刻
//   netflow  （c08）神经网络信号的旅程：前向点亮 + 反向回流
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
  function rawText(ctx, s, x, y, color, size, align, bold, mono) {
    ctx.fillStyle = color;
    ctx.font = `${bold ? 'bold ' : ''}${size}px ${mono ? 'ui-monospace,monospace' : '-apple-system,"PingFang SC",sans-serif'}`;
    ctx.textAlign = align || 'left';
    ctx.fillText(s, x, y);
    ctx.textAlign = 'left';
  }
  // 布局第一性原理：文字位置必须被计算而非手工摆放。
  // T() 登记 每次 绘制的占位矩形；与已放置元素碰撞时自动下移避让，
  // 使"文字叠文字"在结构上不可能发生。_placed 每帧清空（帧 = 状态的纯函数）。
  let _placed = [];
  function resetPlaced() { _placed = []; }
  function T(ctx, s, x, y, color, size, align, bold, mono) {
    ctx.font = `${bold ? 'bold ' : ''}${size}px ${mono ? 'ui-monospace,monospace' : '-apple-system,"PingFang SC",sans-serif'}`;
    const w = ctx.measureText(s).width, h = size * 1.3;
    let rect = { x: align === 'center' ? x - w / 2 : (align === 'right' ? x - w : x), y: y - size, w, h };
    let tries = 0;
    while (tries < 6 && _placed.some(r =>
      rect.x < r.x + r.w && rect.x + rect.w > r.x && rect.y < r.y + r.h && rect.y + rect.h > r.y)) {
      rect.y += h * 0.9; tries++;
    }
    _placed.push(rect);
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.fillText(s, rect.x, rect.y + size);
    ctx.textAlign = 'left';
  }
  function box(ctx, x, y, w, h, fill, stroke, r = 12) {
    ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); ctx.stroke();
  }
  const BG = '#0d1322';

  // ================= c01 · 广播的两步流程（980×560） =================
  function broadcastScenes() {
    const W = 980, H = 560;
    const A = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
    const B = [10, 20, 30, 40];
    const B3 = [30, 10, 20];                  // 失败案例的一行（3 个）
    const cw = 88, chh = 60, ax = 200, ay = 210;

    function grid(ctx, vals, alpha = 1, ghostRows = false) {
      ctx.globalAlpha = alpha;
      for (let i = 0; i < vals.length; i++) {
        for (let j = 0; j < vals[i].length; j++) {
          const x = ax + j * cw, y = ay + i * chh;
          box(ctx, x, y, cw - 8, chh - 8, 'rgba(96,165,250,0.13)', 'rgba(96,165,250,0.4)', 9);
          rawText(ctx, String(vals[i][j]), x + (cw - 8) / 2, y + (chh - 8) / 2 + 6, '#e6f0ff', 17, 'center', true, true);
        }
      }
      ctx.globalAlpha = 1;
    }
    function rowCells(ctx, vals, y, alpha = 1, ghost = false, solid = false) {
      for (let j = 0; j < vals.length; j++) {
        const x = ax + j * cw;
        if (solid) {
          // 底色以完全不透明绘制，真正盖住下层的旧数值，样式再淡入
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#101a2b';
          ctx.fillRect(x, y, cw - 8, chh - 8);
          ctx.globalAlpha = alpha;
        }
        if (ghost) ctx.setLineDash([6, 5]);
        box(ctx, x, y, cw - 8, chh - 8, ghost ? 'rgba(251,146,60,0.22)' : 'rgba(251,146,60,0.16)',
          ghost ? 'rgba(251,146,60,0.85)' : 'rgba(251,146,60,0.75)', 9);
        ctx.setLineDash([]);
        rawText(ctx, String(vals[j]), x + (cw - 8) / 2, y + (chh - 8) / 2 + 6, '#ffd9a8', 17, 'center', true, true);
      }
      ctx.globalAlpha = 1;
    }
    function shapeText(ctx, s, x, y, color, hi) {
      T(ctx, s, x, y, color, 22, 'left', true, true);
    }
    // 右侧对齐演算区
    function alignBlock(ctx, line1, line2, hiIdx2, ok, p) {
      const bx = 640, by = 150;
      T(ctx, '第一步：右对齐，短的左边补 1', bx, by - 34, '#8b96ad', 14);
      T(ctx, line1, bx + 60, by + 12, '#dbe4f3', 26, 'left', true, true);
      T(ctx, line2, bx + 60, by + 58, '#ffb86b', 26, 'left', true, true);
      if (hiIdx2 >= 0 && p > 0.4) {
        // 高亮 line2 开头补出来的 "1"
        ctx.strokeStyle = '#ffb86b'; ctx.lineWidth = 2;
        ctx.strokeRect(bx + 52, by + 32, 42, 42);
        T(ctx, '← 补出来的 1', bx + 190, by + 58, '#ffb86b', 13.5);
      }
    }
    function checks(ctx, pairs, p, failIdx) {
      const bx = 640, by = 250;
      T(ctx, '第二步：逐位检查', bx, by - 18, '#8b96ad', 14);
      pairs.forEach(([a, b], i) => {
        const x = bx + i * 105;
        const fail = failIdx === i;
        const col = fail ? '#ff8080' : (b === 1 || a === b ? '#5eead4' : '#ffb86b');
        box(ctx, x, by, 88, 74, fail ? 'rgba(255,128,128,0.12)' : 'rgba(94,234,212,0.07)',
          fail ? 'rgba(255,128,128,0.6)' : 'rgba(94,234,212,0.35)', 10);
        T(ctx, `${a} vs ${b}`, x + 44, by + 30, '#dbe4f3', 16, 'center', true, true);
        T(ctx, fail ? '✗' : (a === b ? '相等 ✓' : `拉伸 ✓`), x + 44, by + 56, col, 13, 'center');
      });
    }

    return { w: W, h: H, scenes: [
      { cap: '任务：(3, 4) 的表格，加上 (4,) 的一行数。一个表格怎么加一行？', dur: 5,
        draw(ctx, p) {
          T(ctx, 'a，形状 (3, 4)', ax, ay - 14, '#8b96ad', 14);
          grid(ctx, A);
          T(ctx, 'b，形状 (4,)', ax, 464, '#8b96ad', 14);
          rowCells(ctx, B, 478, Math.min(1, p * 2));
        } },
      { cap: '第一步（右对齐）：把 (4,) 补成 (1, 4)——短的那串，在左边补一个 1', dur: 5.5,
        draw(ctx, p) {
          T(ctx, 'a，形状 (3, 4)', ax, ay - 14, '#8b96ad', 14);
          grid(ctx, A);
          T(ctx, 'b，形状 (4,)', ax, 464, '#8b96ad', 14);
          rowCells(ctx, B, 478);
          alignBlock(ctx, '(3, 4)', '(1, 4)', 0, true, ease(p));
        } },
      { cap: '第二步（逐位检查 + 拉伸）：4 vs 4 相等；3 vs 1 → b 被"逻辑复制"成 3 行——内存里仍只有一份', dur: 7,
        draw(ctx, p) {
          T(ctx, 'a，形状 (3, 4)', ax, ay - 14, '#8b96ad', 14);
          grid(ctx, A);
          const fade = 0.55 + 0.35 * Math.min(1, p * 1.5);
          // 幽灵行：先用底色盖住原值，再画 b 的值（不出现文字叠文字）
          rowCells(ctx, B, ay + chh, fade, true, true);
          rowCells(ctx, B, ay + 2 * chh, fade, true, true);
          T(ctx, 'b，形状 (4,)', ax, 464, '#8b96ad', 14);
          rowCells(ctx, B, 478);
          arrow(ctx, ax + 3 * cw - 40, 470, ax + 3 * cw - 40, ay + 2 * chh + 6, 'rgba(251,146,60,0.7)', 2);
          T(ctx, '逻辑复制（不占内存）', ax + 3 * cw + 4, 402, 'rgba(251,146,60,0.9)', 12.5);
          checks(ctx, [[4, 4], [3, 1]], p, -1);
        } },
      { cap: '相加：结果的每个格子 = a 的格子 + 对应的 b 值，结果形状 (3, 4) ✓', dur: 6,
        draw(ctx, p) {
          grid(ctx, A);
          rowCells(ctx, B, 478);
          const shown = Math.ceil(p * 12);
          for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) {
            const idx = i * 4 + j;
            if (idx >= shown) continue;
            const x = ax + j * cw, y = ay + i * chh;
            ctx.fillStyle = '#102430';                       // 不透明底，盖住 a 的旧值
            ctx.fillRect(x, y, cw - 8, chh - 8);
            box(ctx, x, y, cw - 8, chh - 8, 'rgba(94,234,212,0.18)', 'rgba(94,234,212,0.55)', 9);
            T(ctx, String(A[i][j] + B[j]), x + (cw - 8) / 2, y + (chh - 8) / 2 + 6, '#5eead4', 17, 'center', true, true);
          }
        } },
      { cap: '失败案例：(3, 4) + (3,)——末位 4 vs 3，不相等也没有 1 → RuntimeError。一步流程走到哪、断在哪，清清楚楚。', dur: 7,
        draw(ctx, p) {
          T(ctx, 'a，形状 (3, 4)', ax, ay - 14, '#8b96ad', 14);
          grid(ctx, A);
          T(ctx, 'b，形状 (3,)', ax, 464, '#8b96ad', 14);
          rowCells(ctx, B3, 478);
          alignBlock(ctx, '(3, 4)', '(1, 3)', 0, true, 1);
          checks(ctx, [[4, 3]], 1, 0);
          if (p > 0.45) {
            box(ctx, 640, 360, 300, 60, 'rgba(255,128,128,0.12)', 'rgba(255,128,128,0.6)', 10);
            T(ctx, 'RuntimeError：dimension 1', 660, 398, '#ff8080', 16, 'left', true, true);
          }
        } },
    ] };
  }

  // ================= c05 · 梯度下降拟合真实数据（980×560） =================
  function linregScenes() {
    const W = 980, H = 560;
    const px0 = 90, px1 = 590, py0 = 80, py1 = 470;
    const noise = [0.06, -0.05, 0.08, -0.03, 0.05, 0.02, -0.06, 0.04, 0.03];
    const pts = Array.from({ length: 9 }, (_, i) => {
      const x = 0.08 + i * 0.1;
      return { x, y: 0.9 * x + 0.15 + noise[i] };
    });
    const X = x => px0 + x * (px1 - px0);
    const Y = y => py1 - y * (py1 - py0) / 10;

    function traj(lr, steps) {
      let w = -2, b = 4;
      const seq = [{ w, b }];
      for (let s = 0; s < steps; s++) {
        let dw = 0, db = 0;
        for (const p of pts) { const e = w * p.x + b - p.y; dw += 2 * e * p.x / pts.length; db += 2 * e / pts.length; }
        w -= lr * dw; b -= lr * db;
        seq.push({ w, b });
      }
      return seq;
    }
    const fitSeq = traj(0.6, 160);
    const badSeq = traj(5.2, 160);
    const mse = (w, b) => pts.reduce((s, p) => s + (w * p.x + b - p.y) ** 2, 0) / pts.length;

    function plot(ctx, w, b, showResid) {
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.strokeRect(px0, py0, px1 - px0, py1 - py0);
      pts.forEach(p => {
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), 5, 0, TAU); ctx.fill();
        if (showResid) {
          ctx.strokeStyle = 'rgba(255,128,128,0.55)'; ctx.setLineDash([4, 4]);
          ctx.beginPath(); ctx.moveTo(X(p.x), Y(p.y)); ctx.lineTo(X(p.x), Y(w * p.x + b)); ctx.stroke();
          ctx.setLineDash([]);
        }
      });
      ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2.6; ctx.beginPath();
      ctx.moveTo(X(0), Y(b)); ctx.lineTo(X(1), Y(w + b)); ctx.stroke(); ctx.lineWidth = 1;
      T(ctx, `y = ${w.toFixed(2)}·x + ${b.toFixed(2)}`, px0 + 10, py0 + 24, '#5eead4', 14, 'left', false, true);
    }

    function panel(ctx, w, b, lr) {
      const loss = mse(w, b);
      T(ctx, `损失（MSE）= ${loss.toFixed(3)}`, 650, 100, '#ffb86b', 16, 'left', true, true);
      T(ctx, `更新公式：`, 650, 150, '#8b96ad', 13.5);
      T(ctx, `w ← w − lr·∂L/∂w`, 650, 178, '#dbe4f3', 14, 'left', false, false, true);
      T(ctx, `b ← b − lr·∂L/∂b`, 650, 204, '#dbe4f3', 14, 'left', false, false, true);
      T(ctx, `lr = ${lr}`, 650, 250, '#5eead4', 15, 'left', true);
      T(ctx, '（∂L/∂w 与 ∂L/∂b 由 c03 的', 650, 300, '#8b96ad', 12.5);
      T(ctx, '反向传播自动算出——同一条链）', 650, 320, '#8b96ad', 12.5);
    }

    return { w: W, h: H, scenes: [
      { cap: '9 个数据点散在平面上；模型是一条线 y = w·x + b。初始 w = −2、b = 4——歪得离谱。', dur: 5.5,
        draw(ctx, p) { plot(ctx, -2, 4, false); panel(ctx, -2, 4, 0.6);
          ctx.globalAlpha = Math.min(1, p * 2); pts.forEach(pt => { ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(X(pt.x), Y(pt.y), 5, 0, TAU); ctx.fill(); }); ctx.globalAlpha = 1; } },
      { cap: '损失 = 每个点到线的竖直距离的平方平均（红色虚线段）。现在的 MSE 算给你看。', dur: 6,
        draw(ctx, p) { plot(ctx, -2, 4, true); panel(ctx, -2, 4, 0.6);
          T(ctx, `每根红线 = 一个点的"误差"`, px0 + 10, py1 - 16, 'rgba(255,128,128,0.8)', 13); } },
      { cap: '一步更新：梯度（由 c03 的反向传播算出）告诉 w 和 b 各往哪边微调——线朝数据挪了一点。', dur: 7,
        draw(ctx, p) {
          const w0 = -2, b0 = 4, seq = traj(0.6, 2);
          const w = w0 + (seq[1].w - w0) * ease(p), b = b0 + (seq[1].b - b0) * ease(p);
          plot(ctx, w, b, true); panel(ctx, w, b, 0.6);
        } },
      { cap: '连续 160 步：线自己"找到"了数据的规律，损失一路下滑。这就是训练的全部——只是重复。', dur: 9,
        draw(ctx, p) { const st = fitSeq[Math.min(fitSeq.length - 1, Math.floor(p * (fitSeq.length - 1)))];
          plot(ctx, st.w, st.b, false); panel(ctx, st.w, st.b, 0.6); } },
      { cap: 'lr = 5.2：步子太大，线来回甩、越甩越偏——发散。学习率的教训，一遍就记住。', dur: 9,
        draw(ctx, p) { const st = badSeq[Math.min(badSeq.length - 1, Math.floor(p * (badSeq.length - 1)))];
          plot(ctx, Math.max(-30, Math.min(30, st.w)), Math.max(-20, Math.min(40, st.b)), false);
          panel(ctx, Math.max(-30, Math.min(30, st.w)), Math.max(-20, Math.min(40, st.b)), 5.2); } },
    ] };
  }

  // ================= c07 · 菱形依赖的梯度汇合（980×560） =================
  function chainDiamondScenes() {
    const W = 980, H = 560;
    const N = {
      a: { x: 140, y: 140, name: 'a', val: 2 },
      c: { x: 140, y: 295, name: 'c', val: 0.5 },
      b: { x: 140, y: 450, name: 'b', val: -1 },
      pab: { x: 400, y: 140, name: 'a·b', val: -2 },
      pac: { x: 400, y: 295, name: 'a·c', val: 1 },
      pbc: { x: 400, y: 450, name: 'b·c', val: -0.5 },
      s: { x: 660, y: 215, name: 'a·b+a·c', val: -1 },
      L: { x: 850, y: 295, name: 'L', val: -1.5 },
    };
    const EDGES = [['a', 'pab'], ['b', 'pab'], ['a', 'pac'], ['c', 'pac'], ['b', 'pbc'], ['c', 'pbc'], ['pab', 's'], ['pac', 's'], ['s', 'L'], ['pbc', 'L']];
    // 梯度（随场景揭示）：L=1；s=1；pbc=1；pab=1；pac=1；a=-0.5；b=2.5；c=1
    const G = { L: 1, s: 1, pbc: 1, pab: 1, pac: 1, a: -0.5, b: 2.5, c: 1 };

    function draw(ctx, revealVals = 8, revealGrad = null, hot = null, pulseEdge = null, pt = 0) {
      ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
      EDGES.forEach(([f, t], i) => {
        const A = N[f], B = N[t];
        const active = pulseEdge && pulseEdge[0] === f && pulseEdge[1] === t;
        ctx.strokeStyle = active ? '#ffb86b' : 'rgba(255,255,255,0.18)';
        ctx.lineWidth = active ? 2.5 : 1.4;
        ctx.beginPath(); ctx.moveTo(A.x + 36, A.y); ctx.lineTo(B.x - 38, B.y); ctx.stroke();
        if (active) { const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2 - 10; ctx.fillStyle = '#ffb86b'; ctx.beginPath(); ctx.arc(mx, my, 6 + Math.sin(pt * TAU * 2) * 2, 0, TAU); ctx.fill(); }
      });
      Object.entries(N).forEach(([k, nd]) => {
        const revealIdx = ['a', 'b', 'c', 'pab', 'pac', 'pbc', 's', 'L'].indexOf(k);
        const shown = revealVals >= 0 ? revealIdx <= revealVals : true;
        const isLeaf = ['a', 'b', 'c'].includes(k);
        box(ctx, nd.x - 48, nd.y - 36, 96, 72, shown ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.02)', 'rgba(255,255,255,0.2)');
        if (shown) {
          T(ctx, nd.name, nd.x, nd.y - 8, isLeaf ? '#ffb86b' : '#8b96ad', 13, 'center', true);
          rawText(ctx, String(nd.val), nd.x, nd.y + 20, '#dbe4f3', 18, 'center', true, true);
        }
        if (revealGrad !== null && revealGrad.includes(k)) {
          T(ctx, `dL/d${k === 'L' ? 'L' : k} = ${G[k]}`, nd.x, nd.y - 48, '#5eead4', 14, 'center', true);
        }
      });
    }

    return { w: W, h: H, scenes: [
      { cap: '章节的原例：f = a·b + a·c + b·c（a=2, b=−1, c=0.5）。先看前向：数值从叶子流向 L。', dur: 6.5,
        draw(ctx, p) { const reveal = Math.min(7, Math.floor(ease(p) * 8)); draw(ctx, reveal); } },
      { cap: '反向开始：站在 L 处，dL/dL = 1。目标：走到三个叶子，算出 dL/da、dL/db、dL/dc。', dur: 5,
        draw(ctx, p) { draw(ctx, 7, ['L'], null, null, p);
          const t = ease(p); ctx.fillStyle = '#ffb86b'; ctx.beginPath(); ctx.arc(N.L.x, N.L.y - 52, 6 + t * 4, 0, TAU); ctx.fill(); } },
      { cap: '加法节点：把梯度【原样分发】给两个输入——s 和 b·c 各拿到 1。加法的局部斜率恒为 1。', dur: 7,
        draw(ctx, p) { draw(ctx, 7, ['L', 's', 'pbc'], null, ['L', 'pbc'] ? ['s', 'L'] : null, p);
          pulse(ctx, 0, 0, 0);
          // 双脉冲：L→s 与 L→p_bc
          const t = ease(p);
          ctx.fillStyle = '#ffb86b';
          ctx.beginPath(); ctx.arc(N.s.x + (N.L.x - N.s.x) * (1 - t), N.s.y + (N.L.y - N.s.y) * (1 - t), 7, 0, TAU); ctx.fill();
          ctx.beginPath(); ctx.arc(N.pbc.x + (N.L.x - N.pbc.x) * (1 - t), N.pbc.y + (N.L.y - N.pbc.y) * (1 - t), 7, 0, TAU); ctx.fill(); } },
      { cap: '乘法节点：局部斜率 =【对方因子】。p·a·c 这条：1 传给 a 时带上 c=0.5，传给 c 时带上 a=2。', dur: 8,
        draw(ctx, p) { draw(ctx, 7, ['L', 's', 'pbc', 'pac'], ['pac', 's'], p);
          T(ctx, '乘法法则：∂(uv)/∂u = v，∂(uv)/∂v = u', 210, 530, '#8b96ad', 14); } },
      { cap: '三条路都到叶子了——现在到了关键一刻：a 收到两条路的贡献，必须【相加】。', dur: 7,
        draw(ctx, p) { draw(ctx, 7, ['L', 's', 'pbc', 'pac', 'pab'], ['pab', 'pac'], p); } },
      { cap: '汇合时刻：dL/da = (−1) + (0.5) = −0.5；dL/db = 2 + 0.5 = 2.5；dL/dc = 2 − 1 = 1。+= 写的不是习惯，是求导法则本身。', dur: 9,
        draw(ctx, p) { draw(ctx, 7, ['a', 'b', 'c', 'L', 's', 'pbc', 'pac', 'pab'], null, null, p); } },
    ] };
  }

  // ================= c08 · 神经网络信号流（900×470） =================
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
        if (active) rawText(ctx, act[li][i].toFixed(1), n.x, n.y + 4, '#e6f0ff', 12, 'center', false, true);
      }));
    }

    return { w: W, h: H, scenes: [
      { cap: '一个 3→4→2 的神经网络：圆 = 神经元，线 = 权重。数字 = 激活值。', dur: 5.5,
        draw(ctx, p) { net(ctx, 0); } },
      { cap: '前向传播：每层做"加权求和 + 激活"，信号从左到右流过一层又一层。', dur: 6.5,
        draw(ctx, p) { net(ctx, 1 + Math.min(1, Math.floor(p * 2))); } },
      { cap: '输出与正确答案的差距 = 损失（橙色）。训练的目标就是让它变小。', dur: 5.5,
        draw(ctx, p) { net(ctx, 2);
          T(ctx, '损失', 780, 210, '#fb923c', 15, 'left', true);
          ctx.fillStyle = '#fb923c'; ctx.beginPath(); ctx.arc(770, 235, 8 + Math.sin(p * TAU * 2) * 2.5, 0, TAU); ctx.fill(); } },
      { cap: '反向传播：误差信号沿同一条线从右往左回流（橙色），沿途告诉每个权重"往哪边改、改多少"。', dur: 7.5,
        draw(ctx, p) { net(ctx, 2, 1 - Math.min(1, p * 1.2)); } },
    ] };
  }

  const ANIMS = { broadcast: broadcastScenes, linreg: linregScenes, chaindiamond: chainDiamondScenes, netflow: netflowScenes };
  const TITLES = { broadcast: '广播：两步流程的动画', linreg: '梯度下降：线自己找到数据', chaindiamond: '反向传播：菱形依赖的梯度汇合', netflow: '神经网络 = 信号的旅程' };

  function mount(container, animId) {
    const def = ANIMS[animId] || ANIMS.broadcast;
    const built = def();
    const scenes = built.scenes;
    const DW = built.w, DH = built.h;
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
    canvas.width = DW * 2; canvas.height = DH * 2;
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
      ctx.fillStyle = BG;
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
