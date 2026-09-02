// trainer.js — 浏览器版迷你训练场
// 用 MG.Value 引擎搭 MLP，在 2D 数据集上实时训练：
// 可调 lr / batch / 隐层 / 激活，支持"坏代码门诊"病灶开关与五件套单步模式。
import { MG } from './micrograd.js';

export const Trainer = (function () {
  'use strict';
  const V = MG.Value;

  // ---------- 数据集 ----------
  function rng(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

  const DATASETS = {
    moons(n, noise, rand) {
      const X = [], y = [];
      for (let i = 0; i < n; i++) {
        const up = i % 2 === 0, t = rand() * Math.PI;
        const px = up ? Math.cos(t) : 1 - Math.cos(t);
        const py = up ? Math.sin(t) : 0.5 - Math.sin(t);
        X.push([px + (rand() - 0.5) * 2 * noise, py + (rand() - 0.5) * 2 * noise]);
        y.push(up ? -1 : 1);
      }
      return { X, y, range: 2.2 };
    },
    circles(n, noise, rand) {
      const X = [], y = [];
      for (let i = 0; i < n; i++) {
        const inner = i % 2 === 0, t = rand() * Math.PI * 2;
        const r = (inner ? 0.7 : 1.8) + (rand() - 0.5) * 2 * noise;
        X.push([r * Math.cos(t), r * Math.sin(t)]);
        y.push(inner ? -1 : 1);
      }
      return { X, y, range: 2.6 };
    },
    xor(n, noise, rand) {
      const X = [], y = [];
      for (let i = 0; i < n; i++) {
        const a = rand() < 0.5 ? -1 : 1, b = rand() < 0.5 ? -1 : 1;
        X.push([a + (rand() - 0.5) * 2 * noise, b + (rand() - 0.5) * 2 * noise]);
        y.push(a * b > 0 ? 1 : -1);
      }
      return { X, y, range: 2.6 };
    },
  };

  // ---------- 模型 ----------
  function makeModel(hidden, act, rand) {
    // hidden: 如 [8] 或 [8,8]；输出 1 个 tanh 节点
    const sizes = [2, ...hidden, 1];
    const layers = [];
    const params = [];
    for (let l = 0; l < sizes.length - 1; l++) {
      const w = [], b = [];
      for (let j = 0; j < sizes[l + 1]; j++) {
        const wj = [];
        for (let i = 0; i < sizes[l]; i++) { const p = new V((rand() * 2 - 1) * 1.0); wj.push(p); params.push(p); }
        const bj = new V(0); b.push(bj); params.push(bj);
        w.push(wj);
      }
      layers.push({ w, b });
    }
    const model = {
      layers, params, act,
      training: true,
      dropoutP: 0,
      forward(x) {
        let h = x.map(xi => new V(xi));
        for (let l = 0; l < layers.length; l++) {
          const out = [];
          for (let j = 0; j < layers[l].w.length; j++) {
            let s = layers[l].b[j];
            for (let i = 0; i < h.length; i++) s = s.add(h[i].mul(layers[l].w[j][i]));
            const isLast = l === layers.length - 1;
            let a = isLast ? s.tanh() : (act === 'relu' ? s.relu() : s.tanh());
            if (this.training && this.dropoutP > 0 && !isLast && Math.random() < this.dropoutP) a = a.mul(0);
            else if (this.training && this.dropoutP > 0 && !isLast) a = a.mul(1 / (1 - this.dropoutP));
            out.push(a);
          }
          h = out;
        }
        if (model.bugs && model.bugs.doubleAct) h[0] = h[0].tanh(); // 病灶④：输出层双重激活
        return h[0];
      },
      zeroGrad() { params.forEach(p => { p.grad = 0; }); },
    };
    return model;
  }

  // ---------- 训练器 ----------
  function create(cfg) {
    // cfg: {mode, dataset, hidden, act, lr, batch, stepsPerFrame, bugs, showStep}
    const state = {
      cfg: Object.assign({ mode: 'classify', dataset: 'moons', hidden: [8, 8], act: 'tanh', lr: 0.5, batch: 16, stepsPerFrame: 3, noise: 0.12, bugs: {} }, cfg),
      running: false, stepCount: 0, losses: [], model: null, data: null, testData: null,
      phase: -1, listeners: {},
    };

    function reseed(seed) { state.rand = rng(seed); }
    function initData() {
      reseed(42);
      if (state.cfg.mode === 'fit') {
        const X = [], y = [];
        for (let i = 0; i < 60; i++) { const x = state.rand() * 2 - 1; X.push([x]); y.push(3 * x + 1 + (state.rand() - 0.5) * 0.2); }
        state.data = { X, y, range: 1.2 };
        state.testData = { X: X.slice(-15), y: y.slice(-15) };
      } else {
        const d = DATASETS[state.cfg.dataset](140, state.cfg.noise, state.rand);
        state.data = d;
        reseed(7);
        state.testData = DATASETS[state.cfg.dataset](60, state.cfg.noise, state.rand);
      }
    }

    function initModel() {
      const rand = rng(1234);
      if (state.cfg.mode === 'fit') {
        const w = new V((rand() * 2 - 1)), b = new V(0);
        state.model = { params: [w, b], training: true, dropoutP: 0, bugs: state.cfg.bugs,
          forward(x) { let o = w.mul(new V(x[0])).add(b); if (this.bugs && this.bugs.doubleAct) o = o.tanh(); return o; },
          zeroGrad() { w.grad = 0; b.grad = 0; } };
        state.fitW = w; state.fitB = b;
      } else {
        const m = makeModel(state.cfg.hidden, state.cfg.act, rand);
        m.bugs = state.cfg.bugs;
        if ('noEvalDropout' in state.cfg.bugs) m.dropoutP = 0.5; // 病灶⑤的载体层
        state.model = m;
      }
    }
    function reset() {
      initData(); initModel();
      state.losses = []; state.stepCount = 0; state.phase = -1;
      renderAll(); emit('reset');
    }

    function trainBatch() {
      const { model, data } = state;
      if (!model) return;
      const n = data.X.length;
      const losses = [];
      // 五件套 1：取 batch
      state.phase = 0;
      const idx = [];
      for (let i = 0; i < Math.min(state.cfg.batch, n); i++) idx.push(Math.floor(state.rand() * n));
      model.training = true;
      // 五件套 2：前向 → loss
      state.phase = 1;
      let loss = new V(0);
      for (const i of idx) {
        const out = model.forward(data.X[i]);
        const diff = out.sub(data.y[i]);
        loss = loss.add(diff.mul(diff));
      }
      loss = loss.div(idx.length);
      // 五件套 3：zero_grad
      state.phase = 2;
      if (!state.cfg.bugs.noZeroGrad) model.zeroGrad();
      // 五件套 4：backward
      state.phase = 3;
      if (!state.cfg.bugs.noBackward) loss.backward();
      // 五件套 5：step
      state.phase = 4;
      if (!state.cfg.bugs.noBackward) {
        const lr = state.cfg.bugs.bigLr ? state.cfg.lr * 50 : state.cfg.lr;
        model.params.forEach(p => { p.data -= lr * p.grad; });
      }
      state.stepCount++;
      state.losses.push(loss.data);
      if (state.losses.length > 600) state.losses.shift();
      return loss.data;
    }

    function trainEpochs(k) { for (let i = 0; i < k; i++) trainBatch(); renderAll(); emit('tick'); }

    function accuracy(useTrainMode) {
      const { model, testData } = state;
      model.training = state.cfg.bugs.noEvalDropout ? true : false; // 病灶⑤
      let c = 0;
      for (let i = 0; i < testData.X.length; i++) {
        const out = model.forward(testData.X[i]).data;
        if (state.cfg.mode === 'fit') c += Math.abs(out - testData.y[i]) < 0.3 ? 1 : 0;
        else c += (out > 0 ? 1 : -1) === testData.y[i] ? 1 : 0;
      }
      model.training = false;
      return c / testData.X.length;
    }

    // ---------- 渲染 ----------
    let els = {};
    function mount(container, cfgOverride) {
      Object.assign(state.cfg, cfgOverride || {});
      container.innerHTML = `
        <div class="tr-wrap">
          <div class="tr-left">
            <div class="tr-panel"><canvas class="tr-main" width="340" height="340"></canvas></div>
            <div class="tr-panel"><canvas class="tr-loss" width="340" height="110"></canvas></div>
          </div>
          <div class="tr-right">
            <div class="tr-stats">
              <div>step <b class="tr-steps">0</b></div>
              <div>loss <b class="tr-lossval">—</b></div>
              <div>${state.cfg.mode === 'fit' ? '拟合' : '测试集准确率'} <b class="tr-acc">—</b></div>
            </div>
            <div class="tr-controls"></div>
            <div class="tr-bugs"></div>
            <div class="tr-stepbox"></div>
          </div>
        </div>`;
      els = {
        main: container.querySelector('.tr-main'), lossC: container.querySelector('.tr-loss'),
        steps: container.querySelector('.tr-steps'), lossval: container.querySelector('.tr-lossval'),
        acc: container.querySelector('.tr-acc'), controls: container.querySelector('.tr-controls'),
        bugs: container.querySelector('.tr-bugs'), stepbox: container.querySelector('.tr-stepbox'),
      };
      buildControls(); reset();
    }

    function slider(label, min, max, step, value, fmt, oninput) {
      const w = document.createElement('label');
      w.className = 'tr-slider';
      w.innerHTML = `${label} <output>${fmt(value)}</output>`;
      const s = document.createElement('input');
      s.type = 'range'; s.min = min; s.max = max; s.step = step; s.value = Math.log10(value) < min ? min : Math.log10(value);
      s.addEventListener('input', () => {
        const v = Math.pow(10, parseFloat(s.value));
        w.querySelector('output').textContent = fmt(v);
        oninput(v);
      });
      w.appendChild(s);
      return w;
    }

    function buildControls() {
      const c = els.controls;
      c.innerHTML = '';
      const btn = (txt, fn, cls) => { const b = document.createElement('button'); b.textContent = txt; b.className = cls || ''; b.onclick = fn; return b; };
      const play = btn('▶ 训练', () => {
        if (state.running) { stop(); play.textContent = '▶ 训练'; }
        else { state.running = true; play.textContent = '⏸ 暂停';
          state.timer = setInterval(() => { trainEpochs(state.cfg.stepsPerFrame); }, 60); }
      }, 'primary');
      const stepBtn = state.cfg.showStep ? btn('单步 (1 batch)', () => { stop(); trainEpochs(1); }) : null;
      const resetBtn = btn('↺ 重置', () => { stop(); state.cfg.bugs = Object.assign({}, state.cfg.bugs); reset(); });
      c.appendChild(play); if (stepBtn) c.appendChild(stepBtn); c.appendChild(resetBtn);

      if (state.cfg.mode === 'fit') {
        const l = slider('学习率', -3, 1, 0.05, state.cfg.lr, v => v.toFixed(3), v => { state.cfg.lr = v; });
        c.appendChild(l);
        return;
      }
      c.appendChild(slider('学习率(对数)', -3, 1, 0.05, state.cfg.lr, v => v.toFixed(3), v => { state.cfg.lr = v; }));
      const bs = document.createElement('label'); bs.className = 'tr-slider';
      bs.innerHTML = 'batch <output>' + state.cfg.batch + '</output>';
      const bsel = document.createElement('input'); bsel.type = 'range'; bsel.min = 4; bsel.max = 64; bsel.step = 4; bsel.value = state.cfg.batch;
      bsel.oninput = () => { state.cfg.batch = +bsel.value; bs.querySelector('output').textContent = bsel.value; };
      bs.appendChild(bsel); c.appendChild(bs);
      const sel = (label, opts, val, fn) => {
        const w = document.createElement('label'); w.className = 'tr-select';
        w.innerHTML = label + ' ';
        const s = document.createElement('select');
        opts.forEach(o => { const op = document.createElement('option'); op.value = o.v; op.textContent = o.t; if (o.v === val) op.selected = true; s.appendChild(op); });
        s.onchange = () => fn(s.value);
        w.appendChild(s); return w;
      };
      c.appendChild(sel('数据集', [{ v: 'moons', t: '双月牙' }, { v: 'circles', t: '圆环' }, { v: 'xor', t: 'XOR' }], state.cfg.dataset, v => { state.cfg.dataset = v; reset(); }));
      c.appendChild(sel('激活', [{ v: 'tanh', t: 'tanh' }, { v: 'relu', t: 'ReLU' }], state.cfg.act, v => { state.cfg.act = v; reset(); }));
      c.appendChild(sel('隐层', [{ v: '4', t: '[4]' }, { v: '8', t: '[8]' }, { v: '8,8', t: '[8,8]' }, { v: '16,16', t: '[16,16]' }], state.cfg.hidden.join(','), v => { state.cfg.hidden = v.split(',').map(Number); reset(); }));

      if (state.cfg.bugs && Object.keys(state.cfg.bugs).length) {
        const BUGS = [
          ['noZeroGrad', '病灶① 忘了 zero_grad'],
          ['bigLr', '病灶② 学习率 ×50'],
          ['noBackward', '病灶③ 忘了 backward'],
          ['doubleAct', '病灶④ 输出层双重激活'],
          ['noEvalDropout', '病灶⑤ 忘了 eval()（Dropout 仍开启）'],
        ];
        const box = els.bugs; box.innerHTML = '<div class="tr-bugtitle">坏代码门诊（可叠加）</div>';
        BUGS.forEach(([k, t]) => {
          const l = document.createElement('label'); l.className = 'tr-bug';
          const cb = document.createElement('input'); cb.type = 'checkbox';
          cb.checked = !!state.cfg.bugs[k];
          cb.onchange = () => { state.cfg.bugs[k] = cb.checked; state.losses = []; };
          l.appendChild(cb); l.appendChild(document.createTextNode(t));
          box.appendChild(l);
        });
      }

      if (state.cfg.showStep) {
        const PHASES = ['① 取一个 batch', '② 前向传播 → loss', '③ zero_grad 清零', '④ backward 反向传播', '⑤ step 参数更新'];
        els.stepbox.innerHTML = '<div class="tr-bugtitle">训练循环五件套（单步时高亮当前阶段）</div>' +
          PHASES.map((p, i) => `<div class="tr-phase" data-p="${i}">${p}</div>`).join('');
      }
    }

    function renderAll() {
      els.steps.textContent = state.stepCount;
      const lastLoss = state.losses.length ? state.losses[state.losses.length - 1] : null;
      els.lossval.textContent = lastLoss == null ? '—' : lastLoss.toFixed(4);
      els.acc.textContent = (state.accPct = Math.round(accuracy() * 100)) + '%';
      if (state.cfg.mode === 'fit') drawFit(); else drawBoundary();
      drawLoss();
      if (state.cfg.showStep) {
        els.stepbox.querySelectorAll('.tr-phase').forEach(d => {
          d.classList.toggle('on', +d.dataset.p === state.phase);
        });
      }
    }

    function drawLoss() {
      const ctx = els.lossC.getContext('2d'), W = els.lossC.width, H = els.lossC.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#1a2030'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#8b96ad'; ctx.font = '12px sans-serif';
      ctx.fillText('loss 曲线', 8, 16);
      if (state.losses.length < 2) return;
      const L = state.losses, max = Math.max(...L), min = Math.min(...L);
      ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 1.5; ctx.beginPath();
      L.forEach((v, i) => {
        const x = i / (L.length - 1) * (W - 16) + 8;
        const y = H - 10 - (max === min ? 0.5 : (v - min) / (max - min)) * (H - 34);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.stroke();
    }

    function drawBoundary() {
      const ctx = els.main.getContext('2d'), S = els.main.width, R = state.data.range;
      ctx.fillStyle = '#141a28'; ctx.fillRect(0, 0, S, S);
      const model = state.model; model.training = false;
      const cell = 8, half = S / 2, scale = (S / 2 - 6) / R;
      for (let py = 0; py < S; py += cell) {
        for (let px = 0; px < S; px += cell) {
          const wx = (px - half) / scale, wy = (half - py) / scale;
          const t = model.forward([wx, wy]).data;
          const a = Math.min(1, Math.abs(t));
          ctx.fillStyle = t > 0 ? `rgba(96,165,250,${a * 0.55})` : `rgba(251,146,60,${a * 0.55})`;
          ctx.fillRect(px, py, cell, cell);
        }
      }
      drawPoints(ctx, half, scale);
    }

    function drawFit() {
      const ctx = els.main.getContext('2d'), S = els.main.width, R = 1.6;
      ctx.fillStyle = '#141a28'; ctx.fillRect(0, 0, S, S);
      const half = S / 2, scale = (S / 2 - 20) / R;
      const toPx = (x, y) => [half + x * scale, half - y * scale];
      // 数据点
      ctx.fillStyle = '#fbbf24';
      state.data.X.forEach((p, i) => { const [px, py] = toPx(p[0] * R * 0.8, state.data.y[i]); ctx.beginPath(); ctx.arc(px, py, 3, 0, 7); ctx.fill(); });
      // 目标线 y=3x+1（截断显示）
      ctx.strokeStyle = '#475569'; ctx.setLineDash([5, 5]); ctx.beginPath();
      const p1 = toPx(-0.55, 3 * -0.55 + 1), p2 = toPx(0.55, 3 * 0.55 + 1);
      ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.stroke(); ctx.setLineDash([]);
      // 当前拟合线
      const w = state.fitW.data, b = state.fitB.data;
      ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2.5; ctx.beginPath();
      const q1 = toPx(-1.2, w * -1.2 + b), q2 = toPx(1.2, w * 1.2 + b);
      ctx.moveTo(q1[0], q1[1]); ctx.lineTo(q2[0], q2[1]); ctx.stroke();
      ctx.fillStyle = '#8b96ad'; ctx.font = '12px sans-serif';
      ctx.fillText(`w = ${w.toFixed(2)}  (目标 3.00)`, 10, 20);
      ctx.fillText(`b = ${b.toFixed(2)}  (目标 1.00)`, 10, 36);
    }

    function drawPoints(ctx, half, scale) {
      state.data.X.forEach((p, i) => {
        ctx.fillStyle = state.data.y[i] > 0 ? '#93c5fd' : '#fdba74';
        ctx.beginPath(); ctx.arc(half + p[0] * scale, half - p[1] * scale, 3.4, 0, 7); ctx.fill();
        ctx.strokeStyle = '#0b0f1a'; ctx.lineWidth = 1; ctx.stroke();
      });
    }

    function stop() { state.running = false; if (state.timer) clearInterval(state.timer); state.phase = -1; renderAll(); }
    function emit(ev) { (state.listeners[ev] || []).forEach(f => f(state)); }
    function on(ev, f) { (state.listeners[ev] = state.listeners[ev] || []).push(f); }

    return { mount, reset, trainEpochs, stop, on, state };
  }

  return { create };
})();
