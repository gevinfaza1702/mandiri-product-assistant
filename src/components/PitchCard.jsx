import { X, CheckCircle2, Quote } from 'lucide-react'

// Mode Pitch Card: satu layar penuh untuk diperlihatkan ke calon nasabah.
// Font besar, ringkas: highlight + 3 benefit teratas + syarat ringkas.
export default function PitchCard({ produk, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-navy to-navy-dark text-white">
      {/* Tombol tutup */}
      <button
        onClick={onClose}
        aria-label="Tutup pitch card"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition active:scale-90 safe-bottom"
      >
        <X size={22} />
      </button>

      <div className="flex flex-1 flex-col justify-center overflow-y-auto px-7 py-16">
        <span className="mb-3 inline-block w-fit rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy-dark">
          {produk.kategori}
        </span>

        <h1 className="text-3xl font-extrabold leading-tight">{produk.nama_produk}</h1>

        {/* Highlight — kalimat jualan utama, dibuat menonjol */}
        <div className="mt-5 flex gap-3 rounded-2xl bg-white/10 p-4">
          <Quote size={24} className="shrink-0 text-gold" />
          <p className="text-lg font-semibold leading-snug">{produk.highlight}</p>
        </div>

        {/* 3 benefit teratas */}
        <ul className="mt-6 space-y-3">
          {produk.benefit.slice(0, 3).map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-base">
              <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-gold" />
              <span className="font-medium">{b}</span>
            </li>
          ))}
        </ul>

        {/* Syarat ringkas */}
        {produk.syarat_utama.length > 0 && (
          <div className="mt-7 border-t border-white/15 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
              Syarat ringkas
            </p>
            <p className="mt-1 text-sm leading-relaxed text-white/80">
              {produk.syarat_utama.slice(0, 3).join(' · ')}
            </p>
          </div>
        )}

        {produk.biaya_bunga && (
          <p className="mt-4 text-sm text-gold">{produk.biaya_bunga}</p>
        )}
      </div>

      <p className="pb-6 text-center text-xs text-white/40">
        Bank Mandiri · KCP Sunter Permai
      </p>
    </div>
  )
}
