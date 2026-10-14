/* ============================================
   Modo apresentação — quebra o capítulo em slides por <h2>
   Ativação: botão flutuante OU tecla "P"
   ============================================ */

let active = false;
let slides = [];
let current = 0;
let overlay = null;

export function initPresenter() {
  document.addEventListener('route:loaded', setupButton);
  document.addEventListener('keydown', handleKeys);

  setupButton();
}

function setupButton() {
  document.getElementById('presenterBtn')?.remove();
}

function buildSlides() {
  const container = document.getElementById('lessonContent');
  const nodes = [...container.children];

  slides = [];
  let currentSlide = null;

  nodes.forEach((node) => {
    if (node.tagName === 'H2') {
      if (currentSlide) slides.push(currentSlide);
      currentSlide = { title: node.textContent, body: [] };
    } else {
      if (!currentSlide) currentSlide = { title: 'Introdução', body: [] };
      currentSlide.body.push(node.cloneNode(true));
    }
  });
  if (currentSlide) slides.push(currentSlide);
}

function enter() {
  if (active) return;
  buildSlides();
  if (!slides.length) return;

  active = true;
  current = 0;

  overlay = document.createElement('div');
  overlay.className = 'presenter-overlay';
  overlay.innerHTML = `
    <header class="presenter-bar">
      <div class="presenter-bar__title"></div>
      <div class="presenter-bar__nav">
        <span class="presenter-counter"></span>
        <button class="presenter-close" aria-label="Sair">
          <i class="bi bi-x-lg"></i> ESC
        </button>
      </div>
    </header>
    <section class="presenter-stage" id="presenterStage"></section>
    <footer class="presenter-foot">
      <button class="presenter-prev"><i class="bi bi-chevron-left"></i> Anterior</button>
      <span class="presenter-hint">← → para navegar · ESC para sair</span>
      <button class="presenter-next">Próximo <i class="bi bi-chevron-right"></i></button>
    </footer>
  `;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  overlay.querySelector('.presenter-close').addEventListener('click', exit);
  overlay.querySelector('.presenter-prev').addEventListener('click', () => go(-1));
  overlay.querySelector('.presenter-next').addEventListener('click', () => go(1));

  render();
}

function go(delta) {
  current = Math.min(slides.length - 1, Math.max(0, current + delta));
  render();
}

function render() {
  const slide = slides[current];
  const stage = overlay.querySelector('#presenterStage');
  const title = overlay.querySelector('.presenter-bar__title');
  const counter = overlay.querySelector('.presenter-counter');

  title.textContent = slide.title;
  counter.textContent = `${current + 1} / ${slides.length}`;

  stage.innerHTML = '';
  stage.appendChild(renderTitle(slide.title));
  slide.body.forEach((n) => stage.appendChild(n));

  stage.classList.remove('is-animating');
  void stage.offsetWidth;
  stage.classList.add('is-animating');

  overlay.querySelector('.presenter-prev').disabled = current === 0;
  overlay.querySelector('.presenter-next').disabled = current === slides.length - 1;
}

function renderTitle(text) {
  const h = document.createElement('h2');
  h.className = 'presenter-slide-title';
  h.textContent = text;
  return h;
}

function exit() {
  active = false;
  overlay?.remove();
  overlay = null;
  document.body.style.overflow = '';
}

function handleKeys(e) {
  if (!active) {
    if (e.key.toLowerCase() === 'p' && !isTyping(e.target)) enter();
    return;
  }
  if (e.key === 'Escape') exit();
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    go(1);
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    go(-1);
  }
}

function isTyping(el) {
  return el.matches?.('input, textarea, [contenteditable="true"]');
}
