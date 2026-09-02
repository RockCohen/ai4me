// quant.js — 量化显存账本计算器（阶段 3 · c25）
// 拖动模型规模，实时对比 FP16 / INT8 / 4-bit 三种量化下的显存占用，
// 并按 16GB 统一内存给出"能不能跑"的判定。
export const QuantSim = (function () {
  'use strict';

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <label class="tr-slider">模型规模（对数）<output class="qt-p">7B</output>
            <input type="range" class="qt-in" min="9" max="70" value="10"></label>
          <div class="qt-table"></div>
          <div class="ld-row dim">账本规则：显存 ≈ 参数量 × 每参数字节数 + 10~20% 开销（激活/框架）。QLoRA = 4-bit 冻结基座 + LoRA 小adapter，所以"16GB 微调 7B"才成立。</div>
        </div>
        <div class="ts-panel"><canvas class="qt-canvas" width="600" height="330"></canvas></div>
      </div>`;
    const $ = s => container.querySelector(s);
    const canvas = $('.qt-canvas');

    function render() {
      const B = Math.pow(10, +$('.qt-in').value / 10); // 0.8B ~ 10B... 实际范围 1~10
      const params = B * 1e9;
      const label = params >= 1e9 ? (params / 1e9).toFixed(1) + 'B' : (params / 1e6).toFixed(0) + 'M';
      $('.qt-p').textContent = label;
      const rows = [
        { name: 'FP16', bytes: 2 },
        { name: 'INT8', bytes: 1 },
        { name: '4-bit', bytes: 0.5 },
      ].map(r => ({ ...r, gb: params * r.bytes / 1024 ** 3 * 1.18 })); // 18% 开销

      $('.qt-table').innerHTML = rows.map(r => {
        const ok = r.gb < 12 ? '✅ 流畅' : r.gb < 15 ? '⚠️ 勉强' : '❌ 放不下（16GB 机型）';
        return `<div class="ld-row">${r.name}：<b>${r.gb.toFixed(1)} GB</b>　${ok}</div>`;
      }).join('') + `<div class="ld-row dim">判定基于 16GB 统一内存（Mac），预留 ~4GB 给系统与激活。</div>`;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#10141f'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      const maxGb = Math.max(...rows.map(r => r.gb), 1);
      rows.forEach((r, i) => {
        const bw = (r.gb / maxGb) * (canvas.width - 180);
        const y = 60 + i * 84;
        const colors = ['rgba(251,146,60,0.8)', 'rgba(124,184,255,0.8)', 'rgba(94,234,212,0.8)'];
        ctx.fillStyle = colors[i];
        ctx.fillRect(130, y, Math.max(bw, 4), 44);
        ctx.fillStyle = '#dbe4f3'; ctx.font = '14px ui-monospace,monospace';
        ctx.fillText(r.name, 60, y + 27);
        ctx.fillStyle = '#e6edf8';
        ctx.fillText(r.gb >= 10 ? r.gb.toFixed(0) + ' GB' : r.gb.toFixed(1) + ' GB', 140 + Math.max(bw, 4) + 8, y + 27);
      });
      ctx.fillStyle = '#8b96ad'; ctx.font = '12.5px -apple-system,"PingFang SC",sans-serif';
      ctx.fillText(`同一份 ${label} 参数，量化决定它住多大的房子`, 60, 34);
      // 16GB 参考线
      const scaleMax = maxGb;
      const x16 = 130 + (12 / scaleMax) * (canvas.width - 180);
      if (x16 < canvas.width - 10) {
        ctx.strokeStyle = '#ff8080'; ctx.setLineDash([6, 5]);
        ctx.beginPath(); ctx.moveTo(x16, 40); ctx.lineTo(x16, canvas.height - 20); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#ff8080'; ctx.fillText('16GB 上限', x16 - 34, canvas.height - 4);
      }
    }
    $('.qt-in').oninput = render;
    render();
    return {};
  }

  return { mount };
})();
