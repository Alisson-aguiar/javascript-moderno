## Numbers — cuidados essenciais

JavaScript tem **um único tipo** para números: `number` (double de 64 bits). Para inteiros enormes use `BigInt`.

```javascript
0.1 + 0.2               // 0.30000000000000004
Number.isInteger(42)    // true
Number.isFinite(Infinity) // false
Number.isNaN(NaN)       // true
Number.parseInt('42px') // 42
Number.parseFloat('3.14s') // 3.14
(1234.5678).toFixed(2)  // '1234.57'
(255).toString(16)      // 'ff'
```

::warn::Nunca use `==` para comparar floats. Use `Math.abs(a - b) < Number.EPSILON`.::end::

## Math — utilitários do dia a dia

```javascript
Math.round(4.7)   // 5
Math.floor(4.9)   // 4
Math.ceil(4.1)    // 5
Math.max(1,2,3)   // 3
Math.min(...[4,2,8]) // 2
Math.random()     // [0, 1)
```

## Strings — métodos modernos

```javascript
const s = '  JavaScript Moderno  ';
s.trim()                     // 'JavaScript Moderno'
s.trim().toLowerCase()       // 'javascript moderno'
s.includes('Moderno')        // true
s.startsWith('  Java')       // true
s.padStart(30, '*')          // preenche à esquerda
'abc'.repeat(3)              // 'abcabcabc'
'a,b,c'.split(',')           // ['a','b','c']
['a','b','c'].join('-')      // 'a-b-c'
```

## Template literals

```javascript
const nome = 'Ana';
const msg = `Olá, ${nome}!`;
const multi = `linha 1
linha 2`;
```

::tip::Prefira template literals a concatenação com `+` — mais legível e menos propenso a erro.::end::

## Playground

::play::
const preco = 1234.5678;
console.log('R$', preco.toFixed(2));
console.log('hex de 255:', (255).toString(16));
console.log('inteiro?', Number.isInteger(preco));
console.log('random:', Math.floor(Math.random() * 100));
::end::