// shapes.js — 字符级 GPT 形状追踪器（阶段 1 · c17）
// 拖动 B/T/C/L/头数，实时列出前向传播每一站的张量形状与总参数量。
// 形状约定与 Karpathy《Let's build GPT》/ nanoGPT 完全一致。
export const ShapeSim = (function () {
  'use strict';

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <label class="tr-slider">batch（B）<output class="shp-b">4</output>
            <input type="range" class="in-b" min="1" max="16" value="4"></label>
          <label class="tr-slider">序列长 T <output class="shp-t">32</output>
            <input type="range" class="in-t" min="8" max="128" step="8" value="32"></label>
          <label class="tr-slider">通道 C（嵌入维）<output class="shp-c">128</output>
            <input type="range" class="in-c" min="32" max="384" step="32" value="128"></label>
          <label class="tr-slider">Block 层数 L <output class="shp-l">4</output>
            <input type="range" class="in-l" min="1" max="6" value="4"></label>
          <label class="tr-slider">注意力头数 H <output class="shp-h">4</output>
            <input type="range" class="in-h" min="1" max="8" value="4"></label>
          <div class="ld-row dim">词表固定 65（莎士比亚字符集）；每头维度 = C/H。</div>
        </div>
        <div class="ts-panel shp-panel"><table class="shp-table"></table><div class="shp-total"></div></div>
      </div>`;
    const $ = s => container.querySelector(s);
    const table = $('.shp-table'), total = $('.shp-total');

    function render() {
      const B = +$('.in-b').value, T = +$('.in-t').value, C = +$('.in-c').value,
        L = +$('.in-l').value, H = +$('.in-h').value, V = 65;
      $('.shp-b').textContent = B; $('.shp-t').textContent = T;
      $('.shp-c').textContent = C; $('.shp-l').textContent = L; $('.shp-h').textContent = H;
      const hd = C / H;

      const attn = 4 * C * C + 4 * C;          // q/k/v/o 投影 + 偏置
      const mlp = 2 * (C * 4 * C + 4 * C);      // 4 倍扩展的 MLP
      const ln = 4 * C;                          // 两个 LayerNorm
      const perBlock = attn + mlp + ln;
      const totalParams = V * C + T * C + L * perBlock + C + V; // 嵌入 + 位置 + blocks + 最后LN + lm_head
      const mem = totalParams * 4 / 1024 / 1024;

      table.innerHTML = `
        <tr><th>阶段</th><th>运算</th><th>形状（B, T, C）</th></tr>
        <tr><td>输入</td><td>token id</td><td><code>(${B}, ${T})</code></td></tr>
        <tr><td>查表</td><td>token 嵌入 + 位置嵌入</td><td><code>(${B}, ${T}, ${C})</code></td></tr>
        <tr><td rowspan="3">Block ×${L}<br><small>（每层）</small></td><td>LN → 多头注意力<br><small>每头 ${hd} 维 × ${H} 头</small></td><td><code>(${B}, ${H}, ${T}, ${hd})</code></td></tr>
        <tr><td>残差相加 ⊕</td><td><code>(${B}, ${T}, ${C})</code></td></tr>
        <tr><td>LN → MLP（×4 扩展）→ ⊕</td><td><code>(${B}, ${T}, ${4 * C})</code> → <code>(${B}, ${T}, ${C})</code></td></tr>
        <tr><td>收尾</td><td>LayerNorm → lm_head（对词表打分）</td><td><code>(${B}, ${T}, ${V})</code></td></tr>
        <tr><td>损失</td><td>交叉熵（与下一个真实字符比）</td><td><code>标量</code></td></tr>`;
      total.innerHTML = `总参数量 ≈ <b>${(totalParams / 1000).toFixed(1)}K</b>（fp16 约占 <b>${mem.toFixed(1)} MB</b>）· nanoGPT 莎翁模型 = <b>10.7M</b>，GPT-3 = <b>175B</b>——同一张图，放大三万倍。`;
    }
    container.querySelectorAll('input[type=range]').forEach(r => { r.oninput = render; });
    render();
    return {};
  }

  return { mount };
})();
