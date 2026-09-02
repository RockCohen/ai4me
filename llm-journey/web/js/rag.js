// rag.js — RAG 检索骨架可视化（阶段 5 · c32）
// 迷你知识库（4 段文档）+ 查询 → 字符 bigram 重合度打分 → top-1/2 检索 → 拼进 prompt。
// 展示 RAG 的机制骨架：不靠模型"记住"，靠"先查再答"。
export const RAGSim = (function () {
  'use strict';

  const DOCS = [
    { t: 'FreeToken 是边缘原生的 MoE 推理引擎，只支持 RTX 30/40/50 系显卡，论文编号 arXiv:2608.16157。', src: '笔记·推理系统' },
    { t: 'MCP 是 Model Context Protocol 的缩写，让模型以标准接口调用外部工具与数据源。', src: '笔记·工具协议' },
    { t: '本项目作者是 Cohen，设备为 Apple M2 Pro（16GB 统一内存），学习仓库名为 llm-journey。', src: '个人档案' },
    { t: '梯度检查（gradcheck）用数值差分验证解析梯度，是核对自研自动微分引擎的标准手段。', src: '笔记·阶段0' },
  ];
  const QUERIES = ['FreeToken 在什么显卡上跑？', '作者是谁？用的什么电脑？', '什么是 MCP？', '怎么验证自己写的反向传播？'];

  function bigrams(s) {
    const t = s.toLowerCase().replace(/\s+/g, '');
    const set = new Set();
    for (let i = 0; i < t.length - 1; i++) set.add(t.slice(i, i + 2));
    for (const c of t) set.add(c);
    return set;
  }
  function score(a, b) {
    const A = bigrams(a), B = bigrams(b);
    let inter = 0;
    A.forEach(x => { if (B.has(x)) inter++; });
    return inter / Math.max(1, Math.min(A.size, B.size) * 0.9);
  }

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <label class="ag-row">查询（或点下方预设）<input class="rag-q" value="${QUERIES[0]}"></label>
          <div class="ag-btns">
            <button class="rag-go primary">🔍 检索</button>
          </div>
          <div class="rag-queries"></div>
          <label class="tr-slider">取前 k 篇 <output class="rag-kout">1</output>
            <input type="range" class="rag-k" min="1" max="4" value="1"></label>
          <div class="rag-prompt"></div>
        </div>
        <div class="ts-panel"><div class="rag-docs"></div></div>
      </div>`;
    const $ = s => container.querySelector(s);

    const qb = $('.rag-queries');
    qb.innerHTML = '<div class="ag-title">预设查询</div>';
    QUERIES.forEach(q => {
      const b = document.createElement('button');
      b.className = 'ag-preset'; b.textContent = q;
      b.onclick = () => { $('.rag-q').value = q; run(); };
      qb.appendChild(b);
    });

    function run() {
      const q = $('.rag-q').value || ' ';
      const k = +$('.rag-k').value;
      $('.rag-kout').textContent = k;
      const scored = DOCS.map((d, i) => ({ ...d, i, s: Math.min(1, score(q, d.t)) }))
        .sort((a, b) => b.s - a.s);
      const docsEl = $('.rag-docs');
      docsEl.innerHTML = '<div class="ag-title" style="padding:10px 14px 0">知识库（4 段文档，按与查询的重合度着色）</div>';
      scored.forEach((d, rank) => {
        const picked = rank < k;
        const div = document.createElement('div');
        div.className = 'rag-doc' + (picked ? ' picked' : '');
        div.innerHTML = `
          <div class="rag-doc-head">
            <span>${d.src}</span>
            <span>${picked ? `<b class="rag-hit">已拼入 prompt（第 ${rank + 1} 名，相关度 ${(d.s * 100).toFixed(0)}%）</b>` : `相关度 ${(d.s * 100).toFixed(0)}%`}</span>
          </div>
          <div class="rag-doc-body">${d.t}</div>`;
        docsEl.appendChild(div);
      });
      const ctxDocs = scored.slice(0, k).map(d => `【${d.src}】${d.t}`).join('\n');
      $('.rag-prompt').innerHTML = `
        <div class="ag-title">拼装后的 prompt（交给模型的部分）</div>
        <pre class="ts-code">背景资料：
${ctxDocs}

问题：${q}
请仅依据背景资料回答。</pre>`;
    }
    $('.rag-go').onclick = run;
    $('.rag-k').oninput = run;
    $('.rag-q').addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
    run();
    return {};
  }

  return { mount };
})();
