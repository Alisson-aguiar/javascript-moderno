## Map — chave-valor com qualquer tipo de chave

```javascript
const m = new Map();
m.set('nome', 'Ana');
m.set(42, 'resposta');
m.set({ id: 1 }, 'objeto como chave');

m.get('nome');        // 'Ana'
m.has(42);            // true
m.size;               // 3
m.delete(42);
```

::tip::`Map` preserva a ordem de inserção e aceita **qualquer tipo** como chave. Objetos comuns só aceitam string/symbol.::end::

## Iterando um Map

```javascript
for (const [chave, valor] of m) {
  console.log(chave, valor);
}

[...m.keys()];    // array de chaves
[...m.values()];  // array de valores
[...m.entries()]; // array de [k,v]
```

## Set — valores únicos

```javascript
const s = new Set([1, 2, 2, 3, 3, 3]);
s.size;            // 3
s.add(4);
s.has(2);          // true
[...s];            // [1,2,3,4]
```

## Removendo duplicatas com Set

```javascript
const unicos = [...new Set([1,1,2,3,3,3])]; // [1,2,3]
```

## WeakMap / WeakSet

Só aceitam objetos como chave e não impedem o garbage collector.

```javascript
const wm = new WeakMap();
let obj = {};
wm.set(obj, 'meta');
obj = null; // entrada é automaticamente removida
```

::warn::`WeakMap`/`WeakSet` **não são iteráveis** e não têm `.size`. Use-os só para metadados associados a objetos vivos.::end::

## Playground

::play::
const contador = new Map();
for (const letra of 'banana') {
  contador.set(letra, (contador.get(letra) ?? 0) + 1);
}
console.log([...contador]);
::end::