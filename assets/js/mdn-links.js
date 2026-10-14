/* ============================================
   Links contextuais para MDN
   Linka termos em <p>, <li>, <td> e em <code> INLINE
   Nunca linka dentro de <pre> (blocos de código)
   ============================================ */

const MDN_BASE = 'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/';

const TERMS = {
  Array: 'Global_Objects/Array',
  Object: 'Global_Objects/Object',
  Map: 'Global_Objects/Map',
  Set: 'Global_Objects/Set',
  WeakMap: 'Global_Objects/WeakMap',
  WeakSet: 'Global_Objects/WeakSet',
  Promise: 'Global_Objects/Promise',
  Proxy: 'Global_Objects/Proxy',
  Reflect: 'Global_Objects/Reflect',
  Symbol: 'Global_Objects/Symbol',
  Date: 'Global_Objects/Date',
  RegExp: 'Global_Objects/RegExp',
  Error: 'Global_Objects/Error',
  JSON: 'Global_Objects/JSON',
  Math: 'Global_Objects/Math',
  Number: 'Global_Objects/Number',
  String: 'Global_Objects/String',
  Intl: 'Global_Objects/Intl',
  async: 'Statements/async_function',
  await: 'Operators/await',
  structuredClone: 'Global_Objects/structuredClone'
};

// Não linkar dentro destes:
const _SKIP_TAGS = new Set([
  'A',
  'PRE',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'BUTTON',
  'INPUT',
  'TEXTAREA'
]);
// Mas permitimos <code>; só pulamos <pre> acima.

let enabled = true;
let currentContainer = null;

export function initMdnLinks() {
  document.addEventListener('route:loaded', ({ detail }) => {
    currentContainer = detail.container;
    if (enabled) applyMdnLinks(currentContainer);
  });

  mountToggle();
}

function mountToggle() {
  const navbar = document.querySelector('.navbar-js .navbar-nav');
  if (!navbar || document.getElementById('mdnToggle')) return;

  const li = document.createElement('li');
  li.className = 'nav-item';
  li.innerHTML = `
    <button class="btn btn-icon" id="mdnToggle" aria-label="Alternar links MDN" title="Alternar links MDN">
      <i class="bi bi-book-half"></i>
    </button>
  `;
  navbar.appendChild(li);

  const btn = li.querySelector('#mdnToggle');
  btn.classList.toggle('is-active', enabled);

  btn.addEventListener('click', () => {
    enabled = !enabled;
    btn.classList.toggle('is-active', enabled);
    if (enabled) applyMdnLinks(currentContainer || document.getElementById('lessonContent'));
    else removeMdnLinks();
  });
}

function applyMdnLinks(root) {
  if (!root) return;

  const escaped = Object.keys(TERMS)
    .map(escapeRegex)
    .sort((a, b) => b.length - a.length);
  // \b funciona bem para termos ASCII; usamos lookarounds para evitar casar dentro de palavras
  const pattern = new RegExp(`(?<![\\w$])(${escaped.join('|')})(?![\\w$])`, 'g');

  const textNodes = collectTextNodes(root);
  textNodes.forEach((node) => {
    const text = node.nodeValue;
    pattern.lastIndex = 0;
    if (!pattern.test(text)) return;
    pattern.lastIndex = 0;

    const frag = document.createDocumentFragment();
    let last = 0;
    text.replace(pattern, (match, _g, offset) => {
      if (offset > last) {
        frag.appendChild(document.createTextNode(text.slice(last, offset)));
      }
      const a = document.createElement('a');
      a.href = MDN_BASE + TERMS[match];
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'mdn-link';
      a.textContent = match;
      a.title = `MDN → ${match}`;
      frag.appendChild(a);
      last = offset + match.length;
      return match;
    });
    if (last < text.length) {
      frag.appendChild(document.createTextNode(text.slice(last)));
    }
    node.parentNode.replaceChild(frag, node);
  });
}

function removeMdnLinks() {
  document.querySelectorAll('#lessonContent a.mdn-link').forEach((a) => {
    const text = document.createTextNode(a.textContent);
    a.replaceWith(text);
    // Renormaliza o pai para juntar nós adjacentes
    text.parentNode?.normalize();
  });
}

function collectTextNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;

      // Sobe ancestrais: se algum for <pre> ou <a>, rejeita
      let el = node.parentNode;
      while (el && el !== root) {
        if (el.tagName === 'PRE' || el.tagName === 'A') {
          return NodeFilter.FILTER_REJECT;
        }
        el = el.parentNode;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const out = [];
  let n;
  while ((n = walker.nextNode())) out.push(n);
  return out;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
