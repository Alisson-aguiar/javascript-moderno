/* ============================================
   Feedback por capítulo — localStorage
   Estados: voto → comentário (com editar/excluir)
   ============================================ */

const KEY = 'jsm-feedback';

const read = () => JSON.parse(localStorage.getItem(KEY) || '{}');
const write = (d) => localStorage.setItem(KEY, JSON.stringify(d));

export function initFeedback() {
  document.addEventListener('route:loaded', () => {
    const slug = location.hash.replace('#', '').split('/')[0];
    if (slug) mountFeedback(slug);
  });
}

function mountFeedback(slug) {
  document.getElementById('feedbackWidget')?.remove();
  const container = document.getElementById('lessonContent');
  if (!container) return;

  const saved = read()[slug] || {};

  const widget = document.createElement('section');
  widget.id = 'feedbackWidget';
  widget.className = 'feedback-widget';
  widget.innerHTML = `
    <h3>Este capítulo foi útil?</h3>
    <div class="feedback-votes">
      <button class="vote-btn ${saved.vote === 'up' ? 'is-active' : ''}" data-vote="up">
        <i class="bi bi-hand-thumbs-up"></i> Sim
      </button>
      <button class="vote-btn ${saved.vote === 'down' ? 'is-active' : ''}" data-vote="down">
        <i class="bi bi-hand-thumbs-down"></i> Não
      </button>
    </div>
    <div class="feedback-body"></div>
  `;
  container.appendChild(widget);

  const votes = widget.querySelectorAll('.vote-btn');
  const body = widget.querySelector('.feedback-body');

  // Estado inicial
  renderBody({ slug, saved, body });

  votes.forEach((btn) => {
    btn.addEventListener('click', () => {
      const vote = btn.dataset.vote;
      const data = read();
      const current = data[slug] || {};
      data[slug] = { ...current, vote, at: Date.now() };
      write(data);

      votes.forEach((v) => v.classList.toggle('is-active', v.dataset.vote === vote));
      renderBody({ slug, saved: data[slug], body });
    });
  });
}

/* ---------- Renderiza o corpo de acordo com o estado ---------- */
function renderBody({ slug, saved, body }) {
  // Sem voto → nada
  if (!saved?.vote) {
    body.innerHTML = '';
    return;
  }

  // Com voto + comentário salvo → modo leitura com ações
  if (saved.comment) {
    body.innerHTML = `
      <div class="feedback-readonly">
        <p class="feedback-readonly__text"></p>
        <footer class="feedback-readonly__actions">
          <button class="fb-action" data-action="edit">
            <i class="bi bi-pencil"></i> Editar
          </button>
          <button class="fb-action fb-action--danger" data-action="delete">
            <i class="bi bi-trash3"></i> Excluir
          </button>
        </footer>
      </div>
    `;
    body.querySelector('.feedback-readonly__text').textContent = saved.comment;

    body
      .querySelector('[data-action="edit"]')
      .addEventListener('click', () => renderEditor({ slug, saved, body, editing: true }));
    body.querySelector('[data-action="delete"]').addEventListener('click', () => {
      if (!confirm('Excluir seu comentário?')) return;
      const data = read();
      data[slug] = { ...data[slug], comment: undefined };
      write(data);
      renderBody({ slug, saved: data[slug], body });
    });
    return;
  }

  // Votou mas ainda não comentou → modo editor
  renderEditor({ slug, saved, body, editing: false });
}

/* ---------- Editor de comentário ---------- */
function renderEditor({ slug, saved, body, editing }) {
  body.innerHTML = `
    <div class="feedback-editor">
      <textarea class="feedback-editor__area" rows="3"
        placeholder="Deixe um comentário (opcional)..."></textarea>
      <footer class="feedback-editor__foot">
        <span class="feedback-editor__status" aria-live="polite"></span>
        <div class="feedback-editor__buttons">
          ${editing ? '<button class="fb-action" data-action="cancel">Cancelar</button>' : ''}
          <button class="fb-action fb-action--primary" data-action="save">
            ${editing ? 'Salvar' : 'Enviar'}
          </button>
        </div>
      </footer>
    </div>
  `;

  const area = body.querySelector('.feedback-editor__area');
  const status = body.querySelector('.feedback-editor__status');
  const saveBtn = body.querySelector('[data-action="save"]');
  const cancel = body.querySelector('[data-action="cancel"]');

  area.value = saved?.comment || '';
  area.focus();
  // Coloca o cursor no fim
  area.setSelectionRange(area.value.length, area.value.length);

  // Auto-save (rascunho) com debounce
  let draftTimer;
  area.addEventListener('input', () => {
    status.textContent = 'Rascunho...';
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
      status.textContent = 'Rascunho salvo';
    }, 400);
  });

  saveBtn.addEventListener('click', () => {
    const text = area.value.trim();
    const data = read();
    data[slug] = { ...(data[slug] || {}), comment: text, at: Date.now() };
    write(data);
    renderBody({ slug, saved: data[slug], body });
  });

  cancel?.addEventListener('click', () => {
    renderBody({ slug, saved, body });
  });

  // Ctrl/Cmd+Enter salva
  area.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      saveBtn.click();
    }
  });
}
