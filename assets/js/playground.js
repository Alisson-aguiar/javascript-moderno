/* ============================================
   Playground inline — executa JS em sandbox
   Uso no Markdown:
   ::play::\nconsole.log('oi')\n::end::
   ============================================ */

export function initPlaygrounds(container = document) {
  // Converte blocos marcados com data-play em playgrounds interativos
  container.querySelectorAll('pre[data-play]').forEach(setupPlayground);
}

function setupPlayground(pre) {
  if (pre.dataset.playInit) return;
  pre.dataset.playInit = '1';

  const code = pre.querySelector('code')?.innerText ?? '';

  const wrapper = document.createElement('section');
  wrapper.className = 'playground';

  wrapper.innerHTML = `
    <header class="playground__bar">
      <span><i class="bi bi-play-circle"></i> Playground</span>
      <button class="btn-run" type="button">
        <i class="bi bi-play-fill"></i> Executar
      </button>
      <button class="btn-reset" type="button" title="Resetar">
        <i class="bi bi-arrow-counterclockwise"></i>
      </button>
    </header>
    <textarea class="playground__editor" spellcheck="false">${escapeHtml(code)}</textarea>
    <pre class="playground__output" aria-live="polite"></pre>
  `;

  pre.replaceWith(wrapper);

  const editor = wrapper.querySelector('.playground__editor');
  const output = wrapper.querySelector('.playground__output');
  const runBtn = wrapper.querySelector('.btn-run');
  const reset = wrapper.querySelector('.btn-reset');

  const run = () => {
    output.textContent = '';
    output.classList.remove('is-error');

    // Captura console.log
    const logs = [];
    const fakeConsole = {
      log: (...a) => logs.push(a.map(fmt).join(' ')),
      warn: (...a) => logs.push(`⚠️  ${a.map(fmt).join(' ')}`),
      error: (...a) => logs.push(`❌ ${a.map(fmt).join(' ')}`),
      info: (...a) => logs.push(`ℹ️  ${a.map(fmt).join(' ')}`)
    };

    // Timeout de segurança
    const t0 = performance.now();
    try {
      const fn = new Function('console', `"use strict";\n${editor.value}`);
      fn(fakeConsole);
    } catch (err) {
      output.classList.add('is-error');
      logs.push(`❌ ${err.name}: ${err.message}`);
    }

    const dt = (performance.now() - t0).toFixed(2);
    output.innerHTML = `${logs.join('\n')}\n<span class="playground__time">⏱ ${dt}ms</span>`;
  };

  runBtn.addEventListener('click', run);
  reset.addEventListener('click', () => {
    editor.value = code;
    output.textContent = '';
    output.classList.remove('is-error');
  });

  // Ctrl/Cmd + Enter executa
  editor.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      run();
    }
  });

  // Auto-resize
  const autosize = () => {
    editor.style.height = 'auto';
    editor.style.height = `${editor.scrollHeight}px`;
  };
  editor.addEventListener('input', autosize);
  requestAnimationFrame(autosize);
}

function fmt(v) {
  if (typeof v === 'object' && v !== null) {
    try {
      return JSON.stringify(v, null, 2);
    } catch {
      return String(v);
    }
  }
  return String(v);
}
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
