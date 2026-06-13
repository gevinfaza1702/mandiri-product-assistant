import { Loader2 } from 'lucide-react'

// Indikator memuat sederhana yang dipusatkan.
export default function Loading({ teks = 'Memuat data produk…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-navy/50">
      <Loader2 size={32} className="animate-spin text-navy" />
      <p className="text-sm">{teks}</p>
    </div>
  )
}
