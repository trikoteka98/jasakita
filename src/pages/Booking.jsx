import { useState } from 'react'
import { getProvider, formatRupiah, phoneToWa } from '../data/providers.js'
import { site } from '../data/site.js'
import SponsorSlot from '../components/SponsorSlot.jsx'
import { store } from '../lib/storage.js'

export default function Booking({ nav, providerId }) {
  const p = getProvider(providerId)
  const [form, setForm] = useState({ nama: '', hp: '', tanggal: '', catatan: '' })
  const [sent, setSent] = useState(false)

  if (!p) {
    return (
      <div className="empty">
        <span className="emoji">🤔</span>
        Penyedia tidak ditemukan.
      </div>
    )
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const simpanPesanan = () => {
    const orders = store.get('jasakita_orders', [])
    orders.unshift({
      id: Date.now(),
      provider: p.name,
      skill: p.skill,
      price: p.price,
      unit: p.unit,
      ...form,
      status: 'Menunggu Konfirmasi',
      createdAt: new Date().toLocaleString('id-ID'),
    })
    store.set('jasakita_orders', orders)
  }

  const submit = (e) => {
    e.preventDefault()
    simpanPesanan()
    setSent(true)
    const msg = encodeURIComponent(
      `Halo ${p.name}! Saya ingin memesan jasa ${p.skill}.\n\n` +
        `Nama: ${form.nama}\nNo. HP: ${form.hp}\nTanggal: ${form.tanggal || 'sesuai kesepakatan'}\n` +
        `Catatan: ${form.catatan || '-'}\n\nTerkirim dari aplikasi ${site.name}.`
    )
    window.open(phoneToWa(p.phone) + '?text=' + msg, '_blank')
  }

  if (sent) {
    return (
      <div className="empty">
        <span className="emoji" style={{ color: '#16a34a' }}><i className="fa-solid fa-circle-check" /></span>
        <b>Pesanan berhasil dibuat!</b>
        <p style={{ marginTop: 8 }}>
          Pesananmu untuk <b>{p.name}</b> sudah tersimpan.
          <br />
          WhatsApp terbuka untuk konfirmasi — jika tidak terbuka, hubungi langsung nomor penyedia.
        </p>
        <div className="btn-row" style={{ marginTop: 20 }}>
          <button className="btn btn-outline" onClick={() => nav('orders')}>Lihat Pesanan</button>
          <button className="btn btn-primary" onClick={() => nav('home')}>Ke Beranda</button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="topbar">
        <button className="back-btn" onClick={() => nav('detail', { providerId: p.id })}>
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1>Pemesanan</h1>
      </div>

      <div className="form-summary" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {p.photo ? (
          <img
            src={p.photo}
            alt={p.name}
            className="avatar avatar-photo"
            style={{ width: 48, height: 48, borderRadius: 14 }}
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : null}
        <div>
          Memesan: <b>{p.name}</b>
          <br />
          <span style={{ fontSize: '0.78rem', color: '#0f766e' }}>
            {p.skill} · {formatRupiah(p.price)} / {p.unit}
          </span>
        </div>
      </div>

      <form onSubmit={submit}>
        <div className="form-group">
          <label>Nama Lengkap *</label>
          <input required placeholder="cth: Budi Santoso" value={form.nama} onChange={set('nama')} />
        </div>
        <div className="form-group">
          <label>No. WhatsApp *</label>
          <input
            required
            type="tel"
            pattern="[0-9+ ]{9,16}"
            placeholder="cth: 0812xxxxxxx"
            value={form.hp}
            onChange={set('hp')}
          />
        </div>
        <div className="form-group">
          <label>Tanggal / Jadwal</label>
          <input type="date" value={form.tanggal} onChange={set('tanggal')} />
        </div>
        <div className="form-group">
          <label>Catatan</label>
          <textarea
            placeholder="cth: mau servis HP di rumah, alamat lengkap, dll."
            value={form.catatan}
            onChange={set('catatan')}
          />
        </div>
        <button type="submit" className="btn btn-primary"><i className="fa-solid fa-paper-plane" /> Kirim Pesanan</button>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 10, textAlign: 'center' }}>
          Pesanan akan dikirim ke WhatsApp {p.name} dan tersimpan di halaman Pesanan.
        </p>
      </form>

      <SponsorSlot slotId="booking-footer" nav={nav} variant="compact" />
    </>
  )
}
