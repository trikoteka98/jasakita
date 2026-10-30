# JasaKita — Aplikasi Pemesanan Jasa (React PWA)

Aplikasi web bergaya mobile app untuk pemesanan jasa **di Kota Jayapura, Papua**:
pilih kategori → lihat katalog penyedia → cek cakupan wilayah → pesan via WhatsApp.
Bisa di-install ke home screen HP (PWA) dan jalan offline.

Wilayah layanan: **Jayapura Utara, Jayapura Selatan, Abepura, Heram, Muara Tami**.
Setiap penyedia punya `location` (distrik domisili) dan `coverage` (cakupan wilayah
yang bisa dilayani). Katalog bisa difilter berdasarkan distrik.

## Slot sponsor (Mitra)

Aplikasi punya 5 **tempat tampilan** yang bisa diisi sponsor — diatur di
`src/data/sponsors.js` (isi `sponsorId` pada slot, `null` = tampil "Slot Tersedia"):

| Slot | Tempat | Ukuran | Level |
|---|---|---|---|
| `hero-banner` | Beranda, di bawah hero | 720×180 | Gold |
| `catalog-banner` | Katalog, di bawah pencarian | 720×140 | Silver |
| `home-strip` | Beranda, "Didukung oleh" (logo berjalan) | 96×96 | Silver |
| `detail-card` | Detail penyedia | 720×120 | Bronze |
| `booking-footer` | Bawah formulir pemesanan | 720×100 | Bronze |

Paket: **Bronze Rp 150.000** · **Silver Rp 350.000** · **Gold Rp 750.000** per bulan.
Status slot & paket bisa dilihat di tab **Akun → Slot Sponsor**.

## Struktur

```
aplikasi-jasa/
├── index.html
├── package.json
├── vite.config.js
├── public/                # aset PWA (manifest, ikon, service worker)
├── src/
│   ├── main.jsx           # entry + daftar service worker
│   ├── App.jsx            # navigasi antar halaman
│   ├── index.css          # semua styling
│   ├── data/
│   │   ├── site.js        # ⚙️ EDIT DI SINI: nama usaha, misi, visi, kontak
│   │   ├── providers.js   # ⚙️ EDIT DI SINI: 10 kategori & 28 penyedia + cakupan wilayah
│   │   ├── sponsors.js    # ⚙️ EDIT DI SINI: slot sponsor, paket, data sponsor
│   │   └── images.js      # ⚙️ EDIT DI SINI: URL foto background & banner
│   ├── lib/
│   │   └── theme.js       # tema terang / gelap / ikuti sistem
│   ├── components/
│   │   ├── BottomNav.jsx
│   │   ├── ProviderCard.jsx
│   └── pages/
│       ├── Home.jsx       # beranda + pilih "butuh jasa apa"
│       ├── Catalog.jsx    # katalog penyedia (cari + filter + urutkan)
│       ├── ProviderDetail.jsx
│       ├── Booking.jsx    # formulir pemesanan → WhatsApp
│       ├── Orders.jsx     # "Pesanan Saya" (localStorage)
│       ├── Account.jsx    # AKUN: tema, daftar mitra/kontributor, menu
│       ├── Register.jsx   # form pendaftaran Mitra & Kontributor
│       └── About.jsx      # tentang aplikasi (dibuka dari Akun)
└── make-icons.mjs         # regenerasi ikon (node make-icons.mjs)
```

## Akun: Mitra & Kontributor

Tab **Akun** (menggantikan tab Tentang) berisi pemilih tema dan 2 jalur pendaftaran:

| Jalur | Untuk siapa | Yang didapat |
|---|---|---|
| **Mitra** | Sponsor / pemilik usaha yang mendukung platform | Logo & nama usaha tampil sebagai sponsor, prioritas di beranda, paket Bronze/Silver/Gold |
| **Kontributor** | Orang yang bersedia menjual jasanya | Profil masuk katalog penyedia, terima pesanan via WhatsApp, atur sendiri tarif & jam kerja |

Pendaftaran disimpan di `localStorage` (`jasakita_partners`) dengan status
*Menunggu Verifikasi*, lalu bisa dikirim ke admin lewat WhatsApp dari halaman sukses.

## Tema terang / gelap

Pilih di **Akun → Tema Tampilan**: Terang, Gelap, atau Sistem (mengikuti HP).
Preferensi disimpan di `localStorage` (`jasakita_theme`) dan diterapkan sebelum
halaman digambar (tanpa kedip). Tombol tema memakai `data-theme` di `<html>`.

## Animasi & background

- **Background aurora**: 5 blob gradien berblur yang bergerak pelan di belakang
  konten (`src/components/AnimatedBackground.jsx`, hanya animasi `transform` +
  `will-change` supaya ringan), plus tekstur titik halus yang bergeser.
- **Ken Burns**: foto hero dan banner bergerak zoom pelan (26–30 detik).
- **Transisi halaman**: setiap pindah tab muncul dengan fade + naik
  (`.page-enter`).
- Animasi lain: count-up angka, marquee logo sponsor, shimmer slot kosong,
  float emoji kategori, pulse badge.
- Semua animasi otomatis mati bila pengguna mengaktifkan
  *prefers-reduced-motion* di HP.

## Cara pakai

```bash
npm install        # instal dependensi
npm run dev        # mode pengembangan (http://localhost:5173)
npm run build      # build produksi ke dist/
npm run preview    # pratinjau hasil build (http://localhost:4173)
```

## Cara mengedit data (tanpa menyentuh kode lain)

1. **Nama usaha / kontak** → `src/data/site.js`
2. **Kategori & penyedia jasa** → `src/data/providers.js`
   - Saat ini: **10 kategori** & **28 penyedia** di Kota Jayapura
   - Tambah penyedia baru: salin blok `{ id, category, name, skill, desc, price, ... }`
   - `price` dalam Rupiah, `phone` format internasional tanpa `+` (cth `62812...`)
   - `location` = distrik domisili, `coverage` = array distrik yang dilayani
   - `photo` = path foto lokal (default `./img/av-XX.jpg`); kalau gagal dimuat
     otomatis jadi inisial nama
3. **Gambar background & banner** → `src/data/images.js`
   - Semua gambar **lokal** di `public/img/` (tidak pakai CDN)
   - `heroImage`, `catalogImage`, `aboutImage`, `bookingImage` = banner halaman
   - `categoryImages` = foto per kategori

## Cara membuka di HP

### A. Satu file (paling mudah, tanpa internet)

1. Salin file **`JasaKita.html`** ke HP (unduh / kirim ke diri sendiri).
2. Buka dengan **Chrome** (File manager → ketuk file → buka dengan Chrome).
3. Aplikasi langsung jalan — semua kode, font, ikon, dan gambar sudah di dalam
   file itu (±1,7 MB), jadi tidak perlu internet.

> Di Chrome bisa juga: menu ⋮ → **Tambahkan ke layar utama** supaya ada ikonnya.

### B. ZIP untuk hosting (bisa di-install sebagai PWA)

1. Unggah isi **`JasaKita-website.zip`** ke hosting statis gratis:
   - Netlify Drop (drag & drop, tanpa akun), atau
   - GitHub Pages / Vercel / Cloudflare Pages.
2. Buka link hasilnya di HP dengan Chrome.
3. Menu ⋮ → **Instal aplikasi / Tambahkan ke layar utama** → jadi aplikasi
   fullscreen, punya ikon sendiri, dan bisa dipakai offline (service worker).

### Catatan soal APK

APK Android asli butuh **Android SDK + Java (~2 GB)** dan build Gradle, yang
tidak tersedia di lingkungan ini. Kalau tetap perlu APK, opsinya:
bungkus hasil build dengan **Capacitor** / **Bubblewrap (TWA)** di komputer
yang punya Android Studio, lalu isi URL hasil hosting.

## Perintah build

```bash
npm run dev        # mode pengembangan (http://localhost:5173)
npm run build      # build produksi ke dist/
npm run preview    # pratinjau hasil build (http://localhost:4173)
npm run app        # build + buat file mandiri JasaKita.html
npm run zip        # buat JasaKita-website.zip dari dist/
npm run verify     # uji file mandiri benar-benar berjalan (jsdom)
npm run release    # semuanya: build + file mandiri + zip + verifikasi
```

## Fitur tampilan

- Hero dengan **foto background** + overlay gradient
- Kartu kategori bergambar dengan warna khas tiap kategori
- **Pencarian** (nama/jasa/lokasi/tag) & **urutkan** (rating/termurah/termahal)
- Avatar penyedia pakai **foto asli** (fallback ke inisial)
- Banner bergambar di halaman Katalog, Detail, dan Tentang
- Animasi masuk bertahap (Animate.css) + ikon Font Awesome
- Font **Plus Jakarta Sans** (Google Fonts)

## Install ke HP (PWA)

1. Buka URL aplikasi di Chrome.
2. Menu ⋮ → **Add to Home screen / Instal aplikasi**.
3. Aplikasi muncul di home screen, bisa dibuka fullscreen & offline.
