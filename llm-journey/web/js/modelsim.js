// modelsim.js — 模型装配器（c19）
// 选不同规模的 Qwen2.5，看 config.json 字段、目录内容与磁盘/显存占用如何联动。
export const ModelSim = (function () {
  'use strict';

  const MODELS = {
    'Qwen2.5-0.5B': { layers: 24, heads: 14, kv: 2, hidden: 896, inter: 4864, vocab: 151936, params: '4.9 亿', disk: '~1.0 GB (bf16)' },
    'Qwen2.5-1.5B': { layers: 28, heads: 12, kv: 2, hidden: 1536, inter: 8960, vocab: 151936, params: '15 亿', disk: '~3.1 GB (bf16)' },
    'Qwen2.5-7B':   { layers: 28, heads: 28, kv: 4, hidden: 3584, inter: 18944, vocab: 152064, params: '76 亿', disk: '~15.2 GB (bf16)' },
  };

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <div class="ag-title">选规模</div>
          <div class="md-picker"></div>
          <pre class="md-config"></pre>
          <div class="md-note"></div>
        </div>
        <div class="ts-panel md-panel">
          <div class="ag-title" style="padding:12px 16px 0">模型目录（Hub 下载后的样子）</div>
          <pre class="md-tree"></pre>
        </div>
      </div>`;
    const $ = s => container.querySelector(s);
    const picker = $('.md-picker');
    const btns = {};
    Object.keys(MODELS).forEach(name => {
      const b = document.createElement('button');
      b.textContent = name; b.className = 'moe-in';
      b.onclick = () => { render(name); Object.values(btns).forEach(x => x.classList.remove('active-in')); b.classList.add('active-in'); };
      btns[name] = b; picker.appendChild(b);
    });

    function render(name) {
      const m = MODELS[name];
      $('.md-config').textContent = JSON.stringify({
        model_type: 'qwen2', hidden_size: m.hidden, num_hidden_layers: m.layers,
        num_attention_heads: m.heads, num_key_value_heads: m.kv,
        intermediate_size: m.inter, vocab_size: m.vocab,
      }, null, 2);
      $('.md-note').innerHTML = `
        <div class="ld-row">总参数 <b>${m.params}</b> ｜ 权重盘占 <b>${m.disk}</b></div>
        <div class="ld-row dim">注意 num_key_value_heads &lt; heads——这就是 GQA（分组查询注意力）：KV cache 再省一倍的手法（c29 的进阶）。</div>`;
      const gb = parseFloat(m.disk);
      $('.md-tree').textContent =
`${name}/
├── config.json               ← 上面的身份证
├── generation_config.json    ← 采样默认值（T/top-p）
├── model.safetensors         ← ${m.disk}，全部参数本体
├── tokenizer.json            ← 15 万词表的 BPE
└── tokenizer_config.json

推理想跑它：fp16 显存 ≈ ${gb.replace(/[~ ]|(bf16)/g, '')} 起步
想本机微调：先过一遍 c25 的量化账本`;
    }
    render('Qwen2.5-0.5B');
    btns['Qwen2.5-0.5B'].classList.add('active-in');
    return {};
  }

  return { mount };
})();
