// lora.js — LoRA 低秩分解探索器（阶段 3 · c24）
// 拖动 rank r 与通道 C，看"全参微调 vs LoRA"的参数量对比与几何直觉。
export const LoRASim = (function () {
  'use strict';

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <label class="tr-slider">权重矩阵通道 C <output class="lr-c">512</output>
            <input type="range" class="lr-inc" min="128" max="1024" step="128" value="512"></label>
          <label class="tr-slider">LoRA 秩 r <output class="lr-r">8</output>
            <input type="range" class="lr-inr" min="1" max="64" value="8"></label>
          <div class="lr-params"></div>
          <div class="ld-row dim">LoRA 的赌注：权重更新 ΔW 是"低秩"的——用两个瘦矩阵 B·A（r 很小）就能装下全部学习内容。</div>
        </div>
        <div class="ts-panel"><canvas class="lr-canvas" width="620" height="360"></canvas></div>
      </div>`;
    const $ = s => container.querySelector(s);
    const canvas = $('.lr-canvas');

    function render() {
      const C = +$('.lr-inc').value, r = +$('.lr-inr').value;
      $('.lr-c').textContent = C; $('.lr-r').textContent = r;
      const full = C * C, lora = 2 * C * r;
      const pct = (lora / full * 100);
      $('.lr-params').innerHTML = `
        <div class="ld-row">全参微调：<b>${(full / 1000).toFixed(0)}K</b> 参数（C×C）</div>
        <div class="ld-row">LoRA：<b>${(lora / 1000).toFixed(1)}K</b> 参数（C×r + r×C）＝ <b>${pct < 1 ? pct.toFixed(2) : pct.toFixed(1)}%</b></div>
        <div class="ld-row dim">真实规模感受：7B 模型全参微调要 ~56GB(fp16)，LoRA(r=16) 只训练 ~40M 参数，一张 16GB 显卡就行。</div>`;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#10141f'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      const S = 240, x0 = 300, y0 = 60;
      // 冻结的 W（灰色大方块）
      ctx.fillStyle = 'rgba(255,255,255,0.09)';
      ctx.fillRect(x0, y0, S, S);
      ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.strokeRect(x0, y0, S, S);
      // ΔW = B·A（青色小方块，大小按 r/C 比例）
      const s2 = Math.max(6, S * (r / C));
      ctx.fillStyle = 'rgba(94,234,212,0.55)';
      ctx.fillRect(x0 + S - s2 - 2, y0 + S - s2 - 2, s2, s2);
      ctx.fillStyle = '#dbe4f3'; ctx.font = '13px ui-monospace,monospace';
      ctx.fillText('W（冻结，不训练）', x0, y0 - 10);
      ctx.fillStyle = '#5eead4';
      ctx.fillText(`ΔW = B·A（可训练，秩 ${r}）`, x0 + S - s2, y0 + S + 18);
      // 左侧：A 与 B 两个瘦条
      const ax = 40, aw = 26, ah = Math.max(8, 240 * (r / C));
      ctx.fillStyle = 'rgba(124,184,255,0.5)';
      ctx.fillRect(ax, y0, aw, 240);           // A: C×r（竖瘦条）
      ctx.fillStyle = 'rgba(167,139,250,0.5)';
      ctx.fillRect(ax + aw + 12, y0 + 240 - ah, 240, aw); // B: r×C（横瘦条）
      ctx.fillStyle = '#8b96ad'; ctx.font = '12px ui-monospace,monospace';
      ctx.fillText(`A (C×${r})`, ax, y0 + 240 + 18);
      ctx.fillText(`B (${r}×C)`, ax + aw + 12, y0 - 8);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath(); ctx.moveTo(ax + aw, y0 + 120); ctx.lineTo(ax + aw + 12, y0 + 240 - ah / 2); ctx.stroke();
      label(ctx, 'A·B 相乘 → 得到 C×C 的 ΔW', 40, 40);
    }
    function label(ctx, t, x, y) { ctx.fillStyle = '#8b96ad'; ctx.font = '12.5px -apple-system,"PingFang SC",sans-serif'; ctx.fillText(t, x, y); }

    $('.lr-inc').oninput = render;
    $('.lr-inr').oninput = render;
    render();
    return {};
  }

  return { mount };
})();
