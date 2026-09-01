// tensorsim.js — 张量形状/广播可视化器
// 预设一组关键操作（对应 S1 实验卡），网格热力图渲染 + 逐条解释。
export const TensorSim = (function () {
  'use strict';

  // 预设操作：a/b 用嵌套数组；op 返回 {ok, result?, error?, explain, hl?}
  const shape = a => Array.isArray(a) ? [a.length, ...shape(a[0])] : [];
  const flat = a => Array.isArray(a) ? a.flatMap(flat) : [a];

  function matmul(A, B) {
    const n = A.length, m = B[0].length, k = B.length;
    const out = [];
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < m; j++) {
        let s = 0;
        for (let t = 0; t < k; t++) s += A[i][t] * B[t][j];
        row.push(Math.round(s * 100) / 100);
      }
      out.push(row);
    }
    return out;
  }
  function bcastAdd(A, B) {
    // 通用广播加法：形状缺的补 1、为 1 的循环取模（与 torch 语义一致）
    const B2 = Array.isArray(B[0]) ? B : [B]; // (n,) 提升为 (1,n)
    const m = Math.max(A.length, B2.length), n = Math.max(A[0].length, B2[0].length);
    const out = [];
    for (let i = 0; i < m; i++) {
      const row = [];
      for (let j = 0; j < n; j++) {
        const av = A[i % A.length][j % A[0].length];
        const bv = B2[i % B2.length][j % B2[0].length];
        row.push(Math.round((av + bv) * 100) / 100);
      }
      out.push(row);
    }
    return out;
  }
  const ones = (r, c, v = 1) => Array.from({ length: r }, () => Array.from({ length: c }, () => v));

  const PRESETS = [
    {
      name: '① 广播 OK：(3,4) + (4,)',
      code: 'a = ones(3,4)\nb = ones(4)\na + b',
      run: () => ({ ok: true, a: ones(3, 4), b: [1, 1, 1, 1], result: bcastAdd(ones(3, 4), [1, 1, 1, 1]), explain: 'b 的一维 (4,) 从**最后一个维度**向前对齐：4==4 ✓，前面缺的维度补 1 再拉伸 → (3,4)。' }),
    },
    {
      name: '② 广播报错：(3,4) + (3,)',
      code: 'a = ones(3,4)\nb = ones(3)\na + b',
      run: () => ({ ok: false, a: ones(3, 4), b: [1, 1, 1], error: 'RuntimeError: The size of tensor a (4) must match the size of tensor b (3) at non-singleton dimension 1', explain: '对齐方向是末维优先：a 的末维是 4，b 的末维是 3，既不相等也没有 1 → 报错。和 ① 只差一个维度！' }),
    },
    {
      name: '③ 广播规则：(3,1) + (1,4)',
      code: 'a = ones(3,1)\nb = ones(1,4)\na + b',
      run: () => ({ ok: true, a: ones(3, 1), b: [ones(1, 4)], result: bcastAdd(ones(3, 1), ones(1, 4)), explain: '两个维度都为 1 的轴互相拉伸：(3,1)→(3,4)，(1,4)→(3,4)。广播是"逻辑拉伸"，不复制内存。' }),
    },
    {
      name: '④ view 共享内存（改 b 动 a）',
      code: 'a = arange(12).reshape(3,4)\nb = a.view(4,3)\nb[0,0] = 99',
      run: () => ({ ok: true, a: [Array.from({ length: 4 }, (_, i) => i), Array.from({ length: 4 }, (_, i) => 4 + i), Array.from({ length: 4 }, (_, i) => 8 + i)], b: [[99, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]], explain: 'view 不复制数据，b 与 a 共享同一块内存 → 改 b[0,0]，a[0,0] 同步变成 99。形状操作 ≠ 数据复制。' }),
    },
    {
      name: '⑤ matmul vs 逐元素乘',
      code: 'a = ones(3,4); b = ones(4,2)\na @ b   # (3,2)\na * a   # (3,4)',
      run: () => ({ ok: true, a: ones(3, 4), b: ones(4, 2), result: matmul(ones(3, 4), ones(4, 2)), explain: '@ 是矩阵乘：(3,4)@(4,2) 内维 4 相消 → (3,2)，结果全为 4（1+1+1+1）。* 是逐元素乘，要求形状可广播。' }),
    },
    {
      name: '⑥ keepdim 求和',
      code: 'x = ones(3,4)\nx.sum(dim=0)               # (4,)\nx.sum(dim=0, keepdim=True)  # (1,4)',
      run: () => ({ ok: true, a: ones(3, 4), result: [3, 3, 3, 3], explain: 'dim=0 把第 0 维消掉 → (4,)，每列 3 个 1 相加得 3；keepdim=True 保留成 (1,4)——为的是之后能直接广播回去（如归一化 x / x.sum(dim=0, keepdim=True)）。' }),
    },
  ];

  function drawGrid(ctx, x, y, cell, data, color, label) {
    ctx.font = '11px ui-monospace,monospace';
    ctx.fillStyle = '#8b96ad';
    ctx.fillText(label, x, y - 6);
    const rows = Array.isArray(data) ? data.length : 1;
    const cols = Array.isArray(data) ? (Array.isArray(data[0]) ? data[0].length : data.length) : 1;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const v = Array.isArray(data) ? (Array.isArray(data[0]) ? data[i][j] : data[j]) : data;
        const t = Math.min(1, Math.abs(v) / 4);
        ctx.fillStyle = color.replace('$A', 0.15 + t * 0.55);
        ctx.fillRect(x + j * (cell + 2), y + i * (cell + 2), cell, cell);
        ctx.fillStyle = '#dbe4f3';
        if (cell >= 22) ctx.fillText(String(v), x + j * (cell + 2) + 3, y + i * (cell + 2) + cell - 6);
      }
    }
  }

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <select class="ts-preset"></select>
          <pre class="ts-code"></pre>
          <div class="ts-explain"></div>
        </div>
        <div class="ts-panel"><canvas class="ts-canvas" width="640" height="330"></canvas></div>
      </div>`;
    const sel = container.querySelector('.ts-preset');
    PRESETS.forEach((p, i) => {
      const o = document.createElement('option'); o.value = i; o.textContent = p.name; sel.appendChild(o);
    });
    sel.onchange = () => render(+sel.value);
    function render(i) {
      const p = PRESETS[i];
      container.querySelector('.ts-code').textContent = p.code;
      const r = p.run();
      const ex = container.querySelector('.ts-explain');
      if (!r.ok) {
        ex.innerHTML = r.error + '<br><br>' + r.explain;
      } else {
        ex.innerHTML = r.explain;
      }
      const ctx = container.querySelector('.ts-canvas').getContext('2d');
      ctx.clearRect(0, 0, 640, 330);
      ctx.fillStyle = '#141a28'; ctx.fillRect(0, 0, 640, 330);
      const cell = r.a && r.a[0] && Array.isArray(r.a[0]) && r.a[0].length >= 4 ? 24 : 30;
      if (r.a) drawGrid(ctx, 24, 64, cell, r.a, 'rgba(96,165,250,$A)', 'a');
      if (r.b) drawGrid(ctx, 24, 190, cell, r.b, 'rgba(196,181,253,$A)', 'b');
      if (r.result) drawGrid(ctx, 360, 64, 26, r.result, 'rgba(94,234,212,$A)', '结果');
      if (!r.ok) {
        ctx.fillStyle = '#f87171'; ctx.font = 'bold 14px sans-serif';
        ctx.fillText('✗ 报错', 360, 90);
      }
    }
    render(0);
    return {};
  }

  return { mount };
})();
