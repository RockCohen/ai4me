// kvcache.js — KV Cache 显存与计算量计算器（阶段 4 · c29）
// 以 GPT-2 小模型为"每 token 成本单位"，拖序列长度看：
// 有/无 KV cache 的注意力计算量差异 + KV cache 显存增长曲线。
export const KVSim = (function () {
  'use strict';

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <label class="tr-slider">生成到第 T 个 token（对数）<output class="kv-t">128</output>
            <input type="range" class="kv-in" min="10" max="1000" value="128"></label>
          <div class="kv-table"></div>
          <div class="ld-row dim">无缓存：每生成一个字都要把"全部历史"重新算一遍注意力 → 总计算量随 T² 爆炸。有缓存：历史的 K/V 存起来，新 token 只算自己的 Q → 每步代价恒定，代价是显存里的 KV cache 随 T 线性增长。</div>
        </div>
        <div class="ts-panel"><canvas class="kv-canvas" width="600" height="330"></canvas></div>
      </div>`;
    const $ = s => container.querySelector(s);
    const canvas = $('.kv-canvas');

    function render() {
      const T = Math.pow(10, +$('.kv-in').value / 250); // 10 ~ 55... 用 10^x/250: min 10^0.04≈1? 简化：直接用 value
      const t = +$('.kv-in').value * 4; // 40 ~ 4000 tokens
      $('.kv-t').textContent = t.toLocaleString();
      // 计算量（以注意力打分的"比较次数"计，任意单位）：无缓存 = n*(n+1)/2，有缓存 = n
      const noCache = t * (t + 1) / 2;
      const ratio = noCache / t;
      // KV 显存：以 7B 模型（32 层 × 4096 通道、fp16）为例：每 token 2*32*4096*2B = 512KB
      const kvGb = t * 512 * 1024 / 1024 ** 3;
      $('.kv-table').innerHTML = `
        <div class="ld-row">T = ${t.toLocaleString()} 个 token 时：</div>
        <div class="ld-row">无缓存总计算量 ≈ <b>${noCache.toLocaleString()}</b> 单位</div>
        <div class="ld-row">有缓存总计算量 ≈ <b>${t.toLocaleString()}</b> 单位（省 ${Math.round(ratio / 2 * 2).toLocaleString()}×）</div>
        <div class="ld-row">KV cache 显存（7B 模型）≈ <b>${kvGb.toFixed(2)} GB</b>（fp16）</div>
        <div class="ld-row dim">这就是"上下文越长越贵"的数学来源，也是 PagedAttention 要治的病。</div>`;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#10141f'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width - 80, H = canvas.height - 70, x0 = 55, y0 = 40;
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.strokeRect(x0, y0, W, H);
      ctx.fillStyle = '#8b96ad'; ctx.font = '12px ui-monospace,monospace';
      ctx.fillText('累计计算量（对数坐标）', x0 + 8, 26);
      ctx.fillText('T', x0 + W / 2, canvas.height - 14);
      // 两条曲线：T 从 8 到 t
      const tMin = 8, tMax = Math.max(t, 64);
      const lx = tt => x0 + Math.log(tt / tMin) / Math.log(tMax / tMin) * W;
      const ly = v => y0 + H - Math.log(v) / Math.log(noCache || 2) * H;
      // 无缓存 O(n²)
      ctx.strokeStyle = '#fb923c'; ctx.lineWidth = 2; ctx.beginPath();
      for (let tt = tMin; tt <= tMax; tt *= 1.12) {
        const v = tt * (tt + 1) / 2;
        const X = lx(tt), Y = y0 + H - Math.min(1, Math.log(v) / Math.log(noCache)) * H;
        tt === tMin ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y);
      }
      ctx.stroke();
      // 有缓存 O(n)
      ctx.strokeStyle = '#5eead4'; ctx.beginPath();
      for (let tt = tMin; tt <= tMax; tt *= 1.12) {
        const X = lx(tt), Y = y0 + H - Math.min(1, Math.log(tt) / Math.log(noCache)) * H;
        tt === tMin ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y);
      }
      ctx.stroke();
      ctx.fillStyle = '#fb923c'; ctx.fillText('无 KV cache：O(T²)', x0 + 14, y0 + 22);
      ctx.fillStyle = '#5eead4'; ctx.fillText('有 KV cache：O(T)', x0 + 14, y0 + 40);
    }
    $('.kv-in').oninput = render;
    render();
    return {};
  }

  return { mount };
})();
