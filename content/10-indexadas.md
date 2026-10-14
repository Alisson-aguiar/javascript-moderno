## Arrays — a coleção indexada padrão

```javascript
const nums = [1, 2, 3, 4, 5];
nums.length;        // 5
nums[0];            // 1
nums.at(-1);        // 5 (último)
```

## Adicionar e remover

```javascript
const a = [1, 2, 3];
a.push(4);          // [1,2,3,4]
a.pop();            // remove último
a.unshift(0);       // [0,1,2,3]
a.shift();          // remove primeiro
a.splice(1, 2);     // remove 2 itens a partir do índice 1
```

## Métodos não-mutantes (preferidos)

```javascript
[1,2,3].slice(1);         // [2,3]
[1,2].concat([3,4]);      // [1,2,3,4]
[3,1,2].toSorted();       // [1,2,3]  ← ES2023
[1,2,3].toReversed();     // [3,2,1]  ← ES2023
```

## Buscar

```javascript
const nums = [1, 2, 3, 2, 4];
nums.indexOf(2);          // 1
nums.lastIndexOf(2);      // 3
nums.includes(3);         // true
nums.find(n => n > 3);    // 4
nums.findIndex(n => n > 3); // 4
```

## Transformar

```javascript
[1,2,3].map(n => n ** 2);        // [1,4,9]
[1,2,3].filter(n => n > 1);      // [2,3]
[1,2,3].reduce((s,n) => s+n, 0); // 6
[1,2,3].flatMap(n => [n, n*2]);  // [1,2,2,4,3,6]
```

## Typed Arrays — prévia

```javascript
const buf = new ArrayBuffer(16);
const i32 = new Int32Array(buf);
i32[0] = 42;
```

::tip::Métodos como `sort`, `reverse`, `splice`, `push`, `pop` **mutam** o array. Prefira `toSorted`, `toReversed`, `toSpliced` (ES2023) para manter imutabilidade.::end::

## Playground

::play::
const nums = [3, 1, 4, 1, 5, 9, 2, 6];
console.log('original:', nums);
console.log('ordenado:', nums.toSorted((a,b) => a-b));
console.log('original ainda intacto:', nums);
console.log('pares:', nums.filter(n => n % 2 === 0));
::end::