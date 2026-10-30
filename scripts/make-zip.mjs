// Buat ZIP dari folder dist/ untuk diunggah ke hosting statis
// (Netlify Drop, GitHub Pages, Vercel, cPanel, dll).
// Jalankan: node scripts/make-zip.mjs
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const SRC = 'dist'
const OUT = 'JasaKita-website.zip'

if (!fs.existsSync(SRC)) {
  console.error('Folder dist/ belum ada. Jalankan: npm run build')
  process.exit(1)
}
if (fs.existsSync(OUT)) fs.rmSync(OUT)

// Pakai `zip` kalau tersedia, kalau tidak pakai Python zipfile
let ok = false
try {
  execFileSync('zip', ['-r', '-q', OUT, '.'], { cwd: SRC })
  ok = true
} catch {
  try {
    execFileSync('python3', [
      '-c',
      'import zipfile,pathlib;' +
        'z=zipfile.ZipFile("' + OUT + '","w",zipfile.ZIP_DEFLATED,compresslevel=9);' +
        '[z.write(str(f),str(f.relative_to("' + SRC + '"))) for f in sorted(pathlib.Path("' + SRC + '").rglob("*")) if f.is_file()];' +
        'z.close()',
    ])
    ok = true
  } catch (e) {
    console.error('Gagal membuat ZIP:', e.message)
    process.exit(1)
  }
}

const size = fs.statSync(OUT).size
console.log(`ZIP dibuat: ${OUT} → ${(size / 1024 / 1024).toFixed(2)} MB`)
console.log(`Isi folder ${SRC}/ siap diunggah ke hosting statis.`)
if (!ok) process.exit(1)