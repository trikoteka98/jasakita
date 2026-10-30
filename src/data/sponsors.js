// ============================================================
// DATA SPONSOR & TEMPAT (SLOT) IKLAN
//
// Slot = tempat tampilan yang bisa diisi sponsor (Mitra).
// Untuk mengisi: isi `sponsorId` pada slot dengan id sponsor di
// bawah, atau biarkan null supaya tampil sebagai "slot tersedia".
// ============================================================

// Paket sponsorship (dipakai di halaman Akun & pendaftaran Mitra)
export const paketSponsor = [
  {
    id: 'bronze',
    nama: 'Bronze',
    harga: 150000,
    benefit: '1 slot kartu kecil, tampil di halaman detail penyedia',
    slots: 1,
  },
  {
    id: 'silver',
    nama: 'Silver',
    harga: 350000,
    benefit: '1 banner di halaman katalog + strip logo beranda',
    slots: 2,
  },
  {
    id: 'gold',
    nama: 'Gold',
    harga: 750000,
    benefit: 'Banner utama beranda + banner katalog + prioritas tampil',
    slots: 3,
  },
]

// Tempat (slot) tampilan sponsor di dalam aplikasi
export const sponsorSlots = [
  {
    id: 'hero-banner',
    nama: 'Banner Utama Beranda',
    tempat: 'Beranda · di bawah hero',
    ukuran: '720 × 180 px',
    level: 'Gold',
    sponsorId: null,
  },
  {
    id: 'catalog-banner',
    nama: 'Banner Halaman Katalog',
    tempat: 'Katalog · di bawah pencarian',
    ukuran: '720 × 140 px',
    level: 'Silver',
    sponsorId: 's2',
  },
  {
    id: 'home-strip',
    nama: 'Strip Logo Beranda',
    tempat: 'Beranda · "Didukung oleh"',
    ukuran: 'logo 96 × 96 px',
    level: 'Silver',
    sponsorId: null,
  },
  {
    id: 'detail-card',
    nama: 'Kartu Sponsor Detail',
    tempat: 'Detail penyedia · bawah info',
    ukuran: '720 × 120 px',
    level: 'Bronze',
    sponsorId: 's1',
  },
  {
    id: 'booking-footer',
    nama: 'Strip Bawah Formulir',
    tempat: 'Pemesanan · bawah tombol kirim',
    ukuran: '720 × 100 px',
    level: 'Bronze',
    sponsorId: null,
  },
]

// Daftar sponsor aktif (contoh — ganti dengan mitra sungguhan)
export const sponsors = [
  {
    id: 's1',
    nama: 'CV Cenderawasih Teknik',
    tagline: 'Supplier alat teknik & bangunan di Jayapura',
    inisial: 'CT',
    warna: '#0ea5e9',
    level: 'Bronze',
    whatsapp: '6281234500101',
    kota: 'Abepura',
  },
  {
    id: 's2',
    nama: 'Kopi Port Numbay',
    tagline: 'Kopi lokal Papua, biji segar setiap minggu',
    inisial: 'KN',
    warna: '#f59e0b',
    level: 'Silver',
    whatsapp: '6281234500102',
    kota: 'Jayapura Utara',
  },
]

// Helper
export const getSponsor = (id) => sponsors.find((s) => s.id === id) || null

export const getSlot = (id) => sponsorSlots.find((sl) => sl.id === id) || null

// Sponsor yang mengisi slot tertentu (null kalau slot masih kosong)
export const slotSponsor = (slotId) => {
  const slot = getSlot(slotId)
  if (!slot || !slot.sponsorId) return null
  return getSponsor(slot.sponsorId)
}

// Slot yang masih tersedia untuk diisi mitra
export const openSlots = () => sponsorSlots.filter((s) => !s.sponsorId)

export const formatRupiah = (n) => 'Rp ' + n.toLocaleString('id-ID')