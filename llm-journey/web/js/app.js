// app.js — 课程平台骨架：侧栏路由、双视图（阅读/模拟器）、进度记录
import katex from 'katex';
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css';
import { CHAPTERS } from './chapters.js';
import { Quiz } from './quiz.js';
import { TensorSim } from './tensorsim.js';
import { AutogradSim } from './autogradsim.js';
import { Trainer } from './trainer.js';
import { TensorLadder } from './ladder.js';
import { AttentionSim } from './attention.js';
import { SamplerSim } from './sampler.js';
import { TokenizerSim } from './tokenizer.js';
import { ShapeSim } from './shapes.js';
import { LoRASim } from './lora.js';
import { QuantSim } from './quant.js';
import { MoESim } from './moe.js';
import { KVSim } from './kvcache.js';
import { RAGSim } from './rag.js';
import { MNISTSim } from './mnistsim.js';
import { GradeTool } from './gradetool.js';
import { LNCalc } from './lncalc.js';
import { ModelSim } from './modelsim.js';
import { PipelinePeek } from './pipelinepeek.js';
import { MaskView } from './maskview.js';
import { ChatCost } from './chatcost.js';
import { DSBuilder } from './dsbuilder.js';
import { CmdGen } from './cmdgen.js';
import { InferEst } from './inferest.js';
import { TopicPick } from './topicpick.js';
import { Delivery } from './delivery.js';
import { Anim } from './anim.js';

(function () {
  'use strict';

  const S_MAP = { c01: 'S1', c02: 'S1', c03: 'S2', c04: 'S2', c05: 'S2', c06: 'S3', c07: 'S3', c08: 'S4', c09: 'S7', c10: 'S6', c11: 'S7', c12: 'S8·S9', c13: 'S10', c14: 'S10', c15: 'S10', c16: 'S11', c17: 'S12·S13', c18: 'S13', c19: 'S17', c20: 'S17', c21: 'S18', c22: 'S19', c23: 'S20', c24: 'S22', c25: 'S23', c26: 'S24', c27: 'S25', c28: 'S26', c29: 'S27', c30: 'S28', c31: 'S29', c32: 'S30', c33: 'S31' };
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
        <h1>llm-journey · 互动课程</h1>
        <p class="sub">阶段 0–5 全旅程 —— 预备课 + 33 章递进，每章只加一个机制</p>
        <p>形式借鉴 <a href="https://github.com/shareAI-lab/learn-claude-code" target="_blank">learn-claude-code</a>：
        左侧章节按顺序学；每章有<b>阅读视图</b>（讲透一个机制 + 内嵌预测题）和<b>模拟器视图</b>（在浏览器里玩这个机制）。
        全部离线运行，进度存在本机浏览器里。</p>
        <p class="warn">模拟器是<b>预演</b>：真正的手感来自 Python 实战（<code>exercises/</code> 与 <code>tutor/</code>，
        场次安排见 <code>AI助学手册.md</code>）。学完一章 → 去对应场次动手 → 落库才算完成。</p>
        <button class="primary" id="start-btn">从预备课 c00 开始 →</button>
      </div>`;
    document.getElementById('start-btn').onclick = () => { location.hash = '#/c00'; };
  }

  // ---------- 章节页 ----------
  function renderChapter(main, ch) {
    main.innerHTML = `
      <div class="ch-head">
        <div class="ch-title-row">
          <h1>${ch.id} · ${ch.title}</h1>
          <span class="badge">${ch.mech}</span>
          <span class="badge s-badge">${ch.id === 'c00' ? '⏱ 预备课 · 约 10 分钟' : '场次 ' + (S_MAP[ch.id] || '')}</span>
        </div>
        <div class="tabs">
          <button class="tab active" data-tab="read">📖 阅读</button>
          ${ch.anim ? '<button class="tab" data-tab="anim">🎬 动画</button>' : ''}
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
      ${ch.anim ? '<div id="tab-anim" class="tabpane" style="display:none"></div>' : ''}
      ${ch.sim ? '<div id="tab-sim" class="tabpane" style="display:none"></div>' : ''}`;

    Quiz.mount(document.getElementById('quiz'), ch.id, ch.quiz);
    // 公式渲染：$...$ 行内，$$...$$ 独立成行（KaTeX，加载自本地 npm 依赖）
    renderMathInElement(document.getElementById('tab-read'), {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
      throwOnError: false,
    });

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
      if (pane) {
        const simHost = document.createElement('div');
        pane.appendChild(simHost);
        if (ch.sim.type === 'tensor') TensorSim.mount(simHost);
        else if (ch.sim.type === 'autograd') AutogradSim.mount(simHost);
        else if (ch.sim.type === 'ladder') TensorLadder.mount(simHost);
        else if (ch.sim.type === 'attention') AttentionSim.mount(simHost);
        else if (ch.sim.type === 'sampler') SamplerSim.mount(simHost);
        else if (ch.sim.type === 'tokenizer') TokenizerSim.mount(simHost);
        else if (ch.sim.type === 'shapes') ShapeSim.mount(simHost);
        else if (ch.sim.type === 'lora') LoRASim.mount(simHost);
        else if (ch.sim.type === 'quant') QuantSim.mount(simHost);
        else if (ch.sim.type === 'moe') MoESim.mount(simHost);
        else if (ch.sim.type === 'kvcache') KVSim.mount(simHost);
        else if (ch.sim.type === 'rag') RAGSim.mount(simHost);
        else if (ch.sim.type === 'mnist') MNISTSim.mount(simHost);
        else if (ch.sim.type === 'gradetool') GradeTool.mount(simHost);
        else if (ch.sim.type === 'lncalc') LNCalc.mount(simHost);
        else if (ch.sim.type === 'modelsim') ModelSim.mount(simHost);
        else if (ch.sim.type === 'pipelinepeek') PipelinePeek.mount(simHost);
        else if (ch.sim.type === 'maskview') MaskView.mount(simHost);
        else if (ch.sim.type === 'chatcost') ChatCost.mount(simHost);
        else if (ch.sim.type === 'dsbuilder') DSBuilder.mount(simHost);
        else if (ch.sim.type === 'cmdgen') CmdGen.mount(simHost);
        else if (ch.sim.type === 'inferest') InferEst.mount(simHost);
        else if (ch.sim.type === 'topicpick') TopicPick.mount(simHost);
        else if (ch.sim.type === 'delivery') Delivery.mount(simHost);
        else if (ch.sim.type === 'trainer') Trainer.create().mount(simHost, ch.sim.cfg);
        pane.querySelectorAll('.tr-wrap, .ag-wrap, .ts-wrap').forEach(w => { w.style.maxWidth = '980px'; });
      }
    }
    if (ch.anim) {
      const animPane = document.getElementById('tab-anim');
      if (animPane) {
        const animHost = document.createElement('div');
        animPane.appendChild(animHost);
        Anim.mount(animHost, ch.anim);
        animHost.querySelector('.ts-wrap').style.maxWidth = '980px';
      }
    }

    main.querySelectorAll('.tab').forEach(t => {
      t.onclick = () => {
        main.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        ['read', 'anim', 'sim'].forEach(name => {
          const el = document.getElementById('tab-' + name);
          if (el) el.style.display = t.dataset.tab === name ? '' : 'none';
        });
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
