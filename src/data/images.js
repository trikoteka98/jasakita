// ============================================================
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
  umum: './img/cat-umum.jpg',
  kebersihan: './img/cat-kebersihan.jpg',
  kecantikan: './img/cat-kecantikan.jpg',
  bangunan: './img/cat-bangunan.jpg',
  listrik: './img/cat-listrik.jpg',
  elektronik: './img/cat-elektronik.jpg',
  digital: './img/cat-digital.jpg',
  tulisan: './img/cat-tulisan.jpg',
  angkut: './img/cat-angkut.jpg',
  lainnya: './img/cat-lainnya.jpg',
}

// Fallback: gradient CSS kalau gambar tidak tersedia
export const fallbackGradient = (color = '#0d9488') =>
  `linear-gradient(135deg, ${color}, #0f172a)`
