import { getSlot, slotSponsor, sponsors } from '../data/sponsors.js'
import { phoneToWa } from '../data/providers.js'

/**
 * Slot tampilan untuk sponsor.
 * - Kalau slot sudah diisi sponsor -> tampilkan kartu sponsor.
 * - Kalau masih kosong -> tampilkan placeholder "Slot Sponsor Tersedia".
 */
export default function SponsorSlot({ slotId, nav, variant = 'banner' }) {
  const slot = getSlot(slotId)
  if (!slot) return null
  const sp = slotSponsor(slotId)

  /* ---------- Slot masih kosong ---------- */
  if (!sp) {
    return (
      <div
        className={'sponsor-slot empty-slot' + (variant === 'compact' ? ' compact' : '')}
        data-slot={slotId}
        data-state="open"
      >
        <div className="slot-shimmer" />
        <div className="slot-body">
          <span className="slot-badge"><i className="fa-solid fa-bullhorn" /> Slot Sponsor</span>
          <b>{slot.nama}</b>
          <p>
            Tempat ini tersedia untuk mitra · {slot.ukuran} · paket {slot.level}
          </p>
          <button className="btn slot-btn" onClick={() => nav && nav('mitra')}>
            <i className="fa-solid fa-plus" /> Isi Slot Ini
          </button>
        </div>
      </div>
    )
  }

  /* ---------- Slot sudah diisi sponsor ---------- */
  return (
    <div className="sponsor-slot filled-slot" data-slot={slotId} data-state="filled">
      <span className="sponsor-label"><i className="fa-solid fa-star" /> Sponsor</span>
      <div className="sponsor-row">
        <div className="sponsor-logo" style={{ background: sp.warna }}>
          {sp.inisial}
        </div>
        <div className="sponsor-info">
          <b>{sp.nama}</b>
          <p>{sp.tagline}</p>
          <small><i className="fa-solid fa-location-dot" /> {sp.kota} · Paket {sp.level}</small>
        </div>
        <a
          className="sponsor-cta"
          href={phoneToWa(sp.whatsapp)}
          target="_blank"
          rel="noreferrer"
        >
          <i className="fa-brands fa-whatsapp" />
        </a>
      </div>
    </div>
  )
}

/** Strip "Didukung oleh" — logo sponsor berjalan (marquee). */
export function SponsorStrip({ nav }) {
  const list = sponsors.length ? sponsors : []
  return (
    <div className="sponsor-strip">
      <div className="sponsor-strip-head">
        <span><i className="fa-solid fa-handshake" /> Didukung oleh</span>
        <button className="link-btn" onClick={() => nav && nav('mitra')}>
          Jadi sponsor <i className="fa-solid fa-chevron-right" />
        </button>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {list.length === 0 && (
            <div className="marquee-item slot-open">
              <i className="fa-solid fa-plus" /> Slot logo tersedia
            </div>
          )}
          {[...list, ...list].map((s, i) => (
            <div className="marquee-item" key={s.id + '-' + i} title={s.nama}>
              <span className="marquee-logo" style={{ background: s.warna }}>{s.inisial}</span>
              <span className="marquee-name">{s.nama}</span>
            </div>
          ))}
          <button className="marquee-item marquee-cta" onClick={() => nav && nav('mitra')}>
            <i className="fa-solid fa-plus" /> Jadi Mitra
          </button>
        </div>
      </div>
    </div>
  )
}