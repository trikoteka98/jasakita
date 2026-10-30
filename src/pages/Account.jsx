import { useEffect, useState } from 'react'
import { site } from '../data/site.js'
import { phoneToWa } from '../data/providers.js'
import { THEMES } from '../lib/theme.js'
import { sponsorSlots, paketSponsor, openSlots, formatRupiah } from '../data/sponsors.js'
import { store } from '../lib/storage.js'

const menuStyle = { marginRight: 12, width: 18, textAlign: 'center' }

export default function Account({ nav, theme, setTheme }) {
  const [pendaftaran, setPendaftaran] = useState([])

  useEffect(() => {
    try {
      setPendaftaran(store.get('jasakita_partners', []))
    } catch {}
  }, [])

  const hapus = (id) => {
    const next = pendaftaran.filter((p) => p.id !== id)
    setPendaftaran(next)
    store.set('jasakita_partners', next)
  }

  const bagikan = async () => {
    const data = { title: site.name, text: site.tagline, url: location.href }
    if (navigator.share) {
      try { await navigator.share(data) } catch {}
    } else {
      try { await navigator.clipboard.writeText(location.href) } catch {}
      alert('Tautan aplikasi disalin ke clipboard.')
    }
  }

  return (
    <>
      {/* ---------- Header akun ---------- */}
      <div className="acct-header">
        <div className="acct-avatar">
          <i className="fa-solid fa-circle-user" />
        </div>
        <div>
          <h1>Akun Saya</h1>
          <p>Pengaturan, mitra & kontributor</p>
        </div>
      </div>

      {/* ---------- Tema ---------- */}
      <div className="card">
        <h3><i className="fa-solid fa-palette" style={menuStyle} /> Tema Tampilan</h3>
        <p style={{ marginBottom: 10 }}>Pilih tampilan terang, gelap, atau ikuti pengaturan HP.</p>
        <div className="theme-seg">
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={'theme-btn' + (theme === t.id ? ' on' : '')}
              onClick={() => setTheme(t.id)}
            >
              <i className={t.icon} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- Mitra & Kontributor ---------- */}
      <div className="section">
        <div className="section-title">Gabung Bersama Kami</div>

        <div className="join-card join-mitra">
          <div className="join-head">
            <span className="join-icon"><i className="fa-solid fa-handshake-angle" /></span>
            <div>
              <h3>Mitra <span className="join-tag">Sponsor</span></h3>
              <p>Dukung platform & tampilkan usahamu sebagai sponsor.</p>
            </div>
          </div>
          <ul className="join-list">
            <li>Logo & nama usaha tampil sebagai sponsor</li>
            <li>Prioritas tampil di halaman beranda</li>
            <li>Cocok untuk usaha yang ingin dikenal lebih luas</li>
          </ul>
          <button className="btn btn-primary" onClick={() => nav('mitra')}>
            <i className="fa-solid fa-plus" /> Daftar jadi Mitra
          </button>
        </div>

        <div className="join-card join-kontributor">
          <div className="join-head">
            <span className="join-icon"><i className="fa-solid fa-briefcase" /></span>
            <div>
              <h3>Kontributor <span className="join-tag">Penyedia Jasa</span></h3>
              <p>Bersedia menawarkan jasamu & menerima pesanan.</p>
            </div>
          </div>
          <ul className="join-list">
            <li>Profilmu masuk ke katalog penyedia</li>
            <li>Terima pesanan langsung ke WhatsApp</li>
            <li>Atur sendiri tarif & jam kerja</li>
          </ul>
          <button className="btn btn-primary" onClick={() => nav('kontributor')}>
            <i className="fa-solid fa-plus" /> Daftar jadi Kontributor
          </button>
        </div>
      </div>

      {/* ---------- Slot sponsor ---------- */}
      <div className="section">
        <div className="section-title">
          Slot Sponsor
          <span className="count-pill">{openSlots().length} tersedia</span>
        </div>
        <p className="section-sub">
          Tempat tampilan di aplikasi yang bisa diisi mitra sponsor.
        </p>
        <div className="slot-list">
          {sponsorSlots.map((sl) => (
            <div key={sl.id} className={'slot-row' + (sl.sponsorId ? ' filled' : '')}>
              <span className="slot-dot" />
              <div className="slot-meta">
                <b>{sl.nama}</b>
                <small>{sl.tempat} · {sl.ukuran}</small>
              </div>
              <span className={'slot-level lvl-' + sl.level.toLowerCase()}>{sl.level}</span>
              <span className={'slot-state' + (sl.sponsorId ? ' on' : '')}>
                {sl.sponsorId ? 'Terisi' : 'Kosong'}
              </span>
            </div>
          ))}
        </div>

        <div className="paket-list">
          {paketSponsor.map((p) => (
            <div key={p.id} className="paket-row">
              <div>
                <b>Paket {p.nama}</b>
                <p>{p.benefit}</p>
              </div>
              <span className="paket-price">{formatRupiah(p.harga)}<small>/bln</small></span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Status pendaftaran ---------- */}
      {pendaftaran.length > 0 && (
        <div className="section">
          <div className="section-title">Pendaftaran Saya <span className="count-pill">{pendaftaran.length}</span></div>
          {pendaftaran.map((p) => (
            <div key={p.id} className="order-card">
              <span className="status">{p.status}</span>
              <h4>
                {p.type === 'mitra' ? 'Mitra — ' : 'Kontributor — '}
                {p.type === 'mitra' ? p.namaUsaha : p.nama}
              </h4>
              <p>
                {p.type === 'mitra' ? `Paket: ${p.paket}` : `Keahlian: ${p.keahlian}`}
                <br />
                <i className="fa-solid fa-phone" style={{ marginRight: 6 }} />{p.wa}
                <br />
                <i className="fa-solid fa-clock" style={{ marginRight: 6 }} />Diajukan {p.createdAt}
              </p>
              <button
                className="btn btn-outline"
                style={{ marginTop: 10, padding: '8px', fontSize: '0.78rem' }}
                onClick={() => hapus(p.id)}
              >
                Batalkan Pendaftaran
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ---------- Menu lainnya ---------- */}
      <div className="section">
        <div className="section-title">Lainnya</div>
        <div className="menu-card">
          <button className="menu-item" onClick={() => nav('about')}>
            <i className="fa-solid fa-circle-info" style={menuStyle} />
            <span>Tentang JasaKita</span>
            <i className="fa-solid fa-chevron-right menu-arrow" />
          </button>
          <button className="menu-item" onClick={bagikan}>
            <i className="fa-solid fa-share-nodes" style={menuStyle} />
            <span>Bagikan aplikasi</span>
            <i className="fa-solid fa-chevron-right menu-arrow" />
          </button>
          <a
            className="menu-item"
            href={phoneToWa(site.kontak.whatsapp)}
            target="_blank"
            rel="noreferrer"
          >
            <i className="fa-brands fa-whatsapp" style={menuStyle} />
            <span>Hubungi admin</span>
            <i className="fa-solid fa-chevron-right menu-arrow" />
          </a>
        </div>
      </div>

      <p className="acct-footer">JasaKita v1.0 · dibuat dengan React</p>
    </>
  )
}