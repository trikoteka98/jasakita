import { useState } from 'react'
import { getProvider, getCategory, formatRupiah, phoneToWa } from '../data/providers.js'
import { categoryImages } from '../data/images.js'
import { site } from '../data/site.js'
import SponsorSlot from '../components/SponsorSlot.jsx'

const avatarClasses = ['', 'gold', 'violet', 'rose', 'blue', 'slate']
const iconStyle = { marginRight: 8 }

export default function ProviderDetail({ nav, providerId }) {
  const [imgOk, setImgOk] = useState(true)
  const p = getProvider(providerId)

  if (!p) {
    return (
      <div className="empty">
        <span className="emoji"><i className="fa-solid fa-user-slash" /></span>
        Penyedia tidak ditemukan.
        <br />
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => nav('catalog')}>
          Kembali ke Katalog
        </button>
      </div>
    )
  }

  const cat = getCategory(p.category)
  const initials = p.name
    .replace(/(Pak|Ibu|Bpk|Bang|Mas|Mbak|Kak|Sdr|Bpk\.)\s*/i, '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const colorIdx =
    p.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % avatarClasses.length

  const waMsg = encodeURIComponent(
    `Halo ${p.name}, saya ingin bertanya tentang jasa ${p.skill} yang ada di ${site.name}.`
  )

  return (
    <>
      <div className="topbar">
        <button className="back-btn" onClick={() => nav('catalog', { categoryId: p.category })}>
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1>Detail Penyedia</h1>
      </div>

      {/* Cover gambar kategori */}
      <div
        className="detail-cover"
        style={{ backgroundImage: `url(${categoryImages[p.category]})` }}
      >
        <div className="detail-cover-shade" />
      </div>

      <div className="detail-header animate__animated animate__fadeInUp">
        {imgOk && p.photo ? (
          <img
            className="avatar avatar-photo"
            src={p.photo}
            alt={p.name}
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className={'avatar ' + avatarClasses[colorIdx]}>{initials}</div>
        )}
        <h2>{p.name}</h2>
        <div className="skill">{p.skill}</div>
        <div className="stats">
          <span><b><i className="fa-solid fa-star" style={{ color: '#f59e0b' }} /> {p.rating}</b> rating</span>
          <span><b>{p.orders}</b> pesanan</span>
          <span><b>{formatRupiah(p.price)}</b> {p.unit}</span>
        </div>
      </div>

      <div className="card">
        <h3><i className="fa-solid fa-address-card" style={iconStyle} /> Tentang</h3>
        <p>{p.desc}</p>
        <div className="chips" style={{ marginBottom: 0, marginTop: 10 }}>
          {p.tags.map((t) => (
            <span key={t} className="chip"># {t}</span>
          ))}
        </div>
      </div>

      <div className="card">
        <h3><i className="fa-solid fa-circle-info" style={iconStyle} /> Informasi</h3>
        <div className="info-line"><span>Kategori</span><span>{cat ? cat.emoji + ' ' + cat.name : '-'}</span></div>
        <div className="info-line"><span>Domisili</span><span><i className="fa-solid fa-location-dot" style={iconStyle} /> {p.location}</span></div>
        <div className="info-line"><span>Jam kerja</span><span><i className="fa-solid fa-clock" style={iconStyle} /> {p.hours}</span></div>
        <div className="info-line"><span>Tarif</span><span><i className="fa-solid fa-tag" style={iconStyle} /> {formatRupiah(p.price)} / {p.unit}</span></div>
      </div>

      {/* Cakupan wilayah */}
      <div className="card coverage-card">
        <h3><i className="fa-solid fa-map-location-dot" style={iconStyle} /> Cakupan Wilayah
          <span className="count-pill" style={{ marginLeft: 'auto' }}>{p.coverage.length} distrik</span>
        </h3>
        <p>Penyedia ini bersedia melayani pesanan di distrik berikut:</p>
        <div className="chips" style={{ marginBottom: 0, marginTop: 10 }}>
          {p.coverage.map((d) => (
            <span key={d} className="chip chip-coverage">
              <i className="fa-solid fa-location-dot" /> {d}
            </span>
          ))}
        </div>
      </div>

      {/* Slot sponsor */}
      <SponsorSlot slotId="detail-card" nav={nav} variant="compact" />

      <div className="btn-row">
        <a
          href={phoneToWa(p.phone) + '?text=' + waMsg}
          target="_blank"
          rel="noreferrer"
          className="btn btn-wa"
          style={{ textDecoration: 'none', flex: 1 }}
        >
          <i className="fa-brands fa-whatsapp" /> WhatsApp
        </a>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => nav('booking', { providerId: p.id })}>
          <i className="fa-solid fa-calendar-check" /> Pesan
        </button>
      </div>
    </>
  )
}