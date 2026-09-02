// chatcost.js — 多轮对话成本累计器（c23）
// 拖轮数/每轮输入/输出/单价，实时看"平方陷阱"：每轮费用与累计费用曲线。
export const ChatCost = (function () {
  'use strict';

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <label class="tr-slider">对话轮数 <output class="cc-n">10</output>
            <input type="range" class="cc-in" min="1" max="30" value="10"></label>
          <label class="tr-slider">每轮新输入（token）<output class="cc-i">100</output>
            <input type="range" class="cc-ii" min="20" max="600" step="20" value="100"></label>
          <label class="tr-slider">每轮输出（token）<output class="cc-o">50</output>
            <input type="range" class="cc-oi" min="10" max="300" step="10" value="50"></label>
          <label class="tr-slider">单价（$ / 1M token）<output class="cc-p">$3.0</output>
            <input type="range" class="cc-ip" min="2" max="150" value="30"></label>
          <div class="cc-table"></div>
        </div>
        <div class="ts-panel"><canvas class="cc-canvas" width="600" height="330"></canvas></div>
      </div>`;
    const $ = s => container.querySelector(s);
    const canvas = $('.cc-canvas');

    function render() {
      const n = +$('.cc-in').value, inp = +$('.cc-ii').value, outp = +$('.cc-oi').value;
      const price = +$('.cc-ip').value / 10;
      $('.cc-n').textContent = n; $('.cc-i').textContent = inp;
      $('.cc-o').textContent = outp; $('.cc-p').textContent = '$' + price.toFixed(1);

      // 每轮输入 = 之前全部历史 + 新输入；输出并入历史
      let hist = 0, totalIn = 0, totalOut = 0;
      const perRound = [], costs = [];
      for (let r = 1; r <= n; r++) {
        const roundIn = hist + inp;
        totalIn += roundIn; totalOut += outp;
        hist += inp + outp;
        perRound.push(roundIn);
        costs.push((totalIn + totalOut) * price / 1e6);
      }
      const totalCost = costs[n - 1];
      const linear = n * (inp + outp) * price / 1e6;

      $('.cc-table').innerHTML = `
        <div class="ld-row">总输入 token：<b>${totalIn.toLocaleString()}</b> ｜ 总输出：<b>${totalOut.toLocaleString()}</b></div>
        <div class="ld-row">总费用：<b>$${totalCost.toFixed(4)}</b>（若历史不重发只要 <b>$${linear.toFixed(4)}</b>）</div>
        <div class="ld-row dim">放大倍数 = ${n === 1 ? '1' : (totalCost / linear).toFixed(1) + '×'}——历史重发让成本随轮数近似平方增长。</div>`;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#10141f'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#8b96ad'; ctx.font = '12.5px -apple-system,"PingFang SC",sans-serif';
      ctx.fillText('每轮费用（柱）与累计费用（线）——注意柱子在变高', 20, 24);
      const maxP = Math.max(...perRound), maxC = totalCost || 1;
      perRound.forEach((p, i) => {
        const h = (p / maxP) * (canvas.height - 90);
        ctx.fillStyle = 'rgba(96,165,250,0.5)';
        ctx.fillRect(30 + i * ((canvas.width - 60) / n), canvas.height - 40 - h, Math.max(2, (canvas.width - 60) / n - 3), h);
      });
      ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.beginPath();
      costs.forEach((c, i) => {
        const x = 30 + (i + 0.5) * ((canvas.width - 60) / n);
        const y = canvas.height - 40 - (c / maxC) * (canvas.height - 80);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.stroke();
      ctx.fillStyle = '#8b96ad'; ctx.fillText('轮数 →', canvas.width - 70, canvas.height - 16);
      ctx.fillStyle = '#5eead4'; ctx.fillText('累计费用 $' + totalCost.toFixed(3), canvas.width - 170, 30);
    }
    container.querySelectorAll('input[type=range]').forEach(r => { r.oninput = render; });
    render();
    return {};
  }

  return { mount };
})();
