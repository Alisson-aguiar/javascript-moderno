## Protocolo de iteração

Um objeto é iterável se implementa `[Symbol.iterator]()` retornando um iterador com `next()` → `{ value, done }`.

```javascript
const iteravel = {
  [Symbol.iterator]() {
    let n = 0;
    return {
      next: () => n < 3 ? { value: n++, done: false } : { value: undefined, done: true }
    };
  }
};
[...iteravel]; // [0,1,2]
```

## Generators — funções que pausam

```javascript
function* contador() {
  let i = 0;
  while (true) yield i++;
}

const g = contador();
g.next(); // { value: 0, done: false }
g.next(); // { value: 1, done: false }
```

## Generators com input

```javascript
function* soma() {
  let total = 0;
  while (true) {
    const n = yield total;
    total += n;
  }
}

const s = soma();
s.next();       // { value: 0 }
s.next(10);     // { value: 10 }
s.next(5);      // { value: 15 }
```

## Delegação com yield*

```javascript
function* a() { yield 1; yield 2; }
function* b() { yield 0; yield* a(); yield 3; }
[...b()]; // [0,1,2,3]
```

::tip::Generators são perfeitos para **paginação**, **streaming** e produção **lazy** de sequências infinitas.::end::

## Playground

::play::
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}
const fib = fibonacci();
const primeiros = Array.from({ length: 10 }, () => fib.next().value);
console.log(primeiros);
::end::