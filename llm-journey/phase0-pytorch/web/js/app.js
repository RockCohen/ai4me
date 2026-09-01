// app.js — 课程平台骨架：侧栏路由、双视图（阅读/模拟器）、进度记录
import { CHAPTERS } from './chapters.js';
import { Quiz } from './quiz.js';
import { TensorSim } from './tensorsim.js';
import { AutogradSim } from './autogradsim.js';
import { Trainer } from './trainer.js';

(function () {
  'use strict';

  const S_MAP = { c01: 'S1', c02: 'S1', c03: 'S2', c04: 'S2', c05: 'S2', c06: 'S3', c07: 'S3', c08: 'S4', c09: 'S7', c10: 'S6', c11: 'S7', c12: 'S8·S9' };
  const store = {
    get done() { return JSON.parse(localStorage.getItem('llm-journey-progress') || '{}'); },
    set(k, v) { const d = this.done; if (v) d[k] = 1; else delete d[k]; localStorage.setItem('llm-journey-progress', JSON.stringify(d)); },
  };

  const groups = [...new Set(CHAPTERS.map(c => c.group))];

  // ---------- 侧栏 ----------
  function renderSidebar() {
    const nav = document.getElementById('nav');
    nav.innerHTML = '';
    const home = document.createElement('a');
    home.className = 'nav-home'; home.href = '#/';
    home.innerHTML = '<b>llm-journey</b><span>阶段 0 · 互动课程</span>';
    nav.appendChild(home);
    groups.forEach(g => {
      const h = document.createElement('div');
      h.className = 'nav-group';
      h.textContent = g;
      nav.appendChild(h);
      CHAPTERS.filter(c => c.group === g).forEach(c => {
        const a = document.createElement('a');
        a.className = 'nav-item';
        a.href = '#/' + c.id;
        a.dataset.id = c.id;
        a.innerHTML = `<span class="nav-check">${store.done[c.id] ? '✓' : ''}</span> ${c.id} · ${c.title}`;
        nav.appendChild(a);
      });
    });
    highlight();
    const pct = Math.round(Object.keys(store.done).length / CHAPTERS.length * 100);
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-text').textContent = pct + '%';
  }
  function highlight() {
    document.querySelectorAll('.nav-item').forEach(a => {
      a.classList.toggle('active', a.dataset.id === route());
    });
  }

  // ---------- 路由 ----------
  function route() { return location.hash.replace(/^#\/?/, ''); }

  function render() {
    const main = document.getElementById('main');
    const id = route();
    renderSidebar();
    if (!id) { renderHome(main); return; }
    const ch = CHAPTERS.find(c => c.id === id);
    if (!ch) { renderHome(main); return; }
    renderChapter(main, ch);
  }

  // ---------- 主页 ----------
  function renderHome(main) {
    main.innerHTML = `
      <div class="hero">
        <h1>阶段 0 · 互动课程</h1>
        <p class="sub">PyTorch 基础 × micrograd 复现 —— 12 章递进，每章只加一个机制</p>
        <p>形式借鉴 <a href="https://github.com/shareAI-lab/learn-claude-code" target="_blank">learn-claude-code</a>：
        左侧章节按顺序学；每章有<b>阅读视图</b>（讲透一个机制 + 内嵌预测题）和<b>模拟器视图</b>（在浏览器里玩这个机制）。
        全部离线运行，进度存在本机浏览器里。</p>
        <p class="warn">模拟器是<b>预演</b>：真正的手感来自 Python 实战（<code>exercises/</code> 与 <code>tutor/</code>，
        场次安排见 <code>AI助学手册.md</code>）。学完一章 → 去对应场次动手 → 落库才算完成。</p>
        <button class="primary" id="start-btn">从 c01 开始 →</button>
      </div>`;
    document.getElementById('start-btn').onclick = () => { location.hash = '#/c01'; };
  }

  // ---------- 章节页 ----------
  function renderChapter(main, ch) {
    main.innerHTML = `
      <div class="ch-head">
        <div class="ch-title-row">
          <h1>${ch.id} · ${ch.title}</h1>
          <span class="badge">${ch.mech}</span>
          <span class="badge s-badge">场次 ${S_MAP[ch.id] || ''}</span>
        </div>
        <div class="tabs">
          <button class="tab active" data-tab="read">📖 阅读</button>
          ${ch.sim ? '<button class="tab" data-tab="sim">🧪 模拟器</button>' : ''}
        </div>
      </div>
      <div id="tab-read" class="tabpane">
        <div class="read">${ch.read}</div>
        <h3 class="quiz-title">预测题（先预测，再揭示）</h3>
        <div id="quiz"></div>
        <div class="ch-footer">
          <button id="done-btn"></button>
          <span class="ch-nav">
            ${prevNext(ch)}
          </span>
        </div>
      </div>
      ${ch.sim ? '<div id="tab-sim" class="tabpane" style="display:none"></div>' : ''}`;

    Quiz.mount(document.getElementById('quiz'), ch.id, ch.quiz);

    const doneBtn = document.getElementById('done-btn');
    function refreshDone() {
      const d = !!store.done[ch.id];
      doneBtn.textContent = d ? '✓ 已完成（点击取消）' : '标记本章完成';
      doneBtn.classList.toggle('is-done', d);
    }
    doneBtn.onclick = () => { store.set(ch.id, !store.done[ch.id]); refreshDone(); renderSidebar(); };
    refreshDone();

    if (ch.sim) {
      const pane = document.getElementById('tab-sim');
      const simHost = document.createElement('div');
      pane.appendChild(simHost);
      if (ch.sim.type === 'tensor') TensorSim.mount(simHost);
      else if (ch.sim.type === 'autograd') AutogradSim.mount(simHost);
      else if (ch.sim.type === 'trainer') Trainer.create().mount(simHost, ch.sim.cfg);
      pane.querySelectorAll('.tr-wrap, .ag-wrap, .ts-wrap').forEach(w => { w.style.maxWidth = '980px'; });
    }

    main.querySelectorAll('.tab').forEach(t => {
      t.onclick = () => {
        main.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        document.getElementById('tab-read').style.display = t.dataset.tab === 'read' ? '' : 'none';
        const sim = document.getElementById('tab-sim');
        if (sim) sim.style.display = t.dataset.tab === 'sim' ? '' : 'none';
      };
    });
  }

  function prevNext(ch) {
    const i = CHAPTERS.indexOf(ch);
    const parts = [];
    if (i > 0) parts.push(`<a href="#/${CHAPTERS[i - 1].id}">← ${CHAPTERS[i - 1].id}</a>`);
    if (i < CHAPTERS.length - 1) parts.push(`<a href="#/${CHAPTERS[i + 1].id}">${CHAPTERS[i + 1].id} →</a>`);
    return parts.join('　');
  }

  window.addEventListener('hashchange', render);
  render();
})();
