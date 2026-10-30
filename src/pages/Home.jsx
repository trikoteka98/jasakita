import { categories, providers } from '../data/providers.js'
import { site } from '../data/site.js'
import { heroImage, categoryImages } from '../data/images.js'
import ProviderCard from '../components/ProviderCard.jsx'
import SponsorSlot, { SponsorStrip } from '../components/SponsorSlot.jsx'
import CountUp from '../components/CountUp.jsx'

export default function Home({ nav }) {
  const unggulan = [...providers].sort((a, b) => b.rating - a.rating).slice(0, 4)

  return (
    <>
      {/* ---------- HERO ---------- */}
      <div className="hero hero-image animate__animated animate__fadeIn">
        <div className="hero-bg" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="hero-overlay" />
        <div className="hero-body">
          <span className="hero-badge pulse-soft">
            <i className="fa-solid fa-location-dot" /> {site.kota}, {site.provinsi}
          </span>
          <h2 className="animate__animated animate__fadeInUp">
            Butuh Jasa Apa Hari Ini?
          </h2>
          <p className="animate__animated animate__fadeInUp" style={{ animationDelay: '90ms' }}>
            {providers.length} penyedia terverifikasi siap melayani 5 distrik Kota Jayapura.
          </p>
          <div className="hero-actions">
            <button className="btn btn-light" onClick={() => nav('catalog')}>
              <i className="fa-solid fa-magnifying-glass" /> Jelajahi Katalog
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Slot sponsor utama ---------- */}
      <SponsorSlot slotId="hero-banner" nav={nav} />

      {/* ---------- Statistik (angka berjalan) ---------- */}
      <div className="stat-row animate__animated animate__fadeInUp">
        <div className="stat-box">
          <b><CountUp to={providers.length} /></b>
          <span>Penyedia</span>
        </div>
        <div className="stat-box">
          <b><CountUp to={categories.length} /></b>
          <span>Kategori</span>
        </div>
        <div className="stat-box">
          <b><CountUp to={4.8} decimals={1} /></b>
          <span>Rating</span>
        </div>
      </div>

      {/* ---------- Kategori ---------- */}
      <div className="section">
        <div className="section-title">
          Pilih Kategori Jasa
          <a href="#" onClick={(e) => { e.preventDefault(); nav('catalog') }}>Semua →</a>
        </div>
        <div className="cat-grid">
          {categories.map((c, i) => (
            <div
              key={c.id}
              className="cat-card cat-card-img animate__animated animate__zoomIn"
              style={{ animationDelay: i * 45 + 'ms', animationDuration: '0.4s' }}
              onClick={() => nav('catalog', { categoryId: c.id })}
            >
              <img
                className="cat-img"
                src={categoryImages[c.id]}
                alt={c.name}
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              <div className="cat-shade" style={{ background: `linear-gradient(160deg, ${c.color}dd, #0f172af2)` }} />
              <div className="cat-body">
                <span className="cat-emoji float-y">{c.emoji}</span>
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Didukung oleh (strip sponsor) ---------- */}
      <div className="section">
        <SponsorStrip nav={nav} />
      </div>

      {/* ---------- Penyedia unggulan ---------- */}
      <div className="section">
        <div className="section-title">
          Penyedia Terbaik
          <a href="#" onClick={(e) => { e.preventDefault(); nav('catalog') }}>Lihat semua →</a>
        </div>
        {unggulan.map((p, i) => (
          <ProviderCard key={p.id} provider={p} nav={nav} delay={i * 70} />
        ))}
      </div>

      {/* ---------- Cara pesan ---------- */}
      <div className="section">
        <div className="section-title">Cara Pesan</div>
        <div className="steps-card">
          <div className="step-item">
            <span className="step-num">1</span>
            <div><b>Pilih jasa</b><p>Pilih kategori & penyedia yang melayani distrikmu.</p></div>
          </div>
          <div className="step-item">
            <span className="step-num">2</span>
            <div><b>Isi formulir</b><p>Lengkapi nama, no. HP, alamat, dan jadwal.</p></div>
          </div>
          <div className="step-item">
            <span className="step-num">3</span>
            <div><b>Pesanan terkirim</b><p>Penyedia dihubungi via WhatsApp & pesanan tersimpan.</p></div>
          </div>
        </div>
      </div>

      <p className="home-footer">
        <i className="fa-solid fa-location-dot" /> Melayani Kota Jayapura — Jayapura Utara, Jayapura Selatan,
        Abepura, Heram, Muara Tami
      </p>
    </>
  )
}