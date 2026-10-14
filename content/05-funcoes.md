## Três formas de declarar

```javascript
// Declaração (hoisted)
function somar(a, b) { return a + b; }

// Expressão (não hoisted)
const somar2 = function (a, b) { return a + b; };

// Arrow function
const somar3 = (a, b) => a + b;
```

## Parâmetros com default e rest

```javascript
function saudar(nome = 'visitante') {
  return `Olá, ${nome}!`;
}

function soma(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
soma(1, 2, 3, 4); // 10
```

## Closures na prática

```javascript
function contador() {
  let n = 0;
  return () => ++n;
}
const next = contador();
next(); // 1
next(); // 2
next(); // 3
```

::tip::Closures são a base de **hooks do React**, módulos, memoização e encapsulamento. Entenda-os a fundo.::end::

## Arrow functions e o this

Arrow functions **não** têm `this` próprio — herdam do escopo léxico.

```javascript
const obj = {
  nome: 'Ana',
  falarTradicional() { console.log(this.nome); },   // 'Ana'
  falarArrow: () => console.log(this?.nome)         // undefined
};
```

::warn::Não use arrow em métodos de objetos que dependam de `this` dinâmico nem em construtores.::end::

## Higher-order functions

```javascript
const aplicar = (fn, valor) => fn(valor);
aplicar(x => x * 2, 5);      // 10
aplicar(x => x.toUpperCase(), 'js'); // 'JS'
```

## Playground

::play::
const memo = (fn) => {
  const cache = new Map();
  return (n) => cache.has(n) ? cache.get(n) : (cache.set(n, fn(n)), cache.get(n));
};
const fib = memo(function f(n) { return n < 2 ? n : f(n - 1) + f(n - 2); });
console.log(fib(30));
::end::