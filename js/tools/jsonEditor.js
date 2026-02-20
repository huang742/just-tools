const STORAGE_KEY = 'justtools:json-editor:last';

const sample = {
  name: 'Just Tools',
  purpose: '轻量聚合常用在线小工具',
  version: '0.1.0',
  features: ['JSON 格式化', 'JSON 编辑', '后续可扩展更多工具'],
  sampleData: {
    users: [
      { id: 1, name: 'Alice', role: 'admin' },
      { id: 2, name: 'Bob', role: 'editor' }
    ],
    flags: { beta: true, maxItems: 120 }
  }
};

const ui = {
  createButton(label, className = '') {
    const btn = document.createElement('button');
    btn.textContent = label;
    if (className) btn.classList.add(className);
    return btn;
  },
  createCard() {
    const div = document.createElement('div');
    div.className = 'card';
    return div;
  },
  stat(label, value) {
    const span = document.createElement('div');
    span.innerHTML = `<strong>${value}</strong> ${label}`;
    return span;
  }
};

function safeParse(value) {
  try {
    return { ok: true, data: JSON.parse(value) };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

function prettyPrint(data, indent = 2) {
  return JSON.stringify(data, null, indent);
}

function updateStats(el, raw, formatted) {
  el.innerHTML = '';
  el.append(ui.stat('源字符', raw.length));
  el.append(ui.stat('格式化字符', formatted.length));
}

export const jsonTools = {
  id: 'json',
  label: 'JSON 工具',
  tools: [
    {
      id: 'json-editor',
      label: 'JSON 编辑 / 格式化',
      desc: '格式化、校验并直接编辑 JSON 数据',
      render: (mount) => {
        const header = document.createElement('div');
        header.className = 'tool-header';
        header.innerHTML = `
          <div class="tool-title">JSON 编辑器</div>
          <div class="tool-actions">
            <span class="pill">可扩展 · 轻量</span>
          </div>
        `;

        const controls = document.createElement('div');
        controls.className = 'controls';

        const formatBtn = ui.createButton('格式化 & 校验');
        const minifyBtn = ui.createButton('压缩', 'secondary');
        const applyBtn = ui.createButton('应用到源 JSON', 'secondary');
        const copyBtn = ui.createButton('复制格式化', 'secondary');
        const downloadBtn = ui.createButton('下载 JSON', 'secondary');
        const sampleBtn = ui.createButton('填充示例', 'secondary');
        const clearBtn = ui.createButton('清空', 'secondary');

        [formatBtn, minifyBtn, applyBtn, copyBtn, downloadBtn, sampleBtn, clearBtn].forEach((b) => controls.appendChild(b));

        const grid = document.createElement('div');
        grid.className = 'grid-2';

        const leftCard = ui.createCard();
        const rightCard = ui.createCard();

        const leftLabel = document.createElement('label');
        leftLabel.textContent = '源 JSON';
        const rightLabel = document.createElement('label');
        rightLabel.textContent = '格式化 / 可编辑';

        const sourceArea = document.createElement('textarea');
        const formattedArea = document.createElement('textarea');

        sourceArea.placeholder = '{\n  "hello": "world"\n}';
        formattedArea.placeholder = '格式化后的 JSON 会显示在这里，可直接修改';

        const status = document.createElement('div');
        status.className = 'status';
        status.textContent = '等待操作';

        const stats = document.createElement('div');
        stats.className = 'stats';

        leftCard.appendChild(leftLabel);
        leftCard.appendChild(sourceArea);
        rightCard.appendChild(rightLabel);
        rightCard.appendChild(formattedArea);

        grid.appendChild(leftCard);
        grid.appendChild(rightCard);

        const footer = document.createElement('div');
        footer.style.marginTop = '12px';
        footer.appendChild(status);
        footer.appendChild(stats);

        mount.appendChild(header);
        mount.appendChild(controls);
        mount.appendChild(grid);
        mount.appendChild(footer);

        // persistence
        const last = localStorage.getItem(STORAGE_KEY);
        if (last) {
          sourceArea.value = last;
        } else {
          sourceArea.value = prettyPrint(sample, 2);
        }

        const setStatus = (msg, ok = true) => {
          status.textContent = msg;
          status.classList.remove('ok', 'err');
          status.classList.add(ok ? 'ok' : 'err');
        };

        const doFormat = () => {
          const parsed = safeParse(sourceArea.value.trim());
          if (!parsed.ok) {
            setStatus(`解析失败: ${parsed.error}`, false);
            return;
          }
          const formatted = prettyPrint(parsed.data, 2);
          formattedArea.value = formatted;
          updateStats(stats, sourceArea.value, formatted);
          setStatus('格式化成功');
          localStorage.setItem(STORAGE_KEY, sourceArea.value);
        };

        const doMinify = () => {
          const parsed = safeParse(sourceArea.value.trim());
          if (!parsed.ok) {
            setStatus(`解析失败: ${parsed.error}`, false);
            return;
          }
          const compact = JSON.stringify(parsed.data);
          formattedArea.value = compact;
          updateStats(stats, sourceArea.value, compact);
          setStatus('压缩成功');
          localStorage.setItem(STORAGE_KEY, sourceArea.value);
        };

        const applyBack = () => {
          const parsed = safeParse(formattedArea.value.trim());
          if (!parsed.ok) {
            setStatus(`格式化区解析失败: ${parsed.error}`, false);
            return;
          }
          const tidy = prettyPrint(parsed.data, 2);
          sourceArea.value = tidy;
          localStorage.setItem(STORAGE_KEY, tidy);
          setStatus('已将修改应用回源 JSON');
          updateStats(stats, tidy, formattedArea.value);
        };

        const copyFormatted = async () => {
          if (!formattedArea.value.trim()) return;
          try {
            await navigator.clipboard.writeText(formattedArea.value);
            setStatus('已复制到剪贴板');
          } catch (err) {
            setStatus('复制失败：浏览器未授权', false);
          }
        };

        const download = () => {
          if (!formattedArea.value.trim()) return;
          const blob = new Blob([formattedArea.value], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'data.json';
          a.click();
          URL.revokeObjectURL(url);
          setStatus('已触发下载');
        };

        const loadSample = () => {
          const text = prettyPrint(sample, 2);
          sourceArea.value = text;
          formattedArea.value = '';
          updateStats(stats, text, '');
          setStatus('已填充示例数据');
        };

        const clearAll = () => {
          sourceArea.value = '';
          formattedArea.value = '';
          updateStats(stats, '', '');
          setStatus('已清空');
        };

        formatBtn.addEventListener('click', doFormat);
        minifyBtn.addEventListener('click', doMinify);
        applyBtn.addEventListener('click', applyBack);
        copyBtn.addEventListener('click', copyFormatted);
        downloadBtn.addEventListener('click', download);
        sampleBtn.addEventListener('click', loadSample);
        clearBtn.addEventListener('click', clearAll);

        // keyboard shortcut: Ctrl/Cmd + Enter to format
        sourceArea.addEventListener('keydown', (e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            doFormat();
          }
        });

        formattedArea.addEventListener('keydown', (e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 's') {
            e.preventDefault();
            applyBack();
          }
        });

        // initial stats
        updateStats(stats, sourceArea.value, formattedArea.value);
      }
    }
  ]
};
