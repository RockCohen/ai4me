// quiz.js — 预测题组件：先预测 → 揭示 → 记录
// item: {code?, q, kind:'choice'|'number'|'text', options?, answer?, tol?, why}
export const Quiz = (function () {
  'use strict';

  function storeKey(chapterId) { return 'llm-journey-quiz-' + chapterId; }

  function mount(container, chapterId, items) {
    const done = JSON.parse(localStorage.getItem(storeKey(chapterId)) || '{}');
    container.innerHTML = '';
    let correctCount = 0, answered = 0;

    items.forEach((item, qi) => {
      const card = document.createElement('div');
      card.className = 'quiz-card';
      const head = document.createElement('div');
      head.className = 'quiz-head';
      head.innerHTML = `<span class="quiz-no">Q${qi + 1}</span><span class="quiz-q">${item.q}</span>`;
      card.appendChild(head);
      if (item.code) {
        const pre = document.createElement('pre');
        pre.className = 'quiz-code';
        pre.textContent = item.code;
        card.appendChild(pre);
      }

      const area = document.createElement('div');
      area.className = 'quiz-area';
      card.appendChild(area);

      function renderAnswerUI() {
        area.innerHTML = '';
        if (item.kind === 'choice') {
          item.options.forEach(opt => {
            const b = document.createElement('button');
            b.className = 'quiz-opt';
            b.textContent = opt.t;
            b.onclick = () => judge(opt.correct, opt.t);
            area.appendChild(b);
          });
        } else if (item.kind === 'number') {
          const inp = document.createElement('input');
          inp.type = 'text'; inp.inputMode = 'decimal'; inp.placeholder = '输入数值预测';
          const b = document.createElement('button');
          b.textContent = '提交预测'; b.className = 'primary';
          b.onclick = () => {
            const v = parseFloat(inp.value);
            if (isNaN(v)) { inp.classList.add('shake'); return; }
            judge(Math.abs(v - item.answer) <= (item.tol ?? 1e-6), '你预测 ' + v);
          };
          area.appendChild(inp); area.appendChild(b);
          inp.addEventListener('keydown', e => { if (e.key === 'Enter') b.click(); });
        } else {
          const ta = document.createElement('textarea');
          ta.placeholder = '先写下你的预测/解释（写完再揭示）';
          const b = document.createElement('button');
          b.textContent = '揭示答案'; b.className = 'primary';
          b.onclick = () => judge(null, ta.value.trim() || '（未写）');
          area.appendChild(ta); area.appendChild(b);
        }
      }

      function judge(correct, given) {
        answered++;
        const isRevealOnly = correct === null;
        const right = correct === true;
        if (!isRevealOnly && right) correctCount++;
        area.innerHTML = `
          <div class="quiz-verdict ${isRevealOnly ? '' : right ? 'good' : 'bad'}">
            ${isRevealOnly ? '答案揭晓' : right ? '✓ 预测正确' : '✗ 与实际不符'}　<i>${escapeHtml(given)}</i>
          </div>
          <div class="quiz-why">${item.why}</div>
          <button class="quiz-retry">↺ 再试一次</button>`;
        area.querySelector('.quiz-retry').onclick = renderAnswerUI;
        card.classList.add(isRevealOnly ? 'revealed' : right ? 'right' : 'wrong');
        save();
      }

      function save() {
        done[qi] = { answered: true, pass: card.classList.contains('right') };
        localStorage.setItem(storeKey(chapterId), JSON.stringify(done));
        updateSummary();
      }
      renderAnswerUI();
      container.appendChild(card);
    });

    const summary = document.createElement('div');
    summary.className = 'quiz-summary';
    container.appendChild(summary);
    function updateSummary() {
      const a = container.querySelectorAll('.quiz-card.right').length;
      const t = items.length;
      summary.textContent = `本轮：${t} 题中一次预测正确 ${a} 题` + (a === t ? ' 🎉' : '（错题用"再试一次"，并让 AI 出同款变体）');
    }
    updateSummary();
  }

  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  return { mount };
})();
