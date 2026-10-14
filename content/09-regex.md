## Criando expressões regulares

```javascript
const re1 = /abc/i;             // literal
const re2 = new RegExp('abc', 'i'); // construtor
```

## Flags essenciais

| Flag | Significado                          |
|------|--------------------------------------|
| `g`  | global (todas as ocorrências)        |
| `i`  | case-insensitive                     |
| `m`  | multiline (`^`/`$` por linha)        |
| `s`  | dotall (`.` casa `\n`)               |
| `u`  | unicode                              |
| `y`  | sticky                               |

## Métodos principais

```javascript
/foo/.test('foobar');           // true
'foobar'.match(/o+/g);          // ['oo']
'a,b,c'.split(/,/);             // ['a','b','c']
'2026-01-15'.replace(/(\d+)-(\d+)-(\d+)/, '$3/$2/$1');
// '15/01/2026'
```

## Grupos nomeados

```javascript
const re = /(?<ano>\d{4})-(?<mes>\d{2})-(?<dia>\d{2})/;
const m = re.exec('2026-01-15');
m.groups.ano; // '2026'
```

## Lookahead / lookbehind

```javascript
/\d+(?=px)/.exec('100px');   // ['100']  — antes de 'px'
/(?<=\$)\d+/.exec('$50');    // ['50']   — depois de '$'
```

::tip::Valide e teste regex em [regex101.com](https://regex101.com) antes de colocá-las em produção. Sempre prefira grupos nomeados para clareza.::end::

## Playground

::play::
const re = /(?<usuario>[\w.]+)@(?<dominio>[\w.]+)/;
const email = 'ana.silva@exemplo.com';
const m = re.exec(email);
console.log('usuário:', m.groups.usuario);
console.log('domínio:', m.groups.dominio);
::end::