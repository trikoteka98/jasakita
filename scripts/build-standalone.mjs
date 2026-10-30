// Ubah hasil build (dist/) menjadi SATU file HTML mandiri.
// Semua CSS, JS, font, ikon, dan gambar di-inline sebagai data URI,
// sehingga file bisa dibuka langsung di browser HP tanpa server/internet.
// Jalankan: node scripts/build-standalone.mjs
import fs from 'node:fs'
import path from 'node:path'

const DIST = 'dist'
const OUT = 'JasaKita.html'
const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}

const dataUri = (file) => {
  const ext = path.extname(file).toLowerCase()
  const buf = fs.readFileSync(file)
  return `data:${MIME[ext] || 'application/octet-stream'};base64,${buf.toString('base64')}`
}

let html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')

/** Ganti tag HTML dengan aman (tanpa interpretasi pola $ pada string pengganti). */
const replaceTag = (tagHtml, replacement) => {
  const at = html.indexOf(tagHtml)
  if (at === -1) throw new Error('tag tidak ditemukan: ' + tagHtml.slice(0, 60))
  html = html.slice(0, at) + replacement + html.slice(at + tagHtml.length)
}

// ---------- 1. Inline CSS ----------
const cssMatch = html.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/)
if (!cssMatch) throw new Error('CSS tidak ditemukan di dist/index.html')
const cssHref = cssMatch[1]
const cssFile = path.join(DIST, cssHref.replace(/^\.\//, ''))
const cssDir = path.dirname(cssFile)
let css = fs.readFileSync(cssFile, 'utf8')

// a) @font-face: simpan hanya sumber woff2 (buang woff/ttf agar file kecil)
css = css.replace(/src:\s*([^;]+);/g, (full, val) => {
  if (!val.includes('url(')) return full
  const parts = val.split(/,(?=\s*url\()/).map((s) => s.trim())
  const woff2 = parts.filter((p) => p.includes('.woff2') || p.includes('font/woff2'))
  if (!woff2.length) return full
  return 'src: ' + woff2.join(', ') + ';'
})

// b) ganti url() font/gambar menjadi data URI (path relatif terhadap file CSS)
css = css.replace(/url\((["']?)([^)"']+)\1\)/g, (full, q, ref) => {
  if (ref.startsWith('data:')) return full
  const abs = path.resolve(cssDir, ref)
  if (!fs.existsSync(abs)) return 'url()'
  return `url(${dataUri(abs)})`
})
// rapikan sisa url() kosong
css = css.replace(/,\s*url\(\)/g, '').replace(/url\(\)\s*,?/g, '')

replaceTag(cssMatch[0], `<style>${css}</style>`)

// ---------- 2. Inline JS ----------
const jsMatch = html.match(/<script[^>]*type="module"[^>]*src="([^"]+)"[^>]*><\/script>/)
if (!jsMatch) throw new Error('JS module tidak ditemukan di dist/index.html')
const jsFile = path.join(DIST, jsMatch[1].replace(/^\.\//, ''))
let js = fs.readFileSync(jsFile, 'utf8')

// c) ganti referensi gambar lokal (relatif terhadap halaman) menjadi data URI
const imgRefs = [...new Set(js.match(/\.\/img\/[A-Za-z0-9._-]+/g) || [])]
let inlinedImgs = 0
for (const ref of imgRefs) {
  const file = path.join(DIST, ref.replace(/^\.\//, ''))
  if (!fs.existsSync(file)) continue
  const uri = dataUri(file)
  const before = js
  js = js.split(`"${ref}"`).join(`"${uri}"`).split(`'${ref}'`).join(`'${uri}'`)
  if (js !== before) inlinedImgs++
}

// d) amankan kalau ada teks </script di dalam kode
js = js.replace(/<\/script/gi, '<\\/script')

replaceTag(jsMatch[0], `<script type="module">${js}</script>`)

// ---------- 3. Ikon & manifest ----------
const iconMatch = html.match(/<link[^>]*rel="icon"[^>]*href="([^"]+)"[^>]*>/)
if (iconMatch) {
  const iconFile = path.join(DIST, iconMatch[1].replace(/^\.\//, ''))
  replaceTag(iconMatch[0], `<link rel="icon" type="image/png" href="${dataUri(iconFile)}" />`)
}
html = html.replace(/<link[^>]*rel="manifest"[^>]*>\s*/i, '')
html = html.replace(/<link[^>]*rel="apple-touch-icon"[^>]*>\s*/i, '')
html = html.replace(/\scrossorigin(="[^"]*")?/g, '')

fs.writeFileSync(OUT, html)

// ---------- 4. Laporan ----------
const kb = (n) => (n / 1024).toFixed(0) + ' KB'
console.log('File mandiri dibuat:', OUT, '→', kb(fs.statSync(OUT).size))
console.log('  · CSS inline :', kb(css.length))
console.log('  · JS inline  :', kb(js.length))
console.log('  · gambar     :', inlinedImgs, 'di-inline')
const fonts = (html.match(/data:font\/woff2;base64,/g) || []).length
console.log('  · font woff2 :', fonts, 'di-inline')
const scriptsWithSrc = (html.match(/<script[^>]*\ssrc=/g) || []).length
const extCss = (html.match(/<link[^>]*rel="stylesheet"/g) || []).length
console.log('  · sisa <script src> :', scriptsWithSrc, '| sisa <link stylesheet> :', extCss)
const external = [...new Set([...html.matchAll(/https?:\/\/[^\s"'<>)]+/g)].map((m) => m[0]))]
  .filter((u) => !u.includes('wa.me') && !u.includes('fontawesome.com') && !u.includes('animate.style') && !u.includes('opensource.org') && !u.includes('reactjs.org') && !u.includes('w3.org'))
console.log('  · referensi eksternal (aset):', external.length ? external : 'tidak ada ✅')
if (scriptsWithSrc || extCss) process.exitCode = 1