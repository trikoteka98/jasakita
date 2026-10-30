// ============================================================
// TEMA: terang / gelap / ikuti sistem
// Disimpan di localStorage dan diterapkan ke <html data-theme="...">
// ============================================================

const KEY = 'jasakita_theme'

export const THEMES = [
  { id: 'light', label: 'Terang', icon: 'fa-solid fa-sun' },
  { id: 'dark', label: 'Gelap', icon: 'fa-solid fa-moon' },
  { id: 'system', label: 'Sistem', icon: 'fa-solid fa-circle-half-stroke' },
]

export function getStoredTheme() {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {}
  return 'system'
}

export function resolveTheme(pref) {
  if (pref === 'light' || pref === 'dark') return pref
  const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')
  return mq && mq.matches ? 'dark' : 'light'
}

export function applyTheme(pref) {
  const resolved = resolveTheme(pref)
  document.documentElement.setAttribute('data-theme', resolved)
  document.documentElement.style.colorScheme = resolved
  // warnai address bar browser mengikuti tema
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', resolved === 'dark' ? '#0b1220' : '#0d9488')
  return resolved
}

export function saveTheme(pref) {
  try {
    localStorage.setItem(KEY, pref)
  } catch {}
}