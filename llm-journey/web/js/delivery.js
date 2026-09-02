// delivery.js — 交付检查单 + 复现计时器（c33）
// README 五要素逐项检查 + "十分钟复现"计时器——最后一公里的验收工具。
export const Delivery = (function () {
  'use strict';

  const ITEMS = [
    ['README · 动机', '为什么做这个项目？两句话说清。'],
    ['README · 数据', '来源、规模、清洗方式，脚本可复现。'],
    ['README · 方法', '关键技术选型与取舍理由。'],
    ['README · 效果对比', '前后/基线对比，有具体例子。'],
    ['README · 已知限制', '诚实列出边界——最加分的一条。'],
    ['快速开始', '克隆 → 安装 → 一条命令跑起，全部可复制。'],
    ['演示视频', '≤2 分钟，录屏 + 旁白，挂在 README 顶部。'],
    ['提交历史', '小步 commit，能看出演进过程。'],
  ];

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <div class="ag-title">⏱ 十分钟复现测试</div>
          <div class="dv-timer">10:00</div>
          <div class="ag-btns">
            <button class="dv-start primary">▶ 朋友开始克隆了</button>
            <button class="dv-reset">↺</button>
          </div>
          <div class="ld-row dim">只给朋友 README 和仓库链接，开始计时。超时 = README 有 bug，卡点即修改清单。</div>
        </div>
        <div class="ts-panel dv-panel">
          <div class="ag-title" style="padding:12px 16px 0">交付检查单（逐项打勾）</div>
          <div class="dv-checks"></div>
          <div class="dv-score"></div>
        </div>
      </div>`;
    const $ = s => container.querySelector(s);
    let left = 600, timer = null;

    $('.dv-start').onclick = () => {
      if (timer) { clearInterval(timer); timer = null; $('.dv-start').textContent = '▶ 继续'; return; }
      $('.dv-start').textContent = '⏸ 暂停';
      timer = setInterval(() => {
        left = Math.max(0, left - 1);
        const m = String(Math.floor(left / 60)).padStart(2, '0'), s = String(left % 60).padStart(2, '0');
        $('.dv-timer').textContent = `${m}:${s}`;
        if (left === 0) { clearInterval(timer); timer = null; $('.dv-timer').classList.add('warn'); }
      }, 1000);
    };
    $('.dv-reset').onclick = () => {
      if (timer) { clearInterval(timer); timer = null; }
      left = 600; $('.dv-timer').textContent = '10:00'; $('.dv-timer').classList.remove('warn');
      $('.dv-start').textContent = '▶ 朋友开始克隆了';
    };

    const box = $('.dv-checks');
    ITEMS.forEach(([t, hint]) => {
      const l = document.createElement('label');
      l.className = 'tr-bug';
      const cb = document.createElement('input'); cb.type = 'checkbox';
      cb.onchange = () => { l.classList.toggle('ok', cb.checked); score(); };
      l.appendChild(cb);
      const span = document.createElement('span');
      span.innerHTML = `<b>${t}</b> — <i class="dim">${hint}</i>`;
      l.appendChild(span);
      box.appendChild(l);
    });
    function score() {
      const total = box.querySelectorAll('input').length;
      const done = box.querySelectorAll('input:checked').length;
      $('.dv-score').innerHTML = `<b>${done}/${total}</b>　${done === total ? '🎓 达到交付标准，录视频去！' : '还差 ' + (total - done) + ' 项'}`;
    }
    score();
    return {};
  }

  return { mount };
})();
