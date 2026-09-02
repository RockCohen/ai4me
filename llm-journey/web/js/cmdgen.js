// cmdgen.js — 双轨命令生成器（c27）
// 选轨道（本机 MLX / Colab PEFT）+ 拖参数，实时生成可复制的学习/微调命令。
export const CmdGen = (function () {
  'use strict';

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <div class="ag-title">轨道</div>
          <div class="ag-btns">
            <button class="cg-mlx primary">本机 MLX</button>
            <button class="cg-colab">Colab PEFT</button>
          </div>
          <label class="tr-slider">LoRA 秩 r <output class="cg-r">16</output>
            <input type="range" class="cg-ir" min="4" max="64" step="4" value="16"></label>
          <label class="tr-slider">alpha <output class="cg-a">32</output>
            <input type="range" class="cg-ia" min="8" max="128" step="8" value="32"></label>
          <label class="tr-slider">迭代步数 <output class="cg-it">600</output>
            <input type="range" class="cg-iit" min="100" max="2000" step="100" value="600"></label>
          <div class="ld-row dim">alpha/r = 有效学习强度（c24）。alpha = 2r 是常用起点；改 r 时同步改 alpha 保持比值。</div>
        </div>
        <div class="ts-panel cg-panel"><pre class="cg-cmd"></pre></div>
      </div>`;
    const $ = s => container.querySelector(s);
    let track = 'mlx';

    function render() {
      const r = +$('.cg-ir').value, a = +$('.cg-ia').value, it = +$('.cg-iit').value;
      $('.cg-r').textContent = r; $('.cg-a').textContent = a; $('.cg-it').textContent = it;
      const ratio = (a / r).toFixed(1);
      let cmd;
      if (track === 'mlx') {
        cmd = `# 本机 MLX：Qwen2.5-1.5B LoRA 微调（16GB Mac 可跑）
pip install mlx-lm

# 数据：data/train.jsonl 与 valid.jsonl（{"instruction","input","output"} 三栏）
mlx_lm.lora \\
  --model mlx-community/Qwen2.5-1.5B-Instruct-4bit \\
  --data ./data \\
  --fine-tune-type lora \\
  --num-layers 8 \\
  --batch-size 4 \\
  --iters ${it}

# 用训练好的 adapter 生成
mlx_lm.generate --model mlx-community/Qwen2.5-1.5B-Instruct-4bit \\
  --adapter adapters \\
  --prompt "把'我非常想念你'翻译成文言文"`;
      } else {
        cmd = `# Colab PEFT/TRL：7B QLoRA（T4 16GB，工业标准栈）
pip install transformers peft trl bitsandbytes

from peft import LoraConfig
lora_config = LoraConfig(
    r=${r},                          # 容量旋钮
    lora_alpha=${a},                 # 强度旋钮（alpha/r = ${ratio}）
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    lora_dropout=0.05,
    task_type="CAUSAL_LM",
)
# 训练：SFTTrainer(model=..., peft_config=lora_config, ...)
# 7B + QLoRA(bitsandbytes NF4) ≈ 6GB 显存起步（c25 的账本）`;
      }
      $('.cg-cmd').textContent = cmd;
    }
    $('.cg-mlx').onclick = () => { track = 'mlx'; $('.cg-mlx').classList.add('primary'); $('.cg-colab').classList.remove('primary'); render(); };
    $('.cg-colab').onclick = () => { track = 'colab'; $('.cg-colab').classList.add('primary'); $('.cg-mlx').classList.remove('primary'); render(); };
    container.querySelectorAll('input[type=range]').forEach(r => { r.oninput = render; });
    render();
    return {};
  }

  return { mount };
})();
