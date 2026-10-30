// Verifikasi file mandiri (JasaKita.html) benar-benar bisa dijalankan:
// - ekstrak <script type="module"> inline
// - jalankan di dalam jsdom (simulasi browser)
// - pastikan aplikasi React berhasil render
// Jalankan: node scripts/verify-standalone.mjs
import fs from 'node:fs'
import { JSDOM } from 'jsdom'

const FILE = 'JasaKita.html'
const html = fs.readFileSync(FILE, 'utf8')

// 1. Ambil isi script module inline
const m = html.match(/<script type="module">([\s\S]*?)<\/script>/)
if (!m) {
  console.error('✗ script module inline tidak ditemukan')
  process.exit(1)
}
const code = m[1]

// 2. Siapkan DOM tiruan
const dom = new JSDOM(
  '<!doctype html><html><head><style></style></head><body><div id="root"></div></body></html>',
  { url: 'http://localhost/', pretendToBeVisual: true, runScripts: 'outside-only' }
)
const { window } = dom

// Stub API browser yang tidak ada di jsdom
window.matchMedia =
  window.matchMedia ||
  ((q) => ({
    matches: false,
    media: q,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  }))

// Jalankan bundel (kode tidak memakai import/export)
try {
  window.eval(code)
} catch (e) {
  console.error('✗ GAGAL mengeksekusi bundel:', e.message)
  process.exit(1)
}

// 3. Beri waktu React merender
await new Promise((r) => setTimeout(r, 700))

const root = window.document.getElementById('root')
const rendered = root ? root.innerHTML : ''
const checks = [
  ['root terisi', rendered.length > 500],
  ['judul hero', rendered.includes('Butuh Jasa Apa')],
  ['kota Jayapura', rendered.includes('Kota Jayapura')],
  ['kategori tampil', rendered.includes('Pilih Kategori Jasa')],
  ['slot sponsor', rendered.includes('Slot Sponsor') || rendered.includes('Didukung oleh')],
  ['navigasi bawah', rendered.includes('bottom-nav')],
  ['tombol katalog', rendered.includes('Jelajahi Katalog')],
]
let fail = 0
for (const [label, ok] of checks) {
  console.log((ok ? '✓' : '✗') + ' ' + label)
  if (!ok) fail++
}

// 4. Cek interaksi dasar: klik tab Katalog
try {
  const navButtons = [...window.document.querySelectorAll('.nav-item')]
  const katalogBtn = navButtons.find((b) => b.textContent.includes('Katalog'))
  if (katalogBtn) {
    katalogBtn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
    await new Promise((r) => setTimeout(r, 500))
    const after = root.innerHTML
    const ok = after.includes('Cari jasa') || after.includes('Cakupan wilayah')
    console.log((ok ? '✓' : '✗') + ' navigasi ke Katalog berfungsi')
    if (!ok) fail++
  } else {
    console.log('✗ tombol Katalog tidak ditemukan')
    fail++
  }
} catch (e) {
  console.log('✗ interaksi gagal:', e.message)
  fail++
}

console.log(fail ? `\n❌ ${fail} pemeriksaan gagal` : '\n✅ File mandiri berjalan normal di lingkungan browser tiruan')
process.exit(fail ? 1 : 0)