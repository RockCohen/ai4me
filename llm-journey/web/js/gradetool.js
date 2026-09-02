// gradetool.js — 脱稿验收工具（c12）
// 60 分钟倒计时 + 四环检查点 + 完成即提交。断 AI 演练的"考场计时器"。
export const GradeTool = (function () {
  'use strict';

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <div class="gt-timer">60:00</div>
          <div class="ag-btns">
            <button class="gt-start primary">▶ 开始计时</button>
            <button class="gt-reset">↺ 重置</button>
          </div>
          <div class="ag-title">附加题抽签（写完主脚本后）</div>
          <button class="gt-draw">🎲 抽一道</button>
          <div class="gt-bonus"></div>
        </div>
        <div class="ts-panel gt-panel">
          <div class="ag-title" style="padding:12px 16px 0">四环检查点（边写边勾）</div>
          <div class="gt-checks"></div>
        </div>
      </div>`;
    const $ = s => container.querySelector(s);
    let left = 3600, timer = null;

    $('.gt-start').onclick = () => {
      if (timer) { clearInterval(timer); timer = null; $('.gt-start').textContent = '▶ 继续'; return; }
      $('.gt-start').textContent = '⏸ 暂停';
      timer = setInterval(() => {
        left = Math.max(0, left - 1);
        const m = String(Math.floor(left / 60)).padStart(2, '0'), s = String(left % 60).padStart(2, '0');
        $('.gt-timer').textContent = `${m}:${s}`;
        if (left === 300) $('.gt-timer').classList.add('warn');
        if (left === 0) { clearInterval(timer); timer = null; $('.gt-bonus').innerHTML = '<b class="gt-timeup">⏰ 时间到！封笔，进入考官评审。</b>'; }
      }, 1000);
    };
    $('.gt-reset').onclick = () => {
      if (timer) { clearInterval(timer); timer = null; }
      left = 3600; $('.gt-timer').textContent = '60:00'; $('.gt-timer').classList.remove('warn');
      $('.gt-start').textContent = '▶ 开始计时'; $('.gt-bonus').innerHTML = '';
    };

    const BONUS = [
      '只加一行代码，把验证集准确率再提高一截',
      '你的 loss 曲线在哪一步最陡？解释原因',
      '给脚本加上可复现性（种子管理）',
      '把 batch size 翻倍，lr 要不要跟着调？试一下',
      '不用 CrossEntropyLoss，手写一个等价的损失',
    ];
    $('.gt-draw').onclick = () => {
      const b = BONUS[Math.floor(Math.random() * BONUS.length)];
      $('.gt-bonus').innerHTML = `<div class="gt-bonus-card">附加题：${b}</div>`;
    };

    const CHECKS = ['① 数据加载（DataLoader + transform）', '② 模型定义（nn.Sequential 或类）', '③ 训练循环（五件套一个不少）', '④ 验证集评估（model.eval() + 正确率）'];
    const box = $('.gt-checks');
    CHECKS.forEach(c => {
      const l = document.createElement('label');
      l.className = 'tr-bug';
      const cb = document.createElement('input'); cb.type = 'checkbox';
      cb.onchange = () => l.classList.toggle('ok', cb.checked);
      l.appendChild(cb); l.appendChild(document.createTextNode(c));
      box.appendChild(l);
    });
    return {};
  }

  return { mount };
})();
