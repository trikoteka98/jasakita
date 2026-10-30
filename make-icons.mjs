// Buat ikon PWA (192 & 512) tanpa dependensi — encoder PNG murni Node.js
import zlib from 'node:zlib'
import fs from 'node:fs'
import path from 'node:path'

// --- CRC32 ---
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()
function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

// --- PNG encoder (RGBA8) ---
function encodePNG(width, height, rgba) {
  const raw = Buffer.alloc(height * (1 + width * 4))
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0 // filter: None
    rgba.copy(raw, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4)
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const typeBuf = Buffer.from(type, 'ascii')
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
    return Buffer.concat([len, typeBuf, data, crc])
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// --- Gambar ikon ---
// Huruf "J" bitmap 5x7
const J_GLYPH = [
  '01111',
  '00010',
  '00010',
  '00010',
  '10010',
  '10010',
  '01100',
]

function makeIcon(size) {
  const px = Buffer.alloc(size * size * 4)
  const top = [13, 148, 136], bottom = [15, 118, 110]
  const radius = size * 0.22
  const cx = size / 2, cy = size / 2

  const cell = size / 8
  const gw = J_GLYPH[0].length * cell
  const gh = J_GLYPH.length * cell
  const ox = (size - gw) / 2
  const oy = (size - gh) / 2

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const t = y / size
      const r = Math.round(top[0] + (bottom[0] - top[0]) * t)
      const g = Math.round(top[1] + (bottom[1] - top[1]) * t)
      const b = Math.round(top[2] + (bottom[2] - top[2]) * t)
      // rounded corner alpha
      let a = 255
      const dx = Math.max(Math.abs(x - cx) - (size / 2 - radius), 0)
      const dy = Math.max(Math.abs(y - cy) - (size / 2 - radius), 0)
      if (Math.hypot(dx, dy) > radius) a = 0
      // letter pixel
      const gx = Math.floor((x - ox) / cell)
      const gy = Math.floor((y - oy) / cell)
      const inLetter =
        gx >= 0 && gy >= 0 && gx < J_GLYPH[0].length && gy < J_GLYPH.length &&
        J_GLYPH[gy][gx] === '1'
      const i = (y * size + x) * 4
      if (inLetter) {
        px[i] = 255; px[i + 1] = 255; px[i + 2] = 255; px[i + 3] = a
      } else {
        px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = a
      }
    }
  }
  return encodePNG(size, size, px)
}

for (const s of [192, 512]) {
  const p = path.join('public', `icon-${s}.png`)
  fs.writeFileSync(p, makeIcon(s))
  console.log('ok', p, fs.statSync(p).size, 'bytes')
}
console.log('Ikon selesai.')
