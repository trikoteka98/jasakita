import { useState } from 'react'
import { formatRupiah } from '../data/providers.js'
import { store } from '../lib/storage.js'

const iconStyle = { marginRight: 6 }

export default function Orders({ nav }) {
  const [orders, setOrders] = useState(() =>
    store.get('jasakita_orders', [])
  )

  const hapus = (id) => {
    const next = orders.filter((o) => o.id !== id)
    setOrders(next)
    store.set('jasakita_orders', next)
  }

  return (
    <>
      <div className="topbar">
        <button className="back-btn" onClick={() => nav('home')}>
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1>Pesanan Saya</h1>
      </div>

      {orders.length === 0 ? (
        <div className="empty">
          <span className="emoji">🧾</span>
          Belum ada pesanan.
          <br />
          Yuk pilih jasa dari katalog!
          <br />
          <button className="btn btn-primary" style={{ marginTop: 16, maxWidth: 220 }} onClick={() => nav('catalog')}>
            Lihat Katalog
          </button>
        </div>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="order-card">
            <span className="status">{o.status}</span>
            <h4>{o.skill} — {o.provider}</h4>
            <p>
              <b>{o.nama}</b> · {o.hp}
              <br />
              <i className="fa-solid fa-calendar-day" style={iconStyle} />{o.tanggal || 'sesuai kesepakatan'}
              {o.catatan ? <><br /><i className="fa-solid fa-comment" style={iconStyle} />{o.catatan}</> : null}
              <br />
              <i className="fa-solid fa-money-bill" style={iconStyle} />{formatRupiah(o.price)} / {o.unit}
            </p>
            <button
              className="btn btn-outline"
              style={{ marginTop: 10, padding: '8px', fontSize: '0.8rem' }}
              onClick={() => hapus(o.id)}
            >
              Hapus Pesanan
            </button>
          </div>
        ))
      )}
    </>
  )
}
