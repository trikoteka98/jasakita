import { useState } from 'react'
import { categories, phoneToWa } from '../data/providers.js'
import { site } from '../data/site.js'
import { paketSponsor as PAKET } from '../data/sponsors.js'
import { store } from '../lib/storage.js'

const CONFIG = {
  mitra: {
    title: 'Pendaftaran Mitra',
    sub: 'Mitra = sponsor yang mendukung platform',
    icon: 'fa-solid fa-handshake-angle',
    hdr: 'Daftar sebagai Mitra (Sponsor)',
  },
  kontributor: {
    title: 'Pendaftaran Kontributor',
    sub: 'Kontributor = penyedia jasa yang menerima pesanan',
    icon: 'fa-solid fa-briefcase',
    hdr: 'Daftar sebagai Kontributor',
  },
}

export default function Register({ nav, type }) {
  const cfg = CONFIG[type] || CONFIG.kontributor
  const isMitra = type === 'mitra'

  const [form, setForm] = useState(
    isMitra
      ? { namaUsaha: '', pic: '', wa: '', paket: 'bronze', pesan: '' }
      : { nama: '', wa: '', kategori: categories[0].id, keahlian: '', tarif: '', lokasi: '', pesan: '' }
  )
  const [sent, setSent] = useState(null)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const data = {
      id: Date.now(),
      type,
      ...form,
      status: 'Menunggu Verifikasi',
      createdAt: new Date().toLocaleString('id-ID'),
    }
    const list = store.get('jasakita_partners', [])
    list.unshift(data)
    store.set('jasakita_partners', list)
    setSent(data)
  }

  const waText = () => {
    if (!sent) return ''
    const lines = isMitra
      ? [
          `*Pendaftaran Mitra (Sponsor)*`,
          `Usaha: ${sent.namaUsaha}`,
          `PIC: ${sent.pic}`,
          `WhatsApp: ${sent.wa}`,
          `Paket: ${sent.paket.toUpperCase()}`,
          `Pesan: ${sent.pesan || '-'}`,
        ]
      : [
          `*Pendaftaran Kontributor*`,
          `Nama: ${sent.nama}`,
          `WhatsApp: ${sent.wa}`,
          `Kategori: ${categories.find((c) => c.id === sent.kategori)?.name || sent.kategori}`,
          `Keahlian: ${sent.keahlian}`,
          `Tarif: ${sent.tarif || '-'}`,
          `Lokasi: ${sent.lokasi}`,
          `Pengalaman: ${sent.pesan || '-'}`,
        ]
    return encodeURIComponent(`${lines.join('\n')}\n\nDikirim dari aplikasi ${site.name}.`)
  }

  /* ---------- Sukses ---------- */
  if (sent) {
    return (
      <div className="empty">
        <span className="emoji" style={{ color: '#16a34a' }}><i className="fa-solid fa-circle-check" /></span>
        <b>Pendaftaran terkirim!</b>
        <p style={{ marginTop: 8 }}>
          Pendaftaran <b>{isMitra ? 'Mitra' : 'Kontributor'}</b> kamu sudah tersimpan dan
          sedang menunggu verifikasi admin.
        </p>
        <div style={{ marginTop: 18, display: 'grid', gap: 10 }}>
          <a
            className="btn btn-wa"
            style={{ textDecoration: 'none' }}
            href={phoneToWa(site.kontak.whatsapp) + '?text=' + waText()}
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-brands fa-whatsapp" /> Kirim ke Admin
          </a>
          <button className="btn btn-outline" onClick={() => nav('akun')}>Lihat di Akun</button>
          <button className="btn btn-primary" onClick={() => nav('home')}>Ke Beranda</button>
        </div>
      </div>
    )
  }

  /* ---------- Form ---------- */
  return (
    <>
      <div className="topbar">
        <button className="back-btn" onClick={() => nav('akun')}>
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1>{cfg.title}</h1>
      </div>

      <div className="join-banner">
        <i className={cfg.icon} />
        <div>
          <b>{cfg.hdr}</b>
          <p>{cfg.sub}</p>
        </div>
      </div>

      <form onSubmit={submit}>
        {isMitra ? (
          <>
            <div className="form-group">
              <label>Nama Usaha *</label>
              <input required placeholder="cth: Toko Bangunan Sejahtera" value={form.namaUsaha} onChange={set('namaUsaha')} />
            </div>
            <div className="form-group">
              <label>Nama Penanggung Jawab *</label>
              <input required placeholder="cth: Budi Santoso" value={form.pic} onChange={set('pic')} />
            </div>
            <div className="form-group">
              <label>No. WhatsApp *</label>
              <input required type="tel" pattern="[0-9+ ]{9,16}" placeholder="cth: 0812xxxxxxx" value={form.wa} onChange={set('wa')} />
            </div>
            <div className="form-group">
              <label>Paket Sponsorship</label>
              <div className="paket-grid">
                {PAKET.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    className={'paket-card' + (form.paket === p.id ? ' on' : '')}
                    onClick={() => setForm({ ...form, paket: p.id })}
                  >
                    <b>{p.nama}</b>
                    <span>{'Rp ' + p.harga.toLocaleString('id-ID')}/bln</span>
                    <small>{p.benefit}</small>
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Pesan / Keterangan</label>
              <textarea placeholder="cth: ingin logo tampil di beranda selama 3 bulan" value={form.pesan} onChange={set('pesan')} />
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Nama Lengkap *</label>
              <input required placeholder="cth: Pak Joko" value={form.nama} onChange={set('nama')} />
            </div>
            <div className="form-group">
              <label>No. WhatsApp *</label>
              <input required type="tel" pattern="[0-9+ ]{9,16}" placeholder="cth: 0812xxxxxxx" value={form.wa} onChange={set('wa')} />
            </div>
            <div className="form-group">
              <label>Kategori Jasa *</label>
              <select value={form.kategori} onChange={set('kategori')}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Keahlian / Jasa yang Ditawarkan *</label>
              <input required placeholder="cth: Tukang Servis AC" value={form.keahlian} onChange={set('keahlian')} />
            </div>
            <div className="form-group">
              <label>Tarif (Rp)</label>
              <input type="number" min="0" step="5000" placeholder="cth: 100000" value={form.tarif} onChange={set('tarif')} />
            </div>
            <div className="form-group">
              <label>Lokasi *</label>
              <input required placeholder="cth: Jayapura" value={form.lokasi} onChange={set('lokasi')} />
            </div>
            <div className="form-group">
              <label>Pengalaman / Catatan</label>
              <textarea placeholder="cth: 5 tahun pengalaman, bisa panggil ke rumah" value={form.pesan} onChange={set('pesan')} />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary">
          <i className="fa-solid fa-paper-plane" /> Kirim Pendaftaran
        </button>
        <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 10, textAlign: 'center' }}>
          Pendaftaran akan diverifikasi admin sebelum ditampilkan.
        </p>
      </form>
    </>
  )
}