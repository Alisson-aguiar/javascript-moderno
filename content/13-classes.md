## Sintaxe básica

```javascript
class Pessoa {
  constructor(nome, idade) {
    this.nome = nome;
    this.idade = idade;
  }
  saudar() {
    return `Olá, sou ${this.nome}`;
  }
}

const p = new Pessoa('Ana', 30);
p.saudar();
```

## Herança

```javascript
class Funcionario extends Pessoa {
  constructor(nome, idade, cargo) {
    super(nome, idade);
    this.cargo = cargo;
  }
  saudar() {
    return `${super.saudar()} e sou ${this.cargo}`;
  }
}
```

## Campos privados `#`

```javascript
class Conta {
  #saldo = 0;

  depositar(v) { this.#saldo += v; }
  get saldo()  { return this.#saldo; }
}
```

## Getters e setters

```javascript
class Temperatura {
  constructor(c) { this._celsius = c; }
  get fahrenheit() { return this._celsius * 9/5 + 32; }
  set fahrenheit(f) { this._celsius = (f - 32) * 5/9; }
}
```

## Membros estáticos

```javascript
class Util {
  static soma(a, b) { return a + b; }
}
Util.soma(1, 2); // 3
```

::tip::Use `#` (privado real) em vez de `_` (convenção). O runtime garante encapsulamento de verdade.::end::

## Playground

::play::
class Pilha {
  #itens = [];
  push(x) { this.#itens.push(x); return this; }
  pop()   { return this.#itens.pop(); }
  get tamanho() { return this.#itens.length; }
}
const s = new Pilha().push(1).push(2).push(3);
console.log('tamanho:', s.tamanho);
console.log('pop:', s.pop(), 'restam:', s.tamanho);
::end::