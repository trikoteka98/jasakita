import { useState } from 'react'
import { formatRupiah } from '../data/providers.js'

const avatarColors = ['', 'gold', 'violet', 'rose', 'blue', 'slate']

function initialsOf(name) {
  return name
    .replace(/(Pak|Ibu|Bpk|Bang|Mas|Mbak|Kak|Sdr|Bpk\.)\s*/i, '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function ProviderCard({ provider, nav, delay = 0 }) {
  const [imgOk, setImgOk] = useState(true)
  const colorIdx =
    provider.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) %
    avatarColors.length

  return (
    <div
      className="provider-card animate__animated animate__fadeInUp"
      style={{ animationDelay: delay + 'ms' }}
      onClick={() => nav('detail', { providerId: provider.id })}
    >
      <div className="provider-top">
        {imgOk && provider.photo ? (
          <img
            className="avatar avatar-photo"
            src={provider.photo}
            alt={provider.name}
            loading="lazy"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className={'avatar ' + avatarColors[colorIdx]}>{initialsOf(provider.name)}</div>
        )}

        <div className="info">
          <h3>{provider.name}</h3>
          <div className="skill">{provider.skill}</div>
          <div className="meta">
            <span className="rating"><i className="fa-solid fa-star" /> {provider.rating}</span>
            <span><i className="fa-solid fa-location-dot" /> {provider.location}</span>
            <span><i className="fa-solid fa-briefcase" /> {provider.orders}</span>
          </div>
          <div className="coverage-line">
            <i className="fa-solid fa-map-location-dot" />
            {provider.coverage.join(' · ')}
          </div>
        </div>

        <div className="price">
          {formatRupiah(provider.price)}
          <br />
          <span className="price-unit">{provider.unit}</span>
        </div>
      </div>
    </div>
  )
}
