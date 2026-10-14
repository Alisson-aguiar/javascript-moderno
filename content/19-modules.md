## Por que módulos?

Antes: `<script>` globais, ordem importa, tudo vaza para `window`. Hoje: `type="module"` dá escopo isolado, carregamento assíncrono e dependências explícitas.

```html
<script type="module" src="app.js"></script>
```

## Named exports

**`math.js`**
```javascript
export const PI = 3.14;
export function soma(a, b) { return a + b; }
export class Vetor { /* ... */ }
```

**`app.js`**
```javascript
import { PI, soma } from './math.js';
```

## Default export

**`usuario.js`**
```javascript
export default class Usuario { /* ... */ }
```

**`app.js`**
```javascript
import Usuario from './usuario.js'; // nome livre
```

## Import dinâmico — code splitting

```javascript
btn.addEventListener('click', async () => {
  const { abrirModal } = await import('./modal.js');
  abrirModal();
});
```

## Re-exportar

```javascript
export { PI, soma } from './math.js';
export * as geometria from './geometria.js';
```

## Import maps (navegador sem build)

```html
<script type="importmap">
{
  "imports": {
    "lodash": "https://cdn.jsdelivr.net/npm/lodash-es/lodash.js"
  }
}
</script>
```

::tip::Use `import()` dinâmico para **lazy loading** de rotas, modais e features pesadas. Reduz o bundle inicial drasticamente.::end::

::warn::Em módulos, `this` no topo é `undefined` (não `window`). E módulos são sempre `strict mode`.::end::

## Playground

::play::
// Simulando módulos com objetos
const math = (() => {
  const PI = Math.PI;
  const soma = (a, b) => a + b;
  return { PI, soma };
})();

console.log('PI:', math.PI.toFixed(4));
console.log('soma:', math.soma(2, 3));
::end::