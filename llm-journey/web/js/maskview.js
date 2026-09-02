// maskview.js — 掩码视野对比器（c22）
// 同一句「北京 是 中国 的 首都」，遮住末词：
// BERT（双向）能看到全句上下文；GPT（因果）只能看前文。候选词随视野变化。
export const MaskView = (function () {
  'use strict';

  const TOKENS = ['北京', '是', '中国', '的', '？'];
  // 手工设计的候选：BERT 看到全句 → 强烈指向"首都"；GPT 只见前文 → 开放
  const CAND_BERT = [['首都', 82], ['心脏', 9], ['中心城市', 6], ['大城市', 3]];
  const CAND_GPT = [['最', 24], ['一座', 19], ['中国', 14], ['世界', 11], ['…开放候选', 32]];

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <div class="ag-title">模式</div>
          <div class="ag-btns">
            <button class="mv-bert primary">BERT · 双向（MLM）</button>
            <button class="mv-gpt">GPT · 单向（CLM）</button>
          </div>
          <div class="mv-info"></div>
          <div class="ld-row dim">网格 = 每个位置"能看见谁"：亮格可见，× 被掩码。注意力权重就是在这张"可见性地图"上算的。</div>
        </div>
        <div class="ts-panel"><canvas class="mv-canvas" width="560" height="330"></canvas></div>
      </div>`;
    const $ = s => container.querySelector(s);
    const canvas = $('.mv-canvas');
    let mode = 'bert';

    function render() {
      const causal = mode === 'gpt';
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#10141f'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      const T = TOKENS.length, cell = 52, x0 = 90, y0 = 50;
      ctx.font = '12px -apple-system,"PingFang SC",sans-serif';
      TOKENS.forEach((t, j) => { ctx.fillStyle = '#8b96ad'; ctx.textAlign = 'center'; ctx.fillText(t, x0 + j * cell + cell / 2, y0 - 8); });
      TOKENS.forEach((t, i) => { ctx.fillStyle = (i === 4 ? '#ffb86b' : '#8b96ad'); ctx.textAlign = 'right'; ctx.fillText(t, x0 - 8, y0 + i * cell + cell / 2 + 4); });
      ctx.textAlign = 'left';
      TOKENS.forEach((t, i) => {
        for (let j = 0; j < T; j++) {
          const visible = causal ? j <= i : true;
          const isQuery = i === 4;
          ctx.fillStyle = !visible ? 'rgba(255,255,255,0.03)'
            : (isQuery && (causal || j >= 0) ? 'rgba(94,234,212,0.22)' : 'rgba(96,165,250,0.14)');
          ctx.fillRect(x0 + j * cell, y0 + i * cell, cell - 3, cell - 3);
          if (!visible) { ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fillText('×', x0 + j * cell + cell / 2 - 4, y0 + i * cell + cell / 2 + 4); }
          if (isQuery) { ctx.strokeStyle = '#ffb86b'; ctx.strokeRect(x0 + j * cell, y0 + i * cell, cell - 3, cell - 3); }
        }
      });
      ctx.fillStyle = '#8b96ad';
      ctx.fillText('行 = 谁在看　列 = 看谁　（橙框 = 被遮的待预测位置）', x0, canvas.height - 14);

      const cand = causal ? CAND_GPT : CAND_BERT;
      $('.mv-info').innerHTML = `
        <div class="ld-name">${causal ? 'GPT 视角' : 'BERT 视角'}：填「${TOKENS[4]}」</div>
        <div class="ld-row dim">${causal
          ? '只看得见前文「北京 是 中国 的」——信息不足以锁定答案，候选开放且发散。'
          : '看得见全句（包括后面的句号边界）——上下文锁死语义，候选高度自信。'}</div>
        <div class="ld-row">候选概率：${cand.map(([w, p]) => `${w} ${p}%`).join('，')}</div>`;
    }
    $('.mv-bert').onclick = () => { mode = 'bert'; $('.mv-bert').classList.add('primary'); $('.mv-gpt').classList.remove('primary'); render(); };
    $('.mv-gpt').onclick = () => { mode = 'gpt'; $('.mv-gpt').classList.add('primary'); $('.mv-bert').classList.remove('primary'); render(); };
    render();
    return {};
  }

  return { mount };
})();
