const items = [
  { name: 'home', label: 'Beranda', icon: 'fa-solid fa-house' },
  { name: 'catalog', label: 'Katalog', icon: 'fa-solid fa-list-check' },
  { name: 'orders', label: 'Pesanan', icon: 'fa-solid fa-receipt' },
  { name: 'akun', label: 'Akun', icon: 'fa-solid fa-circle-user' },
]

export default function BottomNav({ nav, current }) {
  return (
    <nav className="bottom-nav">
      {items.map((it) => (
        <button
          key={it.name}
          className={'nav-item' + (current === it.name ? ' active' : '')}
          onClick={() => nav(it.name)}
        >
          <i className={'ico ' + it.icon} />
          {it.label}
        </button>
      ))}
    </nav>
  )
}