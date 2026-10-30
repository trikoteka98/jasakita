import { useEffect, useRef, useState } from 'react'

/** Angka yang berhitung naik saat pertama tampil. */
export default function CountUp({ to = 0, duration = 900, decimals = 0, suffix = '', prefix = '' }) {
  const [val, setVal] = useState(0)
  const raf = useRef(0)

  useEffect(() => {
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)
      setVal(to * eased)
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [to, duration])

  const text =
    decimals > 0
      ? val.toFixed(decimals)
      : Math.round(val).toLocaleString('id-ID')

  return <>{prefix}{text}{suffix}</>
}