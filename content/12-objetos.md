## Criando e acessando

```javascript
const user = { nome: 'Ana', idade: 30 };
user.nome;         // 'Ana'
user['idade'];     // 30
```

## Shorthand e métodos

```javascript
const nome = 'Ana';
const user = {
  nome,
  saudar() { return `Oi, ${this.nome}`; }
};
```

## Desestruturação

```javascript
const { nome, idade = 0 } = user;
const { nome: n } = user;   // renomear
```

## Spread e cópia

```javascript
const copia = { ...user, ativo: true };
const clone = structuredClone(user); // cópia profunda
```

## Chaves dinâmicas

```javascript
const campo = 'email';
const obj = { [campo]: 'a@b.com' }; // { email: 'a@b.com' }
```

## Object — utilitários

```javascript
Object.keys(user);    // ['nome','idade']
Object.values(user);  // ['Ana',30]
Object.entries(user); // [['nome','Ana'],['idade',30]]
Object.assign({}, user, { ativo: true });
Object.freeze(user);  // imutável
Object.fromEntries([['a',1],['b',2]]); // { a:1, b:2 }
```

## Protótipos

```javascript
function Animal(nome) { this.nome = nome; }
Animal.prototype.falar = function() {
  return `${this.nome} faz um som`;
};
const a = new Animal('Rex');
a.falar();
```

::tip::Hoje prefira `class` a funções-construtoras. Protótipos continuam sendo a base, mas `class` é mais legível.::end::

## Proxy e Reflect — meta-programação

```javascript
const alvo = { nome: 'Ana' };
const proxy = new Proxy(alvo, {
  get(obj, prop) {
    return prop in obj ? obj[prop] : `⚠️ '${prop}' não existe`;
  }
});
proxy.nome;      // 'Ana'
proxy.qualquer;  // "⚠️ 'qualquer' não existe"
```

## Playground

::play::
const prefs = { tema: 'dark', lang: 'pt' };
const proxy = new Proxy(prefs, {
  set(obj, k, v) {
    console.log(`alterando ${k}: ${obj[k]} → ${v}`);
    obj[k] = v; return true;
  }
});
proxy.tema = 'light';
proxy.lang = 'en';
console.log(prefs);
::end::