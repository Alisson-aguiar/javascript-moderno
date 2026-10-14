## Por que Typed Arrays?

Arrays comuns são flexíveis mas lentos para dados binários (imagens, áudio, WebGL, streaming). Typed Arrays dão acesso a bytes com tipos fixos.

## ArrayBuffer

```javascript
const buf = new ArrayBuffer(16); // 16 bytes
buf.byteLength; // 16
```

## Views tipadas

| Tipo           | Bytes | Faixa                          |
|----------------|-------|--------------------------------|
| `Int8Array`    | 1     | -128 a 127                     |
| `Uint8Array`   | 1     | 0 a 255                        |
| `Int16Array`   | 2     | -32768 a 32767                 |
| `Uint32Array`  | 4     | 0 a 2³²-1                      |
| `Float32Array` | 4     | IEEE 754 simples               |
| `Float64Array` | 8     | IEEE 754 duplo                 |
| `BigInt64Array`| 8     | inteiros 64 bits               |

```javascript
const i32 = new Int32Array(4);
i32[0] = 42;
i32[1] = -1;
```

## Caso real: imagem em canvas

```javascript
const img = ctx.getImageData(0, 0, w, h);
const px = img.data; // Uint8ClampedArray
for (let i = 0; i < px.length; i += 4) {
  px[i]     = 255 - px[i];     // R
  px[i + 1] = 255 - px[i + 1]; // G
  px[i + 2] = 255 - px[i + 2]; // B
}
ctx.putImageData(img, 0, 0);
```

::tip::`Uint8Array` é o tipo usado por `fetch` (`response.arrayBuffer()`), WebSockets binários e leitura de arquivos.::end::

## Playground

::play::
const buf = new ArrayBuffer(8);
const i32 = new Int32Array(buf);
const u8 = new Uint8Array(buf);
i32[0] = 0x01020304;
console.log('bytes:', [...u8].map(b => b.toString(16).padStart(2,'0')).join(' '));
::end::