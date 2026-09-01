// autogradsim.js — autograd 交互台
// 输入表达式 → 计算图可视化 → forward/backward 按钮 + 反向动画 + grad 累加计数。
import { MG } from './micrograd.js';

export const AutogradSim = (function () {
  'use strict';

  function mount(container, cfg) {
    cfg = cfg || {};
    container.innerHTML = `
      <div class="ag-wrap">
        <div class="ag-side">
          <label class="ag-row">表达式 <input class="ag-expr" spellcheck="false"></label>
          <label class="ag-row">变量赋值 <input class="ag-vars" spellcheck="false"></label>
          <div class="ag-btns">
            <button class="ag-fwd primary">↻ 前向</button>
            <button class="ag-bwd primary">⇐ 反向传播</button>
            <button class="ag-zero">清零梯度</button>
          </div>
          <div class="ag-meta"></div>
          <div class="ag-msg"></div>
          <div class="ag-presets"></div>
        </div>
        <div class="ag-panel"><svg class="ag-svg"></svg></div>
      </div>`;

    const $ = s => container.querySelector(s);
    const exprIn = $('.ag-expr'), varsIn = $('.ag-vars'), meta = $('.ag-meta'),
      msg = $('.ag-msg'), svg = $('.ag-svg');
    let graph = null, order = [], bwdCount = 0;

    const PRESETS = cfg.presets || [
      { expr: 'a*b + a*c + b*c', vars: 'a=2, b=-1, c=0.5', note: '菱形依赖：a 的梯度 = b + c（三条路径靠 += 汇合）' },
      { expr: 'a + a', vars: 'a=3', note: '别名：同一个节点出现两次，梯度 = 2' },
      { expr: 'tanh(a*b + c)', vars: 'a=2, b=-1, c=0.5', note: '复合激活：tanh 的局部梯度 1−t²' },
      { expr: '(a + b*c) * (a - b)', vars: 'a=2, b=-1, c=0.5', note: '混合运算：注意 a 被两条路径使用' },
    ];
    const box = $('.ag-presets');
    box.innerHTML = '<div class="ag-title">预设表达式</div>';
    PRESETS.forEach(p => {
      const b = document.createElement('button');
      b.className = 'ag-preset';
      b.textContent = p.expr;
      b.onclick = () => { exprIn.value = p.expr; varsIn.value = p.vars; meta.textContent = p.note; build(true); };
      box.appendChild(b);
    });

    function parseVars() {
      const vars = {};
      varsIn.value.split(',').forEach(part => {
        const m = part.trim().match(/^([A-Za-z_]\w*)\s*=\s*(-?\d*\.?\d+)$/);
        if (m) vars[m[1]] = new MG.Value(parseFloat(m[2]));
      });
      Object.values(vars).forEach(v => { v.label = '?'; });
      // 给变量打标签
      let i = 0;
      for (const k of Object.keys(vars)) vars[k].label = k;
      return vars;
    }

    function build(resetCount) {
      msg.textContent = '';
      try {
        const vars = parseVars();
        const root = MG.parseExpr(exprIn.value, vars);
        graph = MG.renderGraph(root, svg);
        order = graph.order;
        if (resetCount) bwdCount = 0;
        msg.className = 'ag-msg ok';
        msg.textContent = `计算图共 ${order.length} 个节点（含常量）。输出 = ${MG.fmt(root.data)}`;
      } catch (e) {
        msg.className = 'ag-msg bad';
        msg.textContent = '解析失败：' + e.message;
      }
    }

    function paint() {
      svg.querySelectorAll('.mg-node').forEach(g => {
        const v = order[+g.dataset.idx];
        g.classList.toggle('hot', v.grad !== 0);
        g.querySelector('.mg-grad').textContent = 'grad ' + MG.fmt(v.grad);
      });
    }

    $('.ag-fwd').onclick = () => build(true);
    $('.ag-zero').onclick = () => { if (graph) { order.forEach(v => { v.grad = 0; }); paint(); } };
    $('.ag-bwd').onclick = () => {
      if (!graph) return;
      bwdCount++;
      // 反向动画：按逆拓扑序逐节点点亮
      const root = order[order.length - 1];
      root.grad += 1; // 累加种子（演示累加语义）
      const rev = [...order].reverse();
      rev.forEach((v, i) => {
        setTimeout(() => {
          v._backward();
          paint();
          msg.className = 'ag-msg ok';
          msg.textContent = `第 ${bwdCount} 次反向：已传播 ${i + 1}/${rev.length} 个节点。` +
            (bwdCount > 1 ? '（注意：没有清零，梯度正在累加！）' : '');
        }, i * 55);
      });
    };

    exprIn.value = PRESETS[0].expr;
    varsIn.value = PRESETS[0].vars;
    meta.textContent = PRESETS[0].note;
    build(true);
    return {};
  }

  return { mount };
})();
