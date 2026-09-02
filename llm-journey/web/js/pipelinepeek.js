// pipelinepeek.js — 推理流水线揭秘（c20）
// "pipeline 没有魔法"：输入一句话，逐步展示 分词 → 查表(bigram) → 采样 → 解码
// 四站的中间产物。用与 SamplerSim 相同的字符 bigram 语料。
export const PipelinePeek = (function () {
  'use strict';

  const CORPUS = '春天花会开，秋天叶会落。小鸟在枝头唱歌，风吹过湖面。山上有树，树下有草。花开花落，云卷云舒。';
  const CHARS = [...new Set(CORPUS)];

  function bigramNext(ch) {
    const counts = {};
    for (let i = 0; i < CORPUS.length - 1; i++) {
      if (CORPUS[i] === ch) counts[CORPUS[i + 1]] = (counts[CORPUS[i + 1]] || 0) + 1;
    }
    if (!Object.keys(counts).length) return { cand: '，', counts: { '，': 1 } };
    return { cand: Object.keys(counts), counts };
  }

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <label class="ag-row">输入开头<input class="pp-in" value="春天"></label>
          <div class="ag-btns"><button class="pp-step primary">▶ 执行下一站</button>
            <button class="pp-reset">↺ 重置</button></div>
          <div class="pp-note ld-row dim">pipeline("text-generation") 内部就是这条流水线——所谓"三行代码"，是把这四站打包了起来。</div>
        </div>
        <div class="ts-panel pp-panel">
          <div class="pp-stages"></div>
        </div>
      </div>`;
    const $ = s => container.querySelector(s);
    let text = '春天', stage = 0;

    const STAGE_DEFS = [
      { name: '① 分词（tokenizer）', hint: '文字 → token id 序列' },
      { name: '② 前向（model）', hint: 'id → 下一 token 的打分 logits' },
      { name: '③ 采样', hint: 'logits → softmax → 按概率挑一个' },
      { name: '④ 解码（decode）', hint: '新 id → 文字，拼回输入' },
    ];

    function render() {
      const st = $('.pp-stages');
      st.innerHTML = '';
      STAGE_DEFS.forEach((d, i) => {
        if (i > stage) return;
        const div = document.createElement('div');
        div.className = 'pp-stage';
        let body = '';
        if (i === 0) {
          const ids = [...text].map(c => CHARS.indexOf(c) >= 0 ? CHARS.indexOf(c) : 0);
          body = `输入文本：<b>${text}</b><br>token ids：<code>[${ids.join(', ')}]</code>`;
        } else if (i === 1) {
          const last = text[text.length - 1];
          const { counts } = bigramNext(last);
          body = `查询「${last}」的后续分布（bigram 查表）：<br><code>${JSON.stringify(counts)}</code>`;
        } else if (i === 2) {
          const last = text[text.length - 1];
          const { cand, counts } = bigramNext(last);
          const pick = cand[Math.floor(Math.random() * cand.length)];
          text += pick;
          body = `从候选 ${JSON.stringify(cand)} 中采样 → <b class="pp-pick">${pick}</b>`;
        } else {
          body = `拼接后的完整文本：<br><b class="pp-text">${text}</b>`;
        }
        div.innerHTML = `<div class="pp-stage-name">${d.name}<i>${d.hint}</i></div><div class="pp-stage-body">${body}</div>`;
        st.appendChild(div);
      });
      $('.pp-step').disabled = stage >= 3;
      $('.pp-note').textContent = stage >= 3
        ? '看到没？"AI 生成"= 查表 + 掷骰子 + 循环。真实大模型把"查表"换成了巨大的神经网络，骨架一模一样。点「执行下一站」从头再来，或改输入观察分布变化。'
        : 'pipeline("text-generation") 内部就是这条流水线——所谓"三行代码"，是把这四站打包了起来。';
      $('.pp-panel').scrollTop = 1e5;
    }
    $('.pp-step').onclick = () => { if (stage < 3) { stage++; render(); } };
    $('.pp-reset').onclick = () => {
      text = ($('.pp-in').value || '春天').slice(0, 12); stage = 0; render();
      // 重置后补显示第 0 站
    };
    render(); render();
    return {};
  }

  return { mount };
})();
