// Penyimpanan aman: localStorage kalau tersedia, kalau tidak
// (misal dibuka sebagai file:// di beberapa browser) pakai memori.
const mem = new Map()

export const store = {
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem(key)
      if (v === null) return mem.has(key) ? mem.get(key) : fallback
      return JSON.parse(v)
    } catch {
      return mem.has(key) ? mem.get(key) : fallback
    }
  },
  set(key, value) {
    mem.set(key, value)
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  },
  remove(key) {
    mem.delete(key)
    try {
      localStorage.removeItem(key)
    } catch {}
  },
}