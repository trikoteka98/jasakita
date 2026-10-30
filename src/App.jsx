import { useEffect, useState } from 'react'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import ProviderDetail from './pages/ProviderDetail.jsx'
import Booking from './pages/Booking.jsx'
import Orders from './pages/Orders.jsx'
import Account from './pages/Account.jsx'
import Register from './pages/Register.jsx'
import About from './pages/About.jsx'
import BottomNav from './components/BottomNav.jsx'
import AnimatedBackground from './components/AnimatedBackground.jsx'
import { getStoredTheme, applyTheme, saveTheme } from './lib/theme.js'

// Navigasi sederhana berbasis state (tanpa react-router)
export default function App() {
  const [page, setPage] = useState({ name: 'home' })
  const [theme, setTheme] = useState(getStoredTheme)

  const nav = (name, params = {}) => {
    setPage({ name, params })
    window.scrollTo(0, 0)
  }

  // Terapkan & simpan tema
  useEffect(() => {
    applyTheme(theme)
    saveTheme(theme)
  }, [theme])

  // Kalau memilih "Sistem", ikuti perubahan tema OS secara langsung
  useEffect(() => {
    if (theme !== 'system' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('system')
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange)
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange)
    }
  }, [theme])

  useEffect(() => {
    document.title = 'JasaKita — Pemesanan Jasa'
  }, [page])

  const render = () => {
    switch (page.name) {
      case 'home':
        return <Home nav={nav} />
      case 'catalog':
        return <Catalog nav={nav} categoryId={page.params.categoryId} />
      case 'detail':
        return <ProviderDetail nav={nav} providerId={page.params.providerId} />
      case 'booking':
        return <Booking nav={nav} providerId={page.params.providerId} />
      case 'orders':
        return <Orders nav={nav} />
      case 'akun':
        return <Account nav={nav} theme={theme} setTheme={setTheme} />
      case 'mitra':
        return <Register nav={nav} type="mitra" />
      case 'kontributor':
        return <Register nav={nav} type="kontributor" />
      case 'about':
        return <About nav={nav} />
      default:
        return <Home nav={nav} />
    }
  }

  return (
    <div className="app">
      <AnimatedBackground />
      <main className="content">
        <div key={page.name} className="page-enter">
          {render()}
        </div>
      </main>
      <BottomNav nav={nav} current={page.name} />
    </div>
  )
}