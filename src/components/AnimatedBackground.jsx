/**
 * Background animasi: beberapa "blob" gradien lembut yang bergerak
 * perlahan di belakang konten. Murah secara GPU (hanya transform),
 * otomatis nonaktif kalau pengguna memilih "kurangi animasi".
 */
const BLOBS = [
  { color: '#0d9488', size: 320, top: '-8%', left: '-20%', dur: 24, delay: 0 },
  { color: '#6366f1', size: 280, top: '16%', left: '68%', dur: 30, delay: -7 },
  { color: '#f59e0b', size: 250, top: '52%', left: '-16%', dur: 34, delay: -14 },
  { color: '#ec4899', size: 270, top: '80%', left: '62%', dur: 27, delay: -20 },
  { color: '#22d3ee', size: 200, top: '36%', left: '30%', dur: 38, delay: -3 },
]

export default function AnimatedBackground() {
  return (
    <div className="bg-anim" aria-hidden="true">
      {BLOBS.map((b, i) => (
        <span
          key={i}
          className="bg-blob"
          style={{
            background: b.color,
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            animationDuration: b.dur + 's',
            animationDelay: b.delay + 's',
          }}
        />
      ))}
      <div className="bg-grain" />
    </div>
  )
}