// dsbuilder.js — 指令数据构造器（c26）
// 三栏表单造数据 → 列表管理（金标准置顶/去重/统计）→ 导出 JSONL。
// 数据存 localStorage，关闭页面不丢。
export const DSBuilder = (function () {
  'use strict';

  const KEY = 'llm-journey-dataset';

  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
  function save(d) { localStorage.setItem(KEY, JSON.stringify(d)); }

  function toAlpaca(item) {
    return { instruction: item.instruction, input: item.input, output: item.output };
  }

  function mount(container) {
    container.innerHTML = `
      <div class="ts-wrap">
        <div class="ts-side">
          <label class="ag-row">instruction（任务）<input class="ds-ins" placeholder="把下面的现代文翻译成文言文。"></label>
          <label class="ag-row">input（可选输入）<input class="ds-inp" placeholder="我非常想念你。"></label>
          <label class="ag-row">output（期望回答）<textarea class="ds-out" rows="2" placeholder="吾甚思君。"></textarea></label>
          <div class="ag-btns">
            <button class="ds-add primary">＋ 加入数据集</button>
            <button class="ds-export">⬇ 导出 JSONL</button>
            <button class="ds-clear">清空</button>
          </div>
          <div class="ds-stats"></div>
        </div>
        <div class="ts-panel ds-panel">
          <div class="ag-title" style="padding:12px 16px 0">数据集（前 3 条自动标记为金标准）</div>
          <div class="ds-list"></div>
        </div>
      </div>`;
    const $ = s => container.querySelector(s);
    let data = load();

    function render() {
      const list = $('.ds-list');
      list.innerHTML = '';
      data.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'ds-item';
        div.innerHTML = `
          <div class="ds-item-head"><span class="ds-gold">${i < 3 ? '⭐ 金标准' : '#' + (i + 1)}</span>
            <button class="ds-del" data-i="${i}">✕</button></div>
          <div class="ld-row dim">指令：${escapeHtml(item.instruction)}</div>
          ${item.input ? `<div class="ld-row dim">输入：${escapeHtml(item.input)}</div>` : ''}
          <div class="ld-row">输出：${escapeHtml(item.output)}</div>`;
        list.appendChild(div);
      });
      div_empty(list, data.length === 0, '还没有数据——先造 3 条金标准。');
      const withInput = data.filter(d => d.input).length;
      const dup = data.length - new Set(data.map(d => d.instruction + '|' + d.output)).size;
      $('.ds-stats').innerHTML = `
        <div class="ld-row">共 <b>${data.length}</b> 条（含输入 ${withInput} 条${dup ? `，⚠️ 疑似重复 ${dup} 条` : ''}）</div>
        <div class="ld-row dim">质量清单：输入多样？风格一致？无事实错误？覆盖真实场景？</div>`;
      list.querySelectorAll('.ds-del').forEach(b => {
        b.onclick = () => { data.splice(+b.dataset.i, 1); save(data); render(); };
      });
      save(data);
    }
    function div_empty(list, cond, msg) { if (cond) { const d = document.createElement('div'); d.className = 'ld-row dim'; d.style.padding = '10px 16px'; d.textContent = msg; list.appendChild(d); } }
    function escapeHtml(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

    $('.ds-add').onclick = () => {
      const instruction = $('.ds-ins').value.trim(), input = $('.ds-inp').value.trim(), output = $('.ds-out').value.trim();
      if (!instruction || !output) return;
      data.push({ instruction, input, output });
      save(data);
      $('.ds-ins').value = ''; $('.ds-inp').value = ''; $('.ds-out').value = '';
      render();
    };
    $('.ds-clear').onclick = () => { data = []; save(data); render(); };
    $('.ds-export').onclick = () => {
      const blob = new Blob([data.map(toAlpaca).map(j => JSON.stringify(j, null, 2)).join('\n\n')], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'instruction-data.jsonl'; a.click();
    };
    render();
    return {};
  }

  return { mount };
})();
