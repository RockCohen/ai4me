// topicpick.js — 选题决策器（c31）
// 三道问题 → 推荐选题 + 四环计划表。
export const TopicPick = (function () {
  'use strict';

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <label class="ag-row">Q1 · 四环里你最想练哪一环？
            <select class="tp-q1">
              <option value="rag">检索（RAG）</option>
              <option value="local">部署与本地化</option>
              <option value="data">数据与微调</option>
            </select></label>
          <label class="ag-row">Q2 · 你的数据/知识是什么形态？
            <select class="tp-q2">
              <option value="docs">一堆文档（笔记/手册/网页）</option>
              <option value="style">有成型的写作样本</option>
              <option value="qa">能整理出问答对</option>
            </select></label>
          <label class="ag-row">Q3 · 对隐私/离线的要求？
            <select class="tp-q3">
              <option value="high">必须纯本地</option>
              <option value="low">可以调云端 API</option>
            </select></label>
          <button class="tp-go primary">给出推荐</button>
          <div class="tp-out"></div>
        </div>
        <div class="ts-panel tp-panel"><div class="tp-plan"></div></div>
      </div>`;
    const $ = s => container.querySelector(s);

    function recommend() {
      const q1 = $('.tp-q1').value, q2 = $('.tp-q2').value, q3 = $('.tp-q3').value;
      let pick, reason;
      if (q3 === 'high' || q1 === 'local') {
        pick = '本地知识库助手';
        reason = '隐私/离线约束 + 部署兴趣 → Ollama + RAG 纯本地方案，重心在部署与检索。';
      } else if (q1 === 'data' || q2 === 'style') {
        pick = '风格模仿写作模型';
        reason = '想练数据与微调，且有成型样本 → 自建语料 + LoRA，重心在数据质量。';
      } else {
        pick = '领域问答机器人';
        reason = '检索兴趣 + 可用云端 → 微调(可选) + RAG 全家桶，覆盖面最广。';
      }
      const plans = {
        '领域问答机器人': ['爬/整理领域文档 → 切块入库', 'bge embedding + 向量检索 top-3', '微调（可选）定风格；生成时拼 RAG', 'FastAPI /chat + 简单页面'],
        '本地知识库助手': ['Ollama 拉 7B Q4 模型', '文档切块 + 本地向量库', '检索拼 prompt → Ollama 生成', '本地页面 + 隐私说明'],
        '风格模仿写作模型': ['收集/清洗写作样本 → 指令数据', 'MLX LoRA 微调 1.5B（c25 账本先算）', '采样参数调优（c18 旋钮）', '写作页 + 效果对比'],
      }[pick];
      $('.tp-out').innerHTML = `<div class="ld-name">推荐：${pick}</div><div class="ld-row dim">${reason}</div>`;
      $('.tp-plan').innerHTML = `
        <div class="ag-title" style="padding:12px 16px 0">四环计划（第一天就把第 1 环做完）</div>
        ${plans.map((s, i) => `<div class="tp-step"><b>环 ${i + 1}</b>　${s}</div>`).join('')}
        <div class="tp-step"><b>交付</b>　README 五要素 + ≤2 分钟演示视频 + 十分钟复现测试</div>`;
    }
    $('.tp-go').onclick = recommend;
    recommend();
    return {};
  }

  return { mount };
})();
