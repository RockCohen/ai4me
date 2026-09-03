// inferest.js — 推理估算器（c30）
// 选后端 + 拖上下文长度/并发，估算 tokens/s 与显存占用。
// ⚠️ 数字是经验量级的估算（本机实测见 S28），用于建立"预算直觉"。
export const InferEst = (function () {
  'use strict';

  const BACKENDS = {
    local: { name: '本机 M2 Pro（Ollama, 7B Q4）', base: 12, kvPerTokMB: 0.5, memModel: 4.7, ctxNote: 8192 },
    colab: { name: 'Colab T4（vLLM, 7B fp16）', base: 38, kvPerTokMB: 0.5, memModel: 15.2, ctxNote: 8192 },
  };

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <div class="ag-title">后端</div>
          <div class="ag-btns">
            <button class="ie-local primary">本机 M2 Pro</button>
            <button class="ie-colab">Colab T4</button>
          </div>
          <label class="tr-slider">上下文长度 <output class="ie-ctx">2048</output> token
            <input type="range" class="ie-ictx" min="512" max="16384" step="512" value="2048"></label>
          <label class="tr-slider">并发请求数 <output class="ie-conc">1</output>
            <input type="range" class="ie-iconc" min="1" max="32" value="1"></label>
          <div class="ie-out"></div>
          <div class="ld-row dim">⚠️ 估算值（基于 7B 模型的经验量级），用于建立预算直觉；真实数字以 S28 实测为准。</div>
        </div>
        <div class="ts-panel"><canvas class="ie-canvas" width="600" height="330"></canvas></div>
      </div>`;
    const $ = s => container.querySelector(s);
    const canvas = $('.ie-canvas');
    let backend = 'local';

    function render() {
      const ctxLen = +$('.ie-ictx').value;
      const conc = +$('.ie-iconc').value;
      $('.ie-ctx').textContent = ctxLen.toLocaleString();
      const b = BACKENDS[backend];
      // 速度：单请求基础速度，随并发分摊（带宽竞争）+ 长上下文注意力开销
      const perReq = b.base / (1 + (conc - 1) * 0.6) * (2048 / (2048 + ctxLen * 0.5));
      const throughput = perReq * conc;
      const kvGb = b.kvPerTokMB * ctxLen * conc / 1024;
      const totalMem = b.memModel + kvGb;
      const fits = totalMem < (backend === 'local' ? 12 : 14);

      $('.ie-out').innerHTML = `
        <div class="ld-row">单请求速度 ≈ <b>${perReq.toFixed(1)} tok/s</b></div>
        <div class="ld-row">总吞吐 ≈ <b>${throughput.toFixed(0)} tok/s</b>（${conc} 路并发）</div>
        <div class="ld-row">模型 + KV cache ≈ <b>${totalMem.toFixed(1)} GB</b> ${fits ? '✅ 放得下' : '❌ 超出（降并发/上下文，或上量化）'}</div>
        <div class="ld-row dim">KV cache = ${kvGb.toFixed(2)} GB（0.5MB/token × ${ctxLen.toLocaleString()} token × ${conc} 路）</div>`;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#10141f'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      // KV cache 随上下文线性增长
      ctx.fillStyle = '#8b96ad'; ctx.font = '12.5px -apple-system,"PingFang SC",sans-serif';
      ctx.fillText('KV cache 显存随上下文线性增长（当前并发 ' + conc + ' 路）', 30, 26);
      const maxCtx = 8192;
      const barMax = (canvas.width - 80);
      for (let c = 512; c <= maxCtx; c += 512) {
        const g = b.kvPerTokMB * c * conc / 1024;
        const x = 40 + (c / maxCtx) * barMax;
        ctx.fillStyle = g > 12 - b.memModel ? 'rgba(255,128,128,0.7)' : 'rgba(94,234,212,0.6)';
        ctx.fillRect(x, 60, barMax / (maxCtx / 512) - 4, 60);
        if (c % 2048 === 0) { ctx.fillStyle = '#8b96ad'; ctx.fillText((c / 1024) + 'K', x - 6, 140); }
      }
      ctx.fillStyle = '#dbe4f3'; ctx.font = '12px ui-monospace,monospace';
      ctx.fillText(`当前 ${ctxLen.toLocaleString()} token × ${conc} 路 = ${kvGb.toFixed(2)} GB`, 40, 180);
      ctx.strokeStyle = '#ff8080'; ctx.setLineDash([6, 5]);
      const budget = 12 - b.memModel;
      const xb = Math.max(46, 40 + Math.min(1, budget / (b.kvPerTokMB * maxCtx * conc / 1024)) * barMax);
      ctx.beginPath(); ctx.moveTo(xb, 50); ctx.lineTo(xb, 140); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#ff8080'; ctx.fillText('预算上限', xb - 24, 164);
    }
    $('.ie-local').onclick = () => { backend = 'local'; $('.ie-local').classList.add('primary'); $('.ie-colab').classList.remove('primary'); render(); };
    $('.ie-colab').onclick = () => { backend = 'colab'; $('.ie-colab').classList.add('primary'); $('.ie-local').classList.remove('primary'); render(); };
    container.querySelectorAll('input[type=range]').forEach(r => { r.oninput = render; });
    render();
    return {};
  }

  return { mount };
})();
