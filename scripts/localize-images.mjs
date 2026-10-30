// Script sekali pakai: unduh semua gambar eksternal ke public/img
// lalu ubah data aplikasi memakai path lokal (tanpa CDN).
// Jalankan: node scripts/localize-images.mjs
import fs from 'node:fs'
import path from 'node:path'

const OUT = 'public/img'
fs.mkdirSync(OUT, { recursive: true })

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36'

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(dest, buf)
  return buf.length
}

const extOf = (ct) =>
  ct && ct.includes('png') ? '.png' : ct && ct.includes('webp') ? '.webp' : '.jpg'

// ---------- 1. Gambar banner & kategori ----------
const imgMod = await import('../src/data/images.js?t=' + Date.now())
const bannerEntries = [
  ['hero.jpg', imgMod.heroImage],
  ['catalog.jpg', imgMod.catalogImage],
  ['about.jpg', imgMod.aboutImage],
  ['booking.jpg', imgMod.bookingImage],
]

let total = 0
const done = []
for (const [name, url] of bannerEntries) {
  const n = await download(url, path.join(OUT, name))
  done.push(`${name} (${(n / 1024).toFixed(0)} KB)`)
  total += n
}

const catLines = []
for (const [id, url] of Object.entries(imgMod.categoryImages)) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  const ct = res.headers.get('content-type') || ''
  const ext = extOf(ct)
  const name = `cat-${id}${ext}`
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(path.join(OUT, name), buf)
  total += buf.length
  done.push(`${name} (${(buf.length / 1024).toFixed(0)} KB)`)
  catLines.push(`  ${id}: './img/${name}',`)
  void res
}

// ---------- 2. Foto penyedia ----------
const provMod = await import('../src/data/providers.js?t=' + Date.now())
const photoMap = new Map() // url -> path lokal
let idx = 0
for (const p of provMod.providers) {
  idx++
  const url = p.photo
  if (photoMap.has(url)) continue
  const name = `av-${String(idx).padStart(2, '0')}.jpg`
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`foto gagal: ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(path.join(OUT, name), buf)
  total += buf.length
  photoMap.set(url, `./img/${name}`)
}
done.push(`${photoMap.size} foto penyedia`)

// ---------- 3. Tulis images.js baru ----------
const imagesJs = `// ============================================================
// ASET GAMBAR — semua file lokal di public/img (tanpa CDN)
// Ganti file di public/img kalau mau memakai foto sendiri.
// ============================================================

// Foto besar untuk hero / banner halaman
export const heroImage = './img/hero.jpg'
export const aboutImage = './img/about.jpg'
export const bookingImage = './img/booking.jpg'
export const catalogImage = './img/catalog.jpg'

// Foto per kategori jasa
export const categoryImages = {
${catLines.join('\n')}
}

// Fallback: gradient CSS kalau gambar tidak tersedia
export const fallbackGradient = (color = '#0d9488') =>
  \`linear-gradient(135deg, \${color}, #0f172a)\`
`
fs.writeFileSync('src/data/images.js', imagesJs)
console.log('Ditulis src/data/images.js')

// ---------- 4. Ganti URL foto di providers.js menjadi path lokal ----------
let providersJs = fs.readFileSync('src/data/providers.js', 'utf8')
let replaced = 0
for (const [url, local] of photoMap) {
  for (const q of ["'", '"']) {
    const needle = `${q}${url}${q}`
    while (providersJs.includes(needle)) {
      providersJs = providersJs.replace(needle, `'${local}'`)
      replaced++
    }
  }
}
fs.writeFileSync('src/data/providers.js', providersJs)
console.log('URL foto diganti:', replaced)

console.log('\nSelesai. File di public/img:')
for (const d of done) console.log('  -', d)
console.log('Total gambar:', (total / 1024).toFixed(0), 'KB')
console.log('Jumlah file:', fs.readdirSync(OUT).length)