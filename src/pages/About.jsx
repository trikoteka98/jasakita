import { site } from '../data/site.js'
import { phoneToWa } from '../data/providers.js'
import { aboutImage } from '../data/images.js'

const iconStyle = { marginRight: 8 }

export default function About({ nav }) {
  return (
    <>
      <div className="topbar">
        <button className="back-btn" onClick={() => nav('home')}><i className="fa-solid fa-arrow-left" /></button>
        <h1>Tentang</h1>
      </div>

      <div className="page-banner" style={{ backgroundImage: `url(${aboutImage})`, minHeight: 150 }}>
        <div className="page-banner-shade" />
        <div className="page-banner-body" style={{ flexDirection: 'column', textAlign: 'center', justifyContent: 'center' }}>
          <div className="about-logo" style={{ margin: '0 auto 8px', width: 62, height: 62, fontSize: 1.6 + 'rem', borderRadius: 18 }}>{site.name[0]}</div>
          <h1>{site.name}</h1>
          <p>{site.tagline}</p>
        </div>
      </div>

      <div className="card about-card">
        <h3><i className="fa-solid fa-building" style={iconStyle} /> Tentang Kami</h3>
        <p>{site.about}</p>
      </div>

      <div className="card about-card">
        <h3><i className="fa-solid fa-bullseye" style={iconStyle} /> Misi Kami</h3>
        <ul>
          {site.misi.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>

      <div className="card about-card">
        <h3><i className="fa-solid fa-telescope" style={iconStyle} /> Visi Kami</h3>
        <p>{site.visi}</p>
      </div>

      <div className="card">
        <h3><i className="fa-solid fa-headset" style={iconStyle} /> Hubungi Kami</h3>
        <div className="info-line"><span>Alamat</span><span><i className="fa-solid fa-location-dot" style={iconStyle} /> {site.kontak.alamat}</span></div>
        <div className="info-line"><span>Jam buka</span><span><i className="fa-solid fa-clock" style={iconStyle} /> {site.kontak.jamBuka}</span></div>
        <div className="info-line"><span>Email</span><span><i className="fa-solid fa-envelope" style={iconStyle} /> {site.kontak.email}</span></div>
        <a
          href={phoneToWa(site.kontak.whatsapp)}
          target="_blank"
          rel="noreferrer"
          className="btn btn-wa"
          style={{ textDecoration: 'none', marginTop: 12 }}
        >
          <i className="fa-brands fa-whatsapp" /> Chat Admin
        </a>
      </div>
    </>
  )
}
