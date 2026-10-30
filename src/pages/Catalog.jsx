import { useMemo, useState } from 'react'
import { categories, providers, districts, getCategory } from '../data/providers.js'
import { catalogImage } from '../data/images.js'
import ProviderCard from '../components/ProviderCard.jsx'
import SponsorSlot from '../components/SponsorSlot.jsx'

export default function Catalog({ nav, categoryId }) {
  const [active, setActive] = useState(categoryId || 'semua')
  const [distrik, setDistrik] = useState('semua')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('rating')

  const list = useMemo(() => {
    let arr = active === 'semua' ? [...providers] : providers.filter((p) => p.category === active)
    if (distrik !== 'semua') arr = arr.filter((p) => p.coverage.includes(distrik))
    if (q.trim()) {
      const s = q.toLowerCase()
      arr = arr.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.skill.toLowerCase().includes(s) ||
          p.location.toLowerCase().includes(s) ||
          p.coverage.some((c) => c.toLowerCase().includes(s)) ||
          p.tags.some((t) => t.toLowerCase().includes(s))
      )
    }
    if (sort === 'rating') arr.sort((a, b) => b.rating - a.rating)
    if (sort === 'murah') arr.sort((a, b) => a.price - b.price)
    if (sort === 'mahal') arr.sort((a, b) => b.price - a.price)
    return arr
  }, [active, distrik, q, sort])

  const title = active === 'semua' ? 'Semua Penyedia' : getCategory(active)?.name

  return (
    <>
      {/* Banner dengan gambar */}
      <div className="page-banner" style={{ backgroundImage: `url(${catalogImage})` }}>
        <div className="page-banner-shade" />
        <div className="page-banner-body">
          <button className="back-btn ghost" onClick={() => nav('home')}>
            <i className="fa-solid fa-arrow-left" />
          </button>
          <div>
            <h1>Katalog Jasa</h1>
            <p>Kota Jayapura · {providers.length} penyedia</p>
          </div>
        </div>
      </div>

      {/* Pencarian */}
      <div className="search-wrap">
        <i className="fa-solid fa-magnifying-glass" />
        <input
          placeholder="Cari jasa, nama, atau distrik…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {q && (
          <button className="search-clear" onClick={() => setQ('')}>
            <i className="fa-solid fa-xmark" />
          </button>
        )}
      </div>

      {/* Slot sponsor katalog */}
      <SponsorSlot slotId="catalog-banner" nav={nav} variant="compact" />

      {/* Filter kategori */}
      <div className="filter-label"><i className="fa-solid fa-layer-group" /> Kategori</div>
      <div className="chips scroll-x">
        <button className="chip" style={active === 'semua' ? chipOn : undefined} onClick={() => setActive('semua')}>
          Semua
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className="chip"
            style={active === c.id ? { ...chipOn, background: c.color, borderColor: c.color } : undefined}
            onClick={() => setActive(c.id)}
          >
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      {/* Filter cakupan wilayah */}
      <div className="filter-label"><i className="fa-solid fa-map-location-dot" /> Cakupan wilayah</div>
      <div className="chips scroll-x">
        <button className="chip" style={distrik === 'semua' ? chipOn : undefined} onClick={() => setDistrik('semua')}>
          Semua distrik
        </button>
        {districts.map((d) => (
          <button
            key={d}
            className="chip"
            style={distrik === d ? chipOn : undefined}
            onClick={() => setDistrik(d)}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Urutkan */}
      <div className="sort-row">
        <span className="sort-label"><i className="fa-solid fa-arrow-down-wide-short" /> Urutkan:</span>
        {[
          ['rating', 'Rating'],
          ['murah', 'Termurah'],
          ['mahal', 'Termahal'],
        ].map(([k, label]) => (
          <button key={k} className={'sort-btn' + (sort === k ? ' on' : '')} onClick={() => setSort(k)}>
            {label}
          </button>
        ))}
      </div>

      {/* Hasil */}
      <div className="section">
        <div className="section-title">
          {title}
          <span className="count-pill"><i className="fa-solid fa-user-check" /> {list.length}</span>
        </div>
        {list.length === 0 ? (
          <div className="empty">
            <span className="emoji"><i className="fa-solid fa-magnifying-glass" /></span>
            Tidak ada penyedia yang cocok.
            <br />
            Coba kata kunci, kategori, atau distrik lain.
          </div>
        ) : (
          list.map((p, i) => (
            <ProviderCard key={p.id} provider={p} nav={nav} delay={Math.min(i, 8) * 45} />
          ))
        )}
      </div>
    </>
  )
}

const chipOn = {
  background: '#0d9488',
  color: '#fff',
  borderColor: '#0d9488',
}