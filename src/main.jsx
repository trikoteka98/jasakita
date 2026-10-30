import React from 'react'
import { createRoot } from 'react-dom/client'

// Ikon & animasi dari paket lokal (tanpa CDN)
// fontawesome.min.css = aturan dasar + definisi glyph semua ikon (WAJIB)
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import '@fortawesome/fontawesome-free/css/solid.min.css'
import '@fortawesome/fontawesome-free/css/brands.min.css'
import 'animate.css/animate.min.css'

import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Service worker hanya didaftarkan saat aplikasi disajikan lewat http(s),
// bukan saat dibuka sebagai file tunggal (file://).
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {})
  })
}