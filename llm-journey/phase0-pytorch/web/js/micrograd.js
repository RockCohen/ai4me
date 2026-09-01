// micrograd.js — 浏览器版自动微分引擎（JS 移植 karpathy/micrograd）
// 与你在 exercises/02_micrograd/ 里要写的 Python 版一一对应。
// 额外提供：表达式解析器（教学用）与 SVG 计算图渲染器。
export const MG = (function () {
  'use strict';

  class Value {
    constructor(data, children = [], op = '') {
      this.data = data;
      this.grad = 0;
      this._backward = () => {};
      this._prev = new Set(children);
      this._op = op;
      this.label = '';
    }
    static wrap(v) { return v instanceof Value ? v : new Value(v); }

    add(other) {
      other = Value.wrap(other);
      const out = new Value(this.data + other.data, [this, other], '+');
      out._backward = () => { this.grad += out.grad; other.grad += out.grad; };
      return out;
    }
    mul(other) {
      other = Value.wrap(other);
      const out = new Value(this.data * other.data, [this, other], '*');
      out._backward = () => { this.grad += other.data * out.grad; other.grad += this.data * out.grad; };
      return out;
    }
    pow(k) {
      const out = new Value(Math.pow(this.data, k), [this], '**' + k);
      out._backward = () => { this.grad += k * Math.pow(this.data, k - 1) * out.grad; };
      return out;
    }
    sub(other) { return this.add(Value.wrap(other).mul(-1)); }
    div(other) { return this.mul(Value.wrap(other).pow(-1)); }
    neg() { return this.mul(-1); }
    tanh() {
      const t = Math.tanh(this.data);
      const out = new Value(t, [this], 'tanh');
      out._backward = () => { this.grad += (1 - t * t) * out.grad; };
      return out;
    }
    relu() {
      const out = new Value(this.data > 0 ? this.data : 0, [this], 'relu');
      out._backward = () => { this.grad += (this.data > 0 ? 1 : 0) * out.grad; };
      return out;
    }
    exp() {
      const e = Math.exp(this.data);
      const out = new Value(e, [this], 'exp');
      out._backward = () => { this.grad += e * out.grad; };
      return out;
    }
    topo() {
      const topo = [], seen = new Set();
      (function build(v) {
        if (seen.has(v)) return;
        seen.add(v);
        v._prev.forEach(build);
        topo.push(v);
      })(this);
      return topo;
    }
    backward() {
      const topo = this.topo();
      this.grad = 1;
      for (let i = topo.length - 1; i >= 0; i--) topo[i]._backward();
      return topo; // 返回拓扑序供动画使用
    }
    zeroGrad() { this.topo().forEach(v => { v.grad = 0; }); }
  }

  // ---------- 表达式解析器（白名单：数字 / 标识符 / + - * / ** ( ) / tanh relu exp） ----------
  function tokenize(src) {
    const tokens = [];
    const re = /\s*(\*\*|[+\-*/(),]|[A-Za-z_]\w*|\d+\.?\d*)/y;
    let i = 0;
    while (i < src.length) {
      re.lastIndex = i;
      const m = re.exec(src);
      if (!m) throw new Error('无法识别的字符："' + src[i] + '"');
      tokens.push(m[1]);
      i = re.lastIndex;
    }
    return tokens;
  }

  function parseExpr(src, vars) {
    const tokens = tokenize(src);
    let pos = 0;
    const peek = () => tokens[pos];
    const next = () => tokens[pos++];

    function expr() {
      let node = term();
      while (peek() === '+' || peek() === '-') {
        const op = next();
        node = op === '+' ? node.add(term()) : node.sub(term());
      }
      return node;
    }
    function term() {
      let node = unary();
      while (peek() === '*' || peek() === '/') {
        const op = next();
        node = op === '*' ? node.mul(unary()) : node.div(unary());
      }
      return node;
    }
    function unary() {
      if (peek() === '-') { next(); return unary().neg(); }
      return power();
    }
    function power() {
      const base = primary();
      if (peek() === '**') { next(); return base.pow(Number(unary().data)); }
      return base;
    }
    function primary() {
      const t = next();
      if (t === undefined) throw new Error('表达式不完整');
      if (t === '(') { const e = expr(); if (next() !== ')') throw new Error('缺少右括号'); return e; }
      if (/^\d/.test(t)) return new Value(parseFloat(t));
      if (/^[A-Za-z_]\w*$/.test(t)) {
        if (['tanh', 'relu', 'exp'].includes(t)) {
          if (next() !== '(') throw new Error(t + ' 后面应有 (');
          const arg = expr();
          if (next() !== ')') throw new Error('缺少右括号');
          return arg[t]();
        }
        if (!(t in vars)) throw new Error('未知变量 "' + t + '"（先在下方赋值）');
        return vars[t];
      }
      throw new Error('意外的符号 "' + t + '"');
    }
    const root = expr();
    if (pos !== tokens.length) throw new Error('表达式末尾有多余内容 "' + tokens[pos] + '"');
    return root;
  }

  // ---------- SVG 计算图渲染 ----------
  // 布局：按最长路径深度分层，从左到右。返回 {svg, order}
  function renderGraph(root, svgEl) {
    const topo = root.topo();
    const depth = new Map();
    (function assign(v) {
      if (depth.has(v)) return depth.get(v);
      let d = 0;
      v._prev.forEach(c => { d = Math.max(d, assign(c) + 1); });
      depth.set(v, d);
      return d;
    })(root);

    const layers = new Map();
    topo.forEach(v => {
      const d = depth.get(v);
      if (!layers.has(d)) layers.set(d, []);
      layers.get(d).push(v);
    });

    const maxDepth = Math.max(...layers.keys());
    const maxPerLayer = Math.max(...[...layers.values()].map(a => a.length));
    const W = 150, H = 92, PADX = 60, PADY = 34;
    const width = PADX * 2 + (maxDepth + 1) * W;
    const height = PADY * 2 + maxPerLayer * H;
    svgEl.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svgEl.setAttribute('width', Math.min(width, 1100));
    svgEl.innerHTML = '';

    const pos = new Map();
    layers.forEach((nodes, d) => {
      nodes.forEach((v, i) => {
        const x = PADX + d * W, y = PADY + i * H + (maxPerLayer - nodes.length) * H / 2;
        pos.set(v, { x, y });
      });
    });

    // 边
    topo.forEach(v => {
      v._prev.forEach(c => {
        const p = pos.get(c), q = pos.get(v);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const mx = (p.x + q.x) / 2 + W * 0.38;
        path.setAttribute('d', `M${p.x + W * 0.46},${p.y + H / 2} C${mx},${p.y + H / 2} ${mx},${q.y + H / 2} ${q.x + W * 0.54 - 4},${q.y + H / 2}`);
        path.setAttribute('class', 'mg-edge');
        path.dataset.from = topo.indexOf(c);
        path.dataset.to = topo.indexOf(v);
        svgEl.appendChild(path);
      });
    });
    // 节点
    topo.forEach((v, idx) => {
      const { x, y } = pos.get(v);
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'mg-node');
      g.dataset.idx = idx;
      const name = v.label || (v._op ? v._op : '?');
      g.innerHTML =
        `<rect x="${x}" y="${y}" width="${W * 0.92}" height="${H * 0.72}" rx="10"/>` +
        `<text x="${x + W * 0.46}" y="${y + 20}" class="mg-op">${escapeHtml(String(name))}</text>` +
        `<text x="${x + W * 0.46}" y="${y + 40}" class="mg-data">data ${fmt(v.data)}</text>` +
        `<text x="${x + W * 0.46}" y="${y + 58}" class="mg-grad">grad ${fmt(v.grad)}</text>`;
      svgEl.appendChild(g);
    });
    return { order: topo };
  }

  function fmt(n) {
    if (!isFinite(n)) return String(n);
    const a = Math.abs(n);
    if (a !== 0 && (a < 0.001 || a >= 100000)) return n.toExponential(1);
    return String(Math.round(n * 1000) / 1000);
  }
  function escapeHtml(s) { return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  return { Value, parseExpr, renderGraph, fmt };
})();
